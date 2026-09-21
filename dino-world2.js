/* ═══════════════════════════════════════════════════════════════════════
   dino-world2.js · WORLDS 6-10 + WORLD END · v2.2.0 · MECHANICS ONLY

   LOAD ORDER (see dino.html): dino-scenes.js → dino-scene2.js
     → dino-world.js → dino.js → dino-q-end.js → THIS FILE → author.js

   THIS FILE OWNS THE RULES, NOT THE STORY.
     stages si 25-50 · the five world laws · the six new power-ups ·
     the spend budget · the Unbroken Page · secret DETECTION · the
     dqb3_author flag store · map registration · ambient backgrounds.

   author.js OWNS THE VOICE.
     the break animation · the Pokémon dialogue engine · scripts S0-S4 ·
     every line of prose · the lore/codex · the AUTHOR console.
     It publishes its text on W2.COPY, which this file reads lazily with
     inline fallbacks — so deleting author.js leaves the game fully
     playable, just silent.

   READS (must already exist): STAGES ECOL ELEM_BY_STAGE PASSIVE_FX PU
                               STACK_CFG EFFECT_LABELS BOSS_ATTRS CAPS G
   WRAPS (14): tickEffects addOrStackEffect doHealAura loadLevel
               handleLevelWin worldBossStage enterLevel capPlayerStats
               onTimeout buildMap usePowerup updateBars submitPastedText
               startBattleBgLoop
   VERIFY: AUTHOR.patches() then AUTHOR.verify()
   ═══════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ─── §1 · BOOT + PATCH REGISTRY ──────────────────────────────────────
   Every wrap records itself here so nothing fails silently.          */
const W2 = window.W2 = { ver:'2.2.0', patches:{}, missing:[] };

/* Story text lives in author.js and is published on W2.COPY, which loads
   AFTER this file. Always read it through copy() so the mechanics keep
   working — with a plain fallback — if author.js is absent. */
const copy = (k,fallback)=>{ const c=W2.COPY&&W2.COPY[k]; return c===undefined?fallback:c; };

function need(n){ const v = window[n];
  if(v===undefined||v===null) W2.missing.push(n);
  return v; }
/* dino.js/dino-world.js declare their globals with const/let → they are NOT
   on window. Always read them as bare identifiers behind typeof guards.   */
const have = n=>{ try{ return eval('(typeof '+n+'!=="undefined")'); }catch(e){ return false; } };
const GG = ()=>{ try{ return (typeof G!=='undefined'&&G)?G:null; }catch(e){ return null; } };
function wrap(name, factory){
  const orig = window[name];
  if(typeof orig!=='function'){ W2.patches[name]='NOT FOUND — hook did not attach'; return; }
  try { window[name] = factory(orig); window[name]._w2 = true; W2.patches[name]='ok'; }
  catch(e){ W2.patches[name]='ERROR '+e.message; }
}
const say = (m,c)=>{ if(typeof setMsg==='function') setMsg(m, c||'var(--purple)'); };
const fx  = ()=>{ if(typeof renderEffects==='function') renderEffects(); };
const inv = ()=>{ if(typeof renderInventory==='function') renderInventory(); };
const bars= ()=>{ if(typeof updateBars==='function') updateBars(); };

['STAGES','ECOL','ELEM_BY_STAGE','PASSIVE_FX','PU','CAPS'].forEach(n=>{
  if(!have(n)) W2.missing.push(n);
});

/* CONFIRMED against dino.js tickEffects: player DoTs are playerBurn/playerPoison */
const DOT_BURN='playerBurn', DOT_POISON='playerPoison';


/* ─── §2 · CONSTANTS · LAWS · BUDGET ──────────────────────────────────
   Laws STACK. World 9 = VI+VII+VIII+IX all live simultaneously.      */
const PAGE_TARGET = 50;            // real END win threshold (HUD shows "—")
const AUTHOR_KEY  = 'dqb3_author'; // separate from dqb3_save on purpose (§13)

const WORLD_LAWS = {
  6 :{ buffDecay:2,        stackCap:2      },  // THE FRAYING
  7 :{ silenceEvery:4,     healMult:0.60   },  // THE SILENCE
  8 :{ sealRandom:true,    spFnDouble:true },  // THE LETTER
  9 :{ clearHeal:0.20,     enemySustainMult:2 }, // THE PRESSURE
  10:{ erodePerClear:0.015, banStack:true  }   // THE EROSION
};
const LAW_NAME = {6:'VI · THE FRAYING',7:'VII · THE SILENCE',8:'VIII · THE LETTER',
                  9:'IX · THE PRESSURE',10:'X · THE EROSION'};

const WORLD_BUDGET = {           // per-battle SPEND caps (§10)
  6 :{lv:4, boss:5, carry:6, refill:3, slots:8,  swaps:3},
  7 :{lv:3, boss:4, carry:6, refill:3, slots:9,  swaps:2},
  8 :{lv:3, boss:3, carry:5, refill:2, slots:9,  swaps:2},
  9 :{lv:2, boss:3, carry:5, refill:2, slots:10, swaps:2},
  10:{lv:2, boss:2, carry:4, refill:2, slots:10, swaps:4},  // +free swaps, §10
  11:{lv:1, boss:0, carry:4, refill:4, slots:10, swaps:2}
};

/* Replaces the broken `w*5-1` in lockAttrsForWorld */
const WORLD_BOSS_SI = W2.WORLD_BOSS_SI =
  {1:4,2:9,3:14,4:19,5:24,6:29,7:34,8:39,9:44,10:49,11:50};

const RES_BY_WORLD = {
  6 :{poison:.15,burn:.15,paralyze:.20,freeze:.20,halfhp:.20},
  7 :{poison:.20,burn:.20,paralyze:.25,freeze:.25,halfhp:.25},
  8 :{poison:.25,burn:.25,paralyze:.30,freeze:.30,halfhp:.30},
  9 :{poison:.30,burn:.30,paralyze:.35,freeze:.35,halfhp:.35},
  10:{poison:.35,burn:.35,paralyze:.40,freeze:.40,halfhp:.40},
  11:{poison:.05,burn:.05,paralyze:.05,freeze:.05,halfhp:0}
};

W2.activeLaws = function(){
  let st={};
  try{ st=(STAGES||[])[(typeof G!=='undefined'&&G)?G.curStage:-1]||{}; }catch(e){}
  const w = st.world || 1, out = {};
  for(let i=6;i<=w&&i<=10;i++) Object.assign(out, WORLD_LAWS[i]);
  return out;
};
const activeLaws = W2.activeLaws;


/* ─── §3 · PACING CURVES ──────────────────────────────────────────────
   Boss HP is literal (hand-tuned). L1-L4 derive: L1 = boss/1.7, ×1.10.
   atk = 5.5%/8.2% of own HP · boss 5.0%/7.5%. Attr grows ×1.2563/stage.
   Change ONLY these constants to reflow all 26 stages at once.        */
const BOSS_HP = [ 78000, 87000, 97000,109000,125000,   // W6  si25-29
                 136000,151000,168000,187000,209000,   // W7  si30-34
                 233000,258000,287000,320000,355000,   // W8  si35-39
                 394000,439000,488000,542000,604000,   // W9  si40-44
                 672000,746000,830000,921000,1025000,  // W10 si45-49
                2600000 ];                             // WEND si50 (→immortal)

function mkLevels(si, B, subs, hpOverride){
  const out=[], r=n=>Math.round(n/100)*100;
  const aH=Math.round(1000*Math.pow(1.2563,si-25));
  const aA=Math.round( 170*Math.pow(1.2533,si-25));
  const aR=Math.round(  86+(si-25)*6.48);
  for(let i=0;i<4;i++){
    const hp = hpOverride ? hpOverride[i] : r(B/1.7*Math.pow(1.10,i));
    out.push({ lv:i+1, sub:subs[i], hp:hp,
      atk:[Math.round(hp*.055),Math.round(hp*.082)],
      attr:{ hp:Math.round(aH*Math.pow(1.08,i)),
             atk:Math.round(aA*Math.pow(1.08,i)),
             res:aR+i*3 } });
  }
  /* The boss used to grant attr {0,0,0} — the hardest fight of every margin
     stage, and the only one that paid nothing. It still hands over a boss
     ATTRIBUTE and a stat multiplier, so it does not need to out-earn the
     levels; it grants what level 4 grants, so the stage's peak is not also
     its one dead end. */
  const bA={hp:Math.round(aH*Math.pow(1.08,3)),
            atk:Math.round(aA*Math.pow(1.08,3)),
            res:aR+9};
  out.push({ lv:5, sub:subs[4], hp:B,
    atk:[Math.round(B*.05),Math.round(B*.075)],
    attr:bA, boss:true });
  return out;
}


/* ─── §4 · spFn ENGINE ────────────────────────────────────────────────
   The engine itself now lives in dino-world.js as SPX, so worlds 1-5 can
   use it too — that file loads 3rd, this one 6th, and a stage literal has
   to be able to reach it at definition time.

   These two shims keep the old names and signatures, so DEF[] (si 25-50)
   and NEW_STAGES' `spFn:mkSp(d.sp)` are untouched. A spec with no `when`
   compiles to {every: spec.every||3} — exactly what mkSp did here.     */
function runSp(g,s){ return window.SPX && SPX.run(g,s); }
function mkSp(spec){
  if(!window.SPX){ W2.missing.push('SPX'); return function(){}; }
  return SPX.make(spec);
}


/* ─── §5 · ENEMY ROSTER + STAGE DEFS (si 25-50) ───────────────────────
   subs = [L1,L2,L3,L4,L5-boss]. Design logic per world: see plan doc. */
