 /* ══════════════════════════════════════════════════════════════
   DINO-SCENES.JS — 25 unique battle-background designs
   One entry per STAGES[] index in dino.js (same 0-24 order:
   Forest Fringe ... End of Reality). Fully namespaced under
   window.SceneFX so nothing here collides with dino.js globals.
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';
function rnd(a,b){return a+Math.random()*(b-a);}  

/* index-matched 1:1 with STAGES[] in dino.js */
const SCENES=[
 {name:'FOREST FRINGE',sky:['#0a1a2a','#173322'],mid:'#0f2a0f',far:'#081f10',ground:['#1a3a1a','#050a05'],
  body:{type:'moon',x:.78,y:.16,r:16,color:'#f4f2e8',glow:'rgba(244,242,232,.25)'},
  particle:{color:'#cceeff',type:'star',count:16},cloud:{color:'rgba(20,50,35,.35)',count:3},
  horizon:'rgba(80,200,140,.10)',prop:'trees',propTone:{trunk:'#3a2412',canopy:'#0d3d16'},fireflies:true,
  profile:{far:'hills',mid:'forestline',near:'forestline'},relief:.9,
  weather:'fog',fogTone:'rgba(120,190,150,.07)',
  live:'fronts',light:'highsun'},
 {name:'DESERT DUNES',sky:['#2a1608','#6a3a12'],mid:'#5a3018',far:'#3a2008',ground:['#3a1c08','#0a0502'],
  body:{type:'sun',x:.72,y:.18,r:22,color:'#ffb347',glow:'rgba(255,150,60,.35)'},
  particle:{color:'#ffd27a',type:'ember',count:8},cloud:{color:'rgba(90,40,10,.25)',count:2},
  horizon:'rgba(255,140,50,.18)',prop:'cacti',propTone:{body:'#2f6b3a',dark:'#1e4a26'},shimmer:true,dustDevils:true,
  profile:{far:'mesa',mid:'dunes',near:'dunes'},relief:1.05,
  weather:'drift',weatherTone:'rgba(255,210,150,.45)',
  live:'fronts',light:'highsun'},
 {name:'COASTAL CLIFFS',sky:['#0a2436','#1c4658'],mid:'#123444',far:'#0a2028',ground:['#082230','#020a0e'],
  body:{type:'moon',x:.2,y:.2,r:18,color:'#ffd9a0',glow:'rgba(255,217,160,.3)'},
  particle:{color:'#eaf6ff',type:'star',count:10},cloud:{color:'rgba(200,230,255,.18)',count:4},
  horizon:'rgba(120,220,220,.14)',terrain:'sea',gulls:true,
  prop:'lighthouse',propTone:{stone:'#d8d2c0',stripe:'#c0403a',lamp:'#fff2b0'},
  profile:'waves',relief:.8,seaLevel:.58,waveBands:4,
  weather:'fog',fogTone:'rgba(200,230,255,.09)',
  live:'fronts',light:'highsun'},
 {name:'VOLCANIC VALLEY',sky:['#2a0e08','#5a2410'],mid:'#3a1608',far:'#220a04',ground:['#2a0e04','#0a0301'],
  body:{type:'eclipse',x:.68,y:.2,r:14,color:'#ff6a2e',glow:'rgba(255,90,30,.32)'},
  particle:{color:'#ffae5e',type:'ember',count:14},cloud:{color:'rgba(90,30,10,.3)',count:2},
  horizon:'rgba(255,90,30,.22)',volcano:true,prop:'geysers',propTone:{rock:'#20100a',steam:'rgba(255,200,160,'},
  groundOverlay:{type:'lava',tone:{a:'#ffb347',b:'#ff5a1e',c:'#7a1400',vein:'rgba(255,220,140,.5)'}},
  profile:{far:'peaks',mid:'hills',near:'hills'},relief:1.15,
  weather:'embers',weatherTone:'rgba(255,150,70,.6)',
  live:'fronts',light:'highsun'},
 {name:'EMBER KEEP',sky:['#1a0402','#4a1206'],mid:'#2a0a04',far:'#150502',ground:['#1a0602','#050100'],
  body:{type:'eye',x:.5,y:.16,r:16,color:'#ff7a30',glow:'rgba(255,90,30,.4)'},
  particle:{color:'#ffb066',type:'ember',count:20},cloud:{color:'rgba(120,30,10,.3)',count:2},
  horizon:'rgba(255,90,30,.25)',prop:'banners',propTone:{stone:'#180705',stoneLit:'#3a1208',cloth:'#c8342e',gold:'#e8c458'},
  profile:{far:'spires',mid:'ruins',near:'hills'},relief:1.1,
  weather:'ash',weatherTone:'rgba(210,190,180,.4)',
  live:'fronts',light:'highsun'},
 {name:'SHADOW CAVERNS',sky:['#080510','#12081c'],mid:'#0e0616',far:'#070310',ground:['#0a0512','#020105'],
  body:{type:'crystal',x:.28,y:.42,r:9,color:'#c98bff',glow:'rgba(160,90,255,.35)'},
  particle:{color:'#b06aff',type:'star',count:14},cloud:null,horizon:'rgba(140,80,220,.1)',
  prop:'stalactites',propTone:{top:'#1a0e2a',bottom:'#c98bff'},
  profile:{far:'crystal',mid:'mesa',near:'flat'},relief:.8,
  weather:'drift',weatherTone:'rgba(180,140,255,.35)',
  live:'glow',light:'selflit'},
 {name:'FROST PEAKS',sky:['#08131f','#1c3d55'],mid:'#1a3a52',far:'#0f2536',ground:['#0e2438','#020608'],
  body:{type:'moon',x:.24,y:.14,r:14,color:'#dff2ff',glow:'rgba(200,235,255,.3)'},
  particle:{color:'#eaf6ff',type:'snow',count:24},cloud:{color:'rgba(200,230,255,.10)',count:3},
  horizon:'rgba(140,210,255,.12)',prop:'icebergs',propTone:{light:'#eaf9ff',shadow:'#5a8aa8',crack:'rgba(255,255,255,.55)'},
  aurora:true,auroraHue:[190,240],
  profile:{far:'peaks',mid:'peaks',near:'crystal'},relief:1.25,
  weather:'snow',weatherTone:'rgba(235,248,255,.7)',
  live:'glow',light:'selflit'},
 {name:'POISON SWAMP',sky:['#141c08','#2c3a10'],mid:'#1e2a0a',far:'#101a06',ground:['#141c08','#040602'],
  body:{type:'moon',x:.76,y:.18,r:12,color:'#c8d87a',glow:'rgba(200,216,120,.22)'},
  particle:{color:'#a8d84a',type:'ember',count:12},cloud:{color:'rgba(120,150,40,.25)',count:3},
  horizon:'rgba(170,210,60,.14)',prop:'reeds',propTone:{stalk:'#4a5e1a',tip:'#8aa83a'},
  groundOverlay:{type:'bog',tone:{a:'#8aa83a',b:'#4a5e1a',c:'#141c06',vein:'rgba(200,230,120,.4)'}},
  profile:{far:'forestline',mid:'waves',near:'waves'},relief:.75,
  weather:'fog',fogTone:'rgba(160,200,80,.10)',
  live:'glow',light:'selflit'},
 {name:'CHAOS WASTES',sky:['#160a20','#2a0e3a'],mid:'#1a0c2a',far:'#100618',ground:['#140a1e','#040208'],
  body:{type:'rift',x:.5,y:.2,r:16,color:'#e05fd0',glow:'rgba(224,95,208,.35)'},
  particle:{color:'#e05fd0',type:'star',count:20,cycle:true},cloud:{color:'rgba(120,20,120,.25)',count:2},
  horizon:'rgba(200,60,200,.16)',prop:'shards',glitch:true,
  profile:{far:'crystal',mid:'ruins',near:'crystal'},relief:1.2,
  weather:'drift',weatherTone:'rgba(224,95,208,.45)',
  live:'glow',light:'selflit'},
 {name:'OMEGA CITADEL',sky:['#0a0002','#2a0006'],mid:'#160004',far:'#0a0002',ground:['#0a0002','#000000'],
  body:{type:'eye',x:.5,y:.15,r:15,color:'#ff2a2a',glow:'rgba(255,20,20,.4)'},
  particle:{color:'#ff5a5a',type:'ember',count:10},cloud:{color:'rgba(80,0,0,.3)',count:2},
  horizon:'rgba(255,20,20,.2)',prop:'warPillars',propTone:{base:'#150004',crack:'#ff2a2a'},
  profile:{far:'spires',mid:'spires',near:'ruins'},relief:1.35,
  weather:'embers',weatherTone:'rgba(255,70,70,.5)',
  live:'glow',light:'selflit'},
 {name:'AETHER REACTOR',sky:['#04141c','#0a2c3a'],mid:'#083040',far:'#041e28',ground:['#04202a','#010608'],
  body:{type:'rift',x:.5,y:.2,r:16,color:'#4ae8ff',glow:'rgba(74,232,255,.35)'},
  particle:{color:'#4ae8ff',type:'star',count:22},cloud:{color:'rgba(20,100,120,.25)',count:2},
  horizon:'rgba(74,232,255,.18)',prop:'platforms',propTone:{a:'#0a2e3a',b:'#123c4a',glow:'rgba(74,232,255,.22)'},lightning:true,
  profile:{far:'spires',mid:'crystal',near:'flat'},relief:1.0,
  weather:'drift',weatherTone:'rgba(120,230,255,.35)',
  live:'ring',light:'hardside'},
 {name:'NEVER-HELL',sky:['#0a0202','#2a0805'],mid:'#1a0503',far:'#0c0302',ground:['#170502','#050101'],
  body:{type:'eye',x:.5,y:.16,r:15,color:'#ff5a3a',glow:'rgba(255,90,40,.4)'},
  particle:{color:'#ff8a3d',type:'ember',count:16},cloud:{color:'rgba(60,10,5,.35)',count:2},
  horizon:'rgba(255,90,30,.22)',prop:'boneSpikes',propTone:{bone:'#e8ddc0',shadow:'#8a7a58'},
  groundOverlay:{type:'lava',tone:{a:'#ffb347',b:'#ff5a1e',c:'#7a1400',vein:'rgba(255,220,140,.5)'}},
  profile:{far:'peaks',mid:'canyon',near:'ruins'},relief:1.3,
  weather:'embers',weatherTone:'rgba(255,120,60,.45)',
  live:'ring',light:'hardside'},
 {name:'ANCIENT RUINS',sky:['#241c10','#4a3a1c'],mid:'#3a2e16',far:'#241c10',ground:['#241a0c','#0a0603'],
  body:{type:'sun',x:.3,y:.22,r:14,color:'#e8c87a',glow:'rgba(232,200,122,.25)'},
  particle:{color:'#d8c090',type:'star',count:10},cloud:{color:'rgba(150,120,60,.2)',count:2},
  horizon:'rgba(220,190,120,.14)',prop:'ruinColumns',propTone:{stone:'#5a4a2e',vine:'#4a6a2a'},
  profile:{far:'mesa',mid:'ruins',near:'hills'},relief:.95,
  weather:'ash',weatherTone:'rgba(215,200,160,.38)',
  live:'ring',light:'hardside'},
 {name:'ABYSSAL TRENCH',sky:['#020a14','#0a2436'],mid:'#082030',far:'#04141f',ground:['#051826','#01060a'],
  body:{type:'rift',x:.5,y:.1,r:14,color:'#5fe8c8',glow:'rgba(95,232,200,.3)'},
  particle:{color:'#7fd9ff',type:'star',count:14},cloud:{color:'rgba(10,60,80,.2)',count:2},
  horizon:'rgba(70,200,220,.14)',terrain:'sea',bubbles:true,orbs:true,
  prop:'coral',propTone:{a:'#ff7aa0',b:'#5fd9c8',c:'#ffb36a'},
  /* a trench, not a shore: a tall canyon wall dropping into deep water */
  profile:'canyon',relief:1.25,seaLevel:.44,waveBands:7,
  weather:'fog',weatherTone:'rgba(110,200,215,.30)',
  live:'ring',light:'hardside'},
 {name:'COSMIC ASCENSION',sky:['#08041a','#1c0c38'],mid:'#120830',far:'#08041c',ground:['#0c0620','#020108'],
  body:{type:'sun',x:.5,y:.15,r:28,color:'#ffe9d8',glow:'rgba(255,233,216,.4)'},
  particle:{color:'#e0c8ff',type:'star',count:34},cloud:{color:'rgba(140,70,200,.22)',count:3},
  horizon:'rgba(200,140,255,.16)',prop:'skyDebris',propTone:{a:'#5a4a6a',b:'#8a7a9a'},propAirborne:true,
  aurora:true,auroraHue:[200,340],
  profile:{far:'spires',mid:'peaks',near:'crystal'},relief:1.4,
  weather:'drift',weatherTone:'rgba(215,180,255,.38)',
  live:'ring',light:'hardside'},
 {name:'CHRONO WHIRLPOOL',sky:['#0a0c22','#1c1c46'],mid:'#141438',far:'#0a0a22',ground:['#0c0c28','#020208'],
  body:{type:'vortex',x:.5,y:.24,r:20,color:'#8ab0ff',glow:'rgba(138,176,255,.35)'},
  particle:{color:'#8ab0ff',type:'star',count:18},cloud:{color:'rgba(60,70,150,.25)',count:2},
  horizon:'rgba(138,176,255,.16)',prop:'gears',propTone:{a:'#2a2c5a',b:'#6a7ad0'},
  profile:{far:'waves',mid:'dunes',near:'flat'},relief:.85,
  weather:'fog',weatherTone:'rgba(150,170,235,.32)',
  live:'invert',light:'flat'},
 {name:'NEBULA GRAVEYARD',sky:['#12081a','#241030'],mid:'#180c22',far:'#0e0616',ground:['#100816','#030106'],
  body:{type:'moon',x:.7,y:.18,r:13,color:'#8a7a90',glow:'rgba(138,122,144,.2)'},
  particle:{color:'#a89ab0',type:'star',count:12},cloud:{color:'rgba(60,40,80,.25)',count:3},
  horizon:'rgba(120,90,150,.12)',prop:'wreckage',propTone:{a:'#3a2a3a',b:'#8a6a44',window:'#ffcf6e'},propAirborne:true,
  profile:{far:'ruins',mid:'spires',near:'mesa'},relief:1.1,
  weather:'drift',weatherTone:'rgba(170,150,190,.32)',
  live:'invert',light:'flat'},
 {name:'QUANTUM MATRIX',sky:['#020a06','#04160c'],mid:'#031008',far:'#020a06',ground:['#020a06','#000000'],
  body:{type:'rift',x:.5,y:.2,r:14,color:'#5fff9a',glow:'rgba(95,255,154,.3)'},
  particle:{color:'#5fff9a',type:'star',count:16},cloud:null,horizon:'rgba(95,255,154,.14)',
  terrain:'grid',prop:'dataCubes',propTone:{line:'#5fff9a'},
  weather:'snow',weatherTone:'rgba(120,255,170,.30)',
  live:'invert',light:'flat'},
 {name:'STARLIGHT FORGE',sky:['#2a1404','#5a3008'],mid:'#3a2006',far:'#241404',ground:['#2a1602','#0a0501'],
  body:{type:'sun',x:.5,y:.16,r:24,color:'#ffdf9e',glow:'rgba(255,223,158,.4)'},
  particle:{color:'#ffcf7a',type:'ember',count:18},cloud:{color:'rgba(150,90,20,.25)',count:2},
  horizon:'rgba(255,200,100,.2)',prop:'anvils',propTone:{body:'#2a1a10',lit:'#ffb347'},
  groundOverlay:{type:'gold',tone:{a:'#ffe9a0',b:'#ffb347',c:'#7a4a10',vein:'rgba(255,244,200,.55)'}},
  profile:{far:'peaks',mid:'mesa',near:'hills'},relief:1.2,
  weather:'embers',weatherTone:'rgba(255,190,110,.45)',
  live:'invert',light:'flat'},
 {name:'THE VOID CORE',sky:['#050608','#0c1016'],mid:'#0a0d12',far:'#06070a',ground:['#050608','#000000'],
  body:{type:'singularity',x:.5,y:.34,r:14,color:'#e8e8ff',glow:'rgba(230,230,255,.25)'},
  particle:{color:'#8a94a6',type:'star',count:10},cloud:{color:'rgba(30,36,46,.3)',count:2},
  horizon:'rgba(0,0,0,0)',terrain:'chasm',prop:'voidRocks',propTone:{a:'#3a3d46',b:'#6a6f80'},
  weather:'fog',weatherTone:'rgba(90,95,110,.28)',
  live:'invert',light:'flat'},
 {name:'FORGE OF GENESIS',sky:['#140a20','#3a1a50'],mid:'#2a1240',far:'#170a26',ground:['#160822','#050208'],
  body:{type:'sun',x:.5,y:.15,r:26,color:'#ffe9b8',glow:'rgba(255,225,160,.4)'},
  particle:{color:'#ffdf9e',type:'star',count:28},cloud:{color:'rgba(120,60,150,.2)',count:2},
  horizon:'rgba(255,210,140,.16)',prop:'monoliths',propTone:{body:'#2a1440',glow:'rgba(255,236,190,',face:'rgba(255,240,210,'},motes:true,
  profile:{far:'spires',mid:'ruins',near:'peaks'},relief:1.35,
  weather:'embers',weatherTone:'rgba(255,225,170,.40)',
  live:'heat',light:'underlit'},
 {name:'ECHOES OF TIME',sky:['#1a1006','#3a2410'],mid:'#2a1a0a',far:'#180e06',ground:['#180e04','#050301'],
  body:{type:'clockface',x:.5,y:.2,r:22,color:'#e8b04a',glow:'rgba(232,176,74,.35)'},
  particle:{color:'#e8b04a',type:'star',count:20},cloud:{color:'rgba(150,110,40,.22)',count:2},
  horizon:'rgba(232,176,74,.16)',prop:'pendulums',propTone:{a:'#4a3010',b:'#c88a3a'},aurora:true,auroraHue:[30,55],
  profile:{far:'mesa',mid:'hills',near:'dunes'},relief:.9,
  weather:'ash',weatherTone:'rgba(230,200,140,.36)',
  live:'heat',light:'underlit'},
 {name:'ABYSS OF THE LOST',sky:['#0a0a14','#161624'],mid:'#101018',far:'#08080e',ground:['#0a0a12','#020204'],
  body:{type:'moon',x:.3,y:.16,r:14,color:'#c8d0e8',glow:'rgba(200,208,232,.22)'},
  particle:{color:'#c8d8ff',type:'ghost',count:9},cloud:{color:'rgba(60,60,90,.2)',count:3},
  horizon:'rgba(140,150,200,.1)',prop:'wisps',propTone:{core:'#e8ecf8',trail:'rgba(200,216,255,'},
  profile:{far:'canyon',mid:'canyon',near:'waves'},relief:.75,
  weather:'fog',weatherTone:'rgba(180,190,225,.34)',
  live:'heat',light:'underlit'},
 {name:'ASTRAL PANTHEON',sky:['#0c0620','#2c1050'],mid:'#1c0a3a',far:'#0e0524',ground:['#100826','#03010a'],
  body:{type:'sun',x:.5,y:.14,r:24,color:'#ffffff',glow:'rgba(255,255,255,.4)'},
  particle:{color:'#ffffff',type:'star',count:38},cloud:{color:'rgba(200,160,255,.18)',count:2},
  horizon:'rgba(220,180,255,.16)',prop:'statues',propTone:{stone:'#241040',eye:'#ffffff'},
  aurora:true,auroraHue:[0,340],constellations:true,
  profile:{far:'spires',mid:'spires',near:'crystal'},relief:1.25,
  weather:'drift',weatherTone:'rgba(235,215,255,.40)',
  live:'heat',light:'underlit'},
 {name:'END OF REALITY',sky:['#020204','#0e0410'],mid:'#0a040e',far:'#050208',ground:['#050208','#000000'],
  body:{type:'eye',x:.5,y:.17,r:17,color:'#f8f4ff',glow:'rgba(248,244,255,.4)'},
  particle:{color:'#f8f4ff',type:'star',count:24},cloud:{color:'rgba(120,120,150,.2)',count:2},
  horizon:'rgba(248,244,255,.14)',prop:'shatterDebris',propTone:{a:'#8a5aff',b:'#ff5a9a'},propAirborne:true,
  glitch:true,crackOverlay:true,
  profile:{far:'ruins',mid:'flat',near:'flat'},relief:.45,
  weather:'ash',weatherTone:'rgba(200,200,215,.30)',
  live:'heat',light:'underlit'},
];

