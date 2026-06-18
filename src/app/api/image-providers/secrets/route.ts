import { PERMISSIONS } from '@/domain/permissions';
import { guardedPost, parseJson } from '@/server/routes/route-helpers';
import { imageProviderSecretSetupSchema } from '@/schemas/image-provider';
import { validateImageProviderSecretRefs } from '@/server/services/image-provider-secret-service';

export async function POST(request: Request) {
  const body = await parseJson(request, {});
  return guardedPost(request, PERMISSIONS.manageIntegrations, () => validateImageProviderSecretRefs(imageProviderSecretSetupSchema.parse(body)));
}
