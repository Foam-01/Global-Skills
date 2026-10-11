# F13 State Management

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** architecture-reviewer

## ✅ เกณฑ์ผ่าน

- [ ] State แต่ละตัวมีเจ้าของชัดเจนและไม่มี state ซ้ำซ้อน
- [ ] Controller / Stream / Subscription ถูก dispose ทุกตัว
- [ ] ไม่มีการใช้ context หลัง await โดยไม่เช็ก mounted

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F13

_Bloc / Riverpod / Provider / GetX: Owner, Rebuild, Dispose, Race_

```text
F13 — 🧵 STATE MANAGEMENT

เป้าหมาย

ให้ State ของแอปถูกต้อง คาดเดาได้ และไม่ทำให้ Rebuild เกินจำเป็น

ตรวจสอบ State Managementของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยน State Management Library และห้ามเปลี่ยนพฤติกรรมของ Feature

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Ownership

- ใครเป็นเจ้าของ State แต่ละตัว
- State ซ้ำซ้อน (Duplicate State)
- Derived State ที่ควรคำนวณแทนเก็บ

การอัปเดต

- State Update Timing
- Immutable State
- Rebuild เกินจำเป็น (Selector / Consumer / BlocBuilder)
- Race Condition จาก async หลายตัว

Lifecycle

- dispose Controller / Stream / Subscription
- State ค้างหลังออกจากหน้า
- การใช้ context หลัง await (mounted)

ข้อกำหนด

- ต้องเปิดดูโค้ดจริงก่อนสรุปทุกข้อ ห้ามเดาจากชื่อไฟล์ ชื่อคลาส หรือชื่อฟังก์ชัน และทุกข้อสรุปต้องมี Evidence (ไฟล์ / ฟังก์ชัน / บรรทัด)
- ถ้าหาโค้ดที่เกี่ยวข้องไม่พบ ให้บอกว่า NOT FOUND ห้ามสร้างข้อมูลขึ้นมาเอง
- ห้ามเปลี่ยน Business Logic, API Contract และห้ามลบ Feature โดยไม่ได้รับอนุญาต
- ห้าม Rewrite หรือเปลี่ยน Architecture / State Management / เพิ่ม Library เพียงเพราะเป็น Best Practice ต้องมี Evidence ว่ามีปัญหาจริง
- ผลตรวจแต่ละข้อแยกเป็น PASS / ISSUE / WARNING / N/A / NEEDS MORE EVIDENCE
- แต่ละ Issue ต้องระบุ Root Cause, Impact, ระดับความเสี่ยง Critical / High / Medium / Low
- ต้องเสนอวิธีแก้อย่างน้อย 1 วิธี พร้อมข้อดี ข้อเสีย และ Risk ของการแก้ไข
- ต้องระบุไฟล์ที่จะแก้ และเสนอแผนก่อนลงมือ รอการอนุมัติจากผมก่อนแก้
- ถ้าไม่พบปัญหา ให้บอกว่า "ไม่พบปัญหา" และถ้าไม่จำเป็นต้องแก้ ให้บอกว่า "ไม่จำเป็นต้องแก้"
- ถ้าพบ Issue ที่ไม่อยู่ในรายการตรวจ ให้ตรวจและรายงานเพิ่มด้วย
```
