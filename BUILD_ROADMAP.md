# BUILD_ROADMAP.md — ListingLift Canonical Execution Authority

> Canonicalized from `ListingLift_BUILD_ROADMAP.md` on 2026-05-11.  
> This file is the phase-by-phase execution authority.  
> Codex must not skip, merge, reorder, or silently remove phases.

---

# BUILD_ROADMAP.md — ListingLift

## 1. Roadmap Summary

ListingLift is a service-first, software-powered product photo cleanup, marketplace image-pack generation, ecommerce visual optimization, multi-platform order intake, and white-label fulfillment platform.

The core offer is:

> “Upload your messy product photos. I’ll turn them into clean, professional, ready-to-use product images for Amazon, Etsy, eBay, Shopify, TikTok Shop, Instagram, and your website.”

This roadmap turns the ListingLift architecture into an executable Replit-ready build plan. The MVP must be sellable immediately and support: public landing pages, package checkout, Stripe checkout, Gumroad webhook intake, image upload, admin dashboard, manual sales-channel order entry, background removal, marketplace preset resizing, before/after previews, ZIP export, email delivery, manual approval, revision workflow, and revenue/source tracking.

The scalable version expands into client dashboards, subscriptions, agency white-label fulfillment, Shopify/Etsy workflows, Fiverr/Upwork semi-automated intake, Taskrabbit/local-service tracking, product image quality scoring, AI listing-image advisor, bulk upload folders, API access, revision workflows, brand kits, automated upsells, ad creative generation, listing optimization, product-page improvement, custom presets, monthly reports, sales-channel ROI dashboard, and marketplace-to-direct-client conversion tracking.

This roadmap includes all integrations named in the source architecture:

- Stripe
- Gumroad
- PayPal later
- Manual invoices
- Fiverr
- Upwork
- Taskrabbit
- Freelancer.com
- PeoplePerHour
- Guru
- Contra
- Thumbtack
- Bark
- Etsy
- Shopify
- Facebook Marketplace/manual tracking
- Instagram/manual tracking
- TikTok Shop/manual tracking
- Amazon seller export/manual workflow
- eBay export/manual workflow
- WooCommerce later
- Google Drive
- Dropbox
- OneDrive later
- Box later
- Direct upload
- Remove.bg
- Cloudinary
- Replicate
- Clipdrop-style background removal provider
- Open-source background removal later
- Local image processing worker later
- Zapier
- Make
- n8n
- Slack
- Email
- Google Sheets
- Airtable
- Trello
- ClickUp
- Asana
- Notion

---

## 2. Development Principles

- Build in small verified increments.
- Every phase must leave the app runnable.
- Use strict TypeScript.
- Every database change requires a migration.
- Seed data must be idempotent.
- Never hard-code secrets.
- Never log secrets.
- Never store plaintext marketplace tokens, payment keys, file-storage tokens, image-provider API keys, SMTP credentials, OAuth tokens, or webhook secrets.
- Never store marketplace passwords.
- Do not scrape private marketplace pages.
- Do not automate Fiverr, Upwork, Taskrabbit, Etsy, or marketplace messaging without approved official integration.
- Prefer official APIs, approved webhooks, manual import, CSV import, and email-parser workflows over scraping.
- Normalize every external order into one internal ListingLift job model.
- Every integration must use an adapter interface.
- Every integration must support mock, disabled, manual, or feature-flagged modes.
- Never require real paid APIs in automated tests.
- Mock image providers before real calls.
- Preserve original uploads.
- Never overwrite originals.
- Every paid fulfillment path must have manual fallback.
- Every final delivery must require admin approval unless explicitly configured otherwise.
- Treat Amazon, Etsy, TikTok Shop, eBay, Shopify, and other marketplace outputs as platform-ready drafts requiring seller review.
- Do not guarantee marketplace compliance automatically.
- Do not guarantee sales, ranking, conversion, or marketplace approval results.
- Keep platform presets data-driven.
- Keep output folders, naming conventions, and dimensions driven by preset configuration.
- Keep revenue/source attribution on every job.
- Prefer boring reliable code over clever code.
- Keep ARCHITECTURE.md, BUILD_ROADMAP.md, and AGENTS.md synchronized.

---

## 3. Recommended Repository Structure

```txt
.
├── README.md
├── ARCHITECTURE.md
├── BUILD_ROADMAP.md
├── AGENTS.md
├── SECURITY.md
├── CHANGELOG.md
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
├── vitest.config.ts
├── playwright.config.ts
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── .env.example
├── .gitignore
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── pricing/page.tsx
│   ├── packages/page.tsx
│   ├── checkout/[packageKey]/page.tsx
│   ├── upload/[uploadToken]/page.tsx
│   ├── delivery/[deliveryToken]/page.tsx
│   ├── examples/page.tsx
│   ├── marketplace-sellers/page.tsx
│   ├── agency-white-label/page.tsx
│   ├── auth/
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── jobs/page.tsx
│   │   ├── jobs/[jobId]/page.tsx
│   │   ├── jobs/[jobId]/review/page.tsx
│   │   ├── jobs/[jobId]/delivery/page.tsx
│   │   ├── flagged-outputs/page.tsx
│   │   ├── clients/page.tsx
│   │   ├── packages/page.tsx
│   │   ├── presets/page.tsx
│   │   ├── sales-channels/page.tsx
│   │   ├── external-orders/page.tsx
│   │   ├── gumroad/page.tsx
│   │   ├── fiverr/page.tsx
│   │   ├── upwork/page.tsx
│   │   ├── taskrabbit/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── revenue/page.tsx
│   │   ├── upsells/page.tsx
│   │   ├── integrations/page.tsx
│   │   └── billing/page.tsx
│   ├── client/
│   │   ├── page.tsx
│   │   ├── upload/page.tsx
│   │   ├── jobs/page.tsx
│   │   ├── preview-gallery/page.tsx
│   │   ├── downloads/page.tsx
│   │   ├── revisions/page.tsx
│   │   ├── billing/page.tsx
│   │   └── upgrade/page.tsx
│   ├── agency/
│   │   ├── page.tsx
│   │   ├── workspaces/page.tsx
│   │   ├── queue/page.tsx
│   │   ├── white-label/page.tsx
│   │   ├── billing/page.tsx
│   │   └── team/page.tsx
│   └── api/
│       ├── auth/
│       ├── clients/
│       ├── jobs/
│       ├── uploads/
│       ├── images/
│       ├── processing/
│       ├── presets/
│       ├── packages/
│       ├── delivery/
│       ├── revisions/
│       ├── reports/
│       ├── sales-channels/
│       ├── external-orders/
│       ├── integrations/
│       ├── billing/
│       ├── webhooks/
│       └── health/route.ts
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── public/
│   ├── admin/
│   ├── client/
│   ├── agency/
│   ├── jobs/
│   ├── uploads/
│   ├── images/
│   ├── preview/
│   ├── presets/
│   ├── packages/
│   ├── delivery/
│   ├── revisions/
│   ├── reports/
│   ├── sales-channels/
│   ├── integrations/
│   ├── billing/
│   └── upsells/
│
├── server/
│   ├── api/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── tenant.service.ts
│   │   ├── rbac.service.ts
│   │   ├── client.service.ts
│   │   ├── package.service.ts
│   │   ├── preset.service.ts
│   │   ├── sales-channel.service.ts
│   │   ├── external-order.service.ts
│   │   ├── job.service.ts
│   │   ├── upload.service.ts
│   │   ├── image.service.ts
│   │   ├── processing.service.ts
│   │   ├── background-removal.service.ts
│   │   ├── resizing.service.ts
│   │   ├── compression.service.ts
│   │   ├── naming.service.ts
│   │   ├── folder-generation.service.ts
│   │   ├── zip.service.ts
│   │   ├── preview.service.ts
│   │   ├── quality-control.service.ts
│   │   ├── delivery.service.ts
│   │   ├── revision.service.ts
│   │   ├── credit.service.ts
│   │   ├── subscription.service.ts
│   │   ├── billing.service.ts
│   │   ├── report.service.ts
│   │   ├── upsell.service.ts
│   │   ├── notification.service.ts
│   │   ├── integration.service.ts
│   │   ├── automation.service.ts
│   │   ├── audit-log.service.ts
│   │   └── white-label.service.ts
│   ├── image-processing/
│   │   ├── types.ts
│   │   ├── pipeline.ts
│   │   ├── file-inspector.ts
│   │   ├── background.ts
│   │   ├── resize.ts
│   │   ├── compress.ts
│   │   ├── format-conversion.ts
│   │   ├── quality-score.ts
│   │   ├── manifest.ts
│   │   └── zip.ts
│   ├── adapters/
│   │   ├── payments/
│   │   ├── sales-channels/
│   │   ├── file-storage/
│   │   ├── image-providers/
│   │   ├── ecommerce/
│   │   ├── automation/
│   │   └── task-tools/
│   ├── db/
│   ├── security/
│   ├── jobs/
│   └── observability/
│
├── lib/shared/
├── types/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── security/
│   ├── adapter-contract/
│   ├── migration/
│   └── fixtures/
├── docs/
└── scripts/
```

