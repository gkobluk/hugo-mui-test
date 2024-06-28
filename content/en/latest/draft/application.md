---
title: "Application"
---

# Relational data model

## Getting started with a data model

The core of every application is the data model. You cannot store data unless
there is some sort of database table associated with it. Every application is
driven by some sort of schema.
As CYPEX consultants, we focus on data and therefore it is important to extract
enough information from the client to create a data model. Note that the data
model is at the core because we use it to predict the default application
(= default rendering).

## Modeling a sample application

To show how a CYPEX model is structured we assume a customer who has come to us
because he wants to store information about "cars" and "drivers". Usually the
request is: "I want to handle car data". Of course nobody can build an
application with this information so we have to interview the client. The
interview process might yield us the following data model:

```sql
CREATE TABLE t_car
(
	id			serial		PRIMARY KEY,
	licence_plate_number	text		UNIQUE NOT NULL,
	model			text		NOT NULL,
	purchase_date		date		NOT NULL CHECK (purchase_date > '2000-01-01')
);

CREATE TABLE t_gender
(
	id			int		PRIMARY KEY,
	gender_name		text		NOT NULL
);

INSERT INTO t_gender VALUES (1, 'male'), (2, 'female');

CREATE TABLE t_driver
(
	id			serial		PRIMARY KEY,
	login_email		text		UNIQUE NOT NULL,
	name			text		NOT NULL,
	gender_id		int		REFERENCES t_gender (id)
							ON UPDATE CASCADE,
	has_license		boolean		NOT NULL DEFAULT true
);

CREATE TABLE t_log
(
	id			serial		PRIMARY KEY,
	car_id			int		REFERENCES t_car (id),
	driver_id		int		REFERENCES t_driver (id),
	start_rent		date		NOT NULL,
	end_rent		date		NOT NULL,
	EXCLUDE USING gist (
		car_id WITH =,
		driver_id WITH =,
		tsrange(start_rent, end_rent) WITH &&)
);
```

The model has been designed in the most simplistic way possible. We got cars
with some simple attributes and a driver with a gender.
Finally we got a log table which stores who had which car when. The only trick
here is that I have applied an exclusion constraints which ensures that the same
car cannot be driven twice at the same time by different people.
Also: The very same person cannot drive two cars at
the same time.

Once we have this information we basically know what kind of information can be
stored. We cannot expose forms and input fields if there is no way to actually
store the data somewhere.

Once this is done we got to take a look and turn this information into a shiny
application.

# Modules & Objects

## Understanding modules

Suppose you have a really large database containing hundreds of tables
organized in various schemas. The important part is that in many cases only a
handful of tables will actually be needed by the application. Maybe we only want
to take care of a single schema or simply visualize some of the tables. CYPEX
can do exactly that.

The highest level of organization in CYPEX is a "module". A module is associated
with a database schema. What we basically say is that we want to turn tables in
a certain schema into an application. A module is in many cases already an
"application". However, it can happen that an application is using more than one
module (e.g. sales + accounting + marketing). Modules are the biggest building
block. At the CYPEX backend level everything is part of a module.

In our case we would simply create a simple module:

    - Name: car_app

- Title: Car Application
  - Description: A simple application to handle car reservations
  - Schema: public

The according function call would be

```sql
SELECT cypex.create_module(
  'car_app',
  'public',
  'Car Application',
  'A simple application to handle car reservations'
)
```

## Understanding objects

At the next level we are organizing our data as objects.
Let's assume a simple scenario: - We want to build one application to handle cars, drivers, and the log

Our data structure consists of four tables. one of those tables is to save the
gender of the driver. This table is not important for our application, thus we
won't make it a module. Therefore we can turn the remaining three tables into
objects. In a CYPEX context, an objects is really just a table that is relevant
to the GUI.

Example function call:

```sql
SELECT cypex.create_object(
  42,       -- module id
  'car',    -- object name
  't_car',  -- table name
  NULL      -- state column
)
```

Objects have descriptions and always belong to a module. It is our way of
telling the application prediction engine that data has to be exposed via the
API and that tables, forms, and so on have to exist in the new application.

An object might point to a "state column". If an object has a state column,
you can attach a workflow to it. State columns can be added after
the creation of the object with the `cypex.set_state_column` function.

# Object views

## Representing data in a useful way

The data in a relational database might not be ideal from an enduser's point of
view. Let's take a look at a simple example:

```sql
test=# SELECT * FROM t_driver;
 id | login_email | name | gender_id | has_license
----+-------------+------+-----------+-------------
(0 rows)
```

What is the end user expected to do with the `gender_id` column? This is not
the way to represent data. Therefore we have introduced the concept of "object
views". An object view is basically an SQL statement attached to an object. In
our case this SQL statement might look as follows:

```sql
SELECT  a.id, a.login_email, a.name AS driver_name,
	b.gender_name, a.has_license
FROM 	t_driver AS a, t_gender AS b
WHERE 	a.gender_id = b.id;
 id | login_email | driver_name | gender_name | has_license
----+-------------+-------------+-------------+-------------
(0 rows)
```

This is more likely what people might want to see in a form. In other words: In
CYPEX, the way data is displayed and the way it is stored has usually only a
loose connection. We offer all the flexibility you need.

Behind the scenes we really create a database view in "cypex_generated". That
has a couple of advantages: Let us consider the following example. A person
might be allowed to see the total turnover but not the individual sales data.
Object views are real views and therefore even the permission system is based on
the permissions assigned to those views. This means that we can assign
permissions to a representation of data and not to the data itself. One person
might have the rights to see the aggregated data and somebody else might only be
allowed to see this week's sales. A CYPEX consultant can make full use of the
PostgreSQL permission system without having to learn any new technology.

To make the creation of a model easier we offer the ability to create "default
views". This makes it easier if you simply want to display the data as it is.

```sql
SELECT cypex.create_object_view(
  47 -- object id
  'v_driver' -- generated view name (optional)
)
```

This generates a simple view like this:

```sql
SELECT *
FROM public.t_driver
```

However, in many cases that is not the desired way.

If you want your object view to be updatable you have to do so during object
view creation. In many cases PostgreSQL will be able to provide you with
auto-updatable views directly. However, if the view is too complex you have to
write a trigger to tell PostgreSQL how to handle changes in the base tables.

If you want to update the object view (maybe editing a "driver" or a "car") you
have to tell CYPEX which column in the view is the identifier so that the correct
data is changed behind the scenes. For default object views, the identifier is
set based on your constraints (PRIMARY KEY / UNIQUE).
