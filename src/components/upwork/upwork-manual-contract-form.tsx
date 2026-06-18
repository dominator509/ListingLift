import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UpworkManualContractForm() {
  return (
    <Card>
      <CardHeader><CardTitle>Manual Upwork contract intake</CardTitle></CardHeader>
      <CardContent className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        {['Contract ID', 'Client name', 'Contract title', 'Contract type', 'Milestone', 'Due date', 'Billed amount', 'Package mapping'].map((field) => (
          <label key={field} className="grid gap-1">
            <span className="font-medium text-slate-800">{field}</span>
            <input className="rounded-md border border-slate-200 px-3 py-2" placeholder={field} readOnly />
          </label>
        ))}
        <p className="md:col-span-2 text-xs text-slate-500">Seed UI only. Codex must wire this to `/api/upwork/manual-contract` with auth, RBAC, tenant isolation, and audit logging.</p>
      </CardContent>
    </Card>
  );
}
