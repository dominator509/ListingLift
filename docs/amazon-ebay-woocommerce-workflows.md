# Amazon, eBay, and WooCommerce Workflows

Phase 27 adds manual/export workflows for Amazon Seller, eBay, and WooCommerce image-pack fulfillment.

## Core Rules

- Use manual workflows, seller-provided exports, CSV imports, official APIs, or approved app integrations only.
- Do not scrape private marketplace/admin pages.
- Do not store marketplace passwords or WooCommerce admin passwords.
- Do not auto-publish listings or auto-upload product images without explicit approved integration and authorization.
- All marketplace outputs are platform-ready drafts requiring seller review.
- Do not guarantee marketplace compliance, approval, ranking, sales, conversion, or ad performance.

## Amazon

Amazon workflow seed supports:

- Main image draft planning.
- Secondary image draft planning.
- Transparent cutouts.
- White JPG outputs.
- Crop suggestion notes.
- Quality warning language.
- Product launch sequence recommendations.
- Seller review required wording.

## eBay

 eBay workflow seed supports:

- Clean cutouts.
- Square listing image plans.
- Multi-angle naming.
- ZIP-by-SKU folder plans.
- White backgrounds.
- Compressed JPG planning.

## WooCommerce

WooCommerce is scaffolded as a later ecommerce/manual import path:

- Product gallery exports.
- Thumbnail variants.
- CSV/product import notes.
- Theme/plugin review reminders.
- Storefront-safe non-guarantee copy.

## Codex Required Work

Codex must wire dry-run route contracts to tenant-scoped Prisma transactions, storage, approved delivery archives, audit logs, RBAC, duplicate prevention, and runtime validation.
