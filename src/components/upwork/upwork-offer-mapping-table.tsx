import { DEFAULT_UPWORK_OFFER_MAPPINGS } from '@/domain/upwork';

export function UpworkOfferMappingTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Offer</th><th>Type</th><th>Package</th><th>Images</th><th>Retainer prompt</th></tr></thead>
        <tbody>
          {DEFAULT_UPWORK_OFFER_MAPPINGS.map((mapping) => (
            <tr key={mapping.key} className="border-t border-slate-100">
              <td className="p-3 font-medium text-slate-900">{mapping.title}</td>
              <td>{mapping.contractType}</td>
              <td>{mapping.packageKey}</td>
              <td>{mapping.imageAllowance}</td>
              <td>{mapping.retainerReminderEnabled ? 'Enabled' : 'Off'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
