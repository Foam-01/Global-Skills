# Migrations (MG): เปลี่ยน schema บน production โดยไม่ล่ม

ข้อเท็จจริงเรื่อง lock ตรวจกับเอกสาร PostgreSQL `ALTER TABLE` และ `CREATE INDEX` (current) + SQL Server online index operations

---

## MG-01 — หลัก expand → migrate → contract

ห้ามเปลี่ยนแบบ "ทุบแล้วสร้างใหม่" ในครั้งเดียว เพราะระหว่าง deploy จะมีโค้ดเวอร์ชันเก่ากับใหม่รันพร้อมกัน (rolling deploy, หลาย instance) ให้แบ่งเป็นขั้นที่แต่ละขั้นใช้ได้กับโค้ดทั้งสองเวอร์ชัน:

1. **Expand:** เพิ่มของใหม่แบบไม่ทำลาย (คอลัมน์ใหม่ที่ nullable / มี default, ตารางใหม่, index ใหม่)
2. **Migrate:** deploy โค้ดที่เขียนทั้งเก่าและใหม่ → backfill ข้อมูลเก่าเป็นรอบ → สลับให้อ่านจากของใหม่
3. **Contract:** เมื่อไม่มีโค้ดไหนใช้ของเก่าแล้ว (และพ้นช่วงที่อาจ rollback) ค่อยลบคอลัมน์ / ตารางเก่า

ตัวอย่าง rename คอลัมน์ `name` → `full_name`: เพิ่ม `full_name` → โค้ดเขียนทั้งสอง → backfill → โค้ดอ่าน `full_name` → หยุดเขียน `name` → drop `name` (ไม่ใช่ `RENAME COLUMN` ตรงๆ ที่ทำให้โค้ดเก่าพังทันที)

**Rollback:** ทุก migration ต้องรู้ว่าจะถอยอย่างไร การลบคอลัมน์ / ข้อมูลถอยไม่ได้ → เก็บไว้จนแน่ใจ และ backup ก่อน

---

## MG-02 — Lock ของคำสั่ง DDL ใน PostgreSQL

| คำสั่ง | Lock / ผลกระทบ | ทำอย่างปลอดภัย |
|---|---|---|
| `ALTER TABLE` ส่วนใหญ่ | **`ACCESS EXCLUSIVE`** (บล็อกทั้งอ่านและเขียน) | ทำให้เร็ว + `SET lock_timeout` แล้ว retry |
| `ADD COLUMN` (nullable หรือมี DEFAULT ที่ไม่ volatile) | ไม่ rewrite ตาราง (เก็บ default ใน metadata, PG 11+) → เร็ว | ✅ ปลอดภัย แต่ยังต้องได้ lock สั้นๆ |
| `ADD COLUMN … DEFAULT now()/random()` (volatile) | **rewrite ทั้งตาราง** | เพิ่มแบบไม่มี default แล้ว backfill เป็นรอบ |
| `ALTER COLUMN TYPE` | ส่วนใหญ่ **rewrite ทั้งตาราง + index** (ยกเว้น binary coercible เช่น `varchar(n)` → `text`, ขยาย `varchar(n)`) | สร้างคอลัมน์ใหม่ + backfill + สลับ (MG-01) |
| `SET NOT NULL` | scan ทั้งตารางภายใต้ lock | เพิ่ม `CHECK (col IS NOT NULL) NOT VALID` → `VALIDATE CONSTRAINT` → แล้ว `SET NOT NULL` จะข้ามการ scan (PG 12+) → drop check |
| `ADD FOREIGN KEY` | scan ตรวจทุกแถว (lock `SHARE ROW EXCLUSIVE` ทั้งสองตาราง) | `ADD CONSTRAINT … NOT VALID` (ไม่ scan) → `VALIDATE CONSTRAINT` ทีหลัง (lock แค่ `SHARE UPDATE EXCLUSIVE` ไม่บล็อกการเขียน) |
| `ADD CHECK` | scan ตรวจทุกแถว | `NOT VALID` → `VALIDATE` เหมือนกัน |
| `CREATE INDEX` | บล็อก **การเขียน** ตลอดเวลาที่สร้าง (อ่านได้) | `CREATE INDEX CONCURRENTLY` |
| `DROP INDEX` | `ACCESS EXCLUSIVE` สั้นๆ | `DROP INDEX CONCURRENTLY` |

**กับดักของ `CREATE INDEX CONCURRENTLY`:**
- รันใน transaction block ไม่ได้ (เครื่องมือ migration หลายตัวครอบทุก migration ด้วย transaction → ต้องปิดสำหรับไฟล์นั้น)
- ช้ากว่าแบบปกติ (scan ตาราง 2 รอบ และรอ transaction เก่าที่ค้างอยู่)
- ถ้าล้มกลางทาง จะเหลือ index สถานะ **INVALID** ที่ไม่ถูกใช้ค้นหา แต่ **ยังเสียต้นทุนตอนเขียน** → `DROP INDEX` แล้วสร้างใหม่ (หรือ `REINDEX INDEX CONCURRENTLY`) ตรวจหา: `SELECT indexrelid::regclass FROM pg_index WHERE NOT indisvalid;`

