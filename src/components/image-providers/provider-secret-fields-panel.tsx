import type { ImageProviderDefinition } from '@/domain/image-providers';

export function ImageProviderSecretFieldsPanel({ providers }: { providers: ImageProviderDefinition[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Secret handling</h2>
      <p className="mt-2 text-sm text-slate-600">These names identify required secret references. The UI must never display secret values.</p>
      <div className="mt-4 grid gap-3">
        {providers.map((provider) => (
          <div key={provider.key} className="rounded-xl bg-slate-50 p-4 text-sm">
            <p className="font-medium text-slate-950">{provider.label}</p>
            <p className="mt-1 text-slate-600">{provider.secretEnvVars.length ? provider.secretEnvVars.join(', ') : 'No secret required.'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
