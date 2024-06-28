---
title: "GUI Editor"
---

# GUI Editor

## General

The GUI Editor allows you to edit the application with a live preview of the
application, also called "What You See Is What You Get" (WYSIWYG).

### Activate the GUI Editor

On the top right, click the button "Edit Application".

To deactivate the GUI Editor, click the button "Exit Edit Mode".

### Layout

The editor is separated into multiple parts:

#### Top

The top bar holds multiple important actions:

- Save
- Create Release
- Discard (unsaved changes)

You can also hide the left and right panel to get a more full-screen view of
your application.

#### Left

This panel has several tabs:

- Pages
- Menu
- History
- Styles

#### Right

The right sight is about creating and configuring elements on the page.

#### Content

The content in the center displays the usable application. Here you can select,
move and resize existing elements.

## Edit Pages and Elements

An element can be selected by clicking on it or clicking its label.
It can be resized by dragging the handle in the bottom right of the element.
It can be moved by grabbing and moving the drag handle on the top left of an
element.

### Edit Element

When selecting an element, the right panel shows the configuration options for
the selected element.

For example, if you select a markdown field, you can change its text.

## Pages

In the pages tab, you can select a page to edit its content, create a new page,
edit a page or delete a page.

Pages allow to configure parameters. When linking to a page, these paramters
must be set.

## Menu

Here you can configure the visible menu entries, including their subentries,
label and icon.

## Styling

Here you can configure the global app styles.

These styles include colors and the logo on the top left.

## History and Releases

### Save Points

Every time you save your application, a new save point is created.
You can always revert back to an earier save point.

To create a new save point, click on the _Save_ button on the top right of the
editor.

### Releases

By default, an application is published to the user using the `latest` release.
The `latest` release always points to the latest save point.

Alternatively, you can create custom releases.

If you create a new release, it points to the current (latest) save point.

Once created, you can publish a release to make it available to your users.

This allows you to have a published release of your app, which is visible to the
users, while you're working on a new release.
