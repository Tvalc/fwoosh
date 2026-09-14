# Fwoosh status — 2026-09-14

Evidence: main `d7945b4` and the local modular snapshot captured at 18:06 UTC. Implemented means present in source, not fully playtested. The refactor is separate from this documentation branch.

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

Cursor: finish modular packaging, fix cinder vent, show Tony one ratkin run prototype.

Codex: records, recovery/inventory, state audit; confirmed progression fixes after refactor handoff. Issues #4–#6 distinguish two confirmed progression defects from a defensive settlement finding.

## Pending decisions

1. Duy's death/debt/sentence versus the older intro's 'you beat Keith, left town, became famous'. Neither has been silently rewritten.
2. Nineteen-life debt and the Door versus five-district completion. Shrine says the debt is settled but the sentence is not; diary wording promises a door after nineteen. Reconcile deliberately.
3. Ratkin run style approval before producing the cast.
4. Destination/access model for off-device source-art backup. The verified local archive is not cloud backup.

## Metadata queued

The HTML description still describes spreading fire. Proposed canon-neutral copy: 'Rescue Ashford's villagers, carry their fire, and face Keith across five districts.' Integrate through Cursor after its refactor checkpoint or hand over the header to Codex. Old prototype comments remain in runtime files and should be refreshed when their owners can do so safely.

No external publishing dashboard or separate tracker was audited. GitHub issues are the shared backlog established here.
