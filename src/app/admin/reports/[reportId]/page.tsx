import { ReportSafetyPanel } from '@/components/reports-upsells';

export default function ReportDetailPage({ params }: { params: { reportId: string } }) {
  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Report {params.reportId}</h1>
      <ReportSafetyPanel />
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Approval gate</h2>
        <p className="mt-2 text-sm text-slate-600">Codex must connect this page to tenant-scoped report lookup, approval events, export plans, and audit logs.</p>
      </section>
    </main>
  );
}
