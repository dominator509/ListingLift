# Phase 27 Execution Runbook — Codex

Before implementation, report:

1. Current phase: Phase 27 — Amazon, eBay, WooCommerce Workflows.
2. Current task.
3. Acceptance criteria targeted.
4. Files expected to change.
5. Checks to run.

## Implementation Steps

1. Stitch v29 seed into the repository.
2. Validate and repair TypeScript imports/types.
3. Validate Prisma schema.
4. Regenerate Phase 27 migration from Prisma.
5. Apply migrations and run seed twice.
6. Connect route contracts to tenant-scoped Prisma transactions.
7. Add audit logs for every create/update/export/delivery/revision/safety action.
8. Verify duplicate prevention by organization + channel + external reference/store/SKU.
9. Verify export plans use only approved processed files and delivery archives.
10. Verify no marketplace guarantee language exists.
11. Run unit, security, integration, E2E, typecheck, lint, build, Prisma validate, and seed checks.
12. Update `ROADMAP_STATUS.md` with real results.
