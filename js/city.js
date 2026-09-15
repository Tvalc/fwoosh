// Ratkin Quarter vertical slice. This is a Fwoosh-native state machine: the
// Wayfarer's Hearth project informs timing/readability, but no second runtime or lore is embedded.
const CITY_COLS=5, CITY_ROWS=5, CITY_GATE='2,4', CITY_OFFLINE_CAP=8*60*60;
const CITY_DEF={
  burrow:{name:'RATKIN BURROW',short:'BURROW',foundation:40,seal:20,seconds:90,materials:2,color:'#9fd7ff'},
  yard:{name:'SALVAGE YARD',short:'YARD',foundation:60,seal:30,seconds:150,materials:3,color:'#ffc070'}
};
const CITY_RUSH_COST=5, CITY_RUSH_SECONDS=30, CITY_BASE_CYCLE=45;

function cityFresh(now=Date.now()){
  return {v:1,lastAt:now,roads:[CITY_GATE],buildings:[],materials:0,nextId:1};
}
function cityCellKey(x,y){return Math.trunc(x)+','+Math.trunc(y);}
function cityValidCell(x,y){return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&x<CITY_COLS&&y>=0&&y<CITY_ROWS;}
function cityNormalize(raw,now=Date.now()){
  const c=raw&&raw.v===1?raw:cityFresh(now), roads=Array.isArray(c.roads)?c.roads:[];
  const out={v:1,lastAt:Number.isFinite(Number(c.lastAt))?Number(c.lastAt):now,
    roads:[],buildings:[],materials:Math.max(0,Math.trunc(Number(c.materials)||0)),nextId:1};
  const seen=new Set();
  for(const key of roads){const p=String(key).split(',').map(Number), k=cityCellKey(p[0],p[1]);
    if(cityValidCell(p[0],p[1])&&!seen.has(k)){seen.add(k);out.roads.push(k);}}
  if(!seen.has(CITY_GATE))out.roads.push(CITY_GATE);
  const occupied=new Set();
  for(const b of Array.isArray(c.buildings)?c.buildings:[]){
    const x=Math.trunc(Number(b.x)),y=Math.trunc(Number(b.y)),type=b.type,def=CITY_DEF[type],key=cityCellKey(x,y);
    if(!def||!cityValidCell(x,y)||seen.has(key)||occupied.has(key))continue;
    const id=Math.max(1,Math.trunc(Number(b.id)||out.nextId)), state=['building','ready','sealed'].includes(b.state)?b.state:'building';
    occupied.add(key);out.nextId=Math.max(out.nextId,id+1);
    out.buildings.push({id,type,x,y,state,remaining:state==='building'?Math.max(0,Number(b.remaining)||def.seconds):0,
      work:Math.max(0,Number(b.work)||0)});
  }
  out.nextId=Math.max(out.nextId,Math.trunc(Number(c.nextId)||1));
  return out;
}

