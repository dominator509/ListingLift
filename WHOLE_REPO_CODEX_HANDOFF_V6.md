# WHOLE_REPO_CODEX_HANDOFF_V6.md

## Package

`ListingLift_Repo_Seed_v6.zip`

## Current Seed Scope

This package contains ChatGPT-generated repo seed artifacts through:

- Phase 0 — Repository Initialization
- Phase 1 — Design System and UI Shell
- Phase 2 — Database Schema and Migrations
- Phase 3 — Authentication and Sessions
- Phase 4 — Tenant, Client, RBAC, and Agency Model

No phase is runtime-complete until Codex installs dependencies, validates Prisma, runs migrations, runs tests, typechecks, lints, builds, and updates `ROADMAP_STATUS.md` with real results.

## Source Review Completed

Before v6 changes, ChatGPT unzipped the v5 package and read/indexed all Markdown files in the seed plus source docs:

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`

The review index is in `CHATGPT_MARKDOWN_REVIEW_INDEX_V6.md`.

## Phase 4 Additions

The v6 seed adds:

- Organization type and hierarchy scaffold.
- Client-scoped memberships.
- Agency-scope memberships.
- Extended session scope.
- Tenant/client/agency domain rules.
- RBAC policy service.
- Client access service.
- Team service with role-escalation prevention.
- Organization and agency services.
- API route contracts for RBAC, team, clients, and agency branding.
- RBAC admin UI shell.
- Phase 4 migration scaffold.
- Phase 4 tests.
- Updated `CODEX_GAPS.md` and `ROADMAP_STATUS.md`.

## Codex Stitching Priorities

1. Unzip this package into a clean branch or compare tree.
2. Preserve any existing user-written code.
3. Install dependencies.
4. Run Prisma validation and generate client.
5. Regenerate/repair migration SQL if needed.
6. Run seed twice.
7. Run typecheck/lint/build/tests.
8. Connect Phase 4 placeholder routes to real Prisma persistence.
9. Audit membership and agency branding mutations.
10. Update `ROADMAP_STATUS.md` with true command results.

## Do Not Claim Completion Until

- Phase 4 Prisma schema validates.
- Phase 4 migration applies.
- Extended sessions work in runtime.
- Client and agency scoping are verified in tests.
- Role escalation prevention is verified.
- Placeholder API route responses are replaced or explicitly documented as intentional scaffolds.
- Typecheck, lint, build, and relevant tests pass.

## Primary Files for Codex

- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `PHASE_4_EXECUTION_RUNBOOK.md`
- `PHASE_4_VERIFICATION_MATRIX.md`
- `PHASE_4_IMPLEMENTATION_NOTES.md`
- `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V6.md`
- `REPO_FILE_MANIFEST_V6.md`

## Safety Rules

- Never expose secrets.
- Never store plaintext tokens or marketplace passwords.
- Never trust request-body organization or client IDs for scoped mutations.
- Never expose final delivery before admin approval.
- Never guarantee marketplace compliance, rankings, conversions, sales, or ad performance.
- Keep real integrations disabled by default.
- Preserve original uploads.
- Audit paid/client-facing manual overrides.
