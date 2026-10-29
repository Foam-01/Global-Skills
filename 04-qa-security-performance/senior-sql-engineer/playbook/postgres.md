# PostgreSQL / Supabase (PG): พฤติกรรมเฉพาะที่ต้องรู้

ข้อเท็จจริงตรวจกับเอกสาร PostgreSQL (Routine Vacuuming, Index Types, EXPLAIN) และ Supabase docs (Row Level Security)

---

## PG-01 — อ่าน `EXPLAIN (ANALYZE, BUFFERS)` ให้เป็น

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;   -- runs the query for real: wrap writes in BEGIN; ... ROLLBACK;
```

| สิ่งที่เห็น | ความหมาย |
|---|---|
| `rows=10` (ประเมิน) vs `actual … rows=48000` | statistics ผิดมาก → plan ผิด ดู PG-05 |
| `loops=5000` | node นี้ถูกรัน 5,000 รอบ (ต้องคูณเวลา / แถวด้วย loops) มักเป็นฝั่งในของ Nested Loop |
| `Buffers: shared hit=… read=…` | hit = อ่านจาก cache, read = จาก disk / OS cache (เทียบเท่า logical / physical reads ของ SQL Server, IX-04) |
| `Seq Scan` + `Rows Removed by Filter: 2999980` | อ่านทั้งตารางเพื่อได้ไม่กี่แถว → ขาด index / เงื่อนไข non-sargable |
| `Index Only Scan` + `Heap Fetches` สูง | covering index มีแล้ว แต่ visibility map ไม่อัปเดต → ต้อง VACUUM |
| `Bitmap Heap Scan` + `Recheck Cond` | อ่านหลายแถวกระจายหลาย page แบบรวมกลุ่ม (ระหว่าง index scan กับ seq scan) |
| `Sort Method: external merge Disk: 120MB` | sort ไม่พอใน `work_mem` → spill ลง disk (เหมือน AP-13) |
| `Hash … Batches: 8` | hash join ไม่พอใน memory |

- เวลาใน EXPLAIN ANALYZE รวม overhead ของการวัด ใช้เทียบก่อน / หลัง ไม่ใช่ตัวเลขสัมบูรณ์
- เครื่องมือ visualize เช่น explain.dalibo.com ช่วยอ่าน plan ยาว (อย่าวาง query ที่มีข้อมูลลับลงเว็บสาธารณะ)

---

## PG-02 — MVCC, VACUUM และ bloat

- `UPDATE` ใน PostgreSQL = **เขียนแถวใหม่ + ทำเครื่องหมายแถวเก่าว่าตาย** และ `DELETE` = ทำเครื่องหมายตาย แถวตาย (dead tuple) ยังกินพื้นที่จนกว่า VACUUM จะเก็บ
- VACUUM ปกติ (และ autovacuum) **คืนพื้นที่ให้ตารางใช้ซ้ำ แต่ไม่คืนให้ OS** (ยกเว้น page ท้ายตารางที่ว่างทั้งหมด) และรันพร้อมงานปกติได้
- `VACUUM FULL` เขียนตารางใหม่ทั้งหมด คืนพื้นที่จริง แต่ถือ **`ACCESS EXCLUSIVE`** (ทั้งตารางใช้งานไม่ได้) → บน production ใช้ `pg_repack` แทน
- **สิ่งที่ทำให้ VACUUM เก็บแถวตายไม่ได้:** transaction ที่เปิดค้างนาน (รวม `idle in transaction`), prepared transaction ค้าง, replication slot ที่ไม่มีใครอ่าน → ตาราง bloat เรื่อยๆ
  ```sql
  SELECT pid, state, age(backend_xmin) AS xmin_age, now() - xact_start AS open_for, query
  FROM pg_stat_activity WHERE backend_xmin IS NOT NULL ORDER BY xmin_age DESC;
  ```
- ตารางที่ UPDATE / DELETE หนัก (queue, session, counter): ปรับ autovacuum ต่อตาราง เช่น `ALTER TABLE jobs SET (autovacuum_vacuum_scale_factor = 0.01);` (default 0.2 = รอให้แถวตายถึง 20% ของตาราง)
- **HOT update:** ถ้า UPDATE ไม่แตะคอลัมน์ที่อยู่ใน index และ page มีที่ว่าง → ไม่ต้องอัปเดต index เลย (เร็ว ไม่ bloat index) → อย่าทำ index บนคอลัมน์ที่อัปเดตบ่อยโดยไม่จำเป็น และพิจารณา `fillfactor` (เช่น 90) กับตารางที่ UPDATE บ่อย
- **Transaction ID wraparound:** XID เป็นตัวนับ 32-bit ทุกตารางต้องถูก freeze โดย vacuum อย่างน้อยทุกประมาณ 2 พันล้าน transaction autovacuum บังคับ vacuum เมื่ออายุเกิน `autovacuum_freeze_max_age` (default 200 ล้าน) ถ้าถูกขวาง (transaction / slot ค้าง) จนเหลือไม่ถึง 3 ล้าน database จะ **ปฏิเสธการเขียนทั้งหมด** → monitor `age(datfrozenxid)`

---

## PG-03 — ชนิด index ของ PostgreSQL

| Index | ใช้กับ | ตัวอย่าง |
|---|---|---|
| B-tree (default) | `=`, ช่วง, `ORDER BY`, prefix `LIKE 'abc%'` (ต้อง collation `C` หรือ `text_pattern_ops`) | `(customer_id, created_at DESC)` |
| GIN | JSONB, array, full-text, `pg_trgm` (`ILIKE '%คำ%'`) | `USING gin (tags)`, `USING gin (name gin_trgm_ops)` |
| GiST | ช่วง (range), geometry / PostGIS, exclusion constraint | `EXCLUDE USING gist (room WITH =, during WITH &&)` |
| BRIN | ตารางใหญ่มากที่ข้อมูลเรียงตามธรรมชาติ (log ตามเวลา) ขนาดเล็กมาก | `USING brin (created_at)` |
| Hash | `=` อย่างเดียว (มักไม่จำเป็น B-tree ทำได้) | — |

- **Partial index:** `WHERE status = 'pending'` / `WHERE deleted_at IS NULL` (IX-07)
- **Expression index:** `ON users (lower(email))` ใช้ได้เมื่อ query เขียน `WHERE lower(email) = …` ตรงทุกตัวอักษร
- **Covering:** `INCLUDE (col)` (PG 11+) เพื่อ index-only scan
- GIN อัปเดตช้ากว่า B-tree ระวังตารางที่เขียนหนัก

---

## PG-04 — JSONB

- ใช้ `jsonb` ไม่ใช่ `json` (jsonb ค้นและ index ได้)
- ค้นแบบ containment: `WHERE data @> '{"type":"vip"}'` + `GIN (data jsonb_path_ops)` (เล็กกว่า, รองรับ `@>`)
- ค้นฟิลด์เดียวบ่อยๆ: expression index `ON t ((data->>'customer_id'))` หรือดึงออกมาเป็น generated column `GENERATED ALWAYS AS (data->>'customer_id') STORED` + index
- ข้อมูลที่ต้อง FK / unique / กรอง / join บ่อย → คอลัมน์จริง ไม่ใช่ JSONB (FD-05)
- แก้ JSONB ก้อนใหญ่ = เขียนทั้งก้อนใหม่ (+ TOAST) ไม่ใช่แก้เฉพาะฟิลด์

---

## PG-05 — Statistics และ planner

- planner ตัดสินจาก statistics ที่ `ANALYZE` เก็บ (autovacuum ทำให้อัตโนมัติ) หลัง bulk load / migration ใหญ่ให้ `ANALYZE table` เอง
- คอลัมน์ที่ค่ากระจายไม่สม่ำเสมอ: `ALTER TABLE t ALTER COLUMN c SET STATISTICS 1000;` แล้ว `ANALYZE`
- **คอลัมน์ที่สัมพันธ์กัน** (city + zipcode) planner คิดว่าอิสระต่อกัน → ประเมินแถวต่ำเกิน → `CREATE STATISTICS s (dependencies, mcv) ON city, zipcode FROM addresses; ANALYZE addresses;`
- Generic vs custom plan ของ prepared statement (คล้าย parameter sniffing, AP-09): หลังรันซ้ำหลายครั้ง PostgreSQL อาจเปลี่ยนไปใช้ generic plan ซึ่งแย่กับค่าที่กระจายต่างมาก ดู `plan_cache_mode`
- Function ที่ประกาศ volatility ผิด (`VOLATILE` ทั้งที่เป็น `STABLE` / `IMMUTABLE`) ทำให้ planner ใช้ index / inline ไม่ได้

---

## PG-06 — Row Level Security (Supabase) ให้เร็วและปลอดภัย

Policy เปรียบเหมือน `WHERE` ที่ถูกเติมเข้าไปในทุก query:

```sql
CREATE POLICY "own orders" ON orders FOR SELECT
TO authenticated                                   -- skip evaluation entirely for anon
USING ( (select auth.uid()) = user_id );           -- wrapped: evaluated once per statement (initPlan)
CREATE INDEX ON orders (user_id);                  -- every column a policy filters on needs an index
```
- `auth.uid()` ที่ไม่ห่อด้วย `(select …)` อาจถูกเรียก **ทุกแถว** การห่อใช้ได้เฉพาะเมื่อผลไม่ขึ้นกับข้อมูลในแถว
- Policy ที่ต้องเช็กตารางอื่น (สมาชิกทีม / role): ทำ `SECURITY DEFINER` function ที่ตั้ง `SET search_path = ''` และอ้างชื่อเต็ม schema ทุกตัว ระวังว่าข้างในข้าม RLS
- ⚠️ **RLS ซ่อนข้อมูลจากการตรวจของแอปด้วย:** query ที่ "เช็กว่ามีการจองชน / อีเมลซ้ำ / สต็อกพอไหม" ผ่าน client ของผู้ใช้ จะเห็นเฉพาะแถวที่ policy อนุญาต → มองไม่เห็นแถวของคนอื่น → เช็กผ่านทั้งที่ชนจริง กติกาที่ต้องดูข้อมูลทั้งตารางให้บังคับด้วย constraint (UNIQUE / EXCLUDE, FD-06, CC-03) หรือ `SECURITY DEFINER` function ไม่ใช่ SELECT จากฝั่ง client
- เขียน policy แยกตามคำสั่ง (`FOR SELECT` / `INSERT … WITH CHECK` / `UPDATE … USING … WITH CHECK`) ให้ชัด
- ใน query ฝั่งแอปควรใส่ตัวกรองเดียวกันด้วย (`.eq('user_id', uid)`) ช่วยให้ planner เลือก index ได้ดีขึ้น
- ⚠️ `service_role` key ข้าม RLS ทั้งหมด ห้ามอยู่ฝั่ง client · ทุกตารางใน schema ที่เปิดผ่าน API ต้อง `ENABLE ROW LEVEL SECURITY` · view ต้องตั้ง `security_invoker = true` (PG 15+) ไม่เช่นนั้นข้าม RLS ของตารางต้นทาง

---

## PG-07 — Connection และ pooling

- แต่ละ connection ของ PostgreSQL = หนึ่ง process (ใช้ memory หลาย MB) เปิดหลายร้อย / หลายพัน connection ตรงๆ ทำให้ database ช้าเอง → ใช้ pooler (PgBouncer / Supavisor)
- **Transaction mode** (คืน connection หลังจบแต่ละ transaction): ใช้กับ serverless / หลาย instance แต่ **session state ใช้ไม่ได้** เช่น `SET` แบบ session, advisory lock แบบ session, `LISTEN/NOTIFY`, temp table ข้าม transaction และ prepared statement บางแบบ (บาง ORM ต้องตั้งค่า เช่น Prisma `pgbouncer=true`)
- **Session mode** / direct connection: ใช้กับ migration และงานที่ต้อง session state
- ขนาด pool ไม่ใช่ยิ่งมากยิ่งดี: connection ที่ทำงานพร้อมกันจริงควรอยู่ในหลักสิบต่อ database (เริ่มที่ราว 2–4 เท่าของจำนวน CPU core แล้ววัด) เกินกว่านั้นแย่ง CPU / lock กันเอง
- ตั้ง `statement_timeout` และ `idle_in_transaction_session_timeout` ระดับ role ของแอป
