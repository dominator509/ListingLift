import type { AdapterDefinition } from '../adapter-types';
import type { z } from 'zod';
import type { ImageProviderKey, ImageProviderOperation, ImageProviderRuntimeMode } from '@/domain/image-providers';

export type ImageProviderErrorCode =
  | 'provider_disabled'
  | 'real_calls_disabled'
  | 'missing_secret'
  | 'rate_limited'
  | 'timeout'
  | 'unsupported_operation'
  | 'invalid_input'
  | 'upstream_error'
  | 'unsafe_request'
  | 'unknown';

export type ImageProviderError = {
  providerKey: string;
  code: ImageProviderErrorCode;
  message: string;
  retryable: boolean;
  manualFallbackRequired: boolean;
  safeDetails?: Record<string, unknown>;
};

export type ImageProcessingRequest = {
  organizationId?: string;
  jobId?: string;
  imageId?: string;
  correlationId?: string;
  inputStorageKey: string;
  outputBaseKey: string;
  operations: ImageProviderOperation[];
  presetKey?: string;
  sourceMimeType?: string;
  sourceFileName?: string;
  config?: Record<string, unknown>;
  secretRefs?: Record<string, string>;
  dryRun?: boolean;
};

export type ImageProviderOutputFile = {
  outputStorageKey: string;
  width?: number;
  height?: number;
  mimeType: string;
  outputKind: string;
  sizeBytes?: number;
  metadata?: Record<string, unknown>;
};

export type ImageProcessingResult = {
  ok: boolean;
  providerKey: string;
  outputStorageKey?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  outputFiles?: ImageProviderOutputFile[];
  error?: string;
  normalizedError?: ImageProviderError;
  manualFallbackRequired?: boolean;
  metadata?: Record<string, unknown>;
};

export type ImageProviderHealthResult = {
  ok: boolean;
  provider: string;
  mode: ImageProviderRuntimeMode;
  message: string;
  code?: ImageProviderErrorCode;
  checkedAt?: string;
  manualFallbackRequired?: boolean;
  safeDetails?: Record<string, unknown>;
};

export type ImageProviderAdapter<TConfig extends z.ZodTypeAny = z.ZodTypeAny> = AdapterDefinition<TConfig> & {
  key: ImageProviderKey;
  label: string;
  featureFlag: string;
  realCallsFeatureFlag?: string;
  secretFields: string[];
  supportedOperations: ImageProviderOperation[];
  mode: ImageProviderRuntimeMode;
  defaultTimeoutMs: number;
  processImage: (request: ImageProcessingRequest) => Promise<ImageProcessingResult>;
  normalizeError?: (error: unknown) => ImageProviderError;
};
