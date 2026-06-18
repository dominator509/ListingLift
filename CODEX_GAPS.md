# CODEX_GAPS.md

## Current package

ListingLift Repo Seed v40

## Current phase

Phase 38 — Full Testing and QA

## Global unresolved Codex/runtime gaps

This repo seed has not been installed or runtime-verified. Codex must still:

- Install dependencies.
- Validate environment.
- Validate Prisma schema.
- Regenerate or repair all migration SQL, including Phase 38 migration SQL.
- Generate Prisma client.
- Apply migrations.
- Run seed twice and verify idempotency.
- Run typecheck, lint, unit tests, security tests, integration tests, adapter-contract tests, E2E tests, build, smoke checks, QA matrix, and browser rendering checks.
- Wire dry-run route contracts to real Prisma transactions.
- Enforce RBAC and tenant isolation server-side across admin, client, agency, API, upload, delivery, webhook, billing, marketplace, storage, processing, reporting, upsell, QA, and integration routes.
- Verify all UI pages render in the browser.
- Verify all security tests and add missing regression coverage.
- Replace mock/dry-run provider logic with real integrations only behind explicit feature flags.
- Keep real integrations disabled by default.
- Keep secrets encrypted or in env/secret-manager only.
- Preserve manual fallback.
- Preserve admin approval before final delivery.
- Never expose final downloads before approval.
- Never overwrite original uploads.
- Never guarantee marketplace approval, ranking, sales, conversion, ad performance, listing approval, product approval, or platform acceptance.

## Project-wide guardrails Codex must preserve

- Never hardcode secrets.
- Never log secrets.
- Never expose provider keys to the frontend.
- Never store marketplace passwords.
- Store tokens/keys only as encrypted secret references, env values, or hashes where appropriate.
- Preserve original uploads and never overwrite originals.
- Use server-side auth, RBAC, and tenant isolation.
- Validate inputs with Zod/shared schemas.
- Reject unsafe uploads.
- Prevent ZIP slip.
- Reject nested archives unless a future reviewed feature explicitly supports them safely.
- Neutralize CSV formula injection.
- Escape/sanitize rendered client-facing output.
- Use expiring upload and delivery tokens.
- Store only hashed token values, including API tokens, upload tokens, delivery tokens, invite tokens, portal tokens, CSRF tokens if persisted, and webhook signing secrets where applicable.
- Verify webhook signatures where applicable before paid/client-facing state changes.
- Rate-limit sensitive routes.
- Audit paid, client-facing, manual override, admin analytics, agency white-label, API token, webhook, shared upload portal, security setting, secret reference, permission, delivery, upload rejection, QA result, and QA evidence actions.
- Keep API and advanced integrations disabled by default until verified plan gates, encrypted secret references, rate limits, signature checks, and audited token checks are wired.
- Never mark QA checks as passed without actual evidence.

## Current known unresolved package state

- Phase 38 code is scaffolded but not installed, compiled, typechecked, linted, migrated, seeded, tested, browser-rendered, or security-verified.
- Prisma schema additions and migration SQL are scaffold-only.
- Admin QA pages are UI shells only.
- Admin QA API routes return dry-run contract payloads.
- QA services are deterministic scaffolds and not connected to real persistence, test runners, CI, artifact storage, browser traces, screenshots, or command output capture.
- `test-all`, `qa:matrix`, and `qa:codex-required` scripts were added but not run.
- No npm, Prisma, Playwright, Vitest, browser, provider, storage, external API, or webhook checks were run in ChatGPT Project Mode.

## Phase 38 — Full Testing and QA Codex-only gaps

### Dependency/runtime verification

- Run `npm install`.
- Confirm the package manager/lockfile strategy.
- Run `npm run verify-env`.
- Run `npm run db:validate` / `prisma validate`.
- Regenerate/repair `prisma/migrations/0037_phase38_full_testing_qa/migration.sql`.
- Generate Prisma client.
- Apply migrations.
- Run seed twice.
- Run typecheck, lint, unit, security, integration, adapter-contract, E2E, build, smoke, QA matrix, and test-all commands.

### QA persistence and evidence

