# Reserved top HUD — 2026-09-15-hud-safe-1

Tony reported that the player can run under the top interface. The old HUD faded over ground that remained playable down to y=40.

The HUD now has an opaque reserved strip through virtual y=270. Health, heat, rescue progress, Edge/Keith and temporary rescue/tactical status all fit within that strip. Temporary messages no longer cover the upper playfield. World actors and effects are clipped below the strip; the title, town and results retain their layouts.

The shared upper actor-center boundary is y=434, allowing 164 virtual pixels for the tallest existing Makko vent frame, absorb/vent scale pops and shake. Duy cannot run, dash or be pushed above that boundary. Villagers, vent demons, incoming imps, Keith and old grudge/snipe targets use the playable region too. Final collision corrections cannot leave actors under the HUD. Props crossing the new boundary resolve actors sideways/down instead of into the header. Header taps/swipes do not steer or consume dash charges; gameplay gestures and keyboard steering remain available.

The playable vertical range is smaller because the HUD now occupies real screen space. Speeds, rewards, quotas and upgrade values were not changed; resulting encounter density needs Tony's playtest. Existing Makko assets and save formats are unchanged.

Validation: 96 automated state/input checks pass, including upward running/dashing, collision pushes, safe spawns/legacy targets, header gestures, tallest vent clearance and render/status placement. The older swipe test was moved from the now-reserved header into the playfield. Local 320px browser fixtures verify Duy stopped at the upper boundary in human and maximum-pulse cinder-vent poses, with readable HUD status and no portrait clipping. The browser fixture runs actual simulation before rendering; this is not a physical-phone or human balance test.

This is a scoped Codex fix on codex/hud-safe-area. Cursor's checkout and Makko art lane are untouched. Release evidence is recorded on issue #1.
