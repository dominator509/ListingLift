import { imageProviderSelectionRequestSchema, type ImageProviderSelectionRequest } from '@/schemas/image-provider';
import { selectImageProviderForOperations } from '@/server/adapters/image/registry';
import { validateRealProviderRuntime } from '@/server/adapters/image/provider-env';

export function selectImageProvider(input: ImageProviderSelectionRequest) {
  const data = imageProviderSelectionRequestSchema.parse(input);
  const adapter = selectImageProviderForOperations(data.operations, data.preferredProviderKey, data.allowMock);
  const runtimeError = adapter.key === 'mock-image-provider' ? null : validateRealProviderRuntime(adapter.key);
  if (runtimeError && !data.allowManualFallback) {
    throw new Error(runtimeError.message);
  }
  return {
    selectedProviderKey: adapter.key,
    label: adapter.label,
    mode: adapter.mode,
    operations: data.operations,
    supportsAllOperations: data.operations.every((operation) => adapter.supportedOperations.includes(operation)),
    realProviderBlocked: Boolean(runtimeError),
    runtimeError,
    manualFallbackRequired: Boolean(runtimeError),
  };
}
