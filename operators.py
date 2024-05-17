# ##### BEGIN GPL LICENSE BLOCK #####
#
#  <A central Updater for all your Addons>
#    Copyright (C) <2023>  <Blender Defender>
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
    BoolProperty,
    EnumProperty,
    IntProperty,
    StringProperty,
)
from bpy.types import (
    Context,
    Event,
    Operator,
    OperatorProperties,
    UILayout
)

from bpy_extras.io_utils import ImportHelper

import addon_utils

import os
from os import path as p

import json

import requests
from requests.models import MissingSchema

import sys

import shutil

import time

import platform

import urllib
import urllib.parse

import random

import traceback
from inspect import currentframe

import threading

from . import prefs

from .issue_types import (
    BL_INFO_VERSION_PROBLEMS,
    ENDPOINT_INVALID_SCHEMA,
    ENDPOINT_OFFLINE,
    INVALID_ENDPOINT,
    SAM_NOT_SUPPORTED,
    ENDPOINT_URL_INVALID,
    UNKNOWN_ERROR
)

from .objects.update_check import (
    UpdateCheck_v1_0_0
)
from .objects.experimental_update_check import ExperimentalUpdateCheck
from .objects.updater import UPDATE_CONTEXTS, Updater
from .objects.version_number import VersionNumber

from .functions.main_functions import (
    get_addons_filtered,
    get_line_and_file,
    get_restorable_versions,
    get_bl_info
)
from .functions.json_functions import (
    encode_json,
    decode_json
)


