import { guardedGet } from '@/server/routes/route-helpers';
import { calculateProcessingProgress } from '@/server/services/image-processing-progress-service';

export async function GET(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  return guardedGet(request, 'manage:jobs', async () => ({
    jobId: (await params).jobId,
    progress: calculateProcessingProgress({ totalImages: 1, totalRequestedOutputs: 4, totalCreatedOutputs: 0, totalFailedOutputs: 0, status: 'PLANNED' }),
    note: 'Codex must replace this dry-run route with real ImageProcessingRun lookup scoped by organization/job.',
  }));
}
