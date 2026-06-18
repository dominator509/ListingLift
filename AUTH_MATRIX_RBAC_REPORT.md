# Phase 2 — Auth Matrix, RBAC & BOLA Validation Report

## Overview

Full-codebase authorization audit covering all 287 route files in `/src/app/api/`. Maps every auth guard pattern, evaluates RBAC enforcement, and identifies Broken Object Level Authorization (BOLA/IDOR) vulnerabilities.

---

## Auth Guard Taxonomy

Four distinct auth patterns exist across the codebase, with vastly different levels of enforcement:

### Level 1: `guardedGet` / `guardedPost` / `guardedPatch` / `guardedSession`

| Property | Value |
|---|---|
| **Source** | `src/server/routes/route-helpers.ts` |
| **Used by** | ~218 route handlers |
| **Enforcement** | **NONE — PLACEHOLDER** |
| **Details** | Accepts a `_permission` string parameter but never reads it. Falls back to demo session `{ userId: 'demo', organizationId: 'demo-org', role: 'admin' }` when no `x-demo-user-id` header is present. Every unauthenticated request is treated as admin. |
| **Risk** | CRITICAL — all routes behind this pattern are wide open |

### Level 2: `requireSession`

| Property | Value |
|---|---|
| **Source** | `src/server/services/auth-session-service.ts` |
| **Used by** | ~20 route handlers |
| **Enforcement** | **REAL — checks cookie session token against DB** |
| **Details** | Calls `resolveSessionFromRequest` which parses `ll_session` cookie, hashes it, and queries Prisma `Session` table. Returns `{ userId, organizationId, role }`. |
| **Limitation** | Only checks that the user is **authenticated**. Does NOT check that the user owns the resource being accessed (BOLA gap). Does NOT enforce role-based permissions. |
| **Risk** | MEDIUM — auth check works, but BOLA and RBAC are missing |

### Level 3: `guardedApiTokenRoute`

| Property | Value |
|---|---|
| **Source** | `src/server/routes/api-token-route-helpers.ts` |
| **Used by** | 7 V1 API routes |
| **Enforcement** | **DRY-RUN — reads bearer token but context is fake** |
| **Details** | Extracts `Bearer` token from `Authorization` header. But instead of resolving against DB, it constructs context from `x-listinglift-*` HTTP headers (organization-id, token-id, scopes, plan, etc.). Scope assertion logic exists and is real, but operates on user-supplied headers. |
| **Risk** | HIGH — scope checking is real but the context source is trivially bypassed |

### Level 4: Webhook Signature Verification

| Property | Value |
|---|---|
| **Used by** | Stripe webhook |
| **Enforcement** | **REAL — HMAC-SHA256 with timing-safe comparison** |
| **Details** | `verifyStripeWebhookSignature` in `stripe-webhook-signature-service.ts` properly validates `Stripe-Signature` header with timestamp tolerance and `crypto.timingSafeEqual`. |
| **Risk** | LOW — properly implemented. Gumroad webhook is still dry-run only. |

---

## Route-by-Route Classification

### PUBLIC ENDPOINTS (Intentional — No Auth Required)

| Route | Pattern | Status |
|---|---|---|
| `GET /api/health` | None (empty handler) | OK — health check |
| `POST /api/auth/login` | Public login | OK — credential-based |
| `POST /api/auth/signup` | Public registration | OK — creates account |
| `POST /api/uploads/public-intake` | Token-based | OK — checks upload token |
| `POST /api/delivery/token/resolve` | Token-based | OK — resolves delivery token |

### REAL SESSION AUTH (requireSession — Authenticated Required. No RBAC.)

