import { etaggedJsonOk, jsonFail, mapServiceError } from '@/lib/api-response';
import { guardedApiTokenRoute } from '@/server/routes/api-token-route-helpers';

export async function GET(request: Request, context: { params: Promise<{ jobId: string }> }) {
  try {
    const result = await guardedApiTokenRoute(request, 'jobs:read', async (apiContext) => {
      const { jobId } = await context.params;
      return {
        job: { id: jobId, organizationId: apiContext.organizationId, status: 'DRY_RUN_PENDING_PRISMA', clientVisibleOnly: true },
        codexNote: 'Codex must load a tenant-scoped job and redact private admin notes, provider errors, raw webhook payloads, and secrets.',
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
