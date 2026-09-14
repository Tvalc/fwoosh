// ---------------------------------------------------------------- input
let ptr = { down:false, sx:0, sy:0, t:0, swiped:false, onVent:false };
// The VENT button — a fixed thumb-target, bottom-right. Vent fires ONLY from here (or SPACE), never from a
// stray tap, so it can't happen by accident.
function ventBtn(){ const r = 80; return { x: VW - r - 26, y: VH - r - 58, r }; }

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

function lungeDir(dx,dy){
  const m = Math.hypot(dx,dy); if(m < 0.0001) return;
  if(mode !== 'play' || player.charges <= 0 || player.dashCd > 0) return;   // dashes are rechargeable
  if(intro && intro.phase === 'walkin') return;          // no control during the scripted entrance
  player.hx = dx/m; player.hy = dy/m;
  player.lunge = K.LUNGE_T;
  player.charges--; player.dashCd = K.DASH_CD;   // spend a charge (+ a tiny gap so one swipe can't double-fire)
  player.venting = false;                        // a DASH CANCELS a vent — always an escape, never stunlocked
}

function onDown(x,y){
  if(onTitle){ onTitle = false; hinted = false; reset(); return; }   // start from the title screen
  if(introT > 0){ introT = 0; return; }            // dismiss intro card; keep the controls hint alive
  hinted = true;                                   // touch player: the keyboard hint isn't for you
  if(mode === 'over'){ enterHub(); return; }        // run ended -> return to the town hub
  if(mode === 'hub'){ hubClick(x,y); return; }      // tapping the town: buildings / shop / PLAY
  // Mobile only: the on-screen VENT button. (Desktop vents with SPACE, so no button — a click there dashes.)
  if(isTouch && mode === 'play'){ const vb = ventBtn();
    if(Math.hypot(x-vb.x, y-vb.y) <= vb.r + 14){ ptr.onVent = true; player.venting = true; return; } }
  ptr.down = true; ptr.sx = x; ptr.sy = y; ptr.t = 0; ptr.swiped = false;
}
function onMove(x,y){
  if(!ptr.down || ptr.swiped) return;
  const dx = x-ptr.sx, dy = y-ptr.sy;
  if(Math.hypot(dx,dy) >= K.SWIPE_MIN){ ptr.swiped = true; lungeDir(dx,dy); }   // swipe/drag = dash that way
}
function onUp(){
  if(ptr.onVent){ ptr.onVent = false; player.venting = false; }
  else if(ptr.down && !ptr.swiped){                       // a click / tap (no drag) = DASH toward the point
    const dx = ptr.sx-player.x, dy = ptr.sy-player.y;
    if(Math.hypot(dx,dy) >= 12) lungeDir(dx,dy);
  }
  ptr.down = false; ptr.swiped = false;
}
// An interrupted gesture is not a completed tap: cancel without spending a dash.
function cancelPointer(){
  if(ptr.onVent) player.venting = false;
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
  if(k === 'k'){ e.preventDefault();                       // cycle art skins (dev/preview)
    const names = Object.keys(SKINS); setSkin(names[(names.indexOf(SKIN_NAME)+1)%names.length]); return; }
  if(onTitle){ if(KEYVEC[k]||k===' '||k==='enter'){ e.preventDefault(); onTitle=false; hinted=false; reset(); } return; }
  if(introT > 0){ introT = 0; if(KEYVEC[k]||k===' '||k==='shift'||k==='enter'){ e.preventDefault(); } return; }
  if(mode === 'over'){
    if(KEYVEC[k] || k===' ' || k==='shift' || k==='enter'){ e.preventDefault(); enterHub(); }
    return;
  }
  if(mode === 'hub'){                                 // in the town: Space/Enter = PLAY, Esc closes a sheet
    if(k===' '||k==='enter'){ e.preventDefault(); if(hubSheet) hubSheet=null; else reset(); }
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
  // re-arm the vent right after a dash cancels it (that was the desktop "stunlock").
  if(k === ' ' && !e.repeat){ e.preventDefault(); player.venting = true; hinted = true; }
});
window.addEventListener('keyup', e=>{
  const k = e.key.toLowerCase();
  if(KEYVEC[k]) keys[k] = false;
  if(k === ' ') player.venting = false;
});
// dropping focus mid-key would otherwise leave you steering forever
window.addEventListener('blur', ()=>{ for(const k in keys) keys[k] = false; cancelPointer(); player.venting = false; });
