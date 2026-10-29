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

**ตัวอย่างผลจริงแบบเล็ก** (SQL Server, `SELECT Id, DisplayName, Location FROM Users WHERE DisplayName = @name` ได้ 1 แถว):

| Index | Plan | logical reads |
|---|---|---|
| ไม่มี | Clustered Index Scan ขนาน (scan count 13) | 7,768 |
| `(DisplayName)` | Index Seek + Key Lookup (ไปเอา `Location` จากตารางจริง) | 6 |
| `(DisplayName) INCLUDE (Location)` | Index Seek อย่างเดียว | 3 |

- nonclustered index เก็บ **key + ตัวชี้ไปแถวจริง** (clustered key เช่น `Id`) — คอลัมน์ที่ไม่อยู่ใน index ต้องเดินตามตัวชี้ไปอ่าน (Key Lookup) ทีละแถว
- กับ 1 แถว lookup เพิ่มแค่ 3 หน้า (ไม่จำเป็นต้อง INCLUDE เสมอ) แต่กับหลายพันแถว lookup คูณตามจำนวนแถว (ดู IX-01 tipping point)

- **Key** = คอลัมน์ที่ใช้ค้นหา / กรอง / เรียง (`WHERE`, `JOIN`, `ORDER BY`) · **INCLUDE** = คอลัมน์ที่แค่ต้องแสดงผล
- **SQL Server:** ถ้าตารางมี **clustered index** (เช่น `Id` ที่เป็น PK แบบ clustered) clustered key **ถูกเก็บในทุก nonclustered index อยู่แล้ว** ไม่ต้อง `INCLUDE (Id)` ซ้ำ — แต่ถ้าตารางเป็น **heap** (ไม่มี clustered index, ใน plan จะเห็น `Table Scan` / `RID Lookup`) ต้อง `INCLUDE (Id)` ถ้า query ต้องการ `Id` · ตาราง OLTP ส่วนใหญ่ควรมี clustered index ตั้งแต่แรก — เจอ heap ใน production ให้แจ้งด้วย
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

**ตัวอย่างที่ 2 — `YEAR()` + `MONTH()` (คลิป B+Tree EP.05, `Users`, index `(LastAccessDate)`):** `WHERE LastAccessDate >= '2018-08-01' AND LastAccessDate < '2018-09-01'` ได้ 66,988 แถว ด้วย Index Seek **682 reads** (ประเมินตรง 66,988 of 66,988) ส่วน `YEAR(LastAccessDate) = 2018 AND MONTH(LastAccessDate) = 8` ต้อง scan ทั้ง index และประเมินจำนวนแถวผิดด้วย เพราะ optimizer ใช้ statistics ของคอลัมน์ที่ถูกครอบด้วยฟังก์ชันไม่ได้

**ตารางเขียนใหม่ให้ SARGable (จากคลิป B+Tree EP.06 และโพสต์ Non-SARGable vs SARGable + ข้อแก้):**

| ❌ Non-SARGable | ✅ SARGable | ต้องระวัง |
|---|---|---|
| `LEFT(code, 2) = 'CA'` / `SUBSTRING(code,1,2) = 'CA'` | `code LIKE 'CA%'` | prefix เท่านั้น ถ้าค่าที่ค้นมาจากผู้ใช้ต้อง escape `%` `_` (IX-05) |
| `ISNULL(Location, 'Romania') = 'Romania'` | `(Location = 'Romania' OR Location IS NULL)` | ต้องคงความหมายเดิม: แถว NULL ต้องได้มาด้วย |
| `UPPER(name) = 'JOHN'` | `name = 'John'` บน collation แบบ case-insensitive | SQL Server ส่วนใหญ่ใช้ CI เป็น default อยู่แล้ว (`UPPER()` จึงไม่จำเป็นเลย) · PostgreSQL เทียบแบบ case-sensitive ต้องใช้ expression index `ON users (lower(name))` + `WHERE lower(name) = 'john'` หรือ `citext` / nondeterministic collation |
| `price * 1.07 = 107` | `price = 107 / 1.07` (คำนวณฝั่งค่าคงที่) | ระวังการปัด: ผลหารอาจไม่ลงตัว เงินควรเก็บเป็น `DECIMAL` (SD-01) และเทียบด้วยค่าที่ปัดตามกติกาเดียวกับระบบ |
| `CONVERT(VARCHAR, created_at, 112) = '20240115'` | `created_at >= '2024-01-15' AND created_at < '2024-01-16'` | ช่วงครึ่งเปิด |
| คอลัมน์ `VARCHAR` เทียบกับพารามิเตอร์ `NVARCHAR` | ส่งพารามิเตอร์ให้ type ตรงคอลัมน์ | implicit conversion ฝั่งคอลัมน์ทำให้ scan (ORM / .NET ส่ง string เป็น `NVARCHAR` โดย default) ดูคำเตือนใน plan (EP-02) |

**ตัวอย่าง implicit conversion จาก EF Core (คลิป EF Core tuning):** คอลัมน์ `DisplayName VARCHAR(50)` แต่ entity เป็น `string` ธรรมดา → `db.User.Where(u => u.DisplayName.StartsWith("P"))` สร้าง `LIKE N'P%'` → Index **Scan** (ประเมิน 56,034 แถว), **841 reads**, CPU 94 ms · เมื่อ map type ให้ตรงเป็น `LIKE 'P%'` → Index **Seek** (13,217 แถว), **42 reads**, CPU 16 ms (ผลลัพธ์เท่ากัน 13,217 แถว)

```csharp
// EF Core: บอก type จริงของคอลัมน์ ให้ส่งพารามิเตอร์เป็น varchar
modelBuilder.Entity<User>().Property(u => u.DisplayName)
    .HasColumnType("varchar(50)");   // หรือ .IsUnicode(false).HasMaxLength(50)
// ตรวจ SQL ที่สร้างจริงด้วย query.ToQueryString() (AP-07)
```

