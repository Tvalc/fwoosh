// Sanctuary households. Presentation reuses verified Makko civilian performances;
// relationships, births and authored celebration vignettes are separate future work.
function societyFresh(){return {v:1,nextId:1,residents:[]};}
function societyCount(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(Number.MAX_SAFE_INTEGER,Math.trunc(n))):0;}
function societyNormalize(raw){
  const out=societyFresh(),seen=new Set();
  if(raw&&raw.v===1){
    for(const r of Array.isArray(raw.residents)?raw.residents:[]){
      if(!r||!Number.isSafeInteger(r.id)||r.id<1||r.id>=Number.MAX_SAFE_INTEGER||seen.has(r.id))continue;
      seen.add(r.id);out.nextId=Math.max(out.nextId,r.id+1);
      out.residents.push({id:r.id,kind:RATKIN_VILLAGERS.includes(r.kind)?r.kind:'ratkin',
        preference:['burrow','apartment'].includes(r.preference)?r.preference:'either',home:societyCount(r.home),
        arrived:societyCount(r.arrived),events:(Array.isArray(r.events)?r.events:[]).filter(e=>e&&['arrival','home','refuge'].includes(e.kind)).map(e=>({kind:e.kind,at:societyCount(e.at),home:societyCount(e.home),type:['burrow','apartment'].includes(e.type)?e.type:''}))});
    }
    out.nextId=Math.max(out.nextId,Math.min(Number.MAX_SAFE_INTEGER-1,societyCount(raw.nextId)));
  }
  return out;
}
function societyArrive(actor){
  if(actor.sanctuaryId)return actor.sanctuaryId;
  const at=Date.now();cityAdvance(at,false); // Settle elapsed work before adding this new worker.
  const s=META.society,id=s.nextId++,kind=villagerType(actor);
  s.residents.push({id,kind,preference:kind==='child'?'either':id%2?'burrow':'apartment',home:0,arrived:at,events:[{kind:'arrival',at,home:0,type:''}]});
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
function societyLabel(r){return r.kind.toUpperCase()+' '+r.id;}
function societyHomeLabel(r){const b=cityBuilding(r.home);return b?CITY_DEF[b.type].short+' '+b.id:'COMMUNAL REFUGE';}
function societyJob(r){const b=cityAssignedStations().find(b=>societyStationResident(b)?.id===r.id);return b?'Working at the '+CITY_DEF[b.type].name.toLowerCase():r.kind==='child'?'Community care':r.home?'Time at home':'Helping the refuge';}
let societyPage=0,societySelected=0,chroniclePage=0;
function societyAction(action){
  if(action==='society'){cityAdvance(Date.now(),true);societySync();societyPage=0;cityView='society';return true;}
  if(action.startsWith('societypage:')){societyPage=Math.max(0,Number(action.split(':')[1])||0);return true;}
  if(action.startsWith('household:')){societySelected=Number(action.split(':')[1]);chroniclePage=0;cityView='household';return true;}
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
  ctx.textAlign='left';ctx.fillStyle='#e9d7af';ctx.font='600 24px "Chakra Petch",system-ui,sans-serif';ctx.fillText(total+' ARRIVALS · '+refuge+' IN THE REFUGE',42,145);
  ctx.fillStyle='#becfc6';ctx.font='500 22px "Chakra Petch",system-ui,sans-serif';wrapText(ctx,'No fire follows them here. There is a place at the table while their homes take shape.',42,190,636,30);
  panel(ctx,42,268,636,220,16,'rgba(33,39,33,.88)','#8c7752');
  const gathering=s.residents.filter(r=>!r.home).slice(-4);if(!gathering.length)gathering.push(...s.residents.slice(-4));
  gathering.forEach((r,i)=>societyDrawResident(ctx,r,140+i*146,366,110));
  ctx.textAlign='center';ctx.fillStyle='#d8ddc9';ctx.font='600 21px "Chakra Petch",system-ui,sans-serif';ctx.fillText(total?'A place to stay. A life to build.':'Every Ratkin you rescue has a place here.',360,460);
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
  societyButton(ctx,498,1098,180,'NEXT','societypage:'+Math.min(pages-1,societyPage+1));societyButton(ctx,180,1180,360,'TOWN PLAN','cityback');
}
function drawHousehold(ctx){
  societySync();const r=META.society.residents.find(r=>r.id===societySelected);if(!r){cityView='society';drawSociety(ctx);return;}
  drawCityHeader(ctx,'HOUSEHOLD CHRONICLE');ctx.textAlign='center';ctx.fillStyle='#f9e1ae';ctx.font='700 28px "Chakra Petch",system-ui,sans-serif';ctx.fillText(societyLabel(r),360,155);
  societyDrawResident(ctx,r,360,300,216);
  ctx.fillStyle='#d7e5d6';ctx.font='600 24px "Chakra Petch",system-ui,sans-serif';ctx.fillText(societyHomeLabel(r),360,445);ctx.fillText('HAPPINESS '+societyHappiness(r)+' · WORK RATE +'+Math.round(societyProductionBonus(r)*100)+'%',360,487);
  ctx.textAlign='left';ctx.font='500 23px "Chakra Petch",system-ui,sans-serif';ctx.fillStyle='#c1cfcd';
  const preference=r.kind==='child'?'Growing up with the community.':r.preference==='either'?'Housing preference not recorded.':r.preference==='burrow'?'Prefers the quiet of a personal home.':'Prefers neighbors close by in an apartment.';
  wrapText(ctx,preference+' '+societyJob(r)+'.',54,545,612,32);
  ctx.fillStyle='#ffdfa0';ctx.font='700 26px "Chakra Petch",system-ui,sans-serif';ctx.fillText('A LIFE RECORDED',54,666);
  ctx.fillStyle='#d5ded3';ctx.font='500 23px "Chakra Petch",system-ui,sans-serif';
  let y=712;
  const pages=Math.max(1,Math.ceil(r.events.length/3));chroniclePage=Math.min(chroniclePage,pages-1);
  for(const e of r.events.slice(chroniclePage*3,chroniclePage*3+3)){
    const date=e.at?new Date(e.at).toLocaleDateString(undefined,{month:'short',day:'numeric'}):'';
    const text=e.kind==='arrival'?'Ascended from the fire. Welcomed into the refuge.':e.kind==='refuge'?'Returned to the refuge while housing is arranged.':'Moved into '+(e.type==='apartment'?'an apartment':'a personal home')+' ('+e.home+').';
    y=wrapText(ctx,(date?date+' · ':'')+text,54,y,612,31)+44;
  }
  if(pages>1){societyButton(ctx,42,1098,240,'EARLIER','chroniclepage:'+Math.max(0,chroniclePage-1));societyButton(ctx,438,1098,240,'LATER','chroniclepage:'+Math.min(pages-1,chroniclePage+1));}
  societyButton(ctx,180,1180,360,'BACK TO SANCTUARY','society');
}
