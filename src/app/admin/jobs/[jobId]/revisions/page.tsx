import { PageHeader } from '@/components/ui/page-header';
import { ManualReplacementMarkerPanel, RevisionRequestPanel, RevisionTimeline } from '@/components/approval';

const events = [{ id: 'rev-event-1', label: 'Revision requested', detail: 'Client asked for cleaner edges on main white-background image.', createdAt: 'Demo timestamp' }];

export default function AdminJobRevisionsPage({ params }: { params: { jobId: string } }) {
  return <main className="mx-auto max-w-7xl space-y-8 px-6 py-10"><PageHeader eyebrow={`Job ${params.jobId}`} title="Revision workflow" description="Track revision requests, reprocessing, manual replacements, and resolution before final approval." /><RevisionRequestPanel /><ManualReplacementMarkerPanel /><RevisionTimeline events={events} /></main>;
}
