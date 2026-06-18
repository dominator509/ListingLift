# Phase 27 Gap Handoff — Amazon, eBay, WooCommerce

## ChatGPT-Coded Seed Artifacts

- Domain constants and safe copy for Amazon/eBay/WooCommerce workflows.
- Zod schemas for manual order intake, mapping, export plan, delivery templates, compliance warnings, revisions, and safety checks.
- Dry-run service contracts for planning only.
- Dry-run API route contracts under `/api/marketplace-exports/*`.
- Admin shell pages and reusable components.
- Prisma schema and migration scaffold.
- Unit/security/integration/E2E test scaffolds.

## Codex-Owned Runtime Work

- Validate schema, regenerate migration, generate Prisma client, apply migrations, and seed twice.
- Connect manual-order, mapping, export-plan, delivery-template, compliance-warning, revision-status, and safety routes to Prisma.
- Enforce RBAC and tenant isolation server-side.
- Create ExternalOrder, Job, UploadToken, MarketplaceExportWorkflowEvent, revenue attribution, and AuditLog transactionally.
- Prevent duplicates by organization + channel + external reference/SKU/store.
- Build export plans only from approved ProcessedFile and DeliveryArchive rows.
- Generate CSV/manifest and ZIP entries with ZIP-safe paths.
- Ensure client delivery links remain hidden until approval gates allow access.
- Keep all marketplace integration behavior manual/export by default.

## Security and Marketplace Gaps

- Verify no scraping of Seller Central, eBay seller tools, WooCommerce admin, private order pages, or dashboards.
- Verify no marketplace password fields or logs exist.
- Verify no auto-publishing, auto-uploading, or buyer-message automation exists outside approved integrations.
- Verify all language avoids compliance, ranking, sales, conversion, product approval, listing approval, and ad performance guarantees.
