# PHASE_7_IMPLEMENTATION_NOTES.md — Sales Channel Normalization Layer

## Status

ChatGPT advanced into Phase 7 after unzipping `ListingLift_Repo_Seed_v8.zip` and reviewing all Markdown files in the seed plus `ListingLift.md` and `ListingLift_BUILD_ROADMAP.md`.

Phase 7 has been seeded but is **not runtime-complete**. Codex must stitch, install, validate, migrate, typecheck, test, and connect persistence before marking this phase complete.

## Objective

Normalize Fiverr orders, Upwork contracts, Gumroad purchases, Taskrabbit tasks, Shopify requests, Etsy orders, Stripe checkouts, direct orders, CSV imports, email parser outputs, and manual leads into one internal ListingLift job model.

## Seeded Implementation

### Domain and schema

- Canonical normalized field list.
- Canonical sales-channel key mapping.
- Adapter alias mapping.
- Package alias mapping.
- Dedupe key construction.
- Marketplace safety helpers.
- Expanded Zod schemas for normalized external orders, normalization requests, external order drafts, client match drafts, job drafts, and revenue attribution drafts.

### Adapter layer

- Expanded sales-channel adapter interface.
- Canonical channel key on every adapter.
- Supported import modes on every adapter.
- Marketplace safety rules on every adapter.
- Stripe, Gumroad, Fiverr, Upwork, Taskrabbit, Direct/manual, and manual marketplace/export adapters.
- Registry coverage check for all required source channels.

### Service layer

- Order normalization.
- Duplicate prevention key generation.
- Client matching draft generation.
- External order draft generation.
- Job creation draft generation.
- Revenue attribution draft generation.
- Upload link trigger plan for Phase 8.
- Batch import dry-run plan.

### API contracts

- `GET /api/sales-channels/registry`
- `POST /api/sales-channels/normalize`
- `POST /api/sales-channels/manual-order`
- `POST /api/sales-channels/import`
- `GET /api/external-orders`
- `POST /api/external-orders`
- `POST /api/external-orders/dedupe-check`
- `GET /api/external-orders/[externalOrderId]`

These are contract/dry-run routes until Codex wires Prisma transactions, persistence, audit logs, pagination, and filters.

### UI shell

- Admin sales channel registry table.
- Normalization workflow card.
- Revenue attribution card.
- External orders list shell.
- External order detail shell.

### Prisma seed/schema scaffold

- Expanded `SalesChannel` fields for canonical/adapter keys, supported modes, package mapping, marketplace safety rules, manual fallback, revenue attribution, and import status.
- Expanded `ExternalOrder` fields for dedupe keys, normalized payload, mapping status, source fingerprint, revenue attribution, upload-trigger timestamp, and import metadata.
- Expanded `Job` source/revenue attribution fields.
- Phase 7 migration scaffold.
- Seed updates for canonical adapter keys and demo external order/job attribution.

## Codex Must Complete

- Validate Prisma schema.
- Regenerate/repair migration SQL.
- Generate Prisma client.
- Apply migration.
- Run seed twice.
- Connect dry-run route contracts to real Prisma transactions.
- Enforce duplicate external order prevention in the database.
- Upsert or match clients server-side.
- Create jobs server-side with tenant scoping and audit logs.
- Record revenue attribution.
- Trigger upload link creation only when Phase 8 upload token service is ready.
- Verify marketplace safety rules.
- Run tests, typecheck, lint, and build.

## Non-Negotiable Rules

- Every sales source must normalize into one ListingLift external order/job shape.
- Duplicate external orders must be prevented per organization/channel/external order ID.
- Manual fallback must remain available for every channel.
- Do not scrape private marketplace pages.
- Do not store marketplace passwords.
- Do not automate platform messaging outside approved terms.
- Do not call real integrations unless explicitly enabled by environment flags.
- Do not trust client-submitted package price, image allowance, revision allowance, or payment status.
