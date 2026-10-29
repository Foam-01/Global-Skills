# Data Modeling Patterns (DM): แบบแผนที่ระบบจริงต้องใช้

โจทย์ที่เจอซ้ำในเกือบทุกระบบ ออกแบบผิดตั้งแต่แรกแล้วแก้ทีหลังแพงมาก

---

## DM-01 — Multi-tenant (หลายร้าน / หลายองค์กรในระบบเดียว)

| แบบ | ข้อดี | ข้อเสีย | เหมาะกับ |
|---|---|---|---|
| **ตารางร่วม + `tenant_id` ทุกตาราง** | ง่าย ถูก migrate ครั้งเดียว | ลืมกรอง tenant = ข้อมูลรั่วข้ามร้าน | SaaS ส่วนใหญ่ (เริ่มที่นี่) |
| Schema ต่อ tenant | แยกชัดกว่า | migrate ทุก schema, จำนวน tenant มากจัดการยาก | tenant น้อย ต้องการแยก |
| Database ต่อ tenant | แยกสมบูรณ์ ย้าย / ลบลูกค้าง่าย | ต้นทุน + ปฏิบัติการสูง | ลูกค้าองค์กรที่สัญญากำหนด |

ถ้าเลือกตารางร่วม:
- `tenant_id NOT NULL` ทุกตารางที่เป็นข้อมูลของลูกค้า (รวมตารางลูก ไม่พึ่ง JOIN ไปหาแม่)
- **บังคับที่ database** ด้วย RLS (`USING (tenant_id = (select current_tenant_id()))`, PG-06) ไม่ใช่หวังว่าทุก query จะใส่ `WHERE tenant_id` ครบ
  - ⚠️ RLS ป้องกันได้ **เฉพาะเมื่อ role ที่แอปใช้ไม่ข้าม RLS**: ORM ฝั่ง server (Prisma, Drizzle, EF Core) มักต่อด้วย role `postgres` / owner ของตาราง ซึ่งข้าม RLS (superuser / `BYPASSRLS` / owner โดยไม่ `FORCE ROW LEVEL SECURITY`) → ต้องใช้ role แยกที่ไม่มีสิทธิ์ข้าม และตั้ง tenant ต่อ transaction (`SET LOCAL app.tenant_id = …` แล้ว policy อ่านด้วย `current_setting('app.tenant_id')` ซึ่ง error ถ้าลืมตั้งค่า = fail แบบปลอดภัย; ถ้าใช้ `current_setting(…, true)` จะได้ NULL และ policy คืน 0 แถว) ไม่เช่นนั้น RLS เป็นแค่ของประดับ
  - **ห้ามรับ tenant_id จาก request** (query string / body) ให้ดึงจาก session ที่ยืนยันตัวตนแล้วเสมอ (AP-04)
- index / unique นำด้วย `tenant_id`: `UNIQUE (tenant_id, email)` ไม่ใช่ `UNIQUE (email)`, index `(tenant_id, created_at)`
- FK ข้ามตารางควรรวม `tenant_id` (`FOREIGN KEY (tenant_id, customer_id) REFERENCES customers (tenant_id, id)`) กันการผูกข้อมูลข้ามร้าน ตารางแม่ต้องมี `UNIQUE (tenant_id, id)` ก่อน ไม่เช่นนั้นสร้าง FK ไม่ได้
- tenant ใหญ่ผิดปกติ (noisy neighbor) ทำให้ statistics / plan เพี้ยน ต้องเฝ้าดู

---

## DM-02 — เงิน / กระเป๋าเงิน / แต้ม: ใช้ ledger ไม่ใช่แก้ยอดตรงๆ

