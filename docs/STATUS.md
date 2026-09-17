# Fwoosh status — September 17, 2026

## Rescue all three Ratkin states - 2026-09-17-rescue-1

Calm Ratkin now ascend on contact for one carried heat. Cinder people use the same full rescue reward/accounting path, replacing their previous half payout. Flaming rescues retain their heat gain and existing burning-only chains. At the same incoming heat, all direct rescues award equal score, embers and Edge, plus one rescue and the correct persistent sanctuary resident. A committed vent heat unit is reserved against double spending. No new save generation or art is introduced.

Auto-run prioritizes burning Ratkin, then affordable calm/cinder rescues, then demons/incoming fire imps. A dedicated witnessed ascension exchange explains using carried heat; calm/cinder ascension uses existing Makko clips without the burning overlay. The diary no longer tells players to let a Ratkin become a wraith: its ordinary 30-rescue unlock remains available.

209 gameplay/save/render checks and 77 asset checks pass. New checks include actual calm/flaming contact, zero/fractional heat, equal rewards, exact costs, demon-to-rescue without ignition, lifetime earnings, cinder consumption interruption, vent reservation, auto-targeting and state-correct presentation/dialogue. A 390px browser fixture verifies all three ascensions, identities and heat transitions. Human balance/phone playtesting remains open. Commit/PR/deployment evidence belongs on #26 and the board.

## Steer then release to Burst - 2026-09-17-release-1

Tony changed the mobile contract: drag the anywhere-except-Vent joystick to steer continuously, then release that same finger to Burst once in the final direction. Second-finger taps no longer dash. A tap/jitter within the 6 CSS-pixel dead zone spends nothing. Canceled touches, lost capture, blur and resize do not Burst. Vent keeps separate touch ownership and committed-unit behavior, including a queued Burst when steering is released during a vent unit. Desktop controls, balance and save2 progress are unchanged.

198 gameplay/save/render checks and 77 asset checks pass. A 390px browser fixture verifies steering, ignored second-finger input and a single release Burst matching the preview. Physical-phone feel remains Tony's test. Release evidence belongs on #26 and the board.

## Anywhere joystick and second-finger Burst - 2026-09-17-joystick-1

Touch anywhere in gameplay except Vent to summon a floating, trailing joystick. Drag continuously to steer; lift to return to auto-run. A second-finger press elsewhere triggers one Burst along the steering direction immediately, regardless of tap location. Vent keeps independent touch ownership and its committed-unit rules. Release-to-dash touch gestures are retired. Desktop controls, balance and save2 progress remain unchanged. Existing Makko ember/flame assets supply the handle and direction preview.

198 gameplay/save/render checks and 77 asset checks pass. A 390px browser fixture verifies dispatched steering/Burst/release events and the presentation; physical-phone feel remains Tony's playtest. The browser logged a MutationObserver error absent from game source; interaction assertions passed. [Control contract and research](MOBILE_BURST.md). Commit, merge and verified deployment are recorded on #26 and the board after publication.

## Direct phone swipe dash - 2026-09-17-swipe-1

Tony reported inverted phone dragging as broken and requested dashes in the swipe direction. Touch now derives direction from finger-down to release, independent of Duy's position or auto-run movement. The existing Makko flame preview uses that same vector. Release commits one charge; a tap or return to the swipe-origin dead zone cancels. The final release coordinates are used even without a final move event. Mouse retains its existing slingshot behavior, with gesture type captured per pointer so prior touch use cannot flip mouse controls.

191 gameplay/save/render checks pass, including all eight swipe directions at two map positions and 320/390/430px widths, preview/release agreement, moving-player independence, revised aim, cancellation, second-finger isolation and mouse behavior after touch. 77 asset checks pass. These are dispatched-event/simulation checks, not a physical-phone playtest. Deployment evidence belongs on #26 and the board. The stable save2 generation is unchanged.

## Authorized fresh save generation - 2026-09-17-reset-1

