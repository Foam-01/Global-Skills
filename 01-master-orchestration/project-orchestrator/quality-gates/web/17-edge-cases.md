# #17 Edge Case / Boundary Case Review

**Phase:** Testing & Security  
**สกิลที่รับผิดชอบ:** testing-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ทดสอบค่าขอบเขต: ว่าง, null, ค่าสูงสุด/ต่ำสุด, ข้อความยาวมาก, อักขระพิเศษ, ภาษาไทย
- [ ] ทดสอบการกดซ้ำ, ส่งซ้ำ และ request พร้อมกัน

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #17 — Edge Case / Boundary Case Review

_ตรวจสอบ Edge Case และ Boundary Case ของโปรเจกต์ทั้งหมด_

```text
17. 🧪 Edge Case / Boundary Case Review
ตรวจสอบ Edge Case และ Boundary Case ของโปรเจกต์ทั้งหมด
โดยห้ามเปลี่ยน Business Logic โดยไม่ได้รับอนุญาต

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

เป้าหมาย

ตรวจสอบระบบในสถานการณ์ที่ผิดปกติ
หรืออยู่นอกกรณีใช้งานปกติ

ไม่ใช่ทดสอบเฉพาะ Happy Path

==================================================
1. Input
==================================================

ตรวจสอบ

- Empty
- Null
- Undefined
- 0
- Negative Number
- Decimal
- String แทน Number
- Number แทน String
- Boolean ผิดประเภท
- String ยาวเกินไป
- Array ว่าง
- Array ขนาดใหญ่
- Object ว่าง
- Missing Field
- Extra Field

==================================================
2. Boundary
==================================================

ตรวจสอบ

- Minimum Value
- Maximum Value
- Minimum Length
- Maximum Length
- 0
- 1
- Maximum
- Maximum + 1
- วันที่ในอดีต
- วันที่ปัจจุบัน
- วันที่อนาคต

==================================================
3. Authentication
==================================================

ทดสอบ

- Login ผิด
- Password ผิด
- Email ไม่ถูกต้อง
- Account ไม่มีอยู่
- Account ถูก Disable
- Token หมดอายุ
- Token ไม่ถูกต้อง
- Logout แล้วใช้ Token เดิม
- Login พร้อมกันหลาย Device

==================================================
4. API
==================================================

ทดสอบ

- Request ซ้ำ
- Request พร้อมกัน
- Request ไม่มี Authorization
- Request ไม่มี Body
- Request Body ผิด Type
- Request ใหญ่เกินไป
- Endpoint ไม่มีอยู่
- HTTP Method ผิด

==================================================
5. Database
==================================================

ตรวจสอบ

- Data ไม่พบ
- Duplicate Data
- Foreign Key ไม่พบ
- Concurrent Update
- Transaction Failure
- Database Timeout
- Database Connection Failure

==================================================
6. User Flow
==================================================

จำลอง

- User กดย้อนกลับ
- User Refresh หน้า
- User เปิดหลาย Tab
- User ปิด Browser
- User Internet หลุด
- User กด Button ซ้ำ
- User Submit Form ซ้ำ
- User ใช้งาน Session หมดอายุ

==================================================
ข้อกำหนด

- ห้ามแก้ Business Logic เพียงเพื่อให้ Edge Case ผ่าน
- ต้องแยกว่าเป็น Bug หรือ Expected Behavior
- ต้องระบุ Impact
- ต้องระบุวิธีแก้
- ต้องรอการอนุมัติก่อนแก้ไข

หลังแก้ให้สรุป

Test Case
↓
ผลลัพธ์เดิม
↓
ปัญหา
↓
การแก้ไข
↓
ผลลัพธ์ใหม่
```
