# CHAOS TARGET MAP — Heuristic Weak-Point Mapping

> **Phase:** Q2 PHASE 1 — Chaos Engineer  
> **Scope:** Full codebase survey across 21 API routes, 5 services, 3 auth layers, 2 external integrations  
> **Directive:** Document every attack surface, failure mode, and weak point. Do NOT fix — only map.

---

## 1. INPUT BOUNDARY FINDINGS

### I-01: Weak Type Assertions in Schema Parsers — No Runtime Validation
**Tag:** `INPUT_BOUNDARY`  
**Severity:** HIGH  
**Location:** `/schemas/*.ts` — all custom `.parse()` implementations  
**Vector:** Every schema in `upload.ts`, `security-hardening.ts`, `stripe-billing.ts`, `manual-approval.ts`, `delivery-packaging.ts`, `preview.ts`, `quality-control.ts`, `delivery-notification.ts` uses raw `as` cast assertions (e.g. `input.organizationId as string | undefined`).  
**Failure mode:** These are TypeScript compile-time casts with zero runtime validation. Any caller can pass `organizationId: 12345` (a number), `organizationId: {}` (an object), or `organizationId: null` — the cast silently passes and downstream code receives garbage types, leading to cryptic runtime errors, DB constraint violations, or injection surfaces.  
**Expected impact:** Data corruption, type confusion, unhandled crashes when downstream code expects a string but receives a non-string.

---

### I-02: Path Traversal in Upload Storage Key Construction
**Tag:** `INPUT_BOUNDARY`  
**Severity:** CRITICAL  
**Location:** `src/server/services/upload-intake-service.ts` lines 33–36  
**Vector:** The storage key is built from client-supplied `file.fileName` without sanitization:  
```ts
storageKey: `/originals/${input.organizationId}/${input.jobId ?? '__new__'}/${file.fileName}`
```
**Failure mode:** A file named `../../../etc/passwd` or `../../config/.env` walks the directory tree outside the intended storage bucket. Combined with the fact that `normalizeFile` accepts both `fileName` and legacy `name` fields, an attacker controls the final path segment precisely.  
**Expected impact:** Arbitrary file overwrite, config leakage, server compromise.

---

### I-03: Malformed JSON Silent Squelch via parseJson Fallback
**Tag:** `INPUT_BOUNDARY`  
**Severity:** MEDIUM  
**Location:** `src/server/routes/route-helpers.ts` lines 16–24  
**Vector:** `parseJson<T>(request, {})` catches JSON.parse errors and returns the caller's fallback (almost always `{}`).  
**Failure mode:** Send `POST /api/uploads` with body `{"organizationId": ` (truncated JSON). Instead of a clean 400 error, the route silently receives `{}`, which then passes through schema parsing where it may produce a confusing downstream error or — worse — pass with undefined values that get coerced.  
**Expected impact:** Confusing error messages, state corruption if undefined values are persisted.

---

### I-04: Unbounded Array in Sales Channel Batch Import
**Tag:** `INPUT_BOUNDARY`  
**Severity:** MEDIUM  
**Location:** `src/app/api/sales-channels/import/route.ts` line 15  
**Vector:** The endpoint accepts `body.orders` (type `Record<string, unknown>[]`) with no size limit.  
**Failure mode:** An attacker submits 1M+ orders in a single request. The server iterates in a for-loop, parsing each schema, performing lookups and building plans. Memory exhaustion and/or DB connection pool starvation.  
**Expected impact:** Denial of service, OOM crash, connection pool exhaustion.

---

### I-05: CSRF Nonce Uses Math.random() — Predictable Token Component
**Tag:** `INPUT_BOUNDARY`  
**Severity:** MEDIUM  
**Location:** `src/server/services/csrf-protection-service.ts` line 91  
**Vector:** The nonce in `generateCsrfToken` uses `Math.random()` for its entropy:  
```ts
const nonce = createHash('sha256').update(`${Date.now()}:${Math.random()}`).digest('hex').substring(0, 16);
```
**Failure mode:** `Math.random()` is not cryptographically secure. An attacker who can observe multiple CSRF tokens can narrow the seed space and predict future tokens. Combined with timing analysis on the HMAC comparison (mitigated by `timingSafeEqual` elsewhere, but not here — `generateCsrfToken` uses a different code path than `verifyCsrfForRequest`), this enables CSRF bypass.  
**Expected impact:** CSRF token forgery, cross-site request forgery bypass.

