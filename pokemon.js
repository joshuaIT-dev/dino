/* ═══════════════════════════════════════════════════════════════════════
   TYPE BATTLE · BETA                                     pokemon.js
   ═══════════════════════════════════════════════════════════════════════

   A second mode over worlds 1-5. Same stages, same question bank, same
   academics. What is new is that YOU have an element, and the twelve the
   enemies already carry (ELEM_BY_STAGE in dino-world.js) finally mean
   something.

   Design, as chosen:
     · super-effective x2.5, resisted x0.4, nothing immune
     · one chart, applied in BOTH directions
     · swap element freely between stages
     · a super-effective hit lands that element's status

   This file loads last and patches at runtime, the way dino-world2.js does.
   Every hook returns early unless `PKMN.on()`, and the mode writes to its own
   save key, so a normal run cannot be touched by anything in here. Delete the
   two script/link tags and the game is byte-for-byte what it was.

   THE ONE ORDERING RULE: the enemy's multiplier is applied to bossAtkMin /
   bossAtkMax at level load, NOT to the damage roll. bossAttacks clamps each
   hit with HIT_CAP (18-30% of the player's max HP) and that clamp has to stay
   the last word — x2.5 applied after it is 75% of the bar in a single hit, and
   two wrong answers kill you from full.
   ══════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

const PKMN = window.PKMN = {};
const SAVE_KEY = 'dqb3_type_save';
PKMN.VER = '0.1-beta';

/* ── the roster ─────────────────────────────────────────────────────────
   One character per element. The art is a box on purpose — see pokemon.css.
   `beats` is the whole chart: the resisted direction is its exact mirror. */
const ROSTER = [
  { el:'fire',     name:'EMBERPUP',  glyph:'🔥', beats:['nature','ice'] },
  { el:'water',    name:'TIDEFIN',   glyph:'🌊', beats:['fire','earth'] },
  { el:'nature',   name:'THORNKIT',  glyph:'🌿', beats:['water','earth'] },
  { el:'earth',    name:'CRAGLING',  glyph:'🪨', beats:['electric','poison'] },
  { el:'electric', name:'VOLTAIL',   glyph:'⚡', beats:['water','void'] },
  { el:'ice',      name:'FROSTNIP',  glyph:'❄',  beats:['nature','time'] },
  { el:'poison',   name:'MIREFANG',  glyph:'☠',  beats:['nature','light'] },
  { el:'shadow',   name:'DUSKMOTE',  glyph:'🌑', beats:['time','chaos'] },
  { el:'light',    name:'LUMENCUB',  glyph:'☀',  beats:['shadow','void'] },
  { el:'void',     name:'NULLEYE',   glyph:'👁',  beats:['time','chaos'] },
  { el:'time',     name:'TICKTOCK',  glyph:'⏳', beats:['chaos','electric'] },
  { el:'chaos',    name:'SNARLWISP', glyph:'🌀', beats:['poison','light'] },
];
PKMN.ROSTER = ROSTER;
const BY_EL = {}; ROSTER.forEach(r => BY_EL[r.el] = r);
PKMN.BY_EL = BY_EL;

const SUPER = 2.5, RESIST = 0.4;
PKMN.SUPER = SUPER; PKMN.RESIST = RESIST;

/* what a super-effective hit of each element leaves behind. Every one of
   these already exists on the enemy side; `res` is the key in
   STAGES[si].res that can make a given enemy immune to it. */
const INFLICT = {
  fire    :{ fx:'bossBurn',   res:'burn',     turns:3, hpPerTurn:7, label:'BURNED'    },
  nature  :{ fx:'bossPoison', res:'poison',   turns:3, hpPerTurn:6, label:'POISONED'  },
  poison  :{ fx:'bossPoison', res:'poison',   turns:3, hpPerTurn:8, label:'POISONED'  },
  ice     :{ fx:'freeze',     res:'freeze',   turns:1,              label:'FROZEN'    },
  water   :{ fx:'freeze',     res:'freeze',   turns:1,              label:'FROZEN'    },
  electric:{ fx:'paralyze',   res:'paralyze', turns:1,              label:'PARALYZED' },
  light   :{ fx:'paralyze',   res:'paralyze', turns:1,              label:'DAZZLED'   },
  earth   :{ fx:'stun',       res:'stun',     turns:1,              label:'STUNNED'   },
  time    :{ fx:'stun',       res:'stun',     turns:1,              label:'STOPPED'   },
  shadow  :{ fx:'stun',       res:'stun',     turns:1,              label:'STUNNED'   },
  void    :{ fx:'stun',       res:'stun',     turns:1,              label:'UNMADE'    },
};
const INFLICT_CHANCE = 0.45;
const CHAOS_POOL = ['fire','poison','ice','electric','earth'];

