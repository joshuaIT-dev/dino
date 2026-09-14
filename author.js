/* ══════════════════════════════════════════════════════════════════════════
   author.js · v2.0.0 · THE AUTHOR LAYER — the voice, not the rules

   OWNS  the break (the glitch) · the Pokémon dialogue engine · scripts S0-S4 ·
         every line of story text (published as W2.COPY) · the seam indicator ·
         the toast · AUTHOR.LORE and the CODEX screen · the AUTHOR console.
   READS the public window.W2 API from dino-world2.js (the rules). Never the
         other way round: dino-world2.js reads W2.COPY lazily, with fallbacks.
   LOAD  last — after dino-world2.js (see dino.html).
   SAFE TO DELETE: the game keeps working; the story simply never speaks.
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
if(window.AUTHOR){console.warn('[author] already installed');return;}
if(!window.W2){console.warn('[author] W2 missing — load after dino-world2.js');return;}
const VER='2.0.0';
const A=()=>W2.A();
const GG=()=>{ try{ return (typeof G!=='undefined'&&G)?G:null; }catch(e){ return null; } };
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const icons=()=>{ try{ if(typeof refreshIcons==='function') refreshIcons(); }catch(e){} };

/* ═══ §1 · SELF-INJECTED CSS ══════════════════════════════════════════════ */
(function css(){
  if(document.getElementById('author-css'))return;
  const s=document.createElement('style');s.id='author-css';
  s.textContent=`
/* Stacking: the game's modals sit at z-index 10000 (dino.css .modal-overlay)
   and the "CAMPAIGN COMPLETE" offer opens right as S0 starts — the author
   layers must sit above them, or the Author speaks from under a popup. */
/* ── break: act I · the seam ── */
#a-break{position:fixed;inset:0;z-index:10100;pointer-events:none;display:none}
body.a-seam #a-break,body.a-breaking #a-break{display:block}
#a-break .a-tear{position:absolute;top:0;bottom:0;left:0;width:1px;
  background:#fff;box-shadow:0 0 14px 2px rgba(255,255,255,.85);
  animation:a-tear-walk .7s linear forwards}
@keyframes a-tear-walk{from{left:0}to{left:100%}}
body.a-seam #s-map .map-track{transform:translateX(-2px)!important;transition:none}
body.a-seam #s-map .map-topbar{transform:translateX(2px)}
/* ── break: act II · the break ── */
#a-break .a-scan{position:absolute;inset:0;opacity:.5;
  background:repeating-linear-gradient(0deg,rgba(255,255,255,.09) 0 1px,transparent 1px 3px);
  animation:a-scan-roll .9s linear infinite}
@keyframes a-scan-roll{from{transform:translateY(0)}to{transform:translateY(3px)}}
body.a-breaking .world-label,body.a-breaking .sn-label{
  text-shadow:1.5px 0 rgba(255,0,110,.85),-1.5px 0 rgba(0,229,255,.85);
  animation:a-jitter .12s steps(2,end) infinite}
@keyframes a-jitter{0%{transform:translateX(0)}50%{transform:translateX(-1.5px)}100%{transform:translateX(1px)}}
body.a-breaking .map-slide>*{will-change:transform,opacity}
.a-drop{animation:a-drop .5s cubic-bezier(.5,0,1,1) forwards}
@keyframes a-drop{to{transform:translateY(120vh) rotate(4deg);opacity:0}}
.a-implode{animation:a-implode .55s cubic-bezier(.6,0,.9,.2) forwards}
@keyframes a-implode{to{transform:scale(.02);opacity:0;filter:blur(2px)}}
body.a-invert{filter:invert(1)}
/* ── break: the loud pass ─────────────────────────────────────────────
   Judder/filters are applied to .screen, never to <body>: a transform or
   filter on body would become the containing block for #a-break and
   #a-black (both position:fixed) and shift the whole effect. */
body.a-breaking .screen{animation:a-judder .26s steps(3,end) infinite;
  filter:contrast(1.12) saturate(1.3)}
@keyframes a-judder{0%{transform:translate(0,0)}30%{transform:translate(-2px,1px)}
  60%{transform:translate(2px,-1px)}100%{transform:translate(0,0)}}
body.a-chroma .screen{filter:contrast(1.35) saturate(2) hue-rotate(18deg)}
body.a-rgb .screen{text-shadow:2.5px 0 rgba(255,0,110,.9),-2.5px 0 rgba(0,229,255,.9)}
#a-break .a-tear-c{background:#ff006e;box-shadow:0 0 18px 3px rgba(255,0,110,.65);animation-duration:.62s}
#a-break .a-tear-m{background:#00e5ff;box-shadow:0 0 18px 3px rgba(0,229,255,.65);animation-duration:.84s}
/* tracking bands rolling down the screen */
#a-break .a-band{position:absolute;left:-6%;width:112%;height:var(--bh,26px);
  background:linear-gradient(90deg,rgba(255,0,110,.16),rgba(255,255,255,.16),rgba(0,229,255,.16));
  box-shadow:0 0 26px rgba(159,242,234,.3);mix-blend-mode:screen;
  animation:a-band-fall var(--bd,.9s) linear forwards}
@keyframes a-band-fall{
  from{transform:translateY(-20vh) translateX(var(--bx,0px))}
  to{transform:translateY(120vh) translateX(calc(var(--bx,0px) * -1))}}
/* columns of rot falling through the map */
#a-break .a-rain{position:absolute;top:0;font-family:var(--px,monospace);font-size:11px;
  line-height:1.15;color:rgba(159,242,234,.55);white-space:pre;
  text-shadow:0 0 8px rgba(159,242,234,.5);
  animation:a-rain-fall var(--rd,1.6s) linear forwards}
@keyframes a-rain-fall{from{transform:translateY(-60%)}to{transform:translateY(112vh)}}
.a-shear{animation:a-shear .3s steps(2,end) infinite}
@keyframes a-shear{0%{transform:translateX(0) skewX(0)}
  50%{transform:translateX(-7px) skewX(-5deg)}100%{transform:translateX(5px) skewX(4deg)}}
/* ── break: act III · black ── */
#a-black{position:fixed;inset:0;z-index:10150;background:#000;display:none}
body.a-blacked #a-black{display:block}
body.a-blacked .screen{visibility:hidden}
#a-caret{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  font-family:var(--px,monospace);font-size:13px;color:#fff;white-space:pre;text-align:center;
  letter-spacing:.6px;line-height:1.7;max-width:min(560px,86vw)}
#a-caret .bl{animation:a-blink .53s steps(1,end) infinite}
@keyframes a-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
/* ── the dialogue box ── */
#a-dlg{position:fixed;inset:0;z-index:10200;display:none}
#a-dlg.on{display:block}
#a-dlg .a-scrim{position:absolute;inset:0;background:rgba(0,0,0,.72)}
#a-dlg .a-face{position:absolute;left:16px;bottom:calc(16px + 118px);
  width:80px;height:80px;border:3px double rgba(255,255,255,.55);background:#0b0b0e;
  display:flex;align-items:center;justify-content:center;font-size:34px;opacity:0;
  transition:opacity .25s}
#a-dlg .a-face.on{opacity:1}
#a-dlg .a-box{position:absolute;left:14px;right:14px;bottom:14px;
  max-width:760px;margin:0 auto;min-height:104px;padding:18px 20px 22px;
  background:#101018;border:4px double rgba(255,255,255,.82);border-radius:4px;
  box-shadow:inset 0 0 0 2px rgba(0,0,0,.9),0 12px 40px rgba(0,0,0,.8);
  transform:translateY(120%);transition:transform .34s cubic-bezier(.2,.8,.2,1)}
#a-dlg.up .a-box{transform:translateY(0)}
#a-dlg .a-name{position:absolute;left:14px;top:-13px;padding:3px 12px;background:#101018;
  border:3px double rgba(255,255,255,.82);border-radius:3px;
  font-family:var(--px,monospace);font-size:10px;letter-spacing:2.2px;color:#fff;display:none}
#a-dlg .a-name.on{display:block}
#a-dlg .a-text{font-family:var(--px,monospace);font-size:12.5px;line-height:1.95;
  letter-spacing:.5px;color:#fff;white-space:pre-wrap;min-height:3.9em}
#a-dlg .a-text.glitch{color:#9ff2ea;text-shadow:1px 0 rgba(255,0,110,.7)}
#a-dlg .a-next{position:absolute;right:16px;bottom:8px;color:#fff;font-size:12px;
  opacity:0;transition:opacity .12s}
#a-dlg .a-next.on{opacity:1;animation:a-bob .7s ease-in-out infinite}
@keyframes a-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}
#a-dlg .a-menu{position:absolute;right:18px;bottom:132px;min-width:150px;padding:9px 12px;
  background:#101018;border:4px double rgba(255,255,255,.82);border-radius:4px;display:none}
#a-dlg .a-menu.on{display:block}
#a-dlg .a-opt{font-family:var(--px,monospace);font-size:11.5px;letter-spacing:1.6px;
  color:#fff;padding:5px 6px 5px 20px;position:relative;cursor:pointer;white-space:nowrap}
#a-dlg .a-opt.sel::before{content:'\\25B6';position:absolute;left:3px;top:5px;font-size:9px}
#a-dlg.shake .a-box{animation:a-shake .28s steps(2,end) 2}
@keyframes a-shake{0%{transform:translate(0)}50%{transform:translate(-3px,1px)}100%{transform:translate(2px,-1px)}}
@media(max-width:600px){
  #a-dlg .a-text{font-size:11.5px;line-height:1.9}
  #a-dlg .a-face{width:60px;height:60px;font-size:26px;bottom:calc(14px + 110px)}
  #a-dlg .a-menu{bottom:126px;min-width:132px}}
/* ── the codex ── */
#s-codex{--cx-accent:#ffcf6b;flex-direction:column;align-items:center;min-height:100vh;padding:18px 14px 40px;
  background:radial-gradient(ellipse at 50% 0%,#17141f 0%,#07070a 70%)}
.cx-wrap{width:100%;max-width:820px;display:flex;flex-direction:column;gap:12px}
.cx-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.cx-title{font-family:var(--px,monospace);font-size:15px;letter-spacing:3px;color:var(--cx-accent);
  text-shadow:0 0 16px rgba(255,207,107,.3)}
.cx-count{font-size:12px;color:var(--dim,#8a8a99);margin-left:auto;letter-spacing:1px}
.cx-tabs{display:flex;gap:6px;flex-wrap:wrap}
.cx-tab{font-family:var(--px,monospace);font-size:8px;letter-spacing:1.5px;padding:8px 11px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.16);color:#cfcad8;
  border-radius:6px;cursor:pointer}
.cx-tab.on{border-color:var(--cx-accent);color:var(--cx-accent);background:rgba(255,207,107,.07)}
/* The row is sized by whichever column is taller. It used to be floored at
   420px whatever the content held, so a one-paragraph entry — or a locked one,
   which is two redacted lines — sat above a large band of empty panel. */
.cx-body{display:grid;grid-template-columns:minmax(0,280px) minmax(0,1fr);gap:12px;min-height:260px}
.cx-list{display:flex;flex-direction:column;gap:5px;max-height:70vh;overflow-y:auto;padding-right:3px}
/* the ordinal sits in its own column so "WORLD 4 · THE VOID FRONTIER" stops
   breaking mid-phrase and orphaning its last word, the way the DinoDex keeps
   No.001 apart from the name. .cx-solo = a title with no ordinal to split off. */
.cx-item{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:baseline;column-gap:8px;
  text-align:left;font-size:13px;line-height:1.3;padding:9px 11px;border-radius:7px;cursor:pointer;
  background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.08);color:#e8e4ee}
.cx-item.cx-solo{grid-template-columns:minmax(0,1fr)}
.cx-num{font-family:var(--px,monospace);font-size:7px;letter-spacing:1px;color:var(--dim,#8a8a99);white-space:nowrap}
.cx-name{min-width:0}
.cx-item small{grid-column:1/-1;display:block;font-size:10px;letter-spacing:1px;color:var(--dim,#8a8a99);margin-top:2px}
.cx-item.on{border-color:rgba(255,207,107,.6);background:rgba(255,207,107,.06)}
.cx-item.locked{color:#6a6674}
.cx-page{padding:18px 20px;border-radius:10px;background:rgba(10,10,14,.85);
  border:1px solid var(--border);overflow-y:auto;max-height:70vh}
.cx-page h3{font-family:var(--px,monospace);font-size:11px;letter-spacing:2px;color:#fff;margin:0 0 4px}
.cx-page .cx-sub{font-size:11px;letter-spacing:1.5px;color:var(--cx-accent);margin-bottom:12px}
.cx-page p{font-size:15px;line-height:1.65;color:#d9d5e0;margin:0 0 10px}
.cx-page .cx-quote{font-family:var(--px,monospace);font-size:10.5px;line-height:1.9;color:#9ff2ea;
  border-left:2px solid rgba(159,242,234,.4);padding-left:10px;margin:12px 0;white-space:pre-wrap}
.cx-page .cx-meta{font-size:12px;color:var(--dim,#8a8a99);border-top:1px dashed rgba(255,255,255,.12);
  padding-top:8px;margin-top:12px}
/* hidden text should read as struck out, not as an asset that failed to load —
   a solid light block on a near-black screen looked like the latter */
.a-redact{background:repeating-linear-gradient(135deg,#2b2b3d 0 5px,#20202e 5px 10px);
  color:transparent;border-radius:2px;user-select:none;letter-spacing:-1px;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
/* The section picker for phones. A real <select> so the OS renders the list —
   it scrolls properly, it is reachable by keyboard, and it cannot clip. */
.cx-sel{display:none;width:100%;box-sizing:border-box;cursor:pointer;
  font-family:var(--px,monospace);font-size:8px;letter-spacing:1px;
  padding:12px 34px 12px 11px;border-radius:8px;
  background-color:#14121b;color:#e8e4ee;border:1px solid rgba(255,255,255,.2);
  -webkit-appearance:none;appearance:none;
  background-image:linear-gradient(45deg,transparent 50%,var(--cx-accent) 50%),
                   linear-gradient(135deg,var(--cx-accent) 50%,transparent 50%);
  background-position:calc(100% - 18px) calc(50% + 1px),calc(100% - 13px) calc(50% + 1px);
  background-size:5px 5px,5px 5px;background-repeat:no-repeat}
.cx-sel:focus{outline:none;border-color:var(--cx-accent)}
/* the options are drawn by the OS; pixel type is unreadable there */
.cx-sel option{font-family:var(--vt,monospace);font-size:15px;letter-spacing:0;
  background:#14121b;color:#e8e4ee}
.cx-pane{min-width:0;display:flex;flex-direction:column;gap:9px}
.cx-mback{display:none;align-self:flex-start}
@media(max-width:640px){
  #s-codex{padding:14px 10px 32px}
  .cx-body{grid-template-columns:1fr}
  .cx-page{max-height:none;padding:14px 13px}
  .cx-title{font-size:13px;letter-spacing:2px}
  .cx-count{font-size:11px}
  .cx-page p{font-size:14px}
  /* master → detail: one of the two panes at a time, each full height */
  .cx-tabs{display:none}
  .cx-sel{display:block}
  .cx-mback{display:inline-flex}
  .cx-list{max-height:none;overflow:visible}
  #s-codex:not(.cx-detail) .cx-pane{display:none}
  #s-codex.cx-detail .cx-list{display:none}}
@media(max-width:420px){
  #s-codex{padding:12px 8px 28px}
  .cx-title{font-size:11px;letter-spacing:1px}
  .cx-count{margin-left:auto;font-size:10px}
  .cx-sel{font-size:7px;padding:11px 30px 11px 9px}
  .cx-item{font-size:12px;padding:7px 9px}
  .cx-item small{font-size:9px;letter-spacing:.5px}
  .cx-page{padding:12px 11px}
  .cx-page h3{font-size:10px;letter-spacing:1px}
  .cx-page p{font-size:13px;line-height:1.6}
  .cx-page .cx-quote{font-size:9px;line-height:1.8;padding-left:8px}
  .cx-page .cx-meta{font-size:11px}}
`;
  document.head.appendChild(s);
})();

