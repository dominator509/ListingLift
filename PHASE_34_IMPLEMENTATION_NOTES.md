# PHASE_34_IMPLEMENTATION_NOTES.md

## Phase

Phase 34 — Admin Dashboard and Revenue Analytics

## What ChatGPT Project Mode Coded

This seed adds the admin dashboard and revenue analytics scaffold for:

- Admin command-center overview.
- Active jobs, completed jobs, flagged outputs, and due-soon job buckets.
- Revenue by normalized sales channel.
- Source tracking across direct, checkout, marketplace, freelance, ecommerce, and manual workflows.
- Marketplace-to-direct conversion signals.
- Retainer opportunity alerts.
- Internal analytics event/audit draft contracts.
- Admin analytics route contracts and UI pages.
- Prisma model and migration scaffolds for admin preferences, revenue snapshots, conversion signals, retainer alerts, and admin dashboard events.

## Important Security Rules

- Admin analytics must be scoped by organization server-side.
- Client-scoped users must not access admin analytics.
- Revenue figures must be derived from verified payments, invoices, external orders, refunds, credits, subscriptions, and job records.
- Marketplace-to-direct conversion signals are internal analytics only.
- The system must not automate marketplace outreach, scraping, circumvention, DMs, comments, or proposals.
- Retainer alerts and upsell signals are manual-review drafts only.
- Analytics exports must exclude secrets, raw webhook payloads, signed URLs, provider tokens, marketplace passwords, and private admin/client notes.
- Analytics copy must not guarantee marketplace approval, ranking, sales, conversion, or ad performance.

## Runtime Status

This is a repo seed. It has not been installed, typechecked, linted, built, migrated, seeded, browser-tested, or runtime-tested in this environment.

## Codex Wiring Boundary

The seeded UI and routes return dry-run/demo analytics. Codex must replace them with authenticated, tenant-scoped Prisma queries and must audit sensitive admin analytics actions before this phase can be accepted.
