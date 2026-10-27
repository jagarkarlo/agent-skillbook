---
name: research
description: 'Use when researching documentation, API behavior, library versions, prior art or architectural alternatives and the answer needs traceable evidence instead of memory.'
---

# Research with evidence

## Method

1. **Write the question** and what would change your decision.
2. **Primary sources first:** official docs for the installed version, release
   notes, source code, the API itself. Blog posts are leads.
3. **Check versions.** Pin what you read to the version actually in use; check
   the latest release before recommending a version pin.
4. **Keep a source for every claim.** URL, version, retrieval date.
5. **Separate fact, inference and opinion** in the answer.

## For "is this idea new?"

- Search code hosts directly (repository search sorted by stars) and paper
  indexes. Small new repositories appear constantly; never claim "first".
- Ask an independent reviewer (a subagent with no stake) to find prior art and
  argue for an alternative. It finds what focused searching misses.
- Re-check prior art at every milestone; it goes stale fast.

## Practical limits

- Search-engine result pages often block automated fetches or show CAPTCHAs
  after a few requests. Prefer direct project pages and documented APIs.
- Some academic APIs rate-limit quickly; space requests and cache results.
- If a source cannot be fetched, say so and mark the claim unverified instead of
  filling the gap from memory.