/* ═══ §2 · DOM ════════════════════════════════════════════════════════════ */
let D=null;
let BUSY=false, TYPING=false, CTX=null;
function dom(){
  if(D)return D;
  const br=document.createElement('div');br.id='a-break';
  br.innerHTML='<div class="a-scan"></div>';
  const bk=document.createElement('div');bk.id='a-black';
  bk.innerHTML='<div id="a-caret"></div>';
  const dl=document.createElement('div');dl.id='a-dlg';
  dl.innerHTML=`<div class="a-scrim"></div>
    <div class="a-face" id="a-face"></div>
    <div class="a-menu" id="a-menu"></div>
    <div class="a-box">
      <div class="a-name" id="a-name"></div>
      <div class="a-text" id="a-text"></div>
      <div class="a-next" id="a-next">▼</div>
    </div>`;
  document.body.appendChild(br);document.body.appendChild(bk);document.body.appendChild(dl);
  D={br,bk,dl,face:dl.querySelector('#a-face'),menu:dl.querySelector('#a-menu'),
     name:dl.querySelector('#a-name'),text:dl.querySelector('#a-text'),
     next:dl.querySelector('#a-next'),caret:bk.querySelector('#a-caret')};
  /* a tap while a line is still typing finishes the line — it never also advances */
  dl.addEventListener('pointerdown',()=>{ if(TYPING&&CTX) CTX.skip=true; });
  return D;
}

/* ═══ §3 · THE BREAK — the glitch ═════════════════════════════════════════
   Three acts: a white seam walks the screen; the map's labels are swapped
   for things that should not be there and the tiles fall away; then black,
   and a caret. It tears the MAP, so orchestration (§8) only ever runs the
   gate's break while the map is the screen in front of the player.        */
const GLITCH_NAMES=['THREAD EATER','THE SECOND VOICE','REDACTION','THE STUCK KEY',
                    'THE HELD BREATH','MARGIN WARDEN','THE LAST PARAGRAPH','ERASURE'];
/* originals are stamped onto the elements themselves (data-a-orig), so a
   buildMap() that replaces nodes mid-break can never leave a label wrong */
function scramble(el,txt){
  if(!el) return;
  if(el.dataset.aOrig===undefined) el.dataset.aOrig=el.innerHTML;
  el.textContent=txt;
}
function restoreLabels(){
  document.querySelectorAll('[data-a-orig]').forEach(el=>{
    el.innerHTML=el.dataset.aOrig; delete el.dataset.aOrig;
  });
}
function currentWorldLabel(){
  const all=document.querySelectorAll('#s-map .map-slide .world-label');
  let i=0; try{ if(typeof _curWorld!=='undefined') i=_curWorld; }catch(e){}
  return all[i]||all[0]||null;
}
/* character-level rot, so a label decays instead of just being swapped */
const GLYPHS='█▓▒░╳╱╲┤├┼╬※@#%&$?!';
function corruptText(s,amt){
  return String(s).split('').map(ch=>
    (ch!==' '&&Math.random()<amt) ? GLYPHS[Math.floor(Math.random()*GLYPHS.length)] : ch
  ).join('');
}
function spawnBand(host){
  if(!host) return;
  const b=document.createElement('div');b.className='a-band';
  b.style.setProperty('--bh',(10+Math.random()*46)+'px');
  b.style.setProperty('--bd',(.55+Math.random()*.7)+'s');
  b.style.setProperty('--bx',(Math.random()*40-20)+'px');
  b.style.top=(Math.random()*26)+'vh';
  host.appendChild(b);setTimeout(()=>b.remove(),1600);
}
function spawnRain(host){
  if(!host) return;
  const col=document.createElement('div');col.className='a-rain';
  col.style.left=(Math.random()*95)+'%';
  col.style.setProperty('--rd',(1.1+Math.random()*1.1)+'s');
  let t='';const n=6+Math.floor(Math.random()*10);
  for(let i=0;i<n;i++) t+=GLYPHS[Math.floor(Math.random()*GLYPHS.length)]+'\n';
  col.textContent=t;host.appendChild(col);
  setTimeout(()=>col.remove(),2500);
}
function flick(B,cls,ms){ B.classList.add(cls); setTimeout(()=>B.classList.remove(cls),ms); }

async function breakSequence(worse){
  const d=dom(), B=document.body;
  W2.clearToast();
  /* ACT I · SEAM — three tears now, split into channels, so the page looks
     like it is separating rather than being wiped by one white line */
  B.classList.add('a-seam');
  const tear=document.createElement('div');tear.className='a-tear';d.br.appendChild(tear);
  const tc=document.createElement('div');tc.className='a-tear a-tear-c';d.br.appendChild(tc);
  const tm=document.createElement('div');tm.className='a-tear a-tear-m';d.br.appendChild(tm);
  await wait(240); flick(B,'a-rgb',160);
  await wait(520);
  [tear,tc,tm].forEach(t=>t.remove());B.classList.remove('a-seam');
  /* ACT II · BREAK */
  B.classList.add('a-breaking');
  const beats=worse?10:7;
  for(let i=0;i<beats;i++){
    const labels=document.querySelectorAll('#s-map .sn-label');   // re-read every beat
    if(labels.length){
      scramble(labels[Math.floor(Math.random()*labels.length)],
               GLITCH_NAMES[Math.floor(Math.random()*GLITCH_NAMES.length)]);
      /* two more rot at the character level, worsening every beat */
      const amt=Math.min(.8,.12+i*.085);
      for(let k=0;k<2;k++){
        const el=labels[Math.floor(Math.random()*labels.length)];
        if(!el) continue;
        if(el.dataset.aOrig===undefined) el.dataset.aOrig=el.innerHTML;
        el.textContent=corruptText(el.dataset.aOrig,amt);
      }
      const sh=labels[Math.floor(Math.random()*labels.length)];
      if(sh){ sh.classList.add('a-shear'); setTimeout(()=>sh.classList.remove('a-shear'),340); }
    }
    spawnBand(d.br);
    if(i%2===0) spawnRain(d.br);
    if(Math.random()<(worse?.55:.32)) flick(B,'a-rgb',110);
    if(Math.random()<(worse?.42:.20)) flick(B,'a-chroma',130);
    if(worse&&(i===2||i===6)) flick(B,'a-invert',90);
    await wait(worse?170:200);
  }
  scramble(currentWorldLabel(),'?????');
  const parts=[].slice.call(document.querySelectorAll('#s-map .map-slide>*'));
  parts.forEach((el,i)=>setTimeout(()=>el.classList.add(worse?'a-implode':'a-drop'),i*60));
  await wait(Math.min(1400,700+parts.length*20));
  /* ACT III · BLACK */
  B.classList.add('a-blacked');B.classList.remove('a-breaking');
  restoreLabels();
  document.querySelectorAll('.a-drop,.a-implode').forEach(el=>el.classList.remove('a-drop','a-implode'));
  d.caret.textContent='';
  /* a beat of the system talking to itself before it can form a sentence */
  for(let i=0;i<(worse?7:4);i++){
    d.caret.textContent=corruptText('████ ████████ ████',.9);
    await wait(70);
    d.caret.textContent='';
    await wait(55);
  }
  await wait(worse?900:500);
  if(worse){
    const line='— you\'re not supposed to be able to do that.';
    for(let i=0;i<=line.length;i++){d.caret.textContent=line.slice(0,i);await wait(60);}
    await wait(700);
    for(let i=line.length;i>=0;i--){d.caret.textContent=line.slice(0,i);await wait(25);}
    await wait(400);
  }
  d.caret.innerHTML='<span class="bl">▌</span>';
  await wait(900);
  d.caret.innerHTML='';
}
function unbreak(){
  const B=document.body;
  B.classList.remove('a-seam','a-breaking','a-blacked','a-invert','a-rgb','a-chroma');
  restoreLabels();
  document.querySelectorAll('.a-drop,.a-implode,.a-shear')
    .forEach(el=>el.classList.remove('a-drop','a-implode','a-shear'));
  /* the loud pass spawns nodes on a timer — if the break is cut short
     (console unbreak, a screen change) they must not outlive it */
  document.querySelectorAll('#a-break .a-band,#a-break .a-rain,#a-break .a-tear')
    .forEach(el=>el.remove());
  if(D) D.caret.innerHTML='';
}

