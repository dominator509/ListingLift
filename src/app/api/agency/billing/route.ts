import { agencyVolumePricingRequestSchema } from '@/schemas/agency-white-label';
import { guardedSession } from '@/server/routes/route-helpers';
import { assertCanManageAgencyBilling } from '@/server/services/agency-white-label-access-service';
import { buildAgencyVolumePricingQuote } from '@/server/services/agency-billing-service';

export async function GET(request: Request) {
  return guardedSession(request, (session) => {
    assertCanManageAgencyBilling(session);
    const query = agencyVolumePricingRequestSchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    return { dryRun: true, quote: buildAgencyVolumePricingQuote(query), codexNote: 'Codex must derive agency billing from verified subscriptions, invoices, credits, and payment records.' };
  });
}
