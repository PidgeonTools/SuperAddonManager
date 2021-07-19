import bpy

import platform

import urllib
import urllib.parse


# ----- Critical Issues -------------------------------------------------------

# The Endpoint is offline.
def endpoint_offline():
    payload = f"""
    Title:
    Super Addon Manager: Endpoint URL can't be reached

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: The specified Endpoint URL seems to be offline, so Super Addon Manager can't check for new versions. Thank you for having a look at this :)

    """
    return payload.replace("    ", "")


# The Endpoint is not in the JSON format.
def invalid_endpoint(endpoint_url):
    payload = f"""
    Title:
    Super Addon Manager: Invalid Endpoint

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: The endpoint found under {endpoint_url} isn't in the JSON format, so Super Addon Manager can't check for new versions. Thank you for having a look at this :)
    """
    return payload.replace("    ", "")


# No version is specified in the Endpoint.
def endpoint_data_no_version(endpoint_url):
    payload = f"""
    Title:
    Super Addon Manager: No Version specified (JSON Endpoint)

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: In the endpoint, found under this URL: {endpoint_url}, a parameter called 'version' should be specified. This parameter isn't specified, or it's misspelled. Without this parameter, Super Addon Manager can't work. (More details: https://github.com/BlenderDefender/SuperAddonManager/wiki/troubleshooting ) Thank you for having a look at this :)"""
    return payload.replace("    ", "")


# An invalid version is specified in the bl_info.
def endpoint_data_invalid_version(endpoint_url, endpoint_version):
    payload = f"""
    Title:
    Super Addon Manager: Invalid New Version

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: In the endpoint, found under this URL: {endpoint_url}, a parameter called 'version' should be set. This parameter is set to an invalid datatype ({endpoint_version}), so Super Addon Manager can't check for new versions. Thank you for having a look at this :)

    """
    return payload.replace("    ", "")

# The current version is greater than the version specified in the Endpoint.


def current_version_greater(endpoint_url, endpoint_version, current_version):
    payload = f"""
    Title:
    Super Addon Manager: Current Version is greater

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager.
    Unfortunately, something is wrong with the Implementation:
    In the endpoint, found under this URL: {endpoint_url}, the parameter 'version' is set to {endpoint_version}.
    The current version (set in the bl_info dictionary, {current_version}) is newer, therefore Super Addon Manager can't work.
    Thank you for having a look at this :)"""
    return payload.replace("    ", "")


# The URL Endpoint doesn't contain a download URL.
def endpoint_data_no_download_url(endpoint_url):
    payload = f"""
    Title:
    Super Addon Manager: No Download URL (JSON Endpoint)

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager.
    Unfortunately, something is wrong with the Implementation:
    In the endpoint, found under this URL: {endpoint_url}, a parameter called 'download_url' should be specified.
    This parameter isn't specified, or it's misspelled.
    Without this parameter, Super Addon Manager can't work. (More details: https://github.com/BlenderDefender/SuperAddonManager/wiki/troubleshooting )
    Thank you for having a look at this :)"""
    return payload.replace("    ", "")


# ----- Non-Critical Issues ---------------------------------------------------

# The URL Endpoint doesn't specify a download method.
# Therefore, the default mode (Manual Download) is applied.
def endpoint_data_no_download_method(endpoint_url):
    payload = f"""
    Title:
    Super Addon Manager: No Download Method (JSON Endpoint)

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager.
    Unfortunately, something is wrong with the Implementation:
    In the endpoint, found under this URL: {endpoint_url}, a parameter called 'automatic_download' should be specified.
    This parameter isn't specified, or it's misspelled.
    Without this parameter, the automatic update feature can't work.
    Super Addon Manager can still work tho, so this issue isn't critical.
    Thank you for having a look at this :)"""
    return payload.replace("    ", "")


# The version info file doesn't specify a display Name.
# Therefore, the Folder name is shown.
def bl_info_no_name(folder_path):
    payload = f"""
    Title:
    Super Addon Manager: No Addon Name specified

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager.
    Unfortunately, something is wrong with the Implementation:
    In the bl_info dictionary, a parameter called 'name' should be defined.
    This parameter isn't specified, or it's misspelled.
    Without this parameter, both, Super Addon Manager AND Blender can't display a proper name of your addon (Current Display Name: The folder name '{folder_name}').
    Super Addon Manager can still work tho, so this issue isn't critical.
    Thank you for having a look at this :)"""
    return str(payload).replace("    ", "")


# ----- Issue Report Generation -----------------------------------------------
def generate_report(data):
    base_url = "http://localhost:5500/request-support.html?"

    issue_type = data["issue_type"]

    addon_version = "Unknown"
    if not issue_type in ["bl_info_version_problems"]:
        addon_version = ".".join(map(str, data["bl_info"]["version"]))

    url_params = {"issue_type": data["issue_type"],
                  "addon_name": data["addon_name"],
                  "os_name": platform.system(),
                  "blender_version": bpy.app.version_string,
                  "addon_version": addon_version
                  }

    if "tracker_url" in data["bl_info"].keys():
        url_params["tracker_url"] = data["bl_info"]["tracker_url"]

    if issue_type in ["single_file", "sam_not_supported"]:
        addon_count = data["addon_count"]

    if issue_type in ["url_invalid", "invalid_endpoint", "endpoint_data_no_version", "endpoint_data_no_download_url", "endpoint_data_no_download_method", "endpoint_data_invalid_version", "current_version_greater"]:
        url_params["endpoint_url"] = data["endpoint_url"]

    if issue_type in ["endpoint_data_invalid_version", "current_version_greater"]:
        url_params["endpoint_version"] = data["endpoint_version"]

    return base_url + urllib.parse.urlencode(url_params)


# Test.
if __name__ == "__main__":
    bl_info = {
        "name": "Test Addon",
        "author": "Blender Defender",
        "version": (1, 0, 0),
        "blender": (2, 83, 0),
        "location": "Test",
        "description": "",
        "warning": "",
        "wiki_url": "",
        "tracker_url": "https://github.com/BlenderDefender/SuperProjectManager/issues/new",
        "category": "General"
    }

    issue = generate_report({"issue_type": "url_invalid",
                             "addon_name": "Test Addon", "bl_info": bl_info, "endpoint_url": "test"})

    print(issue)
