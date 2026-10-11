# F32 Maintainability / Documentation / DX

**Phase:** Pre-Production & Release  
**สกิลที่รับผิดชอบ:** —

## ✅ เกณฑ์ผ่าน

- [ ] README บอกวิธี setup และรันแต่ละ flavor ได้จริงบนเครื่องใหม่
- [ ] คนใหม่เข้าใจโครงสร้างโปรเจกต์ได้จากเอกสาร โดยไม่ต้องถามคนเขียน

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F32

_README, วิธีรัน, Comment, Onboarding, ความง่ายในการดูแลต่อ_

```text
F32 — 📚 MAINTAINABILITY / DOCUMENTATION / DX

เป้าหมาย

ให้คนใหม่เข้ามารัน ทำความเข้าใจ และแก้โค้ดได้โดยไม่ต้องถามบ่อย

ตรวจสอบ Maintainability, Documentation และ Developer Experienceของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยนพฤติกรรมของแอป

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

เอกสาร

- README (ติดตั้ง รัน Build ต่อ Environment)
- เอกสาร Architecture / โครงสร้างโฟลเดอร์
- เอกสาร API ที่ใช้
- Comment ที่อธิบาย "ทำไม" ในจุดซับซ้อน

Developer Experience

- ขั้นตอน Setup ครั้งแรก
- Script / Makefile ที่ช่วยงาน
- Lint / Format / Pre-commit
- Hot Reload ใช้ได้ปกติ

การดูแลต่อ

- จุดที่ Coupling สูง
- Technical Debt ที่เสี่ยง
- Version ของ Flutter / Dart ที่ล็อกไว้ (fvm / .tool-versions)

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
