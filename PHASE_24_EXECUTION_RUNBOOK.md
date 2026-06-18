# PHASE_24_EXECUTION_RUNBOOK.md

## Pre-change checkpoint Codex must state

1. Current roadmap phase: Phase 24 — Etsy Workflow.
2. Current task: Stitch and validate Etsy workflow seed.
3. Acceptance criteria targeted.
4. Files expected to be created or modified.
5. Tests/checks to run.

## Implementation order for Codex

1. Install dependencies and verify repo baseline.
2. Validate Prisma schema and regenerate the Phase 24 migration.
3. Apply migrations and run seed twice.
4. Wire `/api/etsy/manual-order` to tenant-scoped Prisma transactions.
5. Wire listing imports to safe CSV/API-scaffold persistence without scraping private pages.
6. Persist Etsy workflow events, mapping rows, listing import rows, external orders, jobs, upload tokens, revenue attribution, and audit logs transactionally.
7. Verify delivery templates only use approved delivery archives and safe marketplace copy.
8. Verify revision status blocks completion while open.
9. Run unit, security, integration, E2E, typecheck, lint, build, Prisma validate, and seed checks.
10. Update `ROADMAP_STATUS.md` with real command results.

## Stop condition

Stop after Phase 24 is stitched and verified or after a clean checkpoint documents unresolved failures.