const DEF = [

/* W6 · UNMAKING — bodies with pieces missing, seams showing */
{n:'RIFT OF UNMAKING', i:'🕸️',w:6, el:'chaos',  p:'🕸️ Unravelling',
 s:['Thread Eater','Frayed Watcher','Seam Splitter','Null Weaver','🕸️ THE UNRAVELLER'],
 sp:{kind:'vuln',every:3,t:1,msg:'🕸️ THE UNRAVELLER pulls a thread from your armour! EXPOSED!'}},
{n:'THE PALE ARCHIVE', i:'📜',w:6, el:'void',   p:'📜 Redacted',
 s:['Dust Clerk','Blank Codex','Margin Crawler','Redaction','📜 LIBRARIAN OMEGA'],
 sp:{kind:'blind',every:3,t:2,msg:'📜 LIBRARIAN OMEGA redacts the question.'}},
{n:'GRAVITY GARDEN',   i:'🌑',w:6, el:'shadow', p:'🌑 Heavy Air',
 s:['Leadpetal','Stone Pollen','The Bowed Tree','Weight of Roots','🌑 THE HEAVY GARDENER'],
 sp:{kind:'slow',every:2,t:2,msg:'🌑 THE HEAVY GARDENER adds weight to your hands.'}},
{n:'MIRRORFALL',       i:'🪞',w:6, el:'light',  p:'🪞 Reflected',
 s:['Your Reflection','Silvered Twin','The Wrong Hand','Glass Echo','🪞 YOUR OTHER FACE'],
 sp:{kind:'strip',every:3,n:1,msg:'🪞 YOUR OTHER FACE copies your blessing — and keeps it.'}},
{n:'LOOM OF FATE',     i:'🕰️',w:6, el:'time',   p:'🕰️ Woven',
 s:['Spindle Wraith','Cut Thread','The Measuring Hand','Hour Shear','🕰️ MOIRAI, THE THREE'],
 sp:{kind:'seal',every:4,t:1,msg:'🕰️ MOIRAI cuts the thread to your satchel.'}},

/* W7 · SOUND — hollow cavities, mouths, no eyes */
{n:'WHISPER BASIN',    i:'🔔',w:7, el:'water',  p:'🔔 Hushed',
 s:['Murmur','Hushfin','The Listening Pool','Drowned Choirboy','🔔 THE DROWNED BELL'],
 sp:{kind:'drain',every:3,pct:.05,msg:'🔔 THE DROWNED BELL tolls under water. It takes what it hears.'}},
{n:'CHOIR OF ASH',     i:'🎼',w:7, el:'fire',   p:'🎼 Smouldering',
 s:['Cinder Alto','Smoke Soprano','Burnt Score','The Last Verse','🎼 MAESTRO CINERIS'],
 sp:{kind:'dot',every:2,dot:DOT_BURN,t:3,msg:'🎼 MAESTRO CINERIS conducts in embers.'}},
{n:'SILENT CATHEDRAL', i:'⛪',w:7, el:'shadow', p:'⛪ Vow of Silence',
 s:['Vow Keeper','Muted Saint','The Empty Pew','Stone Psalm','⛪ THE UNSPOKEN GOD'],
 sp:{kind:'seal',every:3,t:2,msg:'⛪ THE UNSPOKEN GOD does not permit speech. Items sealed.'}},
{n:'RESONANT DEEP',    i:'🌊',w:7, el:'water',  p:'🌊 Standing Wave',
 s:['Sub-Bass','Hollow Whale','Standing Wave','The Long Tone','🌊 THE LOW NOTE'],
 sp:{kind:'slow',every:2,t:3,msg:'🌊 THE LOW NOTE sounds below hearing. Everything slows.'}},
{n:'THE HOLLOW HYMN',  i:'🎺',w:7, el:'void',   p:'🎺 Unfinished',
 s:['Reed Ghost','Brass Lung','Unfinished Bar','The Held Breath','🎺 THE HOLLOW CHOIRMASTER'],
 sp:{kind:'strip',every:3,n:2,msg:'🎺 THE HOLLOW CHOIRMASTER silences two of your blessings.'}},

/* W8 · MACHINE — jointed, plated, bilaterally exact */
{n:'CLOCKWORK MARCH',  i:'⚙️',w:8, el:'earth',  p:'⚙️ Escapement',
 s:['Tick Soldier','Ratchet Hound','Mainspring Drone','Gear Sergeant','⚙️ THE GREAT ESCAPEMENT'],
 sp:{kind:'atkup',every:3,mult:1.15,msg:'⚙️ THE GREAT ESCAPEMENT winds tighter. ATK +15%.'}},
{n:'THE LAW ENGINE',   i:'⚖️',w:8, el:'electric',p:'⚖️ By The Letter',
 s:['Clause Golem','Bailiff Unit','Precedent','The Sealed Verdict','⚖️ THE MAGISTRATE'],
 sp:{kind:'seal',every:3,t:2,msg:'⚖️ THE MAGISTRATE rules your item inadmissible.'}},
{n:'RUST CATHEDRAL',   i:'🔩',w:8, el:'poison', p:'🔩 Corroding',
 s:['Oxide Monk','Flaking Bell','Corroded Buttress','Tetanus Choir','🔩 FERRUM THE DECAYED'],
 sp:{kind:'dot',every:2,dot:DOT_POISON,t:4,msg:'🔩 FERRUM THE DECAYED breathes rust into the wound.'}},
{n:'BINARY WASTES',    i:'💾',w:8, el:'electric',p:'💾 Corrupted',
 s:['Null Pointer','Segfault','Memory Leak','Stack Overflow','💾 KERNEL PANIC'],
 sp:{kind:'blind',every:2,t:2,msg:'💾 KERNEL PANIC — the answers stop rendering.'}},
{n:'THE FIRST AXIOM',  i:'📐',w:8, el:'light',  p:'📐 Self-Evident',
 s:['Given','Lemma','Corollary','Proof Without Words','📐 THE AXIOM ITSELF'],
 sp:{kind:'strip',every:3,n:2,msg:'📐 THE AXIOM ITSELF asserts your blessings were never true.'}},

/* W9 · PRESSURE — bloated, crowned, bioluminescent */
{n:'SUNKEN THRONE',    i:'🔱',w:9, el:'water',  p:'🔱 Salt-Bound',
 s:['Silt Herald','Barnacle Knight','Tide Vassal','The Drowned Court','🔱 THE SALT KING'],
 sp:{kind:'drain',every:2,pct:.06,msg:'🔱 THE SALT KING draws the water out of you.'}},
{n:'LEVIATHAN TRENCH', i:'🐋',w:9, el:'water',  p:'🐋 Crushing Depth',
 s:['Anglerlight','Trench Maw','Pressure Serpent','Hadal Coil','🐋 LEVIATHAN PRIME'],
 sp:{kind:'atkup',every:3,mult:1.18,msg:'🐋 LEVIATHAN PRIME descends. The pressure rises. ATK +18%.'}},
{n:'GLACIER TOMB',     i:'🧊',w:9, el:'ice',    p:'🧊 Blue Silence',
 s:['Frostbitten','Ice Core','The Blue Silence','Glacial Heart','🧊 THE LAST WINTER'],
 sp:{kind:'slow',every:2,t:3,msg:'🧊 THE LAST WINTER closes over you.'}},
{n:'THE BRINE COURT',  i:'🦀',w:9, el:'poison', p:'🦀 Brined',
 s:['Crab Vizier','Salt Concubine','Shellguard','Brine Chancellor','🦀 THE BRINE EMPRESS'],
 sp:{kind:'dot',every:2,dot:DOT_POISON,t:4,msg:'🦀 THE BRINE EMPRESS salts the wound. Literally.'}},
{n:'DROWNED SOVEREIGN',i:'👑',w:9, el:'water',  p:'👑 Deep Oath',
 s:['Trident Bearer','Abyssal Regent','Crown of Kelp','The Deep Oath','👑 POSEIDON UNBOUND'],
 sp:{kind:'heal',every:3,pct:.06,msg:'👑 POSEIDON UNBOUND drinks the ocean. +6% HP.'}},

/* W10 · ENDING — light, silhouette, dissolution */
{n:'DYING STAR',       i:'☄️',w:10,el:'fire',   p:'☄️ Solar Wind',
 s:['Solar Flare','Helium Husk','Red Giant','Corona Wraith','☄️ THE FINAL SUN'],
 sp:{kind:'dot',every:2,dot:DOT_BURN,t:4,msg:'☄️ THE FINAL SUN exhales its last hydrogen.'}},
{n:'ENTROPY FIELDS',   i:'🌫️',w:10,el:'void',   p:'🌫️ Heat Death',
 s:['Heat Death','Grey Drift','Disorder','The Last Warmth','🌫️ ENTROPY ABSOLUTE'],
 sp:{kind:'erode',every:2,pct:.03,msg:'🌫️ ENTROPY ABSOLUTE takes {n} Max HP. It does not give it back.'}},
{n:'THE FINAL DAWN',   i:'🌅',w:10,el:'light',  p:'🌅 Overexposed',
 s:['First Light','Terminus Ray','The Long Morning','Last Sunrise','🌅 AURORA TERMINUS'],
 sp:{kind:'blind',every:2,t:3,msg:'🌅 AURORA TERMINUS is too bright to read by.'}},
{n:'COLLAPSE HORIZON', i:'🕳️',w:10,el:'void',   p:'🕳️ Event Edge',
 s:['Event Edge','Tidal Shear','Photon Trap','Schwarzschild','🕳️ THE POINT OF NO RETURN'],
 sp:{kind:'atkup',every:2,mult:1.20,msg:'🕳️ THE POINT OF NO RETURN — inward only. ATK +20%.'}},
{n:'OMEGA POINT',      i:'✴️',w:10,el:'light',  p:'✴️ Convergence',
 s:['Alpha Remnant','Convergence','All Things Ending','The Final Question','✴️ THE OMEGA POINT'],
 sp:{kind:'strip',every:2,n:3,msg:'✴️ THE OMEGA POINT gathers everything you have. Including that.'}}
];

/* Build si 25-49 */
const NEW_STAGES = DEF.map((d,k)=>{
  const si=25+k;
  return { name:d.n, icon:d.i, sprIdx:si, world:d.w, isBoss:true,
           passive:{label:d.p,desc:''}, res:RES_BY_WORLD[d.w],
           levels:mkLevels(si,BOSS_HP[k],d.s), spFn:mkSp(d.sp) };
});

/* ─── §5b · si 50 · WORLD END (literal — do not derive) ────────────── */
NEW_STAGES.push({
  name:'THE UNWRITTEN', icon:'🕯️', sprIdx:50, world:11, isBoss:true, isFinal:true,
  passive:{label:'🕯️ Beyond The Page',desc:''}, res:RES_BY_WORLD[11],
  levels: mkLevels(50, 2600000,
    ['THE BLANK','THE WITNESS','THE AUTHOR','THE ERASURE','🕯️ THE UNWRITTEN'],
    [1200000,1400000,1650000,1950000]),
  spFn: function(g){
    const L=g.curLevel;
    if(L===0&&g.bossAtkCounter>0&&g.bossAtkCounter%2===0)
      runSp(g,{kind:'strip',n:1,msg:'🕯️ THE BLANK erases one of your blessings.'});
    if(L===1&&g.bossAtkCounter>0&&g.bossAtkCounter%3===0){
      runSp(g,{kind:'vuln',t:1,msg:'👁 THE WITNESS has seen everything you will do.'});
      runSp(g,{kind:'slow',t:2,msg:'👁 …and is already looking at the next thing.'}); }
    if(L===2&&g.bossAtkCounter>0&&g.bossAtkCounter%3===0){
      runSp(g,{kind:'atkup',mult:1.15,msg:'✍ THE AUTHOR rewrites the scene in its favour. ATK +15%.'});
      runSp(g,{kind:'heal',pct:.05,msg:'✍ …and gives itself more room.'}); }
    if(L===3&&g.bossAtkCounter>0&&g.bossAtkCounter%2===0){
      runSp(g,{kind:'erode',pct:.04,msg:'🩸 THE ERASURE removes you from the record. -{n} Max HP.'});
      const ks=Object.keys(g.inv||{}).filter(k=>g.inv[k]>0);
      if(ks.length){ const t=ks[Math.floor(Math.random()*ks.length)];
                     g.inv[t]=Math.max(0,g.inv[t]-1); inv(); } }
    if(L===4){ /* L5 is the Unbroken Page — §12 owns it. No damage phases. */ }
  }
});

/* APPEND — idempotent by IDENTITY, not exact length.
   The per-stage elem/pas enrichment deliberately does NOT happen here: it
   reads ELEM_BY_STAGE and PASSIVE_FX, which §6 below is what extends. Doing
   it here gave all 26 new stages elem:'void' and pas:{} — every passive in
   worlds 6-11 was dead and every stage inherited void's blindness proc. */
if(typeof STAGES!=='undefined' && !STAGES.some(s=>s&&s.sprIdx===25&&s.world===6)){
  STAGES.push.apply(STAGES,NEW_STAGES);
  W2.patches['stage-append']='ok — STAGES now '+STAGES.length;
} else if(typeof STAGES!=='undefined'){
  W2.patches['stage-append']='SKIPPED (already present) — STAGES.length='+STAGES.length;
}
W2.NEW_STAGES = NEW_STAGES;