Tony requested one full wipe of old progress so development no longer carries old save/accounting paths. Startup removes retired `fwoosh.meta` and `fwoosh.opp` and uses stable `fwoosh.save2.meta` / `fwoosh.save2.opp` keys. The reset takes effect when each device/origin loads the new build. New progress survives subsequent reloads/releases, and older tabs cannot resurrect it. Skin preferences and unrelated origin storage remain untouched.

Removed historical ember recovery, unidentified-resident/count migration and inferred district completion. The debug reset and console helpers target the new keys. Ordinary defensive validation for current saves remains. 189 gameplay/save/render checks and 77 asset checks pass, including full old-progress retirement, repeated current-save reloads, stale-tab writes and blocked cleanup. Deployment evidence is recorded on the board and #33 after publication.

## Sanctuary households - 2026-09-17-sanctuary-1

Rescued Ratkin now retain persistent identities and exact Makko civilian appearances, including rekindled husks. Ratkin Quarter → Visit Sanctuary opens the refuge roster and individual household chronicles. Arrival and move-in milestones persist, with paging for longer histories. Earlier saves retain every recorded rescue compactly and explicitly disclose missing historical appearances and dates.

Personal Burrows house one adult household; Apartments house three. Residents automatically choose vacant preferred housing without evicting established occupants. Children remain in community care and never supply workers. Actual housed adults staff stations and appear on their carrier routes; empty homes do not invent workers. Happiness is initially 80 in the refuge, 85 housed, 95 in a preferred home. Housing supplies +10% work rate, or +20% when preferred. Newly rescued workers cannot retroactively produce for time before arrival. Both residence types qualify for restoration and the Hearth vote. Building tools now use two larger rows on phones.

This is the resident/housing foundation, not the complete living village. It uses existing Makko idle/walk performances. Dedicated celebration vignettes, construction/work/cargo art, complete daily routines, shared relationships/families and generational growth remain pending. Departures remain lore only. Approved sanctuary canon and Cursor's art brief are recorded in SANCTUARY_SOCIETY.md and CURSOR_ART_BRIEF.md; Ledger mirrored the canon in commit 049e2ee.

187 gameplay/save/render checks and 77 asset checks pass. Browser checks at 390px width cover the sanctuary roster, household portrait/chronicle, return navigation and larger town controls, with no console errors. Regression coverage includes exact rescue identity, duplicate prevention, old-save migration, housing preferences/capacity, child care, actual production bonuses, historical-work boundaries, apartments in judgment/favor, and whole-frame portrait cropping. Reports: sanctuary-game-audit.json and sanctuary-asset-audit.json. Source/merge/deployment evidence is recorded on #27 and the board after publication.

## Lifetime ember accounting - 2026-09-16-embers-1

Tony confirmed that Chit-tat-to's Invoice counts lifetime earned embers, including those already spent rebuilding. The persistent versioned ember ledger now records each completed run once, including win bounty and excluding the separate first-upgrade grant. Purchases, construction, sealing and acceleration spend only the wallet. The Judgment panel shows the record after the first hearing; it does not introduce an early story reveal.

Older saves recover only a proven lower bound: the larger of recent-run earnings or the remaining wallet minus the known starter grant. These overlapping sources are not added. Historical upgrade prices and unrecorded spending are not guessed. Such saves are marked as incomplete; future settlement is exact and reload does not count it twice. Interrupted, unbanked runs keep the existing settlement behavior. Debt conversion, item rewards, System Shop and cross-game redemption remain unimplemented.

171 gameplay/save/render checks and 77 asset checks pass. The post-hearing record and old-save disclosure were reviewed at 390px phone width without console errors. Audit evidence is in reports/lifetime-embers-*.json. Deployment evidence is recorded on #30 and the board.

## Character readability - 2026-09-16-readable-1

Removed the orange target glow drawn over marked Ratkin and moved the imp's directional warning line beneath the residents. Burning villagers now draw a smaller, softer Makko flame behind their panic performance; the old foreground flame and procedural fallback lick are removed. Residents remain fully visible across the map instead of dropping to 30% opacity at distance.

