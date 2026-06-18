import type { ImageProviderDefinition } from '@/domain/image-providers';

export function ImageProviderSetupPanel({ providers }: { providers: ImageProviderDefinition[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Setup sequence</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-700">
        <li>Keep <code>MOCK_IMAGE_PROVIDER_ENABLED=true</code> so baseline processing can be tested without paid APIs.</li>
        <li>Store real provider API keys only as encrypted secret records; never in frontend config, logs, seed data, or plain JSON.</li>
        <li>Enable provider-specific flags and <code>REAL_IMAGE_PROVIDER_CALLS_ENABLED=true</code> only after adapter-contract and security tests pass.</li>
        <li>Run provider health checks and keep manual fallback available for every paid/client-facing fulfillment path.</li>
      </ol>
      <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
        Configurable providers: {providers.map((provider) => provider.label).join(', ')}.
      </div>
    </section>
  );
}
