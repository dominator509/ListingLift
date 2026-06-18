import { describe, expect, it } from 'vitest';
import { buildReportDraft } from '../../src/server/services/report-builder-service';

describe('buildReportDraft', () => {
  it('includes safe report disclaimers', () => {
    const report = buildReportDraft({
      organizationId: 'org_1',
      reportType: 'IMAGE_QUALITY',
      audience: 'CLIENT',
      metrics: [{ kind: 'IMAGE_COUNT', label: 'Images', numericValue: 25 }],
    });
    expect(report.body).toContain('does not guarantee approval');
    expect(report.unsafeMatches).toEqual([]);
  });
});
