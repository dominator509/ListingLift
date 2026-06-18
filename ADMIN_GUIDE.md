# ADMIN_GUIDE.md

## Operator flow

1. Review new normalized jobs.
2. Confirm package, channel, client, deadline, and image count.
3. Monitor upload status.
4. Process images through mock/real/manual provider.
5. Review quality flags.
6. Approve or reject outputs.
7. Generate ZIP and manifest.
8. Send delivery only after approval.
9. Handle revisions.
10. Log manual fallback actions.

## Phase 20 Fiverr Workflow

The admin Fiverr workflow is manual-first:

1. Open `/admin/fiverr`.
2. Capture Fiverr order ID, buyer username, gig title, package tier, amount, deadline, and order instructions.
3. Map the gig to a ListingLift package.
4. Generate or send a secure upload link if source files are needed.
5. Fulfill the job through processing, QC, preview, approval, archive, and delivery gates.
6. Use the safe delivery template and manually deliver through Fiverr when required.
7. Record delivery or revision status in ListingLift.

Never scrape private Fiverr pages, store Fiverr passwords, or automate buyer messages outside an approved integration path.

## Phase 21 — Upwork Workflow Admin Guide

Use the Upwork workflow for higher-value contracts, retainers, hourly catalog support, and agency subcontracting.

Admin workflow:

1. Enter the Upwork contract ID, client name/company, contract title, contract type, milestone, due date, and billed amount.
2. Map the contract to a ListingLift package or retainer.
3. Generate a safe proposal/message template when useful, then manually adapt it inside Upwork.
4. Create the ListingLift job and upload link.
5. Process, preview, QC, approve, package, and deliver outputs through the approved delivery path.
6. Track revision requests and keep completion blocked while revisions are open.
7. Use retainer reminders only as manual operator prompts and only when appropriate for the contract context.

Rules: do not scrape private Upwork pages, do not store Upwork passwords, do not automate Upwork proposals/messages/delivery unless an approved integration permits it, and do not guarantee marketplace approval, ranking, sales, conversion, or ad performance.

## Phase 22 — Taskrabbit Admin Workflow

Taskrabbit is a manual-first local-service channel. Admins can capture a Taskrabbit task, map it to a ListingLift package, create a normalized job, generate an upload-link plan, prepare safe delivery copy, and track whether the customer may become a direct ListingLift client or monthly retainer.

Admin rules:

- Do not scrape Taskrabbit private pages.
- Do not store Taskrabbit passwords.
- Do not automate Taskrabbit messages, bookings, cancellations, or delivery unless an approved integration permits it.
- Store only the location data needed for the task; prefer city/area notes over full addresses.
- Use external upload/download links only where allowed.
- Keep direct-retainer follow-up compliant with platform rules and customer consent.


## Phase 23 — Other Sales Channels

Use the Other Sales Channels area to manually capture leads/orders from freelance marketplaces, directories, social profiles, communities, launch platforms, and local sources. Keep all outreach and delivery manual unless an approved platform integration exists.

## Phase 24 — Etsy Workflow

Use `/admin/etsy` to coordinate Etsy seller workflows. Manual order intake lives at `/admin/etsy/order-intake`; listing import planning lives at `/admin/etsy/listings`; delivery copy lives at `/admin/etsy/delivery`; visual reports live at `/admin/etsy/reports`. Do not scrape Etsy, store passwords, or automate buyer messages/listing edits without approved integration support.

## Phase 25 — Shopify Workflow

Admins can use `/admin/shopify` and related pages to plan Shopify product image jobs, import product/SKU rows, generate merchant-safe delivery copy, review product-page audit notes, manage replacement approvals, and view OAuth scaffold safety requirements. All real Shopify integrations remain disabled by default until Codex verifies flags, secrets, and tests.


## Phase 26 — Social Commerce Admin Workflow

