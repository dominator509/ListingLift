# PHASE_34_VERIFICATION_MATRIX.md

| Area | Required Check | Codex Owner |
|---|---|---|
| Auth | Admin dashboard routes require authenticated session | Yes |
| RBAC | Revenue analytics require `view:revenue`; job buckets require `manage:jobs`; retainer alerts require upsell permissions | Yes |
| Tenant isolation | All analytics queries are organization-scoped server-side | Yes |
| Client isolation | Client-scoped roles cannot access admin analytics | Yes |
| Job buckets | Active, completed, flagged, blocked, and due-soon jobs are derived from real job/QC/deadline state | Yes |
| Revenue | Gross/refund/net revenue is derived from verified payment, invoice, external order, and refund records | Yes |
| Source tracking | Source attribution is preserved from external order through job/report/upsell/billing analytics | Yes |
| Conversion tracking | Marketplace-to-direct signals are internal analytics only and do not automate marketplace outreach | Yes |
| Retainer alerts | Alerts remain manual-review opportunities and do not auto-send offers | Yes |
| Privacy | Analytics excludes secrets, tokens, raw webhook payloads, signed URLs, marketplace passwords, and private notes | Yes |
| Audit | Sensitive admin analytics views, exports, manual overrides, retainer actions, and conversion actions are audited | Yes |
| Rate limits | Sensitive analytics routes and event routes are rate-limited | Yes |
| Safe copy | No analytics, upsell, or report copy guarantees approval, ranking, sales, conversion, or ad performance | Yes |
| UI | `/admin`, `/admin/revenue`, `/admin/revenue/source-tracking`, `/admin/revenue/conversions`, `/admin/revenue/retainers` render in browser | Yes |
| Tests | Unit, security, integration, E2E, typecheck, lint, build, Prisma validate, migrations, and seed checks pass | Yes |
