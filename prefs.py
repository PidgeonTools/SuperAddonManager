import bpy
from bpy.types import AddonPreferences

from os import path as p


# Create the lists for addons, that either have available updates
# or addons, that have issues and can't be updated.
updates = []
unavailable_addons = []


class SUPERADDONMANAGER_APT_preferences(AddonPreferences):
    """Preferences of Super Addon Manager."""
    bl_idname = __package__

    def draw(self, context):
        layout = self.layout

        # Check for Updates Operator.
        layout.operator("superaddonmanager.check_for_updates")

        # Layout the "Update All"-Operator when at least two addons have updates.
        if len(updates) > 1:
            layout.operator("superaddonmanager.update_all")

        # Layout all Addons that can be Updated one by one.
        for addon in updates:
            row = layout.row()
            row.label(text=addon[3])
            if addon[1]:  # Check, if the Addon supports Auto-Update.
                op = row.operator("superaddonmanager.automatic_update")
                op.addon_path = addon[0]
            else:
                op = row.operator("superaddonmanager.manual_update",
                                  text="Go to the downloads page.")
            op.download_url = addon[2]
            # TODO: Exchange the operator after Updating --> Maybe with another list - Updated_Addons

        # Show a warning, that some addons couldn't be properly updated,
        # if at least one addon ran into any kind of issue.
        if len(unavailable_addons) > 0:
            layout.label(
                text=f"{len(unavailable_addons)} errors occured when checking for Updates:", icon="ERROR")
        for addon in unavailable_addons:  # Layout all issues.
            row = layout.row()
            row.label(text=p.basename(addon[1]))
            row.label(text=f"Error Code: {addon[0]}")
            row.label(text="Get detailed issue report Operator - TODO")


classes = (
    SUPERADDONMANAGER_APT_preferences,
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)


def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
