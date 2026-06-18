# Phase 22 Execution Runbook — Taskrabbit Workflow

## Before implementation

Codex must state:

1. Current phase: Phase 22 — Taskrabbit Workflow.
2. Current task: Wire Taskrabbit manual/local-service workflow into the real repository.
3. Acceptance criteria targeted.
4. Files expected to change.
5. Tests/checks to run after changes.

## Required implementation sequence

1. Inspect v24 seed files and reconcile with existing repo state.
2. Validate Taskrabbit domain/schemas/services compile.
3. Repair Prisma schema and regenerate migration SQL.
4. Apply migration in a safe dev/test database.
5. Seed Taskrabbit service mappings with fake/demo data only.
6. Wire manual-task route to transactional Prisma persistence.
7. Enforce RBAC and tenant isolation server-side.
8. Add audit logs for manual task intake, mapping changes, delivery copy generation, conversion updates, safety checks, and manual delivery completion.
9. Verify no prohibited Taskrabbit automation exists.
10. Run required checks and update ROADMAP_STATUS.md with real results.

## Stop condition

Do not mark Phase 22 complete unless Taskrabbit manual task intake, dedupe, conversion tracking, and safety checks pass runtime tests.