Use `/admin/social-commerce` to review manual social-commerce source workflows. Use intake pages for TikTok Shop, Instagram, Facebook Marketplace/Page, Pinterest, TikTok Profile, YouTube Shorts, and Google Business Profile social requests.

All captions, hashtags, delivery messages, follow-ups, and platform interactions are manual operator drafts only. Do not automate social DMs, comments, posts, uploads, or marketplace messages unless a platform-approved integration is explicitly enabled and tested.


## Phase 27 — Marketplace Export Admin Workflows

Admin pages added:

- `/admin/marketplace-exports`
- `/admin/marketplace-exports/manual-order`
- `/admin/marketplace-exports/export-plan`
- `/admin/marketplace-exports/delivery`
- `/admin/marketplace-exports/safety`

Use these pages as manual operator workflows for Amazon Seller export, eBay export, and WooCommerce product-gallery scaffolding. All outputs are drafts requiring seller review. Do not promise platform compliance, listing approval, ranking, sales, conversion, or ad performance.


## Phase 28 — File Storage Integrations

Admin pages added:

- `/admin/file-storage`
- `/admin/file-storage/connections`
- `/admin/file-storage/folder-import`
- `/admin/file-storage/delivery-export`

Operators can plan local/mock storage, folder intake, and delivery export workflows. Real Google Drive and Dropbox integrations remain feature-flagged and require encrypted secret references.


## Phase 29 — Automation Webhooks Admin Guide

Automation webhooks are optional operator tools. They can notify admins, create task cards, trigger external workflow tools, or update a CRM, but they must never be required for fulfillment.

Admin pages added:

- `/admin/automation-webhooks`
- `/admin/automation-webhooks/subscriptions`
- `/admin/automation-webhooks/events`
- `/admin/automation-webhooks/dead-letter`
- `/admin/automation-webhooks/test`

Admins should use dry-run mode first, verify redacted payloads, confirm encrypted secret references, and leave manual fallback enabled.

## Phase 30 — Notifications and Task/Data Exports

Admin seed pages added:

- `/admin/task-notification-integrations`
- `/admin/task-notification-integrations/providers`
- `/admin/task-notification-integrations/exports`
- `/admin/task-notification-integrations/tasks`
- `/admin/task-notification-integrations/templates`
- `/admin/task-notification-integrations/health`

Operators can plan Slack alerts, email messages, data exports, and task creation. Codex must wire these to real tenant-scoped persistence and keep every provider optional with manual fallback.

## Phase 31 — Advanced Image Processing Admin Guide

Admin shells added:

- `/admin/advanced-processing`
- `/admin/advanced-processing/recipes`
- `/admin/advanced-processing/reports`
- `/admin/jobs/[jobId]/advanced-processing`

Operators can review recipe scaffolds, safety rules, brand-background planning, hero/social plans, and quality report previews. Runtime processing, persistence, and approval workflow wiring remain Codex-owned.

## Phase 32 — Reports and Upsell Engine

Admins can use the seeded report and upsell pages to plan:

- delivery summaries
- image quality reports
- monthly cleanup reports
- white-label agency reports
- post-delivery upsell offers

All report and upsell outputs require safe-copy review. Do not guarantee marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.

## Phase 33 Client Dashboard Admin Notes

Admins must verify that client dashboard data is scoped to the correct organization and client. Uploads, downloads, revisions, billing, and upgrade interactions should create audit trails where they affect paid fulfillment or client-facing access.


## Phase 34 — Admin Dashboard and Revenue Analytics

The Phase 34 admin dashboard is the internal operating command center for fulfillment and revenue analytics.

Admin operators should use it to review:

- Active jobs and completed jobs.
- Flagged outputs and due-soon jobs.
- New jobs by source.
- Revenue by sales channel.
- Marketplace-to-direct conversion signals.
- Retainer opportunity alerts.
- Upsell/revenue context.

Production rules:

