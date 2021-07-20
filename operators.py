import bpy
from bpy.props import (
    StringProperty,
    IntProperty
)
from bpy.types import Operator
from bpy_extras.io_utils import ImportHelper


import os
from os import path as p

import json

import requests
from requests.models import MissingSchema

import sys

import time

from . import prefs
from .functions.payloadgen import generate_report


# TODO: Replace Addon Path with Addon name! Pass bl_info as Error Argument!
class SUPERADDONMANAGER_OT_check_for_updates(Operator):
    """Iterates through all installed Addons and checks for Updates"""
    bl_idname = "superaddonmanager.check_for_updates"
    bl_label = "Check for Updates"
    bl_options = {'REGISTER', 'UNDO'}

    def execute(self, context):
        self.updates = []
        self.unavailable_addons = []

        # Set the paths to all possible addon install locations.
        default_addons_path = p.join(bpy.utils.script_path_user(),
                                     "addons")
        custom_addons_path = p.join(str(bpy.utils.script_path_pref()),
                                    "scripts",
                                    "addons")

        # List all installed Addons.
        self.all_addons = []
        if p.exists(default_addons_path):
            self.all_addons = [p.join(default_addons_path, i)
                               for i in os.listdir(default_addons_path)]
        if p.exists(custom_addons_path):
            self.all_addons.extend([p.join(custom_addons_path, i)
                                    for i in os.listdir(custom_addons_path)])

        # Filter by enabled Addons.
        self.enabled_addons = [
            a for a in self.all_addons if p.basename(a) in context.preferences.addons]

        # Check for SAM Update. Abort, if an update for SAM is available.
        sam_install_location = p.dirname(__file__)
        self.check_update(sam_install_location)
        if len(self.updates) > 0:
            prefs.updates = self.updates
            prefs.unavailable_addons = self.unavailable_addons
            return {'FINISHED'}

        # Reset list of unavailable Addons to avoid duplicate issues (with SAM)
        self.unavailable_addons = []

        # Iterate through all directories and files in the Addons Folders.
        # Add single files to the list of addons that can't be updated by SAM.
        # Folders are sent to self.check_update() for the actual update check.
        for i in self.enabled_addons:
            addon_path = i

            if "name" in sys.modules[p.basename(addon_path)].bl_info:
                self.addon_name = sys.modules[p.basename(
                    addon_path)].bl_info["name"]
            else:
                replace = (("-master", ""),
                           ("-main", ""),
                           ("-", " "),
                           ("_", " "))
                # Extract a good looking addon name from a folder name.
                addon_name = p.basename(addon_path)
                for replace_obj, replace_with in replace:
                    addon_name = addon_name.replace(replace_obj, replace_with)
                self.addon_name = addon_name.capitalize()

            if p.isdir(addon_path):
                self.check_update(addon_path)
                continue

            self.unavailable_addons.append(
                {"issue_type": "sam_not_supported", "addon_name": self.addon_name, "addon_count": len(self.all_addons)})

        # Sort the lists of updates and unavailable addons to be ordered less random.
        self.updates.sort(key=lambda x: x[1], reverse=True)
        self.unavailable_addons.sort(
            key=lambda x: x["issue_type"], reverse=True)

        # Send both lists to the preferences.
        prefs.updates = self.updates
        prefs.unavailable_addons = self.unavailable_addons
        return {'FINISHED'}

    # Check the given Addons "bl_info" for information about the current
    # version and the URL for a version check. If "endpoint_url"
    # is available, a get request is sent to the Endpoint. If "endpoint_url"
    # is unavailable or some information in "bl_info" is corrupt, the addon
    # is added to self.unavailable_addons (Addons that can't be updated)
    def check_update(self, addon_path):
        addon_bl_info = sys.modules[p.basename(addon_path)].bl_info

        try:
            endpoint_url = addon_bl_info["endpoint_url"]
        except KeyError:
            self.unavailable_addons.append(
                {"issue_type": "sam_not_supported", "addon_name": self.addon_name, "addon_count": len(self.all_addons)})
            return  # Special Error

        # Try to get data from the endpoint.
        try:
            endpoint_data = requests.get(endpoint_url).text
        except MissingSchema:  # The URL is invalid.
            self.unavailable_addons.append(
                {"issue_type": "url_invalid", "addon_name": self.addon_name, "bl_info": addon_bl_info, "endpoint_url": endpoint_url})
            return  # Critical Error
        # Any other exception. Most likely, there's no Internet connection or the endpoint doesn't respond.
        except Exception as e:  # TODO: Bring in the Exception Message.
            print(e)
            self.unavailable_addons.append(
                {"issue_type": "endpoint_offline", "addon_name": self.addon_name, "endpoint_url": endpoint_url})
            return  # Critical Error

        # Try to convert the data to be helpful for the program.
        try:
            endpoint_data = json.loads(endpoint_data)
        except json.decoder.JSONDecodeError:
            self.unavailable_addons.append(
                {"issue_type": "invalid_endpoint", "addon_name": self.addon_name, "endpoint_url": endpoint_url})
            return  # Critical Error

        # Assign the version from bl_info to the variable current_version.
        try:
            current_version = self.format_versions(addon_bl_info["version"])
        except (KeyError, ValueError):
            self.unavailable_addons.append(
                {"issue_type": "bl_info_version_problems", "addon_name": self.addon_name, "bl_info": addon_bl_info})
            return  # Critical Error
        except IndexError:
            return  # TODO: Check, if this always happens, when there's no version in bl_info

        # Assign the version from the endpoint to the variable new_version.
        try:
            new_version = self.format_versions(endpoint_data["version"])
        except KeyError:
            self.unavailable_addons.append(
                {"issue_type": "endpoint_data_no_version", "addon_name": self.addon_name, "endpoint_url": endpoint_url})
            return  # Critical Error
        except ValueError:
            self.unavailable_addons.append(
                {"issue_type": "endpoint_data_invalid_version", "addon_name": self.addon_name, "endpoint_url": endpoint_url, "endpoint_version": endpoint_data["version"]})
            return  # Critical Error
        except IndexError:
            return  # TODO: Check, if this always happens, when there's no version in bl_info

        # Try to compare the versions specified in bl_info and the endpoint.
        self.compare_versions(addon_path, current_version,
                              new_version, addon_bl_info, endpoint_data)

    # Format a given version array into a tuple of integers.
    def format_versions(self, version_array):
        # Abort, if the version array is shorter than three items.
        if len(version_array) < 3:
            raise IndexError

        # Only Integers, Floats and String Numbers (e. g. "1")
        # should be converted to integers.
        allowed_types = [int, float, str]

        version = []
        for i in version_array:
            if not type(i) in allowed_types:
                raise ValueError
            version.append(int(i))
        return tuple(version)

    def compare_versions(self, addon_path, current_version, new_version, version_info, endpoint_data):
        for i in range(3):
            # Check if both versions are the same.
            if current_version[i] == new_version[i]:
                continue

            # Check if the current version is newer than the endpoint version.
            if current_version[i] > new_version[i]:
                # TODO: Is this issue really necessary?
                self.unavailable_addons.append(
                    {"issue_type": "current_version_greater", "addon_name": self.addon_name, "endpoint_url": version_info["endpoint_url"], "endpoint_version": new_version})
                return  # Addon can't be updated

            # Check if the endpoint version is newer than the current version
            if current_version[i] < new_version[i]:
                try:
                    automatic_download = endpoint_data["automatic_download"]
                except KeyError:
                    # self.unavailable_addons.append(
                    #     ["endpoint_data_no_download_method", addon_path, version_info["endpoint_url"]])
                    automatic_download = False  # Non critical Error.

                try:
                    download_url = endpoint_data["download_url"]
                except KeyError:
                    self.unavailable_addons.append(
                        {"issue_type": "endpoint_data_no_download_url", "addon_name": self.addon_name, "endpoint_url": version_info["endpoint_url"]})
                    return  # Critical Error

                # Add the Addon to one of the Update Arrays
                self.updates.append(
                    [addon_path, automatic_download, download_url, self.addon_name])

                return  # No need to further compare the versions.


