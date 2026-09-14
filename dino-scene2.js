/* ══════════════════════════════════════════════════════════════
   DINO-SCENE2.JS — battle backgrounds for STAGES[] 25 … 50
   (Worlds 6-10 + WORLD END)

   LOAD ORDER:  dino-scenes.js  →  dino-scene2.js  →  dino.js
   It WRAPS window.SceneFX.render. si<25 falls through to the
   original file untouched. No dino.js / dino.css edits needed.

   Tune anything live from the console: window.SceneFX2.SCENES
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

if(!window.SceneFX||typeof window.SceneFX.render!=='function'){
  console.warn('[dino-scene2] dino-scenes.js not found yet — load this file AFTER it.');
}

const OFFSET = 25;                                  // first si this file owns
const TAU    = Math.PI*2;
const R      = (a,b)=>a+Math.random()*(b-a);
const RM     = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ───────────────────────── SCENE TABLE ─────────────────────────
   si = OFFSET + array position.  Every field is optional except
   sky / far / mid / ground / live.
   ─────────────────────────────────────────────────────────────── */
const SCENES2=[

/* ══ WORLD 6 · THE RIFT OF UNMAKING (si 25-29) · law VI THE FRAYING — reality is coming unstitched ══ */
{ name:'RIFT OF UNMAKING', world:6, live:'fray',
  sky:['#1a1418','#33262e'], far:'#241a20', mid:'#2e2028', ground:['#241a20','#0a0608'],
  horizon:'rgba(224,111,160,.12)',
  body:{type:'spool',x:.74,y:.18,r:15,color:'#e0c8d4',glow:'rgba(224,200,212,.22)'},
  terrain:'hills',
  particle:{type:'lint',count:14,color:'#e8d4dc'},
  cloud:{count:3,color:'rgba(60,40,52,.30)'},
  prop:{type:'spool2',count:9,tip:'fray',sway:7,hMin:26,hMax:64,thick:1.1},
  tone:{line:'#6a4c5c',tip:'#e06fa0'} },

{ name:'THE PALE ARCHIVE', world:6, live:'fray',
  sky:['#141018','#2a2036'], far:'#1e1828', mid:'#261e32', ground:['#1c1626','#080508'],
  horizon:'rgba(163,125,224,.12)',
  body:{type:'moon',x:.26,y:.15,r:13,color:'#d8cce8',glow:'rgba(216,204,232,.22)'},
  terrain:'grid',
  particle:{type:'lint',count:16,color:'#cbb6e0'},
  cloud:{count:2,color:'rgba(48,36,64,.30)'},
  prop:{type:'shelf',count:7,shape:'slab',spread:'even',hMin:28,hMax:58,wMin:9,wMax:16},
  tone:{a:'#2c2038',b:'#6a5480',line:'#a37de0'} },

{ name:'GRAVITY GARDEN', world:6, live:'fray',
  sky:['#101418','#22303a'], far:'#182028', mid:'#1e2830', ground:['#1a2228','#06090b'],
  horizon:'rgba(63,198,224,.14)',
  body:{type:'rift',x:.5,y:.19,r:16,color:'#7fe0d8',glow:'rgba(127,224,216,.26)'},
  terrain:'flats',
  particle:{type:'lint',count:12,color:'#bfe8e4'},
  prop:{type:'sidegarden',count:1,stitch:16},
  tone:{line:'#3dbfb0',glow:'rgba(61,191,176,.35)'} },

{ name:'MIRRORFALL', world:6, live:'fray',
  sky:['#1c1006','#3a2210'], far:'#281808', mid:'#32200c', ground:['#241606','#0a0502'],
  horizon:'rgba(232,161,58,.16)',
  body:{type:'grideye',x:.5,y:.16,r:19,color:'#e8c458',glow:'rgba(232,196,88,.32)'},
  terrain:'hills',
  particle:{type:'lint',count:14,color:'#e8d09a'},
  prop:{type:'mirror2',count:5,grounded:true,warp:true,hMin:40,hMax:74,wMin:22,wMax:34},
  tone:{a:'#3a2612',b:'#8a6a3a',line:'#e8c458'} },

{ name:'LOOM OF FATE', world:6, live:'fray', boss:true,
  sky:['#160a12','#3a1024'], far:'#220e18', mid:'#2c1220', ground:['#1c0a14','#070204'],
  horizon:'rgba(224,95,208,.18)',
  body:{type:'eye',x:.5,y:.16,r:16,color:'#e05fd0',glow:'rgba(224,95,208,.38)'},
  terrain:'chasm',
  particle:{type:'lint',count:18,color:'#f0b8e8'},
  prop:{type:'threads',count:3,cx:.5,cy:.36,r:52},
  tone:{line:'#e05fd0',glow:'rgba(224,95,208,.30)'},
  post:'glitch' },

/* ══ WORLD 7 · THE SILENT CHOIR (si 30-34) · law VII THE SILENCE — memory erodes to powder ══ */
{ name:'WHISPER BASIN', world:7, live:'dust',
  sky:['#181410','#332c22'], far:'#241e18', mid:'#2c251c', ground:['#221c14','#080604'],
  horizon:'rgba(232,196,88,.10)',
  body:{type:'ashsun',x:.7,y:.2,r:17,color:'#d8c8a0',glow:'rgba(216,200,160,.22)'},
  terrain:'sea',
  particle:{type:'ash',count:20,color:'#cfc4ae'},
  cloud:{count:3,color:'rgba(70,60,46,.28)'},
  prop:{type:'bell',count:6,spread:'even',rows:4,hMin:34,hMax:56,wMin:26,wMax:40},
  tone:{a:'#2e2618',b:'#5c4c34',line:'#8a7a58'} },

{ name:'CHOIR OF ASH', world:7, live:'dust',
  sky:['#14161a','#2c3138'], far:'#1e2228', mid:'#242930', ground:['#1e2126','#070809'],
  horizon:'rgba(138,138,160,.12)',
  body:{type:'moon',x:.24,y:.14,r:14,color:'#c8cede',glow:'rgba(200,206,222,.20)'},
  terrain:'hills',
  particle:{type:'ash',count:22,color:'#b8bfcc'},
  cloud:{count:3,color:'rgba(56,62,72,.26)'},
  prop:{type:'stall',count:9,shape:'slab',tilt:true,hMin:18,hMax:38,wMin:8,wMax:14},
  tone:{a:'#2a2e36',b:'#6a7284',line:'#8a92a4'} },

{ name:'SILENT CATHEDRAL', world:7, live:'dust',
  sky:['#101a1c','#264046'], far:'#182e33', mid:'#1e363c', ground:['#1a2c30','#060c0d'],
  horizon:'rgba(61,191,176,.14)',
  body:{type:'ashsun',x:.5,y:.17,r:15,color:'#e0f0ee',glow:'rgba(224,240,238,.24)'},
  terrain:'grid',
  particle:{type:'ash',count:18,color:'#dcefec'},
  prop:{type:'nave',count:8,shape:'pillar',spread:'even',hMin:40,hMax:78,wMin:10,wMax:18},
  tone:{a:'#e6f2f0',b:'#7aa8a4',line:'#bfe0dc'} },

{ name:'RESONANT DEEP', world:7, live:'dust',
  sky:['#0e0c14','#221c30'], far:'#181428', ground:['#161222','#050308'], mid:'#1c1728',
  horizon:'rgba(163,125,224,.12)',
  body:{type:'rift',x:.5,y:.2,r:15,color:'#a37de0',glow:'rgba(163,125,224,.28)'},
  terrain:'chasm',
  particle:{type:'ash',count:20,color:'#b9a8d4'},
  prop:{type:'fork',count:5,spread:'even',rows:3,hMin:20,hMax:34,wMin:30,wMax:44},
  tone:{a:'#241c34',b:'#5a4a78',line:'#a37de0'} },

{ name:'THE HOLLOW HYMN', world:7, live:'dust', boss:true,
  sky:['#0c0a0a','#2a1c18'], far:'#1a1210', mid:'#221814', ground:['#181110','#040302'],
  horizon:'rgba(232,161,58,.16)',
  body:{type:'singularity',x:.5,y:.16,r:16,color:'#e8a13a',glow:'rgba(232,161,58,.36)'},
  terrain:'flats',
  particle:{type:'ash',count:24,color:'#e0c896'},
  prop:{type:'hymnboard',count:7,tip:'bell',sway:9,hMin:30,hMax:70,thick:1.4},
  tone:{line:'#6a5238',tip:'#e8c458'},
  post:'glitch' },

/* ══ WORLD 8 · THE LAW MACHINE (si 35-39) · law VIII THE LETTER — the axioms defend themselves ══ */
{ name:'CLOCKWORK MARCH', world:8, live:'grid',
  sky:['#04100e','#0a2420'], far:'#071a17', mid:'#09201c', ground:['#061613','#010504'],
  horizon:'rgba(79,191,122,.16)',
  body:{type:'grideye',x:.5,y:.18,r:14,color:'#5fff9a',glow:'rgba(95,255,154,.28)'},
  terrain:'grid',
  particle:{type:'bit',count:18,color:'#5fff9a'},
  prop:{type:'escapement',count:7,shape:'pylon',spread:'even',hMin:30,hMax:62,wMin:8,wMax:14},
  tone:{a:'#0a2a22',b:'#1e5a48',line:'#5fff9a',glow:'rgba(95,255,154,.30)'} },

{ name:'THE LAW ENGINE', world:8, live:'grid',
  sky:['#050c18','#0e2040'], far:'#0a1830', mid:'#0c1c38', ground:['#08142a','#020408'],
  horizon:'rgba(91,143,224,.16)',
  body:{type:'spool',x:.5,y:.19,r:16,color:'#5b8fe0',glow:'rgba(91,143,224,.30)'},
  terrain:'grid',
  particle:{type:'bit',count:22,color:'#8ab4f0'},
  prop:{type:'scales',count:6,grounded:false,hMin:22,hMax:44,wMin:26,wMax:48},
  tone:{a:'#0e1e3c',b:'#2c4a80',line:'#5b8fe0',glow:'rgba(91,143,224,.28)'} },

{ name:'RUST CATHEDRAL', world:8, live:'grid',
  sky:['#0a0a10','#1a1a2a'], far:'#121220', mid:'#161626', ground:['#101018','#030304'],
  horizon:'rgba(200,208,232,.10)',
  body:{type:'singularity',x:.5,y:.32,r:14,color:'#e8ecf8',glow:'rgba(232,236,248,.22)'},
  terrain:'hills',
  particle:{type:'bit',count:12,color:'#c8d0e8'},
  prop:{type:'rebar',count:9,sides:4,sizeMin:5,sizeMax:13},
  tone:{a:'#20222e',b:'#7a8298',line:'#c8d0e8'} },

{ name:'BINARY WASTES', world:8, live:'grid',
  sky:['#0e0818','#241040'], far:'#180c2a', mid:'#1e1034', ground:['#150a26','#040208'],
  horizon:'rgba(163,125,224,.16)',
  body:{type:'grideye',x:.5,y:.16,r:15,color:'#c8a0ff',glow:'rgba(200,160,255,.30)'},
  terrain:'chasm',
  particle:{type:'bit',count:20,color:'#c8a0ff'},
  prop:{type:'cards',count:5,grounded:false,rail:true,hMin:8,hMax:14,wMin:34,wMax:66},
  tone:{a:'#1e1236',b:'#4a2e7a',line:'#a37de0',glow:'rgba(163,125,224,.26)'} },

{ name:'THE FIRST AXIOM', world:8, live:'grid', boss:true,
  sky:['#020604','#06180e'], far:'#04100a', mid:'#05140c', ground:['#030c08','#000201'],
  horizon:'rgba(95,255,154,.18)',
  body:{type:'moon',x:.5,y:.15,r:17,color:'#5fff9a',glow:'rgba(95,255,154,.40)'},
  terrain:'flats',
  particle:{type:'bit',count:26,color:'#8fffc0'},
  prop:{type:'proof',count:2,cx:.5,cy:.34,r:56,square:true},
  tone:{line:'#5fff9a',glow:'rgba(95,255,154,.32)'},
  post:'scan' },

/* ══ WORLD 9 · THE DROWNED THRONE (si 40-44) · law IX THE PRESSURE — everything sinks ══ */
{ name:'SUNKEN THRONE', world:9, live:'pressure',
  sky:['#04141e','#0c3244'], far:'#082634', ground:['#06202c','#01070a'], mid:'#0a2c3a',
  horizon:'rgba(63,198,224,.14)',
  body:{type:'deeporb',x:.5,y:.13,r:15,color:'#8fe0f0',glow:'rgba(143,224,240,.26)'},
  terrain:'sea',
  particle:{type:'silt',count:18,color:'#9fd8e8'},
  prop:{type:'siltthrone',count:10,tip:'leaf',sway:6,hMin:34,hMax:78,thick:1.6},
  tone:{line:'#1e6a5a',tip:'#3dbfb0'} },

{ name:'LEVIATHAN TRENCH', world:9, live:'pressure',
  sky:['#040e1a','#0a2440'], far:'#071830', ground:['#051428','#010306'], mid:'#081c36',
  horizon:'rgba(91,143,224,.14)',
  body:{type:'eye',x:.28,y:.15,r:13,color:'#bcd8ff',glow:'rgba(188,216,255,.24)'},
  terrain:'chasm',
  particle:{type:'silt',count:20,color:'#a8c4e8'},
  prop:{type:'ribcage',count:5,grounded:true,arch:true,spread:'even',hMin:54,hMax:88,wMin:26,wMax:38},
  tone:{a:'#0c1e3a',b:'#2a4a7a',line:'#5b8fe0'} },

{ name:'GLACIER TOMB', world:9, live:'pressure',
  sky:['#020a10','#061c28'], far:'#04141e', ground:['#031018','#000203'], mid:'#051620',
  horizon:'rgba(61,191,176,.12)',
  body:{type:'rift',x:.5,y:.1,r:14,color:'#5fe8c8',glow:'rgba(95,232,200,.26)'},
  terrain:'hills',
  particle:{type:'silt',count:22,color:'#7fd9c8'},
  prop:{type:'icecore',count:11,shape:'slab',tilt:true,hMin:14,hMax:34,wMin:10,wMax:18},
  tone:{a:'#0a1c22',b:'#2a5a58',line:'#5fe8c8'} },

{ name:'THE BRINE COURT', world:9, live:'pressure',
  sky:['#0a0614','#1e0e34'], far:'#140a24', ground:['#110820','#030106'], mid:'#170c2a',
  horizon:'rgba(224,111,160,.14)',
  body:{type:'deeporb',x:.5,y:.16,r:16,color:'#e0a0c8',glow:'rgba(224,160,200,.28)'},
  terrain:'sea',
  particle:{type:'silt',count:20,color:'#d0a8d8'},
  prop:{type:'gallery',count:1,cx:.5,scale:1},
  tone:{a:'#1c1030',b:'#5a2e58',line:'#e06fa0',glow:'rgba(224,111,160,.26)'} },

{ name:'DROWNED SOVEREIGN', world:9, live:'pressure', boss:true,
  sky:['#02060c','#0a1c30'], far:'#061224', ground:['#040e1c','#000102'], mid:'#07142a',
  horizon:'rgba(232,196,88,.16)',
  body:{type:'dyingsun',x:.5,y:.14,r:17,color:'#e8c458',glow:'rgba(232,196,88,.36)'},
  terrain:'flats',
  particle:{type:'silt',count:24,color:'#e8d89a'},
  prop:{type:'crown',count:1,cx:.5,scale:1.35,crown:true},
  tone:{a:'#0e1a30',b:'#6a5a2a',line:'#e8c458',glow:'rgba(232,196,88,.30)'},
  post:'glitch' },

/* ══ WORLD 10 · THE LAST LIGHT (si 45-49) · law X THE EROSION — heat death, last light ══ */
{ name:'DYING STAR', world:10, live:'ember',
  sky:['#1c0c04','#3e1c08'], far:'#2a1206', mid:'#341808', ground:['#260f04','#0a0401'],
  horizon:'rgba(224,131,79,.18)',
  body:{type:'dyingsun',x:.72,y:.2,r:21,color:'#ff9a4a',glow:'rgba(255,140,60,.32)'},
  terrain:'hills',
  particle:{type:'ember',count:18,color:'#ffb877'},
  cloud:{count:2,color:'rgba(90,36,12,.30)'},
  prop:{type:'obelisk',count:8,shape:'slab',spread:'even',hMin:22,hMax:46,wMin:14,wMax:26},
  tone:{a:'#2a1408',b:'#7a3c14',line:'#e0834f'} },

{ name:'ENTROPY FIELDS', world:10, live:'ember',
  sky:['#160404','#38100a'], far:'#220806', mid:'#2a0c08', ground:['#1e0604','#060101'],
  horizon:'rgba(224,85,95,.20)',
  body:{type:'rift',x:.5,y:.17,r:19,color:'#ff6a4a',glow:'rgba(255,90,60,.34)'},
  terrain:'flats',
  particle:{type:'ember',count:24,color:'#ff9a6a'},
  prop:{type:'drain',count:8,tip:'ember',sway:5,hMin:24,hMax:58,thick:1.2},
  tone:{line:'#5a1c12',tip:'#ff7a3a'},
  overlay:{type:'flow',a:'#ffb347',b:'#ff5a1e',c:'#6a1000',vein:'rgba(255,220,140,.5)'} },

{ name:'THE FINAL DAWN', world:10, live:'ember',
  sky:['#0a0a0e','#1e1c24'], far:'#141218', ground:['#121016','#030304'], mid:'#181620',
  horizon:'rgba(138,138,160,.12)',
  body:{type:'ashsun',x:.5,y:.2,r:16,color:'#8a7a72',glow:'rgba(138,122,114,.20)'},
  terrain:'sea',
  particle:{type:'ember',count:10,color:'#a08a7a'},
  prop:{type:'arch',count:1,wMin:40,wMax:52,hMin:40,hMax:60,cold:true},
  tone:{line:'#4a4450',glow:'rgba(120,116,132,.25)'} },

{ name:'COLLAPSE HORIZON', world:10, live:'ember',
  sky:['#0e0206','#2e040e'], far:'#1c030a', mid:'#22040c', ground:['#180208','#040001'],
  horizon:'rgba(224,85,95,.20)',
  body:{type:'grideye',x:.5,y:.15,r:16,color:'#ff3a4a',glow:'rgba(255,58,74,.36)'},
  terrain:'chasm',
  particle:{type:'ember',count:20,color:'#ff7a8a'},
  prop:{type:'maw',count:5,rMin:10,rMax:24},
  tone:{a:'#2a060e',b:'#7a1424',line:'#e0555f'} },

{ name:'OMEGA POINT', world:10, live:'ember', boss:true,
  sky:['#060000','#280004'], far:'#160002', mid:'#1c0003', ground:['#100001','#020000'],
  horizon:'rgba(255,58,58,.20)',
  body:{type:'eye',x:.5,y:.15,r:18,color:'#ff2a2a',glow:'rgba(255,32,32,.42)'},
  terrain:'grid',
  particle:{type:'ember',count:26,color:'#ff6a5a'},
  prop:{type:'point',count:4,cx:.5,cy:.34,r:60},
  tone:{line:'#ff2a2a',glow:'rgba(255,42,42,.30)'},
  overlay:{type:'flow',a:'#ff8a47',b:'#e01e1e',c:'#4a0000',vein:'rgba(255,190,140,.45)'},
  post:'glitch' },

/* ══ WORLD END · si 50 — THE UNWRITTEN, fought in THE WRITING ROOM ══ */
{ name:'THE UNWRITTEN', world:11, live:'room', boss:true,
  sky:['#050406','#0e0b10'], far:'#0a080c', mid:'#0c0a0e', ground:['#08070a','#000000'],
  horizon:'rgba(232,196,88,.10)',
  body:{type:'candle',x:.5,y:.44,r:9,color:'#ffe8a0',glow:'rgba(255,232,160,.30)'},
  terrain:'room',
  particle:{type:'page',count:12,color:'#efe6d2'},
  prop:{type:'desk',count:1,cx:.5},
  tone:{a:'#18130f',b:'#3a2c20',line:'#8a7458',glow:'rgba(255,232,160,.22)'},
  post:'crack' },
];

