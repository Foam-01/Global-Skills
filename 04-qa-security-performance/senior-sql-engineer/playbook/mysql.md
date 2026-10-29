# MySQL / MariaDB (MY): พฤติกรรมที่ต่างจาก PostgreSQL / SQL Server

ใช้ร่วมกับบทอื่น (หลักการ index / query เหมือนกัน) บทนี้รวมเฉพาะจุดที่ MySQL (InnoDB, 8.0+) ทำต่าง

---

## MY-01 — InnoDB: PRIMARY KEY คือ clustered index เสมอ

- ตารางถูกเก็บเรียงตาม PK (เหมือน clustered index ของ SQL Server, IX-10) ถ้าไม่มี PK InnoDB จะใช้ unique NOT NULL ตัวแรก หรือสร้าง row id ซ่อนให้ → **ทุกตารางควรมี PK ที่ตั้งใจเลือก**
- secondary index เก็บค่า PK ไว้ในทุก entry → PK กว้าง (UUID แบบ `CHAR(36)`) ทำให้ทุก index ใหญ่ → `BIGINT AUTO_INCREMENT` หรือ UUID เก็บเป็น `BINARY(16)` ด้วย `UUID_TO_BIN(uuid, 1)` (flag 1 สลับไบต์เวลาให้เรียง สำหรับ UUID v1; UUID v7 เรียงอยู่แล้วโดยไม่ต้องสลับ) (AP-10)
- covering index ใน MySQL: index ที่มีคอลัมน์ครบสำหรับ query (เห็น `Using index` ใน EXPLAIN) ไม่มี `INCLUDE` แยก ต้องใส่เป็นคอลัมน์ท้ายของ key

---

## MY-02 — อ่าน `EXPLAIN` / `EXPLAIN ANALYZE`

| คอลัมน์ / ค่า | ความหมาย |
|---|---|
| `type`: `const` / `eq_ref` / `ref` / `range` | ดี (ใช้ index หาเฉพาะช่วง) |
| `type`: `index` | อ่านทั้ง index |
| `type`: `ALL` | อ่านทั้งตาราง |
| `key` / `key_len` | index ที่ใช้ และใช้ไปกี่คอลัมน์ของ composite index (เช็ก leftmost prefix, IX-11) |
| `rows` × `filtered` | ประมาณจำนวนแถวที่อ่าน / ผ่านเงื่อนไข |
| `Extra`: `Using filesort` | ต้อง sort (ไม่มี index ที่เรียงตาม ORDER BY) |
| `Extra`: `Using temporary` | ใช้ตารางชั่วคราว (GROUP BY / DISTINCT / UNION) |
| `Extra`: `Using index` | covering index ไม่ต้องกลับไปอ่านตาราง |

- `EXPLAIN ANALYZE` (8.0.18+) รัน query จริงและแสดงเวลา / แถวจริง (ระวังกับคำสั่งที่เขียนข้อมูล)
- `EXPLAIN FORMAT=TREE` อ่านง่ายกว่าแบบตาราง

---

## MY-03 — กับดักที่พบบ่อย

- **Implicit conversion:** เทียบคอลัมน์ `VARCHAR` กับตัวเลข (`WHERE phone = 0812345678`) → แปลงทุกแถว ใช้ index ไม่ได้และผลอาจผิด → ส่งเป็น string ให้ตรง type (IX-03)
- **Charset / collation ไม่ตรงกันตอน JOIN** (`utf8mb3` vs `utf8mb4`, `utf8mb4_general_ci` vs `utf8mb4_0900_ai_ci`) → index ใช้ไม่ได้ (AP-10) → ตั้งทั้ง database เป็น `utf8mb4` + collation เดียว
- `utf8` (= `utf8mb3`) เก็บ emoji / อักขระ 4 byte ไม่ได้ → ใช้ `utf8mb4` เสมอ
- **`ONLY_FULL_GROUP_BY`** ต้องเปิดไว้ (default ใน 8.0) ไม่เช่นนั้นคอลัมน์ที่ไม่ได้ GROUP BY ได้ค่าแบบสุ่ม (FD-04)
- `sql_mode` ที่ไม่ strict ยอมให้ตัดข้อมูล / ใส่วันที่ `0000-00-00` เงียบๆ → ใช้ `STRICT_TRANS_TABLES`
- `IN (subquery)` / `NOT IN` และ derived table ใน MySQL เวอร์ชันเก่าถูก optimize แย่ (8.0 ดีขึ้นมาก แต่ยังต้องดู EXPLAIN) และ `NOT IN` + NULL ผิดเหมือนกัน (AP-05)
- `LIMIT 100000, 20` อ่านทิ้ง 100,000 แถว (AP-08) → keyset หรือ deferred join (`JOIN (SELECT id … LIMIT …) t USING (id)`)
- `ORDER BY RAND()` อ่าน + sort ทั้งตาราง

---

## MY-04 — Transaction และ lock ของ InnoDB

- isolation default คือ **Repeatable Read** (CC-01) และ `UPDATE` / `DELETE` / `SELECT … FOR UPDATE` ใช้ **next-key / gap lock** ล็อกช่วงที่สแกนผ่าน ไม่ใช่แค่แถวที่ตรงเงื่อนไข → เงื่อนไขที่ไม่มี index = ล็อกเกือบทั้งตาราง และเกิด deadlock ง่ายตอน insert พร้อมกัน → มี index ที่ตรงเงื่อนไข และพิจารณา Read Committed (ลด gap lock) ถ้าเข้าใจผลกระทบ
- `SELECT … FOR UPDATE SKIP LOCKED` / `NOWAIT` ใช้ทำ queue ได้ (8.0+, CC-05)
- `INSERT … ON DUPLICATE KEY UPDATE` สำหรับ upsert (CC-03) ระวังว่าเพิ่มค่า `AUTO_INCREMENT` แม้ไม่ได้ insert
- ดู deadlock ล่าสุด: `SHOW ENGINE INNODB STATUS` (หัวข้อ LATEST DETECTED DEADLOCK)
- DDL ใหญ่: `ALGORITHM=INSTANT` (ห้ามใส่ `LOCK=NONE` คู่กัน จะ error; INSTANT รับแค่ `LOCK=DEFAULT`) หรือ `ALGORITHM=INPLACE, LOCK=NONE` หรือ gh-ost / pt-osc (MG-04) และ metadata lock (MDL) ทำให้เกิดคิวค้างแบบเดียวกับ PostgreSQL ถ้ามี transaction เปิดค้างบนตารางนั้น

---

## MY-05 — ค่าตั้งและการดูแล

- `innodb_buffer_pool_size`: บน server ที่ทำงาน database อย่างเดียว มักตั้งราว 50–75% ของ RAM (บริการ cloud ตั้งให้แล้ว)
- slow query log (`slow_query_log`, `long_query_time`) + `performance_schema` / `sys` schema (`sys.statements_with_full_table_scans`, `sys.schema_unused_indexes`) เพื่อหา query / index ที่มีปัญหา (IX-08)
- statistics: `ANALYZE TABLE` หลังข้อมูลเปลี่ยนมาก และ histogram (`ANALYZE TABLE t UPDATE HISTOGRAM ON col`) สำหรับคอลัมน์ที่ไม่มี index แต่ใช้กรอง
- replication lag และ read-after-write ใช้หลักเดียวกับ OP-03
