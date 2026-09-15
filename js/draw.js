// ---------------------------------------------------------------- render
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
let scale = 1;
// Screen docks never change the 720 × 1280 simulation or obstacle coordinates.
const PLAY_VIEW = {top:128, bottom:1100, overhangTop:80, overhangBottom:24};
function worldView(){
  const s=Math.min(1,(PLAY_VIEW.bottom-PLAY_VIEW.top)/(VH+PLAY_VIEW.overhangTop+PLAY_VIEW.overhangBottom));
  return {x:(VW-VW*s)/2,y:PLAY_VIEW.top+PLAY_VIEW.overhangTop*s,w:VW*s,h:VH*s,s};
}
function worldToScreen(x,y){const v=worldView();return {x:v.x+x*v.s,y:v.y+y*v.s};}
function screenToWorld(x,y){const v=worldView();return {x:(x-v.x)/v.s,y:(y-v.y)/v.s};}
function inWorldView(x,y){const v=worldView();return x>=v.x&&x<=v.x+v.w&&y>=v.y&&y<=v.y+v.h;}


function fit(){
  const css=typeof getComputedStyle==='function'?getComputedStyle(document.body):null;
  const inset=k=>css?(parseFloat(css.getPropertyValue(k))||0):0;
  const iw=Math.max(1,(window.innerWidth||360)-inset('padding-left')-inset('padding-right'));
  const ih=Math.max(1,(window.innerHeight||640)-inset('padding-top')-inset('padding-bottom'));
  if(typeof ptr!=='undefined' && player)cancelPointer();
  scale = Math.min(iw/VW, ih/VH);
  const dpr = Math.min(2, window.devicePixelRatio||1);
  cv.style.width = (VW*scale)+'px'; cv.style.height = (VH*scale)+'px';
  cv.width = Math.round(VW*scale*dpr); cv.height = Math.round(VH*scale*dpr);
  ctx.setTransform(scale*dpr,0,0,scale*dpr,0,0);
}
window.addEventListener('resize', fit);
window.addEventListener('orientationchange', ()=>{ fit(); setTimeout(fit, 200); setTimeout(fit, 500); });
if(window.visualViewport){ visualViewport.addEventListener('resize', fit); }   // mobile URL-bar show/hide
window.addEventListener('load', fit);                                          // dimensions can settle after boot

// draw one thing three times so the wrap seam is invisible
function wrapDraw(x, fn){ fn(x); }   // enclosed arena — draw once, no seam duplication

// ================================================================ SKINS
// One engine, swappable art. A skin owns the ARENA look (backdrop + actors).
// Gauges (fuse rings live inside the actor draws), juice (rings/flash), and the
// UI/screens stay in the engine, shared across skins. See ART.md.
// Add a skin = add an entry here + (optionally) a Makko sprite set later.
const INK = '#141018';
function rrect(ctx,x,y,w,h,r){ r=Math.min(r,w/2,h/2); ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function aSparkle(ctx,x,y,s,col){ ctx.fillStyle=col||'#fff'; ctx.beginPath();
  ctx.moveTo(x,y-s); ctx.quadraticCurveTo(x,y,x+s,y); ctx.quadraticCurveTo(x,y,x,y+s);
  ctx.quadraticCurveTo(x,y,x-s,y); ctx.quadraticCurveTo(x,y,x,y-s); ctx.closePath(); ctx.fill(); }
function aBlush(ctx,x,y,r){ ctx.fillStyle='rgba(255,120,150,0.5)';
  ctx.beginPath(); ctx.ellipse(x-r*0.62,y+r*0.34,r*0.26,r*0.15,0,0,7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x+r*0.62,y+r*0.34,r*0.26,r*0.15,0,0,7); ctx.fill(); }
function aSweat(ctx,x,y,r){ ctx.fillStyle='rgba(150,220,255,0.92)'; ctx.beginPath();
  ctx.moveTo(x,y-r*0.55); ctx.quadraticCurveTo(x+r*0.42,y+r*0.1,x,y+r*0.32);
  ctx.quadraticCurveTo(x-r*0.42,y+r*0.1,x,y-r*0.55); ctx.fill(); }
function aFlame(ctx,x,y,r,ph){ const n=6;
  for(let i=0;i<n;i++){ const a=i/n*Math.PI*2 + Math.sin(ph+i)*0.25;
    const rr=r*(1.1+0.3*Math.sin(ph*3+i*1.7));
    const bx=x+Math.cos(a)*r*0.85, by=y+Math.sin(a)*r*0.85;
    const tx=x+Math.cos(a)*rr*1.6, ty=y+Math.sin(a)*rr*1.6;
    const px=x+Math.cos(a+0.6)*r*0.7, py=y+Math.sin(a+0.6)*r*0.7;
    const qx=x+Math.cos(a-0.6)*r*0.7, qy=y+Math.sin(a-0.6)*r*0.7;
    ctx.fillStyle=i%2?'#ffd36a':'#ff8a3d';
    ctx.beginPath(); ctx.moveTo(px,py); ctx.quadraticCurveTo(bx,by,tx,ty);
    ctx.quadraticCurveTo(bx,by,qx,qy); ctx.closePath(); ctx.fill(); } }
function aSpeed(ctx,x,y,a,len){ ctx.strokeStyle='rgba(255,220,180,0.6)'; ctx.lineWidth=1.6;
  for(let i=-1;i<=1;i++){ const off=i*4.2;
    const ox=x-Math.cos(a)*9 + Math.cos(a+Math.PI/2)*off, oy=y-Math.sin(a)*9 + Math.sin(a+Math.PI/2)*off;
    ctx.beginPath(); ctx.moveTo(ox,oy); ctx.lineTo(ox-Math.cos(a)*len, oy-Math.sin(a)*len); ctx.stroke(); } }
// big glossy anime eyes. mood: cute|scared|determined|rival|angry|dead|dizzy
function aEyes(ctx,x,y,r,mood,iris){
  const dx=r*0.42, ey=y-r*0.04, R=Math.max(1.7,r*0.36);
  if(mood==='dead'){ ctx.strokeStyle=INK; ctx.lineWidth=Math.max(1.5,r*0.13);
    for(const sx of [-dx,dx]){ ctx.beginPath();
      ctx.moveTo(x+sx-R*0.6,ey-R*0.6); ctx.lineTo(x+sx+R*0.6,ey+R*0.6);
      ctx.moveTo(x+sx+R*0.6,ey-R*0.6); ctx.lineTo(x+sx-R*0.6,ey+R*0.6); ctx.stroke(); } return; }
  if(mood==='dizzy'){ ctx.strokeStyle=INK; ctx.lineWidth=Math.max(1.2,r*0.11);
    for(const sx of [-dx,dx]){ ctx.beginPath(); ctx.arc(x+sx,ey,R*0.66,0,5.2); ctx.stroke(); } return; }
  for(const sx of [-dx,dx]){
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(x+sx,ey,R*0.92,R*1.16,0,0,7); ctx.fill();
    ctx.fillStyle=iris||'#2a2030'; ctx.beginPath(); ctx.arc(x+sx,ey+R*0.12,R*0.64,0,7); ctx.fill();
    ctx.fillStyle=INK; ctx.beginPath(); ctx.arc(x+sx,ey+R*0.12,R*0.32,0,7); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x+sx-R*0.3,ey-R*0.26,R*0.34,0,7); ctx.fill();
    ctx.beginPath(); ctx.arc(x+sx+R*0.24,ey+R*0.36,R*0.14,0,7); ctx.fill(); }
  if(mood==='angry'){ ctx.strokeStyle=INK; ctx.lineWidth=Math.max(1.5,r*0.13); ctx.beginPath();
    ctx.moveTo(x-dx-R*0.9,ey-R*1.25); ctx.lineTo(x-dx+R*0.65,ey-R*0.7);
    ctx.moveTo(x+dx+R*0.9,ey-R*1.25); ctx.lineTo(x+dx-R*0.65,ey-R*0.7); ctx.stroke(); }
  else if(mood==='determined'||mood==='rival'){ ctx.strokeStyle=INK; ctx.lineWidth=Math.max(1.3,r*0.11); ctx.beginPath();
    ctx.moveTo(x-dx-R*0.85,ey-R*1.2); ctx.lineTo(x-dx+R*0.85,ey-R*1.02);
    ctx.moveTo(x+dx-R*0.85,ey-R*1.02); ctx.lineTo(x+dx+R*0.85,ey-R*1.2); ctx.stroke(); }
}

