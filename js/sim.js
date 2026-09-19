"use strict";
// ---------------------------------------------------------------- FWOOSH
// Static HTML/CSS/JS, zero runtime deps. Freeze-tag abstracted: you are LIT, the only cure is
// touching someone dark, and everyone who burns all the way down leaves a wall.
//
// PHASE 1: the action core (drift/dash/brace, PASS/EAT/SLAG, backpass, cooldown, relight).
// PHASE 2A (THE OPP, first slice): a rival assembled from HOW you played last session.
//   It remembers rescue TERRITORY, places a grudge beacon in the busiest area next run,
//   and fires once when it reads the start of a vent. Finish the unit and dash, or break
//   the beacon first. Legacy fuse records remain readable but no longer drive the trigger.
//   Score is NEVER a meta input — the coupling is coordinates + timing, not currency.
//   Persistence: one localStorage key `fwoosh.opp`. Crew/apex-duel/other axes NOT built yet.
//
// Phase-2A checkpoint: on run 2, does the grudge beacon + snipe + callout read as
//   "it studied me, I want to beat it" — or "the game placed a random obstacle and cheated"?
//
// Open core checkpoint (still): at minute three, is the slag-filled arena more
//   interesting or just more annoying? (The apex duel, unbuilt, is the intended answer.)


// ---------------------------------------------------------------- rng (deterministic)
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let SEED = 90909, rnd = mulberry32(SEED);

// ---------------------------------------------------------------- state
let cells, slag, trail, rings, player, score, elapsed, hunterFuse, cooldowns,
    armed, respawnT, mode, popCause, nextId, hitstop, slowmo, flash, frame, hist, peakHunters, noFireT;
let sparkT = 0, heatCoolT = 0, dumped = 0, saved = 0, overloadT = 0;   // ABSORBER loop state
let saveIconPop = 0; // brief scale-pop on the newest rescue-counter villager when one fills in
let dashPop = 0;     // flourish pop when a dash charge finishes recharging
let edgePop = 0;     // brief pulse on the EDGE bar when it shifts
let demons = [];     // fire demons summoned while venting (attack player + villagers)
let cinderBlasts = []; // short-lived presentation of resolved cinder explosions
let husks = [];      // villagers you failed to save: temporary soft-solid coals that crack into roaming wraiths
let arson = [];      // Keith's fire imps in flight toward villagers — intercept them
let shots = [];      // Khet-Tak-Tor's ember-spit fireballs (duel)
let wake = [];       // Khet-Tak-Tor's wake-of-fire segments (duel) — absorbable heat
let pulses = [];     // Khet-Tak-Tor's siphon-meltdown ring pulses (duel)
let allies = [];     // rescued villagers fighting at your side in the duel — each blocks one attack
let arsonT = 0;      // send-cadence timer
let intercepts = 0, edge = 0;   // imps you cut off this run + THE EDGE (town war balance; + you, - Khet-Tak-Tor)
let arsonSeen = false, huskSeen = false;   // first-imp / first-husk teach lines fire once
let keithPressureT = 0, keithPressureCount = 0, keithStrike = null, keithSummon = null;
let demonWell = null;                       // Keith's visible demon source
let maxHearts = 5;   // hearts of health — NOT fixed; the player can earn more. hp stays a 0..1 fraction,
                     // so the burn transformation is fraction-based; more hearts = proportionally tankier.
let RUN_HP_REGEN = K.HP_REGEN;   // per-run, set by applyUpgrades() from META (default = base)
let RUN_VENT_HEAL_T = K.VENT_HEAL_T; // seconds committed per heart; Well upgrades shorten this
let RUN_MAX_CHARGES = K.CHARGES, RUN_CHARGE_REFILL = K.CHARGE_REFILL;   // dash economy, upgraded at The Forge
// ---- META PROGRESSION: everything hangs off the villagers you SAVE. See loadMeta()/drawHub().
let rescueReward = null;        // brief grouped rescue payout, not another currency
let runStarterBonus = 0;         // one-time first-upgrade top-up, separate from earned rewards
let runEmbers = 0;               // embers minted this run (banked into META at run end)
let runSettled = false;          // one terminal event may bank this run and update its records
let hubScroll = 0, hubSheet = null, wellJustRose = false, hubToast = 0, hubToastMsg = '', hubBtns = [];

let diaryOpen = null, diaryPage = 0;   // null = chapter list; else the open chapter index
let sparks = [];   // absorb-flourish particles (fire streaming from a saved villager into you)
let onTitle = true;   // boot on the title/start screen; first tap dismisses it into the game
let titleResetConfirm = false;
let ghost = false;   // test-only: player passes through cells without triggering contact
let god = false;     // test-only: fuse refills instead of POPping, so long-run arena state is measurable

// ---- THE OPP: a rival built from how you played last session (persistent)
let runBuf = [], snipe = null, snipeArmed = false, snipeUsed = false,
    introT = 0, introKind = 'arbiter', callout = null, oppScarred = false, gotSniped = false;
let boss = null, duelActive = false, won = false, slagThisRun = 0, nextRiserAt = 0;
let powerups = [], surgeT = 0, mergeT = 0;
let loreT = 0;   // drip timer for Khet-Tak-Tor's reason-lore callouts
let overloadCd = 0;   // i-frame timer after a hunter overloads a lit player
let intro = null;   // { phase:'walkin'|'talk', i, lineT }  (null = not running)


function reset(seed){
  cancelPointer();
  if(seed !== undefined){ SEED = seed; }
  rnd = mulberry32(SEED);
  cells = []; slag = []; trail = []; rings = []; hist = [];
  score = 0; elapsed = 0; cooldowns = 0; armed = false; respawnT = 0;
  mode = 'play'; popCause = ''; nextId = 1; frame = 0; peakHunters = 0; noFireT = 0;
  boss = null; duelActive = false; won = false; slagThisRun = 0; nextRiserAt = 1e9;  // risers off (absorb loop)
  rescueReward=null;
  runEmbers = 0; runStarterBonus = 0; runSettled = false; applyUpgrades();      // fresh tally/settlement + purchased upgrades
  runDistrict = Math.min(5, Math.max(1, selDistrict||1));   // which district this run is (sets difficulty + Khet-Tak-Tor LV)
  runQuota = K.SAVE_QUOTA + (runDistrict-1)*2;              // deeper districts demand more saves before Khet-Tak-Tor rises
  powerups = []; surgeT = 0; mergeT = 0;
  hitstop = 0; slowmo = 0; flash = 0;
  hunterFuse = K.BURN_FUSE; sparkT = 0; heatCoolT = 0; dumped = 0; saved = 0; overloadT = 0; sparks = [];
  demons = []; cinderBlasts = [];
  arson = []; arsonT = 0; intercepts = 0; edge = 0; arsonSeen = false;
  keithPressureT = 0; keithPressureCount = 0; keithStrike = null; keithSummon = null;
  demonWell = null;
  husks = []; huskSeen = false; edgePop = 0;
  shots = []; wake = []; pulses = []; allies = []; demonKillSeen = false; pendCall = null;
  player = {
    x: VW/2, y: VH*0.62, hx: 0, hy: -1,   // heading
    spd: K.RUN, lunge: 0, charges: RUN_MAX_CHARGES, chargeT: 0, dashCd: 0, hurtCd: 0,
    venting: false, ventHeld: false, ventNoticeSent:false, ventUnit: null, ventDash: null, ventCd: 0, ventFlash: 0,
    knockT:0, knockX:0, knockY:0, wph: rnd()*7,  // vent, hit knockback + auto-wander phase
    bracing: false, r: K.R_PLAYER,
    lit: true, fuse: K.FUSE_START,        // legacy (kept for skins); real state is heat
    heat: 0,                              // ABSORBER: fires currently carried (0..HEAT_MAX)
    hp: 1,                                // HEALTH (0..1): burns down while carrying fire, recovers when clear
    passeeId: 0, passT: 999, passVal: 0,
    autoTarget: null, autoSightX: VW/2, autoSightY: VH/2, autoSightT: 0,
  };
  setupOpp();                                 // grudge wall + snipe, before crowd so they avoid it
  for(let i=0;i<K.CROWD_START;i++) spawnCrowd(true);
  // state the objective plainly on run start (the intro's dialogue box covers the very first boot)
  if(!intro) callout = { text:'STOP DEMONS · CARRY HEAT · TOUCH RATKIN TO FREE THEM', t:0, life:3.4, good:null };
  if(typeof CG!=='undefined') CG.start();     // CrazyGames: a run begins
}

function spawnCrowd(initial){
  let x, y, tries = 0;
  do{
    x = 40 + rnd()*(VW-80);
    y = 90 + rnd()*(VH-180);
    tries++;
  } while(tries < 30 && (dist(x,y,player.x,player.y) < (initial?170:260) || nearSlag(x,y,K.R_CELL+6) || nearObstacle(x,y,K.R_CELL+8)));
  cells.push({
    id: nextId++, x, y, vx:0, vy:0, hunter:false, fuse:0, grace:0, born:elapsed,
    ph: rnd()*Math.PI*2, ps: 0.5 + rnd()*0.7, dir: rnd()*Math.PI*2,
  });
}

// ---------------------------------------------------------------- helpers
function dist(ax,ay,bx,by){ let dx = wrapDX(ax-bx), dy = ay-by; return Math.hypot(dx,dy); }
function wrapDX(dx){ return dx; }   // arena is enclosed (solid side walls) — no horizontal wrap
function nearSlag(x,y,r){ for(const s of slag){ if(dist(x,y,s.x,s.y) < r + K.R_SLAG) return true; } return false; }

