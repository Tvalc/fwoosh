// ---- THE OPP: a rival built from how you played last session (persistent)
function loadOpp(){
  const N = 6*8;
  try{ const s = JSON.parse(localStorage.getItem('fwoosh.opp'));
    if(s && Array.isArray(s.terr) && s.terr.length === N){
      s.readsBroken = s.readsBroken||0; s.timesSniped = s.timesSniped||0; s.seenIntro = !!s.seenIntro;
      s.duelWins = s.duelWins||0; s.loreIdx = s.loreIdx||0;
      return s; } }catch(e){}
  return { terr: new Array(N).fill(0), lat: [], grudge: null, medianLat: null, runs: 0,
           readsBroken: 0, timesSniped: 0, seenIntro: false, duelWins: 0, loreIdx: 0 };
}

// where the feud stands -> which register Keith speaks in. The arc: he learns you (smug),
// over-invests (obsessed), then can't read you anymore and respects it (respect).
function feudStage(){
  if((opp.runs||0) <= 1) return 'debut';
  if((opp.duelWins||0) >= 1) return 'respect';  // he yielded. that settles it.
  const b = opp.readsBroken||0, s = opp.timesSniped||0;
  if(b >= 4 && b > s) return 'respect';        // you've become genuinely unpredictable
  if((opp.runs||0) >= 4 || b >= 2) return 'obsessed';
  return 'smug';
}
function lineFor(kind){                          // fired/sniped/broken/study, keyed to the feud
  let st = feudStage(), pool = STORY[kind];
  if(!pool[st]) st = (kind === 'study') ? 'debut' : 'smug';
  const arr = pool[st] || pool.smug || pool.debut;
  return arr[(opp.runs||0) % arr.length];
}
function saveOpp(){ try{ localStorage.setItem('fwoosh.opp', JSON.stringify(opp)); }catch(e){} }
function median(arr){ const a = arr.slice().sort((x,y)=>x-y), n = a.length;
  return n ? (n%2 ? a[(n-1)/2] : (a[n/2-1]+a[n/2])/2) : 0; }
function cellCenter(i){ const col = i%K.OPP_COLS, row = Math.floor(i/K.OPP_COLS);
  return { x:(col+0.5)*(VW/K.OPP_COLS), y:Math.max(ARENA.TOP,(row+0.5)*(VH/K.OPP_ROWS)) }; }

// fold this run's records into the opp, then persist. Called once, at pop().
function foldOpp(){
  if(runSettled) return;
  runSettled = true;
  for(const r of runBuf){
    const idx = r.row*K.OPP_COLS + r.col;
    if(idx >= 0 && idx < opp.terr.length) opp.terr[idx]++;
    opp.lat.push(r.lateness);
  }
  while(opp.lat.length > K.OPP_LAT_CAP) opp.lat.shift();
  opp.runs++;
  if(oppScarred) opp.readsBroken = (opp.readsBroken||0) + 1;   // you defied the read
  if(gotSniped)  opp.timesSniped = (opp.timesSniped||0) + 1;   // he called your habit
  saveOpp();
  // META: bank this run's embers (+ win bounty, scaled by how deep the district was). saved already counted.
  if(won) runEmbers += K.WIN_EMBERS * runDistrict;
  META.embers += runEmbers;
  prepareStarterOffer();
  META.recentRuns.push({seconds:Math.round(elapsed*10)/10,district:runDistrict,rescued:saved,
    earned:runEmbers,starterBonus:runStarterBonus,won:!!won});
  META.recentRuns=META.recentRuns.slice(-20);
  saveMeta();
}

// place the grudge wall + arm the snipe from accumulated reads. Called from reset().
function setupOpp(){
  runBuf = []; snipe = null; snipeUsed = false; oppScarred = false; gotSniped = false;
  snipeFuse = null; callout = null; introT = 0; loreT = 0; overloadCd = 0; intro = null;
  resetPresentDialogue();
  // TERRITORY: hottest cell -> grudge wall
  let best = 0, bi = -1;
  for(let i=0;i<opp.terr.length;i++){ if(opp.terr[i] > best){ best = opp.terr[i]; bi = i; } }
  opp.grudge = bi >= 0 ? cellCenter(bi) : null;
  if(opp.grudge) slag.push({ x:opp.grudge.x, y:opp.grudge.y, grudge:true });
  // LATENESS: arm the snipe just before your habitual dump-fuse
  if(opp.lat.length >= K.OPP_MIN_PASSES){
    opp.medianLat = median(opp.lat);
    snipeFuse = Math.max(0.5, Math.min(K.FUSE_START-0.2, opp.medianLat + K.OPP_SNIPE_LEAD));
  }
  // The title boot must not consume the intro. Begin narration with control on the first actual run.
  if(opp.introVer !== INTRO_VERSION){
    intro = { phase:'talk', i:0, lineT:0 };
    player.lit = false; player.fuse = 0;
    slag = slag.filter(s => !s.grudge); snipeFuse = null; snipe = null;
    if(!onTitle){ opp.introVer = INTRO_VERSION; opp.seenIntro = true; saveOpp(); }
  }
  // otherwise, on a return run, the Keith cold-open reacts to how you played
  // Returning players keep control; later exchanges run over the active street.
}
// the player reaches the middle and the fire is forced on them: become lit, hand over control,
// and roll into the talking phase where the dialogue rides live gameplay.
function igniteIntro(){
  const p = player;
  p.heat = 0; p.lit = false;
  flash = DT*3; hitstop = K.HITSTOP;
  ring(p.x, p.y, p.r+6, 150, '#ff6a3d', 0.7);
  // you reach the middle and the town goes up around you — villagers catch fire
  const pool = crowd();
  for(let k=0;k<3 && pool.length;k++){ ignite(pool[Math.floor(rnd()*pool.length)], 'spark'); }
  intro.phase = 'talk';
  intro.i = Math.max(intro.i, 1);           // line 0 was the walk-in; roll into the narration
  intro.lineT = 0;
}

function fireSnipe(){
  const p = player;
  snipeUsed = true;
  const gx = opp.grudge ? opp.grudge.x : VW/2, gy = opp.grudge ? opp.grudge.y : 60;
  const tx = p.x + p.hx*p.spd*K.OPP_SNIPE_TELE;              // lead your drift
  const ty = Math.max(ARENA.TOP, Math.min(ARENA.BOTTOM, p.y + p.hy*p.spd*K.OPP_SNIPE_TELE));
  snipe = { ox:gx, oy:gy, tx:((tx%VW)+VW)%VW, ty, t:0, done:false, lt:0 };
  speakKeith(lineFor('fired'));
}

let opp = loadOpp();
