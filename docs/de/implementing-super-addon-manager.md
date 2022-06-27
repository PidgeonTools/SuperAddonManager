---
title: Super Addon Manager einbauen
description: Eine Schritt-für-Schritt-Anleitung, die Ihnen zeigt, wie Sie Super Addon Manager in Ihr Addon implementieren.
for: Entwickler
category: Dokumentation für Entwickler
category-index: 1
page-index: 0
---

# Super Addon Manager einbauen

Aufgrund seiner Einfachheit und seiner codefreien Natur (= kein Risiko, Ihr Addon versehentlich zu beschädigen) ist Super Addon Manager die ideale Lösung, wenn Sie die automatische Überprüfung Ihrer Addons auf Updates unterstützen möchten. Diese Schritt-für-Schritt-Anleitung zeigt Ihnen, wie Sie Super Addon Manager in Ihr Addon implementieren können. Anmerkung am Rande: Wenn Ihr Addon etwas kostet, ziehen Sie bitte in Erwägung, mir einen Prozentsatz Ihrer Einnahmen (1% oder höher) zu zahlen, um dieses Projekt am Laufen zu halten. Auf BlenderMarket können Sie mich (TODO: BlenderMarket Name) dafür als "Mitarbeiter" hinzufügen, um mir automatisch einen Teil der Einnahmen zu bezahlen.

## Vorbereitung:

Wenn Ihr Addon nur aus einer einzigen Datei besteht, müssen Sie es in ein Ordner-Addon umwandeln. Erstellen Sie einfach einen neuen Ordner (mit demselben Namen wie das Addon) und benennen Sie Ihr Skript in `__init__.py` um. Dieser genaue Dateiname ist sehr wichtig! Danach sind Sie bereit für die Implementierung von Super Addon Manager.

## Einrichten des Endpunkts:

Der erste Schritt zur Implementierung der Unterstützung für den Super Addon Manager ist die Einrichtung eines sogenannten "Endpoints", einer über das Internet öffentlich zugänglichen Datei, die alle Daten enthält, die der Super Addon Manager benötigt, um nach Updates zu suchen. Diese Datei ist für den Aktualisierungsprozess unerlässlich und muss aktualisiert werden, wenn Sie eine neue Version Ihres Addons veröffentlichen, aber glücklicherweise ist es sehr einfach, sie einzurichten.

### Einrichten mit unserem Endpunkt-Builder Tool:

