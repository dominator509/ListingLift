# Security Hardening — Phase 37

## Purpose

Phase 37 turns ListingLift's security guardrails into implementation scaffolds. It does not make the repo production-ready by itself. Codex must install, migrate, wire persistence, run tests, and verify runtime/browser behavior.

## Security scope

The phase covers:

- encrypted secret references,
- upload type and size validation,
- executable/script/HTML/SVG rejection,
- ZIP slip prevention,
- nested archive rejection,
- hashed expiring token lifecycle,
- sensitive route rate limits,
- security headers,
- CSRF protection,
- XSS/output safety,
- CSV formula injection neutralization,
- webhook signature verification decisions,
- audit completeness mapping,
- server-side RBAC and tenant isolation.

## Admin surfaces

- `/admin/security`
- `/admin/security/upload-safety`
- `/admin/security/secrets`
- `/admin/security/rate-limits`
- `/admin/security/webhooks`
- `/admin/security/audit-map`

## Admin API route contracts

- `GET /api/admin/security/dashboard`
- `POST /api/admin/security/upload-guard`
- `POST /api/admin/security/secrets`
- `GET /api/admin/security/rate-limits`
- `POST /api/admin/security/rate-limits`
- `POST /api/admin/security/csrf`
- `POST /api/admin/security/webhooks`
- `GET /api/admin/security/audit-map`
- `GET /api/admin/security/headers`

All routes are scaffolded behind `manage:security`. Codex must wire production session resolution, role checks, tenant scope, rate limits, CSRF where applicable, persistence, and audit logs.

## Data model scaffolds

Phase 37 adds Prisma scaffolds for:

- `SecuritySecretReference`
- `SecurityRateLimitRule`
- `SecurityAuditCoverageItem`
- `SecurityCsrfToken`
- `SecurityHardeningEvent`

Codex may decide to merge some security events into the existing audit log model, but must document that decision and preserve the coverage guarantees.

## Secret storage rules

Provider secrets must never be stored as raw values. This includes:

- Stripe keys and webhook secrets,
- Gumroad webhook secrets,
- image provider keys,
- storage OAuth tokens,
- Slack/email/task tool tokens,
- SMTP credentials,
- automation webhook secrets,
- API/webhook signing secrets,
- marketplace OAuth tokens.

The scaffold uses `enc_ref_*` placeholders. These are not encryption. Codex must replace them with KMS, envelope encryption, or a vetted secret manager.

## Upload and ZIP rules

Every upload surface must enforce:

- MIME allowlists,
- extension allowlists,
- size limits,
- image parseability,
- tenant/client/job/workspace scope,
- package image allowance,
- token expiry and scope,
- original preservation,
- unsafe filename rejection.

ZIP handling must reject:

- absolute paths,
- Windows drive-letter paths,
- `../` traversal,
- nested archives,
- executable/script-like entries,
- excessive nesting,
- excessive entry count,
- unsupported files.

## Token lifecycle rules

Upload, delivery, API, invite, shared portal, CSRF if persisted, and webhook signing tokens must be:

- unguessable,
- scoped,
- hashed at rest,
- expiring,
- revocable,
- max-use/download limited where appropriate,
- audited,
- never logged raw.

## Rate-limit rules

Sensitive routes requiring enforcement include:

- login,
- checkout creation,
- upload session creation,
- upload batch submission,
- webhook receiving,
- processing start,
- delivery download,
- API requests,
- API token creation,
- API token revocation,
- shared portal uploads,
- admin manual overrides.

The scaffold includes in-memory evaluation only. Production needs a distributed limiter when multiple instances can run.

## Security headers

Scaffolded headers include:

- `Content-Security-Policy`,
- `X-Content-Type-Options`,
- `Referrer-Policy`,
- `X-Frame-Options`,
- `Permissions-Policy`,
- `Cross-Origin-Opener-Policy`,
- `Cross-Origin-Resource-Policy`,
- production `Strict-Transport-Security`.

Codex must verify actual response headers in browser/deployment context and tune CSP for legitimate providers without weakening the app unnecessarily.

## CSRF and XSS/output safety

State-changing browser requests must require CSRF protection unless explicitly documented as bearer-token API or provider webhook exceptions.

Rendered output and exports must:

- escape user/provider content,
- sanitize unsafe markup,
- neutralize CSV formulas,
- avoid unsafe HTML rendering,
- reject unsafe guarantee copy.

## Webhook verification

Webhook events must not create paid or client-facing state unless signature, freshness, idempotency, tenant scope, provider status, feature flag, and event type are verified.

Unsigned, stale, duplicate, unsupported, mismatched, disabled-provider, or malformed events must stay manual-review only.

## Audit completeness

The audit map must cover sensitive actions across:

- secret changes,
- upload/ZIP rejection,
- token issue/revoke/rotate,
- rate-limit blocks,
- webhook rejection,
- RBAC denial,
- delivery download attempts,
- manual override,
- paid state changes,
- client-facing delivery,
- agency white-label actions,
- API access actions,
- storage imports/exports,
- reports and upsells.

Audit metadata must never include raw secrets, raw tokens, token hashes, signed URLs, authorization headers, cookies, marketplace credentials, raw webhook payloads, raw file bytes, or unredacted private notes.

## Production readiness statement

Phase 37 is not production-ready until Codex completes all runtime/database/install/test/browser/security verification in `CODEX_GAPS.md` and `PHASE_37_VERIFICATION_MATRIX.md`.
