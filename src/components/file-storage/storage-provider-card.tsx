import type { FileStorageProviderDefinition } from '@/domain/file-storage';

export function StorageProviderCard({ provider }: { provider: FileStorageProviderDefinition }) {
  return (
    <article className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{provider.label}</h3>
          <p className="mt-2 text-sm text-slate-600">{provider.safeDescription}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{provider.key}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {provider.capabilities.map((capability) => <span key={capability} className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">{capability}</span>)}
      </div>
      {provider.secretFields.length > 0 ? <p className="mt-4 text-xs text-amber-700">Requires encrypted secret references: {provider.secretFields.join(', ')}</p> : <p className="mt-4 text-xs text-emerald-700">No provider secrets required.</p>}
    </article>
  );
}
