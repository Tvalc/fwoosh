# Makko Ratkin integration — September 16

## Civilian expansion - 2026-09-16-villagers-1

The twelve civilian families (vest, baker, elder, child, merchant, farmer, lantern carrier, weaver, cook, mason, herbalist, wellkeeper) all use their own idle/walk/run sheets in the arcade population. The Arbiter is excluded. Visual identity survives ignition, rescue and husk recovery; no new character stats or roles are invented. All active arena sheets preload, including shared farmer/mason city art. The initial batch notes below describe the earlier release.

29 additional sheets are preserved in the manifest. Run `python tools/import-ratkin-art.py` followed by `python tools/prepare-village-runtime.py` to reproduce atlases, metadata, explicit runtime URLs and six review contact pages. All 160 gameplay/render and 52 asset checks pass.

No dedicated ascension export was verified in the 113 named Makko sheets audited on September 16. The vest death sheet visibly collapses rather than ascends. Some source animations remain unidentified; do not commission duplicates without checking them. Current rescue uses the matching civilian still rising/fading over the existing rescue duration.

## First integrated batch

Build: `2026-09-16-ratkin-1`. Source provenance and exact grid/frame metadata: [ratkin-art-manifest.json](ratkin-art-manifest.json). Original WEBP exports are versioned under `source-art/makko-ratkin-2026-09-16/`. `tools/import-ratkin-art.py` reproducibly downloads the observed sources and repacks their row-major grids into horizontal PNGs. Runtime cells are downsampled uniformly to a 180px maximum dimension; original exports and full-resolution static fallbacks are retained.

- Arena villagers: `ratkin_walk`, `ratkin_idle`, `ratkin_run`. The generic run matches the vest villager's design. Burning actors face their actual travel direction. The legacy human rescue sheet is no longer used for this actor: the Ratkin rises and fades over the existing rescue duration, using its Makko still and existing flame artwork.
- Khet-Tak-Tor: `arbiter_idle`, `arbiter_run`, `arbiter_cast`, `arbiter_hit`, chosen from existing combat state. `arbiter_attack` is preserved but not loaded/used because the current moves do not require its sword swing. No death clip is used to imply killing the Arbiter.
- Legacy `keith`, `townsfolk`, and `happy` static asset keys now point to Ratkin PNGs. Original source files remain archived in the tree. No save keys, balance, collision, or simulation timing changed.
- Dialogue/hearings/verdict: a static close-up from the Arbiter idle sheet replaces the human fallback. Canonical `dialogue_arbiter_*` clips are accepted with legacy aliases retained. This is not a finished emotional/talking portrait set.
- Ratkin Quarter: farmer and mason walk/idle animations replace route letters and station actor boxes. These four sheets load only when the city view is rendered. Working uses idle until matching work clips arrive; no fake harvesting/spell-casting animation is claimed.

## Production already exists, integration still pending

Makko has broad eight-action Ratkin sets for baker, elder, child, merchant, farmer, lantern bearer, wellkeeper, weaver, cook, mason, herbalist, vest villager and Arbiter. Verify the saved export and contact sheet before integrating each. Some names have duplicate fwoosh prefixes; the wellkeeper has duplicate death exports. New Duy fire-form run and idle sheets were also observed after the initial inventory and await their own scale/vent-transition review.

Village/town/city/civilization backgrounds exist; choose their presentation after visual review, without replacing the player's free building/road layout with a painted city. An Arbiter courtroom concept and three-view character reference are available.

## Missing or not yet verified for the required role

- Dedicated square Arbiter and Duy emotion/talking portraits. See [Cursor production brief](CURSOR_ART_BRIEF.md).
- Actual harvesting, salvage, matching cargo, pickup/drop-off and workstation art.
- Individually placeable Burrow, Farm, Yard and Storehouse art and construction/sealing states.
- Distinct menu art, council portraits and remaining diary illustrations after auditing existing concepts.

Suggested next integrations: verified Ratkin ascension clips; the five favor-bloc representatives; village backdrop. No new building systems, character stats, named recruit identity or story lines are implied by the art inventory.

## Verification

157 gameplay/render-operation checks and 23 asset/reference checks passed. Reviewed every imported frame on a contact sheet, plus local browser fixtures for the arena, route carriers, production station and Arbiter portrait. Transparent exports preserve colors; source thumbnails with green chroma are not evidence of a failed saved export. These checks do not replace Tony's physical-phone playtest.

Deployment evidence is recorded in the owning issue after GitHub Pages succeeds; an integrated or pushed commit is not automatically a live build.
