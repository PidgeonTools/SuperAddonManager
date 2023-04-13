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
from bpy.app.handlers import persistent

from os import path as p

import time

from .json_functions import (
    decode_json
)


@persistent
def startup_setup(*args):
    prefs = bpy.context.preferences.addons[__package__.split(".")[
        0]].preferences

    path = p.join(p.dirname(p.dirname(__file__)), "updater_status.json")
    # Interval in seconds between update checks.
    check_interval = prefs.check_interval_months * 2678400 + prefs.check_interval_days * \
        86400 + prefs.check_interval_hours * 3600 + prefs.check_interval_minutes * 60

    prefs.error_search_term = ""

    d = decode_json(path)
    if d is not None:
        if prefs.auto_check_for_updates and time.time() - d["last_check"] > check_interval:
            bpy.ops.superaddonmanager.check_for_updates(
                is_background_check=True)


def register():
    bpy.app.handlers.load_post.append(startup_setup)


def unregister():
    bpy.app.handlers.load_post.remove(startup_setup)
