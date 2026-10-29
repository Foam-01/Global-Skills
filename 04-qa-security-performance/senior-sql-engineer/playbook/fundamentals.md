# Fundamentals (FD): พื้นฐานที่ต้องแม่นก่อนจูน

บทนี้คือพื้นฐานที่ query "ผิดแบบเงียบๆ" มักมาจาก ใช้ทั้งตอนเขียน query ใหม่และตอนรีวิว (อ้างอิงพฤติกรรมตามมาตรฐาน SQL + เอกสาร PostgreSQL / SQL Server / MySQL)

---

## FD-01 — ลำดับการประมวลผลเชิงตรรกะของ SELECT

เขียน `SELECT … FROM … WHERE …` แต่ database ประมวลผลตามตรรกะดังนี้:

```text
FROM / JOIN → WHERE → GROUP BY → HAVING → SELECT (window function คำนวณตรงนี้) → DISTINCT → ORDER BY → OFFSET / LIMIT (TOP)
```

ผลที่ตามมา:
- `WHERE` ใช้ alias จาก `SELECT` ไม่ได้ และกรองผลของ aggregate หรือ window function ไม่ได้ ต้องใช้ `HAVING` หรือ subquery / CTE ครอบ
- `ORDER BY` ใช้ alias ได้ เพราะทำหลัง `SELECT`
- `WHERE` กรอง **ก่อน** `GROUP BY` (ลดแถวก่อนรวม ถูกกว่า) ส่วน `HAVING` กรอง **หลัง** รวมแล้ว: เงื่อนไขที่ไม่เกี่ยวกับ aggregate ควรอยู่ใน `WHERE`
- `TOP` / `LIMIT` ที่ไม่มี `ORDER BY` = ได้แถวไหนก็ได้ (IX-04)
- นี่คือลำดับ **เชิงตรรกะ** ส่วน optimizer จะทำงานจริงลำดับไหนก็ได้ถ้าผลเท่ากัน (เช่นดันเงื่อนไขลงไปก่อน JOIN)

---

## FD-02 — NULL และตรรกะสามค่า (TRUE / FALSE / UNKNOWN)

- `NULL = NULL` ได้ **UNKNOWN** ไม่ใช่ TRUE และ `WHERE` เก็บเฉพาะแถวที่เป็น TRUE ต้องใช้ `IS NULL` / `IS NOT NULL` (หรือ `IS [NOT] DISTINCT FROM` ใน PostgreSQL / SQL Server 2022+, `<=>` ใน MySQL)
- `col <> 'x'` **ไม่คืนแถวที่ col เป็น NULL** เป็นต้นเหตุของรายงานที่ "แถวหาย" ถ้าต้องการให้รวมด้วย เขียน `col <> 'x' OR col IS NULL`
- `NOT IN (subquery ที่มี NULL)` ได้ 0 แถวเสมอ (AP-05) → ใช้ `NOT EXISTS`
- Aggregate ข้าม NULL: `COUNT(col)` ไม่นับ NULL แต่ `COUNT(*)` นับทุกแถว · `AVG(col)` หารด้วยจำนวนที่ไม่ NULL (ไม่ใช่จำนวนแถว) · `SUM` ของแถวที่เป็น NULL ทั้งหมดได้ **NULL** ไม่ใช่ 0 → `COALESCE(SUM(x), 0)`
- `UNIQUE` กับ NULL: PostgreSQL / MySQL ยอมให้มี NULL ซ้ำได้หลายแถว (PostgreSQL 15+ มี `NULLS NOT DISTINCT`) แต่ **SQL Server ยอมให้มี NULL ได้แค่แถวเดียว** ถ้าอยากให้ NULL ซ้ำได้ใช้ filtered unique index `WHERE col IS NOT NULL`
- การเรียง: PostgreSQL ถือว่า NULL มากที่สุด (อยู่ท้ายใน ASC) แต่ SQL Server / MySQL ถือว่าน้อยที่สุด (อยู่ต้น) ถ้าลำดับสำคัญให้เขียน `NULLS LAST` (PostgreSQL) หรือ `ORDER BY CASE WHEN col IS NULL THEN 1 ELSE 0 END, col`
- `CONCAT(a, NULL)` ได้ค่า a แต่ `a || NULL` (PostgreSQL) และ `a + NULL` (SQL Server) ได้ NULL

