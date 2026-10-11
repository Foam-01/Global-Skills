# #20 API Design Review · #30 API Design Review

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** backend-api-engineer, security-engineer

## ✅ เกณฑ์ผ่าน

- [ ] Naming, status code และรูปแบบ response / error สม่ำเสมอทุก endpoint
- [ ] ทุก input ถูก validate ด้วย schema / DTO
- [ ] List endpoint มี pagination และ API มีเอกสาร

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

> ข้อ #20, #30 ตรวจเรื่องเดียวกันจากคนละมุม ใช้ Prompt ทุกชุดในไฟล์นี้ประกอบกัน

---

## 📝 Prompt #20 — API Design Review

_ตรวจสอบ Endpoints, Requests, Responses, Status Codes, Security, Performance & Docs_

```text
20. 🔌 API Design Review
ตรวจสอบ API Design ของโปรเจกต์ทั้งหมด
โดยห้ามเปลี่ยน API Contract โดยไม่ได้รับอนุญาต

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

==================================================
1. Endpoint
==================================================

ตรวจสอบ

- Naming
- URL Structure
- HTTP Method
- REST Convention
- Resource Naming
- Nested Resource
- Versioning

==================================================
2. Request
==================================================

ตรวจสอบ

- Params
- Query
- Body
- Header
- DTO
- Validation
- Required Field
- Optional Field
- Data Type

==================================================
3. Response
==================================================

ตรวจสอบ

- Response Structure
- Data
- Message
- Metadata
- Pagination
- Error Format

ตรวจสอบว่า API Response
มีข้อมูลมากเกินความจำเป็นหรือไม่

==================================================
4. HTTP Status Code
==================================================

ตรวจสอบ

- 200
- 201
- 204
- 400
- 401
- 403
- 404
- 409
- 422
- 429
- 500

ตรวจสอบว่า Status Code
ตรงกับสถานการณ์จริงหรือไม่

==================================================
5. Security
==================================================

ตรวจสอบ

- Authentication
- Authorization
- Rate Limit
- Input Validation
- Sensitive Data
- Admin Endpoint
- IDOR / BOLA

==================================================
6. API Performance
==================================================

ตรวจสอบ

- Duplicate Request
- N+1 Request
- Large Response
- Pagination
- Caching
- Compression

==================================================
7. Documentation
==================================================

ตรวจสอบ

- Swagger
- OpenAPI
- Request Example
- Response Example
- Error Example
- Authentication Documentation

==================================================
ข้อกำหนด

- ห้ามเปลี่ยน API Contract ทันที
- ต้องระบุ Breaking Change หากมี
- ห้ามเปลี่ยน Endpoint โดยไม่มีเหตุผล
- ห้ามเปลี่ยน Response โดยไม่แจ้งผลกระทบ
- ต้องเสนอแนวทางก่อนแก้
- ต้องรอการอนุมัติ
```

---

## 📝 Prompt #30 — API Design Review

_ตรวจสอบ Naming, Request DTOs, Response Formats, Security, Versioning & Performance_

```text
30. API DESIGN
ตรวจสอบ API Design ทั้งหมด
โดยห้ามเปลี่ยน API Contract
โดยไม่ได้รับอนุญาต

==================================================
1. Naming
==================================================

ตรวจสอบ

- Endpoint Naming
- HTTP Method
- Resource Naming
- Consistency

==================================================
2. Request
==================================================

ตรวจสอบ

- DTO
- Validation
- Required Field
- Optional Field
- Data Type

==================================================
3. Response
==================================================

ตรวจสอบ

- Response Structure
- Status Code
- Error Format
- Pagination
- Metadata

==================================================
4. Security
==================================================

ตรวจสอบ

- Authentication
- Authorization
- Rate Limit
- Input Validation

==================================================
5. API Versioning
==================================================

ตรวจสอบว่าการเปลี่ยน API
จะกระทบ Client เดิมหรือไม่

==================================================
6. Performance
==================================================

ตรวจสอบ

- Payload Size
- Over-fetching
- Under-fetching
- Pagination
- Duplicate Request

==================================================
ข้อกำหนด
==================================================

- ห้ามเปลี่ยน API Contract ทันที
- ต้องเสนอ Breaking Change ก่อน
- ต้องระบุผลกระทบต่อ Frontend
- ต้องรออนุมัติ
```
