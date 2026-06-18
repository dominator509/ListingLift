# Full Testing and QA

## Phase

Phase 38 — Full Testing and QA

## Purpose

This document defines the ListingLift QA layer for Codex. It is a verification framework for the service-first product-photo fulfillment system, not a claim that verification already happened.

## QA layers

- Environment verification.
- Prisma schema, migration, and client generation.
- Seed idempotency.
- TypeScript typecheck.
- Lint.
- Unit tests.
- Security tests.
- Integration route/service contracts.
- Adapter-contract tests.
- Playwright E2E tests.
- Next production build.
- Smoke checks.
- Browser rendering checks.

## Core ListingLift coverage

QA must cover:

- Service packages and pricing.
- Platform presets and output folders.
- Sales-channel normalization.
- Upload intake and unsafe-file rejection.
- Job creation and admin queue.
- Image processing provider adapters and original preservation.
- Naming, manifest, ZIP packaging, and ZIP slip prevention.
- Preview gallery, QC, flagged outputs, approval, revision, and delivery.
- Billing, credits, subscriptions, manual invoices, Stripe, and Gumroad.
- Fiverr, Upwork, Taskrabbit, Etsy, Shopify, social, Amazon, eBay, WooCommerce, and other sales-channel workflows.
- Storage integrations, automation webhooks, task/notification tools.
- Advanced image processing and local workers.
- Reports, upsells, revenue analytics, retainer alerts.
- Client dashboard, admin dashboard, agency white-label mode, API access, and security hardening.

## Evidence rules

- A check can only be marked `PASS` with evidence.
- Evidence can include command output, screenshots, traces, logs, database records, manual review notes, or artifacts.
- Evidence must not include raw secrets, tokens, signed URLs, marketplace credentials, private notes, provider keys, raw webhook payloads, raw file bytes, or customer-sensitive data.
- Failed or blocked commands must stay documented in `CODEX_GAPS.md`.

## No-fake-result rule

Do not claim anything was installed, compiled, migrated, seeded, linted, typechecked, built, browser-tested, security-tested, provider-tested, webhook-tested, storage-tested, or deployed unless the command or runtime check was actually run and evidence exists.

## Codex-only execution command

```bash
npm run test-all
```

The `test-all` script is intentionally Codex-only. It was added in v40 but not run in ChatGPT Project Mode.
