import { PageHeader } from '@/components/ui/page-header';
import { AdminNotesPanel, JobDetailPanel, JobStatusTransitionPanel } from '@/components/jobs';
import { toJobQueueItem } from '@/server/services/admin-job-queue-service';

export default async function AdminJobDetailPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const job = toJobQueueItem({
    id: jobId,
    jobNumber: 'LL-202606-00009',
    title: 'Seeded job detail contract',
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
    createdAt: '2026-06-03T12:00:00.000Z',
  });

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <PageHeader title="Job detail" description="Operational view for status, deadline, notes, revenue/source metadata, upload status, and next fulfillment action." />
      <JobDetailPanel job={job} />
      <JobStatusTransitionPanel />
      <AdminNotesPanel />
    </main>
  );
}
