# FWOOSH

A portrait fire-rescue game: absorb fire from villagers, manage the heat you carry, vent to heal, and turn rescues into an advantage against Keith. Duy wakes in a burning ratkin town after death. Keith is his jailer; later diary entries reveal why he must rebuild and earn the ratkin's judgment.

## Checkpoint

This release combines Cursor's modular refactor and Makko-source restoration through `2d9316c` with Codex's progression/input fixes, records and backup tools. The non-Makko ratkin prototype is removed; villagers use the existing Makko townsfolk animation and cinder venting uses the original Makko sheet. New city/release systems are approved design work, not yet implemented. See `docs/CANON.md` and `docs/STATUS.md`.

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

Cursor owns refactoring and animation. Codex independently handles progression/save reliability, tests, records and source preservation. Use separate folders and feature branches; reconcile overlapping diffs during integration. See the backup commands in [source preservation](docs/ASSET_PRESERVATION.md).
