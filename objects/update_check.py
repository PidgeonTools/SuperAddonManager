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
from ..issue_types import (
    BL_INFO_VERSION_PROBLEMS,
    ENDPOINT_INVALID_SCHEMA
)


class UpdateCheck_v1_0_0:
    def __init__(self, data={}, addon_name="", bl_info={}, endpoint_url="") -> None:
        self.update = False  # Set to True, if an update is available.
        self.error = False  # Set to True, if an error occured.
        self.error_data = {
            "addon_name": addon_name,
            "bl_info": bl_info
        }

        # The current Blender version.
        self.blender_version = self.pad_tuple(bpy.app.version)

        # The current addon version.
        try:
            self.current_version = self.pad_tuple(bl_info["version"])
        except (KeyError, ValueError, TypeError):
            self._set_error(issue_type=BL_INFO_VERSION_PROBLEMS)
            return  # ! Critical Error

        # Make sure that there is a list of addon versions.
        if not "versions" in data.keys():
            self._set_error(issue_type=ENDPOINT_INVALID_SCHEMA,
                            endpoint_url=endpoint_url)
            return  # ! Critical Error

        # The list of addon versions.
        self.versions = data["versions"][:]  # Create a local copy.

        # Format all version lists inside self.versions to be a tuple of three integers.
        try:
            self.pad_version_list()
        except (KeyError, ValueError, TypeError):
            self._set_error(issue_type=ENDPOINT_INVALID_SCHEMA,
                            endpoint_url=endpoint_url)
            return  # ! Critical Error

        # Filter the list of versions to only contain compatible versions
        candidate_versions = list(
            filter(self._is_compatible_version, self.versions))
        candidate_versions.sort(reverse=True, key=lambda v: v["version"])

        # Get the latest compatible version and check, if an update is available.
        latest_compatible_version = candidate_versions[0] if candidate_versions else None
        self.update = latest_compatible_version and latest_compatible_version[
            "version"] > self.current_version

        if not "download_url" in latest_compatible_version.keys():
            self._set_error(issue_type=ENDPOINT_INVALID_SCHEMA,
                            endpoint_url=endpoint_url)
            return  # ! Critical Error

        # Set the data, that is required to update the addon.
        if self.update:
            self.version = latest_compatible_version["version"]
            self.automatic_download = False
            if "allow_automatic_download" in latest_compatible_version.keys():
                self.automatic_download = latest_compatible_version["allow_automatic_download"]

            self.download_url = latest_compatible_version["download_url"]

    # Format all version lists inside self.versions to be a tuple of three integers.
    def pad_version_list(self):
        for version in self.versions:
            version["version"] = self.pad_tuple(version["version"])

            version["minimum_blender_version"] = self.pad_tuple(
                version["minimum_blender_version"])

            if "api_breaking_blender_version" in version.keys():
                version["api_breaking_blender_version"] = self.pad_tuple(
                    version["api_breaking_blender_version"])

    # Check, if a given version is compatible with the current version of Blender.
    def _is_compatible_version(self, v: dict):
        is_minimum_compatible = self.blender_version >= v["minimum_blender_version"]

        if "api_breaking_blender_version" in v.keys():
            # In case that the API breaking Blender Version was misunderstood,
            # and set to a Blender Version smaller than the minimum Blender Version,
            # ignore and remove it from the data.
            if v["minimum_blender_version"] > v["api_breaking_blender_version"]:
                v.pop("api_breaking_blender_version")
                return is_minimum_compatible

            return is_minimum_compatible and self.blender_version < v["api_breaking_blender_version"]

        return is_minimum_compatible

    def _set_error(self, **kwargs):
        """Set the error state to True and the error data to all of the required data."""
        self.error = True
        for key, value in kwargs.items():
            self.error_data[key] = value

    # Convert a list into a tuple of three integers.
    def pad_tuple(self, t):
        # Convert all raw values to integers, to avoid issues, when comparing versions
        def type_convert(x):
            allowed_types = [int, float, str]
            if type(x) in allowed_types:
                return int(x)
            raise ValueError

        t = map(type_convert, t)
        return (tuple(t) + (0, 0, 0))[:3]
