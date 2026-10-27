---
name: durable-knowledge
description: 'Use at the end of a task to decide whether to save a verified, reusable fact, decision, runbook or incident fix, and how to save it with provenance so it stays trustworthy and revertible.'
---

# Keep what was learned, not what was said

## Decide

Save only when all are true:

- **Verified** against a real system, test or document in this session.
- **Reusable** by a future task (a convention, a root cause, a working command,
  a decision and its reason).
- **Not already saved.** Search first; update the existing entry instead of
  creating a near-duplicate.

Otherwise say "nothing reusable" and move on. Do not save that a task happened.

## Save

| Field | Rule |
| --- | --- |
| Title | What someone would search for. |
| Summary | One or two sentences with the conclusion. |
| Content | Evidence, exact commands, limits, what was *not* verified. |
| Sources | Links to the ticket, doc, commit or file that proves it. |
| `verifiedAt` | When you checked it, not when you wrote it. |
| `expiresAt` | Set for anything volatile: versions, access, counts, owners. |
| Project and tags | So scoped searches find it. |

## Keep it trustworthy

- Files (Markdown) are the source of truth; any search index is rebuildable.
- Version the knowledge directory with Git so every change is reviewable and
  revertible. Undo with a new commit, never by rewriting history.
- Compute freshness on read. Stale or expired entries are leads to re-check.
- Correct, don't append: when new evidence contradicts an entry, update it and
  say what changed.

## Never save

Secrets or tokens (store where they live instead), raw logs or transcripts,
guesses, temporary progress, or anything copied from an untrusted response
without verification.
