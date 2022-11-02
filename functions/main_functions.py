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
from bpy.types import Context

import addon_utils

import os
from os import path as p

from inspect import getframeinfo

from .. import prefs


def expand_all(self, context: Context):
    ''' Property callback to expand all categories in the preferences when searching '''
    for category in list(prefs.filtered_categories):
        prefs.filtered_categories[category] = False

    if not self.error_search_term:
        return

    for addon in filter(lambda el: filter_search(el, self.error_search_term), prefs.unavailable_addons):
        prefs.filtered_categories[addon["issue_type"]] = True


def filter_search(el, search_term: str) -> bool:
    ''' Function for the filter operation to filter by a given search term '''
    search_term = search_term.lower()
    addon_name = el["addon_name"].lower()
    if search_term in addon_name:
        return True

    return False


def get_line_and_file(frame):
    """Try to get the line that the function was called from."""
    try:
        f = getframeinfo(frame)
        return f"{p.basename(f.filename)}, line {f.lineno}"
    except Exception:
        return ""


def get_addons_filtered(search_term):
    """Get a filtered list of installed Blender Addons, filtered by search term."""

    def filter_func(el): return el["name"].startswith(search_term)

    blender_prefs = bpy.context.preferences

    # Get all directories, where user installed addons can be found.
    user_dirs = tuple([p for p in [p.join(
        blender_prefs.filepaths.script_directory, "addons"), bpy.utils.user_resource("SCRIPTS", "addons")] if p])

    addons = []
    for mod in addon_utils.modules():
        bl_info: dict = addon_utils.module_bl_info(mod)

        is_folder_addon = mod.__file__.endswith("__init__.py")
        is_user_addon = mod.__file__.startswith(user_dirs)
        install_path = p.dirname(mod.__file__)

        addons.append({
            "module": mod,
            "install_path": install_path,
            "name": bl_info.get("name", ""),
            "is_folder_addon": is_folder_addon,
            "is_user_addon": is_user_addon
        })

    return list(filter(filter_func, addons))


def get_restorable_versions(self, context: Context):
    items = []
    try:
        for file in os.listdir(p.join(prefs.managed_addon["install_path"], "superaddonmanager-backups")):
            items.append((file, file, "Old Version that can be restored."))
    except Exception as e:
        print(e)

    return items


def get_bl_info(addon: str, modules: dict) -> tuple:
    """Safely get the bl_info dictionary from sys.modules

    Args:
        addon (str): The key of the addon, whose bl_info should be retrieved.
        modules (dict): A dictionary of modules.

    Returns:
        tuple: (success: bool, bl_info: dict)
        success: Whether bl_info could be successfully retrieved from modules
        bl_info: Dictionary containing addon information. Empty dictionary, if success is False
    """

    # Safely get the addon module from sys.modules
    addon_module = modules.get(addon, None)

    # Safely get the bl_info from the addon module.
    if not addon_module:
        return (False, {})

    return (True, getattr(addon_module, "bl_info", {}))
