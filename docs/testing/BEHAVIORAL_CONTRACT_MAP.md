# Behavioral Contract Map — ListingLift

> **Phase 1 deliverable for ELITE E2E verification.**
> Maps all core business workflows with expected inputs, state mutations, and outputs.
> Source: Prisma schema, API route handlers, service interfaces, ARCHITECTURE.md, BUILD_ROADMAP.md.

---

## 1. Stateful Components

### 1.1 Database Models (Prisma, PostgreSQL)
All core entities are multi-tenant via `organizationId`.

| Model | Purpose | Key Status/State Fields |
|-------|---------|------------------------|
| `User` | Auth actor | `accountStatus` (INVITED/ACTIVE/SUSPUSPENDED/DISABLED) |
| `Organization` | Tenant root | `organizationType` (PLATFORM/AGENCY/SELLER/CLIENT_WORKSPACE) |
| `Membership` | User-Org binding | `roleKey`, `clientId`, `agencyScope` |
| `Role` | RBAC role definition | `key`, `system` |
| `Permission` | Granular action key | `key` (unique, e.g. `upload:images`, `manage:jobs`) |
| `Client` | Customer record | `status` (LEAD/ACTIVE/PAUSED/ARCHIVED), `creditBalance` |
| `SalesChannel` | Source platform config | `key`, `channelType`, `mode`, `enabled` |
| `ExternalOrder` | Normalized incoming order | `paymentStatus`, `uploadStatus`, `fulfillmentStatus`, `normalizationStatus` |
| `Job` | Central fulfillment unit | `status` (15 states), `paymentStatus`, `fulfillmentStatus` |
| `Image` | Original upload record | `status`, `uploadStatus`, `sha256` |
| `ProcessedFile` | Output artifact | `status`, `approvedStatus`, `qualityScore` |
| `Package` | Service offering | `key`, `category`, `priceMinCents`, `active` |
| `PlatformPreset` | Output configuration | `key`, `width`, `height`, `format`, `background` |
| `CreditLedger` | Credit transactions | `amount`, `balanceAfter`, `entryType` |
| `Subscription` | Recurring billing | `status` (TRIALING/ACTIVE/CANCELLED/EXPIRED) |
| `InvoicePayment` | Payment record | `provider`, `status` |
| `RevisionRequest` | Client revision | `status` (OPEN/ACCEPTED/RESOLVED/CANCELLED) |
| `DeliveryLink` | Secure download link | `status` (DRAFT/ACTIVE/EXPIRED/REVOKED) |
| `DeliveryArchive` | ZIP export | `status` (PLANNED/GENERATING/READY_FOR_REVIEW/APPROVED/FAILED) |
| `QualityReview` | QC assessment | `status`, `score`, `finalDeliveryBlocked` |
| `QualityFlag` | Individual issue | `severity`, `status`, `blocksDelivery` |
| `ManualApprovalGate` | Delivery gate | `status`, `finalDeliveryAllowed` |
| `PreviewGallery` | Before/after UI | `status`, `clientPreviewEnabled` |
| `EncryptedSecret` | Secure credential storage | `ciphertext`, `keyVersion` |
| `AuditLog` | Immutable action log | `action`, `targetType` |
| `UploadToken` | Scoped upload link | `purpose`, `expiresAt`, `revokedAt` |
| `IntegrationConnection` | External provider config | `mode`, `enabled` |
| `ImageProcessingRun` | Processing batch | `status`, `totalImages`, `manualFallbackRequired` |

External API / Webhook event models: `StripeWebhookEvent`, `GumroadWebhookEvent`, `WebhookEvent`, `AutomationEvent`.

Sales-channel-specific models: `FiverrGigMapping`, `FiverrWorkflowEvent`, `UpworkOfferMapping`, `UpworkWorkflowEvent`, `TaskrabbitServiceMapping`, `EtsyListingPackMapping`, `ShopifyImagePackMapping` — each with their own status/event enums.

### 1.2 Encrypted Secret Store
Model `EncryptedSecret` holds `ciphertext` per `(organizationId, providerKey, name)`. No plaintext secrets stored in any model.

### 1.3 Audit Trail
Every business action writes to `AuditLog` with `action`, `targetType`, `targetId`, `actorUserId`, `metadata`.

