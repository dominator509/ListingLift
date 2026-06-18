# Q4 Phase 4 — Adversarial Test Report

## Summary

Black-box adversarial probing of ListingLift (Next.js, port 3005). Seven attack classes executed. Application shows strong security posture for a Phase-3-scaffolded project. No critical secrets, database credentials, or internal file paths were leaked. One minor information disclosure identified.

---

## Worst-Case Findings (Top)

### W-1. Zod Validation Schema Leak (Low)
**Endpoint:** `POST /api/auth/login`
**Observed:** Email validation regex and password minimum-length constraints are echoed in 400 responses.
**Example response:**
```json
{
  "ok": false,
  "code": "auth_error",
  "message": "[{\"origin\":\"string\",\"code\":\"invalid_format\",\"format\":\"email\",\"pattern\":\"/^(?!\\\\.)(?!.*\\\\.\\\\.)([A-Za-z0-9_'+\\\\-\\\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\\\-]*\\\\.)+[A-Za-z]{2,}$/\",\"path\":[\"email\"],\"message\":\"Invalid email address\"}]"
}
```
**Impact:** An attacker learns the exact email regex pattern (for crafting bypass inputs) and password length floor (8 chars). Low severity since these are externally fixed — no dynamic/internal secrets.
**Recommendation:** Return a generic "Invalid request" without exposing validation internals.

### W-2. TRACE Method Returns 500 (Low)
**Endpoint:** `TRACE /api/health`, `TRACE /api/auth/login`
**Observed:** TRACE returns 500 with `Internal Server Error` / `Method Not Allowed` body text. No stack trace or sensitive data leaked, but TRACE should be disabled entirely.
**Impact:** TRACE could theoretically be used for Cross-Site Tracing (XST) attack chaining. No observable leak on this app.
**Recommendation:** Disable TRACE at the web server/application level.

### W-3. Login Form Sends Form-Encoded Data but Endpoint Expects JSON (Informational)
**Endpoint:** `POST /api/auth/login`
**Observed:** The HTML login form uses `method="post"` with `action="/api/auth/login"` (standard form submission = `application/x-www-form-urlencoded`), but the endpoint handler only accepts `application/json`. Form submissions receive 400 JSON parse errors.
**Example response:**
```json
{"ok":false,"code":"auth_error","message":"Unexpected token 'e', \"email=none\"... is not valid JSON"}
```
**Impact:** Login form is non-functional via standard HTML submission. This is a UX bug, not a security vulnerability, but the error message reveals the endpoint's JSON-only expectation.
**Recommendation:** Either support form-encoded input in the handler or update the form to use JS-based JSON submission.

---

## Attack Class Results

### 1. ERROR LEAKAGE
| Probe | Input | Response | Leak? |
|-------|-------|----------|-------|
| Malformed JSON to `/api/auth/login` | `{invalid json here` | 400, code `auth_error`, JSON parse error message | No stack trace. Message reveals JSON parse error. |
| Form-encoded POST to `/api/auth/login` | `email=nonexistent@test.com&password=wrong` | 400, code `auth_error`, "Unexpected token" | Shows endpoint expects JSON only. |
| Oversized payload | 100k 'a' chars | 400, code `auth_error` | No crash. Well-handled. |
| SQL-like values in login fields | `' OR '1'='1` | 400, email validation error | Rejected by schema before DB. |
| `GET /upload/demo-token` | — | 500 Internal Server Error | Next.js error page — no stack trace leaked. RSC digest `3525071534`. |
| `GET /api/health?q=...` | SQL injection in query | 200, normal response | Not processed — no server-side interpretation of query params. |
| Non-200 body inspection | All 400/401/403/404/500 responses | — | No internal paths, filenames, DB errors, or env vars observed. |

**Verdict:** No dangerous error leakage. All errors return clean JSON objects with well-defined `code` and `message` fields.

### 2. SENSITIVE DATA EXPOSURE
| Endpoint | Response | Exposure |
|----------|----------|----------|
| `GET /api/health` | `{"ok":true,"service":"listinglift","mode":"production","realIntegrationsEnabled":false,"realImageProviderCallsEnabled":false}` | Intentional. Exposes `mode` (production) and integration flags — minimal risk. |
| `GET /api/packages` | Full pricing catalog with `priceMinCents`/`priceMaxCents`, `deliveryWindowDays`, features | Intentional public API. No secrets. |
| `GET /api/presets` | Full preset configs: dimensions, naming conventions, folder paths | Intentional public API. No secrets. |
| `GET /api/auth/session` (authenticated) | `{"authenticated":true,"strategy":"server-session-scaffold"}` | Intentional. Only accessible with valid session cookie. |
| `GET /api/jobs` (unauthenticated) | 401 `{"code":"unauthorized","message":"Authentication required."}` | Proper auth gating. |
| `GET /api/jobs` (authenticated, low-priv) | 403 `{"code":"permission_denied","message":"Permission denied: manage:jobs"}` | Proper RBAC. Message reveals permission scope — acceptable. |

**Verdict:** No sensitive data exposure. All accessible endpoints are intentionally public. Protected endpoints properly gate with 401/403.