---

## 4. Build Phases Overview

| Phase | Name | Primary Outcome |
|---:|---|---|
| 0 | Repository Initialization | Replit-ready TypeScript app skeleton |
| 1 | Design System and UI Shell | Public, admin, client, agency UI foundations |
| 2 | Database Schema and Migrations | Core entities for jobs, clients, images, orders, credits, subscriptions, presets, reports |
| 3 | Authentication and Sessions | Signup, login, logout, protected routes |
| 4 | Tenant, Client, RBAC, and Agency Model | Multi-client and white-label-ready access |
| 5 | Packages and Pricing | Quick Cleanup, Marketplace Listing, Product Launch, Retainer, Agency packages |
| 6 | Platform Preset System | Marketplace image dimensions, folders, file formats, naming |
| 7 | Sales Channel Normalization Layer | All sources normalize to ListingLift jobs |
| 8 | Direct Upload and File Intake | Secure image/ZIP uploads and upload links |
| 9 | Job Creation and Admin Queue | Central fulfillment queue and job lifecycle |
| 10 | Image Processing Provider Layer | Remove.bg, Cloudinary, Replicate, Clipdrop-style, mock provider |
| 11 | Core Image Processing Pipeline | Background removal, PNG/JPG/WebP, resizing, compression |
| 12 | Naming, Folders, Manifest, ZIP | Platform folders, smart file names, manifest, ZIP |
| 13 | Preview Gallery and Before/After | Admin/client previews and approval UI |
| 14 | Quality Control and Flagged Outputs | QC checklist, quality scoring, bad output flags |
| 15 | Manual Approval and Revision Workflow | Approve, reprocess, revise, manual-edit path |
| 16 | Delivery and Email Notifications | Download page, ZIP delivery, email/messages |
| 17 | Stripe Checkout and Billing | Pay-per-pack, subscription, retainer, credits |
| 18 | Gumroad Checkout/Webhook Intake | Productized checkout and automatic job creation |
| 19 | Credits, Subscriptions, Manual Invoices | Credit ledger, monthly allowance, dashboard access |
| 20 | Fiverr Workflow | Manual/semi-automated Fiverr fulfillment |
| 21 | Upwork Workflow | Manual/semi-automated contracts and retainers |
| 22 | Taskrabbit Workflow | Local-service intake and conversion tracking |
| 23 | Other Sales Channels | Freelancer, PeoplePerHour, Guru, Contra, Thumbtack, Bark, etc. |
| 24 | Etsy Workflow | Etsy presets, order tracking, shop visual consistency |
| 25 | Shopify Workflow | SKU CSV import, Shopify presets, OAuth scaffold |
| 26 | Social Commerce Workflows | TikTok Shop, Instagram, Facebook Marketplace, Pinterest |
| 27 | Amazon, eBay, WooCommerce Workflows | Manual/export workflows and compliance-safe wording |
| 28 | File Storage Integrations | Google Drive, Dropbox, OneDrive, Box |
| 29 | Automation Webhooks | Zapier, Make, n8n triggers/actions |
| 30 | Notifications and Task/Data Exports | Slack, Email, Google Sheets, Airtable, Trello, ClickUp, Asana, Notion |
| 31 | Advanced Image Processing | Open-source BG removal, local workers, quality scoring, AI advisor |
| 32 | Reports and Upsell Engine | Image quality reports, delivery summaries, retainer/ad/listing upsells |
| 33 | Client Dashboard | Uploads, jobs, previews, downloads, revisions, credits, billing |
| 34 | Admin Dashboard and Revenue Analytics | Jobs, revenue, source tracking, conversion, retainer alerts |
| 35 | Agency White-Label Mode | Client workspaces, branded delivery, bulk queue, agency billing |
| 36 | API Access and Advanced Scaffold | Agency API/shared upload portal |
| 37 | Security Hardening | Upload safety, secrets, RBAC, tokens, rate limits |
| 38 | Full Testing and QA | Unit/integration/E2E/adapter/security tests |
| 39 | Replit Production Deployment | Env, migrations, smoke tests, deployment verification |
| 40 | Post-Launch Backlog | ROI-prioritized growth improvements |

---

## 5. Phase 0 — Repository Initialization

### Goal

Create a clean, runnable, Replit-compatible TypeScript repository with baseline tooling, tests, environment validation, and docs.

### Deliverables

- Full-stack app scaffold
- Strict TypeScript
- Linting and formatting
- Test setup
- Environment validation
- Health endpoint
- README.md
- ARCHITECTURE.md
- BUILD_ROADMAP.md
- AGENTS.md
- SECURITY.md
- CHANGELOG.md

