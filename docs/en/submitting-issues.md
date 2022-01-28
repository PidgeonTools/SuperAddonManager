---
title: Submitting good issue reports
description: A guide on submitting good issue reports on different platforms.
for: Users
category: Error Handling
category-index: 2
page-index: 1
---

# How to submit good issues on different platforms

Mistakes happen, and in development, even a single mistyped character can break an entire program. If you find a mistake in a program, reporting it to the developer(s) is really important, that's the only way how that mistake is ever going to get fixed. This guide will show you, how you can submit good and helpful issue reports on different platforms.

## How to write a report

#### Issue report

A good issue report helps the developer understand and reproduce the error easily. This is essential for figuring out what the problem is. A good issue report contains the following information:

- System Information. Which Operating System do you use? Which Blender Version do you use? Which version of the addon do you use?
- A description of the bug and the expected behaviour. What exactly does the program wrong and what behavior would you expect?
- The steps to reproduce the error.

A good starting point is the following template:

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

#### Feature Request

If you are requesting a new feature, it's essential to communicate clearly, what the new feature should do. The following template can help you:

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

## Submitting an issue on GitHub

When submitting an issue on GitHub, it's helpful to first search if the issue exists already. If you are submitting an issue for Super Addon Manager, you should search for the following title:

```markdown
[Super Addon Manager]
```

After you made sure that you are not submitting a duplicate issue, you can click on "New Issue":

<DocumentationImage filename="gh-search" alt="Search for an issue on GitHub" />

If you are asked to select a template for the issue report, select the appropriate template for the type of issue that you are submitting (Issue, Feature Request, ...). GitHub should now look like this:

<DocumentationImage filename="gh-new-view" alt="GitHub submit issue page with empty fields"/>

You can now copy and paste the title and the issue report that you wrote previously (or that Super Addon Manager generated for you) into the appropriate fields and click "Submit new Issue" to submit the issue. Congratulations, you've sucessfully submitted an issue report.

<DocumentationImage filename="gh-inserted-text" alt="Insert the text and submit the Issue" />

## Submitting an issue on Gitlab

Submitting an issue on Gitlab is pretty similar to submitting an issue on GitHub. It's helpful to first search if the issue exists already. If you are submitting an issue for Super Addon Manager, you should search for the following title:

```markdown
[Super Addon Manager]
```

After you made sure that you are not submitting a duplicate issue, you can click on "New Issue":

<DocumentationImage filename="gl-search" alt="Search for an issue on Gitlab" />

Gitlab should now look like this:

<DocumentationImage filename="gl-new-view" alt="Gitlab submit issue page with empty fields"/>

You can now copy and paste the title and the issue report that you wrote previously (or that Super Addon Manager generated for you) into the appropriate fields and click "Submit new Issue" to submit the issue. Thank you, your issue report is about to make the software a bit better!

<DocumentationImage filename="gl-inserted-text" alt="Insert the text and submit the Issue" />

## Submitting an issue on BlenderMarket

On BlenderMarket, you should first navigate to the page of the creator:

<DocumentationImage filename="bm-product-page" alt="Navigate to the creator page on BlenderMarket" />

On the creator page, you'll see a button with the text "Contact Creator":

<DocumentationImage filename="bm-creator-page" alt="Contact Button on the Creator page" />

If you click that button, a popup dialog will open and ask you for a subject and a message. Here you can copy and paste the title and the report that you wrote earlier (or that Super Addon Manager generated for you). MAKE SURE that you paste the texts without formatting (The shortcut CRTL + SHIFT + V should work for this), BlenderMarket will behave unexpectedly if you just paste the message.

<DocumentationImage filename="bm-inserted-message" alt="Insert the Subject and the message into the dialog box" />

You can now click submit and ignore the error that BlenderMarket displays, your message has probably arrived. Thank you for submitting an issue!

<DocumentationImage filename="bm-error" alt="BlenderMarket might display an error message - just ignore it." />

## Submitting an issue on Gumroad

Submitting issues on Gumroad is the same as submitting an issue via E-Mail, with one extra step. After downloading a file from Gumroad, you'll receive an E-Mail which confirms your download. Open that E-Mail and hit "Reply":

<DocumentationImage filename="gum-orig-mail" alt="Confirmation message from Gumroad" />

## Submitting an issue via E-Mail

Whether you're replying to an E-Mail or you're writing a new one, the following steps are the same. I'm using Thunderbird in this example, but you can use any E-Mail software of your choice.

First, select everything, right click and select "Paste without formatting". This is necessary because the E-Mail software may have problems with the text you copied earlier:
<DocumentationImage filename="mail-replace-text" alt="Select everything and replace it with your issue message" />

Then, copy and paste the issue title into the subject field. You can also format headings bold to make the text easier to read:
<DocumentationImage filename="mail-inserted-message" alt="Insert the title into the subject field." />

Finally, review the E-Mail and make sure that you've set the E-Mail-Adress that you want to send it to. Click "Send", and you've sucessfully submitted an issue report. Congratulations!
