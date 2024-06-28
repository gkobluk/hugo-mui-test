---
title: "Workflows"
---

# Managing CYPEX workflows

## Understanding basic workflows

Data often comes with some sort of workflow. There are rules how data can be
manipulated and what is possible at each stage of the process. Therefore, CYPEX
comes with an integrated workflow engine which enables developers to build
better applications.

## Objects and workflows

Workflows in CYPEX are anchored at the object level. If an object has a state
column you can attach a workflow to it. Basically a workflow is a graph. Maybe
you want to track the lifecycle of an offer all the way from creation to
signature. It might has to be edited, reviewed, released, and so on. At each
step of the way other actions might be necessary. CYPEX tries to combine all
that into a simple workflow graph.

## States and state changes

To make the terminology clear: In CYPEX we have "states" and "state changes". A
contract might be in state "offered" or "rejected". An example of a state change
would be "send to client", "sign", "reject" and so on.

In the GUI, a state is a valid column entry while a state change is usually a
state change dropdown, allowing you to change the state inline.

At the database level, states as well as state changes are enforced using
database constraints and triggers. That has the advantage that it makes no
difference if you modify data through the CYPEX GUI, the API or directly at the
database level. All checks are always enforced at the lowest level possible.
No matter what - your data will be 100% correct under all circumstances.

```sql
-- create a state
SELECT cypex.create_state(
  78, -- object id
  'working',
  'The employee sits in the office'
)
```

```sql
-- create a state change
SELECT create_state_change(
  78,         -- object id
  NULL,       -- pre state (NULL means row INSERT)
  'working',  -- post state (NULL means row DELETE)
  'Create'    -- label
);
```

## Workflow and permissions

The pure workflow part is usually quite simple. However, there is one more
dimension we got to keep in mind. Permissions: Let us go back to our "loan"
example. While a customer is allowed to apply for a loan he is certainly not
allowed to grant himself the loan. Therefore CYPEX allows you to assign
permissions to individual state changes. Clients will be allowed to apply for a
loan but they won't have the right to grant them - this right is reserved for
bank people only.

Again all permissions are stored in the database to maintain consistency at all
levels.
