# PHASE_33_EXECUTION_RUNBOOK.md

## Phase 33 — Client Dashboard

### Before Implementation

Codex must state:

1. Current phase: Phase 33 — Client Dashboard.
2. Current task.
3. Acceptance criteria targeted.
4. Files expected to change.
5. Tests/checks that will be run.

### Required Implementation Steps

1. Validate the Prisma schema and repair the Phase 33 migration.
2. Generate Prisma client.
3. Apply migrations.
4. Wire `/api/client-dashboard/*` routes to real auth/session, RBAC, tenant isolation, and Prisma queries.
5. Replace demo dashboard data with server-side client-scoped queries.
6. Enforce client preview visibility rules.
7. Enforce delivery-download gates.
8. Persist revision requests and dashboard events transactionally.
9. Add audit logs for upload, download, revision, billing, upgrade, and help-request actions.
10. Verify client pages in browser.
11. Update `ROADMAP_STATUS.md` with real command results.

### Stop Conditions

Do not mark Phase 33 complete if client isolation, delivery-token security, preview visibility, or revision scope tests fail.