/* ---- per-slot state so battle-canvas and walk-canvas can each keep their own ---- */
const SLOTS={};
function getSlot(id){return SLOTS[id]||(SLOTS[id]={si:-1,t:0,particles:[],clouds:[],props:[],fireflies:[],
  dustDevils:[],motes:[],ambient:[],bubbles:[],orbs:[],gulls:[],crackLines:[]});}

function initSlot(S,cfg,w,h){
  initWeather(S,cfg,w,h);
  S.t=0;
  S.particles=[];for(let i=0;i<cfg.particle.count;i++)S.particles.push({x:rnd(0,w),y:rnd(0,h*.55),r:rnd(.4,2),spd:rnd(.1,.5),phase:rnd(0,6.28)});
  S.clouds=[];if(cfg.cloud)for(let i=0;i<cfg.cloud.count;i++)S.clouds.push({x:rnd(0,w),y:h*(.08+rnd(0,.32)),w:rnd(80,170),hh:rnd(14,24),spd:rnd(.08,.18)});
  const groundY=h*.72;S.props=[];
  switch(cfg.prop){
    case 'trees':for(let i=0;i<7;i++)S.props.push({x:(i*(w/7))+rnd(-15,15),baseY:groundY+rnd(0,14),h:rnd(28,60),sway:rnd(0,6.28)});break;
    case 'cacti':for(let i=0;i<6;i++)S.props.push({x:(i*(w/6))+rnd(-14,14),baseY:groundY+rnd(0,12),h:rnd(20,44),arms:Math.random()>.4});break;
    case 'lighthouse':S.props.push({x:w*.16,baseY:groundY-6,h:70,beam:0});break;
    case 'geysers':for(let i=0;i<5;i++)S.props.push({x:(i*(w/5))+rnd(-10,10),baseY:groundY+rnd(0,10),h:rnd(12,20),burst:rnd(0,6.28)});break;
    case 'banners':for(let i=0;i<4;i++)S.props.push({x:(i*(w/4))+w/8,baseY:groundY,w:rnd(18,26),h:rnd(50,90),wave:rnd(0,6.28)});break;
    case 'stalactites':for(let i=0;i<8;i++)S.props.push({x:rnd(0,w),h:rnd(30,70),drip:rnd(0,6.28)});
      for(let i=0;i<6;i++)S.props.push({x:rnd(0,w),stalag:true,h:rnd(20,40),baseY:groundY+16});break;
    case 'icebergs':for(let i=0;i<6;i++)S.props.push({x:(i*(w/6))+rnd(-12,12),baseY:groundY+rnd(0,14),h:rnd(26,58),w:rnd(24,40)});break;
    case 'reeds':for(let i=0;i<16;i++)S.props.push({x:rnd(0,w),baseY:groundY+rnd(0,16),h:rnd(20,44),sway:rnd(0,6.28)});break;
    case 'shards':for(let i=0;i<9;i++)S.props.push({x:rnd(0,w),y:rnd(h*.3,h*.65),size:rnd(6,14),rot:rnd(0,6.28),rotSpd:rnd(-.02,.02),bob:rnd(0,6.28),hue:rnd(0,360)});break;
    case 'warPillars':for(let i=0;i<6;i++)S.props.push({x:(i*(w/6))+rnd(-10,10),baseY:groundY+rnd(0,10),h:rnd(30,58),tilt:rnd(-.15,.2),crack:rnd(0,6.28)});break;
    case 'platforms':for(let i=0;i<5;i++)S.props.push({x:rnd(0,w),y:h*.25+rnd(0,h*.3),w:rnd(30,70),bob:rnd(0,6.28),spd:rnd(.2,.5)});break;
    case 'boneSpikes':for(let i=0;i<8;i++)S.props.push({x:(i*(w/8))+rnd(-10,10),baseY:groundY+rnd(0,12),h:rnd(20,44),curve:rnd(-.3,.3)});break;
    case 'ruinColumns':for(let i=0;i<6;i++)S.props.push({x:(i*(w/6))+rnd(-10,10),baseY:groundY+rnd(0,10),h:rnd(20,44),tilt:rnd(-.15,.15),vine:rnd(0,6.28)});break;
    case 'coral':for(let i=0;i<8;i++)S.props.push({x:(i*(w/8))+rnd(-10,10),baseY:groundY+rnd(0,10),h:rnd(16,36),branch:Math.floor(rnd(2,4)),sway:rnd(0,6.28)});break;
    case 'skyDebris':for(let i=0;i<10;i++)S.props.push({x:rnd(0,w),y:rnd(h*.3,h*.9),size:rnd(4,12),rot:rnd(0,6.28),rotSpd:rnd(-.01,.01),drift:rnd(-.15,.15),hue:rnd(0,360)});break;
    case 'gears':for(let i=0;i<5;i++)S.props.push({x:rnd(0,w),y:rnd(h*.2,h*.55),r:rnd(10,22),rot:rnd(0,6.28),spd:rnd(-.015,.015)*(Math.random()>.5?1:-1)});break;
    case 'wreckage':for(let i=0;i<8;i++)S.props.push({x:rnd(0,w),y:rnd(h*.25,h*.85),size:rnd(6,16),rot:rnd(0,6.28),rotSpd:rnd(-.006,.006),drift:rnd(-.1,.1),lit:rnd(0,6.28)});break;
    case 'dataCubes':for(let i=0;i<7;i++)S.props.push({x:rnd(0,w),y:rnd(h*.15,h*.6),s:rnd(8,16),rot:rnd(0,6.28),spd:rnd(.005,.02)});break;
    case 'anvils':for(let i=0;i<4;i++)S.props.push({x:(i*(w/4))+w/8,baseY:groundY,spark:rnd(0,6.28)});break;
    case 'voidRocks':for(let i=0;i<7;i++)S.props.push({x:rnd(0,w),y:rnd(h*.35,h*.95),size:rnd(5,14),rot:rnd(0,6.28),rotSpd:rnd(-.008,.008),bob:rnd(0,6.28)});break;
    case 'monoliths':{const c=4;for(let i=0;i<c;i++)S.props.push({x:(i*(w/c))+w/(c*2),baseY:groundY,h:rnd(70,110),glow:rnd(0,6.28),
      motes:Array.from({length:5},()=>({ang:rnd(0,6.28),r:rnd(10,20),spd:rnd(.01,.03)}))});}break;
    case 'pendulums':for(let i=0;i<4;i++)S.props.push({x:(i*(w/4))+w/8,y:h*.28+rnd(0,20),len:rnd(50,80),phase:rnd(0,6.28),r:rnd(8,14)});break;
    case 'wisps':for(let i=0;i<7;i++)S.props.push({x:rnd(0,w),baseY:groundY+rnd(-10,20),h:rnd(30,60),phase:rnd(0,6.28)});break;
    case 'statues':{const c=5;for(let i=0;i<c;i++)S.props.push({x:(i*(w/c))+w/(c*2),baseY:groundY,h:rnd(60,95),glow:rnd(0,6.28)});}break;
    case 'shatterDebris':for(let i=0;i<10;i++)S.props.push({x:rnd(0,w),y:rnd(h*.3,h*.9),size:rnd(4,12),rot:rnd(0,6.28),rotSpd:rnd(-.015,.015),drift:rnd(-.15,.15),hue:rnd(260,340)});break;
  }
  S.fireflies=[];if(cfg.fireflies)for(let i=0;i<10;i++)S.fireflies.push({x:rnd(0,w),y:rnd(h*.4,h*.72),phase:rnd(0,6.28),spd:rnd(.3,.7),trail:[],rad:rnd(20,50),ang:rnd(0,6.28)});
  S.dustDevils=[];if(cfg.dustDevils)for(let i=0;i<2;i++)S.dustDevils.push({x:rnd(w*.2,w*.8),baseY:groundY,ang:0,h:rnd(30,50)});
  S.motes=[];if(cfg.motes)for(let i=0;i<8;i++)S.motes.push({ang:rnd(0,6.28),r:rnd(30,70),spd:rnd(.005,.015),size:rnd(1.2,2.4)});
  S.bubbles=[];if(cfg.bubbles)for(let i=0;i<14;i++)S.bubbles.push({x:rnd(0,w),y:rnd(h*.3,h*.95),r:rnd(1,3),spd:rnd(.3,.8),wob:rnd(0,6.28)});
  S.orbs=[];if(cfg.orbs)for(let i=0;i<6;i++)S.orbs.push({x:rnd(w*.1,w*.9),y:rnd(h*.25,h*.6),r:rnd(3,6),phase:rnd(0,6.28),spd:rnd(.1,.25),hue:rnd(160,200)});
  S.gulls=[];if(cfg.gulls)for(let i=0;i<4;i++)S.gulls.push({x:rnd(0,w),y:rnd(h*.15,h*.4),phase:rnd(0,6.28),spd:rnd(.15,.35)});
  S.ambient=[];for(let i=0;i<7;i++)S.ambient.push({x:rnd(0,w),y:rnd(0,h),r:rnd(.8,1.8),spd:rnd(.05,.15),phase:rnd(0,6.28)});
  S.crackLines=[];if(cfg.crackOverlay)for(let i=0;i<4;i++){const pts=[];let cx=rnd(0,w),cy=0;pts.push([cx,cy]);
    for(let s=0;s<6;s++){cx+=rnd(-60,60);cy+=h/6;pts.push([cx,cy]);}S.crackLines.push(pts);}
}

