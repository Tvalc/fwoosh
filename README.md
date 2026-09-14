# FWOOSH

A portrait fire-rescue game: absorb fire from villagers, manage the heat you carry, vent to heal, and turn rescues into an advantage against Keith. Five districts lead through Ashford to Keith's House.

## Checkpoint

Reviewed 2026-09-14 against main `d7945b4` and a local refactor snapshot captured at 18:06 UTC. The committed game is self-contained in `index.html`. Cursor is splitting it into `js/`, `css/` and `media/`; that uncommitted work is **not included in this documentation branch**. Do not copy an old `index.html` over it or assume it is published.

## Play locally

From the game folder: `python -m http.server 8080 --bind 127.0.0.1`, then open `http://127.0.0.1:8080`. This works with both layouts. Local saves are separate from GitHub Pages; use the same browser and origin to retain test progress.

- Desktop: click toward a point or drag to dash; WASD/arrows steer; Shift dashes; hold Space to vent.
- Touch: swipe or tap to dash; hold the VENT button to vent. Dashing cancels venting.
- Heat persists until vented. It increases rescue rewards and chain reach but drains health.
- Embers bank at run end. Well and Forge upgrades persist.

Production reference: https://tvalc.github.io/fwoosh/ — verify deployment before calling any new change live.

## Project records

- [Ownership board](https://github.com/Tvalc/fwoosh/issues/1) and [working agreement](docs/COORDINATION.md)
- [Status and pending decisions](docs/STATUS.md)
- [Combat roadmap](COMBAT_ROADMAP.md) / [Meta roadmap](META_ROADMAP.md)
- [Art specification](ART.md) / [asset preservation](docs/ASSET_PRESERVATION.md)
- [Save-data contract](docs/SAVE_DATA.md) / [audit findings](docs/AUDIT.md)

Earlier proposals are preserved in `docs/archive/`; they are historical references, not current specifications.

## Checks

`node tools/audit-game.cjs <game-folder> <report.json>` runs actual game scripts with isolated in-memory saves and a stubbed canvas. It is not an animation-quality or balance test. Known failures remain visible and produce a nonzero exit.

For the modular layout, `python tools/audit-assets.py <game-folder> <report.json>` checks local file references and PNG atlas dimensions. Browser and packaging checks remain required after integration.

Cursor owns its current refactor and animation batch. Codex owns records, source recovery and the progression audit. Separate folders and feature branches are required. Shared runtime edits require a handoff; do not merge another agent's unfinished work.
