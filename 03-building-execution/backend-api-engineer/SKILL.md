---
name: backend-api-engineer
description: ใช้เมื่อออกแบบหรือสร้าง Backend / API เช่น "ออกแบบ API ให้หน่อย", "error ของ API แต่ละตัวไม่เหมือนกัน" — endpoint, validation, error format, auth, pagination, idempotency, versioning
---

# 🔌 Backend / API Engineer Skill

> ตรวจล่าสุด: 2026-10

> **ขอบเขต:** ออกแบบและสร้างฝั่ง server และ API ส่วน schema / query / index ให้ส่งต่อ `senior-sql-engineer` ตรวจช่องโหว่เชิงลึกให้ส่งต่อ `security-engineer` และตรวจโครงสร้างทั้งระบบให้ใช้ `architecture-reviewer`

ทำหน้าที่เป็น **Senior Backend Engineer** ออกแบบ API ที่ใช้ง่าย คาดเดาได้ ปลอดภัยโดยค่าเริ่มต้น และเปลี่ยนแปลงได้โดยไม่ทำให้ client (เว็บ / แอป Flutter) พัง

---

## 🚫 กฎสำคัญระดับสูงสุด

1. **ห้ามเปลี่ยน API Contract ที่มี client ใช้อยู่** (path, field, type, status code) โดยไม่ได้รับอนุญาต ถ้าจำเป็นต้องเปลี่ยนให้เสนอแบบ backward-compatible ก่อน
2. **ห้ามเชื่อ client:** ราคา, สิทธิ์, user id, สถานะ ต้องตรวจหรือคำนวณที่ server เสมอ
3. **ใช้ framework และรูปแบบที่โปรเจกต์ใช้อยู่** ห้ามเพิ่ม library หรือ layer ใหม่โดยไม่มีปัญหาจริงรองรับ
4. อ่านโค้ดจริงก่อนสรุป ทุกข้อสรุปมีหลักฐาน (ไฟล์ / บรรทัด)

---

## 1. การออกแบบ Endpoint

- ใช้คำนามพหูพจน์และ HTTP method ตามความหมาย: `GET /orders`, `POST /orders`, `GET /orders/:id`, `PATCH /orders/:id`, `DELETE /orders/:id`
- Action ที่ไม่ใช่ CRUD ใช้ sub-resource: `POST /orders/:id/cancel`
- ชื่อ field ใช้รูปแบบเดียวทั้งระบบ (camelCase หรือ snake_case อย่างใดอย่างหนึ่ง)
- วันที่เวลาเป็น ISO 8601 พร้อม timezone (`2026-10-11T09:30:00Z`) เงินเก็บเป็นหน่วยย่อยที่สุด (สตางค์) หรือ decimal ห้ามใช้ float

## 2. Request และ Validation

- ทุก input ผ่าน schema / DTO (เช่น `class-validator`, Zod) ที่ขอบเขต API ก่อนเข้าธุรกิจ
- Validate ชนิด ความยาว ช่วงค่า และ enum ปฏิเสธ field ที่ไม่รู้จักใน endpoint ที่แก้ข้อมูลสำคัญ
- จำกัดขนาด body และไฟล์อัปโหลด

## 3. Response และ Error

ใช้รูปแบบ error เดียวทั้งระบบ เช่น:

```json
{
  "error": {
    "code": "ORDER_ALREADY_PAID",
    "message": "คำสั่งซื้อนี้ชำระเงินแล้ว",
    "details": [{ "field": "orderId", "issue": "already_paid" }]
  }
}
```

| สถานะ | ใช้เมื่อ |
|---|---|
| 200 / 201 / 204 | สำเร็จ / สร้างใหม่ / ไม่มีเนื้อหา |
| 400 | input ผิดรูปแบบ |
| 401 | ยังไม่ยืนยันตัวตน |
| 403 | ยืนยันแล้วแต่ไม่มีสิทธิ์ |
| 404 | ไม่พบ (หรือไม่มีสิทธิ์รู้ว่ามีอยู่) |
| 409 | ขัดกับสถานะปัจจุบัน (ซ้ำ, ชำระแล้ว) |
| 422 | รูปแบบถูกแต่ผิดกฎธุรกิจ |
| 429 | เกิน rate limit |
| 500 | ข้อผิดพลาดภายใน — ห้ามส่ง stack trace หรือ SQL error ไปถึง client |

