# WHOLE_REPO_CODEX_HANDOFF_V16.md

## Package

ListingLift Repo Seed v16 advances the repo seed through Phase 14 — Quality Control and Flagged Outputs.

## Source Review

ChatGPT unzipped v15, reviewed every Markdown file in the repo seed, and reviewed the two source project documents:

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`

See `CHATGPT_MARKDOWN_REVIEW_INDEX_V16.md`.

## New Phase 14 Work

- Quality-control domain catalog and checklist.
- QC schemas for review, flagging, resolution, and bulk actions.
- QC scoring, flagging, access, review, flagged queue, and manual replacement services.
- Admin QC and flagged-output UI shells.
- QC API route contracts.
- Prisma quality review/flag/event model scaffold.
- Phase 14 migration scaffold.
- Seed quality review/flag/event records.
- Phase 14 unit, integration, security, and E2E tests.
- Updated Codex gaps, roadmap status, docs, and manifest.

## Critical Rules

- QC pass is not final delivery approval.
- Unresolved blocking flags must block final delivery.
- Client-facing routes must never expose flagged, failed, rejected, pending, or admin-only output details.
- Admin notes remain admin-only.
- Manual fallback is required for failed masks, missing parts, product accuracy failures, and other blocker issues.
- Do not guarantee marketplace approval, ranking, sales, conversion, ad performance, listing approval, or product approval.

## Codex First Action

Use `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V16.md`, stitch this seed into the actual repo, install dependencies, validate migrations, run tests, and update `ROADMAP_STATUS.md` with real results.
