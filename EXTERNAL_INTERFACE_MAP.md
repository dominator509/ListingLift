# Q4 PHASE 1 — EXTERNAL INTERFACE MAP

> **Implementation-blind black box survey of the ListingLift application at localhost:3005.**
> No source code was read. All assertions are based on observable HTTP behavior only.

---

## 1. SECURITY HEADERS

Every route (including error pages) serves these security headers:

| Header | Value |
|--------|-------|
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `Content-Security-Policy` | `default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: blob:; connect-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; form-action 'self'` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (production only) |
| `X-Powered-By` | Not set (disabled) |

---

## 2. ROUTE CATALOG

### 2.1 Public Pages (HTML, 200 OK, no auth required)

| Method | Path | Status | Content-Type | Auth | Notes |
|--------|------|--------|-------------|------|-------|
| GET | `/` | 200 | `text/html; charset=utf-8` | Public | Landing page, title: "ListingLift", description: "Product photo cleanup and ecommerce image fulfillment." |
| GET | `/login` | 200 | `text/html; charset=utf-8` | Public | Login form page |
| GET | `/signup` | 200 | `text/html; charset=utf-8` | Public | Registration form page |
| GET | `/packages` | 200 | `text/html; charset=utf-8` | Public | Packages listing page |
| GET | `/pricing` | 200 | `text/html; charset=utf-8` | Public | Pricing page |
| GET | `/examples` | 200 | `text/html; charset=utf-8` | Public | Examples gallery |
| GET | `/marketplace-sellers` | 200 | `text/html; charset=utf-8` | Public | Marketplace sellers page |
| GET | `/checkout/[packageKey]` | 200 | `text/html; charset=utf-8` | Public | Checkout for a package (e.g. `/checkout/basic`) |
| GET | `/not-found` | 404 | `text/html; charset=utf-8` | Public | Custom 404 page |

### 2.2 Dynamic/Delivery Pages (500 on bad token)

| Method | Path | Status | Content-Type | Auth | Notes |
|--------|------|--------|-------------|------|-------|
| GET | `/delivery/[token]` | 500 | `text/html; charset=utf-8` | Token | Token-based delivery access; returns 500 with `__next_error__` for invalid tokens |
| GET | `/upload/[token]` | 500 | `text/html; charset=utf-8` | Token | Token-based upload portal; same 500 pattern for bad tokens |

### 2.3 Auth-Gated Pages (307 Redirect → `/login?next=<path>`)

All client, admin, and agency routes enforce authentication by redirecting to `/login` with a `next` query parameter.

| Method | Path | Status | Content-Type | Auth | Redirect Header |
|--------|------|--------|-------------|------|----------------|
| GET | `/client` | 307 | — | Session | `/login?next=%2Fclient` |
| GET | `/client/jobs` | 307 | — | Session | `/login?next=%2Fclient%2Fjobs` |
| GET | `/client/downloads` | 307 | — | Session | `/login?next=%2Fclient%2Fdownloads` |
| GET | `/client/billing` | 307 | — | Session | `/login?next=%2Fclient%2Fbilling` |
| GET | `/client/revisions` | 307 | — | Session | `/login?next=%2Fclient%2Frevisions` |
| GET | `/client/upgrade` | 307 | — | Session | `/login?next=%2Fclient%2Fupgrade` |
| GET | `/client/reports` | 307 | — | Session | `/login?next=%2Fclient%2Freports` |
| GET | `/admin` | 307 | — | Session | `/login?next=%2Fadmin` |
| GET | `/agency` | 307 | — | Session | `/login?next=%2Fagency` |
| GET | `/dashboard` | 404 | — | — | No route handler for bare `/dashboard` |

---

## 3. API CONTRACT MAP

### 3.1 Public API Endpoints (200, no auth)

#### `GET /api/health`
```json
{
  "ok": true,
  "service": "listinglift",
  "mode": "production",
  "realIntegrationsEnabled": false,
  "realImageProviderCallsEnabled": false
}
```

