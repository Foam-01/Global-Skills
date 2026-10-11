# F11 Error Handling & Crash Reporting

**Phase:** Testing & Security  
**สกิลที่รับผิดชอบ:** debugging-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ตั้ง FlutterError.onError และ PlatformDispatcher.onError แล้ว
- [ ] ไม่มี catch ว่างที่กลืน error เงียบ
- [ ] Loading ไม่ค้างเมื่อเกิด exception และผู้ใช้มีปุ่ม Retry หรือทางกลับ

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F11

_try/catch, Exception, Global Error, Crashlytics, ข้อความ Error_

```text
F11 — 🚨 ERROR HANDLING & CRASH REPORTING

เป้าหมาย

ให้แอปจัดการข้อผิดพลาดอย่างปลอดภัย ไม่ค้าง ไม่ Crash และบอกผู้ใช้ได้เหมาะสม

ตรวจสอบ Error Handlingของแอป Flutter ทั้งหมด โดยห้ามกลืน Error เงียบๆ และห้ามเปลี่ยน Business Logic

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

ระดับโค้ด

- try / catch ครอบคลุมหรือไม่
- catch แล้วไม่ทำอะไร (Swallow Error)
- Custom Exception / Failure
- async / await ที่ไม่มี Error Path
- Loading ที่อาจค้างเมื่อเกิด Exception

ระดับแอป

- FlutterError.onError
- PlatformDispatcher.onError / runZonedGuarded
- Error Widget / หน้าจอ Fallback

ผู้ใช้

- ข้อความ Error ที่เข้าใจได้
- ปุ่ม Retry / ทางกลับ
- Timeout
- No Internet

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
