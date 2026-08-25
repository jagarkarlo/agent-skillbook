---
name: diagnosing-bugs
description: 'Use when a bug, failed build, flaky test, or unexpected output is confusing, intermittent, or already survived one blind fix attempt, before trying another fix.'
---

# Diagnosing bugs

A second guess is not a strategy. Run this loop instead once a fix attempt has
already failed or the cause is not obvious.

## Loop

1. **Reproduce with the smallest unit.** One test, one function, one request,
   one file, not "run the whole suite" or "redeploy and see". If it cannot be
   reproduced small, that is the first finding, not a reason to skip this step.
2. **Confirm state against the real system, not memory or assumption.** Read
   the actual logs, the actual response body, the actual file on disk. Do not
   trust what a comment, an old note, or a previous conversation claims is true.
3. **One hypothesis at a time.** Write down what you expect to see *before*
   instrumenting, so the result can actually surprise you.
4. **Instrument, do not guess-fix.** Add the one log line, print, or debugger
   breakpoint that tests the hypothesis. Discard the hypothesis the moment
   evidence contradicts it, do not keep the fix and change the story to match.
5. **Apply the smallest fix that addresses the confirmed cause.** Re-run the
   exact repro from step 1 to confirm it is gone, not a broader "looks fine now".
6. **Record it.** One line: root cause, fix, and the repro that proves it. Put
   it wherever this project keeps that kind of note (a regression test, a
   changelog entry, a project memory/knowledge file), so the same bug is not
   rediscovered from scratch next time.

## Guard rails

- Two failed fix attempts in a row means stop and go back to step 1 with a
  smaller repro, not attempt three with the same one.
- A fix that cannot be explained in one sentence, tracing cause to effect, is
  not yet a diagnosis. Keep going.
- Do not accept "it works now" without knowing why it did not work before.
