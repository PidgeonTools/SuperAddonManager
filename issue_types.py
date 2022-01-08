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

# Update Check Issues
BL_INFO_VERSION_PROBLEMS = 'bl_info_version_problems'
SAM_NOT_SUPPORTED = 'sam_not_supported'
ENDPOINT_URL_INVALID = 'endpoint_url_invalid'
ENDPOINT_OFFLINE = 'endpoint_offline'
INVALID_ENDPOINT = 'invalid_endpoint'
ENDPOINT_INVALID_SCHEMA = 'endpoint_invalid_schema'

# Download Issues
INVALID_FILE_TYPE = "invalid_file_type"
INVALID_DOWNLOAD_URL = "invalid_download_url"
DOWNLOAD_URL_OFFLINE = "download_url_offline"

# Installation Issues
NOT_AN_ADDON = "not_an_addon"

# Other Issues
UNKNOWN_ERROR = "unknown_error"

all_issue_types = [
    BL_INFO_VERSION_PROBLEMS,
    ENDPOINT_INVALID_SCHEMA,
    ENDPOINT_OFFLINE,
    INVALID_ENDPOINT,
    SAM_NOT_SUPPORTED,
    ENDPOINT_URL_INVALID,
    INVALID_FILE_TYPE,
    INVALID_DOWNLOAD_URL,
    DOWNLOAD_URL_OFFLINE,
    NOT_AN_ADDON,
    UNKNOWN_ERROR
]
