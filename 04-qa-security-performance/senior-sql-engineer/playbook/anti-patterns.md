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
WHERE ProductName >= @LastName                     -- seekable leading predicate
  AND (ProductName > @LastName OR ProductID > @LastId)
ORDER BY ProductName, ProductID;                    -- check the plan: expect an Index Seek, not a scan
-- index: (ProductName, ProductID) + INCLUDE คอลัมน์ที่แสดง (IX-02, IX-11)
```

**Feed สินค้าตามหมวด ใหม่ล่าสุดก่อน (คลิป keyset feed):** คลิปใช้ `INDEX (CategoryId, CreatedAt DESC) INCLUDE (Name, Price, Rating, SoldCount, Stock)` แล้ว seek ไปที่หมวด + ต่อจาก `CreatedAt` ของแถวสุดท้าย ถูกหลักแล้ว (`=` ก่อน แล้วคอลัมน์เรียง, IX-11) แต่ **`CreatedAt` ไม่ unique** สินค้าที่สร้างเวลาเดียวกันจะหาย / ซ้ำระหว่างหน้า ต้องใส่ `Id` เป็น tie-breaker ทั้งใน index และเงื่อนไข

```sql
-- index: (CategoryId, CreatedAt DESC, Id DESC) INCLUDE (Name, Price, Rating, SoldCount, Stock)
SELECT TOP (@Size) Id, Name, Price, CreatedAt
FROM Products
WHERE CategoryId = @Cat
  AND (CreatedAt < @LastCreatedAt
       OR (CreatedAt = @LastCreatedAt AND Id < @LastId))
ORDER BY CreatedAt DESC, Id DESC;
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

---

## AP-09 — "Stored Procedure เร็วกว่าเพราะเก็บ plan ไว้" (ความเชื่อเก่า) และเมื่อไหร่ควรใช้ SP จริง

**ความเชื่อที่ผิด:** ตั้งแต่ SQL Server 2005 query แบบ **parameterized** จากแอป / ORM (`sp_executesql`, `@p0`) ก็ถูกเก็บ plan ใน plan cache และนำกลับมาใช้เหมือน SP ทุกอย่าง ความเร็วต่อ query จึงแทบไม่ต่าง (จากโพสต์ devhopsss เรื่อง Stored Procedure ซึ่งสรุปได้ถูกต้อง)
- ข้อยกเว้น: SQL ที่ **ต่อ string ค่าเข้าไปตรงๆ** (`WHERE id = 5`, `WHERE id = 6` …) ได้ plan ใหม่ทุกค่า → plan cache บวม + เสีย CPU compile และเสี่ยง SQL injection แก้ด้วยการใช้ parameter ไม่ใช่ย้ายไป SP

**ที่ SP / function ฝั่ง database คุ้มจริง:**
1. **ลด round trip:** งานหลายขั้น (เช็กสต็อก → ตัดสต็อก → บันทึก order → เขียน log) จากแอปคุยกับ DB 4 รอบ; ใน SP คุยรอบเดียว และ transaction สั้นลง → ถือ lock สั้นลง → คนอื่นรอน้อยลง (มีผลมากเมื่อแอปกับ DB อยู่คนละ region)
2. **คุมสิทธิ์:** ให้แอปมีสิทธิ์ `EXECUTE` เฉพาะ SP แทนสิทธิ์ `UPDATE` ทั้งตาราง (PostgreSQL / Supabase: `SECURITY DEFINER` function + `SET search_path` + `REVOKE` จาก `PUBLIC` และระวังเพราะ bypass RLS)
3. งาน set-based ข้อมูลเยอะ ที่ถ้าทำในแอปต้องดึงข้อมูลออกมาก่อน (AP-07)

**ข้อเสียที่ต้องยอมรับ:** logic กระจายสองที่, ต้องเก็บ SP ใน migration ภายใต้ git (ห้ามแก้ตรงบน server), unit test ยากกว่า, CPU ของ database คือทรัพยากรที่ scale แพงที่สุด, และ **parameter sniffing**

