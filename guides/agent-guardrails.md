# Agent guardrails that actually hold

Writing a rule in an instructions file makes it likely, not certain. Rules that
matter need a layer that runs whether or not the model remembers them.

## Layers, weakest to strongest

| Layer | Runs | Good for | Fails when |
| --- | --- | --- | --- |
| Instructions (`*.instructions.md`, `AGENTS.md`) | When loaded into context | Preferences, routing, style | Long sessions, subagents, a model that ignores it |
| Custom agent definitions | When that agent runs | Role, tool access | The `tools:` list hides tools you wanted |
| Agent lifecycle hooks | Every session, prompt, tool call | Re-injecting policy, journaling, gating | The client does not support hooks, or the hook errors |
| Local Git hooks | Every commit and push on this machine | Commit message and identity rules | `--no-verify`, another machine, API commits |
| Server-side rules | Every push to the remote | Organization-wide guarantees | Nothing client-side can bypass them |

Use the strongest layer the rule deserves, and the cheaper ones as well so the
agent does the right thing before a hook has to refuse it.

## Pitfalls seen in practice

- **A `tools:` allowlist hides MCP servers.** Agents with `tools: [read, edit,
  execute]` cannot see your API tools at all, then appear to "forget" them.
  Omit the list or name each server (`'myserver/*'`).
- **Workflow text can contradict the rule.** An agent body saying "check the
  knowledge base first, only then live systems" overrides a global "API first"
  rule in practice. Audit agent bodies when you change a global rule, and add a
  test that fails if the old wording returns.
- **Editors add attribution on their own.** Check settings such as
  `git.addAICoAuthor` instead of trusting instructions.
- **`confirm: true` is not authorization.** It shows intent. Permissions belong to
  the token and the service.
- **Hooks must fail open for logging, closed for policy.** A journal that crashes
  must not block work; a policy check that cannot inspect must refuse.
- **Check `HEAD` is not enough.** A push publishes every new commit; inspect
  all of them, plus annotated tags.

## Approval boundary

Read-only checks need no confirmation. Ask before anything shared or
persistent: push, merge, comments, ticket or page edits, dashboards, jobs,
uploads, deployments, rewriting published history. Being asked to test is
permission to test, not to make it permanent.
