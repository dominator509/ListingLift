# Q3 Phase 4 — Taint Analysis & Internal Security Audit

## Scope

- All POST/PATCH/PUT/DELETE routes in `src/app/api/`
- CSRF token flow (issuance → validation → consumption)
- File upload pipeline (multipart → temp → storage → delivery)
- Webhook intake (Stripe, Gumroad)
- Session cookie creation/validation
- 753 TypeScript files, ~1,276 functions across the project

---

## 1. Taint Source Enumerator

| Taint Source | Routes Exposed | Auth Gate | Sanitization |
|---|---|---|---|
| `req.body` / `request.json()` | All POST/PATCH/PUT routes | Varies — see §2 | Inconsistent |
| `req.query` / `URL.searchParams` | GET routes: jobs, approvals, deliveries | `guardedGet` (falls to demo) | None |
| `req.params` / route segments | `[jobId]`, `[clientId]`, `[processedFileId]`, `[presetKey]`, `[providerKey]`, etc. | Varies | None (treated as opaque IDs) |
| `req.headers` (session cookie, CSRF token, origin, demo headers) | Middleware + all protected routes | Middleware checks cookie | HMAC/SHA-256 hashed |
| `req.headers` (stripe-signature, x-gumroad-signature) | `/api/webhooks/stripe`, `/api/webhooks/gumroad` | Signature verification in services | Pass-through to event handlers |
| `cookies` (ll_session) | All routes parsing cookie header | Middleware + `requireSession` | Token hashed (SHA-256) |
| File uploads (metadata only — no raw binary piped yet) | `/api/uploads/*`, `/api/admin/uploads/manual` | Varies | File name sanitized, MIME/extension validated |
| Webhook payloads (Stripe, Gumroad) | `/api/stripe/webhook`, `/api/gumroad/webhook` | `verifyStripeWebhookSignature` / `verifyGumroadWebhookSignature` | JSON-parsed, schema-validated |

---

## 2. Authentication Gate Analysis

### 2.1 CRITICAL — `guardedSession/guardedPost/guardedPatch/guardedGet` Auth Bypass

**File:** `src/server/routes/route-helpers.ts`  
**Sink:** Lines 42–68

```typescript
export async function guardedSession<T>(
  request: Request,
  handler: ... // session parameter
): Promise<Response> {
  const demo = extractDemoSession(request);  // checks x-demo-* headers
  const session = demo ?? { userId: 'demo', organizationId: 'demo-org', role: 'admin' };
  const data = await handler(session);
  ...
}
```

When no `x-demo-user-id` header is present, `extractDemoSession()` returns `null`, and the fallback creates a synthetic **admin session** with `role: 'admin'`. This means **any unauthenticated HTTP request** to these 91 routes is treated as an admin.

**Affected routes (91 total):**

- **33 routes** using `guardedSession` — admin/api-access, admin/security, admin/qa, agency/\*, clients/[clientId], rbac/roles
- **18 routes** using `guardedPost` — packages, jobs, jobs/[jobId]/notes, jobs/manual, image-providers/\*, organizations, organizations/team, processing/\*, clients, presets
- **6 routes** using `guardedPatch` — packages/[packageKey], jobs/[jobId]/status, jobs/[jobId]/deadline, agency/brand-settings, image-providers/[providerKey], presets/[presetKey]
- **34 routes** using `guardedGet` — admin/dashboard/\*, images, jobs, jobs/[jobId], delivery, agency/\*, external-orders, reports, integrations, client/dashboard, credits, image-providers, organizations, sales-channels/registry, processing/\*, notifications/health, revisions, clients, billing, quality-control/checklist, rbac/permissions, auth/session

### 2.2 CRITICAL — `assertPermission` is a No-Op

**File:** `src/server/services/authorization-service.ts` (Lines 6–13)

```typescript
export function assertPermission(
  session: ...,
  permission: string,
): void {
  // Phase 3: placeholder — always allows.
  return;
}
```

Every route calling `assertPermission()` receives **zero actual enforcement**. RBAC is documented as coming in Phase 4, but all 135+ routes that use it are running with a no-op gate.

### 2.3 Routes with Zero Authentication

These POST/PATCH routes have **no session check at all** — any unauthenticated request is accepted:

