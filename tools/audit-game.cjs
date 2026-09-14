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
  const filename = src ? src[1] : 'index.html:inline';
  return [{filename, code: src ? fs.readFileSync(path.join(root, src[1]), 'utf8') : m[2]}];
});
function game(saved = {}) {
  const storage = new Map(Object.entries(saved));
  const noop = () => {};
  const drawnText = [];
  const listeners = {};
  const listen = (type, fn) => (listeners[type] ||= []).push(fn);
  const context2d = new Proxy({setTransform: noop, fillText: text => drawnText.push(String(text)),
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
  assert.equal(g.run('META.embers'),430); assert.equal(g.run('maxHearts'),8);
  const reload=game(Object.fromEntries(g.storage)); assert.equal(reload.run('maxHearts'),8);
  assert.equal(reload.run('META.embers'),430);
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
  assert.equal(reload.run('META.saved'),1); assert.equal(reload.run('META.embers'),earned);
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
test('A dash cancels venting and spends one charge', () => {
  const g=game();g.run('onTitle=false; intro=null; player.venting=true; lungeDir(1,0)');
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
test('Desktop keys steer, dash once on a held Shift, and do not rearm canceled vent', () => {
  const g=game();g.run('onTitle=false; intro=null; introT=0');
  g.dispatch('keydown',{key:'d'});g.dispatch('keydown',{key:' '});
  assert.equal(g.run('player.venting'),true);
  g.dispatch('keydown',{key:'Shift',repeat:false});
  g.dispatch('keydown',{key:'Shift',repeat:true});g.dispatch('keydown',{key:' ',repeat:true});
  assert.equal(g.run('player.charges'),2);assert.equal(g.run('player.venting'),false);
  assert.equal(g.run('player.hx'),1);
  g.dispatch('keyup',{key:'d'}); assert.equal(g.run('heldVec()'),null);
});
test('Touch vent starts and releases without consuming a dash', () => {
  const g=game();g.run('onTitle=false; intro=null; introT=0');
  const pt=g.run('({x:ventBtn().x*scale,y:ventBtn().y*scale})');
  g.dispatch('pointerdown',{pointerType:'touch',clientX:pt.x,clientY:pt.y});
  assert.equal(g.run('player.venting'),true);
  g.dispatch('pointerup');assert.equal(g.run('player.venting'),false);
  assert.equal(g.run('player.charges'),3);
});
test('Touch swipe uses one charge; its release does not add a second dash', () => {
  const g=game();g.run('onTitle=false; intro=null; introT=0');
  g.dispatch('pointerdown',{pointerType:'touch',clientX:100,clientY:200});
  g.dispatch('pointermove',{pointerType:'touch',clientX:250,clientY:200});g.dispatch('pointerup');
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
    g.run('for(let i=0;i<7200;i++){if(i%240===0)player.venting=!player.venting;if(i%60===0)lungeDir(Math.cos(i),Math.sin(i));step();if(!Number.isFinite(player.x+player.y+player.hp+META.embers+runEmbers))throw Error("non-finite simulation");}');
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

const report={checkpoint:root, generated_at:new Date().toISOString(), method:'Actual game scripts; VM; in-memory localStorage; no rendering/audio/network; no human balance assessment.',
  source_sha256:Object.fromEntries(scripts.map(s=>[s.filename,crypto.createHash('sha256').update(s.code).digest('hex')])),
  pass:results.filter(r=>r.status==='pass').length, fail:results.filter(r=>r.status==='fail').length, results};
if(process.argv[3])fs.writeFileSync(path.resolve(process.argv[3]),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,fail:report.fail,results},null,2));
process.exitCode=report.fail?1:0;
