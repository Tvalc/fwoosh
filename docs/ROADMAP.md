# Fwoosh — complete remaining backlog

## Reward and retry loop — 2026-09-14-loop-1

Tony approved applying the saved research: frequent satisfying rescue rewards, quick retries and visible progress toward a useful upgrade. Measure run duration instead of imposing the earlier proposed 2–3-minute timer. This release adds grouped rescue ember feedback, a live run wallet and next-goal counter, and results with separate earned/first-upgrade-bonus amounts, upgrade progress and explicit retry/town actions. The town goal considers every reachable unfinished upgrade across both shops and opens the cheapest track's shop. Starter offers and building unlock goals remain supported; no automatic purchase is made.

Run Again restarts the current district after a loss; Next District advances one after a clear, capped at district 5. Earnings settle once before either choice. Building unlocks are processed even on quick retry. Fresh Enter/R/Space retries, T opens town/upgrades; held repeat and movement keys do not skip results. Pointer state is cleared before retry so the release does not consume a dash. Repeated opening cards are skipped on quick retry; the first-run story sequence remains.

Initial playtest prices: first-run choice remains 20; regular hearts and dash capacity cost 100/240/540, recovery and recharge 100/240. Owned tiers and balances persist, and effects are unchanged. A starter purchase occupies tier 1, so its next same-track tier costs 240; other first-tier tracks cost 100 when unlocked. These prices target useful early purchases every 2–3 ordinary runs and about twice-as-fast skilled progression. They are not measured balance results.

The reward audit uses explicitly assumed event profiles through actual game functions: ordinary 7–9 rescues at alternating heat 1/2 plus a walking imp and rekindle yields 44/50/55; skilled 9–11 rescues at heat 3/4 plus a dashing imp, rekindle and two eligible demon kills yields 88/97/105. The midpoint ratio is 1.94. At 100 embers, the ordinary profiles afford a purchase after 2–3 runs. These are constructed profiles, not human playtests or evidence of achievable behavior. Later 240/540 tiers need separate evaluation as players reach later districts. No duration is assumed, no flat skill multiplier is added, and spawning/reward rates remain unchanged.

The save now retains the newest 20 completed runs locally: seconds, district, rescues, earned embers, starter bonus and win/loss. Recorded once at settlement; no network telemetry. `earned` includes a clear bounty, excludes the starter bonus. Old saves lacking this array remain compatible. This bounded history is for tuning, not lifetime collected-ember/Invoice accounting. Existing lifetime records are preserved; historical missing rewards are not reconstructed.

Validation: 81 gameplay/input checks pass in reports/reward-loop-state.json. Added coverage includes cheapest reachable goals, progress before/after banking, exactly-once retries and unlocks, next-district bounds, repeated keys, pointer cleanup, town/shop navigation, bounded history/reload, grouped feedback/reset, result text and assumed reward profiles. Local browser checks at 320px cover HUD with heat/rescue/vent controls, grouped payout, first-loss bonus, starter navigation, affordable Forge navigation, and town goal. Desktop clear results and clicking into district 2 were verified. A panel/text color bug found visually was fixed. No console errors were observed. These browser checks use controlled local fixtures; sustained human pacing and physical-device playtesting remain open. All artwork is reused Makko material.

Release verification and final commit/PR are recorded in issue #1. City expansion, favor/release, Invoice accounting, new upgrade effects and art production remain separate work.

Earlier checkpoints below are historical. This latest checkpoint and issue #1 take precedence.

## Latest checkpoint: uncapped ember release

Economy-1 was deployed through PR #13 at main 0c264d8d046807693be468695a28707c52bf9b4c. Candidate 2026-09-14-economy-2 removes the 160-ember cap from all ordinary reward sources while keeping vent-created demons at zero. All 70 gameplay/input checks pass; saves, prices, starter purchases and art are preserved. Issue #1 records the final deployment verification. Approved next targets are 2–3 ordinary runs per useful early upgrade and roughly twice-as-fast skilled progression, with higher tiers slower. Price/effect/rate tuning remains open; city expansion stays deferred. See ECONOMY_TUNING.md.

The sections below include earlier feature checkpoints; the paragraph above and issue #1 take precedence for current status.
Reviewed September 14, 2026 against this conversation, current source, the older combat/meta roadmaps, art records, and GitHub issues.

## Implemented and deployed baseline
Latest verified baseline: 2026-09-14-vent-1, main 2d0540d00c1408a3ee27f967de09177f42628167. Release candidate 2026-09-14-economy-1 follows; issue #1 records final deployment evidence.
The action arcade loop, heat mechanics, vent/heal, imps/demons, chain rescues, husks/wraiths, Edge, five district encounters/replay, ember banking, Well/Forge upgrades, Shrine, fifteen diary chapters, reliability fixes and revised live-action intro exist. The latest gameplay suite has 67 passing checks, including the economy candidate. These facts do not mean the systems below are implemented.

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
Current priority: polish the existing core loop and ember economy through a ten-improvement interview. Vent commitment and cinder-eating demons (VENT_TUNING.md) are live. The next candidate adds zero ember payouts for vent-created demons and a first-run choice of heart or dash capacity for 20 embers, funded by a one-time wallet top-up if needed (ECONOMY_TUNING.md). Later purchase cadence, earning rates, prices and upgrade effects remain in interview; unchanged prices are not a completed balance pass. City placement/construction/transport, offline economy, sealing, favor/ending and cross-game integration follow later. Makko assets and audio can progress alongside bounded implementation work. Older optional systems require scope decisions rather than automatic inclusion.
