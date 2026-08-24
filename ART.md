# FWOOSH — Game Summary & Asset Spec

A handoff doc for making **multiple art-style versions** of FWOOSH. It's written to be read
cold by an art planner or by Makko (image gen), and precise enough for code to build a
swappable "skin" layer from. Live reference build: https://tvalc.github.io/fwoosh/

---

## 1. What the game is (read this first)

**One-line:** You're on fire. The only cure is touching someone else and making it their problem.

**The fantasy:** It's hot-potato with fire, at Flappy-Bird tempo, on your phone. You drift around a
crowd that runs from you. Touch a crowd member and the fire jumps to them — now *they're* lit and
chase *you*. Hold the fire too long and you burn down into a permanent wall. Everybody's doing this
to everybody, forever, and the walls piling up are the ones who lost.

**The core loop (30 seconds of play):**
- You **drift** constantly and **swipe/dash** to lunge, **hold** to brace (stop dead).
- **Pass** the fire by touching a dark crowd cell → you go dark, they become a **hunter** that chases you.
- Passing *late* (low fuse) scores way more than dumping early. Greed is the skill.
- If a hunter's fuse runs out it becomes **slag** — a permanent wall. The arena slowly fills with walls.
- You can **eat** a hunter (touch it while dark) to re-light and keep going.

**The nemesis (the meta):** **KEITH** is a rival built from *how you played last session* — persisted
across visits. He drops a magenta **grudge wall** on your most-passed spot and **snipes** your predictable
habits. Beat his reads and he grudgingly respects you; the more you play, the more his voice changes
(smug → obsessed → respect).

**The win:** Late in a run the crowd thins out. When it does, Keith **rises off his wall** and the empty
floor becomes a boss arena — the **apex duel**. You beat him by doing to him what he does to you: tag him,
keep the fire on him, dodge his attempts to shed it back, until his fuse burns him down. **Three downs =
KEITH YIELDS.** That's the win screen.

**The ladder in between:** every 4th wall you make this run gets back up as a **riser** (miniboss) that
spreads fire through the crowd — kill it the same way you'll later kill Keith. It's the tutorial for the boss.

**Tech reality (matters for art):** single self-contained `index.html`, HTML5 **canvas 2D**, zero
dependencies, no backend, phone-first **portrait**. Everything is currently drawn as **procedural vector
shapes** (circles, triangles, rounded rects, radial gradients). There are **no image assets yet** — that's
what this doc is for.

---

## 2. THE LEGIBILITY CONTRACT (non-negotiable for any art style)

The game is playable because you can tell four things apart *instantly* at tiny size, in peripheral vision,
even in grayscale. **Any art style must preserve these distinctions** — through **shape and motion**, not
just color. This is the one hard rule. Break it and the game stops working.

| Thing | Silhouette | Motion | Meaning |
|---|---|---|---|
| **Crowd** (safe, wanted) | round, soft | lazy drifting/wandering | a bystander, not on fire |
| **Lit things** (you-lit, hunters, lit bosses) | warm, **glowing halo** | committed, purposeful | ON FIRE — the hot potato |
| **Hunter** (lethal, also wanted) | **angular / arrow-like**, points along its heading | straight committed lines | chasing you to give it back |
| **Slag / walls** (solid, dead) | **flat matte block**, hard edges | **zero motion** | furniture. someone who lost. |

**The grayscale test:** a black-and-white screenshot at minute three must let a stranger point at every
cell they could safely touch within ~2 seconds. If your art fails that, the shapes are wrong.

**Design for TINY.** On a phone these render at roughly **14–21px across**. A crowd cell is ~13.5px, Keith
~21px. Generate art large (256px) but **the silhouette must read at 24px** — bold shapes, no fine detail,
detail is invisible.

**Color-role semantics (the real design system).** A reskin can remap the whole palette, but must keep the
roles *internally consistent*:

| Role | Current color | Rule |
|---|---|---|
| FIRE / lit / danger-you-carry | warm orange `#ffb04d` `#ff5a2e` `#ff9a2e` | anything on fire glows warm |
| SAFE / your dark self / good outcome | cool cyan `#7fe8ff` | |
| CROWD / uninvolved | neutral grey-blue `#cfd6e6` | reads as "not my problem yet" |
| WALLS / dead / inert | dead slate `#2b303c` | clearly furniture, never a creature |
| KEITH / the OPP family | magenta-pink `#ff3d7a` | the personal antagonist — see the eye motif |
| VICTORY / earned | mint green `#8affc1` | |
| DEATH / POP | red `#ff6a5a` | |
| Background | near-black `#07070b` | actors must pop against it |

**The EYE motif.** Keith, his grudge wall, and risers all wear **an eye** — that's how you know it's *him*,
not generic furniture. Any art style should keep the eye as the throughline for the OPP family. (The player
has a small dark pupil; the crowd has a neutral sheen/highlight, NOT an eye.)

---

## 3. Technical constraints for assets