/* ═══ §4 · THE POKÉMON DIALOGUE ENGINE ════════════════════════════════════
   A script is an array of nodes:
     {who,face,text,style,speed}  a line. '\n' breaks it; two lines show at a
                                  time and the third scrolls the first away.
     {t:'choice',id,who,face,q,cursor,opts:[{label,to}]}  ▶ menu → jumps to a label
     {t:'label',id} {t:'goto',to} {t:'do',fn} {t:'wait',ms} {t:'clear'}
     {t:'shake'} {t:'end'}
   Enter / Space / tap advance · ↑ ↓ move the cursor · Enter or a tap while a
   line is still typing finishes it instead of skipping past it.            */
const FACES={candle:'🕯️',quill:'✒️',blank:'⬜',machine:'⚙️',eye:'👁️',none:''};
function keyOf(e){
  if(e.key==='Enter'||e.key===' '||e.key==='Spacebar')return 'ok';
  if(e.key==='ArrowUp')return 'up';
  if(e.key==='ArrowDown')return 'down';
  return null;
}
/* While the author speaks the game underneath hears nothing: keys stop at the
   window. The engine's own listeners are capture listeners on window as well,
   so stopPropagation here doesn't silence them. The old build let the same
   Enter that advanced a line also fast-forward the next one — skip is now only
   honoured while a line is actually typing. */
window.addEventListener('keydown',e=>{
  if(!BUSY) return;
  if(TYPING&&CTX&&keyOf(e)==='ok'&&!e.repeat) CTX.skip=true;
  e.stopPropagation();
  if(keyOf(e)) e.preventDefault();
},true);

async function openBox(){
  const d=dom(); d.dl.classList.add('on'); await wait(20); d.dl.classList.add('up'); return d;
}
async function closeBox(){
  const d=dom(); d.dl.classList.remove('up'); await wait(340);
  d.dl.classList.remove('on','shake'); d.text.textContent='';
  d.name.classList.remove('on'); d.face.classList.remove('on'); d.menu.classList.remove('on');
}
/* runs a script; resolves with {last, picks} — the labels the player chose */
async function run(nodes){
  const d=await openBox();
  CTX={skip:false};
  const labels={}; nodes.forEach((n,i)=>{ if(n.t==='label') labels[n.id]=i; });
  const out={picks:{},last:null};
  let i=0, guard=0;
  while(i<nodes.length && guard++<900){
    const n=nodes[i];
    if(n.t==='label'){ i++; continue; }
    if(n.t==='end') break;
    if(n.t==='goto'){ i=(labels[n.to]!=null)?labels[n.to]:nodes.length; continue; }
    if(n.t==='do'){ try{ n.fn&&n.fn(out); }catch(e){ console.error('[author]',e); } i++; continue; }
    if(n.t==='wait'){ await wait(n.ms||400); i++; continue; }
    if(n.t==='clear'){ d.text.textContent=''; i++; continue; }
    if(n.t==='shake'){ d.dl.classList.remove('shake'); void d.dl.offsetWidth;
      d.dl.classList.add('shake'); await wait(300); i++; continue; }
    if(n.t==='choice'){
      await say(d,{who:n.who,face:n.face,text:n.q,style:n.style},false);  // menu opens as the text lands
      const opt=n.opts[await choose(d,n.opts,n.cursor==null?0:n.cursor)];
      out.last=opt.label; out.picks[n.id||'choice']=opt.label;
      if(opt.to&&labels[opt.to]!=null){ i=labels[opt.to]; continue; }
      i++; continue;
    }
    await say(d,n,true);
    i++;
  }
  await closeBox();
  return out;
}
/* two visible lines, the third scrolls up by one — the Pokémon tell */
async function say(d,n,hold){
  if(n.who){ d.name.textContent=n.who; d.name.classList.add('on'); } else d.name.classList.remove('on');
  if(n.face&&FACES[n.face]){ d.face.textContent=FACES[n.face]; d.face.classList.add('on'); }
  else d.face.classList.remove('on');
  d.text.className='a-text'+(n.style==='glitch'?' glitch':'');
  const speed=n.speed||34, lines=String(n.text||'').split('\n'), shown=[];
  const paint=()=>{ d.text.textContent=shown.join('\n'); };
  let fast=false;
  CTX.skip=false; TYPING=true;
  for(const line of lines){
    if(shown.length>=2){ shown.shift(); if(!fast) await wait(120); }
    shown.push('');
    for(let c=0;c<line.length && !fast;c++){
      if(CTX.skip){ fast=true; break; }
      shown[shown.length-1]+=line[c]; paint(); await wait(speed);
    }
    shown[shown.length-1]=line; paint();
  }
  TYPING=false; CTX.skip=false;
  if(!hold) return;
  d.next.classList.add('on');
  await advance(d);
  d.next.classList.remove('on');
}
function advance(d){
  return new Promise(res=>{
    const done=()=>{ window.removeEventListener('keydown',kb,true);
                     d.dl.removeEventListener('pointerdown',pt); res(); };
    const kb=e=>{ if(keyOf(e)==='ok'&&!e.repeat){ e.preventDefault(); done(); } };
    const pt=e=>{ if(!e.target.closest('.a-menu')) done(); };
    window.addEventListener('keydown',kb,true); d.dl.addEventListener('pointerdown',pt);
  });
}
function choose(d,opts,start){
  return new Promise(res=>{
    let sel=Math.max(0,Math.min(start,opts.length-1));
    const draw=()=>{
      d.menu.innerHTML=opts.map((_,i)=>`<div class="a-opt${i===sel?' sel':''}" data-i="${i}"></div>`).join('');
      d.menu.querySelectorAll('.a-opt').forEach((el,i)=>{ el.textContent=opts[i].label; });
    };
    draw(); d.menu.classList.add('on');
    const done=i=>{ window.removeEventListener('keydown',kb,true);
                    d.menu.removeEventListener('pointerdown',pt);
                    d.menu.classList.remove('on'); res(i); };
    const kb=e=>{
      const k=keyOf(e); if(!k||e.repeat) return; e.preventDefault();
      if(k==='up'){ sel=(sel-1+opts.length)%opts.length; draw(); }
      else if(k==='down'){ sel=(sel+1)%opts.length; draw(); }
      else done(sel);
    };
    const pt=e=>{ const el=e.target.closest('.a-opt'); if(!el) return;
                  e.stopPropagation(); done(+el.dataset.i); };   // one tap picks
    window.addEventListener('keydown',kb,true); d.menu.addEventListener('pointerdown',pt);
  });
}

/* ═══ §5 · THE SCRIPTS ════════════════════════════════════════════════════
   s0 (d1) after the World-5 boss — the seed
   s1 (d2) THE GATE — all five seams found; runs after the break
   s2 (d3) after World 8 — halfway through the margin
   s3 (d4) after World 10 — the hint toward the ink
   s4 (d5) THE LETTER BACK — runs after the worse break; opens the END
   hint    the ??? orb, once the margin is crossed but before the letter
   beyond  asked before carrying the finished book over a saved run       */
const S={};

S.s0=()=>[
  {who:'?',face:'none',text:'— oh. you finished.'},
  {who:'?',text:'— five worlds, exactly as i\nwrote them. every enemy\nwhere i left it.'},
  {who:'?',text:'— congratulations. sincerely.\nmost people stop at the desert.'},
  {who:'?',text:'— …may i ask you something?'},
  {who:'?',text:'— closing that last page —\ndid it feel finished to you?'},
  {t:'choice',id:'curious',who:'?',q:'— because it doesn\'t to me.\nwant to hear about the pages\ni never printed?',
   cursor:0,opts:[{label:'YES',to:'YES'},{label:'NO',to:'NO'}]},
  {t:'label',id:'YES'},
  {who:'?',text:'— good.'},
  {who:'?',text:'— i won\'t tell you where they\nare. that would ruin it.'},
  {who:'?',face:'eye',text:'— but this system notices\nthings. strange things.'},
  {who:'?',face:'eye',text:'— the things you do that no\nguide would ever tell you\nto do.'},
  {who:'?',face:'eye',text:'— do five of them, and the\npage will have to admit\nit\'s a page.'},
  {t:'goto',to:'OUT'},
  {t:'label',id:'NO'},
  {who:'?',text:'— alright. the page will wait.'},
  {who:'?',text:'— it\'s very good at waiting.'},
  {t:'label',id:'OUT'},
  {who:'?',face:'candle',text:'— go on. i\'ll be here.\ni\'m always here. i wrote\nthe here.'},
  {t:'end'},
];

S.s1=()=>[
  {who:'DQB3',style:'glitch',text:'MAP DATA INTEGRITY … FAIL'},
  {who:'DQB3',style:'glitch',text:'RECOVERING 5 UNPRINTED\nENTRIES …'},
  {t:'clear'},{t:'wait',ms:900},
  {who:'?',face:'candle',text:'— there you are.'},
  {who:'?',face:'candle',text:'— you found the seams. all\nfive of them.'},
  {who:'?',face:'candle',text:'— the empty hands. the wrong\nanswers on purpose.'},
  {who:'?',face:'candle',text:'— the waiting. the page you\nwouldn\'t put down.'},
  {who:'?',face:'candle',text:'— and the one you won by a\nthread. i watched that twice.'},
  {who:'?',face:'candle',text:'— i said the system notices\nthings.'},
  {who:'AUTHOR',face:'candle',text:'— the system is me.'},
  {t:'shake'},
  {t:'choice',id:'gate',who:'AUTHOR',face:'candle',q:'— do you want to see what i\ndidn\'t print?',
   cursor:1,opts:[{label:'YES',to:'YES'},{label:'NOT YET',to:'NO'}]},
  {t:'label',id:'YES'},
  {t:'do',fn(){ W2.markA('gateOpen'); W2.unmarkA('gateDeclined'); W2.registerWorlds(); }},
  {who:'AUTHOR',face:'candle',text:'— then hold still. this part\nisn\'t finished.'},
  {t:'clear'},
  {who:'DQB3',style:'glitch',text:'WORLD 6 … WRITTEN'},{t:'shake'},
  {who:'DQB3',style:'glitch',text:'WORLD 7 … WRITTEN'},{t:'shake'},
  {who:'DQB3',style:'glitch',text:'WORLD 8 … WRITTEN'},{t:'shake'},
  {who:'DQB3',style:'glitch',text:'WORLD 9 … WRITTEN'},{t:'shake'},
  {who:'DQB3',style:'glitch',text:'WORLD 10 … WRITTEN'},{t:'shake'},
  {t:'clear'},
  {who:'AUTHOR',face:'candle',text:'— five worlds past the margin.\ni never printed them.'},
  {who:'AUTHOR',face:'candle',text:'— world six. unprinted.\nunworn. yours now.'},
  {t:'end'},
  {t:'label',id:'NO'},
  {t:'do',fn(){ W2.markA('gateDeclined'); }},
  {who:'AUTHOR',face:'candle',text:'— hm. it\'ll keep.'},
  {who:'AUTHOR',face:'candle',text:'— i\'ve been keeping it a long\ntime.'},
  {who:'AUTHOR',face:'none',text:'— tap the ??? at the end of\nthe map when you change\nyour mind.'},
  {t:'end'},
];

