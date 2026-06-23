export interface ZipEntryMetadata {
  path: string;
  sizeBytes: number;
  isDirectory: boolean;
}

export interface UploadFileMetadata {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  relativePath?: string;
  sha256?: string;
  width?: number;
  height?: number;
}

export const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'] as const;
export const allowedArchiveMimeTypes = ['application/zip'] as const;

export const uploadBatchIntakeRequestSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      organizationId: obj.organizationId as string | undefined,
      jobId: obj.jobId as string | undefined,
      files: obj.files as Array<{ fileName: string; mimeType: string; sizeBytes: number }> | undefined,
      source: obj.source as string | undefined,
    };
  },
};

export const uploadTokenIssueSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      organizationId: obj.organizationId as string | undefined,
      jobId: obj.jobId as string | undefined,
      expiresInMinutes: obj.expiresInMinutes as number | undefined,
      maxFileSize: obj.maxFileSize as number | undefined,
      allowedTypes: obj.allowedTypes as string[] | undefined,
      maxFiles: 10,
      allowedMimeTypes: [...allowedImageMimeTypes],
    };
  },
};

export const uploadCompleteRequestSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      token: obj.token as string,
      uploadBatchId: obj.uploadBatchId as string,
      files: obj.files as Array<{ name: string; size: number; type: string; key: string }> | undefined,
    };
  },
};

export const uploadFileMetadataSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return { name: obj.name as string, size: obj.size as number, type: obj.type as string };
  },
};

export const uploadTokenResolveSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return { token: obj.token as string };
  },
};

export const zipInspectionRequestSchema = {
  parse: (input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Input must be an object');
    const obj = input as Record<string, unknown>;
    return {
      archive: obj.archive as { fileName: string; mimeType: string; sizeBytes: number } | undefined,
      entries: obj.entries as Array<{ path: string; sizeBytes: number; isDirectory: boolean }> | undefined,
      zipId: obj.zipId as string | undefined,
    };
  },
};
