# PHASE_32_IMPLEMENTATION_NOTES.md

## Phase

Phase 32 — Reports and Upsell Engine

## ChatGPT-coded additions

- Report/upsell domain constants and safety helpers
- Zod schemas for report and upsell requests
- Report builder, metric, export, safety services
- Upsell opportunity, template, engine, and safety services
- API route contracts for report and upsell flows
- Admin/client report and upsell UI shells
- Prisma scaffold for report metrics, report delivery events, upsell opportunities, templates, and events
- Unit, security, integration, and E2E test scaffolds

## Important limitations

All Phase 32 API routes are dry-run contracts. Codex must connect them to Prisma, storage, audit logs, RBAC, tenant isolation, and notification/export providers.
