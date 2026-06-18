import { UpsellOpportunityCard, UpsellTemplateTable, ReportSafetyPanel } from '@/components/reports-upsells';

export default function AdminUpsellsPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upsell Engine</h1>
        <p className="mt-2 text-slate-600">Detect post-delivery opportunities and prepare manual-review offer drafts.</p>
      </div>
      <ReportSafetyPanel />
      <div className="grid gap-4 md:grid-cols-3">
        <UpsellOpportunityCard title="Monthly retainer" reason="Client completed a large delivery without an active retainer." score={82} />
        <UpsellOpportunityCard title="Ad creative pack" reason="Approved image volume supports ad/social variations." score={74} />
        <UpsellOpportunityCard title="Shopify product-page improvement" reason="Shopify source detected." score={68} />
      </div>
      <UpsellTemplateTable />
    </main>
  );
}
