# Fwoosh narrative bible (Claude lane)

Living document. Base: `main` @ 8f23fdc (PR #75). Status labels used everywhere in this lane:

- **CANON** — recorded in docs/CANON.md / SANCTUARY_SOCIETY.md or stated by Tony.
- **PROPOSAL (NP-n)** — new, unapproved. Safe to ignore until Tony approves.
- **APPROVED (AD-n)** — Tony explicitly approved in the narrative conversation; listed in NARRATIVE_HANDOFF.md with what it supersedes.
- **DRAFT** — prose. Never canon by itself.

## 0. House style (added batch 09)

Tony's `blood-debt-writing` skill governs prose in this universe and Fwoosh is in it. I found it in batch 09; earlier batches were written without it and have been swept for the hard bans only. Binding on all player-facing text from here on:
- No em or en dashes. No rhetorical questions in narration. No "not X but Y". No dramatic colons. No rule-of-three flourishes. Minimal adjectives.
- Agency stays with people. Every perception has its cause on the page. Dramatize or cut. Confessions are cornered, never volunteered (`dia-home-r2`: Duy corners Khet-Tak-Tor by catching him at it).
- **System text is the Auditor speaking**, dry and procedural, never database output, no exclamation points, one format per chapter. `CONSTITUTION +1` in `dia-home-r1/r2` was wrong and is replaced. This supersedes NP-13.
- Human-POV chapters (Duy's diary) take the Griffin register: procedure explained plainly, understatement. Ratkin material has no assigned register in the skill; the Brooks register (earnest, fellowship, grief underneath) is the nearest fit and is what the chronicles already lean toward. **Proposal NP-14**, needs Tony.
- The skill says "Permadeath is absolute… Gods CAN resurrect at ruinous cost; that cost is plot." Duy's resurrection is that case: the cost is this trial. Consistent with CANON's stated exception.
- The skill holds style only. The story bible (facts) is a file Tony keeps and uploads; I do not have it. Diary chapters `morning` through `gods`, `debt` and `gate` retell bible events and **will not be revised until it is in context**.
- Tension to resolve: the citizen brief asks for qualities Tony admires in Sanderson; the skill sets Griffin/Brooks/Auditor registers. I read these as compatible (Sanderson for structure: clues, costs, payoffs; the skill for sentence-level voice). Flagged, not assumed closed.

## 1. Contradictions and gaps found on first read (batch 01)

| # | Issue | Where | Effect on writing |
|---|---|---|---|
| X-01 (closed batch 10) | **vovinam-ledger could not be read.** `git clone` asks for credentials; the repo is private or unavailable to this environment. `00b_locked_decisions.md`, `03_story.md`, `21_canon_systems.md` were NOT inspected. | — | No cross-game check performed. All Ledger facts here come second-hand from Fwoosh CANON.md. |
| X-02 | **Who is burning?** Only nineteen were killed by Duy and Cuong, and the brief forbids adding cell victims or living survivors. But every rescue creates a persistent resident, diary unlocks run to 27/30/34/40 rescues, the Claw asks for twelve more, and rescues are unbounded. CANON never says who residents 20+ are, or what state any Ratkin dead were in before Duy arrived. SANCTUARY_SOCIETY says "centuries of burning and abuse"; CANON says "centuries of injustice". | CANON, SANCTUARY_SOCIETY, story.js unlocks, JUDGMENT_LINES "Nineteen spirits rose" | Blocks every biography's death-to-rescue section, arrival order, and all reunions. **First interview question.** |
| X-03 | **What is the burning town?** Diary and dialogue describe streets, houses, "quarters", "their homes are gone… what made this a town". The tribe is nomadic forest people whose *village* was destroyed. | story.js `fire`, `home`, PRESENT.rebuild, JUDGMENT_LINES | The diary cannot describe the place truthfully until we know whether it is a constructed trial-place, a memory, or a real Ratkin town unrelated to the tribe. Coupled to X-02 and the open "why the fire recurs" question. |
| X-04 | **Jailer vs Warden.** `gate` says the party pinned "the Warden… huge, filling the passage". `fire` p1 (Tony-approved text) says Duy stayed "to stop the jailer following them". CANON says Khet-Tak-Tor was Duy's Ratkin jailer and the collapse killed him briefly beside Duy. A Ratkin does not fill a passage. Either the Warden and the jailer are two beings both under the gate, or one chapter is wrong. | story.js `gate`, `fire`; CANON "Duy's debt" | Needs Ledger 03_story.md (X-01). I will not edit the approved `fire` text without Tony's say. |
| X-05 | "Monsters" wording survives in CANON "Duy's debt", SANCTUARY_SOCIETY and the citizen brief beside the Blackroot sections. | docs | Cosmetic; Blackroot governs. Citizens never call them "monsters" generically in my drafts. |
| X-06 | **Children among the dead.** Runtime rescues a `child` appearance, so children burn in the streets. Whether any of the *nineteen* were children is unstated. | media.js RATKIN_VILLAGERS | I propose two (NP-03). It raises the weight of the cell scene considerably; needs Tony's explicit yes. |
| X-07 | Bloc portraits (Weaver/Hearth, Cook/Bowl, Mason/Hand, Lantern/Claw, Elder/Memory) are "visual representatives, not named canon characters". | CURSOR_ART_BRIEF | I give citizens bloc *leanings* only and do not name any citizen as a bloc's face. |
| X-08 | Citizen brief refers to "the existing Fwoosh lore conversation" and "existing prose/research drafts". No such drafts exist on any remote branch, and I have no prior conversation content. | brief | Starting from repo canon only. If earlier drafts exist elsewhere, send them and I will merge rather than replace. |

## 1a. Approved decisions

**AD-01 (Tony, 2026-09-17): Before sanctuary existed, all Ratkin dead everywhere burned. The fire is the old Ratkin afterlife. Duy empties it, this tribe first.**


- Resolves X-02. Every rescue is a real dead Ratkin with a real life. Residents beyond the nineteen are the tribe's other dead: raid victims and earlier generations. Other worlds' dead follow later.
- Confirms SANCTUARY_SOCIETY's "centuries of burning" over CANON's vaguer "centuries of injustice".
- Narrows X-03 but does not close it: the burning streets are the old afterlife, but *why it has the shape of a town* is unstated.
- **New tension X-09:** the Arbiter's live greet line "yes, i keep the fires going" (story.js `greet.obsessed`) now reads as Khet-Tak-Tor maintaining a fire that predates him and torments his own people. CANON lists "why Khet-Tak-Tor maintains or uses the recurring fire" as open. Not settled here. My drafts never state who lit the fire or why it is kept.
- **Consequence for writing (NP-08, proposal):** the dead split into two groups with different standing toward Duy. The nineteen burned briefly and were killed by him. Ancestors and raid victims burned far longer and he never harmed them; to them he is only the stranger who carried them out. This gives the five blocs a real disagreement instead of nineteen versions of one grievance.
- **Consequence (NP-09, proposal):** the dead burned without knowing how long. Nobody in my drafts reports a duration from inside the fire. They learn it on arrival, from who is already there and who is not.

## 1b. Approved decisions AD-02 … AD-14 (Tony, 2026-09-17)

**AD-02:** Duy is barred from sanctuary at first and admitted step by step as blocs grant favor.
**AD-03:** Two beings were under the gate: a huge Warden monster (pinned) and Khet-Tak-Tor, the Ratkin jailer, nearby; the collapse killed Khet-Tak-Tor briefly. Resolves X-04. The Tony-approved `fire` p1 phrase "to stop the jailer following them" should read "the Warden"; awaiting Tony's OK on that one-word edit.
**AD-04:** Two of the nineteen were children: Nim (cit-002, ~8) and Kip (cit-012, ~5). Resolves X-06.
**AD-05:** Three-beat naming approved (milk-name, trail-name, hand-name). *Amended in effect by AD-09:* see NP-12.
**AD-06:** The killed-by-Duy / only-rescued-by-Duy split drives bloc disagreement (was NP-08).
**AD-07:** The burning purgatory is the Ratkin's **final test**: lifted into immortality and a world they can grow, in exchange for ages of abuse and persecution, or wiped out. Khet-Tak-Tor keeps the fire going because it is the only way through, and has been carrying his people out himself. His Constitution and HP are too low to both sustain the fire and pull more through; they rise as he burns (LitRPG stats are literal). Duy shares the load: faster, less pain for the Ratkin, better odds they make it. Resolves X-09 and the CANON open item "why Khet-Tak-Tor maintains the recurring fire".
**AD-08:** They are **villagers, not forest nomads**. They have no kingdom of their own; it was destroyed centuries ago in this universe. Resolves X-03 (the fire looks like a town because they are town people).
**AD-09:** Displaced villagers: since the kingdom fell they have been driven from village to village; the one Blackroot destroyed was the latest. Blackroot's trackers followed their moves. Settles the settled-vs-mobile question: settled, by longing and by right.
**AD-10:** The dead have burned for centuries; the covenant turned that old fire into the final test. (Reconciles AD-01 and AD-07.)
**AD-11:** Who opened the cell door is unknown and stays a mystery for Ledger to answer. The scream clue stays; no answer is written anywhere.
**AD-12:** No collective name. They call themselves by whichever village they last built.
**AD-13:** The last village held roughly 150–200 people.
**AD-14:** The lost kingdom's name is lost even to the Ratkin. Recovering it is a payoff.
**AD-15:** story.js `fire` p1: "to stop the jailer following them" → "to stop the Warden following them". Approved edit to approved text.
**AD-16:** Road Song restoration approved (was NP-10): older ancestors correct older verses; the kingdom's name returns when someone arrives who lived there.
**AD-17:** The last village is **Hollowbeech** (was NP-11). The nineteen and their neighbours are Hollowbeech folk.
**AD-18:** Khet-Tak-Tor must *describe* AD-07 himself; Duy cannot infer it from scars. Scars stay as a supporting clue (the art change to an approved design still needs Tony's explicit OK).
**AD-19:** Each bloc's favor opens its own door to Duy: Hearth a home's threshold, Bowl a seat at the table, Hand the work-yards, Claw walking unescorted, Memory hearing the Road Song. Details AD-02.
**AD-20:** The Claw's favor requires Ase-Ro-Wen (cit-020); the bloc does not move until she does. Her yes is a count met, not forgiveness.
**AD-21:** The kingdom's fall is never dated: "longer than anyone has counted". No text gives a number of years.
**AD-22:** Trail-names are earned by a real journey on one's own feet. Some marked an expulsion; others were chosen journeys (approved NP-12 with Tony's amendment: not all sad). DRAFT examples: the salt walk, the climb to the old graves.
**AD-23:** While Duy is barred, residents of any age may come to the gate to look at or speak to him.
**AD-24:** Khet-Tak-Tor's Makko design gains burn-scarred, furless forearms as a visible clue.
**AD-25:** Same people. Blackroot destroyed Hollowbeech; some villagers escaped and built again. Ledger's living "Village of Nineteen Absences" is the village after Hollowbeech. The nineteen are the last of those Blackroot took, not the last of their people. Resolves L-01.

### Canon text these supersede (for Codex to reconcile in CANON.md, SANCTUARY_SOCIETY.md, CLAUDE_CITIZEN_STORY_BRIEF.md, CURSOR_SANCTUARY_KICKOFF.md, ROADMAP.md)
- Every "nomadic forest tribe", "forest society", "forest culture", "woodland community props" → displaced villagers (AD-08/09). PRs #73–#75 wording.
- Blackroot: "goblin trackers follow the Ratkin's seasonal migration routes and locate family gathering places" → trackers followed the people's moves from village to village and found the newest one (AD-09). "Ratkin woodland knowledge" as captive value: keep climbing and narrow spaces; woodland knowledge is no longer their defining trait.
- "permanent-settlement versus mobile-camp decision is still open" → closed: settled (AD-09).
- "Its name… remain open" → AD-12.
- CANON open items closed: reason for the recurring fire (AD-07). Still open: exact limits of the Arbiter's mandate.
- story.js `fire` p1 "the jailer" → "the Warden" (AD-03), pending Tony.
- story.js `greet.obsessed` "yes, i keep the fires going." is now *true and sympathetic*; keep, do not soften.

### New proposals from these decisions
- **NP-10 Road Song restoration:** the oldest verses are garbled; the first, which should hold the kingdom's name, is only a sound. As ever-older ancestors arrive, each corrects the verse from their own lifetime. The name is recovered when someone arrives who lived there. This is AD-14's payoff without a new system: it needs only ancestor arrivals in roughly reverse-chronological order.
- **NP-11 Hollowbeech:** draft name of the last village (stood nine years; creek crossing; split beech on the green). Under AD-12 the nineteen are "Hollowbeech folk". In sanctuary they will, for the first time, take a name from a village nobody can take away; the player-built quarter's name becomes their name.
- **NP-12 Trail-name under AD-09:** a trail-name is earned by walking the road between villages on one's own feet. Every trail-name therefore commemorates an expulsion. Children born in a village that lasted (Nim, Kip) have one beat and no way to earn a second unless their home is destroyed. In sanctuary someone must invent the first trail-name for a journey chosen freely.
- **NP-15 The fire did not go out (proposal, touches Ledger):** an escapee scooped a coal from the wrecked oven and carried it to the new village. Dof-Ma-Rek died believing forty-one carriers ended with him. He learns otherwise only when someone from the living village eventually dies and arrives. Needs Tony and a Ledger check.
- **NP-16 Waiting for the living (proposal):** sanctuary residents know some of their people escaped but not who. Later arrivals from the living village are the only news. No mechanic requested.
- **NP-13 Stats on screen:** in diary prose, System text such as `CONSTITUTION +1` may appear over Khet-Tak-Tor and Duy. Prose only; no HUD request.

## 1c. Ledger cross-check (batch 10) · vovinam-ledger @ e61dda2 now readable

Read: docs/00b_locked_decisions.md, 03_story.md, 21_canon_systems.md, FWOOSH_SHARED_DECISIONS.md. X-01 is closed. Findings, none silently resolved:

| # | Ledger says | Fwoosh / this lane says | Status |
|---|---|---|---|
| L-01 | A **living Ratkin village** exists: "the Village of Nineteen Absences" (03_story Ch 4-1), with elders, Kesh-ka, deep tunnels; it is defended or relocated in Ch 5 and then chartered as "the first Ratkin place-name" (Chit-tat-to VI). | Fwoosh CANON (#75): Blackroot "destroyed" the village and the nineteen were its "last survivors". AD-13/AD-17 and my drafts: Hollowbeech, 150–200 people, everyone else killed; large raid-dead backlog; Nim's parents dead. | **Resolved by AD-25.** Reconciliation adopted: Hollowbeech *was* destroyed; some villagers escaped and, being who they are (AD-09), built again. The Village of Nineteen Absences is the village after Hollowbeech. "Last nineteen survivors" becomes "the last nineteen of those Blackroot took". |
| L-02 | **Chit-tat-to (15, Ratkin) was in the cell room and ran** (novel Ch 14, per 03_story §reconciliation); he "watched them". He escapes on his own. | No draft mentions him. Twenty Ratkin were in that cell, not nineteen; one lived. Every one of the nineteen knew him. | Gap in my drafts, not a contradiction. Needs the bible before I write him into any profile. Does not answer AD-11 (the door). |
| L-03 | Names: **Chit-tat-to** is 15 with three beats. **Kesh-ka**, an elder carried to the deep tunnels, has two. | AD-05: children one beat, adolescents two, adults three. | **Contradiction with an approved decision.** Options to put to Tony: beats track journeys and work, not age (Chit-tat-to chose his work young; Kesh-ka is a use-name). |
| L-04 | "The ledger lists each Ratkin by name and pictogram… (canon)". | I invented nineteen names. | The novel bible may already name some of the nineteen. **Collision risk.** Needs the bible. |
| L-05 | Keeping-place secrets: "the comb, the red cord". | Unused. | Opportunity: either may belong to one of the nineteen (a weaver's cord is an obvious candidate). Not written; needs the bible. |
| L-06 | Warden is a boss who lifts the portcullis; an older outline had "a jailer dragging Chit-tat-to in". | AD-03: Warden and jailer are two beings. | Consistent. |
| L-07 | Game-only save path lets Duy survive the gate. | Fwoosh follows the canon path (Duy dies). | Consistent; FWOOSH_SHARED_DECISIONS already says placement is pending. |
| L-08 | At the living village Duy "digs, hauls stone, and carries Kesh-ka… 'What would Duy carry?' becomes literal." | Fwoosh's core verb is carrying the burning. | Consistent and useful: the same motif, worth echoing deliberately. |
| L-09 | VN narration "follows the novel's hard bans: no em dashes…". | BIBLE §0. | Confirms the skill applies to game text. |

## 2. Naming (APPROVED AD-05; see NP-12 for the AD-09 adjustment)

Anchors from canon: **Khet-Tak-Tor** = "the voice that closes the debt"; **Chit-tat-to**. Ratkin names are therefore short phrases of three hard-edged beats.

Approved (AD-05): a name is earned in three beats.
1. **Milk-name** — given by family at birth. Children have one beat (Nim).
2. **Trail-name** — given by the community after a child walks the road between villages on their own feet (adjusted for AD-09; see NP-12). Adolescents have two (Tav-Ri).
3. **Hand-name** — chosen by the person when they take up their life's work.

A beat can be re-given after a life-changing event, which leaves room for "Khet-Tak-Tor" to be the name the Arbiter returned with rather than the one he was born to. Reserved beats I will not reuse with another meaning: khet (voice), tak (close), tor (debt), chit, tat, to.

Payoff this buys: a child who died with one beat can earn the others in sanctuary. That is a celebration the simulation can actually cause.

## 3. The people of Hollowbeech (DRAFT detail on AD-08/09/12/13 canon)

- No collective name (AD-12). They are the folk of their last village: Hollowbeech (NP-11).
- NP-04 (revised) **The Road Song**: one verse per village built and lost, and the road between. Sung backwards it is the way home to the lost kingdom. See NP-10.
- NP-05 **The one fire**: the common-oven fire is never relit; when a village is lost a live coal is carried to the next in a clay pot. It went out in the raid. I do *not* tie this to the recurring street fire; that question is open in CANON.
- NP-06 (revised) **Log-seeding**: hidden farming for a people who expect raids; logs are also seeded along the road behind each move, for whoever is driven down it next. Matches the implemented Mushroom Farm.
- NP-07 (revised) The raid came at night with everyone in from the fields. Population 150–200 (AD-13). Per AD-25 the village split three ways: killed in the raid, taken by Blackroot (of whom the nineteen were the last alive), and escaped to build the Village of Nineteen Absences. Proportions are unstated; the raid-dead backlog is smaller than batch 03 assumed and should be sized once Ledger fixes the living village's population.

## 4. Chronology (relative; no durations invented)

| Order | Event | Status |
|---|---|---|
| T-1 | Ratkin dead of every world burn. No sanctuary exists. | **AD-01** |
| T-2 | The Ratkin kingdom is destroyed. Its name is eventually lost. | AD-08, AD-14 |
| T0 | Centuries of villages built and lost. Their dead join the fire as they die. | CANON + AD-01 + DRAFT detail |
| T1 | Blackroot trackers learn the routes. Orr-Ve-Kan fears he was followed from the edge-markets; never confirmed. | DRAFT, flagged (touches open Blackroot/trading-post link) |
| T1a | Hollowbeech founded; stands nine years. | NP-11 |
| T2 | Blackroot surrounds Hollowbeech. The tribe resists. Village destroyed; the one fire goes out; nineteen taken. | CANON core + DRAFT detail |
| T3 | Captivity and transport. Duration unstated. | open |
| T3a | Raid dead (incl. cit-020, cit-021) enter the fire. | AD-01 |
| T4 | Dark cell. A door stands open. Tav-Ri sees it and screams to run. Duy and Cuong arrive in the path and fire. Nineteen die. | CANON core; the scream and who opened the door are DRAFT/open |
| T5 | System records the debt (19 Cuong / 5 Duy per current Ledger text). | CANON conflict preserved |
| T6 | Gate. Duy dies; Khet-Tak-Tor dies briefly; covenant of the Ratkin god, Adonai and Odin. | CANON |
| T6a | The covenant turns the old fire into the final test. Khet-Tak-Tor begins carrying his people out alone; too weak to do it fast. | AD-07, AD-10 |
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
| `keith` (34) | Clue: the Arbiter flinches; his forearms are scarred like Duy's. | Why. |
| `home` (final chapter) | **AD-07 payoff:** the Arbiter carries the burning too, one at a time, and is getting stronger the slow way. The fire is the road out. | Verdict; the kingdom's name; who opened the door. |