// A drawn anime KEITH — the rival, as an actual character. Used big on the cold-open / win.
// cx,cy = face center; s = head half-height. mood: 'glare' | 'yield'.
function keithFace(ctx, cx, cy, s, mood){
  const L='#360c1f', yieldM=(mood==='yield');
  ctx.save(); ctx.lineJoin='round'; ctx.lineCap='round';

  // ---- back hair: dark flowing spikes
  ctx.fillStyle='#5e0e30'; ctx.beginPath();
  ctx.moveTo(cx-s*0.9, cy+s*0.5);
  ctx.bezierCurveTo(cx-s*1.28,cy-s*0.2, cx-s*1.12,cy-s*0.85, cx-s*0.92,cy-s*1.02);
  ctx.bezierCurveTo(cx-s*0.72,cy-s*1.5, cx-s*0.52,cy-s*1.18, cx-s*0.42,cy-s*1.12);
  ctx.bezierCurveTo(cx-s*0.32,cy-s*1.72, cx-s*0.04,cy-s*1.58, cx,cy-s*1.12);
  ctx.bezierCurveTo(cx+s*0.12,cy-s*1.68, cx+s*0.36,cy-s*1.5, cx+s*0.44,cy-s*1.08);
  ctx.bezierCurveTo(cx+s*0.66,cy-s*1.42, cx+s*0.86,cy-s*1.18, cx+s*0.94,cy-s*0.95);
  ctx.bezierCurveTo(cx+s*1.22,cy-s*0.68, cx+s*1.2,cy-s*0.1, cx+s*0.9,cy+s*0.5);
  ctx.closePath(); ctx.fill();

  // ---- neck + jaw shadow
  const ng=ctx.createLinearGradient(cx-s*0.3,0,cx+s*0.3,0);
  ng.addColorStop(0,'#e07a9a'); ng.addColorStop(1,'#b64d72');
  ctx.fillStyle=ng; ctx.fillRect(cx-s*0.3, cy+s*0.55, s*0.6, s*1.1);
  ctx.fillStyle='rgba(120,30,60,0.4)';
  ctx.beginPath(); ctx.ellipse(cx, cy+s*0.72, s*0.4, s*0.15, 0, 0, 7); ctx.fill();

  // ---- face, lit from the upper-left
  const facePath=()=>{ ctx.beginPath();
    ctx.moveTo(cx-s*0.76, cy-s*0.12);
    ctx.bezierCurveTo(cx-s*0.8,cy+s*0.32, cx-s*0.6,cy+s*0.68, cx-s*0.28,cy+s*0.92);
    ctx.bezierCurveTo(cx-s*0.11,cy+s*1.06, cx+s*0.11,cy+s*1.06, cx+s*0.28,cy+s*0.92);
    ctx.bezierCurveTo(cx+s*0.6,cy+s*0.68, cx+s*0.8,cy+s*0.32, cx+s*0.76,cy-s*0.12);
    ctx.bezierCurveTo(cx+s*0.74,cy-s*0.68, cx+s*0.48,cy-s*0.9, cx,cy-s*0.9);
    ctx.bezierCurveTo(cx-s*0.48,cy-s*0.9, cx-s*0.74,cy-s*0.68, cx-s*0.76,cy-s*0.12);
    ctx.closePath(); };
  const fg=ctx.createLinearGradient(cx-s*0.5,cy-s*0.9, cx+s*0.7,cy+s);
  fg.addColorStop(0,'#ffb6cd'); fg.addColorStop(0.55,'#ff90b0'); fg.addColorStop(1,'#e06a90');
  facePath(); ctx.fillStyle=fg; ctx.fill();
  facePath(); ctx.save(); ctx.clip();
  const sh=ctx.createLinearGradient(cx+s*0.05,0,cx+s*0.85,0);
  sh.addColorStop(0,'rgba(170,70,105,0)'); sh.addColorStop(1,'rgba(150,55,90,0.5)');
  ctx.fillStyle=sh; ctx.fillRect(cx-s,cy-s,s*2,s*2.2);
  ctx.fillStyle='rgba(255,120,150,0.3)';
  ctx.beginPath(); ctx.ellipse(cx-s*0.4,cy+s*0.34,s*0.19,s*0.11,0,0,7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx+s*0.42,cy+s*0.34,s*0.17,s*0.1,0,0,7); ctx.fill();
  ctx.restore();
  facePath(); ctx.lineWidth=s*0.045; ctx.strokeStyle=L; ctx.stroke();

  // ---- eyes
  const ey=cy+s*0.14, edx=s*0.37, ew=s*0.28, eh=s*0.26;
  for(const side of [-1,1]){ const ex=cx+side*edx;
    ctx.fillStyle='rgba(175,75,110,0.3)';
    ctx.beginPath(); ctx.ellipse(ex, ey-eh*0.15, ew*1.15, eh*0.95, 0, 0, 7); ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ex-side*ew, ey+eh*0.12);
    ctx.quadraticCurveTo(ex-side*ew*0.25, ey-eh*1.05, ex+side*ew*0.95, ey-eh*0.2);
    ctx.quadraticCurveTo(ex+side*ew*0.35, ey+eh*0.85, ex-side*ew, ey+eh*0.12);
    ctx.closePath(); ctx.clip();
    const wg=ctx.createLinearGradient(0,ey-eh,0,ey+eh);
    wg.addColorStop(0,'#dcc9d2'); wg.addColorStop(0.45,'#f7f2f5');
    ctx.fillStyle=wg; ctx.fillRect(ex-ew*1.4,ey-eh*1.4,ew*2.8,eh*2.8);
    const ix=ex+side*ew*0.06, iy=ey+eh*0.08, ir=eh*0.85;
    const ig=ctx.createRadialGradient(ix-ir*0.25,iy-ir*0.3,ir*0.1, ix,iy,ir);
    ig.addColorStop(0,'#d3f5ff'); ig.addColorStop(0.5,'#4bb4e6'); ig.addColorStop(1,'#125e8c');
    ctx.fillStyle=ig; ctx.beginPath(); ctx.arc(ix,iy,ir,0,7); ctx.fill();
    ctx.strokeStyle='rgba(8,40,66,0.65)'; ctx.lineWidth=ir*0.14; ctx.beginPath(); ctx.arc(ix,iy,ir*0.9,0,7); ctx.stroke();
    ctx.fillStyle='rgba(150,235,255,0.55)'; ctx.beginPath(); ctx.arc(ix,iy+ir*0.45,ir*0.55,0,Math.PI); ctx.fill();
    ctx.fillStyle='#0c2233'; ctx.beginPath(); ctx.arc(ix,iy,ir*0.4,0,7); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ix-ir*0.32,iy-ir*0.36,ir*0.3,0,7); ctx.fill();
    ctx.beginPath(); ctx.arc(ix+ir*0.36,iy+ir*0.3,ir*0.13,0,7); ctx.fill();
    ctx.restore();
    ctx.strokeStyle=L; ctx.lineWidth=s*0.065;                     // thick tapered upper liner
    ctx.beginPath();
    ctx.moveTo(ex-side*ew*1.08, ey+eh*0.08);
    ctx.quadraticCurveTo(ex-side*ew*0.2, ey-eh*1.15, ex+side*ew*1.02, ey-eh*0.28);
    ctx.stroke();
    ctx.lineWidth=s*0.04; ctx.beginPath();                        // outer lash flick
    ctx.moveTo(ex-side*ew*1.08, ey+eh*0.08); ctx.quadraticCurveTo(ex-side*ew*1.3,ey-eh*0.1, ex-side*ew*1.45,ey-eh*0.45); ctx.stroke();
    ctx.lineWidth=s*0.075; ctx.beginPath();                       // cocky brow
    const bh=yieldM?0.6:0.72;
    ctx.moveTo(cx+side*s*0.12, ey-s*(bh-0.14));
    ctx.quadraticCurveTo(ex, ey-s*bh, ex+side*s*0.32, ey-s*(bh-0.18));
    ctx.stroke();
  }

  // ---- nose
  ctx.fillStyle='rgba(155,55,90,0.4)';
  ctx.beginPath(); ctx.moveTo(cx-s*0.02,ey+s*0.26); ctx.lineTo(cx+s*0.08,ey+s*0.4); ctx.lineTo(cx-s*0.05,ey+s*0.4); ctx.closePath(); ctx.fill();
  ctx.fillStyle='rgba(255,205,220,0.6)'; ctx.beginPath(); ctx.ellipse(cx-s*0.02,ey+s*0.28,s*0.028,s*0.055,0,0,7); ctx.fill();

  // ---- mouth: smirk (tooth glint) / grimace on yield
  ctx.strokeStyle=L; ctx.lineWidth=s*0.05;
  if(yieldM){ ctx.beginPath(); ctx.moveTo(cx-s*0.26,cy+s*0.6); ctx.quadraticCurveTo(cx,cy+s*0.5,cx+s*0.26,cy+s*0.6); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(cx-s*0.24,cy+s*0.58); ctx.quadraticCurveTo(cx+s*0.06,cy+s*0.66,cx+s*0.36,cy+s*0.44); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.moveTo(cx+s*0.08,cy+s*0.55); ctx.lineTo(cx+s*0.3,cy+s*0.485); ctx.lineTo(cx+s*0.27,cy+s*0.56); ctx.closePath(); ctx.fill(); }

  // ---- front hair / bangs, layered with a shine band
  const hg=ctx.createLinearGradient(0,cy-s,0,cy);
  hg.addColorStop(0,'#d63a72'); hg.addColorStop(1,'#a81f54');
  ctx.fillStyle=hg; ctx.beginPath();
  ctx.moveTo(cx-s*0.78, cy-s*0.15);
  ctx.bezierCurveTo(cx-s*0.9,cy-s*0.8, cx-s*0.72,cy-s*1.02, cx-s*0.5,cy-s*1.02);
  ctx.bezierCurveTo(cx-s*0.56,cy-s*0.62, cx-s*0.42,cy-s*0.5, cx-s*0.3,cy-s*0.76);
  ctx.bezierCurveTo(cx-s*0.26,cy-s*0.44, cx-s*0.12,cy-s*0.4, cx-s*0.05,cy-s*0.68);
  ctx.bezierCurveTo(cx+s*0.02,cy-s*0.36, cx+s*0.16,cy-s*0.44, cx+s*0.22,cy-s*0.72);
  ctx.bezierCurveTo(cx+s*0.3,cy-s*0.44, cx+s*0.44,cy-s*0.52, cx+s*0.5,cy-s*0.82);
  ctx.bezierCurveTo(cx+s*0.62,cy-s*0.56, cx+s*0.74,cy-s*0.72, cx+s*0.78,cy-s*0.96);
  ctx.bezierCurveTo(cx+s*0.92,cy-s*0.78, cx+s*0.86,cy-s*0.4, cx+s*0.78,cy-s*0.15);
  ctx.bezierCurveTo(cx+s*0.5,cy-s*1.02, cx-s*0.5,cy-s*1.02, cx-s*0.78,cy-s*0.15);
  ctx.closePath(); ctx.fill();
  ctx.lineWidth=s*0.04; ctx.strokeStyle=L; ctx.stroke();
  ctx.fillStyle='rgba(255,165,200,0.75)';
  ctx.beginPath(); ctx.ellipse(cx-s*0.08,cy-s*0.74,s*0.46,s*0.11,-0.18,0,7); ctx.fill();
  ctx.strokeStyle='rgba(54,12,31,0.45)'; ctx.lineWidth=s*0.022;
  ctx.beginPath();
  ctx.moveTo(cx-s*0.34,cy-s*0.92); ctx.quadraticCurveTo(cx-s*0.3,cy-s*0.6,cx-s*0.22,cy-s*0.5);
  ctx.moveTo(cx+s*0.04,cy-s*0.96); ctx.quadraticCurveTo(cx+s*0.1,cy-s*0.6,cx+s*0.16,cy-s*0.5);
  ctx.moveTo(cx+s*0.4,cy-s*0.9); ctx.quadraticCurveTo(cx+s*0.46,cy-s*0.62,cx+s*0.5,cy-s*0.55); ctx.stroke();

  // ---- glowing cyan rim light down the left edge
  ctx.save(); ctx.shadowColor='rgba(159,233,255,0.9)'; ctx.shadowBlur=s*0.22;
  ctx.strokeStyle='rgba(179,240,255,0.9)'; ctx.lineWidth=s*0.045;
  ctx.beginPath();
  ctx.moveTo(cx-s*0.5,cy-s*1.02);
  ctx.bezierCurveTo(cx-s*0.72,cy-s*1.02,cx-s*0.9,cy-s*0.8,cx-s*0.78,cy-s*0.15);
  ctx.bezierCurveTo(cx-s*0.8,cy+s*0.32,cx-s*0.6,cy+s*0.68,cx-s*0.28,cy+s*0.92);
  ctx.stroke();
  ctx.restore();

  if(!yieldM) aSparkle(ctx, cx+edx-ew*0.35, ey-eh*0.4, s*0.12, '#fff');
  ctx.restore();
}

// glossy shaded orb (bodies) and beveled box (walls) — cheap dimension for the little guys
function glossyOrb(ctx,x,y,r,cHi,cLo){
  const g=ctx.createRadialGradient(x-r*0.34,y-r*0.4,r*0.08, x,y,r*1.06);
  g.addColorStop(0,cHi); g.addColorStop(1,cLo);
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
  ctx.lineWidth=Math.max(1.5,r*0.16); ctx.strokeStyle=INK; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.ellipse(x-r*0.34,y-r*0.42,r*0.24,r*0.15,-0.5,0,7); ctx.fill();
}
function bevelBox(ctx,x,y,R,cHi,cLo){
  const g=ctx.createLinearGradient(x-R,y-R,x+R*0.5,y+R);
  g.addColorStop(0,cHi); g.addColorStop(1,cLo);
  rrect(ctx,x-R,y-R,R*2,R*2,R*0.32); ctx.fillStyle=g; ctx.fill();
  ctx.save(); rrect(ctx,x-R,y-R,R*2,R*2,R*0.32); ctx.clip();
  ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.beginPath(); ctx.ellipse(x-R*0.35,y-R*0.5,R*0.7,R*0.32,-0.4,0,7); ctx.fill();
  ctx.fillStyle='rgba(0,0,0,0.22)'; ctx.fillRect(x-R,y+R*0.45,R*2,R*0.55); ctx.restore();
  ctx.lineWidth=Math.max(1.7,R*0.18); ctx.strokeStyle=INK; rrect(ctx,x-R,y-R,R*2,R*2,R*0.32); ctx.stroke();
}

// ---- Makko pixel sprite set: real drawn characters (Makko.ai, 16-bit), embedded
// driven (bob / squash / flip / flame overlay) so no multi-frame sheets are needed.
function sprReady(k){ const im=MAKKO_IMG[k]; return !!(im && im.complete && im.naturalWidth>0); }
// draw sprite key centred at (X,y), scaled so its height = targetH. opts:
// flip(x-mirror) dy(vertical offset) sx/sy(extra scale) rot(radians) alpha
function drawSpr(ctx, key, X, y, targetH, o){ o=o||{};
  if(!sprReady(key)) return false;
  const im=MAKKO_IMG[key], sc=targetH/im.naturalHeight, w=im.naturalWidth*sc;
  ctx.save(); ctx.translate(X, y+(o.dy||0));
  if(o.rot) ctx.rotate(o.rot);
  ctx.scale((o.flip?-1:1)*(o.sx||1), (o.sy||1));
  if(o.alpha!=null) ctx.globalAlpha*=o.alpha;
  ctx.imageSmoothingEnabled=true;
  ctx.drawImage(im, -w/2, -targetH/2, w, targetH);
  ctx.restore(); return true; }

// A dark SILHOUETTE of a Makko sprite (same shape, filled dark) — cached. Used for the empty slots of the
// rescue counter, which fill in with the real (colored) sprite as you save villagers.
const _sil = {};
function silhouette(key){
  if(_sil[key]) return _sil[key];
  if(!sprReady(key)) return null;                       // not loaded yet — retry next frame
  const im = MAKKO_IMG[key], c = document.createElement('canvas');
  c.width = im.naturalWidth; c.height = im.naturalHeight;
  const g = c.getContext('2d'); g.drawImage(im, 0, 0);
  // dark core + a lighter rim so the empty slot reads on the busy dungeon floor
  g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#9a94ad'; g.fillRect(0,0,c.width,c.height);
  return (_sil[key] = c);
}

