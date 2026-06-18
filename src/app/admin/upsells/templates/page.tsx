import { ReportSafetyPanel, UpsellTemplateTable } from '@/components/reports-upsells';

export default function UpsellTemplatesPage() {
  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Upsell Templates</h1>
      <ReportSafetyPanel />
      <UpsellTemplateTable />
    </main>
  );
}
