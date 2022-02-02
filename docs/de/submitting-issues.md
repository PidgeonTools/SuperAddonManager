---
title: Senden guter Fehlerberichte
description: Ein Leitfaden zum Einreichen guter Fehlerberichte auf verschiedenen Plattformen.
for: Benutzer
category: Fehlerbehandlung
category-index: 2
page-index: 1
---

# Wie man gute Fehlermeldungen auf verschiedenen Plattformen einreicht

Fehler passieren, und beim Programmieren kann schon ein einziges falsch eingegebenes Zeichen ein ganzes Programm zum Absturz bringen. Wenn Sie einen Fehler in einem Programm finden, ist es sehr wichtig, ihn den Entwicklern mitzuteilen, denn nur so kann dieser Fehler jemals behoben werden. Dieser Leitfaden zeigt Ihnen, wie Sie gute und hilfreiche Fehlermeldungen auf verschiedenen Plattformen einreichen können.

## Wie man einen Bericht schreibt

#### Fehlermeldung

Eine gute Fehlermeldung hilft dem Entwickler das Problem leicht zu verstehen und nachzuvollziehen. Dies ist von entscheidender Bedeutung, um herauszufinden, was den Fehler verursacht. Eine gute Fehlermeldung enthält folgende Informationen:

- Systemdaten. Welches Betriebssystem benutzen Sie? Welche Blender-Version verwenden Sie? Welche Version des Addons benutzen Sie?
- Eine Beschreibung des Fehlers und des erwarteten Verhaltens. Was genau macht das Programm falsch und welches Verhalten würden Sie erwarten?
- Die Schritte zum Reproduzieren des Fehlers.

Ein guter Ausgangspunkt ist die folgende Vorlage:

```
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Desktop (please complete the following information):**

- OS: [e.g. Windows]
- Blender Version: [e.g. 3.0]
- Addon Version: [e.g. 1.0]

**Additional context**
Add any other context about the problem here.
```

#### Feature-Anfrage

Wenn Sie eine neue Funktion anregen, ist es wichtig, dass Sie klar kommunizieren, was diese tun soll. Die folgende Vorlage kann Ihnen helfen:

