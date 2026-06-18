import { adminConversionRequestSchema } from '@/schemas/admin-dashboard-analytics';
import { guardedGet } from '@/server/routes/route-helpers';
import { demoConversionCandidates, detectMarketplaceToDirectConversionCandidates } from '@/server/services/admin-revenue-analytics-service';

export async function GET(request: Request) {
  return guardedGet(request, 'view:revenue', async () => {
    const query = adminConversionRequestSchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const candidates = detectMarketplaceToDirectConversionCandidates(demoConversionCandidates).filter((candidate) => candidate.marketplaceOrderCount >= query.minimumMarketplaceOrders);
    return { dryRun: true, query, candidates, codexNote: 'Codex must keep conversion tracking as internal analytics and must not automate marketplace outreach or platform circumvention.' };
  });
}
