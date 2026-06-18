import { Card } from '@/components/ui/card';
import { JobStatusBadge } from '@/components/workflow/job-status-badge';
import { DeadlineWarningBadge } from '@/components/jobs/deadline-warning-badge';
import { JobPriorityBadge } from '@/components/jobs/job-priority-badge';
import type { JobQueueItem } from '@/schemas/job';

export function JobDetailPanel({ job }: { job: JobQueueItem }) {
  return (
    <Card title={job.title} description={`Job ${job.jobNumber ?? job.id}`}>
      <dl className="grid gap-4 md:grid-cols-3">
        <div><dt className="text-xs uppercase text-slate-500">Status</dt><dd className="mt-1"><JobStatusBadge status={job.status} /></dd></div>
        <div><dt className="text-xs uppercase text-slate-500">Priority</dt><dd className="mt-1"><JobPriorityBadge priority={job.priority} /></dd></div>
        <div><dt className="text-xs uppercase text-slate-500">Deadline</dt><dd className="mt-1 flex items-center gap-2 text-sm text-slate-700">{job.deadline ? new Date(job.deadline).toLocaleString() : 'No deadline'} <DeadlineWarningBadge level={job.deadlineWarningLevel} /></dd></div>
        <div><dt className="text-xs uppercase text-slate-500">Client</dt><dd className="mt-1 text-sm text-slate-700">{job.clientName ?? 'Unassigned'}</dd></div>
        <div><dt className="text-xs uppercase text-slate-500">Package</dt><dd className="mt-1 text-sm text-slate-700">{job.packageKey ?? 'Not set'}</dd></div>
        <div><dt className="text-xs uppercase text-slate-500">Images</dt><dd className="mt-1 text-sm text-slate-700">{job.imageQuantity}</dd></div>
      </dl>
    </Card>
  );
}
