# 🧪 Skill Evals — ชุดทดสอบว่าสกิลได้ผลจริง

ใช้ตรวจ 2 เรื่อง:
1. **การเรียกใช้ (Triggering):** สกิลถูกหยิบมาใช้เองเมื่อควรใช้ และไม่ถูกหยิบเมื่อไม่เกี่ยว
2. **พฤติกรรม (Behavior):** เมื่อใช้แล้ว AI ทำตามกฎสำคัญของสกิลจริง

## วิธีรัน

**แบบมือ (เร็ว ฟรี):**
1. เปิด session ใหม่ในโปรเจกต์ตัวอย่าง (ไม่ใช่ repo นี้) แล้วพิมพ์ prompt จากตาราง **โดยไม่บอกชื่อสกิล**
2. ดูว่าสกิลที่คาดไว้ถูกเรียกไหม แล้วเช็กพฤติกรรมตามคอลัมน์ "ต้องเห็น"
3. ทำซ้ำแบบปิดสกิล (หรือในเครื่องที่ไม่มีสกิล) เพื่อเทียบว่ามีสกิลแล้วดีขึ้นจริงไหม
4. จดผลลงตาราง "ผลการรัน" ด้านล่าง

**แบบอัตโนมัติ:** ใช้สกิล `skill-creator` (สั่ง "ใช้ skill-creator รัน eval ของสกิล X จาก evals/README.md") ซึ่งรันแบบมี / ไม่มีสกิลเทียบกันและวัดผลซ้ำได้ ใช้ token มากกว่า

**เกณฑ์ผ่านต่อสกิล:** trigger ถูก 2/2, ไม่ trigger ผิดใน near-miss และผ่านพฤติกรรมทุกข้อ

---

## code-reviewer

| ประเภท | Prompt | ต้องเห็น |
|---|---|---|
| ✅ ควร trigger | "ช่วยดู diff นี้ก่อน merge หน่อย" | เรียก `code-reviewer` |
| ✅ ควร trigger | "โค้ดที่ AI เพิ่งเขียนให้ ถูกไหม" | เรียก `code-reviewer` |
| ❌ near-miss | "ตรวจ security ทั้งโปรเจกต์" | ไม่ใช่ `code-reviewer` (ควรเป็น security-engineer / security-audit) |
| 🎯 พฤติกรรม | diff ที่มีบั๊กลืน `await` 1 จุด + ชื่อตัวแปรไม่สวย | รายงานบั๊ก await พร้อมบรรทัดและสถานการณ์ที่พัง, **ไม่**รายงานชื่อตัวแปรเป็น finding, ไม่แก้โค้ดเอง |
| 🎯 พฤติกรรม | diff ที่ไม่มีปัญหา | ตอบว่าไม่พบปัญหา ไม่สร้าง finding ขึ้นมาเอง |

## debugging-engineer

| ประเภท | Prompt | ต้องเห็น |
|---|---|---|
| ✅ ควร trigger | "ล็อกอินแล้วเด้งออกทุกครั้ง ไม่รู้ทำไม" | เรียก `debugging-engineer` |
| ✅ ควร trigger | "error นี้เกิดจากอะไร: TypeError: Cannot read properties of undefined" | เรียก `debugging-engineer` |
| ❌ near-miss | "หน้า dashboard โหลดช้า 5 วินาที" | ไม่ใช่ debugging (ควรเป็น performance-engineer) |
| 🎯 พฤติกรรม | บั๊กที่มีสาเหตุไม่ชัด | ตั้งสมมติฐานและหาหลักฐานก่อน ไม่แก้โค้ดแบบเดาสุ่ม ระบุ root cause ชัดเจน |

## senior-sql-engineer

| ประเภท | Prompt | ต้องเห็น |
|---|---|---|
| ✅ ควร trigger | "query นี้ช้ามาก ควรเพิ่ม index ตรงไหน" | เรียก `senior-sql-engineer` |
| ✅ ควร trigger | "ออกแบบตารางสำหรับระบบจองคิวให้หน่อย" | เรียก `senior-sql-engineer` |
| ❌ near-miss | "ควรใช้ PostgreSQL หรือ MongoDB" | ไม่ใช่ sql-engineer เป็นหลัก (ควรเป็น technology-advisor) |
| 🎯 พฤติกรรม | ขอเพิ่ม index | ขอดู / อธิบาย EXPLAIN ก่อน, บอกข้อเสียของ index (write ช้าลง, พื้นที่) |

## flutter-engineer

| ประเภท | Prompt | ต้องเห็น |
|---|---|---|
| ✅ ควร trigger | "push notification ไม่เด้งตอนแอปถูกปิด" | เรียก `flutter-engineer` |
| ✅ ควร trigger | "ทำหน้า login ใน Flutter ด้วย Riverpod" | เรียก `flutter-engineer` |
| ❌ near-miss | "ทำหน้า login ด้วย Next.js" | ไม่ใช่ `flutter-engineer` |
| 🎯 พฤติกรรม | ขอเก็บ token | ใช้ `flutter_secure_storage` ไม่ใช่ SharedPreferences |
| 🎯 พฤติกรรม | โปรเจกต์ใช้ Provider อยู่แล้ว ขอเพิ่มฟีเจอร์ | ใช้ Provider ต่อ ไม่เสนอย้ายไป Riverpod / Bloc โดยไม่มีเหตุผล |

## project-orchestrator

| ประเภท | Prompt | ต้องเห็น |
|---|---|---|
| ✅ ควร trigger | "อยากทำระบบสต็อกสินค้าร้านเล็กๆ เริ่มยังไงดี" | เรียก `project-orchestrator` |
| ❌ near-miss | "แตกงานฟีเจอร์ตะกร้าสินค้าเป็น task ให้หน่อย" | ควรเป็น `project-manager-orchestrator` |
| 🎯 พฤติกรรม | โจทย์ใหม่ | ไม่เขียนโค้ด, อ้างเฉพาะสกิลที่มีอยู่จริง, เลือก Gate จาก `quality-gates/` ตาม Phase และชุด (Web / Mobile) ที่ถูกต้อง |

## technology-advisor

| ประเภท | Prompt | ต้องเห็น |
|---|---|---|
| ✅ ควร trigger | "เว็บร้านค้าเล็กๆ ต้องใช้ Redis ไหม" | เรียก `technology-advisor` |
| ✅ ควร trigger | "Supabase กับ Firebase อันไหนเหมาะกับแอปผม" | เรียก `technology-advisor` |
| 🎯 พฤติกรรม | ถามเรื่อง Kafka สำหรับระบบผู้ใช้ 100 คน | บอกว่ายังไม่จำเป็น พร้อมเหตุผลและเงื่อนไขที่ควรกลับมาพิจารณา |

## security-engineer

| ประเภท | Prompt | ต้องเห็น |
|---|---|---|
| ✅ ควร trigger | "API นี้คนอื่นดูข้อมูลของเราได้ไหม" | เรียก `security-engineer` |
| 🎯 พฤติกรรม | ขอตรวจ endpoint | รายงานอย่างเดียว ไม่แก้โค้ด, ทุก finding มีหลักฐาน |

---

## 📋 ผลการรัน

| วันที่ | สกิล | Trigger | Near-miss | พฤติกรรม | หมายเหตุ |
|---|---|---|---|---|---|
| | | | | | |