/* ---- bodies ---- */
function drawBody(ctx,w,h,cfg,S){
  if(!cfg.body)return;const t=S.t,bx=cfg.body.x*w,by=cfg.body.y*h,r=cfg.body.r;
  ctx.save();ctx.globalAlpha=.4+.08*Math.sin(t*.01);
  const rays=ctx.createRadialGradient(bx,by,r*.5,bx,by,w*.6);rays.addColorStop(0,cfg.body.glow);rays.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=rays;ctx.fillRect(0,0,w,h*.72);ctx.restore();
  const halo=ctx.createRadialGradient(bx,by,0,bx,by,r*2.3);halo.addColorStop(0,cfg.body.glow);halo.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=halo;ctx.beginPath();ctx.arc(bx,by,r*2.3,0,7);ctx.fill();
  const type=cfg.body.type;
  /* ── types added in the rebuild ─────────────────────────────────────────
     The set was moon and sun, both a flat disc, in all 25 scenes. These give
     a world something to be lit by that belongs to it. */
  if(type==='eclipse'){
    /* a dark disc with a burning rim */
    const cor=ctx.createRadialGradient(bx,by,r*.9,bx,by,r*2.6);
    cor.addColorStop(0,cfg.body.color);cor.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=cor;ctx.beginPath();ctx.arc(bx,by,r*2.6,0,7);ctx.fill();
    ctx.fillStyle='#05050a';ctx.beginPath();ctx.arc(bx,by,r,0,7);ctx.fill();
    ctx.strokeStyle=cfg.body.color;ctx.lineWidth=1.6;ctx.globalAlpha=.85;
    ctx.beginPath();ctx.arc(bx,by,r+1,0,7);ctx.stroke();ctx.globalAlpha=1;
  }else if(type==='rift'){
    /* a tear rather than a body — a vertical slit that breathes */
    const hgt=r*3.4+Math.sin(t*.03)*r*.3;
    const g=ctx.createLinearGradient(bx-r*.5,by,bx+r*.5,by);
    g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.5,cfg.body.color);g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(bx,by,r*.42,hgt*.5,0,0,7);ctx.fill();
    ctx.strokeStyle=cfg.body.color;ctx.globalAlpha=.55;ctx.lineWidth=1;
    ctx.beginPath();ctx.ellipse(bx,by,r*.20,hgt*.36,0,0,7);ctx.stroke();ctx.globalAlpha=1;
  }else if(type==='ringed'){
    ctx.fillStyle=cfg.body.color;ctx.beginPath();ctx.arc(bx,by,r,0,7);ctx.fill();
    ctx.strokeStyle=cfg.body.color;ctx.globalAlpha=.45;ctx.lineWidth=1.6;
    for(let i=0;i<3;i++){ctx.beginPath();
      ctx.ellipse(bx,by,r*(1.7+i*.28),r*(.34+i*.05),-.32,0,7);ctx.stroke();}
    ctx.globalAlpha=1;
  }else if(type==='binary'){
    const sep=r*1.5,a=t*.006;
    [[Math.cos(a)*sep,Math.sin(a)*sep*.4,r*.8],[-Math.cos(a)*sep,-Math.sin(a)*sep*.4,r*.55]]
      .forEach(([dx,dy,rr])=>{ctx.fillStyle=cfg.body.color;ctx.beginPath();ctx.arc(bx+dx,by+dy,rr,0,7);ctx.fill();});
  }else if(type==='shattered'){
    /* a broken moon: the disc, then its pieces drifting off */
    ctx.fillStyle=cfg.body.color;ctx.beginPath();ctx.arc(bx,by,r,0,7);ctx.fill();
    ctx.fillStyle='#05050a';ctx.beginPath();
    ctx.moveTo(bx-r*.2,by-r);ctx.lineTo(bx+r*.15,by);ctx.lineTo(bx-r*.1,by+r);
    ctx.lineTo(bx+r*.5,by+r*.6);ctx.lineTo(bx+r*.6,by-r*.7);ctx.closePath();ctx.fill();
    for(let i=0;i<5;i++){const a=i*1.3+t*.004,d=r*(1.5+i*.28);
      ctx.fillStyle=cfg.body.color;ctx.globalAlpha=.5;
      ctx.beginPath();ctx.arc(bx+Math.cos(a)*d,by+Math.sin(a)*d*.5,r*.09,0,7);ctx.fill();}
    ctx.globalAlpha=1;
  }else if(type==='moon'){ctx.fillStyle=cfg.body.color;ctx.beginPath();ctx.arc(bx,by,r,0,7);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.12)';ctx.beginPath();ctx.arc(bx-r*.35,by-r*.2,r*.22,0,7);ctx.fill();
    ctx.beginPath();ctx.arc(bx+r*.3,by+r*.3,r*.15,0,7);ctx.fill();
  }else if(type==='sun'){ctx.fillStyle=cfg.body.color;ctx.beginPath();ctx.arc(bx,by,r,0,7);ctx.fill();
    ctx.strokeStyle=cfg.body.color;ctx.globalAlpha=.5;ctx.lineWidth=2;
    for(let i=0;i<8;i++){const a=(i/8)*Math.PI*2+t*.004;ctx.beginPath();ctx.moveTo(bx+Math.cos(a)*(r+4),by+Math.sin(a)*(r+4));
      ctx.lineTo(bx+Math.cos(a)*(r+12),by+Math.sin(a)*(r+12));ctx.stroke();}
    ctx.globalAlpha=1;
    if(cfg.motes)S.motes.forEach(m=>{m.ang+=m.spd;const mx=bx+Math.cos(m.ang)*m.r,my=by+Math.sin(m.ang)*m.r*.5;
      ctx.fillStyle='rgba(255,240,200,.8)';ctx.beginPath();ctx.arc(mx,my,m.size,0,7);ctx.fill();});
  }else if(type==='rift'){ctx.save();ctx.translate(bx,by);ctx.rotate(t*.006);
    ctx.strokeStyle=cfg.body.color;ctx.lineWidth=2;ctx.globalAlpha=.8;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,r*(.5+i*.35),r*.22,i*.5,0,7);ctx.stroke();}
    ctx.restore();ctx.fillStyle='#020a14';ctx.beginPath();ctx.ellipse(bx,by,r*.4,r*.18,.3,0,7);ctx.fill();
  }else if(type==='eye'){ctx.save();ctx.strokeStyle=`rgba(255,255,255,${.12+.06*Math.sin(t*.02)})`;ctx.lineWidth=1;
    for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2+.3;ctx.beginPath();ctx.moveTo(bx+Math.cos(a)*r*1.2,by+Math.sin(a)*r*1.2);
      ctx.lineTo(bx+Math.cos(a)*r*2.3,by+Math.sin(a)*r*2.3);ctx.stroke();}
    ctx.restore();const iris=ctx.createRadialGradient(bx,by,0,bx,by,r);
    iris.addColorStop(0,'#1a0500');iris.addColorStop(.7,cfg.body.color);iris.addColorStop(1,'#0a0200');
    ctx.fillStyle=iris;ctx.beginPath();ctx.arc(bx,by,r,0,7);ctx.fill();
    const pg=.6+.4*Math.sin(t*.05);ctx.fillStyle=cfg.body.color;ctx.globalAlpha=.8+pg*.2;
    ctx.beginPath();ctx.ellipse(bx,by,r*.18,r*.85,0,0,7);ctx.fill();ctx.globalAlpha=1;
  }else if(type==='crystal'){ctx.fillStyle=cfg.body.color;
    ctx.beginPath();ctx.moveTo(bx,by-r);ctx.lineTo(bx+r*.7,by);ctx.lineTo(bx,by+r);ctx.lineTo(bx-r*.7,by);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=1;ctx.stroke();
  }else if(type==='vortex'){ctx.save();ctx.translate(bx,by);
    for(let i=0;i<5;i++){ctx.rotate(.35+t*.012*(i%2===0?1:-1));ctx.strokeStyle=cfg.body.color;ctx.globalAlpha=.5-i*.07;ctx.lineWidth=1.6;
      ctx.beginPath();ctx.ellipse(0,0,r*(.35+i*.28),r*.12,0,0,7);ctx.stroke();}
    ctx.restore();ctx.globalAlpha=1;ctx.fillStyle='#05061a';ctx.beginPath();ctx.arc(bx,by,r*.22,0,7);ctx.fill();
  }else if(type==='clockface'){ctx.fillStyle='#241608';ctx.beginPath();ctx.arc(bx,by,r,0,7);ctx.fill();
    ctx.strokeStyle=cfg.body.color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(bx,by,r-2,0,7);ctx.stroke();
    for(let i=0;i<12;i++){const a=(i/12)*Math.PI*2;ctx.strokeStyle=cfg.body.color;ctx.globalAlpha=.7;ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(bx+Math.cos(a)*(r-6),by+Math.sin(a)*(r-6));ctx.lineTo(bx+Math.cos(a)*(r-2),by+Math.sin(a)*(r-2));ctx.stroke();}
    ctx.globalAlpha=1;const ha=t*.006,ma=t*.02;ctx.strokeStyle=cfg.body.color;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(ha)*r*.5,by+Math.sin(ha)*r*.5);ctx.stroke();
    ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+Math.cos(ma)*r*.75,by+Math.sin(ma)*r*.75);ctx.stroke();
  }else if(type==='singularity'){ctx.save();ctx.translate(bx,by);ctx.rotate(t*.01);
    for(let i=0;i<3;i++){ctx.strokeStyle=`rgba(230,230,255,${.3-i*.08})`;ctx.lineWidth=1;
      ctx.beginPath();ctx.ellipse(0,0,r*(1.3+i*.5),r*.35,i*.6,0,7);ctx.stroke();}
    ctx.restore();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(bx,by,r*.6,0,7);ctx.fill();
    ctx.strokeStyle='rgba(230,230,255,.5)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(bx,by,r*.6,0,7);ctx.stroke();}
}

