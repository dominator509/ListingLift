import { guardedGet } from '@/server/routes/route-helpers';
import { toJobQueueItem } from '@/server/services/admin-job-queue-service';
import { computeETag, handleConditionalGet } from '@/server/services/etag-service';

export async function GET(request: Request, context: { params: Promise<{ jobId: string }> }) {
  return guardedGet(request, 'manage:jobs', async () => {
    const { jobId } = await context.params;
    const body = {
      item: toJobQueueItem({
        id: jobId,
        jobNumber: 'LL-202606-00009',
        title: 'Job detail contract — pending Prisma wiring',
        clientName: 'Demo Client',
        packageKey: 'marketplace-listing-pack',
        sourceChannelName: 'manual',
        status: 'WAITING_FOR_UPLOAD',
        priority: 'NORMAL',
        deadline: '2026-06-07T18:00:00.000Z',
        imageQuantity: 25,
        paymentStatus: 'PENDING',
        uploadStatus: 'TOKEN_SENT',
        fulfillmentStatus: 'NOT_STARTED',
        revenueAttribution: { amount: 149, currency: 'USD' },
        createdAt: '2026-06-03T12:00:00.000Z',
      }),
      persistence: 'dry-run until Codex queries tenant-scoped Job by id',
    };

    const etag = computeETag(body);
    const notModified = handleConditionalGet(request, etag);
    if (notModified) return notModified;

    return Response.json(body, { headers: etag ? { ETag: etag, 'Cache-Control': 'private, max-age=30' } : {} });
  });
}