Arena actors are 50% larger around their existing ground anchors, including Duy, Ratkin, demons, imps, the Arbiter, cinder bodies and allies. Props, map, movement, collision radii, touch targets, saves and economy are unchanged. Phone-width preview compares calm, targeted panic and burning panic beside arena props. 166 gameplay/render checks and 77 asset checks pass; live deployment evidence is recorded on #26/#31.

## Threat-triggered Ratkin panic - 2026-09-16-panic-1

Unburned civilians now flee and use their own Makko panic animation when a demon or arson imp targets them anywhere in the arena, or either approaches within 140 world pixels. Nearby burning villagers also trigger panic within the existing 98-pixel range. Escape uses the existing 130px/s flee speed, below pursuer speed so imps can still catch their targets. Panic persists for 0.65 seconds after danger passes to prevent boundary flicker. Rescue retains its ascension animation; panic alone does not ignite a villager, award a rescue or change persistent saves.

166 gameplay/render checks and 77 asset checks pass, including distant lock-on in the actual simulation step, imp targeting, passing vent demons, recovery, coincident threats and all twelve panic/rescue renders. A local browser fixture showed an unburned target fleeing a distant demon without console errors. Physical-device feel remains playtesting. Deployment evidence belongs on #26/#31 and the board.

## Ratkin ascension and first talking portrait - 2026-09-16-ascension-1

All twelve civilians now use their own saved Makko panic and ascension animations. Burning villagers play panic; rescue plays the matching ascension sheet once over the existing 1.5-second rise/fade path. Ten-frame lantern ascension and eleven-frame panic exports retain their actual counts. The herbalist panic source faces left and is mirrored during import to match the runtime convention. Raw exports remain intact. The unused civilian run atlases stay archived but no longer preload.

Khet-Tak-Tor's first stern talking portrait uses existing transparent Makko source frames, a fixed head/shoulders crop and selected original mouth/blink poses. It speaks during typing and rests while the player reads. Other expressions and Duy's dedicated portraits remain pending; the newer wide, arms-out portrait take is not used. No generation, balance, save, collision or narrative changes.

162 gameplay/render checks and 77 asset checks pass. Every imported frame was reviewed on dark contact pages. Phone-width browser fixtures verify panic, ascent and portrait presentation; all 60 active sheets loaded without console errors. Physical-device approval remains Tony's playtest. Deployment evidence is recorded separately on #31/#39 and the board.

## Full civilian cast - 2026-09-16-villagers-1

All twelve existing Makko civilian designs now populate the arena: vest villager, baker, elder, child, merchant, farmer, lantern carrier, weaver, cook, mason, herbalist and wellkeeper. Khet-Tak-Tor is excluded. Each civilian uses its own idle, walk and run export, retains its appearance during rescue and survives the husk/rekindle transition with the same appearance. Selection uses existing entity identities without consuming simulation RNG. Collision, speeds, rewards and persistent saves are unchanged.

Added 29 exported sheets to the first batch; all 41 imported raw sources have provenance. The shared farmer/mason sheets now load with the arena cast. All 160 gameplay/render checks and 52 resource/atlas checks pass. Contact pages cover every imported locomotion frame; local browser fixtures loaded all 47 active sheets without console errors and checked walking, burning and rescue at desktop and 390px phone width. Physical-phone feel remains Tony's playtest.

Ascension audit: none of the 113 named sprite sheets observed in the FWOOSH collection was labelled ascension/rescue. The inspected vest death sheet falls down; it is not ascension. Unexported source animations have not been exhaustively identified. Rescue still rises/fades the matching Ratkin still, so a dedicated ascension clip remains unverified rather than presumed nonexistent.

## Ratkin cast and village workers — 2026-09-16-ratkin-1

The first existing Makko art batch is integrated: Ratkin arena walk/run/idle, state-driven Arbiter idle/run/cast/hit, a static Ratkin dialogue close-up, and farmer/mason route and station animations. Rescues retain the Ratkin body while ascending instead of changing to the old human rescue sheet. Existing save keys, simulation, economy and collision remain unchanged. Village sheets load on entry.

