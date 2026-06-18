import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EtsyRevisionStatusPanel() {
  const statuses = ['NONE', 'REQUESTED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'DELIVERED', 'CLOSED'];
  return (
    <Card>
      <CardHeader><CardTitle>Etsy revision tracking</CardTitle></CardHeader>
      <CardContent className="flex flex-wrap gap-2 text-sm text-slate-600">
        {statuses.map((status) => <span key={status} className="rounded-full border px-3 py-1">{status}</span>)}
        <p className="w-full pt-2">Open revisions must block completion and final delivery closure until resolved.</p>
      </CardContent>
    </Card>
  );
}
