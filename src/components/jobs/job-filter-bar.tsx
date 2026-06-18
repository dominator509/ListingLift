import { JOB_STATUSES } from '@/domain/job-status';
import { JOB_PRIORITIES } from '@/domain/job-queue';

export function JobFilterBar() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">Search<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Job, client, source" /></label>
        <label className="text-sm font-medium text-slate-700">Status<select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="">All statuses</option>{JOB_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
        <label className="text-sm font-medium text-slate-700">Priority<select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="">All priorities</option>{JOB_PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></label>
        <label className="text-sm font-medium text-slate-700">Source<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="manual, fiverr, gumroad" /></label>
      </div>
    </div>
  );
}