Raw Makko exports and exact provenance are versioned. All 157 gameplay/render checks and 23 asset checks pass; browser fixtures verify arena, city and station presentation. Dedicated emotional/talking portraits and bespoke worker/building art remain in Cursor's lane. See [art integration](ART_INTEGRATION.md) and [Cursor brief](CURSOR_ART_BRIEF.md). Publishing/deployment is recorded separately in the owning issue.


## Five-bloc favor and release — 2026-09-15-favor-1

Ratkin favor now continues from the first restoration hearing through five social blocs. The Hearth supports Duy after one additional connected sealed Burrow; the Bowl after eight new food; the Hand after six new materials; the Claw after twelve new ascensions plus another Arbiter trial victory; and the Memory after all fifteen optional diary chapters are read. Post-hearing baselines prevent earlier city production and combat from granting the new votes retroactively. Once earned, support persists.

The Ratkin Judgment screen replaces the restoration checklist with named bloc progress after the hearing and explains the outcome before the player commits: four votes release Duy, while five make the verdict unanimous. Four votes summon a five-line final scene in which Khet-Tak-Tor reports the community's decision, ends the fire's authority over Duy and sends him back toward Cuong and Diep. The optional diary vote is not required for the standalone ending. A fifth vote before or after release records the best Invoice tier and Ratkin recruit eligibility for the future Ledger handoff.

The compatible v1 save adds favor baselines, stable earned-vote IDs, verdict, release and unanimity flags under `judgment`. Existing saves retain all progress; a save that already heard the first judgment starts favor from its current state on the next town evaluation. The release does not yet calculate Invoice debt credit, award cross-game items or export/redeem a Ledger payload. All 155 gameplay/state/input/render-operation checks and 11 asset checks pass. Local phone-scale fixtures verified the bloc checklist and four-vote verdict layout. No new visual asset was added; current verified Makko portraits remain until issue #39 supplies Khet-Tak-Tor's Ratkin replacement.

## Flaming Burst arrow and demon heat — 2026-09-15-flame-arrow-1

The slingshot trajectory no longer appears as a yellow dashed line and plain triangle. Touch and desktop mouse now preview a compact burning arrow assembled from the existing approved Makko flame frames: an ember-red directional spine, animated flame tail and larger forward-pointing flame at the collision-limited endpoint. Unavailable and blocked Bursts dim the same effect. The gesture, inversion, charge spending and cancellation rules are unchanged.

Killing any demon now adds exactly one carried heat, capped at the existing heat maximum. Town and Arbiter demons retain their ember payouts; vent-created demons still pay zero embers. The callout states the +1 heat result explicitly, making demon interception another way to fuel hot rescues or damage Khet-Tak-Tor while increasing Duy's heat risk.

All 150 gameplay/state/input/render-operation checks and 11 asset checks pass. A phone-scale browser fixture verified the Makko flame arrow with no console warnings or errors. No save schema or new art asset was added.

## Slingshot Burst input — 2026-09-15-slingshot-1

Touch and desktop mouse now share one inverted Burst rule: point, hold or drag opposite the direction Duy should travel, see the actual collision-limited trajectory, and release to commit. A quick tap Bursts away from the tapped point. Returning near Duy cancels without spending. The mouse receives the same visible trajectory as touch; desktop WASD/arrow steering and Shift Burst remain unchanged.

The gesture retains active-pointer isolation, safe HUD/dock/gutter handling and release-only charge spending. All 149 gameplay/state/input checks and 11 asset checks pass. No save, economy, combat or art data changed.

## Direct-touch mobile Burst — 2026-09-15-burst-1

Mobile no longer fires a dash when a swipe crosses an invisible distance threshold. A touch anywhere inside the arena now establishes one Burst direction from Duy's position at touch-down. Holding or dragging displays a dashed path and chevron at the collision-limited endpoint; the player may revise the direction freely, and only release spends one charge. Returning the pointer within 42 world pixels of touch-down Duy cancels. Autorun movement during a hold cannot skew or reverse the intended vector.

