# Admin Dashboard and Revenue Analytics

## Purpose

Phase 34 turns the admin area into ListingLift's operating command center for fulfillment workload, source attribution, and revenue analytics.

## Seeded Sections

- Active jobs.
- Completed jobs.
- New jobs by source.
- Flagged outputs.
- Jobs due soon.
- Revenue by sales channel.
- Source tracking.
- Marketplace-to-direct conversion signals.
- Retainer opportunity alerts.
- Upsell/revenue context.

## Required Data Sources

Codex must derive production analytics from tenant-scoped server records only:

- `Job`
- `Client`
- `SalesChannel`
- `ExternalOrder`
- Stripe checkout/session/webhook records
- Gumroad purchase/webhook records
- Manual invoices and invoice payments
- Credits, subscriptions, and retainers
- QC flags and approved outputs
- Delivery archives and delivery/download events
- Reports and upsell opportunities

## Guardrails

- Admin analytics are admin-only and tenant-scoped.
- Revenue values must be verified server-side.
- Marketplace-to-direct conversion tracking is internal/manual-review only.
- Retainer alerts are manual-review opportunities.
- Do not automate marketplace messages, comments, DMs, proposals, scraping, or circumvention.
- Exclude secrets, raw webhook payloads, tokens, signed URLs, provider errors, marketplace credentials, marketplace passwords, and private notes from analytics responses and exports.
- Do not guarantee marketplace approval, ranking, sales, conversion, ad performance, listing approval, or product approval.
