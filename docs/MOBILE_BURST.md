# Slingshot Burst input

Build `2026-09-15-slingshot-1` gives touch and desktop mouse the same predictable Burst gesture.

## Player contract

- Point, hold or drag on the side opposite the direction Duy should travel.
- A quick tap releases immediately and Bursts away from that point.
- Holding or dragging previews the actual fixed-distance path and collision-limited endpoint.
- Release performs one Burst and spends one charge.
- Return within 42 world pixels of Duy's pointer-down position to cancel without spending.
- HUD, dialogue, gutters and the separate Vent button cannot start a Burst.
- Desktop WASD/arrow steering and Shift Burst remain unchanged.

The pull vector is anchored to Duy's position at pointer-down, so autorun cannot skew the player's aim while the preview is held. The trajectory points in the resulting travel direction on both touchscreens and desktop mouse input.

## Design basis

Apple's game-control guidance favors predictable movement, broad touch regions and immediate visible control state. Its touch-game session recommends designing around touch rather than copying a controller layout. EA's published mobile-shooter experiments show that reducing control complexity works best when the player can see what an assisted system selected. Fwoosh therefore uses the arena as the broad aim region, inverts the player's pull like a slingshot and shows the result before commitment. It adds no permanent Burst button or hidden target lock.

- https://developer.apple.com/design/human-interface-guidelines/game-controls
- https://developer.apple.com/videos/play/wwdc2024/10085/
- https://www.ea.com/news/what-weve-learned-about-making-mobile-shooters-so-far
- https://www.gamedeveloper.com/business/postmortem-shadow-blade

## Verification

The actual-script suite covers inverted direction at phone and desktop widths, release-only spending, direction changes during a drag, pointer-down anchoring while Duy moves, near-Duy cancellation, second-finger isolation, desktop mouse preview, Vent release, pointer cancellation, focus loss, resize, dock/gutter exclusion and world/screen mapping at 320, 375, 430 and 1280 pixel widths. The full gameplay, progression, city and save suite remains in the same run.

A local browser fixture verifies that pulling down-right previews travel up-left at phone scale. Physical-phone and desktop-mouse feel remain human playtest requirements.
