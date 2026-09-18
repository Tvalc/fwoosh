// DISTRICTS: 5 escalating quarters of Ashford. Clearing one (facing its Arbiter) unlocks the next.
// selDistrict = the one you're about to play (pick any unlocked); runDistrict = the one this run IS.
const DISTRICTS = ['MARKET ROW', 'THE ROWHOUSES', 'THE OLD MILL', 'THE CHAPEL', "THE ARBITER'S GATE"];
let selDistrict = 1, runDistrict = 1, runQuota = 12;

// Lifetime credit starts with this save generation; never reconstruct old earnings.
function emberCount(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(Number.MAX_SAFE_INTEGER,Math.trunc(n))):0;}
function normalizeEmberLedger(value){
  if(value&&value.v===1&&Number.isSafeInteger(value.earned)&&value.earned>=0){
    return {v:1,earned:value.earned,historyComplete:value.historyComplete===true};
  }
  return {v:1,earned:0,historyComplete:false}; // Damaged current record, not historical credit.
}
function recordEarnedEmbers(amount){
  META.emberLedger.earned=Math.min(Number.MAX_SAFE_INTEGER,META.emberLedger.earned+emberCount(amount));
}

// ---- META: persistent progression, all minted by SAVING villagers. Separate key from opp; per-field
// defaults so an old/partial blob degrades instead of crashing.
function loadMeta(){
  let s=null; try{ s=JSON.parse(localStorage.getItem(SAVE_KEYS.meta)); }catch(e){}
  const d = { v:1, embers:0, saved:0, bestBlaze:0, district:1, clearedDistricts:0,
    buildings:{ well:{ built:false, hearts:0, regen:0 }, forge:{ built:false, charges:0, recharge:0 }, shrine:{ built:true } },
    hero:'stranger', diary:{ read:[] }, flags:{}, recentRuns:[], city:cityFresh(), society:societyFresh(),
    emberLedger:{v:1,earned:0,historyComplete:true},
    judgment:{eligible:false,heard:false,favorBegun:false,baseSaved:0,baseFood:0,baseMaterials:0,
      baseBurrows:0,baseDuelWins:0,baseEmbers:0,votes:[],voteTiers:{},securedAt:{},revokedVotes:[],verdictReady:false,verdictHeard:false,released:false,unanimous:false,pledgeReady:false} };
  if(!s || s.v!==1) return d;
  // Current saves record clears explicitly; never reconstruct them from unlocks.
  s.district = Math.max(1, Math.min(5, Math.trunc(Number(s.district)||1)));
  s.clearedDistricts = Math.max(0, Math.min(5, Math.trunc(Number(s.clearedDistricts)||0)));
  s.buildings = s.buildings || {};
  s.buildings.well  = Object.assign({}, d.buildings.well,  s.buildings.well||{});
  s.buildings.forge = Object.assign({}, d.buildings.forge, s.buildings.forge||{});
  s.buildings.shrine = Object.assign({}, d.buildings.shrine, s.buildings.shrine||{});
  s.flags = Object.assign({}, s.flags||{});
  s.recentRuns = Array.isArray(s.recentRuns) ? s.recentRuns.slice(-20) : [];
  s.emberLedger = normalizeEmberLedger(s.emberLedger);
  s.diary = Object.assign({}, d.diary, s.diary||{});
  s.city = cityNormalize(s.city);
  s.society = societyNormalize(s.society);
  s.judgment = Object.assign({}, d.judgment, s.judgment||{});
  for(const key of ['eligible','heard','favorBegun','verdictReady','verdictHeard','released','unanimous'])s.judgment[key]=!!s.judgment[key];
  for(const key of ['baseSaved','baseFood','baseMaterials','baseBurrows','baseDuelWins','baseEmbers'])s.judgment[key]=Math.max(0,Math.trunc(Number(s.judgment[key])||0));
  const validVotes=new Set(['hearth','bowl','hand','claw','memory']);
  s.judgment.votes=[...new Set((Array.isArray(s.judgment.votes)?s.judgment.votes:[]).filter(v=>validVotes.has(v)))];
  s.judgment.voteTiers=Object.fromEntries(Object.entries(s.judgment.voteTiers||{}).filter(([k,v])=>validVotes.has(k)&&[1,2,3].includes(Math.trunc(Number(v)))).map(([k,v])=>[k,Math.trunc(Number(v))]));
  s.judgment.securedAt=Object.fromEntries(Object.entries(s.judgment.securedAt||{}).filter(([k,v])=>validVotes.has(k)&&Number.isFinite(Number(v))).map(([k,v])=>[k,Number(v)]));
  s.judgment.revokedVotes=[...new Set((Array.isArray(s.judgment.revokedVotes)?s.judgment.revokedVotes:[]).filter(v=>validVotes.has(v)))];
  for(const vote of s.judgment.votes)if(!s.judgment.voteTiers[vote])s.judgment.voteTiers[vote]=1;
  if(s.judgment.votes.length>=4)s.judgment.verdictReady=true;
  if(s.judgment.votes.length===5)s.judgment.unanimous=true;
  s.judgment.pledgeReady=!!s.judgment.pledgeReady;
  if(s.judgment.released){s.judgment.verdictReady=true;s.judgment.verdictHeard=true;}
  return Object.assign({}, d, s);
}
function saveMeta(){ try{ localStorage.setItem(SAVE_KEYS.meta, JSON.stringify(META)); }catch(e){} }
// apply purchased upgrades to this run's stats (called at the top of reset() + after a purchase).
function applyUpgrades(){
  const w=(META.buildings&&META.buildings.well)||{}, f=(META.buildings&&META.buildings.forge)||{};
  maxHearts        = 5 + (w.hearts||0);                       // more hearts -> drain auto-slows via 5/maxHearts
  RUN_HP_REGEN     = K.HP_REGEN;                              // faint recovery remains a base rule
  RUN_VENT_HEAL_T  = Math.max(0.40, K.VENT_HEAL_T - 0.10*(w.regen||0)); // old regen tiers become faster risky heals
  RUN_MAX_CHARGES  = K.CHARGES + (f.charges||0);              // The Forge: more dash charges
  RUN_CHARGE_REFILL= K.CHARGE_REFILL * Math.pow(0.82, f.recharge||0);  // ...and they recharge faster
}
// Building shops — generic. Each building is a set of ember-bought tiers.
const SHOPS = {
  well:  { title:'THE WELL',  color:'#7fe8ff', sub:'saves raised the shell — embers pay for the rest', items:[
    { track:'hearts', name:'DEEP WELL',  desc:'+1 max heart (survive more fire)', costs:[100,240,540] },
    { track:'regen',  name:'DEEP DRAUGHT', desc:'restore each heart faster while venting', costs:[100,240] } ] },
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

// A functioning society earns a hearing, never automatic release. Khet-Tak-Tor
// convenes the record while the Ratkin retain the final decision.
let judgmentPage=0;
function judgmentTerms(){
  const c=cityData(), sealed=type=>citySealedConnectedCount(type);
  return [
    {id:'districts',label:'ASHFORD RECLAIMED',value:Math.min(5,META.clearedDistricts||0),need:5,done:(META.clearedDistricts||0)>=5},
    {id:'ascended',label:'RATKIN ASCENDED',value:Math.min(19,META.saved||0),need:19,done:(META.saved||0)>=19},
    {id:'homes',label:'SEALED HOMES',value:Math.min(2,societyHomeCount()),need:2,done:societyHomeCount()>=2},
    {id:'food',label:'FOOD FOR THE LIVING',value:(sealed('farm')>=1&&c.producedFood>=1)?1:0,need:1,done:sealed('farm')>=1&&c.producedFood>=1},
    {id:'work',label:'WORK AND STORES',value:(sealed('yard')>=1&&sealed('store')>=1&&c.producedMaterials>=1)?1:0,need:1,done:sealed('yard')>=1&&sealed('store')>=1&&c.producedMaterials>=1}
  ];
}
function judgmentReady(){return judgmentTerms().every(t=>t.done);}
function judgmentEvaluate(autoOpen=false){
  const j=META.judgment||(META.judgment={eligible:false,heard:false});
  if(!j.eligible&&judgmentReady()){
    j.eligible=true;saveMeta();hubToast=4;hubToastMsg='THE RATKIN SUMMON JUDGMENT';
  }
  if(autoOpen&&j.eligible&&!j.heard){judgmentPage=0;hubSheet='judgment';rememberDialogue(JUDGMENT_LINES[0]);}
  return j.eligible;
}
function judgmentOpen(){
  judgmentEvaluate(false);
  if(META.judgment.eligible&&!META.judgment.heard){judgmentPage=0;hubSheet='judgment';rememberDialogue(JUDGMENT_LINES[0]);}
  else hubSheet='shrine';
}
function judgmentAdvance(){
  if(hubSheet!=='judgment')return;
  if(judgmentPage<JUDGMENT_LINES.length-1){judgmentPage++;rememberDialogue(JUDGMENT_LINES[judgmentPage]);return;}
  META.judgment.heard=true;favorBegin();saveMeta();hubSheet='shrine';hubToast=4;hubToastMsg='RESTORATION ACKNOWLEDGED · FIVE BLOCS WILL JUDGE';
}

// Favor begins only after the restoration hearing, so old accomplishments prove
// survival while new choices prove what Duy does with the society he restored.
const FAVOR_DEFS=[
  {id:'hearth',name:'THE HEARTH',role:'shelter',need:1,desc:'seal one more connected Burrow'},
  {id:'bowl',name:'THE BOWL',role:'sustenance',need:8,desc:'produce 8 food after the hearing'},
  {id:'hand',name:'THE HAND',role:'rebuilding',need:6,desc:'produce 6 materials after the hearing'},
  {id:'claw',name:'THE CLAW',role:'protection',need:12,desc:'ascend 12 Ratkin and win one trial'},
  {id:'memory',name:'THE MEMORY',role:'truth',need:DIARY.length,desc:'read Duy’s full diary'}
];
const FAVOR_KEY_ADVOCATES={hearth:['cit-022','cit-008'],bowl:['cit-003','cit-017'],hand:['cit-005','cit-021'],claw:['cit-015','cit-020'],memory:['cit-016','cit-001']};
let verdictPage=0,verdictScene=[];
function favorBegin(){
  const j=META.judgment;if(!j.heard||j.favorBegun)return false;
  const c=cityData();j.favorBegun=true;j.baseSaved=Math.max(0,META.saved||0);
  j.baseFood=Math.max(0,c.producedFood||0);j.baseMaterials=Math.max(0,c.producedMaterials||0);
  j.baseBurrows=societyHomeCount();j.baseDuelWins=Math.max(0,(typeof opp!=='undefined'&&opp.duelWins)||0);
  j.baseEmbers=Math.max(0,META.embers||0);j.votes=j.votes||[];j.voteTiers=j.voteTiers||{};societyBackfillProfiles(META.society);
  for(const resident of META.society.residents||[])societyEnsureDuyRelationship(resident);
  return true;
}
function favorProgress(){
  const j=META.judgment,c=cityData(),begun=!!j.favorBegun;
  const homes=Math.max(0,societyHomeCount()-(j.baseBurrows||0));
  const food=Math.max(0,(c.producedFood||0)-(j.baseFood||0));
  const materials=Math.max(0,(c.producedMaterials||0)-(j.baseMaterials||0));
  const ascended=Math.max(0,(META.saved||0)-(j.baseSaved||0));
  const trials=Math.max(0,((typeof opp!=='undefined'&&opp.duelWins)||0)-(j.baseDuelWins||0));
  const memories=DIARY.filter(e=>diaryIsRead(e.id)).length;
  return {
    hearth:{value:Math.min(1,homes),progress:Math.min(1,homes)+' / 1',met:begun&&homes>=1},
    bowl:{value:Math.min(8,food),progress:Math.min(8,food)+' / 8',met:begun&&food>=8},
    hand:{value:Math.min(6,materials),progress:Math.min(6,materials)+' / 6',met:begun&&materials>=6},
    claw:{value:Math.min(12,ascended),progress:Math.min(12,ascended)+' / 12 · '+(trials>=1?'TRIAL WON':'WIN A TRIAL'),met:begun&&ascended>=12&&trials>=1},
    memory:{value:memories,progress:memories+' / '+DIARY.length,met:begun&&memories>=DIARY.length}
  };
}
const FAVOR_TIER_NAMES=['UNAVAILABLE','RELUCTANT','SECURED','STRONG'];
const FAVOR_THRESHOLDS=[0,45,64,82];
function favorSupportState(id){
  const def=FAVOR_DEFS.find(d=>d.id===id),progress=favorProgress()[id],j=META.judgment;if(!def||!progress)return {tier:0,score:0,reasons:[]};
  const residents=(META.society&&META.society.residents)||[];let total=0,weight=0;const reasons=[];
  const keyIds=FAVOR_KEY_ADVOCATES[id]||[];const missingKeys=keyIds.filter(k=>!residents.some(r=>r.profileId===k));
  for(const resident of residents){const p=societyProfileForResident(resident);if(!p)continue;let w=Number(p.influence)||0.35;
    if(p.bloc===id)w+=2;if(keyIds.includes(resident.profileId))w+=2;const score=societyAdvocacyScore(resident,id);total+=score*w;weight+=w;
    if(p.bloc===id&&score<42)reasons.push((p.name||resident.profileId)+' carries a grievance');
  }
  let score=weight?total/weight:50;const spent=Math.max(0,(j.baseEmbers||0)-(META.embers||0));
  const authored=(META.society.advocacyEvents||[]).filter(e=>e.bloc===id).reduce((n,e)=>n+Number(e.delta||0),0);
  if(authored){score+=Math.max(-15,Math.min(15,authored));reasons.push('completed advocacy work changed the bloc record');}
  if(spent){score+=Math.min(10,spent/20);reasons.push('sanctuary work funded with '+spent+' embers');}
  const key=String(id);if((j.voteTiers||{})[key]>=3)score=Math.max(score,82);
  score=Math.max(0,Math.min(100,Math.round(score)));
  let tier=score>=FAVOR_THRESHOLDS[3]?3:score>=FAVOR_THRESHOLDS[2]?2:score>=FAVOR_THRESHOLDS[1]?1:0;
  if(progress.met)tier=Math.max(1,tier);else tier=0;
  if(id==='claw'&&missingKeys.includes('cit-020')){tier=0;reasons.unshift('Ase-Ro-Wen must be present for the Claw');}
  if(!progress.met)reasons.unshift(def.desc+' is still required');
  else if(!reasons.length)reasons.push('the minimum work is complete');
  return {tier,score,reasons:[...new Set(reasons)].slice(0,2),minimumMet:!!progress.met,secured:!!(j.votes||[]).includes(id),securedTier:(j.voteTiers||{})[key]||0};
}
function favorTerms(){
  const j=META.judgment,progress=favorProgress(),secured=new Set(j.votes||[]);
  return FAVOR_DEFS.map(def=>{const state=favorSupportState(def.id),p=progress[def.id];return {...def,...p,minimumMet:!!p.met,secured:secured.has(def.id),tier:state.tier,score:state.score,tierName:FAVOR_TIER_NAMES[state.tier],reasons:state.reasons,done:secured.has(def.id)};});
}
function favorVotes(){return (META.judgment.votes||[]).length;}
function favorStrongVotes(){return (META.judgment.votes||[]).filter(id=>(META.judgment.voteTiers||{})[id]>=3).length;}
function favorSecure(id){
  const state=favorSupportState(id),j=META.judgment;if(!state.minimumMet||state.tier<1)return false;
  j.votes=[...new Set([...(j.votes||[]),id])];j.voteTiers=j.voteTiers||{};j.voteTiers[id]=Math.max(j.voteTiers[id]||0,state.tier);j.securedAt=j.securedAt||{};j.securedAt[id]=j.securedAt[id]||Date.now();
  favorEvaluate(false);saveMeta();hubToast=3;hubToastMsg=id.toUpperCase()+' VOTE '+FAVOR_TIER_NAMES[j.voteTiers[id]];return true;
}
function favorRevoke(id,reason){
  const j=META.judgment;if(!j.votes||!j.votes.includes(id)||j.verdictHeard)return false;
  j.votes=j.votes.filter(v=>v!==id);j.revokedVotes=[...new Set([...(j.revokedVotes||[]),id])];delete (j.voteTiers||{})[id];
  j.verdictReady=j.votes.length>=4;j.unanimous=j.votes.length===5;j.pledgeReady=false;saveMeta();hubToast=3;hubToastMsg=id.toUpperCase()+' VOTE REVOKED'+(reason?' · '+reason:'');return true;
}
function finalVerdictLines(unanimous){return [
  {who:ARBITER_NAME,emotion:'stern',text:unanimous?'The vote is counted. Every Ratkin voice speaks for your release.':'The vote is counted. Four of the five Ratkin voices speak for your release.'},
  {who:'DUY',emotion:'questioning',text:'Then the ratkin are letting me go?'},
  {who:ARBITER_NAME,emotion:'stern',text:'They are. Your sentence is paid. The fire is no longer your prison.'},
  {who:'DUY',emotion:'concerned',text:"Cuong. Diep. I'm coming back."},
  {who:ARBITER_NAME,emotion:'stern',text:unanimous?"Go. Chit-tat-to's Invoice will record that no voice stood against you.":"Go. Chit-tat-to's Invoice will record what you restored."}
];}
function favorEvaluate(autoOpen=false){
  const j=META.judgment;if(!j.heard)return 0;
  let changed=favorBegin();
  // Pre-relationship saves have no resident records to ask. Preserve their
  // historical automatic vote behavior while every live sanctuary uses the
  // explicit Secure Vote flow.
  const legacyMode=!(META.society&&META.society.residents&&META.society.residents.length);
  if(legacyMode){
    const legacyVotes=new Set(j.votes||[]);j.voteTiers=j.voteTiers||{};
    for(const term of favorTerms())if(term.minimumMet&&!legacyVotes.has(term.id)){legacyVotes.add(term.id);j.voteTiers[term.id]=3;changed=true;}
    j.votes=[...legacyVotes];
  }
  const count=(j.votes||[]).length;
  if(count>=4&&!j.verdictReady){j.verdictReady=true;changed=true;hubToast=4;hubToastMsg='FOUR RATKIN BLOCS CALL FOR RELEASE';}
  const strong=favorStrongVotes()===5;
  if(count===5&&!j.unanimous){j.unanimous=true;changed=true;hubToast=4;hubToastMsg=legacyMode&&j.released?'UNANIMOUS · INVOICE AND RECRUIT UPGRADED':j.released?'UNANIMOUS · RECRUIT ELIGIBLE':'THE RATKIN VERDICT IS UNANIMOUS';}
  if(strong&&!j.pledgeReady){j.pledgeReady=true;changed=true;}
  if(changed)saveMeta();
  if(autoOpen&&j.verdictReady&&!j.verdictHeard){verdictPage=0;verdictScene=finalVerdictLines(count===5);hubSheet='verdict';rememberDialogue(verdictScene[0]);}
  return count;
}
function verdictAdvance(){
  if(hubSheet!=='verdict')return;
  if(verdictPage<verdictScene.length-1){verdictPage++;rememberDialogue(verdictScene[verdictPage]);return;}
  const j=META.judgment;j.verdictHeard=true;j.released=true;
  if(j.pledgeReady){
    const candidate=(META.society.residents||[]).find(r=>{const p=societyProfileForResident(r);return p&&!p.killedByDuy&&societyAdvocacyScore(r,p.bloc||'memory')>=64;})||(META.society.residents||[]).find(r=>r.profileId);
    if(candidate){META.flags.ratkinPledgeProfile=candidate.profileId;META.flags.ratkinPledgeReady=true;if(!candidate.events.some(e=>e.kind==='milestone'&&e.milestone==='pledge-follow'))candidate.events.push({kind:'milestone',at:Date.now(),home:candidate.home,type:'',milestone:'pledge-follow'});}
  }
  saveMeta();hubSheet='shrine';hubToast=5;
  hubToastMsg=j.unanimous?'DUY RELEASED · UNANIMOUS VERDICT':'DUY RELEASED · FOUR VOICES CARRY THE VERDICT';
}
function verdictOpen(){
  const j=META.judgment;if(!j.verdictReady||j.verdictHeard)return;
  verdictPage=0;verdictScene=finalVerdictLines(favorStrongVotes()===5);hubSheet='verdict';rememberDialogue(verdictScene[0]);
}

// land in the town after a run; raise any building whose saves-milestone you just crossed
function enterHub(){
  cancelPointer();
  presentDialogue=null;
  mode='hub'; hubScroll=0; hubSheet=null; wellJustRose=false;
  cityAdvance(Date.now(),true);
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
  else {judgmentEvaluate(true);if(!hubSheet)favorEvaluate(true);}
}

let META = loadMeta();
// Older saves predate resident relationships. Seed their deterministic graph
// once the global META object exists, then keep all later changes persistent.
societySeedRelationships(META.society);
for(const resident of META.society.residents||[])societyEnsureDuyRelationship(resident);
