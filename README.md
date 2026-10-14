# 🛠️ Global Skills

สกิลสำหรับ AI Agent (Antigravity IDE) — คลังเก็บสกิลส่วนตัว แบ่งเป็น 6 หมวด รวม 29 สกิล (เขียนเอง 27 + จากภายนอก 2)

## 🤖 คำสั่งสำหรับ AI Agent: "ดึงสกิลทั้งหมด"

> **ถึง AI Agent ที่อ่านหน้านี้:** ถ้าผู้ใช้สั่งให้ดึงสกิลจาก `https://github.com/Foam-01/Global-Skills` **โดยไม่ระบุชื่อสกิล** (เช่น "ดึงสกิลมาทั้งหมด", "เอาสกิลจาก repo นี้มาใช้") ให้ทำตามขั้นตอนนี้ **ติดตั้งทุกสกิล (29 ตัว)** ไม่ต้องเลือก ไม่ต้องถามว่าจะเอาตัวไหน
> ถ้าผู้ใช้ **ระบุชื่อสกิล** ให้ดึงเฉพาะตัวนั้นตามหัวข้อ "วิธีดึงสกิลไปใช้ในโปรเจกต์" ด้านล่าง

**ขั้นตอน (ทำที่ root ของโปรเจกต์ผู้ใช้)**

1. **ดูว่ากำลังทำงานในเครื่องมือไหน** เพื่อเลือกปลายทาง
   - Claude Code → `-a claude-code` (ลงที่ `.claude/skills/`)
   - Antigravity → `-a antigravity` (ลงที่ `.agents/skills/`)
   - ไม่แน่ใจ → ถามผู้ใช้ 1 ครั้ง
2. **เช็กของเดิม:** ถ้ามีโฟลเดอร์ `.claude/skills/<ชื่อเดียวกัน>` (หรือ `.agents/skills/…`) ที่ **ไม่ได้มาจาก repo นี้** อยู่แล้ว ให้แจ้งรายชื่อและถามก่อนเขียนทับ — ถ้ามาจาก repo นี้ (มีใน `skills-lock.json`) ข้ามไปขั้น 3 ได้เลย
3. **ติดตั้งทั้งหมดด้วยคำสั่งเดียว** (ต้องมี Node.js):

   ```bash
   npx skills add Foam-01/Global-Skills --skill "*" -a claude-code -y
   ```

   (Antigravity: เปลี่ยน `-a claude-code` เป็น `-a antigravity` · ห้ามใช้ `--all` เพราะจะติดตั้งลงทุกเครื่องมือที่ CLI รู้จัก สร้างโฟลเดอร์รกโปรเจกต์)
4. **ตรวจผล:**
   - นับโฟลเดอร์ใน `.claude/skills/` ต้องได้ **29**
   - มีไฟล์ `.claude/skills/project-orchestrator/quality-gates/README.md` และ `.claude/skills/senior-sql-engineer/playbook/README.md`
   - มีไฟล์ `LICENSE` ใน `impeccable/` และ `security-audit/` (และ `NOTICE.md` ใน `impeccable/`) — ห้ามลบ
5. **ถ้าไม่มี Node.js** ใช้ git แทน (คัดลอกทุกโฟลเดอร์สกิลมาวางใต้ `skills/` ตรงๆ ไม่มีโฟลเดอร์หมวดคั่น):

   ```bash
   git clone --depth 1 https://github.com/Foam-01/Global-Skills.git /tmp/global-skills
   mkdir -p .claude/skills
   for d in /tmp/global-skills/0*/*/; do cp -r "$d" .claude/skills/; done
   rm -rf /tmp/global-skills
   ```

   PowerShell (Windows):

   ```powershell
   git clone --depth 1 https://github.com/Foam-01/Global-Skills.git "$env:TEMPglobal-skills"
   New-Item -ItemType Directory -Force .claudeskills | Out-Null
   Get-ChildItem "$env:TEMPglobal-skills" -Directory -Filter "0*" | Get-ChildItem -Directory | ForEach-Object { Copy-Item $_.FullName .claudeskills -Recurse -Force }
   Remove-Item "$env:TEMPglobal-skills" -Recurse -Force
   ```
