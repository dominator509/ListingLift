# docs/platform-presets.md

## Purpose

Platform presets are data-driven records that determine how ListingLift creates delivery outputs. They are not static UI labels. A preset controls dimensions, file format, background type, compression target, safe margin, naming convention, quality checks, and delivery folder destination.

## Required Presets

Phase 6 requires the following seeded presets:

- Amazon main image draft
- Amazon secondary image draft
- Etsy listing square
- eBay listing square
- Shopify product image
- TikTok Shop vertical
- Instagram square
- Instagram story/reel vertical
- Facebook Marketplace square
- Pinterest pin
- Website product gallery
- Gumroad product/offer image
- Restaurant menu item image
- Real estate listing visual cleanup
- Custom client preset

## Preset Fields

Each preset must include:

- `key`
- `platform`
- `platformKey`
- `name`
- `description`
- `width`
- `height`
- `aspectRatio`
- `orientation`
- `format`
- `background`
- `compressionTargetKb`
- `maxFileSizeKb`
- `safeMarginPercent`
- `folderPath`
- `folderDestination`
- `namingConvention`
- `recommendedUse`
- `qualityChecks`
- `channelTags`
- `safeLanguage`
- `marketplaceSafeClaim`
- `sellerReviewRequired`
- `supportsTransparent`
- `supportsWhiteBackground`
- `editable`
- `active`
- `system`
- `sortOrder`

## Safety Rules

Presets must use compliance-safe language only. Do not claim or imply:

- marketplace compliance is guaranteed
- marketplace approval is guaranteed
- ranking improvement is guaranteed
- conversion improvement is guaranteed
- sales improvement is guaranteed
- ad performance is guaranteed

Use language such as:

- “platform-ready draft”
- “seller-review recommended”
- “formatted for common marketplace use”
- “review against current platform guidelines before publishing”

## Folder Rules

Preset folder paths must be relative, sanitized, and ZIP-safe. They must not include:

- absolute paths
- drive paths
- parent-directory traversal
- unsafe filename characters

Example generated delivery structure:

```text
ListingLift_Delivery_ClientName_Job123/
  Amazon/
    white-background/
    secondary-images/
  Etsy/
    square-listing/
  Shopify/
    product-gallery/
  TikTok-Shop/
    vertical/
  Instagram/
    square/
    story/
  Transparent-PNG/
  White-JPG/
  Before-After/
  Manifest.csv
  ReadMe.txt
```

## Phase 6 Implementation Status

ChatGPT v8 seeded the platform preset domain catalog, validation service, selector service, folder service, API route contracts, admin UI shell, Prisma model additions, seed updates, tests, and Codex handoff/gap updates.

Codex must still validate the Prisma schema, regenerate or repair migrations, run the seed against a real database, connect admin persistence and audit logging, and run runtime checks.
