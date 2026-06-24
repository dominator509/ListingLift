# CODEX_GAPS.md

## Current package

ListingLift Repo Seed v40, locally repaired through Phase 38 evidence hardening.

## Current phase

Phase 38 - Full Testing and QA

## Current local Codex evidence

The earlier seed-era runtime gaps in this file have been partially closed by local Codex repair work. Current evidence:

- `npm run verify-env` passes with safe local test configuration.
- Prisma validation, client generation, non-interactive migration deploy, and seed idempotency pass against Docker PostgreSQL.
- `npm run typecheck` passes with 0 TypeScript errors.
- `npm run lint` passes with 12 warnings and 0 errors.
- `npm run test:unit` passes, 101 files / 451 tests.
- `npm run test:security` passes, 54 files passed / 1 skipped, 102 tests passed / 7 skipped.
- `npm run test:integration` passes, 44 files / 114 tests.
- `npm run test:adapter-contract` passes, 4 files / 7 tests.
- `npm run test:e2e` passes, 34 tests passed / 32 intentional skips.
- The accessibility audit scans 48 pages with 0 violations.
- `npm run build` passes, generating 361 static pages with only the known Next middleware/proxy deprecation warning.
- `npm run smoke` passes for local domain-default smoke coverage.
- `npm run test-all` passes as one combined command with safe local env and Docker PostgreSQL.
- High-severity npm audit/security gate passes after the Nodemailer update; 5 moderate advisories remain because available fixes require force/breaking upgrades.
- QA ledger evidence references are now persisted through Prisma JSON storage, and PASS rows require evidence.
- QA ledger evidence references now expose a local retention policy with a 30-day review window, 180-day delete-after boundary, and manual purge eligibility.
- QA ledger evidence references now expose a local storage policy: external artifact storage is not required for Phase 38 local verification, and production/CI artifact storage must be revisited before release gates.

## Remaining Codex/runtime gaps

These gaps remain active and should not be described as production-ready:

- Production deployment has not been verified.
- Production database, SMTP, Stripe, marketplace/provider, image-provider, storage-provider, and webhook credentials were not verified in this repair stream.
- Real integrations remain disabled by default and must stay feature-flagged until explicit provider verification is completed.
- 32 Playwright specs remain intentionally skipped as scaffold or future-provider coverage.
- Several marketplace, storage, reporting, upsell, automation, and provider routes still rely on mock, dry-run, or scaffolded contracts by design.
- The Next middleware/proxy deprecation warning remains tracked separately because it does not currently block build/runtime verification.
- Five moderate dependency advisories remain because the available npm fixes require breaking or force upgrades.
- Production observability, artifact retention, and external QA evidence storage remain unverified.

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
- Never guarantee marketplace approval, ranking, sales, conversion, ad performance, listing approval, product approval, or platform acceptance.

## Phase 38 residual hardening backlog

### Provider and production readiness

- Verify production deployment separately from local build/smoke.
- Verify real SMTP, Stripe, storage, marketplace, image-provider, and webhook integrations only behind explicit feature flags.
- Add production-safe rollback and observability evidence before any production-ready claim.

### QA persistence and evidence

- Keep persisted evidence sanitized; never store raw secrets, raw tokens, signed URLs, provider keys, raw webhook payloads, customer private notes, marketplace credentials, marketplace passwords, raw file bytes, or unapproved delivery links.
- Preserve audit events for QA status changes, evidence creation, evidence deletion, and manual overrides.

### Test command coverage

- Convert intentionally skipped Playwright scaffold specs into runnable coverage as the corresponding product flows become real.
- Expand browser coverage for any route that moves from dry-run/mock mode to real provider behavior.
- Keep `npm run test-all` as the combined local evidence gate after each broad Phase 38 repair.

### Security and product guardrail verification

- Re-verify server-side RBAC and tenant isolation whenever admin, client, agency, API, upload, delivery, webhook, billing, marketplace, storage, processing, reporting, upsell, QA, or integration routes change.
- Re-verify unsafe upload rejection and ZIP slip prevention across every new upload/import surface.
- Re-verify original upload preservation and final-download approval gates whenever storage, processing, preview, revision, or delivery code changes.
- Re-verify token hash, expiry, and revocation behavior for upload, delivery, API, invite, shared portal, webhook, and CSRF tokens after auth/session changes.
- Re-verify generated and templated copy for compliance-safe language after marketplace, report, upsell, delivery, and QA messaging changes.

## Prior phase unresolved Codex/runtime gaps still active

All unresolved gaps from Phases 0 through 37 remain active until they are covered by local and production evidence. Important examples include:

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