#### `GET /api/packages`
```json
{
  "ok": true,
  "data": [
    {
      "key": "QuickCleanup10",
      "publicSlug": "quick-cleanup-pack",
      "name": "Quick Cleanup Pack",
      "category": "quick_cleanup",
      "imageMin": 10,
      "imageMax": 10,
      "imageAllowance": 10,
      "priceMinCents": 2500,
      "priceMaxCents": 4900,
      "currency": "USD",
      "billingInterval": "one_time",
      "checkoutMode": "direct_checkout",
      "deliveryWindowDays": 3,
      "revisionAllowance": 1,
      "includedOutputTypes": ["TRANSPARENT_PNG", "WHITE_JPG", "ZIP"],
      "defaultSalesChannelKeys": ["Direct", "Stripe", "Gumroad", "Fiverr"],
      "active": true,
      "manualReviewRequired": false,
      "upsellPackageKeys": ["MarketplaceListing25", "MonthlySellerRetainer"]
    }
    // ... multiple packages
  ]
}
```

#### `GET /api/presets`
```json
{
  "ok": true,
  "data": [
    {
      "key": "AmazonMainImageDraft",
      "platform": "Amazon",
      "platformKey": "amazon",
      "name": "Amazon Main Image Draft",
      "width": 2000,
      "height": 2000,
      "aspectRatio": "1:1",
      "orientation": "square",
      "format": "JPG",
      "folderPath": "Amazon/white-background",
      "namingConvention": "{sku}_amazon_main_{index}.jpg",
      "background": "WHITE",
      "active": true,
      "system": true,
      "sellerReviewRequired": true
    }
    // ... multiple presets across Amazon, Etsy, eBay, Shopify, TikTok, Instagram, Facebook, Pinterest, Gumroad, RealEstate, etc.
  ]
}
```

#### `GET /api/subscriptions`
```json
{
  "ok": true,
  "data": {
    "subscriptions": [],
    "note": "Seed route. Codex must return tenant-scoped subscriptions and entitlements."
  }
}
```

#### `GET /api/manual-invoices`
```json
{
  "ok": true,
  "data": {
    "invoices": [],
    "note": "Seed route. Codex must query tenant-scoped ManualInvoice rows with pagination."
  }
}
```

#### `GET /api/credits/balance`
```json
{
  "ok": true,
  "data": {
    "summary": {
      "balance": 45,
      "creditsAdded": 55,
      "creditsUsed": 10,
      "entryCount": 3
    },
    "note": "Seed route. Codex must query tenant-scoped CreditLedger rows and client scope server-side."
  }
}
```

#### `GET /api/presets/validate`
```json
{
  "ok": true,
  "data": {
    "valid": true,
    "coverage": {
      "required": ["AmazonMainImageDraft", "AmazonSecondaryImageDraft", ...],
      "provided": ["AmazonMainImageDraft", "AmazonSecondaryImageDraft", ...],
      "missing": []
    }
  }
}
```

#### `GET /api/client-dashboard/billing`
```json
{
  "dryRun": true,
  "billing": {
    "creditsRemaining": 0,
    "creditsTotal": 0,
    "creditUsagePercent": 0,
    "subscriptionStatus": "manual-or-unconfigured"
  },
  "codexNote": "Codex must derive billing from verified ledger rows."
}
```

#### `GET /api/gumroad/products`
```json
{
  "ok": true,
  "data": {
    "provider": "gumroad",
    "mappings": [
      {
        "key": "gumroad_quick_cleanup_10",
        "label": "10-image cleanup pack",
        "productNameHints": ["10-image cleanup", "quick cleanup", "10 photo cleanup"],
        "permalinkHints": ["quick-cleanup-10", "10-image-cleanup"],
        "packageKey": "QuickCleanup10",
        "imageAllowance": 10,
        "creditAmount": 0,
        "revisionAllowance": 1,
        "fulfillmentKind": "IMAGE_PACK_JOB",
        "createsJob": true,
        "sendsUploadLink": true,
        "sendsAdminNotification": true
      }
    ]
  }
}
```

