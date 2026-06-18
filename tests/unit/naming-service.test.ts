import { describe, expect, it } from 'vitest';
import { buildArchiveRelativePath, buildOutputFileName } from '@/server/services/naming-service';

describe('naming service', () => {
  it('creates predictable file names with job and preset context', () => {
    const fileName = buildOutputFileName({ clientName: 'Client', jobId: 'JOB-123', sku: 'Blue Mug 12oz', presetKey: 'AmazonMainImageDraft', outputType: 'WHITE_JPG', index: 7, extension: '.JPG' });
    expect(fileName).toBe('blue-mug-12oz-job-123-007-white_jpg-amazonmainimagedraft.jpg');
  });

  it('rejects unsafe archive paths', () => {
    expect(() => buildArchiveRelativePath({ rootFolder: 'root', folderPath: '../evil', fileName: 'x.jpg' })).toThrow(/Unsafe/);
  });
});
