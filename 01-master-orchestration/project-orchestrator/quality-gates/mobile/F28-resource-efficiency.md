# F28 Resource Efficiency (Memory / Battery / App Size)

**Phase:** Pre-Production & Release  
**สกิลที่รับผิดชอบ:** performance-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ไม่มี memory leak จากการเปิด-ปิดหน้าซ้ำ (ตรวจด้วย DevTools Memory)
- [ ] รูปถูกย่อขนาดและ cache ไม่โหลดรูปเต็มความละเอียดมาแสดงเป็น thumbnail
- [ ] รู้ขนาดแอปและรู้ว่าอะไรกินพื้นที่มากที่สุด

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F28

_Memory Leak, Battery Drain, ขนาดแอป, Asset และ Image_

```text
F28 — 🔋 RESOURCE EFFICIENCY (MEMORY / BATTERY / APP SIZE)

เป้าหมาย

ให้แอปประหยัดหน่วยความจำ แบตเตอรี่ และพื้นที่ติดตั้ง

ตรวจสอบ การใช้ทรัพยากรของแอป Flutter ทั้งหมด โดยห้ามลบ Feature เพื่อประหยัดทรัพยากร

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

Memory

- Controller / Stream / Listener ที่ไม่ Dispose
- Image ขนาดใหญ่ / Decode ใหญ่กว่าที่แสดง
- List ใหญ่ / Cache โตไม่จำกัด
- WebView / Animation

Battery

- Location / GPS
- Polling / Timer
- Background Task / Sync
- Animation ที่รันตลอด

App Size

- Asset / Font / Image ที่ไม่ได้ใช้
- Package ที่ใหญ่
- การ Split ABI / Deferred Components
- Tree Shaking / Obfuscation

ข้อกำหนด

- ต้องวัดก่อนเสนอ ถ้าวัดไม่ได้ให้บอกว่า Not Measured ห้ามสร้างตัวเลขเอง
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
