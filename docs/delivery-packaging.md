# Delivery Packaging

Phase 12 creates the delivery packaging layer for ListingLift.

## Responsibilities

- Generate safe file names.
- Generate folder trees from selected platform presets.
- Build a `Manifest.csv` for all included output files.
- Build a compliance-safe `ReadMe.txt`.
- Draft a ZIP archive plan.
- Persist delivery archive records for later approval/delivery phases.

## Safety Language

Use:

- “platform-ready draft”
- “seller-review recommended”
- “formatted for common marketplace use”
- “review against current platform guidelines before publishing”

Do not guarantee:

- marketplace approval
- product approval
- listing approval
- ranking
- sales
- conversion lift
- ad performance

## ZIP Rules

- Never include absolute paths.
- Never include `..` path traversal.
- Never include drive-letter paths.
- Never overwrite original upload storage keys.
- All archive entries must live under the delivery root folder.

## Manifest Rules

- Include source image, output file, preset, platform, dimensions, format, status, and notes.
- Neutralize CSV formulas.
- Do not expose private storage credentials or signed URLs.
