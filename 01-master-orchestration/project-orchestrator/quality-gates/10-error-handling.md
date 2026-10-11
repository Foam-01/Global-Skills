# #10 Error Handling

**Phase:** Testing & Security  
**สกิลที่รับผิดชอบ:** debugging-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ไม่มี error ที่ถูกกลืนเงียบ (empty catch)
- [ ] ผู้ใช้เห็นข้อความที่เข้าใจได้ ไม่เห็น stack trace
- [ ] Error ฝั่ง server ถูก log พร้อมบริบทพอให้ตามสาเหตุได้

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #10 — Error Handling

_ตรวจสอบ Error Handling ทั้ง Frontend/Backend, Fallback UI, Logging และ Edge Cases_

```text
10 — 🛑 ERROR HANDLING
ตรวจสอบ Error Handling ของโปรเจกต์ทั้งหมด โดยห้ามเปลี่ยน Business Logic

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

ตรวจสอบ

- API Error
- Database Error
- Authentication Error
- Authorization Error
- Validation Error
- Network Error
- Timeout
- External API Error
- File Upload Error
- Payment Error หากมี
- Third-party Service Error
- Redis Error
- Queue Error

Frontend

- Loading State
- Error State
- Empty State
- Retry
- Toast
- Dialog
- Error Message
- Fallback UI

Backend

- HTTP Status Code
- Exception Handling
- Global Exception Filter
- Logging
- Sensitive Error Information
- Error Response Format

ตรวจสอบว่าระบบไม่แสดง

- Stack Trace
- Database Error
- Password
- Token
- API Key
- Internal Architecture

ให้ทดสอบกรณี

- Internet หลุด
- API ล่ม
- Database ล่ม
- Token หมดอายุ
- Request Timeout
- User กดปุ่มซ้ำ
- Invalid Input

ข้อกำหนด

- ห้ามซ่อน Error
- ห้ามใช้ 200 OK กับ Error โดยไม่มีเหตุผล
- ห้ามเปิดเผยข้อมูล Sensitive
- วิเคราะห์ก่อนแก้
```
