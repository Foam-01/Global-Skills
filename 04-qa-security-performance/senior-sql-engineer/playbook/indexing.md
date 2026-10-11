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

**ตัวอย่างผลจริง** (ตาราง `Posts` ~3.7 ล้านแถว, query ปี 2009 ได้ **1,285,380 แถว** ≈ 35% ของตาราง, SQL Server):

| Index | Plan ที่ได้ | logical reads | ข้อมูลที่ต้องอ่าน (reads × 8 KB) |
|---|---|---|---|
| `(CreationDate)` ไม่มี INCLUDE | ไม่ใช้ index เลย → **scan ทั้ง clustered index แบบขนาน** (Scan count 13) | 803,786 | ~6.1 GB |
| `(CreationDate) INCLUDE (Title)` | range scan บน index อย่างเดียว | 7,341 | ~57 MB |

**อ่านตัวเลขนี้ให้ถูก:**
- ทำไมแบบไม่มี INCLUDE ถึงไม่ใช้ index ที่สร้างไว้: แถวที่ตรงเงื่อนไขมี 1.28 ล้านแถว ถ้าใช้ index ต้อง Key Lookup กลับไปตารางทีละแถว 1.28 ล้านครั้ง optimizer จึงเลือก scan ทั้งตารางแทน (tipping point — ดู IX-01) ผลคือ index นั้น **ไม่ช่วยอะไรเลย** สำหรับ query นี้
- INCLUDE แก้ได้เพราะทุกคอลัมน์ที่ query ต้องการอยู่ใน index แล้ว จึงอ่านเฉพาะช่วงปี 2009 ของ index ซึ่งเล็กกว่าตารางมาก (index ไม่มีคอลัมน์ใหญ่อย่าง `Body`)
- **logical reads ≠ RAM ที่ใช้:** logical read = การอ่าน 1 หน้า (8 KB) จาก buffer pool หน้าเดิมถูกนับซ้ำได้ ตัวเลข `reads × 8 KB` คือ **ปริมาณงานอ่าน** ไม่ใช่ RAM ที่ query จองไว้ — อย่าเขียนในรายงานว่า "กิน RAM 6 GB"
- ผลกระทบด้านหน่วยความจำที่เกิดขึ้นจริง: การ scan ทั้งตารางบ่อยๆ ดึงหน้าข้อมูลทั้งตารางเข้า buffer pool และ **ไล่ข้อมูลอื่นที่ใช้บ่อยออกจาก cache** (buffer pool pressure) ทำให้ query อื่นช้าลงตามไปด้วย ดูได้จาก page life expectancy / cache hit ratio
- **ถามก่อนว่าต้องดึง 1.28 ล้านแถวจริงไหม:** ถ้าเป็นหน้าจอแสดงผล ควรแบ่งหน้า (pagination) หรือสรุปผล (aggregate) ใน database — การดึงข้อมูลน้อยลงมักได้ผลมากกว่าการเพิ่ม index

## IX-03 — เงื่อนไขช่วงวันที่: ห้ามครอบคอลัมน์ด้วยฟังก์ชัน และห้ามใช้ `BETWEEN` กับคอลัมน์ที่มีเวลา

```sql
-- ❌ 1) ครอบคอลัมน์ด้วยฟังก์ชัน → index seek ไม่ได้ (non-sargable)
WHERE YEAR(CreationDate) = 2009

-- ❌ 2) BETWEEN กับ datetime → ทำข้อมูลวันสุดท้ายหาย
WHERE CreationDate BETWEEN 2009-01-01 AND 2009-12-31
-- 2009-12-31 = 2009-12-31 00:00:00 → แถวที่สร้าง 2009-12-31 10:30 หายไป

-- ✅ ช่วงปิดด้านล่าง เปิดด้านบน: seek ได้ และได้ข้อมูลครบ
WHERE CreationDate >= 2009-01-01 AND CreationDate < 2010-01-01
```

**ตัวอย่างผลจริง** (SQL Server, ตาราง `Posts` ~3.7 ล้านแถว, มี index `(CreationDate) INCLUDE (Title)` จาก IX-02):

| เงื่อนไข | แถวที่ได้ | Plan | logical reads | CPU time | elapsed |
|---|---|---|---|---|---|
| `YEAR(CreationDate) = 2009` | **1,288,974** ✅ ครบ | **Index Scan** ทั้ง index แบบขนาน (Scan count 13) | 22,959 | 2,966 ms | 5,932 ms |
| `BETWEEN 2009-01-01 AND 2009-12-31` | **1,285,380** ❌ หาย 3,594 แถว | Index Seek เฉพาะช่วง | 7,341 | 812 ms | 5,655 ms |
| `>= 2009-01-01 AND < 2010-01-01` | 1,288,974 ✅ ครบ | Index Seek เฉพาะช่วง | ~เท่ากับ BETWEEN | ~เท่ากับ BETWEEN | — |

