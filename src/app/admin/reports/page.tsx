import { ReportBuilderPanel, ReportMetricCard, ReportSafetyPanel, ReportTable } from '@/components/reports-upsells';

export default function AdminReportsPage() {
  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="mt-2 text-slate-600">Build client, admin, agency, and white-label report drafts from approved fulfillment data.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <ReportMetricCard label="Draft reports" value="3" trend="UP" />
        <ReportMetricCard label="Ready for approval" value="1" />
        <ReportMetricCard label="Client-visible" value="0" />
        <ReportMetricCard label="White-label drafts" value="1" />
      </div>
      <ReportSafetyPanel />
      <ReportBuilderPanel />
      <ReportTable />
    </main>
  );
}