// ---- STATIC MAP OBSTACLES: the props baked into the Makko backdrop (well, wagon, barrels, crates) are SOLID,
// like the border walls. Coords are in game space (720x1280), tuned to line up with the art.
// circle prop: {x,y,r}; box prop: {x,y,w,h} with x,y = top-left. (window.OBS_DEBUG draws them for tuning.)
const OBSTACLES = [
  { x:0,   y:26,   w:193, h:182, label:'crates-TL' },    // two-crate stack, top-left — both boxes, wider right; stops above the floor gap
  { x:10,  y:293,  w:120, h:185, label:'barrels-L' },    // barrel cluster: top raised 3px; bottom stays at 478
  { x:480, y:285,  w:220, h:222, label:'wagon-R' },      // broken wagon, right — covers the raised end + left planks/shovel
  { x:600, y:512,  w:100, h:95,  label:'crates-R' },     // pot/sack below the wagon (3px taller at top)
  { x:133, y:1117, r:90,  label:'well-BL' },             // the well, bottom-left — big enough to cover the whole stone rim
  { x:470, y:1028, w:230, h:204, label:'crates-BR' },    // crate + plank pile, bottom-right (under the mobile HEAL/vent button)
];
// Push a circle entity (radius er) out of every obstacle it overlaps. Records the last surface normal on
// e._nx/e._ny (for deflecting a heading). Returns true if it corrected anything.
function collideObstacles(e, er){
  let hit = false;
  for(const o of OBSTACLES){
    if(o.r != null){                                     // circle prop
      const dx = e.x-o.x, dy = e.y-o.y, d = Math.hypot(dx,dy), min = er+o.r;
      if(d < min && d > 0.001){ e.x = o.x+dx/d*min; e.y = o.y+dy/d*min; e._nx = dx/d; e._ny = dy/d; hit = true; }
    } else {                                             // box prop: resolve against nearest point
      const cx = Math.max(o.x, Math.min(e.x, o.x+o.w)), cy = Math.max(o.y, Math.min(e.y, o.y+o.h));
      const dx = e.x-cx, dy = e.y-cy, d = Math.hypot(dx,dy);
      if(d < er){
        if(d > 0.001){ e.x = cx+dx/d*er; e.y = cy+dy/d*er; e._nx = dx/d; e._ny = dy/d; }
        else {                                           // center inside: eject along the shallowest axis
          const l = e.x-o.x, rgt = o.x+o.w-e.x, t = e.y-o.y, b = o.y+o.h-e.y, m = Math.min(l,rgt,t,b);
          if(m===l){ e.x = o.x-er; e._nx=-1; e._ny=0; } else if(m===rgt){ e.x = o.x+o.w+er; e._nx=1; e._ny=0; }
          else if(m===t){ e.y = o.y-er; e._nx=0; e._ny=-1; } else { e.y = o.y+o.h+er; e._nx=0; e._ny=1; }
        }
        hit = true;
      }
    }
  }
  return hit;
}
function nearObstacle(x,y,r){ const e={x,y}; return collideObstacles(e, r); }   // (mutates a throwaway; ok for spawn tests)
function hunters(){ return cells.filter(c=>c.hunter); }                 // flaming villagers
function crowd(){ return cells.filter(c=>!c.hunter && !c.saving); }     // calm, still-present villagers
function nearestFrom(p, items){
  let best=null, bestD=Infinity;
  for(const item of items){const d=dist(p.x,p.y,item.x,item.y);if(d<bestD){best=item;bestD=d;}}
  return best;
}
// Default play does useful work: rescue first, clear demons second, wander only when safe.
// Manual keys and dashes remain the optimization layer and always override this heading.
function autoRunTarget(p){
  const burning=hunters().filter(c=>!c.dead&&!c.saving&&!c.sanctuaryId);
  if(burning.length)return nearestFrom(p,burning);
  if(rescueHeatAvailable(p)>=K.REKINDLE_COST){
    const rescuable=crowd().filter(c=>!c.dead&&!c.sanctuaryId&&!(c.grace>0)).concat(husks.filter(h=>!h.sanctuaryId));
    if(rescuable.length)return nearestFrom(p,rescuable);
  }
  // Intercept incoming imps for heat before they ignite a villager.
  return nearestFrom(p,demons.concat(arson));
}
// Runner guidance follows periodic sightings rather than calculating a perfect live intercept.
// Demons retain live tracking because touching one without an intentional dash still hurts Duy.
function autoRunAim(p,target,dt){
  if(!target){p.autoTarget=null;p.autoSightT=0;return null;}
  if(!target.hunter)return target;
  p.autoSightT-=dt;
  if(p.autoTarget!==target || p.autoSightT<=0){
    p.autoTarget=target;p.autoSightX=target.x;p.autoSightY=target.y;p.autoSightT=K.AUTO_SIGHT;
  }
  return {x:p.autoSightX,y:p.autoSightY};
}
function turnToward(p,target,dt){
  const desired=Math.atan2(target.y-p.y,wrapDX(target.x-p.x)), current=Math.atan2(p.hy,p.hx);
  const delta=Math.atan2(Math.sin(desired-current),Math.cos(desired-current));
  const turn=Math.max(-K.AUTO_TURN*dt,Math.min(K.AUTO_TURN*dt,delta)), angle=current+turn;
  p.hx=Math.cos(angle);p.hy=Math.sin(angle);
}
function ring(x,y,r0,r1,col,life){ rings.push({x,y,r0,r1,col,t:0,life:life||0.35}); }
// ring() calls now render as soft GLOW POPS (see the render loop) — no more hard flashing circles.
function hexRGB(h){ if(typeof h!=='string' || h[0]!=='#') return '255,210,150';
  h=h.slice(1); if(h.length===3) h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  const n=parseInt(h,16); return ((n>>16)&255)+','+((n>>8)&255)+','+(n&255); }


// A targeted Ratkin sees its pursuer even across the arena. Passing threats
// also frighten nearby residents; panic does not ignite them or award a rescue.
function villagerThreat(c){
  let best=null, nearest=Infinity;
  for(const threat of [...demons,...arson]){
    const distance=dist(c.x,c.y,threat.x,threat.y);
    if(!threat.dead && (threat.tgt===c || distance<=K.FLEE_RANGE) && distance<nearest){
      best=threat;nearest=distance;
    }
  }
  for(const other of cells){
    if(other===c || other.dead || other.saving || !other.hunter)continue;
    const distance=dist(c.x,c.y,other.x,other.y);
    if(distance<K.FLEE_RANGE*.7 && distance<nearest){best=other;nearest=distance;}
  }
  return best;
}
function stepCalmVillager(c,dt){
  const threat=villagerThreat(c);
  if(threat){
    c.panicT=K.PANIC_HOLD;
    const dx=wrapDX(c.x-threat.x),dy=c.y-threat.y;
    c.panicDir=Math.hypot(dx,dy)>.001?Math.atan2(dy,dx):(c.dir||0);
  }else c.panicT=Math.max(0,(c.panicT||0)-dt);
  if(c.panicT>0){
    c.vx=Math.cos(c.panicDir)*K.FLEE_SPD;c.vy=Math.sin(c.panicDir)*K.FLEE_SPD;
  }else{
    c.ph+=c.ps*dt;
    c.wanderT=(c.wanderT||0)+dt;
    if(c.wanderT>(c.wanderNext||0)){c.dir=rnd()*Math.PI*2;c.wanderT=0;c.wanderNext=.7+rnd()*1.6;}
    c.vx=Math.cos(c.dir+Math.sin(c.ph)*.7)*K.WANDER_SPD;
    c.vy=Math.sin(c.dir+Math.sin(c.ph)*.7)*K.WANDER_SPD;
  }
}

