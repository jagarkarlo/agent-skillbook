#!/bin/sh
# Installs the guard as this user's global Git hooks directory.
# Usage: ./install.sh [target-directory]   (default: ~/.config/git-attribution-guard)
set -eu

source_dir=$(cd "$(dirname "$0")" && pwd)
target=${1:-"$HOME/.config/git-attribution-guard"}

command -v node >/dev/null 2>&1 || { echo "node is required" >&2; exit 1; }

current=$(git config --global --get core.hooksPath || true)
if [ -n "$current" ] && [ "$current" != "$target" ]; then
  echo "core.hooksPath is already set to $current; not overwriting it." >&2
  echo "Merge the hooks manually or unset it first." >&2
  exit 1
fi

mkdir -p "$target"
cp "$source_dir/guard.mjs" "$source_dir/run-hook" "$target/"
chmod 755 "$target/run-hook"

# Every hook name routes through the guard, which delegates to the repository's own hook.
for hook in applypatch-msg pre-applypatch post-applypatch pre-commit pre-merge-commit \
  prepare-commit-msg commit-msg post-commit pre-rebase post-checkout post-merge pre-push \
  pre-receive update proc-receive post-receive post-update reference-transaction \
  push-to-checkout pre-auto-gc post-rewrite sendemail-validate fsmonitor-watchman; do
  [ -e "$target/$hook" ] || ln -s run-hook "$target/$hook"
done

git config --global core.hooksPath "$target"
echo "Installed. Global core.hooksPath=$target"
