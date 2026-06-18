# cron_gatekeeper.py
"""
Protects the DeepSeek API wallet from run-loop bleed by terminating execution
whenever the cluster is detected to be idle or in a hibernating state.

Per Dominic's SYSTEM ARCHITECTURE UPGRADE SPECIFICATION.

Usage:
    python cron_gatekeeper.py && <agent-execution-command>
"""

import sys
from pathlib import Path


def evaluate_cluster_health(workspace_dir: Path):
    buffer_file = workspace_dir / "COMM_BUFFER.md"

    if not buffer_file.exists():
        print("[GATEKEEPER] Communication buffer missing. Proceeding to initialization loop.")
        sys.exit(0)

    raw_content = buffer_file.read_text(encoding="utf-8")

    # Condition 1: Check for Master Hibernation Signatures
    if "SYSTEM_STATE: HIBERNATE" in raw_content:
        print("[GATEKEEPER] System state is HIBERNATE. Suppressing LLM API execution loop.")
        sys.exit(1)  # Block subsequent daemon runtime executions

    # Condition 2: Check for Unmoved/Awaiting Global Acknowledgment Matrices
    # If all agents have flagged TRUE and Alfred has not updated the task block yet,
    # the pipeline is idle
    if (
        "ACK_ALFRED=TRUE" in raw_content
        and "ACK_IP_MAN=TRUE" in raw_content
        and "ACK_DEZIRAY=TRUE" in raw_content
    ):
        print(
            "[GATEKEEPER] All agents synchronized, awaiting Orchestrator state change. "
            "Tripping circuit breaker."
        )
        sys.exit(1)

    print("[GATEKEEPER] Active tasks detected. Passing context through to DeepSeek API cluster.")
    sys.exit(0)


if __name__ == "__main__":
    # Assumes execution directly within the workspace root folder
    evaluate_cluster_health(Path("."))
