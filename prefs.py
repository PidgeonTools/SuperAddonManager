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

import textwrap

from .objects.updater import UPDATE_CONTEXTS, Updater

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

# These variables are necessary for the update all progress bar.
updatable_addons = 0
updated_addons = 0
updating_all = False

# Create the lists for addons, that either have available updates
# or addons, that have issues and can't be updated.
updates = []
unavailable_addons = []
expanded_categories = {issue_type: True for issue_type in all_issue_types}
filtered_categories = {issue_type: False for issue_type in all_issue_types}


class SUPERADDONMANAGER_APT_preferences(AddonPreferences):
    """Preferences of Super Addon Manager."""
    bl_idname = __package__

    update_check_progress_bar: FloatProperty(
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

    update_all_progress_bar: FloatProperty(
        name="%",
        description="Percentage addons updated",
        subtype='PERCENTAGE',
        min=0,
        max=100,
        options=set(),  # Not animatable!
        get=(lambda self: 0 if updatable_addons ==
             0 else 100 * updated_addons / updatable_addons),
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

    check_experimental_updates: BoolProperty(
        name="Check Experimental Updates",
        description="Check for addon updates using the GitHub and GitLab API, if Super Addon Manager isn't supported. This might drastically increase the number of addons that you can check for updates. This is experimental. Super Addon Manager can't guarantee, that the new addon versions are compatible with the current Blender Version.",
        default=True
    )
    use_experimental_installer: BoolProperty(
        name="Automatically install experimental updates",
        description="When an experimental update is found, it will be installed without manually downloading the files. This may cause issues, when a downloaded version is incompatible with the current Blender version.",
        default=False
    )

    dev_icon: IntProperty(max=3, min=0)

    def draw(self, context: Context):
        layout: UILayout = self.layout

        # layout.prop(self, "dev_icon")  # TODO: #46 Decide on an icon.

        if updating_all:
            # Checking for updates progress bar.
            layout.label(
                text=f"Updating: {updated_addons}/{updatable_addons}", icon='INFO')
            layout.prop(self, "update_all_progress_bar")

        if checking_for_updates:
            # Checking for updates progress bar.
            layout.label(
                text=f"Checking for updates: {addon_index}/{addons_total}", icon='INFO')
            layout.prop(self, "update_check_progress_bar")

        if not checking_for_updates and not updating_all:
            self.layout_featured_button(context, layout, updates)

        # Layout all Addons that can be Updated one by one.
        for index, addon in enumerate(updates):
            updater: Updater = addon["updater"]

            row = layout.row()
            row.label(text=addon["addon_name"])

            if addon["is_experimental"]:
                row.label(
                    text="Experimental update. Be careful!", icon="ERROR")

            new_row = layout.row()
            new_row.label(
                text=f"Update to: {'.'.join(map(str, updater.addon_version))}")

            # Display the automatic update operator, when the addon needs to be downloaded.
            # The operator will run for automatic and manual downloads.
            if updater.update_context == UPDATE_CONTEXTS["DOWNLOAD"]:
                op = new_row.operator("superaddonmanager.automatic_update")
            else:
                # If the update was downloaded, display the manual update operator.
                op = new_row.operator("superaddonmanager.manual_update",
                                      text="Update from local file.")

            op.index = index

            # TODO: Exchange the operator after Updating --> Maybe with another list - Updated_Addons

            if updater.release_description:
                self.layout_release_description(
                    context, layout, updater.release_description)

        # Show a warning, that some addons couldn't be properly updated,
        # if at least one addon ran into any kind of issue.
        if len(unavailable_addons) > 0:
            self.layout_issues(context, layout)

        self.draw_settings(layout)

    def layout_featured_button(self, context: Context, layout: UILayout, updates: list):
        # Layout the "Update All"-Operator when at least two addons have updates.
        if len(updates) > 1:
            row = layout.row()
            row.scale_y = 2
            flow = row.grid_flow(row_major=True, align=True)

            # Check for Updates Operator.
            flow.operator("superaddonmanager.update_all")

            op = flow.operator("superaddonmanager.check_for_updates",
                               text="", icon="FILE_REFRESH")
            op.is_background_check = False
        else:
            row = layout.row()
            row.scale_y = 2
            flow = row.grid_flow(row_major=True, align=True)

            # Check for Updates Operator.
            op = flow.operator("superaddonmanager.check_for_updates")
            op.is_background_check = False

    def layout_release_description(self, context: Context, layout: UILayout, release_description: str):
        box = layout.box()
        box_row = box.row()
        box_row.label(text="Release Notes")

        release_description_lines: list = release_description.strip().split("\n")

        width = context.region.width
        ui_scale = context.preferences.view.ui_scale
        font_size = context.preferences.ui_styles[0].widget_label.points

        line_length = (width * 2) / (ui_scale * font_size)

        for line in release_description_lines:
            wrapp = textwrap.TextWrapper(int(line_length))
            # wrapp = textwrap.TextWrapper(self.dev_line_length)
            wrapp_lines = wrapp.wrap(line)

            for wline in wrapp_lines:
                box_row = box.row(align=True)
                box_row.alignment = "EXPAND"
                box_row.scale_y = 0.6
                box_row.label(text=wline)

            layout.separator()

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
                            text=self.convert_error_message(prev_error), icon=icon)

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

        props.label(text="Experimental Updates:")
        props.row().prop(self, "check_experimental_updates")
        props.row().prop(self, "use_experimental_installer")

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
                                       description=f"Error Code: '{issue_type}'",
                                       get=get_expanded,
                                       set=set_expanded)


def register():
    add_issue_types_to_prefs()

    for cls in classes:
        bpy.utils.register_class(cls)


def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
