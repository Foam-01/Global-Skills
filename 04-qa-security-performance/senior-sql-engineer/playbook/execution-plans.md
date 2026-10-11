# 🗺️ Execution Plan Playbook

> ส่วนหนึ่งของสกิล `senior-sql-engineer` — เปิดเมื่อต้องหาว่า query ช้าเพราะอะไร หรือยืนยันว่าการแก้ได้ผลจริง

## EP-01 — เปิดและอ่าน execution plan (เลิกเดา)

### วิธีเปิด

| Database | Plan จริง (รัน query จริง) | Plan ประเมิน (ไม่รัน) |
|---|---|---|
| SQL Server (SSMS) | **Include Actual Execution Plan** (`Ctrl+M`) แล้วรัน → แท็บ *Execution plan* | Display Estimated Execution Plan (`Ctrl+L`) |
| PostgreSQL / Supabase | `EXPLAIN (ANALYZE, BUFFERS) SELECT …` | `EXPLAIN SELECT …` |

- ⚠️ `EXPLAIN ANALYZE` / Actual plan **รัน query จริง** — กับ `UPDATE` / `DELETE` / `INSERT` ให้ครอบด้วย transaction แล้ว `ROLLBACK` หรือรันบนสำเนาข้อมูล ห้ามรันบน production โดยไม่คิด
- อ่านง่ายขึ้น: PostgreSQL วาง output ที่ explain.dalibo.com หรือ explain.depesz.com
- ใช้ **plan จริง** ทุกครั้งที่ทำได้ เพราะมีจำนวนแถวจริงให้เทียบกับที่ประเมินไว้

### อ่านทิศทางไหน

- SQL Server (แบบกราฟิก): ข้อมูลไหลจาก **ขวาไปซ้าย** — กล่องขวาสุดคือที่อ่านข้อมูลจากตาราง / index ส่วน `SELECT` ซ้ายสุดคือผลลัพธ์ · ความหนาของลูกศร = จำนวนแถวที่ส่งต่อ
- PostgreSQL (ข้อความ): อ่านจาก **บรรทัดที่ย่อหน้าลึกที่สุด** ขึ้นมา

### สิ่งที่ต้องดู (เรียงตามความสำคัญ)

**1. แถวจริง vs แถวที่ประเมิน — สัญญาณที่สำคัญที่สุด**
- SSMS แสดงเป็น `Actual of Estimated (%)` เช่น `34 of 1 (3400%)` = ประเมินไว้ 1 แถว แต่จริงได้ 34 แถว
- PostgreSQL: `rows=` ใน `(cost=… rows=…)` เทียบกับ `(actual … rows=…)`
- ต่างกันมาก (เกิน ~10 เท่า) แปลว่า optimizer ตัดสินใจจากข้อมูลผิด → อาจเลือก join / index ผิดทั้ง plan
- สาเหตุที่พบบ่อย: **statistics เก่า** (`UPDATE STATISTICS` / `ANALYZE`), parameter sniffing (SQL Server), เงื่อนไขหลายคอลัมน์ที่สัมพันธ์กัน, ฟังก์ชันครอบคอลัมน์ (IX-03), table variable

**2. ตัวดำเนินการที่อ่านข้อมูล**

| เห็น | ความหมาย | แย่เสมอไหม |
|---|---|---|
| Table Scan (SQL Server, ตาราง heap) / Clustered Index Scan / Seq Scan (PG) | อ่านทั้งตาราง | **ไม่เสมอ** — ตารางเล็ก หรือ query ต้องการข้อมูลสัดส่วนใหญ่ scan อาจเร็วที่สุด (ดู IX-01) |
| Index Seek / Index Scan (PG) | กระโดดไปเฉพาะช่วงที่ต้องการ | ดีเมื่อได้แถวน้อย แต่ถ้า seek + lookup หลายแสนครั้งอาจแย่กว่า scan |
| Key Lookup / RID Lookup (SQL Server) | กลับไปอ่านตารางจริงทีละแถว | แก้ด้วย covering index (IX-02) เมื่อจำนวนครั้งสูง |
| Index Only Scan (PG) | ตอบจาก index อย่างเดียว | ดี — ถ้า `Heap Fetches` สูง ให้ดูเรื่อง vacuum |

- "Table Scan" ใน SQL Server หมายถึงตารางนั้น **ไม่มี clustered index (heap)** — ตารางหลักในระบบ OLTP ส่วนใหญ่ควรมี clustered index / primary key

**3. คำเตือนในแผน**
- ⚠️ เครื่องหมายเตือนสีเหลือง (SQL Server): implicit conversion (ชนิดข้อมูลไม่ตรง → index ใช้ไม่ได้), sort / hash **spill ลง tempdb** (หน่วยความจำไม่พอ), statistics หาย
- PostgreSQL: `Sort Method: external merge Disk` = sort ไม่พอใน memory, `Rows Removed by Filter` สูงมาก = อ่านทิ้งเยอะ

**4. ต้นทุนและเวลา**
- **`Cost %` เป็นค่าประเมินของ optimizer แม้ในแผนจริง** ไม่ใช่ CPU ที่ใช้จริง ใช้ชี้จุดที่น่าสงสัยได้ แต่ถ้าการประเมินจำนวนแถวผิด (ข้อ 1) Cost % ก็ผิดตาม
- ตัวเลขที่วัดจริง: เวลาต่อกล่อง (SSMS รุ่นใหม่แสดงเช่น `0.464s`), `actual time` (PG), logical reads / buffers (IX-04)

**5. Missing Index (ข้อความสีเขียวใน SSMS)**
- เป็นข้อเสนอแนะอัตโนมัติจาก query เดียว **ห้ามสร้างตามทันที** — มักเสนอ INCLUDE ทุกคอลัมน์ ซ้ำกับ index ที่มีอยู่ และไม่คิดถึงต้นทุนการเขียน ให้พิจารณาตาม IX-01 / IX-02 / IX-06

### ขั้นตอนเมื่อเจอ query ช้า

1. เก็บ actual plan + logical reads / buffers **ก่อนแก้**
2. หาจุดที่แถวจริงต่างจากที่ประเมินมากที่สุด และกล่องที่ใช้เวลา / อ่านข้อมูลมากที่สุด
3. ตั้งสมมติฐาน (เช่น "ไม่มี index ที่ seek ได้", "statistics เก่า", "implicit conversion") แล้วแก้ทีละอย่าง
4. เก็บ plan + ตัวเลข **หลังแก้** แล้วเทียบ — รายงานพร้อม plan ทั้งสองแบบ
5. ตรวจว่าจำนวนแถวที่ได้ **เท่าเดิม**

### ตัวอย่าง (SQL Server, ตาราง `Posts`)

| ก่อนมี index | หลังมี `IX_Posts_Score` |
|---|---|
| `Table Scan [Posts]` Cost 100%, 0.464s, `11919 of 9268 (128%)` | `Index Seek (NonClustered) [Posts].[IX_Posts_Score]`, 0.014s, `36846 of 36846 (100%)` |

- หลังแก้ ตัวเลขประเมินตรงกับของจริง 100% และเปลี่ยนจาก scan เป็น seek — นี่คือหลักฐานที่ควรแนบในรายงาน (ดีกว่าการบอกว่า "เร็วขึ้น X เท่า")
- ระวังเทียบให้ตรง query: ถ้าเงื่อนไขก่อนและหลังไม่เหมือนกัน (จำนวนแถวต่างกัน) ตัวเลขเทียบกันไม่ได้
