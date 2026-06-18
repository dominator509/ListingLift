import { describe, expect, it } from 'vitest';
import { DEFAULT_PLATFORM_PRESETS, buildPresetFileName, createCustomPresetDraft, deriveAspectRatio, normalizeFolderPath, validatePresetDefinition } from '@/domain/platform-presets';

describe('platform preset domain contract', () => {
  it('keeps unsafe marketplace claims out of seeded presets', () => {
    for (const preset of DEFAULT_PLATFORM_PRESETS) {
      expect(preset.marketplaceSafeClaim).not.toMatch(/guarantee|guaranteed|compliant|approval|ranking|conversion|sales increase/i);
      expect(preset.safeLanguage).toMatch(/seller-review/i);
    }
  });

  it('rejects traversal-style folder paths', () => {
    expect(() => normalizeFolderPath('../Amazon')).toThrow(/traversal/i);
    expect(() => normalizeFolderPath('/absolute/path')).toThrow(/required|relative|absolute|Folder/i);
  });

  it('derives ratios and safe filenames for custom presets', () => {
    expect(deriveAspectRatio(1080, 1920)).toBe('9:16');
    const draft = createCustomPresetDraft({ organizationSlug: 'Demo Org', name: 'Social Story', width: 1080, height: 1920, format: 'JPG', background: 'BRAND_COLOR', folderPath: 'Custom/Stories' });
    expect(validatePresetDefinition(draft)).toEqual([]);
    expect(buildPresetFileName({ preset: draft, sku: 'SKU 123', index: 2 })).toMatch(/sku-123_custom_02\.jpg/i);
  });
});
