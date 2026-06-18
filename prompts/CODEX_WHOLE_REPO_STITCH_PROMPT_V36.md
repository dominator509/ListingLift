# CODEX_WHOLE_REPO_STITCH_PROMPT_V36.md

You are Codex implementing ListingLift.

Use `ListingLift_Repo_Seed_v36.zip` as the latest seed package. Stitch it into the repository carefully without deleting valid existing work.

## Current Phase

Phase 34 — Admin Dashboard and Revenue Analytics

## Required Source of Truth

- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `PHASE_34_EXECUTION_RUNBOOK.md`
- `PHASE_34_VERIFICATION_MATRIX.md`
- `docs/admin-dashboard-revenue-phase34-gap-handoff.md`

## Mandatory Work

1. Inspect the repo and package manager.
2. Apply v36 files carefully without deleting prior phase artifacts.
3. Validate imports and route paths.
4. Repair Prisma schema and regenerate migration SQL.
5. Generate Prisma client.
6. Wire `/api/admin/dashboard/*` APIs to real session, RBAC, tenant isolation, and Prisma.
7. Replace dry-run analytics with verified job, source, payment, invoice, refund, credit, subscription, QC, report, upsell, and delivery data.
8. Persist revenue snapshots, conversion signals, retainer alerts, and admin events transactionally.
9. Add rate limits and audit logs for sensitive analytics routes/actions.
10. Verify admin dashboard pages render in browser.
11. Run required checks.
12. Update `ROADMAP_STATUS.md` with real command output.

## Stop Conditions

Stop and report if auth, RBAC, tenant isolation, client-role blocking, revenue derivation, analytics privacy, conversion manual-review gates, retainer manual-review gates, audit logging, migration, typecheck, lint, build, tests, or browser rendering fail.

## Do Not Do

- Do not expose provider keys or secrets to frontend.
- Do not log secrets or tokens.
- Do not store marketplace passwords.
- Do not expose final downloads before approval.
- Do not automate marketplace messages, comments, DMs, proposals, scraping, or circumvention.
- Do not guarantee marketplace approval, ranking, sales, conversion, or ad performance.
- Do not mark Phase 34 complete until real runtime checks pass.
