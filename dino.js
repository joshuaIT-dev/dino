/* ══ dino.js ══ */

/* ══ SPRITES ══ */
const SPR_PLAYER=`<svg width="60" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="6" width="7" height="5" fill="#4ecb71"/>
  <rect x="8" y="4" width="3" height="3" fill="#4ecb71"/>
  <rect x="9" y="2" width="4" height="3" fill="#4ecb71"/>
  <rect x="12" y="2" width="1" height="1" fill="#fff"/>
  <rect x="12" y="4" width="2" height="1" fill="#2a8040"/>
  <rect x="5" y="5" width="1" height="2" fill="#2a8040"/>
  <rect x="7" y="4" width="1" height="2" fill="#2a8040"/>
  <rect x="2" y="8" width="3" height="2" fill="#4ecb71"/>
  <rect x="1" y="9" width="2" height="1" fill="#4ecb71"/>
  <rect x="5" y="11" width="2" height="3" fill="#4ecb71"/>
  <rect x="9" y="11" width="2" height="3" fill="#4ecb71"/>
  <rect x="4" y="13" width="3" height="1" fill="#2a8040"/>
  <rect x="8" y="13" width="3" height="1" fill="#2a8040"/>
</svg>`;


const PLAYER_PASSIVES=[
  {label:'🩹 Resilience', desc:'Heal +5 HP on correct answer'},
  {label:'⚔ Sharpened',  desc:'+10 bonus dmg on correct answers'},
  {label:'🔥 Battle Aura',desc:'+14 dmg + heal 6 HP on correct'},
  {label:'🌟 Heroic Soul',desc:'+20 dmg, 9 HP heal, 15% crit ×2.5'},
];

/* ── slots & lock rules ── */
/* ─────────────────────────────────────────────────────────────────────────
   BOSS ATTRIBUTE SLOTS

   This used to read `stagesCleared>=15 ? 2 : 1`, which was right when the game
   ended at stage 25 and granted nine attributes. dino-world2.js took it to 51
   stages and W2.NEW_ATTRS added six more, so a finished run owned FIFTEEN
   attributes and could equip two — the last thirty-six stages handed out
   rewards with nowhere to put them.

   The ladder now runs the length of the arc. The first two rungs are exactly
   where they always were, so nothing changes for a normal five-world run; the
   extra slots are the margin's, which is where the extra attributes come from.
   ───────────────────────────────────────────────────────────────────────── */
const ATTR_SLOT_STEPS=[
  {at:0,  slots:1, where:'the start'},
  {at:15, slots:2, where:'World 3'},
  {at:25, slots:3, where:'the margin'},
  {at:40, slots:4, where:'World 9'},
  {at:50, slots:5, where:'THE UNWRITTEN'},
];
function attrSlots(){
  const c=(typeof G!=='undefined'&&G&&G.stagesCleared)||0;
  let n=1;
  for(const s of ATTR_SLOT_STEPS)if(c>=s.at)n=s.slots;
  return n;
}
/* the next rung, for the UI to name — null once they are all open */
/* ─────────────────────────────────────────────────────────────────────────
   SCORE FORMATTING

   Score is the damage you have dealt, so it climbs past six figures inside a
   normal run and past nine past the margin. Printed in full it collided with
   the STREAK label in the top bar — and only on a real machine, because the
   collision depends on Space Mono's width and the sandbox falls back to a
   narrower face.

   Under a thousand it stays exact. Above that: one decimal, so 1.2m and 1.9m
   are still different numbers at a glance. The exact figure never disappears
   — it rides along in the title attribute wherever the short form is shown.
   ───────────────────────────────────────────────────────────────────────── */
const SCORE_UNITS=[
  {at:1e9, suffix:'b', dp:2},
  {at:1e6, suffix:'m', dp:2},
  {at:1e3, suffix:'k', dp:1},
];
function fmtScore(n){
  n=Number(n)||0;
  const sign=n<0?'-':''; n=Math.abs(n);
  if(n<1000)return sign+String(Math.round(n));
  for(let i=0;i<SCORE_UNITS.length;i++){
    const u=SCORE_UNITS[i];
    if(n<u.at)continue;
    /* Number() rather than the string drops a trailing .0 on its own, so a
       round two million reads 2m and not 2.00m */
    let v=+(n/u.at).toFixed(u.dp), suf=u.suffix;
    /* rounding can carry a value into the unit above — 999 999 must read 1m,
       never 1000k */
    if(v>=1000&&SCORE_UNITS[i-1]){
      const up=SCORE_UNITS[i-1];
      v=+(n/up.at).toFixed(up.dp); suf=up.suffix;
    }
    return sign+v+suf;
  }
  return sign+String(Math.round(n));
}
/* the exact number, grouped, for the tooltip and for anywhere precision matters */
function fullScore(n){return (Number(n)||0).toLocaleString('en-US');}

/* One place that paints the scoreboard. It used to be written from exactly
   one site — inside correctAnswer — so resuming a saved run showed the "0"
   that sits in the markup until the player's first correct answer. */
function paintScore(){
  const sc=document.getElementById('sc-score');
  if(sc){ sc.textContent=fullScore(G.score); sc.title='Score '+fullScore(G.score); }
  const g=document.getElementById('g-score');
  if(g) g.textContent='SCORE:'+fullScore(G.score);
}

function ordinal(n){return ['','first','second','third','fourth','fifth','sixth'][n]||(n+'th');}
function attrNextSlot(){
  const c=(typeof G!=='undefined'&&G&&G.stagesCleared)||0;
  return ATTR_SLOT_STEPS.find(s=>c<s.at)||null;
}
function attrsAreLocked(){ const w=G.attrLockedWorld||0; return w?!worldCleared(w):false; }
function lockAttrsForWorld(si){
  const w=worldOfStage(si);
  if(!worldCleared(w))G.attrLockedWorld=w;   // entered an unfinished world → frozen
}
function normalizeAttrs(){
  G.attrsOwned=(G.attrsOwned||[]).filter(id=>ATTR_BY_ID[id]);
  G.attrsEquipped=(G.attrsEquipped||[]).filter(id=>G.attrsOwned.includes(id)).slice(0,attrSlots());
}
function grantBossAttr(si){
  const a=ATTR_BY_SI[si]; if(!a)return null;
  G.attrsOwned=G.attrsOwned||[]; G.attrsEquipped=G.attrsEquipped||[];
  if(!G.attrsOwned.includes(a.id))G.attrsOwned.push(a.id);
  if(si===worldBossStage(worldOfStage(si))||STAGES[si].isBoss)G.attrLockedWorld=0; // world done → re-pick allowed
  if(G.attrsEquipped.length<attrSlots()&&!G.attrsEquipped.includes(a.id))G.attrsEquipped.push(a.id);
  normalizeAttrs();
  return a;
}

/* ── combat resolution ── */
function attrFX(){
  const f={dodge:0,dr:0,thorns:0,lifesteal:0,regen:0,dotRes:0,timeBonus:0,atkMult:1,healMult:1,immune:{}};
  (G.attrsEquipped||[]).forEach(id=>{
    const a=ATTR_BY_ID[id]; if(!a)return; const x=a.fx||{};
    f.dodge+=x.dodge||0; f.dr+=x.dr||0; f.thorns+=x.thorns||0;
    f.lifesteal+=x.lifesteal||0; f.regen+=x.regen||0;
    f.dotRes+=x.dotRes||0; f.timeBonus+=x.timeBonus||0;
    f.atkMult*=x.atkMult||1; f.healMult*=x.healMult||1;
    (x.immune||[]).forEach(k=>f.immune[k]=true);
  });
  /* Four fields were clamped when two slots was the ceiling. With five, the
     rest have to be bounded too — stacking the margin's attributes multiplied
     atkMult to 3.3x and left lifesteal and the answer clock unbounded. These
     sit above what any single attribute grants, so nothing is weakened; they
     only stop the top of the ladder running away. */
  f.dodge=Math.min(.30,f.dodge); f.dr=Math.min(.30,f.dr);
  /* 0.80 predates the margin. THE UNWRITTEN's own text promises 90% status
     resistance and it was being silently clipped to 80% even when equipped
     alone — a ceiling must never cut below what one attribute grants. */
  f.thorns=Math.min(.30,f.thorns); f.dotRes=Math.min(.90,f.dotRes);
  f.lifesteal=Math.min(.40,f.lifesteal); f.regen=Math.min(.08,f.regen);
  f.atkMult=Math.min(2.5,f.atkMult);     f.healMult=Math.min(2.0,f.healMult);
  f.timeBonus=Math.min(6,f.timeBonus);
  return f;
}
function attrIncoming(dmg){
  const f=attrFX();
  if(Math.random()<f.dodge)return{dmg:0,dodged:true,reflect:0};
  const out=Math.max(1,Math.round(dmg*(1-f.dr)));
  return{dmg:out,dodged:false,reflect:Math.round(out*f.thorns)};
}
function attrImmune(kind){ return !!attrFX().immune[kind]; }
function attrDotScale(){ return 1-attrFX().dotRes; }

/* ── lobby UI ── */
function _attrCSS(){
  if(document.getElementById('attr-css'))return;
  const s=document.createElement('style'); s.id='attr-css';
  /* Appearance for the attribute bar and its modal. This is injected at
     runtime, so it lands in <head> AFTER dino-ui.css and wins the cascade —
     which is why it has to carry the palette itself rather than be skinned
     from outside. Every value below is a token; there are no raw colours. */
  s.textContent=`
  .attr-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;
    margin:6px 10px;padding:6px 8px;
    border:1px solid var(--border);border-radius:var(--r2);background:var(--panel)}
  .attr-bar .ab-lbl{font-family:var(--vt);font-weight:700;font-size:10px;
    letter-spacing:.16em;text-transform:uppercase;color:var(--dim2)}
  .ab-slot{display:flex;align-items:center;gap:6px;
    font-family:var(--vt);font-size:11px;padding:5px 9px;border-radius:var(--r2);
    border:1px dashed var(--border);background:var(--panel2);color:var(--dim2)}
  .ab-slot.filled{border-style:solid;border-color:var(--accent);color:var(--accent)}
  .ab-btn{margin-left:auto;
    font-family:var(--vt);font-weight:700;font-size:11px;letter-spacing:.12em;
    text-transform:uppercase;padding:7px 13px;border-radius:var(--r2);
    border:1px solid var(--accent);color:#241C00;background:var(--accent);cursor:pointer}
  .ab-btn:hover{filter:brightness(1.08)}
  .ab-btn[disabled]{opacity:.45;cursor:not-allowed;background:transparent;color:var(--dim2);
    border-color:var(--border)}
  #attr-modal{position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;
    background:rgba(4,4,10,.86);backdrop-filter:blur(3px);padding:16px}
  #attr-modal.on{display:flex}
  .am-box{width:100%;max-width:440px;max-height:82vh;overflow:auto;
    border-radius:var(--r3);padding:16px;
    background:var(--panel);border:1px solid var(--border);
    box-shadow:0 24px 70px rgba(0,0,0,.7)}
  .am-title{font-family:var(--px);font-size:11px;letter-spacing:.08em;color:var(--text);
    line-height:1.7;margin-bottom:6px}
  .am-sub{font-family:var(--vt);font-size:11.5px;color:var(--dim);line-height:1.5;margin-bottom:4px}
  .am-sub.am-lock{color:var(--dim2);margin-bottom:12px}
  .am-item{display:flex;gap:10px;align-items:flex-start;padding:10px;margin-bottom:7px;
    border-radius:var(--r2);
    border:1px solid var(--border);background:var(--panel2);cursor:pointer;
    transition:border-color .14s,background .14s}
  .am-item:hover{border-color:var(--border2);background:var(--panel3)}
  .am-item.on{border-color:var(--accent);background:rgba(255,211,78,.08)}
  .am-item.on .am-n,.am-item.on .am-t{color:var(--accent)}
  .am-item.lockedout{opacity:.38;cursor:not-allowed}
  .am-ic{font-size:19px;line-height:1;flex:0 0 auto}
  .am-n{font-family:var(--vt);font-weight:700;font-size:12px;letter-spacing:.06em;color:var(--text)}
  .am-d{font-size:11.5px;color:var(--dim);margin-top:3px;line-height:1.5}
  .am-t{margin-left:auto;flex:0 0 auto;
    font-family:var(--vt);font-weight:700;font-size:9px;letter-spacing:.14em;color:var(--dim2)}
  .am-close{width:100%;margin-top:8px;padding:11px;border-radius:var(--r2);
    font-family:var(--vt);font-weight:700;font-size:11px;letter-spacing:.14em;text-transform:uppercase;
    border:1px solid var(--border2);background:var(--panel2);color:var(--dim);cursor:pointer}
  .am-close:hover{color:var(--text);border-color:var(--dim2);background:var(--panel3)}

  /* collapsible attribute bar */
  .ab-toggle{display:flex;align-items:center;gap:7px;
    font-family:var(--vt);font-weight:700;font-size:11px;letter-spacing:.12em;
    text-transform:uppercase;padding:6px 11px;border-radius:var(--r2);cursor:pointer;
    border:1px solid var(--border2);background:var(--panel2);color:var(--dim)}
  .ab-toggle:hover{color:var(--text);border-color:var(--dim2)}
  .ab-caret{display:inline-block;transition:transform .15s}
  .attr-bar.open .ab-caret{transform:rotate(180deg)}
  .ab-body{display:none;width:100%;flex-wrap:wrap;gap:6px;align-items:center;margin-top:7px}
  .attr-bar.open .ab-body{display:flex}
  .ab-mini-ic{font-size:14px;line-height:1}
  @media (max-width:560px){
    .attr-bar{margin:6px 8px;padding:6px}
    .ab-slot{font-size:10.5px;padding:4px 8px}
    .am-box{padding:13px}
    .am-title{font-size:10px}
  }`;
  document.head.appendChild(s);
}

/* ── the top bar's two passive cards, compact ──
   Name only, plus one icon chip per enemy resistance; the full text is in the
   tooltip and in the DinoDex (dinodex.js — tap the card). The old full-text
   card measured ~1500px wide on a 1366px laptop: the bar wrapped to three rows
   and pushed the question box into a scroll. */