/* ───────────────────── per-canvas scene state ───────────────────── */
const SLOTS={};
function getSlot(id){
  return SLOTS[id] || (SLOTS[id]={si:-1,t:0,p:[],cl:[],props:[],amb:[],cracks:[],L:null});
}

function initSlot(S,cfg,w,h){
  S.t=0;
  const gy=h*.72;

  S.p=[];
  if(cfg.particle) for(let i=0;i<cfg.particle.count;i++)
    S.p.push({x:R(0,w),y:R(0,h*.72),r:R(.5,2),sp:R(.08,.55),ph:R(0,TAU),rot:R(0,TAU)});

  S.cl=[];
  if(cfg.cloud) for(let i=0;i<cfg.cloud.count;i++)
    S.cl.push({x:R(0,w),y:h*(.06+R(0,.30)),w:R(70,180),hh:R(12,26),sp:R(.05,.20)});

  S.props=[];
  const P=cfg.prop||{}, n=P.count||0;
  for(let i=0;i<n;i++) S.props.push({
    x: P.spread==='even' ? (i+.5)*(w/n)+R(-9,9) : R(w*.04,w*.96),
    y: R(h*.16,h*.60),
    baseY: gy+R(-4,14),
    h: R(P.hMin||24,P.hMax||60),
    w: R(P.wMin||10,P.wMax||26),
    rot:R(0,TAU), rs:R(-.010,.010),
    ph: R(0,TAU), tilt:(P.tilt?R(-.20,.20):R(-.05,.05)),
    hue:R(0,360)
  });

  S.amb=[];
  for(let i=0;i<8;i++) S.amb.push({x:R(0,w),y:R(0,h),r:R(.7,1.7),sp:R(.04,.14),ph:R(0,TAU)});

  S.cracks=[];
  if(cfg.post==='crack') for(let i=0;i<4;i++){
    const pts=[]; let cx=R(0,w),cy=0; pts.push([cx,cy]);
    for(let s=0;s<6;s++){cx+=R(-55,55);cy+=h/6;pts.push([cx,cy]);}
    S.cracks.push(pts);
  }

  S.L = buildLive(cfg.live,w,h);
}

/* ══════════════════════════════════════════════════════════════
   LIVE BACKGROUND SYSTEM  ← the priority layer
   One store per world-law. Built once per (canvas, stage).
   Drawn AFTER sky/body and AGAIN (thin pass) after terrain, so
   the world feels like it is happening *around* the fighters.
   ══════════════════════════════════════════════════════════════ */
function buildLive(kind,w,h){
  switch(kind){
    case 'fray': return {
      kind, threads:Array.from({length:12},()=>({x:R(0,w),len:R(h*.25,h*.75),ph:R(0,TAU),amp:R(4,13),sp:R(.008,.020),unw:R(0,1)})),
      stitch:Array.from({length:14},()=>({x:R(0,w),y:R(h*.10,h*.66),ph:R(0,TAU),len:R(6,16)}))
    };
    case 'dust': return {
      kind, motes:Array.from({length:34},()=>({x:R(0,w),y:R(0,h),r:R(.5,1.9),sp:R(.05,.28),dx:R(-.14,.14),ph:R(0,TAU)})),
      flakes:Array.from({length:12},()=>({x:R(0,w),y:R(-h,h),rot:R(0,TAU),rs:R(-.03,.03),sp:R(.18,.5),s:R(3,7)}))
    };
    case 'grid': return {
      kind, scan:0,
      nodes:Array.from({length:16},()=>({x:R(0,w),y:R(h*.08,h*.66),ph:R(0,TAU),r:R(1.2,2.6)})),
      links:[]
    };
    case 'pressure': return {
      kind, silt:Array.from({length:30},()=>({x:R(0,w),y:R(0,h),r:R(.5,1.8),sp:R(.10,.34),ph:R(0,TAU)})),
      rings:Array.from({length:3},(_,i)=>({ph:i*2.1,sp:R(.006,.012)})),
      caustic:Array.from({length:4},(_,i)=>({y:h*(.10+i*.13),ph:R(0,TAU)}))
    };
    case 'ember': return {
      kind, emb:Array.from({length:30},()=>({x:R(0,w),y:R(0,h),r:R(.6,2.2),sp:R(.25,.85),ph:R(0,TAU),dx:R(-.2,.2)})),
      waver:0
    };
    case 'room': return {
      kind, pages:Array.from({length:16},()=>({x:R(0,w),y:R(0,h),r:R(.7,1.8),sp:R(.03,.14),ph:R(0,TAU)})),
      flick:0
    };
    default: return {kind:'none'};
  }
}

