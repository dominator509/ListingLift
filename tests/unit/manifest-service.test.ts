import { describe, expect, it } from 'vitest';
import { buildManifestCsv } from '@/server/services/manifest-service';

describe('manifest service', () => {
  it('neutralizes CSV formula cells', () => {
    const csv = buildManifestCsv([{ archivePath: '=cmd', sourceImage: '+bad', outputFile: 'out.jpg', platform: 'Amazon', folderPath: 'Amazon/white-background', format: 'JPG', status: 'included', sellerReviewRequired: true }]);
    expect(csv).toContain("'=");
    expect(csv).toContain("'+bad");
  });
});
