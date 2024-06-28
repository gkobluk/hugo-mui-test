---
title: "Administration Panel"
---

# Administration Panel

## Login & Access

Use the following credentials to login:

```
email: admin@cybertec.at
password, can be taken in the generated file `.admin_password`
```

On the top right, click the "Admin" button to get to the admin panel.

## Applications

A list of all existing applications. You can generate a new application or
import a pre-existing app json definition.

Here you can also access and delete existing applications.

### Generate

To generate a new application, click on `GENERATE`.
Enter an application name and description. Pick the owner PostgreSQL role which
this application is generated for. The generated application depends on the
permissions of the selected owner role.

Example:

```
            view_name             |    grantee     |       privileges
----------------------------------+----------------+------------------------
 v_workspace_employee_state_count | workspace_user | {SELECT}
 v_workspace_t_employee           | workspace_user | {INSERT,SELECT,UPDATE}
```

If the owner is set to `workspace_owner`, pages for viewing
`v_workspace_employee_state_count` and for viewing, creating and editing
`v_workspace_t_employee` are generated.

## Users

List, create and edit CYPEX users.

A PostgreSQL role is assigned to each CYPEX user, which determines the
permissions of the CYPEX user.

## Auditing

Tracked changes can be seen here.

Track a table with the DB function `create_history_tracker`.

The whole `OLD` and `NEW` row is saved and can be compared in a diff view.

## File Management

Upload and view files.

When uploading a file, you have to select the access group (public or private)
and the type group.
