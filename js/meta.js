// DISTRICTS: 5 escalating quarters of Ashford. Clearing one (beating its Keith) unlocks the next.
// selDistrict = the one you're about to play (pick any unlocked); runDistrict = the one this run IS.
const DISTRICTS = ['MARKET ROW', 'THE ROWHOUSES', 'THE OLD MILL', 'THE CHAPEL', "KEITH'S HOUSE"];
let selDistrict = 1, runDistrict = 1, runQuota = 12;

// ---- META: persistent progression, all minted by SAVING villagers. Separate key from opp; per-field
// defaults so an old/partial blob degrades instead of crashing.
function loadMeta(){
  let s=null; try{ s=JSON.parse(localStorage.getItem('fwoosh.meta')); }catch(e){}
  const d = { v:1, embers:0, saved:0, bestBlaze:0, district:1, clearedDistricts:0,
    buildings:{ well:{ built:false, hearts:0, regen:0 }, forge:{ built:false, charges:0, recharge:0 }, shrine:{ built:true } },
    hero:'stranger', diary:{ read:[] }, flags:{}, recentRuns:[] };
  if(!s || s.v!==1) return d;
  // Old saves prove only the districts BEFORE the highest unlocked one were cleared.
  // Keep v1 saves compatible; district 5 being unlocked does not prove it was beaten.
  s.district = Math.max(1, Math.min(5, Math.trunc(Number(s.district)||1)));
  s.clearedDistricts = Math.max(s.district-1,
    Math.max(0, Math.min(5, Math.trunc(Number(s.clearedDistricts)||0))));
  s.buildings = s.buildings || {};
  s.buildings.well  = Object.assign({}, d.buildings.well,  s.buildings.well||{});
  s.buildings.forge = Object.assign({}, d.buildings.forge, s.buildings.forge||{});
  s.buildings.shrine = Object.assign({}, d.buildings.shrine, s.buildings.shrine||{});
  s.flags = Object.assign({}, s.flags||{});
  s.recentRuns = Array.isArray(s.recentRuns) ? s.recentRuns.slice(-20) : [];
  s.diary = Object.assign({}, d.diary, s.diary||{});
  return Object.assign({}, d, s);
}
function saveMeta(){ try{ localStorage.setItem('fwoosh.meta', JSON.stringify(META)); }catch(e){} }
// apply purchased upgrades to this run's stats (called at the top of reset() + after a purchase).
function applyUpgrades(){
  const w=(META.buildings&&META.buildings.well)||{}, f=(META.buildings&&META.buildings.forge)||{};
  maxHearts        = 5 + (w.hearts||0);                       // more hearts -> drain auto-slows via 5/maxHearts
  RUN_HP_REGEN     = K.HP_REGEN + 0.05*(w.regen||0);          // faster recovery while clear of fire
  RUN_MAX_CHARGES  = K.CHARGES + (f.charges||0);              // The Forge: more dash charges
  RUN_CHARGE_REFILL= K.CHARGE_REFILL * Math.pow(0.82, f.recharge||0);  // ...and they recharge faster
}
// Building shops — generic. Each building is a set of ember-bought tiers.
const SHOPS = {
  well:  { title:'THE WELL',  color:'#7fe8ff', sub:'saves raised the shell — embers pay for the rest', items:[
    { track:'hearts', name:'DEEP WELL',  desc:'+1 max heart (survive more fire)', costs:[100,240,540] },
    { track:'regen',  name:'COOL BLOOD', desc:'recover faster when clear of fire', costs:[100,240] } ] },
  forge: { title:'THE FORGE', color:'#ff9a45', sub:'iron for the road — dash more, recharge quicker', items:[
    { track:'charges',  name:'QUICK FEET',  desc:'+1 dash charge', costs:[100,240,540] },
    { track:'recharge', name:'SECOND WIND', desc:'dashes recharge faster', costs:[100,240] } ] },
};
function buy(building, track){
  const shop=SHOPS[building], b=META.buildings[building], item=shop&&shop.items.find(s=>s.track===track);
  if(!b||!item) return; const tier=b[track]||0;
  if(tier>=item.costs.length || META.embers<item.costs[tier]) return;
  META.embers-=item.costs[tier]; b[track]=tier+1; saveMeta(); applyUpgrades();
  hubToast=2.0; hubToastMsg=item.name+' UP';
}
// The first permanent upgrade is a one-time choice before building shops unlock.
const STARTER_COST=20;
const STARTER_OPTIONS={
  hearts:{building:'well',track:'hearts',title:'MORE SURVIVABILITY',name:'DEEP WELL',icon:'heart',color:'#86dfff',
    benefit:'5 hearts → 6 hearts',description:'Carry fire longer before you need to heal.'},
  charges:{building:'forge',track:'charges',title:'BETTER MOBILITY',name:'QUICK FEET',icon:'ui_charge',color:'#ffbb70',
    benefit:'3 dash charges → 4 charges',description:'One more dash to rescue, intercept or escape.'}
};
function hasPermanentUpgrade(){
  const b=META.buildings;
  return ['hearts','regen'].some(k=>(b.well[k]||0)>0) || ['charges','recharge'].some(k=>(b.forge[k]||0)>0);
}
function starterAvailable(){
  return !!META.flags.starterReady && !META.flags.starterChosen && !hasPermanentUpgrade();
}
function prepareStarterOffer(){
  if(META.flags.starterChecked) return;
  META.flags.starterChecked=true;
  if(hasPermanentUpgrade()) return; // existing purchases and balances keep their meaning
  META.flags.starterReady=true;
  runStarterBonus=Math.max(0,STARTER_COST-META.embers);
  META.embers+=runStarterBonus;
  META.flags.starterBonus=runStarterBonus;
}
function buyStarter(key){
  const option=STARTER_OPTIONS[key];
  if(mode!=='hub' || !option || !starterAvailable() || META.embers<STARTER_COST) return;
  META.embers-=STARTER_COST;
  META.buildings[option.building][option.track]=1;
  META.flags.starterChosen=key;
  saveMeta();applyUpgrades();hubSheet=null;hubBtns=[];
  hubToast=3;hubToastMsg=option.name+' UP — READY FOR YOUR NEXT RUN';
}

