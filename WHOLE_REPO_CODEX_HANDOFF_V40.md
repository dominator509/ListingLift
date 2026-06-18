# WHOLE_REPO_CODEX_HANDOFF_V40.md

## Package

ListingLift Repo Seed v40

## Current phase

Phase 38 — Full Testing and QA

## Previous phase

Phase 37 — Security Hardening was seeded in v39. It remains runtime-unverified.

## Next planned phase

Phase 39 — Replit Production Deployment

## What ChatGPT Project Mode did in v40

- Unzipped and reviewed `ListingLift_Repo_Seed_v39.zip`.
- Reviewed every Markdown file in the v39 repo.
- Reviewed `ListingLift.md` and `ListingLift_BUILD_ROADMAP.md`.
- Confirmed roadmap/gap state from `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, `WHOLE_REPO_CODEX_HANDOFF_V39.md`, and `REPO_FILE_MANIFEST_V39.md`.
- Advanced to Phase 38 because Phase 37 had no remaining ChatGPT-codeable work beyond Codex/runtime/database/install/test/browser/security verification.
- Added Phase 38 full testing and QA scaffolds.
- Updated docs, gaps, roadmap, manifest, review index, runbook, verification matrix, and Codex prompt.

## Phase 38 files added

### Domain/schemas

- `src/domain/full-testing-qa.ts`
- `src/schemas/full-testing-qa.ts`

### Services

- `src/server/services/full-testing-qa-plan-service.ts`
- `src/server/services/full-testing-qa-risk-service.ts`
- `src/server/services/full-testing-qa-smoke-service.ts`
- `src/server/services/full-testing-qa-verification-ledger-service.ts`
- `src/server/services/full-testing-qa-dashboard-service.ts`

### Script

- `scripts/qa-matrix.ts`

### UI

- `src/components/full-testing-qa/full-testing-qa-shell.tsx`
- `src/components/full-testing-qa/qa-summary-cards.tsx`
- `src/components/full-testing-qa/qa-command-sequence-table.tsx`
- `src/components/full-testing-qa/qa-coverage-matrix.tsx`
- `src/components/full-testing-qa/qa-critical-journey-panel.tsx`
- `src/components/full-testing-qa/qa-smoke-target-panel.tsx`
- `src/components/full-testing-qa/qa-production-blocker-panel.tsx`
- `src/components/full-testing-qa/qa-no-fake-results-panel.tsx`
- `src/components/full-testing-qa/index.ts`

### Admin pages

- `src/app/admin/qa/page.tsx`
- `src/app/admin/qa/unit/page.tsx`
- `src/app/admin/qa/integration/page.tsx`
- `src/app/admin/qa/e2e/page.tsx`
- `src/app/admin/qa/security/page.tsx`
- `src/app/admin/qa/smoke/page.tsx`

### Admin API route contracts

- `src/app/api/admin/qa/dashboard/route.ts`
- `src/app/api/admin/qa/coverage/route.ts`
- `src/app/api/admin/qa/runbook/route.ts`
- `src/app/api/admin/qa/smoke-targets/route.ts`
- `src/app/api/admin/qa/verification-ledger/route.ts`

### Prisma

- `prisma/schema.prisma` updated with Phase 38 enums/models.
- `prisma/migrations/0037_phase38_full_testing_qa/migration.sql`

### Tests

- `tests/unit/full-testing-qa-domain.test.ts`
- `tests/unit/full-testing-qa-plan-service.test.ts`
- `tests/unit/full-testing-qa-risk-service.test.ts`
- `tests/security/full-testing-qa-no-fake-results.test.ts`
- `tests/integration/phase38-full-testing-qa-route-contract.test.ts`
- `tests/e2e/full-testing-qa.spec.ts`

### Docs/handoff

- `PHASE_38_IMPLEMENTATION_NOTES.md`
- `PHASE_38_EXECUTION_RUNBOOK.md`
- `PHASE_38_VERIFICATION_MATRIX.md`
- `docs/full-testing-qa.md`
- `docs/full-testing-qa-phase38-gap-handoff.md`
- `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V40.md`

## Files updated

- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `API.md`
- `ADMIN_GUIDE.md`
- `TESTING.md`
- `IMPLEMENTATION_SEQUENCE.md`
- `src/domain/permissions.ts`
- `src/config/navigation.ts`
- `.env.example`
- `package.json`
- `prisma/schema.prisma`
- `WHOLE_REPO_CODEX_HANDOFF.md`
- `REPO_FILE_MANIFEST.md`
- `CHATGPT_MARKDOWN_REVIEW_INDEX.md`
- `docs/source/ListingLift.md`
- `docs/source/ListingLift_BUILD_ROADMAP.md`

## Phase 38 architecture intent

Full Testing and QA must verify ListingLift as a product-image cleanup, marketplace image pack, ecommerce visual optimization, and multi-platform service sales engine. It must not reduce the project to a generic file uploader, static gallery, or generic test dashboard.

Phase 38 must cover:

- public sales/package pages,
- upload intake,
- job/admin queue,
- image processing pipeline,
- platform presets,
- QC and flagged outputs,
- approval and revisions,
- delivery ZIPs and expiring links,
- billing/credits/subscriptions,
- marketplace workflows,
- storage and automation integrations,
- reports/upsells,
- client/admin/agency dashboards,
- API access,
- security hardening.

## Codex must not trust these scaffolds as production-ready

The following are scaffold-only:

- Prisma schema additions and migration SQL.
- QA command plan and `test-all` script.
- QA matrix script.
- QA evidence ledger rules.
- QA admin route contracts.
- QA dashboard pages.
- Smoke target lists.
- Unit/security/integration/E2E test scaffolds.

## Required Codex sequence

1. Install dependencies.
2. Run env verification.
3. Validate Prisma schema.
4. Regenerate/repair migration SQL.
5. Generate Prisma client.
6. Apply migrations.
7. Run seed twice.
8. Run typecheck.
9. Run lint.
10. Run unit/security/integration/adapter-contract/E2E tests.
11. Run `npm run security-check`.
12. Run build and smoke checks.
13. Run `npm run qa:matrix`.
14. Browser-render all critical pages.
15. Wire real QA ledger persistence and sanitized evidence references.
16. Update gaps and verification matrix with actual results.

## Commands ChatGPT did not run

```bash
npm install
npm run verify-env
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run typecheck
npm run lint
npm run test
npm run test:unit
npm run test:security
npm run test:integration
npm run test:adapter-contract
npm run test:e2e
npm run security-check
npm run build
npm run smoke
npm run qa:matrix
npm run test-all
```

## Critical no-fake-results requirement

Codex must not mark any QA row `PASS` unless actual evidence exists. Evidence references must be redacted and must never include raw secrets, tokens, signed URLs, private notes, raw webhook payloads, raw files, marketplace credentials, provider keys, or unapproved delivery links.
