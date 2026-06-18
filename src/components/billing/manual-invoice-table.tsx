import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const rows = [
  { invoice: 'LLINV-DEMO-001', status: 'DRAFT', amount: '$99.00', credits: 25 },
  { invoice: 'LLINV-DEMO-002', status: 'PAID', amount: '$249.00', credits: 50 },
];

export function ManualInvoiceTable() {
  return (
    <Card title="Manual invoices" description="Manual payments must never be treated as paid until confirmed by an authorized billing manager.">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Invoice</th><th>Status</th><th>Amount</th><th>Credits</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => <tr key={row.invoice}><td className="py-3 font-medium text-slate-900">{row.invoice}</td><td><Badge tone={row.status === 'PAID' ? 'green' : 'slate'}>{row.status}</Badge></td><td>{row.amount}</td><td>{row.credits}</td></tr>)}
        </tbody>
      </table>
    </Card>
  );
}