// ---------------------------------------------------------------- step
function step(){
  if(debugMenu.open)return;
  frame++;
  if(onTitle) return;                                // title screen: only animate (frame++), no sim
  if(hitstop > 0){ hitstop -= DT; return; }          // hitstop freezes the sim
  if(mode !== 'play') return;
  if(keithSummon){ keithSummon.t += DT; if(keithSummon.t >= keithSummon.life) keithSummon = null; }
  if(introT > 0){ introT -= DT; if(introT < 0) introT = 0; return; }  // cold-open reveal, sim frozen

  // ---- LIVE intro: sim runs the whole time. During 'walkin' the player auto-walks up as a human;
  // during 'talk' the dialogue box advances line by line over normal gameplay.
  const introWalk = intro && intro.phase === 'walkin';
  if(intro){
    intro.lineT += DT;
    if(intro.phase === 'talk'){
      const line = STORY.intro[intro.i];
      if(!line){ intro = null; }
      else {
        const full = line.text.length * INTRO.TALK_CHAR;
        if(intro.lineT >= full && !intro.recorded){
          rememberDialogue(line);intro.recorded=true;
        }
      }
    }
  }

  tickPresentDialogue(DT);
  const scale = slowmo > 0 ? K.SLOWMO_SCALE : 1;
  const dt = DT * scale;
  if(slowmo > 0) slowmo -= DT;
  if(surgeT > 0) surgeT -= dt;
  elapsed += dt;
  if(flash > 0) flash -= DT;

  // (vent is triggered only by the VENT button or SPACE — never by a stray hold — so it can't misfire)

  // ---- player
  const p = player;
  if(p.dashCd > 0) p.dashCd -= dt;
  if(p.hurtCd > 0) p.hurtCd -= dt;
  if(p.knockT > 0) p.knockT = Math.max(0,p.knockT-dt);
  if(p.ventCd > 0) p.ventCd -= dt;
  if(p.ventFlash > 0) p.ventFlash -= dt;
  // DASH CHARGES recharge over time (max + speed set by The Forge upgrades)
  if(dashPop > 0) dashPop -= dt*2.2;
  if(edgePop > 0) edgePop -= dt*2.0;
  if(p.charges < RUN_MAX_CHARGES){ p.chargeT += dt;
    while(p.chargeT >= RUN_CHARGE_REFILL && p.charges < RUN_MAX_CHARGES){ p.chargeT -= RUN_CHARGE_REFILL; p.charges++; dashPop = 0.55; } }
  else p.chargeT = 0;

  // AUTO-RUN: you never stop. With no steering, seek the nearest burning villager, then the nearest
  // demon. Only a safe field falls back to the old weave. Manual steering and dashes stay authoritative.
  const burn = Math.max(0, Math.min(1, 1 - (p.hp!=null ? p.hp : 1)));   // 0 healthy .. 1 near death
  if(p.lunge <= 0 && p.knockT <= 0 && !introWalk){
    const v = heldVec();
    if(v){ p.autoTarget=null;p.autoSightT=0;p.hx = v[0]; p.hy = v[1]; }  // manual input takes over and clears the old sighting
    else { const target=autoRunTarget(p);
      const aim=autoRunAim(p,target,dt);
      if(aim) turnToward(p,aim,dt);
      else { const w = (K.WEAVE + burn*K.WEAVE_BURN) * Math.sin(frame*0.05 + p.wph) * dt;
        const a = Math.atan2(p.hy, p.hx) + w; p.hx = Math.cos(a); p.hy = Math.sin(a); } }
  }
  if(p.knockT > 0){ p.hx=p.knockX;p.hy=p.knockY;p.spd=K.DEMON_KNOCK_SPD; }
  else if(p.lunge > 0){ p.lunge -= dt; p.spd = K.LUNGE_SPD; }
  else { const run = K.RUN * (1 + burn*K.FRANTIC_SPD);                  // frantic = faster as you burn
    p.spd = p.spd > run ? Math.max(run, p.spd - 1600*dt) : run; }       // ease down from a dash, never below run
  if(p.venting) p.spd = 0;                                              // venting ROOTS you — exposed while you heal
  p.r = K.R_PLAYER;
  if(introWalk){ p.hx = 0; p.hy = -1; p.spd = INTRO.WALK; p.venting = false; }  // scripted entrance

  p.x += p.hx*p.spd*dt;
  p.y += p.hy*p.spd*dt;
  if(p.x < K.EDGE){ p.x = K.EDGE; p.hx = Math.abs(p.hx); p.knockT=0; }        // bounce off the LEFT/RIGHT walls too
  if(p.x > VW-K.EDGE){ p.x = VW-K.EDGE; p.hx = -Math.abs(p.hx); p.knockT=0; }
  if(p.y < 40){ p.y = 40; p.hy = Math.abs(p.hy); p.knockT=0; }
  if(p.y > VH-40){ p.y = VH-40; p.hy = -Math.abs(p.hy); p.knockT=0; }
  if(collideObstacles(p, p.r)){                                   // props are solid like the borders
    if(p._nx!=null){ p.hx = p._nx; p.hy = p._ny; }               // deflect the auto-run heading off the prop
    if(p.lunge > 0){ p.lunge = 0; p.spd = 0; }                    // a dash into a prop stops dead (like slag)
    if(p.knockT > 0) p.knockT=0;                                  // props stop knockback instead of trapping Duy inside them
  }
  if(introWalk && p.y <= VH*INTRO.IGNITE_Y){ igniteIntro(); }   // reached the middle -> catch fire

  // Complete committed units even after release; only a held button starts another.
  ventHold(dt);
  stepHusks(dt);
  stepDemonWell(dt);
  stepDemons(dt);
  if(mode !== 'play') return;                            // a demon (or purge) may have ended the run
  if(p.heat > 0){ p.trailT = (p.trailT||0) + dt;         // heat trail (ember wisps) while carrying
    while(p.trailT >= K.TRAIL_EVERY){ p.trailT -= K.TRAIL_EVERY; trail.push({x:p.x,y:p.y,t:0}); } }
  p.lit = p.heat > 0;                                   // legacy flag some draws read
  // ---- HEALTH: carrying fire burns you down (faster the more you hold). Venting heals (in ventHold);
  // otherwise only a faint idle trickle. So you MUST vent to recover — and eat the demons.
  // Protect only the scripted walk-in. Once the live intro is talking, the
  // arena remains active and the player must be able to take damage while
  // the line waits for an explicit tap.
  if(god || introWalk){ p.hp = 1; }
  else if(p.venting){ /* healing handled in ventHold(); no burn while purging it out */ }
  else if(p.heat > 0){ p.hp -= dt * p.heat * K.HP_DRAIN * (5/maxHearts);   // more hearts -> burn slower
    if(p.hp <= 0){ p.hp = 0; pop('burned up'); return; } }
  else { p.hp = Math.min(1, p.hp + dt * RUN_HP_REGEN); }   // faint idle trickle only
  p.passT += dt;

  // ---- SHATTER: a lunge into slag destroys it, terminates the burst
  if(p.lunge > 0){
    for(let i=slag.length-1;i>=0;i--){
      const s = slag[i];
      if(dist(p.x,p.y,s.x,s.y) < p.r + K.R_SLAG){
        slag.splice(i,1);
        p.lunge = 0; p.spd = 0;                       // you stop dead at the block
        if(p.lit) p.fuse = Math.max(0.001, p.fuse - K.SHATTER_COST);
        ring(s.x,s.y,K.R_SLAG,44,'#7c8496',0.30);
        hitstop = K.HITSTOP*0.6;
        if(s.grudge){
          snipeArmed=false;snipeUsed=true;oppScarred=true;
          speakKeith(lineFor('broken'),'strained');
        }
        break;
      }
    }
  } else {
    // not lunging: slag is solid, push out
    for(const s of slag){
      const dx = wrapDX(p.x-s.x), dy = p.y-s.y, d = Math.hypot(dx,dy), min = p.r + K.R_SLAG;
      if(d < min && d > 0.001){
        p.x += (dx/d)*(min-d); p.y += (dy/d)*(min-d);
        p.hx = dx/d; p.hy = dy/d;                     // deflect off the wall you made
      }
    }
  }

  // ---- player position history (hunter reaction lag)
  hist.push({x:p.x,y:p.y});
  const histMax = Math.ceil(K.HUNTER_LAG/DT)+2;
  while(hist.length > histMax) hist.shift();
  const lag = hist[0] || p;

  // ---- cells
  for(const c of cells){
    if(c.grace > 0) c.grace -= dt;
    if(c.hunter){
      // FLAMING villager: burns down to a wall if you don't reach them; PANICS (catchable); spreads.
      c.fuse -= dt;
      if(c.fuse <= 0){ becomeHusk(c); continue; }      // too slow -> the fire finishes them into a husk
      c.ph += c.ps*2.2*dt;
      const ang = c.dir + Math.sin(c.ph)*2.2 + Math.sin(c.ph*0.37)*1.1;
      c.vx = Math.cos(ang)*K.PANIC_SPD; c.vy = Math.sin(ang)*K.PANIC_SPD;
      c.spreadT = (c.spreadT||0) + dt;                 // fire jumps to a nearby calm villager
      if(c.spreadT >= K.SPREAD_EVERY){ c.spreadT = 0;
        for(const o of cells){ if(!o.hunter && o.grace<=0 && !o.saving &&
          dist(c.x,c.y,o.x,o.y) < K.SPREAD_R && rnd() < K.SPREAD_CHANCE){ ignite(o,'spread'); break; } }
      }
    } else {
      // Unburned residents flee incoming threats; rescued residents ascend in place.
      if(c.saving){ c.vx = 0; c.vy = 0;                // TELEPORT: frozen while the save animation plays out
        c.saveT = (c.saveT||0)+dt; if(c.saveT > K.SAVE_ANIM_DUR) c.dead = true; }
      else stepCalmVillager(c,dt);
    }
    c.x += c.vx*dt; c.y += c.vy*dt;
    if(c.x < K.EDGE){ c.x = K.EDGE; c.vx = Math.abs(c.vx); c.dir = Math.PI - c.dir; }
    if(c.x > VW-K.EDGE){ c.x = VW-K.EDGE; c.vx = -Math.abs(c.vx); c.dir = Math.PI - c.dir; }
    if(c.y < 40){ c.y = 40; c.vy = Math.abs(c.vy); c.dir = -c.dir; }
    if(c.y > VH-40){ c.y = VH-40; c.vy = -Math.abs(c.vy); c.dir = -c.dir; }
    // slag is solid for cells too
    for(const s of slag){
      const dx = wrapDX(c.x-s.x), dy = c.y-s.y, d = Math.hypot(dx,dy), min = K.R_CELL + K.R_SLAG;
      if(d < min && d > 0.001){ c.x += (dx/d)*(min-d); c.y += (dy/d)*(min-d); c.dir += 2.2; }
    }
    if(!c.saving && collideObstacles(c, K.R_CELL)){ c.dir += 2.4; }   // props are solid for villagers too
  }
  cells = cells.filter(c=>!c.dead);

  // ---- boss update (riser or apex Khet-Tak-Tor)
  if(boss && mode === 'play'){
    const b = boss;
    if(b.state === 'rising' || b.state === 'stagger'){
      b.t -= dt; if(b.t <= 0) b.state = 'idle';
    } else {
      if(b.state === 'lit'){
        b.fuse -= dt;
        if(b.fuse <= 0){ bossDown(); }
        else if(b.kind === 'arbiter'){
          // lit Khet-Tak-Tor hunts YOU to shed it back — pursue your lagged position, ramping speed
          const t = 1 - b.fuse/K.ARBITER_FUSE;
          const spd = K.ARBITER_PUR0 + (K.ARBITER_PUR1-K.ARBITER_PUR0)*t;
          const dx = wrapDX(lag.x-b.x), dy = lag.y-b.y, dd = Math.hypot(dx,dy)||1;
          b.vx = dx/dd*spd; b.vy = dy/dd*spd;
        } else {
          // lit riser does what everyone in this world does: sheds onto the nearest body
          const pool = crowd(); let tgt = null, bd = 1e9;
          for(const c of pool){ const d = dist(b.x,b.y,c.x,c.y); if(d < bd){ bd = d; tgt = c; } }
          const gx = tgt ? tgt.x : p.x, gy = tgt ? tgt.y : p.y;
          const dx = wrapDX(gx-b.x), dy = gy-b.y, dd = Math.hypot(dx,dy)||1;
          b.vx = dx/dd*165; b.vy = dy/dd*165;
          if(tgt && bd < b.r + K.R_CELL){
            ignite(tgt, 'riser'); b.state = 'idle'; b.fuse = 0;
            callout = { text: STORY.riser.shed, t:0, life:1.2, good:false };
          }
        }
      } else {                                        // unlit
        if(b.kind === 'arbiter'){
          const ctl = stepArbiterMoves(b, dt);          // movesets drive him during a move
          if(!ctl){                                    // otherwise he evades — herding him is the offense
            const dx = wrapDX(b.x-p.x), dy = b.y-p.y, dd = Math.hypot(dx,dy)||1;
            if(dd < 300){ b.vx = dx/dd*K.ARBITER_FLEE; b.vy = dy/dd*K.ARBITER_FLEE; }
            else { b.vx *= 0.9; b.vy *= 0.9; }
          }
        } else {
          // riser hunts the crowd, tagging them lit — the fire spreading on its own
          b.tagCd -= dt;
          const pool = crowd(); let tgt = null, bd = 1e9;
          for(const c of pool){ const d = dist(b.x,b.y,c.x,c.y); if(d < bd){ bd = d; tgt = c; } }
          if(tgt){
            const dx = wrapDX(tgt.x-b.x), dy = tgt.y-b.y, dd = Math.hypot(dx,dy)||1;
            b.vx = dx/dd*K.RISER_SPD; b.vy = dy/dd*K.RISER_SPD;
            if(bd < b.r + K.R_CELL && b.tagCd <= 0){
              ignite(tgt, 'riser'); b.tagCd = K.RISER_TAG_CD;
              ring(tgt.x, tgt.y, 8, 44, '#ff6a2e', 0.3);
            }
          } else { b.vx *= 0.9; b.vy *= 0.9; }
        }
      }
      b.x += b.vx*dt; b.y += b.vy*dt;
      if(b.x < K.EDGE){ b.x = K.EDGE; b.vx = Math.abs(b.vx); } if(b.x > VW-K.EDGE){ b.x = VW-K.EDGE; b.vx = -Math.abs(b.vx); }
      if(b.y < 40) b.y = 40; if(b.y > VH-40) b.y = VH-40;
      // slag is solid for bosses too — cornering Khet-Tak-Tor against your walls IS the fight
      for(const s of slag){
        const dx = wrapDX(b.x-s.x), dy = b.y-s.y, d = Math.hypot(dx,dy), min = b.r + K.R_SLAG;
        if(d < min && d > 0.001){ b.x += (dx/d)*(min-d); b.y += (dy/d)*(min-d); }
      }
      collideObstacles(b, b.r);                                     // props corner Khet-Tak-Tor too
      // player contact: DUMP the fire you're carrying into Khet-Tak-Tor (he lit it; he can hold it).
      // Corner him against your walls, unload your heat. Enough dumped -> he yields.
      if(!ghost && p.heat > 0 && dist(p.x,p.y,b.x,b.y) < p.r + b.r && !b.shield){
        dumped += p.heat; b.downs = dumped;                 // reuse downs as the dumped-heat tally
        ring(b.x, b.y, b.r+6, 120, '#ff9a2e', 0.6); ring(b.x, b.y, b.r, 80, '#ffd18a', 0.5);
        p.heat = 0; heatCoolT = 0; overloadT = 0;
        score += 150; hitstop = K.HITSTOP; flash = DT*2;
        b.move = null; b.moveTele = 0;                       // a solid dump interrupts whatever he was winding up
        speakKeith(STORY.duel.tag[(dumped) % STORY.duel.tag.length],'strained');
        b.state = 'stagger'; b.t = 0.5; b.moveCd = Math.max(b.moveCd, 1.2);   // he reels
        if(dumped >= (b.dumpNeeded||K.DUEL_DUMP)){ winDuel(); }
      }
    }
  }

  if(duelActive && boss && mode === 'play') stepDuelFX(dt);   // Khet-Tak-Tor's projectiles / wake / pulses / your allies
  if(mode !== 'play') return;   // victory or a lethal boss hit already banked this run; stop earning/mutating it

  // ---- trail (heat wisps; no longer ignites anyone — you carry fire OUT, not around)
  for(const t of trail) t.t += dt;
  trail = trail.filter(t=>t.t < K.TRAIL_LIFE);

  // ---- absorb-flourish sparks: fire streaming into you (home on the player, curling in)
  for(const s of sparks){ s.t += dt; const k = s.t/s.life;
    if(s.out){ const drag = 1 - Math.min(0.9, dt*3.4);        // VENT: blast outward, decelerate
      s.x += s.vx*dt; s.y += s.vy*dt; s.vx*=drag; s.vy*=drag; continue; }
    const dx = wrapDX(p.x - s.x), dy = p.y - s.y, d = Math.hypot(dx,dy)||1;
    const pull = 6 + 22*k;                                    // accelerate inward
    s.x += (dx/d)*pull + (-dy/d)*s.sw*(1-k);                  // + tangential swirl that eases out
    s.y += (dy/d)*pull + (dx/d)*s.sw*(1-k); }
  sparks = sparks.filter(s => s.t < s.life);
  if(p.absorbPop) p.absorbPop = Math.max(0, p.absorbPop - dt*1.6);
  if(rescueReward){rescueReward.t-=dt;if(rescueReward.t<=0)rescueReward=null;}
  if(saveIconPop) saveIconPop = Math.max(0, saveIconPop - dt*2.2);

  // Contact frees burning Ratkin by absorbing heat, or calm Ratkin by spending one heat.
  for(const c of (ghost ? [] : cells)){
    if(c.dead || c.grace > 0 || c.saving || c.sanctuaryId) continue;
    if(dist(p.x,p.y,c.x,c.y) > p.r + K.R_CELL) continue;
    if(c.hunter){absorb(c);break;}
    if(releaseCell(c))break;
  }

  // ---- Keith sends fire imps in from the edges, each flying to a
  // chosen villager to torch it. Cut the imp off (run/dash into it) to INTERCEPT — eat its fire, mint embers, bank
  // an edge against Keith. Miss it, and the villager catches. The duel keeps a slower stream alive because rescues
  // and interceptions are the heat supply required to hurt him; stopping them can make the fight unwinnable.
  if(!introWalk){
    arsonT += dt;
    const cadence = duelActive
      ? Math.max(K.DUEL_ARSON_MIN, K.DUEL_ARSON_EVERY - (runDistrict-1)*0.15)
      : Math.max(K.ARSON_MIN, K.ARSON_EVERY - elapsed*0.012 - (runDistrict-1)*0.22);
    if(arsonT >= cadence){ arsonT = 0; spawnArson(); }
  }
  stepArson(dt);
  stepKeithPressure(dt);
  respawnT += dt;
  if(respawnT >= K.CROWD_RESPAWN){ respawnT = 0;
    if(crowd().length + hunters().length < K.CROWD_CAP) spawnCrowd(false);
  }

  // ---- THE FINALE: save enough of the town and Khet-Tak-Tor rises to be dealt with
  if(!duelActive && !won && saved >= runQuota){ startDuel(); }

  const hn = hunters().length;
  if(hn > peakHunters) peakHunters = hn;

  // ---- walls fuse into powerups; collect for a SURGE
  if(!duelActive){
    mergeT += dt;
    if(mergeT >= K.MERGE_EVERY){ mergeT = 0; mergeCheck(); }
  }
  for(const pu of powerups) pu.t += dt;
  for(let i=powerups.length-1;i>=0;i--){
    if(dist(p.x,p.y,powerups[i].x,powerups[i].y) < p.r + K.POWERUP_R){ collectPowerup(powerups[i]); powerups.splice(i,1); }
  }

  // ---- THE OPP: the remembered beacon fires when it reads the start of a vent.
  // beginVentUnit() arms the telegraph; finishing the committed unit still leaves time to dash clear.
  if(snipe && !snipe.done){
    snipe.t += dt;
    if(snipe.t >= K.OPP_SNIPE_TELE){
      snipe.done = true;
      if(p.hurtCd<=0 && dist(p.x, p.y, snipe.tx, snipe.ty) < K.OPP_SNIPE_R){
        p.hp=Math.max(0,p.hp-K.OPP_SNIPE_HEARTS/maxHearts);p.hurtCd=K.HURT_IFRAME;
        gotSniped = true;
        ring(p.x, p.y, 10, 80, '#ff3d7a', 0.6);
        speakKeith(lineFor('sniped')); flash = DT*2; hitstop = K.HITSTOP;
        if(p.hp<=0){pop('Khet-Tak-Tor read your vent');return;}
      } else {
        oppScarred = true;                                        // read broken, scar the grudge wall
        ring(snipe.tx, snipe.ty, K.OPP_SNIPE_R, 6, '#7fe8ff', 0.4);
        speakKeith(lineFor('broken'),'strained');
      }
    }
  } else if(snipe && snipe.done){ snipe.lt += dt; if(snipe.lt > 0.5) snipe = null; }
  if(callout){ callout.t += dt; if(callout.t >= callout.life) callout = null; }
  if(pendCall){ pendCall.t -= dt; if(pendCall.t <= 0){ callout = { text:pendCall.text, t:0, life:1.8, good:pendCall.good }; pendCall = null; } }

  // ---- rings
  for(const r of rings) r.t += dt;
  rings = rings.filter(r=>r.t < r.life);
}

