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

## AP-05 — `NOT IN` กับ subquery ที่มี NULL: ไม่ error แต่ได้ผลลัพธ์ว่าง

```sql
-- ❌ ถ้า DimCustomerBlacklist.CustomerKey มี NULL แม้แต่แถวเดียว → ได้ 0 แถวเสมอ
SELECT COUNT(1) AS CustomerCount
FROM DimCustomer
WHERE CustomerKey NOT IN (SELECT CustomerKey FROM DimCustomerBlacklist);
-- ผลจริง: 0  (ควรได้ 18,385)

-- ✅ NOT EXISTS
SELECT COUNT(1) AS CustomerCount
FROM DimCustomer C
WHERE NOT EXISTS (
  SELECT 1 FROM DimCustomerBlacklist B WHERE B.CustomerKey = C.CustomerKey
);
-- ผลจริง: 18,385
```

**ทำไม:** `x NOT IN (a, b, NULL)` = `x <> a AND x <> b AND x <> NULL` และ `x <> NULL` ได้ **UNKNOWN** (ไม่ใช่ TRUE) ทั้งเงื่อนไขจึงไม่มีทางเป็น TRUE → ทุกแถวถูกตัดทิ้ง

**ทางเลือกที่ถูกต้อง:**
- `NOT EXISTS` (แนะนำ) — database ส่วนใหญ่ทำเป็น anti-join ได้ดี
- `LEFT JOIN … WHERE B.CustomerKey IS NULL` — ให้ผลเหมือน `NOT EXISTS`
- ถ้าจำเป็นต้องใช้ `NOT IN` ให้กรอง NULL ใน subquery: `… NOT IN (SELECT CustomerKey FROM DimCustomerBlacklist WHERE CustomerKey IS NOT NULL)`

**"ปลอดภัย 100%" มีข้อยกเว้น — ความหมายของ NOT EXISTS ต่างจาก NOT IN ที่กรอง NULL แล้ว 1 จุด:**
- แถวในตารางหลัก (`DimCustomer`) ที่ `CustomerKey` เป็น **NULL** จะ **ถูกนับ** ใน `NOT EXISTS` (เพราะหาคู่ไม่เจอ) แต่ **ไม่ถูกนับ** ใน `NOT IN` แบบกรอง NULL — ส่วนใหญ่เป็นผลที่ต้องการ แต่ต้องตรวจให้ตรงกับกฎธุรกิจ

**แก้ที่ต้นเหตุด้วย:**
- คอลัมน์ที่ไม่ควรว่าง (เช่น key ใน blacklist) ควรเป็น `NOT NULL` + foreign key — ถ้า NULL หลุดเข้าไปได้ นั่นคือปัญหา data integrity (ดูหมวด 07 ใน SKILL.md)
- `IN` แบบบวก (ไม่มี NOT) ไม่มีปัญหานี้ — NULL แค่ไม่ match
- ระวังรายการค่าจากแอปด้วย เช่น `WHERE id NOT IN (:ids)` ถ้าอาร์เรย์มี `null` จะเกิดปัญหาเดียวกัน
- **เมื่อรีวิว:** เจอ `NOT IN (subquery)` บนคอลัมน์ที่ nullable ให้จัดเป็นบั๊กความถูกต้อง (High) ไม่ใช่แค่เรื่อง style — และทุกครั้งที่แก้ query ให้เทียบจำนวนแถวก่อน/หลัง

## AP-06 — RIGHT JOIN ปนกับ LEFT JOIN และกับดักของ LEFT JOIN หลายชั้น

**แนวทางเขียน:** ใช้ `LEFT JOIN` ทิศทางเดียวทั้ง query — ตารางหลัก (ตารางที่ต้องการ "เก็บทุกแถว") อยู่ใน `FROM` บนสุด แล้วต่อตารางรองลงมา อ่านจากบนลงล่างแล้วรู้ทันทีว่าผลลัพธ์อิงตารางไหน ทุก `RIGHT JOIN` เขียนเป็น `LEFT JOIN` ได้โดยสลับลำดับตาราง

### ⚠️ เปลี่ยน RIGHT เป็น LEFT ≠ แก้แค่คำว่า RIGHT

```sql
-- เดิม: ... LEFT JOIN Orders o ... RIGHT JOIN Shippers s ON o.ShipperID = s.ShipperID ...
-- RIGHT JOIN Shippers = "เก็บ shipper ทุกเจ้า" แม้ไม่มี order

-- ❌ แค่เปลี่ยนคำ → shipper ที่ไม่มี order หายไป (ผลลัพธ์เปลี่ยน)
FROM Customers c
LEFT JOIN Orders o   ON o.CustomerID = c.CustomerID
LEFT JOIN Shippers s ON s.ShipperID  = o.ShipperID
```