const COL = {
  nature:'#57c06b', earth:'#b08a4a', water:'#3a8ee0',  fire:'#ef6b3a',
  ice:'#67d6e8',    poison:'#a563d8', electric:'#f2cb3c', shadow:'#6b5b96',
  void:'#8f4fd0',   light:'#ffe08a',  time:'#4fd0c0',  chaos:'#ff5c8a',
};
PKMN.COL = COL;

/* ── the chart ──────────────────────────────────────────────────────── */
PKMN.mult = function(attacker, defender){
  if(!attacker || !defender) return 1;
  if(attacker === defender) return 1;
  const a = BY_EL[attacker], d = BY_EL[defender];
  if(!a || !d) return 1;
  if(a.beats.includes(defender)) return SUPER;
  if(d.beats.includes(attacker)) return RESIST;
  return 1;
};
/* chaos re-rolls its own profile every level in the base game (ELEM_FX has
   `random:true` on it); its matchup follows suit rather than being a special
   case bolted on the side */
PKMN.stageElem = function(si){
  const st = (typeof STAGES !== 'undefined' && STAGES[si]) || null;
  if(!st) return null;
  if(st.elem === 'chaos' && window.G && G._pkChaosRoll) return G._pkChaosRoll;
  return st.elem || null;
};
PKMN.on = function(){ return !!(window.G && G.mode === 'type'); };
const on = PKMN.on;

/* the live matchup, both ways */
PKMN.live = function(){
  if(!on() || !window.G) return null;
  const mine = G.playerElem, theirs = PKMN.stageElem(G.curStage);
  if(!mine || !theirs) return null;
  return { mine, theirs, out: PKMN.mult(mine, theirs), in: PKMN.mult(theirs, mine) };
};

/* ── the box ────────────────────────────────────────────────────────── */
function boxHTML(el, boss){
  const r = BY_EL[el] || ROSTER[0];
  return '<div class="pk-box'+(boss?' pk-boss':'')+'" style="--c:'+COL[el]+'"'+
         ' title="'+r.name+' · '+el.toUpperCase()+'"><span>'+r.glyph+'</span></div>';
}
PKMN.boxHTML = boxHTML;

/* ── wrapping ───────────────────────────────────────────────────────── */
function wrap(name, make){
  const real = window[name];
  if(typeof real !== 'function'){ console.warn('[pkmn] no '+name+' to wrap'); return; }
  window[name] = make(real);
}

/* 1 · YOUR damage. attrFX is the engine's documented combat hook: every
   modifier reads it and correctAnswer applies atkMult with the rest of the
   multipliers, before the floor. Nothing else needs touching. */
wrap('attrFX', real => function(){
  const f = real.apply(this, arguments);
  if(on() && f && typeof f.atkMult === 'number'){
    const m = PKMN.live();
    if(m) f.atkMult *= m.out;
  }
  return f;
});

/* 2 · THEIR damage — scaled at the source, so HIT_CAP still has the last
   word (see the ordering rule at the top of this file). Also where the
   sprites, the chaos roll and the chip are set for the level. */
wrap('loadLevel', real => function(si, li){
  if(on() && typeof STAGES !== 'undefined' && STAGES[si] && STAGES[si].elem === 'chaos')
    G._pkChaosRoll = CHAOS_POOL[Math.floor(Math.random()*CHAOS_POOL.length)];
  const out = real.apply(this, arguments);
  if(!on() || !window.G) return out;
  const m = PKMN.live();
  if(m && m.in !== 1){
    G.bossAtkMin = Math.max(1, Math.round(G.bossAtkMin * m.in));
    G.bossAtkMax = Math.max(G.bossAtkMin, Math.round(G.bossAtkMax * m.in));
  }
  paintFighters();
  paintChip();
  return out;
});

/* 3 · the status a super-effective hit leaves. onAnswer is the one entry
   point for a player's answer, so the result is read from what it did rather
   than from a copy of the damage maths. */
wrap('onAnswer', real => function(choice, btn, idx){
  if(!on()) return real.apply(this, arguments);
  const want = (G.currentQ && G.currentQ.a);
  const hpBefore = G.bossHP;
  const out = real.apply(this, arguments);
  try{
    if(choice === want && G.bossHP < hpBefore) superEffect();
  }catch(e){}
  return out;
});