/* ─── §6 · ECOL · ELEM_BY_STAGE · PASSIVE_FX ──────────────────────── */
const NEW_ECOL = [
 {body:'#6a2ac8',dark:'#2a0a5a',eye:'#ff66ff'},{body:'#d8d0b8',dark:'#8a8070',eye:'#4a9eff'},
 {body:'#1a1a3a',dark:'#08081a',eye:'#aa66ff'},{body:'#b8e8ff',dark:'#5a8aa8',eye:'#ffffff'},
 {body:'#3a0a5a',dark:'#1a0028',eye:'#ffcc00',boss:true,crown:'#c0c0ff'},
 {body:'#2a6a7a',dark:'#0a2a3a',eye:'#ccffff'},{body:'#6a5a5a',dark:'#2a2020',eye:'#ff6600'},
 {body:'#4a4a6a',dark:'#1a1a2a',eye:'#ffee88'},{body:'#0a4a6a',dark:'#02202a',eye:'#00ffdd'},
 {body:'#1a1a1a',dark:'#000000',eye:'#ffdd44',boss:true,crown:'#c0a020'},
 {body:'#8a7a4a',dark:'#4a3a1a',eye:'#ffcc00'},{body:'#5a6a8a',dark:'#1a2a4a',eye:'#66ddff'},
 {body:'#8a4a2a',dark:'#4a2010',eye:'#aaff66'},{body:'#0a3a2a',dark:'#001a10',eye:'#00ff88'},
 {body:'#e8e8f0',dark:'#8a8a9a',eye:'#4a9eff',boss:true,crown:'#ffdd00'},
 {body:'#1a4a6a',dark:'#08202a',eye:'#ffdd00'},{body:'#0a2a4a',dark:'#000a1a',eye:'#66ffcc'},
 {body:'#a8d8f0',dark:'#4a7a9a',eye:'#ffffff'},{body:'#4a7a5a',dark:'#1a3a2a',eye:'#ccff44'},
 {body:'#062038',dark:'#000810',eye:'#00e5ff',boss:true,crown:'#f5c842'},
 {body:'#ff6a00',dark:'#8a2a00',eye:'#ffffcc'},{body:'#3a3a4a',dark:'#12121a',eye:'#ff44aa'},
 {body:'#ffd48a',dark:'#8a6030',eye:'#ffffff'},{body:'#050510',dark:'#000000',eye:'#7a44ff'},
 {body:'#ffffff',dark:'#aaaacc',eye:'#00e5ff',boss:true,crown:'#ff00aa'},
 {body:'#0a0a0a',dark:'#000000',eye:'#ffffff',boss:true,crown:'#ffffff'}
];
if(typeof ECOL!=='undefined' && ECOL.length<51) ECOL.push.apply(ECOL,NEW_ECOL);

/* Feature counts for the beyond, authored next to their colours. The body
   plans (unravel/hollow/engine/sovereign/dissolve) live in dino-world.js;
   these are what separate the five stages inside each of those worlds.
   si 50 (THE UNWRITTEN) deliberately carries none. */
if(typeof STAGE_MODS!=='undefined') Object.assign(STAGE_MODS,{
  /* W6  unravel   */ 25:{}, 26:{spines:1}, 27:{spines:2}, 28:{tailSpike:1}, 29:{spines:3,tailSpike:1},
  /* W7  hollow    */ 30:{crest:1}, 31:{crest:2}, 32:{horns:1}, 33:{crest:3}, 34:{horns:2,crest:2},
  /* W8  engine    */ 35:{plates:1}, 36:{plates:2}, 37:{plates:3}, 38:{horns:1}, 39:{plates:4,horns:1},
  /* W9  sovereign */ 40:{crest:1}, 41:{crest:2}, 42:{spines:1}, 43:{crest:3}, 44:{crest:3,spines:2},
  /* W10 dissolve  */ 45:{}, 46:{spines:1}, 47:{crest:1}, 48:{spines:2}, 49:{crest:2,spines:2},
  /* END           */ 50:{}
});

if(typeof ELEM_BY_STAGE!=='undefined') Object.assign(ELEM_BY_STAGE,
  DEF.reduce((o,d,k)=>(o[25+k]=d.el,o),{50:'void'}));

if(typeof PASSIVE_FX!=='undefined') Object.assign(PASSIVE_FX,{
 25:{dodge:.18,thorns:.12}, 26:{dr:.16,lifesteal:.10}, 27:{dr:.20,thorns:.15},
 28:{thorns:.28,dodge:.10}, 29:{dodge:.20,regen:.04},  30:{regen:.05,dr:.14},
 31:{thorns:.18,lifesteal:.12},32:{dr:.22,dodge:.12},  33:{regen:.06,thorns:.14},
 34:{dodge:.22,dr:.18},     35:{dr:.24,thorns:.16},    36:{dr:.20,lifesteal:.15},
 37:{thorns:.22,regen:.04}, 38:{dodge:.24,dr:.16},     39:{dr:.26,thorns:.18},
 40:{lifesteal:.18,dr:.18}, 41:{dr:.25,regen:.05},     42:{thorns:.24,dr:.20},
 43:{lifesteal:.20,thorns:.18},44:{dodge:.24,dr:.22},  45:{thorns:.26,lifesteal:.16},
 46:{dr:.28,dodge:.18},     47:{dodge:.26,regen:.05},  48:{dr:.30,thorns:.20},
 49:{dodge:.28,dr:.25,lifesteal:.20},
 50:{dodge:.30,dr:.30,thorns:.30,lifesteal:.25,regen:.06}
});

/* NOW the new stages can read their element and passive — the tables they
   depend on finally exist. (This ran before §6 in v2.1 and silently blanked
   every one of them.) Idempotent: re-running only rewrites the same values. */
NEW_STAGES.forEach((s,k)=>{
  const si=25+k;
  s.elem = (typeof ELEM_BY_STAGE!=='undefined'&&ELEM_BY_STAGE[si])||'void';
  s.pas  = (typeof PASSIVE_FX!=='undefined'&&PASSIVE_FX[si])||{};
  if(typeof buildPassiveDesc==='function') s.passive.desc = buildPassiveDesc(s);
});
W2.patches['stage-enrich']='ok — elem/pas bound for si 25-50';


/* ─── §7 · BOSS ATTRIBUTES (6 new · ETERNAL tier) ─────────────────── */
W2.NEW_ATTRS = [
 /* Worlds 6, 7 and 8 used to hand out three purely DEFENSIVE attributes in a row
    — dodge, status resistance, damage reduction. But enemy HP is sized off your
    flat ATK (enemyHPFor -> estPlayerHit -> G.pATK), so nothing defensive shortens
    a fight, and the answers-to-kill count did not fall for three whole worlds
    while enemy creep climbed. Brute-forcing every legal loadout, EVERY boss from
    stage 25 to 39 had a negative margin; the turn only came at Drowned Crown in
    World 9. Each of the three now carries one offensive term as well. */
 {id:'wovenfate',   si:29,world:6, icon:'🕸️',name:'Woven Fate',   tier:'MYTHIC',
  desc:'+20% ATK · 15% dodge · reflect 15% · +1s answer time',
  fx:{atkMult:1.20,dodge:.15,thorns:.15,timeBonus:1}},
 {id:'hollowhymn',  si:34,world:7, icon:'🎺',name:'Hollow Hymn',  tier:'MYTHIC',
  /* lifesteal kept deliberately small. At .12 it stacked with Void Madness to
     .22 and flipped World 9 to a net heal, which is Drowned Crown's job three
     stages later. .08 is a taste of the mechanic, not a replacement for it. */
  /* Three stats that all said "more healing", against a bar that stops at
     full — the +30% was literally discarded whenever it mattered most.
     overflow sends healing you cannot hold to the enemy instead, so the
     hymn's giving and taking are the same act and nothing is wasted. */
  desc:'Lifesteal 8% · 60% status resistance · +30% healing · healing you cannot hold is dealt as damage',
  fx:{lifesteal:.08,dotRes:.60,healMult:1.30,overflow:true}},
 {id:'firstaxiom',  si:39,world:8, icon:'📐',name:'First Axiom',  tier:'MYTHIC',
  desc:'+20% ATK · take 20% less damage · immune to Paralyze',
  fx:{atkMult:1.20,dr:.20,immune:['paralyze']}},
 {id:'drownedcrown',si:44,world:9, icon:'🔱',name:'Drowned Crown',tier:'MYTHIC',
  desc:'+30% ATK · lifesteal 15%', fx:{atkMult:1.30,lifesteal:.15}},
 {id:'omegapoint',  si:49,world:10,icon:'✴️',name:'Omega Point',  tier:'MYTHIC',
  desc:'+35% ATK · take 15% less damage · 12% dodge', fx:{atkMult:1.35,dr:.15,dodge:.12}},
 {id:'theunwritten',si:50,world:11,icon:'🕯️',name:'The Unwritten',tier:'ETERNAL',
  desc:'+50% ATK · 25% DR · 90% status res · immune to all DoT · +3s',
  fx:{atkMult:1.50,dr:.25,dotRes:.90,dodge:.15,thorns:.25,lifesteal:.20,
      regen:.05,healMult:1.50,timeBonus:3,
      immune:['burn','poison','freeze','paralyze','slowed']}}
];
(function(){
  if(typeof BOSS_ATTRS==='undefined'){ W2.patches['boss-attrs']='NOT FOUND'; return; }
  if(!BOSS_ATTRS.some(a=>a.id==='wovenfate')) BOSS_ATTRS.push.apply(BOSS_ATTRS,W2.NEW_ATTRS);
  if(typeof ATTR_BY_ID!=='undefined') W2.NEW_ATTRS.forEach(a=>{ ATTR_BY_ID[a.id]=a; });
  if(typeof ATTR_BY_SI!=='undefined') W2.NEW_ATTRS.forEach(a=>{ ATTR_BY_SI[a.si]=a; });
  if(typeof BOSS_MULT!=='undefined') Object.assign(BOSS_MULT,{
    29:{all:1.3, icon:'🕸️', tier:'MYTHIC', col:'--purple',
        text:'THE UNRAVELLER UNDONE! All stats ×1.3!'},
    34:{all:1.3, icon:'🎺', tier:'MYTHIC', col:'--teal',
        text:'THE HOLLOW CHOIRMASTER SILENCED! All stats ×1.3!'},
    39:{all:1.3, icon:'📐', tier:'MYTHIC', col:'--green',
        text:'THE AXIOM DISPROVEN! All stats ×1.3!'},
    44:{all:1.3, icon:'🔱', tier:'MYTHIC', col:'--cyan',
        text:'POSEIDON UNBOUND DETHRONED! All stats ×1.3!'},
    49:{all:1.3, icon:'✴️', tier:'MYTHIC', col:'--yellow',
        text:'THE OMEGA POINT PASSED! All stats ×1.3!'},
    /* si 50 never reaches handleLevelWin (the Unbroken Page has no HP bar to
       empty), so W2.realityChanges grants this one by hand — but the entry
       has to exist for grantBossAttr/ATTR_BY_SI to resolve it. */
    50:{all:1.0, icon:'🕯️', tier:'ETERNAL', col:'--yellow',
        text:'THE UNWRITTEN, WRITTEN.'}
  });
  W2.patches['boss-attrs']='ok';
})();


/* ─── §8 · THE SIX NEW POWER-UPS ──────────────────────────────────── */
W2.NEW_PU = {
 anchor  :{icon:'🪝',name:'ANCHOR',     color:'var(--teal)',  border:'#2dd4c8',desc:'Buffs cannot be stripped or decay · 3 turns'},
 echo    :{icon:'🔊',name:'ECHO',       color:'var(--cyan)',  border:'#00e5ff',desc:'Break silence · refund 1 power-up use'},
 loophole:{icon:'📎',name:'LOOPHOLE',   color:'var(--yellow)',border:'#f5c842',desc:'Void the enemy next special ability'},
 desalt  :{icon:'🧪',name:'DESALINATE', color:'var(--blue)',  border:'#4a9eff',desc:'Enemy lifesteal & regen nullified · 4 turns'},
 restore :{icon:'🕊',name:'RESTORATION',color:'var(--green)', border:'#4ecb71',desc:'Refund ALL permanent max HP lost'},
 thepen  :{icon:'✒️',name:'THE PEN',    color:'#fff',         border:'#ffffff',desc:'Forgive one broken streak · once per run'}
};
if(typeof PU!=='undefined') Object.assign(PU,W2.NEW_PU);
/* ─── §8a2 · THE CANON, PAST THE MARGIN ────────────────────────────────────
   The other twenty-two are certainties you hold and spend. These six are not
   held by anyone — which is the whole reason they are reactive (see W2.REACTIVE
   directly below). Out here the Bank is too thin to draw on deliberately, so
   what fires is not your choice: it is the last reflex of a world that still
   wants to be coherent, correcting exactly one kind of incoherence each.

   Each answers the law of the world that unlocks it, one for one:
     W6 The Fraying unravels  -> ANCHOR holds
     W7 The Silence mutes     -> ECHO returns the sound
     W8 The Letter legislates -> LOOPHOLE reads the law against itself
     W9 The Pressure salts    -> DESALINATE remembers fresh water
     W10 The Erosion wears    -> RESTORATION gives back what was only moved
     W11 The Unwritten blanks -> THE PEN, the one instrument a blank page takes

   Canon: claude/powerup-lore.md. Rendered in the power-up guide modal only. */
