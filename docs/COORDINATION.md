# Fwoosh working agreement

Current board: https://github.com/Tvalc/fwoosh/issues/1

Current roadmap: [ROADMAP.md](ROADMAP.md)

Release history: [STATUS.md](STATUS.md)

Tony's explicit instructions supersede these defaults.

## Ownership

| Owner | Current work | Tracker |
|---|---|---|
| Tony | Playtest feedback, art approval, canon and economy decisions | #26 and decision-dependent issues |
| Cursor | Makko animation and illustration production in its own checkout | [#31](https://github.com/Tvalc/fwoosh/issues/31) |
| Codex | Core-loop tuning, city systems, saves/tests, integration, records and releases in its own checkout | [#26–#30, #32–#33](ROADMAP.md) |
| Separate Ledger task | Vovinam Ledger recovery and RPG implementation | Shared decisions via #30 and the handoff record |

## Non-negotiable art rule

All Fwoosh artwork must come from Makko. This includes characters, animation, environments, buildings, UI art, effects and diary illustrations. Preserve source URLs/raw exports and record processing. Do not substitute another generator, stock art or newly drawn replacements unless Tony explicitly changes the rule. Regenerate art if chroma removal damages character colors.

## Parallel work

- Cursor keeps `C:\Users\19415\fwoosh` and its feature branch. Codex never resets, cleans, stashes, switches or overwrites that checkout.
- Codex works in its isolated checkout and may make scoped runtime changes while Cursor produces art.
- Cursor hands off exact branch/commit, changed paths, Makko sources, frame metadata and preview evidence. Codex reviews actual diffs, integrates, runs checks and publishes.
- Shared-file changes are reconciled line by line. Never replace a newer file with a whole older copy.

## Issue and release discipline

Every active issue states owner, status, scope, dependencies and acceptance criteria. Ideas without Tony's approval stay in the roadmap parking lot rather than appearing as committed work.

Keep code, balance, prose and art changes separable. Preserve existing localStorage fields or test an explicit migration. A fixture or automated audit is evidence, not human balance or physical-device approval.

Tony authorized publishing each verified major change to the live site for testing. Codex coordinates merges and releases. Record the tested source, feature commit, merge commit, deployment and live URL; do not describe a local or pushed build as deployed.

## Current order

While Tony playtests and Cursor finishes Makko work, Codex maintains the board and prepares evidence-driven core-loop tuning. Then implement #27 city foundation, #28 logistics, #29 favor/ending and #30 Ledger integration in that order. Audio and final platform preparation follow under #32.

Historical batch assignments and shipped feature scopes are preserved in GitHub closed issues and [STATUS.md](STATUS.md); they are not current instructions.
