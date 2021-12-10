---
title: Error Codes
description: The full list of Error Codes for Super Addon Manager.
for: Developers
category: Error Handling
category-index: 2
page-index: 3
---

Many things can go wrong with this addon, since Super Addon Manager can't control how Developers
implement support for it. Therefore, Super Addon Manager tries to determine these issues and return
an error code that triggers a customized template issue report.

This is a list of all Error codes, their status and the issue report template they trigger:

<!-- | class="table table-bordered table-striped table-hover table-light"**Error Code** | **Description** | **Status** | **Issue Report Template** |
| -------------------------------------------------------------------------------- | --------------- | ---------- | ------------------------- | -->

## sam_not_supported

**Special Error**

The bl_info of an Addon doesn't contain an Endpoint URL and/or the addon consists only of a single file.

Title:

```md
[Super Addon Manager] Support checking {addon_name} for updates
```

Issue Text Template:

```md
**Is your feature request related to a problem? Please describe.**
After using Blender for a while now (including your addon), I've noticed that addon maintenance is a mess. I have {addon_count} addons installed, and I'm not able to keep track of new versions for all of them. I'm using the Super Addon Manager by Blender Defender (https://github.com/BlenderDefender/SuperAddonManager) to do the task of updating ALL of my Addons from a SINGLE PLACE, but it relies on the developers enabling support for it.

**Describe the solution you'd like**
It would be great if you could activate support for it. Doing so is easy, 100% code-free (no risk of accidentally breaking your addon), and platform-independent. You can find a detailed description for enabling support for Super Addon Manager on their documentation: https//TODO
```

## bl_info_version_problems

**Critical Error**

The version set in bl_info either is invalid or doesn't exist.

Title:

```md
[Super Addon Manager] Problems with the Current Version
```

Issue Text Template:

```md
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: In the bl_info dictionary, a parameter called 'version' should be set. This parameter is not set, misspelled or contains an invalid datatype (Only integers, floats and numbers in strings can be converted to integers), so Super Addon Manager can't check for new versions. Thank you for having a look at this :)
```

## url_invalid

**Critical Error**

The URL Endpoint doesn't exist.

Title:

```md
[Super Addon Manager] Invalid Endpoint URL
```

Issue Text Template:

```md
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: In the bl_info dictionary, a parameter called 'update_endpoint' should be set. This parameter is set to an invalid URL ({endpoint_url}), so Super Addon Manager can't check for new versions. Thank you for having a look at this :)
```

## endpoint_offline

**Critical Error**

The URL Endpoint doesn't respond. Most likely, this issue occurs because of missing Internet connection.

Title:

```md
[Super Addon Manager] Endpoint URL can't be reached
```

Issue Text Template:

```md
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: The specified Endpoint URL ({endpoint_url}) seems to be offline, so Super Addon Manager can't check for new versions. This is the bare error message that I get from Python: {error_message}. Thank you for having a look at this :)
```

## invalid_endpoint

**Critical Error**

The URL Endpoint isn't in JSON format.

Title:

```md
[Super Addon Manager] Invalid Endpoint
```

Issue Text Template:

```md
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: The endpoint found under {endpoint_url} is not in the JSON format, so Super Addon Manager can't check for new versions. Thank you for having a look at this :)
```

## endpoint_invalid_schema

**Critical Error**

The URL Endpoint doesn't match the specified schema.

Title:

```md
[Super Addon Manager] Endpoint doesn't match the schema
```

Issue Text Template:

```md
**Describe the bug**
Thank you for enabling support for the Super Addon Manager. Unfortunately, something is wrong with the Implementation: The endpoint found under {endpoint_url} does not match the schema, so Super Addon Manager can't check for new versions. For more details, use our [schema checker.](SCHEMA CHECKER URL) Thank you for having a look at this :)
```

## unknown_error

**Special Error**

Any other error that needs to be investigated by us.

Title:

```md
[{addon_name}] Unknown Error
```

Issue Text Template:

```md
**Describe the bug**
An unknown error occurred with the addon {addon_name}: {error_message}
```
