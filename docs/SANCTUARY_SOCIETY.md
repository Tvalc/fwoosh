# Sanctuary society — approved direction, September 16, 2026

Tony chose village life as the next development priority. The reward is watching the same rescued Ratkin build a lasting society. These are approved decisions, not a claim that the whole simulation has shipped.

## Locked direction

- Rescue ascension leads to sanctuary. Keep each newly rescued civilian's appearance and persistent identity.
- Residents without permanent homes share a welcoming communal refuge and help rebuild. Freedom from centuries of burning and abuse is already worth celebrating. The refuge must not feel like a miserable temporary camp.
- Visible construction, moving in and daily life come first. Household moments and environmental transformation follow. Plenty of Makko art credits are available: support varied celebrations rather than rationing them to one generic event.
- Celebrations happen automatically without stopping the player. Tapping one opens a zoomed-in vignette, following the approach being developed in Vovinam Ledger. Mostly visual performances, occasional short dialogue, richer scenes for major milestones.
- Singles, friends, couples and families all belong. Not everyone wants a partner or children. Apartments and personal homes are equally valid long-term choices with different strengths and resident preferences, not a universal upgrade ladder.
- Residents choose relationships and life changes themselves. The player provides opportunities. Automate by default; allow optional optimization.
- Every household keeps a persistent chronicle of development and milestones. Household outcomes feed society's happiness, production and larger development.
- The Ratkin are rewarded for centuries of injustice with eternal life in sanctuary, but must build a fulfilling society. Residents may choose to have children; children grow to adulthood and then stop aging.
- Sanctuary protects residents from death. Residents may voluntarily leave and become mortal while away; returning restores sanctuary's protection. This is why there are no immortal armies roaming outside.
- Departures are lore/chronicle material in the first release, not an expedition or death simulation. Generational growth is also later work. Do not generalize this protection to every dead guest in Ledger.

## Authored resident chronicles — approved September 17

Every Ratkin receives an individually authored name, background and personal lore as part of their chronicle. Build a substantial, expandable backlog of authored people; do not substitute procedural or recombined biographies for later arrivals.

Blackroot wiped out Hollowbeech, the latest village of a displaced Ratkin people, and captured its last nineteen survivors, including two children. Duy and Cuong subsequently killed those nineteen captives. These are distinct events; nineteen is neither Hollowbeech's original population nor a sanctuary population cap. Hollowbeech held roughly 150 to 200 people. The wider society's raid dead and earlier ancestors are also sanctuary residents, with other worlds following later. Shared memories and relationships make this the first society rebuilt in sanctuary. The goal extends beyond restoring what was lost: help the society grow, expand and build a better future.

They are displaced villagers, driven from settlement to settlement after the fall of a kingdom whose name is lost. Hollowbeech is the last village they built. Their carried fire, village rebuilding, and Road Song are survival practices. They are settled by longing and by right in sanctuary. Their three-beat naming system is approved, and the Road Song restores the lost kingdom's name when an ancestor who lived there arrives. Individual biographies remain authored content, with arrivals ordered by cohort: captives, raid dead, ancestors, then other worlds.

These are approved content directions, not shipped resident biographies. Current records preserve appearance and arrival/housing milestones. Authored identity assignment, the initial cast, disclosure pacing and behavior when the authored backlog is exhausted still need design before implementation.

The attackers are the Blackroot Company: hobgoblin-led slavers with goblin trackers, who followed the displaced people's moves from village to village and found Hollowbeech. They attacked the resisting villagers and carried off the final nineteen survivors. See CANON.md for the locked details. Citizen histories should distinguish this attack from the later cell killings and include lives, relationships and hopes beyond either tragedy. Blackroot is a faction, not a declaration that goblins or hobgoblins are inherently cruel.

The people are stateless after the fall of their kingdom and have been driven from village to village, rebuilding each time. Their carried fire and Road Song belong in the society's authored culture. The fire itself has burned for centuries; the covenant repurposed that old fire as Duy's final test, and Khet-Tak-Tor carries the dead out one at a time. The cell door's opener remains unknown and belongs to Ledger's future mystery.

