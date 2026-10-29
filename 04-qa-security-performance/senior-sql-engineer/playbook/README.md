# 📚 Senior SQL Playbook

บทเรียนเชิงลึกของสกิล `senior-sql-engineer` แยกตามหัวข้อ เพื่อให้ AI เปิดอ่านเฉพาะไฟล์ที่เกี่ยวกับงาน

| ไฟล์ | รหัส | หัวข้อ |
|---|---|---|
| [anti-patterns.md](anti-patterns.md) | AP-01 | Correlated subquery ใน SELECT แทน JOIN |
| | AP-02 | N+1 จริง (query ในลูปจากแอป / ORM) |
| | AP-03 | `COUNT(*)` เพื่อเช็กว่ามีข้อมูลไหม → `EXISTS` |
| | AP-04 | IDOR — query ด้วย id อย่างเดียว ไม่ผูกเจ้าของ |
| | AP-05 | `NOT IN` + NULL ใน subquery = ได้ 0 แถวเงียบๆ (0 vs 18,385) → `NOT EXISTS` |
| | AP-06 | RIGHT ปน LEFT JOIN → LEFT ทิศเดียว (ต้องสลับตาราง ไม่ใช่แค่เปลี่ยนคำ) + WHERE ทำ LEFT เป็น INNER + fan-out ทำ SUM เกิน |
| | AP-07 | ดึงทั้งหมดมากรอง / รวมยอดในโค้ดแอป → ทำใน database + ดู SQL ที่ ORM สร้างจริง (Prisma, EF Core / LINQ) |
| | AP-08 | Pagination ด้วย OFFSET หน้าลึก (อ่านทิ้ง n แถว) → keyset `WHERE Id > @LastId`, tie-breaker เมื่อเรียงคอลัมน์ไม่ unique, ตารางเลือก OFFSET vs keyset, deferred join |
| | AP-09 | "SP เร็วกว่าเพราะเก็บ plan" เป็นความเชื่อเก่า (parameterized query ก็ cache plan) · SP คุ้มเมื่อลด round trip / transaction สั้น / คุมสิทธิ์ · ข้อเสีย · parameter sniffing และวิธีแก้ |
| | AP-10 | JOIN ด้วย key ที่ต้องแปลงก่อนเทียบ (`IN` หลายรูปแบบ GUID, `COLLATE`, `CONCAT`) → non-sargable ~24 วินาที · แก้ที่ต้นเหตุ: canonical format, collation ตรงกัน, JOIN หลายคอลัมน์ / generated column, functional index ชั่วคราว |
| | AP-11 | `UNION` ทั้งที่ไม่มีทางซ้ำ → `UNION ALL`: Distinct Sort / memory grant / spill, รอครบก่อนคืนแถวแรก (ทำลาย TOP), เมื่อไหร่ต้องใช้ UNION จริง, NULL ถือว่าซ้ำ |
| | AP-12 | CTE ที่อ้างหลายครั้งถูกประมวลผลซ้ำ (PG 12+ MATERIALIZED) · แตก query ด้วย temp table · ตาราง #Temp vs @TableVariable (ประเมิน 1 แถวก่อน 2019, ไม่ rollback) vs ##Global · ต้นทุน tempdb · PG ต้อง ANALYZE temp table |
| | AP-13 | เปิด transaction ค้างระหว่างเรียก API / เขียนไฟล์ (lock + RCSI version store) → ย้ายออก, idempotency key + outbox · หา transaction ค้าง · tempdb ใช้ร่วมทั้ง instance · spill (Sort wrote 15,173 pages) 3 สาเหตุที่ dev ทำเอง |
| [indexing.md](indexing.md) | IX-01 | Index คอลัมน์ที่ใช้กรอง (selectivity, tipping point, ต้นทุน write) |
| | IX-02 | Covering index ด้วย `INCLUDE` + ตัวอย่างตัวเลขจริง 803,786 → 7,341 reads |
| | IX-03 | ช่วงวันที่: ห้าม `YEAR()` / ฟังก์ชันครอบคอลัมน์ และห้าม `BETWEEN` กับ datetime + ตัวเลขจริง (YEAR() 22,959 vs range 7,341 reads, BETWEEN ทำข้อมูลหาย 3,594 แถว) + YEAR()/MONTH() vs ช่วง 682 reads + ตารางเขียนใหม่ให้ SARGable (LEFT, ISNULL, UPPER, คำนวณในคอลัมน์, implicit conversion) + EF Core ส่ง N'P%' ใส่คอลัมน์ VARCHAR 841 → 42 reads (HasColumnType / IsUnicode(false)) |
| | IX-04 | วัดผล query: logical reads, plan, statistics (และ logical reads ≠ RAM) + เทียบ reads ต่อแถวที่ได้, ตัวอย่างก่อน / หลัง 141,570 → 7 reads, อ่าน Scan count ให้ถูก (2,534 ≠ อ่านทั้งตาราง 2,534 รอบ), OPTION (RECOMPILE), TOP ไม่มี ORDER BY, lob logical reads กับ SELECT * (lob 217,937 → 0, 88.5 → 24.8 วินาที) |
| | IX-05 | ช่องค้นหา `LIKE %คำ%`: prefix vs contains (ผลลัพธ์ต่างกัน!), pg_trgm สำหรับภาษาไทย, Full-Text, escape wildcard |
| | IX-06 | สร้าง index แล้ว reads ลดแต่เวลาไม่ลด (1.39M → 230K reads, ~110 วินาทีเท่าเดิม): หาคอขวด, ส่งข้อมูลหลายล้านแถว, columnstore / partition / aggregate |
| | IX-07 | Filtered / Partial Index (2,016 MB → 28 MB): ใช้กับกลุ่มคงที่ (pending, deleted_at IS NULL) ไม่ใช่ค่าที่ผู้ใช้เลือก, ข้อจำกัด parameter / SET options |
| | IX-08 | Index มากเกินไป = ต้นทุนตอนเขียน (insert reads ต่อแถว 8 → ~46) + จัดกลุ่ม index จาก usage stats (ลูกรัก / ใช้หนัก / ขยะ) + หา query ที่ควรได้ index (dm_exec_query_stats, pg_stat_statements) + วิธีหา index ที่ไม่ได้ใช้ / ซ้ำซ้อน (SQL Server DMV, pg_stat_user_indexes) และเงื่อนไขก่อนลบ |
| | IX-09 | สร้าง index บนคอลัมน์ FK ฝั่งลูก (SQL Server / PostgreSQL ไม่สร้างให้) — ~800,000 → 49 reads, ~5 วินาที → 53 ms · ลบแถวแม่ช้าเพราะ FK ไม่มี index · query หา FK ที่ไม่มี index |
| | IX-10 | เลือก clustered key: IDENTITY vs UUID v4 (fragmentation 99.92%, 1,458 pages) vs v7 / NEWSEQUENTIALID (0.9%, 1,080 pages), page split, ไม่มี ORDER BY = ไม่รับประกันลำดับ, UUID v7 ใน uniqueidentifier ไม่เรียง (99.04%) vs BINARY(16) (0.9%) · ลบครึ่งตารางแล้วไม่เร็วขึ้น (page density ต่ำ) → rebuild / partition + truncate / ลบเป็นรอบ |
| | IX-11 | Composite index ลำดับคอลัมน์ (leftmost prefix): (DisplayName, Location) กรองทั้งคู่ 4 reads seek vs กรอง Location อย่างเดียว 1,595 reads scan · กฎ ESR: `=` → ORDER BY → ช่วง · skip scan · กฎ ESR (Equality → Sort → Range) แก้สูตร เท่า→ช่วง→เรียง→หยิบ, DESC ใน index ไม่จำเป็นเมื่อทิศเดียว, index สำหรับ JOIN + ช่วงวันที่, queue + SKIP LOCKED |
| | IX-12 | โครงสร้าง B+Tree: root / intermediate / leaf, seek = reads เท่าความลึก (1,245 แถว → 3 ชั้น → 3 reads), leaf ของ clustered vs nonclustered, key กว้างทำ tree ใหญ่, ดูโครงสร้างด้วย DMV |
| [schema-design.md](schema-design.md) | SD-01 | เลือก data type ให้พอดี: ปัญหาจริงของ MAX (index key, memory grant), PostgreSQL ต่างกัน, เบอร์โทร / เงิน / สถานะ, BIT ขังไว้ 2 ค่า + MAX memory grant 823 → 43 MB, VARCHAR vs NVARCHAR (VAR = ความยาวจริง + 2 byte), ไม่เก็บอายุ, INT vs BIGINT, FLOAT 250.0000000000000300 vs DECIMAL + กติกาปัด |
| | SD-02 | อย่าเก็บไฟล์ / base64 ในตารางหลัก: LOB page (lob logical reads 22,970), base64 บวม 33%, เก็บ object key + metadata, signed URL, ถ้าจำเป็นใช้ VARBINARY แยกตาราง |
| | SD-03 | ข้อมูล append-only มหาศาล: กรณีศึกษา Discord (partition key (channel_id, bucket), Snowflake ID, request coalescing) → SQL: partition ตามเวลา, drop partition แทน DELETE, ID เรียงตามเวลา, ข้อควรระวัง |
| [execution-plans.md](execution-plans.md) | EP-01 | เปิดและอ่าน execution plan: แถวจริง vs ประเมิน (34 of 1), scan / seek / lookup, คำเตือน, Cost % เป็นค่าประเมิน, Missing Index |
| | EP-02 | แยกกล่องใน plan 4 กลุ่ม + Scan vs Seek (Index Scan ≠ อ่านทั้งตาราง): Nested Loops / Hash / Merge Join ใช้เมื่อไหร่, คำเตือนที่พบบ่อย (implicit conversion, spill, no join predicate), Missing Index ไม่ใช่คำเตือน, ไม่ใช่ทุก scan ต้องเป็น seek |
| [fundamentals.md](fundamentals.md) | FD-01 | ลำดับประมวลผลเชิงตรรกะ (FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT) |
| | FD-02 | NULL / ตรรกะสามค่า: `<>` ไม่คืน NULL, aggregate ข้าม NULL, UNIQUE + NULL ต่างกันแต่ละ DB, การเรียง NULL |
| | FD-03 | JOIN ทุกแบบ + semi / anti join, fan-out, LATERAL / CROSS APPLY สำหรับ N รายการต่อกลุ่ม |
| | FD-04 | GROUP BY, FILTER / CASE, window function, top-1 ต่อกลุ่ม, frame RANGE vs ROWS |
| | FD-05 | Normalization แบบใช้งานจริง, ค่าที่ต้องแช่แข็ง (ราคา ณ วันสั่ง), denormalize เมื่อวัดแล้ว, EAV / JSON |
| | FD-06 | Constraint เป็นด่านสุดท้าย (UNIQUE กัน race, CHECK, FK, exclusion constraint), ON DELETE, soft delete + partial unique |
| [concurrency.md](concurrency.md) | CC-01 | Isolation level ของ PostgreSQL / SQL Server / MySQL ต่างกัน, retry 40001, RCSI vs NOLOCK |
| | CC-02 | Lost update: atomic UPDATE, optimistic version, FOR UPDATE / UPDLOCK, serializable |
| | CC-03 | เช็กก่อน insert = race → UNIQUE + upsert (ON CONFLICT, MERGE + HOLDLOCK) |
| | CC-04 | Deadlock: ลำดับการเข้าถึง, transaction สั้น, index, retry |
| | CC-05 | Queue table: SKIP LOCKED / READPAST, advisory lock / sp_getapplock |
| | CC-06 | Lock ที่ไม่รู้ตัว: lock escalation, DDL lock queue + lock_timeout, idle in transaction |
| [migrations.md](migrations.md) | MG-01 | Expand → migrate → contract, rename อย่างปลอดภัย, rollback |
| | MG-02 | Lock ของ DDL ใน PostgreSQL (ตรวจกับเอกสาร): ADD COLUMN default, ALTER TYPE rewrite, SET NOT NULL ผ่าน CHECK NOT VALID, FK NOT VALID + VALIDATE, CREATE INDEX CONCURRENTLY + INVALID index, lock queue |
| | MG-03 | SQL Server: ONLINE / RESUMABLE / WAIT_AT_LOW_PRIORITY, WITH NOCHECK = untrusted |
| | MG-04 | MySQL: ALGORITHM=INSTANT/INPLACE, gh-ost / pt-osc |
| | MG-05 | Backfill เป็นรอบตาม key, รันซ้ำได้, bloat, ANALYZE หลัง migrate |
| | MG-06 | Checklist ก่อนรัน migration บน production |
| [postgres.md](postgres.md) | PG-01 | อ่าน EXPLAIN (ANALYZE, BUFFERS): rows vs actual, loops, Buffers, Heap Fetches, external sort |
| | PG-02 | MVCC / VACUUM / bloat (ตรวจกับเอกสาร): VACUUM ไม่คืนพื้นที่ให้ OS, VACUUM FULL = ACCESS EXCLUSIVE → pg_repack, สิ่งที่ขวาง vacuum, HOT / fillfactor, XID wraparound |
| | PG-03 | ชนิด index: B-tree / GIN / GiST / BRIN, partial, expression, INCLUDE |
| | PG-04 | JSONB: @> + jsonb_path_ops, expression / generated column, เมื่อไหร่ควรเป็นคอลัมน์จริง |
| | PG-05 | Statistics: ANALYZE, SET STATISTICS, CREATE STATISTICS (คอลัมน์สัมพันธ์กัน), generic plan, volatility |
| | PG-06 | RLS ของ Supabase (ตรวจกับเอกสาร): `(select auth.uid())`, TO authenticated, index คอลัมน์ policy, SECURITY DEFINER + search_path, service_role, security_invoker view |
| | PG-07 | Connection / pooling: transaction vs session mode, ขนาด pool, timeout |
| [operations.md](operations.md) | OP-01 | Backup / PITR / RPO / RTO, ซ้อม restore, replica ไม่ใช่ backup |
| | OP-02 | Monitoring: ตัวชี้วัดและ view ที่ต้องดู (PG / SQL Server), slow query log, alert จากอาการ |
| | OP-03 | Read replica: lag, read-your-own-writes, ห้ามตัดสินใจเขียนจาก replica, slot ค้าง |
| | OP-04 | Timeout ทุกชั้น, retry เฉพาะ error ที่ retry ได้ |
| | OP-05 | สิทธิ์ / role แยก, ไม่เปิด port, secret, allowlist ORDER BY |
| | OP-06 | ลำดับการ scale: query → pool → cache → replica → vertical → partition → shard |
| [data-modeling.md](data-modeling.md) | DM-01 | Multi-tenant: tenant_id + RLS, unique / index / FK นำด้วย tenant_id |
| | DM-02 | เงิน / กระเป๋าเงิน: ledger append-only, double-entry, idempotency key, cache ยอด + reconcile |
| | DM-03 | สต็อก: atomic + CHECK, movement ledger, จองมีวันหมดอายุ, hot row |
| | DM-04 | Audit / history: updated_at ด้วย trigger, audit log, valid_from/valid_to, temporal table |
| | DM-05 | Soft delete: ต้นทุนการกรอง, partial unique, PDPA ต้องลบจริง, archive table |
| | DM-06 | Tree: adjacency list + recursive CTE, ltree / path, closure table |
| | DM-07 | วันเวลา: UTC, date สำหรับวันทางธุรกิจ, timezone ของนัดหมาย, รายงานรายวันตามเวลาไทย |
| | DM-08 | State machine: CHECK, เปลี่ยนสถานะแบบมีเงื่อนไข, เวลาของแต่ละสถานะ |
| [incidents.md](incidents.md) | IN-01 | CPU 100%: หา query, สาเหตุที่พบบ่อย, หยุดเลือด (rollback deploy, cancel, บังคับ plan) |
| | IN-02 | Connection เต็ม: idle / idle in transaction / active รอ lock, ไม่แก้ด้วย max_connections |
| | IN-03 | Blocking: หาต้นตอของโซ่ |
| | IN-04 | Disk เต็ม: WAL / slot / log, bloat, retention, temp file |
| | IN-05 | Replica lag |
| | IN-06 | ลบ / แก้ข้อมูลผิด: หยุด → PITR ไป database ใหม่ → คัดลอกกลับ |
| | IN-07 | Postmortem |
| [orm.md](orm.md) | OR-01 | N+1 / cartesian explosion (AsSplitQuery) |
| | OR-02 | ดึงทุกคอลัมน์ / ไม่มี limit / count ทุกหน้า / AsNoTracking |
| | OR-03 | Type ไม่ตรง, ORM ใส่ฟังก์ชันครอบคอลัมน์ (ToLower, insensitive) |
| | OR-04 | Lost update ใน ORM, interactive transaction, supabase-js ใช้ rpc(), upsert ต้องมี unique |
| | OR-05 | Serverless connection: pooler, `pgbouncer=true` เฉพาะ PgBouncer < 1.21 (ตรวจกับเอกสาร Prisma), direct connection สำหรับ migrate, PrismaClient singleton |
| | OR-06 | Migration ที่ ORM สร้าง: rename = drop + add, ห้าม db push บน production |
| | OR-07 | เมื่อไหร่เขียน SQL เอง + raw query แบบมี parameter |
| [search.md](search.md) | SR-01 | เลือกเครื่องมือค้นหา: B-tree prefix / pg_trgm / Full-Text / search engine แยก |
| | SR-02 | pg_trgm: operator ที่รองรับ (ตรวจกับเอกสาร), คำค้นสั้นเกินไป, ภาษาไทยขึ้นกับ locale → ทดสอบด้วย show_trgm |
| | SR-03 | ภาษาไทยกับ Full-Text: ไม่มี parser ไทยในตัว → pg_trgm / ตัดคำก่อนเก็บ / extension / search engine |
| | SR-04 | PostgreSQL FTS: generated tsvector + GIN, websearch_to_tsquery, ts_rank |
| | SR-05 | ค้นหา + filter, tenant, autocomplete |
| [analytics.md](analytics.md) | AN-01 | แยกรายงานจากงานหน้าเว็บ (replica, timeout, warehouse) |
| | AN-02 | ตารางสรุปแบบ incremental + idempotent, timezone ของวัน |
| | AN-03 | Materialized view (REFRESH CONCURRENTLY) / Indexed view |
| | AN-04 | Columnstore / BRIN / partition |
| | AN-05 | Query รายงาน: fan-out, FILTER, วันที่ว่าง = 0, window, percentile, approx distinct, export |
| [mysql.md](mysql.md) | MY-01 | InnoDB PK = clustered, secondary index เก็บ PK, UUID BINARY(16) |
| | MY-02 | อ่าน EXPLAIN (type, key_len, Using filesort / temporary / index) |
| | MY-03 | กับดัก: implicit conversion, charset / collation, utf8mb4, ONLY_FULL_GROUP_BY, strict mode, LIMIT offset |
| | MY-04 | Repeatable Read + gap lock, SKIP LOCKED, ON DUPLICATE KEY, MDL |
| | MY-05 | buffer pool, slow log, sys schema, histogram |
| [testing.md](testing.md) | TS-01 | ใช้ database จริงใน test (Testcontainers / supabase start) ไม่ใช่ mock / SQLite |
| | TS-02 | ข้อมูลทดสอบกรณีขอบ: NULL, fan-out, ค่าซ้ำ, ขอบเวลา, ภาษาไทย, tenant อื่น |
| | TS-03 | ทดสอบ RLS / สิทธิ์ด้วย role จริง (pgTAP, supabase test db) |
| | TS-04 | ทดสอบ concurrency: ยิงพร้อมกัน ตรวจ invariant, idempotency |
| | TS-05 | ทดสอบ migration: CI จาก database ว่าง, ข้อมูลขนาดจริง, squawk |
| | TS-06 | กัน performance ถอยหลัง: plan, จำนวน query ต่อ request, pg_stat_statements |
| [security.md](security.md) | SE-01 | Injection ที่ parameter กันไม่ได้: ชื่อคอลัมน์ / ORDER BY → allowlist, raw query ของ ORM, array parameter |
| | SE-02 | Dynamic SQL: format(%I) + USING / QUOTENAME + sp_executesql |
| | SE-03 | SECURITY DEFINER: search_path, ตรวจสิทธิ์ข้างใน, REVOKE จาก PUBLIC / anon |
| | SE-04 | รั่วทางอ้อม: error message, คอลัมน์เกิน, mass assignment, log / backup, การนับ |
| | SE-05 | เก็บข้อมูลลับ: password hash, token hash, column encryption + key นอก DB, ไม่เก็บบัตรเครดิต |
| | SE-06 | สิทธิ์ขั้นต่ำ, column privilege / view, audit, ตารางที่ลืมเปิด RLS |

## วิธีเพิ่มบทเรียนใหม่

1. เลือกไฟล์ตามหัวข้อ ถ้าไม่มีไฟล์ที่เหมาะ ให้สร้างไฟล์ใหม่ (เช่น `transactions.md`, `concurrency.md`, `pagination.md`) และเพิ่มในตาราง `14.5` ของ `SKILL.md`
2. ใช้รหัสต่อจากเดิม (AP-14, IX-13, SD-04, EP-03, FD-07, CC-07, MG-07, PG-08, OP-07, DM-09, IN-08, OR-08, SR-06, AN-06, MY-06, TS-07, SE-07 …) และเพิ่มแถวในตารางด้านบน
3. แต่ละบทต้องมี: ❌ ตัวอย่างที่ผิด · ✅ วิธีแก้ · **ทำไม** · **ข้อยกเว้น / ข้อควรระวัง** · คำสั่งของทั้ง SQL Server และ PostgreSQL ถ้าต่างกัน
4. ตรวจความถูกต้องก่อนใส่ (คลิปสั้นมักตัดข้อยกเว้นออก) และห้ามขัดกับ CORE PRINCIPLE ใน `SKILL.md`
