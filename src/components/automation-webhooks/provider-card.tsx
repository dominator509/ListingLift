import type { AutomationProviderDefinition } from '@/domain/automation-webhooks';

export function AutomationProviderCard({ provider }: { provider: AutomationProviderDefinition }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">{provider.label}</h3>
          <p className="mt-1 text-sm text-slate-600">{provider.safeDescription}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{provider.key}</span>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-600">
        <div><dt className="font-medium text-slate-900">Feature flag</dt><dd>{provider.enabledEnvVar}</dd></div>
        <div><dt className="font-medium text-slate-900">Actions</dt><dd>{provider.supportedActions.join(', ')}</dd></div>
        <div><dt className="font-medium text-slate-900">Secrets</dt><dd>{provider.secretFields.length ? provider.secretFields.join(', ') : 'None'}</dd></div>
      </dl>
    </article>
  );
}