function superEffect(){
  const m = PKMN.live();
  if(!m || m.out <= 1) return;
  if(G.bossHP <= 0) return;                    // it is already dead
  if(Math.random() > INFLICT_CHANCE) return;
  let el = m.mine;
  if(el === 'chaos') el = CHAOS_POOL[Math.floor(Math.random()*CHAOS_POOL.length)];
  const spec = INFLICT[el];
  if(!spec || typeof addOrStackEffect !== 'function') return;
  /* an enemy the base game says is immune stays immune — the mode adds a
     reason to inflict a status, it does not overrule who can take one */
  const res = ((STAGES[G.curStage] || {}).res) || {};
  if(res[spec.res] === 0) return;
  if(G.activeEffects && G.activeEffects.some(e => e.type === spec.fx)) return;
  const extra = { turns: spec.turns };
  if(spec.hpPerTurn) extra.hpPerTurn = spec.hpPerTurn;
  addOrStackEffect(spec.fx, extra);
  if(typeof renderEffects === 'function') renderEffects();
  if(typeof spawnFloat === 'function')
    spawnFloat((BY_EL[el] || {}).glyph + ' ' + spec.label, 'var(--green)', true);
  if(typeof setMsg === 'function')
    setMsg('SUPER EFFECTIVE — ' + spec.label + '!', 'var(--green)');
}

/* 4 · the scene. A flat arcade horizon in the enemy's colour, drawn to the
   canvas the battle already owns. The base game's scene engine stays exactly
   where it is; this only stands in front of it while the mode is running. */
wrap('drawBattleBg', real => function(canvas, si){
  if(!on() || !canvas) return real.apply(this, arguments);
  try{ retroScene(canvas, si); }catch(e){ return real.apply(this, arguments); }
});

function retroScene(canvas, si){
  const el = PKMN.stageElem(si) || 'nature';
  const c = COL[el] || '#57c06b';
  const w = canvas.width  = canvas.clientWidth  || canvas.width  || 400;
  const h = canvas.height = canvas.clientHeight || canvas.height || 260;
  const x = canvas.getContext('2d');
  if(!x) return;
  const horizon = Math.round(h * 0.60);

  /* sky: two flat bands, no gradient — this is the look, not a shortcut */
  x.fillStyle = shade(c, -0.72); x.fillRect(0, 0, w, horizon);
  x.fillStyle = shade(c, -0.60); x.fillRect(0, Math.round(h*0.30), w, horizon - Math.round(h*0.30));

  /* the disc, low and centred */
  const r = Math.round(h * 0.16);
  x.fillStyle = shade(c, 0.35);
  x.beginPath(); x.arc(Math.round(w*0.72), horizon - Math.round(r*0.55), r, 0, Math.PI*2); x.fill();
  /* two bands cut across it, the way a 1980s sun is drawn */
  x.fillStyle = shade(c, -0.60);
  for(let i = 0; i < 3; i++){
    const yy = horizon - Math.round(r*0.55) + Math.round(r*0.18) + i*Math.round(r*0.30);
    x.fillRect(Math.round(w*0.72) - r, yy, r*2, Math.max(2, Math.round(r*0.10)));
  }

  /* ground */
  x.fillStyle = shade(c, -0.82); x.fillRect(0, horizon, w, h - horizon);
  x.strokeStyle = shade(c, 0.10); x.lineWidth = 2;
  x.beginPath(); x.moveTo(0, horizon + 1); x.lineTo(w, horizon + 1); x.stroke();

  /* the receding grid — perspective from one vanishing point */
  x.strokeStyle = shade(c, -0.25); x.lineWidth = 1;
  const vx = Math.round(w * 0.5);
  for(let i = -7; i <= 7; i++){
    x.beginPath();
    x.moveTo(vx + i * Math.round(w * 0.07), horizon);
    x.lineTo(vx + i * Math.round(w * 0.46), h);
    x.stroke();
  }
  let step = 3, yy = horizon + 3;
  while(yy < h){
    x.beginPath(); x.moveTo(0, yy); x.lineTo(w, yy); x.stroke();
    step *= 1.42; yy += step;
  }

  /* scanlines over the whole frame */
  x.fillStyle = 'rgba(0,0,0,.18)';
  for(let yline = 0; yline < h; yline += 3) x.fillRect(0, yline, w, 1);
}

