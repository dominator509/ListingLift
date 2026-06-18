import { FiverrManualOrderForm, FiverrGigMappingTable, FiverrSafetyPanel } from '@/components/fiverr';
import { PageHeader } from '@/components/ui/page-header';

export default function FiverrOrderIntakePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <PageHeader title="Fiverr order intake" description="Create ListingLift jobs from Fiverr order details with package mapping, upload link planning, dedupe, and audit requirements." />
      <FiverrManualOrderForm />
      <FiverrGigMappingTable />
      <FiverrSafetyPanel />
    </main>
  );
}
