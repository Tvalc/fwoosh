# FWOOSH — Meta Progression Roadmap ("Ashford")

Designed 2026-09 via a multi-agent design pass (per-system + synthesis + coherence critic).

## The spine
The villagers you **SAVE** are the root of everything. One save (`absorb()`) fans out five ways:
mints **embers**, adds to the lifetime **town** counter (rebuild), can **unlock a hero** (a saved
townsperson), stokes the **Keith feud**, and opens a **diary** page. Embers are the fungible layer;
saved-count / feud tier / hero flags / diary pages are integer state the same save advances.

## Interlock map
- **Embers** ← minted per save (blaze-scaled, soft-capped). → the one currency every building shop spends.
- **Town (Ashford)** ← `saved` crosses milestones to raise buildings; embers pay the upgrade tiers. → IS the upgrade UI; gates heroes (a hero shows only if their building stands); hosts the feud + diary.
- **Upgrades** ← bought with save-minted embers, gated behind rebuilt buildings. → tune the run risk/reward.
- **Feud (Keith)** ← district rebuilds + wins advance tiers. → difficulty pacer; win bounties inflate embers; tiers unlock heroes/diary chapters.
- **Heroes** ← every hero is a saved villager; unlock feats are save-derived counters. → ember sinks; staff their building; each is a diary character.
- **Lore/Diary** ← saving new faces + milestones open pages. → OPTIONAL; pays nothing, gates nothing; the story itself is the reward, paid off with Makko art.

## Buildings (cumulative-saves milestones)
Well (6) health · Forge (25) mobility/power + Hero Bram · Tavern (55) economy + Hero Wren ·
Chapel (95) redemption + Hero Mora · Watchtower (150) feud taming + Hero Tam · Dana's House (secret finale).

## Data model — `localStorage['fwoosh.meta']`
`{ v, embers, saved, bestBlaze, buildings{well{built,hearts,regen},...}, heroes{}, hero, diary{read[]}, flags{} }`
Separate key from `fwoosh.opp`; per-field defaults on load.

## Phased roadmap (checkpoints)
- **Phase 0 — Foundation. [DONE b6485da]** META persist, embers minted in `absorb()`/banked in `foldOpp()`, `mode==='hub'` screen, run↔hub flow.
- **Phase 1 — First building + upgrades. [DONE b6485da]** The Well rises at 6 saves; shop (Deep Well +hearts, Cool Blood +regen); `applyUpgrades()` at run start. ONE drain lever (hearts) so venting stays a real decision.
- **Phase 2 — Economy + 2nd building.** Tavern (EMBER_BASE, BLAZE_MULT); run-end delta screen ("+6 saves, +30 embers"); NEXT chip already live.
- **Phase 3 — Heroes.** Hero-select on the hub; Bram + Wren; shared town tier + per-hero mastery; `applyHero()` deltas. Makko art per hero (idle + person→fire→cinder set).
- **Phase 4 — Feud ladder.** ONE source of truth: rewrite `feudStage()` to read META milestones + duelWins (don't add a parallel `feudTier`). Districts arm tiers, wins seal them; Watchtower UI; new attacks + yield bounties.
- **Phase 5 — Diary / VN.** Real reader (reuse `drawDialogue`/`wrapText`), vignettes + spine chapters, bespoke Makko illustrations for milestone beats. Stays optional. Needs a persistent villager `face` enum (add `face:(rnd()*6|0)` at spawn) to key entries — do NOT key off `c.id` (run-scoped).
- **Phase 6 — Wrapper.** Daily KEITH'S RAMPAGE seed, login streak, share card, rewarded-ad slots (CG SDK already wired). Rewarded = double embers / revive; IAP = ember packs — never pay-to-win the vent risk/reward.

## Critic's load-bearing warnings (already respected in P0/P1)
- Reuse the existing `blaze` in `absorb()`; don't redeclare (shadows/throws).
- `c.id` is run-scoped (reset to 1 each run) — NOT a stable villager identity. No per-face features until a `face` enum exists.
- Never stack two drain-reduction levers; floor total drain so vent never becomes pointless.
- Lore reading must pay nothing and gate nothing, or "optional" is a lie.
- One feud ladder, not two.

Full per-system designs + synthesis + critique were produced by the design workflow (run `wf_67a08041-f8d`).