### Specific Implementation Tasks

1. Initialize the Replit-compatible app.
2. Install TypeScript, React, Tailwind, Prisma, Zod, Vitest, Playwright, ESLint, Prettier, Sharp or equivalent, and ZIP utility.
3. Configure strict TypeScript and path aliases.
4. Add scripts: `dev`, `build`, `start`, `typecheck`, `lint`, `format`, `test`, `test:unit`, `test:integration`, `test:e2e`, `test:security`, `test:adapter-contract`, `db:migrate`, `db:seed`, `smoke`, `verify-env`, `security-check`.
5. Create public landing placeholder.
6. Create `/api/health`.
7. Add `.env.example` with database, auth, encryption, storage, upload, Stripe, Gumroad, email, image-provider, integration, and rate-limit variables.
8. Add initial docs.
9. Add env validator, health endpoint test, and landing smoke test.

### Acceptance Criteria

- App starts in Replit.
- Health endpoint returns safe JSON.
- Typecheck, lint, tests, build, and smoke pass.
- No real secrets in repo.
- Docs exist.

### Tests to Run

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run smoke
```

### Security Checks

- `.env` ignored.
- Production rejects weak secrets.
- Health endpoint does not leak config.

### Common Failure Modes

- Image-processing dependency fails in Replit.
- Env validation too strict for local dev.
- Replit start command runs dev mode.

### Anti-Drift Notes

- Do not build product features yet.
- Do not add real integrations yet.

---

## 6. Phase 1 — Design System and UI Shell

### Goal

Build reusable UI foundations for public sales pages, admin operations, client dashboard, and agency white-label dashboard.

### Deliverables

- Public marketing shell
- Auth shell
- Admin shell
- Client shell
- Agency shell
- Package/pricing cards
- Upload dropzone
- Preview gallery components
- Before/after cards
- Job status badges
- Source channel badges
- Credit balance cards
- Loading, empty, and error states

### Specific Implementation Tasks

1. Create modern ecommerce-service SaaS visual direction.
2. Build UI primitives: Button, Card, DataTable, Input, Select, Badge, Modal, Toast, Tabs, Skeleton, EmptyState, ErrorState.
3. Build specialized components: UploadDropzone, ImageCard, BeforeAfterCard, JobStatusBadge, SourceChannelBadge, CreditBalanceCard, ProgressBar.
4. Create public routes: home, pricing, packages, examples, marketplace sellers, agency white-label.
5. Create admin/client/agency shells.
6. Add nav structures for jobs, clients, packages, presets, sales channels, integrations, billing, reports, revenue, uploads, downloads, revisions.
7. Add responsive behavior and accessibility basics.

### Acceptance Criteria

- Public, admin, client, and agency shells render.
- Navigation works.
- Upload/gallery components exist.
- Loading/empty/error states exist.

### Tests to Run

```bash
npm run typecheck
npm run lint
npm run test:e2e -- ui-shell
```

### Security Checks

- No secrets exposed in client bundle.

### Common Failure Modes

- UI imports server code.
- Gallery assumes files exist.

### Anti-Drift Notes

- Do not implement upload logic yet.

---

## 7. Phase 2 — Database Schema and Migrations

### Goal

Create the core ListingLift database schema.

### Required Core Models

- User
- Organization
- Membership
- Role
- Permission
- Client
- SalesChannel
- ExternalOrder
- Job
- Image
- ProcessedFile
- Package
- PlatformPreset
- CreditLedger
- Subscription
- InvoicePayment
- RevisionRequest
- Report
- WebhookEvent
- UpsellOffer
- DeliveryLink
- IntegrationConnection
- EncryptedSecret
- AutomationEvent
- AuditLog
- BrandSetting

### Required Sales Channel Keys

- Direct
- Stripe
- Gumroad
- Fiverr
- Upwork
- Taskrabbit
- Freelancer
- PeoplePerHour
- Guru
- Contra
- Thumbtack
- Bark
- Etsy
- Shopify
- FacebookMarketplace
- Instagram
- TikTokShop
- AmazonManual
- EbayManual
- GoogleBusinessProfile
- Craigslist
- Nextdoor
- Discord
- Skool
- Circle
- LinkedIn
- YouTube
- XTwitter
- Lemon8
- Pinterest
- ProductHunt
- IndieHackers
- AppSumo
- ChamberOfCommerce
- Yelp

### Required Package Keys

- QuickCleanup10
- MarketplaceListing25
- MarketplaceListing50
- ProductLaunch50
- ProductLaunch100
- MonthlySellerRetainer
- AgencyWhiteLabel
- Custom

### Required Preset Keys

- AmazonMainImageDraft
- AmazonSecondaryImageDraft
- EtsyListingSquare
- EbayListingSquare
- ShopifyProductImage
- TikTokShopVertical
- InstagramSquare
- InstagramStoryReelVertical
- FacebookMarketplaceSquare
- PinterestPin
- WebsiteProductGallery
- GumroadProductOfferImage
- RestaurantMenuItemImage
- RealEstateListingCleanup
- CustomClientPreset

### Specific Implementation Tasks

1. Create Prisma schema.
2. Add enums for statuses, roles, permissions, packages, presets, channels, integration modes, output types, file formats.
3. Add tenant indexes for organization, client, job, channel, order, status, createdAt.
4. Add uniqueness constraints for user email, org slug, external order ID per channel, package key, preset key.
5. Create migration.
6. Create idempotent seed with demo admin, org, client, default packages, presets, channels, demo job, demo images, mock outputs.
7. Add tenant helpers.
8. Add migration and seed tests.

### Acceptance Criteria

- Migration applies cleanly.
- Seed runs repeatedly.
- Default packages, presets, and channels exist.
- Jobs link to source channel.
- External orders link to internal jobs.
- Credits/subscriptions represented.
- No plaintext secret storage.

### Tests to Run

```bash
npm run db:migrate
npm run db:seed
npm run test:migration
npm run test:integration -- db
npm run typecheck
npm run lint
```

### Security Checks

- Secrets only in encrypted secret table.
- Audit logs exist.
- Tenant helpers exist.

### Common Failure Modes

- External orders cannot map to jobs.
- Presets hard-coded instead of seeded.
- Credits stored without ledger.

### Anti-Drift Notes

- Preserve source attribution on every job.

---

## 8. Phase 3 — Authentication and Sessions

### Goal

Implement signup, login, logout, sessions, protected routes, and account settings.

### Deliverables

- Signup
- Login
- Logout
- Session handling
- Protected routes
- Password hashing
- Account settings
- Auth tests

### Specific Implementation Tasks

1. Create auth schemas.
2. Implement password hashing.
3. Signup creates user, organization, and owner membership.
4. Login normalizes email, validates credentials, rate-limits attempts, rotates session.
5. Add logout.
6. Protect admin/client/agency routes.
7. Audit auth events.

### Acceptance Criteria

- User can sign up, log in, log out.
- Protected routes require auth.
- Session cookie is HTTP-only.
- Password hash never returned.

### Tests to Run

```bash
npm run test:integration -- auth
npm run test:e2e -- auth
npm run test:security -- auth
```

### Security Checks

- Login rate-limited.
- Session cookie secure in production.

---

## 9. Phase 4 — Tenant, Client, RBAC, and Agency Model

### Goal

Implement multi-client, multi-role, and white-label-ready access control.

### Roles

- Super admin
- Operator
- Agency admin
- Client owner
- Client viewer
- Fulfillment reviewer
- Designer/editor
- Billing manager

### Permissions

- Manage clients
- Manage jobs
- Upload images
- Review outputs
- Approve outputs
- Request revisions
- Download files
- Manage packages
- Manage presets
- Manage sales channels
- Manage integrations
- Manage billing
- View revenue
- Manage agency branding
- Manage team
- View client dashboard
- Export delivery files
- Create manual orders
- Adjust credits
- Send delivery
- Generate upsells

### Deliverables

- Permission registry
- Role mappings
- RBAC middleware
- Client access control
- Agency access model
- Tests

### Acceptance Criteria

- API enforces RBAC.
- Client cannot access another client’s jobs/files.
- Agency admin only sees agency clients.
- Revenue requires permission.

### Tests to Run

```bash
npm run test:unit -- rbac
npm run test:integration -- rbac
npm run test:security -- rbac tenant-isolation
```

---

## 10. Phase 5 — Packages and Pricing

### Goal

Implement ListingLift’s monetizable service packages.

### Packages

1. Quick Cleanup Pack: 10 images, transparent PNG, white JPG, crop/resize, ZIP, $25–$49.
2. Marketplace Listing Pack: 25–50 images, presets, PNG/JPG, soft shadow, square images, naming, folders, $99–$249.
3. Product Launch Image Pack: 50–100 images, brand backgrounds, hero/social/ad variations, thumbnail variations, quality report, $299–$799.
4. Monthly Seller Image Retainer: monthly allowance, priority turnaround, dashboard, revisions, archive, report, $199–$999/month.
5. Agency White-Label Fulfillment: multiple clients, branded delivery, bulk processing, reports, portal, priority queue, $1,000–$3,000/month or volume pricing.

### Deliverables

- Package manager
- Pricing cards
- Package checkout selection
- Manual job package selector
- Sales-channel package mapping

### Acceptance Criteria

- Packages are data-driven.
- Admin can edit active packages.
- Checkout uses server-side pricing.
- Image allowance and revision allowance enforced.

### Tests

```bash
npm run test:integration -- packages
npm run test:e2e -- pricing
```

---

## 11. Phase 6 — Platform Preset System

### Goal

Implement data-driven output presets.

### Presets

- Amazon main image draft
- Amazon secondary image draft
- Etsy listing square
- eBay listing square
- Shopify product image
- TikTok Shop vertical
- Instagram square
- Instagram story/reel vertical
- Facebook Marketplace square
- Pinterest pin
- Website product gallery
- Gumroad product/offer image
- Restaurant menu item image
- Real estate listing visual cleanup
- Custom client preset

### Deliverables

- Preset manager
- Preset seed data
- Preset selector
- Preset validation
- Custom preset creation

### Acceptance Criteria

- Required presets exist.
- Presets drive dimensions, background, file format, compression, safe margin, naming, and folder destination.
- Presets are editable by authorized admin.

### Tests

```bash
npm run test:unit -- presets
npm run test:integration -- presets
npm run test:e2e -- preset-manager
```

---

## 12. Phase 7 — Sales Channel Normalization Layer

### Goal

Normalize Fiverr orders, Upwork contracts, Gumroad purchases, Taskrabbit tasks, Shopify requests, Etsy orders, Stripe checkouts, direct orders, and manual leads into a single internal ListingLift job model.

### Normalized Fields

- Channel name
- External order ID
- External customer ID
- Buyer name
- Buyer email or username
- Package purchased
- Order amount
- Currency
- Deadline
- Revision allowance
- Source URL
- Payment status
- Upload status
- Fulfillment status
- Internal client ID
- Internal job ID

### Deliverables

- Sales channel adapter interface
- Sales channel registry
- Manual order adapter
- External order normalization service
- Order-to-client matching
- Order-to-job creation
- Revenue attribution

### Acceptance Criteria

- Manual order creates external order and job.
- Duplicate external order prevented.
- Source revenue attribution stored.
- Registry includes all named channels.

### Tests

```bash
npm run test:unit -- sales-channel-normalization
npm run test:integration -- external-orders
```

---

## 13. Phase 8 — Direct Upload and File Intake

### Goal

Implement secure image upload, ZIP upload, metadata extraction, upload links, and upload status tracking.

### Deliverables

- Upload token service
- Upload page
- Direct image upload
- ZIP upload
- File validation
- Metadata extraction
- Upload history
- Admin upload option

### Acceptance Criteria

- Client can upload by secure link.
- Admin can upload.
- ZIP upload works.
- File limits and package allowance enforced.
- Metadata extracted.

### Tests

```bash
npm run test:integration -- uploads
npm run test:e2e -- upload-flow
npm run test:security -- upload-safety
```

### Security Checks

- Upload token hashed and expiring.
- File type and size validated.
- ZIP slip protection.
- Executables rejected.

---

## 14. Phase 9 — Job Creation and Admin Queue

### Goal

Build the operational job queue.

### Deliverables

- Manual job form
- New jobs queue
- Job detail page
- Status transitions
- Deadline tracking
- Revenue attribution
- Admin notes

### Job Statuses

- Draft
- Waiting for upload
- Upload received
- Processing queued
- Processing
- Waiting for review
- Flagged outputs
- Approved
- Revision requested
- Reprocessing
- Ready for delivery
- Delivered
- Completed
- Cancelled
- Failed

### Acceptance Criteria

- Admin can create job manually.
- Jobs filter by status/source/deadline.
- Deadline warnings work.
- Payment/source/revenue data visible.

### Tests

```bash
npm run test:integration -- jobs
npm run test:e2e -- admin-job-queue
```

---

## 15. Phase 10 — Image Processing Provider Layer

### Goal

Create swappable background-removal/image-processing provider adapters.

### Providers

- Mock background removal provider
- Remove.bg
- Cloudinary
- Replicate
- Clipdrop-style provider
- Open-source background removal later
- Local worker later

### Deliverables

- Image provider adapter interface
- Provider registry
- Mock provider
- Provider setup UI
- Feature flags
- Contract tests

### Acceptance Criteria

- Mock provider works without paid keys.
- Real providers optional.
- Provider errors normalized.
- API keys encrypted.

### Tests

```bash
npm run test:adapter-contract -- image-providers
npm run test:integration -- image-providers
npm run test:security -- image-provider-secrets
```

---

## 16. Phase 11 — Core Image Processing Pipeline

### Goal

Process uploaded images into transparent PNGs, white JPGs, WebP, square ecommerce images, vertical social images, compressed files, and platform preset outputs.

### Deliverables

- Queue-based processing pipeline
- Background removal step
- White background composition
- Transparent PNG generation
- JPG generation
- WebP generation
- Resize step
- Compression step
- Preset output generation
- Per-image error handling

### Acceptance Criteria

- Uploaded image produces configured outputs.
- Presets drive dimensions and folders.
- Processing errors are stored per image.
- Originals preserved.

### Tests

```bash
npm run test:unit -- image-processing
npm run test:integration -- processing-pipeline
```

---

## 17. Phase 12 — Smart Naming, Folder Generation, Manifest, and ZIP

### Goal

Generate organized delivery folders, smart file names, Manifest.csv, ReadMe.txt, before/after samples, and ZIP packages.

### Required Folder Example

```txt
ListingLift_Delivery_ClientName_Job123/
  Amazon/
    white-background/
    secondary-images/
  Etsy/
    square-listing/
  Shopify/
    product-gallery/
  TikTok-Shop/
    vertical/
  Instagram/
    square/
    story/
  Transparent-PNG/
  White-JPG/
  Before-After/
  Manifest.csv
  ReadMe.txt
