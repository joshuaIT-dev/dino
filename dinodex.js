/* ══════════════════════════════════════════════════════════════════════════
   dinodex.js · v1.0.0 · THE DINODEX — the encounter codex

   One page per enemy family (one per stage, No.001-No.051): sprite, element
   and how it fights, the passive in full, every resistance, what it does on
   contact, the world laws it lives under, its five-member roster, and the
   attribute its boss drops.

   RECORDS  the core game's dino:encounter / dino:defeat events (dino.js) into
            localStorage 'dqb3_dex'. Progress made before the DinoDex existed is
            back-filled from saved runs.
   HIDES    everything past the margin — not locked, absent — until the rules
            (W2.maxWorldUnlocked) open it.
   OPENS    from the battle top bar (tap the STAGE & ENEMY or ENEMY PASSIVE
            card), the map top bar (DINODEX), or DinoDex.open(si).
   LOAD     after dino-world2.js (needs all 51 stages).
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
if(window.DinoDex) return;
const KEY='dqb3_dex';
const GG=()=>{ try{ return (typeof G!=='undefined'&&G)?G:null; }catch(e){ return null; } };
const esc=(typeof escHTML==='function')?escHTML
  :(t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])));
const pct=x=>Math.round(x*100)+'%';

/* ═══ §1 · RECORDS ════════════════════════════════════════════════════════ */
const k=(si,li)=>si+':'+li;
function load(){
  try{ const d=JSON.parse(localStorage.getItem(KEY)||'{}'); return {seen:d.seen||{},beat:d.beat||{}}; }
  catch(e){ return {seen:{},beat:{}}; }
}
function save(d){ try{ localStorage.setItem(KEY,JSON.stringify(d)); }catch(e){} }
window.addEventListener('dino:encounter',e=>{
  const {si,li}=e.detail||{}; if(si==null) return;
  const d=load(); if(!d.seen[k(si,li)]){ d.seen[k(si,li)]=Date.now(); save(d); }
});
window.addEventListener('dino:defeat',e=>{
  const {si,li}=e.detail||{}; if(si==null) return;
  const d=load(); d.seen[k(si,li)]=d.seen[k(si,li)]||Date.now();
  d.beat[k(si,li)]=(d.beat[k(si,li)]||0)+1; save(d);
});
/* every level a run has cleared was, by definition, met and beaten */
function backfill(d){
  const mark=lc=>{ if(!Array.isArray(lc)) return;
    lc.forEach((n,si)=>{ for(let li=0;li<Math.min(5,n|0);li++){
      const kk=k(si,li); d.seen[kk]=d.seen[kk]||1; d.beat[kk]=d.beat[kk]||1; } }); };
  const g=GG(); if(g) mark(g.levelsCleared);
  ['dqb3_save','dqb3_completed_map'].forEach(key=>{
    try{ const s=JSON.parse(localStorage.getItem(key)||'null'); if(s) mark(s.levelsCleared); }catch(e){}
  });
  return d;
}
function status(d,si){
  let seen=0,beat=0;
  for(let li=0;li<5;li++){ if(d.seen[k(si,li)]) seen++; if(d.beat[k(si,li)]) beat++; }
  return {seen,beat};
}

/* ═══ §2 · WHAT THE READER MAY SEE ════════════════════════════════════════ */
const maxWorld=()=>(window.W2&&W2.maxWorldUnlocked)?W2.maxWorldUnlocked():5;
const visible=si=>!!STAGES[si] && (STAGES[si].world||1)<=maxWorld();
function stagesOf(w){ const out=[]; STAGES.forEach((s,si)=>{ if((s.world||1)===w&&visible(si)) out.push(si); }); return out; }
function worldName(w){
  if(w===11) return 'WORLD END · THE UNWRITTEN';
  const m=(typeof WORLD_META!=='undefined'?WORLD_META:[]).find(x=>x.id===w);
  return m?m.name.replace(/\s{2,}/,' · '):'WORLD '+w;
}
const num=si=>'No.'+String(si+1).padStart(3,'0');
function sprite(si,size){
  try{ const s=STAGES[si]; return makeSpr(ECOL[s.sprIdx],si,size); }catch(e){ return '<span style="font-size:'+(size*.6)+'px">🦖</span>'; }
}

