import { adminRevenueAnalyticsRequestSchema } from '@/schemas/admin-dashboard-analytics';
import { guardedGet } from '@/server/routes/route-helpers';
import { buildRevenueAnalyticsSnapshot, demoRevenueChannels } from '@/server/services/admin-revenue-analytics-service';

export async function GET(request: Request) {
  return guardedGet(request, 'view:revenue', async () => {
    const query = adminRevenueAnalyticsRequestSchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const channels = query.channelKey ? demoRevenueChannels.filter((channel) => channel.channelKey === query.channelKey) : demoRevenueChannels;
    return { dryRun: true, query, revenue: buildRevenueAnalyticsSnapshot(channels, query.currency), codexNote: 'Codex must derive analytics from verified Stripe, Gumroad, manual invoice, external order, refund, credit, subscription, and job records.' };
  });
}
