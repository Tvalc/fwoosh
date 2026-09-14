# FWOOSH — Combat/Vent/Boss Redesign Roadmap ("HOLD, SAVE, VENT, BREAK")

Designed via a 6-agent workflow (per-system + synthesis + senior critique), 2026-09.

## The new tension
Heat is one currency doing several jobs: it **drains health** (danger), pumps the **BLAZE** score/ember multiplier, and — new — is the **reach of each rescue** (absorbing arcs to nearby flaming villagers and saves up to `floor(heat)` more). Your only real heal is to **HOLD VENT**: purge heat → refill hearts half at a time, while **fire demons pour out and hunt you + the town**. How much you save, *weighted by how hot you were*, becomes your **edge vs a leveled Keith**. Core decision each moment: hold to a fatter hot cluster (more saves/blaze/resolve, closer to burnup) or bail to a demon-summoning heal, away from the crowd.

## Phase 1 — DONE (commit 47a35af, live)
Hold-to-heal vent (purge→half-heart heal, rooted, no dash), fire demons (firedemon anim; hunt 60/40, nearest-2 hit, linger 2.5s, dash escapes, swarm-memory anti-tap-cheese), chain-saves (`floor(heat)` extra within `CHAIN_R`), passive regen gutted (`HP_REGEN` 0.22→0.04). Constants: VENT_PURGE .16, VENT_HEAL_T .55, VENT_SUMMON .6, DEMON_INT0 1.4/STEP .15/MIN .5, MAX_DEMONS 6, DEMON_SPD 135, DEMON_TGT_VILL .6, DEMON_HIT .06/CD .8, DEMON_LIFE 2.5, DEMON_R 16, CHAIN_R 120.

## Phase 2 — Save→Keith edge (RESOLVE)
Accumulate `resolve += 1 + RESOLVE_PER_HEAT(0.5)*heatAtSave` in saveCell(). At duel start: Keith head-start `boss.downs = floor(resolve/RESOLVE_PER_DOWN(6))`; spawn `allies = min(6, floor(saved/3))` rescued villagers that each intercept ONE Keith attack; if `saved/spawned >= 0.7`, Keith rises staggered. Dump does `+= (heat>=4?2:1)`. Surface resolve ONCE at the duel as plain text ("KEITH RISES — 3 allies · staggered"), not a mid-run meter. **Do NOT add a finite/only-shrinks pool** (death-spiral); keep Keith seeding fresh villagers — heat-QUALITY is the scarcity axis, not quantity.

## Phase 3 — Leveled Keith + cumulative movesets
Fight state machine (RISE/HUNT/VULNERABLE via `boss.moveCd`/`moveActive`/`moveTele`). `dumpsNeeded = 2 + ceil(level/2)` (2,3,3,4,4 — NOT 2+level). Cumulative roster, **capped concurrency** (one active move, moveCd floor 1.6s, never two AoE back-to-back):
- L1 SHED-PURSUIT (exists) · L2 +EMBER SPIT (3 fireballs at lag) · L3 +WAKE OF FIRE (burning dash line; player can absorb it for +2 heat) · L4 +DEMON CALL (summons firedemons — same as vent monsters) · L5 +SIPHON MELTDOWN (villager shield-ring + ring-pulse with a gap; save the siphoned to strip shield). No screen shake.
Allies each eat one attack. L5 needs a heat source mid-fight (wake absorb / ally self-immolate).

## Phase 3.5 — Keith ignition sources (Tony, "no rush", 2026-09)
Two ways villagers catch fire, alternated to keep it fresh: (a) **Keith runs out and torches** villagers on contact; (b) **Keith summons a fire monster and sends it** after a villager. Let the player **INTERCEPT the summoned flame creature** before it reaches the villager → **more damage to Keith + more heat + more embers**. (Reuses the demon system; the interceptable monster is a Keith-sent variant.)

## Phase 4 — Districts + meta
`META.level`/`cleared`; 5 themed districts (Market→Rowhouses→Mill→Chapel→Keith's House) as difficulty scalars first, theme later; `winDuel()` → `WIN_EMBERS*level`, unlock next, feud bump, building-tier gates; replayable cleared districts. Build ONE arena first; don't theme speculatively.

## Phase 5 — Juice/art
Demon summon/collapse anims, ally-intercept VFX, heart-refill ding/flash, telegraph reads, half-heart sprite/clip, district palettes.

## Critic's load-bearing rules (respected)
Vent-heal must beat passive regen (done: regen gutted). Rooted player vs full swarm must lose but 1-2 must be survivable (nearest-2 hit + DEMON_HIT .06). No only-shrinks pool. Cumulative Keith needs capped concurrency. dumpsNeeded ≤ ~4 to keep runs 1-3 min. Cool Blood (Well regen upgrade) now weak vs a trickle — repurpose it to boost VENT_HEAL later.
