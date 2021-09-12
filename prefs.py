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
from .functions.main_functions import (
    filter_search
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

    dev_icon: IntProperty(max=10, min=0)
    dev_heading_distance: IntProperty(default=40)
    dev_distance_left: IntProperty(default=280)
    dev__items_distance: IntProperty(default=45)

    def draw(self, context):
        layout = self.layout

        layout.prop(self, "dev_icon")
        layout.prop(self, "dev_distance_left")
        layout.prop(self, "dev_heading_distance")
        layout.prop(self, "dev__items_distance")

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
            self.layout_issues(context, layout)

        self.draw_settings(layout)

    # Layout all issues.
    def layout_issues(self, context, layout):
        info_row = layout.row()
        # Distribute the label and the search box properly.
        info_row.alignment = "LEFT"
        info_row.scale_x = 5

        # Display a message, that there were issues while checking for updates.
        info_row.label(
            text=f"{len(unavailable_addons)} errors occured when checking for Updates", icon="ERROR")

        info_row.prop(context.scene, "error_search_term",
                      icon="VIEWZOOM", text="")

        prev_error = None
        for index, addon in enumerate(filter(lambda el: filter_search(el, context.scene.error_search_term), unavailable_addons)):
            if addon["issue_type"] != prev_error:
                # Change the previous error to be the current error code.
                prev_error = addon["issue_type"]
                icon = "TRIA_DOWN" if getattr(
                    context.scene, prev_error) else "TRIA_RIGHT"

                # Start a new section for a new error code.
                container = layout.column()
                expand = container.row(align=True)
                expand.emboss = "NONE"
                expand.alignment = "LEFT"
                expand.prop(context.scene, prev_error,
                            text=f"{self.convert_error_message(prev_error)} (Error Code: {prev_error})", icon=icon)

                container.separator(factor=self.dev_heading_distance / 100)

            # Display the error codes, if the area is expanded.
            if getattr(context.scene, prev_error):
                row = container.row()
                row.separator(factor=self.dev_distance_left / 100)
                row.label(text=addon["addon_name"])

                icons = ["INFO", "HELP", "URL", "RESTRICT_SELECT_OFF", "FAKE_USER_ON",
                         "SHADERFX", "QUESTION", "WORLD", "CHECKMARK", "SCRIPT", "ERROR"]

                icon = icons[self.dev_icon]

                op = row.operator(
                    "superaddonmanager.generate_issue_report", text="Request Support", icon=icon)
                op.addon_index = index
                container.separator(factor=self.dev__items_distance / 100)

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

    def convert_error_message(self, msg):
        string = ""
        for i in msg.split("_"):
            string += i.capitalize() + " "
        return string


classes = (
    SUPERADDONMANAGER_APT_preferences,
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)


def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
