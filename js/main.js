// ---------------------------------------------------------------- loop
let acc = 0, last = 0;
function loop(now){
  if(!last) last = now;
  let d = (now-last)/1000; last = now;
  if(d > 0.25) d = 0.25;
  acc += d;
  let guard = 0;
  while(acc >= DT && guard++ < 600){ step(); acc -= DT; }
  render();
  requestAnimationFrame(loop);
}

fit(); reset(); requestAnimationFrame(loop); CG.init();

// ---------------------------------------------------------------- debug hooks
// The preview pane runs headless (document.hidden), so rAF is paused.
// Drive and assert through these instead of screenshots.
window.__fwoosh = {
  tick(n){ for(let i=0;i<(n||1);i++) step(); return this.state(); },
  sim(sec){ const n = Math.round((sec||1)/DT); for(let i=0;i<n;i++) step(); return this.state(); },
  paint(){ render(); return true; },
  reset(seed){ reset(seed); return this.state(); },
  state(){ return {
    mode, score, elapsed:+elapsed.toFixed(3), frame, cooldowns, popCause,
    lit:player.lit, fuse:+player.fuse.toFixed(3), charges:player.charges,
    bracing:player.bracing, spd:Math.round(player.spd), lunge:+player.lunge.toFixed(3),
    x:Math.round(player.x), y:Math.round(player.y),
    crowd:crowd().length, hunters:hunters().length, slag:slag.length,
    heat:player.heat, hp:+(player.hp!=null?player.hp:1).toFixed(3), saved, dumped,
    venting:player.venting, demons:demons.length, hurtCd:+(player.hurtCd||0).toFixed(3),
    arson:arson.length, intercepts, edge:+edge.toFixed(2), keithPressureCount, keithStrike:keithStrike ? {t:+keithStrike.t.toFixed(2),done:keithStrike.done} : null,
    husks:husks.length, wraiths:demons.filter(d=>d.source==='town').length,
    runDistrict, runQuota, metaDistrict:META.district,
    arbiterLv:boss&&boss.level, arbiterMove:boss&&boss.move, dumpNeeded:boss&&boss.dumpNeeded,
    allies:allies.length, shots:shots.length, wake:wake.length, pulses:pulses.length, shield:boss&&!!boss.shield,
    duel:duelActive, won, slagThisRun, surge:+surgeT.toFixed(2), powerups:powerups.length,
    trail:trail.length, hunterFuse:+hunterFuse.toFixed(2), armed,
    passeeId:player.passeeId, passT:+player.passT.toFixed(3), hitstop:+hitstop.toFixed(3),
  }; },
  cells(){ return cells.map(c=>({id:c.id,x:Math.round(c.x),y:Math.round(c.y),
    hunter:c.hunter,fuse:+c.fuse.toFixed(2)})); },
  slag(){ return slag.map(s=>({x:Math.round(s.x),y:Math.round(s.y)})); },
  lunge(dx,dy){ lungeDir(dx,dy); return this.state(); },
  brace(v){ player.bracing = !!v; return this.state(); },
  tp(x,y){ player.x=x; player.y=y; return this.state(); },
  setFuse(v){ player.fuse=v; return this.state(); },
  ghost(v){ ghost = !!v; return ghost; },
  god(v){ god = !!v; return god; },
  setLit(v,f){ player.lit = !!v; if(f!==undefined) player.fuse = f; return this.state(); },
  // advance until the player's own pass timer reaches t (game-time, so hitstop/slowmo safe)
  untilPassT(t){ let g=0; while(player.passT < t && g++ < 3000) step(); return this.state(); },
  grant(n){ player.charges = n===undefined?K.CHARGES:n; return this.state(); },
  // does a legal 112px lunge vector exist from here? (the soft-lock instrument)
  boxedIn(){
    const p = player, reach = K.LUNGE_SPD*K.LUNGE_T;
    for(let i=0;i<24;i++){
      const a = i/24*Math.PI*2, ex = p.x+Math.cos(a)*reach, ey = p.y+Math.sin(a)*reach;
      if(ey < 40 || ey > VH-40) continue;
      if(!nearSlag(ex, ey<40?40:ey, p.r)) return false;
    }
    return true;
  },
  consts(){ return K; },
  // ---- THE OPP inspection
  oppState(){ return {
    runs: opp.runs, passes: opp.lat.length,
    medianLat: opp.medianLat != null ? +opp.medianLat.toFixed(3) : null,
    snipeFuse: snipeFuse != null ? +snipeFuse.toFixed(3) : null, snipeUsed,
    grudge: opp.grudge ? {x:Math.round(opp.grudge.x), y:Math.round(opp.grudge.y)} : null,
    terrMax: Math.max.apply(null, opp.terr), terrSum: opp.terr.reduce((a,b)=>a+b,0),
    introT: +introT.toFixed(2), scarred: oppScarred, gotSniped, runBuf: runBuf.length,
    stage: feudStage(), readsBroken: opp.readsBroken||0, timesSniped: opp.timesSniped||0,
    duelWins: opp.duelWins||0,
    snipe: snipe ? {t:+snipe.t.toFixed(2), done:snipe.done, tx:Math.round(snipe.tx), ty:Math.round(snipe.ty)} : null,
    callout: callout ? callout.text : null,
  }; },
  resetOpp(){ opp = { terr:new Array(K.OPP_COLS*K.OPP_ROWS).fill(0), lat:[], grudge:null, medianLat:null,
    runs:0, readsBroken:0, timesSniped:0, seenIntro:false, duelWins:0, loreIdx:0 };
    try{ localStorage.removeItem(SAVE_KEYS.opp); }catch(e){} return this.oppState(); },
  skipIntro(){ introT = 0; return true; },
  clearIntro(){ onTitle = false; intro = null; introT = 0; return this.state(); },   // dismiss title + LIVE walk-in/talk instantly (test setup)
  setIntro(t, kind){ introT = t; if(kind) introKind = kind; return introT; },  // hold a screen for preview
  forcePop(){ pop('test'); return this.oppState(); },
  // narration the render would show right now, for verifying the arc
  narr(){ const st = feudStage();
    const g = st==='debut' ? STORY.greet.debut : STORY.greet[st][(opp.runs||0)%STORY.greet[st].length];
    return { stage:st, greetBig:g.big, greetSub:g.sub, premise:STORY.premise, introKind,
      study: (opp.runs>=1) ? lineFor('study') : null,
      fired: lineFor('fired'), sniped: lineFor('sniped'), broken: lineFor('broken') }; },
  setFeud(runs, broken, sniped){ opp.runs=runs; opp.readsBroken=broken; opp.timesSniped=sniped;
    return this.narr(); },
  story(){ return STORY; },
  // ---- boss inspection & drivers
  bossState(){ return boss ? { kind:boss.kind, state:boss.state, x:Math.round(boss.x), y:Math.round(boss.y),
    fuse:+boss.fuse.toFixed(2), downs:boss.downs, t:+(boss.t||0).toFixed(2) } : null; },
  forceDuel(){ startDuel(); return this.bossState(); },
  setWins(n){ opp.duelWins = n; return { duelWins:opp.duelWins }; },
  setDistrict(sel, unlocked){ selDistrict = sel||1; if(unlocked!=null){ META.district = unlocked; saveMeta(); } return { selDistrict, metaDistrict:META.district }; },
  openDiary(i){ onTitle=false; intro=null; mode='hub'; hubSheet='diary'; diaryOpen = (i==null?null:i); diaryPage=0; if(i!=null&&DIARY[i]) diaryMarkRead(DIARY[i].id); return { fresh:diaryFreshCount() }; },
  showSheet(name){ onTitle=false; intro=null; mode='hub'; hubSheet=name; diaryOpen=null; return { hubSheet }; },
  city(){return JSON.parse(JSON.stringify(META.city));},
  judgment(){return {terms:judgmentTerms(),eligible:!!META.judgment.eligible,heard:!!META.judgment.heard,page:judgmentPage};},
  cityAct(action){cityAction(action);return {sheet:hubSheet,view:cityView,tool:cityTool,message:cityMessage,city:this.city()};},
  cityAdvance(seconds){cityAdvance(META.city.lastAt+Math.max(0,Number(seconds)||0)*1000,true);return this.city();},
  diaryPage(n){ diaryPage=n; return diaryPage; },
  arbiterMove(k){ if(boss&&boss.kind==='arbiter'){ boss.move=null; boss.moveCd=0; startArbiterMove(boss,k); } return { move:boss&&boss.move }; },
  duelFX(){ return { shots:shots.length, wake:wake.length, pulses:pulses.length, demons:demons.length, allies:allies.length, move:boss&&boss.move, shield:boss&&!!boss.shield }; },
  riseNow(){ slagThisRun = nextRiserAt; maybeRise(); return this.bossState(); },
  killCrowd(n){ let k = 0;
    for(const c of cells){ if(!c.hunter && k < (n||99)){ c.dead = true; k++; } }
    cells = cells.filter(c=>!c.dead); return crowd().length; },
  bossTp(x,y){ if(boss){ boss.x=x; boss.y=y; } return this.bossState(); },
  addSlag(x,y){ slag.push({x,y}); return slag.length; },
  grudgeAt(x,y,scar){ opp.grudge={x:x,y:y}; oppScarred=!!scar; slag.push({x:x,y:y,grudge:true}); return this.oppState(); },
  winNow(){ if(!boss) startDuel(); winDuel(); return this.state(); },
  setHeat(n){ player.heat = Math.max(0, Math.min(K.HEAT_MAX, n)); return this.state(); },
  spawnArson(){ spawnArson(); return { arson: arson.map(a=>({x:Math.round(a.x),y:Math.round(a.y),warn:+a.warn.toFixed(2),tgt:a.tgt&&a.tgt.id})) }; },
  keithPressure(){ triggerKeithPressure(); return this.state(); },
  arson(){ return arson.map(a=>({x:Math.round(a.x),y:Math.round(a.y),warn:+a.warn.toFixed(2),tgtId:a.tgt&&a.tgt.id})); },
  husks(){ return husks.map(h=>({x:Math.round(h.x),y:Math.round(h.y),t:+h.t.toFixed(2),heatAt:h.heatAt})); },
  makeHusk(){ const c=crowd()[0]; if(c){ c.hunter=true; c.fuse=hunterFuse; becomeHusk(c); } return { husks:husks.length }; },
  vent(v){ setVentHeld(v===undefined?true:!!v); return { venting:player.venting, heat:player.heat, hp:+player.hp.toFixed(3), demons:demons.length }; },
  setHp(v){ player.hp = Math.max(0, Math.min(1, v)); return this.state(); },
  setHearts(n){ maxHearts = Math.max(1, Math.round(n)); return { maxHearts }; },
  setSaved(n){ saved = Math.max(0, Math.round(n)); saveIconPop = 0.6; return { saved }; },
  meta(){ return META; },
  metaSet(o){ Object.assign(META, o); saveMeta(); return META; },
  clearMeta(){ try{ localStorage.removeItem(SAVE_KEYS.meta); }catch(e){} META = loadMeta(); return META; },
  enterHub(){ enterHub(); return { mode }; },
  startIntro(){ opp = { terr:new Array(K.OPP_COLS*K.OPP_ROWS).fill(0), lat:[], grudge:null, medianLat:null,
    runs:0, readsBroken:0, timesSniped:0, seenIntro:false, duelWins:0, loreIdx:0 };
    reset(); return { intro: intro && intro.phase, mode }; },
  introState(){ return intro ? { phase:intro.phase, i:intro.i, lineT:+intro.lineT.toFixed(2), line:(STORY.intro[intro.i]||{}).text } : null; },
  forceMerge(){ mergeCheck(); return { powerups:powerups.length, slag:slag.length,
    pu: powerups.map(p=>({x:Math.round(p.x),y:Math.round(p.y),n:p.n})) }; },
  skin(n){ if(n!==undefined) setSkin(n); return { active:SKIN_NAME, all:Object.keys(SKINS) }; },
};
