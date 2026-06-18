# PHASE_18_IMPLEMENTATION_NOTES.md — Gumroad Checkout/Webhook Intake

## Scope seeded in ChatGPT

Phase 18 adds Gumroad productized-service intake scaffolding. The seed includes domain constants, Zod schemas, webhook signature helpers, product/package mapping, purchase intake planning, dry-run API route contracts, admin UI, Prisma schema/migration scaffolds, tests, and Codex gap documentation.

## Product rules preserved

- Gumroad is a sales channel, not a separate fulfillment workflow.
- Every Gumroad sale must normalize into ListingLift's internal client, external order, job, credit, or dashboard-access model.
- Duplicate Gumroad sale IDs must not duplicate jobs, upload links, credits, or entitlement grants.
- Refunded/disputed/chargebacked sales must not grant fulfillment access.
- Image-pack purchases may create jobs and upload links only after verified payment and server-side mapping.
- Digital-only products do not create fulfillment jobs automatically.
- Manual fallback remains available for unmapped products or unverifiable webhook signatures.
- Gumroad emails, payloads, and notifications must be redacted and audited where appropriate.

## ChatGPT-coded areas

- `src/domain/gumroad.ts`
- `src/schemas/gumroad.ts`
- Gumroad webhook signature verification service
- Gumroad product mapping service
- Gumroad webhook event draft service
- Gumroad purchase intake planning service
- Gumroad fulfillment orchestrator
- `/api/gumroad/*` route contracts
- `/api/webhooks/gumroad` alias route
- Admin Gumroad UI panels
- Prisma `GumroadProductMapping` and `GumroadWebhookEvent` scaffolds
- Phase 18 tests and E2E smoke scaffold

## Important limitation

The seed does not call Gumroad APIs and does not persist real webhook results. Codex must verify Gumroad's configured webhook signing mechanism, then wire persistence through Prisma transactions.