HUD, dialogue dock and gutter touches remain inert. Vent retains its separate button. The active pointer owns the gesture so a second finger cannot trigger Vent, replace the aim or prematurely release the Burst. Pointer cancellation, resize and focus loss spend nothing. Desktop WASD/arrow steering and Shift dash are unchanged. The trajectory is code-native feedback; no artwork was added or replaced.

All 148 actual-script state/input checks and 11 asset checks pass. A local browser fixture visually verified the phone-scale trajectory, endpoint chevron, Vent clearance and charge row with no console warning or error. The fixture is evidence of rendering, not physical-phone feel; Tony's live-device playtest remains the acceptance test.

## Demon hit interruption — 2026-09-15-knockback-1

A demon bite now cancels the active vent or heal unit, discards its partial progress, releases the held input and clears a queued vent-dash. The player must deliberately press again after recovering from the hit. A short forced knockback moves Duy away from the attacking demon; walls and solid props stop the knockback safely instead of allowing either body to remain stacked inside scenery.

The damage value, invulnerability window and demon attack cadence are unchanged. Two new regressions cover interrupted healing and physical separation; all 144 game/state checks pass.

## First Ratkin Judgment — 2026-09-15-judgment-1

The town now exposes a five-term Ratkin Judgment record: clear all five districts, ascend nineteen Ratkin, connect and seal two Burrows, operate a connected sealed Mushroom Farm, and operate a connected sealed Salvage Yard with a connected sealed Storehouse. The production terms require at least one food and one material created after tracking begins; starting resources and loaded balances do not count as proof.

Completing the record automatically summons Khet-Tak-Tor on the next return to Ashford or exit from the Quarter. A three-line present-tense scene acknowledges that Duy rebuilt a society capable of surviving and states clearly that release still requires Ratkin favor. The scene records only lines the player reaches, persists when completed and does not replay automatically. The hub and Shrine now keep the five terms visible from the start.

The compatible v1 save adds `city.producedFood`, `city.producedMaterials` and `judgment:{eligible,heard}`. Larger settlements remain optional. Favor actions, release, resurrection and the Arbiter's final mandate remain issue #29 follow-ups. 142 actual-script checks and 11 asset checks pass. No new art was added; the scene reuses the current verified Makko portraits while Cursor's Ratkin Khet-Tak-Tor replacement remains pending.

## Khet-Tak-Tor runtime migration — 2026-09-15-arbiter-1

The jailer is now Khet-Tak-Tor, the Ratkin Arbiter, everywhere the player sees or hears his identity: live dialogue, archived conversations, diary, town feud banner, district launcher, combat HUD, tactical callouts and final district name. The combat runtime now uses Arbiter terminology for boss state, moves and summoned threats. His existing behavior and tuning are unchanged.

Older saves remain compatible. The diary chapter keeps its historical `keith` identifier, archived speaker records migrate from `KEITH` to `KHET-TAK-TOR`, and the existing verified Makko sprite and animation remain temporarily under the `keith` media key. Cursor's Ratkin Makko replacement is still required under issue #39; this release adds no generated or substitute artwork.

139 actual-script checks pass, including a new regression that preserves and relabels legacy conversation history across reload. This checkpoint was superseded by the first-judgment release above.

## Renewable duel fire — 2026-09-15-duel-fire-1

Tony found a level-one boss soft lock: entering the Keith encounter without enough carried heat left no way to earn the eight heat required to win. The ordinary fire-imp scheduler explicitly stopped when `duelActive` began, while level one has no separate heat-producing move.

The duel now maintains at least three calm villagers and continues a slower, readable fire-imp cadence. Intercepting an imp supplies one heat directly; missing it ignites the marked villager for the normal chase-and-rescue loop. The first duel source arrives promptly, then repeats every 3.2 seconds at level one, scaling to a 2.6-second cadence by level five with a 2.2-second floor. Existing boss moves continue normally.

