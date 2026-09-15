# Fwoosh status — September 14, 2026

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