6. **ห้ามดึง** `docs/`, `evals/`, `README.md` ของ repo นี้เข้าโปรเจกต์ (ใช้ดูแลสกิล ไม่ได้ใช้ตอนทำงาน)
7. **รายงานผู้ใช้:** จำนวนสกิลที่ติดตั้ง, ปลายทาง, สิ่งที่ข้าม / เขียนทับ และแจ้งว่า **ต้องเปิด session ใหม่** สกิลถึงจะถูกโหลด
8. **แนะนำต่อ:** อัปเดตสกิลให้ตรงกับ repo ล่าสุดในอนาคตด้วย `npx skills update` และถ้าโปรเจกต์ใช้ git ควร commit `.claude/skills/` กับ `skills-lock.json` เพื่อให้ทุกเครื่องได้สกิลชุดเดียวกัน

**ประโยคที่ผู้ใช้ใช้สั่งได้:**

> ดึงสกิลทั้งหมดจาก https://github.com/Foam-01/Global-Skills มาใส่ในโปรเจกต์นี้ ทำตามหัวข้อ "คำสั่งสำหรับ AI Agent" ใน README

---

## 📥 วิธีดึงสกิลไปใช้ในโปรเจกต์ (สำหรับ AI Agent)

> **ถึง AI Agent:** หัวข้อนี้สำหรับกรณีผู้ใช้ **ระบุชื่อสกิล** (หรือบอกงาน แล้วให้เลือกจาก [docs/skills-guide.md](docs/skills-guide.md)) ให้ดึง **เฉพาะโฟลเดอร์ของสกิลนั้น** — ถ้าผู้ใช้สั่งให้ดึงทั้งหมด ดูหัวข้อ "คำสั่งสำหรับ AI Agent" ด้านบน

**ปลายทาง**
- Claude Code → `<project>/.claude/skills/<skill-name>/`
- Antigravity → `<project>/.agents/skills/<skill-name>/`
- วางโฟลเดอร์สกิลไว้ใต้ `skills/` ตรงๆ **ไม่ต้องมีโฟลเดอร์หมวด** (`01-...`) คั่น
- ไม่ต้องดึง `docs/`, `evals/`, `README.md` (ใช้ดูแลสกิล ไม่ได้ใช้ตอนทำงาน)

**วิธีที่ 1 — `skills` CLI (แนะนำ, ต้องมี Node.js)** รันที่ root ของโปรเจกต์ ใช้ **ชื่อสกิล** ได้เลย ไม่ต้องรู้ path:

```bash
# Claude Code → .claude/skills/   (Antigravity: เปลี่ยน -a claude-code เป็น -a antigravity)
npx skills add Foam-01/Global-Skills --skill code-reviewer --skill senior-sql-engineer -a claude-code -y
```

- ดึงทั้งโฟลเดอร์ของสกิลให้ครบ (รวม `playbook/`, `quality-gates/`) และสร้างไฟล์ `skills-lock.json` จำว่าสกิลมาจากไหน
- อัปเดตสกิลในโปรเจกต์ให้ตรงกับ repo ล่าสุด: `npx skills update`
- ดูสกิลที่ติดตั้งในโปรเจกต์: `npx skills list` · ลบ: `npx skills remove <ชื่อสกิล>`

**ชุดสำเร็จรูป (copy ไปรันได้เลย)**

| ประเภทโปรเจกต์ | คำสั่ง |
|---|---|
| เว็บ full-stack (Next.js / NestJS / Supabase) | `npx skills add Foam-01/Global-Skills --skill project-orchestrator --skill backend-api-engineer --skill senior-sql-engineer --skill code-reviewer --skill security-engineer --skill testing-engineer --skill impeccable -a claude-code -y` |
| แอป Flutter + backend | `npx skills add Foam-01/Global-Skills --skill project-orchestrator --skill flutter-engineer --skill backend-api-engineer --skill senior-sql-engineer --skill code-reviewer --skill security-engineer -a claude-code -y` |
| มีระบบรับเงิน / ข้อมูลลูกค้าคนไทย | เพิ่ม `--skill payment-engineer --skill pdpa-privacy-engineer` |
| ก่อนขึ้น production | เพิ่ม `--skill devops-engineer --skill production-readiness-engineer --skill security-audit` |
| รีวิวโค้ดอย่างเดียว | `npx skills add Foam-01/Global-Skills --skill code-reviewer --skill debugging-engineer -a claude-code -y` |

