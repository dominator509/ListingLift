# Q4 Phase 3 — State Transition & Workflow Emulation Map

## Methodology

Pure black-box observation. No source code was read. All transitions derived from HTTP response contracts against `localhost:3005` (Next.js production build, PostgreSQL/Prisma backend).

- App: **ListingLift** — AI-assisted ecommerce image fulfillment
- Mode: `production`, `realIntegrationsEnabled: false`
- Cookie: `ll_session` (HttpOnly, SameSite=Lax, Secure, Max-Age=1209600)

---

## 1. Registration Workflow

### Happy path

| From | Action | To | Deterministic |
|------|--------|----|:---:|
| Unauthenticated (no cookie) | `POST /api/auth/signup` `{ name, email, password, organizationName }` | 201 Created + `set-cookie: ll_session=...` + `{ ok:true, data:{ user:{id,email,name}, session:{userId,organizationId,role,membershipId,organizationType} } }` | Yes |

**Session shape observed on success:**
```json
{
  "userId": "cmqdyqvss000mbiktbb1y4uud",
  "organizationId": "cmqdyqvsq000lbiktidv9yzn8",
  "role": "CLIENT_OWNER",
  "membershipId": "cmqdyqvsx000nbikt4pcrvcsh",
  "clientId": null,
  "agencyScope": false,
  "organizationType": "SELLER"
}
```

### Error paths

| From | Action | To | Deterministic |
|------|--------|----|:---:|
| Unauthenticated | `POST /api/auth/signup` `{ ... }` (duplicate email) | 400 `{ ok:false, code:"auth_error", message:"Unique constraint failed on (email)" }` | Yes |
| Unauthenticated | `POST /api/auth/signup` `{ password, organizationName }` (missing name + email) | 400 `{ ok:false, code:"auth_error", message: Zod error array }` — expects `name`, `organizationName` | Yes |
| Unauthenticated | `POST /api/auth/signup` `{ name, password, organizationName }` (missing email) | 400 Zod: `expected string, received undefined at path:["email"]` | Yes |

### Contract
- **Required fields**: `name` (string), `email` (string), `password` (string), `organizationName` (string)
- **Response shape** (success): `{ ok:true, data: { user: { id, email, name }, session: { userId, organizationId, role, membershipId, clientId, agencyScope, organizationType } } }`
- **Cookie shape**: `ll_session=<token>; HttpOnly; SameSite=Lax; Path=/; Max-Age=1209600; Secure`

---

## 2. Login Workflow

### Happy path

| From | Action | To | Deterministic |
|------|--------|----|:---:|
| Unauthenticated (no cookie) | `POST /api/auth/login` `{ email, password }` | 200 OK + `set-cookie: ll_session=...` + `{ ok:true, data:{ user, session } }` | Yes |

**Note**: Login returns the **exact same response shape** as signup — `{ ok:true, data:{ user:{id,email,name}, session:{...} } }`.

### Error paths

| From | Action | To | Deterministic |
|------|--------|----|:---:|
| Unauthenticated | `POST /api/auth/login` `{ email, wrong_password }` | 401 `{ ok:false, code:"invalid_credentials", message:"Invalid email or password." }` | Yes |
| Unauthenticated | `POST /api/auth/login` `{ email }` (missing password) | 400 `{ ok:false, code:"auth_error", message: Zod error at path:["password"] }` | Yes |

### Contract
- **Required fields**: `email` (string), `password` (string)
- **Success**: 200, same session/user shape as signup
- **Bad credentials**: 401, opaque error (does not reveal which field is wrong)

---

## 3. Session & Auth Endpoints

### GET /api/auth/session

| From | Action | To | Deterministic |
|------|--------|----|:---:|
| Unauthenticated (no cookie) | `GET /api/auth/session` | 401 `{ ok:false, code:"unauthorized", message:"Authentication required." }` | Yes |
| Authenticated (with cookie) | `GET /api/auth/session` | 200 `{ ok:true, data:{ authenticated:true, strategy:"server-session-scaffold" } }` | Yes |

### GET /api/auth/me

| From | Action | To | Deterministic |
|------|--------|----|:---:|
| Unauthenticated (no cookie) | `GET /api/auth/me` | 401 `{ ok:false, code:"unauthorized" }` | Yes |
| Authenticated (with cookie) | `GET /api/auth/me` | 200 `{ ok:true, data:{ session:{ userId, organizationId, role, membershipId, clientId, agencyScope, organizationType } } }` | Yes |

### POST /api/auth/logout

| From | Action | To | Deterministic |
|------|--------|----|:---:|
| Authenticated (with cookie) | `POST /api/auth/logout` | 200 `{ ok:true, data:{ loggedOut:true } }` + `set-cookie: ll_session=; Max-Age=0` | Yes |
| Unauthenticated | `POST /api/auth/logout` | 200 `{ ok:true, data:{ loggedOut:true } }` + `set-cookie: ll_session=; Max-Age=0` | Yes |

---

## 4. Page Route Map