---

### I-06: Upload Token Exposed in Query String
**Tag:** `INPUT_BOUNDARY`  
**Severity:** HIGH  
**Location:** `src/server/services/upload-token-service.ts` line 34  
**Vector:** The generated upload URL places the raw token in a query parameter:  
```ts
uploadUrl: `/api/uploads/upload?token=${rawToken}`
```
**Failure mode:** Query strings are logged by almost every reverse proxy, CDN, and application server. They appear in browser history, referrer headers, and server access logs. The raw token (64 chars of base64url entropy) is treated as a bearer credential but transmitted in a location that is routinely logged and exposed.  
**Expected impact:** Token theft, unauthorized uploads, data exfiltration.

---

## 2. STATE TRANSITION FINDINGS

### S-01: X-Demo-* Headers Bypass All Authentication
**Tag:** `STATE_TRANSITION`  
**Severity:** CRITICAL  
**Location:** `src/server/routes/route-helpers.ts` lines 5–14, 37–69  
**Vector:** `extractDemoSession` reads `x-demo-user-id`, `x-demo-organization-id`, `x-demo-role` from request headers. If present, these completely bypass real session resolution. The fallback session `{ userId: 'demo', organizationId: 'demo-org', role: 'admin' }` is used when no demo headers exist.  
**Failure mode:** `guardedPost`, `guardedPatch`, and `guardedSession` wrappers use `extractDemoSession` BEFORE `requireSession`. Any client (including unauthenticated ones) can set `x-demo-role: admin` and gain full admin access. This code path is active in `import/route.ts`, `manual-order/route.ts`, `external-orders/route.ts`, and any route using these guards.  
**Expected impact:** Complete authentication bypass, privilege escalation to admin, full data access.

---

### S-02: Auth Session Rotation Not Enforced — No Old Session Invalidation
**Tag:** `STATE_TRANSITION`  
**Severity:** MEDIUM  
**Location:** `src/server/auth/auth-service.ts` — `signup()` and `login()`  
**Vector:** On both signup and login, a new session is created but no prior sessions are invalidated or rotated.  
**Failure mode:** A user can accumulate unlimited active sessions. If a session token is stolen, the attacker retains access indefinitely — the legitimate user cannot force the attacker out without a password change. No session limit exists.  
**Expected impact:** Session hijacking persistence, inability to revoke stolen sessions.

---

### S-03: Password Change Does Not Invalidate Existing Sessions
**Tag:** `STATE_TRANSITION`  
**Severity:** MEDIUM  
**Location:** `src/server/services/account-service.ts` — `updateAccountSettings()`  
**Vector:** When a user changes their password, no existing sessions are revoked.  
**Failure mode:** An attacker who has stolen a session token retains access even after the victim changes their password. The old session remains valid until token expiry (14 days).  
**Expected impact:** Post-breach persistence, compromised account recovery failure.

---

### S-04: In-Memory Rate Limiter — Per-Instance Counters
**Tag:** `STATE_TRANSITION`  
**Severity:** HIGH  
**Location:** `src/server/auth/rate-limit.ts` lines 1–8, 11  
**Vector:** The auth rate limiter uses an in-memory `Map<string, Bucket>`. The file itself documents this: "This in-memory Map rate limiter is not shared across horizontally-scaled instances."  
**Failure mode:** With N instances, an attacker can make N × 5 login attempts per 15-minute window instead of 5. No shared state means each instance independently resets its window. On even 3 instances, an attacker gets 15 attempts per window instead of 5.  
**Expected impact:** Brute-force password attacks bypass rate limiting, account takeover.

---

