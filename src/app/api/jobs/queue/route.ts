import { adminJobQueueFilterSchema } from '@/schemas/job';
import { guardedGet } from '@/server/routes/route-helpers';
import { summarizeAdminQueue, toJobQueueItem, sortJobQueue } from '@/server/services/admin-job-queue-service';

const queueSeed = [
  { id: 'queue_1', jobNumber: 'LL-202606-00001', title: 'Marketplace pack — handmade bowls', clientName: 'Demo Client', packageKey: 'marketplace-listing-pack', sourceChannelName: 'etsy', status: 'UPLOAD_RECEIVED' as const, priority: 'HIGH', deadline: '2026-06-04T17:00:00.000Z', imageQuantity: 44, paymentStatus: 'PAID', uploadStatus: 'COMPLETE', fulfillmentStatus: 'NOT_STARTED', createdAt: '2026-06-03T07:00:00.000Z', revenueAttribution: { amount: 199, currency: 'USD' } },
  { id: 'queue_2', jobNumber: 'LL-202606-00002', title: 'Quick cleanup — restaurant menu photos', clientName: 'Local Bistro', packageKey: 'quick-cleanup-pack', sourceChannelName: 'taskrabbit', status: 'WAITING_FOR_UPLOAD' as const, priority: 'NORMAL', deadline: '2026-06-06T17:00:00.000Z', imageQuantity: 10, paymentStatus: 'MANUAL_CONFIRMED', uploadStatus: 'TOKEN_SENT', fulfillmentStatus: 'NOT_STARTED', createdAt: '2026-06-02T07:00:00.000Z', revenueAttribution: { amount: 49, currency: 'USD' } },
  { id: 'queue_3', jobNumber: 'LL-202606-00003', title: 'Agency white-label batch — skincare products', clientName: 'Agency Workspace', packageKey: 'agency-white-label-image-fulfillment', sourceChannelName: 'manual', status: 'WAITING_FOR_REVIEW' as const, priority: 'URGENT', deadline: '2026-06-03T08:00:00.000Z', imageQuantity: 180, paymentStatus: 'PAID', uploadStatus: 'COMPLETE', fulfillmentStatus: 'IN_PROGRESS', createdAt: '2026-06-01T07:00:00.000Z', revenueAttribution: { amount: 1800, currency: 'USD' } },
];

export async function GET(request: Request) {
  return guardedGet(request, 'manage:jobs', async () => {
    const url = new URL(request.url);
    const filters = adminJobQueueFilterSchema.parse({
      status: url.searchParams.getAll('status').length ? url.searchParams.getAll('status') : undefined,
      priority: url.searchParams.getAll('priority').length ? url.searchParams.getAll('priority') : undefined,
      deadlineWarningLevel: url.searchParams.getAll('deadlineWarningLevel').length ? url.searchParams.getAll('deadlineWarningLevel') : undefined,
      search: url.searchParams.get('search') ?? undefined,
      sortBy: url.searchParams.get('sortBy') ?? 'deadline',
      sortDirection: url.searchParams.get('sortDirection') ?? 'asc',
    });
    const items = sortJobQueue(queueSeed.map((job) => toJobQueueItem(job, '2026-06-03T12:00:00.000Z')), filters.sortBy, filters.sortDirection);
    return { summary: summarizeAdminQueue(items), items, filters, persistence: 'dry-run until Prisma-backed queue is wired' };
  });
}
