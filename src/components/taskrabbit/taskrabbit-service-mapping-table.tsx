import { DEFAULT_TASKRABBIT_SERVICE_MAPPINGS } from '@/domain/taskrabbit';

export function TaskrabbitServiceMappingTable() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-950">Service-to-package mapping</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr><th className="p-3">Service</th><th className="p-3">Category</th><th className="p-3">Package</th><th className="p-3">Follow-up</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DEFAULT_TASKRABBIT_SERVICE_MAPPINGS.map((mapping) => (
              <tr key={mapping.key}>
                <td className="p-3 font-medium text-slate-950">{mapping.title}</td>
                <td className="p-3 text-slate-600">{mapping.category}</td>
                <td className="p-3 text-slate-600">{mapping.packageKey}</td>
                <td className="p-3 text-slate-600">{mapping.conversionFollowUpRecommended ? 'Recommended' : 'Optional'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