---

## 2. External API Boundaries

| Boundary | Route | Auth | Method |
|----------|-------|------|--------|
| Stripe Webhook | `POST /api/stripe/webhook` | Signature verification | POST |
| Gumroad Webhook | `POST /api/gumroad/webhook` | Signature verification | POST |
| Upload Intake | `POST /api/uploads` | Session + RBAC (`upload:images`) | POST |
| Upload Token Create | `POST /api/uploads/create-token` | Session + RBAC | POST |
| Delivery Link Create | `POST /api/delivery/links/create` | Session + RBAC (`send:delivery`) | POST |
| Processing Start | `POST /api/processing/jobs/[jobId]/start` | Session + RBAC (`manage:jobs`) | POST |
| Manual Order Create | `POST /api/sales-channels/manual-order` | Session + RBAC (`create:manual-orders`) | POST |
| API Access (v1) | `GET/POST /api/v1/*` | Token-based | Any |
| Health Check | `GET /api/health` | None | GET |
| CSRF Token | `GET /api/csrf/token` | Session | GET |
| Automation Webhooks | `POST /api/v1/webhooks` | Signature | POST |
| Account Settings | `GET/PUT /api/account` | Session | GET/PUT |

Helper services: `auth-session-service`, `csrf-protection-service`, `authorization-service`, `route-helpers` (guardedPost, parseJson).

---

## 3. Core Business Workflows

### 3.1 User Authentication & Session Management

**Actors:** Anonymous user, registered user

**Input:**
- Signup: email, password, name
- Login: email, password
- Session: HTTP-only cookie with session token

**State mutations:**
- `User` created (accountStatus: INVITED)
- `Organization` created (default platform org)
- `Membership` created (roleKey: SUPER_ADMIN for first user)
- `Session` created (tokenHash, expiresAt)
- Audit log: `auth.signup`, `auth.login`, `auth.logout`

**Output:**
- Cookie `__session` (HTTP-only, Secure in production)
- Session context: `{ userId, organizationId, role, clientId?, agencyScope? }`
- Error: `Authentication required.` if no session

**Edge cases:**
- Rate-limited login attempts
- Rotate session on login
- Production rejects mock session headers
- `deletedAt` soft-delete check on User

---

### 3.2 Tenant Hierarchy & RBAC

**Actors:** Super admin, Operator, Agency admin, Client owner, Client viewer, etc.

**Models:** `Organization` (parent/child hierarchy), `Membership`, `Role`, `Permission`, `RolePermission`

**Input:**
- Organization creation
- Membership assignment (roleKey, clientId, agencyScope)
- Route resolves session → asserts permission via `assertPermission(session, 'permission:key')`

**State mutations:**
- Organization tree linked by `parentOrganizationId`
- RolePermission join table grants permissions to roles
- Membership links user to org + role + optional client scope

**Output:**
- 403 forbidden if permission check fails
- Tenant-isolated queries via `organizationId` filter
- Client isolation via `clientId` on Membership

**Edge cases:**
- Client cannot see another client's jobs/files
- Agency admin sees only agency's clients
- Revenue requires explicit billing permission

---

### 3.3 Sales Channel Normalization

**Actors:** Admin, webhook handler

**Models:** `SalesChannel`, `ExternalOrder`, `Job`, `Client`

**Input (normalized schema):**
```json
{
  "channelKey": "fiverr|upwork|gumroad|stripe|manual|...",
  "mode": "MANUAL|API|WEBHOOK|EMAIL_PARSER|CSV_IMPORT",
  "payload": {
    "externalOrderId": "...",
    "buyerName": "...",
    "buyerEmailOrUsername": "...",
    "packageKey": "...",
    "orderAmountCents": 4999,
    "currency": "USD",
    "deadline": "2026-06-20T00:00:00Z",
    "revisionAllowance": 2
  },
  "dryRun": true  // Phase 7 returns plan; Codex wires persistence
}
```

**State mutations:**
- `ExternalOrder` created with `normalizationStatus: NORMALIZED`
- Dedupe check via `(salesChannelId, externalOrderId)` unique constraint
- Optional: `Client` upsert (matched by email/channel)
- Optional: `Job` created linked to external order
- Audit log: `sales-channel.order_normalized`