- **Format:** transparent PNG (or SVG). Single-file build means sprites get **embedded as base64 data-URIs**
  inside the HTML — no external requests allowed. Keep the *total* embedded art budget sane (target < ~3–4MB
  of base64 for a full set; individual actor sprites should be small, 256px or less).
- **World space:** fixed virtual canvas **720 × 1280** (portrait), scaled to fit the device. The **left/right
  edges wrap** (an actor near the edge is drawn again on the far side) — art must **tile seamlessly across the
  vertical seam** or just be small enough that the 3× wrap-draw hides it (it already does for these sizes).
- **Sizing:** each sprite maps to a world **diameter** (below). Draw art centered in a square with a little
  transparent margin for glow/overhang. Keep **one consistent scale across a set** so relative sizes match.
- **Rotation:** hunters (and lit-Keith) point along their heading — the engine rotates the sprite. So the
  hunter sprite should be drawn **pointing right (0°, +x)** as its canonical orientation.
- **Retina:** the context is DPR-scaled already; provide art at ~2× the on-screen size and it stays crisp.
- **Pixel-art styles:** set `imageSmoothingEnabled=false`; otherwise leave smoothing on.
- **Keep the juice procedural.** Expanding rings, the white flash, hitstop, slowmo — leave these as code.
  Zero screen shake, ever (hard rule across all versions).

---

## 4. THE ASSET MANIFEST

Grouped by whether it's **ART** (swap a sprite), **DATA** (a live gauge — keep functional/vector, theme color
only), **JUICE** (effects — theme color only), or **UI** (typographic screens — theme font/panel).

### 4A. Actors — ART (the real sprite work)

| Asset | World Ø | States needed (each = one image) | Current look | Notes |
|---|---|---|---|---|
| **Player — dark** | 28 | 1 | cyan `#7fe8ff` blob, small dark pupil | your "safe" self, drifting |
| **Player — lit** | 28 (+~116 glow halo) | 1 | orange `#ffb04d`, warm radial glow, pupil `#0a0a10` | ON FIRE. glow is the "where am I" beacon — keep it big & warm |
| **Player — braced** | 17 (smaller) | reuse lit/dark scaled + a ring | shrinks to R8.4, thin white ring | can be the same sprite scaled; the ring is DATA |
| **Crowd cell** | 26 | 1 | grey-blue `#cfd6e6` round + lighter sheen `#8f98ab` | round & soft. no eye. fleeing uses same art |
| **Hunter** | ~35 long | 1 (drawn pointing **right**) | angular orange `#ff5a2e` arrow/dart | rotates to heading. this is "crowd, but now on fire and hunting" |
| **Slag / wall** | 22 (square) | 1–3 (variety optional) | matte slate square `#2b303c`, edge `#454d5e` | flat, dead, static. a few variants add texture to the graveyard |
| **Grudge wall** | 22 (square) + eye | 2 (normal, scarred) | magenta `#3a1230`/`#ff3d7a` block + **eye** `#ff3d7a`, pupil `#160a11`. scarred = dimmed `#241019`/`#6a2748` | Keith's marker on your favorite spot. scarred = you broke his read |
| **Keith — idle/evading** | 40 + eye | 1 | magenta `#ff3d7a` round + eye `#fff`/`#ffd7e6` | the boss, unlit, fleeing you |
| **Keith — lit** | 40 (+glow) + eye | 1 | same + warm glow, eye `#fff`, fuse ring | you tagged him; he's carrying it now |
| **Keith — stagger** | ~40, flattened | 1 | dim `#7a2447`, squashed slab, eye | knocked down between rounds |
| **Riser — hunting** | 34 + eye | 1 | dark-red `#c2364f` **rounded slab** + eye `#ffd7e6` | "a wall that got up." reads as slab, not blob — it's furniture animated |
| **Riser — lit** | 34 (+glow) + eye | 1 | same + warm glow + fuse ring | you tagged it; it's shedding onto the crowd |
| **Ember / trail dot** | 10 | 1 (or procedural) | fading orange dot `rgba(255,138,46)` | sparse dots you drop while lit; ignites crowd that drifts through |

**Rising animation** (Keith & risers) is a scale-up over 0.8s — the engine handles it by scaling the sprite,
no extra frames needed.

### 4B. Gauges — DATA (keep functional/vector; theme color only, do NOT sprite these)

These encode live numbers and must stay crisp and animated:
- **Fuse ring** (player-lit, hunters, lit bosses): an arc that drains as fuse burns. Currently `#ffd36a`
  (turns white `#fff` under 0.4s = clutch). This *is* the countdown — the single most-read element in the game.
