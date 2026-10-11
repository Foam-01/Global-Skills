# #21 Dependency / Package Review

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** security-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ไม่มี package ที่มีช่องโหว่ระดับ High / Critical (`npm audit` หรือเทียบเท่า)
- [ ] ไม่มี package ที่ไม่ได้ใช้ และ lock file ถูก commit

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #21 — Dependency / Package Review

_ตรวจสอบ Inventory, Security, Bundle Size, Necessity และ Versioning_

```text
21. 📦 Dependency / Package Review
ตรวจสอบ Dependency และ Package ทั้งหมดของโปรเจกต์
โดยห้ามเพิ่มหรือลบ Package โดยไม่ได้รับอนุญาต

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

==================================================
1. Package Inventory
==================================================

ตรวจสอบ

- Package ทั้งหมด
- Production Dependency
- Development Dependency
- Package ที่ไม่ได้ใช้งาน
- Package ที่ซ้ำซ้อน
- Package ที่ทำหน้าที่คล้ายกัน

==================================================
2. Security
==================================================

ตรวจสอบ

- Known Vulnerability
- Outdated Package
- Deprecated Package
- Unmaintained Package
- Supply Chain Risk

==================================================
3. Bundle / Performance
==================================================

ตรวจสอบ

- Package ขนาดใหญ่
- Package ที่เพิ่ม Bundle Size
- Package ที่โหลดบน Client โดยไม่จำเป็น
- Tree Shaking
- Dynamic Import

==================================================
4. Necessity
==================================================

สำหรับ Package สำคัญให้วิเคราะห์

- ใช้ทำอะไร
- จำเป็นหรือไม่
- มี Native API ที่ทำแทนได้หรือไม่
- มี Dependency ซ้ำหรือไม่
- มีทางเลือกที่เบากว่าหรือไม่

==================================================
5. Version
==================================================

ตรวจสอบ

- Version
- Lockfile
- Compatibility
- Breaking Change
- Major Version
- Minor Version
- Patch Version

ห้าม Upgrade Package แบบสุ่ม

==================================================
ข้อกำหนด

- ห้ามเพิ่ม Package โดยไม่อธิบาย
- ห้ามลบ Package ที่ยังถูกใช้งาน
- ห้าม Upgrade Major Version โดยไม่วิเคราะห์
- ต้องตรวจสอบผลกระทบ
- ต้องเสนอทางเลือกก่อนแก้
- ต้องรอการอนุมัติ
```