// ---------------------------------------------------------------- events
function doPass(c){
  const p = player;
  // THE OPP records the DECISION, never the score: how late (fuse) + where (grid cell).
  if(mode === 'play'){
    let col = Math.floor((((c.x%VW)+VW)%VW) / (VW/K.OPP_COLS));
    let row = Math.floor(Math.max(0, Math.min(VH-1, c.y)) / (VH/K.OPP_ROWS));
    col = Math.max(0, Math.min(K.OPP_COLS-1, col));
    row = Math.max(0, Math.min(K.OPP_ROWS-1, row));
    runBuf.push({ lateness: p.fuse, col, row });
  }
  const val = Math.round(60 + 340*(1 - p.fuse/K.FUSE_MAX));
  const clutch = p.fuse < K.CLUTCH_FUSE;
  score += val;
  p.lit = false; p.fuse = 0;
  p.passeeId = c.id; p.passT = 0; p.passVal = val;
  ignite(c, 'pass');
  ring(c.x,c.y,10,72,'#ff9a2e',0.36);
  hitstop = K.HITSTOP; flash = DT*2;
  if(clutch) slowmo = K.SLOWMO_T;
}

function doEat(c){
  const p = player;
  const backpass = (c.id === p.passeeId && p.passT >= K.IMMUNE && p.passT <= K.BACKPASS_END);
  p.lit = true;
  p.fuse = Math.min(c.fuse, K.FUSE_MAX);
  c.hunter = false; c.fuse = 0; c.dir = rnd()*Math.PI*2;    // reverts to a dark crowd body
  c.grace = K.GRACE;                                        // ...but you can't instantly dump back into it
  if(backpass){ score += Math.round(p.passVal * K.BACKPASS_MULT); ring(c.x,c.y,10,110,'#ffe66d',0.5); }
  else ring(c.x,c.y,10,58,'#5fd4ff',0.30);
  p.passeeId = 0;
  hitstop = K.HITSTOP; flash = DT*2;
}

// a hunter catching a LIT player shoves its burn onto you: fuse jumps toward the pop.
// the hunter spends itself doing it (reverts to a dark body), and you get brief i-frames.
function overloadHit(c){
  const p = player;
  overloadCd = K.OVERLOAD_IFRAME;
  hitstop = K.HITSTOP; flash = DT*2;
  ring(p.x, p.y, p.r+4, 90, '#ff3d2e', 0.55);
  p.fuse -= K.OVERLOAD_PENALTY;
  becomeSlag(c);          // it poured its fire into you and collapsed into a wall (solid -> shoves you off, no glue-loop)
  if(p.fuse <= 0){ p.fuse = 0; if(!god){ pop('the fire took you'); return; } p.fuse = K.CLUTCH_FUSE; }
  callout = { text: STORY.overload[Math.floor(rnd()*STORY.overload.length)], t:0, life:1.3, good:false };
}

function ignite(c, why){
  if(why!=='cinder' && hunters().length >= K.HUNTER_CAP){ becomeHusk(c); return; }   // a cinder blast ignites; it never instantly consumes its victims
  c.hunter = true; c.fuse = hunterFuse; c.grace = K.GRACE; c.saving = false; c.spreadT = 0;
  // Bolt away before resuming erratic panic, so nearby ignition begins a chase instead of a free contact save.
  const dx=wrapDX(c.x-player.x),dy=c.y-player.y;
  c.dir=(Math.abs(dx)+Math.abs(dy)>0.001?Math.atan2(dy,dx):rnd()*Math.PI*2)+(rnd()-0.5)*0.7;c.ph=0;
  ring(c.x,c.y,8,44,'#ff6a2e',0.30);
}

// ABSORB: pull the fire off a flaming villager. They ascend into light (saved); you take
// their heat. The ratkin ascend; holding heat burns Duy (handled in step).
// Save ONE villager (the teleport-to-light rescue). chained=true = swept up by a hot chain (no extra heat gain).
function showRescueReward(embers){
  if(rescueReward && rescueReward.t>0.8){rescueReward.embers+=embers;rescueReward.count++;rescueReward.t=1.15;}
  else rescueReward={embers,count:1,t:1.15};
}
// A heat unit already committed to venting cannot also pay for an ascension.
function rescueHeatAvailable(p=player){return Math.max(0,p.heat-(p.ventUnit?.kind==='heat'?1:0));}
function saveCell(c, chained, spendHeat=false){
  if(c.dead||c.saving||c.sanctuaryId)return false;
  const p = player;
  if(spendHeat && rescueHeatAvailable(p)<K.REKINDLE_COST)return false;
  if(!chained) recordOppRescue(c,p.heat);
  if(c.siphon && boss && boss.shield){ c.siphon = false; boss.shieldN = Math.max(0, (boss.shieldN||0)-1);   // strip Khet-Tak-Tor's shield
    if(boss.shieldN <= 0){ boss.shield = false; callout = { text:'SHIELD BROKEN — DUMP NOW!', t:0, life:1.2, good:true }; } }
  c.rescueState=spendHeat?(c.rekindled?'cinder':'calm'):'flaming';
  c.hunter = false; c.fuse = 0; c.grace = K.GRACE;
  c.saving = true; c.saveT = 0; c.dir = 0; c.svx = 0; c.svy = 0;   // freeze in place — the anim lifts them into the light
  saved++;
  if(!chained) notePresentEvent(spendHeat?'ascend':'rescue');
  const blaze = 1 + p.heat*K.BLAZE_MULT;                  // the more fire you're carrying, the bigger the save
  score += Math.round(K.SAVE_SCORE * blaze);
  if(blaze > META.bestBlaze) META.bestBlaze = blaze;
  const em = Math.round(K.EMBER_BASE * blaze);
  runEmbers += em; societyArrive(c);META.saved++;showRescueReward(em);
  for(let i=0;i<10;i++){ const a=rnd()*Math.PI*2, r=K.R_CELL*(0.4+rnd()*0.9);   // flourish: fire streams off them
    sparks.push({ x:c.x+Math.cos(a)*r, y:c.y+Math.sin(a)*r, t:0, life:0.30+rnd()*0.22, sw:(rnd()-0.5)*7, hue:spendHeat?150:20+rnd()*35 }); }
  saveIconPop = 0.6; ring(c.x, c.y, K.R_CELL+2, 90, '#8affc1', 0.6);
  edge += chained ? 0.5 : (K.SAVE_EDGE + p.heat*K.SAVE_EDGE_HEAT);   // THE EDGE: hotter saves win more of the town
  edgePop = 0.5;
  if(spendHeat)p.heat=Math.max(0,p.heat-K.REKINDLE_COST);
  else if(!chained)p.heat=Math.min(K.HEAT_MAX,p.heat+1);
  p.lit=p.heat>0;
  if(!chained){p.absorbPop=0.28;ring(p.x,p.y,p.r+6,80,'#ffcf7a',0.55);hitstop=K.HITSTOP*0.8;flash=DT*1.5;}
  return true;
}
function releaseCell(c){
  if(c.hunter || !saveCell(c,false,true))return false;
  callout={text:'ASCENDED! -1 HEAT',t:0,life:1.0,good:true};
  return true;
}
// ABSORB: run into a flaming villager. The fire you ALREADY carry arcs to nearby flaming villagers and saves
// up to floor(heat) more in the same beat — so holding heat = pop a whole burning cluster at once.
function absorb(c){
  const p = player, reach = Math.floor(p.heat);
  if(!saveCell(c, false))return;
  let chained = 0;
  if(reach > 0){
    const near = cells.filter(o=>o!==c && o.hunter && o.grace<=0 && !o.saving && dist(o.x,o.y,c.x,c.y)<=K.CHAIN_R)
                      .sort((a,b)=>dist(a.x,a.y,c.x,c.y)-dist(b.x,b.y,c.x,c.y));
    for(const o of near){ if(chained>=reach) break; saveCell(o, true); chained++;
      ring((c.x+o.x)/2,(c.y+o.y)/2, 6, K.R_CELL*3.2, '#ffd27a', 0.35); }   // arc of fire to the chained villager
  }
  callout = chained>0 ? { text:(chained+1)+' SAVED!', t:0, life:1.0, good:true }
                      : { text: SAVE_LINES[Math.floor(rnd()*SAVE_LINES.length)], t:0, life:0.9, good:true };
}
const SAVE_LINES = ['SAVED!', 'FIRE LIFTED!', 'RESCUED!', 'CLEAR!'];

