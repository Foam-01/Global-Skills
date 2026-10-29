# Integration (IG): database กับระบบอื่น — outbox, cache, event, CDC

ปัญหาที่เกิดเมื่อการเขียน database ต้อง "ไปด้วยกัน" กับสิ่งที่อยู่นอก database (ส่งอีเมล, เรียก API, อัปเดต cache / search index, แจ้งอีก service) ซึ่ง transaction ของ database ครอบไม่ถึง

---

## IG-01 — Dual write: เขียนสองที่แล้วไม่ตรงกัน

```ts
await db.order.update({ where: { id }, data: { status: 'paid' } });
await emailService.sendReceipt(id);     // ❌ crash here → paid but no email
await searchIndex.update(id);           // ❌ or this fails → DB and search disagree
```
- สลับลำดับก็ไม่ช่วย (ส่งอีเมลก่อนแล้ว DB ล้ม = ส่งใบเสร็จของออเดอร์ที่ไม่ได้จ่าย)
- ห้ามแก้ด้วยการครอบ API call ไว้ใน transaction (ถือ lock ระหว่างรอ, AP-13) และ distributed transaction (2PC) มักไม่มีให้ใช้ / ซับซ้อนเกินคุ้ม
- ทางที่ถูก: **บันทึก "สิ่งที่ต้องทำต่อ" ลง database ใน transaction เดียวกับข้อมูลหลัก** แล้วให้ worker ไปทำ (IG-02)

---

## IG-02 — Transactional outbox

```sql
CREATE TABLE outbox (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  topic text NOT NULL,                 -- 'receipt.send', 'search.reindex'
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  attempts int NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz,            -- lease: lets the worker commit the claim and work without holding row locks
  last_error text
);
CREATE INDEX outbox_pending ON outbox (next_attempt_at) WHERE processed_at IS NULL;   -- partial (IX-07)
```
```sql
-- in the SAME transaction as the business change
BEGIN;
UPDATE orders SET status = 'paid' WHERE id = $1 AND status = 'pending';
INSERT INTO outbox (topic, payload) VALUES ('receipt.send', jsonb_build_object('order_id', $1));
COMMIT;

-- worker: claim a batch with a lease, then COMMIT before doing the work (CC-05)
UPDATE outbox SET locked_until = now() + interval '5 minutes', attempts = attempts + 1
WHERE id IN (
  SELECT id FROM outbox
  WHERE processed_at IS NULL AND next_attempt_at <= now()
    AND (locked_until IS NULL OR locked_until < now())
  ORDER BY next_attempt_at LIMIT 50
  FOR UPDATE SKIP LOCKED)
RETURNING id, topic, payload;
-- the row locks end at COMMIT; the lease (locked_until) is what keeps other workers away
```
- ⚠️ `SELECT … FOR UPDATE SKIP LOCKED` อย่างเดียวกันงานซ้ำได้ **เฉพาะตอนที่ยังถือ transaction อยู่** พอ commit แล้ว lock หลุด worker อื่นหยิบแถวเดิมได้ทันที จึงต้องใช้ lease (`locked_until`) แบบข้างบนถ้าจะทำงานนอก transaction
- worker ทำงานแล้ว `UPDATE outbox SET processed_at = now(), locked_until = NULL` ถ้าล้มให้เลื่อน `next_attempt_at` แบบ exponential backoff, เกินจำนวนครั้งที่กำหนดให้ย้ายไป dead-letter และแจ้งเตือน
- ⚠️ การรับประกันคือ **at-least-once** (worker อาจทำสำเร็จแล้วตายก่อนบันทึก → ทำซ้ำ) → ปลายทางต้อง idempotent (IG-04)
- outbox โตเร็ว: ลบ / archive แถวที่ processed แล้วเป็นรอบเล็กๆ (หัวข้อลบข้อมูลใน IX-10, MG-05) หรือ partition ตามเวลา (SD-03) และระวัง bloat จาก UPDATE บ่อย (PG-02)
- อย่าถือ transaction ค้างตอน worker เรียก API: claim + lease → commit → ทำงาน → บันทึกผลใน transaction ใหม่ (lease ต้องยาวกว่าเวลาทำงานปกติ ถ้า worker ตาย lease หมดอายุแล้ว worker อื่นจะหยิบต่อ)

---

## IG-03 — Cache: ความเร็วแลกกับข้อมูลเก่า

