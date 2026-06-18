import {
  FULL_TESTING_QA_PHASE,
  QA_COMMAND_PLAN,
  QA_PRODUCTION_BLOCKERS,
  QA_ROADMAP_COVERAGE,
  QA_SMOKE_ROUTE_TARGETS,
  summarizeQaCommands,
} from '../src/domain/full-testing-qa';

console.log(JSON.stringify({
  generatedBy: 'scripts/qa-matrix.ts',
  package: 'ListingLift Repo Seed v40',
  phase: FULL_TESTING_QA_PHASE,
  note: 'Scaffold matrix only. This script does not run tests or mark anything passed.',
  summary: summarizeQaCommands(),
  commandSequence: QA_COMMAND_PLAN.map(({ key, layer, command, purpose }, index) => ({ step: index + 1, key, layer, command, purpose, status: 'CODEX_REQUIRED' })),
  coverage: QA_ROADMAP_COVERAGE.map(({ key, layer, title, commandKeys, productionRisk }) => ({ key, layer, title, commandKeys, productionRisk, status: 'CODEX_REQUIRED' })),
  smokeTargets: QA_SMOKE_ROUTE_TARGETS.map(({ group, routes }) => ({ group, routes, status: 'CODEX_REQUIRED' })),
  blockers: QA_PRODUCTION_BLOCKERS.map(({ key, severity, area, risk, requiredCodexAction }) => ({ key, severity, area, risk, requiredCodexAction, status: 'CODEX_REQUIRED' })),
}, null, 2));
