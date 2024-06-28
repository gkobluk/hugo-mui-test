---
title: "Foreign Data"
---

# Remote objects

## Integrating remote data

Experience has shown that data is not always local. In many cases, tables from
various databases have to be combined. Customers might be in Oracle, sales in
PostgreSQL and deliveries in IBM DB2 LUW. How can one handle these cases? The
CYPEX answer is "remote objects". If you turn a table into an object it can also
point to an FDW (Foreign Data Wrapper). In many cases this is perfectly fine.

However, remote objects come with a major restriction:

    - No support for workflows

We cannot enforce workflows on a remote host so there is no support for those
operations. You will be limited to CRUD operations and standard support for
object views (= reading and basic writes).

Example:

```sql
IMPORT FOREIGN SCHEMA sales
	FROM SERVER sales_server
	INTO remote_sales;

SELECT cypex.create_object(
  42, -- module id
  'sales',
  't_sale_history',
  NULL
);
```

### Remote objects and performance

What people often forget is that remote objects come with a price tag. Remote
tables are of course slower than local table. We therefore advise everybody to
use this feature with caution to maintain good performance and a proper user
experience.