### S-05: Stripe Webhook Unverified Events Still Enter Processing Pipeline
**Tag:** `STATE_TRANSITION`  
**Severity:** HIGH  
**Location:** `src/app/api/stripe/webhook/route.ts` lines 8–28  
**Vector:** The webhook route parses the event from JSON and calls `createStripeWebhookFulfillmentPlan(event, verification.ok)` regardless of verification result. The plan carries `verified: false` but still returns a structured plan.  
**Failure mode:** When `STRIPE_WEBHOOK_SECRET` is unconfigured (empty string from env.ts), verification returns `{ ok: false, error: 'Stripe webhook secret is not configured.' }`. Despite this, the route still returns a fulfillment plan — it's just flagged as unverified. Downstream code (which is a placeholder) could process unverified events if wired without an explicit verification gate check.  
**Expected impact:** Fake Stripe events triggering real order fulfillment, financial fraud.

---

## 3. CONCURRENCY FINDINGS

### C-01: Upload Token Usage Race Condition — No DB Lock
**Tag:** `CONCURRENCY`  
**Severity:** HIGH  
**Location:** `src/server/services/upload-token-service.ts` lines 64–82  
**Vector:** `validateUploadTokenRecord` is a pure synchronous function. It reads `record.usedAt`, `record.revokedAt`, and `record.expiresAt` from an in-memory `UploadTokenRecord` interface — but in production, these come from the database. There is no transaction, row lock, or atomic update.  
**Failure mode:** Two concurrent requests arrive with the same valid token. Both call `validateUploadTokenRecord` before either marks the token as used. Both pass validation. Both proceed to upload files. The token is consumed twice.  
**Expected impact:** Double-upload, storage over-quota, authorization bypass for file intake.

---

### C-02: Job State Machine — No Optimistic Locking
**Tag:** `CONCURRENCY`  
**Severity:** MEDIUM  
**Location:** All job state transition routes  
**Vector:** The `Job` model defines 15 states but has no `version` field, `updatedAt` comparison, or database-level lock for state transitions.  
**Failure mode:** Two admin users simultaneously approve and reject the same job. Both updates read the current state, both compute the new state independently, both write — the last write wins, silently overwriting the other admin's decision. No conflict detection.  
**Expected impact:** Silent state corruption, lost decisions, approval gate bypass.

---

### C-03: External Order Deduplication Race
**Tag:** `CONCURRENCY`  
**Severity:** MEDIUM  
**Location:** `src/app/api/sales-channels/manual-order/route.ts`  
**Vector:** Duplicate detection uses a unique constraint `@@unique([salesChannelId, externalOrderId])` which is enforced at the DB level. However, the application code does not use a transactional `find-or-create` pattern with proper isolation.  
**Failure mode:** Two concurrent requests with the same external order ID: both check for existence (application level), neither finds a match, both proceed to insert. One succeeds, the other fails with a unique constraint violation — but the second may have already performed side effects (client upsert, audit log) outside the transaction.  
**Expected impact:** Orphaned side effects, partial state, confusing 409 errors with committed mutations.

---

### C-04: Bulk Review/Approval Without Transaction Wrap
**Tag:** `CONCURRENCY`  
**Severity:** MEDIUM  
**Location:** `src/app/api/quality-control/bulk-review/route.ts`, `src/app/api/previews/bulk-approval/route.ts`  
**Vector:** Both endpoints process arrays of items sequentially but return a single response. No explicit transaction wraps the batch.  
**Failure mode:** A bulk approval of 50 items: items 1–30 succeed (DB writes), item 31 fails (constraint violation). The API returns an error, but items 1–30 are already committed. The caller doesn't know which items in the batch were applied. Manual reconciliation required.  
**Expected impact:** Partial batch application, inconsistent state, data reconciliation burden.

---

## 4. EXTERNAL DEPENDENCY FINDINGS

