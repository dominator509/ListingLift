import {
  FULL_TESTING_QA_PHASE,
  QA_COMMAND_PLAN,
  QA_CRITICAL_JOURNEYS,
  QA_ROADMAP_COVERAGE,
  groupQaCoverageByLayer,
  summarizeQaCommands,
  type QaCommandContract,
  type QaTestLayer,
} from '@/domain/full-testing-qa';

export function getQaCommandPlan(layer?: QaTestLayer) {
  return layer ? QA_COMMAND_PLAN.filter((command) => command.layer === layer) : QA_COMMAND_PLAN;
}

export function buildQaCommandSequence(options: { includeE2e?: boolean; includeBrowserSmoke?: boolean } = {}) {
  const includeE2e = options.includeE2e ?? true;
  const includeBrowserSmoke = options.includeBrowserSmoke ?? true;
  return QA_COMMAND_PLAN.filter((command) => {
    if (!includeE2e && command.layer === 'E2E') return false;
    if (!includeBrowserSmoke && command.layer === 'BROWSER') return false;
    return true;
  }).map((command, index) => ({
    step: index + 1,
    ...command,
    status: 'CODEX_REQUIRED' as const,
  }));
}

export function buildQaCoverageMatrix(layer?: QaTestLayer) {
  const rows = layer ? QA_ROADMAP_COVERAGE.filter((item) => item.layer === layer) : QA_ROADMAP_COVERAGE;
  return rows.map((item) => ({
    ...item,
    commandLabels: item.commandKeys.map((key) => QA_COMMAND_PLAN.find((command) => command.key === key)?.command ?? key),
    status: 'CODEX_REQUIRED' as const,
  }));
}

export function buildFullTestingQaPlan(layer?: QaTestLayer) {
  const commands = getQaCommandPlan(layer);
  return {
    phase: FULL_TESTING_QA_PHASE,
    summary: summarizeQaCommands(commands as QaCommandContract[]),
    commandSequence: buildQaCommandSequence(),
    coverage: buildQaCoverageMatrix(layer),
    coverageByLayer: groupQaCoverageByLayer(layer ? QA_ROADMAP_COVERAGE.filter((item) => item.layer === layer) : QA_ROADMAP_COVERAGE),
    criticalJourneys: QA_CRITICAL_JOURNEYS,
    productionReady: false,
    codexNote: 'Phase 38 is a QA scaffold. Codex must run commands, attach evidence, and update gaps before any pass/production-ready claim.',
  };
}
