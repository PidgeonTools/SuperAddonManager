import bpy

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
    INVALID_FILE_TYPE_USER,
    NOT_AN_ADDON
)

UPDATE_CONTEXTS = {
    "DOWNLOAD": "Download",
    "UPDATE": "Update",
}


class Updater:
    def __init__(self, addon_name="", bl_info={"version": (0, 0, 0)}, allow_automatic_download=False, download_url="", addon_path="", download_directory=p.join(p.expanduser('~'), 'downloads'), addon_version=(0, 0, 0)) -> None:
        self.error = False  # Set to True, if an error occured.
        self.error_data = {
            "addon_name": addon_name,
            "bl_info": bl_info
        }

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
                self.error_data["issue_type"] = INVALID_FILE_TYPE
                self.error = True
                return  # Critical Error

            # Download the file
            self._download(
                download_data, self.downloaded_file_path, first_bytes)
        except ValueError:  # The URL is invalid.
            self.error_data["issue_type"] = INVALID_DOWNLOAD_URL
            self.error_data["download_url"] = self.download_url
            self.error = True
            return  # Critical Error
        # Any other exception. Most likely, there's no Internet connection or the server doesn't respond.
        except Exception as e:
            self.error_data["issue_type"] = DOWNLOAD_URL_OFFLINE
            self.error_data["error_message"] = str(e)
            self.error_data["download_url"] = self.download_url
            self.error = True
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
            return INVALID_FILE_TYPE_USER  # Critical Error

        if not zfile:
            return INVALID_FILE_TYPE_USER  # Critical Error

        file_list = zfile.namelist()
        # remove_subpath: Subpath to remove when the addon is stored in a subdirectory.
        # filtered_files: Filtered List of files that should be extracted.
        remove_subpath, filtered_files = RecursiveDirs(file_list).extract_files

        if not filtered_files:
            self.error = True
            self.error_data["issue_type"] = NOT_AN_ADDON
            self.error_data["file_list"] = zfile.namelist()
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

        # Remove the extract directory after updating.
        shutil.rmtree(extract_path)
