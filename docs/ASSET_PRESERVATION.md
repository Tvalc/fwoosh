# Source-asset preservation

## Verified checkpoint

At 18:06 UTC on 2026-09-14, Codex captured the local working game and ignored sources: 233 files including 182 under assets/ (excluding Python bytecode cache). Every archived file was read back and SHA-256 verified; sources were checked for changes during capture.

- Archive: Fwoosh-recovery-2026-09-14.zip
- Size: 93,259,900 bytes
- SHA-256: f24be7dabd7a4d14e0934b025561277d1a29abb3f25a351178ec6f40ae06dc6d
- SNAPSHOT.json is inside; Fwoosh-recovery-manifest.json is beside it in Tony's Codex task outputs.

This is a local recovery checkpoint on the same computer, **not an off-device backup or release package**. It includes Cursor's uncommitted refactor; never restore it over newer work.

## Git coverage and practice

Main d7945b4 embeds runtime art in index.html. assets/ is ignored. Cursor's refactor will version extracted media/ once committed. Original downloads, animation video, frames and processing scripts remain separate.

- Preserve originals and name variants distinctly.
- Commit approved runtime output and its metadata together.
- Link source to output in the inventory; record unknown provenance honestly.
- Make a verified source snapshot before destructive recuts or cleanup.
- Coordinate ignore/versioning changes. Do not accidentally publish large raw sources with every game build.

Choose an off-device destination and access model next (private asset repository/LFS or existing backup service). Source access may differ from the public game repository. This batch did not connect or upload to a new storage provider.

[asset-inventory.json](asset-inventory.json) records captured relative paths, sizes and hashes. Refresh after approved asset changes.
