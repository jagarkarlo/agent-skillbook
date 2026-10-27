# Layered recall: give agents context at the cheapest level that works

Agents waste most of their budget on context: dumping whole documents, chaining
searches, re-reading what they already saw. Layered recall answers each
question at the smallest level that is enough, and every level tells the agent
how to go one level deeper.

## Four levels

| Level | Returns | Typical budget | Use for |
| --- | --- | --- | --- |
| 1 Map | Goal, rules, what the knowledge base holds, health, top projects | ~1,800 chars | Injected at session start; orientation |
| 2 Catalog | One line per match: id, type, title, scope, freshness, summary | ~3,000 chars | "Do we know anything about X?" |
| 3 Passages | The matching sections, at most two per entry | ~5,000 chars | The specific answer inside a long note |
| 4 Source | One entry in full, paged by offset | ~12,000 per page | Reading the whole runbook |

Every response carries a `next` hint ("call level 3 with id …"), so the agent
never has to guess how to escalate, and a `truncated` flag when the budget cut
something off.

## Building it

- **Chunk by headings.** Split documents into passages of roughly 900
  characters along Markdown headings; index them in their own full-text table.
- **Merge two rankings at level 2.** Whole-entry ranking is strong on titles and
  tags; passage ranking is strong on specific sections. Take candidates from
  both, deduplicated.
- **Exclude noise.** File-path listings and inventories match almost any query;
  keep them out of the catalog.
- **Keep exact identifiers exact.** Ticket keys and hostnames are phrases, not
  prefixes.
- **Generate level 1 and the catalog as files** too, so humans and grep can use
  them without the server.
- **Maintain passages on every save** and heal missing ones on startup, so an
  older process writing entries does not leave holes.

## Why lexical search before vectors

For a personal or team knowledge base (thousands of entries, not billions),
SQLite FTS5 with BM25 answers in single-digit milliseconds inside the server
process: no service to run, back up or secure. The limit is retrieval quality,
not engine speed. Fix quality first (passages, merged ranking, exact
identifiers), measure on real questions, and add a vector index only if a
benchmark shows paraphrase misses lexical search cannot fix.

## Measure it

Record serialized size and latency per level for a fixed set of real queries.
Report characters, not "tokens", unless you measured tokens; say the sample size.