const RES_ICON={poison:'☠',burn:'🔥',paralyze:'⚡',freeze:'❄',halfhp:'💀',stun:'💫'};
function escHTML(t){return String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
/* Resistances as graded pips.

   Printing "−90%" beside every icon wanted 330px inside a 132px card, so the
   enemy's NAME was the thing that got truncated — "Celes…" for Celestial
   Shield — while five unreadable chips took the room. The figure is what can
   be dropped: what a player needs mid-fight is which statuses are blunted and
   roughly how badly, and that reads faster as weight than as digits.

   Four grades, so the shape of an enemy's defence is legible at a glance:
     immune   ✕ struck through, in the bad colour
     strong   ≥70% — full-strength pip
     medium   ≥35% — half-weight
     weak     <35% — hairline
   The exact percentage stays on hover and in the DinoDex. */
function resGrade(v){
  if(v===0)return 'imm';
  const cut=1-v;                       // how much of the effect is removed
  if(cut>=.70)return 'r3';
  if(cut>=.35)return 'r2';
  return 'r1';
}
function resChipsHTML(res){
  const keys=Object.keys(res||{});
  if(!keys.length)return '';
  return `<span class="pp-reslist">`+keys.map(k=>{
    const v=res[k],imm=v===0,pct=Math.round((1-v)*100);
    const nm=(PU[k]&&PU[k].name)||k.toUpperCase();
    const tip=imm?`${nm} — immune, it has no effect`
                 :`${nm} — ${pct}% weaker against this enemy`;
    return `<span class="pp-res ${resGrade(v)}" title="${escHTML(tip)}"
      aria-label="${escHTML(tip)}">${RES_ICON[k]||(PU[k]&&PU[k].icon)||'•'}</span>`;
  }).join('')+`</span>`;
}
function renderBattlePassives(si,pIdx){
  const stg=STAGES[si]; if(!stg)return;
  const pp=PLAYER_PASSIVES[Math.max(0,Math.min(PLAYER_PASSIVES.length-1,pIdx|0))];
  const pe=document.getElementById('pp-player');
  if(pe){pe.textContent=pp.label;pe.title=pp.label+' — '+pp.desc;}
  const be=document.getElementById('pp-boss');
  if(be){
    const chips=resChipsHTML(stg.res);
    be.innerHTML=`<span class="pp-name">${escHTML(stg.passive.label)}</span>`+
      (chips?`<span class="pp-resrow"><span class="pp-reslbl">RES</span>${chips}</span>`:'');
    be.title=stg.passive.label+' — '+stg.passive.desc+(window.DinoDex?'\n(tap for the DinoDex)':'');
  }
}


function renderAttrBar(where){
  if(typeof G==='undefined'||!G||!G.diff)return;
  _attrCSS(); normalizeAttrs();
  /* the ATTR bar lives ONLY in the adventure-map navbar */
  const host = document.querySelector('#s-map .map-topbar');
  if(!host)return;
  let bar=document.getElementById('attr-bar');
  if(!bar){bar=document.createElement('div');bar.id='attr-bar';bar.className='attr-bar';}
  if(bar.parentElement!==host){
    host.insertBefore(bar, document.getElementById('timer-toggle-btn')||null);
  }
  const wasOpen=bar.classList.contains('open');
  const owned=(G.attrsOwned||[]).length,eq=G.attrsEquipped||[],n=attrSlots(),locked=attrsAreLocked();
  const icons=eq.length?eq.map(id=>(ATTR_BY_ID[id]||{}).icon||'').join(' '):'—';
  const head=`<button class="ab-toggle" onclick="toggleAttrBar()">
      <span class="ab-mini-ic">${owned?icons:'🔒'}</span>
      <span>ATTR ${eq.length}/${n}</span>
      <span class="ab-caret">▾</span></button>`;
  let body;
  if(!owned){
    body=`<span class="ab-slot">Defeat a world boss to earn one</span>`;
  }else{
    let slots='';
    for(let i=0;i<n;i++){
      const a=ATTR_BY_ID[eq[i]];
      slots+=a?`<span class="ab-slot filled">${a.icon} ${a.name}</span>`
              :`<span class="ab-slot">— empty slot —</span>`;
    }
    body=slots+`<button class="ab-btn" ${locked?'disabled':''} onclick="openAttrModal()">
        ${locked?`🔒 WORLD ${G.attrLockedWorld}`:'CHOOSE'}</button>`;
  }
  bar.innerHTML=head+`<div class="ab-body">${body}</div>`;
  if(wasOpen)bar.classList.add('open');
}
function toggleAttrBar(){
  const b=document.getElementById('attr-bar');
  if(b)b.classList.toggle('open');
}


function openAttrModal(){
  if(attrsAreLocked())return;
  _attrCSS();
  let m=document.getElementById('attr-modal');
  if(!m){ m=document.createElement('div'); m.id='attr-modal';
          m.innerHTML='<div class="am-box" id="am-box"></div>';
          m.onclick=e=>{if(e.target===m)closeAttrModal();};
          document.body.appendChild(m); }
  renderAttrModal(); m.classList.add('on');
}
function closeAttrModal(){
  const m=document.getElementById('attr-modal'); if(m)m.classList.remove('on');
  renderAttrBar(); if(typeof saveGame==='function')saveGame();
}
function renderAttrModal(){
  normalizeAttrs();
  const n=attrSlots(),eq=G.attrsEquipped||[],owned=G.attrsOwned||[];
  const rows=BOSS_ATTRS.filter(a=>owned.includes(a.id)).map(a=>{
    const on=eq.includes(a.id);
    const full=!on&&eq.length>=n;
    return `<div class="am-item ${on?'on':''} ${full?'lockedout':''}" onclick="toggleAttrEquip('${a.id}')">
      <span class="am-ic">${a.icon}</span>
      <span><span class="am-n">${a.name}</span><div class="am-d">${a.desc}</div></span>
      <span class="am-t">${on?'✔ EQUIPPED':a.tier}</span></div>`;
  }).join('')||'<div class="am-d">No boss attributes owned yet.</div>';
  const nxt=attrNextSlot();
  const owndTotal=(typeof BOSS_ATTRS!=='undefined')?BOSS_ATTRS.length:0;
  document.getElementById('am-box').innerHTML=`
    <div class="am-title">BOSS ATTRIBUTE LOADOUT</div>
    <div class="am-sub">${eq.length} of ${n} slot${n===1?'':'s'} used · ${owned.length} of ${owndTotal} earned${
      nxt?` · a ${ordinal(nxt.slots)} slot opens at ${nxt.where}`:' · every slot is open'
    }</div>
    <div class="am-sub am-lock">Locks when you enter the next world — choose before you go.</div>
    ${rows}
    <button class="am-close" onclick="closeAttrModal()">DONE</button>`;
}
function toggleAttrEquip(id){
  if(attrsAreLocked())return;
  G.attrsEquipped=G.attrsEquipped||[];
  const i=G.attrsEquipped.indexOf(id);
  if(i>=0)G.attrsEquipped.splice(i,1);
  else if(G.attrsEquipped.length<attrSlots())G.attrsEquipped.push(id);
  renderAttrModal(); renderAttrBar();
}

/* ══ BALANCE LAYER ══ */
const CAPS={hpMax:36000,atkMax:16000,resMax:300,resCurve:0.75};
const DIFF_MUL={easy:0.85,medium:1,hard:1.15};
// one enemy hit, as a share of the player's Max HP
const DMG_PCT={normal:[0.040,0.070],mini:[0.055,0.090],boss:[0.070,0.110]};
// absolute ceiling for a single hit even after every enrage stacks
const HIT_CAP={normal:0.18,mini:0.24,boss:0.30};
// crit and true damage for enemies
const ENEMY_CRIT_CHANCE={normal:0.08,mini:0.12,boss:0.15};
const ENEMY_CRIT_MULT=1.6;
const ENEMY_TRUEDMG_CHANCE={normal:0.04,mini:0.07,boss:0.10};
// how many good answers a fight should take
const KILL_HITS={normal:5,mini:8,boss:14};
// how much Max HP you recover after clearing a level
const CLEAR_HEAL=0.40;
const HIT_EFFECT_GRACE=4;

function tierOf(lv){return lv.boss?'boss':lv.mini?'mini':'normal';}

function estPlayerHit(){
  const pIdx=Math.min(Math.floor(G.stagesCleared/3),PLAYER_PASSIVES.length-1);
  const tierBonus={easy:12,medium:22,hard:34}[G.diff]||22;
  const passive=[0,10,14,20][pIdx];
  const timeBonus=baseTimerDur()*0.5*1.8;   // base, not the buffed clock — see baseTimerDur
  return Math.max(25,Math.round((tierBonus+timeBonus+9)*1.6+G.pATK+passive));
}
function enemyHPFor(stg,lv,li){
  const w=stg.world||1;
  const raw=1+li*0.10+(w-1)*0.15;
  /* Worlds 1-5 never reach the old flat 2.2 ceiling, so they are unchanged.
     Past the margin the ceiling has to keep rising — pinned at 2.2 it made
     worlds 7, 8, 9, 10 and END all the same fight. */
  const creep=Math.min(w<=6?2.2:2.2+(w-6)*0.6,raw);
  return Math.max(40,Math.round(estPlayerHit()*KILL_HITS[tierOf(lv)]*creep));
}
function enemyAtkFor(stg,lv,li){
  const p=DMG_PCT[tierOf(lv)];
  const creep=1+li*0.04+(stg.world-1)*0.06;
  const d=DIFF_MUL[G.diff]||1;
  const min=Math.max(1,Math.round(G.playerMaxHP*p[0]*creep*d));
  const max=Math.max(min+1,Math.round(G.playerMaxHP*p[1]*creep*d));
  return [min,max];
}
function capPlayerStats(){
  G.pHP=Math.min(G.pHP,CAPS.hpMax-500);
  G.pATK=Math.min(G.pATK,CAPS.atkMax);
  G.pRES=Math.min(G.pRES,CAPS.resMax);
  const raw=Math.min(CAPS.hpMax,500+G.pHP);
  G.hpPenalty=Math.min(G.hpPenalty||0,Math.floor(raw*0.40));
  G.playerMaxHP=Math.max(100,raw-G.hpPenalty);
  G.playerHP=Math.min(G.playerHP,G.playerMaxHP);
}

function computeProgressStats(si,li){
  let pHP=0,pATK=0,pRES=0,stagesCleared=0;
  for(let s=0;s<si;s++){
    STAGES[s].levels.forEach(lv=>{pHP+=lv.attr.hp;pATK+=lv.attr.atk;pRES+=lv.attr.res;});
    stagesCleared++;
  }
  for(let l=0;l<li;l++){
    const lv=STAGES[si].levels[l];
    pHP+=lv.attr.hp;pATK+=lv.attr.atk;pRES+=lv.attr.res;
  }
  return{pHP,pATK,pRES,stagesCleared};
}

/* placeholder for worlds 6-11 content the player has not uncovered yet */
const MASK='??????';
const PU_ICON_MAP={
  heal:'heart', double:'zap', freeze:'snowflake', poison:'skull',
  shield:'shield', fiftyf:'target', burn:'flame', halfhp:'skull',
  paralyze:'zap', revive:'drumstick', regen:'syringe', mirror:'sparkles',
  rage:'flame', stun:'sparkle', leech:'droplet', barrier:'brick-wall',
  divine:'star', overload:'zap', gamble:'dices', nuke:'bomb',
  oracle:'eye', insight:'lightbulb',
  /* the six that unlock past the margin (defined in dino-world2.js) */
  anchor:'anchor', echo:'volume-2', loophole:'paperclip',
  desalt:'test-tube', restore:'heart-pulse', thepen:'pen-tool',
};
const EFFECT_ICON_MAP={
  double:'zap', overload:'zap', mirror:'sparkles', freeze:'snowflake',
  paralyze:'zap', stun:'sparkle', bossPoison:'skull', bossBurn:'flame',
  shield:'shield', barrier:'brick-wall', playerPoison:'skull', playerBurn:'flame',
  playerFreeze:'snowflake', playerParalyze:'zap', playerRegen:'syringe',
  playerRage:'flame', playerSlowed:'turtle', playerEnergyLock:'lock', itemSeal:'lock',
  blindness:'eye-off', playerVulnerable:'alert-triangle',
};
// small helper: returns an inline lucide <i> tag
function luc(name,size=14){return `<i data-lucide="${name}" style="width:${size}px;height:${size}px;vertical-align:-3px"></i>`;}

/* live description — real numbers for the current world */
function puDesc(t){
  const inRun=!!(G&&G.playerMaxHP);
  if(!inRun)return PU[t].desc;
  switch(t){
    case 'heal':   return `+${healAmtFor()} HP (6% max HP)`;
    case 'regen':  return `+${regenAmtFor()} HP/turn ×3`;
    case 'poison': return `-${poisonAmtFor()}/turn ×4, shreds boss dodge`;
    case 'burn':   return `-${burnAmtFor()}/turn ×3, -${Math.round(burnSuppressFor(tierOf(STAGES[G.curStage].levels[G.curLevel]),true)*100)}% enemy regen/lifesteal`;
    case 'nuke':   return `Deal ${Math.floor(G.playerMaxHP*0.5)} dmg (50% your max HP)`;
    case 'rage':   return `ATK×2 for 3 turns, -${rageCostFor()} HP/turn`;
    default:       return PU[t].desc;
  }
}

const PU_CATEGORIES=[
  {label:'OFFENSE',color:'var(--red)',types:['double','overload','burn','poison','halfhp','nuke','leech']},
  {label:'DEFENSE',color:'var(--teal)',types:['shield','barrier','mirror','freeze','paralyze','stun']},
  {label:'SUPPORT & UTILITY',color:'var(--green)',types:['heal','regen','revive','divine','fiftyf','oracle','insight','rage','gamble']},
  /* Worlds 6-11. These live in W2.NEW_PU and are merged into PU when
     dino-world2.js loads, so the filter below hides them until then. */
  {label:'PAST THE MARGIN · WORLDS 6-11',color:'var(--accent)',margin:true,
   types:['anchor','echo','loophole','desalt','restore','thepen']},
];

const PU={
  heal:    {icon:'💚',name:'HEAL',    color:'var(--green)', border:'#4ecb71',desc:'Restore 6% of your max HP (min 30)'},
  double:  {icon:'⚡',name:'2× DMG',  color:'var(--yellow)',border:'#f5c842',desc:'Your whole next hit ×2 · stacks to ×16 (4 max)'},
  freeze:  {icon:'❄', name:'FREEZE',  color:'var(--blue)',  border:'#4a9eff',desc:'Enemy skips 2 turns'},
  poison:  {icon:'☠', name:'POISON',  color:'var(--purple)',border:'#b06aff',desc:'2.5% of enemy max HP/turn for 4 turns'},
  shield:  {icon:'🛡',name:'SHIELD',  color:'var(--teal)',  border:'#2dd4c8',desc:'Absorb 50% of damage for 3 hits · stacks to 90%'},
  fiftyf:  {icon:'🎯',name:'50/50',   color:'var(--orange)',border:'#ff7a30',desc:'Removes half of the remaining wrong answers'},
  burn:    {icon:'🔥',name:'BURN',    color:'var(--orange)',border:'#ff7a30',desc:'1.8% of enemy max HP/turn ×3 · weakens enemy regen & lifesteal (much less on bosses)'},
  halfhp:  {icon:'💀',name:'HALF HP', color:'var(--red)',   border:'#e84545',desc:'Cut enemy current HP in half (reduced by resistance)'},
  paralyze:{icon:'⚡',name:'PARALYZE',color:'var(--cyan)',  border:'#00e5ff',desc:'Enemy skips 2 turns'},
  revive:  {icon:'🍖',name:'REVIVE',  color:'var(--pink)',  border:'#ff6eb4',desc:'Auto-revives you once on death'},
  regen:   {icon:'💉',name:'REGEN',   color:'var(--green)', border:'#4ecb71',desc:'+2.5% max HP/turn for 3 turns'},
  mirror:  {icon:'🪞',name:'MIRROR',  color:'var(--teal)',  border:'#2dd4c8',desc:'Reflect the next hit back · stacks multiply, still 1 use'},
  rage:    {icon:'😤',name:'RAGE',    color:'var(--red)',   border:'#e84545',desc:'ATK×2 for 3 turns, costs 1% max HP/turn'},
  stun:    {icon:'💫',name:'STUN',    color:'var(--yellow)',border:'#f5c842',desc:'Enemy skips 1 turn · ignores immunity'},
  leech:   {icon:'🩸',name:'LEECH',   color:'var(--purple)',border:'#b06aff',desc:'Steal 8% of enemy current HP and heal for it'},
  barrier: {icon:'🧱',name:'BARRIER', color:'var(--blue)',  border:'#4a9eff',desc:'Block the next 2 hits fully · stacks to 6'},
  divine:  {icon:'🌟',name:'DIVINE',  color:'var(--yellow)',border:'#f5c842',desc:'Restore to full HP'},
  overload:{icon:'⚡',name:'OVERLOAD',color:'var(--yellow)',border:'#f5c842',desc:'Your whole next hit ×3 · stacks to ×9 · you take +20% on the next hit'},
  gamble:  {icon:'🎲',name:'GAMBLE',  color:'var(--pink)',  border:'#ff6eb4',desc:'Instantly uses one random powerup (not revive)'},
  nuke:    {icon:'💣',name:'NUKE',    color:'var(--red)',   border:'#e84545',desc:'Deal 50% of YOUR max HP as damage'},
  oracle:  {icon:'🔮',name:'ORACLE',  color:'var(--purple)',border:'#b06aff',desc:'Highlights the correct answer'},
  insight: {icon:'👁',name:'INSIGHT', color:'var(--blue)',  border:'#4a9eff',desc:'+30 seconds (Timed mode only)'},
};


const Q={
  easy:[
    {type:'Math',q:'What is 6 × 7?',a:'42',c:['42','45','48','36']},
    {type:'Math',q:'What is 15 + 28?',a:'43',c:['41','43','45','47']},
    {type:'Math',q:'What is 100 ÷ 4?',a:'25',c:['20','25','30','40']},
    {type:'Math',q:'What is 9 × 8?',a:'72',c:['63','72','81','64']},
    {type:'Math',q:'What is 50 - 17?',a:'33',c:['33','37','31','27']},
    {type:'Math',q:'What is 12 × 5?',a:'60',c:['55','65','60','50']},
    {type:'Math',q:'What is 81 ÷ 9?',a:'9',c:['7','8','9','11']},
    {type:'Math',q:'What is 3³?',a:'27',c:['9','27','81','18']},
    {type:'Math',q:'What is 14 × 3?',a:'42',c:['38','40','42','45']},
    {type:'Math',q:'What is 120 ÷ 6?',a:'20',c:['15','18','20','24']},
    {type:'Math',q:'What is 7 + 8 × 2?',a:'23',c:['30','23','22','15']},
    {type:'Math',q:'What is 2⁴?',a:'16',c:['8','12','16','32']},
    {type:'Trivia',q:'What is the hottest planet in our solar system?',a:'Venus',c:['Mercury','Venus','Mars','Jupiter']},
    {type:'Trivia',q:'Which planet is famous for its big red spot?',a:'Jupiter',c:['Mars','Jupiter','Saturn','Neptune']},
    {type:'Trivia',q:'What is the approximate age of the universe (billion years)?',a:'13.8',c:['4.5','10.2','13.8','20.1']},
    {type:'Trivia',q:'Which galaxy is closest to our Milky Way?',a:'Andromeda',c:['Andromeda','Triangulum','Sombrero','Centaurus']},
    {type:'Trivia',q:'What type of star is our Sun?',a:'Yellow Dwarf',c:['Red Giant','White Dwarf','Yellow Dwarf','Blue Supergiant']},
    {type:'Trivia',q:'How many moons does Mars have?',a:'2',c:['0','1','2','4']},
    {type:'Trivia',q:'What is the invisible force that keeps planets in orbit?',a:'Gravity',c:['Magnetism','Gravity','Dark Matter','Centrifugal']},
    {type:'Trivia',q:'Which planet rolls on its side like a bowling ball?',a:'Uranus',c:['Saturn','Uranus','Neptune','Pluto']},
    {type:'Trivia',q:'What is the boundary around a black hole called?',a:'Event Horizon',c:['Singularity','Event Horizon','Dark Zone','Accretion Disk']},
    {type:'Trivia',q:'In what year did humans first land on the Moon?',a:'1969',c:['1965','1969','1972','1975']},
    {type:'Trivia',q:'What is the largest moon in our solar system?',a:'Ganymede',c:['Titan','Ganymede','Europa','Io']},
    {type:'Trivia',q:'Which planet was officially downgraded to a dwarf planet in 2006?',a:'Pluto',c:['Ceres','Eris','Pluto','Makemake']},
    {type:'Trivia',q:'What are comets mostly made of?',a:'Ice and Dust',c:['Rock and Iron','Liquid Gas','Ice and Dust','Pure Carbon']},
  ],
  medium:[
    {type:'Math',q:'What is 17 × 13?',a:'221',c:['201','211','221','231']},
    {type:'Math',q:'What is 256 ÷ 16?',a:'16',c:['14','16','18','20']},
    {type:'Math',q:'What is 45% of 200?',a:'90',c:['85','90','95','100']},
    {type:'Math',q:'What is √144?',a:'12',c:['11','12','13','14']},
    {type:'Math',q:'What is 2⁸?',a:'256',c:['128','256','512','64']},
    {type:'Math',q:'If 3x+9=24, x=?',a:'5',c:['3','4','5','6']},
    {type:'Math',q:'What is 15% of 340?',a:'51',c:['48','51','54','57']},
    {type:'Math',q:'What is 23²?',a:'529',c:['484','506','529','551']},
    {type:'Math',q:'Degrees in a triangle?',a:'180',c:['90','120','180','360']},
    {type:'Math',q:'What is 7 × 11 × 3?',a:'231',c:['210','231','252','273']},
    {type:'Math',q:'What is 2³ + 3²?',a:'17',c:['13','17','19','21']},
    {type:'Math',q:'Area circle r=7 (π≈3.14)?',a:'153.86',c:['43.96','153.86','154','78']},
    {type:'Trivia',q:'Atomic number 79 = ?',a:'Gold',c:['Silver','Platinum','Gold','Copper']},
    {type:'Trivia',q:'Who painted the Mona Lisa?',a:'Leonardo da Vinci',c:['Michelangelo','Raphael','Leonardo da Vinci','Caravaggio']},
    {type:'Trivia',q:'Hardest natural substance?',a:'Diamond',c:['Ruby','Quartz','Diamond','Sapphire']},
    {type:'Trivia',q:'Year Titanic sank?',a:'1912',c:['1910','1911','1912','1915']},
    {type:'Trivia',q:'Bones in adult human body?',a:'206',c:['196','206','216','226']},
    {type:'Trivia',q:'Powerhouse of the cell?',a:'Mitochondria',c:['Nucleus','Ribosome','Mitochondria','Vacuole']},
    {type:'Trivia',q:'Most of Earth atmosphere?',a:'Nitrogen',c:['Oxygen','Carbon dioxide','Nitrogen','Argon']},
    {type:'Trivia',q:'Who wrote Romeo and Juliet?',a:'Shakespeare',c:['Dickens','Shakespeare','Chaucer','Milton']},
    {type:'Trivia',q:'Olympics first held in?',a:'Greece',c:['Italy','Egypt','Greece','Turkey']},
    {type:'Trivia',q:'Longest river in world?',a:'Nile',c:['Amazon','Yangtze','Nile','Mississippi']},
    {type:'Trivia',q:'Speed of light (km/s)?',a:'300,000',c:['30,000','300,000','3,000,000','3,000']},
    {type:'Trivia',q:'Chemical symbol for gold?',a:'Au',c:['Go','Gd','Au','Ag']},
    {type:'Trivia',q:'Chambers in human heart?',a:'4',c:['2','3','4','6']},
  ],
  hard:[
    {type:'Math',q:'347 × 23 = ?',a:'7981',c:['7681','7781','7881','7981']},
    {type:'Math',q:'4x² - 36 = 0 → x = ?',a:'3',c:['2','3','4','6']},
    {type:'Math',q:'log₂(128) = ?',a:'7',c:['5','6','7','8']},
    {type:'Math',q:'Derivative of x³?',a:'3x²',c:['x²','2x','3x²','3x³']},
    {type:'Math',q:'Prime numbers below 20?',a:'8',c:['6','7','8','9']},
    {type:'Math',q:'sin(θ)=0.5 → θ = ?',a:'30°',c:['30°','45°','60°','90°']},
    {type:'Math',q:'17 mod 5 = ?',a:'2',c:['1','2','3','4']},
    {type:'Math',q:'Interior angles pentagon?',a:'540°',c:['360°','450°','540°','720°']},
    {type:'Math',q:'(3+4i)(3−4i) = ?',a:'25',c:['7','25','12+0i','16']},
    {type:'Math',q:'Fibonacci 10th term?',a:'55',c:['34','44','55','65']},
    {type:'Math',q:'∫x² dx = ?',a:'x³/3 + C',c:['x³+C','2x+C','x³/3+C','3x²+C']},
    {type:'Math',q:'e to 2 decimal places?',a:'2.72',c:['1.41','2.72','3.14','2.61']},
    {type:'Math',q:'1+2+3+…+100 = ?',a:'5050',c:['4950','5000','5050','5100']},
    {type:'Trivia',q:'Treaty ending WWI?',a:'Treaty of Versailles',c:['Treaty of Paris','Treaty of Utrecht','Treaty of Versailles','Treaty of Vienna']},
    {type:'Trivia',q:'Chandrasekhar limit?',a:'1.4 solar masses',c:['0.8','1.0','1.4 solar masses','2.0']},
    {type:'Trivia',q:'Most abundant element?',a:'Hydrogen',c:['Helium','Oxygen','Carbon','Hydrogen']},
    {type:'Trivia',q:'Magna Carta signed?',a:'1215',c:['1215','1066','1492','1776']},
    {type:'Trivia',q:'Largest organ in body?',a:'Skin',c:['Liver','Brain','Intestines','Skin']},
    {type:'Trivia',q:'First person on Moon?',a:'Neil Armstrong',c:['Buzz Aldrin','Yuri Gagarin','Neil Armstrong','John Glenn']},
    {type:'Trivia',q:'Element symbol Hg?',a:'Mercury',c:['Hydrogen','Gold','Silver','Mercury']},
    {type:'Trivia',q:'Berlin Wall fell?',a:'1989',c:['1987','1988','1989','1991']},
    {type:'Trivia',q:'Most native speaker language?',a:'Mandarin Chinese',c:['English','Spanish','Hindi','Mandarin Chinese']},
    {type:'Trivia',q:'Developed general relativity?',a:'Einstein',c:['Newton','Bohr','Einstein','Planck']},
    {type:'Trivia',q:'Moons of Jupiter (2023)?',a:'95',c:['67','79','92','95']},
    {type:'Trivia',q:'Half-life of Carbon-14?',a:'5,730 years',c:['1,000 years','5,730 years','10,000 years','14,000 years']},
    {type:'Trivia',q:'What is the name of the largest known volcano in the solar system?',a:'Olympus Mons',c:['Mauna Kea','Olympus Mons','Tharsis Montes','Caloris Montes']},
    {type:'Trivia',q:'Which moon of Saturn has active geysers shooting water ice into space?',a:'Enceladus',c:['Titan','Enceladus','Mimas','Iapetus']},
    {type:'Trivia',q:'What is the theoretical maximum mass limit for a white dwarf star?',a:'Chandrasekhar Limit',c:['Schwarzschild Limit', 'Chandrasekhar Limit', 'Oppenheimer Limit', 'Eddington Limit']},
    {type:'Trivia',q:'Which planet experiences the fastest wind speeds, reaching up to 2,100 km/h?',a:'Neptune',c:['Jupiter','Saturn','Uranus','Neptune']},
    {type:'Trivia',q:'What is the primary gas found in the atmosphere of Venus?',a:'Carbon Dioxide',c:['Nitrogen','Carbon Dioxide','Sulfur Dioxide','Methane']},
    {type:'Trivia',q:'What hypothetical region of space-time is the mathematical opposite of a black hole?',a:'White Hole',c:['Wormhole','Warp Bubble','White Hole','Dark Void']},
    {type:'Trivia',q:'How many Earth days does it take for Mercury to complete one full rotation on its axis?',a:'59',c:['24','59','88','176']},
    {type:'Trivia',q:'What is the name of the first interstellar object ever detected passing through our solar system?',a:'Oumuamua',c:['Borisov','Oumuamua','Halley','Churyumov']},
    {type:'Trivia',q:'Which constellation contains the supergiant star Betelgeuse?',a:'Orion',c:['Ursa Major','Orion','Taurus','Scorpius']},
    {type:'Trivia',q:'What is the active, intensely luminous core of a distant young galaxy powered by a supermassive black hole called?',a:'Quasar',c:['Pulsar','Magnetar','Quasar','Nebula']}
  ],
};
let _battleSession = 0;
let _pendingRunMode = 'normal';
let _pendingQuizPool = null;
let G={};
/* `let G` is a global LEXICAL binding, so it never lands on window. Later scripts
   (dino-q-end.js, author.js) and the stall watchdog below all read window.G, so
   every reassignment of G must be mirrored. syncG() is that mirror — call it
   immediately after any `G=` . */
function syncG(){window.G=G;return G;}
syncG();

function freshState(diff){
  return {
    diff,timedMode:true,timerModeLocked:false,curStage:0,curLevel:0,stagesCleared:0,
    pickDone:false,
    isSyllabusRun:false,usingCustomQuiz:false,customQuizPool:null, 
    levelsCleared:Array(STAGES.length).fill(0),
    pHP:0,pATK:0,pRES:0,playerMaxHP:500,playerHP:500,
    bossHP:0,bossMaxHP:0,
    bossSpecialFired:false,rageMult:1,bossAtkCounter:0,omegaRageTwo:false,
    attrsOwned:[],attrsEquipped:[],attrLockedWorld:0,
    hpPenalty:0,worldPicksDone:{},
    score:0,streak:0,combo:1,
    inv:Object.fromEntries(Object.keys(PU).map(k=>[k,0])),
    loadout:[],
    inBattle:false,
    activeEffects:[],eliminated:[],petrified:[],pendingGuardians:[],
    animLock:false,timerVal:0,timerInterval:null,
    qUsed:{easy:new Set(),medium:new Set(),hard:new Set()},
    currentQ:null,pendingRewardCount:0,
  };
}


/* ─────────────────────────────────────────────────────────────────────────
   SCREEN HISTORY

   Every BACK used to hard-code show('s-title'), so leaving the leaderboard
   from the home hub threw you out to the front page. The stack fixed that
   and introduced a worse one: show() pushed EVERY screen, including the ones
   that are moments inside a run rather than places you can be. A run pushes
   s-pickpu, s-map and s-game over and over, quitting pushed the screen you
   quit from, and BACK then walked you back into a battle that was over or a
   loadout you had already committed.

   Two ideas fix it:
     · only a PAGE can be a back target. A page is somewhere you can sit and
       decide what to do next. s-game / s-pickpu / s-attrwin / s-end are not
       pages — they are states the run drives you through.
     · quitting is a root action. It clears the history instead of adding to it.
   ───────────────────────────────────────────────────────────────────────── */

const NAV_PAGES=new Set(['s-title','s-home','s-map','s-lb','s-diff','s-syllabus','s-codex']);
let _navStack=[];
function curScreen(){const e=document.querySelector('.screen.on');return e?e.id:null;}

/* drop the history and say where the user now stands. Used by every quit /
   reset path so a later BACK can never reach into the run that just ended. */
function navRoot(id){ _navStack=[]; return id; }

function _paint(id){
  const el=document.getElementById(id);
  if(!el){console.warn('show(): no screen',id);return false;}
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
  el.classList.add('on');
  if(window.lucide)lucide.createIcons();
  return true;
}

function show(id,opts){
  const from=curScreen();
  const keep=!(opts&&opts.noHistory)
    && from && from!==id
    && NAV_PAGES.has(from)              // never remember a run state
    && _navStack[_navStack.length-1]!==from;  // never stack the same page twice
  if(keep){
    _navStack.push(from);
    if(_navStack.length>12)_navStack.shift();
  }
  _paint(id);
}

/* fallback is where to land if there is no history (a deep link, a reload) */
function goBack(fallback){
  const here=curScreen();
  let id=null;
  /* skip anything that is no longer somewhere you can be: a stale run state,
     the screen you are already on, or a map with no run behind it */
  while(_navStack.length){
    const prev=_navStack.pop();
    if(!NAV_PAGES.has(prev))continue;
    if(prev===here)continue;
    if(prev==='s-map'&&!(typeof G!=='undefined'&&G&&Array.isArray(G.levelsCleared)))continue;
    id=prev;break;
  }
  if(!id)id=fallback||'s-title';
  if(!_paint(id))return;
  if(id==='s-title'&&typeof refreshTitle==='function')refreshTitle();
  if(id==='s-home'&&typeof renderHome==='function')renderHome();
}
function showDiff(mode='normal', quizPool=null){
  _pendingRunMode = mode;
  _pendingQuizPool = (mode==='syllabus') ? quizPool : null;
  show('s-diff');
}

/* ---------- SAVE / LOAD ---------- */
const SAVE_KEY='dqb3_save';
const PRACTICE_SAVE_KEY='dqb3_practice_save';

function hasSaveAt(key){try{return !!localStorage.getItem(key);}catch(e){return false;}}
function hasSave(){return hasSaveAt(SAVE_KEY);}
function hasPracticeSave(){return hasSaveAt(PRACTICE_SAVE_KEY);}

function saveGame(){
  if(!G||!G.diff||G.isPractice)return;              // TRAINING never persists
  try{
    const s=JSON.parse(JSON.stringify(G));
    s.qUsed={easy:[...G.qUsed.easy],medium:[...G.qUsed.medium],hard:[...G.qUsed.hard]};
    s._customQUsed = G._customQUsed instanceof Set ? [...G._customQUsed] : [];
    scrubBattleState(s);                            // effects are per-battle, never saved
    s._mode = G.isSyllabusRun ? 'practice' : 'normal';
    const key=G.isSyllabusRun?PRACTICE_SAVE_KEY:SAVE_KEY;
    localStorage.setItem(key,JSON.stringify(s));
  }catch(e){}
}

function loadGameFrom(key){
  try{
    const raw=localStorage.getItem(key);if(!raw)return false;
    const s=JSON.parse(raw);
    const validDiff=['easy','medium','hard'].includes(s.diff);
    const validStage=Number.isInteger(s.curStage)&&s.curStage>=0&&s.curStage<STAGES.length;
    const validLevel=Number.isInteger(s.curLevel)&&s.curLevel>=0;
    const wantMode=(key===PRACTICE_SAVE_KEY)?'practice':'normal';
    const okMode=!s._mode||s._mode===wantMode;      // refuse cross-mode saves
    if(!validDiff||!validStage||!validLevel||!okMode){try{localStorage.removeItem(key);}catch(e){}return false;}
    G=s;syncG();
    G.qUsed={
      easy:new Set(s.qUsed?.easy||[]),
      medium:new Set(s.qUsed?.medium||[]),
      hard:new Set(s.qUsed?.hard||[]),
    };
    G._customQUsed=new Set(Array.isArray(s._customQUsed)?s._customQUsed:[]);
    scrubBattleState(G);                            // nothing carries in
    G.isPractice=false;                             // re-stamp the mode, hard
    G.isSyllabusRun=(key===PRACTICE_SAVE_KEY);
    if(G.pickDone===undefined)G.pickDone=false;
    return true;
  }catch(e){try{localStorage.removeItem(key);}catch(e2){}return false;}
}
function loadGame(){
return loadGameFrom(SAVE_KEY);
}
function loadPracticeGame(){
return loadGameFrom(PRACTICE_SAVE_KEY);
}

function clearSave(){
try{localStorage.removeItem(SAVE_KEY);
}catch(e){}
}
function clearPracticeSave(){
try{localStorage.removeItem(PRACTICE_SAVE_KEY);
}catch(e){}
}

/* ---------- COMPLETED MAP SNAPSHOT ---------- */   // ← ADD THIS WHOLE BLOCK
const COMPLETED_KEY='dqb3_completed_map';

function saveCompletedMapSnapshot(){
  if(!G)return;
  try{
    /* Snapshot only what has actually been cleared. Before worlds 6-10 existed
       "everything" and "STAGES.length" were the same thing; now they are not,
       and STAGES.map(()=>5) would claim the unprinted worlds were finished. */
    const reached=Math.max(0,Math.min(STAGES.length-1,G.curStage|0));
    const snap={
      diff:G.diff,
      levelsCleared:STAGES.map((_,i)=>i<=reached?5:0),
      stagesCleared:reached+1,
      curStage:reached,curLevel:4,
      pHP:G.pHP,pATK:G.pATK,pRES:G.pRES,
      playerMaxHP:G.playerMaxHP,
      score:G.score,
      attrsOwned:G.attrsOwned||[],
      attrsEquipped:G.attrsEquipped||[],
      date:Date.now()
    };
    localStorage.setItem(COMPLETED_KEY,JSON.stringify(snap));
  }catch(e){}
}
function hasCompletedMap(){try{return !!localStorage.getItem(COMPLETED_KEY);}catch(e){return false;}}

function viewCompletedMap(){
  let snap=null;
  try{snap=JSON.parse(localStorage.getItem(COMPLETED_KEY));}catch(e){}
  if(!snap)return;
  G=freshState(snap.diff||'medium');syncG();
  Object.assign(G,{
    curStage:snap.curStage,curLevel:snap.curLevel,
    levelsCleared:snap.levelsCleared,stagesCleared:snap.stagesCleared,
    pHP:snap.pHP,pATK:snap.pATK,pRES:snap.pRES,
    playerMaxHP:snap.playerMaxHP,playerHP:snap.playerMaxHP,
    score:snap.score,
    attrsOwned:snap.attrsOwned,attrsEquipped:snap.attrsEquipped,
  });
  capPlayerStats();
  G.viewOnly=true;
  buildMap();
  show('s-map');
}

function fullReset(){
  if(G&&G.isSyllabusRun)clearPracticeSave();
  else clearSave();
  /* the run is gone — nothing behind us is a place any more */
  show(navRoot('s-title'),{noHistory:true});
  refreshTitle();
}

/* the map's own QUIT: leave the run entirely */
function quitToTitle(){
  _battleSession++;
  stopBattleBgLoop();
  if(G&&G.timerInterval)clearInterval(G.timerInterval);
  if(G&&!G.isPractice&&!G.viewOnly)saveGame();
  if(G)G.inBattle=false;
  /* a practice or syllabus run is launched from the home hub, so that is
     where leaving it should put you back */
  const home=!!(G&&(G.isPractice||G.isSyllabusRun));
  show(navRoot(home?'s-home':'s-title'),{noHistory:true});
  if(home){if(typeof renderHome==='function')renderHome();}
  else refreshTitle();
}

/* the battle's QUIT: leave the fight, not the run */
function quitBattle(){
  _battleSession++;
  stopBattleBgLoop();
  if(G&&G.timerInterval)clearInterval(G.timerInterval);
  saveGame();
  if(G)G.inBattle=false;
  /* a normal run steps back onto its map. A practice or syllabus fight has no
     map behind it — it was launched from the home hub, so it returns there
     rather than dumping you on the front page. */
  if(G&&!G.isPractice&&!G.isSyllabusRun&&typeof buildMap==='function'){
    buildMap(); show(navRoot('s-map'),{noHistory:true});
  }else{
    show(navRoot('s-home'),{noHistory:true});
    if(typeof renderHome==='function')renderHome();
  }
}

function resumeBattle(){
_battleSession++; G._session=_battleSession;
  document.body.classList.toggle('practice-mode', !!(G.isPractice||G.isSyllabusRun));
  document.body.classList.toggle('diff-hard', G.diff==='hard');
  const si=G.curStage,li=G.curLevel,stg=STAGES[si],lv=stg.levels[li];
  const isBoss=!!(lv.boss||lv.mini||stg.isBoss),worldIdx=stg.world-1;
  document.getElementById('player-spr').innerHTML=SPR_PLAYER;
  const bEl=document.getElementById('boss-spr');
  bEl.innerHTML=makeSpr(ECOL[stg.sprIdx],si,isBoss?90:68);
  document.getElementById('g-stage').textContent=`S${si+1}-L${li+1}`;
  document.getElementById('g-boss-name').textContent=lv.sub;
  document.getElementById('boss-f-name').textContent=lv.sub;
  const pIdx=Math.min(Math.floor(G.stagesCleared/3),PLAYER_PASSIVES.length-1);
  renderBattlePassives(si,pIdx);
  if(typeof _attrCSS==='function')_attrCSS();
  (()=>{const si_=document.getElementById('stage-info');
    /* raw digits ran this line off a phone: World 10 reads
       "HP:40338876 ATK:1186903-1580000" and the ATK half was simply cut
       off the right edge. Same shortening as every other number in the
       game, with the exact figures on hover. */
    /* the stage NAME is already printed over the enemy in the arena, so on a
       phone it is the half of this line that can go — see dino-ui.css §35 */
    si_.innerHTML=`<span class="si-name">${stg.name} — </span>`+
      `HP:${fmtScore(G.bossMaxHP)} ATK:${fmtScore(G.bossAtkMin)}–${fmtScore(G.bossAtkMax)}`;
    si_.title=`${stg.name} — HP ${fullScore(G.bossMaxHP)} · ATK ${fullScore(G.bossAtkMin)}–${fullScore(G.bossAtkMax)}`;})();
  const bc2=document.getElementById('battle-canvas');
  requestAnimationFrame(()=>{drawBattleBg(bc2,si);});
  document.getElementById('battle-content').classList.remove('walk-hidden');
  document.getElementById('walk-layer').style.display='none';
  renderAttrs();updateBars();renderInventory();renderEffects();paintScore();
  setMsg('⚔ Battle resumed!','var(--teal)');
  show('s-game');
  nextQ();
}


/* Called by the START button on the title screen */
function onStartClicked(){
  _pendingRunMode='normal';_pendingQuizPool=null;
  if(hasSave()){
    document.getElementById('reset-modal-title').textContent='RESET RUN?';
    document.getElementById('reset-modal-sub').textContent='Starting a new run will erase your current normal run (stage, HP, inventory). Your leaderboard scores and daily streak are kept.';
    document.getElementById('reset-modal-choices').innerHTML=`
      <div class="u-row-8">
        <button class="pbtn sm u-flex1" onclick="closeModal('reset-confirm-modal')"><i data-lucide="x"></i> CANCEL</button>
        <button class="pbtn r sm u-flex1" onclick="doResetProgress('normal');showDiff('normal')"><i data-lucide="trash-2"></i> ERASE &amp; START</button>
      </div>
    `;
    document.getElementById('reset-confirm-modal').classList.add('on');
    refreshIcons();
    return;
  }
  clearSave();
  showDiff('normal');
}
/* Called by CONTINUE button */
function continueGame(){
  if(!loadGame()){refreshTitle();return;}
  if(G.inBattle){resumeBattle();}
  else{buildMap();show('s-map');}
}
function continuePracticeGame(){                     // NEW
  if(!loadPracticeGame()){refreshTitle();return;}
  if(G.inBattle){resumeBattle();}
  else{buildMap();show('s-map');}
}

/* Update the title screen based on whether a save exists */
function refreshTitle(){
  const cont=document.getElementById('continue-btn');
  const note=document.getElementById('saved-note');
  if(hasSave()){
    let info='';
    try{const s=JSON.parse(localStorage.getItem(SAVE_KEY));
      info=`Saved run: ${s.diff.toUpperCase()} &middot; S${(s.curStage||0)+1}-L${(s.curLevel||0)+1} &middot; Score ${fmtScore(s.score||0)}`;
    }catch(e){info='You have a saved run in progress';}
    cont.style.display='block';
    note.style.display='block';
    note.innerHTML=info;
  }else{
    cont.style.display='none';
    note.style.display='none';
  }
  const contP=document.getElementById('continue-practice-btn');
  if(contP)contP.style.display=hasPracticeSave()?'block':'none';
  const viewBtn=document.getElementById('view-completed-btn');    // ← ADD THESE 2 LINES
  if(viewBtn)viewBtn.style.display=hasCompletedMap()?'block':'none';
}
/* =========================================================
   POWER-UP PICK SYSTEM  (startup + world upgrades + mid-level)
   =========================================================
   Design:
   - STARTUP: pick 3 powerups (World 1 loadout).
   - WORLD UPGRADE: on reaching World 2 and World 3, pick again.
       World 2 -> pick 4,  World 3 -> pick 5  (upgrading pool sizes).
   - FINAL PICK: on reaching World 5, one last pick of 5.
   - MID-LEVEL (goMidPick): still offers 1-of-3. If the offered
     powerup the user taps is NOT already owned, it's auto-USED
     immediately instead of just being stored (see pickReward).
*/

/* The single unlock gate. dino-world2.js merges its six power-ups into PU at
   load time, so ANY code that enumerates Object.keys(PU) will hand ANCHOR or
   THE PEN to a World 1 player unless it asks this first. */
function puWorldNow(){
  return (typeof STAGES!=='undefined'&&G&&STAGES[G.curStage]&&STAGES[G.curStage].world)||1;
}
function puUnlocked(t,world){
  /* INSIGHT is "+30 seconds", which is nothing at all in Chill — usePowerup
     refuses it outright there. It was still offered in every pick, still
     droppable and still reachable through GAMBLE, so a Chill run could spend a
     pick and an inventory slot on an item that can never be used. Gate it at
     the single place every pool already asks. */
  if(t==='insight' && G && G.timedMode===false) return false;
  const unlock=(window.W2&&W2.PU_UNLOCK)||{};
  if(unlock[t]===undefined)return true;              // a base power-up
  return (world===undefined?puWorldNow():world)>=unlock[t];
}

// how many to pick + how many cards to offer, per pick-stage
const PICK_TIERS={
  startup:{target:3,offer:8,refill:0,banner:'WORLD 1 LOADOUT — PICK 3'},
  w2:{target:1,offer:5,refill:2,banner:'WORLD 2 — ADD 1 POWERUP (+2 to every stack)'},
  w3:{target:1,offer:5,refill:2,banner:'WORLD 3 — ADD 1 POWERUP (+2 to every stack)'},
  w4:{target:1,offer:5,refill:3,banner:'WORLD 4 — ADD 1 POWERUP (+3 to every stack)'},
  w5:{target:2,offer:6,refill:4,banner:'WORLD 5 — ADD 2 POWERUPS (+4 to every stack)'},
  /* past the margin — each of these is where one of the six new power-ups
     becomes offerable (see W2.PU_UNLOCK) */
  w6:{target:1,offer:5,refill:4,banner:'WORLD 6 — ADD 1 POWERUP (+4 to every stack)'},
  w7:{target:1,offer:5,refill:4,banner:'WORLD 7 — ADD 1 POWERUP (+4 to every stack)'},
  w8:{target:1,offer:5,refill:5,banner:'WORLD 8 — ADD 1 POWERUP (+5 to every stack)'},
  w9:{target:1,offer:5,refill:5,banner:'WORLD 9 — ADD 1 POWERUP (+5 to every stack)'},
  w10:{target:2,offer:6,refill:6,banner:'WORLD 10 — ADD 2 POWERUPS (+6 to every stack)'},
  w11:{target:1,offer:4,refill:6,banner:'WORLD END — ADD 1 POWERUP (+6 to every stack)'},
};


function startGame(diff){
  G=freshState(diff);syncG();
  if(_pendingRunMode==='syllabus' && Array.isArray(_pendingQuizPool) && _pendingQuizPool.length){
    G.usingCustomQuiz=true;
    G.customQuizPool=_pendingQuizPool;
    G.isSyllabusRun=true;
  }
  _pendingRunMode='normal';_pendingQuizPool=null;
  applyDailyGifts();
  G.worldPicksDone={};
  goPickStage('startup');
}

// Generic pick-stage launcher
function goPickStage(key,forWorld){
  const tier=PICK_TIERS[key];
  G._pickStageKey=key;
  G._pickMode='loadout';
  G._picked=[];
  G._pickTarget=tier.target;
  G.loadout=G.loadout||[];
  /* dino-world2 merges six new power-ups into PU at load time, so without this
     gate ANCHOR / LOOPHOLE / THE PEN could be offered on the World 1 screen. */
  const world=forWorld||puWorldNow();
  const pool=Object.keys(PU).filter(t=>
    !G.loadout.includes(t) && puUnlocked(t,world));
  shuffle(pool);
  G._pickChoices=pool.slice(0,tier.offer);
  G._pickBanner=tier.banner;
  renderPickPU();
  show('s-pickpu');
}

/* Called whenever we move to a new stage/level.
   Decides if a world-based re-pick is due before entering. */
function maybeWorldPick(nextSi,nextLi,afterFn){
  const world=STAGES[nextSi].world;
  G.worldPicksDone=G.worldPicksDone||{};
  /* lowest un-done world pick at or below the world we're entering */
  let key=null;
  for(let w=2;w<=world;w++){
    if(PICK_TIERS['w'+w] && !G.worldPicksDone['w'+w]){ key='w'+w; break; }
  }
  if(key){
    G.worldPicksDone[key]=true;
    G._pickResume={si:nextSi,li:nextLi};
    goPickStage(key,world);
    return true;
  }
  afterFn();
  return false;
}

function isRunLocked(){
  return !!(G.timerModeLocked || (G.levelsCleared && G.levelsCleared.some(n=>n>0)) || G.inBattle);
}
function toggleTimerMode(){
  if(isRunLocked()){
    setMsg('⏱ Timer mode is locked until you win or lose this run!','var(--yellow)');
    return;
  }
  G.timedMode=!G.timedMode;
  updateTimerToggleBtn();
  saveGame();
}
function updateTimerToggleBtn(){
  const btn=document.getElementById('timer-toggle-btn');
  if(!btn)return;
  const locked=isRunLocked();
  if(G.timedMode){
    btn.innerHTML='<i data-lucide="timer"></i> TIMED';
    btn.classList.add('tt-on');btn.classList.remove('tt-off');
  }else{
    btn.innerHTML='<i data-lucide="coffee"></i> CHILL';
    btn.classList.add('tt-off');btn.classList.remove('tt-on');
  }
  btn.disabled=locked;
  btn.title=locked?'Locked until this run ends':'Toggle timer mode';
  refreshIcons();
}

/* end-screen tone as a class, not an inline colour — so dino-ui.css can
   restyle the ending without the markup fighting back */
function setEndTone(el,tone){
  el.classList.remove('et-authored','et-unwritten','et-glitch','et-win','et-loss');
  el.classList.add('et-'+tone);
}
function showStageLevels(si){if(si!==G.curStage)return;enterLevel(si,G.levelsCleared[si]);}
function enterLevel(si,li){G.curStage=si;G.curLevel=li;show('s-game');loadLevel(si,li);}

function loadLevel(si,li){
_battleSession++; G._session=_battleSession;
  G.inBattle=true;
  G.timerModeLocked=true;
    document.body.classList.toggle('practice-mode', !!(G.isPractice||G.isSyllabusRun));
    /* Hard asks six answers instead of four, which is ~58px more on a phone.
       dino-ui.css §18 spends the tip row to pay for it. */
    document.body.classList.toggle('diff-hard', G.diff==='hard');
  const stg=STAGES[si],lv=stg.levels[li];
  normalizeAttrs(); lockAttrsForWorld(si);
  const isBoss=!!(lv.boss||lv.mini||stg.isBoss),worldIdx=stg.world-1;
  const calcHP=enemyHPFor(stg,lv,li);
  G.bossHP=calcHP;G.bossMaxHP=calcHP;
  /* the DinoDex (dinodex.js) records every enemy the reader meets */
  window.dispatchEvent(new CustomEvent('dino:encounter',{detail:{si,li}}));
  const atkRange=enemyAtkFor(stg,lv,li);
  G.bossAtkMin=atkRange[0];G.bossAtkMax=atkRange[1];


  G.bossSpecialFired=false;G.rageMult=1;G.bossAtkCounter=0;G.activeEffects=[];G.eliminated=[];
  /* per-ability once/cooldown bookkeeping — must reset here AND in
     scrubBattleState, or specials quietly stop firing on levels 2-5 */
  G._spFired={};G._spCd={};G._telegraphed={};

  document.getElementById('player-spr').innerHTML=SPR_PLAYER;
  const bEl=document.getElementById('boss-spr');
  bEl.innerHTML=makeSpr(ECOL[stg.sprIdx],si,isBoss?90:68);
  document.getElementById('g-stage').textContent=`S${si+1}-L${li+1}`;
  document.getElementById('g-boss-name').textContent=lv.sub;
  document.getElementById('boss-f-name').textContent=lv.sub;
  const pIdx=Math.min(Math.floor(G.stagesCleared/3),PLAYER_PASSIVES.length-1);
  renderBattlePassives(si,pIdx);
  
  if(typeof _attrCSS==='function')_attrCSS();
  (()=>{const si_=document.getElementById('stage-info');
    si_.innerHTML=`<span class="si-name">${stg.name} — </span>`+
      `HP:${fmtScore(calcHP)} ATK:${fmtScore(G.bossAtkMin)}–${fmtScore(G.bossAtkMax)}`;
    si_.title=`${stg.name} — HP ${fullScore(calcHP)} · ATK ${fullScore(G.bossAtkMin)}–${fullScore(G.bossAtkMax)}`;})();
  const bc2=document.getElementById('battle-canvas');
  requestAnimationFrame(()=>{drawBattleBg(bc2,si);});
  renderAttrs();updateBars();renderInventory();renderEffects();paintScore();
  setMsg(`${isBoss?'⚠ BOSS: ':''}${lv.sub} appears! (HP: ${calcHP})`,isBoss?'var(--red)':'var(--yellow)');

  setTurnIndicator(true);
  playWalkInBattle(si,li,()=>{bEl.firstChild&&bEl.firstChild.classList.add('boss-entry');setTimeout(nextQ,300);});
}

function getPool(){return{easy:['easy','easy','easy','medium'],medium:['easy','medium','medium','hard'],hard:['medium','hard','hard','hard']}[G.diff];}
function pickStandardQ(){const tier=getPool()[Math.floor(Math.random()*4)];const bank=Q[tier],used=G.qUsed[tier];let idx=bank.map((_,i)=>i).filter(i=>!used.has(i));if(!idx.length){used.clear();idx=bank.map((_,i)=>i);}const i=idx[Math.floor(Math.random()*idx.length)];used.add(i);return{tier,...bank[i]};}
function getChoiceCount(){return G.diff==='hard'?6:4;}
function buildChoices(q){
  const n=getChoiceCount();
  const all=[q.a,...q.c.filter(c=>c!==q.a)];
  const u=[...new Set(all)];
  if(u.length<n){
    const bank=Q[q.tier]||[];
    const extras=[];
    bank.forEach(item=>{
      if(item.q===q.q) return;
      item.c.forEach(choice=>{
        if(choice!==q.a && !u.includes(choice) && !extras.includes(choice)) extras.push(choice);
      });
    });
    shuffle(extras);
    for(const choice of extras){
      if(u.length>=n) break;
      u.push(choice);
    }
  }
  shuffle(u);
  // pad with generic placeholders only if there still aren't enough unique distractors
  while(u.length<n)u.push(`Option ${String.fromCharCode(65+u.length)}`);
  let ch=u.slice(0,n);
  if(!ch.includes(q.a))ch[Math.floor(Math.random()*n)]=q.a;
  shuffle(ch);
  return ch;
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}




function pickQ(){
  if(G.usingCustomQuiz && G.customQuizPool && G.customQuizPool.length) return pickCustomQ();
  return pickStandardQ();
}
function pickCustomQ(){
  if(!(G._customQUsed instanceof Set)) G._customQUsed = new Set();   // CHANGED
  let idx = G.customQuizPool.map((_,i)=>i).filter(i=>!G._customQUsed.has(i));
  if(!idx.length){ G._customQUsed.clear(); idx = G.customQuizPool.map((_,i)=>i); }
  const i = idx[Math.floor(Math.random()*idx.length)];
  G._customQUsed.add(i);
  const item = G.customQuizPool[i];
  return { tier:'medium', type:item.topic||'Syllabus', q:item.prompt, a:item.answer, c:item.choices };
}

/* ── the question box is a fixed box ───────────────────────────────────────
   The question panel used to grow and shrink with whatever it happened to be
   holding: a six-word question and a forty-word one gave the arena above and
   the answers below two different amounts of room, so the whole screen moved
   between questions. On a phone that is most of the screen jumping every
   time you answer.

   The box is a fixed height in CSS (dino-ui.css §36). This shrinks the TEXT
   until it fits that box instead of letting the text set the height. Binary
   search rather than a step-down loop: a long question is 6-7 measurements,
   not 20, and each measurement forces a layout.

   The font size is written as an inline style on purpose — it is a computed,
   per-question value, which is the category the inline-style rule in the
   architecture doc explicitly allows (a bar percentage, a per-powerup hue). */
function fitText(el,maxPx,minPx){
  if(!el)return;
  el.style.fontSize='';
  const fits=()=>el.scrollHeight<=el.clientHeight+1&&el.scrollWidth<=el.clientWidth+1;
  el.style.fontSize=maxPx+'px';
  if(fits())return maxPx;
  let lo=minPx,hi=maxPx,best=minPx;
  while(lo<=hi){
    const mid=(lo+hi)>>1;
    el.style.fontSize=mid+'px';
    if(fits()){best=mid;lo=mid+1;}else hi=mid-1;
  }
  el.style.fontSize=best+'px';
  return best;
}
function fitQuestion(){
  const el=document.getElementById('q-text');
  if(!el)return;
  /* the ceiling is whatever the stylesheet wants at this width, so the phone
     and the laptop keep their own type scale and only the overflow case
     changes; the floor is the smallest size still comfortably readable */
  el.style.fontSize='';
  const max=Math.round(parseFloat(getComputedStyle(el).fontSize))||18;
  /* 9px is the floor for the question — below that it stops being readable,
     and a question long enough to need less than that scrolls in its box
     instead (dino-ui.css §36 keeps overflow-y:auto for exactly that case) */
  fitText(el,max,9);
}
function fitChoices(){
  document.querySelectorAll('#choices-grid .choice').forEach(b=>{
    b.style.fontSize='';
    const max=Math.round(parseFloat(getComputedStyle(b).fontSize))||14;
    fitText(b,max,8);
  });
}

/* ── a boss reward that fires itself ──────────────────────────────────────
   `G._autoUsePending` is a power-up you were awarded but do not carry. It is
   not inventory: it never shows in the rail and never stacks. It waits here
   for a battle that is genuinely live and then goes off on its own.

   How this knows whether it worked: every successful branch of usePowerup
   decrements G.inv[type], and every refusal — energy lock, a sealed item,
   THE EROSION banning multiplication, an immune enemy — returns without
   touching it. So the charge itself is the receipt. If it was not spent the
   pending type stays put and the next battle tries again, which is the one
   thing both earlier versions got wrong: neither of them could tell a use
   that happened from a use that was refused.

   G._autoUsePending is deliberately NOT in scrubBattleState — a reward that
   has not been handed over yet has to survive a save. */
function tryAutoUse(){
  if(typeof G==='undefined'||!G||!G._autoUsePending)return;
  const t=G._autoUsePending;
  if(!PU[t]){G._autoUsePending=null;return;}
  /* not a moment it could land in — leave it pending and come back */
  if(!G.inBattle||G.animLock||G.bossHP<=0||G.playerHP<=0)return;
  const had=G.inv[t]||0;
  G.inv[t]=had+1;
  try{
    G._forcePU=true;                  // an award is not a choice the player made
    usePowerup(t);
  }catch(e){}
  finally{ G._forcePU=false; }
  const fired=(G.inv[t]||0)<=had;
  G.inv[t]=had;                       // no charge is ever left behind, either way
  if(fired)G._autoUsePending=null;
  renderInventory();
}

function renderChoices(){
  const grid=document.getElementById('choices-grid'),lets=['A','B','C','D','E','F'];
  const n=getChoiceCount();
  grid.innerHTML='';
  grid.style.removeProperty('grid-template-columns');
  grid.classList.toggle('six', n===6);
  grid.classList.toggle('four', n!==6);
  grid.classList.toggle('blinded',G.activeEffects.some(e=>e.type==='blindness'));
  G.currentQ.built.forEach((c,i)=>{
    const isPetrified=G.petrified&&G.petrified.includes(i);
    const btn=document.createElement('button');
    btn.className='choice'+(G.eliminated.includes(i)?' eliminated':'')+(isPetrified?' petrified':'');
    btn.disabled=G.eliminated.includes(i)||isPetrified;
    btn.innerHTML=isPetrified?`<span class="c-letter">${lets[i]}</span>🪨 PETRIFIED`:`<span class="c-letter">${lets[i]}</span>${c}`;
    if(!isPetrified)btn.onclick=()=>onAnswer(c,btn,i);
    grid.appendChild(btn);
  });
    grid.querySelectorAll('.choice').forEach(b=>{
    const len=((b.textContent||'').trim().length)-1;   // -1 for the A/B/C letter
    b.classList.remove('len-m','len-l','len-x');
    if(len>60)b.classList.add('len-x');
    else if(len>36)b.classList.add('len-l');
    else if(len>20)b.classList.add('len-m');
  });
  /* the len-* classes are a coarse first pass; this is the guarantee */
  requestAnimationFrame(fitChoices);
}

function startTimer(){
  const el=document.getElementById('q-timer');
  if(!G.timedMode){
    G.timerVal=9999;
    el.textContent='∞';el.className='q-timer';
    clearInterval(G.timerInterval);
    return;
  }
  const dur=getTimerDur();
  G.timerVal=dur;
  el.textContent=dur;el.className='q-timer';
  clearInterval(G.timerInterval);
  G.timerInterval=setInterval(()=>{
    G.timerVal--;
    el.textContent=G.timerVal;
    if(G.timerVal<=5)el.className='q-timer urgent';
    if(G.timerVal<=3)sfx.tick();
    if(G.timerVal<=0){clearInterval(G.timerInterval);onTimeout();}
  },1000);
}
/* The clock before anything modifies it. enemyHPFor sizes the enemy pool off
   estPlayerHit(), which read getTimerDur() — so equipping a timeBonus attribute
   quietly made every enemy slightly tougher, and being SLOWED made them
   slightly weaker. Neither is intended; the pool should not move with your
   buffs at all. */
function baseTimerDur(){ return {easy:30,medium:20,hard:12}[G.diff]||20; }

function getTimerDur(){
  let d=baseTimerDur();
  if(G&&G.activeEffects&&G.activeEffects.some(e=>e.type==='playerSlowed'))d=Math.max(6,Math.round(d*0.6));
  if(typeof attrFX==='function'&&G&&G.attrsEquipped)d+=attrFX().timeBonus||0;
  return d;
}

/* ── CHILL PARITY ──────────────────────────────────────────────────────────
   Timed and Chill are locked for the whole run, so anything that reads the
   clock is dead weight for half the players and the game never says so.
   Chill removes the clock, not the discipline: every clock-reading system
   below gets a Chill-side equivalent that measures the same thing.

   timeBonus is the clearest case. In Timed it buys seconds. In Chill there are
   no seconds to buy, so it buys the same thing the seconds bought — room to
   think — as a chance that one wrong answer is already crossed out when the
   question arrives. 8% per +1s, so Infinite Loop + Woven Fate is 24%.
   At THE UNWRITTEN it does something else again; see W2.penThreshold. */
const CHILL_ELIM_PER_SEC = 0.08;
function chillElimChance(){
  if(!G || G.timedMode) return 0;
  if(G._endGauntlet) return 0;              // the END pays timeBonus differently
  const tb=(typeof attrFX==='function' && G.attrsEquipped) ? (attrFX().timeBonus||0) : 0;
  return Math.min(0.5, tb*CHILL_ELIM_PER_SEC);
}


function nextQ(){
if(G._session !== _battleSession) return;
  clearInterval(G.timerInterval);G.eliminated=[];
  tickEffects();renderEffects();updateBars();
  if(G.playerHP<=0){endGame(false);return;}
  if(G.bossHP<=0){handleLevelWin();return;}

  const pFrz=G.activeEffects.find(e=>e.type==='playerFreeze'||e.type==='playerParalyze');
  if(pFrz){
    pFrz.turns--;
    if(pFrz.turns<=0)G.activeEffects=G.activeEffects.filter(e=>e!==pFrz);
    renderEffects();updateBars();
    setMsg('⚡ You are paralyzed! Turn skipped!','var(--cyan)');
    setTurnIndicator(false);
    setTimeout(()=>bossAttacks(()=>{if(G.playerHP>0)setTimeout(nextQ,500);}),900);
    return;
  }

  const q=pickQ();G.currentQ=q;G.currentQ.built=buildChoices(q);
  G.petrified=[];
  if(STAGES[G.curStage].elem==='earth'&&Math.random()<0.35){
    const wrongIdx=q.built.map((c,i)=>i).filter(i=>q.built[i]!==q.a);
    if(wrongIdx.length){
      G.petrified.push(wrongIdx[Math.floor(Math.random()*wrongIdx.length)]);
      const _lv=STAGES[G.curStage].levels[G.curLevel];
      const _src=ELEM_SOURCE.earth;
      spawnFloat(`${_src.icon} ${_src.name}`,'var(--amber)',true);
      queueMsg(`⚠ ${_lv.sub}'s ${_src.name}!`,'var(--amber)',700);
      setTimeout(()=>queueMsg('🪨 One choice has turned to STONE — it cannot be picked!','var(--amber)',900),620);
    }
  }
  const tag=document.getElementById('q-diff-tag');
  tag.textContent=q.tier.toUpperCase();tag.className=`q-tag q-diff-${q.tier}`;
  document.getElementById('q-type-tag').textContent=q.type.toUpperCase();
  document.getElementById('q-text').textContent=q.q;
  /* after the text is in, before the frame paints */
  requestAnimationFrame(fitQuestion);
  /* an awarded power-up goes off here — late enough that the question is up
     and the player sees it happen, rather than during the level transition */
  setTimeout(tryAutoUse,700);

  /* CHILL PARITY · timeBonus spends itself here instead of on the clock */
  const _ce=chillElimChance();
  if(_ce>0 && Math.random()<_ce && q.built){
    const wrong=q.built.map((c,i)=>i).filter(i=>q.built[i]!==q.a);
    if(wrong.length>1){
      G.eliminated.push(wrong[Math.floor(Math.random()*wrong.length)]);
      setMsg('🕰 You had time to rule one out.','var(--cyan)');
    }
  }

  renderChoices();setTurnIndicator(true);startTimer();
}

function onAnswer(chosen,btnEl,idx){
  if(G.animLock)return;clearInterval(G.timerInterval);G.animLock=true;
  const correct=chosen===G.currentQ.a;highlightChoices(chosen);
  /* WORLD END · the Unbroken Page judges the answer itself */
  if(window.W2&&W2.judgePage(correct,G.currentQ.tier,G.timedMode?Math.min(1,G.timerVal/getTimerDur()):1))return;

  if(correct){
    sfx.correct();G.streak++;G.combo=Math.min(8,1+Math.floor(G.streak/3));
    G._wrongStreak=0;
        bumpStat('correct');maxStat('bestStreak',G.streak);maxStat('bestCombo',G.combo);
    document.getElementById('sc-streak').textContent=G.streak;
    document.getElementById('sc-combo').textContent=`×${G.combo}`;
    const streakEl=document.getElementById('sc-streak');
    streakEl.classList.remove('streak-pop');void streakEl.offsetWidth;streakEl.classList.add('streak-pop');

    const pIdx=Math.min(Math.floor(G.stagesCleared/3),PLAYER_PASSIVES.length-1);
    const tierBonus={easy:12,medium:22,hard:34}[G.currentQ.tier]||12;
    const timeComponent=G.timedMode?G.timerVal*1.8:getTimerDur()*0.9;
    /* The question base: tier, clock and streak, scaled by combo.
       Combo stays HERE, on the base alone, deliberately — it caps at 8, and an
       always-on x8 on the whole hit would cut every boss to four answers. */
    let dmg=(tierBonus+timeComponent+G.streak*3)*G.combo;

    /* ATK joins the hit BEFORE the multipliers, not after.
       It used to be added last, which meant RAGE, 2x DMG and OVERLOAD only ever
       multiplied the question base — about 328 damage — while the hit itself was
       over a million by World 10. Measured, 2x DMG contributed 12.9% of a World 1
       boss fight and 0.001% of the END. All three were dead weight past World 5
       and their tooltips still promised x2 and x3. Same for the streak milestone.
       Worlds 1-3 barely move: there, the base and pATK are the same order. */
    dmg+=G.pATK;if(pIdx>=1)dmg+=10;if(pIdx>=2)dmg+=14;if(pIdx>=3)dmg+=20;

    if(G.activeEffects.some(e=>e.type==='playerRage'))dmg*=2;
    if([5,10,15,20,25,30].includes(G.streak)){dmg*=1.5;spawnFloat(`🔥 STREAK ${G.streak}!`,'var(--yellow)',false);sfx.powerup();}
    const hasDouble=G.activeEffects.find(e=>e.type==='double');
    if(hasDouble){dmg*=Math.pow(2,hasDouble.stack||1);G.activeEffects=G.activeEffects.filter(e=>e!==hasDouble);}
    const hasOver=G.activeEffects.find(e=>e.type==='overload');
    if(hasOver){dmg*=Math.pow(3,hasOver.stack||1);G.activeEffects=G.activeEffects.filter(e=>e!==hasOver);}
    let crit=false;if(pIdx>=3&&Math.random()<0.15){dmg*=2.5;crit=true;}
    const _af=attrFX();
    dmg*=_af.atkMult;

    /* CHILL PARITY · SLOWED takes 40% of your clock in Timed. In Chill there is
       no clock to take, so the same enemy debuff took nothing at all — worlds 6+
       inflict it and it did nothing for half the players. It now takes the same
       40% off your output instead: same impairment, measured the way this mode
       can measure it. Infinite Loop's immunity covers it in both modes. */
    if(G.timedMode===false && G.activeEffects.some(e=>e.type==='playerSlowed'))
      dmg*=0.6;

    dmg=Math.floor(dmg);

    const stg=STAGES[G.curStage];
    const lv=stg.levels[G.curLevel];
    const pas=stg.pas||{};
    if(G.activeEffects.some(e=>e.type==='freeze'))dmg=Math.floor(dmg*1.2);
    const poisonEff=G.activeEffects.find(e=>e.type==='bossPoison');
    const dodgeReduction=poisonEff?Math.min(pas.dodge||0,(poisonEff.stack||1)*0.05):0;
    const effDodge=Math.max(0,(pas.dodge||0)-dodgeReduction);
    let blocked='';
    if(G.activeEffects.some(e=>e.type==='blindness')&&Math.random()<0.40){dmg=0;blocked='blind';}
    else if(effDodge&&Math.random()<effDodge){dmg=0;blocked='dodge';}
    else{
      if(pas.dr){
        dmg=Math.max(1,Math.floor(dmg*(1-pas.dr)));
        /* DR was completely silent — the player just saw a smaller number and
           had no way to learn why. Say it ONCE per battle; every turn is noise. */
        if(!G._telegraphed)G._telegraphed={};
        if(!G._telegraphed.dr){
          G._telegraphed.dr=1;
          spawnFloat(`ARMOR −${Math.round(pas.dr*100)}%`,'var(--blue)',true,'pasdr');
          if(window.ARENA&&ARENA.ring){const bb=ARENA.box('b');ARENA.ring(bb.cx,bb.cy,26,'#5b8fe0',2);}
        }
      }
      if(pas.thorns&&dmg>0){
        const back=Math.max(1,Math.floor(dmg*pas.thorns));
        G.playerHP=Math.max(0,G.playerHP-back);
        /* ring on the BOSS first, impact on YOU a beat later, so the reflect
           reads as coming from the enemy rather than damage out of nowhere */
        if(window.ARENA&&ARENA.ring){
          const bb=ARENA.box('b');ARENA.ring(bb.cx,bb.cy,30,'#e0834f',3);
          setTimeout(()=>{try{ARENA.impact('p',1);}catch(e){}},120);
        }
        spawnFloat(`-${back}🌵`,'var(--orange)',false);
      }
    }

    if(dmg>0){
      G.bossHP=Math.max(0,G.bossHP-dmg);G.score+=dmg;
      spawnFloat(`-${dmg}${crit?' CRIT!':''}`,'var(--red)',true);
      setMsg(crit?`💥 CRIT! ${dmg} dmg! ×${G.combo}`:`✓ ${dmg} dmg! ×${G.combo}`,'var(--green)');
    }else{
      /* name the passive that ate the hit — "DODGE" alone told the player
         nothing about WHY this enemy keeps avoiding them */
      const stgD=STAGES[G.curStage];
      spawnFloat(blocked==='blind'?'MISS':'DODGE','var(--dim)',true);
      if(blocked==='dodge'&&stgD&&stgD.passive){
        spawnFloat(stgD.passive.label,'var(--cyan)',true,'pasdodge');
        if(window.ARENA&&ARENA.slash){const bb=ARENA.box('b');ARENA.slash(bb.cx,bb.cy,26,'#3fc6e0',1);}
        /* The sidestep used to be fired from here as `aL`, the enemy's own
           ATTACK lunge, in the same tick the player's counter-lunge starts a
           few lines below — the two dinos charged each other and nobody was
           hit. It is now a dodge, and strike() plays it on the strike frame
           (see the `react` argument) so the enemy slips the blow as it
           arrives rather than a beat before it. */
      }
      setMsg(blocked==='blind'?'👁 Blinded — your counter missed!':'💨 The enemy dodged your counter!','var(--dim)');
    }
    const efx=ELEM_FX[stg.elem];
    if(dmg>0&&efx&&Math.random()<efx.chance){
      const src=ELEM_SOURCE[stg.elem]||{name:'STRANGE AURA',icon:'✦'};
      /* 1 ── the ENEMY is announced first, over the enemy */
      spawnFloat(`${src.icon} ${src.name}`,efx.color,true);
      queueMsg(`⚠ ${lv.sub}'s ${src.name} reacts!`,efx.color,720);
      /* 2 ── effect lands NOW (combat math stays correct) but stays quiet */
      const e=addOrStackEffect(efx.type,{turns:efx.turns,hpPerTurn:efx.hpPerTurn});
      e._announced=true;                        // block renderEffects front-running it
      renderEffects();
      /* 3 ── ...and only then reports itself, on the player */
      setTimeout(()=>{
        if(G._session!==_battleSession)return;
        const cfg=EFFECT_LABELS[efx.type];
        const st=(e.stack&&e.stack>1)?` ×${e.stack}`:'';
        spawnFloat(`${efx.icon} ${cfg?cfg.name:''}${st}`.trim(),efx.color,false);
        queueMsg(efx.msg,efx.color,900);
      },620);
    }
    /* The scoreboard shows the score in full again. It was shortened to
       "543.5k" back when the score and the streak were fighting over one
       cramped line; the cell is a two-line stack now (dino-ui.css §31) and
       has the room, so there is no reason to round off the number the player
       is actually watching. fmtScore stays where space is genuinely scarce —
       the results cards and the leaderboard rows. */
    paintScore();

    
        let healAmt=0;if(pIdx===0)healAmt=5;else if(pIdx===2)healAmt=6;else if(pIdx>=3)healAmt=9;
    healAmt=Math.round(healAmt*_af.healMult);
    if(_af.lifesteal>0&&dmg>0)healAmt+=Math.round(dmg*_af.lifesteal);
    if(healAmt>0){
      const _b=G.playerHP;
      G.playerHP=Math.min(G.playerMaxHP,G.playerHP+healAmt);
      const _real=G.playerHP-_b;                  // clamp FIRST, then report
      if(_real>0)spawnFloat(`+${_real}`,'var(--green)',false);
    }
    updateBars();renderEffects();

    if(G.playerHP<=0){G.animLock=false;sfx.gameover();setTimeout(()=>endGame(false),400);return;}

    const drop=rollDrop(G.streak,G.diff);
    if(drop){G.inv[drop]=(G.inv[drop]||0)+1;renderInventory();sfx.powerup();setMsg(`Drop: ${PU[drop].icon} ${PU[drop].name}!`,'var(--green)');}
    /* The win used to return HERE — before the strike below — so the one blow
       that actually killed the enemy was the only blow in the fight that never
       animated. The enemy just stopped existing mid-turn. Swing first: the
       poke lands, the enemy flinches on the strike frame, and only then does
       handleLevelWin play its `dying` collapse. */
    /* flinch only if the blow actually landed; sidestep if it was dodged;
       nothing at all if the player was blinded and swung at air. The enemy
       can still die on a turn it dodged the counter — poison finishing it —
       so the killing blow needs this too rather than assuming a hit. */
    const _react=(dmg>0)?'aS':(blocked==='dodge'?'aD':null);

    if(G.bossHP<=0){strike('player-f','boss-f',()=>{G.animLock=false;handleLevelWin();},_react);return;}

    /* was: lunge (950ms) → THEN the enemy flinches (800ms) → THEN a 400ms
       pause → the enemy's turn. 2.15s of animation for one exchange, with the
       reaction arriving long after the blow. strike() overlaps the two. */
    strike('player-f','boss-f',()=>{setTurnIndicator(false);
      setTimeout(()=>bossAttacks(()=>{G.animLock=false;if(G.playerHP>0)setTimeout(nextQ,500);}),380);},_react);

  } else {
    sfx.wrong();G.streak=0;G.combo=Math.max(1,G.combo-1);
    G._wrongStreak=(G._wrongStreak||0)+1;
    /* DEVOTION — three wrong on purpose while barely scratched. The old
       >=10 with no HP test was unreachable: you are dead long before it. */
    if(window.W2&&G._wrongStreak>=3&&G.playerMaxHP>0&&
       G.playerHP/G.playerMaxHP>=0.95)W2.findSecret('devotion');
        bumpStat('wrong');
    document.getElementById('sc-streak').textContent=0;
    document.getElementById('sc-combo').textContent=`×${G.combo}`;
    document.getElementById('sc-streak').classList.remove('streak-pop');
    setMsg(`✗ Wrong! Answer: ${G.currentQ.a} — Enemy attacks!`,'var(--red)');
    setTurnIndicator(false);
    setTimeout(()=>bossAttacks(()=>{G.animLock=false;if(G.playerHP>0)setTimeout(nextQ,400);}),700);
  }
}


function onTimeout(){
if(G._session !== _battleSession)return;
if(G.animLock)return;
clearInterval(G.timerInterval);
sfx.wrong();
G.streak=0;setMsg(`⏱ Time's up! Answer: ${G.currentQ.a}`,'var(--red)');highlightChoices(null);
setTurnIndicator(false);setTimeout(()=>bossAttacks(()=>{
G.animLock=false;if(G.playerHP>0)setTimeout(nextQ,500);
}),800);
}
function highlightChoices(chosen){document.querySelectorAll('.choice').forEach(btn=>{const txt=btn.textContent.slice(1).trim();if(chosen&&txt===G.currentQ.a)btn.classList.add('correct');else if(txt===chosen)btn.classList.add('wrong');else btn.classList.add('dimmed');btn.disabled=true;});}

const CONTROL_BREAK_CHANCE=0.12;
function tryBreakControl(effType){
  const e=G.activeEffects.find(x=>x.type===effType);
  if(!e)return false;
  if(Math.random()<CONTROL_BREAK_CHANCE){
    G.activeEffects=G.activeEffects.filter(x=>x!==e);
    renderEffects();
    return true;
  }
  return false;
}

const BURN_SUPPRESS    ={normal:0.60,mini:0.35,boss:0.20};
const BURN_SUPPRESS_CAP={normal:0.85,mini:0.60,boss:0.40};
function burnSuppressFor(tier,assume){
  const e=G.activeEffects&&G.activeEffects.find(x=>x.type==='bossBurn');
  if(!e&&!assume)return 0;
  const resBurn=((STAGES[G.curStage]||{}).res||{}).burn;
  if(resBurn===0)return 0;                       // burn-immune enemy = no suppression
  const stack=e?Math.max(1,e.stack||1):1;
  const base=BURN_SUPPRESS[tier]||0.60;
  let v=base+(stack-1)*base*0.25;                // extra stacks help a little
  if(resBurn!=null)v*=resBurn;                   // burn-resistant enemies suppress less
  return Math.min(BURN_SUPPRESS_CAP[tier]||0.85,v);
}

function bossAttacks(cb){
if(G._session !== _battleSession){ G.animLock=false; return; }
  const stg=STAGES[G.curStage],lv=stg.levels[G.curLevel],pas=stg.pas||{};

  const stunned=G.activeEffects.find(e=>e.type==='stun');
  if(stunned){
    stunned.turns--;if(stunned.turns<=0)G.activeEffects=G.activeEffects.filter(e=>e!==stunned);
    renderEffects();setMsg('💫 Enemy is STUNNED! Skips attack — no resistance can stop this!','var(--yellow)');
    doAnim('boss-f','aS',()=>{if(cb)cb();});return;
  }
  const frozen=G.activeEffects.find(e=>e.type==='freeze');
  if(frozen){
    if(tryBreakControl('freeze')){
      setMsg(`💢 ${lv.sub} SHATTERS the ice!`,'var(--red)');
    }else{
      frozen.turns--;if(frozen.turns<=0)G.activeEffects=G.activeEffects.filter(e=>e!==frozen);
      renderEffects();showFreezeOverlay();setMsg(`❄ ${lv.sub} FROZEN! Skips! (+20% dmg on your next hit)`,'var(--blue)');
      doAnim('boss-f','aS',()=>{if(cb)cb();});return;
    }
  }
  const para=G.activeEffects.find(e=>e.type==='paralyze');
  if(para){
    if(tryBreakControl('paralyze')){
      setMsg(`💢 ${lv.sub} POWERS THROUGH the paralysis!`,'var(--red)');
    }else{
      para.turns--;
      if(para.turns<=0){
        if(Math.random()<0.30){
          para.turns=1;
          renderEffects();showParalyzeOverlay();setMsg(`⚡ ${lv.sub} PARALYZED! Chains into ANOTHER skipped turn!`,'var(--cyan)');
        }else{
          G.activeEffects=G.activeEffects.filter(e=>e!==para);
          renderEffects();showParalyzeOverlay();setMsg(`⚡ ${lv.sub} PARALYZED! Skips!`,'var(--cyan)');
        }
      }else{
        renderEffects();showParalyzeOverlay();setMsg(`⚡ ${lv.sub} PARALYZED! Skips!`,'var(--cyan)');
      }
      doAnim('boss-f','aS',()=>{if(cb)cb();});return;
    }
  }

  G.bossAtkCounter++;
  if(stg.spFn)stg.spFn(G);
  const tier=tierOf(lv);
const bSup=burnSuppressFor(tier);
    if(pas.regen&&G.bossHP<G.bossMaxHP){
    let h=Math.max(1,Math.round(G.bossMaxHP*pas.regen));
    h=Math.round(h*(1-bSup));
    /* DESALINATE answers the first enemy heal of the battle. If it is not
       armed (worlds 1-5, Training, already spent) this is a no-op and the
       heal lands exactly as before. */
    if(h>0&&!(window.W2&&W2.reactiveTry&&W2.reactiveTry('enemyHeal'))){
      G.bossHP=Math.min(G.bossMaxHP,G.bossHP+h);spawnFloat(`+${h}`,'var(--green)',true);}
  }


    /* ── BOSS ATTRIBUTES: player regen per turn ── */
  const _rg=attrFX().regen;
  if(_rg>0&&G.playerHP<G.playerMaxHP){
    const ph=Math.max(1,Math.round(G.playerMaxHP*_rg));
    G.playerHP=Math.min(G.playerMaxHP,G.playerHP+ph);
    spawnFloat(`+${ph}🕳️`,'var(--cyan)',false);
  }

  /* ── ENEMY ACCURACY: they can whiff, the same way you can dodge ── */
  const MISS_CHANCE={normal:0.12,mini:0.09,boss:0.06};
  if(Math.random()<(MISS_CHANCE[tier]||0.10)){
    spawnFloat('MISS','var(--cyan)',false);
    setMsg(`💨 ${lv.sub} lunges and MISSES completely!`,'var(--cyan)');
    doAnim('boss-f','aL',()=>{if(cb)cb();});
    return;
  }

  let dmg=Math.floor(Math.random()*(G.bossAtkMax-G.bossAtkMin+1))+G.bossAtkMin;
  dmg=Math.floor(dmg*(G.rageMult||1));

  /* ── MOMENTUM: 1st, 3rd, 5th, 7th… connected hit presses harder ── */
  let momentum=0;
  if(G.bossAtkCounter%2===1){
    momentum=Math.min(0.60,0.10*Math.ceil(G.bossAtkCounter/2));
    dmg=Math.floor(dmg*(1+momentum));
  }

  let enemyCrit=false,truePen=false;
  if(Math.random()<(ENEMY_CRIT_CHANCE[tier]||0.08)){enemyCrit=true;dmg=Math.floor(dmg*ENEMY_CRIT_MULT);}
  if(Math.random()<(ENEMY_TRUEDMG_CHANCE[tier]||0.04))truePen=true;

  const vulnerable=G.activeEffects.find(e=>e.type==='playerVulnerable');
  if(vulnerable){dmg=Math.floor(dmg*(1+vulnerable.mult));G.activeEffects=G.activeEffects.filter(e=>e!==vulnerable);}

  // cap AFTER every multiplier (rage, crit, exposed) has been applied,
  // so it's a true ceiling instead of a floor that gets blown past
  dmg=Math.min(dmg,Math.round(G.playerMaxHP*HIT_CAP[tier]));

  if(G.pRES>0&&!truePen)dmg=Math.floor(dmg*(1-resMitigation(G.pRES)));
  dmg=Math.max(1,dmg);

  const barrier=G.activeEffects.find(e=>e.type==='barrier');
  if(barrier){
    barrier.turns--;if(barrier.turns<=0)G.activeEffects=G.activeEffects.filter(e=>e!==barrier);
    renderEffects();setMsg('🧱 BARRIER blocks all damage!','var(--blue)');
    doAnim('boss-f','aS',()=>{if(cb)cb();});return;
  }

  const mirror=G.activeEffects.find(e=>e.type==='mirror');
  if(mirror){
    const reflect=dmg*(mirror.stack||1);
    G.activeEffects=G.activeEffects.filter(e=>e!==mirror);
    G.bossHP=Math.max(0,G.bossHP-reflect);
    spawnFloat(`-${reflect}🪞`,'var(--teal)',true);
    setMsg(`🪞 MIRROR ×${mirror.stack||1} reflects ${reflect} back!`,'var(--teal)');
    updateBars();renderEffects();
    if(G.bossHP<=0){handleLevelWin();return;}
    doAnim('boss-f','aS',()=>{if(cb)cb();});return;
  }

  const shield=G.activeEffects.find(e=>e.type==='shield');
  if(shield){
    const block=shield.block||0.5;
    dmg=Math.max(1,Math.floor(dmg*(1-block)));
    shield.turns--;if(shield.turns<=0)G.activeEffects=G.activeEffects.filter(e=>e!==shield);
    renderEffects();showShieldGlow();setMsg(`🛡 SHIELD ×${shield.stack||1} blocks ${Math.round(block*100)}%! Only ${dmg} dmg!`,'var(--teal)');
  } else {
    let tag='';
    if(enemyCrit)tag+=' 💥CRIT!';
    if(truePen)tag+=' 🗡TRUE DMG!';
    if(vulnerable)tag+=' 💢EXPOSED!';
    if(momentum>0)tag+=` ⚡MOMENTUM ×${(1+momentum).toFixed(1)}`;
    setMsg(`${lv.sub} strikes for ${dmg}!${tag}`,(enemyCrit||truePen)?'var(--red)':'var(--orange)');
  }

  /* ── BOSS ATTRIBUTES: dodge / damage reduction ── */
  const _ai=attrIncoming(dmg);
  if(_ai.dodged){
    dmg=0;
    spawnFloat('DODGE','var(--cyan)',false);
    setMsg('💨 DODGED! Your boss attribute negated the hit!','var(--cyan)');
  }else{
    dmg=_ai.dmg;
  }

  const _hpBefore=G.playerHP;
  G.playerHP=Math.max(0,G.playerHP-dmg);
  const dmgTaken=_hpBefore-G.playerHP;

  if(dmgTaken>0){
    spawnFloat(`-${dmgTaken}${enemyCrit?' CRIT':''}${truePen?' TRUE':''}`,(enemyCrit||truePen)?'var(--red)':'var(--orange)',false);sfx.hit();
  }

  /* ── BOSS ATTRIBUTES: thorns / reflect ── */
  if(_ai.reflect>0&&dmgTaken>0){
    G.bossHP=Math.max(0,G.bossHP-_ai.reflect);
    spawnFloat(`-${_ai.reflect}🌌`,'var(--purple)',true);
  }

  /* enemy lifesteal now uses HP ACTUALLY LOST, so shields/DR/dodge reduce it too */
   if(pas.lifesteal&&dmgTaken>0){
    let h=Math.round(dmgTaken*pas.lifesteal*(1-bSup));
    if(h>0&&!(window.W2&&W2.reactiveTry&&W2.reactiveTry('enemyHeal'))){
      G.bossHP=Math.min(G.bossMaxHP,G.bossHP+h);spawnFloat(`+${h}🩸`,'var(--green)',true);
  }
}

  if(G.playerHP<=0&&G.inv.revive>0){
    G.inv.revive--;G.playerHP=Math.max(1,Math.round(G.playerMaxHP*0.25));
    renderInventory();setMsg(`🍖 REVIVE! Back at ${G.playerHP} HP!`,'var(--pink)');sfx.powerup();
  }
  if(G.bossHP<=0&&G.playerHP>0){updateBars();handleLevelWin();return;}

  strike('boss-f','player-f',()=>{
    updateBars();
    if(G.playerHP<=0){sfx.gameover();setTimeout(()=>endGame(false),400);return;}
    if(cb)cb();
  },(dmgTaken>0)?'aS':(_ai.dodged?'aD':null));
}



function showShieldGlow(){const el=document.getElementById('player-spr');const gl=document.createElement('div');gl.className='shield-glow';el.appendChild(gl);setTimeout(()=>gl.remove(),900);}
function doHealAura(amt,label){
  const el=document.getElementById('player-spr');
  if(!el)return 0;

  // clamp FIRST, then report only what actually went in
  const before=G.playerHP;
  G.playerHP=Math.min(G.playerMaxHP,G.playerHP+Math.max(0,amt||0));
  const gained=G.playerHP-before;

  const a=document.createElement('div');
  a.className='heal-aura';
  el.appendChild(a);

  const f=document.createElement('div');
  f.className='heal-float';
  if(gained>0)   f.textContent=`+${gained} HP`;
  else if(label) f.textContent=label;      // buff applied, no HP to gain
  else           f.textContent='MAX HP';
  el.appendChild(f);

  updateBars();
  setTimeout(()=>{a.remove();f.remove();},900);
  return gained;                            // callers can use the real number
}

function tickEffects(){
  const res=STAGES[G.curStage].res||{};
  const _af=attrFX();
  const _dotScale=1-_af.dotRes;
  const managedElsewhere=new Set([
    'double','overload','mirror',
    'shield','freeze','paralyze','stun','barrier',
    'playerFreeze','playerParalyze'
  ]);
  G.activeEffects=G.activeEffects.filter(e=>{
    /* ── BOSS ATTRIBUTES: hard immunities purge the effect ── */
    if(e.type==='playerBurn'&&_af.immune.burn){spawnFloat('IMMUNE 🔥','var(--cyan)',false);return false;}
    if(e.type==='playerParalyze'&&_af.immune.paralyze){spawnFloat('IMMUNE ⚡','var(--cyan)',false);return false;}
    if(e.type==='playerFreeze'&&_af.immune.freeze){spawnFloat('IMMUNE ❄','var(--cyan)',false);return false;}
    if(e.type==='playerSlowed'&&_af.immune.slowed){spawnFloat('IMMUNE 🐢','var(--cyan)',false);return false;}
    if(e.type==='playerRegen'){G.playerHP=Math.min(G.playerMaxHP,G.playerHP+e.hpPerTurn);spawnFloat(`+${e.hpPerTurn}💉`,'var(--green)',false);}
    if(e.type==='playerRage'){const rc=rageCostFor();G.playerHP=Math.max(1,G.playerHP-rc);spawnFloat(`-${rc}😤`,'var(--red)',false);}
    if(e.type==='bossPoison'||e.type==='bossBurn'){
      const key=e.type==='bossPoison'?'poison':'burn',r=res[key];
      let d=e.hpPerTurn;
      if(r===0){spawnFloat('IMMUNE','var(--dim)',true);}
      else{if(r!=null)d=Math.max(1,Math.floor(d*r));G.bossHP=Math.max(0,G.bossHP-d);spawnFloat(`-${d}${key==='poison'?'☠':'🔥'}`,key==='poison'?'var(--purple)':'var(--orange)',true);}
    }
    if(e.type==='playerPoison'||e.type==='playerBurn'){
      /* ── BOSS ATTRIBUTES: DoT resistance ── */
      const d=Math.max(1,Math.round(e.hpPerTurn*_dotScale));
      G.playerHP=Math.max(0,G.playerHP-d);
      spawnFloat(`-${d}${e.type==='playerPoison'?'☠':'🔥'}`,e.type==='playerPoison'?'var(--purple)':'var(--orange)',false);
    }
    if(managedElsewhere.has(e.type)){
      /* hit-based effects can stall forever if the enemy never connects — give them a fuse */
      if(e._life==null)e._life=(e.turns||1)+HIT_EFFECT_GRACE;
      e._life--;
      if(e._life<=0||e.turns<=0){announceEffectEnd(e);return false;}
      return true;
    }
    e.turns--;
    if(e.turns<=0){announceEffectEnd(e);return false;}
    return true;
  });
}



const EFFECT_LABELS={
  double:{name:'2×DMG',bar:'var(--yellow)'},
  overload:{name:'OVERLOAD ×3',bar:'var(--yellow)'},
  mirror:{name:'MIRROR',bar:'var(--teal)'},
  freeze:{name:'FROZEN',bar:'var(--blue)'},
  paralyze:{name:'PARALYZED',bar:'var(--cyan)'},
  stun:{name:'STUNNED',bar:'var(--yellow)'},
  bossPoison:{name:'POISONED',bar:'var(--purple)'},
  bossBurn:{name:'BURNED',bar:'var(--orange)'},
  shield:{name:'SHIELD',bar:'var(--teal)'},
  barrier:{name:'BARRIER',bar:'var(--blue)'},
  playerPoison:{name:'U-POISON',bar:'var(--purple)'},
  playerBurn:{name:'U-BURN',bar:'var(--orange)'},
  playerFreeze:{name:'U-FREEZE',bar:'var(--blue)'},
  playerParalyze:{name:'U-PARA',bar:'var(--cyan)'},
  playerRegen:{name:'REGEN',bar:'var(--green)'},
  playerRage:{name:'RAGE ATK×2',bar:'var(--red)'},
  playerSlowed:{name:'SLOWED −40% TIME',bar:'var(--amber)'},
  playerEnergyLock:{name:'SKILLS LOCKED',bar:'var(--yellow)'},
  itemSeal:{name:'ITEMS SEALED',bar:'var(--grey)'},
  blindness:{name:'BLIND 40% MISS',bar:'var(--purple)'},
  playerVulnerable:{name:'EXPOSED +20% DMG TAKEN',bar:'var(--red)'},
};
const EFFECT_TARGET_BOSS=new Set(['freeze','paralyze','stun','bossPoison','bossBurn']);

function announceNewEffects(){
  G.activeEffects.forEach(e=>{
    if(e._announced)return;
    e._announced=true;
    const cfg=EFFECT_LABELS[e.type];
    if(!cfg)return;
    const isBoss=EFFECT_TARGET_BOSS.has(e.type);
    const stackTxt=(e.stack&&e.stack>1)?` ×${e.stack}`:'';
    /* Passing the effect type makes this float replace its own predecessor,
       so re-using REGEN reads REGEN → REGEN ×2 → ×3 → ×4 as one escalating
       message instead of a pile of identical copies. */
    spawnFloat(`${cfg.name}${stackTxt}`,cfg.bar,isBoss,e.type);
  });
}

/* The icons under each fighter. Pulled out of renderEffects because the
   no-effects branch used to `return` before reaching them — so when the LAST
   effect expired the chip row correctly said "No effects" while the burn or
   poison icon stayed sitting under the dino for the rest of the battle, until
   some unrelated effect happened to re-run the code below. The status row has
   to be rewritten on every render, including the render that clears it. */
function renderFighterStatus(){
  /* No inline size or vertical-align here on purpose. luc() writes
     `vertical-align:-3px`, which parks the glyph 3px below the text baseline —
     and the baseline of this row moves with whatever font metrics the browser
     actually has. dino-ui.css §17 sizes and centres these with flexbox. */
  const _sic=n=>`<span class="sicon"><i data-lucide="${n}"></i></span>`;
  const _has=t=>G.activeEffects.some(e=>e.type===t);
  const b=document.getElementById('boss-stat'), p=document.getElementById('player-stat');
  if(b)b.innerHTML=
    (_has('bossPoison')?_sic('skull'):'')+
    (_has('bossBurn')?_sic('flame'):'')+
    (_has('freeze')?_sic('snowflake'):'')+
    (_has('paralyze')?_sic('zap'):'');
  if(p)p.innerHTML=
    (_has('shield')?_sic('shield'):'')+
    (_has('playerPoison')?_sic('skull'):'')+
    (_has('playerBurn')?_sic('flame'):'')+
    ((_has('playerParalyze')||_has('playerFreeze'))?_sic('zap'):'');
  /* only pay for a Lucide pass when there is actually a new <i> to inflate */
  if((b&&b.querySelector('i[data-lucide]'))||(p&&p.querySelector('i[data-lucide]')))refreshIcons();
}

function renderEffects(){
  announceNewEffects();
  const rows=document.getElementById('effect-rows');
  if(!G.activeEffects.length){
    if(!rows.querySelector('.fx-none'))
      rows.innerHTML='<span class="fx-none">No effects</span>';
    renderFighterStatus();          // ← the line whose absence was the bug
    return;
  }

  /* Reconcile instead of rebuilding. This used to be a wholesale innerHTML
     swap, and renderEffects is called from ~10 places per turn, so any CSS
     animation on a chip restarted before it could play. Keying by e.type is
     free: addOrStackEffect is find-or-create BY TYPE, so it is already
     unique per live effect (and no new field is stored, which keeps old
     saves working). */
  let created=false;
  const want=new Map(G.activeEffects.map(e=>[e.type,e]));
  [...rows.children].forEach(el=>{
    const k=el.dataset&&el.dataset.fxId;
    if(!k) return el.remove();                 // the "No effects" placeholder
    if(!want.has(k)&&!el.classList.contains('fx-chip-out')){
      el.classList.add('fx-chip-out');
      setTimeout(()=>el.remove(),260);
    }
  });
  want.forEach((e,type)=>{
    const c=EFFECT_LABELS[type]||{name:type,bar:'#fff'};
    const iconName=EFFECT_ICON_MAP[type]||'sparkles';
    const t=['double','overload','mirror'].includes(type)?'NEXT':`${e.turns}t`;
    const stackTxt=(e.stack&&e.stack>1)?` ×${e.stack}`:'';
    let el=rows.querySelector('[data-fx-id="'+type+'"]:not(.fx-chip-out)');
    if(!el){
      el=document.createElement('span');
      el.className='fx-chip fx-chip-in';
      el.dataset.fxId=type;
      /* layout lives in CSS (.fx-chip); only the per-effect hue is dynamic */
      el.style.setProperty('--fx-hue',c.bar);
      el.innerHTML=`${luc(iconName,12)} <span class="fx-lbl"></span> <b class="fx-t"></b>`;
      rows.appendChild(el); created=true;
    }
    const lbl=el.querySelector('.fx-lbl'), tt=el.querySelector('.fx-t');
    const newLbl=c.name+stackTxt;
    if(lbl&&lbl.textContent!==newLbl) lbl.textContent=newLbl;
    if(tt&&tt.textContent!==t) tt.textContent=t;
    /* a stack that climbed gets one pump — restart it the same way the rest
       of the file does (remove → force reflow → add) */
    const st=String(e.stack||1);
    if(el.dataset.stack!==undefined && el.dataset.stack!==st){
      el.classList.remove('fx-chip-pump'); void el.offsetWidth; el.classList.add('fx-chip-pump');
    }
    el.dataset.stack=st;
    /* looping, so it cannot be restarted into invisibility by a re-render */
    el.classList.toggle('fx-chip-expiring', !!(e.turns&&e.turns<=1));
  });

  renderFighterStatus();
  /* a newly created chip carries its own <i> and needs a Lucide pass of its
     own; renderFighterStatus handles the case where only the status row did */
  if(created)refreshIcons();
}


/* ══ POWERUP SCALING ══
   Flat magnitudes are replaced by % of the relevant max HP, so a powerup is
   worth the same FRACTION of a fight in World 5 as it was in World 1.
   The Math.max floors keep World 1 numbers identical to the old behaviour. */
function healAmtFor(){  return Math.max(30,Math.round(G.playerMaxHP*0.06));  }
function regenAmtFor(){ return Math.max(8, Math.round(G.playerMaxHP*0.025)); }
function rageCostFor(){ return Math.max(5, Math.round(G.playerMaxHP*0.010)); }
function poisonAmtFor(){return Math.max(12,Math.round((G.bossMaxHP||0)*0.025));}
function burnAmtFor(){  return Math.max(8, Math.round((G.bossMaxHP||0)*0.018));}
/* how much BURN suppresses enemy regen / lifesteal — weak on bosses */



/* world tier label, for UI only */
function puTier(){
  const w=(STAGES[G.curStage]&&STAGES[G.curStage].world)||1;
  return ['I','II','III','IV','V'][w-1]||'I';
}


// Merges a re-used powerup into its existing effect instead of duplicating it.
// stack = how many times it's been applied; magnitude fields scale with it.
const STACK_CFG={
  bossPoison:{turnsAdd:4,magKey:'hpPerTurn',magBase:poisonAmtFor,cap:5},
  bossBurn:{turnsAdd:3,magKey:'hpPerTurn',magBase:burnAmtFor,cap:5},
  playerVulnerable:{turnsAdd:2,magKey:'mult',magBase:0.2,cap:3},
  shield:{turnsAdd:3,magKey:'block',magBase:0.5,cap:3,magCapAt:0.9},
  barrier:{turnsAdd:2,cap:6},
  freeze:{turnsAdd:2,cap:3},
  paralyze:{turnsAdd:2,cap:3},
  stun:{turnsAdd:1,cap:1},
  double:{turnsAdd:1,cap:4},
  /* was cap 3 -> 3^3 = x27. Harmless while OVERLOAD only multiplied the question
     base; now that it multiplies the whole hit, x27 is 26 of the ~30 answers a
     boss takes, so three uses ended any fight outright. x9 sits alongside 2x DMG
     at full stack instead of replacing the fight. */
  overload:{turnsAdd:2,cap:2},
  mirror:{turnsAdd:1,cap:3},
  playerRegen:{turnsAdd:3,magKey:'hpPerTurn',magBase:regenAmtFor,cap:5},
  playerRage:{turnsAdd:3,cap:3},
  /* Enemy-inflicted debuffs. These used to be raw-pushed by every boss spFn,
     which produced one duplicate pill per hit instead of a single ×N pill.
     They now go through addOrStackEffect like everything else, so they need
     explicit caps rather than the {turnsAdd:2,cap:5} fallback. */
  playerSlowed:{turnsAdd:2,cap:3},
  blindness:{turnsAdd:2,cap:3},
  playerEnergyLock:{turnsAdd:2,cap:2},
  playerPoison:{turnsAdd:3,magKey:'hpPerTurn',cap:4},
  playerBurn:{turnsAdd:3,magKey:'hpPerTurn',cap:4},
  playerFreeze:{turnsAdd:2,cap:2},
  playerParalyze:{turnsAdd:2,cap:2},
};

function addOrStackEffect(type,extra){
  extra=extra||{};
  const cfg=STACK_CFG[type]||{turnsAdd:extra.turns||2,cap:5};
  /* The per-stack unit: a configured magBase if there is one, otherwise
     whatever magnitude the caller supplied on the first application. Boss
     spFns pass their own hpPerTurn, so the config must not clobber it. */
  let mb=(typeof cfg.magBase==='function')?cfg.magBase():cfg.magBase;
  if(cfg.magKey&&mb===undefined)mb=extra[cfg.magKey];
  const turns=Math.max(cfg.turnsAdd||1,extra.turns||0);
  let e=G.activeEffects.find(x=>x.type===type);
  if(!e){
    e=Object.assign({type,stack:1},extra,{turns});
    if(cfg.magKey&&mb!==undefined){e[cfg.magKey]=mb;e._unit=mb;}
    G.activeEffects.push(e);
    return e;
  }
  const before=e.stack||1;
  e.stack=Math.min(cfg.cap||5,before+1);
  e.turns=Math.max(e.turns,turns);
  if(cfg.magKey){
    const unit=(e._unit!==undefined)?e._unit:mb;
    if(unit!==undefined){
      const raw=unit*e.stack;
      e[cfg.magKey]=cfg.magCapAt?Math.min(cfg.magCapAt,raw):raw;
    }
  }
  /* A real stack-up is news: let announceNewEffects say "×2", "×3", "×4"
     instead of staying silent because the first application already spoke. */
  if(e.stack>before)e._announced=false;
  return e;
}


function usePowerup(type){
  if(!PU[type])return;
  if(G.animLock)return;
  /* G._forcePU marks a use the player did not choose — a pending GUARDIAN
     firing at 50% HP re-enters this function. It must never be refused by a
     lock the player has no way to answer. */
  if(!G._forcePU){
    if(G.activeEffects.some(e=>e.type==='playerEnergyLock')){
      setMsg('⚡ Your skills are LOCKED!','var(--yellow)');return;
    }
    if(window.SPX&&SPX.isSealed(G,type)){
      setMsg('🔒 '+((PU[type]||{}).name||type)+' is SEALED!','var(--grey)');return;
    }
  }
  if(!G.inv[type]||G.inv[type]<=0)return;
  G._puThisBattle=true;                 // the MARGIN secret wants an empty-handed win
  const res=STAGES[G.curStage].res||{};
  if(type==='halfhp'){const r=res.halfhp;if(r===0){setMsg('💀 IMMUNE!','var(--dim)');return;}const ratio=r||0.5,newHP=Math.floor(G.bossHP*(1-ratio)),dealt=G.bossHP-newHP;G.bossHP=newHP;G.inv[type]--;sfx.halfhp();spawnFloat(`-${dealt} HALF HP!`,'var(--red)',true);setMsg(`💀 HALF HP! Lost ${dealt}${r&&r!==0.5?' (RES)':''}!`,'var(--red)');G.score+=Math.floor(dealt*.5);updateBars();renderInventory();STAGES[G.curStage].spFn&&STAGES[G.curStage].spFn(G);if(G.bossHP<=0)handleLevelWin();return;}
  if(type==='heal'){G.inv[type]--;const g=doHealAura(healAmtFor(),'💚 HEAL');setMsg(`💚 Healed +${g} HP! (Tier ${puTier()})`,'var(--green)');sfx.powerup();renderInventory();return;}
  if(type==='fiftyf'){const ch=G.currentQ.built,wi=ch.map((c,i)=>i).filter(i=>ch[i]!==G.currentQ.a&&!G.eliminated.includes(i));if(wi.length<2){setMsg('Nothing to eliminate!','var(--dim)');return;}shuffle(wi);const removeCount=Math.max(1,Math.ceil(wi.length/2));G.eliminated.push(...wi.slice(0,removeCount));G.inv[type]--;sfx.powerup();setMsg('🎯 50/50!','var(--orange)');renderChoices();renderInventory();return;}
  if(type==='revive'){setMsg('🍖 Revive ready (auto on death).','var(--pink)');return;}

  if(type==='divine'){
    G.inv[type]--;
    const healed=doHealAura(G.playerMaxHP-G.playerHP,'🌟 FULL HP');
    sfx.powerup();setMsg(`🌟 DIVINE! Restored ${healed} HP — full health!`,'var(--yellow)');
    updateBars();renderInventory();return;
  }
    if(type==='gamble'){
      G.inv[type]--;
      const never=['gamble','revive'].concat((window.W2&&W2.NO_RANDOM)||[]);
      /* Sealed types are out of the pool: this hands the rolled item to
         usePowerup below and then zeroes it either way, so rolling a sealed
         one would destroy it against a refusal. */
      /* the roll obeys the same unlock gate as every other source — it was
         able to hand you ANCHOR in World 1 */
      const pool=Object.keys(PU).filter(t=>
        !never.includes(t) && puUnlocked(t) && !(window.SPX&&SPX.isSealed(G,t)));
      if(!pool.length){
        G.inv[type]++;                       // hand the GAMBLE back
        setMsg('Nothing to roll — everything is sealed.','var(--grey)');
        renderInventory();return;
      }
      const picked=pool[Math.floor(Math.random()*pool.length)];
      /* setMsg/spawnFloat are textContent, so no icon markup can go here —
         the name alone, rather than a stray emoji beside lucide everywhere else */
      sfx.powerup();setMsg(`GAMBLE! Auto-using ${PU[picked].name}`,'var(--pink)');
      spawnFloat(PU[picked].name,'var(--pink)',false);
      renderInventory();
      G.inv[picked]=1;
      setTimeout(()=>{
        if(G.inBattle)usePowerup(picked);
        G.inv[picked]=0;
        renderInventory();
      },350);
      return;
  }
  if(type==='nuke'){
      G.inv[type]--;
      const dmg=Math.floor(G.playerMaxHP*0.5);
      G.bossHP=Math.max(0,G.bossHP-dmg);
      sfx.halfhp();spawnFloat(`-${dmg}💣`,'var(--red)',true);
      setMsg(`💣 NUKE! Dealt ${dmg} damage!`,'var(--red)');
      updateBars();renderInventory();
      if(G.bossHP<=0)handleLevelWin();return;
  }
  if(type==='oracle'){
      G.inv[type]--;
      const correct=G.currentQ.a;
      document.querySelectorAll('.choice').forEach(btn=>{
          const txt=btn.textContent.slice(1).trim();
          if(txt===correct)btn.classList.add('choice-oracle');
          else btn.classList.add('choice-faded');
      });
      sfx.powerup();setMsg(`🔮 ORACLE! Correct answer highlighted!`,'var(--purple)');
      renderInventory();return;
  }
  if(type==='insight'){
      if(!G.timedMode){setMsg('👁 No timer running in Chill mode!','var(--dim)');return;}
      G.inv[type]--;
      G.timerVal+=30;
      document.getElementById('q-timer').textContent=G.timerVal;
      document.getElementById('q-timer').className='q-timer';
      sfx.powerup();setMsg('👁 INSIGHT! +30 seconds added!','var(--blue)');
      spawnFloat('+30s 👁','var(--blue)',false);
      renderInventory();return;
  }
  if(type==='leech'){
    G.inv[type]--;
    const stolen=Math.min(G.bossHP,Math.max(10,Math.floor(G.bossHP*0.08)));
    G.bossHP=Math.max(0,G.bossHP-stolen);
    sfx.powerup();spawnFloat(`-${stolen}🩸`,'var(--purple)',true);
    const got=doHealAura(stolen,'🩸 LEECH');   // single source of healing
    setMsg(`🩸 LEECH! Drained ${stolen} — recovered ${got} HP!`,'var(--purple)');
    updateBars();renderInventory();
    if(G.bossHP<=0)handleLevelWin();return;
  }

  if(type==='regen'){
    G.inv[type]--;
    const e=addOrStackEffect('playerRegen',{});
    sfx.powerup();setMsg(`💉 REGEN ×${e.stack}! +${e.hpPerTurn} HP/turn`,'var(--green)');
    doHealAura(0);renderEffects();renderInventory();return;
  }
  if(type==='stun'){
    G.inv[type]--;
    const e=addOrStackEffect('stun',{});
    sfx.powerup();setMsg(`💫 STUN ×${e.stack}! Boss skips ${e.turns} turns!`,'var(--yellow)');
    showParalyzeOverlay();renderEffects();renderInventory();return;
  }
  if(type==='rage'){
    G.inv[type]--;
    const e=addOrStackEffect('playerRage',{});
    sfx.powerup();setMsg(`😤 RAGE ×${e.stack}! ATK×2, -${rageCostFor()}HP/turn`,'var(--red)');
    doAnim('player-f','aS',()=>{});spawnFloat('😤 RAGE!','var(--red)',false);
    renderEffects();renderInventory();return;
  }
  if(type==='mirror'){
    G.inv[type]--;
    const e=addOrStackEffect('mirror',{});
    sfx.powerup();setMsg(`🪞 MIRROR ×${e.stack}! Reflects ${e.stack}x next hit!`,'var(--teal)');
    showShieldGlow();spawnFloat('🪞 MIRROR!','var(--teal)',false);
    renderEffects();renderInventory();return;
  }
  if(type==='barrier'){
    G.inv[type]--;
    const e=addOrStackEffect('barrier',{});
    sfx.powerup();setMsg(`🧱 BARRIER! Blocks next ${e.turns} hits fully!`,'var(--blue)');
    showShieldGlow();spawnFloat('🧱 BARRIER!','var(--blue)',false);
    renderEffects();renderInventory();return;
  }
  if(type==='overload'){
    G.inv[type]--;
    const e=addOrStackEffect('overload',{});
    const v=addOrStackEffect('playerVulnerable',{});
    sfx.powerup();setMsg(`⚡ OVERLOAD ×${e.stack}! Next hit ×${Math.pow(3,e.stack)} — but next hit taken +${Math.round(v.mult*100)}%!`,'var(--yellow)');
    spawnFloat('⚡ OVERLOAD!','var(--yellow)',false);
    renderEffects();renderInventory();return;
  }
  if(type==='double'){
    G.inv[type]--;
    const e=addOrStackEffect('double',{});
    sfx.powerup();setMsg(`⚡ 2×DMG ×${e.stack}! Next hit ×${Math.pow(2,e.stack)}`,'var(--yellow)');
    renderEffects();renderInventory();return;
  }
  if(type==='freeze'){
    if(res.freeze===0){setMsg('❄ IMMUNE!','var(--dim)');renderInventory();return;}
    G.inv[type]--;
    const e=addOrStackEffect('freeze',{});
    sfx.powerup();setMsg(`❄ FREEZE! Enemy skips ${e.turns} turns!`,'var(--blue)');
    showFreezeOverlay();renderEffects();renderInventory();return;
  }
  if(type==='poison'){
    if(res.poison===0){setMsg('☠ IMMUNE!','var(--dim)');renderInventory();return;}
    G.inv[type]--;
    const e=addOrStackEffect('bossPoison',{});
    sfx.powerup();setMsg(`☠ POISON ×${e.stack}! -${e.hpPerTurn}/turn`,'var(--purple)');
    renderEffects();renderInventory();return;
  }
  if(type==='burn'){
    if(res.burn===0){setMsg('🔥 IMMUNE!','var(--dim)');renderInventory();return;}
    G.inv[type]--;
    const e=addOrStackEffect('bossBurn',{});
    sfx.powerup();setMsg(`🔥 BURN ×${e.stack}! -${e.hpPerTurn}/turn`,'var(--orange)');
    renderEffects();renderInventory();return;
  }
  if(type==='shield'){
    G.inv[type]--;
    const e=addOrStackEffect('shield',{});
    sfx.powerup();setMsg(`🛡 SHIELD! Blocks ${Math.round(e.block*100)}% for ${e.turns} hits`,'var(--teal)');
    showShieldGlow();renderEffects();renderInventory();return;
  }
  if(type==='paralyze'){
    if(res.paralyze===0){setMsg('⚡ IMMUNE!','var(--dim)');renderInventory();return;}
    G.inv[type]--;
    const e=addOrStackEffect('paralyze',{});
    sfx.powerup();setMsg(`⚡ PARALYZE! Enemy skips ${e.turns} turns!`,'var(--cyan)');
    showParalyzeOverlay();renderEffects();renderInventory();return;
  }
}



/* AUTO-REVIVE is the run's safety net, so it is the one item the game should
   never make unobtainable — and it was. The old rule was:

     streak>=7 && G.loadout.includes('revive') && Math.random()<.10

   REVIVE is not in the daily gifts and not in the mid-battle reward pool, so
   that line was its ONLY source after the loadout screens. If it was not among
   the 8 offered at startup (8 of 22 = 36%) and you did not spend one of your
   three picks on it, no revive existed for the rest of the run — while the
   AUTO-REVIVE slot sat in the rail all game reading x0 with no way to change
   it. And for players who DID carry it, 10% of every answer past a 7-streak is
   not a safety net, it is a faucet: uncapped, and short-circuiting ahead of the
   normal drop so it stole from everything else too.

   Now: it can drop whether or not you carry it, it only takes the roll that
   nothing else wanted, and it stops at two. Carrying it from the loadout screen
   is still the way to START with one. */
const REVIVE_CHANCE=0.08;   // of the answers where no other drop landed
const REVIVE_CAP=2;
function reviveRoom(){ return ((G.inv&&G.inv.revive)||0)<REVIVE_CAP; }

function rollDrop(streak,diff){
  /* W2.dropPool applies the world laws — Law VIII's sealed power-up and
     Law X's ban on multiplication — so drops can't hand back what the
     world just took away. Falls back to the plain loadout without it. */
  const pool=(window.W2&&W2.dropPool)?W2.dropPool()
            :(G.loadout||[]).filter(t=>t!=='revive');
  let chance={easy:.48,medium:.36,hard:.24}[diff]||.36;
  if(streak>=3)chance+=.10;
  if(pool.length&&Math.random()<=chance)
    return pool[Math.floor(Math.random()*pool.length)];
  /* nothing else dropped — the safety net gets the leftover roll */
  if(streak>=7&&reviveRoom()&&Math.random()<REVIVE_CHANCE)return 'revive';
  return null;
}


function handleLevelWin(){
  clearInterval(G.timerInterval);sfx.victory();
  const si=G.curStage,li=G.curLevel,stg=STAGES[si],lv=stg.levels[li];
  window.dispatchEvent(new CustomEvent('dino:defeat',{detail:{si,li,boss:!!lv.boss}}));
  /* meta-layer hooks. THINLINE was `lv.boss && playerHP===1` — exactly one HP
     on a boss, effectively impossible; the rule is any level at 5% or less.
     MARGIN is the fifth secret: replay an already-cleared L5 in worlds 1-5 and
     win it without spending a single power-up. (w2:stageclear is dispatched by
     the dino-world2 handleLevelWin wrapper, which knows about replays — firing
     it here too made the author's check-ins play twice.) */
  if(window.W2){
    if(G.playerMaxHP>0&&G.playerHP/G.playerMaxHP<=0.05)W2.findSecret('thinline');
    if(G._w2replay&&li===4&&stg.world<=5&&!G._puThisBattle)W2.findSecret('margin');
  }
  const isFinalLevel=li===4,isFinalStage=si===STAGES.length-1&&isFinalLevel;
  const attr=G._w2replay?{hp:0,atk:0,res:0}:lv.attr;   // replays grant nothing
  const _b={hp:G.pHP,atk:G.pATK,res:G.pRES};
  G.pHP+=attr.hp;G.pATK+=attr.atk;G.pRES+=attr.res;
  capPlayerStats();
  const _gain={hp:G.pHP-_b.hp,atk:G.pATK-_b.atk,res:G.pRES-_b.res};
  const _hpBeforeHeal=G.playerHP;
  G.playerHP=Math.min(G.playerMaxHP,G.playerHP+attr.hp+Math.round(G.playerMaxHP*(G._clearHealOverride!==undefined?G._clearHealOverride:CLEAR_HEAL)));
  const _healed=G.playerHP-_hpBeforeHeal;
  if(!G._w2replay){G.levelsCleared[si]=Math.max(G.levelsCleared[si],li+1);if(isFinalLevel)G.stagesCleared++;}
    bumpStat('levels'); if(isFinalLevel)bumpStat('stages');
    /* worlds 6-11 progress, for the hidden achievement group */
    if(((STAGES[G.curStage]||{}).world||1)>=6)bumpStat('marginLevels');
  if(lv.boss||lv.mini)bumpStat('bosses');
  if(G.playerHP/G.playerMaxHP<=0.15)bumpStat('clutch');
  if(si===24&&isFinalLevel&&!G._w2replay){
    /* the printed ending of worlds 1-5 · then the author speaks */
    const m=BOSS_MULT[24];
    if(m&&m.all){G.pHP=Math.floor(G.pHP*m.all);G.pATK=Math.floor(G.pATK*m.all);G.pRES=Math.floor(G.pRES*m.all);capPlayerStats();}
    grantBossAttr(24);
        G.score+=5000;
    saveCompletedMapSnapshot();
    if(window.W2){
      W2.markA('completed');
      /* Worlds 1-5 are the printed book: this stays GAME COMPLETE, leaderboard
         and all. But endGame() wipes the save, so park everything the run
         earned first — W2.beginBeyond() restores from here if the player ever
         finds all five seams and the margin opens. */
      if(W2.saveBeyondSnapshot)W2.saveBeyondSnapshot();
      if(W2.playDialogue&&!W2.A().d1said)setTimeout(()=>W2.playDialogue('d1'),1800);
    }
    setTimeout(()=>{endGame(true);offerSyllabusAfterWin();},600);
    return;

  }
  if(isFinalStage){
    saveCompletedMapSnapshot();
    setTimeout(()=>{endGame(true);offerSyllabusAfterWin();},600);
    return;

  }
  const nextSi=isFinalLevel?si+1:si,nextLi=isFinalLevel?0:li+1;
  const awTitleEl=document.getElementById('aw-title');
  awTitleEl.innerHTML=lv.boss
    ?'<i data-lucide="crown"></i> BOSS DEFEATED!'
    :lv.mini
    ?'<i data-lucide="swords"></i> MINI-BOSS CLEAR!'
    :'<i data-lucide="check"></i> LEVEL CLEAR!';  document.getElementById('aw-sub').textContent=lv.sub+' defeated!';
  const gains=document.getElementById('aw-gains');gains.innerHTML='';
    const addStat=(icon,label,want,got,cls)=>{
    const zero=!want;
    const r=document.createElement('div');
    r.className='aw-row '+cls+(zero?' aw-none':'');
    r.innerHTML=`<span class="aw-icon">${icon}</span><span class="aw-text">${label}</span>`+
      `<span class="aw-val">${zero?'—':(got>0?'+'+got:'MAX')}</span>`;
    gains.appendChild(r);
  };
  addStat('❤','REGENERATION',attr.hp,_gain.hp,'aw-hp');
  addStat('⚔','ATTACK',attr.atk,_gain.atk,'aw-atk');
  addStat('🛡','RESIST',attr.res,_gain.res,'aw-res');
  addStat('💚','RECOVERED',_healed,_healed,'aw-heal');

    if(lv.boss&&BOSS_MULT[si]&&!G._w2replay){
    const m=BOSS_MULT[si];
    const before={hp:G.pHP,atk:G.pATK,res:G.pRES};
    if(m.all){G.pHP=Math.floor(G.pHP*m.all);G.pATK=Math.floor(G.pATK*m.all);G.pRES=Math.floor(G.pRES*m.all);}
    if(m.atk)G.pATK=Math.floor(G.pATK*m.atk);
    capPlayerStats();
    const gained=(G.pHP-before.hp)+(G.pATK-before.atk)+(G.pRES-before.res);
    const r=document.createElement('div');r.className='aw-row aw-big';
    r.innerHTML=`<span class="aw-icon">${m.icon}</span>
      <span class="aw-text" style="color:var(${m.col})">${m.text}</span>
      <span class="aw-val" style="color:var(${m.col})">${gained>0?m.tier:'MAX'}</span>`;
    gains.appendChild(r);
    if(gained<=0)G.score+=2000;               // caps hit → pay out instead of vanishing
    const got=grantBossAttr(si);
    if(got){
      const r2=document.createElement('div');r2.className='aw-row aw-big';
      r2.innerHTML=`<span class="aw-icon">${got.icon}</span>
        <span class="aw-text" style="color:var(--yellow)">ATTRIBUTE UNLOCKED — ${got.name}</span>
        <span class="aw-val" style="color:var(--yellow)">EQUIP</span>`;
      gains.appendChild(r2);
    }
  }
  capPlayerStats();


    document.getElementById('aw-btn').onclick=()=>{
    if(G.isPractice){
      goNextLevel(nextSi,nextLi);   // Training: always go direct, no pick screens
    }else if(((si*5+li)%2)===0){
      /* Reward on every ODD battle counted across the run — levels 1, 3, 5,
         7, 9 … and onward through the stages, not restarting each stage.
         `nextLi % 2 === 0` fired on the EVEN levels of a stage (2 and 4) and
         reset at every stage boundary, so the cadence broke every 5 levels. */
      goMidPick(nextSi,nextLi);
    }else{
      goNextLevel(nextSi,nextLi);
    }
  };
  show('s-attrwin');

}

// Mitigation curve — asymptotically approaches ~85%, never fully nullifies a hit:
function resMitigation(res){
  return Math.min(CAPS.resCurve,res/(res+180));
}


/* Superseded by goPickStage() — it never set _pickStageKey or _pickMode, so a
   stale 'mid' would have leaked into the render. Nothing calls it; kept as a
   named stub so an old save or a console call fails loudly rather than
   half-rendering the pick screen. */
function goPickPU(nextSi,nextLi){
  console.warn('goPickPU() is retired — use goPickStage(key, world).');
  goNextLevel(nextSi,nextLi);
}

function goMidPick(nextSi,nextLi){
  G._picked=[];G._pickMode='mid';G._pickStageKey=null;G._pickBanner='';
  G._pickNext={si:nextSi,li:nextLi};
  // Draw from ALL powerups, not just ones already owned — otherwise
  // the "auto-use if you don't own it" branch can never trigger.
  /* was Object.keys(PU) with no unlock check — a World 1 boss could offer a
     power-up from past the margin */
  const pool=Object.keys(PU).filter(t=>t!=='revive'&&puUnlocked(t));
  shuffle(pool);
  G._pickChoices=pool.slice(0,3);
  renderPickPU();show('s-pickpu');
}
/* ─────────────────────────────────────────────────────────────────────────
   THE PICK SCREEN

   Three regions, one render:
     · the RAIL   — the loadout you are building. Slots you already carry are
                    locked; slots you added this screen come back off when
                    tapped; the rest are empty outlines, so the target is
                    visible without counting pips.
     · the POOL   — a uniform grid of what is on offer. Same size every card,
                    so the grid does not go ragged when one description runs
                    long (which is what the old flex-wrap did).
     · the BAR    — sticky, so CONFIRM is reachable without scrolling to the
                    bottom of eight cards on a phone.

   Mid-battle rewards reuse the same shell with the rail and the bar hidden:
   there is nothing to assemble, you take one of three and it resolves.

   Nothing here writes an inline style. Card state is `.picked` / `.pk-owned`,
   and the palette is the single-point one — neutral hairline, gold only on
   what you have actually taken.
   ───────────────────────────────────────────────────────────────────────── */

/* "w5" → "WORLD 5", "startup" → "WORLD 1", "w11" → "WORLD END" */
function pkStageLabel(){
  const k=G&&G._pickStageKey;
  if(!k)return '';
  if(k==='startup')return 'WORLD 1';
  if(k==='w11')return 'WORLD END';
  return 'WORLD '+k.slice(1);
}

/* one card in the offer grid */
function pkCard(t,opts){
  const o=opts||{};
  const cls=['pu-pick-card'];
  if(o.picked)cls.push('picked');
  if(o.owned)cls.push('pk-owned');
  return `<button type="button" class="${cls.join(' ')}" onclick="pickReward('${t}')"
      aria-pressed="${o.picked?'true':'false'}" title="${PU[t].name} — ${puDesc(t)}">
      <span class="pk-tick" aria-hidden="true">✓</span>
      <span class="card-icon"><i data-lucide="${PU_ICON_MAP[t]||'sparkles'}"></i></span>
      <span class="card-name">${PU[t].name}</span>
      <span class="card-desc">${puDesc(t)}</span>
      ${o.tag?`<span class="card-rarity">${o.tag}</span>`:''}
    </button>`;
}

/* one slot in the rail. kind: 'kept' (carried in, locked) | 'new' | 'empty' */
function pkSlot(t,kind,refill){
  if(kind==='empty')
    return `<div class="pk-slot pk-empty" aria-hidden="true"><span class="pk-slot-ico"><i data-lucide="plus"></i></span></div>`;
  const locked=kind==='kept';
  return `<${locked?'div':'button type="button"'} class="pk-slot pk-${kind}"
      ${locked?'':`onclick="pickReward('${t}')"`}
      title="${locked?PU[t].name+' — already in your loadout':'Tap to take '+PU[t].name+' back out'}">
      <span class="pk-slot-ico"><i data-lucide="${PU_ICON_MAP[t]||'sparkles'}"></i></span>
      <span class="pk-slot-name">${PU[t].name}</span>
      ${locked&&refill?`<span class="pk-slot-plus">+${refill}</span>`:''}
      ${locked?'':'<span class="pk-slot-x" aria-hidden="true">×</span>'}
    </${locked?'div':'button'}>`;
}

function renderPickPU(){
  const isMid   = G._pickMode==='mid';
  const startup = G._pickStageKey==='startup';
  const target  = G._pickTarget||0;
  const picked  = G._picked||[];
  const tier    = PICK_TIERS[G._pickStageKey]||{};
  const refill  = tier.refill||0;

  const $=id=>document.getElementById(id);
  const set=(id,txt)=>{const e=$(id);if(e)e.textContent=txt;};

  /* ── header ─────────────────────────────────────────────────────────── */
  set('pickpu-eyebrow', isMid?'BATTLE REWARD':pkStageLabel());
  set('pickpu-title',   isMid?'PICK A POWERUP':startup?'CHOOSE YOUR LOADOUT':'UPGRADE YOUR LOADOUT');
  set('pickpu-sub',     isMid
    ? 'One of three. Anything you do not already carry fires on its own.'
    : startup
      ? `Pick ${target} to start the run with.`
      : `Add ${target===1?'one':target} to what you already carry.`);

  /* ── the rail ───────────────────────────────────────────────────────── */
  const rail=$('pickpu-rail');
  if(rail){
    rail.hidden=isMid;
    if(!isMid){
      const kept=(G.loadout||[]).filter(t=>!picked.includes(t)&&PU[t]);
      const slots=kept.map(t=>pkSlot(t,'kept',refill))
        .concat(picked.map(t=>pkSlot(t,'new',0)))
        .concat(Array.from({length:Math.max(0,target-picked.length)},()=>pkSlot(null,'empty',0)));
      $('pickpu-slots').innerHTML=slots.join('');
      set('pickpu-count', picked.length+' / '+target);
      const rf=$('pickpu-refill');
      if(rf){
        rf.hidden=!(refill&&kept.length);
        if(!rf.hidden)rf.innerHTML=
          `<i data-lucide="plus-circle"></i><span>Every powerup you already carry gains <b>+${refill}</b> charges when you confirm.</span>`;
      }
      $('pickpu-rail').classList.toggle('pk-full',picked.length>=target);
    }
  }

  /* ── the pool ───────────────────────────────────────────────────────── */
  set('pickpu-poolhead', isMid?'CHOOSE ONE':'AVAILABLE');
  $('pickpu-cards').innerHTML=G._pickChoices.map(t=>{
    if(isMid){
      const owned=!!(G.loadout&&G.loadout.includes(t));
      const guardian=!owned&&['heal','regen','divine'].includes(t);
      return pkCard(t,{owned,tag:owned?'STORE +1':guardian?'GUARDIAN @ 50% HP':'USED INSTANTLY'});
    }
    return pkCard(t,{picked:picked.includes(t)});
  }).join('');

  /* ── the sticky bar ─────────────────────────────────────────────────── */
  const bar=$('pickpu-confirm-row');
  if(bar){
    bar.hidden=isMid;
    const btn=$('pickpu-confirm');
    if(btn){
      const left=target-picked.length;
      const done=left<=0;
      btn.disabled=!done;
      btn.innerHTML=done
        ? (startup?'START RUN':'CONFIRM LOADOUT')+' <i data-lucide="arrow-right" class="ico-end"></i>'
        : `PICK ${left} MORE`;
    }
    set('pickpu-hint', picked.length
      ? 'Tap a slot above to take one back out.'
      : 'Tap a card to add it to your loadout.');
  }

  refreshIcons();          // the cards are rebuilt, so the icons must re-render
}

/* commit the loadout — what the auto-advance used to do */
function confirmPickPU(){
  if(!G||G._pickMode==='mid')return;
  if((G._picked||[]).length<G._pickTarget)return;
  const refill=(PICK_TIERS[G._pickStageKey]||{}).refill||0;
  if(refill)G.loadout.forEach(t=>{G.inv[t]=(G.inv[t]||0)+refill;});
  saveGame();
  if(G._pickStageKey==='startup'){buildMap();saveGame();show('s-map');}
  else{const r=G._pickResume;if(r)enterLevelDirect(r.si,r.li);else{buildMap();show('s-map');}}
}

function pickReward(type){
  if(!PU[type])return;

    if(G._pickMode==='mid'){
    const owned=G.loadout&&G.loadout.includes(type);
    if(owned){
      // already a starter powerup — this just tops up the real stack
      G.inv[type]=(G.inv[type]||0)+1;
      sfx.powerup();
    }else if(['heal','regen','divine'].includes(type)){
      // not a starter pick + a healing-type PU: don't hand it over now,
      // queue it to auto-fire once HP drops to 50% instead of wasting it
      G.pendingGuardians=G.pendingGuardians||[];
      G.pendingGuardians.push(type);
      renderGuardianBadges();
      sfx.powerup();
    }else{
      /* Not a starter pick, not a healing one: it FIRES ITSELF. It never
         enters the rail and never stacks.

         Two wrong versions preceded this one. The first handed over a
         temporary charge and fired it on a blind 900ms timer, then deleted it
         whether or not it had fired — and on the fifth level of a world that
         timer lands inside the award screen and the next stage's walk-in, so
         the prize for beating a boss silently evaporated. The second (mine)
         fixed the disappearing by keeping the charge, which turned every boss
         reward into inventory that piles up.

         tryAutoUse() below does neither: it waits for a battle that is
         actually live, fires, and only clears the pending type once the use
         really went through. */
      G._autoUsePending=type;
      sfx.powerup();
    }
    G._picked=[type];renderPickPU();saveGame();
    const nx=G._pickNext;
    setTimeout(()=>{ goNextLevel(nx.si,nx.li); },550);
    return;
  }

  G.loadout=G.loadout||[];
  /* clicking a picked card takes it back off */
  if(G._picked.includes(type)){
    G._picked=G._picked.filter(t=>t!==type);
    G.loadout=G.loadout.filter(t=>t!==type);
    G.inv[type]=Math.max(0,(G.inv[type]||0)-1);
    renderPickPU();
    return;
  }
  if(G._picked.length>=G._pickTarget)return;
  G._picked.push(type);
  if(!G.loadout.includes(type))G.loadout.push(type);
  G.inv[type]=(G.inv[type]||0)+1;
  sfx.powerup();renderPickPU();
}

/* enter a level bypassing the world-pick check (used after a world pick resolves) */
function enterLevelDirect(si,li){
  if(li===0 && si>G.curStage){
    G.curStage=si;G.curLevel=0;buildMap();show('s-map');
  }else{
    G.curStage=si;G.curLevel=li;show('s-game');loadLevel(si,li);
  }
}


function goNextLevel(nextSi,nextLi){
  saveGame();
  G.streak=0;G.combo=1;
  paintScore();
  document.getElementById('sc-streak').textContent=0;
  document.getElementById('sc-combo').textContent='×1';

  const advance=()=>{
    if(nextLi===0 && nextSi>G.curStage){
      G.curStage=nextSi;G.curLevel=0;buildMap();show('s-map');
    }else{
      G.curLevel=nextLi;G.curStage=nextSi;show('s-game');loadLevel(nextSi,nextLi);
    }
  };

  if(G.isPractice){
    advance();          // Training: never touch the powerup-pick system
    return;
  }

  maybeWorldPick(nextSi,nextLi,advance);
}


function updateBars(){
  if (typeof clampImmortal === 'function') clampImmortal();

  const pp=Math.max(0,G.playerHP/G.playerMaxHP*100),bp=Math.max(0,G.bossHP/G.bossMaxHP*100);
  document.getElementById('p-hp').style.width=pp+'%';
  document.getElementById('b-hp').style.width=bp+'%';
  document.getElementById('p-hp-txt').textContent=`${Math.max(0,G.playerHP)}/${G.playerMaxHP}`;
  document.getElementById('b-hp-txt').textContent=`${Math.max(0,G.bossHP)}/${G.bossMaxHP}`;
  document.getElementById('p-hp').style.background=pp<25?'var(--red)':pp<50?'var(--orange)':'var(--green)';checkGuardianTrigger();
}
function renderAttrs(){
  const g=document.getElementById('attr-grid');
  g.innerHTML=`
    <div class="attr-row"><i data-lucide="heart"></i><span class="attr-val">+${G.pHP}</span><span class="attr-lbl"> HP</span></div>
    <div class="attr-row"><i data-lucide="sword"></i><span class="attr-val">+${G.pATK}</span><span class="attr-lbl"> ATK</span></div>
    <div class="attr-row"><i data-lucide="shield"></i><span class="attr-val">${G.pRES}%</span><span class="attr-lbl"> RES</span></div>
    <div class="attr-row"><i data-lucide="star"></i><span class="attr-val">S${G.stagesCleared}</span><span class="attr-lbl"> done</span></div>`;
  refreshIcons();
}
function renderReviveSlot(){
  const el=document.getElementById('revive-slot');if(!el)return;
  const cnt=G.inv&&G.inv.revive?G.inv.revive:0;
  el.className='revive-slot'+(cnt>0?' armed':' empty');
  el.title=cnt>0
    ? 'Brings you back at 25% HP when you die — spends one charge'
    : 'Earned on a 7+ streak, or picked at a loadout screen. Holds up to '+REVIVE_CAP+'.';
  el.innerHTML=`<span class="rs-icon">🍖</span><span class="rs-name">AUTO-REVIVE</span><span class="rs-count">×${cnt}</span>`;
}
function invList(){
  const out=[];
  (G.loadout||[]).forEach(k=>{if(PU[k]&&k!=='revive'&&!out.includes(k))out.push(k);});
  Object.keys(G.inv||{}).forEach(k=>{if(k!=='revive'&&G.inv[k]>0&&!out.includes(k))out.push(k);});
  return out;
}
function renderInventory(){
  const w=document.getElementById('pu-items');
  const list=invList();
  /* Training hands over the whole era's kit — twenty-one powerups where a run
     carries three to five. Past eight the rail goes two-across and widens
     (dino-ui.css §21); it also scrolls now, which is what was actually broken:
     eight buttons were off the bottom of the window with no way to reach them. */
  const rail=document.querySelector('#s-game .g-inv');
  if(rail)rail.classList.toggle('inv-many',list.length>8);
  w.innerHTML=list.length?list.map(t=>{
    const d=PU[t],cnt=G.inv[t]||0;
    /* A seal the player can SEE beats a mystery refusal when they tap it. */
    const sealed=!!(window.SPX&&SPX.isSealed(G,t)), off=cnt===0||sealed;
    return `<button class="pu-btn${sealed?' pu-sealed':''}" style="border-color:${d.border};opacity:${off?'0.3':'1'};pointer-events:${off?'none':'auto'}" onclick="usePowerup('${t}')" title="${sealed?'SEALED — unusable for now':d.desc}">
      ${sealed?'<span class="pu-lock">🔒</span>':''}
      ${cnt>0?`<span class="pu-count" style="color:${d.color}">${cnt}</span>`:''}
      <span class="pu-icon" style="color:${d.color}">${luc(PU_ICON_MAP[t]||'sparkles',22)}</span>
      <span class="pu-name" style="color:${d.color}">${d.name}</span>
    </button>`;
  }).join(''):'<div class="pu-empty">No powerups equipped</div>';
  renderReviveSlot();
  refreshIcons();
}
function renderGuardianBadges(){
  const el=document.getElementById('guardian-badges');
  if(!el)return;
  if(!G.pendingGuardians||!G.pendingGuardians.length){el.innerHTML='';return;}
  /* NOTE: window.renderGuardianBadges is redefined further down (the version
     that knows about per-powerup thresholds and charge counts) and that one is
     what actually runs. Kept in step with it so the two never disagree. */
  el.innerHTML=G.pendingGuardians.map(t=>
    `<span class="guardian-chip" title="${PU[t].name} — auto-fires when your HP drops">`+
    `${luc(PU_ICON_MAP[t]||'sparkles',13)}<span class="gc-n">${PU[t].name}</span></span>`
  ).join('');
  refreshIcons();
}
function checkGuardianTrigger(){
  if(!G.pendingGuardians||!G.pendingGuardians.length||!G.inBattle||G.animLock)return;
  if(G.playerHP<=0)return;
  if(G.playerHP/G.playerMaxHP<=0.5){
    const t=G.pendingGuardians.shift();
    G.inv[t]=1;
    spawnFloat('⏳ GUARDIAN!','var(--yellow)',false);
    G._forcePU=true;
    try{ usePowerup(t); } finally { G._forcePU=false; }
    renderGuardianBadges();
  }
}

const HINTS=[
  'Answer correctly to counter-attack the enemy!',
  'Build a streak to increase your combo multiplier!',
  'Use FREEZE or STUN to skip the enemy\'s turn!',
  'POISON and BURN deal damage every turn!',
  'SHIELD absorbs 50% of incoming damage for 3 hits!',
  'HALF HP instantly cuts the enemy\'s health in half!',
  'ORACLE reveals the correct answer — use it wisely!',
  'DIVINE fully restores your HP in an emergency!',
  'NUKE deals damage equal to 50% of your max HP!',
  'GAMBLE gives you a random powerup — risky but fun!',
  'BARRIER blocks the next 2 hits completely!',
  'MIRROR reflects the next attack back at the enemy!',
  'OVERLOAD triples your damage on the next correct answer!',
  'INSIGHT adds 30 seconds to the timer!',
  'LEECH steals 15 HP directly from the enemy!',
  'RAGE doubles your attack but costs 5 HP per turn!',
  'Earn permanent HP, ATK and RES by clearing levels!',
  'Boss stages drop better rewards on clear!',
  'Answer faster for bonus damage — timer counts!',
  'Combo multiplier resets on wrong answer — stay sharp!',
];
let _hintIdx=0;
function cycleHint(){
  const el=document.getElementById('hint-text');
  if(!el)return;
    if(typeof G!=='undefined'&&G&&(G.isPractice||G.isSyllabusRun))return;
  el.style.opacity='0';
  setTimeout(()=>{
    _hintIdx=(_hintIdx+1)%HINTS.length;
    el.textContent=HINTS[_hintIdx];
    el.style.transition='opacity 0.5s';
    el.style.opacity='1';
  },300);
}
setInterval(cycleHint,4000);
document.addEventListener('DOMContentLoaded',()=>{
  const el=document.getElementById('hint-text');
  if(el)el.textContent=HINTS[0];
});

function setMsg(txt,color){const el=document.getElementById('msg-bar');el.textContent=txt;el.style.color=color||'var(--dim)';}
function setTurnIndicator(isPlayer){
  const el=document.getElementById('turn-indicator');
  if(isPlayer){
    el.innerHTML=`${luc('sword',12)} YOUR TURN`;
    el.className='turn-indicator player-turn';
  }else{
    el.innerHTML=`${luc('flame',12)} ${STAGES[G.curStage]?.levels[G.curLevel]?.sub||'ENEMY'} COUNTER!`;
    el.className='turn-indicator boss-turn';
  }
  refreshIcons();
}
/* fxKey (optional): floats sharing a key replace one another instead of piling
   up, so a re-stacked effect shows one message whose ×N climbs. */
function spawnFloat(txt,color,isBoss,fxKey){const ba=document.getElementById('battle-area');if(!ba)return;if(fxKey)ba.querySelectorAll('.fdmg[data-fx="'+fxKey+'"]').forEach(o=>o.remove());const el=document.createElement('div');el.className='fdmg';if(fxKey)el.dataset.fx=fxKey;el.textContent=txt;el.style.color=color;el.style.left=isBoss?'60%':'24%';el.style.top='16px';ba.appendChild(el);setTimeout(()=>el.remove(),1900);}
/* ── THE ATTACK ANIMATION ──────────────────────────────────────────────────
   Two things were wrong with it.

   1 · It ran on the whole .fighter column. #player-f holds the name, the
       sprite, the status icons, the guardian badges, the HP bar AND the HP
       text — so an attack lunged the entire card, health bar and all. Only the
       sprite should move. Every caller passes 'player-f'/'boss-f', so the
       remap lives here rather than at eleven call sites.

   2 · The lunge was a hardcoded 26px. The two fighters sit either side of a VS
       divider and are much further apart than that, so nobody ever reached
       anybody — the strike read as a twitch in place, which is exactly the
       "invisible" attack. The distance is now measured from the real gap
       between the two sprites, so they actually meet and connect. */
const ANIM_SPR={'player-f':'player-spr','boss-f':'boss-spr'};
/* must match the .aR/.aL animation duration in dino-ui.css §25 */
const ANIM_MS=950;
const HURT_MS=480;          // .aS  · hurtKnock
const DODGE_MS=420;         // .aD  · dodgeSlip
/* the strike frame of pokeR/pokeL — where the sprite is furthest forward */
const IMPACT_AT=0.46;

/* One blow, not two events.
   The old sequence was doAnim(attacker,'aR', () => doAnim(target,'aS', …)):
   the attacker lunged out, came all the way home, and only THEN did the
   target react — 950ms after the fists met. That gap is what read as "not
   smooth", and it is also why the hit felt like it landed on nothing.
   strike() fires the target's flinch on the attacker's strike frame, so
   contact and reaction are the same moment, and calls back when the lunge
   itself is done.

   `react` is what the TARGET does on the strike frame: 'aS' to flinch (the
   hit landed), 'aD' to sidestep (it was dodged), or null for nothing at all
   (blinded, missed, blocked). Passing 'aS' unconditionally meant a dodged
   blow still knocked the enemy back — it dodged and flinched at once. */
function strike(fromId,toId,cb,react){
  const cls=(ANIM_SPR[fromId]==='boss-spr'||fromId==='boss-f')?'aL':'aR';
  const r=(react===undefined)?'aS':react;
  let landed=false;
  const land=()=>{
    if(landed)return; landed=true;
    if(r&&toId&&typeof doAnim==='function')doAnim(toId,r,()=>{});
  };
  doAnim(fromId,cls,()=>{ land(); if(cb)cb(); },
         {onStart:()=>setTimeout(land,Math.round(ANIM_MS*IMPACT_AT))});
}

function lungeFor(fromId,toId){
  const a=document.getElementById(fromId), b=document.getElementById(toId);
  if(!a||!b) return 26;
  const ra=a.getBoundingClientRect(), rb=b.getBoundingClientRect();
  if(!ra.width||!rb.width) return 26;
  /* the empty space between them, less a contact allowance for the strike
     frame's 1.06 scale and the easing's overshoot — see the hardened copy */
  const gap=Math.abs((rb.left+rb.width/2)-(ra.left+ra.width/2));
  const sum=ra.width+rb.width;
  return Math.max(16,Math.round(gap-sum/2-sum*0.08));
}

function doAnim(id,cls,cb,opts){
  const el=document.getElementById(ANIM_SPR[id]||id);
  if(!el){ if(cb)cb(); return; }          // never strand a caller holding animLock
  if(cls==='aR'||cls==='aL'){
    const me=ANIM_SPR[id]||id;
    const them=(me==='player-spr')?'boss-spr':'player-spr';
    el.style.setProperty('--lunge',lungeFor(me,them)+'px');
  }
  el.classList.add(cls);
  if(opts&&opts.onStart)opts.onStart();
  const d=cls==='aS'?HURT_MS:(cls==='aD'?DODGE_MS:ANIM_MS);
  setTimeout(()=>{el.classList.remove(cls);if(cb)cb();},d);
}

function endGame(win,tag){
_battleSession++;
stopBattleBgLoop();
  G.inBattle=false;
  G.timerModeLocked=false;
    if(win&&!G.isPractice){
    G.score+=5000;
    G.inv.divine=(G.inv.divine||0)+3;
    saveCompletedMapSnapshot();   // ← ADD THIS LINE
  }
  if(!G.isPractice){
  if(G.isSyllabusRun)clearPracticeSave();else clearSave();
  }
  clearInterval(G.timerInterval);
  G.animLock=true;
  const title=document.getElementById('end-title');
  /* Two different conclusions on purpose. Worlds 1-5 are the printed book, so
     finishing them is GAME COMPLETE. Everything past the margin is not part of
     the book, so it does not complete — it ENDS. */
  /* Losing past the margin is not an ordinary defeat. Worlds 6-10 only exist
     because the reader prised the system open, so the game blames the reader
     for the damage rather than pretending the world was always hostile.
     WORLD END goes further: it ends YOU, and shuts for a day. */
  const _dStg=(typeof STAGES!=='undefined'&&STAGES[G.curStage])||null;
  const deathWorld=(_dStg&&_dStg.world)||1;
  const lossBeyond = !win && deathWorld>=6 && deathWorld<=10;
  const lossEnd    = tag==='UNWRITTEN' || (!win && deathWorld>=11);
  let endLockLeft='';
  if(lossEnd && !G.isPractice && window.W2 && W2.lockEnd){
    try{ W2.lockEnd(24); endLockLeft=W2.endLockText(); }catch(e){}
  }
    if(tag==='AUTHORED'){
    title.innerHTML='<i data-lucide="feather"></i> GAME ENDED';
    refreshIcons();
    setEndTone(title,'authored');
  }else if(lossEnd){
    title.innerHTML='<i data-lucide="feather"></i> THE GAME ENDED YOU';
    refreshIcons();
    setEndTone(title,'unwritten');
  }else if(lossBeyond){
    title.innerHTML='<i data-lucide="unplug"></i> THE WORLD IS GLITCHING';
    refreshIcons();
    setEndTone(title,'glitch');
  }else{
    title.innerHTML=win
    ?'<i data-lucide="crown"></i> GAME COMPLETE! <i data-lucide="crown"></i>'
    :'<i data-lucide="skull"></i> GAME OVER';
    refreshIcons();
    setEndTone(title,win?'win':'loss');
  }
  document.getElementById('end-dino').innerHTML=SPR_PLAYER;
  const endBanner = tag==='AUTHORED'
    ? `<div class="end-win-banner">— then it was not unwritten after all.<br>you wrote 50 pages. the book closed itself.<span class="end-bonus">+5000 BONUS</span></div>`
    : lossEnd
    ? `<div class="end-win-banner end-glitch">${tag==='UNWRITTEN'?'— the page is blank again. it will keep.':'— it stopped reading you.'}<br>
         <span class="end-sub">you did not lose to a level. the last page closed on you.</span>
         ${endLockLeft?`<span class="end-lock">✒️ WORLD END SEALED · ${endLockLeft}</span>`:''}</div>`
    : lossBeyond
    ? `<div class="end-win-banner end-glitch">— the world is glitching.<br>
         <span class="end-sub">not at you — <b>because of you</b>. the five marks you found
         opened a door the book was never compiled to have. what just killed you is the
         malfunction you caused, still running.</span></div>`
    : (win?`<div class="end-win-banner">🎉 You defeated ETERNUS PRIME and saved the realm!<span class="end-bonus">+5000 BONUS</span></div>`:'');
  document.getElementById('end-stats').innerHTML=`
    ${endBanner}
    <div class="end-score-hero" title="${fullScore(G.score)}">${fmtScore(G.score)}</div>
    <div class="end-score-lbl">FINAL SCORE</div>
    <div class="end-stat-grid">
      <div class="end-stat-card"><div class="es-icon">📍</div><div class="es-val">S${G.curStage+1}-L${G.curLevel+1}</div><div class="es-lbl" title="Stage Reached">Stage</div></div>
      <div class="end-stat-card"><div class="es-icon">❤</div><div class="es-val" title="${fullScore(G.playerMaxHP)}">${fmtScore(G.playerMaxHP)}</div><div class="es-lbl">Max HP</div></div>
      <div class="end-stat-card"><div class="es-icon">⚔</div><div class="es-val" title="+${fullScore(G.pATK)}">+${fmtScore(G.pATK)}</div><div class="es-lbl">ATK Bonus</div></div>
      <div class="end-stat-card"><div class="es-icon">🛡</div><div class="es-val" title="${G.pRES} RES = ${Math.round(resMitigation(G.pRES)*100)}% damage reduction">${G.pRES}</div><div class="es-lbl">Resistance</div></div>
    </div>
    <div class="end-diff-tag">${G.diff.toUpperCase()} MODE</div>
  `;
  document.getElementById('name-in').value='';
  applyTrainingEndUI();
  if(win)sfx.victory();else sfx.gameover();
  show('s-end');
}
// Sanitize + validate before writing a leaderboard entry
function saveScore(){
  if(!G||typeof G.score!=='number'||G.score<0)return;
  if(isTrainingRun()){                              // TRAINING is never ranked
    setMsg('🏋 Training runs are not scored — nothing was submitted.','var(--amber)');
    show('s-lb');renderLB();return;
  }
  const rawName=(document.getElementById('name-in').value||'').trim().toUpperCase();
  const name=(rawName.replace(/[^A-Z0-9 _-]/g,'')||'ANON').slice(0,10);
  const board=getBoard();
  board.push({
    name,score:G.score,stage:`S${G.curStage+1}-L${G.curLevel+1}`,
    diff:G.diff,timed:G.timedMode!==false,
    type:G.isSyllabusRun?'practice':'normal',
    hp:G.playerMaxHP,atk:G.pATK,res:G.pRES,
    loadout:(G.loadout||[]).filter(t=>PU[t]),
    date:Date.now()
  });
  board.sort((a,b)=>b.score-a.score);
  try{localStorage.setItem('dqb3_lb',JSON.stringify(board.slice(0,10)));}catch(e){}
  sfx.victory();show('s-lb');renderLB();
}
function getBoard(){
  try{
    const b=JSON.parse(localStorage.getItem('dqb3_lb'))||[];
    return b.filter(e=>e&&(e.type||'normal')!=='training');
  }catch{return[];}
}

let _lbTab='normal';
function renderLB(tab){
  if(tab)_lbTab=tab;
  const tabsEl=document.getElementById('lb-tabs');
  if(tabsEl){
    tabsEl.innerHTML=`
      <button class="lb-tab${_lbTab==='normal'?' active':''}" onclick="renderLB('normal')"><i data-lucide="sword"></i> NORMAL</button>
      <button class="lb-tab${_lbTab==='practice'?' active':''}" onclick="renderLB('practice')"><i data-lucide="book-open"></i> PRACTICE</button>
    `;
  }
  const rows=document.getElementById('lb-rows');
  const board=getBoard().filter(e=>(e.type||'normal')===_lbTab);
  const worldOf=st=>{const m=/^S(\d+)/.exec(st||'');if(!m)return 0;
    const i=(+m[1])-1;return (STAGES[i]&&STAGES[i].world)||0;};
  rows.innerHTML=board.length?board.map((e,i)=>{
    const mode=e.timed===false?'<span class="lb-mode chill">CHILL</span>':'<span class="lb-mode timed">TIMED</span>';
    const loadoutHtml=(e.loadout||[]).length
      ? e.loadout.map(t=>PU[t]?`<span class="lb-pu" title="${PU[t].name}">${luc(PU_ICON_MAP[t]||'sparkles',13)}</span>`:'').join('')
      : '<span class="lb-pu-none">no loadout</span>';
    const w=worldOf(e.stage);
    const when=e.date?new Date(e.date).toLocaleDateString(undefined,{month:'short',day:'numeric'}):'';
    return `<div class="lb-card${i<3?' r'+(i+1):''}">
      <div class="lb-rank">${i<3?luc('medal',18):('#'+(i+1))}</div>
      <div class="lb-main">
        <div class="lb-name-row"><span class="lb-name">${e.name}</span>${mode}<span class="lb-diff">${(e.diff||'').toUpperCase()}</span>${w?`<span class="lb-world">WORLD ${w}</span>`:''}</div>
        <div class="lb-sub-row">
          <span>${luc('map-pin',12)} ${e.stage}</span>
          <span title="${fullScore(e.hp||0)} max HP">${luc('heart',12)} ${e.hp?fmtScore(e.hp):'—'}</span>
          <span title="+${fullScore(e.atk||0)} ATK">${luc('swords',12)} +${fmtScore(e.atk||0)}</span>
          <span title="${e.res||0} RES = ${Math.round(resMitigation(e.res||0)*100)}% damage reduction">${luc('shield',12)} ${e.res||0}</span>
          ${when?`<span>${luc('calendar',12)} ${when}</span>`:''}
        </div>
        <div class="lb-loadout">${loadoutHtml}</div>
      </div>
      <div class="lb-score" title="${fullScore(e.score)}">${fmtScore(e.score)}</div>
    </div>`;
  }).join(''):`<div class="lb-empty">${luc('trophy',26)}<span>No ${_lbTab} scores yet</span><small>Finish a run and save your score to claim the top slot.</small></div>`;
  refreshIcons();
}
let _actx=null;
function ac(){if(!_actx)_actx=new(window.AudioContext||window.webkitAudioContext)();return _actx;}
function beep(f,t,d,v=.22){try{const c=ac(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=t;o.frequency.value=f;g.gain.value=v;g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.start();o.stop(c.currentTime+d);}catch(e){}}
const sfx={correct:()=>{beep(523,'sine',.08,.2);setTimeout(()=>beep(659,'sine',.08,.2),90);setTimeout(()=>beep(784,'sine',.12,.2),180);},wrong:()=>{beep(200,'sawtooth',.12,.3);setTimeout(()=>beep(150,'sawtooth',.12,.3),110);},hit:()=>{beep(180,'sawtooth',.13,.35);setTimeout(()=>beep(130,'sawtooth',.1,.3),100);},powerup:()=>{[440,554,659,880].forEach((f,i)=>setTimeout(()=>beep(f,'sine',.1,.2),i*55));},halfhp:()=>{[220,330,440,550,660,880].forEach((f,i)=>setTimeout(()=>beep(f,'square',.12,.35),i*60));},victory:()=>{[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,'square',.18,.3),i*110));},gameover:()=>{[440,330,220,165].forEach((f,i)=>setTimeout(()=>beep(f,'sawtooth',.25,.4),i*180));},tick:()=>beep(880,'square',.04,.15),stage:()=>{[392,494,587,784].forEach((f,i)=>setTimeout(()=>beep(f,'square',.15,.28),i*90));},};

