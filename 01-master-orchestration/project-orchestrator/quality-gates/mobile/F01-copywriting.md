# F01 UI Text / Copywriting

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** flutter-engineer, impeccable (`clarify`)

## ✅ เกณฑ์ผ่าน

- [ ] ข้อความทุกจุดใช้ภาษาสม่ำเสมอ ไม่มีศัพท์เทคนิคที่ผู้ใช้ไม่เข้าใจ
- [ ] Error / Empty / Loading / Offline / Session Expired มีข้อความครบ และบอกผู้ใช้ว่าต้องทำอะไรต่อ
- [ ] ข้อความไม่ hard-code กระจายในโค้ด (แยกไว้ที่เดียวหรือในไฟล์ ARB)

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F01

_ตรวจข้อความทุกจุดบนหน้าจอ ปุ่ม Error Empty Loading Dialog ฯลฯ_

```text
F01 — ✍️ UI TEXT / COPYWRITING

เป้าหมาย

ทำให้ข้อความในแอปเป็นธรรมชาติ กระชับ และเหมือน Product จริง ไม่ใช่ข้อความที่ AI สร้างขึ้น

ตรวจสอบ UI Text และ Copywritingของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยนโครงสร้าง UI และฟังก์ชันการทำงาน

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

หน้าจอและองค์ประกอบ

- Screen Text
- Button
- AppBar
- Navigation
- Heading
- Placeholder
- Label
- Tooltip

สถานะและข้อความแจ้ง

- Error
- Success
- Empty
- Loading
- Dialog
- Bottom Sheet
- Snackbar
- Toast
- Notification
- Permission
- Offline
- Session Expired
- API Error

หน้าที่ต้องตรวจ

- Login
- Register
- Forgot Password
- Profile
- Settings

มุมมองที่ต้องตรวจ

- ไทย / อังกฤษ ปนกันอย่างสม่ำเสมอหรือไม่
- ศัพท์เทคนิคที่ผู้ใช้ไม่เข้าใจ
- ข้อความที่ฟังดูเป็น AI
- ความยาวเกินจำเป็น (Verbosity)
- อ่านง่ายบนจอมือถือ
- ชัดเจนว่าผู้ใช้ต้องทำอะไรต่อ
- ข้อความ Error บอกวิธีแก้หรือไม่ (Error Recovery)
- ข้อความ Hardcode ในโค้ดที่ควรแยกไปไฟล์ข้อความ

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