| Route | HTTP | BOLA Risk |
|---|---|---|
| `GET /api/auth/me` | GET | None — reads own session |
| `POST /api/auth/logout` | POST | Low — revokes own session |
| `PATCH /api/account` | PATCH | Low — updates own account |
| `POST /api/csrf/token` | POST | Low — generates CSRF token for session |
| `GET /api/uploads` | GET | High — no tenant isolation on returned data |
| `POST /api/uploads` | POST | High — `organizationId` can be overridden from body |
| `POST /api/uploads/create-token` | POST | Medium — `organizationId` fallback uses session |
| `POST /api/uploads/complete` | POST | Medium — `organizationId` fallback uses session |
| `GET /api/uploads/validate-file` | GET | High — no auth check |
| `POST /api/uploads/zip/inspect` | POST | High — no auth check |
| `POST /api/jobs/[jobId]/previews` | POST | **CRITICAL** — session checked but `jobId` from URL, no ownership verification |
| `GET /api/jobs/[jobId]/approval` | GET | **CRITICAL** — any authenticated user can check any job's approval state |
| `POST /api/jobs/[jobId]/approval` | POST | **CRITICAL** — any authenticated user can trigger approval flow on any job |
| `POST /api/jobs/[jobId]/delivery/archive-plan` | POST | **CRITICAL** — any authenticated user can plan delivery for any job |
| `GET /api/uploads/token/resolve` | GET | High — no ownership check on token |
| `POST /api/approvals/jobs/[jobId]/approve` | POST | **CRITICAL** — any authenticated user can approve any job |
| `POST /api/approvals/jobs/[jobId]/reject` | POST | **CRITICAL** — any authenticated user can reject any job |
| `GET /api/approvals/jobs/[jobId]/readiness` | GET | **CRITICAL** — any authenticated user can check readiness of any job |
| `POST /api/approvals/outputs/[processedFileId]/approve` | POST | **CRITICAL** — any user can approve any processed file |
| `POST /api/approvals/outputs/[processedFileId]/reject` | POST | **CRITICAL** — any user can reject any processed file |
| `POST /api/delivery/jobs/[jobId]/send` | POST | **CRITICAL** — any user can trigger delivery for any job |
| `POST /api/delivery/jobs/[jobId]/email-preview` | POST | **CRITICAL** — any user can preview delivery for any job |
| `POST /api/admin/uploads/manual` | POST | High — any authenticated user can trigger manual upload planning |
| `GET /api/quality-control/jobs/[jobId]` | GET | **CRITICAL** — any user can read QC state of any job |
| `POST /api/quality-control/bulk-review` | POST | **CRITICAL** — any user can submit bulk reviews |
| `POST /api/quality-control/outputs/[processedFileId]/flag` | POST | **CRITICAL** — any user can flag any processed file |
| `POST /api/quality-control/outputs/[processedFileId]/review` | POST | **CRITICAL** — any user can review any processed file |
| `POST /api/quality-control/flags/[flagId]/resolve` | POST | **CRITICAL** — any user can resolve any flag |
| `GET /api/quality-control/flagged` | GET | High — any user can list all flagged items |

### PLACEHOLDER GUARD ONLY (guardedGet/Post/Patch/Session — No Real Enforcement)

Every route in this category accepts the permission string but never checks it. An unauthenticated request with a `x-demo-user-id: anything` header gets full admin access. Representative list:

