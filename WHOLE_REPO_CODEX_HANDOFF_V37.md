# WHOLE_REPO_CODEX_HANDOFF_V37.md

## Current Seed

ListingLift Repo Seed v37 advances the project through Phase 35 — Agency White-Label Mode.

## Source Reviewed

- Unzipped `ListingLift_Repo_Seed_v36.zip`.
- Reviewed every Markdown file in the unzipped repo seed.
- Reviewed `ListingLift.md`.
- Reviewed `ListingLift_BUILD_ROADMAP.md`.
- Confirmed status from `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, `WHOLE_REPO_CODEX_HANDOFF_V36.md`, and `REPO_FILE_MANIFEST_V36.md`.

## Confirmed Roadmap Position

- Latest completed seeded phase before this package: Phase 34 — Admin Dashboard and Revenue Analytics.
- Current seeded phase in this package: Phase 35 — Agency White-Label Mode.
- Next planned phase: Phase 36 — API Access and Advanced Integrations Scaffold.
- Prior phases remain repo-seed scaffolds until Codex performs install, Prisma validation, migrations, seeds, typecheck, lint, tests, build, browser rendering, and runtime/security verification.

## New Phase 35 Scope

This seed adds agency white-label domain rules, schemas, services, route contracts, UI shells, Prisma/migration scaffolds, tests, docs, and Codex handoff/gap files.

Phase 35 covers:

- Agency dashboard.
- Client workspaces.
- White-label settings.
- Branded delivery page previews.
- Branded reports.
- Agency billing.
- Team members and invites.
- Bulk processing queue.
- Volume pricing scaffold.

## Codex Required Behavior

1. Stitch the v37 seed into the real repository.
2. Validate all schema and route imports.
3. Repair any scaffold-specific compile issues.
4. Regenerate migration SQL from Prisma.
5. Generate Prisma client.
6. Apply migrations.
7. Run all checks listed in `PHASE_35_VERIFICATION_MATRIX.md`.
8. Replace dry-run agency data with tenant-scoped Prisma queries and verified workspace, queue, report, delivery, billing, team, and brand records.
9. Enforce agency RBAC, tenant isolation, client workspace isolation, rate limits, and audit logging.
10. Update `ROADMAP_STATUS.md` with real results.
11. Do not mark Phase 35 complete until agency access, branded delivery gates, branded report privacy, team invite security, billing verification, queue original-preservation rules, safe-copy checks, and browser rendering pass.

## Do Not Drift

Agency white-label mode is not a generic portal or static agency landing page. It must support high-ticket white-label fulfillment through multi-client workspaces, branded delivery, branded reports, bulk queues, volume pricing, team access, manual approval, security hardening, and no-guarantee marketplace-safe copy.

## Runtime Honesty

ChatGPT Project Mode did not install dependencies, validate Prisma, generate Prisma client, apply migrations, run seeds, typecheck, lint, build, run tests, smoke-test routes, verify browser rendering, or call real providers.
