# F04 Responsive / Adaptive UI

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** impeccable (`adapt`)

## ✅ เกณฑ์ผ่าน

- [ ] ไม่มี RenderFlex overflow บนจอเล็ก, tablet, แนวนอน และเมื่อขยายตัวอักษร 200%
- [ ] เนื้อหาไม่ถูก notch / status bar / navigation bar / คีย์บอร์ดบัง (ใช้ SafeArea ถูกจุด)

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F04

_จอเล็ก/ใหญ่ Tablet แนวตั้ง/นอน Safe Area Dynamic Text_

```text
F04 — 📐 RESPONSIVE / ADAPTIVE UI

เป้าหมาย

ให้แอปแสดงผลถูกต้องในทุกขนาดหน้าจอและทุกการตั้งค่าของผู้ใช้

ตรวจสอบ Responsive และ Adaptive UIของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยนดีไซน์หลักและฟังก์ชันการทำงาน

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

ขนาดและทิศทางหน้าจอ

- Small Screen
- Large Screen
- Tablet
- Portrait
- Landscape
- Foldable / Large Layout

พื้นที่ระบบ

- Safe Area
- Notch
- Status Bar
- Navigation Bar
- Keyboard (ไม่บังช่องกรอก)

การตั้งค่าผู้ใช้

- Dynamic Text
- Accessibility Font (ขยายตัวอักษร)

Overflow

- RenderFlex Overflow
- ค่า Fixed Width / Height ที่อาจทำให้พัง
- ใช้ LayoutBuilder / MediaQuery / Flexible อย่างเหมาะสมหรือไม่

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
