# Vent risk: first playtest release

Tony approved implementation after the core-loop interview. City expansion is deferred while the existing arcade loop and meta are polished. This is the first improvement package; the requested ten-improvement list is still in interview, not ten completed tasks.

## Confirmed behavior

- Venting puts both Duy and the ratkin at risk.
- Starting a unit commits Duy until one heat is dispersed or one full heart is restored. Heat clears before healing begins.
- Holding automatically starts the next unit. Releasing completes the current unit and stops. A dash requested while committed is queued for the boundary, with its charge spent only when executed.
- Every completed unit releases one demon. There is no extra timer-based escalation or silent population cap that makes later units free.
- Vent demons persist until defeated or until they consume a cinder person and explode. They prefer nearby cinder people, otherwise chase Duy.
- Cinder people map to existing stationary husks. Eating has a visible warning; dashing through the demon or rekindling the husk interrupts it. One husk cannot be consumed twice.
- The explosion consumes both bodies, ignites nearby unsaved villagers and damages nearby Duy. Saved villagers are protected. Existing hit immunity prevents overlapping explosions from instantly stacking damage.

## Initial tuning, subject to Tony's playtest

| Parameter | Initial value |
|---|---:|
| Heat-unit commitment | 0.40 seconds |
| Full-heart commitment | 0.60 seconds |
| Newly released demon emergence | 0.45 seconds before it can attack or eat |
| Cinder search range | 320 world pixels |
| Eating warning | 0.65 seconds |
| Blast radius | 120 world pixels |
| Player blast damage | One heart |

A final fractional heat amount or missing fraction of a heart takes one normal unit, caps at zero heat/full health and still releases one demon. At no heat and full health, holding does not lock Duy or generate demons. Losing input focus stops chaining and clears queued dashes; the current unit still completes. New runs clear all transient threats. Vent demons survive the transition to Keith; existing town-wraith and Keith-summon behavior remains separate.

Straight threat tethers and compact progress bars explain demon targets and interruption timing without drawn charge, countdown or blast-radius circles. Actor and blast images reuse existing Makko sprites/flames. No new art source is introduced. Save schema and existing progress are preserved.

## Next interview topics

Ember earning, reward incentives, upgrade effects, prices and purchase pacing remain to tune. Existing monster-kill rewards are unchanged in this release, including rewards for vent-created demons; possible farming incentives need a deliberate economy decision. Passive recovery and its upgrade also remain unchanged. Assess persistent-swarm performance and difficulty through full human runs before adding more systems.

Publish each verified major change. Record deployment confirmation in issue #1 rather than treating a pushed branch as live.

## Subsequent economy update

2026-09-14-economy-1 supersedes the reward note above: vent-created demon kills now pay zero embers; other demon sources keep their existing reward. Heat return and Edge effects remain. See ECONOMY_TUNING.md for starter upgrades and outstanding economy tuning.