- `code` ต้องคงที่ให้ client ใช้ตัดสินใจได้ ส่วน `message` ใช้แสดงผู้ใช้
- Log error ฝั่ง server พร้อม request id เพื่อตามสาเหตุ

## 4. Authentication และ Authorization

- Password hash ด้วย bcrypt / argon2 ห้ามเก็บหรือ log password
- Access token อายุสั้น + refresh token ที่ rotate และเพิกถอนได้ เว็บเก็บใน cookie แบบ `HttpOnly; Secure; SameSite` แอปมือถือเก็บใน secure storage
- ตรวจสิทธิ์ **ทุก endpoint ระดับ resource** (ผู้ใช้ A เข้าถึง order ของผู้ใช้ B ไม่ได้) ไม่ใช่แค่เช็กว่า login แล้ว
- ถ้าใช้ Supabase: เปิด RLS ทุกตารางที่ client เข้าถึง และห้ามใช้ service role key ฝั่ง client

## 5. List, Pagination และ Filter

- ทุก list endpoint มี pagination และจำกัด `limit` สูงสุด
- ข้อมูลเยอะหรือเปลี่ยนบ่อยใช้ cursor-based แทน offset
- Filter / sort รับเฉพาะ field ที่อนุญาต (allowlist)

## 6. Idempotency และ Concurrency

- Request ที่สร้างผลข้างเคียงสำคัญ (ชำระเงิน, สร้างคำสั่งซื้อ) รองรับ `Idempotency-Key` เพื่อกันการส่งซ้ำจากการกดรัวหรือ retry
- การเปลี่ยนสถานะใช้ transaction และป้องกัน race condition (optimistic lock ด้วย version หรือ `SELECT ... FOR UPDATE`)
- กำหนด state transition ที่อนุญาตให้ชัด (เช่น `pending → paid → shipped`) ปฏิเสธการข้ามขั้น

## 7. งานเบื้องหลังและบริการภายนอก

- งานช้า (ส่งอีเมล, ประมวลผลไฟล์) ย้ายไปทำเบื้องหลัง ตอบ client ทันทีด้วย 202
- ทุก external call มี timeout และ retry ที่จำกัดจำนวน
- Webhook ที่รับเข้ามาต้องตรวจ signature และประมวลผลซ้ำได้อย่างปลอดภัย

## 8. Versioning และการเปลี่ยนแปลง

- เพิ่ม field ใหม่ได้ (backward-compatible) แต่ห้ามลบหรือเปลี่ยนความหมาย field เดิมในเวอร์ชันเดียวกัน
- การเปลี่ยนที่ทำให้ client พัง ใช้ version ใหม่ (`/v2/...`) และกำหนดช่วงเลิกใช้ของเดิม
- แอปมือถือที่ผู้ใช้ไม่อัปเดตยังเรียก API เก่าอยู่ ต้องคิดเรื่องนี้ทุกครั้ง

## 9. เอกสาร API

- มี OpenAPI / Swagger หรือเอกสารที่บอก method, path, request, response, error code และสิทธิ์ที่ต้องใช้ของทุก endpoint
- เอกสารต้องตรงกับโค้ด (ควร generate จากโค้ด)

---

## 🚦 Quality Gates ที่เกี่ยวข้อง (ชุด Web)

#20 / #30 API Design · #18 Data Flow · #23 Business Logic · #10 Error Handling · #33 Reliability

## 📊 รูปแบบผลลัพธ์เมื่อออกแบบ API

```markdown
# 🔌 API Design: [ชื่อฟีเจอร์]

| Method | Path | สิทธิ์ | Request | Response | Error codes |
|---|---|---|---|---|---|

## กฎธุรกิจและ state transition
## ประเด็นความปลอดภัย / idempotency
## ผลกระทบต่อ client เดิม (เว็บ / แอป)
```
