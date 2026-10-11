# F07 Local Data / Storage

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** flutter-engineer, senior-sql-engineer

## ✅ เกณฑ์ผ่าน

- [ ] ทุกการเปลี่ยน schema ในเครื่องมี migration และอัปเกรดจากเวอร์ชันเก่าได้โดยไม่เสียข้อมูล
- [ ] Write และ Read ใช้ key / schema version เดียวกัน
- [ ] ข้อมูลอ่อนไหวไม่ถูกเก็บแบบไม่เข้ารหัส

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F07

_SQLite, Isar, Hive, SharedPreferences, Migration, Corruption_

```text
F07 — 💾 LOCAL DATA / STORAGE

เป้าหมาย

ให้ข้อมูลในเครื่องถูกเก็บ อ่าน และอัปเกรดอย่างถูกต้องและปลอดภัย

ตรวจสอบ Local Data และ Storageของแอป Flutter ทั้งหมด โดยห้ามเปลี่ยน Schema หรือโครงสร้างข้อมูลโดยไม่ได้รับอนุญาต

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

ชนิดที่ใช้

- SQLite
- Isar
- Hive
- SharedPreferences
- Secure Storage
- File
- Cache

โครงสร้างและการใช้งาน

- Schema
- Migration
- Query
- Index
- Serialization
- Write และ Read ใช้ Key / Database / Schema Version เดียวกันหรือไม่

ความเสี่ยง

- Storage Size
- Corruption
- Sensitive Data (เก็บถูกที่หรือไม่)

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
