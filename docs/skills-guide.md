# 📚 คู่มือสกิลทั้งหมด — ใช้สกิลไหน เมื่อไหร่

รวมคำอธิบายสกิลทุกตัวใน repo นี้ ว่าแต่ละตัวทำอะไร ใช้ตอนไหน และสั่งอย่างไร
สกิลภายนอกดูแยกที่ [impeccable-guide.md](impeccable-guide.md) และ [security-audit-guide.md](security-audit-guide.md)

---

## 🧭 เลือกสกิลตามสถานการณ์

| สถานการณ์ | สกิลที่ใช้ |
|---|---|
| เริ่มโปรเจกต์ใหม่ อยากได้แผนทั้งหมด | `project-orchestrator` |
| มีงานก้อนใหญ่ อยากแตกเป็นงานย่อยและติดตามสถานะ | `project-manager-orchestrator` |
| มีไอเดียหรือโจทย์ธุรกิจกว้างๆ อยากได้ User Story, API, Data Model | `requirements-analyst` |
| ลังเลว่าจะใช้ภาษา, framework หรือ database ตัวไหน | `technology-advisor` |
| อยากให้มีคนถามจี้ให้คิดออกแบบระบบให้รอบคอบ | `system-design-interviewer` |
| อยากให้ตรวจโครงสร้างระบบที่มีอยู่ หาคอขวดและจุดเสี่ยง | `architecture-reviewer` |
| อยากสร้างเร็วแบบ vibe coding แต่ไม่อยากให้ระบบพังทีหลัง | `vibe-software-engineering` |
| ทำหน้าเว็บ อยากได้ดีไซน์สวยตามประเภทธุรกิจ | `ui-ux-pro-max` (หรือ Impeccable) |
| เขียน HTML/CSS/JS ให้ทันสมัยตามมาตรฐาน | `modern-web-guidance` |
| สร้าง MCP server หรือเขียน agent skill | `mcp-agent-dev` |
| เจอบั๊ก หาสาเหตุไม่เจอ | `debugging-engineer` |
| ระบบช้า | `performance-engineer` |
| SQL ช้า, ออกแบบตาราง, index, lock, migration | `senior-sql-engineer` |
| ตรวจช่องโหว่ความปลอดภัย (เร็ว / เฉพาะฟีเจอร์) | `security-engineer` |
| ตรวจช่องโหว่ทั้งระบบ ออกรายงานเป็นไฟล์ | `security-audit` (global) |
| วางแผนการเทสต์, คิด test case | `testing-engineer` |
| จะขึ้น Production อยากรู้ว่าพร้อมหรือยัง | `production-readiness-engineer` |
| ระบบบน Production ล่ม | `incident-response-engineer` |
| อยากให้ AI ตอบเป็นภาษาไทยเสมอ | `thai-response` |
| ทุกงาน (ปรัชญาการคิดพื้นฐาน) | `engineering-mindset` |

---

## 👑 1. Master & Orchestration

### `engineering-mindset`
**ทำอะไร:** ปรัชญาหลักที่เปลี่ยน AI จาก "คนเขียนโค้ดตามสั่ง" เป็น "คู่คิดทางวิศวกรรม" ยึดหลักเลือกเทคโนโลยีตามปัญหา, ใช้หลักฐานและตัวเลขแทนการเดา และเลือกทางที่เรียบง่ายก่อน
**ใช้ตอนไหน:** เป็นพื้นฐานของทุกงาน ใช้คู่กับสกิลอื่นได้เสมอ
**ตัวอย่าง:** "ใช้ engineering-mindset ช่วยคิดว่าฟีเจอร์นี้ควรทำไหม"

### `project-orchestrator`
**ทำอะไร:** ผู้ประสานงานระดับบนสุด (Layer 1) รับโจทย์ดิบ วางแผนแม่บท ติดตามสถานะโปรเจกต์ ส่งงานต่อให้สกิลอื่น และคุม Quality Gates 41 ข้อตาม Phase **ไม่เขียนโค้ดเอง**
**ใช้ตอนไหน:** เริ่มโปรเจกต์ใหม่ หรืออยากเห็นภาพรวมว่าตอนนี้อยู่ Phase ไหน ต้องผ่านด่านอะไร
**ตัวอย่าง:** "ใช้ project-orchestrator วางแผนระบบจองคิวร้านตัดผม"

### `project-manager-orchestrator`
**ทำอะไร:** PM สำหรับนักพัฒนาคนเดียว แตกงานเป็น Epic → Feature → Task → Subtask และติดตามสถานะแต่ละงาน
**ใช้ตอนไหน:** มีงานก้อนใหญ่ อยากได้รายการงานที่ทำทีละข้อได้ และไม่หลงทาง
**ตัวอย่าง:** "ใช้ project-manager-orchestrator แตกงานฟีเจอร์ระบบสมาชิก"

