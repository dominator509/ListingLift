import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { listSalesChannelRegistry } from '@/server/adapters/sales-channel/registry';

const rows = listSalesChannelRegistry();

export function SalesChannelRegistryTable() {
  return (
    <Card
      title="Sales-channel registry"
      description="Every order source normalizes into one ListingLift external order and job model. Real integrations remain feature-flagged; manual fallback remains available."
    >
      <DataTable
        rows={rows}
        getRowKey={(row) => row.adapterKey}
        columns={[
          { key: 'channel', header: 'Channel', render: (row) => <div><div className="font-medium text-slate-950">{row.label}</div><div className="text-xs text-slate-500">{row.canonicalChannelKey}</div></div> },
          { key: 'adapter', header: 'Adapter', render: (row) => <code className="rounded bg-slate-100 px-2 py-1 text-xs">{row.adapterKey}</code> },
          { key: 'modes', header: 'Modes', render: (row) => <div className="flex flex-wrap gap-1">{row.supportedModes.map((mode) => <Badge key={mode} tone="blue">{mode}</Badge>)}</div> },
          { key: 'flag', header: 'Feature flag', render: (row) => <code className="text-xs text-slate-600">{row.featureFlag}</code> },
          { key: 'safety', header: 'Safety', render: (row) => <span className="text-xs text-slate-600">{row.marketplaceSafetyRules[0]}</span>, className: 'max-w-sm' },
        ]}
      />
    </Card>
  );
}
