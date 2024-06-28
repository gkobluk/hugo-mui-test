## Release Notes

### `v1.3.0`

**Features**

- Install CYPEX on an existing database

  It is now possible to run CYPEX with an existing PostgreSQL database rather than using the one shipped with CYPEX by default

- Usability improvements:

  - Display the table count within a schema
  - Display the table disk size in the entity tree
  - Add the ability to edit the title of a query
  - Display runtime errors in the query preview when creating or editing a query
  - Display the query statement while in edit mode
  - Add the ability to upload an image in the image element configuration

**Resolved Bugs**

- Nested form cannot be set as data source in input elements

- Exported application structure invalid

- _Text input_ default value can't be set

- Keep same name when editing the title of a custom query

- _Table filter_ "is null" not working

- Query list background stripes shift on scroll

- A non-descriptive error is displayed when creating a custom query with a too short name

- page parameter configuration allows parameter type to be unset

- Query data preview returns unexpected data for column with type interval

- LDAP server connection refused kills backend

### `v1.4.1`

**Features**

- Migrate an app definition
  Now, it's possible to migrate apps that have versions different from the latest ones.
  
- Ability to get information about the available DATA API endpoints

- Usability improvements:
  - Add an ability to inject custom CSS styles into an app
  - Add an ability to toggle a modal dialog via an action
  - Fetching query data now available without a visible element
  - Preview all columns of a table
  - Generate pages for specific queries in the app
  - Query information contains which pages were generated
  - Preview the data of an existing query and of a database table
  - Ability to display a custom error message in a form
  - Table reload on form success
  - Data preview for a query in edit mode
  - Ability to delete a role
  - Permissions editing of a custom query
  - Ability to render different elements if the advanced conditional element is not visible
  - Add row actions to an existing table
  - Page title moved to the appbar

**Resolved Bugs**

- Controlled date input/ date-time input cannot be cleared once a value is set

- Creating a date input displays it's nullable even though it's not

- Empty description at _cypex.t_ui_release_ table cause app editor crash

- Can't apply table filter if data fetching results in an error

- CYPEX view permissions are missing in the release v1.1.0

- Internal link button doesn't require the required parameters

### `v1.5.0`

**Features**

- Ability to remove the existing workflow
- Default table simple filter, able to filter on a numeric column
- Notifications can be created and sent by the admin to the end-user
- Ability to see the difference between the query statement and the view statement
- Added info on the queries that this app already includes 
- Ability to see tables and views list during query creation
- Simple UI to build a fixed filter with expressions for the table by using autocomplete input elements
- Ability to use the page load timestamp in custom expression
- Use lodash in custom expressions
- Ability to perform any actions via a button
- Reset an autocomplete input on call button success
- Show more values in the autocomplete input than visible if values are available

**Resolved Bugs**

- Custom query update does not refresh definition.

- Create role doesn't work with non-SQL-identifier role names.

- Edit Workflow transition is broken

- Dragging new columns on the table editor behaves unexpectedly

- GUI doesn't allow completely removing role permissions

- App crashes because geojson element gets non-geojson type JSON

- The marker icon is missing on the Map Input element

- Table action expression autocompletion doesn't work for props

### `v1.6.0`

**Features**

- Enhanced default_color_field element 

- Ability to mark a notification as read

- Can change the uploaded file name - default_file_input

- Ability to configure a helper text for a text input

- New echart version with ability to change the chart theme

- Display a notification via an action

- CYPEX Extensions Store :tada:


**Resolved Bugs**

- Reset button in forms doesn't reset file inputs


### `v1.7.0`

**Features**

- Enhanced create application adding default style section 

- Enhanced Database table list menu (tree view) 

- Enhanced table context menu (displaying icons) 

- Enhanced database section to remember the gui inputs for filter and display

- Enhanced workflow section to remember the workflow stats position

- Adding Application Extensions

- Enable the extensions in the default

- Updating UI-library

- Fixing Multiple file upload


### `v1.7.3`

**Features**