document.getElementById('title-dino').innerHTML=SPR_PLAYER;
if(window.lucide)lucide.createIcons();

/* ---------- DAILY STREAK ---------- */
const DAILY_KEY='dqb3_daily';
// 7-day reward cycle  gifts are inventory powerups
const DAILY_REWARDS=[
  {pu:'heal',   amt:2},
  {pu:'double', amt:1},
  {pu:'shield', amt:1},
  {pu:'freeze', amt:1},
  {pu:'poison', amt:2},
  {pu:'divine', amt:1},
  {pu:'gamble', amt:2},
];
function todayStr(){return new Date().toISOString().slice(0,10);}
function getDaily(){try{return JSON.parse(localStorage.getItem(DAILY_KEY))||{streak:0,last:null,pending:{}};}catch(e){return{streak:0,last:null,pending:{}};}}
function setDaily(d){try{localStorage.setItem(DAILY_KEY,JSON.stringify(d));}catch(e){}}

function checkDailyStreak(){
  const d=getDaily();
  const today=todayStr();
  if(d.last===today)return; // already opened today

  // compute if yesterday to continue streak, else reset
  const y=new Date();y.setDate(y.getDate()-1);
  const yStr=y.toISOString().slice(0,10);
  if(d.last===yStr)d.streak=(d.streak||0)+1;
  else d.streak=1;
  d.last=today;
  d._justClaimedDay=((d.streak-1)%7); // index into reward cycle
  setDaily(d);
  showStreakModal(d);
}

