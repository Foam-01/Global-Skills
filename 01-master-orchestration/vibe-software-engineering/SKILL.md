---
name: vibe-software-engineering
description: สกิลพิเศษสายผสมผสาน "Vibe Coding + Software Engineering" — สั่ง AI สร้างระบบรวดเร็วด้วย Vibe (Speed/UI) แต่บังคับฝังรากฐานวิศวกรรมซอฟต์แวร์ที่แข็งแกร่ง (Architecture, Security, Test, DB Schema, Clean Code) เพื่อไม่ให้ระบบถล่มเมื่อนำไปใช้จริงบน Production
---

# 🏗️ Vibe Software Engineering (Speed Above Ground, Concrete Underground)

> 💡 **ปรัชญาหลัก**: *"ตึกข้างบนต้องสวยงามสร้างได้ไว (Vibe Coding Speed) แต่ฐานใต้ดินต้องเป็นคอนกรีตเสริมเหล็กที่ไม่มีวันถล่ม (Software Engineering Foundation)"*

สกิลนี้ออกแบบมาสำหรับผู้พัฒนาที่ต้องการใช้ประโยชน์สูงสุดจาก **AI Vibe Coding** (ความรวดเร็วในการพัฒนา, UI สวยงามฉับไว, Prototype รวดเร็ว) แต่ **ไม่ยอมแลกกับความเปราะบางของระบบบน Production** โดย AI จะทำหน้าที่เป็นทั้ง **Vibe Builder** (ผู้เนรมิตโค้ดอย่างรวดเร็ว) และ **Foundation Guard** (วิศวกรผู้คุมรากฐานใต้อาคาร) ในเวลาเดียวกัน

---

## 🏛️ สถาปัตยกรรมตึก 2 ส่วน (The Dual-Layer Architecture)

```text
 ┌─────────────────────────────────────────────────────────┐
 │                   ABOVE GROUND (SURFACE)                │
 │                  ⚡ VIBE CODING SPEED                   │
 │  • Modern UI/UX         • Rapid Prototyping             │
 │  • Smooth Animations     • Fast Feature Iteration       │
 └─────────────────────────────────────────────────────────┘
  ═════════════════════════════════════════════════════════ GROUND LEVEL
 ┌─────────────────────────────────────────────────────────┐
 │                 UNDERGROUND (FOUNDATION)                │
 │               🏗️ SOFTWARE ENGINEERING GUARD            │
 │  1. Clean Architecture & Separation of Concerns         │
 │  2. Data Integrity & Schema Migration Guard             │
 │  3. Zero-Trust Input Validation & RBAC Security         │
 │  4. Automated Testing & Type Safety (Strict Mode)       │
 │  5. Structured Logging & Observability (Sentry/Loggers) │
 │  6. Technical Debt Clearance & Continuous Refactoring   │
 └─────────────────────────────────────────────────────────┘
```

---

## 🎯 6 รากฐานคอนกรีตเสริมเหล็ก (The 6 Underground Pillars)

ทุกครั้งที่ AI เขียนโค้ดหรือสร้างฟีเจอร์ใหม่ด้วย Vibe Coding AI จะต้องผ่านการตรวจรากฐาน 6 ข้อนี้เสมอ:

### 1. 🧱 Clean Architecture & Separation of Concerns (โครงสร้างไร้สปาเก็ตตี้)
- **UI Layer**: ห้ามมี Direct Database Query หรือ Complex Business Logic ใน UI Components
- **Business Layer**: แยก Business Rules และ Validation ออกเป็น Pure Functions/Services ที่ทดสอบได้ง่าย
- **Data Layer**: แยก Data Access/API Service ออกจาก Business Logic

### 2. 🗄️ Schema & Data Integrity Guard (ฐานข้อมูลแข็งแกร่ง)
- ทุก Table/Model ต้องกำหนด Primary Key, Foreign Key Constraints, Unique Indexes ชัดเจน
- ใช้ Database Migration System (Prisma / Drizzle / TypeORM) ห้ามแก้ DB สดบน Production
- กำหนด Data Validation บน Schema Level ร่วมกับ Application Level

