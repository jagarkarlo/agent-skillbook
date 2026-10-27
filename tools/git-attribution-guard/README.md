# git-attribution-guard

A global Git hook that refuses commits and pushes carrying AI attribution:
`Co-authored-by:` trailers, "Generated with/by …" lines, AI sign-offs, and AI
author or committer identities. Useful when you, your team or your employer
require that commit history shows only human authors, whichever agent or editor
produced the change.

Instructions alone are not enough: an agent can forget them and some editors add
trailers automatically. A hook runs every time.

## What it checks

| Hook | Check |
| --- | --- |
| `commit-msg` | The final message (after any repository hook edited it) and the author/committer identity. |
| `pre-push` | Every commit being published that the remote does not have yet, not only `HEAD`, plus annotated tag messages and taggers. New branches and tags included. |

Ordinary messages that merely mention a tool ("Prevent Copilot attribution in
commits") are allowed; only attribution lines and identities are rejected.

Existing repository hooks in `.git/hooks/` keep working: every hook name routes
through the guard, which runs the repository hook first.

## Install

```sh
./install.sh            # installs to ~/.config/git-attribution-guard
node --test guard.test.mjs
```

The installer refuses to overwrite an existing global `core.hooksPath`.

## Limits

- It protects Git on this machine for this user. Repositories that set their own
  `core.hooksPath`, other machines, and commits created through a hosting API
  need server-side rules (push rules, required checks) for the same guarantee.
- `--no-verify` skips client hooks. Pair it with an agent instruction that
  forbids bypassing hooks.
- It does not rewrite history. Fix offending unpublished commits yourself;
  rewriting published history needs agreement from everyone affected.

## Editor settings

VS Code can add an AI co-author trailer on its own. Turn it off explicitly:

```json
{ "git.addAICoAuthor": "off" }
```
