---
name: knowledge-lint
description: 'Use when auditing, scoring or healing a curated knowledge base or notes directory: missing sources, stale or expired notes, near-duplicate titles, unscoped entries, oversized notes, or collector staleness.'
---

# Lint and heal a knowledge base

A knowledge base rots quietly: notes lose their source links, short expiry dates
turn historical incident reports "stale", and duplicate notes accumulate. Run a
measurable lint check and fix the root causes without fabricating provenance.

## North Star measures

| Measure | Target | How to compute |
| --- | --- | --- |
| `sourced` | `100%` | Every entry has at least one `{ label, url }` source link. |
| `current` | `>= 80%` | `freshness` computed on read from `verifiedAt` and `expiresAt`. |
| `duplicates` | `0` | Pairwise Jaccard similarity on non-stopword title tokens `< 0.75`. |
| `malformed` | `0` | Metadata header parses cleanly and required fields exist. |
| `mapChars` | `<= 1800` | Level-1 orientation map fits its context budget. |
| `versioned` | `true` | Knowledge directory is a clean Git worktree with no uncommitted edits. |

## Healing rules

1. **Missing sources (`no-source`).** Read the note's body and scope first.
   Extract the real repository path, ticket URL, pull request, or documentation
   link it already cites. Never invent a placeholder URL just to pass the check.
2. **Stale vs. historical (`stale` / `expired`).**
   - If the note describes volatile live state (quotas, active endpoints,
     current versions), re-verify it against the live system and update
     `verifiedAt` and `expiresAt`.
   - If the note is a dated historical incident or audit record, keep
     `verifiedAt` as the incident date and remove the artificial `expiresAt` so
     it remains a permanent historical record.
3. **Near-duplicates (`duplicate`).** Read both entries, merge the verified
   facts and sources into the stronger ID, and delete the duplicate.
4. **Oversized notes (`oversized`).** Split notes above 6,000 characters by
   topic so passage retrieval stays focused.
5. **Collector drift.** Surface any collector older than 7 days (or whose last
   run failed) right in the Level-1 map so stale indexes are noticed at session
   start.
