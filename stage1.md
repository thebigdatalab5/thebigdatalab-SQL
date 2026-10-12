# SQL Stage 1: The Basics, Explained Simply

Prepared for TheBigDataLab, October 2026

## Contents

- [How to use this guide](#how-to-use-this-guide)
- [0. What is SQL, and what is a table?](#0-what-is-sql-and-what-is-a-table)
- [1. Our practice table](#1-our-practice-table)
- [2. SELECT and FROM](#2-select-and-from-choosing-what-to-see)
- [3. WHERE](#3-where-filtering-rows)
- [4. ORDER BY and LIMIT](#4-order-by-and-limit-sorting-and-trimming)
- [5. Aggregate functions](#5-aggregate-functions-summarising-many-rows-into-one)
- [6. GROUP BY](#6-group-by-one-summary-per-group)
- [7. HAVING](#7-having-filtering-groups)
- [8. NULL](#8-null-the-missing-value)
- [9. Basic functions](#9-basic-functions-text-dates-and-case-when)
- [10. Order of execution](#10-the-order-sql-actually-runs-your-query)
- [11. Common mistakes](#11-common-beginner-mistakes)
- [12. Practice exercises](#12-practice-exercises)
- [13. Answers](#13-answers)
- [14. Interview questions](#14-interview-questions-with-short-answers)
- [15. 10-day study plan](#15-a-10-day-study-plan)

## How to use this guide

This guide takes you from zero to confident with the basics of SQL. Every idea is explained in plain words, shown with a small example, and followed by the exact output you should see. Read one section, type the queries yourself, and check that your result matches. Do not just read: SQL is learned by typing.

All examples use one small practice table, so you only have to learn one dataset. SQL syntax is nearly the same across PostgreSQL, MySQL, SQL Server, Spark SQL and Databricks SQL. Where an engine differs, the guide says so. Always check the documentation of the engine you use.

**Interactive playground:** There's a small interactive game that demonstrates these concepts visually. Open `docs/index.html` in a browser to try the "SQL Restaurant" playground locally. To publish it for visitors via GitHub Pages, enable Pages in your repository settings and set the source to the `docs/` folder on the `main` branch.

## 0. What is SQL, and what is a table?

SQL (Structured Query Language) is the language we use to ask questions of data stored in a database. A database stores data in **tables**. A table looks like a spreadsheet:

- A **row** is one record (for example, one employee).
- A **column** is one property of the record (for example, salary).
- A table has a **name** (for example, employees).

A SQL query is a question. For example: *Show me the names of all employees who earn more than 60000.* You write it in SQL, and the database returns a result table.

Three things to remember before you start:

1. SQL describes **what** you want, not **how** to get it. The database decides how.
2. A query usually ends with a semicolon.
3. Keywords like SELECT are not case sensitive, but writing them in capitals makes queries easier to read. Text values such as 'Sales' go in single quotes.

## 1. Our practice table

The table is called **employees**. Run this script once in any SQL engine to create it:

```sql
CREATE TABLE employees (
  emp_id     INT,
  name       VARCHAR(50),
  department VARCHAR(50),
  city       VARCHAR(50),
  salary     INT,
  join_date  DATE,
  bonus      INT
);

INSERT INTO employees VALUES
(1, 'Asha',   'Engineering', 'Bengaluru', 90000,  '2021-03-15', 5000),
(2, 'Ravi',   'Engineering', 'Hyderabad', 75000,  '2022-07-01', NULL),
(3, 'Meena',  'Sales',       'Mysuru',    50000,  '2020-01-10', 3000),
(4, 'Karthik','Sales',       'Bengaluru', 55000,  '2023-02-20', NULL),
(5, 'Priya',  'HR',          'Chennai',   48000,  '2019-11-05', 2000),
(6, 'Arjun',  'Engineering', 'Bengaluru', 120000, '2018-06-12', 10000),
(7, 'Sneha',  'HR',          'Hyderabad', 52000,  '2022-09-30', NULL),
(8, 'Vikram', 'Sales',       'Chennai',   60000,  '2021-08-18', 4000);
```

The table now looks like this. **NULL** means the value is missing or unknown (more on this in section 8):

| emp_id | name | department | city | salary | join_date | bonus |
|---|---|---|---|---|---|---|
| 1 | Asha | Engineering | Bengaluru | 90000 | 2021-03-15 | 5000 |
| 2 | Ravi | Engineering | Hyderabad | 75000 | 2022-07-01 | NULL |
| 3 | Meena | Sales | Mysuru | 50000 | 2020-01-10 | 3000 |
| 4 | Karthik | Sales | Bengaluru | 55000 | 2023-02-20 | NULL |
| 5 | Priya | HR | Chennai | 48000 | 2019-11-05 | 2000 |
| 6 | Arjun | Engineering | Bengaluru | 120000 | 2018-06-12 | 10000 |
| 7 | Sneha | HR | Hyderabad | 52000 | 2022-09-30 | NULL |
| 8 | Vikram | Sales | Chennai | 60000 | 2021-08-18 | 4000 |

## 2. SELECT and FROM: choosing what to see

**SELECT** says which columns you want. **FROM** says which table they come from. This is the heart of every query.

```sql
SELECT name, salary
FROM employees;
```

This returns only the name and salary columns, for all 8 rows:

| name | salary |
|---|---|
| Asha | 90000 |
| Ravi | 75000 |
| Meena | 50000 |
| Karthik | 55000 |
| Priya | 48000 |
| Arjun | 120000 |
| Sneha | 52000 |
| Vikram | 60000 |

To see every column, use a star:

```sql
SELECT * FROM employees;
```

The star is handy for quick looks, but in real work, name the columns you need. It is faster and clearer.

### Aliases: giving a column a new name

Use **AS** to rename a column in the result, and to show a calculated value:

```sql
SELECT name AS employee_name,
       salary * 12 AS annual_salary
FROM employees;
```

| employee_name | annual_salary |
|---|---|
| Asha | 1080000 |
| Ravi | 900000 |
| Meena | 600000 |
| Karthik | 660000 |
| Priya | 576000 |
| Arjun | 1440000 |
| Sneha | 624000 |
| Vikram | 720000 |

### DISTINCT: removing repeats

Which departments exist? Many employees share a department, so we use **DISTINCT** to list each one only once:

```sql
SELECT DISTINCT department
FROM employees;
```

| department |
|---|
| Engineering |
| Sales |
| HR |

The order of rows is not guaranteed unless you use ORDER BY (section 4).

## 3. WHERE: filtering rows

**WHERE** keeps only the rows that meet a condition. SELECT chooses columns, WHERE chooses rows.

```sql
SELECT name, city
FROM employees
WHERE city = 'Bengaluru';
```

| name | city |
|---|---|
| Asha | Bengaluru |
| Karthik | Bengaluru |
| Arjun | Bengaluru |

### Comparison operators

| Operator | Meaning | Example |
|---|---|---|
| = | equal to | city = 'Mysuru' |
| <> or != | not equal to | department <> 'HR' |
| > and < | greater than, less than | salary > 60000 |
| >= and <= | greater or equal, less or equal | salary >= 60000 |

Note that salary > 60000 does **not** include someone earning exactly 60000. Use >= if you want to include it.

### AND, OR, NOT: combining conditions

**AND** needs both conditions to be true:

```sql
SELECT name FROM employees
WHERE department = 'Engineering' AND city = 'Bengaluru';
```

Result: Asha, Arjun.

**OR** needs at least one condition to be true:

```sql
SELECT name FROM employees
WHERE department = 'HR' OR salary > 100000;
```

Result: Priya, Sneha (both HR) and Arjun (salary 120000).

**Important:** AND is evaluated before OR. When you mix them, use brackets so the meaning is clear:

```sql
WHERE (department = 'HR' OR department = 'Sales') AND city = 'Chennai'
```

### IN: matching a list

Instead of writing many ORs, use **IN**:

```sql
SELECT name, city FROM employees
WHERE city IN ('Mysuru', 'Chennai');
```

| name | city |
|---|---|
| Meena | Mysuru |
| Priya | Chennai |
| Vikram | Chennai |

### BETWEEN: matching a range

**BETWEEN** includes both end values:

```sql
SELECT name, salary FROM employees
WHERE salary BETWEEN 50000 AND 60000;
```

| name | salary |
|---|---|
| Meena | 50000 |
| Karthik | 55000 |
| Sneha | 52000 |
| Vikram | 60000 |

### LIKE: matching text patterns

**LIKE** searches text using two special symbols: **%** means any number of characters, and **_** means exactly one character.

```sql
SELECT name FROM employees WHERE name LIKE 'A%';   -- starts with A
```

Result: Asha, Arjun.

```sql
SELECT name FROM employees WHERE name LIKE '%a';   -- ends with a
```

Result: Asha, Meena, Priya, Sneha.

Whether LIKE ignores upper and lower case depends on the engine, so check yours.

## 4. ORDER BY and LIMIT: sorting and trimming

**ORDER BY** sorts the result. The default is ascending (smallest first). Add **DESC** for descending.

```sql
SELECT name, salary
FROM employees
ORDER BY salary DESC;
```

| name | salary |
|---|---|
| Arjun | 120000 |
| Asha | 90000 |
| Ravi | 75000 |
| Vikram | 60000 |
| Karthik | 55000 |
| Sneha | 52000 |
| Meena | 50000 |
| Priya | 48000 |

You can sort by more than one column. The second column breaks ties in the first:

```sql
SELECT department, name, salary
FROM employees
ORDER BY department ASC, salary DESC;
```

| department | name | salary |
|---|---|---|
| Engineering | Arjun | 120000 |
| Engineering | Asha | 90000 |
| Engineering | Ravi | 75000 |
| HR | Sneha | 52000 |
| HR | Priya | 48000 |
| Sales | Vikram | 60000 |
| Sales | Karthik | 55000 |
| Sales | Meena | 50000 |

### LIMIT: only the first few rows

Combine ORDER BY and **LIMIT** to get a top-N result. The three highest salaries:

```sql
SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;
```

| name | salary |
|---|---|
| Arjun | 120000 |
| Asha | 90000 |
| Ravi | 75000 |

**Engine note:** LIMIT works in PostgreSQL, MySQL, Spark SQL and Databricks. SQL Server uses SELECT TOP 3 instead. The standard form is FETCH FIRST 3 ROWS ONLY.

## 5. Aggregate functions: summarising many rows into one

An **aggregate function** looks at many rows and returns a single value. The five you must know:

| Function | What it does |
|---|---|
| COUNT | counts rows |
| SUM | adds values |
| AVG | calculates the average |
| MIN | finds the smallest value |
| MAX | finds the largest value |

```sql
SELECT COUNT(*)   AS total_employees,
       SUM(salary) AS total_salary,
       AVG(salary) AS average_salary,
       MIN(salary) AS lowest_salary,
       MAX(salary) AS highest_salary
FROM employees;
```

| total_employees | total_salary | average_salary | lowest_salary | highest_salary |
|---|---|---|---|---|
| 8 | 550000 | 68750 | 48000 | 120000 |

You can combine aggregates with WHERE. WHERE filters the rows first, then the aggregate runs on what is left:

```sql
SELECT AVG(salary) FROM employees WHERE department <> 'HR';
```

Result: 75000 (the average of the six non-HR salaries).

### COUNT(*) vs COUNT(column)

This is a very common interview question. **COUNT(\*)** counts all rows. **COUNT(column)** counts only the rows where that column is **not NULL**.

```sql
SELECT COUNT(*) AS all_rows,
       COUNT(bonus) AS rows_with_bonus
FROM employees;
```

| all_rows | rows_with_bonus |
|---|---|
| 8 | 5 |

Three employees have a NULL bonus, so COUNT(bonus) is 5. Also note that SUM and AVG ignore NULLs. The average bonus is (5000 + 3000 + 2000 + 10000 + 4000) / 5 = 4800, not divided by 8.

## 6. GROUP BY: one summary per group

Aggregates on their own give one number for the whole table. **GROUP BY** splits the rows into groups and gives one result per group. Think of it as: for each department, calculate...

```sql
SELECT department,
       COUNT(*) AS employee_count,
       AVG(salary) AS average_salary
FROM employees
GROUP BY department;
```

| department | employee_count | average_salary |
|---|---|---|
| Engineering | 3 | 95000 |
| Sales | 3 | 55000 |
| HR | 2 | 50000 |

How to check it: Engineering has Asha (90000), Ravi (75000) and Arjun (120000). The sum is 285000, and 285000 / 3 = 95000.

**The golden rule:** every column in your SELECT must either be inside an aggregate function or be listed in GROUP BY. If you select department and name but only group by department, the engine does not know which name to show, and it gives an error (or a misleading result in some engines).

You can group by more than one column. For example, GROUP BY department, city creates one group per department and city pair:

| department | city | employee_count |
|---|---|---|
| Engineering | Bengaluru | 2 |
| Engineering | Hyderabad | 1 |
| Sales | Mysuru | 1 |
| Sales | Bengaluru | 1 |
| Sales | Chennai | 1 |
| HR | Chennai | 1 |
| HR | Hyderabad | 1 |

## 7. HAVING: filtering groups

Suppose you want only the departments whose average salary is above 52000. You cannot write that in WHERE, because WHERE runs **before** the groups are made. Use **HAVING**, which filters **after** grouping:

```sql
SELECT department, AVG(salary) AS average_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 52000;
```

| department | average_salary |
|---|---|
| Engineering | 95000 |
| Sales | 55000 |

HR (average 50000) is removed.

### WHERE vs HAVING in one line

- **WHERE** filters individual **rows**, before grouping. It cannot use aggregate functions.
- **HAVING** filters **groups**, after grouping. It is where you use aggregate functions.

You can use both in one query. Here we first keep only Bengaluru employees (WHERE), then group by department, then keep only groups with at least 2 people (HAVING):

```sql
SELECT department, COUNT(*) AS employee_count, AVG(salary) AS average_salary
FROM employees
WHERE city = 'Bengaluru'
GROUP BY department
HAVING COUNT(*) >= 2;
```

| department | employee_count | average_salary |
|---|---|---|
| Engineering | 2 | 105000 |

Sales has only one Bengaluru employee (Karthik), so it is filtered out by HAVING. Engineering has Asha (90000) and Arjun (120000), which average 105000.

## 8. NULL: the missing value

**NULL** does not mean zero or an empty string. It means the value is **unknown or missing**. This causes surprises, so learn these rules.

**Rule 1: you cannot test NULL with =.** Use IS NULL or IS NOT NULL.

```sql
SELECT name FROM employees WHERE bonus = NULL;      -- returns no rows (wrong)
SELECT name FROM employees WHERE bonus IS NULL;     -- correct
```

The correct query returns Ravi, Karthik and Sneha. The reason: comparing anything to an unknown value gives *unknown*, not true, so the row is never selected.

**Rule 2: arithmetic with NULL gives NULL.** If you compute salary + bonus, any employee with a NULL bonus gets a NULL result, not their salary.

**Rule 3: aggregates ignore NULLs** (except COUNT(*)), as you saw in section 5.

### COALESCE: replacing NULL with a default

**COALESCE** returns the first value that is not NULL. Use it to give NULLs a default:

```sql
SELECT name,
       salary + COALESCE(bonus, 0) AS total_pay
FROM employees;
```

| name | total_pay |
|---|---|
| Asha | 95000 |
| Ravi | 75000 |
| Meena | 53000 |
| Karthik | 55000 |
| Priya | 50000 |
| Arjun | 130000 |
| Sneha | 52000 |
| Vikram | 64000 |

Without COALESCE, Ravi, Karthik and Sneha would show NULL.

## 9. Basic functions: text, dates and CASE WHEN

Functions transform a value. Names differ slightly between engines, so verify in your documentation.

### Text functions

```sql
SELECT UPPER(name) AS upper_name,
       LENGTH(name) AS name_length,
       CONCAT(name, ' - ', department) AS label
FROM employees
WHERE emp_id = 1;
```

| upper_name | name_length | label |
|---|---|---|
| ASHA | 4 | Asha - Engineering |

Useful ones: UPPER, LOWER, LENGTH (SQL Server uses LEN), CONCAT, TRIM (removes extra spaces), SUBSTRING (cuts part of a text).

### Date functions

To pull the year out of a date, the standard form is EXTRACT:

```sql
SELECT name, EXTRACT(YEAR FROM join_date) AS join_year
FROM employees;
```

| name | join_year |
|---|---|
| Asha | 2021 |
| Ravi | 2022 |
| Meena | 2020 |
| Karthik | 2023 |
| Priya | 2019 |
| Arjun | 2018 |
| Sneha | 2022 |
| Vikram | 2021 |

Some engines also offer YEAR(join_date), MONTH(join_date) and similar. SQL Server uses DATEPART or YEAR. You can also compare dates directly: WHERE join_date > '2021-12-31'.

### CASE WHEN: if-then logic inside SQL

**CASE WHEN** lets you create labels based on conditions. It reads top to bottom and returns the first match:

```sql
SELECT name, salary,
       CASE
         WHEN salary >= 80000 THEN 'High'
         WHEN salary >= 55000 THEN 'Medium'
         ELSE 'Entry'
       END AS salary_band
FROM employees;
```

| name | salary | salary_band |
|---|---|---|
| Asha | 90000 | High |
| Ravi | 75000 | Medium |
| Meena | 50000 | Entry |
| Karthik | 55000 | Medium |
| Priya | 48000 | Entry |
| Arjun | 120000 | High |
| Sneha | 52000 | Entry |
| Vikram | 60000 | Medium |

Always finish with END, and add an ELSE so unmatched rows do not become NULL.

## 10. The order SQL actually runs your query

You write SELECT first, but the database does **not** run it first. The logical order is:

1. **FROM**: pick the table
2. **WHERE**: filter rows
3. **GROUP BY**: make groups
4. **HAVING**: filter groups
5. **SELECT**: choose columns and calculate aliases
6. **ORDER BY**: sort
7. **LIMIT**: trim

This explains several rules at once:

- You cannot use an alias from SELECT inside WHERE, because WHERE runs before SELECT. (ORDER BY can use it, because it runs after.)
- You cannot use an aggregate in WHERE, because groups do not exist yet at that stage.
- HAVING can use aggregates, because it runs after GROUP BY.

This order is a favourite interview topic, so memorise it.

## 11. Common beginner mistakes

1. **Writing = NULL** instead of IS NULL.
2. **Using an aggregate in WHERE.** Wrong: `WHERE AVG(salary) > 50000`. Use HAVING.
3. **Selecting a column that is not in GROUP BY** and not aggregated.
4. **Forgetting quotes around text.** Correct: `city = 'Mysuru'`. Wrong: `city = Mysuru`.
5. **Mixing AND and OR without brackets**, and getting surprising rows.
6. **Expecting a fixed order without ORDER BY.** Without it, row order is not guaranteed.
7. **Using SELECT \* everywhere.** It returns unneeded data and slows queries on large tables.
8. **Forgetting that BETWEEN includes both ends.**
9. **Ignoring NULLs in calculations**, which silently changes totals and averages.

## 12. Practice exercises

Try these yourself before looking at the answers.

1. Show the name and city of every employee in the Sales department.
2. Show the two highest paid employees (name and salary).
3. Show how many employees there are in each city.
4. Show the departments whose average salary is above 52000.
5. List the employees who have no bonus.
6. Show each employee's total pay (salary plus bonus), treating a missing bonus as 0.
7. List the employees who joined after 31 December 2021.
8. Show the average salary of everyone outside HR.
9. Label each employee as 'Senior' if they joined before 2020-01-01, otherwise 'Regular'.
10. Show the number of employees and the highest salary in each department, sorted by highest salary descending.

## 13. Answers

**1.**

```sql
SELECT name, city FROM employees WHERE department = 'Sales';
```

Result: Meena (Mysuru), Karthik (Bengaluru), Vikram (Chennai).

**2.**

```sql
SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 2;
```

Result: Arjun (120000), Asha (90000).

**3.**

```sql
SELECT city, COUNT(*) AS employee_count FROM employees GROUP BY city;
```

Result: Bengaluru 3, Hyderabad 2, Chennai 2, Mysuru 1.

**4.**

```sql
SELECT department FROM employees
GROUP BY department
HAVING AVG(salary) > 52000;
```

Result: Engineering, Sales.

**5.**

```sql
SELECT name FROM employees WHERE bonus IS NULL;
```

Result: Ravi, Karthik, Sneha.

**6.**

```sql
SELECT name, salary + COALESCE(bonus, 0) AS total_pay FROM employees;
```

Result: see the table in section 8.

**7.**

```sql
SELECT name, join_date FROM employees WHERE join_date > '2021-12-31';
```

Result: Ravi (2022-07-01), Karthik (2023-02-20), Sneha (2022-09-30).

**8.**

```sql
SELECT AVG(salary) FROM employees WHERE department <> 'HR';
```

Result: 75000.

**9.**

```sql
SELECT name,
       CASE WHEN join_date < '2020-01-01' THEN 'Senior' ELSE 'Regular' END AS level
FROM employees;
```

Result: Priya (2019) and Arjun (2018) are Senior. Everyone else is Regular.

**10.**

```sql
SELECT department, COUNT(*) AS employee_count, MAX(salary) AS highest_salary
FROM employees
GROUP BY department
ORDER BY highest_salary DESC;
```

Result: Engineering 3 (120000), Sales 3 (60000), HR 2 (52000).

## 14. Interview questions with short answers

**1. What is the difference between WHERE and HAVING?**
WHERE filters rows before grouping and cannot use aggregates. HAVING filters groups after GROUP BY and can use aggregates.

**2. What is the difference between COUNT(\*) and COUNT(column)?**
COUNT(\*) counts all rows. COUNT(column) counts only rows where that column is not NULL.

**3. Why does WHERE column = NULL return nothing?**
NULL means unknown, and comparing with an unknown gives unknown, not true. Use IS NULL.

**4. What is the difference between DISTINCT and GROUP BY?**
Both can remove repeats. DISTINCT just removes duplicate rows from the result. GROUP BY creates groups so you can run aggregates on each one.

**5. In what order does SQL process a query?**
FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.

**6. What does COALESCE do?**
It returns the first non-NULL value in its list, often used to replace NULLs with a default.

**7. Does BETWEEN include the end values?**
Yes, both ends are included.

**8. What is the difference between UNION and a plain SELECT?** *(a preview of Stage 2)*
UNION combines the results of two queries into one list. You will learn it in the next stage.

## 15. A 10-day study plan

| Day | Topic | What to do |
|---|---|---|
| 1 | Tables, SELECT, FROM, aliases, DISTINCT | Create the table and run every query in sections 1 and 2 |
| 2 | WHERE with comparison operators, AND, OR | Write 5 of your own filters |
| 3 | IN, BETWEEN, LIKE | Solve exercises 1 and 7 |
| 4 | ORDER BY and LIMIT | Solve exercise 2, then try sorting by two columns |
| 5 | Aggregate functions | Solve exercise 8, and compare COUNT(*) with COUNT(bonus) |
| 6 | GROUP BY | Solve exercises 3 and 10 |
| 7 | HAVING and WHERE vs HAVING | Solve exercise 4 and explain the difference out loud |
| 8 | NULL and COALESCE | Solve exercises 5 and 6 |
| 9 | Text, date functions and CASE WHEN | Solve exercise 9 |
| 10 | Revision | Redo the 10 exercises without looking, then answer the interview questions aloud |

**Tips for learning well:**

1. Predict the output before you run a query. If your prediction is wrong, find out why.
2. Change one thing at a time and see what changes.
3. After each day, explain the day's topic in your own words, as if to a friend. This is exactly what an interview asks of you.
4. Once you finish this stage, build a second practice table of your own (for example, orders or students) and write 10 new questions on it.
