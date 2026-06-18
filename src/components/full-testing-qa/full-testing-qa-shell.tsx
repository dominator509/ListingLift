import { buildFullTestingQaDashboardSnapshot } from '@/server/services/full-testing-qa-dashboard-service';
import { QaCommandSequenceTable } from './qa-command-sequence-table';
import { QaCoverageMatrix } from './qa-coverage-matrix';
import { QaCriticalJourneyPanel } from './qa-critical-journey-panel';
import { QaNoFakeResultsPanel } from './qa-no-fake-results-panel';
import { QaProductionBlockerPanel } from './qa-production-blocker-panel';
import { QaSmokeTargetPanel } from './qa-smoke-target-panel';
import { QaSummaryCards } from './qa-summary-cards';

export function FullTestingQaShell() {
  const snapshot = buildFullTestingQaDashboardSnapshot();
  return (
    <div className="space-y-8">
      <QaSummaryCards summary={snapshot.summary} />
      <QaNoFakeResultsPanel />
      <QaCommandSequenceTable commands={snapshot.commandSequence} />
      <QaCoverageMatrix coverage={snapshot.coverage} />
      <QaCriticalJourneyPanel journeys={snapshot.criticalJourneys} />
      <QaSmokeTargetPanel smokeTargets={snapshot.smokeTargets} />
      <QaProductionBlockerPanel blockers={snapshot.productionBlockers} />
    </div>
  );
}
