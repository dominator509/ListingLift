#!/usr/bin/env bash
#
# kill_dev.sh — SIGKILL the Next.js dev server
#
# Q9 Phase 2: Hard-kill fault injection for the application layer.
# Finds and kills the node/next dev server process.
#
# Usage: ./kill_dev.sh [--force]

set -euo pipefail

if [ "${1:-}" = "--force" ]; then
    echo "[kill_dev] Force mode: skipping safety checks"
fi

# Find Next.js dev server PIDs
PIDS=$(pgrep -f "next.*dev" 2>/dev/null || true)

if [ -z "$PIDS" ]; then
    # Fallback: look for node processes running from the project dir
    PIDS=$(pgrep -f "node.*next" 2>/dev/null || true)
fi

if [ -z "$PIDS" ]; then
    echo "[kill_dev] No Next.js dev server process found"
    exit 0
fi

echo "[kill_dev] Found Next.js PIDs: $(echo "$PIDS" | tr '\n' ' ')"

for PID in $PIDS; do
    if [ -n "$PID" ] && [ "$PID" -gt 0 ] 2>/dev/null; then
        echo "[kill_dev] Sending SIGKILL to PID $PID"
        kill -9 "$PID" 2>/dev/null || echo "[kill_dev] PID $PID already gone"
    fi
done

echo "[kill_dev] Dev server killed. Verify with: pgrep -f 'next.*dev'"
