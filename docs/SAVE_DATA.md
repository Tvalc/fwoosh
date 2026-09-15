# Save-data contract — progression-fixes branch

Browser-local persistence; no cloud save/backend established in inspected code. Origins, profiles and devices have separate progress.

| Key | Contents | Interpretation |
|---|---|---|
| fwoosh.meta | v:1, embers, saved, bestBlaze, district, clearedDistricts, buildings, hero, diary.read, flags | district is highest unlocked (1–5), not completed count. clearedDistricts records completion (0–5). hero:'stranger' is a placeholder. |
| fwoosh.opp | Territory, latency history, grudge, runs, broken reads, snipes, wins, intro/lore progress | Feud still reads older run/win/read signals. |
| fwoosh.skin | Selected skin | Separate from progression. |

Well: `{built, hearts, regen}`. Forge: `{built, charges, recharge}`. Shrine: `{built:true}`. Diary: `{read:[]}`. `flags.reachedDuel` opens a chapter. Meta loader fills missing defaults; it does not comprehensively validate arbitrary malformed values.

## Persistence timing

Rescues update lifetime saved and pending embers in memory. `foldOpp()` banks pending embers at run end, adds a scaled win bounty when appropriate, and saves. Hub entry, purchases, diary reads and selected milestones also save. Every rescue is not immediately durable across tab closure.

## Requirements for future changes

- Preserve embers, upgrades, diary IDs and opponent history.
- Keep v1 compatibility or test an explicit migration; merely changing the version currently resets progress.
- v1 migration seeds clearedDistricts from district minus one and preserves an existing larger completed count, clamped to 0–5. An old district:5 proves four completions; wins do not prove a fifth. Currency, upgrades and diary reads are preserved. Winning district 5 explicitly saves completion 5.
- A runSettled latch makes run banking and opponent statistics idempotent. Terminal handlers reject repeated/late events; reset clears the latch for a new run. This is defensive reliability, not a claim of a reproduced ordinary-play exploit.
- Use stable identities for future per-face/hero features; cell IDs are run-scoped.
- Keep one feud source of truth.
- Test in a separate origin or in-memory fixtures; never reset the player's real saves.

The simulation stops the frame after terminal boss outcomes so a later rescue cannot change run totals after settlement. Regression checks compare the displayed run tally with banked embers and reloaded rescue counts.

## Intro revision 3

The revised live-action intro uses existing `fwoosh.opp.introVer`. Title loading does not mark it seen; starting a run does. Older players see revision 3 once. This preserves ember balances, district completion, upgrades and diary read state. No city/Invoice save fields are added by this story release.

## First-upgrade offer

Build 2026-09-14-economy-1 retains v1 and normalizes missing/null flags. Existing flags gain starterChecked (one settlement eligibility check), starterReady (offer issued), starterBonus (one-time amount granted), and starterChosen (hearts or charges when bought). Unupgraded saves get one catch-up offer on their next completed run; already-upgraded saves receive no grant. Earned embers bank before the wallet top-up; the wallet and grant marker save together. Purchases consume normal tier 1, so later shop tiers and old upgrades retain their meaning. See ECONOMY_TUNING.md. Lifetime collection/Invoice accounting remains undefined and unimplemented.

## Uncapped earnings

2026-09-14-economy-2 removes reward truncation at 160, with no new save fields or schema changes. The existing run-settlement guard banks all earned rewards once; win bounties still add normally and starter funding remains separate. Existing balances and upgrade tiers are retained. Historical foregone rewards are not recoverable from the stored save and are not estimated.

## Recent run history — loop-1

v1 `fwoosh.meta.recentRuns` retains at most 20 completed attempts. Each record contains seconds (one decimal), district, rescued, earned (including win bounty), starterBonus (separate) and won. Missing/non-array values normalize to an empty array; extra old entries are trimmed. The existing settlement guard prevents duplicates. It is local only, is not a lifetime ledger, and does not change existing balances, tiers or starter flags. Price changes apply to future purchases only; owned effects remain intact.
