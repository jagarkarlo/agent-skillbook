---
name: writing-for-agents
description: 'Use when writing or editing instructions, agent, or skill files for a coding agent, or when a response from an agent feels bloated and needs tightening for token cost.'
---

# Writing for agents

Files that describe how an agent should behave are loaded on every turn they
apply to, so their cost compounds. Write them like a budget, not documentation
for a human who reads it once.

## Rules

- **The description is the only thing that decides if this loads at all.** Put
  the trigger words a person or router would actually type into it. A vague
  description means the file is either never found or always loaded, both bad.
- **State the rule, not the reasoning.** "Keep responses under N lines unless
  asked" beats a paragraph explaining why verbosity is wasteful. Save the "why"
  for one line, if at all.
- **Prefer a table or a short list over prose.** Scannable beats readable-aloud.
- **Point at a path or an ID, do not repeat the content.** Reference a file, a
  ticket, a knowledge entry instead of quoting what it contains.
- **One example, not three.** A single concrete example teaches the pattern;
  more just re-explains the same shape.
- **Cut restated code.** Never comment or narrate what the next line already
  shows. Apply this to generated code, commit messages, and chat replies alike.
- **A rule that always loads for every file is expensive.** Reserve
  always-on scope for the one or two files that truly must always be present;
  scope everything else narrowly.

## A shared vocabulary is the biggest lever

If the codebase has jargon, keep a short glossary (a `CONTEXT.md`, a `GLOSSARY.md`,
whatever the project already uses) that maps terms to their meaning. An agent
that knows a domain's vocabulary spends fewer tokens disambiguating and names
things consistently with the rest of the codebase. Update it the moment a new
term gets coined in conversation, do not let it drift out of date.

## Applying this to a live response

When a task feels like it burned an unreasonable share of the budget for what
it accomplished, treat it as a bug in the project's instructions, not bad luck:

1. Which file loaded that did not need to (wrong scope, wrong description)?
2. What got quoted in full that should have been a reference?
3. Was there one focused context-gathering step, or did exploration happen
   piecemeal, search by search?

Fix the file, not just the one response, the next task pays the same tax
otherwise.
