# #25 Diagram & System Visualization

**Phase:** Planning & Architecture  
**สกิลที่รับผิดชอบ:** architecture-reviewer, documentation-engineer

## ✅ เกณฑ์ผ่าน

- [ ] มีอย่างน้อย Architecture diagram, ERD และ Sequence diagram ของ flow หลัก
- [ ] Diagram ตรงกับโค้ดปัจจุบัน

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #25 — Diagram & System Visualization

_วิเคราะห์ Architecture, Context, Data Flow, Sequence, ERD, Component, Deployment & Security Diagrams_

```text
25. Diagram & System Visualization
ตรวจสอบและวิเคราะห์การใช้ Diagram
สำหรับโปรเจกต์ทั้งหมด

โดยมีเป้าหมายเพื่อให้สามารถเข้าใจ
Architecture, Data Flow, System Flow
และความสัมพันธ์ของ Component ต่าง ๆ
ได้โดยไม่ต้องอ่าน Code ทั้งหมด

เริ่มจากการวิเคราะห์ก่อน
ห้ามแก้ไขระบบทันที

==================================================
1. วิเคราะห์ว่าควรใช้ Diagram หรือไม่
==================================================

ตรวจสอบก่อนว่า Project มีความซับซ้อน
มากพอที่จะต้องใช้ Diagram หรือไม่

ควรพิจารณาใช้ Diagram เมื่อมี

- Frontend
- Backend
- Database
- Authentication
- External API
- Redis
- RabbitMQ
- Kafka
- File Storage
- Background Worker
- Microservices
- Docker
- Cloud Services
- Multiple Services
- Complex Business Flow

หากระบบเล็กมาก
ไม่ต้องสร้าง Diagram จำนวนมากโดยไม่จำเป็น

เป้าหมายคือ

"Diagram ต้องช่วยให้เข้าใจระบบง่ายขึ้น
ไม่ใช่เพิ่มเอกสารที่ไม่มีประโยชน์"

==================================================
2. System Architecture Diagram
==================================================

สร้างภาพรวม Architecture ของระบบ

ตัวอย่าง

User
↓
Next.js
↓
NestJS
├── Authentication
├── User Module
├── Focus Module
└── Video Module
↓
PostgreSQL

หากมี Infrastructure

NestJS
├── Redis
├── RabbitMQ
└── Object Storage

ให้แสดงความสัมพันธ์ด้วย

ตรวจสอบว่า Diagram
ตรงกับ Architecture จริงหรือไม่

ห้ามสร้าง Diagram จากสิ่งที่
ระบบไม่ได้ใช้งานจริง

==================================================
3. System Context Diagram
==================================================

แสดงระบบในมุมมองระดับสูง

แสดง

- User
- System
- External System
- External API
- Third-party Service

ตัวอย่าง

User
↓
Focus Pulse
├── Google OAuth
├── GitHub OAuth
├── Supabase
└── Video Storage

ใช้ Diagram นี้เมื่อ

- เริ่ม Project ใหม่
- อธิบายระบบให้คนอื่น
- Onboarding Developer
- อธิบายระบบกับทีม
- วิเคราะห์ Dependency

==================================================
4. Data Flow Diagram
==================================================

ตรวจสอบข้อมูลว่า

Data
↓
มาจากไหน
↓
ผ่านอะไร
↓
ถูกประมวลผลที่ไหน
↓
ถูกเก็บที่ไหน
↓
ส่งกลับไปที่ไหน

ตัวอย่าง

User
↓
Next.js
↓
NestJS
↓
Validation
↓
Service
↓
Prisma
↓
PostgreSQL
↓
Response

ใช้เมื่อ

- Debug
- Security Review
- Performance Review
- API Review
- Database Review

==================================================
5. Sequence Diagram
==================================================

ใช้เมื่อมี Flow ที่ซับซ้อน

เช่น Login

User
↓
Next.js
↓
NestJS
↓
OAuth Provider
↓
Callback
↓
NestJS
↓
Database
↓
Session / Token
↓
User

ตรวจสอบลำดับเหตุการณ์

- ใครเรียกใคร
- เรียกเมื่อไหร่
- Response กลับเมื่อไหร่
- Error เกิดตรงไหน
- Authentication เกิดตรงไหน

ควรใช้กับ

- Login
- Register
- Payment
- OAuth
- File Upload
- Background Job
- Queue
- External API
- Complex Transaction

==================================================
6. Entity Relationship Diagram
==================================================

ตรวจสอบ Database Relationship

แสดง

- Table
- Primary Key
- Foreign Key
- One-to-One
- One-to-Many
- Many-to-Many
- Constraint

ตัวอย่าง

User
│
├── FocusSession
│
├── Goal
│
└── Video

ใช้เมื่อ

- ออกแบบ Database
- Review Database
- แก้ปัญหา Query
- ตรวจสอบ Relationship
- เพิ่ม Feature

ตรวจสอบว่า ER Diagram
ตรงกับ Database Schema จริง

==================================================
7. Component Diagram
==================================================

แสดงความสัมพันธ์ของ Component

เช่น Frontend

Dashboard
├── Header
├── Sidebar
├── FocusTimer
├── Statistics
└── VideoPlayer

Backend

AuthModule
UserModule
FocusModule
VideoModule

ใช้เพื่อ

- เข้าใจ Codebase
- Refactor
- Code Review
- Onboarding
- วิเคราะห์ Dependency

==================================================
8. Deployment Diagram
==================================================

แสดงว่า Application
ถูก Deploy ที่ไหน

ตัวอย่าง

User
↓
CDN
↓
Next.js
↓
NestJS
↓
Supabase
↓
PostgreSQL

หากใช้ Docker

Internet
↓
Reverse Proxy
↓
Docker
├── Next.js
├── NestJS
├── Redis
└── Worker

ใช้เมื่อ

- Deploy Production
- Docker
- Cloud
- VPS
- Kubernetes
- Load Balancer
- CDN

==================================================
9. Authentication Flow Diagram
==================================================

แสดง Authentication Flow

ตัวอย่าง

User
↓
Login
↓
Google OAuth
↓
Callback
↓
Backend
↓
Validate User
↓
Create / Update User
↓
Session / Token
↓
Authenticated User

ต้องตรวจสอบ

- Token
- Session
- Cookie
- OAuth
- Refresh Token
- Logout

ใช้ Diagram เพื่อช่วย Security Review

==================================================
10. Business Flow Diagram
==================================================

แสดง Business Logic

ตัวอย่าง Focus Session

Start
↓
Select Duration
↓
Start Timer
↓
Focus
↓
Timer Complete
↓
Save Session
↓
Play Relaxation Video
↓
Update Statistics
↓
Complete

ใช้เมื่อ Business Logic มีหลายขั้นตอน

เช่น

- Payment
- Order
- Booking
- Approval
- Reward
- Workflow
- Focus Session

==================================================
11. Error Flow Diagram
==================================================

ไม่ควรวาดเฉพาะ Happy Path

ให้ตรวจสอบ Error Flow ด้วย

ตัวอย่าง

API Request
↓
Validation
├── Invalid → 400
│
└── Valid
      ↓
   Database
      ├── Error → 500
      │
      └── Success → 200

ตรวจสอบ

- Validation Error
- Authentication Error
- Authorization Error
- Database Error
- External API Error
- Timeout
- Retry
- Fallback

==================================================
12. Async / Queue Flow Diagram
==================================================

หากใช้

- Redis Queue
- RabbitMQ
- Kafka
- Background Worker

ให้แสดง Flow

API
↓
Queue
↓
Worker
↓
Process
↓
Database

ตรวจสอบ

- Producer
- Consumer
- Queue
- Retry
- Dead Letter
- Duplicate Message
- Idempotency

==================================================
13. Diagram สำหรับ Performance
==================================================

ใช้ Diagram วิเคราะห์

Request
↓
Frontend
↓
API
↓
Database

ตรวจสอบว่า

ส่วนไหนช้า

เช่น

API
↓
Service
↓
Query 1
↓
Query 2
↓
Query 3
↓
External API

หากพบ Bottleneck
ให้ระบุจุดที่ควรตรวจสอบเพิ่มเติม

==================================================
14. Diagram สำหรับ Security
==================================================

วิเคราะห์ Trust Boundary

ตัวอย่าง

Public Internet
        ↓
     Frontend
        ↓
     API
        ↓
 Authentication
        ↓
 Authorization
        ↓
    Database

ตรวจสอบ

- จุดที่ User ควบคุมได้
- จุดที่ต้อง Validate
- จุดที่ต้อง Authenticate
- จุดที่ต้อง Authorize
- จุดที่มี Sensitive Data
- External Service
- Trust Boundary

==================================================
15. Diagram สำหรับ Scalability
==================================================

แสดงระบบเมื่อ Traffic เพิ่มขึ้น

100 Users
↓
1 API
↓
Database

เปรียบเทียบกับ

10,000 Users
↓
Load Balancer
↓
API Instance 1
API Instance 2
API Instance 3
↓
Redis
↓
Database

วิเคราะห์ว่า

ส่วนไหน Scale ได้
ส่วนไหนเป็น Bottleneck
และส่วนไหนเป็น Single Point of Failure

==================================================
16. ตรวจสอบ Diagram กับ Code จริง
==================================================

ห้ามเชื่อ Diagram เพียงอย่างเดียว

เปรียบเทียบ

Diagram
vs
Source Code
vs
Database
vs
Deployment Configuration

หากไม่ตรงกัน

ให้ระบุ

- Diagram ผิด
หรือ
- Code ผิด
หรือ
- Architecture เปลี่ยนแล้วแต่ Diagram ไม่ได้ Update

==================================================
17. เมื่อไหร่ควรสร้าง Diagram
==================================================

แนะนำให้สร้างเมื่อ

1. เริ่ม Project ใหม่
2. Architecture ซับซ้อน
3. เพิ่ม Feature ใหญ่
4. เพิ่ม External Service
5. เพิ่ม Redis
6. เพิ่ม Queue
7. เพิ่ม Microservice
8. เปลี่ยน Database
9. เปลี่ยน Authentication
10. Deploy Production
11. Debug ปัญหาซับซ้อน
12. Security Review
13. Performance Review
14. Onboarding Developer
15. เตรียมสัมภาษณ์ / Presentation

==================================================
18. ไม่ควรใช้ Diagram เมื่อ
==================================================

- ระบบเล็กมาก
- Flow ง่ายมาก
- Diagram ไม่ช่วยเพิ่มความเข้าใจ
- Diagram มีรายละเอียดมากเกินไป
- Diagram ไม่ Update ตาม Code
- สร้าง Diagram เพียงเพื่อให้ดู Professional

==================================================
19. Diagram ที่แนะนำให้ Project มี
==================================================

สำหรับ Project ทั่วไป

ขั้นต่ำ

1. System Architecture
2. Database ERD
3. Main Data Flow

Project ที่ซับซ้อน

เพิ่ม

4. Sequence Diagram
5. Authentication Flow
6. Business Flow
7. Deployment Diagram
8. Error Flow

Project ที่เป็น Production / Distributed System

เพิ่ม

9. Queue Flow
10. Security / Trust Boundary
11. Scalability Diagram
12. Failure / Recovery Flow

==================================================
ข้อกำหนด
==================================================

- Diagram ต้องสะท้อนระบบจริง
- ห้ามสร้าง Diagram ที่ไม่ตรงกับ Code
- ห้ามสร้าง Diagram มากเกินความจำเป็น
- Diagram ต้องช่วยในการตัดสินใจ
- หาก Architecture เปลี่ยน ต้องพิจารณา Update Diagram
- ก่อนสร้าง Diagram ให้บอกว่า Diagram นี้มีไว้เพื่ออะไร
- หากไม่จำเป็นต้องใช้ Diagram ให้บอกว่าไม่จำเป็น
- ห้ามแก้ Code เพียงเพื่อให้ตรงกับ Diagram
- ห้ามเปลี่ยน Architecture โดยไม่ได้รับอนุญาต

หลังวิเคราะห์ให้สรุป

Diagram
↓
Purpose
↓
สิ่งที่ Diagram แสดง
↓
ปัญหาที่พบ
↓
ความสัมพันธ์กับ Code
↓
Recommendation
```
