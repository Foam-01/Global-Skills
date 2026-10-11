# #13 Deployment & Production Readiness · #40 PRODUCTION READINESS

**Phase:** Pre-Production & Release  
**สกิลที่รับผิดชอบ:** production-readiness-engineer, devops-engineer

## ✅ เกณฑ์ผ่าน

- [ ] Environment แยก dev / staging / prod และไม่มี secret ใน repo
- [ ] Build และ deploy อัตโนมัติผ่าน CI/CD
- [ ] มีแผน rollback ที่เคยทดสอบแล้ว
- [ ] ไม่มีความเสี่ยงระดับ Critical ค้างอยู่ (มิฉะนั้นเป็น No-Go)

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

> ข้อ #13, #40 ตรวจเรื่องเดียวกันจากคนละมุม ใช้ Prompt ทุกชุดในไฟล์นี้ประกอบกัน

---

## 📝 Prompt #13 — Deployment & Production Readiness

_ตรวจสอบความพร้อมระดับ Production (Environment, Build, Docker, CI/CD และ Rollback)_

```text
13 — 🚀 DEPLOYMENT / PRODUCTION
ตรวจสอบความพร้อมของโปรเจกต์สำหรับ Production โดยห้ามเปลี่ยน Business Logic

เริ่มจากการวิเคราะห์ก่อน ห้าม Deploy หรือเปลี่ยน Infrastructure ทันที

ตรวจสอบ

Environment

- Environment Variables
- Development
- Test
- Production
- Secret Management
- API URL
- Database URL
- OAuth Configuration

Build

- Production Build
- TypeScript
- Lint
- Test
- Bundle
- Environment

Security

- HTTPS
- CORS
- Cookie
- Security Headers
- Rate Limit
- Secret

Database

- Migration
- Backup
- Restore
- Connection Pool
- Production Schema

Infrastructure

- Docker
- Health Check
- Restart Policy
- Logging
- Monitoring
- CPU
- Memory
- Storage

CI/CD

- Build
- Test
- Deploy
- Migration
- Rollback

ตรวจสอบว่าหาก Deployment ครั้งใหม่มีปัญหา สามารถ Rollback ได้หรือไม่

ควรมี Health Check เช่น

GET /health

ข้อกำหนด

- ห้าม Deploy จริงโดยไม่ได้รับอนุญาต
- ห้ามลบ Production Data
- ห้ามเปลี่ยน Environment Secret
- ห้ามแก้ Business Logic
- ทุก Infrastructure Change ต้องอธิบายผลกระทบก่อน
```

---

## 📝 Prompt #40 — PRODUCTION READINESS

_ตรวจสอบ Production Readiness ของ Project ทั้งหมด_

```text
40. PRODUCTION READINESS
ตรวจสอบ Production Readiness
ของ Project ทั้งหมด

เป้าหมาย

ระบบต้องพร้อมสำหรับ
การใช้งานจริงมากที่สุดเท่าที่เหมาะสม

==================================================
ตรวจสอบ

Code
↓
Test
↓
Security
↓
Performance
↓
Database
↓
Environment
↓
Deployment
↓
Monitoring
↓
Logging
↓
Backup
↓
Recovery

==================================================
Security

ตรวจสอบ

- Secret
- HTTPS
- Authentication
- Authorization
- Rate Limit
- Security Headers

==================================================
Performance

ตรวจสอบ

- API
- Database
- Frontend
- Image
- Video
- Cache

==================================================
Deployment

ตรวจสอบ

- Build
- Environment
- Migration
- Rollback
- Health Check

==================================================
Monitoring

ตรวจสอบ

- Error
- Performance
- Server
- Database

==================================================
Final Checklist

จัดระดับ

READY
↓
READY WITH RISK
↓
NOT READY

พร้อมเหตุผล

==================================================
ข้อกำหนด

- ห้ามบอกว่า Production Ready
  หากยังไม่ได้ตรวจสอบ
- ห้ามอ้างว่าไม่มีปัญหา = ปลอดภัย 100%
- ต้องแสดง Risk ที่ยังเหลือ
```
