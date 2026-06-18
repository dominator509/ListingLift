# Shopify Phase 25 Gap Handoff

The ChatGPT environment produced codeable Shopify workflow scaffolds but did not run runtime checks.

## Must be completed by Codex

- Validate Prisma schema.
- Regenerate or repair `0024_phase25_shopify_workflow` migration SQL.
- Generate Prisma client.
- Apply migrations.
- Run seed twice.
- Persist Shopify image pack mappings idempotently.
- Connect `/api/shopify/manual-order` to tenant-scoped Prisma transactions.
- Create or match `Client` records from store/merchant fields with minimal stored personal data.
- Create `ExternalOrder` with channel `Shopify`, dedupe by organization + store + product/SKU/order reference, and preserve revenue attribution.
- Create `Job`, initial `JobStatusEvent`, optional `UploadToken`, `ShopifyWorkflowEvent`, and `AuditLog` transactionally.
- Persist product/SKU import rows from CSV/API scaffold.
- Group delivery ZIP entries by product/SKU using `Shopify/product-gallery/<sku-or-product>` paths.
- Keep OAuth disabled unless `SHOPIFY_ENABLED`, `SHOPIFY_OAUTH_ENABLED`, and `REAL_INTEGRATIONS_ENABLED` are true.
- Store OAuth tokens only through encrypted `EncryptedSecret` references.
- Do not expose Shopify API keys, secrets, tokens, or webhook secrets to the frontend.
- Require merchant approval before product image replacement.
- Verify no code scrapes private Shopify admin pages, stores Shopify passwords, or auto-replaces images without authorization.
- Run Phase 25 unit, security, integration, E2E, typecheck, lint, build, Prisma validate, and seed checks.