### 3. RATE LIMITING
| Test | Result |
|------|--------|
| 50 rapid login attempts (same IP) | Req 1-5: 401. Req 6-50: **429** `rate_limited`. Kicks in at ~6th request. |
| Retry-after check | Returns 429 with specific timestamp: `"Try again after 2026-06-14T16:14:17.533Z."` |
| Account lockout | Not observed — rate limiting is IP-based, not account-based. |

**Verdict:** Rate limiting IS active and effective. 429 returned after ~5 rapid attempts. No account-level lockout observed (IP-based).

### 4. INPUT FUZZING
| Probe | Input | Response | Result |
|-------|-------|----------|--------|
| SQL injection (login) | `' OR 1=1--` / `UNION SELECT` | 400, email validation error | Rejected by schema. |
| XSS (login) | `<script>alert(1)</script>` | 400, email validation error | Rejected before rendering. |
| Path traversal | `../../../etc/passwd` | 404, clean Next.js not-found page | No file system exposure. |
| Null bytes | `%00` in path / body | 404 or 400 | Properly handled. |
| Prototype pollution | `__proto__[test]=true` on query | Normal 200 response | No observable effect. |
| Duplicate params | `?key=1&key=2` | 200, normal | No parameter pollution observable. |

**Verdict:** Input fuzzing is well-defended by Zod validation layer. No injection, traversal, or pollution vulnerabilities observed.

### 5. METHOD ATTACKS
| Method | `/api/health` | `/api/auth/login` | `/` |
|--------|---------------|-------------------|-----|
| OPTIONS | 204 (No Content) | 204 (Allow: OPTIONS, POST) | — |
| TRACE | **500** (Internal Server Error) | **500** | **500** |
| DELETE | 405 | 405 | — |
| PUT | 405 | 405 | — |
| PATCH | 405 | 405 | — |
| HEAD | — | — | 200 (no body) |
| X-HTTP-Method-Override | — | 405 | — |

**Verdict:** TRACE returns 500 which is non-standard but does not leak data. All other unexpected methods return proper 405 Method Not Allowed. Minor finding: TRACE should return 405 or be disabled.

### 6. HEADER ATTACKS
| Probe | Result |
|-------|--------|
| Host header injection (`Host: evil.com`) | No reflected content. All pages are statically rendered. |
| X-Forwarded-For spoofing | No observable effect. |
| X-Real-IP spoofing | No observable effect. |
| Content-Type mismatch attack | 405 Method Not Allowed. |
| Security headers | CSP: `default-src 'self'`, script-src `'self'`, form-action `'self'`. HSTS: 2 years. X-Frame-Options: DENY. X-Content-Type-Options: nosniff. Referrer-Policy: strict-origin-when-cross-origin. |

**Verdict:** Strong security headers. CSP prevents inline script injection. HSTS active. No header-based attacks succeeded.

### 7. ADDITIONAL PROBES
| Probe | Result |
|-------|--------|
| `/robots.txt` | 404 (not present) |
| `/sitemap.xml` | 404 (not present) |
| `/.env` | 404 |
| `/.git/config` | 404 |
| `/_next/static/chunks/` | 308 redirect (no directory listing) |
| `/_next/image` | 400 (no image specified) |

---

## Sensitivity Matrix

| Endpoint | Unauthenticated | Authenticated (CLIENT_OWNER) | Under Attack |
|----------|----------------|------------------------------|--------------|
| `/` | Public page | Same | Static page only |
| `/login` | Public page | Redirect | Clean 404/error pages |
| `/signup` | Public form | Redirect | Zod validation blocks bad input |
| `/api/health` | Public JSON | Same | Static response |
| `/api/packages` | Public JSON | Same | Static response |
| `/api/presets` | Public JSON | Same | Static response |
| `/api/auth/login` | JSON only | — | Rate-limited after 5 attempts |
| `/api/auth/signup` | Creates user/session | — | Zod validation |
| `/api/auth/session` | 401 | 200, session data | N/A (cookie required) |
| `/api/jobs` | 401 | 403 (permission denied) | Proper error contract |
| `/admin` | 307 → /login | 307 → /login | Auth gated |
| `/upload/demo-token` | 500 | 500 | Clean error page |
| Checkout pages | Public pages | Same | Static |
| Any 404 path | Clean 404 page | Same | No info leak |

---

## Verdict

**No critical or high-severity vulnerabilities found.** The application demonstrates a strong security baseline:

- ✅ Consistent error contracts — no stack traces, file paths, or DB errors
- ✅ Proper auth gating (401/403) for all protected routes
- ✅ RBAC enforcement (CLIENT_OWNER cannot access manage:jobs)
- ✅ Rate limiting on login endpoint
- ✅ Zod input validation rejects injection/XSS/traversal
- ✅ Strong security headers (CSP, HSTS, XFO, etc.)
- ✅ No sensitive files exposed (.env, .git, etc.)

**One low-severity finding:** Zod validation schema details leaked in 400 responses (W-1).

**One informational finding:** TRACE method returns 500 instead of 405 (W-2).

**One UX observation:** Login form submits form-encoded data but endpoint requires JSON (W-3).
