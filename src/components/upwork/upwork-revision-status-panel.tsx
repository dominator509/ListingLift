import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UpworkRevisionStatusPanel() {
  const statuses = ['NONE', 'REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'READY_FOR_REVIEW', 'DELIVERED', 'CLOSED'];
  return <Card><CardHeader><CardTitle>Revision tracking</CardTitle></CardHeader><CardContent className="flex flex-wrap gap-2">{statuses.map((status) => <span key={status} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{status}</span>)}</CardContent></Card>;
}