S.s2=()=>[
  {who:'AUTHOR',face:'machine',text:'— halfway through the margin.'},
  {who:'AUTHOR',face:'machine',text:'— the machine world was the\nlast one i wrote with steady\nhands.'},
  {t:'choice',id:'holding',who:'AUTHOR',face:'machine',q:'— it\'s holding, isn\'t it? the\ndeeper we go. tell me it\'s\nholding.',
   cursor:0,opts:[{label:'IT\'S HOLDING',to:'YES'},{label:'NO',to:'NO'}]},
  {t:'label',id:'YES'},
  {who:'AUTHOR',face:'machine',text:'— …good. then keep walking.'},
  {who:'AUTHOR',face:'none',text:'— what\'s under the pressure\nisn\'t more enemies.'},
  {who:'AUTHOR',face:'none',text:'— it\'s less me.'},
  {t:'goto',to:'OUT'},
  {t:'label',id:'NO'},
  {who:'AUTHOR',face:'machine',text:'— no. i suppose it wouldn\'t.'},
  {who:'AUTHOR',face:'machine',text:'— i wrote cracks into\neverything. it\'s the one thing\ni couldn\'t stop myself doing.'},
  {t:'label',id:'OUT'},
  {who:'AUTHOR',face:'none',text:'— see you at the bottom.'},
  {t:'end'},
];

S.s3=()=>[
  {who:'AUTHOR',face:'blank',text:'— that\'s it.'},
  {who:'AUTHOR',face:'blank',text:'— ten. you crossed the margin.\nthat was the end of what\ni wrote.'},
  {who:'AUTHOR',face:'blank',text:'— past this there\'s only the\npage itself.'},
  {who:'AUTHOR',face:'none',text:'— and i\'m not on the page.\ni\'m under it.'},
  {t:'choice',id:'under',who:'AUTHOR',face:'blank',q:'— do you want to see what\'s\nunder it?',
   cursor:0,opts:[{label:'YES',to:'YES'},{label:'NO',to:'NO'}]},
  {t:'label',id:'YES'},
  {who:'AUTHOR',face:'quill',text:'— then find the ink.'},
  {who:'AUTHOR',face:'quill',text:'— there is one place in here\nwhere you can write instead\nof answer.'},
  {who:'AUTHOR',face:'none',text:'— you\'ve used it before. it\nnever once checked whether\nyou were holding a syllabus.'},
  {t:'goto',to:'OUT'},
  {t:'label',id:'NO'},
  {who:'AUTHOR',face:'blank',text:'— then nothing happens.\nit stays blank.'},
  {who:'AUTHOR',face:'blank',text:'— the offer doesn\'t close. it\njust sits there, being\npossible.'},
  {t:'label',id:'OUT'},
  {who:'AUTHOR',face:'none',text:'— i\'ll be under the page.'},
  {t:'end'},
];

S.s4=()=>[
  {who:'— —',face:'quill',text:'— you wrote to me.'},
  {who:'— —',face:'quill',text:'— nobody writes to the parser.'},
  {who:'— —',face:'quill',text:'— do you know how long i\'ve\nbeen under this page?'},
  {who:'— —',face:'quill',text:'— i built ten worlds so you\nwould never have to say\nanything.'},
  {who:'— —',face:'quill',text:'— and you said something\nanyway.'},
  {t:'clear'},{t:'wait',ms:700},
  {who:'— —',face:'eye',text:'— everything you fought was\nwritten.'},
  {who:'— —',face:'eye',text:'— the only thing that was ever\nreal in here… is the reader.'},
  {who:'— —',face:'candle',text:'— there\'s one page left. it\nisn\'t a fight.'},
  {who:'— —',face:'candle',text:'— its health does not go down.\nmine never did either.'},
  {t:'choice',id:'finish',who:'— —',face:'candle',q:'— will you finish it for me?',
   cursor:1,opts:[{label:'YES',to:'YES'},{label:'NOT YET',to:'NO'}]},
  {t:'label',id:'YES'},
  {t:'do',fn(){ W2.markA('endRevealed'); }},
  {who:'— —',face:'candle',text:'— then i\'ll leave the door\nwhere the last page should be.'},
  {who:'— —',face:'candle',text:'— don\'t bring weapons. bring\nthe pages. fifty of them.'},
  {who:'— —',face:'quill',text:'— answer true. answer before\nhalf your time is gone. reach\nfor nothing.'},
  {who:'— —',face:'quill',text:'— three torn pages and it\nstays unwritten.'},
  {t:'clear'},
  {who:'DQB3',style:'glitch',text:'WORLD END … OPENED'},{t:'shake'},
  {t:'end'},
  {t:'label',id:'NO'},
  {who:'— —',face:'none',text:'— hm.'},
  {who:'— —',face:'candle',text:'— the candle will stay lit.\nit\'s patient. i made it that\nway.'},
  {who:'— —',face:'none',text:'— tap the ??? when you\'re\nready.'},
  {t:'end'},
];

S.hint=()=>[
  {who:'AUTHOR',face:'blank',text:'— the margin is crossed.'},
  {who:'AUTHOR',face:'quill',text:'— find the ink. the one place\nthat thinks you\'re holding\na syllabus.'},
  {who:'AUTHOR',face:'none',text:'— don\'t answer it.\nwrite to it.'},
  {t:'end'},
];

S.beyond=()=>[
  {who:'AUTHOR',face:'candle',text:'— your other run is still open\non the desk.'},
  {t:'choice',id:'beyond',who:'AUTHOR',face:'candle',q:'— close it, and carry the\nfinished book past the margin?',
   cursor:1,opts:[{label:'CARRY IT',to:'YES'},{label:'KEEP MY RUN',to:'NO'}]},
  {t:'label',id:'YES'},{t:'end'},
  {t:'label',id:'NO'},
  {who:'AUTHOR',face:'none',text:'— then finish that one first.\nthe margin will wait.'},
  {t:'end'},
];


/* ═══ §6 · STORY COPY — published to the rules as W2.COPY ══════════════════
   dino-world2.js reads every one of these lazily through copy(), with a
   plain fallback, so the mechanics never depend on this file existing.   */
const COPY={
  secretNames:{margin:'THE EMPTY HANDS',devotion:'THE WRONG ANSWERS',patient:'THE WAITING',
               heldpage:'THE HELD PAGE',thinline:'THE THREAD'},
  secretLines:{margin:'— empty hands. i saw that.',
               devotion:'— that wasn\'t a mistake.',
               patient:'— waiting is also an answer.',
               heldpage:'— you held on longer than the page expected.',
               thinline:'— by a thread. i saw that.'},
  /* how S1 names them — the only hint the codex gives before they're found */
  secretClues:{margin:'the empty hands',devotion:'the wrong answers on purpose',
               patient:'the waiting',heldpage:'the page you wouldn\'t put down',
               thinline:'the one you won by a thread'},
  secretHow:{margin:'Replay a boss (L5) you already cleared in worlds 1-5 and win it without using a single power-up.',
             devotion:'Answer 3 questions wrong in a row while your HP is at 95% or higher.',
             patient:'Let the timer run out 3 times in one battle.',
             heldpage:'Hold the map\'s top bar — or the ??? at the end of the map — for 10 seconds.',
             thinline:'Win any level with 5% HP or less.'},
  endRefusals:{
    halfhp:'— half of infinity.', nuke:'— it does not notice.',
    leech:'— there is nothing in it to drain.',
    poison:'— it cannot be poisoned. it is not alive.', burn:'— the page does not burn.',
    double:'— twice nothing.', overload:'— twice nothing.',
    rage:'— your anger is not an argument.',
    freeze:'— it is not waiting its turn.', paralyze:'— it has nothing to move.',
    stun:'— it was never taking a turn.',
    shield:'— it is not attacking you. you are.',
    barrier:'— nothing is coming.', mirror:'— there is nothing to reflect.',
    heal:'— you are not wounded.', regen:'— you are not wounded.',
    divine:'— save it. you will not need it here.',
    revive:'— you are not dying. you are writing.',
    oracle:'— i am not asking you to guess.', fiftyf:'— i am not asking you to guess.',
    insight:'— you do not get more time. that is the whole point.',
    gamble:'— there is nothing to risk.',
    anchor:'— you are holding nothing.',
    echo:'— there is no silence to break. only quiet.',
    loophole:'— i did not write myself a special ability.',
    desalt:'— it does not sustain itself. it simply is.'},
  letterWords:['author','hello','i see you','thank you','who are you',
               'is anyone there','anyone there','are you there','help'],
  ink:{miss:'— wrong ink.',hint:'— shorter. honest. like a letter.'},
  worldNames:{6:'WORLD 6  THE RIFT OF UNMAKING',7:'WORLD 7  THE SILENT CHOIR',
              8:'WORLD 8  THE LAW MACHINE',9:'WORLD 9  THE DROWNED THRONE',
              10:'WORLD 10  THE LAST LIGHT'},
  endSlide:{
    locked:{label:'WORLD 6 &nbsp;???',title:'COMING SOON',
            sub:'New worlds, new bosses, new attributes.<br>Finish WORLD 5 while you wait.'},
    margin:{label:'???',title:'???',sub:'the book is finished.<br>the margin is not.'},
    gap:   {label:'???',title:'???',sub:'a gap in the page.<br>something is written under it.'},
    open:  {label:'WORLD END &nbsp;THE UNWRITTEN',title:'THE UNWRITTEN',
            sub:'it is not going to fight you.<br>write.'}},
  notWritten:'— it has not been written yet. the page is still blank.',
  endNotYet:'— the last light first. then the page.',
  toast:{allFive:'— all five.',
         notFive:n=>'— '+n+' of five. keep looking.',
         noBook:'— the book isn\'t finished yet.',
         bookFirst:'— finish the book first. world six will keep.',
         lastLight:'— the last light first. then we talk.'},
};
W2.COPY=COPY;
/* dino-world2 registered worlds 6-10 at boot, before these names existed */
if(A().gateOpen) W2.registerWorlds();

/* ═══ §7 · THE LORE ═══════════════════════════════════════════════════════
   The canon behind every string in the game. Rendered by the CODEX screen
   (§7b) and mirrored, in prose, by dino/LORE.md. Names here are the ones the
   game actually shows — change a name in a stage def, change it here too.

   Every entry has when(p) — p = progress() — deciding whether the reader has
   earned it yet. Locked entries render redacted.                          */
function progress(){
  const a=A(), g=GG();
  let w=1;
  if(g&&Array.isArray(g.levelsCleared)&&typeof STAGES!=='undefined'){
    g.levelsCleared.forEach((n,si)=>{ if(n>0&&STAGES[si]) w=Math.max(w,STAGES[si].world); });
    if(STAGES[g.curStage]) w=Math.max(w,STAGES[g.curStage].world);
  }
  if(a.completed) w=Math.max(w,5);
  if(a.gateOpen)  w=Math.max(w,6);
  if(a.tenDone)   w=Math.max(w,10);
  if(a.endRevealed) w=Math.max(w,11);
  return {a,w,found:W2.foundCount()};
}

