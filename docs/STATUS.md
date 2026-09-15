# Fwoosh status — September 14, 2026

## Left barrel collision — 2026-09-15-barrel-1

Tony reported walking over the top barrel below the upper-left crates. Raised the barrel cluster collision top by 3 world pixels (296 → 293), retaining its bottom at y=478 and its width. Full-map framing is unchanged. All 97 existing state/input checks pass. Issue #1 records deployment; Tony should judge the alignment in the live playtest.


## Full map viewport — 2026-09-15-full-map-1

Supersedes hud-safe-1, which incorrectly removed 32.8% of vertical travel. Original simulation, spawn distribution, opponent target mapping and obstacle coordinates are restored exactly from the pre-regression dialogue build. The complete world now renders with a single uniform transform between a compact header and a stable bottom dialogue/control dock. Pointer taps invert that transform; dock and gutter touches cannot spend dash charges. Device safe-area insets affect screen fit only. Small visual overhang accommodates bodies at the original walls; oversized decorative flames may clip.

97 actual-script state/input checks pass, including original upper route access, full-map corners, screen/world mapping at 320/375/430/1280px and resize cancellation. Local browser fixtures checked normal play, rescue feedback, longest present dialogue, maximum cinder vent pop and Keith at the upper wall at 320/375/430px; an actual browser tap used the correct transformed heading. No console warnings/errors observed. These checks are not human balance testing or physical-device testing. The map is uniformly displayed at 70.2% of its former canvas scale to fit the full arena and separated docks; smaller actors are the key playtest tradeoff. No new artwork, narrative, save migration or economy changes. See FULL_MAP_VIEWPORT.md and issue #1 for release verification.

Earlier checkpoints below are historical.

## Reserved top HUD — 2026-09-15-hud-safe-1

The top HUD now occupies its own opaque screen area. Running, dashing, collision pushes, villagers/enemies and old opponent targets respect the upper arena boundary with clearance for the largest existing vent pose. Temporary rescue/tactical messages share the header instead of covering play. Header taps cannot spend dash charges. 96 checks pass; 320px human/vent boundary poses verified. No new art, save migration or economy-value changes. The reduced playable height needs balance playtesting. See HUD_SAFE_AREA.md; issue #1 records deployment.

Earlier checkpoints below are historical.

## Present dialogue and diary rewrite — 2026-09-15-dialogue-1

Tony approved clear present-tense exchanges in bottom-screen text boxes and backstory primarily in the optional diary. The live opening is one short instruction. Rescue, rising carried heat and vent completion prompt brief reactions; later returns introduce repeated death, Keith's role, ratkin judgment and rebuilding. At most two story exchanges per run, sixteen seconds between exchanges, no stale lore queue, no frozen return card. One optional combat reaction shares the same box and cannot interrupt. Dialogue remains automatic while movement, dash and vent stay available. Diary → Conversations rereads delivered words without revealing future lines.

Fourteen diary chapters were rewritten as connected prose; the approved painful heat/ascending ratkin chapter is retained. There are 15 chapters and 35 pages. Identities, art references, hints, unlock predicates, purchases and existing read flags are unchanged. The market betrayal does not reveal Mei's motive before her confession; no new explanation for Duy's five-life balance is introduced.

90 state/input checks pass, including nine new event pacing, interruption, persistence and history checks. Loaded-font browser measurement: all 35 diary pages fit (maximum baseline 980, limit 1160); all story dialogue fits (maximum 957, limit 1015). Phone-size visual checks cover the bottom box/control clearance, conversation navigation and the longest diary page. No human reading-speed or story-comprehension test has been claimed.

**Art still pending:** this release uses static crops of the existing verified Makko Duy/Keith sprites. Seven dedicated talking/emotion clips are requested on Cursor issue #3, with prompts, source requirements and atlas integration in docs/DIALOGUE.md. They are not generated or integrated, and Cursor acknowledgment has not been verified. No other art generator is used. Codex owns this scoped runtime/story/history change; Cursor retains the art lane. Release/PR verification is recorded on issue #1.

Earlier checkpoints below are historical.

## Prose discovery rewrite — 2026-09-15-prose-1

Tony requested a complete prose rewrite following the author-craft research and confirmed that players should feel disoriented, under pressure and gradually discover what happened. The deeper story remains optional.

