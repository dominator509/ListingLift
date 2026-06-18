# PHASE_32_EXECUTION_RUNBOOK.md

## Before coding in Codex

State:

1. Current phase: Phase 32 — Reports and Upsell Engine.
2. Current task.
3. Acceptance criteria.
4. Files expected to change.
5. Tests/checks to run.

## Implementation order

1. Validate and repair Prisma schema.
2. Generate/apply migration.
3. Wire report metrics to real tenant-scoped queries.
4. Persist report drafts and metric snapshots.
5. Add approval/export/delivery audit logging.
6. Wire upsell opportunity detection to completed deliveries and client state.
7. Persist upsell templates/offers/events.
8. Enforce RBAC and client visibility.
9. Run tests and update ROADMAP_STATUS.md.

## Stop conditions

Stop if report visibility leaks private data, if upsell copy contains guarantee language, or if Prisma validation fails.