Mit unserem [Endpoint-Erstellungstool](/endpoint-builder) können Sie einen Endpoint in weniger als einer Minute einrichten oder aktualisieren. Wir empfehlen die Verwendung dieses Tools, da es sehr schnell funktionierende Endpoints erzeugt. Wenn Sie sich für die Verwendung dieses Tools entscheiden, können Sie diesen Artikel [hier fortsetzen.](#hosting-the-endpoint)

### Manuelles Einrichten des Endpunkts:

Wenn Sie den Endpunkt manuell einrichten möchten, müssen Sie eine JSON-Datei erstellen, die wie folgt aussieht:

```json
{
  "schema_version": "super-addon-manager-version-info-1.0.0",
  "versions": [
    {
      "version": [0, 0, 0],
      "allow_automatic_download": true,
      "download_url": "https://www.example.com/my-addon-0.0.0.zip",
      "minimum_blender_version": [2, 83, 0],
      "api_breaking_blender_version": [2, 90, 0]
    }
  ]
}
```

Die Schemaversion bleibt immer dieselbe, Sie können sie also einfach kopieren und in Ihre Datei einfügen. Anschließend erstellen Sie ein Array mit dem Namen "versions" und fügen ihm ein Objekt hinzu:

```json
{
  "schema_version": "super-addon-manager-version-info-1.0.0",
  "versions": [{}]
}
```

This object MUST have the minimum Blender version, the version of your addon (both as array of numbers) and the download URL specified:

```json
{
  "version": [0, 0, 0],
  "download_url": "https://www.example.com/download-my-addon",
  "minimum_blender_version": [2, 83, 0]
}
```

If you allow automatic downloads, the download URL must be a link to the zip file of your addon:

```json
"allow_automatic_download": true,
"download_url": "https://www.example.com/my-addon-0.0.0.zip",
```

Und schließlich, wenn Sie ein Update für eine ältere Version von Blender machen, die nicht mit der neuesten Blender-Version funktioniert, können Sie die API Bleaching Blender Version auf die erste Version von Blender setzen, wo Ihr Addon aufgrund von API-Änderungen nicht funktioniert:

```json
"api_breaking_blender_version": [3, 0, 0]
```

### Hosten des Endpunkts:

Sie sind nun bereit, Ihren Endpunkt im Web zu veröffentlichen. Upload the endpoint file to a host, where you can easyly change the file content without changing the file URL. GitHub is a great place where you can host your file for free.

To start, we recommend to create a public repository where you store all of your Super Addon Manager endpoints, e.g. my-endpoints, sam-endpoints, ... This makes updating your endpoint without messing up other files much easier.

<DocumentationImage filename="gh-create-repo" alt="GitHub create repository page, creating a public repository with name my-endpoints."/>

After you have initialised your repository, click on (Add File >>) Upload files to upload your endpoint and click "Commit changes".

<DocumentationImage filename="gh-upload-endpoint" alt="GitHub upload file page with one file to upload."/>

Once you're finished uploading your file, you have to copy the URL to the file for the next step. Please make sure that at the URL, the file is in raw data and not embedded into any HTML page. On GitHub, you can click the "Raw" Button to access the raw file data and copy its URL.

<DocumentationImage filename="gh-view-raw" alt="GitHub view Raw file."/>

The endpoint URL of this example is [https://raw.githubusercontent.com/BlenderDefender/my-endpoints/main/my-addon-endpoint.json](https://raw.githubusercontent.com/BlenderDefender/my-endpoints/main/my-addon-endpoint.json)


## Einrichten des Addons:

First of all, please make sure that your current bl_info is valid. A good bl_info looks like this:

```python
bl_info = {
    "name": "Your Addon",
    "author": "Your name",
    "version": (0, 0, 0),
    "blender": (2, 83, 0),
    "description": "The best Blender Addon ever created!",
    "doc_url": "[URL to your documentation page]",
    "tracker_url": "[URL to your issue report page]"
}
```

After checking your bl_info looks like this, all you have to do is to add another parameter `endpoint_url` to the bl_info dictionary and paste the URL you've got in the previous step in here like this:

```python
"endpoint_url": "[URL to your endpoint file]"
```

The whole bl_info should now look like this:

```python
bl_info = {
    "name": "Your Addon",
    "author": "Your name",
    "version": (0, 0, 0),
    "blender": (2, 83, 0),
    "description": "The best Blender Addon ever created!",
    "doc_url": "[URL to your documentation page]",
    "tracker_url": "[URL to your issue report page]",
    "endpoint_url": "[URL to your endpoint file]"
}
```

<div class="container">
<div class="row mt-3">

# Showing, that you support Super Addon Manager:

Enabling support for Super Addon Manager is only half of the rent: People can only keep your addon up to date automatically, if they are using Super Addon Manager. There's multiple ways to remind them to get Super Addon Manager:

## Linking to Super Addon Manager:

### Links on your description pages:

Obviously, the easiest way to show, that you support Super Addon Manager, is to add a short text with a link in your addon description or README. You can use something like this:

```markdown
# Addon Updates:

This addon can be updated automatically with Super Addon Manager. Learn more on their site: https//TODO
```

### Links from your addon preferences:

If you want to, you can paste the following code snippet into the draw function of your addon preferences or a panel:

```python
if not "Super Addon Manager" in context.preferences.addons:
    layout.separator()
    layout.label(text="This addon can be updated automatically with Super Addon Manager.")
    layout.operator("wm.url_open", text="Learn more!", icon="URL").url="https//TODO"
```

This snippet checks, if Super Addon Manager is installed and enabled, and if that's not the case, it displays a message, saying, that your addon can be updated with Super Addon Manager and a link to the SAM homepage.

## Deliver Super Addon Manager directly with your addon:

If your offering your addon on Gumroad, BlenderMarket or similar pages, you can deliver Super Addon Manager directly with your addon.

## Show it in your branding!

If you want to, you can download the [Super Addon Manager Branding Kit](https//TODO) and add the Super Addon Manager Logo according to the rules in the README.md file. If you're unsure, read our [Logo and Branding](https//TODO) page.
