import { Card } from '@/components/ui/card';
import { JobStatusBadge } from '@/components/workflow/job-status-badge';
import { SourceChannelBadge } from '@/components/workflow/source-channel-badge';
import { DeadlineWarningBadge } from '@/components/jobs/deadline-warning-badge';
import { JobPriorityBadge } from '@/components/jobs/job-priority-badge';
import type { JobQueueItem } from '@/schemas/job';

export function AdminJobQueueTable({ jobs }: { jobs: JobQueueItem[] }) {
  return (
    <Card title="Fulfillment queue" description="Jobs are sorted by deadline, priority, and active fulfillment status.">
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Images</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-4 py-3">
                  <a href={`/admin/jobs/${job.id}`} className="font-semibold text-slate-950 hover:text-blue-700">{job.jobNumber ?? job.id}</a>
                  <div className="text-xs text-slate-500">{job.title}</div>
                </td>
                <td className="px-4 py-3 text-slate-700">{job.clientName ?? 'Unassigned'}</td>
                <td className="px-4 py-3"><SourceChannelBadge channelKey={job.sourceChannelName ?? 'manual'} /></td>
                <td className="px-4 py-3"><JobStatusBadge status={job.status} /></td>
                <td className="px-4 py-3"><JobPriorityBadge priority={job.priority} /></td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="text-slate-700">{job.deadline ? new Date(job.deadline).toLocaleString() : 'No deadline'}</div>
                    <DeadlineWarningBadge level={job.deadlineWarningLevel} />
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700">{job.imageQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