- Wire `QaRun`, `QaCheckResult`, `QaEvidenceReference`, and `QaSmokeRouteResult` to real Prisma transactions.
- Persist command results with status, command, exit code, start/end times, sanitized notes, and redacted evidence references.
- Prevent `PASS` without evidence.
- Prevent evidence records from storing raw secrets, raw tokens, signed URLs, provider keys, raw webhook payloads, customer private notes, marketplace credentials, marketplace passwords, raw file bytes, or unapproved delivery links.
- Add retention policy for QA artifacts.
- Add audit events for QA status changes, evidence creation, evidence deletion, and manual overrides.

### Test command coverage

- Verify package mapping, preset validation, sales-channel normalization, file naming, manifest generation, image-processing helpers, credit ledger, RBAC, upload tokens, and download tokens with unit tests.
- Verify auth, client/job CRUD, manual order creation, Stripe webhook, Gumroad webhook, upload flow, mock image processing, ZIP generation, preview gallery, approval/revision, delivery, reports, upsells, credits/subscriptions, sales-channel workflows, storage adapters, and automation webhooks with integration tests.
- Verify signup/login, package selection, Stripe test checkout, Gumroad webhook intake, upload 10 images, mock processing, review previews, approval, ZIP delivery, client download, client revision request, admin revision resolution, manual Fiverr/Upwork/Taskrabbit jobs, and revenue source dashboard with E2E tests.
- Verify public, admin, client, agency, upload, delivery, QA, security, API-access, and integration pages render in a browser.

### Security and product guardrail verification

- Verify server-side RBAC and tenant isolation across QA routes and all prior protected routes.
- Verify unsafe upload rejection and ZIP slip prevention across all upload/import surfaces.
- Verify original uploads are preserved and never overwritten.
- Verify delivery approval gates and expiring hashed delivery tokens.
- Verify upload, delivery, API, invite, shared portal, webhook, and CSRF token hash/expiry/revocation behavior.
- Verify webhook signatures and idempotency for Stripe, Gumroad, automation/API webhooks, and future provider webhooks before paid/client-facing state changes.
- Verify no provider key, OAuth token, SMTP secret, webhook secret, API token, signed URL, marketplace credential, marketplace password, raw webhook payload, private note, or raw customer file data leaks to frontend/API/logs/test snapshots.
- Verify reports, upsells, marketplace templates, webhook templates, delivery messages, QA notes, and generated copy contain no marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad-performance guarantees.

### Browser and build gaps

- Run Playwright against all critical flows.
- Capture failure traces/screenshots and store sanitized references.
- Verify Next production build.
- Verify response headers in browser/deployment context.
- Verify app health endpoint and smoke checks.

## Prior phase unresolved Codex/runtime gaps still active

All unresolved gaps from Phases 0 through 37 remain active until Codex verifies them. Important examples include:

- Auth/session implementation and cookie/session security.
- Tenant, client, agency, and RBAC persistence.
- Package/pricing persistence and checkout wiring.
- Platform preset persistence and selection.
- Sales-channel normalization persistence.
- Upload intake storage, validation, token, and file safety enforcement.
- Job creation and admin queue runtime wiring.
- Image provider adapters and processing pipeline runtime implementation.
- Original upload preservation and output generation.
- Naming, manifest, folder generation, ZIP packaging, and delivery archive runtime safety.
- Preview, QC, flagged output, approval, revision, and delivery flows.
- Stripe/Gumroad billing, webhooks, credits, subscriptions, manual invoices, and entitlement gates.
- Fiverr, Upwork, Taskrabbit, Etsy, Shopify, social, Amazon, eBay, WooCommerce, and other marketplace/manual workflow runtime wiring.
- File storage provider integration and signed URL safety.
- Automation webhook and task/notification integrations.
- Advanced image processing/local workers.
- Reports and upsell engine safety.
- Client dashboard, admin dashboard, agency white-label, API access, and security hardening runtime enforcement.

## ChatGPT Project Mode checks actually run for v40

- Static alias-import target scan across new/updated Phase 38 TS/TSX files.
- Suspicious high-confidence secret-pattern scan across new/updated Phase 38 code/test/doc files.
- ZIP integrity check after packaging.

## ChatGPT Project Mode checks not run for v40

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
