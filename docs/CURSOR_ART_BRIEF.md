Work on Fwoosh's missing Makko art while Codex integrates the existing assets and handles releases.

Start by fetching origin and reading current main's AGENTS.md and docs/CANON.md, DIALOGUE.md, ROADMAP.md, COORDINATION.md, and STATUS.md. Preserve your existing uncommitted work; use an isolated branch/worktree if your checkout is occupied. Do not overwrite Codex's runtime changes or deploy.

All artwork MUST come from Makko. Collection:
https://www.makko.ai/studio/collection/f9872b5e-a186-43d7-9888-46cf3e575277

Inventory before generating. We already have extensive Ratkin full-body animation sets (Arbiter, vest villager, farmer, mason, wellkeeper, herbalist, cook, baker, weaver, lantern bearer, merchant, elder, child), plus Ratkin village/town/city/civilization backgrounds and an Arbiter courtroom illustration. Codex is integrating these. Do not regenerate finished locomotion or generic attack/jump/death sets. Finish/preserve any in-progress work and report it.

PRIORITY 1 â€” DEDICATED DIALOGUE PORTRAITS

Khet-Tak-Tor is the Ratkin Arbiter, never human Keith. Match the existing Makko arbiter reference: same face, ears, crest, robe, collar and palette. He administers the Ratkin community's verdict; he cannot personally forgive Duy's debt.

Make square head-and-shoulders emotion portraits designed for small dialogue boxes, not crops animated from full-body combat poses. First deliver one stern portrait animation as a review sample, then complete this set:
- dialogue_arbiter_stern: controlled authority, impatient but economical speech.
- dialogue_arbiter_dry: restrained, unimpressed reaction; no broad comedy.
- dialogue_arbiter_strained: brief pain/flinch, then regained control.
- dialogue_arbiter_angry: contained accusation, not constant rage.
- dialogue_arbiter_conflicted: grief and uncertainty briefly showing through duty.
- dialogue_arbiter_respect: solemn recognition of the rebuilt community's decision; not cheerful personal absolution.

Using the established DUY reference (not Cuong), also make:
- dialogue_duy_pain: internally burning, clenched teeth, strained speech.
- dialogue_duy_startled: abrupt recognition, a short question.
- dialogue_duy_questioning: alert and searching, catching his breath.
- dialogue_duy_concerned: exhausted but attentive to others.
- dialogue_duy_relieved: quiet relief for the ending.

Portrait export contract: 256x256 square cells; fixed camera, face scale and eye line; room for ears/hair; transparent background. Frame 0 is a closed-mouth listening pose. Remaining frames form a restrained 4â€“6-frame speaking loop suitable for 8fps, with occasional blinking. No bouncing, zooming, text, UI or lighting/color drift. Preserve actual frame durations/counts. Bake and save through Makko's normal Remove Background flow; keep raw exports and metadata. Horizontal PNG atlas preferred; a documented grid is acceptable for Codex to recut. Inspect at actual small display sizes (roughly 48â€“96 screen pixels), not only enlarged.

Use flat red, green or blue chroma absent from the character palette. If stripping damages colors, remake with another chroma color. Inspect the SAVED transparent export; a green source thumbnail alone does not mean removal failed. If a save seems stalled, first verify whether its named Game Asset or sprite-sheet export already exists before resubmitting. Do not spend credits repeatedly on blind retries.

PRIORITY 2 â€” VILLAGE WORK, NOT MORE COMBAT

Reuse the existing farmer and mason references. Make coherent work cycles: farmer tending/harvesting mushrooms; mason salvaging/working materials. Add actual food/material carrying, pickup and drop-off if not already present. Keep cargo consistent with the job. The wellkeeper's buckets are water, not generic building materials. Work cycles need clear start/loop/finish frames and matching scale/feet anchors. Codex controls simulation timing and integration.

PRIORITY 3 â€” PLACEABLE STRUCTURES AND STATIONS

Check existing concepts/exports first. We need separate Ratkin Burrow, Salvage Yard, Mushroom Farm and Storehouse sprites, matching the game's camera and style, with consistent footprint/anchor and construction, completed-unsealed and sealed states. Include an appropriate farm bed/workbench and clearly recognizable food/material cargo. The player places buildings and roads freely: do not bake a fixed city layout into these sprites. Sealing is ember magic; no procedural placeholder art. Make one building/state set for review before expanding the batch.

PRIORITY 4 â€” UI / STORY GAPS

Distinct Well, Diary and Judgment card art; five bloc portraits (Weaver/Hearth, Cook/Bowl, Mason/Hand, Lantern bearer/Claw, Elder/Memory) with neutral, withholding and supportive expressions. These are visual representatives, not newly named canon characters. No speech loops unless dialogue is assigned. Audit existing concepts against the current 15 diary chapters before making missing illustrations. Coordinate scene briefs before adding new lore or spoilers.

HANDOFF EACH COMPLETED BATCH

Provide Makko source/animation/export URLs; original files; stable names; frame count, dimensions, grid order, durations/fps, orientation and feet/face anchors; transparency QA; a contact sheet or preview; and approval status. Save a machine-readable manifest and a brief handoff document on your own branch, with exact commit and paths. Keep assets/provenance separate from story, balance, saves, runtime code and deployment. Do not claim 'live' just because an asset is saved in Makko. Codex will integrate, test and publish.
