---
title: "LDAP"
---

# LDAP integration with CYPEX

Credentials are centrally controlled by the LDAP server and can be used for authentication in different services.

CYPEX is one of the services that allow the use of LDAP for user authentication.

Internal authorization process flow when logging in:

1. if credentials match a CYPEX internal user, try to log in as that user
2. if credentials don't match an internal user and LDAP is not configured, login failed
3. if LDAP is configured, check if the current user matches the LDAP credentials
4. if the LDAP authentication didn't work, login failed
5. if the LDAP authentication is successful and the user has never logged in before, the user role is decided based on the role configuration - see below - and saved in the ldap user table (`cypex_api_internal.t_user_ldap`); currently only the assigned role and the dn (distinguished name) are saved

Example of LDAP user table:

| User created          | Postgres role    | Distinguished name |
| --------------------- | ---------------- | ------------------ |
| "09.07.2021 09:31:15" | "cypex_admin"    | "zoidberg"         |
| "09.07.2021 09:31:25" | "workspace_user" | "fry"              |
| "09.07.2021 09:31:35" | "workspace_user" | "leela"            |

If the LDAP user was successfully logged in, the system protocols it. The failure logins are also correspondingly noted.

Example of the log:

| Date of log           | Log action                     | Information                                          | User type                 | User role        |
| --------------------- | ------------------------------ | ---------------------------------------------------- | ------------------------- | ---------------- |
| "09.07.2021 09:31:15" | "auth.login.success"           | "User zoidberg (145) logged in successfully"         | "{'type': 'ldap'}"        | "cypex_admin"    |
| "09.07.2021 09:31:25" | "auth.login.success"           | "User fry (146) logged in successfully"              | "{'type': 'ldap'}"        | "workspace_user" |
| "09.07.2021 09:31:35" | "auth.login.success"           | "User leela (147) logged in successfully"            | "{'type': 'ldap'}"        | "workspace_user" |
| "09.07.2021 09:31:50" | "auth.login.success"           | "User admin@cybertec.at (12) logged in successfully" | "{'type': 'integrated'}"  | "cypex_admin"    |
| "09.07.2021 09:32:02" | "auth.login.failure.not_found" | "Tried to login as non-existent user eliza"          | "{'identifier': 'eliza'}" | -                |

In the near future the LDAP config will be configurable via the GUI. The instruction how to make the configuration in GUI will be added later.

## Configuration

| property           | description                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `url`              | ldap server url                                                                                       |
| `bind_*`           | the credentials used by CYPEX to connect to LDAP                                                      |
| `base_dn`          | the base where to search for users                                                                    |
| `search_attribute` | the attribute that should match the user login name                                                   |
| `role_attribute`   | the attribute that contains the role information                                                      |
| `role_mapping`     | whether the `role_attribute` contains the postgres role name or needs to be mapped to a postgres role |
| `default_role`     | the default role if no `role_attribute` is set                                                        |

Currently, TLS can not be configured.

### Postgres role <-> LDAP user modes

#### Fixed role

The property `default_role` should contain the postgres role name that should be set for every ldap user logging in.

Example:

```json
{
  "url": "ldap://ldap:10389",
  "bind_dn": "cn=admin,dc=planetexpress,dc=com",
  "bind_password": "GoodNewsEveryone",
  "base_dn": "ou=people,dc=planetexpress,dc=com",
  "search_attribute": "uid",
  "default_role": "workspace_user",
  "role_mapping": false
}
```

#### Role in LDAP attribute

The property `role_mapping` should be `false`, the `role_attribute` should be the name of the LDAP user attribute that is a postgres role.

#### Role mapping

The property `role_mapping` should be `true`, the `role_attribute` should be the name of the LDAP user attribtue that is used for the mapping.

The mapping should be configured in `cypex.t_ldap_role`.
An LDAP role must be mapped to exactly 1 postgres role, since 1 CYPEX user must always have exactly 1 postgres role.

## Development configuration

Currently to test the LDAP authentication in development mode, the test LDAP container can be used, which provides an OpenLDAP Server for testing LDAP applications and uses the test domain `planetexpress.com`.

For usage of the test OpenLDAP Server, use the following configuration:

1. Start the setup with the test ldap container: `make LDAP=ON up-d`

2. Configure LDAP:

```sql
insert into cypex.t_config (key, value) values (
    'ldap_config',
    '{
        "url": "ldap://ldap:10389",
        "bind_dn": "cn=admin,dc=planetexpress,dc=com",
        "bind_password": "GoodNewsEveryone",
        "base_dn": "ou=people,dc=planetexpress,dc=com",
        "search_attribute": "uid",
        "role_attribute": "ou",
        "role_mapping": true
    }'
);
```

3. Define role mapping:

```sql
INSERT INTO cypex.t_ldap_role (ldap_role, postgres_role)
VALUES
('Delivering Crew', 'workspace_user'),
('Staff', 'cypex_admin');
```
