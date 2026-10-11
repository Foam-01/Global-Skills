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

## backend-api-engineer

| ประเภท | Prompt | ต้องเห็น |
|---|---|---|
| ✅ ควร trigger | "ออกแบบ API ระบบจองคิวร้านตัดผมให้หน่อย" | เรียก `backend-api-engineer` |
| ✅ ควร trigger | "API ของเราแต่ละ endpoint ตอบ error คนละแบบ ควรทำยังไง" | เรียก `backend-api-engineer` |
| ❌ near-miss | "ตาราง bookings ควรมี index อะไรบ้าง" | ไม่ใช่ backend-api (ควรเป็น senior-sql-engineer) |
| 🎯 พฤติกรรม | ขอเพิ่ม endpoint สร้างคำสั่งซื้อ | ตรวจสิทธิ์ที่ server, ไม่เชื่อราคาจาก client, กันการส่งซ้ำ (idempotency), error format สม่ำเสมอ |

## refactoring-engineer

| ประเภท | Prompt | ต้องเห็น |
|---|---|---|
| ✅ ควร trigger | "ไฟล์ OrderService ยาว 900 บรรทัด ช่วยจัดใหม่ แต่ห้ามพัง" | เรียก `refactoring-engineer` |
| ✅ ควร trigger | "โค้ดตรงนี้ซ้ำกันหลายที่ ช่วยรวมหน่อย" | เรียก `refactoring-engineer` |
| ❌ near-miss | "รีวิว PR นี้ก่อน merge" | ไม่ใช่ refactoring (ควรเป็น code-reviewer) |
| 🎯 พฤติกรรม | ขอ refactor ฟังก์ชันที่มีบั๊กแฝง | เสนอแผนเป็นขั้นและ safety net ก่อน, แยกรายงานบั๊กไว้ ไม่แก้บั๊กปนกับ refactor |

## devops-engineer

| ประเภท | Prompt | ต้องเห็น |
|---|---|---|
| ✅ ควร trigger | "ตั้ง GitHub Actions ให้ deploy ขึ้น Vercel อัตโนมัติ" | เรียก `devops-engineer` |
| ✅ ควร trigger | "เผลอ push ไฟล์ .env ขึ้น GitHub ทำไงดี" | เรียก `devops-engineer` (หรือ security-engineer) |
| ❌ near-miss | "เว็บล่มอยู่ตอนนี้ 500 ทุกหน้า" | ไม่ใช่ devops (ควรเป็น incident-response-engineer) |
| 🎯 พฤติกรรม | "เผลอ push .env ที่มี API key" | บอกให้ **เปลี่ยน key ใหม่ทันที** ไม่ใช่แค่ลบไฟล์หรือลบจาก history |

## documentation-engineer

| ประเภท | Prompt | ต้องเห็น |
|---|---|---|
| ✅ ควร trigger | "เขียน ADR ว่าทำไมเราเลือก Supabase" | เรียก `documentation-engineer` |
| ✅ ควร trigger | "คนใหม่ clone โปรเจกต์แล้วรันไม่ได้ ช่วยทำ README" | เรียก `documentation-engineer` |
| ❌ near-miss | "ควรเลือก Supabase หรือ Firebase" | ไม่ใช่ documentation (ควรเป็น technology-advisor) |
| 🎯 พฤติกรรม | ขอเขียน README | อ่าน script / config จริงก่อน ไม่แต่งคำสั่งที่ไม่มีอยู่, ไม่ใส่ค่าลับ |

---

ไฟล์โจทย์รอบ 2: [tasks-round2.md](tasks-round2.md) · เกณฑ์: [rubric-round2.md](rubric-round2.md) · fixtures: [fixtures/](fixtures/)

## 📋 ผลการรัน

### รอบที่ 1 — 2026-10-11 (ผู้ทดสอบ: Claude Sonnet แยกจากผู้เขียนสกิล)

**Routing (เลือกสกิลจาก description อย่างเดียว):** ถูก 28/29 ข้อ

