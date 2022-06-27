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

Dieses Objekt MUSS die minimale Blender-Version, die Version Ihres Addons (beides als Array von Zahlen) und die Download-URL angegeben haben:

```json
{
  "version": [0, 0, 0],
  "download_url": "https://www.example.com/download-my-addon",
  "minimum_blender_version": [2, 83, 0]
}
```

Wenn Sie automatische Downloads zulassen, muss die Download-Url ein Link zu der Zip-Datei Ihres Addons sein:

```json
"allow_automatic_download": true,
"download_url": "https://www.example.com/my-addon-0.0.0.zip",
```

Und schließlich, wenn Sie ein Update für eine ältere Version von Blender machen, die nicht mit der neuesten Blender-Version funktioniert, können Sie die API Bleaching Blender Version auf die erste Version von Blender setzen, wo Ihr Addon aufgrund von API-Änderungen nicht funktioniert:

```json
"api_breaking_blender_version": [3, 0, 0]
```

### Hosten des Endpunkts:

Sie sind nun bereit, Ihren Endpunkt im Web zu veröffentlichen. Laden Sie die Endpunktdatei auf einen Host hoch, wo Sie sie leicht ändern können, ohne dass sich die Url ändert. GitHub ist ein idealer Ort, um Ihre Datei kostenlos zu hosten.

To start, we recommend to create a public repository where you store all of your Super Addon Manager endpoints, e.g. my-endpoints, sam-endpoints, ... This makes updating your endpoint without messing up other files much easier.

<DocumentationImage filename="gh-create-repo" alt="GitHub create repository page, creating a public repository with name my-endpoints."/>

After you have initialised your repository, click on (Add File >>) Upload files to upload your endpoint and click "Commit changes".

<DocumentationImage filename="gh-upload-endpoint" alt="GitHub upload file page with one file to upload."/>

Once you're finished uploading your file, you have to copy the URL to the file for the next step. Please make sure that at the URL, the file is in raw data and not embedded into any HTML page. On GitHub, you can click the "Raw" Button to access the raw file data and copy its URL.

<DocumentationImage filename="gh-view-raw" alt="GitHub view Raw file."/>

The endpoint URL of this example is [https://raw.githubusercontent.com/BlenderDefender/my-endpoints/main/my-addon-endpoint.json](https://raw.githubusercontent.com/BlenderDefender/my-endpoints/main/my-addon-endpoint.json)


## Einrichten des Addons:

Zuerst stellen Sie bitte sicher, dass Ihre aktuelle bl_info gültig ist. Eine gute bl_info sieht wie folgt aus:

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

Nachdem Sie überprüft haben, dass Ihre bl_info so aussieht, müssen Sie nur noch einen weiteren Parameter `Endpoint_URL` zum bl_info Wiktionary hinzufügen und die URL, die Sie im vorherigen Schritt erhalten haben, wie folgt hier einfügen:

```python
"endpoint_url": "[URL to your endpoint file]"
```

Die ganze bl_info sollte nun so aussehen:

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

# Zeigen, dass Sie Super Addon Manager unterstützen:

Das Aktivieren der Unterstützung für Super Addon Manager ist nur die Hälfte der Miete: Die Leute können Ihr Addon nur dann automatisch auf dem neuesten Stand halten, wenn sie Super Addon Manager verwenden. Es gibt mehrere Möglichkeiten, sie daran zu erinnern, Super Addon Manager zu installieren:

## Super Addon Manager verlinken:

### Links auf Ihren "Produktseiten":

Der einfachste Weg, um zu zeigen, dass Sie den Super Addon Manager unterstützen, ist es, einen kurzen Text mit einem Link in Ihre Artenbeschreibung oder README einzufügen. Sie können etwas wie das verwenden:

```markdown
# Addon Updates:

This addon can be updated automatically with Super Addon Manager. Learn more on their site: https//TODO
```

### Links in Ihren Addon-Einstellungen:

Wenn Sie möchten, können Sie den folgenden Codeschnipsel in die Draw-Funktion Ihrer Addon-Einstellungen oder eines Panels einfügen:

```python
if not "Super Addon Manager" in context.preferences.addons:
    layout.separator()
    layout.label(text="This addon can be updated automatically with Super Addon Manager.")
    layout.operator("wm.url_open", text="Learn more!", icon="URL").url="https//TODO"
```

Dieses Snippet prüft, ob Super Addon Manager installiert und aktiviert ist, und wenn das nicht der Fall ist, zeigt es eine Meldung an, die erklärt, dass Ihr Addon mit Super Addon Manager aktualisiert werden kann, sowie einen Link zur SAM-Homepage.

## Liefern Sie Super Addon Manager direkt mit Ihrem Addon:

Wenn Sie Ihr Addon auf Gumroad, BlenderMarket oder ähnlichen Seiten anbieten, können Sie Super Addon Manager direkt mit Ihrem Addon bereitstellen.

## Zeigen Sie es in Ihrem Branding!

Wenn Sie möchten, können Sie das [Super Addon Manager Branding Kit](https//TODO) herunterladen und das Super Addon Manager Logo gemäß den Regeln in der README.md Datei hinzufügen. Wenn Sie unsicher sind, lesen Sie unsere [Logo und Branding](https//TODO) Seite.