| Domain | Routes | Impact |
|---|---|---|
| **Admin Dashboard** | `admin/dashboard`, `admin/dashboard/source-tracking`, `admin/dashboard/jobs`, `admin/dashboard/revenue`, `admin/dashboard/events`, `admin/dashboard/conversions`, `admin/dashboard/retainer-alerts` | Any user can read revenue, jobs, conversions, retainer data |
| **Admin Security** | `admin/security/*` (dashboard, secrets, headers, rate-limits, webhooks, audit-map, csrf, upload-guard) | Any user can read/write security configuration |
| **Admin QA** | `admin/qa/*` (dashboard, runbook, coverage, smoke-targets, verification-ledger) | Any user can read QA dashboards and runbooks |
| **Admin API Access** | `admin/api-access/*` (tokens, scopes, webhooks, integrations, events, plan-gate, shared-upload-portal) | Any user can manage API tokens and scopes |
| **Agency** | `agency/*` (dashboard, team, reports, workspaces, events, branded-delivery, brand-settings, queue, clients, white-label-settings, billing) | Any user can manage agency-wide settings |
| **Jobs** | `jobs`, `jobs/queue`, `jobs/[jobId]`, `jobs/[jobId]/status`, `jobs/[jobId]/deadline`, `jobs/[jobId]/notes`, `jobs/manual` | Any user can read/manage all jobs |
| **Images** | `images` | Any user can list images |
| **Delivery** | `delivery`, `delivery/links/create`, `delivery/manifest`, `delivery/marketplace-message`, `delivery/zip/draft`, `delivery/archive-plan`, `delivery/create-token` | Any user can create delivery links, manifests, plans |
| **Processing** | `processing`, `processing/queue`, `processing/images/[imageId]/process`, `processing/images/[imageId]/retry`, `processing/jobs/[jobId]/start`, `processing/jobs/[jobId]/status`, `processing/runs/[runId]` | Any user can manage processing pipeline |
| **Packages** | `packages`, `packages/[packageKey]` | Any user can manage pricing packages |
| **Presets** | `presets`, `presets/custom`, `presets/[presetKey]`, `presets/selector` | Any user can manage platform presets |
| **Clients** | `clients`, `clients/[clientId]` | Any user can read/manage all clients |
| **Organizations** | `organizations`, `organizations/team` | Any user can manage team memberships |
| **Revisions** | `revisions`, `revisions/jobs/[jobId]`, `revisions/request`, `revisions/[revisionId]/status` | Any user can manage revisions |
| **Billing** | `billing`, `billing/manual-payment-confirmation` | Any user can manage billing |
| **Integrations** | `integrations` | Any user can read all integration health |
| **Image Providers** | `image-providers`, `image-providers/health`, `image-providers/[providerKey]`, `image-providers/select`, `image-providers/secrets`, `image-providers/test` | Any user can manage image provider secrets |
| **Sales Channels** | `sales-channels/registry`, `sales-channels/normalize`, `sales-channels/manual-order`, `sales-channels/import` | Any user can manage sales channel data |
| **Subscriptions** | `subscriptions`, `subscriptions/entitlements` | Any user can read subscription data |
| **Credits** | `credits`, `credits/ledger`, `credits/adjust` | Any user can read/adjust credits |
| **Notifications** | `notifications/health`, `notifications/send-test` | Any user can send test notifications |
| **RBAC** | `rbac/roles`, `rbac/permissions` | Any user can read role/permission definitions |
| **Client Dashboard** | `client/dashboard` | Any user can read client dashboard |
| **Reports** | `reports` | Any user can read reports catalog |
| **Checkout** | `checkout/package-selection` | Any user can access checkout |
| **Marketplace Exports** | `marketplace-exports/*` (mapping, manual-order, export-plan, delivery-template, safety-check, revision-status, catalog, compliance-warnings) | Any user can manage marketplace exports |
| **Shopify** | `shopify/*` (mapping, manual-order, export-plan, delivery-template, safety-check, oauth/scaffold, product-page-audit, product-import, product-csv-import, image-replacement-approval) | Any user can manage Shopify data |
| **Fiverr** | `fiverr/*` (mapping, manual-order, export-plan, delivery-template, safety-check, revision-status) | Any user can manage Fiverr data |
| **Upwork** | `upwork/*` (mapping, manual-contract, export-plan, delivery-template, safety-check, revision-status, retainer-reminder, proposal-template) | Any user can manage Upwork data |
| **Etsy** | `etsy/*` (mapping, manual-order, export-plan, delivery-template, safety-check, revision-status, visual-report, listing-import) | Any user can manage Etsy data |
| **Gumroad** | `gumroad/*` (mapping, products, purchase-intake, admin-notification-preview) | Any user can manage Gumroad data |
| **Taskrabbit** | `taskrabbit/*` (mapping, manual-task, export-plan, delivery-message, safety-check, follow-up-prompt, conversion-status) | Any user can manage Taskrabbit data |
| **Social Commerce** | `social-commerce/*` (mapping, manual-order, export-plan, delivery-template, safety-check, revision-status, creative-plan, catalog) | Any user can manage social commerce data |
| **Other Sales Channels** | `other-sales-channels/*` (mapping, manual-order, export-plan, delivery-template, safety-check, revision-status, revenue-summary, proposal-template, follow-up-status, catalog) | Any user can manage all other channels |
| **Previews** | `previews/*` (admin/jobs/[jobId], client/jobs/[jobId], images/[processedFileId], bulk-approval) | Any user can preview and bulk-approve |
| **Stripe Checkout** | `stripe/checkout/*` (package, subscription, agency, retainer, credits), `stripe/customer-portal` | Any user can initiate payments |
| **Manual Invoices** | `manual-invoices`, `manual-invoices/[invoiceId]`, `manual-invoices/[invoiceId]/confirm-payment`, `manual-invoices/[invoiceId]/void` | Any user can manage invoices |
| **External Orders** | `external-orders`, `external-orders/dedupe-check`, `external-orders/[externalOrderId]` | Any user can manage orders |
| **Manual Replacements** | `manual-replacements/marker` | Any user can trigger replacements |
| **Upsells** | `upsells/templates`, `upsells/safety-check`, `upsells/[upsellOfferId]/status` | Any user can manage upsells (but `upsells/opportunities`, `upsells/generate` are truly unprotected) |
| **Auth Session** | `auth/session` | Any unauthenticated user gets `{ authenticated: true }` response — MISLEADING |

