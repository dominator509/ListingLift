# Subsystem Handoff Verification Report

## Q7 Phase 4 — Inter-Subsystem Integration Boundary Audit

---

### Executive Summary

| Boundary | Status | Verdict |
|---|---|---|
| 1. Auth → Billing | CRITICAL FAIL | No session validation on any checkout route |
| 2. Webhook → Order fulfillment | PASS with notes | Signatures verified; idempotency not wired |
| 3. Gateway → Payment | CRITICAL FAIL | All 5 checkout POST routes accept unauthenticated requests |
| 4. Auth → Listing management | CRITICAL FAIL | guardedPost/guardedPatch/guardedSession bypass auth entirely |
| 5. CSRF → Mutation routes | CONDITIONAL PASS | Core logic verified; middleware not wired into any mutation route |
| 6. Database → API boundary | PASS | Error mapping complete; no raw SQL; Zod validation at boundaries |

**Overall: BLOCKING — 3 critical handoff failures must be resolved before Phase 4 can close.**

---

### 1. Auth → Billing Boundary

**Files reviewed:**
- `src/app/api/auth/login/route.ts` — ✓ Requires session, creates session cookie
- `src/app/api/auth/session/route.ts` — ✓ Requires session via `requireSession`
- `src/app/api/auth/me/route.ts` — ✓ Requires session via `requireSession`
- `src/server/auth/auth-service.ts` — ✓ Session resolution from cookie via `ll_session`, SHA-256 hashed tokens
- `src/server/auth/route-utils.ts` — ✓ Cookie set with HttpOnly, SameSite=Lax, Secure, Max-Age=14d
- `src/server/auth/session-cookie.ts` — ✓ Cookie name `ll_session`, 48-byte random tokens via crypto.randomBytes

**Finding: CRITICAL — Checkout routes do not call requireSession().**
```
src/app/api/stripe/checkout/package/route.ts:7 — POST skips requireSession entirely
src/app/api/stripe/checkout/credits/route.ts:6 — POST skips requireSession entirely
src/app/api/stripe/checkout/subscription/route.ts:6 — POST skips requireSession entirely
src/app/api/stripe/checkout/retainer/route.ts — (same pattern)
src/app/api/stripe/checkout/agency/route.ts — (same pattern)
```

Every checkout route creates a Stripe checkout session using only body-provided values (`buyerEmail`, `metadata`, `packageKey`) — there is no session binding, no user/org identity flow from authentication into the billing subsystem. An unauthenticated caller can:
- Call `POST /api/stripe/checkout/package` without any cookie
- Inject arbitrary `buyerEmail` and `metadata`
- Attempt to create Stripe checkout sessions

**Finding: MODERATE — `createStripeCheckoutSession` does not accept a session parameter.**
The service function `createStripeCheckoutSession(input)` only takes the request body — it has no awareness of the authenticated user or organization. The metadata injection path (`sanitizeStripeMetadata`) sanitizes stripe metadata keys but does not inject or enforce the session user's identity.

**Verdict: BLOCKING — The auth→billing handoff is broken. Every checkout route must requireSession() and pass session.userId/session.organizationId into the checkout service.**

---

### 2. Webhook → Order Fulfillment Boundary

**Files reviewed:**
- `src/app/api/webhooks/stripe/route.ts` — Stripe webhook ingestion
- `src/app/api/webhooks/gumroad/route.ts` — Gumroad webhook ingestion (re-export from gumroad/webhook)
- `src/app/api/gumroad/webhook/route.ts` — Gumroad webhook route
- `src/server/services/stripe-webhook-signature-service.ts` — HMAC-SHA256 verification with tolerance
- `src/server/services/stripe-webhook-event-service.ts` — Processing draft construction
- `src/server/services/stripe-billing-orchestrator.ts` — Fulfillment plan
- `src/server/services/gumroad-fulfillment-orchestrator.ts` — Gumroad processing plan

**Finding: GOOD — Stripe webhook signature verification is solid.**
```
verifyStripeWebhookSignature:
  ├── Parses Stripe-Signature header (t=, v1=)
  ├── Computes expected HMAC-SHA256(timestamp.payload, webhookSecret)
  ├── Timing-safe comparison (crypto.timingSafeEqual)
  ├── Tolerance check (default 300s — prevents replay attacks)
  └── Returns { ok, eventId, eventType } or { ok: false, error }
```

**Finding: GOOD — Payment-gated access control.**
`createStripeWebhookProcessingDraft` correctly gates:
- `shouldGrantAccess` = `signatureVerified && paid` (checkout.session.completed or invoice.paid)
- `shouldCreateJob` = `signatureVerified && checkout.session.completed`
- `shouldDenyAccess` = failed OR not verified OR unsupported

**Finding: MINOR — No idempotency persistence wired.**
Both webhook routes have comments noting that `webhook_event_log` persistence and dedup must be wired transactionally. Without this, duplicate webhook events (Stripe retries) could create duplicate jobs. This is a pre-production gap, not a design flaw.

