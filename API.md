# API.md

## Principles

- Thin route handlers.
- Service-layer business logic.
- Shared Zod schemas.
- Consistent error shape.
- Server-side auth, RBAC, and tenant isolation.
- Audit logs for sensitive mutations.

## Seeded endpoints

- `GET /api/health`
- `GET /api/packages`
- `GET /api/presets`
- `POST /api/sales-channels/normalize`
- `GET /api/adapters/health`

## Future API areas

Auth, organizations, clients, jobs, uploads, images, processing, presets, packages, delivery, revisions, reports, sales channels, external orders, integrations, billing, credits, subscriptions, webhooks, admin dashboard, client dashboard, agency dashboard.


## Phase 3 Auth Endpoints

- `POST /api/auth/signup` — validates signup input, creates user/org/client-owner membership, creates server-side session, sets HTTP-only session cookie.
- `POST /api/auth/login` — validates credentials, rate-limits attempts, rotates session, sets HTTP-only session cookie.
- `POST /api/auth/logout` — revokes current session where available and clears session cookie.
- `GET /api/auth/me` — returns current session context only; never returns password hashes.
- `PATCH /api/account` — updates account name and password after session verification and current-password verification.

Auth route handlers must never return `passwordHash`, raw session tokens, cookie values, or secret material.


## Phase 8 Upload and File Intake API Contracts

Seeded route contracts added in v10:

- `POST /api/uploads/create-token` — authenticated admin/operator token issue plan; must persist token hash only.
- `POST /api/uploads/token/resolve` — public token hash preview contract; Codex must wire database lookup.
- `POST /api/uploads/public-intake` — public token-scoped upload intake dry-run contract.
- `GET /api/uploads` — authenticated upload module capabilities.
- `POST /api/uploads` — authenticated upload batch intake dry-run contract.
- `POST /api/uploads/validate-file` — file metadata validation contract.
- `POST /api/uploads/zip/inspect` — ZIP entry safety inspection contract.
- `POST /api/uploads/complete` — transactional upload completion planning contract.
- `POST /api/admin/uploads/manual` — admin/manual upload fallback planning contract.

Codex must connect these routes to storage, Prisma transactions, audit logs, tenant/RBAC enforcement, token scope resolution, and runtime tests.

## Phase 17 Stripe Billing API Contracts

- `POST /api/stripe/checkout/package`
- `POST /api/stripe/checkout/subscription`
- `POST /api/stripe/checkout/retainer`
- `POST /api/stripe/checkout/agency`
- `POST /api/stripe/checkout/credits`
- `POST /api/stripe/customer-portal`
- `POST /api/stripe/webhook`
- `POST /api/webhooks/stripe`

All payment routes must resolve prices and entitlements server-side. The webhook route must verify `Stripe-Signature` before processing.

## Phase 20 Fiverr Workflow API Contracts

Seed v22 adds dry-run Fiverr workflow route contracts:

- `POST /api/fiverr/manual-order` — plan manual Fiverr order intake into Client, ExternalOrder, Job, UploadToken, FiverrWorkflowEvent, and AuditLog records.
- `GET /api/fiverr/mapping` — list default Fiverr gig/package mappings.
- `POST /api/fiverr/mapping` — resolve or plan organization-scoped gig mapping updates.
- `POST /api/fiverr/delivery-template` — generate Fiverr-safe manual delivery copy.
- `POST /api/fiverr/revision-status` — plan Fiverr revision status updates.
- `POST /api/fiverr/export-plan` — plan delivery ZIP/export/revenue attribution for Fiverr.
- `POST /api/fiverr/safety-check` — block scraping, password storage, unauthorized messaging automation, and unapproved external-link flows.

All Phase 20 routes are seed contracts until Codex wires Prisma transactions, RBAC, tenant isolation, audit logs, and runtime checks.

## Phase 21 — Upwork Workflow API Contracts

