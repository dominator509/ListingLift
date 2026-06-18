import { PERMISSIONS } from '@/domain/permissions';
import { guardedGet, guardedPatch, parseJson } from '@/server/routes/route-helpers';
import { imageProviderConfigPatchSchema } from '@/schemas/image-provider';
import { getImageProviderAdminDetail } from '@/server/services/image-provider-registry-service';
import { validateImageProviderConfigPolicy } from '@/server/services/image-provider-policy-service';

export async function GET(request: Request, { params }: { params: Promise<{ providerKey: string }> }) {
  return guardedGet(request, PERMISSIONS.manageIntegrations, async () => getImageProviderAdminDetail((await params).providerKey));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ providerKey: string }> }) {
  const body = await parseJson(request, {});
  return guardedPatch(request, PERMISSIONS.manageIntegrations, async () => {
    const data = imageProviderConfigPatchSchema.parse({ ...body, providerKey: (await params).providerKey });
    return { policy: validateImageProviderConfigPolicy(data), persistenceRequiredByCodex: true };
  });
}
