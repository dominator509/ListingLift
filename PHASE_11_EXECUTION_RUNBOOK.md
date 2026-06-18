# PHASE_11_EXECUTION_RUNBOOK.md — Core Image Processing Pipeline

## Pre-Change Statement Codex Must Make

Before making implementation changes, Codex must state:

1. Current roadmap phase: Phase 11 — Core Image Processing Pipeline.
2. Current task: wire the seeded pipeline to real persistence/storage/runtime where possible.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks to run after the change.

## Implementation Order

1. Inspect the repo and compare with this v13 seed.
2. Install dependencies if not already installed.
3. Validate the Prisma schema.
4. Regenerate the Phase 11 migration using Prisma in the real environment.
5. Generate Prisma client.
6. Wire persistence for processing runs, steps, errors, and processed files.
7. Wire queue/start/retry routes to real job/image lookup with tenant scoping.
8. Implement storage read/write using the repo-supported storage adapter.
9. Implement Sharp/local transforms for resize/compression/format conversion where supported.
10. Keep background removal behind the provider adapter registry.
11. Persist errors per image and keep successful outputs review-ready.
12. Update job/image statuses only inside transactions.
13. Add/repair tests.
14. Run full checks.
15. Update `ROADMAP_STATUS.md` with real results.

## Required Checks

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- image-processing
npm run test:integration -- phase11
npm run test:security -- image-processing
npm run test:e2e -- admin-processing
npm run typecheck
npm run lint
npm run build
```

## Stop Conditions

Stop and document blockers if:

- Upload or processing can overwrite original files.
- Provider secrets appear in logs/responses/frontend state.
- Processing can bypass tenant isolation.
- Failed provider calls do not create per-image error records.
- Final delivery becomes visible before admin approval.
- Tests fail and cannot be repaired within the current implementation block.
