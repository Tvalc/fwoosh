# FWOOSH — current art specification

## Mandatory source: Makko

Tony's standing instruction, reaffirmed September 14, 2026: **all artwork for this game must be Makko art.** This applies to Codex, Cursor and any future agent, including characters, animation, environments, UI art, visual-effect artwork and diary illustrations. Reuse existing Makko assets or obtain new art through Makko. Cropping, recutting, transparency cleanup, atlasing and animation integration may process those sources while retaining their provenance. Do not substitute other generators, stock assets or freshly drawn replacement artwork without Tony explicitly changing the rule. If Makko or the required source is unavailable, record the dependency and continue independent work. Existing assets with unknown provenance need verification; do not silently relabel or replace them.

Current production is tracked in [issue #31](https://github.com/Tvalc/fwoosh/issues/31). This specification replaces the procedural fire-passing proposal preserved in `docs/archive/ART-prototype.md`. Runtime art is extracted under `media/` with metadata in `js/media-meta.js`. The original Makko cinder sheet is restored and the prior non-Makko ratkin prototype is removed; neither unfinished item should be described as approved final animation.

## Chroma background recovery

Tony's September 14 instruction: if background stripping contaminates a sprite's colors, remake the sprite in Makko and request a flat solid red, green, or blue chroma background. Choose a background color absent from the character palette. Inspect the original and stripped result for correct skin/clothing colors and clean edges before integration; preserve source provenance. Do not accept a discolored sprite as finished. This arose from Cuong's Sunday morning sprite in Vovinam Ledger turning green; that replacement is assigned to the Ledger task.

## Arena character readability

September 16: world actors render at 1.5x around their existing ground anchors; background props and collision geometry retain their scale. Ratkin are fully visible at distance. Do not paint a target glow over panicking civilians. Draw imp warning lines and burning-villager Makko flames behind the actors so faces and limb motion remain clear. Presentation must distinguish frightened, unburned Ratkin from burning rescue targets.

## What the art communicates

Do not add drawn charge, blast-radius or countdown circles around fire demons. Tony rejected those overlays on September 15. Keep the Makko demon animation during windup; cinder-eating danger uses a straight threat tether, compact countdown bar and the existing Makko flame animation.

The Burst aiming preview reuses the approved `media/fx/flame.png` frames, rotated and staggered into a directional trail with a larger flame tip. This is the approved flaming-arrow treatment for touch and desktop pointer aim; do not restore the yellow dashed line or replace the Makko flame with procedurally drawn fire.

Rescue burning villagers by absorbing their fire. Heat raises rewards and chain reach but drains health. The player transforms person → fire-man → cinder-man. Vent purges heat then heals, releasing demons. Khet-Tak-Tor sends interceptable imps; failed rescues become husks and wraiths. Rescues contribute to Edge and allied help against the Arbiter.

Preserve the established style and terrified villager expression. Distinguish safe/burning villagers, hostile demons/imps, inert husks and player at phone size. Keep gauges legible and sprite body scale/feet anchors stable across frames and forms. No screen shake.

The arena is 720 × 1280 virtual pixels with four solid boundaries and collision props. The old wraparound requirement is obsolete. Visual overhang beyond hitboxes must be deliberate and tested.

## Existing art

September 16: the first new Makko Ratkin batch is integrated. See [ART_INTEGRATION.md](docs/ART_INTEGRATION.md) for placements, provenance and remaining gaps. The former blanket Ratkin production dependency is obsolete: many saved animation exports already exist.


Actors/forms, townsfolk, the legacy jailer placeholder for Khet-Tak-Tor, imps/demons, husks, rescue/happy sprites; arena and Ashford backdrops; hearts, dash charge/pips, digits/letters, Pixelify font; flame, rescue and vent effects.

| Animation key | Frames | Cell width × height |
|---|---:|---:|
| ashimp | 12 | 141 × 180 |
| firedemon | 12 | 249 × 180 |
| hero | 12 | 114 × 180 |
| keith | 12 | 108 × 180 |
| townsfolk | 12 | 176 × 180 |
| hero_run | 4 | 189 × 308 |
| save | 18 | 174 × 224 |
| ventfire | 10 | 171 × 280 |
| ventcinder | 18 | 139 × 200 |

The earlier non-Makko prototype was removed. Real Makko Ratkin walk/run/idle exports now replace the arena cast; all twelve civilian families now have their own idle/walk/run exports integrated. The cinder sheet is restored to its original Makko version, so the visual clipping/scale request remains open. Historical fire-vent processing includes a synthesized taper; verify its compliance with Tony before further visual work rather than calling every historical pixel verified Makko.

## Diary

Assigned: The Gate → duy_gate; The Town on Fire → duy_save; The Ones I Drop → wraith.

Unassigned (12): The Last Morning; Cuong; Two Bags of Spring Rolls; The White Shirts; The Knife; The Last Joke; The Waiting Room; The Job Offer; The Dark Cell; The Debt; Khet-Tak-Tor; The Door.

Four image keys exist: duy_gate, duy_save, dark_cell, wraith. **dark_cell exists but is not assigned**; evaluate reuse before commissioning another image. Settle canon and scene briefs before batch generation.

## Handoff requirements

Record key, purpose, source/output paths, dimensions, frame count/layout, playback rate, anchor/scale, transparency, provenance when known and approval status. Do not invent generator IDs or licensing information. Keep original sources, use new variant names, inspect all frames for clipping/scale, and show an in-game preview. Change sheet and metadata together; separate art commits from simulation changes.

Hero sets, district-specific art, extra effects and audio follow scoped decisions. Current assets/ is ignored; see [asset preservation](docs/ASSET_PRESERVATION.md) and [inventory](docs/asset-inventory.json).

## Readable UI typography

Tony requested a sharper related font on September 15. Use Chakra Petch Medium/Bold for reading text, HUD labels and counters; retain the large Makko display lettering for decorative titles. This is the approved UI typeface change; the Makko artwork rule continues to cover illustrations, sprites and effects. Fonts are self-hosted in media/fonts with the original SIL OFL license. Do not switch small reading text back to Pixelify or the image glyph atlas.