function drawLive(ctx,w,h,cfg,S,li,pass){
  const L=S.L; if(!L||L.kind==='none')return;
  const t=S.t, boost=1+li*0.10;                    // deeper sub-level = angrier world
  const A=RM?0.35:1;                               // reduced-motion: keep it, calm it

  if(L.kind==='fray'){
    if(pass===0){
      ctx.save();
      L.threads.forEach(th=>{
        const unrav=Math.min(1,(0.25+li*0.16)*th.unw+0.10);
        ctx.strokeStyle=`rgba(224,111,160,${(.10+.10*Math.sin(t*.02+th.ph))*A})`;
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(th.x,0);
        for(let y=0;y<=th.len;y+=10){
          const k=y/th.len;
          ctx.lineTo(th.x+Math.sin(t*th.sp+th.ph+y*.03)*th.amp*(0.3+k)*boost, y);
        }
        ctx.stroke();
        const ey=th.len, ex=th.x+Math.sin(t*th.sp+th.ph+ey*.03)*th.amp*1.3*boost;
        ctx.strokeStyle=`rgba(240,180,215,${.22*unrav*A})`;
        for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex+k*4,ey+10+Math.abs(k)*3);ctx.stroke();}
      });
      ctx.restore();
    }else{
      ctx.save();
      L.stitch.forEach(s=>{
        const a=(.10+.12*Math.sin(t*.03+s.ph))*A;
        ctx.strokeStyle=`rgba(255,220,240,${a})`; ctx.lineWidth=1;
        ctx.setLineDash([3,4]); ctx.beginPath();
        ctx.moveTo(s.x-s.len,s.y); ctx.lineTo(s.x+s.len,s.y); ctx.stroke();
        ctx.setLineDash([]);
      });
      ctx.restore();
    }
    return;
  }

  if(L.kind==='dust'){
    if(pass===0){
      L.motes.forEach(m=>{
        m.y+=m.sp*boost; m.x+=m.dx; if(m.y>h)m.y=-3; if(m.x<-3)m.x=w+3; if(m.x>w+3)m.x=-3;
        ctx.fillStyle=`rgba(214,206,188,${(.10+.10*Math.sin(t*.02+m.ph))*A})`;
        ctx.beginPath(); ctx.arc(m.x,m.y,m.r,0,TAU); ctx.fill();
      });
    }else{
      L.flakes.forEach(f=>{
        f.y+=f.sp*boost; f.rot+=f.rs; if(f.y>h+10){f.y=-10;f.x=R(0,w);}
        ctx.save(); ctx.translate(f.x,f.y); ctx.rotate(f.rot);
        ctx.fillStyle=`rgba(236,228,208,${.16*A})`; ctx.fillRect(-f.s/2,-f.s/2,f.s,f.s*.72);
        ctx.strokeStyle=`rgba(120,110,92,${.22*A})`; ctx.lineWidth=.5;
        ctx.beginPath(); ctx.moveTo(-f.s*.3,-1); ctx.lineTo(f.s*.3,-1);
        ctx.moveTo(-f.s*.3,1.6); ctx.lineTo(f.s*.2,1.6); ctx.stroke();
        ctx.restore();
      });
    }
    return;
  }

  if(L.kind==='grid'){
    if(pass===0){
      L.scan=(L.scan+0.9*boost)%(h*1.15);
      const g=ctx.createLinearGradient(0,L.scan-26,0,L.scan+26);
      g.addColorStop(0,'rgba(95,255,154,0)');
      g.addColorStop(.5,`rgba(95,255,154,${.10*A})`);
      g.addColorStop(1,'rgba(95,255,154,0)');
      ctx.fillStyle=g; ctx.fillRect(0,L.scan-26,w,52);
      ctx.strokeStyle=`rgba(95,255,154,${.05*A})`; ctx.lineWidth=1;
      for(let x=0;x<=w;x+=34){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h*.72);ctx.stroke();}
      for(let y=0;y<h*.72;y+=34){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    }else{
      ctx.strokeStyle=`rgba(150,255,200,${.10*A})`; ctx.lineWidth=.7;
      for(let i=0;i<L.nodes.length;i++){
        const a=L.nodes[i], b=L.nodes[(i+3)%L.nodes.length];
        if(Math.hypot(a.x-b.x,a.y-b.y)>w*.42)continue;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
      L.nodes.forEach(nd=>{
        const p=.35+.45*Math.sin(t*.04+nd.ph);
        ctx.fillStyle=`rgba(120,255,190,${p*.6*A})`;
        ctx.beginPath(); ctx.arc(nd.x,nd.y,nd.r,0,TAU); ctx.fill();
      });
    }
    return;
  }

  if(L.kind==='pressure'){
    if(pass===0){
      L.caustic.forEach((c,i)=>{
        ctx.strokeStyle=`rgba(180,235,255,${(.05+.04*Math.sin(t*.02+c.ph))*A})`;
        ctx.lineWidth=2+i*.5; ctx.beginPath();
        for(let x=0;x<=w;x+=8) ctx.lineTo(x,c.y+Math.sin(x*.03+t*.02+c.ph)*7+Math.sin(x*.07+t*.01)*3);
        ctx.stroke();
      });
      const hz=ctx.createLinearGradient(0,0,0,h);
      hz.addColorStop(0,'rgba(0,20,34,0)'); hz.addColorStop(1,`rgba(0,14,26,${.30*A})`);
      ctx.fillStyle=hz; ctx.fillRect(0,0,w,h);
    }else{
      L.silt.forEach(s=>{
        s.y+=s.sp*boost; if(s.y>h)s.y=-3;
        const sx=s.x+Math.sin(t*.012+s.ph)*5;
        ctx.fillStyle=`rgba(170,220,240,${.14*A})`;
        ctx.beginPath(); ctx.arc(sx,s.y,s.r,0,TAU); ctx.fill();
      });
      L.rings.forEach(rg=>{
        rg.ph+=rg.sp*boost; const k=(rg.ph%TAU)/TAU;
        ctx.strokeStyle=`rgba(120,220,230,${(1-k)*.12*A})`; ctx.lineWidth=1.4;
        ctx.beginPath(); ctx.ellipse(w*.5,h*.46,w*.10+k*w*.55,h*.03+k*h*.16,0,0,TAU); ctx.stroke();
      });
    }
    return;
  }

  if(L.kind==='ember'){
    if(pass===0){
      L.emb.forEach(e=>{
        e.y-=e.sp*boost; e.x+=e.dx; if(e.y<-4){e.y=h+4;e.x=R(0,w);}
        const a=(.30+.35*Math.sin(t*.05+e.ph))*A;
        ctx.fillStyle=`rgba(255,${150+Math.floor(60*Math.sin(e.ph))},90,${a})`;
        ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,TAU); ctx.fill();
      });
    }else{
      const pulse=.03+.03*Math.sin(t*.014);
      ctx.fillStyle=`rgba(255,90,40,${pulse*A})`; ctx.fillRect(0,0,w,h);
      ctx.fillStyle=`rgba(0,0,0,${(.04+.04*Math.sin(t*.009+2))*A})`; ctx.fillRect(0,0,w,h);
    }
    return;
  }

  if(L.kind==='room'){
    if(pass===0){
      const v=ctx.createRadialGradient(w*.5,h*.46,h*.06,w*.5,h*.46,h*.85);
      L.flick=.82+.18*Math.sin(t*.19)+.06*Math.sin(t*.71);
      v.addColorStop(0,`rgba(255,226,160,${.14*L.flick*A})`);
      v.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=v; ctx.fillRect(0,0,w,h);
    }else{
      L.pages.forEach(p=>{
        p.y-=p.sp*boost; if(p.y<-3)p.y=h+3;
        const px=p.x+Math.sin(t*.012+p.ph)*7;
        ctx.fillStyle=`rgba(240,232,212,${(.10+.12*Math.sin(t*.03+p.ph))*A})`;
        ctx.beginPath(); ctx.arc(px,p.y,p.r,0,TAU); ctx.fill();
      });
    }
    return;
  }
}

