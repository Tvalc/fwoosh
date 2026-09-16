const MAKKO_SPR_SRC = {
  "hero": "./media/spr/hero.png",
  "ashimp": "./media/spr/ashimp.png",
  "townsfolk": "./media/spr/ratkin.png",
  "powerup": "./media/spr/powerup.png",
  "firedemon": "./media/spr/firedemon.png",
  "husk": "./media/spr/husk.png",
  "keith": "./media/spr/arbiter.png",
  "arbiter_portrait": "./media/spr/arbiter_portrait.png",
  "bg": "./media/spr/bg.png",
  "ui_charge": "./media/spr/ui_charge.png",
  "ui_pip": "./media/spr/ui_pip.png",
  "beacon": "./media/spr/beacon.png",
  "heart": "./media/spr/heart.png",
  "happy": "./media/spr/ratkin.png",
  "ashford": "./media/spr/ashford.png"
};

const MAKKO_DIARY_SRC = {
  "duy_save": "./media/diary/duy_save.webp",
  "duy_gate": "./media/diary/duy_gate.webp",
  "dark_cell": "./media/diary/dark_cell.webp",
  "wraith": "./media/diary/wraith.webp"
};

const MAKKO_ANIM_SRC = {
  "ashimp": "./media/anim/ashimp.png",
  "firedemon": "./media/anim/firedemon.png",
  "hero": "./media/anim/hero.png",
  "arbiter_idle": "./media/anim/arbiter_idle.png",
  "arbiter_run": "./media/anim/arbiter_run.png",
  "arbiter_cast": "./media/anim/arbiter_cast.png",
  "arbiter_hit": "./media/anim/arbiter_hit.png",
  "ratkin_idle": "./media/anim/ratkin_idle.png",
  "ratkin_walk": "./media/anim/ratkin_walk.png",
  "ratkin_run": "./media/anim/ratkin_run.png",
  "hero_run": "./media/anim/hero_run.png",
  "save": "./media/anim/save.png",
  "ventfire": "./media/anim/ventfire.png",
  "ventcinder": "./media/anim/ventcinder.png"
};

const MAKKO_DIGITS_SRC = "./media/ui/digits.png";
const MAKKO_GLYPH_SRC = "./media/ui/glyphs.png";
const MAKKO_FLAME_SRC = "./media/fx/flame.png";

const MAKKO_IMG = {};
const MAKKO_ANIM_IMG = {};
// Civilian appearances only: never use the Arbiter as someone Duy can rescue.
// Selection uses the existing identity, not simulation RNG or render timing.
const RATKIN_VILLAGERS = ['ratkin','baker','elder','child','merchant','farmer',
  'lantern','weaver','cook','mason','herbalist','wellkeeper'];
