# REPO_INVENTORY.md — ListingLift Discovery
## Generated 2026-06-13T23:30:00Z by IpMan (Hermes)

```yaml
inventory:
  generated_at: "2026-06-13T23:30:00Z"
  generated_by: "IpMan (Hermes)"
  existing_docs:
    root_md_count: 207
    docs_spec_count: 76
    prompts_count: 40
    tasks_count: 41
    key_files:
      - ARCHITECTURE.md
      - BUILD_ROADMAP.md
      - AGENTS.md
      - CODEX_GAPS.md
      - SECURITY.md
      - TESTING.md
      - DEPLOYMENT.md
      - ROADMAP_STATUS.md
  source_tree:
    total_lines: 47514
    language: typescript
    modules:
      - path: src/
        language: typescript
        line_count: ~45000
        has_tests: true
      - path: prisma/
        language: prisma
        line_count: ~2000
        has_tests: false
      - path: scripts/
        language: typescript
        line_count: ~500
        has_tests: false
  test_coverage_estimate: "<5%"
  ci_config_present: true
  ci_config_working: unknown
  build_config_present: true
  dependencies:
    total: ~500
    outdated: unknown
  env_vars_referenced:
    - DATABASE_URL
    - NODE_ENV
    - APP_URL
    - CI
    - ADVANCED_IMAGE_PROCESSING_ENABLED
    - REAL_ADVANCED_IMAGE_PROCESSING_ENABLED
    - MOCK_IMAGE_PROVIDER_ENABLED
  candidate_drift_locations:
    - location: "repo-wide"
      category: 1  # SPEC-DRIFT
      heuristic: "Seed repo v40 restored 2026-06-13. No agent-coded work has occurred yet on this baseline. All docs are original ChatGPT-produced specifications."
    - location: "prisma/schema.prisma"
      category: 2  # TEST-DRIFT
      heuristic: "No Prisma-specific tests found."
    - location: "src/"
      category: 2  # TEST-DRIFT
      heuristic: "Source code present but test coverage estimate <5%. Full testing deferred to Phase 38 per BUILD_ROADMAP.md."
    - location: ".env"
      category: 3  # CONFIG-DRIFT
      heuristic: "DATABASE_URL references local PostgreSQL. No Docker Compose or cloud config present."
    - location: "repo-wide"
      category: 6  # HANDOFF-DRIFT
      heuristic: "Single commit (phase-0 restore). No agent handoff history. CODEX_HANDOFF.md docs exist but never executed."
```

## Retrofit Status

| Step | Status |
|------|--------|
| Backup tag | ✅ pre-retrofit-20260613T232959Z |
| Branch | ✅ retrofit/baseline-v1 |
| Discovery | ✅ REPO_INVENTORY.md emitted |
| T1 (docs-only) | In progress |
| T2 (markers) | Pending |
| T3 (new code trinity) | Pending |
| T4 (legacy refactor) | Pending |

## Notes

This is a freshly restored seed repo (v40 from ChatGPT project). No agent drift has occurred yet on this baseline — the previous agent-built code was scrapped. The retrofit bootstrap applies trinity discipline BEFORE any new coding begins, preventing drift proactively rather than remediating it reactively.
