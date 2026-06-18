# Whole Repo Codex Handoff V29 — ListingLift

## Current Seed Version

`ListingLift_Repo_Seed_v29.zip`

## Phase Added

Phase 27 — Amazon, eBay, and WooCommerce Workflows.

## What ChatGPT Added

- Marketplace export domain constants, safe copy, safety rules, and helpers.
- Zod schemas for manual order intake, mapping, export plans, delivery templates, warnings, revision status, and safety checks.
- Dry-run services for Amazon/eBay/WooCommerce workflows.
- Dry-run API route contracts under `/api/marketplace-exports/*`.
- Admin UI shell under `/admin/marketplace-exports/*`.
- Prisma schema and migration scaffold.
- Unit, security, integration, and E2E test scaffolds.
- Phase docs, gap handoff, roadmap status, and manifest updates.

## Critical Codex Instructions

- Do not treat dry-run route bodies as trusted state.
- Replace dry-run planning with server-side Prisma lookups and transactions.
- Enforce RBAC and tenant isolation on every route/service.
- Preserve manual fallback as default.
- Do not scrape private marketplace or WooCommerce admin pages.
- Do not store marketplace passwords.
- Do not auto-publish listings/images without an approved integration and explicit authorization.
- Never guarantee Amazon compliance, eBay compliance, WooCommerce theme/plugin approval, listing approval, ranking, sales, conversion, or ad performance.
- Update `ROADMAP_STATUS.md` with actual command results.
