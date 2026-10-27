---
name: gitops-review
description: 'Use when creating or reviewing Kubernetes manifests, Helm charts, values files, Kustomize overlays or GitOps application definitions before rollout.'
---

# Review declarative Kubernetes & GitOps changes

Catch drift, blast-radius mistakes and broken selectors while the change is
still a file in Git.

## Order of checks

1. **Blast radius first.** Is this editing a shared chart default (`values.yaml`,
   `templates/`) or a single environment override (`values/<env>.yaml`)? Shared
   defaults change every cluster at once; state that explicitly.
2. **Render before judging.** Run `helm template` or `kubectl kustomize` and
   inspect the rendered manifests, not just the YAML diff.
3. **Schema & API versions.** Validate against the cluster's Kubernetes and CRD
   versions (`kubeconform -strict` or `kubectl apply --dry-run=client`).
4. **Selectors & ports.** Deployment `selector.matchLabels` must match pod
   `template.metadata.labels`; Service `targetPort` must match the container port.
5. **Resources & probes.** Every long-running workload needs CPU/memory requests
   and limits, liveness/readiness probes, and pinned image tags (never `latest`).
6. **Secrets boundary.** Commit secret templates or external-secret references
   only, never literal tokens, passwords or certificates.
7. **Rollout & rollback.** Confirm how the GitOps controller reconciles the
   change and whether reverting the Git commit cleanly rolls it back.
