# Fwoosh typography

## Sharper UI typography — 2026-09-15-type-1

Tony requested a sharper, more legible font in the same visual family. Compared Pixelify, Chakra Petch and Oxanium at phone text sizes; selected Chakra Petch Medium/Bold for its squared forms and clearer numerals. HUD, dialogue, diary, shops and counters now use Chakra Petch. Large decorative Makko titles remain. Small image-atlas labels use real text. Both font weights are bundled locally and preloaded; no Google Fonts runtime request is required. Original fonts and artwork are preserved.

97 existing state/input checks pass. Browser fixtures inspected HUD/dialogue, first-upgrade cards and diary at 320/375/430px. This is visual inspection, not a physical-device usability study. Full-map layout, barrel collider, demon-circle removal, saves and economy remain unchanged. Issue #1 records deployment.

Source: Google Fonts’ official [Chakra Petch directory](https://github.com/google/fonts/tree/main/ofl/chakrapetch), designed by Cadson Demak. The original unmodified Medium and Bold TTF files and OFL license are bundled. Candidate comparison also considered [Oxanium](https://github.com/google/fonts/tree/main/ofl/oxanium). The choice is our visual assessment for Fwoosh.

Weight matching uses Medium for requested weights 400–600 and Bold for 700–900, avoiding browser-generated extra bold strokes. Font face fallback is system-ui while local fonts load. Small labels and numeric counters render directly on canvas; decorative text uses the existing Makko atlas at large sizes.
