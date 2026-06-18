# Advanced Image Processing

Phase 31 adds the advanced image-processing layer for ListingLift.

## Purpose

Advanced image processing prepares higher-value ecommerce image outputs while preserving ListingLift guardrails:

- preserve originals
- create new derived outputs only
- keep outputs hidden until admin review and approval
- support manual fallback
- avoid marketplace compliance or sales guarantees
- keep real provider/model calls feature-flagged

## Supported recipe scaffolds

- Marketplace Polish
- Brand Background Set
- Launch Hero and Social Set
- Thumbnail Variation Set
- Quality Report Only

## Supported operation scaffolds

- Auto enhance
- Lighting balance
- White balance
- Sharpen
- Denoise
- Soft shadow
- Reflection shadow
- Brand background
- Hero composite
- Social variation
- Thumbnail variation
- Sequence recommendation
- Quality report

## Runtime boundaries

This phase does not auto-publish, auto-replace store images, or expose advanced outputs to clients. It only prepares plans, dry-run contracts, UI shells, Prisma scaffolds, and tests. Codex must wire runtime transforms, storage reads/writes, provider calls, and database transactions.

## Safe claim language

Use:

> Advanced outputs are platform-ready drafts for seller review. They do not guarantee marketplace approval, listing ranking, sales, conversion improvement, ad performance, or product approval.
