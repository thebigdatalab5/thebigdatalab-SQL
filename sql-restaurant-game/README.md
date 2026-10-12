SQL Restaurant — Interactive SQL Playground

Open `sql-restaurant-game/index.html` in a browser to run a small single-page interactive playground that teaches concepts from `stage1.md`.

What it does:
- Lets learners pick columns (SELECT), add a simple WHERE filter, ORDER BY, DISTINCT and LIMIT.
- Shows a live SQL preview and results using the `employees` sample dataset from `stage1.md`.
- Includes quick challenges copied from `stage1.md` that reveal suggested SQL and let you apply them to the builder.

How to run:
1. In your file explorer, open `sql-restaurant-game/index.html` in a browser (Chrome/Edge/Firefox).
2. Use the checkboxes and controls to build queries and press "Run Query".

Notes & limitations:
- This is a lightweight educational toy, not a full SQL engine: the WHERE parser supports simple numeric/text comparisons and basic LIKE/NULL checks.
- GROUP BY, HAVING and complex SQL constructs are shown as challenge SQL but not fully executed by the naive parser.

Want enhancements?
- Add visual grouping / aggregate support.
- Turn challenges into a scored quiz with timers and hints.
- Bundle as a small Electron app for offline workshops.
If you want, I can implement grouped aggregates, scoring, or export a zipped package for sharing.

Quiz: This app now includes a small multiple-choice quiz you can take inside the page. Use the "Quick Quiz" card to test knowledge and get instant feedback.