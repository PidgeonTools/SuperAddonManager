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

## sam_not_supported

**Special Error**

The bl_info of an Addon doesn't contain an Endpoint URL and/or the addon consists only of a single file.

<SamNotSupported />

## bl_info_version_problems

**Critical Error**

The version set in bl_info either is invalid or doesn't exist.
<BlInfoVersionProblems />

## endpoint_url_invalid

**Critical Error**

The URL Endpoint set in bl_info either is invalid or doesn't exist.
<UrlInvalid />

## endpoint_offline

**Critical Error**

The URL Endpoint doesn't respond. Most likely, this issue occurs because of missing Internet connection.
<EndpointOffline />

## invalid_endpoint

**Critical Error**

The URL Endpoint isn't in JSON format.
<InvalidEndpoint />

## endpoint_invalid_schema

**Critical Error**

The URL Endpoint doesn't match the specified schema.
<EndpointInvalidSchema />

## invalid_file_type

**Critical Error**

The file that Super Addon Manager tried to download is not a Zip file. Super Addon Manager can only handle Zip files.
<InvalidFileType />

## invalid_download_url

**Critical Error**

The download URL set in the Endpoint either is invalid or doesn't exist.
<InvalidDownloadUrl />

## download_url_offline

**Critical Error**

The download URL doesn't respond. Most likely, this issue occurs because of missing Internet connection.
<DownloadUrlOffline />

## not_an_addon

**Critical Error**

The downloaded file is not an addon.
<NotAnAddon />


## unknown_error

**Special Error**

Any other error that needs to be investigated by us.
<UnknownError />
