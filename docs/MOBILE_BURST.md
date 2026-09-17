# Mobile steering and Burst

Build: `2026-09-17-release-1`. Tony approved continuous floating-joystick steering followed by a Burst when that same finger lifts. This supersedes second-finger Burst; the joystick still appears anywhere except Vent.

## Player contract

- Touch anywhere on the gameplay canvas except Vent: the joystick appears under that finger, on either side, including HUD docks and gutters. Menus retain their normal touch actions.
- Drag to steer continuously. Manual direction overrides auto-targeting. Duy keeps running; the small dead zone holds the last heading rather than stopping him.
- The center follows long drags so a reversal never requires returning to a distant original touch point. Radius is 36 CSS pixels and dead zone 6 CSS pixels, independent of game/world scaling.
- Drag to steer, then release that same finger to Burst once in the final steering direction. A tap or jitter inside the 6 CSS-pixel dead zone does not spend a charge. Extra fingers cannot trigger Burst or take over steering; Vent retains its separate touch.
- Vent is the exception: touching it holds Vent, regardless of whether steering already has a finger. Releasing it completes the existing committed unit; Burst cannot bypass that commitment and queues at its boundary as before.
- Lifting hides the joystick. After the Burst, existing gradual auto-run steering resumes. Another already-held finger is not promoted into steering.
- Charges, recharge, cooldowns, dash distance and combat balance are unchanged. A release during cooldown/empty charges yields to auto-run without a delayed retry.
- Desktop mouse retains slingshot/release aiming; keyboard movement and Shift are unchanged. Stable save2 keys remain unchanged.

The stick uses existing Makko ember artwork for its handle with functional base/connector indicators. The Makko flame arrow previews the steering direction and collision-limited Burst endpoint. It dims while unavailable, including during a committed vent unit. Independent pointer ownership lets steering and Vent coexist. Pointer cancellation, lost capture, blur, resize and run/menu transitions clear ownership.

## Design research

This is a design hypothesis for Fwoosh, not evidence of physical-phone usability. The prior touch gesture only aimed a brief dash; auto-steering continued around it. Continuous steering addresses that loss of control.

- [Suzy Cube developer: floating and draggable centers](https://www.gamedeveloper.com/design/lessons-from-suzy-cube-mobile-controls-that-feel-great)
- [Apple: dynamic thumbsticks, tap-to-move and simultaneous actions](https://developer.apple.com/videos/play/wwdc2024/10085/)
- [Nintendo: tap timing with constrained automatic forward movement](https://supermariorun.com/en/)

## Verification

198 actual-script gameplay/save/render checks and 77 asset checks pass. Coverage includes all eight directions at three phone widths, trailing-center reversal, manual-over-auto steering, independent Vent, release-only Burst, tap/jitter suppression, extra-finger isolation, charge/cooldown limits, vent commitment, final release coordinates and cancellation. The 390px browser fixture verifies continuous steering, ignored second-finger taps and one Burst on steering release in the previewed direction. Browser dispatch is not a physical-phone test; Tony's playtest remains the feel/readability acceptance step.

Deployment evidence belongs on issue #26 and the board; a local/pushed build is not a verified deployment.