- ต้อง **ย้ายตารางที่ต้องการเก็บทุกแถวขึ้นไปเป็น `FROM`** แล้วจัดลำดับใหม่ ไม่ใช่แค่เปลี่ยนคำ
- query ที่มี RIGHT ปน LEFT หลายตัว มักไม่มีใครรู้ว่าตั้งใจให้เก็บทุกแถวของตารางไหน — **ถามผู้ใช้ว่า "รายงานนี้ต้องแสดงทุกอะไร"** (ลูกค้าทุกคน? shipper ทุกเจ้า?) แล้วเขียนใหม่ตามคำตอบ
- ก่อน / หลังแก้ **เทียบจำนวนแถวและตัวอย่างข้อมูล** ถ้าต่างกันต้องอธิบายได้ว่าทำไม

### กับดัก 1 — WHERE บนตารางฝั่งขวาทำให้ LEFT JOIN กลายเป็น INNER JOIN

```sql
-- ❌ ลูกค้าที่ไม่มี order หายหมด (o.Status เป็น NULL → ไม่ผ่าน WHERE)
FROM Customers c
LEFT JOIN Orders o ON o.CustomerID = c.CustomerID
WHERE o.Status = 'paid'

-- ✅ ย้ายเงื่อนไขของตารางฝั่งขวาไปไว้ใน ON
FROM Customers c
LEFT JOIN Orders o ON o.CustomerID = c.CustomerID AND o.Status = 'paid'
```

- เช่นเดียวกัน: ต่อ `INNER JOIN` กับตารางที่อยู่ "หลัง" LEFT JOIN (เช่น `LEFT JOIN Orders o … INNER JOIN Shippers s ON s.ShipperID = o.ShipperID`) จะตัดแถวที่ไม่มี order ทิ้งด้วย

### กับดัก 2 — LEFT JOIN หลายตาราง 1-ต่อ-หลาย ทำให้แถวซ้ำ (fan-out)

```sql
FROM Orders o
LEFT JOIN Payments p ON p.OrderID = o.OrderID   -- 1 order มีได้หลาย payment
LEFT JOIN OrderItems i ON i.OrderID = o.OrderID -- 1 order มีได้หลาย item
-- order ที่มี 2 payment × 3 item → ได้ 6 แถว → SUM(p.Amount) เกินจริง 3 เท่า
```

- ถ้าต้องรวมยอด ให้ **aggregate แต่ละตารางลูกก่อน** (subquery / CTE ที่ `GROUP BY OrderID`) แล้วค่อย join ผลรวม
- ห้ามแก้ด้วย `DISTINCT` / `SUM(DISTINCT …)` แบบไม่คิด — ซ่อนปัญหา และผิดเมื่อมีค่าซ้ำจริง

**เมื่อรีวิว:** เจอ RIGHT ปน LEFT → ขอให้เขียนใหม่เป็น LEFT ทิศเดียว (ระดับ Low ด้านความอ่านง่าย) · แต่เจอ WHERE บนตารางฝั่งขวา หรือ join 1-ต่อ-หลายหลายตัวแล้ว `SUM` → จัดเป็น **บั๊กความถูกต้อง (High)** · เงื่อนไข join ที่ดูแปลก (เช่น `Employees` join ด้วย `OrderID` แทน `o.EmployeeID = e.EmployeeID`) → ตรวจ schema ว่าความสัมพันธ์ถูกต้องหรือไม่

## AP-07 — ดึงข้อมูลทั้งหมดมากรอง / รวมยอดในโค้ดแอป และไม่เคยดู SQL ที่ ORM สร้าง

```ts
// ❌ ดึงออเดอร์ทุกแถวทุกคอลัมน์มาที่แอป แล้วกรองและรวมยอดด้วยลูป
const orders = await prisma.order.findMany();
const total = orders
  .filter(o => o.status === "paid" && o.createdAt >= start)
  .reduce((s, o) => s + o.amount, 0);

// ✅ ให้ database กรองและรวมยอด ส่งกลับมาแค่ผลลัพธ์
const { _sum } = await prisma.order.aggregate({
  where: { status: "paid", createdAt: { gte: start } },
  _sum: { amount: true },
});
```

- **ทำไมช้า:** ข้อมูลทุกแถวต้องอ่านจาก disk, ส่งผ่านเครือข่าย, แปลงเป็น object และกินหน่วยความจำของแอป — โตตามจำนวนข้อมูล ไม่ใช่ตามผลลัพธ์ที่ต้องการ · database ใช้ index กับเงื่อนไขที่อยู่ในแอปไม่ได้
- **หลัก:** กรอง (`WHERE`), เลือกคอลัมน์ (`select` / ไม่ใช้ `SELECT *`), เรียง + แบ่งหน้า (`ORDER BY` + `LIMIT`), นับ / รวมยอด (`COUNT`, `SUM`, `GROUP BY`) **ใน database** แล้วส่งมาเฉพาะสิ่งที่ใช้
- **ดู SQL ที่ ORM สร้างจริงเสมอ:** เปิด query log (Prisma: `log: ["query"]`, EF Core: `LogTo` / `ToQueryString()`, Sequelize: `logging`, Laravel: `DB::listen` / `toSql()`) — คำสั่งบรรทัดเดียวใน ORM อาจกลายเป็น query ขนาดใหญ่, หลาย query (N+1, AP-02) หรือดึงคอลัมน์เกินจำเป็น แล้วเอา SQL นั้นไปดู execution plan (EP-01)
- **ระวัง LINQ / ORM ที่ดูเหมือนกรองใน database แต่จริงไม่ใช่:** เช่นเรียก `.ToList()` / `AsEnumerable()` ก่อน `.Where()` ใน EF Core หรือใช้ฟังก์ชันที่ ORM แปลงเป็น SQL ไม่ได้ ทำให้ดึงทั้งตารางมากรองในหน่วยความจำ
- **ข้อยกเว้น:** logic ที่เขียนใน SQL ไม่ได้หรือซับซ้อนมาก ทำในแอปได้ แต่ให้ database กรองให้เหลือน้อยที่สุดก่อน
- **เมื่อรีวิว:** `findMany()` / `SELECT *` ที่ไม่มี `where` / `take` บนตารางที่โตได้ ตามด้วย `.filter` / `.reduce` / ลูปในแอป → แจ้งเป็นปัญหา performance (Medium–High ตามขนาดตาราง)

