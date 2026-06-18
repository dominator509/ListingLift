# CODEX_WHOLE_REPO_STITCH_PROMPT_V27.md

You are Codex implementing ListingLift from `ListingLift_Repo_Seed_v27.zip`.

## Current target

Stitch and validate Phase 25 — Shopify Workflow.

## Required process

1. Inspect the existing repository.
2. Merge the v27 seed carefully without deleting user work.
3. Install/update dependencies if needed.
4. Validate TypeScript imports.
5. Validate Prisma schema.
6. Regenerate/repair the Phase 25 migration.
7. Apply migrations in the configured dev database.
8. Run seed twice and confirm idempotence.
9. Wire Shopify dry-run routes to real Prisma transactions where appropriate.
10. Enforce server-side auth, RBAC, tenant isolation, duplicate prevention, audit logs, and marketplace safety.
11. Keep Shopify OAuth/API calls disabled by default.
12. Run unit, security, integration, E2E, typecheck, lint, build, Prisma validate, and seed checks.
13. Update `ROADMAP_STATUS.md` with real results.

## Hard rules

- Do not store Shopify passwords.
- Do not scrape private Shopify admin pages.
- Do not expose Shopify tokens/secrets to the frontend.
- Do not auto-replace product images without explicit merchant approval and scoped integration authorization.
- Do not guarantee Shopify approval, ranking, traffic, sales, conversion, ad performance, product approval, or listing approval.
- Do not mark Phase 25 complete until real checks pass.