**Lock queue:** แม้คำสั่งจะเร็ว แต่ถ้ามี query ยาวถือ lock อยู่ DDL จะรอ และ **ทุกคำสั่งที่มาหลัง DDL ต้องรอต่อคิวด้วย** (เว็บค้างทั้งที่ ALTER ยังไม่เริ่ม) จึงต้องมี:
```sql
SET lock_timeout = '3s';         -- give up quickly instead of freezing traffic
SET statement_timeout = '15min'; -- upper bound for the migration itself
ALTER TABLE ...;                 -- retry from the migration runner if it times out
```

---

## MG-03 — SQL Server

- `CREATE INDEX … WITH (ONLINE = ON)` / `ALTER INDEX … REBUILD WITH (ONLINE = ON)` (Enterprise / Azure SQL) ไม่บล็อกการเขียนระหว่างสร้าง แต่ยังต้องได้ lock สั้นๆ ตอนเริ่มและจบ → ใช้ `WAIT_AT_LOW_PRIORITY (MAX_DURATION = …, ABORT_AFTER_WAIT = SELF)` เพื่อไม่ให้ไปขวางคิว
- `RESUMABLE = ON` (2017+ สำหรับ rebuild, 2019+ สำหรับ create) หยุด / ทำต่อได้ ใช้กับตารางใหญ่มาก
- `ADD COLUMN NOT NULL DEFAULT <ค่าคงที่>` เป็น metadata-only (Enterprise 2012+) แต่ default ที่ไม่คงที่ (`NEWID()`) ต้องเขียนทุกแถว
- `ALTER COLUMN` เปลี่ยน type / ขนาดมัก **ต้องแตะทุกแถวภายใต้ Sch-M lock** → ใช้ expand / contract
- เพิ่ม FK / CHECK บนตารางใหญ่: `WITH NOCHECK` แล้วตรวจทีหลัง แต่ constraint จะเป็น "untrusted" และ optimizer ใช้มันช่วย plan ไม่ได้ จนกว่าจะ `ALTER TABLE … WITH CHECK CHECK CONSTRAINT …`

## MG-04 — MySQL

- InnoDB online DDL: `ALGORITHM=INSTANT` (8.0+: เพิ่มคอลัมน์ได้ทันที) > `INPLACE` > `COPY` (rewrite ตาราง) ระบุ `ALGORITHM=…, LOCK=NONE` ให้มัน error แทนที่จะแอบล็อกตาราง
- ตารางใหญ่มากที่ต้อง COPY: ใช้เครื่องมือ online schema change (`gh-ost`, `pt-online-schema-change`)

---

## MG-05 — Backfill และ data migration

```sql
-- PostgreSQL: backfill in batches by key range, committing each batch
UPDATE users SET full_name = name
WHERE id >= @from AND id < @from + 5000 AND full_name IS NULL;
-- loop @from in the migration runner; sleep briefly between batches
```
- ทีละไม่กี่พันแถวต่อรอบ commit ทุกรอบ → ไม่ถือ lock นาน, log / WAL ไม่โตทีเดียว, replica ไม่ lag (ดู OP-03)
- วนตาม key ที่มี index (ไม่ใช่ `OFFSET`) และทำให้ **รันซ้ำได้** (`WHERE full_name IS NULL`) เผื่อหยุดกลางทาง
- PostgreSQL: `UPDATE` ทุกแถว = สร้าง dead tuple เท่าจำนวนแถว → ตาราง bloat ชั่วคราว ให้ autovacuum ตามทัน หรือ `VACUUM (ANALYZE)` หลัง backfill (PG-02)
- หลัง migration ใหญ่: `ANALYZE` ให้ statistics ใหม่ ไม่เช่นนั้น plan อาจแย่ลงทันที

---

## MG-06 — Checklist ก่อนรัน migration บน production

- [ ] ทดสอบกับ **สำเนาข้อมูลขนาดเท่า production** (ตารางว่างใน dev ไม่บอกอะไร) และจับเวลา
- [ ] รู้ว่าคำสั่งนี้ lock อะไร / rewrite ตารางไหม (ตาราง MG-02)
- [ ] ตั้ง `lock_timeout` / `WAIT_AT_LOW_PRIORITY`
- [ ] โค้ดเวอร์ชันเก่าและใหม่ใช้ schema ระหว่างทางได้ทั้งคู่ (MG-01)
- [ ] มีแผน rollback และ backup / PITR ล่าสุดใช้ได้ (OP-01)
- [ ] รันในช่วงโหลดต่ำ และมีคนเฝ้า metric (lock waits, replica lag, error rate)
- [ ] `ANALYZE` / update statistics หลังเปลี่ยนข้อมูลจำนวนมาก
