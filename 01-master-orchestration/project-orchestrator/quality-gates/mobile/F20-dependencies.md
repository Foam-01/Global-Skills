# F20 Dependency / Package Review

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** security-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ไม่มี package ที่เลิกดูแลหรือมีช่องโหว่ที่รู้แล้ว
- [ ] ไม่มี package ที่ไม่ได้ใช้ใน pubspec.yaml และ commit pubspec.lock แล้ว
- [ ] License ของทุก package ใช้ในเชิงพาณิชย์ได้ (ถ้าเป็นแอปเชิงพาณิชย์)

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F20

_pubspec.yaml, เวอร์ชัน, Package ที่เลิกดูแล, License, Platform Support_

```text
F20 — 📦 DEPENDENCY / PACKAGE REVIEW

เป้าหมาย

ให้ Package ที่ใช้มีเหตุผล ปลอดภัย และไม่ทำให้ Build พัง

ตรวจสอบ Dependency และ Packageของแอป Flutter ทั้งหมด โดยห้ามเพิ่ม ลบ หรืออัปเกรด Package โดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

pubspec.yaml

- เวอร์ชันที่ Lock / ช่วงเวอร์ชัน
- Package ที่ไม่ได้ใช้
- Package ที่ซ้ำหน้าที่
- dependency_overrides
- dev_dependencies ปนใน dependencies

สุขภาพของ Package

- เลิกดูแล (Discontinued / ไม่อัปเดตนาน)
- Null Safety / Dart 3
- License
- ผลต่อขนาดแอป
- รองรับ Android / iOS / Platform ที่ใช้

ความปลอดภัย

- Package ที่มีช่องโหว่ที่ทราบ
- Package ที่ขอ Permission เกินจำเป็น

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