**Output:**
- Normalization plan with matched client, mapped package, job plan
- Duplicate detection → 409 Conflict
- Dry-run mode until live persistence is wired

**Dedupe rules:**
- `@@unique([salesChannelId, externalOrderId])` on ExternalOrder
- `@@unique([organizationId, dedupeKey])` for content-based dedupe

---

### 3.4 Package & Pricing Management

**Actors:** Admin, public checkout

**Models:** `Package`

**Key states:** `active` (boolean), `category`, `priceMinCents`/`priceMaxCents`, `billingInterval`

**Input:**
- Admin creates/edits package with key, name, price, image allowance, revision allowance
- Checkout selects package by `key` or `publicSlug`

**State mutations:**
- Package rows seeded with 7 required keys:
  - `QuickCleanup10` ($25–$49, 10 images)
  - `MarketplaceListing25` ($99–$249, 25 images)
  - `MarketplaceListing50` ($99–$249, 50 images)
  - `ProductLaunch50` ($299–$799, 50 images)
  - `ProductLaunch100` ($299–$799, 100 images)
  - `MonthlySellerRetainer` ($199–$999/mo)
  - `AgencyWhiteLabel` ($1,000–$3,000/mo)

**Output:**
- Package list filtered by `active` and `sortOrder`
- Safe claims: `"Formatted as platform-ready drafts. Seller review recommended before publishing."`
- No guarantee language for marketplace compliance, sales, ranking

---

### 3.5 Platform Preset System

**Actors:** Admin, processing pipeline

**Models:** `PlatformPreset`

**Key fields:** `key`, `width`, `height`, `format`, `background`, `folderPath`, `namingConvention`, `sellerReviewRequired`

**Required presets (15):**
- AmazonMainImageDraft, AmazonSecondaryImageDraft
- EtsyListingSquare, EbayListingSquare
- ShopifyProductImage
- TikTokShopVertical
- InstagramSquare, InstagramStoryReelVertical
- FacebookMarketplaceSquare
- PinterestPin
- WebsiteProductGallery
- GumroadProductOfferImage
- RestaurantMenuItemImage
- RealEstateListingCleanup
- CustomClientPreset

**Input:**
- Admin enables/edits presets (values are data-driven, not hard-coded)
- Processing selects presetKeys to apply

**State mutations:**
- Preset rows seeded with dimensions, format, folder path
- Preset drives output creation in `ProcessedFile` and `ImageProcessingStep`

**Output:**
- Each preset generates one or more `ProcessedFile` records per image
- Marketplace-safe language: `"platform-ready draft; seller-review recommended"`

---

### 3.6 Upload & File Intake

**Actors:** Client, Admin

**Models:** `UploadToken`, `UploadBatch`, `UploadEvent`, `Image`

**Input:**
- Secure upload token (hashed, expiring, purpose-scoped)
- File upload with MIME type, size, optional ZIP

**State mutations:**
- `UploadToken` created with `tokenHash`, `purpose`, `expiresAt`, `maxFiles`, `maxBytesPerFile`
- `UploadBatch` created (`status: PLANNED → VALIDATING → ACCEPTED/REJECTED`)
- `Image` created per file (`status: ORIGINAL_UPLOADED`, `uploadStatus: COMPLETE`)
- `UploadEvent` logged per batch/file
- Job `uploadStatus` → `COMPLETE` when all images received

**Output:**
- File metadata: originalName, sizeBytes, mimeType, sha256, width/height extracted
- Rejected files: invalid type, size exceeded, ZIP slip detected, executable detected

**Security rules:**
- `UploadToken.tokenHash` stored — never raw token
- File type and size validated server-side
- Original files preserved (never overwritten)
- ZIP slip protection enforced
- Executables rejected

---

### 3.7 Job Lifecycle & Admin Queue

**Actors:** Admin, system

**Models:** `Job`, `JobStatusEvent`

**Status progression (15 states):**
```
DRAFT → WAITING_FOR_UPLOAD → UPLOAD_RECEIVED → PROCESSING_QUEUED → PROCESSING
  → WAITING_FOR_REVIEW → FLAGGED_OUTPUTS → APPROVED
  → READY_FOR_DELIVERY → DELIVERED → COMPLETED
  (branches: REVISION_REQUESTED → REPROCESSING; CANCELLED; FAILED)
```