### `vibe-software-engineering`
**ทำอะไร:** สร้างของเร็วแบบ vibe coding (ส่วนที่มองเห็น/UI) แต่บังคับวางรากฐาน 6 ด้าน ได้แก่ Clean Architecture, Schema, Security, Type/Test, Observability
**ใช้ตอนไหน:** อยากได้ MVP เร็ว แต่จะเอาไปใช้จริง
**ตัวอย่าง:** "ใช้ vibe-software-engineering สร้างแอปจดรายจ่าย"

---

## 📐 2. Planning & Architecture

### `requirements-analyst`
**ทำอะไร:** เปลี่ยนโจทย์ธุรกิจกว้างๆ เป็น User Stories, Acceptance Criteria, API Endpoints, Data Models และ Technical Tasks
**ใช้ตอนไหน:** มีแค่ไอเดีย ยังไม่รู้ว่าต้องสร้างอะไรบ้าง
**ตัวอย่าง:** "ใช้ requirements-analyst วิเคราะห์ระบบสั่งอาหารออนไลน์"

### `technology-advisor`
**ทำอะไร:** แนะนำเทคโนโลยี (Frontend, Backend, Database, Cache ฯลฯ) ที่เหมาะกับโจทย์และข้อจำกัด เน้นเรียบง่ายและคุ้มค่า ป้องกัน over-engineering
**ใช้ตอนไหน:** ก่อนเลือก stack หรือตอนลังเลระหว่างหลายตัวเลือก
**ตัวอย่าง:** "ใช้ technology-advisor ช่วยเลือกระหว่าง PostgreSQL กับ MongoDB"

### `system-design-interviewer`
**ทำอะไร:** ตั้งคำถามเชิงลึกแบบ Socratic 4 ขั้น ได้แก่ ขอบเขตและตัวเลข, เหตุผลการออกแบบ, ความทนทานและ edge case, ต้นทุนและการดูแล
**ใช้ตอนไหน:** อยากฝึกคิดหรือเตรียมสัมภาษณ์ system design หรือก่อนลงมือสร้างระบบใหญ่
**ตัวอย่าง:** "ใช้ system-design-interviewer สัมภาษณ์ผมเรื่องออกแบบระบบแชต"

### `architecture-reviewer`
**ทำอะไร:** ตรวจสถาปัตยกรรมที่มีอยู่ หาคอขวด ความเสี่ยง และจุดล้มเหลวจุดเดียว (Single Point of Failure) **วิเคราะห์อย่างเดียว ไม่แก้โค้ดถ้าไม่ได้รับอนุญาต**
**ใช้ตอนไหน:** ระบบเริ่มใหญ่ หรือก่อน scale
**ตัวอย่าง:** "ใช้ architecture-reviewer ตรวจโครงสร้างโปรเจกต์นี้"

---

## 💻 3. Building & Execution

### `ui-ux-pro-max`
**ทำอะไร:** ออกแบบ UI/UX ระดับมืออาชีพ เลือกสไตล์ (Minimal, Glassmorphism, Neubrutalism, Dark Premium ฯลฯ), สี, ฟอนต์, layout และ animation ให้เหมาะกับประเภทธุรกิจ
**ใช้ตอนไหน:** สร้างหน้าเว็บ แลนดิ้งเพจ แดชบอร์ด หรือแอปที่อยากให้สวย
**ต่างจาก Impeccable:** ui-ux-pro-max เด่นเรื่องเลือกสไตล์และสร้าง design system ส่วน Impeccable มีคำสั่งย่อยครบวงจร (critique, audit, polish) และตรวจอัตโนมัติด้วย hooks
**ตัวอย่าง:** "ใช้ ui-ux-pro-max ออกแบบหน้าแรกร้านกาแฟ"

### `modern-web-guidance`
**ทำอะไร:** แนวทางเขียนเว็บสมัยใหม่ตามมาตรฐานทีม Chrome ใช้ Native Web API แทน library, CSS layout สมัยใหม่, performance, ฟอร์ม, accessibility และ responsive
**ใช้ตอนไหน:** เขียน HTML/CSS/JS โดยตรง หรืออยากลด dependency
**ตัวอย่าง:** "ใช้ modern-web-guidance ทำ dialog โดยไม่ใช้ library"

### `mcp-agent-dev`
**ทำอะไร:** แนวทางสร้าง MCP server, เขียน agent skill และ agentic workflow
**ใช้ตอนไหน:** อยากให้ AI ต่อกับระบบหรือเครื่องมือของเรา หรือจะเขียนสกิลใหม่
**ตัวอย่าง:** "ใช้ mcp-agent-dev สร้าง MCP server อ่านข้อมูลจาก Google Sheet"

---

## 🛡️ 4. QA, Security & Performance

