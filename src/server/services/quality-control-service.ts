export type QualityFlag =
  | 'edge_quality_issue'
  | 'product_cutoff'
  | 'missing_part'
  | 'lighting_issue'
  | 'blurry_photo'
  | 'wrong_crop'
  | 'failed_mask'
  | 'duplicate_file'
  | 'wrong_background'
  | 'preset_mismatch'
  | 'naming_mismatch';

export type QualityReviewInput = {
  edgeScore?: number;
  isDuplicate?: boolean;
  dimensionsMatchPreset?: boolean;
  backgroundMatchesRequested?: boolean;
  fileNameMatchesRule?: boolean;
};

export function flagOutput(input: QualityReviewInput): QualityFlag[] {
  const flags: QualityFlag[] = [];
  if (typeof input.edgeScore === 'number' && input.edgeScore < 0.75) flags.push('edge_quality_issue');
  if (input.isDuplicate) flags.push('duplicate_file');
  if (input.dimensionsMatchPreset === false) flags.push('preset_mismatch');
  if (input.backgroundMatchesRequested === false) flags.push('wrong_background');
  if (input.fileNameMatchesRule === false) flags.push('naming_mismatch');
  return flags;
}