function showStreakModal(d){
  const rewardIdx=d._justClaimedDay;
  document.getElementById('streak-count').textContent='DAY '+d.streak;
  const cells=document.getElementById('streak-days');
  const cycleDay=(d.streak-1)%7;
  cells.innerHTML=DAILY_REWARDS.map((r,i)=>{
    let cls='sd-cell';
    if(i<cycleDay)cls+=' claimed';
    else if(i===cycleDay)cls+=' today';
    else cls+=' future';
    return `<div class="${cls}">
      <div class="sd-day">D${i+1}</div>
      <div class="sd-gift">${PU[r.pu].icon}</div>
      <div class="sd-amt">${PU[r.pu].name} x${r.amt}</div>
    </div>`;
  }).join('');
  const r=DAILY_REWARDS[rewardIdx];
  document.getElementById('streak-reward').innerHTML=
    `Today's gift: <b style="color:${PU[r.pu].color}">${PU[r.pu].icon} ${PU[r.pu].name} x${r.amt}</b>`;
  document.getElementById('streak-modal').classList.add('on');
  refreshIcons();
}

// Confirm daily-reward index exists before claiming (guards against a corrupted dqb3_daily blob)
function claimDaily(){
  const d=getDaily();
  const r=DAILY_REWARDS[d._justClaimedDay];
  if(!r){ closeModal('streak-modal'); return; }   // NEW
  d.pending=d.pending||{};
  d.pending[r.pu]=(d.pending[r.pu]||0)+r.amt;
  setDaily(d);
  sfx.powerup();
  closeModal('streak-modal');
}

