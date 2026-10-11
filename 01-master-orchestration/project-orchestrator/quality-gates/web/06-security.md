# #06 Security · #15 Production Security Review

**Phase:** Testing & Security  
**สกิลที่รับผิดชอบ:** security-engineer, security-audit

## ✅ เกณฑ์ผ่าน

- [ ] ไม่มีช่องโหว่ระดับ Critical / High ที่ยังเปิดอยู่
- [ ] ไม่มี secret อยู่ในโค้ดหรือ git history
- [ ] ทุก endpoint ตรวจ authentication และ authorization ฝั่ง server (ไม่เชื่อ client)

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

> ข้อ #06, #15 ตรวจเรื่องเดียวกันจากคนละมุม ใช้ Prompt ทุกชุดในไฟล์นี้ประกอบกัน

---

## 📝 Prompt #06 — Security

_ตรวจสอบ Authentication, Authorization, API Security, Injection และ Secrets_

```text
06 — 🔐 SECURITY
อันนี้ผมให้ความสำคัญสูงมาก
ตรวจสอบ Security ของโปรเจกต์ทั้งหมด โดยห้ามเปลี่ยน Business Logic หรือ Authentication Flow โดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Authentication

- Login
- Register
- Logout
- Password Hashing
- JWT
- Access Token
- Refresh Token
- Session
- Cookie
- Token Expiration
- OAuth
- Google Login
- GitHub Login
- Password Reset
- Email Verification

Authorization

- RBAC
- Permission
- Role
- Resource Authorization
- ตรวจสอบว่าผู้ใช้สามารถเข้าถึงข้อมูลของ User คนอื่นได้หรือไม่

API Security

- CORS
- Rate Limiting
- Input Validation
- DTO Validation
- API Authorization
- Mass Assignment
- Sensitive Data Exposure
- Error Response
- HTTP Security Headers

Injection

- SQL Injection
- NoSQL Injection
- XSS
- Command Injection
- Path Traversal

File Upload

- File Type
- File Size
- File Name
- Storage Permission
- Malicious File
- Public URL

Secrets

- ตรวจสอบ .env
- ตรวจสอบ API Key
- ตรวจสอบ Secret
- ตรวจสอบ Private Key
- ตรวจสอบข้อมูลลับที่อาจหลุดขึ้น Git
- ตรวจสอบ Client-side Exposure

Supabase

- ตรวจสอบ Row Level Security (RLS)
- ตรวจสอบ Policy
- ตรวจสอบ Table Permission
- ตรวจสอบ Storage Policy
- ตรวจสอบข้อมูลที่ Client สามารถเข้าถึงได้

ข้อกำหนด

- ห้ามลด Security เพื่อแก้ปัญหาอื่น
- ห้ามปิด Authentication
- ห้ามปิด RLS
- ห้าม Hardcode Secret
- ห้ามเปลี่ยน Business Logic
- วิเคราะห์ระดับความเสี่ยง Critical / High / Medium / Low
- อธิบายช่องโหว่และผลกระทบก่อนแก้
- ต้องเสนอวิธีแก้ก่อนลงมือ
```

---

## 📝 Prompt #15 — Production Security Review

_ตรวจสอบความปลอดภัยและช่องโหว่ระดับ Production รอบด้าน 18 มิติ_