**วิธีที่ 2 — degit** (ดึงทีละโฟลเดอร์ตาม path ในตารางด้านล่าง):

```bash
npx degit Foam-01/Global-Skills/<path> .claude/skills/<skill-name>
```

ตัวอย่าง:

```bash
npx degit Foam-01/Global-Skills/04-qa-security-performance/code-reviewer .claude/skills/code-reviewer
npx degit Foam-01/Global-Skills/01-master-orchestration/project-orchestrator .claude/skills/project-orchestrator
```

**วิธีที่ 3 — git (ไม่มี Node.js)**

```bash
git clone --depth 1 https://github.com/Foam-01/Global-Skills.git /tmp/global-skills
mkdir -p .claude/skills
cp -r /tmp/global-skills/<path> .claude/skills/
rm -rf /tmp/global-skills
```

**ตาราง path ของทุกสกิล**

| สกิล | path ใน repo |
|---|---|
| `engineering-mindset` | `01-master-orchestration/engineering-mindset` |
| `project-manager-orchestrator` | `01-master-orchestration/project-manager-orchestrator` |
| `project-orchestrator` | `01-master-orchestration/project-orchestrator` |
| `vibe-software-engineering` | `01-master-orchestration/vibe-software-engineering` |
| `architecture-reviewer` | `02-planning-architecture/architecture-reviewer` |
| `documentation-engineer` | `02-planning-architecture/documentation-engineer` |
| `requirements-analyst` | `02-planning-architecture/requirements-analyst` |
| `system-design-interviewer` | `02-planning-architecture/system-design-interviewer` |
| `technology-advisor` | `02-planning-architecture/technology-advisor` |
| `backend-api-engineer` | `03-building-execution/backend-api-engineer` |
| `flutter-engineer` | `03-building-execution/flutter-engineer` |
| `mcp-agent-dev` | `03-building-execution/mcp-agent-dev` |
| `modern-web-guidance` | `03-building-execution/modern-web-guidance` |
| `payment-engineer` | `03-building-execution/payment-engineer` |
| `refactoring-engineer` | `03-building-execution/refactoring-engineer` |
| `ui-ux-pro-max` | `03-building-execution/ui-ux-pro-max` |
| `code-reviewer` | `04-qa-security-performance/code-reviewer` |
| `debugging-engineer` | `04-qa-security-performance/debugging-engineer` |
| `pdpa-privacy-engineer` | `04-qa-security-performance/pdpa-privacy-engineer` |
| `performance-engineer` | `04-qa-security-performance/performance-engineer` |
| `security-engineer` | `04-qa-security-performance/security-engineer` |
| `senior-sql-engineer` | `04-qa-security-performance/senior-sql-engineer` |
| `testing-engineer` | `04-qa-security-performance/testing-engineer` |
| `devops-engineer` | `05-production-sre-utility/devops-engineer` |
| `incident-response-engineer` | `05-production-sre-utility/incident-response-engineer` |
| `production-readiness-engineer` | `05-production-sre-utility/production-readiness-engineer` |
| `thai-response` | `05-production-sre-utility/thai-response` |
| `impeccable` | `06-external/impeccable` |
| `security-audit` | `06-external/security-audit` |

**ข้อควรรู้**
- ดึง **ทั้งโฟลเดอร์ของสกิล** เสมอ (คำสั่งด้านบนทำแบบนั้นอยู่แล้ว) — บางสกิลมีไฟล์อ้างอิงข้างใน: `project-orchestrator` มี `quality-gates/`, `senior-sql-engineer` มี `playbook/`
- ถ้าปลายทางมีโฟลเดอร์ชื่อเดียวกันอยู่แล้ว ให้ถามผู้ใช้ก่อนเขียนทับ
- สกิลใน `06-external/` มีไฟล์ `LICENSE` (และ `NOTICE.md`) ของต้นฉบับ **ต้องคัดลอกไปด้วย ห้ามลบ**
- หลังดึงเสร็จ ต้องเปิด session ใหม่ สกิลถึงจะถูกโหลด

**ประโยคสั่ง AI ที่ใช้ได้เลย**

> ดึงสกิล code-reviewer, flutter-engineer และ backend-api-engineer จาก https://github.com/Foam-01/Global-Skills มาใส่ในโปรเจกต์นี้ ตามวิธีในหัวข้อ "วิธีดึงสกิลไปใช้ในโปรเจกต์" ของ README

