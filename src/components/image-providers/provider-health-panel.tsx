type HealthItem = {
  key: string;
  label: string;
  health: { ok: boolean; message: string | undefined; mode: string; manualFallbackRequired?: boolean; code?: string };
};

export function ImageProviderHealthPanel({ providers }: { providers: HealthItem[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Provider readiness contract</h2>
      <p className="mt-2 text-sm text-slate-600">Mock provider must be healthy by default. Real providers remain blocked until Codex wires encrypted secrets, feature flags, and adapter tests.</p>
      <div className="mt-5 grid gap-3">
        {providers.map((provider) => (
          <div key={provider.key} className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-950">{provider.label}</p>
                <p className="mt-1 text-sm text-slate-600">{provider.health.message}</p>
              </div>
              <span className={provider.health.ok ? 'rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700' : 'rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800'}>
                {provider.health.ok ? 'ready' : provider.health.code ?? 'blocked'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