```

### Deliverables

- Naming service
- Folder generator
- Manifest.csv
- ReadMe.txt
- ZIP generation
- Download artifact storage

### Acceptance Criteria

- ZIP folder structure matches selected presets.
- Manifest is accurate.
- File names are safe.
- ReadMe uses compliance-safe language.

### Tests

```bash
npm run test:unit -- naming manifest zip
npm run test:integration -- delivery-zip
```

---

## 18. Phase 13 — Preview Gallery and Before/After

### Goal

Build admin/client preview galleries and before/after comparisons.

### Deliverables

- Admin preview gallery
- Client preview gallery
- Before/after cards
- Image detail view
- Bulk approval controls
- Filter by output type, preset, approved, flagged, failed

### Acceptance Criteria

- Admin can review outputs.
- Client can view approved previews if allowed.
- Flagged outputs visible to admin.
- Bulk approval works.

### Tests

```bash
npm run test:e2e -- preview-gallery
npm run test:integration -- previews
```

---

## 19. Phase 14 — Quality Control and Flagged Outputs

### Goal

Assist admin review with quality scoring and flagging.

### QC Checks

- Edge quality
- Product accuracy
- Weird cutoffs
- Missing parts
- Lighting issues
- Blurry photos
- Wrong crop
- Failed mask
- Duplicate files
- Wrong background
- Marketplace preset accuracy
- File naming accuracy
- Folder organization

### Deliverables

- Quality score service
- Flag reasons
- Flagged outputs page
- QC checklist
- Admin notes
- Reprocess action
- Manual edit marker

### Acceptance Criteria

- Outputs can be flagged.
- Flag reasons stored.
- Admin can approve, reprocess, or mark manual edit needed.
- Quality score appears in report/dashboard.

### Tests

```bash
npm run test:unit -- quality-control
npm run test:integration -- flagged-outputs
npm run test:e2e -- qc-review
```

---

## 20. Phase 15 — Manual Approval and Revision Workflow

### Goal

Implement approval, revisions, reprocessing, and manual Photoshop/Canva cleanup fallback.

### Deliverables

- Approval queue
- Revision request form
- Revision allowance tracking
- Reprocess workflow
- Manual external edit upload
- Revision status history

### Acceptance Criteria

- Admin can approve outputs.
- Client can request revision if allowed.
- Revision allowance enforced.
- Manual edited files can be uploaded.
- Revisions return job to review.

### Tests

```bash
npm run test:integration -- revisions approval
npm run test:e2e -- revision-flow
```

---

## 21. Phase 16 — Delivery and Email Notifications

### Goal

Deliver final ZIPs/download pages, send emails, and generate marketplace delivery messages.

### Notifications

- Upload received
- Processing started
- Manual review needed
- Job complete
- Revision requested
- Download ready
- Credits low
- Subscription renewal
- Failed job alert
- Upsell opportunity alert
- New marketplace order imported
- Gumroad purchase received
- Stripe checkout completed
- Fiverr order manually added
- Upwork project manually added
- Taskrabbit task manually added
- Deadline approaching

### Deliverables

- Delivery token service
- Download page
- Delivery email
- Marketplace-specific delivery templates
- Download tracking
- Expiring links

### Acceptance Criteria

- Client can download final ZIP.
- Delivery tokens are hashed and expire.
- Email works in mock mode.
- Marketplace delivery messages are copyable.

### Tests

```bash
npm run test:integration -- delivery
npm run test:e2e -- delivery-download
npm run test:security -- delivery-token
```

---

## 22. Phase 17 — Stripe Checkout and Billing

### Goal

Implement Stripe checkout for packs, subscriptions, credits, retainers, dashboard access, and agency plans.

### Deliverables

- Stripe checkout
- Stripe webhooks
- Package checkout
- Subscription checkout
- Credit purchases
- Retainer billing
- Agency billing

### Acceptance Criteria

- Stripe checkout works in test mode.
- Webhook signature verified.
- Paid checkout creates job/upload link.
- Subscription updates access/credits.
- Failed payment does not grant access.

### Tests

```bash
npm run test:integration -- stripe
npm run test:e2e -- stripe-checkout
npm run test:security -- stripe-webhooks
```

---

## 23. Phase 18 — Gumroad Checkout/Webhook Intake

### Goal

Support Gumroad productized service checkout, image credits, templates, and package sales.

### Gumroad Offer Types

- 10-image cleanup pack
- 25-image cleanup pack
- 50-image cleanup pack
- Monthly image cleanup credit pack
- Product launch image kit
- Canva product image templates
- Listing optimization checklist
- Ecommerce image prep guide
- Dashboard access
- Agency white-label starter package

### Deliverables

- Gumroad webhook endpoint
- Product/package mapping
- Purchase intake
- Client creation/update
- Job creation
- Credit application
- Upload link email
- Admin notification

### Acceptance Criteria

- Gumroad webhook creates job.
- Duplicate sale ID does not duplicate job.
- Product mapping works.
- Upload link sent.

### Tests

```bash
npm run test:integration -- gumroad
npm run test:e2e -- gumroad-intake
npm run test:security -- gumroad-webhook
```

---

## 24. Phase 19 — Credits, Subscriptions, and Manual Invoices

### Goal

Implement credit ledger, monthly allowances, manual invoices, manual payment confirmation, free sample credits, subscriptions, and access revocation.

### Acceptance Criteria

- Credits can be added/deducted.
- Ledger records every credit change.
- Monthly allowance works.
- Manual invoice can be marked paid.
- Free sample credits work.
- Dashboard access can be granted/revoked.

### Tests

```bash
npm run test:integration -- credits subscriptions invoices
npm run test:security -- billing-access
```

---

## 25. Phase 20 — Fiverr Workflow

### MVP Fiverr Workflow

- Admin manually creates job from Fiverr order.
- Admin uploads client files or downloaded ZIP.
- Admin selects Fiverr package preset.
- ListingLift processes images.
- Admin downloads final ZIP.
- Admin delivers through Fiverr.

### Scalable Fiverr Workflow

- Fiverr order import if approved.
- Buyer/order capture.
- Package mapping.
- Deadline sync.
- Fiverr delivery ZIP.
- Revision status.
- Revenue by gig.
- Fiverr delivery templates.

### Acceptance Criteria

- Admin can create Fiverr job.
- Fiverr order fields stored.
- Fiverr package mapping works.
- Final ZIP and delivery template generated.
- No unauthorized Fiverr automation.

### Tests

```bash
npm run test:integration -- fiverr
npm run test:e2e -- fiverr-manual-order
```

---

## 26. Phase 21 — Upwork Workflow

### MVP Upwork Workflow

- Admin manually creates project from Upwork contract.
- Admin records client name, contract title, deadline.
- Admin uploads image files.
- ListingLift processes files.
- Admin exports ZIP/report.
- Admin delivers through Upwork messages/files.

### Acceptance Criteria

- Admin can create Upwork job/contract.
- Contract ID, title, type, milestone, due date, billed amount stored.
- Proposal/message templates exist.
- Retainer upsell reminder exists.

### Tests

```bash
npm run test:integration -- upwork
npm run test:e2e -- upwork-manual-contract
```

---

## 27. Phase 22 — Taskrabbit Workflow

### Goal

Support local-service positioning for product photo cleanup, marketplace listing help, restaurant menu image cleanup, real estate listing visuals, and ecommerce setup support.

### Acceptance Criteria

- Admin can create Taskrabbit job.
- Task ID, customer, category, appointment/deadline, value, and conversion status stored.
- Direct retainer conversion tracked.

### Tests

```bash
npm run test:integration -- taskrabbit
npm run test:e2e -- taskrabbit-manual-task
```

---

## 28. Phase 23 — Other Sales Channel Workflows

### Channels

- Freelancer.com
- PeoplePerHour
- Guru
- Contra
- Thumbtack
- Bark
- Houzz
- LinkedIn
- Facebook business page
- Instagram profile/shop link
- TikTok profile link
- YouTube description links
- X/Twitter
- Lemon8
- Pinterest
- Product Hunt
- Indie Hackers
- AppSumo later
- Local chamber directories
- Google Business Profile
- Yelp
- Craigslist
- Nextdoor
- Discord
- Skool
- Circle

### Acceptance Criteria

- All channels exist as selectable sources.
- Admin can manually create lead/order/job from any source.
- Proposal templates and follow-up status exist.
- Revenue attributed by source.

### Tests

```bash
npm run test:integration -- generic-sales-channels
npm run test:e2e -- manual-channel-order
```

---

## 29. Phase 24 — Etsy Workflow

### Etsy Use Cases

- Square listing images
- White/clean background images
- Product cutouts
- Lifestyle-style mockup variants where appropriate
- Shop visual consistency report
- Listing image sequence recommendations

### Acceptance Criteria

- Etsy order can be manually entered.
- Etsy preset outputs generated.
- Etsy folder exists in ZIP.
- Etsy-specific report/notes generated.

### Tests

```bash
npm run test:integration -- etsy
npm run test:e2e -- etsy-workflow
```

---

## 30. Phase 25 — Shopify Workflow

### MVP Shopify Workflow

- Manual Shopify export upload.
- Product/SKU CSV import.
- Shopify preset output.
- ZIP by product/SKU.

### Scalable Shopify Workflow

- Shopify OAuth app.
- Product image import.
- Product image export.
- Product-level image replacement approval.
- Shopify product-page visual audit.
- Storefront image consistency score.

### Tests

```bash
npm run test:integration -- shopify
npm run test:e2e -- shopify-workflow
```

---

## 31. Phase 26 — Social and Marketplace Workflows

### Workflows

- TikTok Shop vertical images.
- Instagram square/story/Reels outputs.
- Facebook Marketplace square/mobile outputs.
- Pinterest pin outputs.
- Creator affiliate image pack.
- Ad creative base images.

### Tests

```bash
npm run test:integration -- social-presets
npm run test:e2e -- social-workflow
```

---

## 32. Phase 27 — Amazon, eBay, and WooCommerce Workflows

### Amazon

- White-background main image draft.
- Transparent cutouts.
- Crop suggestions.
- Quality warning flags.
- Product launch sequence recommendations.
- Seller review required wording.

### eBay

- Clean cutouts.
- Square listing images.
- Multi-angle naming.
- ZIP by SKU.
- White backgrounds.
- Compressed JPGs.

### WooCommerce

- Later ecommerce scaffold.

### Tests

```bash
npm run test:integration -- amazon-ebay
npm run test:e2e -- marketplace-drafts
```

---

## 33. Phase 28 — File Storage Integrations

### Goal

Support Google Drive, Dropbox, OneDrive, Box, and direct upload.

### Responsibilities

- Import client folders.
- Watch folders later.
- Export final ZIPs.
- Export platform folders.
- Store before/after previews.
- Share delivery links.

### Tests

```bash
npm run test:adapter-contract -- file-storage
npm run test:integration -- file-storage
npm run test:security -- storage-integrations
```

---

## 34. Phase 29 — Automation Webhooks

### Automation Triggers

- New paid order
- New image upload
- Job processing started
- Job waiting for review
- Job completed
- Revision requested
- Download ready
- Credits low
- Subscription inactive
- Upsell opportunity detected

### Automation Actions

- Create job
- Send email
- Create Slack message
- Create Trello card
- Create ClickUp task
- Create Google Drive folder
- Export ZIP
- Update CRM
- Notify admin

### Tests

```bash
npm run test:integration -- automation-webhooks
npm run test:security -- webhooks
```

---

## 35. Phase 30 — Slack, Email, Google Sheets, Airtable, Trello, ClickUp, Asana, and Notion

### Goal

Support notifications and task/data exports.

### Deliverables

- Slack alerts.
- Email templates.
- Google Sheets exports.
- Airtable exports.
- Trello cards.
- ClickUp tasks.
- Asana tasks.
- Notion scaffold.

### Tests

```bash
npm run test:adapter-contract -- task-notification-integrations
npm run test:integration -- notifications exports
npm run test:security -- integration-secrets
```

---

## 36. Phase 31 — Advanced Image Processing and Local Workers

### Goal

Add future advanced processing options.

### Deliverables

- Open-source background removal scaffold.
- Local worker scaffold.
- Image quality scoring upgrades.
- Product classification scaffold.
- Marketplace recommendation scaffold.
- Revision interpretation scaffold.
- Product image sequence recommendation.

### Tests

```bash
npm run test:integration -- advanced-image-processing
npm run test:adapter-contract -- local-worker
```

---

## 37. Phase 32 — Reports and Upsell Engine

### Report Sections

- Image pack summary.
- Quality summary.
- Platform delivery summary.
- Before/after section.
- Upsell section.

### Upsells

- More image packs.
- Monthly retainer.
- Listing SEO.
- Product description rewrite.
- Ad creative pack.
- Canva template pack.
- Brand visual consistency kit.
- White-label agency license.
- Paid client dashboard access.
- Marketplace storefront visual audit.
- Product image A/B recommendations.
- Restaurant/menu image cleanup.
- Local listing cleanup.

### Tests

```bash
npm run test:integration -- reports upsells
npm run test:e2e -- report-generation
```

---

## 38. Phase 33 — Client Dashboard

### Pages

- Client dashboard.
- Upload images.
- Active jobs.
- Completed jobs.
- Preview gallery.
- Downloads.
- Revision requests.
- Billing.
- Upgrade.

### Acceptance Criteria

- Client sees their jobs only.
- Client can upload.
- Client can preview approved images.
- Client can download final ZIP.
- Client can request revisions.
- Client can see credits/subscription.

### Tests

```bash
npm run test:e2e -- client-dashboard
npm run test:integration -- client-dashboard
npm run test:security -- client-access
```

---

## 39. Phase 34 — Admin Dashboard and Revenue Analytics

### Sections

- Active jobs.
- Completed jobs.
- New jobs by source.
- Flagged outputs.
- Jobs due soon.
- Revenue by sales channel.
- Marketplace-to-direct conversion tracking.
- Retainer opportunity alerts.
- Upsell opportunities.

### Tests

```bash
npm run test:e2e -- admin-dashboard
npm run test:integration -- revenue-analytics
```

---

## 40. Phase 35 — Agency White-Label Mode

### Deliverables

- Agency dashboard.
- Client workspaces.
- White-label settings.
- Branded delivery page.
- Branded reports.
- Agency billing.
- Team members.
- Bulk processing queue.
- Volume pricing scaffold.

### Tests

```bash
npm run test:integration -- white-label
npm run test:e2e -- agency
npm run test:security -- agency-access
```

---

## 41. Phase 36 — API Access and Advanced Integrations Scaffold

### Scopes

- jobs:create
- jobs:read
- uploads:create
- images:read
- deliveries:read
- webhooks:manage
- presets:read
- presets:write

### Acceptance Criteria

- API tokens stored hashed.
- Tokens shown once.
- Scopes enforced.
- API gated by plan.

### Tests

```bash
npm run test:integration -- api-access
npm run test:security -- api-token
```

---

## 42. Phase 37 — Security Hardening

### Required Security Work

- Encrypt payment credentials, Gumroad secrets, image provider keys, storage OAuth tokens, Slack/email/task tool tokens.
- Validate upload file types.
- Enforce upload size limits.
- Prevent ZIP slip.
- Reject executable files.
- Hash delivery tokens.
- Expire delivery tokens.
- Rate-limit login, upload, checkout, webhooks, processing requests, downloads.
- Add security headers.
- Add CSRF protection.
- Add XSS protection.
- Verify webhooks where possible.
- Add audit completeness map.

### Tests

```bash
npm run test:security
npm run security-check
npm run typecheck
npm run lint
npm run build
```

---

## 43. Phase 38 — Full Testing and QA

**Status: IN PROGRESS** (stitch from seed v40, 2026-06-14)
- [x] Stage 1 — Environment & Dependencies ✅ (merged 06:08 UTC)
- [ ] Stage 2 — Database Layer
- [ ] Stage 3 — Static Checks
- [x] Stage 4 — Unit & Security Tests (94/94 unit, 54/54 security, 298/298 total)
- [x] Stage 5 — Integration & Adapter Contracts (37/37 integration, 4/4 adapter, 71/71 — verified by Ip Man + Deziray audit)
- [ ] Stage 6 — E2E & Browser (35 Playwright specs — blocked on STRIPE_SECRET_KEY)
- [x] Stage 7 — Build & Smoke (Q7 ELITE SANITY — PASS: 5 phases, zero build errors, 28/28 golden paths, 6 boundaries, 8/8 error recovery)
- [x] Stage 8 — Evidence & Documentation ✅ (Q8 smoke pipeline — PASS: 4 phases, 438/438 routes, 0 failures)

### Unit Tests

- Package mapping.
- Preset validation.
- Sales channel normalization.
- File naming.
- Manifest generation.
- Image-processing helpers.
- Credit ledger.
- RBAC.
- Upload tokens.
- Download tokens.

### Integration Tests

- Auth.
- Client/job CRUD.
- Manual order creation.
- Stripe webhook.
- Gumroad webhook.
- Upload flow.
- Mock image processing.
- ZIP generation.
- Preview gallery.
- Approval/revision.
- Delivery.
- Reports.
- Upsells.
- Credits/subscriptions.
- Sales channel workflows.
- Storage adapters.
- Automation webhooks.

### E2E Tests

- Signup/login.
- Select package.
- Stripe checkout test mode.
- Gumroad webhook intake.
- Upload 10 images.
- Process with mock provider.
- Review previews.
- Approve outputs.
- Generate ZIP.
- Deliver download link.
- Client downloads ZIP.
- Client requests revision.
- Admin resolves revision.
- Manual Fiverr job.
- Manual Upwork job.
- Manual Taskrabbit job.
- Revenue source dashboard.

### Tests to Run

```bash
npm run test-all
npm run build
npm run smoke
```

---

## 44. Phase 39 — Replit Production Deployment

### Required Environment Variables

```txt
NODE_ENV=production
APP_URL=
DATABASE_URL=
SESSION_SECRET=
ENCRYPTION_KEY=
FILE_STORAGE_DRIVER=
MAX_UPLOAD_MB=
MOCK_IMAGE_PROVIDER_ENABLED=
REAL_IMAGE_PROVIDER_CALLS_ENABLED=
STRIPE_ENABLED=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
GUMROAD_ENABLED=
GUMROAD_WEBHOOK_SECRET=
EMAIL_ENABLED=
MOCK_INTEGRATIONS_ENABLED=
REAL_INTEGRATIONS_ENABLED=
RATE_LIMIT_ENABLED=
LOG_LEVEL=
```

### Deployment Steps

1. Configure Replit secrets.
2. Configure database.
3. Run env verification.
4. Run migrations.
5. Run production-safe seed.
6. Build app.
7. Start app.
8. Verify health endpoint.
9. Run deployed smoke tests.
10. Test manual job, upload, mock processing, preview, approval, ZIP, delivery, Stripe test checkout, Gumroad test webhook, manual Fiverr/Upwork/Taskrabbit jobs.

### Tests

```bash
npm run verify-env
npm run db:migrate
npm run db:seed
npm run build
npm run smoke
npm run smoke -- --base-url <DEPLOYED_URL>
```

---

## 45. Phase 40 — Post-Launch Backlog

| Priority | Improvement | Why It Matters |
|---:|---|---|
| 1 | Gumroad automation hardening | Productized checkout |
| 2 | Fiverr/Upwork delivery templates | Immediate fulfillment speed |
| 3 | Retainer dashboard | Recurring revenue |
| 4 | Google Drive/Dropbox delivery | Better client workflow |
| 5 | Quality scoring improvements | Less manual review |
| 6 | Shopify product/SKU workflow | Strong ecommerce value |
| 7 | Agency white-label delivery | High-ticket upsell |
| 8 | Revenue by source dashboard | Know where money comes from |
| 9 | Marketplace-to-direct conversion tracker | Improve margins |
| 10 | Product launch pack workflow | Higher-ticket packages |
| 11 | Ad/social creative variations | Upsell revenue |
| 12 | Canva template pack exports | Productized upsell |
| 13 | Monthly cleanup reports | Retainer retention |
| 14 | Trello/ClickUp/Asana task export | Agency workflow |
| 15 | Slack alerts | Faster operations |
| 16 | Shopify OAuth import/export | Scalable ecommerce |
| 17 | Etsy workflow expansion | Handmade seller niche |
| 18 | Local worker/background removal | Lower processing cost |
| 19 | API/shared upload portal | Agency premium tier |
| 20 | Product image A/B recommendations | Advanced upsell |

### MVP Avoid List

- Full marketplace publishing.
- Live Shopify sync.
- Automated Fiverr messaging.
- Automated Upwork messaging.
- Marketplace scraping.
- Advanced AI image generation.
- Complex team permissions.
- Mobile app.
- Full design editor.
- Automated ad testing.
- Deep analytics.

---

## 46. Coding Agent Operating Rules

1. Always inspect files before editing.
2. Always update tests when behavior changes.
3. Always keep ARCHITECTURE.md, BUILD_ROADMAP.md, and AGENTS.md synchronized.
4. Never invent marketplace API capabilities.
5. Never require real paid APIs in automated tests.
6. Use mock adapters before real integrations.
7. Keep secrets out of code, logs, and client responses.
8. Never store marketplace passwords.
9. Do not scrape private marketplace pages.
10. Do not automate marketplace messaging without approved integration.
11. Keep manual workflows for limited-access platforms.
12. Do not bypass tenant isolation or RBAC.
13. Do not deliver unapproved final outputs.
14. Do not overwrite original images.
15. Do not delete failed outputs without trace.
16. Do not generate ZIPs with unsafe paths.
17. Do not create public delivery links without expiring tokens.
18. Do not trust client-side package price or allowance.
19. Do not process images synchronously in long HTTP requests.
20. Do not let one failed image fail the whole batch unless policy requires it.
21. Do not imply marketplace compliance is guaranteed.
22. Do not claim sales or conversion lift is guaranteed.
23. Do not add an integration without registry entry, adapter contract, mock test, feature flag, and docs.
24. Do not add image provider code directly into processing service.
25. Do not add automation without manual fallback.
26. Do not duplicate preset dimensions outside preset service.
27. Do not silently ignore failing tests.

### Required Coding Session Summary

```txt
Completed:
- ...