- **Lunge charge pips** (bottom center, 3): cyan `#7fe8ff` filled/empty.
- **Duel pips** (top-right, 3): Keith's downs. mint `#8affc1` filled / pink outline.
- **Snipe reticle + strike** (Keith's snipe): converging magenta `#ff3d7a` crosshair + a strike dot.
- **Brace ring**: thin white ring when braced.

### 4C. Effects — JUICE (procedural; theme color only)

Expanding rings/bursts on every event (pass, eat, backpass, ignite, cooldown, down, win), the single-frame
white flash, hitstop, 0.25× slowmo on clutch passes. All colored by event (orange pass, cyan good, mint win,
magenta Keith). **No screen shake, ever.**

### 4D. Backdrop — ART (biggest vibe lever)

- **Background:** near-black `#07070b`. A theme can replace this wholesale (gradient, texture, scene) — the
  ONE constraint is actors must still pop (keep it dark/low-contrast, or the art must rim-light actors).
- **Floor grid:** barely-visible lines `rgba(255,255,255,0.028)` every 90px. Themeable or removable.

### 4E. Screens & UI — UI (typographic; theme font + panel styling, layout mostly fixed)

- **Premise card** (first boot, tap to start): title "YOU'RE ON FIRE." `#ffb04d`, 7 lines of body `#e7ecf5`,
  "DON'T END UP A WALL." `#fff`.
- **Cold-open** (Keith's greeting each run): big line `#ff5d94` + 2 sub-lines, a pulsing ring on the grudge wall.
- **Callouts** (mid-run, fading): good=cyan `#7fe8ff`, bad=pink `#ff5d94`, neutral `#dfe6f2`.
- **HUD:** score (top center, white), cooldown counter (mint), charge pips, duel pips.
- **Win screen:** "KEITH YIELDS." mint `#8affc1` + sub-lines + score.
- **Pop screen:** "POP" red `#ff6a5a` + cause + score + stats.

Font is currently system-ui. A theme can swap the typeface, panel backgrounds, and accent colors. Text *content*
is game logic — don't change wording via art.

---

## 5. What's THEMEABLE vs FIXED

| Freely themeable | Fixed by gameplay (change carefully / keep the role) |
|---|---|
| All actor sprites (within the legibility contract) | round-vs-angular-vs-flat silhouettes must stay distinct |
| Backdrop, floor, overall palette | lit = warm glow; walls = dead & static; opp = eye |
| Font, panel styling, UI chrome | fuse ring / pips / reticle must stay crisp & readable |
| Ember & ring effect colors | actors must pop against the background |
| Pixel vs smooth vs hand-drawn rendering | sizes/hitboxes (art can overhang but the body maps to the Ø) |

---

## 6. How versions get built (for the code step)

The clean architecture: **one engine, a swappable `SKIN`.** No gameplay code changes between versions.

- Add a `SKIN` object that provides, per actor+state, either a **draw function** (procedural — what exists now,
  becomes the default "VECTOR" skin) or an **`Image`** (a decoded data-URI sprite).
- The renderer calls `SKIN.draw('hunter', ctx, x, y, {angle, fuse, ...})` instead of hardcoded shapes. Gauges,
  juice, and UI stay in the engine; only 4A/4D/4E art routes through the skin.
- Ship each version by selecting a skin: either separate built files (`index.html`, `neon.html`, …) or one
  file with `?skin=neon`. localStorage save (Keith, your feud) is shared or namespaced per skin — your call.
- Sprites embed as base64 data-URIs to keep the single-file, no-backend, CSP-safe property (same as our other games).

**I can scaffold this skin layer whenever you're ready** — it's a mechanical refactor of the render function,
and once it's in, dropping in a Makko-made set is just filling a manifest.

---

## 7. Makko generation checklist (per art set)

For each version, generate this set. **Transparent background, square canvas (256×256), subject centered,
consistent scale across the set, silhouette legible at 24px.**

```
player_dark        player_lit         crowd
hunter (facing →)  slag  (+2 variants optional)
grudge  grudge_scarred
keith_idle  keith_lit  keith_stagger
riser  riser_lit
ember (optional; procedural is fine)
backdrop (1080×1920 portrait, optional — biggest vibe change)
```

Keep the legibility contract in the prompt every time: **crowd round & soft, hunters angular & pointed,
walls flat & dead, lit things glow warm, the OPP family (grudge/keith/riser) wears an eye.**

---

## 8. Style directions to seed the planning (not prescriptive)

Just sparks — the engine is style-agnostic as long as §2 holds:
- **Neon / synthwave** (leans into the existing glow)
- **Hand-drawn doodle / marker** (googly eyes, wobble)
- **Claymation blobs** (soft, tactile, the "cute horror" angle)
- **Flat minimalist / geometric** (bold color blocks, very clean)
- **Retro pixel** (`imageSmoothingEnabled=false`)
- **Paper cut-out / construction-paper** (layered, matte)
- **Grimy industrial / ember-and-ash** (the fire fiction played straight)

Each just needs the 12-ish actor states + optional backdrop. The gauges, juice, and screens re-color to match.

---

*Reference numbers pulled from `index.html` (VW 720 × VH 1280, DT 1/120). Actor radii: player 14, braced 8.4,
crowd 13, slag 11, riser 17, Keith 20, trail 5. If code changes these, update this doc.*
