# Save-data contract at d7945b4

Browser-local persistence; no cloud save/backend established in inspected code. Origins, profiles and devices have separate progress.

| Key | Contents | Interpretation |
|---|---|---|
| fwoosh.meta | v:1, embers, saved, bestBlaze, district, buildings, hero, diary.read, flags | district is highest unlocked (1–5), not completed count. hero:'stranger' is a placeholder. |
| fwoosh.opp | Territory, latency history, grudge, runs, broken reads, snipes, wins, intro/lore progress | Feud still reads older run/win/read signals. |
| fwoosh.skin | Selected skin | Separate from progression. |

Well: `{built, hearts, regen}`. Forge: `{built, charges, recharge}`. Shrine: `{built:true}`. Diary: `{read:[]}`. `flags.reachedDuel` opens a chapter. Meta loader fills missing defaults; it does not comprehensively validate arbitrary malformed values.

## Persistence timing

Rescues update lifetime saved and pending embers in memory. `foldOpp()` banks pending embers at run end, adds a scaled win bounty when appropriate, and saves. Hub entry, purchases, diary reads and selected milestones also save. Every rescue is not immediately durable across tab closure.

## Requirements for future changes

- Preserve embers, upgrades, diary IDs and opponent history.
- Keep v1 compatibility or test an explicit migration; merely changing the version currently resets progress.
- Add explicit final completion. An old district:5 means unlocked, not proven beaten. Total wins cannot identify completed districts. Do not invent progress.
- Make settlement safe against repeated end events, reset settlement state only for a new run.
- Use stable identities for future per-face/hero features; cell IDs are run-scoped.
- Keep one feud source of truth.
- Test in a separate origin or in-memory fixtures; never reset the player's real saves.
