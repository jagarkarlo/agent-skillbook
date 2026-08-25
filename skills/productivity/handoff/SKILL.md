---
name: handoff
description: 'Use when a session is ending, a subagent is about to hand work back, or the context window is filling up, and work needs to survive into durable notes instead of being lost.'
---

# Handoff

A handoff is the moment that decides what you just learned is worth keeping,
before it disappears with the context window.

## Steps

1. **Separate durable facts from in-progress state.**
   - Durable (outlives this task): a verified command, a root cause, an
     architecture decision, a convention, a preference the user stated
     explicitly. -> goes into whatever this project uses as durable memory
     (a knowledge base, `AGENTS.md`, a decision log, project memory).
   - In-progress (only useful to continue this exact task): what is half-done,
     what is blocked, what to try next. -> goes into session-scoped notes, not
     the durable store.
2. **Write the durable entries first, one per fact.** Search for an existing
   entry before creating a new one; update it instead of writing a
   near-duplicate. Do not bundle several unrelated facts into one entry.
3. **Write one short handoff note, not a transcript.** What is done, what is
   next, and any open question, each pointing at a file, a ticket, or a
   knowledge entry instead of repeating its content.
4. **If the handoff is to a human** (a status update, a ticket comment), lead
   with the literal error and the literal fix, not a narrative build-up. Match
   whatever format that person already uses for updates.
5. **If the handoff is to another agent or subagent**, the note only needs to
   be precise enough for a fresh context to pick up. Link, do not re-explain.

## Anti-patterns

- Saving a play-by-play of the conversation as "knowledge", that belongs in
  session notes, or nowhere.
- Re-describing something already written elsewhere instead of linking it.
- Skipping the handoff because the task "is not done yet". An interrupted task
  needs the in-progress note the most.
