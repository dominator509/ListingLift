# CHATGPT_MARKDOWN_REVIEW_INDEX_V4.md

## Review Scope

- Review timestamp: 2026-06-03T05:28:53.972721+00:00
- Package reviewed and advanced from: `ListingLift_Repo_Seed_v3.zip`
- Markdown files present in v4 package index: 108
- All 102 Markdown files from the unzipped v3 package were reviewed before selecting and coding Phase 2. New v4 Markdown files are indexed below for Codex continuity.
- Source documents included in review: `ARCHITECTURE.md`, `BUILD_ROADMAP.md`, `docs/source/ListingLift.md`, `docs/source/ListingLift_BUILD_ROADMAP.md`.

## Phase Decision

Phase 2 — Database Schema and Migrations — was selected as the next best task that can be coded inside ChatGPT Project Mode. Remaining Phase 0 and Phase 1 work requires Codex/runtime verification, but Phase 2 schema, seed, defaults, migration scaffolding, and tests can be substantially authored here.

## Review Findings Applied

- The roadmap requires a real `Role` model in addition to permissions; v4 adds `Role` and `RolePermission`.
- The roadmap lists exact required package, preset, and sales-channel keys; v4 normalizes defaults to those exact keys.
- The database must preserve source attribution; v4 links `Job` to `SalesChannel` and `ExternalOrder`.
- The architecture requires tenant isolation; v4 adds/keeps `organizationId` on tenant-critical models and adds tenant helper tests.
- The architecture requires no plaintext secret storage; v4 keeps secrets in `EncryptedSecret.ciphertext` and adds schema contract tests.
- The architecture requires admin approval before delivery; v4 keeps delivery links approval-gated by default.

## Reviewed / Indexed Markdown Files