**Input:**
- Admin creates job manually or via sales channel normalization
- Job fields: title, client, package, deadline, priority, targetPlatform

**State mutations:**
- `Job` created with `status: DRAFT`, `jobNumber` (unique per org)
- `JobStatusEvent` logged on every transition
- Audit log: `job.created`, `job.status_changed`

**Output:**
- Job queue filterable by status, source, deadline, priority
- Deadline warnings: `DeadlineWarningLevel` (NONE/UPCOMING/DUE_SOON/OVERDUE/BLOCKED)

---

### 3.8 Image Processing Pipeline

**Actors:** System (triggered by admin or automation)

**Models:** `ImageProcessingRun`, `ImageProcessingStep`, `ImageProcessingError`, `ProcessedFile`

**Supported operations (enums):**
- METADATA_READ, REMOVE_BACKGROUND, TRANSPARENT_PNG, WHITE_BACKGROUND
- WEBP, RESIZE, COMPRESS, PRESET_OUTPUT

**Input:**
- Job ID, image IDs, provider key, preset keys, dryRun flag
- Provider adapters: Mock, Remove.bg, Cloudinary, Replicate, Clipdrop-style

**State mutations:**
- `ImageProcessingRun` created (`status: PLANNED → QUEUED → RUNNING → COMPLETED/FAILED`)
- `ImageProcessingStep` created per image/operation/preset
- `ProcessedFile` created per output (`status: CREATED → PROCESSING → READY_FOR_REVIEW/FLAGGED/FAILED`)
- On error: `ImageProcessingError` logged (`retryable`, `manualFallbackRequired`)
- Job status: `PROCESSING → WAITING_FOR_REVIEW`

**Output:**
- Processed files per preset (PNG, JPG, WebP, etc.)
- Quality score per output
- Run summary: totalImages, totalCreatedOutputs, totalFailedOutputs

**Edge cases:**
- Manual fallback required for non-retryable errors
- Provider secrets stored encrypted in `EncryptedSecret`
- Mock provider used by default

---

### 3.9 Preview Gallery & Before/After

**Actors:** Admin, Client

**Models:** `PreviewGallery`, `PreviewGalleryItem`

**Input:**
- Gallery creation per job (galleryKey)
- Item visibility toggle (ADMIN_ONLY / CLIENT_VISIBLE / HIDDEN)

**State mutations:**
- `PreviewGallery` with `status` (DRAFT → READY_FOR_REVIEW → CLIENT_VISIBLE → ARCHIVED)
- Each item links image ↔ processed file with before/after pair metadata

**Output:**
- Gallery with sorted items, approval status per item, quality score
- Bulk approval/rejection routes exist

---

### 3.10 Quality Control & Flagged Outputs

**Actors:** Admin, QC reviewer

**Models:** `QualityReview`, `QualityFlag`, `QualityReviewEvent`

**Input:**
- QC review per job/image/processedFile (reviewKey)
- Flag creation: flagKey, category, severity (INFO/WARNING/BLOCKER), message

**State mutations:**
- `QualityReview` with `status`, `score`, `finalDeliveryBlocked: true` (default)
- `QualityFlag` with `status` (OPEN → ACKNOWLEDGED → RESOLVED/DISMISSED)
- Blocking flags prevent delivery (`blocksDelivery: true`)
- `QualityReviewEvent` logged per action

**Output:**
- QC dashboard with flagged output list
- Bulk review route for batch approval

---

### 3.11 Manual Approval Gate & Revision Workflow

**Actors:** Admin

**Models:** `ManualApprovalGate`, `ManualApprovalEvent`, `RevisionRequest`, `RevisionWorkflowEvent`

**Gate status progression:**
```
WAITING_FOR_QC → READY_FOR_ADMIN_REVIEW → BLOCKED_BY_FLAGS
  → BLOCKED_BY_REVISIONS → APPROVED → REJECTED → REVISION_REQUESTED
```

**Input:**
- Admin approves/rejects individual processed files or entire job
- Gate reads unresolved flags, open revisions, manual replacement requirements

