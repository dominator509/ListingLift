#!/bin/bash
# Q8 Phase 4 — Breadth-First Endpoint Sweep
# Generates canonical route list, starts dev server, sweeps all routes, produces report

set -euo pipefail

REPORT="/root/ListingLift/ENDPOINT_SWEEP_REPORT.md"
ROUTES_FILE="/tmp/routes_canonical.txt"
RESULTS_FILE="/tmp/sweep_results.txt"
PORT=3099
BASE="http://localhost:$PORT"

echo "=== Q8 Phase 4: Breadth-First Endpoint Sweep ==="
echo ""

# Step 1: Generate canonical route list
echo "--- Step 1: Route Discovery ---"

# Collect all route.ts and page.tsx files from src/app
# Convert file paths to URL paths
# route.ts → API route
# page.tsx → page route
# Skip layout.tsx (not a standalone route)
# Strip [param] → keep as is (will use a placeholder)

API_ROUTES=$(find /root/ListingLift/src/app -name "route.ts" | sort)
PAGE_ROUTES=$(find /root/ListingLift/src/app -name "page.tsx" | sort)

> "$ROUTES_FILE"

# Process API routes
while IFS= read -r file; do
  # Strip prefix and suffix
  rel="${file#/root/ListingLift/src/app/}"
  rel="${rel%/route.ts}"
  echo "/$rel" >> "$ROUTES_FILE"
done <<< "$API_ROUTES"

# Process page routes (excluding admin/ and agency/ layouts)
while IFS= read -r file; do
  rel="${file#/root/ListingLift/src/app/}"
  rel="${rel%/page.tsx}"
  # Handle index page (root /)
  if [ "$rel" = "page.tsx" ]; then
    echo "/" >> "$ROUTES_FILE"
    continue
  fi
  echo "/$rel" >> "$ROUTES_FILE"
done <<< "$PAGE_ROUTES"

# Add static assets
echo "/favicon.ico" >> "$ROUTES_FILE"
echo "/_next/static/..." >> "$ROUTES_FILE"  # placeholder, we'll check if next serves it

# Sort and deduplicate
sort -u "$ROUTES_FILE" -o "$ROUTES_FILE"

TOTAL_ROUTES=$(wc -l < "$ROUTES_FILE")
echo "Discovered $TOTAL_ROUTES canonical routes"

# Check for existing next dev process on port 3099
if lsof -i :$PORT -s TCP:LISTEN 2>/dev/null; then
  echo "Port $PORT already in use — killing existing process"
  lsof -ti :$PORT | xargs kill -9 2>/dev/null || true
  sleep 2
fi

# Step 2: Start dev server
echo "--- Step 2: Start Dev Server on port $PORT ---"
cd /root/ListingLift
NEXT_TELEMETRY_DISABLED=1 npx next dev -p $PORT > /tmp/nextdev.log 2>&1 &
NEXT_PID=$!
echo "Dev server PID: $NEXT_PID"

# Wait for ready signal (up to 120s)
echo "Waiting for dev server to be ready..."
for i in $(seq 1 120); do
  if grep -q "ready" /tmp/nextdev.log 2>/dev/null; then
    echo "Dev server ready after ${i}s"
    break
  fi
  if grep -q "Error" /tmp/nextdev.log 2>/dev/null; then
    echo "Dev server error detected — checking log..."
    tail -20 /tmp/nextdev.log
    break
  fi
  sleep 1
done

# Give it a moment more
sleep 3

# Check if server is actually responding
if curl -s -o /dev/null -w "%{http_code}" "$BASE/" 2>/dev/null; then
  echo "Server responds at $BASE/"
else
  echo "Server not responding — checking log:"
  tail -30 /tmp/nextdev.log
  echo "Attempting to continue anyway..."
fi

echo ""
echo "--- Step 3: Breadth-First Sweep ---"

# Initialize results file
echo "# SWEEP RESULTS" > "$RESULTS_FILE"
echo "route|status_code|status_class|error_snippet" >> "$RESULTS_FILE"

PASS=0
FAIL=0
COUNT_2XX=0
COUNT_3XX=0
COUNT_4XX=0
COUNT_5XX=0
COUNT_TIMEOUT=0
FAILURES=""

while IFS= read -r route; do
  # Skip _next routes
  if [[ "$route" == *"_next"* ]]; then
    continue
  fi

  # Replace [param] with "test" for dynamic segments
  url_path="$route"
  while [[ "$url_path" =~ \[([a-zA-Z]+)\] ]]; do
    url_path="${url_path//\[${BASH_REMATCH[1]}\]/test}"
  done

  url="$BASE$url_path"

  # curl with timeout
  status_code=""
  error_snippet=""
  
  status_code=$(curl -s -o /tmp/sweep_body.txt -w "%{http_code}" --max-time 5 "$url" 2>/dev/null || echo "TIMEOUT")
  
  if [ "$status_code" = "TIMEOUT" ] || [ -z "$status_code" ]; then
    echo "${route}|TIMEOUT|FAILURE|Request timed out or connection refused" >> "$RESULTS_FILE"
    FAIL=$((FAIL + 1))
    COUNT_TIMEOUT=$((COUNT_TIMEOUT + 1))
    FAILURES="$FAILURES