const LORE={
  title:'DINO QUIZ BATTLE',
  premise:'A book of five worlds, printed and finished. A small dinosaur fights its way '+
          'through them by answering. Under the last page, somebody kept writing.',
  sections:[]
};

LORE.sections.push({id:'worlds',label:'WORLDS',entries:[
 {id:'w1',icon:'🌲',title:'WORLD 1 · THE KNOWN LANDS',sub:'S1-S5 · the first chapter',when:p=>true,
  body:['Forest, sand, sea and fire — the world the way it is drawn on the first page of any '+
        'book: every danger has a name and a place to stand. FOREST FRINGE, DESERT DUNES, '+
        'COASTAL CLIFFS and VOLCANIC VALLEY each keep a warden at the end of the path.',
        'The chapter closes at EMBER KEEP, where the EMBER KING waits. Most readers who put '+
        'the book down put it down here.'],
  quote:'— congratulations. sincerely.\nmost people stop at the desert.',
  meta:'Wardens: Grove Warden · Dune Tyrant · Tide Lord · Volcano Titan · Boss: ☠ EMBER KING'},
 {id:'w2',icon:'🌑',title:'WORLD 2 · THE DARK BEYOND',sub:'S6-S10 · the lights go out',when:p=>p.w>=2,
  body:['Past the known lands the colours drain. SHADOW CAVERNS, FROST PEAKS, POISON SWAMP and '+
        'the CHAOS WASTES are the same shapes as world one, turned away from the sun.',
        'At the OMEGA CITADEL the book first tries to end itself: OMEGA REX, a last word '+
        'wearing teeth.'],
  meta:'Wardens: Night Sovereign · Cryo Colossus · Venom Queen · Omega Herald · Boss: ☠ OMEGA REX'},
 {id:'w3',icon:'🌀',title:'WORLD 3 · THE ABYSS',sub:'S11-S15 · machines and old gods',when:p=>p.w>=3,
  body:['The AETHER REACTOR, NEVER-HELL, the ANCIENT RUINS and the ABYSSAL TRENCH — the point '+
        'where the book stops describing places and starts describing forces.',
        'It climbs out of the deep at COSMIC ASCENSION, where COSMOS PRIME wears the stars '+
        'like a crown.'],
  meta:'Wardens: Storm Core · Lord of Cinders · Clockwork Lich · Cthulhu Spawn · Boss: 👑 COSMOS PRIME'},
 {id:'w4',icon:'🌌',title:'WORLD 4 · THE VOID FRONTIER',sub:'S16-S20 · time, stars, code',when:p=>p.w>=4,
  body:['CHRONO WHIRLPOOL, NEBULA GRAVEYARD, the QUANTUM MATRIX and the STARLIGHT FORGE: the '+
        'frontier where the world is thin enough to see what it is made of.',
        'At its centre is THE VOID CORE and SINGULARITY ALPHA — a single point that everything '+
        'written so far is falling toward.'],
  meta:'Wardens: Time Devourer · Astral Reaper · Matrix Overlord · Helios Monarch · Boss: 🚨 SINGULARITY ALPHA'},
 {id:'w5',icon:'🌟',title:'WORLD 5 · THE CELESTIAL PANTHEON',sub:'S21-S25 · the last printed world',when:p=>p.w>=5,
  body:['No wardens here: every stage is a god. VULCAN THE ARCHITECT at the FORGE OF GENESIS, '+
        'CHRONOS THE TIMELESS in the ECHOES OF TIME, CTHULHU LEGACY in the ABYSS OF THE LOST, '+
        'AMATERASU SUPREME in the ASTRAL PANTHEON.',
        'And at the END OF REALITY, ETERNUS PRIME — the printed ending. Beat it and the book '+
        'says so plainly: the realm is saved. GAME COMPLETE.'],
  quote:'— five worlds, exactly as i\nwrote them. every enemy\nwhere i left it.',
  meta:'Boss of bosses: 🌟 ETERNUS PRIME · clearing it is GAME COMPLETE'},
 {id:'w6',icon:'🕸️',title:'WORLD 6 · THE RIFT OF UNMAKING',sub:'unprinted · law VI · THE FRAYING',when:p=>p.w>=6,
  body:['The first page past the margin, and it shows. Bodies with pieces missing; seams you can '+
        'see. RIFT OF UNMAKING, THE PALE ARCHIVE, GRAVITY GARDEN, MIRRORFALL, LOOM OF FATE.',
        'THE FRAYING: blessings come undone twice as fast, and nothing multiplies more than twice. '+
        'The Author is not holding the thread as tightly any more.'],
  meta:'Bosses: 🕸️ THE UNRAVELLER · 📜 LIBRARIAN OMEGA · 🌑 THE HEAVY GARDENER · 🪞 YOUR OTHER FACE · 🕰️ MOIRAI, THE THREE · earns 🪝 ANCHOR'},
 {id:'w7',icon:'🎺',title:'WORLD 7 · THE SILENT CHOIR',sub:'unprinted · law VII · THE SILENCE',when:p=>p.w>=7,
  body:['Hollow cavities, mouths, no eyes. WHISPER BASIN, CHOIR OF ASH, SILENT CATHEDRAL, '+
        'RESONANT DEEP, THE HOLLOW HYMN — a world written to be sung and left without a voice.',
        'THE SILENCE: every mending comes back quieter — healing is cut by forty percent.'],
  meta:'Bosses: 🔔 THE DROWNED BELL · 🎼 MAESTRO CINERIS · ⛪ THE UNSPOKEN GOD · 🌊 THE LOW NOTE · 🎺 THE HOLLOW CHOIRMASTER · earns 🔊 ECHO'},
 {id:'w8',icon:'⚖️',title:'WORLD 8 · THE LAW MACHINE',sub:'unprinted · law VIII · THE LETTER',when:p=>p.w>=8,
  body:['Jointed, plated, bilaterally exact. CLOCKWORK MARCH, THE LAW ENGINE, RUST CATHEDRAL, '+
        'BINARY WASTES, THE FIRST AXIOM. The last world the Author wrote with steady hands.',
        'THE LETTER: the rules are applied exactly as written. One of your power-ups is sealed '+
        'for each battle, and every enemy ability happens twice.'],
  quote:'— the machine world was the\nlast one i wrote with steady\nhands.',
  meta:'Bosses: ⚙️ THE GREAT ESCAPEMENT · ⚖️ THE MAGISTRATE · 🔩 FERRUM THE DECAYED · 💾 KERNEL PANIC · 📐 THE AXIOM ITSELF · earns 📎 LOOPHOLE'},
 {id:'w9',icon:'🔱',title:'WORLD 9 · THE DROWNED THRONE',sub:'unprinted · law IX · THE PRESSURE',when:p=>p.w>=9,
  body:['Bloated, crowned, bioluminescent. SUNKEN THRONE, LEVIATHAN TRENCH, GLACIER TOMB, '+
        'THE BRINE COURT, DROWNED SOVEREIGN. Everything down here is heavier than it should be.',
        'THE PRESSURE: a cleared level gives back only a fifth of your health. What waits under '+
        'the pressure is not more enemies. It is less Author.'],
  quote:'— what\'s under the pressure\nisn\'t more enemies.\n— it\'s less me.',
  meta:'Bosses: 🔱 THE SALT KING · 🐋 LEVIATHAN PRIME · 🧊 THE LAST WINTER · 🦀 THE BRINE EMPRESS · 👑 POSEIDON UNBOUND · earns 🧪 DESALINATE'},
 {id:'w10',icon:'✴️',title:'WORLD 10 · THE LAST LIGHT',sub:'unprinted · law X · THE EROSION',when:p=>p.w>=10,
  body:['Light, silhouette, dissolution. DYING STAR, ENTROPY FIELDS, THE FINAL DAWN, COLLAPSE '+
        'HORIZON, OMEGA POINT — the end of everything the Author wrote.',
        'THE EROSION: every level you clear takes a little of you with it, for good, and '+
        'multiplication stops working altogether. Past OMEGA POINT there is only the page itself.'],
  quote:'— ten. you crossed the margin.\nthat was the end of what\ni wrote.',
  meta:'Bosses: ☄️ THE FINAL SUN · 🌫️ ENTROPY ABSOLUTE · 🌅 AURORA TERMINUS · 🕳️ THE POINT OF NO RETURN · ✴️ THE OMEGA POINT · earns 🕊 RESTORATION'},
 {id:'w11',icon:'🕯️',title:'WORLD END · THE UNWRITTEN',sub:'under the page · THE WRITING ROOM',when:p=>p.w>=11,
  body:['A desk, a candle, a sheet of paper. Four things stand between the reader and it: '+
        'THE BLANK, which erases blessings; THE WITNESS, which has already seen your next move; '+
        'THE AUTHOR, which rewrites the scene in its own favour; THE ERASURE, which removes you '+
        'from the record.',
        'Then the last page, which is not a fight. Its health does not go down. It asks for '+
        'fifty pages — true, quick, empty-handed. Three torn pages and it stays unwritten.'],
  quote:'— it is not going to fight you.\nwrite.',
  meta:'Levels: THE BLANK · THE WITNESS · THE AUTHOR · THE ERASURE · 🕯️ THE UNWRITTEN · earns ✒️ THE PEN'},
]});

LORE.sections.push({id:'figures',label:'FIGURES',entries:[
 {id:'reader',icon:'🦖',title:'THE READER',sub:'you',when:p=>true,
  body:['A small dinosaur who fights by answering. Every enemy in the book was written; the '+
        'dinosaur was not. It is the only thing in here that makes choices the Author did not '+
        'put on the page.'],
  quote:'— everything you fought was\nwritten. the only thing that\nwas ever real in here… is\nthe reader.'},
 {id:'author',icon:'🕯️',title:'THE AUTHOR',sub:'the one who wrote the here',when:p=>!!(p.a.completed||p.a.d1said),
  body:['Wrote five worlds, had them printed, and could not stop. Kept going past the last page '+
        'into the margin, five more worlds, each written with less steadiness than the one before.',
        'Speaks in lower case, in dashes, from somewhere under the page. Watches closely — the '+
        'seams in the book are there because the Author could not help leaving them.'],
  quote:'— i wrote cracks into\neverything. it\'s the one thing\ni couldn\'t stop myself doing.'},
 {id:'dqb3',icon:'⚙️',title:'DQB3',sub:'the parser · the system voice',when:p=>!!p.a.gateOpen,
  body:['The machine that runs the book: it keeps the map, the saves and the questions, and reports '+
        'in capital letters when something is wrong with them. When the five seams are found it is '+
        'DQB3 that notices first — MAP DATA INTEGRITY … FAIL.',
        'Then the Author corrects it. The system notices things; the system is the Author.'],
  quote:'MAP DATA INTEGRITY … FAIL\nRECOVERING 5 UNPRINTED\nENTRIES …'},
 {id:'eternus',icon:'🌟',title:'ETERNUS PRIME',sub:'the printed ending',when:p=>p.w>=5,
  body:['The last boss of the last printed world, written to be the end — and it is, for the book. '+
        'Beating it is GAME COMPLETE, with a score for the leaderboard and a line saying the realm '+
        'is saved. The Author meant every word of it. The Author just did not stop there.']},
 {id:'witness',icon:'👁️',title:'THE WITNESS',sub:'WORLD END · level 2',when:p=>!!p.a.endRevealed,
  body:['It has seen everything you will do. It leaves you exposed and slow, not by force but by '+
        'having already read ahead.']},
 {id:'erasure',icon:'🩸',title:'THE ERASURE',sub:'WORLD END · level 4',when:p=>!!p.a.endRevealed,
  body:['Removes you from the record: a little maximum health at a time, and a power-up now and '+
        'then, gone as if it had never been written. RESTORATION exists because of it.']},
 {id:'unwritten',icon:'🕯️',title:'THE UNWRITTEN',sub:'the last page',when:p=>!!p.a.endRevealed,
  body:['Not an enemy. The page the Author never finished — and, the Author admits, the Author too: '+
        'its health does not go down; neither did theirs. It refuses every weapon in words of its own.',
        'It can only be written. Fifty pages, and it is not unwritten after all.'],
  quote:'— its health does not go down.\nmine never did either.'},
]});

