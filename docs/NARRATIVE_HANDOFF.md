# Codex narrative handoff

Newest batch first. Earlier batches are never edited except to mark items superseded.

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
