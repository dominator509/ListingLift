import { PERMISSIONS } from '@/domain/permissions';
import { guardedGet, guardedPost, parseJson } from '@/server/routes/route-helpers';
import { imageProviderConfigPatchSchema } from '@/schemas/image-provider';
import { listImageProvidersForAdmin } from '@/server/services/image-provider-registry-service';
import { validateImageProviderConfigPolicy } from '@/server/services/image-provider-policy-service';
import { buildImageProviderConnectionDraft } from '@/server/services/image-provider-secret-service';

export async function GET(request: Request) {
  return guardedGet(request, PERMISSIONS.manageIntegrations, () => ({ providers: listImageProvidersForAdmin() }));
}

export async function POST(request: Request) {
  const body = await parseJson(request, {});
  return guardedPost(request, PERMISSIONS.manageIntegrations, (session) => {
    const data = imageProviderConfigPatchSchema.parse(body);
    const policy = validateImageProviderConfigPolicy(data);
    const connectionDraft = buildImageProviderConnectionDraft({
      organizationId: session.organizationId,
      providerKey: data.providerKey,
      enabled: data.enabled,
      mode: data.mode === 'mock' ? 'MOCK' : data.mode === 'manual' ? 'MANUAL' : 'API',
      config: data.config,
      secretRefs: data.secretRefs,
    });
    return { policy, connectionDraft, persistenceRequiredByCodex: true };
  });
}