- ผลกระทบขึ้นกับ collation: collation แบบ `SQL_*` → scan เต็ม; collation แบบ Windows (เช่น `Thai_CI_AS`) SQL Server อาจทำ seek แบบช่วงกว้างได้ (`GetRangeThroughConvert`) แต่ก็ยังแพงกว่าและประเมินแถวผิด แก้ที่ type ให้ตรงเสมอ
- ทิศกลับกัน (คอลัมน์ `NVARCHAR` + พารามิเตอร์ `VARCHAR`) ไม่เสีย index เพราะ SQL Server แปลงพารามิเตอร์ขึ้นไปแทน
- Dapper / ADO.NET: ระบุ `DbType.AnsiString` / `new DbString { IsAnsi = true, Length = 50 }`

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
| read-ahead reads (SQL Server) | หน้าที่ database **ดึงจาก disk ล่วงหน้า** เข้า buffer pool เพราะคาดว่า scan จะต้องใช้ | ตัวมันเอง **ไม่ใช่ปัญหา** (ช่วยให้ scan เร็วขึ้น) แต่ค่าหลักแสน = query กำลัง scan ข้อมูลก้อนใหญ่ที่ไม่อยู่ใน cache → แก้ที่ต้นเหตุ (index / เงื่อนไข) ตัวอย่างจริง: read-ahead 799,171 · CPU 35 วินาที · elapsed 223 วินาที ตอน cache เย็น |
| lob logical reads (SQL Server) | page ของคอลัมน์ขนาดใหญ่ (`NVARCHAR(MAX)`, `VARBINARY(MAX)`, `XML`, ข้อความยาวที่ถูกย้ายออกนอกแถว) ซึ่งเก็บแยกจาก page ปกติ **ไม่รวมใน logical reads** ต้องดูคู่กันเสมอ | ค่าสูงมักมาจาก `SELECT *` ที่ลากคอลัมน์ `Body` / JSON / รูป base64 มาด้วยโดยไม่ได้ใช้ ตัวอย่างจริง (Posts 3.7 ล้านแถว): `SELECT *` = 799,163 reads + **lob 217,937** · CPU 25 วินาที · elapsed 88.5 วินาที → `SELECT Id, OwnerUserId, Score, FavoriteCount` = 799,163 reads + **lob 0** · CPU 7.3 วินาที · elapsed 24.8 วินาที (logical reads เท่าเดิมเพราะยัง scan ทั้งตาราง แต่ตัด LOB และข้อมูลที่ส่งออกได้ ~3.5 เท่า) ⚠️ คลิปแปลง reads × 8 KB เป็น "ใช้ RAM 7.7 GB" ซึ่งผิดแบบเดียวกับข้างบน |
| CPU time vs elapsed time | CPU > elapsed แปลว่า query รันขนาน (parallel) | ถ้า query ง่ายแต่รันขนาน มักแปลว่ากำลัง scan ข้อมูลเยอะ |
| Scan count | จำนวนครั้งที่เข้าไปอ่าน object นั้น (seek หรือ scan ก็นับ) | **ห้ามดูเดี่ยวๆ** — อ่านคู่กับ logical reads เสมอ (ดูหัวข้อ "อ่าน Scan count ให้ถูก" ด้านล่าง) |
| rows ใน plan (estimated vs actual) | optimizer ประเมินจำนวนแถวถูกไหม | ต่างกันมาก = statistics เก่า → `UPDATE STATISTICS` / `ANALYZE` |

### อ่าน Scan count ให้ถูก (ความเข้าใจผิดที่พบบ่อย)

❌ **"Scan count 2534 = database อ่านตารางทั้งตาราง 2,534 รอบ"** — ไม่จริง
✅ Scan count = **จำนวนครั้งที่เข้าไปที่ตาราง / index นั้น** แต่ละครั้งอาจเป็น seek ไม่กี่หน้า หรือ scan ทั้งตารางก็ได้ — ต้องหาร logical reads ด้วย scan count เพื่อดูว่าแต่ละครั้งหนักแค่ไหน

| ตัวอย่างจริง | reads ต่อครั้ง | ความหมาย | ดีหรือไม่ |
|---|---|---|---|
| Scan count **2,534**, logical reads **8,064** (ได้ 2,534 แถว) | ~3 หน้า | seek 2,534 ครั้ง (Nested Loops ทีละแถว) ไม่ใช่อ่านทั้งตาราง 2,534 รอบ — ถ้าอ่านทั้งตารางจริงจะเป็นหลักล้าน–พันล้าน reads | ไม่แย่เสมอไป · ถ้าฝั่งนอกมีแถวเยอะ ลองดูว่า Hash / Merge Join ดีกว่าไหม หรือลดจำนวนแถวก่อน join |
| Scan count **10**, logical reads **49** (IX-09) | ~5 หน้า | seek 10 ครั้ง | ✅ ดีมาก |
| Scan count **13**, logical reads **~141,000** (IX-04) | — | 13 = จำนวน thread ที่ช่วยกัน scan ขนาน รวมแล้วอ่านทั้งตาราง | ❌ แย่ |
| Scan count **1**, logical reads **3** | 3 หน้า | seek / scan ช่วงเล็กครั้งเดียว | ✅ ดี |
| Scan count **1**, logical reads **800,000** | 800,000 หน้า | scan ทั้งตารางครั้งเดียว | ❌ แย่ — **scan count 1 ไม่ได้แปลว่าดี** |
| Scan count **0** | — | ค้นหาด้วย key ของ unique / primary key index เจอแถวเดียว (singleton seek) — **ไม่ได้แปลว่า "เจอใน RAM แล้วเลยไม่ต้องอ่าน"** (การอ่านจาก RAM นับเป็น logical reads เสมอ) | ✅ ปกติ |

- ตัวตัดสินหลักคือ **logical reads รวม** และ **reads ต่อแถวที่ได้** ส่วน scan count ใช้บอก **รูปแบบ** การเข้าถึง (seek ซ้ำหลายรอบ / scan ขนาน / ครั้งเดียว)
- scan count สูง + reads ต่อครั้งน้อย = nested loop seek → ตรวจว่าฝั่งนอกมีแถวมากเกินไปไหม (EP-02)
- scan count เท่ากับจำนวน thread + reads สูง = parallel scan → ขาด index ที่ seek ได้ (IX-01)

### ตัดสินเร็วๆ ว่า query "หนักเกินเหตุ" ไหม: เทียบ reads กับจำนวนแถวที่ได้

```sql
SET STATISTICS IO ON;
SET STATISTICS TIME ON;

SELECT TOP (1000) Id, CommentCount, FavoriteCount
FROM Posts
WHERE CommentCount > 10
OPTION (RECOMPILE);   -- ใช้ตอนทดสอบเท่านั้น (ดูหมายเหตุ)
-- ผลจริง: 1,000 rows · Scan count 13 · logical reads 140,798 · CPU 423 ms · elapsed 295 ms
```

- **ได้ 1,000 แถว แต่อ่าน 140,798 หน้า** (~1.1 GB ของงานอ่าน) = เฉลี่ย **~140 หน้าต่อ 1 แถว** → กำลัง scan ตารางเพื่อหาแถวที่ตรงเงื่อนไข ไม่มี index ที่ seek ได้บน `CommentCount`
- **Scan count 13 + CPU (423 ms) > elapsed (295 ms)** → รันแบบขนานหลาย thread ซึ่งเป็นสัญญาณว่า database ต้องทำงานหนัก (query ง่ายๆ ไม่ควรต้องขนาน)
- รัน query เดิมซ้ำอีกรอบ (ไม่มี index เหมือนกัน) ได้ reads 144,642 · CPU 621 ms · elapsed 210 ms — ตัวเลขแกว่งระหว่างรอบ (reads ±3%, CPU ±50%) จึงต้องรันหลายครั้งก่อนเทียบ และให้น้ำหนัก logical reads มากกว่า CPU / เวลา
- query ที่ดี: reads ใกล้เคียงกับจำนวนหน้าที่ต้องใช้จริง (แถวน้อยควรอ่านแค่หลักหน่วย–หลักร้อยหน้า) — ถ้า reads มากกว่าจำนวนแถวที่ได้หลายสิบเท่าขึ้นไป ให้เปิด plan (EP-01) หาจุดที่ scan หรือ lookup
**ก่อน / หลังสร้าง index ที่ตรงกับ query** (`CREATE NONCLUSTERED INDEX … ON Posts (CommentCount) INCLUDE (Id, FavoriteCount)`):