// apply any pending daily gifts into a fresh run's inventory
function applyDailyGifts(){
  const d=getDaily();
  if(d.pending){
    /* The daily gift auto-fires when you need it — it does NOT join the
       loadout or sit in the inventory. Queued as a guardian, which is the
       machinery that already exists for "spend this for me at 50% HP". */
    G.pendingGuardians=G.pendingGuardians||[];
    Object.keys(d.pending).forEach(pu=>{
      if(!PU[pu])return;
      for(let i=0;i<(d.pending[pu]||0);i++)G.pendingGuardians.push(pu);
    });
    d.pending={};setDaily(d);
    if(typeof renderGuardianBadges==='function')try{renderGuardianBadges();}catch(e){}
  }
}


/* ---------- INTRO / HOW TO PLAY ---------- */
const INTRO_KEY='dqb3_seen_intro';
const INTRO_PAGES=[

{ t:'1 · WHAT THIS GAME IS', html:`
  <div class="ig-vs-demo">
    <div class="ig-vs-side"><div class="ig-vs-emoji">🦖</div>
      <div class="ig-vs-bar"><span style="width:78%;background:var(--green)"></span></div>
      <div class="ig-vs-label">YOU</div></div>
    <div class="ig-vs-mid">VS</div>
    <div class="ig-vs-side"><div class="ig-vs-emoji">🦕</div>
      <div class="ig-vs-bar"><span style="width:40%;background:var(--red)"></span></div>
      <div class="ig-vs-label">ENEMY</div></div>
  </div>
  <div class="ig-lede">
    A turn-based quiz RPG. Your <b style="color:var(--green)">knowledge is your weapon</b> —
    a correct answer is an attack, a wrong answer is a free hit for the enemy.
    Everything else (powerups, stats, attributes) only changes <i>how hard</i> that answer lands.
  </div>
  <div class="ig-callout">📖 Every system in the game, one part at a time. BACK and NEXT move between them; the counter above is where you are.</div>
`},

{ t:'2 · THE SHAPE OF A RUN', html:`
  <div class="ig-world-strip">
    <div class="ig-world-chip"><div class="icon">🌿</div><div class="lbl">WORLD 1<br>KNOWN LANDS</div></div>
    <div class="ig-world-chip"><div class="icon">🌑</div><div class="lbl">WORLD 2<br>DARK BEYOND</div></div>
    <div class="ig-world-chip"><div class="icon">⚡</div><div class="lbl">WORLD 3<br>THE ABYSS</div></div>
    <div class="ig-world-chip"><div class="icon">🌀</div><div class="lbl">WORLD 4<br>VOID FRONTIER</div></div>
    <div class="ig-world-chip"><div class="icon">👑</div><div class="lbl">WORLD 5<br>PANTHEON</div></div>
  </div>
  <ul class="ig-step-list">
    <li><span class="ig-step-dot">●</span><span><b>5 worlds → 25 stages → 125 battles.</b> Each stage is 5 levels.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>Level 5 of every stage</b> is a mini-boss. Stages marked with a crown end in a true <b style="color:var(--red)">world boss</b>.</span></li>
    <li><span class="ig-step-dot">●</span><span>Progress saves automatically after every level. Quitting mid-run keeps your place.</span></li>
    <li><span class="ig-step-dot">●</span><span>Beating <b>ETERNUS PRIME</b> in World 5 ends the run with a <b style="color:var(--yellow)">+5000</b> completion bonus.</span></li>
  </ul>
`},

{ t:'3 · DIFFICULTY & TIMER MODE', html:`
  <table class="ig-cmp-table">
    <tr><th>Mode</th><th>Timer</th><th>Choices</th><th>Drop rate</th></tr>
    <tr><td class="ig-cmp-name" style="color:var(--green)">EASY</td><td>30s</td><td>4</td><td>48%</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--yellow)">MEDIUM</td><td>20s</td><td>4</td><td>36%</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--red)">HARD</td><td>12s</td><td>6</td><td>24%</td></tr>
  </table>
  <ul class="ig-step-list">
    <li><span class="ig-step-dot">●</span><span>Difficulty also scales every enemy's damage: easy ×0.85, medium ×1, hard ×1.15.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>TIMED mode</b> — leftover seconds become raw damage. Fast answers hit far harder.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>CHILL mode</b> — no clock. You still get a flat 90% time bonus, so you lose the speed upside but never get rushed.</span></li>
  </ul>
  <div class="ig-callout">⚠ The timer toggle locks the moment a run starts. Choose it on the map before your first fight.</div>
`},

{ t:'4 · HOW YOUR DAMAGE IS BUILT', html:`
  <div class="ig-flow">
    <div class="ig-flow-step"><div class="ig-flow-num">1</div><div class="ig-flow-text"><b>Question tier</b> — easy 12, medium 22, hard 34 base.</div></div>
    <div class="ig-flow-arrow">+</div>
    <div class="ig-flow-step"><div class="ig-flow-num">2</div><div class="ig-flow-text"><b>Speed</b> — seconds left ×1.8 in timed mode.</div></div>
    <div class="ig-flow-arrow">+</div>
    <div class="ig-flow-step"><div class="ig-flow-num">3</div><div class="ig-flow-text"><b>Streak</b> — +3 per consecutive correct answer.</div></div>
    <div class="ig-flow-arrow">×</div>
    <div class="ig-flow-step"><div class="ig-flow-num">4</div><div class="ig-flow-text"><b>Combo multiplier</b> — then powerups (2× / 3× / RAGE) multiply on top.</div></div>
    <div class="ig-flow-arrow">+</div>
    <div class="ig-flow-step"><div class="ig-flow-num">5</div><div class="ig-flow-text"><b>Your ATK stat</b> and passive bonus join the hit <b>before</b> the multipliers, then attribute ATK% applies to the total.</div></div>
  </div>
  <div class="ig-callout">💡 ATK used to be added after the multipliers, which made it worth almost nothing late on. It goes in with everything else now, so 2× DMG doubles your stats too.</div>
`},

{ t:'5 · STREAK & COMBO', html:`
  <ul class="ig-step-list">
    <li><span class="ig-step-dot">●</span><span><b>Streak</b> = correct answers in a row. Resets to 0 on any wrong answer or timeout.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>Combo</b> = 1 + (streak ÷ 3), capped at <b style="color:var(--green)">×8</b>. A wrong answer only drops it by 1, so you recover fast.</span></li>
    <li><span class="ig-step-dot">●</span><span>Hitting streak <b>5, 10, 15, 20, 25 or 30</b> fires a one-off <b style="color:var(--yellow)">×1.5 burst</b> on that hit.</span></li>
    <li><span class="ig-step-dot">●</span><span>Streak 3+ adds <b>+10%</b> to your powerup drop chance. Streak 7+ can drop a free AUTO-REVIVE.</span></li>
    <li><span class="ig-step-dot">●</span><span>Your score goes up by exactly the damage you deal — so damage and score are the same race.</span></li>
  </ul>
`},

{ t:'6 · YOUR PASSIVE (AUTOMATIC)', html:`
  <div class="ig-sub">
    You never pick this. It upgrades on its own every 3 stages cleared and is shown in the battle topbar.
  </div>
  <table class="ig-cmp-table">
    <tr><th>Unlock</th><th>Passive</th></tr>
    <tr><td class="ig-cmp-name" style="color:var(--dim)">START</td><td>🩹 <b>Resilience</b> — heal +5 HP on every correct answer</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--teal)">3 STAGES</td><td>⚔ <b>Sharpened</b> — +10 flat damage on correct answers</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--orange)">6 STAGES</td><td>🔥 <b>Battle Aura</b> — +14 damage and heal 6 HP</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--yellow)">9 STAGES</td><td>🌟 <b>Heroic Soul</b> — +20 damage, heal 9 HP, 15% chance to crit for ×2.5</td></tr>
  </table>
`},

{ t:'7 · HOW THE ENEMY HITS BACK', html:`
  <div class="ig-flow">
    <div class="ig-flow-step"><div class="ig-flow-num">1</div><div class="ig-flow-text"><b>It can miss.</b> 12% on normals, 9% mini-boss, 6% boss.</div></div>
    <div class="ig-flow-arrow">▼</div>
    <div class="ig-flow-step"><div class="ig-flow-num">2</div><div class="ig-flow-text"><b>Momentum</b> — every other connected hit escalates, +10% each time up to <b style="color:var(--red)">+60%</b>.</div></div>
    <div class="ig-flow-arrow">▼</div>
    <div class="ig-flow-step"><div class="ig-flow-num">3</div><div class="ig-flow-text"><b>Crit</b> 8 / 12 / 15% by tier for ×1.6 — and separately <b>TRUE DMG</b> 4 / 7 / 10%, which ignores all your RESIST.</div></div>
    <div class="ig-flow-arrow">▼</div>
    <div class="ig-flow-step"><div class="ig-flow-num">4</div><div class="ig-flow-text">Your RESIST, SHIELD, BARRIER and attribute dodge are applied last.</div></div>
  </div>
  <div class="ig-callout">🛡 Every hit is capped as a share of your max HP — 18% normal, 24% mini, 30% boss. Nothing can one-shot you from full.</div>
`},

{ t:'8 · ENEMY PASSIVES & RESISTANCE', html:`
  <div class="ig-sub">
    Read <b style="color:var(--teal)">ENEMY PASSIVE &amp; RES</b> in the battle topbar before you spend anything.
  </div>
  <table class="ig-cmp-table">
    <tr><th>Trait</th><th>What it does to you</th></tr>
    <tr><td class="ig-cmp-name" style="color:var(--cyan)">DODGE</td><td>A flat % of your correct answers deal nothing. POISON shreds it.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--blue)">DMG REDUCTION</td><td>Cuts all your damage by a fixed %.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--red)">THORNS</td><td>Reflects part of your damage back at you.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--purple)">LIFESTEAL</td><td>It heals from the damage it deals you.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--green)">REGEN</td><td>Heals a % of max HP each turn. BURN blocks it.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--yellow)">RESISTANCE</td><td>Named as <b>×IMM</b> (fully immune) or a % reduction to that status.</td></tr>
  </table>
  <div class="ig-callout">⚠ Late bosses also run scripted specials at HP thresholds — erasing items, enraging, or restoring their own HP.</div>
`},

{ t:'9 · ELEMENTAL CONTACT DAMAGE', html:`
  <div class="ig-sub">
    Every stage has a hidden element. When you strike it, its body can strike back with a status.
  </div>
  <table class="ig-cmp-table">
    <tr><th>Element</th><th>On contact</th></tr>
    <tr><td class="ig-cmp-name" style="color:var(--purple)">☠ POISON</td><td>35% — poisons you for 3 turns</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--orange)">🔥 FIRE</td><td>30% — burns you for 3 turns</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--cyan)">❄ ICE</td><td>30% — SLOWED, your answer timer is cut 40%</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--cyan)">⚡ ELECTRIC</td><td>25% — paralyzes you for 1 turn</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--purple)">🌑 SHADOW / VOID</td><td>25% — BLINDED, your choices blur for 2 turns</td></tr>
  </table>
  <div class="ig-callout">💡 Boss attributes with immunity (Infinite Loop, Flame Armor) shut these off completely.</div>
`},

{ t:'10 · POWERUPS — OFFENSE', html:`
  <table class="ig-cmp-table">
    <tr><th>Item</th><th>Effect</th></tr>
    <tr><td class="ig-cmp-name" style="color:var(--yellow)">⚡ 2× DMG</td><td>Next hit doubled. Stacks multiply into one hit.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--yellow)">⚡ OVERLOAD</td><td>Next hit ×3, but the next hit you take is +20%.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--orange)">🔥 BURN</td><td>Damage over 3 turns and <b>blocks enemy regen</b>.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--purple)">☠ POISON</td><td>Damage over 4 turns and <b>shreds enemy dodge</b>.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--red)">💀 HALF HP</td><td>Halves current enemy HP. Heavily resisted by bosses.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--red)">💣 NUKE</td><td>Deals 50% of <b>your</b> max HP as damage.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--purple)">🩸 LEECH</td><td>Steals 8% of the enemy's current HP.</td></tr>
  </table>
  <div class="ig-callout">💡 Damage numbers scale with your max HP as you level, so these never fall off.</div>
`},

{ t:'11 · POWERUPS — DEFENSE & CONTROL', html:`
  <table class="ig-cmp-table">
    <tr><th>Item</th><th>Effect</th></tr>
    <tr><td class="ig-cmp-name" style="color:var(--teal)">🛡 SHIELD</td><td>Absorbs 50% of damage for 3 hits.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--blue)">🧱 BARRIER</td><td>Blocks the next 2 hits <b>completely</b>.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--teal)">🪞 MIRROR</td><td>Reflects one incoming hit back. Stacks multiply the reflect.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--blue)">❄ FREEZE</td><td>Skips a turn <b>and</b> your next hit deals +20%. Best combo opener.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--cyan)">⚡ PARALYZE</td><td>Skips a turn, 30% chance to chain into another.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--yellow)">💫 STUN</td><td>Guaranteed skip that <b style="color:var(--red)">ignores all immunity</b>.</td></tr>
  </table>
  <div class="ig-callout">⚠ Most late bosses are immune to FREEZE and PARALYZE. STUN is the only control that always lands — save it.</div>
`},

{ t:'12 · POWERUPS — SUPPORT', html:`
  <table class="ig-cmp-table">
    <tr><th>Item</th><th>Effect</th></tr>
    <tr><td class="ig-cmp-name" style="color:var(--green)">💚 HEAL</td><td>Restores 6% of your max HP.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--green)">💉 REGEN</td><td>Heals over 3 turns.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--yellow)">🌟 DIVINE</td><td>Full HP restore.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--pink)">🍖 AUTO-REVIVE</td><td>Own slot in the inventory. Survives one killing blow.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--red)">😤 RAGE</td><td>ATK ×2 for 3 turns at the cost of HP each turn.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--orange)">🎯 50/50</td><td>Removes 2 wrong choices.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--purple)">🔮 ORACLE</td><td>Reveals the correct answer outright.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--blue)">👁 INSIGHT</td><td>Adds +30s to the current timer.</td></tr>
    <tr><td class="ig-cmp-name" style="color:var(--pink)">🎲 GAMBLE</td><td>Rolls a random powerful effect.</td></tr>
  </table>
`},

{ t:'13 · HOW YOU GET POWERUPS', html:`
  <ul class="ig-step-list">
    <li><span class="ig-step-dot">●</span><span><b>World 1 loadout</b> — pick <b style="color:var(--yellow)">3</b> from an offer of 8. These 3 are your permanent loadout.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>World 2 &amp; 3</b> — add 1 more, and every stack you own refills <b>+2</b>.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>World 4</b> — add 1 more, all stacks <b>+3</b>. <b>World 5</b> — add <b>2</b> more, all stacks <b>+4</b>.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>Mid-run bonus</b> — every other level you pick 1 of 3 from the full item list.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>Battle drops</b> — every correct answer rolls for one item from your loadout: <b>48%</b> easy, <b>36%</b> medium, <b>24%</b> hard, and <b>+10%</b> once you are on a 3-streak.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>🍖 AUTO-REVIVE</b> is the exception — see the next page.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>Daily gifts</b> are added to your inventory when you begin a fresh run.</span></li>
  </ul>
  <div class="ig-callout">💡 A mid-run reward you don't already carry is never stored: healing items become a 🛡 <strong>GUARDIAN</strong> that fires on its own at low HP, and anything else fires itself at the start of the next fight. If it can't land, it waits and tries again.</div>
`},

{ t:'14 · AUTO-REVIVE', html:`
  <div class="ig-vs-demo ig-rev-demo">
    <div class="ig-vs-side"><div class="ig-vs-emoji">🍖</div>
      <div class="ig-vs-label">HELD</div></div>
    <div class="ig-vs-mid">→</div>
    <div class="ig-vs-side"><div class="ig-vs-emoji">💀</div>
      <div class="ig-vs-label">YOU DIE</div></div>
    <div class="ig-vs-mid">→</div>
    <div class="ig-vs-side"><div class="ig-vs-emoji">🦖</div>
      <div class="ig-vs-bar"><span style="width:25%;background:var(--green)"></span></div>
      <div class="ig-vs-label">25% HP</div></div>
  </div>
  <ul class="ig-step-list">
    <li><span class="ig-step-dot">●</span><span>It has its own slot above your powerups and <b>cannot be used by hand</b>. It spends itself the instant a hit would end the run.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>Two ways to get one.</b> Take it at a loadout screen to start the run holding it — or earn one in battle.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>Earning one:</b> on a <b style="color:var(--yellow)">7+ streak</b>, any answer that drops nothing else has an <b>8%</b> chance of leaving a revive instead.</span></li>
    <li><span class="ig-step-dot">●</span><span>You can hold <b>two</b> at most. Past that the roll stops — bank one spare, not a stack.</span></li>
  </ul>
  <div class="ig-callout">💡 That works out to roughly one revive every 20-25 answers while a streak is running — often enough to be a real net, rarely enough that dying still costs you something.</div>
`},

{ t:'15 · LEVEL CLEAR, STATS & CAPS', html:`
  <ul class="ig-step-list">
    <li><span class="ig-step-dot">●</span><span>Every cleared level grants permanent <b style="color:var(--red)">MAX HP</b>, <b style="color:var(--orange)">ATTACK</b> and <b style="color:var(--blue)">RESIST</b>. Some levels grant zero of one — that row shows a dash, not a bug.</span></li>
    <li><span class="ig-step-dot">●</span><span>You also <b style="color:var(--green)">recover 40% of max HP</b> after every win, so you enter each fight healthy.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>RESIST</b> cuts incoming damage on a curve — but never against TRUE DMG.</span></li>
    <li><span class="ig-step-dot">●</span><span>Named world bosses grant a <b style="color:var(--yellow)">permanent stat multiplier</b> on top of the normal reward.</span></li>
    <li><span class="ig-step-dot">●</span><span>Stats are capped so late worlds stay dangerous. At a cap the reward row reads <b>MAX</b>.</span></li>
  </ul>
  <div class="ig-callout">⚠ Some World 4 enemies inflict permanent max HP loss. It can never take more than 40% of your pool.</div>
`},

{ t:'16 · BOSS ATTRIBUTES', html:`
  <ul class="ig-step-list">
    <li><span class="ig-step-dot">●</span><span>Killing a <b>world boss</b> permanently unlocks that boss's signature attribute for your collection.</span></li>
    <li><span class="ig-step-dot">●</span><span>You equip them from the <b style="color:var(--yellow)">ATTR</b> bar at the top of the Home and Map screens — tap it to expand, then CHOOSE.</span></li>
    <li><span class="ig-step-dot">●</span><span>You start with <b>1 slot</b>. A <b>2nd slot</b> unlocks after clearing World 3.</span></li>
    <li><span class="ig-step-dot">●</span><span>They give dodge, damage reduction, reflect, lifesteal, regen, status immunity, ATK% or healing%. Each effect is capped at 30% total, status resist at 80%.</span></li>
    <li><span class="ig-step-dot">●</span><span>Loadout <b>locks the moment you enter an unfinished world</b> and unlocks again when you beat its boss.</span></li>
  </ul>
  <div class="ig-callout">💡 Swap between worlds, not between fights — match the attribute to the next world's threat.</div>
`},

{ t:'17 · TRAINING, SYLLABUS, STREAK & RANKS', html:`
  <ul class="ig-step-list">
    <li><span class="ig-step-dot">●</span><span><b style="color:var(--red)">TRAINING</b> — jump into any stage with full stats and 5 of every powerup. Nothing is saved or scored.</span></li>
    <li><span class="ig-step-dot">●</span><span><b style="color:var(--teal)">SYLLABUS SCAN</b> — upload a PDF/TXT or paste text, review the detected topics, and battle using <b>your own class questions</b>.</span></li>
    <li><span class="ig-step-dot">●</span><span>Syllabus runs save <b>separately</b> from your normal run. You can switch freely and lose neither.</span></li>
    <li><span class="ig-step-dot">●</span><span><b style="color:var(--orange)">DAILY STREAK</b> — open the game once a day for a gift on a 7-day cycle. Missing a day resets to Day 1.</span></li>
    <li><span class="ig-step-dot">●</span><span><b style="color:var(--yellow)">HALL OF FAME</b> — top 10 scores, each recording your difficulty, timer mode, loadout and final stats.</span></li>
  </ul>
  <div class="ig-callout">🎮 That's the whole system. Close this and hit START GAME — good luck out there!</div>
`},

/* The last page names nothing. There IS more past World 5, and a player who
   has not finished the printed book must not learn that from a help screen —
   half the point of what comes after is that it arrives uninvited. No world
   numbers, no names, nothing to look up. */
{ t:'???', html:`
  <div class="ig-unknown">
    <div class="ig-unknown-mark" aria-hidden="true">?</div>
    <div class="ig-unknown-body">
      <p>Five worlds. Twenty-five stages. One hundred and twenty-five battles,
         and then ETERNUS PRIME.</p>
      <p>That is the game. It is the whole game, and this guide has just
         described all of it.</p>
      <p class="ig-unknown-quiet">There is nothing to unlock here. No code, no
         purchase, no setting. Finish the book.</p>
    </div>
  </div>
`},

];
let _introPage=0;
function openIntro(first){
  _introPage=0;renderIntro();
  document.getElementById('intro-modal').classList.add('on');
  if(first){try{localStorage.setItem(INTRO_KEY,'1');}catch(e){}}
}

