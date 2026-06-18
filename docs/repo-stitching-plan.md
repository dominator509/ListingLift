# Repo Stitching Plan

## Objective

Move the generated ListingLift repo seed into the actual Codex-controlled repository without losing roadmap discipline or security constraints.

## Copy order

1. Governance docs.
2. Environment docs and `.env.example`.
3. Package and TypeScript configs.
4. Prisma schema and seed.
5. Domain constants and schemas.
6. Server services and adapters.
7. API routes.
8. UI components and page shells.
9. Tests.
10. Scripts and prompts.

## Review gates

- Config merge review.
- Prisma validation.
- TypeScript import path review.
- Route handler compile review.
- RBAC permission key review.
- Tenant scope review.
- Delivery approval gate review.
- Upload safety review.
- Webhook signature review.

## Stop conditions

Codex must stop and document before continuing if any of these fail:

- Auth tests.
- RBAC tests.
- Tenant isolation tests.
- Upload validation tests.
- ZIP slip tests.
- Delivery visibility/token tests.
- Webhook verification tests.
- Prisma validation.
- Build.
