import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';

const demoRows = [
  { id: 'DEMO-DIRECT-ORDER-001', channel: 'Direct', buyer: 'Demo Seller', packageKey: 'MarketplaceListing25', payment: 'MANUAL_CONFIRMED', status: 'NOT_STARTED' },
  { id: 'pending-import-example', channel: 'Fiverr', buyer: 'buyer_username', packageKey: 'MarketplaceListing25', payment: 'PAID', status: 'WAITING_FOR_UPLOAD' },
];

export default function AdminExternalOrdersPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-10">
      <PageHeader
        eyebrow="Phase 7"
        title="External Orders"
        description="Imported sales-channel orders appear here after normalization and before or after they create ListingLift jobs."
      />
      <Card title="Normalization contract" description="Codex must replace demo rows with tenant-scoped Prisma data, filters, pagination, duplicate status, and audit history.">
        <DataTable
          rows={demoRows}
          getRowKey={(row) => row.id}
          columns={[
            { key: 'id', header: 'External order', render: (row) => <code className="text-xs">{row.id}</code> },
            { key: 'channel', header: 'Channel', render: (row) => row.channel },
            { key: 'buyer', header: 'Buyer', render: (row) => row.buyer },
            { key: 'package', header: 'Package', render: (row) => row.packageKey },
            { key: 'payment', header: 'Payment', render: (row) => row.payment },
            { key: 'status', header: 'Fulfillment', render: (row) => row.status },
          ]}
        />
      </Card>
    </main>
  );
}
