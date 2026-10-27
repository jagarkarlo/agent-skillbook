# agent-skillbook

Reusable skills for coding agents (Claude Code, Codex, GitHub Copilot, and
anything else that reads a `SKILL.md`). Small, composable, and meant to be
forked and edited, not installed as a black box.

A skill is one job an agent gets good at once, and reuses forever: recognizing
a failure mode, running a disciplined loop, or producing a consistent kind of
output. Each one is a single Markdown file with a frontmatter `description`
that tells an agent when to reach for it.

## Why

Agents fail in a few recurring ways: they build the wrong thing because nobody
aligned on what "done" means, they burn tokens re-explaining and re-exploring
things that were already settled, and they thrash on bugs by guessing instead
of diagnosing. These skills each target one of those failure modes, so you do
not have to re-teach the same discipline to every agent, every session.

## What's here

### Engineering

| Skill | Use when |
| --- | --- |
| [diagnosing-bugs](skills/engineering/diagnosing-bugs/SKILL.md) | A bug or flaky failure is confusing, or a first fix attempt already failed |
| [writing-for-agents](skills/engineering/writing-for-agents/SKILL.md) | Writing or editing instructions/agent/skill files, or a response feels bloated |
| [mcp-hardening](skills/engineering/mcp-hardening/SKILL.md) | Building or reviewing an MCP server or API tool: credentials, redirects, budgets, writes |
| [collector-audit](skills/engineering/collector-audit/SKILL.md) | Data collected into a local index is missing, stale, duplicated or deleted |
| [tdd](skills/engineering/tdd/SKILL.md) | Test-first features, bug fixes that need a regression test |
| [code-review](skills/engineering/code-review/SKILL.md) | Reviewing a diff, pull request or branch |
| [performance-benchmark](skills/engineering/performance-benchmark/SKILL.md) | Before claiming something got faster, smaller or cheaper |
| [auth-debugging](skills/engineering/auth-debugging/SKILL.md) | OAuth/OIDC, service accounts, bearer tokens, 401/403 |
| [observability-triage](skills/engineering/observability-triage/SKILL.md) | Missing metrics, empty panels, silent alerts, missing logs |

### Productivity

| Skill | Use when |
| --- | --- |
| [grilling](skills/productivity/grilling/SKILL.md) | A plan or request is underspecified, before starting the work |
| [handoff](skills/productivity/handoff/SKILL.md) | A session, or a subagent, needs to hand off durable facts vs. in-progress state |
| [wait-what](skills/productivity/wait-what/SKILL.md) | A reply did not land and needs a plain-language re-pitch |
| [research](skills/productivity/research/SKILL.md) | Docs, versions, prior art or alternatives need traceable evidence |
| [durable-knowledge](skills/productivity/durable-knowledge/SKILL.md) | End of a task: save a verified, reusable finding with provenance, or nothing |
| [teach](skills/productivity/teach/SKILL.md) | Someone wants a thorough, beginner-friendly explanation |

### Tools

| Tool | What it does |
| --- | --- |
| [git-attribution-guard](tools/git-attribution-guard/) | Global Git hook that blocks `Co-authored-by` trailers and AI attribution in commits, outgoing history and tags |

### Templates

[Instructions and hooks](templates/) to copy: API-first routing, no AI attribution, knowledge-first recall, and a policy hook that re-injects rules every prompt and into subagents.

### Guides

| Guide | Topic |
| --- | --- |
| [layered-recall](guides/layered-recall.md) | Four recall levels with budgets; why lexical search before vectors |
| [knowledge-base](guides/knowledge-base.md) | Collected, curated and live layers; Git history, governance, session journal |
| [agent-guardrails](guides/agent-guardrails.md) | Which rules need instructions, hooks or server-side enforcement |

This list grows over time. Skills here are deliberately generic: nothing in
this repo is tied to a specific employer, company, or private project.

For a matching MCP server that applies these rules (bounded, redacted output,
optional integrations, configurable API sources, durable notes), see
[contextloom-mcp](https://github.com/jagarkarlo/contextloom-mcp).

## Installing a skill

Copy the `SKILL.md` file (and its folder) into wherever your agent looks for
skills, and adapt the wording to your project's own vocabulary and tools:

| Agent | Skill location |
| --- | --- |
| GitHub Copilot (VS Code) | `.github/skills/<name>/SKILL.md`, `.agents/skills/<name>/SKILL.md` |
| Claude Code | `.claude/skills/<name>/SKILL.md` |
| Codex / other agents | check that agent's docs for its skill discovery path |

These are files you own once copied in. Trim what does not apply, rename
tools and paths to match your own project, and keep the `description`
specific so your agent actually finds it.

## Contributing

Pull requests adding a new skill, or sharpening an existing one, are welcome.
A good skill:

- Targets one recurring failure mode, not a whole workflow.
- Has a `description` with the concrete trigger words an agent or router
  would match on.
- Is written as rules and short lists, not narrative prose (see
  [writing-for-agents](skills/engineering/writing-for-agents/SKILL.md) for why).
- Contains nothing specific to a single company, employer, or private
  codebase.
- Passes `node scripts/validate.mjs` (frontmatter, folder name, links).

## Related

[dictionary-of-ai-coding](https://github.com/mattpocock/dictionary-of-ai-coding)
is a good companion: a plain-English glossary for the jargon that shows up
around agents and this kind of tooling.

## License

[MIT](LICENSE)
