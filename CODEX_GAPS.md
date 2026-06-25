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
- `npm run test:security` passes, 55 files / 112 tests, with the formerly skipped CSRF security file converted to runnable local coverage.
- `npm run test:integration` passes, 44 files / 114 tests.
- `npm run test:adapter-contract` passes, 4 files / 7 tests.
- `npm run test:e2e` passes, with upload token secure-intake coverage converted from skipped scaffold to runnable local E2E coverage.
- Focused delivery E2E coverage now passes for the public delivery-token page and admin delivery-send page on a fresh local Next server.
- Focused Upwork manual workflow E2E coverage now passes across contract intake, proposals, delivery, revisions, retainers, and marketplace-safe copy surfaces.
- Focused Gumroad intake E2E coverage now passes for webhook signature gating, dry-run/manual-review mode, dedupe copy, product mapping, hashed upload-link planning, and secret-redaction messaging.
- Focused Fiverr manual workflow E2E coverage now passes across manual order intake, gig mapping, delivery template, revision tracking, and marketplace-safe compliance copy.
- Focused Taskrabbit manual workflow E2E coverage now passes across local-service intake, service mapping, delivery message templates, conversion tracking, and marketplace-safe compliance copy.
- Focused Etsy workflow E2E coverage now passes across manual order intake, delivery templates, listing import planning, shop visual reports, seller-review warnings, and marketplace-safe compliance copy.
- Focused Shopify workflow E2E coverage now passes across manual job intake, OAuth scaffold, product/SKU imports, delivery templates, replacement approval gates, product-page audits, and marketplace-safe compliance copy.
- Focused social-commerce workflow E2E coverage now passes across manual order intake, channel mapping, creative planning, delivery templates, revision tracking, and platform-safe compliance copy.
- Focused other-sales-channels E2E coverage now passes across manual lead/order intake, selectable Phase 23 source catalog, proposal/follow-up templates, follow-up status, revenue attribution, and manual-only safety copy.
- Focused image-provider admin E2E coverage now passes across mock provider readiness, real-provider feature flag gating, secret-reference-only display, dry-run test contract, and manual fallback copy.
- Focused file-storage admin E2E coverage now passes for the main storage integration shell across local/mock baseline provider cards, encrypted-secret-reference copy, and storage safety guardrails.
- Focused task-notification integration E2E coverage now passes across provider setup, data exports, task creation, notification templates, health scaffolds, seed-state messaging, and manually recoverable integration copy.
- Focused manual-invoices E2E coverage now passes across invoice creation copy, payment-confirmation draft controls, transactional billing/audit warnings, and billing/license gate messaging.
- Focused preset-manager E2E coverage now passes across preset catalog copy, seeded summary cards, admin preset table headers, selector controls, and custom preset draft guardrails.
- Focused reports-upsells E2E coverage now passes across reports summary copy, safety messaging, report-builder shell, upsell opportunity cards, and offer-template table headers.
- Focused automation-webhooks E2E coverage now passes across provider scaffolds, trigger/action mapping, dry-run test mode, subscription draft controls, and dead-letter/manual-fallback safety messaging.
- Focused admin-processing E2E coverage now passes across pipeline summary copy, processing status messaging, run-summary shell, output-plan headers, and deterministic processing-step copy.
- Focused admin-delivery-archive E2E coverage now passes across delivery archive planning copy, seeded ZIP/package checklist shells, file-naming preview, folder-tree output, and manifest preview headers.
- Focused ui-shell E2E coverage now passes across public navigation plus the admin dashboard shell, fulfillment analytics copy, and core admin navigation links.
- Focused api-access E2E coverage now passes across the Phase 36 overview plus token management, scope matrix, webhook subscriptions, shared upload portal, and advanced integration catalog shells.
- Focused admin-dashboard E2E coverage now passes across the Phase 34 dashboard plus revenue analytics, source tracking, marketplace-to-direct conversions, and retainer alert shells.
- Focused client-dashboard E2E coverage now passes across the client workspace plus jobs, downloads, reports, and revisions shells with client-scoped demo headers.
- Focused marketplace-exports E2E coverage now passes across the marketplace export overview plus export-plan, manual-order, delivery, and safety shells for Amazon, eBay, and WooCommerce flows.
- Focused approval-revision E2E coverage now passes for the admin approvals shell, including the manual approval guardrails and explicit separation between approval and delivery gates.
- Focused advanced-image-processing E2E coverage now passes for the admin advanced-processing shell, including the visible admin-approval guardrails on recipe cards.
- Focused quality-control E2E coverage now passes for the admin quality-control and flagged-outputs shells, including final-delivery gating language and manual replacement fallback messaging.
- Focused agency-white-label E2E coverage now passes across the agency dashboard, workspaces, queue, white-label settings, delivery, reports, billing, volume-pricing, and team shells.
- Focused admin-job-queue E2E coverage now passes for the admin jobs shell, including the fulfillment queue and manual-job intake card.
- Focused preview-gallery E2E coverage now passes for the admin previews shell, including bulk preview approval and explicit marketplace-safe review language.
- The accessibility audit scans 48 pages with 0 violations.
- `npm run build` passes, generating 361 static pages with only the known Next middleware/proxy deprecation warning.
- `npm run smoke` passes for local domain-default smoke coverage.
- `npm run test-all` passes as one combined command with safe local env and Docker PostgreSQL.
- High-severity npm audit/security gate passes after the Nodemailer update; 5 moderate advisories remain because available fixes require force/breaking upgrades.
- QA ledger evidence references are now persisted through Prisma JSON storage, and PASS rows require evidence.
- QA ledger evidence references now expose a local retention policy with a 30-day review window, 180-day delete-after boundary, and manual purge eligibility.
- QA ledger evidence references now expose a local storage policy: external artifact storage is not required for Phase 38 local verification, and production/CI artifact storage must be revisited before release gates.
- QA ledger mutations now preserve sanitized audit events for entry creation, status changes, evidence creation, evidence deletion, and manual overrides.
- QA ledger evidence refs and notes are redacted before persistence so token, secret, password, API key, authorization, signature, and signed URL values are not stored raw.

