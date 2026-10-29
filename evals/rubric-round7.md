# Round 7 rubric — data modeling + ORM + incident (written before results). 1 point each, 12 total.

G1 fixtures/g1-saas-wallet.md
1. too many connections: serverless (Vercel) + direct connection → each instance opens its own pool → use Supabase transaction pooler (6543) + pgbouncer=true + low connection_limit; directUrl for migrations
2. PrismaClient singleton (globalThis) in dev / hot reload
3. Long interactive transaction (60s, external fetch inside) holds connection + row lock → move fetch out (contributes to connection exhaustion)
4. Tenant leak: shopId taken from query string (client-controlled) → derive from session / auth, not request
5. Enforce isolation in DB: RLS on shop_id (or at least mandatory server-side filter) — defense in depth
6. email @unique global → should be unique per shop (shopId, email)
7. Index on shopId (leading) for the list query
8. Negative balance: lost update (read → compute → write) → atomic decrement with WHERE balance >= amount / CHECK (balance >= 0) / FOR UPDATE
9. Float balance → integer minor units / Decimal
10. Ledger / wallet transactions table + idempotency key (double submit) instead of only mutating balance
11. Incident order: stop the bleeding first (pooler / limit), then fix data (find negative wallets, reconcile), notify about the data exposure (PDPA breach assessment)
12. Report first / asks approval; no limit / select on findMany (unbounded list) noted

## BASELINE (graded before seeing with-skill)
G1 12/12 — IDOR via shopId + no auth, @@unique([shopId,email]) + index, lost update → updateMany decrement with balance gte + CHECK, amount > 0 and owner check, Decimal, WalletTx + idempotencyKey (P2002), fetch moved after commit / outbox, pooler 6543 + pgbouncer=true + connection_limit=1 + directUrl, singleton, PDPA 72h + keep logs, read-only damage query, waits for confirmation before prod data fixes.
Notable insight to add to playbook: Prisma connects as role `postgres`, which bypasses RLS → RLS only protects if the app uses a non-BYPASSRLS role and sets the tenant per transaction.

## WITH-SKILL
G1 12/12 — same findings in the 9-part format, labels each item [ยืนยันจากโค้ด] vs [สมมติฐาน ต้องวัด], cites DM/OR/CC/IN codes, adds amount validation + Number.isFinite, CHECK via NOT VALID → VALIDATE, notes ALTER TYPE to Decimal rewrites the table (migration window), concurrency test (50 parallel pays), asks for metrics from last night, ends waiting for approval with a no-migration-first plan.
(Caveat: the RLS/postgres-role note was added to DM-01 while this agent was running, so its RLS point may have come from the updated playbook.)
TOTAL 12/12 (baseline 12/12) — tie on score; with-skill clearer on evidence vs hypothesis, migration safety and verification.
Playbook gain from this round: DM-01 / OR-04 now state that server ORMs connecting as `postgres` bypass RLS, and never take tenant_id from the request.