Seed route contracts added in v23:

- `POST /api/upwork/manual-contract` — dry-run manual Upwork contract intake plan.
- `GET /api/upwork/mapping` — default offer/package mapping catalog.
- `POST /api/upwork/mapping` — validate an organization-scoped mapping draft.
- `POST /api/upwork/proposal-template` — generate safe proposal copy for manual Upwork use.
- `POST /api/upwork/delivery-template` — generate safe delivery copy for approved archive delivery.
- `POST /api/upwork/revision-status` — plan revision status update.
- `POST /api/upwork/retainer-reminder` — generate a manual retainer upsell reminder.
- `POST /api/upwork/export-plan` — plan approved archive delivery through Upwork.
- `POST /api/upwork/safety-check` — check for scraping, password storage, unapproved messaging automation, and unsafe external-link use.

All routes are seed contracts. Codex must wire auth, RBAC, tenant isolation, Prisma transactions, duplicate prevention, and audit logs before production use.

## Phase 22 — Taskrabbit Workflow API Contracts

Seed routes added for Taskrabbit manual/local-service workflows:

- `POST /api/taskrabbit/manual-task`
- `GET /api/taskrabbit/mapping`
- `POST /api/taskrabbit/mapping`
- `POST /api/taskrabbit/delivery-message`
- `POST /api/taskrabbit/conversion-status`
- `POST /api/taskrabbit/follow-up-prompt`
- `POST /api/taskrabbit/export-plan`
- `POST /api/taskrabbit/safety-check`

These are dry-run/contract routes. Codex must connect them to tenant-scoped Prisma transactions, duplicate prevention, RBAC, audit logs, upload-token creation, revenue attribution, and conversion tracking.


## Phase 23 — Other Sales Channel APIs

Seed route contracts added for `/api/other-sales-channels/catalog`, `/manual-order`, `/proposal-template`, `/delivery-template`, `/follow-up-status`, `/revenue-summary`, `/export-plan`, and `/safety-check`. Codex must wire them to tenant-scoped Prisma transactions, RBAC, duplicate prevention, and audit logs.

## Phase 24 — Etsy Workflow APIs

- `POST /api/etsy/manual-order` — dry-run manual Etsy order to normalized ListingLift job plan.
- `GET/POST /api/etsy/mapping` — Etsy package mapping catalog and mutation scaffold.
- `POST /api/etsy/listing-import` — CSV/API-scaffold listing import planner.
- `POST /api/etsy/delivery-template` — manual Etsy-safe delivery copy.
- `POST /api/etsy/visual-report` — shop visual consistency report draft.
- `POST /api/etsy/revision-status` — revision status update plan.
- `POST /api/etsy/export-plan` — Etsy preset/folder export plan.
- `POST /api/etsy/safety-check` — marketplace safety gate.

## Phase 25 — Shopify Workflow API

Seed route contracts were added under `/api/shopify/*` for manual order intake, product CSV import, product import scaffolds, delivery templates, product-page audits, image replacement approvals, OAuth scaffolding, export plans, and safety checks. Codex must connect these to Prisma transactions, RBAC, tenant isolation, audit logs, and feature flags.


## Phase 26 — Social Commerce API Contracts

- `GET /api/social-commerce/catalog`
- `POST /api/social-commerce/manual-order`
- `GET /api/social-commerce/mapping`
- `POST /api/social-commerce/mapping`
- `POST /api/social-commerce/creative-plan`
- `POST /api/social-commerce/delivery-template`
- `POST /api/social-commerce/revision-status`
- `POST /api/social-commerce/export-plan`
- `POST /api/social-commerce/safety-check`

These are seed/dry-run contracts. Codex must enforce auth, RBAC, tenant isolation, duplicate prevention, transactions, and audit logs before production use.


## Phase 27 — Amazon, eBay, WooCommerce Route Contracts

Seed routes added under `/api/marketplace-exports/*`:

