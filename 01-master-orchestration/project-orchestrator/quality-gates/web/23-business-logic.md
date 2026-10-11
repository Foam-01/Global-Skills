# #23 Business Logic Review

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** backend-api-engineer, payment-engineer, requirements-analyst, testing-engineer

## ✅ เกณฑ์ผ่าน

- [ ] กฎธุรกิจทั้งหมดถูกบังคับฝั่ง server ไม่เชื่อค่าราคา / สิทธิ์ / สถานะจาก client
- [ ] การเปลี่ยนสถานะ (state transition) ป้องกันการข้ามขั้นและ race condition

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #23 — Business Logic Review

_ตรวจสอบ Business Rules, Workflows, Client Trust, Race Conditions & State Transitions_

```text
23. 🏢 Business Logic Review
ตรวจสอบ Business Logic ของโปรเจกต์ทั้งหมด
โดยห้ามเปลี่ยน Business Rule หรือพฤติกรรมของระบบ
โดยไม่ได้รับอนุญาต

เริ่มจากการวิเคราะห์ก่อน ห้ามแก้ไขทันที

เป้าหมาย

ตรวจสอบว่าระบบทำงานตาม Business Requirement จริงหรือไม่
และตรวจสอบว่าผู้ใช้สามารถใช้ระบบผิดวิธี
เพื่อให้ได้ผลลัพธ์ที่ไม่ควรได้รับหรือไม่

==================================================
1. Business Rule
==================================================

ตรวจสอบ

- Rule
- Condition
- Permission
- Status
- State
- Calculation
- Validation
- Workflow

==================================================
2. Workflow
==================================================

ตรวจสอบ

Step 1
↓
Step 2
↓
Step 3
↓
Complete

ตรวจสอบว่า User สามารถ

- ข้าม Step
- ย้อน Step
- ทำ Step ซ้ำ
- ทำ Step พร้อมกัน
- เรียก API ขั้นต่อไปโดยตรง

ได้หรือไม่

==================================================
3. Duplicate Action
==================================================

ตรวจสอบ

- Submit ซ้ำ
- Payment ซ้ำ
- Reward ซ้ำ
- Coupon ซ้ำ
- Create ซ้ำ
- Delete ซ้ำ
- Update ซ้ำ

ตรวจสอบ Idempotency ตามความเหมาะสม

==================================================
4. Client Trust
==================================================

ตรวจสอบว่าระบบเชื่อข้อมูลจาก Frontend
ในส่วนที่ไม่ควรเชื่อหรือไม่

ตัวอย่าง

- Price
- Role
- User ID
- Permission
- Status
- Balance
- Discount
- Reward

ข้อมูลสำคัญต้องได้รับการตรวจสอบที่ Backend

==================================================
5. Concurrent Action
==================================================

ตรวจสอบกรณี

User A
↓
Request A

พร้อมกับ

Request B

ตรวจสอบ

- Race Condition
- Transaction
- Lock
- Atomic Operation
- Duplicate Operation

==================================================
6. State Transition
==================================================

ตรวจสอบว่า Status สามารถเปลี่ยนได้อย่างถูกต้องหรือไม่

ตัวอย่าง

Pending
↓
Processing
↓
Success

ตรวจสอบว่า User สามารถทำ

Pending
↓
Success

โดยข้าม Processing ได้หรือไม่

==================================================
7. Authorization + Business Logic
==================================================

ตรวจสอบว่า

User ธรรมดา
ไม่สามารถทำ Action
ที่ควรเป็นของ Admin

และตรวจสอบว่า

User สามารถเข้าถึง Resource
ของ User อื่นได้หรือไม่

==================================================
ข้อกำหนด

- ห้ามเปลี่ยน Business Rule
- ห้ามเปลี่ยน UX
- ห้ามเปลี่ยน API Contract
- ห้ามแก้ Logic โดยไม่ได้รับอนุญาต
- หากพบสิ่งที่คิดว่าเป็น Bug ให้แสดง Evidence
- ต้องอธิบาย Expected Behavior กับ Actual Behavior
- ต้องระบุ Impact
- ต้องเสนอวิธีแก้
- ต้องรอการอนุมัติ
```
