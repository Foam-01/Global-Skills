# 🧱 Schema Design Playbook

> ส่วนหนึ่งของสกิล `senior-sql-engineer` — เปิดเมื่อออกแบบตาราง / เลือก data type / รีวิว migration ที่สร้างหรือแก้คอลัมน์

## SD-01 — เลือก data type ให้พอดีกับข้อมูลจริง (ไม่ใช่ "เผื่อไว้ก่อน")

```sql
-- ❌ ทุกคอลัมน์เป็น MAX "เผื่อไว้"
CREATE TABLE Employee_Profile (
  EmployeeID  INT IDENTITY(1,1) PRIMARY KEY,
  FirstName   NVARCHAR(MAX),
  PhoneNumber NVARCHAR(MAX),
  WorkStatus  NVARCHAR(MAX)
);

-- ✅ ขนาดและชนิดตามข้อมูลจริง + constraint
CREATE TABLE Employee_Profile (
  EmployeeID  INT IDENTITY(1,1) PRIMARY KEY,
  FirstName   NVARCHAR(100) NOT NULL,
  PhoneNumber VARCHAR(16)   NULL,            -- เก็บรูปแบบ E.164 เช่น +66812345678
  StatusID    TINYINT       NOT NULL
              REFERENCES EmployeeStatus(StatusID)  -- หรือ CHECK (StatusID IN (1,2,3))
);
```

### ทำไม MAX ถึงเป็นปัญหา (SQL Server) — อธิบายให้ถูก

- **ใช้เป็น key ของ index ไม่ได้** — `NVARCHAR(MAX)` / `VARCHAR(MAX)` เป็น index key ไม่ได้เลย (ใส่ได้แค่ใน `INCLUDE`) ค้นหาด้วยคอลัมน์นั้นจึงต้อง scan
- **memory grant เกินจริง** — ตอน sort / hash optimizer ประเมินขนาดข้อมูลจากขนาดที่ประกาศไว้ คอลัมน์ที่ประกาศใหญ่เกินจริงทำให้ query ขอหน่วยความจำมากเกินจำเป็น ถ้ามีหลาย query พร้อมกันอาจต้องรอคิวหน่วยความจำ (`RESOURCE_SEMAPHORE`) → **นี่คือเรื่อง "RAM" ที่จริง**
  - ตัวอย่างจริง (คลิป Data Type EP.01, `SELECT DisplayName FROM Users ORDER BY DisplayName` ~300,000 แถว): `DisplayName NVARCHAR(MAX)` → **Memory Grant 823 MB** + คำเตือนใน plan · เปลี่ยนเป็น `NVARCHAR(50)` → **43 MB** (ลด ~19 เท่า) ข้อมูลเหมือนเดิมทุกตัวอักษร
- **ค่าใหญ่อาจถูกเก็บนอกแถว** (LOB) ทำให้อ่านช้าลง และบางฟีเจอร์ (เช่น online index operation ในบางเวอร์ชัน) มีข้อจำกัดกับคอลัมน์ MAX
- **ไม่มีการตรวจความยาว** — ข้อมูลผิดปกติ (เช่น ข้อความยาวหลาย MB จากบอท) เข้ามาได้โดยไม่มีอะไรกัน
- **สิ่งที่ไม่จริง:** ข้อความสั้นใน `NVARCHAR(MAX)` **ไม่ได้กินพื้นที่ disk มากกว่า** `NVARCHAR(100)` — ทั้งคู่เป็นชนิดความยาวแปรผัน เก็บเท่าที่ใช้จริง อย่าเขียนในรายงานว่า "ประหยัดพื้นที่"

### PostgreSQL / Supabase ต่างจาก SQL Server

