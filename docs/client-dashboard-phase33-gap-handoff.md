# Phase 33 Gap Handoff — Client Dashboard

## Codex-Only Gaps

- Install dependencies.
- Validate Prisma schema.
- Regenerate Phase 33 migration.
- Apply migrations.
- Generate Prisma client.
- Run seed twice.
- Wire API routes to real authenticated session context.
- Replace demo dashboard data with Prisma queries.
- Enforce organization/client scoping on every query.
- Implement upload-token creation/resolution for client upload actions.
- Implement signed/proxied preview and download URLs safely.
- Persist dashboard events and revision requests.
- Add rate limits for dashboard events, upload plan, revision request, and download routes.
- Add audit logs for sensitive client dashboard actions.
- Run unit, security, integration, E2E, typecheck, lint, build, Prisma validate, migration, and seed checks.

## Do Not Ship Until

- Cross-client job access test passes.
- Preview visibility test passes.
- Delivery token gate test passes.
- Revision output-scope test passes.
- Billing values are derived server-side.
