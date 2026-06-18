import { adminRetainerAlertRequestSchema } from '@/schemas/admin-dashboard-analytics';
import { guardedGet } from '@/server/routes/route-helpers';
import { buildRetainerOpportunityAlerts, demoRetainerSignals } from '@/server/services/admin-revenue-analytics-service';

export async function GET(request: Request) {
  return guardedGet(request, 'generate:upsells', async () => {
    const query = adminRetainerAlertRequestSchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    return { dryRun: true, query, alerts: buildRetainerOpportunityAlerts(demoRetainerSignals, query.minimumScore, query.includeSubscribedClients), codexNote: 'Codex must persist alerts as manual-review opportunities and audit dismiss/convert/manual override actions.' };
  });
}
