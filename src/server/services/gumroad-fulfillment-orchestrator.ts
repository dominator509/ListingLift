export function createGumroadWebhookProcessingPlan(input: {
  payloadText: string;
  signatureHeader: string | null;
  dryRun?: boolean;
}) {
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(input.payloadText);
  } catch {
    // Not JSON — pass through
  }

  return {
    ok: true,
    saleId: parsed.sale_id || 'unknown',
    productName: parsed.product_name || 'unknown',
    dryRun: input.dryRun ?? true,
    note: 'Placeholder — Gumroad fulfillment not yet wired.',
  };
}

export function parseGumroadPayloadFromBody(body: string): Record<string, string> {
  // Try JSON first
  try {
    const json = JSON.parse(body);
    return {
      sale_id: json.sale_id ?? '',
      product_name: json.product_name ?? '',
      email: json.email ?? '',
      price_cents: String(json.price_cents ?? ''),
    };
  } catch {
    // Form-encoded
    const params = new URLSearchParams(body);
    return {
      sale_id: params.get('sale_id') ?? '',
      product_name: params.get('product_name') ?? '',
      email: params.get('email') ?? '',
      price_cents: params.get('price_cents') ?? '',
    };
  }
}