def remove_update(index):
    prefs.updates.pop(index)

    addon_prefs = bpy.context.preferences.addons[__package__].preferences
    addon_prefs.update_details_expand.remove(index)


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
        self.show_popup = False
        self._timer = context.window_manager.event_timer_add(
            0.01, window=context.window)

        # Setup the modal operation.
        self.finished = False
        self.thread = threading.Thread(target=self.execute_thread, daemon=True,
                                       args=[context])
        self.thread.start()

        context.window_manager.modal_handler_add(self)

        return {'RUNNING_MODAL'}

    def execute_thread(self, context: Context):
        """Iterate through all directories and files in the Addons Folders.
        Add single files to the list of addons that can't be updated by SAM.
        Folders are sent to self.check_update() for the actual update check."""

        prefs.checking_for_updates = True

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
                self.show_popup = True
            #     bpy.ops.superaddonmanager.update_info("INVOKE_DEFAULT")
            self.finished = True
            return

        # Reset list of unavailable Addons to avoid duplicate issues (with SAM)
        self.unavailable_addons = []

        prefs.addons_total = len(self.enabled_addons)

        for addon_path in self.enabled_addons:
            prefs.addon_index += 1

            self._get_addon_name(addon_path)

            if p.isdir(addon_path):
                try:
                    self.check_update(addon_path)
                except Exception as e:  # Unknown error that needs to be investigated.
                    _, bl_info = get_bl_info(
                        p.basename(addon_path), sys.modules)

                    self.unavailable_addons.append({
                        "issue_type": UNKNOWN_ERROR,
                        "exception_type": str(e.__class__).split("'")[1],
                        "traceback_location": get_line_and_file(currentframe()),
                        "addon_name": self.addon_name,
                        "bl_info": bl_info,
                        "error_message": traceback.format_exc()
                    })

                self._redraw()

            else:
                _, bl_info = get_bl_info(
                    p.basename(addon_path), sys.modules)

                self.unavailable_addons.append({
                    "issue_type": SAM_NOT_SUPPORTED,
                    "addon_name": self.addon_name,
                    "bl_info": bl_info,
                    "addon_count": len(self.all_addons)
                })

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
            # bpy.ops.superaddonmanager.update_info("INVOKE_DEFAULT")
            self.show_popup = True

        self._redraw()
        self.finished = True

    def modal(self, context: Context, event: Event):
        print("SAM modal operator.")
        if not self.finished and not self.thread.is_alive():
            self.finished = True
            prefs.checking_for_updates = False
            self.report(
                {"ERROR"}, "Something went wrong with the update check. Please report an issue.")

        if self.finished:
            if self.show_popup:
                bpy.ops.superaddonmanager.update_info("INVOKE_DEFAULT")
            print("Finished\n----------------------")
            return {"FINISHED"}

        return {"PASS_THROUGH"}

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
        success, bl_info = get_bl_info(p.basename(addon_path), sys.modules)
        bl_info: dict

        if not success:
            print(
                f"WARNING: Unknown error with {addon_path}: Addon not in sys.modules")
            # # self.addon_name = ""
            # # return  # Unknown Error

        # Try to get the addon name from bl_info.
        if bl_info.get("name", False):
            self.addon_name = bl_info["name"]
        else:  # Extract the addon name from the folder name.
            replace = (("-master", ""),
                       ("-main", ""),
                       ("-", " "),
                       ("_", " "))

            # Extract a good looking addon name from a folder name.
            addon_name: str = p.basename(addon_path)
            for replace_obj, replace_with in replace:
                addon_name = addon_name.replace(replace_obj, replace_with)
            self.addon_name = addon_name.capitalize()

    # Check the given Addons "bl_info" for information about the current
    # version and the URL for a version check. If "endpoint_url"
    # is available, a get request is sent to the Endpoint. If "endpoint_url"
    # is unavailable or some information in "bl_info" is corrupt, the addon
    # is added to self.unavailable_addons (Addons that can't be updated)
    def check_update(self, addon_path, auto_reload=True) -> None:
        self.is_updating = True  # Lock the latch

        success, addon_bl_info = get_bl_info(
            p.basename(addon_path), sys.modules)

        # Handle the case, that the current addon is not in sys.modules.
        if not success:
            print(
                f"WARNING: Unknown error with {addon_path}: Addon not in sys.modules")
            self.is_updating = False  # Open the latch
            return  # Unknown Error

        addon_bl_info: dict
        self.bl_info: dict = addon_bl_info

        if not "endpoint_url" in addon_bl_info.keys():
            self._handle_error(reset_updating=False, issue_type=SAM_NOT_SUPPORTED,
                               addon_count=len(self.all_addons))

            if bpy.context.preferences.addons[__package__].preferences.check_experimental_updates:
                try:
                    self.check_experimental_update(
                        addon_path, addon_bl_info, auto_reload=auto_reload)
                except Exception as e:
                    print(traceback.format_exc())
                    print(f"Error with the experimental update check: {e}")

            self.is_updating = False
            return  # Special Error

        endpoint_url = addon_bl_info["endpoint_url"]

        # Try to get data from the endpoint.
        try:
            endpoint_data = requests.get(endpoint_url).text
        except MissingSchema:  # The URL is invalid.
            self._handle_error(
                issue_type=ENDPOINT_URL_INVALID, endpoint_url=endpoint_url)
            return  # ! Critical Error

        # Any other exception. Most likely, there's no Internet connection or the endpoint doesn't respond.
        except Exception as e:
            self._handle_error(issue_type=ENDPOINT_OFFLINE,
                               error_message=str(e), endpoint_url=endpoint_url)
            return  # ! Critical Error

        # Try to convert the data to be helpful for the program.
        try:
            endpoint_data: dict = json.loads(endpoint_data)
        except json.decoder.JSONDecodeError:
            self._handle_error(
                issue_type=INVALID_ENDPOINT, endpoint_url=endpoint_url)
            return  # ! Critical Error

        # Check the schema of the endpoint data.
        if endpoint_data.get("schema_version", "") == "super-addon-manager-version-info-1.0.0":
            update_check = UpdateCheck_v1_0_0(
                endpoint_data, self.addon_name, addon_bl_info, endpoint_url)
        else:
            self._handle_error(
                issue_type=ENDPOINT_INVALID_SCHEMA, endpoint_url=endpoint_url)
            return  # ! Critical Error

        # Handle any error that occured inside the update check.
        if update_check.error:
            self.unavailable_addons.append(update_check.error_data)

            self.is_updating = False  # Open the latch
            return  # ! Critical Error

        # Add the Addon to one of the Update Arrays.
        if update_check.update:
            self._append_update(update_check, addon_path,
                                addon_bl_info, auto_reload)

        self.is_updating = False  # Open the latch

    def check_experimental_update(self, addon_path: str, bl_info: dict, auto_reload=True) -> None:
        experimental_check = ExperimentalUpdateCheck(bl_info)
        endpoint_data = experimental_check.get_data()

        if not endpoint_data:
            return  # ! Critical Error

        endpoint_url = experimental_check.api + " API"

        # Check the schema of the endpoint data.
        if endpoint_data["schema_version"] == "super-addon-manager-version-info-1.0.0":
            update_check = UpdateCheck_v1_0_0(
                endpoint_data, self.addon_name, bl_info, endpoint_url)
        else:
            return  # ! Critical Error

        # Handle any error that occured inside the update check.
        if update_check.error:
            return  # ! Critical Error

        # Add the Addon to one of the Update Arrays.
        if update_check.update:
            self._append_update(update_check, addon_path,
                                bl_info, auto_reload, is_experimental=True)

        self.is_updating = False  # Open the latch

    def _append_update(self, update_check: UpdateCheck_v1_0_0, addon_path: str, bl_info: dict, auto_reload: bool = True, is_experimental: bool = False):
        self.updates.append(
            {"addon_path": addon_path,
                "allow_automatic_download": update_check.automatic_download,
                "download_url": update_check.download_url,
                "addon_name": self.addon_name,
                "updater": Updater(
                    addon_name=self.addon_name,
                    release_description=update_check.release_description,
                    bl_info=bl_info,
                    allow_automatic_download=update_check.automatic_download,
                    addon_path=addon_path,
                    download_directory=bpy.context.preferences.addons[
                        __package__].preferences.download_directory,
                    download_url=update_check.download_url,
                    addon_version=VersionNumber(update_check.version),
                    auto_reload=auto_reload
                ),
                "is_experimental": is_experimental
             }
        )

        addon_prefs = bpy.context.preferences.addons[__package__].preferences
        addon_prefs.update_details_expand.add()

    def _handle_error(self, reset_updating=True, **kwargs):
        """Handle an error and append the addon to the list of unavailable addons."""
        error_data = {
            "addon_name": self.addon_name,
            "bl_info": self.bl_info,
        }

        for key, value in kwargs.items():
            error_data[key] = value

        self.unavailable_addons.append(error_data)

        if reset_updating:
            self.is_updating = False  # Open the latch

        return


