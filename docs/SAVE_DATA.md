# Save-data contract — current live baseline

Browser-local persistence; no cloud save/backend. Origins, browser profiles and devices have separate progress.

## Authorized one-time cutover

Tony requested a full old-progress wipe on September 17, 2026, to stop carrying historical migration/accounting complexity. Build `2026-09-17-reset-1` runs `save-generation.js` before loading any progression. It removes only retired `fwoosh.meta` and `fwoosh.opp` records and never loads them. New progress uses the stable keys below. **Do not change these keys with normal releases.**

| Key | Contents |
|---|---|
| `fwoosh.save2.meta` | Currency, upgrades, district clears, diary/dialogue, city, society, judgment, recent runs, lifetime ember ledger |
| `fwoosh.save2.opp` | Territory, rescue observations, runs/wins, intro/lore progress |
| `fwoosh.skin` | Display preference, preserved through the cutover |

An old tab may write retired keys again; cleanup can remove them on a later load without affecting new progress. If removal is blocked, the old records remain unread and cannot populate the new generation. Never clear all origin storage: other games share the domain. The one-time reset takes effect separately on each device/origin when it next loads this build. It does not remotely erase unopened browsers.

## Current records

Meta retains outer `v:1`. `district` is highest unlocked (1–5); `clearedDistricts` is explicit completion (0–5). Never infer clears from unlocks or total wins. Well is `{built,hearts,regen}`; Forge is `{built,charges,recharge}`; Shrine is `{built:true}`. Diary read IDs and flags persist. Missing or malformed current fields receive safe defaults; this is defensive loading, not support for pre-cutover saves.

City: `{v:1,lastAt,roads,buildings,materials,food,producedFood,producedMaterials,nextId}`. Buildings have `{id,type,x,y,state,remaining,work,priority}`. Types: `burrow`, `apartment`, `yard`, `farm`, `store`. States: `building`, `ready`, `sealed`. Priority: 0 low, 1 normal, 2 high. `lastAt` uses epoch milliseconds; remaining/work use seconds. Catch-up is capped at eight hours. Roads/buildings normalize to valid cells and stations clear work when blocked. Foundation, sealing, movement and significant timer events save.

Society: `{v:1,nextId,residents:[]}`. Residents have stable `id`, Makko civilian `kind`, `preference`, building `home` (0 is refuge), `arrived`, and persistent `events` (`arrival`, `home`, `refuge`, with timestamp/home/type). Every resident comes from an actual rescue; there is no historical count reserve or unidentified-person migration. New workers cannot produce for time before arrival. Households initially contain one adult; children stay in community care. Preferences are deterministic simulation choices independent of combat RNG. Relationship/family/birth simulation remains pending. Chronicles retain all milestones and page them in the UI.

Judgment: `eligible`, `heard`, `favorBegun`, baselines `baseSaved/baseFood/baseMaterials/baseBurrows/baseDuelWins`, `votes`, `verdictReady/verdictHeard/released/unanimous`. `baseBurrows` counts sealed connected residential buildings of either type despite its historical field name. Votes (`hearth`, `bowl`, `hand`, `claw`, `memory`) remain earned. Four release Duy; five grant unanimity. These records do not prove Ledger redeemed anything.

Lifetime ember ledger: `{v:1,earned,historyComplete}`. Starts at zero/complete. Guarded settlement counts run earnings and win bounty once; starter grants are excluded. Spending never reduces it. Malformed ledger data is flagged incomplete and is not reconstructed from wallet or recent history. See INVOICE_ACCOUNTING.md.

Recent runs retain 20 records: seconds, district, rescued, earned, starterBonus and won. This is not the lifetime ledger. Starter-offer flags are `starterChecked`, `starterReady`, `starterBonus`, `starterChosen`; the grant and wallet save together.

Present dialogue: `{seen:[],history:[{who,text,emotion}]}`. At most 32 seen exchange IDs and 100 recent unique delivered lines. An exchange is seen only when completed; a line archives after typing. Intro revision 5 lives in opponent progress and is marked on starting a run, not title loading.

## Persistence and verification

Rescues change in-memory resident/save counts and pending rewards. Guarded run settlement banks rewards and saves once. Hub entry, purchases, diary reads and milestones also save; closing an unsettled run is not guaranteed to bank it. City elapsed work is settled before a newly rescued worker joins.

Keep the current save namespace and preserve earned progress in future releases unless Tony explicitly requests another reset. Test migrations, reloads and failures using in-memory fixtures or isolated local previews. Never reset unrelated storage or a live player save merely for verification.

The backtick debug reset explicitly confirms deletion of the two current progress keys, preserves skin/unrelated storage, reloads defaults and starts district 1 with opening dialogue. On deletion failure it attempts snapshot restoration and remains paused with an error. Developer console clearing tools also target the current keys.
