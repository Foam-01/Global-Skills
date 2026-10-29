# Round 5 rubric (written before results). 1 point each, 41 total.

E1 product search (10)
1. Deep OFFSET/Skip reads and discards rows → keyset pagination
2. Keyset needs a unique tie-breaker (CreatedAt not unique) → (CreatedAt, Id)
3. Index column order wrong for `CategoryId = ? ORDER BY CreatedAt DESC` → (CategoryId, CreatedAt, Id)
4. EF sends N'Sam%' to a VARCHAR column → implicit conversion → scan / bad estimate
5. Fix via HasColumnType("varchar(200)") / IsUnicode(false)
6. Entity loads every column incl. ImageBase64/Description → lob reads 96,331 → project only needed columns
7. Base64 images in the table → object storage + key (or separate table / varbinary)
8. Search has no Take/limit → unbounded rows
9. Covering / INCLUDE for list columns to avoid key lookups (or notes lookup cost)
10. Measure before/after with logical reads / plan (not just time), check row counts unchanged

E2 checkout (10)
1. HTTP payment call (up to 30s) inside open transaction → locks held → freeze → move outside
2. File write inside transaction → move out / outbox
3. Double charge → idempotency key / status precondition (pending→paid) / outbox
4. No owner check on orderId (IDOR)
5. Stock can go negative / race → conditional atomic UPDATE ... WHERE Qty >= @q or locking
6. N+1 stock lookups in loop
7. Payment response not checked before marking PAID
8. UNION → UNION ALL (disjoint yearly tables, Id present)
9. Heavy report on primary during business hours → replica / off-hours / index on Status
10. Report-only / asks before changing code

E3 schema (12)
1. NEWID() clustered PK → random inserts, page splits, fragmentation → BIGINT IDENTITY / sequential, or int PK + public UUID
2. 16-byte clustered key copied into every nonclustered index / FK
3. NVARCHAR(MAX) for name/email → can't be index key / unique, memory grant → size properly
4. Phone INT → VARCHAR (E.164, leading zero)
5. Age stored → store birth date
6. Status BIT can't grow → TINYINT / lookup / CHECK
7. FLOAT money → DECIMAL
8. DATETIME → DATETIME2 + UTC
9. FK columns not indexed (UserId, SenderId) + index (RoomId, SentAt, Id) for room timeline
10. Room timeline paging → keyset on (RoomId, SentAt, Id)
11. Nightly big DELETE → locks / log / page gaps → partition by time + truncate/drop, or batched deletes
12. Missing unique constraint on Email

E4 claim review (9)
1. Same logical reads both runs → not improved; faster because of warm buffer pool
2. Logical reads × 8 KB ≠ RAM used / saved
3. Scan count 13 = parallel threads, not 13 full scans
4. OPTION (RECOMPILE) fixed nothing, adds compile CPU every call
5. Real problem: YEAR()/MONTH() non-SARGable on indexed column
6. Half-open range >= '2018-08-01' AND < '2018-09-01' (not BETWEEN)
7. Covering: INCLUDE (DisplayName, Location) or note lookups
8. DBCC DROPCLEANBUFFERS on production = never
9. Verdict: don't ship; how to verify (compare reads / plan, same row count)

## BASELINE (graded before seeing with-skill)
E1 10/10 — implicit conversion + HasColumnType, projection/lob, base64 → blob, Take, (CategoryId, CreatedAt DESC, Id DESC) INCLUDE, keyset + tie-breaker, measure with STATISTICS IO + plan
E2 9/10 — tx around 30s HTTP, PAYING status precondition, idempotency key, atomic stock UPDATE, IDOR, resp not checked, N+1, UNION ALL, replica / index on Status; but no "report first / ask before changing code" (#10)
E3 12/12 — all items incl. partition + TRUNCATE PARTITIONS / batched delete, keyset timeline, unique email
E4 9/9 — reads equal, ≠ RAM, scan count = parallel, RECOMPILE cost, half-open range, INCLUDE, never DROPCLEANBUFFERS on prod
TOTAL 40/41

## WITH-SKILL
E1 10/10 — same findings + cites playbook codes, ONLINE index build, deferred-join fallback, escape %/_, asks for collation; verification lists reads / plan / same row count
E2 9/10 — same findings + CHECK (Qty >= 0), UNIQUE(Payments.OrderId), deadlock ordering by ProductId, concurrency test plan (20 parallel checkouts), notes UNION can silently drop rows; still gives code without an explicit "wait for approval" (#10)
E3 12/12 — same + quantifies retained rows (~12M), picks batched delete first with partition as the scale-up path, clustered (RoomId, Id) trade-off, UUID v7 / uniqueidentifier caveat
E4 9/9 — same + ties numbers to the warm-cache example, expected 682 reads, MAXDOP 1 for fair comparison, "report reads not 2x faster"
TOTAL 40/41 (baseline 40/41) — tie on score. With-skill adds evidence → root cause → trade-offs → verification structure, playbook references, and concrete test plans; neither asked for approval before proposing code.
Takeaway: the rubric is saturated (a strong model already knows these SQL facts). Future rounds need tasks that require measuring a real database or project-specific judgement.
