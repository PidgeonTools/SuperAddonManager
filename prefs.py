import bpy
from bpy.types import AddonPreferences
from bpy.props import (
    FloatProperty
)

from os import path as p

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

    def draw(self, context):
        layout = self.layout

        if checking_for_updates:
            # Checking for updates progress bar.
            layout.label(
                text=f"Checking for updates: {addon_index}/{addons_total}", icon='INFO')
            layout.prop(self, "update_check_percent_complete")
        else:
            # Check for Updates Operator.
            layout.operator("superaddonmanager.check_for_updates")

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


classes = (
    SUPERADDONMANAGER_APT_preferences,
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)


def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
