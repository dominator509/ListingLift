# Phase 28 Execution Runbook

## Before Coding in Codex

1. State current phase: Phase 28 — File Storage Integrations.
2. State task: stitch and verify storage adapter scaffold.
3. List files expected to change.
4. List checks to run.

## Required Codex Steps

1. Stitch v30 into the repo.
2. Install dependencies if needed.
3. Validate Prisma schema.
4. Regenerate migration SQL.
5. Generate Prisma client.
6. Wire Prisma-backed storage connection routes.
7. Implement local/mock storage behavior.
8. Keep Google Drive/Dropbox calls disabled unless flags and encrypted secrets exist.
9. Add audit logs.
10. Run tests and fix failures.

## Acceptance Gate

Phase 28 is not complete until typecheck, lint, unit, security, integration, E2E smoke, build, Prisma validate, migration, and seed checks are run successfully by Codex.