function _introFit(){
  const m=document.getElementById('intro-modal'); if(!m||m._fit)return;
  const box=m.querySelector('.modal-box')||m.firstElementChild;
  if(box)box.classList.add('intro-wide');
  const prev=document.getElementById('intro-prev'),
        next=document.getElementById('intro-next'),
        dots=document.getElementById('intro-dots');
  if(!prev||!next||!box)return;
  /* SKIP — 15 pages is a lot to sit through on a second playthrough */
  if(!document.getElementById('intro-skip')){
    const sk=document.createElement('button');
    sk.id='intro-skip'; sk.className='pbtn sm intro-skip';
    sk.innerHTML='SKIP';
    sk.onclick=()=>closeModal('intro-modal');
    box.appendChild(sk);
  }
  if(!document.getElementById('intro-count')){
    const c=document.createElement('div');
    c.id='intro-count'; c.className='intro-count';
    box.insertBefore(c, document.getElementById('intro-body'));
  }
  let row=prev.parentElement;
  if(row===box||!row.contains(next)){
    row=document.createElement('div');row.className='ig-nav';
    box.appendChild(row);row.appendChild(prev);
    if(dots)row.appendChild(dots);
    row.appendChild(next);
  }else{
    row.classList.add('ig-nav');
    if(dots&&!row.contains(dots))row.insertBefore(dots,next);
  }
  row.insertBefore(prev,row.firstChild);
  box.appendChild(row);
  m._fit=1;
}

function renderIntro(){
_introFit();
  const p=INTRO_PAGES[_introPage];
  document.getElementById('intro-title').textContent=p.t;
  document.getElementById('intro-body').innerHTML=
    p.html ? p.html : `<div class="ig-plain">${p.b}</div>`;
  document.getElementById('intro-dots').innerHTML=INTRO_PAGES.map((_,i)=>
    `<span class="ig-dot${i===_introPage?' on':''}" role="presentation"></span>`
  ).join('');
  const cEl=document.getElementById('intro-count');
  if(cEl)cEl.textContent=`${_introPage+1} / ${INTRO_PAGES.length}`;
  const sk=document.getElementById('intro-skip');
  if(sk)sk.style.display=(_introPage>=INTRO_PAGES.length-1)?'none':'';
  const nextBtn=document.getElementById('intro-next');
  const isLast=_introPage>=INTRO_PAGES.length-1;
  nextBtn.innerHTML=isLast?'<i data-lucide="check"></i> GOT IT!':'NEXT <i data-lucide="arrow-right"></i>';
  document.getElementById('intro-prev').disabled=_introPage<=0;
  refreshIcons();
}
document.getElementById('intro-next').onclick=()=>{
  if(_introPage>=INTRO_PAGES.length-1){closeModal('intro-modal');}
  else{_introPage++;renderIntro();}
};
document.getElementById('intro-prev').onclick=()=>{if(_introPage>0){_introPage--;renderIntro();}};

/* ---------- PRACTICE MODE ---------- */
/* Worlds the player has actually opened. 5 until the five seams are found,
   10 once the margin opens, 11 once the END is revealed. */
function practiceMaxWorld(){
  try{ return (window.W2&&W2.maxWorldUnlocked)?W2.maxWorldUnlocked():5; }
  catch(e){ return 5; }
}
function practiceStageAllowed(si){
  const stg=STAGES[si]; if(!stg) return false;
  return (stg.world||1)<=practiceMaxWorld();
}

function openPractice(){
  const sel=document.getElementById('practice-stage-sel');
  /* Training used to list all 51 stages, which announced worlds 6-11 to
     anyone who opened the menu — the one thing the seams exist to withhold.
     It lists only what the player has unlocked. */
  sel.innerHTML=STAGES.map((stg,si)=>({stg,si}))
    .filter(({si})=>practiceStageAllowed(si))
    .map(({stg,si})=>`<option value="${si}">S${si+1} — ${stg.name}</option>`)
    .join('');
  sel.value=0;
  onPracticeStageChange();
  document.getElementById('practice-modal').classList.add('on');
  refreshIcons();
}

function onPracticeStageChange(){
  const si=+document.getElementById('practice-stage-sel').value;
  const stg=STAGES[si];
  document.getElementById('practice-icon').textContent=stg.icon;
  document.getElementById('practice-name').textContent=`S${si+1} — ${stg.name}`;
  document.getElementById('practice-passive').textContent=stg.passive.label+' — '+stg.passive.desc;
  const lvlSel=document.getElementById('practice-level-sel');
  lvlSel.innerHTML=stg.levels.map((lv,li)=>
    `<option value="${li}">L${li+1} — ${lv.sub}${lv.boss?' (BOSS)':lv.mini?' (Mini-Boss)':''}</option>`
  ).join('');
  lvlSel.value=0;
}

function confirmPractice(){
  const si=+document.getElementById('practice-stage-sel').value;
  const li=+document.getElementById('practice-level-sel').value;
  if(!Number.isInteger(si)||si<0||si>=STAGES.length)return;        // NEW
  if(!Number.isInteger(li)||li<0||li>=STAGES[si].levels.length)return;
  if(!practiceStageAllowed(si))return;    // a locked world cannot be entered
  startPractice(si,li);
}

function startPractice(si,li){
  if(!practiceStageAllowed(si)){ closeModal('practice-modal'); return; }
  closeModal('practice-modal');
  G=freshState('medium');syncG();
  G.isPractice=true;
  leaveBattleState();
  G.pickDone=true;
  const prog=computeProgressStats(si,li);
  G.pHP=prog.pHP;G.pATK=prog.pATK;G.pRES=prog.pRES;G.stagesCleared=prog.stagesCleared;
  capPlayerStats();
  G.playerMaxHP=Math.min(CAPS.hpMax,500+G.pHP);
  G.playerHP=G.playerMaxHP;
  /* Training loadout follows the era of the stage you picked. A World 6+
     stage hands you ONLY the six late power-ups, so they can be learned on
     their own; Worlds 1-5 keep the base set and never see them. */
  const _isNew=t=>!!(window.W2&&W2.isNewPU&&W2.isNewPU(t));
  const _world=(STAGES[si]&&STAGES[si].world)||1;
  G.loadout=(_world>=6&&window.W2&&W2.NEW_PU)
    ? Object.keys(W2.NEW_PU)
    : Object.keys(PU).filter(t=>!_isNew(t));
  Object.keys(G.inv).forEach(k=>G.inv[k]=0);
  G.loadout.forEach(t=>{G.inv[t]=5;});
  G.curStage=si;G.curLevel=li;
  show('s-game');
  loadLevel(si,li);
}

/* ---------- POWERUP GUIDE ---------- */
function openPowerupGuide(){
  const list=document.getElementById('pu-guide-list');
  list.innerHTML=PU_CATEGORIES.map(cat=>{
    const sub=document.querySelector('#pu-guide-modal .modal-sub');
  if(sub)sub.innerHTML=`Powerups scale with your world — <b style="color:var(--purple)">TIER ${puTier()}</b>. `+
    `Heals, regen, poison and burn are percentages, so they stay useful in Worlds 3-5. `+
    `World transitions add <b>charges</b>; the percentages handle the <b>power</b>. `+
    ((window.W2&&W2.A&&W2.A().gateOpen)
      ? `The six marked <b>AUTO</b> unlock past the margin and fire themselves when their trigger is met.`
      : '');
    const have=cat.types.filter(t=>PU[t]);
    if(!have.length)return '';                 // World 6-11 block before W2 loads
    /* A margin power-up reveals itself once its world is actually reachable:
       maxWorldUnlocked() is 5 before the seams, 10 once the gate opens and 11
       once the end is revealed. So the set uncovers itself as you read on,
       rather than all at once. Until then it is a shape, not a spoiler. */
    const maxW=(window.W2&&W2.maxWorldUnlocked)?W2.maxWorldUnlocked():5;
    const items=have.map(t=>{
      const d=PU[t];
      const w=(window.W2&&W2.PU_UNLOCK&&W2.PU_UNLOCK[t])||0;
      const auto=(window.W2&&W2.isNewPU&&W2.isNewPU(t));
      const hide=!!(cat.margin && w && maxW<w);
      const icon=hide?'help-circle':(PU_ICON_MAP[t]||'sparkles');
      return `<div class="pug-item${hide?' pug-mystery':''}">
        <div class="pug-icon"><i data-lucide="${icon}"></i></div>
        <div class="pug-text">
          <div class="pug-name">${hide?MASK:d.name}${(!hide&&w)?` <span class="pug-w">W${w}</span>`:''}${(!hide&&auto)?' <span class="pug-auto">AUTO</span>':''}</div>
          <div class="pug-desc">${hide?MASK:puDesc(t)}</div>
        </div>
      </div>`;
    }).join('');
    const anyShown=have.some(t=>{
      const w=(window.W2&&W2.PU_UNLOCK&&W2.PU_UNLOCK[t])||0;
      return !(cat.margin && w && maxW<w);
    });
    const label=(cat.margin&&!anyShown)?MASK:cat.label;
    return `<div class="pug-section">
      <div class="pug-cat-label">${label}</div>
      <div class="pug-grid">${items}</div>
    </div>`;
  }).join('');
  document.getElementById('pu-guide-modal').classList.add('on');
  refreshIcons();
}

function openTitleMenu(){document.getElementById('title-menu-modal').classList.add('on');updateAchBar();refreshIcons();}
function confirmResetProgress(){
  closeModal('title-menu-modal');
  const hasNormal=hasSave(),hasPractice=hasPracticeSave();
  const titleEl=document.getElementById('reset-modal-title');
  const subEl=document.getElementById('reset-modal-sub');
  const choicesEl=document.getElementById('reset-modal-choices');

  if(!hasNormal && !hasPractice){
    titleEl.textContent='NOTHING TO RESET';
    subEl.textContent='You don\'t have any saved run right now.';
    choicesEl.innerHTML=`<button class="pbtn sm u-full" onclick="closeModal('reset-confirm-modal')"><i data-lucide="x"></i> CLOSE</button>`;
  }else if(hasNormal && hasPractice){
    titleEl.textContent='RESET WHICH RUN?';
    subEl.textContent='Leaderboard scores and daily streak are always kept.';
    choicesEl.innerHTML=`
      <button class="pbtn r sm u-full" onclick="doResetProgress('normal')"><i data-lucide="sword"></i> RESET NORMAL RUN</button>
      <button class="pbtn b sm u-full" onclick="doResetProgress('practice')"><i data-lucide="book-open"></i> RESET PRACTICE MODE</button>
      <button class="pbtn sm u-full" onclick="closeModal('reset-confirm-modal')"><i data-lucide="x"></i> CANCEL</button>
    `;
  }else{
    const which=hasNormal?'normal':'practice';
    titleEl.textContent='RESET RUN?';
    subEl.textContent=`This clears your ${hasNormal?'normal':'practice'} run (stage, HP, inventory). Your leaderboard scores and daily streak are kept.`;
    choicesEl.innerHTML=`
      <div class="u-row-8">
        <button class="pbtn sm u-flex1" onclick="closeModal('reset-confirm-modal')"><i data-lucide="x"></i> CANCEL</button>
        <button class="pbtn r sm u-flex1" onclick="doResetProgress('${which}')"><i data-lucide="trash-2"></i> ERASE</button>
      </div>
    `;
  }
  document.getElementById('reset-confirm-modal').classList.add('on');
  refreshIcons();
}

function doResetProgress(target){
  try{
    if(target==='practice')clearPracticeSave();
    else clearSave();
  }catch(e){ console.error('Reset failed:',e); }
  closeModal('reset-confirm-modal');
  refreshTitle();
  if(document.getElementById('s-home').classList.contains('on'))renderHome();
}
/* ---------- HOME / HUB ---------- */
function renderHome(){
  const contCard=document.querySelector('#s-home [onclick="continueGame()"]');
  if(contCard)contCard.style.opacity=hasSave()?'1':'0.35';
  const practiceBtn=document.getElementById('continue-practice-btn2');
  if(practiceBtn)practiceBtn.style.display=hasPracticeSave()?'flex':'none';
  const d=getDaily();
  document.getElementById('home-streak-num').textContent=d.streak||0;
  document.getElementById('home-streak-sub').textContent=
    d.streak>0?`Best run: keep it going!`:`Start today to begin your streak`;
  const pips=document.getElementById('home-streak-pips');
  const cycleDay=((d.streak||0)-1+7)%7;
  pips.innerHTML=Array.from({length:7}).map((_,i)=>{
    let cls='hsp';
    if(d.streak>0){
      if(i<cycleDay)cls+=' done';
      else if(i===cycleDay)cls+=' today';
    }
    return `<div class="${cls}"></div>`;
  }).join('');

    const board=getBoard();
  const bestScore=board.length?Math.max(...board.map(b=>b.score)):0;
  let savedInfo=null;
  try{
    const s=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(s)savedInfo={stage:`S${(s.curStage||0)+1}-L${(s.curLevel||0)+1}`,diff:(s.diff||'—').toUpperCase()};
  }catch(e){}
  let practiceInfo=null;
  try{
    const p=JSON.parse(localStorage.getItem(PRACTICE_SAVE_KEY));
    if(p)practiceInfo={
      stage:`S${(p.curStage||0)+1}-L${(p.curLevel||0)+1}`,
      qCount:Array.isArray(p.customQuizPool)?p.customQuizPool.length:0,
      diff:(typeof p.diff==='string'&&p.diff)?p.diff.toUpperCase():'—',
      bestScore:(typeof p.score==='number')?p.score:0
    };
  }catch(e){}

  const hasAnyRun = hasSave() || hasPracticeSave() || board.length>0;

  if(!hasAnyRun){
    document.getElementById('home-stats-grid').innerHTML=`
      <div class="home-empty-state">
        <div class="home-empty-icon">🗺️</div>
        <div class="home-empty-title">NO PROGRESS YET</div>
        <div class="home-empty-sub">Start a New Run to begin your adventure</div>
        <div class="home-empty-divider"></div>
        <div class="home-empty-cta">
          <i data-lucide="book-open"></i>
          Want to practice your academic skills? Try <b>Syllabus Scan</b> below.
        </div>
      </div>`;
    refreshIcons();
    }else{
    let html=`
      <div class="stat-row-3">
        <div class="home-stat-item"><b>${bestScore}</b><span>Best Score</span></div>
        <div class="home-stat-item"><b>${savedInfo?savedInfo.stage:'—'}</b><span>Last Stage</span></div>
        <div class="home-stat-item"><b>${savedInfo?savedInfo.diff:'—'}</b><span>Difficulty</span></div>
      </div>
    `;
    if(practiceInfo){
      html+=`
      <div class="home-stat-divider">
        <i data-lucide="book-open"></i> PRACTICE MODE
      </div>
      <div class="stat-row-4">
        <div class="home-stat-item practice"><b>${practiceInfo.bestScore}</b><span>Best Score</span></div>
        <div class="home-stat-item practice"><b>${practiceInfo.stage}</b><span>Current Stage</span></div>
        <div class="home-stat-item practice"><b>${practiceInfo.diff}</b><span>Difficulty</span></div>
        <div class="home-stat-item practice"><b>${practiceInfo.qCount}</b><span>Questions</span></div>
      </div>
      `;
    }
    document.getElementById('home-stats-grid').innerHTML=html;
    refreshIcons();
  }
  renderAttrBar('map');
}
function closeModal(id){document.getElementById(id).classList.remove('on');}

function refreshIcons(){if(window.lucide)lucide.createIcons();}

// First-ever visit: show intro, then daily streak
window.addEventListener('load',()=>{
  let seenIntro=false;
  try{seenIntro=!!localStorage.getItem(INTRO_KEY);}catch(e){}
  if(!seenIntro){
    openIntro(true);
    // when they close intro, show daily  patch the next button once
    const origNext=document.getElementById('intro-next').onclick;
    document.getElementById('intro-next').onclick=function(){
      const wasLast=_introPage>=INTRO_PAGES.length-1;
      origNext();
      if(wasLast)setTimeout(checkDailyStreak,300);
    };
  }else{
    checkDailyStreak();
  }
});

/* ---------- PRACTICE MODE DAILY LIMIT ---------- */
const SYL_LIMIT_KEY='dqb3_syl_limit';
const SYL_DAILY_LIMIT=5;
const SYL_LIMIT_WINDOW_MS=24*60*60*1000; // 24 hours

function getSylLimit(){
  try{
    const d=JSON.parse(localStorage.getItem(SYL_LIMIT_KEY));
    if(!d||typeof d.count!=='number'||typeof d.resetAt!=='number')return{count:0,resetAt:0};
    if(Date.now()>=d.resetAt)return{count:0,resetAt:0}; // window expired, treat as fresh
    return d;
  }catch(e){return{count:0,resetAt:0};}
}
function setSylLimit(d){try{localStorage.setItem(SYL_LIMIT_KEY,JSON.stringify(d));}catch(e){}}

function sylCanGenerate(){
  const d=getSylLimit();
  return d.count<SYL_DAILY_LIMIT;
}
function sylConsumeGeneration(){
  let d=getSylLimit();
  if(d.count===0)d.resetAt=Date.now()+SYL_LIMIT_WINDOW_MS; // start a fresh 24h window on first use
  d.count++;
  setSylLimit(d);
}
function sylMsUntilReset(){
  const d=getSylLimit();
  return Math.max(0,d.resetAt-Date.now());
}
function sylFmtCountdown(ms){
  const h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000),s=Math.floor((ms%60000)/1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

let _sylLimitTimer=null;
function sylShowLimitReached(){
  document.getElementById('syl-err-title').textContent='Daily practice limit reached';
  const bodyEl=document.getElementById('syl-err-body');
  const retryBtn=document.getElementById('syl-err-retry');
  retryBtn.style.display='none';
  clearInterval(_sylLimitTimer);
  function tick(){
    const ms=sylMsUntilReset();
    if(ms<=0){
      clearInterval(_sylLimitTimer);
      retryBtn.style.display='inline-flex';
      bodyEl.textContent="You're free to generate again! Click Continue below.";
      retryBtn.onclick=()=>{
        retryBtn.style.display='';
        sylRenderStepper(4);sylShowStep('syl-step-topics');
      };
      return;
    }
    bodyEl.textContent=`You've used all ${SYL_DAILY_LIMIT} generations for today. Try again in ${sylFmtCountdown(ms)}.`;
  }
  tick();
  _sylLimitTimer=setInterval(tick,1000);
  sylShowStep('syl-step-error');
}

/* ============ SYLLABUS SCAN FEATURE ============ */
const SYL_SUBJECTS=[
  {id:'math',icon:'📐',name:'MATH',meta:'Algebra · Calc · Geometry'},
  {id:'bio',icon:'🧬',name:'BIOLOGY',meta:'Cells · Genetics · Ecology'},
  {id:'hist',icon:'🏛',name:'HISTORY',meta:'Eras · Events · Figures'},
  {id:'cs',icon:'💻',name:'COMP SCI',meta:'Data structures · Systems'},
  {id:'chem',icon:'⚗️',name:'CHEMISTRY',meta:'Reactions · Bonds · Labs'},
  {id:'lit',icon:'📖',name:'LITERATURE',meta:'Texts · Themes · Analysis'},
  {id:'phys',icon:'🌀',name:'PHYSICS',meta:'Motion · Energy · Waves'},
  {id:'other',icon:'📚',name:'OTHER',meta:'Any other subject'},
];
const SYL_STEPS=['subject','upload','progress','scan','topics','practice'];
let SYL={subject:null,rawText:'',topics:[],genQuestions:[],practiceIdx:0};
const SYL_API_URL='syllabus_api.php'; // change if hosted at a different path
let sylAbortController=null;
let sylErrorRetryFn=null;

function openSyllabusFlow(){
  SYL={subject:null,rawText:'',topics:[],genQuestions:[],practiceIdx:0};
  renderSylSubjects();
  document.getElementById('syl-subj-continue').disabled=true;
  const chip=document.getElementById('syl-subj-chip');
  chip.classList.remove('on');
  const remaining=SYL_DAILY_LIMIT-getSylLimit().count;
  if(remaining<SYL_DAILY_LIMIT){
    chip.classList.add('on');
    chip.textContent=`${remaining}/${SYL_DAILY_LIMIT} generations left today`;
  }
  sylShowStep('syl-step-subject');
  sylRenderStepper(0);
  show('s-syllabus');
}
/* BACK out of the syllabus flow. It used to hard-code s-home, so opening it
   from the title screen sent you somewhere you had not been. */
function closeSyllabusFlow(){goBack('s-home');}
function sylBackToSubject(){sylRenderStepper(0);sylShowStep('syl-step-subject');}

function sylShowStep(id){
  document.querySelectorAll('#s-syllabus .syl-card').forEach(c=>c.classList.remove('on'));
  document.getElementById(id).classList.add('on');
}
function sylRenderStepper(activeIdx){
  const el=document.getElementById('syl-stepper');
  el.innerHTML=SYL_STEPS.map((_,i)=>`<div class="syl-seg ${i<activeIdx?'done':i===activeIdx?'cur':''}"></div>`).join('');
}

/* ---- STEP 1: subject ---- */
function renderSylSubjects(){
  const grid=document.getElementById('syl-subj-grid');
  grid.innerHTML=SYL_SUBJECTS.map(s=>`
    <div class="syl-subj-card" data-id="${s.id}">
      <div class="syl-subj-icon">${s.icon}</div>
      <div class="syl-subj-name">${s.name}</div>
      <div class="syl-subj-meta">${s.meta}</div>
    </div>`).join('');
  grid.querySelectorAll('.syl-subj-card').forEach(card=>{
    card.onclick=()=>{
      grid.querySelectorAll('.syl-subj-card').forEach(c=>c.classList.remove('sel'));
      card.classList.add('sel');
      SYL.subject=SYL_SUBJECTS.find(s=>s.id===card.dataset.id);
      document.getElementById('syl-subj-continue').disabled=false;
    };
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('syl-subj-continue').onclick=()=>{
    const chip=document.getElementById('syl-subj-chip');
    chip.classList.add('on');chip.textContent=SYL.subject.icon+' '+SYL.subject.name;
    sylRenderStepper(1);sylShowStep('syl-step-upload');
  };

  const sylDropzone=document.getElementById('syl-dropzone'), sylFileInput=document.getElementById('syl-file-input');
  sylDropzone.onclick=()=>sylFileInput.click();
  ['dragover','dragenter'].forEach(ev=>sylDropzone.addEventListener(ev,e=>{e.preventDefault();sylDropzone.classList.add('drag');}));
  ['dragleave','drop'].forEach(ev=>sylDropzone.addEventListener(ev,e=>{e.preventDefault();sylDropzone.classList.remove('drag');}));
  sylDropzone.addEventListener('drop',e=>{const f=e.dataTransfer.files[0];if(f)handleSylFile(f);});
  sylFileInput.addEventListener('change',e=>{const f=e.target.files[0];if(f)handleSylFile(f);});

  document.getElementById('syl-upload-cancel').onclick=()=>{
    sylUploadCancelled=true;sylFileInput.value='';
    sylRenderStepper(1);sylShowStep('syl-step-upload');
  };
  document.getElementById('syl-err-retry').onclick=()=>{
    if(sylErrorRetryFn){const fn=sylErrorRetryFn;sylErrorRetryFn=null;fn();}
    else{document.getElementById('syl-file-input').value='';sylShowStep('syl-step-upload');}
  }; 
  document.getElementById('syl-err-cancel').onclick=()=>{clearInterval(_sylLimitTimer);sylRenderStepper(0);sylShowStep('syl-step-subject');};
  document.getElementById('syl-scan-cancel').onclick=()=>{
  sylScanCancelled=true;
  if(sylAbortController)sylAbortController.abort();
  sylRenderStepper(1);sylShowStep('syl-step-upload');
  };
  document.getElementById('syl-gen-cancel').onclick=()=>{
    sylGenCancelled=true;
    if(sylAbortController)sylAbortController.abort();
    sylRenderStepper(4);sylShowStep('syl-step-topics');
  };
  document.getElementById('syl-topics-back').onclick=()=>{sylRenderStepper(1);sylShowStep('syl-step-upload');};
  document.getElementById('syl-topics-continue').onclick=()=>sylBeginGenerate();
  document.getElementById('syl-start-practice').onclick=()=>startSyllabusPractice();
  document.getElementById('syl-practice-restart').onclick=()=>openSyllabusFlow();
});

function toggleSylPaste(){
  const ta=document.getElementById('syl-paste-area'),row=document.getElementById('syl-paste-btnrow');
  const showing=ta.style.display!=='none';
  ta.style.display=showing?'none':'block';
  row.style.display=showing?'none':'flex';
}
function submitPastedText(){
  const txt=document.getElementById('syl-paste-area').value.trim();
  if(txt.length<20){alert('Paste a bit more text — at least a few lines of the syllabus.');return;}
  SYL.rawText=txt;
  document.getElementById('syl-prog-filename').textContent='Pasted text';
  document.getElementById('syl-prog-filesize').textContent=txt.length+' characters';
  sylRenderStepper(2);sylShowStep('syl-step-progress');
  document.getElementById('syl-upload-fill').style.width='100%';
  document.getElementById('syl-upload-pct').textContent='100%';
  document.getElementById('syl-upload-bytes').textContent=txt.length+' / '+txt.length+' chars';
  const pill=document.getElementById('syl-prog-pill');pill.className='syl-pill ok';pill.textContent='READY';
  setTimeout(sylBeginScan,500);
}

const SYL_ALLOWED=['pdf','txt'];
const SYL_MAX_BYTES=15*1024*1024;
let sylUploadCancelled=false;
function fmtBytesSyl(b){if(b<1024)return b+' B';if(b<1024*1024)return (b/1024).toFixed(0)+' KB';return (b/1024/1024).toFixed(1)+' MB';}

function handleSylFile(file){
  const ext=(file.name.split('.').pop()||'').toLowerCase();
  if(!SYL_ALLOWED.includes(ext)){
    sylShowError('File type not supported yet',
      `We can read text out of PDF and TXT files directly. For .${ext} files, use "PASTE TEXT INSTEAD" below and copy the syllabus text in.`);
    return;
  }
  if(file.size>SYL_MAX_BYTES){
    sylShowError('File is too large',`That file is ${fmtBytesSyl(file.size)}. Keep uploads under 15 MB, or paste the text instead.`);
    return;
  }
  sylBeginUpload(file,ext);
}
function sylShowError(title,body){
  document.getElementById('syl-err-title').textContent=title;
  document.getElementById('syl-err-body').textContent=body;
  sylShowStep('syl-step-error');
}

function sylBeginUpload(file,ext){
  sylUploadCancelled=false;
  document.getElementById('syl-prog-filename').textContent=file.name;
  document.getElementById('syl-prog-filesize').textContent=fmtBytesSyl(file.size);
  document.getElementById('syl-upload-fill').style.width='0%';
  document.getElementById('syl-upload-pct').textContent='0%';
  document.getElementById('syl-upload-bytes').textContent='0 / '+fmtBytesSyl(file.size);
  const pill=document.getElementById('syl-prog-pill');
  pill.className='syl-pill busy';pill.textContent='READING';
  sylRenderStepper(2);sylShowStep('syl-step-progress');

  const reader=new FileReader();
  reader.onprogress=(e)=>{
    if(!e.lengthComputable)return;
    const pct=Math.round((e.loaded/e.total)*100);
    document.getElementById('syl-upload-fill').style.width=pct+'%';
    document.getElementById('syl-upload-pct').textContent=pct+'%';
    document.getElementById('syl-upload-bytes').textContent=fmtBytesSyl(e.loaded)+' / '+fmtBytesSyl(e.total);
  };
  reader.onerror=()=>{
    if(sylUploadCancelled)return;
    pill.className='syl-pill err';pill.textContent='FAILED';
    setTimeout(()=>sylShowError('File could not be read','It may be open in another program, or corrupted. Try again.'),300);
  };

  if(ext==='txt'){
    reader.onload=(e)=>{
      if(sylUploadCancelled)return;
      document.getElementById('syl-upload-fill').style.width='100%';document.getElementById('syl-upload-pct').textContent='100%';
      pill.className='syl-pill ok';pill.textContent='DONE';
      SYL.rawText=e.target.result;
      setTimeout(()=>{if(!sylUploadCancelled)sylBeginScan();},400);
    };
    reader.readAsText(file);
  }else if(ext==='pdf'){
    reader.onload=async(e)=>{
      if(sylUploadCancelled)return;
      document.getElementById('syl-upload-fill').style.width='100%';document.getElementById('syl-upload-pct').textContent='100%';
      pill.className='syl-pill busy';pill.textContent='PARSING PDF';
      try{
        const text=await extractPdfText(e.target.result);
        if(sylUploadCancelled)return;
        if(!text||text.trim().length<10){
          sylShowError('No readable text found','This PDF may be a scanned image rather than real text. Try "PASTE TEXT INSTEAD" or a text-based PDF.');
          return;
        }
        SYL.rawText=text;
        pill.className='syl-pill ok';pill.textContent='DONE';
        setTimeout(sylBeginScan,400);
      }catch(err){
        console.error(err);
        sylShowError('Could not read this PDF',"This file couldn't be parsed. Try another PDF, or paste the text instead.");
      }
    };
    reader.readAsArrayBuffer(file);
  }
}
async function extractPdfText(arrayBuffer){
  if(!window.pdfjsLib)throw new Error('pdf.js not loaded');
  const pdf=await pdfjsLib.getDocument({data:arrayBuffer}).promise;
  let full='';
  for(let p=1;p<=pdf.numPages;p++){
    const page=await pdf.getPage(p);
    const content=await page.getTextContent();
    full+=content.items.map(it=>it.str).join(' ')+'\n';
  }
  return full;
}

/* ---- STEP 4: real heuristic scan of SYL.rawText ---- */
const SYL_SCAN_STAGES=[
  {label:'Splitting into lines…',caption:'Splitting into lines…'},
  {label:'Finding headings & numbered units…',caption:'Finding headings & numbered units…'},
  {label:'Ranking candidate topics…',caption:'Ranking candidate topics…'},
];
let sylScanCancelled=false,sylScanTimer=null;
async function sylBeginScan(){
  sylScanCancelled=false;
  const stepsEl=document.getElementById('syl-scan-steps');
  stepsEl.innerHTML=SYL_SCAN_STAGES.map((s,i)=>`<div class="syl-scan-step" id="syl-sstep-${i}"><span class="syl-mk"></span>${s.label}</div>`).join('');
  sylRenderStepper(3);sylShowStep('syl-step-scan');

  // These captions cycle to show real progress *stages* while we wait on
  // the actual Groq request below — they are not a fixed-duration fake bar.
  let stageIdx=0;
  document.getElementById('syl-sstep-0').classList.add('active');
  document.getElementById('syl-scan-caption').textContent=SYL_SCAN_STAGES[0].caption;
  const cycle=setInterval(()=>{
    if(sylScanCancelled){clearInterval(cycle);return;}
    if(stageIdx<SYL_SCAN_STAGES.length-1){
      const prevEl=document.getElementById('syl-sstep-'+stageIdx);
      prevEl.classList.remove('active');prevEl.classList.add('done');prevEl.querySelector('.syl-mk').textContent='✓';
      stageIdx++;
      const curEl=document.getElementById('syl-sstep-'+stageIdx);
      curEl.classList.add('active');
      document.getElementById('syl-scan-caption').textContent=SYL_SCAN_STAGES[stageIdx].caption;
    }
  },1100);

  sylAbortController=new AbortController();
  try{
    const res=await fetch(SYL_API_URL,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({action:'scan',text:SYL.rawText,subject:SYL.subject.name}),
      signal:sylAbortController.signal,
    });
    clearInterval(cycle);
    if(sylScanCancelled)return;
    const data=await res.json();
    if(!res.ok||!data.ok){
      sylErrorRetryFn=()=>sylBeginScan();
      sylShowError('AI scan failed',data.error||'The server could not scan this document. Try again.');
      return;
    }
    for(let i=0;i<SYL_SCAN_STAGES.length;i++){
      const el=document.getElementById('syl-sstep-'+i);
      el.classList.remove('active');el.classList.add('done');el.querySelector('.syl-mk').textContent='✓';
    }
    SYL.topics=data.topics.map(t=>({name:t.name,count:t.count,summary:t.summary,on:true}));
    sylRenderTopics();
    setTimeout(()=>{sylRenderStepper(4);sylShowStep('syl-step-topics');},300);
  }catch(err){
    clearInterval(cycle);
    if(sylScanCancelled)return;
    sylErrorRetryFn=()=>sylBeginScan();
    sylShowError('AI scan failed',err.name==='AbortError'?'Scan was cancelled.':'Could not reach the server. Check your connection and try again.');
  }
}
/* ═══════════════════════════════════════════════════════
   ⚠ DEPRECATED / UNUSED — legacy local heuristic scanner.
   The live syllabus flow calls sylBeginScan() → SYL_API_URL
   instead of this. sylRunScanStage/sylFinishScan/
   sylExtractTopics/SYL_TEMPLATES below are NOT called
   anywhere in the current flow. Kept for reference only.
   Do not wire back in without removing the API calls above.
   ═══════════════════════════════════════════════════════ */
function sylRunScanStage(i){
  if(sylScanCancelled)return;
  if(i>0){
    const prev=document.getElementById('syl-sstep-'+(i-1));
    prev.classList.remove('active');prev.classList.add('done');prev.querySelector('.syl-mk').textContent='✓';
  }
  if(i>=SYL_SCAN_STAGES.length){ sylFinishScan(); return; }
  const cur=document.getElementById('syl-sstep-'+i);
  cur.classList.add('active');
  document.getElementById('syl-scan-caption').textContent=SYL_SCAN_STAGES[i].caption;
  sylScanTimer=setTimeout(()=>sylRunScanStage(i+1),650);
}

// Real, deterministic topic extraction from the actual uploaded/pasted text —
// a heading/keyword heuristic that runs entirely in the browser, not a hosted AI model.
// (If you add a backend later, this is where you'd instead POST SYL.rawText to your
// server, which calls the Claude API and returns a topic list, e.g.:
//   const topics = await fetch('/api/scan-syllabus',{method:'POST',body:JSON.stringify({text:SYL.rawText})}).then(r=>r.json());
// and use that instead of sylExtractTopics() below.)
const SYL_STOPWORDS=new Set(['the','and','for','with','this','that','from','into','your','their','have','will','are','was','were','has','not','all','you','can','also','unit','chapter','topic','section','week','part','lesson','module','course','syllabus','page','introduction']);
function sylExtractTopics(text){
  const lines=text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  const headingRe=/^(unit|chapter|module|topic|section|week|lesson)\s*\d*[:\-.]?\s*(.+)$/i;
  const numberedRe=/^\d+(\.\d+)?[.)]\s*(.+)$/;
  const candidates=[];
  lines.forEach(line=>{
    let m=line.match(headingRe);
    if(m&&m[2]&&m[2].length<80){candidates.push(m[2].trim());return;}
    m=line.match(numberedRe);
    if(m&&m[2]&&m[2].length<80){candidates.push(m[2].trim());return;}
    if(line.length>3&&line.length<60&&!/[.?!]$/.test(line)&&/^[A-Z]/.test(line)){
      const words=line.split(/\s+/);
      const capRatio=words.filter(w=>/^[A-Z]/.test(w)).length/words.length;
      if(capRatio>0.5)candidates.push(line);
    }
  });
  const seen=new Set(),cleaned=[];
  candidates.forEach(c=>{
    const clean=c.replace(/[:\-–—]+$/,'').trim();
    const key=clean.toLowerCase();
    if(clean.length>2&&!seen.has(key)){seen.add(key);cleaned.push(clean);}
  });
  if(cleaned.length>=3)return cleaned.slice(0,14);

  const words=text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w.length>3&&!SYL_STOPWORDS.has(w));
  const freq={};
  words.forEach(w=>freq[w]=(freq[w]||0)+1);
  const ranked=Object.keys(freq).sort((a,b)=>freq[b]-freq[a]).slice(0,10);
  return ranked.map(w=>w.charAt(0).toUpperCase()+w.slice(1));
}
function sylFinishScan(){
  if(sylScanCancelled)return;
  const found=sylExtractTopics(SYL.rawText);
  SYL.topics=found.map(name=>({
    name,
    count:(SYL.rawText.match(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'))||[]).length||1,
    on:true
  }));
  sylRenderTopics();
  sylRenderStepper(4);sylShowStep('syl-step-topics');
}

/* ---- STEP 5: review topics ---- */
function sylRenderTopics(){
  const list=document.getElementById('syl-topic-list');
  if(!SYL.topics.length){
    list.innerHTML='<div class="syl-topics-empty">No clear topics found. Add them manually below.</div>';
  }else{
    list.innerHTML=SYL.topics.map((t,i)=>`
      <div class="syl-topic-row ${t.on?'on':'off'}" data-i="${i}">
        <div class="syl-chk">${t.on?'✓':''}</div>
        <div class="u-flex1">
          <div class="syl-topic-name">${t.name}</div>
          <div class="syl-topic-count">mentioned ${t.count}×</div>
        </div>
        <span class="syl-topic-del" data-del="${i}">✕</span>
      </div>`).join('');
    list.querySelectorAll('.syl-topic-row').forEach(row=>{
      row.addEventListener('click',(e)=>{
        if(e.target.classList.contains('syl-topic-del'))return;
        const i=+row.dataset.i;SYL.topics[i].on=!SYL.topics[i].on;sylRenderTopics();
      });
    });
    list.querySelectorAll('.syl-topic-del').forEach(x=>{
      x.addEventListener('click',(e)=>{e.stopPropagation();SYL.topics.splice(+x.dataset.del,1);sylRenderTopics();});
    });
  }
  const selected=SYL.topics.filter(t=>t.on).length;
  document.getElementById('syl-topics-selected').textContent=selected;
  document.getElementById('syl-topics-total').textContent=SYL.topics.length;
  document.getElementById('syl-topics-continue').disabled=selected===0;
}
function addManualTopic(){
  const input=document.getElementById('syl-new-topic');
  const val=input.value.trim();
  if(!val)return;
  SYL.topics.push({name:val,count:0,on:true});
  input.value='';
  sylRenderTopics();
}

/* ---- STEP 6a: generate real templated questions per selected topic ---- */
const SYL_TEMPLATES=[
  t=>`Explain "${t}" in your own words, as if teaching it to a classmate.`,
  t=>`List the 3 most important facts you need to know about "${t}".`,
  t=>`How does "${t}" connect to the other topics in this syllabus?`,
  t=>`Write one exam-style question you'd expect about "${t}", and answer it.`,
];
let sylGenCancelled=false,sylGenInterval=null;
async function sylBeginGenerate(){
  if(!sylCanGenerate()){
    sylShowLimitReached();
    return;
  }
  sylConsumeGeneration();
  sylGenCancelled=false;
  const selectedTopics=SYL.topics.filter(t=>t.on);
  const fill=document.getElementById('syl-gen-fill'),pctEl=document.getElementById('syl-gen-pct'),statusEl=document.getElementById('syl-gen-status');
  fill.style.width='0%';pctEl.textContent='0%';
  sylRenderStepper(5);sylShowStep('syl-step-generating');
  SYL.genQuestions=[];
  const questionsPerTopic=4;

  for(let i=0;i<selectedTopics.length;i++){
    if(sylGenCancelled)return;
    const topic=selectedTopics[i].name;
    statusEl.textContent='Writing questions for "'+topic+'"…';
    sylAbortController=new AbortController();
    try{
      const res=await fetch(SYL_API_URL,{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action:'generate',topic,subject:SYL.subject.name,count:questionsPerTopic}),
        signal:sylAbortController.signal,
      });
      const data=await res.json();
      if(sylGenCancelled)return;
      if(!res.ok||!data.ok){
        sylErrorRetryFn=()=>sylBeginGenerate();
        sylShowError('Question generation failed',data.error||`Could not generate questions for "${topic}". Try again.`);
        return;
      }
      data.questions.forEach(q=>SYL.genQuestions.push({
        topic, prompt:q.question, answer:q.answer, choices:q.choices
      }));
    }catch(err){
      if(sylGenCancelled)return;
      sylErrorRetryFn=()=>sylBeginGenerate();
      sylShowError('Question generation failed',err.name==='AbortError'?'Generation was cancelled.':'Could not reach the server. Check your connection and try again.');
      return;
    }
    const pct=Math.round(((i+1)/selectedTopics.length)*100);
    fill.style.width=pct+'%';pctEl.textContent=pct+'%';

    // NEW: pace requests so we don't blow the free-tier TPM window
    if(i<selectedTopics.length-1 && !sylGenCancelled){
      await new Promise(r=>setTimeout(r,1500));
    }
  }
  statusEl.textContent='Done';
  setTimeout(sylShowPracticeReady,300);
}
function sylShowPracticeReady(){
  const selectedTopics=SYL.topics.filter(t=>t.on);
  document.getElementById('syl-practice-count').textContent=SYL.genQuestions.length;
  document.getElementById('syl-practice-tags').innerHTML=selectedTopics.map(t=>`<span class="syl-qtag">${t.name} · ${SYL_TEMPLATES.length}</span>`).join('');
  SYL.practiceIdx=0;
  sylRenderStepper(6);sylShowStep('syl-step-practice');
}