/* ---- sky layers ---- */
function drawAurora(ctx,w,h,cfg,S){if(!cfg.aurora)return;const t=S.t;
  for(let b=0;b<3;b++){ctx.beginPath();const baseY=h*(.06+b*.06);ctx.moveTo(0,baseY);
    for(let x=0;x<=w;x+=14){const y=baseY+Math.sin(x*.012+t*.015+b*1.7)*16+Math.sin(x*.03+t*.008)*6;ctx.lineTo(x,y);}
    ctx.lineTo(w,baseY+70);ctx.lineTo(0,baseY+70);ctx.closePath();
    const hue=cfg.auroraHue[0]+(cfg.auroraHue[1]-cfg.auroraHue[0])*(b/3);
    const g=ctx.createLinearGradient(0,baseY-10,0,baseY+70);g.addColorStop(0,`hsla(${hue},90%,65%,.22)`);g.addColorStop(1,`hsla(${hue},90%,65%,0)`);
    ctx.fillStyle=g;ctx.fill();}}
function drawClouds(ctx,cfg,S){S.clouds.forEach(c=>{c.x-=c.spd;if(c.x<-c.w)c.x=900+c.w;ctx.fillStyle=cfg.cloud.color;
  ctx.beginPath();ctx.ellipse(c.x,c.y,c.w*.5,c.hh,0,0,7);ctx.ellipse(c.x-c.w*.28,c.y+3,c.w*.32,c.hh*.75,0,0,7);
  ctx.ellipse(c.x+c.w*.28,c.y+2,c.w*.34,c.hh*.8,0,0,7);ctx.fill();});}
function drawParticles(ctx,h,cfg,S){const t=S.t;ctx.save();S.particles.forEach(p=>{
  let alpha=cfg.particle.type==='star'?.5+.5*Math.sin(t*.03+p.phase):.85,color=cfg.particle.color;
  if(cfg.particle.cycle)color=`hsla(${(t*2+p.phase*50)%360},85%,65%,${alpha})`;
  ctx.globalAlpha=cfg.particle.cycle?1:alpha;ctx.fillStyle=color;let px=p.x,py=p.y;
  if(cfg.particle.type==='snow'||cfg.particle.type==='ember'){py=(p.y+t*p.spd*(cfg.particle.type==='ember'?-1:1))%(h*.7);
    px=p.x+Math.sin(t*.02+p.phase)*8;ctx.beginPath();ctx.arc(px,py<0?py+h*.7:py,p.r,0,7);ctx.fill();
  }else if(cfg.particle.type==='ghost'){const gx=p.x+Math.sin(t*.008+p.phase)*20,gy=(p.y+Math.sin(t*.006+p.phase*1.3)*14+h*.3)%(h*.8);
    const a=.15+.15*Math.sin(t*.02+p.phase*2);const gr=ctx.createRadialGradient(gx,gy,0,gx,gy,6);
    gr.addColorStop(0,`rgba(200,216,255,${a})`);gr.addColorStop(1,'rgba(200,216,255,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(gx,gy,6,0,7);ctx.fill();
  }else{ctx.beginPath();ctx.arc(px,py,p.r,0,7);ctx.fill();}});ctx.restore();}
function drawConstellations(ctx,cfg,S){if(!cfg.constellations)return;const pts=S.particles.slice(0,6);
  ctx.strokeStyle=`rgba(255,255,255,${.12+.06*Math.sin(S.t*.02)})`;ctx.lineWidth=.6;
  for(let i=0;i<pts.length-1;i++){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[i+1].x,pts[i+1].y);ctx.stroke();}}
function drawFireflies(ctx,S){const t=S.t;S.fireflies.forEach(f=>{f.ang+=f.spd*.02;
  const fx=f.x+Math.cos(f.ang)*f.rad*.3,fy=f.y+Math.sin(f.ang*1.3)*f.rad*.2;
  f.trail.push({x:fx,y:fy});if(f.trail.length>8)f.trail.shift();
  f.trail.forEach((pt,i)=>{const a=(i/f.trail.length)*.35;ctx.fillStyle=`rgba(230,255,150,${a})`;ctx.beginPath();ctx.arc(pt.x,pt.y,1.4,0,7);ctx.fill();});
  const glow=.5+.5*Math.sin(t*.06+f.phase);ctx.fillStyle=`rgba(230,255,150,${glow})`;ctx.beginPath();ctx.arc(fx,fy,1.8,0,7);ctx.fill();});}
function drawGulls(ctx,S){S.gulls.forEach(g=>{g.x+=g.spd;if(g.x>920)g.x=-20;const gy=g.y+Math.sin(S.t*.02+g.phase)*6;
  ctx.strokeStyle='rgba(20,20,30,.5)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(g.x-5,gy);ctx.quadraticCurveTo(g.x,gy-4,g.x+5,gy);
  ctx.moveTo(g.x-5,gy);ctx.quadraticCurveTo(g.x,gy+3,g.x+5,gy);ctx.stroke();});}
function drawDustDevils(ctx,S){S.dustDevils.forEach(d=>{d.ang+=.25;ctx.save();ctx.translate(d.x,d.baseY);
  for(let i=0;i<d.h;i+=4){const wob=Math.sin(d.ang+i*.3)*(3+i*.08);ctx.fillStyle=`rgba(200,150,90,${.12-i/d.h*.1})`;ctx.beginPath();ctx.arc(wob,-i,2.5-i*.01,0,7);ctx.fill();}
  ctx.restore();});}
function drawBubbles(ctx,h,S){S.bubbles.forEach(b=>{b.y-=b.spd;if(b.y<h*.25)b.y=h*.95;const bx=b.x+Math.sin(S.t*.03+b.wob)*4;
  ctx.strokeStyle='rgba(150,230,255,.35)';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(bx,b.y,b.r,0,7);ctx.stroke();});}
function drawOrbs(ctx,S){S.orbs.forEach(o=>{o.y+=Math.sin(S.t*.01+o.phase)*.15;o.x+=Math.cos(S.t*.008+o.phase)*.1;
  const glow=.4+.4*Math.sin(S.t*.04+o.phase);const g=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r*4);
  g.addColorStop(0,`hsla(${o.hue},90%,70%,${glow})`);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(o.x,o.y,o.r*4,0,7);ctx.fill();
  ctx.fillStyle=`hsla(${o.hue},95%,80%,${glow+.3})`;ctx.beginPath();ctx.arc(o.x,o.y,o.r*.5,0,7);ctx.fill();});}
function drawLightning(ctx,w,h,cfg,S){if(!cfg.lightning)return;const t=S.t;
  if(Math.floor(t/70)%9===0&&(t%70)<3){ctx.fillStyle='rgba(200,240,255,.12)';ctx.fillRect(0,0,w,h*.72);}}

/* ════════════════════════════════════════════════════════════════════════
   HORIZON PROFILES

   Every 'hills' scene used to call one function — baseY minus two absolute
   sines — so Forest Fringe, Volcanic Valley and Ancient Ruins were literally
   the same silhouette in three tints. That is the single biggest reason the
   set read as one backdrop re-coloured 51 times.

   A profile is just (x, w, baseY, amp, seed, off) → y. A scene names one per
   parallax depth, so the far ridge can be jagged peaks while the near bank is
   soft dunes. Everything is derived from the seed, so a given stage draws the
   same land every time you enter it — no reshuffling between battles.
   ════════════════════════════════════════════════════════════════════════ */

/* deterministic value noise: same stage, same land, every time */
function sHash(n){n=(n<<13)^n;return 1-((n*(n*n*15731+789221)+1376312589)&0x7fffffff)/1073741824;}
function sNoise(x,seed){
  const i=Math.floor(x),f=x-i,u=f*f*(3-2*f);
  return sHash(i+seed)*(1-u)+sHash(i+1+seed)*u;
}
/* fractal noise — a couple of octaves is enough for a horizon */
function sFbm(x,seed,oct){
  let v=0,a=.5,fq=1;
  for(let i=0;i<(oct||3);i++){v+=sNoise(x*fq,seed+i*97)*a;a*=.5;fq*=2;}
  return v;
}

