import { FiverrDeliveryTemplatePanel, FiverrSafetyPanel } from '@/components/fiverr';
import { PageHeader } from '@/components/ui/page-header';

export default function FiverrDeliveryPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <PageHeader title="Fiverr delivery" description="Generate safe delivery copy and record manual Fiverr delivery after ListingLift approval gates are satisfied." />
      <FiverrDeliveryTemplatePanel />
      <FiverrSafetyPanel />
    </main>
  );
}
