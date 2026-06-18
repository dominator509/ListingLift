# PHASE_35_IMPLEMENTATION_NOTES.md

## Phase

Phase 35 — Agency White-Label Mode

## What ChatGPT Project Mode Coded

- Agency white-label domain constants, status normalization, queue summaries, workspace summaries, volume pricing quote logic, brand preview logic, and unsafe-guarantee detection.
- Zod schemas for agency dashboard requests, workspace drafts, branding drafts, branded delivery previews, branded reports, team invites, bulk queue plans, volume pricing quotes, and agency events.
- Services for agency access gates, dashboard summaries, workspace rows, bulk queue rows/plans, branding previews, branded delivery drafts, branded report drafts, volume pricing quotes, team rows/invite drafts, and event drafts.
- Agency UI shells for dashboard, workspaces, queue, white-label settings, branded delivery, branded reports, billing, volume pricing, team, and guardrails.
- API route contracts under `/api/agency/*`.
- Prisma schema and migration scaffolds for agency workspace settings, branding reviews, branded delivery/report templates, bulk queue batches/items, volume pricing quotes, team invites, and agency events.
- Unit/security/integration/E2E test scaffolds.
- Phase 35 docs, v37 handoff, v37 gap file, v37 review index, v37 manifest, and v37 Codex prompt.

## Important Security Rules

- Server-side agency RBAC and tenant isolation are required; UI hiding is not sufficient.
- Agency admins must be agency-scoped and must have explicit permissions for branding, team, billing, jobs, and workspaces.
- Team invites must use expiring hashed tokens; raw invite tokens must not be stored.
- White-label settings remain drafts until manual approval.
- Custom domains, logos, support identity, and branded footer copy require review before client-facing use.
- Branded delivery must still require approved outputs, approved archives, expiring hashed delivery tokens, download limits, QC gates, and admin approval.
- Branded reports must exclude secrets, raw provider data, raw webhook payloads, private notes, signed URLs, tokens, marketplace credentials, unapproved outputs, and provider errors.
- Bulk processing must create new output objects only and never overwrite original uploads.
- Volume pricing must not charge or invoice until Codex verifies subscriptions, invoices, credits, payment records, and admin approval.
- Do not guarantee marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad performance.

## Deliberately Not Completed Here

- No dependency installation.
- No Prisma validation.
- No migration generation/application.
- No Prisma client generation.
- No seeding.
- No typecheck, lint, build, Vitest, Playwright, or smoke checks.
- No browser rendering verification.
- No real payment, storage, email, DNS/domain, image provider, or marketplace integrations.

## ChatGPT Static Sanity Checks

- Checked 47 new Phase 35 TS/TSX files for missing `@/` alias import targets; 0 missing targets detected.
- Scanned new Phase 35 code/test files for common hardcoded secret patterns; 0 suspicious hits detected.
- These are text/static sanity checks only, not substitutes for `npm install`, typecheck, lint, tests, build, Prisma, browser, or security runtime verification.
