# WHOLE_REPO_CODEX_HANDOFF_V23.md

## Package

`ListingLift_Repo_Seed_v23.zip`

## Source Review

Before coding Phase 21, ChatGPT unzipped `ListingLift_Repo_Seed_v22.zip`, reviewed all repository Markdown files, and reread the source documents:

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`

See `CHATGPT_MARKDOWN_REVIEW_INDEX_V23.md`.

## Current Seed Phase

Phase 21 — Upwork Workflow

## What Was Added

- Upwork workflow domain constants, safety rules, proposal/delivery copy, retainer reminder copy, mapping helpers, dedupe helpers, and redaction helpers.
- Zod schemas for manual Upwork contracts, offer mappings, proposal templates, delivery templates, revision status updates, retainer reminders, and safety checks.
- Upwork offer/package mapping service.
- Manual Upwork contract intake planner.
- Upwork proposal/delivery/retainer template service.
- Upwork revision workflow service.
- Upwork revenue attribution service.
- Upwork marketplace-safety service.
- API route contracts under `/api/upwork/*`.
- Admin UI pages under `/admin/upwork/*`.
- Upwork UI components.
- Prisma schema additions for Upwork mappings, proposal templates, and workflow events.
- Phase 21 migration scaffold.
- Phase 21 unit, security, integration, and E2E test scaffolds.
- Phase 21 docs, runbook, verification matrix, and gap handoff.

## Codex Must Do Next

1. Unzip this seed into the real repo carefully.
2. Inspect existing files before overwriting.
3. Install dependencies and update the lockfile.
4. Validate Prisma schema.
5. Regenerate Phase 21 migration SQL from the installed Prisma version.
6. Apply migrations.
7. Generate Prisma client.
8. Run seed twice after adding idempotent Upwork mapping/template upserts.
9. Wire dry-run routes to real Prisma transactions.
10. Enforce RBAC and tenant isolation server-side.
11. Add audit logs for every Upwork mutation.
12. Run all required checks.
13. Update `ROADMAP_STATUS.md` with real results.

## Critical Phase 21 Rules

- Upwork workflow is manual-first.
- Do not scrape private Upwork pages, messages, work diaries, or client profiles.
- Do not store Upwork passwords.
- Do not automate Upwork proposal submission, buyer/client messaging, or delivery unless Upwork explicitly permits the integration mode.
- Keep final delivery inside Upwork when required.
- Use external delivery links only where allowed.
- Final delivery must remain blocked until QC, approval, delivery archive, and delivery access gates pass.
- Do not expose unapproved, failed, flagged, rejected, pending, or admin-only outputs.
- Do not guarantee marketplace approval, ranking, sales, conversion, or ad performance.

## Required Runtime Checks

```bash
npm run test -- upwork
npm run test:unit -- upwork
npm run test:integration -- upwork
npm run test:security -- upwork
npm run test:e2e -- upwork-manual-contract
npm run typecheck
npm run lint
npm run build
npm run test:migration
npm run verify-env
npm run security-check
```

## Known Gaps

See `CODEX_GAPS.md` and `docs/upwork-phase21-gap-handoff.md`.
