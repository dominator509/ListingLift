import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { listDefaultPackages, getPackageDisplayPrice } from '@/server/services/package-service';

type PackageRow = ReturnType<typeof listDefaultPackages>[number];

const columns: DataTableColumn<PackageRow>[] = [
  { key: 'name', header: 'Package', render: (row) => <div><p className="font-semibold text-slate-950">{row.name}</p><p className="text-xs text-slate-500">{row.key}</p></div> },
  { key: 'price', header: 'Price', render: (row) => getPackageDisplayPrice(row) },
  { key: 'allowance', header: 'Allowance', render: (row) => row.imageAllowance ?? 'Custom' },
  { key: 'revisions', header: 'Revisions', render: (row) => row.revisionAllowance },
  { key: 'mode', header: 'Checkout', render: (row) => <Badge tone={row.checkoutMode === 'direct_checkout' ? 'green' : 'amber'}>{row.checkoutMode.replaceAll('_', ' ')}</Badge> },
  { key: 'status', header: 'Status', render: (row) => <Badge tone={row.active ? 'green' : 'slate'}>{row.active ? 'Active' : 'Inactive'}</Badge> },
];

export function AdminPackageTable() {
  return <DataTable columns={columns} rows={listDefaultPackages()} getRowKey={(row) => row.key} />;
}
