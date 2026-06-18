# HANDOFF_QUEUE.md — ListingLift Gap Queue
## Generated 2026-06-13T23:30:00Z by IpMan (Hermes)

> **Protocol:** LEGACY-GAP-* entries per LEGACY_GAP_SCHEMA.md.  
> **New GAP-*** entries per HANDOFF_QUEUE_SCHEMA.md.  
> **Trinity:** don't drift, don't freeze, don't fixate.

---

## LEGACY-GAP-001 — SPEC-DRIFT: No Agent Execution Baseline
```yaml
gap_id: LEGACY-GAP-001
discovered_during: REPO_DISCOVERY
drift_category: 1  # SPEC-DRIFT
location: repo-wide
description: "Seed v40 restored from ChatGPT project. CODEX_HANDOFF.md and phase runbooks exist but have never been executed by an agent. No DECISIONS.log exists."
severity: LOW
remediation_deferred_until: T2
owner: agent:codex-handoff
status: OPEN
```

## LEGACY-GAP-002 — TEST-DRIFT: Low Test Coverage
```yaml
gap_id: LEGACY-GAP-002
discovered_during: REPO_DISCOVERY
drift_category: 2  # TEST-DRIFT
location: src/
description: "47,514 lines of TypeScript source. Test directory exists but coverage estimate <5%. Full testing deferred to Phase 38 per BUILD_ROADMAP.md. This is by design, not drift."
severity: INFO
remediation_deferred_until: T4
owner: agent:codex-handoff
status: DEFERRED
```

## LEGACY-GAP-003 — CONFIG-DRIFT: Single-Environment .env
```yaml
gap_id: LEGACY-GAP-003
discovered_during: REPO_DISCOVERY
drift_category: 3  # CONFIG-DRIFT
location: .env
description: "Single DATABASE_URL pointing to localhost PostgreSQL. No staging/production config separation. .env.example exists but may be stale."
severity: LOW
remediation_deferred_until: T3
owner: agent:codex-handoff
status: OPEN
```

## LEGACY-GAP-004 — HANDOFF-DRIFT: No Agent Execution History
```yaml
gap_id: LEGACY-GAP-004
discovered_during: REPO_DISCOVERY
drift_category: 6  # HANDOFF-DRIFT
location: repo-wide
description: "Single git commit (phase-0 restore). Previous agent-built code was scrapped. No agent handoff trail, no DECISIONS.log, no task completion records."
severity: LOW
remediation_deferred_until: T1
owner: agent:codex-handoff
status: OPEN
```

---

## Queue Summary

| ID | Category | Severity | Deferred To | Status |
|----|----------|----------|-------------|--------|
| LEGACY-GAP-001 | SPEC-DRIFT | LOW | T2 | OPEN |
| LEGACY-GAP-002 | TEST-DRIFT | INFO | T4 | DEFERRED |
| LEGACY-GAP-003 | CONFIG-DRIFT | LOW | T3 | OPEN |
| LEGACY-GAP-004 | HANDOFF-DRIFT | LOW | T1 | OPEN |
