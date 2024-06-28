---
title: "Architecture"
---

# Architecture

## The CYPEX stack

CYPEX consists of various levels: At the lowest level CYPEX is based on
PostgreSQL, which is in our judgement the very best general purpose Open Source
OLTP database currently available on the market.

On top of the database, CYPEX exposes all internal and application side
functionality as REST API. The API is automatically generated based on the meta
data stored in PostgreSQL. To make use of the API we are using server side
JavaScript code to predict user interfaces and to expose the layout of an
application to the web.

In CYPEX the backend sends a JSON document to the browser, which is rendered and
displayed to the end user. All application related information (= pages,
elements, configuration, styling, etc.) is combined into this single JSON
document processed by the renderer. The CYPEX renderer is able to understand
this information and turn it into a web application. Those JSON
documents are saved in the backend, which allows modifications to be done.

If you are an application developer or a CYPEX consultant, building internal
applications will be your job of choice. Once a relational model has been
designed using a tool you like, the model builder allows you to add all
information needed by CYPEX (more on that later). CYPEX will predict an
application for you, which can then be postprocessed. The structure of the
application is saved as JSON. Every change on the application will result in
a new JSON document which is kept in the backend. This allows different versions
to be kept, making historical analysis simple to accomplish.

CYPEX is shipped as a set of ready-to-use Docker images. Alternatively, a manual
installation guide can be provided if needed.

### Database: PostgreSQL at the core

At the database level, CYPEX creates two schemas, that are important
to know about: `cypex` and `cypex_generated`. The `cypex` schema contains all
basic meta data needed in the CYPEX instrstructure. We keep track of your workflow
configuration, the database tables you are interested in, hints for the default
GUI generation and all other information the engine needs. The CYPEX schema is
purely internal and its data structure should not be augmented or modified in
any way.

The `cypex_generated` schema is used to expose data to the API level. What is
that important? A modern PostgreSQL usually consists of various schemas. You
might have one schema to store "customers", one schema to store "sales", and one
schema to handle accounting. All those schemas might contain countless tables.
But: Not all of those tables in your database might be relevant to your
application. Some might be purely internal, link tables or belong to another
application. In short: Not all tables in the database are always needed at all
times. To handle those cases, we create "object views" in the `cypex_generated`
schema. The idea is to have the desired representation available as a view in
this schema. This allows us to run applications with totally different
permissions than the underlying data structure needs. It gives us an additional
layer of abstraction and additional options on the security side, while
maintaining total flexibility in the way we want to expose data to the user.

Permissions are set on the database level. What is not accessible on the
database side will not be exposed by the API and not be available to the
application which in turn is not going to display the GUI elements associated
with a data set provided by the backend. This approach gives us a unified
security approach. Data can be accessed at any layer (directly via SQL, via the
API or using the GUI) and the very same security rules will apply to all methods
as permissions are kept centrally in PostgreSQL and are managed by PostgreSQL
alone. Consistency avoids security leaks at any level.

### Data API layer

The data API layer is handled by [PostgREST](http://postgrest.org) which is a
Haskell application capable of exposing a database schema as a REST API. During
startup, PostgREST will inspect the system catalog and create the API according
to the server side permissions.

Tables, views, functions, and procedures will automatically turn into ready to
use REST endpoints taking full advantage of the server side permissions setup.

CYPEX uses PostgREST on the `cypex_generated` schema to expose real customer
data.

### Server side logic: NodeJS code

In addition to PostgREST, a NodeJS backend exposes needed functionality, such as

- login (integrated and LDAP)
- accessing available applications, structure and metadata
- administrative work
  - manage and generate new applications
  - manage users
  - inspecting audit logs

### Webserver and reverse proxy

Nginx works as reverse proxy to expose the frontend and the APIs (PostgREST and
NodeJS) at one host. It provides the end user with a single URL to connect to.
SSL certificates can be injected here to expose the whole setup through HTTPS.
Nginx is also configured to log requests to make it easier to detect potential
problems and allow for easier statistics.

### Client side: GUI rendering

At the end of the day the goal of CYPEX is to provide the best user experience
possible. All CYPEX applications are web based. When a user opens a CYPEX
application he basically loads the renderer and fetches a large JSON document
from the server which contains all the information needed to render the
application and present it to the user.

Which pages are available, what colors are desired, where the data for the pie
chart comes from. The JSON document sent by the server has all
this information in a transparent and relatively easy to understand, straight
forward format.

The application configuration is loaded on startup and stays the same until the
session is terminated. This means that a modification on the GUI will not be
visible to active users unless a website reload happens.

Different applications can access the same data and use the same `object views`.
Think of the use case to track product sales: There can be one application to
edit the sales data (for the general workers), one application with a dashboard
and special store statistics for the store manager and one application with a
high level dashboard for the regional manager.

### Live editing: Drag & Drop and usability

Once the data model and the workflow have been defined with the customer, it is
time to enhance the applications.

- Add charts
- Display data in a human readable format
- Add pictures
- Change colors and adjust forms
- Add texts and multi language support

The live editor is an interactive drag & drop tool. While an application is
modified, the published version can still be used.

### Deployment: Cloud-ready containers

CYPEX comes as a set of containers. You can instantly deploy it as part of your
Kubernetes or OpenShift infrastructure. If you
want to run CYPEX on-premise we will help you with deployment.

At this point we are using standard Docker containers with `docker-compose`, which are refreshed and
distributed on a regular basis.
