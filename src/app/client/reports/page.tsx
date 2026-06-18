import { ReportSafetyPanel, ReportTable } from '@/components/reports-upsells';

export default function ClientReportsPage() {
  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      <p className="text-slate-600">Approved reports appear here after admin review. Seller review is recommended before publishing marketplace assets.</p>
      <ReportSafetyPanel />
      <ReportTable />
    </main>
  );
}
