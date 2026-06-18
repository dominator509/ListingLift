import { QA_PRODUCTION_BLOCKERS, type QaSeverity } from '@/domain/full-testing-qa';

const severityRank: Record<QaSeverity, number> = {
  BLOCKER: 5,
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function getQaProductionBlockers(minSeverity: QaSeverity = 'LOW') {
  const minRank = severityRank[minSeverity];
  return QA_PRODUCTION_BLOCKERS.filter((risk) => severityRank[risk.severity] >= minRank).map((risk) => ({
    ...risk,
    status: 'CODEX_REQUIRED' as const,
    productionReleaseAllowed: false,
  }));
}

export function summarizeQaRisks() {
  const blockers = getQaProductionBlockers();
  return {
    totalRisks: blockers.length,
    blockerCount: blockers.filter((risk) => risk.severity === 'BLOCKER').length,
    criticalCount: blockers.filter((risk) => risk.severity === 'CRITICAL').length,
    highOrAboveCount: blockers.filter((risk) => ['BLOCKER', 'CRITICAL', 'HIGH'].includes(risk.severity)).length,
    productionReleaseAllowed: false,
  };
}
