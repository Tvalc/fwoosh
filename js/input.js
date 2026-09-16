// ---------------------------------------------------------------- input
let ptr = { down:false, id:null, sx:0, sy:0, x:0, y:0, px:0, py:0, onVent:false };
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
  player.autoTarget=null;player.autoSightT=0;
  player.lunge = K.LUNGE_T;
  player.charges--; player.dashCd = K.DASH_CD;   // spend a charge (+ a tiny gap so one release can't double-fire)
  setVentHeld(false);                           // escape at a unit boundary; never bypass the commitment
}

// Pointer Burst is a slingshot gesture on touch and mouse. Pull opposite the desired travel
// direction. The vector is anchored to Duy's position at pointer-down so auto-run cannot skew it.
function pointerBurstAim(){
  if(!ptr.down || mode!=='play')return null;
  const target=screenToWorld(ptr.x,ptr.y), pullX=target.x-ptr.px, pullY=target.y-ptr.py;
  const dx=-pullX,dy=-pullY,m=Math.hypot(pullX,pullY);
  if(m<K.POINTER_BURST_CANCEL_R)return {cancel:true,dx,dy};
  return {cancel:false,dx,dy,ux:dx/m,uy:dy/m};
}

// Match the fixed-step dash closely enough to preview its collision-limited endpoint. This uses a
// throwaway body; the live player and obstacle state are never changed by aiming.
function pointerBurstEnd(aim){
  const q={x:player.x,y:player.y}, total=K.LUNGE_SPD*K.LUNGE_T;
  let left=total, blocked=false;
  while(left>0.0001){
    const step=Math.min(K.LUNGE_SPD*DT,left);left-=step;
    q.x+=aim.ux*step;q.y+=aim.uy*step;
    if(q.x<K.EDGE){q.x=K.EDGE;blocked=true;break;}
    if(q.x>VW-K.EDGE){q.x=VW-K.EDGE;blocked=true;break;}
    if(q.y<40){q.y=40;blocked=true;break;}
    if(q.y>VH-40){q.y=VH-40;blocked=true;break;}
    if(collideObstacles(q,player.r)){blocked=true;break;}
  }
  return {x:q.x,y:q.y,blocked};
}

