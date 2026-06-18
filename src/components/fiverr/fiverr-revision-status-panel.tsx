import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statuses = ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'DELIVERED', 'CLOSED'];

export function FiverrRevisionStatusPanel() {
  return (
    <Card title="Fiverr revision tracking" description="Revision status is recorded manually unless an approved integration exists.">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => <Badge key={status} tone={status === 'CLOSED' ? 'green' : 'amber'}>{status.replaceAll('_', ' ')}</Badge>)}
      </div>
      <p className="mt-4 text-sm text-slate-600">Open Fiverr revisions must block job completion until reviewed, reprocessed if needed, and manually delivered through Fiverr.</p>
    </Card>
  );
}
