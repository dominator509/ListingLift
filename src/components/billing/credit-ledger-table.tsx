import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const rows = [
  { type: 'PURCHASE', amount: '+50', reason: 'Payment confirmed', source: 'Stripe/Gumroad/manual' },
  { type: 'JOB_DEBIT', amount: '-10', reason: 'Fulfillment usage', source: 'Job' },
  { type: 'MANUAL_ADJUSTMENT', amount: '+5', reason: 'Goodwill credit', source: 'Admin' },
];

export function CreditLedgerTable() {
  return (
    <Card title="Credit ledger" description="Codex must replace these rows with tenant-scoped CreditLedger data and immutable audit logs.">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Type</th><th>Amount</th><th>Reason</th><th>Source</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => <tr key={row.type}><td className="py-3"><Badge tone={row.amount.startsWith('+') ? 'green' : 'amber'}>{row.type}</Badge></td><td>{row.amount}</td><td>{row.reason}</td><td>{row.source}</td></tr>)}
        </tbody>
      </table>
    </Card>
  );
}
