import { toCanonicalSalesChannelKey } from '@/domain/sales-channel-normalization';
import { normalizedExternalOrderSchema, type NormalizedExternalOrder } from '@/schemas/sales-channel';
import {
  asRecord,
  centsAlready,
  centsValue,
  normalizeOrderPayload,
  stableExternalOrderId,
  stringValue,
} from '@/server/adapters/sales-channel/normalization-helpers';

export type RawExternalOrder = Record<string, unknown>;

export function normalizeManualOrder(input: RawExternalOrder): NormalizedExternalOrder {
  const channelName = toCanonicalSalesChannelKey(stringValue(input.channelName, input.channel, input.source, input.salesChannel) ?? 'Direct');
  return normalizedExternalOrderSchema.parse(normalizeOrderPayload({
    channelName,
    externalOrderId: stringValue(input.externalOrderId, input.orderId, input.order_id, input.id) ?? stableExternalOrderId(channelName, input),
    externalCustomerId: stringValue(input.externalCustomerId, input.customerId, input.customer_id, input.buyerId),
    buyerName: stringValue(input.buyerName, input.customerName, input.name, input.buyer_name),
    buyerEmailOrUsername: stringValue(input.buyerEmailOrUsername, input.email, input.buyerEmail, input.username, input.buyer_username),
    packagePurchased: stringValue(input.packagePurchased, input.packageKey, input.package, input.productName, input.gigTitle),
    orderAmountCents: centsAlready(input.orderAmountCents),
    orderAmount: input.orderAmount ?? input.amount ?? input.price,
    currency: input.currency,
    deadline: input.deadline ?? input.dueAt ?? input.due_date,
    revisionAllowance: input.revisionAllowance ?? input.revisions,
    sourceUrl: input.sourceUrl ?? input.url ?? input.order_url,
    paymentStatus: input.paymentStatus,
    uploadStatus: input.uploadStatus,
    fulfillmentStatus: input.fulfillmentStatus,
    internalClientId: input.internalClientId,
    internalJobId: input.internalJobId,
    rawPayload: input,
  }));
}

export function normalizeFiverrOrder(input: RawExternalOrder): NormalizedExternalOrder {
  return normalizedExternalOrderSchema.parse(normalizeOrderPayload({
    channelName: 'Fiverr',
    externalOrderId: stringValue(input.order_id, input.orderId, input.externalOrderId, input.id) ?? stableExternalOrderId('Fiverr', input),
    externalCustomerId: stringValue(input.buyer_username, input.buyerUserName, input.buyer_id),
    buyerName: stringValue(input.buyer_name, input.buyer_username),
    buyerEmailOrUsername: stringValue(input.buyer_username, input.buyerEmailOrUsername),
    packagePurchased: stringValue(input.package_key, input.packagePurchased, input.gig_title, input.gigTitle) ?? 'MarketplaceListing25',
    orderAmount: input.price ?? input.amount,
    currency: input.currency,
    deadline: input.deadline ?? input.due_at,
    revisionAllowance: input.revisions ?? input.revisionAllowance ?? 1,
    sourceUrl: input.order_url ?? input.sourceUrl,
    paymentStatus: input.paymentStatus ?? 'PAID',
    rawPayload: input,
  }));
}

export function normalizeGumroadOrder(input: RawExternalOrder): NormalizedExternalOrder {
  const cents = centsAlready(input.price_cents) ?? centsValue(input.price, input.orderAmount);
  return normalizedExternalOrderSchema.parse(normalizeOrderPayload({
    channelName: 'Gumroad',
    externalOrderId: stringValue(input.sale_id, input.id, input.externalOrderId) ?? stableExternalOrderId('Gumroad', input),
    externalCustomerId: stringValue(input.email, input.user_id),
    buyerName: stringValue(input.full_name, input.buyerName, input.name),
    buyerEmailOrUsername: stringValue(input.email, input.buyerEmailOrUsername),
    packagePurchased: stringValue(input.product_name, input.productName, input.packagePurchased),
    orderAmountCents: cents,
    currency: input.currency,
    sourceUrl: input.url ?? input.sourceUrl,
    paymentStatus: input.paymentStatus ?? 'PAID',
    rawPayload: input,
  }));
}

export function normalizeStripeCheckoutOrder(input: RawExternalOrder): NormalizedExternalOrder {
  return normalizedExternalOrderSchema.parse(normalizeOrderPayload({
    channelName: 'Stripe',
    externalOrderId: stringValue(input.checkout_session_id, input.sessionId, input.id, input.externalOrderId) ?? stableExternalOrderId('Stripe', input),
    externalCustomerId: stringValue(input.customer, input.customer_id, input.externalCustomerId),
    buyerName: stringValue(input.customer_name, input.name, input.buyerName),
    buyerEmailOrUsername: stringValue(input.customer_email, input.email, input.buyerEmailOrUsername),
    packagePurchased: stringValue(input.client_reference_id, input.packageKey, input.packagePurchased, input.product_name),
    orderAmountCents: centsAlready(input.amount_total, input.orderAmountCents),
    currency: input.currency,
    paymentStatus: input.payment_status ?? input.status ?? 'PAID',
    sourceUrl: input.url ?? input.sourceUrl,
    rawPayload: input,
  }));
}

