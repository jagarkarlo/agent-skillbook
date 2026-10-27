# Templates

Copy, then adapt names and paths to your project.

## Instructions

Always-on rules for agents that read `*.instructions.md` (for example GitHub
Copilot in VS Code: `.github/instructions/` per repository, or your user prompts
folder for every workspace).

| File | Purpose |
| --- | --- |
| [api-first](instructions/api-first.instructions.md) | Use MCP tools and service APIs for live facts before shell, browser or web. |
| [no-ai-attribution](instructions/no-ai-attribution.instructions.md) | Keep AI credit out of commits, tags and pushes. Pair with [git-attribution-guard](../tools/git-attribution-guard/). |
| [knowledge-first](instructions/knowledge-first.instructions.md) | Cheap recall, live verification and disciplined knowledge capture. |

Each uses `applyTo: '**'`, which loads on every request. Keep such files short;
scope everything else narrowly.

## Hooks

[agent-policy](hooks/) re-injects a one-paragraph policy at `SessionStart`,
`UserPromptSubmit` and `SubagentStart`. Instructions can drift out of attention
in long sessions and may not reach subagents; a hook runs every time. Put the
JSON in your agent's hooks directory (VS Code: `~/.copilot/hooks/` for the user,
`.github/hooks/` per repository) and fix the absolute path.

## Custom agents: do not hide your MCP servers

A custom agent with a `tools:` list sees only what that list names. A list of
built-ins (`read`, `search`, `edit`, `execute`) silently removes every MCP server,
and the agent then "forgets" to use your APIs. Either omit `tools:` to inherit
everything, or add each server explicitly:

```yaml
tools: [read, search, edit, execute, todo, 'knowledge/*', 'grafana/*', 'jira/*']
```