- `GET /api/marketplace-exports/catalog`
- `POST /api/marketplace-exports/manual-order`
- `GET/POST /api/marketplace-exports/mapping`
- `POST /api/marketplace-exports/export-plan`
- `POST /api/marketplace-exports/delivery-template`
- `POST /api/marketplace-exports/compliance-warnings`
- `POST /api/marketplace-exports/revision-status`
- `POST /api/marketplace-exports/safety-check`

These are dry-run contracts until Codex wires tenant-scoped Prisma persistence, RBAC, audit logs, duplicate prevention, approved-archive lookup, and storage access.


## Phase 28 — File Storage Integrations

Route contracts added:

- `GET /api/file-storage/providers`
- `GET/POST /api/file-storage/connections`
- `GET/PATCH /api/file-storage/connections/[connectionId]`
- `GET /api/file-storage/health`
- `POST /api/file-storage/access/read`
- `POST /api/file-storage/access/write`
- `POST /api/file-storage/folder-import`
- `POST /api/file-storage/export-delivery`
- `POST /api/file-storage/safety-check`

All mutation routes require Codex to wire tenant-scoped Prisma transactions, RBAC, encrypted secret references, audit logs, and rate limits.


## Phase 29 — Automation Webhooks API

Seed route contracts added:

- `GET /api/automation-webhooks/providers`
- `GET/POST /api/automation-webhooks/subscriptions`
- `GET/PATCH /api/automation-webhooks/subscriptions/[subscriptionId]`
- `GET/POST /api/automation-webhooks/events`
- `POST /api/automation-webhooks/dispatch`
- `POST /api/automation-webhooks/test`
- `GET /api/automation-webhooks/health`
- `GET/POST/PATCH /api/automation-webhooks/dead-letter`
- `POST /api/automation-webhooks/safety-check`

All Phase 29 routes are dry-run/contract scaffolds until Codex wires Prisma persistence, encrypted secret references, RBAC, tenant isolation, rate limits, audit logs, and real feature-flagged dispatch.

## Phase 30 — Notifications and Task/Data Exports

Seed route contracts added:

- `GET /api/task-notification-integrations/providers`
- `GET /api/task-notification-integrations/health`
- `POST /api/task-notification-integrations/send-alert`
- `POST /api/task-notification-integrations/export-data`
- `POST /api/task-notification-integrations/create-task`
- `POST /api/task-notification-integrations/templates`
- `POST /api/task-notification-integrations/test`
- `POST /api/task-notification-integrations/safety-check`

These are dry-run contracts until Codex wires tenant-scoped Prisma persistence, encrypted secret references, audit logs, rate limits, and feature-flagged provider adapters.

## Phase 31 — Advanced Image Processing API

Seed route contracts added:

- `GET /api/advanced-image-processing/recipes`
- `POST /api/advanced-image-processing/plan`
- `POST /api/advanced-image-processing/jobs/[jobId]/queue`
- `POST /api/advanced-image-processing/images/[imageId]/process`
- `POST /api/advanced-image-processing/reports/[jobId]`
- `POST /api/advanced-image-processing/safety-check`
- `GET /api/advanced-image-processing/health`

All mutation routes must be authenticated, tenant-scoped, RBAC-protected, audited, and wired to Prisma/storage/provider runtime by Codex.

## Phase 32 — Reports and Upsell Engine API Contracts

New dry-run route contracts:

- `GET /api/reports/catalog`
- `POST /api/reports/jobs/[jobId]/build`
- `POST /api/reports/client/[clientId]/summary`
- `POST /api/reports/[reportId]/approval`
- `POST /api/reports/[reportId]/export-plan`
- `POST /api/upsells/opportunities`
- `POST /api/upsells/generate`
- `GET /api/upsells/templates`
- `POST /api/upsells/[upsellOfferId]/status`
- `POST /api/upsells/safety-check`

