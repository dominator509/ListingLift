# WHOLE_REPO_CODEX_HANDOFF_V10.md

## Current Package

ListingLift Repo Seed v10

## Current Seed Phase

Phase 8 — Direct Upload and File Intake

## What ChatGPT Did

- Unzipped the v9 repository seed.
- Fully reviewed all Markdown context in the seed plus `ListingLift.md` and `ListingLift_BUILD_ROADMAP.md`.
- Advanced into Phase 8 because Phase 7 remaining work requires Codex runtime/database verification.
- Added upload/file-intake domain constants, schemas, services, route contracts, UI shells, Prisma schema additions, migration scaffold, seed data, and tests.
- Updated gaps, roadmap status, review index, runbook, verification matrix, and manifest.

## What Codex Must Do First

1. Unzip this package into the actual repo.
2. Inspect existing files and reconcile carefully.
3. Install dependencies.
4. Validate TypeScript and Prisma.
5. Regenerate/apply migrations.
6. Connect dry-run upload route contracts to real Prisma/storage transactions.
7. Run Phase 8 tests and fix failures.
8. Update `ROADMAP_STATUS.md` with actual command results.

## Most Important Phase 8 Files

- `src/domain/upload-intake.ts`
- `src/schemas/upload.ts`
- `src/server/services/upload-token-service.ts`
- `src/server/services/upload-validation-service.ts`
- `src/server/services/zip-safety-service.ts`
- `src/server/services/upload-storage-key-service.ts`
- `src/server/services/file-metadata-service.ts`
- `src/server/services/upload-history-service.ts`
- `src/server/services/upload-intake-service.ts`
- `src/app/api/uploads/*`
- `src/app/api/admin/uploads/manual/route.ts`
- `src/components/uploads/*`
- `src/app/upload/[token]/page.tsx`
- `src/app/admin/uploads/page.tsx`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/migrations/0007_phase8_direct_upload_file_intake/migration.sql`
- `tests/unit/upload-validation-service.test.ts`
- `tests/unit/upload-token-service.test.ts`
- `tests/unit/upload-intake-service.test.ts`
- `tests/security/zip-safety-service.test.ts`
- `tests/security/upload-file-rejection.test.ts`
- `tests/integration/phase8-upload-route-contract.test.ts`
- `tests/e2e/upload-flow.spec.ts`

## Critical Security Requirements

- Never store plaintext upload tokens.
- Never trust client-submitted organization, client, or job IDs for public uploads.
- Validate token hash, expiration, revocation, and use state server-side.
- Validate files before storage.
- Inspect ZIP entries before extraction.
- Reject executables, scripts, HTML/SVG, and traversal paths.
- Preserve originals and never overwrite them.
- Keep delivery gated behind admin approval.
- Audit admin/manual upload fallback actions.

## Known Limitations

This package is a code seed. ChatGPT did not run npm install, Prisma validation, migrations, seed, typecheck, lint, build, or browser tests. Codex must perform and record those checks.
