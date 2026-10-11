# F31 Architecture & Technology Recommendation

**Phase:** Planning & Architecture  
**สกิลที่รับผิดชอบ:** technology-advisor, architecture-reviewer

## ✅ เกณฑ์ผ่าน

- [ ] ทุก library หลัก (state, network, storage) มีเหตุผลผูกกับปัญหาจริง
- [ ] ระบุได้ว่าเมื่อไหร่ architecture ปัจจุบันจะไม่พอ พร้อม trade-off ของการเปลี่ยน

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F31

_Architecture ปัจจุบัน ข้อจำกัด และเมื่อไหร่ควรเปลี่ยน พร้อม Trade-off_

```text
F31 — 🧠 ARCHITECTURE & TECHNOLOGY RECOMMENDATION

เป้าหมาย

ประเมิน Architecture และ Technology ของแอปด้วย Evidence ไม่ใช่ความชอบ

ตรวจสอบ Architecture และ Technologyของแอป Flutter ทั้งหมด โดยห้ามเสนอเปลี่ยน Architecture / Framework / Database เพียงเพราะโค้ดไม่สวย

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

ปัจจุบัน

- Architecture ที่ใช้อยู่
- State Management / Navigation / Network / Storage ที่เลือก
- เหตุผลที่น่าจะเลือก

การประเมิน

- ปัญหาจริงที่เกิดขึ้น (มี Evidence)
- ข้อจำกัดของ Design ปัจจุบัน
- ทางเลือกอื่น
- Trade-off ของแต่ละทาง
- ต้นทุนการเปลี่ยน / Risk

ADR

- ถ้าเสนอเปลี่ยน ให้เขียน ADR: Context, Decision, Alternatives, Consequence, Revisit Condition

ข้อกำหนด

- ห้ามสร้าง ADR ให้เรื่องเล็กๆ ใช้เฉพาะ Decision ที่กระทบ Architecture
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
