# State audit — 2026-09-14

Inspected main `d7945b4` and Cursor's local modular snapshot captured at 18:06 UTC. The runner uses actual scripts with in-memory localStorage, an inert external SDK and a stubbed canvas. It captures Shrine text, not pixels.

| Finding | Reproduction | Tracker |
|---|---|---|
| Final completion stays 4/5 | Win district 5, reload and render Shrine: 4/5. Highest unlocked district is used as completed count. | [#4](https://github.com/Tvalc/fwoosh/issues/4) |
| First visit raises only one eligible building | Fresh save, 16 lifetime rescues, enter hub: Well true, Forge false. Short-circuit skips Forge until another visit. | [#5](https://github.com/Tvalc/fwoosh/issues/5) |
| Duplicate calls settle twice | Call pop twice with 20 pending embers: 40 banked. Ordinary-play trigger not established; constructed lethal-demon/heat check settles once. | [#6](https://github.com/Tvalc/fwoosh/issues/6) |

These historical failures are fixed on codex/progression-fixes, integrated with Cursor refactor 435d0fb. The expanded suite passes 29/29; assets pass 11/11. New coverage includes all v1 district migrations, preservation of upgrades/currency/diary, repeated and cross-ordered end events, next-run settlement, combined unlocks and persisted final completion. See [progression report](reports/progression-state.json).

## Coverage

19 checks: 16 pass, 3 fail on the captured modular build. Known failures remain visible and produce a nonzero exit. Coverage includes startup, five quotas/rosters, district 1–4 unlocks/rewards, replays, building milestones, upgrade prices/caps/reload, unaffordable purchases, Forge effects, banking, diary reading without rewards, invalid JSON, partial v1 saves, Edge bounds, vent/dash escape, boss handlers and lethal-demon settlement.

The committed baseline has the same 16 passes and 3 failures. [Baseline report](reports/baseline-state.json), [modular report](reports/modular-state.json) and [asset report](reports/modular-assets.json) record the evidence. All 43 referenced local resources exist, and all nine animation PNG sheets match their declared dimensions (11 static checks pass). These checks do not establish fun, difficulty balance, full boss playability, rendering quality or browser event delivery.

## Browser smoke observation

The isolated modular snapshot loaded its title and artwork in the in-app browser. Clicking started a run; it reached a loss summary, then tapping returned to a rendered Ashford hub. This is a startup/run-end/hub smoke check, not completion of five districts or a mobile-device/animation approval.

## Reproduce and continue

`node tools/audit-game.cjs <game-folder> <report.json>`

`python tools/audit-assets.py <modular-game-folder> <report.json>`

Use a committed tree or captured copy, not a changing folder as a test baseline. After integration, re-run checks, verify save migrations and unlock toasts, play all districts on desktop/touch, inspect cinder transitions, check media/console failures, and validate the real packaged ZIP and hosting output.

## Progression browser check

Using disposable localhost saves and visible test controls, both buildings rose on the same visit and the combined toast fit a 390-pixel game viewport. Forced final-district victory produced 5/5 in the Shrine, still present after reloading the game. This verifies rendering/persistence, not a full five-district playthrough.

`python tools/test-source-backup.py` passes five checks for exact source restore, existing-folder protection, tamper rejection, traversal rejection and backup-location validation. A real 236-file archive was also restored into a new folder and every file rehashed.

## Combined gameplay verification pass

Cursor checkpoint 317963f plus Codex fixes: 38 state/input checks and 12 asset checks pass. All 45 local resource references and 10 atlases validate. Reports: [full-pass-state.json](reports/full-pass-state.json), [full-pass-assets.json](reports/full-pass-assets.json).

The expanded checks complete all five districts at base and maximum upgrades through actual rescue quota and heat-contact handlers, with saved currency/unlocks reloaded between districts. Fixtures position encounters and use invulnerability; they do not assess balance. Fifteen seeded boss simulations each execute 7,200 fixed steps (108,000 total), checking finite state and charge bounds. All shop tracks are purchased through their caps and reloaded.

Two input defects were reproduced and fixed: pointer cancellation dispatched a tap dash, and focus loss left a pending tap that could dash on return. Cancellation now clears the gesture without committing it. Existing touch vent/swipe and desktop repeat/dash behavior remain covered.

A separate simulation-frame defect was reproduced: final heat contact banked 25 embers, then a same-frame rescue changed the result to 28 after saving. The frame now stops after victory or lethal boss effects, keeping the result and saved rewards consistent. This is distinct from duplicate settlement.

The 47-file release ZIP was CRC-checked, compared byte-for-byte to source, extracted, and tested. In-browser prepared encounters for all five districts loaded; touch-pointer vent start/release and cancellation passed. A real canvas shop click spent 60 embers and 1,940 remaining persisted after reload. Browser touch events here are synthetic, not a physical-phone test. A browser Shift press consumed exactly one dash charge. Keyboard repeat/steering checks also dispatch actual registered handlers in the VM. No full unassisted playthrough, mobile hardware certification or animation approval is claimed.

## Release verification — after Cursor 2d9316c

38 gameplay/input checks pass; 11 asset checks pass over 43 local references and nine atlases. The removed ratkin explains the reduced asset count. The integrated title opens gameplay in the browser with the original Makko townsfolk. Package byte integrity is verified separately. These are automated/browser checks; Tony will test balance and physical-phone feel on the live deployment. The cinder visual improvement remains open after restoring the original sheet.

## Story pass

41 state/input checks pass. Three additional regressions verify title-to-intro lifecycle with immediate controls, old-save progress retained across one-time intro replay, and mobile vent HUD/action during dialogue. Browser inspection confirms Keith dialogue over the running game. Runtime media is unchanged from the released Makko correction.

## HUD pass

Build 2026-09-14-hud-1: all 41 existing gameplay/input checks pass. Browser fixture screenshots verify empty/full heat, rescue progress, Keith encounter, and live-action narration at 320px width; wider rendering was checked too. Functional gauges use canvas UI and existing Makko character assets. No runtime media, save schema or balance changes. Human/physical-phone playtesting remains separate.

## Vent commitment / cinder explosion pass

56 gameplay/input checks pass, including 15 added regressions and revised input expectations for committed units. Covered: release/dash boundaries, held chaining, no-op and partial units, upgraded hearts, focus cancellation, persistent enemies across duel transition, one spawn per unit, cinder targeting, consumption/explosion, dash/rekindle interruption, duplicate-target prevention, ignition above ordinary fire cap, and exactly-once lethal settlement. Phone-size browser fixtures verify unit progress, healing, eating warning and blast presentation. Local-only fixtures are excluded from publication. Existing save compatibility and five-district simulation checks pass. Full human balance runs remain required; initial tuning is documented in VENT_TUNING.md.

## First-upgrade economy pass

67 gameplay/input checks pass (reports/economy-state.json), including 11 economy regressions: first-loss affordability before building unlocks, shortfall-only funding, no bonus for sufficient earnings, no duplicate grants across settlement/reload, both ordinary-tier starter purchases, invalid/unaffordable requests, old upgraded/unupgraded saves, deferral/reopening and source-specific enemy rewards. Browser checks at 320px verified the loss earnings/bonus lines, heart and dash purchases, deferral, and reopening. Existing Makko UI icons are reused. Script URLs are release-versioned after a browser check exposed a mix of cached and updated modules. The 45-file ZIP is byte-checked against source. Human pacing and physical-phone playtesting remain open.

## Uncapped ember rewards

70 gameplay/input checks pass (reports/uncapped-embers-state.json). Three added scenarios exercise all four ordinary reward paths below/across/above the old 160 boundary; vent-source exclusion; earned 240-ember loss rendering, exactly-once banking and upgraded-save reload; and uncapped district-clear bounty. Existing tests cover starter purchases and grants, progression, old saves and vent behavior. Source/package bytes are checked. No rendering/layout/art change is included. Full human pacing verification remains open; 2–3 ordinary runs and about twice-as-fast skilled progression are targets, not measured outcomes.

## Reward and retry loop — 2026-09-14-loop-1

Tony approved applying the saved research: frequent satisfying rescue rewards, quick retries and visible progress toward a useful upgrade. Measure run duration instead of imposing the earlier proposed 2–3-minute timer. This release adds grouped rescue ember feedback, a live run wallet and next-goal counter, and results with separate earned/first-upgrade-bonus amounts, upgrade progress and explicit retry/town actions. The town goal considers every reachable unfinished upgrade across both shops and opens the cheapest track's shop. Starter offers and building unlock goals remain supported; no automatic purchase is made.

Run Again restarts the current district after a loss; Next District advances one after a clear, capped at district 5. Earnings settle once before either choice. Building unlocks are processed even on quick retry. Fresh Enter/R/Space retries, T opens town/upgrades; held repeat and movement keys do not skip results. Pointer state is cleared before retry so the release does not consume a dash. Repeated opening cards are skipped on quick retry; the first-run story sequence remains.

Initial playtest prices: first-run choice remains 20; regular hearts and dash capacity cost 100/240/540, recovery and recharge 100/240. Owned tiers and balances persist, and effects are unchanged. A starter purchase occupies tier 1, so its next same-track tier costs 240; other first-tier tracks cost 100 when unlocked. These prices target useful early purchases every 2–3 ordinary runs and about twice-as-fast skilled progression. They are not measured balance results.

The reward audit uses explicitly assumed event profiles through actual game functions: ordinary 7–9 rescues at alternating heat 1/2 plus a walking imp and rekindle yields 44/50/55; skilled 9–11 rescues at heat 3/4 plus a dashing imp, rekindle and two eligible demon kills yields 88/97/105. The midpoint ratio is 1.94. At 100 embers, the ordinary profiles afford a purchase after 2–3 runs. These are constructed profiles, not human playtests or evidence of achievable behavior. Later 240/540 tiers need separate evaluation as players reach later districts. No duration is assumed, no flat skill multiplier is added, and spawning/reward rates remain unchanged.

The save now retains the newest 20 completed runs locally: seconds, district, rescues, earned embers, starter bonus and win/loss. Recorded once at settlement; no network telemetry. `earned` includes a clear bounty, excludes the starter bonus. Old saves lacking this array remain compatible. This bounded history is for tuning, not lifetime collected-ember/Invoice accounting. Existing lifetime records are preserved; historical missing rewards are not reconstructed.

Validation: 81 gameplay/input checks pass in reports/reward-loop-state.json. Added coverage includes cheapest reachable goals, progress before/after banking, exactly-once retries and unlocks, next-district bounds, repeated keys, pointer cleanup, town/shop navigation, bounded history/reload, grouped feedback/reset, result text and assumed reward profiles. Local browser checks at 320px cover HUD with heat/rescue/vent controls, grouped payout, first-loss bonus, starter navigation, affordable Forge navigation, and town goal. Desktop clear results and clicking into district 2 were verified. A panel/text color bug found visually was fixed. No console errors were observed. These browser checks use controlled local fixtures; sustained human pacing and physical-device playtesting remain open. All artwork is reused Makko material.

Release verification and final commit/PR are recorded in issue #1. City expansion, favor/release, Invoice accounting, new upgrade effects and art production remain separate work.

## Prose discovery rewrite — 2026-09-15-prose-1

Tony requested a complete prose rewrite following the author-craft research and confirmed that players should feel disoriented, under pressure and gradually discover what happened. The deeper story remains optional.

All fifteen diary entries (78 short pages), their teasers, Keith's opening, greetings, reactions and fourteen later observations were rewritten. Duy's ordinary memories establish warmth and relationships; later entries reveal the market, afterlife, cell, debt and gate through his limited viewpoint. Mei's coercion is explained in her later confession rather than presented as knowledge Duy already possessed in the market. The early wraith entry does not reveal the cell's massacre. Keith's automatic speech gives immediate guidance and fragments rather than reciting the entire backstory. Shrine and diary labels and the public description were adjusted to match. Ratkin judgment still determines release; the final optional entry describes the restoration/favor obligation without adding a finished ending or redemption mechanic.

Chapter IDs, titles, art assignments, unlock predicates, hints and saved read history are unchanged. Gameplay, economy and art are unchanged. INTRO_VERSION is 4 so the revised live opening plays once for returning players; it still allows movement, dash and vent. Existing progression is retained. Older loreIdx progress is preserved; later observations are not forcibly replayed.

Validation: all 81 gameplay/input checks pass in reports/prose-state.json, including intro control and one-time replay/save preservation. A comparison against the prior story verifies identical diary identities/art/unlocks/hints and STORY data structure. Browser measurement with the loaded Pixelify font checks all 78 pages, seven opening lines and fourteen lore lines: maximum diary baseline 728 (navigation begins below 1160), opening baseline 943 (available through 1008), lore width 587.425 within 700. Local 320px visual checks cover a diary page, one of the longest pages and the opening during gameplay; no console errors observed. Voice and reading pace remain subject to Tony's playtest.

Release verification and final commit/PR are recorded in issue #1. No new art, factions, magic explanation, city system or Invoice conversion was invented. The author research informs general craft; the passages are original to Fwoosh.

## Five-bloc favor and release — 2026-09-15-favor-1

The audit now contains 155 passing actual-script checks. Five focused regressions prove that the first hearing captures fresh baselines, all five social systems earn stable vote IDs, four votes release Duy without diary completion, a later Memory vote upgrades an already completed verdict to unanimity without replaying it, and the Shrine names every bloc plus both thresholds. Existing progression, city, input, combat, story, save and settlement checks continue to pass. Eleven static asset checks pass; this release introduces no new art.

Local phone-scale browser fixtures inspected the post-hearing bloc sheet and the four-vote final verdict. The bloc screen exposes each requirement and progress value without hiding the four-of-five rule. The verdict screen keeps Khet-Tak-Tor's current verified Makko portrait, five vote marks, wrapped dialogue and a large Continue/Rise control inside the 720×1280 game viewport. This verifies layout and source behavior, not Tony's physical-phone pacing or the eventual Ratkin portrait replacement.
