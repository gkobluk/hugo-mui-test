---
title: "Description"
date: 2023-06-18
draft: false
---

# CYBERTEC Prototyping Express - CYPEX

## Getting Started

### Requirements

_CYPEX_ is distributed as a set of [Docker](https://www.docker.com/) images that are brought up by [Docker Compose](https://docs.docker.com/compose/).

- [`docker`](https://docs.docker.com/get-docker/)
- [`docker-compose`](https://docs.docker.com/compose/install/) (`>= 1.27.0`)
- `git` (`>= 2.20.1`)
- `bash` (`>= 4.0`)
- [`jq`](https://stedolan.github.io/jq/download/)

To run the application on the MacOS:

The sed program on Mac is not a standard (GNU) one. To get the normal one, use brew:

`brew install gnu-sed`
After this, alter PATH. For example, add the following line to your ~/.bash_profile:

`PATH="/usr/local/opt/gnu-sed/libexec/gnubin:$PATH"`

### Obtaining Images (Enterprise Edition Only)

_CYPEX_ images can be obtained through Docker Hub.

- Docker Hub
  Please [get in touch with us](#contact) if your account has not been granted access to the respective images.

```bash
cat ~/password.txt | docker login --username <username> --password-stdin
```

### Setup and Run CYPEX

#### 1. Download CYPEX.

In order to make the configuration installation process easier, CYBERTEC provides a CYPEX scripts repository that allows the user to create the environment by following a step-by-step guide. Choose an option:
  1. Clone Repository:

```bash
git clone git@github.com:cybertec-postgresql/cybertec_cypex.git
cd cybertec_cypex
```

  2. Use the link to download scripts repository from the CYBERTEC server. After successful download:

```bash
mkdir cybertec_cypex
tar -xzvf cybertec_cypex-<tag>.tar.gz -C cybertec_cypex
cd cybertec_cypex
```

#### 2. Generate configuration.

The application provides flexibility to run in various scenarios based on specific requirements. Users have the option to configure the application using the command:

```bash
./cypex configure
```
 This command offers the following scenarios:

- **Do you want to install the enterprise version of CYPEX?**. An Enterprise version can be chosen. Otherwise, the trial-limited demo version will be installed. (Enterprise version with license only)
- **Do you want to install CYPEX with an existing database?**. If `No` - PostgreSQL database will be installed within a Docker container. In case of `Yes` the user has to provide the database connection information:

```bash
./cypex config database.host <host-name or IP>
./cypex config database.port <port-number>
./cypex config database.name <db-name>
./cypex config database.install.user.name <user-name>
./cypex config-database-install-user-password
```

_Note: the database host should be the hostname or IP address. The database host should be reachable by the docker containers. **Do not** use `localhost` or similar because the docker containers will resolve their own host as a localhost._

- **Do you want to use the install user for API connections? Otherwise, an authenticator role will be created**. The API user can be changed using this option. By default, CYPEX creates the role `authenticator`.

The configure will store the credentials and certificates inside the `.secrets` folder:

  - .db_postgres_password: database superuser password.
  - .db_authenticator_password: API user password.
  - .db_authenticator_connection_string: API connection URI.
  - .admin_password: initial web user admin password.
  - nginx folder: self-signed certificates.


#### 3. Execute

To pull the necessary docker images and install the application, run:

```bash
./cypex install
```

To initiate CYPEX, proceed with the final step. The system will automatically generate an admin user within the APP, generate a password, and present it on the screen for your convenience. Simply run:

```bash
./cypex up
```
:rocket: :rocket: :rocket:
Open your web browser and log in to the application using the provided prompt credentials.

<br/>
<br/>

### Additional Configuration Notes (Optional).

To pull the images from Docker Hub manually and start CYPEX offline:

#### Offline Setup

Alternatively, CYPEX scripts and images might be provided as an **offline** installer.
The offline installer is generated from a running CYPEX instance:

```bash
cd cybertec_cypex
./cypex generate-standalone
```

The following two files will be generated:

**cypex-standalone.tar.gz**: cypex configuration files and installation scripts.

**docker-images.tar.gz**: docker images.

Copy those files to the destination host, by using for example scp.

On the destination server do the following:

Untar the `cypex-standalone.tar.gz` and copy the images to an empty folder:

```bash
mkdir cypex
tar -xzvf cypex-standalone.tar.gz -C cypex
mv docker-images.tar.gz cypex/
```

Load docker-images:

```bash
cd cypex
./cypex load-docker-images
```

Finally, configure and start CYPEX:

```bash
./cypex configure
./cypex up
```

<br/>
<br/>

### To uninstall CYPEX

```bash
./cypex cleanup-cypex-database
./cypex uninstall
```

#### Note: Important Database Uninstallation Information

If you have installed the CYPEX database within a Docker container, please be aware that the **postgres-data** folder will not be automatically removed upon uninstallation. In such cases, manual intervention is required.

```bash
sudo rm -rf postgres-data
```

## Contact

- [Sales](https://www.cybertec-postgresql.com/en/contact/)
- [Report Bug](https://cybertec.atlassian.net/servicedesk/customer/portal/4/group/5/create/31)
