#!/usr/bin/env bash
#
# kill_db.sh — SIGKILL the PostgreSQL backend process(es)
#
# Q9 Phase 2: Hard-kill fault injection. No SIGTERM, no graceful shutdown.
# Kills only the postgres backend PID associated with listinglift_dev.
# Does NOT kill the postgres cluster itself — keeps the server alive
# so we can verify the DB survived, not just the process.
#
# Usage: ./kill_db.sh [--force]

set -euo pipefail

DB_NAME="${DB_NAME:-listinglift_dev}"
PGDATA="${PGDATA:-/var/lib/postgresql/16/main}"

if [ "${1:-}" = "--force" ]; then
    echo "[kill_db] Force mode: skipping safety checks"
else
    # Safety: confirm we're in dev/staging
    if [ "${NODE_ENV:-}" = "production" ]; then
        echo "[kill_db] FATAL: REFUSING to target production database" >&2
        exit 1
    fi
fi

echo "[kill_db] Finding active backend PIDs for database: $DB_NAME"

PIDS=$(psql -d "$DB_NAME" -t -A -c "
    SELECT pid FROM pg_stat_activity
    WHERE datname = '$DB_NAME'
      AND pid <> pg_backend_pid()
      AND state = 'active'
      AND backend_type = 'client backend';
" 2>/dev/null)

if [ -z "$PIDS" ]; then
    echo "[kill_db] No active client backends found for $DB_NAME"
    echo "[kill_db] Killing all backends (including idle) for $DB_NAME..."

    PIDS=$(psql -d "$DB_NAME" -t -A -c "
        SELECT pid FROM pg_stat_activity
        WHERE datname = '$DB_NAME'
          AND pid <> pg_backend_pid();
    " 2>/dev/null)
fi

if [ -z "$PIDS" ]; then
    echo "[kill_db] No backends to kill"
    exit 0
fi

echo "[kill_db] Backend PIDs to kill: $(echo "$PIDS" | tr '\n' ' ')"

for PID in $PIDS; do
    if [ -n "$PID" ] && [ "$PID" -gt 0 ] 2>/dev/null; then
        echo "[kill_db] Sending SIGKILL to PID $PID"
        kill -9 "$PID" 2>/dev/null || echo "[kill_db] PID $PID already gone"
    fi
done

echo "[kill_db] Done. Verifying database connectivity..."

if psql -d "$DB_NAME" -c "SELECT 1 AS alive" >/dev/null 2>&1; then
    echo "[kill_db] Database is still accepting connections (server survived)"
else
    echo "[kill_db] WARNING: Database unreachable. Server may need restart."
fi
