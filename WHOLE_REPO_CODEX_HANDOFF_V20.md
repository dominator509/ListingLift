# WHOLE_REPO_CODEX_HANDOFF_V20.md

## Package
ListingLift Repo Seed v20

## Advanced phase
Phase 18 — Gumroad Checkout/Webhook Intake

## Context reviewed
ChatGPT unzipped v19 and reviewed all repo Markdown files plus `ListingLift.md` and `ListingLift_BUILD_ROADMAP.md` before advancing. See `CHATGPT_MARKDOWN_REVIEW_INDEX_V20.md`.

## What changed

- Added Gumroad domain constants, offer mappings, safe claims, and dedupe helpers.
- Added Gumroad Zod schemas for webhook payloads, normalized purchases, product mappings, and intake requests.
- Added Gumroad webhook signature verification helper.
- Added Gumroad product mapping service.
- Added Gumroad webhook event draft and purchase intake planning services.
- Added Gumroad fulfillment orchestrator for dry-run webhook plans.
- Added Gumroad API route contracts and `/api/webhooks/gumroad` alias.
- Replaced the admin Gumroad placeholder page with a real setup/intake UI shell.
- Added Gumroad admin UI components.
- Added Prisma schema/migration scaffolds for `GumroadProductMapping` and `GumroadWebhookEvent`.
- Added Phase 18 unit, security, integration, and E2E test scaffolds.
- Updated `.env.example`, environment schema, seed, `CODEX_GAPS.md`, `ROADMAP_STATUS.md`, and manifest.

## Codex instructions

1. Stitch this seed into the implementation repo.
2. Run dependency install and all checks.
3. Validate/repair Prisma schema and migrations.
4. Confirm the correct Gumroad webhook signature mechanism for the configured account.
5. Wire Gumroad webhook intake through raw-body verification and Prisma transactions.
6. Persist Gumroad webhook events before processing.
7. Enforce duplicate sale prevention.
8. Map products to packages/credits/digital-only/dashboard/agency actions server-side.
9. Do not grant access for refunded, disputed, duplicate, unverified, malformed, or unmapped sales.
10. Create jobs/upload links/credit ledger/admin notifications only after verified payment and mapping.
11. Preserve manual fallback and audit every sensitive action.
12. Update `ROADMAP_STATUS.md` with actual command results.