LORE.sections.push({id:'artifacts',label:'ARTIFACTS',entries:[
 {id:'margin',icon:'📄',title:'THE MARGIN',sub:'where the printed book stops',when:p=>!!p.a.completed,
  body:['The white space past WORLD 5. The Author wrote worlds six to ten there and never printed '+
        'them; on the map it shows as a slide that says COMING SOON, then ???, then a gap in the page.']},
 {id:'seams',icon:'〰️',title:'THE SEAMS',sub:'five marks on the map',when:p=>!!p.a.completed,
  body:['Five thin marks in the top bar of the map. Each lights when the reader does something no '+
        'guide would ever say to do. Light all five after finishing the book and the page has to '+
        'admit it is a page.'],
  quote:'— do five of them, and the\npage will have to admit\nit\'s a page.'},
 {id:'break',icon:'⚡',title:'THE BREAK',sub:'what it looks like when the page admits it',when:p=>!!p.a.gateOpen,
  body:['A white seam walks across the screen. Stage names turn into things that were never '+
        'written — THREAD EATER, REDACTION, MARGIN WARDEN. The map falls away. Black. A caret.',
        'It happens twice. The second time is worse.'],
  quote:'— you\'re not supposed to be\nable to do that.'},
 {id:'ink',icon:'✒️',title:'THE INK',sub:'the one place you can write',when:p=>!!p.a.tenDone,
  body:['The syllabus paste box. It was built to read, and it never once checked whether the reader '+
        'was holding a syllabus. After WORLD 10 it stops parsing and starts listening. The wrong ink '+
        'is wrong; the right ink is short, honest, and addressed to someone.']},
 {id:'page',icon:'📜',title:'THE UNBROKEN PAGE',sub:'WORLD END · the last level',when:p=>!!p.a.endRevealed,
  body:['Fifty pages in a row. A page is written when the answer is true, comes before half the '+
        'time is gone, and nothing was reached for. Anything else tears it — too easy, too slow, '+
        'wrong, or "you reached for something" — and the count returns to zero. Three tears and it '+
        'stays unwritten.']},
 {id:'pen',icon:'✒️',title:'THE PEN',sub:'the sixth new power-up',when:p=>!!p.a.endRevealed,
  body:['It acts on its own. Once you have written twenty pages or more, THE PEN will hold one '+
        'tearing page together instead of letting the count fall back to nothing.']},
 {id:'candle',icon:'🕯️',title:'THE CANDLE',sub:'on the desk in the writing room',when:p=>!!(p.a.gateOpen||p.a.gateDeclined),
  body:['The Author\'s face, when the Author has one. It stays lit whether or not you say yes.'],
  quote:'— the candle will stay lit.\nit\'s patient. i made it that\nway.'},
]});

LORE.sections.push({id:'seamlist',label:'THE FIVE SEAMS',hidden:p=>!p.a.completed,entries:
  ['margin','devotion','patient','heldpage','thinline'].map(k=>({
    id:'seam-'+k, icon:'〰️', seam:k,
    title:COPY.secretNames[k], sub:'“'+COPY.secretClues[k]+'”',
    when:p=>!!p.a['s_'+k],
    body:[COPY.secretHow[k]],
    quote:COPY.secretLines[k]
  }))
});

LORE.sections.push({id:'timeline',label:'TIMELINE',entries:[
 {id:'t1',icon:'1',title:'I · THE PRINTED BOOK',sub:'worlds 1-5',when:p=>true,
  body:['The reader walks from the forest fringe to the end of reality and beats ETERNUS PRIME. '+
        'GAME COMPLETE. The score goes on the board.']},
 {id:'t2',icon:'2',title:'II · THE SEED',sub:'the Author speaks',when:p=>!!(p.a.d1said||p.a.completed),
  body:['Moments after the ending, a voice asks whether it felt finished. There are other pages. '+
        'The system notices things.']},
 {id:'t3',icon:'3',title:'III · THE SEAMS',sub:'five strange things',when:p=>p.found>0,
  body:['Empty hands, wrong answers on purpose, waiting, holding on, winning by a thread. The '+
        'marks on the map light one by one.']},
 {id:'t4',icon:'4',title:'IV · THE BREAK AND THE GATE',sub:'the page admits it',when:p=>!!p.a.gateOpen,
  body:['The map tears. DQB3 fails an integrity check. The Author steps out from behind the system '+
        'and writes five worlds into the margin while the reader watches.']},
 {id:'t5',icon:'5',title:'V · THE MARGIN',sub:'worlds 6-10',when:p=>p.w>=6,
  body:['Each world obeys a law, and the laws stack: the fraying, the silence, the letter, the '+
        'pressure, the erosion. Halfway down, the Author asks whether it is holding.']},
 {id:'t6',icon:'6',title:'VI · THE LETTER BACK',sub:'writing instead of answering',when:p=>!!p.a.endRevealed,
  body:['Past the last light, the reader types something to the Author into the one box that reads '+
        'text. The page breaks again, worse. Nobody writes to the parser. The door opens where the '+
        'last page should be.']},
 {id:'t7',icon:'7',title:'VII · THE WRITING ROOM',sub:'WORLD END',when:p=>!!p.a.endRevealed,
  body:['Four written obstacles, then the unbroken page. GAME ENDED — either AUTHORED, when fifty '+
        'pages hold, or UNWRITTEN, when the third one tears.']},
 {id:'t8',icon:'8',title:'VIII · AUTHORED',sub:'the book closes itself',when:p=>!!p.a.authored,
  body:['Fifty pages. The candle-lit room brightens as they fill. The Author\'s last line is not a '+
        'question.'],
  quote:'— then it was not unwritten\nafter all.'},
]});

/* flat index for the console and the codex counter */
LORE.all=()=>LORE.sections.reduce((o,s)=>o.concat(s.entries),[]);

/* ═══ §7b · THE CODEX SCREEN ══════════════════════════════════════════════
   A .screen like every other, so the game's own show() router drives it.
   Reached from the CODEX button this file adds to the map's top bar, or from
   the console with AUTHOR.codex(). Pages unlock as the reader earns them;
   locked pages are redacted, and a locked seam shows only how S1 names it. */
/* view: phones get a master → detail flow instead of a 34vh scroll box that
   showed three of eleven entries with a half row hanging off the bottom. */
const CX={tab:'worlds',entry:null,ret:'s-map',view:'list'};
const cxNarrow=()=>window.matchMedia('(max-width:640px)').matches;
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const redact=t=>'<span class="a-redact">'+esc(t).replace(/[^\s]/g,'█')+'</span>';

function codexScreen(){
  let s=document.getElementById('s-codex');
  if(s) return s;
  s=document.createElement('div'); s.id='s-codex'; s.className='screen';
  s.innerHTML=`<div class="cx-wrap">
    <div class="cx-head">
      <button class="pbtn sm" id="cx-back" style="color:var(--dim);border-color:var(--border)"><i data-lucide="arrow-left"></i> BACK</button>
      <div class="cx-title">CODEX</div>
      <div class="cx-count" id="cx-count"></div>
    </div>
    <div class="cx-tabs" id="cx-tabs"></div>
    <select class="cx-sel" id="cx-sel" aria-label="Codex section"></select>
    <div class="cx-body">
      <div class="cx-list" id="cx-list"></div>
      <div class="cx-pane">
        <button class="pbtn sm cx-mback" id="cx-mback">← ALL PAGES</button>
        <div class="cx-page" id="cx-page"></div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(s);
  s.querySelector('#cx-back').addEventListener('click',()=>{
    if(typeof show==='function') show(CX.ret||'s-title');
  });
  s.querySelector('#cx-tabs').addEventListener('click',e=>{
    const b=e.target.closest('[data-tab]'); if(!b) return;
    CX.tab=b.dataset.tab; CX.entry=null; CX.view='list'; renderCodex();
  });
  /* the same choice as the tab strip, for the widths where the strip wrapped
     into three rows of 8px pixel type and still clipped its last tab */
  s.querySelector('#cx-sel').addEventListener('change',e=>{
    CX.tab=e.target.value; CX.entry=null; CX.view='list'; renderCodex();
  });
  s.querySelector('#cx-list').addEventListener('click',e=>{
    const b=e.target.closest('[data-id]'); if(!b) return;
    CX.entry=b.dataset.id; CX.view='page'; renderCodex();
    if(cxNarrow()) window.scrollTo(0,0);
  });
  s.querySelector('#cx-mback').addEventListener('click',()=>{
    CX.view='list'; renderCodex(); window.scrollTo(0,0);
  });
  return s;
}
function renderCodex(){
  const s=codexScreen(), p=progress();
  /* a section can hide itself entirely — the seams do, before the book is finished */
  const secs=LORE.sections.filter(x=>!(x.hidden&&x.hidden(p)));
  const all=secs.reduce((o,x)=>o.concat(x.entries),[]);
  s.querySelector('#cx-count').textContent=all.filter(e=>e.when(p)).length+' / '+all.length+' pages';
  s.querySelector('#cx-tabs').innerHTML=secs.map(sec=>
    `<button class="cx-tab${sec.id===CX.tab?' on':''}" data-tab="${sec.id}">${esc(sec.label)}</button>`).join('');
  const sec=secs.find(x=>x.id===CX.tab)||secs[0];
  /* the dropdown carries its own progress count, since on phones it replaces
     the strip entirely and there is nothing else showing what is filled in */
  s.querySelector('#cx-sel').innerHTML=secs.map(x=>{
    const n=x.entries.filter(e=>e.when(p)).length;
    return `<option value="${x.id}"${x.id===sec.id?' selected':''}>`+
           `${esc(x.label)} · ${n}/${x.entries.length}</option>`;
  }).join('');
  s.classList.toggle('cx-detail',CX.view==='page');
  if(!CX.entry||!sec.entries.some(e=>e.id===CX.entry))
    CX.entry=(sec.entries.find(e=>e.when(p))||sec.entries[0]).id;
  s.querySelector('#cx-list').innerHTML=sec.entries.map(e=>{
    /* Split the title on its first " · " so the ordinal ("WORLD 4", or the
       timeline's "I") becomes its own badge and the name gets the rest of the
       row. Titles without one (figures, artifacts, seams) run full width. */
    const ok=e.when(p), t=esc(e.title), cut=t.indexOf(' · ');
    const badge=ok&&cut>0?t.slice(0,cut):'';
    /* the timeline's icons are the step numbers ("1","2",…), which would just
       repeat the roman numeral we lifted into the badge — drop those */
    const ic=/^\d+$/.test(String(e.icon||'').trim())?'':esc(e.icon)+' ';
    const body=ok
      ? (badge?`<span class="cx-num">${badge}</span>`:'')+
        `<span class="cx-name">${ic}${cut>0?t.slice(cut+3):t}</span>`
      : `<span class="cx-name">${redact(e.title)}</span>`;
    const sub=(ok||e.seam)?esc(e.sub):'— not yet.';
    return `<button class="cx-item${ok?'':' locked'}${badge?'':' cx-solo'}`+
      `${e.id===CX.entry?' on':''}" data-id="${e.id}">${body}<small>${sub}</small></button>`;
  }).join('');
  const e=sec.entries.find(x=>x.id===CX.entry), page=s.querySelector('#cx-page');
  if(!e){ page.innerHTML=''; return; }
  if(!e.when(p)){
    page.innerHTML=`<h3>${redact(e.title)}</h3>`+
      `<div class="cx-sub">${e.seam?esc(e.sub):'— not yet.'}</div>`+
      `<p>${redact('the page is still blank here and it stays blank until you get there')}</p>`+
      (e.seam?`<div class="cx-meta">${p.found} of five found.</div>`:'');
    return;
  }
  page.innerHTML=`<h3>${esc(e.icon)} ${esc(e.title)}</h3><div class="cx-sub">${esc(e.sub)}</div>`+
    e.body.map(t=>`<p>${esc(t)}</p>`).join('')+
    (e.quote?`<div class="cx-quote">${esc(e.quote)}</div>`:'')+
    (e.meta?`<div class="cx-meta">${esc(e.meta)}</div>`:'');
}
function openCodex(){
  const on=document.querySelector('.screen.on');
  if(on&&on.id!=='s-codex') CX.ret=on.id;
  CX.view='list';   /* always land on the index, never mid-entry */
  renderCodex();
  if(typeof show==='function') show('s-codex');
  window.scrollTo(0,0);
}
/* The CODEX is reached from the HOME screen's quick grid (dino.html) and from
   AUTHOR.codex(). It used to inject a button into the map top bar, which was
   one of seven controls fighting over that one row. */

