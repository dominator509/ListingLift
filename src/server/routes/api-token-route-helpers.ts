import { jsonFail, jsonOk, mapServiceError } from '@/lib/api-response';
import { API_ACCESS_SCOPES, type ApiAccessScope } from '@/domain/api-access';
import { hashApiToken } from '@/server/services/api-access-token-service';
import { assertApiTokenScope, type ApiTokenScopeContext } from '@/server/services/api-access-scope-service';

export function extractBearerToken(request: Request) {
  const header = request.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? null;
}

export function buildDryRunApiTokenContext(request: Request, requiredScope: ApiAccessScope): ApiTokenScopeContext & { tokenHashPreview: string; dryRun: true } {
  const token = extractBearerToken(request);
  if (!token) throw new Error('API authentication required: Bearer token missing.');
  if (!token.startsWith('ll_api_') && !token.startsWith('ll_test_')) throw new Error('API authentication required: invalid token prefix.');
  const hash = hashApiToken(token);
  return {
    organizationId: request.headers.get('x-listinglift-organization-id') ?? 'codex-dry-run-org',
    tokenId: request.headers.get('x-listinglift-token-id') ?? 'codex-dry-run-token',
    clientId: request.headers.get('x-listinglift-client-id'),
    agencyWorkspaceId: request.headers.get('x-listinglift-agency-workspace-id'),
    scopes: request.headers.get('x-listinglift-dry-run-scopes')?.split(',').map((scope) => scope.trim()).filter(Boolean) ?? [...API_ACCESS_SCOPES],
    planKey: request.headers.get('x-listinglift-plan') ?? 'AGENCY_SCALE',
    status: 'ACTIVE',
    tokenHashPreview: `${hash.slice(0, 12)}...`,
    dryRun: true,
  };
}

export async function guardedApiTokenRoute<T>(request: Request, requiredScope: ApiAccessScope, handler: (context: ReturnType<typeof buildDryRunApiTokenContext>) => Promise<T> | T) {
  try {
    const context = buildDryRunApiTokenContext(request, requiredScope);
    assertApiTokenScope(context, requiredScope);
    return jsonOk(await handler(context));
  } catch (error) {
    if (error instanceof Error && error.message.includes('API authentication required')) return jsonFail('api_unauthorized', error.message, 401);
    if (error instanceof Error && (error.message.includes('API scope denied') || error.message.includes('API plan gate denied'))) return jsonFail('api_forbidden', error.message, 403);
    return mapServiceError(error);
  }
}