export function normalizeUpworkOrder(input: RawExternalOrder): NormalizedExternalOrder {
  return normalizedExternalOrderSchema.parse(normalizeOrderPayload({
    channelName: 'Upwork',
    externalOrderId: stringValue(input.contract_id, input.contractId, input.externalOrderId, input.id) ?? stableExternalOrderId('Upwork', input),
    externalCustomerId: stringValue(input.client_id, input.clientUsername, input.externalCustomerId),
    buyerName: stringValue(input.client_name, input.buyerName),
    buyerEmailOrUsername: stringValue(input.client_username, input.clientUsername, input.buyerEmailOrUsername),
    packagePurchased: stringValue(input.packagePurchased, input.contract_title, input.title) ?? 'MarketplaceListing25',
    orderAmount: input.amount ?? input.budget,
    currency: input.currency,
    deadline: input.deadline ?? input.dueDate,
    revisionAllowance: input.revisionAllowance ?? 1,
    sourceUrl: input.contract_url ?? input.sourceUrl,
    paymentStatus: input.paymentStatus ?? 'MANUAL_CONFIRMED',
    rawPayload: input,
  }));
}

export function normalizeTaskrabbitOrder(input: RawExternalOrder): NormalizedExternalOrder {
  return normalizedExternalOrderSchema.parse(normalizeOrderPayload({
    channelName: 'Taskrabbit',
    externalOrderId: stringValue(input.task_id, input.taskId, input.externalOrderId, input.id) ?? stableExternalOrderId('Taskrabbit', input),
    externalCustomerId: stringValue(input.client_id, input.externalCustomerId),
    buyerName: stringValue(input.client_name, input.buyerName),
    buyerEmailOrUsername: stringValue(input.client_email, input.client_username, input.buyerEmailOrUsername),
    packagePurchased: stringValue(input.packagePurchased, input.task_title, input.title) ?? 'QuickCleanup10',
    orderAmount: input.amount ?? input.hourlyRate,
    currency: input.currency,
    deadline: input.deadline ?? input.appointment_at,
    revisionAllowance: input.revisionAllowance ?? 0,
    sourceUrl: input.task_url ?? input.sourceUrl,
    paymentStatus: input.paymentStatus ?? 'MANUAL_CONFIRMED',
    rawPayload: input,
  }));
}

export function normalizeGenericMarketplaceOrder(channelName: string, input: RawExternalOrder): NormalizedExternalOrder {
  const record = asRecord(input);
  return normalizedExternalOrderSchema.parse(normalizeOrderPayload({
    channelName,
    externalOrderId: stringValue(record.externalOrderId, record.orderId, record.order_id, record.id, record.reference) ?? stableExternalOrderId(channelName, record),
    externalCustomerId: stringValue(record.externalCustomerId, record.customerId, record.customer_id, record.username),
    buyerName: stringValue(record.buyerName, record.customerName, record.name, record.username),
    buyerEmailOrUsername: stringValue(record.buyerEmailOrUsername, record.email, record.username, record.handle),
    packagePurchased: stringValue(record.packagePurchased, record.packageKey, record.productName, record.title) ?? 'MarketplaceListing25',
    orderAmountCents: centsAlready(record.orderAmountCents, record.amount_cents),
    orderAmount: record.orderAmount ?? record.amount ?? record.price,
    currency: record.currency,
    deadline: record.deadline ?? record.dueAt,
    revisionAllowance: record.revisionAllowance ?? record.revisions ?? 1,
    sourceUrl: record.sourceUrl ?? record.url ?? record.orderUrl,
    paymentStatus: record.paymentStatus ?? 'PENDING',
    uploadStatus: record.uploadStatus,
    fulfillmentStatus: record.fulfillmentStatus,
    internalClientId: record.internalClientId,
    internalJobId: record.internalJobId,
    rawPayload: record,
  }));
}


export function normalizeShopifyOrder(input: RawExternalOrder): NormalizedExternalOrder {
  return normalizedExternalOrderSchema.parse(normalizeOrderPayload({
    channelName: 'Shopify',
    externalOrderId: stringValue(input.shopify_order_id, input.orderId, input.externalOrderId, input.productId, input.sku, input.id) ?? stableExternalOrderId('Shopify', input),
    externalCustomerId: stringValue(input.customer_id, input.merchantEmail, input.storeDomain, input.externalCustomerId),
    buyerName: stringValue(input.storeName, input.merchantName, input.buyerName),
    buyerEmailOrUsername: stringValue(input.merchantEmail, input.storeDomain, input.buyerEmailOrUsername),
    packagePurchased: stringValue(input.packagePurchased, input.packageKey, input.productName, input.title) ?? 'MarketplaceListing25',
    orderAmountCents: centsAlready(input.orderAmountCents, input.amount_cents),
    orderAmount: input.orderAmount ?? input.amount ?? input.price,
    currency: input.currency,
    deadline: input.deadline ?? input.dueAt,
    revisionAllowance: input.revisionAllowance ?? input.revisions ?? 1,
    sourceUrl: input.sourceUrl ?? input.url ?? input.shopifyUrl,
    paymentStatus: input.paymentStatus ?? 'PENDING',
    uploadStatus: input.uploadStatus,
    fulfillmentStatus: input.fulfillmentStatus,
    rawPayload: input,
  }));
}