function startSyllabusPractice(){
  if(!SYL.genQuestions || !SYL.genQuestions.length) return;
  bumpStat('syllabus');
  if(hasPracticeSave()){
    if(!confirm('You already have a Practice Mode run in progress. Starting a new one will erase it. Continue?')) return;
    clearPracticeSave();
  }
  showDiff('syllabus', SYL.genQuestions.slice());
}


refreshTitle();

/* ══════════════════════════════════════════════════════════════
   ARENA FX ENGINE — append to the VERY END of dino.js
   Wraps the real battle functions. No buttons, no DOM watching.
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

const AR = window.ARENA = {};
const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const $ = id => document.getElementById(id);

let area=null, fxc=null, ctx=null, flash=null, ghostP=null, ghostB=null, dpr=1;

/* ---------- layer injection ---------- */
function mkGhost(fillId){
  const fill=$(fillId); if(!fill) return null;
  const bar=fill.parentElement;                 // .hp-bar (overflow:hidden)
  if(!bar) return null;
  const g=document.createElement('div');
  g.className='hp-ghost';
  bar.insertBefore(g, fill);                    // BEHIND the fill, INSIDE the bar
  return g;
}
function injectLayers(){
  if(area) return;
  area=$('battle-area'); if(!area) return;
  fxc=document.createElement('canvas'); fxc.id='fx-canvas';
  area.appendChild(fxc); ctx=fxc.getContext('2d');
  flash=document.createElement('div'); flash.id='hit-flash';
  area.appendChild(flash);
  ghostP=mkGhost('p-hp'); ghostB=mkGhost('b-hp');
  resize();
}
function resize(){
  if(!fxc||!area) return;
  const w=area.clientWidth||1, h=area.clientHeight||1;
  dpr=Math.min(window.devicePixelRatio||1,2);
  fxc.width=Math.round(w*dpr); fxc.height=Math.round(h*dpr);
  fxc.style.width=w+'px'; fxc.style.height=h+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
AR.resize=resize;
window.addEventListener('resize',()=>{clearTimeout(resize._t);resize._t=setTimeout(resize,120);});

/* ---------- geometry: real sprite boxes ---------- */
function box(side){
  const a=area?area.getBoundingClientRect():{width:400,height:260};
  const s=$(side==='b'?'boss-spr':'player-spr');
  const r=s?s.getBoundingClientRect():null;
  if(!r||!r.width) return {cx:a.width*(side==='b'?.74:.26),cy:a.height*.55,top:a.height*.34,w:60,h:64};
  return {cx:r.left-a.left+r.width/2, cy:r.top-a.top+r.height/2,
          top:r.top-a.top, w:r.width, h:r.height};
}
AR.box=box;

/* ---------- particle engine ---------- */
const P=[]; let raf=0, last=0;
function start(){ if(!raf&&ctx) raf=requestAnimationFrame(loop); }
function loop(t){
  if(!last) last=t;
  const dt=Math.min((t-last)/1000,.05); last=t;
  ctx.clearRect(0,0,fxc.width,fxc.height);
  for(let i=P.length-1;i>=0;i--){
    const p=P[i]; p.t+=dt;
    if(p.t>=p.life){P.splice(i,1);continue;}
    drawP(p,dt);
  }
  if(P.length) raf=requestAnimationFrame(loop);
  else{ raf=0; last=0; ctx.clearRect(0,0,fxc.width,fxc.height); }
}
function drawP(p,dt){
  const k=Math.max(0,1-p.t/p.life);
  ctx.globalAlpha=k;
  if(p.k==='spark'){
    p.vy+=520*dt; p.x+=p.vx*dt; p.y+=p.vy*dt;
    ctx.fillStyle=p.c; ctx.fillRect(p.x-p.s/2,p.y-p.s/2,p.s,p.s);
    ctx.globalAlpha=k*.35;
    ctx.fillRect(p.x-p.vx*dt*2-p.s/2,p.y-p.vy*dt*2-p.s/2,p.s,p.s);
  }else if(p.k==='ring'){
    const r=p.r0+(p.r1-p.r0)*(1-k*k);
    ctx.strokeStyle=p.c; ctx.lineWidth=p.w*k+.6;
    ctx.beginPath(); ctx.arc(p.x,p.y,r,0,6.2832); ctx.stroke();
  }else if(p.k==='slash'){
    const sw=(1-k)*.7*p.dir;
    ctx.strokeStyle=p.c; ctx.lineWidth=p.w*k+1; ctx.lineCap='round';
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,p.a0+sw,p.a1+sw); ctx.stroke();
  }else if(p.k==='orb'){
    p.y-=p.vy*dt; p.x+=Math.sin(p.t*7+p.ph)*24*dt;
    ctx.fillStyle=p.c; ctx.fillRect(p.x-1.5,p.y-1.5,3,3);
  }
  ctx.globalAlpha=1;
}
AR.sparks=function(x,y,n,c,spread,soft){
  if(RM||!ctx) return; spread=spread||1;
  for(let i=0;i<n;i++){
    const a=Math.random()*6.2832, v=(soft?40:90)+Math.random()*(soft?60:190)*spread;
    P.push({k:'spark',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-(soft?20:70),
            s:Math.random()<.3?3:2,c,t:0,life:.28+Math.random()*.34});
  }
  start();
};
AR.ring=function(x,y,r1,c,w){
  if(RM||!ctx) return;
  P.push({k:'ring',x,y,r0:3,r1,c,w:w||3,t:0,life:.34}); start();
};
AR.slash=function(x,y,r,c,dir){
  if(RM||!ctx) return; dir=dir||1;
  const a0=dir>0?-1.15:2.0, a1=dir>0?1.15:4.3;
  P.push({k:'slash',x,y,r,c,w:4,a0,a1,dir,t:0,life:.26}); start();
};
AR.orbs=function(x,y,n,c){
  if(RM||!ctx) return;
  for(let i=0;i<n;i++)
    P.push({k:'orb',x:x+(Math.random()*40-20),y:y+(Math.random()*20-10),
            vy:30+Math.random()*60,ph:Math.random()*6.28,c,t:0,life:.7+Math.random()*.4});
  start();
};

/* ---------- screen effects ---------- */
AR.shake=function(lvl){
  if(RM||!area) return; lvl=lvl||'s';
  area.classList.remove('shk-s','shk-m','shk-l'); void area.offsetWidth;
  area.classList.add('shk-'+lvl);
  clearTimeout(AR.shake._t);
  AR.shake._t=setTimeout(()=>area.classList.remove('shk-'+lvl),480);
};
AR.flash=function(c,a){
  if(RM||!flash) return;
  flash.style.transition='none';
  flash.style.background=c||'#fff';
  flash.style.opacity=String(a==null?.35:a);
  requestAnimationFrame(()=>{flash.style.transition='opacity .22s ease';flash.style.opacity='0';});
};
AR.banner=function(text,isBoss){
  if(!area) return;
  const b=document.createElement('div');
  b.className='arena-banner'+(isBoss?' boss':'');
  b.textContent=(isBoss?'⚠ ':'')+text;
  area.appendChild(b);
  setTimeout(()=>b.remove(),1750);
};
/* ── PASSIVE TELEGRAPHS ────────────────────────────────────────────────
   SPX calls this the instant before an enemy special resolves, so every
   one of the 51 stages announces itself instead of a number quietly
   changing. The message still arrives through the normal queue, which is
   what keeps the wording readable when motion is switched off.        */
if(window.SPX){
  SPX.onTelegraph=function(spec,g){
    const stg=(typeof STAGES!=='undefined'&&STAGES[G&&G.curStage])||null;
    const name=spec.tele||(stg&&stg.passive&&stg.passive.label)||'ENEMY ABILITY';
    if(RM||!area) return;                 // reduced motion: SPX still speaks msg
    AR.banner(name,true);
    AR.flash(spec.col||'#e0555f',0.22);
    AR.shake('m');
    const b=box('b');
    AR.ring(b.cx,b.cy,30,'#ffd166',3);
  };
}
AR.impact=function(side,pw){
  pw=pw||1;
  const b=box(side);
  AR.sparks(b.cx,b.cy,10+Math.round(9*pw),pw>1?'#ffe6a0':'#fff3cc',1);
  AR.ring(b.cx,b.cy,24+16*pw,pw>1?'#ffd166':'#ffffff',3);
  AR.shake(pw>1.6?'l':pw>1?'m':'s');
  AR.flash(pw>1?'#ffd9a0':'#ffffff',pw>1?.4:.2);
};

/* ══════════ HOOKS INTO THE REAL GAME FUNCTIONS ══════════ */
let power=1, winning=false, ending=false;

/* 1. damage numbers — anchored to the sprite that was actually hit */
const _float=window.spawnFloat;
let floatCountP=0, floatCountB=0;   // NEW: tracks how many floats are stacked per side right now
window.spawnFloat=function(txt,color,isBoss,fxKey){
  if(!area){ return _float(txt,color,isBoss,fxKey); }
  const s=String(txt);
  /* Same-key floats replace each other (REGEN → REGEN ×2 → ×3), and the
     outgoing one hands its stack slot back so the column stays tidy. */
  if(fxKey)area.querySelectorAll('.fdmg[data-fx="'+fxKey+'"]').forEach(o=>{
    if(o.dataset.boss==='1')floatCountB=Math.max(0,floatCountB-1);
    else floatCountP=Math.max(0,floatCountP-1);
    clearTimeout(+o.dataset.t||0); o.remove();
  });
  if(/CRIT/i.test(s)) power=2;
  else if(/TRUE/i.test(s)) power=1.5;
  else power=1;

  if(/^-\d/.test(s)&&!RM){
    /* Also weigh the number itself. Reading only the words CRIT/TRUE meant a
       1% chip and a 15% haymaker shook the screen by exactly the same amount.
       Clamped, so a million-HP world-10 boss doesn't flatten everything to 1. */
    const n=parseInt(s.slice(1),10);
    const max=isBoss?(G&&G.bossMaxHP):(G&&G.playerMaxHP);
    if(n>0&&max>0){
      const frac=Math.min(1,n/max);
      power=Math.min(2.6,power*(1+Math.min(1.2,frac*8)));
    }
    AR.impact(isBoss?'b':'p',power);
    /* the swipe that was written and never called */
    if(AR.slash){
      const b2=box(isBoss?'b':'p');
      let col='#fff3cc';
      try{ const st=STAGES[G.curStage]; col=(ELEM_FX[st.elem]&&ELEM_FX[st.elem].color)||col; }catch(e){}
      if(/^var\(/.test(col)) col='#fff3cc';
      AR.slash(b2.cx,b2.cy,26+10*power,col,isBoss?1:-1);
    }
  }

  const el=document.createElement('div');
  el.className='fdmg'+(/CRIT|STREAK|GUARDIAN|NUKE|HALF/i.test(s)?' big':'');
  el.textContent=s;
  el.style.color=color||'#fff';
  if(fxKey)el.dataset.fx=fxKey;
  el.dataset.boss=isBoss?'1':'0';
  const b=box(isBoss?'b':'p');
  const stackIdx = isBoss ? floatCountB++ : floatCountP++;   // NEW: this float's stack slot
  el.style.left=Math.round(b.cx+(Math.random()*20-10))+'px';
  el.style.top=Math.round(Math.max(2,b.top-8-stackIdx*16))+'px';  // NEW: offset upward per slot
  area.appendChild(el);
  el.dataset.t=String(setTimeout(()=>{
    el.remove();
    if(isBoss) floatCountB=Math.max(0,floatCountB-1); else floatCountP=Math.max(0,floatCountP-1); // NEW: free the slot
  },1250));
};

/* 3. HP bars — lagging white trail + low-HP pulse */
function setGhost(g,pct){
  if(!g) return;
  const cur=parseFloat(g.style.width);
  if(!isFinite(cur)||pct>cur){
    g.style.transition='none'; g.style.width=pct+'%';
    requestAnimationFrame(()=>{ g.style.transition=''; });
  }else g.style.width=pct+'%';
}
const _bars=window.updateBars;
window.updateBars=function(){
  _bars();
  try{
    if(!window.G||!G.playerMaxHP||!G.bossMaxHP) return;
    const pp=Math.max(0,Math.min(100,G.playerHP/G.playerMaxHP*100));
    const bp=Math.max(0,Math.min(100,G.bossHP/G.bossMaxHP*100));
    setGhost(ghostP,pp); setGhost(ghostB,bp);
    const pf=$('p-hp'), bf=$('b-hp');
    if(pf&&pf.parentElement) pf.parentElement.classList.toggle('low',pp>0&&pp<25);
    if(bf&&bf.parentElement) bf.parentElement.classList.toggle('low',bp>0&&bp<25);
  }catch(e){}
};

/* 4. status visuals */
const _heal=window.doHealAura;
window.doHealAura=function(amt){
  const b=box('p'); AR.orbs(b.cx,b.cy+b.h*.35,14,'#4ecb71'); AR.ring(b.cx,b.cy,34,'#4ecb71',2);
  return _heal(amt);
};
const _shield=window.showShieldGlow;
window.showShieldGlow=function(){
  const b=box('p'); AR.ring(b.cx,b.cy,40,'#2dd4c8',3); return _shield();
};
window.showFreezeOverlay=function(){
  const el=document.getElementById('boss-spr');
  const ov=document.createElement('div');ov.className='freeze-overlay';
  ov.innerHTML=luc('snowflake',26);
  el.appendChild(ov);refreshIcons();
  const b=box('b'); AR.ring(b.cx,b.cy,42,'#4a9eff',3); AR.sparks(b.cx,b.cy,12,'#a8d8ff',.8);
  setTimeout(()=>ov.remove(),1400);
};
window.showParalyzeOverlay=function(){
  const el=document.getElementById('boss-spr');
  const ov=document.createElement('div');ov.className='paralyze-overlay';
  ov.innerHTML=luc('zap',22);
  el.appendChild(ov);refreshIcons();
  const b=box('b'); AR.sparks(b.cx,b.cy,16,'#00e5ff',1.2);
  setTimeout(()=>ov.remove(),1400);
};

/* 5. powerups — themed burst, only when the item is actually consumed */
const PU_FX={
  heal:['p','#4ecb71','orbs'],   regen:['p','#4ecb71','orbs'],  divine:['p','#f5c842','burst'],
  shield:['p','#2dd4c8','ring'], barrier:['p','#4a9eff','ring'],mirror:['p','#2dd4c8','ring'],
  double:['p','#f5c842','ring'], overload:['p','#f5c842','ring'],rage:['p','#e84545','burst'],
  fiftyf:['p','#ff7a30','ring'], oracle:['p','#b06aff','ring'], insight:['p','#4a9eff','ring'],
  gamble:['p','#ff6eb4','burst'],
  freeze:['b','#4a9eff','burst'],paralyze:['b','#00e5ff','burst'],stun:['b','#f5c842','burst'],
  poison:['b','#b06aff','burst'],burn:['b','#ff7a30','burst'],  leech:['b','#b06aff','burst'],
  halfhp:['b','#e84545','nuke'], nuke:['b','#e84545','nuke'],
  /* the six unlocked past the margin had no entry at all, so they fired
     with no visual whatsoever (dino-world2.js W2.NEW_PU) */
  anchor:['p','#3dbfb0','ring'], echo:['p','#3fc6e0','ring'],
  loophole:['p','#e8c458','ring'],desalt:['b','#5b8fe0','burst'],
  restore:['p','#4fbf7a','orbs'],thepen:['p','#eaeaf0','ring'],
};
/* A short timeline per item, played over the primitives above. Only the six
   world-6+ items had NO entry at all before, so they fired silently. */
const PU_SEQ={
  heal:    [[0,'ring',30],[90,'orbs',14],[190,'ring',44]],
  regen:   [[0,'orbs',10],[220,'orbs',10],[440,'orbs',10]],
  divine:  [[0,'flash',.3],[60,'ring',30],[170,'ring',52],[280,'ring',74],[120,'orbs',20]],
  shield:  [[0,'ring',26],[110,'ring',44]],
  barrier: [[0,'ring',24],[90,'ring',42],[180,'ring',60]],
  mirror:  [[0,'ring',38],[110,'ringB',38]],
  double:  [[0,'ring',34],[120,'sparks',14],[120,'shake','s']],
  overload:[[0,'flash',.22],[0,'ring',34],[110,'ring',54],[200,'shake','m']],
  rage:    [[0,'orbs',18],[80,'sparks',16],[80,'shake','s'],[140,'lunge',0]],
  fiftyf:  [[0,'slash',30],[140,'ring',36]],
  oracle:  [[0,'ring',34],[150,'orbs',10]],
  insight: [[0,'ring',34],[150,'orbs',10]],
  gamble:  [[0,'ring',30],[110,'ring',44],[220,'sparks',18]],
  freeze:  [[0,'ringB',40],[110,'orbsDown',14],[230,'shake','s']],
  paralyze:[[0,'sparksB',18],[120,'sparksB',12],[120,'shake','s']],
  stun:    [[0,'ringB',34],[110,'sparksB',14],[110,'shake','m']],
  poison:  [[0,'ringB',34],[130,'orbsDown',12]],
  burn:    [[0,'ringB',32],[120,'sparksB',16]],
  leech:   [[0,'beam',0],[260,'orbs',12]],
  halfhp:  [[0,'slashB',40],[130,'ringB',64],[130,'shake','l'],[200,'flash',.3]],
  nuke:    [[0,'flash',.55],[0,'shake','l'],[90,'ringB',60],[210,'ringB',96],[330,'shake','m']],
  /* past the margin */
  anchor:  [[0,'ring',36],[160,'ring',36]],
  echo:    [[0,'ring',30],[130,'ring',46],[260,'ring',30]],
  loophole:[[0,'slash',34],[150,'sparks',10]],
  desalt:  [[0,'sparksB',14],[140,'ringB',38]],
  restore: [[0,'orbs',18],[130,'ring',40],[260,'orbs',12]],
  thepen:  [[0,'flash',.25],[80,'ring',44],[200,'ringB',44]]
};
function puFX(t){
  const d=PU_FX[t]||['p','#ffffff','ring']; if(!area) return;
  const c=d[1];
  const P=()=>box('p'), B=()=>box('b');
  const seq=PU_SEQ[t];
  if(!seq){    /* unchanged fallback for anything without a timeline */
    const b=box(d[0]), m=d[2];
    if(m==='orbs'){ AR.orbs(b.cx,b.cy+b.h*.3,16,c); AR.ring(b.cx,b.cy,36,c,2); }
    else if(m==='ring'){ AR.ring(b.cx,b.cy,40,c,3); AR.sparks(b.cx,b.cy,8,c,.9); }
    else if(m==='nuke'){ AR.ring(b.cx,b.cy,72,c,5); AR.sparks(b.cx,b.cy,26,c,1.7);
                         AR.shake('l'); AR.flash(c,.45); }
    else { AR.ring(b.cx,b.cy,44,c,3); AR.sparks(b.cx,b.cy,16,c,1.2); AR.shake('s'); }
    return;
  }
  seq.forEach(([at,op,v])=>setTimeout(()=>{
    try{
      const p=P(), b=B();
      switch(op){
        case 'ring':     AR.ring(p.cx,p.cy,v,c,3); break;
        case 'ringB':    AR.ring(b.cx,b.cy,v,c,3); break;
        case 'sparks':   AR.sparks(p.cx,p.cy,v,c,1.1); break;
        case 'sparksB':  AR.sparks(b.cx,b.cy,v,c,1.1); break;
        case 'orbs':     AR.orbs(p.cx,p.cy+p.h*.3,v,c); break;
        /* falls instead of rises — freeze/poison read as settling on the enemy */
        case 'orbsDown': AR.orbs(b.cx,b.cy-b.h*.3,v,c); break;
        case 'slash':    if(AR.slash)AR.slash(p.cx,p.cy,v,c,-1); break;
        case 'slashB':   if(AR.slash)AR.slash(b.cx,b.cy,v,c,1); break;
        case 'shake':    AR.shake(v); break;
        case 'flash':    AR.flash(c,v); break;
        /* travels boss → player, so draining reads directionally */
        case 'beam':     AR.sparks(b.cx,b.cy,10,c,1);
                         setTimeout(()=>AR.sparks((b.cx+p.cx)/2,(b.cy+p.cy)/2,8,c,1),90);
                         setTimeout(()=>AR.sparks(p.cx,p.cy,10,c,1),180); break;
        case 'lunge':    if(typeof doAnim==='function')doAnim('player-f','aR',()=>{}); break;
      }
    }catch(e){}
  },at));
}
const _pu=window.usePowerup;
window.usePowerup=function(t){
  const before=(window.G&&G.inv)?(G.inv[t]||0):0;
  const r=_pu(t);
  const after=(window.G&&G.inv)?(G.inv[t]||0):0;
  if(after<before) puFX(t);
  return r;
};

/* 6. scene — walk-in finish: banner + boss entry burst */
const _walk=window.playWalkInBattle;
window.playWalkInBattle=function(si,li,onDone){
  return _walk(si,li,function(){
    try{
      const stg=STAGES[si], lv=stg.levels[li];
      const isBoss=!!(lv.boss||lv.mini||stg.isBoss);
      resize();
      AR.banner(lv.sub,isBoss);
      const b=box('b');
      if(isBoss){
        AR.ring(b.cx,b.cy,84,'#e84545',4);
        AR.sparks(b.cx,b.cy,22,'#ff9a5a',1.5);
        AR.shake('m'); AR.flash('#e84545',.35);
      }else{
        AR.ring(b.cx,b.cy,44,'#ffffff',2);
      }
    }catch(e){}
    if(onDone) onDone();
  });
};

/* 7. scene — level load / resume: mood lighting + resize + reset */
['loadLevel','resumeBattle'].forEach(function(fn){
  const orig=window[fn]; if(typeof orig!=='function') return;
  window[fn]=function(){
    injectLayers();
    const out=orig.apply(this,arguments);
    requestAnimationFrame(function(){
      resize();
      winning=false; ending=false; power=1;
      const bs=$('boss-spr'), ps=$('player-spr');
      if(bs) bs.classList.remove('dying');
      if(ps) ps.classList.remove('defeated');
      if(ghostP) ghostP.style.width='';
      if(ghostB) ghostB.style.width='';
      try{
        const stg=STAGES[G.curStage], lv=stg.levels[G.curLevel];
        area.classList.toggle('boss-mood',!!(lv.boss||lv.mini||stg.isBoss));
      }catch(e){}
      if(window.updateBars) updateBars();
    });
    return out;
  };
});

/* 8. enemy death — plays BEFORE the reward screen */
const _win=window.handleLevelWin;
window.handleLevelWin=function(){
  if(winning) return;
  winning=true;
  try{ clearInterval(G.timerInterval); }catch(e){}
  document.querySelectorAll('#choices-grid .choice').forEach(b=>b.disabled=true);
  const spr=$('boss-spr');
  if(area&&!RM){
    const b=box('b');
    AR.ring(b.cx,b.cy,64,'#ffffff',4);
    AR.sparks(b.cx,b.cy,30,'#ffd166',1.7);
    AR.shake('l'); AR.flash('#ffffff',.5);
  }
  if(spr) spr.classList.add('dying');
  setTimeout(function(){
    if(spr) spr.classList.remove('dying');
    winning=false;
    _win();
  }, RM?0:720);
};

/* 9. player death */
const _end=window.endGame;
/* the tag ('AUTHORED' / 'UNWRITTEN') must ride through: dropping it made the
   WORLD END conclusions render as the World 5 "GAME COMPLETE" screen */
window.endGame=function(win,tag){
  if(ending) return;
  ending=true;
  const spr=$('player-spr');
  if(!win&&spr&&area&&!RM){
    const b=box('p');
    AR.sparks(b.cx,b.cy,24,'#e84545',1.5);
    AR.shake('l'); AR.flash('#e84545',.5);
    spr.classList.add('defeated');
    setTimeout(function(){ spr.classList.remove('defeated'); _end(win,tag); },700);
    return;
  }
  _end(win,tag);
};

/* ── BOSS ATTRIBUTES: auto-refresh the loadout bar on every screen paint ── */
(function(){
  ['buildMap','resumeBattle','continueGame'].forEach(function(fn){
    if(typeof window[fn]!=='function')return;
    const _orig=window[fn];
    window[fn]=function(){
      const r=_orig.apply(this,arguments);
      try{renderAttrBar();}catch(e){}
      return r;
    };
  });
})();

/* ═══════════════════════════════════════════════════════════
   ANNOUNCE QUEUE · EFFECT HYGIENE · MODE ISOLATION · PREVIEW
   ═══════════════════════════════════════════════════════════ */

/* ── 1 · serialized combat announcer ── */

const _MSGQ=[];let _msgqT=null;
function queueMsg(txt,color,hold){_MSGQ.push({txt,color,hold:hold||900});_pumpMsgQ();}
function _pumpMsgQ(){
  if(_msgqT||!_MSGQ.length)return;
  const m=_MSGQ.shift();
  if(typeof setMsg==='function')setMsg(m.txt,m.color);
  _msgqT=setTimeout(()=>{_msgqT=null;_pumpMsgQ();},m.hold);
}
function clearMsgQ(){_MSGQ.length=0;if(_msgqT){clearTimeout(_msgqT);_msgqT=null;}}

/* what the enemy's body does to you on contact — announced BEFORE the status */
window.ELEM_SOURCE={
  nature:{name:'LASHING VINES',icon:'🌿'},
  earth:{name:'PETRIFYING DUST',icon:'🪨'},
  water:{name:'CRUSHING TIDE',icon:'🌊'},
  fire:{name:'SCALDING SCALES',icon:'🔥'},
  ice:{name:'BITING FROST',icon:'❄'},
  poison:{name:'TOXIC HIDE',icon:'☠'},
  electric:{name:'STATIC CHARGE',icon:'⚡'},
  shadow:{name:'CLINGING SHADOWS',icon:'🌑'},
  void:{name:'WARPING VOID',icon:'👁'},
  chaos:{name:'CHAOTIC AURA',icon:'🌀'},
  time:{name:'TIME DISTORTION',icon:'⏳'},
  light:{name:'SEARING RADIANCE',icon:'💫'},
};

/* ── 2 · effect hygiene ── */
function announceEffectEnd(e){
  const cfg=(typeof EFFECT_LABELS!=='undefined')?EFFECT_LABELS[e.type]:null;
  if(!cfg)return;
  const boss=(typeof EFFECT_TARGET_BOSS!=='undefined')&&EFFECT_TARGET_BOSS.has(e.type);
  try{spawnFloat(`${cfg.name} ENDED`,'var(--dim)',boss);}catch(err){}
}
function purgeAllEffects(silent){
  if(!G||!Array.isArray(G.activeEffects))return;
  if(!silent)G.activeEffects.forEach(announceEffectEnd);
  G.activeEffects=[];
  G.eliminated=[];G.petrified=[];
  try{if(typeof renderEffects==='function'&&document.getElementById('effect-rows'))renderEffects();}catch(e){}
}
function scrubBattleState(g){
  if(!g)return g;
  g._endGauntlet=false;g.bossImmortal=false;g._puThisBattle=false;
  g.activeEffects=[];g.eliminated=[];g.petrified=[];
  /* pendingGuardians is NOT scrubbed. It is a queued REWARD (a boss-defeat
     pick, or a daily gift), not a battle effect — wiping it here is what was
     losing every guardian the moment saveGame() ran after the pick. */
  /* saveGame() runs this on a deep CLONE of G (dino.js:507), so refunding
     here is also what keeps a battle-only Max-HP loss out of dqb3_save. */
  if(window.SPX&&SPX.refundBattlePenalty)SPX.refundBattlePenalty(g);
  if(g.reactive&&typeof g.reactive==='object')g.reactive.firedThisBattle=[];
  g.bossSpecialFired=false;g.rageMult=1;g.bossAtkCounter=0;
  g._spFired={};g._spCd={};
  g.bossHP=0;g.bossMaxHP=0;
  g.inBattle=false;g.animLock=false;g.timerInterval=null;g.currentQ=null;g.timerVal=0;
  return g;
}
function leaveBattleState(){
  try{_battleSession++;}catch(e){}
  clearMsgQ();
  if(G){clearInterval(G.timerInterval);G.inBattle=false;G.timerModeLocked=false;
        G._endGauntlet=false;G.bossImmortal=false;
        /* hand back any battle-only Max HP on the LIVE state (quit, loss, win) */
        if(window.SPX&&SPX.refundBattlePenalty&&SPX.refundBattlePenalty(G)
           &&typeof capPlayerStats==='function')capPlayerStats();}
  purgeAllEffects(true);
}
/* every battle starts and ends surgically clean */
['loadLevel','handleLevelWin','endGame','showLobby'].forEach(fn=>{
  const o=window[fn];if(typeof o!=='function')return;
  window[fn]=function(){
    if(fn==='loadLevel'){clearMsgQ();purgeAllEffects(true);}
    const r=o.apply(this,arguments);
    if(fn!=='loadLevel')leaveBattleState();
    return r;
  };
});

/* ── 3 · training is unrankable ── */
function isTrainingRun(){return !!(G&&G.isPractice);}
function applyTrainingEndUI(){
  const training=isTrainingRun();
  const btn=document.querySelector('#s-end [onclick*="saveScore"]');
  const inp=document.getElementById('name-in');
  if(btn)btn.style.display=training?'none':'';
  if(inp)inp.style.display=training?'none':'';
  /* the label belongs to the input — hiding one and not the other left
     "ENTER YOUR NAME" heading an empty space above PLAY AGAIN */
  const lbl=document.querySelector('#s-end .name-label');
  if(lbl)lbl.style.display=training?'none':'';
  const host=document.getElementById('end-stats');
  const old=document.getElementById('end-training-note');
  if(old)old.remove();
  if(training&&host){
    const d=document.createElement('div');
    d.id='end-training-note';
    d.style.cssText='margin-top:10px;padding:9px 12px;border:2px solid var(--amber);border-radius:8px;'+
      'background:rgba(232,161,58,.12);color:var(--amber);font-family:var(--px);font-size:8px;'+
      'letter-spacing:1px;text-align:center;line-height:1.7';
    d.textContent='🏋 TRAINING RUN — NOT SAVED, NOT RANKED';
    host.appendChild(d);
  }
}

/* ── 4 · stage preview popup ── */
const SCENE_FNS=['mountScene','renderScene','buildScene','paintScene','mountStageScene'];


/* ── exports ── */
window.queueMsg=queueMsg;
window.clearMsgQ=clearMsgQ;
window.purgeAllEffects=purgeAllEffects;
window.scrubBattleState=scrubBattleState;
window.leaveBattleState=leaveBattleState;
window.announceEffectEnd=announceEffectEnd;
window.isTrainingRun=isTrainingRun;
window.applyTrainingEndUI=applyTrainingEndUI;


/* ══════════ ACHIEVEMENTS + ATTR DROPDOWN DISMISS ══════════ */
const STATS_KEY='dqb3_stats';
const _STAT_DEF={levels:0,stages:0,bosses:0,correct:0,wrong:0,
                 bestStreak:0,bestCombo:0,clutch:0,syllabus:0,
                 /* worlds 6-11 — see the hidden MARGIN group below */
                 marginLevels:0,guards:0};

function getStats(){
  try{return Object.assign({},_STAT_DEF,JSON.parse(localStorage.getItem(STATS_KEY))||{});}
  catch(e){return Object.assign({},_STAT_DEF);}
}
function setStats(s){try{localStorage.setItem(STATS_KEY,JSON.stringify(s));}catch(e){}}
function bumpStat(k,v){const s=getStats();s[k]=(s[k]||0)+(v||1);setStats(s);}
function maxStat(k,v){const s=getStats();if(v>(s[k]||0)){s[k]=v;setStats(s);}}

function _ownedAttrCount(){
  let n=0;
  const grab=k=>{try{const o=JSON.parse(localStorage.getItem(k));
    if(o&&Array.isArray(o.attrsOwned))n=Math.max(n,o.attrsOwned.length);}catch(e){}};
  grab(SAVE_KEY);grab(COMPLETED_KEY);
  if(typeof G!=='undefined'&&G&&Array.isArray(G.attrsOwned))n=Math.max(n,G.attrsOwned.length);
  return n;
}
function _bestScore(){const b=getBoard();return b.length?Math.max(...b.map(e=>e.score||0)):0;}

const ACHIEVEMENTS=[
 {g:'COMBAT',   ic:'swords',  n:'FIRST BLOOD',    d:'Win your first battle',                 f:s=>s.levels>=1},
 {g:'COMBAT',   ic:'flame', n:'ON A ROLL',      d:'Reach a streak of 10',                  f:s=>s.bestStreak>=10},
 {g:'COMBAT',   ic:'zap', n:'UNSTOPPABLE',    d:'Reach a streak of 25',                  f:s=>s.bestStreak>=25},
 {g:'COMBAT',   ic:'x',  n:'MAX COMBO',      d:'Reach the ×8 combo cap',                f:s=>s.bestCombo>=8},
 {g:'COMBAT',   ic:'skull', n:'BOSS SLAYER',    d:'Defeat your first boss or mini-boss',   f:s=>s.bosses>=1},
 {g:'COMBAT',   ic:'crown', n:'WARLORD',        d:'Defeat 5 bosses',                       f:s=>s.bosses>=5},
 {g:'COMBAT',   ic:'droplet', n:'LAST STAND',     d:'Win a battle with under 15% HP left',   f:s=>s.clutch>=1},

 {g:'PROGRESS', ic:'map', n:'STAGE CLEARED',  d:'Clear all 5 levels of a stage',         f:s=>s.stages>=1},
 {g:'PROGRESS', ic:'mountain-snow', n:'VETERAN',        d:'Win 25 battles',                        f:s=>s.levels>=25},
 {g:'PROGRESS', ic:'sparkles', n:'CENTURION',      d:'Win 100 battles',                       f:s=>s.levels>=100},
 {g:'PROGRESS', ic:'shield', n:'COLLECTOR',      d:'Own 3 boss attributes',                 f:s=>_ownedAttrCount()>=3},
 {g:'PROGRESS', ic:'trophy', n:'HIGH SCORER',    d:'Bank a run worth 10,000+',              f:s=>_bestScore()>=10000},
 {g:'PROGRESS', ic:'star', n:'END OF REALITY', d:'Complete the full campaign',            f:s=>hasCompletedMap()},

 {g:'STUDY',    ic:'library', n:'SCHOLAR',        d:'Answer 250 questions correctly',        f:s=>s.correct>=250},
 {g:'STUDY',    ic:'microscope', n:'OWN SYLLABUS',   d:'Generate a practice set from a syllabus',f:s=>s.syllabus>=1},
 {g:'STUDY',    ic:'calendar', n:'CONSISTENT',     d:'Reach a 3-day login streak',            f:()=>(getDaily().streak||0)>=3},
 {g:'STUDY',    ic:'calendar-days', n:'FULL CYCLE', d:'Reach a 7-day login streak',        f:()=>(getDaily().streak||0)>=7},

 /* ── THE MARGIN · hidden until the first seam is found ──────────────────
    The whole group is withheld from the list until the player has found at
    least one of the five hidden mechanics — listing them greyed-out would
    announce that worlds 6-11 exist, which is the one thing the seams are
    for. Once the first is found the group appears with the rest locked. */
 {g:'MARGIN', ic:'scan-line',  n:'THE FIRST SEAM', d:'Find one of the five hidden mechanics',
  f:()=>_seams()>=1},
 {g:'MARGIN', ic:'eye',        n:"READER'S EYE",   d:'Find three of the five',
  f:()=>_seams()>=3},
 {g:'MARGIN', ic:'unlock',     n:'ALL FIVE SEAMS', d:'Find every hidden mechanic and open the margin',
  f:()=>!!_A().gateOpen},
 {g:'MARGIN', ic:'footprints', n:'PAST THE MARGIN',d:'Clear a level beyond World 5',
  f:s=>(s.marginLevels||0)>=1},
 {g:'MARGIN', ic:'shield-check',n:'GUARDED',       d:'Let a margin power-up answer for you',
  f:s=>(s.guards||0)>=1},
 {g:'MARGIN', ic:'book-open',  n:'THE LONG READ',  d:'Clear Worlds 6 through 10',
  f:()=>!!_A().tenDone},
 {g:'MARGIN', ic:'pen-tool',   n:'THE UNWRITTEN',  d:'Reach what was never printed',
  f:()=>!!_A().endRevealed},
];

/* the author state lives in dino-world2.js; read it defensively so the
   achievement list still works if that file has not loaded */
function _A(){ try{ return (window.W2&&W2.A)?W2.A():{}; }catch(e){ return {}; } }
function _seams(){ try{ return (window.W2&&W2.secretCount)?W2.secretCount():0; }catch(e){ return 0; } }
/* The MARGIN group is always listed, but every entry stays "??????" until its
   own requirement is met. A mystery you can see the shape of is a better hook
   than one you cannot see at all — and the count still tells you how much of
   the book is left. The requirement itself is unchanged. */
function _isMargin(a){ return a.g==='MARGIN'; }

function achState(){
  const s=getStats();
  const rows=ACHIEVEMENTS.map(a=>{let ok=false;try{ok=!!a.f(s);}catch(e){}return{a,ok};});
  return{rows,done:rows.filter(r=>r.ok).length,total:rows.length};
}
function updateAchBar(){
  const st=achState();
  const fill=document.getElementById('ach-bar-fill');
  const cnt=document.getElementById('ach-bar-count');
  if(fill)fill.style.width=Math.round(st.done/st.total*100)+'%';
  if(cnt)cnt.textContent=st.done+'/'+st.total;
}
function openAchievements(){
  const st=achState();
  document.getElementById('ach-sub').innerHTML=
    `<b style="color:var(--amber)">${st.done}</b> of ${st.total} unlocked`;
  const groups=['COMBAT','PROGRESS','STUDY','MARGIN'];
  const cols={COMBAT:'var(--red)',PROGRESS:'var(--teal)',STUDY:'var(--blue)',MARGIN:'var(--accent)'};
  document.getElementById('ach-list').innerHTML=groups.map(g=>{
    const items=st.rows.filter(r=>r.a.g===g).map(({a,ok})=>{
      const hide=_isMargin(a)&&!ok;                 // unmet margin entry stays a mystery
      return `
      <div class="ach-item${ok?' on':''}${hide?' ach-mystery':''}">
        <div class="ach-ic">${ok?luc(a.ic,18):luc(hide?'help-circle':'lock',16)}</div>
        <div class="ach-tx"><div class="ach-n">${hide?MASK:a.n}</div><div class="ach-d">${hide?MASK:a.d}</div></div>
        <div class="ach-mk">${ok?luc('check',14):''}</div>
      </div>`;}).join('');
    return `<div class="ach-sec">
      <div class="ach-cat" style="color:${cols[g]};border-color:${cols[g]}">${g}</div>
      <div class="ach-grid">${items}</div></div>`;
  }).join('');
  document.getElementById('ach-modal').classList.add('on');
  refreshIcons();
}

/* ── EXPORT: everything above lives inside the ARENA-FX IIFE, so the rest
      of dino.js and the HTML onclick= handlers cannot see it. ── */
window.getStats         = getStats;
window.setStats         = setStats;
window.bumpStat         = bumpStat;
window.maxStat          = maxStat;
window.achState         = achState;
window.updateAchBar     = updateAchBar;
window.openAchievements = openAchievements;

/* close the ATTR dropdown when clicking anywhere else */
document.addEventListener('pointerdown',e=>{
  const bar=document.getElementById('attr-bar');
  if(bar&&bar.classList.contains('open')&&!bar.contains(e.target))bar.classList.remove('open');
},true);

/* ══ TURN WATCHDOG + SAFE doAnim ══ (append after the final })(); ) */
(function(){
  /* hardened doAnim: forced restart + hard fuse so a turn can never stall.
     This one SHADOWS the doAnim declared earlier in the file, so the sprite
     remap and the measured lunge have to live here too or they never run —
     which is exactly why the fix looked like it did nothing the first time. */
  const SPR={'player-f':'player-spr','boss-f':'boss-spr'};

  /* ── one lunge at a time ────────────────────────────────────────────────
     Attack lunges were fired from wherever the game happened to be: the turn
     sequence, the enemy's MISS branch, the dodge branch (which ran the boss's
     attack animation in the same tick the player's counter-lunge started),
     and a scene hook. Nothing coordinated them, so two fighters could lunge
     at each other simultaneously — a hit with no attacker.

     Lunges now take a turn. One runs; a second waits for it. A third is
     dropped rather than queued behind it, because by then the moment has
     passed — but its callback still fires immediately, so nothing that is
     holding animLock is ever left waiting on an animation that will not
     happen. Flinches and dodges are deliberately NOT serialised: the whole
     point of a flinch is that it overlaps the blow that caused it. */
  let lungeBusy=false, lungeNext=null;
  function lungeStart(run){
    if(!lungeBusy){ lungeBusy=true; run(); return true; }
    if(!lungeNext){ lungeNext=run; return true; }
    return false;                                  // full — caller falls back
  }
  function lungeEnd(){
    const n=lungeNext; lungeNext=null;
    if(n){ n(); return; }                          // stays busy for the next one
    lungeBusy=false;
  }

  window.doAnim=function(id,cls,cb,opts){
    const isLunge=(cls==='aR'||cls==='aL');
    if(isLunge){
      const go=()=>window._doAnim1(id,cls,()=>{ lungeEnd(); if(cb)cb(); },opts);
      if(!lungeStart(go)){ setTimeout(()=>{ if(cb)cb(); },0); }
      return;
    }
    window._doAnim1(id,cls,cb,opts);
  };

  window._doAnim1=function(id,cls,cb,opts){
    const el=document.getElementById(SPR[id]||id);
    if(!el){ if(cb)cb(); return; }
    if(cls==='aR'||cls==='aL'){
      /* measure the real gap so the strike lands on the other fighter instead
         of stopping 26px short of nothing */
      const me=SPR[id]||id, them=(me==='player-spr')?'boss-spr':'player-spr';
      const o=document.getElementById(them);
      let d=26;
      if(o){ const ra=el.getBoundingClientRect(), rb=o.getBoundingClientRect();
        if(ra.width&&rb.width){
          /* Travel the empty space between the two sprites, less a contact
             allowance. Two things add distance on top of `d`: the strike frame
             scales the sprite to 1.06, and the cubic-bezier overshoots its own
             keyframe on the way in. Both scale with sprite size, so the
             allowance does too — the result is a few pixels of contact rather
             than the dinos passing through each other. */
          const gap=Math.abs((rb.left+rb.width/2)-(ra.left+ra.width/2));
          const sum=ra.width+rb.width;
          d=Math.max(16,Math.round(gap-sum/2-sum*0.08));
        } }
      el.style.setProperty('--lunge',d+'px');
    }
    el.classList.remove('aR','aL','aS','aD');
    void el.offsetWidth;                       // force the animation to restart
    let done=false;
    /* Only OUR animation ending may finish the turn. #boss-spr also runs
       `bossEntry` when a level loads, and a {once:true} animationend listener
       caught THAT — so if the enemy struck while its entrance was still
       playing, fin() ran 66ms in, stripped the class and cancelled the strike
       outright. The listener therefore cannot be {once:true}: it has to be
       able to ignore an event and keep waiting for the right one. */
    const WANT={aR:'pokeR',aL:'pokeL',aS:'hurtKnock',aD:'dodgeSlip'};
    const fin=(e)=>{
      if(e&&e.animationName&&WANT[cls]&&e.animationName!==WANT[cls])return;
      if(done)return; done=true;
      el.classList.remove(cls);
      el.removeEventListener('animationend',fin);
      if(cb)cb();
    };
    el.addEventListener('animationend',fin);
    el.classList.add(cls);
    /* onStart has to run here — after the class is on the element — not when
       doAnim was called, because a lunge can have been sitting in the queue.
       strike() hangs the target's flinch off it, and a flinch timed from the
       wrong moment is the disconnected hit all over again. */
    if(opts&&opts.onStart)opts.onStart();
    /* the fuse has to outlast the animation or it strips the class mid-strike.
       Each class has its own duration now; the margin covers a dropped
       animationend. */
    const DUR={aR:ANIM_MS,aL:ANIM_MS,aS:HURT_MS,aD:DODGE_MS};
    setTimeout(fin,(DUR[cls]||ANIM_MS)+250);   // fuse: reduced-motion / dropped event
  };

  /* watchdog: if animLock is held ~5s mid-battle, release and resume the turn */
  setInterval(()=>{
    if(!window.G||!G.inBattle||!G.animLock){ if(window.G)G._lockT=0; return; }
    G._lockT=(G._lockT||0)+1;
    if(G._lockT<5)return;
    G._lockT=0; G.animLock=false;
    if(G.bossHP<=0&&typeof handleLevelWin==='function'){handleLevelWin();return;}
    if(G.playerHP<=0&&typeof endGame==='function'){endGame(false);return;}
    if(typeof setMsg==='function')setMsg('… turn resumed','var(--dim)');
    if(typeof nextQ==='function')nextQ();
  },1000);
})();

/* ══ TUTORIAL · SYLLABUS OFFER · COMPLETED-MAP BUTTON ══ */
(function(){
const SYL_OFFER_KEY='dqb3_syl_offered';

function ask(title,body,yes,no,onYes){
  let m=document.getElementById('ask-modal');
  if(!m){m=document.createElement('div');m.id='ask-modal';m.className='modal-overlay';
    m.innerHTML='<div class="modal-box" id="ask-box"></div>';document.body.appendChild(m);}
  document.getElementById('ask-box').innerHTML=
    `<div class="modal-title">${title}</div><div class="modal-sub">${body}</div>
     <div class="u-row-8 u-mt-4">
       <button class="pbtn g u-flex1" id="ask-y">${yes}</button>
       <button class="pbtn u-flex1" id="ask-n">${no}</button>
     </div>`;
  m.classList.add('on');
  document.getElementById('ask-y').onclick=()=>{m.classList.remove('on');onYes&&onYes();};
  document.getElementById('ask-n').onclick=()=>m.classList.remove('on');
}

/* ---- 2. post-victory academic nudge ---- */
window.offerSyllabusAfterWin=function(){
  if(G&&(G.isPractice||G.isSyllabusRun))return;
  if(localStorage.getItem(SYL_OFFER_KEY))return;
  localStorage.setItem(SYL_OFFER_KEY,'1');
  setTimeout(()=>ask('🎓 CAMPAIGN COMPLETE',
    'You beat the map. Want to test your academic skills now? Try <b>Syllabus Scan</b> — upload your own notes and fight your real coursework.',
    'TRY SYLLABUS SCAN','LATER',
    ()=>{ if(typeof openSyllabusFlow==='function')openSyllabusFlow(); }),900);
};

/* ---- 3. inject the two menu buttons (no HTML edit needed) ---- */
function injectHomeButtons(){
  const grid=document.querySelector('#s-home .home-quick-grid');
  if(!grid||document.getElementById('btn-viewmap'))return;
  if(typeof hasCompletedMap!=='function'||!hasCompletedMap())return;


  if(typeof hasCompletedMap==='function'&&hasCompletedMap()){
    const vc=document.createElement('div');
    vc.id='btn-viewmap'; vc.className='home-quick-card';
    vc.onclick=()=>viewCompletedMap();
    vc.innerHTML='<div class="hq-icon"><i data-lucide="map"></i></div>'+
                 '<div class="hq-label">FINISHED MAP</div>';
    grid.appendChild(vc);
  }
  if(typeof refreshIcons==='function')refreshIcons();
}
const _rh=window.renderHome;
if(typeof _rh==='function')
  window.renderHome=function(){const r=_rh.apply(this,arguments);injectHomeButtons();return r;};
})();

/* ---------- boot ---------- */
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',injectLayers);
else injectLayers();

})();