Codex must connect these to server-side RBAC, tenant isolation, Prisma transactions, audit logs, and approved visibility gates.

## Phase 33 Client Dashboard API Contracts

- `POST /api/client-dashboard/summary`
- `POST /api/client-dashboard/jobs`
- `POST /api/client-dashboard/uploads/plan`
- `POST /api/client-dashboard/downloads`
- `POST /api/client-dashboard/revisions`
- `GET /api/client-dashboard/billing`
- `GET /api/client-dashboard/upgrade-options`
- `POST /api/client-dashboard/events`

All routes must be wired by Codex to authenticated, tenant-scoped, client-scoped server-side Prisma queries before production use.


## Phase 34 Admin Dashboard and Revenue Analytics Routes

Seeded dry-run route contracts:

- `GET /api/admin/dashboard`
- `GET /api/admin/dashboard/jobs`
- `GET /api/admin/dashboard/revenue`
- `GET /api/admin/dashboard/source-tracking`
- `GET /api/admin/dashboard/conversions`
- `GET /api/admin/dashboard/retainer-alerts`
- `POST /api/admin/dashboard/events`

Codex must wire these routes to real authenticated session context, admin RBAC, tenant isolation, Prisma transactions, verified revenue/source records, rate limits, and audit logs. Dry-run responses must not be treated as production analytics.

## Phase 35 Agency White-Label API Contracts

Seeded dry-run route contracts:

- `GET /api/agency/dashboard`
- `GET/POST /api/agency/workspaces`
- `GET/POST /api/agency/white-label-settings`
- `POST /api/agency/branded-delivery`
- `POST /api/agency/reports`
- `GET /api/agency/billing`
- `GET/POST /api/agency/team`
- `GET/POST /api/agency/queue`
- `POST /api/agency/events`

Codex must wire these routes to real authenticated session context, agency RBAC, tenant isolation, Prisma transactions, rate limits, audit logs, approved delivery/report gates, verified billing records, and hashed expiring invite/delivery tokens. Dry-run responses must not be treated as production agency data.


---

## Phase 36 — API Access and Advanced Integrations Scaffold

### Admin API access routes

- `GET /api/admin/api-access/tokens` — dry-run token inventory. Codex must query tenant-scoped `ApiAccessToken` records and redact token hashes.
- `POST /api/admin/api-access/tokens` — one-time token issue draft. Codex must persist only token hash/prefix/scopes/status/expiry/plan/actor metadata.
- `POST /api/admin/api-access/tokens/[tokenId]/revoke` — revoke token draft. Codex must revoke tenant-scoped token transactionally and audit.
- `GET /api/admin/api-access/scopes` — scope matrix and plan allowlist preview. Codex must derive plan from verified entitlement records.
- `POST /api/admin/api-access/plan-gate` — plan-gate decision draft. Codex must evaluate from verified payment/subscription/token state.
- `GET/POST /api/admin/api-access/integrations` — Zapier/Make/n8n/custom API/webhook connection catalog and draft creation.
- `GET/POST /api/admin/api-access/webhooks` — webhook subscription draft management.
- `GET/POST /api/admin/api-access/shared-upload-portal` — shared upload portal draft management.
- `POST /api/admin/api-access/events` — sanitized API access event draft.

### External API v1 route contracts

- `GET /api/v1/jobs` requires `jobs:read`.
- `POST /api/v1/jobs` requires `jobs:create`.
- `GET /api/v1/jobs/[jobId]` requires `jobs:read`.
- `POST /api/v1/uploads` requires `uploads:create`.
- `GET /api/v1/images/[imageId]` requires `images:read`.
- `GET /api/v1/deliveries/[deliveryId]` requires `deliveries:read`.
- `GET /api/v1/presets` requires `presets:read`.
- `POST /api/v1/presets` requires `presets:write`.
- `GET/POST /api/v1/webhooks` requires `webhooks:manage`.

### Phase 36 API security rules

