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
| | IX-04 | วัดผล query: logical reads, plan, statistics (และ logical reads ≠ RAM) + เทียบ reads ต่อแถวที่ได้, ตัวอย่างก่อน / หลัง 141,570 → 7 reads, อ่าน Scan count ให้ถูก (2,534 ≠ อ่านทั้งตาราง 2,534 รอบ), OPTION (RECOMPILE), TOP ไม่มี ORDER BY |
| | IX-05 | ช่องค้นหา `LIKE %คำ%`: prefix vs contains (ผลลัพธ์ต่างกัน!), pg_trgm สำหรับภาษาไทย, Full-Text, escape wildcard |
| | IX-06 | สร้าง index แล้ว reads ลดแต่เวลาไม่ลด (1.39M → 230K reads, ~110 วินาทีเท่าเดิม): หาคอขวด, ส่งข้อมูลหลายล้านแถว, columnstore / partition / aggregate |
| | IX-07 | Filtered / Partial Index (2,016 MB → 28 MB): ใช้กับกลุ่มคงที่ (pending, deleted_at IS NULL) ไม่ใช่ค่าที่ผู้ใช้เลือก, ข้อจำกัด parameter / SET options |
| | IX-08 | Index มากเกินไป = ต้นทุนตอนเขียน (insert reads ต่อแถว 8 → ~46) + จัดกลุ่ม index จาก usage stats (ลูกรัก / ใช้หนัก / ขยะ) + หา query ที่ควรได้ index (dm_exec_query_stats, pg_stat_statements) + วิธีหา index ที่ไม่ได้ใช้ / ซ้ำซ้อน (SQL Server DMV, pg_stat_user_indexes) และเงื่อนไขก่อนลบ |
| | IX-09 | สร้าง index บนคอลัมน์ FK ฝั่งลูก (SQL Server / PostgreSQL ไม่สร้างให้) — ~800,000 → 49 reads, ~5 วินาที → 53 ms · ลบแถวแม่ช้าเพราะ FK ไม่มี index · query หา FK ที่ไม่มี index |
| | IX-10 | เลือก clustered key: IDENTITY vs UUID v4 (fragmentation 99.92%, 1,458 pages) vs v7 / NEWSEQUENTIALID (0.9%, 1,080 pages), page split, ไม่มี ORDER BY = ไม่รับประกันลำดับ, UUID v7 ใน uniqueidentifier ไม่เรียง (99.04%) vs BINARY(16) (0.9%) |
| | IX-11 | Composite index ลำดับคอลัมน์ (leftmost prefix): (DisplayName, Location) กรองทั้งคู่ 4 reads seek vs กรอง Location อย่างเดียว 1,595 reads scan · `=` ไว้หน้า ช่วง / ORDER BY ไว้ท้าย · skip scan |
| | IX-12 | โครงสร้าง B+Tree: root / intermediate / leaf, seek = reads เท่าความลึก (1,245 แถว → 3 ชั้น → 3 reads), leaf ของ clustered vs nonclustered, key กว้างทำ tree ใหญ่, ดูโครงสร้างด้วย DMV |
| [schema-design.md](schema-design.md) | SD-01 | เลือก data type ให้พอดี: ปัญหาจริงของ MAX (index key, memory grant), PostgreSQL ต่างกัน, เบอร์โทร / เงิน / สถานะ, BIT ขังไว้ 2 ค่า |
| [execution-plans.md](execution-plans.md) | EP-01 | เปิดและอ่าน execution plan: แถวจริง vs ประเมิน (34 of 1), scan / seek / lookup, คำเตือน, Cost % เป็นค่าประเมิน, Missing Index |
| | EP-02 | แยกกล่องใน plan 4 กลุ่ม + Scan vs Seek (Index Scan ≠ อ่านทั้งตาราง): Nested Loops / Hash / Merge Join ใช้เมื่อไหร่, คำเตือนที่พบบ่อย (implicit conversion, spill, no join predicate), Missing Index ไม่ใช่คำเตือน, ไม่ใช่ทุก scan ต้องเป็น seek |

## วิธีเพิ่มบทเรียนใหม่

1. เลือกไฟล์ตามหัวข้อ ถ้าไม่มีไฟล์ที่เหมาะ ให้สร้างไฟล์ใหม่ (เช่น `transactions.md`, `concurrency.md`, `pagination.md`) และเพิ่มในตาราง `14.5` ของ `SKILL.md`
2. ใช้รหัสต่อจากเดิม (AP-08, IX-13, SD-02, EP-03 …) และเพิ่มแถวในตารางด้านบน
3. แต่ละบทต้องมี: ❌ ตัวอย่างที่ผิด · ✅ วิธีแก้ · **ทำไม** · **ข้อยกเว้น / ข้อควรระวัง** · คำสั่งของทั้ง SQL Server และ PostgreSQL ถ้าต่างกัน
4. ตรวจความถูกต้องก่อนใส่ (คลิปสั้นมักตัดข้อยกเว้นออก) และห้ามขัดกับ CORE PRINCIPLE ใน `SKILL.md`