**Parameter sniffing (เกิดกับ query parameterized ทุกแบบ ไม่ใช่เฉพาะ SP):** plan ถูกสร้างจากค่าพารามิเตอร์ของการรันครั้งแรก ถ้าครั้งแรกเป็นค่าที่มีแถวน้อย (seek + lookup) แล้วต่อมาเจอค่าที่มีแถวเป็นล้าน plan เดิมจะช้ามาก (หรือกลับกัน)
- อาการ: query เดิม "บางทีเร็ว บางทีช้า" และหายเองหลัง restart / recompile
- แก้ตามลำดับ: ตรวจ index ให้เหมาะก่อน → `OPTION (RECOMPILE)` เฉพาะ query ที่รันไม่บ่อย → `OPTIMIZE FOR (@p UNKNOWN)` / ค่าที่เป็นตัวแทน → Query Store บังคับ plan · SQL Server 2022 มี Parameter Sensitive Plan optimization ช่วยอัตโนมัติบางกรณี

**สรุปกฎ:** CRUD ทั่วไปใช้ ORM / parameterized query; งานหลายขั้นที่ต้อง atomic, คุมสิทธิ์เข้ม หรือประมวลผลข้อมูลจำนวนมาก ใช้ SP / database function

---

## AP-10 — JOIN ด้วย key ที่ต้องแปลงก่อนเทียบ (format ไม่ตรง, `IN (...)` หลายรูปแบบ, `COLLATE`, `CONCAT`)

**ตัวอย่างจริง (คลิป devhopsss MySQL EP.01–03):** ระบบสองฝั่งเก็บ GUID คนละรูปแบบ (`abc…`, `{abc…}`, `{ABC…}`) จึงเขียน JOIN แบบนี้

```sql
JOIN order_master om
  ON om.order_ref_guid COLLATE utf8mb4_general_ci IN (
       oi.uuid COLLATE utf8mb4_general_ci,
       CONCAT('{', oi.uuid, '}') COLLATE utf8mb4_general_ci,
       CONCAT('{', LOWER(oi.uuid), '}') COLLATE utf8mb4_general_ci)
LEFT JOIN zone_master zm
  ON zm.zone_code COLLATE utf8mb4_general_ci
   = CONCAT(om.province_code, om.district_code, om.subdistrict_code) COLLATE utf8mb4_general_ci
```

ทุกเงื่อนไขครอบคอลัมน์ด้วย `COLLATE` / `CONCAT` / `LOWER` → index บน `order_ref_guid` / `zone_code` ใช้ seek ไม่ได้ (non-sargable แบบ IX-03 แต่เกิดใน `ON`) → join แบบ scan × scan ได้ข้อมูลครบใช้ราว 24 วินาที คลิปแก้ที่ต้นเหตุแล้วเร็วขึ้นหลายเท่า

**แก้ที่ต้นเหตุ ไม่ใช่ใน query:**
1. **ทำข้อมูลให้เป็นรูปแบบเดียว (canonical) ตอนเขียน:** เลือกรูปแบบ GUID เดียว (เช่น ตัวเล็ก ไม่มีวงเล็บ หรือดีกว่านั้นคือ `BINARY(16)` / `uuid` type ดู IX-10) แล้ว migrate ข้อมูลเก่า + validate ที่ API / constraint
2. **collation และ charset ของคอลัมน์ที่ JOIN กันต้องตรงกัน** ตั้งแต่ตอนสร้างตาราง ถ้าต่างกัน MySQL ต้องแปลงฝั่งใดฝั่งหนึ่ง (เห็นใน `EXPLAIN` / warning) ตรวจด้วย `information_schema.COLUMNS`
3. **key ที่ต้องประกอบจากหลายคอลัมน์:** JOIN ด้วยหลายคอลัมน์ตรงๆ (`ON zm.province = om.province AND zm.district = … AND …`) + composite index (IX-11) แทน `CONCAT` หรือเพิ่ม generated column แบบ `STORED` + index (MySQL `GENERATED ALWAYS AS (...) STORED`, PostgreSQL `GENERATED ALWAYS AS (...) STORED`, SQL Server persisted computed column)
4. ระหว่างรอ migrate: functional index (MySQL 8.0.13+ `INDEX ((LOWER(col)))`, PostgreSQL expression index) ใช้ได้ถ้า expression ใน query ตรงกับ index ทุกตัวอักษร แต่เป็นแค่ทางชั่วคราว
5. วัดด้วย `EXPLAIN ANALYZE` (MySQL 8.0.18+) ก่อน / หลัง และตรวจว่า **จำนวนแถวเท่าเดิม** (การ normalize อาจทำให้แถวที่เคย match / ไม่ match เปลี่ยน)

