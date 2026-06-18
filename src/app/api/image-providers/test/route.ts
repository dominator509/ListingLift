import { PERMISSIONS } from '@/domain/permissions';
import { guardedPost, parseJson } from '@/server/routes/route-helpers';
import { imageProviderTestRequestSchema } from '@/schemas/image-provider';
import { runImageProviderDryRun } from '@/server/services/image-provider-test-service';

export async function POST(request: Request) {
  const body = await parseJson(request, {});
  return guardedPost(request, PERMISSIONS.manageIntegrations, () => runImageProviderDryRun(imageProviderTestRequestSchema.parse(body)));
}
