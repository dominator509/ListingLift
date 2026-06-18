# PHASE_38_EXECUTION_RUNBOOK.md

## Phase

Phase 38 — Full Testing and QA

## Purpose

Give Codex an operational sequence to turn v40's QA scaffolds into real verification evidence and a credible deployment-readiness report.

## Preflight

1. Confirm working package is `ListingLift_Repo_Seed_v40`.
2. Read:
   - `ROADMAP_STATUS.md`
   - `CODEX_GAPS.md`
   - `WHOLE_REPO_CODEX_HANDOFF_V40.md`
   - `PHASE_38_IMPLEMENTATION_NOTES.md`
   - `PHASE_38_VERIFICATION_MATRIX.md`
   - `docs/full-testing-qa.md`
   - `docs/full-testing-qa-phase38-gap-handoff.md`
3. Confirm real integrations remain disabled by default.
4. Confirm no real secrets are committed.
5. Confirm QA records cannot claim `PASS` without evidence.

## Required command sequence

```bash
npm install
npm run verify-env
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
npm run typecheck
npm run lint
npm run test:unit
npm run test:security
npm run test:integration
npm run test:adapter-contract
npm run test:e2e
npm run security-check
npm run build
npm run smoke
npm run qa:matrix
```

Optional once stable:

```bash
npm run test-all
```

If any command fails, stop, repair or document the blocker in `CODEX_GAPS.md`, and update `PHASE_38_VERIFICATION_MATRIX.md`.

## Implementation order

### 1. Install and baseline environment

- Run `npm install`.
- Confirm lockfile behavior and package manager expectations.
- Run `npm run verify-env`.
- Ensure fake placeholders are safe and real secrets stay in env/secret manager only.

### 2. Prisma and seed verification

- Validate the full Prisma schema.
- Regenerate or repair all migration SQL, including Phase 38.
- Generate Prisma client.
- Apply migrations against a real development database.
- Run seed twice and verify idempotency.

### 3. Static checks

- Run typecheck and lint.
- Repair import paths, server/client boundary issues, Next route contracts, Prisma generated types, and strict TypeScript issues.

### 4. Unit and security tests

- Run unit tests.
- Run security tests.
- Add missing regression tests for package mapping, preset validation, normalization, naming, manifest/ZIP safety, RBAC, tokens, safe-copy, upload rejection, webhook verification, and tenant isolation.

### 5. Integration and adapter-contract tests

- Run integration route contracts.
- Wire dry-run routes to Prisma-backed transactions or mark them blocked from production.
- Verify mock adapters are default and real integrations remain feature-flagged.

### 6. E2E/browser verification

- Run Playwright.
- Browser-render public, admin, client, agency, upload, delivery, QA, and security pages.
- Capture screenshots/traces for failures or critical smoke paths.

### 7. Build and smoke

- Run production build.
- Run smoke checks locally.
- Verify health endpoint and key dashboard shells.

### 8. Evidence ledger and docs

- Persist or document command outputs, screenshots, traces, logs, database records, and artifacts.
- Update `CODEX_GAPS.md`, `ROADMAP_STATUS.md`, and `PHASE_38_VERIFICATION_MATRIX.md` with actual results.
- Do not mark unresolved work as passed.

## Required browser smoke targets

- `/`
- `/pricing`
- `/packages`
- `/checkout/marketplace-listing-pack`
- `/upload/demo-token`
- `/admin`
- `/admin/jobs`
- `/admin/processing`
- `/admin/previews`
- `/admin/quality-control`
- `/admin/approvals`
- `/admin/revenue`
- `/admin/security`
- `/admin/qa`
- `/client`
- `/client/jobs`
- `/client/downloads`
- `/agency`
- `/agency/white-label-settings`
- `/admin/api-access`
- `/delivery/demo-token`

## Stop conditions

Stop and document blockers if:

- Any command fails.
- Prisma validation or migration application fails.
- Seed is not idempotent.
- TypeScript or lint errors remain.
- Any route bypasses server-side auth, RBAC, tenant isolation, billing/entitlement gates, token gates, approval gates, or security gates.
- Any unsafe upload or ZIP path is accepted.
- Any original upload can be overwritten.
- Any final delivery can be downloaded before approval.
- Any raw secret, token, signed URL, marketplace credential, private note, or provider key leaks to frontend/API/logs/tests.
- Any webhook creates paid/client-facing state without verified signature and idempotency.
- Any page fails browser rendering.
- Any generated copy guarantees marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.

## Required documentation updates after Codex work

- `CODEX_GAPS.md`
- `ROADMAP_STATUS.md`
- `PHASE_38_VERIFICATION_MATRIX.md`
- `TESTING.md`
- `SECURITY.md`
- `API.md`
- `ADMIN_GUIDE.md`
- `docs/full-testing-qa-phase38-gap-handoff.md`
