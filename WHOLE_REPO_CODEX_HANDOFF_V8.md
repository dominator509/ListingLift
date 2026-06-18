# WHOLE_REPO_CODEX_HANDOFF_V8.md

## Package

`ListingLift_Repo_Seed_v8.zip`

## Current Seed Scope

This package contains ChatGPT-generated repo seed artifacts through:

- Phase 0 — Repository Initialization
- Phase 1 — Design System and UI Shell
- Phase 2 — Database Schema and Migrations
- Phase 3 — Authentication and Sessions
- Phase 4 — Tenant, Client, RBAC, and Agency Model
- Phase 5 — Packages and Pricing
- Phase 6 — Platform Preset System

No phase is runtime-complete until Codex installs dependencies, validates Prisma, runs migrations, runs tests, typechecks, lints, builds, connects placeholder persistence, audits mutations, and updates `ROADMAP_STATUS.md` with real results.

## Source Review Completed

Before v8 changes, ChatGPT unzipped the v7 package and read/indexed all Markdown files in the seed plus source docs:

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`

The review index is in `CHATGPT_MARKDOWN_REVIEW_INDEX_V8.md`.

## Phase 6 Additions

The v8 seed adds:

- Expanded data-driven platform preset domain catalog for all required roadmap presets.
- Preset validation logic for dimensions, folders, naming conventions, safe language, and prohibited claims.
- Preset selector service for target platforms, selected preset keys, white-background JPGs, transparent outputs, and social-commerce outputs.
- Preset folder/output planning service for deterministic naming and ZIP-safe folder paths.
- API route contracts for preset list/detail/update, preset selector, custom preset draft, and catalog validation.
- Admin preset manager page and reusable preset UI components.
- Prisma PlatformPreset model additions and Phase 6 migration scaffold.
- Seed updates for enriched platform preset records.
- Unit, integration, and E2E test scaffolds for Phase 6 preset contracts.
- Updated `CODEX_GAPS.md`, `ROADMAP_STATUS.md`, phase docs, prompt, manifest, and review index.

## Codex Stitching Priorities

1. Unzip this package into a clean branch or compare tree.
2. Preserve any existing user-written code.
3. Install dependencies.
4. Run Prisma validation and generate client.
5. Regenerate/repair Phase 6 migration SQL if needed.
6. Run seed twice and verify all required presets exist.
7. Run typecheck/lint/build/tests.
8. Connect preset admin routes to real Prisma persistence.
9. Audit preset mutations.
10. Verify `/admin/presets` in runtime.
11. Update `ROADMAP_STATUS.md` with true command results.

## Do Not Claim Completion Until

- PlatformPreset Prisma schema validates.
- Phase 6 migration applies.
- Required platform preset records seed idempotently.
- Presets drive dimensions, background, format, compression, safe margin, naming, and folder destination.
- Admin preset update requires `manage:presets`.
- Preset changes are audited.
- Custom presets are tenant-scoped.
- Folder paths are ZIP-safe.
- Marketplace-safe claims remain in UI/API output.
- Typecheck, lint, build, unit, integration, and preset-manager E2E checks pass.

## Primary Files for Codex

- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`
- `PHASE_6_EXECUTION_RUNBOOK.md`
- `PHASE_6_VERIFICATION_MATRIX.md`
- `PHASE_6_IMPLEMENTATION_NOTES.md`
- `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V8.md`
- `REPO_FILE_MANIFEST_V8.md`

## Safety Rules

- Never expose secrets.
- Never store plaintext tokens or marketplace passwords.
- Never trust request-body organization or client IDs for scoped mutations.
- Never expose final delivery before admin approval.
- Never guarantee marketplace compliance, rankings, conversions, sales, or ad performance.
- Keep real integrations disabled by default.
- Preserve original uploads.
- Audit paid/client-facing manual overrides.
- Keep platform presets as data-driven records, not static UI-only copy.
