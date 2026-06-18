import { JOB_STATUSES } from '@/domain/job-status';
import { Card } from '@/components/ui/card';

export function JobStatusBoard() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {JOB_STATUSES.map((status) => (
        <Card key={status} title={status.replaceAll('_', ' ')}>
          <p className="text-sm text-slate-600">Phase-backed status lane. Data wiring starts after schema and auth phases.</p>
        </Card>
      ))}
    </div>
  );
}
