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
| อยากบันทึกว่าทำไมเลือกเทคโนโลยี / ออกแบบแบบนี้ (ADR), เขียน README | `documentation-engineer` |
| อยากให้มีคนถามจี้ให้คิดออกแบบระบบให้รอบคอบ | `system-design-interviewer` |
| อยากให้ตรวจโครงสร้างระบบที่มีอยู่ หาคอขวดและจุดเสี่ยง | `architecture-reviewer` |
| อยากสร้างเร็วแบบ vibe coding แต่ไม่อยากให้ระบบพังทีหลัง | `vibe-software-engineering` |
| ทำหน้าเว็บ อยากได้ดีไซน์สวยตามประเภทธุรกิจ | `ui-ux-pro-max` (หรือ Impeccable) |
| เขียน HTML/CSS/JS ให้ทันสมัยตามมาตรฐาน | `modern-web-guidance` |
| สร้าง MCP server หรือเขียน agent skill | `mcp-agent-dev` |
| ทำแอป Flutter (Android / iOS) หรือตรวจแอปมือถือ | `flutter-engineer` |
| ออกแบบ / สร้าง API หรือระบบหลังบ้าน, auth, error format | `backend-api-engineer` |
| โค้ดเดิมรก ไฟล์ใหญ่ อยากจัดใหม่โดยไม่ให้พัง | `refactoring-engineer` |
| เขียนโค้ดเสร็จ อยากให้รีวิวก่อน commit / merge | `code-reviewer` |
| เจอบั๊ก หาสาเหตุไม่เจอ | `debugging-engineer` |
| ระบบช้า | `performance-engineer` |
| SQL ช้า, ออกแบบตาราง, index, lock, migration | `senior-sql-engineer` |
| ตรวจช่องโหว่ความปลอดภัย (เร็ว / เฉพาะฟีเจอร์) | `security-engineer` |
| ตรวจช่องโหว่ทั้งระบบ ออกรายงานเป็นไฟล์ | `security-audit` (global) |
| เก็บข้อมูลส่วนบุคคล / ข้อมูลสุขภาพ ต้องทำตาม PDPA | `pdpa-privacy-engineer` |
| ทำระบบรับเงิน PromptPay / บัตร / webhook | `payment-engineer` |
| วางแผนการเทสต์, คิด test case | `testing-engineer` |
| จะขึ้น Production อยากรู้ว่าพร้อมหรือยัง | `production-readiness-engineer` |
| ตั้ง deploy, Docker, CI/CD, environment, secrets | `devops-engineer` |
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
**ทำอะไร:** ผู้ประสานงานระดับบนสุด (Layer 1) รับโจทย์ดิบ วางแผนแม่บท ติดตามสถานะโปรเจกต์ ส่งงานต่อให้สกิลอื่น และคุม Quality Gates (Web 42 ข้อ + Flutter 32 ข้อ) ตาม Phase **ไม่เขียนโค้ดเอง**
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

### `documentation-engineer`
**ทำอะไร:** เขียนและตรวจ README, setup guide, environment docs, Developer Experience (scripts, lint, onboarding) และ ADR บันทึกการตัดสินใจสำคัญพร้อมทางเลือก เหตุผล และเงื่อนไขที่ควรทบทวน
**ใช้ตอนไหน:** หลังตัดสินใจเรื่องสำคัญ (ใช้คู่กับ technology-advisor), ก่อนส่งต่อโปรเจกต์ หรือเมื่อ setup ยาก
**ตัวอย่าง:** "ใช้ documentation-engineer เขียน ADR ว่าทำไมเลือก Supabase"

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

### `flutter-engineer`
**ทำอะไร:** สร้าง ตรวจ และแก้บั๊กแอป Flutter ครอบคลุมโครงสร้างโปรเจกต์, state management, go_router / deep link, Dio, ข้อมูลในเครื่อง / offline, Push Notification, Platform Channel / permission, Localization (รวมภาษาไทย), App Lifecycle, performance, testing, flavors และการปล่อยขึ้น Store
**ใช้ตอนไหน:** ทำแอปมือถือด้วย Flutter หรือตรวจแอปตาม Quality Gates ชุด Mobile (F01–F32)
**ตัวอย่าง:** "ใช้ flutter-engineer ตรวจระบบ push notification ของแอปนี้"

### `backend-api-engineer`
**ทำอะไร:** ออกแบบและสร้าง API / Backend: endpoint, validation, รูปแบบ error และ status code, auth, pagination, idempotency, versioning, background job และเอกสาร API **ห้ามเปลี่ยน API contract ที่ client ใช้อยู่โดยไม่ได้รับอนุญาต**
**ใช้ตอนไหน:** สร้าง API ใหม่ หรือ API เดิมใช้ยาก / ไม่สม่ำเสมอ
**ตัวอย่าง:** "ใช้ backend-api-engineer ออกแบบ API ระบบจองคิว"

