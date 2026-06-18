# PHASE_25_IMPLEMENTATION_NOTES.md — Shopify Workflow

## Objective

Add Shopify workflow scaffolding for manual Shopify product image fulfillment, product/SKU CSV import, Shopify preset outputs, ZIP-by-product/SKU delivery, OAuth scaffold controls, product image replacement approvals, storefront visual audit notes, and marketplace-safe delivery copy.

## Implemented in this seed

- Shopify domain constants and safety rules.
- Zod schemas for manual order intake, product CSV import, delivery templates, product-page audits, replacement approvals, OAuth scaffold, and safety checks.
- Service-layer planners for package mapping, manual intake, product import, delivery messages, product-page audits, image replacement approval, OAuth scaffold, safety checks, and revenue attribution.
- Dry-run API route contracts under `/api/shopify/*`.
- Admin UI pages and components under `/admin/shopify/*`.
- Prisma schema scaffold for Shopify mappings, product import rows, OAuth connection scaffolds, and workflow events.
- Migration scaffold for Phase 25.
- Unit, security, integration, and E2E test scaffolds.

## Deliberate non-goals in ChatGPT environment

- No real Shopify API calls.
- No OAuth callback implementation.
- No token storage implementation.
- No migration execution.
- No runtime/browser verification.
- No live product image replacement.
