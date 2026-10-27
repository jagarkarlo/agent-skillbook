---
name: code-review
description: 'Use when reviewing a diff, pull request, merge request, branch or uncommitted changes for correctness, regressions, security, scope and missing tests.'
---

# Review a change

Review the change, not the author. Say what would break and how to prove it will not.

## Order

1. **Requirement.** Restate what the change must do. Unrelated edits belong elsewhere.
2. **Correctness.** Trace each changed path with a concrete input, including
   empty, maximum, malformed and concurrent cases.
3. **Regressions.** What callers, configs or data depend on the old behavior?
4. **Security.** Secrets in diff, messages or CI variables; injection; path
   traversal; auth on every write; untrusted input reaching shells or queries.
5. **Blast radius.** Shared defaults change every environment at once; say so.
6. **Reversibility.** Can a revert undo it, or is there a manual or data step?
7. **Verification.** A command and its observed result, not "tested locally".
8. **Tests.** Does a test fail without the change?

## Report

- Verdict first: approve, approve with comments, or request changes.
- Then blocking findings, then suggestions. Each with file, line, why it
  matters, and the concrete fix.
- Quote a few lines at most per finding.

## Do not

- Approve, merge, comment or push on someone's behalf without being asked.
- Pad the review with style nits a linter would catch.
- Report a finding you have not traced to an actual input.
