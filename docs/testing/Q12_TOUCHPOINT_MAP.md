# Q12 Phase 1 — Persona & Touchpoint Mapping

## 1. Persona Inventory

### P1. Anonymous Visitor (Public)
- **Role:** Unauthenticated user browsing the public site.
- **Entry point:** Direct URL, search engine, social link.
- **Surfaces:** Home page, 404 page.
- **Capabilities:** View marketing content, see pricing grid, use upload dropzone (pre-auth shell).
- **Limitations:** Cannot access protected routes (`/admin`, `/client`, `/agency`). Redirected to `/login` if trying.
- **Auth status:** No session cookie.

### P2. Registered Buyer / Client
- **Role:** Authenticated user purchasing image-processing services and managing jobs.
- **Entry point:** Login flow, email verification.
- **Protected prefix:** `/client/*`
- **Surfaces:** Dashboard, job detail, upload link usage, delivery download, preview gallery, account settings.
- **Capabilities:** View own jobs, upload images, download approved deliveries, view previews, request revisions, manage account settings.
- **Auth status:** Session cookie (`ll_session`), CSRF token required for mutations.

### P3. Listing Provider / Agency User
- **Role:** Agency staff managing client jobs and sales channels.
- **Entry point:** Login flow.
- **Protected prefix:** `/agency/*`
- **Surfaces:** Agency dashboard, client management, sales channel integrations, bulk operations.
- **Capabilities:** Import external orders, normalize sales channel data, create manual orders, manage delivery, generate marketplace messages.
- **Auth status:** Session cookie with agency-scoped membership.

### P4. Admin / Superadmin
- **Role:** Platform operator with full access.
- **Entry point:** Login flow.
- **Protected prefix:** `/admin/*`
- **Surfaces:** Admin dashboard, job management, user management, quality control, audit logs, manual uploads, security settings, QA verification ledger.
- **Capabilities:** Approve/reject jobs and outputs, flag quality issues, bulk-review, manage all organizations, manual upload override, reset rate limiter, run QA tests.
- **Auth status:** Session cookie with `SUPER_ADMIN` or `OPERATOR` role key.

### P5. API Consumer (Programmatic)
- **Role:** External system or script making HTTP calls.
- **Entry point:** Direct API calls to endpoints.
- **Surfaces:** All REST API endpoints.
- **Capabilities:** List jobs, create upload tokens, issue delivery links, import sales channels, interact via webhooks.
- **Auth status:** Session-based (cookie) or demo header (`x-demo-user-id`, `x-demo-organization-id`, `x-demo-role`) for dev/test. Webhook endpoints use signature verification (Stripe HMAC, Gumroad HMAC-SHA256).

### P6. Mobile User (Responsive)
- **Role:** Any persona accessing via mobile browser.
- **Surfaces:** All React pages rendered responsively via Tailwind breakpoints.
- **Considerations:** Touch-friendly upload dropzone, stacked layouts on narrow viewports, accessible tap targets.
- **Auth status:** Same as underlying persona.

### P7. Screen-Reader User (A11y Baseline)
- **Role:** Any persona using assistive technology.
- **Surfaces:** All public and protected pages.
- **Considerations:** Semantic HTML (headings, landmarks, ARIA labels), focus management, error announcements, keyboard-navigable forms and dialogs, color contrast.
- **Auth status:** Same as underlying persona.

---

## 2. Touchpoint Map — All Interaction Surfaces

### 2.1 Frontend Pages & Routes

