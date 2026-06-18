# Whole Repo Codex Handoff v25

## Current Seed State

This package advances ListingLift through a ChatGPT-coded seed for **Phase 23 — Other Sales Channel Workflows**.

## Mandatory Source Authority

- `ARCHITECTURE.md`
- `BUILD_ROADMAP.md`
- `ListingLift.md`
- `ListingLift_BUILD_ROADMAP.md`
- `ROADMAP_STATUS.md`
- `CODEX_GAPS.md`

## What v25 Adds

- Phase 23 generic sales channel catalog for Freelancer.com, PeoplePerHour, Guru, Contra, Thumbtack, Bark, Houzz, LinkedIn, Facebook business page, Instagram profile/shop link, TikTok profile link, YouTube description links, X/Twitter, Lemon8, Pinterest, Product Hunt, Indie Hackers, AppSumo later, local chamber directories, Google Business Profile, Yelp, Craigslist, Nextdoor, Discord, Skool, and Circle.
- Manual lead/order/job intake planners.
- Proposal/follow-up/delivery template planners.
- Revenue attribution and export planners.
- Safety checks blocking scraping, password storage, and unauthorized automation.
- Admin UI shells and API route contracts.
- Prisma schema and migration scaffolds.
- Tests and docs.

## Codex Must Do

1. Stitch v25 seed into the actual repo.
2. Validate and repair Prisma schema/migrations.
3. Generate Prisma client.
4. Apply migrations.
5. Run seed twice.
6. Replace dry-run route bodies with tenant-scoped Prisma lookups and transactions.
7. Enforce RBAC and tenant isolation server-side.
8. Add audit logs for all sensitive/manual actions.
9. Run all checks and update `ROADMAP_STATUS.md` with real results.

## Do Not

- Do not scrape private source/platform pages.
- Do not store passwords for any source/platform.
- Do not automate DMs, comments, proposals, replies, bookings, group posts, or lead inbox actions unless an approved integration explicitly permits it.
- Do not expose unapproved delivery files.
- Do not guarantee marketplace approval, ranking, sales, conversion, ad performance, product approval, or listing approval.