**State mutations:**
- `ManualApprovalGate` tracks `unresolvedBlockingFlags`, `openRevisionCount`
- `finalDeliveryAllowed` set to true only after approval gate passes
- `RevisionRequest` with `status` lifecycle: OPEN → ACCEPTED → IN_PROGRESS → RESOLVED

**Output:**
- Approval readiness check: returns blocking reasons if delivery not allowed
- All delivery paths gated behind `finalDeliveryAllowed`

---

### 3.12 Delivery & ZIP Archive

**Actors:** Admin, Client (via link)

**Models:** `DeliveryArchive`, `DeliveryArchiveFile`, `DeliveryLink`, `DeliveryDownloadEvent`, `DeliveryNotificationLog`

**Input:**
- Archive plan: selects processed files, presets, folder structure
- Delivery link creation: expiry, maxDownloads, recipient email hash

**State mutations:**
- `DeliveryArchive` with `status` (PLANNED → GENERATING → READY_FOR_REVIEW → APPROVED → FAILED)
- `DeliveryArchiveFile` per output (status: PLANNED → INCLUDED/MISSING/FAILED)
- `DeliveryLink` (status: DRAFT → ACTIVE → EXPIRED/REVOKED)
- `DeliveryDownloadEvent` logged per download attempt (allowed/denied)
- `DeliveryNotificationLog` for email/marketplace message sends

**Output:**
- ZIP file with platform-specific folders, manifest JSON, readme, before/after
- Secure download link with token hash
- Marketplace delivery message template

**Security rules:**
- Approved-only delivery (configurable: `approvedOnly: true`)
- Seller review required flag on every archive file
- Token revoked after maxDownloads reached

---

### 3.13 Billing & Payment

**Actors:** Client, Admin, Stripe/Gumroad

**Models:** `StripeCheckoutSession`, `StripeWebhookEvent`, `GumroadWebhookEvent`, `GumroadProductMapping`, `ManualInvoice`, `InvoicePayment`, `CreditLedger`, `Subscription`, `SubscriptionEntitlement`

**Input:**
- Stripe checkout: package/subscription/retainer/agency session creation
- Stripe webhook: `checkout.session.completed`, `invoice.paid`, etc.
- Gumroad webhook: `sale` event with product permalink
- Manual invoice: admin creates, client pays
- Manual credit adjustment: admin adds/removes credits

**State mutations:**
- `StripeCheckoutSession` (DRAFT → CREATED → COMPLETED/EXPIRED/FAILED)
- `GumroadWebhookEvent` (RECEIVED → VERIFIED → JOB_CREATED → CREDITS_APPLIED)
- `ManualInvoice` (DRAFT → SENT → PAID/VOID/OVERDUE)
- `InvoicePayment` linked to payments
- `CreditLedger` entries with `balanceAfter`, `entryType` (PURCHASE/MANUAL_ADJUSTMENT/JOB_DEBIT/etc.)
- `Subscription` with `entitlements` (monthly image allowance tracking)

**Output:**
- Payment plan for Stripe webhook fulfillment
- Gumroad product → job creation mapping
- Manual invoice payment confirmation
- Credit balance recalculated

---

### 3.14 Sales-Channel-Specific Workflows

Each channel has its own mapping models and event types:

| Channel | Mapping Model | Event Model | Workflow Status Enum |
|---------|--------------|-------------|---------------------|
| **Fiverr** | `FiverrGigMapping` | `FiverrWorkflowEvent` | FiverrWorkflowStatus (14 states) |
| **Upwork** | `UpworkOfferMapping` | `UpworkWorkflowEvent` | UpworkWorkflowStatus (15 states) |
| **Taskrabbit** | `TaskrabbitServiceMapping` | `TaskrabbitWorkflowEvent` | (manual intake) |
| **Etsy** | `EtsyListingPackMapping` | `EtsyWorkflowEvent` | (manual/export) |
| **Shopify** | `ShopifyImagePackMapping` | `ShopifyWorkflowEvent` | (CSV/OAuth) |
| **Social Commerce** | `SocialCommerceChannelMapping` | `SocialCommerceWorkflowEvent` | (manual) |
| **Marketplace Export** | `MarketplaceExportMapping` | `MarketplaceExportWorkflowEvent` | (Amazon/eBay manual) |

