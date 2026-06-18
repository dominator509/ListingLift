# Phase 31 Execution Runbook — Advanced Image Processing

## Before coding

Codex must state:

1. Current roadmap phase: Phase 31 — Advanced Image Processing.
2. Current task.
3. Acceptance criteria.
4. Files expected to change.
5. Tests/checks to run.

## Implementation steps

1. Validate Prisma schema.
2. Regenerate migration for advanced image processing records.
3. Generate Prisma client.
4. Wire advanced image route contracts to authenticated server-side handlers.
5. Enforce tenant isolation and RBAC.
6. Implement storage reads for source/processed files.
7. Implement advanced output creation using mock/local pipeline first.
8. Persist all advanced outputs as new objects and records.
9. Persist quality reports and sequence recommendations.
10. Add audit logs for sensitive actions.
11. Keep all outputs hidden until review and approval gates pass.
12. Run tests/checks.
13. Update `ROADMAP_STATUS.md`.

## Stop conditions

Stop and fix before continuing if:

- originals can be overwritten
- unapproved outputs can be downloaded
- real provider calls are required for baseline operation
- marketplace/sales guarantees appear
- auth/RBAC/tenant isolation tests fail
