# Fwoosh current roadmap

Reviewed September 15, 2026. This is the current source of truth for unfinished work. Shipped chronology belongs in [STATUS.md](STATUS.md); superseded proposals remain under `docs/archive/`.

## Current live baseline

Build `2026-09-15-debug-1` is live. The arcade loop, committed vent units, persistent vent demons, cinder-person explosions, uncapped ember rewards, zero rewards from vent-created demons, starter upgrade choice, retry/reward flow, five districts, current town upgrades, heat/rescue HUD, present-tense dialogue, optional diary, full-map viewport, phone controls and desktop debug reset exist. Automated checks and browser fixtures do not replace Tony's playtest.

## Active now

1. [#26 Playtest and tune the arcade loop and ember economy](https://github.com/Tvalc/fwoosh/issues/26) — **Codex**, awaiting Tony's run feedback. Validate vent/heat/Edge/Keith pressure, phone usability, real earnings and the 2–3 ordinary-run purchase target.
2. [#31 Complete Makko animation and illustration production](https://github.com/Tvalc/fwoosh/issues/31) — **Cursor production; Codex integration**. Ratkin, character locomotion, dialogue portraits, cinder vent correction and diary art. Every visual asset must come from Makko.
3. [#33 Consolidate records, provenance and off-device source backup](https://github.com/Tvalc/fwoosh/issues/33) — **Codex**. Records were consolidated in PR #34; an off-device destination still requires Tony's choice.

## Next development sequence

4. [#27 Build the playable ratkin city foundation slice](https://github.com/Tvalc/fwoosh/issues/27) — place roads, a home and production building; spend embers on the foundation; build over time/offline; seal before operation.
5. [#28 Implement ratkin production, transport and optional optimization](https://github.com/Tvalc/fwoosh/issues/28) — food, materials, housing, workers, storage, physical deliveries, distance/congestion and automatic priorities with optional optimization.
6. [#29 Implement ratkin favor, judgment and Duy's standalone ending](https://github.com/Tvalc/fwoosh/issues/29) — restoration milestones, favor, ratkin judgment, release and resurrection. Keith is the jailer, never the authority that frees Duy.
7. [#30 Design the Chit-tat-to Invoice and Vovinam Ledger handoff](https://github.com/Tvalc/fwoosh/issues/30) — ember-based debt reduction, rewards, Duy's System Shop, missable Ratkin recruit and exactly-once cross-game redemption.
8. [#32 Add audio, final effects and CrazyGames release readiness](https://github.com/Tvalc/fwoosh/issues/32) — sound, presentation polish, platform validation and accurate submission materials.

## Locked product decisions

- The arcade game is central; the city is an incremental layer behind it.
- Embers begin construction, accelerate work, seal buildings and buy upgrades. Embers are never sold for money.
- Ratkin build while the player runs and while away. Roads, distance and congestion affect physical transport.
- Management works automatically by default; players can optimize it if they want.
- Sealing and upgrade milestones can unlock permanent cosmetic variants. Cosmetic rarity never gates favor or release and grants no randomized Fwoosh power.
- Duy earns release by rebuilding ratkin society and winning ratkin favor. The ratkin decide; defeating Keith, rescuing nineteen people or clearing five districts is insufficient by itself.
- Fwoosh must have a comprehensible standalone ending and later support Duy's return in the larger RPG.
- All artwork is Makko artwork with preserved provenance.

## Decisions still required

- City footprint/grid rules, starting plots, costs, timers and offline cap.
- Initial population/supplies, production ratios, storage and priority controls.
- Complete-restoration criteria, favor actions and release thresholds.
- Which ember total funds the Invoice; conversion, caps, reward thresholds and spending interaction.
- Duy System Shop inventory; Ratkin recruit identity, abilities and miss condition.
- The Duy-survives route and the exact reconciliation of Cuong's nineteen-life balance plus Duy's transferred five.
- Private off-device source-art backup destination and access model.

## Parking lot — not approved implementation

These are ideas to revisit, not missing launch work: additional playable heroes/mastery, Tavern/Chapel/Watchtower/Dana's House, a separate Keith progression ladder, more villager vignettes, Cool Blood redesign, daily challenges, streaks, share cards, rewarded ads, revives, extra district themes and larger hero sets. Scope each item with Tony before implementation.

## Working rules

- Each active deliverable has one owning issue with status, dependencies and acceptance criteria.
- Cursor works in its checkout and hands Codex exact commits plus Makko provenance; Codex integrates and publishes verified milestones.
- Keep code, art and behavior changes in separate commits when practical. Preserve existing browser saves.
- Update [CANON.md](CANON.md), the Fwoosh/Ledger handoff and affected Ledger records together when a shared decision changes.
- Record local, pushed, merged and deployed states separately. Publish each verified major gameplay change for Tony's test.
