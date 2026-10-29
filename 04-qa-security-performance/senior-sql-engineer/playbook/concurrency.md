# Concurrency (CC): transaction, isolation, lock, deadlock

บั๊กกลุ่มนี้ไม่เห็นตอนทดสอบคนเดียว แต่เกิดจริงตอนผู้ใช้พร้อมกัน (ช่วงเซล, กดซ้ำ, retry) ข้อเท็จจริงตรวจกับเอกสาร PostgreSQL "Transaction Isolation" และ SQL Server / MySQL docs

---

## CC-01 — Isolation level: แต่ละ database ไม่เหมือนกัน

| | PostgreSQL | SQL Server | MySQL (InnoDB) |
|---|---|---|---|
| Default | **Read Committed** (แต่ละคำสั่งเห็น snapshot ณ ตอนเริ่มคำสั่ง) | **Read Committed แบบล็อก** (คนอ่านรอคนเขียน) — Azure SQL Database เปิด RCSI เป็น default | **Repeatable Read** |
| Read Uncommitted | ทำงานเหมือน Read Committed (ไม่มี dirty read) | มี dirty read จริง (`NOLOCK`) | มี dirty read |
| Repeatable Read | snapshot ทั้ง transaction, **ไม่มี phantom** แต่ยังมี serialization anomaly ได้ | ล็อกแถวที่อ่านไว้ (มี phantom ได้) | consistent snapshot + gap / next-key lock |
| Snapshot | (= Repeatable Read ของ PG) | `SNAPSHOT` / `READ_COMMITTED_SNAPSHOT` (RCSI) ใช้ version store ใน tempdb | — |
| Serializable | SSI: ไม่ล็อกเพิ่ม แต่ abort transaction ที่ขัดกัน | ล็อกช่วง (range lock) | ล็อกเข้มที่สุด |

**กติกาที่ตามมา:**
- PostgreSQL Repeatable Read / Serializable: ต้อง **เขียนโค้ดให้ retry ได้** เมื่อเจอ `could not serialize access …` (SQLSTATE **40001**) ทั้ง transaction ไม่ใช่แค่คำสั่งเดียว
- SQL Server: ปัญหา "คนอ่านบล็อกคนเขียน" มักแก้ด้วยเปิด **RCSI** ระดับ database (ต้องทดสอบก่อน เพราะ logic ที่พึ่งการรอ lock จะเปลี่ยนพฤติกรรม และ tempdb ต้องรองรับ version store, AP-13) ไม่ใช่ใส่ `WITH (NOLOCK)` ทุกที่
- ⚠️ `NOLOCK` / Read Uncommitted อ่านได้ทั้งข้อมูลที่ยังไม่ commit, **แถวหาย หรือแถวซ้ำ** (ระหว่าง page split) ห้ามใช้กับยอดเงิน / สต็อก / อะไรที่ต้องถูกต้อง

---

## CC-02 — Lost update (อ่าน → คำนวณในแอป → เขียนทับ)

```csharp
var s = db.Stock.Find(id);  s.Qty -= 1;  db.SaveChanges();   // ❌ two requests read 10, both write 9
```

แก้ได้ 4 แบบ (เรียงจากง่ายและดีที่สุด):

1. **Atomic update ที่ database** (ดีที่สุดสำหรับตัวนับ / สต็อก):
   ```sql
   UPDATE stock SET qty = qty - @n WHERE product_id = @p AND qty >= @n;   -- check affected rows = 1
   ```
2. **Optimistic concurrency** (ผู้ใช้แก้ฟอร์มนานๆ, ชนกันไม่บ่อย): คอลัมน์ `version` / `rowversion` แล้ว `UPDATE … WHERE id = @id AND version = @v` ถ้าได้ 0 แถว = มีคนแก้ก่อน → แจ้งผู้ใช้ / ลองใหม่ (EF Core: `[Timestamp]` / `IsConcurrencyToken`)
3. **Pessimistic lock** (ต้องอ่านแล้วตัดสินใจซับซ้อนใน transaction เดียว): `SELECT … FOR UPDATE` (PostgreSQL / MySQL) หรือ `WITH (UPDLOCK, ROWLOCK)` (SQL Server) **ต้องอยู่ใน transaction สั้น** และห้ามรอสิ่งภายนอกระหว่างถือ lock (AP-13)
4. **Serializable + retry** เมื่อ logic ซับซ้อนเกินกว่าจะล็อกเองได้ถูก

---

## CC-03 — "เช็กก่อนแล้วค่อย insert" เป็น race condition

