import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { listPublicPackages, getPackageDisplayPrice } from '@/server/services/package-service';

type PackageRow = ReturnType<typeof listPublicPackages>[number];

const columns: DataTableColumn<PackageRow>[] = [
  { key: 'package', header: 'Package', render: (row) => <div><p className="font-semibold text-slate-950">{row.shortName}</p><p className="text-xs text-slate-500">{row.category.replaceAll('_', ' ')}</p></div> },
  { key: 'images', header: 'Images', render: (row) => row.imageAllowance ?? 'Custom' },
  { key: 'price', header: 'Price', render: (row) => getPackageDisplayPrice(row) },
  { key: 'revisions', header: 'Revisions', render: (row) => row.revisionAllowance },
  { key: 'checkout', header: 'Checkout', render: (row) => <Badge tone={row.checkoutMode === 'direct_checkout' ? 'green' : 'amber'}>{row.checkoutMode.replaceAll('_', ' ')}</Badge> },
];

export function PackageComparisonTable() {
  return <DataTable columns={columns} rows={listPublicPackages()} getRowKey={(row) => row.key} />;
}