W2.PU_LORE = {
 anchor  :'World 6. The Fraying pulls threads. This is the world\u2019s own refusal to let a settled thing come loose.',
 echo    :'World 7. A sound that was made cannot be unmade. The Silence forgets this; the Echo reminds it.',
 loophole:'World 8. Any law written well enough to enforce is written well enough to read against itself.',
 desalt  :'World 9. Salt takes, and keeps. Fresh water is the memory that it was never owed.',
 restore :'World 10. Erosion moves things. It has never once destroyed one, and this is the receipt.',
 thepen  :'World 11. The only instrument a blank page will take. It forgives one line, and it is spent.'
};
if(typeof PU_LORE!=='undefined') Object.assign(PU_LORE,W2.PU_LORE);

if(typeof STACK_CFG!=='undefined') Object.assign(STACK_CFG,{
  anchored:{turnsAdd:3,cap:2}, voidNext:{turnsAdd:1,cap:3}, desalted:{turnsAdd:4,cap:2}});
if(typeof EFFECT_LABELS!=='undefined') Object.assign(EFFECT_LABELS,{
  anchored:{name:'ANCHORED',bar:'var(--teal)'},
  voidNext:{name:'LOOPHOLE',bar:'var(--yellow)'},
  desalted:{name:'DESALTED',bar:'var(--blue)'}});

W2.PU_UNLOCK = {anchor:6,echo:7,loophole:8,desalt:9,restore:10,thepen:11};
W2.NO_RANDOM = ['thepen','restore','revive'];

W2.isNewPU = type=>Object.prototype.hasOwnProperty.call(W2.NEW_PU,type);

/* ─── §8b · THE MARGIN DOCTRINE · reactive power-ups ───────────────────────
   The six never enter the inventory. Each arms at its unlock world and fires
   itself the first time its trigger occurs, because none of them is an
   opening move — every one is a response to something the enemy just did.
   The worlds 1-5 stack is untouched and stays manual.

   Everything here is fail-safe: reactiveTry() returns false on any problem,
   and the caller then does exactly what it did before. ──────────────────── */
W2.REACTIVE = {
  anchor  :{world:6, on:'buffStrip',    msg:'ANCHOR holds — your buffs cannot be stripped.'},
  echo    :{world:7, on:'silence',      msg:'ECHO breaks the silence.'},
  loophole:{world:8, on:'enemySpecial', msg:'LOOPHOLE voids the ability.'},
  desalt  :{world:9, on:'enemyHeal',    msg:'DESALINATE — the enemy cannot heal.'},
  restore :{world:10,on:'maxHpLoss',    msg:'RESTORATION — your max HP is returned.'},
  /* atEnd: THE PEN is the ONLY conditional way through stage 51, so it must
     not be spendable anywhere else. Armed for the whole of World 11 it fired
     on the first streak break in levels 1-4 — printing "held in reserve",
     granting nothing, and setting penUsed for the rest of the RUN. The one
     level it exists for then had no pen at all. */
  thepen  :{world:11,on:'streakBreak',  msg:'THE PEN forgives the broken page.',oncePerRun:true,atEnd:true}
};
/* six armed counters would trivialise world 11 — see the plan's risk table */
W2.REACTIVE_CAP = 2;

W2.curWorld = function(){
  const g=GG();
  return (g&&typeof STAGES!=='undefined'&&STAGES[g.curStage]&&STAGES[g.curStage].world)||1;
};
W2.reactiveState = function(){
  const g=GG(); if(!g) return null;
  if(!g.reactive||typeof g.reactive!=='object') g.reactive={firedThisBattle:[],penUsed:false};
  if(!Array.isArray(g.reactive.firedThisBattle)) g.reactive.firedThisBattle=[];
  if(typeof g.reactive.penUsed!=='boolean') g.reactive.penUsed=false;
  return g.reactive;
};
W2.reactiveReset = function(){
  const st=W2.reactiveState(); if(st) st.firedThisBattle=[];   // penUsed survives — once per RUN
};
/* every armed type for the current world, in unlock order */
W2.reactiveList = function(){
  const w=W2.curWorld(), g=GG();
  const inGauntlet=!!(g&&g._endGauntlet);
  return Object.keys(W2.REACTIVE).filter(t=>
    w>=W2.REACTIVE[t].world && (!W2.REACTIVE[t].atEnd || inGauntlet));
};
W2.reactiveSpent = function(t){
  const st=W2.reactiveState(); if(!st) return false;
  return st.firedThisBattle.indexOf(t)>=0 || (W2.REACTIVE[t].oncePerRun && st.penUsed);
};

/* Returns TRUE only when a counter actually fired, which the caller reads as
   "this enemy action was answered — suppress it". */
W2.reactiveTry = function(event){
  try{
    const g=GG(); if(!g) return false;
    if(g.isPractice) return false;            // Training keeps the six manual
    if(W2.curWorld()<6) return false;         // worlds 1-5 never see this
    const st=W2.reactiveState(); if(!st) return false;
    const type=W2.reactiveList().find(t=>
      W2.REACTIVE[t].on===event && !W2.reactiveSpent(t));
    if(!type) return false;
    /* REACTIVE_CAP keeps two guards a battle so six cannot trivialise a fight.
       THE PEN is exempt: it is the only conditional way through stage 51, it
       fires once per RUN rather than once per battle, and the boss still
       attacks during the gauntlet — so two unrelated guards tripping would
       otherwise lock the player out of the one escape the level has. */
    if(!W2.REACTIVE[type].atEnd && st.firedThisBattle.length>=W2.REACTIVE_CAP)
      return false;
    if(!W2.applyNewPU(type)) return false;
    st.firedThisBattle.push(type);
    try{ if(typeof bumpStat==='function') bumpStat('guards'); }catch(e){}
    if(W2.REACTIVE[type].oncePerRun) st.penUsed=true;
    say(W2.REACTIVE[type].msg,'var(--yellow)');
    W2.renderReactive(type);
    return true;
  }catch(e){ return false; }                  // never let a counter break a battle
};

/* What each guard is WAITING FOR. The rail used to print six bare names with
   the answer hidden in a title attribute, so nothing on screen said what any
   of them did or when it would happen — and the rule that actually governs
   the fight, REACTIVE_CAP, was invisible entirely: only two of the six can
   fire in a single battle, however many are armed. */
W2.REACTIVE_WATCH = {
  anchor  : 'buffs stripped',
  echo    : 'silenced',
  loophole: 'enemy special',
  desalt  : 'enemy heals',
  restore : 'max HP lost',
  thepen  : 'streak breaks',
};

/* the rail — armed / just-fired / spent. Automatic must not mean invisible. */
W2.renderReactive = function(flash){
  const el=document.getElementById('w2-reactive'); if(!el) return;
  const g=GG(), list=(g&&!g.isPractice)?W2.reactiveList():[];
  if(!list.length){ el.style.display='none'; el.innerHTML=''; W2.syncHUD(); return; }
  el.style.display='block';

  const st=W2.reactiveState();
  const used=(st&&st.firedThisBattle.length)||0, cap=W2.REACTIVE_CAP;
  const pips=Array.from({length:cap},(_,i)=>
    '<i class="w2-gpip'+(i<used?' w2-gpip-out':'')+'"></i>').join('');

  el.innerHTML =
    '<div class="w2-ghead"><span class="w2-b-lbl">GUARD</span>'+
      '<span class="w2-gcap" title="Only '+cap+' guards can fire in one battle">'+
        pips+'<b>'+used+'/'+cap+'</b></span></div>'+
    '<div class="w2-glist">'+list.map(t=>{
      const pu=(typeof PU!=='undefined'&&PU[t])||{};
      const nm=pu.name||t, ic=pu.icon||'';
      const spent=W2.reactiveSpent(t);
      const cls='w2-rc'+(spent?' spent':'')+(t===flash?' fired':'');
      const watch=W2.REACTIVE_WATCH[t]||'';
      /* the icon is its own element so the phone layout can drop it — six
         emoji are ~120px of a 344px row, and the name already says which
         guard this is */
      return '<span class="'+cls+'" title="'+W2.REACTIVE[t].msg+'">'+
        '<b class="w2-rc-n">'+(ic?'<span class="w2-rc-ic">'+ic+'</span>':'')+nm+'</b>'+
        '<i class="w2-rc-w">'+(spent?'spent':watch)+'</i></span>';
    }).join('')+'</div>';

  W2.syncHUD();
  if(flash) setTimeout(()=>{ const f=el.querySelector('.w2-rc.fired'); if(f)f.classList.remove('fired'); },1400);
};

/* Applies one of the six. The CALLER (the usePowerup wrap in §10) owns the
   inventory guard and the decrement — this only performs the effect. */
W2.applyNewPU = function(type){
  const g=GG(); if(!g) return false;
  const put=(t,extra)=>{
    if(typeof addOrStackEffect==='function') return addOrStackEffect(t,extra||{});
    const e=Object.assign({type:t,stack:1},extra); g.activeEffects.push(e); return e;
  };
  switch(type){
    case 'anchor':  { const e=put('anchored',{turns:3}); fx();
                    say('🪝 ANCHOR ×'+(e.stack||1)+' — nothing can be taken from you.','var(--teal)'); return true; }
    case 'echo':    g.activeEffects=g.activeEffects.filter(e=>e.type!=='playerEnergyLock'&&e.type!=='itemSeal'); inv(); fx();
                    g._spent=Math.max(0,(g._spent||0)-1); W2.renderBudget();
                    say('🔊 ECHO — the silence breaks. One use returned.','var(--cyan)'); return true;
    case 'loophole':{ const e=put('voidNext',{turns:1}); fx();
                    say('📎 LOOPHOLE ×'+(e.stack||1)+' — its next move has no legal basis.','var(--yellow)'); return true; }
    case 'desalt':  { const e=put('desalted',{turns:4}); fx();
                    say('🧪 DESALINATE ×'+(e.stack||1)+' — it cannot feed on you.','var(--blue)'); return true; }
    case 'restore': { const back=g.hpPenalty||0; g.hpPenalty=0;
                    if(typeof capPlayerStats==='function') capPlayerStats(); bars();
                    say('🕊 RESTORATION — the record is corrected. +'+back+' Max HP.','var(--green)');
                    return true; }
    /* no message and no effect here on purpose: reactiveTry() prints
       REACTIVE.thepen.msg and onPageBroken() is what actually holds the page. */
    case 'thepen':  return true;
  }
  return false;
};


/* ─── §9 · WORLD LAW RUNTIME (wraps) ──────────────────────────────── */
wrap('tickEffects', o=>function(){
  const L=activeLaws();
  if(L.buffDecay>1 && G && G.activeEffects){
    const anchored=G.activeEffects.some(e=>e.type==='anchored');
    if(!anchored){
      const B=['shield','barrier','mirror','double','overload','playerRage'];
      G.activeEffects.forEach(e=>{ if(B.includes(e.type)) e.turns-=(L.buffDecay-1); });
      G.activeEffects=G.activeEffects.filter(e=>e.turns>0);
    }
  }
  return o.apply(this,arguments);
});

wrap('addOrStackEffect', o=>function(type,extra){
  const L=activeLaws();
  if(L.banStack&&(type==='double'||type==='overload')){
    say('🌫️ THE EROSION — multiplication does not work here.','var(--grey)');
    /* Must NOT return undefined: every caller reads .stack off the result
       the moment it comes back (dino.js usePowerup), so bailing empty threw
       a TypeError in World 10 — after the item had already been spent. */
    G._erosionRefund=type;
    return {type,stack:1,turns:0,_refused:true};
  }
  const r=o.apply(this,arguments);
  if(L.stackCap && G && G.activeEffects){
    const s=G.activeEffects.filter(e=>e.type===type);
    if((type==='double'||type==='overload') && s.length>L.stackCap)
      G.activeEffects=G.activeEffects.filter(e=>e.type!==type||s.indexOf(e)<L.stackCap);
  }
  return r;
});

wrap('doHealAura', o=>function(){
  const L=activeLaws(), r=o.apply(this,arguments);
  if(L.healMult && GG() && typeof r==='number' && r>0){
    const cut=Math.round(r*(1-L.healMult));
    if(cut>0){ G.playerHP=Math.max(1,G.playerHP-cut); bars(); }
  } return r;
});