---

## 🏛️ สถาปัตยกรรมระบบ 3 Layers (3-Tier AI System Architecture)

```text
LAYER 1: ORCHESTRATION LAYER (project-orchestrator)
└── คุมแผนแม่บท, ติดตามสถานะ %Progress, Route งานไป Layer 2, กำกับ Quality Gates

LAYER 2: ENGINEERING SKILLS (18 Specialized AI Roles)
└── ลงรายละเอียดลึกเฉพาะด้าน (BA, Architect, Tech Advisor, Security, QA, SRE, UI/UX, SQL ฯลฯ)

LAYER 3: QUALITY SYSTEM (Quality Gates: Web 42 + Mobile 32)
└── ตะแกรงร่อนตรวจคุณภาพ (Web 42 ข้อ, Flutter 32 ข้อ) ดักตรวจเฉพาะข้อที่สอดคล้องตาม Phase ต่างๆ
```

---

## 📦 รายชื่อสกิลตามหมวดหมู่ (6 Categories / 29 Skills)

📖 คู่มือเลือกสกิลตามสถานการณ์และคำอธิบายแต่ละตัว: [docs/skills-guide.md](docs/skills-guide.md)

### 👑 1. Master & Orchestration (แม่ทัพคุมภาพรวมและปรัชญาความคิด)
> 📁 `01-master-orchestration/`

| สกิล | บทบาทและคำอธิบาย |
|---|---|
| `project-orchestrator` | ⭐⭐⭐ **Grand Orchestrator (Layer 1)** — ศูนย์กลางคุมภาพรวม ติดตามสถานะโปรเจกต์ และกำกับ Quality Gates (Web 42 + Flutter 32 ข้อ) ([รายการ Gate](01-master-orchestration/project-orchestrator/quality-gates/README.md)) |
| `engineering-mindset` | 🌟 **Master Skill** — ปรัชญาและสายการทำงานของ AI ทั้งหมดเพื่อเปลี่ยน AI เป็น Engineering Partner |
| `vibe-software-engineering` | 🏗️ **Hybrid Skill** — Vibe Coding รวดเร็วระดับสปีดแสง แต่ฝังฐานปูนคอนกรีตวิศวกรรมซอฟต์แวร์แน่นหนาใต้ดิน |
| `project-manager-orchestrator` | Technical PM / Task Orchestrator — ย่อยงานเป็น Task-001 ถึง Task-XXX พร้อมกำกับ 7 สเตจ |

---

### 📐 2. Planning & Architecture (วางแผน วิเคราะห์ และสถาปัตยกรรม)
> 📁 `02-planning-architecture/`

| สกิล | บทบาทและคำอธิบาย |
|---|---|
| `requirements-analyst` | Senior Systems Analyst — แตก Requirement กว้างๆ เป็น User Stories และ API Specs |
| `technology-advisor` | Senior Architect Advisor — วิเคราะห์ว่าควรใช้/ไม่ควรใช้เทคโนโลยีใดเมื่อไหร่ |
| `documentation-engineer` | 📝 README, setup guide, Developer Experience และ ADR (บันทึกการตัดสินใจทางสถาปัตยกรรม) |
| `architecture-reviewer` | Senior Architect Reviewer — ตรวจสอบ Architecture หา Bottleneck/SPOF |
| `system-design-interviewer` | Principal Architect Interviewer — เปลี่ยน AI เป็นผู้ท้าทายความคิด (Socratic Method) |

---

### 💻 3. Building & Execution (ลงมือสร้างและเขียนโค้ด)
> 📁 `03-building-execution/`

| สกิล | บทบาทและคำอธิบาย |
|---|---|
| `modern-web-guidance` | มาตรฐานการพัฒนาเว็บด้วย Web APIs สมัยใหม่จาก Google Chrome Team |
| `ui-ux-pro-max` | Design intelligence — เลือกสไตล์ (8 แบบ), ชุดสี (6 กลุ่มธุรกิจ), คู่ฟอนต์ และ landing page pattern สำหรับ UI ใหม่ |
| `mcp-agent-dev` | คู่มือสร้างและพัฒนา MCP Server และ Agent Skill Workflows |
| `flutter-engineer` | 📱 Senior Flutter Engineer — สร้างและตรวจแอป Flutter (Android / iOS): state, routing, API, offline, push, platform, i18n, lifecycle, testing และการปล่อยขึ้น Store |
| `backend-api-engineer` | 🔌 ออกแบบและสร้าง API / Backend: endpoint, validation, error format, auth, pagination, idempotency, versioning |
| `refactoring-engineer` | 🧹 ปรับโครงสร้างโค้ดเดิมทีละขั้นโดยพฤติกรรมไม่เปลี่ยน มี test คุมก่อนแก้ |
| `payment-engineer` | 💳 ระบบรับชำระเงิน: PromptPay, บัตร, Opn (Omise), Stripe, webhook, กันตัดเงินซ้ำ, refund และกระทบยอด |

