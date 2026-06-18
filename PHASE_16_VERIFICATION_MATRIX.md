# Phase 16 Verification Matrix

| Area | Verification |
|---|---|
| Delivery token security | Raw tokens are shown once only, stored as hashes, and never logged. |
| Expiring links | Expired, revoked, inactive, and limit-reached links are denied. |
| Approval gates | Job approval and archive approval are required before download. |
| Tenant isolation | Token lookup cannot expose another organization's job or archive. |
| Download tracking | Resolve/start/complete/denied events are persisted and audited. |
| Email mock mode | Mock adapter works without SMTP or paid credentials. |
| SMTP mode | Disabled by default and only enabled through environment flags. |
| Marketplace copy | Copyable message uses compliance-safe non-guarantee language. |
| UI | `/delivery/[token]`, `/admin/jobs/[jobId]/delivery/send`, and `/admin/notifications` render. |
| Tests | Unit, integration, security, E2E, typecheck, lint, build, Prisma validate, and seed checks run. |