- `text` กับ `varchar(n)` **ประสิทธิภาพเท่ากัน** — ไม่มีปัญหา memory grant แบบ SQL Server
- นิยม `text` + `CHECK (char_length(col) <= n)` เพราะเปลี่ยนขีดจำกัดได้ง่าย (แก้ constraint ไม่ต้องแก้ชนิดคอลัมน์)
- ค่าที่ใหญ่มากถูกบีบอัด / แยกเก็บอัตโนมัติ (TOAST)
- เหตุผลที่ยังต้องจำกัดความยาว: **ความถูกต้องของข้อมูลและกันข้อมูลขยะ** ไม่ใช่ความเร็ว

### เลือกชนิดแต่ละแบบ

| ข้อมูล | แนะนำ | เหตุผล / ข้อควรระวัง |
|---|---|---|
| ชื่อ, นามสกุล | `NVARCHAR(100)` / PG `text` + CHECK | ภาษาไทยต้องเป็น Unicode (`N…` ใน SQL Server) |
| เบอร์โทร | `VARCHAR(16)` เก็บแบบ E.164 (`+66812345678`) | **ห้ามใช้ INT** (เลข 0 นำหน้าหาย) · เก็บแบบไม่มีขีด / เว้นวรรค แล้วจัดรูปแบบตอนแสดงผล · ถ้าต้องเก็บตามที่ผู้ใช้พิมพ์ (มีขีด วงเล็บ ต่อเบอร์ภายใน) ต้องเผื่อมากกว่า 15 |
| อีเมล | `VARCHAR(254)` / PG `citext` หรือ `text` + unique บน `lower()` | 254 คือความยาวสูงสุดที่ใช้งานได้จริง |
| เงิน | `DECIMAL(19,4)` หรือจำนวนเต็มหน่วยย่อย (สตางค์) | **ห้าม FLOAT / REAL** (ปัดเศษผิด) |
| สถานะที่มีหลายค่า | `TINYINT` / `SMALLINT` + ตาราง lookup หรือ CHECK · PG: `text` + CHECK หรือ enum | ดูหัวข้อ "BIT สำหรับสถานะ" ด้านล่าง |
| จริง / เท็จ | `BIT` (SQL Server) / `boolean` (PG) — ตั้งชื่อเป็นคำถาม เช่น `IsActive` | ใช้เมื่อเป็น 2 ค่าจริงๆ เท่านั้น |
| วันเวลา | `DATETIME2` / PG `timestamptz` เก็บ UTC | เลี่ยง `DATETIME` เก่า (ความละเอียดต่ำ) |
| ข้อความยาวจริง (บทความ, คำอธิบาย) | `NVARCHAR(MAX)` / PG `text` | MAX เหมาะกับข้อมูลที่ยาวจริง — ไม่ต้องกลัวใช้ ถ้าข้อมูลเป็นแบบนั้น |
| id | `INT` / `BIGINT` (ตารางที่โตเร็ว) / UUID | INT สูงสุด ~2.1 พันล้าน — ตาราง log / event ควรเป็น BIGINT ตั้งแต่แรก |

### ⚠️ BIT สำหรับสถานะ — ระวังขังตัวเองไว้ที่ 2 ค่า

`WorkStatus` แบบ `'Active' / 'Inactive'` วันนี้มี 2 ค่า แต่ในระบบจริงมักเพิ่มเป็น "ลาพัก", "พักงาน", "ลาออก", "ทดลองงาน" — ถ้าเป็น `BIT` จะต้อง migration เปลี่ยนชนิดคอลัมน์และแก้โค้ดทุกจุดที่ใช้ `0/1`
- ถ้าเป็น **ใช่ / ไม่ใช่ จริงๆ** → `BIT` ชื่อ `IsActive`
- ถ้าเป็น **สถานะ** ที่อาจมีค่าเพิ่ม → `TINYINT` + ตาราง lookup (หรือ CHECK) — ใช้พื้นที่ 1 byte เกือบเท่า BIT แต่ขยายได้

### VARCHAR vs NVARCHAR และจำนวนเต็มขนาดต่างๆ (คลิป Data Type EP.02–04 + ข้อแก้)

