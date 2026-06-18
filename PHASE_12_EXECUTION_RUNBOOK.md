# PHASE_12_EXECUTION_RUNBOOK.md

## Objective

Wire deterministic delivery package generation for processed files: names, folders, manifest CSV, ReadMe, ZIP draft, and delivery archive records.

## Codex Execution Order

1. Inspect the target repo and preserve existing work.
2. Stitch v14 files carefully.
3. Validate TypeScript imports and path aliases.
4. Validate Prisma schema.
5. Regenerate migration SQL for Phase 12 instead of trusting scaffold blindly.
6. Generate Prisma client.
7. Apply migrations.
8. Run seed twice and confirm idempotency.
9. Connect archive-plan routes to tenant-scoped Prisma queries for Job, ProcessedFile, Image, Client, and PlatformPreset.
10. Connect ZIP draft route to storage read/write while preserving originals.
11. Persist DeliveryArchive and DeliveryArchiveFile records transactionally.
12. Add audit logs for archive plan generation, ZIP generation, manifest generation, ReadMe generation, and failed archive attempts.
13. Keep archive status pre-delivery until approval/review phases authorize downloads.
14. Run Phase 12 tests and full verification commands.
15. Update ROADMAP_STATUS.md with real results.

## Required Commands

- npm install
- npm run db:validate
- npm run db:generate
- npm run db:migrate
- npm run db:seed
- npm run typecheck
- npm run lint
- npm run test -- tests/unit/naming-service.test.ts tests/unit/manifest-service.test.ts tests/unit/delivery-packaging-service.test.ts
- npm run test:security -- tests/security/delivery-zip-path-safety.test.ts
- npm run test:integration -- tests/integration/phase12-delivery-archive-route-contract.test.ts
- npm run test:e2e -- tests/e2e/admin-delivery-archive.spec.ts
- npm run build

## Stop Conditions

Do not advance if:

- ZIP path safety tests fail.
- CSV formula neutralization fails.
- Delivery archive generation can read or overwrite original upload storage keys.
- Client-facing delivery can access ZIP files before approval.
- Prisma schema or migrations fail.
