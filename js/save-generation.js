// Tony authorized a one-time clean start on September 17, 2026.
// This namespace is permanent across ordinary releases: never use a build ID here.
// Older open tabs can only rewrite retired keys, never resurrect their old progress.
const SAVE_KEYS=Object.freeze({meta:'fwoosh.save2.meta',opp:'fwoosh.save2.opp'});
(function retireOldProgress(){
  for(const key of ['fwoosh.meta','fwoosh.opp']){
    try{if(localStorage.getItem(key)!==null)localStorage.removeItem(key);}catch(e){}
  }
  // If storage is blocked, old data remains unread: loaders only use SAVE_KEYS.
  // Do not clear the origin; other games and Fwoosh display preferences share it.
})();