const PROFILES={
  /* soft rolling land — the old default, kept for the scenes it suits */
  hills(x,w,base,amp,seed,off){
    const u=(x-off)*.02;
    return base-Math.abs(Math.sin(u+seed*.7)*amp)-Math.abs(Math.sin(u*2.5+seed)*amp*.5);
  },
  /* sharp mountain teeth — frost peaks, chaos wastes */
  peaks(x,w,base,amp,seed,off){
    const u=(x-off)/w*7;
    const t=Math.abs((u%2)-1);                 // triangle wave
    return base-(t*amp*1.5)-sFbm(u*3,seed,2)*amp*.35;
  },
  /* flat-topped plateaux with sheer sides — ruins, mesa country */
  mesa(x,w,base,amp,seed,off){
    const u=(x-off)/w*5;
    const step=Math.floor(u);
    const hgt=(sHash(step+seed)*.5+.5)*amp*1.3;
    const edge=Math.min(1,Math.abs(u-step-.5)*6);   // sheer near the edges
    return base-hgt*(1-edge*.25);
  },
  /* wind-shaped dunes — long lee slope, short windward face */
  dunes(x,w,base,amp,seed,off){
    const u=(x-off)/w*4;
    const f=u-Math.floor(u);
    const ridge=Math.pow(f,.55)*(1-f)*4;            // asymmetric hump
    return base-ridge*amp*.9-sFbm(u*2,seed,2)*amp*.2;
  },
  /* faceted shards — crystal fields, the margin's glassier worlds */
  crystal(x,w,base,amp,seed,off){
    const u=(x-off)/w*9;
    const step=Math.floor(u),f=u-step;
    const hgt=(sHash(step*3+seed)*.5+.5)*amp*1.6;
    return base-hgt*(1-Math.abs(f-.5)*2*.85);       // a spike per cell
  },
  /* a broken skyline — towers and stumps of a city that fell */
  ruins(x,w,base,amp,seed,off){
    const u=(x-off)/w*11;
    const step=Math.floor(u);
    const r=sHash(step*7+seed)*.5+.5;
    const hgt=(r<.28?0:r)*amp*1.5;                  // gaps where nothing stands
    return base-hgt;
  },
  /* a canyon rim: mostly level, cut by deep clefts */
  canyon(x,w,base,amp,seed,off){
    const u=(x-off)/w*6;
    const cleft=Math.pow(Math.abs(Math.sin(u*1.7+seed)),14);
    return base-amp*.55+cleft*amp*1.4;
  },
  /* needle spires — cathedral, citadel, anything vertical */
  spires(x,w,base,amp,seed,off){
    const u=(x-off)/w*13;
    const step=Math.floor(u),f=Math.abs(u-step-.5)*2;
    const r=sHash(step*11+seed)*.5+.5;
    return base-(f>.35?0:(1-f/.35))*r*amp*2.1;
  },
  /* a treeline: dense, bumpy, close-packed crowns */
  forestline(x,w,base,amp,seed,off){
    const u=(x-off)*.09;
    return base-amp*.55-Math.abs(Math.sin(u+seed))*amp*.3-sFbm(u,seed,3)*amp*.5;
  },
  /* still water or a dead flat plain */
  flat(x,w,base,amp,seed,off){
    return base-sFbm((x-off)*.01,seed,2)*amp*.12;
  },
  /* a swell — swamps, seas, anything that moves */
  waves(x,w,base,amp,seed,off){
    const u=(x-off)*.025;
    return base-Math.sin(u+seed)*amp*.4-Math.sin(u*2.3+seed*2)*amp*.2;
  },
};

/* Build one horizon. `kind` names a profile; amp scales it; off scrolls it. */
function hillPath(w,h,baseY,off,a1,a2,ph,kind,seed){
  const fn=PROFILES[kind]||PROFILES.hills;
  const amp=a1+a2, sd=(seed==null?1:seed)+ph;
  const step=(kind==='ruins'||kind==='spires'||kind==='crystal')?4:8;
  const pts=[];
  for(let x=0;x<=w;x+=step)pts.push([x,fn(x,w,baseY,amp,sd,off)]);
  if(pts[pts.length-1][0]<w)pts.push([w,fn(w,w,baseY,amp,sd,off)]);
  return pts;
}
function drawHillLayer(ctx,pts,fill,w,bottomY,rim,rimColor){ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.forEach(p=>ctx.lineTo(p[0],p[1]));
  ctx.lineTo(w,bottomY);ctx.lineTo(0,bottomY);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
  if(rim){ctx.strokeStyle=rimColor;ctx.lineWidth=1.4;ctx.globalAlpha=.35;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.stroke();ctx.globalAlpha=1;}}
function drawVolcanoSilhouette(ctx,w,h,cfg,S){const t=S.t,apexX=w*.62,apexY=h*.34,baseY=h*.62;ctx.fillStyle=cfg.far;
  ctx.beginPath();ctx.moveTo(apexX,apexY);ctx.lineTo(apexX-90,baseY);ctx.lineTo(apexX+90,baseY);ctx.closePath();ctx.fill();
  const crater=ctx.createRadialGradient(apexX,apexY+4,0,apexX,apexY+4,16);crater.addColorStop(0,'rgba(255,160,60,.7)');crater.addColorStop(1,'rgba(255,90,20,0)');
  ctx.fillStyle=crater;ctx.beginPath();ctx.arc(apexX,apexY+4,16,0,7);ctx.fill();
  ctx.strokeStyle='rgba(160,160,170,.25)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(apexX,apexY-2);
  for(let i=0;i<5;i++)ctx.lineTo(apexX+Math.sin(t*.02+i)*10,apexY-14-i*10);ctx.stroke();}
function drawChasm(ctx,w,h){const edgeY=h*.66;ctx.fillStyle='#12151a';ctx.beginPath();ctx.moveTo(0,edgeY);
  let x=0;while(x<=w){x+=rnd(14,34);const y=edgeY+Math.sin(x*.05+7.3)*5+(Math.sin(x*.3+11)>.6?rnd(6,16):0);ctx.lineTo(Math.min(x,w),y);}
  ctx.lineTo(w,h*.72);ctx.lineTo(0,h*.72);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(160,170,190,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,edgeY);x=0;
  while(x<=w){x+=rnd(14,34);const y=edgeY+Math.sin(x*.05+7.3)*5+(Math.sin(x*.3+11)>.6?rnd(6,16):0);ctx.lineTo(Math.min(x,w),y);}ctx.stroke();
  const drop=ctx.createLinearGradient(0,edgeY,0,h);drop.addColorStop(0,'#0a0c10');drop.addColorStop(.4,'#040507');drop.addColorStop(1,'#000');
  ctx.fillStyle=drop;ctx.fillRect(0,edgeY,w,h-edgeY);}
/* The cliff line used to be hardcoded — hillPath(...,16,8,.2) with no profile
   and no relief — so every terrain:'sea' scene drew the identical coast, and any
   `profile`/`relief` those scenes declared was dead config. It now reads the
   scene the same way the land branch does, plus a per-scene sea level and wave
   count, which is what separates a cliff coast from an abyssal trench. */
function drawCoast(ctx,w,h,cfg,S,si){const t=S.t;
  const pf=cfg.profile||'hills';
  const kind=(typeof pf==='string')?pf:(pf.far||'hills');
  const amp=cfg.relief||1;
  const sd=(cfg._seed==null?(si|0)*17+3:cfg._seed);
  const cliffPts=hillPath(w,h,h*.5,(t*.06)%160,16*amp,8*amp,.2,kind,sd);
  drawHillLayer(ctx,cliffPts,cfg.far,w,h*.62,false,'');const seaTop=h*(cfg.seaLevel||.6);
  const sg=ctx.createLinearGradient(0,seaTop,0,h);sg.addColorStop(0,cfg.mid);sg.addColorStop(1,cfg.ground[1]);ctx.fillStyle=sg;ctx.fillRect(0,seaTop,w,h-seaTop);
  const bands=cfg.waveBands||4,gap=(h-seaTop)/(bands+1);
  for(let i=0;i<bands;i++){const wy=seaTop+gap*(i+.6);ctx.strokeStyle=`rgba(255,255,255,${Math.max(.03,.14-i*.02)})`;ctx.lineWidth=1.2;ctx.beginPath();
    for(let x=0;x<=w;x+=6)ctx.lineTo(x,wy+Math.sin(x*.04+t*.05+i)*3);ctx.stroke();}
  if(cfg.bubbles)drawBubbles(ctx,h,S);if(cfg.orbs)drawOrbs(ctx,S);if(cfg.gulls)drawGulls(ctx,S);
  drawProps(ctx,w,h,seaTop,cfg,S);}
function drawGridGround(ctx,w,h){const horizon=h*.5,vpX=w*.5;ctx.fillStyle='#020a06';ctx.fillRect(0,horizon,w,h-horizon);
  ctx.strokeStyle='rgba(95,255,154,.35)';ctx.lineWidth=1;
  for(let i=1;i<14;i++){const frac=Math.pow(i/14,2.2),y=horizon+frac*(h-horizon),spread=frac*w*.9;
    ctx.globalAlpha=.15+frac*.35;ctx.beginPath();ctx.moveTo(vpX-spread,y);ctx.lineTo(vpX+spread,y);ctx.stroke();}
  ctx.globalAlpha=.3;for(let i=-6;i<=6;i++){ctx.beginPath();ctx.moveTo(vpX,horizon);ctx.lineTo(vpX+i*w*.09,h);ctx.stroke();}ctx.globalAlpha=1;}

/* ---- ground overlays ---- */
function drawFlow(ctx,w,h,tone,S){const t=S.t,y0=h*.735,y1=h*.79;ctx.save();ctx.beginPath();ctx.moveTo(0,y0);
  for(let x=0;x<=w;x+=10)ctx.lineTo(x,y0+Math.sin(x*.03+t*.02)*4);ctx.lineTo(w,y1);
  for(let x=w;x>=0;x-=10)ctx.lineTo(x,y1+Math.sin(x*.025+t*.018+1.5)*5);ctx.closePath();
  const lg=ctx.createLinearGradient(0,y0,0,y1);lg.addColorStop(0,tone.a);lg.addColorStop(.4,tone.b);lg.addColorStop(1,tone.c);
  ctx.fillStyle=lg;ctx.fill();ctx.clip();ctx.globalAlpha=.5;
  for(let i=0;i<5;i++){const off=(t*1.2+i*140)%(w+200)-100;ctx.fillStyle=tone.vein;ctx.beginPath();ctx.ellipse(off,(y0+y1)/2,60,6,0,0,7);ctx.fill();}
  ctx.restore();const glow=ctx.createLinearGradient(0,y0-24,0,y0);glow.addColorStop(0,'rgba(0,0,0,0)');glow.addColorStop(1,tone.vein);
  ctx.globalAlpha=.4;ctx.fillStyle=glow;ctx.fillRect(0,y0-24,w,24);ctx.globalAlpha=1;}