### NO AUTH AT ALL (Zero Guards)

These routes have no imports from any auth helper and no custom auth logic:

| Route | HTTP | Risk |
|---|---|---|
| `GET /api/client-dashboard/jobs` | GET | HIGH — no session check |
| `GET /api/client-dashboard/summary` | GET | HIGH — no session check |
| `GET /api/client-dashboard/revisions` | GET | HIGH — no session check |
| `GET /api/client-dashboard/billing` | GET | HIGH — no session check |
| `GET /api/client-dashboard/downloads` | GET | HIGH — no session check |
| `GET /api/client-dashboard/events` | GET | HIGH — no session check |
| `GET /api/client-dashboard/upgrade-options` | GET | HIGH — no session check |
| `GET /api/client-dashboard/uploads/plan` | GET | HIGH — no session check |
| `GET /api/file-storage/connections` | GET | HIGH — lists all connections |
| `POST /api/file-storage/connections` | POST | HIGH — creates connections |
| `POST /api/file-storage/connections/[connectionId]` | POST | HIGH — manages connections |
| `GET /api/file-storage/providers` | GET | HIGH — lists providers |
| `POST /api/file-storage/folder-import` | POST | HIGH — imports folders |
| `POST /api/file-storage/export-delivery` | POST | HIGH — exports delivery |
| `POST /api/file-storage/safety-check` | POST | HIGH — bypasses safety check |
| `GET /api/file-storage/health` | GET | MEDIUM |
| `POST /api/file-storage/access/read` | POST | HIGH — reads files |
| `POST /api/file-storage/access/write` | POST | HIGH — writes files |
| `GET /api/advanced-image-processing/recipes` | GET | MEDIUM |
| `POST /api/advanced-image-processing/plan` | POST | HIGH |
| `POST /api/advanced-image-processing/jobs/[jobId]/queue` | POST | **CRITICAL** |
| `POST /api/advanced-image-processing/images/[imageId]/process` | POST | **CRITICAL** |
| `GET /api/advanced-image-processing/reports/[jobId]` | GET | HIGH |
| `POST /api/advanced-image-processing/safety-check` | POST | HIGH |
| `GET /api/advanced-image-processing/health` | GET | LOW |
| `POST /api/automation-webhooks/dispatch` | POST | **CRITICAL** — rate limit only, no auth |
| `POST /api/automation-webhooks/test` | POST | **CRITICAL** |
| `POST /api/automation-webhooks/subscriptions` | POST | **CRITICAL** |
| `POST /api/automation-webhooks/subscriptions/[subscriptionId]` | POST | **CRITICAL** |
| `GET /api/automation-webhooks/events` | GET | HIGH |
| `POST /api/automation-webhooks/providers` | POST | HIGH |
| `POST /api/automation-webhooks/safety-check` | POST | HIGH |
| `GET /api/automation-webhooks/dead-letter` | GET | HIGH |
| `GET /api/automation-webhooks/health` | GET | LOW |
| `POST /api/upsells/opportunities` | POST | HIGH |
| `POST /api/upsells/generate` | POST | HIGH |
| `GET /api/reports/jobs/[jobId]/build` | GET | HIGH |
| `GET /api/reports/client/[clientId]/summary` | GET | HIGH |
| `POST /api/reports/[reportId]/export-plan` | POST | HIGH |
| `POST /api/reports/[reportId]/approval` | POST | HIGH |
| `GET /api/reports/catalog` | GET | MEDIUM |
| `POST /api/task-notification-integrations/*` (13 routes) | POST/GET | HIGH — no auth on any integration management |
| `POST /api/credits/balance` | POST | HIGH |
| `GET /api/account` | GET | HIGH — no auth on account read |
| `GET /api/uploads/validate-file` | GET | HIGH |
| `POST /api/uploads/zip/inspect` | POST | HIGH |

### V1 API TOKEN ROUTES (guardedApiTokenRoute — Context is Header-Supplied)

