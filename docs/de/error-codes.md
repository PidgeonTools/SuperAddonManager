---
title: Fehlercodes
description: Eine vollständige Liste der Fehlercodes für Super Addon Manager.
for: Entwickler
category: Fehlerbehandlung
category-index: 2
page-index: 3
---

Viele Dinge können mit Super Addon Manager schief gehen, da es nicht kontrollieren kann, wie die Entwickler die benötigten Daten bereitstellen. Deswegen versucht Super Addon Manager diese Probleme herauszufinden und einen Fehlercode zurückzugeben, der eine ausgefüllte, vorgefertigte Fehlermeldung als Ergebnis hat.

Das ist eine Liste von allen Fehlercodes und den vorgefertigten Fehlermeldungen, die sie auslösen. Diese sind auf Englisch, damit sie international verstanden werden können:

## sam_not_supported

**Spezieller Fehler**

Die bl_info eines Addons enthält keine Endpunkt URL und/oder das Addon besteht nur aus einer einzigen Datei.

<SamNotSupported />

## bl_info_version_problems

**Kritischer Fehler**

Die in bl_info festgelegte Version ist entweder ungültig oder existiert nicht.
<BlInfoVersionProblems />

## endpoint_url_invalid

**Kritischer Fehler**

Die in bl_info festgelegte Endpunkt URL ist entweder ungültig oder existiert nicht.
<UrlInvalid />

## endpoint_offline

**Kritischer Fehler**

Der URL Endpunkt antwortet nicht. Höchstwahrscheinlich tritt dieser Fehler aufgrund fehlender Internetverbindung auf.
<EndpointOffline />

## invalid_endpoint

**Kritischer Fehler**

Der URL Endpunkt ist nicht im JSON-Format.
<InvalidEndpoint />

## endpoint_invalid_schema

**Kritischer Fehler**

Der URL Endpunkt stimmt nicht mit dem vorgegebenen Schema überein.
<EndpointInvalidSchema />

## unknown_error

**Spezieller Fehler**

Jeder andere Fehler, der von uns untersucht werden muss.
<UnknownError />
