---
name: observability-triage
description: 'Use for missing metrics, empty dashboard panels, silent alerts, missing logs, scrape failures, telemetry pipelines (Prometheus, Grafana, Loki, OpenTelemetry) or deciding who owns a monitoring gap.'
---

# Triage a telemetry gap

Work from the source to the screen; each hop can drop data silently.

## Hops

1. **Emitter.** Does the process expose the metric or write the log line? Query
   the endpoint directly.
2. **Collection.** Is the target discovered and scraped (target state, last
   scrape, errors)? Is the log shipper reading the right files and labels?
3. **Storage.** Does a raw query for the series or stream return data for the
   time range? Check retention and label cardinality limits.
4. **Query.** Do the panel's query, variables and units match the stored labels?
   A renamed label empties a panel without an error.
5. **Alerting.** Rule evaluates, has data, routes to a receiver that exists.
   "No data" handling decides whether silence is OK or an alert.

## Rules

- Never invent metric names or labels. List them from the data source first.
- An endpoint exposing `/metrics` does not prove anything collects it.
- Do not present a proxy signal (a pod being up) as health of an external
  managed service (a database, object storage). Say what is actually measured.
- Edit dashboard sources, not generated artifacts, when both exist.
- If the gap is in a component another team owns, hand off with evidence: the
  query, the time range, the expected and observed result.
