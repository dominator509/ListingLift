import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEFAULT_PACKAGES } from '@/domain/packages';
import { getStripeCheckoutMode } from '@/domain/stripe-billing';

export function StripeCheckoutMappingTable() {
  return (
    <Card title="Package to Stripe checkout mapping" description="Prices are resolved server-side from package records; client-submitted prices are ignored.">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Package</th><th>Mode</th><th>Range</th><th>Safe claim</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {DEFAULT_PACKAGES.map((pkg) => (
              <tr key={pkg.key}>
                <td className="py-3 font-medium text-slate-900">{pkg.name}</td>
                <td><Badge tone={pkg.billingInterval === 'month' ? 'purple' : 'blue'}>{getStripeCheckoutMode(pkg.billingInterval === 'month' || pkg.category === 'agency' ? 'SUBSCRIPTION' : 'PACKAGE')}</Badge></td>
                <td>${((pkg.priceMinCents ?? 0) / 100).toLocaleString()}–${((pkg.priceMaxCents ?? pkg.priceMinCents ?? 0) / 100).toLocaleString()}</td>
                <td className="max-w-sm text-xs text-slate-500">Seller review recommended. No marketplace approval or sales guarantee.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
