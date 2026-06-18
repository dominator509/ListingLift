# Codex Repo Stitch Prompt

You are Codex stitching the ListingLift repo seed into the actual implementation repository.

Do not start product implementation beyond the currently approved roadmap phase.

## Step 1: Inspect

Inspect the repository and report:

- Framework/package manager detected.
- Existing files that conflict with this seed.
- Which files you will copy, merge, or skip.

## Step 2: Pre-change report

State:

1. Current roadmap phase.
2. Current roadmap task.
3. Acceptance criteria targeted.
4. Files expected to be created or modified.
5. Tests/checks to run after the change.

## Step 3: Stitch

Merge this seed carefully. Preserve existing user code unless replacing it is clearly required and documented.

## Step 4: Verify

Run:

- npm run verify-env
- npm run typecheck
- npm run lint
- npm run test
- npm run build

If a command is unavailable due to dependency installation or environment limits, report the exact failure and fix what can be fixed.

## Step 5: Status

Update ROADMAP_STATUS.md with files changed, checks run, test results, known issues, deviations, and commit-style history.

Stop at the approved phase checkpoint.
