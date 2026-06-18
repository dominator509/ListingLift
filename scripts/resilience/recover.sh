#!/usr/bin/env bash
#
# recover.sh — Restart services and verify database connectivity
#
# Q9 Phase 2-5: Recovery after fault injection.
# Restarts the database server (if down) and application server.
# Verifies connectivity and schema integrity.
#
# Usage: ./recover.sh

set -euo pipefail

DB_NAME="${DB_NAME:-listinglift_dev}"
APP_PORT="${APP_PORT:-3000}"

echo "[recover] ====== Recovery Initiated ======"

# --- Step 1: Restart PostgreSQL if needed ---
echo "[recover] Step 1: Checking PostgreSQL..."

if pg_isready -q 2>/dev/null; then
    echo "[recover] PostgreSQL is already accepting connections"
else
    echo "[recover] PostgreSQL is down. Restarting..."
    sudo systemctl restart postgresql 2>/dev/null || {
        echo "[recover] WARNING: Could not restart via systemctl. Trying pg_ctl..."
        pg_ctlcluster 16 main start 2>/dev/null || {
            echo "[recover] ERROR: Failed to restart PostgreSQL"
            exit 1
        }
    }
    sleep 2
    if pg_isready -q 2>/dev/null; then
        echo "[recover] PostgreSQL restarted successfully"
    else
        echo "[recover] ERROR: PostgreSQL still not accepting connections"
        exit 1
    fi
fi

# --- Step 2: Verify database schema ---
echo "[recover] Step 2: Verifying database schema..."

PGPASS=$(grep DATABASE_URL .env 2>/dev/null | sed 's/.*:\/\///;s/.*@//' || true)

SCHEMA_CHK=$(psql -d "$DB_NAME" -t -A -c "
    SELECT count(*) FROM information_schema.tables
    WHERE table_schema = 'public';
" 2>/dev/null || echo "0")

echo "[recover] Database has $SCHEMA_CHK tables in public schema"

if [ "$SCHEMA_CHK" -lt 10 ]; then
    echo "[recover] WARNING: Schema appears degraded (only $SCHEMA_CHK tables)"
    echo "[recover] Run migrations: npx prisma migrate deploy"
fi

# --- Step 3: Verify data integrity ---
echo "[recover] Step 3: Checking data integrity..."

ROW_COUNT=$(psql -d "$DB_NAME" -t -A -c "
    SELECT sum(n_live_tup) FROM pg_stat_user_tables;
" 2>/dev/null || echo "ERROR")

echo "[recover] Total live rows: $ROW_COUNT"

# --- Step 4: Restart Next.js dev server ---
echo "[recover] Step 4: Restarting application server..."

# Kill any existing dev server
pkill -f "next.*dev" 2>/dev/null || true
sleep 1

# Start dev server in background
npm run dev &
DEV_PID=$!
echo "[recover] Dev server starting (PID: $DEV_PID)"

# Wait for it to come up
for i in $(seq 1 15); do
    if curl -s "http://localhost:${APP_PORT}/" >/dev/null 2>&1; then
        echo "[recover] Dev server is reachable on port $APP_PORT"
        break
    fi
    if [ "$i" -eq 15 ]; then
        echo "[recover] WARNING: Dev server did not become reachable within 15s"
    fi
    sleep 1
done

echo "[recover] ====== Recovery Complete ======"
echo "[recover] Run ./verify_hash.sh to check data integrity against baseline"
