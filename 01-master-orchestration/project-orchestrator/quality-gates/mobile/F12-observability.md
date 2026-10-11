# F12 Observability (Logging / Analytics / Crash)

**Phase:** Pre-Production & Release  
**สกิลที่รับผิดชอบ:** incident-response-engineer

## ✅ เกณฑ์ผ่าน

- [ ] มี crash reporting (Crashlytics / Sentry) ใน release build
- [ ] ไม่มี print / debugPrint ที่ log ข้อมูลสำคัญใน release
- [ ] Analytics ขอ consent ตามกฎหมายก่อนเก็บข้อมูล

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F12

_Logging, Crashlytics/Sentry, Analytics, Performance Monitoring_

```text
F12 — 📊 OBSERVABILITY (LOGGING / ANALYTICS / CRASH)

เป้าหมาย

ให้รู้ได้ว่าแอปมีปัญหาอะไรบนเครื่องผู้ใช้จริงโดยไม่รั่วข้อมูลสำคัญ

ตรวจสอบ Observabilityของแอป Flutter ทั้งหมด โดยห้ามเพิ่ม SDK ติดตามผู้ใช้โดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Logging

- ใช้ print / debugPrint ปนใน Release หรือไม่
- Log Level
- ข้อมูลสำคัญหลุดใน Log (Token, Password, PII)

Crash / Monitoring

- Crashlytics / Sentry
- Non-fatal Error Reporting
- Performance Monitoring
- Release / Version / User Context ที่แนบไปกับ Crash

Analytics

- Event ที่สำคัญของ Flow หลัก
- Naming ของ Event
- Consent / Privacy

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