/* ---- props (25 distinct drawers) ---- */
function drawProps(ctx,w,h,groundY,cfg,S){
  const t=S.t,tone=cfg.propTone,props=S.props;
  switch(cfg.prop){
  case 'trees':props.forEach(p=>{const sway=Math.sin(t*.015+p.sway)*2.5;
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(p.x-2,p.baseY,10,4);ctx.fillStyle=tone.trunk;ctx.fillRect(p.x+2,p.baseY-p.h*.35,4,p.h*.35);
    ctx.fillStyle=tone.canopy;ctx.beginPath();ctx.moveTo(p.x+4+sway,p.baseY-p.h);ctx.lineTo(p.x-10+sway*.6,p.baseY-p.h*.32);ctx.lineTo(p.x+18+sway*.6,p.baseY-p.h*.32);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(p.x+4+sway*1.2,p.baseY-p.h*.7);ctx.lineTo(p.x-7+sway*.8,p.baseY-p.h*.18);ctx.lineTo(p.x+15+sway*.8,p.baseY-p.h*.18);ctx.closePath();ctx.fill();});break;
  case 'cacti':props.forEach(p=>{ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(p.x+4,p.baseY,9,3,0,0,7);ctx.fill();
    ctx.fillStyle=tone.body;ctx.fillRect(p.x,p.baseY-p.h,8,p.h);ctx.fillStyle=tone.dark;
    for(let i=0;i<4;i++)ctx.fillRect(p.x+1+i*2,p.baseY-p.h+2,1,p.h-4);
    if(p.arms){ctx.fillStyle=tone.body;ctx.fillRect(p.x-7,p.baseY-p.h*.6,7,6);ctx.fillRect(p.x-7,p.baseY-p.h*.75,4,p.h*.3);
      ctx.fillRect(p.x+8,p.baseY-p.h*.45,7,6);ctx.fillRect(p.x+11,p.baseY-p.h*.6,4,p.h*.28);}});break;
  case 'lighthouse':{const p=props[0];if(!p)break;p.beam=(p.beam+.03)%6.283;
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(p.x,p.baseY+3,16,4,0,0,7);ctx.fill();
    ctx.fillStyle=tone.stone;ctx.beginPath();ctx.moveTo(p.x-10,p.baseY);ctx.lineTo(p.x-5,p.baseY-p.h);ctx.lineTo(p.x+5,p.baseY-p.h);ctx.lineTo(p.x+10,p.baseY);ctx.closePath();ctx.fill();
    ctx.fillStyle=tone.stripe;for(let i=0;i<4;i++){const yy=p.baseY-p.h+(i*p.h/5),wr=1-(i/6);ctx.fillRect(p.x-9*wr,yy,18*wr,p.h/12);}
    ctx.fillStyle='#2a2a30';ctx.fillRect(p.x-6,p.baseY-p.h-10,12,10);
    const glow=.6+.4*Math.sin(t*.1);ctx.fillStyle=`rgba(255,240,180,${glow})`;ctx.beginPath();ctx.arc(p.x,p.baseY-p.h-6,4,0,7);ctx.fill();
    ctx.save();ctx.translate(p.x,p.baseY-p.h-6);ctx.rotate(p.beam);const beam=ctx.createLinearGradient(0,0,140,0);
    beam.addColorStop(0,'rgba(255,240,180,.25)');beam.addColorStop(1,'rgba(255,240,180,0)');ctx.fillStyle=beam;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(140,-16);ctx.lineTo(140,16);ctx.closePath();ctx.fill();ctx.restore();}break;
  case 'geysers':props.forEach(p=>{ctx.fillStyle=tone.rock;ctx.beginPath();ctx.moveTo(p.x-8,p.baseY);ctx.lineTo(p.x-4,p.baseY-p.h);ctx.lineTo(p.x+4,p.baseY-p.h);ctx.lineTo(p.x+8,p.baseY);ctx.closePath();ctx.fill();
    const burst=Math.max(0,Math.sin(t*.03+p.burst));if(burst>.4)for(let i=0;i<5;i++){const rise=(burst-.4)/.6,py=p.baseY-p.h-rise*30-i*6;
      ctx.fillStyle=tone.steam+(.5-i*.08)+')';ctx.beginPath();ctx.arc(p.x+Math.sin(i+t*.05)*4,py,3+i*.6,0,7);ctx.fill();}});break;
  case 'banners':props.forEach(p=>{const flick=.6+.4*Math.sin(t*.05+p.wave);ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(p.x-p.w/2-2,p.baseY,p.w+4,3);
    ctx.fillStyle=tone.stone;ctx.fillRect(p.x-p.w/2,p.baseY-p.h,p.w,p.h);for(let i=0;i<3;i++)ctx.fillRect(p.x-p.w/2+i*(p.w/3),p.baseY-p.h-4,p.w/3-2,4);
    ctx.fillStyle=tone.stoneLit;ctx.globalAlpha=flick;ctx.fillRect(p.x-3,p.baseY-p.h*.55,6,8);ctx.globalAlpha=1;
    ctx.save();ctx.translate(p.x,p.baseY-p.h*.85);const wob=Math.sin(t*.04+p.wave)*4;ctx.fillStyle=tone.cloth;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(14+wob,4);ctx.lineTo(14+wob,20);ctx.lineTo(6,16);ctx.lineTo(0,24);ctx.closePath();ctx.fill();
    ctx.fillStyle=tone.gold;ctx.fillRect(-1,-2,2,26);ctx.restore();});break;
  case 'stalactites':props.forEach(p=>{if(p.stalag){ctx.fillStyle=tone.top;ctx.beginPath();ctx.moveTo(p.x-6,p.baseY);ctx.lineTo(p.x+6,p.baseY);ctx.lineTo(p.x,p.baseY-p.h);ctx.closePath();ctx.fill();return;}
    const tipY=p.h;ctx.fillStyle=tone.top;ctx.beginPath();ctx.moveTo(p.x-6,-4);ctx.lineTo(p.x+6,-4);ctx.lineTo(p.x,tipY);ctx.closePath();ctx.fill();
    const drip=.3+.4*Math.max(0,Math.sin(t*.02+p.drip));ctx.fillStyle=tone.bottom;ctx.globalAlpha=drip;ctx.beginPath();ctx.arc(p.x,tipY,1.6,0,7);ctx.fill();ctx.globalAlpha=1;});break;
  case 'icebergs':props.forEach(p=>{ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(p.x,p.baseY+3,p.w*.6,4,0,0,7);ctx.fill();
    ctx.fillStyle=tone.light;ctx.beginPath();ctx.moveTo(p.x-p.w/2,p.baseY);ctx.lineTo(p.x-p.w*.2,p.baseY-p.h);ctx.lineTo(p.x+p.w*.1,p.baseY-p.h*.7);ctx.lineTo(p.x+p.w/2,p.baseY);ctx.closePath();ctx.fill();
    ctx.fillStyle=tone.shadow;ctx.beginPath();ctx.moveTo(p.x+p.w*.1,p.baseY-p.h*.7);ctx.lineTo(p.x+p.w*.35,p.baseY-p.h*.4);ctx.lineTo(p.x+p.w/2,p.baseY);ctx.lineTo(p.x+p.w*.1,p.baseY);ctx.closePath();ctx.fill();
    ctx.strokeStyle=tone.crack;ctx.lineWidth=1;ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(p.x-p.w*.1,p.baseY-p.h*.5);ctx.lineTo(p.x+p.w*.05,p.baseY-p.h*.2);ctx.stroke();ctx.globalAlpha=1;});break;
  case 'reeds':props.forEach(p=>{const sway=Math.sin(t*.02+p.sway)*6;ctx.strokeStyle=tone.stalk;ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(p.x,p.baseY);ctx.quadraticCurveTo(p.x+sway*.5,p.baseY-p.h*.6,p.x+sway,p.baseY-p.h);ctx.stroke();
    ctx.fillStyle=tone.tip;ctx.beginPath();ctx.ellipse(p.x+sway,p.baseY-p.h,2,5,.3,0,7);ctx.fill();});break;
  case 'shards':props.forEach(p=>{const y=p.y+Math.sin(t*.03+p.bob)*8;p.rot+=p.rotSpd;ctx.save();ctx.translate(p.x,y);ctx.rotate(p.rot);
    ctx.fillStyle=`hsla(${(p.hue+t*1.5)%360},80%,60%,.55)`;ctx.beginPath();ctx.moveTo(0,-p.size);ctx.lineTo(p.size*.7,0);ctx.lineTo(0,p.size);ctx.lineTo(-p.size*.7,0);ctx.closePath();ctx.fill();ctx.restore();});break;
  case 'warPillars':props.forEach(p=>{ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(p.x-6,p.baseY,16,3);ctx.save();ctx.translate(p.x,0);ctx.rotate(p.tilt);
    ctx.fillStyle=tone.base;ctx.beginPath();ctx.moveTo(-6,p.baseY-p.h);ctx.lineTo(-8,p.baseY);ctx.lineTo(8,p.baseY);ctx.lineTo(6,p.baseY-p.h);ctx.closePath();ctx.fill();
    const cg=.4+.5*Math.sin(t*.04+p.crack);ctx.strokeStyle=tone.crack;ctx.globalAlpha=cg;ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(-2,p.baseY-p.h+4);ctx.lineTo(1,p.baseY-p.h*.6);ctx.lineTo(-1,p.baseY-p.h*.25);ctx.lineTo(2,p.baseY-4);ctx.stroke();ctx.globalAlpha=1;ctx.restore();});break;
  case 'platforms':props.forEach(p=>{const y=p.y+Math.sin(t*p.spd*.03+p.bob)*6;ctx.fillStyle=tone.a;ctx.fillRect(p.x-p.w/2,y,p.w,7);
    ctx.fillStyle=tone.b;ctx.fillRect(p.x-p.w/2,y,p.w,2);const g=ctx.createRadialGradient(p.x,y+4,0,p.x,y+4,p.w*.8);
    g.addColorStop(0,tone.glow);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(p.x-p.w,y-p.w*.5,p.w*2,p.w);});break;
  case 'boneSpikes':props.forEach(p=>{ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(p.x-2,p.baseY,10,3);ctx.save();ctx.translate(p.x,p.baseY);
    ctx.strokeStyle=tone.bone;ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(p.curve*20,-p.h*.6,p.curve*8,-p.h);ctx.stroke();
    ctx.fillStyle=tone.shadow;ctx.beginPath();ctx.arc(p.curve*8,-p.h,2,0,7);ctx.fill();ctx.restore();});break;
  case 'ruinColumns':props.forEach(p=>{ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(p.x-8,p.baseY,20,3);ctx.save();ctx.translate(p.x,0);ctx.rotate(p.tilt);
    ctx.fillStyle=tone.stone;ctx.beginPath();ctx.moveTo(-6,p.baseY);ctx.lineTo(-7,p.baseY-p.h*.7);ctx.lineTo(-2,p.baseY-p.h);ctx.lineTo(5,p.baseY-p.h*.85);ctx.lineTo(6,p.baseY);ctx.closePath();ctx.fill();
    for(let i=0;i<3;i++)ctx.fillRect(-6,p.baseY-p.h*.2*i-6,12,2);ctx.strokeStyle=tone.vine;ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(5,p.baseY-p.h*.6);ctx.quadraticCurveTo(9,p.baseY-p.h*.4,4,p.baseY-p.h*.1);ctx.stroke();ctx.restore();});break;
  case 'coral':props.forEach((p,idx)=>{const sway=Math.sin(t*.02+p.sway)*4,colr=[tone.a,tone.b,tone.c][idx%3];
    ctx.strokeStyle=colr;ctx.lineWidth=2;ctx.lineCap='round';
    for(let b=0;b<p.branch;b++){const bx=p.x+(b-p.branch/2)*5;ctx.beginPath();ctx.moveTo(bx,p.baseY);
      ctx.quadraticCurveTo(bx+sway*.5,p.baseY-p.h*.6,bx+sway+(b-1)*4,p.baseY-p.h);ctx.stroke();}});break;
  case 'skyDebris':props.forEach(p=>{p.y+=Math.sin(t*.01+p.x*.01)*.1;p.x+=p.drift*.3;p.rot+=p.rotSpd;if(p.x<-20)p.x=w+20;if(p.x>w+20)p.x=-20;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=`hsla(${p.hue},30%,60%,.55)`;const s=p.size;
    ctx.beginPath();ctx.moveTo(-s,-s*.6);ctx.lineTo(s*.7,-s);ctx.lineTo(s,s*.4);ctx.lineTo(-s*.3,s);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.15)';ctx.lineWidth=.6;ctx.stroke();ctx.restore();});break;
  case 'gears':props.forEach(p=>{p.rot+=p.spd;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=tone.a;ctx.beginPath();ctx.arc(0,0,p.r,0,7);ctx.fill();
    ctx.fillStyle=tone.b;for(let i=0;i<8;i++){const a=(i/8)*Math.PI*2;ctx.save();ctx.rotate(a);ctx.fillRect(-2,-p.r-4,4,6);ctx.restore();}
    ctx.fillStyle=tone.a;ctx.beginPath();ctx.arc(0,0,p.r*.35,0,7);ctx.fill();ctx.restore();});break;
  case 'wreckage':props.forEach(p=>{p.x+=p.drift*.2;p.rot+=p.rotSpd;p.y+=Math.sin(t*.008+p.lit)*.05;if(p.x<-20)p.x=w+20;if(p.x>w+20)p.x=-20;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=tone.a;
    ctx.beginPath();ctx.moveTo(-p.size,0);ctx.lineTo(0,-p.size*.7);ctx.lineTo(p.size,0);ctx.lineTo(p.size*.3,p.size*.6);ctx.closePath();ctx.fill();
    ctx.fillStyle=tone.b;ctx.fillRect(-p.size*.3,-p.size*.2,p.size*.5,p.size*.3);
    const flick=.4+.4*Math.max(0,Math.sin(t*.06+p.lit));ctx.fillStyle=tone.window;ctx.globalAlpha=flick;ctx.fillRect(-1,-1,2,2);ctx.globalAlpha=1;ctx.restore();});break;
  case 'dataCubes':props.forEach(p=>{p.rot+=p.spd;ctx.save();ctx.translate(p.x,p.y);ctx.strokeStyle=tone.line;ctx.lineWidth=1;ctx.globalAlpha=.65+.25*Math.sin(t*.04+p.rot);
    const s=p.s,off=s*.35;ctx.strokeRect(-s/2,-s/2,s,s);ctx.strokeRect(-s/2+off,-s/2-off,s,s);ctx.beginPath();
    ctx.moveTo(-s/2,-s/2);ctx.lineTo(-s/2+off,-s/2-off);ctx.moveTo(s/2,-s/2);ctx.lineTo(s/2+off,-s/2-off);
    ctx.moveTo(-s/2,s/2);ctx.lineTo(-s/2+off,s/2-off);ctx.moveTo(s/2,s/2);ctx.lineTo(s/2+off,s/2-off);ctx.stroke();ctx.globalAlpha=1;ctx.restore();});break;
  case 'anvils':props.forEach(p=>{ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(p.x,p.baseY+2,14,3,0,0,7);ctx.fill();
    ctx.fillStyle=tone.body;ctx.fillRect(p.x-10,p.baseY-10,20,8);ctx.fillRect(p.x-4,p.baseY-22,8,12);ctx.fillRect(p.x-13,p.baseY-24,10,4);
    const sparkA=.4+.5*Math.max(0,Math.sin(t*.08+p.spark));ctx.fillStyle=tone.lit;ctx.globalAlpha=sparkA;
    for(let i=0;i<3;i++){const sy=p.baseY-24-((t*1.5+i*20+p.spark*10)%40);ctx.beginPath();ctx.arc(p.x-8+i*3,sy,1.2,0,7);ctx.fill();}ctx.globalAlpha=1;});break;
  case 'voidRocks':props.forEach(p=>{p.rot+=p.rotSpd;const y=p.y+Math.sin(t*.01+p.bob)*3;ctx.save();ctx.translate(p.x,y);ctx.rotate(p.rot);
    ctx.fillStyle=tone.a;ctx.beginPath();ctx.moveTo(-p.size,-p.size*.4);ctx.lineTo(0,-p.size);ctx.lineTo(p.size,-p.size*.2);ctx.lineTo(p.size*.4,p.size);ctx.lineTo(-p.size*.6,p.size*.6);ctx.closePath();ctx.fill();
    ctx.strokeStyle=tone.b;ctx.lineWidth=.6;ctx.stroke();ctx.restore();});break;
  case 'monoliths':props.forEach(p=>{const glow=.45+.35*Math.sin(t*.025+p.glow),topY=p.baseY-p.h,w1=9;
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(p.x,p.baseY+3,16,4,0,0,7);ctx.fill();
    const beam=ctx.createLinearGradient(0,0,0,p.baseY);beam.addColorStop(0,tone.glow+'0)');beam.addColorStop(.85,tone.glow+(glow*.12)+')');beam.addColorStop(1,tone.glow+(glow*.25)+')');
    ctx.fillStyle=beam;ctx.fillRect(p.x-2,0,4,p.baseY);ctx.fillStyle=tone.body;
    ctx.beginPath();ctx.moveTo(p.x-w1,p.baseY);ctx.lineTo(p.x-w1*.6,topY+10);ctx.lineTo(p.x,topY);ctx.lineTo(p.x+w1*.6,topY+10);ctx.lineTo(p.x+w1,p.baseY);ctx.closePath();ctx.fill();
    const faceGrad=ctx.createLinearGradient(p.x-w1,0,p.x+w1,0);faceGrad.addColorStop(0,tone.face+(glow*.15)+')');faceGrad.addColorStop(.5,tone.face+(glow*.55)+')');faceGrad.addColorStop(1,tone.face+(glow*.1)+')');
    ctx.fillStyle=faceGrad;ctx.beginPath();ctx.moveTo(p.x,topY);ctx.lineTo(p.x+w1*.6,topY+10);ctx.lineTo(p.x+w1*.35,p.baseY);ctx.lineTo(p.x,p.baseY-6);ctx.closePath();ctx.fill();
    for(let i=0;i<4;i++){const ry=topY+18+i*(p.h-18)/4,rGlow=.3+.5*Math.max(0,Math.sin(t*.03+p.glow+i*1.3));ctx.fillStyle=tone.face+rGlow+')';ctx.fillRect(p.x-1,ry,2,2);}
    ctx.save();ctx.translate(p.x,topY-2);ctx.scale(1,.32);ctx.strokeStyle=tone.face+(.5+.3*Math.sin(t*.03+p.glow))+')';ctx.lineWidth=1.6;
    ctx.beginPath();ctx.arc(0,0,11,0,7);ctx.stroke();ctx.restore();
    ctx.fillStyle=tone.face+(.7+.3*Math.sin(t*.04+p.glow))+')';ctx.beginPath();ctx.arc(p.x,topY,4,0,7);ctx.fill();
    p.motes.forEach(m=>{m.ang+=m.spd;const mx=p.x+Math.cos(m.ang)*m.r,my=topY+Math.sin(m.ang)*m.r*.35;
      ctx.fillStyle=tone.face+(.4+.4*Math.sin(t*.05+m.ang))+')';ctx.beginPath();ctx.arc(mx,my,1.1,0,7);ctx.fill();});});break;
  case 'pendulums':props.forEach(p=>{p.phase+=.02;const ang=Math.sin(p.phase)*.5,bx=p.x+Math.sin(ang)*p.len,by=p.y+Math.cos(ang)*p.len;
    ctx.strokeStyle=tone.a;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(bx,by);ctx.stroke();
    ctx.fillStyle=tone.b;ctx.beginPath();ctx.arc(bx,by,p.r,0,7);ctx.fill();ctx.strokeStyle=tone.a;ctx.lineWidth=1;ctx.beginPath();ctx.arc(bx,by,p.r,0,7);ctx.stroke();
    ctx.fillStyle=tone.a;ctx.beginPath();ctx.arc(p.x,p.y,2,0,7);ctx.fill();});break;
  case 'wisps':props.forEach(p=>{p.phase+=.015;const sway=Math.sin(p.phase)*10;
    for(let i=0;i<10;i++){const frac=i/10,py=p.baseY-frac*p.h,px=p.x+sway*frac,a=(.35*(1-frac))*(.6+.4*Math.sin(t*.03+p.phase+i));
      ctx.fillStyle=tone.trail+a+')';ctx.beginPath();ctx.arc(px,py,2-frac,0,7);ctx.fill();}
    ctx.fillStyle=tone.core;ctx.globalAlpha=.7+.3*Math.sin(t*.05+p.phase);ctx.beginPath();ctx.arc(p.x+sway,p.baseY-p.h,2.4,0,7);ctx.fill();ctx.globalAlpha=1;});break;
  case 'statues':props.forEach(p=>{const glow=.4+.4*Math.sin(t*.03+p.glow);ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(p.x,p.baseY+3,14,4,0,0,7);ctx.fill();
    ctx.fillStyle=tone.stone;ctx.fillRect(p.x-10,p.baseY-p.h*.25,20,p.h*.25);
    ctx.beginPath();ctx.moveTo(p.x-7,p.baseY-p.h*.25);ctx.lineTo(p.x-9,p.baseY-p.h*.7);ctx.lineTo(p.x,p.baseY-p.h);ctx.lineTo(p.x+9,p.baseY-p.h*.7);ctx.lineTo(p.x+7,p.baseY-p.h*.25);ctx.closePath();ctx.fill();
    ctx.fillStyle=tone.eye;ctx.globalAlpha=glow;ctx.beginPath();ctx.arc(p.x-3,p.baseY-p.h*.85,1.4,0,7);ctx.fill();ctx.beginPath();ctx.arc(p.x+3,p.baseY-p.h*.85,1.4,0,7);ctx.fill();ctx.globalAlpha=1;});break;
  case 'shatterDebris':props.forEach(p=>{p.x+=p.drift*.3;p.rot+=p.rotSpd;p.y+=Math.sin(t*.01+p.x*.01)*.08;if(p.x<-20)p.x=w+20;if(p.x>w+20)p.x=-20;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);const grad=ctx.createLinearGradient(-p.size,0,p.size,0);grad.addColorStop(0,tone.a);grad.addColorStop(1,tone.b);
    ctx.globalAlpha=.5;ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(0,-p.size);ctx.lineTo(p.size*.6,0);ctx.lineTo(0,p.size);ctx.lineTo(-p.size*.6,0);ctx.closePath();ctx.fill();
    ctx.globalAlpha=1;ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=.5;ctx.stroke();ctx.restore();});break;
  }
}