| Route | Description | Risk |
|---|---|---|
| `/api/uploads/validate-file` | File metadata validation | LOW (no persistence) |
| `/api/uploads/zip/inspect` | ZIP entry inspection | LOW (no persistence) |
| `/api/stripe/checkout/package` | Creates Stripe checkout sessions | **HIGH** — can create Stripe payments without auth |
| `/api/stripe/checkout/subscription` | Creates Stripe subscription sessions | **HIGH** |
| `/api/stripe/checkout/credits` | Creates Stripe credit sessions | **HIGH** |
| `/api/stripe/checkout/agency` | Creates Stripe agency sessions | **HIGH** |
| `/api/stripe/checkout/retainer` | Creates Stripe retainer sessions | **HIGH** |
| `/api/file-storage/connections/[connectionId]` (PATCH) | Updates storage connection settings | **HIGH** — accepts body.actorUserId from body |
| `/api/file-storage/folder-import` | Plans folder import | **HIGH** — accepts organizationId from body |
| `/api/file-storage/export-delivery` | Plans delivery export | **HIGH** — accepts organizationId from body |
| `/api/gumroad/purchase-intake` | Gumroad purchase intake | **HIGH** — no auth on payment-related intake |
| `/api/gumroad/mapping` | Gumroad product mapping | **MEDIUM** |
| `/api/delivery/token/resolve` | Delivery token resolution | **MEDIUM** — token-based, but no auth |
| `/api/uploads/token/resolve` | Upload token resolution | **MEDIUM** |
| `/api/auth/signup` | User registration | Intentional (no auth for signup) |
| `/api/auth/login` | User login | Intentional (no auth for login) |

---

## 3. Taint Source → Sink Trace Map

### 3.1 CSRF Token Flow

| Step | File | Auth | Issue |
|---|---|---|---|
| **Issuance** (POST `/api/csrf/token`) | `src/app/api/csrf/token/route.ts` | `requireSession` ✓ | OK — session-bound |
| **Token generation** | `src/server/services/csrf-protection-service.ts` | N/A | Uses `CSRF_SECRET || AUTH_SECRET || 'changeme'` — **falls back to hardcoded `'changeme'`** |
| **Validation** (in route handlers) | Same file, `verifyCsrfForRequest` | Origin header check + HMAC | **Origin check allows null/missing origin** — `if (!origin && !referer) return true` allows direct POSTs |
| **Admin CSRF test** (POST `/api/admin/security/csrf`) | `src/app/api/admin/security/csrf/route.ts` | `guardedSession` ✗ | Uses `guardedSession` — bypasses real session |

**Finding: CSRF_SECRET fallback to 'changeme'**  
When `CSRF_SECRET` and `AUTH_SECRET` are both unset (dev/test), the HMAC secret is the literal string `'changeme'` — any attacker who knows this can forge CSRF tokens.

**Finding: Origin bypass for direct POSTs**  
`originAllowedForRequest()` returns `true` when both `origin` and `referer` headers are absent. This allows direct server-to-server (or crafted-client) POSTs to bypass CSRF entirely. While this is intentional for non-browser clients, it creates a gap: a browser-based XSS or local proxy can strip both headers.

### 3.2 Session Cookie Flow

| Step | File | Protection |
|---|---|---|
| **Creation** (login/signup) | `src/server/auth/auth-service.ts` | SHA-256 hash stored, raw token in cookie |
| **Cookie serialization** | `src/server/auth/session-cookie.ts` | `HttpOnly`, `SameSite=Lax`, `Secure`, `Max-Age=14d` |
| **Validation** (middleware) | `src/middleware.ts` | Checks cookie exists, no signature/expiry validation in middleware |
| **Resolution** (requireSession) | `src/server/auth/auth-service.ts` (resolveSessionFromRequest) | DB lookup by hash, checks active/revoked/expired/deleted |

**Finding: Middleware does not validate session integrity**  
The middleware only checks for cookie *presence*, not validity. Any non-empty `ll_session` cookie bypasses the login redirect. Actual session validation happens downstream in `requireSession`, so routes that don't call `requireSession` will accept any junk cookie without error.

### 3.3 File Upload Pipeline

| Step | Route | Auth | Validation |
|---|---|---|---|
| Token issue | POST `/api/uploads/create-token` | `requireSession` + CSRF ✓ | Zod schema via `uploadTokenIssueSchema` |
| Public intake | POST `/api/uploads/public-intake` | Token-based (no session) | Custom schema parse |
| Upload batch | POST `/api/uploads` | `requireSession` + CSRF ✓ | Custom schema parse |
| Complete upload | POST `/api/uploads/complete` | `requireSession` + CSRF ✓ | Custom schema parse |
| File validate | POST `/api/uploads/validate-file` | **NONE** ✗ | Custom schema parse |
| ZIP inspect | POST `/api/uploads/zip/inspect` | **NONE** ✗ | Custom schema parse |
| Admin manual | POST `/api/admin/uploads/manual` | `requireSession` + CSRF ✓ | Custom schema parse |

