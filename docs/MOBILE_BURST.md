# Mobile steering and Burst

Build: `2026-09-17-joystick-1`. Replaces release-to-dash touch gestures. Tony approved the floating joystick anywhere except Vent and a second-finger tap for Burst.

## Player contract

- Touch anywhere on the gameplay canvas except Vent: the joystick appears under that finger, on either side, including HUD docks and gutters. Menus retain their normal touch actions.
- Drag to steer continuously. Manual direction overrides auto-targeting. Duy keeps running; the small dead zone holds the last heading rather than stopping him.
- The center follows long drags so a reversal never requires returning to a distant original touch point. Radius is 36 CSS pixels and dead zone 6 CSS pixels, independent of game/world scaling.
- While the steering finger remains down, tap elsewhere with another finger to Burst immediately in the steering direction. The second tap's location never chooses a target or direction. A held second finger does not repeat Burst, and lifting either finger never triggers another.
- Vent is the exception: touching it holds Vent, regardless of whether steering already has a finger. Releasing it completes the existing committed unit; Burst cannot bypass that commitment and queues at its boundary as before.
- Lift the steering finger to hide the joystick and resume existing gradual auto-run steering. Another already-held finger is not promoted into steering.
- Charges, recharge, cooldowns, dash distance and combat balance are unchanged. A failed Burst during cooldown/empty charges does not fire later on finger release.
- Desktop mouse retains slingshot/release aiming; keyboard movement and Shift are unchanged. Stable save2 keys remain unchanged.

The stick uses existing Makko ember artwork for its handle with functional base/connector indicators. The Makko flame arrow previews the steering direction and collision-limited Burst endpoint. It dims while unavailable, including during a committed vent unit. Independent pointer ownership lets steering, Vent and Burst coexist. Pointer cancellation, lost capture, blur, resize and run/menu transitions clear ownership.

## Design research

This is a design hypothesis for Fwoosh, not evidence of physical-phone usability. The prior touch gesture only aimed a brief dash; auto-steering continued around it. Continuous steering addresses that loss of control.

- [Suzy Cube developer: floating and draggable centers](https://www.gamedeveloper.com/design/lessons-from-suzy-cube-mobile-controls-that-feel-great)
- [Apple: dynamic thumbsticks, tap-to-move and simultaneous actions](https://developer.apple.com/videos/play/wwdc2024/10085/)
- [Nintendo: tap timing with constrained automatic forward movement](https://supermariorun.com/en/)

## Verification

198 actual-script gameplay/save/render checks and 77 asset checks pass. Coverage includes all eight directions at three phone widths, physical stick radius, fast reversal, manual-over-auto steering, independent Vent, second-finger Burst direction/timing, duplicate/third-pointer isolation, charge/cooldown limits, vent commitment, release order and cancellation. The 390px browser fixture exercised dispatched touch events and showed the Makko joystick handle and flame preview. A browser MutationObserver error was logged; no MutationObserver exists in game source and the fixture's interaction assertions passed. Browser dispatch is not a real multi-touch phone test. Tony's phone playtest remains the feel/readability acceptance step.

Deployment evidence belongs on issue #26 and the board; a local/pushed build is not a verified deployment.
