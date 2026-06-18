# PHASE_8_EXECUTION_RUNBOOK.md — Codex Runtime Plan

## Phase

Phase 8 — Direct Upload and File Intake

## Pre-Change Statement Required From Codex

Before editing, Codex must state:

1. Current roadmap phase.
2. Current roadmap task.
3. Acceptance criteria targeted.
4. Files expected to be created or modified.
5. Tests/checks planned after the change.

## Implementation Sequence

1. Inspect the v10 seed and current repo tree.
2. Reconcile any existing upload code with the v10 seed without blindly overwriting runtime fixes.
3. Validate `prisma/schema.prisma`.
4. Regenerate the Phase 8 migration from Prisma rather than trusting the scaffold blindly.
5. Apply migration to the target database.
6. Generate Prisma client.
7. Run seed twice and verify upload token/batch/event/image seed idempotency.
8. Wire upload token issue route to persist hashed token only.
9. Wire public upload intake route to look up token by hash and reject expired/used/revoked tokens.
10. Add storage adapter calls for local/mock storage; preserve originals under immutable keys.
11. For ZIP uploads, inspect entries before extraction and reject ZIP slip, executables, nested archives, and unsafe paths.
12. Create `UploadBatch`, `Image`, and `UploadEvent` rows in one transaction.
13. Update `Job.uploadStatus`, `Job.status`, and image count after accepted upload transaction.
14. Ensure admin/manual uploads require permission and audit logs.
15. Run tests/checks and update `ROADMAP_STATUS.md` with real results.

## Forbidden Work

- Do not expose provider/storage credentials to the frontend.
- Do not store public upload tokens.
- Do not let client-supplied org/client/job IDs override token scope.
- Do not overwrite original uploads.
- Do not extract ZIP entries before safety validation.
- Do not make final downloads visible after upload.
- Do not mark Phase 8 complete without upload security tests passing.

## Stop Condition

Stop after Phase 8 is runtime-verified or after a clean documented blocker. Do not continue to Phase 9 until `ROADMAP_STATUS.md` records real test outcomes.