**Finding: Public intake passes untrusted organizationId**  
In `src/app/api/uploads/public-intake/route.ts` (line 17):
```typescript
organizationId: input.organizationId ?? 'resolved-from-token-after-database-lookup',
```
The code explicitly notes this `"must never trust organizationId/clientId/jobId from the client body"` but currently passes `input.organizationId` through to `buildUploadIntakePlan` without validation against the token.

**Finding: Two unauthenticated upload validation endpoints**  
`/api/uploads/validate-file` and `/api/uploads/zip/inspect` accept file metadata without any session or token check. While they don't persist data, they expose file validation logic and accept arbitrary input — potential information disclosure about allowed file types and limits.

### 3.4 Webhook Intake

#### Stripe Webhook

| Step | File | Verification |
|---|---|---|
| Payload receipt | POST `/api/stripe/webhook` | Reads raw text, checks `stripe-signature` header |
| Signature verification | `src/server/services/stripe-webhook-signature-service.ts` | HMAC-SHA256, timing-safe, 300s tolerance |
| Processing | `src/server/services/stripe-billing-orchestrator.ts` | Calls `verifyStripeWebhookSignature`, passes `verification.ok` flag |

**Finding: Processing occurs regardless of verification**  
The route handler (line 26):
```typescript
const plan = createStripeWebhookFulfillmentPlan(event, verification.ok);
```
The `verification.ok` flag is passed as a parameter, but `createStripeWebhookFulfillmentPlan` doesn't use it to block processing — it always returns a fulfillment plan. When `STRIPE_WEBHOOK_SECRET` is unset, verification fails with `ok: false`, but fulfillment still proceeds in dry-run.

**Finding: No deduplication or transactional processing**  
The route's own codex note (line 23+26) identifies that duplicate Stripe events (retries) must be deduped via `webhook_event_log` and processed within a `$transaction`. Currently neither is implemented — each POST creates a new fulfillment plan regardless of idempotency.

#### Gumroad Webhook

| Step | File | Verification |
|---|---|---|
| Payload receipt | POST `/api/gumroad/webhook` | Reads raw text, checks `x-gumroad-signature` / `gumroad-signature` / `x-signature` |
| Processing | `createGumroadWebhookProcessingPlan` in `gumroad-fulfillment-orchestrator.ts` | **Does NOT call `verifyGumroadWebhookSignature` at all** |

**Finding: Gumroad webhook signature is never verified**  
`createGumroadWebhookProcessingPlan` (lines 1–20) simply parses the body as JSON and returns a plan — it never invokes `verifyGumroadWebhookSignature`. The signature header is collected in the route but discarded. Any POST to `/api/gumroad/webhook` is processed blindly.

### 3.5 Email / SMS / Notification Sinks

| Route | Auth | Sink | Taint Path |
|---|---|---|---|
| POST `/api/delivery/jobs/[jobId]/send` | `requireSession` + CSRF | `sendDeliveryNotification` → `adapter.send()` (email) | Body → recipientEmail, recipientName, deliveryNotes → email body |
| POST `/api/delivery/jobs/[jobId]/email-preview` | `requireSession` + CSRF | `buildDeliveryEmailPreview` | Body → email subject/body construction |
| POST `/api/delivery/marketplace-message` | `requireSession` + CSRF | `buildMarketplaceMessagePreview` | Body → marketplace message |
| POST `/api/notifications/send-test` | `requireSession` + CSRF | `sendDeliveryNotification` | Body → arbitrary email (type, to, subject, bodyText) |
| POST `/api/delivery/links/create` | `requireSession` + CSRF | `issueDeliveryLinkDraft` | Body → delivery link creation |

**Finding: Email content includes unsanitized user input**  
The email template (`delivery-email-template-service.ts` line 15) includes `data.deliveryNotes` directly in the email body. While HTML-escaping is applied to the HTML version, the plain-text `bodyText` contains raw delivery notes. If delivery notes contain email injection characters (`\n`, `\r`, `Cc:`, `Bcc:`), the SMTP adapter could be vulnerable to header injection.

### 3.6 File System / ZIP Operations

| Route/Sink | Validation | Risk |
|---|---|---|
| `createDeliveryZip` → `zip.file()` | `assertSafeDeliveryRelativePath` | **Adequate** — path validation before adding to ZIP |
| `validateZipEntry` | Path normalization, zip slip detection, depth limits | **Adequate** — multi-layer validation |
| `buildUploadIntakePlan` → storageKey construction | Template string with orgId/jobId/fileName | **Low** — uses sanitized fileName |

