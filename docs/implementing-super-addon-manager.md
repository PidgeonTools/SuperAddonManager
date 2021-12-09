---
title: Implementing Super Addon Manager
description: A step-by-step guide that shows you how to implement support for Super Addon Manager into your addon.
for: Developers
category: Developer Documentation
category-index: 1
page-index: 0
---

# Implementing Super Addon Manager

Because of its simplicity and code-free nature (= no risk of accidentally breaking your addon), Super Addon Manager is the ideal solution if you wish to support automated checking of your addons for updates. This step-by-step guide will show you how to implement Super Addon Manager support in your addon. Side Note: If you offer a paid version of your addon, please consider paying me a percentage of your earnings (1% or higher) to help keep this project alive. On BlenderMarket, you can add me (TODO: BlenderMarket name) as a collaborator to pay me automatically.

## Preparation:

If your Addon only consists of one single file, you have to turn it into a folder addon. Just create a new folder (with the same name as the addon) and rename your script into `__init__.py`. This exact filename is very important! After doing this, you're set up for implementing Super Addon Manager.

## Setting up the endpoint:

The first step to implementing support for Super Addon Manager is setting up a so called "endpoint", a file that is publicly available through the internet which contains all the data necessary for Super Addon Manager to check for updates. This file is essential for the update process and it needs to be updated when you publish a new release of your addon, but fortunately, it is really easy to set up.

### Setup using our endpoint builder tool:

You can set up or update an endpoint in less than a minute using our [endpoint builder tool.](/endpoint-builder) We'd recommend using this tool, because it generates working endpoints really fast. If you decide to use this tool, you can continue this article [here.](#hosting-the-endpoint)

### Manually setting up the endpoint:

If you decide to set up the endpoint manually, you'll have to create a json file that looks like this:

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

The schema version always stays the same, so you can just copy and paste it to your file. You then create an array called "versions" and add an object to it:

```json
{
  "schema_version": "super-addon-manager-version-info-1.0.0",
  "versions": [{}]
}
```

This object MUST have the minimum Blender version, the version of your addon (both as array of numbers) and the download url specified:

```json
{
  "version": [0, 0, 0],
  "download_url": "https://www.example.com/download-my-addon",
  "minimum_blender_version": [2, 83, 0]
}
```

If you allow automatic downloads, the download url must be a link to the zip file of your addon:

```json
"allow_automatic_download": true,
"download_url": "https://www.example.com/my-addon-0.0.0.zip",
```

And finally, if you make an update for an older version of Blender that won't work with the latest Blender version, you can set the API breaking Blender version to the first version of Blender, where your addon doesn't work due to API changes:

```json
"api_breaking_blender_version": [3, 0, 0]
```

### Hosting the endpoint:

You're now set up for publishing your endpoint to the web. Upload the endpoint file to a host, where you can easyly change it without changing its url. GitHub is a great place where you can host your file for free:

<!-- TODO: Add a description on hosting an endpoint on GitHub -->

Once you're finished uploading your file, you have to copy the url to the file for the next step. Please make sure that at the url, the file is in raw data and not embedded into any HTML page. On GitHub, you can click the "Raw" Button to access the raw file data and copy its url.

## Setting up your addon:

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

<!-- TODO: Text here. -->
