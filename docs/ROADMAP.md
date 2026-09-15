# Fwoosh — complete remaining backlog
Reviewed September 14, 2026 against this conversation, current source, the older combat/meta roadmaps, art records, and GitHub issues.

## Implemented and deployed baseline
Latest verified baseline: 2026-09-14-hud-1, main 3c2be87a7085e6c8851653731619cfb49e1f20d1.
The action arcade loop, heat mechanics, vent/heal, imps/demons, chain rescues, husks/wraiths, Edge, five district encounters/replay, ember banking, Well/Forge upgrades, Shrine, fifteen diary chapters, reliability fixes and revised live-action intro exist. The latest gameplay suite has 41 passing checks. These facts do not mean the systems below are implemented.

## Confirmed direction / remaining implementation
1. HUD: implemented and deployed in 2026-09-14-hud-1. Dedicated six-segment heat gauge, larger rescue tally/progress, distinct Edge/Keith meters; 41 checks pass and 320px visual checks cover empty/full heat, encounter and narration. Deployment and live display were verified. Physical-phone feedback remains open.
2. City editor: player-controlled building placement and layout, with multiple homes/production buildings and unique landmarks. Implement roads and the layout editing rules.
3. Construction: ember-funded clearing/foundations, ratkin building over time, progress during arcade runs and while away, mandatory ember sealing before operation. Costs, times and offline limits remain to settle.
4. City production: food supports workers, materials support construction, homes expand workforce. Implement initial supplies/population, production/consumption, storage and growth; quantities/rules remain to settle.
5. Physical logistics: ratkin carry goods along roads. Distance and congestion affect output. Implement delivery jobs, routing, loading/unloading and disconnected or blocked routes.
6. Automation with optional optimization: automatic staffing/priorities and comparable management behavior by default. Players can optimize if they want; exact override controls remain to settle.
7. Upgrades and acceleration: ember-funded upgrades and faster progress, with predictable production gains. Preserve existing earned arcade upgrades when introducing the new city system.
8. Sealing/cosmetics: random cosmetic appearances from sealing and major upgrade milestones; retain all unlocked appearances and allow selection. Cosmetic rarity must not gate favor or release. These rolls do not grant random gameplay power in Fwoosh.
9. Ratkin favor and judgment: define complete restoration, favor-earning acts and the ratkin's release decision, then implement those systems. Nineteen rescues and five district victories are not automatic freedom.
10. Actual ending/resurrection: implement earned release and a satisfying standalone ending, plus the route for returning Duy to the RPG. The story text now describes the intent; the mechanism is absent.
11. Chit-tat-to's Invoice: debt repayment depends on the embers Duy collected. Implement the conversion and reward mechanism, including bonuses, rare/unique items and upgrades. Collection definition, rate, costs, thresholds and reward rules remain unresolved.
12. Duy's System Shop: ember-funded Duy-specific upgrades after rejoining the party. Decide its relationship to the Invoice and the shared or separate spending budget.
13. Missable Ratkin recruit: available in the RPG after Duy returns having rebuilt ratkin society. Identity, recruitment scene, eligibility, missability and abilities remain unresolved.
14. Cross-game save handoff: keep integration simple while transferring the necessary Duy/restoration/ember/reward state; prevent duplicate redemption. Reconcile the existing Duy-survives route, debt transfer and RPG payoff timing.
15. Makko character animation: obtain and approve a real ratkin run prototype, then the remaining requested townsfolk, fire demon, Duy human/fire/cinder and Keith locomotion. Existing loop sheets are not proof these run cycles are complete.
16. Vent art: complete the cinder clipping/scale improvement using Makko sources. The original sheet was restored when the prior correction was withdrawn. Review historical fire-vent taper provenance before treating it as verified Makko-only artwork.
17. Diary illustrations: twelve assignments remain. Existing dark_cell artwork may fill one after review. Missing assignments: The Last Morning; Cuong; Two Bags of Spring Rolls; The White Shirts; The Knife; The Last Joke; The Waiting Room; The Job Offer; The Dark Cell; The Debt; Keith; The Door.
18. City/district/reward art: Makko buildings, construction/sealed/upgrade appearances, roads/environment pieces as needed, and related cosmetic/reward/recruit art. Scope alongside each implementation rather than generating an undefined full set.
19. Audio and effects polish: music and gameplay/UI sounds; scoped summon/collapse, interception, healing and telegraph presentation. Some effects already exist; this is completion/polish, not a claim that all effects are absent.
20. Playtesting and balance: physical-phone controls/readability, complete unassisted runs, heat/vent/Edge/Keith balance, progression pacing and new city/offline behavior. Fixture and automated checks do not substitute for this.