- Treat conversion and retainer alerts as manual-review opportunities only.
- Do not automate marketplace outreach, scraping, messages, comments, DMs, or proposals.
- Do not promise approval, ranking, sales, conversion, ad performance, listing approval, or product approval.
- Do not export or expose secrets, raw webhook payloads, signed URLs, provider tokens, marketplace credentials, marketplace passwords, or private notes.
- Verify revenue against server-side payment, invoice, refund, external-order, credit, subscription, and job records.

## Phase 35 — Agency White-Label Mode

Agency operators can use the seeded agency pages to plan:

- client workspaces
- branded delivery
- branded reports
- white-label settings
- agency billing and volume pricing
- team members
- bulk processing queue

Production rules:

- Treat all Phase 35 rows as dry-run scaffolds until Codex wires tenant-scoped Prisma records.
- Verify agency admins are agency-scoped and explicitly permitted.
- Do not let client-scoped users access agency admin routes.
- Require manual review before white-label brand settings, custom domains, branded delivery, or branded reports become client-facing.
- Do not expose secrets, tokens, signed URLs, raw webhook payloads, provider keys, private notes, or marketplace credentials.
- Preserve original uploads and never overwrite originals.
- Do not promise marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.


---

## Phase 36 — API Access and Advanced Integrations

The v38 repo seed adds admin shells for API access and advanced integrations under `/admin/api-access`.

### Admin pages

- `/admin/api-access`
- `/admin/api-access/tokens`
- `/admin/api-access/scopes`
- `/admin/api-access/webhooks`
- `/admin/api-access/shared-upload-portal`
- `/admin/api-access/integrations`

### Operator rules

- Create API tokens only for known agency/API clients.
- Grant the smallest scope set possible.
- Do not copy raw API tokens into tickets, docs, Slack, email, browser screenshots, or logs.
- Revoke tokens immediately when a client, integration, or employee no longer needs access.
- Keep API access and advanced integrations disabled unless the plan gate, feature flag, encrypted secret reference, rate limit, and audit requirements are met.
- Use shared upload portals only for scoped client/job intake. They are not generic public upload links.
- Treat webhook endpoints as security-sensitive. Signing secrets must be hashed or stored as encrypted references only.

### Required Codex hardening

The UI is a scaffold. Codex must wire database-backed token records, hashed bearer-token lookup, `manage:api-access` RBAC, tenant/client/agency-workspace isolation, plan gates, rate limits, event audits, and browser verification before production use.

## Phase 37 — Security Hardening Admin Guide

Phase 37 adds the admin security area:

- `/admin/security`
- `/admin/security/upload-safety`
- `/admin/security/secrets`
- `/admin/security/rate-limits`
- `/admin/security/webhooks`
- `/admin/security/audit-map`

The security area is intentionally an operator/admin control map, not a public compliance claim. It shows which controls are scaffolded and which require Codex runtime verification.

### Admin operating rules

- Treat every Phase 37 status as unverified until Codex completes the verification matrix.
- Do not paste real secrets into the scaffolded UI or API routes.
- Do not enable real integrations until encrypted secret references, feature flags, rate limits, webhooks, and audits are wired.
- Do not expose delivery downloads before approval.
- Do not override upload/ZIP rejection without a documented manual fallback reason and audit event.
- Do not publish copy that guarantees marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.

---

## Phase 38 — Full Testing and QA Admin Guide

The QA dashboard is available at `/admin/qa` with subpages:

- `/admin/qa/unit`
- `/admin/qa/integration`
- `/admin/qa/e2e`
- `/admin/qa/security`
- `/admin/qa/smoke`

The dashboard is a command center for Codex verification. It is not proof that tests passed.

Admins should treat every row as `CODEX_REQUIRED` until Codex attaches actual evidence from command output, traces, screenshots, logs, database records, or sanitized artifacts.

Important admin rule: never approve deployment readiness solely from the QA UI shell. Use `PHASE_38_VERIFICATION_MATRIX.md`, `CODEX_GAPS.md`, and retained command evidence.
