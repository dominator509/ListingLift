# WHOLE_REPO_CODEX_HANDOFF_V22.md

## Package

`ListingLift_Repo_Seed_v22.zip`

## Source Review

Before coding Phase 20, ChatGPT unzipped `ListingLift_Repo_Seed_v21.zip`, reviewed all repository Markdown files, and reread the source documents:

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`

See `CHATGPT_MARKDOWN_REVIEW_INDEX_V22.md`.

## Current Seed Phase

Phase 20 — Fiverr Workflow

## What Was Added

- Fiverr workflow domain constants, safety rules, delivery copy, mapping helpers, dedupe helpers, and redaction helpers.
- Zod schemas for manual Fiverr orders, gig mappings, delivery template generation, revision status updates, and safety checks.
- Fiverr gig/package mapping service.
- Manual Fiverr order intake planner.
- Fiverr delivery-template service.
- Fiverr revision workflow service.
- Fiverr revenue attribution service.
- Fiverr marketplace-safety service.
- API route contracts under `/api/fiverr/*`.
- Admin UI pages under `/admin/fiverr/*`.
- Fiverr UI components.
- Prisma schema additions for Fiverr mappings, templates, and workflow events.
- Phase 20 migration scaffold.
- Phase 20 unit, security, integration, and E2E test scaffolds.
- Phase 20 docs, runbook, verification matrix, and gap handoff.

## Codex Must Do Next

1. Unzip this seed into the real repo carefully.
2. Inspect existing files before overwriting.
3. Install dependencies and update the lockfile.
4. Validate Prisma schema.
5. Regenerate Phase 20 migration SQL from the installed Prisma version.
6. Apply migrations.
7. Generate Prisma client.
8. Run seed twice after adding idempotent Fiverr mapping/template upserts.
9. Wire dry-run routes to real Prisma transactions.
10. Enforce RBAC and tenant isolation server-side.
11. Add audit logs for every Fiverr mutation.
12. Run all required checks.
13. Update `ROADMAP_STATUS.md` with real results.

## Critical Phase 20 Rules

- Fiverr workflow is manual-first.
- Do not scrape private Fiverr pages.
- Do not store Fiverr passwords.
- Do not automate buyer messaging unless Fiverr explicitly permits the integration mode.
- Keep final delivery inside Fiverr when required.
- Use external delivery links only where allowed.
- Final delivery must remain blocked until QC, approval, delivery archive, and delivery access gates pass.
- Do not expose unapproved, failed, flagged, rejected, pending, or admin-only outputs.
- Do not guarantee marketplace approval, ranking, sales, conversion, or ad performance.

## Required Runtime Checks

```bash
npm run test -- fiverr
npm run test:unit -- fiverr
npm run test:integration -- fiverr
npm run test:security -- fiverr
npm run test:e2e -- fiverr-manual-order
npm run typecheck
npm run lint
npm run build
npm run test:migration
npm run verify-env
npm run security-check
```

## Known Gaps

See `CODEX_GAPS.md` and `docs/fiverr-phase20-gap-handoff.md`.