| | ก่อน | หลัง |
|---|---|---|
| Plan | Table Scan (Posts เป็น heap) + Parallelism · ข้อความ Missing Index (Impact 83%) | Index Seek (NonClustered) → Top |
| Scan count | 13 (ขนาน) | 1 |
| logical reads | 141,570 | **7** |
| CPU time | 578 ms | 0 ms |
| elapsed | 251 ms | 97 ms |

- reads ลดจาก 141,570 เหลือ 7 (ประมาณ 20,000 เท่า) และไม่ต้องรันขนาน = query "เทพ" — อ่านแค่หน้าที่จำเป็นสำหรับ 1,000 แถว
- elapsed 97 ms ทั้งที่ CPU 0 ms → เวลาที่เหลือคือการส่งผลลัพธ์ไป client ไม่ใช่งานของ database (IX-06)
- `4430 of 1000 (443%)` บน Table Scan ก่อนสร้าง index ไม่ได้แปลว่าประเมินผิดร้ายแรง — มี `TOP` อยู่ optimizer จึงประเมินแค่ว่าต้องอ่านกี่แถวถึงจะได้ครบ 1,000 (row goal) แต่ต้องอ่านจริงมากกว่า
- `TOP` ใน query นี้ยังไม่มี `ORDER BY` (ดูหมายเหตุด้านล่าง) — ถ้าเติม `ORDER BY` ด้วยคอลัมน์อื่น index นี้อาจต้อง sort เพิ่ม ให้วัดใหม่

- ใช้เป็น **สัญญาณให้ไปตรวจต่อ** ไม่ใช่เกณฑ์ตายตัว — query ที่ต้อง aggregate ข้อมูลเยอะ (เช่น `SUM` ทั้งปี) อ่านเยอะแต่คืน 1 แถวได้โดยไม่ผิด

**หมายเหตุจาก query ตัวอย่าง**
- `OPTION (RECOMPILE)` สั่งให้คอมไพล์ plan ใหม่ทุกครั้ง — ใช้ตอน **ทดสอบ** เพื่อไม่ให้ plan เก่าใน cache ปนผล แต่ **อย่าใส่ใน query ของแอปที่รันบ่อย** เพราะเสีย CPU คอมไพล์ทุกครั้ง (ใช้ใน production เฉพาะเมื่อแก้ปัญหา parameter sniffing ที่วัดแล้ว)
- **`TOP` / `LIMIT` โดยไม่มี `ORDER BY` = ได้แถวไหนก็ได้** ผลอาจเปลี่ยนทุกครั้งที่รันหรือเมื่อ plan เปลี่ยน — ถ้าผลลัพธ์ถูกนำไปใช้ (แสดงผล, แบ่งหน้า, ประมวลผล) ต้องมี `ORDER BY` ที่ชัดเจนเสมอ
- การวัดหลังสร้าง index ต้องใช้ query และเงื่อนไขเดียวกันทุกตัวอักษร

**ทำไมใช้ logical reads เป็นตัวหลัก และข้อจำกัดของมัน**
- เวลา (elapsed) ขึ้นกับภาระของ server ตอนนั้น — รันตอนเช้าเร็ว ตอนบ่ายช้า ทั้งที่ query เหมือนเดิม · logical reads วัด "งานที่ query ต้องทำ" จึงนิ่งกว่ามาก
- **นิ่งกว่า แต่ไม่ได้คงที่เป๊ะ:** query เดียวกันรันหลายรอบได้ 140,798 / 141,570 / 144,642 / 148,545 reads (แกว่ง ~5% เมื่อรันขนาน) — ต่างกันระดับนี้ถือว่าเท่ากัน
- **logical reads ไม่ได้บอกทุกอย่าง:** query ที่ reads น้อยก็ยังช้าได้ถ้าติด **lock / blocking**, ใช้ **CPU หนัก** (ฟังก์ชันต่อแถว, sort / hash ขนาดใหญ่), **spill ลง tempdb** หรือ **ส่งผลลัพธ์จำนวนมาก** (IX-06) — ดู CPU time, wait stats และ plan ประกอบเสมอ
- เมื่อเจอ "query ช้าเฉพาะบางเวลา" ให้สงสัย blocking / ภาระ server ก่อน แทนที่จะแก้ query

- เทียบแผน / ตัวเลขให้นิ่งขึ้นตอนทดสอบ: `OPTION (MAXDOP 1)` ปิดการรันขนาน (scan count และ reads ไม่แกว่งตามจำนวน thread) — ใช้ตอนเทียบเท่านั้น ไม่ใส่ใน query จริงโดยไม่มีเหตุผล
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

## IX-06 — สร้าง index แล้ว reads ลด แต่เวลาไม่ลด: หาคอขวดให้ถูกก่อน

**ตัวอย่างผลจริง** (SQL Server, ตาราง `EcommerceProcessed` 25.6 ล้านแถว, `SELECT` 11 คอลัมน์ `WHERE [year] = 2023`):

| | logical reads | elapsed |
|---|---|---|
| ไม่มี index (scan ทั้งตาราง) | 1,396,825 | 110,829 ms |
| `CREATE INDEX … ([year]) INCLUDE (ทุกคอลัมน์ที่ SELECT)` | 230,814 | 109,106 ms |

**อ่านให้ถูก:**
- reads ลด ~6 เท่า แต่เวลาแทบไม่ลด → **คอขวดไม่ได้อยู่ที่การค้นหา** แต่อยู่ที่ **การส่งข้อมูลหลายล้านแถวไปให้ client** (SQL Server จะเห็น wait type `ASYNC_NETWORK_IO`; SSMS ยังต้องวาดผลลัพธ์ทั้งหมดด้วย) การเพิ่ม index ลดงานของ database แต่แก้เวลาไม่ได้
- **ไม่ใช่ "ใช้ RAM น้อยลง"** — logical reads คืองานอ่าน (ดู IX-04) ประโยชน์จริงคือ database ทำงานน้อยลงและ cache ถูกรบกวนน้อยลง
- ก่อนสร้าง index ให้ดูว่า query **ใช้เวลาไปกับอะไร**: wait stats / actual plan / ลองรันแบบไม่ส่งผลลัพธ์ (เช่น `SELECT COUNT(*)` ด้วยเงื่อนไขเดียวกัน หรือ SSMS "Discard results after execution") ถ้าเวลาหายเกือบหมด แปลว่าคอขวดคือการส่งผลลัพธ์

**สิ่งที่ควรทำแทน (ถามก่อนว่าดึงหลายล้านแถวไปทำอะไร):**

| จุดประสงค์ | วิธีที่เหมาะ |
|---|---|
| แสดงบนหน้าจอ | แบ่งหน้า (keyset pagination) — ไม่มีใครดูหลายล้านแถว |
| รายงาน / dashboard (ยอดรวม, นับ, เฉลี่ย) | ทำ `GROUP BY` / aggregate ใน database แล้วส่งแค่ผลสรุป |
| ตาราง analytics ขนาดใหญ่ที่ query ตามช่วงเวลา | **Columnstore index** (SQL Server) หรือแบ่ง partition ตามปี / เดือน — PostgreSQL: partitioning, BRIN index บนคอลัมน์เวลาที่เรียงตามการ insert |
| ส่งออกข้อมูล (export) | ทำเป็นงานเบื้องหลัง เขียนลงไฟล์ / storage แล้วส่งลิงก์ ไม่ส่งผ่าน API ตรงๆ |

