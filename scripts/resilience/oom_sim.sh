#!/usr/bin/env bash
#
# oom_sim.sh — Simulate OOM killer by allocating memory until killed
#
# Q9 Phase 2-3: Memory pressure fault injection.
# Spawns a subprocess that greedily allocates memory to trigger the OOM killer.
# Runs in a child process so the caller survives.
# The OOM killer targets the greediest process, which is this one.
#
# Usage: ./oom_sim.sh [--safe|--aggressive]
#   --safe:       Allocate until ~80% of RAM (default)
#   --aggressive: Allocate until killed (may destabilize system)
#
# IMPORTANT: Run inside a sandbox/cgroup for production safety.

set -euo pipefail

MODE="${1:-safe}"

echo "[oom_sim] Starting OOM simulation (mode: $MODE)"

TOTAL_RAM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
echo "[oom_sim] Total system RAM: $(( TOTAL_RAM_KB / 1024 )) MB"

case "$MODE" in
    safe)
        # Allocate ~80% of RAM via a child that eats memory
        TARGET_KB=$(( TOTAL_RAM_KB * 80 / 100 ))
        echo "[oom_sim] Targeting ${TARGET_KB} KB (~80% of RAM)"
        ;;
    aggressive)
        # Allocate as much as possible until OOM killer fires
        TARGET_KB=$(( TOTAL_RAM_KB * 200 / 100 ))
        echo "[oom_sim] Aggressive mode: allocating ${TARGET_KB} KB to trigger OOM"
        ;;
    *)
        echo "[oom_sim] Unknown mode: $MODE. Use --safe or --aggressive"
        exit 1
        ;;
esac

# Spawn memory eater in background
(
    echo "[oom_sim] Memory eater started (PID: $$)"

    # Allocate a large file in /dev/shm (tmpfs, counts as RAM)
    # Use dd to create a file of target size
    # This will naturally cause OOM if /dev/shm fills up
    OOM_FILE="/dev/shm/oom_sim_payload_$$.dat"

    # Use fallocate if available, otherwise dd
    if command -v fallocate &>/dev/null; then
        fallocate -l "${TARGET_KB}K" "$OOM_FILE" 2>/dev/null || {
            echo "[oom_sim] fallocate failed, trying dd..."
            dd if=/dev/zero of="$OOM_FILE" bs=1M count=$(( TARGET_KB / 1024 )) 2>/dev/null || true
        }
    else
        dd if=/dev/zero of="$OOM_FILE" bs=1M count=$(( TARGET_KB / 1024 )) 2>/dev/null || true
    fi

    # Stay alive holding the allocation
    echo "[oom_sim] Allocation achieved. Holding memory (PID: $$)"
    sleep 5

    # Clean up
    rm -f "$OOM_FILE" 2>/dev/null
    echo "[oom_sim] Cleanup done"
) &
CHILD_PID=$!

echo "[oom_sim] Memory eater running as PID $CHILD_PID"
echo "[oom_sim] Monitor with: free -m; ls -la /dev/shm/"
echo "[oom_sim] Clean up with: rm -f /dev/shm/oom_sim_payload_*"
