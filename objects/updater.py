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

from .recursive_dirs import RecursiveDirs

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
    def __init__(self, addon_name="", bl_info={"version": (0, 0, 0)}, allow_automatic_download=False, download_url="", addon_path="", download_directory=p.join(p.expanduser('~'), 'downloads'), addon_version=(0, 0, 0), auto_reload=False) -> None:
        self.error = False  # Set to True, if an error occured.
        self.error_data = {
            "addon_name": addon_name,
            "bl_info": bl_info
        }
        self.reload_after_update = auto_reload

        self.update_context = UPDATE_CONTEXTS["DOWNLOAD"]

        self.allow_automatic_download = allow_automatic_download

        self.addon_name = addon_name
        self.addon_path = addon_path
        self.addon_version = addon_version
        self.old_version = bl_info["version"]

        self.download_url = download_url
        self.download_directory = p.join(
            download_directory, "Super Addon Manager Downloads")
        self.downloaded_file_path = None

    # Download the ZIP file for updating.
    def download_update(self):
        if not self.allow_automatic_download:
            bpy.ops.wm.url_open(url=self.download_url)
            return

        # Make the download directory, if it doesn't exist.
        if not p.exists(self.download_directory):
            os.makedirs(self.download_directory)

        # Set the filename to the name of the directory where it is installed,
        # combined with the version number.
        addon_dirname = p.basename(self.addon_path)
        addon_version = '.'.join([str(v) for v in self.addon_version])
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
                self._handle_error(issue_type=INVALID_FILE_TYPE)
                return  # Critical Error

            # Download the file
            self._download(
                download_data, self.downloaded_file_path, first_bytes)
        except ValueError:  # The URL is invalid.
            self._handle_error(issue_type=INVALID_DOWNLOAD_URL,
                               download_url=self.download_url)
            return  # Critical Error
        # Any other exception. Most likely, there's no Internet connection or the server doesn't respond.
        except Exception as e:
            self._handle_error(issue_type=DOWNLOAD_URL_OFFLINE, error_message=str(
                e), download_url=self.download_url)
            return  # Critical Error

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
            # Critical Error
            return f"Update of '{self.addon_name}' failed: Please select a .zip file."

        if not zfile:
            # Critical Error
            return f"Update of '{self.addon_name}' failed: Please select a .zip file."

        file_list = zfile.namelist()
        # remove_subpath: Subpath to remove when the addon is stored in a subdirectory.
        # filtered_files: Filtered List of files that should be extracted.
        remove_subpath, filtered_files = RecursiveDirs(file_list).extract_files

        if not filtered_files:
            self._handle_error(issue_type=NOT_AN_ADDON,
                               file_list=zfile.namelist())
            return  # Critical Error

        # Create a temporary folder for extracting the ZIP file:
        timestring = time.strftime('%Y%m%d%H%M%S') + \
            str(random.randint(10**5, 10**6-1))
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

        if not p.isdir(extract_path):
            return  # TODO

        if not p.isfile(p.join(extract_path, "__init__.py")):
            self._handle_error(issue_type=NOT_AN_ADDON,
                               file_list=zfile.namelist())
            return  # Critical Error

        # Get the install directory.
        install_directory = self.addon_path
        self._create_backup(install_directory)

        self._install_files(extract_path, install_directory)

        # Remove the extract directory after updating.
        shutil.rmtree(extract_path)

        # Reload the addon after updating.
        try:
            reload_status = self._reload_addon()
            if reload_status:
                return reload_status
        except Exception as e:
            return f"Reloading {self.addon_name} automatically failed. Please restart Blender after all Updates have completed."

    def _create_backup(self, install_directory):
        """Create a backup of the install directory."""
        # Get the backup directory.
        version = ".".join([str(i) for i in self.old_version])
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

        bpy.ops.preferences.addon_disable(module=p.basename(self.addon_path))
        bpy.ops.preferences.addon_refresh()
        bpy.ops.preferences.addon_enable(module=p.basename(self.addon_path))

    def _handle_error(self, **kwargs):
        self.error = True
        for key in kwargs.keys():
            self.error_data[key] = kwargs[key]
