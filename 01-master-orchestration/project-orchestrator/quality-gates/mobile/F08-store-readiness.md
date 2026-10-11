# F08 Production / Store Readiness

**Phase:** Pre-Production & Release  
**สกิลที่รับผิดชอบ:** flutter-engineer, production-readiness-engineer

## ✅ เกณฑ์ผ่าน

- [ ] Release build (AAB / IPA) build และ sign ได้ โดย keystore / certificate ไม่อยู่ใน repo
- [ ] Version / build number เพิ่มขึ้นทุกครั้งที่ปล่อย
- [ ] มี Privacy Policy, Data Safety, คำอธิบาย permission ทุกตัว และระบบลบบัญชี (ถ้ามีการสมัคร)
- [ ] Target SDK ตรงตามข้อกำหนดล่าสุดของ Google Play

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F08

_Android, iOS และ Store: Signing, Version, Privacy, Data Safety_

```text
F08 — 🏪 PRODUCTION / STORE READINESS

เป้าหมาย

ตรวจว่าแอปพร้อมปล่อยขึ้น Google Play และ App Store

ตรวจสอบ Production และ Store Readinessของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยน Package Name / Bundle ID / Signing โดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Android

- Release Build
- AAB
- Signing
- Keystore
- Package Name
- Target SDK
- Permission
- Version Code
- ProGuard / R8

iOS

- Release Build
- Bundle ID
- Certificate
- Provisioning Profile
- Signing
- Version
- Build Number

Store

- Icon
- Screenshot
- Description
- Privacy Policy
- Data Safety
- Age Rating
- Permission Description
- Account Deletion
- Crash
- Analytics
- Release Notes

ข้อกำหนด

- ห้ามเปิดเผยหรือ Commit Keystore / Certificate / รหัสผ่านใดๆ
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
