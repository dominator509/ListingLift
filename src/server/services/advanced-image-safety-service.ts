import { advancedImageSafetyCheckRequestSchema } from '@/schemas/advanced-image-processing';
import { evaluateAdvancedImageOperationPolicy } from './advanced-image-operation-policy-service';

export function runAdvancedImageSafetyCheck(raw: unknown) {
  const request = advancedImageSafetyCheckRequestSchema.parse(raw);
  return evaluateAdvancedImageOperationPolicy(request);
}
