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

If you are asked to select a template for the issue report, select the appropriate template for the type of issue that you are submitting (Issue, Feature Request, ...). GitHub sollte jetzt so aussehen:

<DocumentationImage filename="gh-new-view" alt="GitHub submit issue page with empty fields"/>

You can now copy and paste the title and the issue report that you wrote previously (or that Super Addon Manager generated for you) into the appropriate fields and click "Submit new Issue" to submit the issue. Congratulations, you've sucessfully submitted an issue report.

<DocumentationImage filename="gh-inserted-text" alt="Insert the text and submit the Issue" />

## Einreichen einer Fehlermeldung auf Gitlab

Das Einreichen einer Fehlermeldung auf Gitlab ist dem Einreichen einer Fehlermeldung auf GitHub sehr ähnlich. It's helpful to first search if the issue exists already. If you are submitting an issue for Super Addon Manager, you should search for the following title:

```markdown
[Super Addon Manager]
```

Nachdem Sie sich vergewissert haben, dass Sie keine doppelte Fehlermeldung einreichen, können Sie auf "New Issue" klicken:

<DocumentationImage filename="gl-search" alt="Search for an issue on Gitlab" />

Gitlab sollte jetzt so aussehen:

<DocumentationImage filename="gl-new-view" alt="Gitlab submit issue page with empty fields"/>

You can now copy and paste the title and the issue report that you wrote previously (or that Super Addon Manager generated for you) into the appropriate fields and click "Submit new Issue" to submit the issue. Thank you, your issue report is about to make the software a bit better!

<DocumentationImage filename="gl-inserted-text" alt="Insert the text and submit the Issue" />

## Einreichen einer Fehlermeldung auf BlenderMarket

Auf BlenderMarket sollten Sie zunächst auf die Seite des Entwicklers gehen:

<DocumentationImage filename="bm-product-page" alt="Navigate to the creator page on BlenderMarket" />

Auf der Seite des Entwicklers finden Sie eine Schaltfläche mit dem Text "Contact Creator":

<DocumentationImage filename="bm-creator-page" alt="Contact Button on the Creator page" />

If you click that button, a popup dialog will open and ask you for a subject and a message. Here you can copy and paste the title and the report that you wrote earlier (or that Super Addon Manager generated for you). MAKE SURE that you paste the texts without formatting (The shortcut CRTL + SHIFT + V should work for this), BlenderMarket will behave unexpectedly if you just paste the message.

<DocumentationImage filename="bm-inserted-message" alt="Insert the Subject and the message into the dialog box" />

You can now click submit and ignore the error that BlenderMarket displays, your message has probably arrived. Thank you for submitting an issue!

<DocumentationImage filename="bm-error" alt="BlenderMarket might display an error message - just ignore it." />

## Einreichen einer Fehlermeldung auf Gumroad

Submitting issues on Gumroad is the same as submitting an issue via E-Mail, with one extra step. After downloading a file from Gumroad, you'll receive an E-Mail which confirms your download. Open that E-Mail and hit "Reply":

<DocumentationImage filename="gum-orig-mail" alt="Confirmation message from Gumroad" />

## Einreichen einer Fehlermeldung via E-Mail

Egal, ob Sie auf eine E-Mail antworten oder eine neue E-Mail schreiben, die folgenden Schritte sind die gleichen. Ich verwende in diesem Beispiel Thunderbird, aber Sie können jede E-Mail-Software Ihrer Wahl verwenden.

Markieren Sie zunächst alles, klicken Sie mit der rechten Maustaste und wählen Sie "Einfügen ohne Formatierung". Dies ist notwendig, da die E-Mail-Software möglicherweise Probleme mit dem Text hat, den Sie zuvor kopiert haben:
<DocumentationImage filename="mail-replace-text" alt="Select everything and replace it with your issue message" />

Kopieren Sie dann den Titel der Fehlermeldung und fügen Sie ihn in die Betreffzeile ein. Sie können Überschriften auch fett formatieren, um den Text lesbarer zu machen:
<DocumentationImage filename="mail-inserted-message" alt="Insert the title into the subject field." />

Finally, review the E-Mail and make sure that you've set the E-Mail-Adress that you want to send it to. Click "Send", and you've sucessfully submitted an issue report. Congratulations!
