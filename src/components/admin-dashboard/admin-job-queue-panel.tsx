import { Card } from '@/components/ui/card';
import { formatAdminMoneyFromCents, type AdminJobQueueItem } from '@/domain/admin-dashboard-analytics';

export function AdminJobQueuePanel({ title, jobs }: { title: string; jobs: AdminJobQueueItem[] }) {
  return (
    <Card title={title} description="Server-side queue grouping must come from tenant-scoped jobs, QC flags, deadlines, and delivery state.">
      <div className="space-y-3">
        {jobs.length ? jobs.map((job) => (
          <div key={job.jobId} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">{job.jobNumber ?? job.jobId} · {job.title}</p>
                <p className="mt-1 text-sm text-slate-600">{job.clientName ?? 'Unassigned client'} · {job.sourceChannelName ?? 'Manual source'} · {job.status.replaceAll('_', ' ')}</p>
              </div>
              <p className="text-sm font-semibold text-slate-700">{formatAdminMoneyFromCents(job.revenueCents ?? 0)}</p>
            </div>
            {job.deadline ? <p className="mt-2 text-xs text-slate-500">Deadline: {String(job.deadline)}</p> : null}
            {(job.blockingQualityFlags ?? 0) > 0 ? <p className="mt-2 text-xs font-semibold text-red-700">Blocking QC flags: {job.blockingQualityFlags}</p> : null}
          </div>
        )) : <p className="text-sm text-slate-600">No jobs in this seeded bucket.</p>}
      </div>
    </Card>
  );
}