```sql
IF NOT EXISTS (SELECT 1 FROM users WHERE email = @e) INSERT INTO users ...   -- ❌ two requests both pass the check
```
- แก้ด้วย **UNIQUE constraint** แล้วจัดการ error duplicate (PostgreSQL `23505`, SQL Server 2627 / 2601) หรือ upsert:
  - PostgreSQL: `INSERT … ON CONFLICT (email) DO NOTHING / DO UPDATE SET …`
  - MySQL: `INSERT … ON DUPLICATE KEY UPDATE …`
  - SQL Server: `MERGE` มีบั๊ก / race ที่รู้กันดี ถ้าใช้ต้องใส่ `WITH (HOLDLOCK)`; ทางที่นิยมกว่าคือ `UPDATE … ; IF @@ROWCOUNT = 0 INSERT …` ภายใต้ `UPDLOCK, SERIALIZABLE` หรือ insert แล้วดัก error duplicate
- ใช้หลักเดียวกันกับ idempotency key ของ API / payment: เก็บ key ในตารางที่มี UNIQUE แล้วให้ database ตัดสินว่าใครมาก่อน

---

## CC-04 — Deadlock

เกิดเมื่อ A ถือ lock X รอ Y ขณะที่ B ถือ Y รอ X database จะเลือกฆ่าหนึ่งฝั่ง (PostgreSQL SQLSTATE `40P01`, SQL Server error 1205)

ลดโอกาส:
1. **เข้าถึงทรัพยากรในลำดับเดียวกันเสมอ** (เช่น อัปเดตสต็อกหลายสินค้าเรียงตาม `product_id`)
2. Transaction สั้น ไม่มี I/O ภายนอกระหว่างถือ lock
3. มี index ให้ `UPDATE` / `DELETE` หาแถวได้ตรงๆ (ไม่มี index = scan และล็อกแถว / page มากเกินจำเป็น) รวมถึง FK (IX-09)
4. **แอปต้อง retry** transaction ที่ถูกเลือกเป็น victim (deadlock ป้องกันได้ไม่ 100%)

ตรวจ: PostgreSQL ดู log (`log_lock_waits = on`, `deadlock_timeout`) · SQL Server ดู deadlock graph จาก Extended Events `system_health`

---

## CC-05 — Queue / job table ที่ worker หลายตัวหยิบงานพร้อมกัน

```sql
-- PostgreSQL / MySQL 8
SELECT id FROM jobs WHERE status = 'pending' ORDER BY created_at
LIMIT 10 FOR UPDATE SKIP LOCKED;
-- SQL Server
SELECT TOP (10) id FROM jobs WITH (UPDLOCK, READPAST, ROWLOCK)
WHERE status = 'pending' ORDER BY created_at;
```
- `SKIP LOCKED` / `READPAST` = ข้ามแถวที่ worker อื่นล็อกอยู่ ไม่รอกัน
- ต้องมี index ที่ตรงกับ `WHERE` + `ORDER BY` (มัก filtered / partial index `WHERE status = 'pending'`, IX-07)
- งานที่ worker ตายกลางทาง: ใช้ `locked_until` / heartbeat แล้วให้ปล่อยคืนเมื่อหมดเวลา
- Lock ระดับแอป (ทำ job นี้ได้ทีละตัวทั้งระบบ): PostgreSQL `pg_try_advisory_lock(key)` / SQL Server `sp_getapplock`

---

## CC-06 — Lock ที่คนมักไม่รู้ว่าเกิด

- **Lock escalation (SQL Server):** ล็อกแถวเกินประมาณ 5,000 lock ในคำสั่งเดียว → อาจยกระดับเป็น table lock → ทั้งตารางค้าง → ทำงานก้อนใหญ่เป็นรอบ (`DELETE TOP (5000)` วน, IX-10)
- **Lock queue ของ DDL (PostgreSQL):** `ALTER TABLE` ที่รอ `ACCESS EXCLUSIVE` อยู่ในคิว จะ **บล็อกทุกคำสั่งที่มาหลังจากนั้น แม้แต่ SELECT** → ตั้ง `SET lock_timeout = '3s'` ก่อนรัน DDL บน production แล้ว retry (MG-02)
- **Idle in transaction:** แอปเปิด transaction แล้วลืม commit / เกิด exception แล้วไม่ rollback → ถือ lock ไว้และ (PostgreSQL) ทำให้ VACUUM เก็บแถวเก่าไม่ได้ → ตั้ง `idle_in_transaction_session_timeout` และใช้ `using` / `try-finally`
- **FK ไม่มี index:** ลบ / แก้ key ของแถวแม่ต้อง scan ตารางลูกและล็อกนาน (IX-09)
