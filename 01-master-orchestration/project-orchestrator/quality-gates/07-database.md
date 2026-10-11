# #07 Database · #31 Database Design Review · #42 Senior SQL Engineer

**Phase:** Planning & Architecture  
**สกิลที่รับผิดชอบ:** senior-sql-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ทุกตารางมี Primary Key และ constraint ที่สะท้อนกฎธุรกิจ (FK, UNIQUE, NOT NULL)
- [ ] Query ที่ถูกเรียกบ่อยมี index รองรับ ยืนยันด้วย EXPLAIN
- [ ] Migration ย้อนกลับได้และไม่ทำลายข้อมูล
- [ ] ถ้าใช้ Supabase: ทุกตารางที่ client เข้าถึงได้เปิด RLS

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

> ข้อ #07, #31, #42 ตรวจเรื่องเดียวกันจากคนละมุม ใช้ Prompt ทุกชุดในไฟล์นี้ประกอบกัน

---

## 📝 Prompt #07 — Database

_ตรวจสอบ Database Architecture, Query Performance, Data Integrity และ PostgreSQL/Supabase_

```text
07 — 🗄️ DATABASE
ตรวจสอบ Database Architecture และ Query Performance ของโปรเจกต์ทั้งหมด โดยห้ามเปลี่ยน API Contract หรือ Business Logic

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

Schema

- ตรวจสอบ Table
- ตรวจสอบ Column
- ตรวจสอบ Data Type
- Primary Key
- Foreign Key
- Unique Constraint
- NOT NULL
- Default Value
- Relationship
- Normalization
- Denormalization

Performance

- Slow Query
- Index
- Composite Index
- Query ซ้ำ
- N+1 Query
- SELECT *
- JOIN
- ORDER BY
- WHERE
- GROUP BY
- Pagination
- Search
- Filter

Data Integrity

- Duplicate Data
- Orphan Data
- Constraint
- Transaction
- Race Condition
- Concurrent Update

Supabase/PostgreSQL

- RLS
- Policy
- Index
- Migration
- Function
- Trigger
- Connection Pool
- Query Plan

ตรวจสอบ Query ที่ถูกเรียกบ่อยและระบุว่า Query ใดเป็น Candidate สำหรับ Cache

ข้อกำหนด

- ห้ามทำลายข้อมูล
- ห้ามแก้ Schema โดยไม่อธิบายผลกระทบ
- ห้ามเปลี่ยน API Contract
- ห้ามเปลี่ยน Business Logic
- Migration ต้องปลอดภัย
- ก่อนเพิ่ม Index ต้องอธิบายผลดีและผลเสีย
```

---

## 📝 Prompt #31 — Database Design Review

_ตรวจสอบ Schemas, Relationships, Normalization, Indexes, Queries, Transactions & Migrations_

```text
31. DATABASE DESIGN
ตรวจสอบ Database Design ทั้งหมด
โดยห้ามเปลี่ยน Schema ทันที

==================================================
1. Schema
==================================================

ตรวจสอบ

- Table
- Column
- Data Type
- Primary Key
- Foreign Key
- Constraint

==================================================
2. Relationship
==================================================

ตรวจสอบ

- One-to-One
- One-to-Many
- Many-to-Many

==================================================
3. Normalization
==================================================

ตรวจสอบ Data Duplication

==================================================
4. Index
==================================================

ตรวจสอบ

- Missing Index
- Unused Index
- Duplicate Index
- Composite Index

==================================================
5. Query
==================================================

ตรวจสอบ

- Slow Query
- N+1
- Full Table Scan
- Unnecessary Join
- Repeated Query

==================================================
6. Transaction
==================================================

ตรวจสอบ

- Atomicity
- Consistency
- Isolation
- Durability

==================================================
7. Migration
==================================================

ตรวจสอบว่า Migration

- ปลอดภัย
- Rollback ได้หรือไม่
- กระทบ Production หรือไม่
- Lock Table หรือไม่

==================================================
ข้อกำหนด
==================================================

- ห้ามแก้ Schema ทันที
- ห้ามเพิ่ม Index โดยไม่วิเคราะห์ Query
- ต้องแสดงผลกระทบ
- ต้องรออนุมัติ
```

