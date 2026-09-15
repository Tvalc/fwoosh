# Fwoosh current roadmap

Reviewed September 15, 2026. This is the current source of truth for unfinished work. Shipped chronology belongs in [STATUS.md](STATUS.md); superseded proposals remain under `docs/archive/`.

## Current live baseline

Build `2026-09-15-duel-fire-1` is the release candidate. The arcade loop now keeps renewable rescue/heat sources active through the boss encounter, preventing the reported level-one soft lock. The Ratkin Quarter includes food, material storage, Mushroom Farms, Storehouses, visible route carriers, shared-road congestion and optional station priorities. Shrine remains hidden until favor and judgment exist. Automated checks and browser fixtures do not replace Tony's playtest.

## Active now

1. [#39 Replace Keith with Khet-Tak-Tor, the Ratkin Arbiter](https://github.com/Tvalc/fwoosh/issues/39) — **Cursor Makko art; Codex canon, systems and release**. Name and shared-near-death covenant are locked; exact judgment mandate and full migration are pending.
2. [#36 Restore the adaptive well/beacon and replace duplicated town icons](https://github.com/Tvalc/fwoosh/issues/36) — **Cursor Makko art; Codex integration**. Beacon gameplay is live. The duplicated Shrine card is hidden until favor/judgment; a distinct Makko Well icon remains useful when available.
3. [#26 Playtest and tune the arcade loop and ember economy](https://github.com/Tvalc/fwoosh/issues/26) — **Codex**, awaiting Tony's run feedback. Validate vent/heat/Edge/Arbiter pressure, phone usability, real earnings and the 2–3 ordinary-run purchase target.
4. [#31 Complete Makko animation and illustration production](https://github.com/Tvalc/fwoosh/issues/31) — **Cursor production; Codex integration**. Ratkin, character locomotion, dialogue portraits, Arbiter replacement, cinder vent correction and diary art. Every visual asset must come from Makko.
5. [#33 Consolidate records, provenance and off-device source backup](https://github.com/Tvalc/fwoosh/issues/33) — **Codex**. Records were consolidated in PR #34; an off-device destination still requires Tony's choice.

## Next development sequence

6. [#27 Adapt Wayfarer's Hearth into the playable ratkin city foundation](https://github.com/Tvalc/fwoosh/issues/27) — **release candidate complete**. The exterior, first two buildings, offline timers, sealing, worker assignment, material production and explanatory station view are implemented. Tony's phone playtest and approved Makko replacements remain.
7. [#28 Extend the adapted station loop into ratkin production, transport and optional optimization](https://github.com/Tvalc/fwoosh/issues/28) — **release candidate complete**. Food, storage, visible carriers, shared-road congestion, automatic recovery and optional priorities are implemented. Approved Makko Ratkin locomotion and Tony's phone balance/readability playtest remain.
8. [#29 Implement ratkin favor, judgment and Duy's standalone ending](https://github.com/Tvalc/fwoosh/issues/29) — restoration milestones, favor, Ratkin judgment, release and resurrection. The Arbiter administers the process; beating him never grants release by itself.
9. [#30 Design the Chit-tat-to Invoice and Vovinam Ledger handoff](https://github.com/Tvalc/fwoosh/issues/30) — ember-based debt reduction, rewards, Duy's System Shop, missable Ratkin recruit and exactly-once cross-game redemption.
10. [#32 Add audio, final effects and CrazyGames release readiness](https://github.com/Tvalc/fwoosh/issues/32) — sound, presentation polish, platform validation and accurate submission materials.

## Locked product decisions

- The arcade game is central; the city is an incremental layer behind it.
- The ratkin city adapts Wayfarer's Hearth's service-room state machine and Makko workflow instead of building every interior interaction from scratch. Fwoosh keeps its own runtime, saves, canon and economy: do not embed a second React app or import Wayfarer's characters, card collection or lore.
- The exterior remains a freely designed town with placed buildings and roads. Selecting a building opens or focuses an animated operating view with workers, a persistent workstation, inputs, progress, handoff/output and visible problems.
- Embers begin construction, accelerate work, seal buildings and buy upgrades. Embers are never sold for money.
- Ratkin build while the player runs and while away. Roads, distance and congestion affect physical transport.
- Management works automatically by default; players can optimize it if they want.
- Sealing and upgrade milestones can unlock permanent cosmetic variants. Cosmetic rarity never gates favor or release and grants no randomized Fwoosh power.
- The character currently called Keith becomes **Khet-Tak-Tor** (KET-tak-TOR), the Ratkin Arbiter—“the voice that closes the debt.” He remains Duy's jailer, administers punishment and judgment, and receives new Makko art. Beating him never grants release by itself.
- Duy earns release by rebuilding Ratkin society and winning Ratkin favor. Ratkin society supplies the authority; rescuing nineteen people or clearing five districts is insufficient by itself.
- Fwoosh must have a comprehensible standalone ending and later support Duy's return in the larger RPG.
- All artwork is Makko artwork with preserved provenance.

## Initial city tuning now under playtest

- 5×5 plan with a fixed gate road; roads are free and must extend from the connected gate.
- Burrow: 40-ember foundation, 90 seconds, 20-ember seal; each sealed connected copy supplies one worker.
- Salvage Yard: 60-ember foundation, 150 seconds, 30-ember seal; one material per 45 seconds on the shortest route.
- Five embers accelerate construction by 30 seconds. Offline work is capped at eight hours.
- Later copies cost two materials for a Burrow or three for a Yard. Distance beyond two road steps adds five seconds per production cycle.
- Farm: 50-ember foundation, 120 seconds, 25-ember seal; produces one food per base 50-second cycle.
- Storehouse: 70-ember foundation, 180 seconds, 35-ember seal; adds 15 to both resource caps. Base caps are 10.
- A Yard consumes one food per material. Other active carriers sharing its road add four seconds each. Stations default to normal priority; low and high are optional.

## Decisions still required

- Which Wayfarer's Hearth interaction assets are reusable as temporary Makko references and which require Ratkin-specific replacements before the first public slice.
- Initial population/supplies, production ratios, storage and priority controls.
- Complete-restoration criteria, favor actions and release thresholds.
- The powers and limits of Khet-Tak-Tor's covenant mandate and why he maintains or uses the recurring fire.
- Which ember total funds the Invoice; conversion, caps, reward thresholds and spending interaction.
- Duy System Shop inventory; Ratkin recruit identity, abilities and miss condition.
- The Duy-survives route and the exact reconciliation of Cuong's nineteen-life balance plus Duy's transferred five.
- Private off-device source-art backup destination and access model.

## Parking lot — not approved implementation

These are ideas to revisit, not missing launch work: additional playable heroes/mastery, Tavern/Chapel/Watchtower/Dana's House, a separate Arbiter progression ladder, more villager vignettes, daily challenges, streaks, share cards, rewarded ads, revives, extra district themes and larger hero sets. Scope each item with Tony before implementation.

## Working rules

- Each active deliverable has one owning issue with status, dependencies and acceptance criteria.
- Cursor works in its checkout and hands Codex exact commits plus Makko provenance; Codex integrates and publishes verified milestones.
- Keep code, art and behavior changes in separate commits when practical. Preserve existing browser saves.
- Update [CANON.md](CANON.md), the Fwoosh/Ledger handoff and affected Ledger records together when a shared decision changes.
- Record local, pushed, merged and deployed states separately. Publish each verified major gameplay change for Tony's test.
