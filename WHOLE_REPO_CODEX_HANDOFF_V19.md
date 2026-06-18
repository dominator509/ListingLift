# WHOLE_REPO_CODEX_HANDOFF_V19.md

## Package
ListingLift Repo Seed v19

## Advanced phase
Phase 17 — Stripe Checkout and Billing

## Context reviewed
ChatGPT unzipped v18 and reviewed all repo Markdown files plus `ListingLift.md` and `ListingLift_BUILD_ROADMAP.md` before advancing. See `CHATGPT_MARKDOWN_REVIEW_INDEX_V19.md`.

## What changed

- Added Stripe billing domain constants and schemas.
- Expanded payment adapter types and Stripe adapter scaffold.
- Added Stripe checkout, credit, subscription, customer portal, webhook signature, webhook processing, entitlement, and orchestration services.
- Added Stripe checkout and webhook API route contracts.
- Added billing UI components and pages.
- Added Prisma model/migration scaffold for Stripe checkout sessions and webhook events.
- Added Phase 17 tests and docs.
- Updated `CODEX_GAPS.md`, `ROADMAP_STATUS.md`, and manifest.

## Codex instructions

1. Stitch this seed into the implementation repo.
2. Run dependency install and all checks.
3. Validate/repair Prisma schema and migrations.
4. Replace seed Stripe draft calls with official Stripe SDK test-mode calls.
5. Verify webhooks from raw request body.
6. Preserve manual fallback and all payment access gates.
7. Update `ROADMAP_STATUS.md` with actual command results.
