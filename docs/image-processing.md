# image-processing.md

Image processing must preserve originals, use mock provider by default, generate transparent PNG, white JPG, WebP, platform presets, before/after previews, and quality flags. Provider failures must trigger manual fallback and audit logs.

## Phase 10 Provider Layer Addendum

The provider layer is adapter-first. All provider calls must pass through the registry in `src/server/adapters/image/registry.ts`. Feature code must not call Remove.bg, Cloudinary, Replicate, Clipdrop-style, open-source services, or local workers directly.

Real provider calls must remain disabled unless both the global real-call flag and provider-specific flag are enabled. Mock processing remains the default baseline so the app can run without paid APIs.

Provider failures must return normalized errors and manual fallback instructions. Final delivery remains admin-approval gated in later phases.
