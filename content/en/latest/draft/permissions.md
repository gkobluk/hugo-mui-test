# Database permissions

## Securing the database at all levels

CYPEX ensure that security is centralized. Those permissions set at the database
level control the entire system from the database through the API all the way
app to the application displayed to the end user. Therefore security is easy to
manage and easy to understand.

## How to handle users

The first thing we have to keep in mind is that we have two types of users:

    - PostgreSQL users
    - CYPEX users

Permissions are set on PostgreSQL users / roles. CYPEX useres are used to login
into CYPEX. A CYPEX user is mapped to a PostgreSQL user. One PostgreSQL user can
be used by multiple CYPEX users.

Example: A PostgreSQL role `store` has permissions on schema `web_store`.
This role `store` is granted to the PostgreSQL user `luke`.
The PostgreSQL user `luke` is mapped to the CYPEX user `luke@example.com`.

Thus, the user `luke@example.com` has permissions on schema `web_store`.

## Securing schemas and tables

CYPEX does NOT access your tables directly. The GUI and therefore the API will
only expose object views, not real tables.

This means that you have to use CYPEX means to define permissions. In PostgreSQL
a view is a separate user context - it does not inherit the permissions of the
underlying table. You have to define permissions on a view (in this case a
CYPEX object view) separately.

## Securing objects views

CYPEX provides a set of onboard functions to handle security related questions
around views. It is highly recommended to use the graphical user interface to
set permissions correctly. It can be done manually but it is safer to use
our tooling.

When accessing the DB through the API, the PostgreSQL function
`cypex.current_user()` can be used to retrieve the current user id.
Similarly, `cypex.current_role()` can be used to get the current user's
PostgreSQL role.

For example:

```sql
-- only see the history for the current user
CREATE VIEW cypex_generated.v_user_purchase_history AS
SELECT  *
FROM    shop.purchase_history
WHERE   user_id = cypex.current_user()
```

Additionally, a helpful snippet for excluding admin users from any data
restrictions:

```sql
CREATE VIEW cypex_generated.v_user_purchase_history AS
SELECT  *
FROM    shop.purchase_history
WHERE   user_id = cypex.current_user()
OR      cypex.is_admin() -- admins can see all the data
```

## Securing work flows and state changes

Finally we have to keep in mind that workflows are related to security concerns
as well. Internally the
`cypex.grant_state_change(IN v_state_change_id int8, IN v_user_name name)`
function is used to assign permissions to state changes.

You should use the graphical interfaces to assign permissions to state
changes. The model builder has a convenient interface to come up with the desired
configuration.
