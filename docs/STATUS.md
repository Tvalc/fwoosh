# Fwoosh status — 2026-09-14

Evidence: Cursor commits through `317963f` combined with Codex fixes. Implemented means present in source; release and human balance approval remain separate.

## Implemented

- Absorber loop, persistent heat, person/fire/cinder presentation, auto-run, rechargeable steering dashes.
- Held vent: purge heat, then heal half a heart every 0.30 seconds; demon pressure scales with current hearts.
- Chain rescues, interceptable arson imps, husks, rekindling, wraiths, demon-kill rewards, solid props.
- Edge: rescues/intercepts help and losses hurt; duel heat-dump progress changes accordingly. This supersedes the draft Resolve mechanic.
- Five districts: Market Row, Rowhouses, Old Mill, Chapel, Keith's House. Rescue quotas 12/14/16/18/20. Keith gains charge, spit, wake, demon call and siphon cumulatively.
- Allies, scaled bounties, persistent district unlocks and replay selection.
- Ashford hub, Well at 6 saves, Forge at 16, health/regen/dash/recharge shops, run-end summary.
- Shrine, 15-chapter Duy diary and read/unlock state. Three chapters assign artwork.
- CrazyGames lifecycle hooks. Ad/revive/purchase flows are not implemented by those hooks.

## First batch

Cursor: modular refactor, cinder recut and ratkin prototype committed. Tony reviews the prototype before cast expansion.

Codex: final completion persistence, simultaneous building unlocks and defensive run settlement implemented in an independent branch. Integrated against Cursor refactor 435d0fb: 29 state checks and 11 asset checks pass. Backup tool: 5 checks pass; 236 files including 182 raw art sources captured and fully restored. Issues #4–#6 remain open pending integration.

## Pending decisions

1. Duy's death/debt/sentence versus the older intro's 'you beat Keith, left town, became famous'. Neither has been silently rewritten.
2. Nineteen-life debt and the Door versus five-district completion. Shrine says the debt is settled but the sentence is not; diary wording promises a door after nineteen. Reconcile deliberately.
3. Ratkin run style approval before producing the cast.
4. Destination/access model for off-device source-art backup. The verified local archive is not cloud backup.

## Metadata

The development branch HTML description now describes rescue, carried fire and five districts. This changes discoverability copy without choosing story canon. Old prototype comments remain in runtime files and should be refreshed when their owners can do so safely.

No external publishing dashboard or separate tracker was audited. GitHub issues are the shared backlog established here.

## Latest verification

38 state/input checks and 12 asset checks pass on the combined build including Cursor 317963f. Fixed interrupted-input dashes and post-victory reward mutation. A 47-file package was extracted and browser-checked. Remaining release gates: human balance playthrough, physical-phone inputs, ratkin approval and review of the combined branch. See AUDIT.md.