class SUPERADDONMANAGER_OT_update_info(Operator):
    """When a background check found updates or errors, this popup message shows up and notifies the user about that."""
    bl_idname = "superaddonmanager.update_info"
    bl_label = "Update Information"
    bl_options = {'REGISTER', 'UNDO'}

    def execute(self, context: Context):
        context.preferences.addons[__package__].preferences.layout_tab = "updater"
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

    index: IntProperty()
    is_experimental: BoolProperty(default=False)

    @classmethod
    def description(cls, context: Context, properties: OperatorProperties) -> str:
        if properties.is_experimental:
            return "Update experimentally"

        return "Update"

    def execute(self, context: Context):
        updater: Updater = prefs.updates[self.index]["updater"]

        # Download the update.
        try:
            updater.download_update()  # Disabled for testing

            # ! Testing Only
            # downloaded_file_path = "C:/Users/NotAdmin/Downloads/Super Addon Manager Downloads/test-automatic-download-main-0.0.1.zip"

            if updater.error:
                remove_update(self.index)
                prefs.unavailable_addons.append(updater.error_data)
                return {'CANCELLED'}  # ! Critical Error
        except Exception as e:
            updater.error = True
            updater.error_data["issue_type"] = UNKNOWN_ERROR
            updater.error_data["error_message"] = traceback.format_exc()
            updater.error_data["exception_type"] = str(
                e.__class__).split("'")[1]
            updater.error_data["traceback_location"] = get_line_and_file(
                currentframe())

            remove_update(self.index)
            prefs.unavailable_addons.append(updater.error_data)
            return {'CANCELLED'}  # ! Critical Error

        # Return, if the addon can't be updated automatically.
        if not updater.allow_automatic_download:
            return {"FINISHED"}

        # Update the addon.
        try:
            update_status = updater.update_addon()

            # Handle update errors.
            if updater.error:
                remove_update(self.index)
                prefs.unavailable_addons.append(updater.error_data)
                return {'CANCELLED'}  # ! Critical Error

            if updater.success:
                # Remove the addon from the list of updates to avoid confusion.
                remove_update(self.index)

            if update_status != None:
                self.report({"WARNING"}, update_status)
                return {'CANCELLED'}  # ! Critical Error

            bpy.ops.preferences.addon_refresh()  # Refresh the addon list.

            # Notify the user, that the update has been successful.
            self.report(
                {"INFO"}, f"{updater.addon_name} has been updated sucessfully!")

        except Exception as e:
            updater.error = True
            updater.error_data["issue_type"] = UNKNOWN_ERROR
            updater.error_data["error_message"] = traceback.format_exc()
            updater.error_data["exception_type"] = str(
                e.__class__).split("'")[1]
            updater.error_data["traceback_location"] = get_line_and_file(
                currentframe())

            remove_update(self.index)
            prefs.unavailable_addons.append(updater.error_data)
            return {'CANCELLED'}  # ! Critical Error

        return {'FINISHED'}


