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

Vent-risk PR #12 is deployed (2026-09-14-vent-1). Tony next approved zero ember payouts from vent-created demons and a first-run permanent choice between survivability and mobility. Codex implements/tests/publishes 2026-09-14-economy-1 from codex/first-upgrade-economy in its isolated checkout. Scope: meta.js, opp.js, sim.js, draw.js, build/script versioning, tests and records. Cursor continues the Fwoosh Makko art/animation lane. Existing core gameplay and ember economy take priority over city expansion. Reconcile shared-file changes by diff with any later Cursor delivery. ECONOMY_TUNING.md records behavior and initial prices; issue #1 records deployment verification.

## Uncapped ember scope

Tony confirmed removing the reward cap. Codex implements/tests/publishes economy-2 on codex/uncapped-embers, touching constants.js, sim.js, build/script versions, regression checks and records in its isolated checkout. Cursor continues Makko art. Preserve all prior starter purchases and existing saves. Later economy targets are approved (2–3 ordinary runs, skilled approximately twice as fast), but rates/prices/effects require tuning; do not claim those targets have already been measured or delivered.

## Reward/retry release scope

Tony approved the saved-research recommendations and prior economy pacing targets. Codex implements loop-1 in its isolated codex/reward-retry-loop branch: meta.js, sim.js, opp.js, input.js, draw.js, index version, tests and records. Cursor continues Makko art. Integrate these scoped gameplay changes rather than overwriting whole files from an older checkout. 81 checks and local browser fixture QA pass. Current price values are initial tuning, not confirmed human balance. No forced run timer; no city expansion. Deployment evidence lives in issue #1.

## Prose discovery rewrite — 2026-09-15-prose-1

Tony requested a complete prose rewrite following the author-craft research and confirmed that players should feel disoriented, under pressure and gradually discover what happened. The deeper story remains optional.

All fifteen diary entries (78 short pages), their teasers, Keith's opening, greetings, reactions and fourteen later observations were rewritten. Duy's ordinary memories establish warmth and relationships; later entries reveal the market, afterlife, cell, debt and gate through his limited viewpoint. Mei's coercion is explained in her later confession rather than presented as knowledge Duy already possessed in the market. The early wraith entry does not reveal the cell's massacre. Keith's automatic speech gives immediate guidance and fragments rather than reciting the entire backstory. Shrine and diary labels and the public description were adjusted to match. Ratkin judgment still determines release; the final optional entry describes the restoration/favor obligation without adding a finished ending or redemption mechanic.

Chapter IDs, titles, art assignments, unlock predicates, hints and saved read history are unchanged. Gameplay, economy and art are unchanged. INTRO_VERSION is 4 so the revised live opening plays once for returning players; it still allows movement, dash and vent. Existing progression is retained. Older loreIdx progress is preserved; later observations are not forcibly replayed.

Validation: all 81 gameplay/input checks pass in reports/prose-state.json, including intro control and one-time replay/save preservation. A comparison against the prior story verifies identical diary identities/art/unlocks/hints and STORY data structure. Browser measurement with the loaded Pixelify font checks all 78 pages, seven opening lines and fourteen lore lines: maximum diary baseline 728 (navigation begins below 1160), opening baseline 943 (available through 1008), lore width 587.425 within 700. Local 320px visual checks cover a diary page, one of the longest pages and the opening during gameplay; no console errors observed. Voice and reading pace remain subject to Tony's playtest.

Release verification and final commit/PR are recorded in issue #1. No new art, factions, magic explanation, city system or Invoice conversion was invented. The author research informs general craft; the passages are original to Fwoosh.