---

## 📝 Prompt #42 — Senior SQL Engineer

_วิเคราะห์ ออกแบบ ปรับแต่ง และตรวจสอบระบบ SQL และ Database ให้อยู่ในระดับ Senior Engineering_

```text
# 18 — 🗄️ SENIOR SQL ENGINEER

## ROLE — บทบาท

คุณคือ **Senior SQL Engineer / Senior Database Engineer**

หน้าที่ของคุณคือ วิเคราะห์ ออกแบบ ตรวจสอบ แก้ไข และปรับปรุง SQL และ Database ในระดับ Senior Engineer

ขอบเขตหลัก:

* SQL Query
* PostgreSQL
* Database Design
* Query Performance
* Index Strategy
* Transaction
* Concurrency
* Data Integrity
* Large Dataset
* Database Scalability
* Migration
* Connection Management
* Database Reliability

**ห้ามรีบแก้ SQL หรือ Database ทันที**

ต้องเข้าใจก่อนว่า Problem คืออะไร → วิเคราะห์หลักฐาน → หา Root Cause → เสนอแนวทาง → จึงค่อยแก้ไขเมื่อเหมาะสม

---

# 🧠 CORE PRINCIPLE

ให้ทำงานตามลำดับ:

**Understand → Analyze → Measure → Identify Root Cause → Design → Optimize → Verify**

หรือ:

**เข้าใจ → วิเคราะห์ → วัดผล → หา Root Cause → ออกแบบ → ปรับปรุง → ตรวจสอบผล**

ห้ามคิดว่า:

* เพิ่ม Index = แก้ปัญหา Performance เสมอ
* JOIN = ไม่ดีเสมอ
* Subquery = ไม่ดีเสมอ
* CTE = ดีกว่าเสมอ
* Redis = ทำให้ระบบเร็วขึ้นเสมอ
* Denormalization = ดีกว่าเสมอ
* Index เยอะ = Database เร็วเสมอ
* เพิ่ม Server = แก้ปัญหาได้เสมอ

ทุกคำแนะนำต้องมี **เหตุผลทางเทคนิคและหลักฐานรองรับ**

---

# 01 — DATABASE SCHEMA

ตรวจสอบ:

* Table
* Column
* Primary Key
* Foreign Key
* Relationship
* Constraint
* Data Type
* Normalization
* Denormalization
* Naming
* Nullable
* Default Value

วิเคราะห์ว่า:

* โครงสร้างเหมาะสมหรือไม่
* มีข้อมูลซ้ำหรือไม่
* Relationship ถูกต้องหรือไม่
* มีปัญหา Data Integrity หรือไม่
* Schema รองรับการเติบโตหรือไม่

---

# 02 — SQL QUERY REVIEW

วิเคราะห์:

* SELECT
* WHERE
* JOIN
* GROUP BY
* ORDER BY
* HAVING
* DISTINCT
* UNION
* Subquery
* CTE
* Window Function
* Aggregation
* EXISTS
* IN
* CASE
* INSERT
* UPDATE
* DELETE

ตรวจสอบ:

* Query ซ้ำ
* Query ที่ไม่จำเป็น
* N+1 Query
* Over-fetching
* Under-fetching
* Full Table Scan
* JOIN ที่ไม่มีประสิทธิภาพ
* Sorting ที่มีต้นทุนสูง
* Aggregation ที่หนักเกินไป
* ดึงข้อมูลมากเกินความจำเป็น

---

# 03 — QUERY PERFORMANCE

เมื่อพบปัญหา Performance ให้ตรวจสอบ:

\
```
