import bpy
from bpy.props import (
    StringProperty,
)
from bpy.types import Operator

import os
from os import path as p

import json

import requests

import sys

from . import prefs


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

            if p.isdir(addon_path):
                self.check_update(addon_path)
                continue

            self.unavailable_addons.append(
                ["single_file", addon_path, len(self.all_addons)])

        # Sort the lists of updates and unavailable addons to be ordered less random.
        self.updates.sort(key=lambda x: x[1], reverse=True)
        self.unavailable_addons.sort(key=lambda x: x[0], reverse=True)

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
                ["sam_not_supported", addon_path, len(self.all_addons)])
            return  # Special Error

        # Try to get data from the endpoint.
        try:
            endpoint_data = requests.get(endpoint_url).text

        except TimeoutError:  # No Internet connection.
            self.unavailable_addons.append(
                ["endpoint_offline", addon_path, endpoint_url])
            return  # Critical Error
        except:  # Any other exception. Most likely, the URL is invalid.
            self.unavailable_addons.append(
                ["url_invalid", addon_path, endpoint_url])
            return  # Critical Error

        # Try to convert the data to be helpful for the program.
        try:
            endpoint_data = json.loads(endpoint_data)
        except json.decoder.JSONDecodeError:
            self.unavailable_addons.append(
                ["invalid_endpoint", addon_path, endpoint_url])
            return  # Critical Error

        # Assign the version from bl_info to the variable current_version.
        try:
            current_version = self.format_versions(addon_bl_info["version"])
        except KeyError:
            self.unavailable_addons.append(
                ["bl_info_no_version", addon_path])
            return  # Critical Error
        except ValueError:
            self.unavailable_addons.append(
                ["bl_info_invalid_version", addon_path, addon_bl_info["version"]])
            return  # Critical Error
        except IndexError:
            return  # TODO: Check, if this always happens, when there's no version in bl_info

        # Assign the version from the endpoint to the variable new_version.
        try:
            new_version = self.format_versions(endpoint_data["version"])
        except KeyError:
            self.unavailable_addons.append(
                ["endpoint_data_no_version", addon_path, endpoint_url])
            return  # Critical Error
        except ValueError:
            self.unavailable_addons.append(
                ["endpoint_data_invalid_version", addon_path, endpoint_url, endpoint_data["version"]])
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
                self.unavailable_addons.append(
                    ["current_version_greater", addon_path, version_info["endpoint_url"], new_version, current_version])
                return  # Addon can't be updated

            # Check if the endpoint version is newer than the current version
            if current_version[i] < new_version[i]:
                try:
                    automatic_download = endpoint_data["automatic_download"]
                except KeyError:
                    self.unavailable_addons.append(
                        ["endpoint_data_no_download_method", addon_path, version_info["endpoint_url"]])
                    automatic_download = False  # Non critical Error.

                try:
                    download_url = endpoint_data["download_url"]
                except KeyError:
                    self.unavailable_addons.append(
                        ["endpoint_data_no_download_url", addon_path, version_info["endpoint_url"]])
                    return  # Critical Error

                try:
                    display_name = version_info["name"]
                except KeyError:
                    self.unavailable_addons.append(
                        ["bl_info_no_name", addon_path])  # Non critical Error.
                    display_name = p.basename(addon_path)

                # Add the Addon to one of the Update Arrays
                self.updates.append(
                    [addon_path, automatic_download, download_url, display_name])

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


classes = (
    SUPERADDONMANAGER_OT_check_for_updates,
    SUPERADDONMANAGER_OT_automatic_update,
    SUPERADDONMANAGER_OT_manual_update
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)


def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