---

## 4. Unsanitized Sink Inventory (Prioritized)

### CRITICAL Severity

| # | Sink | Source | Taint Path | Current Gate | Remediation |
|---|---|---|---|---|---|
| C1 | `guardedSession`/`guardedPost`/`guardedPatch`/`guardedGet` fallback to demo admin | All 91 routes using these helpers | Request headers → demo admin session | **None** — falls to synthetic admin | Replace with `requireSession` + real session resolution |
| C2 | `assertPermission` no-op | All 135+ routes calling it | Session → permission check | **None** — always returns void | Implement real RBAC enforcement |
| C3 | Gumroad webhook — no signature verification | `createGumroadWebhookProcessingPlan` | Webhook body → fulfillment plan | **None** | Call `verifyGumroadWebhookSignature` before processing |
| C4 | Stripe checkout routes — no auth | 5 checkout routes | Body → Stripe API call | **None** — no session check | Add `requireSession` or documented public-token gate |
| C5 | File storage routes — no auth | 3 file-storage mutation routes | Body → storage connection/folder/export | **None** | Add session auth and tenant scoping |

### HIGH Severity

| # | Sink | Source | Taint Path | Current Gate | Remediation |
|---|---|---|---|---|---|
| H1 | Stripe webhook fulfillment without verified signature | `createStripeWebhookFulfillmentPlan` | Unverified payload → fulfillment plan | Signature checked but not enforced | Gate fulfillment on `verification.ok === true` |
| H2 | CSRF `'changeme'` fallback for secret | `csrf-protection-service.ts` Line 121 | Unknown env → forged tokens | **None** in dev/test | Fail closed if no CSRF_SECRET configured |
| H3 | Public upload passes client-supplied organizationId | `/api/uploads/public-intake` route | Body → `buildUploadIntakePlan` | Token hash preview only | Resolve orgId from upload token, never from body |
| H4 | Auth signup acceptance of `requestAuthMeta` parameter mismatch | `/api/auth/signup` route | Calls `signup(body, requestAuthMeta(request))` but service signature only expects 1 param | Compiles but may fail at runtime | Fix function signature or remove extra arg |
| H5 | Middleware accepts any cookie value | `middleware.ts` | Any `ll_session=anything` bypasses redirect | Downstream `requireSession` validates | Add format/prefix validation in middleware |

### MEDIUM Severity

| # | Sink | Source | Taint Path | Current Gate | Remediation |
|---|---|---|---|---|---|
| M1 | Unauthenticated upload validation endpoints | `/api/uploads/validate-file`, `/api/uploads/zip/inspect` | Request body → file validation results | **None** | Add rate limiting and optional session binding |
| M2 | CSRF origin check allows null origin | `csrf-protection-service.ts` Line 58 | No origin/referer → bypass | Returns `true` for null | Require at least one header for non-GET requests |
| M3 | Email delivery notes in plaintext body | `delivery-email-template-service.ts` Line 15 | deliveryNotes → email bodyText | HTML escaped only | Strip control characters from plaintext, validate length |
| M4 | Schema validators use `as` type assertions | All custom schemas (upload, security-hardening, etc.) | Untrusted input → forced type | Minimal type guard | Replace with full Zod schemas |

### LOW Severity

| # | Sink | Source | Taint Path | Current Gate | Remediation |
|---|---|---|---|---|---|
| L1 | Delivery token resolve returns hardcoded data | `/api/delivery/token/resolve` | Token → hardcoded response | Schema validation only | Wire real database lookup |
| L2 | Resume session uses regex parsing on cookie | `session-cookie.ts` Line 48 | Cookie header → token match | Standard but fragile | Consider structured parser |

---

## 5. Trust Boundary Violations

### 5.1 No Trust Boundary Between Demo and Production

The `guardedSession`/`guardedPost`/`guardedPatch`/`guardedGet` helpers in `route-helpers.ts` were clearly designed as a development scaffolding but **share the same code path as production routes**. There is no flag, environment check, or build-time guard separating demo behavior from production behavior. Every route using these helpers is vulnerable in any environment.

### 5.2 RBAC Before Phase 4

`assertPermission` is documented as "Phase 3 placeholder — RBAC comes in Phase 4" but is wired into every protected route. The trust assumption that "routes won't be called without auth" is violated by the `guardedSession` fallback. Together, these two issues mean **every route in the application is effectively wide-open** regardless of the permission string passed.