/* ─── WORLD END LOCKOUT ─────────────────────────────────────────────────
   Lose at WORLD END and the door shuts for a day. Stored as an expiry
   timestamp, so it survives reloads and cannot be waited out by closing
   the tab. It IS localStorage, so anyone who clears site data walks back
   in — this is a house rule, not a vault. */
const END_LOCK_KEY='dqb3_end_lock';
W2.lockEnd = function(hours){
  const until=Date.now()+((hours==null?24:hours)*3600e3);
  try{ localStorage.setItem(END_LOCK_KEY,String(until)); }catch(e){}
  return until;
};
W2.endLockUntil = function(){
  try{ const v=+localStorage.getItem(END_LOCK_KEY)||0; return v>Date.now()?v:0; }
  catch(e){ return 0; }
};
W2.endLocked = function(){ return W2.endLockUntil()>0; };
W2.endLockText = function(){
  const t=W2.endLockUntil(); if(!t) return '';
  const ms=t-Date.now(), h=Math.floor(ms/3600e3), m=Math.floor((ms%3600e3)/60000);
  return h>0 ? (h+'h '+m+'m') : (m+'m');
};
W2.unlockEnd = function(){
  try{ localStorage.removeItem(END_LOCK_KEY); }catch(e){}
  if(typeof buildMap==='function'){ try{ buildMap(); }catch(e){} }
  return 'WORLD END reopened';
};

wrap('loadLevel', o=>function(si,li){
  if(!GG()) return o.apply(this,arguments);
  const stg=STAGES[si]||{};
  /* Worlds past the gate — and the END past the letter — stay shut whatever
     route asked for them: map node, next-level button or console. */
  if((stg.world||1) > W2.maxWorldUnlocked()){
    say(copy('notWritten','— locked.'),'#fff');
    G.inBattle=false; show('s-map'); if(typeof buildMap==='function') buildMap();
    return;
  }
  /* the door you were thrown out of */
  if((stg.world||1) >= 11 && W2.endLocked()){
    say('✒️ WORLD END is closed. It reopens in '+W2.endLockText()+'.','var(--purple)');
    G.inBattle=false; show('s-map'); if(typeof buildMap==='function') buildMap();
    return;
  }
  if(Array.isArray(G.levelsCleared) && G.levelsCleared.length<STAGES.length)
    for(let i=G.levelsCleared.length;i<STAGES.length;i++) G.levelsCleared[i]=0;
  if(li>4 && (G.levelsCleared[si]||0)>4){ li=4; G.curLevel=4; }
  /* Recomputed on every load. It used to be set on entry and only cleared by
     the award screen, so a lost or abandoned replay left it stuck on and the
     next real win granted nothing. */
  G._w2replay = Array.isArray(G.levelsCleared) && (G.levelsCleared[si]||0) > li;
  W2.syncCaps();
  const r=o.apply(this,[si,li]);
  if(!GG()) return r;
  G._spent=0; G._puThisQ=false; G._puThisBattle=false;
  G._to=0; G._wrongStreak=0; G._clearHealOverride=undefined;
  G._sealedThisBattle=null; G._erosionRefund=null;
  if(stg.world!==11){ G._endGauntlet=false; G.bossImmortal=false; }
  const L=activeLaws();
  if(L.sealRandom){
    const pool=(G.loadout||Object.keys(G.inv||{})).filter(t=>!W2.NO_RANDOM.includes(t));
    if(pool.length){ G._sealedThisBattle=pool[Math.floor(Math.random()*pool.length)];
      say('⚖ THE LETTER seals '+((PU[G._sealedThisBattle]||{}).name||G._sealedThisBattle)+' for this battle.','var(--yellow)'); }
  }
  const st=STAGES[G.curStage]||{};
  if(st.world===11 && G.curLevel===4) W2.armUnbrokenPage();
  W2.renderBudget();
  return r;
});

wrap('handleLevelWin', o=>function(){
  const L=activeLaws(), g=GG();
  /* Give back battle-only Max HP BEFORE the clear-heal (dino.js:1764), so the
     heal is computed against the restored maximum rather than the rotted one.
     Law X's erosion below is permanent and is applied after, untouched. */
  if(g && window.SPX && SPX.refundBattlePenalty && SPX.refundBattlePenalty(g)
     && typeof capPlayerStats==='function') capPlayerStats();
  if(g && L.clearHeal!==undefined) G._clearHealOverride=L.clearHeal;
  if(g && L.erodePerClear){
    const raw=Math.min((typeof CAPS!=='undefined'?CAPS.hpMax:1e9)||1e9,500+G.pHP);
    G.hpPenalty=(G.hpPenalty||0)+Math.round(raw*L.erodePerClear);
    if(typeof capPlayerStats==='function') capPlayerStats();
    say('🌫️ THE EROSION takes its share of you.','var(--grey)');
  }
  const replay=!!(g&&G._w2replay), keepStage=g?G.curStage:0, keepLevel=g?G.curLevel:0;
  const r=o.apply(this,arguments);
  if(replay){
    const b=document.getElementById('aw-btn');
    if(b) b.onclick=()=>{
      G._w2replay=false;
      G.curStage=keepStage;
      G.curLevel=Math.min(4,Math.max(0,G.levelsCleared[keepStage]||0));
      G.inBattle=false;
      if(typeof stopBattleBgLoop==='function') stopBattleBgLoop();
      show('s-map'); if(typeof buildMap==='function') buildMap();
    };
  }
  if(g && !replay && keepLevel===4){
    /* tenDone is a fact about the run, so the rules record it — not a line
       of dialogue that a reload mid-conversation could lose. */
    if(keepStage===49) W2.markA('tenDone');
    W2.onStageClear(keepStage,keepLevel);   // the ONLY w2:stageclear dispatch
  }
  return r;
});

wrap('worldBossStage', o=>function(w){
  if(WORLD_BOSS_SI[w]!==undefined) return WORLD_BOSS_SI[w];
  return o.apply(this,arguments);
});

wrap('enterLevel', o=>function(si,li){
  if(GG() && Array.isArray(G.levelsCleared)) G._w2replay=(G.levelsCleared[si]||0)>li;
  return o.apply(this,arguments);
});

wrap('capPlayerStats', o=>function(){
  W2.syncCaps();                            // caps first, then clamp to them
  return o.apply(this,arguments);
});

wrap('onTimeout', o=>function(){
  if(GG()){ G._to=(G._to||0)+1; if(G._to>=3) W2.findSecret('patient'); }
  return o.apply(this,arguments);
});

wrap('buildMap', o=>function(){
  W2.syncCaps();          // a reloaded run past the margin must see its own caps
  if(GG() && W2.A().gateOpen && typeof WORLD_META!=='undefined' && WORLD_META.length<10) W2.registerWorlds();
  if(GG() && !Array.isArray(G.levelsCleared)){
    G.levelsCleared = new Array(STAGES.length).fill(0);
  } else if(GG() && Array.isArray(G.levelsCleared) && G.levelsCleared.length<STAGES.length){
    for(let i=G.levelsCleared.length;i<STAGES.length;i++) G.levelsCleared[i]=0;
  }
  const r=o.apply(this,arguments);
  W2.renderSerifs();
  W2.renderBudget();
  W2.renderPageHUD();
  return r;
});

W2.dropPool = function(){
  const L=activeLaws();
  return (G.loadout||[]).filter(t=>{
    if(t==='revive') return false;
    if(L.banStack&&(t==='double'||t==='overload')) return false;
    if(G._sealedThisBattle===t) return false;
    return true; });
};


/* ─── §10 · SPEND BUDGET ──────────────────────────────────────────── */
const BUDGET_EXEMPT = ['heal','regen','divine','revive'];

W2.budget = function(){
  const g=GG(); if(!g) return {cap:Infinity,spent:0,w:1};
  const st=(STAGES||[])[g.curStage]||{}, w=st.world||1;
  if(w<6) return {cap:Infinity,spent:0,w:w};
  const b=WORLD_BUDGET[w]||WORLD_BUDGET[10];
  const cap=(g.curLevel===4)?b.boss:b.lv;
  return {cap:cap,spent:g._spent||0,w:w,cfg:b};
};
wrap('loadLevel', o=>function(){
  const r=o.apply(this,arguments);
  try{ W2.reactiveReset(); W2.renderReactive(); }catch(e){}
  return r;
});

W2.renderBudget = function(){
  const el=document.getElementById('w2-budget'); if(!el) return;
  const b=W2.budget();
  /* cap 0 (THE UNWRITTEN allows no spending at all) rendered the USES label
     with no pips after it, which just looked broken */
  if(b.cap===Infinity||!b.cap){ el.style.display='none'; el.innerHTML=''; W2.syncHUD(); return; }
  el.style.display='flex';
  /* the same shape as the GUARD cap above it — both are budgets, and reading
     one against the other is the whole point of them sharing a panel */
  el.innerHTML='<div class="w2-ghead"><span class="w2-b-lbl">USES</span>'+
    '<span class="w2-gcap" title="Power-up uses left in this battle">'+
    Array.from({length:b.cap},(_,i)=>
      '<i class="w2-pip'+(i<b.spent?' w2-pip-out':'')+'"></i>').join('')+
    '<b>'+Math.max(0,b.cap-b.spent)+'/'+b.cap+'</b></span></div>';
  W2.syncHUD();
};

/* ─── the USES/PAGES block lives with the inventory, not over the question ──
   Desktop hangs it off the bottom of .pu-panel; phones move the same node
   into #hint-bar (and the tip stands down) because that is the only spare
   line on a narrow screen. One node, re-parented — never duplicated. */
W2.placeHUD = function(){
  const hud=document.getElementById('w2-hud'); if(!hud) return;
  const narrow=window.matchMedia('(max-width:960px)').matches;
  const host=narrow ? document.getElementById('hint-bar')
                    : document.querySelector('#s-game .pu-panel');
  if(host && hud.parentElement!==host) host.appendChild(hud);
  /* the tip only stands down where the HUD actually took its row */
  document.body.classList.toggle('w2-hud-hint',narrow);
};
W2.syncHUD = function(){
  const hud=document.getElementById('w2-hud'); if(!hud) return;
  const b=document.getElementById('w2-budget'), p=document.getElementById('w2-pages'),
        r=document.getElementById('w2-reactive');
  const on=!!((b&&b.style.display&&b.style.display!=='none')||
              (p&&p.style.display&&p.style.display!=='none')||
              (r&&r.style.display&&r.style.display!=='none'));
  hud.classList.toggle('on',on);
  document.body.classList.toggle('w2-hud-on',on);
  W2.placeHUD();
};
window.addEventListener('resize',()=>{ try{ W2.placeHUD(); }catch(e){} });

