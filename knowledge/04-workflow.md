# 04 — Workflow (branches)

- `main` is the stable branch. It always builds, typechecks and passes tests.
- Every branch starts from an up-to-date `main`:
  `git checkout main && git pull && git checkout -b <type>/<name>`.
- `develop` integrates work in progress. It may be temporarily broken.
- Naming: `feature/<name>`, `fix/<name>`, `spike/<name>` for throwaway
  experiments.
- Flow: `feature/*` and `fix/*` merge into `develop`; `develop` merges
  into `main` through a pull request.
- `spike/*` branches are deleted after the decision, merged or not.
- Never commit directly to `main`.
