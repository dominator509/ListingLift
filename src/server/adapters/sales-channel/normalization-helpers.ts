import { toCanonicalPackageKey, toCanonicalSalesChannelKey } from '@/domain/sales-channel-normalization';
import type { NormalizedExternalOrder } from '@/schemas/sales-channel';

export type UnknownOrderPayload = Record<string, unknown>;

export function asRecord(input: unknown): UnknownOrderPayload {
  return input && typeof input === 'object' && !Array.isArray(input) ? (input as UnknownOrderPayload) : {};
}

export function stringValue(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  }
  return undefined;
}

export function intValue(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.round(value));
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseInt(value.replace(/[^0-9-]/g, ''), 10);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
  }
  return fallback;
}

export function centsValue(...values: unknown[]): number | undefined {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      // Treat very large integer-ish fields named *_cents as already cents by adapter callers.
      return Math.round(value > 1000 && Number.isInteger(value) ? value : value * 100);
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value.replace(/[^0-9.-]/g, ''));
      if (Number.isFinite(parsed)) return Math.round(parsed * 100);
    }
  }
  return undefined;
}

export function centsAlready(...values: unknown[]): number | undefined {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) return Math.max(0, Math.round(value));
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number.parseInt(value.replace(/[^0-9]/g, ''), 10);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

export function currencyValue(value: unknown, fallback = 'USD') {
  const raw = stringValue(value)?.toUpperCase() ?? fallback;
  return /^[A-Z]{3}$/.test(raw) ? raw : fallback;
}

export function urlValue(value: unknown): string | undefined {
  const raw = stringValue(value);
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function deadlineValue(value: unknown): string | undefined {
  const raw = stringValue(value);
  if (!raw) return undefined;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function paymentStatusValue(value: unknown): NormalizedExternalOrder['paymentStatus'] {
  const raw = stringValue(value)?.toLowerCase() ?? '';
  if (['paid', 'succeeded', 'complete', 'completed', 'confirmed'].includes(raw)) return 'PAID';
  if (['manual_confirmed', 'manual-confirmed', 'manual confirmed'].includes(raw)) return 'MANUAL_CONFIRMED';
  if (['refunded', 'refund'].includes(raw)) return 'REFUNDED';
  if (['failed', 'declined'].includes(raw)) return 'FAILED';
  if (['unpaid', 'open'].includes(raw)) return 'UNPAID';
  return 'PENDING';
}

export function uploadStatusValue(value: unknown): NormalizedExternalOrder['uploadStatus'] {
  const raw = stringValue(value)?.toLowerCase() ?? '';
  if (['token_sent', 'token-sent', 'sent'].includes(raw)) return 'TOKEN_SENT';
  if (['partial'].includes(raw)) return 'PARTIAL';
  if (['complete', 'completed', 'received'].includes(raw)) return 'COMPLETE';
  if (['failed', 'error'].includes(raw)) return 'FAILED';
  return 'NOT_STARTED';
}

export function fulfillmentStatusValue(value: unknown): NormalizedExternalOrder['fulfillmentStatus'] {
  const raw = stringValue(value)?.toLowerCase() ?? '';
  if (['in_progress', 'in-progress', 'processing'].includes(raw)) return 'IN_PROGRESS';
  if (['needs_review', 'needs-review', 'review'].includes(raw)) return 'NEEDS_REVIEW';
  if (['approved'].includes(raw)) return 'APPROVED';
  if (['delivered'].includes(raw)) return 'DELIVERED';
  if (['revision', 'revision_requested'].includes(raw)) return 'REVISION';
  if (['complete', 'completed'].includes(raw)) return 'COMPLETE';
  if (['failed', 'error'].includes(raw)) return 'FAILED';
  return 'NOT_STARTED';
}

export function stableExternalOrderId(channelName: string, payload: UnknownOrderPayload) {
  return stringValue(payload.externalOrderId, payload.orderId, payload.order_id, payload.id, payload.sale_id, payload.contract_id, payload.task_id)
    ?? `${toCanonicalSalesChannelKey(channelName).toLowerCase()}-${Date.now()}`;
}

export function normalizeOrderPayload(input: {
  channelName: unknown;
  externalOrderId?: unknown;
  externalCustomerId?: unknown;
  buyerName?: unknown;
  buyerEmailOrUsername?: unknown;
  packagePurchased?: unknown;
  orderAmountCents?: unknown;
  orderAmount?: unknown;
  currency?: unknown;
  deadline?: unknown;
  revisionAllowance?: unknown;
  sourceUrl?: unknown;
  paymentStatus?: unknown;
  uploadStatus?: unknown;
  fulfillmentStatus?: unknown;
  internalClientId?: unknown;
  internalJobId?: unknown;
  rawPayload?: unknown;
}): NormalizedExternalOrder {
  const channelName = toCanonicalSalesChannelKey(input.channelName);
  const packageKey = toCanonicalPackageKey(input.packagePurchased);
  return {
    channelName,
    channelKey: channelName,
    externalOrderId: stringValue(input.externalOrderId) ?? stableExternalOrderId(channelName, asRecord(input.rawPayload)),
    externalCustomerId: stringValue(input.externalCustomerId),
    buyerName: stringValue(input.buyerName),
    buyerEmailOrUsername: stringValue(input.buyerEmailOrUsername),
    packagePurchased: stringValue(input.packagePurchased) ?? packageKey,
    packageKey,
    orderAmountCents: centsAlready(input.orderAmountCents) ?? centsValue(input.orderAmount),
    currency: currencyValue(input.currency),
    deadline: deadlineValue(input.deadline),
    revisionAllowance: intValue(input.revisionAllowance, 0),
    sourceUrl: urlValue(input.sourceUrl),
    paymentStatus: paymentStatusValue(input.paymentStatus),
    uploadStatus: uploadStatusValue(input.uploadStatus),
    fulfillmentStatus: fulfillmentStatusValue(input.fulfillmentStatus),
    internalClientId: stringValue(input.internalClientId),
    internalJobId: stringValue(input.internalJobId),
    rawPayload: asRecord(input.rawPayload),
  };
}