**ผลหลังแก้ (คลิป MySQL EP.04):** เปลี่ยน `uuid` / `order_ref_guid` จาก `VARCHAR` เป็น `BINARY(16)` รูปแบบเดียว แล้ว JOIN กันตรงๆ ใช้ `BIN_TO_UUID()` แปลงเฉพาะตอนแสดงผลใน SELECT (ไม่ใช่ใน `ON` / `WHERE`) → MySQL Workbench แสดง **Duration 0.031 sec / Fetch 6.875 sec**
- อ่านให้ถูก: **Duration** คือเวลาที่ database ประมวลผล query (ตัวที่แก้แล้วเร็วจริง) ส่วน **Fetch** คือเวลาส่งแถวทั้งหมดมาที่ client ถ้า fetch ยังนาน ปัญหาเหลืออยู่ที่จำนวนแถว / ขนาดข้อมูลที่ส่ง (เหมือน IX-06) → แบ่งหน้า (AP-08) หรือเลือกเฉพาะคอลัมน์
- ค่าที่ส่งเข้ามาค้นหาให้แปลงฝั่งค่าคงที่: `WHERE uuid = UUID_TO_BIN(?)` (UUID v1 ใช้ `UUID_TO_BIN(?, 1)` เพื่อสลับไบต์เวลาให้เรียง ส่วน UUID v7 ใช้ `UUID_TO_BIN(?)` flag 0 เพราะเรียงตามเวลาอยู่แล้ว และต้องใช้ flag เดียวกันทั้งตอนเขียนและอ่าน)

**`IN (...)` ไม่ได้ผิดเสมอ:** `WHERE id IN (1, 2, 3)` กับคอลัมน์ที่มี index ยัง seek ได้ปกติ ปัญหาในคลิปคือการครอบ **คอลัมน์** ด้วยฟังก์ชันและการใช้ `IN` เป็นเงื่อนไข JOIN หลายรูปแบบ ไม่ใช่ตัว `IN` เอง (ชื่อคลิป "อย่าใช้ IN ในการ join" จึงกว้างเกินไป)

---

## AP-11 — ใช้ `UNION` ทั้งที่ข้อมูลไม่มีทางซ้ำ → `UNION ALL`

**ปัญหา (โพสต์ devhopsss Query Tuning EP.01):** `UNION` = รวมผลแล้ว **ลบแถวที่ซ้ำกันทุกคอลัมน์** ซึ่ง database ต้อง sort หรือ hash ผลทั้งหมด (เห็นเป็น `Sort (Distinct Sort)` หรือ `Hash Match (Aggregate)` ใน plan) ส่วน `UNION ALL` ต่อผลเฉยๆ
- ตาราง A 1 ล้าน + B 1 ล้านแถว: `UNION ALL` อ่าน 2 ล้านแถวแล้วส่งออก · `UNION` อ่าน 2 ล้าน + เรียง 2 ล้าน + ขอ memory grant ก้อนใหญ่ + ถ้าไม่พอ spill ลง tempdb
- `UNION` ต้อง **รอครบทุกแถวก่อนคืนแถวแรก** จึงทำลาย `TOP (10)` / pagination ที่ครอบอยู่ด้านนอก ส่วน `UNION ALL` คืนแถวได้ทันที

**เปลี่ยนเป็น `UNION ALL` ได้ทันทีเมื่อ:**
1. แต่ละส่วนมี **PK / ID ที่ unique ข้ามทุกส่วน** ใน SELECT (ระวัง: ตารางแยกปีที่ใช้ IDENTITY แยกกันอาจได้ ID ชนกันได้ แต่ถ้าคอลัมน์อื่นต่างกัน `UNION` ก็ไม่ได้ลบอยู่แล้ว)
2. แบ่งช่วงข้อมูลไม่ทับกัน: `Orders_2024` + `Orders_2025`, หรือ `WHERE Status = 'PAID'` กับ `WHERE Status = 'CANCELLED'`
3. ตอบตัวเองได้ว่า "ไม่มีทางซ้ำ" ถ้าไม่แน่ใจให้ตรวจ ไม่ใช่ใส่ `UNION` กันไว้ก่อน

