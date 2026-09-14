# Combat roadmap — reconciled 2026-09-14

Earlier local proposal preserved in docs/archive/COMBAT_ROADMAP-proposal.md. Evidence: main d7945b4 and captured local refactor. Implemented does not mean balance/visual approval.

| Area | Status / correction |
|---|---|
| Vent + demons + chain rescues | Implemented. Half-heart interval 0.30s; cap max(2, round(2 × current hearts)), replacing the old flat six ceiling. |
| Resolve / rescue advantage | Implemented differently as Edge. Do not introduce a second currency. |
| Leveled Keith + allies | Implemented: charge, spit, wake, demon call, siphon. Base required heat 8/10/12/14/16 before Edge. |
| Arson interception | Implemented. Draft alternating direct-torch behavior is not assumed complete. |
| Husks/wraiths/rekindling/demon rewards | Implemented; replaces the permanent-wall core loop. |
| Five districts + rewards | Implemented; final completion needs issue #4. |
| Prop collision pass | Committed; recheck against new animation silhouettes. |
| Fire vent recut | Committed; cinder fix belongs to Cursor. |
| Full run cycles / extra VFX / audio | Pending; prototype then approved expansion. |

## Order

1. Cursor finishes modular refactor with behavior parity.
2. Codex completes audit and implements #4–#6 after runtime handoff.
3. Cursor fixes cinder and prototypes ratkin locomotion (#3).
4. Playtest five districts, upgraded builds, telegraphs, healing and dash escape.

Keep heat/vent risk-reward, bounded attack concurrency and no screen shake. Cool Blood still boosts clear-of-fire regeneration; repurposing it for vent healing is a proposal requiring a balance decision.