138 actual-script checks pass. New regressions prove an empty duel repopulates valid targets, schedules an imp, ignites a villager when missed, grants heat when intercepted and accepts that heat as boss damage. Save data, economy, city state and art are unchanged.

## Ratkin logistics and optional priorities — 2026-09-15-logistics-1

The Ratkin Quarter now supports four complementary structures. Mushroom Farms produce food; Salvage Yards consume one food to produce one building material; Burrows provide connected workers; Storehouses add 15 spaces to the shared food and material caps. The city begins with four bootstrap food so the initial Burrow/Yard pair remains useful. At zero food, automatic assignment temporarily favors a connected Farm and avoids a deadlock. Otherwise available workers choose eligible stations by high, normal or low player priority and then construction order.

Every operating Farm and Yard now has a visible code-native Ratkin carrier marker moving along its actual road route. Stations sharing road cells add four seconds of congestion per other active carrier. Distance and congestion appear in the station view, alongside the current input, output and blocking reason. The system still runs without manual intervention; priorities, road layout, building movement and added storage provide optional optimization.

The compatible city save adds `food` and per-station `priority`; city-1 saves receive four food and normal priorities. 136 actual-script checks pass, including food bootstrap, Yard consumption, automatic deadlock recovery, Storehouse capacity, shared-road congestion, priority persistence, visible logistics and the entire arcade/save suite. The carrier remains a UI marker until Cursor supplies approved Makko Ratkin locomotion.

## Ratkin Quarter foundation — 2026-09-15-city-1

Town now opens a persistent 5×5 Ratkin Quarter plan. Players extend free roads from a fixed gate, place Burrows and Salvage Yards beside the connected network, and can move buildings later. The first Burrow foundation costs 40 embers and takes 90 seconds; the first Yard costs 60 and takes 150 seconds. Five embers remove 30 seconds from active construction. Completed buildings remain inert until sealed for 20 or 30 embers respectively. Ratkin continue construction during arcade runs and for up to eight hours away.

A sealed connected Burrow supplies one automatically assigned worker. A sealed connected Yard turns ruin salvage into one building material every 45 seconds at the shortest route; each extra road step beyond two adds five seconds. Extra Yards wait automatically when workforce is insufficient. Later copies require building materials, establishing the first self-feeding city loop. Each Yard has a station view showing its input, output, route, progress and blocking reason. This initial presentation uses the existing verified Makko Ashford background plus code-native interface elements; Ratkin-specific character/building art remains with Cursor under issue #31.

The save remains version 1 and adds an optional `city` record. Older saves receive a clean gate plan while preserving embers, upgrades, districts, diary and opponent history. Invalid or overlapping city records normalize safely. 130 actual-script checks pass, including migration, spending, connection rules, offline time, sealing, assignment, distance-adjusted output, moving and reload persistence. Congestion, food, storage, manual priorities and Ratkin hauling animation remain issue #28.

## Well identity and town story cleanup — 2026-09-15-well-2

The Well now has one clear arcade purpose: survivability. Deep Well adds maximum hearts, while the renamed Deep Draught shortens each committed vent-heal from 0.60 seconds to 0.50 and then 0.40 seconds. The passive clear-of-fire trickle remains at its base rate. Faster healing therefore reduces Duy's rooted exposure, but each completed heart still releases one persistent vent demon. Existing `regen` purchases convert automatically to the matching Deep Draught tier without a save migration or refund.

The town Well card now states `hearts · faster vent healing`. The Shrine card is hidden until Ratkin favor and judgment give it a distinct function; its dormant record sheet remains in source for that later system. Diary is the single visible optional story destination and uses the full second row. This establishes the content boundary: Diary contains Duy's memories and understanding, while the future Shrine will contain Ratkin society's present judgment, favor and release eligibility.

## Assisted chase and distant vent spawns — 2026-09-15-assist-1

Auto-run now guides Duy toward periodically updated sightings of the nearest burning villager instead of continuously tracking the runner's exact live position. A newly ignited villager also bolts away from Duy before settling into its erratic panic path. Together these changes turn nearby ignition into a readable chase: the assist keeps the player oriented, while steering toward the runner's new path and timing a dash creates the interception. Demon guidance remains exact because contact without a dash still hurts Duy.