**ปัญหาของ index ในตัวอย่างนี้:**
- **INCLUDE ทุกคอลัมน์ = สร้างสำเนาตารางอีกชุด** (ในตัวอย่างประมาณ 1.8 GB) ทุก `INSERT` / `UPDATE` ต้องเขียน 2 ที่ ใช้ได้เมื่อ query นี้สำคัญมากและรันบ่อยจริงเท่านั้น
- **`[year]` เป็น key แล้ว ไม่ต้องใส่ใน `INCLUDE` ซ้ำ** — SQL Server ไม่อนุญาตให้คอลัมน์เดียวกันเป็นทั้ง key และ included ในปกติจะ error ตอนสร้าง
- `[year]` มีค่าต่างกันไม่กี่ค่า (selectivity ต่ำ) ถ้าเงื่อนไขคืนข้อมูลสัดส่วนใหญ่ของตาราง index แบบ B-tree จะได้ประโยชน์น้อย (ดู IX-01) — columnstore / partition เหมาะกว่า
- เก็บ `[year]`, `[month]`, `[day]` แยกคู่กับ `[timestamp]` เป็นข้อมูลซ้ำ ใช้ได้ในตาราง analytics ที่ตั้งใจ denormalize แต่ต้องมั่นใจว่าค่าตรงกันเสมอ ถ้าไม่จำเป็นให้ค้นด้วยช่วงของ `[timestamp]` (IX-03)

## IX-07 — Filtered Index / Partial Index: ทำ index เฉพาะกลุ่มข้อมูลที่ถูกค้นบ่อย

```sql
-- SQL Server: Filtered Index
CREATE NONCLUSTERED INDEX IX_Orders_Pending_CreatedAt
ON Orders (CreatedAt)
INCLUDE (CustomerID, Total)
WHERE Status = 'pending';

-- PostgreSQL / Supabase: Partial Index
CREATE INDEX CONCURRENTLY ix_orders_pending_created_at
ON orders (created_at) INCLUDE (customer_id, total)
WHERE status = 'pending';
```

**เหมาะเมื่อ** query ส่วนใหญ่สนใจ **กลุ่มย่อยที่คงที่และเล็ก** ของตาราง:
- คิวงานที่ยังไม่ทำ: `WHERE processed = 0` / `status = 'pending'` (แถวที่ทำเสร็จแล้วมีเป็นล้าน แต่ไม่มีใครค้น)
- soft delete: `WHERE deleted_at IS NULL`
- คอลัมน์ที่ส่วนใหญ่เป็น NULL: `WHERE external_id IS NOT NULL`
- unique เฉพาะแถวที่ใช้งาน: `CREATE UNIQUE INDEX … (email) WHERE deleted_at IS NULL` (ผู้ใช้ที่ถูกลบแล้วสมัครอีเมลเดิมได้)

**ตัวอย่างผลจริง** (SQL Server, `EcommerceProcessed`, query `category = 'Electronics' AND brand = 'Google' AND price < 1000` ได้ 362,657 แถว):

| Index | logical reads | CPU | elapsed | ขนาด index |
|---|---|---|---|---|
| `(category) INCLUDE (title, brand, price)` ทั้งตาราง | 62,238 | 2,078 ms | 2,434 ms | 2,016 MB |
| เหมือนเดิม + `WHERE category = 'Electronics' AND brand = 'Google' AND price < 1000` | 3,596 | 343 ms | 2,113 ms | 28 MB |

- reads / CPU / ขนาด ลดลงมาก แต่ **elapsed แทบเท่าเดิม** — เพราะยังส่งผลลัพธ์ 3.6 แสนแถวไปที่ client (IX-06)

### ⚠️ ตัวอย่างนี้เป็นวิธีใช้ที่ไม่ควรทำตาม

- **filter ผูกกับค่าของ query เดียว** (`brand = 'Google'`, `price < 1000`) → index นี้ช่วยได้ **เฉพาะ query ที่มีเงื่อนไขครอบคลุมช่วงนี้เท่านั้น** ถ้าผู้ใช้ค้น `brand = 'Apple'` หรือ `price < 2000` index จะไม่ถูกใช้เลย — ต้องสร้าง index แยกต่อทุกแบรนด์ / ทุกช่วงราคา ซึ่งเป็นไปไม่ได้
- **filter ควรเป็นเงื่อนไขทางธุรกิจที่คงที่** (status, deleted, active) **ไม่ใช่ค่าที่ผู้ใช้เลือกได้** — ค่าที่เปลี่ยนตาม input ให้อยู่ใน **key ของ index** แทน เช่น `ON (brand, price) WHERE category = 'Electronics'` ถ้าทั้งระบบค้นเฉพาะ Electronics จริง
- **key `category` ซ้ำซ้อน:** เมื่อ filter บังคับ `category = 'Electronics'` แล้ว ทุกแถวใน index มี category เดียวกัน key นี้แทบไม่มีประโยชน์ ควรใช้คอลัมน์ที่ยังต้องค้น / เรียง (เช่น `price`)
- `brand` อยู่ใน INCLUDE ทั้งที่ถูก filter เป็นค่าเดียวแล้ว (SQL Server ต้องการคอลัมน์ใน filter ถ้า query ส่งคอลัมน์นั้นออกมา — ตรวจด้วย plan ว่ามี Key Lookup หรือไม่)

### ข้อจำกัดที่ต้องรู้

**SQL Server**
- query ที่ใช้ **parameter** (`WHERE status = @status`) อาจ **ไม่ใช้ filtered index** เพราะ plan ต้องใช้ได้กับทุกค่าของ parameter — ใช้ค่าคงที่ในเงื่อนไข (`WHERE status = 'pending'`) หรือ `OPTION (RECOMPILE)`
- ต้องตั้ง SET options ให้ถูก (`ANSI_NULLS`, `QUOTED_IDENTIFIER` เป็น ON ฯลฯ) ไม่อย่างนั้น `INSERT` / `UPDATE` ลงตารางนั้นจะ **error** — ตรวจกับ connection ของแอปก่อน deploy
- filter รองรับเงื่อนไขแบบง่ายเท่านั้น (เปรียบเทียบ, `IN`, `IS NULL`) ใช้ฟังก์ชัน / คอลัมน์คำนวณไม่ได้

**PostgreSQL**
- query ต้องมีเงื่อนไขที่ planner พิสูจน์ได้ว่าอยู่ในช่วงของ partial index — prepared statement แบบ generic plan กับ parameter อาจไม่ใช้ partial index
- ยืนยันด้วย `EXPLAIN` ว่าเลือก index นี้จริง

### ประโยชน์จริง (อธิบายให้ถูก)
- index เล็กลง → ใช้พื้นที่ disk และ buffer pool น้อยลง (อ่านเร็วขึ้น, cache ได้มากขึ้น)
- แถวที่ไม่ตรง filter **ไม่ต้องอัปเดต index** ตอน insert / update → ต้นทุนการเขียนลดลง
- statistics ของ index แม่นขึ้นสำหรับกลุ่มนั้น

## IX-08 — Index มากเกินไป: ทุก index คือต้นทุนตอนเขียน

