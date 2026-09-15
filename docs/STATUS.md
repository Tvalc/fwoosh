# Fwoosh status — September 14, 2026

## Verified live baseline

Build 2026-09-14-story-1 deployed at main 0b3c1acc89ed6ceace6235fce14d3f7d40599c05. Reliability/refactor/Makko corrections and the action-first Keith narration are live. The arcade loop, heat/vent/heal, chain rescues, imps/demons/husks/wraiths, Edge, five districts and encounters/replay, allies, rewards, ember banking, Well/Forge, Shrine and fifteen diary chapters exist.

## HUD release candidate

Build 2026-09-14-hud-1 adds an always-visible six-segment heat gauge, numeric heat and BLAZE multiplier, larger RESCUED tally/progress bar, separately labeled Edge and Keith progress. Hearts and score sit above the gauges. Narration and mobile vent remain exposed. All character artwork reuses Makko assets; no media, balance or save fields changed.

All 41 existing gameplay/input checks pass (docs/reports/hud-state.json). Browser fixtures were visually checked at 320px width for zero heat, full heat, Keith encounter and intro dialogue, plus the wider display. Physical-phone and human balance testing remain open. Publication is authorized; verify the Pages deployment and live marker before calling this candidate live. The coordination issue records the final deployment result.

## Next: city rebuilding

Confirmed: freely placed buildings, multiple homes/production buildings and unique landmarks; roads and layout affect output; ratkin physically haul goods with distance and congestion; automatic staffing/priorities with optional player optimization. Ember foundations, offline construction and mandatory ember sealing precede operation. Food/materials/workforce support growth; ember upgrades accelerate progress. Random sealing appearances are cosmetic in Fwoosh. Embers will never be sold.

The city implementation, ratkin favor/judgment, earned resurrection, Invoice conversion/rewards, RPG System Shop and missable Ratkin recruit remain unbuilt. Interview costs, timing, resources, controls, release conditions and cross-game accounting before implementation. See docs/CANON.md and the complete docs/ROADMAP.md.

## Art and coordination

Cursor owns Makko animations/art in its separate checkout. Full run cycles and cinder clipping/scale correction remain open; the non-Makko prototype was removed and original Makko cinder restored. Twelve diary assignments remain; evaluate existing dark_cell artwork for one. Codex continues scoped gameplay/records/release work independently and passes shared canon to the Ledger task explicitly.

Tony authorizes publication after each verified major change. Preserve original checkouts and existing saves. Verified source backup is local; off-device destination remains unresolved. Heroes/mastery, expanded landmarks, feud redesign and daily/share/ads remain proposals needing reconciliation, not automatic launch requirements.

## Latest checkpoint: core-loop polish before city expansion

HUD 2026-09-14-hud-1 deployed and was browser-verified at main 3c2be87. Tony now prioritizes existing gameplay and ember economy over city expansion. Candidate 2026-09-14-vent-1 implements the approved vent unit commitment and persistent cinder-eating demons. See VENT_TUNING.md for behavior and initial numbers. Tests cover old saves, input boundaries, chaining, full/partial hearts, persistence, interruption and blast settlement; phone-size fixtures cover unit progress, warning and blast. Economy rates and prices remain unchanged pending interview. Verify deployment before describing this candidate as live; issue #1 carries final release evidence.
