# #28 Disaster Recovery Strategy Review

**Phase:** Pre-Production & Release  
**สกิลที่รับผิดชอบ:** incident-response-engineer

## ✅ เกณฑ์ผ่าน

- [ ] กำหนด RTO / RPO เป็นตัวเลข
- [ ] มีขั้นตอนกู้ระบบที่เขียนไว้และระบุ Single Point of Failure ได้ครบ

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #28 — Disaster Recovery Strategy Review

_ตรวจสอบ Failure Scenarios, Recovery Procedures, RTO, RPO & SPOF_

```text
28. DISASTER RECOVERY
ตรวจสอบ Disaster Recovery Strategy
ของระบบทั้งหมด

โดยห้ามเปลี่ยน Architecture
โดยไม่ได้รับอนุญาต

เริ่มจากการวิเคราะห์ก่อน

==================================================
1. Failure Scenario
==================================================

จำลอง

- Server Down
- Database Down
- Redis Down
- Queue Down
- Storage Down
- Network Failure
- Deployment Failure
- Application Crash

==================================================
2. Recovery
==================================================

ตรวจสอบ

- Restart
- Failover
- Restore
- Rollback
- Retry
- Recovery Procedure

==================================================
3. RTO
==================================================

กำหนด

Recovery Time Objective

ระบบควรกลับมาใช้งานได้ภายในกี่นาที/ชั่วโมง

==================================================
4. RPO
==================================================

กำหนด

Recovery Point Objective

ยอมรับการสูญเสียข้อมูลได้มากแค่ไหน

==================================================
5. Single Point of Failure
==================================================

ค้นหา Component ที่ถ้าพังแล้ว
ระบบทั้งหมดพัง

==================================================
ข้อกำหนด
==================================================

- ห้ามอ้างว่าระบบ Recover ได้
  หากยังไม่เคยทดสอบ
- ต้องแยก Recovery Plan
  กับ Actual Recovery Test
- ต้องระบุความเสี่ยง
- ต้องรออนุมัติก่อนเปลี่ยน Architecture
```
