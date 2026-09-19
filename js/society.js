// Sanctuary households. Presentation reuses verified Makko civilian performances;
// relationship and advocacy state live beside the authored chronicle layer.
function societyFresh(){return {v:1,nextId:1,residents:[],celebrations:[],relationships:[],advocacyEvents:[]};}
function societyCount(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(Number.MAX_SAFE_INTEGER,Math.trunc(n))):0;}
function societyNormalize(raw){
  const out=societyFresh(),seen=new Set();
  if(raw&&raw.v===1){
    for(const r of Array.isArray(raw.residents)?raw.residents:[]){
      if(!r||!Number.isSafeInteger(r.id)||r.id<1||r.id>=Number.MAX_SAFE_INTEGER||seen.has(r.id))continue;
      seen.add(r.id);out.nextId=Math.max(out.nextId,r.id+1);
      out.residents.push({id:r.id,profileId:typeof r.profileId==='string'?r.profileId:'',kind:RATKIN_VILLAGERS.includes(r.kind)?r.kind:'ratkin',
        preference:['burrow','apartment'].includes(r.preference)?r.preference:'either',home:societyCount(r.home),
        arrived:societyCount(r.arrived),events:(Array.isArray(r.events)?r.events:[]).filter(e=>e&&['arrival','home','refuge','milestone','relationship','gate'].includes(e.kind)).map(e=>({kind:e.kind,at:societyCount(e.at),home:societyCount(e.home),type:['burrow','apartment'].includes(e.type)?e.type:'',milestone:typeof e.milestone==='string'?e.milestone:'',relationship:typeof e.relationship==='string'?e.relationship:'',delta:Number(e.delta)||0}))});
    }
    for(const edge of Array.isArray(raw.relationships)?raw.relationships:[]){
      if(!edge||typeof edge.a!=='string'||typeof edge.b!=='string'||!RELATIONSHIP_TYPES.includes(edge.type))continue;
      out.relationships.push({a:edge.a,b:edge.b,type:edge.type,affinity:societyAffinity(edge.affinity),history:Array.isArray(edge.history)?edge.history.slice(-12).map(h=>({at:societyCount(h.at),delta:Number(h.delta)||0,reason:typeof h.reason==='string'?h.reason.slice(0,120):''})):[]});
    }
    out.advocacyEvents=Array.isArray(raw.advocacyEvents)?raw.advocacyEvents.slice(-24).map(e=>({at:societyCount(e.at),bloc:SOCIETY_BLOCS.includes(e.bloc)?e.bloc:'',delta:Number(e.delta)||0,reason:typeof e.reason==='string'?e.reason.slice(0,120):''})).filter(e=>e.bloc):[];
    out.nextId=Math.max(out.nextId,Math.min(Number.MAX_SAFE_INTEGER-1,societyCount(raw.nextId)));
    const seenCelebrations=new Set();
    for(const c of Array.isArray(raw.celebrations)?raw.celebrations:[]){
      const id=societyCount(c&&c.id);if(!id||seenCelebrations.has(id))continue;seenCelebrations.add(id);
      const residentIds=[...new Set((Array.isArray(c.residentIds)?c.residentIds:[]).map(societyCount).filter(n=>seen.has(n)))].slice(0,8);
      if(!residentIds.length)continue;
      out.celebrations.push({id,kind:['welcome','homecoming'].includes(c.kind)?c.kind:'welcome',at:societyCount(c.at),residentIds});
    }
    societyBackfillProfiles(out);
  }
  societySeedRelationships(out);
  return out;
}
function societyAffinity(value){const n=Number(value);return Number.isFinite(n)?Math.max(-100,Math.min(100,n)):0;}
function societyRelationKey(a,b,type){return [String(a),String(b),String(type)].sort().join('|');}
function societyRelation(a,b,type,create=true){
  const s=META&&META.society,aa=String(a),bb=String(b);if(!s||!RELATIONSHIP_TYPES.includes(type))return null;
  let edge=s.relationships.find(e=>e.a===aa&&e.b===bb&&e.type===type||e.a===bb&&e.b===aa&&e.type===type);
  if(!edge&&create){edge={a:aa,b:bb,type,affinity:0,history:[]};s.relationships.push(edge);}return edge||null;
}
function societyChangeRelationship(a,b,type,delta,reason){
  const edge=societyRelation(a,b,type,true);if(!edge)return 0;const d=Math.max(-25,Math.min(25,Number(delta)||0));
  edge.affinity=societyAffinity(edge.affinity+d);edge.history=(edge.history||[]).concat({at:Date.now(),delta:d,reason:String(reason||'').slice(0,120)}).slice(-12);
  if(String(a)==='duy'||String(b)==='duy'){const id=String(a)==='duy'?String(b):String(a);const r=META.society.residents.find(v=>v.profileId===id);if(r)r.events.push({kind:'relationship',at:Date.now(),home:r.home,type:'',milestone:'',relationship:type,delta:d});}
  return edge.affinity;
}
function societyRelationshipAffinity(a,b){
  const edges=(META&&META.society&&META.society.relationships)||[];return edges.filter(e=>(e.a===String(a)&&e.b===String(b))||(e.a===String(b)&&e.b===String(a))).reduce((n,e)=>n+e.affinity,0);
}
function societyRecordAdvocacy(bloc,delta,reason){
  if(!META||!META.society||!SOCIETY_BLOCS.includes(bloc))return false;
  const d=Math.max(-20,Math.min(20,Number(delta)||0));if(!d)return false;
  META.society.advocacyEvents=(META.society.advocacyEvents||[]).concat({at:Date.now(),bloc,delta:d,reason:String(reason||'').slice(0,120)}).slice(-24);return true;
}
function societySeedRelationships(s){
  const pairs=[['cit-001','cit-002','family',70],['cit-001','cit-004','mentorship',45],['cit-001','cit-016','rivalry',-35],['cit-001','cit-020','family',65],['cit-002','cit-012','friendship',45],['cit-002','cit-020','family',80],['cit-002','cit-021','family',80],['cit-003','cit-005','debt',-15],['cit-003','cit-006','solidarity',35],['cit-003','cit-013','rivalry',-25],['cit-003','cit-017','solidarity',35],['cit-003','cit-022','family',70],['cit-004','cit-011','mentorship',55],['cit-004','cit-014','friendship',65],['cit-005','cit-015','distrust',-45],['cit-005','cit-018','family',70],['cit-006','cit-007','debt',25],['cit-006','cit-008','friendship',60],['cit-006','cit-017','friendship',35],['cit-008','cit-019','family',75],['cit-010','cit-012','family',90],['cit-014','cit-015','family',80],['cit-015','cit-016','respect',35],['cit-019','cit-002','care',65],['cit-019','cit-012','care',65],['cit-021','cit-003','debt',25]];
  for(const [a,b,type,affinity] of pairs){if(!RELATIONSHIP_TYPES.includes(type))continue;let e=s.relationships.find(v=>(v.a===a&&v.b===b||v.a===b&&v.b===a)&&v.type===type);if(!e)s.relationships.push({a,b,type,affinity,history:[]});}
}
function societyEnsureDuyRelationship(resident){
  const p=societyProfileForResident(resident);if(!p)return;
  const base=p.killedByDuy?-55:(p.antiHuman?-(p.antiHuman*20):12);
  const e=societyRelation('duy',resident.profileId,'distrust',false);if(!e){societyRelation('duy',resident.profileId,'distrust',true).affinity=base;}
}
function societyAdvocacyScore(resident,bloc){
  const p=societyProfileForResident(resident);if(!p||!SOCIETY_BLOCS.includes(bloc))return 50;
  let score=50+(p.advocacy?.[bloc]||0)*22;
  if(p.killedByDuy)score-=24;
  const grief=(META.society.relationships||[]).filter(e=>e.a===resident.profileId||e.b===resident.profileId).reduce((n,e)=>{
    const other=e.a===resident.profileId?e.b:e.a,op=SOCIETY_PROFILES[other];return n+(op&&op.killedByDuy&&['family','care','grief'].includes(e.type)?Math.min(18,Math.abs(e.affinity)*.22):0);
  },0);score-=grief;
  const duyAffinity=societyRelationshipAffinity('duy',resident.profileId);score+=duyAffinity*.22;
  if(p.antiHuman)score-=p.antiHuman*12;
  return Math.max(0,Math.min(100,score));
}
function societyRecordCelebration(kind,residentIds,at=Date.now()){
  const s=META.society,ids=[...new Set((residentIds||[]).map(societyCount).filter(n=>n>0))].slice(0,8);
  if(!ids.length)return 0;
  const next=(s.celebrations||[]).reduce((m,c)=>Math.max(m,societyCount(c.id)),0)+1;
  s.celebrations=(s.celebrations||[]).concat({id:next,kind:['welcome','homecoming'].includes(kind)?kind:'welcome',at,residentIds:ids});
  if(ids.length>1)for(const a of ids)for(const b of ids)if(a<b){const ra=s.residents.find(r=>r.id===a),rb=s.residents.find(r=>r.id===b);if(ra&&rb&&ra.profileId&&rb.profileId)societyChangeRelationship(ra.profileId,rb.profileId,'solidarity',2,'shared gathering');}
  return next;
}
function societyArrive(actor){
  if(actor.sanctuaryId)return actor.sanctuaryId;
  const at=Date.now();cityAdvance(at,false); // Settle elapsed work before adding this new worker.
  const s=META.society,id=s.nextId++,kind=villagerType(actor);
  const builtInProfileIds=new Set(SOCIETY_PROFILE_SEEDS.map(v=>v[0]));
  const hasCustomProfile=SOCIETY_PROFILE_ORDER.some(v=>!builtInProfileIds.has(v));
  const profileId=(META.judgment&&META.judgment.heard)||hasCustomProfile?societyNextProfileId(s):'';
  const resident={id,profileId,kind,preference:kind==='child'?'either':id%2?'burrow':'apartment',home:0,arrived:at,events:[{kind:'arrival',at,home:0,type:'',milestone:''}]};
  s.residents.push(resident);societyEnsureDuyRelationship(resident);
  societyRecordCelebration('welcome',[id],at);
  actor.sanctuaryId=id;societyCacheKey='';return id;
}
function societyIsHome(b){return b&&['burrow','apartment'].includes(b.type);}
function societyHomeSlots(b){return b.type==='apartment'?3:1;}
function societyHomeCount(){return cityData().buildings.filter(b=>societyIsHome(b)&&b.state==='sealed'&&cityConnected(b)).length;}
let societyCacheData=null,societyCacheKey='',societyWorkerCache=[];
function societySync(){
  const s=META.society,c=cityData();
  const key=c.roads.join('|')+';'+c.buildings.map(b=>[b.id,b.type,b.state,b.x,b.y].join(',')).join('|')+';'+s.residents.length;
  if(s===societyCacheData&&key===societyCacheKey)return;
  societyCacheData=s;
  const homes=c.buildings.filter(b=>societyIsHome(b)&&b.state==='sealed'&&cityConnected(b)).sort((a,b)=>a.id-b.id),byId=new Map(homes.map(b=>[b.id,b])),used=new Map();
  const at=Date.now();
  function move(r,b){
    const id=b?b.id:0;if(r.home===id)return;
    if(r.home)used.set(r.home,Math.max(0,(used.get(r.home)||0)-1));
    r.home=id;if(b)used.set(id,(used.get(id)||0)+1);
    r.events.push({kind:b?'home':'refuge',at,home:id,type:b?b.type:''});
    if(b&&r.profileId)societyChangeRelationship('duy',r.profileId,'friendship',1,'a home was secured');
  }
  // Stable tenancies: a new arrival cannot evict an existing household.
  for(const r of s.residents){const b=byId.get(r.home);
    if(r.kind!=='child'&&b&&(used.get(b.id)||0)<societyHomeSlots(b))used.set(b.id,(used.get(b.id)||0)+1);
    else if(r.home){r.home=0;r.events.push({kind:'refuge',at,home:0,type:''});}
  }
  const vacancy=b=>(used.get(b.id)||0)<societyHomeSlots(b);
  for(const r of s.residents){
    if(r.kind==='child')continue; // Community care, never a child labor assignment.
    const current=byId.get(r.home),preferred=homes.find(b=>b.type===r.preference&&vacancy(b));
    if(preferred&&(!current||current.type!==r.preference))move(r,preferred);
    else if(!current){const b=homes.find(vacancy);if(b)move(r,b);}
  }
  societyWorkerCache=s.residents.filter(r=>r.home&&r.kind!=='child').sort((a,b)=>a.id-b.id);
  societyCacheKey=c.roads.join('|')+';'+c.buildings.map(b=>[b.id,b.type,b.state,b.x,b.y].join(',')).join('|')+';'+s.residents.length;
}
function societyWorkers(){societySync();return societyWorkerCache;}
function societyStationResident(b){const i=cityAssignedStations().findIndex(x=>x.id===b.id);return i<0?null:societyWorkers()[i]||null;}
function societyHappiness(r){return !r.home?80:cityBuilding(r.home)?.type===r.preference?95:85;}
function societyProductionBonus(r){return !r||!r.home?0:societyHappiness(r)===95?.20:.10;}
function societyLabel(r){return societyProfileName(r)||r.kind.toUpperCase()+' '+r.id;}
function societyHomeLabel(r){const b=cityBuilding(r.home);return b?CITY_DEF[b.type].short+' '+b.id:'COMMUNAL REFUGE';}
function societyJob(r){const b=cityAssignedStations().find(b=>societyStationResident(b)?.id===r.id);return b?'Working at the '+CITY_DEF[b.type].name.toLowerCase():r.kind==='child'?'Community care':r.home?'Time at home':'Helping the refuge';}
function societyRecordMilestone(residentId,key,at=Date.now()){
  const r=META.society.residents.find(v=>v.id===Number(residentId));if(!r||!societyMilestoneText(r,key))return false;
  if(r.events.some(e=>e.kind==='milestone'&&e.milestone===key))return false;
  r.events.push({kind:'milestone',at,home:r.home,type:'',milestone:String(key)});if(r.profileId){societyChangeRelationship('duy',r.profileId,'friendship',3,'milestone: '+key);const p=societyProfileForResident(r);if(p&&p.bloc)societyRecordAdvocacy(p.bloc,2,'resident milestone: '+key);}societyCacheKey='';return true;
}
function societyEventText(r,e){
  if(e.kind==='arrival')return 'Ascended from the fire. Welcomed into the refuge.';
  if(e.kind==='refuge')return 'Returned to the refuge while housing is arranged.';
  if(e.kind==='gate')return 'Came down to the gate while Duy was barred. Watched the work from the other side.';
  if(e.kind==='relationship')return 'A relationship changed: '+e.relationship+' ('+(e.delta>=0?'+':'')+e.delta+').';
  if(e.kind==='milestone'&&e.milestone==='pledge-follow')return 'Pledged to follow Duy when his sentence ends. The promise is recorded for later.';
  if(e.kind==='milestone')return societyMilestoneText(r,e.milestone)||'A milestone was recorded.';
  return 'Moved into '+(e.type==='apartment'?'an apartment':'a personal home')+' ('+e.home+').';
}
let societyPage=0,societySelected=0,chroniclePage=0,societyCelebrationId=0;
function societyAction(action){
  if(action==='society'){cityAdvance(Date.now(),true);societySync();societyPage=0;cityView='society';return true;}
  if(action==='societysupport'){cityView='support';return true;}
  if(action==='societyback'){cityView='society';return true;}
  if(action.indexOf('favorsecure:')===0){favorSecure(action.split(':')[1]);return true;}
  if(action.startsWith('societypage:')){societyPage=Math.max(0,Number(action.split(':')[1])||0);return true;}
  if(action.startsWith('household:')){societySelected=Number(action.split(':')[1]);chroniclePage=0;const resident=META.society.residents.find(r=>r.id===societySelected);if(resident&&META.judgment&&!META.judgment.released&&!resident.events.some(e=>e.kind==='gate'))resident.events.push({kind:'gate',at:Date.now(),home:resident.home,type:'',milestone:''});cityView='household';return true;}
  if(action.startsWith('celebration:')){societyCelebrationId=Number(action.split(':')[1])||0;cityView='celebration';return true;}
  if(action.startsWith('chroniclepage:')){chroniclePage=Math.max(0,Number(action.split(':')[1])||0);return true;}
  return false;
}
function societyButton(ctx,x,y,w,label,action){
  panel(ctx,x,y,w,66,12,'#263329','#819b78');ctx.textAlign='center';ctx.fillStyle='#f4e9c8';ctx.font='700 22px "Chakra Petch",system-ui,sans-serif';ctx.fillText(label,x+w/2,y+41);hubB(x,y,w,66,action);
}
function societyDrawResident(ctx,r,x,y,h,walking=false){
  if(!drawAnim(ctx,r.kind+(walking?'_walk':'_idle'),x,y,h,{fps:walking?9:5,t:r.id%12}))drawSpr(ctx,r.kind==='ratkin'?'townsfolk':r.kind,x,y,h,{});
}
function drawSociety(ctx){
  societySync();drawCityHeader(ctx,'SANCTUARY');const s=META.society,total=s.residents.length,refuge=s.residents.filter(r=>!r.home).length;
  if(META.judgment&&!META.judgment.released){ctx.textAlign='right';ctx.fillStyle='#ffbd65';ctx.font='700 16px "Chakra Petch",system-ui,sans-serif';ctx.fillText('GATE VIEW · ENTRY REQUIRES FAVOR',678,60);}
  ctx.textAlign='left';ctx.fillStyle='#e9d7af';ctx.font='600 24px "Chakra Petch",system-ui,sans-serif';ctx.fillText(total+' ARRIVALS · '+refuge+' IN THE REFUGE',42,145);
  ctx.fillStyle='#becfc6';ctx.font='500 22px "Chakra Petch",system-ui,sans-serif';wrapText(ctx,META.judgment&&META.judgment.released?'No fire follows them here. There is a place at the table while their homes take shape.':'The gate remains closed. Residents can still come down to speak, work and watch what you build.',42,190,636,30);
  panel(ctx,42,268,636,230,16,'rgba(33,39,33,.88)','#8c7752');
  const gathering=s.residents.filter(r=>!r.home).slice(-4);if(!gathering.length)gathering.push(...s.residents.slice(-4));
  gathering.forEach((r,i)=>societyDrawResident(ctx,r,140+i*146,366,100));
  ctx.textAlign='center';ctx.fillStyle='#d8ddc9';ctx.font='600 21px "Chakra Petch",system-ui,sans-serif';ctx.fillText(total?'A place to stay. A life to build.':'Every Ratkin you rescue has a place here.',360,425);
  const latest=s.celebrations&&s.celebrations[s.celebrations.length-1];
  if(latest)societyButton(ctx,240,442,240,'OPEN GATHERING','celebration:'+latest.id);
  const pages=Math.max(1,Math.ceil(s.residents.length/4));societyPage=Math.min(societyPage,pages-1);
  s.residents.slice(societyPage*4,societyPage*4+4).forEach((r,i)=>{
    const y=516+i*118;panel(ctx,42,y,636,106,12,'#1c2728','#536a68');societyDrawResident(ctx,r,96,y+51,80);
    ctx.textAlign='left';ctx.fillStyle='#fff0ce';ctx.font='700 23px "Chakra Petch",system-ui,sans-serif';ctx.fillText(societyLabel(r),154,y+35);
    ctx.fillStyle='#bdcfca';ctx.font='500 20px "Chakra Petch",system-ui,sans-serif';ctx.fillText(societyHomeLabel(r)+' · HAPPINESS '+societyHappiness(r),154,y+67);
    ctx.fillText('Open household chronicle',154,y+92);hubB(42,y,636,106,'household:'+r.id);
  });
  ctx.textAlign='left';ctx.fillStyle='#aebdb8';ctx.font='500 19px "Chakra Petch",system-ui,sans-serif';
  ctx.fillText('Homes are chosen automatically. Children stay in community care.',42,1020);
  societyButton(ctx,42,1098,180,'PREVIOUS','societypage:'+Math.max(0,societyPage-1));
  ctx.textAlign='center';ctx.fillStyle='#d9e1d9';ctx.font='700 22px "Chakra Petch",system-ui,sans-serif';ctx.fillText((societyPage+1)+' / '+pages,360,1138);
  societyButton(ctx,498,1098,180,'NEXT','societypage:'+Math.min(pages-1,societyPage+1));societyButton(ctx,42,1180,250,'BLOC SUPPORT','societysupport');societyButton(ctx,388,1180,290,'TOWN PLAN','cityback');
}
function drawSocietySupport(ctx){
  drawCityHeader(ctx,'BLOC SUPPORT');
  ctx.textAlign='center';ctx.fillStyle='#cfe0d5';ctx.font='500 20px "Chakra Petch",system-ui,sans-serif';ctx.fillText('Secure a vote now or keep building trust.',VW/2,132);
  const terms=META.judgment&&META.judgment.heard?favorTerms():[];
  for(let i=0;i<FAVOR_DEFS.length;i++){
    const t=terms[i]||{id:FAVOR_DEFS[i].id,name:FAVOR_DEFS[i].name,tier:0,tierName:'UNAVAILABLE',score:0,reasons:[FAVOR_DEFS[i].desc],minimumMet:false,secured:false};
    const y=185+i*145;panel(ctx,34,y,VW-68,116,12,'rgba(28,20,42,.88)',t.secured?'rgba(138,255,193,.55)':'rgba(120,110,145,.5)');
    ctx.textAlign='left';ctx.fillStyle='#f0e5ff';ctx.font='800 22px "Chakra Petch",system-ui,sans-serif';ctx.fillText(t.name,54,y+32);
    ctx.fillStyle=t.tier>0?'#8affc1':'#c9a0ff';ctx.font='700 17px "Chakra Petch",system-ui,sans-serif';ctx.fillText(t.tierName+' · '+t.score+' / 100',54,y+60);
    ctx.fillStyle='#c9c1d5';ctx.font='500 15px "Chakra Petch",system-ui,sans-serif';ctx.fillText((t.reasons||[])[0]||'',54,y+87);
    const label=t.secured?'SECURED':'SECURE VOTE',enabled=t.minimumMet&&!t.secured;panel(ctx,500,y+30,150,52,9,enabled?'#342544':'#20232d',enabled?'#c9a0ff':'#5d6272');ctx.textAlign='center';ctx.fillStyle=enabled?'#f3e9ff':'#8891a5';ctx.font='800 15px "Chakra Petch",system-ui,sans-serif';ctx.fillText(label,575,y+62);if(enabled)hubB(500,y+30,150,52,'favorsecure:'+t.id);
  }
  societyButton(ctx,180,950,360,'BACK TO GATE','society');
}
function drawSocietyCelebration(ctx){
  const s=META.society,c=(s.celebrations||[]).find(v=>v.id===societyCelebrationId)||(s.celebrations||[]).slice(-1)[0];
  if(!c){cityView='society';drawSociety(ctx);return;}
  drawCityHeader(ctx,'WELCOME GATHERING');
  panel(ctx,42,132,636,820,18,'rgba(15,19,28,0.96)','#9a7048');
  ctx.textAlign='center';ctx.fillStyle='#ffe0a0';ctx.font='800 34px "Chakra Petch",system-ui,sans-serif';ctx.fillText('THE FIRE STAYS BEHIND',VW/2,205);
  ctx.textAlign='left';ctx.fillStyle='#cfe0d5';ctx.font='500 22px "Chakra Petch",system-ui,sans-serif';
  wrapText(ctx,'A new arrival is welcomed without interrupting the work of rebuilding. This gathering is a first presentation layer; dedicated Makko celebration performances will replace the idle poses as they arrive.',86,255,548,32);
  const residents=c.residentIds.map(id=>s.residents.find(r=>r.id===id)).filter(Boolean);
  residents.forEach((r,i)=>societyDrawResident(ctx,r,150+i*140,480,128));
  ctx.textAlign='center';ctx.fillStyle='#ffdfa0';ctx.font='700 24px "Chakra Petch",system-ui,sans-serif';ctx.fillText('WELCOME TO THE REFUGE',VW/2,670);
  ctx.textAlign='left';ctx.fillStyle='#cfe0d5';ctx.font='500 21px "Chakra Petch",system-ui,sans-serif';
  wrapText(ctx,'There is room to rest, remember, work and choose what comes next.',92,720,536,31);
  societyButton(ctx,180,996,360,'BACK TO SANCTUARY','society');
}
function drawHousehold(ctx){
  societySync();const r=META.society.residents.find(r=>r.id===societySelected);if(!r){cityView='society';drawSociety(ctx);return;}
  const profile=societyProfileForResident(r);
  drawCityHeader(ctx,'HOUSEHOLD CHRONICLE');ctx.textAlign='center';ctx.fillStyle='#f9e1ae';ctx.font='700 28px "Chakra Petch",system-ui,sans-serif';ctx.fillText(societyLabel(r),360,155);
  societyDrawResident(ctx,r,360,300,216);
  ctx.fillStyle='#d7e5d6';ctx.font='600 24px "Chakra Petch",system-ui,sans-serif';ctx.fillText(societyHomeLabel(r),360,445);ctx.fillText('HAPPINESS '+societyHappiness(r)+' · WORK RATE +'+Math.round(societyProductionBonus(r)*100)+'%',360,487);
  ctx.textAlign='left';ctx.font='500 23px "Chakra Petch",system-ui,sans-serif';ctx.fillStyle='#c1cfcd';
  const preference=r.kind==='child'?'Growing up with the community.':r.preference==='either'?'Housing preference not recorded.':r.preference==='burrow'?'Prefers the quiet of a personal home.':'Prefers neighbors close by in an apartment.';
  const authoredIntro=profile?[profile.formerRole,profile.chronicleIntro].filter(v=>typeof v==='string'&&v.trim()).join(' · '):'';
  wrapText(ctx,(authoredIntro?authoredIntro+' · ':'')+preference+' '+societyJob(r)+'.',54,545,612,32);
  ctx.fillStyle='#ffdfa0';ctx.font='700 26px "Chakra Petch",system-ui,sans-serif';ctx.fillText('A LIFE RECORDED',54,666);
  ctx.fillStyle='#d5ded3';ctx.font='500 23px "Chakra Petch",system-ui,sans-serif';
  let y=712;
  const pages=Math.max(1,Math.ceil(r.events.length/3));chroniclePage=Math.min(chroniclePage,pages-1);
  for(const e of r.events.slice(chroniclePage*3,chroniclePage*3+3)){
    const date=e.at?new Date(e.at).toLocaleDateString(undefined,{month:'short',day:'numeric'}):'';
    const text=societyEventText(r,e);
    y=wrapText(ctx,(date?date+' · ':'')+text,54,y,612,31)+44;
  }
  if(pages>1){societyButton(ctx,42,1098,240,'EARLIER','chroniclepage:'+Math.max(0,chroniclePage-1));societyButton(ctx,438,1098,240,'LATER','chroniclepage:'+Math.min(pages-1,chroniclePage+1));}
  societyButton(ctx,180,1180,360,'BACK TO SANCTUARY','society');
}
