# 🛠️ Global Skills

สกิลสำหรับ AI Agent (Antigravity IDE) — คลังเก็บสกิลส่วนตัว แบ่งหมวดหมู่เป็น 5 กลุ่มชัดเจน รวมทั้งหมด 27 สกิล

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

## 📦 รายชื่อสกิลตามหมวดหมู่ (5 Categories / 27 Skills)

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

## 🌐 สกิลภายนอกที่ติดตั้งแบบ Global

สกิลจากแหล่งภายนอกที่ติดตั้งไว้ที่ `~/.claude/skills/` (ใช้ได้ทุกโปรเจกต์ใน Claude Code และไม่ได้เก็บไว้ใน repo นี้)

| สกิล | แหล่งที่มา | บทบาทและคำอธิบาย |
|---|---|---|
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | 🎨 Frontend Design — ออกแบบ วิจารณ์ ตรวจ (audit) และขัดเกลา UI/UX ทั้ง typography, layout, สี, motion และ accessibility |
| `security-audit` | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) | 🔐 Security Audit — ตรวจช่องโหว่ทั้ง codebase แบบ 6 ขั้น มีตรวจซ้ำอิสระ และออกรายงานเป็นไฟล์ |

### `impeccable`

```bash
npx skills add pbakaus/impeccable -g -a claude-code
```

ครั้งแรกในแต่ละโปรเจกต์ ให้รัน `/impeccable init` และ `/impeccable hooks on` ในแชท

📖 คู่มือเลือกคำสั่ง: [docs/impeccable-guide.md](docs/impeccable-guide.md)

### `security-audit`

```bash
npx skills add https://github.com/cloudflare/security-audit-skill --skill security-audit -g -a claude-code
```

ไม่มีคำสั่ง `/` พิมพ์สั่งเป็นภาษาธรรมดา เช่น "security audit this codebase" (ต้องมี Node.js)

📖 คู่มือการใช้งาน: [docs/security-audit-guide.md](docs/security-audit-guide.md)

---

## 🧪 ทดสอบสกิล

ชุดทดสอบว่าสกิลถูกเรียกใช้ถูกจังหวะและทำตามกฎจริง: [evals/README.md](evals/README.md)

---

## 🛠️ วิธีใช้

คัดลอกโฟลเดอร์สกิลที่ต้องการจากหมวดหมู่เข้าไปในโปรเจกต์:

```
โปรเจกต์/
└── .agents/
    └── skills/
        └── <skill-name>/
            └── SKILL.md
```
