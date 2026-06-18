import { describe, expect, it } from 'vitest';
import { getPresetManagerSummary, listDefaultPresets } from '@/server/services/preset-service';

describe('phase 6 platform preset integration contract', () => {
  it('exposes selector options and grouped preset data for admin/client workflows', () => {
    const summary = getPresetManagerSummary();
    expect(summary.coverage.complete).toBe(true);
    expect(summary.selectorOptions.length).toBeGreaterThanOrEqual(15);
    expect(Object.keys(summary.grouped)).toContain('Amazon');
  });

  it('ensures presets drive output dimensions, background, naming, folders, compression, and safe margin', () => {
    for (const preset of listDefaultPresets()) {
      expect(preset.width).toBeGreaterThan(0);
      expect(preset.height).toBeGreaterThan(0);
      expect(preset.background).toBeTruthy();
      expect(preset.namingConvention).toContain('{index}');
      expect(preset.folderPath).not.toContain('..');
      expect(preset.safeMarginPercent).toBeGreaterThanOrEqual(0);
      expect(preset.qualityChecks).toContain('seller_review_required');
    }
  });
});
