import { parseJson, guardedPost } from '@/server/routes/route-helpers';
import { processingRunPlanRequestSchema } from '@/schemas/image-processing';
import { createProcessingQueueDraft } from '@/server/services/image-processing-queue-service';

export async function POST(request: Request) {
  const body = await parseJson(request, {});
  return guardedPost(request, 'manage:jobs', async () => {
    const data = processingRunPlanRequestSchema.parse(body);
    return createProcessingQueueDraft({ job: data.job, images: data.images, providerKey: data.providerKey, presetKeys: data.presetKeys });
  });
}
