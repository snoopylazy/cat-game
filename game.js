/* ============================================================
   Cat vs Cat — Sound Battle
   Vanilla JS. No dependencies.
   ============================================================ */
'use strict';

/* ---------------- utils ---------------- */
const $  = (s, r = document) => r.querySelector(s);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp  = (a, b, t) => a + (b - a) * t;
const rand  = (a, b) => a + Math.random() * (b - a);
const REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/* inline sprite icon reference */
const icon = name => `<svg class="ic" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

/* ---------------- data: skins ----------------
   voice = the real meow file this cat uses as the player; vrate = its pitch
   (tuned so each skin sounds distinct from the enemy's version of the file). */
const SKINS = [
  { id:'shadow',    name:'Shadow',          price:0,    fur:'#6b7280', belly:'#e5e7eb', eye:'#34d399', patch:'#4b5563', pattern:'none',    accessory:null,      accColor:'#ef4444', voice:'sounds/dragon-studio-cat-meow-401729.mp3',                          vrate:1.12 },
  { id:'mittens',   name:'Mittens',         price:60,   fur:'#9aa4b2', belly:'#f8fafc', eye:'#f59e0b', patch:'#cbd5e1', pattern:'socks',   accessory:null,      accColor:'#ef4444', voice:'sounds/stu9-cute-cat-352656.mp3',                                  vrate:1.30 },
  { id:'tabby',     name:'Sunny Tabby',     price:100,  fur:'#f59e0b', belly:'#fff7ed', eye:'#a16207', patch:'#d97706', pattern:'stripes', accessory:null,      accColor:'#ef4444', voice:'sounds/stu9-cute-cat-352656.mp3',                                  vrate:1.18 },
  { id:'cookie',    name:'Cookie',          price:120,  fur:'#a9713f', belly:'#f6e7d3', eye:'#22c55e', patch:'#4a2f1b', pattern:'spots',   accessory:null,      accColor:'#ef4444', voice:'sounds/dragon-studio-cute-cat-meow-472372.mp3',                    vrate:1.08 },
  { id:'snowpuff',  name:'Snowpuff',        price:150,  fur:'#eef2f7', belly:'#ffffff', eye:'#38bdf8', patch:'#cbd5e1', pattern:'none',    accessory:null,      accColor:'#ef4444', voice:'sounds/virtual_vibes-cute-cat-meow-400946.mp3',                    vrate:1.25 },
  { id:'tuxedo',    name:'Sir Tuxedo',      price:200,  fur:'#111827', belly:'#f9fafb', eye:'#eab308', patch:'#f9fafb', pattern:'tuxedo',  accessory:null,      accColor:'#ef4444', voice:'sounds/ribhavagrawal-cat-meowing-type-02-293290.mp3',              vrate:0.95 },
  { id:'calico',    name:'Calico Crazy',    price:250,  fur:'#fb923c', belly:'#fff7ed', eye:'#22c55e', patch:'#1f2937', pattern:'calico',  accessory:null,      accColor:'#ef4444', voice:'sounds/dragon-studio-cute-cat-meow-472372.mp3',                    vrate:1.20 },
  { id:'siamese',   name:'Mister Siamese',  price:300,  fur:'#fde68a', belly:'#fffbeb', eye:'#2563eb', patch:'#a16207', pattern:'points',  accessory:null,      accColor:'#ef4444', voice:'sounds/freesound_community-cat-meow-14536.mp3',                    vrate:1.10 },
  { id:'pepper',    name:'Pepper',          price:350,  fur:'#4b5563', belly:'#e5e7eb', eye:'#f97316', patch:'#1f2937', pattern:'stripes', accessory:'scarf',   accColor:'#dc2626', voice:'sounds/tanweraman-angry-cat-hq-sound-effect-240675.mp3',           vrate:0.98 },
  { id:'ninja',     name:'Ninja Neko',      price:400,  fur:'#1f2937', belly:'#374151', eye:'#ef4444', patch:'#0f172a', pattern:'none',    accessory:'bandana', accColor:'#dc2626', voice:'sounds/alex_jauk-annoyed-cat-meows-angrily-438006.mp3',            vrate:1.05 },
  { id:'wizard',    name:'Wizard Whiskers', price:500,  fur:'#7c3aed', belly:'#ede9fe', eye:'#facc15', patch:'#fde047', pattern:'stars',   accessory:'hat',     accColor:'#6d28d9', voice:'sounds/virtual_vibes-cat-meow-sound-383823.mp3',                   vrate:1.15 },
  { id:'boba',      name:'Boba',            price:600,  fur:'#f0abfc', belly:'#fdf2f8', eye:'#7c3aed', patch:'#a21caf', pattern:'heart',   accessory:'bow',     accColor:'#db2777', voice:'sounds/virtual_vibes-cute-cat-meow-400946.mp3',                    vrate:1.22 },
  { id:'king',      name:'King Whiskers',   price:800,  fur:'#fbbf24', belly:'#fef3c7', eye:'#b45309', patch:'#f59e0b', pattern:'none',    accessory:'crown',   accColor:'#f59e0b', voice:'sounds/poorartistt-angry-cat-sound-effect-no-copyright-405796.mp3', vrate:0.90 },
  { id:'professor', name:'Professor Paws',  price:1000, fur:'#374151', belly:'#f9fafb', eye:'#0ea5e9', patch:'#f9fafb', pattern:'tuxedo',  accessory:'shades',  accColor:'#111827', voice:'sounds/alex_jauk-annoyed-cat-meows-angrily-438006.mp3',            vrate:1.02 },
  { id:'cosmic',    name:'Cosmic Neko',     price:1200, fur:'#1e1b4b', belly:'#c7d2fe', eye:'#facc15', patch:'#fde047', pattern:'stars',   accessory:'halo',    accColor:'#fde047', voice:'sounds/freesound_community-cat-meow-14536.mp3',                    vrate:1.28 },
  { id:'captain',   name:'Cap\u2019n Whiskers', price:1500, fur:'#fde68a', belly:'#fffbeb', eye:'#1d4ed8', patch:'#a16207', pattern:'points', accessory:'pirate',  accColor:'#111827', voice:'sounds/poorartistt-angry-cat-sound-effect-no-copyright-405796.mp3', vrate:0.84 },
];
const skinById = id => SKINS.find(s => s.id === id) || SKINS[0];
/* the equipped cat's real voice + pitch (used whenever your cat shouts) */
function playerVoice(){
  const s = skinById(save.equipped);
  return { src:s.voice, rate:s.vrate || 1 };
}
function playerMeow(opts){
  const v = playerVoice();
  Meows.play(v.src, Object.assign({ rate:v.rate, synth:() => SFX.meow() }, opts || {}));
}

/* ---------------- data: levels (17) ----------------
   hits → enemy HP (× HP_PER_HIT) · push → its loudness · dmg → damage it deals
   phase → roar rhythm offset · snd → its meow file · rate → its base pitch */
const LEVELS = [
  { name:'Scared Kitten',    skin:'snowpuff',  hits:4,  push:0.26, dmg:7,  phase:0.4, snd:'sounds/stu9-cute-cat-352656.mp3' },
  { name:'Sunny Tom',        skin:'tabby',     hits:5,  push:0.30, dmg:8,  phase:1.3, snd:'sounds/dragon-studio-cute-cat-meow-472372.mp3' },
  { name:'Alley Shadow',     skin:'shadow',    hits:5,  push:0.34, dmg:9,  phase:2.2, snd:'sounds/dragon-studio-cat-meow-401729.mp3' },
  { name:'Calico Crazy',     skin:'calico',    hits:6,  push:0.39, dmg:10, phase:0.9, snd:'sounds/virtual_vibes-cute-cat-meow-400946.mp3' },
  { name:'Duke Tuxedo',      skin:'tuxedo',    hits:6,  push:0.44, dmg:11, phase:3.0, snd:'sounds/ribhavagrawal-cat-meowing-type-02-293290.mp3' },
  { name:'Mister Siamese',   skin:'siamese',   hits:7,  push:0.49, dmg:12, phase:1.7, snd:'sounds/virtual_vibes-cat-meow-sound-383823.mp3' },
  { name:'Ninja Neko',       skin:'ninja',     hits:7,  push:0.53, dmg:13, phase:2.6, snd:'sounds/alex_jauk-annoyed-cat-meows-angrily-438006.mp3' },
  { name:'Wizard Whiskers',  skin:'wizard',    hits:8,  push:0.57, dmg:14, phase:0.2, snd:'sounds/freesound_community-cat-meow-14536.mp3' },
  { name:'Shadowfang',       skin:'shadow',    hits:9,  push:0.60, dmg:16, phase:1.1, snd:'sounds/tanweraman-angry-cat-hq-sound-effect-240675.mp3' },
  { name:'King Whiskers',    skin:'king',      hits:10, push:0.64, dmg:18, phase:2.9, snd:'sounds/poorartistt-angry-cat-sound-effect-no-copyright-405796.mp3' },
  /* --- harder set: appended after the original 10 --- */
  { name:'Mittens the Merciless', skin:'mittens',   hits:10, push:0.66, dmg:19, phase:1.5, snd:'sounds/virtual_vibes-cute-cat-meow-400946.mp3',              rate:1.15 },
  { name:'Cookie Crusher',        skin:'cookie',    hits:11, push:0.68, dmg:20, phase:2.4, snd:'sounds/ribhavagrawal-cat-meowing-type-02-293290.mp3',         rate:0.92 },
  { name:'Pepper Puncher',        skin:'pepper',    hits:11, push:0.70, dmg:21, phase:0.7, snd:'sounds/alex_jauk-annoyed-cat-meows-angrily-438006.mp3',       rate:1.10 },
  { name:'Boba Brawler',          skin:'boba',      hits:12, push:0.72, dmg:22, phase:3.2, snd:'sounds/tanweraman-angry-cat-hq-sound-effect-240675.mp3',      rate:1.05 },
  { name:'Professor Claws',       skin:'professor', hits:12, push:0.74, dmg:22, phase:1.9, snd:'sounds/freesound_community-cat-meow-14536.mp3',               rate:0.95 },
  { name:'Cosmic Cataclysm',      skin:'cosmic',    hits:13, push:0.77, dmg:23, phase:2.7, snd:'sounds/virtual_vibes-cat-meow-sound-383823.mp3',              rate:1.20 },
  { name:'Cap\u2019n Chaos',      skin:'captain',   hits:14, push:0.80, dmg:25, phase:0.3, snd:'sounds/poorartistt-angry-cat-sound-effect-no-copyright-405796.mp3', rate:0.88 },
];
const HP_PER_HIT = 20;       // enemy max hp = hits * HP_PER_HIT
const PLAYER_MAX = 100;
const PLAYER_POWER = 1.30;   // how hard your loudness pushes
const METER_RATE = 62;       // meter units per second
const SPECIAL_GAIN = 12;     // charge per second at full loudness

/* ---------------- achievements ---------------- */
const ACHIEVEMENTS = [
  { id:'beat10', name:'Fighter', desc:'Beat 10 levels', icon:'trophy' },
  { id:'beatAll', name:'Champion', desc:'Beat all 17 levels', icon:'crown' },
  { id:'flawless', name:'Perfect', desc:'Win with full HP', icon:'sparkle' },
  { id:'combo10', name:'Combo Master', desc:'Get a 10× combo', icon:'sparkle' },
  { id:'combo20', name:'Unstoppable', desc:'Get a 20× combo', icon:'sparkle' },
  { id:'wave5', name:'Survivor', desc:'Reach wave 5 in Endless', icon:'sparkle' },
  { id:'wave10', name:'Veteran', desc:'Reach wave 10 in Endless', icon:'sparkle' },
  { id:'wave20', name:'Legend', desc:'Reach wave 20 in Endless', icon:'crown' },
  { id:'rich', name:'Collector', desc:'Earn 1000 coins total', icon:'coin' },
  { id:'allSkins', name:'Fashionista', desc:'Own every skin', icon:'bag' },
];
function hasAchievement(id){ return !!(save.achievements && save.achievements[id]); }
function grantAchievement(id){
  if(!save.achievements) save.achievements = {};
  if(!save.achievements[id]){
    save.achievements[id] = Date.now();
    persist();
    toast(icon(ACHIEVEMENTS.find(a => a.id === id)?.icon || 'sparkle') + ' Achievement: ' + (ACHIEVEMENTS.find(a => a.id === id)?.name || id));
  }
}
function checkAchievements(won, battle){
  if(!won) return;
  const totalOwned = save.owned && save.owned.length;
  const allSkinIds = SKINS.map(s => s.id);
  const ownsAll = allSkinIds.every(id => save.owned.includes(id));
  const levelsBeat = Math.max(0, Math.min(LEVELS.length + 1, save.bestLevel)) - 1;
  // Beat counts
  if(levelsBeat >= 10) grantAchievement('beat10');
  if(save.bestLevel > LEVELS.length) grantAchievement('beatAll');
  // Flawless
  if(battle && battle.playerHP >= PLAYER_MAX) grantAchievement('flawless');
  // Combos
  if(save.bestCombo >= 20) grantAchievement('combo20');
  if(save.bestCombo >= 10) grantAchievement('combo10');
  // Endless waves
  if((save.endlessBest || 0) >= 20) grantAchievement('wave20');
  if((save.endlessBest || 0) >= 10) grantAchievement('wave10');
  if((save.endlessBest || 0) >= 5) grantAchievement('wave5');
  // Coins total (approximate via save.coins? but we also track earned; better use coins count as proxy)
  if(save.coins >= 1000) grantAchievement('rich');
  // All skins
  if(ownsAll) grantAchievement('allSkins');
}

/* difficulty presets — scale the enemy's push and the damage it deals */
const DIFFICULTY = {
  easy:   { label:'Easy',   push:0.80, dmg:0.75 },
  normal: { label:'Normal', push:1.00, dmg:1.00 },
  hard:   { label:'Hard',   push:1.15, dmg:1.25 },
};
const diff = () => DIFFICULTY[save.difficulty] || DIFFICULTY.normal;

/* ---------------- endless mode ----------------
   Procedural waves: a random cat with a scaled difficulty curve. */
const SOUND_FILES = [...new Set(LEVELS.map(l => l.snd))];
const ENDLESS_ADJ  = ['Ferocious','Rabid','Mighty','Shadow','Thunder','Iron','Vicious','Savage','Cursed','Ancient','Royal','Grim','Phantom','Storm','Feral'];
const ENDLESS_NOUN = ['Whiskers','Claw','Fang','Paw','Neko','Tom','Mittens','Stalker','Hunter','Brawler','Terror','Wraith','Fury','Scourge','Kaiser'];
function makeEndlessLevel(wave){
  const w = Math.max(0, wave - 1);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  return {
    name:  pick(ENDLESS_ADJ) + ' ' + pick(ENDLESS_NOUN),
    skin:  pick(SKINS).id,
    hits:  6 + Math.min(20, Math.round(w * 0.8)),
    push:  clamp(0.50 + w * 0.018, 0.50, 0.90),
    dmg:   12 + Math.min(16, Math.round(w * 0.7)),
    phase: Math.random() * Math.PI * 2,
    snd:   pick(SOUND_FILES),
    rate:  +(0.82 + Math.random() * 0.5).toFixed(2),
  };
}

/* ---------------- save ---------------- */
const SAVE_KEY = 'catvscat.save.v1';
const DEFAULT_SAVE = { coins:75, owned:['shadow'], equipped:'shadow', bestLevel:1, muted:false, sensitivity:55, theme:'dark', volCat:0.85, volFx:0.25, volMusic:0.35, difficulty:'normal', bestCombo:0, endlessBest:0, achievements:{}, stats:{fightsWon:0, fightsLost:0, totalCoinsEarned:0} };
let save = loadSave();
function loadSave(){
  try{ return Object.assign({}, DEFAULT_SAVE, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); }
  catch(e){ return Object.assign({}, DEFAULT_SAVE); }
}
function persist(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }catch(e){} }

/* ---------------- audio: sfx ---------------- */
let actx = null;
function getAudioCtx(){
  if(!actx){
    const AC = window.AudioContext || window.webkitAudioContext;
    actx = new AC();
  }
  if(actx.state === 'suspended') actx.resume();
  return actx;
}
let noiseBuf = null;
function getNoise(ctx){
  if(noiseBuf) return noiseBuf;
  const dur = 1;
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for(let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}

const SFX = {
  muted: save.muted,
  /* effect level — live from Settings (0..1) */
  get vol(){ return save.volFx; },
  tone(freq, dur, type, vol, slideTo){
    if(this.muted) return;
    try{
      const ctx = getAudioCtx(), t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, t);
      if(slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime((vol || 0.18) * this.vol, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.03);
    }catch(e){}
  },
  noise(dur, vol, hp){
    if(this.muted) return;
    try{
      const ctx = getAudioCtx(), t = ctx.currentTime;
      const src = ctx.createBufferSource(); src.buffer = getNoise(ctx);
      const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp || 900;
      const g = ctx.createGain();
      g.gain.setValueAtTime((vol || 0.16) * this.vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.2));
      src.connect(f).connect(g).connect(ctx.destination);
      src.start(t); src.stop(t + (dur || 0.2) + 0.02);
    }catch(e){}
  },
  /* A real-ish cat "meow": sawtooth source with a two-stage pitch glide
     ("me-OW"), vibrato, moving formant band-passes (vowel shape) and a
     breathy noise transient.  pitch scales the whole voice up/down. */
  catMeow(pitch, dur, vol, style, rasp){
    if(this.muted) return;
    try{
      const ctx = getAudioCtx(), t = ctx.currentTime;
      pitch = pitch || 1; dur = dur || 0.5; vol = vol || 0.5;
      const base = 520 * pitch;

      const out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, t);
      out.gain.exponentialRampToValueAtTime(vol, t + 0.035);
      out.gain.setValueAtTime(vol, t + dur * 0.45);
      out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      out.connect(ctx.destination);

      // two formants = the "vowel" character of the meow
      const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.Q.value = 5;
      const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.Q.value = 8;
      const g1 = ctx.createGain(); g1.gain.value = 1.6;
      const g2 = ctx.createGain(); g2.gain.value = 0.9;
      f1.connect(g1).connect(out);
      f2.connect(g2).connect(out);

      // source with pitch contour + vibrato
      const o = ctx.createOscillator(); o.type = 'sawtooth';
      if(style === 'mew'){                       // short, rising "mew!"
        o.frequency.setValueAtTime(base * 0.95, t);
        o.frequency.exponentialRampToValueAtTime(base * 1.75, t + dur * 0.6);
        o.frequency.exponentialRampToValueAtTime(base * 1.5, t + dur);
      } else {                                   // classic "me-OW"
        o.frequency.setValueAtTime(base * 0.88, t);
        o.frequency.exponentialRampToValueAtTime(base * 1.7, t + dur * 0.3);
        o.frequency.exponentialRampToValueAtTime(base * 0.6, t + dur);
      }
      const vib = ctx.createOscillator(); vib.frequency.value = 23;
      const vibg = ctx.createGain(); vibg.gain.value = base * 0.035;
      vib.connect(vibg); vibg.connect(o.frequency);

      // formant movement over the vowel
      f1.frequency.setValueAtTime(800 * pitch, t);
      f1.frequency.linearRampToValueAtTime(1150 * pitch, t + dur * 0.3);
      f1.frequency.linearRampToValueAtTime(740 * pitch, t + dur);
      f2.frequency.setValueAtTime(2000 * pitch, t);
      f2.frequency.linearRampToValueAtTime(2950 * pitch, t + dur * 0.3);
      f2.frequency.linearRampToValueAtTime(1850 * pitch, t + dur);

      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = rasp ? 3100 : 4200; lp.Q.value = rasp ? 1.1 : 0.6;
      const dry = ctx.createGain(); dry.gain.value = 0.3;   // unfiltered body so it carries
      o.connect(lp); lp.connect(f1); lp.connect(f2); lp.connect(dry); dry.connect(out);

      o.start(t); o.stop(t + dur + 0.05);
      vib.start(t); vib.stop(t + dur + 0.05);

      // breathy onset — "mmmew"
      const src = ctx.createBufferSource(); src.buffer = getNoise(ctx);
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1600; bp.Q.value = 1.5;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(rasp ? 0.17 : 0.09, t);
      ng.gain.exponentialRampToValueAtTime(0.0001, t + (rasp ? 0.2 : 0.12));
      src.connect(bp).connect(ng).connect(ctx.destination);
      src.start(t); src.stop(t + 0.14);
    }catch(e){}
  },
  meow(){
    const r = Math.random();
    const style = r < 0.3 ? 'mew' : 'meow';
    this.catMeow(rand(0.9, 1.25), style === 'mew' ? rand(0.22, 0.34) : rand(0.42, 0.6), 0.5, style);
  },
  /* The rival is a big, raspy tomcat: still a cat meow, but deeper and
     rougher than yours, with the occasional growl/hiss mixed in. */
  enemyMeow(){
    const r = Math.random();
    if(r < 0.20) return this.growl();          // sometimes a low rumble
    if(r < 0.28) return this.hiss();           // rarely a spit
    const style = Math.random() < 0.3 ? 'mew' : 'meow';
    const dur = style === 'mew' ? rand(0.26, 0.38) : rand(0.5, 0.78);
    this.catMeow(rand(0.6, 0.82), dur, 0.42, style, true);
  },
  growl(){
    if(this.muted) return;
    try{
      const ctx = getAudioCtx(), t = ctx.currentTime, dur = 0.65;
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, t);
      out.gain.exponentialRampToValueAtTime(0.36 * this.vol, t + 0.05);
      out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      out.connect(ctx.destination);

      // rough amplitude modulation = the "rrrrr" texture
      const am = ctx.createOscillator(); am.type = 'square'; am.frequency.value = 44;
      const amg = ctx.createGain(); amg.gain.value = 0.5;
      const vig = ctx.createGain(); vig.gain.value = 0.5;
      am.connect(amg); amg.connect(vig.gain);

      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700; lp.Q.value = 3;
      const o = ctx.createOscillator(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(98, t);
      o.frequency.linearRampToValueAtTime(72, t + dur);
      o.connect(lp); lp.connect(vig); vig.connect(out);

      o.start(t); o.stop(t + dur + 0.03);
      am.start(t); am.stop(t + dur + 0.03);
      this.noise(dur * 0.85, 0.05, 260);
    }catch(e){}
  },
  hiss(){
    if(this.muted) return;
    try{
      const ctx = getAudioCtx(), t = ctx.currentTime, dur = 0.4;
      const src = ctx.createBufferSource(); src.buffer = getNoise(ctx);
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2200;
      const pk = ctx.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 4200; pk.gain.value = 9; pk.Q.value = 1.1;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22 * this.vol, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(hp).connect(pk).connect(g).connect(ctx.destination);
      src.start(t); src.stop(t + dur + 0.02);
    }catch(e){}
  },
  hit(){ this.tone(180, 0.22, 'sine', 0.22, 60); this.noise(0.14, 0.18, 500); },
  /* the charging power behind MEGA MEOW — the cry itself is the
     player's real voice (playerMeow) layered on top */
  special(){
    this.tone(170, 0.5, 'sawtooth', 0.1, 1500);
    this.noise(0.5, 0.09, 1800);
  },
  win(){ [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.28, 'triangle', 0.16), i * 110)); },
  lose(){ [440, 349, 262, 196].forEach((f, i) => setTimeout(() => this.tone(f, 0.32, 'sawtooth', 0.14), i * 130)); },
  click(){ this.tone(660, 0.07, 'square', 0.08); },
  buy(){ [784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.16, 'triangle', 0.14), i * 90)); },
  deny(){ this.tone(200, 0.18, 'square', 0.12, 120); },
};

/* ---------------- audio: real enemy meow files ----------------
   Each level's enemy has its own MP3 from the sounds/ folder.
   Files are decoded once and cached; if a file can't load (e.g. opened
   via file://), we fall back to the synthesized enemyMeow(). */
const Meows = {
  cache: new Map(),
  /* resolve relative to this script's folder, so it works no matter
     where the page was opened from (/, /cat-vs-cat/, a subpath, …) */
  base: (document.querySelector('script[src*="game.js"]')?.src || document.baseURI).replace(/[^/]*$/, ''),
  resolve(src){ try{ return new URL(src, this.base).href; }catch(e){ return src; } },
  load(src){
    if(this.cache.has(src)) return this.cache.get(src);
    const url = this.resolve(src);
    const p = fetch(url)
      .then(r => { if(!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
      .then(b => getAudioCtx().decodeAudioData(b))
      .then(buf => { console.info('[Meows] loaded:', url); return buf; });
    p.catch(err => {
      console.warn('[Meows] could not load', url, '—', err.message || err, '— falling back to synth voice');
      this.cache.delete(src);   // allow retry on next play
    });
    this.cache.set(src, p);
    return p;
  },
  preload(src){ if(src) this.load(src).catch(() => {}); },
  /* opts: { vol:0..1 (× the Cat-volumes slider), rate:base pitch, vary:bool, synth:fn fallback } */
  play(src, opts){
    if(SFX.muted || !src) return;
    opts = opts || {};
    const ctx = getAudioCtx();
    if(ctx.state === 'suspended') ctx.resume();   // browser autoplay safety
    if(this.active && this.active.src === src && this.active.until > ctx.currentTime + 0.1) return; // previous shout still playing
    const rate = opts.rate || 1;
    this.load(src).then(buf => {
      if(SFX.muted) return;
      const ctx = getAudioCtx();
      const node = ctx.createBufferSource();
      node.buffer = buf;
      node.playbackRate.value = rate * (opts.vary === false ? 1 : rand(0.94, 1.06));   // slight variation each shout
      const g = ctx.createGain();
      g.gain.value = clamp((opts.vol == null ? 1 : opts.vol) * save.volCat, 0, 1);
      node.connect(g).connect(ctx.destination);
      node.start();
      this.active = { src, until: ctx.currentTime + buf.duration / node.playbackRate.value };
      Music.duck(buf.duration / node.playbackRate.value);   // soften the music under the cat voice
    }).catch(() => { if(!SFX.muted) (opts.synth || (() => SFX.enemyMeow()))(); });   // synth fallback
  },
};

/* ---------------- audio: background music ----------------
   One looping track (sounds/bg-sounds.mp3). It ducks under cat voices
   and is held silent during microphone calibration (the game asks you
   to stay quiet, and the mic has no echo-cancellation). */
const Music = {
  buf:null, node:null, gain:null, loading:false, started:false, duckTimer:null, _held:false,
  target(){ return (SFX.muted || this._held) ? 0 : save.volMusic; },
  resolve(){ return Meows.resolve('sounds/bg-sounds.mp3'); },
  start(){
    this.started = true;
    getAudioCtx();          // unlock / resume the audio context on a user gesture
    this.load();
    if(this.buf) this._play();
  },
  load(){
    if(this.buf || this.loading) return;
    this.loading = true;
    const url = this.resolve();
    fetch(url)
      .then(r => { if(!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
      .then(b => getAudioCtx().decodeAudioData(b))
      .then(buf => { this.buf = buf; this.loading = false; if(this.started) this._play(); })
      .catch(err => { this.loading = false; console.warn('[Music] could not load', url, '—', err.message || err); });
  },
  _play(){
    if(this.node || !this.buf) return;
    const ctx = getAudioCtx();
    const node = ctx.createBufferSource();
    node.buffer = this.buf; node.loop = true;
    const g = ctx.createGain();
    g.gain.value = this.target();
    node.connect(g).connect(ctx.destination);
    node.start();
    this.node = node; this.gain = g;
  },
  /* ramp down while a meow plays, then ease back up */
  duck(seconds){
    if(!this.gain) return;
    const ctx = getAudioCtx(), now = ctx.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setTargetAtTime(this.target() * 0.32, now, 0.03);
    clearTimeout(this.duckTimer);
    this.duckTimer = setTimeout(() => this.apply(0.3), Math.max(350, (seconds || 0.5) * 1000));
  },
  /* hold silent (e.g. during calibration) */
  hold(on){ this._held = !!on; this.apply(0.2); },
  apply(smooth){
    if(!this.gain) return;
    clearTimeout(this.duckTimer);
    this.gain.gain.setTargetAtTime(this.target(), getAudioCtx().currentTime, smooth == null ? 0.05 : smooth);
  },
};

/* ---------------- mic ---------------- */
const Mic = {
  stream:null, analyser:null, data:null, ready:false,
  noiseFloor:0.006, raw:0, level:0,
  async enable(){
    const stream = await navigator.mediaDevices.getUserMedia({
      audio:{ echoCancellation:false, noiseSuppression:false, autoGainControl:false }
    });
    this.stream = stream;
    const ctx = getAudioCtx();
    const src = ctx.createMediaStreamSource(stream);
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.55;
    src.connect(this.analyser);           // analyse only — never routed to speakers
    this.data = new Uint8Array(this.analyser.fftSize);
    this.ready = true;
  },
  stop(){
    if(this.stream) this.stream.getTracks().forEach(t => t.stop());
    this.ready = false;
  },
  readRms(){
    if(!this.ready) return 0;
    if(actx && actx.state === 'suspended') actx.resume();   // keep the mic alive across fights
    this.analyser.getByteTimeDomainData(this.data);
    let sum = 0;
    for(let i = 0; i < this.data.length; i++){
      const v = (this.data[i] - 128) / 128;
      sum += v * v;
    }
    this.raw = Math.sqrt(sum / this.data.length);
    return this.raw;
  }
};

/* ---------------- cat art ---------------- */
function buildCatSVG(skin){
  const pattern = skin.pattern || 'none';
  const acc = skin.accessory || 'none';
  const style = `--fur:${skin.fur};--belly:${skin.belly};--eye:${skin.eye};` +
                `--patch:${skin.patch || skin.fur};--inner:${skin.belly};--acc:${skin.accColor || '#ef4444'};`;
  return `
