import { DEFAULT_PLATFORM_PRESETS, getPresetCoverageReport, validatePresetDefinition, type PlatformPreset } from '@/domain/platform-presets';
import { platformPresetSchema } from '@/schemas/preset';

export type PresetValidationResult = {
  valid: boolean;
  key: string;
  issues: string[];
};

export function validatePresetForFulfillment(preset: PlatformPreset): PresetValidationResult {
  const schemaResult = platformPresetSchema.safeParse(preset);
  const issues = validatePresetDefinition(preset);
  if (!schemaResult.success) {
    issues.push(...schemaResult.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`));
  }
  return {
    valid: issues.length === 0,
    key: preset.key,
    issues,
  };
}

export function validateDefaultPresetCatalog(presets: PlatformPreset[] = DEFAULT_PLATFORM_PRESETS) {
  const coverage = getPresetCoverageReport();
  const results = presets.map(validatePresetForFulfillment);
  return {
    valid: coverage.complete && results.every((result) => result.valid),
    coverage,
    results,
    invalidPresets: results.filter((result) => !result.valid),
  };
}

export function assertDefaultPresetCatalogIsValid(presets: PlatformPreset[] = DEFAULT_PLATFORM_PRESETS) {
  const result = validateDefaultPresetCatalog(presets);
  if (!result.valid) {
    const issues = [
      ...result.coverage.missing.map((key) => `Missing required preset: ${key}`),
      ...result.invalidPresets.flatMap((preset) => preset.issues.map((issue) => `${preset.key}: ${issue}`)),
    ];
    throw new Error(`Invalid platform preset catalog. ${issues.join(' ')}`);
  }
  return result;
}