// Aim uses the approved Makko flame frames as a directional trail and arrowhead. The thin ember
// spine is functional guidance beneath the art; no charge is spent until release.
function drawBurstFlame(ctx,x,y,h,phase,alpha,ux,uy){
  ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(uy,ux)+Math.PI/2);
  const drawn=drawFlame(ctx,0,0,h,phase,alpha);ctx.restore();return drawn;
}
function drawPointerBurstAim(ctx){
  const aim=pointerBurstAim();if(!aim)return;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  if(aim.cancel){
    ctx.strokeStyle='rgba(220,213,224,0.70)';ctx.lineWidth=4;
    const r=9;ctx.beginPath();ctx.moveTo(player.x-r,player.y-r);ctx.lineTo(player.x+r,player.y+r);
    ctx.moveTo(player.x+r,player.y-r);ctx.lineTo(player.x-r,player.y+r);ctx.stroke();ctx.restore();return;
  }
  const end=pointerBurstEnd(aim), ready=player.charges>0&&player.dashCd<=0;
  const sx=player.x+aim.ux*(player.r+8),sy=player.y+aim.uy*(player.r+8),dx=end.x-sx,dy=end.y-sy;
  const len=Math.hypot(dx,dy),alpha=ready?(end.blocked?0.62:0.96):0.34;

  // Deep ember spine keeps the direction readable between animated flame frames at phone scale.
  ctx.strokeStyle='rgba('+(ready?'208,55,20':'105,83,88')+','+(alpha*0.82)+')';ctx.lineWidth=4;
  ctx.shadowColor=ready?'rgba(255,78,20,0.72)':'rgba(93,73,82,0.35)';ctx.shadowBlur=8;
  ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(end.x,end.y);ctx.stroke();ctx.shadowBlur=0;

  // A large forward-pointing flame reaches the predicted endpoint; smaller staggered flames make
  // its tail read as one burning arrow instead of the former yellow dashed line.
  const headH=Math.min(54,Math.max(36,len*0.24)),headBaseX=end.x-aim.ux*headH,headBaseY=end.y-aim.uy*headH;
  let usedMakko=drawBurstFlame(ctx,headBaseX,headBaseY,headH,frame*0.55+2,alpha,aim.ux,aim.uy);
  const shaftLen=Math.max(0,len-headH),count=Math.max(2,Math.min(7,Math.floor(shaftLen/34)));
  for(let i=0;i<count;i++){
    const t=(i+0.65)/(count+0.25),h=20+(i%3)*4,side=(i%2?1:-1)*2.5;
    const x=sx+aim.ux*shaftLen*t-aim.uy*side,y=sy+aim.uy*shaftLen*t+aim.ux*side;
    usedMakko=drawBurstFlame(ctx,x,y,h,frame*0.48+i*1.7,alpha*(0.62+0.3*t),aim.ux,aim.uy)||usedMakko;
  }

  // Functional fallback if the Makko sheet has not loaded yet: solid ember arrow, never a dash.
  if(!usedMakko){
    const backX=end.x-aim.ux*20,backY=end.y-aim.uy*20,sideX=-aim.uy*11,sideY=aim.ux*11;
    ctx.fillStyle='rgba('+(ready?'239,81,25':'122,101,106')+','+alpha+')';ctx.beginPath();ctx.moveTo(end.x,end.y);
    ctx.lineTo(backX+sideX,backY+sideY);ctx.lineTo(backX-sideX,backY-sideY);ctx.closePath();ctx.fill();
  }
  ctx.restore();
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
  ptr.down = true; ptr.sx = x; ptr.sy = y; ptr.x=x; ptr.y=y; ptr.px=player.x; ptr.py=player.y;
}
function onMove(x,y){
  if(debugMenu.open)return;
  if(!ptr.down)return;
  ptr.x=x;ptr.y=y;                              // aim may change freely; crossing a threshold never commits
}
function onUp(){
  if(debugMenu.open)return;
  if(ptr.onVent){ ptr.onVent = false; setVentHeld(false); }
  else if(ptr.down){const aim=pointerBurstAim();if(aim&&!aim.cancel)lungeDir(aim.dx,aim.dy);}
  ptr.down = false;
}
// An interrupted gesture is not a completed tap: cancel without spending a dash.
function cancelPointer(){
  if(ptr.onVent) setVentHeld(false);
  player.ventDash=null;
  ptr.down = false; ptr.onVent = false; ptr.id=null;
}


// ---------------------------------------------------------------- wiring
function local(e){
  const r = cv.getBoundingClientRect();
  return { x:(e.clientX-r.left)/scale, y:(e.clientY-r.top)/scale };
}
cv.addEventListener('pointerdown', e=>{
  e.preventDefault();if(ptr.id!==null)return;if(e.pointerType==='touch')isTouch=true;
  const q=local(e);onDown(q.x,q.y);
  ptr.id=(ptr.down||ptr.onVent)?(e.pointerId??0):null;
});
cv.addEventListener('pointermove', e=>{
  if(ptr.id===null||(e.pointerId??0)!==ptr.id)return;e.preventDefault();
  const q=local(e);onMove(q.x,q.y);
});
window.addEventListener('pointerup', e=>{
  if(ptr.id===null||(e.pointerId??0)!==ptr.id)return;
  if(ptr.down&&Number.isFinite(e.clientX)&&Number.isFinite(e.clientY)){
    const q=local(e);onMove(q.x,q.y);             // use the actual release point even if no final move event fired
  }
  onUp();ptr.id=null;
});
window.addEventListener('pointercancel', e=>{if(ptr.id!==null&&(e.pointerId??0)===ptr.id)cancelPointer();});
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
    if(k===' '||k==='enter'){ e.preventDefault(); if(!e.repeat){if(hubSheet==='judgment')judgmentAdvance();else if(hubSheet==='city')cityAction('cityclose');else if(hubSheet)hubSheet=null;else reset();} }
    else if(k==='escape'){if(hubSheet==='city')cityAction('cityclose');else hubSheet=null;}
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
