# #05 Performance

**Phase:** Pre-Production & Release  
**สกิลที่รับผิดชอบ:** performance-engineer

## ✅ เกณฑ์ผ่าน

- [ ] มีตัวเลขก่อน/หลังทุกการปรับ (ห้ามอ้างว่าเร็วขึ้นโดยไม่มีตัวเลข)
- [ ] Core Web Vitals หน้าหลักผ่านเกณฑ์ Good (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1)
- [ ] ไม่มี N+1 query หรือ request ซ้ำซ้อนในเส้นทางหลัก

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #05 — Performance

_ตรวจสอบและปรับปรุงความเร็วในการโหลดทั้ง Frontend, Backend และ Database_

```text
05 — ⚡ PERFORMANCE

ตรวจสอบ Performance ของเว็บไซต์ทั้งหมด และปรับปรุงความเร็วในการโหลด โดยห้ามเปลี่ยนหน้าตา ฟังก์ชันการทำงาน หรือ Business Logic

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

***********************************************************
Frontend
ตรวจสอบ Performance ของหน้า **** เท่านั้น

โฟกัสเฉพาะ:
- ตรวจสอบ Server-side Rendering (SSR)
- ตรวจสอบ Client-side Rendering (CSR)

ห้ามแก้ไขโค้ดทันที
ให้วิเคราะห์ก่อนว่าในหน้านี้มีการใช้ SSR / CSR อย่างไร
ระบุ Root Cause หากพบปัญหา
ระบุ Impact
เสนอแนวทางแก้
บอกข้อดี / ข้อเสีย / Risk
และรอการอนุมัติจากผมก่อนแก้ไข

ห้าม:
- เปลี่ยน UI
- เปลี่ยน UX
- เปลี่ยน Business Logic
- เปลี่ยน API Contract
- ลบ Feature
- Rewrite โค้ดทั้งหมด

****************************************************
****************************************************
ตรวจสอบ Performance ของ API

GET /api/******

เท่านั้น

ห้ามแก้ไขโค้ดทันที
ให้วิเคราะห์ก่อน

ตรวจสอบ:
- API Response Time
- Slow API
- Database Query
- N+1 Query
- Authentication
- Middleware
- Guard
- Interceptor
- Logging
- Memory
- CPU
- Connection Pool
- Duplicate Query
- Pagination
- SELECT *
- Index
- Cache ที่เหมาะสม

สำหรับทุกปัญหาที่พบ ให้ระบุ:
1. Problem
2. Root Cause
3. Impact
4. Severity
5. Solution
6. ข้อดี
7. ข้อเสีย
8. Risk

ห้าม:
- เปลี่ยน Business Logic
- เปลี่ยน API Contract
- เปลี่ยน Response Structure
- ลบ Feature
- Rewrite ทั้ง Module

รอการอนุมัติจากผมก่อนแก้ไข


****************************************************
Page Generation Optimization
ตรวจสอบ Page Generation สำหรับหน้าที่มีข้อมูลจำนวนมากหรือข้อมูลย้อนหลังหลายปี
ตรวจสอบการ Render ข้อมูลทั้งหมดในครั้งเดียว
วิเคราะห์ความเหมาะสมของ Pagination, Lazy Loading และ Virtualization
ตรวจสอบการโหลดข้อมูลตามปี เดือน หรือช่วงวันที่
ตรวจสอบการดึงข้อมูลซ้ำและการ Render ที่ไม่จำเป็น
เสนอแนวทางปรับปรุง Performance โดยไม่เปลี่ยน UI, UX หรือ Business Logic
วิเคราะห์ปัญหาและเสนอแนวทางแก้ไขก่อนลงมือ พร้อมระบุข้อดี ข้อเสีย และ Risk
รอการอนุมัติจากผมก่อนแก้ไข

****************************************************
Frontend

- วิเคราะห์ Page Load Time
- วิเคราะห์ Core Web Vitals
- ตรวจสอบ JavaScript Bundle Size
- ตรวจสอบ Network Requests
- ตรวจสอบ API Requests ที่ซ้ำ
- ตรวจสอบ React Re-render
- ตรวจสอบ Component ที่ Re-render บ่อย

- ตรวจสอบ Server-side Rendering (SSR)
- ตรวจสอบ Client-side Rendering (CSR)

- ตรวจสอบ Client Components
- ตรวจสอบ Server Components

- ตรวจสอบ Dynamic Import
- ตรวจสอบ Code Splitting
- ตรวจสอบ Loading Page
- ตรวจสอบ Lazy Loading
- ตรวจสอบ Image Optimization
- ตรวจสอบ next/image
- ตรวจสอบ Font Loading
- ตรวจสอบ Video Loading
- ตรวจสอบ Hydration
- ตรวจสอบ Prefetch
- ตรวจสอบ Preload
- ตรวจสอบ JavaScript ที่ไม่จำเป็น

Backend

- ตรวจสอบ API Response Time
- ตรวจสอบ Slow API
- ตรวจสอบ Database Query
- ตรวจสอบ N+1 Query
- ตรวจสอบ Authentication
- ตรวจสอบ Middleware
- ตรวจสอบ Guard
- ตรวจสอบ Interceptor
- ตรวจสอบ Logging
- ตรวจสอบ Memory
- ตรวจสอบ CPU

Database

- ตรวจสอบ Slow Query
- ตรวจสอบ Index
- ตรวจสอบ Query ซ้ำ
- ตรวจสอบ Pagination
- ตรวจสอบ JOIN
- ตรวจสอบ SELECT *
- ตรวจสอบ Connection Pool

Redis

- วิเคราะห์ว่าจุดใดควรใช้ Redis
- วิเคราะห์ Cache ที่เหมาะสม
- วิเคราะห์ Cache TTL
- วิเคราะห์ Cache Invalidation
- วิเคราะห์ Rate Limiting
- วิเคราะห์ Queue
- ห้ามติดตั้ง Redis หากยังไม่มีเหตุผลที่ชัดเจน

ข้อกำหนด

- ห้ามเปลี่ยน UI
- ห้ามเปลี่ยน UX
- ห้ามเปลี่ยน Business Logic
- ห้ามลบ Feature
- ห้ามเพิ่ม Library โดยไม่อธิบายเหตุผล
- ต้องแสดงปัญหาและสาเหตุก่อน
- ต้องเสนอแนวทางแก้ก่อนลงมือ
- หลังแก้ให้สรุป Performance ก่อนและหลัง หากสามารถวัดได้

### Media & Static Asset Performance

ตรวจสอบและปรับปรุง Performance ของการโหลดและจัดการ Media / Static Assets ทั้ง Frontend และ Backend

* **Image:** Lazy Loading, Compression, Resize, WebP/AVIF และ Cache
* **Video:** ตรวจสอบการโหลดวิดีโอ, Lazy Loading, Streaming, Compression, Thumbnail และไม่โหลดวิดีโอที่ยังไม่จำเป็น
* **Audio:** ตรวจสอบการโหลดไฟล์เสียง, Compression, Streaming และการโหลดเฉพาะเมื่อผู้ใช้ต้องการ
* **PDF / Documents:** ตรวจสอบการโหลดไฟล์ขนาดใหญ่, Lazy Loading, Download Strategy และการ Cache ที่เหมาะสม
* **File Download:** ตรวจสอบขนาดไฟล์, Compression, Streaming และการโหลดเฉพาะเมื่อผู้ใช้ร้องขอ
* **Fonts:** ตรวจสอบ Font Loading, จำนวน Font/Weight และการโหลดเฉพาะ Font ที่จำเป็น
* **Static Assets:** ตรวจสอบ CSS, JavaScript, Icons และไฟล์ Static อื่น ๆ ที่ส่งไปยัง Browser
* **Lazy Loading:** โหลด Media เฉพาะเมื่อกำลังจะเข้าสู่หน้าจอหรือเมื่อผู้ใช้ต้องการ
* **Backend Cache:** ตรวจสอบ Cache-Control, ETag / Last-Modified และ \
```