wrap('usePowerup', o=>function(type){
  if(!GG()) return o.apply(this,arguments);
  if(!PU[type]) return;
  if(G.animLock) return;

  /* THE UNWRITTEN answers each refusal in its own words (author.js supplies
     the lines; the fallback keeps the rule if author.js is gone). */
  if(G.bossImmortal && !G._authorshipMet && type!=='restore' && type!=='thepen'){
    const R=copy('endRefusals',{});
    say(R[type]||'— it does not notice.','var(--dim)'); return;
  }
  if(G._sealedThisBattle===type){
    say('⚖ THE LETTER sealed that one.','var(--yellow)'); return; }
  /* Law X refuses multiplication outright, before dino.js ever sees the
     request. Letting it through printed "2×DMG ×1!" over the refusal and,
     for OVERLOAD, still applied its EXPOSED downside. Nothing is spent. */
  if(activeLaws().banStack && (type==='double'||type==='overload')){
    say('🌫️ THE EROSION — multiplication does not work here.','var(--grey)'); return; }
  /* This wrapper runs for ALL worlds and returns before charging the budget,
     so the refusals have to live here too — otherwise a sealed item still
     costs a world-6+ use. _forcePU is an auto-fired GUARDIAN, never refused. */
  if(!G._forcePU && G.activeEffects && G.activeEffects.some(e=>e.type==='playerEnergyLock')){
    say('⚡ Your skills are LOCKED!','var(--yellow)'); return; }
  if(!G._forcePU && window.SPX && SPX.isSealed(G,type)){
    say('🔒 '+((PU[type]||{}).name||type)+' is SEALED!','var(--grey)'); return; }
  /* Check stock BEFORE charging the budget — spending a use on an empty
     slot was free money for the world laws and confusing for the player. */
  if(type!=='revive' && !(G.inv[type]>0)) return;

  const b=W2.budget();
  const charged = b.cap!==Infinity && !BUDGET_EXEMPT.includes(type)
                  && !G._inGamble && !G._trainingMode;
  if(charged){
    if(b.spent>=b.cap){ say('— no uses left this battle.','var(--dim)'); return; }
    G._spent=(G._spent||0)+1; W2.renderBudget();
  }
  G._puThisQ=true; G._puThisBattle=true;

  /* The six new power-ups never reach dino.js's usePowerup, so the guards and
     the decrement it would have run have to happen here instead — without
     this they were all infinite-use. */
  if(W2.isNewPU(type)){
    G.inv[type]--;
    if(!W2.applyNewPU(type)) G.inv[type]++;
    inv(); W2.renderBudget();
    return;
  }

  if(type==='gamble') G._inGamble=true;
  G._erosionRefund=null;
  const r=o.apply(this,arguments);
  G._inGamble=false;
  /* Law X refused a multiplier: hand the item and the use back. */
  if(G._erosionRefund===type){
    G._erosionRefund=null;
    G.inv[type]=(G.inv[type]||0)+1;
    if(charged){ G._spent=Math.max(0,(G._spent||0)-1); W2.renderBudget(); }
    inv();
  }
  return r;
});


/* ─── §11 · END_REFUSALS ──────────────────────────────────────────────
   The refusals are prose, so they live in author.js (W2.COPY.endRefusals).
   This alias keeps the old read path working for anything that still asks
   W2 for them, and degrades to the generic line without author.js.       */
Object.defineProperty(W2,'END_REFUSALS',{get:()=>copy('endRefusals',{}),configurable:true});


/* ─── §12 · THE UNBROKEN PAGE (WORLD END L5) ──────────────────────── */
function immortalBar(on){
  const el=document.querySelector('#boss-f .hp-bar');
  if(el) el.classList.toggle('boss-bar-immortal',!!on);
}
W2.armUnbrokenPage = function(){
  G.bossMaxHP = G.bossHP = 9999999;
  G.bossImmortal = true;
  G._pages = 0; G._strikes = 0; G._authorshipMet = false; G._puThisQ = false;
  /* Hands the question feed to dino-q-end.js — 50 questions, every one
     tier:'hard'. Without this the page drew from the ordinary bank, where
     judgePage() breaks on anything below hard, so the END was unwinnable. */
  G._endGauntlet = true;
  if(G._endQUsed instanceof Set) G._endQUsed.clear(); else G._endQUsed = new Set();
  immortalBar(true);
  W2.renderPageHUD();
  say('🕯️ it is not going to fight you. write.','#fff');
};
W2.clampImmortal = function(){
  if(G && G.bossImmortal && !G._authorshipMet) G.bossHP = G.bossMaxHP;
};
wrap('updateBars', o=>function(){ W2.clampImmortal(); return o.apply(this,arguments); });

W2.onPageWritten = function(){
  G._pages=(G._pages||0)+1; W2.renderPageHUD();
  say('— page '+G._pages+'.','var(--dim)');
  if(G._pages>=PAGE_TARGET){ G._authorshipMet=true; return W2.realityChanges(); }
  G.animLock=false;
  if(typeof nextQ==='function') setTimeout(nextQ,900);
};
/* onAnswer hands control here and returns immediately, leaving animLock held.
   Whatever happens next MUST release it and queue the next question, or the
   battle freezes with no way out. */
const resumePage=()=>{
  G.animLock=false;
  if(G.playerHP>0 && typeof nextQ==='function') setTimeout(nextQ,700);
};
/* ── CHILL PARITY at THE UNWRITTEN ────────────────────────────────────────
   A page needs four things at once: correct, hard tier, more than half the
   clock left, and no power-up. In Chill the third cannot exist — correctAnswer
   hands judgePage a timeFrac of 1 — so the hardest of the four silently did not
   apply, and the final fight was a quarter easier for half the players with
   nothing anywhere saying so.

   The fix is not to fake a clock. Chill trades the clock for error tolerance:
   three conditions instead of four, but TWO strikes instead of three. And
   timeBonus, which buys seconds in Timed, buys the safety net earlier here —
   THE PEN arms three pages sooner per +1s, so Infinite Loop + Woven Fate arms
   it at 11 pages instead of 20. Same attributes, same fight, both modes. */
W2.strikeLimit = function(){ return (GG() && G.timedMode===false) ? 2 : 3; };
W2.penThreshold = function(){
  if(!GG() || G.timedMode!==false) return 20;          // Timed: timeBonus is seconds
  const tb=(typeof attrFX==='function' && G.attrsEquipped) ? (attrFX().timeBonus||0) : 0;
  return Math.max(8, 20 - tb*3);
};

W2.onPageBroken = function(reason){
  /* Two pens, and they used to be unconnected. The INVENTORY one comes from
     the single World END pick — 4 cards out of a pool of 14, so it reached
     stage 51 in under a third of runs, and it is in NO_RANDOM so nothing else
     can supply it. The REACTIVE one promised it "acts on its own" and then did
     nothing here at all.

     Now: spend the carried pen first if there is one, and otherwise fall
     through to the reactive pen, which every run has exactly once. Both still
     obey penThreshold, so a break before page 20 (Timed) costs a strike
     regardless — fifty consecutive pages with at most one late slip is still
     the bar. Picking THE PEN at the World END screen is now worth a second
     forgiveness rather than being the only way to have any. */
  if(G._pages>=W2.penThreshold()){
    if(G.inv&&G.inv.thepen>0){
      G.inv.thepen--; inv();
      say('✒️ THE PEN holds the page.','#fff');
      return resumePage(); }
    if(W2.reactiveTry('streakBreak')) return resumePage();
  }
  G._pages=0; G._strikes=(G._strikes||0)+1; W2.renderPageHUD();
  say('— '+reason+' the page is blank again.','var(--purple)');
  if(G._strikes>=W2.strikeLimit()){ immortalBar(false); G.animLock=false; G._endGauntlet=false;
    if(typeof endGame==='function') return endGame(false,'UNWRITTEN'); return; }
  if(typeof bossAttacks==='function') bossAttacks(resumePage);
  else resumePage();
};
W2.judgePage = function(correct,tier,timeFrac){
  if(!GG()||!G.bossImmortal||G._authorshipMet) return false;
  if(!correct)               W2.onPageBroken('wrong.');
  else if(tier!=='hard')     W2.onPageBroken('too easy.');
  else if(timeFrac<=0.5)     W2.onPageBroken('too slow.');
  else if(G._puThisQ)        W2.onPageBroken('you reached for something.');
  else                       W2.onPageWritten();
  G._puThisQ=false;
  return true;
};
W2.renderPageHUD = function(){
  const el=document.getElementById('w2-pages'); if(!el) return;
  if(!G||!G.bossImmortal){ el.style.display='none'; W2.syncHUD(); return; }
  el.style.display='block';
  /* the pen threshold and the strike limit both move in Chill — the HUD has to
     report the run's real numbers, not the Timed ones */
  const pen=(G.inv&&G.inv.thepen>0&&G._pages>=W2.penThreshold())?'READY':'—';
  el.innerHTML =
    '<div class="w2-pg-row"><span>PAGES WRITTEN</span><b>'+(G._pages||0)+' / —</b></div>'+
    '<div class="w2-pg-row"><span>STRIKES</span><b class="w2-str-'+(G._strikes||0)+'">'+(G._strikes||0)+' / '+W2.strikeLimit()+'</b></div>'+
    '<div class="w2-pg-row w2-pg-pen"><span>✒️ THE PEN</span><b>'+pen+'</b></div>';
  W2.syncHUD();
};
W2.realityChanges = function(){
  immortalBar(false);
  G._endGauntlet=false; G.animLock=false;
  W2.markA('authored'); W2.markA('sawTheEnd');
  /* The ETERNAL attribute is the reward for the END. si 50 L5 never reaches
     handleLevelWin (nothing to reduce to zero), so grant it here by hand. */
  if(typeof grantBossAttr==='function'){ try{ grantBossAttr(50); }catch(e){} }
  if(Array.isArray(G.levelsCleared)) G.levelsCleared[50]=5;
  say('— then it was not unwritten after all.','#fff');
  if(typeof endGame==='function') endGame(true,'AUTHORED');
};


/* ─── §13 · PERSISTENCE · THE AUTHOR LAYER ────────────────────────── */
const A_DEF={completed:false,authorSaid:null,asked:0,d1said:false,d2said:false,
             d3said:false,d4said:false,d5said:false,
             /* the five seams — see §13e. `completion` used to sit in this set
                by mistake; finishing world 5 is a progress flag (`completed`),
                not one of the five hidden mechanics the author narrates. */
             s_margin:false,s_devotion:false,s_patient:false,
             s_heldpage:false,s_thinline:false,
             gateOpen:false,tenDone:false,endRevealed:false,
             sawTheEnd:false,authored:false,snapshot:null};
W2.A = function(){ try{ return Object.assign({},A_DEF,
    JSON.parse(localStorage.getItem(AUTHOR_KEY)||'{}')); }catch(e){ return Object.assign({},A_DEF); } };
W2.markA = function(k,v){ const a=W2.A(); a[k]=(v===undefined?true:v);
  localStorage.setItem(AUTHOR_KEY,JSON.stringify(a)); return a; };

W2.maxWorldUnlocked = function(){
  const a=W2.A();
  if(a.endRevealed) return 11;
  if(a.gateOpen)    return 10;
  return 5;
};

/* ─── §13e · THE FIVE SEAMS · detection only ──────────────────────────
   Named exactly as the author narrates them in S1: "the empty hands. the
   wrong answers on purpose. the waiting. the page you wouldn't put down.
   and the one you won by a thread."
     margin   — replay a cleared L5 in worlds 1-5, spend no power-ups  (dino.js)
     devotion — 3 wrong answers in a row while at ≥95% HP              (dino.js)
     patient  — let the timer run out 3× in one battle                 (§9 onTimeout)
     heldpage — hold the map topbar or the ??? orb for 10 seconds      (§13i)
     thinline — win any level at ≤5% HP                                (dino.js)
   What each one SAYS when found belongs to author.js (COPY.secretLines). */
W2.SECRETS = ['margin','devotion','patient','heldpage','thinline'];
W2.secretCount=function(){ const a=W2.A();
  return W2.SECRETS.filter(k=>a['s_'+k]).length; };
W2.foundCount = W2.secretCount;

W2.onStageClear=function(si,li){
  window.dispatchEvent(new CustomEvent('w2:stageclear',{detail:{si,li}}));
};

W2.findSecret=function(key){
  if(!W2.SECRETS.includes(key)) return false;
  const a=W2.A();
  /* the seams do not exist until the printed book is finished: before World 5
     is complete none can trigger, and author.js draws no marks for them */
  if(!a.completed) return false;
  if(a['s_'+key]) return false;
  W2.markA('s_'+key);
  say(copy('secretLines',{})[key]||'— …','#fff');
  W2.renderSerifs();
  const n=W2.secretCount();
  console.log('%c [w2] seam found: '+key+' ('+n+'/5) ','background:#0a0a0a;color:#e8c458');
  window.dispatchEvent(new CustomEvent('w2:secret',{detail:{key,count:n}}));
  if(n>=5 && !a.gateOpen)
    setTimeout(()=>window.dispatchEvent(new CustomEvent('w2:allsecrets')),1000);
  return true;
};

/* ─── §13g · MAP · the unprinted worlds ───────────────────────────────
   Grows WORLD_META from 5 to 10. It never adds an entry for WORLD END: the
   trailing "soon" slide dino-world.js always appends IS the END slide
   (buildEndSlide below), and pushing id:11 as well drew the END twice.
   Any argument is accepted and ignored, for old callers. Safe to re-run —
   author.js re-runs it after load to apply its world names.            */