| # | Route | Page | Personas | UI Components | Auth |
|---|-------|------|----------|---------------|------|
| 1 | `/` | Home / Landing | P1, P6, P7 | PublicShell, PackageGrid, SafeClaimBanner, BeforeAfterCard, UploadDropzone, LinkButton | Public |
| 2 | `/upload/[token]` | Secure Upload | P2, P6, P7 | PublicShell, UploadDropzone, FileValidationTable, UploadIntakeChecklist, UploadTokenStatusCard, ZipSafetyPanel | Token-based (no session needed) |
| 3 | `/upload/[token]/error` | Upload Error | P2 | PublicShell, error state with reset button | Token-based |
| 4 | `/delivery/[token]` | Secure Download | P2, P6, P7 | PublicShell, DeliveryDownloadCard, DownloadSecurityPanel | Token-based |
| 5 | `/not-found` | 404 | All | Minimal 404 UI | Public |
| 6 | `/login` | Login (implicit) | P2-P4 | Login form (redirect target from middleware) | Public |
| 7 | `/pricing` | Pricing (referenced from home) | P1, P2 | Pricing page (link target) | Public |
| 8 | `/examples` | Examples (referenced from home) | P1, P2 | Examples page (link target) | Public |
| 9 | `/admin/*` | Admin area | P4 | Admin shell, job list, QC panels, audit logs | Session + RBAC |
| 10 | `/client/*` | Client dashboard | P2 | Client shell, job dashboard, preview gallery | Session + RBAC |
| 11 | `/agency/*` | Agency dashboard | P3 | Agency shell, client list, sales channel mgmt | Session + RBAC |

### 2.2 Forms