<svg class="cat-svg p-${pattern} a-${acc}" viewBox="0 0 220 250" style="${style}" xmlns="http://www.w3.org/2000/svg">
  <!-- tail -->
  <path d="M52 205 C8 208 -2 150 26 124 C14 158 30 188 60 190 Z" fill="var(--fur)"/>
  <!-- body -->
  <ellipse cx="100" cy="182" rx="60" ry="50" fill="var(--fur)"/>
  <ellipse cx="100" cy="196" rx="38" ry="36" fill="var(--belly)"/>

  <!-- body patterns -->
  <g class="pat pat-stripes" stroke="var(--patch)" stroke-width="7" stroke-linecap="round" fill="none" opacity=".85">
    <path d="M58 162 q16 10 8 28"/><path d="M82 156 q16 12 8 32"/>
    <path d="M108 156 q16 12 8 32"/><path d="M134 162 q14 10 6 26"/>
  </g>
  <g class="pat pat-tuxedo" fill="var(--patch)">
    <path d="M112 150 q-32 6 -32 42 q0 26 32 28 q32 -2 32 -28 q0 -36 -32 -42 z"/>
  </g>
  <g class="pat pat-calico">
    <path d="M46 176 q22 -22 48 -6 q-8 34 -48 34 z" fill="var(--patch)" opacity=".95"/>
    <ellipse cx="150" cy="196" rx="26" ry="22" fill="var(--belly)"/>
    <ellipse cx="118" cy="214" rx="16" ry="12" fill="var(--patch)" opacity=".8"/>
  </g>
  <g class="pat pat-stars" fill="var(--patch)">
    <path d="M70 168 l4 9 10 1 -7 7 2 10 -9 -5 -9 5 2 -10 -7 -7 10 -1 z"/>
    <path d="M132 190 l3 7 8 1 -6 5 2 8 -7 -4 -7 4 2 -8 -6 -5 8 -1 z"/>
  </g>
  <g class="pat pat-spots" fill="var(--patch)" opacity=".9">
    <ellipse cx="68"  cy="172" rx="16" ry="14"/>
    <ellipse cx="120" cy="204" rx="13" ry="11"/>
    <ellipse cx="150" cy="180" rx="11" ry="9"/>
  </g>
  <g class="pat pat-heart" fill="var(--patch)" opacity=".95">
    <path d="M112 166 c-15 -13 -30 -4 -30 10 c0 13 17 21 30 30 c13 -9 30 -17 30 -30 c0 -14 -15 -23 -30 -10 z"/>
  </g>

  <!-- paws -->
  <ellipse cx="70"  cy="220" rx="21" ry="14" fill="var(--fur)"/>
  <ellipse cx="130" cy="220" rx="21" ry="14" fill="var(--fur)"/>
  <ellipse cx="70"  cy="223" rx="12" ry="8" fill="var(--belly)"/>
  <ellipse cx="130" cy="223" rx="12" ry="8" fill="var(--belly)"/>
  <g class="pat pat-points" fill="var(--patch)" opacity=".85">
    <ellipse cx="70" cy="220" rx="21" ry="12"/><ellipse cx="130" cy="220" rx="21" ry="12"/>
  </g>
  <g class="pat pat-socks" fill="var(--belly)">
    <ellipse cx="70"  cy="221" rx="18" ry="12"/>
    <ellipse cx="130" cy="221" rx="18" ry="12"/>
    <path d="M112 150 q-24 6 -24 38 q0 20 24 22 q24 -2 24 -22 q0 -32 -24 -38 z"/>
  </g>

  <!-- head -->
  <circle cx="112" cy="96" r="54" fill="var(--fur)"/>
  <!-- ears -->
  <path d="M72 60 L56 8 L106 44 Z" fill="var(--fur)"/>
  <path d="M152 60 L168 8 L118 44 Z" fill="var(--fur)"/>
  <path d="M76 54 L66 22 L100 46 Z" fill="var(--inner)"/>
  <path d="M148 54 L158 22 L124 46 Z" fill="var(--inner)"/>
  <g class="pat pat-points" fill="var(--patch)">
    <path d="M70 60 L56 8 L88 38 Z" opacity=".9"/>
    <path d="M154 60 L168 8 L136 38 Z" opacity=".9"/>
    <ellipse cx="112" cy="86" rx="36" ry="30"/>
  </g>
  <g class="pat pat-spots" fill="var(--patch)" opacity=".9">
    <ellipse cx="142" cy="70" rx="14" ry="12"/>
    <ellipse cx="68"  cy="110" rx="9" ry="7"/>
  </g>

  <!-- muzzle -->
  <ellipse cx="112" cy="120" rx="32" ry="22" fill="var(--belly)"/>
  <path d="M103 108 h18 l-9 10 z" fill="#ff8fa3"/>
  <path class="mouth-closed" d="M112 120 q-10 11 -19 2 M112 120 q10 11 19 2"
        stroke="#5b3b2e" stroke-width="3.2" fill="none" stroke-linecap="round"/>
  <ellipse class="mouth-open" cx="112" cy="131" rx="14" ry="11" fill="#7f2b3b"/>
  <ellipse class="mouth-open" cx="112" cy="135" rx="7" ry="5" fill="#ff8fa3"/>

  <!-- eyes -->
  <ellipse cx="90"  cy="88" rx="13" ry="15.5" fill="#fff"/>
  <ellipse cx="134" cy="88" rx="13" ry="15.5" fill="#fff"/>
  <circle cx="92"  cy="90" r="7.6" fill="var(--eye)"/>
  <circle cx="136" cy="90" r="7.6" fill="var(--eye)"/>
  <circle cx="89"  cy="86" r="2.6" fill="#fff"/>
  <circle cx="133" cy="86" r="2.6" fill="#fff"/>
  <g class="brow" stroke="#3f2a20" stroke-width="5" stroke-linecap="round">
    <path d="M78 72 L104 80"/><path d="M146 72 L120 80"/>
  </g>

  <!-- whiskers -->
  <g stroke="rgba(255,255,255,.7)" stroke-width="2.2" stroke-linecap="round">
    <path d="M82 116 L38 106"/><path d="M82 124 L38 126"/>
    <path d="M142 116 L186 106"/><path d="M142 124 L186 126"/>
  </g>

  <!-- accessories -->
  <g class="acc acc-bandana">
    <path d="M60 150 q52 22 104 0 l0 11 q-52 22 -104 0 z" fill="var(--acc)"/>
    <path d="M142 160 l24 28 l-32 -11 z" fill="var(--acc)"/>
  </g>
  <g class="acc acc-hat">
    <path d="M112 -6 L72 46 L152 46 Z" fill="var(--acc)"/>
    <ellipse cx="112" cy="48" rx="58" ry="11" fill="var(--acc)"/>
    <circle cx="96" cy="26" r="3.4" fill="#fde047"/>
    <circle cx="120" cy="36" r="2.6" fill="#fde047"/>
    <circle cx="106" cy="14" r="2.4" fill="#fde047"/>
  </g>
  <g class="acc acc-crown">
    <path d="M68 44 L78 10 L94 32 L112 4 L130 32 L146 10 L156 44 Z"
          fill="var(--acc)" stroke="#b45309" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="112" cy="20" r="3.4" fill="#ef4444"/>
    <circle cx="86" cy="30" r="2.6" fill="#38bdf8"/>
    <circle cx="138" cy="30" r="2.6" fill="#38bdf8"/>
  </g>
  <g class="acc acc-scarf">
    <path d="M60 146 q52 22 104 0 l0 15 q-52 22 -104 0 z" fill="var(--acc)"/>
    <path d="M136 158 l14 40 l-30 -10 z" fill="var(--acc)"/>
    <path d="M64 153 q48 20 96 0" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none"/>
  </g>
  <g class="acc acc-bow" fill="var(--acc)">
    <path d="M112 150 l-30 -14 v28 z"/>
    <path d="M112 150 l30 -14 v28 z"/>
    <circle cx="112" cy="150" r="7"/>
  </g>
  <g class="acc acc-shades">
    <rect x="72"  y="79" width="34" height="19" rx="6" fill="var(--acc)"/>
    <rect x="118" y="79" width="34" height="19" rx="6" fill="var(--acc)"/>
    <path d="M106 88 h12" stroke="var(--acc)" stroke-width="4"/>
    <path d="M72 86 h-14 M152 86 h14" stroke="var(--acc)" stroke-width="4"/>
  </g>
  <g class="acc acc-halo">
    <ellipse cx="112" cy="16" rx="40" ry="11" fill="none" stroke="var(--acc)" stroke-width="6"/>
    <ellipse cx="112" cy="16" rx="40" ry="11" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
  </g>
  <g class="acc acc-pirate">
    <path d="M112 0 q34 20 46 44 q-46 -16 -92 0 q12 -24 46 -44 z" fill="var(--acc)"/>
    <path d="M62 46 q50 16 100 0 q-8 14 -50 14 q-42 0 -50 -14 z" fill="var(--acc)"/>
    <path d="M74 80 h30 a15 15 0 0 1 -30 0 z" fill="#111827"/>
    <path d="M74 80 q-18 -8 -24 -24" stroke="#111827" stroke-width="3" fill="none"/>
  </g>
