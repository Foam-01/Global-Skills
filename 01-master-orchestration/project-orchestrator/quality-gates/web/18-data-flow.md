# #18 Data Flow Review

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** backend-api-engineer, architecture-reviewer

## ✅ เกณฑ์ผ่าน

- [ ] อธิบายเส้นทางข้อมูลหลัก Frontend → Backend → Database ได้ครบ
- [ ] มี validation ที่ขอบเขตระบบ (ฝั่ง server เสมอ) และไม่มีข้อมูลรั่วเกินที่ client ต้องใช้

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #18 — Data Flow Review

_ตรวจสอบการเดินทางของข้อมูลตั้งแต่ Frontend → Backend → Database_

```text
18. 🔄 Data Flow Review
ตรวจสอบ Data Flow ของโปรเจกต์ทั้งหมด
โดยห้ามเปลี่ยน Architecture หรือ Business Logic
โดยไม่ได้รับอนุญาต

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

เป้าหมาย

ทำความเข้าใจว่า Data เดินทางจาก User
ผ่าน Frontend → Backend → Database
และกลับมายัง User อย่างไร

==================================================
1. Frontend
==================================================

ตรวจสอบ

User Input
↓
Component
↓
State
↓
Hook
↓
API Client
↓
Request

ตรวจสอบว่า

- Data ถูก Validate หรือไม่
- Data ถูก Transform ที่ไหน
- Data ถูกเก็บใน State ที่ไหน
- มีการส่ง Data ซ้ำหรือไม่

==================================================
2. Backend
==================================================

ตรวจสอบ

Request
↓
Middleware
↓
Guard
↓
Pipe
↓
Controller
↓
Service
↓
Repository / ORM
↓
Database

ตรวจสอบว่าแต่ละ Layer มีหน้าที่อะไร

==================================================
3. Database
==================================================

ตรวจสอบ

- Data ถูกเก็บที่ไหน
- Relationship
- Foreign Key
- Transaction
- Query
- Index
- Data Transformation

==================================================
4. Response Flow
==================================================

ตรวจสอบ

Database
↓
Service
↓
Controller
↓
API Response
↓
Frontend
↓
UI

ตรวจสอบว่า Response มีข้อมูลเกินความจำเป็นหรือไม่

==================================================
5. Data Security
==================================================

ตรวจสอบ

- Sensitive Data
- Password
- Token
- Internal ID
- Personal Data
- Admin Data

ตรวจสอบว่า Data ถูกส่งไปยัง Client
โดยไม่จำเป็นหรือไม่

==================================================
6. Data Duplication
==================================================

ตรวจสอบ

- Data ถูก Fetch ซ้ำ
- Data ถูก Store ซ้ำ
- Data ถูก Transform ซ้ำ
- API ถูกเรียกซ้ำ
- Database Query ซ้ำ

==================================================
ข้อกำหนด

- ห้ามเปลี่ยน API Contract
- ห้ามเปลี่ยน Database Schema
- ห้ามเปลี่ยน Business Logic
- ต้องแสดง Data Flow ปัจจุบัน
- ต้องระบุจุดที่เป็น Bottleneck
- ต้องระบุจุดที่เกิด Data Duplication
- ต้องเสนอแนวทางก่อนแก้
- ต้องรอการอนุมัติ
```
