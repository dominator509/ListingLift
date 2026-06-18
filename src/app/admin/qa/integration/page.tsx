import { QaCommandSequenceTable, QaCoverageMatrix } from '@/components/full-testing-qa';
import { PageHeader } from '@/components/ui/page-header';
import { buildFullTestingQaPlan } from '@/server/services/full-testing-qa-plan-service';

export default function Page() {
  const plan = buildFullTestingQaPlan('INTEGRATION');
  return (
    <main>
      <PageHeader eyebrow="Phase 38" title="Integration QA plan" description="Auth, client/job CRUD, manual orders, Stripe and Gumroad webhooks, upload flow, mock processing, ZIP, previews, approval, delivery, reports, upsells, subscriptions, storage, and automation webhooks." />
      <div className="space-y-8">
        <QaCommandSequenceTable commands={plan.commandSequence.filter((command) => command.layer === 'INTEGRATION')} />
        <QaCoverageMatrix coverage={plan.coverage} />
      </div>
    </main>
  );
}
