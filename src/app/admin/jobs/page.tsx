import { PageHeader } from '@/components/ui/page-header';
import { AdminJobQueueTable, JobFilterBar, JobQueueSummaryCards, ManualJobForm } from '@/components/jobs';
import { toJobQueueItem, summarizeAdminQueue } from '@/server/services/admin-job-queue-service';

const jobs = [
  { id: 'job_demo_1', jobNumber: 'LL-202606-00001', title: 'Marketplace Listing Pack — Ceramic Mugs', clientName: 'Demo Client', packageKey: 'marketplace-listing-pack', sourceChannelName: 'manual', status: 'WAITING_FOR_UPLOAD' as const, priority: 'NORMAL', deadline: '2026-06-07T18:00:00.000Z', imageQuantity: 32, paymentStatus: 'PAID', uploadStatus: 'TOKEN_SENT', fulfillmentStatus: 'NOT_STARTED', createdAt: '2026-06-03T12:00:00.000Z' },
  { id: 'job_demo_2', jobNumber: 'LL-202606-00002', title: 'Product Launch Image Pack — Candle Line', clientName: 'Launch Founder Co.', packageKey: 'product-launch-image-pack', sourceChannelName: 'gumroad', status: 'WAITING_FOR_REVIEW' as const, priority: 'HIGH', deadline: '2026-06-04T18:00:00.000Z', imageQuantity: 74, paymentStatus: 'PAID', uploadStatus: 'COMPLETE', fulfillmentStatus: 'IN_PROGRESS', createdAt: '2026-06-02T12:00:00.000Z' },
  { id: 'job_demo_3', jobNumber: 'LL-202606-00003', title: 'Agency White-Label Batch — Skincare', clientName: 'Agency Workspace', packageKey: 'agency-white-label-image-fulfillment', sourceChannelName: 'manual', status: 'FLAGGED_OUTPUTS' as const, priority: 'URGENT', deadline: '2026-06-03T08:00:00.000Z', imageQuantity: 180, paymentStatus: 'PAID', uploadStatus: 'COMPLETE', fulfillmentStatus: 'IN_PROGRESS', createdAt: '2026-06-01T12:00:00.000Z' },
];

const queueItems = jobs.map((job) => toJobQueueItem(job, '2026-06-03T12:00:00.000Z'));

export default function AdminJobsPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <PageHeader title="Admin job queue" description="Central fulfillment queue for manual jobs, sales-channel orders, upload status, deadlines, and review readiness." />
      <JobQueueSummaryCards summary={summarizeAdminQueue(queueItems)} />
      <JobFilterBar />
      <AdminJobQueueTable jobs={queueItems} />
      <ManualJobForm />
    </main>
  );
}