---

## FD-03 — JOIN: ความหมายที่ต้องแม่น

| JOIN | ได้อะไร | กับดัก |
|---|---|---|
| `INNER` | แถวที่จับคู่ได้ทั้งสองฝั่ง | แถวที่ไม่มีคู่หายเงียบ |
| `LEFT` | ทุกแถวฝั่งซ้าย + คู่ (ไม่มีคู่ = NULL) | เงื่อนไขของตารางขวาใน `WHERE` ทำให้กลายเป็น INNER → ย้ายไปไว้ใน `ON` (AP-06) |
| `FULL` | ทุกแถวทั้งสองฝั่ง | ใช้เทียบ / กระทบยอดสองแหล่ง |
| `CROSS` | ทุกคู่ (m × n) | ลืมเงื่อนไข JOIN = แถวระเบิด |
| Semi (`EXISTS`, `IN`) | แถวซ้ายที่ "มี" คู่ **ไม่ซ้ำ** | ใช้ JOIN แทน EXISTS แล้วแถวซ้ำ ต้อง `DISTINCT` ปิด (ผิดที่ต้นเหตุ) |
| Anti (`NOT EXISTS`) | แถวซ้ายที่ "ไม่มี" คู่ | `NOT IN` + NULL (AP-05) |

- **Fan-out:** JOIN 1-ต่อ-หลายแล้ว `SUM` ฝั่ง 1 = ยอดเกิน (AP-06) → รวมฝั่งหลายก่อนใน subquery แล้วค่อย JOIN
- **JOIN ด้วยคอลัมน์ที่ type / collation ต่างกัน** → แปลงทุกแถว ใช้ index ไม่ได้ (AP-10)
- `LATERAL` (PostgreSQL / MySQL 8) / `CROSS APPLY` (SQL Server): ใช้กับโจทย์ "N รายการล่าสุดต่อกลุ่ม" ร่วมกับ index `(group_id, created_at DESC)` จะ seek ทีละกลุ่ม

---

## FD-04 — GROUP BY, aggregate และ window function

