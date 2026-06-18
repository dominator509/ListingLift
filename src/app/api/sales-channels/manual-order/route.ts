import { jsonFail, jsonOk, mapServiceError } from '@/lib/api-response';
import { salesChannelNormalizationRequestSchema } from '@/schemas/sales-channel';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { buildSalesChannelNormalizationPlan } from '@/server/services/sales-channel-normalization-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'create:manual-orders');
    const body = await parseJson<Record<string, unknown>>(request, {});
    const organizationId = session.organizationId;
    if (!organizationId) return jsonFail('missing_organization', 'Authenticated session is missing organization scope.', 400);
    const parsed = salesChannelNormalizationRequestSchema.parse({
      channelKey: body.channelKey ?? body.channelName ?? 'manual',
      mode: body.mode ?? 'MANUAL',
      payload: body.payload && typeof body.payload === 'object' ? body.payload : body,
      organizationId,
      dryRun: body.dryRun ?? true,
    });
    const plan = await buildSalesChannelNormalizationPlan({ request: parsed, organizationId });
    return jsonOk({
      ...plan,
      note: 'Phase 7 returns a normalized plan. Codex must connect persistence, duplicate lookup, audit log creation, client upsert, job creation, and upload-token trigger in the live repo.',
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Duplicate external order')) return jsonFail('duplicate_external_order', error.message, 409);
    return mapServiceError(error);
  }
}