- ใช้ cache หลังจากจูน query / index แล้วยังไม่พอ (SKILL.md กฎข้อ 3, OP-06) และกับข้อมูลที่ **อ่านบ่อย เปลี่ยนน้อย ยอมเก่าได้เล็กน้อย** (หน้าสินค้า, การตั้งค่า, ยอดสรุป)
- **ห้าม** ใช้ค่าจาก cache ตัดสินใจเรื่องที่ต้องถูกต้อง (ยอดเงิน, สต็อก, สิทธิ์) → อ่านจาก database ใน transaction (CC-02)
- รูปแบบที่ปลอดภัยที่สุด: **cache-aside + ลบ cache หลัง commit** (ไม่ใช่เขียนค่าใหม่ลง cache) + TTL เป็นตาข่ายสุดท้าย
  - อัปเดต cache ก่อน commit แล้ว transaction rollback = cache มีค่าที่ไม่เคยเกิดขึ้น
  - สอง request เขียน cache สลับลำดับ = ค่าเก่าทับค่าใหม่ → การ "ลบ" ปลอดภัยกว่าการ "เขียน"
- cache stampede (key ยอดนิยมหมดอายุพร้อมกัน ทุก request วิ่งไป database): ล็อกให้ request เดียวคำนวณ (single flight / request coalescing แบบที่ Discord ใช้ใน SD-03), TTL แบบสุ่มเล็กน้อย, หรือ refresh ก่อนหมดอายุ
- key ต้องรวม tenant / ผู้ใช้ / สิทธิ์เมื่อข้อมูลต่างกันตามผู้ดู ไม่เช่นนั้นข้อมูลรั่วข้ามผู้ใช้ผ่าน cache (DM-01)

---

## IG-04 — Consumer ต้อง idempotent

ทุกอย่างที่รับ event / webhook / งานจาก queue อาจได้ข้อความเดิมซ้ำ (retry, at-least-once):
```sql
CREATE TABLE processed_events (event_id text PRIMARY KEY, processed_at timestamptz NOT NULL DEFAULT now());
-- in the same transaction as the side effect on our database
INSERT INTO processed_events (event_id) VALUES ($1) ON CONFLICT DO NOTHING;   -- 0 rows = already handled → skip
```
- ใช้ id ที่มาจากผู้ส่ง (event id ของ payment provider, idempotency key ของ client) ไม่ใช่ id ที่สร้างใหม่ตอนรับ
- การกระทำกับระบบภายนอก ให้ส่ง idempotency key ต่อไปด้วยถ้าปลายทางรองรับ
- ลำดับ event อาจสลับ (`paid` มาถึงก่อน `created`): เปลี่ยนสถานะแบบมีเงื่อนไข (DM-08) หรือเก็บ version / timestamp ของ event แล้วไม่ยอมให้ event เก่าทับข้อมูลใหม่

---

## IG-05 — Change Data Capture (CDC) และ event จาก database

| วิธี | ใช้เมื่อ | ข้อควรระวัง |
|---|---|---|
| Trigger เขียนลง outbox / audit | ต้องการให้ทุกการเปลี่ยน (รวมจาก script / คนแก้ตรง) ถูกบันทึก | trigger ทำให้การเขียนช้าลง ห้ามเรียกระบบภายนอกจาก trigger |
| `LISTEN / NOTIFY` (PostgreSQL) | แจ้งเตือนเบาๆ ภายในระบบ ("มีงานใหม่ใน outbox") | ไม่เก็บข้อความ (ผู้ฟังหลุด = พลาด), ใช้ผ่าน transaction pooler ไม่ได้ (PG-07) → ใช้เป็นแค่ตัวปลุก แล้วอ่านข้อมูลจริงจากตาราง |
| Logical replication / Debezium | ส่งทุกการเปลี่ยนไป search engine, warehouse, service อื่นแบบใกล้เวลาจริง | replication slot ที่ไม่มีใครอ่านทำให้ WAL ค้างจน disk เต็มและขวาง VACUUM (OP-03, PG-02, IN-04) ต้อง monitor |
| Supabase Realtime / Database Webhooks | แจ้ง client / เรียก HTTP เมื่อแถวเปลี่ยน | Realtime เคารพ RLS ต่อผู้ฟัง (มีต้นทุนต่อการเปลี่ยน × ผู้ฟัง); webhook เป็น at-least-once → ปลายทาง idempotent (IG-04) |
| SQL Server CDC / Change Tracking | ส่งการเปลี่ยนไประบบอื่น | CDC ใช้ log reader + ตาราง change, ต้องดูแล cleanup job |

---

## IG-06 — Read model / ข้อมูลซ้ำในระบบอื่น

- search index, warehouse, cache, ตารางสรุป คือ "สำเนา" ของข้อมูลจริง ต้องกำหนดว่า **database หลักคือความจริง (source of truth)** และสำเนาสร้างใหม่ได้เสมอ
- มีงาน **reconcile / rebuild** เป็นรอบ (เทียบจำนวน / checksum, สร้างใหม่จากต้นทาง) เพราะ event หายได้เสมอในระยะยาว
- แสดงผลจากสำเนาได้ แต่การตัดสินใจที่ต้องถูกต้อง (จ่ายเงิน, ตัดสต็อก, ตรวจสิทธิ์) ทำบนข้อมูลหลัก