**หลัก:** ทุก nonclustered index คือโครงสร้างข้อมูลอีกชุดที่ต้องอัปเดตพร้อมตาราง — ตาราง 1 ตาราง มี index 10 ตัว = 1 `INSERT` ต้องเขียน 11 ที่ (และ `UPDATE` คอลัมน์ที่อยู่ใน index / `DELETE` ก็เช่นกัน) บวก transaction log, lock และ page split ที่เพิ่มขึ้น

- อ่านเร็วขึ้นแต่เขียนช้าลง → **ตารางที่เขียนบ่อย** (log, event, order, คิวงาน) ต้องมี index เท่าที่จำเป็นจริง ส่วนตาราง reporting / อ่านอย่างเดียวรับ index ได้มากกว่า
- ทุก index ใช้ disk, ใช้ buffer pool, ทำให้ backup / restore / rebuild นานขึ้น
- การสร้าง index ก็มีต้นทุนเอง: ตัวอย่างจริง (SQL Server, ตาราง `Posts`) แต่ละ `CREATE INDEX` อ่านทั้งตาราง ~12,120 หน้าแบบขนาน + sort ใช้ CPU ~4 วินาที / elapsed ~2.4 วินาที ต่อ index — บนตารางใหญ่ใน production ต้องใช้ `ONLINE = ON` / `CONCURRENTLY` (IX-01)
- **ตัวอย่างผลจริง** (SQL Server, ตาราง `Posts` ขนาดใหญ่, `INSERT … VALUES` หลายแถว):

  | สถานะ index | แถวที่ insert | logical reads | reads ต่อแถว | elapsed |
  |---|---|---|---|---|
  | ยังไม่เพิ่ม nonclustered index | 8 | 64 | ~8 | 1 ms |
  | เพิ่ม 1 index `(CommentCount) INCLUDE (…)` | 8 | 122 | ~15 | ~1 ms |
  | เพิ่ม index อีกหลายตัว | 16 | 732 | ~46 | 5 ms |

  - งานต่อ 1 แถวเพิ่มขึ้นตามจำนวน index ชัดเจน (8 → ~46 หน้าต่อแถว) — นี่คือต้นทุนจริงของ index
  - แต่ที่ปริมาณนี้ elapsed ยังแค่ไม่กี่มิลลิวินาที — **"พัง" เกิดเมื่อ write ปริมาณสูง** (insert / update ต่อเนื่องจำนวนมาก, batch import, ตาราง log / event) ที่ต้นทุนนี้คูณกับจำนวนแถว และ lock / transaction log ยาวขึ้นตาม — อย่าสรุปจากการ insert ไม่กี่แถว ให้ทดสอบด้วยปริมาณใกล้ของจริง
  - เทียบให้ยุติธรรมต้องใช้จำนวนแถวเท่ากัน (ตัวอย่างนี้ 8 กับ 16 แถว จึงต้องหารต่อแถว)
  - ในตัวอย่างเดียวกัน การสร้าง index ตัวแรกบนตารางนี้ใช้ logical reads 799,014 · CPU ~14.4 วินาที · elapsed ~5.5 วินาที
- วัดผลกระทบจริงด้วยการเทียบ logical reads / เวลา ของ `INSERT` / `UPDATE` ก่อนและหลังเพิ่ม index ห้ามสรุปว่า "พัง" หรือ "ไม่กระทบ" โดยไม่วัด

### หา index ที่ไม่ได้ใช้ / ซ้ำซ้อน

```sql
-- SQL Server: index ที่ถูกอัปเดตแต่แทบไม่ถูกใช้อ่าน (สถิติรีเซ็ตเมื่อ restart server)
SELECT OBJECT_NAME(s.object_id) AS table_name, i.name AS index_name,
       s.user_seeks, s.user_scans, s.user_lookups, s.user_updates
FROM sys.dm_db_index_usage_stats s
JOIN sys.indexes i ON i.object_id = s.object_id AND i.index_id = s.index_id
WHERE s.database_id = DB_ID() AND i.type_desc = 'NONCLUSTERED'
ORDER BY (s.user_seeks + s.user_scans + s.user_lookups) ASC, s.user_updates DESC;

-- PostgreSQL / Supabase: index ที่ไม่เคยถูก scan (สถิติตั้งแต่ reset ล่าสุด)
SELECT relname AS table_name, indexrelname AS index_name, idx_scan,
       pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC;
```

**อ่านผล usage stats — จัดกลุ่ม index** (ตัวอย่างจริงจาก SQL Server):

| Index | seeks | updates | กลุ่ม | ควรทำ |
|---|---|---|---|---|
| `CIX_Users_Id` | 249 | 2 | **ลูกรัก** — ใช้อ่านเยอะ เขียนน้อย | เก็บไว้ |
| `NCIX_Posts_CommentCount` | 101 | 110 | **ใช้หนักทั้งสองทาง** | ส่วนใหญ่ **ยังควรเก็บ** — query ใช้จริง ต้นทุนเขียนคือราคาที่จ่าย · ตรวจว่ารวมกับ index อื่นได้ไหม / INCLUDE เกินจำเป็นไหม |
| `NCIX_Votes_PostId` | 0 | 240 | **ขยะ** — ไม่มีใครอ่าน แต่ต้องอัปเดตทุกครั้ง | ผู้สมัครลบอันดับแรก (ตามเงื่อนไขก่อนลบด้านล่าง) |

- index ที่ seeks สูงและ updates สูง **ไม่ใช่ index ที่แย่** — ห้ามแนะนำให้ลบเพียงเพราะ updates สูง ให้ดูว่า query ที่ใช้มันสำคัญแค่ไหน
- เก็บสถิติอย่างน้อย 1–2 สัปดาห์ก่อนตัดสิน แต่ถ้ามีงานรายเดือน / รายไตรมาส ต้องครอบคลุมรอบนั้นด้วย และสถิติหายเมื่อ restart

### หา query ที่ควรได้ index (เริ่มจาก query ที่รันบ่อย + หนัก)

ก่อนสร้าง index ให้หาว่า query ไหน **รันบ่อย** และ **หนักต่อครั้ง** — query ที่รันนานๆ ครั้ง (เช่น รายงานรายเดือน) มักไม่คุ้มที่จะสร้าง index ถาวร

```sql
-- SQL Server: query ที่ใช้ logical reads รวมมากที่สุด (ตั้งแต่ plan อยู่ใน cache)
SELECT TOP (20)
  qs.execution_count,
  qs.total_logical_reads / qs.execution_count AS avg_logical_reads,
  qs.total_worker_time / qs.execution_count / 1000 AS avg_cpu_ms,
  SUBSTRING(st.text, qs.statement_start_offset / 2 + 1,
    (CASE qs.statement_end_offset WHEN -1 THEN DATALENGTH(st.text)
     ELSE qs.statement_end_offset END - qs.statement_start_offset) / 2 + 1) AS query_text,
  qp.query_plan
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
CROSS APPLY sys.dm_exec_query_plan(qs.plan_handle) qp
ORDER BY qs.total_logical_reads DESC;

-- PostgreSQL / Supabase: ต้องเปิด extension pg_stat_statements
SELECT calls, mean_exec_time, shared_blks_hit + shared_blks_read AS blocks, query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
```

