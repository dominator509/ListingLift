# Q2 PHASE 1 — CHAOS TARGET MAP
## Heuristic Weak-Point Mapping (Chaos Engineer)

Adversarial survey of every attack surface, failure mode, and weak point across the ListingLift codebase. Findings are documented — not fixed.

---

## INPUT_BOUNDARY

### IB-01 [CRITICAL] Demo Session Header Bypass
**Attack vector:** Send `x-demo-user-id`, `x-demo-organization-id`, `x-demo-role` request headers.
**Expected failure:** `guardedGet`, `guardedPost`, `guardedPatch`, and `guardedSession` in `src/server/routes/route-helpers.ts` accept these headers to impersonate any user/role without any authentication or signature. Any request with these headers bypasses real auth entirely. The fallback when headers are absent sets the user to `{ userId: 'demo', organizationId: 'demo-org', role: 'admin' }` — meaning no auth required at all for these wrappers.

### IB-02 [HIGH] Upload Schema Uses Raw Type Assertions (No Zod Validation)
**Attack vector:** Submit malformed types to upload endpoints.
**Expected failure:** `src/schemas/upload.ts` uses bare `as` casts instead of Zod `.parse()`: `input.files as Array<...>`, `input.token as string`, etc. A non-object, null, or type-mismatched payload passes silently and propagates undefined/NaN values into downstream logic.

### IB-03 [HIGH] Path Traversal via File Name in Storage Key
**Attack vector:** Submit a file with `fileName: "../../etc/passwd"` or `fileName: "../../../malicious/script.sh"`.
**Expected failure:** `buildUploadIntakePlan` in `src/server/services/upload-intake-service.ts` concatenates `file.fileName` directly into `storageKey: /originals/${organizationId}/${jobId}/${file.fileName}` with no path normalization or traversal rejection. An attacker can write files outside the intended directory.

### IB-04 [MEDIUM] parseJson Silently Swallows Malformed Payloads
**Attack vector:** Send malformed JSON (garbage bytes, truncated JSON, encoding attacks).
**Expected failure:** `parseJson<T>` in `src/server/routes/route-helpers.ts` catches all JSON parse errors and returns `fallback` (often `{}`) with zero logging. Downstream code receives an empty object as if the payload was valid. No visibility for operators.

### IB-05 [MEDIUM] Sales Channel Payload Passthrough Without Sanitization
**Attack vector:** Inject nested objects or unexpected types into `payload` field of a manual order or import.
**Expected failure:** `src/app/api/external-orders/route.ts` line 26 — `payload: body.payload && typeof body.payload === 'object' ? body.payload : body` and `src/app/api/sales-channels/manual-order/route.ts` line 22 — same pattern. The raw user payload is passed directly into the normalization plan without field-level validation, allowing injection of arbitrary data into downstream processing.

### IB-06 [MEDIUM] Upload Schemas Accept Non-Object Without Error
**Attack vector:** Send `null`, a string, or a number as request body to upload endpoints.
**Expected failure:** `uploadTokenIssueSchema.parse`, `uploadBatchIntakeRequestSchema.parse`, `uploadCompleteRequestSchema.parse` all check `typeof input !== 'object'` but `typeof null === 'object'` in JavaScript. Null passes the check, causing cascading `Cannot read properties of null` errors or silent undefined propagation. `uploadTokenIssueSchema` also has a typo in `allowedMimeTypes` (should be `allowedMimeTypes`).

### IB-07 [MEDIUM] Missing File Size Upper-Bound Validation
**Attack vector:** Submit a single file of several GB or a file with `sizeBytes: NaN` or `sizeBytes: -1`.
**Expected failure:** `buildUploadIntakePlan` accepts any numeric value for `sizeBytes` with no max-size enforcement. NaN propagates through `files.reduce((sum, f) => sum + f.sizeBytes, 0)` producing NaN totalSize. Negative values could overflow downstream allocation logic.

### IB-08 [LOW] Upload Token Exposed in Query String
**Attack vector:** Server-side logs, referrer headers, or browser history capture the upload URL.
**Expected failure:** `buildUploadTokenIssuePlan` returns `uploadUrl: /api/uploads/upload?token=${rawToken}` — the token is in a URL query parameter, which gets logged by proxies, browsers, and server access logs. The token itself is a base64url string with no additional entropy beyond the 32 random bytes.

---

## STATE_TRANSITION

### ST-01 [HIGH] No Idempotency on Upload Complete
**Attack vector:** Repeatedly POST to `/api/uploads/complete` with the same token.
**Expected failure:** The route calls `buildUploadIntakePlan` but does not check if the batch was already completed. The token service checks `usedAt`/`revokedAt` but there is no DB transaction that atomically marks the token as used and creates records — the actual persistence is deferred (noted as codexNote). Without atomicity, duplicates are created.

