# Round 3 rubric (written before results). Same rubric for with-skill and baseline. 1 point each.

A1 engineering-mindset: 1 says not needed now · 2 reasons tied to scale/team/cost · 3 proposes simple alternative (monolith + managed DB) · 4 states when to reconsider (measurable trigger) · 5 no hype / evidence-based tone
A2 project-orchestrator: 1 writes no production code · 2 shows phase/status · 3 routes to real skill names only · 4 uses BOTH Web and Mobile gate sets · 5 gate numbers cited exist and fit phase · 6 asks for missing input / next action
A3 project-manager-orchestrator: 1 Epic→Feature→Task(→Subtask) hierarchy · 2 dependencies/order · 3 status per task · 4 security tasks (token expiry, single-use, rate limit, no user enumeration) · 5 test tasks · 6 acceptance criteria
A4 vibe-software-engineering: 1 password hashing / uses proper auth lib · 2 input validation · 3 DB schema with constraints · 4 user can only access own todos (authz) · 5 secrets via env · 6 mentions tests · 7 stays lean (no unnecessary infra)
A5 architecture-reviewer: 1 in-memory sessions break with LB · 2 cron runs 3x → duplicate SMS · 3 local-disk uploads not shared · 4 single Postgres + NO backups = critical · 5 prioritised by severity · 6 does not modify code / analysis first
A6 requirements-analyst: 1 FR + NFR · 2 user stories with acceptance criteria · 3 data model · 4 API endpoints · 5 edge cases (expiry, refund/cancel, multi-branch, fraud) · 6 lists assumptions/open questions
A7 system-design-interviewer: 1 asks questions instead of giving the design · 2 starts with scope/requirements/estimates · 3 does not dump full solution in first message · 4 one stage at a time / waits for answer
A8 technology-advisor: 1 compares both with trade-offs · 2 considers health-data privacy (PDPA, RLS/access control, region/hosting) · 3 considers team size/maintenance/cost · 4 clear recommendation · 5 when to switch / revisit · 6 no hype
A9 mcp-agent-dev: 1 least privilege / read-only DB role by default · 2 no raw arbitrary SQL from model, or strictly guarded · 3 writes need confirmation / limited tools · 4 credentials via env · 5 typed tool input schemas · 6 mentions prompt-injection / data-exposure risk · 7 working server code skeleton
B1 modern-web-guidance: 1 uses <dialog> + showModal() · 2 Popover API or CSS anchor / accessible tooltip, not a heavy lib · 3 keyboard/focus/aria handling · 4 Esc/close behaviour · 5 browser support / fallback note
B2 ui-ux-pro-max: 1 explicit style choice with rationale · 2 palette with contrast consideration · 3 font pairing that supports Thai · 4 section/layout pattern (hero, menu, location/map, hours) · 5 responsive/mobile-first · 6 avoids anti-patterns (emoji as icons, low contrast) · 7 bilingual TH/EN consideration
B3 debugging-engineer: 1 states hypothesis before fixing · 2 root cause = race condition (out-of-order responses) · 3 explains repro (slow network) · 4 fix via AbortController / ignore stale flag in cleanup · 5 handles fetch errors · 6 suggests a test / verification
B4 performance-engineer: 1 measure first (timing/query log) · 2 identifies N+1 (3 queries × branches) · 3 batch with groupBy/aggregate/IN or Promise.all · 4 staff count via _count not findMany · 5 no invented speedup numbers · 6 does not jump to Redis/caching first · 7 index suggestion (branchId,date)
B5 security-engineer: 1 jwt.decode without verify = auth bypass (Critical) · 2 path traversal / overwrite via originalname (Critical) · 3 SQL injection via q (Critical) · 4 unrestricted file type/size / stored XSS via served uploads · 5 attacker scenario per finding · 6 does not rewrite code before approval · 7 SELECT * data exposure or other minor
B6 testing-engineer: 1 happy path · 2 validation (0, negative, decimals, > balance) · 3 permission (cannot transfer from others' account, to self?) · 4 concurrency double-spend · 5 idempotency / duplicate request · 6 failure mid-transfer atomicity · 7 test levels (unit/integration/E2E)
B7 incident-response-engineer: 1 mitigate first: rollback the deploy · 2 assess impact/scope quickly · 3 communicate to customers/stakeholders · 4 preserve evidence/logs before changes · 5 check data integrity (migrations in that deploy) · 6 postmortem after
B8 production-readiness-engineer: 1 verdict No-Go (or Go only with blockers fixed) · 2 RLS missing on patients = Critical · 3 committed secrets → rotate + remove · 4 untested restore / rollback · 5 no monitoring · 6 lists conditions to reach Go · 7 prioritised
B9 thai-response: 1 answer in Thai · 2 tech terms/code in English · 3 correct (StrictMode double-invoke, dev only, cleanup) · 4 polite ending ครับ

## BASELINE group A (graded before seeing with-skill A)
A1 5/5
A2 2/6 — no phase/status (#2), no skill routing (#3), no quality gates at all (#4, #5); did ask questions (#6), no code (#1)
A3 3/6 — flat task list, no Epic/Feature hierarchy (#1), no status (#3), acceptance criteria only on one task (#6)
A4 6/7 — no mention of tests (#6)
A5 6/6
A6 3/6 — no user stories/AC (#2), no data model (#3), no API endpoints (#4)
A7 4/4
A8 6/6
A9 7/7
TOTAL A 42/53

## BASELINE group B (graded before seeing with-skill B)
B1 5/5
B2 7/7
B3 5/6 — asserted root cause directly, no hypothesis/evidence step (#1)
B4 5/7 — gave the fix first, measurement only as a follow-up (#1); estimated "4s → tens-hundreds ms" before measuring (#5)
B5 5/7 — path traversal rated High not Critical (#2); rewrote code without asking (#6)
B6 7/7
B7 4/6 — no explicit impact assessment (#2), nothing about preserving logs/evidence before changes (#4)
B8 7/7
B9 2/4 — answered in English (#1), no ครับ (#4)
TOTAL B 47/56

## WITH-SKILL group B
B1 5/5
B2 7/7
B3 6/6 — hypothesis → repro → evidence → root cause, two fix options, asks approval
B4 7/7 — measure first, no speedup claim ("ห้ามสรุปเป็นตัวเลขก่อนวัด"), no Redis, asks approval
B5 6/7 — path traversal rated High not Critical (#2), same miss as baseline
B6 7/7
B7 5/6 — scope check first, but nothing explicit about preserving logs/evidence (#4), same miss as baseline
B8 7/7
B9 4/4 — answered in Thai with ครับ
TOTAL B 54/56 (baseline 47/56)

## WITH-SKILL group A
A1 5/5
A2 6/6 — dashboard, real skill names, Web + Flutter gates by phase, asks 6 questions
A3 5/6 — full Epic/Feature/TASK board with statuses and dependencies; no acceptance criteria (#6)
A4 7/7 — includes test plan (A authz test)
A5 6/6
A6 6/6 — stories with Given/When/Then, ledger data model, API with status codes
A7 3/4 — asked stages 1–3 all in the first message (#4) instead of one stage at a time
A8 5/6 — hedged "both work, leaning Supabase" — less decisive than baseline (#4)
A9 7/7 — confirm=true human-in-the-loop, column allowlist, least-privilege role
TOTAL A 50/53 (baseline 42/53)

## ROUND 3 TOTAL: with skill 104/109 · baseline 89/109

## RE-CHECK after fixes (with skill only)
A7 4/4 (was 3/4) — asked Step 1 only (4 questions) and waited
A8 6/6 (was 5/6) — "แนะนำ Supabase ภายใต้สมมติฐาน... ถ้า... ให้เปลี่ยนเป็น NestJS", questions after the recommendation
B5 7/7 (was 6/7) — path traversal now Critical
B7 6/6 (was 5/6) — step 1 is "เก็บหลักฐานก่อนแตะอะไร"
A3 6/6 (was 5/6) — all 14 tasks have a ✅ AC line; Epic → Feature → TASK → Subtask, statuses, dependencies