- เรียงตาม **ผลรวม** (บ่อย × หนัก) ไม่ใช่ค่าเฉลี่ยอย่างเดียว — query 2 ms ที่รันล้านครั้งอาจสำคัญกว่า query 5 วินาทีที่รันวันละครั้ง
- ข้อมูลอยู่ใน cache: SQL Server หายเมื่อ plan ถูกล้าง / restart · PostgreSQL หายเมื่อ `pg_stat_statements_reset()` / restart (ขึ้นกับการตั้งค่า)
- เอา query ที่เจอไปเปิด execution plan (EP-01) แล้วค่อยตัดสินใจเรื่อง index (IX-01, IX-02)

- **ซ้ำซ้อน:** index `(A)` มักซ้ำกับ `(A, B)` (index ตัวหลังใช้แทนได้เกือบทุกกรณี) เช่น `Index_2 ON Posts(Id)` ซ้ำกับ `Index_1 ON Posts(Id, CommentCount)` — และถ้า `Id` เป็น clustered PK อยู่แล้ว ทั้งสองตัวแทบไม่มีประโยชน์ · index ที่ key เหมือนกันแต่ชื่อต่าง · missing index ที่ถูกสร้างตามคำแนะนำซ้ำๆ (EP-01 ข้อ 5)
- **ก่อนลบ index:**
  - ดูสถิติให้ครอบคลุมรอบการใช้งานจริง (รายงานสิ้นเดือน / สิ้นปีอาจใช้ index ที่ปกติไม่มีใครแตะ) และสถิติหายเมื่อ restart
  - index ที่บังคับ **unique / primary key / foreign key lookup** ห้ามลบเพียงเพราะ seek น้อย
  - ลบทีละตัว เก็บคำสั่งสร้างกลับไว้ และวัด query สำคัญหลังลบ
- **ก่อนเพิ่ม index ใหม่:** ดูว่ามี index เดิมที่ขยาย (เพิ่ม key / INCLUDE) แทนได้ไหม แทนการสร้างตัวใหม่ทุกครั้งที่เจอ query ช้า

## IX-09 — สร้าง index บนคอลัมน์ Foreign Key (database ไม่ได้สร้างให้)

**สิ่งที่หลายคนเข้าใจผิด:** ประกาศ `FOREIGN KEY` แล้ว database จะสร้าง index ให้ — **SQL Server และ PostgreSQL ไม่สร้างให้** (สร้างให้เฉพาะ PRIMARY KEY / UNIQUE) ส่วน MySQL InnoDB สร้างให้อัตโนมัติ — คอลัมน์ FK ฝั่งตารางลูก (เช่น `Posts.OwnerUserId`) จึงมักไม่มี index ทั้งที่ถูกใช้ join บ่อยที่สุด

```sql
-- query: 10 ผู้ใช้ พร้อมยอดวิวสูงสุดของโพสต์
WITH PostViewCount AS (
  SELECT OwnerUserId, MAX(ViewCount) AS ViewCount
  FROM Posts
  GROUP BY OwnerUserId
)
SELECT TOP (10) U.Id AS UserId, U.DisplayName, P.ViewCount
FROM Users U
LEFT JOIN PostViewCount P ON P.OwnerUserId = U.Id
ORDER BY U.Id;   -- ตัวอย่างต้นฉบับไม่มี ORDER BY (ดูหมายเหตุ IX-04)

-- SQL Server
CREATE NONCLUSTERED INDEX NCIX_Posts_OwnerUserId ON Posts (OwnerUserId) INCLUDE (ViewCount);
-- PostgreSQL / Supabase
CREATE INDEX CONCURRENTLY ix_posts_owner_user_id ON posts (owner_user_id) INCLUDE (view_count);
```

**ตัวอย่างผลจริง** (SQL Server):

| | Posts: scan count / logical reads | Users | CPU | elapsed |
|---|---|---|---|---|
| ไม่มี index บน `OwnerUserId` | 13 / ~800,000 (รันขนาน + Workfile) | 13 / ~1,370 | ~14,100 ms | ~5,060 ms |
| มี `(OwnerUserId) INCLUDE (ViewCount)` | **10 / 49** | 1 / 14 | ต่ำมาก | ~53 ms |

- อีกตัวอย่าง (`AVG(ViewCount)` + `INNER JOIN` + `OPTION (RECOMPILE, MAXDOP 1)`): ไม่มี index → Posts scan 1 / 799,163 reads · CPU 4,468 ms · elapsed 5,236 ms → มี index → Posts **244 reads** · elapsed 86 ms (AVG ต้องอ่านโพสต์ทุกตัวของผู้ใช้ 10 คน จึงอ่านมากกว่า MAX ซึ่งหยุดได้เร็วกว่า) — คลิปแปลง 800,000 × 8 KB เป็น "RAM 6,250 MB" ซึ่งคือปริมาณงานอ่าน ไม่ใช่ RAM (IX-04)

**ทำไมต่างมากขนาดนี้:**
- ไม่มี index → database ต้อง `GROUP BY` **โพสต์ทั้งตาราง** เพื่อหา MAX ของทุกผู้ใช้ ทั้งที่ต้องการแค่ 10 คน
- มี index ที่เรียงตาม `OwnerUserId` และมี `ViewCount` อยู่ใน index → optimizer เปลี่ยนแผนเป็น "อ่านผู้ใช้ 10 คน แล้ว seek เข้า index ทีละคน" — **Scan count 10 = seek 10 ครั้ง** ครั้งละไม่กี่หน้า (Nested Loops ที่เหมาะกับฝั่งนอกที่มีแถวน้อย — EP-02)
- elapsed เร็วขึ้น ~95 เท่า ส่วน logical reads ลดลงหลายหมื่นเท่า — ตัวเลขแบบนี้เกิดเมื่อ query ต้องการข้อมูลส่วนน้อย (TOP 10) แต่ไม่มี index ให้กระโดดไปหา

**อีกเหตุผลที่ต้อง index คอลัมน์ FK (คลิปไม่ได้พูดถึง แต่สำคัญ):**
- เมื่อ **ลบ / แก้ key ของตารางแม่** (เช่น `DELETE FROM Users WHERE Id = …`) database ต้องเช็กว่ายังมีแถวลูกอ้างถึงไหม ถ้าคอลัมน์ FK ไม่มี index → **scan ตารางลูกทั้งตาราง ต่อการลบ 1 แถว** และถือ lock นาน — อาการ "ลบ user ทีเดียวช้ามาก / ค้าง" มักมาจากตรงนี้ (โดยเฉพาะ `ON DELETE CASCADE`)

**แนวปฏิบัติ:**
- เมื่อสร้าง FK ใหม่ ให้สร้าง index บนคอลัมน์ FK ฝั่งลูกพร้อมกันเป็นค่าเริ่มต้น เว้นแต่ตารางลูกเล็กมากหรือไม่เคย join / ลบแม่
- ถ้ามี query ที่ใช้คอลัมน์อื่นคู่กับ FK เสมอ ให้ทำ index ผสมโดยเอา FK นำหน้า (เช่น `(OwnerUserId, CreationDate)`) แทนการมี index แยก
- ยังต้องชั่งต้นทุนการเขียนตาม IX-08

**หาคอลัมน์ FK ที่ยังไม่มี index:**

