# #19 State Management Review

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** architecture-reviewer

## ✅ เกณฑ์ผ่าน

- [ ] ข้อมูลแต่ละชิ้นมีแหล่งความจริงแหล่งเดียว (single source of truth)
- [ ] Server state กับ client state แยกกันชัดเจน และไม่มีข้อมูลค้างหลังเปลี่ยนผู้ใช้หรือ logout

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #19 — State Management Review

_ตรวจสอบการจัดการ State (Local, Global, Server, Form, URL, Cache) ทั้งระบบ_

```text
19. 🧠 State Management Review
ตรวจสอบ State Management ของโปรเจกต์ทั้งหมด
โดยห้ามเปลี่ยน Business Logic หรือ UX

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

==================================================
1. State ที่ใช้งาน
==================================================

ตรวจสอบ

- Local State
- Global State
- Server State
- Form State
- URL State
- Cache State
- Session State
- Authentication State

==================================================
2. State Location
==================================================

สำหรับแต่ละ State ให้ตรวจสอบว่า

- State อยู่ถูก Component หรือไม่
- State ควรอยู่ Local หรือ Global
- State ถูกส่งผ่าน Props มากเกินไปหรือไม่
- มี Prop Drilling หรือไม่
- มี Global State ที่ไม่จำเป็นหรือไม่

==================================================
3. State Duplication
==================================================

ตรวจสอบ

- State เดียวกันถูกเก็บหลายที่หรือไม่
- Server Data ถูกเก็บซ้ำใน Client State หรือไม่
- Cache และ State ไม่ตรงกันหรือไม่
- State เก่าไม่ถูก Update หรือไม่

==================================================
4. Loading / Error State
==================================================

ตรวจสอบ

- Loading
- Error
- Empty
- Success
- Refetch
- Retry
- Stale Data

==================================================
5. React / Next.js
==================================================

ตรวจสอบ

- useState
- useReducer
- Context
- Server Component
- Client Component
- Server State
- Data Fetching
- Hydration

ตรวจสอบว่ามี State ที่ควรเป็น Server Data
แต่ถูกจัดการเป็น Client State โดยไม่จำเป็นหรือไม่

==================================================
ข้อกำหนด

- ห้ามเปลี่ยน UX
- ห้ามเปลี่ยน Business Logic
- ห้ามเพิ่ม State Management Library โดยไม่จำเป็น
- ห้ามย้าย State เพียงเพื่อให้ Code ดูสวย
- ต้องอธิบายผลกระทบก่อนแก้
- ต้องรอการอนุมัติ
```
