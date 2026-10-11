# F30 Authentication & Session

**Phase:** Testing & Security  
**สกิลที่รับผิดชอบ:** security-engineer

## ✅ เกณฑ์ผ่าน

- [ ] Token อยู่ใน Secure Storage และ refresh อัตโนมัติก่อนหมดอายุ
- [ ] Logout ล้าง token, cache และ state ของผู้ใช้เดิมครบทุก layer
- [ ] Session หมดอายุแล้วพาไปหน้า login โดยไม่ crash และไม่วนซ้ำ

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F30

_Login → Token → Secure Storage → Refresh → Logout ครบทุก Layer_

```text
F30 — 🔑 AUTHENTICATION & SESSION

เป้าหมาย

ตรวจระบบ Login และ Session แบบ End-to-End ไม่ใช่แค่ API ตอบ 200

ตรวจสอบ Authentication และ Sessionของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยน Authentication Flow โดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Login

- Input / Validation
- Login Function
- API Endpoint / Method / Header / Body
- Base URL และ Environment
- Response Parsing

Token และ Session

- Access Token
- Refresh Token / Token Expiration
- Secure Storage (เก็บ อ่าน ลบ)
- Authorization Header ในทุก Request
- Unauthorized (401) Handling
- Session Expiry

State และ Navigation

- Auth State
- Navigation Guard / Redirect
- Logout (ล้าง Token / State / Cache)
- Auto Login ตอนเปิดแอป

ข้อกำหนด

- ต้อง Trace: Input → Validation → Request → Response → Token → Storage → State → Navigation และห้ามสรุปว่า Login ถูกต้องเพียงเพราะ API ตอบ HTTP 200
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
