# PHASE_14_EXECUTION_RUNBOOK.md

## Phase 14 — Quality Control and Flagged Outputs

### Before changing code

Codex must state:

1. Current phase: Phase 14.
2. Current task: wire and verify QC/flagged-output workflow.
3. Acceptance criteria being targeted.
4. Files expected to be created/modified.
5. Tests/checks to run.

### Implementation steps

1. Validate Prisma schema and regenerate migration SQL from the final schema.
2. Generate Prisma client.
3. Apply migrations to the target database.
4. Run seed twice and confirm idempotency.
5. Replace dry-run request-body output lists with tenant-scoped Prisma lookups.
6. Persist QC reviews, flags, and events in transactions.
7. Ensure unresolved blocking flags prevent final delivery approval and delivery link visibility.
8. Audit flag creation, review decisions, flag resolution, manual replacement requirements, bulk review, and delivery-block checks.
9. Verify admin QC pages render.
10. Verify client routes do not expose flagged, failed, rejected, pending, or admin-only outputs.

### Stop condition

Stop after Phase 14 is wired, tested, and `ROADMAP_STATUS.md` records real command output. Do not advance to Phase 15 until Phase 14 acceptance criteria pass or deviations are documented.
