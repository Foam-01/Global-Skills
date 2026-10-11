# #08 Code Quality & Architecture · #16 Maintainability Review · #34 Maintainability Review

**Phase:** Planning & Architecture  
**สกิลที่รับผิดชอบ:** architecture-reviewer, refactoring-engineer

## ✅ เกณฑ์ผ่าน

- [ ] โครงสร้างโฟลเดอร์และการแบ่ง layer สม่ำเสมอทั้งโปรเจกต์
- [ ] ไม่มีโค้ดซ้ำที่เป็น logic เดียวกันหลายจุด และไม่มีฟังก์ชันยาวจนอ่านไม่ออก
- [ ] Technical debt ที่รู้อยู่ถูกจดไว้ ไม่ได้ซ่อน

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

> ข้อ #08, #16, #34 ตรวจเรื่องเดียวกันจากคนละมุม ใช้ Prompt ทุกชุดในไฟล์นี้ประกอบกัน

---

## 📝 Prompt #08 — Code Quality & Architecture

_ตรวจสอบ Code Quality, Folder Structure, SOLID, DRY, NestJS และ Next.js Architecture_

```text
08 — 🧱 CODE QUALITY / ARCHITECTURE
ตรวจสอบ Code Quality และ Software Architecture ของโปรเจกต์ทั้งหมด โดยห้ามเปลี่ยนพฤติกรรมของระบบ

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

ตรวจสอบ

- Folder Structure
- Naming
- Separation of Concerns
- SOLID
- DRY
- Single Responsibility
- Reusable Component
- Duplicate Code
- Dead Code
- Unused Import
- Unused Variable
- Function ที่ยาวเกินไป
- Component ที่ใหญ่เกินไป
- TypeScript any
- Magic Number
- Magic String
- Error Handling
- Dependency
- Circular Dependency
- Coupling
- Cohesion
- Abstraction
- DTO
- Service
- Controller
- Repository
- Module
- Dependency Injection

NestJS

- Module Structure
- Controller
- Service
- DTO
- Guard
- Interceptor
- Pipe
- Exception Filter
- Dependency Injection

Next.js

- Server Component
- Client Component
- Component Boundary
- Data Fetching
- State Management
- Shared Component

ข้อกำหนด

- ห้ามเปลี่ยน Business Logic
- ห้ามเปลี่ยน API Contract
- ห้ามเปลี่ยน Database
- ห้าม Refactor เพียงเพราะ "สวยกว่า"
- ต้องมีเหตุผลทาง Maintainability หรือ Performance
- วิเคราะห์ก่อนแก้
- ระบุ Risk ของ Refactor ทุกครั้ง
```

---

## 📝 Prompt #16 — Maintainability Review

_ตรวจสอบว่าโค้ดและโปรเจกต์ดูแลต่อในอนาคตได้ง่ายหรือไม่_