# TODO: Automatic Update.
class SUPERADDONMANAGER_OT_automatic_update(Operator):
    """Update the addon automatically"""
    bl_idname = "superaddonmanager.automatic_update"
    bl_label = "Update"
    bl_options = {'REGISTER', 'UNDO'}

    addon_path: StringProperty(name="Addon Path")
    download_url: StringProperty(name="Download URL")

    def execute(self, context):
        bpy.ops.wm.url_open(url=self.download_url)

        return {'FINISHED'}


class SUPERADDONMANAGER_OT_manual_update(Operator):
    """Update the addon manually"""
    bl_idname = "superaddonmanager.manual_update"
    bl_label = "Update"
    bl_options = {'REGISTER', 'UNDO'}

    download_url: StringProperty(name="Download URL")

    def execute(self, context):
        bpy.ops.wm.url_open(url=self.download_url)

        return {'FINISHED'}


class SUPERADDONMANAGER_OT_update_all(Operator):
    """Update all addons, that have updates available."""
    bl_idname = "superaddonmanager.update_all"
    bl_label = "Update All"
    bl_options = {'REGISTER', 'UNDO'}

    # TODO: Progress bar!
    def execute(self, context):
        for addon in prefs.updates:
            if addon[1]:
                bpy.ops.superaddonmanager.automatic_update(
                    addon_path=addon[0], download_url=addon[2])
            else:
                bpy.ops.superaddonmanager.manual_update(download_url=addon[2])

        return {'FINISHED'}


class SUPERADDONMANAGER_OT_generate_issue_report(Operator):
    """Generate and save an issue report or feature request."""
    bl_idname = "superaddonmanager.generate_issue_report"
    bl_label = "Generate Issue Report"
    bl_options = {'REGISTER', 'UNDO'}

    addon_index: IntProperty()

    def execute(self, context):
        report_data = prefs.unavailable_addons[self.addon_index]

        bpy.ops.wm.url_open(url=generate_report(report_data))

        # time.sleep(1)  # Should we wait a second before removing the issue?

        prefs.unavailable_addons.pop(self.addon_index)

        return {'FINISHED'}


classes = (
    SUPERADDONMANAGER_OT_check_for_updates,
    SUPERADDONMANAGER_OT_automatic_update,
    SUPERADDONMANAGER_OT_manual_update,
    SUPERADDONMANAGER_OT_update_all,
    SUPERADDONMANAGER_OT_generate_issue_report
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)


def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
