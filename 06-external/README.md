# 🌐 06 — External Skills

สกิลจากผู้พัฒนาภายนอกที่คัดลอกมาเก็บใน repo นี้ เพื่อให้ดึงไปใช้ได้จากที่เดียวกับสกิลอื่น **ไม่แก้ไขเนื้อหาต้นฉบับ** — ถ้าต้องการปรับ ให้ทำเป็นสกิลของเราเองแยกต่างหาก

| สกิล | ต้นฉบับ | เวอร์ชันที่คัดลอก (commit) | License | ทำอะไร |
|---|---|---|---|---|
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (`.agents/skills/impeccable`) | `2f98774` (v4.5) | Apache-2.0 (+ `NOTICE.md`) | ออกแบบ วิจารณ์ ตรวจ และขัดเกลา UI — คำสั่ง `/impeccable …` ดู [docs/impeccable-guide.md](../docs/impeccable-guide.md) |
| `security-audit` | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) (`skills/security-audit`) | `c1c8a8c` | MIT | ตรวจช่องโหว่ทั้ง codebase 6 ขั้น ออกรายงานเป็นไฟล์ — ดู [docs/security-audit-guide.md](../docs/security-audit-guide.md) |

## ข้อควรรู้

- **License:** แต่ละโฟลเดอร์มีไฟล์ `LICENSE` ของต้นฉบับ (และ `NOTICE.md` ของ impeccable ตามที่ Apache-2.0 กำหนด) ต้องคัดลอกไปพร้อมสกิลเสมอ ห้ามลบ
- **impeccable** ตอนใช้งานครั้งแรก script ของมันจะดาวน์โหลดโปรแกรมเสริมจากผู้พัฒนามาไว้ข้างสกิล — เป็นพฤติกรรมของต้นฉบับ
- **security-audit** ต้องมี Node.js สำหรับ script ตรวจรูปแบบรายงาน

## อัปเดตเป็นเวอร์ชันใหม่

ต้นฉบับจะอัปเดตเรื่อยๆ แต่ใน repo นี้จะคงที่ตาม commit ในตาราง จนกว่าจะอัปเดตเอง:

```bash
# ดู commit ล่าสุดของต้นฉบับ แล้วแทน <sha>
npx degit pbakaus/impeccable/.agents/skills/impeccable#<sha> 06-external/impeccable --force
npx degit cloudflare/security-audit-skill/skills/security-audit#<sha> 06-external/security-audit --force
```

หลังอัปเดต: คัดลอก `LICENSE` / `NOTICE.md` ใหม่, อ่าน diff ก่อน commit (สกิลทำงานด้วยสิทธิ์เต็มของ AI) แล้วแก้ commit ในตารางด้านบน