```sql
-- PostgreSQL: FK ที่คอลัมน์แรกไม่ได้นำหน้า index ใดเลย
SELECT c.conrelid::regclass AS table_name, c.conname AS fk_name,
       a.attname AS fk_column
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
WHERE c.contype = 'f'
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i
    WHERE i.indrelid = c.conrelid AND i.indkey[0] = c.conkey[1]
  );

-- SQL Server: FK ที่คอลัมน์แรกไม่ได้เป็นคอลัมน์แรกของ index ใดเลย
SELECT OBJECT_NAME(fk.parent_object_id) AS table_name, fk.name AS fk_name,
       COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS fk_column
FROM sys.foreign_keys fk
JOIN sys.foreign_key_columns fkc
  ON fkc.constraint_object_id = fk.object_id AND fkc.constraint_column_id = 1
WHERE NOT EXISTS (
  SELECT 1 FROM sys.index_columns ic
  WHERE ic.object_id = fkc.parent_object_id
    AND ic.column_id = fkc.parent_column_id
    AND ic.key_ordinal = 1
);
```

- ตัวอย่างใน Stack Overflow database (ที่คลิปใช้) อาจไม่มี FK constraint ประกาศไว้จริง — หลักการเดียวกันใช้กับ "คอลัมน์ที่ใช้ join ไปหาตารางอื่น" ทุกตัว ไม่ว่าจะประกาศ FK หรือไม่

---

## IX-10 — เลือก Clustered Key: IDENTITY vs UUID v4 vs UUID v7 / NEWSEQUENTIALID

**หลัก:** ใน SQL Server, PRIMARY KEY จะกลายเป็น clustered index โดย default ซึ่งก็คือ "ตัวตาราง" ที่เรียงตาม key บน page ขนาด 8 KB ลำดับที่ค่า key ใหม่เข้ามาจึงกำหนดว่า insert จะไปเขียนที่ไหน

| Key | แถวใหม่ไปลงที่ | ผล |
|---|---|---|
| `INT/BIGINT IDENTITY` | ท้าย page สุดท้ายเสมอ | page เต็มแน่น, ไม่มี page split กลางตาราง, insert อ่านน้อย |
| UUID v4 / `NEWID()` (สุ่ม) | page ใดก็ได้กลางตาราง | page split ไม่หยุด, page ใช้ไปราว 50–70%, fragmentation สูง, ต้องดึง page เก่าขึ้น buffer pool ทุกครั้งที่ insert |
| UUID v7 / `NEWSEQUENTIALID()` / ULID (เรียงตามเวลา) | ใกล้ท้ายตาราง | พฤติกรรมใกล้ IDENTITY แต่ยังได้ id ที่ไม่เดาง่ายและสร้างฝั่งแอปได้ |

**ตัวเลขจากคลิป (devhopsss, Index series EP.03–05, `CHAR(2000)` ≈ 4 แถว / page):**
- `WHERE Id = 3` บน clustered index = Clustered Index Seek, 4 logical reads
- ตาราง UUID ทดลองเล็กๆ: insert หนึ่งแถวที่ต้องแทรกกลาง page เต็ม = page split, 8 reads (แถวที่ต่อท้ายได้ใช้ราว 2 reads)
- ข้อมูลเท่ากัน: UUID v4 = **fragmentation 99.92%, 1,458 pages** vs UUID v7 = **0.9%, 1,080 pages** (v4 ใช้พื้นที่มากกว่าราว 35%)
- `ALTER INDEX ... REBUILD` ทำให้ v4 กลับเป็น 1.1% / 1,000 pages แต่หลังจากนั้นไม่นาน insert ใหม่ก็ทำให้กระจัดกระจายอีก **rebuild คือการรักษาอาการ ไม่ใช่การแก้ที่ต้นเหตุ**

**สิ่งที่ต้องแก้ / เสริมจากคลิป:**
- ผลลัพธ์ที่ไม่มี `ORDER BY` ดูเหมือนเรียงตาม PK แต่ **ไม่รับประกัน** (plan ขนาน, ใช้ index อื่น, allocation order scan) ถ้าต้องการลำดับต้องเขียน `ORDER BY`
- fragmentation % มีผลหลักต่อ range scan ที่อ่านจาก disk; บน SSD และข้อมูลที่อยู่ใน RAM แล้ว ปัญหาที่หนักกว่าคือ **page density ต่ำ** (page มากขึ้น = RAM, I/O, backup มากขึ้น) และ page split ที่เขียน log เพิ่ม
- ทุก nonclustered index เก็บ clustered key ไว้ด้วย key 16 byte (UUID) จึงทำให้ **ทุก index ใหญ่ขึ้น** เมื่อเทียบกับ `INT` 4 byte หรือ `BIGINT` 8 byte
- เก็บ UUID เป็น `UNIQUEIDENTIFIER` (16 byte) ห้ามเก็บเป็น `CHAR(36)` / `VARCHAR(36)` (36+ byte, เทียบช้ากว่า) ใน MySQL ใช้ `BINARY(16)` + `UUID_TO_BIN(uuid, 1)` และใน PostgreSQL ใช้ type `uuid`
- ⚠️ SQL Server เรียง `uniqueidentifier` ด้วยไบต์กลุ่มสุดท้ายก่อน **UUID v7 ที่สร้างจากแอปจึงอาจไม่เรียงใน SQL Server** ต้องทดสอบด้วย fragmentation จริง หรือใช้ `NEWSEQUENTIALID()` (ใช้ได้เฉพาะเป็น `DEFAULT`, เรียงต่อเนื่องถึงแค่ตอน restart เครื่อง) ส่วน PostgreSQL / MySQL (`BINARY(16)`) เรียงตามไบต์ ใช้ v7 ได้ตรงๆ
  - คลิป EP.06 วัดให้เห็น (insert ข้อมูลเท่ากัน 4 แบบ): UUID v7 มาตรฐานเก็บใน `uniqueidentifier` → **fragmentation 99.04%, 1,455 pages** (แย่พอๆ กับ v4) · v7 / v1 ที่จัดไบต์ให้เข้ากับวิธีเรียงของ SQL Server → ราว 43–47%, ~1,570 pages · UUID v7 เก็บเป็น `BINARY(16)` → **0.9%, 1,000 pages** ดังนั้นถ้าต้องใช้ v7 ใน SQL Server ให้เก็บเป็น `BINARY(16)` หรือสลับไบต์ให้ตรงกับลำดับการเรียงของ SQL Server แล้ววัด fragmentation ยืนยัน
- PostgreSQL ไม่มี clustered index ถาวร (ตารางเป็น heap) แต่ B-tree ของ PK ก็ยังกระจัดกระจาย / บวมจาก UUID v4 เหมือนกัน

**แนวทางเลือก:**
1. ค่าเริ่มต้น: `BIGINT IDENTITY` (หรือ `GENERATED ALWAYS AS IDENTITY`) เป็น PK / clustered key
2. ต้องการ id สาธารณะที่เดาไม่ได้: ใช้ PK เป็นตัวเลข + คอลัมน์ `public_id` UUID แยกพร้อม unique nonclustered index หรือใช้ UUID v7 เป็น PK
3. ไม่ใช้ UUID v4 เป็น clustered key ในตารางที่ insert เยอะ ถ้าจำเป็นต้องใช้ ให้ทำ clustered index ไว้ที่คอลัมน์อื่น (เช่น `BIGINT IDENTITY`) และทำ PK เป็น `NONCLUSTERED`

ตรวจดู fragmentation และ page density:

