# #22 Cost / Resource Efficiency Review · #37 Cost Optimization Review

**Phase:** Planning & Architecture  
**สกิลที่รับผิดชอบ:** technology-advisor

## ✅ เกณฑ์ผ่าน

- [ ] รู้ค่าใช้จ่ายรายเดือนของทุกบริการ และรู้ว่าตัวไหนโตตามจำนวนผู้ใช้
- [ ] ไม่มีทรัพยากรที่จ่ายเงินแต่ไม่ได้ใช้

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

> ข้อ #22, #37 ตรวจเรื่องเดียวกันจากคนละมุม ใช้ Prompt ทุกชุดในไฟล์นี้ประกอบกัน

---

## 📝 Prompt #22 — Cost / Resource Efficiency Review

_ตรวจสอบ CPU, Memory, Database, Storage, Network และ Third-party Costs_

```text
22. 💰 Cost / Resource Efficiency Review
ตรวจสอบ Cost และ Resource Efficiency ของโปรเจกต์ทั้งหมด
โดยห้ามเปลี่ยน Business Logic หรือ UX

เริ่มจากการวิเคราะห์ก่อน ห้ามเปลี่ยน Infrastructure ทันที

เป้าหมาย

ตรวจสอบว่าระบบใช้

- CPU
- Memory
- Database
- Storage
- Bandwidth
- API
- Third-party Service

อย่างคุ้มค่าหรือไม่

==================================================
1. Infrastructure
==================================================

ตรวจสอบ

- Server
- CPU
- Memory
- Storage
- Bandwidth
- CDN

==================================================
2. Database
==================================================

ตรวจสอบ

- Query จำนวนมาก
- Query ซ้ำ
- Connection
- Storage
- Database Size
- Backup
- Index

==================================================
3. Storage
==================================================

ตรวจสอบ

- Image
- Video
- File
- Storage Size
- Duplicate File
- File Compression
- File Retention

==================================================
4. Network
==================================================

ตรวจสอบ

- API Response Size
- Image Size
- Video
- JavaScript
- CSS
- Font
- Duplicate Request

==================================================
5. Third-party Service
==================================================

ตรวจสอบ

- API Call
- AI API
- Email
- Payment
- OAuth
- Maps
- Analytics
- Monitoring

==================================================
6. Caching
==================================================

วิเคราะห์ว่า

- Redis
- CDN
- Browser Cache
- API Cache

สามารถลด Cost ได้หรือไม่

แต่ห้ามเพิ่ม Cache
หากทำให้ข้อมูลผิดหรือ Stale Data โดยไม่มีวิธีจัดการ

==================================================
ข้อกำหนด

- ห้ามเพิ่ม Infrastructure เพียงเพราะคิดว่า "น่าจะเร็วขึ้น"
- ต้องประเมิน Cost / Benefit
- ต้องระบุว่าจุดใดมีค่าใช้จ่ายสูง
- ต้องเสนอทางเลือก
- ต้องรอการอนุมัติ
```

---

## 📝 Prompt #37 — Cost Optimization Review

_วิเคราะห์ Hosting, Database, Storage, API, CDN, Infrastructure Costs & Optimization_

```text
37. COST OPTIMIZATION
ตรวจสอบ Cost ของ Project
โดยไม่ลดความสามารถของระบบ
โดยไม่ได้รับอนุญาต

==================================================
ตรวจสอบ

- Hosting
- Database
- Storage
- Bandwidth
- API
- CDN
- Redis
- Queue
- Logging
- Monitoring
- Docker Infrastructure

==================================================
ค้นหา

- Resource ที่ไม่ได้ใช้
- Server ใหญ่เกินไป
- Database ใหญ่เกินไป
- Storage ที่ไม่จำเป็น
- API Request ซ้ำ
- Log ที่เก็บมากเกินไป

==================================================
เปรียบเทียบ

Current Cost
vs
Optimized Cost

==================================================
ข้อกำหนด

- ห้ามลด Resource จนกระทบ Performance
- ต้องระบุ Trade-off
- ต้องวิเคราะห์ก่อนลด Cost
```
