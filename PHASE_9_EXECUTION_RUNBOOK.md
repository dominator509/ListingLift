# PHASE_9_EXECUTION_RUNBOOK.md — Job Creation and Admin Queue

## Pre-change Codex Checklist

Before editing in the real repo, state:

1. Current roadmap phase: Phase 9 — Job Creation and Admin Queue.
2. Current task: Wire seeded job creation and admin queue contracts to the installed app.
3. Acceptance criteria being targeted.
4. Files expected to change.
5. Tests/checks that will be run.

## Implementation Steps

1. Validate previous phase gaps and make sure Phase 0–8 runtime blockers are documented.
2. Apply v11 seed changes carefully, preserving existing repo-specific edits.
3. Validate Prisma schema.
4. Regenerate migration SQL for Phase 9.
5. Generate Prisma client.
6. Wire job queue routes to tenant-scoped Prisma queries.
7. Wire manual job creation to a transaction that creates/matches Client, ExternalOrder when applicable, Job, JobStatusEvent, AuditLog, and optional UploadToken trigger.
8. Wire status transition route to enforce lifecycle rules, approval guard, RBAC, and audit log creation.
9. Wire notes/deadline routes to persist changes and audit them.
10. Verify admin queue and detail pages render in browser.
11. Run required tests and fix failures before marking Phase 9 complete.

## Stop Condition

Stop after Phase 9 verification. Do not start Phase 10 provider work until Phase 9 acceptance criteria pass or blockers are fully documented.
