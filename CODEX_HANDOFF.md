# CODEX_HANDOFF.md

## 1. Project Summary

ListingLift is a service-first, software-powered SaaS for product photo cleanup, marketplace image packs, ecommerce visual optimization, and multi-platform service sales intake.

The application must help operators collect raw product photos, process and organize outputs, review quality, approve final deliveries, generate ZIP packages, deliver files, track sales source attribution, and trigger upsells.

## 2. Source Files Reviewed

- `ListingLift.md` — product architecture/source-of-truth.
- `ListingLift_BUILD_ROADMAP.md` — execution roadmap/source-of-truth.

## 3. Canonical Docs Created

Canonical root docs:

- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `AGENTS.md`
- `SECURITY.md`
- `ENVIRONMENT.md`
- `DEPLOYMENT.md`
- `TESTING.md`
- `API.md`
- `USER_GUIDE.md`
- `ADMIN_GUIDE.md`

Supporting docs are under `docs/`.

## 4. Architecture Summary

The app must include public sales pages, package/checkout entry points, upload and delivery flows, admin/client/agency dashboards, data-driven packages, platform presets, sales-channel normalization, image-processing adapters, quality control, approval, revision, delivery, billing, reports, upsells, and integration registries.

## 5. Roadmap Summary

Implementation must follow phases 0 through 40 in order:

- Phase 0 — Repository Initialization
- Phase 1 — Design System and UI Shell
- Phase 2 — Database Schema and Migrations
- Phase 3 — Authentication and Sessions
- Phase 4 — Tenant, Client, RBAC, and Agency Model
- Phase 5 — Packages and Pricing
- Phase 6 — Platform Preset System
- Phase 7 — Sales Channel Normalization Layer
- Phase 8 — Direct Upload and File Intake
- Phase 9 — Job Creation and Admin Queue
- Phase 10 — Image Processing Provider Layer
- Phase 11 — Core Image Processing Pipeline
- Phase 12 — Smart Naming, Folder Generation, Manifest, and ZIP
- Phase 13 — Preview Gallery and Before/After
- Phase 14 — Quality Control and Flagged Outputs
- Phase 15 — Manual Approval and Revision Workflow
- Phase 16 — Delivery and Email Notifications
- Phase 17 — Stripe Checkout and Billing
- Phase 18 — Gumroad Checkout/Webhook Intake
- Phase 19 — Credits, Subscriptions, and Manual Invoices
- Phase 20 — Fiverr Workflow
- Phase 21 — Upwork Workflow
- Phase 22 — Taskrabbit Workflow
- Phase 23 — Other Sales Channel Workflows
- Phase 24 — Etsy Workflow
- Phase 25 — Shopify Workflow
- Phase 26 — Social and Marketplace Workflows
- Phase 27 — Amazon, eBay, and WooCommerce Workflows
- Phase 28 — File Storage Integrations
- Phase 29 — Automation Webhooks
- Phase 30 — Slack, Email, Google Sheets, Airtable, Trello, ClickUp, Asana, and Notion
- Phase 31 — Advanced Image Processing and Local Workers
- Phase 32 — Reports and Upsell Engine
- Phase 33 — Client Dashboard
- Phase 34 — Admin Dashboard and Revenue Analytics
- Phase 35 — Agency White-Label Mode
- Phase 36 — API Access and Advanced Integrations Scaffold
- Phase 37 — Security Hardening
- Phase 38 — Full Testing and QA
- Phase 39 — Replit Production Deployment
- Phase 40 — Post-Launch Backlog

## 6. Current Roadmap Status

Current phase: **Phase 0 — Repository Initialization**.

No app implementation has been performed yet.

## 7. Required Tech Stack

Use a production-grade full-stack TypeScript stack unless the repository already strongly supports a compatible alternative:

- TypeScript.
- React/Next.js or best repo-supported full-stack TypeScript framework.
- Tailwind or equivalent utility-first styling.
- Prisma or equivalent typed ORM.
- PostgreSQL where available.
- Zod for validation.
- Vitest for unit/integration tests.
- Playwright for E2E/smoke tests where practical.
- Sharp or equivalent for local image transforms where supported.
- ZIP utility for delivery packages.
- Server-side auth/session handling.
- Server-side RBAC and tenant isolation.
- Adapter registries for all integration categories.
- Mock adapters by default.
- Real integrations feature-flagged.

## 8. Repo Structure Codex Should Create

Recommended structure:

```txt
app/
  public/
  admin/
  client/
  agency/
  api/
components/
  ui/
  layout/
  forms/
  jobs/
  images/
  dashboards/
lib/
  auth/
  db/
  env/
  rbac/
  audit/
  validation/
  services/
  adapters/
  files/
  image-processing/
  delivery/
  billing/
  sales-channels/
  security/
prisma/
  schema.prisma
  seed.ts
tests/
  unit/
  integration/
  e2e/
  security/
docs/
```

Phase 0 should create only the scaffold and documentation/baseline tooling. Later product areas are implemented in their roadmap phases.

## 9. Phase 0 Implementation Instructions

