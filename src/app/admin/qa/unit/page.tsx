import { QaCommandSequenceTable, QaCoverageMatrix } from '@/components/full-testing-qa';
import { PageHeader } from '@/components/ui/page-header';
import { buildFullTestingQaPlan } from '@/server/services/full-testing-qa-plan-service';

export default function Page() {
  const plan = buildFullTestingQaPlan('UNIT');
  return (
    <main>
      <PageHeader eyebrow="Phase 38" title="Unit QA plan" description="Package mapping, presets, normalization, naming, manifests, image-processing helpers, credit ledger, RBAC, upload/download tokens, and QA service contracts." />
      <div className="space-y-8">
        <QaCommandSequenceTable commands={plan.commandSequence.filter((command) => command.layer === 'UNIT')} />
        <QaCoverageMatrix coverage={plan.coverage} />
      </div>
    </main>
  );
}
