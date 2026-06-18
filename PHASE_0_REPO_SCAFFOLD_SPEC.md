# PHASE_0_REPO_SCAFFOLD_SPEC.md

## Purpose

This file defines the preferred Phase 0 repository shape for ListingLift. Codex may adapt paths to the detected framework, but must preserve the intent and document deviations.

---

## Preferred Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- Zod
- Prisma scaffold
- Vitest
- Playwright where practical
- ESLint
- Prettier
- Sharp or fallback image dependency note
- ZIP utility

---

## Preferred Root Structure

```txt
listinglift/
  app/
    page.tsx
    api/
      health/
        route.ts
  components/
    ui/
  lib/
    env.ts
    health.ts
  tests/
    unit/
      env.test.ts
      health.test.ts
    smoke/
      landing.test.ts
  prisma/
    schema.prisma
  public/
  docs/
  .env.example
  .gitignore
  package.json
  tsconfig.json
  next.config.js or next.config.mjs
  tailwind.config.ts
  postcss.config.js
  vitest.config.ts
  playwright.config.ts
  README.md
  ARCHITECTURE.md
  BUILD_ROADMAP.md
  ROADMAP_STATUS.md
  AGENTS.md
  SECURITY.md
  ENVIRONMENT.md
  DEPLOYMENT.md
  TESTING.md
  API.md
  USER_GUIDE.md
  ADMIN_GUIDE.md
  CHANGELOG.md
```

---

## Minimum Health Route Contract

Endpoint:

```txt
GET /api/health
```

Safe response:

```json
{
  "ok": true,
  "service": "listinglift",
  "environment": "development",
  "version": "0.0.0",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

Rules:

- Do not expose secrets.
- Do not expose full environment config.
- Do not perform paid provider calls.
- Do not require database connectivity in Phase 0 unless the framework requires it.

---

## Minimum Env Validator Contract

Recommended module:

```txt
lib/env.ts
```

Required behavior:

- Parse `process.env` through Zod.
- Provide a safe server-only config object.
- Permit local development using placeholders.
- Reject weak/missing production secrets.
- Keep real integrations disabled unless explicit env flags are enabled.

Required production-sensitive keys:

- `DATABASE_URL`
- `APP_URL`
- `SESSION_SECRET`
- `ENCRYPTION_KEY`
- `UPLOAD_TOKEN_SECRET`
- `DELIVERY_TOKEN_SECRET`

Required default safety flags:

```txt
MOCK_IMAGE_PROVIDER_ENABLED=true
REAL_IMAGE_PROVIDER_CALLS_ENABLED=false
MOCK_INTEGRATIONS_ENABLED=true
REAL_INTEGRATIONS_ENABLED=false
RATE_LIMIT_ENABLED=true
```

---

## Minimum Landing Page Contract

The landing page can be simple in Phase 0 but must clearly identify the product.

Suggested content:

```txt
ListingLift
Product photo cleanup and marketplace image pack fulfillment.
Upload messy product photos. ListingLift prepares organized, platform-ready draft image packs for seller review.
```

Must avoid:

- Marketplace compliance guarantees.
- Sales guarantees.
- Ranking guarantees.
- Conversion guarantees.

---

## Minimum package.json Script Behavior

Required scripts should exist even if some are temporary no-op placeholders in Phase 0.

Recommended handling:

- `typecheck` must run TypeScript checks.
- `lint` must run linter.
- `format` may check or write formatting depending repo convention.
- `test` must run available tests.
- `build` must produce a production build.
- `smoke` must run a minimal route/page check where practical.
- `verify-env` must run env validation.
- `security-check` must run a minimal local secret/config check where practical.

Placeholders must clearly say the area is not implemented yet and must not mask real failures for implemented Phase 0 code.

---

## Phase 0 Prisma Boundary

Allowed:

- Install Prisma.
- Add `prisma/schema.prisma` placeholder.
- Add database provider placeholder aligned with `DATABASE_URL`.
- Add migration/seed scripts that clearly report not implemented until Phase 2.

Forbidden:

- Do not implement the full ListingLift business schema in Phase 0.
- Do not seed packages, presets, users, jobs, or demo records in Phase 0.
- Do not add auth tables in Phase 0.

The database schema belongs to **Phase 2 — Database Schema and Migrations**.

---

## Phase 0 Output Discipline

Codex must not leave generated starter copy that conflicts with ListingLift positioning. Any framework default landing text should be replaced with ListingLift-safe placeholder copy.
