import { DEFAULT_PLATFORM_PRESETS } from '@/domain/platform-presets';
import { buildDeliveryArchivePlan } from '@/server/services/delivery-packaging-service';
import { DeliveryFolderTree } from './folder-tree';
import { ManifestPreviewTable } from './manifest-preview-table';
import { ZipArchiveSummary } from './zip-archive-summary';
import { DeliveryPackageChecklist } from './delivery-package-checklist';
import { FileNamingPreview } from './file-naming-preview';

const demoPlan = buildDeliveryArchivePlan({
  organizationId: 'demo-org',
  jobId: 'job_demo_001',
  jobNumber: 'JOB-123',
  clientName: 'Demo Store',
  selectedPresets: DEFAULT_PLATFORM_PRESETS.slice(0, 5),
  processedFiles: [
    { id: 'pf_1', imageId: 'img_1', sourceImageName: 'blue-mug.jpg', presetKey: 'AmazonMainImageDraft', platform: 'Amazon', outputType: 'WHITE_JPG', outputFormat: 'JPG', backgroundType: 'WHITE', fileName: 'blue-mug-job-123-001-amazon-main.jpg', folderPath: 'Amazon/white-background', storageKey: 'processed/JOB-123/img_1/amazon-main.jpg', mimeType: 'image/jpeg', width: 2000, height: 2000, status: 'READY_FOR_REVIEW', approvedStatus: 'PENDING', sellerReviewRequired: true },
    { id: 'pf_2', imageId: 'img_1', sourceImageName: 'blue-mug.jpg', presetKey: 'TransparentPNG', platform: 'Transparent PNG', outputType: 'TRANSPARENT_PNG', outputFormat: 'PNG', backgroundType: 'TRANSPARENT', fileName: 'blue-mug-job-123-001-transparent.png', folderPath: 'Transparent-PNG', storageKey: 'processed/JOB-123/img_1/transparent.png', mimeType: 'image/png', width: 2000, height: 2000, status: 'READY_FOR_REVIEW', approvedStatus: 'PENDING', sellerReviewRequired: true },
  ],
});

export function DeliveryArchivePanel() {
  return (
    <div className="space-y-6">
      <ZipArchiveSummary fileCount={demoPlan.fileCount} outputCount={demoPlan.outputCount} missingCount={demoPlan.missingCount} zipFileName={demoPlan.zipFileName} />
      <DeliveryPackageChecklist />
      <FileNamingPreview />
      <DeliveryFolderTree rootFolder={demoPlan.rootFolder} folders={demoPlan.folders} />
      <ManifestPreviewTable files={demoPlan.files} />
    </div>
  );
}
