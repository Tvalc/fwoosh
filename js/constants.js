// ---------------------------------------------------------------- constants
const VW = 720, VH = 1280;          // virtual world, portrait, x wraps
const DT = 1/120;                   // fixed timestep

const K = {
  // player — AUTO-RUN: you never stop. You DASH to steer, and HOLD/SPACE to vent.
  DRIFT: 110,                       // (legacy) old constant drift
  RUN: 170,                         // px/s auto-run — always moving
  FRANTIC_SPD: 0.55,                // + this fraction of speed at full burn (near death = faster/frantic)
  WEAVE: 0.28,                      // base auto-wander when you're not steering (rad-ish/s)
  WEAVE_BURN: 2.6,                  // extra wander at full burn — control degrades as you burn
  DASH_CD: 0.12,                    // min gap between dashes — dash is the steer, so it's ~free
  LUNGE_SPD: 640,
  LUNGE_T: 0.18,                    // 115px of travel
  // VENT (hold-to-heal): purge heat, then refill hearts a half at a time; spawns fire demons while held
  VENT_PURGE: 0.16,                 // sec per heat while purging (before any heal)
  VENT_HEAL_T: 0.30,               // sec per HALF-heart of healing (a full heart in ~0.6s — venting is a real, quick heal now)
  VENT_SUMMON: 0.60,                // grace before the first fire demon (a quick dump is free)
  DEMON_INT0: 1.4,                  // demon spawn interval, tightens the longer you hold
  DEMON_INT_STEP: 0.15, DEMON_INT_MIN: 0.5,
  MAX_DEMONS: 6, DEMON_SPD: 135,    // slower than RUN(170) so a dash always escapes
  DEMON_TGT_VILL: 0.6,              // 60% of demons hunt villagers, 40% hunt you
  DEMON_HIT: 0.06, DEMON_HIT_CD: 0.8,  // only the nearest ~2 demons land hits -> 1-2 out = heal wins, full swarm loses
  HURT_IFRAME: 0.5,                 // after ANY demon bite, brief invuln so a swarm can't burst you while you break free
  DEMON_LIFE: 2.5, DEMON_R: 16,     // linger after you release, then collapse
  CHAIN_R: 120,                     // holding heat arcs the rescue to flaming villagers this close (save floor(heat) extra)
  VENT_ANIM_SC_F: 1.20,             // fire-man vent-anim: 280px cell (body at bottom, tall tapered flame up top) — keeps body size, flame reaches high without clipping
  VENT_ANIM_SC_C: 1.23,             // cinder-man vent-anim scale
  VENT_ANIM_ANCH: 0.5,              // vent-anim vertical anchor (cell bottom = the player's feet)
  CHARGES: 3,
  CHARGE_REFILL: 0.9,
  SWIPE_MIN: 40,
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

  // ABSORBER loop: Keith's fire spreads through the town; you pull it off villagers to save them.
  HEAT_MAX: 6,                      // fires you can carry at once
  HEAT_VENT: 0.30,                  // sec per heat shed while BRACING (running does NOT cool — fire persists)
  SPARK_EVERY: 2.6,                 // Keith ignites a fresh villager this often
  // ARSON IMPS — Keith no longer ignites villagers out of thin air. He SENDS a fire imp in from an edge that
  // flies to a chosen villager and torches it on contact. DASH/run into the imp first to INTERCEPT it:
  // you eat its fire (+heat), it mints bonus embers, and it banks an edge you cash in against Keith at the duel.
  ARSON_EVERY: 2.6,                 // how often Keith sends an imp (scales down as the town heats up)
  ARSON_MIN: 1.4,                   // fastest send cadence
  ARSON_SPD: 156,                   // imp flight speed toward its mark (a hair faster than you run, so cut the angle)
  ARSON_MAX: 4,                     // imps in flight at once
  ARSON_R: 15,                      // imp radius (intercept + reach-the-villager)
  ARSON_WARN: 0.45,                 // spawn telegraph: the imp hovers at the edge this long before it commits
  ARSON_HEAT: 1,                    // heat you take when you intercept (its fire is now yours)
  ARSON_EMBERS: 4,                  // bonus embers per intercept (×1.5 on a dash intercept)
  ARSON_EDGE_PER: 1.0,             // EDGE banked per intercept — cutting off an imp = a villager saved before it lit

  // THE EDGE — one running tally of who is winning the town. Saves/rekindles/intercepts push it toward YOU;
  // villagers lost push it toward Keith. Cashed at the duel: a strong lead starts Keith already down; a deficit
  // makes him demand extra downs. (Read once at the duel as text + a thin HUD bar — never a loud mid-run meter.)
  EDGE_PER_DOWN: 10,                // EDGE per free Keith down (positive) / per extra down he demands (negative)
  SAVE_EDGE: 1.0, SAVE_EDGE_HEAT: 0.4,   // save: EDGE += 1 + heat*0.4 (a chained save adds a flat +0.5)
  LOSS_EDGE: 1.0, LOSS_EDGE_HEAT: 0.3,   // loss: EDGE -= 1 + heatAtIgnition*0.3
  EDGE_HEADSTART_CAP: 2,            // most free downs a lead can buy (always leave 1 to fight)
  EDGE_EXTRA_CAP: 2,               // most extra downs a deficit can add
  SPREAD_R: 52,                     // a flaming villager torches calm ones within this
  SPREAD_EVERY: 0.9,               // spread check cadence per flaming villager
  SPREAD_CHANCE: 0.5,              // chance a nearby calm villager catches on a check
  BURN_FUSE: 6.5,                   // a flaming villager burns into a WALL after this (unsaved)
  PANIC_SPD: 150,                   // flaming villager panic-run (catchable with a dash)
  SAVE_SCORE: 120,                  // base points per villager saved
  SAVE_ANIM_DUR: 1.5,               // seconds the Makko teleport-to-light save animation plays before the villager is gone
  BLAZE_MULT: 0.5,                  // + this per heat carried, to the save score (hold fire = big points)
  VENT_IGNITE_R: 82,                // vent blasts fire OUTWARD — calm villagers this close get RE-IGNITED
  // META: the villagers you SAVE are the root of everything. Saves mint EMBERS (currency) + raise the town.
  EMBER_BASE: 3,                    // embers per save, before the blaze multiplier
  EMBER_RUN_CAP: 160,               // soft cap: saves past this still count for the town, but mint 0 embers
  WIN_EMBERS: 25,                   // KEITH YIELDS bounty
  WELL_RISE: 6,                     // cumulative lifetime saves to raise The Well from rubble
  FORGE_RISE: 16,                   // cumulative lifetime saves to raise The Forge (dash upgrades)
  // HEALTH: carrying fire burns your health down, faster the more you hold; empty of fire, you recover.
  HP_DRAIN: 0.035,                  // health/sec lost PER unit of heat carried (heat 6 -> ~0.21/s)
  HP_REGEN: 0.04,                   // idle trickle only — real healing now comes from HOLDING VENT (the risky heal)
  SAVE_QUOTA: 12,                   // save this many villagers and Keith rises for the finale
  DUEL_DUMP: 8,                     // total heat you must dump into Keith to make him yield

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

  // bosses: the apex duel (Keith, the win) + risers (minibosses)
  DUEL_CROWD: 3,                    // crowd below this late-run = Keith gets up
  DUEL_MIN_T: 20,                   // never before 20s in
  KEITH_R: 20, KEITH_FUSE: 4.0, KEITH_DOWNS: 3,
  KEITH_FLEE: 130,                  // unlit Keith evades like crowd: herding is the offense
  KEITH_PUR0: 190, KEITH_PUR1: 310, // lit Keith hunts you to shed it back
  BOSS_RISE_T: 0.8, BOSS_STAGGER_T: 2.2,

  // LEVELED KEITH — each duel win escalates him; movesets are CUMULATIVE, one active at a time (capped
  // concurrency), gated behind a telegraph. No screen shake.
  DUMP_PER_LEVEL: 2,                // heat you must dump grows per level (L1..L5: 8,10,12,14,16)
  KEITH_MOVE_CD0: 3.4,             // gap before his first/again move (shrinks with level)
  KEITH_MOVE_CD_MIN: 1.7,          // never spam faster than this (concurrency guard)
  KEITH_TELE: 0.8,                 // wind-up telegraph before any move fires
  KEITH_HIT: 0.5,                  // a move that connects costs you HALF A HEART (scaled by maxHearts)
  // L2 EMBER SPIT: fireballs at your lagged spot
  SPIT_N: 3, SPIT_SPD: 250, SPIT_R: 12, SPIT_SPREAD: 0.34,
  // L3 WAKE OF FIRE: Keith dash-line; the laid trail is ABSORBABLE fire (fuel your dump)
  WAKE_SPD: 560, WAKE_SEG_EVERY: 0.03, WAKE_LIFE: 2.4, WAKE_R: 20, WAKE_HEAT_CAP: 2,
  // L4 DEMON CALL: he summons fire monsters that hunt you (dash-kill for dump fuel)
  KEITH_DEMONS: 3, KEITH_DEMON_TTL: 7.0,
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
  OPP_MIN_PASSES: 3,                // need this many recorded passes before the opp arms
  OPP_LAT_CAP: 40,                  // rolling window of recent latenesses (fuse-at-pass)
  OPP_SNIPE_LEAD: 0.30,             // snipe fires this much fuse-time BEFORE your habitual dump
  OPP_SNIPE_TELE: 0.42,            // telegraph -> impact time (dodge window)
  OPP_SNIPE_R: 34,                  // impact radius
  INTRO_T: 1.9,                     // cold-open reveal length
};
