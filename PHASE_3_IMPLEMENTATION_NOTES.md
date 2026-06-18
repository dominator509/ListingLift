# PHASE_3_IMPLEMENTATION_NOTES.md

## Current Objective

Seed Phase 3 — Authentication and Sessions — with as much coded material as possible inside ChatGPT Project Mode after unzipping v4 and reviewing all Markdown files.

## Source Review

Reviewed the unzipped v4 Markdown set, including canonical architecture, roadmap, previous handoffs, Phase 0–2 runbooks, task files, source documents, security docs, and gap records.

Phase 3 roadmap requirement: signup, login, logout, session handling, protected routes, password hashing, account settings, auth tests, rate-limited login, HTTP-only session cookie, no returned password hash, and audited auth events.

## What Was Coded

- Added `Session` model to `prisma/schema.prisma` with hashed token storage, active/revoked state, expiry, IP/user-agent metadata, user/org relations, and indexes.
- Added password helpers with bcrypt hashing, password policy, email normalization, password verification, and password-hash redaction.
- Added session-cookie helpers for opaque token creation, hashed token persistence, HTTP-only cookies, clear-cookie behavior, and cookie parsing.
- Added in-memory login rate-limit helper for baseline Phase 3 security tests.
- Added auth service with signup, login, logout, and request-session resolution.
- Updated auth-session service to resolve real cookie-backed sessions first and accept demo headers only when explicitly provided.
- Added account settings service for name/password updates with current-password verification.
- Added API routes for signup, login, logout, current session, and account updates.
- Added middleware to guard `/admin`, `/client`, and `/agency` paths from unauthenticated access.
- Updated login/signup pages from disabled Phase 1 placeholders into basic Phase 3 form shells.
- Updated seed script so the demo super-admin has a hashed demo password.
- Added Phase 3 tests for password contracts, session cookie security, rate limiting, auth route contracts, and Prisma session model contract.

## What Is Deliberately Not Completed Here

- Runtime Prisma client generation.
- Database migration validation.
- Real `npm install` dependency resolution.
- Real browser flow testing.
- Production-grade distributed rate limiting.
- CSRF strategy verification for credential routes.
- Full transactional signup flow verification.
- Password reset, email verification, OAuth, magic links, MFA, or SSO.
- Server action/client UX hardening beyond basic forms.

## Codex Must Verify

Codex must install dependencies and run:

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run test:unit -- auth
npm run test:security -- auth
npm run test:integration -- auth
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- auth
```

Codex must fix any Prisma relation, Next middleware, cookie, Edge-runtime, import, or route-handler issues before marking Phase 3 complete.

## Phase Completion Rule

Phase 3 is seeded but not complete. It can only be marked complete after Codex verifies signup, login, logout, protected routes, HTTP-only session cookies, password redaction, login rate limiting, and auth event audit behavior in the actual repository runtime.