- **`N` = Unicode (UTF-16) ใช้ 2 byte ต่อตัวอักษร** ใน SQL Server: ข้อมูลที่เป็น ASCII แน่นอน (รหัส SKU, password hash แบบ hex / base64, token, รหัสประเทศ) ใช้ `VARCHAR` ได้ครึ่งหนึ่งของพื้นที่ ส่วนชื่อคน ที่อยู่ ข้อความภาษาไทยต้องใช้ `NVARCHAR` (หรือ `VARCHAR` + collation `_UTF8` ใน SQL Server 2019+)
  - ⚠️ คลิปบอก "`VARCHAR(50)` = 50 byte" ผิด: ชนิด `VAR…` เก็บ **ตามความยาวจริง + 2 byte** ตัวเลข 50 คือเพดาน ไม่ใช่พื้นที่ที่ใช้ (`CHAR(n)` / `NCHAR(n)` เท่านั้นที่จองเต็ม n)
  - ⚠️ อีเมล / URL ไม่ได้เป็น ASCII เสมอไป (internationalized email, โดเมนภาษาไทย) ถ้าระบบรับข้อมูลจากผู้ใช้ทั่วไปให้ตัดสินใจอย่างตั้งใจ หรือเก็บในรูป punycode
  - ⚠️ เมื่อคอลัมน์เป็น `VARCHAR` แอปต้องส่งพารามิเตอร์เป็น `VARCHAR` ด้วย (.NET / EF Core ส่ง string เป็น `NVARCHAR` โดย default) ไม่เช่นนั้นเกิด implicit conversion → index scan (IX-03)
  - PostgreSQL ไม่มีแยก `N`: `text` / `varchar` เป็น UTF-8 อยู่แล้ว ตัวอักษรไทยใช้ 3 byte
- **จำนวนเต็ม:** `TINYINT` 1 byte (0–255, SQL Server เท่านั้น; PostgreSQL เล็กสุดคือ `smallint`), `SMALLINT` 2 byte, `INT` 4 byte (~±2.1 พันล้าน), `BIGINT` 8 byte
  - ⚠️ คลิปยกตัวอย่างเก็บ "อายุ" ใน `TINYINT` แต่ **ไม่ควรเก็บอายุเลย** เพราะเปลี่ยนทุกปี ให้เก็บวันเกิด (`DATE`) แล้วคำนวณ
  - ⚠️ `OrderID` / `UserID` ที่คลิปให้ใช้ `INT` ใช้ได้กับระบบทั่วไป แต่ตารางที่โตเร็ว (order, event, log, message) ควรเป็น `BIGINT` ตั้งแต่แรก เพราะการเปลี่ยน type ของ PK + FK ทุกตัวในภายหลังแพงมาก ส่วนต่าง 4 byte ต่อแถวคุ้ม
  - การลด type เพื่อประหยัดมีผลจริงเมื่อเป็นคอลัมน์ใน **key ของ index / FK ที่ซ้ำในหลายตาราง** และตารางมีหลายสิบล้านแถว ตารางเล็กแทบไม่ต่าง อย่าเสียเวลาไล่เปลี่ยน
