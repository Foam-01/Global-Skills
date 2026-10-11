# F22 Platform Integration (Android / iOS)

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** flutter-engineer

## ✅ เกณฑ์ผ่าน

- [ ] Permission ที่ขอตรงกันทั้ง AndroidManifest และ Info.plist และขอเท่าที่ใช้จริง
- [ ] Platform channel / plugin จัดการกรณีแพลตฟอร์มไม่รองรับ โดยไม่ crash

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F22

_Platform Channel, Plugin, Native Code, Permission ต่างแพลตฟอร์ม_

```text
F22 — 🔌 PLATFORM INTEGRATION (ANDROID / IOS)

เป้าหมาย

ให้ฟีเจอร์ที่พึ่ง Native ทำงานถูกต้องทั้ง Android และ iOS

ตรวจสอบ Platform Integrationของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยนพฤติกรรมของ Feature บนแพลตฟอร์มใดแพลตฟอร์มหนึ่งโดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Native

- Platform Channel (MethodChannel / EventChannel)
- Native Code (Kotlin / Swift)
- Plugin Version กับ OS Version

Permission และ Config

- Permission ใน AndroidManifest / Info.plist ครบหรือไม่
- Runtime Permission Flow แยกตามแพลตฟอร์ม
- Background Mode / Capability

ความต่างของแพลตฟอร์ม

- พฤติกรรมที่ต่างกัน Android vs iOS
- OS Version เก่า
- Device เฉพาะรุ่น

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
