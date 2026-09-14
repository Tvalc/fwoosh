const MAKKO_SPR_SRC = {
  "hero": "./media/spr/hero.png",
  "ashimp": "./media/spr/ashimp.png",
  "townsfolk": "./media/spr/townsfolk.png",
  "powerup": "./media/spr/powerup.png",
  "firedemon": "./media/spr/firedemon.png",
  "husk": "./media/spr/husk.png",
  "keith": "./media/spr/keith.png",
  "bg": "./media/spr/bg.png",
  "ui_charge": "./media/spr/ui_charge.png",
  "ui_pip": "./media/spr/ui_pip.png",
  "beacon": "./media/spr/beacon.png",
  "heart": "./media/spr/heart.png",
  "happy": "./media/spr/happy.png",
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
  "keith": "./media/anim/keith.png",
  "townsfolk": "./media/anim/townsfolk.png",
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

