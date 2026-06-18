# TESTING.md

## Required practical scripts

- `npm run verify-env`
- `npm run db:validate`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run test:unit`
- `npm run test:integration`
- `npm run test:adapter-contract`
- `npm run test:security`
- `npm run test:e2e`
- `npm run security-check`
- `npm run build`
- `npm run smoke`
- `npm run qa:matrix`
- `npm run test-all`

No automated test may require a paid API key.

## Phase 38 — Full Testing and QA

Phase 38 adds a formal QA command plan, coverage matrix, smoke target list, no-fake-results guard, and admin QA dashboard.

### Required Codex sequence

```bash
npm install
npm run verify-env
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
npm run test:adapter-contract
npm run test:e2e
npm run security-check
npm run build
npm run smoke
npm run qa:matrix
npm run test-all
```

### Evidence rule

A test, build, migration, seed, browser, smoke, provider, webhook, or deployment check can only be marked `PASS` when actual evidence exists. Evidence must be redacted and cannot include secrets, tokens, signed URLs, provider keys, raw webhook payloads, raw files, private notes, marketplace credentials, marketplace passwords, or unapproved delivery links.

### ChatGPT Project Mode limitation

This v40 seed did not run the above commands. Codex must run them and update `CODEX_GAPS.md` and `PHASE_38_VERIFICATION_MATRIX.md` with actual results.
