import { QaCommandSequenceTable, QaProductionBlockerPanel } from '@/components/full-testing-qa';
import { PageHeader } from '@/components/ui/page-header';
import { buildFullTestingQaPlan } from '@/server/services/full-testing-qa-plan-service';
import { getQaProductionBlockers } from '@/server/services/full-testing-qa-risk-service';

export default function Page() {
  const plan = buildFullTestingQaPlan('SECURITY');
  return (
    <main>
      <PageHeader eyebrow="Phase 38" title="Security QA plan" description="No-secret leakage, upload rejection, ZIP slip, RBAC, tenant isolation, tokens, webhooks, delivery gates, CSRF/header checks, safe-copy checks, and dependency audit requirements." />
      <div className="space-y-8">
        <QaCommandSequenceTable commands={plan.commandSequence.filter((command) => command.layer === 'SECURITY')} />
        <QaProductionBlockerPanel blockers={getQaProductionBlockers('HIGH')} />
      </div>
    </main>
  );
}
