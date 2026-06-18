import { parseJson, guardedPost } from '@/server/routes/route-helpers';
import { processingRunPlanRequestSchema } from '@/schemas/image-processing';
import { runCoreImageProcessingPipeline } from '@/server/services/core-image-processing-pipeline-service';

export async function POST(request: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const body = await parseJson(request, {});
  return guardedPost(request, 'manage:jobs', async () => {
    const data = processingRunPlanRequestSchema.parse(body);
    if (data.job.id !== (await params).jobId) throw new Error('Route jobId must match processing job payload.');
    return runCoreImageProcessingPipeline({ job: data.job, images: data.images, providerKey: data.providerKey, presetKeys: data.presetKeys, dryRun: data.dryRun });
  });
}
