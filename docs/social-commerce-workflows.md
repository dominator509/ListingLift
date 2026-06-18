# Social Commerce Workflows

ListingLift social-commerce workflows convert social/profile/marketplace source requests into normalized internal fulfillment jobs while keeping platform actions manual and safe by default.

## Covered Sources
- TikTok Shop
- Instagram Shop
- Instagram Profile / Creator
- TikTok Profile / Creator
- Facebook Marketplace
- Facebook Business Page
- Pinterest
- YouTube Shorts
- Google Business Profile social posts

## Core Flow
1. Operator records the source manually.
2. System maps source to package, presets, creative formats, and delivery mode.
3. System creates a client/external-order/job/upload-token plan.
4. Client uploads product photos or exports.
5. ListingLift processes outputs through existing image pipeline.
6. Admin reviews QC and approvals.
7. Delivery copy is generated for manual operator use only.
8. Revisions and revenue attribution are tracked.

## Safety
No private scraping, platform password storage, automated DMs/comments/posts/uploads, fake engagement, or platform performance guarantees are allowed.
