# ##### BEGIN GPL LICENSE BLOCK #####
#
#  <A central Updater for all your Addons>
#    Copyright (C) <2021>  <Blender Defender>
#
#  This program is free software; you can redistribute it and/or
#  modify it under the terms of the GNU General Public License
#  as published by the Free Software Foundation; either version 3
#  of the License, or (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software Foundation,
#  Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
#
# ##### END GPL LICENSE BLOCK #####

import bpy
from bpy.props import (
    StringProperty,
    IntProperty,
    BoolProperty
)
from bpy.types import (
    Operator,
    Context,
    Event
)

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

import random

from . import prefs

from .issue_types import (
    BL_INFO_VERSION_PROBLEMS,
    DOWNLOAD_URL_OFFLINE,
    ENDPOINT_INVALID_SCHEMA,
    ENDPOINT_OFFLINE,
    INVALID_ENDPOINT,
    NOT_AN_ADDON,
    SAM_NOT_SUPPORTED,
    ENDPOINT_URL_INVALID,
    UNKNOWN_ERROR
)

from .objects.update_check import (
    UpdateCheck_v1_0_0
)
from .objects.updater import Updater
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

    # This is a latch. If the timer runs and this is False, it will start
    # checking the next addon at self.enabled_addons[prefs.addon_index]
    is_updating: bool = False

    def execute(self, context: Context):
        self.report({"INFO"}, "SAM is checking for updates!")

        self.updates = []
        self.unavailable_addons = []
        self.is_updating = False
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
        self.check_update(sam_install_location, False)

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
    def modal(self, context: Context, event: Event):
        if event.type == "TIMER":
            if not self.is_updating:
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
                    d = {} if d is None else d
                    if not "tests" in d.keys():
                        d["tests"] = {}

                    d["last_check"] = int(time.time())

                    # ! Test: Which icon is the best for the error buttons.
                    if not "icons" in d["tests"].keys():
                        d["tests"]["icons"] = random.randint(0, 4)
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
                    try:
                        self.check_update(addon_path)
                    except Exception as e:  # Unknown error that needs to be investigated.
                        self.unavailable_addons.append(
                            {"issue_type": UNKNOWN_ERROR,
                             "addon_name": self.addon_name,
                             "bl_info": sys.modules[p.basename(addon_path)].bl_info,
                             "error_message": str(e)})

                    self._redraw()

                else:
                    self.unavailable_addons.append(
                        {"issue_type": SAM_NOT_SUPPORTED,
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
        # Handle the case that the addon is not in sys.modules
        if not p.basename(addon_path) in sys.modules:
            print(
                f"WARNING: Unknown error with {addon_path}: Addon not in sys.modules")
            self.addon_name = ""
            return  # Unknown Error

        # Try to get the addon name from bl_info.
        if "name" in sys.modules[p.basename(addon_path)].bl_info:
            self.addon_name = sys.modules[p.basename(
                addon_path)].bl_info["name"]
        else:  # Extract the addon name from the folder name.
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
    def check_update(self, addon_path, auto_reload=True):
        self.is_updating = True  # Lock the latch

        # Handle the case, that the current addon is not in sys.modules.
        if not p.basename(addon_path) in sys.modules:
            print(
                f"WARNING: Unknown error with {addon_path}: Addon not in sys.modules")
            self.is_updating = False  # Open the latch
            return  # Unknown Error

        addon_bl_info = sys.modules[p.basename(addon_path)].bl_info

        if not "endpoint_url" in addon_bl_info.keys():
            self.unavailable_addons.append(
                {"issue_type": SAM_NOT_SUPPORTED,
                 "addon_name": self.addon_name,
                 "bl_info": addon_bl_info,
                 "addon_count": len(self.all_addons)})

            self.is_updating = False  # Open the latch
            return  # Special Error

        endpoint_url = addon_bl_info["endpoint_url"]

        # Try to get data from the endpoint.
        try:
            endpoint_data = requests.get(endpoint_url).text
        except MissingSchema:  # The URL is invalid.
            self.unavailable_addons.append(
                {"issue_type": ENDPOINT_URL_INVALID,
                 "addon_name": self.addon_name,
                 "bl_info": addon_bl_info,
                 "endpoint_url": endpoint_url})

            self.is_updating = False  # Open the latch
            return  # ! Critical Error

        # Any other exception. Most likely, there's no Internet connection or the endpoint doesn't respond.
        except Exception as e:
            self.unavailable_addons.append(
                {"issue_type": ENDPOINT_OFFLINE,
                 "addon_name": self.addon_name,
                 "bl_info": addon_bl_info,
                 "error_message": str(e),
                 "endpoint_url": endpoint_url})

            self.is_updating = False  # Open the latch
            return  # ! Critical Error

        # Try to convert the data to be helpful for the program.
        try:
            endpoint_data = json.loads(endpoint_data)
        except json.decoder.JSONDecodeError:
            self.unavailable_addons.append(
                {"issue_type": INVALID_ENDPOINT,
                 "addon_name": self.addon_name,
                 "bl_info": addon_bl_info,
                 "endpoint_url": endpoint_url})

            self.is_updating = False  # Open the latch
            return  # ! Critical Error

        if not "schema_version" in endpoint_data.keys():
            self.unavailable_addons.append(
                {"issue_type": ENDPOINT_INVALID_SCHEMA,
                 "addon_name": self.addon_name,
                 "bl_info": addon_bl_info,
                 "endpoint_url": endpoint_url})

            self.is_updating = False  # Open the latch
            return  # ! Critical Error

        # Check the schema of the endpoint data.
        if endpoint_data["schema_version"] == "super-addon-manager-version-info-1.0.0":
            update_check = UpdateCheck_v1_0_0(
                endpoint_data, self.addon_name, addon_bl_info, endpoint_url)
        else:
            self.unavailable_addons.append(
                {"issue_type": ENDPOINT_INVALID_SCHEMA,
                 "addon_name": self.addon_name,
                 "bl_info": addon_bl_info,
                 "endpoint_url": endpoint_url})

            self.is_updating = False  # Open the latch
            return  # ! Critical Error

        # Handle any error that occured inside the update check.
        if update_check.error:
            self.unavailable_addons.append(update_check.error_data)

            self.is_updating = False  # Open the latch
            return  # ! Critical Error

        # Add the Addon to one of the Update Arrays.
        if update_check.update:
            self.updates.append(
                {"addon_path": addon_path,
                 "allow_automatic_download": update_check.automatic_download,
                 "download_url": update_check.download_url,
                 "addon_name": self.addon_name,
                 "updater": Updater(
                     addon_name=self.addon_name,
                     bl_info=addon_bl_info,
                     allow_automatic_download=update_check.automatic_download,
                     addon_path=addon_path,
                     download_directory=bpy.context.preferences.addons[
                         __package__].preferences.download_directory,
                     download_url=update_check.download_url,
                     addon_version=update_check.version,
                     auto_reload=auto_reload
                 )
                 }
            )

        self.is_updating = False  # Open the latch


class SUPERADDONMANAGER_OT_update_info(Operator):
    """When a background check found updates or errors, this popup message shows up and notifies the user about that."""
    bl_idname = "superaddonmanager.update_info"
    bl_label = "Update Information"
    bl_options = {'REGISTER', 'UNDO'}

    def execute(self, context: Context):
        bpy.ops.preferences.addon_show(module=__package__)
        return {"FINISHED"}

    def invoke(self, context: Context, event: Event):
        return context.window_manager.invoke_props_dialog(self)

    def draw(self, context: Context):
        layout = self.layout

        layout.label(text="Super Addon Manager just checked for updates:")
        layout.label(
            text=f"{len(prefs.updates)} updates found.", icon="SHADERFX")
        layout.label(
            text=f"{len(prefs.unavailable_addons)} errors occured.", icon="ERROR")


# TODO #34 #35: Automatic Update.
class SUPERADDONMANAGER_OT_automatic_update(Operator):
    """Update the addon automatically"""
    bl_idname = "superaddonmanager.automatic_update"
    bl_label = "Update"
    bl_options = {'REGISTER', 'UNDO'}

    addon_path: StringProperty(name="Addon Path")
    download_url: StringProperty(name="Download URL")
    index: IntProperty()

    def execute(self, context: Context):
        updater: Updater = prefs.updates[self.index]["updater"]

        # Download the update.
        try:
            updater.download_update()  # Disabled for testing
            downloaded_file_path = "C:/Users/NotAdmin/Downloads/Super Addon Manager Downloads/test-automatic-download-main-0.0.1.zip"

            if updater.error:
                prefs.updates.pop(self.index)
                prefs.unavailable_addons.append(updater.error_data)
                return {'CANCELLED'}  # ! Critical Error
        except Exception as e:
            updater.error = True
            updater.error_data["issue_type"] = UNKNOWN_ERROR
            updater.error_data["error_message"] = str(e)
            prefs.unavailable_addons.append(updater.error_data)
            return {'CANCELLED'}  # ! Critical Error

        # Update the addon.
        try:
            update_status = updater.update_addon(downloaded_file_path)

            if update_status != None:
                self.report({"WARNING"}, update_status)
                return {'CANCELLED'}  # ! Critical Error
            if updater.error:
                prefs.updates.pop(self.index)
                prefs.unavailable_addons.append(updater.error_data)
                return {'CANCELLED'}  # ! Critical Error

            bpy.ops.preferences.addon_refresh()  # Refresh the addon list.

            # Notify the user, that the update has been successful.
            self.report(
                {"INFO"}, f"{updater.addon_name} has been updated sucessfully!")

            # Remove the addon from the list of updates to avoid confusion.
            prefs.updates.pop(self.index)
        except Exception as e:
            updater.error = True
            updater.error_data["issue_type"] = UNKNOWN_ERROR
            updater.error_data["error_message"] = str(e)
            prefs.unavailable_addons.append(updater.error_data)
            return {'CANCELLED'}  # ! Critical Error

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

    # TODO #9: Progress bar!
    def execute(self, context: Context):
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

    def execute(self, context: Context):
        report_data = prefs.unavailable_addons[self.addon_index]

        bpy.ops.wm.url_open(url=self.generate_report(report_data))

        time.sleep(0.3)

        prefs.unavailable_addons.pop(self.addon_index)

        return {'FINISHED'}

    def generate_report(self, data: dict):
        BASE_URL = "http://localhost:3000/request-support?"

        path = p.join(p.dirname(__file__), "updater_status.json")
        d = decode_json(path)

        issue_type: str = data.pop("issue_type")
        bl_info: dict = data.pop("bl_info")

        addon_version = "Unknown"
        if issue_type != BL_INFO_VERSION_PROBLEMS and "version" in bl_info.keys():
            addon_version = ".".join(map(str, bl_info["version"]))

        url_params = {"issue_type": issue_type,
                      "addon_name": data.pop("addon_name"),
                      "os_name": platform.system(),
                      "blender_version": bpy.app.version_string,
                      "addon_version": addon_version
                      }

        if "tracker_url" in bl_info.keys():
            url_params["tracker_url"] = bl_info["tracker_url"]

        if "new_version" in data.keys():
            url_params["new_version"] = ".".join(
                map(str, data.pop("new_version")))

        for key, value in data.items():
            url_params[key] = value
        # # if issue_type in [SAM_NOT_SUPPORTED]:
        # #     url_params["addon_count"] = data["addon_count"]

        # # if issue_type in [ENDPOINT_URL_INVALID, INVALID_ENDPOINT, ENDPOINT_INVALID_SCHEMA, ENDPOINT_OFFLINE]:
        # #     url_params["endpoint_url"] = data["endpoint_url"]

        # # if issue_type in [ENDPOINT_OFFLINE, DOWNLOAD_URL_OFFLINE, UNKNOWN_ERROR]:
        # #     url_params["error_message"] = data["error_message"]

        # # if issue_type == NOT_AN_ADDON:
        # #     url_params["file_list"] = data["file_list"]

        return BASE_URL + urllib.parse.urlencode(url_params)


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