| Route | Required Scope | Risk |
|---|---|---|
| `GET /api/v1/jobs` | `jobs:read` | HIGH — `x-listinglift-*` headers control tenant context |
| `POST /api/v1/jobs` | `jobs:create` | HIGH |
| `GET /api/v1/jobs/[jobId]` | `jobs:read` | HIGH |
| `POST /api/v1/uploads` | `uploads:create` | HIGH |
| `GET /api/v1/images/[imageId]` | `images:read` | HIGH |
| `GET /api/v1/deliveries/[deliveryId]` | `deliveries:read` | HIGH |
| `GET /api/v1/webhooks` | `webhooks:manage` | HIGH |
| `POST /api/v1/webhooks` | `webhooks:manage` | HIGH |
| `GET /api/v1/presets` | `presets:read` | HIGH |
| `POST /api/v1/presets` | `presets:write` | HIGH |

### WEBHOOK ROUTES (Signature Verification)

| Route | Auth Mechanism | Status |
|---|---|---|
| `POST /api/stripe/webhook` | Stripe HMAC-SHA256 | REAL — proper timing-safe verification |
| `POST /api/gumroad/webhook` | Gumroad signature header | DRY-RUN — accepts header but verification is not wired to actual validation |
| `POST /api/webhooks/gumroad` | Gumroad signature header | Alias to gumroad/webhook |

---

## RBAC Enforcement Analysis

### Current State: `assertPermission` is a No-Op

File: `src/server/services/authorization-service.ts`

```typescript
export function assertPermission(session, permission): void {
  // Phase 3: placeholder — always allows.
  return;
}
```

**Result**: Every route that calls `assertPermission(session, 'some:permission')` before accessing data **silently allows all access**. The RBAC infrastructure does not exist yet.

### Routes Using assertPermission (All No-Op)

These routes appear to enforce RBAC but the check does nothing:

- `uploads` (upload:images)
- `uploads/create-token` (manage:jobs)
- `uploads/complete` (upload:images)
- `jobs/[jobId]/previews` (review:outputs)
- `jobs/[jobId]/approval` (review:outputs / approve:outputs)
- `delivery/jobs/[jobId]/send` (send:delivery)
- `delivery/jobs/[jobId]/email-preview` (send:delivery)
- `approvals/jobs/[jobId]/*` (approve:outputs / review:outputs)
- `approvals/outputs/[processedFileId]/*` (approve:outputs / review:outputs)
- `account` (manage:account)
- `admin/uploads/manual` (manage:jobs)

All **129 permission strings** passed to `guardedGet/Post/Patch` are also silently ignored.

---

## Permissions Vocabulary (Collected from Codebase)

All permission strings used across route files:

