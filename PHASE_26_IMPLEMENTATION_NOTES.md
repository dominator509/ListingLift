# PHASE_26_IMPLEMENTATION_NOTES.md

## Phase
Phase 26 — Social Commerce Workflows

## Scope Coded In ChatGPT
- Social-commerce domain constants and safety rules.
- Zod schemas for manual source intake, mapping, creative planning, delivery messages, revision status, and safety checks.
- Dry-run services for TikTok Shop, Instagram Shop/Profile, Facebook Marketplace/Page, Pinterest, TikTok Profile, YouTube Shorts, and Google Business Profile social workflows.
- API route contracts under `/api/social-commerce/*`.
- Admin UI shells under `/admin/social-commerce/*`.
- Prisma schema scaffold for social-commerce mappings, creative plans, and workflow events.
- Tests for intake, creative plan, delivery copy, safety, route contract, and E2E page rendering.

## Important Guardrails
- Manual fallback is the baseline.
- Social posting, social DMs, comments, product uploads, marketplace messages, and profile actions must not be automated unless a platform-approved integration exists and is feature-flagged.
- Do not store platform passwords or creator/seller login credentials.
- Do not scrape private platform pages, inboxes, analytics, seller dashboards, profiles, or order pages.
- Do not guarantee reach, approval, ranking, sales, conversion, impressions, ad performance, product approval, or listing approval.