| # | Form | Route | Fields | Validation | States |
|-----|------|-------|--------|-----------|--------|
| 1 | Signup | POST /api/auth/signup | email (email, max 254), password (min 8), name (min 1), organizationName (min 1) | Zod schema | Loading, validation error, success (201), 409 conflict |
| 2 | Login | POST /api/auth/login (implied) | email (email), password (min 1) | Zod schema | Loading, invalid credentials, success |
| 3 | Account settings | PATCH /api/account | name (optional), currentPassword (optional), newPassword (optional, min 8) | Zod schema | Loading, validation error, success |
| 4 | Email verification | POST /api/auth/verify-email | token (min 1) | Zod schema | Loading, invalid token, success |
| 5 | Upload batch | POST /api/uploads | organizationId, jobId, files[], source | Manual parse | 201 created, 401/403 auth errors, 422 validation |
| 6 | Upload token issue | POST /api/uploads/create-token | organizationId, jobId, expiresInMinutes, maxFileSize, allowedTypes, maxFiles, allowedMimeTypes | Manual parse | 201 created, CSRF error, permission error |
| 7 | Upload complete | POST /api/uploads/complete | token, uploadBatchId, files[] | Manual parse | 201 created, validation error |
| 8 | Sales channel normalize | POST /api/sales-channels/normalize | channelKey, mode, payload, dryRun | Zod schema | 200 result, 400 invalid payload |
| 9 | Sales channel import | POST /api/sales-channels/import | orders[], channelKey, mode, dryRun | Zod schema | 200 result with per-item errors |
| 10 | Manual order | POST /api/sales-channels/manual-order | channelKey, payload, dryRun | Zod schema | 201 created |
| 11 | Stripe checkout (package) | POST /api/stripe/checkout/package | packageKey, purpose, quantity, imageQuantity, buyerEmail, metadata | Manual parse | 201 created, price validation error |
| 12 | Stripe checkout (subscription) | POST /api/stripe/checkout/subscription | Same as package + amountCents, stripePriceId | Manual parse | 201 created, price validation error |
| 13 | Stripe checkout (retainer) | POST /api/stripe/checkout/retainer | Same as package | Manual parse | 201 created, price validation error |
| 14 | Stripe checkout (agency) | POST /api/stripe/checkout/agency | Same as package | Manual parse | 201 created, price validation error |
| 15 | Job approval | POST /api/jobs/[jobId]/approval | readiness, decision, jobId | Zod schema | 200 result, idempotency guard |
| 16 | Job approve (standalone) | POST /api/approvals/jobs/[jobId]/approve | jobId, decision=APPROVE_JOB | Zod schema | 200 result, idempotency guard |
| 17 | Job reject (standalone) | POST /api/approvals/jobs/[jobId]/reject | jobId, decision=REJECT_JOB | Zod schema | 200 result, idempotency guard |
| 18 | Output approve | POST /api/approvals/outputs/[processedFileId]/approve | processedFileId, decision=APPROVE_OUTPUT | Zod schema | 200 result, idempotency guard |
| 19 | Output reject | POST /api/approvals/outputs/[processedFileId]/reject | processedFileId, decision=REJECT_OUTPUT | Zod schema | 200 result, idempotency guard |
| 20 | Quality flag | POST /api/quality-control/outputs/[processedFileId]/flag | processedFileId, issue, severity | Zod schema | 201 created, idempotency guard |
| 21 | Quality review | POST /api/quality-control/outputs/[processedFileId]/review | processedFileId, decision, notes | Zod schema | 200 result, idempotency guard |
| 22 | Flag resolve | POST /api/quality-control/flags/[flagId]/resolve | flagId, resolution, notes | Zod schema | 200 result, idempotency guard |
| 23 | Bulk quality review | POST /api/quality-control/bulk-review | processedFileIds[], decision, notes | Zod schema | 200 result, per-item auth enforcement |
| 24 | Bulk preview approval | POST /api/previews/bulk-approval | selectedProcessedFileIds[], decision | Zod schema | 200 result, per-item auth enforcement |
| 25 | Revision request | POST /api/revisions/request | jobId, processedFileIds[], notes | Zod schema | 200 result, idempotency guard |
| 26 | Revision status update | POST /api/revisions/[revisionId]/status | revisionId, status, notes | Zod schema | 200 result, idempotency guard |
| 27 | Delivery link issue | POST /api/delivery/links/create | jobId, expiresInDays, maxDownloads | Zod schema | 201 created |
| 28 | Delivery link revoke | POST /api/delivery/links/[linkId]/revoke | linkId (path param) | — | 200 result, 404/409 states |
| 29 | Delivery send | POST /api/delivery/jobs/[jobId]/send | jobId, link settings, email settings | Zod schema | 201 created |
| 30 | Delivery email preview | POST /api/delivery/jobs/[jobId]/email-preview | jobId, template variables | Zod schema | 200 result |
| 31 | ZIP draft | POST /api/delivery/zip/draft | selectedPresetKeys, jobId, output filters | Zod schema | 200 result, permission check |
| 32 | Manifest generation | POST /api/delivery/manifest | selectedPresetKeys, jobId | Zod schema | 200 CSV manifest |
| 33 | Marketplace message | POST /api/delivery/marketplace-message | jobId, platform, message template | Zod schema | 200 message preview |
| 34 | Preview image detail | POST /api/previews/images/[processedFileId] | processedFileId, zoom level, annotations | Zod schema | 200 result |
| 35 | Client preview gallery | POST /api/previews/client/jobs/[jobId] | jobId, client filter | Zod schema | 200 gallery (approved only) |
| 36 | Admin job previews | GET/POST /api/previews/admin/jobs/[jobId] | jobId | Zod schema | 200 result |
| 37 | Admin upload manual | POST /api/admin/uploads/manual | files, jobId, sourceKind=ADMIN_UPLOAD | Manual parse | 201 created, audit logged |
| 38 | External order create | POST /api/external-orders | channelKey, payload, organizationId | Zod schema | 201 created |
| 39 | External order dedupe | POST /api/external-orders/dedupe-check | externalIds[] | Zod schema | 200 result, duplicate list |

### 2.3 API Endpoints — Complete Catalog

#### Auth Endpoints
| Method | Endpoint | Auth | Input Schema | Output | Error States |
|--------|----------|------|-------------|--------|-------------|
| POST | /api/auth/signup | Public | signupSchema (email, password, name, organizationName) | 201 { user, session } | 409 conflict (duplicate email), 422 validation |
| POST | /api/auth/verify-email | Public | verifyEmailSchema (token) | 200 success | 400 invalid token |
| POST | /api/auth/logout | Session | — | 200 { loggedOut } | 401 no session |
| PATCH | /api/account | Session + CSRF | accountSettingsSchema (name, currentPassword, newPassword) | 200 { user } | 401, 422 |

