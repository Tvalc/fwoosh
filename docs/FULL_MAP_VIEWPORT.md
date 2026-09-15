# Full-map viewport correction

## Full map viewport — 2026-09-15-full-map-1

Supersedes hud-safe-1, which incorrectly removed 32.8% of vertical travel. Original simulation, spawn distribution, opponent target mapping and obstacle coordinates are restored exactly from the pre-regression dialogue build. The complete world now renders with a single uniform transform between a compact header and a stable bottom dialogue/control dock. Pointer taps invert that transform; dock and gutter touches cannot spend dash charges. Device safe-area insets affect screen fit only. Small visual overhang accommodates bodies at the original walls; oversized decorative flames may clip.

97 actual-script state/input checks pass, including original upper route access, full-map corners, screen/world mapping at 320/375/430/1280px and resize cancellation. Local browser fixtures checked normal play, rescue feedback, longest present dialogue, maximum cinder vent pop and Keith at the upper wall at 320/375/430px; an actual browser tap used the correct transformed heading. No console warnings/errors observed. These checks are not human balance testing or physical-device testing. The map is uniformly displayed at 70.2% of its former canvas scale to fit the full arena and separated docks; smaller actors are the key playtest tradeoff. No new artwork, narrative, save migration or economy changes. See FULL_MAP_VIEWPORT.md and issue #1 for release verification.

## Layout and research

The logical world stays 720 × 1280. Player travel returns to y=40..1240. Screen header: y=0..128; bottom dock: y=1100..1280. The remaining rectangle fits the whole world plus 80 units of top and 24 units of bottom visual overhang. Background, colliders, actors and telegraphs share the transform. The overhang changes only framing, never collision bounds. Menus and results retain screen coordinates. Swipe thresholds remain in screen units; tap aims use inverse world coordinates. Resizing cancels incomplete gestures.

Sources informing the architecture: [Apple: Design advanced games](https://developer.apple.com/videos/play/wwdc2024/10085/) distinguishes UI safe areas from whole-game margins; [Phaser cameras](https://docs.phaser.io/phaser/concepts/cameras) documents viewport/world coordinate separation; [Xbox text guidelines](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/101) motivates rendered-size inspection. Exact dock heights are our design choice, not a source prescription.

Dialogue remains optional, present-focused, live and bottom-screen. Its dock stays fixed even without dialogue. Static Makko portraits remain until Cursor supplies the dedicated talking clips. Full-map visibility is prioritized over a scrolling camera that would hide rescue threats. Human phone playtesting should judge character recognition and dialogue readability, especially at 320px.
