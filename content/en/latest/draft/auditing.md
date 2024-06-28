
---
title: "Auditing"
---

# Auditing

CYPEX is often used for critical applications and security is a major concern.
This raises two important questions:

    - Who has changed which data when
    - How did the application change over time

## Tracking changing data

If you are working with critical data you might want to track changes. CYPEX has
two function to enable tracking:

    - `cypex.create_history_tracker(IN v_schema_name text, IN v_table text)`
    - `cypex.create_history_tracker(IN object_id bigint)`

You can either enable tracking by passing the object id to
create_history_tracker or you can simply pass the name of the schema and the
name of the table you want to track.

Behind the scenes CYPEX will deploy change log triggers and log all changes in a
history table which can then be displayed in the graphical user interface. This
gives us a generic way to see all changes in a human readable format.

Keep in mind that activating history tracking does come with a performance
penalty and it is recommended to use it on selected tables only in case speed is
an issue.

The audit trail is not cleaned automatically.

## Tracking application changes

Tracking application changes happens automatically. Changes made to the GUI
result in new versions of the JSON document sent to the client.
The GUI Editor allows you to publish a specific version to end users.
