# Fwoosh current roadmap

Reviewed September 17, 2026. This is the current source of truth for unfinished work. Shipped chronology belongs in [STATUS.md](STATUS.md); superseded proposals remain under `docs/archive/`.

## Current live baseline

Latest integrated build is `2026-09-17-rescue-1`; deployment evidence is recorded on the owning issue. Phone movement uses an anywhere-except-Vent floating joystick, continuous manual steering and same-finger release-to-Burst in the final steering direction. Extra fingers do not dash; taps without a drag spend no charge. Auto-run resumes after the Burst. The Makko flame arrow previews the direction. Desktop mouse slingshot, keyboard steering and Shift remain unchanged. Physical-phone acceptance is still pending. Every demon kill supplies one heat, while vent-created demons continue to pay no embers. Calm and cinder Ratkin now ascend on contact for one carried heat; flaming rescues still supply heat. All three states receive full direct rescue rewards and sanctuary credit. Auto-run can seek affordable rescues and intercept incoming imps; witnessed dialogue explains the new path. Demon contact interrupts an active vent/heal unit, releases the held input and knocks Duy out of the overlap. The Ratkin Quarter includes food, material storage, Mushroom Farms, Storehouses, visible route carriers, shared-road congestion and optional station priorities. Its first restoration hearing now opens five persistent social-bloc goals across the city, arcade and optional diary. Four votes trigger the standalone release verdict; five record the best future Invoice/recruit outcome. Automated checks and browser fixtures do not replace Tony's physical-phone and desktop-mouse playtests.

## Village-life priority — approved September 16

See [SANCTUARY_SOCIETY.md](SANCTUARY_SOCIETY.md). Persistent arrivals, the refuge roster, automatic housing, apartments, happiness/work-rate effects and household chronicles are implemented in the current #27/#28 slice. Dedicated Makko celebrations and tap-to-zoom vignettes follow, then actual daily routines, autonomous diverse households and voluntary generational growth. Sanctuary immortality and temporary mortality while away are locked canon; departures are lore only initially. This work is approved, not parked.

The resident-chronicle interview adds an approved content requirement: individually authored names, backgrounds and lore for every Ratkin, supported by an expanding backlog. Start with the displaced villagers of Hollowbeech, the latest village built after the fall of their lost kingdom; rebuilding must support growth and expansion beyond restoring the past. Introduce other worlds later. Scope and implement persistent authored identities and their chronicle presentation after the remaining design questions are resolved; do not use procedural biographies as a fallback. See SANCTUARY_SOCIETY.md for the implementation boundary.

Population clarification: Blackroot destroyed Hollowbeech and captured its last nineteen survivors, who were subsequently killed by Duy and Cuong. Build the broader displaced society and an authored citizen backlog beyond nineteen; this is not a nineteen-person settlement or content cap. The village destruction and later cell killings remain distinct in biographies and diary reveals.

Admission design clarification, September 17: the first nineteen rescues map deterministically to `cit-001` through `cit-019`. Later residents use cohort and advocacy metadata. Each resident has typed relationships plus a mutable affinity score. Family grief, direct victim status, anti-human trauma, rivalry, debt, friendship and later shared events can all affect advocacy. The player sees broad reasons in the support panel and discovers personal motives through gate conversations and chronicles.

Attacker identity is approved: the Blackroot Company, hobgoblin-led slavers with goblin trackers, destroyed the resisting villagers' latest village, Hollowbeech, and captured the nineteen. Integrate this history into authored citizen/diary content under the prose brief. Their links to the pit network and keeping place remain unresolved; no new arcade enemy replacement is implied.

Canon additions from Claude: the people are stateless after their kingdom fell, longer ago than anyone has counted, and have been driven from village to village, rebuilding each time. Hollowbeech was the latest village and held roughly 150 to 200 people; its carried fire and Road Song are survival culture. The dead have burned for centuries, and the covenant repurposed that old fire as Duy's final test. Khet-Tak-Tor carries the dead out, and Duy shares the load. Nobody knows who opened the cell door; Ledger owns that mystery. Do not resolve the opener in Fwoosh runtime or diary drafts.

## Active now