#### Upload Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| GET | /api/uploads | Session | — | 200 { phase, module, supported, security } | 401, 403 |
| POST | /api/uploads | Session + CSRF | uploadBatchIntakeRequestSchema | 201 { dryRun, plan } | 401, 403, 422 |
| POST | /api/uploads/create-token | Session + CSRF | uploadTokenIssueSchema | 201 { uploadToken, persistableTokenDraft } | 401, 403 |
| POST | /api/uploads/complete | Session + CSRF | uploadCompleteRequestSchema | 201 { completionPlan } | 401, 403 |

#### Sales Channel Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| POST | /api/sales-channels/normalize | Session | salesChannelNormalizationRequestSchema | 200 { adapterKey, normalized } | 400 invalid, 401, 422 |
| POST | /api/sales-channels/import | Session + CSRF | salesChannelNormalizationRequestSchema { orders[] } | 200 { total, succeeded, failed } | 401, 403, 422 |
| GET | /api/sales-channels/manual-order | Session | — | 200 { items } | 401, 403 |
| POST | /api/sales-channels/manual-order | Session + CSRF | salesChannelNormalizationRequestSchema | 201 { plan } | 401, 403 |
| GET | /api/external-orders | Session (guarded) | — | 200 { items } | 401, 403 |
| POST | /api/external-orders | Session + CSRF | salesChannelNormalizationRequestSchema | 201 { plan } | 401, 403, 422 |
| POST | /api/external-orders/dedupe-check | Session + CSRF | externalIds[] | 200 { duplicates } | 401, 403 |

#### Stripe Billing Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| POST | /api/stripe/checkout/package | Public/API | StripeCheckoutRequestInput | 201 { checkoutUrl, sessionId } | 422 price validation |
| POST | /api/stripe/checkout/subscription | Public/API | StripeCheckoutRequestInput | 201 { checkoutUrl, sessionId } | 422 price validation |
| POST | /api/stripe/checkout/retainer | Public/API | StripeCheckoutRequestInput | 201 { checkoutUrl, sessionId } | 422 price validation |
| POST | /api/stripe/checkout/agency | Public/API | StripeCheckoutRequestInput | 201 { checkoutUrl, sessionId } | 422 price validation |
| POST | /api/stripe/webhook | Webhook (sig) | StripeWebhookEvent | 200 { verification, plan } | 400 sig invalid, 400 missing secret |
| GET | /api/stripe/webhook | Public | — | 200 { provider, status } | — |

#### Gumroad Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| POST | /api/gumroad/webhook | Webhook (sig) | Form/JSON payload | 200 { verification, plan } | 400 sig invalid, 400 empty payload |
| GET | /api/gumroad/webhook | Public | — | 200 { provider, status } | — |

#### CSRF Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| GET | /api/csrf/token | Session | — | 200 { csrfToken, expiresAt } | 401 |
| POST | /api/csrf/token | Session | — | 200 { csrfToken, expiresAt } | 401 |

#### Job Management Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| GET | /api/jobs/[jobId]/approval | Session | — | 200 { jobId, note } | 401, 403 |
| POST | /api/jobs/[jobId]/approval | Session + CSRF | manualJobApprovalSchema | 200 { readiness, decision } | 401, 403, idempotency |
| GET | /api/jobs/[jobId]/previews | Session | — | 200 preview data | 401, 403 |

