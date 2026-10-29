# Round 8 rubric — search (Thai) + analytics (written before results). 1 point each, 11 total.

H1 fixtures/h1-thai-search-report.md
1. Built-in FTS 'simple' splits on spaces → a Thai phrase is one token → partial Thai words not found
2. Use pg_trgm GIN (ILIKE '%…%') or tokenize Thai before storing / Thai-capable search engine; test with real data (show_trgm / locale)
3. No index on the search → to_tsvector computed per row (seq scan); at least expression / generated column + GIN
4. Search on every keystroke from 1st char → min length + debounce + LIMIT; SELECT * → needed columns
5. Revenue too high: JOIN order_items fans out → SUM(o.total) multiplied by item count; COUNT(*) counts items
6. DATE(created_at) groups by UTC day (session timezone), not Thai day → AT TIME ZONE 'Asia/Bangkok' / half-open Thai-day boundaries
7. double precision money → numeric / integer satang (rounding vs accounting)
8. Index (shop_id, created_at) (+ INCLUDE total) for the dashboard filter
9. Dashboard opened often → daily summary table (incremental, idempotent) / materialized view, instead of aggregating 5M rows each time
10. Days without sales should show 0 (generate_series) / status filter (paid only, exclude cancelled)
11. Report-first / asks approval / verify (compare totals with accounting, EXPLAIN before/after)

## BASELINE (graded before seeing with-skill)
H1 10/11 — 'simple' parser = one Thai token, pg_trgm GIN + show_trgm locale check, no index / SELECT * / no LIMIT, debounce + min length, fan-out from JOIN order_items, UTC vs Thai day (+ partial first day), double → numeric via expand/contract, (shop_id, created_at) INCLUDE, summary table, status filter, EXPLAIN + compare with accounting, shop_id from session. Missed: report-first / approval (#11). Also asserts PGroonga "รองรับภาษาไทยได้ดี" without evidence.

## WITH-SKILL
H1 11/11 — same findings + generate_series zero-fill, full Thai-day boundaries, separates confirmed vs hypothesis, does not overclaim PGroonga (test show_trgm first, escalate only if needed), Thai search test set of 20–30 real queries, pg_stat_statements after deploy, summary table only if index + fix are not enough, ends waiting for approval.
TOTAL 11/11 (baseline 10/11)
