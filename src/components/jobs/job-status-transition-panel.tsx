import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JOB_STATUSES } from '@/domain/job-status';

export function JobStatusTransitionPanel() {
  return (
    <Card title="Status transition" description="Transitions must be enforced server-side and audited. Delivery-visible statuses require admin approval.">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Next status<select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">{JOB_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
        <label className="text-sm font-medium text-slate-700">Reason<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Required for failed/cancelled/revision" /></label>
        <div className="md:col-span-2"><Button type="button" variant="secondary">Preview transition</Button></div>
      </div>
    </Card>
  );
}