1. Inspect the repository.
2. Identify existing framework, package manager, scripts, and constraints.
3. Preserve any existing working setup.
4. Normalize source docs into canonical docs.
5. Create or update baseline TypeScript project structure.
6. Add `.env.example` with fake placeholder values only.
7. Add environment validation scaffold.
8. Add health endpoint.
9. Add baseline test/check scripts where practical.
10. Add starter tests for environment validation and health endpoint.
11. Update `ROADMAP_STATUS.md`.
12. Run available checks.
13. Stop after Phase 0.

## 10. Phase 0 Acceptance Criteria

- Repository installs dependencies.
- Framework/package manager decision documented.
- Canonical docs exist.
- `.env.example` exists with fake placeholders only.
- Environment validation exists.
- Health endpoint exists.
- Baseline scripts exist.
- Starter tests exist.
- Practical checks have been run and documented.
- `ROADMAP_STATUS.md` is updated.
- No Phase 1+ product features are implemented.

## 11. Phase 0 Files To Create/Modify

Likely files:

- `README.md`
- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `AGENTS.md`
- `SECURITY.md`
- `ENVIRONMENT.md`
- `DEPLOYMENT.md`
- `TESTING.md`
- `API.md`
- `.env.example`
- `package.json`
- TypeScript config files
- framework config files
- health endpoint files
- environment validation files
- starter test files

## 12. Phase 0 Tests/Checks

Run where practical:

- `npm run typecheck`
- `npm run lint`
- `npm run format`
- `npm run test`
- `npm run build`
- `npm run verify-env`
- `npm run smoke`

Do not report fake test results.

## 13. Security Rules Codex Must Enforce

- Never hardcode secrets.
- Never expose secrets to the frontend.
- Never store marketplace passwords.
- Validate inputs server-side.
- Enforce RBAC and tenant isolation server-side in relevant phases.
- Preserve originals.
- Use expiring upload/delivery tokens in relevant phases.
- Verify webhooks in billing/integration phases.
- Prevent ZIP slip.
- Neutralize CSV formula injection.
- Keep real integrations disabled by default.

## 14. Anti-Drift Rules Codex Must Follow

- Do not build a generic uploader.
- Do not build only static pages.
- Do not skip roadmap phases.
- Do not hardcode packages/presets only in UI.
- Do not ignore marketplace sales-channel tracking.
- Do not ignore manual fallback.
- Do not ignore admin approval.
- Do not require paid APIs for baseline functionality.
- Do not guarantee marketplace compliance or sales results.

## 15. First Codex Prompt

See `FIRST_CODEX_PROMPT.md`.

## 16. Recurring Codex Phase Prompt

See `CODEX_RECURRING_PHASE_PROMPT.md`.

## 17. Codex Review Prompt

See `CODEX_REVIEW_PROMPT.md`.

## 18. Codex Bugfix Prompt

See `CODEX_BUGFIX_PROMPT.md`.

## 19. Codex Security Audit Prompt

See `CODEX_SECURITY_AUDIT_PROMPT.md`.

## 20. Known Limitations

- Exact repository framework must be confirmed by Codex.
- No app code has been implemented by ChatGPT Project Mode.
- No tests have been run by ChatGPT Project Mode.
- Real integrations are intentionally disabled by default.

## 21. Next Steps

Run `FIRST_CODEX_PROMPT.md` in Codex and complete Phase 0 only.

---

# v3 Addendum — Phase 1 UI Shell Seed

ChatGPT advanced the seed into Phase 1 after unzipping and reviewing all Markdown files for context. This does not mean Phase 1 is verified in the target repository.

Read before stitching:

- `WHOLE_REPO_CODEX_HANDOFF_V3.md`
- `CODEX_GAPS.md`
- `CHATGPT_MARKDOWN_REVIEW_INDEX.md`
- `PHASE_1_IMPLEMENTATION_NOTES.md`
- `PHASE_1_EXECUTION_RUNBOOK.md`
- `PHASE_1_VERIFICATION_MATRIX.md`

Codex must stitch v3, install dependencies, run checks, fix failures, and update `ROADMAP_STATUS.md` with real results.

## Phase 37 — Security Hardening handoff update

Current repo seed is `ListingLift_Repo_Seed_v39.zip`.

Phase 37 added security hardening scaffolds for encrypted secret references, upload safety, ZIP slip prevention, hashed/expiring tokens, sensitive-route rate-limit policies, security headers, CSRF, XSS/output safety, webhook verification decisions, audit completeness maps, admin security UI shells, admin security route contracts, Prisma/migration scaffolds, and tests.

Codex must not treat the scaffolds as production-ready. See:

- `WHOLE_REPO_CODEX_HANDOFF_V39.md`
- `CODEX_GAPS.md`
- `PHASE_37_EXECUTION_RUNBOOK.md`
- `PHASE_37_VERIFICATION_MATRIX.md`
- `docs/security-hardening-phase37-gap-handoff.md`
- `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V39.md`

---

## Phase 38 update

Current package: ListingLift Repo Seed v40.

Current phase: Phase 38 — Full Testing and QA.

Use `WHOLE_REPO_CODEX_HANDOFF_V40.md`, `CODEX_GAPS.md`, `PHASE_38_EXECUTION_RUNBOOK.md`, and `PHASE_38_VERIFICATION_MATRIX.md` as the current handoff sources. Do not rely on the older Phase 0 status text in this historical handoff file.
