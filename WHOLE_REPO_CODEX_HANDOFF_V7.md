# WHOLE_REPO_CODEX_HANDOFF_V7.md

## Package

`ListingLift_Repo_Seed_v7.zip`

## Current Seed Scope

This package contains ChatGPT-generated repo seed artifacts through:

- Phase 0 — Repository Initialization
- Phase 1 — Design System and UI Shell
- Phase 2 — Database Schema and Migrations
- Phase 3 — Authentication and Sessions
- Phase 4 — Tenant, Client, RBAC, and Agency Model
- Phase 5 — Packages and Pricing

No phase is runtime-complete until Codex installs dependencies, validates Prisma, runs migrations, runs tests, typechecks, lints, builds, and updates `ROADMAP_STATUS.md` with real results.

## Source Review Completed

Before v7 changes, ChatGPT unzipped the v6 package and read/indexed all Markdown files in the seed plus source docs:

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`

The review index is in `CHATGPT_MARKDOWN_REVIEW_INDEX_V7.md`.

## Phase 5 Additions

The v7 seed adds:

- Expanded package domain records with category, slug, checkout mode, safe claims, deliverables, recommended audience, price policy, upsell keys, popularity, and sort order.
- Package Zod schemas for package records, admin update requests, quote requests, and checkout selections.
- Server-side package service for listing, finding, display price formatting, allowance checks, revision checks, admin update drafts, and sales-channel package mapping.
- Server-side pricing service for package quote calculations and manual-quote decisions.
- Checkout entry service for package selection and normalized job draft defaults.
- API route contracts for package listing/detail/admin update, pricing quote, and checkout package selection.
- Public pricing/package pages backed by package records.
- Checkout package entry page backed by server-side package/quote services.
- Admin packages page/table shell.
- Prisma Package model additions and Phase 5 migration scaffold.
- Unit/integration/E2E test scaffolds for packages, pricing, checkout entry, admin update contracts, and pricing page smoke.
- Updated `CODEX_GAPS.md`, `ROADMAP_STATUS.md`, phase docs, prompt, manifest, and review index.

## Codex Stitching Priorities

1. Unzip this package into a clean branch or compare tree.
2. Preserve any existing user-written code.
3. Install dependencies.
4. Run Prisma validation and generate client.
5. Regenerate/repair migration SQL if needed.
6. Run seed twice.
7. Run typecheck/lint/build/tests.
8. Connect package admin routes to real Prisma persistence.
9. Audit package/pricing mutations.
10. Verify public pricing and checkout pages in runtime.
11. Update `ROADMAP_STATUS.md` with true command results.

## Do Not Claim Completion Until

- Package Prisma schema validates.
- Package migration applies.
- Required package records seed idempotently.
- Public pricing and packages pages render.
- Checkout uses server-side pricing, not client-supplied prices.
- Admin package update requires `manage:packages`.
- Package changes are audited.
- Image/revision allowance rules are enforced by services and integration flow.
- Marketplace-safe claims remain in UI/API output.
- Typecheck, lint, build, unit, integration, and pricing E2E checks pass.

## Primary Files for Codex

- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `PHASE_5_EXECUTION_RUNBOOK.md`
- `PHASE_5_VERIFICATION_MATRIX.md`
- `PHASE_5_IMPLEMENTATION_NOTES.md`
- `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V7.md`
- `REPO_FILE_MANIFEST_V7.md`

## Safety Rules

- Never expose secrets.
- Never store plaintext tokens or marketplace passwords.
- Never trust request-body organization or client IDs for scoped mutations.
- Never expose final delivery before admin approval.
- Never guarantee marketplace compliance, rankings, conversions, sales, or ad performance.
- Keep real integrations disabled by default.
- Preserve original uploads.
- Audit paid/client-facing manual overrides.
- Do not call Stripe before Phase 17.
- Do not call Gumroad before Phase 18.