## Older unfinished items that need reconfirmation or reconciliation
- Keith ignition variety: the older request alternates Keith directly torching villagers with sending interceptable creatures. Interceptable imps exist; the direct-torch/alternation portion needs verification and completion if retained.
- Heroes and mastery: selectable rescued townsfolk, character abilities, unlock feats, per-hero mastery and Makko form/animation sets. Reconcile this with Fwoosh being Duy's personal story before implementing.
- Expanded hub landmarks: Tavern, Chapel, Watchtower and Dana's House appeared in the old proposal. Their roles, names and unlock conditions need reconciliation with the new ratkin city. The Chapel district already exists; it is not an implemented Chapel building.
- Unified Keith progression ladder: old plans tie town milestones/wins to one persistent ladder. Current opponent history and escalating district moves already work. Redesign the remaining layer around Keith as jailer, without a duplicate favor/feud account.
- Per-face diary/character features: the fifteen Duy chapters and reader exist; optional additional vignettes and stable villager identities remain proposals.
- Cool Blood retuning: moving its benefit from passive regeneration to vent healing was proposed, not approved or implemented.
- Daily seeded challenge, streaks, share cards, rewarded ads/double rewards/revive: discussed, unbuilt, not settled launch requirements. Existing CrazyGames lifecycle hooks are not ad flows.
- Extra district themes, hero sets and visual effects: scope after the relevant gameplay decisions.

## Trackers, preservation and publishing
- Consolidate older roadmap/canon/asset records so superseded statements do not masquerade as current decisions.
- Add scoped backlog issues with owner, acceptance criteria and implementation/release status; the current three open umbrella issues do not cover the entire new design.
- Keep Fwoosh and Ledger decision records synchronized explicitly.
- Refresh asset inventory, provenance, dimensions and approval status after art changes.
- Choose and connect an off-device source-art backup destination. Verified local backup/restore exists; off-device backup does not.
- Correct outdated repository/public descriptions and prepare actual CrazyGames submission metadata/build validation when ready. ZIP creation and SDK hooks already exist.
- Continue publishing each verified major change to the live site for Tony's testing; distinguish local, pushed, merged and deployed.

## Standing decisions and superseded proposals
- All artwork must be Makko.
- Embers will never be sold for real money. The archived ember-pack IAP proposal is canceled.
- Ratkin judgment grants release; defeating Keith does not.
- Automate by default; allow optional optimization.
- Keep the arcade game central and the rebuilding layer behind it.
- Earlier flat demon caps, separate Resolve currency and old Forge unlock numbers have been superseded by working systems; they are not missing implementation tasks.

## Recommended next sequence
Current priority: polish the existing core loop and ember economy through a ten-improvement interview. First approved package: vent commitment and cinder-eating demons (VENT_TUNING.md), candidate 2026-09-14-vent-1. Continue economy/reward/price interview after live feedback. City placement/construction/transport, offline economy, sealing, favor/ending and cross-game integration follow later. Makko assets and audio can progress alongside bounded implementation work. Older optional systems require scope decisions rather than automatic inclusion.