### 5.3 Webhook Trust Assumption

The Gumroad webhook route collects a signature header but never verifies it — the orchestration service `createGumroadWebhookProcessingPlan` doesn't call `verifyGumroadWebhookSignature`. This assumes that either (a) the route codex note will add verification, or (b) the webhook is only called from trusted networks. In production, webhooks come from the public internet.

The Stripe webhook performs verification but doesn't gate processing on the result. The code is structured so that fulfillment decisions get the `verification.ok` boolean, but `createStripeWebhookFulfillmentPlan` ignores it.

### 5.4 Upload Token Trust Boundary

The public intake route `/api/uploads/public-intake` correctly uses a token-based model but currently passes `input.organizationId` from the request body directly into `buildUploadIntakePlan`. The codex note acknowledges this: *"This route must never trust organizationId/clientId/jobId from the client body."* These fields should be resolved server-side from the validated upload token.

---

## 6. Cross-Reference: Q2 CRITICAL/HIGH Findings

| Q2 Finding | Q3 Phase 4 Status | Verified |
|---|---|---|
| Missing RBAC enforcement → all routes wide open | **CONFIRMED** — `assertPermission` is a no-op, `guardedSession` falls to admin | ✓ |
| Upload validation gaps (zip slip, malicious files) | **PARTIALLY RESOLVED** — validation logic exists but is not enforced on public intake | ✓ |
| No tenant isolation on unauthenticated routes | **CONFIRMED** — file-storage, checkout, and upload routes accept untrusted organizationId | ✓ |
| Session cookie not validated in middleware | **CONFIRMED** — cookie just needs to exist, any value passes | ✓ |
| Missing CSRF on mutation endpoints | **PARTIALLY RESOLVED** — protection exists but uses `'changeme'` fallback and allows null-origin bypass | ✓ |
| Webhook signature enforcement absent | **CONFIRMED** — Gumroad: none; Stripe: verified but not enforced | ✓ |
| No rate limiting on sensitive routes | **CONFIRMED** — `SECURITY_RATE_LIMIT_POLICY_DRAFT` exists but no implementation | ✓ |

---

## 7. Remediation Priority

| Priority | Action | Affected Routes | Effort |
|---|---|---|---|
| **P0** | Remove `guardedSession`/`guardedPost`/`guardedPatch`/`guardedGet` fallback to demo admin — replace with `requireSession` | 91 routes | 2–4h |
| **P0** | Implement `assertPermission` with real RBAC checks | 135+ routes | 4–8h |
| **P0** | Add Gumroad webhook signature verification before processing | 1 route | 0.5h |
| **P0** | Gate Stripe webhook fulfillment on `verification.ok === true` | 1 route | 0.5h |
| **P1** | Add auth to file-storage mutation routes | 3 routes | 1h |
| **P1** | Add auth to Stripe checkout routes | 5 routes | 1h |
| **P1** | Fail CSRF hard when `CSRF_SECRET` unset | 1 service | 0.5h |
| **P1** | Resolve organizationId from upload token, not request body | 1 route | 1h |
| **P2** | Add rate limiting (config exists in domain, no wiring) | All sensitive routes | 2–4h |
| **P2** | Replace custom schema validators with full Zod schemas | All custom schemas | 2–3h |
| **P2** | Fix auth signup function signature mismatch | 1 route | 0.5h |
| **P2** | Add delivery notes sanitization for email plaintext | 1 service | 0.5h |

---

## 8. Summary

### Critical Issues (active exploit possible, no authentication required)

1. **91 routes bypassable to admin** — `guardedSession` falls back to synthetic admin session
2. **135+ routes with no permission enforcement** — `assertPermission` is a no-op
3. **Gumroad webhook processes unverified payloads** — signature is collected but never checked
4. **Stripe checkout creates sessions without auth** — 5 routes with zero authentication
5. **File storage mutations without auth** — 3 routes accept arbitrary organizationId

### High Issues (active exploit possible with minor constraints)

6. **Stripe webhook processes unverified payloads** — verification exists but is not enforced
7. **CSRF secret defaults to 'changeme'** — any environment without explicit config is forgeable
8. **Public upload passes client-asserted organizationId** — tenant isolation bypass through request body
9. **Middleware accepts any session cookie value** — no integrity check at edge

### The core finding

The `route-helpers.ts` scaffolding — designed for rapid development with demo sessions — was never replaced with production auth guards. Combined with the `assertPermission` no-op, the entire application's authorization layer is effectively absent. Any HTTP client can hit any route with admin privileges.