```sql
-- ❌ UPDATE wallets SET balance = balance - 100 WHERE user_id = 1;   -- no history, cannot audit or reconcile
-- ✅ append-only entries; balance is derived (and optionally cached)
CREATE TABLE ledger_entries (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  account_id bigint NOT NULL REFERENCES accounts(id),
  amount_satang bigint NOT NULL,             -- integer minor units, signed (+ credit / - debit)
  txn_id uuid NOT NULL,                      -- groups the two sides of one transfer
  kind text NOT NULL,                        -- 'topup' | 'purchase' | 'refund' ...
  idempotency_key text,                      -- copied from the transfer header; uniqueness is enforced there
  created_at timestamptz NOT NULL DEFAULT now()
);
```
- idempotency key ต้อง UNIQUE ที่ **ระดับการโอน** ไม่ใช่ทุกแถว ledger (หนึ่งการโอนมี 2 แถว → UNIQUE บนแถวจะทำให้แถวที่สองชนเสมอ): ตาราง `transfers (txn_id PK, idempotency_key UNIQUE, …)` ที่ `ledger_entries.txn_id` อ้างถึง (CC-03)
- **Double-entry:** ทุกการโอนมีสองฝั่งที่รวมกันได้ 0 (`SUM(amount) GROUP BY txn_id = 0`) ใส่ใน transaction เดียว
- ห้าม `UPDATE` / `DELETE` รายการ ledger ถ้าผิดให้ลงรายการกลับ (reversal)
- ยอดคงเหลือ: คำนวณจาก `SUM` + cache ในตาราง `account_balances` ที่อัปเดตใน transaction เดียวกับการลงรายการ พร้อม `CHECK (balance >= 0)` ถ้าห้ามติดลบ และล็อกแถวบัญชีก่อนตัด (`FOR UPDATE`, CC-02) และมี job reconcile เทียบ cache กับ SUM
- จำนวนเงิน: `bigint` หน่วยย่อย หรือ `numeric(19,4)` ไม่ใช่ float (SD-01) และเก็บ `currency` ถ้ามีหลายสกุล

---

## DM-03 — สต็อกสินค้า

- ตัดสต็อกแบบ atomic + ห้ามติดลบ: `UPDATE … SET qty = qty - @n WHERE id = @p AND qty >= @n` (CC-02) + `CHECK (qty >= 0)`
- ถ้าต้องรู้ที่มาที่ไป (คลังหลายแห่ง, รับเข้า, ตัดออก, ปรับยอด) ใช้ตาราง movement แบบ ledger (DM-02) แล้ว cache ยอดคงเหลือ
- การ "จอง" สต็อกระหว่างรอจ่าย ต้องมีวันหมดอายุ (`reserved_until`) + job ปล่อยคืน
- Hot row (สินค้าขายดีตัวเดียวถูกแย่งช่วงแฟลชเซล): ทุก request ล็อกแถวเดียวกัน → transaction ต้องสั้นมาก (AP-13) ถ้ายังไม่พอ แตกสต็อกเป็นหลายช่อง (bucket) แล้วสุ่มตัด

---

## DM-04 — ประวัติการแก้ไข (audit / history)

| วิธี | ใช้เมื่อ |
|---|---|
| `created_at`, `updated_at`, `created_by`, `updated_by` | ขั้นต่ำทุกตาราง (`updated_at` ตั้งด้วย trigger ไม่พึ่งแอป) |
| ตาราง audit log ทั่วไป (ตาราง, id, การกระทำ, ค่าเก่า / ใหม่ JSONB, ใคร, เมื่อไหร่) ผ่าน trigger | ต้องรู้ว่าใครแก้อะไร (ข้อมูลส่วนบุคคล, การเงิน, สิทธิ์) |
| ตารางประวัติเฉพาะ (`price_history`, `valid_from`, `valid_to`) | ต้องถาม "ค่า ณ วันที่ X คืออะไร" |
| SQL Server temporal table (`SYSTEM_VERSIONING = ON`) | ให้ database เก็บประวัติให้อัตโนมัติ |

- audit log โตเร็ว → partition ตามเวลา (SD-03) และกำหนด retention
- อย่าเก็บข้อมูลอ่อนไหวเต็มๆ ใน audit (รหัสผ่าน, token, เลขบัตร) และระวังว่า audit ก็เป็นข้อมูลส่วนบุคคล (PDPA)

---

## DM-05 — Soft delete

