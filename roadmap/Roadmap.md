*Stage 1: Basics*
SELECT, WHERE, ORDER BY, LIMIT
Filtering operators: AND/OR, IN, BETWEEN, LIKE, IS NULL
Aggregates: COUNT, SUM, AVG, MIN, MAX
GROUP BY and HAVING (and the difference between WHERE and HAVING)
NULL handling: COALESCE, why = NULL doesn’t work, how NULLs behave in COUNT
Basic functions: string, date, CASE WHEN

Practice: filter and summarise a single table, such as sales by month or customers by city.

*Stage 2: Joins and structure*
INNER, LEFT, RIGHT, FULL joins, plus CROSS and SELF joins
Join pitfalls(make the queries slow): duplicate rows from one-to-many joins, filtering in ON vs WHERE
UNION vs UNION ALL, INTERSECT, EXCEPT
Subqueries: in WHERE, FROM and SELECT, and IN vs EXISTS
DDL and DML: CREATE, INSERT, UPDATE, DELETE, constraints, primary and foreign keys
Basic normalisation: why tables are split

Practice: “customers with no orders,” “top 5 products by revenue,” “employees earning more than their manager.”

*Stage 3: Intermediate, the interview core*
CTEs (WITH): readable multi-step queries
Window functions (the most common interview topic):
ROW_NUMBER, RANK, DENSE_RANK
LAG and LEAD
Running totals with SUM() OVER
PARTITION BY and ORDER BY, and frame clauses
NTILE, FIRST_VALUE, LAST_VALUE
Dedupe patterns and “top N per group”
Date logic: month-over-month change, rolling averages, date gaps
Pivoting with CASE WHEN
Gaps and islands, such as consecutive login days

Practice: second highest salary per department, latest row per key, users with 3 consecutive days of activity, year-over-year growth.

*Stage 4: Advanced*
Query performance: reading execution plans, indexes (and when they don’t help), avoiding SELECT *, join order, filtering early
Recursive CTEs: hierarchies, org charts
Data modeling: star and snowflake schemas, facts and dimensions, SCD Type 1 and 2
Incremental loading: MERGE / upsert patterns, handling late-arriving data
Transactions and isolation levels: ACID basics
Partitioning and clustering concepts in warehouses
Data quality checks in SQL: duplicates, nulls, referential integrity, row-count reconciliation

Practice: write a SCD Type 2 load, rewrite a slow query, and explain why it got faster.

How to learn each stage:
1. Learn the concept briefly.
2. Solve 10 to 15 problems on it.
3. Explain your solution out loud, as in an interview.
4. Review mistakes before moving on.
