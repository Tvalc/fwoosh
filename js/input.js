// ---------------------------------------------------------------- input
let ptr = { down:false, sx:0, sy:0, t:0, swiped:false, onVent:false };
// The VENT button — a fixed thumb-target, bottom-right. Vent fires ONLY from here (or SPACE), never from a
// stray tap, so it can't happen by accident.
function ventBtn(){ const r = 62; return { x: 634, y: 1176, r }; }

// keyboard: WASD/arrows steer, SHIFT dashes, SPACE braces
const keys = Object.create(null);
const KEYVEC = { w:[0,-1], s:[0,1], a:[-1,0], d:[1,0],
                 arrowup:[0,-1], arrowdown:[0,1], arrowleft:[-1,0], arrowright:[1,0] };
function heldVec(){
  let x=0, y=0;
  for(const k in KEYVEC){ if(keys[k]){ x += KEYVEC[k][0]; y += KEYVEC[k][1]; } }
  const m = Math.hypot(x,y);
  return m > 0.001 ? [x/m, y/m] : null;
}
let hinted = false;
let isTouch = (typeof window!=='undefined') && ('ontouchstart' in window || (navigator.maxTouchPoints||0) > 0);

// Backtick opens a paused debug screen. Reset is a separate, explicit confirmation.
const debugMenu={open:false,confirm:false,selected:0,error:''};
function toggleDebugMenu(){
  cancelPointer();for(const k in keys)keys[k]=false;setVentHeld(false);
  debugMenu.open=!debugMenu.open;debugMenu.confirm=false;debugMenu.selected=0;debugMenu.error='';
  if(debugMenu.open)CG.stop();else if(mode==='play'&&!onTitle)CG.start();
}
function debugButtons(){return [
  {x:64,y:650,w:VW-128,h:94,label:debugMenu.confirm?'CANCEL':'RESUME',act:'cancel'},
  {x:64,y:778,w:VW-128,h:104,label:debugMenu.confirm?'CONFIRM RESET AND RESTART':'RESET PROGRESS AND RESTART',act:'reset'}
];}
function debugAction(action){
  if(!debugMenu.open)return;
  if(action==='cancel'){
    if(debugMenu.confirm){debugMenu.confirm=false;debugMenu.selected=0;debugMenu.error='';}
    else toggleDebugMenu();
    return;
  }
  if(action!=='reset')return;
  if(!debugMenu.confirm){debugMenu.confirm=true;debugMenu.selected=0;debugMenu.error='';return;}
  resetDebugProgress();
}
function debugMenuClick(x,y){
  for(const b of debugButtons())if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){debugAction(b.act);return;}
}
function resetDebugProgress(){
  if(!debugMenu.open||!debugMenu.confirm)return false;
  const snapshots=[];
  try{
    // Never clear the origin: other games can share tvalc.github.io storage.
    for(const key of ['fwoosh.meta','fwoosh.opp'])snapshots.push([key,localStorage.getItem(key)]);
    for(const [key] of snapshots)localStorage.removeItem(key);
    for(const [key] of snapshots)if(localStorage.getItem(key)!==null)throw Error('Save was not removed');
  }catch(e){
    let restored=true;
    for(const [key,value] of snapshots){try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}catch(restoreError){restored=false;}}
    debugMenu.error=restored?'Reset failed. Your progress is unchanged.': 'Reset failed. Saved progress may be partially cleared.';
    return false;
  }
  cancelPointer();for(const k in keys)keys[k]=false;
  META=loadMeta();opp=loadOpp();selDistrict=1;god=false;ghost=false;
  hubSheet=null;hubBtns=[];hubScroll=0;hubToast=0;hubToastMsg='';wellJustRose=false;
  diaryOpen=null;diaryPage=0;dialogueHistoryPage=0;hinted=false;onTitle=false;
  debugMenu.open=false;debugMenu.confirm=false;debugMenu.selected=0;debugMenu.error='';
  reset();saveMeta();return true;
}

function lungeDir(dx,dy){
  if(debugMenu.open)return;
  const m = Math.hypot(dx,dy); if(m < 0.0001) return;
  if(mode !== 'play' || player.charges <= 0 || player.dashCd > 0) return;   // dashes are rechargeable
  if(player.ventUnit){ player.ventHeld=false; player.ventDash=[dx/m,dy/m]; return; }
  if(intro && intro.phase === 'walkin') return;          // no control during the scripted entrance
  player.hx = dx/m; player.hy = dy/m;
  player.lunge = K.LUNGE_T;
  player.charges--; player.dashCd = K.DASH_CD;   // spend a charge (+ a tiny gap so one swipe can't double-fire)
  setVentHeld(false);                           // escape at a unit boundary; never bypass the commitment
}

// Results have explicit actions; a held movement/vent key must never dismiss them.
function resultButtons(){return [
  {x:48,y:790,w:VW-96,h:100,act:'retry'},
  {x:48,y:914,w:VW-96,h:92,act:'town'}
];}
function resultAction(action){
  if(mode!=='over')return;
  const target=won?Math.min(META.district,runDistrict+1):runDistrict;
  cancelPointer();for(const k in keys)keys[k]=false;setVentHeld(false);
  enterHub();
  if(action==='retry'){selDistrict=target;reset();introT=0;}
  else openNextUpgrade();
}
function resultClick(x,y){
  for(const b of resultButtons())if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){resultAction(b.act);return;}
}

