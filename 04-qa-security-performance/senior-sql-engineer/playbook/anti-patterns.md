# 🚫 SQL Anti-Pattern Playbook

> ส่วนหนึ่งของสกิล `senior-sql-engineer` — เปิดเมื่อรีวิว query / โค้ดที่เรียก database

ใช้เป็นรายการตรวจเมื่อรีวิว SQL ทุกข้อต้อง **ยืนยันด้วย EXPLAIN / ตัวเลขจริง** ก่อนสรุปว่าเป็นปัญหา และต้องบอก **ข้อยกเว้น** ไม่ใช่กฎตายตัว

## AP-01 — Correlated Subquery ใน SELECT แทน JOIN

```sql
-- ❌ ดึงชื่อแผนกด้วย subquery ต่อแถว
SELECT E.EmpName,
       (SELECT D.DeptName FROM Departments D WHERE D.DeptID = E.DeptID) AS Department
FROM Employees E;

-- ✅ เชื่อมด้วย JOIN
SELECT E.EmpName, D.DeptName
FROM Employees E
LEFT JOIN Departments D ON D.DeptID = E.DeptID;
```

- **ปัญหาจริง:** subquery ใน SELECT ถูกประเมิน "ต่อแถว" ถ้า optimizer แปลงเป็น join ไม่ได้ (PostgreSQL มักรันเป็น SubPlan ต่อแถว) ข้อมูลยิ่งเยอะยิ่งช้า และอ่านยากเมื่อมีหลายคอลัมน์
- **อย่าอธิบายผิด:** นี่ **ไม่ใช่** N+1 แบบที่แอปยิง 10,001 query ข้ามเครือข่าย — ทั้งหมดยังเป็น query เดียว และ SQL Server มักแปลงเป็น join ให้อัตโนมัติ ต้องดู execution plan ก่อนสรุปว่าช้า
- **ระวังความหมายเปลี่ยน:** scalar subquery จะ **error** ถ้าเจอมากกว่า 1 แถว แต่ JOIN จะ **ทำให้แถวซ้ำ** — ก่อนเปลี่ยนต้องยืนยันว่าฝั่งที่ join เป็น unique (เช่น PK)
- ใช้ `LEFT JOIN` เมื่อต้องการเก็บแถวที่ไม่มีคู่ (พฤติกรรมเดียวกับ subquery ที่คืน NULL) ใช้ `INNER JOIN` เมื่อต้องการเฉพาะแถวที่มีคู่

## AP-02 — N+1 จริง (ยิง query ในลูปจากแอป / ORM)

```ts
// ❌ 1 query + 1 query ต่อแถว — ยิงข้ามเครือข่าย N+1 ครั้ง
const emps = await db.employee.findMany();
for (const e of emps) e.dept = await db.department.findUnique({ where: { id: e.deptId } });

// ✅ query เดียวด้วย join / include หรือดึงทีเดียวด้วย IN
const emps = await db.employee.findMany({ include: { department: true } });
```

- นี่คือ N+1 ตัวจริง: ต้นทุนหลักคือ **round-trip ต่อ query** (latency × N) — แก้ด้วย JOIN, `include` / eager loading, หรือ `WHERE id IN (...)` แล้วจับคู่ในหน่วยความจำ
- ตรวจด้วยการเปิด query log ของ ORM แล้วนับจำนวน query ต่อ 1 request

## AP-03 — `COUNT(*)` เพื่อเช็กว่า "มีข้อมูลไหม"

```sql
-- ❌ นับทุกแถวที่ตรงเงื่อนไข ทั้งที่อยากรู้แค่ว่ามีหรือไม่
IF (SELECT COUNT(*) FROM Users WHERE Email = @email) > 0 ...

-- ✅ หยุดทันทีที่เจอแถวแรก
IF EXISTS (SELECT 1 FROM Users WHERE Email = @email) ...
-- PostgreSQL: SELECT EXISTS (SELECT 1 FROM users WHERE email = $1);
```

- `COUNT(*)` ต้องนับให้ครบทุกแถวที่ตรงเงื่อนไข ส่วน `EXISTS` หยุดเมื่อเจอแถวแรก ยิ่งตาราง/ผลลัพธ์ใหญ่ยิ่งต่างมาก
- SQL Server บางกรณีแปลงรูปแบบ `COUNT(*) > 0` เป็น EXISTS ให้เอง แต่ไม่ควรพึ่ง — `EXISTS` สื่อเจตนาชัดกว่าและเร็วในทุก database
- ใช้ `COUNT` เมื่อ **ต้องการจำนวนจริง** เท่านั้น
- ฝั่ง ORM เช่นกัน: ใช้ `findFirst` / `exists` ไม่ใช่ `count() > 0` หรือดึงทั้ง list แล้วเช็ก `.length`

## AP-04 — IDOR: query ด้วย id ที่ผู้ใช้ส่งมาอย่างเดียว

```sql
-- ❌ ใครเปลี่ยน ?id=10 เป็น ?id=11 ก็เห็นบิลคนอื่น
SELECT * FROM bills WHERE id = $1;

-- ✅ ผูกกับเจ้าของที่ได้จาก session / token ฝั่ง server เสมอ
SELECT id, total, created_at
FROM bills
WHERE id = $1
  AND owner_user_id = $2;   -- $2 = user id จาก session ห้ามรับจาก request
```

- `owner_user_id` ต้องมาจาก **session / token ที่ server ตรวจแล้ว** — ถ้ารับจาก query string / body ก็ปลอมได้เหมือนเดิม
- ไม่เจอ → ตอบ **404** (ไม่บอกว่ามีบิลนี้อยู่แต่ไม่ใช่ของคุณ)
- ใช้กับ **ทุก** query ที่อ่าน / แก้ / ลบข้อมูลของผู้ใช้ รวม `UPDATE` / `DELETE` (`WHERE id = $1 AND owner_user_id = $2` แล้วเช็กจำนวนแถวที่ถูกแก้)
- ถ้าผู้ดูแลระบบต้องเห็นของทุกคน ให้แยกเส้นทางที่ตรวจ role ชัดเจน
- PostgreSQL / Supabase: เสริมด้วย **Row Level Security** เป็นชั้นป้องกันที่สอง (แต่ยังต้องเช็กในแอปด้วย)
- เลี่ยง `SELECT *` — เลือกเฉพาะคอลัมน์ที่ต้องส่งออกไป
- ช่องโหว่นี้เป็นเรื่อง authorization ถ้าเจอในการรีวิวให้จัดเป็น 🔴 Critical และแนะนำส่งต่อ `security-engineer`
