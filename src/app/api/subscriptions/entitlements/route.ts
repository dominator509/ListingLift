import { jsonOk } from '@/lib/api-response';
import { parseJson } from '@/server/routes/route-helpers';
import { evaluateSubscriptionEntitlementAccess } from '@/server/services/subscription-entitlement-service';

export async function POST(request: Request) {
  const body = await parseJson<any>(request, {});
  const result = evaluateSubscriptionEntitlementAccess({ status: body.status ?? 'ACTIVE', monthlyImageAllowance: body.monthlyImageAllowance ?? 50, usedThisPeriod: body.usedThisPeriod ?? 0, paymentStatus: body.paymentStatus });
  return jsonOk({ result, note: 'Seed route. Codex must derive entitlement status from persisted subscription and billing state.' });
}