```text
16. 🧩 Maintainability Review
เป้าหมาย: ตรวจสอบว่าโค้ดและโปรเจกต์ดูแลต่อในอนาคตได้ง่ายหรือไม่
ตรวจสอบ Maintainability ของโปรเจกต์ทั้งหมด
โดยห้ามเปลี่ยน Business Logic หรือพฤติกรรมของระบบ
โดยไม่ได้รับอนุญาต

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

เป้าหมาย

ตรวจสอบว่าโปรเจกต์สามารถดูแล แก้ไข และพัฒนาต่อได้ง่ายหรือไม่
โดยเฉพาะเมื่อมี Developer คนอื่นเข้ามารับช่วงต่อ

ไม่ใช่ตรวจเพียงว่า "โค้ดทำงานได้หรือไม่"

==================================================
1. Code Readability
==================================================

ตรวจสอบ

- Code อ่านเข้าใจง่ายหรือไม่
- Naming ของ Variable
- Naming ของ Function
- Naming ของ Component
- Naming ของ Class
- Naming ของ Method
- Naming ของ File
- Naming ของ Folder
- Function ที่ซับซ้อนเกินไป
- Conditional ที่อ่านยาก
- Nested Code ที่ลึกเกินไป
- Comment ที่ไม่จำเป็น
- Comment ที่ไม่ตรงกับ Code

ตรวจสอบว่า Developer คนอื่นสามารถอ่าน Code
และเข้าใจได้โดยไม่ต้องถามคนเขียนหรือไม่

==================================================
2. Function / Method
==================================================

ตรวจสอบ

- Function ที่ยาวเกินไป
- Function ที่ทำหลายหน้าที่
- Function ที่มี Parameter มากเกินไป
- Function ที่มี Nested Condition มากเกินไป
- Function ที่มี Side Effect
- Function ที่ควรแยกออกเป็น Function ย่อย

ตรวจสอบหลัก Single Responsibility

หนึ่ง Function ควรมีหน้าที่หลักที่ชัดเจน

==================================================
3. Component
==================================================

สำหรับ Frontend ตรวจสอบ

- Component ที่ใหญ่เกินไป
- Component ที่ทำหลายหน้าที่
- Component ที่มี Logic มากเกินไป
- Component ที่ควรแยกเป็น Component ย่อย
- Component ที่ใช้ซ้ำได้แต่ไม่ได้ทำเป็น Reusable Component
- Component ที่มี Props มากเกินไป
- Component ที่มี State มากเกินไป

ห้ามแยก Component เพียงเพื่อให้จำนวนไฟล์เพิ่มขึ้น
ต้องมีเหตุผลด้าน Maintainability หรือ Reusability

==================================================
4. Code Duplication
==================================================

ตรวจสอบ

- Code ที่เขียนซ้ำ
- Function ที่ทำงานเหมือนกัน
- Validation ที่ซ้ำ
- API Logic ที่ซ้ำ
- UI Logic ที่ซ้ำ
- Database Query ที่ซ้ำ
- Utility ที่ซ้ำ

หากพบ Code ซ้ำ

ให้วิเคราะห์ก่อนว่า

- ควรทำเป็น Shared Function หรือไม่
- ควรทำเป็น Utility หรือไม่
- ควรทำเป็น Component หรือไม่
- หรือการแยกออกจะทำให้ Code ซับซ้อนกว่าเดิม

อย่า Refactor Code ซ้ำทุกกรณีโดยอัตโนมัติ

==================================================
5. Folder Structure
==================================================

ตรวจสอบ

- Folder Structure
- Feature Structure
- Module Structure
- Shared Folder
- Component Folder
- Service Folder
- Utility Folder
- DTO
- Types
- Hooks
- Repository

ตรวจสอบว่าไฟล์ถูกจัดอยู่ในตำแหน่งที่เหมาะสมหรือไม่

==================================================
6. Architecture
==================================================

ตรวจสอบ

- Separation of Concerns
- Single Responsibility
- Dependency Direction
- Coupling
- Cohesion
- Abstraction
- Reusability
- Modularity

ตรวจสอบว่า

UI
ไม่ควรรับผิดชอบ Business Logic ทั้งหมด

Controller
ไม่ควรรับผิดชอบ Business Logic ทั้งหมด

Service
ไม่ควรรับผิดชอบทุกอย่าง

Database Logic
ไม่ควรกระจายอยู่ทั่วโปรเจกต์โดยไม่มีโครงสร้าง

==================================================
7. Documentation
==================================================

ตรวจสอบ

- README
- Installation
- Environment Setup
- Development Setup
- Production Setup
- API Documentation
- Database Documentation
- Architecture Documentation
- Authentication Flow
- Deployment Documentation

ตรวจสอบว่า Developer ใหม่สามารถ Clone Project
และเริ่มต้น Project ได้โดยไม่ต้องถามคนเขียนหรือไม่

==================================================
8. Technical Debt
==================================================

ค้นหา

- TODO
- FIXME
- Temporary Code
- Workaround
- Hardcoded Value
- Deprecated Code
- Legacy Code
- Code ที่รู้ว่ามีปัญหาแต่ยังไม่ได้แก้

จัดลำดับ

Critical
High
Medium
Low

==================================================
ข้อกำหนดสำคัญ
==================================================

- ห้าม Rewrite โปรเจกต์
- ห้ามเปลี่ยน Business Logic
- ห้ามเปลี่ยน API Contract
- ห้ามเปลี่ยน Database โดยไม่ได้รับอนุญาต
- ห้ามแยก File หรือ Component โดยไม่มีเหตุผล
- ห้ามเพิ่ม Abstraction ที่ไม่จำเป็น
- ต้องแสดง Root Cause
- ต้องอธิบายผลกระทบ
- ต้องเสนอแนวทางแก้ก่อน
- ต้องรอการอนุมัติจากผมก่อนแก้ไข

หลังแก้เสร็จให้สรุป

Before
↓
ปัญหา
↓
เหตุผล
↓
การแก้ไข
↓
After
↓
ผลต่อ Maintainability
```

---

## 📝 Prompt #34 — Maintainability Review

_ตรวจสอบ Code Duplication, Function Size, Coupling, Cohesion, Technical Debt & Architecture_

```text
34. MAINTAINABILITY
ตรวจสอบ Maintainability ของ Codebase

โดยห้ามเปลี่ยน Behavior ของระบบ

==================================================
ตรวจสอบ

- Code Duplication
- Function ขนาดใหญ่
- Class ขนาดใหญ่
- Module ที่รับผิดชอบหลายอย่าง
- Naming
- Dependency
- Coupling
- Cohesion
- Complexity
- Dead Code
- Technical Debt

==================================================
ตรวจสอบ Architecture

ว่า

Module A
↓
เรียก
↓
Module B
↓
เรียก
↓
Module C

มี Dependency ที่ซับซ้อนเกินไปหรือไม่

==================================================
เป้าหมาย

Developer คนใหม่
ควรสามารถเข้าใจ Code
ได้โดยไม่ต้องถามผู้เขียนทุกเรื่อง

==================================================
ข้อกำหนด

- ห้าม Refactor เพียงเพื่อความสวย
- ต้องมีเหตุผล
- ต้องไม่เปลี่ยน Behavior
- ต้องเสนอ Refactor ก่อน
```