### `refactoring-engineer`
**ทำอะไร:** ปรับโครงสร้างโค้ดเดิมทีละขั้นเล็กๆ โดยพฤติกรรมต้องเหมือนเดิม 100% มี test คุมก่อนแก้ และไม่ผสมการแก้บั๊กหรือเพิ่มฟีเจอร์
**ใช้ตอนไหน:** โค้ดรก ไฟล์ใหญ่ แก้ทีไรพังที่อื่น
**ตัวอย่าง:** "ใช้ refactoring-engineer แยกไฟล์ OrderService ที่ยาว 900 บรรทัด"

### `payment-engineer`
**ทำอะไร:** ออกแบบและตรวจระบบรับชำระเงิน — ยอดเงินคำนวณที่ server เป็นสตางค์, สถานะ "จ่ายแล้ว" มาจาก webhook ที่ตรวจลายเซ็นเท่านั้น, กันตัดเงินซ้ำด้วย idempotency, PromptPay QR หมดอายุ, refund และกระทบยอดรายวัน
**ใช้ตอนไหน:** ทำหน้าจ่ายเงิน, เชื่อม Omise / Stripe / 2C2P, ลูกค้าโดนตัดเงินซ้ำ หรือยอดไม่ตรง
**ตัวอย่าง:** "ใช้ payment-engineer ตรวจ webhook ของ Omise ก่อนเปิดใช้จริง"

---

## 🛡️ 4. QA, Security & Performance

### `code-reviewer`
**ทำอะไร:** รีวิวโค้ดที่เพิ่งเขียนหรือ diff / PR เรียงตรวจจากความถูกต้อง, ความปลอดภัย, ข้อมูล, error handling, contract, test และการดูแลต่อ ทุก finding ต้องมีหลักฐานและสถานการณ์ที่ทำให้พัง **ไม่แก้โค้ดจนกว่าจะได้รับอนุมัติ**
**ใช้ตอนไหน:** ก่อน commit / merge ทุกครั้ง โดยเฉพาะโค้ดที่ AI เขียนให้
**ตัวอย่าง:** "ใช้ code-reviewer รีวิว diff นี้ก่อน merge"

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

### `pdpa-privacy-engineer`
**ทำอะไร:** แปลง PDPA เป็นสิ่งที่ระบบต้องมี — แผนที่ข้อมูล (ROPA), consent แยกวัตถุประสงค์และบันทึกหลักฐาน, ป้องกันข้อมูลอ่อนไหว, สิทธิ์ขอดู / ลบข้อมูล, retention, ส่งข้อมูลไปต่างประเทศ (cloud / AI API) และแผนรับมือข้อมูลรั่ว 72 ชั่วโมง **ไม่ใช่คำปรึกษาทางกฎหมาย** — บอกชัดว่าอะไรต้องให้นักกฎหมายยืนยัน
**ใช้ตอนไหน:** ระบบเก็บข้อมูลลูกค้า / คนไข้ / สมาชิกในไทย, ทำหน้าสมัครสมาชิก, ส่งข้อมูลให้บริการภายนอก
**ตัวอย่าง:** "ใช้ pdpa-privacy-engineer ตรวจหน้าสมัครสมาชิกแอปคลินิก"

---

## 🚀 5. Production, SRE & Utility

### `devops-engineer`
**ทำอะไร:** ตั้งค่า environment และ secrets, Docker, CI/CD (GitHub Actions), migration ตอน deploy, rollback และ build แอปมือถือใน CI เลือกทางที่เรียบง่ายที่สุดที่พอกับงาน **ไม่รันคำสั่งที่กระทบ Production โดยไม่ได้รับอนุมัติ**
**ใช้ตอนไหน:** ตั้งระบบ deploy ครั้งแรก, deploy แล้วพัง, ย้าย hosting
**ตัวอย่าง:** "ใช้ devops-engineer ตั้ง GitHub Actions deploy ขึ้น Vercel"

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
  → documentation-engineer (บันทึก ADR)
  → project-manager-orchestrator (แตกงาน)
  → backend-api-engineer / ui-ux-pro-max / Impeccable / modern-web-guidance / flutter-engineer / mcp-agent-dev (ลงมือสร้าง)
  → refactoring-engineer (เมื่อโค้ดเริ่มรก)
  → code-reviewer → testing-engineer → security-engineer → performance-engineer / senior-sql-engineer
  → devops-engineer (ตั้ง deploy / CI/CD) → production-readiness-engineer (Go / No-Go)
  → incident-response-engineer (เมื่อมีเหตุ)

debugging-engineer ใช้ได้ทุกช่วงที่เจอบั๊ก
engineering-mindset และ thai-response ใช้ควบคู่ตลอด
```