/* ═══ §3 · CSS ════════════════════════════════════════════════════════════ */
(function css(){
  if(document.getElementById('dinodex-css')) return;
  const s=document.createElement('style'); s.id='dinodex-css';
  s.textContent=`
#dino-dex{--dx-accent:#e84545;position:fixed;inset:0;z-index:9600;display:none;background:rgba(4,4,8,.86);padding:14px}
#dino-dex.on{display:flex;justify-content:center;align-items:center}
/* The box needs a DEFINITE height. A flex child carrying only a max-height
   shrink-wraps to its content, so the panel used to resize with however many
   stages the open world tab happened to hold — on END (one stage) it covered
   barely half the screen and left a translucent band of game showing under it.
   A definite height is also what lets .dx-body{flex:1} divide the space, which
   is what makes the two columns scroll internally instead of the box growing. */
.dx-box{width:100%;max-width:1000px;height:min(760px,calc(100vh - 28px));max-height:calc(100vh - 28px);
  display:flex;flex-direction:column;
  background:var(--bg);border:2px solid var(--border);border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.7)}
.dx-head{display:flex;align-items:center;gap:12px;padding:11px 14px;border-bottom:1px solid var(--border);flex-wrap:wrap}
.dx-logo{font-family:var(--px,monospace);font-size:14px;letter-spacing:2px;color:var(--dx-accent);text-shadow:2px 2px 0 #000}
.dx-logo span{color:#fff}
.dx-stat{font-size:12px;color:var(--dim);letter-spacing:1px}
.dx-stat b{color:var(--text)}
.dx-close{margin-left:auto}
.dx-note{width:100%;font-size:11px;color:#f5a623;letter-spacing:.5px}
.dx-tabs{display:flex;gap:5px;padding:8px 14px;border-bottom:1px solid var(--border);overflow-x:auto}
.dx-tab{flex:0 0 auto;font-family:var(--px,monospace);font-size:7px;letter-spacing:1px;padding:7px 9px;border-radius:6px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.14);color:#cfcad8;cursor:pointer}
.dx-tab.on{border-color:var(--dx-accent);color:#fff;background:rgba(232,69,69,.14)}
.dx-body{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);min-height:0;flex:1;overflow:hidden}
.dx-list{overflow-y:auto;border-right:1px solid var(--border);padding:8px;display:flex;flex-direction:column;gap:5px}
.dx-item{display:flex;align-items:center;gap:9px;padding:6px 8px;border-radius:7px;cursor:pointer;text-align:left;
  border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);color:var(--text);font:inherit}
.dx-item.on{border-color:var(--dx-accent);background:rgba(232,69,69,.08)}
.dx-num{font-family:var(--px,monospace);font-size:7px;color:var(--dim);min-width:40px}
.dx-thumb{width:36px;height:38px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;overflow:hidden}
.dx-thumb svg{max-width:36px;max-height:38px}
/* Unseen enemies get a PALE silhouette. Pure black at 60% sat on a near-black
   panel and simply wasn't visible for thin sprites (No.051 is a candle). The
   dashed frame reads as "not recorded yet" rather than "image failed to load". */
.dx-unk svg{filter:brightness(0) invert(1) opacity(.22)}
.dx-thumb.dx-unk{background:rgba(255,255,255,.03);border-radius:6px}
.dx-spr.dx-unk{border-style:dashed;border-color:rgba(255,255,255,.18)}
.dx-iname{flex:1;min-width:0;font-size:13px;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dx-iname small{display:block;font-size:10px;color:var(--dim);overflow:hidden;text-overflow:ellipsis}
.dx-marks{font-size:10px;color:var(--dim);white-space:nowrap}
.dx-pane{min-width:0;min-height:0;display:flex;flex-direction:column}
.dx-page{overflow-y:auto;padding:16px 18px;flex:1;min-height:0}
.dx-mback{display:none;align-self:flex-start}
.dx-top{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.dx-spr{width:124px;height:124px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;
  border-radius:10px;background:radial-gradient(circle,var(--panel2),#0a0a10);border:1px solid var(--border)}
.dx-title{font-family:var(--px,monospace);font-size:12px;letter-spacing:1px;color:#fff;margin-bottom:5px;line-height:1.5}
.dx-sub{font-size:12px;color:var(--dim);letter-spacing:1px}
.dx-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}
.dx-tag{font-size:11px;padding:2px 8px;border-radius:10px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05)}
.dx-tag.boss{border-color:rgba(232,69,69,.55);color:#ff8080}
.dx-sec{margin-top:15px}
.dx-sec h4{font-family:var(--px,monospace);font-size:8px;letter-spacing:1.5px;color:var(--yellow);margin:0 0 7px}
.dx-sec p{margin:0 0 5px;font-size:14px;line-height:1.55;color:#d9d5e0}
.dx-chips{display:flex;gap:6px;flex-wrap:wrap}
.dx-trait{display:inline-flex;align-items:center;gap:5px;font-size:13px;padding:4px 9px;border-radius:7px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12)}
.dx-chips .pp-res{font-size:14px;line-height:22px;padding:1px 8px}
.dx-chips .pp-res b{font-size:7px}
.dx-roster{display:flex;flex-direction:column;gap:4px}
.dx-row{display:flex;align-items:center;gap:8px;font-size:13px;padding:5px 9px;border-radius:6px;background:rgba(255,255,255,.03)}
.dx-row .lv{font-family:var(--px,monospace);font-size:7px;color:var(--dim);min-width:22px}
.dx-row .st{margin-left:auto;font-size:11px;color:var(--dim);white-space:nowrap}
.dx-row.beat .st{color:var(--green)}
.dx-locked{color:var(--dim);font-size:14px;line-height:1.7;padding:26px 10px;text-align:center}
/* The world picker for phones. A real <select> so the OS draws the list — it
   scrolls properly, it is reachable by keyboard, and it cannot clip. */
.dx-wsel{display:none;width:100%;box-sizing:border-box;cursor:pointer;
  font-family:var(--px,monospace);font-size:8px;letter-spacing:1px;
  padding:12px 34px 12px 11px;border-radius:8px;
  background-color:#15111a;color:#e8e4ee;border:1px solid rgba(255,255,255,.2);
  -webkit-appearance:none;appearance:none;
  background-image:linear-gradient(45deg,transparent 50%,var(--dx-accent) 50%),
                   linear-gradient(135deg,var(--dx-accent) 50%,transparent 50%);
  background-position:calc(100% - 18px) calc(50% + 1px),calc(100% - 13px) calc(50% + 1px);
  background-size:5px 5px,5px 5px;background-repeat:no-repeat}
.dx-wsel:focus{outline:none;border-color:var(--dx-accent)}
/* the options are drawn by the OS, where pixel type is unreadable */
.dx-wsel option{font-family:var(--vt,monospace);font-size:15px;letter-spacing:0;
  background:#15111a;color:#e8e4ee}
@media(max-width:700px){
  #dino-dex{padding:6px}
  .dx-box{height:calc(100vh - 12px);max-height:calc(100vh - 12px)}
  /* One pane at a time, each taking the full body height. The old split gave
     the list 34vh — three rows with a half row hanging off the bottom — and an
     earlier version let it collapse to 17px, because a scrolling box has a
     min-content height of 0 and lost the space race against the page. */
  .dx-body{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr);overflow:hidden}
  .dx-list{border-right:0}
  .dx-tabs{display:none}
  .dx-wsel{display:block;margin:8px 10px;width:calc(100% - 20px)}
  .dx-mback{display:inline-flex;margin:9px 10px 0}
  .dx-box:not(.dx-detail) .dx-pane{display:none}
  .dx-box.dx-detail .dx-list{display:none}
  .dx-head{gap:8px;padding:9px 11px}
  .dx-logo{font-size:12px;letter-spacing:1px}
  .dx-stat{font-size:11px}
  .dx-tabs{padding:7px 10px}
  .dx-page{padding:13px 13px 18px}
  .dx-top{gap:12px}
  .dx-spr{width:96px;height:96px}
  .dx-title{font-size:11px}
  .dx-sec p{font-size:13px}
}
/* ── phones ── everything above still assumes a tablet's worth of width ── */
@media(max-width:480px){
  .dx-wsel{font-size:7px;padding:11px 30px 11px 9px}
  .dx-logo{font-size:11px;letter-spacing:.5px}
  .dx-stat{font-size:10px;letter-spacing:.5px}
  .dx-note{font-size:10px}
  .dx-tab{font-size:6px;padding:6px 7px}
  .dx-item{gap:7px;padding:5px 7px}
  .dx-num{min-width:32px}
  .dx-thumb{width:30px;height:32px}
  .dx-thumb svg{max-width:30px;max-height:32px}
  .dx-iname{font-size:12px}
  .dx-iname small{font-size:9px}
  .dx-marks{font-size:9px}
  .dx-page{padding:11px 10px 16px}
  .dx-spr{width:84px;height:84px}
  .dx-title{font-size:10px;line-height:1.6}
  .dx-sub{font-size:11px;letter-spacing:.5px}
  .dx-tag,.dx-trait{font-size:11px}
  .dx-sec{margin-top:12px}
  .dx-sec p{font-size:12.5px;line-height:1.5}
  .dx-row{font-size:12px;gap:6px;padding:5px 7px}
  .dx-row .st{font-size:10px}
  .dx-locked{font-size:12.5px;padding:18px 8px}
}
/* the narrowest phones still in use (~320px) and split-screen windows */
@media(max-width:380px){
  .dx-top{gap:9px}
  .dx-spr{width:72px;height:72px}
  .dx-title{font-size:9px}
  .dx-tag,.dx-trait{font-size:10px;padding:3px 7px}
  .dx-row .st{font-size:9px}
}`;
  document.head.appendChild(s);
})();

