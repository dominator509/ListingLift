# PHASE_24_IMPLEMENTATION_NOTES.md

## Phase

Phase 24 — Etsy Workflow

## What ChatGPT Project Mode added

- Etsy workflow domain constants and marketplace-safe copy.
- Zod schemas for manual orders, listing imports, delivery templates, reports, revision status, and safety checks.
- Dry-run service contracts for manual Etsy order intake, listing import planning, delivery copy, visual consistency reports, revision status tracking, revenue attribution, and safety gating.
- API route contracts under `/api/etsy/*`.
- Admin UI shells under `/admin/etsy`, `/admin/etsy/order-intake`, `/admin/etsy/listings`, `/admin/etsy/delivery`, and `/admin/etsy/reports`.
- Prisma schema and migration scaffold for Etsy mapping, listing import rows, and workflow events.
- Unit, security, integration, and E2E test scaffolds.

## Important constraints

Manual fallback remains mandatory. Etsy API/OAuth/webhook behavior must stay disabled unless explicitly configured, verified, and permitted. Do not scrape private Etsy pages, store Etsy passwords, or automate buyer messages/listing edits outside approved integration paths.