W2.registerWorlds=function(){
  if(typeof WORLD_META==='undefined') return;
  const names=copy('worldNames',{});
  [6,7,8,9,10].forEach(id=>{
    const name=names[id]||('WORLD '+id);
    const m=WORLD_META.find(x=>x.id===id);
    if(m) m.name=name; else WORLD_META.push({id,cls:'wl-'+id,name});
  });
  for(let i=WORLD_META.length-1;i>=0;i--) if(WORLD_META[i].id===11) WORLD_META.splice(i,1);
  WORLD_META.sort((x,y)=>x.id-y.id);
  if(typeof WORLD_COUNT!=='undefined') WORLD_COUNT=WORLD_META.length;
  if(typeof TOTAL_SLIDES!=='undefined') TOTAL_SLIDES=WORLD_META.length+1;
  document.body.classList.add('w2-gate-open');
};

/* CAPS. Worlds 1-5 are balanced against hpMax 36000 / atkMax 16000, and the
   grants past the margin are orders of magnitude larger — at the old caps
   every one was silently discarded, so worlds 6-10 had no visible growth.
   Raise the caps for a run that has crossed into world 6; lower them only
   for a run that never has (its stats were earned under the base caps, so
   lowering cannot clip anything). Runs on every capPlayerStats (§9).     */
/* ─────────────────────────────────────────────────────────────────────────
   CAPS PAST THE MARGIN

   Measured across a full 51-stage run, the attribute curve grants — unclamped —
   HP 6,641,995 · ATK 1,074,368 · RES 20,727. The caps kept only

       HP  1,500,000  (23%)   frozen from World 10 stage 1
       ATK   660,000  (61%)   frozen from Omega Point
       RES         300  (1.4%) frozen from WORLD 3

   RES is the one that mattered. `syncCaps` raised hpMax and atkMax for the
   margin and never touched resMax, so a stat the margin grants 20,000 of was
   still capped at the base game's 300 — mitigation pinned at 62.5% from World
   3 to THE UNWRITTEN, twenty-eight stages.

   And it is the only defence there is. `enemyAtkFor` sets a hit at a
   PERCENTAGE of your max HP, multiplied by a creep of 1 + li*0.05 +
   (world-1)*0.08 — which reaches 2.0x at World 11. So more max HP buys
   nothing (the hit grows with it) and mitigation is the whole of your
   defensive scaling. Frozen mitigation against doubling creep is the
   difficulty cliff, not the enemy HP pools.

   resMax 540 is not arbitrary: `resMitigation` is min(resCurve, res/(res+180)),
   so 540 is exactly the RES that reaches the resCurve of 0.75 the config has
   always asked for and never once delivered.
   ───────────────────────────────────────────────────────────────────────── */
const BASE_CAPS = (typeof CAPS!=='undefined')
  ? {hpMax:CAPS.hpMax, atkMax:CAPS.atkMax, resMax:CAPS.resMax} : null;
const BEYOND_CAPS = {
  hpMax : 6700000,   // where the curve actually lands by stage 51
  atkMax: 1100000,   // ditto — it used to cap two stages early
  resMax: 540,       // reaches resCurve 0.75 exactly; base game keeps 300
};
W2.BASE_CAPS=BASE_CAPS; W2.BEYOND_CAPS=BEYOND_CAPS;
W2.isBeyondRun=function(){
  const g=GG(); if(!g) return false;
  const lc=Array.isArray(g.levelsCleared)?g.levelsCleared:[];
  return (g.curStage|0)>=25 || lc.slice(25).some(n=>n>0) || !!g._trainingMode;
};
W2.syncCaps=function(){
  if(!BASE_CAPS || typeof CAPS==='undefined') return false;
  const beyond=W2.isBeyondRun(), want=beyond?BEYOND_CAPS:BASE_CAPS;
  CAPS.hpMax=want.hpMax; CAPS.atkMax=want.atkMax;
  /* resMax was missing here — that one omission is what froze RES */
  if(want.resMax!=null)CAPS.resMax=want.resMax;
  return beyond;
};
/* The last slide has four states, each a fact about the flags:
     locked — world 5 not finished yet
     margin — world 5 finished; the gate not yet opened (the seams)
     gap    — worlds 6-10 open; the END not yet revealed (the letter)
     open   — the END revealed
   The words on it are author.js's (COPY.endSlide); these are bare labels. */
const END_SLIDE_FALLBACK={
  locked:{cls:'wl-soon',label:'WORLD 6 &nbsp;???',orb:'🔒',orbCls:'',title:'COMING SOON',sub:'Finish WORLD 5.'},
  margin:{cls:'wl-soon',label:'???',orb:'🕯️',orbCls:'w2-door-orb',title:'???',sub:''},
  gap:   {cls:'wl-soon',label:'???',orb:'🕯️',orbCls:'w2-door-orb',title:'???',sub:''},
  open:  {cls:'wl-11',label:'WORLD END',orb:'🕯️',orbCls:'w2-door-orb w2-door-open',title:'THE UNWRITTEN',sub:''}
};
W2.endSlideState=function(){
  const a=W2.A();
  return a.endRevealed?'open':a.gateOpen?'gap':a.completed?'margin':'locked';
};
W2.buildEndSlide=function(soon){
  const state=W2.endSlideState();
  const s=Object.assign({},END_SLIDE_FALLBACK[state],(copy('endSlide',{})||{})[state]);
  soon.innerHTML=`<div class="world-label ${s.cls}">${s.label}</div>
    <div class="soon-wrap">
      <div class="soon-orb ${s.orbCls}">${s.orb}</div>
      <div class="soon-title">${s.title}</div>
      <div class="soon-sub">${s.sub}</div>
    </div>`;
  if(state==='locked') return;
  const orb=soon.querySelector('.soon-orb');
  orb.style.cursor='pointer';
  W2.bindHold(orb);                         // the HELD PAGE seam, second site
  orb.addEventListener('click',()=>{
    if(W2._holdJustFired) return;           // a finished hold is not also a tap
    if(GG()&&G.inBattle) return;
    const a=W2.A();
    /* re-ask from the orb, so answering NOT YET is never a dead end */
    if(!a.gateOpen)    return window.dispatchEvent(new CustomEvent('w2:reask',{detail:{which:'gate'}}));
    if(!a.endRevealed) return window.dispatchEvent(new CustomEvent('w2:reask',{detail:{which:'end'}}));
    W2.enterEnd();
  });
};
W2.canBrowse=function(si){
  const a=W2.A(), g=GG();
  if(!g||!a.completed||!Array.isArray(g.levelsCleared)) return false;
  return (g.levelsCleared[si]||0)>=5;
};
/* a live, saveable run that has cleared world 5 and can walk into world 6 */
W2.liveBeyond=function(){
  const g=GG();
  return !!(g&&g.diff&&!g.viewOnly&&!g.isPractice&&Array.isArray(g.levelsCleared)
            &&(g.levelsCleared[24]||0)>=5);
};
W2.enterEnd=function(){
  if(GG()&&G.inBattle) return;
  /* viewing the completed map, or no run past world 5: revive one first and
     land on this slide — the next tap walks in */
  if(!W2.liveBeyond()){ W2.beginBeyond({toEnd:true}); return; }
  if((G.levelsCleared[49]||0)<5){ say(copy('endNotYet','— world 10 first.'),'var(--dim)'); return; }
  if(typeof enterLevel==='function') enterLevel(50,Math.min(4,G.levelsCleared[50]||0));
};

/* ─── §13h · THE LETTER BACK · the END trigger ────────────────────────
   Once world 10 is done, the syllabus paste box stops parsing and starts
   listening. WHAT it listens for is author.js's (COPY.letterWords); with no
   author layer the list is empty and the box behaves normally.          */
Object.defineProperty(W2,'LETTER_WORDS',{get:()=>copy('letterWords',[]),configurable:true});

wrap('submitPastedText', o=>function(){
  const a=W2.A(), words=copy('letterWords',[]);
  if(words.length && a.gateOpen && a.tenDone && !a.endRevealed){
    const ta=document.getElementById('syl-paste-area');
    const txt=(ta&&ta.value||'').toLowerCase().trim();
    if(txt && words.some(w=>txt.includes(w))){
      ta.value='';
      window.dispatchEvent(new CustomEvent('w2:weird',{detail:{text:txt}})); return;
    }
    if(txt){
      W2._inkMiss=(W2._inkMiss||0)+1;
      const ink=copy('ink',{});
      say((W2._inkMiss>=3?ink.hint:ink.miss)||'—','var(--dim)');
      return;
    }
  }
  return o.apply(this,arguments);
});

/* ─── §13i · THE HELD PAGE · a 10-second hold ─────────────────────────
   The rule is "hold the map topbar (or the ??? orb) for 10 seconds". It was
   bound to .game-title — the TITLE screen — so neither place the author
   points at ever answered. The serifs brighten across the ten seconds
   (#w2-serifs.w2-holding) so the player can feel it working.            */
const HOLD_MS=10000;
W2.bindHold=function(el){
  if(!el||el._w2hold) return;
  el._w2hold=true;
  let t=null;
  const serifs=()=>document.getElementById('w2-serifs');
  const stop=()=>{
    clearTimeout(t); t=null;
    el.classList.remove('w2-holding');
    const s=serifs(); if(s) s.classList.remove('w2-holding');
  };
  el.addEventListener('pointerdown',e=>{
    const a=W2.A();
    if(!a.completed || a.s_heldpage || (e.pointerType==='mouse'&&e.button!==0)) return;
    stop();
    el.classList.add('w2-holding');
    const s=serifs();
    if(s){ s.classList.remove('w2-holding'); void s.offsetWidth; s.classList.add('w2-holding'); }
    t=setTimeout(()=>{
      stop();
      W2._holdJustFired=true; setTimeout(()=>{ W2._holdJustFired=false; },600);
      W2.findSecret('heldpage');
    },HOLD_MS);
  });
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,stop));
};
/* the topbar is static markup; the ??? orb is rebuilt with every map, so
   buildEndSlide binds that one itself */
W2.installHeldPage=function(){
  W2.bindHold(document.querySelector('#s-map .map-topbar'));
};


/* ─── §13l · BEYOND THE MARGIN · carrying a run across the ending ─────
   Clearing world 5 is GAME COMPLETE: endGame() banks the score and wipes the
   save, exactly as the printed book should. So just before that, the run
   that earned the gate is parked in W2.A().snapshot, and beginBeyond()
   revives it at world 6 if the player finds all five seams and says yes. */