/* ════════════════════════════════════════════════════════════════════════
   WEATHER

   A scene declares `weather:'rain'` (or ash / snow / fog / embers / drift)
   and gets a full-height pass over the whole frame. The old set had only
   particles, which sit in the sky — weather crosses the ground too, which is
   what actually makes a place feel like it has air in it.
   ════════════════════════════════════════════════════════════════════════ */
function initWeather(S,cfg,w,h){
  S.wx=[];
  const kind=cfg.weather; if(!kind)return;
  const n={rain:70,ash:34,snow:44,embers:26,drift:22,fog:0}[kind]||0;
  for(let i=0;i<n;i++)S.wx.push({
    x:rnd(0,w),y:rnd(0,h),
    spd:rnd(.4,1)*(kind==='rain'?7:kind==='snow'?.7:kind==='embers'?-.5:.9),
    drift:rnd(-.5,.5),len:rnd(6,16),r:rnd(.6,2),phase:rnd(0,7),
  });
}
function drawWeather(ctx,w,h,cfg,S){
  const kind=cfg.weather; if(!kind)return;
  const t=S.t;
  if(kind==='fog'){
    /* three slow banks rather than particles */
    for(let i=0;i<3;i++){
      const y=h*(.52+i*.12), off=(t*(.25+i*.15))%(w+300)-150;
      const g=ctx.createLinearGradient(0,y-26,0,y+26);
      g.addColorStop(0,'rgba(0,0,0,0)');
      g.addColorStop(.5,cfg.fogTone||'rgba(190,205,225,.10)');
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;
      ctx.beginPath();ctx.ellipse(off,y,w*.55,26,0,0,7);ctx.fill();
    }
    return;
  }
  const tone=cfg.weatherTone||'rgba(200,215,240,.5)';
  ctx.save();
  S.wx.forEach(p=>{
    p.y+=p.spd; p.x+=p.drift+Math.sin(t*.01+p.phase)*(kind==='snow'?.5:.15);
    if(p.y>h+10){p.y=-10;p.x=rnd(0,w);} if(p.y<-10){p.y=h+10;p.x=rnd(0,w);}
    if(p.x<-10)p.x=w+10; if(p.x>w+10)p.x=-10;
    if(kind==='rain'){
      ctx.strokeStyle=tone;ctx.lineWidth=.9;ctx.globalAlpha=.5;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.drift*3,p.y+p.len);ctx.stroke();
    }else{
      const a=kind==='embers'?(.35+.35*Math.sin(t*.05+p.phase)):.42;
      ctx.globalAlpha=a;ctx.fillStyle=tone;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();
    }
  });
  ctx.globalAlpha=1;ctx.restore();
}

/* ---- overlays ---- */
function drawShimmer(ctx,canvas,w,h,cfg,S){if(!cfg.shimmer)return;const t=S.t;ctx.save();ctx.globalAlpha=.10;
  for(let y=h*.6;y<h*.72;y+=2){const shift=Math.sin(y*.4+t*.15)*3;ctx.drawImage(canvas,0,y,w,2,shift,y,w,2);}ctx.restore();}
function drawGlitch(ctx,canvas,w,h,cfg,S){if(!cfg.glitch)return;const t=S.t;if((t%50)<3){
  for(let i=0;i<3;i++){const y=rnd(0,h*.9),sh=rnd(-14,14);ctx.drawImage(canvas,0,y,w,6,sh,y,w,6);}
  ctx.fillStyle='rgba(255,0,150,.04)';ctx.fillRect(0,0,w,h);ctx.fillStyle='rgba(0,220,255,.04)';ctx.fillRect(2,0,w,h);}}
function drawCracks(ctx,cfg,S){if(!cfg.crackOverlay)return;const glow=.35+.2*Math.sin(S.t*.03);
  S.crackLines.forEach(pts=>{ctx.strokeStyle=`rgba(255,255,255,${glow})`;ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.stroke();});}

