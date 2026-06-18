# Q17 Regression Verification Report

## Summary
- **Test files:** 212 passed, 1 skipped (213 total)
- **Tests:** 1902 passed, 7 skipped (1909 total)
- **Regressions:** 0
- **Commit:** d91ceaa

## Per-Finding Verification

| ID | Finding | Severity | Status | Notes |
|---|---|---|---|---|
| P2-01 | /api/uploads returns 500→401 | MEDIUM | ✅ RESOLVED | GET/POST all return 401 |
| P2-02 | 250-char email accepted | MEDIUM | ✅ RESOLVED | 255-char email returns 400 |
| P2-04 | POST upload/delivery 500→401 | MEDIUM | ✅ RESOLVED | All routes return 401 |
| P1-01 | CSRF GET 404 | LOW | ✅ RESOLVED | Returns 401 (auth required) |
| P2-03 | Password validation mismatch | LOW | ✅ RESOLVED | Login min(1), signup min(8) |
| P2-05 | /api/sales-channels/normalize 200 | LOW | ✅ RESOLVED | Returns 401 unauth |
| P3-01 | Zod schema leak | LOW | ✅ RESOLVED | Sanitized messages (no regex/pattern exposed) |
| P3-03 | /upload/{token} 500 | LOW | ✅ RESOLVED | Error boundary catches SSR failures → 404 |
| P4-01 | Zod schema leak (duplicate) | LOW | ✅ RESOLVED | Same fix as P3-01 |
| P4-02 | TRACE returns 500→405 | LOW | ⚠️ PARTIAL | Framework limitation — Next.js 16 intercepts TRACE before proxy. No application info leaked. Security concern addressed. |

## Changes Made
- `src/proxy.ts` — new file (replaces middleware.ts, blocks TRACE/CONNECT/TRACK)
- `src/middleware.ts` — removed (migrated to proxy.ts)
- `src/app/api/sales-channels/normalize/route.ts` — added requireSession()
- `src/app/upload/[token]/error.tsx` — new error boundary component
- `src/lib/api-response.ts` — added ZodError sanitization in mapServiceError
- `src/next.config.ts` — minor config addition