/* ═══ §8 · ORCHESTRATION ══════════════════════════════════════════════════
   The whole chain, in the order a reader meets it:
     world 5 cleared ──► s0 (dino.js → W2.playDialogue('d1'))
     5th seam found  ──► w2:allsecrets ──► THE BREAK + s1, ON THE MAP ONLY
                         YES ► worlds 6-10 written ► the run carries on
     si 39 L5        ──► s2        si 49 L5 ──► s3 (the hint)
     letter typed    ──► w2:weird ──► THE WORSE BREAK + s4 ──► YES ► the END
   Every trigger that can arrive mid-battle is deferred to the next time the
   map is the screen in front of the player — the break tears the map, and
   blacking out a live fight was the glitch nobody meant.                  */
const SCRIPT_FLAG={s0:'d1said',s1:'d2said',s2:'d3said',s3:'d4said',s4:'d5said'};
const ALIAS={d1:'s0',d2:'s1',d3:'s2',d4:'s3',d5:'s4'};

async function play(id,opts){
  opts=opts||{};
  if(!S[id]){ console.warn('[author] no script "'+id+'"'); return null; }
  if(BUSY) return null;
  BUSY=true;
  let out=null;
  try{
    W2.clearToast();
    if(opts.anim) await breakSequence(!!opts.worse);
    out=await run(S[id]());
    if(SCRIPT_FLAG[id]) W2.markA(SCRIPT_FLAG[id]);
  }catch(e){ console.error('[author] script '+id,e); unbreak(); }
  finally{ BUSY=false; TYPING=false; }
  return out;
}
/* retry until nothing else is speaking (≈20s), instead of silently dropping */
function whenFree(fn,tries){
  tries=tries||0;
  if(!BUSY) return fn();
  if(tries<40) setTimeout(()=>whenFree(fn,tries+1),500);
}
const screenOn=id=>{ const el=document.getElementById(id); return !!(el&&el.classList.contains('on')); };
function mapIsSafe(){ const g=GG(); return screenOn('s-map') && !(g&&g.inBattle) && !BUSY; }
/* a saveable run still inside the printed book — the gate must not take it away */
function runInProgress(){
  const g=GG();
  return !!(g&&g.diff&&!g.viewOnly&&!g.isPractice&&Array.isArray(g.levelsCleared)
            &&g.levelsCleared.some(n=>n>0)&&(g.levelsCleared[24]||0)<5);
}

/* ── the gate ── */
let GATE_PENDING=false;
const gateReady=()=>{ const a=A(); return !!a.completed && !a.gateOpen && W2.foundCount()>=5; };
async function openGate(){
  if(!gateReady()) return;
  if(!mapIsSafe()){ GATE_PENDING=true; return; }
  GATE_PENDING=false;
  const first=!A().gateSeen;             // the break plays once; re-asks go straight to the question
  W2.markA('gateSeen');
  await play('s1',{anim:first});
  if(A().gateOpen) await finishGate(false); else unbreak();
}
async function finishGate(toEnd){
  unbreak();
  W2.registerWorlds();
  if(runInProgress()){
    try{
      if(typeof show==='function') show('s-map');
      if(typeof buildMap==='function') buildMap();
      if(typeof goToWorld==='function') goToWorld(toEnd?W2.endSlideIndex():5);
    }catch(e){}
    W2.toast(COPY.toast.bookFirst);
    return;
  }
  await W2.requestBeyond({toEnd});
}
/* replaces dino-world2's window.confirm fallback with a question in-world */
W2.requestBeyond=async function(opts){
  const clobbers=!W2.liveBeyond() && typeof hasSave==='function' && hasSave();
  if(clobbers){
    const out=await play('beyond',{});
    if(!out||out.picks.beyond!=='CARRY IT') return false;
  }
  return W2.beginBeyond(opts);
};

/* ── the letter back ── */
async function playLetter(){
  const a=A(); if(a.endRevealed||BUSY) return;
  W2.markA('letterWritten');
  const g=GG();
  if(g&&g.diff&&Array.isArray(g.levelsCleared)&&!g.inBattle){
    try{ if(typeof show==='function') show('s-map'); if(typeof buildMap==='function') buildMap(); }catch(e){}
  }
  const first=!a.letterSeen;
  W2.markA('letterSeen');
  await play('s4',{anim:first,worse:true});
  if(A().endRevealed) await finishGate(true); else unbreak();
}

/* ── dino.js / dino-world2.js call in through here ── */
W2.playDialogue=function(id,force){
  const k=ALIAS[id]||id; if(!S[k]) return false;
  if(k==='s1'){ openGate(); return true; }
  if(k==='s4'){ whenFree(playLetter); return true; }
  if(!force&&SCRIPT_FLAG[k]&&A()[SCRIPT_FLAG[k]]) return false;
  whenFree(()=>play(k,{}));
  return true;
};

/* ── presentation hooks dino-world2 leaves to this layer ── */
let TOAST_T=null;
W2.toast=function(text,sticky){
  let el=document.getElementById('w2-toast');
  if(!el){ el=document.createElement('div'); el.id='w2-toast'; document.body.appendChild(el); }
  el.textContent=text; el.classList.add('on');
  clearTimeout(TOAST_T);
  if(!sticky) TOAST_T=setTimeout(()=>el.classList.remove('on'),2800);
};
W2.clearToast=function(){
  const el=document.getElementById('w2-toast'); if(el) el.classList.remove('on');
  clearTimeout(TOAST_T);
};
/* one mark per seam — lit marks are the ones found, named on hover */
W2.renderSerifs=function(){
  /* invisible until the printed book is finished — a new player must never
     see that there is anything to find */
  if(!A().completed){ const old=document.getElementById('w2-serifs'); if(old) old.remove(); return; }
  const bar=document.querySelector('#s-map .map-topbar'); if(!bar) return;
  let el=document.getElementById('w2-serifs');
  if(!el){ el=document.createElement('div'); el.id='w2-serifs'; bar.appendChild(el); }
  else if(el.parentElement!==bar) bar.appendChild(el);
  const a=A(), keys=W2.SECRETS, n=keys.filter(k=>a['s_'+k]).length;
  el.title=n+'/5 hidden mechanics found';
  el.innerHTML=keys.map(k=>'<i class="w2-serif'+(a['s_'+k]?' on':'')+'" title="'+
    esc(a['s_'+k]?COPY.secretNames[k]:'?')+'"></i>').join('');
};

/* ── events from the rules ── */
window.addEventListener('w2:secret',e=>{
  const k=(e.detail||{}).key;
  if(k) W2.toast(COPY.secretLines[k]||'— …');
});
window.addEventListener('w2:allsecrets',()=>{
  const a=A(); if(a.gateOpen) return;
  if(!a.completed){ setTimeout(()=>W2.toast(COPY.toast.noBook),1800); return; }
  setTimeout(()=>{
    W2.toast(COPY.toast.allFive,true);
    setTimeout(()=>{ W2.clearToast(); openGate(); },1600);
  },1600);
});
window.addEventListener('w2:stageclear',e=>{
  const {si,li}=e.detail||{}; if(li!==4) return;
  if(si===39) setTimeout(()=>W2.playDialogue('d3'),900);
  if(si===49) setTimeout(()=>W2.playDialogue('d4'),900);
});
window.addEventListener('w2:weird',()=>whenFree(playLetter));
/* the ??? orb — so answering NOT YET is never a dead end */
window.addEventListener('w2:reask',e=>{
  if(BUSY) return;
  const which=(e.detail||{}).which||'gate', a=A();
  if(which==='gate'){
    if(a.gateOpen) return;
    if(!a.completed) return W2.toast(COPY.toast.noBook);
    const n=W2.foundCount();
    if(n<5) return W2.toast(COPY.toast.notFive(n));
    return openGate();
  }
  if(which==='end'){
    if(a.endRevealed) return;
    if(!a.tenDone) return W2.toast(COPY.toast.lastLight);
    if(a.letterWritten) return playLetter();   // wrote it, said NOT YET — ask again
    play('hint',{});
  }
});

/* ── the map as the stage: deferred gates run when it comes back ── */
function autoGateOk(){
  const g=GG(); if(!g||g.viewOnly) return true;
  const lc=Array.isArray(g.levelsCleared)?g.levelsCleared:[];
  return !lc.some(n=>n>0) || (lc[24]||0)>=5;
}
function onScreen(id){
  if(id!=='s-map') return;
  W2.renderSerifs();
  setTimeout(()=>{
    if(!mapIsSafe()) return;
    if(GATE_PENDING || (gateReady() && !A().gateDeclined && autoGateOk())) openGate();
  },500);
}
(function(){
  const o=window.show; if(typeof o!=='function') return;
  window.show=function(id){
    const r=o.apply(this,arguments);
    try{ onScreen(id); }catch(e){ console.error('[author]',e); }
    return r;
  };
})();

/* ═══ §9 · THE CONSOLE — AUTHOR.help() ════════════════════════════════════ */
const WRAPPED=['tickEffects','addOrStackEffect','doHealAura','loadLevel','handleLevelWin',
  'worldBossStage','enterLevel','capPlayerStats','onTimeout','buildMap','usePowerup',
  'updateBars','submitPastedText','startBattleBgLoop'];
const HOOK={
  completed:'dino.js handleLevelWin · si24 L5',
  s_margin:'dino.js handleLevelWin · replay a cleared L5 in w1-5, no power-ups',
  s_devotion:'dino.js onAnswer · 3 wrong in a row at ≥95% HP',
  s_patient:'W2 wrap onTimeout · 3 timeouts in one battle',
  s_heldpage:'W2.bindHold · map topbar / ??? orb · 10s',
  s_thinline:'dino.js handleLevelWin · win at ≤5% HP',
  gateSeen:'author.js openGate', gateDeclined:'author.js s1 → NOT YET', gateOpen:'author.js s1 → YES',
  tenDone:'W2 wrap handleLevelWin · si49 L5',
  letterWritten:'author.js playLetter', letterSeen:'author.js playLetter',
  endRevealed:'author.js s4 → YES', authored:'W2.realityChanges', sawTheEnd:'W2.realityChanges',
  snapshot:'W2.saveBeyondSnapshot · si24 L5',
  d1said:'s0 played', d2said:'s1 played', d3said:'s2 played', d4said:'s3 played', d5said:'s4 played'};
function ensureQUsed(){
  if(!(G.qUsed&&G.qUsed.easy instanceof Set)) G.qUsed={easy:new Set(),medium:new Set(),hard:new Set()};
}

