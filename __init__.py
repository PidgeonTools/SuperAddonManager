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

bl_info = {
    "name": "Super Addon Manager (SAM)",
    "author": "Blender Defender",
    "version": (0, 0, 0),
    "blender": (2, 83, 0),
    "location": "Preferences > Addons > Super Addon Manager",
    "description": "A central Updater for all of your Addons",
    "warning": "",
    "wiki_url": "https://github.com/BlenderDefender/central_addon_updater",
    "tracker_url": "https://github.com/BlenderDefender/central_addon_updater/issues",
    "category": "System"
}




def register():
    print(bpy.utils.script_path_user())


def unregister():
    pass