function shade(hex, amt){
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round(r + (t - r) * p); g = Math.round(g + (t - g) * p); b = Math.round(b + (t - b) * p);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

/* 5 · the save. Its own key, so a type run and a normal run never see each
   other. saveGame refuses to write when isPractice is set, which is also how
   the mode stays out of the normal slot if anything here ever fails. */
wrap('saveGame', real => function(){
  if(!on()) return real.apply(this, arguments);
  try{
    const s = JSON.parse(JSON.stringify(G));
    s.qUsed = { easy:[...G.qUsed.easy], medium:[...G.qUsed.medium], hard:[...G.qUsed.hard] };
    s._customQUsed = [];
    if(typeof scrubBattleState === 'function') scrubBattleState(s);
    s._mode = 'type';
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  }catch(e){}
});
PKMN.hasSave = function(){
  try{ const s = JSON.parse(localStorage.getItem(SAVE_KEY)); return !!(s && s.diff); }
  catch(e){ return false; }
};

/* 6 · worlds 1-5 only. The margin and everything past it belong to the
   normal run; the mode ends where the printed book does. */
if(window.W2 && typeof W2.maxWorldUnlocked === 'function'){
  const realMax = W2.maxWorldUnlocked;
  W2.maxWorldUnlocked = function(){ return on() ? 5 : realMax.apply(this, arguments); };
}

/* ── painting ───────────────────────────────────────────────────────── */
function paintFighters(){
  if(!on()) return;
  const p = document.getElementById('player-spr');
  const b = document.getElementById('boss-spr');
  if(p) p.innerHTML = boxHTML(G.playerElem, false);
  const te = PKMN.stageElem(G.curStage);
  const lv = ((STAGES[G.curStage] || {}).levels || [])[G.curLevel] || {};
  if(b && te) b.innerHTML = boxHTML(te, !!(lv.boss || lv.mini));
}

function paintChip(){
  let chip = document.getElementById('pk-chip');
  if(!chip){
    const host = document.querySelector('#s-game .g-status');
    if(!host) return;
    chip = document.createElement('div');
    chip.id = 'pk-chip';
    host.insertBefore(chip, host.firstChild);
  }
  const m = PKMN.live();
  if(!m){ chip.innerHTML = ''; return; }
  const cls = m.out > 1 ? 'pk-super' : m.out < 1 ? 'pk-weak' : '';
  chip.className = cls;
  const word = m.out > 1 ? 'SUPER EFFECTIVE' : m.out < 1 ? 'RESISTED' : 'NEUTRAL';
  chip.innerHTML =
    '<i class="pk-pip" style="background:'+COL[m.mine]+'"></i>' +
    '<span class="pk-vs">VS</span>' +
    '<i class="pk-pip" style="background:'+COL[m.theirs]+'"></i>' +
    '<b>&times;'+m.out+'</b>' +
    '<span>'+word+'</span>' +
    '<span class="pk-vs">· THEY HIT &times;'+m.in+'</span>';
}
PKMN.repaint = function(){ paintFighters(); paintChip(); };

/* ── the roster screen ──────────────────────────────────────────────── */
function cardHTML(r, picked){
  const up = r.beats.map(e => e.toUpperCase()).join(', ');
  const down = ROSTER.filter(o => o.beats.includes(r.el)).map(o => o.el.toUpperCase()).join(', ') || '—';
  return '<button class="pk-card'+(picked?' on':'')+'" data-el="'+r.el+'">'+
    boxHTML(r.el, false) +
    '<span class="pk-info">' +
      '<span class="pk-name">'+r.name+'</span>' +
      '<span class="pk-el">'+r.el+'</span>' +
      '<span class="pk-vs-line"><span class="up">&times;2.5 vs</span> '+up+'</span>' +
      '<span class="pk-vs-line"><span class="down">&times;0.4 vs</span> '+down+'</span>' +
    '</span></button>';
}

function ensureRoster(){
  let s = document.getElementById('s-pkroster');
  if(s) return s;
  s = document.createElement('div');
  s.id = 's-pkroster'; s.className = 'screen';
  s.innerHTML =
    '<div class="pk-head">' +
      '<div class="pk-title">CHOOSE YOUR TYPE</div>' +
      '<div class="pk-sub">Every answer you land is this element. The enemy of every ' +
        'stage has one too — the chart cuts both ways, so a bad matchup hurts you as ' +
        'much as it slows you. You can change between stages, free.</div>' +
      '<div class="pk-beta">BETA · box art · worlds 1-5</div>' +
    '</div>' +
    '<div class="pk-grid" id="pk-grid"></div>' +
    '<div class="pk-bar">' +
      '<button class="pbtn sm" id="pk-back">BACK</button>' +
      '<button class="pbtn g sm" id="pk-go">START</button>' +
    '</div>';
  (document.querySelector('.app') || document.body).appendChild(s);

  s.querySelector('#pk-grid').addEventListener('click', ev => {
    const card = ev.target.closest('.pk-card'); if(!card) return;
    PKMN._sel = card.dataset.el;
    [...s.querySelectorAll('.pk-card')].forEach(c => c.classList.toggle('on', c === card));
  });
  s.querySelector('#pk-back').addEventListener('click', () => {
    if(PKMN._swapping){ PKMN._swapping = false; show('s-map'); }
    else show('s-title');
  });
  s.querySelector('#pk-go').addEventListener('click', () => {
    if(!PKMN._sel) return;
    if(PKMN._swapping){ PKMN.setElement(PKMN._sel); PKMN._swapping = false; show('s-map'); }
    else PKMN.begin(PKMN._sel);
  });
  return s;
}

PKMN.openRoster = function(swapping){
  const s = ensureRoster();
  PKMN._swapping = !!swapping;
  PKMN._sel = (swapping && window.G && G.playerElem) || PKMN._sel || ROSTER[0].el;
  s.querySelector('#pk-grid').innerHTML = ROSTER.map(r => cardHTML(r, r.el === PKMN._sel)).join('');
  s.querySelector('#pk-go').textContent = swapping ? 'SWAP' : 'START';
  s.querySelector('.pk-title').textContent = swapping ? 'SWAP YOUR TYPE' : 'CHOOSE YOUR TYPE';
  show('s-pkroster');
};

PKMN.setElement = function(el){
  if(!BY_EL[el] || !window.G) return;
  G.playerElem = el;
  if(typeof saveGame === 'function') saveGame();
  paintSwapBar();
  PKMN.repaint();
};

PKMN.begin = function(el){
  if(!BY_EL[el]) return;
  if(typeof startGame !== 'function') return;
  PKMN._pendingElem = el;
  startGame('medium');
  /* startGame rebuilds G from freshState, so the mode is stamped after it */
  G.mode = 'type';
  G.playerElem = el;
  document.body.classList.add('pk-on');
};

/* ── the swap strip on the map ──────────────────────────────────────── */
function paintSwapBar(){
  if(!on()) { const old = document.getElementById('pk-swap'); if(old) old.remove(); return; }
  const map = document.getElementById('s-map'); if(!map) return;
  let bar = document.getElementById('pk-swap');
  if(!bar){
    bar = document.createElement('div');
    bar.id = 'pk-swap';
    map.insertBefore(bar, map.firstChild);
  }
  const r = BY_EL[G.playerElem] || ROSTER[0];
  bar.innerHTML = boxHTML(r.el, false) +
    '<span class="pk-cur">'+r.name+' · '+r.el.toUpperCase()+'</span>' +
    '<button class="pbtn y sm" id="pk-swap-btn">SWAP TYPE</button>';
  const btn = bar.querySelector('#pk-swap-btn');
  if(btn) btn.addEventListener('click', () => PKMN.openRoster(true));
}

/* the element each stage runs, on its node — the swap has to be decidable
   from the map, not discovered after you tap in */
function paintNodes(){
  if(!on()) return;
  document.querySelectorAll('#s-map .stage-node').forEach(node => {
    const oc = node.getAttribute('onclick') || '';
    const m = /(-?\d+)\s*,/.exec(oc);
    if(!m) return;
    const si = +m[1];
    const el = (STAGES[si] || {}).elem;
    if(!el || !COL[el]) return;
    let dot = node.querySelector('.pk-node-el');
    if(!dot){ dot = document.createElement('i'); dot.className = 'pk-node-el'; node.appendChild(dot); }
    dot.style.background = COL[el];
    dot.title = el.toUpperCase();
  });
}

wrap('buildMap', real => function(){
  const out = real.apply(this, arguments);
  try{ if(on()){ paintSwapBar(); paintNodes(); } }catch(e){}
  return out;
});

/* keep the body flag honest wherever the screen changes */
wrap('show', real => function(id){
  const out = real.apply(this, arguments);
  try{ document.body.classList.toggle('pk-on', on()); }catch(e){}
  return out;
});

/* ── the way in ─────────────────────────────────────────────────────── */
function addTitleButton(){
  const host = document.querySelector('#s-title .title-actions');
  if(!host || document.getElementById('pk-enter')) return;
  const b = document.createElement('button');
  b.className = 'pbtn b'; b.id = 'pk-enter';
  b.textContent = 'TYPE BATTLE · BETA';
  b.addEventListener('click', () => PKMN.openRoster(false));
  host.appendChild(b);
}
if(document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', addTitleButton);
else addTitleButton();

console.log('%c [pkmn] TYPE BATTLE '+PKMN.VER+' · '+ROSTER.length+' types ',
            'background:#1a1030;color:#f2cb3c');
})();