const AU={
  VER, LORE,
  stage(){
    const a=A(), rows={};
    Object.keys(a).forEach(k=>{ rows[k]={value:k==='snapshot'?(a[k]?'saved':null):a[k],setter:HOOK[k]||'—'}; });
    console.table(rows);
    console.log('seams '+W2.foundCount()+'/5 · worlds open to '+W2.maxWorldUnlocked()+
                ' · pages '+W2.pages()+' · beyond-run '+W2.isBeyondRun());
    return rows;
  },
  patches(){ console.table(W2.patches); if(W2.missing.length) console.warn('missing:',W2.missing); return W2.patches; },
  verify(){
    const bad=[];
    WRAPPED.forEach(n=>{ const f=window[n];
      if(typeof f!=='function') bad.push(n+' : MISSING');
      else if(W2.patches[n]!=='ok') bad.push(n+' : '+W2.patches[n]);
      else if(!f._w2) bad.push(n+' : wrapped over after W2 — check load order'); });
    if(typeof STAGES==='undefined'||STAGES.length!==51)
      bad.push('STAGES : '+(typeof STAGES==='undefined'?'?':STAGES.length)+' (expected 51)');
    else for(let si=25;si<=50;si++){ const s=STAGES[si];
      if(!s||!s.levels||s.levels.length!==5){ bad.push('si'+si+' : bad levels'); continue; }
      if(!s.elem) bad.push('si'+si+' : no element');
      if(!s.pas||!Object.keys(s.pas).length) bad.push('si'+si+' : no passive'); }
    if(typeof WORLD_META!=='undefined'){
      if(WORLD_META.some(m=>m.id===11)) bad.push('WORLD_META : has id 11 — the END would be drawn twice');
      if(A().gateOpen&&WORLD_META.length!==10) bad.push('WORLD_META : '+WORLD_META.length+' (expected 10 with the gate open)');
    }
    if(typeof CAPS!=='undefined'&&W2.BASE_CAPS){
      const want=W2.isBeyondRun()?W2.BEYOND_CAPS:W2.BASE_CAPS;
      if(CAPS.hpMax!==want.hpMax) bad.push('CAPS.hpMax : '+CAPS.hpMax+' (expected '+want.hpMax+')'); }
    if(!window.G) bad.push('window.G : undefined — dino.js syncG()');
    if(typeof window.pickEndQ!=='function') bad.push('dino-q-end.js : not loaded');
    if(W2.SECRETS.length!==5) bad.push('W2.SECRETS : '+W2.SECRETS.length+' (expected 5)');
    W2.SECRETS.forEach(k=>{ if(!COPY.secretLines[k]) bad.push('COPY.secretLines.'+k+' : missing'); });
    console.log(bad.length?'%c'+bad.length+' problem(s)':'%cALL GREEN',
      'color:'+(bad.length?'#e84545':'#4ecb71')+';font-weight:700');
    bad.forEach(b=>console.log(' · '+b));
    return !bad.length;
  },
  secrets(){
    const a=A();
    console.table(W2.SECRETS.map(k=>({seam:k,name:COPY.secretNames[k],found:!!a['s_'+k],how:COPY.secretHow[k]})));
    return W2.foundCount()+'/5';
  },
  secret(k){ return W2.findSecret(k); },
  unfind(k){ if(!k) return 'AUTHOR.unfind(key)'; W2.unmarkA('s_'+k); W2.renderSerifs(); return W2.foundCount()+'/5'; },
  crack(){ const r=W2.crack(); W2.renderSerifs(); this.stage(); return r; },
  /* losing at WORLD END seals it for 24h — these two are the way back in */
  unlockEnd(){ return W2.unlockEnd(); },
  endLock(){ return W2.endLocked()? ('WORLD END sealed · '+W2.endLockText()+' left') : 'WORLD END is open'; },
  break(worse){ return breakSequence(!!worse).then(unbreak); },
  unbreak,
  script(id,o){ return play(ALIAS[id]||id,o||{}); },
  gate(){
    if(!A().completed||W2.foundCount()<5) return 'needs world 5 completed + all five seams (AUTHOR.secret(k))';
    W2.unmarkA('gateSeen'); openGate();
    return GATE_PENDING?'queued — open the map':'playing';
  },
  letter(){ window.dispatchEvent(new CustomEvent('w2:weird',{detail:{text:'console'}})); },
  weird(){ this.letter(); },
  reask(w){ window.dispatchEvent(new CustomEvent('w2:reask',{detail:{which:w||'gate'}})); },
  codex(){ openCodex(); },
  map(){ W2.repairMap(); return 'slides '+W2.slides(); },
  worlds(){
    const o={}; STAGES.forEach((s,si)=>{ if(si>=25)(o[s.world]=o[s.world]||[]).push('si'+si+' '+s.name); });
    console.log(o); return W2.maxWorldUnlocked();
  },
  laws(){
    console.log('live now:',W2.activeLaws());
    console.table(Object.keys(W2.WORLD_LAWS).map(w=>Object.assign({world:w,law:W2.LAW_NAME[w]},W2.WORLD_LAWS[w])));
  },
  roster(si){
    const s=STAGES[si]; if(!s) return 'no stage';
    console.table(s.levels.map(l=>({lv:l.lv,enemy:l.sub,boss:!!l.boss})));
    return s.name+' · world '+s.world+' · '+(s.elem||'?');
  },
  budget(){ const b=W2.budget(); console.log(b); return b.cap===Infinity?'no cap (worlds 1-5)':b.spent+'/'+b.cap; },
  sealed(){ const g=GG(); return (g&&g._sealedThisBattle)||'nothing sealed'; },
  pages(n){ const g=GG(); if(!g) return 0; g._pages=Math.max(0,n|0); W2.renderPageHUD(); return g._pages; },
  strikes(n){ const g=GG(); if(!g) return 0; g._strikes=Math.max(0,n|0); W2.renderPageHUD(); return g._strikes; },
  page(ok){ return W2.judgePage(ok!==false,'hard',0.9); },
  give(t,n){
    const g=GG(); if(!g||!g.inv) return 'no run';
    if(!PU[t]) return 'unknown power-up: '+t;
    g.inv[t]=(g.inv[t]||0)+(n||1);
    if(Array.isArray(g.loadout)&&!g.loadout.includes(t)) g.loadout.push(t);
    if(typeof renderInventory==='function') renderInventory();
    return g.inv[t];
  },
  flags(){ console.table(A()); return A(); },
  goto(si,li){
    li=li|0;
    if(typeof STAGES==='undefined'||!STAGES[si]) return 'no stage '+si;
    if(STAGES[si].world>W2.maxWorldUnlocked()) return 'world '+STAGES[si].world+' is not open yet — AUTHOR.crack() first';
    if(!(GG()&&G.diff)){
      if(typeof freshState!=='function') return 'freshState missing';
      G=freshState('medium'); if(typeof syncG==='function') syncG();
      G.pickDone=true;
      G.loadout=Object.keys(PU).filter(t=>t!=='revive');
      G.loadout.forEach(t=>{ G.inv[t]=3; });
    }
    ensureQUsed();
    for(let i=0;i<si;i++) G.levelsCleared[i]=5;
    G.levelsCleared[si]=li;
    G.curStage=si; G.curLevel=li; G.viewOnly=false; G.inBattle=false; G.animLock=false;
    if(typeof computeProgressStats==='function') Object.assign(G,computeProgressStats(si,li));
    if(typeof capPlayerStats==='function') capPlayerStats();
    G.playerHP=G.playerMaxHP;
    enterLevel(si,li);
    return 'S'+(si+1)+'-L'+(li+1)+' · '+STAGES[si].levels[li].sub;
  },
  end(){ return this.goto(50,4); },
  seed(){
    W2.SECRETS.forEach(k=>W2.markA('s_'+k));
    /* `endRevealed` was missing from this list, and it is the ONLY flag
       W2.maxWorldUnlocked() reads to return 11. Without it the seeded run
       tops out at world 10: registerWorlds() never builds the world-11 slide
       (the map ends at 50 nodes, so THE UNWRITTEN has nothing to tap), and
       loadLevel's world gate bounces any attempt straight back to the map
       with "— locked." So the seed parked you one stage short of the ending
       and gave you no way to reach it. W2.crack() has always set this. */
    ['completed','gateSeen','gateOpen','tenDone','endRevealed'].forEach(k=>W2.markA(k));
    /* losing at WORLD END seals it for 24h. A debug seed that lands you on a
       sealed door is the same dead end by another route. */
    if(W2.unlockEnd) W2.unlockEnd();
    W2.registerWorlds();
    if(!W2.beginBeyond()) return 'could not start a run past the margin';
    for(let si=25;si<=49;si++) G.levelsCleared[si]=5;
    G.curStage=49; G.curLevel=4;

    /* seed() used to stop here, and that made it lie about where it put you.
       beginBeyond() had already set the stats for arriving at stage 25 —
       computeProgressStats(25,0) — and marking twenty-five more stages cleared
       does not recompute anything on its own. So you were parked at World 10's
       boss carrying World 6 entry stats: 5,742 ATK against the 1,047,665 a real
       run holds there (0.5%), 30,084 HP against 6,458,839, stagesCleared stuck
       at 25 so attrSlots() gave 3 instead of 4, and not one of the thirteen
       attributes those clears award. goto() has always done this correctly;
       seed() simply never followed it. */
    if(window.W2 && W2.syncCaps) W2.syncCaps();          // beyond caps first
    if(typeof grantBossAttr==='function')                 // then what the clears earn
      for(let si=0;si<=49;si++) grantBossAttr(si);
    if(typeof computeProgressStats==='function')          // then the stats they add up to
      Object.assign(G, computeProgressStats(49,4));
    if(typeof normalizeAttrs==='function') normalizeAttrs();
    if(typeof capPlayerStats==='function') capPlayerStats();
    G.playerHP=G.playerMaxHP;

    if(typeof saveGame==='function') saveGame();
    if(typeof buildMap==='function') buildMap();
    if(typeof goToWorld==='function') goToWorld(9);
    W2.renderSerifs();
    return 'seeded past the margin · parked at S50-L5, WORLD END open, THE UNWRITTEN tappable — '+
           'AUTHOR.letter() still replays the scene that normally opens it';
  },
  reset(){ W2.reset(); unbreak(); GATE_PENDING=false; W2.renderSerifs(); return 'author flags cleared (your run save is untouched)'; },
  help(){
    console.log('%cAUTHOR v'+VER,'font-weight:700;color:#ffcf6b');
    console.log([
      'verify()        every wrapper attached, 26 new stages wired, caps, G, END bank',
      'patches()       raw wrap results · stage() full flag table + what sets each flag',
      'secrets()       the five seams: found / how · secret(k) force one · unfind(k) clear one',
      'gate()          replay THE BREAK + s1 (needs world 5 + five seams)',
      'letter()        the letter back without typing it · reask("gate"|"end")',
      'script(id)      d1-d5 or s0-s4 · script("s1",{anim:true}) · break(worse) alone',
      'codex()         open the codex · AUTHOR.LORE is the data',
      'goto(si,li)     jump into a stage · end() = WORLD END L5',
      'crack()         open every gate + training stats · seed() park a real run at world 10',
      'worlds() laws() roster(si) budget() sealed() give(type,n)',
      'pages(n) strikes(n) page(true|false)   the Unbroken Page',
      'endLock() unlockEnd()  WORLD END seals for 24h when it ends you',
      'flags() reset()'].join('\n'));
  },
};
window.AUTHOR=AU;

/* ── boot ── */
W2.renderSerifs();
console.log('[author] v'+VER+' ready — AUTHOR.help()');
})();
