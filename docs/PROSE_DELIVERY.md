# Prose delivery — 2026-09-15-prose-2

Tony approved a clearer revision of The Town on Fire after finding prose-1 too cryptic. This release replaces that chapter and teaser only, with five manually advanced pages. The scene describes painful heat absorption, increasing pain as heat accumulates, and rescued ratkin ascending into light. Their destination remains unspecified. No movement penalty or new damage mechanic is implied by Duy's physical reactions.

## Where players encounter it

- Town hub → The Diary → The Town on Fire. The existing unlock is 27 total rescues (META.saved), across runs. Existing read flags remain; already-read players can reopen the chapter. No forced replay or reward for reading.
- Existing Makko illustration duy_save accompanies the pages. Tap the arrows or bottom center to advance; the last page returns to the chapter list.
- The full scene is optional first-person narration, including remembered conversation. It is not an automatic opening cutscene and has no recorded voice acting.
- Keith's existing seven opening text lines type into the lower-third dialogue box during live gameplay. They advance automatically; movement, dash and vent remain available. This release preserves INTRO_VERSION 4 and does not force a replay.
- Later Keith text observations use the existing eligible-run timer (8.5 seconds when no competing callout); saved lore progress is preserved. This release does not replace those lines.

## Validation and remaining work

Approved draft matches runtime chapter word-for-word, allowing pagination whitespace. Other fourteen chapters, all chapter identities/art/unlocks/hints, opening/lore and intro version are unchanged. Browser measurement with Pixelify loaded covers all 77 diary pages: maximum baseline 980, above navigation below 1160. The longest revised page fits a 320px preview; no console errors. See reports/prose-clarity.json. Existing gameplay/save/input audit passes 81/81.

The remaining diary chapters and automatic dialogue still need the same clarity pass. This release does not claim a full second rewrite. Live deployment evidence is recorded in issue #1.
