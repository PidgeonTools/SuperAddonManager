---
title: Fehlercodes
description: Eine vollständige Liste der Fehlercodes für Super Addon Manager.
for: Entwickler
category: Error Handling
category-index: 2
page-index: 3
---

Many things can go wrong with this addon, since Super Addon Manager can't control how Developers implement support for it. Therefore, Super Addon Manager tries to determine these issues and return an error code that triggers a customized template issue report.

This is a list of all Error codes, their status and the issue report template they trigger:

## sam_not_supported

**Spezieller Fehler**

The bl_info of an Addon doesn't contain an Endpoint URL and/or the addon consists only of a single file.

<SamNotSupported />

## bl_info_version_problems

**Kritischer Fehler**

Die in bl_info festgelegte Version ist entweder ungültig oder existiert nicht.
<BlInfoVersionProblems />

## url_invalid

**Kritischer Fehler**

The URL Endpoint set in bl_info either is invalid or doesn't exist.
<UrlInvalid />

## endpoint_offline

**Kritischer Fehler**

Der URL Endpunkt antwortet nicht. Höchstwahrscheinlich tritt dieser Fehler aufgrund fehlender Internetverbindung auf.
<EndpointOffline />

## invalid_endpoint

**Kritischer Fehler**

The URL Endpoint isn't in JSON format.
<InvalidEndpoint />

## endpoint_invalid_schema

**Kritischer Fehler**

The URL Endpoint doesn't match the specified schema.
<EndpointInvalidSchema />

## unknown_error

**Spezieller Fehler**

Jeder andere Fehler, der von uns untersucht werden muss.
<UnknownError />
