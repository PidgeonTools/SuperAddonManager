import bpy
from bpy.props import (
    StringProperty
)

from .main_functions import (
    expand_all
)

Scene = bpy.types.Scene


def register_props():
    Scene.error_search_term = StringProperty(
        name="Search addon",
        description="Search for an addon in the error list.",
        options={"TEXTEDIT_UPDATE"},
        update=expand_all
    )