- Raw API tokens are shown once only.
- API tokens are stored only as hashes.
- API token hashes are never returned to clients.
- Every external API route must hash the presented bearer token and load a tenant-scoped token record before processing.
- Every external API route must enforce scope, token status, expiry, revocation, plan gate, tenant scope, client scope, agency workspace scope, rate limits, and audit logging.
- API job creation must preserve ListingLift package, source-channel, upload, job queue, billing, manual review, and approval semantics.
- API uploads and shared upload portals must reject unsafe uploads, prevent ZIP slip, enforce max file limits, use expiring hashed upload tokens, and preserve originals.
- API image/delivery reads must not expose private notes, raw provider payloads, raw webhook payloads, signed URLs, marketplace credentials, token hashes, raw tokens, or unapproved delivery data.
- Real Zapier, Make, n8n, custom API, and webhook integrations remain disabled by default until feature flags, encrypted secret references, provider verification, rate limits, and audit logging are wired.

## Phase 37 — Admin Security Hardening API Contracts

All Phase 37 admin security routes are scaffold-only and require production auth, RBAC, tenant isolation, rate limiting, audit logging, and Prisma wiring by Codex.

### `GET /api/admin/security/dashboard`

Returns the dry-run security control map, header policy rows, audit coverage summary, and Codex notes. Requires `manage:security`.

### `POST /api/admin/security/upload-guard`

Dry-runs upload and optional ZIP entry security validation. Codex must enforce the same checks before storage, extraction, or processing.

### `POST /api/admin/security/secrets`

Creates a draft encrypted secret reference response. This is not real encryption. Codex must replace placeholder refs with KMS/envelope encryption or secret manager references and never accept or return raw secret material.

### `GET /api/admin/security/rate-limits`

Returns scaffolded sensitive-route rate-limit policies.

### `POST /api/admin/security/rate-limits`

Dry-runs a rate-limit policy evaluation. Codex must wire distributed counters and route-level enforcement.

### `POST /api/admin/security/csrf`

Creates or verifies a session-bound CSRF token draft. Codex must wire CSRF to state-changing browser routes and store only hashes or use stateless HMAC validation.

### `POST /api/admin/security/webhooks`

Dry-runs webhook verification decisions. The scaffold intentionally never auto-processes webhooks. Codex must verify provider signatures against raw request bodies before paid/client-facing state changes.

### `GET /api/admin/security/audit-map`

Returns sensitive-action audit coverage rows. Codex must persist and verify sanitized audit coverage.

### `GET /api/admin/security/headers`

Returns scaffolded response-header policy rows. Codex must browser-smoke-check actual response headers.

---

## Phase 38 — Full Testing and QA API route contracts

Phase 38 adds admin-only QA route contracts. These are dry-run scaffolds until Codex wires real auth, RBAC, tenant isolation, Prisma persistence, rate limits, audit logs, and sanitized evidence references.

### Admin QA routes

- `GET /api/admin/qa/dashboard` — returns QA command sequence, coverage matrix, critical journeys, smoke targets, and production blockers.
- `GET /api/admin/qa/coverage` — returns roadmap coverage rows, optionally filtered by QA layer.
- `GET /api/admin/qa/runbook` — returns the required Codex QA command sequence and stop conditions.
- `GET /api/admin/qa/smoke-targets` — returns route groups that Codex must browser-render.
- `GET /api/admin/qa/verification-ledger` — returns a scaffold empty QA ledger summary.
- `POST /api/admin/qa/verification-ledger` — dry-runs QA evidence validation and rejects `PASS` without evidence.

### Required permission

All Phase 38 QA admin routes require `manage:qa`.

### Codex requirements

- Persist QA run/check/evidence/smoke records transactionally.
- Never store raw command output if it includes secrets or sensitive data.
- Redact evidence references.
- Reject `PASS` without evidence.
- Audit QA overrides and evidence changes.
