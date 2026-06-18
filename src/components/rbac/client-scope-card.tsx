import { Card } from '@/components/ui';

export function ClientScopeCard() {
  return (
    <Card title="Client scope rule" description="Client owners and viewers are locked to their assigned client workspace.">
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
        <li>Server routes must filter by organizationId on every tenant-owned query.</li>
        <li>Client-scoped roles must also filter by clientId.</li>
        <li>Agency admins can manage clients only inside their organization.</li>
        <li>Revenue, billing, delivery, and credit actions require explicit permissions.</li>
      </ul>
    </Card>
  );
}