| Permission | Routes Using It |
|---|---|
| `view:revenue` | admin/dashboard, admin/dashboard/source-tracking, admin/dashboard/revenue, admin/dashboard/events, admin/dashboard/conversions, admin/dashboard/retainer-alerts |
| `manage:jobs` | admin/dashboard/jobs, jobs/*, images, processing/*, uploads/create-token, admin/uploads/manual, revisions/jobs/[jobId] |
| `manage:packages` | packages, packages/[packageKey] |
| `manage:team` | organizations, organizations/team, rbac/permissions |
| `manage:clients` | clients |
| `manage:agency-branding` | agency/brand-settings |
| `manage:sales-channels` | sales-channels/*, external-orders, external-orders/[externalOrderId] |
| `manage:billing` | billing |
| `manage:presets` | presets, presets/custom, presets/[presetKey] |
| `manage:integrations` | integrations, image-providers/*, notifications/health |
| `send:delivery` | delivery/* |
| `request:revisions` | revisions |
| `review:outputs` | quality-control/checklist, jobs/[jobId]/previews, jobs/[jobId]/approval |
| `approve:outputs` | jobs/[jobId]/approval, approvals/* |
| `adjust:credits` | credits |
| `upload:images` | uploads, uploads/complete |
| `view:client-dashboard` | client/dashboard, auth/session |
| `manage:account` | account |
| `create:manual-orders` | jobs, jobs/manual |
| `generate:upsells` | admin/dashboard/retainer-alerts |
| `PERMISSIONS.manageIntegrations` | image-providers/* |
| See V1 section above | jobs:read, jobs:create, uploads:create, images:read, deliveries:read, webhooks:manage, presets:read, presets:write |

---

## BOLA / IDOR Vulnerability Assessment

### Vulnerability Pattern 1: No Ownership Check After requireSession

Routes use `requireSession` to authenticate the user but never verify that the `jobId`, `clientId`, `processedFileId`, `flagId`, or `externalOrderId` from the URL belongs to the user's organization.

**Example:**
```typescript
// src/app/api/jobs/[jobId]/approval/route.ts
const session = await requireSession(request);  // Just checks "is someone logged in?"
// ... Proceeds to use (await params).jobId without checking session.organizationId
```

**Any authenticated user can:**
- View approval readiness of any job
- Approve or reject any job
- View/modify any processed file's review
- Flag or resolve flags on any processed file
- Trigger delivery for any job
- View QC state of any job

### Vulnerability Pattern 2: organizationId from Request Body

Several routes accept `organizationId` from the request body with a fallback to session:

```typescript
// uploads/route.ts
const input = uploadBatchIntakeRequestSchema.parse(body);
const plan = buildUploadIntakePlan({
  ...input,
  organizationId: input.organizationId ?? session.organizationId,  // Client controls org
});
```

### Vulnerability Pattern 3: No Auth on ID-Parametrized Routes

Routes with dynamic path parameters and zero auth:
- `file-storage/connections/[connectionId]`
- `advanced-image-processing/jobs/[jobId]/queue`
- `advanced-image-processing/images/[imageId]/process`
- `advanced-image-processing/reports/[jobId]`

---

## Cross-Role Escalation Vectors

Since `assertPermission` is a no-op and `guardedGet/Post/Patch/Session` all fall back to `role: 'admin'`, every route is accessible at admin level. No escalation is needed — all roles are already treated as admin.

### Theoretical Escalation Paths (When RBAC is Implemented):

| Attempt | Current Outcome |
|---|---|
| Unauthenticated → Admin | SUCCEEDS — `guarded*` fallback gives admin session |
| User → Admin | SUCCEEDS — `assertPermission` always allows |
| Unauthenticated → Any | SUCCEEDS — no auth on ~30 routes |
| User → Reviewer | SUCCEEDS — `assertPermission` always allows |
| Client → Other Client's Data | SUCCEEDS — no tenant isolation on most routes |

---

## Summary Statistics

| Metric | Count |
|---|---|
| Total route files | 287 |
| Route handlers (GET/POST/PATCH/etc.) | ~340 |
| Routes with real session enforcement (`requireSession`) | ~20 (7%) |
| Routes with real RBAC enforcement | **0 (0%)** |
| Routes with placeholder guard only | ~218 (76%) |
| Routes with no auth at all | ~30+ (10%) |
| Routes with real webhook signature verification | 1 (Stripe) |
| Routes with dry-run token verification | 7 (V1 API) |
| Permission strings accepted but ignored | 129+ |
| BOLA-accessible ID parameters (jobId, clientId, etc.) | 15+ endpoint families |
| Routes where `assertPermission` is called but does nothing | 15+ |
| Auth guard implementations that are no-ops | 4 of 5 |

---

## Risk Matrix

| Vulnerability | Severity | Affected Routes |
|---|---|---|
| `guardedGet/Post/Patch/Session` — no enforcement at all | CRITICAL | ~218 handlers |
| BOLA — no ownership check on ID params | CRITICAL | 15+ endpoint families |
| No auth on client-dashboard routes | HIGH | 8 routes |
| No auth on file-storage routes | HIGH | 10 routes |
| No auth on advanced-image-processing routes | HIGH | 8 routes |
| No auth on automation-webhook management | HIGH | 13 routes |
| API token context from HTTP headers (dry-run) | HIGH | 7 V1 routes |
| `assertPermission` is a no-op | CRITICAL | 15+ handlers |
| `organizationId` from request body (client-controlled) | HIGH | uploads, uploads/create-token, uploads/complete |
| Inconsistent auth: `/api/auth/me` uses real `requireSession` but `/api/auth/session` uses placeholder `guardedGet` | MEDIUM | 1 route |
| Gumroad webhook signature verification is dry-run | MEDIUM | 1 route |

---

## Critical Path to Fix

1. **Wire `resolveSessionFromRequest` into `guardedGet/Post/Patch/Session`** — replace the demo fallback with real cookie-based session resolution
2. **Implement `assertPermission`** — build the RBAC permission registry and check function (Phase 3/4)
3. **Add tenant isolation** — every `jobId`, `clientId`, `processedFileId` lookup must filter by `session.organizationId`
4. **Add auth to unguarded routes** — client-dashboard, file-storage, advanced-image-processing, automation-webhooks, upsells, reports
5. **Wire V1 API token DB lookup** — replace header-supplied context with Prisma query against `ApiAccessToken` table
6. **Make `/api/auth/session` consistent with `/api/auth/me`** — use `requireSession` instead of `guardedGet`
7. **Remove `organizationId` from request body** — always derive from session or token
