# Phase 27 Verification Matrix

| Area | Required Check | Codex-Owned |
|---|---|---:|
| Prisma | Schema validates and migration applies | Yes |
| Seed | Marketplace mappings seed idempotently | Yes |
| RBAC | Manage sales channels/jobs required | Yes |
| Tenant isolation | All queries scoped by organization/client/job | Yes |
| Dedupe | Duplicate Amazon/eBay/WooCommerce refs blocked | Yes |
| Export plan | Uses approved ProcessedFile/DeliveryArchive only | Yes |
| Delivery | Client links hidden until approval gates pass | Yes |
| Safety | No scraping/password storage/auto-publishing | Yes |
| Copy | No compliance/ranking/sales guarantees | Yes |
| UI | Admin marketplace export pages render | Yes |
| Tests | Unit/security/integration/E2E pass | Yes |
