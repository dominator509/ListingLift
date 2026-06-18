import {
  FiverrDeliveryTemplatePanel,
  FiverrGigMappingTable,
  FiverrManualOrderForm,
  FiverrRevenueSummaryCard,
  FiverrSafetyPanel,
  FiverrWorkflowBoard,
} from '@/components/fiverr';
import { PageHeader } from '@/components/ui/page-header';

export default function AdminFiverrPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <PageHeader
        title="Fiverr workflow"
        description="Manual-first Fiverr intake, fulfillment tracking, delivery template, and revenue attribution. No scraping, password storage, or unauthorized messaging."
      />
      <FiverrWorkflowBoard />
      <div className="grid gap-6 lg:grid-cols-2">
        <FiverrManualOrderForm />
        <FiverrSafetyPanel />
      </div>
      <FiverrGigMappingTable />
      <div className="grid gap-6 lg:grid-cols-2">
        <FiverrDeliveryTemplatePanel />
        <FiverrRevenueSummaryCard />
      </div>
    </main>
  );
}
