# Testing (TS): ทดสอบโค้ดที่เกี่ยวกับ database ให้จับบั๊กได้จริง

หลัก: บั๊ก SQL ส่วนใหญ่ **ไม่โผล่ใน test ที่ใช้ mock หรือข้อมูล 3 แถว** ต้องทดสอบกับ database จริง (ชนิดและเวอร์ชันเดียวกับ production) และข้อมูลที่มีกรณีขอบ

---

## TS-01 — ใช้ database จริงใน test ไม่ใช่ mock / SQLite แทน

- Mock repository ทดสอบได้แค่ว่าโค้ดเรียก function ไม่ได้ทดสอบว่า SQL ถูก
- SQLite / in-memory provider (EF Core InMemory) ทำงานต่างจาก PostgreSQL / SQL Server (collation, NULL ใน UNIQUE, timezone, lock, constraint บางชนิด) → ผ่าน test แต่พังบน production
- ใช้ container: Testcontainers (Node, .NET, Java, Python, Go), `docker compose` หรือ Supabase CLI (`supabase start` รัน stack จริงในเครื่อง พร้อม `supabase db reset` ที่รัน migration + seed)
- แต่ละ test แยกข้อมูลกัน: ครอบด้วย transaction แล้ว rollback, หรือ truncate ระหว่าง test, หรือ schema / database ต่อ worker เมื่อรันขนาน
- ⚠️ test concurrency (TS-04) และ migration (TS-05) **ใช้วิธี rollback ไม่ได้**: connection อื่นมองไม่เห็นข้อมูลที่ยังไม่ commit และ `CREATE INDEX CONCURRENTLY` รันใน transaction ไม่ได้ → ใช้ truncate หรือ database ต่อ test

---

## TS-02 — ข้อมูลทดสอบต้องมีกรณีขอบ

ทุก query สำคัญควรมีข้อมูลที่ครอบคลุม:
- `NULL` ในคอลัมน์ที่กรอง / JOIN / `NOT IN` (FD-02, AP-05)
- แถวที่ไม่มีคู่ใน LEFT JOIN, แถวที่มีหลายคู่ (fan-out, AP-06)
- ค่าซ้ำในคอลัมน์ที่ใช้เรียง (pagination tie-breaker, AP-08)
- ขอบเวลา: 23:59:59.999, เที่ยงคืนตามเวลาไทยเทียบ UTC, วันสุดท้ายของเดือน (IX-03, DM-07)
- ภาษาไทย / emoji / ตัวพิมพ์ใหญ่-เล็ก / ช่องว่างหน้า-หลัง
- ข้อมูลของ tenant / ผู้ใช้อื่นที่ **ต้องไม่โผล่** ในผลลัพธ์ (DM-01)
- ข้อมูลที่ถูก soft delete / ยกเลิก (DM-05)

---

## TS-03 — ทดสอบสิทธิ์และ RLS

```sql
-- pgTAP-style RLS test (Supabase: supabase test db)
BEGIN;
SELECT plan(2);
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111"}';
SELECT is((SELECT count(*) FROM orders WHERE user_id <> '11111111-1111-1111-1111-111111111111'), 0::bigint,
          'user cannot see other users orders');
WITH u AS (UPDATE orders SET total = 0 WHERE user_id <> '11111111-1111-1111-1111-111111111111' RETURNING 1)
SELECT is((SELECT count(*) FROM u), 0::bigint,
          'user cannot update other users orders');   -- RLS filters the rows: 0 affected, no error
SELECT * FROM finish();
ROLLBACK;
```
- ต้องมี **test เชิงบวกด้วย** (ผู้ใช้เห็น / แก้แถวของตัวเองได้) ไม่เช่นนั้น policy ที่บล็อกทุกแถวก็ผ่าน test เชิงลบ
- test UPDATE ที่คาดว่าได้ 0 แถว ใช้ได้เมื่อ role นั้นมี `GRANT UPDATE` บนตาราง ถ้าไม่มีจะได้ `permission denied` แทน (ซึ่งก็ปลอดภัย แต่ test จะ error)
- ทดสอบด้วย **role ที่แอปใช้จริง** (`authenticated` / `anon` / role ของแอป) ไม่ใช่ `postgres` ที่ข้าม RLS (DM-01)
- ทดสอบทั้ง SELECT / INSERT / UPDATE / DELETE และกรณี "ผู้ใช้ไม่ได้ login"
- ฝั่ง API: test ที่ใช้ token ของผู้ใช้ A ขอข้อมูลของผู้ใช้ B ต้องได้ 403 / 404 (AP-04)

---

## TS-04 — ทดสอบ concurrency

บั๊ก race condition ต้องยิงพร้อมกันจริงถึงจะเห็น:

```ts
// fire N identical requests at once; assert the invariant, not just "no error"
const results = await Promise.allSettled(Array.from({ length: 50 }, () => pay(customerId, 10)));
const ok = results.filter(r => r.status === 'fulfilled').length;
const balance = await getBalance(customerId);
expect(balance).toBeGreaterThanOrEqual(0);
expect(balance).toBe(start - ok * 10);          // every success debited exactly once
```
- ตรวจ **invariant** (ยอดไม่ติดลบ, สต็อกไม่ติดลบ, จ่ายซ้ำไม่ได้, ไม่มีการจองทับ) ไม่ใช่แค่ว่าไม่ error
- test นี้ต้องรันกับ database จริงและ connection pool มากกว่า 1 (ไม่เช่นนั้นคำสั่งถูกเรียงกันเองและไม่เกิด race)
- ทดสอบ idempotency: ส่ง request เดิม (key เดิม) ซ้ำ ต้องได้ผลเดิมและไม่ทำงานซ้ำ (CC-03)

---

## TS-05 — ทดสอบ migration

- ใน CI: สร้าง database ว่าง → รัน migration ทั้งหมดตั้งแต่ต้น → รัน test (จับ migration ที่พึ่งข้อมูลในเครื่องคนเขียน)
- ทดสอบ migration ใหม่บน **สำเนาข้อมูลขนาดใกล้ production** (anonymize ข้อมูลส่วนบุคคลก่อน) และจับเวลา (MG-06)
- ตรวจว่า migration ไม่ทำลายโค้ดเวอร์ชันก่อนหน้า (rolling deploy, MG-01)
- เครื่องมือตรวจ SQL migration อัตโนมัติ: `squawk` (PostgreSQL, เตือนคำสั่งที่ล็อกตาราง / rewrite), `strong_migrations` (Rails) ใส่ใน CI ได้

---

## TS-06 — ทดสอบ performance ไม่ให้ถอยหลัง

- เก็บ `EXPLAIN` ของ query สำคัญด้วยข้อมูลขนาดสมจริง แล้วตรวจใน review ว่า plan ไม่เปลี่ยนเป็น Seq Scan / Sort ใหญ่
- ตั้ง budget: จำนวน query ต่อ request (จับ N+1, AP-02 / OR-01) เช่น นับ query ใน test ของ endpoint รายการ
- `pg_stat_statements` / Query Store หลัง deploy เทียบกับก่อน deploy (IN-01)
- ข้อมูลน้อย plan จะต่างจาก production (ตารางเล็ก planner เลือก Seq Scan ถูกต้องแล้ว) ทดสอบ performance ต้องใช้ข้อมูลระดับเดียวกัน
