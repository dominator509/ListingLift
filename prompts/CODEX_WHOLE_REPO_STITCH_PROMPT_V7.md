# CODEX_WHOLE_REPO_STITCH_PROMPT_V7.md

You are Codex implementing ListingLift.

Use `ListingLift_Repo_Seed_v7.zip` as the latest ChatGPT-generated repo seed. Stitch it into the actual repository carefully.

## Mandatory Context

Read first:

- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `WHOLE_REPO_CODEX_HANDOFF_V7.md`
- `PHASE_5_EXECUTION_RUNBOOK.md`
- `PHASE_5_VERIFICATION_MATRIX.md`
- `PHASE_5_IMPLEMENTATION_NOTES.md`

## Current Seed Coverage

The seed includes ChatGPT-coded artifacts through Phase 5:

0. Repository Initialization
1. Design System and UI Shell
2. Database Schema and Migrations
3. Authentication and Sessions
4. Tenant, Client, RBAC, and Agency Model
5. Packages and Pricing

Do not mark any phase complete until runtime checks pass in the real repo.

## Primary Task

Verify and complete Phase 5 package/pricing wiring without starting Phase 6 until Phase 5 is clean or blockers are documented.

## Required Starting Report

Before edits, state:

1. Current roadmap phase.
2. Current task.
3. Acceptance criteria targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run after the change.

## Implementation Rules

- Preserve existing code unless intentionally replacing a scaffold.
- Keep packages data-driven.
- Keep pricing server-side.
- Require `manage:packages` for admin package mutations.
- Audit package pricing changes.
- Do not call Stripe until Phase 17.
- Do not call Gumroad until Phase 18.
- Do not guarantee marketplace compliance, ranking, sales, conversions, ad performance, or approval.
- Keep real integrations feature-flagged and disabled by default.

## Required Checks

Run and report real results:

```bash
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- package pricing
npm run test:integration -- packages-pricing
npm run test:e2e -- pricing
npm run typecheck
npm run lint
npm run build
```

If a command cannot run, document why in `ROADMAP_STATUS.md` and `CODEX_GAPS.md`.

## After Work

- Update `ROADMAP_STATUS.md`.
- Update `CODEX_GAPS.md`.
- Commit if git is available using: `phase-5: packages and pricing`.
- If git is unavailable, add a commit-style entry to `ROADMAP_STATUS.md`.
