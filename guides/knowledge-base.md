# A knowledge base an agent can trust

The goal: every question is answered from verified, sourced knowledge in one or
two cheap steps, and every working session leaves the knowledge base slightly
more complete, never more bloated, and always revertible.

## Three layers

| | Collected | Curated | Live |
| --- | --- | --- | --- |
| Written by | Collectors, from APIs and repositories | You and your agents | Nobody; called on demand |
| Source of truth | Upstream systems | Markdown files | Upstream systems, right now |
| Rebuildable | Yes | No, it is the original | Nothing stored |
| Use for | Finding where things are | Conclusions, decisions, runbooks | Current state and writes |

The database is a build artifact. Anything concluded must outlive it, so
curated entries are Markdown first and indexed second. Never answer a "what is
the current state" question from the collected layer without a live check.

## Curated entries

- One Markdown file per entry, metadata as JSON in an HTML comment at the top,
  then normal Markdown. Readable in any editor, diffable in review.
- Required: title, summary, sources, `verifiedAt`. Set `expiresAt` for anything
  volatile. Freshness is computed on read.
- Writes refuse credential-like content. Store where a secret lives, not its value.

## History and undo

Make the knowledge directory a Git repository. Every save, delete and manual
edit becomes a commit; edits made while the server was down are committed on
startup. Undo creates a new revert commit, never rewrites history. Agents get
three tools: history (list or diff), revert (with explicit confirmation), and
lint.

## Governance

Keep two short documents inside the knowledge directory:

- **North Star:** the one-sentence goal plus measurable targets.
- **Rules:** what may be stored, required fields, what never to store.

A lint command scores the knowledge against them: missing sources, stale or
expired entries, duplicate titles, malformed files, entries without a project,
level-1 map over budget, uncommitted edits. Fix what it lists; do not invent
sources to raise the score. Surface any collector older than 7 days in the
level-1 map so stale indexes are noticed immediately at session start, and
verify `.git/HEAD` (or a valid worktree `gitdir:` target) when discovering local
clones so an empty `.git` directory at a hub root never blocks recursion.

## Session journal

Lifecycle hooks (session start, prompt, tool use, compaction, stop) append
redacted events to `sessions/<id>/journal.jsonl`, terminal commands to
`commands.txt` and a readable `SESSION.md`. Files are private (mode 0600) and
excluded from the knowledge repository: sessions are evidence, curated entries
are conclusions. After compaction, the agent reads the digest instead of
guessing what happened.

## A knowledge gate, not a nag

At the end of a turn that changed things (two or more edits or commands) and
saved nothing, block the stop once and ask the agent to save one verified entry
or state that nothing was reusable. Record that the gate fired so it never loops.
Hook failures must be non-blocking; a broken journal cannot stop work.

Note: in VS Code agent hooks, `Stop` fires when the agent is about to finish a
response, not when the session ends.
