import { buildTaskrabbitDedupeKey, normalizeTaskrabbitTaskId } from '@/domain/taskrabbit';

export function createTaskrabbitRevenueAttribution(input: { taskId: string; taskValueCents?: number; currency?: string; category?: string; cityOrArea?: string; conversionStatus?: string }) {
  const externalOrderId = normalizeTaskrabbitTaskId(input.taskId);
  return {
    provider: 'taskrabbit',
    externalOrderId,
    dedupeKey: buildTaskrabbitDedupeKey(externalOrderId),
    amountCents: input.taskValueCents ?? 0,
    currency: input.currency ?? 'USD',
    category: input.category,
    cityOrArea: input.cityOrArea,
    conversionStatus: input.conversionStatus ?? 'NOT_TRACKED',
    attributionSource: 'manual_taskrabbit_task',
  };
}
