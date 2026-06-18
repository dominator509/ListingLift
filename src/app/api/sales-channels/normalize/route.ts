import { jsonFail, jsonOk, mapServiceError } from '@/lib/api-response';
import { salesChannelNormalizationRequestSchema } from '@/schemas/sales-channel';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { getSalesChannelAdapter } from '@/server/adapters/sales-channel/registry';

export async function POST(request: Request) {
  try {
    await requireSession(request);
    const body = await parseJson<Record<string, unknown>>(request, {});
    const parsed = salesChannelNormalizationRequestSchema.parse({
      channelKey: body.channelKey ?? body.channelName ?? 'manual',
      mode: body.mode ?? 'MANUAL',
      payload: body.payload && typeof body.payload === 'object' ? body.payload : body,
      dryRun: body.dryRun ?? true,
    });
    const adapter = getSalesChannelAdapter(parsed.channelKey);
    const normalized = await adapter.normalize(parsed.payload);
    return jsonOk({ adapterKey: adapter.key, canonicalChannelKey: adapter.canonicalChannelKey, normalized, dryRun: parsed.dryRun });
  } catch (error) {
    if (error instanceof Error && /invalid/i.test(error.message)) return jsonFail('invalid_sales_channel_payload', error.message, 400);
    return mapServiceError(error);
  }
}