// THE VENT BUTTON — bespoke thumb-target (bottom-right). A fire-blast disc that lights up when you're carrying
// heat and dims when you're empty; the icon is the real Makko flame. Press/hold it (or SPACE) to vent.
function drawVentButton(ctx){
  const b = ventBtn(), heatF = player.heat/K.HEAT_MAX, pressed = player.venting;
  const hot = (player.hp < 0.999 || player.heat > 0);      // "active": you can heal by holding it
  const low = player.hp < 0.4;                             // hearts critical -> beckon
  ctx.save(); ctx.textAlign = 'center';
  // aura when it's worth holding (heal or purge) — pulls the thumb to it, urgent when low
  if(hot){ const pr = b.r*1.16 + heatF*14 + (pressed?10:(low?6:3)*Math.abs(Math.sin(frame*(low?0.5:0.3))));
    const g = ctx.createRadialGradient(b.x,b.y,b.r*0.55, b.x,b.y,pr);
    g.addColorStop(0,'rgba(255,120,40,'+(0.28+0.30*heatF).toFixed(2)+')'); g.addColorStop(1,'rgba(255,90,30,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(b.x,b.y,pr,0,7); ctx.fill(); }
  const R = b.r*(pressed?0.93:1);
  ctx.globalAlpha = hot ? 1 : 0.42;                         // dim when there's nothing to vent
  // disc
  const base = ctx.createRadialGradient(b.x,b.y-R*0.35,R*0.2, b.x,b.y,R);
  base.addColorStop(0, pressed?'#6a2411':'#3c1a10'); base.addColorStop(1,'#180b09');
  ctx.fillStyle=base; ctx.beginPath(); ctx.arc(b.x,b.y,R,0,7); ctx.fill();
  // Makko flame icon inside the disc
  if(!drawFlame(ctx, b.x, b.y+R*0.52, R*(1.15+heatF*0.45), frame*0.4, hot?0.95:0.5)){
    ctx.fillStyle = hot?'#ff7a2e':'rgba(255,120,60,0.5)';
    ctx.beginPath(); ctx.moveTo(b.x-R*0.32,b.y+R*0.42); ctx.quadraticCurveTo(b.x,b.y-R*0.55,b.x+R*0.32,b.y+R*0.42); ctx.fill(); }
  // ring
  ctx.lineWidth = pressed?6:4; ctx.strokeStyle = hot ? (pressed?'#ffe4b0':'#ff8a3d') : 'rgba(255,150,90,0.55)';
  ctx.beginPath(); ctx.arc(b.x,b.y,R,0,7); ctx.stroke();
  // label under the disc
  ctx.globalAlpha = hot ? 1 : 0.5;
  const label=player.heat>0?'VENT':'HEAL';
  if(!drawText(ctx,label, b.x, b.y+R+24, 26)){
    ctx.fillStyle='#ffd9a0'; ctx.font='800 24px "Chakra Petch",system-ui,sans-serif';
    ctx.lineWidth=5; ctx.strokeStyle='rgba(9,7,18,0.9)'; ctx.strokeText(label, b.x, b.y+R+24); ctx.fillText(label, b.x, b.y+R+24); }
  ctx.restore();
}

// soft ground shadow under an actor — sells the top-down/3-4 grounding
function groundShadow(ctx, X, y, rw, rh){
  ctx.save(); ctx.fillStyle='rgba(0,0,0,0.34)';
  ctx.beginPath(); ctx.ellipse(X, y, rw, rh, 0, 0, 7); ctx.fill(); ctx.restore(); }

// Makko flame animation (5 keyed frames). Draws a flickering flame of height h, base-anchored at
// (X, baseY), frame chosen by `phase` (a rolling counter). Used for burning villagers + fire effects.
function flameReady(){ return !!(typeof MAKKO_FLAME_META!=='undefined' && MAKKO_FLAME_IMG.complete && MAKKO_FLAME_IMG.naturalWidth>0); }
function drawFlame(ctx, X, baseY, h, phase, alpha){
  if(!flameReady()) return false;
  const m=MAKKO_FLAME_META, fi=((Math.floor(phase)%m.n)+m.n)%m.n, w=m.fw*(h/m.fh);
  ctx.save(); if(alpha!=null) ctx.globalAlpha*=alpha; ctx.imageSmoothingEnabled=true;
  ctx.drawImage(MAKKO_FLAME_IMG, fi*m.fw, 0, m.fw, m.fh, X-w/2, baseY-h, w, h);
  ctx.restore(); return true; }

// Makko frame-animations (Veo Game Animation -> keyed 12-frame sprite sheets).
function animReady(k){ const im=MAKKO_ANIM_IMG[k]; return !!(im && im.complete && im.naturalWidth>0 && MAKKO_ANIM[k]); }

// Makko pixel score font (sliced digit atlas)
function digitsReady(){ return !!(typeof MAKKO_DIGITS!=='undefined' && MAKKO_DIGITS_IMG.complete && MAKKO_DIGITS_IMG.naturalWidth>0); }
// Counters need clear 3/8/9 shapes, even when the canvas is fitted to a phone.
function drawNumber(ctx,val,cx,cy,h){
  ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font='700 '+Math.round(h*1.2)+'px "Chakra Petch",system-ui,sans-serif';
  ctx.fillStyle='#ffcf80';ctx.fillText(String(val),cx,cy);ctx.restore();return true;
}

// Makko lettering stays on large decorative titles; small labels use the legible UI font.
function glyphsReady(){ return !!(typeof MAKKO_GLYPHS!=='undefined' && MAKKO_GLYPH_IMG.complete && MAKKO_GLYPH_IMG.naturalWidth>0); }
// draw `str` in the Makko font, centred at (cx,cy), cap-height h. opts: {alpha, spacing}
function drawText(ctx, str, cx, cy, h, o){ o=o||{};
  if(h<40){
    ctx.save();if(o.alpha!=null)ctx.globalAlpha*=o.alpha;
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffd9a0';
    ctx.font='700 '+Math.round(h*1.2)+'px "Chakra Petch",system-ui,sans-serif';
    ctx.fillText(String(str),cx,cy);ctx.restore();return true;
  }
  if(!glyphsReady()) return false;
  const m=MAKKO_GLYPHS, sc=h/m.h, sp=(o.spacing!=null?o.spacing:h*0.12), space=h*0.42;
  str=String(str).toUpperCase();
  let total=0; const items=[];
  for(const ch of str){ const g=m.map[ch]; if(g){ items.push(g); total+=g.w*sc+sp; } else { items.push(null); total+=space+sp; } }
  total-=sp;
  let x=cx-total/2; ctx.save(); if(o.alpha!=null) ctx.globalAlpha*=o.alpha; ctx.imageSmoothingEnabled=true;
  for(const g of items){ if(!g){ x+=space+sp; continue; } const w=g.w*sc; ctx.drawImage(MAKKO_GLYPH_IMG, g.x,0,g.w,m.h, x,cy-h/2, w,h); x+=w+sp; }
  ctx.restore(); return true; }
// measured width of a Makko string at cap-height h (for layout)
function textW(str, h){
  if(h<40){ctx.save();ctx.font='700 '+Math.round(h*1.2)+'px "Chakra Petch",system-ui,sans-serif';const w=ctx.measureText(String(str)).width;ctx.restore();return w;}
  if(!glyphsReady()) return 0; const m=MAKKO_GLYPHS, sc=h/m.h, sp=h*0.12, space=h*0.42;
  let t=0; for(const ch of String(str).toUpperCase()){ const g=m.map[ch]; t+=(g?g.w*sc:space)+sp; } return t-sp; }
// draw Makko text, shrinking cap-height so it fits within maxW
function drawTextFit(ctx, str, cx, cy, h, maxW, o){ if(h>=40 && !glyphsReady()) return false;
  const w=textW(str,h); if(w>maxW) h=h*maxW/w;
  // A title shrinking below the atlas cutoff switches to real text; remeasure that face.
  while(h>8 && textW(str,h)>maxW)h-=0.5;
  return drawText(ctx, str, cx, cy, h, o); }
// draw the current frame of animation `key`, height=targetH, centred at (X,y).
// step++ at 120Hz, so fps=o.fps advances o.fps frames/sec. o.t offsets the cycle.
function drawAnim(ctx, key, X, y, targetH, o){ o=o||{};
  if(!animReady(key)) return false;
  const m=MAKKO_ANIM[key], im=MAKKO_ANIM_IMG[key];
  const fps=o.fps||8, fi = (o.frame!=null) ? Math.max(0,Math.min(m.frames-1, o.frame|0))   // one-shot: exact frame
                                           : (Math.floor(frame*fps/120)+(o.t||0))%m.frames; // looping
  const sc=targetH/m.fh, w=m.fw*sc;
  ctx.save(); ctx.translate(X, y+(o.dy||0));
  if(o.rot) ctx.rotate(o.rot);
  ctx.scale((o.flip?-1:1)*(o.sx||1), (o.sy||1));
  if(o.alpha!=null) ctx.globalAlpha*=o.alpha;
  ctx.imageSmoothingEnabled=true;
  ctx.drawImage(im, fi*m.fw, 0, m.fw, m.fh, -w/2, -targetH/2, w, targetH);
  ctx.restore(); return true; }

const SKINS = {
  vector: {
    bg(ctx){ ctx.fillStyle='#07070b'; ctx.fillRect(0,0,VW,VH);
      ctx.strokeStyle='rgba(255,255,255,0.028)'; ctx.lineWidth=1;
      for(let x=0;x<VW;x+=90){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,VH); ctx.stroke(); }
      for(let y=0;y<VH;y+=90){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(VW,y); ctx.stroke(); } },
    ember(ctx,X,y,a){ ctx.fillStyle='rgba(255,138,46,'+(a*0.62).toFixed(3)+')';
      ctx.beginPath(); ctx.arc(X,y,K.R_TRAIL*(0.45+a*0.55),0,7); ctx.fill(); },
    powerup(ctx,X,y,pu){ const r=K.POWERUP_R, bob=Math.sin(pu.t*3)*3;
      const g=ctx.createRadialGradient(X,y+bob,2,X,y+bob,r*2.2);
      g.addColorStop(0,'rgba(127,232,255,0.5)'); g.addColorStop(1,'rgba(127,232,255,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,y+bob,r*2.2,0,7); ctx.fill();
      ctx.save(); ctx.translate(X,y+bob); ctx.rotate(pu.t*1.2);
      ctx.beginPath(); ctx.moveTo(0,-r); ctx.lineTo(r*0.8,0); ctx.lineTo(0,r); ctx.lineTo(-r*0.8,0); ctx.closePath();
      const gg=ctx.createLinearGradient(-r,-r,r,r); gg.addColorStop(0,'#bff4ff'); gg.addColorStop(1,'#ffd36a');
      ctx.fillStyle=gg; ctx.fill(); ctx.lineWidth=2; ctx.strokeStyle='#fff'; ctx.stroke(); ctx.restore(); },
    wall(ctx,X,y,grudge,scarred){ const R=K.R_SLAG;
      if(grudge){ ctx.fillStyle=scarred?'#241019':'#3a1230'; ctx.fillRect(X-R,y-R,R*2,R*2);
        ctx.strokeStyle=scarred?'#6a2748':'#ff3d7a'; ctx.lineWidth=2; ctx.strokeRect(X-R+1,y-R+1,R*2-2,R*2-2);
        ctx.fillStyle=scarred?'#6a2748':'#ff3d7a'; ctx.beginPath(); ctx.arc(X,y,4.6,0,7); ctx.fill();
        ctx.fillStyle='#160a11'; ctx.beginPath(); ctx.arc(X,y,2,0,7); ctx.fill();
      } else { ctx.fillStyle='#2b303c'; ctx.fillRect(X-R,y-R,R*2,R*2);
        ctx.strokeStyle='#454d5e'; ctx.lineWidth=2; ctx.strokeRect(X-R+1,y-R+1,R*2-2,R*2-2); } },
    cell(ctx,X,y,c){ ctx.fillStyle='#cfd6e6'; ctx.beginPath(); ctx.arc(X,y,K.R_CELL,0,7); ctx.fill();
      ctx.fillStyle='#8f98ab'; ctx.beginPath(); ctx.arc(X,y-3,K.R_CELL*0.42,0,7); ctx.fill(); },
    hunter(ctx,X,y,a,t){ ctx.save(); ctx.translate(X,y); ctx.rotate(a); ctx.fillStyle='#ff5a2e';
      ctx.beginPath(); ctx.moveTo(K.R_CELL*1.35,0); ctx.lineTo(-K.R_CELL*0.8,K.R_CELL*0.86);
      ctx.lineTo(-K.R_CELL*0.42,0); ctx.lineTo(-K.R_CELL*0.8,-K.R_CELL*0.86); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.strokeStyle='#ffcf5a'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(X,y,K.R_CELL+7,-Math.PI/2,-Math.PI/2+(1-t)*Math.PI*2); ctx.stroke(); },
    player(ctx,X,p){ const y=p.y;
      if(p.lit){ const g=ctx.createRadialGradient(X,y,2,X,y,58);
        g.addColorStop(0,'rgba(255,150,50,0.55)'); g.addColorStop(1,'rgba(255,110,40,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,y,58,0,7); ctx.fill(); }
      ctx.fillStyle=p.lit?'#ffb04d':'#7fe8ff'; ctx.beginPath(); ctx.arc(X,y,p.r,0,7); ctx.fill();
      ctx.fillStyle='#0a0a10'; ctx.beginPath(); ctx.arc(X,y,p.r*0.34,0,7); ctx.fill();
      if(p.lit){ const k=Math.max(0,p.fuse/K.FUSE_MAX); ctx.strokeStyle=p.fuse<K.CLUTCH_FUSE?'#fff':'#ffd36a';
        ctx.lineWidth=4; ctx.beginPath(); ctx.arc(X,y,p.r+11,-Math.PI/2,-Math.PI/2+k*Math.PI*2); ctx.stroke(); }
      if(p.bracing){ ctx.strokeStyle='rgba(255,255,255,0.30)'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(X,y,p.r+22,0,7); ctx.stroke(); } },
    boss(ctx,X,b,grow,rr,flat){ const y=b.y;
      if(b.state==='lit'){ const g=ctx.createRadialGradient(X,y,2,X,y,rr*3.4);
        g.addColorStop(0,'rgba(255,150,50,0.5)'); g.addColorStop(1,'rgba(255,110,40,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,y,rr*3.4,0,7); ctx.fill(); }
      const col=b.kind==='keith'?(flat?'#7a2447':'#ff3d7a'):(flat?'#5e1f2c':'#c2364f');
      if(b.kind==='keith'&&!flat){ ctx.fillStyle=col; ctx.beginPath(); ctx.arc(X,y,rr,0,7); ctx.fill(); }
      else { ctx.fillStyle=col; const h=flat?rr*0.55:rr; ctx.fillRect(X-rr,y-h,rr*2,h*2); }
      ctx.fillStyle=b.state==='lit'?'#fff':'#ffd7e6'; ctx.beginPath(); ctx.arc(X,y-(flat?0:rr*0.1),5.4*grow,0,7); ctx.fill();
      ctx.fillStyle='#160a11'; ctx.beginPath(); ctx.arc(X,y-(flat?0:rr*0.1),2.4*grow,0,7); ctx.fill();
      if(b.state==='lit'){ const fmax=b.kind==='keith'?K.KEITH_FUSE:K.RISER_FUSE; const k=Math.max(0,b.fuse/fmax);
        ctx.strokeStyle='#ffd36a'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(X,y,rr+10,-Math.PI/2,-Math.PI/2+k*Math.PI*2); ctx.stroke(); } },
  },

  anime: {
    // the cold-open is a manga splash: Keith, big and glaring, calling you out
    coldOpen(ctx, greet){
      ctx.fillStyle='rgba(9,7,18,0.98)'; ctx.fillRect(0,0,VW,VH);
      const cx=VW*0.5, cy=VH*0.58, N=30, ph=frame*0.02;               // radial action lines
      for(let i=0;i<N;i++){ const a=i/N*Math.PI*2, hw=0.018*(0.7+0.4*Math.sin(ph+i));
        ctx.fillStyle=i%2?'rgba(255,61,122,0.11)':'rgba(255,61,122,0.05)';
        ctx.beginPath(); ctx.moveTo(cx,cy);
        ctx.lineTo(cx+Math.cos(a-hw)*1800, cy+Math.sin(a-hw)*1800);
        ctx.lineTo(cx+Math.cos(a+hw)*1800, cy+Math.sin(a+hw)*1800); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle='#7d1540'; ctx.beginPath();                        // shoulders / collar
      ctx.moveTo(cx-300, VH*1.0); ctx.quadraticCurveTo(cx-150, VH*0.68, cx-72, VH*0.66);
      ctx.lineTo(cx+72, VH*0.66); ctx.quadraticCurveTo(cx+150, VH*0.68, cx+300, VH*1.0); ctx.closePath(); ctx.fill();
      ctx.lineWidth=4; ctx.strokeStyle='#1a0f16'; ctx.stroke();
      keithFace(ctx, cx, VH*0.5, 152, 'glare');
      ctx.textAlign='center';                                          // manga shout
      ctx.font='900 58px "Chakra Petch",system-ui,sans-serif';
      ctx.lineWidth=11; ctx.strokeStyle='#1a0f16'; ctx.strokeText(greet.big, VW/2, VH*0.155);
      ctx.fillStyle='#fff'; ctx.fillText(greet.big, VW/2, VH*0.155);
      ctx.font='600 25px "Chakra Petch",system-ui,sans-serif'; ctx.fillStyle='#ffd0e2';
      greet.sub.forEach((ln,i)=>{ ctx.lineWidth=6; ctx.strokeStyle='rgba(9,7,18,0.9)';
        ctx.strokeText(ln, VW/2, VH*0.155+46+i*33); ctx.fillText(ln, VW/2, VH*0.155+46+i*33); });
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='500 20px "Chakra Petch",system-ui,sans-serif';
      ctx.fillText('tap to begin', VW/2, VH*0.955);
    },
    // the win is a manga finish: Keith beaten, and for once impressed
    winScreen(ctx){
      ctx.fillStyle='rgba(6,11,9,0.97)'; ctx.fillRect(0,0,VW,VH);
      const cx=VW*0.5, cy=VH*0.58, N=30, ph=frame*0.02;
      for(let i=0;i<N;i++){ const a=i/N*Math.PI*2, hw=0.016*(0.7+0.4*Math.sin(ph+i));
        ctx.fillStyle=i%2?'rgba(138,255,193,0.09)':'rgba(138,255,193,0.04)';
        ctx.beginPath(); ctx.moveTo(cx,cy);
        ctx.lineTo(cx+Math.cos(a-hw)*1800, cy+Math.sin(a-hw)*1800);
        ctx.lineTo(cx+Math.cos(a+hw)*1800, cy+Math.sin(a+hw)*1800); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle='#5a1030'; ctx.beginPath();
      ctx.moveTo(cx-300, VH*1.0); ctx.quadraticCurveTo(cx-150, VH*0.82, cx-72, VH*0.8);
      ctx.lineTo(cx+72, VH*0.8); ctx.quadraticCurveTo(cx+150, VH*0.82, cx+300, VH*1.0); ctx.closePath(); ctx.fill();
      keithFace(ctx, cx, VH*0.62, 140, 'yield');
      for(let i=0;i<16;i++){ const x=(i*151)%VW, y=(i*97+frame*1.4)%VH;
        aSparkle(ctx, x, y, 3+2*Math.sin(frame*0.06+i), 'rgba(210,255,230,0.5)'); }
      ctx.textAlign='center';
      if(!drawTextFit(ctx, 'DISTRICT CLEARED.', VW/2, VH*0.135, 58, VW*0.9)){
        ctx.font='900 66px "Chakra Petch",system-ui,sans-serif';
        ctx.lineWidth=12; ctx.strokeStyle='#08120c'; ctx.strokeText('DISTRICT CLEARED.', VW/2, VH*0.15);
        ctx.fillStyle='#8affc1'; ctx.fillText('DISTRICT CLEARED.', VW/2, VH*0.15); }
      ctx.font='600 25px "Chakra Petch",system-ui,sans-serif'; ctx.fillStyle='#e7ecf5';
      STORY.duel.yieldSub.forEach((ln,i)=>{ ctx.lineWidth=6; ctx.strokeStyle='rgba(6,11,9,0.9)';
        ctx.strokeText(ln, VW/2, VH*0.15+44+i*32); ctx.fillText(ln, VW/2, VH*0.15+44+i*32); });
      if(!drawNumber(ctx, score, VW/2, VH*0.31, 60)){
        ctx.fillStyle='#fff'; ctx.font='800 62px "Chakra Petch",system-ui,sans-serif';
        ctx.lineWidth=8; ctx.strokeStyle='#08120c'; ctx.strokeText(String(score), VW/2, VH*0.31); ctx.fillText(String(score), VW/2, VH*0.31); }
      ctx.font='700 24px "Chakra Petch",system-ui,sans-serif'; ctx.lineWidth=6; ctx.strokeStyle='#08120c'; ctx.fillStyle='#ffcf6b';
      const dl='+'+saved+' SAVED   ·   +'+runEmbers+' EMBERS';
      ctx.strokeText(dl, VW/2, VH*0.40); ctx.fillText(dl, VW/2, VH*0.40);
      if(districtCleared){ ctx.font='800 22px "Chakra Petch",system-ui,sans-serif'; ctx.fillStyle='#8affc1';
        const nx='NEW DISTRICT: '+DISTRICTS[Math.min(4,(META.district||1)-1)];
        ctx.strokeText(nx, VW/2, VH*0.44); ctx.fillText(nx, VW/2, VH*0.44); }
      ctx.fillStyle='#cbd3e0'; ctx.font='500 22px "Chakra Petch",system-ui,sans-serif';
      ctx.lineWidth=5; ctx.strokeStyle='#08120c';
      const tl='DISTRICT '+runDistrict+'  ·  tap → back to Ashford';
      ctx.strokeText(tl, VW/2, VH*0.485); ctx.fillText(tl, VW/2, VH*0.485);
    },
    bg(ctx){
      const g=ctx.createLinearGradient(0,0,0,VH);           // a warm dim room floor, not a void
      g.addColorStop(0,'#1c1524'); g.addColorStop(0.5,'#15101a'); g.addColorStop(1,'#0d0a12');
      ctx.fillStyle=g; ctx.fillRect(0,0,VW,VH);
      const lp=ctx.createRadialGradient(VW/2,VH*0.33,20, VW/2,VH*0.33,VH*0.46);   // overhead light pool
      lp.addColorStop(0,'rgba(255,186,122,0.16)'); lp.addColorStop(1,'rgba(255,186,122,0)');
      ctx.fillStyle=lp; ctx.fillRect(0,0,VW,VH);
      ctx.strokeStyle='rgba(255,255,255,0.022)'; ctx.lineWidth=1;                 // faint floor tiling
      for(let x=0;x<=VW;x+=90){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,VH); ctx.stroke(); }
      for(let y=0;y<=VH;y+=90){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(VW,y); ctx.stroke(); }
      ctx.fillStyle='rgba(0,0,0,0.30)';                                           // scorch marks (static)
      const SC=[[120,300,44,26],[560,230,52,30],[300,780,38,24],[640,900,46,28],[170,1060,40,24],[440,540,34,22],[90,660,30,20],[610,1150,50,30]];
      for(const m of SC){ ctx.save(); ctx.translate(m[0],m[1]); ctx.rotate(m[0]*0.01); ctx.scale(1,m[3]/m[2]);
        ctx.beginPath(); ctx.arc(0,0,m[2],0,7); ctx.fill(); ctx.restore(); }
      for(let i=0;i<11;i++){ const x=((i*151)+Math.sin(frame*0.012+i)*26)%VW;      // embers rising
        const y=(VH+140) - ((frame*0.55 + i*150) % (VH+180));
        const a=0.12+0.16*(0.5+0.5*Math.sin(frame*0.06+i));
        ctx.fillStyle='rgba(255,150,80,'+a.toFixed(2)+')'; ctx.beginPath(); ctx.arc(x,y,1.4+(i%3)*0.7,0,7); ctx.fill(); }
      if(duelActive){ const cx=VW/2, cy=VH*0.42, N=28, ph=frame*0.02;
        for(let i=0;i<N;i++){ const a=i/N*Math.PI*2, hw=0.012*(0.6+0.5*Math.sin(ph+i));
          ctx.fillStyle=i%2?'rgba(255,61,122,0.06)':'rgba(255,61,122,0.03)';
          ctx.beginPath(); ctx.moveTo(cx,cy);
          ctx.lineTo(cx+Math.cos(a-hw)*1700, cy+Math.sin(a-hw)*1700);
          ctx.lineTo(cx+Math.cos(a+hw)*1700, cy+Math.sin(a+hw)*1700); ctx.closePath(); ctx.fill(); } }
      const vig=ctx.createRadialGradient(VW/2,VH*0.44,VH*0.26, VW/2,VH*0.5,VH*0.72);   // vignette
      vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,0.62)');
      ctx.fillStyle=vig; ctx.fillRect(0,0,VW,VH); },
    ember(ctx,X,y,a){ aSparkle(ctx,X,y,K.R_TRAIL*(0.5+a*0.7),'rgba(255,185,95,'+(a*0.75).toFixed(2)+')'); },
    powerup(ctx,X,y,pu){ const r=K.POWERUP_R, bob=Math.sin(pu.t*3)*3.2, rot=pu.t*1.1;
      const g=ctx.createRadialGradient(X,y+bob,2,X,y+bob,r*2.6);
      g.addColorStop(0,'rgba(255,230,150,0.55)'); g.addColorStop(0.5,'rgba(127,208,255,0.3)'); g.addColorStop(1,'rgba(127,208,255,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,y+bob,r*2.6,0,7); ctx.fill();
      ctx.save(); ctx.translate(X,y+bob); ctx.rotate(rot);
      ctx.beginPath(); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2-Math.PI/2, rr=i%2?r:r*0.72;
        const px=Math.cos(a)*rr, py=Math.sin(a)*rr; if(i) ctx.lineTo(px,py); else ctx.moveTo(px,py); } ctx.closePath();
      const gg=ctx.createLinearGradient(-r,-r,r,r); gg.addColorStop(0,'#d3f5ff'); gg.addColorStop(0.5,'#6cc6ff'); gg.addColorStop(1,'#ffd36a');
      ctx.fillStyle=gg; ctx.fill(); ctx.lineWidth=r*0.12; ctx.strokeStyle=INK; ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=r*0.05;
      ctx.beginPath(); for(let i=0;i<6;i++){ const a=i/6*Math.PI*2-Math.PI/2; ctx.moveTo(0,0); ctx.lineTo(Math.cos(a)*r*0.85,Math.sin(a)*r*0.85); } ctx.stroke();
      ctx.restore(); aSparkle(ctx,X-r*0.4,y+bob-r*0.4,r*0.45,'#fff'); },
    wall(ctx,X,y,grudge,scarred){ const R=K.R_SLAG;
      if(grudge){ bevelBox(ctx,X,y,R, scarred?'#4a1530':'#7a2350', scarred?'#26101c':'#3f1128');
        ctx.fillStyle=scarred?'#8a3a5c':'#ff6a99'; ctx.beginPath(); ctx.arc(X,y+1,R*0.4,0,7); ctx.fill();
        ctx.fillStyle=INK; ctx.beginPath(); ctx.arc(X,y+1,R*0.18,0,7); ctx.fill();
        ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(X-R*0.13,y-R*0.05,R*0.1,0,7); ctx.fill();
      } else { bevelBox(ctx,X,y,R,'#525d72','#2a313d'); aEyes(ctx,X,y+1,R*0.8,'dead'); } },
    cell(ctx,X,y,c){ const r=K.R_CELL, fleeing=Math.hypot(c.vx||0,c.vy||0)>90, id=(c.id||0);
      const PAL=[['#eef2ff','#8b98d8','#5b6bb0'],['#ffe7c4','#dba15c','#a05a1e'],['#d6f7e0','#67b98c','#2e7a50'],
                 ['#ffd8e6','#df76ab','#a03668'],['#e2e7ef','#93a0b3','#4a5568'],['#e9dcff','#a487da','#5f3f9a'],
                 ['#d8f0ff','#6fb8e0','#2a6f9e']];
      const P=PAL[id%PAL.length], acc=id%6;
      glossyOrb(ctx,X,y,r,P[0],P[1]);
      aEyes(ctx,X,y+r*0.05,r,fleeing?'scared':'cute',P[2]);
      if(fleeing){ aSweat(ctx,X+r*0.72,y-r*0.5,r*0.62); }
      else if(acc===0){                                    // glasses
        ctx.strokeStyle=INK; ctx.lineWidth=r*0.09; ctx.beginPath();
        ctx.arc(X-r*0.34,y+r*0.05,r*0.25,0,7); ctx.arc(X+r*0.34,y+r*0.05,r*0.25,0,7);
        ctx.moveTo(X-r*0.09,y+r*0.05); ctx.lineTo(X+r*0.09,y+r*0.05); ctx.stroke();
      } else if(acc===1){                                  // little cap
        ctx.fillStyle=P[1]; ctx.beginPath(); ctx.arc(X,y-r*0.5,r*0.72,Math.PI,0); ctx.closePath(); ctx.fill();
        ctx.lineWidth=r*0.12; ctx.strokeStyle=INK; ctx.stroke();
        ctx.fillStyle=P[0]; ctx.beginPath(); ctx.arc(X,y-r*1.02,r*0.15,0,7); ctx.fill();
      } else if(acc===3){                                  // bowtie
        ctx.fillStyle=P[2]; ctx.beginPath();
        ctx.moveTo(X,y+r*0.62); ctx.lineTo(X-r*0.3,y+r*0.48); ctx.lineTo(X-r*0.3,y+r*0.76); ctx.closePath();
        ctx.moveTo(X,y+r*0.62); ctx.lineTo(X+r*0.3,y+r*0.48); ctx.lineTo(X+r*0.3,y+r*0.76); ctx.closePath(); ctx.fill();
      } else { aBlush(ctx,X,y,r); } },
    hunter(ctx,X,y,a,t){ const r=K.R_CELL; aSpeed(ctx,X,y,a,26);
      ctx.save(); ctx.translate(X,y); ctx.rotate(a);
      const dart=()=>{ ctx.beginPath(); ctx.moveTo(r*1.55,0); ctx.lineTo(-r*0.72,r*0.9);
        ctx.quadraticCurveTo(-r*0.3,0,-r*0.72,-r*0.9); ctx.closePath(); };
      const g=ctx.createLinearGradient(-r*0.7,0,r*1.55,0); g.addColorStop(0,'#ff4a22'); g.addColorStop(1,'#ffca5a');
      dart(); ctx.fillStyle=g; ctx.fill();
      ctx.fillStyle='rgba(255,240,180,0.55)'; ctx.beginPath(); ctx.moveTo(r*1.35,0); ctx.lineTo(-r*0.15,r*0.32); ctx.lineTo(-r*0.05,0); ctx.closePath(); ctx.fill();
      dart(); ctx.lineWidth=r*0.16; ctx.strokeStyle=INK; ctx.stroke();
      ctx.restore();
      aEyes(ctx,X,y+r*0.05,r*0.86,'angry','#7a2a12');
      ctx.strokeStyle='#ffcf5a'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(X,y,r+7,-Math.PI/2,-Math.PI/2+(1-t)*Math.PI*2); ctx.stroke(); },
    player(ctx,X,p){ const y=p.y, r=p.r;
      if(p.lit){ const g=ctx.createRadialGradient(X,y,2,X,y,58);
        g.addColorStop(0,'rgba(255,170,60,0.5)'); g.addColorStop(1,'rgba(255,110,40,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,y,58,0,7); ctx.fill();
        const ph=frame*0.15;                              // a clean flame crown rising off the top
        for(let i=-1;i<=1;i++){ const fx=X+i*r*0.5, by=y-r*0.45, h=r*(1.5+0.4*Math.sin(ph+i*1.3));
          ctx.fillStyle=i===0?'#ffe08a':'#ff8a3d'; ctx.beginPath();
          ctx.moveTo(fx-r*0.34,by); ctx.quadraticCurveTo(fx-r*0.1,by-h*0.6,fx,by-h);
          ctx.quadraticCurveTo(fx+r*0.1,by-h*0.6,fx+r*0.34,by); ctx.closePath(); ctx.fill(); } }
      glossyOrb(ctx,X,y,r, p.lit?'#ffe6a6':'#d6f7ff', p.lit?'#ff8f2e':'#3fb2df');
      aEyes(ctx,X,y+r*0.05,r,p.lit?'determined':'cute',p.lit?'#8a3a12':'#2f6fb0');
      if(!p.lit) aBlush(ctx,X,y,r);
      else if(p.fuse<K.CLUTCH_FUSE) aSweat(ctx,X+r*0.72,y-r*0.55,r*0.62);
      if(p.lit){ const k=Math.max(0,p.fuse/K.FUSE_MAX); ctx.strokeStyle=p.fuse<K.CLUTCH_FUSE?'#fff':'#ffd36a';
        ctx.lineWidth=4; ctx.beginPath(); ctx.arc(X,y,r+11,-Math.PI/2,-Math.PI/2+k*Math.PI*2); ctx.stroke(); }
      if(p.bracing){ ctx.strokeStyle='rgba(180,230,255,0.5)'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(X,y,r+22,0,7); ctx.stroke(); } },
    boss(ctx,X,b,grow,rr,flat){ const y=b.y, keith=b.kind==='keith';
      if(b.state==='lit'){ const g=ctx.createRadialGradient(X,y,2,X,y,rr*3.2);
        g.addColorStop(0,'rgba(255,170,60,0.5)'); g.addColorStop(1,'rgba(255,110,40,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,y,rr*3.2,0,7); ctx.fill(); aFlame(ctx,X,y,rr,frame*0.12); }
      if(keith&&!flat){ ctx.fillStyle='#b81f57'; ctx.beginPath();   // rival hair spikes behind
        for(let i=-2;i<=2;i++){ const sx=X+i*rr*0.42;
          ctx.moveTo(sx-rr*0.22,y-rr*0.72); ctx.lineTo(sx,y-rr*1.42); ctx.lineTo(sx+rr*0.22,y-rr*0.72); } ctx.fill();
        glossyOrb(ctx,X,y,rr,'#ff9dc0','#c31f5a');
        aEyes(ctx,X,y+rr*0.05,rr*0.9,b.state==='lit'?'determined':'rival','#ffd0e2');
      } else { const h=flat?rr*0.55:rr;
        const g=ctx.createLinearGradient(X-rr,y-h,X+rr*0.5,y+h);
        g.addColorStop(0, keith?'#ff7aa6':'#ef6a80'); g.addColorStop(1, keith?(flat?'#6e2334':'#a83358'):(flat?'#5a1c28':'#a5324a'));
        rrect(ctx,X-rr,y-h,rr*2,h*2,rr*0.32); ctx.fillStyle=g; ctx.fill();
        ctx.save(); rrect(ctx,X-rr,y-h,rr*2,h*2,rr*0.32); ctx.clip();
        ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.beginPath(); ctx.ellipse(X-rr*0.35,y-h*0.5,rr*0.7,h*0.32,-0.4,0,7); ctx.fill(); ctx.restore();
        ctx.lineWidth=Math.max(1.7,rr*0.16); ctx.strokeStyle=INK; rrect(ctx,X-rr,y-h,rr*2,h*2,rr*0.32); ctx.stroke();
        aEyes(ctx,X,y-(flat?0:h*0.1)+rr*0.05,rr*0.82,flat?'dizzy':'angry','#ffd0e2'); }
      if(b.state==='lit'){ const fmax=keith?K.KEITH_FUSE:K.RISER_FUSE; const k=Math.max(0,b.fuse/fmax);
        ctx.strokeStyle='#ffd36a'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(X,y,rr+10,-Math.PI/2,-Math.PI/2+k*Math.PI*2); ctx.stroke(); } },
  },

  // ---- MAKKO: real drawn pixel-art cast (see MAKKO_IMG / drawSpr). The engine
  // hands the same positions/gauges to every skin; here each actor is a sprite,
  // animated by transform. Fuse rings + glows are kept so the read stays legible.
  makko: {
    bg(ctx){
      if(sprReady('bg')){                                  // portrait town-square scene, cover-fit to fill the screen
        const im=MAKKO_IMG['bg'], sc=Math.max(VW/im.naturalWidth, VH/im.naturalHeight);
        const w=im.naturalWidth*sc, h=im.naturalHeight*sc;
        ctx.imageSmoothingEnabled=true; ctx.drawImage(im, (VW-w)/2, (VH-h)/2, w, h);
        ctx.fillStyle='rgba(9,7,14,0.28)'; ctx.fillRect(0,0,VW,VH);   // gentle darken so actors read
      } else {
        const g=ctx.createLinearGradient(0,0,0,VH);        // fallback: moody night gradient
        g.addColorStop(0,'#191322'); g.addColorStop(0.55,'#120d18'); g.addColorStop(1,'#0a070e');
        ctx.fillStyle=g; ctx.fillRect(0,0,VW,VH);
      }
      for(let i=0;i<12;i++){ const x=((i*151)+Math.sin(frame*0.012+i)*26)%VW;   // embers rising
        const y=(VH+140)-((frame*0.55+i*150)%(VH+180));
        const a=0.10+0.16*(0.5+0.5*Math.sin(frame*0.06+i));
        ctx.fillStyle='rgba(255,150,80,'+a.toFixed(2)+')'; ctx.beginPath(); ctx.arc(x,y,1.4+(i%3)*0.7,0,7); ctx.fill(); }
      const vig=ctx.createRadialGradient(VW/2,VH*0.44,VH*0.30, VW/2,VH*0.5,VH*0.78);
      vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,0.5)');
      ctx.fillStyle=vig; ctx.fillRect(0,0,VW,VH);
    },
    ember(ctx,X,y,a){ ctx.fillStyle='rgba(255,150,70,'+(a*0.72).toFixed(3)+')';
      ctx.beginPath(); ctx.arc(X,y,K.R_TRAIL*(0.5+a*0.6),0,7); ctx.fill(); },
    powerup(ctx,X,y,pu){ const bob=Math.sin(pu.t*3)*3.4, r=K.POWERUP_R;
      groundShadow(ctx, X, y+r*1.05, r*0.85-bob*0.06, r*0.28);
      const g=ctx.createRadialGradient(X,y+bob,2,X,y+bob,r*2.5);
      g.addColorStop(0,'rgba(255,205,110,0.5)'); g.addColorStop(0.5,'rgba(255,150,60,0.22)'); g.addColorStop(1,'rgba(255,150,60,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,y+bob,r*2.5,0,7); ctx.fill();
      if(!drawSpr(ctx,'powerup',X,y+bob,r*3.0,{sy:1+0.05*Math.sin(pu.t*6)}))
        SKINS.vector.powerup(ctx,X,y,pu); },
    wall(ctx,X,y,grudge,scarred){ const H=K.R_SLAG*3.4, R=K.R_SLAG;
      if(grudge){                                          // Keith's claimed spot: the Makko beacon marks it
        const pulse = scarred ? 0 : (0.5+0.5*Math.sin(frame*0.10));
        const gR = R*5.6;                                  // rune-circle footprint (telegraph, bigger than the hitbox)
        ctx.fillStyle='rgba(0,0,0,0.28)';                  // flat ground shadow under the rune circle
        ctx.beginPath(); ctx.ellipse(X,y+R*0.4,gR*0.92,gR*0.4,0,0,7); ctx.fill();
        const gr=ctx.createRadialGradient(X,y,2,X,y,gR);   // breathing under-glow -> reads as an active, targeted marker
        gr.addColorStop(0, scarred?'rgba(120,58,88,0.14)':'rgba(255,55,130,'+(0.18+0.20*pulse).toFixed(2)+')');
        gr.addColorStop(1,'rgba(255,55,130,0)');
        ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(X,y,gR,0,7); ctx.fill();
        const bh=R*8.0*(scarred?0.94:(1+0.035*pulse));     // beacon height (brazier + flames), gentle breathing
        if(drawSpr(ctx,'beacon',X,y,bh,{dy:-bh*0.10, alpha:scarred?0.5:1})) return;
        return SKINS.vector.wall(ctx,X,y,grudge,scarred);  // sprite not ready -> vector fallback
      }
      ctx.fillStyle='rgba(0,0,0,0.38)';                    // ground shadow anchors the husk
      ctx.beginPath(); ctx.ellipse(X,y+R*0.95,R*1.2,R*0.5,0,0,7); ctx.fill();
      const ug=ctx.createRadialGradient(X,y+R*0.2,2,X,y+R*0.2,R*2.3);  // ember under-glow so
      ug.addColorStop(0,'rgba(255,120,50,0.26)');          // charcoal reads on dark ground
      ug.addColorStop(1,'rgba(255,120,50,0)');
      ctx.fillStyle=ug; ctx.beginPath(); ctx.arc(X,y+R*0.2,R*2.3,0,7); ctx.fill();
      if(!drawSpr(ctx,'husk',X,y,H,{})) return SKINS.vector.wall(ctx,X,y,grudge,scarred); },
    cell(ctx,X,y,c){
      if(c.saving){
        // SAVED! — the Makko teleport animation: burning agony -> purified/healed -> pulled up into the light.
        const t=Math.min(1,(c.saveT||0)/K.SAVE_ANIM_DUR), fi=Math.min(17,Math.floor(t*18));
        const H=K.R_CELL*5.0;                                  // sized so the villager matches the running townsfolk; light column rises above
        const sh=1-Math.min(1,t*1.4);                          // ground shadow fades as they lift into the light
        if(sh>0){ ctx.save(); ctx.globalAlpha=sh; groundShadow(ctx, X, y+K.R_CELL*1.4, K.R_CELL*1.0, K.R_CELL*0.3); ctx.restore(); }
        const alpha = t>0.9 ? Math.max(0,1-(t-0.9)/0.1) : 1;   // dissolve on the last beat = transported / gone
        if(!drawAnim(ctx,'save', X, y - H*0.5, H, {frame:fi, alpha})){
          if(!drawSpr(ctx,'happy',X,y,K.R_CELL*3.7,{})) SKINS.vector.cell(ctx,X,y,c);   // fallback if the sheet isn't loaded
        }
        return;
      }
      // CALM — running around the square: the Makko 12-frame townsfolk animation, faster legs while running
      const spd=Math.hypot(c.vx||0,c.vy||0), run=spd>10, flip=(c.vx||0)<0, step=Math.sin(frame*0.5+(c.ph||0));
      groundShadow(ctx, X, y+K.R_CELL*1.5, K.R_CELL*1.35, K.R_CELL*0.4);
      if(!drawAnim(ctx,'townsfolk',X,y,K.R_CELL*4.2,{fps:run?13:6, flip, t:(c.id||0)*3}) &&
         !drawSpr(ctx,'townsfolk',X,y+(run?-Math.abs(step)*K.R_CELL*0.5:0),K.R_CELL*3.5,{flip}))
        SKINS.vector.cell(ctx,X,y,c); },
    hunter(ctx,X,y,a,t){ const flip=(frame*0.12|0)%2===0, k=Math.max(0,Math.min(1,1-t));   // t=burn progress
      groundShadow(ctx, X, y+K.R_CELL*1.5, K.R_CELL*1.35, K.R_CELL*0.4);
      const gr=16+k*18+5*Math.sin(frame*0.45), g=ctx.createRadialGradient(X,y,2,X,y,gr);  // engulfing fire glow
      g.addColorStop(0,'rgba(255,150,50,0.62)'); g.addColorStop(0.5,'rgba(255,90,30,0.35)'); g.addColorStop(1,'rgba(255,90,30,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,y,gr,0,7); ctx.fill();
      // a villager, panicking, ON FIRE (townsfolk sprite + rising flames) — someone to save, not a monster
      if(!drawAnim(ctx,'townsfolk',X,y,K.R_CELL*4.2,{flip, fps:13}) &&
         !drawSpr(ctx,'townsfolk',X,y,K.R_CELL*3.5,{flip, dy:-Math.abs(Math.sin(frame*0.5))*2}))
        SKINS.vector.hunter(ctx,X,y,a,t);
      // ACTUAL animated flames engulfing the villager (Makko 5-frame fire, per-villager desynced)
      const ph = frame*0.32 + X*0.09;
      if(!drawFlame(ctx, X, y+K.R_CELL*1.6, K.R_CELL*5.4, ph, 0.9)){
        const base=y+K.R_CELL*1.4;                          // fallback lick if the sheet isn't loaded
        ctx.fillStyle='rgba(255,150,40,0.75)'; ctx.beginPath(); ctx.moveTo(X-6,base);
        ctx.quadraticCurveTo(X,base-K.R_CELL*3,X+6,base); ctx.fill();
      } },
    player(ctx,X,p){ const y=p.y, r=p.r;
      // BURN = the FRACTION of health you've lost. Everything keys off this fraction, never a fixed heart
      // count — so it holds identically whether you have 5 hearts or 12.
      const burn = Math.max(0, Math.min(1, 1 - (p.hp!=null ? p.hp : 1)));   // 0 healthy .. 1 near death
      const hf = p.heat/K.HEAT_MAX;
      // FRANTIC SHAKE — grows sharply as you burn down (you're panicking, on fire)
      const jit = burn*burn*5;
      const jx = (Math.sin(frame*0.9)+Math.sin(frame*1.7))*0.5*jit;
      const jy = (Math.sin(frame*1.13)+Math.sin(frame*2.1))*0.5*jit;
      const DX = X+jx, DY = y+jy;
      groundShadow(ctx, X, y+r*1.55, r*1.5, r*0.42);
      // GLOW — from the fire you carry AND how burned you are; reddens toward death
      const glow = Math.max(hf, burn*0.9);
      if(glow>0.02){ const gr=12+glow*60, g=ctx.createRadialGradient(DX,DY,2,DX,DY,gr), red=burn>0.4;
        g.addColorStop(0, red?'rgba(255,80,45,'+(0.45+0.4*Math.sin(frame*0.6)).toFixed(2)+')'
                              :'rgba(255,160,60,'+(0.30+0.34*glow).toFixed(2)+')');
        g.addColorStop(1,'rgba(255,110,40,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(DX,DY,gr,0,7); ctx.fill(); }
      // ---- TRANSFORMATION: PERSON -> FIRE MAN (over the FIRST half of your health) -> CINDER MAN (over the
      // BACK half). Cross-faded on the burn fraction, so at half health you're fully the fire man, at 0 the
      // cinder man. All three are scaled/anchored to the same on-screen body size (no resize pop).
      const flip=(p.hx||0) < -0.01, pop=1+(p.absorbPop||0)*1.25+(p.ventFlash>0?p.ventFlash*1.4:0);
      const PHp = r*5.0*pop, fps = 11 + burn*12, ss=t=>t*t*(3-2*t);
      let wp=0, wf=0, wc=0;                                       // weights: person / fire man / cinder man
      if(burn<=0.5){ const t=ss(burn/0.5); wp=1-t; wf=t; }
      else { const t=ss((burn-0.5)/0.5); wf=1-t; wc=t; }
      const hop = -Math.abs(Math.sin(frame*(0.26+burn*0.16)))*r*0.55;   // frantic hop-gait for the imp stages
      const sq  = 1 + 0.05*Math.sin(frame*(0.26+burn*0.16)*2);
      // VENTING in a fiery form -> play THAT form's bespoke Makko vent animation (character sized to match the form)
      const ventForm = p.venting ? (wc>0.5 ? 'ventcinder' : (wf>0.5 ? 'ventfire' : null)) : null;
      let drew=false;
      if(ventForm){
        const VHc = PHp * (ventForm==='ventcinder' ? K.VENT_ANIM_SC_C : K.VENT_ANIM_SC_F);
        drew = drawAnim(ctx, ventForm, DX, DY - VHc*K.VENT_ANIM_ANCH, VHc, {fps:12, flip}) || drew;
      } else {
        if(wp>0.01) drew = drawAnim(ctx,'hero_run',DX,DY,PHp,{fps, flip, alpha:wp}) || drew;
        if(wf>0.01) drew = drawSpr(ctx,'hero',  DX, DY+hop, 1.108*PHp, {flip, dy:-0.071*PHp, alpha:wf, sx:1/sq, sy:sq}) || drew;
        if(wc>0.01) drew = drawSpr(ctx,'ashimp',DX, DY+hop, 1.359*PHp, {flip, dy:-0.197*PHp, alpha:wc, sx:1/sq, sy:sq}) || drew;
      }
      if(!drew) SKINS.vector.player(ctx,X,p);
      // IGNITING licks — the PERSON->fire-man catch-fire hump (not while a fiery vent anim is already playing)
      if(!ventForm){ const fireAmt = burn<0.5 ? Math.sin((burn/0.5)*Math.PI)*0.6 : 0;
        if(fireAmt>0.05){ const n = 1 + Math.round(fireAmt*2);
          for(let i=0;i<n;i++){ const fx = DX + (i-(n-1)/2)*r*0.7;
            drawFlame(ctx, fx, DY+r*1.55, r*(1.6+fireAmt*2.2), frame*(0.35)+i*3.1, 0.35+fireAmt*0.5); } } }
      // PERSON form venting (no bespoke anim, and rarely seen) -> the hero with Makko fire pouring off, no ring
      if(p.venting && !ventForm){
        drawFlame(ctx, DX, DY+r*0.7, r*(4.4+0.6*Math.sin(frame*0.55)), frame*0.6, 0.92);
        drawFlame(ctx, DX-r*0.95, DY+r*1.3, r*2.7, frame*0.5+5, 0.72);
        drawFlame(ctx, DX+r*0.95, DY+r*1.3, r*2.7, frame*0.5+11, 0.72);
      } },
    boss(ctx,X,b,grow,rr,flat){ const y=b.y, keith=b.kind==='keith', H=rr*(keith?4.7:4.3);
      groundShadow(ctx, X, y+rr*1.5, rr*1.7, rr*0.5);
      if(b.state==='lit'){ const fmax=keith?K.KEITH_FUSE:K.RISER_FUSE, k=Math.max(0,b.fuse/fmax);
        const gr=rr*(1.0+k*2.2), g=ctx.createRadialGradient(X,y,2,X,y,gr);   // glow + flames contract to the sprite as fuse burns = timer
        g.addColorStop(0,'rgba(255,175,65,0.55)'); g.addColorStop(1,'rgba(255,110,40,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,y,gr,0,7); ctx.fill(); aFlame(ctx,X,y,rr*(0.45+0.55*k),frame*0.12); }
      const key=keith?'keith':'firedemon';
      if(flat || !drawAnim(ctx,key,X,y,H,{fps:keith?8:11})){   // defeated boss = static squashed sprite
        const opt={ dy: flat?H*0.14:Math.sin(frame*0.14)*2, sy: flat?0.66:1, sx: flat?1.18:1 };
        if(!drawSpr(ctx,key,X,y,H,opt)) return SKINS.vector.boss(ctx,X,b,grow,rr,flat);
      }
      },
    // cold-open: KEITH himself, drawn big, calling you out
    coldOpen(ctx, greet){
      ctx.fillStyle='rgba(9,7,18,0.97)'; ctx.fillRect(0,0,VW,VH);
      const cx=VW*0.5, cy=VH*0.6, N=30, ph=frame*0.02;
      for(let i=0;i<N;i++){ const a=i/N*Math.PI*2, hw=0.018*(0.7+0.4*Math.sin(ph+i));
        ctx.fillStyle=i%2?'rgba(255,61,122,0.10)':'rgba(255,61,122,0.045)';
        ctx.beginPath(); ctx.moveTo(cx,cy);
        ctx.lineTo(cx+Math.cos(a-hw)*1800, cy+Math.sin(a-hw)*1800);
        ctx.lineTo(cx+Math.cos(a+hw)*1800, cy+Math.sin(a+hw)*1800); ctx.closePath(); ctx.fill(); }
      if(!drawSpr(ctx,'keith',cx,VH*0.56,VH*0.5,{sy:1+0.02*Math.sin(frame*0.1)}))
        keithFace(ctx, cx, VH*0.5, 152, 'glare');
      ctx.textAlign='center';
      if(!drawTextFit(ctx, greet.big, VW/2, VH*0.145, 52, VW*0.9)){
        ctx.font='900 58px "Chakra Petch",system-ui,sans-serif';
        ctx.lineWidth=11; ctx.strokeStyle='#1a0f16'; ctx.strokeText(greet.big, VW/2, VH*0.16);
        ctx.fillStyle='#fff'; ctx.fillText(greet.big, VW/2, VH*0.16); }
      ctx.font='600 25px "Chakra Petch",system-ui,sans-serif'; ctx.fillStyle='#ffd0e2';
      greet.sub.forEach((ln,i)=>{ ctx.lineWidth=6; ctx.strokeStyle='rgba(9,7,18,0.9)';
        ctx.strokeText(ln, VW/2, VH*0.16+46+i*33); ctx.fillText(ln, VW/2, VH*0.16+46+i*33); });
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='500 20px "Chakra Petch",system-ui,sans-serif';
      ctx.fillText('tap to begin', VW/2, VH*0.955);
    },
    // win: KEITH beaten, embers settling
    winScreen(ctx){
      ctx.fillStyle='rgba(6,11,9,0.97)'; ctx.fillRect(0,0,VW,VH);
      const cx=VW*0.5, cy=VH*0.6, N=30, ph=frame*0.02;
      for(let i=0;i<N;i++){ const a=i/N*Math.PI*2, hw=0.016*(0.7+0.4*Math.sin(ph+i));
        ctx.fillStyle=i%2?'rgba(138,255,193,0.08)':'rgba(138,255,193,0.035)';
        ctx.beginPath(); ctx.moveTo(cx,cy);
        ctx.lineTo(cx+Math.cos(a-hw)*1800, cy+Math.sin(a-hw)*1800);
        ctx.lineTo(cx+Math.cos(a+hw)*1800, cy+Math.sin(a+hw)*1800); ctx.closePath(); ctx.fill(); }
      ctx.save(); ctx.globalAlpha=0.85;
      if(!drawSpr(ctx,'keith',cx,VH*0.6,VH*0.44,{rot:0.12, sy:0.9})) keithFace(ctx, cx, VH*0.62, 140, 'yield');
      ctx.restore();
      for(let i=0;i<16;i++){ const x=(i*151)%VW, y=(i*97+frame*1.4)%VH;
        aSparkle(ctx, x, y, 3+2*Math.sin(frame*0.06+i), 'rgba(210,255,230,0.5)'); }
      ctx.textAlign='center';
      if(!drawTextFit(ctx, 'DISTRICT CLEARED.', VW/2, VH*0.135, 58, VW*0.9)){
        ctx.font='900 66px "Chakra Petch",system-ui,sans-serif';
        ctx.lineWidth=12; ctx.strokeStyle='#08120c'; ctx.strokeText('DISTRICT CLEARED.', VW/2, VH*0.15);
        ctx.fillStyle='#8affc1'; ctx.fillText('DISTRICT CLEARED.', VW/2, VH*0.15); }
      ctx.font='600 25px "Chakra Petch",system-ui,sans-serif'; ctx.fillStyle='#e7ecf5';
      STORY.duel.yieldSub.forEach((ln,i)=>{ ctx.lineWidth=6; ctx.strokeStyle='rgba(6,11,9,0.9)';
        ctx.strokeText(ln, VW/2, VH*0.15+44+i*32); ctx.fillText(ln, VW/2, VH*0.15+44+i*32); });
      if(!drawNumber(ctx, score, VW/2, VH*0.31, 60)){
        ctx.fillStyle='#fff'; ctx.font='800 62px "Chakra Petch",system-ui,sans-serif';
        ctx.lineWidth=8; ctx.strokeStyle='#08120c'; ctx.strokeText(String(score), VW/2, VH*0.31); ctx.fillText(String(score), VW/2, VH*0.31); }
      ctx.font='700 24px "Chakra Petch",system-ui,sans-serif'; ctx.lineWidth=6; ctx.strokeStyle='#08120c'; ctx.fillStyle='#ffcf6b';
      const dl='+'+saved+' SAVED   ·   +'+runEmbers+' EMBERS';
      ctx.strokeText(dl, VW/2, VH*0.40); ctx.fillText(dl, VW/2, VH*0.40);
      if(districtCleared){ ctx.font='800 22px "Chakra Petch",system-ui,sans-serif'; ctx.fillStyle='#8affc1';
        const nx='NEW DISTRICT: '+DISTRICTS[Math.min(4,(META.district||1)-1)];
        ctx.strokeText(nx, VW/2, VH*0.44); ctx.fillText(nx, VW/2, VH*0.44); }
      ctx.fillStyle='#cbd3e0'; ctx.font='500 22px "Chakra Petch",system-ui,sans-serif';
      ctx.lineWidth=5; ctx.strokeStyle='#08120c';
      const tl='DISTRICT '+runDistrict+'  ·  tap → back to Ashford';
      ctx.strokeText(tl, VW/2, VH*0.485); ctx.fillText(tl, VW/2, VH*0.485);
    },
  },
};

let SKIN_NAME = (()=>{ try{ const q=new URLSearchParams(location.search).get('skin');
  return q || localStorage.getItem('fwoosh.skin') || 'makko'; }catch(e){ return 'makko'; } })();
if(!SKINS[SKIN_NAME]) SKIN_NAME='vector';
let SK = SKINS[SKIN_NAME];
function setSkin(n){ if(!SKINS[n]) return SKIN_NAME; SKIN_NAME=n; SK=SKINS[n];
  try{ localStorage.setItem('fwoosh.skin', n); }catch(e){} return n; }

// rounded-rect path helper
function roundRectPath(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
// word-wrap fillText
function wrapText(ctx,str,x,y,maxW,lh){ const words=String(str).split(' '); let line='',yy=y;
  for(const w of words){ const t=line?line+' '+w:w;
    if(ctx.measureText(t).width>maxW && line){ ctx.fillText(line,x,yy); line=w; yy+=lh; } else line=t; }
  if(line) ctx.fillText(line,x,yy); return yy; }

// Live data gauges use canvas UI; character artwork remains the existing Makko assets.
function drawRunMeters(ctx){
  const heat=Math.max(0,Math.min(K.HEAT_MAX,player.heat||0)),hot=heat>=K.HEAT_MAX-1;
  ctx.save();ctx.textAlign='left';ctx.font='800 28px "Chakra Petch",system-ui,sans-serif';
  ctx.fillStyle=hot?'#ff7065':'#ffcf80';ctx.fillText('HEAT '+Math.round(heat*10)/10+'/'+K.HEAT_MAX,300,34);
  ctx.textAlign='right';ctx.font='700 25px "Chakra Petch",system-ui,sans-serif';
  ctx.fillText('BLAZE x'+(1+heat*K.BLAZE_MULT).toFixed(1),VW-18,34);
  const gap=5,sw=(VW-318-gap*(K.HEAT_MAX-1))/K.HEAT_MAX;
  for(let i=0;i<K.HEAT_MAX;i++){
    const x=300+i*(sw+gap),f=Math.max(0,Math.min(1,heat-i));
    ctx.fillStyle='#302b32';ctx.fillRect(x,45,sw,12);
    ctx.fillStyle=hot?'#ff7065':'#ffb34f';if(f)ctx.fillRect(x,45,sw*f,12);
  }
  ctx.textAlign='left';ctx.font='800 29px "Chakra Petch",system-ui,sans-serif';ctx.fillStyle='#a0ffd0';
  ctx.fillText('RESCUED '+saved+' / '+runQuota,18,89);
  ctx.textAlign='right';ctx.fillStyle=rescueReward?'#b0ffd8':'#ffcf80';
  ctx.fillText('RUN +'+runEmbers+' EMBERS',VW-18,89);
  ctx.textAlign='left';ctx.font='600 22px "Chakra Petch",system-ui,sans-serif';
  ctx.fillStyle=duelActive?'#ff9dbd':'#c2b6c8';
  ctx.fillText(duelActive?'KEITH '+Math.floor(dumped)+' / '+((boss&&boss.dumpNeeded)||K.DUEL_DUMP):'EDGE '+(edge>0?'+':'')+Math.round(edge),18,118);
  ctx.textAlign='right';ctx.fillStyle=rescueReward?'#b0ffd8':'#b4a7ba';
  ctx.fillText(rescueReward?rescueReward.count+' RESCUED · +'+rescueReward.embers+' EMBERS':'SCORE '+score,VW-18,118);
  ctx.restore();
}

// Present-event dialogue uses the fixed bottom dock; the world view never moves with a line.
function drawDialogue(ctx){
  if(mode!=='play') return;
  const d=presentDialogue;
  const line=intro?STORY.intro[intro.i]:d?d.lines[d.i]:null;
  if(!line) return;
  const t=intro?intro.lineT:d.t,shown=Math.min(line.text.length,Math.floor(t/INTRO.CHAR));
  const talking=shown<line.text.length;
  // Bottom dialogue strip stays above the mobile vent circle and dash-charge row.
  const bx=8,bw=538,bh=144,by=PLAY_VIEW.bottom+4,pad=8,ps=76;
  ctx.save();panel(ctx,bx,by,bw,bh,10,'rgba(13,20,45,0.96)','rgba(185,200,239,0.95)');
  const px=bx+pad,py=by+pad;
  ctx.save();roundRectPath(ctx,px,py,ps,ps,6);ctx.fillStyle='#151323';ctx.fill();ctx.clip();
  const actor=line.who==='DUY'?'duy':'keith';
  const clip='dialogue_'+actor+'_'+(line.emotion||'stern');
  // Atlas frame 0 is a listening pose; remaining frames are the Makko talking loop.
  const im=MAKKO_ANIM_IMG[clip],meta=MAKKO_ANIM[clip];
  if(im && im.complete && im.naturalWidth && meta){
    const f=talking && meta.frames>1?1+(Math.floor(t*8)%(meta.frames-1)):0;
    ctx.drawImage(im,f*meta.fw,0,meta.fw,meta.fh,px,py,ps,ps);
  } else {
    // Existing verified Makko sprite until Cursor's dedicated portrait clips are integrated.
    // No fake lip movement or procedural replacement art.
    drawSpr(ctx,actor==='duy'?'hero':'keith',px+ps/2,py+ps*0.78,ps*1.5,{});
  }
  ctx.restore();
  const tx=px+ps+16,tw=bx+bw-pad-tx;
  ctx.textAlign='left';ctx.fillStyle=line.who==='DUY'?'#a9e9ff':'#ffb8c9';
  ctx.font='800 22px "Chakra Petch",system-ui,sans-serif';ctx.fillText(line.who,tx,by+25);
  ctx.fillStyle='#f2f3ff';ctx.font='500 26px "Chakra Petch",system-ui,sans-serif';
  wrapText(ctx,line.text.slice(0,shown),tx,by+54,tw,28);

  ctx.restore();
}

function drawConversationSheet(ctx){
  panel(ctx,0,96,VW,VH,18,'rgba(16,12,24,0.99)','rgba(201,160,255,0.5)');
  const h=dialogueSave().history;
  dialogueHistoryPage=Math.max(0,Math.min(dialogueHistoryPage,h.length-1));
  const line=h[dialogueHistoryPage];
  ctx.textAlign='center';ctx.fillStyle='#c9a0ff';ctx.font='800 30px "Chakra Petch",system-ui,sans-serif';
  ctx.fillText('CONVERSATIONS',VW/2,154);
  ctx.font='500 20px "Chakra Petch",system-ui,sans-serif';ctx.fillText('Only words you have already heard.',VW/2,190);
  if(line){
    ctx.fillStyle='#f3d7f1';ctx.font='800 28px "Chakra Petch",system-ui,sans-serif';ctx.fillText(line.who,VW/2,340);
    ctx.fillStyle='#efe5fa';ctx.font='500 30px "Chakra Petch",system-ui,sans-serif';wrapText(ctx,line.text,VW/2,405,VW-100,42);
    ctx.font='500 22px "Chakra Petch",system-ui,sans-serif';ctx.fillText((dialogueHistoryPage+1)+' / '+h.length,VW/2,VH-150);
  } else {ctx.fillText('Conversations will appear here as you hear them.',VW/2,380);}
  for(const [x,label,act,ok] of [[24,'‹ PREV','talkprev',dialogueHistoryPage>0],[250,'DIARY','diary',true],[476,'NEXT ›','talknext',dialogueHistoryPage<h.length-1]]){
    panel(ctx,x,VH-115,220,66,10,'#252039',ok?'#b8a0d7':'#554963');
    ctx.fillStyle=ok?'#eee1ff':'#716581';ctx.font='700 22px "Chakra Petch",system-ui,sans-serif';ctx.fillText(label,x+110,VH-73);
    hubB(x,VH-115,220,66,act,ok);
  }
}

// ---- TITLE / START SCREEN: FWOOSH logo, Keith looming, the hero below, the town ablaze
// ---------------------------------------------------------------- THE TOWN HUB (meta home base)
function hubB(x,y,w,h,act,enabled){ hubBtns.push({x,y,w,h,act,enabled:enabled!==false}); }
function hubClick(x,y){
  for(let i=hubBtns.length-1;i>=0;i--){ const b=hubBtns[i];         // topmost (drawn last) wins
    if(b.enabled && x>=b.x && x<=b.x+b.w && y>=b.y && y<=b.y+b.h){ hubAct(b.act); return; } }
  if(hubSheet) hubSheet=null;                                       // tap outside an open sheet closes it
}
function hubAct(a){
  if(a==='play'){ reset(); return; }
  if(a==='nextupgrade'){openNextUpgrade();return;}
  if(a==='dprev'){ selDistrict = Math.max(1, selDistrict-1); return; }
  if(a==='dnext'){ selDistrict = Math.min(Math.min(5,META.district||1), selDistrict+1); return; }
  if(a==='starter'){if(starterAvailable())hubSheet='starter';return;}
  if(a.indexOf('starterbuy:')===0){buyStarter(a.split(':')[1]);return;}
  if(a==='diary'){ hubSheet='diary'; diaryOpen=null; diaryPage=0; return; }
  if(a==='shrine'){ hubSheet='shrine'; return; }
  if(a==='conversations'){hubSheet='conversations';dialogueHistoryPage=Math.max(0,dialogueSave().history.length-1);return;}
  if(a==='talkprev'){dialogueHistoryPage=Math.max(0,dialogueHistoryPage-1);return;}
  if(a==='talknext'){dialogueHistoryPage=Math.min(dialogueSave().history.length-1,dialogueHistoryPage+1);return;}
  if(a==='diaryback'){ diaryOpen=null; diaryPage=0; return; }
  if(a.indexOf('diaryopen:')===0){ diaryOpen=parseInt(a.split(':')[1],10); diaryPage=0; const e=DIARY[diaryOpen]; if(e) diaryMarkRead(e.id); return; }
  if(a==='diaryprev'){ diaryPage=Math.max(0,diaryPage-1); return; }
  if(a==='diarynext'){ const e=DIARY[diaryOpen]; if(e) diaryPage=Math.min(e.pages.length-1, diaryPage+1); return; }
  if(a==='close'){ hubSheet=null; diaryOpen=null; return; }
  if(a==='well'||a==='forge'){ hubSheet = META.buildings[a].built ? a : null; return; }
  if(a.indexOf('buy:')===0){ const p=a.split(':'); buy(p[1],p[2]); return; }
}
// a soft rounded panel
function panel(ctx,x,y,w,h,r,fill,stroke){ ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
  if(fill){ ctx.fillStyle=fill; ctx.fill(); } if(stroke){ ctx.lineWidth=2; ctx.strokeStyle=stroke; ctx.stroke(); } }

function drawHub(ctx){
  hubBtns = [];
  if(hubToast>0) hubToast-=0.016;
  // --- BACKDROP: the real Makko Ashford scene (cover-fill), with dark scrims top & bottom for legibility
  ctx.fillStyle='#0b0713'; ctx.fillRect(0,0,VW,VH);
  if(sprReady('ashford')){ const im=MAKKO_IMG['ashford'], sc=Math.max(VW/im.naturalWidth,VH/im.naturalHeight), w=im.naturalWidth*sc, h=im.naturalHeight*sc;
    ctx.drawImage(im,(VW-w)/2,(VH-h)/2,w,h); }
  let sgt=ctx.createLinearGradient(0,0,0,300); sgt.addColorStop(0,'rgba(8,5,14,0.94)'); sgt.addColorStop(1,'rgba(8,5,14,0)');
  ctx.fillStyle=sgt; ctx.fillRect(0,0,VW,300);
  let sgb=ctx.createLinearGradient(0,VH-360,0,VH); sgb.addColorStop(0,'rgba(8,5,14,0)'); sgb.addColorStop(1,'rgba(8,5,14,0.96)');
  ctx.fillStyle=sgb; ctx.fillRect(0,VH-360,VW,360);

  // --- TOP HUD: embers (left) · villagers saved (right) · hearts preview. Bold Makko digits, clear spacing.
  if(sprReady('flames')) drawFlame(ctx, 42, 74, 62, frame*0.4, 0.95);
  if(!drawNumber(ctx, META.embers, 118, 52, 40)){ ctx.textAlign='left'; ctx.fillStyle='#ffcf6b'; ctx.font='800 40px "Chakra Petch",system-ui,sans-serif'; ctx.fillText(String(META.embers), 70, 64); }
  ctx.textAlign='left'; ctx.fillStyle='#ffb14d'; ctx.font='700 15px "Chakra Petch",system-ui,sans-serif'; ctx.fillText('EMBERS', 70, 84);
  if(sprReady('happy')) drawSpr(ctx,'happy', VW-150, 52, 46, {});
  if(!drawNumber(ctx, META.saved, VW-70, 52, 36)){ ctx.textAlign='right'; ctx.fillStyle='#8affc1'; ctx.font='800 34px "Chakra Petch",system-ui,sans-serif'; ctx.fillText(String(META.saved), VW-40, 62); }
  ctx.textAlign='right'; ctx.fillStyle='#8affc1'; ctx.font='700 14px "Chakra Petch",system-ui,sans-serif'; ctx.fillText('SAVED', VW-40, 82);
  { const n=Math.min(maxHearts,8), hs=18; for(let i=0;i<n;i++){ const hx=VW-40-(n-i)*(hs+3)+hs/2, hy=104; if(!drawSpr(ctx,'heart',hx,hy,hs,{})){ ctx.fillStyle='#ff4d4d'; ctx.beginPath(); ctx.arc(hx,hy,hs*0.32,0,7); ctx.fill(); } } }

  // --- town title
  ctx.textAlign='center';
  if(!drawTextFit(ctx,'ASHFORD', VW/2, 178, 60, VW*0.7)){ ctx.fillStyle='#ffb04d'; ctx.font='900 58px "Chakra Petch",system-ui,sans-serif'; ctx.fillText('ASHFORD', VW/2, 178); }

  // --- Keith feud banner
  panel(ctx, 40, 220, VW-80, 54, 12, 'rgba(50,12,28,0.66)', 'rgba(255,61,122,0.55)');
  if(sprReady('keith')) drawSpr(ctx,'keith', 76, 247, 58, {});
  ctx.textAlign='left'; ctx.fillStyle='#ff9dbd'; ctx.font='700 20px "Chakra Petch",system-ui,sans-serif'; ctx.fillText('KEITH: '+feudStage().toUpperCase(), 112, 244);
  ctx.fillStyle='rgba(255,157,189,0.72)'; ctx.font='500 15px "Chakra Petch",system-ui,sans-serif'; ctx.fillText('he watches you rebuild', 112, 264);

  // --- building cards, translucent over the scene. The Shrine returns when Ratkin
  // favor and judgment give it a distinct role; the Diary is the current story home.
  const cardY=296, cardH=116, gap=14, cw=(VW-80-gap)/2, wellBuilt = META.buildings.well.built, forgeBuilt = META.buildings.forge.built;
  drawBuildingCard(ctx, 40, cardY, cw, cardH, 'THE WELL',
    wellBuilt ? 'hearts · faster vent healing' : (K.WELL_RISE-META.saved)+' more saves',
    wellBuilt ? '#7fe8ff' : '#ffb14d', wellBuilt, 'well', 'beacon');
  drawBuildingCard(ctx, 40+cw+gap, cardY, cw, cardH, 'THE FORGE',
    forgeBuilt ? 'dash upgrades' : (K.FORGE_RISE-META.saved)+' more saves',
    forgeBuilt ? '#ff9a45' : '#ffb14d', forgeBuilt, 'forge', 'fire');
  const dFresh = diaryFreshCount();
  drawBuildingCard(ctx, 40, cardY+cardH+gap, VW-80, cardH, 'THE DIARY', dFresh>0 ? dFresh+' new to read' : 'Duy’s memories · optional', '#c9a0ff', true, 'diary', null);
  if(dFresh>0){ const bx=VW-62, by=cardY+cardH+gap+20; ctx.fillStyle='#8affc1'; ctx.beginPath(); ctx.arc(bx,by,11,0,7); ctx.fill();
    ctx.fillStyle='#0a0710'; ctx.font='800 15px "Chakra Petch",system-ui,sans-serif'; ctx.textAlign='center'; ctx.fillText(String(dFresh), bx, by+5); }

  if(starterAvailable()){
    panel(ctx,40,580,VW-80,88,14,'rgba(17,25,35,0.94)','#ffcf80');
    ctx.textAlign='center';ctx.fillStyle='#ffe1a4';ctx.font='800 26px "Chakra Petch",system-ui,sans-serif';
    ctx.fillText('CHOOSE YOUR FIRST UPGRADE',VW/2,615);
    ctx.font='500 21px "Chakra Petch",system-ui,sans-serif';ctx.fillText('An extra heart or dash · '+STARTER_COST+' embers',VW/2,648);
    hubB(40,580,VW-80,88,'starter');
  }

  // Always show the nearest available upgrade, including cheaper Forge/recovery tracks.
  drawu�������k�w��gba(255,225,140,0)'); ag.addColorStop(0.6,'rgba(255,225,140,'+(aa*0.6).toFixed(3)+')'); ag.addColorStop(1,'rgba(255,210,110,0)');
    ctx.fillStyle=ag; ctx.beginPath(); ctx.arc(X,p.y,ar,0,7); ctx.fill(); }); }
  wrapDraw(p.x, X=> SK.player(ctx, X, p));

  // ---- DUEL FX: allies, wake (absorbable trail), ember-spit shots, siphon pulses
  if(duelActive){
    // wake of fire — warm absorbable embers on the ground
    for(const w of wake){ const a=1-w.t/K.WAKE_LIFE; wrapDraw(w.x, X=>{
      const gr=K.WAKE_R*(0.8+0.4*Math.sin(frame*0.4+(w.ph||0))), g=ctx.createRadialGradient(X,w.y,1,X,w.y,gr);
      g.addColorStop(0,'rgba(255,180,90,'+(0.6*a).toFixed(3)+')'); g.addColorStop(1,'rgba(255,110,40,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,w.y,gr,0,7); ctx.fill(); }); }
    // siphon pulses — an expanding WAVE of ember dots with a safe GAP wedge (glow, not a stroked ring)
    for(const pu of pulses){ const a=Math.max(0,1-pu.r/700);
      for(let i=0;i<44;i++){ const ang=i/44*Math.PI*2; if(Math.abs(angDiff(ang,pu.gapAng))<K.SIPHON_GAP) continue;
        const dx=pu.x+Math.cos(ang)*pu.r, dy=pu.y+Math.sin(ang)*pu.r;
        const g=ctx.createRadialGradient(dx,dy,0,dx,dy,9); g.addColorStop(0,'rgba(210,150,240,'+(0.6*a).toFixed(3)+')'); g.addColorStop(1,'rgba(180,120,220,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(dx,dy,9,0,7); ctx.fill(); } }
    // allies — rescued villagers at your side
    for(const al of allies){ wrapDraw(al.x, X=>{
      const bob=2*Math.sin(al.ph*3);
      if(!drawSpr(ctx,'happy',X,al.y+bob,26,{})){ ctx.fillStyle='#8affc1'; ctx.beginPath(); ctx.arc(X,al.y,9,0,7); ctx.fill(); }
      const g=ctx.createRadialGradient(X,al.y,1,X,al.y,20); g.addColorStop(0,'rgba(138,255,193,0.28)'); g.addColorStop(1,'rgba(138,255,193,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,al.y,20,0,7); ctx.fill(); }); }
    // ember-spit fireballs
    for(const s of shots){ wrapDraw(s.x, X=>{
      const g=ctx.createRadialGradient(X,s.y,0,X,s.y,K.SPIT_R*2.2); g.addColorStop(0,'rgba(255,210,120,0.95)'); g.addColorStop(0.5,'rgba(255,120,40,0.7)'); g.addColorStop(1,'rgba(255,90,30,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,s.y,K.SPIT_R*2.2,0,7); ctx.fill();
      ctx.fillStyle='rgba(255,244,200,0.95)'; ctx.beginPath(); ctx.arc(X,s.y,K.SPIT_R*0.55,0,7); ctx.fill(); }); }
  }

  // ---- boss (riser or apex Keith)
  if(boss){
    const b = boss;
    const grow = b.state === 'rising' ? Math.max(0.2, 1 - b.t/K.BOSS_RISE_T) : 1;
    const rr = b.r * grow;
    const flat = b.state === 'stagger';
    // siphon shield aura (glow) — dumps bounce off until you save the siphoned
    if(b.shield){ wrapDraw(b.x, X=>{ const sr=K.SIPHON_R*0.5+6*Math.sin(frame*0.2), g=ctx.createRadialGradient(X,b.y,rr,X,b.y,sr+rr);
      g.addColorStop(0,'rgba(200,140,235,0)'); g.addColorStop(0.7,'rgba(200,140,235,0.28)'); g.addColorStop(1,'rgba(180,120,220,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,b.y,sr+rr,0,7); ctx.fill(); }); }
    // wind-up telegraph: a growing glow + an aim line for charge/wake
    if(b.move && b.moveTele > 0){ const k=1-b.moveTele/K.KEITH_TELE; wrapDraw(b.x, X=>{
      const tr=rr*(1.2+k*0.9), g=ctx.createRadialGradient(X,b.y,rr*0.5,X,b.y,tr);
      g.addColorStop(0,'rgba(255,80,60,0)'); g.addColorStop(0.7,'rgba(255,80,60,'+(0.35*k).toFixed(3)+')'); g.addColorStop(1,'rgba(255,60,40,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,b.y,tr,0,7); ctx.fill();
      if((b.move==='charge'||b.move==='wake') && b.moveData && b.moveData.dir){ const d=b.moveData.dir;
        ctx.save(); ctx.globalAlpha=0.4+0.4*k; ctx.strokeStyle='#ff6a4a'; ctx.lineWidth=3; ctx.setLineDash([8,10]); ctx.lineDashOffset=-frame*0.7;
        ctx.beginPath(); ctx.moveTo(X,b.y); ctx.lineTo(X+d.x*260, b.y+d.y*260); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); } }); }
    wrapDraw(b.x, X=> SK.boss(ctx, X, b, grow, rr, flat));
  }

  // ---- the opp's snipe: converging reticle on the predicted lead point + a strike travelling in
  if(snipe){
    const k = Math.min(1, snipe.t/K.OPP_SNIPE_TELE);
    const rr = K.OPP_SNIPE_R*(1.65 - 0.9*k);
    wrapDraw(snipe.tx, X=>{
      const col = snipe.done ? '127,232,255' : '255,61,122';
      const gg = ctx.createRadialGradient(X,snipe.ty,1,X,snipe.ty,rr);
      gg.addColorStop(0,'rgba('+col+','+(0.4+0.4*k).toFixed(2)+')'); gg.addColorStop(0.55,'rgba('+col+',0.14)'); gg.addColorStop(1,'rgba('+col+',0)');
      ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(X,snipe.ty,rr,0,7); ctx.fill();
      ctx.fillStyle='rgba('+col+','+(0.6+0.4*k).toFixed(2)+')'; ctx.beginPath(); ctx.arc(X,snipe.ty,3,0,7); ctx.fill();
    });
    if(!snipe.done){
      const dx = wrapDX(snipe.tx - snipe.ox);
      const sx = ((snipe.ox + dx*k)%VW+VW)%VW, sy = snipe.oy + (snipe.ty-snipe.oy)*k;
      wrapDraw(sx, X=>{ ctx.fillStyle = '#ff3d7a'; ctx.beginPath(); ctx.arc(X, sy, 5, 0, 7); ctx.fill(); });
    }
  }

  ctx.restore(); // End world clip; HUD has its own reserved screen space.

  // ---- HUD (clean: hearts for health, gold score, one-line objective; hidden on title/intro/over)
  const hudOn = mode === 'play' && !onTitle && introT <= 0 && (!intro || intro.phase==='talk');
  if(hudOn){
    // A dark backing separates live values from the busy town artwork.
    ctx.fillStyle='#09080f';ctx.fillRect(0,0,VW,PLAY_VIEW.top);
    ctx.fillStyle='#514253';ctx.fillRect(0,PLAY_VIEW.top-2,VW,2);
    ctx.fillStyle='#514253';ctx.fillRect(0,PLAY_VIEW.bottom,VW,2);
    // HEALTH — a row of Makko hearts, top-left (count scales with maxHearts). Fire burns them down; clear, they refill.
    { const n=maxHearts, hs=Math.min(38, Math.floor(264/n)-2), gap=2, hxx=18, hyy=14, hp=Math.max(0,Math.min(1,player.hp)), low=hp<0.3;
      for(let i=0;i<n;i++){
        const cx=hxx+i*(hs+gap)+hs/2, cy=hyy+hs/2, fillf=Math.max(0,Math.min(1, hp*n - i));
        if(!drawSpr(ctx,'heart',cx,cy,hs,{alpha:0.20})){ ctx.fillStyle='rgba(255,80,80,0.2)'; ctx.beginPath(); ctx.arc(cx,cy,hs*0.32,0,7); ctx.fill(); }
        if(fillf>0){ ctx.save(); ctx.beginPath(); ctx.rect(hxx+i*(hs+gap), hyy, hs*fillf, hs); ctx.clip();
          const pulse = low ? (0.6+0.4*Math.sin(frame*0.5)) : 1; ctx.globalAlpha=pulse;
          if(!drawSpr(ctx,'heart',cx,cy,hs,{})){ ctx.fillStyle='#ff4d4d'; ctx.beginPath(); ctx.arc(cx,cy,hs*0.32,0,7); ctx.fill(); }
          ctx.restore(); }
      }
    }
    drawRunMeters(ctx);
    // Optional dialogue replaces only dock information, never the camera or controls.
    if(!intro && !presentDialogue){
      ctx.save();ctx.textAlign='left';ctx.fillStyle='#dfd8c9';ctx.font='600 25px "Chakra Petch",system-ui,sans-serif';
      const status=callout?callout.text:'';
      ctx.fillStyle=callout&&callout.good===false?'#ff9dbd':'#d7cedd';ctx.font='600 24px "Chakra Petch",system-ui,sans-serif';
      if(status)wrapText(ctx,status,18,1175,516,27);
      if(player.ventUnit){
        const u=player.ventUnit;ctx.fillStyle='#ffe0a2';ctx.font='700 24px "Chakra Petch",system-ui,sans-serif';
        ctx.fillText((u.kind==='heat'?'VENT 1 HEAT':'HEAL 1 HEART')+(player.ventHeld?' · HOLD':' · FINISHING'),18,1228);
      }
      ctx.restore();
    }
    if(player.ventUnit){const u=player.ventUnit;ctx.fillStyle='#45343a';ctx.fillRect(558,1265,148,8);ctx.fillStyle='#ffb34f';ctx.fillRect(558,1265,148*Math.min(1,u.t/u.duration),8);}
    // DASH charges (bottom-left) — Makko ember pips. Empty = dark socket; recharging one FILLS UP
    // bottom-to-top with a shimmer; a finished charge pops with a flourish ring.
    { const n=RUN_MAX_CHARGES, ps=32, gap=8, x0=26, yy=VH-20;
      for(let i=0;i<n;i++){ const cx=x0+i*(ps+gap)+ps/2, ready=i<player.charges, charging=(i===player.charges && player.charges<n);
        // dark socket always
        if(!drawSpr(ctx,'ui_charge',cx,yy,ps,{alpha:0.13})){ ctx.fillStyle='rgba(255,150,60,0.13)'; ctx.beginPath(); ctx.arc(cx,yy,ps*0.34,0,7); ctx.fill(); }
        if(ready){
          const newest=(i===player.charges-1);
          if(newest && dashPop>0){ const fr=ps*0.5+(0.55-dashPop)*20, fa=0.55*Math.min(1,dashPop);   // glow pop, not a ring
            const fg=ctx.createRadialGradient(cx,yy,1,cx,yy,fr);
            fg.addColorStop(0,'rgba(255,230,166,'+fa.toFixed(3)+')'); fg.addColorStop(0.6,'rgba(255,220,150,'+(fa*0.5).toFixed(3)+')'); fg.addColorStop(1,'rgba(255,220,150,0)');
            ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(cx,yy,fr,0,7); ctx.fill(); }
          const pop = newest ? 1+Math.max(0,dashPop)*0.5 : 1;
          if(!drawSpr(ctx,'ui_charge',cx,yy,ps*pop,{})){ ctx.fillStyle='#ff8a3d'; ctx.beginPath(); ctx.arc(cx,yy,ps*0.34,0,7); ctx.fill(); }
        } else if(charging){
          const f=Math.max(0,Math.min(1,(player.chargeT||0)/RUN_CHARGE_REFILL)), fy=yy+ps/2-ps*f;
          ctx.save(); ctx.beginPath(); ctx.rect(cx-ps/2, fy, ps, ps*f); ctx.clip();   // reveal bottom-up
          if(!drawSpr(ctx,'ui_charge',cx,yy,ps,{})){ ctx.fillStyle='#ff8a3d'; ctx.beginPath(); ctx.arc(cx,yy,ps*0.34,0,7); ctx.fill(); }
          ctx.restore();
          if(f>0.04){ ctx.save(); ctx.globalAlpha=0.55+0.45*Math.sin(frame*0.5); ctx.strokeStyle='#fff2c8'; ctx.lineWidth=2;   // shimmer at the fill line
            ctx.beginPath(); ctx.moveTo(cx-ps*0.38,fy); ctx.lineTo(cx+ps*0.38,fy); ctx.stroke(); ctx.restore(); }
        }
      }
    }
    if(isTouch)drawVentButton(ctx);
    ctx.textAlign='left';ctx.fillStyle='#b4a7ba';ctx.font='500 20px "Chakra Petch",system-ui,sans-serif';
    if(intro||presentDialogue)ctx.fillText('AUTO · Diary → Conversations',248,1267);
  }

  // ---- LIVE intro dialogue box (Keith narrates over gameplay)
  drawDialogue(ctx);

  // ---- legacy premise preview only; first play uses live dialogue instead.
  if(introT > 0 && introKind === 'premise'){
    ctx.fillStyle = 'rgba(7,7,11,0.82)'; ctx.fillRect(0,0,VW,VH);
    ctx.textAlign = 'center';
    if(!drawTextFit(ctx, 'YOU WOKE IN THE FIRE.', VW/2, VH*0.155, 46, VW*0.92)){
      ctx.fillStyle = '#ffb04d'; ctx.font = '800 48px "Chakra Petch",system-ui,sans-serif';
      ctx.fillText('YOU WOKE IN THE FIRE.', VW/2, VH*0.165); }
    ctx.fillStyle = '#e7ecf5'; ctx.font = '500 23px "Chakra Petch",system-ui,sans-serif';
    STORY.premise.forEach((ln,i)=> ctx.fillText(ln, VW/2, VH*0.20 + 66 + i*40));
    if(!drawTextFit(ctx, "DON'T END UP A WALL.", VW/2, VH*0.20 + 66 + STORY.premise.length*40 + 42, 34, VW*0.92)){
      ctx.fillStyle = '#fff'; ctx.font = '800 36px "Chakra Petch",system-ui,sans-serif';
      ctx.fillText("DON'T END UP A WALL.", VW/2, VH*0.20 + 66 + STORY.premise.length*40 + 52); }
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '500 20px "Chakra Petch",system-ui,sans-serif';
    ctx.fillText('tap to start', VW/2, VH*0.82);
  }

  // ---- cold-open reveal: the whole "war report", rendered as a beat on your own floor
  else if(introT > 0){
    const stg = feudStage();
    const greetC = stg === 'debut' ? STORY.greet.debut
                                   : STORY.greet[stg][(opp.runs||0) % STORY.greet[stg].length];
    if(SK.coldOpen){ SK.coldOpen(ctx, greetC, opp.grudge, K.INTRO_T - introT); }
    else {
    ctx.fillStyle = 'rgba(7,7,11,0.64)'; ctx.fillRect(0,0,VW,VH);
    const g = opp.grudge;
    if(g){
      const ph = K.INTRO_T - introT, pr = 34 + (Math.sin(ph*6)*0.5+0.5)*42;
      wrapDraw(g.x, X=>{
        ctx.strokeStyle = 'rgba(255,61,122,0.85)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(X, g.y, pr, 0, 7); ctx.stroke();
      });
      ctx.fillStyle = '#c9a8b8'; ctx.font = '600 21px "Chakra Petch",system-ui,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('your most-passed spot', g.x, g.y - pr - 14);
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff5d94'; ctx.font = '800 42px "Chakra Petch",system-ui,sans-serif';
    ctx.fillText(greetC.big, VW/2, VH*0.28);
    ctx.fillStyle = '#e7ecf5'; ctx.font = '500 24px "Chakra Petch",system-ui,sans-serif';
    greetC.sub.forEach((ln,i)=> ctx.fillText(ln, VW/2, VH*0.28 + 42 + i*32));
    ctx.fillStyle = 'rgba(255,255,255,0.42)'; ctx.font = '500 20px "Chakra Petch",system-ui,sans-serif';
    ctx.fillText('tap to begin', VW/2, VH*0.72);
    }
  }

  if(flash > 0){ ctx.fillStyle = 'rgba(255,255,255,0.24)'; ctx.fillRect(0,0,VW,VH); }

  if(mode === 'over')drawRunResults(ctx);
}

function fmt(s){ const m = Math.floor(s/60), r = Math.floor(s%60); return m+':'+String(r).padStart(2,'0'); }