**Finding: MODERATE — Gumroad signature verification is not wired.**
The Gumroad webhook reads the signature header (`x-gumroad-signature`) but only passes it to `createGumroadWebhookProcessingPlan` which does not verify it — it just notes it as a placeholder. The `gumroad-webhook-signature-service.ts` exists but is not called.

**Verdict: PASS WITH NOTES.** Stripe side is production-ready. Gumroad needs signature verification wired. Idempotency persistence needed before production.

---

### 3. Gateway → Payment Boundary

**Files reviewed:**
- `src/app/api/stripe/checkout/package/route.ts`
- `src/app/api/stripe/checkout/credits/route.ts`
- `src/app/api/stripe/checkout/subscription/route.ts`
- `src/app/api/stripe/checkout/retainer/route.ts`
- `src/app/api/stripe/checkout/agency/route.ts`
- `src/server/services/stripe-checkout-service.ts`
- `src/server/adapters/payments/stripe-adapter.ts`

**Finding: CRITICAL — No authentication on any checkout gateway route.**
All 5 checkout POST routes follow the same pattern:
```typescript
export async function POST(request: Request) {
  const body = await parseJson(request, {});    // No session check
  const result = await createStripeCheckoutSession(...);
  return jsonOk(result);
}
```

**Finding: CRITICAL — No CSRF enforcement on checkout mutations.**
Since these are state-changing POST requests that create Stripe checkout sessions (which involve payment), they should be CSRF-protected. The `csrf-protection-service.ts` has `verifyCsrfForRequest` ready but no route calls it.

**Finding: CRITICAL — Price resolution uses untrusted input.**
`resolveStripePackagePrice` takes `packageKey` directly from the request body. While it resolves against `DEFAULT_PACKAGES` (validating existence), an unauthenticated caller can still trigger the resolution logic and attempt any package key.

**Verdict: BLOCKING.** All 5 checkout routes must:
1. Call `requireSession(request)` to validate authentication
2. Pass session `userId` and `organizationId` into checkout creation
3. Call `verifyCsrfForRequest(request, session)` for CSRF protection
4. Bind the authenticated user's email rather than accepting `buyerEmail` from body

---

### 4. Auth → Listing Management Boundary

**Files reviewed:**
- `src/server/routes/route-helpers.ts` — guardedPost, guardedPatch, guardedSession
- `src/app/api/jobs/route.ts` — Job CRUD using guardedPost
- `src/app/api/packages/route.ts` — Package route using guardedPost
- `src/app/api/admin/security/csrf/route.ts` — Uses guardedSession
- `tests/integration/listing-crud.test.ts` — Tenant isolation test

**Finding: CRITICAL — `guardedPost`, `guardedPatch`, and `guardedSession` bypass authentication.**
```typescript
// route-helpers.ts:42-45
const demo = extractDemoSession(request);
const session = demo ?? { userId: 'demo', organizationId: 'demo-org', role: 'admin' };
```
When no `x-demo-user-id` header is present, the guard falls back to a hardcoded **admin** session. This means any unauthenticated HTTP request to any route using these guards gets admin-level access.

**Routes affected (60+ files import route-helpers):**
- `GET /api/jobs` — Lists all jobs with admin view
- `POST /api/jobs` — Creates jobs as admin
- `POST /api/packages` — Creates/modifies packages
- `POST /api/admin/security/csrf` — Manages CSRF tokens (ironically)
- Plus many more in admin dashboard, marketplace-exports, etc.

The `guardedGet` helper is safe (it just runs the handler without passing a session), but `guardedPost`, `guardedPatch`, and `guardedSession` are all vulnerable.

