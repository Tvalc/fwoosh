# State audit — 2026-09-14

Inspected main `d7945b4` and Cursor's local modular snapshot captured at 18:06 UTC. The runner uses actual scripts with in-memory localStorage, an inert external SDK and a stubbed canvas. It captures Shrine text, not pixels.

| Finding | Reproduction | Tracker |
|---|---|---|
| Final completion stays 4/5 | Win district 5, reload and render Shrine: 4/5. Highest unlocked district is used as completed count. | [#4](https://github.com/Tvalc/fwoosh/issues/4) |
| First visit raises only one eligible building | Fresh save, 16 lifetime rescues, enter hub: Well true, Forge false. Short-circuit skips Forge until another visit. | [#5](https://github.com/Tvalc/fwoosh/issues/5) |
| Duplicate calls settle twice | Call pop twice with 20 pending embers: 40 banked. Ordinary-play trigger not established; constructed lethal-demon/heat check settles once. | [#6](https://github.com/Tvalc/fwoosh/issues/6) |

Runtime fixes follow Cursor's refactor handoff. This branch changes records/tooling, not game behavior.

## Coverage

19 checks: 16 pass, 3 fail on the captured modular build. Known failures remain visible and produce a nonzero exit. Coverage includes startup, five quotas/rosters, district 1–4 unlocks/rewards, replays, building milestones, upgrade prices/caps/reload, unaffordable purchases, Forge effects, banking, diary reading without rewards, invalid JSON, partial v1 saves, Edge bounds, vent/dash escape, boss handlers and lethal-demon settlement.

The committed baseline has the same 16 passes and 3 failures. [Baseline report](reports/baseline-state.json), [modular report](reports/modular-state.json) and [asset report](reports/modular-assets.json) record the evidence. All 43 referenced local resources exist, and all nine animation PNG sheets match their declared dimensions (11 static checks pass). These checks do not establish fun, difficulty balance, full boss playability, rendering quality or browser event delivery.

## Browser smoke observation

The isolated modular snapshot loaded its title and artwork in the in-app browser. Clicking started a run; it reached a loss summary, then tapping returned to a rendered Ashford hub. This is a startup/run-end/hub smoke check, not completion of five districts or a mobile-device/animation approval.

## Reproduce and continue

`node tools/audit-game.cjs <game-folder> <report.json>`

`python tools/audit-assets.py <modular-game-folder> <report.json>`

Use a committed tree or captured copy, not a changing folder as a test baseline. After integration, re-run checks, verify save migrations and unlock toasts, play all districts on desktop/touch, inspect cinder transitions, check media/console failures, and validate the real packaged ZIP and hosting output.
