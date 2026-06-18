"""
4-Tier Cache-Locked Prompt Assembly for DeepSeek Prefix Caching.

DeepSeek's prefix cache is left-to-right. Any byte change early in the prompt
drops cache hits to 0% for all trailing content. This module assembles prompts
so that dynamic data is quarantined at the very bottom, keeping the prefix
frozen and cacheable across turns.

Architecture
------------
    Tier 1: STABLE     — SOUL.md identity + runtime directives     (100% cache hit)
    Tier 2: SPEC       — ARCHITECTURE.md + BUILD_ROADMAP.md        (100% cache hit)
                         + ROADMAP_STATUS.md (active execution state)
    Tier 3: STATE SLOT — COMM_BUFFER.md fixed-length buffer        (structural hit)
    Tier 4: VOLATILE   — bucketed timestamps, session metadata     (0% — isolated)

Tiers 1-3 form the frozen prefix. Tier 4 is the sacrifice zone — it will miss
cache, but it invalidates nothing above it.
"""

from __future__ import annotations

import math
import time
from pathlib import Path
from typing import Optional

# ── Tier 2 spec files (loaded alphabetically for deterministic byte order) ──
SPEC_FILES: list[str] = [
    "ARCHITECTURE.md",
    "BUILD_ROADMAP.md",
    "ROADMAP_STATUS.md",
]

# Cap per spec file to prevent a single large file from ballooning the prompt
SPEC_CHAR_CAP: int = 15_000

# COMM_BUFFER character cap (fixed slot board should stay under 6 KB)
BUFFER_CHAR_CAP: int = 6_000

# 10-minute time buckets — same byte sequence for every call within the window
BUCKET_SECONDS: int = 600


def _read_capped(path: Path, cap: int) -> str:
    """Read a file, capping its content at `cap` characters."""
    try:
        raw = path.read_text(encoding="utf-8")
    except (FileNotFoundError, PermissionError, OSError):
        return ""
    return raw[:cap]


def compile_optimized_prompt(
    workspace_dir: Path,
    session_meta: Optional[dict] = None,
) -> str:
    """
    Assemble a cache-optimized system prompt from the 4-tier architecture.

    Parameters
    ----------
    workspace_dir : Path
        Root of the ListingLift repository (must contain ARCHITECTURE.md, etc.).
    session_meta : dict, optional
        Session metadata. Keys: 'id' (session ID). Used in Tier 4.

    Returns
    -------
    str
        Assembled prompt with frozen prefix (Tiers 1-3) followed by the
        volatile boundary suffix (Tier 4).
    """
    soul_path = Path.home() / ".hermes" / "SOUL.md"

    # ── Tier 1: Stable Identity ──────────────────────────────────────
    tier_1 = _read_capped(soul_path, SPEC_CHAR_CAP) if soul_path.exists() else ""
    if tier_1:
        tier_1 = (
            f"{tier_1}\n\n"
            "<system_directives>\n"
            "- Output clean, correct TypeScript. Follow architectural strictness.\n"
            "- You are FORBIDDEN from modifying ARCHITECTURE.md or BUILD_ROADMAP.md.\n"
            "- To propose a plan change, write an XML proposal in your COMM_BUFFER slot.\n"
            "- If CLUSTER_STATE is HIBERNATE, output only: STATUS_QUO_RETAINED\n"
            "- Read COMM_BUFFER.md before acting. Overwrite your slot — never append.\n"
            "- rtk-tee blankets 15 commands (tsc/next/vitest/eslint/prisma/playwright/\n"
            "  prettier/npm/pnpm/webpack/jest/docker/vite/terraform/cypress). On failure\n"
            "  you see only a file pointer. Read the pointer path to get the full error.\n"
            "</system_directives>"
        )

    # ── Tier 2: Specification (alphabetical → deterministic byte order) ──
    tier_2_blocks: list[str] = []
    for fname in sorted(SPEC_FILES):
        fpath = workspace_dir / fname
        content = _read_capped(fpath, SPEC_CHAR_CAP)
        if content:
            tier_2_blocks.append(f"<{fname}>\n{content}\n</{fname}>")

    tier_2 = "\n\n".join(tier_2_blocks) if tier_2_blocks else ""

    # ── Tier 3: Fixed-Slot State Board ───────────────────────────────
    buffer_path = workspace_dir / "COMM_BUFFER.md"
    tier_3 = ""
    if buffer_path.exists():
        content = _read_capped(buffer_path, BUFFER_CHAR_CAP)
        tier_3 = f"<system_state>\n{content}\n</system_state>"

    # ── Tier 4: Volatile Boundary (the sacrifice zone) ────────────────
    time_bucket = math.floor(time.time() / BUCKET_SECONDS) * BUCKET_SECONDS
    session_id = (session_meta or {}).get("id", "unknown")

    tier_4 = (
        "<metadata>\n"
        f"SESSION_ID: {session_id}\n"
        f"TIME_BUCKET: {time_bucket}\n"
        "</metadata>"
    )

    # ── Assembly (order is critical — Tiers 1-3 form the frozen prefix) ──
    parts = [p for p in (tier_1, tier_2, tier_3, tier_4) if p]
    return "\n\n".join(parts)


# ── Standalone diagnostic ────────────────────────────────────────────────
if __name__ == "__main__":
    import sys

    ws = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.cwd()
    prompt = compile_optimized_prompt(ws, {"id": "dry-run"})

    # Report tier sizes for cache planning
    lines = prompt.split("\n")
    print(f"Total: {len(prompt)} chars, {len(lines)} lines")
    print(f"Tiers 1-3 (cached prefix): ~{len(prompt) - len(lines[-3:])} chars")
    print(f"Tier 4 (volatile suffix): ~{len(lines[-3:])} chars")
