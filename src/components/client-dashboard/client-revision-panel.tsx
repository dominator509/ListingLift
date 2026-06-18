import { Card } from '@/components/ui/card';

export function ClientRevisionPanel() {
  return (
    <Card title="Request a revision" description="Revision requests are scoped to the client and checked against package allowance.">
      <p className="text-sm text-slate-600">Codex must sanitize revision notes, prevent cross-client output IDs, and audit every request.</p>
    </Card>
  );
}
