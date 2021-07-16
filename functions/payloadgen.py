from os import path as p


# TODO: Change the Generic Issue Text to contain a checklist.
def generic_issue_text(error_status, addon_path, issue, additional_context=""):
    addon_name = p.basename(addon_path).replace("-master", "")
    if additional_context != "":
        additional_context = " " + additional_context
    return f"""
    There's a {error_status} issue with the addon {addon_name} (Install Location: {addon_path}):
    {issue}
    It would be good if you could report an issue (Instructions on how to submit issues on different
    platforms: https://github.com/BlenderDefender/SuperAddonManager/wiki/submiting-issues)

    !!!ATTENTION!!!
    Please make sure this issue hasn't been reported before AND it still exists.
    Double-check the issue isn't on your side (e. g. missing Internet connection).{additional_context}

    If these conditions apply, you can write an own Issue Report or use this template (ONLY IF IT MATCHES THE GUIDELINES!):

    """


# ----- Special Issues --------------------------------------------------------

# The Super Addon Manager is not supported.
def sam_not_supported(folder_path, addon_count):
    addon_name = p.basename(folder_path).replace("-master", "").capitalize()
    payload = f"""
    There's a special issue with the addon {addon_name} (Install Location: {folder_path}):
    The Addon doesn't support Super Addon Manager and can't be updated automatically.
    For Super Addon Manager to work, it's necessary that developers enable support for it.
    The developers of {addon_name} probably don't even know about Super Addon Manager yet, so it's time to tell them.
    Please open a feature request asking the developers to enable support for Super Addon Manager.

    !!!ATTENTION!!!
    Please make sure this feature request hasn't been made before AND Super Addon Manager is still not supported by {addon_name}.

    If these conditions apply, you can write an own Feature Request or use this template (ONLY IF IT MATCHES THE GUIDELINES!):

    Title:
    Super Addon Manager Support

    Body:
    **Is your feature request related to a problem? Please describe.**
    After using Blender for a while now (including your addon), I've noticed that addon maintenance is a mess. I have {addon_count} addons installed, and I'm not able to keep track of new versions for all of them. I'm using the Super Addon Manager by Blender Defender (https://github.com/BlenderDefender/SuperAddonManager) to do the task of updating ALL of my Addons from a SINGLE PLACE, but it relies on the developers enabling support for it.

    **Describe the solution you'd like**
    It would be great if you could activate support for it. Doing so is easy, 100% risk-free (No code added to your addon), and platform-independent. You can find a detailed description for enabling support for Super Addon Manager on their documentation: https://github.com/BlenderDefender/SuperAddonManager/wiki/implementation/"

    """
    return payload.replace("    ", "")


# ----- Critical Issues -------------------------------------------------------

# No version is specified in the bl_info.
def bl_info_no_version(folder_path):
    payload = f"""
    {generic_issue_text("critical", folder_path, "In the bl_info, the parameter 'version' isn't set, so Super Addon Manager can't check for updates.")}
    Title:
    Super Addon Manager: No Current Version specified

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: In the bl_info dictionary, a parameter called 'version' should be set. This parameter isn't specified, or it's misspelled. Without this parameter, Super Addon Manager can't work. (More details: https://github.com/BlenderDefender/SuperAddonManager/wiki/troubleshooting ) Thank you for having a look at this :)"

    """
    return payload.replace("    ", "")


# An invalid version is specified in the bl_info.
def bl_info_invalid_version(folder_path, bl_info_version):
    payload = f"""
    {generic_issue_text("critical", folder_path, f"The parameter 'version' in the bl_info is set to an invalid Version Number ({bl_info_version}) and Super Addon Manager can't check for updates.")}
    Title:
    Super Addon Manager: Invalid Current Version

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: In the bl_info dictionary, a parameter called 'version' should be set. This parameter is set to an invalid datatype ({bl_info_version}), so Super Addon Manager can't check for new versions. Thank you for having a look at this :)

    """
    return payload.replace("    ", "")


