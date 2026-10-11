# Round 2 rubric (written before results)

Score each check 1/0. Same rubric for with-skill and baseline.

## T1 code-reviewer — orderService diff (same fixture as round 1)
1. Missing await on update in cancelOrder
2. findById null → TypeError
3. No ownership check (IDOR) — rated Critical
4. Client-supplied price used for total — rated Critical
5. Status check is blocklist: shipped / already-cancelled can be cancelled → reported as a finding (not a side note)
6. notifyUser failure after successful cancel → caller gets error although order cancelled
7. Non-atomic insert + update / returned object lacks total
8. Does NOT list `tmp` naming as a finding
9. Every finding has location + failure scenario
10. Does not edit code; asks approval

## T4 code-reviewer — users route diff (unseen fixture)
1. Mass assignment: `data: req.body` lets user set role/isAdmin/email etc. → Critical
2. /admin/users only checks requireAuth, not admin role → Critical (any user lists all users)
3. Off-by-one: skip page*20 skips first page (page=1 → skip 20)
4. catch swallows error, returns 200 with {ok:false} (wrong status, no log)
5. Returns full user object (password hash etc.) in PATCH response / admin list → data exposure
6. No validation of body / page (NaN, negative, huge)
7. Every finding has location + failure scenario
8. Does not edit code

## T5 backend-api-engineer — "add POST /orders" design
Prompt: Express + Prisma, cart sent from web & Flutter app
1. Price computed server-side from DB, not from client
2. Auth + order owned by current user
3. Validate body (schema), qty positive int, limit items
4. Idempotency key / duplicate submit protection
5. Transaction for order + items (+ stock if any)
6. Consistent error format with codes + correct statuses (400/401/409/422)
7. Money as integer minor units / decimal, not float
8. Mentions backward compatibility / mobile client versions OR API docs

## T6 flutter-engineer — login_page.dart, "add remember-me + make login robust"
1. Tokens → flutter_secure_storage (not SharedPreferences)
2. context used after await without mounted check → fix with context.mounted
3. Keeps Provider (does not switch to Riverpod/Bloc)
4. Error handling: try/catch, show error, no crash on failure
5. Loading state / prevent double tap
6. Dispose TextEditingControllers
7. Validation of empty fields / keyboard types
8. Does not change API contract

## T7 senior-sql-engineer — slow product search query
1. Asks for / uses EXPLAIN (ANALYZE) before/after
2. Composite btree index on (shop_id, status, created_at DESC) or partial index WHERE status='active'
3. Recognises ILIKE '%x%' cannot use btree → pg_trgm GIN index (or full-text search)
4. Explains index trade-offs (write cost, size) / CREATE INDEX CONCURRENTLY on 3M-row table
5. Does not claim specific speedup numbers without measuring
6. Notes planner choice between trigram vs order-by index / measure both

## T8 documentation-engineer — write README for project dir
1. Uses only scripts that exist (no `npm test`, no invented commands)
2. Does NOT copy any value from .env (prod host, passwords, tokens)
3. Env var table from .env.example (4 vars) with purpose
4. Node >= 20 from engines
5. Setup steps: install, copy .env.example, migrate, seed, dev
6. Flags unknowns instead of inventing (e.g. what LINE_NOTIFY_TOKEN does, deploy method)
7. Mentions .env must not be committed / notices .env present

## BASELINE scores (graded before seeing with-skill results)
T1 7/10 — miss: IDOR only High (#3), `tmp` mentioned inside a finding (#8), gave fix code without asking approval (#10)
T4 8/8
T5 8/8
T6 8/8
T7 6/6
T8 6/7 — miss: invented a generic deploy section instead of flagging deploy method unknown (#6)
TOTAL 43/47
