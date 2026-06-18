import type { ImageProviderDefinition } from '@/domain/image-providers';

export function ImageProviderRegistryTable({ providers }: { providers: ImageProviderDefinition[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Provider</th>
            <th className="px-4 py-3">Mode</th>
            <th className="px-4 py-3">Feature flags</th>
            <th className="px-4 py-3">Secrets</th>
            <th className="px-4 py-3">Fallback</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {providers.map((provider) => (
            <tr key={provider.key}>
              <td className="px-4 py-3">
                <div className="font-medium text-slate-950">{provider.label}</div>
                <div className="text-xs text-slate-500">{provider.key}</div>
              </td>
              <td className="px-4 py-3 text-slate-700">{provider.defaultMode}</td>
              <td className="px-4 py-3 text-slate-700">
                <code>{provider.enabledFeatureFlag}</code>
                {provider.realCallsFeatureFlag ? <><br /><code>{provider.realCallsFeatureFlag}</code></> : null}
              </td>
              <td className="px-4 py-3 text-slate-700">{provider.secretEnvVars.length ? provider.secretEnvVars.join(', ') : 'None'}</td>
              <td className="px-4 py-3 text-slate-700">{provider.manualFallbackRequiredWhenDisabled ? 'Manual fallback required' : 'Baseline provider'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
