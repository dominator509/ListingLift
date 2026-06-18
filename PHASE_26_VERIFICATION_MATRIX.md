# PHASE_26_VERIFICATION_MATRIX.md

| Area | Required Check | Status |
|---|---|---|
| Markdown review | Confirm v28 review index includes all repo Markdown plus source docs | Prepared by ChatGPT |
| Prisma | Validate schema and regenerate migration | Codex required |
| Seed | Seed social-commerce mappings idempotently with fake IDs only | Codex required |
| RBAC | Enforce `manage:sales-channels`, `create:manual-orders`, `manage:jobs` | Codex required |
| Tenant isolation | Scope all mappings/orders/jobs/events by organization | Codex required |
| Safety | Block scraping, password storage, auto-DMs/comments/posts/uploads | Codex required |
| Manual fallback | Ensure manual workflows remain baseline | Codex required |
| Delivery | Generate delivery copy only for approved archives and allowed link contexts | Codex required |
| UI | Verify `/admin/social-commerce/*` pages render | Codex required |
| Tests | Run unit, security, integration, E2E, typecheck, lint, build | Codex required |
