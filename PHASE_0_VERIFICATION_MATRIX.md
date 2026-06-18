# PHASE_0_VERIFICATION_MATRIX.md

## Purpose

This matrix defines the checks Codex should run after Phase 0 implementation and how to report them honestly.

---

## Required Checks

| Check | Command | Required Result | Failure Handling |
|---|---|---|---|
| TypeScript | `npm run typecheck` | Pass | Fix TypeScript errors before completing Phase 0. |
| Lint | `npm run lint` | Pass or documented unavailable | Fix lint errors or document missing tool setup. |
| Unit tests | `npm run test` | Pass | Fix failing Phase 0 tests. |
| Build | `npm run build` | Pass | Fix build failure before completing Phase 0. |
| Smoke | `npm run smoke` | Pass or documented unavailable | Add minimal smoke check where practical. |
| Env verification | `npm run verify-env` | Pass in dev/test mode | Fix unsafe env parsing or document blocker. |
| Security check | `npm run security-check` | Pass minimal secret/config check | Fix leaks or document blocker. |

---

## Minimum Test Coverage

### Environment Validation

Must test:

- Dev/test mode accepts safe placeholders.
- Production mode rejects missing required secrets.
- Integration flags default to mock mode.

### Health Endpoint

Must test:

- Response includes `ok`, `service`, `environment`, `version`, and `timestamp`.
- Response does not include keys containing `SECRET`, `KEY`, `TOKEN`, `PASSWORD`, `DATABASE_URL`, or provider credentials.

### Landing Smoke

Must test or manually verify:

- Landing page renders ListingLift name.
- Landing copy avoids prohibited claims.

---

## Prohibited False Positives

Codex must not report checks as passing when:

- The command was not run.
- The command was skipped.
- The command failed but was ignored.
- A placeholder script always exits 0 while pretending to test implemented code.

Acceptable reporting examples:

```md
npm run test — Passed. 3 tests passed.
```

```md
npm run test:e2e — Not run. E2E is scaffolded but no browser install is available in this environment. Documented as Phase 0 limitation.
```

Unacceptable reporting example:

```md
All tests pass.
```

without command-level evidence.

---

## Phase 0 Completion Gate

Phase 0 cannot be marked complete if any of these fail:

- App cannot build.
- Typecheck fails.
- Health endpoint leaks secrets.
- `.env.example` includes real secrets.
- `ROADMAP_STATUS.md` is not updated.
- Product features from Phase 1+ were implemented early.

---

## Recommended `ROADMAP_STATUS.md` Test Results Format

```md
## Tests/Checks Run

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run smoke`
- `npm run verify-env`
- `npm run security-check`

## Test Results

- `npm run typecheck` — Passed.
- `npm run lint` — Passed.
- `npm run test` — Passed. [N] tests passed.
- `npm run build` — Passed.
- `npm run smoke` — Passed.
- `npm run verify-env` — Passed.
- `npm run security-check` — Passed.

## Known Issues

- None.

## Deviations

- None.
```
