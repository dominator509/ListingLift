# PHASE_17_IMPLEMENTATION_NOTES.md

## Phase
Phase 17 — Stripe Checkout and Billing

## What ChatGPT coded

This seed adds Stripe checkout and billing scaffolds for package checkout, subscription checkout, credit purchases, retainer billing, agency billing, webhook verification, billing UI, and safety tests.

## Non-negotiable rules

- Stripe is disabled by default.
- Real Stripe calls require `STRIPE_ENABLED=true` and `REAL_INTEGRATIONS_ENABLED=true`.
- Webhooks must verify signatures before processing.
- Webhooks must be idempotent by Stripe event ID.
- Failed, expired, pending, duplicate, or unverified payments must not grant access, credits, upload links, subscriptions, or delivery.
- Client-submitted prices must be ignored.
- Server package records determine amounts and mode.
- Manual payment fallback remains available.
- No Stripe secret may reach client code, logs, seed data, snapshots, or JSON responses.

## Codex-owned implementation

Codex must install dependencies, validate Prisma, generate migrations, wire official Stripe SDK calls in test mode, persist checkout sessions and webhook events transactionally, and run all tests.