// A committed unit cannot be canceled by release or dash. Dash requests execute at its boundary.
function beginVentUnit(){
  const p=player;
  if(p.ventUnit || !p.ventHeld || mode!=='play') return;
  const kind=p.heat>0?'heat':p.hp<1-1e-9?'heal':null;
  if(!kind){ p.venting=false; return; } // no empty/full-health farming or permanent rooting
  if(demonWell && demonWell.state==='destroyed') restoreDemonWell('vent');
  p.ventUnit={kind,t:0,duration:kind==='heat'?K.VENT_PURGE:RUN_VENT_HEAL_T};
  p.venting=true; p.lunge=0; p.spd=0;
  if(!p.ventNoticeSent){
    p.ventNoticeSent=true;
    callout={text:kind==='heat'?'VENTING HEAT · HOLD TO CLEAR':'VENTING HEALTH · STAY CLEAR',t:0,life:1.0,good:true};
  }
  if(snipeArmed&&!snipeUsed&&!intro)fireSnipe();
}
function setVentHeld(held){
  player.ventHeld=held;
  if(held) beginVentUnit();
  else { player.ventNoticeSent=false; if(!player.ventUnit) player.venting=false; }
}
function ventHold(dt=DT){
  const p=player;
  if(mode!=='play') return;
  beginVentUnit();
  const unit=p.ventUnit;
  if(!unit){p.venting=false;return;}
  p.venting=true; p.ventFlash=0.3; unit.t+=dt;
  if(unit.t+1e-9<unit.duration) return;
  if(unit.kind==='heat') p.heat=Math.max(0,p.heat-1);
  else {
    p.hp=Math.min(1,p.hp+1/maxHearts);
    flash=DT*2;
  }
  spawnVentDemon();
  notePresentEvent('vent');
  p.ventUnit=null; p.venting=false;
  if(p.ventDash){const v=p.ventDash;p.ventDash=null;lungeDir(v[0],v[1]);}
  else beginVentUnit();
}
// ---- DEMON WELL: Keith's visible source of pressure
function chooseDemonWellSpot(minPlayer=220){
  const spots=[];
  for(let i=0;i<48;i++){
    const s={x:K.EDGE+48+rnd()*(VW-2*(K.EDGE+48)), y:100+rnd()*(VH-200)};
    if(player && dist(s.x,s.y,player.x,player.y)<minPlayer)continue;
    if(nearObstacle(s.x,s.y,K.DEMON_WELL_R+18) || nearSlag(s.x,s.y,K.DEMON_WELL_R+18))continue;
    if(cells && cells.some(c=>!c.dead&&dist(s.x,s.y,c.x,c.y)<K.DEMON_WELL_R+K.R_CELL+26))continue;
    spots.push(s);
  }
  if(spots.length)return spots[Math.floor(rnd()*spots.length)];
  return {x:VW/2,y:Math.max(120,Math.min(VH-120,VH*0.34))};
}
function createDemonWell(reason='keith'){
  const s=chooseDemonWellSpot(reason==='vent'?K.VENT_DEMON_MIN_R+K.DEMON_WELL_R:220);
  return {x:s.x,y:s.y,state:'opening',t:0,spawnT:0,respawnT:0,reason};
}
function restoreDemonWell(reason='keith'){
  demonWell=createDemonWell(reason);
  callout={text:reason==='vent'?'THE WELL RETURNS · KEITH SENDS MORE DEMONS':'KEITH OPENS THE WELL',t:0,life:1.7,good:false};
  return demonWell;
}
function destroyDemonWell(){
  if(!demonWell || demonWell.state==='destroyed')return false;
  demonWell.state='destroyed';demonWell.t=0;
  demonWell.respawnT=K.DEMON_WELL_RESPAWN_MIN+rnd()*(K.DEMON_WELL_RESPAWN_MAX-K.DEMON_WELL_RESPAWN_MIN);
  ring(demonWell.x,demonWell.y,K.DEMON_WELL_R,100,'#ff3dca',0.5);
  callout={text:'WELL BROKEN · VENT TO BRING IT BACK',t:0,life:1.8,good:true};
  return true;
}
function spawnDemonFromWell(pressure=false){
  if(!demonWell || demonWell.state==='destroyed')return false;
  const live=demons.filter(d=>d.wellSpawn&&d.emergeT<=0).length;
  if(!pressure && live>=K.DEMON_WELL_MAX_ACTIVE)return false;
  const ang=rnd()*Math.PI*2;
  const rr=pressure ? 18+rnd()*26 : K.DEMON_WELL_R*1.2+8+rnd()*20;
  const source=pressure?'keith':'well';
  demons.push({x:demonWell.x+Math.cos(ang)*rr,y:demonWell.y+Math.sin(ang)*rr,t:0,
    ttl:pressure?K.KEITH_PRESSURE_DEMON_TTL:999,hitCd:0,huntVill:true,ph:rnd()*7,tgt:null,
    source,wellSpawn:true,emergeT:K.DEMON_WELL_EMERGE_T,
    speed:K.DEMON_SPD*(pressure?1.06:0.92),targetLock:0});
  return true;
}
function stepDemonWell(dt){
  if(!demonWell)return;
  if(demonWell.state==='destroyed'){
    demonWell.respawnT-=dt;
    if(demonWell.respawnT<=0)restoreDemonWell('keith');
    return;
  }
  demonWell.t+=dt;
  if(!ghost && player.lunge>0 && dist(player.x,player.y,demonWell.x,demonWell.y)<=K.DEMON_WELL_R+player.r){
    destroyDemonWell();return;
  }
  if(demonWell.state==='opening' && demonWell.t>=K.DEMON_WELL_OPEN_T){
    demonWell.state='active';demonWell.t=0;demonWell.spawnT=0;spawnDemonFromWell(false);
  }else if(demonWell.state==='active'){
    demonWell.spawnT+=dt;
    if(demonWell.spawnT>=K.DEMON_WELL_SPAWN_EVERY){demonWell.spawnT=0;spawnDemonFromWell(false);}
  }
}

function isVentDemon(d){ return !!d && (d.ventSpawn===true || d.source==='vent'); }
function showKeithSummon(x,y){ keithSummon={x,y,t:0,life:0.95}; }
function spawnKeithDemonAt(x,y,opts={}){
  const d={x,y,t:0,ttl:opts.ttl??K.KEITH_PRESSURE_DEMON_TTL,hitCd:0,
    huntVill:opts.huntVill!==false,ph:rnd()*7,tgt:null,source:'keith',wellSpawn:false,
    emergeT:opts.emergeT??0,speed:opts.speed??K.DEMON_SPD,targetLock:0};
  demons.push(d); showKeithSummon(x,y); return d;
}
function spawnVentDemon(){
  // Vent wakes the same visible well. A vent demon is still a well demon with
  // a different target rule, so no enemy can appear from an arbitrary screen edge.
  if(!demonWell || demonWell.state==='destroyed') restoreDemonWell('vent');
  const w=demonWell, ang=rnd()*Math.PI*2, rr=K.DEMON_WELL_R*1.2+8+rnd()*18;
  const d={x:w.x+Math.cos(ang)*rr,y:w.y+Math.sin(ang)*rr,t:0,hitCd:0,
    source:'vent',wellSpawn:true,ventSpawn:true,warn:K.VENT_DEMON_WAKE,emergeT:0,
    ph:rnd()*7,tgt:null,feast:null,eatT:0,speed:K.DEMON_SPD,targetLock:0,ttl:999};
  demons.push(d);
  notePresentEvent('demon');
}
function ventDemonSpawnClear(x,y,p){
  if(dist(x,y,p.x,p.y)<K.VENT_DEMON_MIN_R || nearObstacle(x,y,K.DEMON_R+6) || nearSlag(x,y,K.DEMON_R+6))return false;
  if(cells.some(c=>!c.dead&&dist(x,y,c.x,c.y)<K.DEMON_R+K.R_CELL+12))return false;
  if(husks.some(h=>dist(x,y,h.x,h.y)<K.DEMON_R+K.HUSK_R+12))return false;
  return !demons.some(d=>dist(x,y,d.x,d.y)<K.DEMON_R*3);
}
function ventDemonSpawn(p){
  const candidates=[
    {x:K.EDGE+24,y:64},{x:VW-K.EDGE-24,y:64},
    {x:K.EDGE+24,y:VH-64},{x:VW-K.EDGE-24,y:VH-64}
  ];
  for(let i=0;i<40;i++)candidates.push({x:K.EDGE+24+rnd()*(VW-2*(K.EDGE+24)),y:64+rnd()*(VH-128)});
  const clear=candidates.filter(s=>ventDemonSpawnClear(s.x,s.y,p));
  if(clear.length)return clear.reduce((best,s)=>{
    const separation=demons.length?Math.min(...demons.map(d=>dist(s.x,s.y,d.x,d.y))):0;
    const score=dist(s.x,s.y,p.x,p.y)+separation*0.3+rnd()*16;
    return !best||score>best.score?{x:s.x,y:s.y,score}:best;
  },null);
  // Extremely crowded fallback: choose the farthest sampled position, then push it out of solid art.
  const far=candidates.reduce((best,s)=>dist(s.x,s.y,p.x,p.y)>dist(best.x,best.y,p.x,p.y)?s:best);
  const spot={x:far.x,y:far.y};collideObstacles(spot,K.DEMON_R);return spot;
}
function explodeCinder(h){
  const idx=husks.indexOf(h); if(idx<0) return;
  husks.splice(idx,1);
  cinderBlasts.push({x:h.x,y:h.y,t:0,life:0.45});
  // A blast ignites calm villagers; it does not instantly kill those already burning or rescued.
  for(const c of cells){
    if(!c.dead && !c.saving && !c.hunter && dist(c.x,c.y,h.x,h.y)<=K.CINDER_BLAST_R) ignite(c,'cinder');
  }
  callout={text:'CINDER EXPLOSION!',t:0,life:1.7,good:false};
  const p=player;
  if(!god && p.hurtCd<=0 && dist(p.x,p.y,h.x,h.y)<=K.CINDER_BLAST_R+p.r){
    p.hp=Math.max(0,p.hp-K.CINDER_BLAST_HEARTS/maxHearts);p.hurtCd=K.HURT_IFRAME;flash=DT*2;
    if(p.hp<=0) pop('caught in a cinder explosion');
  }
}

function demonHitReaction(d){
  const p=player;
  // Enemy contact is a hard interrupt. Releasing the held state makes the player
  // consciously press again instead of silently restarting the heal under a stack.
  p.ventUnit=null;p.venting=false;p.ventHeld=false;p.ventDash=null;p.ventFlash=0;
  let dx=wrapDX(p.x-d.x),dy=p.y-d.y,m=Math.hypot(dx,dy);
  if(m<0.001){dx=-(p.hx||1);dy=-(p.hy||0);m=Math.hypot(dx,dy)||1;}
  p.knockX=dx/m;p.knockY=dy/m;p.knockT=K.DEMON_KNOCK_T;p.lunge=0;
}

