import { PageHeader } from '@/components/ui/page-header';
import { PipelineStatusCard, ProcessingOutputPlanTable, ProcessingRunSummary, ProcessingStepList } from '@/components/processing';
import { buildProcessingRunPlan } from '@/server/services/image-processing-output-planner';
import { buildProcessingSteps } from '@/server/services/image-processing-step-planner';

const job = {
  id: 'job_demo_1',
  organizationId: 'org_demo_1',
  jobNumber: 'JOB-DEMO-001',
  selectedPresetKeys: ['TransparentPngCutout', 'WhiteJpgCatalog', 'SquareMarketplaceDraft', 'VerticalSocialDraft'],
  status: 'UPLOAD_RECEIVED',
};

const images = [
  {
    id: 'img_demo_1',
    organizationId: 'org_demo_1',
    jobId: 'job_demo_1',
    originalName: 'demo-product-001.jpg',
    storageKey: 'demo/originals/demo-product-001.jpg',
    mimeType: 'image/jpeg',
    width: 2000,
    height: 2000,
    status: 'ORIGINAL_UPLOADED',
  },
];

const plan = buildProcessingRunPlan({ job, images, providerKey: 'mock-image-provider' });
const steps = buildProcessingSteps(plan);

export default function AdminProcessingPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <PageHeader title="Image processing pipeline" description="Queue, process, and review output generation while preserving originals and keeping final downloads hidden until approval." />
      <PipelineStatusCard snapshot={{ totalImages: plan.imageCount, totalRequestedOutputs: plan.outputCount, totalCreatedOutputs: 0, totalFailedOutputs: 0, status: plan.status }} />
      <ProcessingRunSummary plan={plan} />
      <ProcessingOutputPlanTable outputs={plan.outputs} />
      <ProcessingStepList steps={steps.slice(0, 12)} />
    </main>
  );
}
