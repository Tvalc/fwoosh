/*
 * Makko UI integration layer.
 *
 * Makko owns the pixels. The engine owns placement, sizing, input state and
 * the small amount of feedback that makes a control feel alive. This module
 * keeps those jobs separate so new UI exports can land without rewriting the
 * screens that use them.
 */
const UI_ART_KEYS = Object.freeze({
  panel: 'panel',
  card: 'card',
  button: 'button',
  buttonPrimary: 'button_primary',
  buttonSecondary: 'button_secondary',
  buttonDanger: 'button_danger',
  vent: 'vent',
  badge: 'badge',
  dialogue: 'dialogue',
  diary: 'diary',
  chronicle: 'chronicle',
  judgment: 'judgment'
});

const UI_TOUCH_MIN = 48;
const UI_ART_MISSING = Object.create(null);

function uiImages(){
  // Keep this safe while the art bundle is being produced. Cursor can add
  // MAKKO_UI_IMG in media.js without requiring a second renderer change.
  return (typeof MAKKO_UI_IMG !== 'undefined' && MAKKO_UI_IMG) || {};
}

function uiMeta(){
  return (typeof MAKKO_UI_META !== 'undefined' && MAKKO_UI_META) || {};
}

function uiImage(key,state){
  const images=uiImages();
  const legacy=(typeof MAKKO_IMG!=='undefined' && MAKKO_IMG) || {};
  const candidates=[];
  if(state) candidates.push(key+'_'+state);
  candidates.push(key);
  for(const candidate of candidates){
    for(const source of [images,legacy]){
      const im=source[candidate]||source['ui_'+candidate];
      if(im && im.complete && (im.naturalWidth||im.width)) return {key:candidate,image:im};
    }
  }
  return null;
}

function uiAssetReady(key,state){ return !!uiImage(key,state); }

function uiMissing(key,where){
  const id=key+'@'+(where||'unknown');
  if(UI_ART_MISSING[id]) return;
  UI_ART_MISSING[id]=true;
  // Missing Makko art is expected while Cursor is exporting. Do not spam the
  // console every frame, but leave a useful breadcrumb for integration QA.
  if(typeof console!=='undefined' && console.debug) console.debug('[FWOOSH] Makko UI art pending:',key,where||'');
}

function uiSliceBounds(key,im){
  const meta=uiMeta()[key]||{};
  const naturalW=im.naturalWidth||im.width||1;
  const naturalH=im.naturalHeight||im.height||1;
  return {
    left:Math.max(0,Math.min(naturalW,meta.left??Math.round(naturalW*0.22))),
    right:Math.max(0,Math.min(naturalW,meta.right??Math.round(naturalW*0.22))),
    top:Math.max(0,Math.min(naturalH,meta.top??Math.round(naturalH*0.22))),
    bottom:Math.max(0,Math.min(naturalH,meta.bottom??Math.round(naturalH*0.22)))
  };
}

function uiNineSlice(ctx,im,key,x,y,w,h,opts){
  opts=opts||{};
  const sw=im.naturalWidth||im.width, sh=im.naturalHeight||im.height;
  if(!sw||!sh||w<=0||h<=0) return false;
  const b=uiSliceBounds(key,im);
  const minW=b.left+b.right, minH=b.top+b.bottom;
  if(w<minW || h<minH){
    ctx.drawImage(im,x,y,w,h);
    return true;
  }
  const sx=[0,b.left,sw-b.right,sw], sy=[0,b.top,sh-b.bottom,sh];
  const dx=[x,x+b.left,x+w-b.right,x+w], dy=[y,y+b.top,y+h-b.bottom,y+h];
  for(let row=0;row<3;row++) for(let col=0;col<3;col++){
    const dw=dx[col+1]-dx[col], dh=dy[row+1]-dy[row];
    if(dw>0&&dh>0) ctx.drawImage(im,sx[col],sy[row],sx[col+1]-sx[col],sy[row+1]-sy[row],dx[col],dy[row],dw,dh);
  }
  if(opts.alpha!=null) ctx.globalAlpha=1;
  return true;
}

function uiDrawSurface(ctx,key,x,y,w,h,opts){
  opts=opts||{};
  const found=uiImage(key,opts.state);
  if(!found){ if(!opts.quiet) uiMissing(key,opts.where); return false; }
  ctx.save();
  if(opts.alpha!=null) ctx.globalAlpha=opts.alpha;
  if(opts.tint){ ctx.globalCompositeOperation='source-atop'; }
  uiNineSlice(ctx,found.image,found.key,x,y,w,h,opts);
  ctx.restore();
  return true;
}

function uiDrawButton(ctx,key,x,y,w,h,state,opts){
  opts=Object.assign({},opts||{}, {state:state||'idle'});
  return uiDrawSurface(ctx,key,x,y,w,h,opts) || uiDrawSurface(ctx,'button',x,y,w,h,opts);
}

function uiTouchRect(x,y,w,h){
  const pad=Math.max(0,(UI_TOUCH_MIN-Math.min(w,h))/2);
  return {x:x-pad,y:y-pad,w:w+pad*2,h:h+pad*2};
}
