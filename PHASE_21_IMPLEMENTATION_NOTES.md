# PHASE_21_IMPLEMENTATION_NOTES.md

## Phase

Phase 21 — Upwork Workflow

## Scope Completed in ChatGPT

- Added Upwork domain constants, mappings, safety rules, proposal/delivery copy, retainer reminders, dedupe helpers, and redaction helpers.
- Added Zod schemas for manual contract intake, mapping drafts, proposal templates, delivery templates, revision status updates, retainer reminders, and safety checks.
- Added services for package mapping, contract intake planning, template generation, revision status, revenue attribution, and marketplace safety.
- Added dry-run API route contracts under `/api/upwork/*`.
- Added admin UI pages and reusable Upwork workflow components.
- Added Prisma schema scaffolds and migration placeholder for Upwork mappings/templates/events.
- Added unit, security, integration, and E2E test scaffolds.
- Updated Codex gaps, roadmap status, handoff, docs, and file manifest.

## Not Completed in ChatGPT

- Prisma validation, migration generation, database application, seed execution, npm install, typecheck, lint, build, browser tests, and runtime integration checks.
- Real persistence and Upwork workflow transactions.
- Any approved Upwork API integration.

## Hard Rules

- Manual-first workflow is the default.
- Do not scrape Upwork.
- Do not store Upwork passwords.
- Do not automate Upwork proposals/messages/delivery without approved integration.
- Do not expose unapproved delivery files.
- Do not guarantee marketplace approval, ranking, sales, conversion, or ad performance.