Vent-created demons now enter at least 260 world pixels from Duy in a valid space outside the arena's solid props, villagers and cinders. The existing emergence delay still prevents an immediate attack. Manual steering and every directed dash clear the assist's old sighting immediately. Runner speed remains 205 versus Duy's normal 170; burn fuse, rescue radius, rewards, save data and art are unchanged. Automated checks cover sighting refresh, manual release, initial flee direction, normal-run disadvantage, dash interception and distant valid demon spawns from multiple player positions.

## Faster burning runners — 2026-09-15-chase-1

Burning villagers now panic-run at 205 world pixels per second, up from 150. That is faster than Duy's clear-headed 170-pixel jog, so unattended pursuit cannot simply reel in a target fleeing in the same direction. A directed dash still closes the gap decisively; carrying heat can also push Duy above their speed, rewarding the existing risk loop. Their fuse, movement pattern, rescue radius, rewards and all other actors are unchanged.

The tuning test proves a straight fleeing runner opens distance against an ordinary jog and is caught by one well-aimed dash. The broader pursuit, collision, economy, input and save suite remains in place.

## Priority auto-run — 2026-09-15-hunt-1

Duy's unattended heading now pursues the nearest burning villager whenever one exists. When no villagers are burning, he pursues the nearest fire demon. He uses the prior heat-sensitive wander only when both sets are empty. Pursuit turns smoothly instead of snapping; held movement keys and player-directed dashes take immediate priority, preserving the player's ability to route faster, cut off threats and avoid a bad automatic approach. Running into a demon without dashing remains dangerous.

The live-action dock no longer advertises the cheapest town upgrade by name. This removes unexplained labels such as `COOL BLOOD` from the run while preserving the upgrade and its progress inside the town Well. No save, reward, enemy, damage or art data changes.

Automated checks cover target-class priority even when a demon is closer, nearest-target selection, safe-field fallback, smooth turning, immediate manual override, an actual open-lane rescue, collision deflection around the wagon and the town-only upgrade-name boundary. Local browser scenarios also reached stationary targets around the wagon, well and lower crate pile without becoming pinned.

## Cinder threat readability — 2026-09-15-cinder-read-1

The cinder-eating sequence still drew a red blast-radius circle and a circular countdown after the earlier demon-windup ring was removed. Those remaining circles are gone. A straight dashed tether now identifies the threatened cinder person, a compact bar shows the interruption window and the existing Makko flame intensifies on the target. The resolved explosion continues to use the existing Makko flame burst. Timing, damage, affected radius, interruption rules and saves are unchanged.

Tony also established Khet-Tak-Tor's connection to Duy: the gate collapse briefly kills the Ratkin jailer alongside Duy; Ratkin revive Khet-Tak-Tor but cannot revive Duy. During that shared near-death interval, the Ratkin god, Adonai and Odin bind Ratkin and humanity through the two of them. Their covenant can endure only if both peoples overcome the violence of their introduction. This canon record does not yet replace Keith's runtime name or art.

## Adaptive grudge beacon — 2026-09-15-beacon-1

Tony reported that the separate magenta well/beacon sprite in the run was inert until collision. It is the opponent's grudge beacon, not the stone well baked into the arena background. Its recording and attack were still connected to the retired pass/fuse loop. Direct rescues now teach its territory model and preserve heat-at-rescue observations in the compatible opponent save. From the next sufficiently observed run, the beacon appears in the busiest rescue area and fires one telegraphed attack when Duy begins venting.

The telegraph lasts 0.9 seconds: releasing finishes the committed unit, and a queued or immediate dash clears the marked spot. Remaining there costs one heart. Dashing through the beacon first destroys it and disarms the attack. First-run dialogue suppresses the system. Existing opponent histories still arm it; no save reset or schema change is required.

