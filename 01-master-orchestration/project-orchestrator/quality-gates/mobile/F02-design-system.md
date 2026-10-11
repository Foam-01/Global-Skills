# F02 Design System / UI Consistency

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** impeccable (`audit`, `extract`)

## ✅ เกณฑ์ผ่าน

- [ ] สี ฟอนต์ ระยะห่าง มาจาก ThemeData / ColorScheme ไม่มีค่า hard-code กระจาย
- [ ] Widget ประเภทเดียวกันหน้าตาเหมือนกันทั้งแอป
- [ ] Dark mode และ Light mode อ่านได้ทั้งคู่ (contrast ผ่าน)

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F02

_Typography สี Spacing Component Theme Dark/Light Mode_

```text
F02 — 🎨 DESIGN SYSTEM / UI CONSISTENCY

เป้าหมาย

ให้ UI ของทั้งแอปใช้ภาษาดีไซน์เดียวกัน ไม่มี Style กระจัดกระจาย

ตรวจสอบ Design System และความสม่ำเสมอของ UIของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยน Layout หลักและฟังก์ชันการทำงาน

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Foundation

- Typography
- Color
- Spacing
- Radius
- Elevation
- Icon
- ThemeData / ColorScheme
- ค่า Hardcode (สี / ขนาด / Padding) ที่ควรอยู่ใน Theme

Component

- Button
- Input
- Card
- Dialog
- Bottom Sheet
- Component Consistency
- Widget ที่ทำซ้ำหลายที่ควรแยกเป็น Component กลาง

Theme

- Dark Mode
- Light Mode
- การสลับ Theme
- Contrast ในทั้งสองโหมด

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
