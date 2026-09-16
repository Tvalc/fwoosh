// ---------------------------------------------------------------- constants
const VW = 720, VH = 1280;          // virtual world, portrait, x wraps
const DT = 1/120;                   // fixed timestep

const K = {
  // player — AUTO-RUN: threats set the default route. You DASH/steer to optimize and HOLD/SPACE to vent.
  DRIFT: 110,                       // (legacy) old constant drift
  RUN: 170,                         // px/s auto-run — always moving
  FRANTIC_SPD: 0.55,                // + this fraction of speed at full burn (near death = faster/frantic)
  WEAVE: 0.28,                      // base auto-wander when you're not steering (rad-ish/s)
  WEAVE_BURN: 2.6,                  // extra wander at full burn — control degrades as you burn
  AUTO_TURN: 3.2,                   // rad/s toward the nearest priority target; smooth enough for manual overrides
  AUTO_SIGHT: 0.65,                 // seconds between runner sightings; assist follows, player predicts/intercepts
  DASH_CD: 0.12,                    // min gap between dashes — dash is the steer, so it's ~free
  LUNGE_SPD: 640,
  LUNGE_T: 0.18,                    // 115px of travel
  // A vent commits to one heat or one full heart; holding chains units.
  VENT_PURGE: 0.40,                 // starting tuning: seconds per heat unit (including a final fraction)
  VENT_HEAL_T: 0.60,                // seconds per full heart, capped at full health
  VENT_DEMON_WAKE: 0.45,            // visible emergence before a new demon can act
  VENT_DEMON_MIN_R: 260,            // vent demons enter well outside immediate contact while Duy is rooted
  CINDER_SEEK_R: 320,              // prefer a nearby cinder person (husk), otherwise chase Duy
  CINDER_EAT_T: 0.65,              // warning window: shatter demon or rekindle husk to interrupt
  CINDER_BLAST_R: 120,
  CINDER_BLAST_HEARTS: 1,
  MAX_DEMONS: 6, DEMON_SPD: 135,    // legacy Khet-Tak-Tor cap; vent units always release their demon
  DEMON_TGT_VILL: 0.6,
  DEMON_HIT: 0.06, DEMON_HIT_CD: 0.8,
  DEMON_KNOCK_SPD: 520, DEMON_KNOCK_T: 0.14, // a bite breaks the heal stack and throws Duy clear
  HURT_IFRAME: 0.5,
  DEMON_LIFE: 2.5, DEMON_R: 16,     // expiry remains only for Khet-Tak-Tor's temporary summons
  CHAIN_R: 120,                     // holding heat arcs the rescue to flaming villagers this close (save floor(heat) extra)
  VENT_ANIM_SC_F: 1.20,             // fire-man vent-anim: 280px cell (body at bottom, tall tapered flame up top) — keeps body size, flame reaches high without clipping
  VENT_ANIM_SC_C: 1.23,             // cinder-man vent-anim scale
  VENT_ANIM_ANCH: 0.5,              // vent-anim vertical anchor (cell bottom = the player's feet)
  CHARGES: 3,
  CHARGE_REFILL: 0.9,
  TOUCH_BURST_CANCEL_R: 42,        // releasing this close to the touch-down Duy cancels without spending a charge
  BRACE_STOP: 0.060,                // velocity -> 0 in 60ms
  BRACE_FUSE_MULT: 1.6,
  R_PLAYER: 14,
  R_BRACED: 8.4,
  EDGE: 30,                         // side-wall margin — the arena is fully enclosed (bounce off all 4 walls)
  SHATTER_COST: 0.35,               // fuse cost to break slag while LIT

  // fuses
  FUSE_START: 3.20,
  FUSE_MAX: 3.20,                   // also the inherit cap on EAT
  HUNTER_FUSE: 8.0,

  // ABSORBER loop: Khet-Tak-Tor's fire spreads through the town; you pull it off villagers to save them.
  HEAT_MAX: 6,                      // fires you can carry at once
  HEAT_VENT: 0.30,                  // sec per heat shed while BRACING (running does NOT cool — fire persists)
  SPARK_EVERY: 2.6,                 // Khet-Tak-Tor ignites a fresh villager this often
  // ARSON IMPS — Khet-Tak-Tor no longer ignites villagers out of thin air. He SENDS a fire imp in from an edge that
  // flies to a chosen villager and torches it on contact. DASH/run into the imp first to INTERCEPT it:
  // you eat its fire (+heat), it mints bonus embers, and it banks an edge you cash in against Khet-Tak-Tor at the duel.
  ARSON_EVERY: 2.6,                 // how often Khet-Tak-Tor sends an imp (scales down as the town heats up)
  ARSON_MIN: 1.4,                   // fastest send cadence
  ARSON_SPD: 156,                   // imp flight speed toward its mark (a hair faster than you run, so cut the angle)
  ARSON_MAX: 4,                     // imps in flight at once
  ARSON_R: 15,                      // imp radius (intercept + reach-the-villager)
  ARSON_WARN: 0.45,                 // spawn telegraph: the imp hovers at the edge this long before it commits
  ARSON_HEAT: 1,                    // heat you take when you intercept (its fire is now yours)
  ARSON_EMBERS: 4,                  // bonus embers per intercept (×1.5 on a dash intercept)
  ARSON_EDGE_PER: 1.0,             // EDGE banked per intercept — cutting off an imp = a villager saved before it lit

  // THE EDGE — one running tally of who is winning the town. Saves/rekindles/intercepts push it toward YOU;
  // villagers lost push it toward Khet-Tak-Tor. Cashed at the duel: a strong lead starts Khet-Tak-Tor already down; a deficit
  // makes him demand extra downs. (Read once at the duel as text + a thin HUD bar — never a loud mid-run meter.)
  EDGE_PER_DOWN: 10,                // EDGE per free Khet-Tak-Tor down (positive) / per extra down he demands (negative)
  SAVE_EDGE: 1.0, SAVE_EDGE_HEAT: 0.4,   // save: EDGE += 1 + heat*0.4 (a chained save adds a flat +0.5)
  LOSS_EDGE: 1.0, LOSS_EDGE_HEAT: 0.3,   // loss: EDGE -= 1 + heatAtIgnition*0.3
  EDGE_HEADSTART_CAP: 2,            // most free downs a lead can buy (always leave 1 to fight)
  EDGE_EXTRA_CAP: 2,               // most extra downs a deficit can add
  SPREAD_R: 52,                     // a flaming villager torches calm ones within this
  SPREAD_EVERY: 0.9,               // spread check cadence per flaming villager
  SPREAD_CHANCE: 0.5,              // chance a nearby calm villager catches on a check
  BURN_FUSE: 6.5,                   // a flaming villager burns into a WALL after this (unsaved)
  PANIC_SPD: 205,                   // flaming villagers outrun a clear-headed jog; dash or build heat to close
  SAVE_SCORE: 120,                  // base points per villager saved
  SAVE_ANIM_DUR: 1.5,               // seconds the Makko teleport-to-light save animation plays before the villager is gone
  BLAZE_MULT: 0.5,                  // + this per heat carried, to the save score (hold fire = big points)
  VENT_IGNITE_R: 82,                // vent blasts fire OUTWARD — calm villagers this close get RE-IGNITED
  // META: the villagers you SAVE are the root of everything. Saves mint EMBERS (currency) + raise the town.
  EMBER_BASE: 3,                    // embers per save, before the blaze multiplier
  WIN_EMBERS: 25,                   // ARBITER YIELDS bounty
  WELL_RISE: 6,                     // cumulative lifetime saves to raise The Well from rubble
  FORGE_RISE: 16,                   // cumulative lifetime saves to raise The Forge (dash upgrades)
  // HEALTH: carrying fire burns your health down, faster the more you hold; empty of fire, you recover.
  HP_DRAIN: 0.035,                  // health/sec lost PER unit of heat carried (heat 6 -> ~0.21/s)
  HP_REGEN: 0.04,                   // idle trickle only — real healing now comes from HOLDING VENT (the risky heal)
  SAVE_QUOTA: 12,                   // save this many villagers and Khet-Tak-Tor rises for the finale
  DUEL_DUMP: 8,                     // total heat you must dump into Khet-Tak-Tor to make him yield

  // crowd
  R_CELL: 13,
  CROWD_START: 12,
  CROWD_CAP: 16,
  CROWD_RESPAWN: 6.0,
  FLEE_RANGE: 140,
  FLEE_SPD: 130,
  WANDER_SPD: 84,                   // calm villagers actively run around the square (was a slow drift)

  // hunters
  HUNTER_SPD0: 180,
  HUNTER_SPD1: 340,
  HUNTER_LAG: 0.22,
  HUNTER_CAP: 12,
  COOLDOWN_MIN: 3,                  // the field must have held 3+ hunters at once to count as cleared
  RELIGHT: 1.5,                     // dark player + no hunters = no fire anywhere; the arena relights
  GRACE: 0.40,                      // a cell that just changed state is untouchable this long
  IMMUNE: 1.00,                     // no re-contact with your own passee
  BACKPASS_END: 1.20,               // backpass window is [IMMUNE, BACKPASS_END]
  BACKPASS_MULT: 3.0,

  // slag
  R_SLAG: 11,                       // 22px across, 32 fit the arena width

  // HUSK / ASH WRAITH — the fate of a villager you FAIL to save. No more permanent charcoal wall: the fire
  // finishes them into a temporary husk that shoves like a wall but self-clears by CRACKING into a roaming
  // ash wraith. Always reclaimable: pour your own heat back in (REKINDLE) to still save them.
  HUSK_CRACK_T: 8.0,                // husk life before it cracks into a wraith
  HUSK_R: 12,                       // soft-solid radius (inherits the wall's cornering role, temporarily)
  CRACK_TELE: 0.9,                  // convulsion telegraph before the wraith rises
  REKINDLE_COST: 1,                 // heat you SPEND to pour fire back into a husk and save them (mirror of absorb)
  WRAITH_CAP: 5,                    // persistent town-wraiths roaming at once (over-cap cracks don't add a body)
  WRAITH_KILL_HEAT: 0.5,           // dash-kill ANY fire monster: heat you can turn into a save or a dump
  DEMON_KILL_EMBERS: 2,            // + embers per shattered monster (your reward for clearing them)

  // trail
  TRAIL_EVERY: 0.06,
  TRAIL_LIFE: 1.2,
  R_TRAIL: 5,

  // juice (ZERO screen shake, ever)
  HITSTOP: 0.090,
  SLOWMO_T: 0.120,
  SLOWMO_SCALE: 0.25,
  CLUTCH_FUSE: 0.40,                // sub-0.40s pass earns the slowmo

  // bosses: the apex duel (Khet-Tak-Tor, the win) + risers (minibosses)
  DUEL_CROWD: 3,                    // crowd below this late-run = Khet-Tak-Tor gets up
  DUEL_MIN_T: 20,                   // never before 20s in
  DUEL_ARSON_EVERY: 3.2,            // boss fight keeps the rescue/heat loop alive at a readable pace
  DUEL_ARSON_MIN: 2.2,              // deeper districts accelerate it slightly, never to town-run spam speed
  ARBITER_R: 20, ARBITER_FUSE: 4.0, ARBITER_DOWNS: 3,
  ARBITER_FLEE: 130,                  // unlit Khet-Tak-Tor evades like crowd: herding is the offense
  ARBITER_PUR0: 190, ARBITER_PUR1: 310, // lit Khet-Tak-Tor hunts you to shed it back
  BOSS_RISE_T: 0.8, BOSS_STAGGER_T: 2.2,

  // LEVELED ARBITER — each duel win escalates him; movesets are CUMULATIVE, one active at a time (capped
  // concurrency), gated behind a telegraph. No screen shake.
  DUMP_PER_LEVEL: 2,                // heat you must dump grows per level (L1..L5: 8,10,12,14,16)
  ARBITER_MOVE_CD0: 3.4,             // gap before his first/again move (shrinks with level)
  ARBITER_MOVE_CD_MIN: 1.7,          // never spam faster than this (concurrency guard)
  ARBITER_TELE: 0.8,                 // wind-up telegraph before any move fires
  ARBITER_HIT: 0.5,                  // a move that connects costs you HALF A HEART (scaled by maxHearts)
  // L2 EMBER SPIT: fireballs at your lagged spot
  SPIT_N: 3, SPIT_SPD: 250, SPIT_R: 12, SPIT_SPREAD: 0.34,
  // L3 WAKE OF FIRE: Khet-Tak-Tor dash-line; the laid trail is ABSORBABLE fire (fuel your dump)
  WAKE_SPD: 560, WAKE_SEG_EVERY: 0.03, WAKE_LIFE: 2.4, WAKE_R: 20, WAKE_HEAT_CAP: 2,
  // L4 DEMON CALL: he summons fire monsters that hunt you (dash-kill for dump fuel)
  ARBITER_DEMONS: 3, ARBITER_DEMON_TTL: 7.0,
  // L5 SIPHON MELTDOWN: villager shield + expanding pulse with a safe gap
  SIPHON_PULL: 4, SIPHON_R: 96, SIPHON_PULSE_SPD: 240, SIPHON_GAP: 0.9,
  // allies: rescued villagers that each body-block one incoming attack
  ALLY_PER_SAVED: 3, ALLY_MAX: 6,
  PASSBACK_FUSE: 2.5,               // what you inherit when a boss sheds onto you
  OVERLOAD_PENALTY: 1.35,           // a hunter catching a LIT you shoves its fire on: fuse burned toward the pop
  OVERLOAD_IFRAME: 0.55,            // brief immunity after an overload so a swarm can't chain-pop you in one instant
  RISER_AT: 4, RISER_EVERY: 3,      // your 4th wall this run raises one; then every 3rd
  RISER_R: 17, RISER_FUSE: 3.0, RISER_SPD: 150, RISER_TAG_CD: 2.5,
  DUEL_BONUS: 1500, RISER_BONUS: 400,

  // walls merge into a powerup when they pile up -> SURGE
  MERGE_MIN: 4,                     // a connected cluster of this many boxes fuses
  MERGE_LINK: 60,                   // boxes within this are "connected"
  MERGE_EVERY: 0.3,                 // check cadence (s)
  POWERUP_R: 19, POWERUP_CAP: 3,
  SURGE_T: 4.5,                     // seconds of monster mode
  SURGE_FUSE_MULT: 0.28,            // fuse barely burns during surge
  SURGE_BONUS: 300,

  // THE OPP (meta, phase 2A)
  OPP_COLS: 6, OPP_ROWS: 8,         // territory histogram = 48 cells (120x160px each)
  OPP_MIN_PASSES: 3,                // need this many recorded direct rescues before the beacon arms
  OPP_LAT_CAP: 40,                  // rolling heat-at-rescue history; accepts legacy fuse records
  OPP_SNIPE_LEAD: 0.30,             // retained for old save/history compatibility
  OPP_SNIPE_TELE: 0.90,            // every vent unit can finish before the impact; dash the read
  OPP_SNIPE_R: 34,                  // impact radius
  OPP_SNIPE_HEARTS: 1,             // staying on the marked vent spot costs one heart
  INTRO_T: 1.9,                     // cold-open reveal length
};