let cityTool='inspect',cityMessage='',citySelectedId=null,cityMovingId=null,cityView='map',cityTickAt=0,cityLastPersist=0;
function cityData(){return META.city;}
function cityRoadSet(){return new Set(cityData().roads);}
function cityBuildingAt(x,y){return cityData().buildings.find(b=>b.x===x&&b.y===y)||null;}
function cityBuilding(id){return cityData().buildings.find(b=>b.id===Number(id))||null;}
function cityCount(type){return cityData().buildings.filter(b=>b.type===type).length;}
function cityConnectedRoads(){
  const roads=cityRoadSet(),seen=new Set(),q=[];if(roads.has(CITY_GATE)){seen.add(CITY_GATE);q.push(CITY_GATE);}
  while(q.length){const [x,y]=q.shift().split(',').map(Number);
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=cityCellKey(x+dx,y+dy);if(roads.has(k)&&!seen.has(k)){seen.add(k);q.push(k);}}}
  return seen;
}
function cityRoadDistanceTo(b){
  const roads=cityRoadSet(),distances=new Map(),q=[];if(!roads.has(CITY_GATE))return null;
  distances.set(CITY_GATE,0);q.push(CITY_GATE);
  while(q.length){const key=q.shift(),[x,y]=key.split(',').map(Number),d=distances.get(key);
    if(Math.abs(x-b.x)+Math.abs(y-b.y)===1)return d+1;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=cityCellKey(x+dx,y+dy);if(roads.has(k)&&!distances.has(k)){distances.set(k,d+1);q.push(k);}}}
  return null;
}
function cityConnected(b){return cityRoadDistanceTo(b)!=null;}
function cityWorkerCapacity(){return cityData().buildings.filter(b=>b.type==='burrow'&&b.state==='sealed'&&cityConnected(b)).length;}
function cityAssignedYards(){
  const cap=cityWorkerCapacity();return cityData().buildings.filter(b=>b.type==='yard'&&b.state==='sealed'&&cityConnected(b)).sort((a,b)=>a.id-b.id).slice(0,cap);
}
function cityYardActive(b){return cityAssignedYards().some(y=>y.id===b.id);}
function cityCycleSeconds(b){const d=cityRoadDistanceTo(b);return CITY_BASE_CYCLE+Math.max(0,(d||1)-2)*5;}
function cityPersist(){cityData().lastAt=Date.now();cityLastPersist=Date.now();saveMeta();}
function cityAdvance(now=Date.now(),force=false){
  const c=cityData();if(!c)return;
  let dt=Math.max(0,(now-c.lastAt)/1000);dt=Math.min(CITY_OFFLINE_CAP,dt);c.lastAt=now;
  let important=false;
  for(const b of c.buildings)if(b.state==='building'){
    b.remaining=Math.max(0,b.remaining-dt);if(b.remaining<=1e-6){b.remaining=0;b.state='ready';important=true;}
  }
  const active=new Set(cityAssignedYards().map(b=>b.id));
  for(const b of c.buildings)if(b.type==='yard'&&b.state==='sealed'){
    if(!active.has(b.id)){b.work=0;continue;}
    const cycle=cityCycleSeconds(b);b.work+=dt;
    const made=Math.floor(b.work/cycle);if(made>0){b.work-=made*cycle;c.materials+=made;important=true;}
  }
  if(force||important||now-cityLastPersist>=5000){cityLastPersist=now;saveMeta();}
}
function cityOpen(){cityAdvance(Date.now(),true);hubSheet='city';cityView='map';cityTool='inspect';citySelectedId=null;cityMovingId=null;cityMessage='';}
function citySetMessage(s){cityMessage=s;hubToast=0;}
function cityCanUseCell(x,y){return cityValidCell(x,y)&&!cityRoadSet().has(cityCellKey(x,y))&&!cityBuildingAt(x,y);}
function cityAdjacentToNetwork(x,y){const connected=cityConnectedRoads();return [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>connected.has(cityCellKey(x+dx,y+dy)));}
function cityPlaceRoad(x,y){
  const key=cityCellKey(x,y);if(key===CITY_GATE){citySetMessage('THE GATE ROAD CANNOT BE MOVED.');return;}
  if(cityBuildingAt(x,y)){citySetMessage('A BUILDING ALREADY OCCUPIES THAT SITE.');return;}
  const roads=cityRoadSet();if(roads.has(key)){citySetMessage('THAT ROAD IS ALREADY LAID.');return;}
  if(!cityAdjacentToNetwork(x,y)){citySetMessage('EXTEND ROADS OUTWARD FROM THE GATE.');return;}
  cityData().roads.push(key);citySetMessage('ROAD CONNECTED.');cityPersist();
}
function cityPlaceBuilding(type,x,y){
  const def=CITY_DEF[type];if(!def||!cityCanUseCell(x,y)){citySetMessage('THAT SITE IS ALREADY OCCUPIED.');return;}
  if(!cityAdjacentToNetwork(x,y)){citySetMessage('CONNECT THIS SITE TO THE GATE ROAD FIRST.');return;}
  const extra=cityCount(type)>0?def.materials:0;
  if(META.embers<def.foundation){citySetMessage('NEED '+def.foundation+' EMBERS TO SUMMON THIS FOUNDATION.');return;}
  if(cityData().materials<extra){citySetMessage('NEED '+extra+' BUILDING MATERIALS FOR ANOTHER '+def.short+'.');return;}
  META.embers-=def.foundation;cityData().materials-=extra;
  const b={id:cityData().nextId++,type,x,y,state:'building',remaining:def.seconds,work:0};cityData().buildings.push(b);
  citySelectedId=b.id;cityTool='inspect';citySetMessage(def.name+' FOUNDATION SUMMONED.');cityPersist();
}
function cityMoveCell(x,y){
  if(cityMovingId==null){const b=cityBuildingAt(x,y);if(!b){citySetMessage('SELECT A BUILDING TO MOVE.');return;}cityMovingId=b.id;citySelectedId=b.id;citySetMessage('CHOOSE AN EMPTY ROAD-CONNECTED SITE.');return;}
  const b=cityBuilding(cityMovingId);if(!b){cityMovingId=null;return;}
  if(!cityCanUseCell(x,y)){citySetMessage('THAT SITE IS ALREADY OCCUPIED.');return;}
  if(!cityAdjacentToNetwork(x,y)){citySetMessage('THE NEW SITE MUST TOUCH THE CONNECTED ROAD.');return;}
  cityAdvance(Date.now(),true);b.x=x;b.y=y;b.work=0;cityMovingId=null;cityTool='inspect';citySetMessage('BUILDING MOVED. PRODUCTION ROUTE RECALCULATED.');cityPersist();
}
function cityCellAct(x,y){
  if(!cityValidCell(x,y))return;
  if(cityTool==='road'){cityPlaceRoad(x,y);return;}
  if(cityTool==='burrow'||cityTool==='yard'){cityPlaceBuilding(cityTool,x,y);return;}
  if(cityTool==='move'){cityMoveCell(x,y);return;}
  const b=cityBuildingAt(x,y);citySelectedId=b?b.id:null;cityMessage=b?'':'SELECT ROAD, BURROW OR YARD, THEN TAP A SITE.';
}
function citySeal(id){
  cityAdvance(Date.now(),true);const b=cityBuilding(id),def=b&&CITY_DEF[b.type];if(!b||b.state!=='ready')return;
  if(META.embers<def.seal){citySetMessage('NEED '+def.seal+' EMBERS TO SEAL '+def.name+'.');return;}
  META.embers-=def.seal;b.state='sealed';b.work=0;citySetMessage(def.name+' SEALED.');cityPersist();
}
function cityRush(id){
  cityAdvance(Date.now(),true);const b=cityBuilding(id);if(!b||b.state!=='building')return;
  if(META.embers<CITY_RUSH_COST){citySetMessage('NEED '+CITY_RUSH_COST+' EMBERS TO ACCELERATE THE WORK.');return;}
  META.embers-=CITY_RUSH_COST;b.remaining=Math.max(0,b.remaining-CITY_RUSH_SECONDS);
  if(b.remaining<=1e-6){b.remaining=0;b.state='ready';citySetMessage('CONSTRUCTION COMPLETE. SEAL IT TO BEGIN WORK.');}
  else citySetMessage(CITY_RUSH_SECONDS+' SECONDS CLEARED FROM THE BUILD.');cityPersist();
}
function cityAction(action){
  if(action==='city'){cityOpen();return true;}
  if(action==='cityclose'){cityAdvance(Date.now(),true);hubSheet=null;cityView='map';return true;}
  if(action==='cityback'){cityView='map';return true;}
  if(action.indexOf('citytool:')===0){cityTool=action.split(':')[1];cityMovingId=null;cityMessage=cityTool==='move'?'SELECT A BUILDING, THEN ITS NEW SITE.':'';return true;}
  if(action.indexOf('citycell:')===0){const p=action.split(':').slice(1).map(Number);cityCellAct(p[0],p[1]);return true;}
  if(action.indexOf('cityseal:')===0){citySeal(Number(action.split(':')[1]));return true;}
  if(action.indexOf('cityrush:')===0){cityRush(Number(action.split(':')[1]));return true;}
  if(action.indexOf('citystation:')===0){const b=cityBuilding(Number(action.split(':')[1]));if(b&&b.type==='yard'){citySelectedId=b.id;cityView='station';cityAdvance(Date.now(),true);}return true;}
  return false;
}
function cityFormatTime(s){s=Math.max(0,Math.ceil(s));const m=Math.floor(s/60),r=s%60;return m+':'+String(r).padStart(2,'0');}