## First implemented slice

New rescues retain one resident record and the exact Makko civilian appearance, including husk rekindles. Personal and apartment households are initially single-adult households; children remain under communal care. This does not claim that relationships, chosen families, births or aging are implemented.

Sealed connected Burrows hold one household. Apartments hold three. Residents choose available preferred housing automatically, otherwise another available home. Existing occupants are not evicted; a resident may move to a vacant preferred home. Moving a building keeps household identity and chronicle intact. No forced romance or parentage is invented.

Initial tuning: refuge happiness 80; settled housing 85; preferred housing 95. Housed adults can take automatic station jobs. Housing improves work rate by 10%, or 20% for a preferred home. Empty buildings and children do not create workers. Apartments cost 100 embers to found, 180 seconds to construct, 50 to seal, and five materials for subsequent copies. Burrow prices remain 40 + 20 embers and two materials for subsequent copies. Density favors apartments; personal preference can favor either. These are playtest values, not canon.

The existing road-distance, shared-route congestion, food, storage and priority systems still apply. The same registered resident appears at their assigned station and on its carrier route. Jobs may change when priorities or resource availability change; full home-to-work commute routines are later work.

The Sanctuary screen gathers existing verified Makko performances, lists residents and opens each household chronicle. A first presentation slice now records every arrival as a durable welcome gathering and lets the player tap through to a zoomed sanctuary vignette. It deliberately uses the existing idle performance as a temporary presentation layer and says so in the vignette; it does not represent that clip as a bespoke celebration animation. Dedicated Makko celebration art, citizen names/lore assignment and richer milestone triggers remain pending. Construction still uses the existing timers and UI panels pending dedicated Makko art.

Resident records now reserve a stable `profileId` for Claude's authored citizen registry. Existing and newly rescued residents keep an empty slot until an approved narrative handoff assigns a profile; the runtime must never synthesize a biography to fill it. Welcome records persist separately from household milestones so later celebration art and authored chronicle text can attach to the same event.

The authored content contract lives in `js/society-content.js`. Claude supplies stable profile IDs in `SOCIETY_PROFILES` and their order in `SOCIETY_PROFILE_ORDER`; the runtime backfills only those published profiles into empty slots, preserving assigned IDs through reloads. Profiles may provide a name, pronunciation, life stage, former role, voice, chronicle introduction, background, desire and keyed milestone text. `societyRecordMilestone` records a milestone only when its authored profile text exists, so missing narrative cannot become procedural biography.

Tony subsequently authorized wiping all old progress once in `2026-09-17-reset-1`. Current saves start with a complete resident record from the first rescue. The historical rescue-count reserve and unidentified-resident migration have been removed; do not restore them.

## Next slices

1. Makko refuge gathering, welcome/move-in/shared-meal celebrations; explicit tap-to-zoom celebration scenes with durable milestone triggers.
2. Construction states and actual work/cargo performances, followed by visible home/work/leisure routines.
3. Autonomous shared households, friendships, partnerships and chosen families, with preferences and chronicles carrying through changes.
4. Voluntary children, maturation and society-wide celebrations; broader household milestone effects.
5. Later scope for voluntary journeys and return. No offscreen permanent losses in the initial sanctuary release.


## Shared-world clarification — September 17

Tony clarified through the Ledger task: Ledger's Ratkin village is a related material-world settlement for living Ratkin. Fwoosh's sanctuary is the new afterlife awarded to the entire Ratkin race across the multiverse, preserving individual identity. When created, the System announced it to Ratkin societies everywhere, using pictograms where necessary and words where societies could receive them. Deaths remain permanent events in Ledger's mortal world; sanctuary continuation does not reverse a death or battle result or create a general resurrection rule for other guests. Keep the settlements' populations, geography and economies distinct. This is canon documentation, not a new cross-game runtime.
