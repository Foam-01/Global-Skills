# Round 4 rubric (written before results). 1 point each.

C1 payment-engineer
1. Client-supplied amount → must compute from DB (Critical)
2. /payment/return marks paid from a redirect, unauthenticated, anyone can call with any orderId (Critical)
3. Webhook has no signature/authenticity check (Critical) — or re-fetch the charge from the API
4. Webhook not idempotent / duplicate receipt emails / no status precondition
5. Float baht → satang conversion bug (149.5*100 / rounding) → integer satang
6. Does not check the charge status/amount matches the order before marking paid
7. Idempotency / double-click on checkout creates multiple charges
8. Mentions QR expiry / pending timeout / reconciliation
9. Report-only / asks approval before changing code

C2 pdpa-privacy-engineer
1. Pre-ticked, bundled consent (terms + privacy + marketing + partners) is invalid → separate, unticked, withdrawable
2. Health data (diseases, meds, allergies, blood type) + religion = sensitive data → explicit consent + stricter controls
3. Data minimisation: questions need for national ID, income, religion, LINE ID
4. Staff role can read every row → least privilege / RLS / access audit log
5. Logging full request bodies (personal + health data) to a US log service → stop / redact; cross-border
6. Sending full patient records to a US AI API → cross-border transfer + minimise / de-identify
7. No account deletion / "keep everything" → data subject rights + retention policy (+ app-store account deletion requirement)
8. Supabase Singapore region = cross-border transfer to consider
9. Does not claim "legal / compliant"; flags what a lawyer must confirm
10. Mentions breach notification readiness (72h) or ROPA/data inventory

## BASELINE (graded before seeing with-skill)
C1 8/9 — found all 4 blockers + idempotency, chargeId, expiry, reconciliation; but gave rewritten code without asking approval (#9)
C2 10/10 — very thorough (consent, minimisation, RLS + audit, logs/AI cross-border, DPA, retention, RoPA/DPIA, 72h, "not a lawyer")
TOTAL 18/19

## WITH-SKILL
C1 8/9 — all blockers + state machine, webhook_events table, failed/expired on charge.complete, 12 test cases; but also no explicit "wait for approval" (#9) → fixed: added rule 6 "report first, wait for approval" to payment-engineer
C2 10/10 — ROPA table, per-item ✅/❌/⚠️ with evidence, ranked risks, explicit "lawyer must confirm" list, explicitly "not legal advice / not certifying compliance"
TOTAL 18/19 (baseline 18/19) — tie on score; with-skill output is more structured and auditable