function drawCitySheet(ctx){
  hubBtns=[];if(Date.now()-cityTickAt>=1000){cityTickAt=Date.now();cityAdvance(cityTickAt,false);}
  ctx.save();ctx.fillStyle='#080a10';ctx.fillRect(0,0,VW,VH);
  if(sprReady('ashford')){ctx.globalAlpha=0.20;const im=MAKKO_IMG.ashford,sc=Math.max(VW/im.naturalWidth,VH/im.naturalHeight);ctx.drawImage(im,(VW-im.naturalWidth*sc)/2,(VH-im.naturalHeight*sc)/2,im.naturalWidth*sc,im.naturalHeight*sc);ctx.globalAlpha=1;}
  ctx.fillStyle='rgba(7,10,16,0.84)';ctx.fillRect(0,0,VW,VH);
  if(cityView==='station')drawCityStation(ctx);else drawCityMap(ctx);
  ctx.restore();
}
function drawCityHeader(ctx,title){
  ctx.textAlign='left';ctx.fillStyle='#ffe0a0';ctx.font='800 38px "Chakra Petch",system-ui,sans-serif';ctx.fillText(title,40,60);
  ctx.font='700 18px "Chakra Petch",system-ui,sans-serif';ctx.fillStyle='#ffbd65';ctx.fillText(META.embers+' EMBERS',42,92);
  ctx.fillStyle='#b9d9cf';ctx.fillText(cityData().materials+' MATERIALS',220,92);ctx.fillStyle='#a8d8ff';ctx.fillText(cityWorkerCapacity()+' WORKERS',430,92);
  panel(ctx,620,30,62,52,10,'#242838','#8793ad');ctx.textAlign='center';ctx.fillStyle='#e9edf7';ctx.font='800 24px "Chakra Petch",system-ui,sans-serif';ctx.fillText('×',651,65);hubB(620,30,62,52,'cityclose');
}
function drawCityMap(ctx){
  drawCityHeader(ctx,'RATKIN QUARTER');
  ctx.textAlign='left';ctx.fillStyle='#c8c3cf';ctx.font='500 16px "Chakra Petch",system-ui,sans-serif';ctx.fillText('Build from the gate. Roads carry workers and output.',42,124);
  const gx=80,gy=154,cs=112,roads=cityRoadSet(),connected=cityConnectedRoads();
  for(let y=0;y<CITY_ROWS;y++)for(let x=0;x<CITY_COLS;x++){
    const px=gx+x*cs,py=gy+y*cs,key=cityCellKey(x,y),b=cityBuildingAt(x,y),road=roads.has(key),selected=b&&b.id===citySelectedId;
    panel(ctx,px+4,py+4,cs-8,cs-8,10,'rgba(25,29,38,0.88)',selected?'#fff0a8':'rgba(100,111,128,0.4)');
    if(road){
      const good=connected.has(key);ctx.strokeStyle=good?'#b38b5a':'#9f5860';ctx.lineWidth=15;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(px+cs/2,py+cs/2);
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(roads.has(cityCellKey(x+dx,y+dy))){ctx.lineTo(px+cs/2+dx*cs/2,py+cs/2+dy*cs/2);ctx.moveTo(px+cs/2,py+cs/2);}
      ctx.stroke();ctx.fillStyle=good?'#d8b782':'#c77b80';ctx.beginPath();ctx.arc(px+cs/2,py+cs/2,10,0,7);ctx.fill();
      if(key===CITY_GATE){ctx.textAlign='center';ctx.fillStyle='#fff1c5';ctx.font='800 14px "Chakra Petch",system-ui,sans-serif';ctx.fillText('GATE',px+cs/2,py+cs-14);}
    }
    if(b){const def=CITY_DEF[b.type],ok=cityConnected(b),col=!ok?'#ff7f78':b.state==='sealed'?'#8affc1':b.state==='ready'?'#ffe08a':'#9aa4b5';
      panel(ctx,px+14,py+13,cs-28,cs-26,12,'rgba(17,20,28,0.96)',col);ctx.textAlign='center';ctx.fillStyle=col;ctx.font='800 15px "Chakra Petch",system-ui,sans-serif';ctx.fillText(def.short,px+cs/2,py+43);
      ctx.font='600 13px "Chakra Petch",system-ui,sans-serif';ctx.fillStyle='#e5e8ef';const label=!ok?'NO ROAD':b.state==='building'?cityFormatTime(b.remaining):b.state==='ready'?'NEEDS SEAL':'WORKING';ctx.fillText(label,px+cs/2,py+70);
      if(b.state==='building'){ctx.fillStyle='#333b49';ctx.fillRect(px+24,py+82,cs-48,6);ctx.fillStyle='#ffbd65';ctx.fillRect(px+24,py+82,(cs-48)*(1-b.remaining/def.seconds),6);}
    }
    hubB(px+4,py+4,cs-8,cs-8,'citycell:'+x+':'+y);
  }
  const tools=[['inspect','INSPECT'],['road','ROAD'],['burrow','BURROW'],['yard','YARD'],['move','MOVE']];
  tools.forEach((t,i)=>{const x=42+i*128,on=cityTool===t[0];panel(ctx,x,742,118,60,10,on?'#413321':'#202631',on?'#ffca72':'#657189');ctx.textAlign='center';ctx.fillStyle=on?'#ffe4ad':'#d8deea';ctx.font='800 17px "Chakra Petch",system-ui,sans-serif';ctx.fillText(t[1],x+59,780);hubB(x,742,118,60,'citytool:'+t[0]);});
  drawCitySelection(ctx);
}
function drawCitySelection(ctx){
  panel(ctx,42,826,VW-84,330,14,'rgba(15,19,28,0.96)','#59677d');const b=cityBuilding(citySelectedId);
  ctx.textAlign='left';
  if(!b){ctx.fillStyle='#fff0c8';ctx.font='800 24px "Chakra Petch",system-ui,sans-serif';ctx.fillText('FOUNDATIONS',66,866);
    ctx.fillStyle='#cbd3df';ctx.font='500 18px "Chakra Petch",system-ui,sans-serif';ctx.fillText('Burrow: 40 embers · 1:30 · seal 20',66,908);ctx.fillText('Salvage Yard: 60 embers · 2:30 · seal 30',66,940);
    ctx.fillText('First copy needs no materials. Later copies do.',66,972);ctx.fillStyle='#aeb7c7';wrapText(ctx,cityMessage||'Choose a tool. Lay connected roads first, then place buildings beside them.',66,1012,VW-132,27);return;}
  const def=CITY_DEF[b.type],route=cityRoadDistanceTo(b);ctx.fillStyle=def.color;ctx.font='800 26px "Chakra Petch",system-ui,sans-serif';ctx.fillText(def.name,66,866);
  ctx.fillStyle='#d5dbe7';ctx.font='600 18px "Chakra Petch",system-ui,sans-serif';ctx.fillText(route==null?'NO ROAD TO GATE':'ROAD DISTANCE '+route,66,900);
  if(b.state==='building'){
    ctx.fillText('CONSTRUCTING · '+cityFormatTime(b.remaining),66,932);ctx.fillStyle='#aeb7c7';ctx.font='500 17px "Chakra Petch",system-ui,sans-serif';ctx.fillText('Ratkin continue while you run and for up to 8 hours away.',66,962);
    panel(ctx,66,990,270,62,10,META.embers>=CITY_RUSH_COST?'#3d2d1d':'#252632','#ffbd65');ctx.textAlign='center';ctx.fillStyle=META.embers>=CITY_RUSH_COST?'#ffe1a4':'#777d8a';ctx.font='800 18px "Chakra Petch",system-ui,sans-serif';ctx.fillText('RUSH 0:30 · '+CITY_RUSH_COST+' EMBERS',201,1028);hubB(66,990,270,62,'cityrush:'+b.id,META.embers>=CITY_RUSH_COST);
  }else if(b.state==='ready'){
    ctx.fillText('CONSTRUCTION COMPLETE · NOT OPERATING',66,932);ctx.fillStyle='#aeb7c7';ctx.font='500 17px "Chakra Petch",system-ui,sans-serif';ctx.fillText('Seal the finished structure before Ratkin can use it.',66,962);
    panel(ctx,66,990,270,62,10,META.embers>=def.seal?'#263b32':'#252632','#8affc1');ctx.textAlign='center';ctx.fillStyle=META.embers>=def.seal?'#bfffd9':'#777d8a';ctx.font='800 18px "Chakra Petch",system-ui,sans-serif';ctx.fillText('SEAL · '+def.seal+' EMBERS',201,1028);hubB(66,990,270,62,'cityseal:'+b.id,META.embers>=def.seal);
  }else if(b.type==='burrow'){
    ctx.fillText('SEALED · PROVIDES 1 WORKER',66,932);ctx.fillStyle='#aeb7c7';ctx.font='500 17px "Chakra Petch",system-ui,sans-serif';ctx.fillText(route==null?'Reconnect it before its worker can travel.':'Worker assignment is automatic.',66,962);
  }else{
    const active=cityYardActive(b),cycle=cityCycleSeconds(b);ctx.fillText(active?'OPERATING · '+cycle+'s PER MATERIAL':(route==null?'STOPPED · NO ROAD':'STOPPED · NEEDS A WORKER'),66,932);
    ctx.fillStyle='#aeb7c7';ctx.font='500 17px "Chakra Petch",system-ui,sans-serif';ctx.fillText('Ruin salvage → building material. Shorter roads work faster.',66,962);
    panel(ctx,66,990,270,62,10,'#26303d','#ffc070');ctx.textAlign='center';ctx.fillStyle='#ffe1ad';ctx.font='800 18px "Chakra Petch",system-ui,sans-serif';ctx.fillText('OPEN STATION',201,1028);hubB(66,990,270,62,'citystation:'+b.id);
  }
  if(cityMessage){ctx.textAlign='left';ctx.fillStyle='#ffcf80';ctx.font='600 16px "Chakra Petch",system-ui,sans-serif';wrapText(ctx,cityMessage,370,997,290,23);}
}
function drawCityStation(ctx){
  drawCityHeader(ctx,'SALVAGE STATION');const b=cityBuilding(citySelectedId);if(!b){cityView='map';return;}
  panel(ctx,42,132,VW-84,820,18,'rgba(15,19,28,0.96)','#9a7048');
  const active=cityYardActive(b),route=cityRoadDistanceTo(b),cycle=cityCycleSeconds(b),progress=active?Math.min(1,b.work/cycle):0;
  ctx.textAlign='center';ctx.fillStyle=active?'#8affc1':'#ff9c82';ctx.font='800 28px "Chakra Petch",system-ui,sans-serif';ctx.fillText(active?'PRODUCTION ACTIVE':(route==null?'NO ROAD TO GATE':'WAITING FOR A BURROW WORKER'),VW/2,188);
  ctx.strokeStyle='#6f614e';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(128,430);ctx.lineTo(592,430);ctx.stroke();
  for(const [x,label] of [[128,'RUINS'],[360,'WORKBENCH'],[592,'STORES']]){panel(ctx,x-74,370,148,112,12,'#202733','#7d725f');ctx.fillStyle='#e9dcc4';ctx.font='800 17px "Chakra Petch",system-ui,sans-serif';ctx.fillText(label,x,438);}
  const phase=progress<0.2?'APPROACH':progress<0.75?'WORK':progress<0.9?'HANDOFF':'RETURN';let wx=128;
  if(progress<0.2)wx=128+(360-128)*(progress/0.2);else if(progress<0.75)wx=360;else if(progress<0.9)wx=360+(592-360)*((progress-0.75)/0.15);else wx=592-(592-128)*((progress-0.9)/0.1);
  if(!active)wx=128;panel(ctx,wx-58,510,116,52,10,active?'#283b35':'#35272b',active?'#8affc1':'#ff9c82');ctx.fillStyle=active?'#d9ffe8':'#ffd0c6';ctx.font='800 15px "Chakra Petch",system-ui,sans-serif';ctx.fillText('RATKIN',wx,542);
  ctx.fillStyle='#2f3541';ctx.fillRect(86,620,VW-172,18);ctx.fillStyle=active?'#8affc1':'#9a5d5d';ctx.fillRect(86,620,(VW-172)*progress,18);
  ctx.fillStyle='#fff0c8';ctx.font='800 24px "Chakra Petch",system-ui,sans-serif';ctx.fillText(active?phase:'BLOCKED',VW/2,686);
  ctx.textAlign='left';ctx.fillStyle='#ccd4df';ctx.font='600 19px "Chakra Petch",system-ui,sans-serif';ctx.fillText('INPUT',84,754);ctx.fillText('OUTPUT',84,808);ctx.fillText('ROUTE',84,862);
  ctx.fillStyle='#fff';ctx.fillText('Ruin salvage from the cleared quarter',220,754);ctx.fillText('1 building material every '+cycle+' seconds',220,808);ctx.fillText(route==null?'Disconnected':route+' road steps · distance affects speed',220,862);
  panel(ctx,180,996,360,70,12,'#242c38','#9aa8bd');ctx.textAlign='center';ctx.fillStyle='#edf1f8';ctx.font='800 22px "Chakra Petch",system-ui,sans-serif';ctx.fillText('BACK TO TOWN PLAN',VW/2,1040);hubB(180,996,360,70,'cityback');
}