// Vent demons persist and seek cinder people. Other enemy families retain their current behavior.
function stepDemons(dt){
  const p = player;
  for(const b of cinderBlasts)b.t+=dt;
  cinderBlasts=cinderBlasts.filter(b=>b.t<b.life);
  if(!demons.length) return;
  // only the nearest ~2 demons to the player can land a hit (so 1-2 out = heal wins, a full swarm loses)
  const order = demons.map((d,i)=>({i,dd:dist(d.x,d.y,p.x,p.y)})).sort((a,b)=>a.dd-b.dd);
  const canHit = new Set(order.slice(0,2).map(o=>o.i));
  for(let i=demons.length-1;i>=0;i--){ const d=demons[i]; d.t+=dt; if(d.hitCd>0) d.hitCd-=dt; if(d.fresh!=null) d.fresh+=dt;
    if(d.targetLock>0) d.targetLock-=dt;
    if(d.emergeT>0){ d.emergeT=Math.max(0,d.emergeT-dt); continue; }
    // DASH-KILL: dash through ANY fire monster to shatter it for heat + embers (your reward for clearing them).
    // You can't while venting (rooted) — so vent to heal, then dash the swarm down.
    if(!god && p.lunge > 0 && dist(d.x,d.y,p.x,p.y) <= K.DEMON_R + p.r){ killDemon(d); demons.splice(i,1); continue; }
    // Only Khet-Tak-Tor summons expire; vent demons persist until killed or cinder consumption.
    if(d.source !== 'well' && d.source !== 'keith' && !isVentDemon(d) && !p.venting){ d.ttl -= dt; if(d.ttl<=0){
        for(let k=0;k<6;k++){ const a=rnd()*7; sparks.push({x:d.x,y:d.y,t:0,life:0.3,out:true,vx:Math.cos(a)*120,vy:Math.sin(a)*120,hue:16}); }
        demons.splice(i,1); continue; } }
    if(isVentDemon(d)){
      if(d.warn>0){d.warn=Math.max(0,d.warn-dt);continue;}
      if(d.feast && !husks.includes(d.feast)){d.feast=null;d.eatT=0;}
      if(d.feast){
        d.tgt=d.feast;d.eatT+=dt;
        if(d.eatT>=K.CINDER_EAT_T){const h=d.feast;demons.splice(i,1);explodeCinder(h);if(mode!=='play')return;}
        continue;
      }
    }
    let tx=p.x, ty=p.y;
    if(isVentDemon(d)) d.tgt=null;
    if(isVentDemon(d)){
      let best=null,bd=K.CINDER_SEEK_R;
      for(const h of husks){
        if(demons.some(other=>other!==d && other.feast===h))continue;
        const dd=dist(d.x,d.y,h.x,h.y);if(dd<=bd){best=h;bd=dd;}
      }
      if(best){d.tgt=best;tx=best.x;ty=best.y;}
    }
    if(d.source!=='vent' && d.huntVill && (!d.tgt || d.tgt.dead || d.tgt.saving || d.targetLock<=0)){
      let best=null,bd=1e9;
      for(const c of cells){ if(c.saving||c.dead) continue; const dd=dist(c.x,c.y,d.x,d.y); if(dd<bd){bd=dd;best=c;} }
      if(best){ tx=best.x; ty=best.y; d.tgt=best; d.targetLock=K.DEMON_TARGET_LOCK; }
    } else if(d.source!=='vent' && d.tgt){ tx=d.tgt.x; ty=d.tgt.y; }
    const dx=wrapDX(tx-d.x), dy=ty-d.y, m=Math.hypot(dx,dy)||1;
    const speed=d.speed||K.DEMON_SPD;
    d.x += (dx/m)*speed*dt; d.y += (dy/m)*speed*dt;
    if(d.x<K.EDGE)d.x=K.EDGE; if(d.x>VW-K.EDGE)d.x=VW-K.EDGE; if(d.y<40)d.y=40; if(d.y>VH-40)d.y=VH-40;
    collideObstacles(d, K.DEMON_R);                                 // fire monsters can't phase through props
    if(isVentDemon(d) && d.tgt && dist(d.x,d.y,d.tgt.x,d.tgt.y)<=K.DEMON_R+K.HUSK_R){
      d.feast=d.tgt;d.eatT=0;
      callout={text:'DEMON EATING CINDER — DASH TO STOP IT!',t:0,life:1.4,good:false};
      continue;
    }
    if(canHit.has(i) && d.hitCd<=0 && p.hurtCd<=0 && !god && dist(d.x,d.y,p.x,p.y) <= K.DEMON_R+p.r){   // bite the player
      p.hp -= K.DEMON_HIT; d.hitCd = K.DEMON_HIT_CD; p.hurtCd = K.HURT_IFRAME; flash = DT*2;
      demonHitReaction(d);hitstop=K.HITSTOP*0.45;
      if(p.hp<=0){ p.hp=0; pop('the demons took you'); return; } }
    if(!isVentDemon(d) && d.tgt && dist(d.x,d.y,d.tgt.x,d.tgt.y) <= K.DEMON_R+K.R_CELL){    // reach a villager
      if(d.tgt.hunter) becomeHusk(d.tgt);                              // flaming -> the fire finishes them into a husk
      else if(!d.tgt.saving && d.tgt.grace<=0) ignite(d.tgt,'demon');   // calm -> re-ignited
      d.tgt=null; }
  }
}

// ---- ARSON IMPS: Keith's messengers of fire. Spawn at an edge, hover a beat (telegraph), then fly to a marked
// villager and torch it. The player's counter-play: intercept before it lands.
function spawnArson(){
  if(arson.length >= K.ARSON_MAX) return;
  const calm = crowd().filter(c => !arson.some(a => a.tgt === c));   // don't double-book the same villager
  if(!calm.length) return;
  const c = calm[Math.floor(rnd()*calm.length)];
  // enter from the edge nearest the mark, so it reads as arriving from outside
  const cand = [ {x:K.EDGE, y:c.y}, {x:VW-K.EDGE, y:c.y}, {x:c.x, y:40}, {x:c.x, y:VH-40} ];
  const e = cand.reduce((b,p)=> dist(p.x,p.y,c.x,c.y) < dist(b.x,b.y,c.x,c.y) ? p : b);
  arson.push({ x:e.x, y:e.y, tgt:c, t:0, warn:K.ARSON_WARN, ph:rnd()*7, source:'keith' });
  showKeithSummon(e.x,e.y);
  if(!arsonSeen){ arsonSeen = true; callout = { text:'KEITH SENDS A FIRE IMP · CUT IT OFF', t:0, life:1.9, good:false }; }
}

// Keith is the hostile force in the street. He does not replace Khet-Tak-Tor's Arbiter role.
// At irregular intervals he marks Duy's position, calls in extra demons and fires a direct strike.
function triggerKeithPressure(){
  if(mode!=='play' || duelActive || intro || boss || keithStrike) return false;
  const a = rnd()*Math.PI*2;
  const ox = VW/2 + Math.cos(a)*(VW*0.42), oy = VH/2 + Math.sin(a)*(VH*0.40);
  keithStrike = { ox:Math.max(K.EDGE,Math.min(VW-K.EDGE,ox)), oy:Math.max(40,Math.min(VH-40,oy)),
    tx:player.x, ty:player.y, t:0, done:false, lt:0 };
  if(!demonWell || demonWell.state==='destroyed')restoreDemonWell('keith');
  for(let i=0;i<K.KEITH_PRESSURE_DEMONS;i++){
    spawnDemonFromWell(true);
  }
  keithPressureCount++;
  notePresentEvent('keith');
  callout = { text:'KEITH APPEARS · MORE DEMONS INCOMING', t:0, life:2.0, good:false };
  return true;
}
function encounterStress(){
  const p=player||{};
  const heat=(p.heat||0)/Math.max(1,K.HEAT_MAX);
  const hp=1-(p.hp==null?1:p.hp);
  const active=Math.min(1,demons.filter(d=>d.source==='keith'||d.source==='well'||d.source==='vent').length/Math.max(1,K.MAX_DEMONS));
  const burning=Math.min(1,hunters().length/Math.max(1,K.CROWD_CAP));
  return Math.max(0,Math.min(1,heat*.36+hp*.30+active*.22+burning*.12));
}
function keithPressureCadence(){
  const base=Math.max(K.KEITH_PRESSURE_MIN,K.KEITH_PRESSURE_EVERY-(runDistrict-1)*1.4-keithPressureCount*.35);
  const stress=encounterStress();
  if(stress>=K.KEITH_PRESSURE_OVERLOAD) return base+(stress-K.KEITH_PRESSURE_OVERLOAD)*8;
  if(stress<0.25) return Math.max(K.KEITH_PRESSURE_MIN,base-K.KEITH_PRESSURE_RELIEF);
  return base;
}
function stepKeithPressure(dt){
  if(mode!=='play' || duelActive || intro) return;
  if(keithStrike){
    keithStrike.t += dt;
    if(!keithStrike.done && keithStrike.t >= K.KEITH_STRIKE_TELE){
      keithStrike.done = true;
      if(!god && player.hurtCd<=0 && dist(player.x,player.y,keithStrike.tx,keithStrike.ty)<=K.KEITH_STRIKE_R+player.r){
        arbiterHitPlayer(keithStrike.tx,keithStrike.ty,K.KEITH_STRIKE_HEARTS);
        if(mode!=='play') return;
        callout = { text:'KEITH STRUCK YOU', t:0, life:1.2, good:false };
      } else {
        callout = { text:'KEITH MISSED · MOVE BEFORE THE MARK CLOSES', t:0, life:1.2, good:true };
      }
    }
    if(keithStrike.done){ keithStrike.lt += dt; if(keithStrike.lt > 0.55) keithStrike = null; }
    return;
  }
  // Do not stack a fresh direct strike on top of a committed vent or a bite.
  // The cadence remains armed and resumes as soon as the player can respond.
  if(player.venting || player.hurtCd>0) return;
  if(keithPressureCount===0){
    if(elapsed < K.KEITH_PRESSURE_FIRST) return;
    keithPressureT = 0;
    triggerKeithPressure();
    return;
  }
  keithPressureT += dt;
  const cadence = keithPressureCadence();
  if(keithPressureT >= cadence){ keithPressureT = 0; triggerKeithPressure(); }
}
function stepArson(dt){
  if(!arson.length) return;
  const p = player;
  for(let i=arson.length-1;i>=0;i--){ const a = arson[i]; a.t += dt;
    // the mark left the pool (saved/burning/gone) -> retarget to the nearest calm one, or wink out
    if(!a.tgt || a.tgt.dead || a.tgt.hunter || a.tgt.saving){
      const calm = crowd();
      a.tgt = calm.length ? calm.reduce((b,c)=> dist(c.x,c.y,a.x,a.y) < dist(b.x,b.y,a.x,a.y) ? c : b) : null;
      if(!a.tgt){ arson.splice(i,1); continue; }
    }
    if(!god && dist(a.x,a.y,p.x,p.y) <= K.ARSON_R + p.r){ interceptArson(a); arson.splice(i,1); continue; }   // INTERCEPT
    if(a.warn > 0){ a.warn -= dt; continue; }                    // telegraph hover at the edge
    const dx = wrapDX(a.tgt.x-a.x), dy = a.tgt.y-a.y, m = Math.hypot(dx,dy)||1;
    a.x += (dx/m)*K.ARSON_SPD*dt; a.y += (dy/m)*K.ARSON_SPD*dt;
    if(dist(a.x,a.y,a.tgt.x,a.tgt.y) <= K.ARSON_R + K.R_CELL){    // it lands -> torch the villager
      if(!a.tgt.saving && a.tgt.grace <= 0 && !a.tgt.hunter) ignite(a.tgt,'arson');
      arson.splice(i,1);
    }
  }
}
function interceptArson(a){
  const p = player;
  intercepts++; edge += K.ARSON_EDGE_PER; edgePop = 0.5;
  const dashing = p.lunge > 0;
  p.heat = Math.min(K.HEAT_MAX, p.heat + K.ARSON_HEAT);
  const em = Math.round(K.ARSON_EMBERS * (dashing ? 1.5 : 1));
  runEmbers += em;
  p.absorbPop = 0.3; flash = DT*1.5; hitstop = K.HITSTOP*0.6;
  ring(a.x, a.y, 4, 52, '#ffd27a', 0.5);
  for(let k=0;k<11;k++){ const ang=rnd()*7; sparks.push({x:a.x,y:a.y,t:0,life:0.3+rnd()*0.22,out:true,vx:Math.cos(ang)*150,vy:Math.sin(ang)*150,hue:22+rnd()*30}); }
  callout = { text: dashing ? 'INTERCEPTED! +EDGE' : 'CUT OFF! +EDGE', t:0, life:0.9, good:true };
}

function becomeSlag(c){
  slag.push({x:c.x,y:c.y});
  c.dead = true; slagThisRun++;
  ring(c.x,c.y,K.R_CELL,50,'#4a5162',0.42);
  maybeRise();
}