#### Approval Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| POST | /api/approvals/jobs/[jobId]/approve | Session + CSRF | manualJobApprovalSchema | 200 { approval } | 401, 403, idempotency |
| POST | /api/approvals/jobs/[jobId]/reject | Session + CSRF | manualJobApprovalSchema | 200 { rejection } | 401, 403, idempotency |
| POST | /api/approvals/jobs/[jobId]/readiness | Session + CSRF | approvalReadinessSchema | 200 { readiness } | 401, 403 |
| POST | /api/approvals/outputs/[processedFileId]/approve | Session + CSRF | outputApprovalSchema | 200 { outputApproval } | 401, 403, idempotency |
| POST | /api/approvals/outputs/[processedFileId]/reject | Session + CSRF | outputApprovalSchema | 200 { outputRejection } | 401, 403, idempotency |

#### Quality Control Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| POST | /api/quality-control/outputs/[processedFileId]/flag | Session + CSRF | createQualityFlagSchema | 201 { flag } | 401, 403, idempotency |
| POST | /api/quality-control/outputs/[processedFileId]/review | Session + CSRF | qualityReviewDecisionSchema | 200 { reviewDecision } | 401, 403, idempotency |
| POST | /api/quality-control/flags/[flagId]/resolve | Session + CSRF | resolveQualityFlagSchema | 200 { resolution } | 401, 403, idempotency |
| POST | /api/quality-control/bulk-review | Session + CSRF | bulkQualityReviewSchema | 200 { bulkReview } | 401, 403, per-item auth |
| GET | /api/quality-control/flagged | Session | — | 200 flagged items | 401, 403 |
| GET | /api/quality-control/jobs/[jobId] | Session | — | 200 QC data | 401, 403 |

#### Preview Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| POST | /api/previews/bulk-approval | Session + CSRF | bulkPreviewApprovalRequestSchema | 200 { plan } | 401, 403, per-item auth |
| POST | /api/previews/images/[processedFileId] | Session + CSRF | previewImageDetailRequestSchema | 200 { detail } | 401, 403 |
| POST | /api/previews/client/jobs/[jobId] | Session + CSRF | previewGalleryRequestSchema | 200 { gallery } | 401, 403 |
| GET/POST | /api/previews/admin/jobs/[jobId] | Session | — | 200 preview data | 401, 403 |

#### Revision Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| POST | /api/revisions/request | Session + CSRF | createRevisionRequestSchema | 200 { revision } | 401, 403, idempotency |
| POST | /api/revisions/[revisionId]/status | Session + CSRF | updateRevisionStatusSchema | 200 { revisionStatusUpdate } | 401, 403, idempotency |

#### Delivery Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| POST | /api/delivery/links/create | Session + CSRF | deliveryLinkIssueSchema | 201 { link, tokenHash } | 401, 403 |
| POST | /api/delivery/links/[linkId]/revoke | Session + CSRF | — | 200 { linkId, status, revokedAt } | 401, 403, 404, 409 |
| POST | /api/delivery/zip/draft | Session + CSRF | deliveryArchivePlanRequestSchema | 200 { zipFileName, entries } | 401, 403 |
| POST | /api/delivery/manifest | Session + CSRF | deliveryArchivePlanRequestSchema | 200 { manifestCsv, rowCount } | 401, 403 |
| POST | /api/delivery/marketplace-message | Session + CSRF | marketplaceDeliveryMessageSchema | 200 message preview | 401, 403 |
| POST | /api/delivery/create-token | Session + CSRF | deliveryLinkIssueSchema | 201 { token } | 401, 403 |
| POST | /api/delivery/archive-plan | Session + CSRF | deliveryArchivePlanRequestSchema | 200 plan | 401, 403 |
| POST | /api/delivery/jobs/[jobId]/send | Session + CSRF | deliveryLinkIssueSchema | 201 { draft } | 401, 403 |
| POST | /api/delivery/jobs/[jobId]/email-preview | Session + CSRF | deliveryEmailPreviewSchema | 200 email preview | 401, 403 |

#### Admin Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| POST | /api/admin/security/upload-guard | Session + CSRF | security guard payload | 200 | 401, 403 |
| POST | /api/admin/uploads/manual | Session + CSRF | uploadCompleteRequestSchema (ADMIN_UPLOAD) | 201 { manualUploadPlan } | 401, 403, audit |
| GET | /api/admin/qa/verification-ledger | Session | — | 200 ledger data | 401, 403 |