```sql
SELECT OBJECT_NAME(ips.object_id) AS table_name, i.name,
       ips.avg_fragmentation_in_percent, ips.avg_page_space_used_in_percent, ips.page_count
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'SAMPLED') ips
JOIN sys.indexes i ON i.object_id = ips.object_id AND i.index_id = ips.index_id
WHERE ips.page_count >= 1000
ORDER BY ips.avg_fragmentation_in_percent DESC;
```

---

## IX-11 — Composite Index: ลำดับคอลัมน์สำคัญ (leftmost prefix)

**หลัก:** index `(A, B)` เรียงข้อมูลตาม A ก่อน แล้วจึงเรียง B **ภายใน A เดียวกัน** เหมือนสมุดโทรศัพท์ที่เรียงนามสกุลแล้วตามด้วยชื่อ จึง seek ได้เมื่อ query กรอง A (หรือ A + B) แต่ถ้ากรอง B อย่างเดียว ค่า B จะกระจายอยู่ทั่วทั้ง index และต้อง scan

**ตัวเลขจากคลิป (Users, `NCIX_Users_DisplayName_Location ON Users(DisplayName, Location)`):**

| WHERE | Plan | logical reads |
|---|---|---|
| `DisplayName = 'Alex' AND Location = 'Boston, MA'` | Index Seek | 4 |
| `DisplayName = 'Alex'` | Index Seek (831 แถว, ประเมินตรง 831 of 831) | ไม่กี่ page |
| `Location = 'Belgium'` | Index **Scan** (ทั้ง index) | 1,595 |

**กฎเลือกลำดับคอลัมน์:**
1. คอลัมน์ที่กรองด้วย **เท่ากับ (`=`)** ไว้หน้า ส่วนคอลัมน์ที่กรองด้วย **ช่วง** (`>`, `<`, `BETWEEN`, `LIKE 'x%'`) หรือ `ORDER BY` ไว้ท้าย เพราะหลังคอลัมน์ช่วงแล้ว คอลัมน์ถัดไปจะใช้ seek ไม่ได้ (กลายเป็น residual predicate)
   - เช่น `WHERE customer_id = @c AND created_at >= @d ORDER BY created_at` ใช้ `(customer_id, created_at)` ไม่ใช่ `(created_at, customer_id)`
2. เลือกคอลัมน์หน้าให้ตรงกับ **query ที่มีอยู่จริงมากที่สุด** แทนกฎ "selectivity สูงไว้หน้า" แบบตายตัว เมื่อเป็นเงื่อนไข `=` ทั้งคู่ ลำดับแทบไม่มีผลต่อ seek นั้น แต่มีผลกับ query อื่นที่กรองแค่คอลัมน์เดียว
3. index `(A, B)` ทำให้ index `(A)` เดี่ยวซ้ำซ้อน (ลบได้หลังตรวจ IX-08) แต่ **ไม่** ครอบคลุม query ที่กรอง `B` อย่างเดียว ซึ่งต้องมี `(B)` หรือ `(B, A)` ของตัวเอง
4. คอลัมน์ที่แค่อยู่ใน SELECT ให้ใส่ `INCLUDE` (IX-02) ไม่ต้องเป็น key

**สิ่งที่ต้องแก้ / เสริมจากคลิป:**
- กรอง B อย่างเดียวไม่ได้ "ใช้ index ไม่ได้" มันยังใช้ได้แบบ **scan** ซึ่งอาจถูกกว่า scan ตารางเพราะ index แคบกว่า แต่ไม่ใช่ seek
- Oracle (index skip scan), MySQL 8.0.13+ (skip scan) และ PostgreSQL 18 (skip scan บน B-tree) ข้ามคอลัมน์หน้าได้ในบางกรณีเมื่อคอลัมน์หน้ามีค่าน้อย แต่ SQL Server ไม่มี feature นี้ อย่าออกแบบโดยพึ่ง skip scan
- MySQL / PostgreSQL ใช้หลัก leftmost prefix เหมือนกัน

---

## IX-12 — โครงสร้าง B+Tree: ทำไม seek ใช้ reads เท่าจำนวนชั้น

**หลัก:** index ทุกตัว (clustered และ nonclustered) ใน SQL Server, PostgreSQL และ MySQL InnoDB เป็น B+Tree ที่แต่ละ node คือ page หนึ่งหน้า (8 KB ใน SQL Server / PostgreSQL, 16 KB ใน InnoDB)

| ชั้น | `index_level` | เก็บอะไร |
|---|---|---|
| Root | สูงสุด | page เดียว ชี้ไปหน้าลูก (ค่า key แรกของแต่ละหน้า + page id) |
| Intermediate | 1 … n-1 | page ชี้ทาง แบบเดียวกับ root |
| Leaf | 0 | **clustered:** ตัวแถวข้อมูลจริงทั้งแถว · **nonclustered:** key + คอลัมน์ `INCLUDE` + row locator (clustered key หรือ RID ถ้าเป็น heap) · leaf page ต่อกันเป็น linked list จึง range scan ได้ |

- **Seek หนึ่งค่า = reads เท่าความลึกของ tree** (root → intermediate → leaf) ไม่ขึ้นกับจำนวนแถวตรงๆ
  - คลิป (devhopsss B+Tree EP.02, `CHAR(4000)` ≈ 2 แถว / page, 1,245 แถว): Root 1 page · Intermediate 2 pages · Leaf 623 pages → seek ด้วย PK = **3 reads**
  - เพราะหนึ่ง page ชี้ทางได้หลายร้อยถึงหลายพันหน้า tree จึงลึกแค่ 3–4 ชั้นแม้ข้อมูลหลายร้อยล้านแถว ตัวเลข "seek = 3–4 reads" ใน IX-01 / IX-02 / IX-10 มาจากตรงนี้
- **Key ยิ่งกว้าง tree ยิ่งลึก/ใหญ่:** key กว้าง → ต่อ page ชี้ทางได้น้อยลง → มีชั้นและ page มากขึ้น (อีกเหตุผลที่ไม่ใช้ key เป็น string ยาว หรือ UUID ถ้าไม่จำเป็น ดู IX-10)
- **Nonclustered + ต้องการคอลัมน์อื่น** = seek ใน nonclustered (3 reads) + Key Lookup เข้า clustered อีกราว 3 reads **ต่อแถว** นี่คือเหตุที่ lookup หลายพันแถวแพง (IX-02) และเกิด tipping point (IX-01)

ดูโครงสร้างจริงของ index:

```sql
-- SQL Server
SELECT i.name, ips.index_level, ips.page_count, ips.record_count
FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('dbo.Orders'), NULL, NULL, 'DETAILED') ips
JOIN sys.indexes i ON i.object_id = ips.object_id AND i.index_id = ips.index_id
ORDER BY i.name, ips.index_level DESC;
-- PostgreSQL: CREATE EXTENSION pageinspect; SELECT * FROM bt_metap('orders_pkey');  -- level = ความลึก
```

**แก้ความเข้าใจผิดที่พบบ่อย:** `DBCC IND` / `DBCC PAGE` ที่คลิปใช้เป็นคำสั่ง undocumented ใช้เรียนรู้ใน dev ได้ แต่อย่ารันบน production ให้ใช้ `sys.dm_db_database_page_allocations` / `sys.dm_db_page_info` (SQL Server 2019+) แทน
