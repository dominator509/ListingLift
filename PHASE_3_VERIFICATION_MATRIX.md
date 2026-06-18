# PHASE_3_VERIFICATION_MATRIX.md

## ChatGPT-Coded Checks

- Static route contract checks for signup/login/logout/me/account routes.
- Session cookie serialization security tests.
- Password policy, normalization, and redaction tests.
- In-memory auth rate-limit tests.
- Prisma schema contract includes `Session` and hashed token storage.

## Codex-Only Checks

- Dependency installation.
- Prisma schema validation and client generation.
- Migration generation/application with Session model.
- Seed execution with hashed demo password.
- Real signup/login/logout flow against DB.
- Middleware protected-route behavior in Next runtime.
- HTTP-only cookie behavior in runtime.
- Production secure-cookie behavior.
- Typecheck/lint/build.
- Browser E2E auth smoke tests.

## Blocker Conditions

Do not mark Phase 3 complete if:

- Password hashes are returned by any API.
- Session cookies are readable by client JavaScript.
- Protected dashboards can be reached without session/demo headers.
- Login rate limiting is absent or bypassable in the intended deployment mode.
- Session tokens are stored plaintext.
- Auth audit logs contain passwords, raw tokens, cookies, or secrets.
- Prisma validation/migration fails.