#### Meta/Utility Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| GET | /api/listings | Rate-limited | — | 200 { totalJobs, recentJobs, elapsedMs } | 429 rate limit, 503 circuit breaker |
| POST | /api/test/reset-rate-limiter | Dev only | — | 200 { message } | — |

#### Webhook (Alternate Path) Endpoints
| Method | Endpoint | Auth | Input | Output | States |
|--------|----------|------|-------|--------|--------|
| POST | /api/webhooks/gumroad | Webhook (sig) | Form/JSON | 200 | 400 |

### 2.4 Modals, Dialogs & Overlays
*(Inferred from component imports — some are direct page content, not modals)*

| # | Component/Pattern | Surface | Description |
|---|------------------|---------|-------------|
| 1 | UploadDropzone | Home page, Upload page | Drag-and-drop file input with visual feedback |
| 2 | FileValidationTable | Upload page | Table showing file validation results |
| 3 | UploadIntakeChecklist | Upload page | Progress checklist for upload steps |
| 4 | UploadTokenStatusCard | Upload page | Token validity status display |
| 5 | ZipSafetyPanel | Upload page | ZIP inspection results panel |
| 6 | DeliveryDownloadCard | Delivery page | Download button with conditions/blockers |
| 7 | DownloadSecurityPanel | Delivery page | Security information about download |
| 8 | BeforeAfterCard | Home page | Before/after image comparison |
| 9 | SafeClaimBanner | Home page | Compliance-safe marketing banner |
| 10 | PackageGrid | Home page | Pricing packages grid |
| 11 | Error boundary (reset) | Upload error page | Error UI with retry button |

### 2.5 Toast Notifications
*(Implicit pattern — no dedicated toast component seen in file scan)*
- Server responses include structured `{ ok, data }` / `{ ok, error }` envelopes used by `jsonOk`, `jsonFail`, `mapServiceError`
- Convention for frontend consumption: `{ ok: true, data: {...} }` or `{ ok: false, error: { code, message } }`
- Error codes used: VALIDATION_ERROR, SESSION_REQUIRED, FORBIDDEN, NOT_FOUND, CONFLICT, RATE_LIMITED, INTERNAL_SERVER_ERROR, CSRF_TOKEN_*, SERVICE_UNAVAILABLE

### 2.6 Middleware — Request Interception

