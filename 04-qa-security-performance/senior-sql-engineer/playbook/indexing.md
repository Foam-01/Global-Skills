# 🗂️ Indexing Playbook

> ส่วนหนึ่งของสกิล `senior-sql-engineer` — เปิดเมื่องานเกี่ยวกับการสร้าง / เลือก / ตรวจ index

## IX-01 — Index คอลัมน์ที่ใช้กรอง (Nonclustered Index)

ตัวอย่าง: ตาราง `Posts` ~3.7 ล้านแถว หาโพสต์ที่ `FavoriteCount > 1000` (ได้ 113 แถว) ไม่มี index → scan ทั้งตาราง ~2.6 วินาที

```sql
-- SQL Server
CREATE NONCLUSTERED INDEX IX_Posts_FavoriteCount ON Posts (FavoriteCount);
-- PostgreSQL
CREATE INDEX CONCURRENTLY ix_posts_favorite_count ON posts (favorite_count);
```

หลังสร้าง → index seek เหลือ ~0.1 วินาที

**ทำไมได้ผลในเคสนี้:** เงื่อนไข **เลือกแถวได้น้อยมาก** (113 จาก 3.7 ล้าน = selectivity สูง) database กระโดดไปที่แถวที่ต้องการได้เลยแทนการอ่านทั้งตาราง

**สิ่งที่ต้องบอกผู้ใช้ทุกครั้ง:**
- **ไม่ได้เร็วขึ้นเสมอ:** ถ้าเงื่อนไขคืนข้อมูลจำนวนมาก (เช่น `FavoriteCount > 0` ได้ครึ่งตาราง) optimizer จะเลือก scan ทั้งตารางเหมือนเดิม เพราะการ seek + lookup ทีละแถวแพงกว่า (tipping point)
- **`SELECT *` ทำให้ต้องกลับไปอ่านตารางจริงทุกแถว** (Key Lookup / Heap Fetch) ใช้ได้เมื่อแถวน้อย แต่ถ้าแถวเยอะจะช้า → ดู IX-02
- **วัดให้ยุติธรรม:** รันครั้งแรกมักช้ากว่าเพราะข้อมูลยังไม่อยู่ใน memory (cold cache) เทียบก่อน/หลังด้วย **logical reads** (`SET STATISTICS IO ON` / `EXPLAIN (ANALYZE, BUFFERS)`) และ execution plan ไม่ใช่เวลาอย่างเดียว
- **ต้นทุนตอนเขียน:** ทุก `INSERT` / `UPDATE` คอลัมน์นั้น ต้องอัปเดต index ด้วย — คอลัมน์ที่เปลี่ยนบ่อยมาก (เช่น ยอด like ที่อัปเดตทุกครั้งที่กด) ต้องชั่งน้ำหนักกับจำนวน write
- **สร้างบนตารางใหญ่ใน production:** ใช้ `CREATE INDEX CONCURRENTLY` (PostgreSQL) หรือ `WITH (ONLINE = ON)` (SQL Server รุ่นที่รองรับ) เพื่อไม่ล็อกตาราง และรันนอกช่วงที่คนใช้เยอะ
- **ห้ามอ้างตัวเลข "เร็วขึ้น X เท่า" ก่อนวัดกับข้อมูลจริง** ตัวเลขขึ้นกับข้อมูล, การกระจาย, และ hardware

## IX-02 — Covering Index ด้วย INCLUDE (ลด Key Lookup)

Index ปกติเก็บแค่คอลัมน์ key ถ้า query ต้องการคอลัมน์อื่นด้วย database ต้องวิ่งกลับไปอ่านตารางจริงทุกแถว (**Key Lookup** ใน SQL Server / heap fetch ใน PostgreSQL) — `INCLUDE` ใส่คอลัมน์ที่ต้องแสดงผลไว้ในระดับ leaf ของ index เลย ทำให้ตอบ query จาก index ได้ทั้งหมด

```sql
-- query
SELECT Id, Title, CreationDate
FROM Posts
WHERE CreationDate >= '2009-01-01' AND CreationDate < '2010-01-01';

-- SQL Server
CREATE NONCLUSTERED INDEX IX_Posts_CreationDate
ON Posts (CreationDate)
INCLUDE (Title);
-- PostgreSQL 11+
CREATE INDEX ix_posts_creation_date ON posts (creation_date) INCLUDE (title);
```

- **Key** = คอลัมน์ที่ใช้ค้นหา / กรอง / เรียง (`WHERE`, `JOIN`, `ORDER BY`) · **INCLUDE** = คอลัมน์ที่แค่ต้องแสดงผล
- **SQL Server:** clustered key (เช่น `Id` ที่เป็น PK แบบ clustered) **ถูกเก็บในทุก nonclustered index อยู่แล้ว** ไม่ต้อง `INCLUDE (Id)` ซ้ำ
- **อย่า INCLUDE คอลัมน์ใหญ่** (เช่น `Body`, `NVARCHAR(MAX)`, JSON) — index จะบวม กิน memory / disk และทำให้ write ช้า ถ้าต้องใช้คอลัมน์ใหญ่ ปล่อยให้ lookup เฉพาะแถวที่ได้ไม่กี่แถวดีกว่า
- Covering index ผูกกับรูปแบบ query — ถ้าเปลี่ยน `SELECT` ไปขอคอลัมน์ที่ไม่อยู่ใน index ก็กลับไป lookup เหมือนเดิม (อีกเหตุผลที่ไม่ควรใช้ `SELECT *`)
- **PostgreSQL:** จะเป็น Index Only Scan ได้จริงเมื่อ visibility map เป็นปัจจุบัน (ตาราง vacuum สม่ำเสมอ) ดูใน `EXPLAIN` ว่า `Heap Fetches` ต่ำ
- ยืนยันผลด้วย plan: SQL Server ต้องไม่มี **Key Lookup** แล้ว / PostgreSQL ต้องเป็น **Index Only Scan**

## IX-03 — เงื่อนไขช่วงวันที่: อย่าใช้ `BETWEEN` กับคอลัมน์ที่มีเวลา

```sql
-- ❌ ถ้าคอลัมน์เป็น datetime / timestamp จะพลาดข้อมูลของวันสุดท้ายหลังเที่ยงคืน
WHERE CreationDate BETWEEN '2009-01-01' AND '2009-12-31'
-- '2009-12-31' = 2009-12-31 00:00:00 → แถวที่สร้าง 2009-12-31 10:30 หายไป

-- ✅ ช่วงปิดด้านล่าง เปิดด้านบน ใช้ index ได้เหมือนเดิม
WHERE CreationDate >= '2009-01-01' AND CreationDate < '2010-01-01'
```

- ห้ามครอบคอลัมน์ด้วยฟังก์ชันในเงื่อนไข เช่น `WHERE YEAR(CreationDate) = 2009` เพราะ index บน `CreationDate` ใช้ไม่ได้ (non-sargable) — ใช้ช่วงแบบด้านบนแทน
- ระวัง timezone: เก็บเป็น UTC และแปลงขอบเขตช่วงก่อน query
