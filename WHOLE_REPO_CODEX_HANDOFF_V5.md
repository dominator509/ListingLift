# WHOLE_REPO_CODEX_HANDOFF_V5.md

## Current Objective

Stitch and validate ListingLift Repo Seed v5 in the real repository, with the latest ChatGPT-coded advancement through Phase 3 — Authentication and Sessions.

## Source Review Completed in ChatGPT

ChatGPT unzipped `ListingLift_Repo_Seed_v4.zip` and reviewed all Markdown files in the package before advancing. The review included canonical architecture, build roadmap, source docs, runbooks, handoffs, task files, prompts, security docs, API docs, testing docs, and gap/status files.

## What Changed in v5

Phase 3 auth/session artifacts were added:

- `Session` model in Prisma schema with hashed session-token storage.
- User/org session relations.
- Demo super-admin seed password hash.
- Password hashing/verification helpers using bcrypt.
- Email normalization and password policy helper.
- HTTP-only session cookie helper.
- In-memory login rate-limit helper.
- Auth service for signup, login, logout, and request-session resolution.
- Account settings service.
- API routes for signup, login, logout, current session, and account update.
- Dashboard route middleware for `/admin`, `/client`, and `/agency`.
- Updated login/signup pages from disabled placeholders into basic Phase 3 form shells.
- Auth contract tests.
- Updated `ROADMAP_STATUS.md`, `CODEX_GAPS.md`, Phase 3 runbook, and verification matrix.

## Critical Rule

Do not mark Phase 3 complete until the real repository validates Prisma, applies migrations, runs seed, compiles, builds, and passes required tests.

## Stitch Order

1. Inspect the existing repository.
2. Back up or diff any existing files before overwriting.
3. Copy v5 seed files into the repo.
4. Install dependencies.
5. Validate Prisma schema.
6. Generate Prisma client.
7. Generate/apply migration, especially for the new `Session` model.
8. Run seed twice.
9. Run auth tests and global checks.
10. Fix failures.
11. Update `ROADMAP_STATUS.md` with actual command outputs.
12. Stop at a clean checkpoint.

## Required Commands

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
npm run test:unit -- auth
npm run test:security -- auth
npm run test:integration -- auth
npm run typecheck
npm run lint
npm run build
```

Run E2E auth smoke if available:

```bash
npm run test:e2e -- auth
```

## Highest-Risk Files

Review carefully:

- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/server/auth/auth-service.ts`
- `src/server/auth/session-cookie.ts`
- `src/server/auth/route-utils.ts`
- `src/server/services/auth-session-service.ts`
- `src/middleware.ts`
- `src/app/api/auth/*/route.ts`
- `src/app/api/account/route.ts`
- `tests/security/auth-session-cookie.test.ts`
- `tests/integration/auth-route-contract.test.ts`

## Must Verify

- Signup creates user, organization, and owner membership.
- Login creates server-side session and sets HTTP-only cookie.
- Logout revokes session and clears cookie.
- Session cookie is Secure in production.
- Password hashes are never returned or logged.
- Session tokens are stored as hashes only.
- Login rate limiting works.
- Protected dashboards redirect without session.
- Middleware remains Edge-runtime safe.
- Demo headers are not accepted unexpectedly in production.

## Known Gaps

See `CODEX_GAPS.md`. The largest gaps are dependency install, Prisma validation/migration, real runtime auth checks, browser E2E flow, and replacing in-memory rate limiting before multi-instance production.

## Stop Conditions

Stop and update `ROADMAP_STATUS.md` if:

- Prisma validate/migration fails.
- Typecheck fails.
- Auth route tests fail.
- Password hashes or tokens are exposed.
- Protected dashboards are reachable without session.
- Middleware imports Node-only modules into the Edge runtime.

## Commit-Style Entry

If git is available:

```bash
git add .
git commit -m "phase-3: authentication and sessions seed"
```

If git is unavailable, add the same entry to `ROADMAP_STATUS.md` under Commit-Style History.
