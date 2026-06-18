import { UpsellOpportunityCard, ReportSafetyPanel } from '@/components/reports-upsells';

export default function UpsellOpportunitiesPage() {
  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Upsell Opportunities</h1>
      <ReportSafetyPanel />
      <div className="grid gap-4 md:grid-cols-2">
        <UpsellOpportunityCard title="More image packs" reason="Recent delivery can lead into additional SKU cleanup." score={71} />
        <UpsellOpportunityCard title="Dashboard access" reason="Client has repeat workflow indicators." score={63} />
      </div>
    </main>
  );
}
