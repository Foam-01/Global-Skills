# F10 Testing & QA

**Phase:** Testing & Security  
**สกิลที่รับผิดชอบ:** testing-engineer

## ✅ เกณฑ์ผ่าน

- [ ] Logic สำคัญ (Auth, Payment, Data) มี unit test
- [ ] Flow หลักมี widget test หรือ integration test
- [ ] Test รันอัตโนมัติใน CI และผ่านทั้งหมด โดยไม่มีการแก้ logic แอปเพื่อให้ test ผ่าน

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt F10

_Unit, Widget, Golden, Integration Test, Mock, Coverage_

```text
F10 — 🧪 TESTING & QA

เป้าหมาย

ให้มั่นใจว่าแอปมีการทดสอบที่ป้องกัน Regression ได้จริง

ตรวจสอบ Testing และ Quality Assuranceของแอป Flutter ทั้งหมด โดยห้ามแก้ Logic ของแอปเพื่อให้ Test ผ่าน

เริ่มจากการตรวจสอบและวิเคราะห์ก่อน ห้ามแก้ไขทันที

ประเภท Test

- Unit Test
- Widget Test
- Golden Test
- Integration Test (integration_test)
- End-to-End

คุณภาพ Test

- Test Coverage ของ Logic สำคัญ (Auth, Payment, Data)
- Mock / Fake ที่ใช้
- Test ที่ Flaky
- Edge Case และ Error Case
- Test ที่ไม่ได้ Assert อะไรจริง

กระบวนการ

- CI รัน Test อัตโนมัติ
- Test Data / Fixture
- วิธีรัน Test บนเครื่องและบน CI

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
