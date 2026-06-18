import { buildPresetOutputPlan, normalizeFolderPath, type PlatformPreset, type PresetOutputPlanInput } from '@/domain/platform-presets';

export function buildDeliveryFolderName(input: { clientName: string; jobId: string }) {
  const safeClient = input.clientName.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'Client';
  const safeJob = input.jobId.trim().replace(/[^a-z0-9_-]+/gi, '-') || 'Job';
  return `ListingLift_Delivery_${safeClient}_${safeJob}`;
}

export function buildPresetFolderManifest(presets: PlatformPreset[]) {
  return presets.map((preset) => ({
    presetKey: preset.key,
    platform: preset.platform,
    folderPath: normalizeFolderPath(preset.folderPath),
    format: preset.format,
    dimensions: `${preset.width}x${preset.height}`,
    background: preset.background,
    safeLanguage: preset.safeLanguage,
  }));
}

export function buildOutputPlansForPresets(input: Omit<PresetOutputPlanInput, 'presetKey'> & { presetKeys: string[] }, presets: PlatformPreset[]) {
  return input.presetKeys.map((presetKey) => buildPresetOutputPlan({ ...input, presetKey }, presets));
}