#### `GET /api/marketplace-exports/catalog`
```json
{
  "ok": true,
  "data": {
    "channels": [
      {
        "key": "amazon_manual",
        "label": "Amazon Seller Manual / Export",
        "packageKey": "MarketplaceListing50",
        "defaultPresetKeys": ["AmazonMainImageDraft", "AmazonSecondaryImageDraft", "WhiteJPG", "TransparentPNG"],
        "defaultDeliveryMode": "SELLER_EXPORT_PACKAGE",
        "sellerReviewRequired": true,
        "manualFallbackOnly": true,
        "supportsCsvImport": true,
        "supportsApiLater": true
      }
      // ... ebay, woocommerce
    ]
  }
}
```

#### `GET /api/other-sales-channels/catalog`
```json
{
  "ok": true,
  "data": {
    "channels": [
      {
        "key": "Freelancer",
        "label": "Freelancer.com",
        "category": "FREELANCE_MARKETPLACE",
        "defaultPackageKey": "MarketplaceListing50",
        "defaultDeliveryMode": "SOURCE_PLATFORM_WITH_ALLOWED_LINK",
        "createsUploadLink": true,
        "supportsProposalTemplate": true,
        "supportsFollowUp": true,
        "revenueAttributionRequired": true,
        "manualOnly": true,
        "selectableSource": true
      }
      // ... PeoplePerHour, Guru, FiverrWork, etc.
    ]
  }
}
```

#### `GET /api/reports/catalog`
```json
{
  "reportTypeKeys": ["DELIVERY_SUMMARY", "IMAGE_QUALITY", "LISTING_RECOMMENDATIONS", "MONTHLY_CLEANUP", "WHITE_LABEL", "REVENUE_ATTRIBUTION", "CLIENT_PROGRESS", "AGENCY_ROLLUP"],
  "reportAudiences": ["ADMIN", "CLIENT", "AGENCY", "WHITE_LABEL"],
  "reportMetricKinds": ["JOB_COUNT", "IMAGE_COUNT", "APPROVED_OUTPUT_COUNT", "FLAGGED_OUTPUT_COUNT", "REVISION_COUNT", "DELIVERY_COUNT", "DOWNLOAD_COUNT", "REVENUE_CENTS", "CREDIT_BALANCE", "SUBSCRIPTION_STATUS", "QUALITY_SCORE", "TURNAROUND_HOURS"],
  "dryRun": true
}
```

#### `GET /api/adapters/health`
```json
{
  "ok": true,
  "data": [
    {
      "provider": "mock-image-provider",
      "mode": "mock",
      "ok": true,
      "message": "Mock provider available."
    },
    {
      "provider": "remove-bg",
      "mode": "real",
      "ok": false,
      "message": "Real image-provider calls are disabled.",
      "code": "real_calls_disabled",
      "manualFallbackRequired": true
    }
    // ... cloudinary, internal_image_processing
  ]
}
```

#### `GET /api/advanced-image-processing/health`
```json
{
  "advancedImageProcessingEnabled": false,
  "realAdvancedImageProcessingEnabled": false,
  "mockProviderAvailable": true,
  "manualFallbackRequired": true,
  "status": "SCAFFOLD_ONLY"
}
```

#### `GET /api/automation-webhooks/health`
```json
{
  "ok": true,
  "health": {
    "providers": [
      {
        "key": "internal_mock",
        "label": "Internal mock automation",
        "manualFallbackAvailable": true,
        "safe": true
      }
      // ... generic_webhook, zapier_webhook, make_webhook, n8n_webhook
    ]
  }
}
```

#### `GET /api/file-storage/health`
```json
{
  "ok": true,
  "health": {
    "results": [
      { "providerKey": "local", "ok": true, "status": "HEALTHY" },
      { "providerKey": "mock", "ok": true, "status": "MOCK" },
      { "providerKey": "google_drive", "ok": false, "status": "NEEDS_AUTH" }
      // ... dropbox, onedrive, s3
    ]
  }
}
```

#### `GET /api/task-notification-integrations/health`
```json
{
  "ok": true,
  "health": {
    "ok": true,
    "providers": [
      {
        "key": "internal_email",
        "label": "Internal mock notification adapter",
        "actions": ["SEND_EMAIL"],
        "health": { "ok": true, "message": "Mock task notification adapter is available." }
      }
      // ... slack, email (real), google_sheets, airtable, trello, clickup, asana, notion
    ]
  }
}
```

