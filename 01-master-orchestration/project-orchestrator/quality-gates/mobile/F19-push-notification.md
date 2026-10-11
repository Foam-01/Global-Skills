# F19 Push Notification

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** flutter-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ขอ permission ในจังหวะที่ผู้ใช้เข้าใจเหตุผล ไม่ขอทันทีที่เปิดแอป
- [ ] FCM / APNs token ถูกอัปเดตไป backend เมื่อเปลี่ยน และลบเมื่อ logout
- [ ] แตะ notification แล้วไปหน้าที่ถูกต้อง ทั้งตอนแอปเปิด, อยู่เบื้องหลัง และถูกปิด

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F19

_FCM/APNs, Permission, Token, Foreground/Background, Tap Handling_

```text
F19 — 🔔 PUSH NOTIFICATION

เป้าหมาย

ให้การแจ้งเตือนทำงานครบทุกสถานะของแอปและเคารพการตั้งค่าผู้ใช้

ตรวจสอบ Push Notificationของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยน Payload Contract กับ Backend โดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

การตั้งค่า

- FCM / APNs Configuration
- Permission Request (Android 13+ / iOS)
- Notification Channel (Android)
- ไอคอนและเสียง

Token

- การขอและส่ง Token ไป Backend
- Token Refresh
- ลบ Token ตอน Logout

พฤติกรรม

- Foreground
- Background
- Terminated
- Tap แล้วไปหน้าที่ถูกต้อง (Deep Link)
- Denied / Permanently Denied

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
