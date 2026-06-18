import {
  DEFAULT_PLATFORM_PRESETS,
  buildPresetOutputPlan,
  createCustomPresetDraft,
  findDefaultPreset,
  getPresetCoverageReport,
  groupPresetsByPlatform,
  listPresetSelectorOptions,
  listPresetsForPlatform,
  type PlatformPreset,
  type PresetOutputPlanInput,
} from '@/domain/platform-presets';
import { customPresetDraftSchema, platformPresetAdminUpdateSchema, platformPresetSchema, presetSelectionRequestSchema, type CustomPresetDraftInput, type PlatformPresetAdminUpdateInput } from '@/schemas/preset';
import { validateDefaultPresetCatalog, validatePresetForFulfillment } from './preset-validation-service';
import { resolvePresetSelection } from './preset-selection-service';

export function listDefaultPresets(options: { activeOnly?: boolean; platform?: string } = {}) {
  const presets = DEFAULT_PLATFORM_PRESETS.map((preset) => platformPresetSchema.parse(preset)).sort((a, b) => a.sortOrder - b.sortOrder);
  return presets.filter((preset) => {
    if (options.activeOnly && !preset.active) return false;
    if (options.platform && preset.platform.toLowerCase() !== options.platform.toLowerCase() && preset.platformKey.toLowerCase() !== options.platform.toLowerCase()) return false;
    return true;
  });
}

export function presetsForPlatforms(platforms: string[]) {
  const normalized = platforms.map((platform) => platform.toLowerCase());
  return listDefaultPresets({ activeOnly: true }).filter(
    (preset) => normalized.includes(preset.platform.toLowerCase()) || normalized.includes(preset.platformKey.toLowerCase()) || preset.channelTags.some((tag) => normalized.includes(tag.toLowerCase())),
  );
}

export function getPresetByKey(key: string) {
  const found = findDefaultPreset(key);
  return found ? platformPresetSchema.parse(found) : null;
}

export function requirePresetByKey(key: string) {
  const preset = getPresetByKey(key);
  if (!preset) throw new Error(`Unknown preset: ${key}`);
  return preset;
}

export function getPresetManagerSummary() {
  const presets = listDefaultPresets();
  return {
    coverage: getPresetCoverageReport(),
    validation: validateDefaultPresetCatalog(presets as PlatformPreset[]),
    grouped: groupPresetsByPlatform(presets as PlatformPreset[]),
    selectorOptions: listPresetSelectorOptions(presets as PlatformPreset[]),
  };
}

export function buildPresetAdminDraft(input: PlatformPresetAdminUpdateInput) {
  const update = platformPresetAdminUpdateSchema.parse(input);
  return {
    ...update,
    auditAction: 'platform_preset.update.requested',
    auditReason: update.changeReason,
    requiresPermission: 'manage:presets',
  };
}

export function buildCustomPresetDraft(input: CustomPresetDraftInput) {
  const parsed = customPresetDraftSchema.parse(input);
  const draft = createCustomPresetDraft(parsed);
  return {
    ...draft,
    auditAction: 'platform_preset.custom.create.requested',
    auditReason: parsed.changeReason,
    requiresPermission: 'manage:presets',
  };
}

export function buildPresetSelector(input: unknown) {
  return resolvePresetSelection(presetSelectionRequestSchema.parse(input), listDefaultPresets({ activeOnly: true }) as PlatformPreset[]);
}

export function buildPresetPlan(input: PresetOutputPlanInput) {
  return buildPresetOutputPlan(input, listDefaultPresets({ activeOnly: true }) as PlatformPreset[]);
}

export function validatePresetCatalogForAdmin() {
  return validateDefaultPresetCatalog(listDefaultPresets() as PlatformPreset[]);
}

export function validatePresetKeyForAdmin(key: string) {
  return validatePresetForFulfillment(requirePresetByKey(key) as PlatformPreset);
}

export { listPresetSelectorOptions, listPresetsForPlatform };
