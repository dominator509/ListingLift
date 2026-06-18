import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { getApiTokenStatusTone, getScopeTone, type ApiAccessScope } from '@/domain/api-access';

type ApiTokenRow = {
  id: string;
  label: string;
  tokenPrefix: string;
  status: string;
  scopes: string[];
  planKey: string;
  lastUsedAt?: string | null;
};

export function ApiTokenTable({ tokens }: { tokens: ApiTokenRow[] }) {
  const columns: DataTableColumn<ApiTokenRow>[] = [
    { key: 'label', header: 'Token', render: (row) => <div><p className="font-semibold text-slate-950">{row.label}</p><p className="text-xs text-slate-500">Prefix {row.tokenPrefix}; hash redacted</p></div> },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={getApiTokenStatusTone(row.status)}>{row.status}</Badge> },
    { key: 'plan', header: 'Plan', render: (row) => <Badge tone="purple">{row.planKey}</Badge> },
    { key: 'scopes', header: 'Scopes', render: (row) => <div className="flex max-w-lg flex-wrap gap-1">{row.scopes.map((scope) => <Badge key={scope} tone={getScopeTone(scope as ApiAccessScope)}>{scope}</Badge>)}</div> },
    { key: 'lastUsed', header: 'Last used', render: (row) => <span>{row.lastUsedAt ? new Date(row.lastUsedAt).toLocaleString() : 'Never'}</span> },
  ];
  return (
    <Card title="API tokens" description="Tokens must be shown once, stored only as hashes, scoped to the tenant, and gated by active plan entitlements.">
      <DataTable columns={columns} rows={tokens} getRowKey={(row) => row.id} emptyTitle="No API tokens" emptyDescription="Create a scoped token after Codex wires DB persistence, RBAC, plan checks, and audit logs." />
    </Card>
  );
}