// Choose the cheapest reachable purchase across BOTH shops; never hide a cheaper track.
function upgradeGoal(){
  if(!hasPermanentUpgrade() && (!META.flags.starterChecked || starterAvailable()))
    return {kind:'embers',name:'FIRST UPGRADE',cost:STARTER_COST,act:'starter'};
  const choices=[];
  for(const [key,shop] of Object.entries(SHOPS)){
    const b=META.buildings[key], at=key==='well'?K.WELL_RISE:K.FORGE_RISE;
    if(!b.built && META.saved<at) continue;
    for(const item of shop.items){const tier=b[item.track]||0;
      if(tier<item.costs.length)choices.push({kind:'embers',name:item.name,cost:item.costs[tier],act:key});}
  }
  if(choices.length)return choices.sort((a,b)=>a.cost-b.cost)[0];
  if(!META.buildings.well.built && META.saved<K.WELL_RISE)return {kind:'saves',name:'RAISE THE WELL',cost:K.WELL_RISE};
  if(!META.buildings.forge.built && META.saved<K.FORGE_RISE)return {kind:'saves',name:'RAISE THE FORGE',cost:K.FORGE_RISE};
  return null;
}
function goalAmount(goal){return goal.kind==='saves'?META.saved:META.embers+(mode==='play'&&!onTitle?runEmbers:0);}
function openNextUpgrade(){const goal=upgradeGoal();if(goal && goal.act)hubAct(goal.act);}

// land in the town after a run; raise any building whose saves-milestone you just crossed
function enterHub(){
  mode='hub'; hubScroll=0; hubSheet=null; wellJustRose=false;
  selDistrict = Math.min(5, Math.max(1, META.district||1));   // default the picker to your deepest unlocked
  if(districtCleared){ hubToast=3.4; hubToastMsg=DISTRICTS[Math.min(4,(META.district||1)-1)]+' UNLOCKED'; districtCleared=false; }
  const raised = [];
  const rise=(key,at,name)=>{ const b=META.buildings[key];
    if(b&&!b.built&&META.saved>=at){ b.built=true; raised.push(name); } };
  rise('well', K.WELL_RISE, 'THE WELL');
  rise('forge', K.FORGE_RISE, 'THE FORGE');
  if(raised.length){ wellJustRose=true; hubToast=raised.length>1 ? 4.5 : 3.2;
    hubToastMsg=raised.join(' + ')+(raised.length>1 ? ' STAND AGAIN' : ' STANDS AGAIN'); }
  saveMeta();
  if(starterAvailable()) hubSheet='starter';
}

let META = loadMeta();
