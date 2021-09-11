import bpy
from bpy.props import (
    StringProperty,
    IntProperty,
    BoolProperty
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

import platform

import urllib
import urllib.parse

from . import prefs
from .objects.update_check import (
    UpdateCheck_v1_0_0
)
from .functions.json_functions import (
    encode_json,
    decode_json
)


class SUPERADDONMANAGER_OT_check_for_updates(Operator):
    """Iterates through all installed Addons and checks for Updates"""
    bl_idname = "superaddonmanager.check_for_updates"
    bl_label = "Check for Updates"
    bl_options = {'REGISTER', 'UNDO'}

    is_background_check: BoolProperty(default=False)

    def execute(self, context):
        self.report({"INFO"}, "SAM is checking for updates!")

        self.updates = []
        self.unavailable_addons = []
        prefs.addon_index = 0

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
        self.enabled_addons = []
        for addon in self.all_addons:
            if p.isfile(addon):  # Take care of single-file addons.
                addon = addon.replace(".py", "")

            if p.basename(addon) in context.preferences.addons:
                self.enabled_addons.append(addon)

        # Check for SAM Update. Abort, if an update for SAM is available.
        sam_install_location = p.dirname(__file__)
        self.addon_name = sys.modules[p.basename(
            sam_install_location)].bl_info["name"]
        self.check_update(sam_install_location)

        if self.updates:
            prefs.updates = self.updates
            prefs.unavailable_addons = self.unavailable_addons

            if self.is_background_check:
                bpy.ops.superaddonmanager.update_info("INVOKE_DEFAULT")
            return {'FINISHED'}

        # Reset list of unavailable Addons to avoid duplicate issues (with SAM)
        self.unavailable_addons = []

        # Setup the modal operation.
        prefs.addons_total = len(self.enabled_addons)
        prefs.checking_for_updates = True
        self._timer = context.window_manager.event_timer_add(
            0.01, window=context.window)
        context.window_manager.modal_handler_add(self)

        return {'RUNNING_MODAL'}

    # Iterate through all directories and files in the Addons Folders.
    # Add single files to the list of addons that can't be updated by SAM.
    # Folders are sent to self.check_update() for the actual update check.
    def modal(self, context, event):
        if event.type == "TIMER":
            if prefs.addon_index >= prefs.addons_total:
                # Sort the lists of updates and unavailable addons to be ordered less random.
                self.updates.sort(
                    key=lambda x: x["allow_automatic_download"], reverse=True)
                self.unavailable_addons.sort(
                    key=lambda x: x["issue_type"], reverse=True)

                # Send both lists to the preferences.
                prefs.updates = self.updates
                prefs.unavailable_addons = self.unavailable_addons

                context.window_manager.event_timer_remove(self._timer)
                prefs.checking_for_updates = False

                self._redraw()

                path = p.join(p.dirname(__file__), "updater_status.json")
                d = decode_json(path)
                d["last_check"] = int(time.time())
                encode_json(d, path)

                something_happened = bool(
                    self.unavailable_addons) or bool(self.updates)
                is_background_check = self.is_background_check
                if is_background_check and something_happened:
                    bpy.ops.superaddonmanager.update_info("INVOKE_DEFAULT")

                return {'FINISHED'}

            addon_path = self.enabled_addons[prefs.addon_index]
            prefs.addon_index += 1

            self._get_addon_name(addon_path)

            if p.isdir(addon_path):
                self.check_update(addon_path)

                self._redraw()

                return {"RUNNING_MODAL"}

            self.unavailable_addons.append(
                {"issue_type": "sam_not_supported",
                    "addon_name": self.addon_name,
                    "bl_info": sys.modules[p.basename(addon_path)].bl_info,
                    "addon_count": len(self.all_addons)})

        return {"RUNNING_MODAL"}

    def _redraw(self):
        # ATTENTION: This is not officially supported! See: https://docs.blender.org/api/current/info_gotcha.html
        try:
            bpy.ops.wm.redraw_timer(
                type='DRAW_WIN_SWAP', iterations=1)
        except Exception:
            pass

    # Get the name of the addon, that is beeing checked currently.
    def _get_addon_name(self, addon_path):
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

    # Check the given Addons "bl_info" for information about the current
    # version and the URL for a version check. If "endpoint_url"
    # is available, a get request is sent to the Endpoint. If "endpoint_url"
    # is unavailable or some information in "bl_info" is corrupt, the addon
    # is added to self.unavailable_addons (Addons that can't be updated)
    def check_update(self, addon_path):
        addon_bl_info = sys.modules[p.basename(addon_path)].bl_info

        if not "endpoint_url" in addon_bl_info.keys():
            self.unavailable_addons.append(
                {"issue_type": "sam_not_supported",
                 "addon_name": self.addon_name,
                 "bl_info": addon_bl_info,
                 "addon_count": len(self.all_addons)})
            return  # Special Error

        endpoint_url = addon_bl_info["endpoint_url"]

        # Try to get data from the endpoint.
        try:
            endpoint_data = requests.get(endpoint_url).text
        except MissingSchema:  # The URL is invalid.
            self.unavailable_addons.append(
                {"issue_type": "url_invalid", "addon_name": self.addon_name, "bl_info": addon_bl_info, "endpoint_url": endpoint_url})
            return  # Critical Error
        # Any other exception. Most likely, there's no Internet connection or the endpoint doesn't respond.
        except Exception as e:
            self.unavailable_addons.append(
                {"issue_type": "endpoint_offline",
                 "addon_name": self.addon_name,
                 "bl_info": addon_bl_info,
                 "error_message": str(e),
                 "endpoint_url": endpoint_url})
            return  # Critical Error

        # Try to convert the data to be helpful for the program.
        try:
            endpoint_data = json.loads(endpoint_data)
        except json.decoder.JSONDecodeError:
            self.unavailable_addons.append(
                {"issue_type": "invalid_endpoint",
                 "addon_name": self.addon_name,
                 "bl_info": addon_bl_info,
                 "endpoint_url": endpoint_url})
            return  # Critical Error

        if not "schema_version" in endpoint_data.keys():
            self.unavailable_addons.append(
                {"issue_type": "endpoint_invalid_schema",
                 "addon_name": self.addon_name,
                 "bl_info": addon_bl_info,
                 "endpoint_url": endpoint_url})
            return  # Critical Error

        # Check the schema of the endpoint data.
        if endpoint_data["schema_version"] == "super-addon-manager-version-info-1.0.0":
            update_check = UpdateCheck_v1_0_0(
                endpoint_data, self.addon_name, addon_bl_info, endpoint_url)
        else:
            self.unavailable_addons.append(
                {"issue_type": "endpoint_invalid_schema",
                 "addon_name": self.addon_name,
                 "bl_info": addon_bl_info,
                 "endpoint_url": endpoint_url})
            return  # Critical Error

        # Handle any error that occured inside the update check.
        if update_check.error:
            self.unavailable_addons.append(update_check.error_data)
            return  # Critical Error

        # Add the Addon to one of the Update Arrays.
        if update_check.update:
            self.updates.append({"addon_path": addon_path,
                                 "allow_automatic_download": update_check.automatic_download,
                                 "download_url": update_check.download_url,
                                 "addon_name": self.addon_name})


class SUPERADDONMANAGER_OT_update_info(Operator):
    """When a background check found updates or errors, this popup message shows up and notifies the user about that."""
    bl_idname = "superaddonmanager.update_info"
    bl_label = "Update Information"
    bl_options = {'REGISTER', 'UNDO'}

    def execute(self, context):
        bpy.ops.preferences.addon_show(module=__package__)
        return {"FINISHED"}

    def invoke(self, context, event):
        return context.window_manager.invoke_props_dialog(self)

    def draw(self, context):
        layout = self.layout

        layout.label(text="Super Addon Manager just checked for updates:")
        layout.label(
            text=f"{len(prefs.updates)} updates found.", icon="SHADERFX")
        layout.label(
            text=f"{len(prefs.unavailable_addons)} errors occured.", icon="ERROR")


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
    """Generate an issue report or feature request."""
    bl_idname = "superaddonmanager.generate_issue_report"
    bl_label = "Generate Issue Report"
    bl_options = {'REGISTER', 'UNDO'}

    addon_index: IntProperty()

    def execute(self, context):
        report_data = prefs.unavailable_addons[self.addon_index]

        bpy.ops.wm.url_open(url=self.generate_report(report_data))

        time.sleep(0.3)

        prefs.unavailable_addons.pop(self.addon_index)

        return {'FINISHED'}

    def generate_report(self, data):
        base_url = "http://localhost:3000/request-support?"

        issue_type = data["issue_type"]

        addon_version = "Unknown"
        if issue_type != "bl_info_version_problems" and "version" in data["bl_info"].keys():
            addon_version = ".".join(map(str, data["bl_info"]["version"]))

        url_params = {"issue_type": issue_type,
                      "addon_name": data["addon_name"],
                      "os_name": platform.system(),
                      "blender_version": bpy.app.version_string,
                      "addon_version": addon_version
                      }

        if "tracker_url" in data["bl_info"].keys():
            url_params["tracker_url"] = data["bl_info"]["tracker_url"]

        if issue_type in ["sam_not_supported"]:
            url_params["addon_count"] = data["addon_count"]

        if issue_type in ["url_invalid", "invalid_endpoint", "endpoint_invalid_schema", "endpoint_offline"]:
            url_params["endpoint_url"] = data["endpoint_url"]

        if issue_type == "endpoint_offline":
            url_params["error_message"] = data["error_message"]

        return base_url + urllib.parse.urlencode(url_params)


classes = (
    SUPERADDONMANAGER_OT_check_for_updates,
    SUPERADDONMANAGER_OT_update_info,
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