/* ───────────────────────── celestial bodies ───────────────────────── */
function drawBody(ctx,w,h,cfg,S){
  const B=cfg.body; if(!B)return;
  const t=S.t, bx=B.x*w, by=B.y*h, r=B.r;

  ctx.save(); ctx.globalAlpha=.38+.08*Math.sin(t*.01);
  const wash=ctx.createRadialGradient(bx,by,r*.5,bx,by,w*.62);
  wash.addColorStop(0,B.glow); wash.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=wash; ctx.fillRect(0,0,w,h*.78); ctx.restore();

  const halo=ctx.createRadialGradient(bx,by,0,bx,by,r*2.3);
  halo.addColorStop(0,B.glow); halo.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=halo; ctx.beginPath(); ctx.arc(bx,by,r*2.3,0,TAU); ctx.fill();

  switch(B.type){
    case 'moon':
      ctx.fillStyle=B.color; ctx.beginPath(); ctx.arc(bx,by,r,0,TAU); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,.13)';
      ctx.beginPath(); ctx.arc(bx-r*.34,by-r*.2,r*.22,0,TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(bx+r*.3,by+r*.3,r*.15,0,TAU); ctx.fill();
      break;

    case 'spool': /* W6: a spool of world-thread, slowly unwinding */
      ctx.save(); ctx.translate(bx,by); ctx.rotate(t*.006);
      ctx.fillStyle=B.color; ctx.fillRect(-r*.55,-r,r*1.1,r*2);
      ctx.fillStyle='rgba(0,0,0,.22)';
      for(let i=-3;i<=3;i++) ctx.fillRect(-r*.55,i*r*.28,r*1.1,1.6);
      ctx.fillStyle=B.color; ctx.fillRect(-r,-r*1.15,r*2,r*.22); ctx.fillRect(-r,r*.93,r*2,r*.22);
      ctx.restore();
      ctx.strokeStyle=B.glow; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(bx,by+r);
      for(let k=0;k<6;k++) ctx.lineTo(bx+Math.sin(t*.02+k)*(6+k*3), by+r+8+k*9);
      ctx.stroke();
      break;

    case 'ashsun': /* W7: a sun choked with ash */
      ctx.fillStyle=B.color; ctx.beginPath(); ctx.arc(bx,by,r,0,TAU); ctx.fill();
      ctx.strokeStyle='rgba(40,34,26,.5)'; ctx.lineWidth=2.4;
      for(let i=0;i<5;i++){
        ctx.beginPath();
        ctx.moveTo(bx-r,by-r*.6+i*r*.34+Math.sin(t*.02+i)*2);
        ctx.lineTo(bx+r,by-r*.6+i*r*.34+Math.sin(t*.02+i+1)*2);
        ctx.stroke();
      }
      break;

    case 'grideye': /* W8/W10: a scanning square iris */
      ctx.save(); ctx.translate(bx,by); ctx.rotate(Math.sin(t*.005)*.14);
      ctx.strokeStyle=B.color; ctx.lineWidth=2; ctx.strokeRect(-r,-r,r*2,r*2);
      ctx.strokeRect(-r*.6,-r*.6,r*1.2,r*1.2);
      const sy=((t*1.4)%(r*2))-r;
      ctx.strokeStyle=`rgba(255,255,255,${.35+.3*Math.sin(t*.06)})`;
      ctx.beginPath(); ctx.moveTo(-r,sy); ctx.lineTo(r,sy); ctx.stroke();
      ctx.fillStyle=B.color; ctx.globalAlpha=.75;
      ctx.fillRect(-r*.16,-r*.5,r*.32,r); ctx.globalAlpha=1;
      ctx.restore();
      break;

    case 'deeporb': /* W9: a light seen from far under water */
      { const g=ctx.createRadialGradient(bx,by,0,bx,by,r*1.5);
        g.addColorStop(0,'#ffffff'); g.addColorStop(.45,B.color); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(bx,by,r*1.5,0,TAU); ctx.fill();
        ctx.strokeStyle=B.glow; ctx.lineWidth=1;
        for(let i=0;i<3;i++){
          const k=((t*.6+i*40)%120)/120;
          ctx.globalAlpha=1-k;
          ctx.beginPath(); ctx.arc(bx,by,r+k*r*3,0,TAU); ctx.stroke();
        }
        ctx.globalAlpha=1; }
      break;

    case 'dyingsun':
      { const g=ctx.createRadialGradient(bx,by,r*.2,bx,by,r);
        g.addColorStop(0,'#fff2d8'); g.addColorStop(.6,B.color); g.addColorStop(1,'rgba(90,20,0,.85)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(bx,by,r,0,TAU); ctx.fill();
        ctx.fillStyle='rgba(20,6,4,.35)';
        for(let i=0;i<4;i++){
          const a=t*.004+i*1.7;
          ctx.beginPath(); ctx.arc(bx+Math.cos(a)*r*.45,by+Math.sin(a)*r*.45,r*.17,0,TAU); ctx.fill();
        } }
      break;

    case 'rift':
      ctx.save(); ctx.translate(bx,by); ctx.rotate(t*.006);
      ctx.strokeStyle=B.color; ctx.lineWidth=2; ctx.globalAlpha=.8;
      for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,r*(.5+i*.35),r*.22,i*.5,0,TAU);ctx.stroke();}
      ctx.restore(); ctx.globalAlpha=1;
      ctx.fillStyle='#04060a'; ctx.beginPath(); ctx.ellipse(bx,by,r*.4,r*.18,.3,0,TAU); ctx.fill();
      break;

    case 'eye':
      ctx.save(); ctx.strokeStyle=`rgba(255,255,255,${.10+.06*Math.sin(t*.02)})`; ctx.lineWidth=1;
      for(let i=0;i<6;i++){
        const a=(i/6)*TAU+.3;
        ctx.beginPath();
        ctx.moveTo(bx+Math.cos(a)*r*1.2,by+Math.sin(a)*r*1.2);
        ctx.lineTo(bx+Math.cos(a)*r*2.3,by+Math.sin(a)*r*2.3); ctx.stroke();
      }
      ctx.restore();
      { const iris=ctx.createRadialGradient(bx,by,0,bx,by,r);
        iris.addColorStop(0,'#120200'); iris.addColorStop(.7,B.color); iris.addColorStop(1,'#060100');
        ctx.fillStyle=iris; ctx.beginPath(); ctx.arc(bx,by,r,0,TAU); ctx.fill(); }
      ctx.fillStyle=B.color; ctx.globalAlpha=.8+.2*Math.abs(Math.sin(t*.05));
      ctx.beginPath(); ctx.ellipse(bx,by,r*.18,r*.85,0,0,TAU); ctx.fill(); ctx.globalAlpha=1;
      break;

    case 'singularity':
      ctx.save(); ctx.translate(bx,by); ctx.rotate(t*.01);
      for(let i=0;i<3;i++){
        ctx.strokeStyle=`rgba(232,236,248,${.28-i*.08})`; ctx.lineWidth=1;
        ctx.beginPath(); ctx.ellipse(0,0,r*(1.3+i*.5),r*.35,i*.6,0,TAU); ctx.stroke();
      }
      ctx.restore();
      ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(bx,by,r*.6,0,TAU); ctx.fill();
      ctx.strokeStyle='rgba(232,236,248,.45)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.arc(bx,by,r*.6,0,TAU); ctx.stroke();
      break;

    case 'candle': /* END: the only light source in the room */
      { const fl=.82+.18*Math.sin(t*.21)+.07*Math.sin(t*.77);
        ctx.fillStyle='#e8e0cc'; ctx.fillRect(bx-3,by,6,26);
        ctx.fillStyle='#8a7458'; ctx.fillRect(bx-6,by+24,12,3);
        const g=ctx.createRadialGradient(bx,by-6,0,bx,by-6,r*2.4);
        g.addColorStop(0,`rgba(255,244,200,${.95*fl})`);
        g.addColorStop(.35,`rgba(255,190,90,${.55*fl})`);
        g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(bx,by-6,r*2.4,0,TAU); ctx.fill();
        ctx.fillStyle=`rgba(255,248,222,${fl})`;
        ctx.beginPath(); ctx.ellipse(bx,by-7,2.6,6.5*fl,0,0,TAU); ctx.fill(); }
      break;
  }
}

/* ───────────────────────── sky / terrain ───────────────────────── */
function drawClouds(ctx,cfg,S,w){
  S.cl.forEach(c=>{
    c.x-=c.sp; if(c.x<-c.w)c.x=w+c.w;
    ctx.fillStyle=cfg.cloud.color;
    ctx.beginPath();
    ctx.ellipse(c.x,c.y,c.w*.5,c.hh,0,0,TAU);
    ctx.ellipse(c.x-c.w*.28,c.y+3,c.w*.32,c.hh*.75,0,0,TAU);
    ctx.ellipse(c.x+c.w*.28,c.y+2,c.w*.34,c.hh*.8,0,0,TAU);
    ctx.fill();
  });
}

function drawParticles(ctx,w,h,cfg,S){
  if(!cfg.particle)return;
  const t=S.t, ty=cfg.particle.type;
  ctx.save();
  S.p.forEach(p=>{
    if(ty==='lint'){
      const x=p.x+Math.sin(t*.014+p.ph)*11, y=(p.y+t*p.sp*.4)%(h*.72);
      ctx.strokeStyle=cfg.particle.color; ctx.globalAlpha=.16+.14*Math.sin(t*.03+p.ph);
      ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+3,y+4); ctx.stroke();
    }else if(ty==='ash'){
      const x=p.x+Math.sin(t*.010+p.ph)*9, y=(p.y+t*p.sp*.5)%(h*.72);
      ctx.globalAlpha=.20+.16*Math.sin(t*.02+p.ph); ctx.fillStyle=cfg.particle.color;
      ctx.beginPath(); ctx.arc(x,y,p.r,0,TAU); ctx.fill();
    }else if(ty==='bit'){
      const x=p.x, y=(p.y+t*p.sp*.7)%(h*.72);
      ctx.globalAlpha=.35+.4*Math.sin(t*.06+p.ph); ctx.fillStyle=cfg.particle.color;
      ctx.fillRect(x,y,p.r*1.6,p.r*1.6);
    }else if(ty==='silt'){
      const x=p.x+Math.sin(t*.008+p.ph)*6, y=(p.y+t*p.sp*.35)%(h*.72);
      ctx.globalAlpha=.16; ctx.fillStyle=cfg.particle.color;
      ctx.beginPath(); ctx.arc(x,y,p.r,0,TAU); ctx.fill();
    }else if(ty==='ember'){
      let y=(p.y-t*p.sp*.6)%(h*.72); if(y<0)y+=h*.72;
      const x=p.x+Math.sin(t*.02+p.ph)*8;
      ctx.globalAlpha=.35+.35*Math.sin(t*.05+p.ph); ctx.fillStyle=cfg.particle.color;
      ctx.beginPath(); ctx.arc(x,y,p.r,0,TAU); ctx.fill();
    }else if(ty==='page'){
      let y=(p.y-t*p.sp*.3)%(h*.86); if(y<0)y+=h*.86;
      const x=p.x+Math.sin(t*.011+p.ph)*10;
      ctx.save(); ctx.translate(x,y); ctx.rotate(p.rot+t*.004);
      ctx.globalAlpha=.18+.12*Math.sin(t*.03+p.ph); ctx.fillStyle=cfg.particle.color;
      ctx.fillRect(-2.5,-3.5,5,7); ctx.restore();
    }
  });
  ctx.restore(); ctx.globalAlpha=1;
}

function hillLayer(ctx,w,baseY,bottom,off,a1,a2,ph,fill,rim){
  ctx.beginPath(); ctx.moveTo(0,baseY);
  for(let x=0;x<=w;x+=8)
    ctx.lineTo(x, baseY-Math.abs(Math.sin((x-off)*.02+ph)*a1)-Math.abs(Math.sin((x-off)*.05+ph)*a2));
  ctx.lineTo(w,bottom); ctx.lineTo(0,bottom); ctx.closePath();
  ctx.fillStyle=fill; ctx.fill();
  if(rim){
    ctx.strokeStyle=rim; ctx.globalAlpha=.30; ctx.lineWidth=1.3;
    ctx.beginPath(); ctx.moveTo(0,baseY);
    for(let x=0;x<=w;x+=8)
      ctx.lineTo(x, baseY-Math.abs(Math.sin((x-off)*.02+ph)*a1)-Math.abs(Math.sin((x-off)*.05+ph)*a2));
    ctx.stroke(); ctx.globalAlpha=1;
  }
}

