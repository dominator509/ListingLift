import { guardedGet } from '@/server/routes/route-helpers';
import { buildRevenueAnalyticsSnapshot, demoRevenueChannels } from '@/server/services/admin-revenue-analytics-service';

export async function GET(request: Request) {
  return guardedGet(request, 'view:revenue', async () => ({
    dryRun: true,
    sourceTracking: buildRevenueAnalyticsSnapshot(demoRevenueChannels).channels,
    codexNote: 'Codex must preserve source attribution from normalized external orders through jobs, reports, upsells, revenue analytics, and billing exports.',
  }));
}
