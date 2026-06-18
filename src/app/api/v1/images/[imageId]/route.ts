import { etaggedJsonOk, jsonFail, mapServiceError } from '@/lib/api-response';
import { guardedApiTokenRoute } from '@/server/routes/api-token-route-helpers';

export async function GET(request: Request, context: { params: Promise<{ imageId: string }> }) {
  try {
    const result = await guardedApiTokenRoute(request, 'images:read', async (apiContext) => {
      const { imageId } = await context.params;
      return {
        image: { id: imageId, organizationId: apiContext.organizationId, metadataOnly: true, signedUrl: '[not-exposed]' },
        codexNote: 'Codex must return tenant-scoped image metadata only and never expose raw signed URLs, unapproved files, provider payloads, or secrets.',
      };
    });

    // Extract response data and re-wrap with ETag
    const body = await result.json();
    return etaggedJsonOk(body.data, request);
  } catch (error) {
    if (error instanceof Error && error.message.includes('API authentication required')) return jsonFail('api_unauthorized', error.message, 401);
    if (error instanceof Error && (error.message.includes('API scope denied') || error.message.includes('API plan gate denied'))) return jsonFail('api_forbidden', error.message, 403);
    return mapServiceError(error);
  }
}
