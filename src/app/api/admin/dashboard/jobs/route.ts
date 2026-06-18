import { adminJobQueueQuerySchema } from '@/schemas/admin-dashboard-analytics';
import { guardedGet } from '@/server/routes/route-helpers';
import { buildAdminJobQueueBuckets, demoAdminDashboardJobs } from '@/server/services/admin-dashboard-summary-service';

export async function GET(request: Request) {
  return guardedGet(request, 'manage:jobs', async () => {
    const query = adminJobQueueQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams.entries()));
    const buckets = buildAdminJobQueueBuckets(demoAdminDashboardJobs, new Date('2026-06-07T12:00:00.000Z'));
    const items = query.group === 'all' ? demoAdminDashboardJobs : buckets[query.group] ?? [];
    return { dryRun: true, query, items, buckets, codexNote: 'Codex must query Job, Client, SalesChannel, QualityFlag, DeliveryArchive, and revenue attribution records by active organization scope.' };
  });
}