class SUPERADDONMANAGER_OT_manual_update(Operator, ImportHelper):
    """Update the addon manually"""
    bl_idname = "superaddonmanager.manual_update"
    bl_label = "Update"
    bl_options = {'REGISTER', 'UNDO'}

    filter_glob: StringProperty(
        default='*.zip',
        options={'HIDDEN'}
    )
    index: IntProperty()

    def execute(self, context: Context):
        updater: Updater = prefs.updates[self.index]["updater"]

        # Update the addon.
        try:
            update_status = updater.update_addon(self.filepath)

            if updater.error:
                remove_update(self.index)
                prefs.unavailable_addons.append(updater.error_data)
                return {'CANCELLED'}  # ! Critical Error

            if updater.success:
                # Remove the addon from the list of updates to avoid confusion.
                remove_update(self.index)

            if update_status != None:
                self.report({"WARNING"}, update_status)
                return {'CANCELLED'}  # ! Critical Error

            bpy.ops.preferences.addon_refresh()  # Refresh the addon list.

            self.report(
                {"INFO"}, f"{updater.addon_name} has been updated sucessfully!")

        except Exception as e:
            updater.error = True
            updater.error_data["issue_type"] = UNKNOWN_ERROR
            updater.error_data["error_message"] = traceback.format_exc()
            updater.error_data["exception_type"] = str(
                e.__class__).split("'")[1]
            updater.error_data["traceback_location"] = get_line_and_file(
                currentframe())

            remove_update(self.index)
            prefs.unavailable_addons.append(updater.error_data)
            return {'CANCELLED'}  # ! Critical Error

        return {'FINISHED'}

    def draw(self, context: Context):
        return


class SUPERADDONMANAGER_OT_update_all(Operator):
    """Update all addons, that can be updated automatically."""
    bl_idname = "superaddonmanager.update_all"
    bl_label = "Update All"
    bl_options = {'REGISTER', 'UNDO'}

    def execute(self, context: Context):
        prefs.updating_all = True
        prefs.updated_addons = 0
        prefs.updatable_addons = len(
            [a for a in prefs.updates if a["allow_automatic_download"]])

        i = 0

        while i < len(prefs.updates):
            addon = prefs.updates[i]
            if addon["allow_automatic_download"]:
                bpy.ops.superaddonmanager.automatic_update(
                    index=i)
                prefs.updated_addons += 1

            else:
                i += 1

            # # bpy.ops.superaddonmanager.manual_update("INVOKE_DEFAULT")
            # # download_url=addon["download_url"])

            self._redraw()  # Update the progress bar.

        prefs.updating_all = False
        return {'FINISHED'}

    def _redraw(self):
        # ATTENTION: This is not officially supported! See: https://docs.blender.org/api/current/info_gotcha.html
        try:
            bpy.ops.wm.redraw_timer(
                type='DRAW_WIN_SWAP', iterations=1)
        except Exception:
            pass


class SUPERADDONMANAGER_OT_select_addon_to_manage(Operator):
    """Select this addon to manage it."""
    bl_idname = "superaddonmanager.select_addon_to_manage"
    bl_label = "Manage"
    bl_options = {'REGISTER', 'UNDO'}

    index: IntProperty()

    def execute(self, context: Context):
        addon_prefs = context.preferences.addons[__package__].preferences
        prefs.managed_addon = get_addons_filtered(
            addon_prefs.manager_search_term)[self.index]
        addon_prefs.manager_search_term = ""

        return {'FINISHED'}


class SUPERADDONMANAGER_OT_install_unsupported_update(Operator, ImportHelper):
    """Update any activated addon."""
    bl_idname = "superaddonmanager.install_unsupported_update"
    bl_label = "Update"
    bl_options = {'REGISTER', 'UNDO'}

    filter_glob: StringProperty(
        default='*.zip',
        options={'HIDDEN'}
    )

    def execute(self, context: Context):
        try:
            bl_info: dict = addon_utils.module_bl_info(
                prefs.managed_addon["module"])

            updater = Updater(addon_name=prefs.managed_addon["name"],
                              addon_path=prefs.managed_addon["install_path"],
                              bl_info=bl_info,
                              auto_reload=True)

            updater.update_context = UPDATE_CONTEXTS["UPDATE"]

            updater.update_addon(self.filepath)
        except Exception as e:
            ...

        return {'FINISHED'}

    def draw(self, context: Context):
        return


