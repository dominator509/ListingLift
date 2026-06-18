# Credential Hygiene Rules — ListingLift

Hardening rules adopted during Q19 Phase 1 PAT remediation (following Q15-C1 finding).

## Hard Rules

### 1. Never embed credentials in remote URLs
- Git remote URLs MUST NOT contain `username:token@hostname` syntax.
- Authentication must use:
  - `gh` CLI credential helper (`gh auth setup-git`)
  - SSH keys (preferred for automation)
  - Environment-injected tokens via `GITHUB_TOKEN` in CI

### 2. Never commit secrets to source control
- No `.env` files committed (add to `.gitignore`).
- No API keys, tokens, or passwords in any source file.
- Pre-commit hooks: `git-secrets` or equivalent scanners.
- Use `.gitignore` patterns: `*.env`, `*.env.local`, `*.key`, `credentials*`, `secrets*`

### 3. Credential scanning after every clone
- Check `.git/config` for embedded credentials.
- Run `git log --all -p --diff-filter=M | grep -i 'github_pat_|ghp_|gho_|ghs_|ghr_|ghu_'` to audit history.
- Rotate any credential found in git history immediately.

### 4. Use `gh` credential helper for GitHub
- `gh auth setup-git` configures git to use the GitHub CLI credential helper.
- This keeps tokens in `~/.config/gh/hosts.yml` (outside the repo).
- Never type a PAT directly into a git command or URL.

### 5. PAT lifecycle
- Token scope: grant minimum necessary permissions.
- Set expiration dates on all fine-grained PATs.
- Rotate tokens quarterly or immediately on exposure.
- Revoke compromised tokens at: **GitHub → Settings → Developer Settings → Personal Access Tokens**

### 6. Environment variable discipline
- All secrets injected via environment variables, never hardcoded.
- Production secrets loaded through deployment platform (e.g., Replit Secrets, GitHub Actions Secrets).
- `.env.example` files contain placeholder/default values only (e.g., `DATABASE_URL=postgresql://user:password@localhost:5432/db` explicitly marked as placeholder).

## Remediation Log

| Date | Action | Status |
|------|--------|--------|
| 2026-06-15 | PAT removed from `.git/config` origin URL | ✅ Done |
| 2026-06-15 | Git remote reconfigured to `https://github.com/dominator509/ListingLift.git` with `gh` credential helper | ✅ Done |
| 2026-06-15 | Repo scanned for hardcoded credentials (PAT tokens, API keys, passwords) | ✅ No other credentials found |
| 2026-06-15 | Remote verified functional after PAT removal | ✅ Verified |
| 2026-06-15 | PAT revocation on GitHub | ⚠️ Manual step needed — see below |

## Remaining Action (Manual — HIGH PRIORITY)

The exposed PAT (`github...83cm`, currently the active `gh` credential) must be revoked on GitHub and replaced:

1. Go to https://github.com/settings/tokens
2. Find the active token (ends in `...83cm`)
3. Click "Revoke"
4. Generate a new fine-grained PAT with minimum required scopes: `repo`, `read:org`, `workflow`
5. Run `gh auth login` and paste the new token when prompted

**Why this couldn't be automated:** A PAT cannot revoke itself via the API. The `gh auth refresh` command requires interactive browser login which is unavailable in a cron/automated context.
