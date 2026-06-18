import { ReportBuilderPanel, ReportSafetyPanel } from '@/components/reports-upsells';

export default function ReportBuilderPage() {
  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Report Builder</h1>
      <ReportSafetyPanel />
      <ReportBuilderPanel />
    </main>
  );
}