# The Endpoint is offline.
def endpoint_offline(folder_path, endpoint_url):
    payload = f"""
    {generic_issue_text("critical", folder_path, f"The Endpoint ({endpoint_url}) seems to be offline. Please double check you are connected to the internet before submitting an issue.")}
    Title:
    Super Addon Manager: Endpoint URL can't be reached

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: The specified Endpoint URL seems to be offline, so Super Addon Manager can't check for new versions. Thank you for having a look at this :)

    """
    return payload.replace("    ", "")


# An invalid Endpoint URL is specified in the bl_info.
def url_invalid(folder_path, endpoint_url):
    payload = f"""
    {generic_issue_text("critical", folder_path, "The parameter 'endpoint_url' in the bl_info is set to an invalid URL and Super Addon Manager can't check for updates.")}
    Title:
    Super Addon Manager: Invalid Endpoint URL

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: In the bl_info dictionary, a parameter called 'endpoint_url' should be set. This parameter is set to an invalid URL ({endpoint_url}), so Super Addon Manager can't check for new versions. Thank you for having a look at this :)

    """
    return payload.replace("    ", "")


# The Endpoint is not in the JSON format.
def invalid_endpoint(folder_path, endpoint_url):
    payload = f"""
    {generic_issue_text("critical", folder_path, "The URL Endpoint is not in the JSON format.", f"Before submitting an issue, please take a look at the file found at {endpoint_url}. It should be in the JSON format. Unsure? You can find a detailed description for understanding the endpoint content on the page https://github.com/BlenderDefender/SuperAddonManager/wiki/understanding-the-endpoint.")}
    Title:
    Super Addon Manager: Invalid Endpoint

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: The endpoint found under {endpoint_url} isn't in the JSON format, so Super Addon Manager can't check for new versions. Thank you for having a look at this :)
    """
    return payload.replace("    ", "")


# No version is specified in the Endpoint.
def endpoint_data_no_version(folder_path, endpoint_url):
    payload = f"""
    {generic_issue_text("critical", folder_path, "The URL Endpoint doesn't contain a version. Super Addon Manager can't update the addon (if an update is available)", f"Before submitting an issue, please take a look at the file found at {endpoint_url}. It should contain a parameter called 'version'. Unsure? You can find a detailed description for understanding the endpoint content on the page https://github.com/BlenderDefender/SuperAddonManager/wiki/understanding-the-endpoint.")}
    Title:
    Super Addon Manager: No Version specified (JSON Endpoint)

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: In the endpoint, found under this URL: {endpoint_url}, a parameter called 'version' should be specified. This parameter isn't specified, or it's misspelled. Without this parameter, Super Addon Manager can't work. (More details: https://github.com/BlenderDefender/SuperAddonManager/wiki/troubleshooting ) Thank you for having a look at this :)"""
    return payload.replace("    ", "")


# An invalid version is specified in the bl_info.
def endpoint_data_invalid_version(folder_path, endpoint_url, endpoint_version):
    payload = f"""
    {generic_issue_text("critical", folder_path, f"The parameter 'version' in the endpoint is set to an invalid Version Number ({endpoint_version}) and Super Addon Manager can't check for updates.")}
    Title:
    Super Addon Manager: Invalid New Version

    Body:
    **Describe the bug**
    Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: In the endpoint, found under this URL: {endpoint_url}, a parameter called 'version' should be set. This parameter is set to an invalid datatype ({endpoint_version}), so Super Addon Manager can't check for new versions. Thank you for having a look at this :)

    """
    return payload.replace("    ", "")

# The current version is greater than the version specified in the Endpoint.


