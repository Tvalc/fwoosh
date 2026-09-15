// ---------------------------------------------------------------- render
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
let scale = 1;

function fit(){
  const iw = Math.max(320, window.innerWidth||360), ih = Math.max(480, window.innerHeight||640);
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
  if(!drawText(ctx,label, b.x, b.y+R+30, 26)){
    ctx.fillStyle='#ffd9a0'; ctx.font='800 24px "Pixelify",system-ui,sans-serif';
    ctx.lineWidth=5; ctx.strokeStyle='rgba(9,7,18,0.9)'; ctx.strokeText(label, b.x, b.y+R+34); ctx.fillText(label, b.x, b.y+R+34); }
  if(!isTouch){ ctx.globalAlpha=(hot?0.7:0.4); ctx.fillStyle='#ffd9a0'; ctx.font='600 15px "Pixelify",system-ui,sans-serif'; ctx.fillText('[SPACE]', b.x, b.y+R+52); }
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
// draw a number as Makko pixel digits, centred at (cx,cy), digit height h
function drawNumber(ctx, val, cx, cy, h){
  if(!digitsReady()) return false;
  const m=MAKKO_DIGITS, sc=h/m.h, gap=Math.max(1,h*0.05), s=String(val), parts=[];
  let total=0;
  for(const ch of s){ const d=m.digits[ch.charCodeAt(0)-48]; if(!d) continue; parts.push(d); total+=d.w*sc+gap; }
  total-=gap;
  let x=cx-total/2; ctx.imageSmoothingEnabled=true;
  for(const d of parts){ const w=d.w*sc; ctx.drawImage(MAKKO_DIGITS_IMG, d.x,0,d.w,m.h, x,cy-h/2, w,h); x+=w+gap; }
  return true; }

// Makko DISPLAY FONT — full glyph atlas (0-9 A-Z + punctuation), for big words & the score.
function glyphsReady(){ return !!(typeof MAKKO_GLYPHS!=='undefined' && MAKKO_GLYPH_IMG.complete && MAKKO_GLYPH_IMG.naturalWidth>0); }
// draw `str` in the Makko font, centred at (cx,cy), cap-height h. opts: {alpha, spacing}
function drawText(ctx, str, cx, cy, h, o){ o=o||{};
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
function textW(str, h){ if(!glyphsReady()) return 0; const m=MAKKO_GLYPHS, sc=h/m.h, sp=h*0.12, space=h*0.42;
  let t=0; for(const ch of String(str).toUpperCase()){ const g=m.map[ch]; t+=(g?g.w*sc:space)+sp; } return t-sp; }
// draw Makko text, shrinking cap-height so it fits within maxW
function drawTextFit(ctx, str, cx, cy, h, maxW, o){ if(!glyphsReady()) return false;
  const w=textW(str,h); if(w>maxW) h=h*maxW/w; return drawText(ctx, str, cx, cy, h, o); }
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
      ctx.font='900 58px "Pixelify",system-ui,sans-serif';
      ctx.lineWidth=11; ctx.strokeStyle='#1a0f16'; ctx.strokeText(greet.big, VW/2, VH*0.155);
      ctx.fillStyle='#fff'; ctx.fillText(greet.big, VW/2, VH*0.155);
      ctx.font='600 25px "Pixelify",system-ui,sans-serif'; ctx.fillStyle='#ffd0e2';
      greet.sub.forEach((ln,i)=>{ ctx.lineWidth=6; ctx.strokeStyle='rgba(9,7,18,0.9)';
        ctx.strokeText(ln, VW/2, VH*0.155+46+i*33); ctx.fillText(ln, VW/2, VH*0.155+46+i*33); });
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='500 20px "Pixelify",system-ui,sans-serif';
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
        ctx.font='900 66px "Pixelify",system-ui,sans-serif';
        ctx.lineWidth=12; ctx.strokeStyle='#08120c'; ctx.strokeText('DISTRICT CLEARED.', VW/2, VH*0.15);
        ctx.fillStyle='#8affc1'; ctx.fillText('DISTRICT CLEARED.', VW/2, VH*0.15); }
      ctx.font='600 25px "Pixelify",system-ui,sans-serif'; ctx.fillStyle='#e7ecf5';
      STORY.duel.yieldSub.forEach((ln,i)=>{ ctx.lineWidth=6; ctx.strokeStyle='rgba(6,11,9,0.9)';
        ctx.strokeText(ln, VW/2, VH*0.15+44+i*32); ctx.fillText(ln, VW/2, VH*0.15+44+i*32); });
      if(!drawNumber(ctx, score, VW/2, VH*0.31, 60)){
        ctx.fillStyle='#fff'; ctx.font='800 62px "Pixelify",system-ui,sans-serif';
        ctx.lineWidth=8; ctx.strokeStyle='#08120c'; ctx.strokeText(String(score), VW/2, VH*0.31); ctx.fillText(String(score), VW/2, VH*0.31); }
      ctx.font='700 24px "Pixelify",system-ui,sans-serif'; ctx.lineWidth=6; ctx.strokeStyle='#08120c'; ctx.fillStyle='#ffcf6b';
      const dl='+'+saved+' SAVED   ·   +'+runEmbers+' EMBERS';
      ctx.strokeText(dl, VW/2, VH*0.40); ctx.fillText(dl, VW/2, VH*0.40);
      if(districtCleared){ ctx.font='800 22px "Pixelify",system-ui,sans-serif'; ctx.fillStyle='#8affc1';
        const nx='NEW DISTRICT: '+DISTRICTS[Math.min(4,(META.district||1)-1)];
        ctx.strokeText(nx, VW/2, VH*0.44); ctx.fillText(nx, VW/2, VH*0.44); }
      ctx.fillStyle='#cbd3e0'; ctx.font='500 22px "Pixelify",system-ui,sans-serif';
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
        ctx.font='900 58px "Pixelify",system-ui,sans-serif';
        ctx.lineWidth=11; ctx.strokeStyle='#1a0f16'; ctx.strokeText(greet.big, VW/2, VH*0.16);
        ctx.fillStyle='#fff'; ctx.fillText(greet.big, VW/2, VH*0.16); }
      ctx.font='600 25px "Pixelify",system-ui,sans-serif'; ctx.fillStyle='#ffd0e2';
      greet.sub.forEach((ln,i)=>{ ctx.lineWidth=6; ctx.strokeStyle='rgba(9,7,18,0.9)';
        ctx.strokeText(ln, VW/2, VH*0.16+46+i*33); ctx.fillText(ln, VW/2, VH*0.16+46+i*33); });
      ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='500 20px "Pixelify",system-ui,sans-serif';
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
        ctx.font='900 66px "Pixelify",system-ui,sans-serif';
        ctx.lineWidth=12; ctx.strokeStyle='#08120c'; ctx.strokeText('DISTRICT CLEARED.', VW/2, VH*0.15);
        ctx.fillStyle='#8affc1'; ctx.fillText('DISTRICT CLEARED.', VW/2, VH*0.15); }
      ctx.font='600 25px "Pixelify",system-ui,sans-serif'; ctx.fillStyle='#e7ecf5';
      STORY.duel.yieldSub.forEach((ln,i)=>{ ctx.lineWidth=6; ctx.strokeStyle='rgba(6,11,9,0.9)';
        ctx.strokeText(ln, VW/2, VH*0.15+44+i*32); ctx.fillText(ln, VW/2, VH*0.15+44+i*32); });
      if(!drawNumber(ctx, score, VW/2, VH*0.31, 60)){
        ctx.fillStyle='#fff'; ctx.font='800 62px "Pixelify",system-ui,sans-serif';
        ctx.lineWidth=8; ctx.strokeStyle='#08120c'; ctx.strokeText(String(score), VW/2, VH*0.31); ctx.fillText(String(score), VW/2, VH*0.31); }
      ctx.font='700 24px "Pixelify",system-ui,sans-serif'; ctx.lineWidth=6; ctx.strokeStyle='#08120c'; ctx.fillStyle='#ffcf6b';
      const dl='+'+saved+' SAVED   ·   +'+runEmbers+' EMBERS';
      ctx.strokeText(dl, VW/2, VH*0.40); ctx.fillText(dl, VW/2, VH*0.40);
      if(districtCleared){ ctx.font='800 22px "Pixelify",system-ui,sans-serif'; ctx.fillStyle='#8affc1';
        const nx='NEW DISTRICT: '+DISTRICTS[Math.min(4,(META.district||1)-1)];
        ctx.strokeText(nx, VW/2, VH*0.44); ctx.fillText(nx, VW/2, VH*0.44); }
      ctx.fillStyle='#cbd3e0'; ctx.font='500 22px "Pixelify",system-ui,sans-serif';
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
  const x=24, w=VW-48, heat=Math.max(0,Math.min(K.HEAT_MAX,player.heat||0));
  const hot=heat>=K.HEAT_MAX-1, heatColor=hot?'#ff7065':heat>0?'#ffb34f':'#93b9c1';
  ctx.save(); ctx.globalAlpha=1;
  ctx.font='800 26px "Pixelify",system-ui,sans-serif'; ctx.textAlign='left';
  ctx.fillStyle='#fff0df'; ctx.fillText('HEAT '+Math.round(heat*10)/10+' / '+K.HEAT_MAX,x,83);
  ctx.textAlign='right'; ctx.fillStyle='#ffcf80';
  ctx.fillText('BLAZE x'+(1+heat*K.BLAZE_MULT).toFixed(1),VW-x,83);
  ctx.textAlign='center'; ctx.font='700 20px "Pixelify",system-ui,sans-serif'; ctx.fillStyle=heatColor;
  ctx.fillText(player.venting?(heat>0?'VENTING':'HEALING'):hot?'HIGH HEAT':heat===0?'COOL':'',VW/2,82);
  // Segments represent carried fires, not health. Keep the empty gauge visible too.
  const gap=6, sw=(w-gap*(K.HEAT_MAX-1))/K.HEAT_MAX;
  for(let i=0;i<K.HEAT_MAX;i++){
    const sx=x+i*(sw+gap), fill=Math.max(0,Math.min(1,heat-i));
    ctx.fillStyle='#302b32'; ctx.fillRect(sx,97,sw,18);
    if(fill>0){ctx.fillStyle=heatColor;ctx.fillRect(sx,97,sw*fill,18);}
  }
  // One familiar Makko villager plus a large tally remains legible at every district quota.
  drawSpr(ctx,'happy',43,157,40,{});
  ctx.textAlign='left'; ctx.font='800 30px "Pixelify",system-ui,sans-serif'; ctx.fillStyle='#a0ffd0';
  ctx.fillText('RESCUED '+saved+' / '+runQuota,74,153);
  const progress=Math.max(0,Math.min(1,saved/Math.max(1,runQuota)));
  ctx.fillStyle='#233932';ctx.fillRect(x,171,w,12);
  if(progress>0){ctx.fillStyle='#8affc1';ctx.fillRect(x,171,w*progress,12);}
  if(duelActive){
    const need=(boss&&boss.dumpNeeded)||K.DUEL_DUMP;
    ctx.font='700 22px "Pixelify",system-ui,sans-serif';ctx.fillStyle='#ff9dbd';
    ctx.fillText('KEITH '+Math.floor(dumped)+' / '+need,x,213);
    const bx=230,bw=VW-x-bx,f=Math.max(0,Math.min(1,dumped/need));
    ctx.fillStyle='#392532';ctx.fillRect(bx,200,bw,10);
    if(f>0){ctx.fillStyle='#ff91b8';ctx.fillRect(bx,200,bw*f,10);}
  } else {
    // Edge remains secondary and explicitly named so it cannot be mistaken for heat.
    const bw=180,bx=VW/2-60,cx=bx+bw/2,span=K.EDGE_PER_DOWN*K.EDGE_HEADSTART_CAP;
    const f=Math.max(-1,Math.min(1,edge/span));
    ctx.textAlign='right';ctx.font='600 18px "Pixelify",system-ui,sans-serif';ctx.fillStyle='#c2b6c8';
    ctx.fillText('EDGE',bx-14,208);
    ctx.fillStyle='#34303c';ctx.fillRect(bx,200,bw,7);
    ctx.fillStyle=f>=0?'#8affc1':'#ff769c';
    if(f!==0)ctx.fillRect(f>=0?cx:cx+bw*f/2,200,Math.abs(bw*f/2),7);
    ctx.fillStyle='#dbd2df';ctx.fillRect(cx-1,197,2,13);
  }
  ctx.restore();
}

