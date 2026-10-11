# F09 Code Quality & Architecture

**Phase:** Planning & Architecture  
**สกิลที่รับผิดชอบ:** flutter-engineer, architecture-reviewer

## ✅ เกณฑ์ผ่าน

- [ ] แบ่ง Presentation / Domain / Data ชัดเจน และ UI ไม่เรียก API หรือ database ตรง
- [ ] `flutter analyze` ผ่านโดยไม่มี error และไม่มี warning ที่ถูกปิดทิ้งโดยไม่มีเหตุผล
- [ ] ไม่มีการใช้ `!` (null assertion) ในจุดที่อาจเป็น null จริง

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F09

_โครงสร้างโฟลเดอร์ การแบ่ง Layer ขนาด Widget Lint Null Safety_

```text
F09 — 🧱 CODE QUALITY & ARCHITECTURE

เป้าหมาย

ให้โค้ด Flutter อ่านง่าย แยกหน้าที่ชัด และดูแลต่อได้

ตรวจสอบ Code Quality และ Architectureของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยนพฤติกรรมของระบบ และห้าม Rewrite โครงสร้างทั้งหมด

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

โครงสร้าง

- โครงสร้างโฟลเดอร์ (feature-first / layer-first)
- การแบ่ง Presentation / Domain / Data
- Dependency ข้าม Layer ที่ไม่ควรมี
- Dependency Injection

Widget

- Widget ใหญ่เกินไป (build ยาว)
- Logic ปนอยู่ใน UI
- ใช้ const Constructor
- Key ที่เหมาะสม

คุณภาพโค้ด

- Naming
- Duplicate Code
- Dead Code
- Magic Number / Hardcode
- Null Safety (ใช้ ! โดยไม่จำเป็น)
- analysis_options.yaml / Lint
- dart format

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
