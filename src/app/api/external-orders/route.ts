import { jsonOk, mapServiceError } from '@/lib/api-response';
import { salesChannelNormalizationRequestSchema } from '@/schemas/sales-channel';
import { guardedGet, parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { buildSalesChannelNormalizationPlan } from '@/server/services/sales-channel-normalization-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:sales-channels', async () => ({
    items: [],
    note: 'External order list scaffold exists. Codex must connect this to Prisma with pagination, filters, tenant isolation, and source attribution.',
  }));
}

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'create:manual-orders');
    const body = await parseJson<Record<string, unknown>>(request, {});
    const organizationId = session.organizationId;
    const parsed = salesChannelNormalizationRequestSchema.parse({
      channelKey: body.channelKey ?? body.channelName ?? 'manual',
      mode: body.mode ?? 'MANUAL',
      payload: body.payload && typeof body.payload === 'object' ? body.payload : body,
      organizationId,
      dryRun: body.dryRun ?? true,
    });
    const plan = await buildSalesChannelNormalizationPlan({ request: parsed, organizationId });
    return jsonOk({ plan, persistence: 'pending_codex_prisma_transaction' }, { status: 201 });
  } catch (error) {
    return mapServiceError(error);
  }
}
