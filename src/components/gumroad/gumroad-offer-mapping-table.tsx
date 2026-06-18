import { DEFAULT_GUMROAD_OFFER_MAPPINGS } from '@/domain/gumroad';
import { Card } from '@/components/ui/card';

export function GumroadOfferMappingTable() {
  return (
    <Card title="Gumroad product mapping" description="Each Gumroad product must map to a ListingLift package, credit action, or digital-download-only path before automated fulfillment.">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="py-2 pr-4">Offer</th>
              <th className="py-2 pr-4">Package</th>
              <th className="py-2 pr-4">Fulfillment</th>
              <th className="py-2 pr-4">Upload link</th>
              <th className="py-2 pr-4">Credits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DEFAULT_GUMROAD_OFFER_MAPPINGS.map((offer) => (
              <tr key={offer.key}>
                <td className="py-3 pr-4 font-medium text-slate-900">{offer.label}</td>
                <td className="py-3 pr-4 text-slate-600">{offer.packageKey ?? 'No package'}</td>
                <td className="py-3 pr-4 text-slate-600">{offer.fulfillmentKind}</td>
                <td className="py-3 pr-4 text-slate-600">{offer.sendsUploadLink ? 'Planned' : 'No'}</td>
                <td className="py-3 pr-4 text-slate-600">{offer.creditAmount || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
