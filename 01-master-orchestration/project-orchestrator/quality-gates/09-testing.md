# #09 Testing & Quality Assurance · #26 Testing Strategy Review

**Phase:** Testing & Security  
**สกิลที่รับผิดชอบ:** testing-engineer

## ✅ เกณฑ์ผ่าน

- [ ] Flow หลักทุกเส้นมี test (อย่างน้อย integration หรือ E2E)
- [ ] มี negative / edge case test สำหรับ validation และ permission
- [ ] Test ผ่านทั้งหมดใน CI โดยไม่มีการแก้ production code เพื่อให้ test ผ่าน

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

> ข้อ #09, #26 ตรวจเรื่องเดียวกันจากคนละมุม ใช้ Prompt ทุกชุดในไฟล์นี้ประกอบกัน

---

## 📝 Prompt #09 — Testing & Quality Assurance

_ตรวจสอบ Test Coverage, Unit/Integration/E2E Test และ Edge Cases_

```text
09 — 🧪 TESTING
ตรวจสอบ Test Coverage และความสามารถในการทดสอบของโปรเจกต์ โดยห้ามเปลี่ยน Business Logic

เริ่มจากการวิเคราะห์ก่อน ห้ามเขียน Test ทันที

ตรวจสอบ

Unit Test

- Business Logic
- Utility
- Function
- Validation
- Calculation

Integration Test

- API
- Database
- Authentication
- Authorization
- External Service

E2E Test

- Login
- Register
- Logout
- Main User Flow
- Critical Feature
- Error Flow

ตรวจสอบ

- Test Coverage
- Edge Case
- Error Case
- Happy Path
- Boundary Case
- Authentication Case
- Authorization Case
- Concurrent Case
- Timeout Case

ระบุ Critical User Flow ที่ควรมี E2E Test

ข้อกำหนด

- ห้ามแก้ Production Logic เพียงเพื่อให้ Test ผ่าน
- ห้าม Mock ทุกอย่างโดยไม่จำเป็น
- Test ต้องตรวจสอบพฤติกรรมจริง
- หากพบ Bug จาก Test ให้รายงานก่อนแก้
- แสดง Coverage ก่อนและหลังหากสามารถวัดได้
```

---

## 📝 Prompt #26 — Testing Strategy Review

_ตรวจสอบ Test Coverage, Unit, Integration, E2E, Negative & Regression Tests_

```text
26. TESTING
ตรวจสอบ Testing Strategy ของโปรเจกต์ทั้งหมด
โดยห้ามเปลี่ยน Business Logic หรือพฤติกรรมของระบบ
โดยไม่ได้รับอนุญาต

เริ่มจากการวิเคราะห์ก่อน
ห้ามเขียนหรือแก้ไข Test ทันที

==================================================
1. Test Coverage
==================================================

ตรวจสอบว่าระบบมี Test ครอบคลุมส่วนสำคัญหรือไม่

ตรวจสอบ

- Authentication
- Authorization
- API
- Business Logic
- Database
- Utility
- Component
- Form
- Validation
- Error Handling

ระบุจุดที่ยังไม่มี Test

==================================================
2. Unit Test
==================================================

ตรวจสอบ Function หรือ Service
ที่สามารถทดสอบแยกได้

ตรวจสอบ

- Pure Function
- Utility
- Service
- Validation
- Business Rule

ห้ามเขียน Test เพียงเพื่อเพิ่ม Coverage
โดยไม่มีประโยชน์ในการตรวจสอบระบบ

==================================================
3. Integration Test
==================================================

ตรวจสอบการทำงานร่วมกันของ

- API
- Service
- Database
- Authentication
- External Service

ตรวจสอบว่า Component
ทำงานร่วมกันถูกต้องหรือไม่

==================================================
4. E2E Test
==================================================

ตรวจสอบ Flow สำคัญของ User

เช่น

Register
↓
Login
↓
Dashboard
↓
Create Data
↓
Update Data
↓
Logout

พิจารณา E2E สำหรับ Critical User Flow

==================================================
5. Negative Test
==================================================

ทดสอบกรณีผิดพลาด

- Invalid Input
- Unauthorized
- Forbidden
- Missing Data
- Duplicate Data
- Expired Token
- Database Error
- External API Error

==================================================
6. Regression Test
==================================================

ตรวจสอบว่า Feature ใหม่
ทำให้ Feature เดิมเสียหรือไม่

==================================================
7. Test Quality
==================================================

ตรวจสอบว่า Test

- อ่านง่าย
- Maintain ได้
- ไม่ซ้ำซ้อน
- ไม่ขึ้นกับลำดับ Test
- ไม่ขึ้นกับข้อมูลแบบ Hardcode
- ไม่ Flaky

==================================================
ข้อกำหนด
==================================================

- ห้ามเพิ่ม Test โดยไม่อธิบายเหตุผล
- ห้ามแก้ Production Code เพื่อให้ Test ผ่าน
- ห้าม Mock มากเกินความจำเป็น
- ต้องระบุ Test ที่สำคัญที่สุดก่อน
- ต้องรออนุมัติก่อนแก้ไข
```