## Remaining Codex/runtime gaps

These gaps remain active and should not be described as production-ready:

- Production deployment has not been verified.
- Production database, SMTP, Stripe, marketplace/provider, image-provider, storage-provider, and webhook credentials were not verified in this repair stream.
- Real integrations remain disabled by default and must stay feature-flagged until explicit provider verification is completed.
- No Playwright specs remain intentionally skipped as scaffold or future-provider coverage; the previously skipped CSRF security suite, upload token secure-intake E2E, delivery token/send E2E, Upwork manual workflow E2E, Gumroad intake E2E, Fiverr manual workflow E2E, Taskrabbit manual workflow E2E, Etsy workflow E2E, Shopify workflow E2E, social-commerce workflow E2E, other-sales-channels workflow E2E, image-provider admin E2E, file-storage admin E2E, task-notification integration E2E, manual-invoices E2E, preset-manager E2E, reports-upsells E2E, automation-webhooks E2E, admin-processing E2E, admin-delivery-archive E2E, ui-shell E2E, api-access E2E, admin-dashboard E2E, client-dashboard E2E, marketplace-exports E2E, approval-revision E2E, advanced-image-processing E2E, quality-control E2E, agency-white-label E2E, admin-job-queue E2E, and preview-gallery E2E checks are now runnable local coverage.
- One conditional branch still remains inside `tests/e2e/rate-limiting.spec.ts`: the `/api/auth/me` request test currently exits early when login does not return an `ll_session` cookie, and the focused local rerun is also blocked earlier by `DATABASE_URL is not set` during `/api/auth/signup`.
- Several marketplace, storage, reporting, upsell, automation, and provider routes still rely on mock, dry-run, or scaffolded contracts by design.
- Nested file-storage admin routes (`/admin/file-storage/connections`, `/admin/file-storage/folder-import`, `/admin/file-storage/delivery-export`) returned local 404s during focused Playwright probing and remain unverified.
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

No remaining credential-free QA persistence gaps are currently open. Production/CI artifact storage and deployment evidence remain pre-release work.

### Test command coverage

