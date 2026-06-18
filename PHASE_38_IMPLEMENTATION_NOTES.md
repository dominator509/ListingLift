# PHASE_38_IMPLEMENTATION_NOTES.md

## Phase

Phase 38 — Full Testing and QA

## Package

ListingLift Repo Seed v40

## Objective

Add repo-seed scaffolding for a full QA command center without claiming runtime verification. This phase converts the roadmap's testing requirements into test plan contracts, QA services, admin UI shells, API route contracts, Prisma/migration scaffolds, package scripts, tests, and Codex handoff instructions.

## Review performed for this phase

- Unzipped `ListingLift_Repo_Seed_v39.zip`.
- Reviewed and indexed all Markdown files in the unzipped v39 repo.
- Reviewed `ListingLift.md`.
- Reviewed `ListingLift_BUILD_ROADMAP.md`.
- Confirmed v39 roadmap state from `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, `WHOLE_REPO_CODEX_HANDOFF_V39.md`, and `REPO_FILE_MANIFEST_V39.md`.
- Confirmed next planned phase was Phase 38 — Full Testing and QA.
- Confirmed Phase 37 had no remaining ChatGPT-codeable work beyond Codex/runtime/database/install/test/browser/security verification.

## Architecture intent

Phase 38 is not a generic testing checklist. It is a ListingLift fulfillment-engine QA layer covering:

- Public sales and package selection.
- Checkout and webhook intake.
- Upload tokens and direct intake.
- Job/admin queue.
- Image processing provider contracts.
- Platform presets and output folders.
- Naming, manifest generation, and ZIP delivery.
- QC, flagged outputs, manual approval, and revisions.
- Client dashboard and delivery downloads.
- Billing, credits, subscriptions, and manual invoices.
- Sales-channel workflows and revenue attribution.
- Storage, automation, and task/notification integrations.
- Advanced processing, reports, upsells, retainer alerts, admin dashboard, agency white-label mode, API access, and security hardening.

## Code added

### Domain and schemas

- `src/domain/full-testing-qa.ts`
- `src/schemas/full-testing-qa.ts`

### Services

- `src/server/services/full-testing-qa-plan-service.ts`
- `src/server/services/full-testing-qa-risk-service.ts`
- `src/server/services/full-testing-qa-smoke-service.ts`
- `src/server/services/full-testing-qa-verification-ledger-service.ts`
- `src/server/services/full-testing-qa-dashboard-service.ts`

### Scripts

- `scripts/qa-matrix.ts`

### UI shells

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

### Config and permissions

- `package.json` adds `test-all`, `qa:matrix`, and `qa:codex-required` scripts.
- `src/domain/permissions.ts` adds `manage:qa`.
- `src/config/navigation.ts` adds QA admin navigation.
- `.env.example` adds QA evidence/storage/browser-smoke placeholders.

### Prisma

- `prisma/schema.prisma` adds Phase 38 QA enums and models.
- `prisma/migrations/0037_phase38_full_testing_qa/migration.sql` is scaffold-only.

## Tests added

- `tests/unit/full-testing-qa-domain.test.ts`
- `tests/unit/full-testing-qa-plan-service.test.ts`
- `tests/unit/full-testing-qa-risk-service.test.ts`
- `tests/security/full-testing-qa-no-fake-results.test.ts`
- `tests/integration/phase38-full-testing-qa-route-contract.test.ts`
- `tests/e2e/full-testing-qa.spec.ts`

## Key design decisions

- QA routes use `manage:qa`; Codex must enforce this server-side with real session/RBAC/tenant isolation.
- QA status defaults to `CODEX_REQUIRED`; this phase does not claim any runtime checks passed.
- `PASS` evidence is intentionally modeled as requiring evidence references.
- `test-all` is added as a Codex command sequence, but it was not run in ChatGPT Project Mode.
- The QA dashboard warns that it is a command center, not proof of production readiness.
- Smoke targets include public, admin, sales channel, integration, client, agency, upload, delivery, security, and QA pages.

## Non-production statements

ChatGPT Project Mode did not install dependencies, validate Prisma, generate Prisma client, apply migrations, run seed, typecheck, lint, build, run Vitest, run Playwright, render pages in a browser, make real provider calls, test storage, verify real webhooks, run `npm run security-check`, run `npm run test-all`, or deploy anything.
