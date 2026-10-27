---
name: tdd
description: 'Use for test-first features and bug fixes, red-green-refactor, adding a missing regression test, or when a fix needs proof that it works and stays working.'
---

# Test-driven loop

## Loop

1. **Red.** Write the smallest test that fails for the right reason. Run it and
   read the failure message; a test that fails for the wrong reason proves nothing.
2. **Green.** Make the smallest change that passes. No extra features.
3. **Refactor.** Clean up with the test still green. Run the whole suite.
4. **Commit.** One behavior per commit, test and code together.

## Bug fixes

- Reproduce the bug as a test first. If you cannot, the first finding is that
  the reproduction is missing, not that the bug is gone.
- Keep the fixture minimal and named after the failure ("short page deletes
  items", "ticket ABC-34 matches ABC-340").

## Test quality

- Test behavior through the public surface, not private helpers.
- Fake the network at the boundary (an injectable `fetch`), never call real
  services from unit tests, never test writes against production.
- Include one end-to-end test of the real entry point (server, CLI) to catch
  wiring and schema mistakes unit tests miss.
- Treat `cancelled`, `skipped` and `todo` in the summary as failures until explained.
- Run the suite on every runtime version you claim to support.

## Do not

- Weaken an assertion to make it pass.
- Write the test after the fix and call it test-first.
- Mock the thing under test.
