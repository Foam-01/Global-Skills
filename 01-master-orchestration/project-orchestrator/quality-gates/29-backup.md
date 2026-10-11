# #29 Backup & Data Recovery Review

**Phase:** Pre-Production & Release  
**สกิลที่รับผิดชอบ:** incident-response-engineer, senior-sql-engineer

## ✅ เกณฑ์ผ่าน

- [ ] Backup อัตโนมัติทั้ง database และไฟล์
- [ ] เคยทดสอบ restore จริงอย่างน้อยหนึ่งครั้ง (backup ที่ไม่เคย restore ถือว่าไม่ผ่าน)
- [ ] Backup ถูกเข้ารหัสและจำกัดสิทธิ์เข้าถึง

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #29 — Backup & Data Recovery Review

_ตรวจสอบ Database/File Backups, Restore Tests, Recovery Simulation & Security_

```text
29. BACKUP & DATA RECOVERY
ตรวจสอบ Backup และ Data Recovery
ของระบบทั้งหมด

==================================================
1. Database Backup
==================================================

ตรวจสอบ

- Backup Frequency
- Retention
- Backup Location
- Encryption
- Access Control

==================================================
2. Restore Test
==================================================

ตรวจสอบว่า Backup
สามารถ Restore ได้จริงหรือไม่

ห้ามถือว่า

"มี Backup = Backup ใช้งานได้"

==================================================
3. File Backup
==================================================

ตรวจสอบ

- Image
- Video
- Document
- User Upload

==================================================
4. Recovery
==================================================

จำลอง

Database ถูกลบ
↓
Restore Backup
↓
ตรวจสอบ Data Integrity

==================================================
5. Backup Security
==================================================

ตรวจสอบ

- Access
- Encryption
- Secret
- Public Access
- Retention

==================================================
ข้อกำหนด
==================================================

- ห้ามลบข้อมูลจริงเพื่อทดสอบ
- ใช้ Test/Staging Environment
- ห้ามเปิดเผย Backup
- ต้องรออนุมัติก่อนเปลี่ยน Backup Policy
```