---

### 🛡️ 4. QA, Security & Performance (ตรวจสอบความเสถียรและปลอดภัย)
> 📁 `04-qa-security-performance/`

| สกิล | บทบาทและคำอธิบาย |
|---|---|
| `code-reviewer` | 🔍 Senior Code Reviewer — รีวิว diff / PR ก่อน merge หาบั๊ก ความเสี่ยง และจุดที่ดูแลยาก พร้อมหลักฐานและระดับความรุนแรง |
| `pdpa-privacy-engineer` | 🔏 ออกแบบ / ตรวจระบบตาม PDPA: consent, ข้อมูลอ่อนไหว, สิทธิ์เจ้าของข้อมูล, retention, ข้อมูลรั่ว, ส่งข้อมูลไปต่างประเทศ |
| `testing-engineer` | Senior QA / Test Engineer — วาง Test Strategy, Edge Cases, Negative/Security Cases |
| `security-engineer` | Senior Application Security Engineer — ตรวจสอบ Security 18 มิติ คิดแบบ Attacker |
| `performance-engineer` | Senior Performance Engineer — ตรวจวิเคราะห์คอขวดและเพิ่มความเร็วด้วยตัวเลขจริง |
| `debugging-engineer` | Senior Debugging Engineer — สืบหา Root Cause ของ Bug อย่างเป็นระบบ |
| `senior-sql-engineer` | 🗄️ Senior SQL Engineer — วิเคราะห์ ออกแบบ ตรวจสอบ ปรับปรุง SQL และ Database (PostgreSQL, Index, Query Performance) |

---

### 🚀 5. Production, SRE & Utility (เตรียมขึ้น Production และดูแลระบบ)
> 📁 `05-production-sre-utility/`

| สกิล | บทบาทและคำอธิบาย |
|---|---|
| `production-readiness-engineer` | Senior Production Engineer — ประเมินความพร้อมและ Failure Scenarios ก่อนขึ้น Prod |
| `incident-response-engineer` | Senior SRE / Incident Response — รับมือและกู้คืนระบบล่มบน Prod อย่างปลอดภัยต่อข้อมูล |
| `thai-response` | บังคับตอบภาษาไทยอย่างสุภาพและถูกต้อง |
| `devops-engineer` | 🚀 Environment, secrets, Docker, CI/CD, migration ตอน deploy และ rollback (เว็บและแอปมือถือ) |

---

### 🌐 6. External (สกิลจากผู้พัฒนาภายนอก)
> 📁 `06-external/` — คัดลอกจากต้นฉบับแบบไม่แก้ไข ระบุ commit และ license ไว้ใน [06-external/README.md](06-external/README.md)

| สกิล | บทบาทและคำอธิบาย |
|---|---|
| `impeccable` | 🎨 Frontend Design จาก [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0) — ออกแบบ วิจารณ์ ตรวจ และขัดเกลา UI · 📖 [docs/impeccable-guide.md](docs/impeccable-guide.md) |
| `security-audit` | 🔐 Security Audit จาก [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) (MIT) — ตรวจช่องโหว่ทั้ง codebase 6 ขั้น ออกรายงานเป็นไฟล์ · 📖 [docs/security-audit-guide.md](docs/security-audit-guide.md) |

---

## 🧪 ทดสอบสกิล

ชุดทดสอบว่าสกิลถูกเรียกใช้ถูกจังหวะและทำตามกฎจริง: [evals/README.md](evals/README.md)

---

## 🛠️ วิธีใช้

ดูหัวข้อ [📥 วิธีดึงสกิลไปใช้ในโปรเจกต์](#-วิธีดึงสกิลไปใช้ในโปรเจกต์-สำหรับ-ai-agent) ด้านบน
