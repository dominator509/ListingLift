import { QualityReportPreview } from '@/components/advanced-processing';

export default function AdvancedProcessingReportsPage() {
  return (
    <main className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-950">Advanced quality reports</h1>
      <QualityReportPreview />
    </main>
  );
}
