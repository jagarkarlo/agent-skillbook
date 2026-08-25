---
name: grilling
description: 'Use before starting a non-trivial plan, design, or piece of writing when the request is underspecified, to interview the user until every branch of the decision tree is resolved instead of guessing.'
---

# Grilling

Most misalignment between an agent and a user is not a skill problem, it is a
communication gap: nobody wrote down what "done" actually means. Grilling
closes that gap before any work starts, not after a first draft disappoints.

## How to run a grilling session

1. **Read what already exists first** (code, docs, the current conversation).
   Do not ask a question whose answer is already visible.
2. **Ask one focused question at a time**, not a wall of ten. Wait for the
   answer before asking the next; each answer usually changes what is worth
   asking next.
3. **Target the decisions that actually branch the outcome**: scope
   boundaries, what happens on the edge cases, who or what this needs to work
   for, what "acceptable" looks like, what is explicitly out of scope.
4. **Prefer closed questions with a recommended default** over open-ended
   ones. "Should X handle case Y by doing A or B? I'd default to A because
   ___" resolves faster than "What do you want here?".
5. **Stop when new questions stop changing the plan.** Grilling has a
   diminishing return; do not turn it into an interrogation for its own sake.
6. **Write down what was decided**, briefly, before starting the work. This
   becomes the spec you build against and the thing you check the result
   against afterward.

## When to skip it

- The request is small, reversible, and low-risk: just do it and show the
  result instead of interviewing first.
- The user already gave a detailed, unambiguous spec: confirm the one or two
  genuinely open points, do not re-litigate settled ones.