function drawTerrain(ctx,w,h,cfg,S){
  const t=S.t, gy=h*.72, kind=cfg.terrain||'hills';

  if(kind==='grid'){
    const hz=h*.50, vp=w*.5;
    ctx.fillStyle=cfg.ground[1]; ctx.fillRect(0,hz,w,h-hz);
    ctx.strokeStyle=cfg.tone&&cfg.tone.line||'#5fff9a'; ctx.lineWidth=1;
    for(let i=1;i<14;i++){
      const f=Math.pow(i/14,2.2), y=hz+f*(h-hz), sp=f*w*.92;
      ctx.globalAlpha=.12+f*.30;
      ctx.beginPath(); ctx.moveTo(vp-sp,y); ctx.lineTo(vp+sp,y); ctx.stroke();
    }
    ctx.globalAlpha=.26;
    for(let i=-6;i<=6;i++){ctx.beginPath();ctx.moveTo(vp,hz);ctx.lineTo(vp+i*w*.09,h);ctx.stroke();}
    ctx.globalAlpha=1;
    return;
  }

  if(kind==='chasm'){
    const edge=h*.66;
    ctx.fillStyle=cfg.mid; ctx.fillRect(0,edge-2,w,4);
    const drop=ctx.createLinearGradient(0,edge,0,h);
    drop.addColorStop(0,cfg.ground[0]); drop.addColorStop(.45,cfg.ground[1]); drop.addColorStop(1,'#000');
    ctx.fillStyle=drop; ctx.fillRect(0,edge,w,h-edge);
    ctx.strokeStyle=cfg.horizon; ctx.lineWidth=1.4;
    ctx.beginPath();
    for(let x=0;x<=w;x+=16) ctx.lineTo(x,edge+Math.sin(x*.06+3)*4);
    ctx.stroke();
    return;
  }

  if(kind==='sea'){
    hillLayer(ctx,w,h*.50,h*.62,(t*.06)%160,15,8,.2,cfg.far,null);
    const top=h*.60;
    const sg=ctx.createLinearGradient(0,top,0,h);
    sg.addColorStop(0,cfg.mid); sg.addColorStop(1,cfg.ground[1]);
    ctx.fillStyle=sg; ctx.fillRect(0,top,w,h-top);
    for(let i=0;i<4;i++){
      const wy=top+16+i*20;
      ctx.strokeStyle=`rgba(255,255,255,${.11-i*.02})`; ctx.lineWidth=1.2;
      ctx.beginPath();
      for(let x=0;x<=w;x+=6) ctx.lineTo(x,wy+Math.sin(x*.04+t*.045+i)*3);
      ctx.stroke();
    }
    return;
  }

  if(kind==='room'){
    /* back wall + floorboards */
    ctx.fillStyle=cfg.tone.a; ctx.fillRect(0,h*.58,w,h*.42);
    ctx.strokeStyle='rgba(0,0,0,.45)'; ctx.lineWidth=1;
    for(let y=h*.62;y<h;y+=11){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    for(let x=0;x<=w;x+=46){ctx.beginPath();ctx.moveTo(x,h*.58);ctx.lineTo(x+ (x-w*.5)*.16, h);ctx.stroke();}
    ctx.strokeStyle=cfg.tone.b; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(0,h*.58); ctx.lineTo(w,h*.58); ctx.stroke();
    return;
  }

  if(kind==='flats'){
    ctx.fillStyle=cfg.far; ctx.fillRect(0,h*.58,w,h*.14);
    const g=ctx.createLinearGradient(0,gy,0,h);
    g.addColorStop(0,cfg.ground[0]); g.addColorStop(1,cfg.ground[1]);
    ctx.fillStyle=g; ctx.fillRect(0,gy,w,h-gy);
    ctx.strokeStyle=cfg.horizon; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(w,gy); ctx.stroke();
    return;
  }

  /* default: hills */
  hillLayer(ctx,w,h*.58,h*.66,(t*.08)%160,14,7,.4,cfg.far,null);
  hillLayer(ctx,w,h*.62,h*.70,(t*.15)%160,20,10,0,cfg.mid,cfg.horizon);
  ctx.globalAlpha=.92;
  hillLayer(ctx,w,h*.70,h*.76,(t*.40)%220,14,0,1.4,cfg.ground[0],null);
  ctx.globalAlpha=1;
  const g=ctx.createLinearGradient(0,gy,0,h);
  g.addColorStop(0,cfg.ground[0]); g.addColorStop(1,cfg.ground[1]);
  ctx.fillStyle=g; ctx.fillRect(0,gy,w,h-gy);
}

function drawOverlay(ctx,w,h,ov,S){
  if(!ov||ov.type!=='flow')return;
  const t=S.t, y0=h*.735, y1=h*.79;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(0,y0);
  for(let x=0;x<=w;x+=10) ctx.lineTo(x,y0+Math.sin(x*.03+t*.02)*4);
  ctx.lineTo(w,y1);
  for(let x=w;x>=0;x-=10) ctx.lineTo(x,y1+Math.sin(x*.025+t*.018+1.5)*5);
  ctx.closePath();
  const g=ctx.createLinearGradient(0,y0,0,y1);
  g.addColorStop(0,ov.a); g.addColorStop(.4,ov.b); g.addColorStop(1,ov.c);
  ctx.fillStyle=g; ctx.fill(); ctx.clip(); ctx.globalAlpha=.5;
  for(let i=0;i<5;i++){
    const off=(t*1.2+i*140)%(w+200)-100;
    ctx.fillStyle=ov.vein; ctx.beginPath(); ctx.ellipse(off,(y0+y1)/2,60,6,0,0,TAU); ctx.fill();
  }
  ctx.restore();
  const glow=ctx.createLinearGradient(0,y0-22,0,y0);
  glow.addColorStop(0,'rgba(0,0,0,0)'); glow.addColorStop(1,ov.vein);
  ctx.globalAlpha=.35; ctx.fillStyle=glow; ctx.fillRect(0,y0-22,w,22); ctx.globalAlpha=1;
}

/* ───────────────────────── prop drawers (10, parametrised) ───────────────────────── */

/* ══════════ NAMED PROPS · one object per stage ═══════════════════════════
   Worlds 6-11 shared ten generic drawers — stand, hang, frame, ring, seam,
   bench, float, spin, throne, desk — across twenty-six stages, with `stand`
   alone appearing five times. Those are shapes, not things: they tell you a
   silhouette is present and nothing about where you are. Worlds 1-5 already do
   this correctly (lighthouse, geysers, boneSpikes, anvils, pendulums, statues
   — each used exactly once), which is why they read better than their terrain
   deserves.

   These are twenty-five drawers, each used by exactly one stage, named for the
   thing it is. A world is a behaviour; a stage is a noun. These are the nouns.
   Every one is drawn from S.props placement data, the same as the generics. */
const NAMED = {

/* ── WORLD 6 · THE FRAYING · reality coming unstitched ─────────────────── */
// s25 · an unravelling spool, thread paying out across the ground
spool2(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach((p,i)=>{
  const cx=p.x, cy=p.baseY-p.h*.35, r=p.w*.55;
  ctx.fillStyle=T.a||'#3a2830'; ctx.beginPath(); ctx.arc(cx,cy,r,0,TAU); ctx.fill();
  ctx.strokeStyle=T.line||'#6a4c5c'; ctx.lineWidth=1;
  for(let k=0;k<5;k++){ const a=t*.01+k*1.26+p.ph;
    ctx.beginPath(); ctx.arc(cx,cy,r*(.3+k*.14),a,a+2.2); ctx.stroke(); }
  ctx.strokeStyle=T.tip||'#e06fa0'; ctx.lineWidth=1.1; ctx.beginPath();
  ctx.moveTo(cx,cy+r);
  for(let x=0;x<=60;x+=6) ctx.lineTo(cx+x*(i%2?1:-1), p.baseY+Math.sin(x*.18+t*.03)*2.5);
  ctx.stroke(); }); },
// s26 · a toppled shelf, its pages still leaving it
shelf(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  ctx.save(); ctx.translate(p.x,p.baseY); ctx.rotate(.24+p.tilt);
  ctx.fillStyle=T.a||'#2c2038'; ctx.fillRect(-p.w*.5,-p.h,p.w,p.h);
  ctx.fillStyle=T.b||'#6a5480';
  for(let k=1;k<4;k++) ctx.fillRect(-p.w*.5,-p.h*k/4,p.w,1.6);
  ctx.restore();
  ctx.fillStyle=T.line||'#a37de0';
  for(let k=0;k<3;k++){ const fx=p.x+Math.sin(t*.02+k+p.ph)*10+k*7, fy=p.baseY-p.h-8-k*9-((t*.4+k*30)%22);
    ctx.globalAlpha=.5; ctx.fillRect(fx,fy,5,3.5); }
  ctx.globalAlpha=1; }); },
// s27 · a garden growing sideways out of the near wall
sidegarden(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach((p,i)=>{
  const dir=i%2?1:-1, ox=dir<0?w*.02:w*.98, y=p.y;
  ctx.strokeStyle=T.line||'#3dbfb0'; ctx.lineWidth=1.6;
  ctx.beginPath(); ctx.moveTo(ox,y);
  ctx.quadraticCurveTo(ox+dir*p.h*.6, y+Math.sin(t*.015+p.ph)*7, ox+dir*p.h, y+10);
  ctx.stroke();
  ctx.fillStyle=T.glow||'rgba(61,191,176,.7)';
  for(let k=1;k<=3;k++){ const fx=ox+dir*p.h*k/3, fy=y+k*3+Math.sin(t*.015+p.ph)*5;
    ctx.beginPath(); ctx.ellipse(fx,fy,3.2,1.7,dir*.4,0,TAU); ctx.fill(); } }); },
// s28 · a standing mirror showing the layer behind you
mirror2(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const mw=p.w*1.5, mh=p.h*1.25, x=p.x-mw/2, y=p.baseY-mh;
  ctx.fillStyle=T.a||'#281808'; ctx.fillRect(x-2,y-2,mw+4,mh+4);
  const g=ctx.createLinearGradient(x,y,x+mw,y+mh);
  g.addColorStop(0,T.b||'rgba(180,200,220,.30)');
  g.addColorStop(.5,'rgba(255,255,255,.10)');
  g.addColorStop(1,T.b||'rgba(120,140,170,.22)');
  ctx.fillStyle=g; ctx.fillRect(x,y,mw,mh);
  ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=1;
  const sy=y+((t*.6+p.ph*20)%mh);
  ctx.beginPath(); ctx.moveTo(x,sy); ctx.lineTo(x+mw,sy-mw*.12); ctx.stroke(); }); },
// s29 · three threads, cut at different lengths
threads(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach((p,i)=>{
  const len=p.h*(i%3===0?1:i%3===1?.66:.4);
  ctx.strokeStyle=T.line||'#6a4c5c'; ctx.lineWidth=1.3;
  ctx.beginPath(); ctx.moveTo(p.x,0);
  ctx.quadraticCurveTo(p.x+Math.sin(t*.018+p.ph)*5,len*.55,p.x+Math.sin(t*.018+p.ph)*8,len);
  ctx.stroke();
  ctx.fillStyle=T.tip||'#e06fa0';
  ctx.beginPath(); ctx.arc(p.x+Math.sin(t*.018+p.ph)*8,len,1.8,0,TAU); ctx.fill(); }); },

/* ── WORLD 7 · THE ASH · everything muffled ────────────────────────────── */
// s30 · a great bell, half sunk
bell(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const bw=p.w*1.6, by=p.baseY;
  ctx.fillStyle=T.a||'#3a3038';
  ctx.beginPath(); ctx.moveTo(p.x-bw*.5,by);
  ctx.quadraticCurveTo(p.x-bw*.42,by-p.h,p.x,by-p.h);
  ctx.quadraticCurveTo(p.x+bw*.42,by-p.h,p.x+bw*.5,by);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle=T.b||'#7a6a70'; ctx.fillRect(p.x-bw*.5,by-3,bw,3);
  ctx.strokeStyle='rgba(0,0,0,.45)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(p.x-bw*.2,by-p.h*.5); ctx.lineTo(p.x+bw*.28,by-2); ctx.stroke(); }); },
// s31 · a choir stall, still facing the front
stall(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const rw=p.w*2.2;
  for(let r=0;r<3;r++){ const y=p.baseY-r*7, x=p.x-rw*.5+r*6, ww=rw-r*12;
    ctx.fillStyle=r===0?(T.a||'#2a2028'):(T.b||'#4a3c44');
    ctx.fillRect(x,y-9,ww,9);
    ctx.fillStyle='rgba(0,0,0,.35)';
    for(let k=1;k<5;k++) ctx.fillRect(x+ww*k/5,y-9,1,9); } }); },
// s32 · a nave with the roof gone
nave(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach((p,i)=>{
  const ph=p.h*1.6;
  ctx.fillStyle=T.a||'#241c26'; ctx.fillRect(p.x-p.w*.22,p.baseY-ph,p.w*.44,ph);
  ctx.strokeStyle=T.b||'#5a4a58'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(p.x,p.baseY-ph,p.w*.5,Math.PI*1.15,Math.PI*1.85); ctx.stroke();
  if(i%2===0){ ctx.globalAlpha=.22; ctx.fillStyle=T.line||'#c8b0d0';
    ctx.beginPath(); ctx.moveTo(p.x-p.w*.22,p.baseY-ph);
    ctx.lineTo(p.x+p.w*.22,p.baseY-ph); ctx.lineTo(p.x+p.w*.9,p.baseY);
    ctx.lineTo(p.x-p.w*.5,p.baseY); ctx.closePath(); ctx.fill(); ctx.globalAlpha=1; } }); },
// s33 · a tuning fork the size of a tree, still ringing
fork(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const hum=Math.sin(t*.16+p.ph)*1.3, ph2=p.h*1.5;
  ctx.strokeStyle=T.a||'#7a8a90'; ctx.lineWidth=3; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(p.x,p.baseY); ctx.lineTo(p.x,p.baseY-ph2*.35); ctx.stroke();
  ctx.lineWidth=2.4;
  ctx.beginPath(); ctx.moveTo(p.x-hum,p.baseY-ph2*.35); ctx.lineTo(p.x-p.w*.35-hum,p.baseY-ph2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(p.x+hum,p.baseY-ph2*.35); ctx.lineTo(p.x+p.w*.35+hum,p.baseY-ph2); ctx.stroke();
  ctx.lineCap='butt';
  ctx.globalAlpha=.18+.12*Math.sin(t*.08+p.ph); ctx.strokeStyle=T.line||'#d8c8b0'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.arc(p.x,p.baseY-ph2*.7,p.w*1.4,0,TAU); ctx.stroke(); ctx.globalAlpha=1; }); },
// s34 · a hymnboard with the numbers fallen out
hymnboard(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const bw=p.w*1.3, bh=p.h*1.1;
  ctx.fillStyle=T.a||'#2a2228'; ctx.fillRect(p.x-1.5,p.baseY-bh,3,bh);
  ctx.fillStyle=T.b||'#40343c'; ctx.fillRect(p.x-bw*.5,p.baseY-bh-bh*.55,bw,bh*.55);
  ctx.fillStyle=T.line||'#cbb6a0';
  for(let k=0;k<3;k++){ if((k+Math.floor(p.ph))%3===0) continue;
    ctx.fillRect(p.x-bw*.34+k*bw*.28,p.baseY-bh-bh*.42,bw*.16,bh*.28); }
  ctx.fillStyle=T.line||'#cbb6a0'; ctx.globalAlpha=.7;
  ctx.fillRect(p.x+bw*.1,p.baseY-4,bw*.14,3); ctx.globalAlpha=1; }); },

