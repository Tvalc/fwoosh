/* Run actual game scripts in an isolated VM with in-memory saves and a stubbed canvas.
 * This validates game state, not drawing, audio, browser input dispatch, or balance.
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
function game(saved = {}) {
  const storage = new Map(Object.entries(saved));
  const noop = () => {};
  const drawnText = [];
  const listeners = {};
  const listen = (type, fn) => (listeners[type] ||= []).push(fn);
  const gradient = () => ({addColorStop: noop});
  const context2d = new Proxy({setTransform: noop, fillText: text => drawnText.push(String(text)),
    createRadialGradient: gradient, createLinearGradient: gradient,
    measureText: text => ({width:String(text).length*10})}, {get: (o, k) => o[k] || noop});
  const canvas = {style: {}, getContext: () => context2d, addEventListener: listen,
    getBoundingClientRect: () => ({left: 0, top: 0})};
  const box = {console, URLSearchParams, location: {search: ''}, navigator: {maxTouchPoints: 0},
    localStorage: {getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, String(v)), removeItem: k => storage.delete(k)},
    document: {hidden: false, getElementById: () => canvas, createElement: () => canvas},
    Image: class {constructor(){this.complete=false; this.naturalWidth=0; this.width=0; this.height=0;}},
    requestAnimationFrame: noop, setTimeout: noop, clearTimeout: noop,
    innerWidth: 720, innerHeight: 1280, devicePixelRatio: 1, addEventListener: listen};
  box.window = box;
  const ctx = vm.createContext(box);
  for (const s of scripts) vm.runInContext(s.code, ctx, {filename:s.filename, timeout: 10000});
  return {run: code => vm.runInContext(code, ctx, {timeout: 10000}), storage, drawnText, dispatch(type, fields={}){ for(const fn of listeners[type]||[]) fn({preventDefault:noop, ...fields}); }};
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
  const g=game({'fwoosh.meta':'{bad','fwoosh.opp':'not-json'});
  assert.equal(g.run('META.district'),1); assert.equal(g.run('maxHearts'),5);
});
test('A partial v1 meta save retains progress and receives building defaults', () => {
  const g=game({'fwoosh.meta':JSON.stringify({v:1,embers:123,saved:8})});
  assert.equal(g.run('META.embers'),123); assert.equal(g.run('META.saved'),8);
  assert.equal(g.run('META.buildings.forge.charges'),0);
});
test('Legacy district saves migrate only the completion they prove', () => {
  for(let district=1;district<=5;district++){
    const old={v:1,embers:317,saved:55,bestBlaze:3,district,
      buildings:{well:{built:true,hearts:2,regen:1},forge:{built:true,charges:1,recharge:1}},
      diary:{read:['morning','gate']},hero:'stranger',flags:{reachedDuel:true}};
    const g=game({'fwoosh.meta':JSON.stringify(old)});
    assert.equal(g.run('META.clearedDistricts'),district-1);
    assert.equal(g.run('META.district'),district);assert.equal(g.run('META.embers'),317);
    assert.equal(g.run('META.saved'),55);assert.equal(g.run('maxHearts'),7);
    assert.equal(g.run('RUN_MAX_CHARGES'),4);assert.equal(g.run('META.diary.read.join(",")'),'morning,gate');
    assert.equal(g.run('META.flags.reachedDuel'),true);
    g.run('saveMeta()');const reloaded=game(Object.fromEntries(g.storage));
    assert.equal(reloaded.run('META.clearedDistricts'),district-1);
  }
});
test('Many old wins do not falsely complete the unlocked fifth district', () => {
  const g=game({'fwoosh.meta':JSON.stringify({v:1,district:5}),
    'fwoosh.opp':JSON.stringify({terr:Array(48).fill(0),lat:[],runs:30,duelWins:25})});
  assert.equal(g.run('META.clearedDistricts'),4);
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
    g.run(`selDistrict=5; reset(100); onTitle=false; intro=null; god=true; startDuel(); boss.state='evade'; startKeithMove(boss,${JSON.stringify(move)}); for(let i=0;i<360;i++){boss.moveT+=DT; runKeithMove(boss,DT)}`);
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

test('Touch swipe uses one charge; its release does not add a second dash', () => {
  const g=game();g.run('onTitle=false; intro=null; introT=0');
  g.dispatch('pointerdown',{pointerType:'touch',clientX:200,clientY:600});
  g.dispatch('pointermove',{pointerType:'touch',clientX:350,clientY:600});g.dispatch('pointerup');
  assert.equal(g.run('player.charges'),2);assert.equal(g.run('ptr.down'),false);
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
  assert.equal(reload.run('RUN_HP_REGEN'),g.run('K.HP_REGEN+0.1'));
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

test('Title boot does not consume the live intro; first start gives control during Keith dialogue', () => {
  const g=game();
  assert.notEqual(g.run('opp.introVer'),g.run('INTRO_VERSION'));
  g.run('onDown(360,1100)');
  assert.equal(g.run('intro.phase'),'talk');
  assert.equal(g.run('intro.i'),0);
  assert.equal(g.run('introT'),0);
  g.dispatch('keydown',{key:'d'});
  const x=g.run('player.x');g.run('step()');
  assert.ok(g.run('player.x')>x,'Player must move while Keith speaks');
  g.dispatch('keydown',{key:'Shift',repeat:false});
  assert.equal(g.run('player.charges'),2,'Dialogue must not block dashing');
  g.run('player.heat=1');g.dispatch('keydown',{key:' ',repeat:false});
  assert.equal(g.run('player.venting'),true,'Dialogue must not block venting');
});

test('Updated intro replays once for an older save while preserving progression and diary reads', () => {
  const g=game();g.run('META.embers=432;META.district=4;META.clearedDistricts=3;diaryMarkRead("morning");saveMeta();opp.introVer=2;saveOpp()');
  const before=g.storage.get('fwoosh.meta');
  const reload=game(Object.fromEntries(g.storage));
  assert.equal(reload.storage.get('fwoosh.meta'),before);
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
test('Vent demons persist after release and into Keith encounter; new run clears them', () => {
  const g=game();g.run('onTitle=false;intro=null;god=true;husks=[];spawnVentDemon();setVentHeld(false);for(let i=0;i<1000;i++)stepDemons(DT)');
  assert.equal(g.run('demons.length'),1);g.run('startDuel()');assert.equal(g.run('demons.length'),1);
  g.run('reset()');assert.equal(g.run('demons.length'),0);assert.equal(g.run('player.ventUnit'),null);
});
test('Each completed unit spawns even above the old demon cap; emergence cannot bite', () => {
  const g=game();g.run('onTitle=false;intro=null;player.hp=0.2;for(let i=0;i<12;i++){player.heat=1;setVentHeld(true);setVentHeld(false);ventHold(K.VENT_PURGE);}');
  assert.equal(g.run('demons.length'),12);
  g.run('for(const d of demons){d.x=player.x;d.y=player.y;}stepDemons(DT)');assert.equal(g.run('player.hp'),0.2);
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
  const g=game({'fwoosh.meta':JSON.stringify({v:1,embers:9,saved:4,flags:null})});
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
test('Vent kills award zero embers while preserving heat and Edge; other sources retain payouts', () => {
  const g=game();g.run('onTitle=false;intro=null;player.heat=0;runEmbers=0;killDemon({source:"vent",x:300,y:400})');
  assert.equal(g.run('runEmbers'),0);assert.equal(g.run('player.heat'),0.5);assert.equal(g.run('edge'),0.25);
  assert.ok(g.run('callout.text.includes("NO EMBERS")'));
  for(const source of ['town','keith']){g.run(`killDemon({source:${JSON.stringify(source)},x:300,y:400})`);}
  assert.equal(g.run('runEmbers'),4);
  g.run('killDemon({x:300,y:400})');assert.equal(g.run('runEmbers'),6);
});

test('Every ordinary reward source pays its full amount across and beyond the former 160 cap', () => {
  for(const start of [159,160,500]){
    const g=game();g.run(`onTitle=false;intro=null;runEmbers=${start};player.heat=2;saveCell(cells[0],true)`);
    assert.equal(g.run('runEmbers'),start+6,'High-heat rescue must pay all six embers');
    g.run('player.lunge=0;interceptArson({x:300,y:400});player.lunge=.1;interceptArson({x:300,y:400})');
    assert.equal(g.run('runEmbers'),start+16,'Walking and dashing interceptions must pay four and six');
    g.run('player.heat=1;rekindleHusk({x:300,y:400})');assert.equal(g.run('runEmbers'),start+18);
    for(const source of ['town','keith'])g.run(`killDemon({source:${JSON.stringify(source)},x:300,y:400})`);
    g.run('killDemon({x:300,y:400});killDemon({source:"vent",x:300,y:400})');
    assert.equal(g.run('runEmbers'),start+24,'Three other demons pay two each; vent pays zero');
  }
});
test('Uncapped loss earnings bank once, render honestly, persist and leave old upgrades intact', () => {
  const g=game({'fwoosh.meta':JSON.stringify({v:1,embers:37,saved:16,district:3,buildings:{well:{built:true,hearts:1}}})});
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
  g.run('META.saved=6');assert.equal(g.run('upgradeGoal().name'),'COOL BLOOD');
  g.run('META.buildings.well.regen=1;META.saved=16');
  assert.equal(g.run('upgradeGoal().name'),'QUICK FEET');assert.equal(g.run('upgradeGoal().cost'),100);
  g.run('META.buildings.well.hearts=3;META.buildings.well.regen=2;META.buildings.forge.charges=3;META.buildings.forge.recharge=2');
  assert.equal(g.run('upgradeGoal()'),null);
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
  const g=game({'fwoosh.meta':JSON.stringify({v:1,recentRuns:null})});
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
  assert.equal(g.run('rescueReward.count'),3);assert.equal(g.run('rescueReward.embers'),14);
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
    if(hot)g.run('killDemon({source:"town",x:300,y:400});killDemon({source:"keith",x:300,y:400})');
    return g.run('runEmbers');}
  const ordinary=[7,8,9].map(n=>profile(n,false)),skilled=[9,10,11].map(n=>profile(n,true));
  assert.deepEqual(ordinary,[44,50,55]);assert.deepEqual(skilled,[88,97,105]);
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
 const g=game();g.run("onTitle=false;reset();intro=null;elapsed=20;startPresentDialogue('rescue');speakKeith('No interruption')");
 assert.equal(g.run('presentDialogue.id'),'rescue');g.run("presentDialogue=null;presentCount=2;notePresentEvent('rescue');tickPresentDialogue(DT)");assert.equal(g.run('presentDialogue'),null);
});
test('Return after death is not delivered after a win and never freezes the street',()=>{
 const g=game();g.run("onTitle=false;reset();intro=null;opp.introVer=INTRO_VERSION;opp.runs=1;opp.terr[0]=10;META.recentRuns=[{won:true}];reset();elapsed=5;tickPresentDialogue(DT)");
 assert.equal(g.run('introT'),0);assert.equal(g.run('presentDialogue'),null);
 g.run('META.recentRuns=[{won:false}];tickPresentDialogue(DT)');assert.equal(g.run('presentDialogue.id'),'return');
});
test('Conversation archive excludes unrevealed text and tolerates old malformed saves',()=>{
 const g=game({'fwoosh.meta':JSON.stringify({v:1,embers:17,dialogue:{seen:null,history:[null,3,{who:'UNKNOWN',text:'bad'}]}})});
 g.run("enterHub();hubAct('conversations');drawConversationSheet(ctx)");
 assert.equal(g.run('dialogueSave().history.length'),0);assert.equal(g.run('META.embers'),17);
 assert.ok(!g.drawnText.includes(g.run('PRESENT.release[1].text')));
 g.run("rememberDialogue(PRESENT.rescue[0]);drawConversationSheet(ctx)");assert.ok(g.drawnText.includes(g.run('PRESENT.rescue[0].text')));
});
test('Present dialogue contains no past-life reveals and all templates use named speakers',()=>{
 const g=game();const lines=g.run('Object.values(PRESENT).flat()');
 assert.ok(lines.every(l=>['DUY','KEITH'].includes(l.who)&&l.emotion&&l.text.length<100));
 assert.ok(lines.every(l=>!(/Mei|Cuong|Diep|nineteen|brother|Adonai|Odin|gunman|gate/i.test(l.text))));
 assert.equal(g.run('STORY.lore.length'),0);
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
 g.run('onDown(300,600);onMove(400,600);onUp()');assert.equal(g.run('player.charges'),2);
});
test('Tap directions track rendered world targets at phone and desktop sizes',()=>{
 for(const width of [320,375,430,1280])for(const [x,y] of [[100,40],[620,40],[100,1240],[620,1240]]){
  const g=game();g.run(`innerWidth=${width};innerHeight=900;fit();onTitle=false;intro=null;introT=0;player.x=360;player.y=640`);
  const q=g.run(`(()=>{const p=worldToScreen(${x},${y});return {clientX:p.x*scale,clientY:p.y*scale};})()`);
  g.dispatch('pointerdown',q);g.dispatch('pointerup');
  assert.equal(g.run('player.charges'),2);
  const m=Math.hypot(x-360,y-640);assert.ok(Math.abs(g.run('player.hx')-(x-360)/m)<1e-9);assert.ok(Math.abs(g.run('player.hy')-(y-640)/m)<1e-9);
 }
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

const report={checkpoint:root, generated_at:new Date().toISOString(), method:'Actual game scripts; VM; in-memory localStorage; no rendering/audio/network; no human balance assessment.',
  source_sha256:Object.fromEntries(scripts.map(s=>[s.filename,crypto.createHash('sha256').update(s.code).digest('hex')])),
  pass:results.filter(r=>r.status==='pass').length, fail:results.filter(r=>r.status==='fail').length, results};
if(process.argv[3])fs.writeFileSync(path.resolve(process.argv[3]),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,fail:report.fail,results},null,2));
process.exitCode=report.fail?1:0;
