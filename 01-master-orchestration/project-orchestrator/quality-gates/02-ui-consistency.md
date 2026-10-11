# #02 UI Consistency

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** impeccable (`audit`, `extract`)

## ✅ เกณฑ์ผ่าน

- [ ] สี ฟอนต์ ระยะห่าง มาจาก token / design system ชุดเดียว ไม่มีค่า hard-code กระจัดกระจาย
- [ ] Component ประเภทเดียวกัน (ปุ่ม, input, card) หน้าตาและพฤติกรรมเหมือนกันทุกหน้า

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #02 — UI Consistency

_ตรวจสอบความสม่ำเสมอของ Typography, Components และ CSS_

```text
02 — 🎨 UI CONSISTENCY
ตรวจสอบความสม่ำเสมอของ UI ทั้งเว็บไซต์ โดยห้ามเปลี่ยนฟังก์ชันการทำงาน

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

สิ่งที่ต้องตรวจสอบ

- Typography
- Font Size
- Font Weight
- Heading
- Button
- Input
- Select
- Checkbox
- Radio
- Card
- Modal
- Dialog
- Table
- Badge
- Alert
- Toast
- Icon
- Spacing
- Border Radius
- Shadow
- Color
- Dark Mode
- Light Mode
- Loading State
- Empty State
- Error State

ตรวจสอบว่า Component ที่มีหน้าที่เหมือนกันใช้รูปแบบเดียวกันหรือไม่

ตรวจสอบ UI ที่มีหน้าตาคล้ายกันแต่ใช้ CSS หรือ Component คนละแบบโดยไม่จำเป็น

ตรวจสอบ Design Token และ Reusable Component ที่ควรนำกลับมาใช้

ข้อกำหนด

- ห้ามเปลี่ยน Business Logic
- ห้ามลบฟีเจอร์
- ห้ามเปลี่ยน API
- ห้ามเปลี่ยน Database
- ห้ามเปลี่ยน UX โดยไม่มีเหตุผล
- ห้ามเพิ่ม Library โดยไม่จำเป็น
- หากพบปัญหา ให้แสดงปัญหาและเสนอแนวทางก่อนแก้
```
