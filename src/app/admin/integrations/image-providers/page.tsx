import { DEFAULT_IMAGE_PROVIDER_DEFINITIONS } from '@/domain/image-providers';
import { listImageProviderHealth } from '@/server/adapters/image/registry';
import {
  ImageProviderHealthPanel,
  ImageProviderRegistryTable,
  ImageProviderSecretFieldsPanel,
  ImageProviderSetupPanel,
  ImageProviderTestPanel,
} from '@/components/image-providers';

export default async function ImageProvidersPage() {
  const providerHealth = await listImageProviderHealth() as any;
  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Integrations</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Image provider setup</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Configure mock, manual, and real image-processing providers without exposing secrets or requiring paid APIs for baseline operation.
        </p>
      </div>
      <ImageProviderHealthPanel providers={providerHealth} />
      <ImageProviderSetupPanel providers={DEFAULT_IMAGE_PROVIDER_DEFINITIONS} />
      <ImageProviderRegistryTable providers={DEFAULT_IMAGE_PROVIDER_DEFINITIONS} />
      <ImageProviderSecretFieldsPanel providers={DEFAULT_IMAGE_PROVIDER_DEFINITIONS} />
      <ImageProviderTestPanel />
    </main>
  );
}
