---
title: Implementing Super Addon Manager
---

<div class="container intro">
<div class="row">

# Implementing Super Addon Manager

Because of its simplicity and code-free nature (= no risk of accidentaly breaking your addon), Super Addon Manager is the ideal solution if you wish to support automated checking of your addons for updates. This step-by-step guide will show you how to implement Super Addon Manager support in your addon. Side Note: If you offer a paid version of your addon, please consider paying me a percentage of your earnings (1% or higher) to help keep this project alive. On BlenderMarket, you can add me (TODO: BlenderMarket name) as a collaborator to pay me automatically.

</div>
</div>

<div class="container">
<div class="row">

## Preparation:

If your Addon only consists of one single file, you have to turn it into a folder addon. Just create a new folder (with the same name as the addon) and rename your script into `__init__.py`. This exact filename is very important! After doing this, you're set up for implementing Super Addon Manager.

</div>
</div>

<div class="container">
<div class="row">

## Setting up the endpoint:

<!-- TODO: Add a description on creating endpoint files here, when the endpoint schema is finally fully specified. Add a link to the file creator/updater here. -->

</div>
</div>

<div class="container">
<div class="row">

## Setting up your addon:

First of all, please make sure that your current bl_info is valid. A good bl_info looks like this:

```python
bl_info = {
    "name": "Your Addon",
    "author": "Your name",
    "version": (0, 0, 0),
    "blender": (2, 83, 0),
    "description": "The best Blender Addon ever created!",
    "wiki_url": "[URL to your wiki page]",
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
    "wiki_url": "[URL to your wiki page]",
    "tracker_url": "[URL to your issue report page]",
    "endpoint_url": "[URL to your endpoint file]"
}
```

</div>
</div>

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

</div>
</div>