```
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## Einreichen einer Fehlermeldung auf GitHub

Wenn Sie eine Fehlermeldung auf GitHub einreichen, ist es hilfreich, zunächst zu prüfen, ob die Fehlermeldung bereits existiert. Wenn Sie eine Fehlermeldung für Super Addon Manager einreichen, sollten Sie nach dem folgenden Titel suchen:

```markdown
[Super Addon Manager]
```

Nachdem Sie sich vergewissert haben, dass Sie keine doppelte Fehlermeldung einreichen, können Sie auf "New Issue" klicken:

<DocumentationImage filename="gh-search" alt="Search for an issue on GitHub" />

Wenn Sie aufgefordert werden, eine Vorlage für den Fehlerbericht auszuwählen, wählen Sie die passende Vorlage für die Art des Fehlers, den Sie einreichen (Fehler, Feature Request, ...). GitHub sollte jetzt so aussehen:

<DocumentationImage filename="gh-new-view" alt="GitHub submit issue page with empty fields"/>

Sie können nun den Titel und die Fehlermeldung, die Sie zuvor geschrieben haben (oder die Super Addon Manager für Sie erstellt hat), in die entsprechenden Felder kopieren und einfügen und auf "Neue Meldung einreichen" klicken, um die Meldung einzureichen. Herzlichen Glückwunsch, Sie haben erfolgreich einen Problembericht eingereicht.

<DocumentationImage filename="gh-inserted-text" alt="Insert the text and submit the Issue" />

## Einreichen einer Fehlermeldung auf Gitlab

Das Einreichen einer Fehlermeldung auf Gitlab ist dem Einreichen einer Fehlermeldung auf GitHub sehr ähnlich. Es ist hilfreich, zuerst zu überprüfen, ob die Fehlermeldung bereits existiert. Wenn Sie ein Problem für Super Addon Manager einreichen, sollten Sie nach dem folgenden Titel suchen:

```markdown
[Super Addon Manager]
```

Nachdem Sie sich vergewissert haben, dass Sie keine doppelte Fehlermeldung einreichen, können Sie auf "New Issue" klicken:

<DocumentationImage filename="gl-search" alt="Search for an issue on Gitlab" />

Gitlab sollte jetzt so aussehen:

<DocumentationImage filename="gl-new-view" alt="Gitlab submit issue page with empty fields"/>

Sie können nun den Titel und die Fehlermeldung, die Sie zuvor geschrieben haben (oder die Super Addon Manager für Sie erstellt hat), in die entsprechenden Felder kopieren und einfügen und auf "Neue Meldung einreichen" klicken, um die Meldung einzureichen. Vielen Dank, Ihr Problembericht ist dabei, die Software ein bisschen besser zu machen!

<DocumentationImage filename="gl-inserted-text" alt="Insert the text and submit the Issue" />

## Einreichen einer Fehlermeldung auf BlenderMarket

Auf BlenderMarket sollten Sie zunächst auf die Seite des Entwicklers gehen:

<DocumentationImage filename="bm-product-page" alt="Navigate to the creator page on BlenderMarket" />

Auf der Seite des Entwicklers finden Sie eine Schaltfläche mit dem Text "Contact Creator":

<DocumentationImage filename="bm-creator-page" alt="Contact Button on the Creator page" />

Wenn Sie auf diese Schaltfläche klicken, öffnet sich ein Popup-Fenster, in dem Sie nach einem Betreff und einer Nachricht gefragt werden. Hier können Sie den Titel und die Fehlermeldung, die Sie zuvor geschrieben haben (oder die Super Addon Manager für Sie erstellt hat), kopieren und einfügen. Achten Sie darauf, dass Sie die Texte ohne Formatierung einfügen (die Tastenkombination STRG + UMSCHALT + V sollte dafür funktionieren), BlenderMarket wird sich unerwartet verhalten, wenn Sie nur die Nachricht einfügen.

<DocumentationImage filename="bm-inserted-message" alt="Insert the Subject and the message into the dialog box" />

Sie können nun auf "Submit" klicken und die Fehlermeldung von BlenderMarket ignorieren, Ihre Nachricht ist wahrscheinlich angekommen. Vielen Dank, dass Sie ein Problem eingereicht haben!

<DocumentationImage filename="bm-error" alt="BlenderMarket might display an error message - just ignore it." />

## Einreichen einer Fehlermeldung auf Gumroad

Das Einreichen von Ausgaben auf Gumroad ist dasselbe wie das Einreichen einer Ausgabe per E-Mail, mit einem zusätzlichen Schritt. Nachdem Sie eine Datei von Gumroad heruntergeladen haben, erhalten Sie eine E-Mail, die Ihren Download bestätigt. Öffnen Sie diese E-Mail und klicken Sie auf "Antworten":

<DocumentationImage filename="gum-orig-mail" alt="Confirmation message from Gumroad" />

## Einreichen einer Fehlermeldung via E-Mail

Egal, ob Sie auf eine E-Mail antworten oder eine neue E-Mail schreiben, die folgenden Schritte sind die gleichen. Ich verwende in diesem Beispiel Thunderbird, aber Sie können jede E-Mail-Software Ihrer Wahl verwenden.

Markieren Sie zunächst alles, klicken Sie mit der rechten Maustaste und wählen Sie "Einfügen ohne Formatierung". Dies ist notwendig, da die E-Mail-Software möglicherweise Probleme mit dem Text hat, den Sie zuvor kopiert haben:
<DocumentationImage filename="mail-replace-text" alt="Select everything and replace it with your issue message" />

Kopieren Sie dann den Titel der Fehlermeldung und fügen Sie ihn in die Betreffzeile ein. Sie können Überschriften auch fett formatieren, um den Text lesbarer zu machen:
<DocumentationImage filename="mail-inserted-message" alt="Insert the title into the subject field." />

Überprüfen Sie abschließend die E-Mail und vergewissern Sie sich, dass Sie die E-Mail-Adresse angegeben haben, an die Sie die E-Mail senden möchten. Klicken Sie auf "Senden", und Sie haben erfolgreich einen Problembericht eingereicht. Herzlichen Glückwunsch!
