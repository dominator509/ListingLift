# Phase 29 Execution Runbook — Automation Webhooks

## Before implementation

Codex must state:

1. Current phase: Phase 29 — Automation Webhooks.
2. Current task.
3. Acceptance criteria targeted.
4. Files expected to change.
5. Tests/checks to run.

## Implementation order

1. Install dependencies and verify current repo baseline.
2. Reconcile v31 seed files with the actual repository.
3. Validate Prisma schema.
4. Regenerate migration SQL.
5. Apply migration to test database.
6. Generate Prisma client.
7. Wire route contracts to Prisma services.
8. Add encrypted secret reference logic.
9. Add rate limits and audit logs.
10. Add real dispatch implementation only if explicitly feature-flagged.
11. Run unit/security/integration/E2E checks.
12. Update `ROADMAP_STATUS.md` with real results.

## Stop condition

Stop at a clean checkpoint if any auth, RBAC, tenant isolation, webhook signing, secret leakage, rate limit, or dispatch safety check fails.