// ---- VN-style dialogue box (lower third): Keith narrates over LIVE gameplay during the intro.
// Square portrait on the left animates (bob + scale) while the line is still typing out.
function drawDialogue(ctx){
  if(mode!=='play') return;
  const d=presentDialogue;
  const line=intro?STORY.intro[intro.i]:d?d.lines[d.i]:null;
  if(!line) return;
  const t=intro?intro.lineT:d.t,shown=Math.min(line.text.length,Math.floor(t/INTRO.CHAR));
  const talking=shown<line.text.length;
  // Bottom dialogue strip stays above the mobile vent circle and dash-charge row.
  const bx=14,bw=VW-28,bh=180,by=VH-bh-240,pad=14,ps=128;
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
  ctx.font='800 22px "Pixelify",system-ui,sans-serif';ctx.fillText(line.who,tx,by+32);
  ctx.fillStyle='#f2f3ff';ctx.font='500 26px "Pixelify",system-ui,sans-serif';
  wrapText(ctx,line.text.slice(0,shown),tx,by+66,tw,31);
  ctx.fillStyle='#9faac6';ctx.font='500 14px "Pixelify",system-ui,sans-serif';
  ctx.fillText('AUTO · Read again in Diary → Conversations',tx,by+bh-12);
  ctx.restore();
}