// ---------------------------------------------------------------- HUSK / ASH WRAITH
// A villager you failed to save. Not a permanent wall — a temporary, ember-veined coal that STILL shoves you
// (cornering role survives), then CRACKS into a roaming ash wraith that hunts the town and bites you. The loss
// literally stands up and walks. Always reclaimable: touch it with heat to REKINDLE (spend fire, save them).
function becomeHusk(c){
  c.dead = true;
  husks.push({ x:c.x, y:c.y, t:0, heatAt: player.heat, ph: rnd()*7, villagerId:c.villagerId??c.id });
  edge -= K.LOSS_EDGE + player.heat*K.LOSS_EDGE_HEAT;   // THE EDGE swings toward Khet-Tak-Tor when the town burns
  edgePop = 0.5;
  ring(c.x, c.y, K.R_CELL, 50, '#8a5a2e', 0.42);
  if(!huskSeen){ huskSeen = true; callout = { text:'A CINDER PERSON — TOUCH WITH HEAT TO FREE THEM', t:0, life:2.4, good:false }; }
}
function stepHusks(dt){
  const p = player;
  for(let i=husks.length-1;i>=0;i--){ const h = husks[i]; h.t += dt;
    // REKINDLE: pour your own fire back in (spend heat) to still save them — the mirror of absorb
    if(!ghost && dist(h.x,h.y,p.x,p.y) <= p.r + K.HUSK_R + 2 && rekindleHusk(h)){
      husks.splice(i,1); continue; }
    // soft-solid: shove the player off (keeps the wall's cornering role, but temporary)
    { const dx = wrapDX(p.x-h.x), dy = p.y-h.y, d = Math.hypot(dx,dy), min = p.r + K.HUSK_R;
      if(d < min && d > 0.001 && p.lunge <= 0){ p.x += (dx/d)*(min-d); p.y += (dy/d)*(min-d); p.hx = dx/d; p.hy = dy/d; } }
    // CRACK -> rise as a persistent town-wraith (unless the roam is already full)
    if(h.t >= K.HUSK_CRACK_T && !demons.some(d=>d.feast===h)){
      // A failed rescue cracks open a signal for Keith. The hostile demon is
      // summoned by him at the husk, never born from the town floor.
      if(demons.filter(d=>d.source==='keith').length < K.WRAITH_CAP){
        spawnKeithDemonAt(h.x,h.y,{ttl:1e9,speed:K.DEMON_SPD*1.04});
        ring(h.x, h.y, K.HUSK_R, 80, '#b06a5a', 0.6);
      }
      if(!META.flags) META.flags={}; if(!META.flags.sawWraith){ META.flags.sawWraith=true; saveMeta(); }   // opens a diary page
      husks.splice(i,1);
    }
  }
}
function rekindleHusk(h){
  if(h.sanctuaryId || rescueHeatAvailable()<K.REKINDLE_COST)return false;
  const c={id:nextId++,villagerId:h.villagerId,x:h.x,y:h.y,vx:0,vy:0,dir:0,ph:0,ps:1,
           grace:K.GRACE,hunter:false,rekindled:true};
  if(!saveCell(c,false,true))return false;
  cells.push(c);h.sanctuaryId=c.sanctuaryId;
  callout={text:'ASCENDED! -1 HEAT',t:0,life:1.0,good:true};
  return true;
}
let demonKillSeen = false;
function killDemon(d){   // dash THROUGH any fire monster to shatter it: heat you can bank + embers to spend
  const p = player;
  const vent = isVentDemon(d);
  p.heat = Math.min(K.HEAT_MAX, p.heat + K.DEMON_KILL_HEAT);
  const em = vent?0:K.DEMON_KILL_EMBERS; runEmbers += em;
  edge += 0.25; edgePop = 0.5;                                   // clearing them nudges the town war your way
  p.absorbPop = 0.26; flash = DT*1.5; hitstop = K.HITSTOP*0.5;
  ring(d.x, d.y, 6, 50, d.source==='well'?'#d66bff':'#ffb050', 0.5);
  for(let k=0;k<10;k++){ const a=rnd()*7; sparks.push({x:d.x,y:d.y,t:0,life:0.3+rnd()*0.22,out:true,vx:Math.cos(a)*140,vy:Math.sin(a)*140,hue:d.source==='well'?285:24}); }
  if(!demonKillSeen){ demonKillSeen = true; notePresentEvent('demonKill'); callout = { text:vent?'VENT DEMON CLEARED · +1 HEAT, NO EMBERS':'DASH THROUGH FIRE MONSTERS · +1 HEAT +EMBERS', t:0, life:2.3, good:true }; }
  else callout = { text:em>0?'SHATTERED! +1 HEAT +EMBERS':'SHATTERED! +1 HEAT', t:0, life:0.7, good:true };
}

// ---------------------------------------------------------------- LEVELED ARBITER: movesets + duel FX
function angDiff(a,b){ let d=(a-b)%(Math.PI*2); if(d>Math.PI)d-=Math.PI*2; if(d<-Math.PI)d+=Math.PI*2; return d; }
// A saved villager fighting beside you body-blocks ONE incoming attack, then is spent.
function allyBlock(x,y){
  if(!allies.length) return false;
  const a = allies.shift();
  ring((a.x+x)/2, (a.y+y)/2, 6, 42, '#8affc1', 0.5);
  for(let k=0;k<9;k++){ const ang=rnd()*7; sparks.push({x:a.x,y:a.y,t:0,life:0.32,out:true,vx:Math.cos(ang)*120,vy:Math.sin(ang)*120,hue:150}); }
  callout = { text:'AN ALLY TOOK THE HIT!', t:0, life:0.8, good:true };
  return true;
}
function arbiterHitPlayer(x,y,hearts=K.ARBITER_HIT){
  const p = player;
  if(allyBlock(x,y)) return;                 // an ally eats it
  if(god || p.hurtCd > 0) return;            // i-frames
  p.hp -= hearts / maxHearts;
  p.hurtCd = K.HURT_IFRAME; flash = DT*2; hitstop = K.HITSTOP*0.6;
  ring(p.x, p.y, p.r+4, 60, '#ff5a4a', 0.5);
  if(p.hp <= 0){ p.hp = 0; pop('Keith got you'); }
}
function startArbiterMove(b, key){
  b.move = key; b.moveT = 0; b.moveTele = K.ARBITER_TELE; b.moveData = {};
  b.vx = 0; b.vy = 0;
  const p = player;
  if(key === 'charge' || key === 'wake'){
    const dx = wrapDX(p.x-b.x), dy = p.y-b.y, m = Math.hypot(dx,dy)||1;   // aim at you (locked at telegraph end)
    b.moveData.dir = { x:dx/m, y:dy/m };
  }
  const names = { charge:'KEITH WINDS UP A CHARGE', spit:'KEITH SPITS EMBERS', wake:'KEITH TRAILS FIRE',
                  demon:'KEITH CALLS MORE DEMONS', siphon:'KEITH SIPHONS THE ASH' };
  callout = { text: names[key]||'', t:0, life:0.9, good:false };
}
// Returns true while a move is DRIVING Khet-Tak-Tor (so the default evade is suppressed).
function runArbiterMove(b, dt){
  const p = player;
  if(b.moveTele > 0){                         // wind-up: he plants, telegraph shows
    b.moveTele -= dt; b.vx = 0; b.vy = 0;
    if(b.moveTele <= 0) execArbiterMove(b);     // fire on the beat
    return true;
  }
  // post-execution behaviour per move
  if(b.move === 'charge'){
    const d = b.moveData.dir; b.vx = d.x*440; b.vy = d.y*440;   // barrel forward
    if(dist(b.x,b.y,p.x,p.y) < b.r + p.r + 4) arbiterHitPlayer(b.x, b.y);
    if(b.moveT > K.ARBITER_TELE + 0.55){ endArbiterMove(b); }
    return true;
  }
  if(b.move === 'wake'){
    const d = b.moveData.dir; b.vx = d.x*K.WAKE_SPD; b.vy = d.y*K.WAKE_SPD;
    b.moveData.segT = (b.moveData.segT||0) + dt;
    while(b.moveData.segT >= K.WAKE_SEG_EVERY){ b.moveData.segT -= K.WAKE_SEG_EVERY;
      wake.push({ x:b.x, y:b.y, t:0, ph:rnd()*7 }); }
    if(b.moveT > K.ARBITER_TELE + 0.7){ endArbiterMove(b); }
    return true;
  }
  if(b.move === 'siphon'){
    b.moveData.pulseT = (b.moveData.pulseT||0) + dt;
    if(b.moveData.pulseT >= 1.1){ b.moveData.pulseT = 0;
      pulses.push({ x:b.x, y:b.y, r:20, t:0, gapAng:rnd()*Math.PI*2, hit:false }); }
    b.vx *= 0.9; b.vy *= 0.9;
    const broken = b.shieldBreakable && (b.shieldN||0) <= 0;   // saved the siphoned -> shield falls early
    if(broken || b.moveT > K.ARBITER_TELE + 4.2){ b.shield = false; endArbiterMove(b); }
    return true;
  }
  // spit / demon fire once and finish after a short recovery
  if(b.moveT > K.ARBITER_TELE + 0.35){ endArbiterMove(b); }
  b.vx *= 0.86; b.vy *= 0.86;
  return true;
}
function execArbiterMove(b){
  const p = player;
  if(b.move === 'spit'){
    const base = Math.atan2((lastLag().y)-b.y, wrapDX((lastLag().x)-b.x));
    for(let i=0;i<K.SPIT_N;i++){ const a = base + (i-(K.SPIT_N-1)/2)*K.SPIT_SPREAD;
      shots.push({ x:b.x, y:b.y, vx:Math.cos(a)*K.SPIT_SPD, vy:Math.sin(a)*K.SPIT_SPD, t:0, ph:rnd()*7 }); }
    ring(b.x,b.y,4,40,'#ff9a2e',0.4);
  } else if(b.move === 'demon'){
    showKeithSummon(b.x,b.y);
    for(let i=0;i<K.ARBITER_DEMONS;i++){ const a=rnd()*Math.PI*2;
      spawnKeithDemonAt(b.x+Math.cos(a)*30,b.y+Math.sin(a)*30,{ttl:K.ARBITER_DEMON_TTL}); }
    ring(b.x,b.y,6,60,'#ff5a2e',0.5);
  } else if(b.move === 'siphon'){
    // pull nearby villagers into an orbiting shield; save them to strip it (timed out otherwise)
    const pool = crowd().slice(0, K.SIPHON_PULL); b.shield = true; b.shieldN = 0;
    for(const c of pool){ c.hunter = true; c.fuse = hunterFuse; c.siphon = true; c.grace = 0; b.shieldN++; }
    b.shieldBreakable = b.shieldN > 0;   // villagers pulled -> save them to break it; none -> purely a timed shield
    ring(b.x,b.y,10,K.SIPHON_R,'#c79be0',0.6);
  }
  // charge/wake don't 'exec' — their post-tele branch drives them
}
function endArbiterMove(b){
  b.move = null; b.moveT = 0; b.moveData = null;
  b.moveCd = Math.max(K.ARBITER_MOVE_CD_MIN, K.ARBITER_MOVE_CD0 - (b.level-1)*0.3);
}
function stepArbiterMoves(b, dt){
  if(b.move){ b.moveT += dt; return runArbiterMove(b, dt); }
  b.moveCd -= dt;
  if(b.moveCd > 0 || !b.moves.length) return false;
  startArbiterMove(b, b.moves[Math.floor(rnd()*b.moves.length)]);
  return true;
}
function lastLag(){ return (typeof hist!=='undefined' && hist.length) ? hist[0] : player; }
// Duel projectiles / wake / pulses / allies — stepped each frame while a Khet-Tak-Tor duel is live.
function stepDuelFX(dt){
  const p = player;
  for(let i=shots.length-1;i>=0;i--){ const s=shots[i]; s.t+=dt; s.x+=s.vx*dt; s.y+=s.vy*dt;
    if(s.x<-20||s.x>VW+20||s.y<-20||s.y>VH+20||s.t>4){ shots.splice(i,1); continue; }
    if(collideObstacles(s, K.SPIT_R)){ shots.splice(i,1); continue; }
    if(dist(s.x,s.y,p.x,p.y) < K.SPIT_R+p.r){ arbiterHitPlayer(s.x,s.y); shots.splice(i,1); continue; }
  }
  for(let i=wake.length-1;i>=0;i--){ const w=wake[i]; w.t+=dt;
    if(w.t>K.WAKE_LIFE){ wake.splice(i,1); continue; }
    if(p.heat<K.HEAT_MAX && dist(w.x,w.y,p.x,p.y) < K.WAKE_R+p.r){     // absorb the trail for dump fuel
      p.heat = Math.min(K.HEAT_MAX, p.heat+1); p.absorbPop=0.2;
      for(let k=0;k<5;k++){ const a=rnd()*7; sparks.push({x:w.x,y:w.y,t:0,life:0.3,sw:(rnd()-0.5)*6,hue:24}); }
      wake.splice(i,1); }
  }
  for(let i=pulses.length-1;i>=0;i--){ const pu=pulses[i]; pu.t+=dt; pu.r += K.SIPHON_PULSE_SPD*dt;
    if(pu.r > 760){ pulses.splice(i,1); continue; }
    const dd = dist(p.x,p.y,pu.x,pu.y), ang = Math.atan2(p.y-pu.y, wrapDX(p.x-pu.x));
    if(!pu.hit && Math.abs(dd-pu.r) < 24 && Math.abs(angDiff(ang, pu.gapAng)) > K.SIPHON_GAP && p.lunge<=0){
      pu.hit = true; arbiterHitPlayer(p.x,p.y); }
  }
  for(const a of allies){ a.ph += dt; const dx=p.x-a.x, dy=p.y-a.y, d=Math.hypot(dx,dy)||1;   // trail near you
    const want = 60 + 30*Math.sin(a.ph*0.6); if(d>want){ a.x += dx/d*95*dt; a.y += dy/d*95*dt; } }
}

