import { describe, expect, it } from 'vitest';
import { DEFAULT_PLATFORM_PRESETS } from '@/domain/platform-presets';
import { buildDeliveryArchivePlan } from '@/server/services/delivery-packaging-service';

const processedFiles = [
  { id: 'pf1', imageId: 'img1', sourceImageName: '=bad.csv.jpg', presetKey: 'AmazonMainImageDraft', platform: 'Amazon', outputType: 'WHITE_JPG', outputFormat: 'JPG', backgroundType: 'WHITE', fileName: 'white.jpg', folderPath: 'Amazon/white-background', storageKey: 'processed/job/img1/white.jpg', mimeType: 'image/jpeg', width: 2000, height: 2000, status: 'READY_FOR_REVIEW', approvedStatus: 'PENDING', sellerReviewRequired: true },
];

describe('delivery packaging service', () => {
  it('builds a platform-safe archive plan with manifest and readme', () => {
    const plan = buildDeliveryArchivePlan({ organizationId: 'org1', jobId: 'job1', jobNumber: 'JOB-1', clientName: 'Demo Client', selectedPresets: DEFAULT_PLATFORM_PRESETS.slice(0, 2), processedFiles });
    expect(plan.rootFolder).toContain('ListingLift_Delivery_Demo-Client_JOB-1');
    expect(plan.files.some((file) => file.fileName === 'Manifest.csv')).toBe(true);
    expect(plan.files.some((file) => file.fileName === 'ReadMe.txt')).toBe(true);
    expect(plan.manifestCsv).toContain('archive_path,source_image,output_file');
    expect(plan.readmeText).toContain('does not guarantee marketplace approval');
  });
});
