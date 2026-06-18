# SECURITY.md — ListingLift Security Requirements

## Security Position

ListingLift handles client images, order data, paid fulfillment records, delivery links, integrations, and potential third-party credentials. Security controls are core product requirements, not polish.

## Non-Negotiable Rules

- Never hardcode secrets.
- Never commit real `.env` files.
- Never log secrets, API keys, OAuth tokens, webhook secrets, SMTP credentials, or payment secrets.
- Never store marketplace passwords.
- Never expose provider, payment, or integration secrets to the frontend.
- Store sensitive credentials encrypted.
- Use secure environment variables.
- Use server-side authorization, RBAC, and tenant isolation.
- Validate all input with shared schemas.
- Audit sensitive mutations.
- Preserve original uploads.
- Never overwrite original uploads.
- Use expiring upload and delivery tokens.
- Store hashed token values where practical.
- Hide final downloads until admin approval.

## Upload Security

Allowed uploads must be explicitly validated by:

- MIME type.
- Extension.
- Size.
- Image parseability where practical.
- ZIP safety when ZIPs are accepted.
- Tenant/job ownership.

Reject:

- Executables.
- Scripts.
- HTML files.
- Unsafe archives.
- ZIP entries with absolute paths.
- ZIP entries using `../` path traversal.
- Oversized files.
- Unsupported file types.

## ZIP Security

ZIP handling must prevent ZIP slip by normalizing paths and rejecting entries that escape the intended extraction directory.

Delivery ZIPs must be generated from approved processed files and safe folder/preset definitions only.

## Token Security

Upload and delivery links must:

- Expire.
- Be scoped to a specific job/client/org.
- Be unguessable.
- Be stored hashed where practical.
- Be invalidated when appropriate.
- Be permission-checked server-side.

## Webhook Security

- Verify Stripe signatures.
- Verify Gumroad signatures where supported.
- Store raw webhook events.
- Deduplicate webhook events.
- Normalize errors.
- Avoid logging secrets or full payment payloads unnecessarily.
- Keep webhooks idempotent.

## SSRF Protection

Any future remote file import must:

- Block localhost and private IP ranges.
- Follow strict allowlists where practical.
- Use timeouts.
- Limit redirects.
- Limit size.
- Never fetch arbitrary URLs from privileged infrastructure without validation.

## CSV Formula Injection

Any CSV export must neutralize cells beginning with:

- `=`
- `+`
- `-`
- `@`
- tab
- carriage return

## RBAC and Tenant Isolation

UI hiding is not enough. Every protected route/service must verify:

- Authenticated user.
- Active organization membership.
- Permission for action.
- Tenant-scoped query.
- Object ownership/scope.

Required tests:

- Tenant A cannot read Tenant B jobs.
- Client viewer cannot approve delivery.
- Billing manager cannot alter presets unless permitted.
- Role escalation is rejected.
- Permission changes are audited.

## Production Security Checklist

- [ ] Environment validation enabled.
- [ ] Production requires strong secrets.
- [ ] Mock behavior disabled or explicitly feature-flagged.
- [ ] Upload security tests pass.
- [ ] Delivery token tests pass.
- [ ] RBAC tests pass.
- [ ] Tenant isolation tests pass.
- [ ] Webhook verification tests pass.
- [ ] ZIP slip tests pass.
- [ ] CSV injection tests pass.
- [ ] No real secrets committed.

## Known Security Limitations Before Implementation

- Exact auth/session mechanism is not selected until implementation.
- Exact encryption library/storage method must be selected during implementation.
- Real integration token storage must remain scaffolded or feature-flagged until audited.


## Phase 3 Auth/Session Seed Notes

- Session tokens are opaque and must be stored only as hashes in the database.
- Session cookies must be HTTP-only, SameSite=Lax, path-scoped to `/`, and `Secure` in production.
- Login must normalize email before lookup and must use a generic invalid-credentials error.
- Password hashes must never be returned by API responses or logged.
- ChatGPT seeded an in-memory rate limiter for baseline protection; Codex must replace or back it with a deployment-appropriate distributed limiter before production if multiple instances are used.
- Protected dashboard routes are guarded at middleware level and must also remain protected server-side as RBAC/tenant logic expands.

## Phase 17 Stripe Security Rules

- Never expose Stripe secret keys or webhook secrets to client code.
- Verify Stripe webhook signatures from raw request body content.
- Dedupe webhook events by Stripe event ID.
- Do not grant access for failed, expired, duplicate, unsupported, pending, or unverified payments.
- Do not trust client-submitted prices, credits, package entitlement, image allowance, or subscription status.
- Audit payment-state changes.

## Phase 37 Security Hardening Seed Notes

Phase 37 adds security-hardening scaffolds for:

- encrypted secret references,
- upload MIME/extension/size safety,
- ZIP slip and nested archive rejection,
- hashed expiring token lifecycle checks,
- sensitive-route rate-limit policies,
- baseline security headers,
- CSRF token draft helpers,
- XSS/output and CSV formula injection protection helpers,
- webhook verification decision contracts,
- audit completeness maps,
- server-side `manage:security` route protection.

These scaffolds are not production verification. Codex must wire runtime persistence, provider secret storage, distributed rate limits, CSRF enforcement, upload parseability checks, ZIP inspection before extraction, webhook raw-body signature verification, metadata redaction, RBAC, tenant isolation, browser header checks, and the full security test suite.

### Phase 37 non-negotiable Codex checks

- No raw provider secrets in source, logs, frontend props, API responses, reports, exports, audit metadata, or test snapshots.
- Uploads rejected before storage/processing if MIME, extension, size, parseability, token scope, tenant scope, ZIP safety, or package allowance fails.
- Original uploads preserved and never overwritten.
- Tokens stored only as hashes and enforced for expiry, scope, revocation, max-use/download, and approval gates.
- Sensitive routes rate-limited server-side.
- Security headers verified in actual browser/deployment context.
- State-changing browser routes protected by CSRF unless explicitly documented as bearer-token API or provider webhook exceptions.
- Webhooks verified by provider signature and idempotency before any paid/client-facing state change.
- Every sensitive action has sanitized audit coverage.
- No marketplace approval, ranking, sales, conversion, listing approval, product approval, or ad-performance guarantees.

---

## Phase 38 — QA evidence security

QA evidence must be treated as sensitive operational data.

Do not store or expose:

- raw secrets,
- API keys,
- provider keys,
- OAuth tokens,
- webhook secrets,
- raw API/upload/delivery/invite/portal tokens,
- signed URLs,
- marketplace credentials,
- marketplace passwords,
- raw webhook payloads,
- raw customer file bytes,
- private notes,
- unapproved delivery links.

QA status changes, evidence creation, evidence deletion, and manual QA overrides must be audited with redacted metadata.
