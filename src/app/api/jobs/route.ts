import { adminJobQueueFilterSchema, manualJobCreateSchema } from '@/schemas/job';
import { guardedGet, guardedPost, parseJson } from '@/server/routes/route-helpers';
import { toJobQueueItem, summarizeAdminQueue, sortJobQueue } from '@/server/services/admin-job-queue-service';
import { assertManualJobCreationSafe, buildManualJobDraft } from '@/server/services/job-creation-service';

const demoJobs = [
  { id: 'job_demo_waiting_upload', jobNumber: 'LL-202606-00001', title: 'Marketplace Listing Pack — Ceramic Mugs', clientName: 'Demo Client', packageKey: 'marketplace-listing-pack', sourceChannelName: 'manual', status: 'WAITING_FOR_UPLOAD' as const, priority: 'NORMAL', deadline: '2026-06-07T18:00:00.000Z', imageQuantity: 32, paymentStatus: 'PAID', uploadStatus: 'TOKEN_SENT', fulfillmentStatus: 'NOT_STARTED', revenueAttribution: { amount: 149, currency: 'USD' }, createdAt: '2026-06-03T12:00:00.000Z' },
  { id: 'job_demo_review', jobNumber: 'LL-202606-00002', title: 'Product Launch Pack — Candle Line', clientName: 'Launch Founder Co.', packageKey: 'product-launch-image-pack', sourceChannelName: 'gumroad', status: 'WAITING_FOR_REVIEW' as const, priority: 'HIGH', deadline: '2026-06-04T18:00:00.000Z', imageQuantity: 74, paymentStatus: 'PAID', uploadStatus: 'COMPLETE', fulfillmentStatus: 'IN_PROGRESS', revenueAttribution: { amount: 599, currency: 'USD' }, createdAt: '2026-06-02T12:00:00.000Z' },
];

export async function GET(request: Request) {
  return guardedGet(request, 'manage:jobs', async () => {
    const url = new URL(request.url);
    const status = url.searchParams.getAll('status');
    const priority = url.searchParams.getAll('priority');
    const sourceChannelName = url.searchParams.getAll('source');
    const search = url.searchParams.get('search') ?? undefined;
    const filters = adminJobQueueFilterSchema.parse({
      status: status.length ? status : undefined,
      priority: priority.length ? priority : undefined,
      sourceChannelName: sourceChannelName.length ? sourceChannelName : undefined,
      search,
      sortBy: url.searchParams.get('sortBy') ?? 'deadline',
      sortDirection: url.searchParams.get('sortDirection') ?? 'asc',
    });
    const items = sortJobQueue(demoJobs.map((job) => toJobQueueItem(job, '2026-06-03T12:00:00.000Z')), filters.sortBy, filters.sortDirection);
    return { items, summary: summarizeAdminQueue(items), filters, persistence: 'dry-run until Codex wires Prisma transactions' };
  });
}

export async function POST(request: Request) {
  return guardedPost(request, 'create:manual-orders', async (session) => {
    const body = await parseJson<unknown>(request, {});
    const input = manualJobCreateSchema.parse(body);
    assertManualJobCreationSafe(input);
    const draft = buildManualJobDraft(input, { organizationSlug: session.organizationId, existingJobCount: demoJobs.length, now: new Date() });
    return { draft, persistence: 'dry-run until Codex creates Client/Job/ExternalOrder rows transactionally' };
  });
}
