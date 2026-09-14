# Fwoosh working agreement

Established 2026-09-14. Shared tracker: https://github.com/Tvalc/fwoosh/issues/1

| Owner | First-batch scope | Boundaries |
|---|---|---|
| Cursor | Current modular split; cinder vent correction; ratkin run prototype | Existing index.html, js/, css/, media/, animation pipeline and packaging. Preserve uncommitted work. |
| Codex | Records, inventory/recovery, reproducible audit | README, ART, roadmaps, docs/, tools/audit-*. No writes to Cursor's checkout. |
| Codex after refactor handoff | Confirmed progression fixes | Agree ownership before runtime/renderer edits. |
| Tony | Art approval, canon, larger product decisions | Ratkin approval precedes cast expansion; canon decision precedes story rewrites. |

Cursor keeps its current folder and an existing feature branch or `cursor/game-and-animation`. Codex uses an independent repository on `codex/project-foundation`. Two branches in the same folder are insufficient. Keep `animation-baseline` intact.

## Integration

1. Every issue records owner, status, scope, affected paths, dependencies, acceptance criteria, validation and final commit/PR.
2. Commit the modular refactor separately from animation work. Push the feature branch and hand over the exact commit and checks.
3. Codex compares the result with its reviewed snapshot and checks the combined code, docs and media.
4. Integrate one completed change at a time. Resolve actual diffs; never overwrite a newer file with a whole older copy.
5. Codex coordinates integration/release. No force-pushes, automatic merges or deployment of unfinished gameplay changes. A draft PR is not a release.

Reviewing another owner's work is welcome; changing its scope or files requires a handoff. Existing explicit instructions from Tony take precedence. Preserve source assets independently of runtime output; see [ASSET_PRESERVATION.md](ASSET_PRESERVATION.md).

## Assignments

- [#2 Codex foundation and audit](https://github.com/Tvalc/fwoosh/issues/2)
- [#3 Cursor refactor and animation](https://github.com/Tvalc/fwoosh/issues/3)
- [#4 Final-district completion](https://github.com/Tvalc/fwoosh/issues/4)
- [#5 Multiple building unlocks](https://github.com/Tvalc/fwoosh/issues/5)
- [#6 Duplicate settlement robustness](https://github.com/Tvalc/fwoosh/issues/6)

Deferred until scoped: heroes/mastery, Tavern and later buildings, feud redesign, district art expansion, audio production, daily challenges and monetization.
