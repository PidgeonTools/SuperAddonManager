import bpy

import platform

import urllib
import urllib.parse


def generate_report(data):
    base_url = "http://localhost:5500/request-support.html?"

    issue_type = data["issue_type"]

    addon_version = "Unknown"
    if issue_type != "bl_info_version_problems" and "version" in data["bl_info"].keys():
        addon_version = ".".join(map(str, data["bl_info"]["version"]))

    url_params = {"issue_type": issue_type,
                  "addon_name": data["addon_name"],
                  "os_name": platform.system(),
                  "blender_version": bpy.app.version_string,
                  "addon_version": addon_version
                  }

    if "tracker_url" in data["bl_info"].keys():
        url_params["tracker_url"] = data["bl_info"]["tracker_url"]

    if issue_type in ["sam_not_supported"]:
        url_params["addon_count"] = data["addon_count"]

    if issue_type in ["url_invalid", "invalid_endpoint", "endpoint_invalid_schema", "endpoint_offline"]:
        url_params["endpoint_url"] = data["endpoint_url"]

    if issue_type == "endpoint_offline":
        url_params["issue_text"] = data["issue_text"]

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
