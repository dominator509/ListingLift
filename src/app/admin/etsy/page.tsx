import { EtsyDeliveryTemplatePanel, EtsyListingImportPanel, EtsyRevisionStatusPanel, EtsySafetyPanel, EtsyVisualReportPanel, EtsyWorkflowBoard } from '@/components/etsy';

export default function AdminEtsyPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Etsy workflow</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Manual-first Etsy order intake, square listing output planning, shop visual consistency notes, delivery copy, and revision tracking. Seller review is always required.</p>
      </div>
      <EtsyWorkflowBoard />
      <EtsyListingImportPanel />
      <EtsyVisualReportPanel />
      <EtsyDeliveryTemplatePanel />
      <EtsyRevisionStatusPanel />
      <EtsySafetyPanel />
    </main>
  );
}
