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

import json

import re

import requests


class ExperimentalUpdateCheck:
    """Get release information over an API and convert it into data that can be used by Super Addon Manager."""

    def __init__(self, bl_info: dict) -> None:
        api, user_name, repo_name = self.get_user_and_repo(bl_info)

        self.api: str = api

        self.user_name: str = user_name
        self.repo_name: str = repo_name

    def get_user_and_repo(self, bl_info: dict) -> tuple:
        """Try to get the API type, user name and repository name from the bl_info."""

        # Get the three urls that might be included in the bl_info.
        urls = [bl_info.get("doc_url", ""), bl_info.get(
            "wiki_url", ""), bl_info.get("tracker_url", "")]

        api = None
        user_name: str = ""
        repo_name: str = ""

        for u in urls:
            # Search for a GitHub or GitLab Url.
            # Both Urls have the scheme https://github.com/user/repo
            match = re.search(
                "(git(?:hub|lab)).com/([a-zA-Z0-9_-]+)/([a-zA-Z0-9_-]+)", u)

            if match == None:
                continue

            api, user_name, repo_name = match.groups()
            api = api.upper()  # Convert the API to Uppercase for further use.

        return api, user_name, repo_name

    def get_data(self) -> dict:
        """Get the data in the form of an endpoint using either GitHubs or GitLabs API."""
        # Get the preferences of Super Addon Manager.
        prefs = bpy.context.preferences.addons[__package__.split(".")[
            0]].preferences

        # Don't try to get any data, if no API is specified.
        if not self.api:
            return

        if self.api == "GITHUB":
            return self._get_github_data(prefs.use_experimental_installer)

        if self.api == "GITLAB":
            return self._get_gitlab_data(prefs.use_experimental_installer)

        return

    def _get_github_data(self, allow_automatic_download: bool) -> dict:
        """Request the necessary data from the GitHub API."""

        # Get the data from the GitHub releases API.
        res = requests.get(
            f"https://api.github.com/repos/{self.user_name}/{self.repo_name}/releases")

        if not res.ok:
            return  # ! Critical error

        data = json.loads(res.text)

        endpoint_data = {
            "schema_version": "super-addon-manager-version-info-1.0.0",
            "versions": []
        }

        # Iterate over the API data to convert it into data that can be used by Super Addon Manager.
        for d in data:
            d: dict

            # Skip unreleased versions.
            if d.get("draft", True) or d.get("prerelease", True):
                print("Skipping - Draft or Prerelease")
                continue

            # Get the version number and the download url.
            version_string = d.get("tag_name", "")
            download_url = d.get("html_url", "")
            if allow_automatic_download:
                download_url = f"https://github.com/{self.user_name}/{self.repo_name}/archive/refs/tags/{version_string}.zip"

            # Skip versions without version number or download url.
            if version_string == "" or download_url == "":
                continue

            version_array = self.get_version_array(version_string)
            if len(version_array) != 3:
                return  # ! Critical error

            # Add version to the endpoint data.
            endpoint_data["versions"].append({
                "version": list(version_array),
                "download_url": download_url,
                "allow_automatic_download": allow_automatic_download,
                "minimum_blender_version": list(self.pad_tuple(bpy.app.version)),
                "release_description": d.get("body", ""),
            })

        return endpoint_data

    def _get_gitlab_data(self, allow_automatic_download: bool) -> dict:
        """Request the necessary data from the GitLab API."""

        # Request the data from the GitLab Users API to find out the project ID.
        res = requests.get(
            f"https://gitlab.com/api/v4/users/{self.user_name}/projects?simple=true")

        if not res.ok:
            return  # ! Critical error

        projects = json.loads(res.text)

        # Iterate over all user projects and compare the name to get the project ID.
        # This is necessary in order to get information on releases.
        project_id = ""
        for p in projects:
            if p["name"] == self.repo_name:
                project_id = p["id"]
                break

        # Get the data from the GitLab releases API.
        res = requests.get(
            f"https://gitlab.com/api/v4/projects/{project_id}/releases")

        if not res.ok:
            return  # ! Critical error

        data = json.loads(res.text)

        endpoint_data = {
            "schema_version": "super-addon-manager-1.0.0", "versions": []}

        for d in data:
            d: dict

            # Skip unreleased versions.
            if d.get("upcoming_release", True):
                continue

            # Get the version number and the download url.
            version_string = d.get("tag_name", "")
            download_url = d.get("_links", {"self": ""}).get("self", "")
            if allow_automatic_download:
                assets = d.get("assets", {"sources": []}).get("sources", [])

                # Iterate over all assets to get the url of the Zip-File.
                for a in assets:
                    if a.get("format", "") == "zip":
                        if a.get("url", None):
                            download_url = a.get("url", "")

            # Skip versions without version number or download url.
            if version_string == "" or download_url == "":
                continue

            version_array = self.get_version_array(version_string)
            if len(version_array) != 3:
                return  # ! Critical Error

            # Add version to the endpoint data.
            endpoint_data["versions"].append({
                "version": list(version_array),
                "download_url": download_url,
                "allow_automatic_download": allow_automatic_download,
                "minimum_blender_version": list(self.pad_tuple(bpy.app.version)),
                "release_description": d.get("description", ""),
            })

        return endpoint_data

    def get_version_array(self, version_string) -> list:
        """Extract a version number array from a tag name."""
        # Search for a number with one to three parts, e.g. v1, 2.4 or version1.36.0
        version_number = re.search("((?:\d+[\._-]){0,2}\d+)", version_string)

        # Return an empty array, if no version number can be found.
        if not version_number:
            return []

        try:
            version_number = re.sub("[\._-]+", ".", version_number.group(0))

            # Try to convert the version number to a list of length 3.
            version_array = self.pad_tuple(
                version_number.split("."))
            return list(version_array)
        except ValueError:
            return []

    def pad_tuple(self, t) -> tuple:
        """Convert a list into a tuple of three integers."""
        # Convert all raw values to integers, to avoid issues, when comparing versions
        def type_convert(x):
            allowed_types = [int, float, str]
            if type(x) in allowed_types:
                return int(x)
            raise ValueError

        t = map(type_convert, t)
        return (tuple(t) + (0, 0, 0))[:3]
