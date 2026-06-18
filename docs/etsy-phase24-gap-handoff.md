# docs/etsy-phase24-gap-handoff.md

## Codex-owned gaps

- Validate Prisma schema and regenerate the Phase 24 migration SQL.
- Wire API routes to real tenant-scoped Prisma transactions.
- Persist Etsy listing-pack mappings, listing import rows, workflow events, external orders, jobs, upload tokens, revenue attribution, and audit logs.
- Verify Etsy order dedupe by organization + shop/order ID.
- Connect Etsy preset output generation to `EtsyListingSquare` and delivery ZIP folder planning.
- Ensure delivery template generation only references approved delivery archives.
- Ensure Etsy visual reports are persisted as reports where appropriate.
- Confirm any Etsy API/OAuth/webhook work uses official APIs and feature flags.
- Keep manual fallback working if API/webhook integration is unavailable.
- Run all Phase 24 tests/checks and update `ROADMAP_STATUS.md` with real results.
