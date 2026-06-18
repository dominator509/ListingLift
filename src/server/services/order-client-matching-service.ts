import type { ClientMatchDraft, NormalizedExternalOrder } from '@/schemas/sales-channel';

export type ExistingClientCandidate = {
  id: string;
  name: string;
  email?: string | null;
  sourceChannel?: string | null;
  externalCustomerId?: string | null;
};

function normalizeComparable(value?: string | null) {
  return value?.trim().toLowerCase() || undefined;
}

export function buildClientMatchDraft(order: NormalizedExternalOrder, organizationId?: string, candidates: ExistingClientCandidate[] = []): ClientMatchDraft {
  if (order.internalClientId) {
    return {
      organizationId,
      existingClientId: order.internalClientId,
      matchStrategy: 'internal_client_id',
      confidence: 1,
      name: order.buyerName ?? order.buyerEmailOrUsername ?? 'Imported client',
      email: order.buyerEmailOrUsername?.includes('@') ? order.buyerEmailOrUsername : undefined,
      sourceChannel: order.channelName,
      externalCustomerId: order.externalCustomerId,
    };
  }

  const buyerEmail = order.buyerEmailOrUsername?.includes('@') ? normalizeComparable(order.buyerEmailOrUsername) : undefined;
  const byEmail = buyerEmail ? candidates.find((client) => normalizeComparable(client.email) === buyerEmail) : undefined;
  if (byEmail) {
    return {
      organizationId,
      existingClientId: byEmail.id,
      matchStrategy: 'email',
      confidence: 0.95,
      name: byEmail.name,
      email: byEmail.email ?? undefined,
      sourceChannel: order.channelName,
      externalCustomerId: order.externalCustomerId,
    };
  }

  const byExternalCustomer = order.externalCustomerId
    ? candidates.find((client) => normalizeComparable(client.externalCustomerId) === normalizeComparable(order.externalCustomerId))
    : undefined;
  if (byExternalCustomer) {
    return {
      organizationId,
      existingClientId: byExternalCustomer.id,
      matchStrategy: 'external_customer_id',
      confidence: 0.9,
      name: byExternalCustomer.name,
      email: byExternalCustomer.email ?? undefined,
      sourceChannel: order.channelName,
      externalCustomerId: order.externalCustomerId,
    };
  }

  const username = !order.buyerEmailOrUsername?.includes('@') ? normalizeComparable(order.buyerEmailOrUsername) : undefined;
  const byUsername = username ? candidates.find((client) => normalizeComparable(client.name) === username || normalizeComparable(client.externalCustomerId) === username) : undefined;
  if (byUsername) {
    return {
      organizationId,
      existingClientId: byUsername.id,
      matchStrategy: 'buyer_username',
      confidence: 0.72,
      name: byUsername.name,
      email: byUsername.email ?? undefined,
      sourceChannel: order.channelName,
      externalCustomerId: order.externalCustomerId,
    };
  }

  return {
    organizationId,
    matchStrategy: 'new_client',
    confidence: 0,
    name: order.buyerName ?? order.buyerEmailOrUsername ?? `${order.channelName} buyer`,
    email: buyerEmail,
    sourceChannel: order.channelName,
    externalCustomerId: order.externalCustomerId,
  };
}

export function shouldCreateClient(match: ClientMatchDraft) {
  return !match.existingClientId && match.matchStrategy === 'new_client';
}