---

## AP-08 — Pagination ด้วย `OFFSET` หน้าลึกๆ → Keyset (Seek) Pagination

**ปัญหา:** `OFFSET n ROWS FETCH NEXT k ROWS ONLY` (หรือ `LIMIT k OFFSET n`) ไม่ได้ "กระโดด" ไปแถวที่ n database ต้อง **อ่านแล้วทิ้ง n แถวแรกทุกครั้ง** หน้า 1 เร็ว แต่หน้า 10,000 อ่านเป็นหมื่นๆ แถวเพื่อส่งคืน 20 แถว งานจึงโตตามความลึกของหน้า

```sql
-- ❌ หน้าลึก = อ่านทิ้ง (@Page-1)*@Size แถว
SELECT Id, Title, Score FROM Posts
ORDER BY Id
OFFSET (@Page - 1) * @Size ROWS FETCH NEXT @Size ROWS ONLY;

-- ✅ Keyset: จำ key สุดท้ายของหน้าก่อน แล้ว seek ต่อจากตรงนั้น (ใช้ B+Tree ตรงๆ, IX-12)
SELECT TOP (@Size) Id, Title, Score FROM Posts
WHERE Id > @LastId
ORDER BY Id;
```

**เรียงตามคอลัมน์ที่ไม่ unique (เช่น ProductName, CreatedAt):** ต้องมี tie-breaker ที่ unique ต่อท้ายเสมอ ไม่เช่นนั้นแถวที่ค่าเท่ากันจะหายหรือซ้ำระหว่างหน้า

```sql
-- PostgreSQL / MySQL 8: row value comparison
WHERE (product_name, product_id) > (@LastName, @LastId)
ORDER BY product_name, product_id
LIMIT @Size;

-- SQL Server (ไม่มี row value comparison)
WHERE ProductName > @LastName
   OR (ProductName = @LastName AND ProductID > @LastId)
ORDER BY ProductName, ProductID;
-- index: (ProductName, ProductID) + INCLUDE คอลัมน์ที่แสดง (IX-02, IX-11)
```

**เลือกใช้แบบไหน:**

| | OFFSET | Keyset |
|---|---|---|
| กระโดดไปหน้า N ตรงๆ | ✅ | ❌ (ได้แค่ ถัดไป / ก่อนหน้า) |
| ต้นทุนหน้าลึก | โตตาม N | คงที่ (seek) |
| ข้อมูลถูก insert / delete ระหว่างเปิดดู | แถวเลื่อน → ซ้ำ / หาย | เสถียร |
| เหมาะกับ | admin table ข้อมูลไม่มาก, หน้าตื้นๆ | feed, infinite scroll, API cursor, export ข้อมูลทั้งตาราง |

**สิ่งที่ต้องแก้ / เสริมจากคลิป (devhopsss B+Tree EP.07 + Q&A pagination):**
- ต้องมี `ORDER BY` เสมอ (ทั้งสองแบบ) และ `WHERE Id > @LastId` ใช้ได้เพราะ `Id` unique + มี index; ถ้า ID มีช่องโหว่ (ลบแถว) keyset ยังถูกต้อง ไม่ต้องกังวล
- ใช้ index ที่ตรงกับ `ORDER BY` เท่านั้น ถ้าเรียงตามคอลัมน์ที่ไม่มี index, keyset ก็ต้อง sort ทั้งตารางเหมือนกัน
- ส่ง cursor ให้ client แบบ opaque (เช่น base64 ของ `{name, id}`) แทนการให้ client ส่ง SQL ค่าเอง และตรวจ input ทุกครั้ง
- `COUNT(*)` เพื่อแสดง "ทั้งหมด N หน้า" บนตารางใหญ่ก็แพงพอๆ กับ scan; พิจารณาแสดงแค่ "ถัดไป" หรือใช้ค่าประมาณ
- ถ้าจำเป็นต้องใช้ OFFSET หน้าลึก ลดต้นทุนด้วย "deferred join": หา key ด้วย OFFSET บน index แคบๆ ก่อน แล้วค่อย JOIN กลับไปดึงคอลัมน์ที่เหลือ
