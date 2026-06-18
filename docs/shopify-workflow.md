# Shopify Workflow

Phase 25 adds a manual-first Shopify workflow for product photo cleanup and image-pack fulfillment.

## MVP workflow

1. Capture Shopify store context manually.
2. Import product/SKU data from Shopify CSV export or operator-entered rows.
3. Create normalized ListingLift jobs from Shopify product batches.
4. Generate Shopify product-gallery outputs with selected presets.
5. Organize delivery ZIPs by product/SKU.
6. Require merchant review before publishing or replacing live product images.

## Scalable workflow

- Shopify OAuth app scaffold.
- Product image import through official Shopify APIs when enabled.
- Product image export through approved APIs/storage when enabled.
- Product-level image replacement approval.
- Shopify product-page visual audit.
- Storefront image consistency score.

## Safety rules

- Use official Shopify OAuth/API, approved webhooks, CSV imports, or manual workflows only.
- Do not scrape private Shopify admin pages.
- Do not store Shopify passwords or staff credentials.
- Store tokens only as encrypted secret references.
- Do not replace product images automatically without explicit merchant approval.
- Do not guarantee Shopify approval, traffic, ranking, sales, conversion, ad performance, product approval, or listing approval.

## Codex responsibilities

Codex must wire the seed contracts to real Prisma transactions, RBAC, tenant isolation, storage, audit logs, and test coverage. Real OAuth/API calls must remain disabled unless feature flags and environment variables explicitly enable them.