**ใช้ `UNION` จริงเมื่อ:** รวมรายชื่อจากหลายแหล่งที่คนซ้ำได้ (ลูกค้าจากระบบ A + B), ข้อมูล import ที่คุมไม่ได้ และต้องการรายการไม่ซ้ำจริงๆ
- ⚠️ `UNION` / `DISTINCT` มอง `NULL` สองตัวว่า "ซ้ำกัน" (ต่างจาก `WHERE a = b` ที่ `NULL = NULL` ไม่เป็นจริง)
- ⚠️ ถ้าซ้ำเพราะ JOIN ผิด / เงื่อนไขทับกัน ให้แก้ที่ต้นเหตุ (AP-06 fan-out) แทนการเอา `UNION` / `DISTINCT` มากลบ
- ถ้าต้องการไม่ซ้ำแค่บางคอลัมน์ (เช่น email) `UNION` ไม่ช่วย ต้องใช้ `ROW_NUMBER() OVER (PARTITION BY email ORDER BY …)` เลือกแถวที่ต้องการ

**รีวิวโค้ด:** เจอ `UNION` ให้ถาม 3 ข้อ (ซ้ำได้จริงไหม · มี PK ใน SELECT ไหม · ถ้าซ้ำ ซ้ำเพราะอะไร) และเปิด plan หา Distinct Sort / Hash Aggregate

---

## AP-12 — CTE ที่ถูกอ้างหลายครั้ง, Temp Table vs Table Variable vs CTE

**จากโพสต์ devhopsss เรื่อง Temp Table (สรุปส่วนใหญ่ถูกต้อง) + ข้อเสริม:**

**1. CTE ไม่ได้เก็บผลไว้ (SQL Server):** `WITH x AS (...)` เป็นแค่ชื่อเรียก query ถ้าอ้าง `x` 3 ครั้ง (`FROM x a JOIN x b JOIN x c`) optimizer มัก **ประมวลผล query นั้นซ้ำ 3 รอบ** ถ้า query หนัก ให้เก็บผลลง temp table ครั้งเดียว
- PostgreSQL 12+ ทำเหมือนกัน (inline) ถ้าอ้างครั้งเดียว แต่ถ้าอ้างหลายครั้งจะ materialize ให้อัตโนมัติ และบังคับได้ด้วย `WITH x AS MATERIALIZED (...)`
- CTE ที่อ้างครั้งเดียวไม่มีต้นทุนเพิ่ม ใช้เพื่อความอ่านง่ายได้เต็มที่

**2. แตก query ยักษ์เป็นขั้นด้วย temp table:** `SELECT … INTO #Step1 …` → `#Step2` → ผลสุดท้าย อ่านง่าย debug ทีละขั้นได้ (`SELECT * FROM #Step1`) และมักได้ plan ที่ดีกว่าเพราะ optimizer เห็นจำนวนแถวจริงของแต่ละขั้น (ช่วยเมื่อ estimate ผิดมาก, EP-01)

| | `#Temp` | `@TableVariable` | `##GlobalTemp` |
|---|---|---|---|
| ขอบเขต | session (หายเมื่อปิด connection) | batch / procedure ที่ประกาศ | ทุก session มองเห็น |
| statistics | ✅ มี → plan แม่น | ❌ ไม่มี: ก่อน SQL Server 2019 ประเมินว่ามี **1 แถวเสมอ** (2019+ มี deferred compilation ช่วยบ้าง) | ✅ |
| index | สร้างได้หลังสร้างตาราง | ได้เฉพาะ inline (PK / UNIQUE / INDEX ในตอนประกาศ) | ได้ |
| rollback | ข้อมูลถูก rollback | **ไม่ถูก rollback** (ใช้เก็บ log ระหว่าง transaction ได้) | ถูก rollback |
| เหมาะกับ | ข้อมูลเยอะ / JOIN ต่อ | ไม่กี่สิบแถว ไม่ JOIN ซับซ้อน | แทบไม่ควรใช้ (ชนกันข้าม session) |

**3. ราคาที่ต้องจ่าย:** temp table อยู่ใน **tempdb ที่ทุก database บน server ใช้ร่วมกัน** การเขียนลง tempdb มีต้นทุน; query สั้นที่ JOIN ธรรมดาใส่ temp table แล้วช้าลง และ **สร้าง temp table ในลูป** ทำให้ tempdb แย่งกันทั้งเครื่อง ใช้เมื่อมันแก้ปัญหาจริง (ผลกลางถูกใช้ซ้ำ, estimate ผิด, query อ่านไม่ออก) ไม่ใช่ใส่ทุก query
- PostgreSQL: `CREATE TEMP TABLE` ไม่มี statistics อัตโนมัติจนกว่าจะ `ANALYZE` (autovacuum ไม่ดูแล temp table) ให้ `ANALYZE tmp;` หลังใส่ข้อมูลก่อน JOIN

---

