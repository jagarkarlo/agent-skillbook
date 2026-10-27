---
name: collector-audit
description: 'Use when data collected from an API into a local index or knowledge base is missing, stale, duplicated or unexpectedly deleted: pagination, incremental cursors, pruning, retries, freshness, concurrent refreshes.'
---

# Audit a collector

A collector copies objects from an API into local storage. Most of its bugs are
silent: the run "succeeds" and data is quietly wrong.

## Questions, in order

1. **Did enumeration finish?** Compare the count collected with the API's total.
   A short page, a failed page or a hit `maxPages` limit means incomplete.
2. **Is pruning gated on completeness?** Deleting "everything not seen this run"
   is only safe after an authoritative, complete enumeration. Otherwise it
   deletes real data. Require an explicit `markComplete()`-style signal.
3. **Do incremental cursors overlap?** Re-read a window (minutes) before the last
   checkpoint. Clock skew and eventual consistency drop edge items without it.
4. **Is there a periodic full reconciliation?** Incremental reads cannot see
   deletions. Schedule a full pass (for example daily) and log when it last ran.
5. **Can two runs interleave?** Use one lease with renewal and expiry, shared by
   every entry point (CLI, server, scheduler), so a crashed run can be taken over.
6. **Are exact identifiers exact?** A search for `ABC-34` must not match
   `ABC-340`. Treat keys as phrases and keep them mandatory in fallbacks.
7. **Is freshness computed on read?** A stored "current" label goes stale by
   itself. Compute it from `verifiedAt`/`expiresAt` when reading.
8. **Are retries bounded and idempotent?** Unbounded retries hide outages;
   non-idempotent upserts create duplicates.

## Evidence to collect

- Run one collector, not "refresh everything". Record counts, pages, duration.
- Diff the local set against a direct API read for a small known scope.
- Check the stored checkpoint and lease rows, not only logs.

## Fix rules

- Add a regression test with a fixture that reproduces the loss (short page,
  failed page, boundary timestamp) before changing code.
- Never "fix" missing data by disabling pruning globally; gate it correctly.
