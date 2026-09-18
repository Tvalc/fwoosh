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
- Human-POV chapters (Duy's diary) take the Griffin register: procedure explained plainly, understatement. Ratkin material has no assigned register in the skill; **AD-28 approves the Brooks register for all Ratkin material.** Honest note: many batch 01–08 lines are wry in a way Brooks is not ("He has already decided you're too thin"). Warm humour between characters is fine; a narrator winking at the reader is the banned form. A register audit of all 22 profiles and 5 scenes is the next writing task.
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
**AD-26:** Name beats track journeys and chosen work, not age. Chit-tat-to earned all three young. "Kesh-ka" is a short use-name for a longer name. Amends AD-05; resolves L-03.
**AD-27:** Hollowbeech's carried fire survived: an escapee saved a coal and it burns in the living village. Dof-Ma-Rek does not know (was NP-15).
**AD-28:** All Ratkin material in Fwoosh (chronicles, first-meeting lines, admission scenes) takes the Brooks register: earnest, fellowship, landscape as mood, grief underneath; no winking narration. Duy's diary stays Griffin; System text stays the Auditor. (Was NP-14.)
**AD-29:** Sanctuary residents know some of their people escaped Hollowbeech but not who. Later arrivals from the living village are their only news. (Was NP-16.)
**AD-30 (Tony, after reading the novel cross-check): the manuscript governs wherever it collides with Fwoosh canon or earlier approvals.** Kept untouched: AD-01, 02, 03, 04, 06, 07, 10, 11, 12, 14, 15, 16, 18–24, 28. Changed by AD-30:
- AD-08/AD-09 stand in spirit (a kingdomless people who survive by moving: Ch14 "In her mother's time they had moved twice… You survive by being where the boots are not") but the village is **underground and intact**: root tunnels, black spring, low fire, history wall.
- AD-13 → **81 people before, 62 after** (Ch14).
- AD-17 → Hollowbeech is **not** the raid site. It may survive as an earlier lost village named in the songs (proposal NP-17); otherwise it is dropped.
- AD-25, AD-27, AD-29 → **withdrawn.** The village was never destroyed, the fire never went out, and everyone knows exactly who is missing.
- AD-05/AD-26 → **suspended**; the manuscript's Ptik, Rul and Kesh-ka are adults with short names, and Chit-tat-to "had not done a thing". Rework pending (NP-18).
- Fwoosh CANON (#75/#76): "destroyed the village… last nineteen survivors" → Blackroot **took** villagers from a living village and destroyed nothing.
- Fwoosh CANON "unarmed Ratkin captives" → see N-12: the court reclassified **19 of 24** as non-combatants.
**AD-31:** The five armed dead were villagers too. Twenty-four villagers died in the cell; the village went from 81 to **57**. Resolves N-12. This is a change **to the manuscript** (Ch14), by Tony's ruling.
**AD-32:** The five who charged are seated: lead spear **cit-015 Ras-Ti-Vok**, whose shriek was the order to run for the open door; second spear **cit-009 Bru-Ka-Dol**; knives **cit-004 Tav-Ri**, **cit-014 Fen-Ya-Sool** and one reserved (cit-025). They are on Duy's balance. (Was NP-21.)
**AD-33:** Ch14 repair: "nineteen" stays everywhere; 62 becomes 57 in two places; one added sentence gives the other five their marks and says why Chit-tat-to carries nineteen. Exact wording in NOVEL_EDIT_PROPOSALS.md is DRAFT.
**AD-34:** Nim's parents are alive among the 57. Nim is a child waiting, not an orphan. cit-020 Ase-Ro-Wen and cit-021 Dak-Ro-Fen keep their IDs and identities but are **living villagers**, not sanctuary residents; their profiles are shelved until they die.
**AD-35:** Chit-tat-to's mother is a citizen. Her chronicle shows only what she made and taught, never memories of her son.
**AD-36:** Ch14 "the only weapon there was" → "the only weapon left" (NE-01 line 4).

**Broken by AD-34 (needs Tony):** AD-20 made the Claw's favor wait on Ase-Ro-Wen, and `adm-claw` r2 is her scene; `adm-hand` is escorted by Dak-Ro-Fen. Neither is in sanctuary now. AD-20's *principle* (the Claw does not move until the person with the hardest claim does) can stand with a new holder. Proposal NP-22: **cit-004 Tav-Ri**, fifteen, one of the five who went first with a knife so the old and the small could reach the door.
**AD-37:** The Claw's favor now waits on **cit-004 Tav-Ri** (replaces AD-20's holder; the principle stands).
**AD-38:** Re-seating map approved in full: cit-001 the song grandmother; cit-002 and cit-012 the two small ones; cit-010 Chit-tat-to's aunt; cit-017 is Ptik; cit-009 is Rul's brother; cit-016 and cit-011 the other two Elders; **cit-013 Mor-Ne-Dath is Chit-tat-to's mother**, under AD-35.
**AD-39:** In life the Ratkin had few words and many pictures. In sanctuary the words come, as part of being lifted up. Chronicles and scenes are in sanctuary's voice; memories of life stay concrete and pictorial. (Was NP-20.)
**AD-40:** Hollowbeech is an earlier lost village, named in the oldest songs people still understand. It is not the raid site. (Was NP-17; finishes the AD-17 change.)
**AD-41:** Every Ratkin is given a full three-beat name at birth, a small picture-phrase. Everyday speech shortens it (Ptik, Rul, Kesh-ka, Nim, Kip, Tav-Ri). Nothing is earned. **Supersedes AD-05, AD-22 and AD-26** (milk-name, trail-name, hand-name; chosen journeys; beats by work). Khet-Tak-Tor's gloss "the voice that closes the debt" stands as a picture-phrase.
**Interview decisions, 2026-09-18 (full reasoning in STORY_SPINE.md):**
**AD-42:** Duy's promise: to stay until the fire is empty, even if released sooner. "Empty" means this village's dead: the twenty-four and everyone on the four-hundred-year wall. Finite and fully authored.
**AD-43:** The lost kingdom's name is **Atlantis**. The Ratkin were its first people and hold the oldest claim of all. Completes AD-14 and AD-16.
**AD-44:** The Ratkin are **not** the Authors. The Authors and their System came later and were built over them. The Authors' nature stays a late-series mystery.
**AD-45:** The longer someone has burned, the more they cost to carry. The oldest dead are the heaviest.
**AD-46:** One run costs one **game day** among the living (never a real-life day), no exceptions. The Auditor's death notice has shown it from the first run.
**AD-47:** Duy learns the cost midway, from a glimpse of Cuong older and scarred.
**AD-48:** He promises twice: lightly to Nim at the gate before he knows the price; again to Khet-Tak-Tor after he sees Cuong.
**AD-49:** Duy's false belief: a debt can be paid off and closed. The truth: some debts you carry for good, and carrying is the point.
**AD-50:** The heaviest carry, who knows the name, is nobody grand: the first keeper of the first wall.
**AD-51:** Released before the fire is empty, Duy goes back to the living and returns to the fire every night in his sleep until it is empty.
**AD-52:** Reveal by route: reached from inside Ledger, Fwoosh players learn the name early and Ledger reveals it independently later; in standalone Fwoosh it unlocks as part of standalone progression.
**AD-53:** The diary may grow beyond fifteen chapters; Codex adapts. Writing priorities, ranked by Tony: promises kept, rules and costs, plants and payoffs, plain prose, lived-in culture. Touchstone: Mistborn.

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
| L-03 | Names: **Chit-tat-to** is 15 with three beats. **Kesh-ka**, an elder carried to the deep tunnels, has two. | AD-05: children one beat, adolescents two, adults three. | **Resolved by AD-26.** Adopted: beats track journeys and work, not age (Chit-tat-to chose his work young; Kesh-ka is a use-name). |
| L-04 | "The ledger lists each Ratkin by name and pictogram… (canon)". | I invented nineteen names. | The novel bible may already name some of the nineteen. **Collision risk.** Needs the bible. |
| L-05 | Keeping-place secrets: "the comb, the red cord". | Unused. | Opportunity: either may belong to one of the nineteen (a weaver's cord is an obvious candidate). Not written; needs the bible. |
| L-06 | Warden is a boss who lifts the portcullis; an older outline had "a jailer dragging Chit-tat-to in". | AD-03: Warden and jailer are two beings. | Consistent. |
| L-07 | Game-only save path lets Duy survive the gate. | Fwoosh follows the canon path (Duy dies). | Consistent; FWOOSH_SHARED_DECISIONS already says placement is pending. |
| L-08 | At the living village Duy "digs, hauls stone, and carries Kesh-ka… 'What would Duy carry?' becomes literal." | Fwoosh's core verb is carrying the burning. | Consistent and useful: the same motif, worth echoing deliberately. |
| L-09 | VN narration "follows the novel's hard bans: no em dashes…". | BIBLE §0. | Confirms the skill applies to game text. |

## 1d. Novel cross-check (batch 14) · `novel/` at main 5e32257

Read in full: README, Ch04 The Dark Cell, Ch14 Chit-tat-to I, Ch07 The Warden. Searched: story bible (Ratkin, Duy, outline, anchors). Not yet read line by line: the 200 KB complete handoff and chapters 0–3, 5–6, 8–13, 15–16. The README calls this folder the **source of truth**. It collides with Fwoosh canon and with decisions approved today. Nothing below is resolved by me.

| # | Manuscript / story bible | Fwoosh canon and approved decisions | Severity |
|---|---|---|---|
| N-01 | The Ratkin village is **underground and intact**: root tunnels, black spring, moss ceiling, low fire. **81 people before, 62 after.** The nineteen were taken from it; how long before is unstated (Ch06's carved comb implies real time in the cells; the "two days" in Ch14 is the time since the massacre). Its history wall holds **four hundred years** of marks. After the massacre the village chooses to go deeper (Ch14). | Fwoosh #75: Blackroot **destroyed** the village; nineteen were the last survivors. AD-08/09 surface villagers; AD-13 150–200; AD-17 Hollowbeech destroyed; AD-25 "the Village of Nineteen Absences is the village *after* Hollowbeech". | **Direct contradiction.** AD-25 cannot stand as worded: Ch14's village is the one the nineteen were taken from. |
| N-02 | Ratkin are rated **"barely sentient"** by the System, **think in pictures**, read screens as pictograms, sign with their hands. Ch14: "He did not have the words for *on purpose*. He was not sure the village had them." Elders do speak short sentences. Records are a **pictogram history wall**; one grandmother "knew all the songs". | My cast: a four-tongue trader, knot-cord accounts, wry talkers, a Road Song as the people's record. | **Major.** Voices and several trades are too verbally sophisticated for the living Ratkin. Possible bridge (proposal only): being "lifted up" includes words, so sanctuary speech is richer than life was. |
| N-03 | Names: **Chit-tat-to** (15, "had not done a thing"), **Ptik** (adult fisher), **Rul** (30), **Kesh-ka** (old). | AD-05/AD-26: beats earned by journeys and work; Chit-tat-to "earned all three young". | **Contradiction.** Adults have one beat; Chit-tat-to has three having done nothing yet. The three-beat system does not fit the manuscript. |
| N-04 | The nineteen, as written: **four Elders**, one of them **Chit-tat-to's mother**, keeper of the history wall (grinding stone; she taught); his **aunt** (the roof-lashing knot); **Ptik** (fishing); **the old grandmother who knew all the songs, arms out behind her holding two small ones, both killed**; **Rul's brother**; two big spear carriers and three with knives at the front. His uncle pushed him low. | My nineteen are invented from nothing. None is Chit-tat-to's mother, aunt, Ptik or Rul's brother. | **Major, but fixable with identities kept:** cit-001 Sek-Ra-Tun already *is* the song grandmother holding a child; the two small ones match AD-04 (Nim, Kip). Others can be re-seated onto the manuscript's dead. Answers L-04. |
| N-05 | The cell (Ch04): **five humans present** (Diep, Cuong, Duy, Miss Hue, Mei). Four torches. A front rank with **crude iron blades and two levelled spears charges**; most of the others were running away from the ones who charged. Odin had offered the quest "Save the Ratkin"; it expired after 41 seconds. Ch14 adds: **the cage door was open**, light was behind the tall shapes, and Chit-tat-to's mother held "the only weapon there was", a piece of floor. | Fwoosh CANON and diary: **unarmed** captives fleeing toward an open doorway; only Duy and Cuong in the scene. README: "nineteen Ratkin non-combatants". | **Contradiction, and the manuscript disagrees with itself** (Ch04 iron and spears vs Ch14 "only weapon"). My `dia-cell-r1` follows the Fwoosh version and must be redone once Tony rules. The open door (AD-11) is supported by Ch14. |
| N-06 | Ch07: Duy dies under the portcullis with the **warden**. No Ratkin jailer is present. The older outline had a jailer killed in a separate fight. | CANON and AD-03: Khet-Tak-Tor, the Ratkin jailer, was nearby and died briefly in the collapse. | **Game-only addition**, already flagged as such in Ledger's shared decisions. Needs a line on where he stood, since Ch07 shows no one else there. |
| N-07 | Bible §7: Duy is an **orphan**. Ch01 and Ch07: he has been saving eleven months to take **his mother to Da Lat**; his last words are about her. | Diary does not mention his mother at all. | Bible is stale; manuscript governs. **Opportunity:** `misses` should carry Da Lat. |
| N-08 | Bible: "No resurrection. Ever." for Duy. | Fwoosh's whole premise. | Known, approved game-only exception (Ledger shared decisions). Listed for completeness. |
| N-09 | Ch28 outline: the defended village is chartered as "the first Ratkin place-name in Atlantis's ledger". | AD-17 names a Ratkin village Hollowbeech. | Soft conflict: fine if "Hollowbeech" is their own word and never a System name; otherwise drop. |
| N-10 | No Blackroot Company, slavers or fallen Ratkin kingdom appear in the manuscript or bible. The bible leaves room: "the villain space: whoever profits from the discarded staying discarded." | Fwoosh #75 Blackroot; AD-08 fallen kingdom. | Additions, not contradictions, **except** "destroyed the village" (N-01). |
| N-11 | Ch14 rite: each absence is drawn on the wall as **their thing** (a fishing line, a knot, a spiral, a grinding stone). | Unused. | **Gift.** Every citizen should have a wall-mark. It is the natural Makko icon per citizen and the link between the living village and sanctuary. |


### 1d continued (batch 15): Ch05–06 findings
| # | Manuscript | Consequence |
|---|---|---|
| N-12 | Ch05: **"19 of the 24 have been reclassified: non-combatant."** Twenty-four Ratkin died in the cell. Five were the armed front rank; they are the "5" in the 19 + 5 debt. Yet Ch14 counts the village at 81 → 62, a loss of nineteen, and Chit-tat-to carries home the number nineteen. | Either the five armed dead were **not of the village**, or Ch14's arithmetic should be 81 → 57. **Asked.** Under AD-01 all twenty-four burned and all twenty-four are owed a citizen identity. |
| N-13 | Ch06: the keeping place has waist-high cells with shackle points and **feeding locks**; something "kept" them. One of the dead wore **a braided red cord at the throat, "made by somebody for somebody"**. In the third cell, **a carved comb**, made by "a person who had time, in a cell, and wanted to be beautiful." | Two objects waiting for owners. Proposal: cit-010 (the knot-maker) braided the cord; the comb's carver is one of the nineteen still to be re-seated. |
| N-14 | Ch06, Diep: "They were running from something, out of their cells, toward the first open door." Miss Hue: "The first thing through it was gunfire. Say it correctly or don't say it." | Supports AD-11. Also supplies the honest wording for Fwoosh CANON's cell paragraph. |

### Re-seating map (DRAFT, NP-19): my citizens onto the manuscript's dead. IDs and temperaments kept.
| Manuscript figure | Proposed citizen | Fit |
|---|---|---|
| The old grandmother who knew all the songs, arms out behind her holding two small ones | **cit-001 Sek-Ra-Tun** | Near-exact. Road Song becomes "all the songs", now unheld (Kesh-ka's double spiral). One of the four Elders. |
| The two small ones | **cit-002 Nim, cit-012 Kip** | Exact (AD-04). Both were with the grandmother; cit-010's "Kip on her hip" line must change. |
| Chit-tat-to's aunt: the roof-lashing knot that never slipped | **cit-010 Ili-Sa-Ven** | Exact trade. Makes Kip's carer Chit-tat-to's aunt. Wall-mark: the knot. |
| Ptik: three fish on a day nobody else took one | **cit-017 Shi-Pa-Nol**, re-seated from snail-keeper to fisher; "Ptik" is the everyday name | Temperament (patient, never late) carries over whole. Wall-mark: the fishing line. |
| Rul's brother | **cit-009 Bru-Ka-Dol** | Free slot; gives him living kin (Rul, 30). |
| Chit-tat-to's mother: Elder, keeper of the history wall, grinding stone, taught | **cit-013 Mor-Ne-Dath** (miller). The village has one grinding stone, so the miller is the mother. Her existing temperament already fits a teacher: exacting, generous with bread, stingy with praise, "can't leave a thing be once she's seen how it could be better, including people". | **AD-35 governs:** chronicle shows what she made and taught, never her son. Seating still needs approval with the rest of NP-19. |
| Two more Elders (four died) | **cit-016 Ume-Da-Ril, cit-011 Hes-Vo-Lim** | Age and standing fit. |
| Wearer of the red cord | open; cord braided by cit-010 | — |
| Carver of the comb | open; candidates cit-014 Fen-Ya-Sool or cit-019 Eth-Wa-Min | — |
| cit-020, cit-021 (Nim's parents), cit-022 (Hal-Ne-Dur) | No longer raid dead. cit-022 stands as an ancestor. **Nim's parents may be alive among the 62**, which changes her story from orphan to child waiting. | Needs Tony. |
| Living, named in Ch14: **Kesh-ka, Rul** | Not citizens. They are alive. Reserved for the day they die. | — |

**What must be rewritten in every profile:** raid-night material (oven pulled down, hearthstone split, creek crossing, cage break), surface-village details, market trips and trade tongues, and living-world speech. Proposal NP-20: in life they had few words and many pictures; **in sanctuary the words come**, which is part of being lifted up. Chronicles are written in sanctuary's voice; memories of life stay concrete and pictorial.

### AD-31 ripple list (for Tony's novel edit; I have not touched `novel/`)
Changing 62 to 57 is not a one-number fix. Ch14 lines that assume nineteen villagers died:
- line 1, title: "THE VILLAGE OF NINETEEN ABSENCES" (also Ledger Ch 4-1's title and `03_story.md`)
- line 19: "Nineteen." and the following sentence: Chit-tat-to counted them to carry the number home
- line 27: "eighty-one… now it had sixty-two"
- lines 53, 55: "Nineteen marks on the wall… Nineteen new ones, all in a row"
- line 75: his hand sign, "four times short of nineteen"
- line 89: "a ring of sixty-two people"
- line 99: Kesh-ka looks "at the four hundred years, at the nineteen"

Two ways to make it consistent, both Tony's call:
1. **Twenty-four everywhere in the village's eyes.** The wall gets twenty-four marks; five of them are drawn as a spear or a blade, because that was their thing at the end. Title and Chit-tat-to's carried number become twenty-four. "Nineteen" stays the *court's* number only.
2. **The village mourns twenty-four but Chit-tat-to carries nineteen**, because he, the Witness, saw which ones never raised a hand, and the court later agrees with him. Title stands; lines 27 and 89 become 57; the wall lines need one added sentence about the other five marks.
Option 2 keeps the title, the Ledger chapter name and the 19 + 5 debt all aligned, and gives Chit-tat-to's counting a meaning it does not have yet. **My recommendation is 2.**

### The five who charged (DRAFT, NP-21)
Ch04: "two long spears, leveled… The lead spear carrier shrieked something and broke into a run. Three more came behind it, blades up." Proposed seating, IDs kept:
| Manuscript | Citizen | Why |
|---|---|---|
| Lead spear carrier, who shrieked and ran | **cit-015 Ras-Ti-Vok**, "the one who says go" | His shriek was the order to run for the open door. The humans heard a war cry. This replaces my earlier invention that Tav-Ri screamed, and it is the manuscript's own event. |
| Second spear carrier, "big for their kind" | **cit-009 Bru-Ka-Dol** (still Rul's brother) | The largest of the cast; put himself at the front. |
| Three with knives | **cit-004 Tav-Ri** (15), **cit-014 Fen-Ya-Sool**, one unassigned (cit-025 reserved) | The fast ones, in front of the old and the small. |
Consequences: these five sit on **Duy's** balance, the nineteen on Cuong's. Under AD-06 that makes a third standing toward Duy inside the Claw. Where caged prisoners got iron blades and spears is unstated in the manuscript; I leave it open. Four new non-combatant IDs are needed to keep nineteen (cit-026…029 reserved): candidates are Chit-tat-to's mother, his uncle, the wearer of the red cord and the carver of the comb.

## 2. Naming (AD-41; earlier system withdrawn)

Anchors: **Khet-Tak-Tor**, "the voice that closes the debt"; **Chit-tat-to**; and the manuscript's everyday names **Ptik, Rul, Kesh-ka**.
- A full name has three hard-edged beats and is a small picture-phrase, given at birth.
- Everyday speech shortens it to one or two beats. Elders and strangers tend to get the full name; children and friends the short one.
- Known pairs: Shi-Pa-Nol is Ptik. Nim, Kip and Tav-Ri are everyday forms; their full names are unwritten and reserved.
- Reserved beats I will not reuse with another meaning: khet (voice), tak (close), tor (debt), chit, tat, to.
- Withdrawn with AD-05/22/26: trail-names, the salt walk, a child earning beats in sanctuary.

## 3. The people of Hollowbeech (DRAFT detail on AD-08/09/12/13 canon)

- No collective name (AD-12). They are the folk of their last village: Hollowbeech (NP-11).
- NP-04 (revised) **The Road Song**: one verse per village built and lost, and the road between. Sung backwards it is the way home to the lost kingdom. See NP-10.
- NP-05 **The one fire**: the common-oven fire is never relit; when a village is lost a live coal is carried to the next in a clay pot. The village believes it went out in the raid. It did not (AD-27): an escapee carried a coal to the next village. I do *not* tie this to the recurring street fire; that question is open in CANON.
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