/* ═══ §4 · PAGES ══════════════════════════════════════════════════════════ */
const TRAITS=[
  ['dodge','💨',v=>pct(v)+' dodge'],
  ['dr','🛡',v=>'takes '+pct(v)+' less damage'],
  ['thorns','🌵',v=>'reflects '+pct(v)+' of your damage'],
  ['lifesteal','🩸',v=>'heals '+pct(v)+' of the damage it deals'],
  ['regen','💚',v=>'regenerates '+pct(v)+' HP per turn'],
];
const LAW_TEXT={6:'blessings decay twice as fast; nothing multiplies past ×2',
  7:'all healing is cut by 40%',8:'one power-up is sealed each battle; enemy abilities act twice',
  9:'a cleared level restores only 20% HP',10:'every clear erodes 1.5% max HP; multipliers are banned'};
const RES_NAME={poison:'POISON',burn:'BURN',paralyze:'PARALYZE',freeze:'FREEZE',halfhp:'HALF HP',stun:'STUN'};

function tagsFor(s){
  const ec=(typeof ELEM_COMBAT!=='undefined')&&ELEM_COMBAT[s.elem];
  return (ec?`<span class="dx-tag" title="${esc(ec.note)}">${esc(ec.tag)}</span>`:'')+
         (s.isBoss?'<span class="dx-tag boss">BOSS STAGE</span>':'');
}
function page(d,si){
  const s=STAGES[si]; if(!s) return '';
  const st=status(d,si), known=st.seen>0, g=GG();
  const head=`<div class="dx-top">
      <div class="dx-spr${known?'':' dx-unk'}">${sprite(si,96)}</div>
      <div><div class="dx-title">${num(si)} · ${known?esc(s.icon+' '+s.name):'? ? ?'}</div>
        <div class="dx-sub">${esc(worldName(s.world))} · S${si+1}</div>
        <div class="dx-tags">${known?tagsFor(s):''}
          <span class="dx-tag">${st.seen}/5 seen</span><span class="dx-tag">${st.beat}/5 defeated</span></div></div>
    </div>`;
  if(!known) return head+`<div class="dx-locked">Not yet encountered.<br>Enter <b>S${si+1}</b> on the map to record it.</div>`;

  const out=[head];
  /* passive */
  const traits=TRAITS.filter(([key])=>s.pas&&s.pas[key]).map(([key,ic,txt])=>
    `<span class="dx-trait" title="${esc(txt(s.pas[key]))}">${ic} ${esc(txt(s.pas[key]))}</span>`).join('');
  out.push(`<div class="dx-sec"><h4>PASSIVE</h4><p><b>${esc(s.passive.label)}</b></p>`+
    (traits?`<div class="dx-chips">${traits}</div>`:'<p>No special traits.</p>')+`</div>`);
  /* resistances */
  const rk=Object.keys(s.res||{});
  out.push(`<div class="dx-sec"><h4>RESISTANCES</h4>`+(rk.length
    ?`<div class="dx-chips">${typeof resChipsHTML==='function'?resChipsHTML(s.res):''}</div>`+
      rk.map(key=>`<p>${esc(RES_NAME[key]||key.toUpperCase())} — ${s.res[key]===0
        ?'<b style="color:var(--red)">immune</b>, it has no effect'
        :pct(1-s.res[key])+' weaker against it'}</p>`).join('')
    :'<p>None — every status power-up works at full strength.</p>')+`</div>`);
  /* how it fights: the game's own threat profile */
  if(typeof elemThreatBlock==='function'){
    try{ out.push(`<div class="dx-sec"><h4>HOW IT FIGHTS</h4>${elemThreatBlock(si)}</div>`); }catch(e){}
  }
  /* the laws past the margin */
  if(s.world>=6 && window.W2 && W2.LAW_NAME){
    const laws=[]; for(let w=6;w<=Math.min(10,s.world);w++) laws.push(`<p>${esc(W2.LAW_NAME[w])} — ${esc(LAW_TEXT[w])}</p>`);
    out.push(`<div class="dx-sec"><h4>WORLD LAWS IN FORCE</h4>${laws.join('')}</div>`);
  }
  /* roster */
  out.push(`<div class="dx-sec"><h4>ROSTER</h4><div class="dx-roster">`+s.levels.map((lv,li)=>{
    const seen=!!d.seen[k(si,li)], n=d.beat[k(si,li)]|0;
    const kind=lv.boss?'<span class="dx-tag boss">BOSS</span>':lv.mini?'<span class="dx-tag">MINI-BOSS</span>':'';
    return `<div class="dx-row${n?' beat':''}"><span class="lv">L${li+1}</span>${seen?esc(lv.sub):'? ? ?'} ${seen?kind:''}`+
      `<span class="st">${n?'✓ defeated'+(n>1?' ×'+n:''):seen?'seen':'—'}</span></div>`;
  }).join('')+`</div></div>`);
  /* the boss's attribute */
  const at=(typeof ATTR_BY_SI!=='undefined')&&ATTR_BY_SI[si];
  if(at){
    const got=!!d.beat[k(si,4)] || !!(g&&Array.isArray(g.attrsOwned)&&g.attrsOwned.includes(at.id));
    out.push(`<div class="dx-sec"><h4>BOSS DROP</h4>`+(got
      ?`<div class="dx-chips"><span class="dx-trait">${esc(at.icon)} <b>${esc(at.name)}</b> · ${esc(at.tier)}</span></div><p>${esc(at.desc)}</p>`
      :'<p>??? — defeat the boss to learn what it leaves behind.</p>')+`</div>`);
  }
  return out.join('');
}

