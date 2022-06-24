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
from bpy.types import (
    AddonPreferences,
    UILayout,
    Context
)
from bpy.props import (
    BoolProperty,
    FloatProperty,
    IntProperty,
    StringProperty
)

import time

from os import path as p

from .functions.json_functions import (
    decode_json
)
from .functions.main_functions import (
    expand_all,
    filter_search
)
from .issue_types import (
    BL_INFO_VERSION_PROBLEMS,
    SAM_NOT_SUPPORTED,
    ENDPOINT_URL_INVALID,
    all_issue_types
)

HEADING_DISTANCE = 40
DISTANCE_LEFT = 280
ITEMS_DISTANCE = 45

# These variables are necessary for the update checking progress bar.
addons_total = 0
addon_index = 0
checking_for_updates = False

# Create the lists for addons, that either have available updates
# or addons, that have issues and can't be updated.
updates = []
unavailable_addons = []
expanded_categories = {issue_type: True for issue_type in all_issue_types}
filtered_categories = {issue_type: False for issue_type in all_issue_types}


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

    download_directory: StringProperty(
        name="Download Directory",
        description="The directory where the downloaded files are stored.",
        default=p.join(p.expanduser('~'), 'downloads'),
        subtype="DIR_PATH"
    )

    check_interval_months: IntProperty(
        name='Months',
        description="Number of months between checking for updates",
        default=0,
        min=0,
    )
    check_interval_days: IntProperty(
        name='Days',
        description="Number of days between checking for updates",
        default=7,
        min=0,
        max=31,
    )
    check_interval_hours: IntProperty(
        name='Hours',
        description="Number of hours between checking for updates",
        default=0,
        min=0,
        max=23,
    )
    check_interval_minutes: IntProperty(
        name='Minutes',
        description="Number of minutes between checking for updates",
        default=0,
        min=0,
        max=59,
    )
    auto_check_for_updates: BoolProperty(
        name="Automatically check for updates",
        description=f"If enabled, Super Addon Manager automatically checks for updates using a custum interval.",
        default=True,
    )
    error_search_term: StringProperty(
        name="Search addon",
        description="Search for an addon in the error list.",
        options={"TEXTEDIT_UPDATE"},
        update=expand_all,
    )

    dev_icon: IntProperty(max=3, min=0)

    def draw(self, context: Context):
        layout: UILayout = self.layout

        # layout.prop(self, "dev_icon")  # TODO: #46 Decide on an icon.

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
        for index, addon in enumerate(updates):
            row = layout.row()
            row.label(text=addon["addon_name"])
            # Check, if the Addon supports Auto-Update.
            if addon["allow_automatic_download"]:
                op = row.operator("superaddonmanager.automatic_update")
                op.addon_path = addon["addon_path"]
                op.index = index
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
    def layout_issues(self, context: Context, layout: UILayout):
        path = p.join(p.dirname(__file__), "updater_status.json")
        d = decode_json(path)

        info_row = layout.row()
        # Distribute the label and the search box properly.
        info_row.alignment = "LEFT"
        info_row.scale_x = 5

        # Display a message, that there were issues while checking for updates.
        info_row.label(
            text=f"{len(unavailable_addons)} errors occured when checking for Updates", icon="ERROR")

        info_row.prop(self, "error_search_term", icon="VIEWZOOM", text="")

        prev_error = None
        for index, addon in enumerate(filter(lambda el: filter_search(el, self.error_search_term), unavailable_addons)):
            if addon["issue_type"] != prev_error:
                # Change the previous error to be the current error code.
                prev_error = addon["issue_type"]
                icon = "TRIA_DOWN" if getattr(self,
                                              prev_error) else "TRIA_RIGHT"

                # Start a new section for a new error code.
                container = layout.column()
                expand = container.row(align=True)
                expand.emboss = "NONE"
                expand.alignment = "LEFT"
                expand.prop(self, prev_error,
                            text=f"{self.convert_error_message(prev_error)} (Error Code: {prev_error})", icon=icon)

                container.separator(factor=HEADING_DISTANCE / 100)

            # Display the error codes, if the area is expanded.
            if getattr(self, prev_error):
                row = container.row()
                row.separator(factor=DISTANCE_LEFT / 100)
                row.label(text=addon["addon_name"])

                icons = ["URL", "INFO", "HELP",
                         "QUESTION", "RESTRICT_SELECT_OFF"]

                icon = icons[d["tests"]["icons"]]

                op = row.operator(
                    "superaddonmanager.generate_issue_report", text="Request Support", icon=icon)
                op.addon_index = index
                container.separator(factor=ITEMS_DISTANCE / 100)

    def draw_settings(self, layout: UILayout):
        path = p.join(p.dirname(__file__), "updater_status.json")

        props = layout.box()
        props.label(text="Super Addon Manager Settings:")
        props.row().prop(self, "download_directory")
        props.row(align=True).prop(self, "auto_check_for_updates")

        if self.auto_check_for_updates:
            time_props = props.grid_flow(row_major=True, align=True)
            time_props.prop(self, "check_interval_months")
            time_props.prop(self, "check_interval_days")
            time_props.prop(self, "check_interval_hours")
            time_props.prop(self, "check_interval_minutes")

        d = decode_json(path)
        if d is not None:
            last_check = time.localtime(d['last_check'])
            props.label(
                text=f"Last update check: {time.strftime('%A, %d/%m/%Y %H:%M', last_check)}")

    def convert_error_message(self, msg):
        error_code_labels = {
            SAM_NOT_SUPPORTED: "Super Addon Manager is not supported",
            BL_INFO_VERSION_PROBLEMS: "Problems with the current addon version",
            ENDPOINT_URL_INVALID: "URL Invalid",
        }
        if msg in error_code_labels.keys():
            string = error_code_labels[msg]
        else:
            string = ""
            for i in msg.split("_"):
                string += i.capitalize() + " "
        return string


classes = (
    SUPERADDONMANAGER_APT_preferences,
)


def add_issue_types_to_prefs():
    if '__annotations__' not in SUPERADDONMANAGER_APT_preferences.__dict__:
        setattr(SUPERADDONMANAGER_APT_preferences, '__annotations__', {})

    def make_fns(issue_type: str):
        ''' Capture the issue_type in a closure and generate some functions that
        proxy the get/set from expanded_categories for that issue_type '''

        def get_expanded(self):
            return expanded_categories[issue_type] or filtered_categories[issue_type]

        def set_expanded(self, value: bool):
            expanded_categories[issue_type] = value

        return get_expanded, set_expanded

    for issue_type in all_issue_types:
        # Define a property+annotation that proxies each issue_type from expanded_categories
        get_expanded, set_expanded = make_fns(issue_type)

        setattr(SUPERADDONMANAGER_APT_preferences, issue_type, True)
        SUPERADDONMANAGER_APT_preferences.__annotations__[
            issue_type] = BoolProperty(default=True,
                                       get=get_expanded,
                                       set=set_expanded)


def register():
    add_issue_types_to_prefs()

    for cls in classes:
        bpy.utils.register_class(cls)


def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
