# F14 Navigation / Routing / Deep Link

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** flutter-engineer, architecture-reviewer, security-engineer

## ✅ เกณฑ์ผ่าน

- [ ] หน้าที่ต้อง login มี route guard และ back stack ถูกล้างหลัง login / logout
- [ ] Parameter จาก deep link ถูก validate ก่อนใช้
- [ ] Route ที่ไม่มีอยู่แสดงหน้า fallback ไม่ crash

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F14

_go_router / Navigator, Route Guard, Back Stack, Deep Link_

```text
F14 — 🗺️ NAVIGATION / ROUTING / DEEP LINK

เป้าหมาย

ให้การเปลี่ยนหน้าถูกต้องและปลอดภัยในทุกสถานะของผู้ใช้

ตรวจสอบ Navigation และ Routingของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยนโครงสร้างเส้นทางหลักโดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Routing

- การประกาศ Route
- Named Route / Path Parameter
- ส่งข้อมูลระหว่างหน้า (Type Safety)
- Route ที่ไม่มีอยู่ (404)

Guard และ Back Stack

- Auth Guard / Redirect
- Back Stack หลัง Login / Logout
- ปุ่ม Back ของ Android
- Navigation หลัง async (context.mounted)

Deep Link

- Android App Links / iOS Universal Links
- Validate Parameter จาก Deep Link
- Deep Link ตอนยังไม่ Login

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
