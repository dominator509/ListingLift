# ListingLift Whole-Repo Codex Handoff v2

This package is a high-coverage repo seed for ListingLift. It contains code, schema drafts, routes, services, adapter contracts, UI shells, tests, docs, and phase task files.

## Strict instruction

Codex must stitch this into the real repo carefully. Do not assume this seed has been installed or executed. Run the checks in the target repo and fix environment-specific issues.

## What changed in v2

- Added auth/session scaffolds.
- Added authorization and tenant isolation services.
- Added broader API route scaffolds.
- Added upload and delivery token services.
- Added delivery visibility guard.
- Added manual fallback audit service.
- Added webhook signature helper.
- Added image processing batch service.
- Added ZIP delivery service.
- Added expanded sales-channel adapters.
- Added additional image provider scaffolds.
- Added client/job/revision/billing/report/integration services.
- Added missing client/admin/agency page shells.
- Added security, service, route, and adapter tests.

## Stitch order

1. Inspect the target repository.
2. Create a backup or branch.
3. Copy docs first.
4. Copy config files only after comparing existing config.
5. Copy Prisma schema and seed after checking database provider.
6. Copy source files.
7. Copy tests.
8. Install dependencies.
9. Run `npm run typecheck`.
10. Run `npm run lint`.
11. Run `npm run test`.
12. Run `npm run build`.
13. Update `ROADMAP_STATUS.md` with real results.

## Non-negotiables

- Do not skip roadmap phases.
- Do not expose secrets.
- Do not enable real integrations by default.
- Do not expose downloads before approval.
- Do not overwrite original uploads.
- Do not guarantee marketplace compliance or sales outcomes.
- Do not mark production-ready until auth, RBAC, tenant isolation, upload safety, delivery token safety, and webhook safety tests pass.

## Known limitation

This is a generated repo seed. Codex must install, typecheck, lint, test, and repair in the actual implementation environment.
