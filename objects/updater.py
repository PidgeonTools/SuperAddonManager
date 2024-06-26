# ##### BEGIN GPL LICENSE BLOCK #####
#
#  <A central Updater for all your Addons>
#    Copyright (C) <2023>  <Blender Defender>
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
import addon_utils

import os
from os import path as p

import shutil

import time
import random
import hashlib

from urllib import request

import zipfile

import typing

from .recursive_dirs import RecursiveDirs
from .version_number import VersionNumber

from ..issue_types import (
    DOWNLOAD_URL_OFFLINE,
    INVALID_DOWNLOAD_URL,
    INVALID_FILE_TYPE,
    NOT_AN_ADDON
)

UPDATE_CONTEXTS = {
    "DOWNLOAD": "Download",
    "UPDATE": "Update",
}


class Updater:
    def __init__(self, addon_name="", bl_info={"version": (0, 0, 0)}, allow_automatic_download=False, download_url="", addon_path="", download_directory=p.join(p.expanduser('~'), 'downloads'), addon_version=VersionNumber("0.0.0"), auto_reload=False, release_description="") -> None:
        self.error = False  # Set to True, if an error occured.
        self.error_data = {
            "addon_name": addon_name,
            "bl_info": bl_info
        }
        # Set to True, once the addon files are installed correctly.
        self.success = False

        self.reload_after_update: bool = auto_reload

        self.update_context: str = UPDATE_CONTEXTS["DOWNLOAD"]

        self.allow_automatic_download: bool = allow_automatic_download

        self.addon_name: str = addon_name
        self.addon_path: str = addon_path
        self.addon_version: VersionNumber = addon_version
        self.old_version: VersionNumber = VersionNumber(bl_info["version"])

        self.download_url: str = download_url
        self.download_directory: str = p.join(
            download_directory, "Super Addon Manager Downloads")
        self.downloaded_file_path: typing.Union[str, None] = None

        self.release_description = release_description

    # Download the ZIP file for updating.
    def download_update(self):
        if not self.allow_automatic_download:
            bpy.ops.wm.url_open(url=self.download_url)
            self.update_context = UPDATE_CONTEXTS["UPDATE"]
            return

        # Make the download directory, if it doesn't exist.
        if not p.exists(self.download_directory):
            os.makedirs(self.download_directory)

        # Set the filename to the name of the directory where it is installed,
        # combined with the version number.
        addon_dirname = p.basename(self.addon_path)
        addon_version = str(self.addon_version)
        filename = f"{addon_dirname}-{addon_version}.zip"

        # Set the filepath of the downloaded file to the Download Directory + Filename.
        self.downloaded_file_path = p.join(self.download_directory, filename)

        # Remove the downloaded file, if it already exists to avoid errors.
        if p.exists(self.downloaded_file_path):
            os.remove(self.downloaded_file_path)

        # Try to get file from the download url.
        try:
            download_data = request.urlopen(self.download_url)
            first_bytes = download_data.read(4)
            download_data_headers = dict(download_data.headers)

            # Only allow headers with a content type of either ZIP or unknown binary data.
            header_correct = "application/zip" in download_data_headers[
                "Content-Type"] or "application/octet-stream" in download_data_headers["Content-Type"]

            # If the first bytes are not \x50\x4b\x03\x04,
            # the file is not a zip archive
            if not (header_correct and first_bytes == b"\x50\x4b\x03\x04"):
                self._set_error(issue_type=INVALID_FILE_TYPE,
                                new_version=self.addon_version)
                return  # ! Critical Error

            # Download the file
            self._download(
                download_data, self.downloaded_file_path, first_bytes)
        except ValueError:  # The URL is invalid.
            self._set_error(issue_type=INVALID_DOWNLOAD_URL,
                            download_url=self.download_url)
            return  # ! Critical Error
        # Any other exception. Most likely, there's no Internet connection or the server doesn't respond.
        except Exception as e:
            self._set_error(issue_type=DOWNLOAD_URL_OFFLINE, error_message=str(
                e), download_url=self.download_url)
            return  # ! Critical Error

        self.update_context = UPDATE_CONTEXTS["UPDATE"]

        return

    # Download a file using a HTTPResponse object.
    def _download(self, url_file, file_path, initial_data=b""):
        chunk_size = 1024 * 8  # Download 8kB at a time.
        with open(file_path, "wb") as f:
            # Write initial data, if some data was already read.
            f.write(initial_data)
            while True:
                data = url_file.read(chunk_size)
                if not data:
                    break
                f.write(data)

    def update_addon(self, downloaded_file_path=None) -> None:
        if not self.downloaded_file_path:
            self.downloaded_file_path = downloaded_file_path

        try:
            zfile = zipfile.ZipFile(self.downloaded_file_path, "r")
        except zipfile.BadZipFile:
            # ! Critical Error
            return f"Update of '{self.addon_name}' failed: Please select a .zip file."

        if not zfile:
            # ! Critical Error
            return f"Update of '{self.addon_name}' failed: Please select a .zip file."

        file_list = zfile.namelist()
        # remove_subpath: Subpath to remove when the addon is stored in a subdirectory.
        # filtered_files: Filtered List of files that should be extracted.
        remove_subpath, filtered_files = RecursiveDirs(file_list).extract_files

        if not filtered_files:
            # Return a warning in case of manual download, because the error is likely due to a users mistake.
            if not self.allow_automatic_download:
                return f"Update of '{self.addon_name}' failed: Please select a valid addon. If you're sure that you've collected the right file, please contact the developer."

            self._set_error(issue_type=NOT_AN_ADDON,
                            file_list=zfile.namelist())
            return  # ! Critical Error

        # Create a temporary folder for extracting the ZIP file:
        timestring = time.strftime('%Y%m%d%H%M%S') + \
            str(random.randint(10**5, 10**6 - 1))
        unique_name = hashlib.sha1(timestring.encode("UTF-8")).hexdigest()
        extract_path = p.join(self.download_directory,
                              f"temp-{unique_name}")

        if p.exists(extract_path):
            shutil.rmtree(extract_path)

        # Make the temporary path for extracting the files.
        os.makedirs(extract_path)

        # Extract all files.
        for file in filtered_files:
            extract_file = p.join(
                extract_path, file.replace(remove_subpath, ""))
            extract_file = extract_file.replace("/", os.sep)
            extract_file = extract_file.replace("\\", os.sep)

            if extract_file.endswith(os.sep):
                os.makedirs(extract_file)
            else:
                with open(extract_file, "wb") as f:
                    data = zfile.read(file)
                    f.write(data)

        # For the following steps, make sure that the extraction was successful.
        if not p.isdir(extract_path):
            return f"Update of '{self.addon_name}' failed: Extract Path doesn't exist. Please make sure that the temporary extract path doesn't get removed while Super Addon Manager updates your addon."

        if not p.isfile(p.join(extract_path, "__init__.py")):
            # Return a warning in case of manual download, because the error is likely due to a users mistake.
            if not self.allow_automatic_download:
                return f"Update of '{self.addon_name}' failed: Please select a valid addon. If you're sure that you've collected the right file, please contact the developer."

            self._set_error(issue_type=NOT_AN_ADDON,
                            file_list=zfile.namelist())
            return  # ! Critical Error

        # Get the install directory.
        install_directory = self.addon_path
        self._create_backup(install_directory)

        self._install_files(extract_path, install_directory)

        # Remove the extract directory after updating.
        shutil.rmtree(extract_path)

        self.success = True

        # Reload the addon after updating.
        try:
            reload_status = self._reload_addon()
            if reload_status:
                return reload_status
        except Exception as e:
            return f"Reloading {self.addon_name} automatically failed. Please restart Blender after all Updates have completed."

    def _create_backup(self, install_directory, override_version=None):
        """Create a backup of the install directory."""
        if override_version != None:
            self.old_version = override_version

        # Get the backup directory.
        version = str(self.old_version)
        backup_directory = p.join(
            install_directory, "superaddonmanager-backups", version)

        # Remove the backup directory, if it already exists.
        if p.exists(backup_directory):
            shutil.rmtree(backup_directory)

        # Make the backup directory.
        os.makedirs(backup_directory)

        # Move all files and directories to the backup directory.
        for el in os.listdir(install_directory):
            # Skip the backup directory
            if el == "superaddonmanager-backups":
                continue

            # Path of the element in the backup directory
            backup_path = p.join(backup_directory, el)
            # Full path to the element.
            install_path = p.join(install_directory, el)

            # Copy and remove the file / folder.
            if p.isdir(install_path):
                shutil.copytree(install_path, backup_path)
                shutil.rmtree(install_path)
            else:
                shutil.copyfile(install_path, backup_path)
                os.remove(install_path)

    def _install_files(self, extract_directory, install_directory):
        for el in os.listdir(extract_directory):
            # Skip the backup directory
            if el == "superaddonmanager-backups":
                continue

            install_path = p.join(install_directory, el)
            source_path = p.join(extract_directory, el)

            if p.isdir(source_path):
                shutil.copytree(source_path, install_path)
            else:
                shutil.copyfile(source_path, install_path)

    def _reload_addon(self):
        if not self.reload_after_update:
            return f"Automatic Reload of {self.addon_name} is disabled. Please restart Blender after all Updates have completed."

        addon_utils.modules(refresh=True)
        bpy.utils.refresh_script_paths()

        try:
            bpy.ops.preferences.addon_disable(
                module=p.basename(self.addon_path))
            bpy.ops.preferences.addon_refresh()
            bpy.ops.preferences.addon_enable(
                module=p.basename(self.addon_path))
        except:
            bpy.ops.preferences.addon_enable(
                module=p.basename(self.addon_path))
            return f"Reloading {self.addon_name} automatically failed. Please restart Blender after all Updates have completed."

    def _set_error(self, **kwargs):
        """Set the error state to True and the error data to all of the required data."""
        self.error = True
        for key, value in kwargs.items():
            self.error_data[key] = value