#### `GET /api/stripe/webhook`
```json
{
  "ok": true,
  "data": {
    "provider": "stripe",
    "status": "seeded",
    "note": "Use POST with Stripe-Signature for webhook verification."
  }
}
```

#### `GET /api/webhooks/stripe`
```json
{
  "ok": true,
  "data": {
    "provider": "stripe",
    "status": "seeded",
    "note": "Use POST with Stripe-Signature for webhook verification."
  }
}
```

#### `GET /api/webhooks/gumroad`
```json
{
  "ok": true,
  "data": {
    "provider": "gumroad",
    "status": "seeded",
    "note": "POST Gumroad sale payloads here."
  }
}
```

### 3.2 Auth API Endpoints

#### `POST /api/auth/login`
- **Status 200 (success):** Sets `ll_session` cookie (HttpOnly, SameSite=Lax, Secure)
```json
{ "ok": true, "data": { "loggedIn": true } }
```
- **Status 400 (validation):** Body: `{ "ok": false, "code": "auth_error", "message": "[{zod error path: password, code: too_small, minimum: 8}]" }`
- **Status 401 (bad creds):** Body: `{ "ok": false, "code": "invalid_credentials", "message": "Invalid email or password." }`
- **Request shape:** `{ "email": string, "password": string (>=8 chars) }`

#### `POST /api/auth/signup`
- **Status 400 (validation):** Body: `{ "ok": false, "code": "auth_error", "message": "[{zod errors for password (min 8), name, organizationName}]" }`
- **Request shape:** `{ "email": string, "password": string (>=8 chars), "name": string, "organizationName": string }`

#### `POST /api/auth/logout`
- **Status 200:** Clears `ll_session` cookie (Max-Age=0)
```json
{ "ok": true, "data": { "loggedOut": true } }
```

#### `GET /api/auth/me`
- **Status 401 (no session):**
```json
{ "ok": false, "code": "unauthorized", "message": "Authentication required." }
```

#### `GET /api/auth/session`
- **Status 401 (no session):**
```json
{ "ok": false, "code": "unauthorized", "message": "Authentication required." }
```

### 3.3 Auth-Gated API Endpoints (401 Unauthorized)

All return the same 401 shape without a valid `ll_session` cookie:

| Method | Path | Status | Response Shape |
|--------|------|--------|---------------|
| GET | `/api/jobs` | 401 | `{ "ok": false, "code": "unauthorized", "message": "Authentication required." }` |
| GET | `/api/images` | 401 | Same |
| GET | `/api/clients` | 401 | Same |
| GET | `/api/billing` | 401 | Same |
| GET | `/api/credits` | 401 | Same |
| GET | `/api/reports` | 401 | Same |
| GET | `/api/revisions` | 401 | Same |
| GET | `/api/organizations` | 401 | Same |
| GET | `/api/integrations` | 401 | Same |
| GET | `/api/sales-channels/registry` | 401 | Same |
| GET | `/api/external-orders` | 401 | Same |
| GET | `/api/processing` | 401 | Same |
| GET | `/api/image-providers` | 401 | Same |
| GET | `/api/admin/dashboard` | 401 | Same |
| GET | `/api/admin/security/headers` | 401 | Same |
| GET | `/api/agency/dashboard` | 401 | Same |
| GET | `/api/agency/clients` | 401 | Same |
| GET | `/api/agency/team` | 401 | Same |
| GET | `/api/agency/workspaces` | 401 | Same |
| GET | `/api/agency/white-label-settings` | 401 | Same |
| GET | `/api/client/dashboard` | 401 | Same |
| GET | `/api/rbac/permissions` | 401 | Same |
| GET | `/api/rbac/roles` | 401 | Same |
| GET | `/api/admin/qa/dashboard` | 401 | Same |
| GET | `/api/delivery` | 401 | Same |
| GET | `/api/jobs/queue` | 401 | Same |

### 3.4 API Endpoints (401 — V1 Bearer Token)

These routes require a different auth mechanism — `Authorization: Bearer <token>`:

