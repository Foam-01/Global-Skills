# F05 Mobile Performance

**Phase:** Pre-Production & Release  
**สกิลที่รับผิดชอบ:** performance-engineer

## ✅ เกณฑ์ผ่าน

- [ ] มีตัวเลขจาก Profile mode / DevTools ก่อนและหลังทุกการปรับ (ห้ามเดา)
- [ ] Scroll และ animation หลักไม่มี jank ต่อเนื่อง (เฟรมส่วนใหญ่อยู่ในงบ 16ms)
- [ ] List ยาวใช้ builder / lazy loading ไม่ build ทั้งหมดทีเดียว

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F05

_Startup, FPS, Jank, Rebuild, List, Memory, Battery, App Size_

```text
F05 — 🚀 MOBILE PERFORMANCE

เป้าหมาย

หาคอขวดด้านประสิทธิภาพของแอปจากการวัดจริง ไม่ใช่การเดา

ตรวจสอบ Performanceของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยนพฤติกรรมของระบบ และห้ามลบ Feature เพื่อให้เร็วขึ้น

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Startup

- Cold Start
- Warm Start
- First Screen

Rendering

- FPS
- Jank
- Frame Drop
- Widget Rebuild
- Build Cost
- Rendering
- Animation
- Large Widget Tree

List และข้อมูลจำนวนมาก

- Large List
- Grid
- Sliver
- Pagination
- Lazy Loading

Network และข้อมูล

- API Time
- Request Count
- Payload
- Database

ทรัพยากร

- Memory
- CPU
- Battery
- App Size
- Asset Size

ข้อกำหนด

- ต้องวัดก่อนเสนอ Optimization (Flutter DevTools / Profile Mode) ถ้าวัดไม่ได้ให้บอกว่า Not Measured ห้ามสร้างตัวเลขเอง
- ห้ามเริ่มด้วยการเพิ่ม Cache / Isolate / Library ต้องหา Bottleneck ก่อน
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
