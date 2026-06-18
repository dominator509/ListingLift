# PHASE_3_EXECUTION_RUNBOOK.md

## Purpose

Guide Codex through validating and completing the Phase 3 authentication/session seed.

## Required Pre-Change Statement

Before editing, Codex must state:

1. Current phase: Phase 3 — Authentication and Sessions.
2. Current task: validate and complete ChatGPT-seeded auth/session implementation.
3. Acceptance criteria targeted.
4. Files expected to change.
5. Commands that will be run.

## Phase Boundary

Allowed:

- Signup, login, logout.
- Session persistence and revocation.
- HTTP-only session cookie.
- Protected admin/client/agency routes.
- Account settings for name/password changes.
- Password hashing and verification.
- Rate limiting for login.
- Auth audit logging.
- Auth tests.

Forbidden until later phases unless required to fix auth:

- Full RBAC expansion beyond existing permission checks.
- Billing/checkout implementation.
- Upload processing implementation.
- Image provider calls.
- Sales-channel imports.
- Production email flows.
- OAuth/SSO/MFA unless explicitly approved.

## Required Verification Sequence

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
```

Add or run E2E auth smoke checks if the runtime supports it:

```bash
npm run test:e2e -- auth
```

## Required Acceptance Criteria

- User can sign up.
- Signup creates user, organization, and owner membership.
- User can log in with normalized email and valid password.
- Invalid login fails without revealing which field was wrong.
- Login attempts are rate-limited.
- User can log out and session is revoked/cleared.
- Protected admin/client/agency route groups require a session.
- Session cookie is HTTP-only and secure in production.
- Password hash is never returned from auth APIs.
- Auth events are audited without leaking secrets.
- Demo seed password is hashed, not plaintext.

## Required Status Update

After validation or repair, Codex must update `ROADMAP_STATUS.md` with command output summary, files changed, failures, fixes, and whether Phase 3 is complete or blocked.