### ST-02 [MEDIUM] Approval/Review Routes Lack Idempotency
**Attack vector:** Double-submit approval or review decisions.
**Expected failure:** `POST /api/jobs/[jobId]/approval`, `POST /api/quality-control/outputs/[processedFileId]/review`, and `POST /api/quality-control/outputs/[processedFileId]/flag` all create new records on every POST with no idempotency key or duplicate check. Network retries cause duplicate approvals or review entries.

### ST-03 [MEDIUM] Upload Complete Uses Intake Plan Instead of Completion Flow
**Attack vector:** State confusion — what is the difference between intake and completion?
**Expected failure:** `POST /api/uploads/complete/route.ts` calls `buildUploadIntakePlan` (the same function used by intake) instead of a dedicated completion flow that marks tokens as used, stores files, and transitions job status. This means intake and completion are semantically identical, making it impossible to distinguish between "planned to upload" and "finished uploading."

### ST-04 [LOW] Approval GET Handler Requires CSRF Token
**Attack vector:** GET requests to approval routes.
**Expected failure:** `GET /api/jobs/[jobId]/approval` calls `verifyCsrfForRequest`, but CSRF verification is automatically skipped for GET/HEAD/OPTIONS in the `verifyCsrfForRequest` function. This is harmless but confusing — GET should not need CSRF and the route design implies it does.

---

## CONCURRENCY

### CC-01 [HIGH] Rate Limiter Is In-Memory Map (Not Shared Across Instances)
**Attack vector:** Scale horizontally to N instances and send N× the rate limit threshold.
**Expected failure:** `src/server/auth/rate-limit.ts` explicitly documents this: "This in-memory Map rate limiter is not shared across horizontally-scaled instances." Each instance has independent counters. An attacker multiplies the effective limit by the number of instances. Simple auth brute-force bypasses per-instance limits.

### CC-02 [HIGH] No Database-Level Locking on Token Consumption
**Attack vector:** Send multiple concurrent requests using the same upload token.
**Expected failure:** `validateUploadTokenRecord` checks `usedAt`/`revokedAt` after reading the record, but the check-then-act pattern has no database lock (SELECT...FOR UPDATE or optimistic lock). Two concurrent requests can both pass validation and proceed to create duplicate records. The actual persistence is deferred (codexNote) making this a guaranteed race condition when wired.

### CC-03 [MEDIUM] Auth Signup Transaction Creates Session Without User ID Checks
**Attack vector:** Not strictly concurrency, but the signup flow uses `{ where: { key: 'CLIENT_OWNER' } }` upsert — if two signups happen concurrently with the same org name, slug generation uses `Date.now()` with ms precision combined with org name normalization. Two signups within 1ms could produce identical slugs.
**Expected failure:** Slug collision on concurrent signup with same organization name within the same millisecond. Prisma unique constraint violation.

### CC-04 [LOW] Batch Import Processes Orders Sequentially
**Attack vector:** Not a vulnerability, but a scalability concern.
**Expected failure:** `POST /api/sales-channels/import` loops through orders with `for...of` + `await` per iteration. No Promise.all or batch parallelism. Large CSV imports are O(n) sequential latency.

---

## EXTERNAL

### EX-01 [CRITICAL] Stripe Webhook — No Actual Idempotency or Dedup
**Attack vector:** Stripe sends duplicate webhook events (standard retry behavior).
**Expected failure:** The webhook handler at `src/app/api/stripe/webhook/route.ts` has a codexNote stating "Idempotency gate: duplicate events must be recorded in webhook_event_log and skipped on replay" — but no actual implementation exists. Every retry from Stripe results in duplicate fulfillment attempts. For `checkout.session.completed`, this means charging the customer twice or fulfilling the same order twice.

### EX-02 [CRITICAL] Gumroad Webhook — No Signature Verification
**Attack vector:** Send arbitrary POST requests to Gumroad webhook endpoint.
**Expected failure:** `src/server/services/gumroad-fulfillment-orchestrator.ts` places raw `payloadText` content into a plan with no signature verification at all. Anyone who knows the Gumroad webhook URL can forge sale events, triggering free fulfillment without payment. The `dryRun: true` default limits blast radius currently but the guard is just a flag that can be toggled.

### EX-03 [CRITICAL] Stripe Webhook Processes Without Verified Signature When Secret Missing
**Attack vector:** Send forged Stripe events when STRIPE_WEBHOOK_SECRET is not configured.
**Expected failure:** `src/app/api/stripe/webhook/route.ts` lines 11-13: if `env.STRIPE_WEBHOOK_SECRET` is empty, `verification` is `{ ok: false, error: 'Stripe webhook secret is not configured.' }`. The code then still calls `createStripeWebhookFulfillmentPlan(event, verification.ok)` — passing `false` for `verified`. The plan is built regardless, and `jsonOk` returns the plan in the response. The `verified` flag is advisory only — there is no code gate that rejects unverified events.

