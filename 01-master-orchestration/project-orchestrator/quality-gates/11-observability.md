# #11 Observability · #27 Observability Review

**Phase:** Pre-Production & Release  
**สกิลที่รับผิดชอบ:** incident-response-engineer

## ✅ เกณฑ์ผ่าน

- [ ] มี structured log ที่ไม่มีข้อมูลส่วนตัวหรือ secret
- [ ] มี health check และมี alert เมื่อ error rate หรือ latency ผิดปกติ
- [ ] รู้ได้ภายในไม่กี่นาทีเมื่อระบบล่ม โดยไม่ต้องรอผู้ใช้แจ้ง

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

> ข้อ #11, #27 ตรวจเรื่องเดียวกันจากคนละมุม ใช้ Prompt ทุกชุดในไฟล์นี้ประกอบกัน

---

## 📝 Prompt #11 — Observability

_ตรวจสอบ Logging, Metrics, Tracing และระบบติดตามปัญหาในระดับ Production_

```text
11 — 📊 OBSERVABILITY
นี่คือสิ่งที่ทำให้คุณเริ่มคิดแบบ Production Developer
ตรวจสอบ Observability ของโปรเจกต์ทั้งหมด โดยห้ามเปลี่ยน Business Logic

เริ่มจากการวิเคราะห์ก่อน ห้ามติดตั้ง Monitoring Tool ทันที

ตรวจสอบ

Logging

- API Request
- API Response Time
- Error
- Authentication Event
- Database Error
- External API Error
- Queue Error
- Background Job
- Critical Business Event

Metrics

- Request Count
- Response Time
- Error Rate
- CPU
- Memory
- Database Performance
- Cache Hit Rate
- Queue Length
- Queue Failure
- Active Users หากจำเป็น

Tracing

- Request → API
- API → Service
- Service → Database
- Service → External API

ตรวจสอบว่าหาก User แจ้งว่า

"หน้า Dashboard ช้า"

เราสามารถระบุได้หรือไม่ว่า

Frontend
→ API
→ Service
→ Database

ช้าตรงไหน

ข้อกำหนด

- ห้ามเก็บ Sensitive Data ใน Log
- ห้าม Log Password
- ห้าม Log Token
- ห้าม Log API Key
- ห้ามเพิ่ม Monitoring Library โดยไม่อธิบายเหตุผล
- วิเคราะห์ก่อนติดตั้ง
```

---

## 📝 Prompt #27 — Observability Review

_ตรวจสอบ Logging, Metrics, Tracing, Alerting & Health Checks_

```text
27. OBSERVABILITY
ตรวจสอบ Observability ของระบบทั้งหมด
โดยห้ามเปลี่ยน Business Logic

เริ่มจากการวิเคราะห์ก่อน
ห้ามเพิ่ม Monitoring ทันที

เป้าหมายคือ

Production มีปัญหา
↓
Developer สามารถรู้ได้ว่า
เกิดอะไรขึ้น
ที่ไหน
เมื่อไหร่
และทำไม

==================================================
1. Logging
==================================================

ตรวจสอบ

- Application Logs
- Error Logs
- Authentication Logs
- API Logs
- Background Job Logs

ตรวจสอบว่า Log มี

- Timestamp
- Request ID
- User Context ที่เหมาะสม
- Error Context

แต่ห้าม Log

- Password
- Token
- Secret
- API Key
- Sensitive Data

==================================================
2. Metrics
==================================================

ตรวจสอบ

- Request Count
- Response Time
- Error Rate
- CPU
- Memory
- Database Connection
- Queue Length
- Cache Hit Rate

==================================================
3. Tracing
==================================================

หากระบบมีหลาย Service

ตรวจสอบ Request Flow

User
↓
Next.js
↓
NestJS
↓
Redis
↓
Database
↓
External API

ตรวจสอบว่า Trace
สามารถหาจุดที่ช้าได้หรือไม่

==================================================
4. Alerting
==================================================

ตรวจสอบว่าเหตุการณ์สำคัญ
สามารถแจ้งเตือนได้หรือไม่

เช่น

- API Error สูง
- Server Down
- Database Connection เต็ม
- Memory สูง
- Queue ค้าง
- External API Down

==================================================
5. Health Check
==================================================

ตรวจสอบ

- Application Health
- Database Health
- Redis Health
- Queue Health
- External Service Health

==================================================
ข้อกำหนด
==================================================

- ห้ามเพิ่ม Monitoring โดยไม่มีเหตุผล
- ห้ามเก็บ Sensitive Data
- ต้องเสนอ Metric ที่จำเป็นก่อน
- ต้องระบุ Cost
- ต้องรออนุมัติก่อนติดตั้ง
```
