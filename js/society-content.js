// Authored sanctuary content contract. Claude's narrative handoffs add entries
// here; the runtime never invents a name or biography when an entry is missing.
// Keep IDs stable once published. Each profile may contain:
// {name, pronunciation, lifeStage, formerRole, voice, chronicleIntro,
//  background, desire, milestones:{stableKey:'text'}}.
const SOCIETY_PROFILES = Object.create(null);
const SOCIETY_PROFILE_ORDER = [];

// Runtime-facing identity and advocacy metadata. The prose registry remains the
// source for authored chronicles, while this compact layer gives the simulation
// stable people to reason about before every biography is wired into the build.
const SOCIETY_PROFILE_SEEDS = [
  ['cit-001','Sek-Ra-Tun','elder','memory',false,{memory:1.0}],
  ['cit-002','Nim','child','',true,{}],
  ['cit-003','Dof-Ma-Rek','cook','bowl',true,{bowl:0.9}],
  ['cit-004','Tav-Ri','lantern','claw',true,{claw:0.7}],
  ['cit-005','Orr-Ve-Kan','merchant','hand',true,{hand:0.8}],
  ['cit-006','Yan-Su-Bel','farmer','bowl',true,{bowl:0.55}],
  ['cit-007','Ghe-Lo-Mar','herbalist','bowl',true,{bowl:0.6}],
  ['cit-008','Pel-Ta-Shu','wellkeeper','hearth',true,{hearth:0.75}],
  ['cit-009','Bru-Ka-Dol','mason','hand',true,{hand:0.7}],
  ['cit-010','Ili-Sa-Ven','weaver','hearth',true,{hearth:-0.7}],
  ['cit-011','Hes-Vo-Lim','lantern','claw',true,{claw:0.65}],
  ['cit-012','Kip','child','',true,{}],
  ['cit-013','Mor-Ne-Dath','baker','bowl',true,{bowl:0.7}],
  ['cit-014','Fen-Ya-Sool','scout','claw',true,{claw:0.65}],
  ['cit-015','Ras-Ti-Vok','leader','claw',true,{claw:0.85}],
  ['cit-016','Ume-Da-Ril','elder','memory',true,{memory:0.8}],
  ['cit-017','Shi-Pa-Nol','farmer','bowl',true,{bowl:0.65}],
  ['cit-018','Lud-Ro-Ken','merchant','hand',true,{hand:0.5}],
  ['cit-019','Eth-Wa-Min','midwife','hearth',true,{hearth:0.65}],
  ['cit-020','Ase-Ro-Wen','climber','claw',false,{claw:-0.8}],
  ['cit-021','Dak-Ro-Fen','mender','hand',false,{hand:0.6}],
  ['cit-022','Hal-Ne-Dur','elder','hearth',false,{hearth:0.9}]
];
for(const [id,name,role,bloc,killedByDuy,lean] of SOCIETY_PROFILE_SEEDS){
  SOCIETY_PROFILE_ORDER.push(id);
  SOCIETY_PROFILES[id]={name,formerRole:role,cohort:killedByDuy?'captive':'village',bloc,
    killedByDuy,advocacy:lean,influence:bloc?1:0.35,antiHuman:killedByDuy?0.05:0.2};
}

const SOCIETY_BLOCS=['hearth','bowl','hand','claw','memory'];
const RELATIONSHIP_TYPES=['family','friendship','debt','grief','rivalry','distrust','romance','solidarity','mentorship','respect','care'];

function societyProfileForResident(resident){
  const id=resident&&typeof resident.profileId==='string'?resident.profileId:'';
  return id&&SOCIETY_PROFILES[id]?SOCIETY_PROFILES[id]:null;
}
function societyProfileName(resident){
  const p=societyProfileForResident(resident);
  return p&&typeof p.name==='string'&&p.name.trim()?p.name.trim():'';
}
function societyNextProfileId(society,extraUsed){
  const used=new Set((society?.residents||[]).map(r=>typeof r.profileId==='string'?r.profileId:'').filter(Boolean));
  for(const id of extraUsed||[])used.add(id);
  // Test and mod content can register a profile after the built-in roster. Let
  // that explicit content claim the next arrival; the shipped roster remains
  // deterministic once the judgment begins.
  const builtIn=new Set(SOCIETY_PROFILE_SEEDS.map(v=>v[0]));
  const custom=SOCIETY_PROFILE_ORDER.find(id=>!builtIn.has(id)&&typeof id==='string'&&!used.has(id)&&SOCIETY_PROFILES[id]);
  if(custom)return custom;
  return SOCIETY_PROFILE_ORDER.find(id=>typeof id==='string'&&!used.has(id)&&SOCIETY_PROFILES[id])||'';
}
function societyBackfillProfiles(society){
  const used=new Set();
  for(const resident of society?.residents||[])if(typeof resident.profileId==='string'&&resident.profileId)used.add(resident.profileId);
  for(const resident of society?.residents||[]){
    if(resident.profileId)continue;
    const id=societyNextProfileId(society,used);if(!id)break;
    resident.profileId=id;used.add(id);
  }
}
function societyMilestoneText(resident,key){
  const p=societyProfileForResident(resident),value=p&&p.milestones&&p.milestones[key];
  if(typeof value==='string')return value;
  if(value&&typeof value.text==='string')return value.text;
  return '';
}
