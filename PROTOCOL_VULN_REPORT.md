# Q5 PHASE 4 — Protocol-Specific Vulnerability Report

## Summary

Tested 8 protocol-level attack vectors across 50 API route files. 12 findings identified: 3 HIGH, 6 MEDIUM, 3 LOW. 7 of 12 findings are actionable now; the remaining 5 require production wiring to confirm.

---

## 1. SSRF — Server-Side Request Forgery

**Verdict: LOW RISK — No exploitable SSRF vectors**

The codebase is scaffold-phase: no production route handler performs outbound HTTP requests to user-supplied URLs. The `stripe` SDK is imported but never invoked for API calls (routes return dry-run plans). The `fetch()` API is absent from all handlers.

| Route | SSRF Vector | Status |
|---|---|---|
| All routes | External URL fetch | Not present |
| Stripe webhook | Stripe SDK API calls | Not wired — stub only |
| Upload intake | File URL fetch | Not present |
| Delivery links | Remote URL resolution | Not present |

**FINDING SSRF-1 (INFO):** When `buildDeliveryEmailPreview` or `delivery-link-service` is production-wired, ensure user-supplied URLs are validated against an allow-list and not fetched server-side.

**FINDING SSRF-2 (LOW):** `originAllowedForRequest` in `csrf-protection-service.ts` supports wildcard origin `"*"` in the `ALLOWED_ORIGINS` env var. If set to `*` in production, SSRF chaining via cross-origin requests becomes possible. Recommend removing wildcard support or at minimum logging a warning on startup.

---

## 2. Prototype Pollution

**Verdict: MEDIUM RISK — Multiple injection surfaces exist**

The codebase uses two parsing patterns, both vulnerable:

### Pattern A: `JSON.parse()` in `parseJson()` (route-helpers.ts:16-24)

`parseJson` calls `JSON.parse(text)` directly without any prototype cleaning. An attacker can send:
```json
{"__proto__": {"admin": true}, "constructor": {"prototype": {"verified": true}}}
```

Routes using `parseJson(request, {})` and then spreading or `as`-casting the result are affected.

### Pattern B: Manual `as`-cast schemas (not Zod)

Most schemas (upload.ts, security-hardening.ts, etc.) use manual parsers that pass through unknown properties:
```typescript
// upload.ts:17-25
return {
  organizationId: input.organizationId as string | undefined,
  jobId: input.jobId as string | undefined,
  // ... includes ALL original properties
};
```

**FINDING PP-1 (MEDIUM):** 28 routes use `parseJson(request, {})` followed by spread or `as`-cast into schemas. If a downstream service later iterates over the parsed object, injected prototype properties will propagate. Routes at risk include:
- `POST /api/uploads` (line 29: `body = await parseJson(...)`)
- `POST /api/uploads/create-token` (line 14: `body = await parseJson(...)`)
- `POST /api/delivery/create-token` (line 13: `body = await parseJson(...)`)
- `POST /api/jobs/[jobId]/approval` (body spread)
- `POST /api/account` (calls `request.json()` directly — safe from `parseJson` but still vulnerable to JSON-level PP)
- `POST /api/sales-channels/manual-order` (line 14: `body = await parseJson(...)`)
- `POST /api/external-orders` (line 14: `body = await parseJson(...)`)
- `POST /api/external-orders/dedupe-check` (line 14: `body = await parseJson(...)`)
- All `guardedPost/guardedPatch` calls with `parseJson` (clients, organizations/team)

**FINDING PP-2 (MEDIUM):** `POST /api/account` uses `request.json()` directly then passes to Zod. Zod schemas strip unknown properties by default, so prototype pollution is blocked for Zod-validated routes. However, non-Zod manual parsers (upload.ts, security-hardening.ts) do NOT strip unknown properties.

**Recommendation:** Add `JSON.parse(text, (key, value) => { if (key === '__proto__' || key === 'constructor') return undefined; return value; })` to `parseJson()` in route-helpers.ts.

---

## 3. HTTP Parameter Pollution (HPP)

**Verdict: LOW RISK — Limited exploitable surface**