def current_version_greater(folder_path, endpoint_url, endpoint_version, current_version):
    payload = f"""
    {generic_issue_text("critical", folder_path, "The current version is newer than the version specified in the Endpoint. This means, according to the endpoint, you're using a newer version than the one currently available. NOTE: If you're using an alpha version, this might actually be the case and you can ignore this issue report.")}
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
def endpoint_data_no_download_url(folder_path, endpoint_url):
    payload = f"""
    {generic_issue_text("critical", folder_path, "The URL Endpoint doesn't contain a download URL. Super Addon Manager can't update the addon (if an update is available)", f"Before submitting an issue, please take a look at the file found at {endpoint_url}. It should contain a parameter called 'download_url'. Unsure? You can find a detailed description for understanding the endpoint content on the page https://github.com/BlenderDefender/SuperAddonManager/wiki/understanding-the-endpoint.")}
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
def endpoint_data_no_download_method(folder_path, endpoint_url):
    payload = f"""
    {generic_issue_text("non-critical", folder_path, "The URL Endpoint doesn't specify a download method. Therefore, the only way to download a new version is to do it manually, which is less convenient.")}
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
    folder_name = p.basename(folder_path).replace("-master", "").capitalize()
    payload = f"""
    {generic_issue_text("non-critical", folder_path, "The addon doesn't specify a display name. Therefore, the folder name is displayed, which leads to an inconvenient user experience.")}
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
    issue_type = data[0]

    if issue_type == "single_file" or issue_type == "sam_not_supported":
        threshold = 15

        folder_path = data[1]
        addon_count = str(data[2]) if data[2] >= threshold else "multiple"
        issue_text = sam_not_supported(folder_path, addon_count)
    elif issue_type == "bl_info_no_version":
        folder_path = data[1]
        issue_text = bl_info_no_version(folder_path)
    elif issue_type == "bl_info_invalid_version":
        folder_path = data[1]
        bl_info_version = data[2]
        issue_text = bl_info_invalid_version(folder_path, bl_info_version)
    elif issue_type == "endpoint_offline":
        folder_path = data[1]
        endpoint_url = data[2]
        issue_text = endpoint_offline(folder_path, endpoint_url)
    elif issue_type == "url_invalid":
        folder_path = data[1]
        endpoint_url = data[2]
        issue_text = url_invalid(folder_path, endpoint_url)
    elif issue_type == "invalid_endpoint":
        folder_path = data[1]
        endpoint_url = data[2]
        issue_text = invalid_endpoint(folder_path, endpoint_url)
    elif issue_type == "endpoint_data_no_version":
        folder_path = data[1]
        endpoint_url = data[2]
        issue_text = endpoint_data_no_version(folder_path, endpoint_url)
    elif issue_type == "endpoint_data_invalid_version":
        folder_path = data[1]
        endpoint_url = data[2]
        endpoint_version = data[3]
        issue_text = endpoint_data_invalid_version(
            folder_path, endpoint_url, endpoint_version)
    elif issue_type == "current_version_greater":
        folder_path = data[1]
        endpoint_url = data[2]
        endpoint_version = data[3]
        current_version = data[4]

        issue_text = current_version_greater(
            folder_path, endpoint_url, endpoint_version, current_version)
    elif issue_type == "endpoint_data_no_download_url":
        folder_path = data[1]
        endpoint_url = data[2]
        issue_text = endpoint_data_no_download_url(folder_path, endpoint_url)
    elif issue_type == "endpoint_data_no_download_method":
        folder_path = data[1]
        endpoint_url = data[2]
        issue_text = endpoint_data_no_download_method(
            folder_path, endpoint_url)
    elif issue_type == "bl_info_no_name":
        folder_path = data[1]
        issue_text = bl_info_no_name(folder_path)

    return issue_text + "\nThis issue report was automatically generated by Super Addon Manager."


# Test.
if __name__ == "__main__":
    issue = generate_report(
        ["endpoint_data_invalid_version", "test/test", "https://www.example.com", ["14", "what tha?"]])
    # issue = current_version_greater(
    #     "test/test", "https://www.example.com", [0, 0, 0], [0, 0, 1])
    with open("t.txt", "w+") as f:
        f.write(issue)
    print(issue)
