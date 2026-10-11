# F23 Accessibility

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** flutter-engineer, impeccable (`audit`)

## ✅ เกณฑ์ผ่าน

- [ ] ปุ่มไอคอนและรูปสำคัญมี Semantics label
- [ ] เป้ากดไม่ต่ำกว่า 48×48dp บน Android และ 44×44pt บน iOS
- [ ] ขยายตัวอักษรระบบแล้วยังใช้งานได้ และ contrast ผ่าน WCAG AA

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F23

_Semantics, Screen Reader, Contrast, Touch Target, Font Scaling_

```text
F23 — ♿ ACCESSIBILITY

เป้าหมาย

ให้ผู้ใช้ทุกกลุ่มใช้แอปได้

ตรวจสอบ Accessibilityของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยนดีไซน์หลักโดยไม่จำเป็น

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Screen Reader

- Semantics Label
- TalkBack / VoiceOver
- ลำดับการโฟกัส
- รูปภาพที่มีความหมายมี Description

การมองเห็น

- Color Contrast
- ไม่ใช้สีอย่างเดียวสื่อความหมาย
- Font Scaling / Dynamic Text
- Dark Mode

การสัมผัส

- Touch Target ขนาดขั้นต่ำ
- ระยะห่างปุ่ม
- Gesture ที่ต้องมีทางเลือกอื่น

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