- Converted the skipped CSRF security scaffold into runnable local service/request coverage for missing token, valid token, forged token, expired token, cross-origin rejection, and safe-method bypass.
- Converted the skipped upload token page scaffold into runnable local Playwright coverage for secure intake language, original preservation, approval gating, ZIP safety, and manual fallback.
- Converted the skipped delivery token/send page scaffold into runnable local Playwright coverage for hashed delivery-token language, approval/archive delivery gates, audit copy, and marketplace-safe delivery messaging.
- Converted the skipped Upwork manual workflow scaffold into runnable local Playwright coverage for manual contract intake, proposal copy, delivery copy, revision tracking, retainer messaging, and marketplace-safe guardrails.
- Converted the skipped Gumroad intake scaffold into runnable local Playwright coverage for webhook signature gating, dry-run/manual-review mode, dedupe requirements, product mapping, hashed expiring upload-link planning, and redacted admin notifications.
- Converted the skipped Fiverr manual workflow scaffold into runnable local Playwright coverage for manual order intake, dedupe/audit copy, gig mapping, safe delivery templates, revision blocking, and no-scraping/password-storage guardrails.
- Converted the skipped Taskrabbit manual workflow scaffold into runnable local Playwright coverage for local-service intake, RBAC/dedupe/tenant/audit copy, service mapping, expiring delivery-link messaging, direct-retainer conversion guardrails, and no-scraping/password-storage rules.
- Converted the skipped Etsy workflow scaffold into runnable local Playwright coverage for manual order intake, duplicate-prevention/audit object creation copy, delivery templates, listing import planning, shop visual reports, seller-review warnings, and no-scraping/no-guarantee guardrails.
- Converted the skipped Shopify workflow scaffold into runnable local Playwright coverage for manual job intake, OAuth scaffold safety, encrypted secret-reference copy, product/SKU import planning, delivery templates, replacement approval gates, product-page audits, and no-scraping/no-guarantee guardrails.
- Converted the skipped social-commerce workflow scaffold into runnable local Playwright coverage for manual order intake, channel mapping, creative-plan safe copy, delivery templates, revision blocking, and no-scraping/no-password/no-guarantee guardrails.
- Converted the skipped other-sales-channels scaffold into runnable local Playwright coverage for manual lead/order intake, source catalog mapping, proposal/follow-up templates, follow-up status, revenue attribution, and no-scraping/no-password/no-automation guardrails.
- Converted the skipped image-provider admin scaffold into runnable local Playwright coverage for mock provider readiness, feature-flagged real-provider blocking, secret-reference labels without values, dry-run-only contract copy, and manual fallback requirements.
- Converted the skipped file-storage admin scaffold into runnable local Playwright coverage for the main integration shell’s local/mock baseline providers, encrypted secret-reference requirements, and storage safety rules without requiring third-party credentials.
- Converted the skipped task-notification integration scaffold into runnable local Playwright coverage for provider setup, data exports, task creation, notification templates, integration health, seed-state copy, and manually recoverable feature-flagged integration messaging.
- Converted the skipped manual-invoices scaffold into runnable local Playwright coverage for invoice-creation copy, external payment confirmation controls, transactional billing/audit warnings, and verified-payment gate messaging.
- Converted the skipped preset-manager scaffold into runnable local Playwright coverage for preset catalog copy, seeded summary cards, admin preset table headers, selector controls, and custom preset draft/audit guardrails.
- Converted the skipped reports-upsells scaffold into runnable local Playwright coverage for reports summary copy, report/upsell safety messaging, report-builder shell, upsell opportunity cards, and offer-template table headers.
- Converted the skipped automation-webhooks scaffold into runnable local Playwright coverage for provider scaffolds, trigger/action mapping, dry-run test mode, subscription draft controls, and dead-letter/manual-fallback safety messaging.
- Converted the skipped admin-processing scaffold into runnable local Playwright coverage for pipeline summary copy, processing status messaging, run-summary shell, output-plan headers, and deterministic processing-step copy.
- Converted the skipped admin-delivery-archive scaffold into runnable local Playwright coverage for delivery archive planning copy, seeded ZIP/package checklist shells, file-naming preview, folder-tree output, and manifest preview headers.
- Converted the skipped ui-shell admin scaffold into runnable local Playwright coverage for the admin dashboard shell, fulfillment analytics copy, and core admin navigation links while preserving the existing public navigation check.
- Converted the skipped api-access scaffold into runnable local Playwright coverage for the Phase 36 overview plus token management, scope matrix, webhook subscriptions, shared upload portal, and advanced integration catalog shells.
- Converted the skipped admin-dashboard scaffold into runnable local Playwright coverage for the Phase 34 dashboard plus revenue analytics, source tracking, marketplace-to-direct conversions, and retainer alert shells.
- Converted the skipped client-dashboard scaffold into runnable local Playwright coverage for the client workspace plus jobs, downloads, reports, and revisions shells with client-scoped demo headers.
- Converted the skipped marketplace-exports scaffold into runnable local Playwright coverage for the marketplace export overview plus export-plan, manual-order, delivery, and safety shells for Amazon, eBay, and WooCommerce flows.
- Converted the skipped approval-revision scaffold into runnable local Playwright coverage for the admin approvals shell and its manual approval guardrails.
- Converted the skipped advanced-image-processing scaffold into runnable local Playwright coverage for the admin advanced-processing shell.
- Converted the skipped quality-control scaffold into runnable local Playwright coverage for the admin quality-control and flagged-outputs shells.
- Converted the skipped agency-white-label scaffold into runnable local Playwright coverage for the agency dashboard, workspaces, queue, white-label settings, delivery, reports, billing, volume-pricing, and team shells.
- Converted the skipped admin-job-queue scaffold into runnable local Playwright coverage for the admin jobs shell.
- Converted the skipped preview-gallery scaffold into runnable local Playwright coverage for the admin previews shell and restored the admin preview safe-language notice from the preview gallery service output.
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