**Pattern:** Order captured → files needed → files received → processing → review → delivery → revision → completed. Each step logged as a workflow event with dedupe key.

**Safety rules:**
- No automated messaging that violates platform TOS
- No scraping private marketplace pages
- Manual fallback always available
- All delivery uses marketplace-safe language
- No guaranteed marketplace approval/ranking/sales claims

---

### 3.15 Reports & Upsells

**Models:** `Report`, `UpsellOffer`

**Input:**
- Report generation: delivery summary, image quality, listing recommendations, monthly cleanup, white-label
- Upsell creation: offerType, title, body, suggestedPriceCents

**State mutations:**
- `Report` (DRAFT → WAITING_FOR_APPROVAL → APPROVED → SENT → ARCHIVED)
- `UpsellOffer` (DRAFT → READY → SENT → ACCEPTED/DECLINED → ARCHIVED)

**Output:**
- Report PDF/excerpt with approval gate
- Upsell sent to client with CTA

---

### 3.16 Agency White-Label Mode

**Models:** `BrandSetting`, `Organization` (type: AGENCY), `Membership` (agencyScope)

**Input:**
- Agency admin creates client workspaces (child orgs)
- Brand settings: logoUrl, colors, customDomain, hideListingLiftBranding

**State mutations:**
- Organization hierarchy: parent agency → child client workspaces
- BrandSetting per org: branded delivery footer, portal name, support email

**Output:**
- White-labeled delivery ZIP, reports, client portal
- Agency-level billing and queue management

---

### 3.17 Automation Webhooks

**Models:** `AutomationWebhookSubscription`, `AutomationWebhookDelivery`, `AutomationDeadLetter`, `AutomationEvent`

**Input:**
- External system (Zapier/Make/n8n) sends webhook payload
- Payload matched to subscription by provider + event type

**State mutations:**
- `AutomationWebhookDeliverivery` logged per trigger
- Delivery failures routed to `AutomationDeadLetter`
- Triggers: new order, upload received, processing done, review needed, download ready, etc.

**Output:**
- Action executed (create job, send email, create Slack message, update CRM)

---

### 3.18 API Access Layer (v1)

**Models:** (API tokens with scopes)

**Routes:** `/api/v1/uploads`, `/api/v1/jobs`, `/api/v1/images`, `/api/v1/presets`, `/api/v1/deliveries/[deliveryId]`, `/api/v1/webhooks`

**Input:**
- API token with scoped permissions

**State mutations:**
- Token-based jobs, uploads, image queries, delivery access

**Output:**
- RESTful JSON responses with `{ ok: true, data }` / `{ ok: false, code, message }` format

---

## 4. API Response Contract

All API routes return a standard shape:

```typescript
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string; details?: unknown }
```

Error codes used: `internal_error`, `invalid_json`, `missing_organization`, `duplicate_external_order`, plus route-specific codes.

Auth errors: thrown `Error('Authentication required.')` → mapped to 500 via `mapServiceError`. CSRF errors: `CsrfRejectionError` → mapped to 403.

---

## 5. Key Architectural Patterns

| Pattern | Implementation |
|---------|---------------|
| **Multi-tenancy** | `organizationId` on every entity; query scope enforced throughout services |
| **RBAC** | `Permission` registry → `RolePermission` join → `Membership` with `roleKey` → `assertPermission()` middleware |
| **Adapter pattern** | Sales channels, image providers, file storage, payments all use adapter interfaces |
| **Dry-run / plan-first** | Routes return normalized plans; Codex/persistence wired later |
| **Event sourcing** | `JobStatusEvent`, `AuditLog`, `QualityReviewEvent`, `ManualApprovalEvent`, `UploadEvent` — immutable event streams |
| **Soft delete** | `deletedAt: DateTime?` on all major entities |
| **Encrypted secrets** | `EncryptedSecret` with `ciphertext` + `keyVersion`; never plaintext |
| **Idempotency** | Unique constraints on external order IDs, webhook event IDs, dedupe keys |
| **Approval gating** | `ManualApprovalGate.finalDeliveryAllowed` blocks all delivery until admin approves |
| **Audit trail** | Every state mutation logged to `AuditLog` with actor, action, target, metadata |
| **Safety-first language** | All package/preset/delivery copy includes disclaimers — no marketplace guarantees |