function drawConversationSheet(ctx){
  panel(ctx,0,96,VW,VH,18,'rgba(16,12,24,0.99)','rgba(201,160,255,0.5)');
  const h=dialogueSave().history;
  dialogueHistoryPage=Math.max(0,Math.min(dialogueHistoryPage,h.length-1));
  const line=h[dialogueHistoryPage];
  ctx.textAlign='center';ctx.fillStyle='#c9a0ff';ctx.font='800 30px "Pixelify",system-ui,sans-serif';
  ctx.fillText('CONVERSATIONS',VW/2,154);
  ctx.font='500 20px "Pixelify",system-ui,sans-serif';ctx.fillText('Only words you have already heard.',VW/2,190);
  if(line){
    ctx.fillStyle='#f3d7f1';ctx.font='800 28px "Pixelify",system-ui,sans-serif';ctx.fillText(line.who,VW/2,340);
    ctx.fillStyle='#efe5fa';ctx.font='500 30px "Pixelify",system-ui,sans-serif';wrapText(ctx,line.text,VW/2,405,VW-100,42);
    ctx.font='500 22px "Pixelify",system-ui,sans-serif';ctx.fillText((dialogueHistoryPage+1)+' / '+h.length,VW/2,VH-150);
  } else {ctx.fillText('Conversations will appear here as you hear them.',VW/2,380);}
  for(const [x,label,act,ok] of [[24,'‹ PREV','talkprev',dialogueHistoryPage>0],[250,'DIARY','diary',true],[476,'NEXT ›','talknext',dialogueHistoryPage<h.length-1]]){
    panel(ctx,x,VH-115,220,66,10,'#252039',ok?'#b8a0d7':'#554963');
    ctx.fillStyle=ok?'#eee1ff':'#716581';ctx.font='700 22px "Pixelify",system-ui,sans-serif';ctx.fillText(label,x+110,VH-73);
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
  if(!drawNumber(ctx, META.embers, 118, 52, 40)){ ctx.textAlign='left'; ctx.fillStyle='#ffcf6b'; ctx.font='800 40px "Pixelify",system-ui,sans-serif'; ctx.fillText(String(META.embers), 70, 64); }
  ctx.textAlign='left'; ctx.fillStyle='#ffb14d'; ctx.font='700 15px "Pixelify",system-ui,sans-serif'; ctx.fillText('EMBERS', 70, 84);
  if(sprReady('happy')) drawSpr(ctx,'happy', VW-150, 52, 46, {});
  if(!drawNumber(ctx, META.saved, VW-70, 52, 36)){ ctx.textAlign='right'; ctx.fillStyle='#8affc1'; ctx.font='800 34px "Pixelify",system-ui,sans-serif'; ctx.fillText(String(META.saved), VW-40, 62); }
  ctx.textAlign='right'; ctx.fillStyle='#8affc1'; ctx.font='700 14px "Pixelify",system-ui,sans-serif'; ctx.fillText('SAVED', VW-40, 82);
  { const n=Math.min(maxHearts,8), hs=18; for(let i=0;i<n;i++){ const hx=VW-40-(n-i)*(hs+3)+hs/2, hy=104; if(!drawSpr(ctx,'heart',hx,hy,hs,{})){ ctx.fillStyle='#ff4d4d'; ctx.beginPath(); ctx.arc(hx,hy,hs*0.32,0,7); ctx.fill(); } } }

  // --- town title
  ctx.textAlign='center';
  if(!drawTextFit(ctx,'ASHFORD', VW/2, 178, 60, VW*0.7)){ ctx.fillStyle='#ffb04d'; ctx.font='900 58px "Pixelify",system-ui,sans-serif'; ctx.fillText('ASHFORD', VW/2, 178); }

  // --- Keith feud banner
  panel(ctx, 40, 220, VW-80, 54, 12, 'rgba(50,12,28,0.66)', 'rgba(255,61,122,0.55)');
  if(sprReady('keith')) drawSpr(ctx,'keith', 76, 247, 58, {});
  ctx.textAlign='left'; ctx.fillStyle='#ff9dbd'; ctx.font='700 20px "Pixelify",system-ui,sans-serif'; ctx.fillText('KEITH: '+feudStage().toUpperCase(), 112, 244);
  ctx.fillStyle='rgba(255,157,189,0.72)'; ctx.font='500 15px "Pixelify",system-ui,sans-serif'; ctx.fillText('he watches you rebuild', 112, 264);

  // --- building cards (2x2), translucent over the scene. Makko-sprite icons, no emoji.
  const cardY=296, cardH=116, gap=14, cw=(VW-80-gap)/2, wellBuilt = META.buildings.well.built, forgeBuilt = META.buildings.forge.built;
  drawBuildingCard(ctx, 40, cardY, cw, cardH, 'THE WELL',
    wellBuilt ? 'tap to spend embers' : (K.WELL_RISE-META.saved)+' more saves',
    wellBuilt ? '#7fe8ff' : '#ffb14d', wellBuilt, 'well', 'beacon');
  drawBuildingCard(ctx, 40+cw+gap, cardY, cw, cardH, 'THE FORGE',
    forgeBuilt ? 'dash upgrades' : (K.FORGE_RISE-META.saved)+' more saves',
    forgeBuilt ? '#ff9a45' : '#ffb14d', forgeBuilt, 'forge', 'fire');
  drawBuildingCard(ctx, 40, cardY+cardH+gap, cw, cardH, 'THE SHRINE', 'enter the record', '#c9a0ff', true, 'shrine', 'beacon');
  const dFresh = diaryFreshCount();
  drawBuildingCard(ctx, 40+cw+gap, cardY+cardH+gap, cw, cardH, 'THE DIARY', dFresh>0 ? dFresh+' new to read' : 'story — optional', '#c9a0ff', true, 'diary', null);
  if(dFresh>0){ const bx=40+cw+gap+cw-22, by=cardY+cardH+gap+20; ctx.fillStyle='#8affc1'; ctx.beginPath(); ctx.arc(bx,by,11,0,7); ctx.fill();
    ctx.fillStyle='#0a0710'; ctx.font='800 15px "Pixelify",system-ui,sans-serif'; ctx.textAlign='center'; ctx.fillText(String(dFresh), bx, by+5); }

  if(starterAvailable()){
    panel(ctx,40,580,VW-80,88,14,'rgba(17,25,35,0.94)','#ffcf80');
    ctx.textAlign='center';ctx.fillStyle='#ffe1a4';ctx.font='800 26px "Pixelify",system-ui,sans-serif';
    ctx.fillText('CHOOSE YOUR FIRST UPGRADE',VW/2,615);
    ctx.font='500 21px "Pixelify",system-ui,sans-serif';ctx.fillText('An extra heart or dash · '+STARTER_COST+' embers',VW/2,648);
    hubB(40,580,VW-80,88,'starter');
  }

  // Always show the nearest available upgrade, including cheaper Forge/recovery tracks.
  drawUpgradeProgress(ctx,60,VH-246,VW-120,102);
  if(upgradeGoal() && upgradeGoal().act)hubB(60,VH-246,VW-120,102,'nextupgrade');

  // --- PLAY button = DISTRICT launcher (‹ ›to pick any unlocked district, center to enter)
  const pbY=VH-128, pbW=VW-120, pbX=60, pbH=92, pulse=0.5+0.5*Math.sin(frame*0.08);
  const unlocked=Math.min(5,META.district||1), canPrev=selDistrict>1, canNext=selDistrict<unlocked;
  panel(ctx, pbX, pbY, pbW, pbH, 16, 'rgba(255,120,40,'+(0.34+0.14*pulse).toFixed(2)+')', '#ff9a45');
  ctx.textAlign='center';
  // district line
  ctx.fillStyle='rgba(255,240,220,0.92)'; ctx.font='800 15px "Pixelify",system-ui,sans-serif';
  ctx.fillText('DISTRICT '+selDistrict+' / 5  ·  KEITH LV.'+selDistrict, VW/2, pbY+26);
  if(!drawTextFit(ctx,DISTRICTS[selDistrict-1], VW/2, pbY+56, 30, pbW*0.66)){ ctx.fillStyle='#fff'; ctx.font='800 30px "Pixelify",system-ui,sans-serif'; ctx.fillText(DISTRICTS[selDistrict-1], VW/2, pbY+58); }
  const foot = (selDistrict===unlocked && unlocked<5) ? 'clear this district to open the next' : (isTouch?'tap to enter':'SPACE / click to enter');
  ctx.fillStyle='rgba(255,240,220,0.8)'; ctx.font='500 14px "Pixelify",system-ui,sans-serif'; ctx.fillText(foot, VW/2, pbY+78);
  // arrows
  ctx.font='800 40px "Pixelify",system-ui,sans-serif'; ctx.textAlign='center';
  ctx.fillStyle = canPrev ? '#ffe6c8' : 'rgba(255,230,200,0.22)'; ctx.fillText('‹', pbX+30, pbY+58);
  ctx.fillStyle = canNext ? '#ffe6c8' : 'rgba(255,230,200,0.22)'; ctx.fillText('›', pbX+pbW-30, pbY+58);
  hubB(pbX, pbY, pbW, pbH, 'play');                          // center enters
  if(canPrev) hubB(pbX, pbY, 60, pbH, 'dprev');             // ‹ (checked before play — pushed later)
  if(canNext) hubB(pbX+pbW-60, pbY, 60, pbH, 'dnext');      // ›

  // --- sheets
  if(hubSheet==='starter'){drawStarterSheet(ctx);return;}
  if(hubSheet==='well'||hubSheet==='forge') drawShopSheet(ctx, hubSheet);
  else if(hubSheet==='diary') drawDiarySheet(ctx);
  else if(hubSheet==='conversations') drawConversationSheet(ctx);
  else if(hubSheet==='shrine') drawShrineSheet(ctx);

  // --- toast (build/purchase feedback)
  if(hubToast>0){ ctx.globalAlpha=Math.min(1,hubToast); ctx.textAlign='center';
    const ty=VH*0.60; panel(ctx, VW/2-230, ty-30, 460, 60, 12, 'rgba(10,8,16,0.92)', 'rgba(255,207,107,0.75)');
    ctx.fillStyle='#ffcf6b'; ctx.font='800 24px "Pixelify",system-ui,sans-serif'; ctx.fillText(hubToastMsg, VW/2, ty+9); ctx.globalAlpha=1; }
}

function drawBuildingCard(ctx, x, y, w, h, title, sub, col, live, act, iconSpr){
  panel(ctx, x, y, w, h, 14, live?'rgba(14,18,28,0.66)':'rgba(10,10,16,0.6)', live?col:'rgba(120,131,151,0.4)');
  ctx.save(); if(!live) ctx.globalAlpha=0.45;
  if(iconSpr==='fire') drawFlame(ctx, x+w/2, y+h*0.56, h*0.52, frame*0.4, live?0.95:0.4);
  else if(iconSpr && sprReady(iconSpr)) drawSpr(ctx, iconSpr, x+w/2, y+h*0.40, h*0.5, {});
  ctx.restore();
  ctx.textAlign='center'; ctx.fillStyle=live?'#fff':'rgba(205,210,225,0.9)'; ctx.font='800 20px "Pixelify",system-ui,sans-serif';
  ctx.fillText(title, x+w/2, y+h-28);
  ctx.fillStyle=live?col:'rgba(150,160,180,0.9)'; ctx.font='500 14px "Pixelify",system-ui,sans-serif'; ctx.fillText(sub, x+w/2, y+h-9);
  if(act) hubB(x,y,w,h,act,true);
}

function drawUpgradeProgress(ctx,x,y,w,h){
  const goal=upgradeGoal();
  panel(ctx,x,y,w,h,12,'rgba(15,20,31,0.97)','#71664a');
  ctx.save();ctx.textAlign='center';ctx.fillStyle='#ffe0a2';ctx.font='800 25px "Pixelify",system-ui,sans-serif';
  if(!goal){ctx.fillText('ALL CURRENT UPGRADES OWNED',x+w/2,y+40);ctx.restore();return;}
  const have=goalAmount(goal),ready=have>=goal.cost;
  ctx.fillText(goal.name+(ready?' · READY':''),x+w/2,y+30);
  ctx.font='500 23px "Pixelify",system-ui,sans-serif';ctx.fillStyle=ready?'#a0ffd0':'#e2d6c3';
  ctx.fillText(Math.floor(have)+' / '+goal.cost+' '+(goal.kind==='saves'?'RESCUED':'EMBERS'),x+w/2,y+59);
  ctx.fillStyle='#35303b';ctx.fillRect(x+20,y+h-22,w-40,9);
  ctx.fillStyle=ready?'#8affc1':'#ffbd65';ctx.fillRect(x+20,y+h-22,(w-40)*Math.min(1,Math.max(0,have/goal.cost)),9);
  ctx.restore();
}
function drawRunResults(ctx){
  ctx.save();ctx.fillStyle='rgba(7,7,14,0.94)';ctx.fillRect(0,0,VW,VH);
  ctx.textAlign='center';ctx.fillStyle=won?'#a0ffd0':'#ffbd80';
  ctx.font='800 54px "Pixelify",system-ui,sans-serif';ctx.fillText(won?'DISTRICT CLEARED':'BURNED UP',VW/2,190);
  drawSpr(ctx,won?'happy':'ashimp',VW/2,286,105,{});
  ctx.font='600 25px "Pixelify",system-ui,sans-serif';ctx.fillStyle='#d2d9e8';
  ctx.fillText('Your embers are safe.',VW/2,380);
  ctx.fillText(saved+' villagers rescued · '+fmt(elapsed),VW/2,423);
  ctx.fillStyle='#ffcf6b';ctx.font='800 36px "Pixelify",system-ui,sans-serif';
  ctx.fillText('+'+runEmbers+' embers earned',VW/2,478);
  if(runStarterBonus>0){ctx.font='600 24px "Pixelify",system-ui,sans-serif';ctx.fillText('+'+runStarterBonus+' first-upgrade bonus',VW/2,517);}
  drawUpgradeProgress(ctx,48,558,VW-96,122);
  ctx.fillStyle='#b7b8c9';ctx.font='500 22px "Pixelify",system-ui,sans-serif';
  ctx.fillText('SCORE '+score,VW/2,731);
  const goal=upgradeGoal(),ready=goal&&goalAmount(goal)>=goal.cost;
  for(const b of resultButtons()){
    const primary=b.act==='retry';
    panel(ctx,b.x,b.y,b.w,b.h,14,primary?'#533222':'#202a39',primary?'#ffbd65':'#8ba1bc');
    ctx.fillStyle=primary?'#ffe0ac':'#dce9fa';ctx.font='800 30px "Pixelify",system-ui,sans-serif';
    ctx.fillText(primary?(won&&runDistrict<META.district?'NEXT DISTRICT':'RUN AGAIN'):(ready?'UPGRADES · READY':'BACK TO ASHFORD'),VW/2,b.y+b.h/2+10);
  }
  if(!isTouch){ctx.fillStyle='#b6bccb';ctx.font='500 22px "Pixelify",system-ui,sans-serif';ctx.fillText('ENTER / R: RUN · T: TOWN',VW/2,1060);}
  ctx.restore();
}

function drawStarterSheet(ctx){
  hubBtns=[]; // modal owns every hit region; the town underneath cannot receive clicks
  ctx.save();ctx.fillStyle='rgba(6,7,14,0.94)';ctx.fillRect(0,0,VW,VH);
  ctx.textAlign='center';ctx.fillStyle='#ffe0a2';ctx.font='800 38px "Pixelify",system-ui,sans-serif';
  ctx.fillText('YOUR FIRST UPGRADE',VW/2,215);
  ctx.fillStyle='#edf0fa';ctx.font='500 26px "Pixelify",system-ui,sans-serif';
  ctx.fillText('Choose what helps you most.',VW/2,260);
  ctx.fillStyle='#ffbd65';ctx.fillText('YOU HAVE '+META.embers+' EMBERS',VW/2,310);
  let y=360;
  for(const [key,o] of Object.entries(STARTER_OPTIONS)){
    panel(ctx,48,y,VW-96,220,16,'#171e2d',o.color);
    drawSpr(ctx,o.icon,104,y+68,50,{});
    ctx.textAlign='left';ctx.fillStyle=o.color;ctx.font='800 27px "Pixelify",system-ui,sans-serif';ctx.fillText(o.title,148,y+47);
    ctx.fillStyle='#ffffff';ctx.font='800 28px "Pixelify",system-ui,sans-serif';ctx.fillText(o.benefit,148,y+91);
    ctx.font='500 23px "Pixelify",system-ui,sans-serif';ctx.fillStyle='#cbd3e4';ctx.fillText(o.description,76,y+135);
    const afford=META.embers>=STARTER_COST;
    panel(ctx,76,y+156,VW-152,46,10,afford?'#303c4e':'#242633',o.color);
    ctx.textAlign='center';ctx.font='800 24px "Pixelify",system-ui,sans-serif';ctx.fillStyle=afford?'#ffe1a4':'#8c92a1';
    ctx.fillText(afford?'BUY FOR '+STARTER_COST+' EMBERS':'NEED '+STARTER_COST+' EMBERS',VW/2,y+187);
    hubB(76,y+156,VW-152,46,'starterbuy:'+key,afford);y+=250;
  }
  ctx.font='500 23px "Pixelify",system-ui,sans-serif';ctx.fillStyle='#cbd3e4';
  ctx.fillText('Permanent. Applies on your next run.',VW/2,895);
  ctx.fillText('The other upgrade stays available in its shop.',VW/2,932);
  panel(ctx,160,978,VW-320,60,12,'#1c2331','#7b89a2');ctx.fillStyle='#e2e9f6';ctx.fillText('DECIDE LATER',VW/2,1016);
  hubB(160,978,VW-320,60,'close');ctx.restore();
}

function drawShopSheet(ctx, bld){
  const shop=SHOPS[bld], col=shop.color, colDim='rgba('+ (bld==='forge'?'255,154,69':'127,232,255') +',0.25)';
  const h=360, y=VH-h; ctx.fillStyle='rgba(6,5,11,0.55)'; ctx.fillRect(0,0,VW,VH);
  panel(ctx, 0, y, VW, h+20, 18, 'rgba(14,16,26,0.98)', col);
  hubB(0,0,VW,y,'close');                                     // tap above the sheet closes it
  ctx.textAlign='center'; ctx.fillStyle=col; ctx.font='800 34px "Pixelify",system-ui,sans-serif'; ctx.fillText(shop.title, VW/2, y+50);
  ctx.fillStyle='rgba(210,220,235,0.8)'; ctx.font='500 17px "Pixelify",system-ui,sans-serif';
  ctx.fillText(shop.sub, VW/2, y+78);
  let ry=y+108;
  for(const item of shop.items){
    const tier=META.buildings[bld][item.track]||0, maxed=tier>=item.costs.length;
    const cost=maxed?0:item.costs[tier], afford=META.embers>=cost;
    panel(ctx, 30, ry, VW-60, 96, 12, 'rgba(30,34,48,0.9)', colDim);
    ctx.textAlign='left'; ctx.fillStyle='#fff'; ctx.font='800 22px "Pixelify",system-ui,sans-serif'; ctx.fillText(item.name, 50, ry+34);
    ctx.fillStyle='rgba(200,210,225,0.8)'; ctx.font='500 16px "Pixelify",system-ui,sans-serif'; ctx.fillText(item.desc, 50, ry+58);
    for(let i=0;i<item.costs.length;i++){ ctx.fillStyle=i<tier?col:'rgba(180,190,210,0.2)'; ctx.beginPath(); ctx.arc(52+i*20, ry+80, 6,0,7); ctx.fill(); }
    // buy button — dark stone with the bold Makko flame + gold cost digits (no emoji, crisp numbers)
    const bw=152, bx=VW-30-bw-14, by=ry+18, bh=60;
    panel(ctx, bx, by, bw, bh, 10, maxed?'rgba(40,44,58,0.8)':(afford?'rgba(34,24,14,0.96)':'rgba(24,20,26,0.7)'), maxed?'#5a6072':(afford?'#ffb14d':'rgba(120,90,60,0.5)'));
    ctx.textAlign='center';
    if(maxed){ ctx.fillStyle='#8891a5'; ctx.font='800 24px "Pixelify",system-ui,sans-serif'; ctx.fillText('MAX', bx+bw/2, by+39); }
    else { ctx.save(); if(!afford) ctx.globalAlpha=0.5;
      if(sprReady('flames')) drawFlame(ctx, bx+38, by+48, 44, frame*0.4, 1);
      if(!drawNumber(ctx, cost, bx+bw/2+20, by+30, 32)){ ctx.fillStyle='#ffcf6b'; ctx.font='800 28px "Pixelify",system-ui,sans-serif'; ctx.fillText(String(cost), bx+bw/2+20, by+40); }
      ctx.restore(); }
    if(!maxed && afford) hubB(bx,by,bw,bh,'buy:'+bld+':'+item.track);
    ry+=112;
  }
  ctx.textAlign='center'; ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='500 16px "Pixelify",system-ui,sans-serif'; ctx.fillText('tap outside to close', VW/2, VH-14);
}

function drawShrineSheet(ctx){
  const h=470, y=VH-h;
  ctx.fillStyle='rgba(6,5,11,0.72)'; ctx.fillRect(0,0,VW,VH);
  panel(ctx, 0, y, VW, h+20, 18, 'rgba(16,12,24,0.99)', 'rgba(201,160,255,0.5)');
  hubB(0,0,VW,y,'close');
  ctx.textAlign='center';
  ctx.fillStyle='#c9a0ff'; ctx.font='800 32px "Pixelify",system-ui,sans-serif'; ctx.fillText('THE SHRINE', VW/2, y+48);
  ctx.fillStyle='rgba(210,195,235,0.72)'; ctx.font='italic 500 15px "Pixelify",system-ui,sans-serif';
  ctx.fillText('someone has been keeping count.', VW/2, y+72);

  // Rescue count records progress; it is not a debt balance or a release threshold.
  ctx.textAlign='left'; ctx.fillStyle='#ff9dbd'; ctx.font='800 20px "Pixelify",system-ui,sans-serif';
  ctx.fillText('THE RATKIN REMEMBER', 44, y+112);
  ctx.fillStyle='#efe4ff'; ctx.font='500 18px "Pixelify",system-ui,sans-serif';
  ctx.fillText('You got them out. Their homes are still here.', 44, y+148);
  ctx.fillText('Keith watches. The ratkin have the last word.', 44, y+180);

  // ---- record rows
  const row=(label,val,yy,col)=>{ ctx.textAlign='left'; ctx.fillStyle='rgba(210,215,235,0.7)'; ctx.font='500 16px "Pixelify",system-ui,sans-serif'; ctx.fillText(label, 44, yy);
    ctx.textAlign='right'; ctx.fillStyle=col||'#efe4ff'; ctx.font='800 20px "Pixelify",system-ui,sans-serif'; ctx.fillText(val, VW-44, yy); };
  row('LIVES CARRIED OUT, ALL TOLD', String(META.saved||0), y+218, '#8affc1');
  row('QUARTERS OF ASHFORD RECLAIMED', (META.clearedDistricts||0)+' / 5', y+254, '#ffcf8a');
  row('THE JAILER, KEITH', feudStage().toUpperCase(), y+290, '#ff9dbd');
  row('EMBERS BANKED', String(META.embers||0), y+326, '#ffb14d');

  // ---- read-the-record button -> the diary
  const bY=y+h-92, bX=60, bW=VW-120, bH=66, fresh=diaryFreshCount();
  panel(ctx, bX, bY, bW, bH, 14, 'rgba(40,30,58,0.9)', 'rgba(201,160,255,0.6)');
  ctx.textAlign='center'; ctx.fillStyle='#e7d9ff'; ctx.font='800 23px "Pixelify",system-ui,sans-serif'; ctx.fillText('READ THE RECORD', VW/2, bY+34);
  ctx.fillStyle='rgba(210,195,235,0.6)'; ctx.font='500 14px "Pixelify",system-ui,sans-serif'; ctx.fillText(fresh>0 ? fresh+' new to read' : "Duy's account of how he got here", VW/2, bY+54);
  if(fresh>0){ ctx.fillStyle='#8affc1'; ctx.beginPath(); ctx.arc(bX+bW-26, bY+24, 12, 0, 7); ctx.fill(); ctx.fillStyle='#0a0710'; ctx.font='800 15px "Pixelify",system-ui,sans-serif'; ctx.textAlign='center'; ctx.fillText(String(fresh), bX+bW-26, bY+29); }
  hubB(bX, bY, bW, bH, 'diary');
  ctx.textAlign='center'; ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='500 14px "Pixelify",system-ui,sans-serif'; ctx.fillText('tap outside to close', VW/2, VH-12);
}

function drawDiarySheet(ctx){
  ctx.fillStyle= diaryOpen===null ? 'rgba(6,5,11,0.72)' : 'rgba(6,5,11,0.92)'; ctx.fillRect(0,0,VW,VH);
  const h = VH-96, y = VH-h;
  panel(ctx, 0, y, VW, h+20, 18, 'rgba(16,12,24,0.99)', 'rgba(201,160,255,0.5)');
  if(diaryOpen===null) hubB(0,0,VW,y,'close');            // tap above closes (list mode only)

  if(diaryOpen===null){
    // ---- CHAPTER LIST
    ctx.textAlign='center'; ctx.fillStyle='#c9a0ff'; ctx.font='800 30px "Pixelify",system-ui,sans-serif'; ctx.fillText('THE DIARY', VW/2, y+40);
    ctx.fillStyle='rgba(210,195,235,0.65)'; ctx.font='italic 500 14px "Pixelify",system-ui,sans-serif';
    ctx.fillText('Memories, when you have a moment. Reading is optional.', VW/2, y+62);
    const rowH=54, x0=30, rw=VW-60; let ry=y+80;
    for(let i=0;i<DIARY.length;i++){ const e=DIARY[i], ok=diaryUnlocked(e), fresh=ok&&!diaryIsRead(e.id);
      panel(ctx, x0, ry, rw, rowH-8, 12, ok?'rgba(40,30,58,0.7)':'rgba(20,18,28,0.6)', ok?'rgba(201,160,255,0.45)':'rgba(90,84,110,0.35)');
      ctx.save(); if(!ok) ctx.globalAlpha=0.6;
      // thumbnail
      const ty0=ry+(rowH-8)/2;
      if(ok && e.art==='fire') drawFlame(ctx, x0+32, ty0+16, 34, frame*0.4, 0.95);
      else if(ok && e.art==='ashford' && sprReady('ashford')){ ctx.save(); ctx.beginPath(); ctx.arc(x0+32,ty0,17,0,7); ctx.clip(); const im=MAKKO_IMG['ashford']; ctx.drawImage(im, x0+32-17, ty0-17, 34, 34); ctx.restore(); }
      else if(ok && sprReady(e.art)) drawSpr(ctx, e.art, x0+32, ty0, 38, {});
      else { ctx.fillStyle=ok?'#3a2f52':'#2a2636'; ctx.beginPath(); ctx.arc(x0+32, ty0, 17, 0, 7); ctx.fill(); }
      ctx.textAlign='left';
      if(ok){ ctx.fillStyle='#efe4ff'; ctx.font='800 20px "Pixelify",system-ui,sans-serif'; ctx.fillText(e.title, x0+62, ry+22);
        ctx.fillStyle='rgba(210,195,235,0.6)'; ctx.font='italic 500 14px "Pixelify",system-ui,sans-serif'; ctx.fillText(e.teaser, x0+62, ry+40); }
      else { ctx.fillStyle='#8a84a0'; ctx.font='800 20px "Pixelify",system-ui,sans-serif'; ctx.fillText('LOCKED', x0+62, ry+22);
        ctx.fillStyle='rgba(160,154,180,0.7)'; ctx.font='500 14px "Pixelify",system-ui,sans-serif'; ctx.fillText(e.hint, x0+62, ry+40); }
      ctx.restore();
      if(fresh){ ctx.fillStyle='#8affc1'; ctx.font='800 14px "Pixelify",system-ui,sans-serif'; ctx.textAlign='right'; ctx.fillText('NEW', x0+rw-16, ry+30); }
      if(ok) hubB(x0, ry, rw, rowH-8, 'diaryopen:'+i);
      ry += rowH;
    }
    panel(ctx,30,VH-145,VW-60,60,10,'#252039','#b8a0d7');
    ctx.textAlign='center';ctx.fillStyle='#eee1ff';ctx.font='700 23px "Pixelify",system-ui,sans-serif';ctx.fillText('CONVERSATIONS · Read again',VW/2,VH-108);
    hubB(30,VH-145,VW-60,60,'conversations');
    ctx.textAlign='center'; ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='500 15px "Pixelify",system-ui,sans-serif'; ctx.fillText('tap the top to close', VW/2, VH-12);
  } else {
    // ---- READER (tall, story-friendly)
    const e = DIARY[diaryOpen], pg = Math.max(0, Math.min(diaryPage, e.pages.length-1));
    // back
    panel(ctx, 24, y+22, 120, 42, 10, 'rgba(40,30,58,0.85)', 'rgba(201,160,255,0.45)');
    ctx.textAlign='center'; ctx.fillStyle='#e7d9ff'; ctx.font='700 18px "Pixelify",system-ui,sans-serif'; ctx.fillText('‹ BACK', 84, y+49);
    hubB(24, y+22, 120, 42, 'diaryback');
    // title (shrink to fit)
    ctx.textAlign='center'; let ts=30; ctx.font='800 30px "Pixelify",system-ui,sans-serif';
    while(ctx.measureText(e.title).width > VW-180 && ts>16){ ts-=2; ctx.font='800 '+ts+'px "Pixelify",system-ui,sans-serif'; }
    ctx.fillStyle='#c9a0ff'; ctx.fillText(e.title, VW/2, y+54);
    // illustration
    const iy=y+80, ih=352;
    panel(ctx, 40, iy, VW-80, ih, 14, 'rgba(10,8,16,0.6)', 'rgba(201,160,255,0.28)');
    ctx.save(); roundRectPath(ctx, 40, iy, VW-80, ih, 14); ctx.clip();
    const sim = sprReady(e.art) ? MAKKO_IMG[e.art] : null;
    if(e.art==='ashford' && sprReady('ashford')){ const im=MAKKO_IMG['ashford'], sc=Math.max((VW-80)/im.naturalWidth, ih/im.naturalHeight), w=im.naturalWidth*sc, hh=im.naturalHeight*sc; ctx.globalAlpha=0.9; ctx.drawImage(im, VW/2-w/2, iy+ih/2-hh/2, w, hh); }
    else if(e.art==='fire'){ drawFlame(ctx, VW/2, iy+ih*0.86, ih*0.8, frame*0.4, 0.95); }
    else if(sim && sim.naturalWidth > sim.naturalHeight*1.15){   // a bespoke SCENE illustration -> cover-fit the panel
      const sc=Math.max((VW-80)/sim.naturalWidth, ih/sim.naturalHeight), w=sim.naturalWidth*sc, hh=sim.naturalHeight*sc;
      ctx.drawImage(sim, VW/2-w/2, iy+ih/2-hh/2, w, hh); }
    else if(sim) drawSpr(ctx, e.art, VW/2, iy+ih/2, ih*0.86, {});
    else { const g=ctx.createLinearGradient(0,iy,0,iy+ih); g.addColorStop(0,'#241c30'); g.addColorStop(1,'#15111d'); ctx.fillStyle=g; ctx.fillRect(40,iy,VW-80,ih);
      ctx.fillStyle='rgba(201,160,255,0.25)'; ctx.font='700 16px "Pixelify",system-ui,sans-serif'; ctx.textAlign='center'; ctx.fillText('· '+e.title+' ·', VW/2, iy+ih/2); }
    ctx.restore();
    // prose (roomy)
    ctx.textAlign='center'; ctx.fillStyle='#eadffb'; ctx.font='500 25px "Pixelify",system-ui,sans-serif';
    wrapText(ctx, e.pages[pg], VW/2, iy+ih+56, VW-110, 36);
    // page dots + nav pinned to the bottom
    const dotY=VH-58, n=e.pages.length, dw=18; const dx0=VW/2-((n-1)*dw)/2;
    for(let i=0;i<n;i++){ ctx.fillStyle = i===pg ? '#c9a0ff' : 'rgba(201,160,255,0.3)'; ctx.beginPath(); ctx.arc(dx0+i*dw, dotY-14, 5, 0, 7); ctx.fill(); }
    ctx.textAlign='center'; ctx.font='800 38px "Pixelify",system-ui,sans-serif';
    ctx.fillStyle = pg>0 ? '#e7d9ff' : 'rgba(231,217,255,0.22)'; ctx.fillText('‹', 58, dotY+8);
    ctx.fillStyle = pg<n-1 ? '#e7d9ff' : 'rgba(231,217,255,0.22)'; ctx.fillText('›', VW-58, dotY+8);
    if(pg>0) hubB(20, dotY-40, 96, 80, 'diaryprev');
    hubB(120, dotY-40, VW-240, 80, pg<n-1 ? 'diarynext' : 'diaryback');   // center advances, or closes on last page
    if(pg<n-1) hubB(VW-116, dotY-40, 96, 80, 'diarynext');
    ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='500 14px "Pixelify",system-ui,sans-serif'; ctx.fillText(pg<n-1?'tap to turn the page':'tap to close the chapter', VW/2, VH-14);
  }
}

function drawTitle(ctx){
  ctx.fillStyle='#0a0710'; ctx.fillRect(0,0,VW,VH);
  if(sprReady('bg')){ const im=MAKKO_IMG['bg'], sc=Math.max(VW/im.naturalWidth,VH/im.naturalHeight),
    w=im.naturalWidth*sc, h=im.naturalHeight*sc;
    ctx.save(); ctx.globalAlpha=0.30; ctx.drawImage(im,(VW-w)/2,(VH-h)/2,w,h); ctx.restore(); }
  const fg=ctx.createLinearGradient(0,VH,0,VH*0.5);       // the town burning below
  fg.addColorStop(0,'rgba(255,120,35,0.6)'); fg.addColorStop(1,'rgba(255,90,25,0)');
  ctx.fillStyle=fg; ctx.fillRect(0,VH*0.5,VW,VH*0.5);
  // Keith looms with pink rays
  const kx=VW*0.5, ky=VH*0.54;
  for(let i=0;i<26;i++){ const a=i/26*Math.PI*2, hw=0.02*(0.7+0.4*Math.sin(frame*0.02+i));
    ctx.fillStyle=i%2?'rgba(255,61,122,0.10)':'rgba(255,61,122,0.05)';
    ctx.beginPath(); ctx.moveTo(kx,ky); ctx.lineTo(kx+Math.cos(a-hw)*1500,ky+Math.sin(a-hw)*1500);
    ctx.lineTo(kx+Math.cos(a+hw)*1500,ky+Math.sin(a+hw)*1500); ctx.closePath(); ctx.fill(); }
  drawSpr(ctx,'keith', kx, ky, VH*0.30, {sy:1+0.02*Math.sin(frame*0.08)});
  // the hero (a person), below, facing the fire
  if(!drawAnim(ctx,'hero_run', VW*0.5, VH*0.75, VH*0.135, {fps:7})) drawSpr(ctx,'ashimp', VW*0.5, VH*0.75, VH*0.11,{});
  // flames across the bottom + rising embers
  for(let i=0;i<7;i++) drawFlame(ctx, VW*(i+0.5)/7, VH*1.0, VH*0.09+8*Math.sin(frame*0.3+i*2), frame*0.36+i*3, 0.9);
  for(let i=0;i<46;i++){ const life=VH*0.8, t=((frame*2.4)+i*67)%life, ex=(i*97+Math.sin(frame*0.03+i)*38)%VW,
    ey=VH*0.99-t, al=0.7*(1-t/life);
    if(al>0){ ctx.fillStyle='rgba(255,'+(140+(i*37)%90)+',55,'+al.toFixed(2)+')'; const s=2+(i%3); ctx.fillRect(ex,ey,s,s); } }
  // TITLE
  ctx.textAlign='center';
  const ty=VH*0.24, tg=ctx.createRadialGradient(VW/2,ty,8,VW/2,ty,VW*0.55);
  tg.addColorStop(0,'rgba(255,150,45,0.5)'); tg.addColorStop(1,'rgba(255,120,30,0)');
  ctx.fillStyle=tg; ctx.fillRect(0,ty-VW*0.45,VW,VW*0.9);
  const bob=Math.sin(frame*0.05)*4;
  if(!drawTextFit(ctx,'FWOOSH', VW/2, ty+bob, 140, VW*0.92)){
    ctx.fillStyle='#ffb04d'; ctx.font='900 120px "Pixelify",system-ui,sans-serif'; ctx.fillText('FWOOSH', VW/2, ty+bob); }
  ctx.fillStyle='#ffd0a0'; ctx.font='600 26px "Pixelify",system-ui,sans-serif';
  ctx.fillText('carry their fire', VW/2, VH*0.335);
  const blink=0.35+0.55*(0.5+0.5*Math.sin(frame*0.12));
  ctx.fillStyle='rgba(255,255,255,'+blink.toFixed(2)+')'; ctx.font='700 30px "Pixelify",system-ui,sans-serif';
  ctx.fillText('TAP TO START', VW/2, VH*0.90);
}

function render(){
  if(onTitle){ drawTitle(ctx); return; }
  if(mode === 'hub'){ drawHub(ctx); return; }
  const p = player;
  SK.bg(ctx);

  if(window.OBS_DEBUG){                                 // obstacle-tuning overlay (dev only)
    ctx.save(); ctx.strokeStyle='rgba(0,255,255,0.9)'; ctx.fillStyle='rgba(0,255,255,0.12)'; ctx.lineWidth=2;
    for(const o of OBSTACLES){ if(o.r!=null){ ctx.beginPath(); ctx.arc(o.x,o.y,o.r,0,7); ctx.fill(); ctx.stroke(); }
      else { ctx.fillRect(o.x,o.y,o.w,o.h); ctx.strokeRect(o.x,o.y,o.w,o.h); } }
    ctx.restore();
  }

  // ---- embers
  for(const t of trail){
    const a = 1 - t.t/K.TRAIL_LIFE;
    wrapDraw(t.x, X=> SK.ember(ctx, X, t.y, a));
  }

  // ---- slag / grudge wall
  for(const s of slag){
    wrapDraw(s.x, X=> SK.wall(ctx, X, s.y, s.grudge, oppScarred));
  }

  // ---- HUSKS: villagers you failed to save. Ember-veined coals that brighten + shudder as they near cracking.
  for(const h of husks){
    const near = h.t / K.HUSK_CRACK_T;                         // 0 fresh .. 1 about to crack
    const cracking = h.t >= K.HUSK_CRACK_T - K.CRACK_TELE;
    const shake = cracking ? (2.4*Math.sin(frame*1.3+(h.ph||0))) : 0;
    wrapDraw(h.x, X=>{
      const gx = X + shake;
      // ember glow underneath, hotter as it nears crack
      const gr = K.HUSK_R*1.6 + 4*near + 2*Math.sin(frame*0.3+(h.ph||0));
      const g = ctx.createRadialGradient(gx, h.y, 1, gx, h.y, gr);
      const gi = (0.30 + 0.45*near).toFixed(2);
      g.addColorStop(0, 'rgba(255,120,40,'+gi+')'); g.addColorStop(1, 'rgba(255,80,30,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(gx, h.y, gr, 0, 7); ctx.fill();
      groundShadow(ctx, gx, h.y + K.HUSK_R*0.9, K.HUSK_R*1.0, K.HUSK_R*0.32);
      // the coal body: the cinder-imp silhouette, darkened
      ctx.save();
      ctx.globalAlpha = cracking ? (0.7 + 0.3*Math.abs(Math.sin(frame*1.3))) : 1;
      if(!drawAnim(ctx,'ashimp', gx, h.y, K.HUSK_R*2.6, {fps:6}) &&
         !drawSpr(ctx,'ashimp', gx, h.y, K.HUSK_R*2.5, {})){
        ctx.fillStyle = '#3a2a24'; ctx.beginPath(); ctx.ellipse(gx, h.y, K.HUSK_R, K.HUSK_R*1.15, 0, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(255,120,50,'+(0.5+0.4*near).toFixed(2)+')';   // ember veins
        for(let v=0;v<3;v++){ const a=(h.ph+v*2.1); ctx.beginPath();
          ctx.arc(gx+Math.cos(a)*K.HUSK_R*0.4, h.y+Math.sin(a)*K.HUSK_R*0.5, 1.6, 0, 7); ctx.fill(); }
      }
      ctx.restore();
      // REKINDLE affordance: a soft green bloom under the coal when you're carrying fire (glow, not a ring)
      if(player.heat >= K.REKINDLE_COST && dist(h.x,h.y,player.x,player.y) < 130){
        const pr = K.HUSK_R+13, pg = ctx.createRadialGradient(gx,h.y,1,gx,h.y,pr);
        const pa = (0.24+0.14*Math.sin(frame*0.2)).toFixed(3);
        pg.addColorStop(0,'rgba(138,255,193,'+pa+')'); pg.addColorStop(0.6,'rgba(138,255,193,'+(pa*0.5).toFixed(3)+')'); pg.addColorStop(1,'rgba(138,255,193,0)');
        ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(gx,h.y,pr,0,7); ctx.fill();
      }
    });
  }

  // ---- cells (crowd + hunters), distant ones dimmed
  for(const c of cells){
    const far = dist(c.x,c.y,p.x,p.y) > 300;
    ctx.globalAlpha = far ? 0.30 : 1;
    if(c.hunter){
      const t = 1 - (c.fuse/hunterFuse);
      const a = Math.atan2(c.vy, c.vx);
      wrapDraw(c.x, X=> SK.hunter(ctx, X, c.y, a, t));
    } else {
      wrapDraw(c.x, X=> SK.cell(ctx, X, c.y, c));
    }
    ctx.globalAlpha = 1;
  }

  // Gameplay warning boundaries use UI lines; the explosion reuses the existing Makko flame.
  for(const d of demons){if(d.source!=='vent')continue;
    ctx.save();ctx.strokeStyle='#ffad55';ctx.lineWidth=3;
    if(d.tgt && !d.feast){ctx.setLineDash([7,9]);ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.tgt.x,d.tgt.y);ctx.stroke();ctx.setLineDash([]);}
    if(d.feast){
      ctx.strokeStyle='#ff6155';ctx.beginPath();ctx.arc(d.feast.x,d.feast.y,K.CINDER_BLAST_R,0,Math.PI*2);ctx.stroke();
      ctx.lineWidth=6;ctx.beginPath();ctx.arc(d.feast.x,d.feast.y,28,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,d.eatT/K.CINDER_EAT_T));ctx.stroke();
    }else if(d.warn>0){ctx.beginPath();ctx.arc(d.x,d.y,25,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
  }
  for(const b of cinderBlasts){
    const f=b.t/b.life;
    for(let j=0;j<6;j++){const a=j*Math.PI/3;drawFlame(ctx,b.x+Math.cos(a)*K.CINDER_BLAST_R*f,b.y+Math.sin(a)*K.CINDER_BLAST_R*f+30,85*(1-f)+35,frame*0.6+j,1-f);}
  }

  // ---- FIRE DEMONS: vent-bred (orange, persistent) and TOWN wraiths (ashen-violet, persistent, dash to kill)
  for(const d of demons){
    const town = d.source === 'town';
    wrapDraw(d.x, X=>{
      const gr=(town?K.DEMON_R*2.15:K.DEMON_R*1.7)+3*Math.sin(frame*0.4+(d.ph||0)), g=ctx.createRadialGradient(X,d.y,2,X,d.y,gr);
      if(town){ g.addColorStop(0,'rgba(198,128,190,0.72)'); g.addColorStop(0.6,'rgba(150,95,155,0.30)'); g.addColorStop(1,'rgba(140,90,140,0)'); }
      else { g.addColorStop(0,'rgba(255,120,40,0.6)'); g.addColorStop(1,'rgba(255,90,30,0)'); }
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,d.y,gr,0,7); ctx.fill();
      groundShadow(ctx, X, d.y+K.DEMON_R*1.2, K.DEMON_R*1.0, K.DEMON_R*0.34);
      const flip = (d.tgt ? d.tgt.x<d.x : player.x<d.x);
      ctx.globalAlpha = (!player.venting && !town && d.source!=='vent') ? Math.min(1, (d.ttl||0)/0.6) : (town?0.94:1);   // vent-demon collapse fade
      if(!drawAnim(ctx,'firedemon', X, d.y, K.DEMON_R*3.2, {fps:12, flip}) &&
         !drawSpr(ctx,'firedemon', X, d.y, K.DEMON_R*3.0, {flip})){
        ctx.fillStyle= town?'#b06a8a':'#ff5a2e'; ctx.beginPath(); ctx.arc(X,d.y,K.DEMON_R,0,7); ctx.fill(); }
      ctx.globalAlpha = 1;
    });
  }

  // ---- ARSON IMPS: Keith's fire messengers + a telegraph to their mark, so you can read the threat and cut it off
  for(const a of arson){
    // telegraph: a faint dashed FUSE LINE to the mark (a line, not a ring) + a warning GLOW on the villager
    if(a.tgt){
      const pulse = 0.5 + 0.3*Math.sin(frame*0.3 + (a.ph||0));
      ctx.save();
      ctx.globalAlpha = (a.warn>0 ? 0.28 : 0.5) * pulse;
      ctx.strokeStyle = '#ff7a4d'; ctx.lineWidth = 2; ctx.setLineDash([6,8]); ctx.lineDashOffset = -frame*0.6;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(a.tgt.x, a.tgt.y); ctx.stroke();
      ctx.setLineDash([]); ctx.restore();
      const tr = K.R_CELL+11, tg = ctx.createRadialGradient(a.tgt.x,a.tgt.y,1,a.tgt.x,a.tgt.y,tr);
      const ta = (0.34*pulse+0.12).toFixed(3);
      tg.addColorStop(0,'rgba(255,80,50,'+ta+')'); tg.addColorStop(0.6,'rgba(255,80,50,'+(ta*0.5).toFixed(3)+')'); tg.addColorStop(1,'rgba(255,80,50,0)');
      ctx.fillStyle=tg; ctx.beginPath(); ctx.arc(a.tgt.x,a.tgt.y,tr,0,7); ctx.fill();
    }
    wrapDraw(a.x, X=>{
      const R = K.ARSON_R;
      const gr = R*1.9 + 3*Math.sin(frame*0.5+(a.ph||0)), g = ctx.createRadialGradient(X,a.y,1,X,a.y,gr);
      g.addColorStop(0,'rgba(255,150,60,0.7)'); g.addColorStop(1,'rgba(255,80,30,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,a.y,gr,0,7); ctx.fill();
      const flip = (a.tgt ? a.tgt.x<a.x : player.x<a.x);
      const bob = a.warn>0 ? 2*Math.sin(frame*0.4+(a.ph||0)) : 0;   // hover-bob during the telegraph
      if(!drawAnim(ctx,'firedemon', X, a.y+bob, R*2.5, {fps:14, flip}) &&
         !drawSpr(ctx,'firedemon', X, a.y+bob, R*2.4, {flip})){
        ctx.fillStyle='#ff7a3a'; ctx.beginPath(); ctx.arc(X,a.y+bob,R*0.9,0,7); ctx.fill(); }
    });
  }

  // ---- rings -> soft GLOW POPS: a bloom of light that expands and fades. No hard stroked circles.
  for(const r of rings){
    const k = r.t/r.life, rr = r.r0 + (r.r1-r.r0)*k, a = (1-k)*(1-k), rgb = hexRGB(r.col);
    wrapDraw(r.x, X=>{
      const g = ctx.createRadialGradient(X, r.y, 0, X, r.y, Math.max(1,rr));
      g.addColorStop(0,   'rgba('+rgb+','+(0.45*a).toFixed(3)+')');
      g.addColorStop(0.55,'rgba('+rgb+','+(0.22*a).toFixed(3)+')');
      g.addColorStop(1,   'rgba('+rgb+',0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X, r.y, Math.max(1,rr), 0, 7); ctx.fill();
    });
  }

  // ---- absorb-flourish sparks: fire streaming into you
  for(const s of sparks){ const k=s.t/s.life, a=1-k, rr=4.6*(1-0.45*k);
    wrapDraw(s.x, X=>{
      const g=ctx.createRadialGradient(X,s.y,0,X,s.y,rr*2.6);
      g.addColorStop(0,'rgba(255,190,110,'+(0.85*a).toFixed(2)+')'); g.addColorStop(1,'rgba(255,110,30,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X,s.y,rr*2.6,0,7); ctx.fill();
      ctx.fillStyle='rgba(255,244,196,'+(0.9*a).toFixed(2)+')'; ctx.beginPath(); ctx.arc(X,s.y,rr*0.6,0,7); ctx.fill();
    }); }

  // ---- powerups (fused walls)
  for(const pu of powerups){ wrapDraw(pu.x, X=> SK.powerup(ctx, X, pu.y, pu)); }

  // ---- player (+ surge aura)
  if(surgeT > 0){ wrapDraw(p.x, X=>{
    const ar = p.r+22+Math.sin(frame*0.3)*4, aa = 0.34*(0.6+0.4*Math.sin(frame*0.4));
    const ag = ctx.createRadialGradient(X,p.y,p.r*0.5,X,p.y,ar);
    ag.addColorStop(0,'rgba(255,225,140,0)'); ag.addColorStop(0.6,'rgba(255,225,140,'+(aa*0.6).toFixed(3)+')'); ag.addColorStop(1,'rgba(255,210,110,0)');
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

  // ---- Keith's callout (fires read / snuffed / broken / the opening premise)
  if(callout){
    const a = Math.max(0, Math.min(1, (1 - callout.t/callout.life)*1.4));
    ctx.globalAlpha = a;
    ctx.textAlign = 'center';
    if(callout.lore){                                    // Keith, telling you why — dialogue, not HUD
      ctx.font = 'italic 600 25px "Pixelify",system-ui,sans-serif';
      ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(7,7,11,0.9)';
      ctx.strokeText('“'+callout.text+'”', VW/2, VH*0.29);
      ctx.fillStyle = '#ff9dbd'; ctx.fillText('“'+callout.text+'”', VW/2, VH*0.29);
      ctx.font = '700 16px "Pixelify",system-ui,sans-serif'; ctx.lineWidth = 4;
      ctx.strokeText('— KEITH', VW/2, VH*0.29 + 28);
      ctx.fillStyle = 'rgba(255,157,189,0.75)'; ctx.fillText('— KEITH', VW/2, VH*0.29 + 28);
    } else {
      ctx.fillStyle = callout.good === true ? '#7fe8ff' : callout.good === false ? '#ff5d94' : '#dfe6f2';
      const big = callout.good !== null;
      ctx.font = (big ? '800 33px' : '500 26px') + ' "Pixelify",system-ui,sans-serif';
      ctx.fillText(callout.text, VW/2, 265);
    }
    ctx.globalAlpha = 1;
  }

  // ---- HUD (clean: hearts for health, gold score, one-line objective; hidden on title/intro/over)
  const hudOn = mode === 'play' && !onTitle && introT <= 0 && (!intro || intro.phase==='talk');
  if(hudOn){
    // A dark backing separates live values from the busy town artwork.
    const hudShade=ctx.createLinearGradient(0,0,0,244);
    hudShade.addColorStop(0,'rgba(9,8,15,0.94)');hudShade.addColorStop(0.88,'rgba(9,8,15,0.87)');hudShade.addColorStop(1,'rgba(9,8,15,0)');
    ctx.fillStyle=hudShade;ctx.fillRect(0,0,VW,244);
    ctx.textAlign='right';ctx.fillStyle='#ffcf80';ctx.font='800 27px "Pixelify",system-ui,sans-serif';
    ctx.fillText('SCORE '+score,VW-24,38);
    // HEALTH — a row of Makko hearts, top-left (count scales with maxHearts). Fire burns them down; clear, they refill.
    { const n=maxHearts, hs=Math.min(38, Math.floor((VW*0.44)/n)-2), gap=2, hxx=24, hyy=12, hp=Math.max(0,Math.min(1,player.hp)), low=hp<0.3;
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
    // Currency feedback sits away from heat/Edge and the mobile vent target.
    ctx.save();ctx.textAlign='left';ctx.fillStyle='#ffcf80';ctx.font='800 25px "Pixelify",system-ui,sans-serif';
    panel(ctx,18,VH-153,430,72,10,'rgba(9,8,15,0.9)',null);
    ctx.fillStyle='#ffcf80';
    ctx.fillText('RUN +'+runEmbers+' EMBERS',30,VH-125);
    const liveGoal=upgradeGoal();ctx.font='500 21px "Pixelify",system-ui,sans-serif';ctx.fillStyle='#dfd8c9';
    if(liveGoal)ctx.fillText(liveGoal.name+' · '+Math.floor(goalAmount(liveGoal))+' / '+liveGoal.cost,30,VH-97);
    if(rescueReward){
      ctx.textAlign='center';ctx.font='800 29px "Pixelify",system-ui,sans-serif';ctx.fillStyle='#b0ffd8';
      panel(ctx,140,300,VW-280,53,10,'rgba(9,19,18,0.95)',null);
      ctx.fillStyle='#b0ffd8';
      ctx.fillText(rescueReward.count+' RESCUED · +'+rescueReward.embers+' EMBERS',VW/2,335);
    }
    ctx.restore();
    if(player.ventUnit){
      const u=player.ventUnit,bw=300,bx=(VW-bw)/2,by=VH-225;
      ctx.save();ctx.fillStyle='rgba(9,8,15,0.9)';ctx.fillRect(bx-14,by-39,bw+28,64);
      ctx.textAlign='center';ctx.font='700 23px "Pixelify",system-ui,sans-serif';ctx.fillStyle='#ffe0a2';
      ctx.fillText((u.kind==='heat'?'VENT 1 HEAT':'HEAL 1 HEART')+(player.ventHeld?' · HOLD':' · FINISHING'),VW/2,by-12);
      ctx.fillStyle='#45343a';ctx.fillRect(bx,by,bw,10);ctx.fillStyle='#ffb34f';ctx.fillRect(bx,by,bw*Math.min(1,u.t/u.duration),10);ctx.restore();
    }
    // DASH charges (bottom-left) — Makko ember pips. Empty = dark socket; recharging one FILLS UP
    // bottom-to-top with a shimmer; a finished charge pops with a flourish ring.
    { const n=RUN_MAX_CHARGES, ps=32, gap=8, x0=26, yy=VH-56;
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
    // VENT = hold-to-HEAL: button on mobile; SPACE reminder on desktop. Pulses when your hearts are low.
    if(isTouch) drawVentButton(ctx);
    else if(player.hp < 0.999 || player.heat > 0){
      const low = player.hp < 0.4;
      ctx.textAlign='center'; ctx.globalAlpha = low ? (0.7+0.3*Math.sin(frame*0.5)) : 0.75;
      ctx.fillStyle = low ? '#8affc1' : 'rgba(255,175,110,0.9)'; ctx.font='700 22px "Pixelify",system-ui,sans-serif';
      ctx.fillText('HOLD SPACE — HEAL (fire comes)', VW/2, VH-254); ctx.globalAlpha=1;
    }
  }

  if(!hinted && mode === 'play' && introT <= 0 && !intro){
    ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.36)';
    ctx.font = '500 21px "Pixelify",system-ui,sans-serif';
    ctx.fillText(isTouch ? 'SWIPE anywhere to dash   ·   tap VENT to blast fire off'
                         : 'AUTO-RUN · WASD steer · SHIFT dash · SPACE / VENT button', VW/2, VH-186);
  }

  // ---- LIVE intro dialogue box (Keith narrates over gameplay)
  drawDialogue(ctx);

  // ---- legacy premise preview only; first play uses live dialogue instead.
  if(introT > 0 && introKind === 'premise'){
    ctx.fillStyle = 'rgba(7,7,11,0.82)'; ctx.fillRect(0,0,VW,VH);
    ctx.textAlign = 'center';
    if(!drawTextFit(ctx, 'YOU WOKE IN THE FIRE.', VW/2, VH*0.155, 46, VW*0.92)){
      ctx.fillStyle = '#ffb04d'; ctx.font = '800 48px "Pixelify",system-ui,sans-serif';
      ctx.fillText('YOU WOKE IN THE FIRE.', VW/2, VH*0.165); }
    ctx.fillStyle = '#e7ecf5'; ctx.font = '500 23px "Pixelify",system-ui,sans-serif';
    STORY.premise.forEach((ln,i)=> ctx.fillText(ln, VW/2, VH*0.20 + 66 + i*40));
    if(!drawTextFit(ctx, "DON'T END UP A WALL.", VW/2, VH*0.20 + 66 + STORY.premise.length*40 + 42, 34, VW*0.92)){
      ctx.fillStyle = '#fff'; ctx.font = '800 36px "Pixelify",system-ui,sans-serif';
      ctx.fillText("DON'T END UP A WALL.", VW/2, VH*0.20 + 66 + STORY.premise.length*40 + 52); }
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '500 20px "Pixelify",system-ui,sans-serif';
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
      ctx.fillStyle = '#c9a8b8'; ctx.font = '600 21px "Pixelify",system-ui,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('your most-passed spot', g.x, g.y - pr - 14);
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff5d94'; ctx.font = '800 42px "Pixelify",system-ui,sans-serif';
    ctx.fillText(greetC.big, VW/2, VH*0.28);
    ctx.fillStyle = '#e7ecf5'; ctx.font = '500 24px "Pixelify",system-ui,sans-serif';
    greetC.sub.forEach((ln,i)=> ctx.fillText(ln, VW/2, VH*0.28 + 42 + i*32));
    ctx.fillStyle = 'rgba(255,255,255,0.42)'; ctx.font = '500 20px "Pixelify",system-ui,sans-serif';
    ctx.fillText('tap to begin', VW/2, VH*0.72);
    }
  }

  if(flash > 0){ ctx.fillStyle = 'rgba(255,255,255,0.24)'; ctx.fillRect(0,0,VW,VH); }

  if(mode === 'over')drawRunResults(ctx);
}

function fmt(s){ const m = Math.floor(s/60), r = Math.floor(s%60); return m+':'+String(r).padStart(2,'0'); }
