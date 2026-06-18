import { describe, expect, it } from 'vitest';
import { createEtsyDeliveryTemplate, createEtsyVisualReport } from '@/server/services/etsy-delivery-template-service';

describe('Etsy delivery template service', () => {
  it('uses compliance-safe non-guarantee language', () => {
    const template = createEtsyDeliveryTemplate({ buyerName: 'Alex', includeExternalLink: true, externalLinkAllowed: true });
    expect(template.deliveryMessage).toContain('seller review');
    expect(template.deliveryMessage).toContain('not guaranteed');
  });

  it('creates shop visual report sections', () => {
    const report = createEtsyVisualReport({ listingTitles: ['Candle'], flaggedIssues: ['Check crop'], recommendedSequence: ['Main listing image', 'Lifestyle', 'Detail'] });
    expect(report.sections.length).toBeGreaterThanOrEqual(3);
  });
});
