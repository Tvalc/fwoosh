# Combat roadmap — reconciled 2026-09-14

Earlier local proposal preserved in docs/archive/COMBAT_ROADMAP-proposal.md. Evidence: main d7945b4 and captured local refactor. Implemented does not mean balance/visual approval.

| Area | Status / correction |
|---|---|
| Vent + demons + chain rescues | Implemented. Half-heart interval 0.30s; cap max(2, round(2 × current hearts)), replacing the old flat six ceiling. |
| Resolve / rescue advantage | Implemented differently as Edge. Do not introduce a second currency. |
| Leveled Keith + allies | Implemented: charge, spit, wake, demon call, siphon. Base required heat 8/10/12/14/16 before Edge. |
| Arson interception | Implemented. Draft alternating direct-torch behavior is not assumed complete. |
| Husks/wraiths/rekindling/demon rewards | Implemented; replaces the permanent-wall core loop. |
| Five districts + rewards | Implemented; final completion #4 fixed on Codex review branch. |
| Prop collision pass | Committed; recheck against new animation silhouettes. |
| Fire vent recut | Fire and cinder fixes committed by Cursor; cinder 358da15 included in combined checks. |
| Full run cycles / extra VFX / audio | Pending; prototype then approved expansion. |

## Order

1. Completed: Cursor modular refactor, cinder recut and ratkin prototype (317963f).
2. Completed on Codex review branch: progression/save fixes, canceled-input fixes and final-frame reward consistency.
3. Combined build passes 38 state/input checks and 12 asset checks; packaged browser smoke completed.
4. Next: human balance playthrough and physical-phone testing; Tony reviews ratkin before cast expansion. Independent lanes continue in parallel.

Keep heat/vent risk-reward, bounded attack concurrency and no screen shake. Cool Blood still boosts clear-of-fire regeneration; repurposing it for vent healing is a proposal requiring a balance decision.

## Correction after Cursor 2d9316c

The non-Makko ratkin prototype is removed and the original Makko cinder sheet restored. Earlier completion claims for those two art tasks are superseded. New Makko locomotion and cinder visual correction remain open. Tony authorized deployment of the integrated reliability/refactor release for live testing.