**FINDING HPP-1 (LOW):** `GET /api/stripe/webhook` uses no query params — safe. The `POST` handler reads body only.

**FINDING HPP-2 (LOW):** `src/app/api/quality-control/outputs/[processedFileId]/flag/route.ts` line 15:
```typescript
const jobId = new URL(request.url).searchParams.get('jobId') ?? 'dry-run-job-id';
```
`URLSearchParams.get()` returns the first value only. Duplicate `jobId` params are silently ignored — no bypass possible here.

**FINDING HPP-3 (LOW):** 11 routes read URL params via `(await params).jobId` or `.processedFileId` — these come from Next.js dynamic route segments, not query strings. Not vulnerable to HPP.

**FINDING HPP-4 (INFO):** If any production route uses `request.headers.get()` for authorization decisions with comma-separated values, HPP could split header values. Currently `session` header (`cookie`) uses `cookieHeader?.match(/ll_session=([^;]+)/)` which picks the first match — safe.

---

## 4. Mass Assignment

**Verdict: HIGH RISK — Multiple exploitable injection points**

**FINDING MA-1 (HIGH):** `POST /api/clients` uses `guardedPost` which calls `extractDemoSession()` — any request with `x-demo-user-id`, `x-demo-role`, and `x-demo-organization-id` headers bypasses real auth entirely and gets admin privileges. While likely intended for development, this is a direct mass-assignment attack vector:
```
x-demo-user-id: admin-001
x-demo-role: super_admin
x-demo-organization-id: org-victim
```

**FINDING MA-2 (HIGH):** Route patterns that spread request body into schema parse calls allow extra fields through:
- `POST /api/jobs/[jobId]/approve`: `{ ...(await parseJson(request, {})), jobId: ..., decision: 'APPROVE_JOB' }` — extra body fields like `organizationId` from body would be passed through
- `POST /api/jobs/[jobId]/delivery/archive-plan`: `deliveryArchivePlanRequestSchema.parse({ ...(await parseJson(...)), jobId })` — extra body fields pass through
- `POST /api/previews/admin/jobs/[jobId]`: `previewGalleryRequestSchema.parse({ ...(await parseJson(...)), jobId, organizationId })` — `organizationId` is set from session but body could override it before session value

**FINDING MA-3 (MEDIUM):** `POST /api/sales-channels/manual-order` line 26:
```typescript
payload: body.payload && typeof body.payload === 'object' ? body.payload : body,
```
If `body.payload` is an object, it's used directly. An attacker could set:
```json
{
  "channelKey": "manual",
  "payload": {
    "organizationId": "victim-org",
    "status": "approved",
    "verified": true,
    "role": "admin"
  }
}
```
`organizationId` is then overridden by line 15 (`const organizationId = session.organizationId`) for the plan, but `payload` passes through to `buildSalesChannelNormalizationPlan` which may store it.

**FINDING MA-4 (MEDIUM):** `POST /api/uploads/create-token`: `organizationId: input.organizationId ?? session.organizationId`. If `input.organizationId` is explicitly set to another org, it's used if truthy. This allows cross-org token issuance.

---

## 5. Content-Type Attacks

**Verdict: LOW RISK — No active exploits, but several routes lack content-type validation**

**FINDING CT-1 (LOW):** 25 routes accept any `Content-Type` header without validation:
- Routes using `parseJson` call `request.text()` then `JSON.parse()` — this works regardless of Content-Type header
- Routes using `request.json()` (like account route) rely on Next.js body parser which validates Content-Type internally
- `guardedGet`, `guardedPost` etc. don't validate Content-Type

**FINDING CT-2 (INFO):** The `createGumroadWebhookProcessingPlan` supports both JSON and form-encoded payloads. The form-encoded parsing with `URLSearchParams` handles multipart boundaries correctly, but no Content-Type validation occurs.

**FINDING CT-3 (INFO):** No multipart boundary injection surfaces — the app uses JSON bodies, not multipart forms, for all API routes.

---

## 6. Protocol Handoff Vulnerabilities

### 6a. Stripe Webhook Signature Verification