1. [#39 Restore Keith as the arcade antagonist and keep Khet-Tak-Tor as the Ratkin Arbiter](https://github.com/Tvalc/fwoosh/issues/39) — **first gameplay pass in review**. Khet now explains the covenant and mechanics while Keith owns hostile pressure, fire imps, extra demons and direct telegraphed strikes. The old combat identity remains internally compatible while visible dialogue, HUD labels and portraits distinguish Keith from Khet. Phone tuning and dedicated hostile/Arbiter portrait decisions remain.
2. [#36 Restore the adaptive well/beacon and replace duplicated town icons](https://github.com/Tvalc/fwoosh/issues/36) — **Cursor Makko art; Codex integration**. Beacon gameplay is live. The duplicated Shrine card is hidden until favor/judgment; a distinct Makko Well icon remains useful when available.
3. [#26 Playtest and tune the arcade loop and ember economy](https://github.com/Tvalc/fwoosh/issues/26) — **Codex**, first antagonist-pressure pass in review. Validate vent/heat/Edge, Keith's random interventions, direct-strike readability, demon density, phone usability, real earnings and the 2–3 ordinary-run purchase target.
4. [#31 Complete Makko animation and illustration production](https://github.com/Tvalc/fwoosh/issues/31) — **Cursor production; Codex integration**. Arbiter, workers and all twelve civilian locomotion sets are integrated in `2026-09-16-ascension-1`; all twelve panic/ascension pairs and the first stern talking portrait are integrated; other expressions and saved actions await integration. Dedicated dialogue portraits, remaining character locomotion, cinder vent correction and diary art remain. See [ART_INTEGRATION.md](ART_INTEGRATION.md). Every visual asset must come from Makko.
5. [#33 Consolidate records, provenance and off-device source backup](https://github.com/Tvalc/fwoosh/issues/33) — **Codex**. Records were consolidated in PR #34; an off-device destination still requires Tony's choice.

## Next development sequence

6. [#27 Adapt Wayfarer's Hearth into the playable ratkin city foundation](https://github.com/Tvalc/fwoosh/issues/27) — **village-life foundation implemented; welcome hook and authored profile contract live**. Persistent rescued residents, the refuge roster, apartments/personal homes, automatic housing, household chronicles and happiness/work-rate effects now extend the exterior, offline timers, sealing and station view. Durable arrival celebrations and a tap-to-zoom welcome vignette use existing Makko idle art as an explicitly temporary presentation layer. The runtime now accepts Claude's stable profile IDs and authored milestone text without inventing missing biographies. Citizen content, Tony's phone playtest and approved Makko replacements remain.
7. [#28 Extend the adapted station loop into ratkin production, transport and optional optimization](https://github.com/Tvalc/fwoosh/issues/28) — **release candidate complete**. Food, storage, visible carriers, shared-road congestion, automatic recovery and optional priorities are implemented. Farmer/mason locomotion is integrated; dedicated work/cargo art and Tony's phone balance/readability playtest remain.
8. [#29 Implement ratkin favor, judgment and Duy's standalone ending](https://github.com/Tvalc/fwoosh/issues/29) — **support model in progress**. Existing numeric goals are minimum reluctant support. Three tunable tiers are exposed: reluctant, secured and strong. The player explicitly secures each vote from the Shrine or sanctuary gate view; four secured votes release Duy, while five strong votes unlock the best cutscene and a persistent Ratkin pledge flag. Key advocates anchor each bloc, with broader resident relationships and ember-backed sanctuary work modifying the result. Betrayal can revoke a secured vote only through an authored major event. Playtest and admission scenes remain.
9. [#30 Design the Chit-tat-to Invoice and Vovinam Ledger handoff](https://github.com/Tvalc/fwoosh/issues/30) — lifetime-earned accounting implemented; debt conversion, rewards, Duy's System Shop and exactly-once cross-game redemption pending. Spending does not reduce Invoice credit. Tony authorized retiring all pre-cutover saves; current lifetime earnings start clean, with no old-history recovery requirement. A unanimous five-bloc verdict grants the strongest Invoice reward tier and Ratkin recruit eligibility; the exact rewards and recruit acquisition remain.
10. [#32 Add audio, final effects and CrazyGames release readiness](https://github.com/Tvalc/fwoosh/issues/32) — sound, presentation polish, platform validation and accurate submission materials.

## Locked product decisions

- The arcade game is central; the city is an incremental layer behind it.
- The ratkin city adapts Wayfarer's Hearth's service-room state machine and Makko workflow instead of building every interior interaction from scratch. Fwoosh keeps its own runtime, saves, canon and economy: do not embed a second React app or import Wayfarer's characters, card collection or lore.
- The exterior remains a freely designed town with placed buildings and roads. Selecting a building opens or focuses an animated operating view with workers, a persistent workstation, inputs, progress, handoff/output and visible problems.
- Embers begin construction, accelerate work, seal buildings and buy upgrades. Embers are never sold for money.
- Ratkin build while the player runs and while away. Roads, distance and congestion affect physical transport.
- Management works automatically by default; players can optimize it if they want.
- Sealing and upgrade milestones can unlock permanent cosmetic variants. Cosmetic rarity never gates favor or release and grants no randomized Fwoosh power.
- The jailer and Arbiter is **Khet-Tak-Tor** (KET-tak-TOR), “the voice that closes the debt.” A separate huge Warden was pinned under the gate. Keith is the arcade antagonist who feeds the fire and attacks through imps, demons and direct pressure. Khet explains and judges; he does not harm Duy or the Ratkin during ordinary street play. Beating Keith never grants release by itself.
- Duy earns release by rebuilding Ratkin society and winning Ratkin favor. Ratkin society supplies the authority; rescuing nineteen people or clearing five districts is insufficient by itself.
- The rebuilt Ratkin community delivers the collective release verdict. Khet-Tak-Tor administers the covenant, presents evidence, announces their decision and executes the resulting sentence; he cannot personally forgive the debt.
- Five Ratkin voting blocs judge Duy. Four votes release and resurrect him. Unanimous support is optional and grants the strongest Invoice reward tier plus eligibility for the missable Ratkin recruit.
- Each bloc has three support tiers: reluctant, secured and strong. Completing its baseline quest guarantees reluctant support; securing is a player choice and later support can upgrade the tier. Four secured votes release Duy. Five strong votes produce the best narrative outcome and mark one Ratkin as eligible to pledge to Duy. Main-game companion benefits remain parked until the larger RPG integration.
- Bloc support is anchored by named advocates but modified by a resident relationship graph. Typed bonds and affinity record grief, family, debt, rivalry, distrust, anti-human trauma and positive shared work. Ordinary interaction can move affinity within bounded limits; only authored major betrayals can revoke a secured vote.
- The blocs are The Hearth (shelter), The Bowl (sustenance), The Hand (rebuilding), The Claw (protection) and The Memory (truth). Their proofs begin after the first restoration hearing; the optional Memory vote is not required for release.
- Fwoosh must have a comprehensible standalone ending and later support Duy's return in the larger RPG.
- All artwork is Makko artwork with preserved provenance.

## Initial city tuning now under playtest

- 5×5 plan with a fixed gate road; roads are free and must extend from the connected gate.
- Burrow: 40-ember foundation, 90 seconds, 20-ember seal; each sealed connected copy houses one adult household; an actual resident supplies the worker. Apartments house three households for 100 foundation + 50 seal embers, 180 seconds and five materials for later copies. Housing grants +10% work rate, or +20% for a preferred type.
- Salvage Yard: 60-ember foundation, 150 seconds, 30-ember seal; one material per 45 seconds on the shortest route.
- Five embers accelerate construction by 30 seconds. Offline work is capped at eight hours.
- Later copies cost two materials for a Burrow or three for a Yard. Distance beyond two road steps adds five seconds per production cycle.
- Farm: 50-ember foundation, 120 seconds, 25-ember seal; produces one food per base 50-second cycle.
- Storehouse: 70-ember foundation, 180 seconds, 35-ember seal; adds 15 to both resource caps. Base caps are 10.
- A Yard consumes one food per material. Other active carriers sharing its road add four seconds each. Stations default to normal priority; low and high are optional.

## Decisions still required

- Which Wayfarer's Hearth interaction assets are reusable as temporary Makko references and which require Ratkin-specific replacements before the first public slice.
- Initial population/supplies, production ratios, storage and priority controls.
- The exact powers and limits of Khet-Tak-Tor's covenant mandate.
- Invoice conversion, caps and reward thresholds. Lifetime earned embers is locked; spending in Fwoosh does not reduce that basis. The authorized save cutover removes the old-history recovery requirement.
- Duy System Shop inventory; Ratkin recruit identity, abilities, acquisition window and miss condition after unanimous support establishes eligibility.
- The Duy-survives route and the exact reconciliation of Cuong's nineteen-life balance plus Duy's transferred five.
- Private off-device source-art backup destination and access model.

## Parking lot — not approved implementation

These are ideas to revisit, not missing launch work: additional playable heroes/mastery, Tavern/Chapel/Watchtower/Dana's House, a separate Arbiter progression ladder, daily challenges, streaks, share cards, rewarded ads, revives, extra district themes and larger hero sets. Scope each item with Tony before implementation.

## Working rules

- Each active deliverable has one owning issue with status, dependencies and acceptance criteria.
- Cursor works in its checkout and hands Codex exact commits plus Makko provenance; Codex integrates and publishes verified milestones.
- Keep code, art and behavior changes in separate commits when practical. Preserve existing browser saves.
- Update [CANON.md](CANON.md), the Fwoosh/Ledger handoff and affected Ledger records together when a shared decision changes.
- Record local, pushed, merged and deployed states separately. Publish each verified major gameplay change for Tony's test.