/* ═══ §5 · THE OVERLAY ════════════════════════════════════════════════════ */
/* view: phones show one pane at a time (master → detail). On desktop both
   columns are up at once and this is ignored. */
const STATE={world:1,si:0,view:'list'};
const dxNarrow=()=>window.matchMedia('(max-width:700px)').matches;
function root(){
  let r=document.getElementById('dino-dex'); if(r) return r;
  r=document.createElement('div'); r.id='dino-dex';
  r.innerHTML=`<div class="dx-box" role="dialog" aria-label="DinoDex">
    <div class="dx-head">
      <div class="dx-logo">DINO<span>DEX</span></div>
      <div class="dx-stat" id="dx-stat"></div>
      <button class="pbtn sm dx-close" id="dx-close">✕ CLOSE</button>
      <div class="dx-note" id="dx-note" hidden></div>
    </div>
    <div class="dx-tabs" id="dx-tabs"></div>
    <select class="dx-wsel" id="dx-wsel" aria-label="World"></select>
    <div class="dx-body">
      <div class="dx-list" id="dx-list"></div>
      <div class="dx-pane">
        <button class="pbtn sm dx-mback" id="dx-mback">← ALL ENEMIES</button>
        <div class="dx-page" id="dx-page"></div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(r);
  r.addEventListener('click',e=>{ if(e.target===r) close(); });
  r.querySelector('#dx-close').addEventListener('click',close);
  r.querySelector('#dx-tabs').addEventListener('click',e=>{
    const b=e.target.closest('[data-w]'); if(!b) return;
    STATE.world=+b.dataset.w; const f=stagesOf(STATE.world)[0]; if(f!=null) STATE.si=f;
    STATE.view='list'; render();
  });
  /* the same choice as the tab strip. Ten worlds never fit across a phone, so
     the strip scrolled sideways and cut its last tab through the glyph. */
  r.querySelector('#dx-wsel').addEventListener('change',e=>{
    STATE.world=+e.target.value; const f=stagesOf(STATE.world)[0]; if(f!=null) STATE.si=f;
    STATE.view='list'; render();
  });
  r.querySelector('#dx-list').addEventListener('click',e=>{
    const b=e.target.closest('[data-si]'); if(!b) return;
    STATE.si=+b.dataset.si; STATE.view='detail'; render();
    const pg=r.querySelector('#dx-page'); if(pg) pg.scrollTop=0;
  });
  r.querySelector('#dx-mback').addEventListener('click',()=>{ STATE.view='list'; render(); });
  return r;
}
function render(){
  const r=root(), d=backfill(load()), mw=maxWorld();
  if(STATE.world>mw||STATE.world<1) STATE.world=1;
  if(!visible(STATE.si)||STAGES[STATE.si].world!==STATE.world){
    const f=stagesOf(STATE.world)[0]; STATE.si=(f==null)?0:f;
  }
  let seen=0,mastered=0,total=0;
  STAGES.forEach((s,si)=>{ if(!visible(si)) return; total++;
    const st=status(d,si); if(st.seen) seen++; if(st.beat>=5) mastered++; });
  r.querySelector('#dx-stat').innerHTML=`SEEN <b>${seen}</b> · MASTERED <b>${mastered}</b> · OF <b>${total}</b>`;
  const worlds=[]; for(let w=1;w<=mw;w++) worlds.push(w);
  r.querySelector('#dx-tabs').innerHTML=worlds.map(w=>
    `<button class="dx-tab${w===STATE.world?' on':''}" data-w="${w}" title="${esc(worldName(w))}">${w===11?'END':'W'+w}</button>`).join('');
  /* the dropdown can afford the world's real name, which the tabs never could */
  r.querySelector('#dx-wsel').innerHTML=worlds.map(w=>
    `<option value="${w}"${w===STATE.world?' selected':''}>`+
    `${w===11?'END':'W'+w} · ${esc(worldName(w))}</option>`).join('');
  r.querySelector('.dx-box').classList.toggle('dx-detail',STATE.view==='detail');
  r.querySelector('#dx-list').innerHTML=stagesOf(STATE.world).map(si=>{
    const s=STAGES[si], st=status(d,si), known=st.seen>0;
    return `<button class="dx-item${si===STATE.si?' on':''}" data-si="${si}">
      <span class="dx-num">${num(si)}</span>
      <span class="dx-thumb${known?'':' dx-unk'}">${sprite(si,34)}</span>
      <span class="dx-iname">${known?esc(s.icon+' '+s.name):'? ? ?'}<small>${known?esc(s.levels[4].sub):'not yet encountered'}</small></span>
      <span class="dx-marks">${st.beat}/5</span></button>`;
  }).join('');
  r.querySelector('#dx-page').innerHTML=page(d,STATE.si);
  const on=r.querySelector('.dx-item.on'); if(on&&on.scrollIntoView) on.scrollIntoView({block:'nearest'});
}
function onKey(e){ if(e.key==='Escape'){ e.preventDefault(); close(); } }
function open(si){
  /* Opened on a specific enemy (the battle top-bar cards) the reader already
     picked one, so phones go straight to its page; opened from HOME with no
     argument they are browsing, so they land on the list. */
  if(si!=null&&visible(si)){ STATE.si=si; STATE.world=STAGES[si].world||1; STATE.view='detail'; }
  else STATE.view='list';
  const r=root(); render();
  const g=GG(), note=r.querySelector('#dx-note');
  const ticking=!!(g&&g.inBattle&&g.timedMode!==false);
  note.hidden=!ticking; note.textContent=ticking?'⏳ the battle timer keeps running while this is open':'';
  r.classList.add('on');
  document.addEventListener('keydown',onKey,true);
  return true;
}
function close(){
  const r=document.getElementById('dino-dex'); if(r) r.classList.remove('on');
  document.removeEventListener('keydown',onKey,true);
}
function openCurrent(){ const g=GG(); return open(g&&typeof g.curStage==='number'?g.curStage:null); }

/* ═══ §6 · WAYS IN ════════════════════════════════════════════════════════ */
/* battle top bar: the STAGE & ENEMY card (always visible, phones too) and the
   ENEMY PASSIVE card — both open this enemy's page */
function battleHooks(){
  const cards=[document.getElementById('g-boss-name'),document.getElementById('pp-boss')]
    .map(e=>e&&e.closest('.gtb')).filter(Boolean);
  cards.forEach(c=>{
    if(c.classList.contains('pp-card')) return;
    c.classList.add('pp-card');
    c.setAttribute('role','button');
    c.addEventListener('click',openCurrent);
  });
}
/* Outside battle the DinoDex is reached from the HOME screen's quick grid
   (dino.html) and from DinoDex.open(). It used to inject a button into the map
   top bar, which was one of seven controls fighting over that one row. */

window.DinoDex={VER:'1.0.0',open,close,render,openCurrent,
  records:()=>backfill(load()),
  reset(){ try{ localStorage.removeItem(KEY); }catch(e){} return 'dinodex records cleared'; }};
battleHooks();
console.log('[dinodex] v1.0.0 ready — DinoDex.open()');
})();