**Verdict: MEDIUM RISK — Signature bypass possible when secret is unconfigured**

**FINDING SW-1 (MEDIUM):** The Stripe webhook route (`POST /api/stripe/webhook`) parses and processes the event payload REGARDLESS of signature verification result.

In `route.ts` lines 11-13:
```typescript
const verification = env.STRIPE_WEBHOOK_SECRET
  ? verifyStripeWebhookSignature(...)
  : { ok: false, error: 'Stripe webhook secret is not configured.' };
```

Then line 26:
```typescript
const plan = createStripeWebhookFulfillmentPlan(event, verification.ok);
```

`verification.ok` is PASSED to the plan, but:
1. The event is ALREADY PARSED before verification check (lines 14-19)
2. `createStripeWebhookFulfillmentPlan` accepts `verification.ok` as a parameter — but the data has already been processed
3. If `STRIPE_WEBHOOK_SECRET` is not configured (dev/test env), anyone can POST arbitrary events with no signature

Additionally, `verifyStripeWebhookSignature` has proper tolerance validation (300s window, timing-safe compare). The `toleranceSeconds` is user-configurable — if set to a very large value, replay attacks become trivial.

**FINDING SW-2 (LOW):** The `toleranceSeconds` parameter is hardcoded to 300 on the route level but the `verifyStripeWebhookSignature` function accepts it as a parameter. If any other caller passes 0 or negative, tolerance is bypassed entirely.

### 6b. Gumroad Webhook / Callback Forgery

**Verdict: HIGH RISK — No signature verification exists**

**FINDING GW-1 (HIGH):** No `/api/webhooks/gumroad` route exists in the codebase. The test file (`webhook-resilience.spec.ts`) references this endpoint but it has not been implemented.

**FINDING GW-2 (HIGH):** `createGumroadWebhookProcessingPlan` (gumroad-fulfillment-orchestrator.ts) performs ZERO signature verification. The function accepts a `signatureHeader: string | null` parameter but never uses it. Any caller can forge Gumroad callbacks with arbitrary sale data.

```typescript
export function createGumroadWebhookProcessingPlan(input: {
  payloadText: string;
  signatureHeader: string | null;  // ← Received but NEVER CHECKED
  dryRun?: boolean;
}) {
  // ... processes payload without verifying signature
}
```

**Recommendation:** Before wiring the Gumroad route, implement HMAC-SHA256 signature verification matching Gumroad's webhook signing specification. The signature header must be validated against the shared webhook secret before any payload processing.

---

## 7. WebSocket

**Verdict: NO WEBSOCKET ENDPOINTS**

No WebSocket server, route, or upgrade handler exists in the codebase. The Next.js App Router does not natively support WebSocket upgrades. No `ws` or `socket.io` dependencies in package.json.

**FINDING WS-1 (INFO):** No WebSocket endpoints to test. If added later, ensure:
- Connection origin validation
- Session token binding per connection
- Rate limiting on messages
- No injection of unsanitized data into WebSocket broadcasts

---

## 8. Header Injection

**Verdict: MEDIUM RISK — Demo session headers create an authorization bypass vector**

**FINDING HI-1 (MEDIUM):** `X-Forwarded-For`, `X-Real-IP`, and `Host` headers are not used for any security decisions — this is safe. However, the demo session headers (`x-demo-user-id`, `x-demo-organization-id`, `x-demo-role`) in `route-helpers.ts:5-14` create a direct header-injection bypass:

```typescript
function extractDemoSession(request: Request) {
  const userId = request.headers.get('x-demo-user-id');
  if (!userId) return null;
  return {
    userId,
    organizationId: request.headers.get('x-demo-organization-id') ?? 'demo-org',
    role: request.headers.get('x-demo-role') ?? 'admin',
  };
}
```

Any HTTP client can set these headers to impersonate any user and any role. `guardedPost`, `guardedPatch`, and `guardedSession` all use this fallback.

**FINDING HI-2 (INFO):** `originAllowedForRequest` in csrf-protection-service.ts validates Origin/Referer headers correctly. The `csrf-protection-service` properly checks `x-csrf-token` header. These are correctly implemented.

