import type { ProcessingOutputDraft } from '@/domain/image-processing';

export type SharpTransformPlan = {
  inputStorageKey: string;
  outputStorageKey: string;
  steps: string[];
  width?: number | null;
  height?: number | null;
  mimeType: string;
  preservesOriginal: true;
};

export function buildSharpTransformPlan(output: ProcessingOutputDraft): SharpTransformPlan {
  const steps = ['read-original'];
  if (output.operations.includes('remove-background')) steps.push('background-removal-provider-result');
  if (output.backgroundType === 'WHITE') steps.push('compose-white-background');
  if (output.backgroundType === 'TRANSPARENT') steps.push('preserve-alpha-channel');
  if (output.width && output.height) steps.push(`resize-${output.width}x${output.height}`);
  if (output.outputFormat === 'WEBP') steps.push('encode-webp');
  if (output.outputFormat === 'JPG') steps.push('encode-jpg');
  if (output.outputFormat === 'PNG') steps.push('encode-png');
  steps.push('compress-output', 'write-new-processed-file');
  return {
    inputStorageKey: output.sourceStorageKey,
    outputStorageKey: output.storageKey,
    steps,
    width: output.width,
    height: output.height,
    mimeType: output.mimeType,
    preservesOriginal: true,
  };
}

export function assertTransformDoesNotOverwriteOriginal(plan: SharpTransformPlan) {
  if (plan.inputStorageKey === plan.outputStorageKey) throw new Error('Transform plan would overwrite original upload.');
  return true;
}
