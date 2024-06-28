---
title: "EXTENSIONS"
---


# EXTENSIONS

## CODE EXPLORATION, NOTES & FINDINGS

The `CREATE EXTENSION` statement was searched in the code: [https://github.com/cybertec-postgresql/cypex](https://github.com/cybertec-postgresql/cypex) and it was found in `engine/general.sql` (line 2 to 8)

```
CREATE EXTENSION IF  NOT  EXISTS pg_trgm;
CREATE EXTENSION IF  NOT  EXISTS citext;
CREATE EXTENSION IF  NOT  EXISTS btree_gist;
CREATE EXTENSION IF  NOT  EXISTS plpython3u;
CREATE EXTENSION IF  NOT  EXISTS pgcrypto;
CREATE EXTENSION IF  NOT  EXISTS node_parser;
CREATE EXTENSION IF  NOT  EXISTS pg_permissions;
```

---

## pg_trgm

#### How to install the extension

- Ubuntu/Debian: `sudo apt install postgresql-contrib`
- Redhat/Centos: `sudo dnf install postgresql10-contrib`
- Fedora: `sudo dnf install postgresql-contrib`

#### How the extension is used?

It seems that the extension is not used at all.
It is only created in the `engine/general.sql` file, but it is never called.

---

## citext

#### How to install the extension

- Ubuntu/Debian: `sudo apt install postgresql-contrib`
- Redhat/Centos: `sudo dnf install postgresql10-contrib`
- Fedora: `sudo dnf install postgresql-contrib`

#### How the extension is used?

The `citext` module provides a case-insensitive character string type, citext. Essentially, it internally calls lower when comparing values. Otherwise, it behaves almost exactly like text.
It seems that the extension is used in: `app/src/api/utils/generate/dataTypes.ts` (line 32).

```ts
const  conditionMapping: Array<{ condition: RegExp; type: UnifiedDataType }> = [
	{
		type:  "text",
		condition: /^char|text|citext/,
	},
	...
```

#### Which CYPEX features depend on the extension?

`conditionMapping` is used in the same file: `app/src/api/utils/generate/dataTypes.ts` in line 79 to 84:

```ts
export const getUnifiedDataType: getUnifiedDataType = (dataType) => ({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  type: conditionMapping.find(({ condition }) => condition.test(dataType))!
    .type,
  isArray: checkIsArray(dataType),
});
```

#### How hard would it be to remove the extension?

In this case, it seems that citext is not used anywhere in the code. Simply, it is created so that the user doesn’t have to create it (if they want to use that extension). It might be decided to remove that extension since the user can easily do it on their own.
But since the extension is in `contrib` (and thus is installed by default) there's no need to remove it.

But since the extension is in `contrib` (and thus is installed by default) there's no need to remove it.

---

## btree_gist

#### How to install the extension

- Ubuntu/Debian: `sudo apt install postgresql-contrib`
- Redhat/Centos: `sudo dnf install postgresql10-contrib`
- Fedora: `sudo dnf install postgresql-contrib`

#### How the extension is used?

It seems that the extension is not used at all.
It is only created in the `engine/general.sql` file, but it is never called.

---

## pgcrypto

#### How to install the extension

- Ubuntu/Debian: `sudo apt install postgresql-contrib`
- Redhat/Centos: `sudo dnf install postgresql10-contrib`
- Fedora: `sudo dnf install postgresql-contrib`

#### How the extension is used?

The `crypt` function from `pgcrypto` is being used. In the file: `engine/auth.sql`
Line 144. (Inside function: `cypex_api_internal.user_integrated_create`, which goes from line 120 to 150).

---

## pg_permissions

#### How to install the extension

Make sure the PostgreSQL extension building infrastructure is installed. If you installed PostgreSQL with installation packages, you usually need to install the "development"-Package.

Make sure that pg_config is on your PATH. Then type:

```sh
make install
```

Then connect to the database where you want to run pg_permissions and use:

```sql
CREATE EXTENSION pg_permissions;
```

To upgrade from an older version of the extension, run:

```sql
ALTER EXTENSION pg_permissions UPDATE;
```

You need CREATE privileges on the schema where you install the extension.

##### Installation without the extension building infrastructure

This is also what Windows users will have to do because there is no extension building infrastructure for Windows.

Find out where your PostgreSQL share directory is:

```sh
pg_config --sharedir
```

Then copy pg_permissions.control and the SQL files to the extension subdirectory of that directory, e.g.
`copy pg_permissions.control *.sql "C:\Program Files\PostgreSQL\10\share\extension"`

You still have to run `CREATE EXTENSION` as described above.

#### How the extension is used?

It is used for a fact in `engine/models/builder`. Extensions can run any SQL code. By default, they run their code in the public schema, which means that the created functions, tables, views, etc, are created in that schema.
The extension is used in the file: `engine/model/builder/model.sql`

All ones that match with `public.*_permissions` are from pg_permissions:

`public.schema_permissions` (line 162)
`public.table_permissions` (line 210)
`public.view_permissions` (line 271)

---

## This extension is deprecated. CYPEX doesn't use it anymore.
## plpython3u

#### How to install the extension

```sh
apt-get update && apt-get install postgresql-plpython3-11
```

First, identify the PostgreSQL version:

```sh
sudo apt-cache search ".*plpython3.*" (example output: postgresql-plpython3-13 - PL/Python 3 procedural language for PostgreSQL 13)
```

Then:

```sh
sudo apt-get install postgresql-contrib postgresql-plpython3-13
```

#### How the extension is used?

The extension is used in the file: `engine/model_creation.sql`. Line 2409.

The `cypex.set_object_view_ui_restr()` function depends on this extension. From line: 1504 to line: 2409. 905 code lines.

This function sets the `t_object_view(ui_restr)` column according to attribute data types and `NOT NULL` constraints, and according to domain type constraints.

The `cypex.set_object_view_ui_restr()` function is used in the next files:

- `engine/model_creation.sql` - Line 1236 to 1394, in the cypex.create_object_view function (1 time)
- `engine/ui.sql` - Line 2, 11, 15
- `test/regress/input/object_view_ui_restr.sql` - Line 47, 57, 68, 80, 92

## node_parser

#### How to install the extension

This is a custom extension. It can be found in the `cypex` repository: `docker/postgres/setup/node_parser`

#### How the extension is used?

It seems that this custom extension is used to parse data. The extension is used in the files:

`docker/postgres/setup/node_parser/node_parser--1.0.sql`
`engine/model_creation.sql` line 1912:

```py
func_name = 'node_parser.bytea_to_%s' % (suffix,)
```

# FOCUS

The main focus will be on the `cypex.set_object_view_ui_restr()` function. Extensions `plpython3u` and `node_parser` (custom) are both used in it.

- `plpython3u` in line 2409
- `node_parser` in line 1912

---

# `cypex.set_object_view_ui_restr()`

The function `cypex.set_object_view_ui_restr()` goes from line 1504 to line 2409.

It receives two `text` type parameters: `v_view_schema` and `v_view_name`.
e.g

```
CREATE  FUNCTION cypex.set_object_view_ui_restr(v_view_schema text, v_view_name text)
RETURNS void
```

The function sets the `t_object_view(ui_restr)` column according to attribute data types and `NOT NULL` constraints, and according to domain type constraints.

## Python Libraries Used

The function uses 3 Python libraries:

- `json`
- `re`
- `sys`

### json

JSON (JavaScript Object Notation), specified by RFC 7159 (which obsoletes RFC 4627) and by ECMA-404, is a lightweight data interchange format inspired by JavaScript object literal syntax (although it is not a strict subset of JavaScript 1 ). `json` exposes an API familiar to users of the standard library marshal and pickle modules.

> https://docs.python.org/3/library/json.html

### re

This module provides regular expression matching operations similar to those found in Perl.

A regular expression (or RE) specifies a set of strings that matches it; the functions in this module let you check if a particular string matches a given regular expression (or if a given regular expression matches a particular string, which comes down to the same thing).

> https://docs.python.org/3/library/re.html

### sys

This module provides access to some variables used or maintained by the interpreter and to functions that interact strongly with the interpreter. It is always available.

> https://docs.python.org/3/library/sys.html

## Classes in the function

The function has 12 Python classes in it.

- `class CheckConstraint(object)`&rarr; _Line 1514 to 1522_
- `class Node(object)` &rarr; _Line 1524 to 1563_
- `class NodeField(Node)` &rarr; _Line 1577 to 1595_
- `class NodeList(Node)` &rarr; _Line 1597 to 1608_
- `class ConstValue(Node)` &rarr; _Line 1610 to 1622_
- `class Token(object)` &rarr; _Line 1630 to 1636_
- `class Parser(object)` &rarr; _Line 1638 to 1795_
- `class CollectNodeInfoContext(object)` &rarr; _Line 1797 to 1802_
- `class GatherConstantsContext(object)` &rarr; _Line 1822 to 1824_
- `class Attribute(object)` &rarr; _Line 1988 to 1993_
- `class NodeToJSONSchemaContext(object)` &rarr; _Line 1995 to 2007_
- `class CheckConstraint(object)` &rarr; _Line 2120 to 2128_

The class `CheckConstraint(object)` &rarr; Line 1514 to 1522 has exactly the same code that the class `CheckConstraint(object)` &rarr; Line 2120 to 2128

## Input

The functions receives two `text` type parameters: `v_view_schema` and `v_view_name`.
e.g
`select cypex.set_object_view_ui_restr('cypex_generated', 'v_workspace_t_employee')`

### `workspace.t_employee` table creation

```sql
CREATE TABLE t_employee (
	id bigserial PRIMARY KEY,
	name text NOT NULL UNIQUE,
	state text DEFAULT 'working',
	age int,
	age int,
    check(age > 18)
);
```

## Output

The function itself does not return anything (`RETURNS void`), but it updates a `JSON` in a Cypex `view`with all the constraints to apply in the Cypex frontend.
e.g.
`select ui_restr from cypex.t_object_view where view_name = 'v_workspace_t_employee'`

`ui_restr` _field_

```json
{
  "properties": {
    "age": {
      "type": "integer"
    },
    "id": {
      "type": "integer"
    },
    "name": {
      "exclusiveMinimum": 18,
      "type": "string"
    },
    "state": {
      "type": "string"
    }
  },
  "required": ["name", "name"],
  "type": "object"
}
```

## plpy.execute(""" """)

The plpy module provides two functions called `execute` and `prepare`. Calling `plpy.execute` with a query string and an optional limit argument causes that query to be run and the result to be returned in a result object. The result object emulates a list or dictionary object. The result object can be accessed by row number and column name. It has these additional methods: `nrows` which returns the number of rows returned by the query, and `status` which is the `SPI_execute()` return value. The result object can be modified.
https://www.postgresql.org/docs/9.1/plpython-database.html

`res = plpy.execute(query)`

This Python function was coded to replace this function extension:

```py
conn = psycopg2.connect(conn_string)
cursor = conn.cursor()
cursor.execute(stmt)
desc = cursor.description
column_names = [col[0] for col in desc]
data = [dict(zip(column_names, row)) for row in cursor.fetchall()]
res = data
```

## Limitations

It seems to not be possible to create validations that try to find data in other tables or complex calculations via functions.

The function updates a json field in a Cypex model view according to the model constraints in order to be automatically loaded by the Cypex frontend, when the `"+"` button is clicked. The function acts as a mapper and a parser.

---

---

## node_parser - Custom Extension

This extension is used in the file:
`docker/postgres/setup/node_parser/node_parser--1.0.sql`

It is used to create three functions:

- `bytea_to_text()`
- `bytea_to_bool_array()`
- `bytea_to_text_array()`

This functions are defined in the file:
`docker/postgres/setup/node_parser/node_parser.c`

---

It seems that the `bytea_to_array()` function is not used by the `node_parser` extension.

---

## bytea_to_text() function

It seems that this function could be replaced for the postgres `convert_from` function and the proper database encoding. However, it still has not been confirmed.

It seems that this function could be replaced for the postgres `convert_from` function and the proper database encoding. However, it still has not been confirmed.

## Where is used?

The functions are used in the file:
`engine/model_creation.sql`_(line 1912)_

```py
func_name = 'node_parser.bytea_to_%s' % (suffix,)
```

The `node_parser` is used in 3 functions coded in `C`, in a maximum of 8 lines each. It seems to be used to parse byte data to text, boolean, and array.

## Issue to face

It seems there is an `array_text` constraint that doesn't allow the `node_parser` extension removing. It is generated to automatically enforce allowed states, via the function `cypex.enforce_states`. It blocks the removal of the `node_parser` extension because it forces a `text_array` constraint. The `node_parser` extension is currently needed to handle this type of constraint.

Unfortunately I don't know how to process the binary array w/o the extension. I don't think postgres has a function that we could use. I'll think about it. It would be possible to process the arrays in python, but it won't be simple.

PG stores CHECK constraints in the `conbin` column of the `pg_constraint` catalog, for example:

```
{SCALARARRAYOPEXPR :opno 98 :opfuncid 67 :useOr true :inputcollid 100 :args ({VAR :varno 1 :varattno 3 :vartype 25 :vartypmod -1 :varcollid 100 :varlevelsup 0 :varnosyn 1 :varattnosyn 3 :location 94} {CONST :consttype 1009 :consttypmod -1 :constcollid 100 :constlen -1 :constbyval false :constisnull false :location 105 :constvalue 76 [ 48 1 0 0 1 0 0 0 0 0 0 0 25 0 0 0 4 0 0 0 1 0 0 0 44 0 0 0 119 111 114 107 105 110 103 0 44 0 0 0 109 101 101 116 105 110 103 0 48 0 0 0 118 97 99 97 116 105 111 110 52 0 0 0 100 105 115 109 105 115 115 101 100 0 0 0 ]}) :location 100}
```

The function is used to convert the constraints to some JSON format, so that the Cypex UI can prevent users from entering illegal values into the forms, before he tries to insert the data into the table. C functions were written to convert the CONST expressions to text. For text values I found `convert_from()` SQL function, but the constant can also be an array of various types. I don't think PG has functions for these.

Of course we can write python code for that, but that would have to deal with the internal representation of the array / varlena types, care of endianness and alignment, in short it'd be very fragile.

I think that the requirement to use the internal value of `pg_constraint(conbin)` as an input is a problem itself.

# Conclusion

If the following requirements are to be maintained:

- Automatically update the constraints in the frontend according the backend constraints
- Removig the custom `node_parser` extension
- Keeping the `plpython3u` Python extension

...it seems that would be hard to replace the C functions in the custom node_parser extension with Python code.

_C functions:_

- `bytea_to_text()`: is not confirmed yet, but it seems that could be easily replaced by the convert_from PostgreSql function with the proper database enconding.
- `bytea_to_text_array()` it seems that could be replaced by a new and very complex Python function, not end to end tested yet..
- `bytea_to_bool_array()` it seems that could be replaced by a new and very complex Python function, not tested yet.

---

# Possible Solution Path

A possible solution path could be trying to parse directly the constraint definitions.

```sql
SELECT pg_get_constraintdef(oid) FROM pg_constraint;
```

Output:

```
CHECK ((VALUE >= 0))
CHECK ((user_name ~ '^[^@]{3,64}'::text))
FOREIGN KEY (ui_history_id) REFERENCES cypex.t_ui_history(id) ON DELETE CASCADE
PRIMARY KEY (id)
CHECK ((age > 18))
PRIMARY KEY (id)
UNIQUE (name)
CHECK ((state = ANY ('{working,meeting,vacation,dismissed}'::text[])))
```

---

## Tries

For parsing SQL, this can be used: [https://github.com/pganalyze/libpg_query#resources](https://github.com/pganalyze/libpg_query#resources)

```py
pip install pglast
import pglast
```

---

```py
query = "select age > 18"
pglast.parser.parse_sql_json(query)
```

Output:

```json
{
  "version": 130003,
  "stmts": [
    {
      "stmt": {
        "SelectStmt": {
          "targetList": [
            {
              "ResTarget": {
                "val": {
                  "A_Expr": {
                    "kind": "AEXPR_OP",
                    "name": [
                      {
                        "String": {
                          "str": ">"
                        }
                      }
                    ],
                    "lexpr": {
                      "ColumnRef": {
                        "fields": [
                          {
                            "String": {
                              "str": "age"
                            }
                          }
                        ],
                        "location": 7
                      }
                    },
                    "rexpr": {
                      "A_Const": {
                        "val": {
                          "Integer": {
                            "ival": 18
                          }
                        },
                        "location": 13
                      }
                    },
                    "location": 11
                  }
                },
                "location": 7
              }
            }
          ],
          "limitOption": "LIMIT_OPTION_DEFAULT",
          "op": "SETOP_NONE"
        }
      }
    }
  ]
}
```

---

```py
query = "SELECT state = ANY ('{working,meeting,vacation,dismissed}'::text[])"
pglast.parser.parse_sql_json(query)
```

Output:

```json
{
  "version": 130003,
  "stmts": [
    {
      "stmt": {
        "SelectStmt": {
          "targetList": [
            {
              "ResTarget": {
                "val": {
                  "A_Expr": {
                    "kind": "AEXPR_OP_ANY",
                    "name": [
                      {
                        "String": {
                          "str": "="
                        }
                      }
                    ],
                    "lexpr": {
                      "ColumnRef": {
                        "fields": [
                          {
                            "String": {
                              "str": "state"
                            }
                          }
                        ],
                        "location": 7
                      }
                    },
                    "rexpr": {
                      "TypeCast": {
                        "arg": {
                          "A_Const": {
                            "val": {
                              "String": {
                                "str": "{working,meeting,vacation,dismissed}"
                              }
                            },
                            "location": 20
                          }
                        },
                        "typeName": {
                          "names": [
                            {
                              "String": {
                                "str": "text"
                              }
                            }
                          ],
                          "typemod": -1,
                          "arrayBounds": [
                            {
                              "Integer": {
                                "ival": -1
                              }
                            }
                          ],
                          "location": 60
                        },
                        "location": 58
                      }
                    },
                    "location": 13
                  }
                },
                "location": 7
              }
            }
          ],
          "limitOption": "LIMIT_OPTION_DEFAULT",
          "op": "SETOP_NONE"
        }
      }
    }
  ]
}
```

---

```py
query = "SELECT name ~ 'test.*'"
pglast.parser.parse_sql_json(query)
```

Output:

```json
{
  "version": 130003,
  "stmts": [
    {
      "stmt": {
        "SelectStmt": {
          "targetList": [
            {
              "ResTarget": {
                "val": {
                  "A_Expr": {
                    "kind": "AEXPR_OP",
                    "name": [
                      {
                        "String": {
                          "str": "~"
                        }
                      }
                    ],
                    "lexpr": {
                      "ColumnRef": {
                        "fields": [
                          {
                            "String": {
                              "str": "name"
                            }
                          }
                        ],
                        "location": 7
                      }
                    },
                    "rexpr": {
                      "A_Const": {
                        "val": {
                          "String": {
                            "str": "test.*"
                          }
                        },
                        "location": 14
                      }
                    },
                    "location": 12
                  }
                },
                "location": 7
              }
            }
          ],
          "limitOption": "LIMIT_OPTION_DEFAULT",
          "op": "SETOP_NONE"
        }
      }
    }
  ]
}
```

---

```py
query = "SELECT name LIKE 'test%' and age > 15"
pglast.parser.parse_sql_json(query)
```

Output:

```json
{
  "version": 130003,
  "stmts": [
    {
      "stmt": {
        "SelectStmt": {
          "targetList": [
            {
              "ResTarget": {
                "val": {
                  "BoolExpr": {
                    "boolop": "AND_EXPR",
                    "args": [
                      {
                        "A_Expr": {
                          "kind": "AEXPR_LIKE",
                          "name": [
                            {
                              "String": {
                                "str": "~~"
                              }
                            }
                          ],
                          "lexpr": {
                            "ColumnRef": {
                              "fields": [
                                {
                                  "String": {
                                    "str": "name"
                                  }
                                }
                              ],
                              "location": 7
                            }
                          },
                          "rexpr": {
                            "A_Const": {
                              "val": {
                                "String": {
                                  "str": "test%"
                                }
                              },
                              "location": 17
                            }
                          },
                          "location": 12
                        }
                      },
                      {
                        "A_Expr": {
                          "kind": "AEXPR_OP",
                          "name": [
                            {
                              "String": {
                                "str": ">"
                              }
                            }
                          ],
                          "lexpr": {
                            "ColumnRef": {
                              "fields": [
                                {
                                  "String": {
                                    "str": "age"
                                  }
                                }
                              ],
                              "location": 29
                            }
                          },
                          "rexpr": {
                            "A_Const": {
                              "val": {
                                "Integer": {
                                  "ival": 15
                                }
                              },
                              "location": 35
                            }
                          },
                          "location": 33
                        }
                      }
                    ],
                    "location": 25
                  }
                },
                "location": 7
              }
            }
          ],
          "limitOption": "LIMIT_OPTION_DEFAULT",
          "op": "SETOP_NONE"
        }
      }
    }
  ]
}
```

---

It seems that we do have the necessary data and keywords to take the proposed path.