**อ่านตัวเลขนี้ให้ถูก:**
- **`YEAR()` ไม่ได้ "เมิน index ทั้งหมด"** — ยังอ่านจาก index ได้ (เพราะ index ครอบคลุมคอลัมน์ที่ต้องการ) แต่ต้อง **อ่านทั้ง index ทุกแถว** แล้วคำนวณ `YEAR()` ทีละแถว แทนที่จะกระโดดไปเฉพาะช่วงปี 2009 (seek) จึงอ่านมากกว่า ~3 เท่าและใช้ CPU มากกว่า ~3.6 เท่า ถ้า index ไม่ครอบคลุม จะแย่กว่านี้มากเพราะต้อง scan ทั้งตาราง
- **elapsed เกือบเท่ากัน (~5.7–5.9 วินาที) ไม่ได้แปลว่าเร็วเท่ากัน** — เวลาส่วนใหญ่หมดไปกับการส่ง 1.28 ล้านแถวไปให้ client (ใน SQL Server จะเห็น wait type `ASYNC_NETWORK_IO`) ไม่ใช่การค้นหา ตัวที่บอกงานของ database จริงคือ **logical reads และ CPU time** (ดู IX-04)
- **ความถูกต้องมาก่อนความเร็ว:** `BETWEEN` เร็วกว่า `YEAR()` แต่ **ผลลัพธ์ผิด** ต้องใช้ช่วง `>= … < …` ซึ่งเร็วเท่า `BETWEEN` และถูกต้องเท่า `YEAR()`
- logical reads ที่ลดลงคือ **งานอ่านที่ลดลง** ไม่ใช่ RAM ที่ใช้ลดลง (ดู IX-02, IX-04)
- ถ้าเปลี่ยนเงื่อนไขแล้วจำนวนแถวต่างจากเดิม **ต้องหยุดและหาสาเหตุ** ก่อนสรุปว่าแบบใหม่ดีกว่า

**ฟังก์ชันอื่นที่ทำให้ seek ไม่ได้แบบเดียวกัน:** `CAST(col AS DATE) = …` (SQL Server บางกรณียัง seek ได้ แต่ไม่ควรพึ่ง), `DATE_TRUNC(year, col) = …`, `LOWER(email) = …`, `col + 1 = …`, `ISNULL(col, 0) = …`, `LIKE %คำ%` — ย้ายการคำนวณไปฝั่งค่าคงที่ หรือสร้าง expression / computed-column index ถ้าจำเป็นต้องค้นแบบนั้นจริง

- ระวัง timezone: เก็บเป็น UTC และแปลงขอบเขตช่วงก่อน query

## IX-04 — วัดผล query ด้วยตัวเลขที่ถูกต้อง

ก่อนและหลังแก้ทุกครั้ง ให้เก็บตัวเลขชุดเดียวกัน:

```sql
-- SQL Server
SET STATISTICS IO, TIME ON;
-- รัน query แล้วดูแท็บ Messages + Actual Execution Plan

-- PostgreSQL
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

| ตัวเลข | ความหมาย | ใช้ตัดสินอะไร |
|---|---|---|
| **logical reads** (SQL Server) / **shared hit + read** (PostgreSQL) | จำนวนหน้า 8 KB ที่ query อ่าน | ตัวชี้วัดหลัก — คงที่กว่าเวลา ไม่ขึ้นกับ cache อุ่น / เย็น |
| physical reads / `read=` | หน้าที่ต้องอ่านจาก disk จริง | บอกว่า cache เย็นหรือข้อมูลไม่พอดีกับ memory |
| CPU time vs elapsed time | CPU > elapsed แปลว่า query รันขนาน (parallel) | ถ้า query ง่ายแต่รันขนาน มักแปลว่ากำลัง scan ข้อมูลเยอะ |
| Scan count | จำนวนครั้งที่เข้าไปอ่าน object นั้น | > 1 อาจเป็น parallel scan หรือ nested loop |
| rows ใน plan (estimated vs actual) | optimizer ประเมินจำนวนแถวถูกไหม | ต่างกันมาก = statistics เก่า → `UPDATE STATISTICS` / `ANALYZE` |

- เทียบเวลาให้ยุติธรรม: รันหลายครั้งแล้วดูค่ากลาง หรือเทียบตอน cache อุ่นทั้งคู่ — ห้ามเทียบรันแรก (cache เย็น) กับรันหลัง
- รายงานเป็น "logical reads ลดจาก X เหลือ Y" พร้อม plan ก่อน/หลัง แทนการบอกว่า "เร็วขึ้น N เท่า" อย่างเดียว

## IX-05 — ช่องค้นหา: `LIKE '%คำ%'` กับ index

```sql
-- ❌ % นำหน้า → B-tree index กระโดดไปที่ตำแหน่งไม่ได้ ต้องไล่อ่านทุกแถว (หรือทุกแถวของ index)
WHERE Name LIKE N'%บุญเพิ่ม%'