```text
15 — 🛡️ PRODUCTION SECURITY REVIEW (18 DIMENSIONS)

# 15. Security Review

## ตรวจสอบ Security และช่องโหว่ของโปรเจกต์ทั้งหมดในระดับ Production
## โดยห้ามเปลี่ยน Business Logic, API Contract หรือ Authentication Flow โดยไม่ได้รับอนุญาต

## เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

## เป้าหมาย
## ตรวจสอบว่าผู้โจมตีสามารถทำอะไรกับระบบได้บ้าง ไม่ใช่ตรวจเพียงว่า "ระบบทำงานได้หรือไม่"

==================================================
1. Authentication
==================================================

ตรวจสอบ
- Login
- Register
- Logout
- Password Hashing
- Password Policy
- JWT
- Access Token
- Refresh Token
- Token Expiration
- Token Rotation
- Session
- Cookie
- OAuth
- Google Login
- GitHub Login
- Email Verification
- Password Reset
- Account Enumeration
- Brute Force
- Credential Stuffing

ทดสอบกรณี
- Login ผิดหลายครั้ง
- Token หมดอายุ
- Token ถูกแก้ไข
- Token ถูก Replay
- Refresh Token ถูกนำกลับมาใช้
- User Logout แล้ว Token เดิมยังใช้ได้หรือไม่

==================================================
2. Authorization / Access Control
==================================================

ตรวจสอบว่า User สามารถเข้าถึงเฉพาะ Resource ที่ตัวเองมีสิทธิ์เท่านั้น

ทดสอบ: User A → พยายามเข้าถึง → ข้อมูล User B

ตรวจสอบ
- IDOR
- BOLA
- RBAC
- Permission
- Role
- Admin Endpoint
- Ownership
- Resource Authorization
- API Authorization

ห้ามเชื่อเพียง Frontend ว่าซ่อน Button แล้วปลอดภัย ต้องตรวจสอบ Authorization ที่ Backend ด้วย

==================================================
3. API Security
==================================================

ตรวจสอบ
- Authentication
- Authorization
- Input Validation
- DTO Validation
- Rate Limiting
- Request Size
- HTTP Method
- CORS
- Security Headers
- Error Response
- API Version
- Sensitive Endpoint
- Admin Endpoint

ทดสอบว่าผู้ใช้สามารถเรียก API โดยตรงโดยไม่ผ่าน Frontend ได้หรือไม่

==================================================
4. Injection
==================================================

ตรวจสอบ
- SQL Injection
- NoSQL Injection
- XSS
- Command Injection
- Path Traversal
- LDAP Injection หากมี
- Template Injection หากมี

ตรวจสอบ Input จาก
- Query
- Params
- Body
- Header
- Cookie
- File Name
- File Content

==================================================
5. XSS
==================================================

ตรวจสอบ
- Stored XSS
- Reflected XSS
- DOM-based XSS

ตรวจสอบข้อมูลที่ User สามารถกรอกได้ เช่น
- Name
- Comment
- Description
- Note
- Message
- Profile
- Search

ตรวจสอบว่าข้อมูลของ User ถูก Render เป็น HTML โดยไม่ได้ Sanitize หรือไม่

==================================================
6. CSRF / Cookie Security
==================================================

หากใช้ Cookie ตรวจสอบ
- HttpOnly
- Secure
- SameSite
- CSRF Protection
- Cookie Expiration
- Domain
- Path

ตรวจสอบว่าบุคคลภายนอกสามารถสร้าง Request แทน User ได้หรือไม่

==================================================
7. Sensitive Data
==================================================

ตรวจสอบว่าระบบเปิดเผยข้อมูลเหล่านี้หรือไม่
- Password
- Password Hash
- JWT
- Refresh Token
- API Key
- Secret
- Database URL
- Internal Error
- Stack Trace
- Personal Data
- Payment Data
- Internal ID

ตรวจสอบ
- API Response
- Console
- Log
- Error Message
- Network Response
- Database

==================================================
8. Environment / Secrets
==================================================

ตรวจสอบ
- .env
- .env.local
- API Key
- Secret Key
- JWT Secret
- OAuth Secret
- Database Password
- Supabase Secret
- Service Role Key

ตรวจสอบ Git History ด้วย เพราะการลบ Secret ออกจากไฟล์ปัจจุบัน ไม่ได้หมายความว่า Secret หายจาก Git History

==================================================
9. Supabase Security
==================================================

ตรวจสอบ
- Row Level Security (RLS)
- RLS Policy
- SELECT
- INSERT
- UPDATE
- DELETE
- Storage Policy
- Public Bucket
- Service Role Key
- Anon Key
- Database Permission

ทดสอบ User A ไม่ควรสามารถ:
- อ่านข้อมูล User B
- แก้ข้อมูล User B
- ลบข้อมูล User B
- Upload ไฟล์ในพื้นที่ที่ไม่มีสิทธิ์

==================================================
10. File Upload
==================================================

ตรวจสอบ
- File Extension
- MIME Type
- File Size
- File Name
- File Content
- Storage Permission
- Public URL
- Executable File
- Malicious File
- Path Traversal

อย่าเชื่อ Extension เพียงอย่างเดียว เช่น malicious.exe → เปลี่ยนชื่อ → image.jpg
ระบบต้องไม่ถือว่าปลอดภัยเพียงเพราะชื่อไฟล์เป็น .jpg

==================================================
11. Rate Limiting / Abuse
==================================================

ตรวจสอบ Endpoint ที่ควรจำกัดจำนวน Request เช่น
- Login
- Register
- OTP
- Forgot Password
- Password Reset
- Search
- Upload
- Send Email
- AI API
- Payment

ตรวจสอบ
- Rate Limit
- IP Limit
- User Limit
- Retry
- Brute Force Protection

==================================================
12. Business Logic Security
==================================================

ตรวจสอบว่าผู้ใช้สามารถ "ใช้ระบบผิดวิธี" เพื่อให้ได้ผลลัพธ์ที่ไม่ควรได้หรือไม่

ตัวอย่าง
- ซื้อของราคา 100 บาท แล้วแก้ Request เป็น 1 บาท
- เติมเงินซ้ำ
- ใช้ Coupon ซ้ำ
- กดรับ Reward ซ้ำ
- ข้ามขั้นตอนการชำระเงิน
- แก้ Status จาก Pending → Success
- เรียก API ขั้นตอนที่ 2 โดยไม่ผ่านขั้นตอนที่ 1

อย่าเชื่อค่าที่ส่งมาจาก Frontend: Backend ต้องตรวจสอบเอง

==================================================
13. Race Condition
==================================================

ตรวจสอบกรณี User ส่ง Request พร้อมกันหลายครั้ง เช่น:
Balance = 100
Request A: ถอน 100
Request B: ถอน 100
ทั้งสอง Request ถูกประมวลผลพร้อมกัน ระบบต้องไม่ทำให้ Balance ติดลบ หรือเกิด Transaction ซ้ำ

ตรวจสอบ
- Transaction
- Lock
- Atomic Operation
- Idempotency
- Duplicate Request

==================================================
14. Dependency Security
==================================================

ตรวจสอบ
- npm packages
- Outdated packages
- Known Vulnerabilities
- Dependency จำนวนมากเกินไป
- Package ที่ไม่ได้ใช้งาน
- Package ที่มีความเสี่ยง

ห้ามเพิ่ม Dependency ใหม่ ถ้ายังไม่อธิบายเหตุผล

==================================================
15. Error / Logging Security
==================================================

ตรวจสอบว่า Error และ Log ไม่เปิดเผยข้อมูลสำคัญ

ห้าม Log
- Password
- Token
- API Key
- Secret
- Sensitive Personal Data

ตรวจสอบ Production Error Response ไม่ควรเปิดเผย Stack Trace หรือ Internal Structure

==================================================
16. Security Headers
==================================================

ตรวจสอบ
- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security
- Frame Protection

ตรวจสอบตามความเหมาะสมกับ Architecture ไม่เปิดใช้แบบสุ่มโดยไม่ตรวจสอบผลกระทบ

==================================================
17. Session / Token Management
==================================================

ตรวจสอบ
- Token Expiration
- Refresh Token
- Logout
- Token Revocation
- Rotation
- Multiple Sessions
- Device Session
- Concurrent Login

ตรวจสอบว่า Logout แล้ว Token หรือ Session เดิมยังสามารถใช้งานได้หรือไม่

==================================================
18. Security Testing
==================================================

จำลองมุมมองของ Attacker ลองตรวจสอบ
- เปลี่ยน User ID
- เปลี่ยน Role
- แก้ Request Body
- แก้ Query Parameter
- เรียก API โดยตรง
- ลบ Authorization Header
- ใช้ Token หมดอายุ
- ใช้ Token ของ User อื่น
- ส่งข้อมูลผิด Type
- ส่งข้อมูลจำนวนมาก
- ส่ง Request ซ้ำ
- ส่ง Request พร้อมกัน
- เข้าถึง Admin API
- เข้าถึง Resource ของ User อื่น

==================================================
ระดับความรุนแรง
==================================================

จัดลำดับปัญหาเป็น: Critical / High / Medium / Low / Informational

สำหรับทุกช่องโหว่ให้ระบุ:
1. ช่องโหว่คืออะไร
2. เกิดจากอะไร
3. ผู้โจมตีต้องทำอะไร
4. ผู้โจมตีจะได้อะไร
5. ผลกระทบคืออะไร
6. วิธีแก้
7. Risk ของการแก้
8. ไฟล์ที่เกี่ยวข้อง

==================================================
ข้อกำหนดสำคัญ
==================================================

- ห้ามแก้ไขทันที
- ห้ามเปลี่ยน Business Logic โดยไม่ได้รับอนุญาต
- ห้ามเปลี่ยน API Contract โดยไม่ได้รับอนุญาต
- ห้ามปิด Security เพื่อให้ระบบทำงาน
- ห้ามปิด RLS
- ห้าม Hardcode Secret
- ห้ามลบ Feature
- ห้ามเพิ่ม Library โดยไม่อธิบายเหตุผล
- ต้องแสดง Root Cause ก่อน
- ต้องเสนอวิธีแก้ก่อน
- ต้องรอการอนุมัติจากผมก่อนลงมือแก้
- หากไม่พบช่องโหว่ ให้ระบุว่าไม่พบจากการตรวจสอบที่ทำ
- ห้ามอ้างว่าระบบ "ปลอดภัย 100%" เพียงเพราะไม่พบปัญหา

หลังจากได้รับอนุมัติแล้ว ให้แก้เฉพาะช่องโหว่ที่ได้รับอนุมัติ

หลังแก้เสร็จให้สรุป:
Before → ช่องโหว่ → การแก้ไข → After → วิธีทดสอบว่าแก้สำเร็จ
```
