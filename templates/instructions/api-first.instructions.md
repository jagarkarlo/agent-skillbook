---
name: 'API First'
description: 'Always route live-system questions and actions through configured MCP tools and service APIs before shell HTTP, browser or web search.'
applyTo: '**'
---

- Applies to the main agent and every subagent. Before answering a question about
  live state (tickets, merge requests, pipelines, dashboards, jobs, storage),
  discover the relevant MCP tools and call the owning service.
- Indexed knowledge and memory are background, not live verification. Local
  source and tests decide implementation facts; the local Git CLI handles
  repository status, commits and pushes.
- If a named tool cannot do it, use the configured generic API tool, then a direct
  authenticated API call, and say why. Browser and web search are for UI checks or
  documented API gaps.
- Missing credentials, unavailable tools and 401/403 are blockers to diagnose,
  not permission to guess, bypass authentication or claim success.
- Read-only checks need no confirmation. Ask before shared writes: push, merge,
  comments, ticket/page/dashboard changes, jobs, uploads, deployments. A read-only
  POST search is not a write. Never print secrets or copy browser cookies.