- `deleted_at timestamptz NULL` แทนการลบจริง เมื่อต้องกู้คืน / อ้างอิงย้อนหลัง
- ต้นทุนที่ต้องจ่าย: ทุก query ต้อง `WHERE deleted_at IS NULL` (ลืม = ข้อมูลที่ลบแล้วโผล่) → ใช้ view / RLS / global query filter ของ ORM, index เป็น partial `WHERE deleted_at IS NULL` และ unique ต้องเป็น partial (FD-06)
- ข้อมูลส่วนบุคคลที่ผู้ใช้ขอลบ **soft delete ไม่พอ** ต้องลบ / ทำให้ระบุตัวตนไม่ได้จริง (anonymize) ตาม retention
- ทางเลือก: ย้ายแถวที่ลบไปตาราง archive แทน (ตารางหลักสะอาด, query ไม่ต้องกรอง)

---

## DM-06 — ข้อมูลแบบต้นไม้ (หมวดหมู่ซ้อน, ผังองค์กร, คอมเมนต์ตอบกลับ)

| แบบ | อ่านทั้งกิ่ง | ย้ายกิ่ง | หมายเหตุ |
|---|---|---|---|
| Adjacency list (`parent_id`) | ใช้ recursive CTE | ง่าย (แก้แถวเดียว) | เริ่มที่นี่ + index `parent_id` |
| Materialized path (`/1/5/23/`) หรือ PostgreSQL `ltree` | เร็ว (`LIKE '/1/5/%'` / `ltree <@`) | ต้องแก้ทุกลูก | เหมาะกับอ่านบ่อยย้ายน้อย |
| Closure table (ancestor, descendant, depth) | เร็วมาก | แก้หลายแถว | ต้นไม้ใหญ่ query ซับซ้อน |

```sql
WITH RECURSIVE tree AS (
  SELECT id, parent_id, name, 1 AS depth FROM categories WHERE id = @root
  UNION ALL
  SELECT c.id, c.parent_id, c.name, t.depth + 1
  FROM categories c JOIN tree t ON c.parent_id = t.id
  WHERE t.depth < 20                       -- guard against cycles / runaway depth
)
SELECT * FROM tree;
```

---

## DM-07 — วันเวลาและ timezone

- เก็บเป็น UTC: PostgreSQL `timestamptz` (เก็บเป็น UTC แปลงตาม session timezone ตอนแสดง), SQL Server `datetime2` + บันทึกว่าเป็น UTC หรือ `datetimeoffset`
- **วันที่ทางธุรกิจ** (วันเกิด, วันหยุด, วันครบกำหนด) ใช้ `date` ไม่ใช่ timestamp (กันวันเลื่อนข้ามโซน)
- นัดหมายในอนาคตตามเวลาท้องถิ่น (คลินิกเปิด 9 โมงเช้าเวลาไทย) เก็บเวลาท้องถิ่น + ชื่อ timezone (`Asia/Bangkok`) เพราะกฎเวลาออมแสงของบางประเทศเปลี่ยนได้
- รายงาน "ยอดขายรายวันตามเวลาไทย" ต้องแปลงขอบเขตวันก่อน: `created_at >= '2026-10-01 00:00+07' AND created_at < '2026-10-02 00:00+07'` (ช่วงครึ่งเปิด, IX-03) ไม่ใช่ `DATE(created_at)` ตาม UTC
- ช่วงเวลา (จอง, ราคาโปรโมชัน) ใช้ช่วงครึ่งเปิด `[start, end)` และ PostgreSQL `tstzrange` + exclusion constraint กันทับซ้อน (FD-06)

---

## DM-08 — สถานะ (state machine)

- เก็บสถานะเป็นค่าจำกัดด้วย `CHECK` / lookup table / enum (SD-01) และกำหนดว่าเปลี่ยนจากไหนไปไหนได้
- เปลี่ยนสถานะแบบมีเงื่อนไขเสมอ: `UPDATE orders SET status = 'paid' WHERE id = @id AND status = 'pending'` แล้วเช็กจำนวนแถว (กันจ่ายซ้ำ / เปลี่ยนย้อน, CC-02)
- เก็บเวลาของแต่ละสถานะที่สำคัญ (`paid_at`, `shipped_at`) หรือตาราง `order_status_history` สำหรับ timeline