| Method | Path | Status | Error Code |
|--------|------|--------|-----------|
| GET | `/api/v1/jobs` | 401 | `api_unauthorized` — "API authentication required: Bearer token missing." |
| GET | `/api/v1/presets` | 401 | `api_unauthorized` — Same message |
| GET | `/api/v1/webhooks` | 401 | `api_unauthorized` — Same message |

### 3.5 Error Routes (500 Internal)

| Method | Path | Status | Notes |
|--------|------|--------|-------|
| GET | `/api/uploads` | 500 | Returns JSON `{"ok":false,"code":"internal_error","message":"Authentication required."}` — appears to crash before the auth check |

### 3.6 405 Method Not Allowed Routes

These routes exist but do not accept GET — they require POST:

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/auth/logout` | Requires POST |
| GET | `/api/account` | Requires POST |
| GET | `/api/uploads/create-token` | Requires POST |
| GET | `/api/uploads/validate-file` | Requires POST |
| GET | `/api/uploads/complete` | Requires POST |
| GET | `/api/uploads/public-intake` | Requires POST |
| GET | `/api/delivery/create-token` | Requires POST |
| GET | `/api/delivery/links/create` | Requires POST |
| GET | `/api/delivery/manifest` | Requires POST |
| GET | `/api/delivery/marketplace-message` | Requires POST |
| GET | `/api/checkout/package-selection` | Requires POST |
| GET | `/api/pricing/quote` | Requires POST |
| GET | `/api/credits/adjust` | Requires POST |
| GET | `/api/credits/ledger` | Requires POST |
| GET | `/api/presets/selector` | Requires POST |
| GET | `/api/sales-channels/normalize` | Requires POST |
| GET | `/api/sales-channels/import` | Requires POST |
| GET | `/api/sales-channels/manual-order` | Requires POST |
| GET | `/api/etsy/manual-order` | Requires POST |
| GET | `/api/fiverr/manual-order` | Requires POST |
| GET | `/api/upwork/manual-contract` | Requires POST |
| GET | `/api/shopify/manual-order` | Requires POST |
| GET | `/api/taskrabbit/manual-task` | Requires POST |
| GET | `/api/stripe/customer-portal` | Requires POST |
| GET | `/api/quality-control/flagged` | Requires POST |
| GET | `/api/quality-control/bulk-review` | Requires POST |
| GET | `/api/admin/security/csrf` | Requires POST |
| GET | `/api/approvals/jobs/[jobId]/readiness` | Requires POST |
| GET | `/api/notifications/send-test` | Requires POST |
| GET | `/api/client-dashboard/summary` | Requires POST |
| GET | `/api/client-dashboard/jobs` | Requires POST |
| GET | `/api/client-dashboard/downloads` | Requires POST |
| GET | `/api/upsells/opportunities` | Requires POST |
| GET | `/api/upsells/generate` | Requires POST |
| GET | `/api/v1/uploads` | Requires POST |
| GET | `/api/admin/uploads/manual` | Requires POST |
| GET | `/api/jobs/manual` | Requires POST |
| GET | `/api/previews/images/[processedFileId]` | Requires POST or other method |

---

## 4. AUTH BOUNDARY INVENTORY

### Pattern 1: Session Auth (Page-Level, 307 Redirect)
- **Scope:** All client, admin, and agency pages (`/client/*`, `/admin/*`, `/agency/*`)
- **Mechanism:** Next.js middleware or layout-level auth check
- **Unauthenticated behavior:** 307 redirect to `/login?next=<original_path>`
- **Cookie:** `ll_session` (HttpOnly, SameSite=Lax, Secure)

### Pattern 2: Session Auth (API-Level, 401 JSON)
- **Scope:** Most API endpoints (`/api/jobs`, `/api/clients`, `/api/billing`, etc.)
- **Mechanism:** Server-side session check (likely `getServerSession` or cookie parsing)
- **Unauthenticated behavior:** 401 with `{"ok":false,"code":"unauthorized","message":"Authentication required."}`

### Pattern 3: Bearer Token Auth (V1 API)
- **Scope:** `/api/v1/*` routes
- **Mechanism:** `Authorization: Bearer <token>` header
- **Unauthenticated behavior:** 401 with `{"ok":false,"code":"api_unauthorized","message":"API authentication required: Bearer token missing."}`

### Pattern 4: Public (No Auth)
- **Scope:** Landing page, public pages (`/`, `/login`, `/signup`, `/packages`, `/pricing`, `/examples`), health endpoints, catalog endpoints, and seed data endpoints
- **Mechanism:** No auth required

### Auth Boundary Summary

| Boundary | Routes | Unauthenticated Signal |
|----------|--------|----------------------|
| Public | `/`, `/login`, `/signup`, `/packages`, `/pricing`, `/examples`, `/marketplace-sellers`, `/checkout/*` | N/A — always accessible |
| Public API | `/api/health`, `/api/packages`, `/api/presets`, `/api/subscriptions`, `/api/manual-invoices`, `/api/credits/balance`, `/api/presets/validate`, `/api/gumroad/products`, `/api/marketplace-exports/catalog`, `/api/other-sales-channels/catalog`, `/api/reports/catalog`, `/api/adapters/health`, `/api/automation-webhooks/health`, `/api/file-storage/health`, `/api/task-notification-integrations/health`, `/api/advanced-image-processing/health`, `/api/stripe/webhook`, `/api/webhooks/stripe`, `/api/webhooks/gumroad`, `/api/client-dashboard/billing` | N/A — always accessible |
| Session (Page) | `/client/*`, `/admin/*`, `/agency/*` | 307 redirect to `/login` |
| Session (API) | `/api/jobs`, `/api/images`, `/api/clients`, `/api/billing`, `/api/credits`, `/api/reports`, `/api/revisions`, `/api/organizations`, `/api/integrations`, `/api/sales-channels/registry`, `/api/external-orders`, `/api/processing`, `/api/image-providers`, `/api/admin/*`, `/api/agency/*`, `/api/client/dashboard`, `/api/rbac/*`, `/api/delivery`, etc. | 401 JSON |
| Bearer Token | `/api/v1/*` | 401 JSON with `api_unauthorized` code |

---

## 5. STANDARD ERROR CONTRACT

All API responses follow a consistent envelope:

### Success
```json
{
  "ok": true,
  "data": { /* ... */ }
}
```

### Auth Error (Session)
```json
{
  "ok": false,
  "code": "unauthorized",
  "message": "Authentication required."
}
```

### Auth Error (Bearer Token)
```json
{
  "ok": false,
  "code": "api_unauthorized",
  "message": "API authentication required: Bearer token missing."
}
```

### Validation Error
```json
{
  "ok": false,
  "code": "auth_error",
  "message": "[{zod error path, code, message}]"
}
```

### Credential Error
```json
{
  "ok": false,
  "code": "invalid_credentials",
  "message": "Invalid email or password."
}
```

### Internal Error
```json
{
  "ok": false,
  "code": "internal_error",
  "message": "Authentication required."
}
```

---

## 6. KEY OBSERVATIONS

1. **No GraphQL endpoint detected.** `POST /api/graphql` was not tested (no GraphQL route file found in the project routes), and no GraphQL introspection endpoint was discovered. The application is REST-only.

2. **CSRF token endpoint (`/api/csrf/token`)** returns 404 for GET requests — the route file exists at `src/app/api/csrf/token/route.ts` but appears to require POST. When tested, it returned a Next.js prerendered 404 HTML page.

3. **Session cookie `ll_session`** is set on login success. The cookie is HttpOnly, SameSite=Lax, Secure, meaning CSRF protection for state-changing requests relies on SameSite=Lax + the CSRF token mechanism.

4. **`/api/uploads` has a bug** — it returns 500 `internal_error` with "Authentication required." instead of 401. The error handler catches the auth check exception before the normal 401 response can be returned.

5. **All health endpoints are public** — they expose provider configuration and readiness status without authentication.

6. **The application runs in `production` mode** (from `/api/health` response) despite being a dev server. Mock/real integration flags are all disabled.

7. **Public seed data routes** (`/api/packages`, `/api/presets`, `/api/subscriptions`, `/api/manual-invoices`, `/api/credits/balance`) include Codex notes indicating these are seed stubs that need real data sources.
