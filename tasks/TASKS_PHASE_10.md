# TASKS_PHASE_10.md — Image Processing Provider Layer

## Rule

Execute this phase only after prior phases are validated in `ROADMAP_STATUS.md`, unless explicitly continuing from ChatGPT Project Mode seed artifacts where prior runtime-only gaps are documented.

## Pre-change checklist

- State current phase and task.
- State acceptance criteria.
- List expected files.
- List checks to run.

## Implementation focus

Create swappable background-removal/image-processing provider adapters without implementing the full processing pipeline.

## Required providers

- Mock image provider
- Remove.bg scaffold
- Cloudinary scaffold
- Replicate scaffold
- Clipdrop-style scaffold
- Open-source background-removal scaffold
- Local image-worker scaffold

## Required controls

- Mock provider works without paid keys.
- Real providers are optional.
- Real calls are disabled by default.
- Real calls require global and provider-specific feature flags.
- Secrets are encrypted and never returned to the frontend.
- Provider errors normalize into retry/manual fallback decisions.
- Manual fallback remains available.

## Acceptance gate

- Required files created or updated.
- Relevant tests/checks run.
- Failures fixed or documented with blocker status.
- `ROADMAP_STATUS.md` updated.
- No secrets committed.
- No roadmap phase skipped without documented user-approved deviation.

## Commit-style entry

`phase-10: image processing provider layer`
