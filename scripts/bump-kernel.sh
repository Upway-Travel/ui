#!/usr/bin/env bash
#
# bump-kernel.sh — propagate a new @upway/ui SHA to all consumers.
#
# Encodes the lessons from the manual 2026-05-28 cascade:
#   - Refuses dirty worktrees in each consumer
#   - npm install + commit the regenerated lockfile (npm ci requires sync)
#   - One feature branch per consumer
#   - PR opened via gh CLI
#   - Author email = personal (kfitzsimmons00@gmail.com), per repo convention
#
# Usage:
#   ./scripts/bump-kernel.sh                      # bump consumers to current upway-ui main HEAD
#   ./scripts/bump-kernel.sh <sha>                # bump to a specific SHA
#   ./scripts/bump-kernel.sh --dry-run            # show what would change without pushing
#   ./scripts/bump-kernel.sh --consumers=landing,blog   # restrict to a subset
#
# Consumers (must each be cloned as siblings under $HOME):
#   - upway-landing       upway.travel
#   - upway-blog          stack.upway.travel
#   - Upway               app.upway.travel  (only bumps if package.json declares @upway/ui)
#   - upway-pitch-deck    deck.upway.travel (only bumps if consumes @upway/ui)
#   - upway-brand-guide   brand.upway.travel (when wired)

set -euo pipefail

# ────────────────────────────────────────────────────────────
# Config
# ────────────────────────────────────────────────────────────
KERNEL_REPO="upway-travel/ui"
KERNEL_DIR="${HOME}/upway-ui"
GIT_AUTHOR_EMAIL="kfitzsimmons00@gmail.com"
GIT_AUTHOR_NAME="Kyle Fitzsimmons"

# All consumers (path under $HOME). Excludes those that don't consume @upway/ui yet.
ALL_CONSUMERS=(
  "upway-landing"
  "upway-blog"
  # "Upway"             # wires after task #13
  # "upway-brand-guide" # wires after task #8
  # "upway-pitch-deck"  # wires when ready
)

GH=/opt/homebrew/bin/gh

# ────────────────────────────────────────────────────────────
# Args
# ────────────────────────────────────────────────────────────
DRY_RUN=0
TARGET_SHA=""
CONSUMERS=("${ALL_CONSUMERS[@]}")

for arg in "$@"; do
  case $arg in
    --dry-run) DRY_RUN=1; shift ;;
    --consumers=*) IFS=',' read -r -a CONSUMERS <<< "${arg#*=}"; shift ;;
    --*) echo "Unknown flag: $arg" >&2; exit 2 ;;
    *) TARGET_SHA="$arg"; shift ;;
  esac
done

# ────────────────────────────────────────────────────────────
# Resolve target SHA
# ────────────────────────────────────────────────────────────
if [[ -z "$TARGET_SHA" ]]; then
  echo "→ resolving current $KERNEL_REPO main HEAD…"
  cd "$KERNEL_DIR"
  git fetch origin main --quiet
  TARGET_SHA=$(git rev-parse origin/main)
fi

echo "→ target SHA: $TARGET_SHA"
echo "→ consumers:  ${CONSUMERS[*]}"
[[ $DRY_RUN -eq 1 ]] && echo "→ DRY RUN — no commits or pushes"
echo

# ────────────────────────────────────────────────────────────
# For each consumer
# ────────────────────────────────────────────────────────────
for consumer in "${CONSUMERS[@]}"; do
  dir="${HOME}/${consumer}"
  echo "════════════════════════════════════════════════════════════"
  echo "  $consumer"
  echo "════════════════════════════════════════════════════════════"

  if [[ ! -d "$dir/.git" ]]; then
    echo "  ✗ $dir is not a git repo, skipping"
    continue
  fi

  cd "$dir"

  # Refuse dirty worktree (was the pre-push hook lesson from 2026-05-28)
  if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
    echo "  ✗ working tree dirty (tracked files modified). Commit or stash first."
    continue
  fi

  # Get the current pin
  current_pin=$(grep '"@upway/ui"' package.json 2>/dev/null | sed -E 's|.*#([a-f0-9]+).*|\1|' || echo "")
  if [[ -z "$current_pin" ]]; then
    echo "  ⚠ no @upway/ui pin found in package.json — skipping (not a consumer yet)"
    continue
  fi

  if [[ "$current_pin" == "$TARGET_SHA"* ]]; then
    echo "  ✓ already on $TARGET_SHA — nothing to do"
    continue
  fi

  echo "  current: $current_pin"
  echo "  target:  $TARGET_SHA"

  if [[ $DRY_RUN -eq 1 ]]; then
    echo "  (dry-run — skipping)"
    continue
  fi

  # Get on main, fresh
  git checkout main --quiet
  git pull --ff-only --quiet

  # Cut bump branch
  short_sha="${TARGET_SHA:0:8}"
  branch="chore/bump-upway-ui-to-${short_sha}"
  if git rev-parse --verify "$branch" >/dev/null 2>&1; then
    echo "  ⚠ branch $branch exists locally — deleting"
    git branch -D "$branch" >/dev/null
  fi
  git checkout -b "$branch" --quiet

  # Edit package.json
  sed -i.bak "s|\"@upway/ui\": \"github:upway-travel/ui#[a-f0-9]\\{40\\}\"|\"@upway/ui\": \"github:upway-travel/ui#${TARGET_SHA}\"|" package.json
  rm -f package.json.bak

  # Regenerate lockfile (npm ci needs this)
  echo "  → npm install (refresh lockfile)…"
  npm install --no-audit --no-fund --loglevel=error >/dev/null 2>&1

  # Verify there's something to commit
  if [[ -z "$(git status --porcelain)" ]]; then
    echo "  ✓ no changes after install — kernel already in lockfile"
    git checkout main --quiet
    git branch -D "$branch" --quiet
    continue
  fi

  # Commit + push + PR
  git add package.json package-lock.json
  git -c user.email="$GIT_AUTHOR_EMAIL" -c user.name="$GIT_AUTHOR_NAME" commit -m "chore(deps): bump @upway/ui to ${short_sha}

Auto-propagated by scripts/bump-kernel.sh.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>" >/dev/null

  echo "  → push…"
  git push -u origin "$branch" --quiet

  echo "  → opening PR…"
  remote_url=$(git remote get-url origin)
  repo=$(echo "$remote_url" | sed -E 's|.*[:/](Upway-Travel/[^.]+)(\.git)?$|\1|')
  $GH pr create \
    --repo "$repo" \
    --title "chore(deps): bump @upway/ui to ${short_sha}" \
    --body "Auto-propagated by \`scripts/bump-kernel.sh\` from \`upway-ui@${TARGET_SHA}\`.

Lockfile regenerated alongside the package.json change so \`npm ci\` stays green.

🤖 Generated with [Claude Code](https://claude.com/claude-code)" \
    2>&1 | tail -1

  echo "  ✓ $consumer bumped"
  echo
done

echo "════════════════════════════════════════════════════════════"
echo "  done."
echo "  Merge the opened PRs once CI is green."
echo "════════════════════════════════════════════════════════════"
