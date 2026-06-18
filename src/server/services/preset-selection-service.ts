import { DEFAULT_PLATFORM_PRESETS, listPresetSelectorOptions, type PlatformPreset } from '@/domain/platform-presets';
import { presetSelectionRequestSchema, type PresetSelectionRequest } from '@/schemas/preset';

const socialCommerceTags = new Set(['social-commerce', 'Instagram', 'TikTokShop', 'Pinterest']);

export function resolvePresetSelection(input: PresetSelectionRequest, presets: PlatformPreset[] = DEFAULT_PLATFORM_PRESETS) {
  const request = presetSelectionRequestSchema.parse(input);
  const requestedPlatforms = new Set(request.targetPlatforms.map((platform) => platform.toLowerCase()));
  const selectedKeys = new Set(request.selectedPresetKeys);

  const selected = presets.filter((preset) => {
    if (!preset.active) return false;
    if (selectedKeys.has(preset.key)) return true;
    if (requestedPlatforms.has(preset.platform.toLowerCase()) || requestedPlatforms.has(preset.platformKey.toLowerCase())) return true;
    if (request.includeSocialCommerce && preset.channelTags.some((tag) => socialCommerceTags.has(tag))) return true;
    if (request.includeWhiteJpg && preset.supportsWhiteBackground && preset.format === 'JPG') return true;
    if (request.includeTransparentPng && preset.supportsTransparent && preset.format === 'PNG') return true;
    return false;
  });

  const unique = Array.from(new Map(selected.map((preset) => [preset.key, preset])).values()).sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    selectedPresets: unique,
    selectorOptions: listPresetSelectorOptions(presets),
    folderPaths: unique.map((preset) => preset.folderPath),
    safeLanguage: 'Selected presets create platform-ready drafts. Seller-review recommended before publishing.',
  };
}
