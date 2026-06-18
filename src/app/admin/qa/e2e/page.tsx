import { QaCommandSequenceTable, QaCoverageMatrix, QaCriticalJourneyPanel } from '@/components/full-testing-qa';
import { PageHeader } from '@/components/ui/page-header';
import { buildFullTestingQaPlan } from '@/server/services/full-testing-qa-plan-service';

export default function Page() {
  const plan = buildFullTestingQaPlan('E2E');
  return (
    <main>
      <PageHeader eyebrow="Phase 38" title="E2E QA plan" description="Signup/login, package selection, test checkout, webhook intake, upload 10 images, mock processing, preview, approval, ZIP delivery, revision, marketplace workflows, and revenue dashboard checks." />
      <div className="space-y-8">
        <QaCommandSequenceTable commands={plan.commandSequence.filter((command) => command.layer === 'E2E' || command.layer === 'BROWSER')} />
        <QaCoverageMatrix coverage={plan.coverage} />
        <QaCriticalJourneyPanel journeys={plan.criticalJourneys} />
      </div>
    </main>
  );
}