function villagerType(c){
  return RATKIN_VILLAGERS[Math.abs((c?.villagerId??c?.id??0)|0)%RATKIN_VILLAGERS.length];
}
// BEGIN VILLAGE SOURCES (tools/prepare-village-runtime.py)
Object.assign(MAKKO_SPR_SRC, {
  "wellkeeper": "./media/spr/wellkeeper.png",
  "herbalist": "./media/spr/herbalist.png",
  "mason": "./media/spr/mason.png",
  "cook": "./media/spr/cook.png",
  "weaver": "./media/spr/weaver.png",
  "lantern": "./media/spr/lantern.png",
  "farmer": "./media/spr/farmer.png",
  "merchant": "./media/spr/merchant.png",
  "child": "./media/spr/child.png",
  "elder": "./media/spr/elder.png",
  "baker": "./media/spr/baker.png"
});
Object.assign(MAKKO_ANIM_SRC, {
  "wellkeeper_idle": "./media/anim/wellkeeper_idle.png",
  "wellkeeper_walk": "./media/anim/wellkeeper_walk.png",
  "wellkeeper_run": "./media/anim/wellkeeper_run.png",
  "herbalist_idle": "./media/anim/herbalist_idle.png",
  "herbalist_walk": "./media/anim/herbalist_walk.png",
  "herbalist_run": "./media/anim/herbalist_run.png",
  "mason_idle": "./media/anim/mason_idle.png",
  "mason_walk": "./media/anim/mason_walk.png",
  "mason_run": "./media/anim/mason_run.png",
  "cook_idle": "./media/anim/cook_idle.png",
  "cook_walk": "./media/anim/cook_walk.png",
  "cook_run": "./media/anim/cook_run.png",
  "weaver_idle": "./media/anim/weaver_idle.png",
  "weaver_walk": "./media/anim/weaver_walk.png",
  "weaver_run": "./media/anim/weaver_run.png",
  "lantern_idle": "./media/anim/lantern_idle.png",
  "lantern_walk": "./media/anim/lantern_walk.png",
  "lantern_run": "./media/anim/lantern_run.png",
  "farmer_idle": "./media/anim/farmer_idle.png",
  "farmer_walk": "./media/anim/farmer_walk.png",
  "farmer_run": "./media/anim/farmer_run.png",
  "merchant_idle": "./media/anim/merchant_idle.png",
  "merchant_walk": "./media/anim/merchant_walk.png",
  "merchant_run": "./media/anim/merchant_run.png",
  "child_idle": "./media/anim/child_idle.png",
  "child_walk": "./media/anim/child_walk.png",
  "child_run": "./media/anim/child_run.png",
  "elder_idle": "./media/anim/elder_idle.png",
  "elder_walk": "./media/anim/elder_walk.png",
  "elder_run": "./media/anim/elder_run.png",
  "baker_idle": "./media/anim/baker_idle.png",
  "baker_walk": "./media/anim/baker_walk.png",
  "baker_run": "./media/anim/baker_run.png"
});
// END VILLAGE SOURCES
// Shared with the arcade cast; loadCityArt also tolerates a future lazy loader.
const MAKKO_CITY_ANIM_SRC = {
  "farmer_idle": "./media/anim/farmer_idle.png",
  "farmer_walk": "./media/anim/farmer_walk.png",
  "mason_idle": "./media/anim/mason_idle.png",
  "mason_walk": "./media/anim/mason_walk.png"
};
function loadCityArt(){
  for(const [key,src] of Object.entries(MAKKO_CITY_ANIM_SRC)){
    if(MAKKO_ANIM_IMG[key])continue;
    const im=new Image();im.src=src;MAKKO_ANIM_IMG[key]=im;
  }
}
const MAKKO_FLAME_IMG = new Image();
const MAKKO_DIGITS_IMG = new Image();
const MAKKO_GLYPH_IMG = new Image();
(function () {
  try {
    for (const k in MAKKO_SPR_SRC) {
      const im = new Image();
      im.src = MAKKO_SPR_SRC[k];
      MAKKO_IMG[k] = im;
    }
  } catch (e) {}
})();
(function () {
  try {
    for (const k in MAKKO_DIARY_SRC) {
      const im = new Image();
      im.src = MAKKO_DIARY_SRC[k];
      MAKKO_IMG[k] = im;
    }
  } catch (e) {}
})();
(function () {
  try {
    for (const k in MAKKO_ANIM_SRC) {
      const im = new Image();
      im.src = MAKKO_ANIM_SRC[k];
      MAKKO_ANIM_IMG[k] = im;
    }
  } catch (e) {}
})();
(function () {
  try {
    MAKKO_FLAME_IMG.src = MAKKO_FLAME_SRC;
  } catch (e) {}
})();
(function () {
  try {
    MAKKO_DIGITS_IMG.src = MAKKO_DIGITS_SRC;
  } catch (e) {}
})();
(function () {
  try {
    MAKKO_GLYPH_IMG.src = MAKKO_GLYPH_SRC;
  } catch (e) {}
})();

