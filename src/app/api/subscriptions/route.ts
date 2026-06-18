import { jsonOk } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { buildSubscriptionEntitlementDraft } from '@/server/services/subscription-entitlement-service';
import type { SubscriptionEntitlementInput } from '@/schemas/credits-subscriptions';

export async function GET() {
  return jsonOk({ subscriptions: [], note: 'Seed route. Codex must return tenant-scoped subscriptions and entitlements.' });
}

export async function POST(request: Request) {
  const body = await parseJson<Partial<SubscriptionEntitlementInput> & { organizationId?: string }>(request, {});
  const draft = buildSubscriptionEntitlementDraft({ organizationId: body.organizationId ?? 'seed-org', entitlementKey: body.entitlementKey ?? 'monthly-images', monthlyImageAllowance: body.monthlyImageAllowance ?? 50, usedThisPeriod: body.usedThisPeriod ?? 0, status: body.status ?? 'ACTIVE', clientId: body.clientId, subscriptionId: body.subscriptionId });
  return jsonOk({ draft, note: 'Seed route. Codex must persist entitlements only after verified subscription or manual admin confirmation.' }, { status: 201 });
}
