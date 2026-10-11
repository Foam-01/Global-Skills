# 📚 Senior SQL Playbook

บทเรียนเชิงลึกของสกิล `senior-sql-engineer` แยกตามหัวข้อ เพื่อให้ AI เปิดอ่านเฉพาะไฟล์ที่เกี่ยวกับงาน

| ไฟล์ | รหัส | หัวข้อ |
|---|---|---|
| [anti-patterns.md](anti-patterns.md) | AP-01 | Correlated subquery ใน SELECT แทน JOIN |
| | AP-02 | N+1 จริง (query ในลูปจากแอป / ORM) |
| | AP-03 | `COUNT(*)` เพื่อเช็กว่ามีข้อมูลไหม → `EXISTS` |
| | AP-04 | IDOR — query ด้วย id อย่างเดียว ไม่ผูกเจ้าของ |
| | AP-05 | `NOT IN` + NULL ใน subquery = ได้ 0 แถวเงียบๆ (0 vs 18,385) → `NOT EXISTS` |
| | AP-06 | RIGHT ปน LEFT JOIN → LEFT ทิศเดียว (ต้องสลับตาราง ไม่ใช่แค่เปลี่ยนคำ) + WHERE ทำ LEFT เป็น INNER + fan-out ทำ SUM เกิน |
| | AP-07 | ดึงทั้งหมดมากรอง / รวมยอดในโค้ดแอป → ทำใน database + ดู SQL ที่ ORM สร้างจริง (Prisma, EF Core / LINQ) |
| [indexing.md](indexing.md) | IX-01 | Index คอลัมน์ที่ใช้กรอง (selectivity, tipping point, ต้นทุน write) |
| | IX-02 | Covering index ด้วย `INCLUDE` + ตัวอย่างตัวเลขจริง 803,786 → 7,341 reads |
| | IX-03 | ช่วงวันที่: ห้าม `YEAR()` / ฟังก์ชันครอบคอลัมน์ และห้าม `BETWEEN` กับ datetime + ตัวเลขจริง (YEAR() 22,959 vs range 7,341 reads, BETWEEN ทำข้อมูลหาย 3,594 แถว) |
| | IX-04 | วัดผล query: logical reads, plan, statistics (และ logical reads ≠ RAM) |
| | IX-05 | ช่องค้นหา `LIKE %คำ%`: prefix vs contains (ผลลัพธ์ต่างกัน!), pg_trgm สำหรับภาษาไทย, Full-Text, escape wildcard |
| | IX-06 | สร้าง index แล้ว reads ลดแต่เวลาไม่ลด (1.39M → 230K reads, ~110 วินาทีเท่าเดิม): หาคอขวด, ส่งข้อมูลหลายล้านแถว, columnstore / partition / aggregate |
| [schema-design.md](schema-design.md) | SD-01 | เลือก data type ให้พอดี: ปัญหาจริงของ MAX (index key, memory grant), PostgreSQL ต่างกัน, เบอร์โทร / เงิน / สถานะ, BIT ขังไว้ 2 ค่า |
| [execution-plans.md](execution-plans.md) | EP-01 | เปิดและอ่าน execution plan: แถวจริง vs ประเมิน (34 of 1), scan / seek / lookup, คำเตือน, Cost % เป็นค่าประเมิน, Missing Index |
| | EP-02 | แยกกล่องใน plan 4 กลุ่ม + Scan vs Seek (Index Scan ≠ อ่านทั้งตาราง): Nested Loops / Hash / Merge Join ใช้เมื่อไหร่, คำเตือนที่พบบ่อย (implicit conversion, spill, no join predicate), Missing Index ไม่ใช่คำเตือน, ไม่ใช่ทุก scan ต้องเป็น seek |

## วิธีเพิ่มบทเรียนใหม่

1. เลือกไฟล์ตามหัวข้อ ถ้าไม่มีไฟล์ที่เหมาะ ให้สร้างไฟล์ใหม่ (เช่น `transactions.md`, `concurrency.md`, `pagination.md`) และเพิ่มในตาราง `14.5` ของ `SKILL.md`
2. ใช้รหัสต่อจากเดิม (AP-08, IX-07, SD-02, EP-03 …) และเพิ่มแถวในตารางด้านบน
3. แต่ละบทต้องมี: ❌ ตัวอย่างที่ผิด · ✅ วิธีแก้ · **ทำไม** · **ข้อยกเว้น / ข้อควรระวัง** · คำสั่งของทั้ง SQL Server และ PostgreSQL ถ้าต่างกัน
4. ตรวจความถูกต้องก่อนใส่ (คลิปสั้นมักตัดข้อยกเว้นออก) และห้ามขัดกับ CORE PRINCIPLE ใน `SKILL.md`
