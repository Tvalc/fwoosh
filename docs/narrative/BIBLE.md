# Fwoosh narrative bible (Claude lane)

Living document. Base: `main` @ 8f23fdc (PR #75). Status labels used everywhere in this lane:

- **CANON** — recorded in docs/CANON.md / SANCTUARY_SOCIETY.md or stated by Tony.
- **PROPOSAL (NP-n)** — new, unapproved. Safe to ignore until Tony approves.
- **APPROVED (AD-n)** — Tony explicitly approved in the narrative conversation; listed in NARRATIVE_HANDOFF.md with what it supersedes.
- **DRAFT** — prose. Never canon by itself.

## 1. Contradictions and gaps found on first read (batch 01)

| # | Issue | Where | Effect on writing |
|---|---|---|---|
| X-01 | **vovinam-ledger could not be read.** `git clone` asks for credentials; the repo is private or unavailable to this environment. `00b_locked_decisions.md`, `03_story.md`, `21_canon_systems.md` were NOT inspected. | — | No cross-game check performed. All Ledger facts here come second-hand from Fwoosh CANON.md. |
| X-02 | **Who is burning?** Only nineteen were killed by Duy and Cuong, and the brief forbids adding cell victims or living survivors. But every rescue creates a persistent resident, diary unlocks run to 27/30/34/40 rescues, the Claw asks for twelve more, and rescues are unbounded. CANON never says who residents 20+ are, or what state any Ratkin dead were in before Duy arrived. SANCTUARY_SOCIETY says "centuries of burning and abuse"; CANON says "centuries of injustice". | CANON, SANCTUARY_SOCIETY, story.js unlocks, JUDGMENT_LINES "Nineteen spirits rose" | Blocks every biography's death-to-rescue section, arrival order, and all reunions. **First interview question.** |
| X-03 | **What is the burning town?** Diary and dialogue describe streets, houses, "quarters", "their homes are gone… what made this a town". The tribe is nomadic forest people whose *village* was destroyed. | story.js `fire`, `home`, PRESENT.rebuild, JUDGMENT_LINES | The diary cannot describe the place truthfully until we know whether it is a constructed trial-place, a memory, or a real Ratkin town unrelated to the tribe. Coupled to X-02 and the open "why the fire recurs" question. |
| X-04 | **Jailer vs Warden.** `gate` says the party pinned "the Warden… huge, filling the passage". `fire` p1 (Tony-approved text) says Duy stayed "to stop the jailer following them". CANON says Khet-Tak-Tor was Duy's Ratkin jailer and the collapse killed him briefly beside Duy. A Ratkin does not fill a passage. Either the Warden and the jailer are two beings both under the gate, or one chapter is wrong. | story.js `gate`, `fire`; CANON "Duy's debt" | Needs Ledger 03_story.md (X-01). I will not edit the approved `fire` text without Tony's say. |
| X-05 | "Monsters" wording survives in CANON "Duy's debt", SANCTUARY_SOCIETY and the citizen brief beside the Blackroot sections. | docs | Cosmetic; Blackroot governs. Citizens never call them "monsters" generically in my drafts. |
| X-06 | **Children among the dead.** Runtime rescues a `child` appearance, so children burn in the streets. Whether any of the *nineteen* were children is unstated. | media.js RATKIN_VILLAGERS | I propose two (NP-03). It raises the weight of the cell scene considerably; needs Tony's explicit yes. |
| X-07 | Bloc portraits (Weaver/Hearth, Cook/Bowl, Mason/Hand, Lantern/Claw, Elder/Memory) are "visual representatives, not named canon characters". | CURSOR_ART_BRIEF | I give citizens bloc *leanings* only and do not name any citizen as a bloc's face. |
| X-08 | Citizen brief refers to "the existing Fwoosh lore conversation" and "existing prose/research drafts". No such drafts exist on any remote branch, and I have no prior conversation content. | brief | Starting from repo canon only. If earlier drafts exist elsewhere, send them and I will merge rather than replace. |

## 2. Naming (PROPOSAL NP-02)

Anchors from canon: **Khet-Tak-Tor** = "the voice that closes the debt"; **Chit-tat-to**. Ratkin names are therefore short phrases of three hard-edged beats.

Proposal: a name is earned in three beats.
1. **Milk-name** — given by family at birth. Children have one beat (Nim).
2. **Trail-name** — given by the community after a child walks one full seasonal circuit on their own feet. Adolescents have two (Tav-Ri).
3. **Hand-name** — chosen by the person when they take up their life's work.

A beat can be re-given after a life-changing event, which leaves room for "Khet-Tak-Tor" to be the name the Arbiter returned with rather than the one he was born to. Reserved beats I will not reuse with another meaning: khet (voice), tak (close), tor (debt), chit, tat, to.

Payoff this buys: a child who died with one beat can earn the others in sanctuary. That is a celebration the simulation can actually cause.

## 3. The tribe (DRAFT, names open)

- Community name: **open** (CANON). Working label in these files: "the tribe". Candidates will be offered in a later interview.
- NP-04 **The Circuit Song**: the seasonal route is held as a walking song, one verse per stage (landmark, water, hazard). Goblin trackers "following seasonal routes" (CANON) means the song's secrecy protected nothing.
- NP-05 **The one fire**: the camp fire is never relit; a live coal is carried camp to camp in a clay pot. It went out in the raid. I do *not* tie this to the recurring street fire; that question is open in CANON.
- NP-06 **Log-seeding**: nomadic farming. Fallen logs along the route are plugged with mushroom spawn for next year's passage. Bridges forest culture to the implemented Mushroom Farm without settling settled-vs-mobile.
- NP-07 **The raid happened at the autumn gathering**, when family groups converge (CANON: trackers "locate family gathering places"). Tribe size at that gathering: open; I write around it.

## 4. Chronology (relative; no durations invented)

| Order | Event | Status |
|---|---|---|
| T0 | Generations of seasonal circuits. | CANON (nomadic) + DRAFT detail |
| T1 | Blackroot trackers learn the routes. Orr-Ve-Kan fears he was followed from the edge-markets; never confirmed. | DRAFT, flagged (touches open Blackroot/trading-post link) |
| T2 | Autumn gathering. Blackroot surrounds it. The tribe resists. Village destroyed; the one fire goes out; nineteen taken. | CANON core + DRAFT detail |
| T3 | Captivity and transport. Duration unstated. | open |
| T4 | Dark cell. A door stands open. Tav-Ri sees it and screams to run. Duy and Cuong arrive in the path and fire. Nineteen die. | CANON core; the scream and who opened the door are DRAFT/open |
| T5 | System records the debt (19 Cuong / 5 Duy per current Ledger text). | CANON conflict preserved |
| T6 | Gate. Duy dies; Khet-Tak-Tor dies briefly; covenant of the Ratkin god, Adonai and Odin. | CANON |
| T7 | Sanctuary created and announced to Ratkin everywhere. | CANON |
| T8 | Duy wakes in the burning streets. | CANON |
| T9+ | Rescues, refuge, homes, first judgment, favor, verdict. | CANON / implemented |

## 5. Reveal ledger (what Duy and the player know)

| Stage | Knows | Must not yet know |
|---|---|---|
| First run | People are burning; touching them takes the fire and hurts; they rise. | Who they are. |
| `cell` (18) | He and Cuong shot nineteen unarmed people running for a door. Someone screamed first. | Any name. Who opened the door. |
| First named chronicle | One of the people he carries has a name and a trade. | That this person was in the cell (chronicle intro never says it; background does, behind a later unlock — see handoff §3). |
| Post first judgment | Blackroot by name, through citizen chronicles. | Blackroot's link to pit network / keeping place (open). |
| `home` and after | The society is judging what he builds. | Verdict. |