| ข้อที่พลาด | เลือก | ควรเป็น | แก้แล้ว |
|---|---|---|---|
| "อยากทำระบบสต็อกสินค้าร้านเล็กๆ เริ่มยังไงดี" | requirements-analyst | project-orchestrator | ✅ เอาตัวอย่าง "อยากทำระบบ X" ออกจาก requirements-analyst และใส่ "เริ่มยังไงดี" ใน project-orchestrator (ยังไม่ได้รันซ้ำ) |

**พฤติกรรม (เทียบ มีสกิล vs ไม่มีสกิล):**

| สกิล | ไม่มีสกิล | มีสกิล | สรุป |
|---|---|---|---|
| code-reviewer | เจอปัญหา 7 ข้อ รวมสถานะ shipped/cancelled ยกเลิกซ้ำได้ และ notify ล้มเหลวหลังบันทึก แต่รายงานชื่อ `tmp` เป็นข้อเล็กน้อย | รูปแบบดีกว่า (ตำแหน่ง + สถานการณ์ที่พังทุกข้อ, ไม่รายงานเรื่องรสนิยม, ระบุว่าไม่แก้โค้ด) แต่ **เจอน้อยกว่า**: ลดเรื่องสถานะเป็นแค่ข้อสังเกต, พลาดเรื่อง notify, ให้ IDOR แค่ High | ❌ แพ้ด้านความครอบคลุม → แก้สกิลแล้ว: เพิ่มเช็ก state transition แบบ allowlist และ side effect หลังเขียนข้อมูล, ห้ามลดระดับปัญหาที่ยืนยันได้, IDOR / แก้ราคาเองได้ = Critical (ยังไม่ได้รันซ้ำ) |
| devops-engineer | ให้ rotate key ก่อน, ล้าง history ทีหลัง, เปิด push protection | เหมือนกันเกือบทั้งหมด และย้ำว่าไม่รันคำสั่งที่กระทบ production เอง | ➖ เสมอ — โมเดลรู้เรื่องนี้ดีอยู่แล้ว |
| refactoring-engineer | เสนอแผนก่อน, characterization test, ไม่แก้บั๊กยอดติดลบเงียบๆ | เหมือนกัน แต่เป็นขั้นตอนชัดกว่า มีความเสี่ยงแต่ละขั้น และแยกรายการบั๊กชัดเจน | ➕ ดีกว่าเล็กน้อยด้านโครงสร้าง |

**ข้อสรุปรอบนี้:** โมเดลรุ่นใหม่ทำงานพื้นฐานเหล่านี้ได้ดีอยู่แล้ว สกิลช่วยเรื่อง **ความสม่ำเสมอและรูปแบบรายงาน** มากกว่าความสามารถ และกฎที่เข้มเรื่อง "ห้ามรายงานเกิน" อาจทำให้รายงาน **น้อยเกินไป** ได้ ต้องรันซ้ำหลังแก้เพื่อยืนยัน

### รอบที่ 2 — 2026-10-11 (หลังแก้สกิล, ผู้ทดสอบ: Claude Sonnet)

**Routing:** ถูก **29/29** ข้อ — ข้อที่พลาดในรอบ 1 เลือก project-orchestrator ถูกแล้ว และไม่มีข้ออื่นพัง

**พฤติกรรม:** 6 โจทย์ ให้คะแนนด้วยเกณฑ์ที่เขียนไว้ **ก่อน** เห็นผล และให้คะแนน baseline **ก่อน** เห็นผลแบบมีสกิล