### E-01: Hardcoded Dev Secrets — Production Deployment Risk
**Tag:** `EXTERNAL`  
**Severity:** CRITICAL  
**Location:** `src/lib/env.ts` lines 4–8  
**Vector:** Default (fallback) values for crypto secrets are hardcoded in the codebase:  
- `SESSION_SECRET: 'dev-secret-min-32-chars-long!!!!!!!!!!'`  
- `ENCRYPTION_KEY: 'dev-encryption-key-16'`  
- `CSRF_SECRET: 'dev-csrf-secret'` (falls back to SESSION_SECRET)  
**Failure mode:** If any production deployment omits setting environment variables, the code silently falls back to these known development secrets. Anyone with read access to the codebase (open source contributors, leaked repo) can forge session tokens, decrypt encrypted secrets, and forge CSRF tokens.  
**Expected impact:** Complete authentication bypass, session forgery, secret decryption, CSRF bypass.

---

### E-02: Stripe Webhook Secret Fallback to Empty String
**Tag:** `EXTERNAL`  
**Severity:** HIGH  
**Location:** `src/lib/env.ts` line 11, `src/app/api/stripe/webhook/route.ts` lines 10–13  
**Vector:** `STRIPE_WEBHOOK_SECRET` defaults to `''`. The webhook route checks `env.STRIPE_WEBHOOK_SECRET ? verifyStripeWebhookSignature(...) : { ok: false, error: '...' }`.  
**Failure mode:** When the webhook secret is not configured, the route still parses the event body and returns a fulfillment plan — just with `verified: false`. No 401/403 response is returned. An attacker can send fake Stripe events and get them processed through the pipeline (once persistence is wired).  
**Expected impact:** Fake webhook processing leading to unauthorized order fulfillment.

---

### E-03: Prisma Connection Pool — Default Configuration, No Limits
**Tag:** `EXTERNAL`  
**Severity:** MEDIUM  
**Location:** `src/lib/prisma.ts` lines 11–19  
**Vector:** The `pg.Pool` is created with only host/port/database/user/password. No `max`, `idleTimeoutMillis`, `connectionTimeoutMillis`, or `maxUses` are set.  
**Failure mode:** Under load, the pool uses the pg driver default (typically 10 connections). Combined with long-running queries or slow webhook processing, the pool can exhaust. No connection timeout means a dead database causes all pool consumers to hang indefinitely.  
**Expected impact:** Connection pool starvation, request timeouts, cascading service failure.

---

### E-04: Single Global Boolean for Real Integrations
**Tag:** `EXTERNAL`  
**Severity:** LOW  
**Location:** `src/lib/env.ts` line 13  
**Vector:** `REAL_INTEGRATIONS_ENABLED: process.env.REAL_INTEGRATIONS_ENABLED === 'true'` — one flag controls ALL external provider integrations.  
**Failure mode:** Once this flag is flipped, ALL adapters (Stripe, Gumroad, file storage, image providers) switch from mock to real. There is no per-provider granularity. A misconfigured single provider (e.g., missing service account) could crash the whole pipeline even though other providers are properly configured.  
**Expected impact:** Single-provider misconfiguration blocks all real integrations.

---

## 5. ERROR BOUNDARY FINDINGS

### R-01: Guard Wrappers in route-helpers.ts Have No Error Handling
**Tag:** `ERROR`  
**Severity:** HIGH  
**Location:** `src/server/routes/route-helpers.ts` — `guardedGet()`, `guardedPost()`, `guardedPatch()`, `guardedSession()`  
**Vector:** None of these four wrapper functions have try/catch blocks. The handler function is invoked directly: `const data = await handler(session)`.  
**Failure mode:** Any error thrown inside a handler wrapped by these guards — including database connection failures, Zod validation errors, or null-pointer dereferences — becomes an unhandled promise rejection. In Node.js, unhandled promise rejections crash the process (or warn in newer versions, but may become future crashes). This affects ALL routes that use these guard helpers.  
**Expected impact:** Process crash on any handler error, denial of service.

---

