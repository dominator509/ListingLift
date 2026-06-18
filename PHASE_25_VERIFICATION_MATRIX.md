# PHASE_25_VERIFICATION_MATRIX.md — Shopify Workflow

| Area | Required check | Owner |
|---|---|---|
| Prisma | `npx prisma validate` and migration generation | Codex |
| Seed | Seed runs twice without duplicates | Codex |
| Manual intake | Creates Client, ExternalOrder, Job, UploadToken, ShopifyWorkflowEvent, AuditLog transactionally | Codex |
| CSV import | Persists product/SKU rows and folder paths | Codex |
| Duplicate prevention | Organization + store + product/SKU/order reference cannot duplicate jobs | Codex |
| OAuth | Disabled by default and token references encrypted | Codex |
| Replacement approval | Blocks live/manual replacement until merchant approval exists | Codex |
| Delivery | Uses approved archives only and groups ZIP entries by product/SKU | Codex |
| Safety | No scraping, password storage, token exposure, or unauthorized auto-replacement | Codex |
| UI | Shopify admin pages render | Codex |
| Tests | Phase 25 unit/security/integration/E2E/typecheck/lint/build pass | Codex |