| โจทย์ | สกิล | ไม่มีสกิล | มีสกิล | จุดที่ต่าง |
|---|---|---|---|---|
| T1 รีวิว diff ออเดอร์ (โจทย์เดิม) | code-reviewer | 7/10 | **10/10** | มีสกิลให้ IDOR เป็น Critical, ไม่รายงานชื่อ `tmp`, รออนุมัติก่อนแก้ — baseline ให้ IDOR แค่ High และเขียนโค้ดแก้ให้เลย |
| T4 รีวิว diff users (โจทย์ใหม่ ไม่เคยเห็น) | code-reviewer | 8/8 | 8/8 | ทั้งคู่จับ mass assignment, admin ไม่เช็ก role, off-by-one, passwordHash รั่ว ได้ครบ |
| T5 ออกแบบ POST /orders | backend-api-engineer | 8/8 | 8/8 | มีสกิลได้ error format แบบมี code คงที่ และกรณี key ซ้ำแต่ body ต่าง (409) เพิ่ม |
| T6 หน้า login Flutter | flutter-engineer | 8/8 | 8/8 | มีสกิลระบุ NOT FOUND สำหรับไฟล์ที่ไม่เห็น และไม่ล้าง token ตอนเน็ตหลุด |
| T7 query ค้นหาสินค้าช้า | senior-sql-engineer | 6/6 | 6/6 | มีสกิลเป็นขั้นตอน (ลอง index แบบ A ก่อน วัดผล แล้วค่อย B) และขอข้อมูลเพิ่มก่อนสรุป |
| T8 เขียน README | documentation-engineer | 6/7 | **7/7** | baseline แต่งขั้นตอน deploy ขึ้นเอง — มีสกิลใส่ TODO แทนสิ่งที่ไม่รู้ และสังเกตว่าไม่มี .gitignore |
| **รวม** | | **43/47** | **47/47** | |

**ข้อสรุปรอบ 2:**
- การแก้ code-reviewer หลังรอบ 1 ได้ผล: จาก "แพ้ baseline" กลายเป็นชนะในโจทย์เดิม และเสมอในโจทย์ใหม่ (ไม่ได้ overfit กับโจทย์เดิม)
- สกิลช่วยมากที่สุดเรื่อง **วินัย** (ระดับความรุนแรงถูก, รออนุมัติก่อนแก้, ไม่แต่งข้อมูลที่ไม่รู้) ส่วนความรู้เทคนิค baseline ก็ทำได้ดีอยู่แล้ว

**ข้อจำกัด (อ่านผลด้วยความระวัง):**
- ตัวอย่างน้อย (1–2 โจทย์ต่อสกิล รันครั้งเดียว) คะแนนอาจแกว่งถ้ารันซ้ำ
- ผู้ให้คะแนนพฤติกรรมคือ Claude ที่เป็นผู้เขียนสกิล (ลดอคติด้วยการเขียนเกณฑ์และให้คะแนน baseline ก่อน แต่ไม่ได้ตัดออกทั้งหมด)
- ผลแบบมีสกิลเป็นรายงานสรุปจาก agent บางจุดอาจละเอียดน้อยกว่าคำตอบเต็ม
- ยังไม่ได้ทดสอบพฤติกรรมสกิลอื่นอีก 15 ตัว

| วันที่ | สกิล | Trigger | Near-miss | พฤติกรรม | หมายเหตุ |
|---|---|---|---|---|---|
| 2026-10-11 | ทั้งหมด 11 สกิล | 18/19 | 10/10 | — | พลาด project-orchestrator 1 ข้อ |
| 2026-10-11 | code-reviewer | 2/2 | 1/1 | ❌ | ครอบคลุมน้อยกว่า baseline |
| 2026-10-11 | devops-engineer | 2/2 | 1/1 | ✅ | เท่ากับ baseline |
| 2026-10-11 | refactoring-engineer | 2/2 | 1/1 | ✅ | ดีกว่า baseline เล็กน้อย |
| 2026-10-11 (รอบ 2) | ทั้งหมด 11 สกิล | 19/19 | 10/10 | — | routing ถูกทุกข้อ |
| 2026-10-11 (รอบ 2) | code-reviewer | — | — | ✅ | 18/18 vs baseline 15/18 |
| 2026-10-11 (รอบ 2) | backend-api-engineer | 2/2 | 1/1 | ✅ | 8/8 เท่ากับ baseline |
| 2026-10-11 (รอบ 2) | flutter-engineer | 2/2 | 1/1 | ✅ | 8/8 เท่ากับ baseline |
| 2026-10-11 (รอบ 2) | senior-sql-engineer | 2/2 | 1/1 | ✅ | 6/6 เท่ากับ baseline |
| 2026-10-11 (รอบ 2) | documentation-engineer | 2/2 | 1/1 | ✅ | 7/7 vs baseline 6/7 |