- Installation using an existing external database without the authenticator user, using the database admin user

**Resolved Bugs**

- HOTFIX: For upgrading old versions

- Fixed: Date Time Field losing value

- Fixed: Drop zone for multiple file input


### `v1.7.4`

**Features**

- Added the confirmation modal to delete query

- Display referenced data in the array feild

- Provide repository connection to API container via proxy

**Resolved Bugs**

- Fixed form errors preview

- Deleting a default query removes other queries from different database schema



### `v1.8.0`

**Features**

- Upgrade PostgreSQL database & postgREST docker images to the latest version

- App description as translated markdown text

- Implement permission assignment on default queries

- Trial version for the demo purpose

- Groups for queries - Admin panel

- Application Extension: support company internal repository urls

- Admin Panel: Added filter by query type

- Autogenerate Input Fields for the Form Element


**Resolved Bugs**

- App Crash: Deleting Query/View Error

- Fix elements overflows

- Admin Panel: fix LDAP Configuration

- Show backend message error when the field is not represented in the form


### `v1.8.1`

**Resolved Bugs**

- Add a new Query to the Group

### `v1.8.2`

**Resolved Bugs**

- Replaced: `urlencode` with `jq`

### `v1.8.3`

**Resolved Bugs**

- Improved CYPEX uninstallation

### `v1.8.4`

**Resolved Bugs**

- Fixed function to create all possible custom queries if no query has been created.


### `v1.8.5`

**Features**

- Backend Refactor.

- Added translation to the Query group.

- Enhanced Workflow UI.

- Button to create a new record moved to a default table config.

**Resolved Bugs**

- Resolved bugs impacting Workflow transitions.

- Copy table element bug.

- Admin Panel - broken Query filter.

### `v1.8.6`

**Features**

- Ability to drag&drop query into the query group.

- Application creation: query selection tree and query description.

- Demo data for CYPEX trial version.

- Enable/disable autocomplete element via custom expression.

**Resolved Bugs**

- Fix `current_user` and `current_role` functions to work also in old PostgreSQL versions.

### `v1.8.7-beta.5`

**Features**

- Workflows Enhancements: Implemented Swagger (SWG) and LaTeX endpoints for improved API documentation and reporting capabilities.

- Application Configuration:

  - Added functionality for changing the application logo, enhancing brand customization.

  - Introduced the ability to set the uploaded file name within the Admin panel, streamlining file management.

  - Enabled support for SSL connections, ensuring secure data transmission. 

- User Interface Improvements:

  - Moved the form from the "Generate New Pages" page to the "Edit App" page, simplifying the app editing process. 

  - Humanized the Default Query Name, making it more intuitive and user-friendly.

  - Enhanced query functionality by allowing the selection of all possible queries, improving user experience.

  - Updated the Application page to add filtering by roles, enhancing user management.

  - Introduced custom expressions disable switcher for all elements, providing better UI control. 

  - Implemented changes to allow users to change legend labels in line and bar charts, enhancing data visualization. 

- Security and Maintenance:

  - Removed superuser privileges, enhancing system security. 

  - Implemented a feature to delete all queries, simplifying database maintenance. 

**Resolved Bugs**

- Addressed issues in tests, ensuring reliability and stability.

- Released fixes for version 1.8.7, improving overall application performance and user experience. 


### `v1.8.8`

**Features**

- User-Friendly Geo JSON Editor: introducing a new, user-friendly Geo JSON editor that simplifies the process of editing and managing Geo JSON data.

- Custom Expression Editor: Added a custom expression editor that is now expanded in a modal window, enhancing the user experience by providing a more spacious and focused environment for creating and managing expressions.

- Admin Panel: Synchronize Table Columns Updates.

- The application can now be deployed on OpenShift, leveraging its powerful orchestration and management features for Kubernetes environments.

**Resolved Bugs**

- Fixed a bug where tables were being generated without actions, improving the table generation process.

- Fixed issues related to build edition settings that were causing problems in deployment. This ensures smoother and more reliable deployments.


