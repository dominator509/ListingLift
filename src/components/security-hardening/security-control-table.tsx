import type { SecurityControlChecklistItem } from '@/domain/security-hardening';

export function SecurityControlTable({ controls }: { controls: Array<SecurityControlChecklistItem & { productionVerified?: boolean }> }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-950">Security hardening control map</h2>
        <p className="mt-1 text-sm text-slate-600">Every row must become runtime-enforced and tested by Codex before production deployment.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Control</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Acceptance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {controls.map((control) => (
              <tr key={control.key}>
                <td className="px-4 py-3 align-top font-medium text-slate-950">{control.title}<p className="mt-1 text-xs font-normal text-slate-500">{control.surface}</p></td>
                <td className="px-4 py-3 align-top text-slate-700">{control.area}</td>
                <td className="px-4 py-3 align-top text-slate-700">{control.riskLevel}</td>
                <td className="px-4 py-3 align-top text-slate-700">{control.status}</td>
                <td className="max-w-xl px-4 py-3 align-top text-slate-600">{control.acceptance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
