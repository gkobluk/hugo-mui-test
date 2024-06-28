# Model Builder

The model builder can be used to view and manage CYPEX metadata.

Here you can manage `modules`, `objects`, `states`, `state changes` and
`object views`.

Alternatively, you can use DB functions provided by CYPEX.

## Object View

### Identifying column

This column should always be set if possible. It's used to identify a row of
the view. You can think of it as the primary key of the view row.

This is needed to edit an delete rows.

### State column

This column determines the state column if there is any. This is needed for the
table to correctly extract the state value of each row, which is used to check
the current row permission.
