# F06 Mobile Security

**Phase:** Testing & Security  
**สกิลที่รับผิดชอบ:** security-engineer, security-audit

## ✅ เกณฑ์ผ่าน

- [ ] Token / ข้อมูลลับเก็บใน Secure Storage ไม่ใช่ SharedPreferences
- [ ] ไม่มี API key / secret hard-code ในแอปหรือใน git history
- [ ] ทุกการเชื่อมต่อเป็น HTTPS และ Log / Crash report ไม่มีข้อมูลสำคัญ
- [ ] Release build เปิด obfuscation

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F06

_Auth, Token, Secure Storage, HTTPS, Pinning, WebView, Logs_

```text
F06 — 🔐 MOBILE SECURITY

เป้าหมาย

หาช่องโหว่ด้านความปลอดภัยของแอปมือถือ อันนี้ให้ความสำคัญสูงมาก

ตรวจสอบ Securityของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยน Business Logic หรือ Authentication Flow โดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Authentication / Authorization

- Authentication
- Authorization
- Token
- Refresh Token

ข้อมูลลับ

- Secure Storage
- API Key
- Secret (ตรวจว่าไม่ถูก Hardcode หรือหลุดขึ้น Git)
- Sensitive Data

การสื่อสาร

- HTTPS
- TLS
- Certificate
- Certificate Pinning

พื้นผิวโจมตี

- Deep Link
- WebView
- Clipboard
- Screenshot
- File Access
- Permission

Build และ Log

- Logs (ไม่มีข้อมูลสำคัญ)
- Crash Report (ไม่มีข้อมูลสำคัญ)
- Debug Build
- Reverse Engineering / Obfuscation

ข้อกำหนด

- ห้ามลด Security เพื่อแก้ปัญหาอื่น และห้าม Hardcode Secret
- ห้ามสร้าง Security Finding โดยไม่มี Evidence
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