### `debugging-engineer`
**ทำอะไร:** หาสาเหตุที่แท้จริงของบั๊ก (Root Cause Analysis) อย่างเป็นระบบ ทั้ง Frontend, Backend และ Database ห้ามเดาสุ่มแก้และห้ามซ่อนบั๊ก
**ใช้ตอนไหน:** เจอบั๊กที่แก้แล้วไม่หาย หรือไม่รู้ว่าเกิดจากอะไร
**ตัวอย่าง:** "ใช้ debugging-engineer หาสาเหตุว่าทำไมล็อกอินแล้วเด้งออก"

### `performance-engineer`
**ทำอะไร:** วิเคราะห์และปรับความเร็วทั้งระบบ (Frontend, Backend, Database, Network) **ต้องมีตัวเลขก่อนและหลังเสมอ** ห้ามอ้างว่าเร็วขึ้นโดยไม่มีหลักฐาน
**ใช้ตอนไหน:** เว็บหรือ API ช้า
**ตัวอย่าง:** "ใช้ performance-engineer ดูว่าทำไมหน้า dashboard โหลด 5 วินาที"

### `senior-sql-engineer`
**ทำอะไร:** งาน Database ทั้งหมด ได้แก่ ออกแบบ schema, รีวิว SQL, ปรับ query ให้เร็ว, วาง index, transaction, concurrency, lock, data integrity และ migration (เน้น PostgreSQL)
**ใช้ตอนไหน:** query ช้า, ออกแบบตาราง, ข้อมูลเพี้ยน, deadlock หรือจะทำ migration
**ตัวอย่าง:** "ใช้ senior-sql-engineer ดู query นี้ว่าควรเพิ่ม index ตรงไหน"

### `security-engineer`
**ทำอะไร:** ตรวจช่องโหว่ 18 มิติจากมุมมองแฮกเกอร์ เช่น Authentication, Authorization, API, Injection, XSS **รายงานอย่างเดียว ไม่แก้โค้ดล่วงหน้า**
**ใช้ตอนไหน:** ก่อนปล่อยระบบ หรือหลังเพิ่มฟีเจอร์ที่เกี่ยวกับข้อมูลผู้ใช้หรือการเงิน
**ตัวอย่าง:** "ใช้ security-engineer ตรวจระบบล็อกอินและ API"

### `testing-engineer`
**ทำอะไร:** วางกลยุทธ์เทสต์ คิด Test Cases, Edge Cases, Negative Cases และ Security Tests **ห้ามแก้โค้ดจริงเพื่อให้เทสต์ผ่าน**
**ใช้ตอนไหน:** หลังเขียนฟีเจอร์เสร็จ หรืออยากรู้ว่าควรเทสต์อะไรบ้าง
**ตัวอย่าง:** "ใช้ testing-engineer วางแผนเทสต์ระบบชำระเงิน"

---

## 🚀 5. Production, SRE & Utility

### `production-readiness-engineer`
**ทำอะไร:** ประเมินว่าพร้อมขึ้น Production หรือยัง (security, performance, ความเสถียร, environment, CI/CD, failure scenarios) แล้วตัดสิน Go / No-Go **ไม่ให้ Go ถ้ายังมีความเสี่ยงร้ายแรง**
**ใช้ตอนไหน:** ก่อน deploy จริงครั้งแรก หรือก่อนปล่อยฟีเจอร์ใหญ่
**ตัวอย่าง:** "ใช้ production-readiness-engineer ประเมินว่าพร้อมขึ้น Prod ไหม"

### `incident-response-engineer`
**ทำอะไร:** รับมือระบบล่มบน Production อย่างเป็นขั้นตอน ประเมินผลกระทบ กู้ระบบโดยไม่ให้ข้อมูลเสียหาย แล้วเขียน Postmortem ป้องกันเกิดซ้ำ
**ใช้ตอนไหน:** ระบบล่ม error พุ่ง หรือผู้ใช้เข้าไม่ได้
**ตัวอย่าง:** "ใช้ incident-response-engineer เว็บล่ม 500 ทุกหน้า"

### `thai-response`
**ทำอะไร:** บังคับให้ AI ตอบเป็นภาษาไทยที่เข้าใจง่าย กระชับ และอธิบายศัพท์เทคนิคเป็นไทย
**ใช้ตอนไหน:** ติดตั้งไว้ในทุกโปรเจกต์ที่อยากให้คุยภาษาไทย

---

## 🗺️ ลำดับการใช้งานตลอดโปรเจกต์

```
project-orchestrator (คุมภาพรวม)
  → requirements-analyst → technology-advisor → system-design-interviewer / architecture-reviewer
  → project-manager-orchestrator (แตกงาน)
  → ui-ux-pro-max / Impeccable / modern-web-guidance / mcp-agent-dev (ลงมือสร้าง)
  → testing-engineer → security-engineer → performance-engineer / senior-sql-engineer
  → production-readiness-engineer (Go / No-Go)
  → incident-response-engineer (เมื่อมีเหตุ)

debugging-engineer ใช้ได้ทุกช่วงที่เจอบั๊ก
engineering-mindset และ thai-response ใช้ควบคู่ตลอด
```
