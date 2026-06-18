import { NextResponse } from 'next/server';
import { jsonOk, mapServiceError } from '@/lib/api-response';
import { salesChannelNormalizationRequestSchema } from '@/schemas/sales-channel';
import { parseJson } from '@/server/routes/route-helpers';
import { requireSession } from '@/server/services/auth-session-service';
import { assertPermission } from '@/server/services/authorization-service';
import { buildSalesChannelNormalizationPlan } from '@/server/services/sales-channel-normalization-service';
import { verifyCsrfForRequest } from '@/server/services/csrf-protection-service';
import pLimit from 'p-limit';

export async function POST(request: Request) {
  try {
    const session = await requireSession(request);
    verifyCsrfForRequest(request, session);
    assertPermission(session, 'manage:sales-channels');
    const body = await parseJson<{ channelKey?: string; mode?: string; orders?: Record<string, unknown>[]; dryRun?: boolean }>(request, {});

    // Q18 P3: Cap import size at 500 items to prevent resource exhaustion
    const MAX_IMPORT_SIZE = 500;
    const orders = Array.isArray(body.orders) ? body.orders : [];
    if (orders.length > MAX_IMPORT_SIZE) {
      return NextResponse.json(
        { ok: false, error: { code: 'VALIDATION_ERROR', message: `Import size exceeds maximum of ${MAX_IMPORT_SIZE} items (received ${orders.length}). Split into smaller batches.` } },
        { status: 422 },
      );
    }

    const organizationId = session.organizationId;

    // P23: Parallel processing with concurrency cap
    const limit = pLimit(10);
    const results = await Promise.allSettled(
      orders.map((payload, index) =>
        limit(async () => {
          const parsed = salesChannelNormalizationRequestSchema.parse({
            channelKey: body.channelKey ?? payload.channelKey ?? payload.channelName ?? 'manual',
            mode: body.mode ?? 'CSV_IMPORT',
            payload,
            organizationId,
            dryRun: body.dryRun ?? true,
          });
          const plan = await buildSalesChannelNormalizationPlan({ request: parsed, organizationId });
          return { index, status: 'fulfilled' as const, plan };
        })
      )
    );

    const plans: unknown[] = [];
    const errors: { index: number; message: string }[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        plans.push(result.value.plan);
      } else {
        const itemIndex = results.indexOf(result);
        errors.push({ index: itemIndex, message: result.reason instanceof Error ? result.reason.message : String(result.reason) });
      }
    }

    return jsonOk({
      total: orders.length,
      succeeded: plans.length,
      failed: errors.length,
      plans,
      errors: errors.length > 0 ? errors : undefined,
      note: 'Batch import processed with parallel concurrency (limit=10) and per-item error reporting.',
    });
  } catch (error) {
    return mapServiceError(error);
  }
}
