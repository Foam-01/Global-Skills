# F15 API Integration

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** architecture-reviewer

## ✅ เกณฑ์ผ่าน

- [ ] ทุก request มี timeout และจัดการ status code / error response ของ backend
- [ ] Model / DTO ตรงกับ contract ฝั่ง backend (ระบุจุดที่ไม่ตรง)
- [ ] Retry มีจำนวนจำกัด และ token refresh ไม่ทำให้เกิด request วนซ้ำ

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F15

_Dio/http, Interceptor, Timeout, Retry, JSON Parsing, Contract_

```text
F15 — 🌐 API INTEGRATION

เป้าหมาย

ให้การเรียก API ถูกต้อง ตรงตาม Contract และรับมือข้อผิดพลาดได้

ตรวจสอบ การเชื่อมต่อ APIของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยน API Contract และห้ามเปลี่ยน Endpoint โดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Request

- Base URL (มาจาก Config ที่ถูกต้อง)
- HTTP Method
- Header / Authorization
- Request Body / Content-Type
- Query / Path Parameter

Response

- Status Code Handling
- JSON Parsing / DTO / Model
- Nullable และ Field ที่ไม่ตรง Contract
- Error Response ของ Backend

ความทนทาน

- Timeout
- Retry / Backoff
- Interceptor (Token Refresh / Logging)
- Cancel Request เมื่อออกจากหน้า
- Duplicate Request

ข้อกำหนด

- ต้องเทียบ Flutter Request กับ Backend Contract ถ้ามีเอกสารหรือโค้ดฝั่ง Backend และระบุจุดที่ไม่ตรงกัน
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