/* ── WORLD 8 · THE LAW · machinery that judges ─────────────────────────── */
// s35 · an escapement the height of the screen
escapement(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const cx=p.x, cy=p.baseY-p.h*.9, r=p.w*.9, a=t*.012+p.ph;
  ctx.strokeStyle=T.a||'#4a5560'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(cx,cy,r,0,TAU); ctx.stroke();
  ctx.lineWidth=1.2;
  for(let k=0;k<14;k++){ const th=a+k*TAU/14;
    ctx.beginPath(); ctx.moveTo(cx+Math.cos(th)*r,cy+Math.sin(th)*r);
    ctx.lineTo(cx+Math.cos(th)*(r+4),cy+Math.sin(th)*(r+4)); ctx.stroke(); }
  const sw=Math.sin(t*.06+p.ph)*.5;
  ctx.strokeStyle=T.line||'#8fa0b0'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx,cy-r-6);
  ctx.lineTo(cx+Math.sin(sw)*r*.8,cy-r-6+Math.cos(sw)*r*.8); ctx.stroke(); }); },
// s36 · a set of scales, out of balance and staying that way
scales(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const cx=p.x, top=p.baseY-p.h*1.4, arm=p.w*1.1, tip=.20+Math.sin(t*.008+p.ph)*.03;
  ctx.fillStyle=T.a||'#3a4450'; ctx.fillRect(cx-2,top,4,p.h*1.4);
  ctx.save(); ctx.translate(cx,top); ctx.rotate(tip);
  ctx.strokeStyle=T.b||'#7a8896'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(-arm,0); ctx.lineTo(arm,0); ctx.stroke();
  [-arm,arm].forEach((ax,i)=>{ const d=i?16:8;
    ctx.beginPath(); ctx.moveTo(ax,0); ctx.lineTo(ax,d); ctx.stroke();
    ctx.strokeStyle=T.line||'#b0c0cc';
    ctx.beginPath(); ctx.arc(ax,d+4,5,0,Math.PI); ctx.stroke();
    ctx.strokeStyle=T.b||'#7a8896'; });
  ctx.restore(); }); },
// s37 · rusted rebar coming out of nothing
rebar(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach((p,i)=>{
  const n=3+(i%3);
  for(let k=0;k<n;k++){ const bx=p.x+(k-n/2)*5, bh=p.h*(.5+((k*7+i)%5)/8);
    ctx.strokeStyle=T.a||'#7a4a30'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(bx,p.baseY);
    ctx.quadraticCurveTo(bx+(k%2?5:-5),p.baseY-bh*.6,bx+(k%2?9:-9),p.baseY-bh); ctx.stroke();
    ctx.strokeStyle=T.line||'#c07a4a'; ctx.lineWidth=.8;
    for(let s=0;s<4;s++){ const sy=p.baseY-bh*s/4;
      ctx.beginPath(); ctx.moveTo(bx-2,sy); ctx.lineTo(bx+2,sy-1.5); ctx.stroke(); } } }); },
// s38 · a stack of punched cards, one still falling
cards(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const cw=p.w*1.4;
  for(let k=0;k<7;k++){ const y=p.baseY-k*3.2, ox=Math.sin(k*1.3+p.ph)*2.5;
    ctx.fillStyle=k%2?(T.a||'#d8cfae'):(T.b||'#bfb490');
    ctx.fillRect(p.x-cw*.5+ox,y-3,cw,3);
    ctx.fillStyle='rgba(0,0,0,.5)';
    for(let q=0;q<5;q++) if((k*3+q)%4) ctx.fillRect(p.x-cw*.4+ox+q*cw*.18,y-2.2,1.4,1.4); }
  const fy=p.baseY-30-((t*.5+p.ph*20)%40);
  ctx.globalAlpha=.8; ctx.fillStyle=T.a||'#d8cfae';
  ctx.save(); ctx.translate(p.x+14,fy); ctx.rotate(Math.sin(t*.05)*.5);
  ctx.fillRect(-cw*.4,-1.5,cw*.8,3); ctx.restore(); ctx.globalAlpha=1; }); },
// s39 · one proved line, and the space where the rest should be
proof(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach((p,i)=>{
  const y=p.baseY-p.h*.5, lw=p.w*2.4;
  ctx.strokeStyle=T.line||'#a8c0d8'; ctx.lineWidth=1.6;
  ctx.globalAlpha=.9; ctx.beginPath(); ctx.moveTo(p.x-lw*.5,y); ctx.lineTo(p.x+lw*.5,y); ctx.stroke();
  ctx.globalAlpha=.20+.10*Math.sin(t*.03+p.ph); ctx.lineWidth=1;
  for(let k=1;k<=3;k++){ ctx.beginPath();
    ctx.moveTo(p.x-lw*.5,y+k*7); ctx.lineTo(p.x-lw*.5+lw*(1-k*.22),y+k*7); ctx.stroke(); }
  ctx.globalAlpha=1;
  ctx.fillStyle=T.a||'#8fa8c0'; ctx.fillRect(p.x-lw*.5-5,y-2.5,3,5); }); },

/* ── WORLD 9 · THE PRESSURE · everything under weight ──────────────────── */
// s40 · a throne, mostly silt
siltthrone(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const tw=p.w*1.5, th2=p.h*1.2;
  ctx.fillStyle=T.a||'#2a3a44'; ctx.fillRect(p.x-tw*.5,p.baseY-th2*.5,tw,th2*.5);
  ctx.fillRect(p.x-tw*.5,p.baseY-th2,tw*.22,th2);
  ctx.fillRect(p.x+tw*.28,p.baseY-th2,tw*.22,th2);
  ctx.fillStyle=T.b||'#456070'; ctx.fillRect(p.x-tw*.5,p.baseY-th2*.55,tw,3);
  const g=ctx.createLinearGradient(0,p.baseY-th2*.42,0,p.baseY+6);
  g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,T.line||'rgba(120,150,170,.75)');
  ctx.fillStyle=g; ctx.fillRect(p.x-tw*.6,p.baseY-th2*.42,tw*1.2,th2*.48); }); },
// s41 · a ribcage you can swim through
ribcage(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const rh=p.h*1.5, sway=Math.sin(t*.01+p.ph)*2;
  ctx.strokeStyle=T.a||'#8fa8b0'; ctx.lineWidth=2.2;
  ctx.beginPath(); ctx.moveTo(p.x,p.baseY); ctx.lineTo(p.x+sway,p.baseY-rh); ctx.stroke();
  ctx.lineWidth=1.5;
  for(let k=1;k<=6;k++){ const y=p.baseY-rh*k/7, sp=p.w*(.9-Math.abs(k-3.2)*.12);
    ctx.beginPath(); ctx.moveTo(p.x+sway*k/7,y);
    ctx.quadraticCurveTo(p.x-sp+sway,y+5,p.x-sp*.8+sway,y+13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p.x+sway*k/7,y);
    ctx.quadraticCurveTo(p.x+sp+sway,y+5,p.x+sp*.8+sway,y+13); ctx.stroke(); } }); },
// s42 · an ice core pulled up and left standing
icecore(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const cw=p.w*.5, ch=p.h*1.7;
  const g=ctx.createLinearGradient(p.x-cw,0,p.x+cw,0);
  g.addColorStop(0,T.a||'rgba(150,200,220,.55)');
  g.addColorStop(.45,'rgba(230,248,255,.85)');
  g.addColorStop(1,T.a||'rgba(120,170,200,.5)');
  ctx.fillStyle=g; ctx.fillRect(p.x-cw,p.baseY-ch,cw*2,ch);
  ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=1;
  for(let k=1;k<9;k++){ const y=p.baseY-ch*k/9;
    ctx.globalAlpha=(k%3===0)?.55:.20;
    ctx.beginPath(); ctx.moveTo(p.x-cw,y); ctx.lineTo(p.x+cw,y+1.5); ctx.stroke(); }
  ctx.globalAlpha=1; }); },
// s43 · a gallery of crab-court seats, all facing in
gallery(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach((p,i)=>{
  const face=(p.x<w/2)?1:-1;
  for(let r=0;r<3;r++){ const y=p.baseY-r*9, x=p.x+face*r*5;
    ctx.fillStyle=r===0?(T.a||'#3a2a30'):(T.b||'#5a3c44');
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+face*p.w*.7,y-3);
    ctx.lineTo(x+face*p.w*.7,y-11); ctx.lineTo(x,y-8); ctx.closePath(); ctx.fill();
    ctx.fillStyle=T.line||'#c07a88';
    ctx.beginPath(); ctx.arc(x+face*p.w*.35,y-13,2.4,0,TAU); ctx.fill(); } }); },
// s44 · a crown, on the floor, exactly where it fell
crown(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const cw=p.w*1.2, y=p.baseY;
  ctx.fillStyle='rgba(0,0,0,.4)';
  ctx.beginPath(); ctx.ellipse(p.x,y+2,cw*.7,4,0,0,TAU); ctx.fill();
  ctx.fillStyle=T.a||'#c8a850';
  ctx.beginPath(); ctx.moveTo(p.x-cw*.5,y);
  for(let k=0;k<=4;k++){ const x=p.x-cw*.5+cw*k/4;
    ctx.lineTo(x,y-(k%2?11:4)); ctx.lineTo(x+cw*.125,y-(k%2?4:11)); }
  ctx.lineTo(p.x+cw*.5,y); ctx.closePath(); ctx.fill();
  ctx.globalAlpha=.25+.2*Math.sin(t*.03+p.ph); ctx.fillStyle=T.line||'#ffe9a0';
  ctx.beginPath(); ctx.arc(p.x,y-7,cw*.9,0,TAU); ctx.fill(); ctx.globalAlpha=1; }); },

/* ── WORLD 10 · THE EROSION · things going out ─────────────────────────── */
// s45 · an obelisk with its top already gone
obelisk(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const oh=p.h*1.8, bw=p.w*.6;
  ctx.fillStyle=T.a||'#3a2820';
  ctx.beginPath(); ctx.moveTo(p.x-bw,p.baseY); ctx.lineTo(p.x-bw*.55,p.baseY-oh);
  ctx.lineTo(p.x+bw*.55,p.baseY-oh); ctx.lineTo(p.x+bw,p.baseY); ctx.closePath(); ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.45)';
  for(let k=0;k<4;k++) ctx.fillRect(p.x-bw*.5,p.baseY-oh*(.25+k*.18),bw,1.4);
  ctx.strokeStyle=T.line||'#ff9a5a'; ctx.lineWidth=1.4; ctx.globalAlpha=.6;
  ctx.beginPath(); ctx.moveTo(p.x-bw*.55,p.baseY-oh);
  for(let k=0;k<=4;k++) ctx.lineTo(p.x-bw*.55+bw*1.1*k/4,p.baseY-oh+(k%2?3.5:-1.5));
  ctx.stroke(); ctx.globalAlpha=1; }); },
// s46 · colour draining downward out of a standing frame
drain(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const fw=p.w*1.3, fh=p.h*1.2, x=p.x-fw/2, y=p.baseY-fh;
  ctx.strokeStyle=T.a||'#5a4038'; ctx.lineWidth=2; ctx.strokeRect(x,y,fw,fh);
  const g=ctx.createLinearGradient(0,y,0,p.baseY);
  g.addColorStop(0,T.line||'rgba(255,150,90,.45)'); g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.fillRect(x,y,fw,fh);
  ctx.strokeStyle=T.line||'rgba(255,150,90,.5)'; ctx.lineWidth=1;
  for(let k=0;k<4;k++){ const dx=x+fw*(k+.5)/4, dy=p.baseY+((t*.7+k*17+p.ph*10)%26);
    ctx.globalAlpha=Math.max(0,.5-(dy-p.baseY)/52);
    ctx.beginPath(); ctx.moveTo(dx,dy); ctx.lineTo(dx,dy+5); ctx.stroke(); }
  ctx.globalAlpha=1; }); },
