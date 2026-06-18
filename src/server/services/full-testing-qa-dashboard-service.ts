import { FULL_TESTING_QA_PHASE } from '@/domain/full-testing-qa';
import { buildFullTestingQaPlan } from '@/server/services/full-testing-qa-plan-service';
import { summarizeQaRisks, getQaProductionBlockers } from '@/server/services/full-testing-qa-risk-service';
import { getQaSmokeRouteTargets, summarizeQaSmokeTargets } from '@/server/services/full-testing-qa-smoke-service';

export function buildFullTestingQaDashboardSnapshot() {
  const plan = buildFullTestingQaPlan();
  const riskSummary = summarizeQaRisks();
  const smokeSummary = summarizeQaSmokeTargets();
  return {
    phase: FULL_TESTING_QA_PHASE,
    title: 'Phase 38 — Full Testing and QA',
    summary: {
      commandCount: plan.summary.commandCount,
      coverageItems: plan.coverage.length,
      criticalJourneys: plan.criticalJourneys.length,
      smokeRouteGroups: smokeSummary.groupCount,
      smokeRoutes: smokeSummary.routeCount,
      blockerCount: riskSummary.blockerCount,
      productionReady: false,
    },
    commandSequence: plan.commandSequence,
    coverage: plan.coverage,
    criticalJourneys: plan.criticalJourneys,
    smokeTargets: getQaSmokeRouteTargets(),
    productionBlockers: getQaProductionBlockers('HIGH'),
    codexNote: 'No npm, Prisma, seed, typecheck, lint, Vitest, Playwright, build, smoke, browser, provider, storage, or webhook checks have been run by ChatGPT Project Mode.',
  };
}
