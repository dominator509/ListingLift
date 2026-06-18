# CODEX_WHOLE_REPO_STITCH_PROMPT_V39.md

You are Codex continuing ListingLift from `ListingLift_Repo_Seed_v39.zip`.

## Current phase

Phase 37 — Security Hardening

## Next planned phase

Phase 38 — Full Testing and QA

## First required actions

1. Unzip `ListingLift_Repo_Seed_v39.zip`.
2. Read:
   - `ROADMAP_STATUS.md`
   - `CODEX_GAPS.md`
   - `WHOLE_REPO_CODEX_HANDOFF_V39.md`
   - `PHASE_37_IMPLEMENTATION_NOTES.md`
   - `PHASE_37_EXECUTION_RUNBOOK.md`
   - `PHASE_37_VERIFICATION_MATRIX.md`
   - `docs/security-hardening.md`
   - `docs/security-hardening-phase37-gap-handoff.md`
   - `REPO_FILE_MANIFEST_V39.md`
   - `CHATGPT_MARKDOWN_REVIEW_INDEX_V39.md`
3. Install dependencies.
4. Validate Prisma.
5. Regenerate/repair Phase 37 migration SQL.
6. Generate Prisma client.
7. Apply migrations to a disposable database.
8. Run seed twice.
9. Run typecheck, lint, tests, security checks, build, smoke checks, and browser checks.

## Critical honesty rule

Do not claim anything passed unless you actually ran it. If any command cannot be run, document it in `CODEX_GAPS.md` with blocker details.

## Phase 37 implementation priorities

- Replace placeholder encrypted secret references with real KMS/envelope encryption or a vetted secret manager strategy.
- Wire upload and ZIP security checks to all intake surfaces before storage, extraction, or processing.
- Preserve original uploads and never overwrite originals.
- Enforce hashed, scoped, expiring, revocable tokens for upload, delivery, API access, agency invites, shared portals, CSRF if persisted, and webhook secrets where applicable.
- Replace in-memory rate-limit scaffolds with production-safe route enforcement.
- Verify and tune actual response security headers.
- Wire CSRF protection to state-changing browser routes.
- Wire XSS/output and CSV formula injection protections to reports, delivery notes, listing copy, templates, notifications, and exports.
- Verify provider webhooks from raw request bodies before paid/client-facing state changes.
- Complete audit coverage and metadata redaction for all sensitive actions.
- Enforce server-side RBAC and tenant isolation for all `/api/admin/security/*` routes and all related security records.

## Non-negotiable security rules

- Never hardcode secrets.
- Never log secrets.
- Never expose provider keys to frontend.
- Never store marketplace passwords.
- Store tokens only as hashes.
- Store provider credentials only as encrypted references or env/secret-manager values.
- Reject unsafe uploads.
- Prevent ZIP slip.
- Neutralize CSV formula injection.
- Escape/sanitize output.
- Verify webhooks where applicable.
- Rate-limit sensitive routes.
- Audit sensitive actions.
- Keep real integrations disabled by default.
- Preserve manual fallback.
- Preserve admin approval before final delivery.
- Never expose final downloads before approval.
- Never overwrite original uploads.
- Never guarantee marketplace approval, ranking, sales, conversion, ad performance, listing approval, product approval, or platform acceptance.

## Required verification commands

```bash
npm install
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:seed
npm run typecheck
npm run lint
npm run test:unit
npm run test:security
npm run test:integration
npm run test:e2e
npm run security-check
npm run build
npm run smoke
```

## Expected update files after Codex work

- `CODEX_GAPS.md`
- `ROADMAP_STATUS.md`
- `PHASE_37_VERIFICATION_MATRIX.md`
- `SECURITY.md`
- `API.md`
- `ADMIN_GUIDE.md`
- Any migration/runtime notes

## Stop conditions

Stop and document blockers if:

- Prisma validation fails and cannot be repaired safely.
- A secret can leak to frontend/API/logs/audit metadata.
- A token is stored raw.
- ZIP slip remains possible.
- Unsafe uploads can be accepted.
- Webhooks can mutate paid/client-facing state without verified signatures.
- RBAC or tenant isolation can be bypassed.
- Security headers cannot be verified.
- Tests cannot be run.
