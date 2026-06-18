import { PageHeader } from '@/components/ui/page-header';
import { RevisionRequestPanel, RevisionTimeline } from '@/components/approval';

const events = [{ id: 'client-rev-event-1', label: 'Revision request draft', detail: 'Submit clear product image revision notes. Final files stay hidden until approved and delivered.', createdAt: 'Demo timestamp' }];

export default function ClientJobRevisionsPage({ params }: { params: { jobId: string } }) {
  return <main className="mx-auto max-w-5xl space-y-8 px-6 py-10"><PageHeader eyebrow={`Job ${params.jobId}`} title="Request a revision" description="Use this area to request changes to previewed work. Marketplace approval and sales results are not guaranteed." /><RevisionRequestPanel /><RevisionTimeline events={events} /></main>;
}
