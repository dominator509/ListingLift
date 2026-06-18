import { PERMISSIONS } from '@/domain/permissions';
import { guardedPost, parseJson } from '@/server/routes/route-helpers';
import { imageProviderSelectionRequestSchema } from '@/schemas/image-provider';
import { selectImageProvider } from '@/server/services/image-provider-selection-service';

export async function POST(request: Request) {
  const body = await parseJson(request, {});
  return guardedPost(request, PERMISSIONS.manageIntegrations, () => selectImageProvider(imageProviderSelectionRequestSchema.parse(body)));
}
