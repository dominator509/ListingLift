# PHASE_10_EXECUTION_RUNBOOK.md — Image Processing Provider Layer

## Current Phase

Phase 10 — Image Processing Provider Layer.

## Before Coding in Codex

Codex must state:

1. Current roadmap phase.
2. Current task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks to run after changes.

## Implementation Steps for Codex

1. Inspect all Phase 10 files added in v12.
2. Run dependency install if needed.
3. Validate TypeScript imports and path aliases.
4. Validate Prisma schema.
5. Regenerate Phase 10 migration SQL with Prisma.
6. Apply migrations in a dev database.
7. Generate Prisma client.
8. Run seed twice to prove idempotence.
9. Wire image-provider config routes to Prisma transactions.
10. Ensure provider setup writes `ImageProviderConfiguration` only with redacted config and encrypted secret references.
11. Ensure `EncryptedSecret` values are encrypted and never returned to the frontend.
12. Run provider registry and secret safety tests.
13. Run health endpoints and verify mock provider baseline readiness.
14. Verify `/admin/integrations/image-providers` renders.
15. Update `ROADMAP_STATUS.md` with actual command results.

## Stop Conditions

Codex must stop and fix before advancing if:

- Mock provider does not work.
- Real providers require paid keys for tests.
- Provider secrets appear in logs, UI responses, snapshots, or seed data.
- Real provider calls can run while `REAL_IMAGE_PROVIDER_CALLS_ENABLED=false`.
- Provider errors do not normalize to manual fallback.
