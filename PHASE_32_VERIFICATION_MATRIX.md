# PHASE_32_VERIFICATION_MATRIX.md

| Area | Required verification |
|---|---|
| Prisma | Schema validates and migration applies cleanly |
| Reports | Metrics are server-derived and tenant-scoped |
| Client visibility | Client reports expose only approved data |
| Upsells | Opportunities are generated from server-side signals |
| Safety | No marketplace/sales/performance guarantees |
| Security | No secrets, tokens, signed URLs, private notes, or provider errors leave the server |
| Audit | Report and upsell mutations are audited |
| UI | Admin reports, report builder, report detail, upsells, opportunities, templates, and client reports render |
| Tests | Unit, security, integration, E2E, typecheck, lint, build, Prisma validate, migration, and seed checks run |
