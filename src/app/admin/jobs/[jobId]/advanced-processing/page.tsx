import { AdvancedProcessingSafetyPanel, BrandBackgroundPanel, HeroSocialPlanPanel, QualityReportPreview } from '@/components/advanced-processing';

export default async function JobAdvancedProcessingPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  return (
    <main className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium text-slate-500">Job {jobId}</p>
        <h1 className="text-2xl font-bold text-slate-950">Advanced processing plan</h1>
      </div>
      <AdvancedProcessingSafetyPanel />
      <BrandBackgroundPanel />
      <HeroSocialPlanPanel />
      <QualityReportPreview />
    </main>
  );
}