| # | Middleware Behavior | Routes Affected | Action |
|---|--------------------|----------------|--------|
| 1 | Block non-standard HTTP methods | All routes | Return 405 with Allow header |
| 2 | Apply security headers | All routes | CSP, HSTS, X-Content-Type-Options, etc. |
| 3 | Session check for protected prefixes | /admin/*, /client/*, /agency/* | Redirect to /login if no session cookie or demo headers |
| 4 | Demo header passthrough | Protected routes | Allow x-demo-* headers in dev/test mode |

---

## 3. Workflow Maps — Top 10 User Journeys

### Journey 1: Signup → Email Verify → Login → Dashboard
1. **Anonymous visitor** lands on `/`
2. Navigates to `/login` → submits signup form with email, password, name, org name
3. `POST /api/auth/signup` creates User + Organization + Membership + Session
4. Returns 201 with session cookie set
5. Receives verification token (dev: returned inline; prod: emailed)
6. `POST /api/auth/verify-email` with token
7. Redirected to protected dashboard (`/client` or `/admin` depending on role)
8. **Touchpoints:** Home page, login page (implicit), signup form, verify-email endpoint, protected prefix redirect via middleware

### Journey 2: Browse Listings → Filter → View Detail → Contact
1. **Anonymous visitor** views home page with marketing content
2. CTA links to `/pricing` or `/examples`
3. **Touchpoints:** Home page, pricing page, examples page (all public)

### Journey 3: Create Listing → Upload Images → Publish → Manage
1. **Authenticated admin/client** generates upload token: `POST /api/uploads/create-token`
2. Sends secure upload link to client (or uses directly)
3. **Client (anonymous via token)** visits `/upload/[token]`
4. Uploads images via dropzone → validated client-side
5. `POST /api/uploads/complete` commits the batch
6. Job transitions: DRAFT → WAITING_FOR_UPLOAD → UPLOAD_RECEIVED
7. **Touchpoints:** Upload token endpoint, upload page, upload complete endpoint, Job model status transitions

### Journey 4: Checkout → Payment → Confirmation
1. **Buyer** selects a package (QuickCleanup10, MarketplaceListing, ProductLaunch)
2. Redirected to Stripe: `POST /api/stripe/checkout/package`
3. Completes payment on Stripe
4. Stripe sends webhook: `POST /api/stripe/webhook` (events: checkout.session.completed, invoice.paid)
5. Webhook verified, idempotency checked, fulfillment plan created
6. **Touchpoints:** Package selection, Stripe checkout endpoints, Stripe webhook endpoint, idempotency service

### Journey 5: Admin — User Management, Quality Control, Audit Review
1. **Admin** logs in, lands on `/admin/*` dashboard
2. Views job list → selects a job
3. Reviews outputs via preview endpoints: `POST /api/previews/admin/jobs/[jobId]`, `POST /api/previews/images/[processedFileId]`
4. Flags issues: `POST /api/quality-control/outputs/[processedFileId]/flag`
5. Reviews flags: `POST /api/quality-control/outputs/[processedFileId]/review`
6. Bulk reviews: `POST /api/quality-control/bulk-review`
7. Resolves flags: `POST /api/quality-control/flags/[flagId]/resolve`
8. Approves job: `POST /api/approvals/jobs/[jobId]/approve`
9. Checks audit log via `GET /api/admin/qa/verification-ledger`
10. **Touchpoints:** All admin pages, all QC endpoints, all approval endpoints, audit endpoint

### Journey 6: Sales Channel Import → Normalize → Job Creation
1. **Agency user** imports orders: `POST /api/sales-channels/import`
2. Each order normalized via sales channel adapter
3. Normalized payloads become external orders: `POST /api/external-orders`
4. Deduplication check: `POST /api/external-orders/dedupe-check`
5. Manual orders created: `POST /api/sales-channels/manual-order`
6. **Touchpoints:** Sales channel import endpoint, normalize endpoint, external order endpoints, dedupe endpoint

### Journey 7: Quality Check → Flag → Manual Replacement → Reprocess
1. **QC reviewer** reviews processed outputs
2. Flags bad output: `POST /api/quality-control/outputs/[processedFileId]/flag`
3. Output status: READY_FOR_REVIEW → FLAGGED
4. Admin reviews flag → requests reprocess OR marks for manual replacement
5. Manual replacement uploaded: `POST /api/admin/uploads/manual` (sourceKind=ADMIN_UPLOAD)
6. Replacement marker: `POST /api/manual-replacements/marker`
7. **Touchpoints:** QC flag/review endpoints, admin manual upload, manual replacement marker

### Journey 8: Revision Request → Reprocess → Re-Delivery
1. **Client** requests revisions: `POST /api/revisions/request`
2. Revision status across `POST /api/revisions/[revisionId]/status`
3. Job status: APPROVED → REVISION_REQUESTED → REPROCESSING
4. After reprocess, go through QC + approval again
5. **Touchpoints:** Revision request/status endpoints, job status transitions

### Journey 9: Delivery — ZIP Generation → Manifest → Link Issue → Download
1. **Admin** creates delivery archive plan: `POST /api/delivery/zip/draft`
2. Generates manifest CSV: `POST /api/delivery/manifest`
3. Issues delivery links: `POST /api/delivery/links/create`
4. Sends delivery: `POST /api/delivery/jobs/[jobId]/send`
5. Optionally previews marketplace message: `POST /api/delivery/marketplace-message`
6. Optionally previews email: `POST /api/delivery/jobs/[jobId]/email-preview`
7. **Client** accesses `/delivery/[token]` → downloads ZIP
8. Admin can revoke link: `POST /api/delivery/links/[linkId]/revoke`
9. **Touchpoints:** All delivery endpoints, download page, revoke endpoint, email preview

### Journey 10: Admin — Full Job Lifecycle End-to-End
1. Client signs up → uploads images
2. Processing pipeline runs (via image provider)
3. QC review, possible flags/revisions
4. Approval workflow (job + per-output)
5. Final approval check: `GET /api/jobs/[jobId]/approval` (readiness)
6. Full approval: `POST /api/jobs/[jobId]/approval`
7. Delivery packaging → ZIP → link issue → send
8. Client downloads → job status: COMPLETED
9. **Touchpoints:** Every API endpoint in the app, all auth layers, all state transitions

---

## 4. Error & Edge State Catalog

### 4.1 HTTP Status Code Coverage
| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | All GET/POST returning ok |
| 201 | Created | Checkout session, upload token, delivery link |
| 400 | Bad Request | Invalid webhook payload, missing signature |
| 401 | Unauthorized | Missing/expired session |
| 403 | Forbidden | Insufficient permission, invalid CSRF |
| 404 | Not Found | Invalid token, missing job/output |
| 405 | Method Not Allowed | TRACE/CONNECT/TRACK methods |
| 409 | Conflict | Duplicate email, duplicate webhook, stale state |
| 422 | Validation Error | Zod schema validation failure |
| 429 | Rate Limited | Too many requests to /api/listings |
| 500 | Internal Error | Unhandled exceptions |
| 503 | Service Unavailable | Circuit breaker open |

### 4.2 Per-Touchpoint States

| Touchpoint | Loading | Empty | Success | Error | Edge Case |
|-----------|---------|-------|---------|-------|-----------|
| Home page | Skeleton shell | — | Full render | — | No packages configured |
| Upload page ([token]) | Token resolving | "No files yet" | Files validated | Invalid token → 404 | Expired token, max files exceeded |
| Upload error | — | — | Reset button provided | Error detail shown | Network failure mid-upload |
| Delivery page ([token]) | Token resolving | "No files to download" | Download ready | Invalid/expired token → 404 | Revoked link, max downloads reached |
| Signup form | Button disabled + spinner | — | Redirect to dashboard | Email taken, validation errors | Weak password, duplicate email |
| All POST endpoints | Idempotency check | — | Structured response | Auth/permission/validation error | Duplicate request (idempotency) |
| Webhook endpoints | Processing verification | — | Fulfillment plan | Signature invalid, parse error | Duplicate webhook event |
| Sales channel import | Per-item parallel (limit=10) | Empty orders array | Per-item results | Per-item errors collected | Mixed success/failure batch |
| Rate-limited route | — | — | Normal response | 429 + Retry-After header | Circuit breaker open → 503 |

---

## 5. Cross-Reference Integrity

| Map Element | Files Referenced |
|------------|-----------------|
| Personas | Middleware auth prefixes, Prisma RoleKey enum, route permission checks |
| Frontend pages | src/app/layout.tsx, src/app/page.tsx, src/app/upload/[token]/page.tsx, src/app/upload/[token]/error.tsx, src/app/delivery/[token]/page.tsx, src/app/not-found.tsx |
| API routes | All files under src/app/api/ (45+ route files) |
| Schemas | src/schemas/auth.ts, upload.ts, stripe-billing.ts, sales-channel (referenced via imports) |
| DB models | prisma/schema.prisma (5000+ lines, 60+ models, 80+ enums) |
| Middleware | src/middleware.ts, src/domain/auth-constants.ts |
| Auth services | src/server/auth/auth-service.ts, session-service.ts, csrf-protection-service.ts |
| Error handling | src/lib/api-response.ts (jsonOk, jsonFail, mapServiceError) |
