// Authored sanctuary content contract. Claude's narrative handoffs add entries
// here; the runtime never invents a name or biography when an entry is missing.
// Keep IDs stable once published. Each profile may contain:
// {name, pronunciation, lifeStage, formerRole, voice, chronicleIntro,
//  background, desire, milestones:{stableKey:'text'}}.
const SOCIETY_PROFILES = Object.create(null);
const SOCIETY_PROFILE_ORDER = [];

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
