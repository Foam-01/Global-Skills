# F21 Build Config / Flavors / Environment

**Phase:** Pre-Production & Release  
**สกิลที่รับผิดชอบ:** production-readiness-engineer

## ✅ เกณฑ์ผ่าน

- [ ] แยก dev / staging / prod ด้วย flavor หรือ dart-define และ build prod ไม่ชี้ไป server ทดสอบ
- [ ] ไม่มี secret อยู่ในไฟล์ .env ที่ถูก commit
- [ ] Build release ผ่าน CI ได้

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F21

_dev/staging/prod, .env, dart-define, Gradle, Xcode, CI/CD_

```text
F21 — 🏗️ BUILD CONFIG / FLAVORS / ENVIRONMENT

เป้าหมาย

ให้ Build ของแต่ละ Environment ใช้ค่าถูกต้องและทำซ้ำได้

ตรวจสอบ Build Configurationของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยนค่า Production หรือ Signing โดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Environment

- Development / Staging / Production
- Flavor / Scheme
- .env / --dart-define
- Base URL ต่อ Environment
- ค่า Default และ Override

Native Build

- build.gradle / Gradle Version
- AndroidManifest
- Info.plist
- Podfile / Xcode Configuration
- minSdk / Deployment Target

CI/CD

- Pipeline Build และ Test
- การเก็บ Secret ใน CI
- Version / Build Number อัตโนมัติ
- Reproducible Build

ข้อกำหนด

- ห้ามแสดงค่า Secret จริงในรายงาน
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
