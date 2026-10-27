---
name: docs-runbook
description: 'Use when writing or updating operational runbooks, troubleshooting guides, deployment notes or documentation sites so instructions stay executable and verifiable.'
---

# Write executable operational runbooks

An operational runbook is used when something is broken or changing. Write it so
an engineer can execute and verify every step without guessing.

## Structure

1. **Scope and prerequisites.** Target environment, required access/roles, and
   when *not* to use this runbook.
2. **Copy-pasteable commands.** Exact commands with explicit `<placeholders>`
   and redacted example values (`<your-token>`, never a real secret).
3. **Expected output.** Show the status code, log line or field that proves each
   step worked.
4. **Failure branches.** What HTTP 401 vs 403, timeout, or stale plan means and
   which component owns it.
5. **Rollback.** How to undo the change safely.
6. **Verification stamp.** Record what was tested live versus what is proposed,
   and when.

## Rules

- Read nearby pages and navigation first; update the owning page instead of
  creating a near-duplicate.
- Edit source files, never generated build output.
- Verify every internal relative link and code fence before finishing.
