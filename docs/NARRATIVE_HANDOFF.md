# Codex narrative handoff

Newest batch first. Earlier batches are never edited except to mark items superseded.

---

## Batch 15 — 2026-09-17 · branch `claude/narrative-batch-15` (on batch 14)

### 1. Approved decisions
| ID | Decision | Supersedes |
|---|---|---|
| **AD-30** | **The manuscript (`novel/`) governs wherever it collides with Fwoosh canon or earlier approvals.** | **Withdrawn:** AD-25, AD-27, AD-29. **Changed:** AD-13 → 81 before / 62 after; AD-17 → Hollowbeech is not the raid site; AD-08/09 → kingdomless people who move, but the village is underground and intact. **Suspended:** AD-05, AD-26 (naming). **Fwoosh CANON.md (#75/#76):** "destroyed the village… captured its last nineteen survivors" → Blackroot took villagers from a living village of 81 and destroyed nothing; "unarmed captives" → the court reclassified 19 of 24 dead as non-combatants (Ch05). **Codex: if you already mirrored AD-25…AD-27 anywhere, revert those lines. Do not mirror AD-13 or AD-17 as originally worded.** Full list: BIBLE §1b. |

Untouched and still approved: AD-01, 02, 03, 04, 06, 07, 10, 11, 12, 14, 15, 16, 18–24, 28.

### 2. Finished content (DRAFT)
- BIBLE §1d continued: N-12 (24 dead vs 19 absences), N-13 (red cord, comb), N-14 (Miss Hue's wording).
- Re-seating map NP-19: which of my citizens become the manuscript's named dead, IDs kept.

### 3. Reveal order
Unchanged in structure. The cell's spoiler gate now protects more: a citizen's background may reveal they are Chit-tat-to's aunt or mother.

### 5. Makko art (proposal)
One **wall-mark** per citizen, in the style of the village history wall (Ch14: a fishing line, a knot, a spiral, a grinding stone). Blocked on re-seating approval.

### 6. Open
- **Asked:** who the five armed dead were (N-12).
- NP-17 Hollowbeech as an earlier lost village; NP-18 naming rework; NP-19 re-seating map; NP-20 words come in sanctuary; how much of Chit-tat-to's mother Fwoosh may show; whether Nim's parents live.
- All 22 profiles, 5 admission scenes, `dia-cell-r1` are **suspended drafts**. `dia-home-r2` and `dia-keith-c1` are unaffected.
- Still to read line by line: the complete handoff and chapters 0–3, 8–13, 15–16.

### 7. Files and commit
BIBLE.md, NARRATIVE_HANDOFF.md. `git log claude/narrative-batch-15 -1`.

---

## Batch 14 — 2026-09-17 · branch `claude/narrative-batch-14` (on batch 13) · main now 5e32257 (`novel/` added)

### 1. Approved decisions
None new. **Several approved decisions are now in question** because the manuscript Tony added as source of truth contradicts them: AD-05/AD-26 (naming), AD-08/AD-09 in part, AD-13, AD-17, AD-25. They remain recorded as approved until Tony rules; do not mirror AD-25…AD-27 into CANON.md or Ledger yet.

### 2. Finished content
Novel cross-check, docs/narrative/BIBLE.md §1d (N-01…N-11).

### 3. Reveal order / 4. Triggers / 5. Art
Unchanged. New art idea pending approval: one **wall-mark** icon per citizen (N-11).

### 6. Open
- **Asked:** which source governs where the manuscript and today's approvals collide.
- All 22 profiles, 5 admission scenes and both diary rewrites are **suspended drafts** until that answer. `SOCIETY_PROFILES` must stay empty.
- The manuscript contradicts itself on whether the Ratkin in the cell were armed (Ch04 vs Ch14). Tony's call; affects Fwoosh CANON's "unarmed".
- Still to read line by line: `novel/BLOOD_DEBT_COMPLETE_HANDOFF.md` and the other chapters.

### 7. Files and commit
BIBLE.md, NARRATIVE_HANDOFF.md. `git log claude/narrative-batch-14 -1`.

---

## Batch 13 — 2026-09-17 · branch `claude/narrative-batch-13` (on batch 12)

### 1. Approved decisions
| ID | Decision | Supersedes |
|---|---|---|
| AD-28 | Ratkin material takes the Brooks register; diary stays Griffin; System text stays the Auditor | batch-09 NP-14 → approved |
| AD-29 | Residents know some escaped Hollowbeech, not who; arrivals from the living village are their only news | batch-11 NP-16 → approved. Consistent with Ledger: living villagers know of sanctuary via the System's announcement, but nothing flows back. |

### 2. Finished content
None new. **Known defect:** many first-meeting lines and chronicle entries from batches 01–08 use a wry, winking narrator that AD-28 rules out. Content and facts stand; wording will change in the register audit. Treat all 22 profiles and 5 admission scenes as pre-audit drafts.

### 6. Open
Register audit (mine, next). L-02 and L-04 need the Blood Debt story bible. Ten diary chapters blocked on the same. Profiles must not ship to `SOCIETY_PROFILES` yet.

### 7. Files and commit
`git log claude/narrative-batch-13 -1`. This branch contains everything from batches 01–13 plus Codex's reconcile commit.

---

## Batch 12 — 2026-09-17 · branch `claude/narrative-batch-12` (on batch 11)

### 1. Approved decisions
| ID | Decision | Supersedes |
|---|---|---|
| AD-26 | Name beats track journeys and chosen work, not age. Chit-tat-to earned three young; "Kesh-ka" is a use-name. | Amends AD-05's age wording (batch 01 NP-02 text). Resolves L-03. No citizen renamed. |
| AD-27 | The carried fire survived in the living village; Dof-Ma-Rek does not know. | batch-11 NP-15 → approved. BIBLE NP-05 "it went out" → "the village believes it went out". **Touches Ledger:** the Village of Nineteen Absences has Hollowbeech's fire. Codex: record in FWOOSH_SHARED_DECISIONS.md. |

### 2. Finished content (DRAFT)
cit-003: new reserved entry `arrival-from-living-village:first`. cit-022: one sentence changed so the narration no longer asserts the fire went out.

### 3. Reveal order
AD-27 is a late payoff. Nothing in Fwoosh may reveal it before a resident arrives from the living village, which no system supports yet. Ledger may show the fire in the living village at any time; the irony works in either play order.

### 6. Open
L-02, L-04 (both need the Blood Debt story bible), NP-14, NP-16. Profiles still must not ship.

### 7. Files and commit
`git log claude/narrative-batch-12 -1`.

---

## Batch 11 — 2026-09-17 · branch `claude/narrative-batch-11` (on batch 10)

### 1. Approved decisions
| ID | Decision | Supersedes |
|---|---|---|
| AD-25 | Hollowbeech was destroyed; some villagers escaped and built again. Ledger's "Village of Nineteen Absences" is the village after Hollowbeech. The nineteen are the last of those Blackroot **took**. | Fwoosh CANON.md (#75/#76) wording that the nineteen were the community's "last survivors" → "the last survivors among those Blackroot captured". BIBLE NP-07 "the rest killed" → three-way split (killed, taken, escaped). Ledger text is unchanged and now consistent. Resolves L-01. **Codex: mirror into CANON.md and Ledger's FWOOSH_SHARED_DECISIONS.md.** |

### 2. Finished content (DRAFT)
cit-008 background: one sentence changed (she no longer knows that nobody stayed free). NP-15, NP-16 added to BIBLE §1b.

### 3. Reveal order
Residents do not know who escaped. No text may name a living escapee until Ledger names its villagers.

### 4–5. Unchanged.

### 6. Open
L-02 (Chit-tat-to in the cell), L-03 (naming vs Chit-tat-to and Kesh-ka; asked), L-04 (novel may already name the nineteen), NP-15, NP-16. Profiles still must not ship to `SOCIETY_PROFILES`.

### 7. Files and commit
BIBLE.md, CAST_REGISTRY.md, NARRATIVE_HANDOFF.md. `git log claude/narrative-batch-11 -1`.

---

## Batch 10 — 2026-09-17 · branch `claude/narrative-batch-10` · based on `claude/narrative-batches-01-09` @ 2bb09ec (Codex's import + reconcile commit)

### 0. Sync note
Codex had already imported batches 01–09 onto current main and added "Reconcile approved narrative canon and Warden wording" (2bb09ec). I did not push over it. This batch sits on top of that commit. Main has also gained #76–#78 and the authored profile contract (`js/society-content.js`, `SOCIETY_PROFILES`), which I have read: profiles need `{name, pronunciation, lifeStage, formerRole, voice, chronicleIntro, background, desire, milestones}`. My registry fields map onto it directly once Tony approves profiles.

### 1. Approved decisions
None new.

### 2. Finished content
Ledger cross-check, docs/narrative/BIBLE.md §1c (L-01…L-09). vovinam-ledger read at e61dda2.

### 3–5.
Unchanged.

### 6. Open: **do not ship any citizen profile to `SOCIETY_PROFILES` until L-01…L-04 are answered**
- **L-01** Ledger has a living "Village of Nineteen Absences"; Fwoosh canon says the village was destroyed and the nineteen were its last survivors. Asked.
- **L-02** Chit-tat-to was in the cell and escaped. No profile mentions him yet.
- **L-03** Chit-tat-to (15, three beats) and Kesh-ka (elder, two beats) break AD-05's age rule.
- **L-04** Ledger says the nineteen are listed by name. My nineteen names may collide with the novel bible.
- Still blocked on the Blood Debt story bible for ten diary chapters.

### 7. Files and commit
docs/narrative/BIBLE.md, docs/NARRATIVE_HANDOFF.md. `git log claude/narrative-batch-10 -1`. **Pushed** to origin as `claude/narrative-batch-10`.

---

## Batch 09 — 2026-09-17 · branch `claude/narrative-batch-09` (stacked on 08) · base `main` 8f23fdc

### 1. Approved decisions
None new.

### 2. Finished content (DRAFT): style conformance pass
Tony's `blood-debt-writing` skill (universe style rules) was found and applied. See docs/narrative/BIBLE.md §0.
- All em/en dashes removed from player-facing prose: backgrounds, first-meeting lines, chronicle entries, admission lines, diary pages. Registry scaffolding now uses `·` and `→`. (Handoff and bible notes, which are not player-facing, still contain dashes.)
- `dia-home-r2` page 3: raw stat readout replaced with an Auditor-voice notice. **Codex: if any runtime text renders System messages as bare stat output, the same rule applies.**
- `adm-claw` line 5: removed a "not X but Y" construction.
- Not yet done: a full line-by-line audit of all 22 profiles against the craft rules (rule-of-three, agency, adjectives). Scheduled next.

### 3. Reveal order / 4. Triggers / 5. Art
Unchanged.

### 6. Open
- **Blocked:** diary chapters `morning`, `walk`, `vendor`, `gunfire`, `betrayal`, `death`, `void`, `gods`, `debt`, `gate` retell Blood Debt bible events. The skill's rule zero forbids canon work without the bible in context. I cannot see Tony's other chats. Needs upload: story bible (esp. Continuity Anchors §7, Planted Payoffs §11) and the Book 1 chapters covering market through gate.
- Still unread: vovinam-ledger's three docs.
- NP-14 (Brooks register for Ratkin material); Sanderson-vs-skill reading; NP-13 withdrawn.
- Existing approved runtime text (`fire`, PRESENT lines) contains constructions the skill bans (e.g. flames as the acting subject). Not touched; Tony's call whether the skill applies retroactively to approved Fwoosh text.

### 7. Files and commit
`git log claude/narrative-batch-09 -1`. Not pushed. Delivered as `narrative-batches-01-09.patch` (nine commits).

---

## Batch 08 — 2026-09-17 · branch `claude/narrative-batch-08` (stacked on 07) · base `main` 8f23fdc

### 1. Approved decisions
None new. Tony ruled the **Ratkin recruit's identity stays open** ("too early"); no citizen is written toward that role. CANON's open item stands.

### 2. Finished content (DRAFT)
| ID | Content |
|---|---|
| cit-013…cit-019 | Seven full profiles. **All nineteen captives are now fully written** (cit-001…019). |
| mirrors | Every relationship between written profiles now appears in both; table statuses updated |

Counts: 22 full profiles (19 captives, 2 raid dead, 1 ancestor), 2 reserved (cit-023, 024), 81 conditional entries.

### 3. Reveal order
- cit-018 holds the only evidence on whether Blackroot followed the traders home. His profile says he is "sure they were not followed"; this is his belief, not a ruling. The Blackroot / trading-post link remains open in CANON and nothing here settles it.
- cit-019's background mentions a birth and deaths in the cages. Keep behind the same gate as other backgrounds (not before diary `cell`).

### 4. Triggers
New reserved labels with no system: `milestone:apology-orr`, `milestone:told-ras-ti-vok`, `milestone:first-birth` (later scope: voluntary children). None may display.

### 5. Makko art (blocked on profile approval)
| ID | Base | Distinguishing proposal |
|---|---|---|
| cit-013 | baker | flour to the elbows, grinding-stone calluses, measuring scoop on a cord |
| cit-014 | ratkin | lean, bark-scuffed, always posed on or against something vertical |
| cit-015 | ratkin | heavier build, arms folded, a knotted tally-cord of heads counted |
| cit-016 | elder | rounder than cit-001, apron over elder's robe, wooden spoon as a staff of office |
| cit-017 | farmer | damp-dark sleeves, lidded basket, a snail visible somewhere on her |
| cit-018 | merchant | younger, oversized pack, the soft knife still on his belt |
| cit-019 | herbalist | sleeves tied back, clean hands, plain; stands behind others in group shots |

### 6. Open
Asked this turn: how much latitude I have on diary chapters 1–8, which retell Blood Debt events I cannot verify. Carried: recruit identity (open by Tony's choice), NP-13, Arbiter's mandate limits, cit-023/024, all prose DRAFT, vovinam-ledger unread.

### 7. Files and commit
`git log claude/narrative-batch-08 -1`. Not pushed. Delivered as `narrative-batches-01-08.patch` (eight commits).

---

## Batch 07 — 2026-09-17 · branch `claude/narrative-batch-07` (stacked on 06) · base `main` 8f23fdc

### 1. Approved decisions
| ID | Decision | Supersedes |
|---|---|---|
| AD-22 | Trail-names come from a real journey on one's own feet: some expulsions, some chosen journeys | batch-03 NP-12 (approved with amendment). cit-002 background and "wants" revised: she was promised a salt walk. |
| AD-23 | Residents of any age may come to the gate while Duy is barred | batch-03/04 open item; validates `dia-home-r2` page 2 |
| AD-24 | Arbiter design gains burn-scarred, furless forearms | **Changes a Tony-approved Makko reference.** `arb-scar` is now an approved art request for Cursor. |

### 2. Finished content (DRAFT)
| ID | Content |
|---|---|
| cit-007, 009, 010, 011, 012 | Five full profiles promoted from stubs (docs/narrative/CAST_REGISTRY.md). Twelve of the nineteen are now fully written. |
| cit-023, cit-024 | IDs reserved for Kip's parents (pre-raid dead); unauthored |
| fixes | Removed a contradiction between "four expulsions in living memory" and Sek-Ra-Tun's two verses; `adm-hand` line 5 adjusted to match |

Counts: 15 full profiles, 9 stubs/reserved, 60 conditional entries, 5 admission scenes, 2 diary rewrites + 1 clue.

### 3. Reveal order
New trigger label `gate:first-visit` entries may show any time after the citizen arrives (AD-23). cit-011's background confirms who screamed only by implication ("He heard Tav-Ri scream"); same gate as cit-004's background: not before diary `cell`.

### 4. Triggers
**Narrative intent:** `gate:first-visit` = this resident has come to look at Duy. Purely flavour; may be time-based after arrival.
**Proposed mechanics:** none required.

### 5. Makko art
| ID | Request | Status |
|---|---|---|
| arb-scar | Arbiter: burn-scarred, furless forearms, visible in portraits and full body | **approved (AD-24)** |
| cit-007 | herbalist base; coat with a visibly lumpy, hand-stitched hem; label-tags on everything | blocked on profile approval |
| cit-009 | mason base; largest adult silhouette; carrying-yoke scars across the shoulders | 〃 |
| cit-010 | weaver base; cord looped at both wrists, child-sling across the back; Kip usually half-hidden behind her | 〃 |
| cit-011 | lantern base; older, grey at the muzzle; lantern shuttered, held low and backwards | 〃 |
| cit-012 | child base, smaller than cit-002; scrap of hammock netting as a comfort-cloth | 〃 |

### 6. Open
Remaining stubs: cit-013…019. One-sided relationship lines to mirror next pass (listed in the registry table). Carried: NP-13, Arbiter's mandate limits, recruit identity, all prose DRAFT, vovinam-ledger unread.

### 7. Files and commit
`git log claude/narrative-batch-07 -1`. Not pushed. Delivered as `narrative-batches-01-07.patch` (seven commits).

---

## Batch 06 — 2026-09-17 · branch `claude/narrative-batch-06` (stacked on 05) · base `main` 8f23fdc

### 1. Approved decisions
| ID | Decision | Supersedes |
|---|---|---|
| AD-20 | The Claw's favor **requires Ase-Ro-Wen (cit-020)** | batch-05 `adm-claw` r1 (she dissented and the bloc carried) → withdrawn; bloc-split table row updated |
| AD-21 | The kingdom's fall is never dated: "longer than anyone has counted" | batch-05 `adm-hearth` line 1 "three hundred years" → replaced. Applies to all future text. |

### 2. Finished content (DRAFT)
`adm-claw` r2 and `adm-hearth` line 1, in docs/narrative/ADMISSION_SCENES.md.

### 3. Reveal order
Unchanged.

### 4. Triggers
**Narrative intent:** the Claw scene has Ase-Ro-Wen say she was one of the twelve further ascensions the Claw asks for. So cit-020 must be resident before the Claw vote can be earned, and ideally arrives *during* those twelve.
**Proposed mechanics (Codex decides):** when identity assignment exists, reserve cit-020 for one of the post-hearing ascensions counted toward the Claw goal. If that is impractical, tell me and I will drop the "one of the twelve was me" clause; the rest of the scene survives.

### 5. Art
No change.

### 6. Open
Asked this turn: NP-12 (trail-name wording), residents at the gate while Duy is barred, `arb-scar`. Carried: NP-13, Arbiter's mandate limits, recruit identity, all prose DRAFT, vovinam-ledger unread.

### 7. Files and commit
`git log claude/narrative-batch-06 -1`. Not pushed. Delivered as `narrative-batches-01-06.patch` (six commits).

---

## Batch 05 — 2026-09-17 · branch `claude/narrative-batch-05` (stacked on 04) · base `main` 8f23fdc

### 1. Approved decisions
| ID | Decision | Supersedes |
|---|---|---|
| AD-19 | Each bloc's favor opens its own door: Hearth threshold, Bowl seat at the table, Hand work-yards, Claw unescorted, Memory the Road Song | Gives AD-02 its steps. Nothing in runtime or CANON describes admission, so nothing is overwritten; the always-open "VISIT SANCTUARY" conflict from batch 03 stands. |

### 2. Finished content (DRAFT)
| ID | Content | Path |
|---|---|---|
| adm-hearth, adm-bowl, adm-hand, adm-claw, adm-memory | Five 5-line admission exchanges in live present-dialogue shape, order-independent | docs/narrative/ADMISSION_SCENES.md |
| echo-* | 9 chronicle echoes keyed to those scenes (cit-001, 002, 003, 004, 005, 006, 009, 010, 020) | same |
| bloc-split-01 | Table of who pulls for and against favor in each bloc under AD-06 | same |

### 3. Reveal order
Each scene may play only after its bloc's vote is earned. Any order. `adm-memory` is the earliest live use of "Hollowbeech" and "Road Song". None mentions the Arbiter's burden.

### 4. Triggers
**Narrative intent:** one scene per earned vote, once; echoes display after their scene.
**Proposed mechanics (Codex decides):** the existing stable earned-vote IDs under `judgment` are sufficient triggers. Scenes could play from the Shrine/Judgment panel or on next town visit; they must not interrupt a run. Speakers other than DUY need portraits or a fallback (below).

### 5. Makko art requests
| ID | Request | Blocked on |
|---|---|---|
| por-cit-022, por-cit-003, por-cit-021, por-cit-020, por-cit-001 | Dialogue portraits to the existing 256×256 contract; emotions used: dry, stern, relieved, angry | profile approval; until then scenes can run with the matching civilian-type crop as a labelled placeholder only if Tony allows |
| adm-* | No new illustrations requested | — |

### 6. Open
- Should the Claw's vote require Ase-Ro-Wen, or may it carry over her dissent (as drafted)?
- "three hundred years" in `adm-hearth` is a placeholder span.
- Carried forward: NP-12, NP-13, residents at the gate, `arb-scar`, Arbiter's mandate limits, recruit identity, all prose DRAFT, vovinam-ledger unread.

### 7. Files and commit
Adds docs/narrative/ADMISSION_SCENES.md. `git log claude/narrative-batch-05 -1`. Not pushed. Delivered as `narrative-batches-01-05.patch` (five commits).

---

## Batch 04 — 2026-09-17 · branch `claude/narrative-batch-04` (stacked on 03) · base `main` 8f23fdc

### 1. Approved decisions and what they supersede
| ID | Decision | Supersedes |
|---|---|---|
| AD-15 | js/story.js, DIARY id `fire`, page 1: **"to stop the jailer following them" → "to stop the Warden following them"**. No other change to that chapter. | prose-2 approved text, that phrase only. **Codex: this is a runtime string; I have not edited story.js.** |
| AD-16 | Road Song restoration (older ancestors correct older verses; name recovered by someone who lived there) | batch-03 NP-10 → approved |
| AD-17 | Last village is **Hollowbeech** | batch-03 NP-11 → approved; fulfils AD-12 for this community |
| AD-18 | Khet-Tak-Tor explains AD-07 in his own words; inference from scars is not enough | batch-03 `dia-home-r1` (withdrawn) and batch-03 §4 proposed mechanic (c), now unnecessary |

### 2. Finished content (DRAFT)
| ID | Content | Path |
|---|---|---|
| dia-home-r2 | `home` rewrite, 6 pages; pages 4–5 are Khet-Tak-Tor's explanation | docs/narrative/DIARY_REVISION.md |

### 3. Reveal order
Unchanged from batch 03. `dia-home-r2` is the single place AD-07 is stated. The kingdom's name still appears nowhere.

### 4. Triggers
None new. For AD-16, narrative intent only: ancestors arrive roughly newest-death first, so the song is repaired backwards. The arrival who restores the first verse must be authored and scheduled deliberately; not yet written.

### 5. Makko art
`arb-scar` (scarred forearms) is still **unapproved**: Tony kept scars as a clue but has not explicitly OK'd changing the Arbiter's approved design. `dia-home-r1-a` renamed `dia-home-r2-a`, same brief.

### 6. Open
- Asked: what each bloc's favor opens to Duy (AD-02 detail).
- Still open: NP-12 trail-name wording, NP-13 stat text in prose, residents at the gate, `arb-scar`, limits of the Arbiter's mandate, recruit identity.
- All profile and diary prose remains DRAFT. vovinam-ledger unread.

### 7. Files and commit
Same four paths. `git log claude/narrative-batch-04 -1`. Not pushed. Delivered as `narrative-batches-01-04.patch` (four commits).

---

## Batch 03 — 2026-09-17 · branch `claude/narrative-batch-03` (stacked on 02) · base `main` 8f23fdc

### 1. Approved decisions and exactly what they supersede
Full text of AD-02…AD-14 is in docs/narrative/BIBLE.md §1b. Summary for reconciliation:

| ID | Decision | Supersedes |
|---|---|---|
| AD-02 | Duy barred from sanctuary, admitted step by step as blocs grant favor | Nothing written; **conflicts with runtime**: town hub "VISIT SANCTUARY" is open from the start (city.js:222). Narrative intent only; Codex to propose how the screen reads before admission (e.g. viewed from the gate). |
| AD-03 | Warden (huge monster) and Khet-Tak-Tor (Ratkin jailer) are two beings under the gate | story.js `fire` p1 "to stop the jailer following them" → "the Warden" (**Tony-approved text; needs his OK**). CANON "Khet-Tak-Tor was Duy's Ratkin jailer before the gate fell" stands. |
| AD-04 | Two of the nineteen were children (cit-002 Nim, cit-012 Kip) | batch-01 NP-03 / X-06 |
| AD-05 | Three-beat naming | batch-01 NP-02. Trail-name definition adjusted by AD-09 (NP-12, unapproved wording) |
| AD-06 | Killed-by vs only-rescued-by split drives bloc disagreement | batch-02 NP-08 |
| AD-07 | Fire = final test; Khet-Tak-Tor keeps it lit as the only way through and carries his people himself; CON/HP too low, rising as he burns; Duy shares the load | CANON open item "Why Khet-Tak-Tor maintains or uses the recurring fire"; batch-02 X-09. CANON "Khet-Tak-Tor can punish, test and obstruct Duy" stands but should be read with this motive. |
| AD-08 | Villagers, not forest nomads; kingdom destroyed centuries ago | **Every "nomadic forest tribe / forest society / forest culture" in CANON.md, SANCTUARY_SOCIETY.md, CLAUDE_CITIZEN_STORY_BRIEF.md, CURSOR_SANCTUARY_KICKOFF.md, ROADMAP.md (PRs #73–#75).** Cursor: "woodland community props" and "forest culture visual identity" → village culture of a displaced people. |
| AD-09 | Displaced village to village; Blackroot tracked their moves; settled | CANON Blackroot para "follow the Ratkin's seasonal migration routes and locate family gathering places"; all "permanent-settlement versus mobile-camp still open" notes; batch-01 NP-04/06/07 (revised in place) |
| AD-10 | Dead burned for centuries; covenant made the old fire the test | Reconciles AD-01 with AD-07; CANON "centuries of injustice" → both persecution in life and burning after |
| AD-11 | Who opened the cell door: unknown, reserved for Ledger | batch-01 open question; no text may answer it |
| AD-12 | No collective name; named for last village built | CANON/SANCTUARY "Its name… remain open" |
| AD-13 | Last village ~150–200 people | batch-01 NP-07 "size open" |
| AD-14 | Kingdom's name is lost; recovering it is a payoff | — |

Request: Codex mirror AD-01…AD-14 into CANON.md and the Fwoosh/Ledger shared handoff. I have not edited those files.

### 2. Finished content (DRAFT unless marked)
| ID | Content | Path |
|---|---|---|
| cit-001…006, 008, 020…022 | Ten profiles **re-seated** in displaced-village canon. IDs, names, relationships, temperaments unchanged. Role labels changed: cit-001 route-keeper → road-keeper; cit-003 camp cook → village cook. | docs/narrative/CAST_REGISTRY.md |
| cit-002, cit-012 | Children among the nineteen: **approved fact (AD-04)**; profile prose still draft | same |
| dia-home-r1 | Rewrite of diary `home`, 5 pages, new teaser | docs/narrative/DIARY_REVISION.md |
| dia-keith-c1 | One-sentence clue for diary `keith` | same |
| NP-10…NP-13 | Road Song restoration; Hollowbeech; trail-name under AD-09; stat text in prose | docs/narrative/BIBLE.md §1b |

### 3. Reveal order and spoiler boundaries (replaces nothing; adds)
1. **AD-07 is the diary's biggest reversal.** Clue: `keith` (forearms; existing strained portrait). Payoff: `home`, the final chapter. No present-tense line, chronicle or HUD text may state that the Arbiter carries the burning, or that the fire is a test, before `home` is *read*. After that, chronicles may refer to it.
2. AD-01/AD-10 (the dead burned for centuries) is discovered through the first ancestor arrival (cit-022), per batch 02.
3. AD-08/09 (lost kingdom, serial expulsion) surfaces through cit-001's background and the Road Song; never in present dialogue.
4. AD-14: the kingdom's name must not appear anywhere until NP-10 is approved and scheduled. It does not exist in any file yet.
5. AD-11: nothing answers the door.

### 4. Triggers
**Narrative intent:** `milestone:circuit-walked` is renamed `milestone:trail-name` (still no system; reserved). New intent: `diary-read:home` as a prerequisite for any text that mentions the Arbiter's burden.
**Proposed mechanics (Codex decides):** (a) sanctuary screen gated or reframed per AD-02; (b) ancestor arrivals ordered roughly newest-death to oldest, which is all NP-10 needs; (c) optional post-`home` present exchange where Khet-Tak-Tor states AD-07 aloud.

### 5. Makko art requests
| ID | Request | Blocked on |
|---|---|---|
| cit-001 | **Changed:** sash with two large knots (verses she added), not eleven | profile approval |
| cit-006 | adds: stone door-prop as a household prop | profile approval |
| arb-scar | Khet-Tak-Tor: burn-scarred, furless forearms visible under the robe sleeves in portraits and full body. Check existing approved reference first; if it conflicts, flag rather than regenerate. | Tony (touches an approved character design) |
| dia-home-r1-a | Diary illustration: Khet-Tak-Tor kneeling in the street, holding a burning Ratkin by the shoulders, seen from behind | `dia-home-r1` approval; spoiler: never shown before `home` |
| — | Cursor kickoff wording "forest culture / woodland props" is superseded by AD-08/09: village culture of a people who rebuild (common oven, carried coal-pot, wells, mended everything) | Codex to update the brief |

### 6. Open questions and unapproved drafts
- Needs Tony: one-word `fire` edit (AD-03); NP-10, NP-11 (Hollowbeech), NP-12, NP-13; whether residents may come to the gate while Duy is barred; whether Khet-Tak-Tor ever says AD-07 aloud.
- Not yet asked: what each step of admission looks like per bloc (AD-02 detail); limits of the Arbiter's mandate; Ratkin recruit identity.
- All profile prose and both diary rewrites remain DRAFT.
- vovinam-ledger still unread; AD-03, AD-07, AD-08 and AD-11 all touch Ledger and are unverified against it.

### 7. Files and commit
Same four paths. Commit: `git log claude/narrative-batch-03 -1`. Not pushed (no credentials). Delivered as `narrative-batches-01-03.patch` (three commits, `git am`). No runtime files touched.

---

## Batch 02 — 2026-09-17 · branch `claude/narrative-batch-02` (stacked on batch 01) · base `main` 8f23fdc

### 1. Approved decisions and what they supersede
| ID | Decision (Tony, in narrative conversation) | Supersedes / affects |
|---|---|---|
| **AD-01** | Before sanctuary existed, **all Ratkin dead everywhere burned**. The burning streets are the old Ratkin afterlife. Duy empties it, **this tribe first**; other worlds later. | Resolves batch-01 X-02. Confirms SANCTUARY_SOCIETY "centuries of burning"; CANON.md "After centuries of injustice" should be sharpened to match. CANON/brief line "do not invent additional living survivors" still holds: residents 20+ are the tribe's *dead* (raid victims, earlier generations), not survivors. Does **not** settle why the fire recurs or who keeps it (CANON open item stands). Request: Codex mirror AD-01 into CANON.md and the Ledger shared handoff. |

Nothing else is approved. All prose remains DRAFT.

### 2. Finished content (DRAFT)
| ID | Content | Path |
|---|---|---|
| cit-008 | Pel-Ta-Shu, full profile (was stub) | docs/narrative/CAST_REGISTRY.md |
| cit-020, cit-021 | Ase-Ro-Wen, Dak-Ro-Fen: Nim's parents, raid dead. Unblocked by AD-01. | same |
| cit-022 | Hal-Ne-Dur: **first ancestor citizen** (died of age before the raid) | same |
| rel-batch02 | 8 new or completed edges; all cit-001…006 edges to written profiles now agree both ways | same |
| NP-08, NP-09, X-09 | Two-standings proposal; no felt durations; "i keep the fires going" tension | docs/narrative/BIBLE.md §1a |

Counts: 10 full profiles, 12 stubs, 40 conditional entries.

### 3. Reveal order and spoiler boundaries (adds to batch 01)
- That *all* Ratkin dead burned (AD-01) is a major reveal. Intent: the player infers it, not from exposition, but from the first **ancestor arrival**: someone who died peacefully in bed years ago walks into the refuge. cit-022's first-meeting line is written to carry exactly that and nothing more.
- Therefore no ancestor (cohort `tribe`, pre-raid death) should arrive before the nineteen are all home **and** diary `cell` is unlocked. Raid dead (cit-020, cit-021) may arrive after the nineteen and before ancestors.
- Present-tense dialogue must not state AD-01 outright before that arrival.

### 4. Triggers
No new trigger types. New uses: `reunion:cit-002`, `reunion:cit-001`, `reunion:cit-003`, `celebration:music`, `arrival+cit-001 present`.
**Proposed mechanics (Codex decides):** arrival order by cohort: captive → raid dead → ancestors → (later) other worlds. Within a cohort any order is acceptable to the narrative.

### 5. Makko art requests (blocked on profile approval)
| ID | Base | Distinguishing proposal |
|---|---|---|
| cit-008 | wellkeeper | mouth usually open mid-song; tuning-reed behind one ear; buckets are water (per existing brief) |
| cit-020 | ratkin | coiled climbing line across the chest, bark-scuffed knees, tail wrapped with grip-cord |
| cit-021 | mason | bulging mender's bag, every item of clothing visibly patched in a different cord |
| cit-022 | elder | oldest silhouette in the cast; ash-grey hands like cit-003's; rides/sits whenever staging allows |

### 6. Open questions and unapproved drafts
- **Q2 (asked):** can Duy enter sanctuary and speak with residents? Several batch-01/02 lines (Nim questioning him, Ase-Ro-Wen "to his face", Pel-Ta-Shu seeing his arms) assume some contact. Blocks the `home` rewrite.
- Queued: X-04 jailer vs Warden (needs Ledger); NP-03 children among the nineteen; NP-02 naming; NP-08 two standings; X-09; community name; who opened the cell door; tribe size.
- vovinam-ledger still unread.

### 7. Files and commit
Same four paths as batch 01. Commit: `git log claude/narrative-batch-02 -1`. Not pushed (no credentials). Delivered as `narrative-batches-01-02.patch` (two commits, `git am`).

---

## Batch 01 — 2026-09-17 · branch `claude/narrative-batch-01` · base `main` 8f23fdc

### 1. Approved decisions and what they supersede
**None.** Tony has approved nothing from this batch. Do not integrate any of it as canon or runtime text.

### 2. Finished content (all DRAFT)
| ID | Content | Path |
|---|---|---|
| cit-001…cit-006 | Full profiles: background, first-meeting line, 4 conditional entries each | docs/narrative/CAST_REGISTRY.md |
| cit-007…cit-021 | Reserved stubs (name, pronunciation, stage, role, visual ref, one line) | same |
| rel-batch01 | Relationship table, 21 edges | same |
| dia-cell-r1 | Rewrite of diary chapter `cell`, 4 pages, new teaser | docs/narrative/DIARY_REVISION.md |
| audit-walk / audit-cell / audit-home | Three-chapter craft audit | same |
| X-01…X-08 | Contradiction report | docs/narrative/BIBLE.md §1 |
| NP-02, NP-04…NP-07 | Naming, Circuit Song, one fire, log-seeding, raid at autumn gathering | BIBLE.md §2–3 |

### 3. Reveal order, prerequisites, spoiler boundaries (narrative intent)
- A citizen's **first-meeting line** may show on arrival. It never mentions the cell or the raid.
- A citizen's **background** should sit behind a later gate than arrival. Intent: the player meets a cook, then learns he was one of the nineteen. Suggested prerequisite: diary `cell` unlocked (18 rescues) *or* first judgment heard, whichever Codex finds cleaner.
- The word **Blackroot** appears only inside backgrounds, never in first-meeting lines or present dialogue.
- cit-004's background pays off the scream in `dia-cell-r1`. Do not show it before `cell` is unlocked.
- cit-005's fear of having been followed is never confirmed or denied anywhere.
- Conditional entries display only after their trigger actually occurs.

### 4. Triggers the conditional entries assume
**Narrative intent (what must be true before the line shows):**
| Trigger label | Meaning |
|---|---|
| `arrival` | this citizen has ascended |
| `arrival+cit-X present` | as above, and cit-X already resident |
| `home:any` / `home:burrow` / `home:apartment` | moved into that housing |
| `job:farm` / `job:yard-or-storehouse` / `job:farm-or-food` | assigned to that station at least once |
| `production:first-food` | this citizen's station has produced food |
| `cohabit-or-neighbor:cit-X` | shares a building with cit-X, or lives in an adjacent one |
| `reunion:cit-X` | both resident; fires once |
| `celebration:shared-meal` / `celebration:first-song` | that celebration has run with this citizen present |
| `favor:claw-earned` | the Claw vote is earned |
| `community-care:first-season` | child resident for a sustained period |
| `milestone:circuit-walked`, `milestone:new-fire`, `milestone:hand-name`, `milestone:otherworld-arrival` | **no system exists**; reserved text, do not display |

**Proposed mechanics (Codex decides; none required for batch 01):**
- Today's runtime events `arrival`, `home`(type), `refuge` already cover 9 of the 24 entries. Station assignment is derivable from `societyStationResident`.
- An authored-identity assignment is needed: which rescue becomes which cit-ID. Narrative preference only: the nineteen captives arrive before any cit-020+ citizen, and cit-002 never arrives before cit-001 *if avoidable* (her arrival entry assumes it; it has a fallback: omit the line).
- A walkable circuit landmark and a hearth landmark would give NP-02 and NP-05 their payoffs. Parked until Tony rules on settled vs mobile.

### 5. Makko art requests (for Cursor; blocked on Tony approving the profiles)
| ID | Base reference | Distinguishing proposal |
|---|---|---|
| cit-001 | elder | knotted walking-cord worn as a sash, one knot per verse she added (eleven large knots); leans on nothing |
| cit-002 | child | beetle-case necklace; one front tooth missing |
| cit-003 | cook | empty clay coal-pot on a chest sling, ash-grey forearms |
| cit-004 | lantern | shuttered lantern carried backwards over the shoulder; tail never still |
| cit-005 | merchant | debt-cord looped at the belt, mismatched outsider buttons |
| cit-006 | farmer | hand-auger on the hip; small cut-pattern motif (three short, one long) usable as a prop mark |
| dia-cell-r1 | — | no new illustration requested |

### 6. Open questions and unapproved drafts
- **Q1 (asked):** who the burning Ratkin are / what the burning town is (X-02, X-03). Blocks cit-020+, all reunions, `home` rewrite.
- Queued: X-04 jailer vs Warden; NP-03 children among the nineteen; NP-02 naming system; community name; who opened the cell door; tribe size.
- Everything in §2 is unapproved.
- vovinam-ledger unread (X-01): no cross-game verification done.

### 7. Files and commit
- docs/NARRATIVE_HANDOFF.md
- docs/narrative/BIBLE.md
- docs/narrative/CAST_REGISTRY.md
- docs/narrative/DIARY_REVISION.md
- Commit: see `git log claude/narrative-batch-01 -1`. **Not pushed**: this environment has no GitHub credentials. Delivered as `narrative-batch-01.patch` (apply with `git am`). No runtime files touched.