/* ══════════ 1. ELEMENT COMBAT PROFILES ══════════ */
const ELEM_COMBAT={
  earth   :{crit:0.55,true:2.00,pierce:.35,inflict:0.80,healCut:0   ,tag:'🪨 STONE',note:'Crushing blows pierce armour; rarely crits'},
  poison  :{crit:0.80,true:1.20,pierce:.25,inflict:1.40,healCut:.45,tag:'☠ VENOM',note:'Counters your RESIST and cuts healing 45%'},
  fire    :{crit:1.15,true:1.00,pierce:0  ,inflict:1.70,healCut:.20,tag:'🔥 BLAZE',note:'Very high chance to set you burning'},
  ice     :{crit:0.80,true:0.85,pierce:.10,inflict:1.50,healCut:0   ,tag:'❄ FROST',note:'Slows you instead of hitting hard'},
  electric:{crit:1.75,true:0.60,pierce:0  ,inflict:1.25,healCut:0   ,tag:'⚡ VOLT',note:'Huge crit spikes, poor penetration'},
  shadow  :{crit:1.50,true:1.10,pierce:.15,inflict:1.35,healCut:0   ,tag:'🌑 UMBRA',note:'Blinds you and crits often'},
  void    :{crit:1.20,true:1.70,pierce:.25,inflict:1.25,healCut:.25,tag:'🕳 VOID',note:'Erases resistance and dulls healing'},
  light   :{crit:1.45,true:1.45,pierce:.20,inflict:1.20,healCut:0   ,tag:'☀ RADIANT',note:'Strong at everything — no safe angle'},
  time    :{crit:1.20,true:1.25,pierce:.15,inflict:1.40,healCut:0   ,tag:'⏳ CHRONO',note:'Slows turns and locks your skills'},
  nature  :{crit:1.00,true:0.90,pierce:0  ,inflict:1.15,healCut:.20,tag:'🌿 VERDANT',note:'Chip poison, mild healing drain'},
  water   :{crit:1.20,true:0.90,pierce:0  ,inflict:1.20,healCut:0   ,tag:'🌊 TIDE',note:'Consistent, wave-timed crits'},
  chaos   :{crit:1.00,true:1.00,pierce:.15,inflict:1.30,healCut:.15,tag:'🌪 CHAOS',note:'Re-rolls its own profile every level',random:true},
};

/* fill the six elements that had no contact effect at all */
ELEM_FX.earth  = ELEM_FX.earth  ||{chance:.28,type:'playerVulnerable',turns:1,msg:'🪨 Stone dust cracks your guard — EXPOSED!',color:'var(--grey)',icon:'🪨'};
ELEM_FX.nature = ELEM_FX.nature ||{chance:.30,type:'playerPoison',turns:2,hpPerTurn:5,msg:'🌿 Thorned hide seeps sap into the wound!',color:'var(--green)',icon:'🌿'};
ELEM_FX.water  = ELEM_FX.water  ||{chance:.28,type:'playerSlowed',turns:2,msg:'🌊 Cold brine drags at your limbs — SLOWED!',color:'var(--blue)',icon:'🌊'};
ELEM_FX.time   = ELEM_FX.time   ||{chance:.28,type:'playerSlowed',turns:2,msg:'⏳ Your timeline stutters — SLOWED!',color:'var(--cyan)',icon:'⏳'};
ELEM_FX.light  = ELEM_FX.light  ||{chance:.26,type:'blindness',turns:2,msg:'☀ Searing light sears your eyes — BLINDED!',color:'var(--yellow)',icon:'☀'};
ELEM_FX.chaos  = ELEM_FX.chaos  ||{chance:.30,type:'playerVulnerable',turns:1,msg:'🌪 Chaos unravels your stance — EXPOSED!',color:'var(--orange)',icon:'🌪'};

/* snapshot the untouched base rates once */
const _EC_BASE={
  crit:{...ENEMY_CRIT_CHANCE},
  true:{...ENEMY_TRUEDMG_CHANCE},
  inflict:Object.fromEntries(Object.keys(ELEM_FX).map(k=>[k,ELEM_FX[k].chance])),
};

function applyElemProfile(si){
  const stg=STAGES[si]; if(!stg)return;
  let p=ELEM_COMBAT[stg.elem]||{crit:1,true:1,pierce:0,inflict:1,healCut:0,tag:'✦ UNKNOWN',note:'No elemental bias'};
  if(p.random)p={...p,crit:.7+Math.random()*1.2,true:.7+Math.random()*1.2,pierce:Math.random()*.3};
  G._ec=p;
  ['normal','mini','boss'].forEach(t=>{
    ENEMY_CRIT_CHANCE[t]   =Math.min(.45,_EC_BASE.crit[t]*p.crit);
    ENEMY_TRUEDMG_CHANCE[t]=Math.min(.35,_EC_BASE.true[t]*p.true);
  });
  Object.keys(ELEM_FX).forEach(k=>{
    ELEM_FX[k].chance=Math.min(.75,_EC_BASE.inflict[k]*(k===stg.elem?p.inflict:1));
  });
}

/* hook it to every level load */
(function(){
  const real=window.loadLevel;
  if(typeof real!=='function')return;
  window.loadLevel=function(si,li){
    applyElemProfile(si);
    const r=real.apply(this,arguments);
    const p=G._ec;
    if(p&&typeof queueMsg==='function')
      queueMsg(`${p.tag} — ${p.note}`,'var(--dim)',1500);
    return r;
  };
})();

/* ══════════ 2. RESISTANCE PIERCING + HEALING SUPPRESSION ══════════ */
(function(){
  const realRes=window.resMitigation;
  if(typeof realRes==='function'){
    window.resMitigation=function(res){
      let m=realRes.call(this,res);
      const p=(window.G&&G.inBattle)?G._ec:null;
      if(p&&p.pierce>0)m*=(1-p.pierce);      // stone/void/poison shred RESIST
      return m;
    };
  }
  const realHeal=window.doHealAura;
  if(typeof realHeal==='function'){
    window.doHealAura=function(amt,label){
      const p=(window.G&&G.inBattle)?G._ec:null;
      if(p&&p.healCut>0&&amt>0){
        const cut=Math.round(amt*p.healCut);
        if(cut>0){
          amt=Math.max(1,amt-cut);
          if(typeof queueMsg==='function')
            queueMsg(`${p.tag} suppresses your recovery (−${cut} HP)`,'var(--dim)',800);
        }
      }
      return realHeal.call(this,amt,label);
    };
  }
})();

/* ══════════ 3. DIVINE ONLY AT 0–10% HP ══════════ */
const GUARD_THRESHOLD={divine:0.10,heal:0.50,regen:0.50};
window.checkGuardianTrigger=function(){
  if(!G.pendingGuardians||!G.pendingGuardians.length||!G.inBattle||G.animLock)return;
  if(G.playerHP<=0)return;
  const pct=G.playerHP/G.playerMaxHP;
  const i=G.pendingGuardians.findIndex(t=>pct<=(GUARD_THRESHOLD[t]||0.50));
  if(i<0)return;
  const t=G.pendingGuardians.splice(i,1)[0];
  G.inv[t]=1;
  spawnFloat(t==='divine'?'🌟 LAST STAND!':'⏳ GUARDIAN!','var(--yellow)',false);
  /* A guardian is not a choice the player is making, so it fires through a
     lock or a seal — otherwise the enemy ability that sealed you also eats
     the safety net you banked before the fight. */
  G._forcePU=true;
  try{ usePowerup(t); } finally { G._forcePU=false; }
  if(typeof renderGuardianBadges==='function')renderGuardianBadges();
};

/* ══════════ 4. SHOW WHERE THE ATTRIBUTES WENT ══════════ */
(function(){
  const real=window.handleLevelWin;
  if(typeof real!=='function')return;
  const n=v=>Number(v||0).toLocaleString();
  window.handleLevelWin=function(){
    const r=real.apply(this,arguments);
    const gains=document.getElementById('aw-gains');
    if(!gains||document.getElementById('aw-totals'))return r;
    const row=(ic,lbl,val,cls)=>
      `<div class="aw-row ${cls}"><span class="aw-icon">${ic}</span>`+
      `<span class="aw-text">${lbl}</span>`+
      `<span class="aw-val">${val}</span></div>`;
    const box=document.createElement('div');
    box.id='aw-totals';
    box.innerHTML=
      `<div class="aw-row aw-totals-row">
         <span class="aw-icon">📊</span>
         <span class="aw-text" style="color:var(--yellow)">NEW TOTALS</span>
         <span class="aw-val" style="color:var(--yellow)">NOW</span></div>`+
      row('❤','MAX HP',n(G.playerMaxHP),'aw-hp')+
      row('⚔','ATTACK',n(G.pATK),'aw-atk')+
      row('🛡','RESIST',n(G.pRES),'aw-res')+
      row('💗','CURRENT HP',`${n(G.playerHP)} / ${n(G.playerMaxHP)}`,'aw-heal');
    gains.appendChild(box);
    return r;
  };
})();

/* ══════════ 5. THREAT CLARIFICATION IN THE STAGE PREVIEW ══════════ */
function elemThreatBlock(si){
  const stg=STAGES[si]; if(!stg)return '';
  const p=ELEM_COMBAT[stg.elem]||{};
  const fx=ELEM_FX[stg.elem];
  const L=(typeof EFFECT_LABELS!=='undefined'&&fx&&EFFECT_LABELS[fx.type])?EFFECT_LABELS[fx.type].name:'';
  const pct=x=>Math.round(x*100)+'%';
  const rows=[];
  rows.push(['Element',`${p.tag||stg.elem} — ${p.note||''}`]);
  if(fx)rows.push(['On contact',`${pct(fx.chance)} → ${fx.icon} ${L||fx.type}${fx.turns?` (${fx.turns} turns)`:''}`]);
  else  rows.push(['On contact','none']);
  rows.push(['Crit / True',`${pct(ENEMY_CRIT_CHANCE.normal*(p.crit||1)/(p.crit||1))} base · ×${(p.crit||1).toFixed(2)} crit · ×${(p.true||1).toFixed(2)} true`]);
  if(p.pierce)rows.push(['Pierces RESIST',pct(p.pierce)]);
  if(p.healCut)rows.push(['Cuts your healing',pct(p.healCut)]);
  rows.push(['Enemy passive',(stg.passive&&stg.passive.desc)||'—']);
  return `<div class="wp-threat">
    <div class="wp-threat-lbl">⚠ THREAT PROFILE</div>
    ${rows.map(([k,v])=>`<div class="wp-r"><span class="wp-k">${k}</span><span class="wp-v">${v}</span></div>`).join('')}
  </div>`;
}
(function(){
  const real=window.openStagePreview;
  if(typeof real!=='function')return;
  window.openStagePreview=function(si,li){
    const r=real.apply(this,arguments);
    const box=document.getElementById('wp-box');
    if(box&&!box.querySelector('.wp-threat')){
      const d=document.createElement('div');
      d.innerHTML=elemThreatBlock(si);
      box.appendChild(d.firstElementChild);
    }
    return r;
  };
})();

/* ══════════ 6. GUARDIAN BADGES — STACKED + LIVE STATE ══════════ */
(function(){
  const GT={divine:0.10,heal:0.50,regen:0.50};

  if(!document.getElementById('guard-chip-css')){
    const s=document.createElement('style'); s.id='guard-chip-css';
    /* The chips used to be an in-flow row underneath the sprite. .fighter is a
       bottom-anchored column (.battle-content is align-items:flex-end), so every
       chip DIVINE/REGEN/HEAL added there grew the column and lifted the sprite —
       right off the top of the 150px battle box on a phone. Taking the rail out
       of flow (absolute, min-height:0) pins the column height, so the character
       cannot move no matter how many guardians are queued. */
    s.textContent=`
    .guardian-badges{position:absolute;left:100%;bottom:34px;margin-left:6px;
      display:flex;flex-direction:column;align-items:flex-start;gap:4px;
      min-height:0;width:max-content;pointer-events:none;z-index:6}
    #boss-f .guardian-badges{left:auto;right:100%;margin-left:0;margin-right:6px;
      align-items:flex-end}
    .guardian-chip{display:inline-flex;align-items:center;gap:2px;
      font-family:var(--vt);font-size:13px;line-height:1;padding:2px 5px;
      background:var(--panel2);border:1px solid var(--yellow);border-radius:9px;
      color:var(--yellow);animation:nodeGlow 1.4s ease infinite}
    .guardian-chip .gc-x{font-family:var(--px);font-size:7px;letter-spacing:0}
    .guardian-chip .gc-n{font-family:var(--px);font-size:7px;letter-spacing:.06em;
      white-space:nowrap}
    .guardian-chip i,.guardian-chip svg{width:12px;height:12px;flex:0 0 auto}
    .guardian-chip.gc-last{border-color:var(--red);color:var(--red)}
    .guardian-chip.gc-ready{border-color:var(--green);color:var(--green);
      animation:shieldPulse .8s ease infinite}
    @media(max-width:640px){
      .guardian-badges{bottom:26px;margin-left:3px;gap:2px}
      #boss-f .guardian-badges{margin-right:3px}
      .guardian-chip{font-size:10px;padding:1px 3px;gap:3px}
      .guardian-chip .gc-n{font-size:6px;letter-spacing:.04em}
      .guardian-chip i,.guardian-chip svg{width:10px;height:10px}
    }`;
    document.head.appendChild(s);
  }

  window.renderGuardianBadges=function(){
    const el=document.getElementById('guardian-badges');
    if(!el)return;
    const q=(typeof G!=='undefined'&&G&&G.pendingGuardians)||[];
    if(!q.length){el.innerHTML='';return;}
    const order=[],n={};
    q.forEach(t=>{ if(n[t]===undefined){order.push(t);n[t]=0;} n[t]++; });
    const pct=(G.playerMaxHP>0)?G.playerHP/G.playerMaxHP:1;
    el.innerHTML=order.map(t=>{
      const th=GT[t]!==undefined?GT[t]:0.50;
      const armed=pct<=th, c=n[t];
      const cls='guardian-chip'+(t==='divine'?' gc-last':'')+(armed?' gc-ready':'');
      /* Two problems with `${PU[t].icon}` here.

         One: it is an emoji, and dino-icons.js rewrites emoji to lucide — but
         by a DIFFERENT table than the rest of the UI. DIVINE is 🌟, which maps
         to `sparkles`, while every other place DIVINE appears (the loadout
         rail, the pick cards, the guide) draws PU_ICON_MAP.divine = `star`.
         The same powerup wore two different faces, and the one hanging beside
         your dino was the face that appears nowhere else.

         Two: the chip was icon-only with the explanation in a `title`, which
         is a tooltip nobody on a phone can open. An unlabelled red badge over
         the arena is not a reminder, it is a question. */
      return `<span class="${cls}" title="${PU[t].name} — auto-fires at `+
             `${Math.round(th*100)}% HP${c>1?` · ${c} charges`:''}">`+
             `${luc(PU_ICON_MAP[t]||'sparkles',13)}`+
             `<span class="gc-n">${PU[t].name}</span>`+
             `${c>1?`<span class="gc-x">×${c}</span>`:''}</span>`;
    }).join('');
    if(typeof refreshIcons==='function')refreshIcons();
  };

  /* keep the chips in sync with HP so they light green when armed */
  const _ub=window.updateBars;
  if(typeof _ub==='function')window.updateBars=function(){
    const r=_ub.apply(this,arguments);
    renderGuardianBadges();
    return r;
  };
})();

/* ══════════ 7. ENEMY DAMAGE REBALANCE ══════════ */
(function(){
  /* these are const OBJECTS — mutating properties is legal */
  DMG_PCT.normal=[0.080,0.125];
  DMG_PCT.mini  =[0.105,0.160];
  DMG_PCT.boss  =[0.140,0.210];

  HIT_CAP.normal=0.26; HIT_CAP.mini=0.32; HIT_CAP.boss=0.42;

  ENEMY_CRIT_CHANCE.normal=0.10; ENEMY_CRIT_CHANCE.mini=0.14; ENEMY_CRIT_CHANCE.boss=0.18;
  ENEMY_TRUEDMG_CHANCE.normal=0.05; ENEMY_TRUEDMG_CHANCE.mini=0.08; ENEMY_TRUEDMG_CHANCE.boss=0.12;

  const RES_KEEP=0.30;   // fraction of your RES that still really reduces damage

  window.enemyAtkFor=function(stg,lv,li){
    const p=DMG_PCT[tierOf(lv)];
    const creep=1+li*0.05+(stg.world-1)*0.08;
    const d=DIFF_MUL[G.diff]||1;
    const m=(typeof resMitigation==='function')?resMitigation(G.pRES||0):0;
    const precomp=1/Math.max(0.25,1-m*(1-RES_KEEP));   // undo the RES double-dip
    const min=Math.max(2,Math.round(G.playerMaxHP*p[0]*creep*d*precomp));
    const max=Math.max(min+1,Math.round(G.playerMaxHP*p[1]*creep*d*precomp));
    return [min,max];
  };
})();

/* ══════════ 8. TUTORIAL REMOVED — no-op stubs ══════════ */
window.offerTutorial=function(){};
window.startTutorial=function(){};
try{localStorage.removeItem('dqb3_tutorial_done');}catch(e){}

/* ══════════ 11. TURN CAN NEVER DIE AGAIN ══════════ */
(function(){
  function report(where,e){
    console.error('[DQB '+where+']',e);
    try{if(typeof setMsg==='function')setMsg('⚠ recovered: '+((e&&e.message)||e),'var(--red)');}catch(_){}
  }
  const realAns=window.onAnswer;
  if(typeof realAns==='function'){
    window.onAnswer=function(){
      try{return realAns.apply(this,arguments);}
      catch(e){
        report('onAnswer',e);
        if(!window.G)return;
        G.animLock=false;
        setTimeout(()=>{
          if(G.bossHP<=0&&typeof handleLevelWin==='function')return handleLevelWin();
          if(G.playerHP<=0&&typeof endGame==='function')return endGame(false);
          if(G.inBattle&&typeof nextQ==='function')nextQ();
        },600);
      }
    };
  }
  /* bossAttacks returns without firing cb when the session is stale -> dead turn */
  const realBoss=window.bossAttacks;
  if(typeof realBoss==='function'){
    window.bossAttacks=function(cb){
      let done=false;
      const once=()=>{if(done)return;done=true;
        if(cb){try{cb();}catch(e){report('bossAttacks.cb',e);if(window.G)G.animLock=false;}}};
      let stale=false;
      try{stale=!!(window.G&&typeof _battleSession!=='undefined'&&G._session!==_battleSession);}catch(e){}
      if(stale){if(window.G)G.animLock=false;return once();}
      try{realBoss.call(this,once);}catch(e){report('bossAttacks',e);if(window.G)G.animLock=false;return once();}
      setTimeout(once,3500);
    };
  }
  /* watchdog: in battle, unlocked, but no clickable choice on screen */
  setInterval(()=>{
    if(!window.G||!G.inBattle||G.animLock){if(window.G)G._stallT=0;return;}
    const grid=document.getElementById('choices-grid')||document.querySelector('.choices');
    if(grid&&grid.querySelector('.choice:not([disabled])')){G._stallT=0;return;}
    if((G._stallT=(G._stallT||0)+1)<3)return;
    G._stallT=0;
    if(G.bossHP<=0&&typeof handleLevelWin==='function')return handleLevelWin();
    if(G.playerHP<=0&&typeof endGame==='function')return endGame(false);
    if(typeof nextQ==='function')nextQ();
  },1000);
})();

/* ══════════ 10. CANVAS BUFFERS TRACK THEIR REAL BOX ══════════ */
(function(){
  /* battle background: offsetWidth is 0 on the first rAF -> locks to 400x260 */
  window.drawBattleBg=function(canvas,si){
    if(!canvas)return;
    function fit(){
      const w=Math.round(canvas.offsetWidth||0),h=Math.round(canvas.offsetHeight||0);
      if(w<2||h<2)return false;
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
      return true;
    }
    if(window.ResizeObserver&&!canvas._ro){canvas._ro=new ResizeObserver(fit);canvas._ro.observe(canvas);}
    const go=()=>{fit();if(typeof startBattleBgLoop==='function')startBattleBgLoop(canvas,si);};
    if(!canvas.offsetWidth)return requestAnimationFrame(()=>requestAnimationFrame(go));
    go();
  };
})();