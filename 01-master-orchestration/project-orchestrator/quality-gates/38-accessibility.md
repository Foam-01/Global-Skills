# #38 ACCESSIBILITY

**Phase:** Development & UI  
**สกิลที่รับผิดชอบ:** impeccable (`audit`), modern-web-guidance

## ✅ เกณฑ์ผ่าน

- [ ] ใช้งานได้ด้วยคีย์บอร์ดทั้งหมด และเห็น focus ชัดเจน
- [ ] Contrast ผ่าน WCAG AA และทุกรูป / ปุ่มไอคอนมีข้อความอธิบาย
- [ ] Form ทุกช่องมี label

ผ่านเมื่อครบทุกข้อ ถ้าข้อใดตรวจไม่ได้เพราะขาดข้อมูล ให้รายงานเป็น ⚠️ พร้อมระบุว่าขาดอะไร

---

## 📝 Prompt #38 — ACCESSIBILITY

_ตรวจสอบ Accessibility ของเว็บไซต์_

```text
38. ACCESSIBILITY
ตรวจสอบ Accessibility ของเว็บไซต์

โดยห้ามเปลี่ยน UI
โดยไม่ได้รับอนุญาต

==================================================
ตรวจสอบ

- Keyboard Navigation
- Focus State
- Semantic HTML
- Label
- Form
- Button
- Image Alt
- Screen Reader
- Color Contrast
- Error Message
- Input Validation

==================================================
ตรวจสอบ Form

Input
↓
Label
↓
Error
↓
Screen Reader

==================================================
Keyboard

ตรวจสอบว่า

Tab
↓
สามารถเข้าถึง Element สำคัญ
ได้ครบหรือไม่

==================================================
ข้อกำหนด

- ห้ามเปลี่ยน Design ทันที
- ต้องระบุ Accessibility Issue
- ต้องเสนอวิธีแก้ก่อน
```