// ---------------------------------------------------------------- bosses
// One contact law everywhere: fire transfers on touch. Bosses go DOWN instead of slagging.
// RISER (miniboss): a wall you made gets back up and spreads fire through the crowd.
// ARBITER APEX (the win): the emptied floor is the boss arena; he uses your own moves.
function maybeRise(){
  if(boss || duelActive || won || mode !== 'play') return;
  if(slagThisRun < nextRiserAt) return;
  const i = slag.findIndex(s => !s.grudge);          // the oldest wall that isn't Khet-Tak-Tor's
  if(i < 0) return;
  const s = slag.splice(i,1)[0];
  nextRiserAt += K.RISER_EVERY;
  boss = { kind:'riser', x:s.x, y:s.y, r:K.RISER_R, state:'rising', t:K.BOSS_RISE_T,
           fuse:0, downs:0, tagCd:1.0, vx:0, vy:0 };
  ring(s.x, s.y, K.R_SLAG, 90, '#c2364f', 0.6);
  callout = { text: STORY.riser.rise, t:0, life:1.6, good:false };
}

function startDuel(){
  if(boss && boss.kind === 'riser'){ slag.push({x:boss.x, y:boss.y}); }   // riser sits back down
  duelActive = true; snipeUsed = true; snipe = null;
  if(!META.flags) META.flags={}; if(!META.flags.reachedDuel){ META.flags.reachedDuel=true; saveMeta(); }   // opens a diary page
  const gx = opp.grudge ? opp.grudge.x : VW/2, gy = opp.grudge ? opp.grudge.y : VH*0.3;
  slag = slag.filter(s => !s.grudge);                // Khet-Tak-Tor is UP: his wall is him
  arson = []; husks = [];                            // clear old threats; the duel begins its own readable fire cadence
  while(crowd().length < K.DUEL_CROWD) spawnCrowd(false); // never enter a heat-powered fight without valid fire targets
  arsonT = Math.max(0, K.DUEL_ARSON_EVERY-0.8);      // first duel source arrives promptly, then uses the slower cadence
  demons = demons.filter(d => d.source !== 'town');  // roaming wraiths clear (they become Khet-Tak-Tor's reinforcements below)
  shots = []; wake = []; pulses = [];
  // Khet-Tak-Tor's LEVEL is the district you're in (deeper district = more movesets). Movesets are cumulative.
  const level = Math.min(5, runDistrict);
  const roster = ['charge','spit','wake','demon','siphon'];   // unlocked one-per-level, cumulative
  const moves = roster.slice(0, level);
  // THE EDGE is cashed here: a lead pre-fills your dump progress; a deficit makes him demand more.
  const headStart = Math.min(K.EDGE_HEADSTART_CAP, Math.max(0, Math.floor(edge / K.EDGE_PER_DOWN)));
  const deficit   = Math.min(K.EDGE_EXTRA_CAP,     Math.max(0, Math.floor(-edge / K.EDGE_PER_DOWN)));
  const dumpNeeded = K.DUEL_DUMP + (level-1)*K.DUMP_PER_LEVEL + deficit*3;
  dumped = Math.min(dumpNeeded-1, headStart*3);              // banked edge = a running start (never an instant win)
  boss = { kind:'arbiter', x:gx, y:gy, r:K.ARBITER_R + (level-1)*2, state:'rising', t:K.BOSS_RISE_T,
           fuse:0, downs:0, tagCd:0, vx:0, vy:0, level, moves, dumpNeeded,
           move:null, moveT:0, moveTele:0, moveData:null,
           moveCd: Math.max(K.ARBITER_MOVE_CD_MIN+0.6, K.ARBITER_MOVE_CD0 - (level-1)*0.3) };
  // ALLIES: rescued villagers fight beside you — each body-blocks one incoming attack.
  const allyN = Math.min(K.ALLY_MAX, Math.floor(saved / K.ALLY_PER_SAVED));
  for(let i=0;i<allyN;i++){ const a=i/Math.max(1,allyN)*Math.PI*2;
    allies.push({ x: gx + Math.cos(a)*140, y: gy + Math.sin(a)*140 + 200, ph: rnd()*7, used:false }); }
  ring(gx, gy, K.R_SLAG, 140, '#ff3d7a', 0.8);
  const taunt = STORY.duel.rise[(opp.runs||0) % STORY.duel.rise.length];
  let riseTxt = 'KEITH LV.' + level + (level>1 ? ' · NEW TRICKS' : '');
  if(headStart > 0) riseTxt += ' · you start ' + dumped + ' ahead';
  else if(deficit > 0) riseTxt += ' · the ash fuels him';
  else speakKeith(taunt,'stern');
  callout = { text: riseTxt, t:0, life:2.3, good: headStart > 0 };
  if(allyN > 0) setDelayedCallout(allyN + ' SAVED VILLAGERS STAND WITH YOU', 1.6, true);
  flash = DT*2;
}
// a tiny one-shot delayed callout (fixed-step safe — no setTimeout)
let pendCall = null;
function setDelayedCallout(text, delay, good){ pendCall = { text, t:delay, good:!!good }; }

function winDuel(){
  if(mode !== 'play' || runSettled) return;
  cancelPointer();
  won = true; mode = 'over'; popCause = 'he yielded';
  CG.stop(); CG.happy();                       // CrazyGames: round ended, a win
  score += K.DUEL_BONUS;
  opp.duelWins = (opp.duelWins||0) + 1;
  // DISTRICT progression: clearing your deepest district opens the next (the ember bounty scales at line ~481).
  districtCleared = false;
  META.clearedDistricts = Math.max(META.clearedDistricts||0, runDistrict);
  if(runDistrict >= (META.district||1) && (META.district||1) < 5){ META.district = runDistrict + 1; districtCleared = true; }
  saveMeta();
  foldOpp();
  ring(boss.x, boss.y, 20, 320, '#8affc1', 1.0);
  flash = DT*3;
}
let districtCleared = false;   // set on a win that unlocked a new district (for the game-over banner)

function bossDown(){
  const b = boss;
  if(b.kind === 'riser'){
    slag.push({x:b.x, y:b.y});                       // dead for good this time
    score += K.RISER_BONUS;
    ring(b.x, b.y, K.RISER_R, 90, '#7fe8ff', 0.5);
    callout = { text: STORY.riser.dead, t:0, life:1.4, good:true };
    boss = null;
  } else {
    b.downs++;
    const need = b.needed || K.ARBITER_DOWNS;
    if(b.downs >= need){ winDuel(); return; }
    b.state = 'stagger'; b.t = K.BOSS_STAGGER_T; b.fuse = 0;
    ring(b.x, b.y, b.r, 110, '#7fe8ff', 0.6);
    callout = { text: 'KEITH DRIVEN BACK · ' + b.downs + '/' + need, t:0, life:1.6, good:true };
    hitstop = K.HITSTOP;
  }
}

// dense clusters of walls fuse into a POWERUP — rewards the pileup and self-cleans the floor
function mergeCheck(){
  return;   // DISABLED: the "floating gem" SURGE pickups (fused from wall clusters) are legacy — removed
  const box = [];
  for(let i=0;i<slag.length;i++){ if(!slag[i].grudge) box.push(i); }
  if(box.length < K.MERGE_MIN || powerups.length >= K.POWERUP_CAP) return;
  const seen = new Set();
  for(let a=0;a<box.length;a++){
    if(seen.has(a)) continue;
    const comp = [a], stack = [a]; seen.add(a);
    while(stack.length){ const u = stack.pop();
      for(let v=0;v<box.length;v++){ if(!seen.has(v)){
        const dx = wrapDX(slag[box[u]].x - slag[box[v]].x), dy = slag[box[u]].y - slag[box[v]].y;
        if(Math.hypot(dx,dy) < K.MERGE_LINK){ seen.add(v); comp.push(v); stack.push(v); }
      }}
    }
    if(comp.length >= K.MERGE_MIN){
      const base = slag[box[comp[0]]]; let sx = 0, sy = 0; const rm = new Set();
      for(const ci of comp){ const s = slag[box[ci]]; sx += wrapDX(s.x-base.x); sy += s.y; rm.add(box[ci]); }
      let cx = ((base.x + sx/comp.length)%VW+VW)%VW, cy = sy/comp.length;
      slag = slag.filter((s,i)=>!rm.has(i));
      powerups.push({ x:cx, y:cy, t:0, n:comp.length });
      ring(cx,cy,10,110,'#ffe08a',0.7); ring(cx,cy,24,80,'#7fe8ff',0.6); flash = DT*2;
      callout = { text:'THE WALLS FUSED', t:0, life:1.3, good:true };
      return;                                        // one merge per tick
    }
  }
}

function collectPowerup(pu){
  surgeT = K.SURGE_T;
  player.charges = RUN_MAX_CHARGES;
  if(player.lit) player.fuse = K.FUSE_START;
  score += K.SURGE_BONUS;
  ring(pu.x,pu.y,10,150,'#ffe08a',0.8); ring(player.x,player.y,14,120,'#7fe8ff',0.7);
  flash = DT*3; hitstop = K.HITSTOP;
  callout = { text:'SURGE!', t:0, life:1.5, good:true };
}

function cooldown(){
  cooldowns++;
  peakHunters = 0; armed = false;
  hunterFuse = Math.max(5.0, hunterFuse - 0.5);   // re-escalate: walls form faster
  score += 500;
  ring(player.x,player.y,20,260,'#8affc1',0.9);
  flash = DT*3;
  // the fire answers: each cooldown ignites more of the crowd at once.
  // Multiple taggers, always traced to the player's own feat — never free-running spread.
  const n = Math.min(1 + cooldowns, 5);
  const pool = crowd().filter(c => c.grace <= 0);
  for(let i = 0; i < n && pool.length; i++){
    const c = pool.splice(Math.floor(rnd()*pool.length), 1)[0];
    ignite(c, 'surge');
    ring(c.x, c.y, 8, 60, '#ff9a2e', 0.4);
  }
}

function pop(cause){
  if(mode !== 'play' || runSettled) return;
  cancelPointer();
  mode = 'over'; popCause = cause;
  CG.stop();                                    // CrazyGames: round ended
  foldOpp();                                    // this run's decisions teach the opp
  ring(player.x,player.y,10,180,'#ff4d3d',0.8);
  flash = DT*3;
}
