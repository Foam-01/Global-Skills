# #33 System Reliability Review

**Phase:** Testing & Security  
**สกิลที่รับผิดชอบ:** backend-api-engineer, production-readiness-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ทุก external call มี timeout
- [ ] Retry มีจำนวนจำกัดและมี backoff (ไม่เกิด retry storm)
- [ ] เมื่อ external API ล่ม ส่วนอื่นของระบบยังทำงานต่อได้

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #33 — System Reliability Review

_ตรวจสอบ Timeouts, Retries, Circuit Breakers, Fallbacks, External API/DB Failures_

```text
33. RELIABILITY
ตรวจสอบ Reliability ของระบบทั้งหมด

เป้าหมาย

ระบบบางส่วนพัง
↓
ระบบส่วนอื่นควรทำงานต่อได้
หากเป็นไปได้

==================================================
ตรวจสอบ

- Timeout
- Retry
- Circuit Breaker
- Fallback
- Health Check
- Graceful Shutdown
- Idempotency
- Transaction
- Failure Isolation

==================================================
External API

ตรวจสอบ

External API Down
↓
ระบบของเราจะเกิดอะไรขึ้น?

==================================================
Database

ตรวจสอบ

Database Slow
↓
ระบบจะ Timeout หรือไม่?

==================================================
ข้อกำหนด

- ห้าม Retry แบบไม่จำกัด
- ห้ามสร้าง Retry Storm
- ห้ามเปลี่ยน Behavior โดยไม่ได้รับอนุญาต
- ต้องวิเคราะห์ Failure Scenario
```
