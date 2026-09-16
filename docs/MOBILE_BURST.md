# Direct-touch mobile Burst

Build `2026-09-15-burst-1` replaces the mixed tap/swipe dash with one predictable arena gesture.

## Player contract

- Touch anywhere inside the arena to aim from Duy toward that world point.
- A quick tap releases immediately and performs the Burst.
- Holding or dragging previews the fixed-distance path and collision-limited endpoint. Crossing a distance threshold never commits the action.
- Release performs one Burst and spends one charge.
- Drag or release within 42 world pixels of Duy's touch-down position to cancel without spending.
- HUD, dialogue, gutters and the separate Vent button cannot start a Burst.

The direction is calculated from Duy's position at touch-down rather than his later autorun position. This preserves the player's intended vector while the simulation continues. The preview starts at Duy's current rendered position and updates its obstacle-limited endpoint until release.

## Design basis

Apple's game-control guidance favors predictable movement, broad touch regions and immediate visible control state. Its touch-game session recommends designing around touch rather than copying a controller layout. EA's published mobile-shooter experiments show that reducing control complexity works best when the player can see what an assisted system selected. Fwoosh therefore uses the arena itself as the broad aim region and shows the path before commitment; it does not introduce a hidden target lock or permanent Burst button.

- https://developer.apple.com/design/human-interface-guidelines/game-controls
- https://developer.apple.com/videos/play/wwdc2024/10085/
- https://www.ea.com/news/what-weve-learned-about-making-mobile-shooters-so-far
- https://www.gamedeveloper.com/business/postmortem-shadow-blade

## Verification

The actual-script suite covers release-only spending, direction changes during a drag, touch-down anchoring while Duy moves, near-Duy cancellation, second-finger isolation, Vent release, pointer cancellation, focus loss, resize, dock/gutter exclusion and world/screen mapping at 320, 375, 430 and 1280 pixel widths. The full gameplay, progression, city and save suite remains in the same run.

A local browser fixture verifies the dashed trajectory and chevron at phone scale with the Vent button and charge row visible. Physical-phone responsiveness and comfort remain a human playtest requirement.