- ทุกคอลัมน์ใน `SELECT` ที่ไม่ใช่ aggregate ต้องอยู่ใน `GROUP BY` (MySQL ที่ปิด `ONLY_FULL_GROUP_BY` ยอมให้ผ่านแต่ได้ค่าแบบสุ่ม → เปิดไว้เสมอ)
- กรองบางแถวใน aggregate: `COUNT(*) FILTER (WHERE status = 'paid')` (PostgreSQL) หรือ `SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END)` (ทุก database) แทนการ query แยกหลายรอบ
- **Window function** คำนวณข้ามแถวโดยไม่ยุบแถว: `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `LAG/LEAD`, `SUM() OVER (...)`

```sql
-- latest order per customer (top-1 per group)
SELECT * FROM (
  SELECT o.*, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC, id DESC) AS rn
  FROM orders o
) t WHERE rn = 1;
-- PostgreSQL alternative: SELECT DISTINCT ON (customer_id) ... ORDER BY customer_id, created_at DESC
-- index: (customer_id, created_at DESC, id DESC)
```

- ⚠️ `SUM(x) OVER (ORDER BY d)` ใช้ frame default `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` → แถวที่ `d` เท่ากันได้ยอดสะสมเท่ากัน ถ้าต้องการทีละแถวให้ระบุ `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` (และใน SQL Server `ROWS` เร็วกว่า `RANGE` มาก)
- `ROW_NUMBER()` ต้องมี tie-breaker ใน `ORDER BY` เสมอ ไม่เช่นนั้นผลไม่คงที่ (เหมือน AP-08)

---

## FD-05 — Normalization แบบใช้งานจริง และเมื่อไหร่ควร denormalize

- **1NF:** หนึ่งช่องหนึ่งค่า ห้ามเก็บ `"1,5,9"` ในคอลัมน์เดียว (ค้นด้วย index ไม่ได้, FK ไม่ได้) → ตารางเชื่อม (many-to-many)
- **2NF / 3NF:** ข้อมูลแต่ละอย่างเก็บที่เดียว (ชื่อลูกค้าอยู่ที่ customers ไม่ใช่ทุกแถวของ orders) แก้ที่เดียว ไม่ขัดแย้งกัน
- **ข้อยกเว้นที่ถูกต้อง (ไม่ใช่ denormalize):** ค่าที่ต้อง "แช่แข็ง ณ เวลานั้น" เช่น `order_items.unit_price` และที่อยู่จัดส่งของออเดอร์ ต้องคัดลอกเก็บ ไม่ใช่ JOIN ไปราคาปัจจุบัน
- **Denormalize เพื่อความเร็ว** (ยอดรวม, จำนวนคอมเมนต์, ตาราง summary) ทำได้เมื่อ **วัดแล้ว** ว่าจำเป็น และต้องมีวิธีทำให้ตรงกันเสมอ: อัปเดตใน transaction เดียวกัน, trigger, หรือ job คำนวณใหม่ + reconcile; materialized view (PostgreSQL ต้อง `REFRESH`, ใช้ `CONCURRENTLY` ได้ถ้ามี unique index) / indexed view (SQL Server)
- EAV (ตาราง key / value ทั่วไป) และ "ใส่ทุกอย่างใน JSON" ทำให้ validate, index และ query ยาก → ใช้คอลัมน์จริงกับข้อมูลที่ query / กรองบ่อย และใช้ JSON(B) กับส่วนที่ยืดหยุ่นจริงๆ (PG-04)

---

## FD-06 — Constraint คือด่านสุดท้ายของความถูกต้อง

ตรวจในแอปอย่างเดียวไม่พอ (มีหลาย service, script, คนแก้ตรงใน DB, race condition) ให้ database บังคับด้วย:

| Constraint | กันอะไร |
|---|---|
| `NOT NULL` | ค่าว่างที่ไม่ควรว่าง |
| `UNIQUE` | ข้อมูลซ้ำ **รวมถึงกรณีสอง request พร้อมกัน** (ตรวจ "มีหรือยัง" ในแอปแล้ว insert = race condition, CC-03) |
| `CHECK` | ค่าผิดกติกา (`qty >= 0`, `price >= 0`, `status IN (...)`, `end_at > start_at`) |
| `FOREIGN KEY` | ข้อมูลกำพร้า + ต้องมี index ฝั่งลูก (IX-09) |
| Exclusion constraint (PostgreSQL) | ช่วงเวลาทับกัน เช่น ห้องประชุม / คิวจองซ้อน: `EXCLUDE USING gist (room_id WITH =, during WITH &&)` (ต้องใช้ extension `btree_gist`) |

- เลือก `ON DELETE` ให้ตั้งใจ: `NO ACTION` (default ของ PostgreSQL / SQL Server / MySQL ทำงานคล้าย `RESTRICT` ต่างกันเมื่อ constraint เป็น deferrable ใน PostgreSQL), `CASCADE` (ลบลูกตาม: ระวังลบข้อมูลเป็นล้านแถวโดยไม่ตั้งใจ), `SET NULL`
- Soft delete (`deleted_at`) ทำให้ `UNIQUE (email)` ชนกับแถวที่ลบไปแล้ว → partial / filtered unique index `WHERE deleted_at IS NULL` (IX-07)
