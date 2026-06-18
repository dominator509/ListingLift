import type { DeliveryArchiveFilePlan, DeliveryArchivePlan } from '@/domain/delivery-packaging';

export type DeliveryArchiveRecordDraft = {
  organizationId: string;
  jobId: string;
  status: string;
  rootFolder: string;
  zipFileName: string;
  zipStorageKey: string;
  manifestStorageKey: string;
  readmeStorageKey: string;
  fileCount: number;
  outputCount: number;
  missingCount: number;
  sellerReviewRequired: boolean;
  approvedOnly: boolean;
  metadata: Record<string, unknown>;
};

export type DeliveryArchiveFileRecordDraft = {
  organizationId: string;
  jobId: string;
  archiveId?: string | null;
  processedFileId?: string | null;
  sourceImageId?: string | null;
  kind: string;
  archivePath: string;
  folderPath: string;
  fileName: string;
  storageKey?: string | null;
  mimeType: string;
  format: string;
  status: string;
  sellerReviewRequired: boolean;
  metadata: Record<string, unknown>;
};

export function buildDeliveryArchiveRecordDraft(plan: DeliveryArchivePlan): DeliveryArchiveRecordDraft {
  return {
    organizationId: plan.organizationId,
    jobId: plan.jobId,
    status: plan.status,
    rootFolder: plan.rootFolder,
    zipFileName: plan.zipFileName,
    zipStorageKey: plan.zipStorageKey,
    manifestStorageKey: `${plan.zipStorageKey.replace(/\.zip$/, '')}/Manifest.csv`,
    readmeStorageKey: `${plan.zipStorageKey.replace(/\.zip$/, '')}/ReadMe.txt`,
    fileCount: plan.fileCount,
    outputCount: plan.outputCount,
    missingCount: plan.missingCount,
    sellerReviewRequired: plan.sellerReviewRequired,
    approvedOnly: true,
    metadata: plan.metadata,
  };
}

export function buildDeliveryArchiveFileRecordDraft(plan: DeliveryArchivePlan, file: DeliveryArchiveFilePlan): DeliveryArchiveFileRecordDraft {
  return {
    organizationId: plan.organizationId,
    jobId: plan.jobId,
    processedFileId: file.processedFileId ?? null,
    sourceImageId: file.sourceImageId ?? null,
    kind: file.kind,
    archivePath: file.archivePath,
    folderPath: file.folderPath,
    fileName: file.fileName,
    storageKey: file.storageKey ?? null,
    mimeType: file.mimeType,
    format: file.format,
    status: file.status,
    sellerReviewRequired: file.sellerReviewRequired,
    metadata: {
      presetKey: file.presetKey ?? null,
      platform: file.platform ?? null,
      width: file.width ?? null,
      height: file.height ?? null,
      outputType: file.outputType ?? null,
      backgroundType: file.backgroundType ?? null,
      notes: file.notes ?? null,
    },
  };
}

export function buildDeliveryArchivePersistenceDraft(plan: DeliveryArchivePlan) {
  return {
    archive: buildDeliveryArchiveRecordDraft(plan),
    files: plan.files.map((file) => buildDeliveryArchiveFileRecordDraft(plan, file)),
  };
}
