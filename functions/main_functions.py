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