/* ---- main entry point ---- */
// slot: any string id you like ('main','walk') so multiple canvases keep independent state
// si: STAGES[] index (0-24, matches dino.js exactly)
/* ══════════ WORLD BEHAVIOURS ══════════════════════════════════════════════
   Worlds 6-10 each have a `live` behaviour in dino-scene2.js — fray, dust,
   grid, pressure, ember — and that, not the silhouette, is what makes them
   read as different places. Worlds 1-5 had only weather, which is a texture,
   not a character, so five stages of World 3 looked like five stages of World
   4 with a different colour wash.

   A world is a behaviour; a stage is a noun. These are the five missing
   behaviours, one per world, and no two do anything alike:

     fronts  W1  cloud shadows sweep the ground and the sky's midpoint drifts
     glow    W2  every depth pulses its own light, out of phase
     ring    W3  the whole frame shears sideways on a slow sine, like a struck bell
     invert  W4  the far layers scroll FASTER than the near ones
     heat    W5  a shimmer column climbs off the ground line and bends the view

   Each is gated on cfg.live and costs nothing when absent. RM (reduced motion)
   is respected the same way the rest of this file respects it.            */
const LIVE1_RM = (typeof matchMedia==='function')
  && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* W1 · FRONTS — weather moving across the land, not falling out of it */
function liveFronts(ctx,w,h,cfg,S){
  const t=S.t*(LIVE1_RM?.25:1);
  for(let i=0;i<3;i++){
    const sp=.35+i*.22, x=((t*sp+i*w*.45)%(w*1.6))-w*.3;
    const bw=w*(.30+i*.10);
    const g=ctx.createLinearGradient(x,0,x+bw,0);
    g.addColorStop(0,'rgba(0,0,0,0)');
    g.addColorStop(.5,'rgba(8,14,10,'+(.16-i*.03)+')');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(x,h*.66,bw,h*.34);
  }
}
/* W2 · GLOW — nothing is lit from outside; each depth breathes its own light */
function liveGlow(ctx,w,h,cfg,S){
  const t=S.t*(LIVE1_RM?.3:1);
  const bands=[[.52,.62,0],[.60,.72,2.1],[.70,1.0,4.2]];
  bands.forEach(([a,b,ph],i)=>{
    const al=.05+.045*Math.sin(t*.018+ph);
    const g=ctx.createLinearGradient(0,h*b,0,h*a);
    g.addColorStop(0,(cfg.horizon||'rgba(120,200,255,.2)'));
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.globalAlpha=Math.max(0,al)*(1-i*.18);
    ctx.fillStyle=g; ctx.fillRect(0,h*a,w,h*(b-a));
  });
  ctx.globalAlpha=1;
}
/* W3 · RING — the picture itself is struck and still humming.
   Applied as a transform around the whole frame, so it is the only world where
   the FRAME moves rather than something inside it. */
function liveRingPre(ctx,w,h,S){
  const t=S.t*(LIVE1_RM?.2:1);
  const sh=Math.sin(t*.021)*1.6+Math.sin(t*.053)*.7;
  ctx.save(); ctx.setTransform(1,0,sh/h,1,-sh*.5,0);
}
function liveRingPost(ctx){ ctx.restore(); }
/* W5 · HEAT — the ground is hotter than the air above it */
function liveHeat(ctx,canvas,w,h,cfg,S){
  if(LIVE1_RM) return;
  const t=S.t, y0=Math.floor(h*.40), y1=Math.floor(h*.76);
  if(y1-y0<8) return;
  try{
    const strip=ctx.getImageData(0,y0,w,y1-y0);
    for(let y=y1-y0-1;y>=0;y--){
      const heat=(y/(y1-y0));                       // strongest near the ground
      const off=Math.round(Math.sin(y*.14+t*.05)*2.2*heat);
      if(!off) continue;
      const row=y*w*4;
      const cp=strip.data.slice(row,row+w*4);
      for(let x=0;x<w;x++){
        const sx=Math.min(w-1,Math.max(0,x+off));
        strip.data[row+x*4  ]=cp[sx*4  ];
        strip.data[row+x*4+1]=cp[sx*4+1];
        strip.data[row+x*4+2]=cp[sx*4+2];
      }
    }
    ctx.putImageData(strip,0,y0);
  }catch(e){}
}

/* ══════════ LIGHT SIGNATURES ══════════════════════════════════════════════
   Every stage used the same two-stop sky and the same horizon bloom, so the
   light was the one thing that never told you which world you were in. Each
   world now has a key direction and a horizon treatment that no other world
   uses. cfg.light names it; absent means the old behaviour. */
function applyLight(ctx,w,h,cfg,S){
  const L=cfg.light; if(!L) return;
  if(L==='highsun'){                       // W1 — high warm key, cool bounce
    const g=ctx.createLinearGradient(0,0,0,h*.72);
    g.addColorStop(0,'rgba(255,238,190,.10)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h*.72);
  } else if(L==='selflit'){                // W2 — no key; the ground lights the sky
    const g=ctx.createLinearGradient(0,h,0,h*.52);
    g.addColorStop(0,(cfg.horizon||'rgba(120,200,255,.18)'));
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.globalAlpha=.5; ctx.fillStyle=g; ctx.fillRect(0,h*.52,w,h*.48); ctx.globalAlpha=1;
  } else if(L==='hardside'){               // W3 — one hard source, long shadows
    const g=ctx.createLinearGradient(0,0,w,0);
    g.addColorStop(0,'rgba(0,0,0,.30)'); g.addColorStop(.45,'rgba(0,0,0,0)');
    g.addColorStop(1,'rgba(0,0,0,.34)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
  } else if(L==='flat'){                   // W4 — no key at all; an inverted horizon
    const g=ctx.createLinearGradient(0,h*.60,0,h*.78);
    g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(.5,'rgba(0,0,0,.42)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(0,h*.56,w,h*.26);
  } else if(L==='underlit'){               // W5 — the forge is below the frame
    const g=ctx.createLinearGradient(0,h,0,h*.44);
    g.addColorStop(0,'rgba(255,176,80,.26)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(0,h*.44,w,h*.56);
  }
}

function render(ctx,canvas,slot,si){
  if(si<0||si>=SCENES.length)si=0;
  const cfg=SCENES[si],w=canvas.width,h=canvas.height;
  const S=getSlot(slot);
  if(S.si!==si){S.si=si;initSlot(S,cfg,w,h);}
  S.t+=1;

  const ringing=(cfg.live==='ring');
  if(ringing) liveRingPre(ctx,w,h,S);

  /* W1's front drift moves the sky's own midpoint, so the light changes across
     a fight rather than sitting still behind it. */
  const mid=(cfg.live==='fronts') ? .55+.10*Math.sin(S.t*.004) : .55;
  const sky=ctx.createLinearGradient(0,0,0,h*.72);
  sky.addColorStop(0,cfg.sky[0]);sky.addColorStop(mid,cfg.sky[1]);sky.addColorStop(1,cfg.sky[1]);
  ctx.fillStyle=sky;ctx.fillRect(0,0,w,h*.72);

  drawBody(ctx,w,h,cfg,S);
  drawAurora(ctx,w,h,cfg,S);
  if(cfg.cloud)drawClouds(ctx,cfg,S);
  if(cfg.orbs&&cfg.terrain!=='sea')drawOrbs(ctx,S);
  drawParticles(ctx,h,cfg,S);
  drawConstellations(ctx,cfg,S);
  if(cfg.fireflies)drawFireflies(ctx,S);
  drawLightning(ctx,w,h,cfg,S);

  const groundY=h*.72,terrain=cfg.terrain||'hills';
  if(terrain==='chasm'){drawChasm(ctx,w,h);drawProps(ctx,w,h,h*.66,cfg,S);}
  else if(terrain==='sea'){drawCoast(ctx,w,h,cfg,S,si);}
  else if(terrain==='grid'){drawGridGround(ctx,w,h);drawProps(ctx,w,h,groundY,cfg,S);}
  else{
    if(cfg.volcano)drawVolcanoSilhouette(ctx,w,h,cfg,S);
    const t=S.t;
    /* Three depths, three profiles. A scene can name them separately —
       `profile:{far:'peaks',mid:'hills',near:'dunes'}` — or give one string
       for all three. The seed is the stage index, so the land is stable. */
    const pf=cfg.profile||'hills';
    const P=(typeof pf==='string')?{far:pf,mid:pf,near:pf}:pf;
    const sd=(cfg._seed==null?si*17+3:cfg._seed);
    const amp=cfg.relief||1;                        // per-scene relief scale
    /* W4 · INVERT — depth reads by relative speed, so swapping the far and near
       rates makes the distance itself wrong. Nothing else in the scene changes;
       you notice before you can name it. */
    const inv=(cfg.live==='invert');
    const spFar=inv?.40:.08, spMid=.15, spNear=inv?.08:.40;
    const farPts =hillPath(w,h,h*.58,(t*spFar)%160,14*amp, 7*amp,.4,P.far ,sd);
    drawHillLayer(ctx,farPts ,cfg.far,w,h*.66,false,'');
    const midPts =hillPath(w,h,h*.62,(t*spMid)%160,20*amp,10*amp,0 ,P.mid ,sd+31);
    drawHillLayer(ctx,midPts ,cfg.mid,w,h*.7,true,cfg.body?cfg.body.glow:'rgba(255,255,255,.2)');
    const nearPts=hillPath(w,h,h*.7 ,(t*spNear)%220 ,14*amp, 0     ,1.4,P.near,sd+67);
    ctx.globalAlpha=.92;drawHillLayer(ctx,nearPts,cfg.ground[0],w,h*.76,false,'');ctx.globalAlpha=1;
    if(cfg.dustDevils)drawDustDevils(ctx,S);
    drawProps(ctx,w,h,groundY,cfg,S);
    const gg=ctx.createLinearGradient(0,h*.72,0,h);gg.addColorStop(0,cfg.ground[0]);gg.addColorStop(1,cfg.ground[1]);ctx.fillStyle=gg;ctx.fillRect(0,h*.72,w,h*.28);
    if(cfg.groundOverlay)drawFlow(ctx,w,h,cfg.groundOverlay.tone,S);
    if(cfg.bubbles)drawBubbles(ctx,h,S);
    if(cfg.body){const bx=cfg.body.x*w;const refl=ctx.createRadialGradient(bx,h*.74,0,bx,h*.74,w*.22);
      refl.addColorStop(0,cfg.horizon);refl.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=refl;ctx.fillRect(0,h*.7,w,h*.3);}
    const hz=ctx.createLinearGradient(0,h*.66,0,h*.78);hz.addColorStop(0,'rgba(0,0,0,0)');hz.addColorStop(.5,cfg.horizon);hz.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=hz;ctx.fillRect(0,h*.6,w,h*.2);
    drawShimmer(ctx,canvas,w,h,cfg,S);
  }

  S.ambient.forEach(a=>{a.y+=a.spd;if(a.y>h)a.y=-4;const ax=a.x+Math.sin(S.t*.01+a.phase)*6,al=.10+.06*Math.sin(S.t*.02+a.phase);
    ctx.fillStyle=`rgba(220,225,235,${al})`;ctx.beginPath();ctx.arc(ax,a.y,a.r,0,7);ctx.fill();});

  /* the world's own behaviour, over the land and under the weather */
  if(cfg.live==='fronts') liveFronts(ctx,w,h,cfg,S);
  if(cfg.live==='glow')   liveGlow(ctx,w,h,cfg,S);

  drawWeather(ctx,w,h,cfg,S);
  drawGlitch(ctx,canvas,w,h,cfg,S);
  drawCracks(ctx,cfg,S);

  applyLight(ctx,w,h,cfg,S);            // the world's light signature

  ctx.fillStyle='rgba(0,0,0,.12)';for(let y=Math.floor(h*.72);y<h;y+=4)ctx.fillRect(0,y,w,1);
  const vg=ctx.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,h*.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.45)');
  ctx.fillStyle=vg;ctx.fillRect(0,0,w,h);

  if(ringing) liveRingPost(ctx);        // release the shear before the pixel pass
  if(cfg.live==='heat') liveHeat(ctx,canvas,w,h,cfg,S);
}

window.SceneFX={render:render,SCENES:SCENES};
})();