class SUPERADDONMANAGER_OT_restore_backup(Operator):
    """Restore old version from backup"""
    bl_idname = "superaddonmanager.restore_backup"
    bl_label = "Restore Backup"
    bl_options = {'REGISTER', 'UNDO'}

    restore_version: EnumProperty(items=get_restorable_versions)

    def execute(self, context: Context):
        bl_info: dict = addon_utils.module_bl_info(
            prefs.managed_addon["module"])
        install_path = prefs.managed_addon["install_path"]
        updater = Updater(addon_name=prefs.managed_addon["name"],
                          addon_path=install_path, auto_reload=True)

        try:
            updater._create_backup(
                install_path, VersionNumber(bl_info.get("version", "0.0.0")))
            updater._install_files(
                p.join(install_path, "superaddonmanager-backups", self.restore_version), install_path)
            updater._reload_addon()
        except Exception as e:
            print("Error in restore_backups")
        return {'FINISHED'}

    def invoke(self, context: Context, event: Event):
        return context.window_manager.invoke_props_dialog(self)

    def draw(self, context: Context):
        layout: UILayout = self.layout

        layout.prop(self, "restore_version")


class SUPERADDONMANAGER_OT_install_new_addon(Operator):
    """Install an addon to the directory, where Super Addon Manager is installed"""
    bl_idname = "superaddonmanager.install_new_addon"
    bl_label = "Install"
    bl_options = {'REGISTER', 'UNDO'}

    addon_id: StringProperty(name="Addon ID")
    addon_name: StringProperty(name="Addon Name")
    endpoint_url: StringProperty(name="Endpoint URL")

    def execute(self, context: Context):
        install_path = p.join(p.dirname(p.dirname(__file__)), self.addon_id)

        if p.isdir(install_path):
            self.report(
                {"INFO"}, f"{self.addon_name} has already been installed.")
            return {"FINISHED"}

        try:
            endpoint_data = requests.get(self.endpoint_url).text
            endpoint_data = json.loads(endpoint_data)

            update_check = UpdateCheck_v1_0_0(
                endpoint_data, self.addon_name, {"version": (-1, 0, 0)}, self.endpoint_url)

            if not update_check.update:
                self.report(
                    {"INFO"}, f"{self.addon_name} has no available version that's compatible with the current Blender version.")
                return {"FINISHED"}
        except:
            return {"FINISHED"}

        os.makedirs(install_path)

        try:
            installer = Updater(addon_name=self.addon_name, allow_automatic_download=True, download_url=update_check.download_url, addon_path=install_path, download_directory=context.preferences.addons[
                __package__].preferences.download_directory, addon_version=VersionNumber(update_check.version), auto_reload=True)

            installer.download_update()
            installer.update_addon()

            shutil.rmtree(p.join(install_path, "superaddonmanager-backups"))
        except:
            pass

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
        BASE_URL = "http://super-addon-manager.netlify.app/request-support?"

        path = p.join(p.dirname(__file__), "updater_status.json")
        d = decode_json(path)

        issue_type: str = data.pop("issue_type")
        bl_info: dict = data.pop("bl_info")

        addon_version = "Unknown"
        if issue_type != BL_INFO_VERSION_PROBLEMS and "version" in bl_info.keys():
            addon_version = str(VersionNumber(bl_info["version"]))

        url_params = {"issue_type": issue_type,
                      "addon_name": data.pop("addon_name"),
                      "os_name": platform.system(),
                      "blender_version": bpy.app.version_string,
                      "addon_version": addon_version
                      }

        if "tracker_url" in bl_info.keys():
            url_params["tracker_url"] = bl_info["tracker_url"]

        # Version, that Super Addon Manager tried to install.
        if "new_addon_version" in data.keys():
            url_params["new_addon_version"] = str(
                VersionNumber(data.pop("new_addon_version")))

        for key, value in data.items():
            url_params[key] = value

        url_params["utm_source"] = "Addon"
        url_params["utm_medium"] = "Direct"
        url_params["utm_campaign"] = "Addon Support"
        url_params["utm_content"] = str(
            d["tests"]["icons"]) + "Request Support"

        return BASE_URL + urllib.parse.urlencode(url_params)


classes = (
    SUPERADDONMANAGER_OT_check_for_updates,
    SUPERADDONMANAGER_OT_update_info,
    SUPERADDONMANAGER_OT_automatic_update,
    SUPERADDONMANAGER_OT_manual_update,
    SUPERADDONMANAGER_OT_update_all,
    SUPERADDONMANAGER_OT_select_addon_to_manage,
    SUPERADDONMANAGER_OT_install_unsupported_update,
    SUPERADDONMANAGER_OT_restore_backup,
    SUPERADDONMANAGER_OT_install_new_addon,
    SUPERADDONMANAGER_OT_generate_issue_report
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)


def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
