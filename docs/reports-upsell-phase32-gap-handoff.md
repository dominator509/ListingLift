# Phase 32 Gap Handoff — Reports and Upsell Engine

## ChatGPT-coded scope

This seed adds domain rules, schemas, dry-run services, API route contracts, UI shells, Prisma scaffolds, docs, and tests for Phase 32.

## Codex-only gaps

Codex must:

1. Validate Prisma schema and repair migration SQL.
2. Generate/apply migrations.
3. Wire reports to tenant-scoped Prisma queries.
4. Build metrics from real jobs, images, processed files, previews, QC flags, delivery archives, downloads, revenue, credits, and subscriptions.
5. Persist report drafts, metric snapshots, approval decisions, export plans, and report delivery events transactionally.
6. Persist upsell opportunities, templates, offers, events, and status changes transactionally.
7. Enforce `view:reports`, `manage:reports`, `generate:upsells`, `view:revenue`, `manage:clients`, and client-dashboard permissions server-side.
8. Ensure client reports expose only approved, client-visible data.
9. Prevent private admin notes, provider errors, secrets, tokens, raw signed URLs, and unapproved delivery links from entering report exports.
10. Keep upsell copy as manual-review drafts unless a future approved sending flow is explicitly enabled.
11. Audit every report generation, approval, export, delivery, upsell generation, upsell status change, and manual override.
12. Verify no compliance, ranking, sales, conversion, or ad-performance guarantee language appears.