**Finding: GOOD — Database-level tenant isolation is well-designed.**
```typescript
// tenant-filters.ts
tenantWhere(organizationId) → { organizationId, deletedAt: null }
assertSameTenant(recordOrgId, expectedOrgId) → throws on mismatch
```
The `assertSameTenant` function and `tenantWhere` helper exist. The test `tests/integration/listing-crud.test.ts` proves org isolation at the Prisma level (different orgs cannot see each other's jobs).

**Finding: MODERATE — Route handlers don't consistently enforce tenant scope.**
Many route handlers construct Prisma queries manually rather than using `tenantWhere()`, meaning if a handler accidentally omits the `organizationId` filter, data is visible across tenants. The DB-level guard works, but the route-level guard doesn't exist yet.

**Verdict: BLOCKING.** The `guardedPost`, `guardedPatch`, and `guardedSession` helpers must be rewritten to call `requireSession(request)` instead of falling back to a demo session. All routes using these helpers are currently wide open.

---

### 5. CSRF → Mutation Routes Boundary

**Files reviewed:**
- `src/server/services/csrf-protection-service.ts` — Token generation, verification, origin validation
- `src/app/api/csrf/token/route.ts` — CSRF token endpoint
- `src/lib/api-response.ts` — mapServiceError

**Finding: GOOD — CSRF token generation is cryptographically sound.**
```
generateCsrfToken(session):
  └── payload = `${userId}:${organizationId}:${csrfSecret}:${expiresAt}`
  └── signature = SHA-256(payload).substring(0, 32)
  └── nonce = SHA-256(Date.now + random).substring(0, 16)
  └── token = `${nonce}.${expiresAt}.${signature}`
```

**Finding: GOOD — CSRF verification is comprehensive.**
```
verifyCsrfForRequest(request, session):
  ├── LAYER 0: Skip safe methods (GET, HEAD, OPTIONS)
  ├── LAYER 1: Origin/Referer validation against ALLOWED_ORIGINS env
  ├── LAYER 2: Token presence check → CSRF_TOKEN_MISSING
  ├── LAYER 3: Format check (3 parts) → CSRF_TOKEN_MALFORMED
  ├── LAYER 4: Timing-safe HMAC comparison → CSRF_TOKEN_INVALID
  └── LAYER 5: Expiration check (30-min window) → CSRF_TOKEN_EXPIRED
```

**Finding: GOOD — Error codes properly mapped.**
`mapServiceError` maps all 5 CSRF rejection codes to 403 Forbidden.

**Finding: CONCERN — CSRF verification is not wired into any mutation route.**
The `verifyCsrfForRequest` function exists but is not imported or called by any route handler. Every POST/PATCH/DELETE handler in the codebase is currently CSRF-blind. The `POST /api/csrf/token` endpoint correctly requires a session, so tokens can be obtained, but no route enforces them.

**Verdict: CONDITIONAL PASS.** The CSRF infrastructure is production-ready. All mutation routes must be updated to call `verifyCsrfForRequest(request, session)` at the start of each handler. This is a wiring task, not a redesign.

---

### 6. Database → API Boundary

**Files reviewed:**
- `src/lib/api-response.ts` — mapServiceError
- `src/server/auth/route-utils.ts` — authError
- `src/server/database/tenant-filters.ts` — tenantWhere, assertSameTenant
- `src/server/database/prisma-repository-contracts.ts` — RepositoryContext
- `src/schemas/` — Zod validation schemas

**Finding: GOOD — Known error codes mapped to correct HTTP statuses.**
```
mapServiceError:
  CSRF_* (5 codes)      → 403 Forbidden
  SESSION_REQUIRED       → 401 Unauthorized
  FORBIDDEN             → 403 Forbidden
  NOT_FOUND             → 404 Not Found
  CONFLICT              → 409 Conflict
  VALIDATION_ERROR      → 422 Unprocessable Entity
  RATE_LIMITED          → 429 Too Many Requests
  Unhandled             → 500 Internal Server Error

authError:
  rate_limited           → 429
  invalid_credentials    → 401
  authentication required → 401
  permission denied      → 403
  Unknown               → fallbackStatus (default 400)
```

**Finding: GOOD — No raw SQL injection vectors.**
All database queries use the Prisma ORM with parameterized queries. No `$queryRaw`, `$executeRawUnsafe`, or string-concatenated SQL was found in the route or service files scanned.

**Finding: GOOD — Zod validation at all service boundaries.**
Every service entry point validates inputs via `zod` schemas:
- `loginSchema` for auth
- `stripeCheckoutRequestSchema` for checkout
- `stripeWebhookEventSchema` for webhooks
- `csrfTokenDraftSchema` for CSRF
- `adminJobQueueFilterSchema` for job queries
- `manualJobCreateSchema` for job creation

**Finding: GOOD — Repository pattern scaffolding exists.**
`PrismaRepositoryContracts` defines required and tenant-critical models. `RepositoryContext` enforces `organizationId` presence at the service level.

**Finding: MINOR — Services bypass repository layer.**
Most routes call `prisma.job.create/findMany/...` directly rather than going through `RepositoryContext`. The contract definitions exist but are not enforced by any middleware or wrapper.

**Verdict: PASS.** Error propagation is well-designed. Zod schemas at boundaries prevent malformed data from reaching the database. No SQL injection risk. Repository layer needs enforcement wiring but the scaffolding is in place.

---

### Remediation Priority

| Priority | Issue | Affected Files | Effort |
|---|---|---|---|
| P0 | `guardedPost/guardedPatch/guardedSession` use hardcoded admin session | `route-helpers.ts` + 60+ routes | High — rewrite helpers to call requireSession |
| P0 | Checkout routes skip auth entirely | 5 stripe checkout routes | Low — add requireSession + CSRF to each |
| P1 | No mutation route calls verifyCsrfForRequest | All POST/PATCH/DELETE routes | Medium — add middleware call to route-helpers or each handler |
| P2 | Gumroad webhook signature not verified | `gumroad-fulfillment-orchestrator.ts` | Low — wire existing signature service |
| P2 | No idempotency for webhook events | Both webhook routes | Medium — create webhook_event_log table + upsert logic |
| P3 | Route handlers bypass repository layer | Most route.ts files | Large — refactor to use RepositoryContext |
