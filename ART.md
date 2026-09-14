# FWOOSH — current art specification

## Mandatory source: Makko

Tony's standing instruction, reaffirmed September 14, 2026: **all artwork for this game must be Makko art.** This applies to Codex, Cursor and any future agent, including characters, animation, environments, UI art, visual-effect artwork and diary illustrations. Reuse existing Makko assets or obtain new art through Makko. Cropping, recutting, transparency cleanup, atlasing and animation integration may process those sources while retaining their provenance. Do not substitute other generators, stock assets or freshly drawn replacement artwork without Tony explicitly changing the rule. If Makko or the required source is unavailable, record the dependency and continue independent work. Existing assets with unknown provenance need verification; do not silently relabel or replace them.

Reviewed 2026-09-14. Replaces the procedural fire-passing spec preserved in `docs/archive/ART-prototype.md`. Main `d7945b4` embeds runtime art; Cursor refactor 435d0fb extracts it into media/ with metadata in js/media-meta.js. The combined review branch also includes cinder 358da15 and ratkin prototype 317963f.

## What the art communicates

Rescue burning villagers by absorbing their fire. Heat raises rewards and chain reach but drains health. The player transforms person → fire-man → cinder-man. Vent purges heat then heals, releasing demons. Keith sends interceptable imps; failed rescues become husks and wraiths. Rescues contribute to Edge and allied help against Keith.

Preserve the established style and terrified villager expression. Distinguish safe/burning villagers, hostile demons/imps, inert husks and player at phone size. Keep gauges legible and sprite body scale/feet anchors stable across frames and forms. No screen shake.

The arena is 720 × 1280 virtual pixels with four solid boundaries and collision props. The old wraparound requirement is obsolete. Visual overhang beyond hitboxes must be deliberate and tested.

## Existing art

Actors/forms, townsfolk, Keith, imps/demons, husks, rescue/happy sprites; arena and Ashford backdrops; hearts, dash charge/pips, digits/letters, Pixelify font; flame, rescue and vent effects.

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
| ventcinder | 10 | 139 × 280 |
| ratkin | 4 | 176 × 180 |

An existing sheet is not proof that requested locomotion is finished. Cursor starts with the ratkin run for Tony's approval. Fire vent has a committed tall tapered-flame fix; cinder has a committed looping recut. Ratkin is present as one review prototype; neither is recorded as Tony-approved.

## Diary

Assigned: The Gate → duy_gate; The Town on Fire → duy_save; The Ones I Drop → wraith.

Unassigned (12): The Last Morning; Cuong; Two Bags of Spring Rolls; The White Shirts; The Knife; The Last Joke; The Waiting Room; The Job Offer; The Dark Cell; The Debt; Keith; The Door.

Four image keys exist: duy_gate, duy_save, dark_cell, wraith. **dark_cell exists but is not assigned**; evaluate reuse before commissioning another image. Settle canon and scene briefs before batch generation.

## Handoff requirements

Record key, purpose, source/output paths, dimensions, frame count/layout, playback rate, anchor/scale, transparency, provenance when known and approval status. Do not invent generator IDs or licensing information. Keep original sources, use new variant names, inspect all frames for clipping/scale, and show an in-game preview. Change sheet and metadata together; separate art commits from simulation changes.

Hero sets, district-specific art, extra effects and audio follow scoped decisions. Current assets/ is ignored; see [asset preservation](docs/ASSET_PRESERVATION.md) and [inventory](docs/asset-inventory.json).