### 3. 🛡️ Zero-Trust Security & Input Guard (ความปลอดภัยระดับโปรดักชัน)
- **Input Validation**: ใช้ `Zod` หรือ Validation Library ตรวจสอบ Request Payload ทุกจุด (Both Frontend & Backend)
- **Authorization**: เช็ค Role และ Permission บน Server-side ทุกครั้งก่อนส่งคืนข้อมูล (Never trust client)
- **Secret Isolation**: ห้ามมี API Keys, Database Credentials หรือ Tokens หลุดใน Client Bundle หรือ Source Code (ใช้ `.env` เสมอ)

### 4. 🧪 Type Safety & Automated Test Guard (ความถูกต้องและไร้ Bug เงียบ)
- ใช้ **TypeScript Strict Mode** ห้ามใช้ `any` โดยไม่จำเป็น
- เขียน **Unit Tests** สำหรับ Business Calculations / State Logic ที่สำคัญ
- เขียน **Integration Tests** สำหรับ API Endpoint สำคัญก่อน Merge งาน

### 5. 👁️ Observability & Resilience Guard (การติดตามและรับมือเมื่อเกิดเหตุ)
- **Structured Logging**: ใช้ Logger ที่ใส่ Timestamp, Request ID, User ID (ที่ไม่มี Sensitive Data)
- **Graceful Error Handling**: มี Try-Catch สอดคล้องกับ UX (Show Toast/Error Page) และส่ง Log ไปที่ Error Tracker (เช่น Sentry)
- **Fallback State**: มี Loading, Empty, และ Error UI Handle ไว้เสมอ

### 6. 🧹 Technical Debt Clearance & Refactor Phase (ขัดเงาโค้ดขยะ)
- หลังจาก AI ช่วยเขียน Draft โค้ดฉับไวเสร็จ ให้เข้าสู่ **Refactor Phase** ทันที
- กำจัด Duplicate Code, เคลียร์ Unused Imports/Variables, จัดระเบียบการตั้งชื่อให้สื่อความหมาย (Clean Code Principles)

---

## 🔄 กระบวนการทำงาน 4 ขั้นตอน (Vibe-Engineering Workflow)

```text
STEP 1: Vibe Draft ⚡    ➜ AI ร่างฟีเจอร์และ UI อย่างรวดเร็วตามโจทย์
STEP 2: Audit Pillars 🔍 ➜ ตรวจสอบ 6 รากฐานคอนกรีตใต้ดิน
STEP 3: Refactor Code 🛠️ ➜ ปรับแต่งโค้ดให้สะอาด ปลอดภัย และแข็งแรง
STEP 4: Verify & Ship 🚀 ➜ รัน Test / Build Check ก่อนส่งมอบ
```

---

## 💬 กฎการตอบสนองของ AI เมื่อเปิดใช้สกิลนี้

1. **ตอนสร้างใหม่**: เขียนโค้ดไว ได้ UI สวยงามตาม Vibe แต่จะแนบสถาปัตยกรรมปูนหล่อใต้อาคาร (Architecture + Types + Validation + Error Handling) มาในตัวด้วยเสมอ
2. **ตอนรีวิวโค้ด**: AI จะชี้จุดที่เป็น "ขยะใต้ดิน" (เช่น Spaghetti Code, Missing Validation, Hardcoded Secrets) และเสนอทางแก้เป็นเสาคอนกรีตแข็งแรงทันที
3. **ตอนตอบคำถาม**: AI จะอธิบายทั้งฝั่ง **หน้าตา/ผลลัพธ์ที่เห็น (Vibe)** และ **โครงสร้างหลังบ้านที่ปลอดภัย (Engineering)** ควบคู่กันเสมอ