// s47 · an arch for a dawn that never finishes
arch(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const r=Math.max(p.w*1.5,h*.20), cy=p.baseY;
  ctx.strokeStyle=T.a||'#6a5040'; ctx.lineWidth=4.5;
  ctx.beginPath(); ctx.arc(p.x,cy,r,Math.PI,TAU*.86); ctx.stroke();
  ctx.lineWidth=2.2;                                   // the inner ring
  ctx.beginPath(); ctx.arc(p.x,cy,r*.78,Math.PI,TAU*.90); ctx.stroke();
  ctx.lineWidth=4.5;                                   // the two feet
  ctx.beginPath(); ctx.moveTo(p.x-r,cy); ctx.lineTo(p.x-r,cy+9); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(p.x+r,cy); ctx.lineTo(p.x+r,cy+9); ctx.stroke();
  ctx.lineWidth=2.4; ctx.strokeStyle='rgba(0,0,0,.35)';
  ctx.beginPath(); ctx.arc(p.x,cy,r,TAU*.86,TAU*.98); ctx.stroke();
  const gl=.25+.2*Math.sin(t*.02+p.ph);
  const g=ctx.createRadialGradient(p.x,cy-r*.2,0,p.x,cy-r*.2,r*1.4);
  g.addColorStop(0,'rgba(255,190,120,'+gl+')'); g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,cy-r*.2,r*1.4,Math.PI,TAU); ctx.fill(); }); },
// s48 · the near ground being eaten
maw(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach(p=>{
  const rw=p.w*2.2+Math.sin(t*.02+p.ph)*4;
  const g=ctx.createRadialGradient(p.x,p.baseY,1,p.x,p.baseY,rw);
  g.addColorStop(0,'#000'); g.addColorStop(.62,'rgba(0,0,0,.92)');
  g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(p.x,p.baseY,rw,rw*.34,0,0,TAU); ctx.fill();
  ctx.strokeStyle=T.line||'#ff8a4a'; ctx.lineWidth=1.2; ctx.globalAlpha=.55;
  ctx.beginPath(); ctx.ellipse(p.x,p.baseY,rw*.66,rw*.22,0,0,TAU); ctx.stroke();
  ctx.globalAlpha=1; }); },
// s49 · a point, and everything leaning into it
point(ctx,w,h,cfg,S,li,P,T,t){ S.props.forEach((p,i)=>{
  const cx=w*.5, cy=h*.60;
  const dx=cx-p.x, dy=cy-p.baseY, d=Math.hypot(dx,dy)||1;
  ctx.save(); ctx.translate(p.x,p.baseY); ctx.rotate(Math.atan2(dy,dx)+Math.PI/2);
  ctx.fillStyle=T.a||'#2a2438'; ctx.fillRect(-p.w*.16,-p.h,p.w*.32,p.h);
  ctx.restore();
  ctx.strokeStyle=T.line||'rgba(200,180,255,.35)'; ctx.lineWidth=.9;
  ctx.globalAlpha=.30+.18*Math.sin(t*.03+p.ph);
  ctx.beginPath(); ctx.moveTo(p.x,p.baseY-p.h);
  ctx.lineTo(p.x+dx*.55,p.baseY-p.h+dy*.55); ctx.stroke(); ctx.globalAlpha=1;
  if(i===0){ ctx.fillStyle='#fff'; ctx.globalAlpha=.8;
    ctx.beginPath(); ctx.arc(cx,cy,1.6,0,TAU); ctx.fill(); ctx.globalAlpha=1; } }); },
};

function drawProps(ctx,w,h,cfg,S,li){
  const P=cfg.prop; if(!P)return;
  const t=S.t, T=cfg.tone||{}, gy=h*.72;

  /* a named prop is a thing, not a shape — see NAMED above */
  if(NAMED[P.type]){ NAMED[P.type](ctx,w,h,cfg,S,li,P,T,t,gy); return; }

  switch(P.type){

  case 'hang': S.props.forEach(p=>{
    const sw=Math.sin(t*.02+p.ph)*(P.sway||6);
    ctx.strokeStyle=T.line||'#666'; ctx.lineWidth=P.thick||1.2;
    ctx.beginPath(); ctx.moveTo(p.x,-2);
    ctx.quadraticCurveTo(p.x+sw*.5,p.h*.6,p.x+sw,p.h); ctx.stroke();
    const tx=p.x+sw, ty=p.h;
    if(P.tip==='fray'){
      ctx.strokeStyle=T.tip||'#e06fa0'; ctx.lineWidth=1;
      for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+k*3.4,ty+9+Math.abs(k)*3);ctx.stroke();}
    }else if(P.tip==='bell'){
      ctx.fillStyle=T.tip||'#e8c458';
      ctx.beginPath(); ctx.moveTo(tx-5,ty); ctx.lineTo(tx+5,ty);
      ctx.lineTo(tx+3.5,ty+10); ctx.lineTo(tx-3.5,ty+10); ctx.closePath(); ctx.fill();
      ctx.fillStyle='rgba(0,0,0,.4)'; ctx.fillRect(tx-1,ty+9,2,3);
    }else if(P.tip==='leaf'){
      ctx.fillStyle=T.tip||'#3dbfb0';
      ctx.beginPath(); ctx.ellipse(tx,ty+5,2.6,7.5,sw*.05,0,TAU); ctx.fill();
    }else if(P.tip==='ember'){
      const g=.35+.5*Math.sin(t*.06+p.ph);
      ctx.globalAlpha=g; ctx.fillStyle=T.tip||'#ff7a3a';
      ctx.beginPath(); ctx.arc(tx,ty+3,2.6,0,TAU); ctx.fill(); ctx.globalAlpha=1;
    }
  }); break;

  case 'stand': S.props.forEach(p=>{
    ctx.fillStyle='rgba(0,0,0,.34)';
    ctx.beginPath(); ctx.ellipse(p.x,p.baseY+2,p.w*.75,3.5,0,0,TAU); ctx.fill();
    ctx.save(); ctx.translate(p.x,0); ctx.rotate(p.tilt);
    if(P.shape==='pillar'){
      ctx.fillStyle=T.a||'#555'; ctx.fillRect(-p.w*.4,p.baseY-p.h,p.w*.8,p.h);
      ctx.fillStyle=T.b||'#888';
      ctx.fillRect(-p.w*.55,p.baseY-p.h-4,p.w*1.1,4);
      ctx.fillRect(-p.w*.55,p.baseY-4,p.w*1.1,4);
      ctx.strokeStyle='rgba(0,0,0,.35)'; ctx.lineWidth=1;
      for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(i*p.w*.2,p.baseY-p.h+4);ctx.lineTo(i*p.w*.2,p.baseY-4);ctx.stroke();}
    }else if(P.shape==='pylon'){
      ctx.fillStyle=T.a||'#0a2a22';
      ctx.beginPath(); ctx.moveTo(-p.w*.5,p.baseY); ctx.lineTo(-p.w*.2,p.baseY-p.h);
      ctx.lineTo(p.w*.2,p.baseY-p.h); ctx.lineTo(p.w*.5,p.baseY); ctx.closePath(); ctx.fill();
      const gl=.35+.45*Math.sin(t*.04+p.ph);
      ctx.strokeStyle=T.line||'#5fff9a'; ctx.globalAlpha=gl; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(0,p.baseY-4); ctx.lineTo(0,p.baseY-p.h+4); ctx.stroke();
      ctx.globalAlpha=1;
      const rg=ctx.createRadialGradient(0,p.baseY-p.h,0,0,p.baseY-p.h,p.w*2);
      rg.addColorStop(0,T.glow||'rgba(95,255,154,.3)'); rg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(0,p.baseY-p.h,p.w*2,0,TAU); ctx.fill();
    }else{ /* slab */
      ctx.fillStyle=T.a||'#333';
      ctx.beginPath(); ctx.moveTo(-p.w*.5,p.baseY); ctx.lineTo(-p.w*.45,p.baseY-p.h);
      ctx.lineTo(p.w*.45,p.baseY-p.h*.9); ctx.lineTo(p.w*.5,p.baseY); ctx.closePath(); ctx.fill();
      ctx.strokeStyle=T.b||'#666'; ctx.lineWidth=.8; ctx.stroke();
      ctx.strokeStyle=T.line||'#888'; ctx.globalAlpha=.30;
      for(let i=1;i<=3;i++){
        const y=p.baseY-p.h*(i/4);
        ctx.beginPath(); ctx.moveTo(-p.w*.28,y); ctx.lineTo(p.w*.26,y); ctx.stroke();
      }
      ctx.globalAlpha=1;
    }
    ctx.restore();
  }); break;

  case 'frame': S.props.forEach(p=>{
    const y = P.grounded ? p.baseY-p.h : p.y+Math.sin(t*.02+p.ph)*5;
    ctx.save(); ctx.translate(p.x,y);
    ctx.strokeStyle=T.line||'#888'; ctx.lineWidth=1.6;
    if(P.arch){
      ctx.beginPath();
      ctx.moveTo(-p.w*.5,p.h); ctx.lineTo(-p.w*.5,p.h*.35);
      ctx.quadraticCurveTo(0,-p.h*.28,p.w*.5,p.h*.35); ctx.lineTo(p.w*.5,p.h);
      ctx.stroke();
      ctx.fillStyle='rgba(0,0,0,.28)';
      ctx.beginPath();
      ctx.moveTo(-p.w*.5,p.h); ctx.lineTo(-p.w*.5,p.h*.35);
      ctx.quadraticCurveTo(0,-p.h*.28,p.w*.5,p.h*.35); ctx.lineTo(p.w*.5,p.h); ctx.closePath(); ctx.fill();
    }else{
      ctx.strokeRect(-p.w*.5,0,p.w,p.h);
      if(P.rail){
        ctx.beginPath(); ctx.moveTo(-p.w*.5,-8); ctx.lineTo(p.w*.5,-8); ctx.stroke();
        for(let x=-p.w*.5;x<=p.w*.5;x+=9){ctx.beginPath();ctx.moveTo(x,-8);ctx.lineTo(x,0);ctx.stroke();}
      }
      if(P.warp){
        ctx.strokeStyle=T.line||'#e8c458'; ctx.globalAlpha=.45; ctx.lineWidth=.8;
        for(let x=-p.w*.5+3;x<p.w*.5;x+=5){
          ctx.beginPath(); ctx.moveTo(x,0);
          ctx.lineTo(x+Math.sin(t*.02+p.ph+x*.1)*3,p.h); ctx.stroke();
        }
        ctx.globalAlpha=1;
      }
    }
    const rg=ctx.createRadialGradient(0,p.h*.5,0,0,p.h*.5,p.w);
    rg.addColorStop(0,T.glow||'rgba(255,255,255,.06)'); rg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=rg; ctx.fillRect(-p.w,0,p.w*2,p.h);
    ctx.restore();
  }); break;

  case 'float': S.props.forEach(p=>{
    p.rot+=p.rs;
    const y=p.y+Math.sin(t*.02+p.ph)*6, s=(P.sizeMin||5)+(p.w%((P.sizeMax||13)-(P.sizeMin||5)));
    ctx.save(); ctx.translate(p.x,y); ctx.rotate(p.rot);
    ctx.strokeStyle=T.line||'#c8d0e8'; ctx.lineWidth=1;
    ctx.globalAlpha=.55+.3*Math.sin(t*.03+p.ph);
    ctx.beginPath();
    const sides=P.sides||4;
    for(let i=0;i<=sides;i++){
      const a=(i/sides)*TAU;
      i?ctx.lineTo(Math.cos(a)*s,Math.sin(a)*s):ctx.moveTo(Math.cos(a)*s,Math.sin(a)*s);
    }
    ctx.stroke();
    ctx.strokeRect(-s*.45,-s*.45,s*.9,s*.9);
    ctx.globalAlpha=1; ctx.restore();
  }); break;

  case 'seam': { /* one long horizon seam — stitched (W6) or cold split (W10) */
    const y=h*.66;
    ctx.strokeStyle=T.line||'#3dbfb0'; ctx.lineWidth=2;
    ctx.beginPath();
    for(let x=0;x<=w;x+=6) ctx.lineTo(x,y+Math.sin(x*.03+t*.02)*3);
    ctx.stroke();
    const g=ctx.createLinearGradient(0,y-16,0,y+16);
    g.addColorStop(0,'rgba(0,0,0,0)');
    g.addColorStop(.5,T.glow||'rgba(61,191,176,.3)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(0,y-16,w,32);
    const n=P.stitch||0;
    for(let i=0;i<n;i++){
      const x=(i+.5)*(w/n), yy=y+Math.sin(x*.03+t*.02)*3;
      ctx.strokeStyle=T.line||'#3dbfb0'; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.moveTo(x-4,yy-6); ctx.lineTo(x+4,yy+6); ctx.stroke();
    }
    if(P.cold){
      ctx.strokeStyle='rgba(255,255,255,.10)'; ctx.lineWidth=1;
      for(let i=0;i<9;i++){
        const x=R(0,w);
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+R(-14,14),y+R(10,30)); ctx.stroke();
      }
    }
  } break;

  case 'spin': S.props.forEach(p=>{
    p.rot+=(p.rs||.008);
    const r=(P.rMin||10)+(p.w%((P.rMax||24)-(P.rMin||10)));
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
    ctx.fillStyle=T.a||'#2a2c5a'; ctx.beginPath(); ctx.arc(0,0,r,0,TAU); ctx.fill();
    ctx.fillStyle=T.b||'#6a7ad0';
    for(let i=0;i<8;i++){ctx.save();ctx.rotate((i/8)*TAU);ctx.fillRect(-2,-r-4,4,6);ctx.restore();}
    ctx.fillStyle=T.a||'#2a2c5a'; ctx.beginPath(); ctx.arc(0,0,r*.34,0,TAU); ctx.fill();
    ctx.restore();
  }); break;

  case 'ring': { /* boss centrepiece */
    const cx=(P.cx||.5)*w, cy=(P.cy||.36)*h, R0=P.r||52, n=P.count||3;
    for(let i=0;i<n;i++){
      const k=i/n, rr=R0*(.42+k*.9), a=t*.008*(i%2?-1:1)+i*.7;
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(a);
      ctx.strokeStyle=T.line||'#fff';
      ctx.globalAlpha=.20+.20*Math.sin(t*.03+i);
      ctx.lineWidth=1.8;
      if(P.square){ctx.strokeRect(-rr,-rr*.4,rr*2,rr*.8);}
      else{ctx.beginPath();ctx.ellipse(0,0,rr,rr*.36,0,0,TAU);ctx.stroke();}
      ctx.globalAlpha=1; ctx.restore();
    }
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,R0*1.9);
    g.addColorStop(0,T.glow||'rgba(255,255,255,.18)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,R0*1.9,0,TAU); ctx.fill();
  } break;

  case 'throne': { const cx=(P.cx||.5)*w, s=(P.scale||1), by=h*.72;
    ctx.fillStyle='rgba(0,0,0,.40)';
    ctx.beginPath(); ctx.ellipse(cx,by+3,34*s,6,0,0,TAU); ctx.fill();
    ctx.fillStyle=T.a||'#1c1030';
    ctx.fillRect(cx-24*s,by-26*s,48*s,26*s);
    ctx.fillRect(cx-20*s,by-84*s,40*s,60*s);
    ctx.fillStyle=T.b||'#5a2e58';
    ctx.fillRect(cx-24*s,by-30*s,48*s,5*s);
    for(let i=0;i<5;i++){
      const x=cx-18*s+i*9*s, hh=(i===2?24:14+ (i%2?4:0))*s;
      ctx.fillStyle=T.a||'#1c1030'; ctx.fillRect(x,by-84*s-hh,6*s,hh);
    }
    if(P.crown){
      const gl=.45+.4*Math.sin(t*.035);
      ctx.globalAlpha=gl; ctx.fillStyle=T.line||'#e8c458';
      for(let i=0;i<5;i++){
        const x=cx-18*s+i*9*s;
        ctx.beginPath(); ctx.moveTo(x,by-84*s-((i===2?24:16)*s));
        ctx.lineTo(x+3*s,by-84*s-((i===2?34:24)*s)); ctx.lineTo(x+6*s,by-84*s-((i===2?24:16)*s));
        ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha=1;
      const g=ctx.createRadialGradient(cx,by-60*s,0,cx,by-60*s,70*s);
      g.addColorStop(0,T.glow||'rgba(232,196,88,.3)'); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,by-60*s,70*s,0,TAU); ctx.fill();
    }
  } break;

  case 'bench': S.props.forEach(p=>{
    ctx.fillStyle='rgba(0,0,0,.32)';
    ctx.fillRect(p.x-p.w*.5,p.baseY,p.w,3);
    ctx.fillStyle=T.a||'#2e2618';
    ctx.fillRect(p.x-p.w*.5,p.baseY-p.h,p.w,p.h);
    ctx.strokeStyle=T.b||'#5c4c34'; ctx.lineWidth=1;
    const rows=P.rows||3;
    for(let i=1;i<=rows;i++){
      const y=p.baseY-p.h*(i/(rows+1));
      ctx.beginPath(); ctx.moveTo(p.x-p.w*.5,y); ctx.lineTo(p.x+p.w*.5,y); ctx.stroke();
    }
    ctx.fillStyle=T.line||'#8a7a58'; ctx.globalAlpha=.35;
    for(let i=0;i<4;i++)
      ctx.fillRect(p.x-p.w*.42+i*(p.w*.22), p.baseY-p.h+4+((i*7)%9), p.w*.16, 5);
    ctx.globalAlpha=1;
  }); break;

  case 'desk': { /* WORLD END — the author's desk */
    const cx=(P.cx||.5)*w, by=h*.80;
    ctx.fillStyle='rgba(0,0,0,.55)';
    ctx.beginPath(); ctx.ellipse(cx,by+4,72,9,0,0,TAU); ctx.fill();
    ctx.fillStyle=T.b||'#3a2c20'; ctx.fillRect(cx-70,by-22,140,8);
    ctx.fillStyle=T.a||'#18130f';
    ctx.fillRect(cx-62,by-14,8,26); ctx.fillRect(cx+54,by-14,8,26);
    /* live page stack: reads G._pages if the END fight is running */
    const pages=(window.G&&typeof G._pages==='number')?G._pages:0;
    const target=(window.G&&G._pageTarget)||50;
    const stack=Math.max(1,Math.round(Math.min(1,pages/target)*16));
    for(let i=0;i<stack;i++){
      ctx.fillStyle=`rgba(238,230,208,${.55+ (i/stack)*.35})`;
      ctx.fillRect(cx+18-(i%3), by-26-i*1.6, 30, 2);
    }
    ctx.fillStyle='rgba(244,238,220,.92)';
    ctx.save(); ctx.translate(cx-26,by-24); ctx.rotate(-.05);
    ctx.fillRect(-16,-3,34,3); ctx.restore();
    /* quill */
    ctx.strokeStyle='#d8cdb4'; ctx.lineWidth=1.6;
    ctx.save(); ctx.translate(cx-24,by-26);
    ctx.rotate(-0.9+Math.sin(t*.05)*.05);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-22); ctx.stroke();
    ctx.fillStyle='rgba(232,226,205,.85)';
    ctx.beginPath(); ctx.ellipse(0,-25,2.4,6,0,0,TAU); ctx.fill();
    ctx.restore();
    /* the empty chair, facing you */
    ctx.fillStyle=T.a||'#18130f';
    ctx.fillRect(cx+96,by-16,26,5); ctx.fillRect(cx+96,by-11,4,18); ctx.fillRect(cx+118,by-11,4,18);
    ctx.fillRect(cx+118,by-52,4,38); ctx.fillRect(cx+96,by-52,26,4);
  } break;

  }
}

