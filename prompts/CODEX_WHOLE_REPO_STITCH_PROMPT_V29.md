# Codex Whole Repo Stitch Prompt V29

You are Codex implementing ListingLift.

Use `ListingLift_Repo_Seed_v29.zip` as the current seed package. Stitch it into the actual repository carefully.

## Current Phase

Phase 27 — Amazon, eBay, and WooCommerce Workflows

## Required Before Editing

Report:

1. Current roadmap phase.
2. Current roadmap task.
3. Acceptance criteria targeted.
4. Files expected to be created or modified.
5. Tests/checks to run after changes.

## Implementation Requirements

- Preserve `ARCHITECTURE.md` and `BUILD_ROADMAP.md` as source authority.
- Keep roadmap order documented in `ROADMAP_STATUS.md`.
- Connect Phase 27 dry-run routes to real tenant-scoped Prisma service transactions.
- Enforce RBAC and tenant isolation server-side.
- Add audit logs for all marketplace export mutations.
- Preserve manual fallback as default.
- Do not scrape Amazon/eBay/WooCommerce private pages.
- Do not store marketplace passwords.
- Do not auto-publish, auto-upload, auto-edit, or auto-message outside approved integration paths.
- Do not guarantee marketplace compliance, listing approval, ranking, sales, conversion, or ad performance.

## Required Checks

Run, where available:

- `npm run typecheck`
- `npm run lint`
- `npm run test -- marketplace`
- `npm run test:security -- marketplace`
- `npm run test:integration -- marketplace`
- `npm run test:e2e -- marketplace-exports`
- `npm run build`
- `npx prisma validate`
- Migration generation/apply checks
- Seed idempotency checks

Update `ROADMAP_STATUS.md` with real pass/fail results and fix failures before advancing.
