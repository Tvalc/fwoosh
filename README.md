# FWOOSH

A portrait fire-rescue game: absorb fire from villagers, manage the heat you carry, vent to heal, and turn rescues into an advantage against Khet-Tak-Tor, the Ratkin Arbiter. Duy wakes in a burning ratkin town after death. Save-compatible `keith` media and diary identifiers remain until Cursor's approved Ratkin Makko replacement is integrated.

## Checkpoint

The non-Makko ratkin prototype remains removed; villagers use the existing Makko townsfolk animation and cinder venting uses the original Makko sheet. The Ratkin Quarter now provides player-laid roads, four building types, offline construction, ember sealing, food/material logistics, visible carriers, congestion and optional priorities. Its presentation reuses verified Makko environment art plus code-native interface elements while Ratkin-specific Makko production continues. See `docs/CANON.md`, `docs/CITY_FOUNDATION.md`, `docs/LOGISTICS.md` and `docs/STATUS.md`.

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
