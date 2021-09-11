import bpy
from bpy.types import AddonPreferences
from bpy.props import (
    FloatProperty,
    IntProperty,
    BoolProperty
)

import time

from os import path as p

from .functions.json_functions import (
    decode_json
)

# These variables are necessary for the update checking progress bar.
addons_total = 0
addon_index = 0
checking_for_updates = False

# Create the lists for addons, that either have available updates
# or addons, that have issues and can't be updated.
updates = []
unavailable_addons = []


class SUPERADDONMANAGER_APT_preferences(AddonPreferences):
    """Preferences of Super Addon Manager."""
    bl_idname = __package__

    update_check_percent_complete: FloatProperty(
        name="%",
        description="Percentage addons checked for updates",
        subtype='PERCENTAGE',
        min=0,
        max=100,
        options=set(),  # Not animatable!
        get=(lambda self: 0 if addons_total ==
             0 else 100 * addon_index / addons_total),
        set=(lambda self, value: None),
    )

    check_interval_months: IntProperty(
        name='Months',
        description="Number of months between checking for updates",
        default=0,
        min=0
    )
    check_interval_days: IntProperty(
        name='Days',
        description="Number of days between checking for updates",
        default=7,
        min=0,
        max=31
    )
    check_interval_hours: IntProperty(
        name='Hours',
        description="Number of hours between checking for updates",
        default=0,
        min=0,
        max=23
    )
    check_interval_minutes: IntProperty(
        name='Minutes',
        description="Number of minutes between checking for updates",
        default=0,
        min=0,
        max=59
    )
    auto_check_for_updates: BoolProperty(
        name="Automatically check for updates",
        description=f"If enabled, Super Addon Manager automatically checks for updates using a custum interval.",
        default=True,
    )

    def draw(self, context):
        layout = self.layout

        if checking_for_updates:
            # Checking for updates progress bar.
            layout.label(
                text=f"Checking for updates: {addon_index}/{addons_total}", icon='INFO')
            layout.prop(self, "update_check_percent_complete")
        else:
            row = layout.row()
            row.scale_y = 2
            # Check for Updates Operator.
            op = row.operator("superaddonmanager.check_for_updates")
            op.is_background_check = False

        # Layout the "Update All"-Operator when at least two addons have updates.
        if len(updates) > 1:
            layout.operator("superaddonmanager.update_all")

        # Layout all Addons that can be Updated one by one.
        for addon in updates:
            row = layout.row()
            row.label(text=addon["addon_name"])
            # Check, if the Addon supports Auto-Update.
            if addon["allow_automatic_download"]:
                op = row.operator("superaddonmanager.automatic_update")
                op.addon_path = addon["addon_path"]
            else:
                op = row.operator("superaddonmanager.manual_update",
                                  text="Go to the downloads page.")
            op.download_url = addon["download_url"]
            # TODO: Exchange the operator after Updating --> Maybe with another list - Updated_Addons

        # Show a warning, that some addons couldn't be properly updated,
        # if at least one addon ran into any kind of issue.
        if len(unavailable_addons) > 0:
            layout.label(
                text=f"{len(unavailable_addons)} errors occured when checking for Updates:", icon="ERROR")
        # Layout all issues.
        for index, addon in enumerate(unavailable_addons):
            row = layout.row()
            row.label(text=addon["addon_name"])
            row.label(text=f"Error Code: {addon['issue_type']}")

            op = row.operator(
                "superaddonmanager.generate_issue_report", text="More details")
            op.addon_index = index

        self.draw_settings(layout)

    def draw_settings(self, layout):
        path = p.join(p.dirname(__file__), "updater_status.json")

        props = layout.box()
        props.label(text="Super Addon Manager Settings:")
        props.row(align=True).prop(self, "auto_check_for_updates")

        if self.auto_check_for_updates:
            time_props = props.grid_flow(row_major=True, align=True)
            time_props.prop(self, "check_interval_months")
            time_props.prop(self, "check_interval_days")
            time_props.prop(self, "check_interval_hours")
            time_props.prop(self, "check_interval_minutes")

        last_check = time.localtime(decode_json(path)['last_check'])
        props.label(
            text=f"Last update check: {time.strftime('%A, %d/%m/%Y %H:%M', last_check)}")


classes = (
    SUPERADDONMANAGER_APT_preferences,
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)


def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
