#!/bin/bash
# Unguarded Route Sweep Payload — T1190 (PoC only)
# ROE: Fork/canary — proof not destruction

TARGET="${1:-http://localhost:3000}"

echo "=== Phase 2c: Unguarded Route Enumeration ==="
echo "Target: $TARGET"
echo ""

ENDPOINTS=(
  "/api/health"
  "/api/adapters/health"
  "/api/advanced-image-processing/health"
  "/api/automation-webhooks/health"
  "/api/listings"
  "/api/packages"
  "/api/presets"
  "/api/subscriptions"
  "/api/credits/balance"
  "/api/sales-channels/registry"
  "/api/manual-invoices"
  "/api/integrations"
  "/api/billing"
  "/api/organizations"
  "/api/images"
  "/api/uploads/validate-file"
  "/api/quality-control/checklist"
  "/api/reports/catalog"
)

for ep in "${ENDPOINTS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$TARGET$ep")
  SIZE=$(curl -s -o /dev/null -w "%{size_download}" "$TARGET$ep")
  echo "GET $ep → HTTP $STATUS ($SIZE bytes)"
done