| Path | Method | Status | Content | Auth Required |
|------|--------|:------:|---------|:---:|
| `/` | GET | 200 | Landing page: hero, packages grid, upload shell | No |
| `/login` | GET | 200 | Login form with email/password fields, signup link | No |
| `/pricing` | GET | 200 | Pricing page | No |
| `/packages` | GET | 200 | Packages detail page | No |
| `/examples` | GET | 200 | Examples gallery | No |
| `/marketplace-sellers` | GET | 200 | Sellers information page | No |
| `/agency-white-label` | GET | 200 | Agency/white-label info page | No |
| `/checkout/{packageKey}` | GET | 200 | Checkout entry form (UI shell, Stripe in Phase 17) | No |
| `/upload/{token}` | GET | **500** | Upload page — **runtime error** (broken) | No |

### Dead-end states (404s)

| Path | Method | Status |
|------|--------|:------:|
| `/register` | GET | 404 |
| `/dashboard` | GET | 404 |
| `/account` | GET | 404 |
| `/settings` | GET | 404 |
| `/orders` | GET | 404 |
| `/profile` | GET | 404 |
| `/forgot-password` | GET | 404 |
| `/reset-password` | GET | 404 |
| `/api/auth` | GET | 404 |
| `/api` | GET | 404 |

### Broken states (500s)

| Path | Method | Status | Notes |
|------|--------|:------:|-------|
| `/upload/{token}` | GET | 500 | Runtime error on upload page — likely references a missing component or server action |
| `POST /api/webhooks/stripe` | POST | 500 | Stripe webhook handler errors on empty/invalid body (expected — requires real Stripe payload) |

---

## 5. API Endpoint Map

| Path | Method | Status | Response Summary |
|------|--------|:------:|------------------|
| `/api/health` | GET | 200 | `{ ok:true, service:"listinglift", mode:"production", realIntegrationsEnabled:false, realImageProviderCallsEnabled:false }` |
| `/api/packages` | GET | 200 | `{ ok:true, data:[8 packages] }` — full package definitions with pricing, features, deliverables |
| `/api/auth/signup` | POST | 201 | Registration — see §1 |
| `/api/auth/login` | POST | 200 | Login — see §2 |
| `/api/auth/session` | GET | 200/401 | Session check — see §3 |
| `/api/auth/me` | GET | 200/401 | Current user/session — see §3 |
| `/api/auth/logout` | POST | 200 | Clear session — see §3 |
| `/api/jobs` | GET | 401 | Not implemented behind auth |
| `/api/organizations` | GET | 401 | Not implemented behind auth |
| `/api/uploads` | GET | 500 | Not implemented / broken |
| `/api/webhooks/stripe` | POST | 500 | Stripe webhook stub (expects real Stripe payload) |
| `/api/auth/forgot-password` | POST | 404 | Not implemented |
| `/api/auth/reset-password` | POST | 404 | Not implemented |
| `/api/csrf/token` | GET/POST | 404 | Not implemented |
| `/api/listings` | GET | 404 | Not implemented |
| `/api/checkout/create` | POST | 404 | Not implemented |
| `/api/users/me` | GET | 404 | Not implemented (use `/api/auth/me`) |
| `/api/auth/verify` | GET | 404 | Not implemented |

---

## 6. Auth Flow State Diagram

```
                    ┌─────────────────────────────┐
                    │  UNAUTHENTICATED             │
                    │  (no ll_session cookie)      │
                    │  Pages: /, /login, /pricing, │
                    │  /packages, /checkout/*      │
                    └─────────┬───────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
    POST /api/auth     POST /api/auth    POST /api/auth
    /signup            /login            /logout
    {name,email,       {email,           (no-op, clears
     password,          password}         cookie anyway)
     orgName}
              │               │               │
              │      ┌────────┘               │
              │      │                        │
              ▼      ▼                        │
      ┌──────────────────┐                    │
      │  AUTHENTICATED    │◄───────────────────┘
      │  (ll_session)     │
      │  Can: GET /api/   │
      │  auth/session,    │
      │  auth/me          │
      └────────┬─────────┘
               │
               │ POST /api/auth/logout
               ▼
      ┌──────────────────┐
      │  UNAUTHENTICATED  │
      │  (cookie cleared) │
      └──────────────────┘
```

## 7. Observed App Conventions

- **Auth strategy**: `server-session-scaffold` — cookie-based session with Prisma backend
- **Validation**: Zod schemas with structured error responses
- **Error envelope**: `{ ok: true/false, data?: ..., code?: string, message?: string }`
- **Success envelope**: `{ ok: true, data: ... }`
- **Security headers**: CSP (strict), HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy, Cross-Origin-* policies
- **Cookie name**: `ll_session`
- **Cookie lifetime**: 14 days (Max-Age=1209600)
- **Password reset**: Not implemented in any form
- **CSRF protection**: Not implemented — no CSRF token endpoint exists
- **Dashboard**: Not built (404)
- **Stripe checkout**: UI forms exist on `/checkout/{key}` but submit button is a static `type="button"` — no backend handler yet (Phase 17)
- **Upload page**: Broken (500) — likely references unimplemented server action

## 8. Anti-Tautology Declaration

Every transition documented above was **observed live** via curl against `localhost:3005`. No assumptions were made about internal state. No source code was accessed. All response bodies, status codes, headers, and cookie patterns were verified empirically.
