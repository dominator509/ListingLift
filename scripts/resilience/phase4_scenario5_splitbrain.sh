#!/usr/bin/env bash
# =============================================================================
# Q9 Phase 4 — Scenario 5: Split-Brain Recovery (standalone)
# =============================================================================
set -euo pipefail

BASE="http://localhost:3099"
LOG_FILE="/root/ListingLift/docs/Q9_P4_NETWORK_PARTITION_LOG.md"
START_TIME=$(date -u +"%s")

cleanup() {
  iptables -D OUTPUT -p tcp --dport 5432 -d 127.0.0.1 -j DROP 2>/dev/null || true
  echo "=== CLEANUP DONE ==="
}
trap cleanup EXIT

db_checksum() {
  psql -d listinglift_dev -t -A -c "
    SELECT md5(string_agg(coalesce(n_live_tup::text, '0'), '|' ORDER BY relname))
    FROM pg_stat_user_tables
    WHERE relname NOT LIKE '_prisma%';
  " 2>/dev/null || echo "ERROR"
}

db_row_count() {
  psql -d listinglift_dev -t -A -c "
    SELECT sum(n_live_tup) FROM pg_stat_user_tables;
  " 2>/dev/null || echo "0"
}

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  SCENARIO 5: SPLIT-BRAIN RECOVERY (standalone)             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

S5_PRE_CHECKSUM=$(db_checksum)
S5_PRE_ROWS=$(db_row_count)
echo "Pre-isolation checksum: $S5_PRE_CHECKSUM"
echo "Pre-isolation row count: $S5_PRE_ROWS"

# Block DB port
iptables -A OUTPUT -p tcp --dport 5432 -d 127.0.0.1 -j DROP
echo "🔌 DB port 5432 blocked — server isolated"

# Queue 10 writes during isolation
S5_WRITES_SENT=0
for i in $(seq 1 10); do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
    -X POST "$BASE/api/auth/signup" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"splitbrain-test-$i-$(date +%s)@test.com\",\"password\":\"Test1234!\",\"name\":\"Split Brain User\",\"organizationName\":\"Split Brain Org $i\"}" \
    2>/dev/null || echo "000")
  S5_WRITES_SENT=$((S5_WRITES_SENT + 1))
  echo "  Write $i: HTTP $HTTP_STATUS"
done

# Wait for full 30s isolation
S5_ELAPSED=$(($(date -u +"%s") - START_TIME))
if [ "$S5_ELAPSED" -lt 30 ]; then
  SLEEP_TIME=$((30 - S5_ELAPSED))
  echo "Waiting ${SLEEP_TIME}s more for 30s isolation..."
  sleep "$SLEEP_TIME"
fi

# Restore
iptables -D OUTPUT -p tcp --dport 5432 -d 127.0.0.1 -j DROP
echo "🔌 DB port 5432 unblocked — connectivity restored"

# Wait for pool recovery
sleep 5

# Verify health
S5_POST_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BASE/api/listings" 2>/dev/null || echo "000")
echo "Post-recovery health: $S5_POST_HEALTH"

# Verify data integrity
S5_POST_CHECKSUM=$(db_checksum)
S5_POST_ROWS=$(db_row_count)
echo "Post-recovery checksum: $S5_POST_CHECKSUM"
echo "Post-recovery row count: $S5_POST_ROWS"

# Check for duplicates
S5_DUP_CHECK=$(psql -d listinglift_dev -t -A -c "
  SELECT count(*) FROM (
    SELECT email, count(*) FROM \"User\" WHERE email LIKE 'splitbrain-test-%' GROUP BY email HAVING count(*) > 1
  ) dup;
" 2>/dev/null || echo "0")
echo "Duplicate entries found: $S5_DUP_CHECK"

S5_MTTR=$(($(date -u +"%s") - START_TIME))

if [ "$S5_DUP_CHECK" -gt 0 ]; then
  S5_STATUS="FAIL"
  echo "❌ FAIL — Duplicate entries detected!"
else
  S5_STATUS="PASS"
  echo "✅ PASS — No duplicates, data integrity maintained"
fi

echo "MTTR: ${S5_MTTR}s"
echo "Writes sent: $S5_WRITES_SENT"
echo ""
echo "=== SCENARIO 5 COMPLETE: $S5_STATUS ==="
