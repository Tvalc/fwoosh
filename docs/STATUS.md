# Fwoosh status — September 14, 2026

## Release candidate

Combines Cursor through `2d9316c` with Codex progression/input fixes. Tony authorized publication and requests a live update after each major completed change. Verify the GitHub Pages deployment before describing a candidate as live.

Implemented: absorber/heat/vent arcade loop, chain rescues, imps, demons, husks/wraiths, Edge, five districts and Keith encounters, allies, rewards, district replay, ember banking, Well/Forge upgrades, Shrine and 15 diary chapters. CrazyGames lifecycle hooks exist; ads and purchases do not.

Release fixes: persisted 5/5 completion; independent building unlocks; one settlement per run; no rewards changing after a terminal victory; canceled touches/focus loss cannot trigger a dash. Modular code, save documentation, audit tools and verified local source recovery are included.

## Art correction

Cursor removed the non-Makko ratkin prototype and restored the original Makko cinder vent in `2d9316c`. This release integrates that correction. Full run cycles and the requested cinder visual improvement remain unfinished. All new artwork must come from Makko. Three diary chapters have assigned artwork; twelve assignments remain, with an existing dark_cell image to evaluate for reuse.

## Approved design, not implemented

- Duy rebuilds ratkin society and earns their favor; the ratkin grant release toward resurrection. Keith is the jailer.
- Ember foundations, offline ratkin construction, mandatory ember sealing, food/materials/workforce production, deterministic production upgrades and permanent cosmetic unlocks.
- Embers are never sold for real money.
- Chit-tat-to's Invoice converts Duy's collected embers into repayment of Cuong's debt, with bonuses/items/upgrades and a missable Ratkin recruit after Duy returns having rebuilt society. Values and detailed rules remain in interview.
- Duy-specific RPG System Shop integration. See CANON.md; do not assume lifetime versus unspent ember budget.

## Next work

1. Verify this integrated release and publish it for Tony's live testing.
2. Reconcile the intro, greetings, diary and Shrine with approved canon while preserving undecided mechanics.
3. Interview and implement city rebuilding, then ratkin favor/release and RPG handoff in bounded increments.
4. Makko animation/diary art, audio and physical-phone/balance polish.
5. Keep roadmap, GitHub issues, public descriptions and the shared Ledger handoff current. Off-device source-art backup still needs a destination; the verified archive is local.

Heroes/mastery, Tavern/later buildings, feud redesign and daily/share features are deferred proposals. Their old roadmap entries are not implementation approval.

## Story release checkpoint

The reliability release deployed at ef04377 and was verified live. Story candidate 2026-09-14-story-1 implements the initial action-first narration and reconciles later story/Shrine/title/victory copy. All 41 gameplay/input checks pass, including intro lifecycle, immediate control, old-save preservation and mobile vent rendering. This does not implement the future city/Invoice mechanics. Next interview: first city rebuilding milestone.