All fifteen diary entries (78 short pages), their teasers, Keith's opening, greetings, reactions and fourteen later observations were rewritten. Duy's ordinary memories establish warmth and relationships; later entries reveal the market, afterlife, cell, debt and gate through his limited viewpoint. Mei's coercion is explained in her later confession rather than presented as knowledge Duy already possessed in the market. The early wraith entry does not reveal the cell's massacre. Keith's automatic speech gives immediate guidance and fragments rather than reciting the entire backstory. Shrine and diary labels and the public description were adjusted to match. Ratkin judgment still determines release; the final optional entry describes the restoration/favor obligation without adding a finished ending or redemption mechanic.

Chapter IDs, titles, art assignments, unlock predicates, hints and saved read history are unchanged. Gameplay, economy and art are unchanged. INTRO_VERSION is 4 so the revised live opening plays once for returning players; it still allows movement, dash and vent. Existing progression is retained. Older loreIdx progress is preserved; later observations are not forcibly replayed.

Validation: all 81 gameplay/input checks pass in reports/prose-state.json, including intro control and one-time replay/save preservation. A comparison against the prior story verifies identical diary identities/art/unlocks/hints and STORY data structure. Browser measurement with the loaded Pixelify font checks all 78 pages, seven opening lines and fourteen lore lines: maximum diary baseline 728 (navigation begins below 1160), opening baseline 943 (available through 1008), lore width 587.425 within 700. Local 320px visual checks cover a diary page, one of the longest pages and the opening during gameplay; no console errors observed. Voice and reading pace remain subject to Tony's playtest.

Release verification and final commit/PR are recorded in issue #1. No new art, factions, magic explanation, city system or Invoice conversion was invented. The author research informs general craft; the passages are original to Fwoosh.

Earlier checkpoints below are historical; this section and issue #1 take precedence.

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

## Verified live baseline

Build 2026-09-14-vent-1 deployed through PR #12 at main 2d0540d00c1408a3ee27f967de09177f42628167. Reliability/refactor/Makko corrections, the action-first Keith narration, readable heat/rescue HUD, vent-unit commitment and persistent cinder-eating demons are live. The arcade loop, chain rescues, Edge, five districts and encounters/replay, allies, rewards, Well/Forge, Shrine and fifteen diary chapters exist.

## Economy release candidate

2026-09-14-economy-1 removes ember rewards from vent-created demon kills and offers one extra heart or dash capacity for 20 embers after the first settled run. A one-time wallet top-up guarantees affordability even after a zero-rescue loss, before building unlocks. Existing unupgraded saves qualify after their next run; upgraded saves preserve their balances and tiers. Later shop prices remain unchanged. See ECONOMY_TUNING.md for exact rules and unresolved pacing/accounting decisions.

67 gameplay/input checks pass (docs/reports/economy-state.json). 320px browser checks verify earnings/bonus presentation, both purchases, deferral and reopening. Release-versioned script URLs avoid mixed cached modules. The build ZIP matches tested source. Physical-phone and human balance testing remain open. Issue #1 records the final merge, deployment and live browser evidence; a candidate or pushed branch alone is not a live release.

## Priority and deferred work

Polish the existing core loop and ember economy through Tony's ten-improvement interview before city expansion. Continue with later purchase cadence, earning sources, prices and upgrade effects. Do not count individual interview answers as ten completed improvements.

Confirmed city design remains: freely placed buildings, multiple production buildings and unique landmarks; roads and physical ratkin hauling with distance/congestion; automatic priorities with optional optimization; ember foundations, offline construction and mandatory ember sealing before operation. City production, favor/judgment, earned resurrection, Invoice conversion/rewards, RPG System Shop and missable Ratkin recruit remain unbuilt. Embers will never be sold. See CANON.md and ROADMAP.md.

## Art and coordination

Cursor owns Fwoosh Makko art/animation in its separate checkout. Ratkin run approval, cast locomotion, cinder clipping/scale correction, twelve diary assignments and audio remain open. Codex continues scoped gameplay, testing, records and releases independently. Preserve original checkouts and saves; reconcile overlapping diffs during integration. Verified source backup is local; off-device backup remains unresolved. The separate Ledger task receives shared canon explicitly.
