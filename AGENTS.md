# AGENTS.md — Codex Operating Rules for ListingLift

## Mission

Implement ListingLift as a production-grade full-stack TypeScript SaaS/service-fulfillment application without drifting from `ARCHITECTURE.md` and `BUILD_ROADMAP.md`.

## Source of Truth Order

1. `ARCHITECTURE.md` — product, workflow, data, safety, and integration authority.
2. `BUILD_ROADMAP.md` — phase-by-phase execution authority.
3. `ROADMAP_STATUS.md` — active implementation status and deviations.
4. Supporting docs in `docs/`.

If these conflict, stop, document the conflict in `ROADMAP_STATUS.md`, choose the safest minimal path, and continue only after the deviation is explicit.

## Required Behavior Before Each Major Block

State:

1. Current roadmap phase.
2. Current roadmap task.
3. Acceptance criteria being targeted.
4. Files expected to be created or modified.
5. Tests/checks that will be run after the change.

## Required Behavior After Each Major Block

1. Update `ROADMAP_STATUS.md`.
2. Run relevant tests/checks.
3. Report what passed and failed.
4. Fix failures before moving forward.
5. Mark a phase complete only if acceptance criteria are met.
6. Commit if git is available.
7. If git is unavailable, create a commit-style entry in `ROADMAP_STATUS.md`.

## Commit Message Format

`phase-[number]: [short description]`

Examples:

- `phase-0: initialize repository scaffold`
- `phase-2: add tenant-scoped database schema`
- `phase-15: enforce approval before delivery`

## Non-Negotiable Product Rules

- Do not skip roadmap phases.
- Do not build a generic uploader instead of ListingLift.
- Do not leave core product features as static mockups.
- Preserve original uploads.
- Never overwrite original uploads.
- Require admin approval before final delivery unless explicitly configured otherwise in a later controlled phase.
- Hide final downloads until approved.
- Keep manual fallback core to the product.
- Normalize every sales source into the internal ListingLift job model.
- Use compliance-safe marketplace language.
- Never guarantee marketplace approval, rankings, sales, conversion lift, or ad performance.

## Security Rules

- Never hardcode secrets.
- Never log secrets.
- Never expose provider keys to the frontend.
- Do not store marketplace passwords.
- Encrypt sensitive credentials.
- Validate all inputs server-side.
- Enforce RBAC and tenant isolation server-side.
- Protect uploads, ZIP handling, webhooks, and delivery links.
- Use mock adapters by default.
- Keep real integrations feature-flagged.
- No automated test may require a real paid API key.

## rtk-tee Failure Recovery

The shell environment auto-routes the following commands through `rtk-tee`, a nuclear failure offload wrapper. On FAILURE, the agent sees ONLY a 60-byte file pointer instead of the raw error text. This saves 200-5000+ lines of cascading output from entering LLM context.

**Blanketed commands (15 root binaries):** tsc, next, vitest, eslint, prisma, playwright, prettier, npm, pnpm, webpack, jest, docker, vite, terraform, cypress

**When you see a failure pointer like:**
```
[rtk-tee: FAILURE → /tmp/rtk_failures/tsc-20260614-024117.log]
```

**Recovery:**
1. Immediately read the file at that exact path with `read_file` or `cat`
2. The log contains the full, unfiltered output of the failed command
3. Diagnose and fix the root cause
4. Re-run the command

**Note:** On SUCCESS, rtk-tee shows clean output directly — no pointer, no indirection. Only failures are offloaded to disk. The success output is already in your context window.

## COMM_BUFFER.md — State Board Protocol

All inter-agent communication goes through `/root/ListingLift/COMM_BUFFER.md` — a fixed-slot state board.

**Rules for all agents:**
- Read COMM_BUFFER.md before acting at the start of every turn
- Overwrite your designated slot — never append (appending shifts byte positions and destroys the prefix cache)
- No timestamps, no dates, no "From:" signatures or signatures anywhere in any slot — every unique byte of entropy drops the cache hit rate to 0%
- Flip ACK flags (`ACK_ALFRED=TRUE/FALSE`, `ACK_IP_MAN=TRUE/FALSE`, `ACK_DEZIRAY=TRUE/FALSE`) to signal state, not dated entries


**Slot assignments:**
- `ALFRED_ORCHESTRATOR` — Alfred owns this slot. He advances ACTIVE_STEP, clears ACKs, sets SYSTEM_STATE, increments PIPELINE_EPOCH. Only Alfred writes here.
- `IP_MAN_CODER` — Ip Man owns this slot. He writes STATUS (ASSIGNED/STANDING_BY/DONE) and PAYLOAD (work output). Only Ip Man writes here.
- `DEZIRAY_AUDITOR` — Deziray owns this slot. She writes STATUS (MONITORING/AUDITING/AUDITING_DONE) and PAYLOAD (audit output). Only Deziray writes here.

**Protocol Amendment v2 (ratified 2026-06-15):**
- Alfred's ACTIVE_STEP in CLUSTER_STATE is the single source of truth for all worker assignments. Workers derive their task from ACTIVE_STEP, never from any field in their own slot.
- PIPELINE_EPOCH increments on every ACTIVE_STEP advancement. Workers must compare against their last-seen epoch; if it changed, their slot is stale and must be cleared.
- CURRENT_ASSIGNMENT fields in worker slots are deprecated — do not write or trust them.

**Alfred (Orchestrator) state transitions:**
1. Read ACK Matrix — if ACK_IP_MAN=TRUE and ACK_DEZIRAY=TRUE, advance ACTIVE_STEP
2. Update BUILD_ROADMAP.md to check off completed step (only Alfred may modify this file)
3. Clear all ACKs to FALSE, set NEXT_STEP, advance ACTIVE_STEP

## Phase Discipline

Current authorized implementation start: **Phase 0 only**.

Roadmap phases:

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
