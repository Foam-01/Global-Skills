# F27 App Lifecycle & Background

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** debugging-engineer

## ✅ เกณฑ์ผ่าน

- [ ] Timer / Stream / listener หยุดเมื่อแอปเข้า background และกลับมาทำงานเมื่อ resume
- [ ] ถูกระบบ kill แล้วเปิดใหม่ ไม่ crash และไม่มีข้อมูลเพี้ยน

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F27

_Resume/Pause/Kill, Background Task, Timer, Stream, Isolate_

```text
F27 — 🔄 APP LIFECYCLE & BACKGROUND

เป้าหมาย

ให้แอปทำงานถูกต้องเมื่อถูกพักหรือกลับมา และไม่กินทรัพยากรโดยไม่จำเป็น

ตรวจสอบ App Lifecycle และงานเบื้องหลังของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยนพฤติกรรมของ Feature

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Lifecycle

- WidgetsBindingObserver / AppLifecycleState
- Resume แล้วรีเฟรชข้อมูลหรือ Token
- Pause แล้วหยุดงานที่ไม่จำเป็น
- Cold Start จาก Notification / Deep Link

งานเบื้องหลัง

- Timer / Periodic Task
- Stream / Subscription ที่ไม่ Cancel
- Isolate / compute
- Background Fetch / Workmanager

ทรัพยากร

- Polling ที่ถี่เกิน
- Location / GPS ที่เปิดค้าง
- ผลต่อ Battery

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
