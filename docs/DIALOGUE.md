# Dialogue and diary delivery

Tony's direction, September 15: present events belong in Final Fantasy-style bottom-screen text boxes with simple Makko talking/emotional portraits. Past revelations belong mostly in the optional diary. Duy arrives in an ongoing emergency; the world does not wait for him to understand.

The runtime keeps the jailer and Arbiter as **Khet-Tak-Tor**, while **Keith** is the hostile arcade antagonist. Khet explains the covenant, heat, venting and rescue work, then administers and announces the rebuilt Ratkin community's collective verdict; he cannot personally forgive Duy's debt. Keith feeds the fire, sends pressure into ordinary runs and fights to keep the Ratkin trapped. The Hearth, Bowl, Hand, Claw and Memory judge Duy. The Shrine clearly states that four votes release him and a fifth improves the reward rather than withholding freedom. The final five-line verdict confirms the community's decision, ends the fire's authority over Duy and points him back toward Cuong and Diep. Existing Makko actor data remains under the compatibility key `keith`; dedicated Khet and Keith emotional portraits remain under issue #39.

## Current runtime

- A single brief arrival line, with movement, dash and vent available immediately.
- A first calm/cinder ascension has its own short exchange explaining that carried heat can free someone who is not burning. It does not trigger the painful fire-absorption exchange.
- Rescue, carried heat and completed vent units trigger short exchanges about something the player has witnessed. An event expires after six seconds rather than joining a queue of stale explanations.
- At most two story exchanges per run. Each has two short lines, auto-typed with a reading hold. Sixteen seconds of silence follow an exchange. One optional Khet-Tak-Tor or Keith combat reaction per run shares the same box and cannot interrupt an exchange.
- Death/return, Khet-Tak-Tor's role, Keith's hostility, ratkin judgment and the rebuild obligation unfold on separate later runs. Return explanations have a short opening window; the ratkin/freedom exchange requires at least four completed runs, rebuilding six plus sixteen lifetime rescues. These are initial pacing values for playtesting.
- The street continues during all dialogue. No dismiss button shares the vent input. On touch devices the box sits above the vent target and dash indicators. Ordinary tactical HUD labels remain near gameplay; they are not character speech.
- Diary → Conversations repeats only lines already delivered. Speech history and completed exchanges survive reloads without altering purchases, read flags or chapter unlocks. Interrupted exchanges can be encountered again; no lore backlog follows death.
- Completing the five restoration terms summons a separate three-line first judgment. Khet-Tak-Tor acknowledges what Duy rebuilt, Duy asks for release, and Khet explains that Ratkin favor remains undecided. The scene reuses the current verified Makko portraits until Cursor's dedicated performances are ready; only reached lines enter Conversations.
- Fifteen optional diary chapters retain their identities, unlock rules and art assignments. Fourteen chapters were rewritten for orientation and cause/effect; the approved painful-heat/ascending-ratkin scene is preserved. Mei's motive is revealed at her confession, not at the stabbing. No new explanation for Duy's separate five-life debt is invented.

## Makko portrait handoff — Cursor art lane

Status: **first stern Arbiter talking portrait integrated in 2026-09-16-ascension-1; other expressions and Duy portraits pending.** Runtime uses the authored stern portrait during matching lines, with an existing Makko Duy crop and static Arbiter fallback for expressions not yet supplied. Source details are in arbiter-portrait-manifest.json. The Arbiter full-body design is integrated. The expanded emotion set is specified in [CURSOR_ART_BRIEF.md](CURSOR_ART_BRIEF.md). The old simulated portrait bob is removed. Do not call those crops talking or emotional animations.

Use the established Duy reference and Khet-Tak-Tor's Tony-approved Ratkin reference, not Cuong's Sunday-morning sprite or the deprecated human Keith reference. FWOOSH collection: https://www.makko.ai/studio/collection/f9872b5e-a186-43d7-9888-46cf3e575277. Preserve raw sources and record actual Makko asset links and export settings. Tony must approve Khet-Tak-Tor's visual reference before the portrait set is integrated.

| Atlas key | Performance |
|---|---|
| dialogue_duy_pain | Teeth clenched, brow tight, strained speech; accumulating heat hurts internally. |
| dialogue_duy_startled | Startled recognition and a short question; not comic panic. |
| dialogue_duy_questioning | Alert, searching expression; speaks while catching his breath. |
| dialogue_duy_concerned | Concern for the ratkin; tired but attentive. |
| dialogue_arbiter_stern | Economical, impatient speech; no comforting smile. |
| dialogue_arbiter_dry | Small, dry reaction; restrained mouth and eyebrow movement. |
| dialogue_arbiter_strained | Brief flinch, then regains control and speaks. |

Prompt template: “Use this exact Fwoosh character reference and preserve the face, hair, clothes and established pixel-art style. Square head-and-shoulders dialogue portrait, three-quarter view facing into the text. [Performance from table.] Very simple looping speech: closed mouth, two small open-mouth shapes, a blink and restrained eyebrows. Locked camera, fixed scale and silhouette, no walking, no zoom, no text or interface. Solid flat [red/green/blue absent from the character palette] chroma background, uniformly lit, no colored spill.”

Save through Makko's normal background-removal/export flow. If removal contaminates the character, remake against a different primary-color chroma background; do not accept a green-tinted face. Inspect the actual saved transparent export, not just the generation preview.

Runtime contract: a horizontal PNG atlas in `media/anim/`, square cells at least 128×128; frame 0 is the closed-mouth listening pose, frames 1..N the speech loop at 8fps. Add the exact key to `MAKKO_ANIM_SRC` in `js/media.js` and `{frames,fw,fh}` to `MAKKO_ANIM` in `js/media-meta.js`. The renderer chooses the key from the line's speaker/emotion, loops speaking frames during typing, and rests at frame 0 while the player reads. Keep facial proportions fixed between cells. Add sources to ART.md. Validate all seven keys, alpha edges, clipped hair, phone readability and listening/talking transitions before integration. Preserve compatibility aliases for the old `keith` asset/save identifiers until the migration is verified.

No other art generator, stock portrait, procedural mouth drawing or recolored substitute is authorized. Codex owns prose, pacing, renderer, history and release; Cursor keeps Makko portrait production. Merge scoped media/metadata changes rather than replacing the new runtime with an older copy.
