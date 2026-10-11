# #14 Scalability · #32 Scalability Review

**Phase:** Planning & Architecture  
**สกิลที่รับผิดชอบ:** architecture-reviewer, system-design-interviewer

## ✅ เกณฑ์ผ่าน

- [ ] ระบุได้ว่าคอขวดแรกคืออะไร และจะเจอที่ผู้ใช้ประมาณเท่าไร
- [ ] Server เป็น stateless (scale แนวนอนได้) หรือมีเหตุผลรองรับถ้าไม่ใช่
- [ ] ไม่เพิ่ม infrastructure ล่วงหน้าโดยไม่มีตัวเลขรองรับ

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

> ข้อ #14, #32 ตรวจเรื่องเดียวกันจากคนละมุม ใช้ Prompt ทุกชุดในไฟล์นี้ประกอบกัน

---

## 📝 Prompt #14 — Scalability

_วิเคราะห์ขีดจำกัด คอขวด (Bottleneck) และแผนการ Scale ตามปริมาณผู้ใช้งาน_

```text
14 — 📈 SCALABILITY
อันนี้เอาไว้ถามว่า
"ถ้าคนใช้เพิ่มขึ้น ระบบจะพังตรงไหน?"

ตรวจสอบ Scalability ของโปรเจกต์ทั้งหมด โดยห้ามเปลี่ยน Business Logic

เริ่มจากการวิเคราะห์ก่อน ห้ามเพิ่ม Infrastructure ทันที

วิเคราะห์ระบบในสถานการณ์

- 10 Users
- 100 Users
- 1,000 Users
- 10,000 Users
- 100,000 Users

ตรวจสอบ

Frontend

- Static Asset
- Image
- Video
- CDN
- Bundle Size

Backend

- CPU
- Memory
- Concurrent Request
- Connection
- API Bottleneck
- Rate Limit
- Stateless Architecture

Database

- Connection Pool
- Slow Query
- Index
- Read / Write Load
- Lock
- Transaction
- Connection Limit

Redis

- Cache
- Cache Hit Rate
- Memory
- TTL
- Invalidation
- Rate Limiting
- Queue

Queue

- Background Job
- Worker
- Retry
- Dead Letter Queue
- Queue Length

Infrastructure

- Horizontal Scaling
- Vertical Scaling
- Load Balancer
- CDN
- Health Check
- Auto Scaling

ให้ระบุ

- Current Bottleneck
- Potential Bottleneck
- Maximum Risk
- จุดที่ควร Scale
- จุดที่ยังไม่จำเป็นต้อง Scale

ห้ามเพิ่ม Infrastructure เพียงเพราะ "เผื่ออนาคต"

ให้เลือกตามข้อมูลและ Traffic ที่คาดการณ์ได้

ข้อกำหนด

- ห้ามเปลี่ยน Business Logic
- ห้ามเพิ่ม Service โดยไม่มีเหตุผล
- ห้ามใช้ Microservices เพียงเพื่อให้ระบบดูใหญ่
- ต้องอธิบาย Cost / Benefit
- วิเคราะห์ก่อนแก้
```

---

## 📝 Prompt #32 — Scalability Review

_วิเคราะห์ Traffic (10 -> 100,000 Users), Bottlenecks, Horizontal/Vertical Scaling & Statelessness_

```text
32. SCALABILITY
ตรวจสอบ Scalability ของระบบทั้งหมด

โดยห้ามเปลี่ยน Architecture ทันที

==================================================
1. Traffic
==================================================

วิเคราะห์

10 Users
100 Users
1,000 Users
10,000 Users
100,000 Users

==================================================
2. Bottleneck
==================================================

ค้นหา

- CPU
- Memory
- Database
- Network
- Storage
- API
- External Service

==================================================
3. Horizontal Scaling
==================================================

ตรวจสอบว่า Backend
สามารถเพิ่ม Instance ได้หรือไม่

==================================================
4. Vertical Scaling
==================================================

ตรวจสอบว่าการเพิ่ม

CPU
RAM

ช่วยได้หรือไม่

==================================================
5. Stateless
==================================================

ตรวจสอบว่า Backend
สามารถทำงานหลาย Instance
โดยไม่พึ่ง Memory ของ Instance เดียวหรือไม่

==================================================
ข้อกำหนด
==================================================

- ห้าม Scale โดยไม่มี Bottleneck
- ต้องวัดก่อน
- ต้องระบุ Cost
- ต้องระบุ Trade-off
```