### R-02: Zod Validation Errors Not Mapped to 422
**Tag:** `ERROR`  
**Severity:** MEDIUM  
**Location:** `src/lib/api-response.ts` — `mapServiceError()`, lines 11–25  
**Vector:** The error mapper checks for known error codes (`SESSION_REQUIRED`, `FORBIDDEN`, `CONFLICT`, etc.) but does NOT check for `ZodError` instances.  
**Failure mode:** Route handlers using Zod schemas (auth.ts signupSchema, loginSchema) that throw `ZodError` will not match any `if (code === ...)` branch. The error falls through to `console.error` and returns a generic 500. A simple validation error (e.g., missing email) returns `INTERNAL_SERVER_ERROR` instead of `VALIDATION_ERROR`/422.  
**Expected impact:** Misleading 500 responses for basic validation failures, debugging difficulty.

---

### R-03: No Request Body Size Limits on Any Route
**Tag:** `ERROR`  
**Severity:** MEDIUM  
**Location:** All POST/PUT/PATCH route handlers  
**Vector:** No route enforces `content-length` checks, body size limits, or streaming limits.  
**Failure mode:** An attacker sends `POST /api/sales-channels/import` with a 2GB JSON payload. The server buffers the entire body in memory via `request.text()` or `request.json()`, consuming all available RAM. Node.js has no built-in body size limit (unlike Express's `body-parser` with `limit` option).  
**Expected impact:** Memory exhaustion DoS, process crash, server unavailability.

---

### R-04: Stripe Webhook Payload Parsed Twice (Text + JSON)
**Tag:** `ERROR`  
**Severity:** LOW  
**Location:** `src/app/api/stripe/webhook/route.ts` lines 8–20  
**Vector:** `request.text()` is called for signature verification, then `JSON.parse(payload)` is called again for the event schema.  
**Failure mode:** If the payload is very large, it is read into memory once for the text call, stored in a variable, then parsed again. Duplicate memory usage. More importantly, if the body is not JSON (but the route says it must be), `JSON.parse` throws, but the error is caught only by the explicit try/catch that returns a clean 400. However, `request.text()` for webhook payloads that are streamed could read partial data if the body hasn't finished arriving.  
**Expected impact:** Minor memory waste; minimal real risk since Stripe always sends valid JSON.

---

### R-05: Audit Log IP Address Always Null
**Tag:** `ERROR`  
**Severity:** LOW  
**Location:** Multiple services — `signup()`, `login()`, `logout()`, `updateAccountSettings()`  
**Vector:** All audit log entries pass `ipAddress: null`.  
**Failure mode:** Incident responders investigating a breach cannot trace actions back to source IP addresses. Whether the action was performed from the office VPN, a home network, or a Tor exit node is impossible to determine.  
**Expected impact:** Reduced forensic capability for security incidents.

---

## 6. SUMMARY — CRITICAL PATH ITEMS

| Rank | ID | Surface | Severity | Fix Priority |
|------|----|---------|----------|-------------|
| 1 | S-01 | Demo headers bypass auth | CRITICAL | **IMMEDIATE** — Remove or feature-flag `extractDemoSession` in production |
| 2 | E-01 | Hardcoded dev secrets | CRITICAL | **IMMEDIATE** — Fail hard on missing env vars in production |
| 3 | I-02 | Path traversal in storage keys | CRITICAL | **IMMEDIATE** — Sanitize file names for `../` and null bytes |
| 4 | I-06 | Upload token in query string | HIGH | **HIGH** — Use POST body or header for token transmission |
| 5 | C-01 | Upload token race condition | HIGH | **HIGH** — Add atomic `UPDATE ... WHERE usedAt IS NULL` |
| 6 | R-01 | Guard wrappers no error handling | HIGH | **HIGH** — Wrap handlers in try/catch |
| 7 | S-05 | Unverified webhook processing | HIGH | **HIGH** — Return 401 on failed verification |
| 8 | E-02 | Stripe webhook secret empty default | HIGH | **HIGH** — Fail on missing webhook secret |
| 9 | S-04 | In-memory rate limiter per-instance | HIGH | **HIGH** — Replace with Redis-backed limiter |
| 10 | I-01 | Weak type assertions in schemas | HIGH | **HIGH** — Replace `as` casts with Zod validation |

---

*Mapped by Ip Man — Q2 Phase 1, Chaos Engineer survey. 25 findings across 5 surface categories.*
