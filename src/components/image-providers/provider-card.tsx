import { Card } from '@/components/ui/card';
import type { ImageProviderDefinition } from '@/domain/image-providers';

export function ImageProviderCard({ provider }: { provider: ImageProviderDefinition }) {
  return (
    <Card
      title={provider.label}
      description={provider.description}
      footer={<p className="text-xs text-slate-500">Feature flag: <code>{provider.enabledFeatureFlag}</code></p>}
    >
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{provider.category}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{provider.defaultMode}</span>
          {provider.realProvider ? <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">real calls gated</span> : null}
        </div>
        <div>
          <p className="font-medium text-slate-900">Capabilities</p>
          <p className="mt-1 text-slate-600">{provider.capabilities.join(', ')}</p>
        </div>
        <div>
          <p className="font-medium text-slate-900">Secrets</p>
          <p className="mt-1 text-slate-600">{provider.secretEnvVars.length ? provider.secretEnvVars.join(', ') : 'No provider secrets required.'}</p>
        </div>
      </div>
    </Card>
  );
}