-- ✅ ค้นแบบ "ขึ้นต้นด้วย" → seek บน index ของ Name ได้
WHERE Name LIKE N'บุญเพิ่ม%'
```

**⚠️ สองแบบนี้ให้ผลลัพธ์ไม่เหมือนกัน — ห้ามเปลี่ยนเงียบๆ เพื่อความเร็ว**
- `'บุญเพิ่ม%'` เจอแค่ชื่อที่ **ขึ้นต้น** ด้วยคำนี้ ส่วน `'%บุญเพิ่ม%'` เจอคำนี้ **ตรงไหนก็ได้** (เช่น นามสกุล "ใจบุญเพิ่ม")
- การเลือกแบบไหนเป็น **การตัดสินใจของ product** ต้องถามผู้ใช้ก่อน ถ้าผู้ใช้ต้องการค้น "ส่วนใดก็ได้" จริง ให้ใช้วิธีด้านล่าง ไม่ใช่ตัด `%` ออก

**ถ้าต้องค้นคำตรงกลางจริง:**

| Database | วิธี | หมายเหตุสำหรับภาษาไทย |
|---|---|---|
| PostgreSQL / Supabase | `CREATE EXTENSION pg_trgm;` + `CREATE INDEX … USING gin (name gin_trgm_ops);` แล้วใช้ `LIKE` / `ILIKE '%คำ%'` เดิมได้เลย | ✅ ทำงานระดับตัวอักษร ไม่ต้องตัดคำ ใช้กับภาษาไทยได้ · คำค้นต้องยาว **≥ 3 ตัวอักษร** ถึงจะได้ประโยชน์ |
| PostgreSQL full-text (`tsvector`) | ค้นเป็น "คำ" มีจัดอันดับความเกี่ยวข้อง | ❌ ไม่มีตัวตัดคำภาษาไทยในตัว (ภาษาไทยไม่มีช่องว่างคั่นคำ) — ใช้ pg_trgm แทน |
| SQL Server Full-Text Search | `CONTAINS` / `FREETEXT` + full-text index | มีตัวตัดคำภาษาไทย (Thai word breaker) แต่ค้นเป็น "คำ" ไม่ใช่ substring — ทดสอบกับข้อมูลจริงก่อน |
| ข้อมูลเยอะมาก / ต้องการ typo tolerance, ranking | Search engine แยก (Meilisearch, Elasticsearch / OpenSearch) | เพิ่ม infrastructure — ใช้เมื่อวัดแล้วว่า database ไม่พอเท่านั้น |

**ข้อควรระวังอื่น:**
- **escape อักขระพิเศษจากผู้ใช้:** ถ้าผู้ใช้พิมพ์ `%` หรือ `_` จะกลายเป็น wildcard — escape ก่อน (`LIKE @q ESCAPE '\'`) และใช้ parameter เสมอ ห้ามต่อ string
- **ตัวพิมพ์เล็ก/ใหญ่:** SQL Server ขึ้นกับ collation ของคอลัมน์ · PostgreSQL ใช้ `ILIKE` (pg_trgm รองรับ) หรือ expression index บน `lower(name)`
- `LIKE N'…'` — ตัว `N` จำเป็นใน SQL Server เมื่อคอลัมน์เป็น `NVARCHAR` (Unicode / ภาษาไทย) ถ้าชนิดไม่ตรงกันอาจเกิดการแปลงชนิดที่ทำให้ index ใช้ไม่ได้
- ถ้า index เป็น covering index การค้นแบบ `%คำ%` จะ scan ทั้ง index แทนทั้งตาราง (ช้ากว่า seek แต่ยังดีกว่า scan ตาราง) — วัดด้วย logical reads (IX-04) ห้ามอ้าง "ช้าลง 10 เท่า" โดยไม่วัด
- กำหนดความยาวคำค้นขั้นต่ำ และใส่ debounce ที่ช่องค้นหาฝั่ง UI เพื่อลดจำนวน query