## AP-13 — เปิด transaction ค้างไว้ระหว่างเรียก API / เขียนไฟล์ และการใช้ tempdb เกินจำเป็น

**ปัญหา (โพสต์ devhopsss เรื่อง tempdb):**

```csharp
using var tran = conn.BeginTransaction();
db.Update(order);                              // 5 ms
await http.PostAsync(paymentApi, body);        // ❌ รอ 30 วินาที
await File.WriteAllTextAsync(logPath, data);   // ❌ เขียนไฟล์
tran.Commit();
```

ระหว่าง 30 วินาทีนั้น transaction **ถือ lock แถว order ไว้** ทุกคนที่แตะแถวเดียวกันต้องรอ (blocking) และถ้าเปิด RCSI / snapshot isolation, version ของแถวที่ถูกแก้ต้องเก็บใน **tempdb version store** จนกว่าจะ commit → tempdb โตและช้าทั้งเครื่อง

**กฎ:** transaction ครอบเฉพาะคำสั่ง database ที่ต้อง atomic เท่านั้น งานที่ต้องรอภายนอก (HTTP, ไฟล์, ส่งอีเมล, queue) ย้ายออกไปก่อนหรือหลัง

```csharp
// 1) short tx: record intent first, so a crash after charging still leaves a trace
using (var tran = conn.BeginTransaction()) {
    db.MarkOrderPending(orderId, idempotencyKey);     // status = 'pending'
    tran.Commit();
}
// 2) outside any transaction, with the same idempotency key
var result = await payments.ChargeAsync(orderId, amount, idempotencyKey);
// 3) short tx: final status + outbox
using (var tran = conn.BeginTransaction()) {
    db.SetOrderStatus(orderId, from: "pending", to: result.Succeeded ? "paid" : "failed");
    db.Insert(new Outbox(...));                       // follow-up work
    tran.Commit();                                    // a few ms
}
// a reconcile job re-checks orders stuck in 'pending' with the provider
// worker อ่าน outbox ไปเขียนไฟล์ / ส่งอีเมล (retry ได้, ไม่ค้าง lock)
```
- ต้องให้ "เรียก API + บันทึก DB" สอดคล้องกัน: ใช้ **idempotency key** กับ payment provider + สถานะ `pending` → `paid` และ **outbox pattern** แทนการถือ transaction ข้ามระบบ
- ห้ามรอ user input / UI ระหว่าง transaction เปิด; ตั้ง command timeout และ `SET XACT_ABORT ON` (SQL Server) / `idle_in_transaction_session_timeout` (PostgreSQL) กัน transaction ค้าง
- หา transaction ที่เปิดนาน: `sys.dm_tran_active_transactions` + `sys.dm_exec_sessions` (SQL Server) / `pg_stat_activity WHERE state = 'idle in transaction'` (PostgreSQL)

**tempdb คือทรัพยากรที่ทุก database บน instance ใช้ร่วมกัน** ถูกใช้โดย: temp table / table variable (AP-12), sort / hash ที่ **spill**, version store (RCSI / snapshot / online index rebuild), cursor, `UNION` / `DISTINCT` ขนาดใหญ่ (AP-11)

**Spill:** ก่อนรัน optimizer ประเมินแล้วจอง memory grant ถ้าข้อมูลจริงเกินที่จอง ส่วนเกินถูกเขียนลง tempdb (งานในแรมกลายเป็นงาน disk) — ตัวอย่างในโพสต์: Sort 200,000 แถว granted 6,144 KB → *"Sort wrote 15,173 pages to and read 15,173 pages from tempdb"* (spill level 2) ดูได้จากเครื่องหมาย ⚠️ บน Sort / Hash Match ใน actual plan (EP-02)
- 3 สาเหตุที่ dev ทำเอง: `SELECT *` แล้ว `ORDER BY` (แถวกว้าง = ต้องจองเยอะ) → เลือกเฉพาะคอลัมน์ · sort ทั้งหมดก่อนแล้วไปกรองในโค้ด → กรองใน `WHERE` ก่อน · sort คอลัมน์ที่ไม่มี index → ทำ index ที่เรียงไว้แล้ว Sort จะหายไปจาก plan
- สาเหตุที่ต้องดูเพิ่ม: estimate ผิด (statistics เก่า, table variable, parameter sniffing AP-09) ทำให้จองน้อยเกิน · ส่วนกลับกัน (MAX columns, SD-01) ทำให้จองมากเกิน