107 actual-script checks pass, including current rescue recording, next-run arming, vent activation, one-heart impact, queued-dash evasion, proactive destruction, legacy/first-run behavior and the prior game suite. A local rendered fixture verified the dormant, mid-telegraph and impact states with no console warnings/errors. This is a mechanic repair, not a completed balance playtest.

Issue #36 tracks both halves of Tony's request. This release keeps the current verified Makko beacon art in the run. Cursor owns two distinct replacement Makko icons for The Well and The Shrine town cards under issues #31/#36; the same beacon icon remains on those cards until that art is approved and integrated.

## Project-management consolidation — September 15, 2026

No game code or live build changed. `docs/ROADMAP.md` is now the concise source of truth for unfinished work; shipped chronology remains in this file and superseded proposals remain under `docs/archive/`. GitHub issue #1 is a current work board. Issues #26–#33 separately track arcade/economy tuning, city foundation, city logistics, favor/ending, Ledger integration, Makko art production, audio/release readiness, and records/source backup. The completed foundation issue #2 is closed; stale mixed Cursor issue #3 is closed as superseded by the current Makko tracker #31.

`docs/COORDINATION.md`, `docs/CANON.md`, `docs/SAVE_DATA.md`, `ART.md`, `AGENTS.md` and the Fwoosh/Ledger shared handoff were reconciled to the current ownership, live dialogue/reset behavior and roadmap. Unapproved older ideas are explicitly parked rather than represented as committed work. The asset inventory itself was not regenerated because this change adds no art; issue #33 requires a refresh after the next approved art handoff and still needs an off-device destination.

## Debug reset menu — 2026-09-15-debug-1

Backtick opens a paused debug screen from title, play, town or results. Reset progress and restart requires a separate confirmation; Cancel is selected by default. Clears only fwoosh.meta and fwoosh.opp, preserves skin preference and other games, and immediately starts district 1 with fresh opening dialogue. Escape goes back, backtick closes, arrows/Enter or pointer choose actions. A storage failure attempts rollback and displays an error without starting a new run.

102 actual-script checks pass, including reset persistence, dialogue initialization, input isolation, cancellation and storage-failure rollback. Local browser testing with a synthetic save verified backtick, clickable confirmation, cancellation, keyboard confirmation, and a fresh first run at zero embers/district 1/intro line 0. Live user progress was not reset. Issue #1 records deployment. This keyboard debug entry is for desktop testing.


## Clean control labels — 2026-09-15-clean-hud-1

Removed the persistent WASD/SHIFT and swipe instructions, desktop HOLD SPACE/VENT/HEAL prompt, and DASH text beside the charge icons. Mobile keeps the Makko VENT/HEAL button; dash pips and active gameplay feedback remain. Input bindings are unchanged. Tony requested this simplification on September 15. All 97 existing checks pass. Local browser fixtures verify desktop has no control instructions and touch mode retains its VENT button. Issue #1 records deployment.


## Sharper UI typography — 2026-09-15-type-1

Tony requested a sharper, more legible font in the same visual family. Compared Pixelify, Chakra Petch and Oxanium at phone text sizes; selected Chakra Petch Medium/Bold for its squared forms and clearer numerals. HUD, dialogue, diary, shops and counters now use Chakra Petch. Large decorative Makko titles remain. Small image-atlas labels use real text. Both font weights are bundled locally and preloaded; no Google Fonts runtime request is required. Original fonts and artwork are preserved.

97 existing state/input checks pass. Browser fixtures inspected HUD/dialogue, first-upgrade cards and diary at 320/375/430px. This is visual inspection, not a physical-device usability study. Full-map layout, barrel collider, demon-circle removal, saves and economy remain unchanged. Issue #1 records deployment.


## Remove demon windup circle — 2026-09-15-demon-art-1

Removed the drawn yellow ring around vent-born fire demons during their windup, as Tony requested. Existing Makko demon animation and simulation timing remain unchanged. ART.md records the rule against reintroducing this overlay. All 97 existing checks pass; a local browser fixture verifies the demon windup without its yellow circle. Issue #1 records deployment.


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