W2.saveBeyondSnapshot=function(){
  const g=GG(); if(!g||!g.diff||g.isPractice) return false;
  const q=g.qUsed||{}, arr=v=>v instanceof Set?[...v]:(Array.isArray(v)?v.slice():[]);
  W2.markA('snapshot',{
    diff:g.diff, timedMode:g.timedMode!==false, score:g.score||0,
    pHP:g.pHP||0, pATK:g.pATK||0, pRES:g.pRES||0,
    /* never carry a battle-only Max-HP loss into the gate snapshot */
    hpPenalty:Math.max(0,(g.hpPenalty||0)-(g._battlePenalty||0)),
    inv:Object.assign({},g.inv), loadout:(g.loadout||[]).slice(),
    attrsOwned:(g.attrsOwned||[]).slice(), attrsEquipped:(g.attrsEquipped||[]).slice(),
    worldPicksDone:Object.assign({},g.worldPicksDone),
    stagesCleared:Math.max(25,g.stagesCleared||0),
    qUsed:{easy:arr(q.easy),medium:arr(q.medium),hard:arr(q.hard)},
    date:Date.now()
  });
  return true;
};
/* merge the snapshot's earnings into whatever G currently is */
W2.seedBeyondRun=function(){
  const s=W2.A().snapshot, g=GG(); if(!s||!g) return false;
  ['timedMode','score','pHP','pATK','pRES','hpPenalty','loadout',
   'attrsOwned','attrsEquipped','worldPicksDone','stagesCleared']
    .forEach(k=>{ if(s[k]!==undefined) g[k]=JSON.parse(JSON.stringify(s[k])); });
  g.inv=g.inv||{};
  Object.keys(s.inv||{}).forEach(k=>{ g.inv[k]=s.inv[k]; });
  const sq=s.qUsed||{};
  g.qUsed={easy:new Set(sq.easy||[]),medium:new Set(sq.medium||[]),hard:new Set(sq.hard||[])};
  return true;
};
W2.beginBeyond=function(opts){
  opts=opts||{};
  if(typeof STAGES==='undefined'||STAGES.length<51) return false;
  if(!W2.liveBeyond()){
    if(typeof freshState!=='function') return false;
    const s=W2.A().snapshot;
    G=freshState((s&&s.diff)||'medium');     // the global `let G` from dino.js
    if(typeof syncG==='function') syncG();
    for(let i=0;i<25;i++) G.levelsCleared[i]=5;
    if(s) W2.seedBeyondRun();
    else{
      /* no snapshot (flags set from the console): rebuild what a run would
         hold after world 5, and give it something to fight with */
      if(typeof computeProgressStats==='function') Object.assign(G,computeProgressStats(25,0));
      G.loadout=Object.keys(PU).filter(t=>!W2.isNewPU(t)&&t!=='revive');
      G.loadout.forEach(t=>{ G.inv[t]=3; });
      G.worldPicksDone={w2:true,w3:true,w4:true,w5:true};
    }
  }
  if(!(G.qUsed&&G.qUsed.easy instanceof Set))
    G.qUsed={easy:new Set(),medium:new Set(),hard:new Set()};
  G.pickDone=true; G.viewOnly=false; G.isPractice=false; G.isSyllabusRun=false;
  if((G.curStage|0)<25){ G.curStage=25; G.curLevel=0; }
  G.inBattle=false; G.animLock=false;
  if(typeof capPlayerStats==='function') capPlayerStats();   // raises the caps (§13g)
  G.playerHP=G.playerMaxHP;
  W2.registerWorlds();
  if(typeof saveGame==='function') saveGame();
  if(typeof show==='function') show('s-map');
  if(typeof buildMap==='function') buildMap();
  if(typeof goToWorld==='function') goToWorld(opts.toEnd?W2.endSlideIndex():5);
  return true;
};
/* beginBeyond overwrites the single save slot when it has to revive the
   finished run, so ask first if a different run is saved. author.js
   replaces this with an in-world question; this is the plain fallback. */
W2.requestBeyond=function(opts){
  const clobbers=!W2.liveBeyond() && typeof hasSave==='function' && hasSave();
  if(clobbers && !window.confirm('Continuing past World 5 replaces your saved run in progress. Continue?'))
    return false;
  return W2.beginBeyond(opts);
};

/* ─── §13j · HUD HOOKS the author layer fills in ─────────────────────
   The seam indicator ("N/5 hidden mechanics") and the one-line toast are
   presentation, so author.js implements them. These no-ops keep every call
   site in this file safe when author.js is not loaded.                   */
W2.renderSerifs = function(){};
W2.toast        = function(){};
W2.clearToast   = function(){};


/* ─── §13k · PUBLIC API · read by author.js and the AUTHOR console ─── */
W2.installed = function(){ return W2.patches; };

/* Unbroken Page counter — readable/settable even outside WORLD END */
W2.pages = function(){ return (GG() && G._pages) || 0; };
W2.addPages = function(n){
  const g=GG(); if(!g) return 0;
  g._pages = Math.max(0,(g._pages||0)+(n||0));
  W2.renderPageHUD();
  return g._pages;
};

/* inverse of markA — clears one flag, used by AUTHOR.unfind(k) */
W2.unmarkA = function(k){
  const a=W2.A(); delete a[k];
  localStorage.setItem(AUTHOR_KEY,JSON.stringify(a));
  return a;
};

/* wipe every story flag (kept separate from the actual game save) */
W2.reset = function(){
  try{ localStorage.removeItem(AUTHOR_KEY); }catch(e){}
  return true;
};

/* map-slide helpers. Slide index WORLD_COUNT (10 once the gate is open) is
   the END slide — the trailing slide dino-world.js appends. */
W2.slides    = function(){ return (typeof WORLD_META!=='undefined'?WORLD_META.length:0)+1; };
W2.endSlideIndex = function(){ return (typeof WORLD_META!=='undefined'?WORLD_META.length:5); };
W2.tookSlider= function(){ return false; }; /* dino-world.js owns the slider; this file never replaces it */
W2.slide     = function(n){ if(typeof goToWorld==='function') goToWorld(n); };
W2.repairMap = function(){ if(typeof buildMap==='function') buildMap(); };

W2.WORLD_LAWS = WORLD_LAWS;
W2.LAW_NAME   = LAW_NAME;

/* STAGES/WORLD_META/CAPS are top-level `const` in dino-world.js/dino.js:
   visible as bare identifiers to every script, but not as window.X.
   Mirror them for the console and for author.js. (G is mirrored by
   dino.js itself — see syncG.) */
if(typeof STAGES!=='undefined')    window.STAGES=STAGES;
if(typeof WORLD_META!=='undefined')window.WORLD_META=WORLD_META;
if(typeof CAPS!=='undefined')      window.CAPS=CAPS;

/* train() — "training mode": full stats + every boss attribute owned,
   regardless of which world/stage you're actually on. Bootstraps a
   run via startGame() if none exists, so it's safe from the console
   even at the title screen. Non-destructive: only ever raises stats. */
W2.train = function(){
  if(!(GG()&&G.diff) && typeof startGame==='function'){ try{ startGame('medium'); }catch(e){} }
  const g=GG();
  if(!g||!g.diff) return 'no active run — open/start a run first, then call W2.train() (or AUTHOR.crack())';
  if(!Array.isArray(G.levelsCleared)) G.levelsCleared=[];
  if(G.levelsCleared.length<STAGES.length)
    for(let i=G.levelsCleared.length;i<STAGES.length;i++) G.levelsCleared[i]=0;
  if(typeof G.curStage!=='number') G.curStage=0;
  if(typeof G.curLevel!=='number') G.curLevel=0;
  G._trainingMode=true;                     // before capPlayerStats: it raises the caps
  G.pHP=Math.max(G.pHP||0,1200000); G.pATK=Math.max(G.pATK||0,24000); G.pRES=Math.max(G.pRES||0,300);
  G.hpPenalty=0;
  if(typeof capPlayerStats==='function') capPlayerStats();
  G.playerHP=G.playerMaxHP;
  if(typeof BOSS_ATTRS!=='undefined'){
    G.attrsOwned=G.attrsOwned||[];
    BOSS_ATTRS.forEach(a=>{ if(!G.attrsOwned.includes(a.id)) G.attrsOwned.push(a.id); });
  }
  G._trainingMode=true;
  bars();
  if(typeof buildMap==='function') buildMap();
  return 'training mode: full stats + every boss attribute owned, budget uncapped';
};

/* crack() — "AUTHOR.crack()" from the console: open every story gate
   AND drop into training mode, no matter what world/stage you're on. */
W2.crack = function(){
  W2.SECRETS.forEach(k=>W2.markA('s_'+k));
  ['completed','gateOpen','tenDone','endRevealed'].forEach(k=>W2.markA(k));
  W2.registerWorlds();
  W2.renderSerifs();
  return W2.train();
};


/* ─── §14 · AMBIENT BACKGROUNDS (worlds 6-11 only) ────────────────── */
const AMBIENT={
 6 :{kind:'fray',    density:34,color:'#b06aff',alpha:.30},
 7 :{kind:'dust',    density:26,color:'#00c8b4',alpha:.22},
 8 :{kind:'grid',    density:0, color:'#c89a3a',alpha:.14},
 9 :{kind:'pressure',density:20,color:'#3a8ad0',alpha:.26},
 10:{kind:'ember',   density:30,color:'#ffb000',alpha:.34},
 11:{kind:'room',    density:0, color:'#ffd9a0',alpha:1.0}
};
W2.ambientFor = si=>{ const w=((STAGES||[])[si]||{}).world||1; return w>=6?AMBIENT[w]:null; };

W2.drawAmbient = function(ctx,W,H,t,si){
  const c=W2.ambientFor(si); if(!c) return;
  if(window.FX && FX.particles && FX.particles.length>60) return;
  if(c.kind==='room') return W2.drawRoom(ctx,W,H,t);
  ctx.save(); ctx.globalAlpha=c.alpha; ctx.strokeStyle=c.color; ctx.fillStyle=c.color;
  for(let i=0;i<c.density;i++){
    const s=i*73.13, x=(s*7)%W;
    if(c.kind==='fray'){ const y=((t*22+s*11)%(H+60))-30, len=10+((s*3)%14);
      ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x,y);
      ctx.lineTo(x+Math.sin(t*3+i)*2.4,y+len); ctx.stroke(); }
    else if(c.kind==='dust'){ const y=((s*13)+Math.sin(t+i)*18)%H;
      ctx.beginPath(); ctx.arc(x,y,1.2,0,6.284); ctx.fill(); }
    else if(c.kind==='pressure'){ const y=H-((t*30+s*17)%(H+40));
      ctx.beginPath(); ctx.arc(x,y,1+((s*2)%3),0,6.284); ctx.stroke(); }
    else if(c.kind==='ember'){ const y=H-((t*46+s*19)%(H+50));
      ctx.globalAlpha=c.alpha*(y/H); ctx.beginPath(); ctx.arc(x,y,1.4,0,6.284); ctx.fill(); }
  }
  if(c.kind==='grid'){ ctx.lineWidth=1;
    for(let y=0;y<H;y+=18){ const flare=Math.sin(t*2+y*.08)>0.985;
      ctx.globalAlpha=flare?c.alpha*4:c.alpha;
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); } }
  ctx.restore();
};
W2.drawRoom = function(ctx,W,H,t){
  const pages=(typeof G!=='undefined'&&G&&G._pages)||0;
  const p=Math.min(1,pages/PAGE_TARGET);
  const flick=0.86+Math.sin(t*7.3)*0.07+Math.sin(t*19.1)*0.04;
  const g=ctx.createRadialGradient(W/2,H*.42,0,W/2,H*.42,(60+p*140)*flick);
  g.addColorStop(0,'rgba(255,217,160,'+(0.22+p*0.30)+')');
  g.addColorStop(1,'rgba(255,217,160,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(40,32,26,'+(0.5+p*0.4)+')'; ctx.fillRect(0,H*.62,W,H*.38);
  const px=W/2-70, py=H*.52, pw=140, ph=90;
  ctx.fillStyle='rgba(232,228,214,'+(0.30+p*0.55)+')'; ctx.fillRect(px,py,pw,ph);
  const lines=Math.floor(pages/2);
  ctx.fillStyle='rgba(20,16,12,0.72)';
  for(let i=0;i<lines;i++) ctx.fillRect(px+7,py+6+i*3.3,pw-14-((i*37)%22),1.4);
};

/* ─── §16 · BOOT ──────────────────────────────────────────────────── */
wrap('startBattleBgLoop', o=>function(canvas,si){
  const prev=canvas._bgRAF;
  const r=o.apply(this,arguments);
  try{
    if(W2.ambientFor(si)){
      cancelAnimationFrame(canvas._bgRAF);
      const ctx=canvas.getContext('2d'), session=_battleSession;
      function w2loop(){
        if(session!==_battleSession||!canvas.isConnected) return;
        if(typeof SceneFX!=='undefined') SceneFX.render(ctx,canvas,'battle',si);
        W2.drawAmbient(ctx,canvas.width,canvas.height,performance.now()/1000,si);
        canvas._bgRAF=requestAnimationFrame(w2loop);
      }
      w2loop();
    }
  }catch(e){ W2.patches['ambient']='ERROR '+e.message; }
  return r;
});
/* Rebuild the unprinted worlds from the saved flags. Without this a reload
   with the gate already open dropped WORLD_META back to five, and worlds
   6-10 vanished from the map while maxWorldUnlocked() still said 10. */
if(W2.A().gateOpen) W2.registerWorlds();
W2.installHeldPage();

console.log('%c dino-world2 v'+W2.ver+' ','background:#0a0a0a;color:#ffd9a0',
            '· '+(typeof STAGES!=='undefined'?STAGES.length:'?')+' stages · 5 seams');
})();