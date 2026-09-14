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
