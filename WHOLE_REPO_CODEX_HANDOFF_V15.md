# WHOLE_REPO_CODEX_HANDOFF_V15.md

## Package

ListingLift Repo Seed v15 advances the repo seed through Phase 13 — Preview Gallery and Before/After.

## Source Review

ChatGPT unzipped v14, reviewed every Markdown file in the repo seed, and reviewed the two source project documents:

- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`

See `CHATGPT_MARKDOWN_REVIEW_INDEX_V15.md`.

## New Phase 13 Work

- Preview gallery domain logic.
- Preview schemas.
- Admin/client preview access guards.
- Before/after grouping.
- Image detail preview service.
- Bulk preview approval plan service.
- Admin/client/API route contracts.
- Admin preview gallery UI.
- Client approved-preview UI.
- Prisma preview gallery/item model scaffold.
- Phase 13 migration scaffold.
- Demo seed preview gallery/item.
- Phase 13 tests and documentation.

## Critical Rules

- Preview approval is not final delivery approval.
- Client preview visibility is allowed only for approved previews when preview access is enabled.
- Failed, flagged, rejected, and pending outputs remain admin-only.
- Final ZIP/download delivery remains gated by the delivery and approval workflows.
- Do not guarantee marketplace approval, ranking, sales, conversion, ad performance, or listing/product approval.

## Codex First Action

Use `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V15.md`, stitch this seed into the actual repo, install dependencies, validate migrations, run tests, and update `ROADMAP_STATUS.md` with real results.