- ${route} — TIMEOUT"
  elif [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
    echo "${route}|${status_code}|2xx|OK" >> "$RESULTS_FILE"
    PASS=$((PASS + 1))
    COUNT_2XX=$((COUNT_2XX + 1))
  elif [ "$status_code" -ge 300 ] && [ "$status_code" -lt 400 ]; then
    echo "${route}|${status_code}|3xx|Redirect" >> "$RESULTS_FILE"
    PASS=$((PASS + 1))
    COUNT_3XX=$((COUNT_3XX + 1))
  elif [ "$status_code" -ge 400 ] && [ "$status_code" -lt 500 ]; then
    echo "${route}|${status_code}|4xx|Client Error" >> "$RESULTS_FILE"
    PASS=$((PASS + 1))
    COUNT_4XX=$((COUNT_4XX + 1))
  elif [ "$status_code" -ge 500 ]; then
    snippet=$(head -c 500 /tmp/sweep_body.txt 2>/dev/null | tr '\n' ' ' | head -c 200)
    echo "${route}|${status_code}|5xx|${snippet}" >> "$RESULTS_FILE"
    FAIL=$((FAIL + 1))
    COUNT_5XX=$((COUNT_5XX + 1))
    FAILURES="$FAILURES
- ${route} — ${status_code} — ${snippet}"
  fi
done < "$ROUTES_FILE"

TOTAL_TESTED=$((PASS + FAIL))
PCT_PASS=0
if [ "$TOTAL_TESTED" -gt 0 ]; then
  PCT_PASS=$((PASS * 100 / TOTAL_TESTED))
fi

echo ""
echo "=== Sweep Complete ==="
echo "Total routes: $TOTAL_TESTED"
echo "Pass: $PASS ($PCT_PASS%)"
echo "Fail: $FAIL"
echo "  2xx: $COUNT_2XX"
echo "  3xx: $COUNT_3XX"
echo "  4xx: $COUNT_4XX"
echo "  5xx: $COUNT_5XX"
echo "  Timeout: $COUNT_TIMEOUT"

# Step 4: Write Report
echo "--- Step 4: Writing Report ---"

cat > "$REPORT" << REPORTEOF
# Endpoint Sweep Report — Q8 Phase 4

## Summary

| Metric | Value |
|--------|-------|
| Total Routes Discovered | ${TOTAL_ROUTES} |
| Total Routes Tested | ${TOTAL_TESTED} |
| Pass | ${PASS} (${PCT_PASS}%) |
| Fail | ${FAIL} |
| 2xx (OK) | ${COUNT_2XX} |
| 3xx (Redirect) | ${COUNT_3XX} |
| 4xx (Client Error) | ${COUNT_4XX} |
| 5xx (Server Error) | ${COUNT_5XX} |
| Timeout / No Response | ${COUNT_TIMEOUT} |

## Status Code Classification

- **2xx** — Route served content successfully
- **3xx** — Route redirected (e.g., / → /home)
- **4xx** — Client error (expected for auth-gated routes: 401/403/404)
- **5xx** — FAILURE — Server crash or internal error
- **Timeout** — FAILURE — Route hung or connection refused

## Failures
REPORTEOF

if [ -n "$FAILURES" ]; then
  echo "" >> "$REPORT"
  echo "### Blocking Failures (5xx / Timeout)" >> "$REPORT"
  echo "\`\`\`" >> "$REPORT"
  echo "$FAILURES" >> "$REPORT"
  echo "\`\`\`" >> "$REPORT"
else
  echo "" >> "$REPORT"
  echo "**No 5xx or timeout failures detected.**" >> "$REPORT"
fi

echo "" >> "$REPORT"
echo "## Full Results" >> "$REPORT"
echo "\`\`\`" >> "$REPORT"
cat "$RESULTS_FILE" >> "$REPORT"
echo "\`\`\`" >> "$REPORT"

echo "" >> "$REPORT"
echo "## Static Assets" >> "$REPORT"

# Static asset checks
FAVICON_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$BASE/favicon.ico" 2>/dev/null || echo "FAIL")
echo "- /favicon.ico: HTTP ${FAVICON_CODE}" >> "$REPORT"

echo "" >> "$REPORT"
echo "---" >> "$REPORT"
echo "Generated by IpMan — Q8 Phase 4 Endpoint Sweep" >> "$REPORT"

echo "Report written to $REPORT"

# Step 5: Teardown dev server
echo "--- Step 5: Teardown Dev Server ---"
kill $NEXT_PID 2>/dev/null || true
# Also kill any lingering on port 3099
lsof -ti :$PORT | xargs kill -9 2>/dev/null || true
echo "Dev server stopped."

echo ""
echo "=== Phase 4 Complete ==="
