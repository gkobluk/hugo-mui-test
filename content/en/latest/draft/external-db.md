---
title: "External DB"
---

# External DB

This guide explains how to install CYPEX with an external database.

## Prerequisites

- `psql`
- `docker`
- `docker-compose`
- `make`
- A vanilla PostgreSQL DB
- CYPEX repository downloaded

For this guide we'll assume that the PostgreSQL DB we want to use is available via:

- host: `example.com`
- port: `35432`
- database: `example-db`
- user: `admin`
- password: `super_secret_password`

## Installation

The following guide assumes that the working directory is the CYPEX repository.

### Configuration

First of all CYPEX needs to be configured to use the existing database.

To configure CYPEX the `.env` file should be adapted.

For this example the `.env` file would look like this:

```bash
DB_HOST=example.com     # host
DB_PORT=35432           # port
EXPOSED_DB_PORT=5432
DB_USER=authenticator
DB_NAME=external-db     # database name
UI_PORT=80
HTTPS_PORT=443
# change this to "dev" for development mode
ENV=production
```

### Credentials

Next you have to generate credentials for the DB users that will be created in the next step:

```bash
make secrets
```

> ⚠ This command depends on the configuration within `.env`.
> If the configuration changes the command has to be run again.

### Install on the DB

Next, the CYPEX database structure has to be installed on the database (the database server must be up).

```bash
docker-compose run app /usr/src/scripts/external-deploy.sh admin super_secret_password
```

In this step the following objects were created in the DB:

Users:

- `authenticator`
- `cypex_admin`
- `cypex_user`
- `anon`

Schemas:

- `cypex`
- `cypex_log`
- `cypex_api_internal`
- `cypex_generated`

### Start CYPEX

Now CYPEX can be started:

```bash
docker-compose up -d
```

> Be aware that this command also starts the internal PostgreSQL DB, even though it won't be used

CYPEX is now available at http://localhost.