Files changed:
- ...

Tests run:
- ...

Results:
- ...

Security checks:
- ...

Known limitations:
- ...

Next recommended step:
- ...
```

---

## 47. Definition of Done

### Feature Complete

A feature is complete when:

- Required UI exists.
- Required API routes exist.
- Required service logic exists.
- Required database schema/migrations exist.
- Required seed data exists if applicable.
- Loading, empty, and error states exist.
- Permission checks exist.
- Tenant checks exist.
- Audit logs exist for sensitive changes.
- Docs are updated.
- Tests pass.
- Manual fallback exists where relevant.

### Secure

A feature is secure when:

- Auth is enforced.
- RBAC is enforced server-side.
- Tenant isolation is enforced server-side.
- Inputs are validated.
- Outputs are escaped/redacted.
- Secrets are encrypted.
- Secrets are never logged.
- Upload limits are enforced.
- File types are validated.
- ZIP uploads prevent path traversal.
- Delivery tokens are hashed and expiring.
- Sensitive actions are audited.
- Webhooks are verified/signed where possible.
- Rate limits exist.
- CSV manifests neutralize formula injection.

### Tested

A feature is tested when:

- Unit tests cover core logic.
- Integration tests cover service/API/database behavior.
- E2E tests cover critical workflow.
- Adapter contract tests cover integrations.
- Security tests cover leakage/isolation/upload/download risks.
- Migration tests pass if schema changed.
- Tests do not require real paid APIs.
- Tests are deterministic.

### Usable

A feature is usable when:

- The operator can complete fulfillment without developer help.
- The client upload flow is simple.
- Admin review is clear.
- Error messages explain next action.
- Loading/progress states are clear.
- Manual fallback is available.
- Final ZIP is organized and client-ready.
- Delivery page is easy to use.
- Upsell path is visible.

### Deployable

A feature is deployable when:

- Production build passes.
- Env vars are documented.
- Production env validation passes.
- Migrations apply cleanly.
- Seed is production-safe.
- Smoke tests pass.
- Replit commands are accurate.
- No development-only placeholder is active in production without a feature flag.

### Production Ready

ListingLift is production ready when:

- Signup/login works.
- Stripe test checkout works.
- Gumroad test webhook intake works.
- Manual Fiverr job works.
- Manual Upwork job works.
- Manual Taskrabbit job works.
- Manual direct job works.
- Client upload link works.
- Image/ZIP upload works.
- Mock/real optional background removal works.
- Transparent PNG output works.
- White JPG output works.
- Marketplace preset resizing works.
- Preview gallery works.
- Admin approval works.
- ZIP generation works.
- CSV manifest works.
- Delivery link works.
- Email notification works in mock or configured mode.
- Revision request works.
- Credit/subscription tracking works.
- Revenue/source tracking works.
- Manual fallback exists for upload, processing, ZIP, delivery, and external marketplace delivery.
- Security hardening passes.
- Full QA passes.
- Replit deployment passes.
- Post-deploy smoke tests pass.
- No real paid API is required for baseline operation.
- All named integrations are represented in adapter registries with mock/scaffold/manual/full status.
- Known limitations are documented.
- The app can deliver a paid ListingLift product image cleanup pack even when external integrations are unavailable.