| # | File | Bytes | SHA256 | Top Headings |
|---:|---|---:|---|---|
| 1 | `ADMIN_GUIDE.md` | 387 | `500eb8e91bb356f3` | # ADMIN_GUIDE.md; ## Operator flow |
| 2 | `AGENTS.md` | 4520 | `4fc26c6d13caaa9f` | # AGENTS.md — Codex Operating Rules for ListingLift; ## Mission; ## Source of Truth Order; ## Required Behavior Before Each Major Block; ## Required Behavior After Each Major Block |
| 3 | `API.md` | 646 | `3e47e8d056b8f4fb` | # API.md; ## Principles; ## Seeded endpoints; ## Future API areas |
| 4 | `ARCHITECTURE.md` | 41955 | `82c2faf540d51069` | # ARCHITECTURE.md — ListingLift Canonical Product/System Authority; # ListingLift Service Business — AI-Powered Product Photo Cleanup, Marketplace Image Packs, Ecommerce Visual Optimization, and Multi-Platform Service Sales Engine; ## 1. Business Overview; ## 2. Core Offer; ## 3. Best Buyer Types |
| 5 | `BUILD_ROADMAP.md` | 53650 | `d321e371c9ec2eb0` | # BUILD_ROADMAP.md — ListingLift Canonical Execution Authority; # BUILD_ROADMAP.md — ListingLift; ## 1. Roadmap Summary; ## 2. Development Principles; ## 3. Recommended Repository Structure |
| 6 | `CHATGPT_MARKDOWN_REVIEW_INDEX.md` | 16119 | `267cac3cad37e1a1` | # CHATGPT_MARKDOWN_REVIEW_INDEX.md; ## Review Scope; ## Source-of-Truth Confirmation; ## Reviewed Markdown Files; ## Review Findings Applied |
| 7 | `CHATGPT_MARKDOWN_REVIEW_INDEX_V4.md` | 18897 | `d5a3059ac140a3f0` | # CHATGPT_MARKDOWN_REVIEW_INDEX_V4.md; ## Review Scope; ## Phase Decision; ## Review Findings Applied; ## Reviewed Markdown Files |
| 8 | `CODEX_GAPS.md` | 3250 | `19de754e4956f219` | # CODEX_GAPS.md; ## Purpose; ## Current ChatGPT Advancement; ## Codex-Only Gaps; ### 1. Dependency Installation |
| 9 | `CODEX_HANDOFF.md` | 8433 | `654f08551eabefa1` | # CODEX_HANDOFF.md; ## 1. Project Summary; ## 2. Source Files Reviewed; ## 3. Canonical Docs Created; ## 4. Architecture Summary |
| 10 | `CODEX_PHASE_0_ONLY_PROMPT_V2.md` | 2831 | `745bce8c26660a65` | # CODEX_PHASE_0_ONLY_PROMPT_V2.md; ## Required Starting Report; ## Implement Only This; ## Do Not Implement; ## Required Commands |
| 11 | `CODEX_STITCHING_HANDOFF.md` | 2977 | `beef34f10148c60f` | # CODEX_STITCHING_HANDOFF.md; ## Objective; ## Source priority; ## Operating rule; ## Required Codex pre-change report |
| 12 | `DEPLOYMENT.md` | 351 | `0138e27a98a10be9` | # DEPLOYMENT.md |
| 13 | `ENVIRONMENT.md` | 327 | `80694ec18e11b4de` | # ENVIRONMENT.md |
| 14 | `FIRST_CODEX_PROMPT.md` | 1849 | `6332d909ec01ab8b` | # FIRST_CODEX_PROMPT.md |
| 15 | `IMPLEMENTATION_SEQUENCE.md` | 2532 | `18aa8f8421f3e647` | # IMPLEMENTATION_SEQUENCE.md; ## Rule; ## Active Phase; ## Sequence; ## Per-Phase Entry Checklist |
| 16 | `PHASE_0_EXECUTION_RUNBOOK.md` | 8534 | `29d00712a0f18f5c` | # PHASE_0_EXECUTION_RUNBOOK.md; ## Purpose; ## Phase 0 Boundary; ### Allowed; ### Forbidden |
| 17 | `PHASE_0_REPO_SCAFFOLD_SPEC.md` | 4164 | `913f85a9d633a2c0` | # PHASE_0_REPO_SCAFFOLD_SPEC.md; ## Purpose; ## Preferred Stack; ## Preferred Root Structure; ## Minimum Health Route Contract |
| 18 | `PHASE_0_ROADMAP_STATUS_COMPLETION_TEMPLATE.md` | 2529 | `7a5f3123656cf549` | # PHASE_0_ROADMAP_STATUS_COMPLETION_TEMPLATE.md; # ROADMAP_STATUS.md; ## Current Phase; ## Current Task; ## Previous Completed Phase |
| 19 | `PHASE_0_VERIFICATION_MATRIX.md` | 2951 | `b7986aaa2cb2f9c3` | # PHASE_0_VERIFICATION_MATRIX.md; ## Purpose; ## Required Checks; ## Minimum Test Coverage; ### Environment Validation |
| 20 | `PHASE_1_EXECUTION_RUNBOOK.md` | 1717 | `a9384d4f44ef1c28` | # PHASE_1_EXECUTION_RUNBOOK.md; ## Purpose; ## Phase Boundary; ## Required Pre-Change Statement; ## Verification Sequence |
| 21 | `PHASE_1_IMPLEMENTATION_NOTES.md` | 2454 | `1c04692eb132ffa7` | # PHASE_1_IMPLEMENTATION_NOTES.md; ## Current Objective; ## What Was Coded; ### UI Primitives; ### Workflow Components |
| 22 | `PHASE_1_VERIFICATION_MATRIX.md` | 1584 | `4a7245126289dba3` | # PHASE_1_VERIFICATION_MATRIX.md; ## Required Commands |
| 23 | `PHASE_2_EXECUTION_RUNBOOK.md` | 2186 | `a8d39d118367dcc8` | # PHASE_2_EXECUTION_RUNBOOK.md; ## Purpose; ## Required Pre-Change Statement; ## Phase Boundary; ## Required Verification Sequence |
| 24 | `PHASE_2_IMPLEMENTATION_NOTES.md` | 2603 | `cfd07a5951b8dbd1` | # PHASE_2_IMPLEMENTATION_NOTES.md; ## Current Objective; ## Source Review; ## What Was Coded; ## What Is Deliberately Not Completed Here |
| 25 | `PHASE_2_VERIFICATION_MATRIX.md` | 1659 | `238b1690e93869d2` | # PHASE_2_VERIFICATION_MATRIX.md; ## ChatGPT-Coded Checks; ## Codex-Only Checks; ## Blocker Conditions |
| 26 | `README.md` | 1088 | `2f2750fb4332d835` | # ListingLift; ## Implementation status; ## Safety rules; ## Codex start |
| 27 | `REPO_FILE_MANIFEST.md` | 541 | `b2f74a6bb58c92d0` | # REPO_FILE_MANIFEST.md |
| 28 | `REPO_FILE_MANIFEST_V2.md` | 10622 | `549de47a44e259b1` | # Repo File Manifest v2 |
| 29 | `REPO_FILE_MANIFEST_V3.md` | 16977 | `7592eae8ef5ebba6` | # REPO_FILE_MANIFEST_V3.md |
| 30 | `ROADMAP_STATUS.md` | 5901 | `4d1d72b1f32064ed` | # ROADMAP_STATUS.md; ## Current Phase; ## Current Task; ## Previous Completed Phase; ## Next Planned Phase |
| 31 | `SECURITY.md` | 3696 | `a8fc6121ad3d96db` | # SECURITY.md — ListingLift Security Requirements; ## Security Position; ## Non-Negotiable Rules; ## Upload Security; ## ZIP Security |
| 32 | `TESTING.md` | 337 | `616e8b14177afeb7` | # TESTING.md |
| 33 | `USER_GUIDE.md` | 365 | `11a841cf925de354` | # USER_GUIDE.md; ## Client flow |
| 34 | `WHOLE_REPO_CODEX_HANDOFF.md` | 2862 | `3242cefc3bccdaf8` | # WHOLE_REPO_CODEX_HANDOFF.md; ## Goal; ## Hard boundary; ## What to do with this package; ## Files that should be treated as implementation scaffolds |
| 35 | `WHOLE_REPO_CODEX_HANDOFF_V2.md` | 2030 | `d49f7f12a3647fe0` | # ListingLift Whole-Repo Codex Handoff v2; ## Strict instruction; ## What changed in v2; ## Stitch order; ## Non-negotiables |
| 36 | `WHOLE_REPO_CODEX_HANDOFF_V3.md` | 2869 | `5a10dd8a7a4c08ca` | # WHOLE_REPO_CODEX_HANDOFF_V3.md; ## Current Objective; ## Source Review Completed in ChatGPT; ## What Changed in v3; ## Critical Rule |
| 37 | `WHOLE_REPO_CODEX_HANDOFF_V4.md` | 3341 | `5742512ec40683d1` | # WHOLE_REPO_CODEX_HANDOFF_V4.md; ## Current Objective; ## Source Review Completed in ChatGPT; ## What Changed in v4; ## Critical Rule |
| 38 | `docs/README.md` | 236 | `ddaa679d72b83de2` | # ListingLift Docs |
| 39 | `docs/automation-integrations.md` | 154 | `bc364fb881352093` | # automation-integrations.md |
| 40 | `docs/codex-handoff.md` | 151 | `2c2956457d026d7a` | # codex-handoff.md |
| 41 | `docs/deployment.md` | 144 | `11fa3c4c2129d8e5` | # deployment.md |
| 42 | `docs/file-storage-integrations.md` | 150 | `772d3b44077e42e8` | # file-storage-integrations.md |
| 43 | `docs/fiverr-workflow.md` | 201 | `3049322bf42ba9ee` | # fiverr-workflow.md |
| 44 | `docs/gumroad-integration.md` | 184 | `42949023318c1f47` | # gumroad-integration.md |
| 45 | `docs/image-processing.md` | 261 | `e1f5b5bb89badaf6` | # image-processing.md |
| 46 | `docs/licensing.md` | 148 | `f845caf2d79fe546` | # licensing.md |
| 47 | `docs/marketplace-safety.md` | 152 | `112b25777f409887` | # marketplace-safety.md |
| 48 | `docs/packages.md` | 125 | `9850d69e1fde7215` | # packages.md |
| 49 | `docs/platform-presets.md` | 160 | `8d48f4efbd932c57` | # platform-presets.md |
| 50 | `docs/qa-checklist.md` | 172 | `1dd37110b70e2b72` | # qa-checklist.md |
| 51 | `docs/rbac.md` | 132 | `c3ec3f347eb4ab9b` | # rbac.md |
| 52 | `docs/repo-stitching-plan.md` | 1019 | `2ba4f344a3b81ea9` | # Repo Stitching Plan; ## Objective; ## Copy order; ## Review gates; ## Stop conditions |
| 53 | `docs/reports.md` | 152 | `cd843ed27c3ee500` | # reports.md |
| 54 | `docs/sales-channels.md` | 195 | `fbe7f52f3f262542` | # sales-channels.md |
| 55 | `docs/source/ListingLift.md` | 41590 | `3e014a508bdbc3d2` | # ListingLift Service Business — AI-Powered Product Photo Cleanup, Marketplace Image Packs, Ecommerce Visual Optimization, and Multi-Platform Service Sales Engine; ## 1. Business Overview; ## 2. Core Offer; ## 3. Best Buyer Types; ## 4. Why Buyers Purchase Immediately |
| 56 | `docs/source/ListingLift_BUILD_ROADMAP.md` | 53386 | `2c77d74981017462` | # BUILD_ROADMAP.md — ListingLift; ## 1. Roadmap Summary; ## 2. Development Principles; ## 3. Recommended Repository Structure; ## 4. Build Phases Overview |
| 57 | `docs/stripe-billing.md` | 137 | `2d964db76e24b01c` | # stripe-billing.md |
| 58 | `docs/taskrabbit-workflow.md` | 147 | `c7195ddb36dd0cb4` | # taskrabbit-workflow.md |
| 59 | `docs/upwork-workflow.md` | 166 | `bf5fb6c276d576de` | # upwork-workflow.md |
| 60 | `prompts/CODEX_BUGFIX_PROMPT.md` | 255 | `2cea76c8e08c5b44` | # Codex Bugfix Prompt |
| 61 | `prompts/CODEX_PHASE_1_PROMPT.md` | 482 | `5905e8278a6906b1` | # Codex Phase 1 Prompt — Design System and UI Shell |
| 62 | `prompts/CODEX_REPO_STITCH_PROMPT.md` | 1161 | `87448094d6c3429f` | # Codex Repo Stitch Prompt; ## Step 1: Inspect; ## Step 2: Pre-change report; ## Step 3: Stitch; ## Step 4: Verify |
| 63 | `prompts/CODEX_REVIEW_PROMPT.md` | 341 | `65528d9fdbe87ecb` | # Codex Review Prompt |
| 64 | `prompts/CODEX_SECURITY_AUDIT_PROMPT.md` | 357 | `afbbb40f0b526a03` | # Codex Security Audit Prompt |
| 65 | `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V2.md` | 1191 | `04f487fe0e1ebba4` |  |
| 66 | `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V3.md` | 1528 | `1f482cb9db99239b` |  |
| 67 | `prompts/CODEX_WHOLE_REPO_STITCH_PROMPT_V4.md` | 1645 | `9ec0d5ee2a2344b1` |  |
| 68 | `tasks/TASKS_PHASE_0.md` | 662 | `55119bb487c9566b` | # TASKS_PHASE_0.md — Repository Initialization; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 69 | `tasks/TASKS_PHASE_1.md` | 1770 | `dec5a5da90f4dd95` | # TASKS_PHASE_1.md — Design System and UI Shell; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Seeded Artifacts |
| 70 | `tasks/TASKS_PHASE_10.md` | 683 | `a60ff3647ddde15c` | # TASKS_PHASE_10.md — Image Processing Provider Layer; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 71 | `tasks/TASKS_PHASE_11.md` | 680 | `2c2345f2dd986d77` | # TASKS_PHASE_11.md — Core Image Processing Pipeline; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 72 | `tasks/TASKS_PHASE_12.md` | 671 | `5c5ceeb87c6a1f2d` | # TASKS_PHASE_12.md — Naming Folders Manifest ZIP; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 73 | `tasks/TASKS_PHASE_13.md` | 686 | `7d18cd105a07b4b1` | # TASKS_PHASE_13.md — Preview Gallery and Before After; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 74 | `tasks/TASKS_PHASE_14.md` | 695 | `8ad14b1c07dba8a6` | # TASKS_PHASE_14.md — Quality Control and Flagged Outputs; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 75 | `tasks/TASKS_PHASE_15.md` | 701 | `67660f6ca6fcf4dd` | # TASKS_PHASE_15.md — Manual Approval and Revision Workflow; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 76 | `tasks/TASKS_PHASE_16.md` | 686 | `fe7d0d33ecbccd38` | # TASKS_PHASE_16.md — Delivery and Email Notifications; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 77 | `tasks/TASKS_PHASE_17.md` | 671 | `9d37236a63c0df44` | # TASKS_PHASE_17.md — Stripe Checkout and Billing; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 78 | `tasks/TASKS_PHASE_18.md` | 683 | `98891e36d464d0dd` | # TASKS_PHASE_18.md — Gumroad Checkout Webhook Intake; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 79 | `tasks/TASKS_PHASE_19.md` | 701 | `21d3f1f9e8f522be` | # TASKS_PHASE_19.md — Credits Subscriptions Manual Invoices; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 80 | `tasks/TASKS_PHASE_2.md` | 677 | `061e7c45feb8baab` | # TASKS_PHASE_2.md — Database Schema and Migrations; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 81 | `tasks/TASKS_PHASE_20.md` | 635 | `3a3559206940eb99` | # TASKS_PHASE_20.md — Fiverr Workflow; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 82 | `tasks/TASKS_PHASE_21.md` | 635 | `26b73738de0aecbb` | # TASKS_PHASE_21.md — Upwork Workflow; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 83 | `tasks/TASKS_PHASE_22.md` | 647 | `d66a0df3bf226011` | # TASKS_PHASE_22.md — Taskrabbit Workflow; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 84 | `tasks/TASKS_PHASE_23.md` | 650 | `59a6bf902dbd5ec2` | # TASKS_PHASE_23.md — Other Sales Channels; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 85 | `tasks/TASKS_PHASE_24.md` | 629 | `bd680478705b3694` | # TASKS_PHASE_24.md — Etsy Workflow; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 86 | `tasks/TASKS_PHASE_25.md` | 638 | `a7c6ac1840d7c8bc` | # TASKS_PHASE_25.md — Shopify Workflow; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 87 | `tasks/TASKS_PHASE_26.md` | 665 | `051c1a21eced3368` | # TASKS_PHASE_26.md — Social Commerce Workflows; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 88 | `tasks/TASKS_PHASE_27.md` | 689 | `fd17d8907a626e26` | # TASKS_PHASE_27.md — Amazon eBay WooCommerce Workflows; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 89 | `tasks/TASKS_PHASE_28.md` | 665 | `c904f7224952f836` | # TASKS_PHASE_28.md — File Storage Integrations; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 90 | `tasks/TASKS_PHASE_29.md` | 647 | `ca507fbea97a73a6` | # TASKS_PHASE_29.md — Automation Webhooks; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 91 | `tasks/TASKS_PHASE_3.md` | 668 | `854b633b7d6a382c` | # TASKS_PHASE_3.md — Authentication and Sessions; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 92 | `tasks/TASKS_PHASE_30.md` | 695 | `b32609e5e4bc44b3` | # TASKS_PHASE_30.md — Notifications and Task Data Exports; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 93 | `tasks/TASKS_PHASE_31.md` | 665 | `1f2c4e79a11cb14e` | # TASKS_PHASE_31.md — Advanced Image Processing; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 94 | `tasks/TASKS_PHASE_32.md` | 665 | `e00b76054540638e` | # TASKS_PHASE_32.md — Reports and Upsell Engine; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 95 | `tasks/TASKS_PHASE_33.md` | 638 | `82d30c2f138a651f` | # TASKS_PHASE_33.md — Client Dashboard; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 96 | `tasks/TASKS_PHASE_34.md` | 701 | `2138dd534dc06bc2` | # TASKS_PHASE_34.md — Admin Dashboard and Revenue Analytics; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 97 | `tasks/TASKS_PHASE_35.md` | 659 | `23c4c79c453a2b58` | # TASKS_PHASE_35.md — Agency White-Label Mode; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 98 | `tasks/TASKS_PHASE_36.md` | 686 | `9c8c9bd21530feb0` | # TASKS_PHASE_36.md — API Access and Advanced Scaffold; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 99 | `tasks/TASKS_PHASE_37.md` | 644 | `e4b3143166b2d793` | # TASKS_PHASE_37.md — Security Hardening; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 100 | `tasks/TASKS_PHASE_38.md` | 647 | `5761482df3a5a6ce` | # TASKS_PHASE_38.md — Full Testing and QA; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 101 | `tasks/TASKS_PHASE_39.md` | 653 | `1a13fe49b1e515a9` | # TASKS_PHASE_39.md — Production Deployment; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 102 | `tasks/TASKS_PHASE_4.md` | 692 | `d710223182c2870a` | # TASKS_PHASE_4.md — Tenant Client RBAC and Agency Model; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 103 | `tasks/TASKS_PHASE_40.md` | 647 | `e9539a2b2c3e2cc0` | # TASKS_PHASE_40.md — Post-Launch Backlog; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 104 | `tasks/TASKS_PHASE_5.md` | 647 | `e5d9e7e7d3c6a9e0` | # TASKS_PHASE_5.md — Packages and Pricing; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 105 | `tasks/TASKS_PHASE_6.md` | 653 | `c31b032b596a590a` | # TASKS_PHASE_6.md — Platform Preset System; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 106 | `tasks/TASKS_PHASE_7.md` | 686 | `c5c2168caab1eaa4` | # TASKS_PHASE_7.md — Sales Channel Normalization Layer; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 107 | `tasks/TASKS_PHASE_8.md` | 674 | `a308c5c6938e04cd` | # TASKS_PHASE_8.md — Direct Upload and File Intake; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |
| 108 | `tasks/TASKS_PHASE_9.md` | 671 | `a22638e0d15b46b4` | # TASKS_PHASE_9.md — Job Creation and Admin Queue; ## Rule; ## Pre-change checklist; ## Implementation focus; ## Acceptance gate |

## Codex Follow-Up

Codex must treat this review as context only and still run actual validation, migration, seed, typecheck, lint, tests, and build in the real repository before marking phases complete.
