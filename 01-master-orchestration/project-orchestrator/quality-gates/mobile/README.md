# 📱 Mobile / Flutter Quality Gates (32 ข้อ)

ชุดตรวจคุณภาพสำหรับแอป Flutter (Android / iOS)
ต้นฉบับ: [prodgate.netlify.app](https://prodgate.netlify.app/) (Mobile / Flutter Checklist)

## วิธีใช้

- **ไม่ต้องรันทั้ง 32 ข้อพร้อมกัน** ให้เลือกเฉพาะ Gate ของ Phase ปัจจุบัน แล้วตรวจทีละด้าน
- เปิดไฟล์ของ Gate นั้น ตรวจตาม **เกณฑ์ผ่าน** และใช้ **Prompt** ในไฟล์เป็นรายการสิ่งที่ต้องดู
- Prompt ทุกข้อกำหนดให้รายงานผลเป็น PASS / ISSUE / WARNING / N/A / NEEDS MORE EVIDENCE พร้อมหลักฐาน (ไฟล์ / ฟังก์ชัน / บรรทัด)
- ถ้าแอปเรียก backend ของตัวเอง ให้ตรวจ backend ด้วย [Web Gates](../web/README.md) ที่เกี่ยวข้อง เช่น #06 Security, #07 Database, #20 API Design

## Gate ตาม Phase

- **Planning & Architecture:** F09, F31
- **Development & UI:** F01, F02, F03, F04, F07, F13, F14, F15, F16, F17, F18, F19, F20, F22, F23, F24, F26, F27
- **Testing & Security:** F06, F10, F11, F25, F30
- **Pre-Production & Release:** F05, F08, F12, F21, F28, F29, F32

## ตาราง Gate ทั้งหมด

| # | Gate | Phase | สกิลที่รับผิดชอบ |
|---|---|---|---|
| F01 | [UI Text / Copywriting](F01-copywriting.md) | Development & UI | flutter-engineer, impeccable (`clarify`) |
| F02 | [Design System / UI Consistency](F02-design-system.md) | Development & UI | flutter-engineer, impeccable (`audit`, `extract`) |
| F03 | [Mobile UX / User Flow](F03-mobile-ux-flow.md) | Development & UI | flutter-engineer, impeccable (`critique`) |
| F04 | [Responsive / Adaptive UI](F04-responsive-adaptive.md) | Development & UI | flutter-engineer, impeccable (`adapt`) |
| F05 | [Mobile Performance](F05-mobile-performance.md) | Pre-Production & Release | flutter-engineer, performance-engineer |
| F06 | [Mobile Security](F06-mobile-security.md) | Testing & Security | flutter-engineer, security-engineer, security-audit |
| F07 | [Local Data / Storage](F07-local-data.md) | Development & UI | flutter-engineer, senior-sql-engineer |
| F08 | [Production / Store Readiness](F08-store-readiness.md) | Pre-Production & Release | flutter-engineer, production-readiness-engineer, pdpa-privacy-engineer |
| F09 | [Code Quality & Architecture](F09-code-quality-architecture.md) | Planning & Architecture | flutter-engineer, architecture-reviewer, refactoring-engineer |
| F10 | [Testing & QA](F10-testing.md) | Testing & Security | flutter-engineer, testing-engineer |
| F11 | [Error Handling & Crash Reporting](F11-error-handling.md) | Testing & Security | flutter-engineer, debugging-engineer |
| F12 | [Observability (Logging / Analytics / Crash)](F12-observability.md) | Pre-Production & Release | flutter-engineer, incident-response-engineer |
| F13 | [State Management](F13-state-management.md) | Development & UI | flutter-engineer, architecture-reviewer |
| F14 | [Navigation / Routing / Deep Link](F14-navigation-deep-link.md) | Development & UI | flutter-engineer, architecture-reviewer, security-engineer |
| F15 | [API Integration](F15-api-integration.md) | Development & UI | flutter-engineer, architecture-reviewer |
| F16 | [Data Flow](F16-data-flow.md) | Development & UI | flutter-engineer, architecture-reviewer |
| F17 | [Forms & Validation](F17-forms-validation.md) | Development & UI | flutter-engineer, testing-engineer |
| F18 | [Offline / Sync / Cache Strategy](F18-offline-sync.md) | Development & UI | flutter-engineer, architecture-reviewer |
| F19 | [Push Notification](F19-push-notification.md) | Development & UI | flutter-engineer |
| F20 | [Dependency / Package Review](F20-dependencies.md) | Development & UI | flutter-engineer, security-engineer |
| F21 | [Build Config / Flavors / Environment](F21-build-flavors.md) | Pre-Production & Release | flutter-engineer, devops-engineer, production-readiness-engineer |
| F22 | [Platform Integration (Android / iOS)](F22-platform-integration.md) | Development & UI | flutter-engineer |
| F23 | [Accessibility](F23-accessibility.md) | Development & UI | flutter-engineer, impeccable (`audit`) |
| F24 | [Localization / i18n](F24-localization.md) | Development & UI | flutter-engineer |
| F25 | [Edge Case / Boundary Case](F25-edge-cases.md) | Testing & Security | flutter-engineer, testing-engineer |
| F26 | [Business Logic](F26-business-logic.md) | Development & UI | flutter-engineer, payment-engineer, requirements-analyst, testing-engineer |
| F27 | [App Lifecycle & Background](F27-app-lifecycle.md) | Development & UI | flutter-engineer, debugging-engineer |
| F28 | [Resource Efficiency (Memory / Battery / App Size)](F28-resource-efficiency.md) | Pre-Production & Release | flutter-engineer, performance-engineer |
| F29 | [Reliability / Backup / Data Recovery](F29-reliability-backup.md) | Pre-Production & Release | flutter-engineer, incident-response-engineer |
| F30 | [Authentication & Session](F30-auth-session.md) | Testing & Security | flutter-engineer, security-engineer |
| F31 | [Architecture & Technology Recommendation](F31-architecture-tech-choice.md) | Planning & Architecture | flutter-engineer, technology-advisor, architecture-reviewer |
| F32 | [Maintainability / Documentation / DX](F32-maintainability-docs.md) | Pre-Production & Release | flutter-engineer, documentation-engineer |

---

กฎการทำงาน 24 ข้อและวิธีสั่งที่ถูก ดูที่ [../README.md](../README.md)
