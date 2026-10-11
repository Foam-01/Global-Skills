# F17 Forms & Validation

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** testing-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ทุกช่องมี validation และข้อความ error ที่เข้าใจได้
- [ ] ปุ่ม submit กันการกดซ้ำระหว่างส่ง
- [ ] คีย์บอร์ดเป็นประเภทที่ถูกต้อง (ตัวเลข, อีเมล) และไม่บังช่องที่กำลังกรอก

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F17

_Form, Validator, Input Formatter, Keyboard, Submit State_

```text
F17 — 📝 FORMS & VALIDATION

เป้าหมาย

ให้การกรอกและส่งฟอร์มถูกต้อง ปลอดภัย และใช้งานง่าย

ตรวจสอบ Forms และ Validationของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยนกฎธุรกิจของ Validation โดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Validation

- Validator ครบทุกช่อง
- Trim / Normalize ข้อมูล
- ข้อความ Error ชัดเจน
- Validate ซ้ำฝั่ง Backend

การใช้งาน

- Keyboard Type / Input Action
- Input Formatter
- Focus / Next Field
- Autofill
- ซ่อน/แสดงรหัสผ่าน

การส่ง

- ป้องกันกดซ้ำ (Double Submit)
- Loading / Disabled State
- เก็บค่าในฟอร์มเมื่อเกิด Error
- Dispose TextEditingController

ข้อกำหนด

- ต้องเปิดดูโค้ดจริงก่อนสรุปทุกข้อ ห้ามเดาจากชื่อไฟล์ ชื่อคลาส หรือชื่อฟังก์ชัน และทุกข้อสรุปต้องมี Evidence (ไฟล์ / ฟังก์ชัน / บรรทัด)
- ถ้าหาโค้ดที่เกี่ยวข้องไม่พบ ให้บอกว่า NOT FOUND ห้ามสร้างข้อมูลขึ้นมาเอง
- ห้ามเปลี่ยน Business Logic, API Contract และห้ามลบ Feature โดยไม่ได้รับอนุญาต
- ห้าม Rewrite หรือเปลี่ยน Architecture / State Management / เพิ่ม Library เพียงเพราะเป็น Best Practice ต้องมี Evidence ว่ามีปัญหาจริง
- ผลตรวจแต่ละข้อแยกเป็น PASS / ISSUE / WARNING / N/A / NEEDS MORE EVIDENCE
- แต่ละ Issue ต้องระบุ Root Cause, Impact, ระดับความเสี่ยง Critical / High / Medium / Low
- ต้องเสนอวิธีแก้อย่างน้อย 1 วิธี พร้อมข้อดี ข้อเสีย และ Risk ของการแก้ไข
- ต้องระบุไฟล์ที่จะแก้ และเสนอแผนก่อนลงมือ รอการอนุมัติจากผมก่อนแก้
- ถ้าไม่พบปัญหา ให้บอกว่า "ไม่พบปัญหา" และถ้าไม่จำเป็นต้องแก้ ให้บอกว่า "ไม่จำเป็นต้องแก้"
- ถ้าพบ Issue ที่ไม่อยู่ในรายการตรวจ ให้ตรวจและรายงานเพิ่มด้วย
```
