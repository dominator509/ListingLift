# WHOLE_REPO_CODEX_HANDOFF_V11.md

## Project

ListingLift — AI-powered product photo cleanup, marketplace image packs, ecommerce visual optimization, and multi-platform service sales engine.

## Seed Version

v11 — includes scaffolds through Phase 9: Job Creation and Admin Queue.

## What ChatGPT Project Mode Did

- Unzipped the previous v10 seed.
- Fully read the repo Markdown files and source documents.
- Advanced to Phase 9 because prior remaining work requires Codex runtime/database verification.
- Added job creation/admin queue code scaffolds, Prisma schema/migration draft, UI components, API route contracts, tests, and docs.
- Updated `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, phase docs, prompt, and manifest.

## What Codex Must Do

1. Stitch this v11 seed into the real repo without overwriting intentional user changes.
2. Install dependencies.
3. Validate and repair Prisma schema/migrations.
4. Generate Prisma client.
5. Apply migrations.
6. Run seed twice.
7. Wire Phase 9 dry-run routes to real Prisma transactions.
8. Enforce RBAC and tenant isolation server-side.
9. Run unit, integration, security, E2E, typecheck, lint, and build checks.
10. Update `ROADMAP_STATUS.md` with real command results.

## Phase 9 Files of Interest

- `src/domain/job-queue.ts`
- `src/schemas/job.ts`
- `src/server/services/job-creation-service.ts`
- `src/server/services/admin-job-queue-service.ts`
- `src/server/services/job-status-transition-service.ts`
- `src/server/services/job-deadline-service.ts`
- `src/server/services/job-admin-note-service.ts`
- `src/app/api/jobs/**/route.ts`
- `src/components/jobs/*`
- `src/app/admin/jobs/page.tsx`
- `src/app/admin/jobs/[jobId]/page.tsx`
- `prisma/migrations/0008_phase9_job_creation_admin_queue/migration.sql`
- `tests/unit/job-queue-service.test.ts`
- `tests/unit/job-creation-service.test.ts`
- `tests/security/job-status-transition-security.test.ts`
- `tests/integration/phase9-job-route-contract.test.ts`
- `tests/e2e/admin-job-queue.spec.ts`

## Critical Security Rules

- Never expose delivery before admin approval.
- Never trust client-submitted organization, client, package, price, upload, status, or source data.
- Audit manual job creation, status changes, manual overrides, admin notes, client-visible notes, deadline changes, and priority changes.
- Keep all job queries tenant-scoped.
- Enforce `manage:jobs` and `create:manual-orders` server-side.
- Do not store marketplace passwords or scrape private marketplace pages.
- Do not make marketplace compliance, sales, ranking, conversion, or approval guarantees.

## Known Limitations

This seed was not installed or executed as a running app. Codex owns runtime verification.