- **เงิน:** คลิปพิสูจน์ด้วย `SUM` ของ 150.1 + 80.2 + 23.3 + 17.8 − 21.4: `DECIMAL(10,2)` = **250.00** แต่ `FLOAT` = **250.0000000000000300** ผลรวมที่ "ดูเหมือน" 250 จึงเทียบ `= 250` ไม่ตรง / กระทบยอดบัญชีไม่ลง
  - ⚠️ `DECIMAL` ไม่ได้ "เป๊ะ 100% เสมอ" ตามที่คลิปพูด การหาร (เช่น แบ่งจ่าย 100 / 3, คิด VAT ต่อชิ้น) ยังต้องปัด ต้องกำหนดกติกาปัด (ปัดทีละรายการหรือปัดที่ยอดรวม, half-up / banker's) ให้ตรงกับระบบบัญชี และเก็บ scale ให้พอ (`DECIMAL(19,4)`)
  - หลีกเลี่ยงชนิด `MONEY` ของ SQL Server (ปัดผิดเมื่อคูณ / หารกันเอง) และ JavaScript `number` ฝั่งแอป ให้ใช้ library decimal หรือเก็บเป็นสตางค์ (`BIGINT`)

### ⚠️ อย่าเล็กเกินไปด้วย

- ข้อมูลยาวเกินขนาดที่กำหนด → insert ล้ม (SQL Server: "String or binary data would be truncated") ผู้ใช้สมัครไม่ได้
- การขยายคอลัมน์ทีหลังบนตารางใหญ่อาจต้องล็อกตารางหรือ rewrite — ดูข้อมูลจริงก่อนกำหนด (ความยาวสูงสุดที่มีอยู่, มาตรฐานของข้อมูลนั้น) แล้วเผื่อพอสมควร
- เปลี่ยนชนิดคอลัมน์ในตารางที่มีข้อมูลแล้ว = migration ที่ต้องวางแผน (ดูหมวด 13 ใน SKILL.md)

### เมื่อรีวิว schema

- คอลัมน์ `MAX` / `text` ที่ถูกใช้ใน `WHERE`, `JOIN`, `ORDER BY` หรือควรเป็น unique → แจ้ง
- ตัวเลขที่เก็บเป็นข้อความ, เงินที่เป็น FLOAT, เบอร์โทรที่เป็น INT → แจ้งเป็นบั๊กความถูกต้อง
- ชนิดของคอลัมน์ที่ใช้ join กันต้อง **ตรงกัน** (เช่น `INT` กับ `INT` ไม่ใช่ `INT` กับ `VARCHAR`) ไม่อย่างนั้นเกิดการแปลงชนิดที่ทำให้ใช้ index ไม่ได้

---

## SD-02 — อย่าเก็บไฟล์ / รูป (โดยเฉพาะ base64) ในตารางหลัก

**ปัญหา (คลิป LOB page base64):** `UPDATE Users SET Pic = 'data:image/jpeg;base64,...'`
- แถวใน SQL Server ใส่ได้ราว **8,060 byte ต่อ page** ค่าที่ใหญ่กว่านั้นใน `VARCHAR(MAX)` / `VARBINARY(MAX)` ถูกย้ายไป **LOB page** แยก แถวหลักเหลือแค่ pointer (PostgreSQL ทำแบบเดียวกันเรียกว่า TOAST เมื่อแถวเกิน ~2 KB)
- `SELECT *` หรือ `SELECT Id, Pic` ต้องตามอ่าน LOB page ทุกแถว → เห็นเป็น **lob logical reads** (คลิป: 22,970) แยกจาก logical reads ปกติ (IX-04)
- **base64 ทำข้อมูลบวมขึ้น ~33%** (3 byte → 4 ตัวอักษร) และถ้าเก็บใน `NVARCHAR` ก็บวมอีก 2 เท่า
- ผลข้างเคียงที่คลิปไม่ได้พูด: backup / restore / replication ใหญ่และช้าลง, buffer pool ถูกรูปเบียดข้อมูลที่ query ใช้จริง, API ส่ง payload ใหญ่โดยไม่ตั้งใจ

**ทางที่ถูก:**
1. อัปไฟล์ไปที่ object storage (S3, R2, GCS, Supabase Storage, Cloudinary) แล้วเก็บแค่ **object key** + metadata (`content_type`, `size_bytes`, `checksum`, `uploaded_by`) ในตาราง
2. เก็บ **key / path แบบ relative** (`profiles/user_1.jpg`) ไม่ใช่ URL เต็ม เพื่อย้าย bucket / CDN / domain ได้โดยไม่ต้อง update ทุกแถว แล้วสร้าง URL ตอนแสดงผล
3. ไฟล์ส่วนตัว (เอกสาร, บัตรประชาชน, สลิป) ใช้ **signed URL ที่หมดอายุ** + ตรวจสิทธิ์ (AP-04) ห้ามเปิด bucket public และห้ามคืน path บน server ให้ client ตรงๆ
4. ถ้าจำเป็นต้องเก็บใน database จริง (ไฟล์เล็ก, ต้อง transactional กับข้อมูล): เก็บเป็น **ไบต์ดิบ** `VARBINARY(MAX)` / `bytea` ไม่ใช่ base64, แยกไป **ตารางของมันเอง** (1:1 กับตารางหลัก) และไม่ดึงคอลัมน์นั้นใน query รายการ SQL Server มี `FILESTREAM` / FileTable สำหรับไฟล์ใหญ่
5. ตรวจขนาดและชนิดไฟล์ฝั่ง server ก่อนรับเสมอ

---

## SD-03 — ข้อมูล append-only ปริมาณมหาศาล (แชต, event, log): แบ่ง partition ตามเวลา (กรณีศึกษา Discord)

**จากคลิป devhopsss เรื่อง Discord** (อิงบทความวิศวกรรมของ Discord เอง): ข้อความหลายล้านล้านแถวเก็บใน Cassandra แล้วย้ายไป ScyllaDB ด้วย schema

```sql
CREATE TABLE messages (
  channel_id bigint, bucket int, message_id bigint, author_id bigint, content text,
  PRIMARY KEY ((channel_id, bucket), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);
```
- **partition key `(channel_id, bucket)`**: `bucket` = ช่วงเวลาคงที่ (เช่น 10 วัน) ทำให้ partition ของห้องแชตที่คุยกันมาหลายปีไม่โตไม่สิ้นสุด
- **`message_id` เป็น Snowflake ID** (เรียงตามเวลา) + clustering DESC → อ่าน "ข้อความล่าสุด 50 รายการของห้อง" ด้วยการอ่านต่อเนื่องจาก partition เดียว คือ keyset pagination (AP-08) ในระดับ storage
- ปัญหาที่เจอ: hot partition (ห้องใหญ่ที่คนอ่านพร้อมกัน), GC pause ของ JVM ทำ node ค้าง → ย้ายไป ScyllaDB (C++) และเพิ่ม data service ที่ทำ **request coalescing** (คำขออ่านข้อมูลชุดเดียวกันพร้อมกันหลายพันคำขอ ยิง database ครั้งเดียวแล้วแจกผลให้ทุกคน)

**นำมาใช้กับ SQL database (PostgreSQL / SQL Server / MySQL):**
- ไม่จำเป็นต้องย้ายไป NoSQL เพื่อหลักการเดียวกัน: **declarative partitioning ตามช่วงเวลา** (PostgreSQL `PARTITION BY RANGE (created_at)`, SQL Server partition function / scheme) + PK / index นำด้วย key ที่ query ใช้ (`(channel_id, message_id DESC)`)
- ลบข้อมูลเก่าด้วย drop / truncate partition แทน `DELETE` (ดู IX-10 เรื่อง page แหว่ง) และย้าย partition เก่าไป storage ถูกกว่าได้
- ID เรียงตามเวลา (Snowflake / UUID v7 / `BIGINT IDENTITY`) ให้ทั้ง insert ต่อท้าย (IX-10) และ keyset pagination ฟรี
- request coalescing / cache หน้า "ล่าสุด" ช่วย hot key ได้มากกว่าการเพิ่ม index
- ⚠️ partition ไม่ได้ทำให้ทุก query เร็วขึ้น: query ที่ไม่มี partition key ใน `WHERE` ต้องเปิดทุก partition (ช้ากว่าตารางเดียว) ใช้เมื่อข้อมูลใหญ่จริง (หลายร้อยล้านแถวขึ้นไป) และ query เกือบทั้งหมดกรองตาม key + ช่วงเวลา