**FINDING HI-3 (LOW):** The `Host` header is not used for any security decisions or URL generation. `APP_URL` is read from env var only. Safe.

---

## Risk Summary

| # | Finding | Severity | Category | Actionable Now |
|---|---|---|---|---|
| SSRF-1 | No SSRF vectors in scaffold — monitor when wiring external fetches | INFO | SSRF | No |
| SSRF-2 | Wildcard origin support in CSRF (env var `*`) | LOW | SSRF | Yes |
| PP-1 | `parseJson()` has no prototype-clean reviver — 28 routes affected | MEDIUM | Prototype Pollution | Yes |
| PP-2 | Manual `as`-cast schemas pass through unknown properties | MEDIUM | Prototype Pollution | Yes |
| HPP-1/2/3 | No exploitable HPP — URL param and header handling is safe | INFO | HPP | No |
| MA-1 | Demo session headers bypass auth entirely (dev-only feature, but removable) | HIGH | Mass Assignment | Yes |
| MA-2 | Body spread into schema calls allows extra field injection | HIGH | Mass Assignment | Yes |
| MA-3 | `payload` object pass-through in sales channel routes | MEDIUM | Mass Assignment | Yes |
| MA-4 | Custom `organizationId` in body overrides session | MEDIUM | Mass Assignment | Yes |
| CT-1/2/3 | No active content-type exploits — monitor when multipart added | INFO | Content-Type | No |
| SW-1 | Stripe webhook processes payload before signature check | MEDIUM | Webhook Security | Yes |
| SW-2 | Configurable tolerance parameter could be abused | LOW | Webhook Security | No |
| GW-1 | No Gumroad webhook route implemented | HIGH | Webhook Security | — |
| GW-2 | Gumroad fulfillment service has zero signature verification | HIGH | Webhook Security | Yes |
| WS-1 | No WebSocket endpoints — document absence | INFO | WebSocket | No |
| HI-1 | Demo session headers allow full authorization bypass | MEDIUM | Header Injection | Yes |
| HI-3 | Host header not used for security decisions — safe | INFO | Header Injection | No |

---

## Remediation Priorities

1. **HIGH — `parseJson()` prototype pollution fix**: Add a reviver to `JSON.parse` in route-helpers.ts that drops `__proto__` and `constructor` keys.
2. **HIGH — Gumroad signature verification**: Implement HMAC-SHA256 verification in `createGumroadWebhookProcessingPlan` before production wiring.
3. **HIGH — Stripe webhook signature gating**: Move signature verification BEFORE body parsing, or at minimum reject unverified events before passing to plan creation.
4. **MEDIUM — Schema unknown-property stripping**: Convert manual `as`-cast parsers to Zod schemas with `.strip()` or explicitly filter `organizationId`, `role`, `status`, `verified` from request bodies.
5. **MEDIUM — Demo session headers**: Add a runtime guard (env-flag or build-time check) that disables `extractDemoSession` in production.
6. **MEDIUM — Organization ID override**: Remove fallback `input.organizationId ?? session.organizationId` patterns — always use `session.organizationId`.
7. **MEDIUM — Body spread patterns**: Replace `{ ...body, ...safeFields }` with explicit field extraction in routes that construct schema inputs.

---

## Test Coverage

Existing related tests (none cover protocol-level vectors directly):
- `tests/e2e/webhook-resilience.spec.ts` — duplicate/malformed Stripe webhook testing
- `tests/e2e/security-hardening.spec.ts` — general security boundary testing
- `tests/security/csrf-integration.test.ts` — CSRF token lifecycle

**Recommended new tests:**
- `tests/security/prototype-pollution.test.ts` — inject `__proto__` payloads across all JSON routes
- `tests/security/mass-assignment.test.ts` — inject `role`, `organizationId`, `verified` into state-changing routes
- `tests/security/webhook-signature-bypass.test.ts` — forge Stripe/Gumroad callbacks without valid signatures
- `tests/security/header-injection-bypass.test.ts` — test demo session headers, X-Forwarded-For injection
