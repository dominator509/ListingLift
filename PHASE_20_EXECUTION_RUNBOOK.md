# PHASE_20_EXECUTION_RUNBOOK.md — Fiverr Workflow

## Pre-Change Report Required from Codex

Codex must state:

1. Current phase: Phase 20 — Fiverr Workflow.
2. Current task.
3. Acceptance criteria targeted.
4. Files expected to change.
5. Tests/checks to run.

## Implementation Steps

1. Install dependencies and restore lockfile.
2. Validate Prisma schema.
3. Regenerate Phase 20 migration from schema.
4. Apply migrations in dev/test database.
5. Generate Prisma client.
6. Connect Fiverr routes to Prisma transactions.
7. Enforce RBAC and tenant isolation.
8. Persist gig mappings, workflow events, external orders, jobs, upload-token plans, delivery template events, revision events, and audit logs.
9. Verify manual workflow UI in browser.
10. Run tests and fix failures.
11. Update ROADMAP_STATUS.md.

## Stop Conditions

Stop and document blockers if:

- Prisma validation fails.
- RBAC or tenant isolation cannot be enforced.
- Duplicate Fiverr order prevention fails.
- Delivery exposes files before approval.
- Any code scrapes Fiverr or stores Fiverr passwords.
