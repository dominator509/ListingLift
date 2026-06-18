# IMPLEMENTATION_SEQUENCE.md

## Current implementation sequence

1. Phase 0 — Repository Initialization
2. Phase 1 — Branding, Routing, Landing Page
3. Phase 2 — Package and Pricing Foundation
4. Phase 3 — Auth and Organizations
5. Phase 4 — RBAC and Client Scoping
6. Phase 5 — Package Selection and Checkout Prep
7. Phase 6 — Sales Channel Normalization
8. Phase 7 — Platform Presets
9. Phase 8 — Direct Upload and File Intake
10. Phase 9 — Job Creation and Admin Queue
11. Phase 10 — Image Processing Provider Layer
12. Phase 11 — Core Image Processing Pipeline
13. Phase 12 — Naming, Folders, Manifest, ZIP
14. Phase 13 — Preview Gallery and Before/After
15. Phase 14 — Quality Control and Flagged Outputs
16. Phase 15 — Manual Approval and Revision Workflow
17. Phase 16 — Delivery and Email Notifications
18. Phase 17 — Stripe Checkout and Billing
19. Phase 18 — Gumroad Checkout/Webhook Intake
20. Phase 19 — Credits, Subscriptions, Manual Invoices
21. Phase 20 — Fiverr Workflow
22. Phase 21 — Upwork Workflow
23. Phase 22 — Taskrabbit Workflow
24. Phase 23 — Other Sales Channels
25. Phase 24 — Etsy Workflow
26. Phase 25 — Shopify Workflow
27. Phase 26 — Social Commerce Workflows
28. Phase 27 — Amazon, eBay, WooCommerce Workflows
29. Phase 28 — File Storage Integrations
30. Phase 29 — Automation Webhooks
31. Phase 30 — Notifications and Task/Data Exports
32. Phase 31 — Advanced Image Processing
33. Phase 32 — Reports and Upsell Engine
34. Phase 33 — Client Dashboard
35. Phase 34 — Admin Dashboard and Revenue Analytics
36. Phase 35 — Agency White-Label Mode
37. Phase 36 — API Access and Advanced Integrations Scaffold
38. Phase 37 — Security Hardening
39. Phase 38 — Full Testing and QA
40. Phase 39 — Replit Production Deployment
41. Phase 40 — Post-Launch Backlog

## Current repo seed

`ListingLift_Repo_Seed_v39.zip`

## Current phase

Phase 37 — Security Hardening

## Next planned phase

Phase 38 — Full Testing and QA

## Execution note

Phases through 37 are repo-seed scaffolds unless and until Codex installs dependencies, validates Prisma, repairs/generates migrations, applies migrations, seeds idempotently, typechecks, lints, tests, builds, smoke-checks, verifies browser rendering, and completes runtime security verification.

---

## Phase 38 — Full Testing and QA implementation sequence

1. Use the QA scaffolds in `src/domain/full-testing-qa.ts` and `src/server/services/full-testing-qa-*` as the source for the command plan and coverage matrix.
2. Run the Codex command sequence from `PHASE_38_EXECUTION_RUNBOOK.md`.
3. Repair Prisma, TypeScript, lint, unit, security, integration, adapter, E2E, build, smoke, and browser issues.
4. Wire QA ledger persistence to Prisma.
5. Store only redacted evidence references.
6. Reject `PASS` without evidence.
7. Update `CODEX_GAPS.md`, `ROADMAP_STATUS.md`, and `PHASE_38_VERIFICATION_MATRIX.md` with actual results.
8. Do not advance to deployment readiness until all blocker/critical QA gaps are resolved or explicitly documented.
