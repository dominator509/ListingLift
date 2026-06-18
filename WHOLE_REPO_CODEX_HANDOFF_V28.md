# WHOLE_REPO_CODEX_HANDOFF_V28.md

## Current Seed
ListingLift Repo Seed v28

## Advanced Phase
Phase 26 — Social Commerce Workflows

## What Changed
This seed adds social-commerce workflow scaffolding for TikTok Shop, Instagram Shop/Profile, Facebook Marketplace/Page, Pinterest, TikTok Profile, YouTube Shorts, and Google Business Profile social workflows.

## Codex Must Do
- Stitch v28 into the actual repo.
- Validate TypeScript imports and aliases.
- Validate Prisma schema.
- Regenerate Phase 26 migration SQL.
- Wire dry-run routes to Prisma transactions.
- Add RBAC and tenant isolation to every social-commerce route.
- Persist social-commerce mappings, workflow events, creative plans, external orders, jobs, upload tokens, and audit logs transactionally.
- Ensure no unsafe social automation exists.
- Run the required checks and update `ROADMAP_STATUS.md`.

## Do Not Do
- Do not automate DMs, comments, posts, product uploads, buyer messages, or profile actions.
- Do not scrape private platform pages or inboxes.
- Do not store platform passwords.
- Do not guarantee reach, approval, ranking, sales, conversion, ad performance, product approval, or listing approval.
