import { parseJson, guardedPost } from '@/server/routes/route-helpers';
import { processSingleImageRequestSchema } from '@/schemas/image-processing';
import { runCoreImageProcessingPipeline } from '@/server/services/core-image-processing-pipeline-service';

export async function POST(request: Request, { params }: { params: Promise<{ imageId: string }> }) {
  const body = await parseJson(request, {});
  return guardedPost(request, 'manage:jobs', async () => {
    const data = processSingleImageRequestSchema.parse(body);
    if (data.image.id !== (await params).imageId) throw new Error('Route imageId must match image payload.');
    return runCoreImageProcessingPipeline({
      job: { id: data.jobId, organizationId: data.organizationId, jobNumber: data.jobId, selectedPresetKeys: data.presetKeys ?? [] },
      images: [data.image],
      providerKey: data.providerKey,
      presetKeys: data.presetKeys,
      dryRun: data.dryRun,
    });
  });
}
