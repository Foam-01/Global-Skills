# 🌐 Web Quality Gates (42 ข้อ)

ชุดตรวจคุณภาพ Layer 3 ที่ `project-orchestrator` ใช้กำกับแต่ละ Phase
ต้นฉบับ: [prodgate.netlify.app](https://prodgate.netlify.app/) (Web Checklist)

## วิธีใช้

- **ไม่ต้องรันทั้ง 42 ข้อพร้อมกัน** ให้เลือกเฉพาะ Gate ของ Phase ปัจจุบัน แล้วตรวจทีละด้าน
- เปิดไฟล์ของ Gate นั้น ตรวจตาม **เกณฑ์ผ่าน** และใช้ **Prompt** ในไฟล์เป็นรายการสิ่งที่ต้องดู
- บาง Gate ตรวจเรื่องเดียวกัน (เช่น #06 กับ #15) จึงใช้ไฟล์เดียวกัน แต่เลขเดิมยังใช้อ้างอิงได้ทุกเลข
- รายงานผลแต่ละ Gate เป็น ✅ ผ่าน / ❌ ไม่ผ่าน / ⚠️ ตรวจไม่ได้ (ระบุว่าขาดข้อมูลอะไร)

## Gate ตาม Phase

- **Planning & Architecture:** #07, #08, #14, #16, #22, #24, #25, #31, #32, #34, #37, #41, #42
- **Development & UI:** #01, #02, #03, #04, #12, #18, #19, #20, #21, #23, #30, #36, #38, #39
- **Testing & Security:** #06, #09, #10, #15, #17, #26, #33
- **Pre-Production & Release:** #05, #11, #13, #27, #28, #29, #35, #40

## ตาราง Gate ทั้งหมด

| # | Gate | Phase | สกิลที่รับผิดชอบ |
|---|---|---|---|
| 01 | [UI Text / Copywriting](01-copywriting.md) | Development & UI | impeccable (`clarify`) |
| 02 | [UI Consistency](02-ui-consistency.md) | Development & UI | impeccable (`audit`, `extract`) |
| 03 | [UX & User Flow](03-ux-flow.md) | Development & UI | impeccable (`critique`) |
| 04 | [Responsive Design](04-responsive.md) | Development & UI | impeccable (`adapt`), modern-web-guidance |
| 05 | [Performance](05-performance.md) | Pre-Production & Release | performance-engineer |
| 06 | [Security](06-security.md) | Testing & Security | security-engineer, security-audit |
| 07 | [Database](07-database.md) | Planning & Architecture | senior-sql-engineer |
| 08 | [Code Quality & Architecture](08-code-quality-maintainability.md) | Planning & Architecture | architecture-reviewer |
| 09 | [Testing & Quality Assurance](09-testing.md) | Testing & Security | testing-engineer |
| 10 | [Error Handling](10-error-handling.md) | Testing & Security | debugging-engineer |
| 11 | [Observability](11-observability.md) | Pre-Production & Release | incident-response-engineer |
| 12 | [Cache & Redis Strategy](12-cache.md) | Development & UI | performance-engineer |
| 13 | [Deployment & Production Readiness](13-production-readiness.md) | Pre-Production & Release | production-readiness-engineer |
| 14 | [Scalability](14-scalability.md) | Planning & Architecture | architecture-reviewer, system-design-interviewer |
| 15 | [Production Security Review](06-security.md) | Testing & Security | security-engineer, security-audit |
| 16 | [Maintainability Review](08-code-quality-maintainability.md) | Planning & Architecture | architecture-reviewer |
| 17 | [Edge Case / Boundary Case Review](17-edge-cases.md) | Testing & Security | testing-engineer |
| 18 | [Data Flow Review](18-data-flow.md) | Development & UI | architecture-reviewer |
| 19 | [State Management Review](19-state-management.md) | Development & UI | architecture-reviewer |
| 20 | [API Design Review](20-api-design.md) | Development & UI | architecture-reviewer, security-engineer |
| 21 | [Dependency / Package Review](21-dependencies.md) | Development & UI | security-engineer |
| 22 | [Cost / Resource Efficiency Review](22-cost.md) | Planning & Architecture | technology-advisor |
| 23 | [Business Logic Review](23-business-logic.md) | Development & UI | requirements-analyst, testing-engineer |
| 24 | [Architecture & Technology Recommendation Review](24-architecture-tech-choice.md) | Planning & Architecture | technology-advisor, architecture-reviewer |
| 25 | [Diagram & System Visualization](25-diagrams.md) | Planning & Architecture | architecture-reviewer |
| 26 | [Testing Strategy Review](09-testing.md) | Testing & Security | testing-engineer |
| 27 | [Observability Review](11-observability.md) | Pre-Production & Release | incident-response-engineer |
| 28 | [Disaster Recovery Strategy Review](28-disaster-recovery.md) | Pre-Production & Release | incident-response-engineer |
| 29 | [Backup & Data Recovery Review](29-backup.md) | Pre-Production & Release | incident-response-engineer, senior-sql-engineer |
| 30 | [API Design Review](20-api-design.md) | Development & UI | architecture-reviewer, security-engineer |
| 31 | [Database Design Review](07-database.md) | Planning & Architecture | senior-sql-engineer |
| 32 | [Scalability Review](14-scalability.md) | Planning & Architecture | architecture-reviewer, system-design-interviewer |
| 33 | [System Reliability Review](33-reliability.md) | Testing & Security | production-readiness-engineer |
| 34 | [Maintainability Review](08-code-quality-maintainability.md) | Planning & Architecture | architecture-reviewer |
| 35 | [Project Documentation Review](35-documentation.md) | Pre-Production & Release | — |
| 36 | [Developer Experience (DX) Review](36-developer-experience.md) | Development & UI | — |
| 37 | [Cost Optimization Review](22-cost.md) | Planning & Architecture | technology-advisor |
| 38 | [ACCESSIBILITY](38-accessibility.md) | Development & UI | impeccable (`audit`), modern-web-guidance |
| 39 | [SEO / UX](39-seo.md) | Development & UI | modern-web-guidance |
| 40 | [PRODUCTION READINESS](13-production-readiness.md) | Pre-Production & Release | production-readiness-engineer |
| 41 | [ARCHITECTURE DECISION RECORD (ADR)](41-adr.md) | Planning & Architecture | — (ยังไม่มีสกิล) |
| 42 | [Senior SQL Engineer](07-database.md) | Planning & Architecture | senior-sql-engineer |

---

กฎการทำงาน 24 ข้อและวิธีสั่งที่ถูก ดูที่ [../README.md](../README.md)
