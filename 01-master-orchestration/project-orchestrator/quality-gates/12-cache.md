# #12 Cache & Redis Strategy

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** performance-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ทุก cache มี TTL และวิธี invalidate ที่ชัดเจน
- [ ] เพิ่ม cache เฉพาะจุดที่มีตัวเลขยืนยันว่าช้า (ไม่เพิ่ม Redis เพราะเป็น best practice)
- [ ] ข้อมูลส่วนตัวไม่ถูก cache ปนกันระหว่างผู้ใช้

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #12 — Cache & Redis Strategy

_ประเมินและวางแผนการใช้งาน Caching, TTL, Invalidation และ Redis สำหรับระบบ_

```text
12 — 💾 CACHE / REDIS
อันนี้เก็บไว้ใช้ตอนคุณพร้อมเรียน Redis
ตรวจสอบว่าระบบมีส่วนใดที่เหมาะสมกับ Caching หรือ Redis โดยห้ามเพิ่ม Redis ทันที

เริ่มจากการวิเคราะห์ก่อน

ตรวจสอบ

- Query ที่ถูกเรียกบ่อย
- Data ที่เปลี่ยนไม่บ่อย
- API ที่ Response ช้า
- API ที่ถูกเรียกซ้ำ
- Dashboard
- Statistics
- Profile
- Configuration
- Reference Data
- Rate Limiting
- Session
- Background Job
- Queue

สำหรับแต่ละ Candidate ให้ระบุ

- ข้อมูลอะไรควร Cache
- ทำไมควร Cache
- TTL ที่เหมาะสม
- Cache Key
- Cache Invalidation
- Cache Hit / Miss
- ผลกระทบหาก Cache มีข้อมูลเก่า
- Memory ที่คาดว่าจะใช้
- กรณีที่ไม่ควร Cache

Redis

- Cache
- Session
- Rate Limiting
- Queue
- BullMQ
- Pub/Sub หากจำเป็น

ข้อกำหนด

- ห้ามติดตั้ง Redis หากไม่มีเหตุผล
- ห้าม Cache ข้อมูล Sensitive โดยไม่วิเคราะห์
- ห้ามทำให้ข้อมูลไม่ถูกต้องเพราะ Cache
- ต้องออกแบบ Cache Invalidation
- ต้องอธิบาย Trade-off
- ห้ามเปลี่ยน Business Logic
```