/* ───────────────────────── post FX ───────────────────────── */
function drawPost(ctx,canvas,w,h,cfg,S){
  const t=S.t;
  if(cfg.post==='glitch' && !RM && (t%50)<3){
    for(let i=0;i<3;i++){
      const y=R(0,h*.9), sh=R(-14,14);
      try{ctx.drawImage(canvas,0,y,w,6,sh,y,w,6);}catch(e){}
    }
    ctx.fillStyle='rgba(255,0,150,.04)'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(0,220,255,.04)'; ctx.fillRect(2,0,w,h);
  }
  if(cfg.post==='scan'){
    const y=(t*2.2)%h;
    ctx.fillStyle='rgba(255,255,255,.05)'; ctx.fillRect(0,y,w,2);
  }
  if(cfg.post==='crack'){
    const gl=.28+.16*Math.sin(t*.03);
    S.cracks.forEach(pts=>{
      ctx.strokeStyle=`rgba(255,255,255,${gl})`; ctx.lineWidth=1.1;
      ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]);
      pts.forEach(p=>ctx.lineTo(p[0],p[1])); ctx.stroke();
    });
  }
  /* scanlines + vignette (matches dino-scenes.js so the two files look related) */
  ctx.fillStyle='rgba(0,0,0,.12)';
  for(let y=Math.floor(h*.72);y<h;y+=4) ctx.fillRect(0,y,w,1);
  const vg=ctx.createRadialGradient(w/2,h/2,h*.30,w/2,h/2,h*.95);
  vg.addColorStop(0,'rgba(0,0,0,0)');
  vg.addColorStop(1,cfg.world>=10?'rgba(0,0,0,.60)':'rgba(0,0,0,.46)');
  ctx.fillStyle=vg; ctx.fillRect(0,0,w,h);
}

/* ───────────────────────── main render ───────────────────────── */
function render2(ctx,canvas,slotId,si){
  const cfg=SCENES2[si-OFFSET]; if(!cfg)return;
  const w=canvas.width, h=canvas.height;
  if(w<2||h<2)return;

  const key=slotId+'#2';
  const S=getSlot(key);
  if(S.si!==si){S.si=si;initSlot(S,cfg,w,h);}
  S.t+=1;

  const li=(window.G&&typeof G.curLevel==='number')?G.curLevel:0;

  /* 1 · sky */
  const sky=ctx.createLinearGradient(0,0,0,h*.78);
  sky.addColorStop(0,cfg.sky[0]); sky.addColorStop(.55,cfg.sky[1]); sky.addColorStop(1,cfg.sky[1]);
  ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);

  /* 2 · body */
  drawBody(ctx,w,h,cfg,S);

  /* 3 · LIVE pass A (behind terrain) */
  drawLive(ctx,w,h,cfg,S,li,0);

  /* 4 · clouds + drifting particles */
  if(cfg.cloud) drawClouds(ctx,cfg,S,w);
  drawParticles(ctx,w,h,cfg,S);

  /* 5 · terrain */
  drawTerrain(ctx,w,h,cfg,S);

  /* 6 · props */
  drawProps(ctx,w,h,cfg,S,li);

  /* 7 · ground overlay (lava / flow) */
  if(cfg.overlay) drawOverlay(ctx,w,h,cfg.overlay,S);

  /* 8 · horizon bloom */
  if(cfg.horizon){
    const hz=ctx.createLinearGradient(0,h*.64,0,h*.80);
    hz.addColorStop(0,'rgba(0,0,0,0)'); hz.addColorStop(.5,cfg.horizon); hz.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=hz; ctx.fillRect(0,h*.60,w,h*.24);
  }

  /* 9 · LIVE pass B (in front of terrain — this is what sells "alive") */
  drawLive(ctx,w,h,cfg,S,li,1);

  /* 10 · faint ambient dust over everything */
  S.amb.forEach(a=>{
    a.y+=a.sp; if(a.y>h)a.y=-4;
    const ax=a.x+Math.sin(S.t*.01+a.ph)*6, al=.08+.05*Math.sin(S.t*.02+a.ph);
    ctx.fillStyle=`rgba(220,225,235,${al})`;
    ctx.beginPath(); ctx.arc(ax,a.y,a.r,0,TAU); ctx.fill();
  });

  /* 11 · post */
  drawPost(ctx,canvas,w,h,cfg,S);
}

/* ───────────────────────── wrap SceneFX.render ───────────────────────── */
const prevRender = (window.SceneFX && window.SceneFX.render) || null;
window.SceneFX = window.SceneFX || {};
window.SceneFX.render = function(ctx,canvas,slotId,si){
  if(si>=OFFSET && SCENES2[si-OFFSET]) return render2(ctx,canvas,slotId,si);
  if(prevRender) return prevRender(ctx,canvas,slotId,si);
};
window.SceneFX2={render:render2,SCENES:SCENES2,OFFSET:OFFSET};
console.log('[dino-scene2] '+SCENES2.length+' scenes registered for si '+OFFSET+'–'+(OFFSET+SCENES2.length-1));

})();
