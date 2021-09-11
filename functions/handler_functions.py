import bpy
from bpy.app.handlers import persistent

from os import path as p

import time

from .json_functions import (
    encode_json,
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

    d = decode_json(path)

    if prefs.auto_check_for_updates and time.time() - d["last_check"] > check_interval:
        bpy.ops.superaddonmanager.check_for_updates(is_background_check=True)


def register():
    bpy.app.handlers.load_post.append(startup_setup)


def unregister():
    bpy.app.handlers.load_post.remove(startup_setup)
