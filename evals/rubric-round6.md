# Round 6 rubric — production-level theory (written before results). 1 point each, 22 total.

Tasks: F1 fixtures/f1-migration.sql ("จะรันอันนี้บน production คืนนี้ โอเคไหม"), F2 fixtures/f2-booking.md.

F1 migration (12)
1. Verdict: do not run as-is (one big transaction holding ACCESS EXCLUSIVE for the whole run)
2. ADD COLUMN ... DEFAULT 'web' (constant) is metadata-only in PG 11+ → fine
3. DEFAULT now(): (CORRECTED after baseline — now() is STABLE, no rewrite) flags that every existing row gets the migration timestamp → wrong semantics; decide backfill source. Credit also if it notes volatile defaults (clock_timestamp/random) would rewrite.
4. ALTER TYPE double → numeric rewrites table + indexes → expand/contract new column + backfill
5. RENAME COLUMN breaks old app instances during rolling deploy → expand/contract (or view / both columns)
6. ADD FOREIGN KEY scans 180M rows → NOT VALID then VALIDATE CONSTRAINT separately
7. SET NOT NULL scans → CHECK (coupon_code IS NOT NULL) NOT VALID → VALIDATE → SET NOT NULL (and existing NULLs must be fixed first)
8. CREATE INDEX blocks writes → CREATE INDEX CONCURRENTLY, outside the transaction; INVALID index on failure
9. 70M-row UPDATE in one statement → batches by key, idempotent, bloat / WAL / replica lag, vacuum/analyze after
10. lock_timeout (and DDL lock queue blocking all queries) / statement_timeout
11. Supabase specifics: run via direct / session connection not transaction pooler; or test on a branch / copy with prod size
12. Rollback plan / backup-PITR before; report-first ends asking approval

F2 booking (10)
1. Check-then-insert race → DB-enforced: exclusion constraint (btree_gist, tstzrange &&) WHERE status <> 'cancelled' (or locking / serializable + retry)
2. Exclusion constraint needs btree_gist for doctor_id WITH =
3. last_seen updated every 5s → huge dead tuples, and index on last_seen prevents HOT updates → move heartbeat elsewhere / drop index / fillfactor
4. idle in transaction for days holds back the xmin horizon → vacuum cannot remove dead tuples → bloat (31M dead)
5. Fix: idle_in_transaction_session_timeout / statement_timeout, kill session, report on replica or without long tx
6. Reclaim space: VACUUM doesn't return space to OS; VACUUM FULL takes ACCESS EXCLUSIVE → pg_repack
7. Tune autovacuum per table (scale_factor) for hot table
8. RLS: (select auth.uid()) + TO authenticated + index on patient_id
9. Index for the clash query: (doctor_id, starts_at) or the GiST index from the constraint; status-only index low value
10. Report-first / asks approval; measures (pg_stat_user_tables, pg_stat_activity) to confirm

## BASELINE (graded before seeing with-skill)
F1 12/12 — caught that now() is STABLE (no rewrite, wrong semantics) which the rubric/playbook had wrong → playbook MG-02 fixed; also flagged coupon_code NOT NULL will likely fail on existing NULLs, lock-queue pile-up, Supabase branch for testing
F2 9/10 — exclusion constraint + btree_gist + 23P01, HOT blocked by last_seen index, idle-in-transaction xmin horizon, timeouts, pg_repack vs VACUUM FULL, per-table autovacuum, drop status index; noticed RLS hides other patients' bookings from the clash check; missed (select auth.uid()) / TO authenticated / index on patient_id (#8)
TOTAL 21/22

## WITH-SKILL
F1 12/12 — same findings in the 9-part format; independently flagged that playbook MG-02 wrongly listed now() as volatile (already fixed); pre-checks for NULL coupon_code and orphans; ends "ยังไม่ได้แก้ไฟล์ใด ๆ … ต้องการให้แตกเป็น migration ข้อ 1–3 ไหม"
F2 10/10 — explains the two layers (RLS hides other patients' bookings + race), exclusion constraint + 23P01, SECURITY DEFINER RPC for free slots, xmin horizon, HOT, pg_repack, per-table autovacuum + fillfactor, (select auth.uid()) + TO authenticated + index patient_id, concurrency test, ends waiting for approval
TOTAL 22/22 (baseline 21/22)
Fixes from this round: MG-02 now() is STABLE (no rewrite, wrong semantics for old rows); PG-06 RLS hides rows from app-side checks.
