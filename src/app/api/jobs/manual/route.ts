import { manualJobCreateSchema } from '@/schemas/job';
import { parseJson, guardedPost } from '@/server/routes/route-helpers';
import { assertManualJobCreationSafe, buildManualJobDraft } from '@/server/services/job-creation-service';

export async function POST(request: Request) {
  return guardedPost(request, 'create:manual-orders', async (session) => {
    const body = await parseJson<unknown>(request, {});
    const input = manualJobCreateSchema.parse(body);
    assertManualJobCreationSafe(input);
    const draft = buildManualJobDraft(input, { organizationSlug: session.organizationId, existingJobCount: 0 });
    return { draft, next: ['create or match client', 'create external order when source data exists', 'create job', 'issue upload token'], persistence: 'dry-run' };
  });
}
