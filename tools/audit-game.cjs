/* Run actual game scripts in an isolated VM with in-memory saves and a stubbed canvas.
 * This validates game state plus a few targeted draw-operation regressions, not visual
 * quality, audio, browser input dispatch, or balance.
 * Usage: node tools/audit-game.cjs [game-folder] [report.json]
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].flatMap(m => {
  const src = /\bsrc=["']([^"']+)["']/.exec(m[1]);
  if (src && /^https?:/.test(src[1])) return []; // External SDK is not exercised here.
  const filename = src ? src[1].split('?')[0] : 'index.html:inline';
  return [{filename, code: src ? fs.readFileSync(path.join(root, filename), 'utf8') : m[2]}];
});
function game(saved = {}, options = {}) {
  const storage = new Map(Object.entries(saved));
  const noop = () => {};
  const drawnText = [];
  const drawnImages = [];
  const strokedArcs = [];
  let pathArcs = [];
  const listeners = {};
  const listen = (type, fn) => (listeners[type] ||= []).push(fn);
  const gradient = () => ({addColorStop: noop});
  const context2d = new Proxy({setTransform: noop, fillText: text => drawnText.push(String(text)),
    drawImage: (image,...args) => drawnImages.push({src:image.src,args}),
    beginPath: () => { pathArcs = []; }, arc: (...args) => pathArcs.push(args),
    stroke: () => { strokedArcs.push(...pathArcs); },
    createRadialGradient: gradient, createLinearGradient: gradient,
    measureText: text => ({width:String(text).length*10})}, {get: (o, k) => o[k] || noop});
  const canvas = {style: {}, getContext: () => context2d, addEventListener: listen,
    getBoundingClientRect: () => ({left: 0, top: 0})};
  const box = {console, URLSearchParams, location: {search: ''}, navigator: {maxTouchPoints: 0},
    localStorage: {getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => {if(options.blockRetiredRemoval && ["fwoosh.meta","fwoosh.opp"].includes(k))throw Error("storage blocked");storage.delete(k);}},
    document: {hidden: false, getElementById: () => canvas, createElement: () => canvas},
    Image: class {constructor(){this.complete=false; this.naturalWidth=0; this.width=0; this.height=0;}},
    requestAnimationFrame: noop, setTimeout: noop, clearTimeout: noop,
    innerWidth: 720, innerHeight: 1280, devicePixelRatio: 1, addEventListener: listen};
  box.window = box;
  const ctx = vm.createContext(box);
  for (const s of scripts) vm.runInContext(s.code, ctx, {filename:s.filename, timeout: 10000});
  return {run: code => vm.runInContext(code, ctx, {timeout: 10000}), storage, drawnText, drawnImages, strokedArcs, dispatch(type, fields={}){ for(const fn of listeners[type]||[]) fn({preventDefault:noop, ...fields}); }};
}
const results = [];
function test(name, fn) {try {const detail = fn(); results.push({name, status:'pass', detail: detail ?? null});}
  catch(e){results.push({name, status:'fail', detail:e.message});}}
test('Boot initializes title and a valid first run', () => {
  const g=game(); assert.equal(g.run('onTitle'), true); assert.equal(g.run('runDistrict'),1);
  assert.equal(g.run('player.charges'),3); assert.equal(g.run('maxHearts'),5);
});
test('Five districts set rescue quotas and cumulative boss moves', () => {
  const g=game(); const details=[];
  for(let n=1;n<=5;n++){
    g.run(`selDistrict=${n}; reset(100); onTitle=false; intro=null; startDuel()`);
    assert.equal(g.run('runQuota'),12+(n-1)*2); assert.equal(g.run('boss.level'),n);
    assert.equal(g.run('boss.moves.length'),n);
    details.push(g.run('({district:runDistrict, quota:runQuota, moves:boss.moves.slice(), heatToWin:boss.dumpNeeded})'));
  }
  return details;
});
test('Wins unlock districts 2–5 and bank the district-scaled bounty', () => {
  const g=game();
  for(let n=1;n<=4;n++){
    const before=g.run('META.embers');
    g.run(`selDistrict=${n}; reset(100); onTitle=false; intro=null; startDuel(); winDuel()`);
    assert.equal(g.run('META.district'),n+1); assert.equal(g.run('META.embers')-before,25*n);
  }
  const reloaded=game(Object.fromEntries(g.storage)); assert.equal(reloaded.run('META.district'),5);
  assert.equal(reloaded.run('META.embers'),250);
});
test('Replaying an earlier district does not skip unlocks', () => {
  const g=game(); g.run('META.district=4; selDistrict=1; reset(); startDuel(); winDuel()');
  assert.equal(g.run('META.district'),4);
});
test('The fifth district has a persistent completion record', () => {
  const g=game(); g.run('META.district=5; selDistrict=5; reset(); startDuel(); winDuel()');
  const reload=game(Object.fromEntries(g.storage));
  reload.run('drawShrineSheet(ctx)');
  assert.ok(reload.drawnText.includes('5 / 5'),'After winning district 5 and reloading, Shrine displays '+reload.drawnText.find(t=>t.endsWith(' / 5'))+' instead of 5 / 5.');
});
test('A first run crossing both milestones raises both buildings', () => {
  const g=game(); g.run('META.saved=16; enterHub()');
  assert.equal(g.run('META.buildings.well.built'),true);
  assert.equal(g.run('META.buildings.forge.built'),true,'At 16 saves, first hub visit raises Well but leaves Forge locked until another visit.');
});
test('Separate visits raise Well at 6 and Forge at 16', () => {
  const g=game(); g.run('META.saved=6; enterHub()'); assert.equal(g.run('META.buildings.well.built'),true);
  g.run('META.saved=16; enterHub()'); assert.equal(g.run('META.buildings.forge.built'),true);
});
test('Upgrade prices, limits, and persistence survive reload', () => {
  const g=game(); g.run('META.embers=1000; META.buildings.well.built=true; buy("well","hearts"); buy("well","hearts"); buy("well","hearts"); buy("well","hearts")');
  assert.equal(g.run('META.embers'),120); assert.equal(g.run('maxHearts'),8);
  const reload=game(Object.fromEntries(g.storage)); assert.equal(reload.run('maxHearts'),8);
  assert.equal(reload.run('META.embers'),120);
});
test('Unaffordable purchase does not spend embers or grant an upgrade', () => {
  const g=game(); g.run('META.embers=10; META.buildings.well.built=true; buy("well","hearts")');
  assert.equal(g.run('META.embers'),10); assert.equal(g.run('maxHearts'),5);
});
test('Forge upgrades increase dash capacity and reduce recharge time', () => {
  const g=game(); g.run('META.embers=1000; META.buildings.forge.built=true; buy("forge","charges"); buy("forge","recharge"); reset()');
  assert.equal(g.run('player.charges'),4);
  assert.ok(g.run('RUN_CHARGE_REFILL < K.CHARGE_REFILL'));
});
test('Rescue counts persist; earned embers bank at run end', () => {
  const g=game(); g.run('onTitle=false; intro=null; player.heat=0; saveCell(cells[0], false)');
  assert.equal(g.run('META.saved'),1); assert.ok(g.run('runEmbers')>0);
  const earned=g.run('runEmbers'); assert.equal(g.run('META.embers'),0);
  g.run('pop("audit")'); const reload=game(Object.fromEntries(g.storage));
  assert.equal(reload.run('META.saved'),1); assert.equal(reload.run('META.embers'),earned+g.run('runStarterBonus'));assert.equal(g.run('runEmbers'),earned);
});
test('Lifetime earnings count losses and wins once, excluding the starter grant',()=>{
 const g=game();g.run('runEmbers=7;pop("audit");foldOpp();pop("duplicate")');
 assert.equal(g.run('META.emberLedger.earned'),7);
 assert.equal(g.run('META.embers'),20);
 g.run('reset();runEmbers=12;startDuel();winDuel();winDuel();foldOpp()');
 assert.equal(g.run('META.emberLedger.earned'),44);
 const reloaded=game(Object.fromEntries(g.storage));
 assert.equal(reloaded.run('META.emberLedger.earned'),44);
 assert.equal(reloaded.run('META.emberLedger.historyComplete'),true);
});

test('Purchases and construction never reduce lifetime earned credit',()=>{
 const g=game();g.run('runEmbers=1000;pop("audit");enterHub();buy("well","hearts");cityOpen();cityPlaceBuilding("burrow",1,4)');
 // The shop and city spend from the wallet, not the Invoice record.
 assert.equal(g.run('META.embers'),860);assert.equal(g.run('cityData().buildings.length'),1);
 assert.equal(g.run('META.emberLedger.earned'),1000);
 g.run('saveMeta()');const reloaded=game(Object.fromEntries(g.storage));
 assert.equal(reloaded.run('META.emberLedger.earned'),1000);
});


test('Lifetime credit survives rolling run history and rejects malformed ledger totals',()=>{
 const g=game();g.run('for(let i=0;i<25;i++){reset();runEmbers=10;pop("audit");}');
 assert.equal(g.run('META.recentRuns.length'),20);
 assert.equal(g.run('META.emberLedger.earned'),250);
 const bad=game({'fwoosh.save2.meta':JSON.stringify({v:1,embers:45,emberLedger:{v:1,earned:-5,historyComplete:true},recentRuns:[null,{earned:-20},{earned:"bad"}]})});
 assert.equal(bad.run('META.emberLedger.earned'),0);
 assert.equal(bad.run('META.emberLedger.historyComplete'),false);
});

test('Invoice earning record appears only after the restoration hearing and flags damaged data',()=>{
 const g=game();g.run('drawShrineSheet(ctx)');
 assert.ok(!g.drawnText.some(t=>t.startsWith('INVOICE RECORD')));
 g.run('META.judgment.heard=true;META.emberLedger={v:1,earned:600,historyComplete:false};drawShrineSheet(ctx)');
 assert.ok(g.drawnText.includes('INVOICE RECORD · AT LEAST 600 EMBERS EARNED'));
 assert.ok(g.drawnText.includes('Spending on the Ratkin does not reduce this total.'));
 assert.ok(g.drawnText.includes('The earnings record is damaged; this total may be incomplete.'));
});

test('Repeated game-over dispatch does not bank the same loss twice', () => {
  const g=game(); g.run('runEmbers=20; pop("audit")'); const once=g.run('META.embers');
  g.run('pop("audit")'); assert.equal(g.run('META.embers'),once);
});
test('Repeated win dispatch pays the bounty and records the win only once', () => {
  const g=game(); g.run('selDistrict=5; reset(); runEmbers=20; startDuel(); winDuel(); winDuel()');
  assert.equal(g.run('META.embers'),145); assert.equal(g.run('runEmbers'),145);
  assert.equal(g.run('opp.runs'),1); assert.equal(g.run('opp.duelWins'),1);
});
test('A late loss event cannot replace a settled win', () => {
  const g=game();g.run('startDuel(); winDuel(); pop("late damage")');
  assert.equal(g.run('won'),true);assert.equal(g.run('popCause'),'he yielded');
  assert.equal(g.run('META.embers'),25);assert.equal(g.run('opp.runs'),1);
});
test('A late win event cannot replace a settled loss', () => {
  const g=game();g.run('runEmbers=20; pop("audit loss"); winDuel()');
  assert.equal(g.run('won'),false);assert.equal(g.run('popCause'),'audit loss');
  assert.equal(g.run('META.embers'),20);assert.equal(g.run('opp.duelWins'),0);
  assert.equal(g.run('META.district'),1);
});
test('A new run can bank normally after an earlier settled run', () => {
  const g=game();g.run('runEmbers=20; pop("first"); reset(); runEmbers=30; pop("second")');
  assert.equal(g.run('META.embers'),50);assert.equal(g.run('opp.runs'),2);
});
test('Direct duplicate banking cannot alter rewards or opponent history', () => {
  const g=game();g.run('runEmbers=20; pop("audit"); foldOpp(); foldOpp()');
  assert.equal(g.run('META.embers'),20);assert.equal(g.run('opp.runs'),1);
});
test('Unlocking both buildings gives one accurate combined message and persists', () => {
  const g=game();g.run('META.saved=16; enterHub()');
  assert.match(g.run('hubToastMsg'),/WELL.*FORGE.*STAND AGAIN/);
  const reload=game(Object.fromEntries(g.storage));
  assert.equal(reload.run('META.buildings.well.built'),true);
  assert.equal(reload.run('META.buildings.forge.built'),true);
});
test('A lethal demon bite while carrying heat settles a run exactly once', () => {
  const g=game();
  g.run('onTitle=false; intro=null; introT=0; runEmbers=20; player.heat=1; player.hp=0.001; player.x=360; player.y=1100; demons=[{x:360,y:1100,t:1,ttl:2.5,hitCd:0,huntVill:false,ph:0}]; step()');
  assert.equal(g.run('mode'),'over');
  assert.equal(g.run('META.embers'),20,'One simulation step with a lethal demon bite plus heat banks '+g.run('META.embers')+' embers instead of 20.');
  assert.equal(g.run('opp.runs'),1);
});
test('Diary reading neither pays currency nor changes rescue count', () => {
  const g=game(); g.run('diaryMarkRead("morning")');
  assert.equal(g.run('META.embers'),0); assert.equal(g.run('META.saved'),0);
  const reload=game(Object.fromEntries(g.storage)); assert.equal(reload.run('diaryIsRead("morning")'),true);
});
test('Missing or invalid JSON saves start safely', () => {
  const g=game({'fwoosh.save2.meta':'{bad','fwoosh.save2.opp':'not-json'});
  assert.equal(g.run('META.district'),1); assert.equal(g.run('maxHearts'),5);
});
test('A partial v1 meta save retains progress and receives building defaults', () => {
  const g=game({'fwoosh.save2.meta':JSON.stringify({v:1,embers:123,saved:8})});
  assert.equal(g.run('META.embers'),123); assert.equal(g.run('META.saved'),8);
  assert.equal(g.run('META.buildings.forge.charges'),0);
});
test('Current partial saves never infer district clears from unlocks', () => {
  for(let district=1;district<=5;district++){
    const old={v:1,embers:317,saved:55,bestBlaze:3,district,
      buildings:{well:{built:true,hearts:2,regen:1},forge:{built:true,charges:1,recharge:1}},
      diary:{read:['morning','gate']},hero:'stranger',flags:{reachedDuel:true}};
    const g=game({'fwoosh.save2.meta':JSON.stringify(old)});
    assert.equal(g.run('META.clearedDistricts'),0);
    assert.equal(g.run('META.district'),district);assert.equal(g.run('META.embers'),317);
    assert.equal(g.run('META.saved'),55);assert.equal(g.run('maxHearts'),7);
    assert.equal(g.run('RUN_MAX_CHARGES'),4);assert.equal(g.run('META.diary.read.join(",")'),'morning,gate');
    assert.equal(g.run('META.flags.reachedDuel'),true);
    g.run('saveMeta()');const reloaded=game(Object.fromEntries(g.storage));
    assert.equal(reloaded.run('META.clearedDistricts'),0);
  }
});
test('Opponent win history does not replace explicit district completion', () => {
  const g=game({'fwoosh.save2.meta':JSON.stringify({v:1,district:5}),
    'fwoosh.save2.opp':JSON.stringify({terr:Array(48).fill(0),lat:[],runs:30,duelWins:25})});
  assert.equal(g.run('META.clearedDistricts'),0);
  assert.equal(g.run('opp.duelWins'),25);
});
test('Replaying after final completion never reduces the saved count', () => {
  const g=game();g.run('selDistrict=5; reset(); startDuel(); winDuel(); selDistrict=1; reset(); startDuel(); winDuel()');
  const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.clearedDistricts'),5);
  reload.run('drawShrineSheet(ctx)');assert.ok(reload.drawnText.includes('5 / 5'));
});
test('Each consecutive district win advances the completion count exactly once', () => {
  const g=game();
  for(let n=1;n<=5;n++){
    g.run(`selDistrict=${n}; reset(); startDuel(); winDuel()`);
    assert.equal(g.run('META.clearedDistricts'),n);
    assert.equal(g.run('META.district'),Math.min(5,n+1));
  }
});
test('Edge advantage leaves a fight; disadvantage remains bounded', () => {
  const g=game(); const detail=[];
  for(const n of [1,5])for(const edge of [-1000,1000]){
    g.run(`selDistrict=${n}; reset(); edge=${edge}; startDuel()`);
    assert.ok(g.run('boss.dumpNeeded > dumped')); assert.ok(g.run('boss.dumpNeeded <= 30'));
    detail.push(g.run('({district:runDistrict, edge, dumped, required:boss.dumpNeeded})'));
  } return detail;
});
test('A dash at an idle boundary spends one charge', () => {
  const g=game();g.run('onTitle=false; intro=null; lungeDir(1,0)');
  assert.equal(g.run('player.venting'),false);assert.equal(g.run('player.charges'),2);
});
test('All five boss move handlers can advance without a simulation exception', () => {
  const g=game();
  for(const move of ['charge','spit','wake','demon','siphon']){
    g.run(`selDistrict=5; reset(100); onTitle=false; intro=null; god=true; startDuel(); boss.state='evade'; startArbiterMove(boss,${JSON.stringify(move)}); for(let i=0;i<360;i++){boss.moveT+=DT; runArbiterMove(boss,DT)}`);
  }
});

test('Canceled touch does not spend a dash charge or leave a held gesture', () => {
  const g=game();g.run('onTitle=false; intro=null; introT=0; player.x=360; player.y=640');
  g.dispatch('pointerdown',{pointerType:'touch',clientX:100,clientY:200});
  g.dispatch('pointercancel');
  assert.equal(g.run('player.charges'),3,'Canceling a gesture incorrectly activates a tap dash');
  assert.equal(g.run('ptr.down || ptr.onVent || player.venting'),false);
});
test('Focus loss cancels a pending tap instead of dashing on a later release', () => {
  const g=game();g.run('onTitle=false; intro=null; introT=0');
  g.dispatch('pointerdown',{pointerType:'mouse',clientX:100,clientY:200});
  g.dispatch('keydown',{key:'w'});g.dispatch('keydown',{key:' '});
  g.dispatch('blur');g.dispatch('pointerup');
  assert.equal(g.run('player.charges'),3);
  assert.equal(g.run('heldVec()'),null);assert.equal(g.run('player.venting'),false);
});
test('Desktop dash waits for vent unit and held keys do not rearm chaining', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;player.heat=2');
  g.dispatch('keydown',{key:'d'});g.dispatch('keydown',{key:' '});
  assert.equal(g.run('player.venting'),true);
  g.dispatch('keydown',{key:'Shift',repeat:false});
  g.dispatch('keydown',{key:'Shift',repeat:true});g.dispatch('keydown',{key:' ',repeat:true});
  assert.equal(g.run('player.charges'),3);assert.equal(g.run('player.venting'),true);
  g.run('ventHold(K.VENT_PURGE)');
  assert.equal(g.run('player.charges'),2);assert.equal(g.run('player.venting'),false);
  assert.equal(g.run('player.heat'),1);assert.equal(g.run('demons.length'),1);
  assert.equal(g.run('player.hx'),1);
  g.dispatch('keyup',{key:'d'});assert.equal(g.run('heldVec()'),null);
});

test('Touch release finishes exactly one unit without spending a dash', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;player.heat=2');
  const pt=g.run('({x:ventBtn().x*scale,y:ventBtn().y*scale})');
  g.dispatch('pointerdown',{pointerType:'touch',clientX:pt.x,clientY:pt.y});
  g.dispatch('pointerup');assert.equal(g.run('player.venting'),true);
  g.run('ventHold(K.VENT_PURGE/2)');assert.equal(g.run('player.heat'),2);
  g.run('ventHold(K.VENT_PURGE/2);ventHold(K.VENT_PURGE)');
  assert.equal(g.run('player.venting'),false);assert.equal(g.run('player.heat'),1);
  assert.equal(g.run('demons.length'),1);assert.equal(g.run('player.charges'),3);
});

test('Touch steering updates before release and spends one dash on release',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0');
 g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:200,clientY:600});
 g.dispatch('pointermove',{pointerType:'touch',pointerId:1,clientX:240,clientY:600});
 assert.ok(g.run('heldVec()[0]')>.99);assert.equal(g.run('player.charges'),3);
 g.dispatch('pointerup',{pointerId:1});assert.equal(g.run('heldVec()'),null);assert.equal(g.run('player.charges'),2);
});
test('Joystick starts anywhere on the gameplay canvas except Vent, including HUD and gutters',()=>{
 for(const [x,y] of [[10,10],[710,300],[360,1260],[160,1160],[360,700]]){
  const g=game();g.run('onTitle=false;intro=null;introT=0');
  g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:x,clientY:y});
  assert.equal(g.run('touchStick.id'),1);assert.equal(g.run('touchStick.cx'),x);assert.equal(g.run('touchStick.cy'),y);
 }
});
test('Trailing joystick center makes reversal a short thumb movement after a long drag',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0');
 g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:100,clientY:600});
 g.dispatch('pointermove',{pointerId:1,clientX:600,clientY:600});assert.ok(g.run('heldVec()[0]')>.99);
 assert.equal(g.run('touchStick.cx'),564);
 g.dispatch('pointermove',{pointerId:1,clientX:550,clientY:600});assert.ok(g.run('heldVec()[0]')<-.99);
});
test('Manual touch defeats auto-target steering until lift, then assistance resumes',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0;god=true;cells=[];demons=[];obstacles=[];player.x=360;player.y=640;player.lunge=0;player.knockT=0;autoRunTarget=()=>({x:100,y:640})');
 g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:200,clientY:600});
 g.dispatch('pointermove',{pointerId:1,clientX:240,clientY:600});g.run('step()');
 assert.ok(g.run('player.hx')>.99);assert.ok(g.run('player.x')>360);
 g.dispatch('pointerup',{pointerId:1});g.run('player.lunge=0;step()');assert.ok(g.run('player.hx')<1);
});
test('Independent Vent touch neither steals steering and releasing steering queues Burst after the committed unit',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0;player.heat=2');
 g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:200,clientY:600});
 g.dispatch('pointermove',{pointerId:1,clientX:240,clientY:600});
 g.dispatch('pointerdown',{pointerType:'touch',pointerId:2,clientX:634,clientY:1176});
 assert.equal(g.run('player.venting'),true);assert.equal(g.run('touchStick.id'),1);assert.equal(g.run('touchVentId'),2);
 g.dispatch('pointerup',{pointerId:1});assert.equal(g.run('player.ventHeld'),false);assert.ok(g.run('player.ventDash'));
 g.dispatch('pointerup',{pointerId:2});assert.equal(g.run('player.ventHeld'),false);
 g.run('ventHold(K.VENT_PURGE)');assert.equal(g.run('player.heat'),1);assert.equal(g.run('player.charges'),2);
});
test('Vent can start first and a second touch still acquires steering anywhere else',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0;player.heat=2');
 g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:634,clientY:1176});
 g.dispatch('pointerdown',{pointerType:'touch',pointerId:2,clientX:680,clientY:800});
 assert.equal(g.run('touchStick.id'),2);assert.equal(g.run('touchVentId'),1);
 g.dispatch('pointercancel',{pointerId:1});assert.equal(g.run('player.ventHeld'),false);assert.equal(g.run('touchStick.id'),2);
});
test('Canceled, resized, unfocused and ended runs release touch ownership without an accidental Burst',()=>{
 for(const action of ['cancel','capture','blur','resize','reset','death','hub','debug']){
  const g=game();g.run('onTitle=false;intro=null;introT=0;player.heat=2');
  g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:200,clientY:600});
  if(action==='cancel')g.dispatch('pointercancel',{pointerId:1});
  else if(action==='capture')g.dispatch('lostpointercapture',{pointerId:1});
  else if(action==='blur'||action==='resize')g.dispatch(action);
  else g.run(({reset:'reset()',death:"pop('test')",hub:'enterHub()',debug:'toggleDebugMenu()'})[action]);
  assert.equal(g.run('touchStick.id'),null,action);assert.equal(g.run('player.charges'),3,action);
  g.dispatch('pointerup',{pointerId:1});assert.equal(g.run('player.charges'),3,action);
 }
});

test('Every upgrade track caps correctly and reload applies the completed build', () => {
  const g=game();g.run('META.saved=100; META.embers=10000; enterHub()');
  let spend=0;
  for(const building of ['well','forge']){
    const tracks=JSON.parse(g.run(`JSON.stringify(SHOPS.${building}.items)`));
    for(const item of tracks){
      spend+=item.costs.reduce((a,b)=>a+b,0);
      for(let i=0;i<item.costs.length+2;i++)g.run(`buy('${building}','${item.track}')`);
      assert.equal(g.run(`META.buildings.${building}.${item.track}`),item.costs.length);
    }
  }
  const reload=game(Object.fromEntries(g.storage));
  assert.equal(reload.run('META.embers'),10000-spend);
  assert.equal(reload.run('maxHearts'),8);assert.equal(reload.run('RUN_MAX_CHARGES'),6);
  assert.equal(reload.run('RUN_HP_REGEN'),g.run('K.HP_REGEN'));
  assert.equal(reload.run('RUN_VENT_HEAL_T'),0.4);
});
test('Khet-Tak-Tor duel keeps valid villagers and a renewable fire source',()=>{
 const g=game();g.run('onTitle=false;intro=null;god=true;cells=[];startDuel()');
 assert.ok(g.run('crowd().length>=K.DUEL_CROWD'),'The duel began with no villagers available for ignition.');
 g.run('boss.state="rising";arsonT=K.DUEL_ARSON_EVERY;step()');assert.ok(g.run('arson.length>0'),'The duel disabled the fire-imp scheduler and left no renewable heat.');
 g.run('arson[0].warn=0;arson[0].x=arson[0].tgt.x;arson[0].y=arson[0].tgt.y;stepArson(DT)');
 assert.ok(g.run('hunters().length>0'),'A missed duel imp did not ignite its target.');
});
test('Duel fire can be intercepted for heat and dumped into Khet-Tak-Tor',()=>{
 const g=game();g.run('onTitle=false;intro=null;cells=[];startDuel();boss.state="idle";const target=crowd()[0];arson=[{x:player.x,y:player.y,tgt:target,t:0,warn:0,ph:0}];stepArson(DT)');
 const heat=g.run('K.ARSON_HEAT');assert.equal(g.run('player.heat'),heat);const before=g.run('dumped');g.run('hitstop=0;boss.x=player.x;boss.y=player.y;step()');assert.equal(g.run('dumped'),before+heat);
});
test('Existing Well recovery purchases become faster committed vent healing', () => {
  const g=game();g.run('onTitle=false;intro=null;META.buildings.well.regen=1;applyUpgrades();player.heat=0;player.hp=0.6;setVentHeld(true)');
  assert.equal(g.run('RUN_VENT_HEAL_T'),0.5);
  assert.equal(g.run('RUN_HP_REGEN'),g.run('K.HP_REGEN'));
  g.run('ventHold(0.49)');assert.equal(g.run('player.hp'),0.6);
  g.run('ventHold(0.01)');assert.equal(g.run('player.hp'),0.8);assert.equal(g.run('demons.length'),1);
  g.run('setVentHeld(false);player.ventUnit=null;player.venting=false;META.buildings.well.regen=2;applyUpgrades();player.hp=0.6;setVentHeld(true);ventHold(0.4)');
  assert.equal(g.run('RUN_VENT_HEAL_T'),0.4);assert.equal(g.run('player.hp'),0.8);assert.equal(g.run('demons.length'),2);
});
test('Five districts complete through rescue quotas and heat-contact combat at base and max upgrades', () => {
  const rows=[];
  for(const upgraded of [false,true]){
    let g=game();
    if(upgraded)g.run('META.buildings.well={built:true,hearts:3,regen:2}; META.buildings.forge={built:true,charges:3,recharge:2}; saveMeta()');
    for(let district=1;district<=5;district++){
      g.run(`selDistrict=${district}; reset(721+${district}); onTitle=false; intro=null; introT=0; god=true`);
      // Deterministic encounter setup: use real rescue/step/contact handlers, never winDuel/winNow.
      g.run('for(let i=0;i<runQuota;i++){ spawnCrowd(true); const c=cells[cells.length-1]; c.hunter=true; saveCell(c,true); } hitstop=0; step()');
      assert.equal(g.run('duelActive'),true,'quota did not start the district duel');
      for(let tries=0;tries<20 && g.run('mode')==='play';tries++){
        g.run('hitstop=0; boss.state="idle"; boss.t=0; boss.move=null; boss.moveCd=2; boss.shield=false; player.x=boss.x=360; player.y=boss.y=1100; player.heat=K.HEAT_MAX; step()');
      }
      assert.equal(g.run('won'),true,`District ${district} cannot finish through heat contact`);
      assert.equal(g.run('META.clearedDistricts'),district);
      const bank=g.run('META.embers'), earned=g.run('runEmbers');
      g.run('enterHub()');g=game(Object.fromEntries(g.storage));
      assert.equal(g.run('META.embers'),bank);assert.equal(g.run('META.district'),Math.min(5,district+1));
      rows.push({district,upgraded,earned,bank});
    }
  }return rows;
});
test('Five-district simulation soak keeps positions, health and economy finite', () => {
  const rows=[];
  for(let district=1;district<=5;district++)for(const seed of [11,42,99]){
    const g=game();g.run(`selDistrict=${district};reset(${seed});onTitle=false;intro=null;introT=0;god=true;startDuel()`);
    g.run('for(let i=0;i<7200;i++){if(i%240===0){player.heat=2;setVentHeld(!player.ventHeld);}if(i%60===0)lungeDir(Math.cos(i),Math.sin(i));step();if(!Number.isFinite(player.x+player.y+player.hp+META.embers+runEmbers))throw Error("non-finite simulation");}');
    assert.ok(g.run('player.charges>=0 && player.charges<=RUN_MAX_CHARGES'));
    rows.push({district,seed,seconds:g.run('elapsed'),mode:g.run('mode')});
  }return rows;
});


test('Winning contact ends the frame before another rescue can change settled rewards', () => {
  const g=game();
  g.run('reset(121);onTitle=false;intro=null;introT=0;god=true;startDuel();boss.state="idle";boss.moveCd=2;player.x=boss.x=360;player.y=boss.y=1100;player.heat=K.HEAT_MAX;dumped=boss.dumpNeeded-1;cells=[];spawnCrowd(true);Object.assign(cells[0],{x:360,y:1100,hunter:true,grace:0,fuse:10});hitstop=0;step()');
  assert.equal(g.run('won'),true);
  assert.equal(g.run('META.embers'),g.run('runEmbers'),'Run-end total changed after currency was already banked');
  const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.saved'),g.run('META.saved'));
});

test('Title boot does not consume the live intro; first start gives control during Khet-Tak-Tor dialogue', () => {
  const g=game();
  assert.notEqual(g.run('opp.introVer'),g.run('INTRO_VERSION'));
  g.run('onDown(360,1100)');
  assert.equal(g.run('intro.phase'),'talk');
  assert.equal(g.run('intro.i'),0);
  assert.equal(g.run('introT'),0);
  g.dispatch('keydown',{key:'d'});
  const x=g.run('player.x');g.run('step()');
  assert.ok(g.run('player.x')>x,'Player must move while Khet-Tak-Tor speaks');
  g.dispatch('keydown',{key:'Shift',repeat:false});
  assert.equal(g.run('player.charges'),2,'Dialogue must not block dashing');
  g.run('player.heat=1');g.dispatch('keydown',{key:' ',repeat:false});
  assert.equal(g.run('player.venting'),true,'Dialogue must not block venting');
});

test('Updated intro replays once for an older save while preserving progression and diary reads', () => {
  const g=game();g.run('META.embers=432;META.district=4;META.clearedDistricts=3;diaryMarkRead("morning");saveMeta();opp.introVer=2;saveOpp()');
  const before=g.storage.get('fwoosh.save2.meta');
  const reload=game(Object.fromEntries(g.storage));
  assert.equal(reload.storage.get('fwoosh.save2.meta'),before);
  reload.run('onDown(360,1100)');
  assert.equal(reload.run('intro.phase'),'talk');
  assert.equal(reload.run('META.embers'),432);
  assert.equal(reload.run('META.district'),4);
  const again=game(Object.fromEntries(reload.storage));again.run('onDown(360,1100)');
  assert.equal(again.run('intro'),null,'Do not replay the opening on every visit');
});

test('Mobile vent HUD remains visible and usable during the live intro', () => {
  const g=game();g.run('onDown(360,1100);isTouch=true;var ventDraws=0;drawVentButton=()=>ventDraws++;render()');
  assert.equal(g.run('ventDraws'),1);
  g.run('player.heat=1;var vb=ventBtn();onDown(vb.x,vb.y)');
  assert.equal(g.run('player.venting'),true);g.run('onUp();ventHold(K.VENT_PURGE)');
  assert.equal(g.run('player.venting'),false);
});


test('Holding chains heat units then full-heart heals, one demon per completed unit', () => {
  const g=game();g.run('onTitle=false;intro=null;player.heat=2;player.hp=0.6;setVentHeld(true)');
  g.run('ventHold(K.VENT_PURGE)');assert.equal(g.run('player.heat'),1);assert.equal(g.run('player.hp'),0.6);
  g.run('ventHold(K.VENT_PURGE)');assert.equal(g.run('player.heat'),0);assert.equal(g.run('player.ventUnit.kind'),'heal');
  g.run('ventHold(K.VENT_HEAL_T/2)');assert.equal(g.run('player.hp'),0.6);
  g.run('ventHold(K.VENT_HEAL_T/2)');assert.equal(g.run('player.hp'),0.8);
  g.run('ventHold(K.VENT_HEAL_T)');assert.equal(g.run('player.hp'),1);
  assert.equal(g.run('demons.length'),4);assert.equal(g.run('player.venting'),false);
  g.run('ventHold(10)');assert.equal(g.run('demons.length'),4);
});
test('Final partial heat and heart still complete one bounded unit; no overheal', () => {
  const g=game();g.run('onTitle=false;intro=null;player.heat=0.5;player.hp=0.95;setVentHeld(true);ventHold(K.VENT_PURGE);ventHold(K.VENT_HEAL_T)');
  assert.equal(g.run('player.heat'),0);assert.equal(g.run('player.hp'),1);
  assert.equal(g.run('demons.length'),2);assert.equal(g.run('player.ventUnit'),null);
});
test('Full health with no heat does not lock or generate enemies', () => {
  const g=game();g.run('onTitle=false;intro=null;setVentHeld(true);ventHold(10)');
  assert.equal(g.run('player.venting'),false);assert.equal(g.run('demons.length'),0);
});
test('A full-heart heal scales correctly after heart upgrades', () => {
  const g=game();g.run('onTitle=false;intro=null;META.buildings.well.hearts=3;applyUpgrades();player.hp=0.5;setVentHeld(true);setVentHeld(false);ventHold(K.VENT_HEAL_T)');
  assert.equal(g.run('player.hp'),0.625);assert.equal(g.run('demons.length'),1);
});
test('Focus loss stops chaining and clears queued dash, but finishes committed unit', () => {
  const g=game();g.run('onTitle=false;intro=null;player.heat=2');
  g.dispatch('keydown',{key:' '});g.dispatch('keydown',{key:'Shift',repeat:false});g.dispatch('blur');
  g.run('ventHold(K.VENT_PURGE);ventHold(10)');
  assert.equal(g.run('player.heat'),1);assert.equal(g.run('demons.length'),1);
  assert.equal(g.run('player.charges'),3);assert.equal(g.run('player.ventDash'),null);
});
test('Venting roots actual movement until the released unit finishes', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;god=true;cells=[];player.x=360;player.y=640;player.heat=2;setVentHeld(true);setVentHeld(false);for(let i=0;i<20;i++)step()');
  assert.equal(g.run('player.x'),360);assert.equal(g.run('player.y'),640);
  g.run('for(let i=0;i<50;i++)step()');assert.ok(g.run('player.y')<640);
  assert.equal(g.run('demons.length'),1);
});
test('A demon bite cancels the current vent unit and requires a fresh press', () => {
  const g=game();g.run('onTitle=false;intro=null;cells=[];husks=[];player.x=400;player.y=640;player.hp=.6;player.heat=0;setVentHeld(true);ventHold(RUN_VENT_HEAL_T/2);demons=[{x:390,y:640,t:0,hitCd:0,source:"vent",warn:0,ph:0,tgt:null,feast:null,eatT:0}];stepDemons(DT)');
  assert.equal(g.run('player.ventUnit'),null);assert.equal(g.run('player.venting'),false);assert.equal(g.run('player.ventHeld'),false);
  const hurt=g.run('player.hp');g.run('ventHold(RUN_VENT_HEAL_T*2)');assert.equal(g.run('player.hp'),hurt,'An interrupted held input silently restarted healing.');
  assert.equal(g.run('demons.length'),1,'An interrupted heal incorrectly released another demon.');
});
test('A demon bite knocks Duy away instead of leaving both bodies stacked', () => {
  const g=game();g.run('onTitle=false;intro=null;cells=[];husks=[];slag=[];player.x=400;player.y=640;player.hx=1;player.hy=0;demons=[{x:390,y:640,t:0,hitCd:0,source:"vent",warn:0,ph:0,tgt:null,feast:null,eatT:0}];stepDemons(DT)');
  const before=g.run('dist(player.x,player.y,demons[0].x,demons[0].y)');assert.ok(g.run('player.knockT>0&&player.knockX>0'));
  g.run('for(let i=0;i<16;i++)step()');assert.ok(g.run('player.x')>400,'Knockback did not move Duy away from the hit.');
  assert.ok(g.run('dist(player.x,player.y,demons[0].x,demons[0].y)')>before+25,'Duy and the demon remained stacked after impact.');
});
test('Vent demons persist after release and into Khet-Tak-Tor encounter; new run clears them', () => {
  const g=game();g.run('onTitle=false;intro=null;god=true;husks=[];spawnVentDemon();setVentHeld(false);for(let i=0;i<1000;i++)stepDemons(DT)');
  assert.equal(g.run('demons.length'),1);g.run('startDuel()');assert.equal(g.run('demons.length'),1);
  g.run('reset()');assert.equal(g.run('demons.length'),0);assert.equal(g.run('player.ventUnit'),null);
});
test('Each completed unit spawns even above the old demon cap; emergence cannot bite', () => {
  const g=game();g.run('onTitle=false;intro=null;player.hp=0.2;for(let i=0;i<12;i++){player.heat=1;setVentHeld(true);setVentHeld(false);ventHold(K.VENT_PURGE);}');
  assert.equal(g.run('demons.length'),12);
  g.run('for(const d of demons){d.x=player.x;d.y=player.y;}stepDemons(DT)');assert.equal(g.run('player.hp'),0.2);
});
test('Vent demons emerge far from rooted Duy and outside solid props', () => {
  for(const [x,y] of [[360,640],[80,110],[640,1170]]){
    const g=game();g.run(`onTitle=false;intro=null;cells=[];slag=[];husks=[];demons=[];player.x=${x};player.y=${y};spawnVentDemon()`);
    assert.ok(g.run('dist(player.x,player.y,demons[0].x,demons[0].y)>=K.VENT_DEMON_MIN_R'),'A vent demon spawned inside Duy\'s protected distance.');
    assert.equal(g.run('collideObstacles({x:demons[0].x,y:demons[0].y},K.DEMON_R)'),false,'A vent demon spawned inside a solid prop.');
    assert.equal(g.run('demons[0].warn'),g.run('K.VENT_DEMON_WAKE'));
  }
});
test('Nearby cinders take priority; outside the search radius demons chase Duy', () => {
  const g=game();g.run('onTitle=false;intro=null;god=true;player.x=600;player.y=640;husks=[{x:200,y:640,t:0,ph:0}];spawnVentDemon();Object.assign(demons[0],{x:300,y:640,warn:0});stepDemons(DT)');
  assert.equal(g.run('demons[0].tgt===husks[0]'),true);assert.ok(g.run('demons[0].x')<300);
  g.run('husks[0].x=30;demons[0].x=400;stepDemons(DT)');assert.equal(g.run('demons[0].tgt'),null);assert.ok(g.run('demons[0].x')>400);
});
test('Eating cinder telegraphs then consumes both bodies, ignites multiple villagers and deals one heart', () => {
  const g=game();g.run('onTitle=false;intro=null;player.x=400;player.y=640;player.hp=1;husks=[{x:300,y:640,t:0,ph:0}];cells=[{x:330,y:640,grace:0},{x:300,y:700,grace:0},{x:600,y:700,grace:0}];spawnVentDemon();Object.assign(demons[0],{x:300,y:640,warn:0});stepDemons(DT)');
  assert.equal(g.run('demons[0].feast===husks[0]'),true);assert.equal(g.run('cells[0].hunter'),undefined);
  g.run('stepDemons(K.CINDER_EAT_T)');assert.equal(g.run('demons.length'),0);assert.equal(g.run('husks.length'),0);
  assert.equal(g.run('cells.filter(c=>c.hunter).length'),2);assert.equal(g.run('player.hp'),0.8);
  assert.equal(g.run('runEmbers'),0);assert.equal(g.run('cinderBlasts.length'),1);
});
test('Dash interception prevents an eating demon from consuming its cinder', () => {
  const g=game();g.run('onTitle=false;intro=null;husks=[{x:300,y:640,t:0,ph:0}];player.x=400;player.y=640;spawnVentDemon();Object.assign(demons[0],{x:300,y:640,warn:0});stepDemons(DT);player.x=300;player.lunge=0.1;stepDemons(DT)');
  assert.equal(g.run('demons.length'),0);assert.equal(g.run('husks.length'),1);assert.equal(g.run('cinderBlasts.length'),0);
  assert.equal(g.run('player.heat'),1);assert.equal(g.run('runEmbers'),0);
});
test('Rekindling interrupts eating and preserves the rescue instead of exploding', () => {
  const g=game();g.run('onTitle=false;intro=null;cells=[];husks=[{x:300,y:640,t:0,ph:0}];player.x=400;player.y=640;spawnVentDemon();Object.assign(demons[0],{x:300,y:640,warn:0});stepDemons(DT);player.x=300;player.heat=1;stepHusks(DT);stepDemons(K.CINDER_EAT_T)');
  assert.equal(g.run('saved'),1);assert.equal(g.run('demons.length'),1);assert.equal(g.run('cinderBlasts.length'),0);
});
test('Two demons cannot consume one cinder twice', () => {
  const g=game();g.run('onTitle=false;intro=null;god=true;husks=[{x:300,y:640,t:0,ph:0}];player.x=500;player.y=640;spawnVentDemon();spawnVentDemon();for(const d of demons)Object.assign(d,{x:300,y:640,warn:0});stepDemons(DT);stepDemons(K.CINDER_EAT_T)');
  assert.equal(g.run('cinderBlasts.length'),1);assert.equal(g.run('demons.length'),1);
});
test('Cinder blast leaves rescued villagers safe, respects damage immunity and cannot pay twice on death', () => {
  const g=game();g.run('onTitle=false;intro=null;cells=[{x:300,y:640,saving:true},{x:300,y:640,dead:true}];player.x=300;player.y=640;player.hp=0.1;player.hurtCd=0.5;husks=[{x:300,y:640}];explodeCinder(husks[0])');
  assert.equal(g.run('player.hp'),0.1);assert.equal(g.run('cells.some(c=>c.hunter)'),false);
  g.run('player.hurtCd=0;runEmbers=20;husks=[{x:300,y:640}];spawnVentDemon();Object.assign(demons[0],{warn:0,feast:husks[0],eatT:K.CINDER_EAT_T});stepDemons(DT)');
  assert.equal(g.run('mode'),'over');assert.equal(g.run('META.embers'),20);assert.equal(g.run('opp.runs'),1);
});

test('Cinder blasts ignite victims even at the ordinary fire cap instead of instantly killing them', () => {
  const g=game();g.run('onTitle=false;intro=null;god=true;cells=[];for(let i=0;i<K.HUNTER_CAP;i++)cells.push({x:30,y:50,hunter:true});cells.push({x:300,y:640,grace:0});husks=[{x:300,y:640}];explodeCinder(husks[0])');
  assert.equal(g.run('cells[cells.length-1].hunter'),true);assert.notEqual(g.run('cells[cells.length-1].dead'),true);assert.equal(g.run('husks.length'),0);
});


test('A zero-rescue first loss funds either starter before buildings unlock', () => {
  const g=game();g.run('onTitle=false;intro=null;pop("first loss");enterHub();drawHub(ctx)');
  assert.equal(g.run('META.embers'),20);assert.equal(g.run('runStarterBonus'),20);assert.equal(g.run('runEmbers'),0);
  assert.equal(g.run('META.buildings.well.built || META.buildings.forge.built'),false);
  assert.equal(g.run('hubSheet'),'starter');
  assert.deepEqual(JSON.parse(g.run('JSON.stringify(hubBtns.filter(b=>b.act.startsWith("starterbuy:")).map(b=>({act:b.act,enabled:b.enabled})))')),
    [{act:'starterbuy:hearts',enabled:true},{act:'starterbuy:charges',enabled:true}]);
});
test('Starter top-up pays only the shortfall and leaves earned run tally honest', () => {
  const g=game();g.run('onTitle=false;intro=null;META.embers=5;runEmbers=7;pop("short run")');
  assert.equal(g.run('META.embers'),20);assert.equal(g.run('runStarterBonus'),8);assert.equal(g.run('runEmbers'),7);
  g.run('render()');assert.ok(g.drawnText.includes('+7 embers earned'));assert.ok(g.drawnText.includes('+8 first-upgrade bonus'));
});
test('A strong first run keeps all earnings without an unnecessary bonus', () => {
  const g=game();g.run('runEmbers=80;pop("strong run");enterHub()');
  assert.equal(g.run('META.embers'),80);assert.equal(g.run('runStarterBonus'),0);assert.equal(g.run('starterAvailable()'),true);
});
test('Starter funding cannot repeat after duplicate settlement, reload, skip or another run', () => {
  const g=game();g.run('pop("first");foldOpp();pop("duplicate");enterHub();hubAct("close");saveMeta()');
  const reload=game(Object.fromEntries(g.storage));reload.run('enterHub()');
  assert.equal(reload.run('META.embers'),20);assert.equal(reload.run('starterAvailable()'),true);
  reload.run('reset();pop("second")');assert.equal(reload.run('META.embers'),20);assert.equal(reload.run('runStarterBonus'),0);
});
test('Heart starter purchases once, persists, and occupies the normal first tier', () => {
  const g=game();g.run('pop("first");enterHub();buyStarter("hearts");buyStarter("charges");buyStarter("hearts")');
  assert.equal(g.run('META.embers'),0);assert.equal(g.run('maxHearts'),6);assert.equal(g.run('RUN_MAX_CHARGES'),3);
  const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('maxHearts'),6);assert.equal(reload.run('starterAvailable()'),false);
  reload.run('META.saved=16;META.embers=240;enterHub();buy("well","hearts")');
  assert.equal(reload.run('maxHearts'),7);assert.equal(reload.run('META.embers'),0);
});
test('Mobility starter applies next run and does not grant a separate bonus tier', () => {
  const g=game();g.run('pop("first");enterHub();buyStarter("charges");reset()');
  assert.equal(g.run('player.charges'),4);assert.equal(g.run('RUN_MAX_CHARGES'),4);assert.equal(g.run('maxHearts'),5);
  assert.equal(g.run('META.buildings.forge.charges'),1);assert.equal(g.run('META.embers'),0);
});
test('Starter purchase rejects insufficient funds, unavailable offer and wrong mode', () => {
  const g=game();g.run('META.embers=100;buyStarter("hearts")');assert.equal(g.run('maxHearts'),5);
  g.run('pop("first");enterHub();META.embers=19;buyStarter("hearts");buyStarter("unknown")');
  assert.equal(g.run('maxHearts'),5);assert.equal(g.run('META.embers'),19);assert.equal(g.run('starterAvailable()'),true);
  g.run('META.embers=20;reset();buyStarter("hearts")');assert.equal(g.run('maxHearts'),5);
});
test('Older saves without upgrades get one catch-up offer on the next settlement', () => {
  const g=game({'fwoosh.save2.meta':JSON.stringify({v:1,embers:9,saved:4,flags:null})});
  assert.equal(g.run('META.embers'),9);assert.equal(g.run('starterAvailable()'),false);
  g.run('opp.runs=8;runEmbers=3;pop("returning player");enterHub()');
  assert.equal(g.run('META.embers'),20);assert.equal(g.run('runStarterBonus'),8);assert.equal(g.run('starterAvailable()'),true);
});
test('Existing upgraded saves get neither an unsolicited grant nor starter offer', () => {
  const g=game();g.run('META.embers=7;META.district=4;META.buildings.well.regen=1;saveMeta()');
  const reload=game(Object.fromEntries(g.storage));reload.run('runEmbers=3;pop("old save");enterHub()');
  assert.equal(reload.run('META.embers'),10);assert.equal(reload.run('META.district'),4);
  assert.equal(reload.run('META.buildings.well.regen'),1);assert.equal(reload.run('starterAvailable()'),false);
});
test('Skipping starter leaves it reopenable; buying a normal upgrade ends the first-purchase offer', () => {
  const g=game();g.run('runEmbers=100;pop("first");enterHub();hubAct("close");drawHub(ctx)');
  assert.equal(g.run('hubBtns.some(b=>b.act==="starter")'),true);
  g.run('hubAct("starter");drawHub(ctx)');assert.equal(g.run('hubBtns.some(b=>b.act==="play")'),false);
  g.run('hubAct("close");META.saved=16;enterHub();buy("well","regen")');assert.equal(g.run('starterAvailable()'),false);
});
test('Every demon kill adds one heat; vent kills still award zero embers', () => {
  const g=game();g.run('onTitle=false;intro=null;player.heat=0;runEmbers=0;killDemon({source:"vent",x:300,y:400})');
  assert.equal(g.run('runEmbers'),0);assert.equal(g.run('player.heat'),1);assert.equal(g.run('edge'),0.25);
  assert.ok(g.run('callout.text.includes("NO EMBERS")'));
  for(const source of ['town','keith']){g.run(`killDemon({source:${JSON.stringify(source)},x:300,y:400})`);}
  assert.equal(g.run('runEmbers'),4);assert.equal(g.run('player.heat'),3);
  g.run('killDemon({x:300,y:400})');assert.equal(g.run('runEmbers'),6);assert.equal(g.run('player.heat'),4);
  g.run('player.heat=K.HEAT_MAX;killDemon({source:"vent",x:300,y:400})');assert.equal(g.run('player.heat'),g.run('K.HEAT_MAX'));
});

test('Every ordinary reward source pays its full amount across and beyond the former 160 cap', () => {
  for(const start of [159,160,500]){
    const g=game();g.run(`onTitle=false;intro=null;runEmbers=${start};player.heat=2;saveCell(cells[0],true)`);
    assert.equal(g.run('runEmbers'),start+6,'High-heat rescue must pay all six embers');
    g.run('player.lunge=0;interceptArson({x:300,y:400});player.lunge=.1;interceptArson({x:300,y:400})');
    assert.equal(g.run('runEmbers'),start+16,'Walking and dashing interceptions must pay four and six');
    g.run('player.heat=1;rekindleHusk({x:300,y:400})');assert.equal(g.run('runEmbers'),start+21);
    for(const source of ['town','keith'])g.run(`killDemon({source:${JSON.stringify(source)},x:300,y:400})`);
    g.run('killDemon({x:300,y:400});killDemon({source:"vent",x:300,y:400})');
    assert.equal(g.run('runEmbers'),start+27,'Three other demons pay two each; vent pays zero');
  }
});
test('Uncapped loss earnings bank once, render honestly, persist and leave old upgrades intact', () => {
  const g=game({'fwoosh.save2.meta':JSON.stringify({v:1,embers:37,saved:16,district:3,buildings:{well:{built:true,hearts:1}}})});
  g.run('onTitle=false;intro=null;player.heat=6;for(let i=0;i<20;i++){spawnCrowd(true);saveCell(cells[cells.length-1],true)}');
  assert.equal(g.run('runEmbers'),240);g.run('pop("long run");pop("duplicate");foldOpp();render()');
  assert.equal(g.run('META.embers'),277);assert.equal(g.run('runStarterBonus'),0);
  assert.ok(g.drawnText.includes('+240 embers earned'));
  const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.embers'),277);
  assert.equal(reload.run('maxHearts'),6);assert.equal(reload.run('META.saved'),36);assert.equal(reload.run('META.district'),3);
});
test('A district clear adds its bounty to uncapped rewards exactly once', () => {
  const g=game();g.run('selDistrict=3;reset();runEmbers=500;startDuel();winDuel();winDuel();foldOpp()');
  assert.equal(g.run('runEmbers'),575);assert.equal(g.run('META.embers'),575);assert.equal(g.run('runStarterBonus'),0);
  const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.embers'),575);
});

test('Next goal finds cheaper tracks across both shops and respects unlocks', () => {
  const g=game();g.run('META.buildings.well.hearts=1;META.saved=5');
  assert.equal(g.run('upgradeGoal().kind'),'saves');assert.equal(g.run('upgradeGoal().cost'),6);
  g.run('META.saved=6');assert.equal(g.run('upgradeGoal().name'),'DEEP DRAUGHT');
  g.run('META.buildings.well.regen=1;META.saved=16');
  assert.equal(g.run('upgradeGoal().name'),'QUICK FEET');assert.equal(g.run('upgradeGoal().cost'),100);
  g.run('META.buildings.well.hearts=3;META.buildings.well.regen=2;META.buildings.forge.charges=3;META.buildings.forge.recharge=2');
  assert.equal(g.run('upgradeGoal()'),null);
});

test('Town upgrade names stay out of live action and remain available in town', () => {
  const run=game();run.run('META.saved=6;META.buildings.well.built=true;META.buildings.well.hearts=1;onTitle=false;intro=null;presentDialogue=null;mode="play";render()');
  assert.equal(run.drawnText.includes('DEEP DRAUGHT'),false,'The run HUD exposes the Well upgrade name.');
  const town=game();town.run('META.saved=6;META.buildings.well.built=true;META.buildings.well.hearts=1;drawUpgradeProgress(ctx,60,900,600,102)');
  assert.equal(town.drawnText.includes('DEEP DRAUGHT'),true,'The town upgrade panel no longer identifies Deep Draught.');
});

test('Town exposes distinct Diary and Ratkin Judgment destinations', () => {
  const g=game();g.run('META.buildings.well.built=true;META.buildings.forge.built=true;enterHub();drawHub(ctx)');
  assert.equal(g.run('hubBtns.some(b=>b.act==="diary")'),true);
  assert.equal(g.run('hubBtns.some(b=>b.act==="shrine")'),true);
  assert.equal(g.drawnText.includes('THE DIARY'),true);
  assert.equal(g.drawnText.includes('RATKIN JUDGMENT'),true);
  assert.equal(g.drawnText.includes('0 / 5 terms fulfilled'),true);
});

test('Upgrade progress includes current earnings once and keeps starter funding separate', () => {
  const g=game();g.run('onTitle=false;intro=null;runEmbers=7');
  assert.equal(g.run('goalAmount(upgradeGoal())'),7);
  g.run('pop("loss")');assert.equal(g.run('goalAmount(upgradeGoal())'),20);
  g.run('resultAction("town")');assert.equal(g.run('goalAmount(upgradeGoal())'),20);
  assert.equal(g.run('hubSheet'),'starter');
  g.run('buyStarter("hearts");META.saved=16;enterHub();META.embers=30;reset();onTitle=false;runEmbers=70');
  assert.equal(g.run('goalAmount(upgradeGoal())'),100);
  g.run('pop("loss")');assert.equal(g.run('goalAmount(upgradeGoal())'),100);
});

test('Direct retry banks once, raises unlocked buildings, and clears input without spending a dash', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;META.saved=16;selDistrict=2;reset();introT=0;runEmbers=75;pop("loss");keys.w=true;ptr.down=true;ptr.sx=100;ptr.sy=100;resultClick(360,840);onUp()');
  assert.equal(g.run('mode'),'play');assert.equal(g.run('runDistrict'),2);
  assert.equal(g.run('META.embers'),75);assert.equal(g.run('opp.runs'),1);
  assert.equal(g.run('META.buildings.well.built && META.buildings.forge.built'),true);
  assert.equal(g.run('player.charges'),g.run('RUN_MAX_CHARGES'));assert.equal(g.run('heldVec()'),null);
  assert.equal(g.run('player.ventHeld'),false);assert.equal(g.run('introT'),0);
  g.run('resultAction("retry")');assert.equal(g.run('opp.runs'),1);
});

test('Win retry advances one district, including replays, without skipping or exceeding five', () => {
  for(const [current,unlocked,expected] of [[1,1,2],[1,4,2],[4,4,5],[5,5,5]]){
    const g=game();g.run(`onTitle=false;META.district=${unlocked};selDistrict=${current};reset();startDuel();winDuel();resultAction("retry")`);
    assert.equal(g.run('runDistrict'),expected);assert.equal(g.run('opp.runs'),1);
    assert.equal(g.run('META.embers'),25*current);
  }
});

test('Held result keys and stray movement do not retry; fresh Enter does', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;pop("loss")');
  for(const key of ['w','Shift','ArrowUp'])g.dispatch('keydown',{key});
  for(const key of [' ','Enter','r','t'])g.dispatch('keydown',{key,repeat:true});
  g.run('resultClick(30,30)');assert.equal(g.run('mode'),'over');
  g.dispatch('keydown',{key:'Enter',repeat:false});assert.equal(g.run('mode'),'play');
  assert.equal(g.run('player.ventHeld'),false);assert.equal(g.run('player.charges'),3);
});

test('Town action opens the affordable shop and held Enter cannot close it', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;META.saved=16;META.buildings.well.hearts=1;META.buildings.well.regen=1;runEmbers=100;pop("loss")');
  g.dispatch('keydown',{key:'t',repeat:false});assert.equal(g.run('hubSheet'),'forge');
  g.dispatch('keydown',{key:'Enter',repeat:true});assert.equal(g.run('hubSheet'),'forge');
  g.run('hubAct("close");hubAct("nextupgrade")');assert.equal(g.run('hubSheet'),'forge');
});

test('Run history records once, keeps the newest twenty, and survives older saves and reload', () => {
  const g=game({'fwoosh.save2.meta':JSON.stringify({v:1,recentRuns:null})});
  for(let i=0;i<23;i++)g.run(`reset();elapsed=${i}+.25;runEmbers=${i};saved=2;pop("history");foldOpp()`);
  assert.equal(g.run('META.recentRuns.length'),20);assert.equal(g.run('META.recentRuns[0].earned'),3);
  const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.recentRuns.length'),20);
  assert.deepEqual(JSON.parse(reload.run('JSON.stringify(META.recentRuns[19])')),
    {seconds:22.3,district:1,rescued:2,earned:22,starterBonus:0,won:false});
});

test('Win history includes the bounty; zero-rescue loss records top-up separately', () => {
  const g=game();g.run('pop("zero")');assert.equal(g.run('META.recentRuns[0].earned'),0);assert.equal(g.run('META.recentRuns[0].starterBonus'),20);
  g.run('reset();runEmbers=50;startDuel();winDuel()');assert.equal(g.run('META.recentRuns[1].earned'),75);assert.equal(g.run('META.recentRuns[1].won'),true);
});

test('Rescue reward feedback groups a chain, includes rekindling, and clears on timeout and reset', () => {
  const g=game();g.run('onTitle=false;intro=null;player.heat=2;saveCell(cells[0],true);saveCell(cells[1],true);rekindleHusk({x:300,y:400})');
  assert.equal(g.run('rescueReward.count'),3);assert.equal(g.run('rescueReward.embers'),18);
  g.run('god=true;cells=[];hitstop=0;for(let i=0;i<200;i++)step(DT)');assert.equal(g.run('rescueReward'),null);
  g.run('showRescueReward(8);reset()');assert.equal(g.run('rescueReward'),null);
});

test('Results show earned embers, available upgrade and explicit retry; live HUD exposes earnings', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;runEmbers=7;render()');
  assert.ok(g.drawnText.includes('RUN +7 EMBERS'));
  g.run('pop("loss");render()');
  for(const text of ['+7 embers earned','+13 first-upgrade bonus','FIRST UPGRADE · READY','RUN AGAIN','UPGRADES · READY'])assert.ok(g.drawnText.includes(text),text);
});

test('Assumed event profiles exercise real rewards and expose initial price cadence for playtesting', () => {
  function profile(rescues,hot){const g=game();g.run('onTitle=false;intro=null');
    for(let i=0;i<rescues;i++)g.run(`player.heat=${(hot?3:1)+i%2};spawnCrowd(true);saveCell(cells[cells.length-1],true)`);
    g.run(`player.lunge=${hot?'.1':'0'};interceptArson({x:300,y:400});player.heat=1;rekindleHusk({x:300,y:400})`);
    if(hot)g.run('killDemon({source:"town",x:300,y:400});killDemon({source:"arbiter",x:300,y:400})');
    return g.run('runEmbers');}
  const ordinary=[7,8,9].map(n=>profile(n,false)),skilled=[9,10,11].map(n=>profile(n,true));
  assert.deepEqual(ordinary,[47,53,58]);assert.deepEqual(skilled,[91,100,108]);
  const price=game().run('SHOPS.well.items[1].costs[0]');
  assert.ok(ordinary.every(n=>Math.ceil(price/n)>=2&&Math.ceil(price/n)<=3));
  return {method:'Constructed event profiles, not observed human performance; no duration assumption.',ordinary,skilled,price,midpointRatio:skilled[1]/ordinary[1],laterTiers:[240,540]};
});



test('Present rescue exchange follows a witnessed rescue without pausing control',()=>{
 const g=game();g.run("onTitle=false;reset();intro=null;notePresentEvent('rescue');tickPresentDialogue(DT)");
 assert.equal(g.run('presentDialogue.id'),'rescue');
 const y=g.run('player.y');g.dispatch('keydown',{key:'w'});g.run('step()');assert.notEqual(g.run('player.y'),y);
 g.dispatch('keydown',{key:'Shift'});assert.equal(g.run('player.charges'),2);
});
test('Unwitnessed and stale events do not create a dialogue backlog',()=>{
 const g=game();g.run('onTitle=false;reset();intro=null;elapsed=20;tickPresentDialogue(DT)');assert.equal(g.run('presentDialogue'),null);
 g.run("notePresentEvent('rescue');elapsed+=7;tickPresentDialogue(DT)");assert.equal(g.run('presentDialogue'),null);
});
test('Two-line exchanges save delivered text, leave silence, and survive reload',()=>{
 const g=game();g.run("onTitle=false;reset();intro=null;startPresentDialogue('rescue');tickPresentDialogue(10);tickPresentDialogue(10)");
 assert.equal(g.run('presentDialogue'),null);assert.equal(g.run('presentGap'),16);assert.equal(g.run('dialogueSave().history.length'),2);
 g.run("player.heat=3;tickPresentDialogue(1)");assert.equal(g.run('presentDialogue'),null);
 const reloaded=game(Object.fromEntries(g.storage));assert.equal(reloaded.run("presentSeen('rescue')"),true);assert.equal(reloaded.run('dialogueSave().history.length'),2);
});
test('Interrupted speech does not mark the whole exchange as completed',()=>{
 const g=game();g.run("onTitle=false;reset();intro=null;startPresentDialogue('rescue');tickPresentDialogue(0.1);pop('test');reset();intro=null");
 assert.equal(g.run("presentSeen('rescue')"),false);assert.equal(g.run('presentDialogue'),null);assert.equal(g.run('dialogueSave().history.length'),0);
});
test('Heat observation needs rescue knowledge and follows current heat',()=>{
 const g=game();g.run("onTitle=false;reset();intro=null;elapsed=20;player.heat=3;tickPresentDialogue(DT)");assert.equal(g.run('presentDialogue'),null);
 g.run("dialogueSave().seen.push('rescue');tickPresentDialogue(DT)");assert.equal(g.run('presentDialogue.id'),'heat');
});
test('Run dialogue budget suppresses extra exchanges and combat cannot interrupt',()=>{
 const g=game();g.run("onTitle=false;reset();intro=null;elapsed=20;startPresentDialogue('rescue');speakArbiter('No interruption')");
 assert.equal(g.run('presentDialogue.id'),'rescue');g.run("presentDialogue=null;presentCount=2;notePresentEvent('rescue');tickPresentDialogue(DT)");assert.equal(g.run('presentDialogue'),null);
});
test('Return after death is not delivered after a win and never freezes the street',()=>{
 const g=game();g.run("onTitle=false;reset();intro=null;opp.introVer=INTRO_VERSION;opp.runs=1;opp.terr[0]=10;META.recentRuns=[{won:true}];reset();elapsed=5;tickPresentDialogue(DT)");
 assert.equal(g.run('introT'),0);assert.equal(g.run('presentDialogue'),null);
 g.run('META.recentRuns=[{won:false}];tickPresentDialogue(DT)');assert.equal(g.run('presentDialogue.id'),'return');
});
test('Conversation archive excludes unrevealed text and tolerates old malformed saves',()=>{
 const g=game({'fwoosh.save2.meta':JSON.stringify({v:1,embers:17,dialogue:{seen:null,history:[null,3,{who:'UNKNOWN',text:'bad'}]}})});
 g.run("enterHub();hubAct('conversations');drawConversationSheet(ctx)");
 assert.equal(g.run('dialogueSave().history.length'),0);assert.equal(g.run('META.embers'),17);
 assert.ok(!g.drawnText.includes(g.run('PRESENT.release[1].text')));
 g.run("rememberDialogue(PRESENT.rescue[0]);drawConversationSheet(ctx)");assert.ok(g.drawnText.includes(g.run('PRESENT.rescue[0].text')));
});
test('Saved Keith dialogue records stay Keith without losing text',()=>{
 const old={v:1,dialogue:{seen:['rescue'],history:[{who:'KEITH',emotion:'stern',text:'Keep moving.'}]}};
 const g=game({'fwoosh.save2.meta':JSON.stringify(old)});g.run('dialogueSave();saveMeta()');
 assert.equal(g.run('META.dialogue.history[0].who'),'KEITH');
 assert.equal(g.run('META.dialogue.history[0].text'),'Keep moving.');
 const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('dialogueSave().history[0].who'),'KEITH');
});
test('Present dialogue contains no past-life reveals and all templates use named speakers',()=>{
 const g=game();const lines=g.run('Object.values(PRESENT).flat()');
 assert.ok(lines.every(l=>['DUY','KEITH','KHET-TAK-TOR'].includes(l.who)&&l.emotion&&l.text.length<100));
 assert.ok(lines.every(l=>!(/Mei|Cuong|Diep|nineteen|brother|Adonai|Odin|gunman/i.test(l.text))));
 assert.equal(g.run('STORY.lore.length'),0);
});

test('Keith pressure adds hostile demons and a telegraphed direct strike',()=>{
 const g=game();g.run("onTitle=false;intro=null;mode='play';duelActive=false;boss=null;demons=[];elapsed=K.KEITH_PRESSURE_FIRST;player.hp=1;player.hurtCd=0;triggerKeithPressure()");
 assert.equal(g.run("demons.filter(d=>d.source==='keith').length"),g.run('K.KEITH_PRESSURE_DEMONS'));
 assert.ok(g.run('keithStrike && keithStrike.tx===player.x && keithStrike.ty===player.y'));
 const before=g.run('player.hp');g.run('keithStrike.t=K.KEITH_STRIKE_TELE;stepKeithPressure(DT)');
 assert.ok(g.run('player.hp')<before,'Keith pressure did not damage Duy when he stayed on the telegraph.');
 assert.equal(g.run('keithStrike.done'),true);
});

test('Title screen exposes Start and a confirmed reset that clears Fwoosh saves',()=>{
 const g=game();g.run('META.embers=99;saveMeta();opp.runs=4;saveOpp();onTitle=true;drawTitle(ctx)');
 assert.ok(g.run("hubBtns.some(b=>b.act==='title-start')"));
 assert.ok(g.run("hubBtns.some(b=>b.act==='title-reset')"));
 g.run("hubAct('title-reset')");assert.equal(g.run('titleResetConfirm'),true);
 g.run("hubAct('title-reset')");assert.equal(g.run('titleResetConfirm'),false);
 assert.equal(g.run('onTitle'),true);assert.equal(g.run('META.embers'),0);assert.equal(g.run('opp.runs'),0);
 g.run("hubAct('title-start')");assert.equal(g.run('onTitle'),false);assert.equal(g.run('intro.phase'),'talk');
});

test('Keith opens a demon well, well demons emerge, and vent restores a broken well',()=>{
 const g=game();g.run("onTitle=false;intro=null;mode='play';duelActive=false;boss=null;demons=[];elapsed=K.KEITH_PRESSURE_FIRST;player.hp=1;player.hurtCd=0;triggerKeithPressure()");
 assert.equal(g.run('demonWell.state'),'opening');
 assert.equal(g.run("demons.filter(d=>d.source==='keith'&&d.wellSpawn).length"),g.run('K.KEITH_PRESSURE_DEMONS'));
 g.run('for(let i=0;i<Math.ceil(K.DEMON_WELL_EMERGE_T/DT)+2;i++)stepDemons(DT)');
 assert.ok(g.run('demons.every(d=>d.emergeT<=0)'));
 g.run('player.x=demonWell.x;player.y=demonWell.y;player.lunge=.1;stepDemonWell(DT)');
 assert.equal(g.run('demonWell.state'),'destroyed');assert.ok(g.run('demonWell.respawnT<=K.DEMON_WELL_RESPAWN_MAX'));
 g.run('player.heat=1;player.ventHeld=true;beginVentUnit()');
 assert.notEqual(g.run('demonWell.state'),'destroyed');
});


test('Original upper route is reachable by running and upward dash',()=>{
 const g=game();g.run("onTitle=false;reset();intro=null;god=true;ghost=true;cells=[];player.x=360;player.y=430;keys.w=true;for(let i=0;i<480;i++){if(i%120===0)lungeDir(0,-1);step();}");
 assert.equal(g.run('player.y'),40);
});
test('Spawns and remembered opponent cells cover the original top and bottom',()=>{
 const g=game();g.run('onTitle=false;reset();intro=null;for(let i=0;i<100;i++)spawnCrowd(false)');
 assert.ok(g.run('cells.some(c=>c.y<270)&&cells.some(c=>c.y>1000)'));
 assert.ok(g.run('cellCenter(0).y<100 && cellCenter(47).y>1100'));
 g.run('opp.grudge={x:360,y:80};startDuel()');assert.equal(g.run('boss.y'),80);
});
test('Full map corners fit between docks and inverse mapping preserves coordinates',()=>{
 const g=game();
 for(const [x,y] of [[0,0],[720,0],[0,1280],[720,1280],[360,40],[360,1240]]){
  const q=g.run(`worldToScreen(${x},${y})`),back=g.run(`screenToWorld(${q.x},${q.y})`);
  assert.ok(q.x>=0&&q.x<=720&&q.y>=128&&q.y<=1100);
  assert.ok(Math.abs(back.x-x)<1e-9&&Math.abs(back.y-y)<1e-9);
 }
});
test('HUD, dialogue dock and gutters cannot consume a dash',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0;isTouch=true');
 for(const [x,y] of [[300,80],[300,1160],[20,600]])g.run(`onDown(${x},${y});onMove(${x+100},${y});onUp()`);
 assert.equal(g.run('player.charges'),3);
 g.run('onDown(300,600);onMove(400,600)');assert.equal(g.run('player.charges'),3);
 g.run('onUp()');assert.equal(g.run('player.charges'),2);
});
test('Mouse slingshot directions still invert rendered world targets at all viewport sizes',()=>{
 for(const width of [320,375,430,1280])for(const [x,y] of [[100,40],[620,40],[100,1240],[620,1240]]){
  const g=game();g.run(`innerWidth=${width};innerHeight=900;fit();onTitle=false;intro=null;introT=0;player.x=360;player.y=640`);
  const q=g.run(`(()=>{const p=worldToScreen(${x},${y});return {clientX:p.x*scale,clientY:p.y*scale};})()`);
  g.dispatch('pointerdown',q);g.dispatch('pointerup');
  assert.equal(g.run('player.charges'),2);
  const m=Math.hypot(x-360,y-640);assert.ok(Math.abs(g.run('player.hx')-(360-x)/m)<1e-9);assert.ok(Math.abs(g.run('player.hy')-(640-y)/m)<1e-9);
 }
});
test('Desktop mouse hold draws the same slingshot trajectory preview',()=>{
 const g=game();const strokes=g.run('onTitle=false;intro=null;introT=0;isTouch=false;player.x=360;player.y=640;var q=worldToScreen(620,760);onDown(q.x,q.y);var burstPreviewStrokes=0;ctx.stroke=()=>burstPreviewStrokes++;drawPointerBurstAim(ctx);burstPreviewStrokes');
 assert.ok(strokes>0,'Desktop pointer aim did not draw a trajectory preview');
 assert.equal(g.run('player.charges'),3,'Desktop preview spent a charge before release');
 g.run('onUp()');assert.equal(g.run('player.charges'),2);assert.ok(g.run('player.hx')<0&&g.run('player.hy')<0);
});
test('Burst preview builds its arrow from the approved Makko flame frames',()=>{
 const g=game();const ops=g.run('onTitle=false;intro=null;introT=0;isTouch=true;player.x=360;player.y=640;MAKKO_FLAME_IMG.complete=true;MAKKO_FLAME_IMG.naturalWidth=755;var flameDraws=0,flameRotations=0,dashPatterns=0;ctx.drawImage=()=>flameDraws++;ctx.rotate=()=>flameRotations++;ctx.setLineDash=()=>dashPatterns++;var q=worldToScreen(620,760);onDown(q.x-100,q.y);onMove(q.x,q.y);drawPointerBurstAim(ctx);({flameDraws,flameRotations,dashPatterns})');
 assert.ok(ops.flameDraws>=3,'The preview did not use enough Makko flame frames to read as a burning arrow');
 assert.equal(ops.flameRotations,ops.flameDraws);assert.equal(ops.dashPatterns,0,'The retired dashed trajectory returned');
 assert.equal(g.run('player.charges'),3);
});
test('Resizing cancels incomplete gestures without an accidental dash',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0;onDown(300,600);innerWidth=375;fit();onUp()');assert.equal(g.run('player.charges'),3);
});
test('World art shares a uniform transform and screen feedback stays in the HUD',()=>{
 const g=game();g.run("const ops=[];ctx.translate=(...a)=>ops.push(['translate',...a]);ctx.scale=(...a)=>ops.push(['scale',...a]);SK.bg=()=>ops.push(['background']);onTitle=false;intro=null;introT=0;rescueReward={count:2,embers:8,t:1};render()");
 assert.ok(g.drawnText.includes('2 RESCUED · +8 EMBERS'));
 assert.ok(g.run("ops.findIndex(o=>o[0]==='scale')<ops.findIndex(o=>o[0]==='background')"));
 assert.ok(g.run("ops.some(o=>o[0]==='scale'&&o[1]===worldView().s&&o[2]===worldView().s)"));
});

test('Backtick pauses every game screen and ignores key repeat',()=>{
 for(const state of ['onTitle=true','onTitle=false;mode="play"','onTitle=false;mode="hub"','onTitle=false;mode="over"']){
  const g=game();g.run(state);g.dispatch('keydown',{key:'`',code:'Backquote'});
  assert.equal(g.run('debugMenu.open'),true);g.dispatch('keydown',{key:'`',code:'Backquote',repeat:true});assert.equal(g.run('debugMenu.open'),true);
  const before=g.run('JSON.stringify({player,intro,mode,onTitle})');g.run('for(let i=0;i<120;i++)step()');assert.equal(g.run('JSON.stringify({player,intro,mode,onTitle})'),before);
  g.dispatch('keydown',{key:'Escape'});assert.equal(g.run('debugMenu.open'),false);
 }
});
test('Auto-run prioritizes nearest fire, then nearest demon, then wandering', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;player.x=300;player.y=600;cells=[{id:1,x:100,y:600,hunter:true},{id:2,x:520,y:600,hunter:true}];demons=[{x:310,y:600,source:"vent"},{x:650,y:600,source:"town"}]');
  assert.equal(g.run('autoRunTarget(player)===cells[0]'),true,'A closer demon incorrectly outranked a flaming villager.');
  g.run('cells[0].hunter=false;cells[1].hunter=false');
  assert.equal(g.run('autoRunTarget(player)===demons[0]'),true,'Auto-run did not choose the nearest demon after fires cleared.');
  g.run('demons=[]');assert.equal(g.run('autoRunTarget(player)'),null,'A safe field should fall back to wandering.');
});
test('Automatic pursuit turns smoothly while manual steering wins immediately', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;god=true;ghost=true;cells=[{id:1,x:600,y:600,hunter:true,fuse:5,grace:0,vx:0,vy:0,spreadT:0}];demons=[];player.x=300;player.y=600;player.hx=0;player.hy=-1;step()');
  assert.ok(g.run('player.hx')>0,'Automatic pursuit did not turn toward the fire.');
  g.run('keys.a=true;step()');assert.ok(g.run('player.hx')<-.99,'Held manual steering did not override automatic pursuit.');
});
test('Auto-run follows periodic runner sightings instead of perfect live tracking', () => {
  const g=game();g.run('onTitle=false;intro=null;const runner={id:1,x:500,y:600,hunter:true};cells=[runner];player.autoTarget=null;player.autoSightT=0');
  assert.equal(g.run('autoRunAim(player,runner,DT).x'),500);
  g.run('runner.x=620');assert.equal(g.run('autoRunAim(player,runner,DT).x'),500,'The assist tracked every live runner movement.');
  assert.equal(g.run('autoRunAim(player,runner,K.AUTO_SIGHT).x'),620,'The assist never refreshed its runner sighting.');
  g.run('keys.d=true;step()');assert.equal(g.run('player.autoTarget'),null,'Manual steering did not release the old sighting.');
});
test('A newly burning villager initially bolts away from Duy', () => {
  const g=game();g.run('onTitle=false;intro=null;player.x=300;player.y=600;cells=[{id:1,x:360,y:600,hunter:false,grace:0,ph:2,ps:.6,dir:Math.PI}];ignite(cells[0],"arson")');
  assert.ok(g.run('Math.cos(cells[0].dir)')>.9,'The new runner did not flee away from the nearby player.');
  assert.equal(g.run('cells[0].ph'),0);
});
test('Burning runners outrun an ordinary jog but a dash closes the gap', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;god=true;ghost=false;cells=[{id:1,x:360,y:1050,hunter:true,fuse:100,grace:0,vx:0,vy:0,spreadT:0,dir:0,ph:0,ps:0}];demons=[];slag=[];arson=[];player.x=240;player.y=1050;player.hx=1;player.hy=0');
  assert.ok(g.run('K.PANIC_SPD>K.RUN'),'A clear-headed auto-run can still match a burning villager.');
  const before=g.run('dist(player.x,player.y,cells[0].x,cells[0].y)');g.run('for(let i=0;i<60;i++)step()');
  assert.ok(g.run('dist(player.x,player.y,cells[0].x,cells[0].y)')>before,'An ordinary jog closed on a straight fleeing runner.');
  g.run('lungeDir(1,0);for(let i=0;i<30&&saved===0;i++)step()');
  assert.equal(g.run('saved'),1,'A well-aimed dash could not catch the faster runner.');
});
test('Automatic pursuit closes an open lane and rescues its burning target', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;god=true;cells=[{id:1,x:450,y:600,hunter:true,fuse:5,grace:0,vx:0,vy:0,spreadT:0,dir:Math.PI,ph:0,ps:.5}];demons=[];slag=[];player.x=300;player.y=600;player.hx=0;player.hy=-1;for(let i=0;i<240&&saved===0;i++)step()');
  assert.equal(g.run('saved'),1,'Auto-run identified the fire but failed to complete an unobstructed rescue.');
});
test('Automatic pursuit follows collision deflection around a large prop', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;god=true;K.PANIC_SPD=0;cells=[{id:1,x:680,y:240,hunter:true,fuse:100,grace:0,vx:0,vy:0,spreadT:0,dir:0,ph:0,ps:.5}];demons=[];slag=[];arson=[];player.x=430;player.y=560;player.hx=0;player.hy=-1;for(let i=0;i<600&&saved===0;i++)step()');
  assert.equal(g.run('saved'),1,'Automatic pursuit stayed pinned against the wagon instead of following its collision deflection around it.');
});
test('Cinder-eating warning draws no stroked countdown or blast-radius circles', () => {
  const g=game();g.run('onTitle=false;intro=null;introT=0;cells=[];slag=[];trail=[];rings=[];arson=[];shots=[];wake=[];pulses=[];allies=[];powerups=[];boss=null;husks=[{x:300,y:640,t:0,ph:0}];demons=[{x:240,y:640,t:0,hitCd:0,source:"vent",warn:0,ph:1,tgt:husks[0],feast:husks[0],eatT:K.CINDER_EAT_T*.6}];render()');
  assert.equal(g.strokedArcs.length,0,'The cinder-eating warning still strokes a circular overlay.');
});
test('Debug menu cancels held input and blocks gameplay actions',()=>{
 const g=game();g.run('onTitle=false;intro=null;keys.w=true;player.ventHeld=true;player.ventDash=[1,0];ptr.down=true');
 g.dispatch('keydown',{key:'`'});g.dispatch('keydown',{key:'w'});g.dispatch('keydown',{key:'Shift'});g.dispatch('keydown',{key:' '});g.run('lungeDir(1,0);onMove(400,500);onUp()');
 assert.equal(g.run('heldVec()'),null);assert.equal(g.run('player.ventHeld'),false);assert.equal(g.run('player.ventDash'),null);assert.equal(g.run('ptr.down'),false);assert.equal(g.run('player.charges'),3);
});
test('Debug reset requires confirmation and cancel preserves saves',()=>{
 const g=game();g.run('META.embers=777;saveMeta()');const before=JSON.stringify([...g.storage]);
 g.dispatch('keydown',{key:'`'});g.run('onDown(300,820);onUp()');assert.equal(g.run('debugMenu.confirm'),true);assert.equal(g.run('META.embers'),777);
 g.dispatch('keydown',{key:'Enter',repeat:true});assert.equal(g.run('META.embers'),777);
 g.dispatch('keydown',{key:'Escape'});assert.equal(g.run('debugMenu.confirm'),false);g.dispatch('keydown',{key:'Escape'});assert.equal(g.run('debugMenu.open'),false);assert.equal(JSON.stringify([...g.storage]),before);
});
test('Confirmed debug reset starts first dialogue with clean persistent progress',()=>{
 const g=game({'another-game.save':'keep','fwoosh.skin':'makko'});
 g.run('META.embers=999;META.district=5;META.buildings.well.hearts=3;META.diary.read=[1,2];META.dialogue={seen:{test:true},history:[{id:"test"}]};saveMeta();opp.introVer=INTRO_VERSION;opp.runs=30;saveOpp();selDistrict=5;god=true;ghost=true;dialogueHistoryPage=4;toggleDebugMenu();debugAction("reset");debugAction("reset")');
 assert.equal(g.run('debugMenu.open'),false);assert.equal(g.run('onTitle'),false);assert.equal(g.run('mode'),'play');assert.equal(g.run('runDistrict'),1);assert.equal(g.run('META.embers'),0);assert.equal(g.run('maxHearts'),5);assert.equal(g.run('player.charges'),3);
 assert.equal(g.run('META.diary.read.length'),0);assert.equal(g.run('META.dialogue?.history?.length||0'),0);assert.equal(g.run('opp.runs'),0);assert.equal(g.run('intro.i'),0);assert.equal(g.run('intro.lineT'),0);assert.equal(g.run('dialogueHistoryPage'),0);assert.equal(g.run('god||ghost'),false);
 assert.equal(g.storage.get('another-game.save'),'keep');assert.equal(g.storage.get('fwoosh.skin'),'makko');
 const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.embers'),0);assert.equal(reload.run('META.district'),1);assert.equal(reload.run('META.buildings.well.hearts'),0);
});
test('Storage failure rolls reset back and keeps a visible paused error',()=>{
 const g=game();g.run('META.embers=123;saveMeta();saveOpp()');const before=JSON.stringify([...g.storage]);
 g.run('const originalRemove=localStorage.removeItem;localStorage.removeItem=k=>{if(k==="fwoosh.save2.opp")throw Error("blocked");originalRemove(k)};toggleDebugMenu();debugAction("reset");debugAction("reset");render()');
 assert.equal(g.run('debugMenu.open&&debugMenu.confirm'),true);assert.equal(g.run('META.embers'),123);assert.equal(JSON.stringify([...g.storage].sort()),JSON.stringify(JSON.parse(before).sort()));assert.ok(g.drawnText.some(t=>t.includes('Reset failed.')));
});
test('Direct rescues teach the adaptive beacon using current heat and position',()=>{
 const g=game();g.run('onTitle=false;intro=null;opp.introVer=INTRO_VERSION;player.heat=2;for(const p of [[30,40],[45,70],[90,120]])saveCell({id:900+p[0],x:p[0],y:p[1],hunter:true,fuse:1,grace:0},false);foldOpp()');
 assert.equal(g.run('opp.terr[0]'),3);assert.equal(g.run('JSON.stringify(opp.lat.slice(-3))'),'[2,3,4]');
 g.run('reset();intro=null');assert.equal(g.run('snipeArmed'),true);assert.ok(g.run('slag.some(s=>s.grudge)'));assert.equal(g.run('JSON.stringify(opp.grudge)'),'\{"x":60,"y":80\}');
});
test('Adaptive beacon fires on vent and damages Duy if he stays on the read',()=>{
 const g=game();g.run('onTitle=false;opp.introVer=INTRO_VERSION;opp.terr[0]=3;opp.lat=[1,2,3];reset();intro=null;cells=[];arson=[];demons=[];player.hp=.4;player.heat=0;setVentHeld(true)');
 assert.equal(g.run('snipeUsed&&!snipeArmed'),true);assert.ok(g.run('snipe&&!snipe.done'));assert.equal(g.run('snipe.tx'),g.run('player.x'));
 g.run('for(let i=0;i<Math.ceil(K.OPP_SNIPE_TELE/DT)+1;i++)step()');assert.equal(g.run('gotSniped'),true);assert.equal(g.run('player.hurtCd>0'),true);
});
test('Queued dash escapes the beacon after the committed vent unit',()=>{
 const g=game();g.run('onTitle=false;opp.introVer=INTRO_VERSION;opp.terr[0]=3;opp.lat=[1,2,3];reset();intro=null;cells=[];arson=[];demons=[];player.hp=.4;player.heat=0;setVentHeld(true);lungeDir(1,0);setVentHeld(false);for(let i=0;i<Math.ceil(K.OPP_SNIPE_TELE/DT)+1;i++)step()');
 assert.equal(g.run('gotSniped'),false);assert.equal(g.run('oppScarred'),true);assert.ok(g.run('player.x-snipe.tx>K.OPP_SNIPE_R'));
});
test('Dashing through the adaptive beacon disarms it before it fires',()=>{
 const g=game();g.run('onTitle=false;opp.introVer=INTRO_VERSION;opp.terr[14]=3;opp.lat=[1,2,3];reset();intro=null;const mark=slag.find(s=>s.grudge);player.x=mark.x;player.y=mark.y;player.hx=1;player.hy=0;player.lunge=.1;step()');
 assert.equal(g.run('slag.some(s=>s.grudge)'),false);assert.equal(g.run('snipeArmed'),false);assert.equal(g.run('snipeUsed'),true);assert.equal(g.run('oppScarred'),true);assert.equal(g.run('snipe'),null);
});
test('First-run dialogue suppresses the adaptive beacon and its attack',()=>{
 const g=game();g.run('onTitle=false;opp.terr[0]=3;opp.lat=[1,2,3];opp.introVer=0;reset()');assert.ok(g.run('intro'));assert.equal(g.run('snipeArmed'),false);assert.equal(g.run('slag.some(s=>s.grudge)'),false);
});

const completeJudgmentCity=`META.city={v:1,lastAt:1000,roads:['2,4','2,3','2,2'],materials:0,food:4,producedFood:1,producedMaterials:1,nextId:6,buildings:[
 {id:1,type:'burrow',x:1,y:4,state:'sealed',remaining:0,work:0,priority:1},
 {id:2,type:'burrow',x:3,y:4,state:'sealed',remaining:0,work:0,priority:1},
 {id:3,type:'farm',x:1,y:3,state:'sealed',remaining:0,work:0,priority:1},
 {id:4,type:'yard',x:3,y:3,state:'sealed',remaining:0,work:0,priority:1},
 {id:5,type:'store',x:1,y:2,state:'sealed',remaining:0,work:0,priority:1}]}`;
test('First judgment requires all five approved restoration terms',()=>{
 const g=game();g.run(completeJudgmentCity+';META.saved=18;META.clearedDistricts=5');
 assert.deepEqual(JSON.parse(g.run('JSON.stringify(judgmentTerms().map(t=>t.done))')),[true,false,true,true,true]);
 assert.equal(g.run('judgmentEvaluate(true)'),false);assert.notEqual(g.run('hubSheet'),'judgment');
 g.run('META.saved=19;META.clearedDistricts=4');assert.equal(g.run('judgmentReady()'),false);
 g.run('META.clearedDistricts=5;META.city.producedFood=0');assert.equal(g.run('judgmentReady()'),false);
 g.run('META.city.producedFood=1;META.city.producedMaterials=0');assert.equal(g.run('judgmentReady()'),false);
 g.run('META.city.producedMaterials=1;META.city.buildings.find(b=>b.type==="store").state="ready"');assert.equal(g.run('judgmentReady()'),false);
 g.run('META.city.buildings.find(b=>b.type==="store").state="sealed"');assert.equal(g.run('judgmentReady()'),true);
});
test('Qualifying town summons one persistent judgment and records only delivered lines',()=>{
 const g=game();g.run(completeJudgmentCity+';META.saved=19;META.clearedDistricts=5;META.flags.starterChecked=true;onTitle=false;mode="hub";judgmentEvaluate(true)');
 assert.equal(g.run('META.judgment.eligible'),true);assert.equal(g.run('hubSheet'),'judgment');assert.equal(g.run('META.dialogue.history.length'),1);
 g.run('judgmentAdvance()');assert.equal(g.run('judgmentPage'),1);assert.equal(g.run('META.dialogue.history.length'),2);assert.equal(g.run('META.judgment.heard'),false);
 g.run('judgmentAdvance();judgmentAdvance()');assert.equal(g.run('META.judgment.heard'),true);assert.equal(g.run('hubSheet'),'shrine');assert.equal(g.run('META.dialogue.history.length'),3);
 const reload=game(Object.fromEntries(g.storage));reload.run('onTitle=false;mode="hub";enterHub()');assert.equal(reload.run('META.judgment.heard'),true);assert.notEqual(reload.run('hubSheet'),'judgment');
});
test('Judgment dialogue advances once per fresh keyboard press',()=>{
  const g=game();g.run(completeJudgmentCity+';META.saved=19;META.clearedDistricts=5;META.flags.starterChecked=true;onTitle=false;mode="hub";judgmentEvaluate(true)');
  g.dispatch('keydown',{key:'Enter',repeat:true});assert.equal(g.run('judgmentPage'),0);
  g.dispatch('keydown',{key:'Enter',repeat:false});assert.equal(g.run('judgmentPage'),1);
});
test('Favor begins from the first hearing instead of retroactively counting old production',()=>{
  const g=game();g.run(completeJudgmentCity+';META.saved=44;META.city.producedFood=20;META.city.producedMaterials=14;opp.duelWins=6;META.judgment.heard=true;favorBegin();saveMeta()');
  assert.equal(g.run('META.judgment.baseSaved'),44);assert.equal(g.run('META.judgment.baseFood'),20);
  assert.equal(g.run('META.judgment.baseMaterials'),14);assert.equal(g.run('META.judgment.baseBurrows'),2);assert.equal(g.run('META.judgment.baseDuelWins'),6);
  assert.equal(g.run('favorVotes()'),0);
  const reload=game(Object.fromEntries(g.storage));reload.run('favorEvaluate(false)');assert.equal(reload.run('favorVotes()'),0);
});
test('Five social blocs earn persistent votes through distinct game systems',()=>{
  const g=game();g.run(completeJudgmentCity+';META.saved=40;META.city.lastAt=Date.now();opp.duelWins=5;META.judgment.heard=true;favorBegin();saveMeta()');
  g.run("META.city.buildings.push({id:6,type:'burrow',x:3,y:2,state:'sealed',remaining:0,work:0,priority:1});favorEvaluate(false)");
  assert.equal(g.run("META.judgment.votes.includes('hearth')"),true);
  g.run('META.city.producedFood+=8;favorEvaluate(false)');assert.equal(g.run("META.judgment.votes.includes('bowl')"),true);
  g.run('META.city.producedMaterials+=6;favorEvaluate(false)');assert.equal(g.run("META.judgment.votes.includes('hand')"),true);
  g.run('META.saved+=12;opp.duelWins+=1;favorEvaluate(false)');assert.equal(g.run("META.judgment.votes.includes('claw')"),true);
  g.run('META.diary.read=DIARY.map(e=>e.id);favorEvaluate(false)');assert.equal(g.run("META.judgment.votes.includes('memory')"),true);
  g.run("META.city.roads=['2,4'];META.city.producedFood=0;META.city.producedMaterials=0;META.saved=0;opp.duelWins=0");
  assert.equal(g.run('favorVotes()'),5,'Earned community support must not disappear when the town layout later changes.');
});
test('Four votes release Duy without requiring the optional diary vote',()=>{
  const g=game();g.run(completeJudgmentCity+';META.saved=40;META.city.lastAt=Date.now();opp.duelWins=5;META.judgment.heard=true;favorBegin();META.city.buildings.push({id:6,type:"burrow",x:3,y:2,state:"sealed",remaining:0,work:0,priority:1});META.city.producedFood+=8;META.city.producedMaterials+=6;META.saved+=12;opp.duelWins+=1;favorEvaluate(true)');
  assert.equal(g.run('favorVotes()'),4);assert.equal(g.run("META.judgment.votes.includes('memory')"),false);
  assert.equal(g.run('META.judgment.verdictReady'),true);assert.equal(g.run('hubSheet'),'verdict');
  assert.match(g.run('verdictScene[0].text'),/Four of the five/);
  g.run('for(let i=0;i<verdictScene.length;i++)verdictAdvance()');
  assert.equal(g.run('META.judgment.released'),true);assert.equal(g.run('META.judgment.verdictHeard'),true);assert.equal(g.run('META.judgment.unanimous'),false);
  const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.judgment.released'),true);assert.equal(reload.run('favorVotes()'),4);
});
test('The optional Memory vote upgrades a completed verdict to unanimous',()=>{
  const g=game();g.run('META.judgment={...META.judgment,heard:true,favorBegun:true,votes:["hearth","bowl","hand","claw"],verdictReady:true,verdictHeard:true,released:true};META.diary.read=DIARY.map(e=>e.id);favorEvaluate(false)');
  assert.equal(g.run('favorVotes()'),5);assert.equal(g.run('META.judgment.unanimous'),true);
  assert.match(g.run('hubToastMsg'),/INVOICE AND RECRUIT UPGRADED/);
  const before=g.run('dialogueSave().history.length');g.run('favorEvaluate(true)');assert.equal(g.run('dialogueSave().history.length'),before);
});
test('Ratkin Judgment shows named blocs, release threshold and unanimous reward',()=>{
  const g=game();g.run('onTitle=false;mode="hub";META.judgment.heard=true;favorBegin();drawShrineSheet(ctx)');
  for(const label of ['THE HEARTH','THE BOWL','THE HAND','THE CLAW','THE MEMORY','4 release · 5 unanimous'])assert.ok(g.drawnText.some(t=>t.includes(label)),'Missing favor guidance: '+label);
});

test('Current partial saves receive missing city defaults without losing other fields',()=>{
 const old={v:1,embers:321,saved:17,district:4,clearedDistricts:3,buildings:{well:{built:true,hearts:2,regen:1},forge:{built:true,charges:1,recharge:1}},diary:{read:['morning']},flags:{reachedDuel:true}};
 const g=game({'fwoosh.save2.meta':JSON.stringify(old)});
 assert.equal(g.run('META.embers'),321);assert.equal(g.run('META.saved'),17);assert.equal(g.run('META.district'),4);assert.equal(g.run('META.buildings.well.hearts'),2);assert.equal(g.run('META.diary.read[0]'),'morning');
 assert.equal(g.run('META.city.v'),1);assert.equal(g.run('META.city.roads.join()'),'2,4');assert.equal(g.run('META.city.buildings.length'),0);assert.equal(g.run('META.city.materials'),0);
 assert.equal(g.run('META.city.producedFood'),0);assert.equal(g.run('META.city.producedMaterials'),0);assert.equal(g.run('META.judgment.eligible'),false);assert.equal(g.run('META.judgment.heard'),false);
});
test('Malformed city data normalizes to valid unique cells and safe values',()=>{
 const city={v:1,lastAt:'bad',roads:['2,4','2,4','9,9','x,1'],materials:-8,nextId:-2,buildings:[
  {id:4,type:'burrow',x:1,y:4,state:'sealed',work:-3},{id:5,type:'yard',x:1,y:4,state:'sealed'},{id:6,type:'fake',x:0,y:0},{id:7,type:'yard',x:2,y:4,state:'sealed'}]};
 const g=game({'fwoosh.save2.meta':JSON.stringify({v:1,city})});
 assert.equal(g.run('META.city.roads.join()'),'2,4');assert.equal(g.run('META.city.materials'),0);assert.equal(g.run('META.city.buildings.length'),1);assert.equal(g.run('META.city.buildings[0].work'),0);assert.ok(g.run('META.city.nextId>=5'));
});
test('Roads extend only from the connected gate network',()=>{
 const g=game();g.run("cityPlaceRoad(0,0)");assert.equal(g.run('META.city.roads.length'),1);assert.match(g.run('cityMessage'),/EXTEND ROADS/);
 g.run('cityPlaceRoad(2,3)');assert.equal(g.run("META.city.roads.includes('2,3')"),true);
 const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run("META.city.roads.includes('2,3')"),true);
});
test('Foundations reject occupied or disconnected sites without spending',()=>{
 const g=game();g.run('META.embers=200;cityPlaceBuilding("burrow",0,0)');assert.equal(g.run('META.embers'),200);assert.equal(g.run('META.city.buildings.length'),0);
 g.run('cityPlaceBuilding("burrow",2,4)');assert.equal(g.run('META.embers'),200);assert.equal(g.run('META.city.buildings.length'),0);
 g.run('cityPlaceBuilding("burrow",1,4)');assert.equal(g.run('META.embers'),160);assert.equal(g.run('META.city.buildings.length'),1);
 g.run('cityPlaceBuilding("yard",1,4)');assert.equal(g.run('META.embers'),160);assert.equal(g.run('META.city.buildings.length'),1);
});
test('Construction advances offline, caps at eight hours and requires sealing',()=>{
 const g=game();g.run("for(let i=0;i<20;i++){societyArrive({id:0});META.saved++;}META.society.residents.forEach(r=>r.preference='either')");g.run('META.embers=200;cityPlaceBuilding("burrow",1,4);const t=META.city.lastAt;cityAdvance(t+45*1000,true)');assert.equal(g.run('META.city.buildings[0].state'),'building');assert.equal(g.run('META.city.buildings[0].remaining'),45);
 g.run('cityAdvance(META.city.lastAt+9*60*60*1000,true)');assert.equal(g.run('META.city.buildings[0].state'),'ready');assert.equal(g.run('cityWorkerCapacity()'),0);
 g.run('citySeal(1)');assert.equal(g.run('META.embers'),140);assert.equal(g.run('META.city.buildings[0].state'),'sealed');assert.equal(g.run('cityWorkerCapacity()'),1);
 const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.city.buildings[0].state'),'sealed');
});
test('Rush spends exact embers, removes thirty seconds and cannot overspend',()=>{
 const g=game();g.run('META.embers=45;cityPlaceBuilding("burrow",1,4);META.city.lastAt=Date.now();cityRush(1)');assert.equal(g.run('META.embers'),0);assert.ok(g.run('META.city.buildings[0].remaining<=60.01&&META.city.buildings[0].remaining>59'));
 const before=g.run('META.city.buildings[0].remaining');g.run('cityRush(1)');assert.equal(g.run('META.embers'),0);assert.ok(g.run('META.city.buildings[0].remaining')<=before);
});
test('A sealed connected Burrow automatically staffs one sealed Yard',()=>{
 const g=game();g.run("for(let i=0;i<20;i++){societyArrive({id:0});META.saved++;}META.society.residents.forEach(r=>r.preference='either')");g.run(`META.city={v:1,lastAt:1000,roads:['2,4','2,3'],materials:0,food:4,nextId:3,buildings:[
  {id:1,type:'burrow',x:1,y:4,state:'sealed',remaining:0,work:0},{id:2,type:'yard',x:1,y:3,state:'sealed',remaining:0,work:0}]}`);
 assert.equal(g.run('cityWorkerCapacity()'),1);assert.equal(g.run('cityAssignedYards().map(b=>b.id).join()'),'2');assert.equal(g.run('cityYardActive(META.city.buildings[1])'),true);
 g.run('cityAdvance(1000+cityCycleSeconds(META.city.buildings[1])*1000,true)');assert.equal(g.run('META.city.materials'),1);assert.ok(g.run('META.city.buildings[1].work<1e-6'));
});
test('Road distance slows output and disconnected Yards stop without banking work',()=>{
 const g=game();g.run("for(let i=0;i<20;i++){societyArrive({id:0});META.saved++;}META.society.residents.forEach(r=>r.preference='either')");g.run(`META.city={v:1,lastAt:1000,roads:['2,4','2,3','2,2','1,2'],materials:0,food:4,nextId:3,buildings:[
  {id:1,type:'burrow',x:1,y:4,state:'sealed',remaining:0,work:0},{id:2,type:'yard',x:0,y:2,state:'sealed',remaining:0,work:0}]}`);
 assert.equal(g.run('cityRoadDistanceTo(META.city.buildings[1])'),4);assert.equal(g.run('cityCycleSeconds(META.city.buildings[1])'),50);
 g.run('cityAdvance(56000,true)');assert.equal(g.run('META.city.materials'),1);
 g.run("META.city.roads=['2,4'];META.city.buildings[1].work=40;cityAdvance(META.city.lastAt+100000,true)");assert.equal(g.run('META.city.materials'),1);assert.equal(g.run('META.city.buildings[1].work'),0);
});
test('Automatic staffing is stable and extra Yards wait for more Burrows',()=>{
 const g=game();g.run("for(let i=0;i<20;i++){societyArrive({id:0});META.saved++;}META.society.residents.forEach(r=>r.preference='either')");g.run(`META.city={v:1,lastAt:1000,roads:['2,4','2,3','1,4'],materials:0,food:4,nextId:4,buildings:[
  {id:1,type:'burrow',x:3,y:4,state:'sealed',remaining:0,work:0},{id:2,type:'yard',x:1,y:3,state:'sealed',remaining:0,work:0},{id:3,type:'yard',x:0,y:4,state:'sealed',remaining:0,work:0}]}`);
 assert.equal(g.run('cityAssignedYards().map(b=>b.id).join()'),'2');g.run('cityAdvance(1000+50000,true)');assert.equal(g.run('META.city.materials'),1);assert.equal(g.run('META.city.buildings.find(b=>b.id===3).work'),0);
});
test('Moving a building persists its new connected route and clears partial work',()=>{
 const g=game();g.run(`META.city={v:1,lastAt:Date.now(),roads:['2,4','2,3'],materials:0,nextId:2,buildings:[{id:1,type:'yard',x:1,y:4,state:'sealed',remaining:0,work:22}]};cityTool='move';cityMoveCell(1,4);cityMoveCell(1,3)`);
 assert.equal(g.run('META.city.buildings[0].x'),1);assert.equal(g.run('META.city.buildings[0].y'),3);assert.equal(g.run('META.city.buildings[0].work'),0);assert.equal(g.run('cityRoadDistanceTo(META.city.buildings[0])'),2);
 const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.city.buildings[0].y'),3);
});
test('Town exposes the Ratkin Quarter and its station explains inputs, output and route',()=>{
 const g=game();g.run('onTitle=false;mode="hub";drawHub(ctx)');assert.ok(g.drawnText.includes('RATKIN QUARTER'));assert.ok(g.drawnText.includes('THE DIARY'));assert.equal(g.drawnText.includes('THE SHRINE'),false);
 g.run(`META.city={v:1,lastAt:Date.now(),roads:['2,4'],materials:0,food:4,nextId:2,buildings:[{id:1,type:'yard',x:1,y:4,state:'sealed',remaining:0,work:0,priority:1}]};citySelectedId=1;drawCityStation(ctx)`);
 for(const label of ['INPUT','OUTPUT','ROUTE','1 food ration from shared stores'])assert.ok(g.drawnText.includes(label),'Missing station label: '+label);
});
test('Fresh and partial city saves receive bootstrap food and normal priorities',()=>{
 const fresh=game();assert.equal(fresh.run('META.city.food'),4);
 const old=game({'fwoosh.save2.meta':JSON.stringify({v:1,city:{v:1,lastAt:1000,roads:['2,4'],materials:2,nextId:2,buildings:[{id:1,type:'yard',x:1,y:4,state:'sealed',work:3}]}})});
 assert.equal(old.run('META.city.food'),4);assert.equal(old.run('META.city.buildings[0].priority'),1);assert.equal(old.run('META.city.materials'),2);
});
test('Mushroom Farms bootstrap food and Yards consume one ration per material',()=>{
 const g=game();g.run("for(let i=0;i<20;i++){societyArrive({id:0});META.saved++;}META.society.residents.forEach(r=>r.preference='either')");g.run(`META.city={v:1,lastAt:1000,roads:['2,4','2,3'],materials:0,food:0,nextId:4,buildings:[
  {id:1,type:'burrow',x:3,y:4,state:'sealed',remaining:0,work:0,priority:1},
  {id:2,type:'farm',x:1,y:4,state:'sealed',remaining:0,work:0,priority:1},
  {id:3,type:'yard',x:1,y:3,state:'sealed',remaining:0,work:0,priority:2}]}`);
 assert.equal(g.run('cityAssignedStations().map(b=>b.id).join()'),'2','At zero food, automatic assignment must bootstrap the Farm even when the Yard has higher manual priority.');
 g.run('cityAdvance(1000+cityCycleSeconds(META.city.buildings[1])*1000,true)');assert.equal(g.run('META.city.food'),1);assert.equal(g.run('META.city.materials'),0);assert.equal(g.run('META.city.producedFood'),1);
 g.run('META.city.buildings[2].priority=2;META.city.buildings[1].priority=0;cityAdvance(META.city.lastAt+cityCycleSeconds(META.city.buildings[2])*1000,true)');assert.equal(g.run('META.city.food'),0);assert.equal(g.run('META.city.materials'),1);assert.equal(g.run('META.city.producedMaterials'),1);
});
test('Connected sealed Storehouses expand both resource caps',()=>{
 const g=game();g.run(`META.city={v:1,lastAt:1000,roads:['2,4'],materials:10,food:10,nextId:3,buildings:[
  {id:1,type:'store',x:1,y:4,state:'sealed',remaining:0,work:0,priority:1},
  {id:2,type:'store',x:0,y:0,state:'sealed',remaining:0,work:0,priority:1}]}`);
 assert.equal(g.run('cityStorageCapacity()'),25);g.run("META.city.roads=['2,4','0,1'];");assert.equal(g.run('cityStorageCapacity()'),25,'A disconnected road island must not add storage.');
});
test('Shared-road carrier traffic slows station cycles',()=>{
 const g=game();g.run("for(let i=0;i<20;i++){societyArrive({id:0});META.saved++;}META.society.residents.forEach(r=>r.preference='either')");g.run(`META.city={v:1,lastAt:1000,roads:['2,4','2,3','2,2'],materials:0,food:4,nextId:5,buildings:[
  {id:1,type:'burrow',x:3,y:4,state:'sealed',remaining:0,work:0,priority:1},
  {id:2,type:'burrow',x:3,y:3,state:'sealed',remaining:0,work:0,priority:1},
  {id:3,type:'yard',x:1,y:2,state:'sealed',remaining:0,work:0,priority:1},
  {id:4,type:'farm',x:3,y:2,state:'sealed',remaining:0,work:0,priority:1}]}`);
 assert.equal(g.run('cityAssignedStations().length'),2);assert.equal(g.run('cityCongestionFor(META.city.buildings[2])'),1);assert.equal(g.run('cityCycleSeconds(META.city.buildings[2])'),49.1);
});
test('Player priorities reorder automatic worker assignment and persist',()=>{
 const g=game();g.run("for(let i=0;i<20;i++){societyArrive({id:0});META.saved++;}META.society.residents.forEach(r=>r.preference='either')");g.run(`META.city={v:1,lastAt:Date.now(),roads:['2,4','2,3'],materials:0,food:4,nextId:4,buildings:[
  {id:1,type:'burrow',x:3,y:4,state:'sealed',remaining:0,work:0,priority:1},
  {id:2,type:'yard',x:1,y:4,state:'sealed',remaining:0,work:0,priority:1},
  {id:3,type:'farm',x:1,y:3,state:'sealed',remaining:0,work:0,priority:1}]};citySetPriority(3,2)`);
 assert.equal(g.run('cityAssignedStations().map(b=>b.id).join()'),'3');assert.equal(g.run('META.city.buildings.find(b=>b.id===3).priority'),2);
 const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.city.buildings.find(b=>b.id===3).priority'),2);
});
test('Map and station render visible logistics and congestion information',()=>{
 const g=game();g.run("for(let i=0;i<20;i++){societyArrive({id:0});META.saved++;}META.society.residents.forEach(r=>r.preference='either')");g.run(`META.city={v:1,lastAt:Date.now(),roads:['2,4','2,3'],materials:0,food:4,nextId:3,buildings:[
  {id:1,type:'burrow',x:3,y:4,state:'sealed',remaining:0,work:0,priority:1},
  {id:2,type:'farm',x:1,y:3,state:'sealed',remaining:0,work:10,priority:1}]};citySelectedId=2;loadCityArt();for(const k of ['ratkin_walk','ratkin_idle'])Object.assign(MAKKO_ANIM_IMG[k],{complete:true,naturalWidth:2000});drawCityMap(ctx);drawCityStation(ctx)`);
 for(const label of ['FARM','MUSHROOM STATION','SPORE BED','GROW ROOM'])assert.ok(g.drawnText.includes(label),'Missing logistics rendering: '+label);
 assert.ok(g.drawnImages.some(i=>i.src.endsWith('/ratkin_walk.png')),'Carrier must draw the same archived resident shown at home.');
 assert.ok(g.drawnImages.some(i=>i.src.endsWith('/ratkin_idle.png')),'Working station must display its assigned resident.');
 assert.ok(g.drawnText.some(t=>t.includes('shared-route traffic')));
});

test('Ratkin rescue retains identity without a death or human sheet',()=>{
 const g=game();g.run(`Object.assign(MAKKO_ANIM_IMG.ratkin_idle,{complete:true,naturalWidth:2040});SKINS.makko.cell(ctx,300,500,{saving:true,saveT:0,vx:1});`);
 const first=g.drawnImages.find(i=>i.src.endsWith('/ratkin_idle.png'));assert.ok(first);
 g.drawnImages.length=0;g.run(`SKINS.makko.cell(ctx,300,500,{saving:true,saveT:K.SAVE_ANIM_DUR*.7,vx:1});`);
 assert.ok(g.drawnImages.some(i=>i.src.endsWith('/ratkin_idle.png')));
 assert.ok(!g.drawnImages.some(i=>/save\.png|death|townsfolk\.png/.test(i.src||'')));
});

test('Civilian roster covers all twelve designs and never includes the Arbiter',()=>{
 const g=game();
 const roster=g.run('JSON.stringify(RATKIN_VILLAGERS)');
 assert.equal(new Set(JSON.parse(roster)).size,12);assert.ok(!roster.includes('arbiter'));
 g.run('reset(901);while(cells.length<24)spawnCrowd(false)');
 assert.equal(g.run('new Set(cells.map(villagerType)).size'),12);
 const before=g.run('rnd()');
 g.run('for(let i=0;i<100;i++)cells.map(villagerType)');
 const after=g.run('rnd()');
 const reference=game();reference.run('reset(901);while(cells.length<24)spawnCrowd(false)');
 assert.equal(before,reference.run('rnd()'));assert.equal(after,reference.run('rnd()'));
});

test('Demon lock-on triggers unburned panic beyond proximity range in the live step',()=>{
 const g=game();g.run(`onTitle=false;intro=null;introT=0;god=true;hitstop=0;boss=null;arson=[];husks=[];slag=[];
 cells=[{id:0,x:360,y:600,vx:0,vy:0,dir:0,ph:0,ps:1,hunter:false,grace:0}];
 demons=[{x:360,y:250,t:0,hitCd:0,source:'town',huntVill:true}];step();`);
 assert.equal(g.run('demons[0].tgt===cells[0]'),true);
 assert.ok(g.run('cells[0].panicT>0 && cells[0].vy>0'));
 assert.equal(g.run('cells[0].hunter'),false);assert.equal(g.run('saved'),0);
 assert.ok(Math.abs(g.run('Math.hypot(cells[0].vx,cells[0].vy)-K.FLEE_SPD'))<1e-8);
});

test('Marked fire imps and passing vent demons frighten civilians without igniting them',()=>{
 const g=game();g.run(`cells=[{id:0,x:360,y:600,dir:0,ph:0,ps:1,hunter:false}];demons=[];
 arson=[{x:360,y:40,tgt:cells[0],warn:K.ARSON_WARN}];stepCalmVillager(cells[0],DT)`);
 assert.ok(g.run('cells[0].panicT>0 && cells[0].vy>0'));
 g.run(`arson=[];demons=[{x:460,y:600,source:'vent',tgt:null}];stepCalmVillager(cells[0],DT)`);
 assert.ok(g.run('cells[0].panicT>0 && cells[0].vx<0'));
 assert.equal(g.run('cells[0].hunter'),false);
 g.run(`demons[0].x=650;stepCalmVillager(cells[0],DT)`);
 assert.ok(g.run('cells[0].panicT>0'),'Recovery should not flicker at the detection boundary');
 g.run('stepCalmVillager(cells[0],K.PANIC_HOLD)');
 assert.equal(g.run('cells[0].panicT'),0);
 assert.ok(Math.abs(g.run('Math.hypot(cells[0].vx,cells[0].vy)-K.WANDER_SPD'))<1e-8);
});

test('Interception removes distant lock-on panic and overlapping threats cannot cancel escape',()=>{
 const g=game();g.run(`cells=[{id:0,x:360,y:600,dir:1,ph:0,ps:1,hunter:false}];
 arson=[{x:360,y:40,tgt:cells[0]}];demons=[];stepCalmVillager(cells[0],DT);
 arson=[];stepCalmVillager(cells[0],K.PANIC_HOLD)`);
 assert.equal(g.run('cells[0].panicT'),0);
 g.run('demons=[{x:360,y:600},{x:360,y:600}];stepCalmVillager(cells[0],DT)');
 assert.ok(Math.abs(g.run('Math.hypot(cells[0].vx,cells[0].vy)-K.FLEE_SPD'))<1e-8);
});

test('Unburned panic uses matching Makko poses without flames and yields to ascension',()=>{
 const g=game();g.run(`for(const [key,im] of Object.entries(MAKKO_ANIM_IMG))Object.assign(im,{complete:true,naturalWidth:MAKKO_ANIM[key].fw*MAKKO_ANIM[key].frames});`);
 for(let id=0;id<12;id++){
  const role=g.run(`villagerType({id:${id}})`);g.drawnImages.length=0;
  g.run(`SKINS.makko.cell(ctx,300,500,{id:${id},panicT:.5,vx:130,ph:0})`);
  assert.ok(g.drawnImages.some(a=>a.src.endsWith('/'+role+'_panic.png')));
  assert.ok(!g.drawnImages.some(a=>a.src.includes('/flame')));
  g.drawnImages.length=0;
  g.run(`SKINS.makko.cell(ctx,300,500,{id:${id},panicT:.5,saving:true,saveT:.4,vx:0})`);
  assert.ok(g.drawnImages.some(a=>a.src.endsWith('/'+role+'_ascend.png')));
  assert.ok(!g.drawnImages.some(a=>a.src.endsWith('_panic.png')));
 }
});

test('Each Ratkin keeps its appearance through calm, burning and rescue rendering',()=>{
 const g=game();g.run(`for(const [key,im] of Object.entries(MAKKO_ANIM_IMG))Object.assign(im,{complete:true,naturalWidth:MAKKO_ANIM[key].fw*MAKKO_ANIM[key].frames});`);
 for(let i=0;i<12;i++){
   const role=g.run(`villagerType({id:${i}})`);g.drawnImages.length=0;
   g.run(`SKINS.makko.cell(ctx,300,500,{id:${i},vx:0,ph:0});SKINS.makko.cell(ctx,300,500,{id:${i},vx:100,ph:0});SKINS.makko.hunter(ctx,300,500,0,.5,{id:${i},vx:100,ph:0});SKINS.makko.cell(ctx,300,500,{id:${i},saving:true,saveT:.4,vx:100});`);
   for(const state of ['walk','panic','ascend','idle'])assert.ok(g.drawnImages.some(a=>a.src.endsWith('/'+role+'_'+state+'.png')),role+' '+state);
   assert.ok(!g.drawnImages.some(a=>/arbiter|save\.png|death/.test(a.src)));
 }
});

test('Ascension plays once from rescue time, handles ten-frame lantern, and never restarts with the global clock',()=>{
 const g=game();g.run(`for(const [key,im] of Object.entries(MAKKO_ANIM_IMG))Object.assign(im,{complete:true,naturalWidth:MAKKO_ANIM[key].fw*MAKKO_ANIM[key].frames});`);
 for(const id of [0,6]){
  const key=g.run(`villagerType({id:${id}})+'_ascend'`),meta=JSON.parse(g.run(`JSON.stringify(MAKKO_ANIM['${key}'])`));
  for(const [t,expected] of [[0,0],[.5,Math.floor(meta.frames/2)],[1,meta.frames-1]]){
   g.drawnImages.length=0;g.run(`frame=937;SKINS.makko.cell(ctx,300,500,{id:${id},saving:true,saveT:K.SAVE_ANIM_DUR*${t},vx:100})`);
   const drawn=g.drawnImages.find(a=>a.src.endsWith('/'+key+'.png'));assert.ok(drawn);assert.equal(drawn.args[0],expected*meta.fw);
  }
 }
});

test('Rekindling a husk restores the original villager appearance with a fresh entity ID',()=>{
 const g=game();g.run('reset(44);cells=[];husks=[];nextId=3;spawnCrowd(false)');
 const type=g.run('villagerType(cells[0])');
 g.run('becomeHusk(cells[0]);nextId=100;player.heat=K.HEAT_MAX;rekindleHusk(husks[0])');
 assert.equal(g.run('cells.at(-1).id'),100);
 assert.equal(g.run('villagerType(cells.at(-1))'),type);
});

test('Authored stern portrait speaks while typing and returns to its listening pose',()=>{
 const g=game();g.run(`Object.assign(MAKKO_ANIM_IMG.dialogue_arbiter_stern,{complete:true,naturalWidth:2048});drawDialoguePortrait(ctx,'arbiter','stern',0,0,76,true,.25)`);
 assert.equal(g.drawnImages.at(-1).src,'./media/anim/dialogue_arbiter_stern.png');
 assert.equal(g.drawnImages.at(-1).args[0],3*256);
 g.run(`drawDialoguePortrait(ctx,'arbiter','stern',0,0,76,false,.25)`);
 assert.equal(g.drawnImages.at(-1).args[0],0);
});

test('Canonical Arbiter portrait keys resolve before legacy compatibility keys',()=>{
 const g=game();g.run(`MAKKO_ANIM.dialogue_arbiter_stern={frames:3,fw:128,fh:128};MAKKO_ANIM_IMG.dialogue_arbiter_stern={src:'portrait-test',complete:true,naturalWidth:384};drawDialoguePortrait(ctx,'arbiter','stern',0,0,76,true,.2)`);
 assert.equal(g.drawnImages.at(-1).src,'portrait-test');assert.equal(g.drawnImages.at(-1).args[0],256);
});


test('Rescue registers exact civilian appearance once and survives save reload',()=>{
 const g=game();g.run('reset(80);const person={id:99,villagerId:7,x:300,y:600,hunter:true,grace:0};saveCell(person,false);saveCell(person,false);saveMeta()');
 assert.equal(g.run('META.saved'),1);assert.equal(g.run('META.society.residents.length'),1);
 assert.equal(g.run('META.society.residents[0].kind'),'weaver');assert.equal(g.run('META.society.residents[0].home'),0);
 const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.society.residents[0].kind'),'weaver');
 assert.equal(reload.run('META.society.residents[0].events[0].kind'),'arrival');
});
test('Husk rekindle adds its actual rescue actor once to sanctuary',()=>{
 const g=game();g.run('player.heat=8;const h={villagerId:10,x:300,y:600};rekindleHusk(h);rekindleHusk(h)');
 assert.equal(g.run('META.society.residents.length'),1);assert.equal(g.run('META.society.residents[0].kind'),'herbalist');assert.equal(g.run('META.saved'),1);
 assert.equal(g.run('META.society.residents[0].kind===villagerType(cells.at(-1))'),true);
});
test('Registering a resident does not advance combat randomness',()=>{
 const a=game(),b=game();a.run('reset(45);societyArrive({id:5})');b.run('reset(45)');assert.equal(a.run('rnd()'),b.run('rnd()'));
});

test('Malformed household records normalize without duplicate IDs or unsafe preferences',()=>{
 const g=game({'fwoosh.save2.meta':JSON.stringify({v:1,saved:4,society:{v:1,nextId:1,residents:[null,{id:1,kind:'keith',preference:'palace',home:-3,events:[null,{kind:'death'},{kind:'arrival',at:-3}]},{id:1,kind:'baker'}, {id:2,kind:'child'}]}})});
 assert.equal(g.run('META.society.residents.length'),2);assert.equal(g.run('META.society.nextId'),3);
 assert.equal(g.run('META.society.residents[0].kind'),'ratkin');assert.equal(g.run('META.society.residents[0].preference'),'either');
 assert.equal(g.run('META.society.residents[0].events.length'),1);
});
const householdCity=`META.city={v:1,lastAt:1000,roads:['2,4','2,3'],materials:0,food:4,nextId:4,buildings:[
 {id:1,type:'burrow',x:1,y:4,state:'sealed',remaining:0,work:0,priority:1},
 {id:2,type:'apartment',x:3,y:4,state:'sealed',remaining:0,work:0,priority:1},
 {id:3,type:'farm',x:1,y:3,state:'sealed',remaining:0,work:0,priority:1}]}`;
test('Automatic housing respects preferences, apartment capacity and child care',()=>{
 const g=game();g.run(householdCity+';for(const id of [5,9,3,7,8,11])societyArrive({id});societySync()');
 assert.equal(g.run('META.society.residents[0].home'),1);assert.equal(g.run('META.society.residents[1].home'),2);
 assert.equal(g.run('META.society.residents[2].home'),0);assert.equal(g.run('cityWorkerCapacity()'),4);
 assert.equal(g.run('META.society.residents.filter(r=>r.home===2).length'),3);
 assert.equal(g.run('societyHappiness(META.society.residents[2])'),80);
 assert.equal(g.run('societyHappiness(META.society.residents[0])'),95);
});
test('Empty housing and children alone never create a workforce',()=>{
 const g=game();g.run(householdCity);assert.equal(g.run('cityWorkerCapacity()'),0);
 g.run('societyArrive({id:3});societySync()');assert.equal(g.run('cityWorkerCapacity()'),0);assert.equal(g.run('cityAssignedStations().length'),0);
});
test('Preferred homes improve actual production and the exact resident works the station',()=>{
 const g=game();g.run(householdCity+';societyArrive({id:7});societySync()');
 assert.equal(g.run('societyStationResident(cityBuilding(3)).kind'),'weaver');assert.equal(g.run('cityCycleSeconds(cityBuilding(3))'),41.7);
 g.run('cityAdvance(META.city.lastAt+41700,true)');assert.equal(g.run('META.city.producedFood'),1);
 g.run("Object.assign(MAKKO_ANIM_IMG.weaver_walk,{complete:true,naturalWidth:3000});drawCityCarriers(ctx,80,154,112)");
 assert.ok(g.drawnImages.some(i=>i.src.endsWith('/weaver_walk.png')));
});
test('An existing household moves to a preferred vacancy without losing its chronicle',()=>{
 const g=game();g.run(householdCity+';META.city.buildings[0].state="ready";societyArrive({id:7});societySync()');
 assert.equal(g.run('META.society.residents[0].home'),2);assert.equal(g.run('societyHappiness(META.society.residents[0])'),85);
 g.run('META.city.buildings[0].state="sealed";societySync();societySync()');
 assert.equal(g.run('META.society.residents[0].home'),1);assert.equal(g.run('META.society.residents[0].events.length'),3);
 g.run('META.saved=1;saveMeta()');const reload=game(Object.fromEntries(g.storage));reload.run('societySync()');assert.equal(reload.run('META.society.residents[0].events.length'),3);
});
test('Moving a house preserves tenancy and does not duplicate move-in milestones',()=>{
 const g=game();g.run(householdCity+';societyArrive({id:5});societySync();META.city.lastAt=Date.now();cityMoveCell(1,4);cityMoveCell(3,3);societySync()');
 assert.equal(g.run('META.society.residents[0].home'),1);assert.equal(g.run('META.society.residents[0].events.length'),2);assert.equal(g.run('cityBuilding(1).x'),3);
});
test('Apartment construction, sealing and household tenancy survive reload',()=>{
 const g=game();g.run('for(let i=0;i<5;i++){societyArrive({id:0});META.saved++;}META.embers=200;cityTool="apartment";cityCellAct(1,4)');
 assert.equal(g.run('META.embers'),100);g.run('cityAdvance(META.city.lastAt+180000,true);citySeal(1)');
 assert.equal(g.run('META.embers'),50);assert.equal(g.run('cityWorkerCapacity()'),3);g.run('saveMeta()');
 const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('cityBuilding(1).type'),'apartment');assert.equal(reload.run('cityWorkerCapacity()'),3);
});
test('Apartments count equally for restoration and the Hearth vote',()=>{
 const g=game();g.run(completeJudgmentCity+';META.saved=19;META.clearedDistricts=5;META.city.buildings[0].type="apartment"');
 assert.equal(g.run('judgmentReady()'),true);g.run('META.judgment.heard=true;favorBegin();META.city.buildings.push({id:6,type:"apartment",x:3,y:2,state:"sealed",remaining:0,work:0});favorEvaluate(false)');
 assert.equal(g.run('META.judgment.votes.includes("hearth")'),true);
});
test('Sanctuary and household views route through hub actions with complete records',()=>{
 const g=game();g.run('societyArrive({id:5});onTitle=false;mode="hub";cityAction("society");drawCitySheet(ctx)');
 assert.equal(g.run('cityView'),'society');assert.ok(g.drawnText.includes('SANCTUARY'));assert.ok(g.run('hubBtns.some(b=>JSON.stringify(b).includes("household:1"))'));
 g.run('cityAction("household:1");drawCitySheet(ctx)');assert.ok(g.drawnText.includes('HOUSEHOLD CHRONICLE'));assert.ok(g.drawnText.some(t=>t.includes('Ascended from the fire.')));
});


test('Resident welcome celebrations persist and open as a sanctuary vignette',()=>{
 const g=game();g.run('societyArrive({id:5});saveMeta()');
 assert.equal(g.run('META.society.residents[0].profileId'),'');
 assert.equal(g.run('META.society.celebrations.length'),1);
 const reload=game(Object.fromEntries(g.storage));
 assert.equal(reload.run('META.society.celebrations[0].residentIds[0]'),1);
 reload.run('onTitle=false;mode=\"hub\";cityAction(\"society\");drawCitySheet(ctx)');
 assert.ok(reload.run('hubBtns.some(b=>JSON.stringify(b).includes(\"celebration:1\"))'));
 reload.run('cityAction(\"celebration:1\");drawCitySheet(ctx)');
 assert.equal(reload.run('cityView'),'celebration');assert.ok(reload.drawnText.includes('WELCOME GATHERING'));
});

test('Authored profile registry assigns stable identity and conditional chronicle text',()=>{
 const g=game();g.run(`SOCIETY_PROFILES.ashka={name:'Ashka',formerRole:'Forest pathfinder',chronicleIntro:'She remembers every road song.',milestones:{first_home:'Ashka marks the doorway with a song from the old road.'}};SOCIETY_PROFILE_ORDER.push('ashka');societyArrive({id:5});societySelected=1`);
 assert.equal(g.run('META.society.residents[0].profileId'),'ashka');assert.equal(g.run('societyLabel(META.society.residents[0])'),'Ashka');
 assert.equal(g.run('societyRecordMilestone(1,\"first_home\")'),true);assert.equal(g.run('societyRecordMilestone(1,\"first_home\")'),false);
 g.run('drawHousehold(ctx)');assert.ok(g.drawnText.some(t=>t.includes('Forest pathfinder')));assert.ok(g.drawnText.some(t=>t.includes('Ashka marks the doorway')));
 g.run('saveMeta()');const reload=game(Object.fromEntries(g.storage));reload.run(`SOCIETY_PROFILES.ashka={name:'Ashka',formerRole:'Forest pathfinder',chronicleIntro:'She remembers every road song.',milestones:{first_home:'Ashka marks the doorway with a song from the old road.'}};SOCIETY_PROFILE_ORDER.push('ashka');META.society=societyNormalize(META.society)`);
 assert.equal(reload.run('META.society.residents[0].profileId'),'ashka');assert.equal(reload.run('META.society.residents[0].events.filter(e=>e.kind===\"milestone\").length'),1);
});

test('Sanctuary portraits always crop a whole animation frame',()=>{
 const g=game();g.run("societyArrive({id:5});Object.assign(MAKKO_ANIM_IMG.farmer_idle,{complete:true,naturalWidth:2160});frame=43;societyDrawResident(ctx,META.society.residents[0],360,300,216)");
 const draw=g.drawnImages.at(-1);assert.equal(draw.src,'./media/anim/farmer_idle.png');assert.equal(draw.args[0]%180,0);
});
test('Household chronicle keeps older milestones accessible through paging',()=>{
 const g=game();g.run("societyArrive({id:5});societySelected=1;META.society.residents[0].events=Array.from({length:8},(_,i)=>({kind:'home',home:i+1,type:'burrow',at:0}));cityAction('chroniclepage:1');drawHousehold(ctx)");
 assert.ok(g.drawnText.some(t=>t.includes('(4)')));assert.ok(g.drawnText.some(t=>t.includes('(6)')));assert.ok(!g.drawnText.some(t=>t.includes('(1)')));
 assert.equal(g.run('META.society.residents[0].events.length'),8);
});

test('A newly rescued resident cannot produce resources for time before their arrival',()=>{
 const g=game();g.run(householdCity+';META.city.lastAt=Date.now()-8*60*60*1000;societyArrive({id:5});cityAdvance(Date.now(),true)');
 assert.equal(g.run('META.city.producedFood||0'),0);assert.equal(g.run('META.city.food'),4);
 g.run('cityAdvance(META.city.lastAt+50000,true)');assert.equal(g.run('META.city.producedFood'),1);
});

test('The approved save cutover deletes both old progress keys and starts fresh',()=>{
 const old={v:1,embers:9999,saved:500,district:5,clearedDistricts:5,emberLedger:{v:1,earned:88888,historyComplete:true},judgment:{released:true}};
 const g=game({'fwoosh.meta':JSON.stringify(old),'fwoosh.opp':JSON.stringify({terr:Array(48).fill(7),lat:[1],runs:50,duelWins:12,introVer:5}),'fwoosh.skin':'makko','another-game':'keep me'});
 assert.equal(g.storage.has('fwoosh.meta'),false);assert.equal(g.storage.has('fwoosh.opp'),false);
 assert.equal(g.run('META.embers'),0);assert.equal(g.run('META.saved'),0);assert.equal(g.run('META.district'),1);assert.equal(g.run('META.clearedDistricts'),0);
 assert.equal(g.run('META.emberLedger.earned'),0);assert.equal(g.run('META.society.residents.length'),0);assert.equal(g.run('META.judgment.released'),false);
 assert.equal(g.run('opp.runs'),0);assert.equal(g.run('opp.duelWins'),0);assert.equal(g.run('opp.introVer||0'),0);
 assert.equal(g.storage.get('fwoosh.skin'),'makko');assert.equal(g.storage.get('another-game'),'keep me');
});
test('Post-cutover currency, city, residents and dialogue persist across repeated reloads',()=>{
 const g=game();g.run('societyArrive({id:7});META.saved=1;META.embers=345;META.emberLedger.earned=345;META.dialogue={seen:{arrival:true},history:[]};META.city.materials=3;opp.runs=4;opp.introVer=5;saveMeta();saveOpp()');
 let saved=Object.fromEntries(g.storage);
 for(let i=0;i<3;i++){
  const reload=game(saved);assert.equal(reload.run('META.embers'),345);assert.equal(reload.run('META.emberLedger.earned'),345);assert.equal(reload.run('META.society.residents[0].kind'),'weaver');assert.equal(reload.run('META.city.materials'),3);assert.equal(reload.run('META.dialogue.seen.arrival'),true);assert.equal(reload.run('opp.runs'),4);assert.equal(reload.run('opp.introVer'),5);
  reload.run('saveMeta();saveOpp()');saved=Object.fromEntries(reload.storage);
 }
});
test('A stale old tab cannot resurrect progress or wipe the new generation',()=>{
 const g=game();g.run('META.embers=31;opp.runs=2;saveMeta();saveOpp()');
 g.storage.set('fwoosh.meta',JSON.stringify({v:1,embers:9999,saved:400}));g.storage.set('fwoosh.opp',JSON.stringify({terr:Array(48).fill(1),runs:500}));
 const reload=game(Object.fromEntries(g.storage));assert.equal(reload.run('META.embers'),31);assert.equal(reload.run('opp.runs'),2);assert.equal(reload.run('META.saved'),0);assert.equal(reload.storage.has('fwoosh.meta'),false);
});
test('Blocked retired-key deletion never imports or reconstructs old progress',()=>{
 const g=game({'fwoosh.meta':JSON.stringify({v:1,embers:999,saved:100}),'fwoosh.opp':JSON.stringify({terr:Array(48).fill(9),runs:50})},{blockRetiredRemoval:true});
 assert.equal(g.run('META.embers'),0);assert.equal(g.run('META.society.residents.length'),0);assert.equal(g.run('opp.runs'),0);
 g.run('META.embers=8;saveMeta()');const reload=game(Object.fromEntries(g.storage),{blockRetiredRemoval:true});assert.equal(reload.run('META.embers'),8);
});

test('Joystick vectors and physical radius stay consistent at three phone widths',()=>{
 for(const width of [320,390,430])for(const [dx,dy] of [[40,0],[-40,0],[0,40],[0,-40],[30,30],[-30,30],[30,-30],[-30,-30]]){
  const g=game();g.run(`innerWidth=${width};innerHeight=844;fit();onTitle=false;intro=null;introT=0;`);
  g.dispatch('pointerdown',{pointerType:'touch',pointerId:7,clientX:160,clientY:250});
  g.dispatch('pointermove',{pointerId:7,clientX:160+dx,clientY:250+dy});
  const v=g.run('heldVec()'),m=Math.hypot(dx,dy);assert.ok(Math.abs(v[0]-dx/m)<1e-9);assert.ok(Math.abs(v[1]-dy/m)<1e-9);
  assert.ok(Math.abs(g.run('Math.hypot(touchStick.x-touchStick.cx,touchStick.y-touchStick.cy)*scale')-36)<1e-9);
  g.dispatch('pointerup',{pointerId:7});assert.equal(g.run('player.charges'),2);assert.equal(g.run('heldVec()'),null);
 }
});
test('Mouse keeps its own gesture mode after the same device has used touch',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0;isTouch=true;player.x=360;player.y=640');
 const q=g.run('(()=>{const p=worldToScreen(620,640);return {clientX:p.x*scale,clientY:p.y*scale}})()');
 g.dispatch('pointerdown',{pointerType:'mouse',pointerId:8,...q});g.dispatch('pointerup',{pointerType:'mouse',pointerId:8,...q});
 assert.equal(g.run('ptr.swipe'),false);assert.equal(g.run('player.charges'),2);assert.ok(g.run('player.hx')<-.99);
});
test('Second fingers cannot dash, steal steering or commit on their own release',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0');
 g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:200,clientY:600});
 g.dispatch('pointermove',{pointerId:1,clientX:240,clientY:640});
 const aim=g.run('pointerBurstAim()');
 g.dispatch('pointerdown',{pointerType:'touch',pointerId:2,clientX:50,clientY:300});
 g.dispatch('pointermove',{pointerId:2,clientX:100,clientY:1100});g.dispatch('pointerup',{pointerId:2});
 assert.equal(g.run('player.charges'),3);assert.equal(g.run('touchStick.id'),1);
 g.dispatch('pointerup',{pointerId:1});assert.equal(g.run('player.charges'),2);
 assert.ok(Math.abs(g.run('player.hx')-aim.ux)<1e-9);assert.ok(Math.abs(g.run('player.hy')-aim.uy)<1e-9);
 g.run('player.dashCd=0');g.dispatch('pointerup',{pointerId:1});assert.equal(g.run('player.charges'),2);
});
test('A tap or tiny finger jitter never spends a charge',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0');
 for(const dx of [0,3]){
  g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:200,clientY:600});
  g.dispatch('pointermove',{pointerId:1,clientX:200+dx,clientY:600});
  g.dispatch('pointerup',{pointerId:1});assert.equal(g.run('player.charges'),3);
 }
});
test('Final release coordinates support quick swipes without a final move event',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0');
 g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:200,clientY:600});
 g.dispatch('pointerup',{pointerId:1,clientX:250,clientY:600});
 assert.equal(g.run('player.charges'),2);assert.ok(g.run('player.hx')>.99);
});
test('Release respects empty charges and cooldown without a delayed retry',()=>{
 for(const state of ['player.charges=0','player.dashCd=1']){
  const g=game();g.run('onTitle=false;intro=null;introT=0;'+state);const before=g.run('player.charges');
  g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:200,clientY:600});
  g.dispatch('pointermove',{pointerId:1,clientX:240,clientY:600});g.dispatch('pointerup',{pointerId:1});
  assert.equal(g.run('player.charges'),before);assert.equal(g.run('touchStick.id'),null);
  g.run('player.dashCd=0;player.charges=3');g.dispatch('pointerup',{pointerId:1});assert.equal(g.run('player.charges'),3);
 }
});
test('Canceled dragged touches never Burst and cannot fire on a later release',()=>{
 for(const action of ['pointercancel','lostpointercapture','blur','resize']){
  const g=game();g.run('onTitle=false;intro=null;introT=0');
  g.dispatch('pointerdown',{pointerType:'touch',pointerId:1,clientX:200,clientY:600});
  g.dispatch('pointermove',{pointerId:1,clientX:240,clientY:600});g.dispatch(action,{pointerId:1});
  g.dispatch('pointerup',{pointerId:1});assert.equal(g.run('player.charges'),3,action);assert.equal(g.run('heldVec()'),null);
 }
});
test('Actual contact frees a calm Ratkin for one heat and registers a full rescue',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0;hitstop=0;cells=[];husks=[];demons=[];arson=[];player.x=360;player.y=640;player.heat=1;player.hp=1;cells=[{id:99,villagerId:7,x:360,y:640,vx:0,vy:0,dir:0,ph:0,ps:1,grace:0,hunter:false}];step()');
 assert.equal(g.run('saved'),1);assert.equal(g.run('META.saved'),1);assert.equal(g.run('player.heat'),0);
 assert.equal(g.run('cells[0].saving'),true);assert.equal(g.run('META.society.residents[0].kind'),'weaver');
 assert.equal(g.run('runEmbers'),5);assert.equal(g.run('score'),180);
 g.run('hitstop=0;step()');assert.equal(g.run('saved'),1);
});
test('Zero or fractional heat cannot free calm or cinder Ratkin',()=>{
 for(const heat of [0,.5]){
 const g=game();g.run(`onTitle=false;intro=null;player.heat=${heat};const c={id:90,x:360,y:640,hunter:false};const h={villagerId:8,x:360,y:640};releaseCell(c);rekindleHusk(h)`);
 assert.equal(g.run('saved'),0);assert.equal(g.run('META.society.residents.length'),0);assert.equal(g.run('player.heat'),heat);
 }
});
test('Flaming contact still supplies heat when Duy starts empty',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0;hitstop=0;player.x=360;player.y=640;player.heat=0;cells=[{id:90,x:360,y:640,vx:0,vy:0,dir:0,ph:0,ps:1,grace:0,hunter:true,fuse:100}];step()');
 assert.equal(g.run('saved'),1);assert.equal(g.run('player.heat'),1);assert.equal(g.run('runEmbers'),3);
});
test('All three states award equal score, embers and Edge at the same incoming heat',()=>{
 const rewards=[];
 for(const state of ['flaming','calm','cinder']){
 const g=game();g.run('onTitle=false;intro=null;player.heat=2;edge=0;const c={id:91,villagerId:6,x:360,y:640,hunter:true};');
 g.run(state==='flaming'?'saveCell(c,false)':state==='calm'?'c.hunter=false;releaseCell(c)':'rekindleHusk(c)');
 rewards.push(g.run('JSON.stringify({score,runEmbers,edge,saved,total:META.saved,residents:META.society.residents.length})'));
 assert.equal(g.run('player.heat'),state==='flaming'?3:1);
 }
 assert.equal(rewards[0],rewards[1]);assert.equal(rewards[1],rewards[2]);
});
test('One heat cannot free two calm people and chains never free calm neighbors for free',()=>{
 const g=game();g.run('onTitle=false;intro=null;player.heat=1;const a={id:81,x:360,y:640,hunter:false};const b={id:82,x:362,y:640,hunter:false};releaseCell(a);releaseCell(a);releaseCell(b)');
 assert.equal(g.run('saved'),1);assert.equal(g.run('player.heat'),0);
 g.run('player.heat=2;const fire={id:83,x:360,y:640,hunter:true};cells=[fire,b];absorb(fire)');assert.equal(g.run('saved'),2);assert.equal(g.run('b.saving'),undefined);
});
test('A demon can supply the heat for rescue without anyone igniting',()=>{
 const g=game();g.run('onTitle=false;intro=null;introT=0;cells=[];husks=[];arson=[];player.x=360;player.y=640;player.heat=0;player.lunge=.1;demons=[{x:360,y:640,t:0,ttl:100,hitCd:0,source:"town",warn:0,ph:0}];stepDemons(DT);const c={id:80,x:360,y:640,hunter:false};releaseCell(c);pop("test")');
 assert.equal(g.run('demons.length'),0);assert.equal(g.run('META.saved'),1);assert.equal(g.run('player.heat'),0);
 assert.equal(g.run('META.recentRuns[0].earned'),7);assert.equal(g.run('META.emberLedger.earned'),7);
});
test('Cinder contact rescues in god mode, prevents consumption and preserves appearance',()=>{
 const g=game();g.run('onTitle=false;intro=null;god=true;cells=[];player.x=360;player.y=640;player.heat=1;const h={x:360,y:640,t:0,villagerId:10};husks=[h];demons=[{x:365,y:640,t:0,hitCd:0,source:"vent",warn:0,ph:0,feast:h,eatT:K.CINDER_EAT_T-DT/2}];stepHusks(DT);stepDemons(DT)');
 assert.equal(g.run('husks.length'),0);assert.equal(g.run('saved'),1);assert.equal(g.run('cinderBlasts.length'),0);assert.equal(g.run('META.society.residents[0].kind'),'herbalist');
});
test('Auto-run seeks affordable calm and cinder rescues, otherwise intercepts incoming fire',()=>{
 const g=game();g.run('cells=[{id:1,x:400,y:640,hunter:false,grace:0}];husks=[{x:600,y:640}];demons=[];arson=[{x:200,y:640}];player.x=360;player.y=640;player.heat=1');
 assert.equal(g.run('autoRunTarget(player)===cells[0]'),true);
 g.run('cells=[]');assert.equal(g.run('autoRunTarget(player)===husks[0]'),true);
 g.run('player.heat=0');assert.equal(g.run('autoRunTarget(player)===arson[0]'),true);
});
test('Calm rescue explains heat-powered ascension without claiming burning absorption',()=>{
 const g=game();g.run('onTitle=false;intro=null;player.heat=1;releaseCell({id:88,x:360,y:640,hunter:false});tickPresentDialogue(DT)');
 assert.equal(g.run('presentDialogue.id'),'ascend');assert.equal(g.run("presentEvents.rescue"),undefined);
});
test('Committed vent heat cannot also purchase a calm or cinder ascension',()=>{
 const g=game();g.run('onTitle=false;intro=null;player.heat=1;player.x=360;player.y=640;const calm={id:78,x:360,y:640,hunter:false};husks=[{x:360,y:640,t:0,villagerId:8}];setVentHeld(true);releaseCell(calm);stepHusks(DT)');
 assert.equal(g.run('saved'),0);assert.equal(g.run('husks.length'),1);assert.equal(g.run('player.heat'),1);
 g.run('player.heat=2;releaseCell(calm)');assert.equal(g.run('saved'),1);assert.equal(g.run('player.heat'),1);
 g.run('setVentHeld(false);ventHold(K.VENT_PURGE)');assert.equal(g.run('player.heat'),0);assert.equal(g.run('demons.length'),1);
});
test('Calm and cinder ascensions show the Ratkin animation without a burning overlay',()=>{
 for(const state of ['calm','cinder','flaming']){
  const g=game();g.run(`var flames=0;drawFlame=()=>{flames++;return true;};SKINS.makko.cell(ctx,300,500,{id:3,saving:true,saveT:0,rescueState:'${state}',vx:0})`);
  assert.equal(g.run('flames'),state==='flaming'?1:0);
 }
});
const report={checkpoint:root, generated_at:new Date().toISOString(), method:'Actual game scripts; VM; in-memory localStorage; targeted canvas-operation regressions; no visual-quality/audio/network/human-balance assessment.',
  source_sha256:Object.fromEntries(scripts.map(s=>[s.filename,crypto.createHash('sha256').update(s.code).digest('hex')])),
  pass:results.filter(r=>r.status==='pass').length, fail:results.filter(r=>r.status==='fail').length, results};
if(process.argv[3])fs.writeFileSync(path.resolve(process.argv[3]),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,fail:report.fail,results},null,2));
process.exitCode=report.fail?1:0;