</svg>`;
}

function mountCat(host, skin){
  host.innerHTML = `<div class="cat-inner">${buildCatSVG(skin)}<div class="waves"><span></span><span></span><span></span></div></div>`;
}

/* ---------------- screens ---------------- */
const SCREENS = ['menu','levels','shop','achievements','settings','mic','calibrate','battle','result'];
function show(name){
  SCREENS.forEach(s => $('#screen-' + s).classList.toggle('active', s === name));
}

let toastTimer = null;
function toast(msg){
  const t = $('#toast');
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1900);
}

/* ---------------- shop ---------------- */
function renderShop(){
  $('#shop-coins').textContent = save.coins;
  const grid = $('#shop-grid');
  grid.innerHTML = '';
  SKINS.forEach(skin => {
    const owned = save.owned.includes(skin.id);
    const equipped = save.equipped === skin.id;
    const card = document.createElement('div');
    card.className = 'shop-card' + (equipped ? ' equipped' : '') + (owned ? '' : ' locked');
    let action;
    if(equipped)      action = `<button disabled>${icon('check')}Equipped</button>`;
    else if(owned)    action = `<button class="equip" data-act="equip" data-id="${skin.id}">Equip</button>`;
    else              action = `<button class="buy" data-act="buy" data-id="${skin.id}">Buy ${icon('coin')}${skin.price}</button>`;
    card.innerHTML = `
      <div class="preview">${buildCatSVG(skin)}</div>
      <div class="shop-name">${skin.name}</div>
      ${equipped ? '<div class="badge">IN USE</div>'
                 : owned ? '<div class="shop-price">Owned</div>'
                         : `<div class="shop-price">${icon('coin')}${skin.price}</div>`}
      ${action}`;
    grid.appendChild(card);
  });
}
$('#shop-grid').addEventListener('click', e => {
  const btn = e.target.closest('button[data-act]');
  if(!btn) return;
  const skin = skinById(btn.dataset.id);
  if(btn.dataset.act === 'buy'){
    if(save.coins < skin.price){ SFX.deny(); toast('Not enough coins ' + icon('sad')); return; }
    save.coins -= skin.price;
    save.owned.push(skin.id);
    save.equipped = skin.id;
    SFX.buy(); toast(`${skin.name} unlocked! ` + icon('sparkle'));
  } else if(btn.dataset.act === 'equip'){
    save.equipped = skin.id;
    SFX.click(); toast(`${skin.name} equipped`);
  }
  persist();
  renderShop();
  refreshHeroes();
});

/* ---------------- achievements ---------------- */
function renderAchievements(){
  const grid = $('#achievements-grid');
  if(!grid) return;
  grid.innerHTML = '';
  if(!save.achievements) save.achievements = {};
  ACHIEVEMENTS.forEach(a => {
    const unlocked = !!save.achievements[a.id];
    const item = document.createElement('div');
    item.className = 'ach-item' + (unlocked ? ' unlocked' : ' locked');
    const date = unlocked ? new Date(save.achievements[a.id]).toLocaleDateString() : '';
    item.innerHTML = `<div class="ach-icon">${icon(a.icon)}</div>` +
      `<div class="ach-text"><div class="ach-name">${a.name}</div>` +
      `<div class="ach-desc">${a.desc}</div></div>` +
      (unlocked ? `<div class="ach-unlocked">Unlocked</div>` : `<div class="ach-unlocked" style="color:var(--muted)">Locked</div>`);
    grid.appendChild(item);
  });
}

/* ---------------- level select ---------------- */
function renderLevels(){
  $('#levels-coins').textContent = save.coins;
  const grid = $('#level-grid');
  grid.innerHTML = '';
  const progress = save.bestLevel;   // next level to beat (LEVELS.length+1 = all cleared)
  LEVELS.forEach((L, i) => {
    const lv = i + 1;
    const unlocked = lv <= progress;
    const cleared  = lv < progress;
    const card = document.createElement('button');
    card.className = 'level-card' + (unlocked ? '' : ' locked') +
                     (cleared ? ' cleared' : '') + (lv === LEVELS.length ? ' boss' : '');
    card.disabled = !unlocked;
    if(unlocked) card.dataset.level = lv;
    card.innerHTML = `
      <div class="level-no">${lv}</div>
      <div class="level-preview">${buildCatSVG(skinById(L.skin))}</div>
      <div class="level-name">${L.name}</div>
      <div class="level-state">${cleared ? icon('check') : unlocked ? icon('play') : icon('lock')}</div>`;
    grid.appendChild(card);
  });
}
$('#level-grid').addEventListener('click', e => {
  const card = e.target.closest('.level-card[data-level]');
  if(!card) return;
  SFX.click();
  pendingLevel = +card.dataset.level;
  pendingEndless = null;
  show('mic');
});

/* ---------------- heroes on menu ---------------- */
function refreshHeroes(){
  mountCat($('#hero-player'), skinById(save.equipped));
  mountCat($('#hero-enemy'),  skinById(LEVELS[Math.min(save.bestLevel, LEVELS.length) - 1].skin));
  $('#menu-coins').querySelector('span').textContent = save.coins;
  $('#menu-progress').innerHTML = save.bestLevel > LEVELS.length
    ? 'You beat the game! ' + icon('crown')
    : `Level ${save.bestLevel} / ${LEVELS.length} · ${icon('coin')} ${save.coins}` + (save.bestCombo > 1 ? ` · best ${save.bestCombo}×` : '');
  const eb = $('#btn-endless');
  if(eb) eb.hidden = !(save.bestLevel > LEVELS.length);
}

/* ---------------- game state ---------------- */
const G = {
  level:1, running:false, paused:false,
  playerHP:PLAYER_MAX, enemyHP:0, enemyMax:0,
  meter:0, special:0, specialReady:false,
  myLevel:0, enemyLevelVal:0, t:0, lastT:0,
  shake:0, lastMeow:0, lastGrowl:0,
  scared:false, lastWhimper:0, combo:0,
  keyboardMode:false, result:'',
  L:null, endless:false, wave:0,
};
const Keys = { shout:false };

/* set when the player picks a specific level from the level-select screen */
let pendingLevel = null;
let pendingEndless = null;   // wave to start endless mode at
function nextStartLevel(){ return pendingLevel != null ? pendingLevel : (save.bestLevel > LEVELS.length ? 1 : save.bestLevel); }
/* route the mic / keyboard setup to either a normal level or an endless wave */
function startResolved(){
  if(pendingEndless != null){ const w = pendingEndless; pendingEndless = null; startEndless(w); return; }
  startBattle(nextStartLevel());
}

function sensitivityVal(){ return save.sensitivity / 100; }

/* raw player loudness 0..1 */
function readPlayerRaw(dt){
  if(Keys.shout) return 1;          // SPACE (quiet mode) or the on-screen SHOUT button
  if(G.keyboardMode) return 0;      // quiet mode: only the key/button roars
  const rms = Mic.readRms();
  const floor = Math.max(Mic.noiseFloor, 0.004);
  const sens = sensitivityVal();
  const ceiling = lerp(0.34, 0.05, sens);          // higher sensitivity => lower ceiling
  let l = (rms - floor) / Math.max(0.02, ceiling - floor);
  l = clamp(l, 0, 1);
  return Math.pow(l, 0.75);
}

function enemyRaw(t, L){
  const wave    = 0.84 + 0.16 * Math.sin(t * 1.4 + L.phase);
  const flutter = 0.90 + 0.20 * Math.sin(t * 5.1 + L.phase * 2);
  const roar    = Math.sin(t * 0.7 + L.phase) > 0.92 ? 1.28 : 1;
  return clamp(L.push * diff().push * wave * flutter * roar, 0, 1.3);
}

/* ---------------- battle ---------------- */
function startBattle(level, opts){
  opts = opts || {};
  const L = opts.level || LEVELS[level - 1];
  G.level = level;
  G.L = L;
  G.endless = !!opts.endless;
  G.wave = opts.wave || 0;
  pendingLevel = null;
  pendingEndless = null;
  G.playerHP = PLAYER_MAX;
  G.enemyMax = L.hits * HP_PER_HIT;
  G.enemyHP = G.enemyMax;
  G.meter = 0; G.special = 0; G.specialReady = false;
  G.myLevel = 0; G.enemyLevelVal = 0; G.t = 0; G.shake = 0;
  G.lastMeow = -1; G.lastGrowl = -1;   // reset voice throttles so every fight makes sound
  G.scared = false; G.lastWhimper = 0;
  G.combo = 0;
  G.paused = false; G.running = true;
  G.result = '';

  mountCat($('#p-cat'), skinById(save.equipped));
  mountCat($('#e-cat'), skinById(L.skin));
  Meows.preload(L.snd);   // have the enemy's voice ready before the first shout
  Meows.preload(playerVoice().src);   // …and yours
  $('#p-name').textContent = 'You';
  $('#e-name').innerHTML = (G.endless ? icon('sparkle') + ' '
                          : level === LEVELS.length ? icon('crown') + ' ' : '') + L.name;
  $('#lvl-pill').textContent = G.endless ? 'WAVE ' + G.wave : 'LV ' + level + ' / ' + LEVELS.length;
  $('#pause-overlay').classList.remove('show');
  updateHP();
  show('battle');
  /* VS intro card, then the fight begins */
  const vi = $('#vs-intro');
  if(vi){
    $('#vi-e').textContent = L.name;
    vi.classList.remove('run'); void vi.offsetWidth; vi.classList.add('run');
  }
  const introMs = REDUCE ? 0 : 900;
  setTimeout(() => {
    if(!G.running) return;
    if(vi) vi.classList.remove('run');
    G.lastT = performance.now();
    requestAnimationFrame(loop);
  }, introMs);
  /* intro taunt — the rival roars once as the fight begins */
  setTimeout(() => { if(G.running && !G.paused) Meows.play(L.snd, { rate:L.rate, vol:0.9, vary:false }); }, introMs + 450);
}

function startEndless(wave){
  startBattle(wave, { level: makeEndlessLevel(wave), endless:true, wave });
}

function updateHP(){
  const p = clamp(G.playerHP / PLAYER_MAX, 0, 1) * 100;
  const e = clamp(G.enemyHP / G.enemyMax, 0, 1) * 100;
  $('#p-hp').style.width = p + '%';
  $('#e-hp').style.width = e + '%';
  $('#p-hptext').textContent = Math.max(0, Math.round(G.playerHP)) + ' / ' + PLAYER_MAX;
  $('#e-hptext').textContent = Math.max(0, Math.round(G.enemyHP)) + ' / ' + G.enemyMax;
}

function setShout(side, on){
  const el = $(side === 'player' ? '#p-cat' : '#e-cat');
  el.classList.toggle('shouting', on);
}
function flash(side, cls, ms){
  const el = $(side === 'player' ? '#p-cat' : '#e-cat');
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}

function spawnFx(side, text, color){
  const layer = $('#fx-layer');
  const target = $(side === 'player' ? '#p-cat' : '#e-cat');
  const lr = layer.getBoundingClientRect();
  const tr = target.getBoundingClientRect();
  const x = tr.left - lr.left + tr.width / 2;
  const y = tr.top  - lr.top  + tr.height * 0.35;

  const pop = document.createElement('div');
  pop.className = 'pop';
  pop.textContent = text;
  pop.style.color = color;
  pop.style.left = x + 'px';
  pop.style.top  = y + 'px';
  pop.style.transform = 'translate(-50%,0)';
  layer.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);

  for(let i = 0; i < 12; i++){
    const s = document.createElement('div');
    s.className = 'spark';
    s.style.left = x + 'px';
    s.style.top  = y + 'px';
    s.style.background = color;
    s.style.setProperty('--dx', rand(-90, 90).toFixed(0) + 'px');
    s.style.setProperty('--dy', rand(-110, 40).toFixed(0) + 'px');
    s.style.animation = 'spark .7s ease-out forwards';
    layer.appendChild(s);
    setTimeout(() => s.remove(), 720);
  }
}

function landHit(byPlayer){
  const L = G.L;
  if(byPlayer){
    const dmg = 14 + Math.round(G.myLevel * 10);
    G.enemyHP -= dmg;
    G.combo++;
    G.meter = 0;
    G.shake = 12;
    flash('player', 'attacking', 400);
    flash('enemy', 'hurt', 360);
    spawnFx('enemy', '-' + dmg, '#ffffff');
    SFX.hit();
  } else {
    const dmg = Math.round(L.dmg * diff().dmg);
    G.playerHP -= dmg;
    G.combo = 0;
    G.meter = 0;
    G.shake = 14;
    flash('enemy', 'attacking', 400);
    flash('player', 'hurt', 360);
    spawnFx('player', '-' + dmg, '#c9c9c9');
    Meows.play(L.snd, { rate:L.rate, vol:0.7 });   // the enemy's own attack cry
    SFX.hiss();
  }
  updateHP();
  if(G.enemyHP <= 0) return endBattle(true);
  if(G.playerHP <= 0) return endBattle(false);
}

function useSpecial(){
  if(!G.specialReady || !G.running || G.paused) return;
  G.special = 0; G.specialReady = false;
  const L = G.L;
  const dmg = 40 + Math.round(G.enemyMax * 0.08);
  G.enemyHP -= dmg;
  G.meter = Math.min(100, G.meter + 34);
  G.shake = 22;
  flash('player', 'attacking', 460);
  flash('enemy', 'hurt', 460);
  spawnFx('enemy', 'MEGA! -' + dmg, '#ffffff');
  playerMeow({ vol:1.15, vary:false });   // the mega cry — your cat's real voice
  SFX.special();
  updateHP();
  if(G.enemyHP <= 0) endBattle(true);
}

function loop(ts){
  if(!G.running) return;
  const dt = Math.min(0.05, (ts - G.lastT) / 1000 || 0);
  G.lastT = ts;
  if(!G.paused){
    G.t += dt;
    updateBattle(dt);
  }
  requestAnimationFrame(loop);
}

function updateBattle(dt){
  const L = G.L;

  // loudness (attack fast, release slower)
  const target = readPlayerRaw(dt);
  G.myLevel += (target - G.myLevel) * (target > G.myLevel ? 0.55 : 0.16);
  G.myLevel = clamp(G.myLevel, 0, 1);

  // enemy nerves: when nearly beaten they weaken and panic
  G.scared = G.enemyHP / G.enemyMax <= 0.3;
  G.enemyLevelVal = enemyRaw(G.t, L) * (G.scared ? 0.72 : 1);

  // clash meter
  const net = G.myLevel * PLAYER_POWER - G.enemyLevelVal;
  G.meter = clamp(G.meter + net * METER_RATE * dt, -100, 100);
  if(G.meter >= 100) landHit(true);
  else if(G.meter <= -100) landHit(false);

  // special charge
  if(!G.specialReady){
    G.special = clamp(G.special + G.myLevel * SPECIAL_GAIN * dt, 0, 100);
    if(G.special >= 100){ G.specialReady = true; SFX.buy(); toast('MEGA MEOW ready! Press F'); }
  }

  // thrills
  if(Math.random() < G.myLevel * dt * 3) G.shake = Math.max(G.shake, 4);

  // sfx throttled
  if(G.myLevel > 0.35 && G.t - G.lastMeow > 0.9){ G.lastMeow = G.t; playerMeow(); }
  // enemy voice gate scales with their strength, so even weak early cats keep vocalizing
  const voiceGate = Math.min(0.35, L.push * 0.6);
  if(G.scared){
    // frightened: quieter, higher whimpers instead of the usual shout
    if(G.t - G.lastWhimper > 2.0 && Math.random() < 0.5){
      G.lastWhimper = G.t;
      Meows.play(L.snd, { rate:(L.rate || 1) * 1.35, vol:0.6, vary:false });
    }
  } else if(G.enemyLevelVal > voiceGate && G.t - G.lastGrowl > 1.1){
    G.lastGrowl = G.t; Meows.play(L.snd, { rate:L.rate });
  }

  render();
}

function render(){
  // cats shouting
  setShout('player', G.myLevel > 0.18);
  setShout('enemy', G.enemyLevelVal > 0.18);

  // mic bar
  $('#mic-fill').style.width = (G.myLevel * 100).toFixed(1) + '%';

  // special bar
  $('#special-fill').style.width = G.special.toFixed(0) + '%';
  const st = $('#special-text'), sb = $('#btn-special');
  if(G.specialReady){ st.innerHTML = 'READY!'; sb.classList.add('ready'); sb.disabled = false; }
  else { st.textContent = 'CHARGING…'; sb.classList.remove('ready'); sb.disabled = true; }

  // clash meter
  const m = G.meter;
  const fill = $('#clash-fill'), marker = $('#clash-marker'), label = $('#clash-label');
  if(m >= 0){
    fill.style.left = '50%';
    fill.style.width = (m / 2) + '%';
    fill.classList.remove('bad');
  } else {
    fill.style.left = (50 + m / 2) + '%';
    fill.style.width = (-m / 2) + '%';
    fill.classList.add('bad');
  }
  marker.style.left = (50 + m / 2) + '%';
  if(m < -55){ label.textContent = 'DANGER! SHOUT!'; label.className = 'clash-label bad'; }
  else if(G.scared){ label.textContent = "THEY'RE WEAKENING!"; label.className = 'clash-label hot'; }
  else if(m > 55){ label.textContent = 'PUSH! HIT THEM!'; label.className = 'clash-label hot'; }
  else { label.textContent = 'PUSH!'; label.className = 'clash-label'; }

  // enemy looks rattled when nearly beaten
  $('#e-cat').classList.toggle('scared', G.scared);

  // combo badge
  const cb = $('#combo-badge');
  if(G.combo > 1){
    if(cb.textContent !== G.combo + '× COMBO'){
      cb.textContent = G.combo + '× COMBO';
      cb.classList.remove('bump'); void cb.offsetWidth; cb.classList.add('bump');
    }
    cb.classList.add('show');
  } else cb.classList.remove('show');

  // screen shake
  const arena = $('.arena');
  if(G.shake > 0.3){
    arena.style.transform = `translate(${rand(-G.shake, G.shake)}px, ${rand(-G.shake, G.shake)}px)`;
    G.shake *= 0.86;
  } else if(arena.style.transform){
    arena.style.transform = '';
  }
}

/* ---------------- end of battle ---------------- */
function endBattle(won){
  if(!G.running) return;
  G.running = false;
  setShout('player', false);
  setShout('enemy', false);
  $('.arena').style.transform = '';

  const L = G.L;
  let coins = 0;
  if(won){
    const hpKeep = Math.round((G.playerHP / PLAYER_MAX) * 50);
    const flawless = G.playerHP >= PLAYER_MAX ? 50 : 0;
    const comboBonus = Math.max(0, G.combo - 1) * 3;   // +3 coins per hit beyond the first
    coins = (G.endless ? 20 + G.wave * 4 : 25 + G.level * 5) + hpKeep + flawless + comboBonus;
    save.coins += coins;
    if(!save.stats) save.stats = {fightsWon:0, fightsLost:0, totalCoinsEarned:0};
    save.stats.fightsWon++;
    save.stats.totalCoinsEarned += coins;
    if(G.combo > save.bestCombo) save.bestCombo = G.combo;
    if(G.endless){
      if(G.wave > (save.endlessBest || 0)) save.endlessBest = G.wave;
    } else if(G.level + 1 > save.bestLevel){
      save.bestLevel = Math.min(LEVELS.length + 1, G.level + 1);
    }
    checkAchievements(true, { playerHP: G.playerHP });
    persist();
    if(!G.endless && G.level < LEVELS.length) Meows.preload(LEVELS[G.level].snd);   // warm the next rival's voice
    SFX.win();
    // the beaten rival whimpers as it goes down
    setTimeout(() => Meows.play(L.snd, { rate:(L.rate || 1) * 1.28, vol:0.7, vary:false }), 380);
  } else {
    coins = 5;
    save.coins += coins;
    if(!save.stats) save.stats = {fightsWon:0, fightsLost:0, totalCoinsEarned:0};
    save.stats.fightsLost++;
    save.stats.totalCoinsEarned += coins;
    persist();
    SFX.lose();
    // the rival's triumphant meow
    setTimeout(() => Meows.play(L.snd, { rate:(L.rate || 1) * 0.95, vol:0.9, vary:false }), 380);
  }

  const last = !G.endless && G.level >= LEVELS.length;
  const rIcon = $('#result-icon'), title = $('#result-title'), text = $('#result-text'),
        rc = $('#result-coins'), next = $('#btn-next'), retry = $('#btn-retry');

  rc.innerHTML = icon('coin') + '+' + coins;
  if(G.endless && won){
    rIcon.className = 'panel-icon accent-amber'; rIcon.innerHTML = icon('sparkle');
    title.textContent = 'Wave ' + G.wave + ' cleared!';
    text.textContent = `You silenced ${L.name}.` + (G.combo > 1 ? ` Best combo: ${G.combo}×.` : '') +
                       ` Best wave: ${save.endlessBest || 0}.`;
    next.hidden = false; retry.hidden = true;
    next.innerHTML = icon('play') + 'Wave ' + (G.wave + 1);
  } else if(G.endless){
    rIcon.className = 'panel-icon accent-pink'; rIcon.innerHTML = icon('sad');
    title.textContent = 'You fell on wave ' + G.wave + '!';
    text.textContent = `${L.name} was louder. Best wave: ${save.endlessBest || 0}.`;
    next.hidden = true; retry.hidden = false;
  } else if(won && last){
    rIcon.className = 'panel-icon accent-amber'; rIcon.innerHTML = icon('crown');
    title.textContent = 'YOU BEAT THE GAME!';
    text.textContent = `You dethroned ${LEVELS[LEVELS.length - 1].name}. All ${LEVELS.length} levels conquered!`;
    next.hidden = true; retry.hidden = true;
  } else if(won){
    rIcon.className = 'panel-icon accent-amber'; rIcon.innerHTML = icon('trophy');
    title.textContent = 'Level ' + G.level + ' cleared!';
    text.textContent = `You beat ${L.name}.` + (G.combo > 1 ? ` Best combo: ${G.combo}×` : '');
    next.hidden = false; retry.hidden = true;
    next.innerHTML = icon('play') + 'Level ' + (G.level + 1);
  } else {
    rIcon.className = 'panel-icon accent-pink'; rIcon.innerHTML = icon('sad');
    title.textContent = 'You lost!';
    text.textContent = `${L.name} was louder. Shout harder!`;
    next.hidden = true; retry.hidden = false;
  }
  show('result');
}

/* ---------------- calibration ---------------- */
let calibTimer = null;
function startCalibration(){
  show('calibrate');
  Music.hold(true);   // go quiet while we measure the room
  let samples = [], count = 3, elapsed = 0;
  const countEl = $('#calib-count');
  const total = 3.2;
  countEl.textContent = '3';
  clearInterval(calibTimer);
  calibTimer = setInterval(() => {
    elapsed += 0.08;
    if(Mic.ready) samples.push(Mic.readRms());
    const pct = clamp(elapsed / total, 0, 1) * 100;
    $('.calib-ring').style.setProperty('--p', pct.toFixed(0) + '%');
    const c = Math.max(1, Math.ceil(3 - elapsed));
    countEl.textContent = c;
    if(elapsed >= total){
      clearInterval(calibTimer);
      const avg = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0.006;
      Mic.noiseFloor = clamp(avg * 1.8, 0.003, 0.05);
      Music.hold(false);
      startResolved();
    }
  }, 80);
}

/* ---------------- event wiring ---------------- */
function bind(){
  /* menu */
  $('#btn-play').addEventListener('click', () => { SFX.click(); pendingLevel = null; pendingEndless = null; getAudioCtx(); show('mic'); });
  $('#btn-levels').addEventListener('click', () => { SFX.click(); renderLevels(); show('levels'); });
  $('#btn-achievements').addEventListener('click', () => { SFX.click(); renderAchievements(); show('achievements'); });
  $('#btn-endless').addEventListener('click', () => { SFX.click(); pendingLevel = null; pendingEndless = 1; show('mic'); });
  $('#btn-shop').addEventListener('click', () => { SFX.click(); renderShop(); show('shop'); });
  $('#btn-reset').addEventListener('click', () => {
    if(confirm('Reset coins, skins and progress?')){
      save = Object.assign({}, DEFAULT_SAVE, { owned:['shadow'], equipped:'shadow' });
      persist();
      // re-sync everything that mirrors save state
      SFX.muted = save.muted;
      applyTheme();
      updateSettingsUI();
      document.querySelectorAll('#menu-mute, #battle-mute').forEach(b => b.innerHTML = icon(save.muted ? 'mute' : 'sound'));
      $('#sensitivity').value = save.sensitivity;
      refreshHeroes();
      SFX.deny(); toast('Progress reset');
    }
  });
  $('#menu-mute').addEventListener('click', toggleMute);
  $('#menu-theme').addEventListener('click', toggleTheme);
  $('#shop-theme').addEventListener('click', toggleTheme);

  /* settings */
  $('#menu-settings').addEventListener('click', () => { SFX.click(); updateSettingsUI(); show('settings'); });
  $('#settings-back').addEventListener('click', () => { SFX.click(); refreshHeroes(); show('menu'); });
  $('#settings-mute').addEventListener('click', () => { toggleMute(); updateSettingsUI(); });
  $('#vol-cat').addEventListener('input', e => {
    save.volCat = +e.target.value / 100; persist();
    $('#vol-cat-val').textContent = e.target.value + '%';
  });
  $('#vol-fx').addEventListener('input', e => {
    save.volFx = +e.target.value / 100; persist();
    $('#vol-fx-val').textContent = e.target.value + '%';
  });
  $('#vol-fx').addEventListener('change', () => SFX.click());   // little preview of the new level
  $('#seg-difficulty').addEventListener('click', e => {
    const b = e.target.closest('button[data-diff]');
    if(!b) return;
    save.difficulty = b.dataset.diff; persist();
    updateSettingsUI(); SFX.click();
  });

  /* music: volume slider + start on the first user gesture (autoplay policy) */
  $('#vol-music').addEventListener('input', e => {
    save.volMusic = +e.target.value / 100; persist();
    $('#vol-music-val').textContent = e.target.value + '%';
    Music.apply();
  });
  const startMusic = () => Music.start();
  window.addEventListener('pointerdown', startMusic, { once:true });
  window.addEventListener('keydown', startMusic, { once:true });

  /* shop */
  $('#shop-back').addEventListener('click', () => { SFX.click(); refreshHeroes(); show('menu'); });
  $('#levels-back').addEventListener('click', () => { SFX.click(); refreshHeroes(); show('menu'); });
  $('#achievements-back').addEventListener('click', () => { SFX.click(); refreshHeroes(); show('menu'); });

  /* mic setup */
  $('#mic-back').addEventListener('click', () => { SFX.click(); pendingLevel = null; show('menu'); });
  $('#btn-enable-mic').addEventListener('click', async () => {
    const msg = $('#mic-msg');
    msg.className = 'panel-msg';
    msg.textContent = 'Requesting permission…';
    getAudioCtx();
    try{
      await Mic.enable();
      G.keyboardMode = false;
      msg.className = 'panel-msg ok';
      msg.textContent = 'Microphone ready!';
      startCalibration();
    }catch(err){
      console.error(err);
      msg.className = 'panel-msg err';
      msg.textContent = 'Could not access the microphone. Open the game at http://localhost and allow access.';
    }
  });
  $('#btn-use-keyboard').addEventListener('click', () => {
    SFX.click();
    G.keyboardMode = true;
    toast('Quiet mode: hold SPACE to roar');
    startResolved();
  });

  /* battle controls */
  $('#sensitivity').value = save.sensitivity;
  $('#sensitivity').addEventListener('input', e => {
    save.sensitivity = +e.target.value; persist();
  });
  $('#battle-mute').addEventListener('click', toggleMute);
  $('#btn-special').addEventListener('click', useSpecial);
  $('#btn-pause').addEventListener('click', pauseGame);
  $('#btn-resume').addEventListener('click', pauseGame);

  /* on-screen SHOUT button (touch devices) — hold to roar */
  const shoutBtn = $('#btn-shout');
  const startShout = e => { e.preventDefault(); Keys.shout = true; shoutBtn.classList.add('held'); getAudioCtx(); };
  const endShout = () => { Keys.shout = false; shoutBtn.classList.remove('held'); };
  shoutBtn.addEventListener('pointerdown', startShout);
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => shoutBtn.addEventListener(ev, endShout));
  $('#btn-quit').addEventListener('click', () => {
    G.running = false; G.paused = false; Keys.shout = false;
    $('#pause-overlay').classList.remove('show');
    Mic.stop();   // release the microphone for privacy
    refreshHeroes(); show('menu');
  });

  /* result */
  $('#btn-next').addEventListener('click', () => {
    SFX.click();
    if(G.endless) startEndless(G.wave + 1);
    else startBattle(Math.min(LEVELS.length, G.level + 1));
  });
  $('#btn-retry').addEventListener('click', () => {
    SFX.click();
    if(G.endless) startEndless(G.wave);
    else startBattle(G.level);
  });
  $('#btn-menu').addEventListener('click', () => { SFX.click(); Mic.stop(); refreshHeroes(); show('menu'); });

  /* keyboard */
  window.addEventListener('keydown', e => {
    const inBattle = $('#screen-battle').classList.contains('active');
    const tag = (document.activeElement || {}).tagName;
    if(e.code === 'Space'){
      if(tag !== 'INPUT' && tag !== 'TEXTAREA') e.preventDefault();   // no page scroll / stray button re-click
      if(inBattle) Keys.shout = true;
    }
    if((e.key === 'f' || e.key === 'F') && inBattle) useSpecial();
    if((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && inBattle) pauseGame();
    if(e.key === 'm' || e.key === 'M') toggleMute();
    if(e.key === 't' || e.key === 'T') toggleTheme();
  });
  window.addEventListener('keyup', e => {
    if(e.code === 'Space') Keys.shout = false;
  });

  window.addEventListener('beforeunload', () => persist());
}

function pauseGame(){
  if(!$('#screen-battle').classList.contains('active')) return;
  G.paused = !G.paused;
  $('#pause-overlay').classList.toggle('show', G.paused);
  SFX.click();
}

function toggleMute(){
  save.muted = !save.muted;
  SFX.muted = save.muted;
  persist();
  document.querySelectorAll('#menu-mute, #battle-mute').forEach(b => b.innerHTML = icon(save.muted ? 'mute' : 'sound'));
  if(typeof updateSettingsUI === 'function') updateSettingsUI();
  Music.apply();
  if(!save.muted) SFX.click();
}

function updateSettingsUI(){
  const cat = Math.round(save.volCat * 100), fx = Math.round(save.volFx * 100), mus = Math.round(save.volMusic * 100);
  $('#vol-cat').value = cat; $('#vol-cat-val').textContent = cat + '%';
  $('#vol-fx').value  = fx;  $('#vol-fx-val').textContent  = fx + '%';
  $('#vol-music').value = mus; $('#vol-music-val').textContent = mus + '%';
  $('#settings-mute').innerHTML = icon(save.muted ? 'mute' : 'sound') + (save.muted ? 'Sound off' : 'Sound on');
  document.querySelectorAll('#seg-difficulty button').forEach(b => b.classList.toggle('on', b.dataset.diff === diff().label.toLowerCase()));
}

function applyTheme(){
  const light = save.theme === 'light';
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  const iconName = light ? 'moon' : 'sun';   // show the theme you'd switch *to*
  document.querySelectorAll('#menu-theme, #shop-theme').forEach(b => b.innerHTML = icon(iconName));
}

function toggleTheme(){
  save.theme = save.theme === 'light' ? 'dark' : 'light';
  persist();
  applyTheme();
  SFX.click();
}

/* ---------------- boot ---------------- */
function boot(){
  bind();
  applyTheme();
  refreshHeroes();
  updateSettingsUI();
  $('#menu-mute').innerHTML = icon(save.muted ? 'mute' : 'sound');
  $('#battle-mute').innerHTML = icon(save.muted ? 'mute' : 'sound');
}
boot();