function onDown(x,y){
  if(debugMenu.open){debugMenuClick(x,y);return;}
  if(onTitle){ onTitle = false; hinted = false; reset(); return; }   // start from the title screen
  if(introT > 0){ introT = 0; return; }            // dismiss intro card; keep the controls hint alive
  hinted = true;                                   // touch player: the keyboard hint isn't for you
  if(mode === 'over'){ resultClick(x,y); return; }        // run ended -> return to the town hub
  if(mode === 'hub'){ hubClick(x,y); return; }      // tapping the town: buildings / shop / PLAY
  // Mobile only: the on-screen VENT button. (Desktop vents with SPACE, so no button — a click there dashes.)
  if(isTouch && mode === 'play'){ const vb = ventBtn();
    if(Math.hypot(x-vb.x, y-vb.y) <= vb.r + 14){ ptr.onVent = true; setVentHeld(true); return; } }
  if(!inWorldView(x,y)){cancelPointer();return;}
  ptr.down = true; ptr.sx = x; ptr.sy = y; ptr.t = 0; ptr.swiped = false;
}
function onMove(x,y){
  if(debugMenu.open)return;
  if(!ptr.down || ptr.swiped) return;
  const dx = x-ptr.sx, dy = y-ptr.sy;
  if(Math.hypot(dx,dy) >= K.SWIPE_MIN){ ptr.swiped = true; lungeDir(dx,dy); }   // swipe/drag = dash that way
}
function onUp(){
  if(debugMenu.open)return;
  if(ptr.onVent){ ptr.onVent = false; setVentHeld(false); }
  else if(ptr.down && !ptr.swiped){                       // a click / tap (no drag) = DASH toward the point
    const target=screenToWorld(ptr.sx,ptr.sy);
    const dx = target.x-player.x, dy = target.y-player.y;
    if(Math.hypot(dx,dy) >= 12) lungeDir(dx,dy);
  }
  ptr.down = false; ptr.swiped = false;
}
// An interrupted gesture is not a completed tap: cancel without spending a dash.
function cancelPointer(){
  if(ptr.onVent) setVentHeld(false);
  player.ventDash=null;
  ptr.down = false; ptr.swiped = false; ptr.onVent = false;
}


// ---------------------------------------------------------------- wiring
function local(e){
  const r = cv.getBoundingClientRect();
  return { x:(e.clientX-r.left)/scale, y:(e.clientY-r.top)/scale };
}
cv.addEventListener('pointerdown', e=>{ e.preventDefault(); if(e.pointerType==='touch') isTouch=true; const q=local(e); onDown(q.x,q.y); });
cv.addEventListener('pointermove', e=>{ const q=local(e); onMove(q.x,q.y); });
window.addEventListener('pointerup', onUp);
window.addEventListener('pointercancel', cancelPointer);
// desktop: WASD/arrows steer, SHIFT dashes, SPACE braces
window.addEventListener('keydown', e=>{
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase();
  if(k==='`'||e.code==='Backquote'){e.preventDefault();if(!e.repeat)toggleDebugMenu();return;}
  if(debugMenu.open){
    e.preventDefault();if(e.repeat)return;
    if(k==='escape')debugAction('cancel');
    else if(k==='arrowdown'||k==='arrowup')debugMenu.selected=1-debugMenu.selected;
    else if(k==='enter')debugAction(debugButtons()[debugMenu.selected].act);
    return;
  }
  if(k === 'k'){ e.preventDefault();                       // cycle art skins (dev/preview)
    const names = Object.keys(SKINS); setSkin(names[(names.indexOf(SKIN_NAME)+1)%names.length]); return; }
  if(onTitle){ if(KEYVEC[k]||k===' '||k==='enter'){ e.preventDefault(); onTitle=false; hinted=false; reset(); } return; }
  if(introT > 0){ introT = 0; if(KEYVEC[k]||k===' '||k==='shift'||k==='enter'){ e.preventDefault(); } return; }
  if(mode === 'over'){
    if(k==='r'||k==='enter'||k===' '||k==='t'){e.preventDefault();if(!e.repeat)resultAction(k==='t'?'town':'retry');}
    return;
  }
  if(mode === 'hub'){                                 // in the town: Space/Enter = PLAY, Esc closes a sheet
    if(k===' '||k==='enter'){ e.preventDefault(); if(!e.repeat){if(hubSheet) hubSheet=null; else reset();} }
    else if(k==='escape'){ hubSheet=null; }
    return;
  }
  if(KEYVEC[k]){ e.preventDefault(); keys[k] = true; hinted = true; }
  if(k === 'shift'){
    e.preventDefault();
    if(!e.repeat){                                   // holding SHIFT must not drain all 3 charges
      const v = heldVec() || [player.hx, player.hy];
      lungeDir(v[0], v[1]); hinted = true;
    }
  }
  // VENT on SPACE — hold to keep blasting fire off you. Only on a FRESH press: OS key-repeat must not
  // re-arm chaining after a requested escape; a fresh press is required.
  if(k === ' ' && !e.repeat){ e.preventDefault(); setVentHeld(true); hinted = true; }
});
window.addEventListener('keyup', e=>{
  const k = e.key.toLowerCase();
  if(KEYVEC[k]) keys[k] = false;
  if(k === ' ') setVentHeld(false);
});
// dropping focus mid-key would otherwise leave you steering forever
window.addEventListener('blur', ()=>{ for(const k in keys) keys[k] = false; cancelPointer(); setVentHeld(false); player.ventDash=null; });