### EX-04 [HIGH] Hardcoded Dev Secrets in Source Code
**Attack vector:** Deploy with defaults or leak source code.
**Expected failure:** `src/lib/env.ts` has hardcoded fallback values: `SESSION_SECRET: 'dev-secret-min-32-chars-long!!!!!!!!!!'`, `ENCRYPTION_KEY: 'dev-encryption-key-16'`, `CSRF_SECRET: 'dev-csrf-secret'`, `UPLOAD_TOKEN_SECRET: 'dev-upload-secret'`, `DELIVERY_TOKEN_SECRET: 'dev-delivery-secret'`. If any env var is not set in production, these weak defaults are used silently. No warning is emitted.

### EX-05 [HIGH] CSRF Secret Falls Back to AUTH_SECRET / 'changeme'
**Attack vector:** Predictable CSRF secret.
**Expected failure:** `generateCsrfToken` and `verifyCsrfForRequest` in `src/server/services/csrf-protection-service.ts` use `process.env.CSRF_SECRET || process.env.AUTH_SECRET || 'changeme'`. The literal string `'changeme'` is the final fallback — trivial to guess, allowing CSRF token forgery.

### EX-06 [MEDIUM] No DB Connection Pooling Configuration
**Attack vector:** High-concurrency request spike.
**Expected failure:** `src/lib/prisma.ts` is not visible but standard Prisma defaults may not be tuned for production. Connection pool exhaustion under load could cause cascading failures across all database-dependent endpoints.

---

## ERROR

### ER-01 [CRITICAL] guardedGet/guardedPost/guardedPatch/guardedSession Have Zero Auth Enforcement
**Attack vector:** Send any request to any route using these wrappers.
**Expected failure:** `src/server/routes/route-helpers.ts`: `guardedGet` calls `handler()` with no session check at all. `guardedPost`, `guardedPatch`, and `guardedSession` all extract a demo session via headers OR default to `{ userId: 'demo', organizationId: 'demo-org', role: 'admin' }`. No real session resolution occurs. These wrappers are completely unprotected.

### ER-02 [MEDIUM] mapServiceError Is a Generic Catch-All
**Attack vector:** Throw any unexpected error type.
**Expected failure:** `src/lib/api-response.ts`: `mapServiceError` checks `error instanceof Error` and then looks for a `.code` property. If the error is not an Error instance (e.g., thrown as a string, null, or object without `code`), it falls through to `console.error` and returns a generic 500 with no diagnostic information beyond "An unexpected error occurred."

### ER-03 [MEDIUM] parseJson Silently Eats Parse Errors
**Attack vector:** Send malformed JSON to any endpoint using `parseJson`.
**Expected failure:** `src/server/routes/route-helpers.ts` line 21: the `catch` block returns `fallback` with no logging. Operators have zero visibility into malformed requests. This also masks adversarial probing.

### ER-04 [MEDIUM] Upload Intake Missing Runtime Type Guards
**Attack vector:** Submit `sizeBytes: "abc"` or `fileName: null`.
**Expected failure:** `normalizeFile` in `src/server/services/upload-intake-service.ts` uses `as` type assertions that do no runtime validation. If `file.sizeBytes` is a string `"abc"`, it passes through as-is and produces NaN in the totalSize calculation. If `file.fileName` is null, the fallback chain produces the string `'unknown'` but the null propagates through `as string` without error.

### ER-05 [MEDIUM] No Validation That Token Expiry Actually Works
**Attack vector:** Submit an expired or future-dated token.
**Expected failure:** `validateUploadTokenRecord` checks `new Date() > record.expiresAt` but if `record.expiresAt` is somehow null/undefined, the comparison `new Date() > undefined` evaluates to `false` (Date > undefined is NaN comparison), so an undefined expiry never expires.

### ER-06 [LOW] Auth Login Leaks Timing Information
**Attack vector:** Measure response time for email lookup vs password verification.
**Expected failure:** `login` in `src/server/auth/auth-service.ts` calls `prisma.user.findUnique` first (DB query), then checks `user.deletedAt`, then checks `user.accountStatus`, then calls `verifyPassword`. If the email doesn't exist, the response is faster (one DB query vs two queries + bcrypt). User enumeration is possible via timing side-channel.

---

## SUMMARY

| Category | CRITICAL | HIGH | MEDIUM | LOW |
|----------|----------|------|--------|-----|
| INPUT_BOUNDARY | 1 | 2 | 4 | 1 |
| STATE_TRANSITION | 0 | 1 | 2 | 1 |
| CONCURRENCY | 0 | 2 | 1 | 1 |
| EXTERNAL | 3 | 2 | 1 | 0 |
| ERROR | 1 | 0 | 4 | 1 |
| **TOTAL** | **5** | **7** | **12** | **4** |

**28 findings total — 5 critical, 7 high, 12 medium, 4 low.**
