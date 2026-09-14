// ---------------------------------------------------------------- CrazyGames
// Thin wrapper: real calls on the CrazyGames platform, silent no-ops everywhere
// else (GitHub Pages, local, itch). Feature-detected, so load order is safe.
const CG = (function(){
  const has=()=> typeof window!=='undefined' && window.CrazyGames && window.CrazyGames.SDK;
  let ready=false, playing=false;
  return {
    async init(){ if(!has()) return;
      try{ await window.CrazyGames.SDK.init(); ready=true;
        try{ window.CrazyGames.SDK.game.loadingStop(); }catch(e){}
        if(typeof mode!=='undefined' && mode==='play') this.start();
      }catch(e){} },
    start(){ if(!ready||playing) return; playing=true;
      try{ window.CrazyGames.SDK.game.gameplayStart(); }catch(e){} },
    stop(){ if(!ready||!playing) return; playing=false;
      try{ window.CrazyGames.SDK.game.gameplayStop(); }catch(e){} },
    happy(){ if(!ready) return; try{ window.CrazyGames.SDK.game.happytime(); }catch(e){} },
  };
})();
