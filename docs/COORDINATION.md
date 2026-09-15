# Fwoosh working agreement

Established 2026-09-14. Shared tracker: https://github.com/Tvalc/fwoosh/issues/1

| Owner | First-batch scope | Boundaries |
|---|---|---|
| Cursor | Current modular split; cinder vent correction; ratkin run prototype | Existing index.html, js/, css/, media/, animation pipeline and packaging. Preserve uncommitted work. |
| Codex | Progression/save reliability, tests, records, source preservation | Independent checkout; scoped changes to meta.js, sim.js, opp.js, Shrine drawing, description, docs and tools. |
| Tony | Art approval, canon, larger product decisions | Ratkin approval precedes cast expansion; canon decision precedes story rewrites. |

Cursor keeps its current folder and an existing feature branch or `cursor/game-and-animation`. Codex uses an independent repository on `codex/progression-fixes`; its earlier records are on `codex/project-foundation`. Two branches in the same folder are insufficient. Keep `animation-baseline` intact.

## Integration

1. Every issue records owner, status, scope, affected paths, dependencies, acceptance criteria, validation and final commit/PR.
2. Commit the modular refactor separately from animation work. Push the feature branch and hand over the exact commit and checks.
3. Codex compares the result with its reviewed snapshot and checks the combined code, docs and media.
4. Integrate one completed change at a time. Resolve actual diffs; never overwrite a newer file with a whole older copy.
5. Codex coordinates integration/release. No force-pushes, automatic merges or deployment of unfinished gameplay changes. A draft PR is not a release.

Tony explicitly reaffirmed parallel work on September 14. Codex continues its lane while Cursor works; integration is not a prerequisite. Shared files may receive small independent patches, reconciled by diff later. Never replace Cursor's active files. Existing explicit instructions from Tony take precedence. Preserve source assets independently of runtime output; see [ASSET_PRESERVATION.md](ASSET_PRESERVATION.md).

## Assignments

- [#2 Codex foundation and audit](https://github.com/Tvalc/fwoosh/issues/2)
- [#3 Cursor refactor and animation](https://github.com/Tvalc/fwoosh/issues/3)
- [#4 Final-district completion](https://github.com/Tvalc/fwoosh/issues/4)
- [#5 Multiple building unlocks](https://github.com/Tvalc/fwoosh/issues/5)
- [#6 Duplicate settlement robustness](https://github.com/Tvalc/fwoosh/issues/6)

Deferred until scoped: heroes/mastery, Tavern and later buildings, feud redesign, district art expansion, audio production, daily challenges and monetization.

## Latest authorization

Tony authorized the immediate combined release and deployment after each major completed change for live testing. Codex integrates Cursor 2d9316c, verifies, and publishes; no further release permission is required for these scoped changes. Keep original checkouts untouched. Codex continues the story/city interview here; the separate Vovinam Ledger task receives shared decisions explicitly.

## Current scoped work

Tony approved the vent-risk package after interview: Codex implements/tests/publishes from codex/vent-commitment in its isolated checkout. Cursor continues the Fwoosh Makko art/animation lane. Existing core gameplay and ember economy now take priority over city expansion. Shared files touched: constants.js, sim.js, input.js, draw.js, main.js and build marker; reconcile by diff with any later Cursor delivery.
