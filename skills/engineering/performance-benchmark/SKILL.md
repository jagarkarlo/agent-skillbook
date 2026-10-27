---
name: performance-benchmark
description: 'Use before claiming something got faster, smaller or cheaper: latency, throughput, memory, response size, token cost or retrieval quality measurements.'
---

# Measure before claiming

## Method

1. **Name the metric and unit.** p50/p95 latency in ms, bytes, characters,
   requests per second, recall@k. "Faster" is not a metric.
2. **Fix the workload.** Same input set, same data size, same machine. Write it
   down so someone can rerun it.
3. **Warm up, then repeat.** Discard the first runs; report the distribution
   from enough repetitions to see variance.
4. **Measure baseline and change** with the same script, in the same session.
5. **Report the observed numbers** with the workload size. Small benchmarks are
   evidence, not a service-level objective; say so.

## Common traps

- Measuring a cached second run against a cold first run.
- Counting serialized characters and calling them model tokens or billing.
- Benchmarking a copy that silently failed to load (an empty database is fast).
- Recomputing a ratio by hand. Compute every derived number in the script.
- Optimizing the engine when the problem is retrieval quality. Measure answer
  quality on real queries before swapping infrastructure.

## When to change infrastructure

Only when a benchmark on realistic data shows the current tool cannot meet a
stated target. A local full-text index answering in milliseconds does not need
a database server.
