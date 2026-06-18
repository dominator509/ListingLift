#!/usr/bin/env bash
#
# verify_hash.sh — Re-compute checksums and diff against baseline
#
# Q9 Phase 5: Rollback verification.
# Compares current database state against the pre-disaster baseline.
#
# Usage: ./verify_hash.sh [--verbose]

set -uo pipefail

DB_NAME="${DB_NAME:-listinglift_dev}"
BASELINE_FILE="docs/PRE_DISASTER_STATE_HASH.md"

if [ ! -f "$BASELINE_FILE" ]; then
    echo "[verify_hash] ERROR: Baseline file not found: $BASELINE_FILE"
    echo "[verify_hash] Run Phase 1 baseline first."
    exit 1
fi

VERBOSE=false
[ "${1:-}" = "--verbose" ] && VERBOSE=true

PASS=0
FAIL=0
TOTAL=0

echo "[verify_hash] ====== Integrity Verification ======"
echo "[verify_hash] Baseline: $BASELINE_FILE"
echo ""

# --- 1. Schema hash ---
echo "[verify_hash] 1. Schema hash..."

SCHEMA_DUMP=$(mktemp)
pg_dump --schema-only --no-owner --no-acl -d "$DB_NAME" 2>/dev/null \
  | grep -v '^\\\restrict' | grep -v '^\\\unrestrict' \
  > "$SCHEMA_DUMP"
CURRENT_SHA=$(sha256sum "$SCHEMA_DUMP" | cut -d' ' -f1)

BASELINE_SHA=$(grep -A1 'SHA256' "$BASELINE_FILE" | grep -oP '[0-9a-f]{64}' | head -1)

TOTAL=$((TOTAL + 1))
if [ "$CURRENT_SHA" = "$BASELINE_SHA" ]; then
    echo "[verify_hash]   ✓ Schema hash match: $CURRENT_SHA"
    PASS=$((PASS + 1))
else
    echo "[verify_hash]   ✗ Schema hash MISMATCH"
    echo "[verify_hash]     Baseline: $BASELINE_SHA"
    echo "[verify_hash]     Current:  $CURRENT_SHA"
    FAIL=$((FAIL + 1))
fi
rm -f "$SCHEMA_DUMP"

# --- 2. Table row counts ---
echo "[verify_hash] 2. Table row counts..."

# Extract baseline table rows from the Table Row Counts section
# Format: | TableName | RowCount | `checksum` |
BASELINE_ROWS=$(grep -E '^\| [A-Za-z_]+\|.*\| [0-9]+ \|' "$BASELINE_FILE" 2>/dev/null || true)

MISMATCH_RC=false
while IFS='|' read -r _ TABLE ROWCOUNT _; do
    TABLE=$(echo "$TABLE" | xargs)
    ROWCOUNT=$(echo "$ROWCOUNT" | xargs)
    [ -z "$TABLE" ] && continue
    TOTAL=$((TOTAL + 1))

    CURRENT=$(psql -d "$DB_NAME" -t -A -c "SELECT count(*) FROM \"$TABLE\"" 2>/dev/null || echo "0")

    if [ "$CURRENT" = "$ROWCOUNT" ]; then
        $VERBOSE && echo "[verify_hash]   ✓ $TABLE: $CURRENT rows"
        PASS=$((PASS + 1))
    else
        echo "[verify_hash]   ✗ $TABLE row count MISMATCH: baseline=$ROWCOUNT, current=$CURRENT"
        MISMATCH_RC=true
        FAIL=$((FAIL + 1))
    fi
done <<< "$BASELINE_ROWS"

# --- 3. Table checksums ---
echo "[verify_hash] 3. Table checksums..."

MISMATCH_CS=false
TABLES=$(psql -d "$DB_NAME" -t -A -c "SELECT relname FROM pg_stat_user_tables ORDER BY relname" 2>/dev/null)

while IFS= read -r TABLE; do
    [ -z "$TABLE" ] && continue
    TOTAL=$((TOTAL + 1))

    ROW_COUNT=$(psql -d "$DB_NAME" -t -A -c "SELECT count(*) FROM \"$TABLE\"" 2>/dev/null || echo "0")

    if [ "$ROW_COUNT" -gt 0 ] 2>/dev/null; then
        CURRENT_HASH=$(psql -d "$DB_NAME" -t -A -c "SELECT md5(string_agg(row_hash, '' ORDER BY row_hash)) FROM (SELECT md5(t::text) AS row_hash FROM \"$TABLE\" t) sub;" 2>/dev/null)
    else
        CURRENT_HASH='d41d8cd98f00b204e9800998ecf8427e'
    fi

    # Extract baseline hash from markdown: | TableName | N | `hash` |
    # Use grep -oP to extract the 32-char hex hash between backticks
    BASELINE_HASH=$(grep -E "^\| $TABLE \|" "$BASELINE_FILE" | grep -oP '(?<=`)[a-f0-9]{32}(?=`)' | head -1)

    if [ "$CURRENT_HASH" = "$BASELINE_HASH" ]; then
        $VERBOSE && echo "[verify_hash]   ✓ $TABLE: $CURRENT_HASH"
        PASS=$((PASS + 1))
    else
        echo "[verify_hash]   ✗ $TABLE checksum MISMATCH (rows=$ROW_COUNT): baseline=\"$BASELINE_HASH\", current=\"$CURRENT_HASH\""
        MISMATCH_CS=true
        FAIL=$((FAIL + 1))
    fi
done <<< "$TABLES"

$MISMATCH_CS || echo "[verify_hash]   All table checksums match baseline"

echo ""
echo "[verify_hash] ====== Results: $PASS passed, $FAIL failed, $TOTAL total ======"

if [ "$FAIL" -eq 0 ]; then
    echo "[verify_hash] ✓ DATA INTEGRITY VERIFIED — all checksums match baseline"
    exit 0
else
    echo "[verify_hash] ✗ DATA INTEGRITY COMPROMISED — $FAIL checks differ from baseline"
    exit 1
fi
