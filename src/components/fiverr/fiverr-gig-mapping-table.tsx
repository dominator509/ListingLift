import { DEFAULT_FIVERR_GIG_MAPPINGS } from '@/domain/fiverr';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function FiverrGigMappingTable() {
  return (
    <Card title="Fiverr gig mapping" description="Maps Fiverr gig tiers to ListingLift package records without trusting client-submitted package data.">
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="p-3">Gig tier</th><th className="p-3">Package</th><th className="p-3">Allowance</th><th className="p-3">Delivery</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {DEFAULT_FIVERR_GIG_MAPPINGS.map((mapping) => (
              <tr key={mapping.key}>
                <td className="p-3 font-medium text-slate-900">{mapping.gigTitle}<div className="text-xs text-slate-500">{mapping.key}</div></td>
                <td className="p-3"><Badge tone="blue">{mapping.packageKey}</Badge></td>
                <td className="p-3 text-slate-700">{mapping.imageAllowance} images · {mapping.revisionAllowance} revisions</td>
                <td className="p-3 text-slate-700">{mapping.deliveryMode.replaceAll('_', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
