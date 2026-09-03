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

const ECOL=[
  {body:'#7dde7d',dark:'#4aaa4a',eye:'#ffff66'},
  {body:'#c8a96e',dark:'#8a6030',eye:'#ff8'},
  {body:'#4a7ee0',dark:'#22448a',eye:'#aaddff'},
  {body:'#e06a20',dark:'#8a3000',eye:'#ffcc00'},
  {body:'#8B1A1A',dark:'#5a0000',eye:'#ff4444',boss:true,crown:'#ffdd00'},
  {body:'#5a1a8b',dark:'#2a0044',eye:'#cc88ff'},
  {body:'#0e9a8a',dark:'#004a44',eye:'#aaffee'},
  {body:'#6a5a00',dark:'#2a2400',eye:'#ffdd44'},
  {body:'#1a5a8b',dark:'#002244',eye:'#aaddff'},
  {body:'#0a000a',dark:'#000',eye:'#ff0088',boss:true,crown:'#ffaa00'},
  {body:'#f5c842',dark:'#8a6a00',eye:'#ffffff'},
  {body:'#ff4500',dark:'#8a2000',eye:'#ffdd00'},
  {body:'#8a7a5a',dark:'#4a3a1a',eye:'#00e5ff'},
  {body:'#2a0a4a',dark:'#12002a',eye:'#ff00ff'},
  {body:'#4a1a8b',dark:'#1a0044',eye:'#ffffff',boss:true,crown:'#00e5ff'},
  {body:'#00b0c8',dark:'#004a5a',eye:'#ffffff'},
  {body:'#4a4a5a',dark:'#1a1a2a',eye:'#ff0088'},
  {body:'#6a00c8',dark:'#2a004a',eye:'#00ffcc'},
  {body:'#ffb000',dark:'#8a5800',eye:'#ff4500'},
  {body:'#0a0a2a',dark:'#000',eye:'#4a9eff',boss:true,crown:'#e84545'},
  {body:'#8a5a2a',dark:'#4a2a10',eye:'#ffdd00'},
  {body:'#2a2a8a',dark:'#12124a',eye:'#00e5ff',boss:true,crown:'#f5c842'},
  {body:'#1a0000',dark:'#000',eye:'#ff0000',boss:true,crown:'#8B1A1A'},
  {body:'#ffee00',dark:'#8a7a00',eye:'#ffffff',boss:true,crown:'#ffffff'},
  {body:'#ffffff',dark:'#cccccc',eye:'#ffdd00',boss:true,crown:'#f5c842'},
];
function makeSpr(c,size=60){
  const s=size/16,h=Math.round(size*1.06);
  const cr=c.boss&&c.crown?`<rect x="${3*s}" y="0" width="${s}" height="${2*s}" fill="${c.crown}"/>
    <rect x="${5*s}" y="0" width="${s}" height="${s}" fill="${c.crown}"/>
    <rect x="${7*s}" y="0" width="${s}" height="${2*s}" fill="${c.crown}"/>`:'' ;
  return `<svg width="${size}" height="${h}" viewBox="0 0 ${size} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${cr}
    <rect x="${4*s}" y="${6*s}" width="${7*s}" height="${5*s}" fill="${c.body}"/>
    <rect x="${4*s}" y="${4*s}" width="${3*s}" height="${3*s}" fill="${c.body}"/>
    <rect x="${2*s}" y="${2*s}" width="${4*s}" height="${3*s}" fill="${c.body}"/>
    <rect x="${2*s}" y="${2*s}" width="${s}" height="${s}" fill="${c.eye}"/>
    <rect x="${s}" y="${4*s}" width="${3*s}" height="${s}" fill="${c.body}"/>
    <rect x="${s}" y="${5*s}" width="${s}" height="${s}" fill="#fff"/>
    <rect x="${3*s}" y="${5*s}" width="${s}" height="${s}" fill="#fff"/>
    <rect x="${10*s}" y="${8*s}" width="${3*s}" height="${2*s}" fill="${c.body}"/>
    <rect x="${5*s}" y="${11*s}" width="${2*s}" height="${3*s}" fill="${c.body}"/>
    <rect x="${9*s}" y="${11*s}" width="${2*s}" height="${3*s}" fill="${c.body}"/>
    <rect x="${4*s}" y="${13*s}" width="${3*s}" height="${s}" fill="${c.dark}"/>
    <rect x="${8*s}" y="${13*s}" width="${3*s}" height="${s}" fill="${c.dark}"/>
  </svg>`;
}

const STAGES=[
    {name:'FOREST FRINGE',icon:'🌿',sprIdx:0,world:1,isBoss:false,
    passive:{label:'🌿 Camouflage',desc:'20% dodge'},res:{},
    levels:[
      {lv:1,sub:'Leaf Gecko',    hp:20, atk:[8,14],  attr:{hp:3,atk:0,res:0}},
      {lv:2,sub:'Fern Crawler',  hp:28, atk:[10,17], attr:{hp:4,atk:1,res:0}},
      {lv:3,sub:'Vine Spitter',  hp:36, atk:[12,20], attr:{hp:3,atk:0,res:2}},
      {lv:4,sub:'Bark Hound',    hp:44, atk:[14,24], attr:{hp:5,atk:1,res:0}},
      {lv:5,sub:'Grove Warden',  hp:60, atk:[18,30], attr:{hp:6,atk:2,res:2},mini:true},
    ],
    // Vine Spitter poisons you when it lands a hit at low HP
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=40){g.bossSpecialFired=true;g.activeEffects.push({type:'playerPoison',turns:2,hpPerTurn:6});renderEffects();setMsg('🌿 GROVE WARDEN spits venom! -6/turn!','var(--green)');}}},
  {name:'DESERT DUNES',icon:'🏜',sprIdx:1,world:1,isBoss:false,
    passive:{label:'🏜 Sand Armor',desc:'-15% dmg taken'},res:{burn:0.5},
    levels:[
      {lv:1,sub:'Sand Skink',    hp:32, atk:[12,20], attr:{hp:4,atk:1,res:0}},
      {lv:2,sub:'Dune Crawler',  hp:42, atk:[14,24], attr:{hp:5,atk:0,res:2}},
      {lv:3,sub:'Heat Drake',    hp:52, atk:[17,28], attr:{hp:4,atk:2,res:0}},
      {lv:4,sub:'Sand Titan',    hp:62, atk:[20,32], attr:{hp:6,atk:1,res:2}},
      {lv:5,sub:'Dune Tyrant',   hp:80, atk:[24,40], attr:{hp:8,atk:2,res:3},mini:true},
    ],
    // Dune Tyrant enrages, boosting its attack
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.rageMult=(g.rageMult||1)*1.4;setMsg('🏜 DUNE TYRANT kicks up a sandstorm! ATK ×1.4!','var(--yellow)');}}},
  {name:'COASTAL CLIFFS',icon:'🌊',sprIdx:2,world:1,isBoss:false,
    passive:{label:'🌊 Aqua Shell',desc:'Resists Burn 40%'},res:{burn:0.6},
    levels:[
      {lv:1,sub:'Cliff Iguana',  hp:46, atk:[15,24], attr:{hp:5,atk:1,res:0}},
      {lv:2,sub:'Sea Runner',    hp:58, atk:[17,28], attr:{hp:5,atk:2,res:0}},
      {lv:3,sub:'Storm Skimmer', hp:70, atk:[20,32], attr:{hp:6,atk:0,res:3}},
      {lv:4,sub:'Wave Stalker',  hp:82, atk:[23,37], attr:{hp:7,atk:2,res:2}},
      {lv:5,sub:'Tide Lord',     hp:100,atk:[28,46], attr:{hp:10,atk:3,res:3},mini:true},
    ],
    // Tide Lord heals itself periodically
    spFn:g=>{if(g.bossAtkCounter%3===0&&g.bossAtkCounter>0){g.bossHP=Math.min(g.bossMaxHP,g.bossHP+15);setMsg('🌊 TIDE LORD rides a wave! Healed +15 HP!','var(--blue)');}}},
  {name:'VOLCANIC VALLEY',icon:'🌋',sprIdx:3,world:1,isBoss:false,
    passive:{label:'🌋 Lava Skin',desc:'Immune Burn, Poison ½'},res:{burn:0,poison:0.5},
    levels:[
      {lv:1,sub:'Magma Hatch',   hp:60, atk:[20,32], attr:{hp:6,atk:2,res:0}},
      {lv:2,sub:'Lava Crawler',  hp:76, atk:[23,37], attr:{hp:7,atk:2,res:2}},
      {lv:3,sub:'Cinder Drake',  hp:92, atk:[27,43], attr:{hp:7,atk:1,res:3}},
      {lv:4,sub:'Eruption Beast',hp:110,atk:[31,48], attr:{hp:8,atk:3,res:2}},
      {lv:5,sub:'Volcano Titan', hp:130,atk:[36,56], attr:{hp:12,atk:4,res:4},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.activeEffects.push({type:'playerBurn',turns:3,hpPerTurn:10});renderEffects();setMsg('🌋 VOLCANO TITAN burns you! -10/turn for 3 turns!','var(--orange)');}}},
  {name:'EMBER KEEP',icon:'👑',sprIdx:4,world:1,isBoss:true,
    passive:{label:'🔥 Flame Armor',desc:'Immune Burn · Poison -50% · ATK×1.6 at 50% HP'},
    res:{burn:0,poison:0.5},
    levels:[
      {lv:1,sub:'Ember Guard',   hp:90, atk:[12,20],attr:{hp:8,atk:2,res:2}},
      {lv:2,sub:'Flame Knight',  hp:110,atk:[14,22],attr:{hp:8,atk:3,res:2}},
      {lv:3,sub:'Inferno Drake', hp:130,atk:[16,26],attr:{hp:10,atk:3,res:3}},
      {lv:4,sub:'Blaze Colossus',hp:155,atk:[18,28],attr:{hp:12,atk:4,res:4}},
      {lv:5,sub:'☠ EMBER KING',  hp:280,atk:[22,36],attr:{hp:20,atk:6,res:5},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.rageMult=(g.rageMult||1)*1.8;setMsg('🔥 EMBER KING ENRAGES! ATK ×1.8!','var(--orange)');}}},
  {name:'SHADOW CAVERNS',icon:'🌑',sprIdx:5,world:2,isBoss:false,
    passive:{label:'🌑 Shadow Step',desc:'30% dodge · Half HP -50%'},res:{halfhp:0.5},
    levels:[
      {lv:1,sub:'Cave Lurker',   hp:120,atk:[14,22],attr:{hp:8,atk:2,res:2}},
      {lv:2,sub:'Dark Raptor',   hp:140,atk:[16,25],attr:{hp:9,atk:3,res:2}},
      {lv:3,sub:'Shadow Drake',  hp:162,atk:[18,28],attr:{hp:10,atk:3,res:3}},
      {lv:4,sub:'Void Stalker',  hp:186,atk:[20,32],attr:{hp:11,atk:4,res:3}},
      {lv:5,sub:'Night Sovereign',hp:215,atk:[23,36],attr:{hp:14,atk:5,res:4},mini:true},
    ]},
  {name:'FROST PEAKS',icon:'❄',sprIdx:6,world:2,isBoss:false,
    passive:{label:'❄ Cryo Shell',desc:'Immune Freeze · Paralyze -60%'},res:{freeze:0,paralyze:0.4},
    levels:[
      {lv:1,sub:'Ice Skink',     hp:145,atk:[16,26],attr:{hp:9,atk:3,res:2}},
      {lv:2,sub:'Frost Raptor',  hp:168,atk:[18,29],attr:{hp:10,atk:3,res:3}},
      {lv:3,sub:'Blizzard Drake',hp:192,atk:[20,33],attr:{hp:11,atk:4,res:3}},
      {lv:4,sub:'Glacier Titan', hp:218,atk:[23,37],attr:{hp:13,atk:4,res:4}},
      {lv:5,sub:'Cryo Colossus', hp:250,atk:[26,42],attr:{hp:16,atk:5,res:5},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.activeEffects.push({type:'playerParalyze',turns:2});renderEffects();setMsg('❄ CRYO COLOSSUS paralyzes you for 2 turns!','var(--cyan)');}}},
  {name:'POISON SWAMP',icon:'☠',sprIdx:7,world:2,isBoss:false,
    passive:{label:'☠ Venom Master',desc:'Immune Poison · Burn -40%'},res:{poison:0,burn:0.6},
    levels:[
      {lv:1,sub:'Swamp Toad',    hp:172,atk:[18,30],attr:{hp:10,atk:3,res:3}},
      {lv:2,sub:'Venom Crawler', hp:198,atk:[21,34],attr:{hp:11,atk:4,res:3}},
      {lv:3,sub:'Toxic Drake',   hp:226,atk:[24,38],attr:{hp:13,atk:4,res:4}},
      {lv:4,sub:'Plague Beast',  hp:256,atk:[27,43],attr:{hp:14,atk:5,res:4}},
      {lv:5,sub:'Venom Queen',   hp:290,atk:[31,48],attr:{hp:18,atk:6,res:5},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=60){g.bossSpecialFired=true;g.activeEffects.push({type:'playerPoison',turns:4,hpPerTurn:14});renderEffects();setMsg('☠ VENOM QUEEN mega-venom! -14/turn!','var(--purple)');}}},
  {name:'CHAOS WASTES',icon:'🌪',sprIdx:8,world:2,isBoss:false,
    passive:{label:'🌪 Chaos Aura',desc:'All DoTs -50% · Shuffles inv every 2 atks'},res:{poison:0.5,burn:0.5,paralyze:0.5},
    levels:[
      {lv:1,sub:'Chaos Skink',   hp:200,atk:[22,35],attr:{hp:11,atk:4,res:3}},
      {lv:2,sub:'Void Crawler',  hp:228,atk:[25,39],attr:{hp:13,atk:5,res:4}},
      {lv:3,sub:'Rift Drake',    hp:258,atk:[28,44],attr:{hp:14,atk:5,res:4}},
      {lv:4,sub:'Null Titan',    hp:290,atk:[32,50],attr:{hp:16,atk:6,res:5}},
      {lv:5,sub:'Omega Herald',  hp:330,atk:[36,56],attr:{hp:20,atk:7,res:6},mini:true},
    ],
    spFn:g=>{if(g.bossAtkCounter%2===0&&g.bossAtkCounter>0){const keys=Object.keys(g.inv).filter(k=>g.inv[k]>0);if(keys.length>=2){shuffle(keys);const a=keys[0],b=keys[1];const t=g.inv[a];g.inv[a]=g.inv[b];g.inv[b]=t;renderInventory();setMsg('🌪 CHAOS AURA shuffles your inventory!','var(--orange)');}}}},
  {name:'OMEGA CITADEL',icon:'💀',sprIdx:9,world:2,isBoss:true,
    passive:{label:'🌟 Omega Force',desc:'All res 50% · Erases powerups at 50% · ATK×2 at 30%'},
    res:{poison:0.5,burn:0.5,paralyze:0.5,freeze:0.5,halfhp:0.3},
    levels:[
      {lv:1,sub:'Omega Shard',    hp:240,atk:[26,42],attr:{hp:14,atk:5,res:4}},
      {lv:2,sub:'Omega Sentinel', hp:275,atk:[30,48],attr:{hp:16,atk:6,res:5}},
      {lv:3,sub:'Omega Warden',   hp:315,atk:[34,54],attr:{hp:18,atk:7,res:6}},
      {lv:4,sub:'Omega Commander',hp:360,atk:[39,62],attr:{hp:22,atk:8,res:7}},
      {lv:5,sub:'☠ OMEGA REX',   hp:600,atk:[46,76],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    
    spFn:g=>{
      if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;Object.keys(g.inv).forEach(k=>g.inv[k]=0);renderInventory();setMsg('🌟 OMEGA REX erases ALL powerups!','var(--red)');}
      if(g.bossHP/g.bossMaxHP*100<=30&&!g.omegaRageTwo){g.omegaRageTwo=true;g.rageMult=(g.rageMult||1)*2;setMsg('🌟 OMEGA REX — FINAL FORM! ATK×2!','var(--yellow)');}
    }},
    {name:'AETHER REACTOR',icon:'⚡',sprIdx:10,world:3,isBoss:false,
    passive:{label:'⚡ Overcharge',desc:'Immune Paralyze · Skills cooldown +1 turn'},res:{paralyze:0},
    levels:[
      {lv:1,sub:'Plasma Hound',   hp:400,atk:[42,65],attr:{hp:24,atk:8,res:6}},
      {lv:2,sub:'Volt Striker',   hp:450,atk:[46,72],attr:{hp:26,atk:9,res:6}},
      {lv:3,sub:'Lightning Drake',hp:510,atk:[52,80],attr:{hp:28,atk:10,res:7}},
      {lv:4,sub:'Laser Golem',    hp:580,atk:[58,90],attr:{hp:32,atk:11,res:8}},
      {lv:5,sub:'Storm Core',     hp:660,atk:[65,102],attr:{hp:36,atk:13,res:9},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.activeEffects.push({type:'playerEnergyLock',turns:3});renderEffects();setMsg('⚡ STORM CORE locks your special skills for 3 turns!','var(--yellow)');}}},
  {name:'NEVER-HELL',icon:'🔥',sprIdx:11,world:3,isBoss:false,
    passive:{label:'🔥 Soul Burn',desc:'Immune Burn · Heals 10% of dealt dmg'},res:{burn:0},
    levels:[
      {lv:1,sub:'Magma Imp',      hp:520,atk:[55,85],attr:{hp:30,atk:11,res:7}},
      {lv:2,sub:'Hellhound Alpha',hp:590,atk:[62,96],attr:{hp:34,atk:12,res:8}},
      {lv:3,sub:'Inferno Drake',  hp:670,atk:[70,108],attr:{hp:38,atk:14,res:9}},
      {lv:4,sub:'Pyroclast Fiend',hp:760,atk:[78,122],attr:{hp:42,atk:16,res:10}},
      {lv:5,sub:'Lord of Cinders',hp:870,atk:[88,138],attr:{hp:48,atk:18,res:12},mini:true},
    ],
    spFn:g=>{if(g.bossAtkCounter%3===0&&g.bossAtkCounter>0){g.bossHP=Math.min(g.bossMaxHP,g.bossHP+40);setMsg('🔥 LORD OF CINDERS consumes your ash! Healed +40 HP!','var(--red)');}}},
  {name:'ANCIENT RUINS',icon:'⏳',sprIdx:12,world:3,isBoss:false,
    passive:{label:'⏳ Time Warp',desc:'Immune Freeze · Deducts 1 item on hit'},res:{freeze:0},
    levels:[
      {lv:1,sub:'Stone Golem',    hp:600,atk:[64,98],attr:{hp:34,atk:13,res:8}},
      {lv:2,sub:'Ruins Gazer',    hp:680,atk:[72,110],attr:{hp:38,atk:15,res:9}},
      {lv:3,sub:'Relic Drake',    hp:770,atk:[80,124],attr:{hp:42,atk:16,res:10}},
      {lv:4,sub:'Aeon Guardian',  hp:860,atk:[90,140],attr:{hp:46,atk:18,res:11}},
      {lv:5,sub:'Clockwork Lich', hp:980,atk:[102,158],attr:{hp:52,atk:21,res:13},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.activeEffects.push({type:'playerSlowed',turns:2});renderEffects();setMsg('⏳ CLOCKWORK LICH breaks the timeline! You are slowed for 2 turns!','var(--amber)');}}},
  {name:'ABYSSAL TRENCH',icon:'👁️',sprIdx:13,world:3,isBoss:false,
    passive:{label:'👁️ Mind Wipe',desc:'All DoTs -60% · 20% to reflect debuffs'},res:{poison:0.4,burn:0.4,paralyze:0.4,freeze:0.4},
    levels:[
      {lv:1,sub:'Deep Stalker',   hp:1050,atk:[110,168],attr:{hp:46,atk:18,res:12}},
      {lv:2,sub:'Kraken Hatchling',hp:1160,atk:[120,185],attr:{hp:50,atk:20,res:13}},
      {lv:3,sub:'Abyss Leviathan',hp:1280,atk:[132,204],attr:{hp:56,atk:22,res:14}},
      {lv:4,sub:'Eldritch Horror',hp:1420,atk:[146,226],attr:{hp:62,atk:25,res:16}},
      {lv:5,sub:'Cthulhu Spawn',  hp:1600,atk:[162,252],attr:{hp:70,atk:28,res:18},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=40){g.bossSpecialFired=true;g.activeEffects.push({type:'blindness',turns:3});renderEffects();setMsg('👁️ CTHULHU SPAWN blinds you! 50% miss chance for 3 turns!','var(--purple)');}}},
  {name:'COSMIC ASCENSION',icon:'🌌',sprIdx:14,world:3,isBoss:true,
    passive:{label:'🌌 Astral Barrier',desc:'All res 70% · Counter-attacks on item use'},
    res:{poison:0.3,burn:0.3,paralyze:0.3,freeze:0.3,halfhp:0.1},
    levels:[
      {lv:1,sub:'Star Fragment',  hp:1750,atk:[178,274],attr:{hp:65,atk:24,res:15}},
      {lv:2,sub:'Nebula Golem',   hp:1920,atk:[195,302],attr:{hp:72,atk:27,res:17}},
      {lv:3,sub:'Quasar Sentinel',hp:2100,atk:[212,332],attr:{hp:80,atk:30,res:19}},
      {lv:4,sub:'Infinity Engine',hp:2300,atk:[232,364],attr:{hp:88,atk:34,res:21}},
      {lv:5,sub:'👑 COSMOS PRIME',hp:3500,atk:[260,410],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.bossAtkMin=Math.floor(g.bossAtkMin*1.5);g.bossAtkMax=Math.floor(g.bossAtkMax*1.5);setMsg('🌌 COSMOS PRIME collapses space! ATK permanently multiplied by 1.5×!','var(--magenta)');}
  }},
  {name:'CHRONO WHIRLPOOL',icon:'🌀',sprIdx:15,world:4,isBoss:false,
    passive:{label:'🌀 Time Distortion',desc:'All DoTs -70% · Drastically extends enemy turn speed'},res:{poison:0.3,burn:0.3,paralyze:0.3,freeze:0.3},
    levels:[
      {lv:1,sub:'Temporal Wisp',  hp:3800,atk:[280,440],attr:{hp:220,atk:36,res:22}},
      {lv:2,sub:'Aeon Stalker',   hp:4150,atk:[305,480],attr:{hp:240,atk:40,res:24}},
      {lv:3,sub:'Paradox Drake',  hp:4550,atk:[335,525],attr:{hp:260,atk:44,res:26}},
      {lv:4,sub:'Rift Weaver',    hp:5000,atk:[370,575],attr:{hp:290,atk:48,res:28}},
      {lv:5,sub:'Time Devourer',  hp:5500,atk:[410,635],attr:{hp:320,atk:54,res:32},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.activeEffects.push({type:'playerSlowed',turns:3});renderEffects();setMsg('🌀 TIME DEVOURER distorts your timeline! You are slowed for 3 turns!','var(--cyan)');}}},
  {
    name:'NEBULA GRAVEYARD',icon:'🪦',sprIdx:16,world:4,isBoss:false,
    passive:{label:'🪦 Cosmic Decay',desc:'Immune Poison · Reduces player Max HP by 2% each attack'},res:{poison:0},
    levels:[
      {lv:1,sub:'Dust Wraith',    hp:4800,atk:[350,550],attr:{hp:260,atk:45,res:25}},
      {lv:2,sub:'Spectral Husk',  hp:5250,atk:[385,600],attr:{hp:280,atk:50,res:27}},
      {lv:3,sub:'Supernova Corpse',hp:5750,atk:[425,655],attr:{hp:310,atk:55,res:29}},
      {lv:4,sub:'Eclipsed Titan', hp:6300,atk:[470,720],attr:{hp:340,atk:60,res:32}},
      {lv:5,sub:'Astral Reaper',  hp:7000,atk:[520,795],attr:{hp:380,atk:68,res:36},mini:true},
    ],
    spFn:g=>{if(g.bossAtkCounter%3===0&&g.bossAtkCounter>0){
      const raw=Math.min(CAPS.hpMax,500+g.pHP);
      const loss=Math.max(50,Math.round(raw*0.02));
      g.hpPenalty=(g.hpPenalty||0)+loss;
      capPlayerStats();
      if(g.playerHP>g.playerMaxHP)g.playerHP=g.playerMaxHP;
      setMsg(`🪦 ASTRAL REAPER rots your life force! Permanent -${loss} Max HP!`,'var(--grey)');
      updateBars();}}},
  {
    name:'QUANTUM MATRIX',icon:'🔮',sprIdx:17,world:4,isBoss:false,
    passive:{label:'🔮 Glitch Shield',desc:'35% chance to completely evade player skills'},res:{halfhp:0.2},
    levels:[
      {lv:1,sub:'Data Shard',     hp:5400,atk:[400,620],attr:{hp:300,atk:50,res:28}},
      {lv:2,sub:'Cyber Sentinel', hp:5900,atk:[440,680],attr:{hp:330,atk:55,res:30}},
      {lv:3,sub:'Vector Dragon',  hp:6450,atk:[485,745],attr:{hp:360,atk:60,res:33}},
      {lv:4,sub:'Logic Devourer', hp:7100,atk:[535,820],attr:{hp:400,atk:66,res:36}},
      {lv:5,sub:'Matrix Overlord',hp:7800,atk:[590,900],attr:{hp:440,atk:74,res:40},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=60){g.bossSpecialFired=true;const keys=Object.keys(g.inv).filter(k=>g.inv[k]>0);if(keys.length>0){const target=keys[Math.floor(Math.random()*keys.length)];g.inv[target]=0;renderInventory();setMsg('🔮 MATRIX OVERLORD reformats reality! One of your item stacks was erased!','var(--purple)');}}}},
  {
    name:'STARLIGHT FORGE',icon:'☀️',sprIdx:18,world:4,isBoss:false,
    passive:{label:'☀️ Solar Radiance',desc:'Immune Burn · Converts 20% of taken dmg into heal'},res:{burn:0},
    levels:[
      {lv:1,sub:'Solar Flare',    hp:6200,atk:[460,710],attr:{hp:360,atk:58,res:32}},
      {lv:2,sub:'Magma Golem',    hp:6750,atk:[505,780],attr:{hp:390,atk:64,res:35}},
      {lv:3,sub:'Ignis Leviathan',hp:7350,atk:[555,855],attr:{hp:430,atk:70,res:38}},
      {lv:4,sub:'Plasma Colossus',hp:8000,atk:[610,935],attr:{hp:470,atk:78,res:42}},
      {lv:5,sub:'Helios Monarch', hp:9000,atk:[670,1025],attr:{hp:520,atk:86,res:46},mini:true},
    ],
    spFn:g=>{if(g.bossAtkCounter%2===0&&g.bossAtkCounter>0){g.bossHP=Math.min(g.bossMaxHP,g.bossHP+250);setMsg('☀️ HELIOS MONARCH flares up! Absorbed heat to restore +250 HP!','var(--orange)');}}},
  {name:'THE VOID CORE',icon:'🕳️',sprIdx:19,world:4,isBoss:true,
    passive:{label:'👁️ Event Horizon',desc:'All res 80% · Disables player healing items at 40% HP'},
    res:{poison:0.2,burn:0.2,paralyze:0.2,freeze:0.2,halfhp:0},
    levels:[
      {lv:1,sub:'Gravity Well',   hp:7000,atk:[530,810],attr:{hp:200,atk:70,res:38}},
      {lv:2,sub:'Singularity Eye',hp:7650,atk:[585,890],attr:{hp:220,atk:78,res:42}},
      {lv:3,sub:'Antimatter Beast',hp:8400,atk:[645,980],attr:{hp:245,atk:86,res:46}},
      {lv:4,sub:'Reality Shredder',hp:9200,atk:[710,1080],attr:{hp:270,atk:95,res:50}},
      {lv:5,sub:'🚨 SINGULARITY ALPHA',hp:15000,atk:[820,1250],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=40){g.bossSpecialFired=true;g.bossAtkMin=Math.floor(g.bossAtkMin*1.8);g.bossAtkMax=Math.floor(g.bossAtkMax*1.8);setMsg('🕳️ SINGULARITY ALPHA collapses time and gravity! ATK boosted by 1.8×!','var(--red)');}}
  },
  {name:'FORGE OF GENESIS',icon:'🛠️',sprIdx:20,world:5,isBoss:true,
    passive:{label:'🛠️ Iron Creator',desc:'All res 85% · Reflects 20% of physical damage back to player'},
    res:{poison:0.15,burn:0.15,paralyze:0.15,freeze:0.15,halfhp:0},
    levels:[
      {lv:1,sub:'Anvil Sentinel', hp:16500,atk:[900,1350],attr:{hp:600,atk:100,res:55}},
      {lv:2,sub:'Molten Spark',   hp:18000,atk:[980,1480],attr:{hp:650,atk:110,res:58}},
      {lv:3,sub:'Creation Pillar',hp:19800,atk:[1080,1620],attr:{hp:700,atk:120,res:62}},
      {lv:4,sub:'World Shaper',   hp:22000,atk:[1200,1800],attr:{hp:780,atk:135,res:66}},
      {lv:5,sub:'🔨 VULCAN THE ARCHITECT',hp:28000,atk:[1400,2100],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.bossAtkMin=Math.floor(g.bossAtkMin*1.5);g.bossAtkMax=Math.floor(g.bossAtkMax*1.5);setMsg('🛠️ VULCAN strikes his cosmic anvil! ATK permanently increased by 1.5×!','var(--orange)');}}},

  {name:'ECHOES OF TIME',icon:'⏳',sprIdx:21,world:5,isBoss:true,
    passive:{label:'⏳ Infinite Loop',desc:'Immune Paralyze/Freeze · Rewinds 1 turn of player actions every 4 turns'},
    res:{paralyze:0,freeze:0,poison:0.2,burn:0.2,halfhp:0},
    levels:[
      {lv:1,sub:'Past Fragment',  hp:20000,atk:[1100,1650],attr:{hp:720,atk:125,res:60}},
      {lv:2,sub:'Present Husk',  hp:22000,atk:[1200,1800],attr:{hp:780,atk:135,res:64}},
      {lv:3,sub:'Future Specter', hp:24200,atk:[1320,1980],attr:{hp:840,atk:145,res:68}},
      {lv:4,sub:'Aeon Warden',    hp:26800,atk:[1460,2200],attr:{hp:920,atk:160,res:72}},
      {lv:5,sub:'⏳ CHRONOS THE TIMELESS',hp:34000,atk:[1680,2500],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(g.bossAtkCounter%4===0&&g.bossAtkCounter>0){g.bossHP=Math.min(g.bossMaxHP,g.bossHP+1500);setMsg('⏳ CHRONOS reverses the timeline! Restored +1500 HP!','var(--cyan)');}}},

  {name:'ABYSS OF THE LOST',icon:'👁️',sprIdx:22,world:5,isBoss:true,
    passive:{label:'👁️ Void Madness',desc:'All DoTs -80% · Skills cost double resource/cooldown'},
    res:{poison:0.2,burn:0.2,paralyze:0.2,freeze:0.2,halfhp:0},
    levels:[
      {lv:1,sub:'Insanity Creep', hp:24500,atk:[1350,2050],attr:{hp:840,atk:150,res:70}},
      {lv:2,sub:'Terror tendril', hp:27000,atk:[1480,2250],attr:{hp:900,atk:160,res:74}},
      {lv:3,sub:'Dread Eye',      hp:29800,atk:[1620,2460],attr:{hp:980,atk:175,res:78}},
      {lv:4,sub:'Grave Whisper',  hp:33000,atk:[1800,2700],attr:{hp:1060,atk:190,res:82}},
      {lv:5,sub:'🐙 CTHULHU LEGACY',hp:40000,atk:[2100,3150],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=40){g.bossSpecialFired=true;g.activeEffects.push({type:'playerParalyze',turns:2},{type:'blindness',turns:3});renderEffects();setMsg('👁️ CTHULHU LEGACY inflicts absolute madness! Paralyzed and Blinded!','var(--purple)');}}},

  {name:' astral PANTHEON',icon:'💫',sprIdx:23,world:5,isBoss:true,
    passive:{label:'💫 Celestial Shield',desc:'90% status condition resistance · Breaks 1 random item per turn'},
    res:{poison:0.1,burn:0.1,paralyze:0.1,freeze:0.1,halfhp:0},
    levels:[
      {lv:1,sub:'Solar Aspect',   hp:30000,atk:[1650,2500],attr:{hp:1000,atk:180,res:85}},
      {lv:2,sub:'Lunar Aspect',   hp:33000,atk:[1820,2750],attr:{hp:1080,atk:195,res:90}},
      {lv:3,sub:'Stellar Aspect', hp:36500,atk:[2000,3000],attr:{hp:1160,atk:210,res:95}},
      {lv:4,sub:'Cosmic Jury',    hp:40500,atk:[2220,3350],attr:{hp:1260,atk:230,res:100}},
      {lv:5,sub:'🌌 AMATERASU SUPREME',hp:46000,atk:[2500,3800],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;const keys=Object.keys(g.inv).filter(k=>g.inv[k]>0);keys.forEach(k=>{g.inv[k]=Math.floor(g.inv[k]/2);});renderInventory();setMsg('💫 AMATERASU releases a cosmic pulse! All inventory item stacks are halved!','var(--magenta)');}}},

  {name:'END OF REALITY',icon:'👑',sprIdx:24,world:5,isBoss:true,
    passive:{label:'🌌 Alpha & Omega',desc:'Immune to all negative status effects and item debuffs'},
    res:{poison:0,burn:0,paralyze:0,freeze:0,halfhp:0},
    levels:[
      {lv:1,sub:'The First Light',hp:38000,atk:[2100,3200],attr:{hp:1400,atk:250,res:110}},
      {lv:2,sub:'The Last Dark', hp:42000,atk:[2320,3550],attr:{hp:1500,atk:270,res:115}},
      {lv:3,sub:'Fate Weaver',    hp:46500,atk:[2580,3950],attr:{hp:1640,atk:295,res:122}},
      {lv:4,sub:'Void Genesis',   hp:51500,atk:[2850,4350],attr:{hp:1800,atk:325,res:130}},
      {lv:5,sub:'🌟 ETERNUS PRIME',hp:75000,atk:[3500,5300],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=30){g.bossSpecialFired=true;g.bossHP=g.bossMaxHP;g.bossAtkMin=Math.floor(g.bossAtkMin*2);g.bossAtkMax=Math.floor(g.bossAtkMax*2);setMsg('👑 ETERNUS PRIME triggers Big Bang! Health fully restored and damage multiplied by 2×!','var(--yellow)');}}},
];

/* ══ REAL ENEMY PASSIVES ══ */
const PASSIVE_FX={
  0:{dodge:.20}, 1:{dr:.15}, 2:{regen:.03}, 3:{thorns:.10}, 4:{dr:.10},
  5:{dodge:.30}, 6:{dr:.10}, 7:{lifesteal:.10}, 8:{dodge:.15}, 9:{dr:.15},
  10:{dodge:.20},11:{lifesteal:.10},12:{dr:.12},13:{dodge:.20},14:{thorns:.15,dr:.10},
  15:{dr:.15},16:{lifesteal:.08},17:{dodge:.30},18:{lifesteal:.20},19:{dr:.20},
  20:{thorns:.20,dr:.15},21:{regen:.04,dr:.15},22:{dodge:.25,dr:.15},
  23:{dr:.20,thorns:.10},24:{dr:.25,lifesteal:.10},
};
function buildPassiveDesc(stg){
  const p=stg.pas||{},b=[];
  if(p.dodge)b.push(`${Math.round(p.dodge*100)}% dodge`);
  if(p.dr)b.push(`takes ${Math.round(p.dr*100)}% less dmg`);
  if(p.thorns)b.push(`reflects ${Math.round(p.thorns*100)}%`);
  if(p.lifesteal)b.push(`heals ${Math.round(p.lifesteal*100)}% of dmg dealt`);
  if(p.regen)b.push(`regens ${Math.round(p.regen*100)}%/turn`);
  const r=stg.res||{};
  Object.keys(r).forEach(k=>b.push(r[k]===0?`immune ${k}`:`${k} −${Math.round((1-r[k])*100)}%`));
  return b.length?b.join(' · '):'No special traits';
}
STAGES.forEach((s,i)=>{s.pas=PASSIVE_FX[i]||{};s.passive.desc=buildPassiveDesc(s);});
const ELEM_BY_STAGE=['nature','earth','water','fire','fire','shadow','ice','poison','chaos','chaos','electric','fire','earth','void','void','time','void','electric','fire','void','earth','time','shadow','light','void'];
STAGES.forEach((s,i)=>{s.elem=ELEM_BY_STAGE[i]||'none';});
const ELEM_FX={
  poison:{chance:.35,type:'playerPoison',turns:3,hpPerTurn:6,msg:'☠ Toxic hide poisons you on contact!',color:'var(--purple)',icon:'☠'},
  fire:{chance:.30,type:'playerBurn',turns:3,hpPerTurn:7,msg:'🔥 Scalding scales burn your hand!',color:'var(--orange)',icon:'🔥'},
  ice:{chance:.30,type:'playerSlowed',turns:2,msg:'❄ Frost bites — you feel SLOWED!',color:'var(--cyan)',icon:'❄'},
  electric:{chance:.25,type:'playerParalyze',turns:1,msg:'⚡ A shock jolts through you — PARALYZED!',color:'var(--cyan)',icon:'⚡'},
  shadow:{chance:.25,type:'blindness',turns:2,msg:'🌑 Shadows cloud your eyes — BLINDED!',color:'var(--purple)',icon:'👁'},
  void:{chance:.25,type:'blindness',turns:2,msg:'👁 The void warps your sight — BLINDED!',color:'var(--purple)',icon:'👁'},
};

const PLAYER_PASSIVES=[
  {label:'🩹 Resilience', desc:'Heal +5 HP on correct answer'},
  {label:'⚔ Sharpened',  desc:'+10 bonus dmg on correct answers'},
  {label:'🔥 Battle Aura',desc:'+14 dmg + heal 6 HP on correct'},
  {label:'🌟 Heroic Soul',desc:'+20 dmg, 9 HP heal, 15% crit ×2.5'},
];

/* ══════════════════════════════════════════════════════════════════
   BOSS ATTRIBUTES — owned on boss kill, equip 1–2 per world,
   chosen from the lobby, locked while a world is in progress.
   ══════════════════════════════════════════════════════════════════ */
const BOSS_ATTRS=[
  {id:'flamearmor',     si:4,  world:1, icon:'🔥', name:'Flame Armor',      tier:'RARE',
   desc:'Immune to Burn · take 12% less damage',
   fx:{dr:.12, immune:['burn']}},
  {id:'omegaforce',     si:9,  world:2, icon:'🌟', name:'Omega Force',      tier:'LEGEND',
   desc:'+15% ATK · 50% resistance to all status/DoT',
   fx:{atkMult:1.15, dotRes:.50}},
  {id:'astralbarrier',  si:14, world:3, icon:'🌌', name:'Astral Barrier',   tier:'EPIC',
   desc:'Reflect 18% of damage taken · 8% dodge',
   fx:{thorns:.18, dodge:.08}},
  {id:'eventhorizon',   si:19, world:4, icon:'🕳️', name:'Event Horizon',    tier:'EPIC',
   desc:'Regen 3% max HP per turn · +15% healing',
   fx:{regen:.03, healMult:1.15}},
  {id:'ironcreator',    si:20, world:5, icon:'🛠️', name:'Iron Creator',     tier:'LEGEND',
   desc:'Take 15% less damage · reflect 10%',
   fx:{dr:.15, thorns:.10}},
  {id:'infiniteloop',   si:21, world:5, icon:'⏳', name:'Infinite Loop',    tier:'LEGEND',
   desc:'Immune to Paralyze & Freeze · +2s answer time',
   fx:{immune:['paralyze','freeze','slowed'], timeBonus:2}},
  {id:'voidmadness',    si:22, world:5, icon:'👁️', name:'Void Madness',     tier:'LEGEND',
   desc:'12% dodge · lifesteal 10% of damage dealt',
   fx:{dodge:.12, lifesteal:.10}},
  {id:'celestialshield',si:23, world:5, icon:'💫', name:'Celestial Shield', tier:'MYTHIC',
   desc:'80% status resistance · take 10% less damage',
   fx:{dotRes:.80, dr:.10}},
  {id:'alphaomega',     si:24, world:5, icon:'👑', name:'Alpha & Omega',    tier:'MYTHIC',
   desc:'+25% ATK · +25% healing · 10% dodge',
   fx:{atkMult:1.25, healMult:1.25, dodge:.10}},
];
const BOSS_MULT={
  4 :{atk:1.2, icon:'💥', tier:'RARE',  col:'--orange',text:'EMBER KING DEFEATED! ATK ×1.2 permanent!'},
  9 :{all:1.5, icon:'🌟', tier:'LEGEND',col:'--yellow',text:'OMEGA REX SLAIN! All stats ×1.5!'},
  14:{all:1.4, icon:'🌌', tier:'EPIC',  col:'--purple',text:'COSMOS PRIME DEFEATED! All stats ×1.4!'},
  19:{all:1.4, icon:'🕳️', tier:'EPIC',  col:'--cyan',  text:'SINGULARITY ALPHA DEFEATED! All stats ×1.4!'},
  20:{all:1.3, icon:'🛠️', tier:'LEGEND',col:'--orange',text:'VULCAN DEFEATED! All stats ×1.3!'},
  21:{all:1.3, icon:'⏳', tier:'LEGEND',col:'--cyan',  text:'CHRONOS DEFEATED! All stats ×1.3!'},
  22:{all:1.3, icon:'🐙', tier:'LEGEND',col:'--purple',text:'CTHULHU LEGACY DEFEATED! All stats ×1.3!'},
  23:{all:1.3, icon:'💫', tier:'MYTHIC',col:'--pink',  text:'AMATERASU DEFEATED! All stats ×1.3!'},
  24:{all:1.3, icon:'👑', tier:'MYTHIC',col:'--yellow',text:'END OF REALITY CONQUERED!'},
};

const ATTR_BY_ID=Object.fromEntries(BOSS_ATTRS.map(a=>[a.id,a]));
const ATTR_BY_SI=Object.fromEntries(BOSS_ATTRS.map(a=>[a.si,a]));

/* ── slots & lock rules ── */
function attrSlots(){ return (G.stagesCleared>=15)?2:1; }        // 2nd slot after World 3
function worldOfStage(si){ return (STAGES[si]&&STAGES[si].world)||1; }
function worldBossStage(w){ return w*5-1; }                       // 4, 9, 14, 19, 24
function worldCleared(w){ return ((G.levelsCleared||[])[worldBossStage(w)]||0)>=5; }
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
  f.dodge=Math.min(.30,f.dodge); f.dr=Math.min(.30,f.dr);
  f.thorns=Math.min(.30,f.thorns); f.dotRes=Math.min(.80,f.dotRes);
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
  s.textContent=`
  .attr-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 10px;padding:8px 10px;
    border:1px solid rgba(255,255,255,.14);border-radius:12px;background:rgba(0,0,0,.35)}
  .attr-bar .ab-lbl{font-size:10px;letter-spacing:1px;opacity:.65}
  .ab-slot{display:flex;align-items:center;gap:5px;font-size:11px;padding:4px 8px;border-radius:9px;
    border:1px dashed rgba(255,255,255,.25);background:rgba(255,255,255,.05)}
  .ab-slot.filled{border-style:solid;border-color:var(--yellow,#f5c542);color:var(--yellow,#f5c542)}
  .ab-btn{margin-left:auto;font-size:11px;font-weight:700;letter-spacing:.5px;padding:6px 12px;
    border-radius:9px;border:1px solid var(--yellow,#f5c542);color:#111;background:var(--yellow,#f5c542);cursor:pointer}
  .ab-btn[disabled]{opacity:.4;cursor:not-allowed;background:transparent;color:var(--yellow,#f5c542)}
  #attr-modal{position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;
    background:rgba(0,0,0,.78);padding:16px}
  #attr-modal.on{display:flex}
  .am-box{width:100%;max-width:420px;max-height:82vh;overflow:auto;border-radius:16px;padding:16px;
    background:#14161f;border:1px solid rgba(255,255,255,.15)}
  .am-title{font-size:14px;font-weight:800;letter-spacing:1px;margin-bottom:2px}
  .am-sub{font-size:11px;opacity:.65;margin-bottom:12px}
  .am-item{display:flex;gap:10px;align-items:flex-start;padding:10px;margin-bottom:8px;border-radius:12px;
    border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);cursor:pointer}
  .am-item.on{border-color:var(--yellow,#f5c542);background:rgba(245,197,66,.12)}
  .am-item.lockedout{opacity:.35;cursor:not-allowed}
  .am-ic{font-size:20px;line-height:1}
  .am-n{font-size:12px;font-weight:700}
  .am-d{font-size:11px;opacity:.75;margin-top:2px}
  .am-t{margin-left:auto;font-size:9px;letter-spacing:1px;opacity:.8}
  .am-close{width:100%;margin-top:6px;padding:10px;border-radius:11px;font-size:12px;font-weight:700;
    border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.07);color:#fff;cursor:pointer}

    /* ── FIX 4b: cap the enemy-passive CARD, not just the text ── */
  #pp-boss{display:block;margin:0;text-align:left;max-width:100%;min-width:0;
    font-size:clamp(9px,1.3vw,11px);line-height:1.3;
    white-space:normal;overflow-wrap:anywhere;opacity:.85;
    max-height:52px;overflow-y:auto;scrollbar-width:thin}
  .pp-cap{max-width:300px!important;min-width:0!important;flex:0 1 300px!important}
  .pp-cap *{min-width:0}
  @media(min-width:1000px){.pp-cap{max-width:360px!important;flex:0 1 360px!important}}
  @media(max-width:600px){.pp-cap{max-width:100%!important;flex:1 1 100%!important}
    #pp-boss{max-height:44px}}


  /* ── FIX 5: collapsible attribute bar ── */
  .attr-bar{padding:6px 8px;margin:6px 10px}
  .ab-toggle{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;
    letter-spacing:.5px;padding:5px 10px;border-radius:9px;cursor:pointer;
    border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);color:#fff}
  .ab-caret{display:inline-block;transition:transform .15s}
  .attr-bar.open .ab-caret{transform:rotate(180deg)}
  .ab-body{display:none;width:100%;flex-wrap:wrap;gap:6px;align-items:center;margin-top:6px}
  .attr-bar.open .ab-body{display:flex}
  .ab-mini-ic{font-size:14px;line-height:1}`;
  document.head.appendChild(s);
}

function capBossPanel(){
  const e=document.getElementById('pp-boss');
  if(!e||!e.parentElement)return;
  e.parentElement.classList.add('pp-cap');
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
  document.getElementById('am-box').innerHTML=`
    <div class="am-title">BOSS ATTRIBUTE LOADOUT</div>
    <div class="am-sub">Equip up to ${n} · ${eq.length}/${n} used · locks when you enter the next world</div>
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

function tierOf(lv){return lv.boss?'boss':lv.mini?'mini':'normal';}

function estPlayerHit(){
  const pIdx=Math.min(Math.floor(G.stagesCleared/3),PLAYER_PASSIVES.length-1);
  const tierBonus={easy:12,medium:22,hard:34}[G.diff]||22;
  const passive=[0,10,14,20][pIdx];
  const timeBonus=getTimerDur()*0.5*1.8;
  return Math.max(25,Math.round((tierBonus+timeBonus+9)*1.6+G.pATK+passive));
}
function enemyHPFor(stg,lv,li){
  const creep=Math.min(2.2,1+li*0.10+(stg.world-1)*0.15);
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

const PU_ICON_MAP={
  heal:'heart', double:'zap', freeze:'snowflake', poison:'skull',
  shield:'shield', fiftyf:'target', burn:'flame', halfhp:'skull',
  paralyze:'zap', revive:'drumstick', regen:'syringe', mirror:'sparkles',
  rage:'flame', stun:'sparkle', leech:'droplet', barrier:'brick-wall',
  divine:'star', overload:'zap', gamble:'dices', nuke:'bomb',
  oracle:'eye', insight:'lightbulb',
};
const EFFECT_ICON_MAP={
  double:'zap', overload:'zap', mirror:'sparkles', freeze:'snowflake',
  paralyze:'zap', stun:'sparkle', bossPoison:'skull', bossBurn:'flame',
  shield:'shield', barrier:'brick-wall', playerPoison:'skull', playerBurn:'flame',
  playerFreeze:'snowflake', playerParalyze:'zap', playerRegen:'syringe',
  playerRage:'flame', playerSlowed:'turtle', playerEnergyLock:'lock',
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
];

const PU={
  heal:    {icon:'💚',name:'HEAL',    color:'var(--green)', border:'#4ecb71',desc:'Restore 6% of your max HP (min 30)'},
  double:  {icon:'⚡',name:'2× DMG',  color:'var(--yellow)',border:'#f5c842',desc:'Next hit ×2 · stacks to ×16 (4 max)'},
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
  overload:{icon:'⚡',name:'OVERLOAD',color:'var(--yellow)',border:'#f5c842',desc:'Next hit ×3, but you take +20% on the next hit'},
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


function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));document.getElementById(id).classList.add('on');if(window.lucide)lucide.createIcons();}
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
  if(!G||!G.diff||G.isPractice)return;
  try{
    const s=JSON.parse(JSON.stringify(G));
    s.qUsed={easy:[...G.qUsed.easy],medium:[...G.qUsed.medium],hard:[...G.qUsed.hard]};
    s._customQUsed = G._customQUsed instanceof Set ? [...G._customQUsed] : [];
    s.timerInterval=null;s.animLock=false;s.currentQ=null;
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
    if(!validDiff||!validStage||!validLevel){try{localStorage.removeItem(key);}catch(e){}return false;}
    G=s;
    G.qUsed={
      easy:new Set(s.qUsed?.easy||[]),
      medium:new Set(s.qUsed?.medium||[]),
      hard:new Set(s.qUsed?.hard||[]),
    };
    G._customQUsed=new Set(Array.isArray(s._customQUsed)?s._customQUsed:[]);
    G.timerInterval=null;G.animLock=false;G.currentQ=null;
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
    const snap={
      diff:G.diff,
      levelsCleared:STAGES.map(()=>5),
      stagesCleared:STAGES.length,
      curStage:STAGES.length-1,curLevel:4,
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
  G=freshState(snap.diff||'medium');
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
  show('s-title');
  refreshTitle();
}
function quitToTitle(){
_battleSession++;
stopBattleBgLoop();
if(!G.isPractice && !G.viewOnly)saveGame();   // ← EDIT THIS LINE
show('s-title');
refreshTitle();}

function quitBattle(){
_battleSession++;
stopBattleBgLoop();
  clearInterval(G.timerInterval);
  saveGame();
  show('s-title');
  refreshTitle();
}

function resumeBattle(){
_battleSession++; G._session=_battleSession;
  document.body.classList.toggle('practice-mode', !!(G.isPractice||G.isSyllabusRun));
  const si=G.curStage,li=G.curLevel,stg=STAGES[si],lv=stg.levels[li];
  const isBoss=!!(lv.boss||lv.mini||stg.isBoss),worldIdx=stg.world-1;
  document.getElementById('player-spr').innerHTML=SPR_PLAYER;
  const bEl=document.getElementById('boss-spr');
  bEl.innerHTML=makeSpr(ECOL[stg.sprIdx],isBoss?90:68);
  document.getElementById('g-stage').textContent=`S${si+1}-L${li+1}`;
  document.getElementById('g-boss-name').textContent=lv.sub;
  document.getElementById('boss-f-name').textContent=lv.sub;
  const pIdx=Math.min(Math.floor(G.stagesCleared/3),PLAYER_PASSIVES.length-1);
  document.getElementById('pp-player').textContent=PLAYER_PASSIVES[pIdx].label+' — '+PLAYER_PASSIVES[pIdx].desc;
  let bd=stg.passive.label+' — '+stg.passive.desc;
  const rk=Object.keys(stg.res||{});
  if(rk.length)bd+=' | RES: '+rk.map(k=>stg.res[k]===0?`${k.toUpperCase()}×IMM`:`${k.toUpperCase()} ${Math.round((1-stg.res[k])*100)}%↓`).join(', ');
  if(typeof _attrCSS==='function')_attrCSS();
  document.getElementById('pp-boss').textContent=bd;
  capBossPanel();
  document.getElementById('stage-info').textContent=`${stg.name} — HP:${G.bossMaxHP} ATK:${G.bossAtkMin}–${G.bossAtkMax}`;
  const bc2=document.getElementById('battle-canvas');
  requestAnimationFrame(()=>{drawBattleBg(bc2,si);});
  document.getElementById('battle-content').classList.remove('walk-hidden');
  document.getElementById('walk-layer').style.display='none';
  renderAttrs();updateBars();renderInventory();renderEffects();
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
      <div style="display:flex;gap:8px;width:100%">
        <button class="pbtn sm" style="flex:1;color:var(--dim);border-color:var(--border)" onclick="closeModal('reset-confirm-modal')"><i data-lucide="x"></i> CANCEL</button>
        <button class="pbtn r sm" style="flex:1" onclick="doResetProgress('normal');showDiff('normal')"><i data-lucide="trash-2"></i> ERASE &amp; START</button>
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
      info=`Saved run: ${s.diff.toUpperCase()} &middot; S${(s.curStage||0)+1}-L${(s.curLevel||0)+1} &middot; Score ${s.score||0}`;
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

// how many to pick + how many cards to offer, per pick-stage
const PICK_TIERS={
  startup:{target:3,offer:8,refill:0,banner:'WORLD 1 LOADOUT — PICK 3'},
  w2:{target:1,offer:5,refill:2,banner:'WORLD 2 — ADD 1 POWERUP (+2 to every stack)'},
  w3:{target:1,offer:5,refill:2,banner:'WORLD 3 — ADD 1 POWERUP (+2 to every stack)'},
  w4:{target:1,offer:5,refill:3,banner:'WORLD 4 — ADD 1 POWERUP (+3 to every stack)'},
  w5:{target:2,offer:6,refill:4,banner:'WORLD 5 — ADD 2 POWERUPS (+4 to every stack)'},
};


function startGame(diff){
  G=freshState(diff);
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
function goPickStage(key){
  const tier=PICK_TIERS[key];
  G._pickStageKey=key;
  G._pickMode='loadout';
  G._picked=[];
  G._pickTarget=tier.target;
  G.loadout=G.loadout||[];
  const pool=Object.keys(PU).filter(t=>!G.loadout.includes(t));
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
  let key=null;
  if(world>=2 && !G.worldPicksDone.w2) key='w2';
  else if(world>=3 && !G.worldPicksDone.w3) key='w3';
  else if(world>=4 && !G.worldPicksDone.w4) key='w4';
  else if(world>=5 && !G.worldPicksDone.w5) key='w5';
  if(key){
    G.worldPicksDone[key]=true;
    G._pickResume={si:nextSi,li:nextLi};
    goPickStage(key);
    return true;
  }
  afterFn();
  return false;
}




let _curWorld=0; // 0-indexed currently-viewed world

function buildMap(){
G.inBattle=false;
if(G.timedMode===undefined)G.timedMode=true;
updateTimerToggleBtn();
  document.getElementById('mhp').textContent=G.playerMaxHP;
  document.getElementById('matk').textContent='+'+G.pATK;
  document.getElementById('mres').textContent=G.pRES+'%';
  document.getElementById('mscore').textContent=G.score;

  const track=document.getElementById('map-track');
  track.innerHTML='';
  const worldColors=['wl-1','wl-2','wl-3','wl-4','wl-5'];
  const worldNames=[
    'WORLD 1  THE KNOWN LANDS',
    'WORLD 2  THE DARK BEYOND',
    'WORLD 3  THE ABYSS',
    'WORLD 4  THE VOID FRONTIER',
    'WORLD 5  THE CELESTIAL PANTHEON'
  ];

  for(let world=1;world<=5;world++){
    const slide=document.createElement('div');
    slide.className='map-slide';
    const label=document.createElement('div');
    label.className='world-label '+worldColors[world-1];
    label.textContent=worldNames[world-1];
    slide.appendChild(label);

    const stages=document.createElement('div');
    stages.className='slide-stages';
    const stageIndices=STAGES.map((s,i)=>i).filter(i=>STAGES[i].world===world);
    const wrap=document.createElement('div');
    wrap.style.cssText='display:flex;align-items:center;justify-content:center;gap:0;width:100%;flex-wrap:wrap';

    stageIndices.forEach((si,pos)=>{
      if(pos>0){
        const conn=document.createElement('div');
        const prevDone=G.levelsCleared[stageIndices[pos-1]]>=5;
        conn.className='path-connector'+(prevDone?' done':'');
        wrap.appendChild(conn);
      }
      const cleared=G.levelsCleared[si]>=5,current=G.curStage===si,locked=G.curStage<si,stg=STAGES[si];
      const node=document.createElement('div');
      let cls='stage-node ';
      if(cleared)cls+='sn-done ';else if(current)cls+='sn-active ';else cls+='sn-locked locked ';
      if(si===4)cls+='sn-boss5 ';if(si===9)cls+='sn-boss10 ';
      node.className=cls.trim();
      node.innerHTML=`<div class="sn-orb"><div class="sn-num">S${si+1}</div><div class="sn-icon">${stg.icon}</div></div><div class="sn-label" style="color:${stg.isBoss?(si===4?'var(--orange)':'var(--red)'):'var(--teal)'}">${stg.name}</div><div class="sn-pips" id="pips-${si}"></div><div class="reward-badge">${stg.isBoss?'Boss Rewards!':'Level Drops'}</div>`;
      if(!locked && !G.viewOnly)node.addEventListener('click',()=>showStageLevels(si));
      wrap.appendChild(node);
    });
    stages.appendChild(wrap);

    // sublevel row for the current stage if it's in this world
    if(stageIndices.includes(G.curStage)){
      const slRow=document.createElement('div');
      slRow.className='sublevel-row';
      const stg=STAGES[G.curStage];
      stg.levels.forEach((lv,li)=>{
        const done=G.levelsCleared[G.curStage]>li,cur=G.levelsCleared[G.curStage]===li,locked2=G.levelsCleared[G.curStage]<li;
        const bub=document.createElement('div');
        bub.className='sl-bubble '+(done?'sl-done':cur?'sl-cur':'sl-locked');
        bub.textContent='L'+(li+1);bub.title=lv.sub;
        if(!locked2 && !G.viewOnly)bub.addEventListener('click',()=>{if(cur)enterLevel(G.curStage,li);});
        slRow.appendChild(bub);
      });
      stages.appendChild(slRow);
    }

    slide.appendChild(stages);
    track.appendChild(slide);
  }

    // ── COMING SOON slide (after World 5) ──
  const soon=document.createElement('div');
  soon.className='map-slide';
  soon.innerHTML=`<div class="world-label wl-soon">WORLD 6 &nbsp;???</div>
    <div class="soon-wrap">
      <div class="soon-orb">🔒</div>
      <div class="soon-title">COMING SOON</div>
      <div class="soon-sub">New worlds, new bosses, new attributes.<br>Finish WORLD 5 while you wait.</div>
    </div>`;
  track.appendChild(soon);


  // fill pips
  STAGES.forEach((stg,si)=>{
    const pipsEl=document.getElementById('pips-'+si);if(!pipsEl)return;
    stg.levels.forEach((_,li)=>{
      const pip=document.createElement('div');
      const done=G.levelsCleared[si]>li,cur=G.curStage===si&&G.levelsCleared[si]===li;
      pip.className='pip'+(done?' p-done':cur?' p-cur':'');
      pipsEl.appendChild(pip);
    });
  });

  // dots
    const dots=document.getElementById('map-dots');dots.innerHTML='';
  for(let w=0;w<6;w++){
    const d=document.createElement('div');
    const isSoon=(w===5);
    const reached=isSoon?(STAGES[G.curStage].world>=5)
                        :STAGES.some((s,i)=>s.world===w+1&&G.curStage>=i);
    d.className='map-dot'+(w===_curWorld?' active':'')+(reached?'':' preview')+(isSoon?' soon':'');
    d.title=reached?`World ${w+1}`:`World ${w+1} — preview`;
    d.onclick=()=>goToWorld(w);
    dots.appendChild(d);
  }


  // jump to the world containing the current stage on first build
  _curWorld=STAGES[G.curStage].world-1;
  updateSlide();
  renderAttrBar('map');
}

const TOTAL_SLIDES=6;                 // 5 worlds + COMING SOON
function maxSlide(){ return TOTAL_SLIDES-1; }   // browsing is always allowed


function updateSlide(){
  const track=document.getElementById('map-track');
  track.style.transform=`translateX(-${_curWorld*100}%)`;
  document.getElementById('map-prev').disabled=_curWorld<=0;
  // can't view worlds that are fully locked
  const maxWorld=maxSlide();
  document.getElementById('map-next').disabled=_curWorld>=maxWorld;
  document.querySelectorAll('.map-dot').forEach((d,i)=>d.classList.toggle('active',i===_curWorld));
}

function slideWorld(dir){
  const maxWorld=maxSlide();
  const next=_curWorld+dir;
  if(next<0||next>maxWorld)return;
  _curWorld=next;updateSlide();
}

function goToWorld(w){
  const maxWorld=maxSlide();
  if(w<0||w>maxWorld)return;
  _curWorld=w;updateSlide();
}

/* swipe for phones AND mouse-drag on desktop */
(function(){
  const wrap=document.querySelector('.map-slider-wrap');
  const track=document.getElementById('map-track');
  if(!wrap||!track) return;
  let startX=0,startY=0,dragging=false,dragDX=0;

  function isMapOn(){return document.getElementById('s-map').classList.contains('on');}

  wrap.addEventListener('pointerdown',e=>{
    if(!isMapOn())return;
    dragging=true;dragDX=0;
    startX=e.clientX;startY=e.clientY;
    wrap.setPointerCapture(e.pointerId);
    track.style.transition='none';
  });
  wrap.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    if(Math.abs(dy)>Math.abs(dx))return; // vertical intent, ignore
    dragDX=dx;
    const pct=(dx/(wrap.clientWidth||1))*100;
    track.style.transform=`translateX(calc(-${_curWorld*100}% + ${pct}%))`;
  });
  function endDrag(){
    if(!dragging)return;
    dragging=false;
    track.style.transition='';
    if(Math.abs(dragDX)>60)slideWorld(dragDX<0?1:-1);
    else updateSlide(); // snap back
  }
  wrap.addEventListener('pointerup',endDrag);
  wrap.addEventListener('pointercancel',endDrag);
  wrap.addEventListener('pointerleave',()=>{if(dragging)endDrag();});
})();

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
    btn.style.color='var(--yellow)';btn.style.borderColor='var(--yellow)';
  }else{
    btn.innerHTML='<i data-lucide="coffee"></i> CHILL';
    btn.style.color='var(--teal)';btn.style.borderColor='var(--teal)';
  }
  btn.disabled=locked;
  btn.title=locked?'Locked until this run ends':'Toggle timer mode';
  refreshIcons();
}

function showStageLevels(si){if(si!==G.curStage)return;enterLevel(si,G.levelsCleared[si]);}
function enterLevel(si,li){G.curStage=si;G.curLevel=li;show('s-game');loadLevel(si,li);}

function adjHex(hex,amt){const n=parseInt(hex.slice(1),16);return `rgb(${Math.min(255,((n>>16)&0xff)+amt)},${Math.min(255,((n>>8)&0xff)+amt)},${Math.min(255,(n&0xff)+amt)})`;}

/* ---- SceneFX-backed backgrounds ---- */
function drawBattleBg(canvas,si){
  canvas.width=canvas.offsetWidth||400;
  canvas.height=canvas.offsetHeight||260;
  startBattleBgLoop(canvas,si);
}
function startBattleBgLoop(canvas,si){
  cancelAnimationFrame(canvas._bgRAF);
  const ctx=canvas.getContext('2d');
  const session=_battleSession;
  function loop(){
    if(session!==_battleSession||!canvas.isConnected)return;
    window.SceneFX.render(ctx,canvas,'battle',si);
    canvas._bgRAF=requestAnimationFrame(loop);
  }
  loop();
}
function stopBattleBgLoop(){
  const c=document.getElementById('battle-canvas');
  if(c)cancelAnimationFrame(c._bgRAF);
}

function drawWalkInside(canvas,si){
  const ctx=canvas.getContext('2d');
  window.SceneFX.render(ctx,canvas,'walk',si);
}

let _walkId=null,_walkX=0;


function playWalkInBattle(si,li,onDone){
  const stg=STAGES[si],lv=stg.levels[li];
  normalizeAttrs(); lockAttrsForWorld(si);
  const worldIdx=stg.world-1,isBoss=!!(lv.boss||lv.mini||stg.isBoss);
  const layer=document.getElementById('walk-layer'),bc=document.getElementById('battle-content');
  layer.style.display='block';bc.classList.add('walk-hidden');
  const wc=document.getElementById('walk-canvas');
  document.getElementById('walk-player-spr').innerHTML=SPR_PLAYER;
  document.getElementById('walk-enemy-spr').innerHTML='';
  document.getElementById('walk-enemy-spr').classList.remove('visible');
  document.getElementById('walk-label').textContent=`S${si+1}-L${li+1}: ${lv.sub}`;
  _walkX=0;cancelAnimationFrame(_walkId);
  let frame=0;const TOTAL=50,ENEMY_AT=32;let eShown=false;
  function animate(){
    _walkX+=3.5;frame++;
    wc.width=wc.offsetWidth||400;wc.height=wc.offsetHeight||260;
    drawWalkInside(wc,si);
    const pct=Math.min(frame/TOTAL,1);
    const dEl=document.getElementById('walk-player-spr');
    dEl.style.left=(-15+pct*(wc.width*0.28))+'px';
    dEl.style.bottom=(wc.height*.28)+'px';
    if(frame>=ENEMY_AT&&!eShown){
      eShown=true;
      const eEl=document.getElementById('walk-enemy-spr');
      eEl.innerHTML=makeSpr(ECOL[stg.sprIdx],isBoss?90:68);
      eEl.style.bottom=(wc.height*.28)+'px';
      eEl.classList.add('visible');
    }
    if(frame<TOTAL+12){_walkId=requestAnimationFrame(animate);}
    else{cancelAnimationFrame(_walkId);setTimeout(()=>{layer.style.display='none';bc.classList.remove('walk-hidden');onDone();},200);}
  }
  animate();
}

function loadLevel(si,li){
_battleSession++; G._session=_battleSession;
  G.inBattle=true;
  G.timerModeLocked=true;
    document.body.classList.toggle('practice-mode', !!(G.isPractice||G.isSyllabusRun));
  const stg=STAGES[si],lv=stg.levels[li];
  normalizeAttrs(); lockAttrsForWorld(si);
  const isBoss=!!(lv.boss||lv.mini||stg.isBoss),worldIdx=stg.world-1;
  const calcHP=enemyHPFor(stg,lv,li);
  G.bossHP=calcHP;G.bossMaxHP=calcHP;
  const atkRange=enemyAtkFor(stg,lv,li);
  G.bossAtkMin=atkRange[0];G.bossAtkMax=atkRange[1];


  G.bossSpecialFired=false;G.rageMult=1;G.bossAtkCounter=0;G.activeEffects=[];G.eliminated=[];

  document.getElementById('player-spr').innerHTML=SPR_PLAYER;
  const bEl=document.getElementById('boss-spr');
  bEl.innerHTML=makeSpr(ECOL[stg.sprIdx],isBoss?90:68);
  document.getElementById('g-stage').textContent=`S${si+1}-L${li+1}`;
  document.getElementById('g-boss-name').textContent=lv.sub;
  document.getElementById('boss-f-name').textContent=lv.sub;
  const pIdx=Math.min(Math.floor(G.stagesCleared/3),PLAYER_PASSIVES.length-1);
  document.getElementById('pp-player').textContent=PLAYER_PASSIVES[pIdx].label+' — '+PLAYER_PASSIVES[pIdx].desc;
  
  let bd=stg.passive.label+' — '+stg.passive.desc;
  const rk=Object.keys(stg.res||{});
  if(rk.length)bd+=' | RES: '+rk.map(k=>stg.res[k]===0?`${k.toUpperCase()}×IMM`:`${k.toUpperCase()} ${Math.round((1-stg.res[k])*100)}%↓`).join(', ');
  if(typeof _attrCSS==='function')_attrCSS();
  document.getElementById('pp-boss').textContent=bd;
  document.getElementById('stage-info').textContent=`${stg.name} — HP:${calcHP} ATK:${G.bossAtkMin}–${G.bossAtkMax}`;
  const bc2=document.getElementById('battle-canvas');
  requestAnimationFrame(()=>{drawBattleBg(bc2,si);});
  renderAttrs();updateBars();renderInventory();renderEffects();
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
function getTimerDur(){
  let d={easy:30,medium:20,hard:12}[G.diff]||20;
  if(G&&G.activeEffects&&G.activeEffects.some(e=>e.type==='playerSlowed'))d=Math.max(6,Math.round(d*0.6));
  if(typeof attrFX==='function'&&G&&G.attrsEquipped)d+=attrFX().timeBonus||0;
  return d;
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
    if(wrongIdx.length)G.petrified.push(wrongIdx[Math.floor(Math.random()*wrongIdx.length)]);
}
  const tag=document.getElementById('q-diff-tag');
  tag.textContent=q.tier.toUpperCase();tag.className=`q-tag q-diff-${q.tier}`;
  document.getElementById('q-type-tag').textContent=q.type.toUpperCase();
  document.getElementById('q-text').textContent=q.q;
  renderChoices();setTurnIndicator(true);startTimer();
}

function onAnswer(chosen,btnEl,idx){
  if(G.animLock)return;clearInterval(G.timerInterval);G.animLock=true;
  const correct=chosen===G.currentQ.a;highlightChoices(chosen);

  if(correct){
    sfx.correct();G.streak++;G.combo=Math.min(8,1+Math.floor(G.streak/3));
        bumpStat('correct');maxStat('bestStreak',G.streak);maxStat('bestCombo',G.combo);
    document.getElementById('sc-streak').textContent=G.streak;
    document.getElementById('sc-combo').textContent=`×${G.combo}`;
    const streakEl=document.getElementById('sc-streak');
    streakEl.classList.remove('streak-pop');void streakEl.offsetWidth;streakEl.classList.add('streak-pop');

    const pIdx=Math.min(Math.floor(G.stagesCleared/3),PLAYER_PASSIVES.length-1);
    const tierBonus={easy:12,medium:22,hard:34}[G.currentQ.tier]||12;
    const timeComponent=G.timedMode?G.timerVal*1.8:getTimerDur()*0.9;
    let dmg=(tierBonus+timeComponent+G.streak*3)*G.combo;
    if(G.activeEffects.some(e=>e.type==='playerRage'))dmg*=2;
    if([5,10,15,20,25,30].includes(G.streak)){dmg*=1.5;spawnFloat(`🔥 STREAK ${G.streak}!`,'var(--yellow)',false);sfx.powerup();}
    const hasDouble=G.activeEffects.find(e=>e.type==='double');
    if(hasDouble){dmg*=Math.pow(2,hasDouble.stack||1);G.activeEffects=G.activeEffects.filter(e=>e!==hasDouble);}
    const hasOver=G.activeEffects.find(e=>e.type==='overload');
    if(hasOver){dmg*=Math.pow(3,hasOver.stack||1);G.activeEffects=G.activeEffects.filter(e=>e!==hasOver);}
    dmg+=G.pATK;if(pIdx>=1)dmg+=10;if(pIdx>=2)dmg+=14;if(pIdx>=3)dmg+=20;
    let crit=false;if(pIdx>=3&&Math.random()<0.15){dmg*=2.5;crit=true;}
    const _af=attrFX();
    dmg*=_af.atkMult;
    dmg=Math.floor(dmg);

    const stg=STAGES[G.curStage];
    const pas=stg.pas||{};
    if(G.activeEffects.some(e=>e.type==='freeze'))dmg=Math.floor(dmg*1.2);
    const poisonEff=G.activeEffects.find(e=>e.type==='bossPoison');
    const dodgeReduction=poisonEff?Math.min(pas.dodge||0,(poisonEff.stack||1)*0.05):0;
    const effDodge=Math.max(0,(pas.dodge||0)-dodgeReduction);
    let blocked='';
    if(G.activeEffects.some(e=>e.type==='blindness')&&Math.random()<0.40){dmg=0;blocked='blind';}
    else if(effDodge&&Math.random()<effDodge){dmg=0;blocked='dodge';}
    else{
      if(pas.dr)dmg=Math.max(1,Math.floor(dmg*(1-pas.dr)));
      if(pas.thorns&&dmg>0){
        const back=Math.max(1,Math.floor(dmg*pas.thorns));
        G.playerHP=Math.max(0,G.playerHP-back);
        spawnFloat(`-${back}🌵`,'var(--orange)',false);
      }
    }

    if(dmg>0){
      G.bossHP=Math.max(0,G.bossHP-dmg);G.score+=dmg;
      spawnFloat(`-${dmg}${crit?' CRIT!':''}`,'var(--red)',true);
      setMsg(crit?`💥 CRIT! ${dmg} dmg! ×${G.combo}`:`✓ ${dmg} dmg! ×${G.combo}`,'var(--green)');
    }else{
      spawnFloat(blocked==='blind'?'MISS':'DODGE','var(--dim)',true);
      setMsg(blocked==='blind'?'👁 Blinded — your counter missed!':'💨 The enemy dodged your counter!','var(--dim)');
    }
    const efx=ELEM_FX[stg.elem];
    if(dmg>0&&efx&&Math.random()<efx.chance){
      addOrStackEffect(efx.type,{turns:efx.turns,hpPerTurn:efx.hpPerTurn});
      renderEffects();
      spawnFloat(efx.icon,efx.color,false);
      setTimeout(()=>setMsg(efx.msg,efx.color),700);
    }
    document.getElementById('sc-score').textContent=G.score;
    document.getElementById('g-score').textContent='SCORE:'+G.score;

    
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
    if(G.bossHP<=0){G.animLock=false;handleLevelWin();return;}

    doAnim('player-f','aR',()=>{doAnim('boss-f','aS',()=>{setTurnIndicator(false);
      setTimeout(()=>bossAttacks(()=>{G.animLock=false;if(G.playerHP>0)setTimeout(nextQ,500);}),400);});});

  } else {
    sfx.wrong();G.streak=0;G.combo=Math.max(1,G.combo-1);
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
  if(G._session !== _battleSession) return;
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
    if(h>0){G.bossHP=Math.min(G.bossMaxHP,G.bossHP+h);spawnFloat(`+${h}`,'var(--green)',true);}
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
    if(h>0){G.bossHP=Math.min(G.bossMaxHP,G.bossHP+h);spawnFloat(`+${h}🩸`,'var(--green)',true);
  }
}

  if(G.playerHP<=0&&G.inv.revive>0){
    G.inv.revive--;G.playerHP=Math.max(1,Math.round(G.playerMaxHP*0.25));
    renderInventory();setMsg(`🍖 REVIVE! Back at ${G.playerHP} HP!`,'var(--pink)');sfx.powerup();
  }
  if(G.bossHP<=0&&G.playerHP>0){updateBars();handleLevelWin();return;}

  doAnim('boss-f','aL',()=>{doAnim('player-f','aS',()=>{
    updateBars();
    if(G.playerHP<=0){sfx.gameover();setTimeout(()=>endGame(false),400);return;}
    if(cb)cb();
  });});
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
    'playerFreeze','playerParalyze','playerVulnerable'
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
    if(managedElsewhere.has(e.type)) return e.turns>0;
    e.turns--;
    return e.turns>0;
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
    spawnFloat(`${cfg.name}${stackTxt}`,cfg.bar,isBoss);
  });
}

function renderEffects(){
  announceNewEffects();
  const rows=document.getElementById('effect-rows');
  if(!G.activeEffects.length){rows.innerHTML='<span style="font-size:11px;color:var(--dim)">No effects</span>';return;}

  rows.innerHTML=G.activeEffects.map(e=>{
    const c=EFFECT_LABELS[e.type]||{name:e.type,bar:'#fff'};
    const iconName=EFFECT_ICON_MAP[e.type]||'sparkles';
    const t=['double','overload','mirror'].includes(e.type)?'NEXT':`${e.turns}t`;
    const stackTxt=(e.stack&&e.stack>1)?` ×${e.stack}`:'';
    return `<span style="display:inline-flex;align-items:center;gap:3px;background:var(--panel2);border:1px solid ${c.bar};border-radius:4px;padding:1px 5px;font-size:11px;color:${c.bar}">${luc(iconName,12)} ${c.name}${stackTxt} <b>${t}</b></span>`;
  }).join('');

  document.getElementById('boss-stat').innerHTML=
    (G.activeEffects.some(e=>e.type==='bossPoison')?`<span class="sicon">${luc('skull',15)}</span>`:'')+
    (G.activeEffects.some(e=>e.type==='bossBurn')?`<span class="sicon">${luc('flame',15)}</span>`:'')+
    (G.activeEffects.some(e=>e.type==='freeze')?`<span class="sicon">${luc('snowflake',15)}</span>`:'')+
    (G.activeEffects.some(e=>e.type==='paralyze')?`<span class="sicon">${luc('zap',15)}</span>`:'');
  document.getElementById('player-stat').innerHTML=
    (G.activeEffects.some(e=>e.type==='shield')?`<span class="sicon">${luc('shield',15)}</span>`:'')+
    (G.activeEffects.some(e=>e.type==='playerPoison')?`<span class="sicon">${luc('skull',15)}</span>`:'')+
    (G.activeEffects.some(e=>e.type==='playerBurn')?`<span class="sicon">${luc('flame',15)}</span>`:'')+
    (G.activeEffects.some(e=>e.type==='playerParalyze'||e.type==='playerFreeze')?`<span class="sicon">${luc('zap',15)}</span>`:'');
  refreshIcons();
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
  overload:{turnsAdd:2,cap:3},
  mirror:{turnsAdd:1,cap:3},
  playerRegen:{turnsAdd:3,magKey:'hpPerTurn',magBase:regenAmtFor,cap:5},
  playerRage:{turnsAdd:3,cap:3},
};

function addOrStackEffect(type,extra){
  const cfg=STACK_CFG[type]||{turnsAdd:(extra&&extra.turns)||2,cap:5};
  const mb=(typeof cfg.magBase==='function')?cfg.magBase():cfg.magBase;   // ← NEW
  let e=G.activeEffects.find(x=>x.type===type);
  if(!e){
    e=Object.assign({type,stack:1,turns:cfg.turnsAdd},extra);
    if(cfg.magKey)e[cfg.magKey]=mb;
    G.activeEffects.push(e);
    return e;
  }
  e.stack=Math.min(cfg.cap||5,(e.stack||1)+1);
  e.turns=Math.max(e.turns,cfg.turnsAdd);
  if(cfg.magKey){
    const raw=mb*e.stack;
    e[cfg.magKey]=cfg.magCapAt?Math.min(cfg.magCapAt,raw):raw;
  }
  return e;
}


function usePowerup(type){
  if(!PU[type])return;
  if(G.animLock)return;if(G.activeEffects.some(e=>e.type==='playerEnergyLock')){
    setMsg('⚡ Your skills are LOCKED!','var(--yellow)');return;
  }
  if(!G.inv[type]||G.inv[type]<=0)return;
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
      const pool=Object.keys(PU).filter(t=>t!=='gamble'&&t!=='revive');
      const picked=pool[Math.floor(Math.random()*pool.length)];
      sfx.powerup();setMsg(`🎲 GAMBLE! Auto-using: ${PU[picked].icon} ${PU[picked].name}!`,'var(--pink)');
      spawnFloat(`🎲 ${PU[picked].icon}`,'var(--pink)',false);
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
          if(txt===correct)btn.style.background='rgba(245,200,66,0.15)';
          else btn.style.opacity='0.4';
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



function rollDrop(streak,diff){
  const pool=(G.loadout||[]).filter(t=>t!=='revive');
  if(!pool.length)return null;
  let chance={easy:.48,medium:.36,hard:.24}[diff]||.36;
  if(streak>=7&&(G.loadout||[]).includes('revive')&&Math.random()<.10)return 'revive';
  if(streak>=3)chance+=.10;
  if(Math.random()>chance)return null;
  return pool[Math.floor(Math.random()*pool.length)];
}


function handleLevelWin(){
  clearInterval(G.timerInterval);sfx.victory();
  const si=G.curStage,li=G.curLevel,stg=STAGES[si],lv=stg.levels[li];
  const isFinalLevel=li===4,isFinalStage=si===24&&isFinalLevel;
  const attr=lv.attr;
  const _b={hp:G.pHP,atk:G.pATK,res:G.pRES};
  G.pHP+=attr.hp;G.pATK+=attr.atk;G.pRES+=attr.res;
  capPlayerStats();
  const _gain={hp:G.pHP-_b.hp,atk:G.pATK-_b.atk,res:G.pRES-_b.res};
  const _hpBeforeHeal=G.playerHP;
  G.playerHP=Math.min(G.playerMaxHP,G.playerHP+attr.hp+Math.round(G.playerMaxHP*CLEAR_HEAL));
  const _healed=G.playerHP-_hpBeforeHeal;
  G.levelsCleared[si]=Math.max(G.levelsCleared[si],li+1);if(isFinalLevel)G.stagesCleared++;
    bumpStat('levels'); if(isFinalLevel)bumpStat('stages');
  if(lv.boss||lv.mini)bumpStat('bosses');
  if(G.playerHP/G.playerMaxHP<=0.15)bumpStat('clutch');
  if(isFinalStage){
    const m=BOSS_MULT[24];
    if(m&&m.all){G.pHP=Math.floor(G.pHP*m.all);G.pATK=Math.floor(G.pATK*m.all);G.pRES=Math.floor(G.pRES*m.all);capPlayerStats();}
    grantBossAttr(24);
    G.score+=5000;
    setTimeout(()=>endGame(true),600);return;
  }
  const nextSi=isFinalLevel?si+1:si,nextLi=isFinalLevel?0:li+1;
  const awTitleEl=document.getElementById('aw-title');
  awTitleEl.innerHTML=lv.boss
    ?'<i data-lucide="crown" style="width:16px;vertical-align:-3px"></i> BOSS DEFEATED!'
    :lv.mini
    ?'<i data-lucide="swords" style="width:16px;vertical-align:-3px"></i> MINI-BOSS CLEAR!'
    :'<i data-lucide="check" style="width:16px;vertical-align:-3px"></i> LEVEL CLEAR!';  document.getElementById('aw-sub').textContent=lv.sub+' defeated!';
  const gains=document.getElementById('aw-gains');gains.innerHTML='';
    const addStat=(icon,label,want,got,cls)=>{
    const zero=!want;
    const r=document.createElement('div');
    r.className='aw-row '+cls+(zero?' aw-none':'');
    r.innerHTML=`<span class="aw-icon">${icon}</span><span class="aw-text">${label}</span>`+
      `<span class="aw-val">${zero?'—':(got>0?'+'+got:'MAX')}</span>`;
    gains.appendChild(r);
  };
  addStat('❤','MAX HP',attr.hp,_gain.hp,'aw-hp');
  addStat('⚔','ATTACK',attr.atk,_gain.atk,'aw-atk');
  addStat('🛡','RESIST',attr.res,_gain.res,'aw-res');
  addStat('💚','RECOVERED',_healed,_healed,'aw-heal');

    if(lv.boss&&BOSS_MULT[si]){
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
    }else if(nextLi % 2 === 0){
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


function goPickPU(nextSi,nextLi){
  // One-time picking for the WHOLE game. If already done, skip straight ahead.
  if(G.pickDone){goNextLevel(nextSi,nextLi);return;}
  G._picked=[];              // track chosen cards this session
  G._pickTarget=5;           // pick exactly 5
  G._pickNext={si:nextSi,li:nextLi};
  const allTypes=Object.keys(PU);
  shuffle(allTypes);
  G._pickChoices=allTypes.slice(0,8);   // offer 8, choose 5
  renderPickPU();
  show('s-pickpu');
}

function goMidPick(nextSi,nextLi){
  G._picked=[];G._pickMode='mid';G._pickStageKey=null;G._pickBanner='';
  G._pickNext={si:nextSi,li:nextLi};
  // Draw from ALL powerups, not just ones already owned — otherwise
  // the "auto-use if you don't own it" branch can never trigger.
  const pool=Object.keys(PU).filter(t=>t!=='revive');
  shuffle(pool);
  G._pickChoices=pool.slice(0,3);
  renderPickPU();show('s-pickpu');
}
function renderPickPU(){
  const isMid=G._pickMode==='mid';
  const banner=document.getElementById('pickpu-banner');
  document.getElementById('pickpu-title').textContent=isMid?'PICK A POWERUP':'CHOOSE YOUR LOADOUT';
  document.getElementById('pickpu-sub').textContent=isMid
    ? 'Choose 1 of 3 — if you don\'t own it, it activates instantly!'
    : `Pick ${G._pickTarget} powerups!`;
  document.getElementById('pickpu-progress').textContent=isMid
    ? '' : `PICKED ${G._picked.length} / ${G._pickTarget}`;
  if(banner){
    if(G._pickBanner){banner.style.display='block';banner.textContent=G._pickBanner;}
    else banner.style.display='none';
  }
  document.getElementById('pickpu-cards').innerHTML=G._pickChoices.map(t=>{
    const picked=G._picked.includes(t);
    const owned=isMid ? (G.loadout&&G.loadout.includes(t)) : (G.inv&&G.inv[t]>0);
    const isGuardian=isMid&&!owned&&['heal','regen','divine'].includes(t);
    const tagTxt=isMid ? (owned?'STORE +1':isGuardian?'GUARDIAN @ 50% HP':'AUTO-USE') : PU[t].name;
    return `<div class="pu-pick-card${picked?' picked':''}" style="border-color:${PU[t].border};color:${PU[t].color}" onclick="pickReward('${t}')">
      <div class="card-icon">${PU[t].icon}</div>
      <div class="card-name" style="color:${PU[t].color}">${PU[t].name}</div>
      <div class="card-desc">${puDesc(t)}</div>
      <div class="card-rarity">${tagTxt}</div>
    </div>`;
  }).join('');
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
      // not a starter pick, non-healing: use it once right now, never stored
      G._autoUsePending=type;
      sfx.powerup();
    }
    G._picked=[type];renderPickPU();saveGame();
    const nx=G._pickNext;
    setTimeout(()=>{
      goNextLevel(nx.si,nx.li);
      if(G._autoUsePending){
        const t=G._autoUsePending;G._autoUsePending=null;
        G.inv[t]=1; // temp one-shot charge, not added to loadout
        setTimeout(()=>{
          if(G.inBattle&&!G.animLock)usePowerup(t);
          // always clear the temp charge afterward, whether it fired,
          // was immune, or the battle state wasn't ready — it must
          // never persist as a real, earned inventory item.
          G.inv[t]=0;renderInventory();
        },900);
      }
    },550);
    return;
  }

  if(G._picked.includes(type))return;
  if(G._picked.length>=G._pickTarget)return;
  G._picked.push(type);
  G.loadout=G.loadout||[];
  if(!G.loadout.includes(type))G.loadout.push(type);
  G.inv[type]=(G.inv[type]||0)+1;
  sfx.powerup();renderPickPU();

  if(G._picked.length>=G._pickTarget){
    const refill=(PICK_TIERS[G._pickStageKey]||{}).refill||0;
    if(refill)G.loadout.forEach(t=>{G.inv[t]=(G.inv[t]||0)+refill;});
    saveGame();
    setTimeout(()=>{
      if(G._pickStageKey==='startup'){buildMap();saveGame();show('s-map');}
      else{const r=G._pickResume;if(r)enterLevelDirect(r.si,r.li);else{buildMap();show('s-map');}}
    },600);
  }
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


function updateBars(){const pp=Math.max(0,G.playerHP/G.playerMaxHP*100),bp=Math.max(0,G.bossHP/G.bossMaxHP*100);document.getElementById('p-hp').style.width=pp+'%';document.getElementById('b-hp').style.width=bp+'%';document.getElementById('p-hp-txt').textContent=`${Math.max(0,G.playerHP)}/${G.playerMaxHP}`;document.getElementById('b-hp-txt').textContent=`${Math.max(0,G.bossHP)}/${G.bossMaxHP}`;document.getElementById('p-hp').style.background=pp<25?'var(--red)':pp<50?'var(--orange)':'var(--green)';checkGuardianTrigger();}
function renderAttrs(){
  const g=document.getElementById('attr-grid');
  g.innerHTML=`
    <div class="attr-row"><i data-lucide="heart" style="width:13px;height:13px"></i><span class="attr-val">+${G.pHP}</span><span class="attr-lbl" style="font-size:13px"> HP</span></div>
    <div class="attr-row"><i data-lucide="sword" style="width:13px;height:13px"></i><span class="attr-val">+${G.pATK}</span><span class="attr-lbl" style="font-size:13px"> ATK</span></div>
    <div class="attr-row"><i data-lucide="shield" style="width:13px;height:13px"></i><span class="attr-val">${G.pRES}%</span><span class="attr-lbl" style="font-size:13px"> RES</span></div>
    <div class="attr-row"><i data-lucide="star" style="width:13px;height:13px"></i><span class="attr-val">S${G.stagesCleared}</span><span class="attr-lbl" style="font-size:13px"> done</span></div>`;
  refreshIcons();
}
function renderReviveSlot(){
  const el=document.getElementById('revive-slot');if(!el)return;
  const cnt=G.inv&&G.inv.revive?G.inv.revive:0;
  el.className='revive-slot'+(cnt>0?' armed':' empty');
  el.title=cnt>0?'Revives you once at 1 HP when you die':'Pick REVIVE in a loadout screen to arm this';
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
  w.innerHTML=list.length?list.map(t=>{
    const d=PU[t],cnt=G.inv[t]||0;
    return `<button class="pu-btn" style="border-color:${d.border};opacity:${cnt===0?'0.3':'1'};pointer-events:${cnt===0?'none':'auto'}" onclick="usePowerup('${t}')" title="${d.desc}">
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
  el.innerHTML=G.pendingGuardians.map(t=>
    `<span class="guardian-chip" title="${PU[t].name} auto-triggers at 50% HP">${PU[t].icon}⏳</span>`
  ).join('');
}
function checkGuardianTrigger(){
  if(!G.pendingGuardians||!G.pendingGuardians.length||!G.inBattle||G.animLock)return;
  if(G.playerHP<=0)return;
  if(G.playerHP/G.playerMaxHP<=0.5){
    const t=G.pendingGuardians.shift();
    G.inv[t]=1;
    spawnFloat('⏳ GUARDIAN!','var(--yellow)',false);
    usePowerup(t);
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
function spawnFloat(txt,color,isBoss){const ba=document.getElementById('battle-area');const el=document.createElement('div');el.className='fdmg';el.textContent=txt;el.style.color=color;el.style.left=isBoss?'60%':'24%';el.style.top='16px';ba.appendChild(el);setTimeout(()=>el.remove(),1900);}
function doAnim(id,cls,cb){const el=document.getElementById(id);el.classList.add(cls);setTimeout(()=>{el.classList.remove(cls);if(cb)cb();},460);}

function endGame(win){
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
    title.innerHTML=win
    ?'<i data-lucide="crown" style="width:20px;vertical-align:-4px"></i> GAME COMPLETE! <i data-lucide="crown" style="width:20px;vertical-align:-4px"></i>'
    :'<i data-lucide="skull" style="width:20px;vertical-align:-4px"></i> GAME OVER';
  refreshIcons();
  title.style.color=win?'var(--yellow)':'var(--red)';
  document.getElementById('end-dino').innerHTML=SPR_PLAYER;                                                                                                                                      
  document.getElementById('end-stats').innerHTML=`
    ${win?`<div class="end-win-banner">🎉 You defeated ETERNUS PRIME and saved the realm!<span class="end-bonus">+5000 BONUS</span></div>`:''}
    <div class="end-score-hero">${G.score}</div>
    <div class="end-score-lbl">FINAL SCORE</div>
    <div class="end-stat-grid">
      <div class="end-stat-card"><div class="es-icon">📍</div><div class="es-val">S${G.curStage+1}-L${G.curLevel+1}</div><div class="es-lbl">Stage Reached</div></div>
      <div class="end-stat-card"><div class="es-icon">❤</div><div class="es-val">${G.playerMaxHP}</div><div class="es-lbl">Max HP</div></div>
      <div class="end-stat-card"><div class="es-icon">⚔</div><div class="es-val">+${G.pATK}</div><div class="es-lbl">ATK Bonus</div></div>
      <div class="end-stat-card"><div class="es-icon">🛡</div><div class="es-val">${G.pRES}%</div><div class="es-lbl">Resistance</div></div>
    </div>
    <div class="end-diff-tag">${G.diff.toUpperCase()} MODE</div>
  `;
  document.getElementById('name-in').value='';
  if(win)sfx.victory();else sfx.gameover();
  show('s-end');
}
// Sanitize + validate before writing a leaderboard entry
function saveScore(){
  if(!G||typeof G.score!=='number'||G.score<0)return;
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
function getBoard(){try{return JSON.parse(localStorage.getItem('dqb3_lb'))||[];}catch{return[];}}

let _lbTab='normal';
function renderLB(tab){
  if(tab)_lbTab=tab;
  const tabsEl=document.getElementById('lb-tabs');
  if(tabsEl){
    tabsEl.innerHTML=`
      <button class="lb-tab${_lbTab==='normal'?' active':''}" onclick="renderLB('normal')"><i data-lucide="sword" style="width:12px;height:12px;vertical-align:-2px"></i> NORMAL</button>
      <button class="lb-tab${_lbTab==='practice'?' active':''}" onclick="renderLB('practice')"><i data-lucide="book-open" style="width:12px;height:12px;vertical-align:-2px"></i> PRACTICE</button>
    `;
  }
  const rows=document.getElementById('lb-rows');
  const board=getBoard().filter(e=>(e.type||'normal')===_lbTab);
  const medals=['🥇','🥈','🥉'];
  rows.innerHTML=board.length?board.map((e,i)=>{
    const mode=e.timed===false?'<span class="lb-mode chill">CHILL</span>':'<span class="lb-mode timed">TIMED</span>';
    const loadoutHtml=(e.loadout||[]).length
      ? e.loadout.map(t=>PU[t]?`<span class="lb-pu" style="color:${PU[t].color}" title="${PU[t].name}">${PU[t].icon}</span>`:'').join('')
      : '<span class="lb-pu-none">—</span>';
    return `<div class="lb-card${i<3?' r'+(i+1):''}">
      <div class="lb-rank">${medals[i]||('#'+(i+1))}</div>
      <div class="lb-main">
        <div class="lb-name-row"><span class="lb-name">${e.name}</span>${mode}<span class="lb-diff">${(e.diff||'').toUpperCase()}</span></div>
        <div class="lb-sub-row"><span>📍 ${e.stage}</span><span>❤ ${e.hp||'—'}</span><span>⚔ +${e.atk||0}</span><span>🛡 ${e.res||0}%</span></div>
        <div class="lb-loadout">${loadoutHtml}</div>
      </div>
      <div class="lb-score">${e.score}</div>
    </div>`;
  }).join(''):`<div style="padding:20px;text-align:center;font-size:15px;color:var(--dim)">No ${_lbTab} scores yet!</div>`;
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
    G.loadout=G.loadout||[];
    Object.keys(d.pending).forEach(pu=>{
      if(!PU[pu])return;
      G.inv[pu]=(G.inv[pu]||0)+d.pending[pu];
      if(!G.loadout.includes(pu))G.loadout.push(pu);
    });
    d.pending={};setDaily(d);
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
  <div style="font-size:15px;color:var(--text);line-height:1.6;text-align:center">
    A turn-based quiz RPG. Your <b style="color:var(--green)">knowledge is your weapon</b> —
    a correct answer is an attack, a wrong answer is a free hit for the enemy.
    Everything else (powerups, stats, attributes) only changes <i>how hard</i> that answer lands.
  </div>
  <div class="ig-callout">📖 This guide has 15 parts and covers every system in the game. Use BACK / NEXT to move.</div>
`},

{ t:'2 · THE SHAPE OF A RUN', html:`
  <div class="ig-world-strip">
    <div class="ig-world-chip"><div class="icon">🌿</div><div class="lbl">WORLD 1<br>KNOWN LANDS</div></div>
    <div class="ig-world-chip"><div class="icon">🌑</div><div class="lbl">WORLD 2<br>DARK BEYOND</div></div>
    <div class="ig-world-chip"><div class="icon">⚡</div><div class="lbl">WORLD 3<br>THE ABYSS</div></div>
    <div class="ig-world-chip"><div class="icon">🌀</div><div class="lbl">WORLD 4<br>VOID FRONTIER</div></div>
    <div class="ig-world-chip"><div class="icon">👑</div><div class="lbl">WORLD 5<br>PANTHEON</div></div>
  </div>
  <ul class="ig-step-list" style="margin-top:6px">
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
    <div class="ig-flow-step"><div class="ig-flow-num">5</div><div class="ig-flow-text"><b>Your ATK stat</b> and passive bonus are added last, then attribute ATK% applies.</div></div>
  </div>
  <div class="ig-callout">💡 Because steps 1–3 are multiplied by the combo, a long streak makes every other bonus worth more.</div>
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
  <div class="ig-sub" style="font-size:14px;color:var(--dim);line-height:1.5">
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
  <div style="font-size:14px;color:var(--dim);line-height:1.5">
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
  <div style="font-size:14px;color:var(--dim);line-height:1.5">
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
    <li><span class="ig-step-dot">●</span><span><b>Battle drops</b> — a chance per level to gain one item from your loadout, boosted by your streak.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>Daily gifts</b> are added to your inventory when you begin a fresh run.</span></li>
  </ul>
  <div class="ig-callout">💡 On a mid-run pick you don't own: healing items become a 🛡 <strong>GUARDIAN</strong> that auto-fires at 50% HP, and anything else fires instantly next fight. Nothing is ever wasted.</div>
`},

{ t:'14 · LEVEL CLEAR, STATS & CAPS', html:`
  <ul class="ig-step-list">
    <li><span class="ig-step-dot">●</span><span>Every cleared level grants permanent <b style="color:var(--red)">MAX HP</b>, <b style="color:var(--orange)">ATTACK</b> and <b style="color:var(--blue)">RESIST</b>. Some levels grant zero of one — that row shows a dash, not a bug.</span></li>
    <li><span class="ig-step-dot">●</span><span>You also <b style="color:var(--green)">recover 40% of max HP</b> after every win, so you enter each fight healthy.</span></li>
    <li><span class="ig-step-dot">●</span><span><b>RESIST</b> cuts incoming damage on a curve — but never against TRUE DMG.</span></li>
    <li><span class="ig-step-dot">●</span><span>Named world bosses grant a <b style="color:var(--yellow)">permanent stat multiplier</b> on top of the normal reward.</span></li>
    <li><span class="ig-step-dot">●</span><span>Stats are capped so late worlds stay dangerous. At a cap the reward row reads <b>MAX</b>.</span></li>
  </ul>
  <div class="ig-callout">⚠ Some World 4 enemies inflict permanent max HP loss. It can never take more than 40% of your pool.</div>
`},

{ t:'15 · BOSS ATTRIBUTES', html:`
  <ul class="ig-step-list">
    <li><span class="ig-step-dot">●</span><span>Killing a <b>world boss</b> permanently unlocks that boss's signature attribute for your collection.</span></li>
    <li><span class="ig-step-dot">●</span><span>You equip them from the <b style="color:var(--yellow)">ATTR</b> bar at the top of the Home and Map screens — tap it to expand, then CHOOSE.</span></li>
    <li><span class="ig-step-dot">●</span><span>You start with <b>1 slot</b>. A <b>2nd slot</b> unlocks after clearing World 3.</span></li>
    <li><span class="ig-step-dot">●</span><span>They give dodge, damage reduction, reflect, lifesteal, regen, status immunity, ATK% or healing%. Each effect is capped at 30% total, status resist at 80%.</span></li>
    <li><span class="ig-step-dot">●</span><span>Loadout <b>locks the moment you enter an unfinished world</b> and unlocks again when you beat its boss.</span></li>
  </ul>
  <div class="ig-callout">💡 Swap between worlds, not between fights — match the attribute to the next world's threat.</div>
`},

{ t:'16 · TRAINING, SYLLABUS, STREAK & RANKS', html:`
  <ul class="ig-step-list">
    <li><span class="ig-step-dot">●</span><span><b style="color:var(--red)">TRAINING</b> — jump into any stage with full stats and 5 of every powerup. Nothing is saved or scored.</span></li>
    <li><span class="ig-step-dot">●</span><span><b style="color:var(--teal)">SYLLABUS SCAN</b> — upload a PDF/TXT or paste text, review the detected topics, and battle using <b>your own class questions</b>.</span></li>
    <li><span class="ig-step-dot">●</span><span>Syllabus runs save <b>separately</b> from your normal run. You can switch freely and lose neither.</span></li>
    <li><span class="ig-step-dot">●</span><span><b style="color:var(--orange)">DAILY STREAK</b> — open the game once a day for a gift on a 7-day cycle. Missing a day resets to Day 1.</span></li>
    <li><span class="ig-step-dot">●</span><span><b style="color:var(--yellow)">HALL OF FAME</b> — top 10 scores, each recording your difficulty, timer mode, loadout and final stats.</span></li>
  </ul>
  <div class="ig-callout">🎮 That's the whole system. Close this and hit START GAME — good luck out there!</div>
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
    p.html ? p.html : `<div style="font-size:19px;line-height:1.6;color:var(--text);text-align:center;padding:6px">${p.b}</div>`;
  document.getElementById('intro-dots').innerHTML=INTRO_PAGES.map((_,i)=>
    `<span style="width:9px;height:9px;border-radius:50%;background:${i===_introPage?'var(--teal)':'var(--border)'};display:inline-block"></span>`
  ).join('');
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
function openPractice(){
  const sel=document.getElementById('practice-stage-sel');
  sel.innerHTML=STAGES.map((stg,si)=>
    `<option value="${si}">S${si+1} — ${stg.name}</option>`
  ).join('');
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
  startPractice(si,li);
}

function startPractice(si,li){
  closeModal('practice-modal');
  G=freshState('medium');
  G.isPractice=true;
  G.pickDone=true;
  const prog=computeProgressStats(si,li);
  G.pHP=prog.pHP;G.pATK=prog.pATK;G.pRES=prog.pRES;G.stagesCleared=prog.stagesCleared;
  capPlayerStats();
  G.playerMaxHP=Math.min(CAPS.hpMax,500+G.pHP);
  G.playerHP=G.playerMaxHP;
  Object.keys(G.inv).forEach(k=>G.inv[k]=5);
  G.loadout=Object.keys(PU);
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
    `World transitions add <b>charges</b>; the percentages handle the <b>power</b>.`;
    const items=cat.types.filter(t=>PU[t]).map(t=>{
      const d=PU[t],icon=PU_ICON_MAP[t]||'sparkles';
      return `<div class="pug-item" style="border-color:${d.border}">
        <div class="pug-icon" style="color:${d.color}"><i data-lucide="${icon}"></i></div>
        <div class="pug-text">
          <div class="pug-name" style="color:${d.color}">${d.name}</div>
          <div class="pug-desc">${puDesc(t)}</div>
        </div>
      </div>`;
    }).join('');
    return `<div class="pug-section">
      <div class="pug-cat-label" style="color:${cat.color};border-color:${cat.color}">${cat.label}</div>
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
    choicesEl.innerHTML=`<button class="pbtn sm" style="width:100%;color:var(--dim);border-color:var(--border)" onclick="closeModal('reset-confirm-modal')"><i data-lucide="x"></i> CLOSE</button>`;
  }else if(hasNormal && hasPractice){
    titleEl.textContent='RESET WHICH RUN?';
    subEl.textContent='Leaderboard scores and daily streak are always kept.';
    choicesEl.innerHTML=`
      <button class="pbtn r sm" style="width:100%" onclick="doResetProgress('normal')"><i data-lucide="sword"></i> RESET NORMAL RUN</button>
      <button class="pbtn b sm" style="width:100%" onclick="doResetProgress('practice')"><i data-lucide="book-open"></i> RESET PRACTICE MODE</button>
      <button class="pbtn sm" style="width:100%;color:var(--dim);border-color:var(--border)" onclick="closeModal('reset-confirm-modal')"><i data-lucide="x"></i> CANCEL</button>
    `;
  }else{
    const which=hasNormal?'normal':'practice';
    titleEl.textContent='RESET RUN?';
    subEl.textContent=`This clears your ${hasNormal?'normal':'practice'} run (stage, HP, inventory). Your leaderboard scores and daily streak are kept.`;
    choicesEl.innerHTML=`
      <div style="display:flex;gap:8px;width:100%">
        <button class="pbtn sm" style="flex:1;color:var(--dim);border-color:var(--border)" onclick="closeModal('reset-confirm-modal')"><i data-lucide="x"></i> CANCEL</button>
        <button class="pbtn r sm" style="flex:1" onclick="doResetProgress('${which}')"><i data-lucide="trash-2"></i> ERASE</button>
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
          <i data-lucide="book-open" style="width:13px;height:13px;vertical-align:-2px"></i>
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
        <i data-lucide="book-open" style="width:11px;height:11px;vertical-align:-2px"></i> PRACTICE MODE
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
function closeSyllabusFlow(){show('s-home');renderHome();}
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
    list.innerHTML='<div style="color:var(--dim);font-size:13px;text-align:center;padding:14px">No clear topics found. Add them manually below.</div>';
  }else{
    list.innerHTML=SYL.topics.map((t,i)=>`
      <div class="syl-topic-row ${t.on?'on':'off'}" data-i="${i}">
        <div class="syl-chk">${t.on?'✓':''}</div>
        <div style="flex:1;min-width:0">
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
window.spawnFloat=function(txt,color,isBoss){
  if(!area){ return _float(txt,color,isBoss); }
  const s=String(txt);
  if(/CRIT/i.test(s)) power=2;
  else if(/TRUE/i.test(s)) power=1.5;
  else power=1;

  if(/^-\d/.test(s)&&!RM){
    AR.impact(isBoss?'b':'p',power);
  }

  const el=document.createElement('div');
  el.className='fdmg'+(/CRIT|STREAK|GUARDIAN|NUKE|HALF/i.test(s)?' big':'');
  el.textContent=s;
  el.style.color=color||'#fff';
  const b=box(isBoss?'b':'p');
  const stackIdx = isBoss ? floatCountB++ : floatCountP++;   // NEW: this float's stack slot
  el.style.left=Math.round(b.cx+(Math.random()*20-10))+'px';
  el.style.top=Math.round(Math.max(2,b.top-8-stackIdx*16))+'px';  // NEW: offset upward per slot
  area.appendChild(el);
  setTimeout(()=>{
    el.remove();
    if(isBoss) floatCountB=Math.max(0,floatCountB-1); else floatCountP=Math.max(0,floatCountP-1); // NEW: free the slot
  },1250);
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
};
function puFX(t){
  const d=PU_FX[t]; if(!d||!area) return;
  const b=box(d[0]), c=d[1], m=d[2];
  if(m==='orbs'){ AR.orbs(b.cx,b.cy+b.h*.3,16,c); AR.ring(b.cx,b.cy,36,c,2); }
  else if(m==='ring'){ AR.ring(b.cx,b.cy,40,c,3); AR.sparks(b.cx,b.cy,8,c,.9); }
  else if(m==='nuke'){ AR.ring(b.cx,b.cy,72,c,5); AR.sparks(b.cx,b.cy,26,c,1.7);
                       AR.shake('l'); AR.flash(c,.45); }
  else { AR.ring(b.cx,b.cy,44,c,3); AR.sparks(b.cx,b.cy,16,c,1.2); AR.shake('s'); }
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
window.endGame=function(win){
  if(ending) return;
  ending=true;
  const spr=$('player-spr');
  if(!win&&spr&&area&&!RM){
    const b=box('p');
    AR.sparks(b.cx,b.cy,24,'#e84545',1.5);
    AR.shake('l'); AR.flash('#e84545',.5);
    spr.classList.add('defeated');
    setTimeout(function(){ spr.classList.remove('defeated'); _end(win); },700);
    return;
  }
  _end(win);
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

/* ══════════ ACHIEVEMENTS + ATTR DROPDOWN DISMISS ══════════ */
const STATS_KEY='dqb3_stats';
const _STAT_DEF={levels:0,stages:0,bosses:0,correct:0,wrong:0,
                 bestStreak:0,bestCombo:0,clutch:0,syllabus:0};

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
 {g:'COMBAT',   ic:'⚔',  n:'FIRST BLOOD',    d:'Win your first battle',                 f:s=>s.levels>=1},
 {g:'COMBAT',   ic:'🔥', n:'ON A ROLL',      d:'Reach a streak of 10',                  f:s=>s.bestStreak>=10},
 {g:'COMBAT',   ic:'⚡', n:'UNSTOPPABLE',    d:'Reach a streak of 25',                  f:s=>s.bestStreak>=25},
 {g:'COMBAT',   ic:'✖',  n:'MAX COMBO',      d:'Reach the ×8 combo cap',                f:s=>s.bestCombo>=8},
 {g:'COMBAT',   ic:'💀', n:'BOSS SLAYER',    d:'Defeat your first boss or mini-boss',   f:s=>s.bosses>=1},
 {g:'COMBAT',   ic:'👑', n:'WARLORD',        d:'Defeat 5 bosses',                       f:s=>s.bosses>=5},
 {g:'COMBAT',   ic:'🩸', n:'LAST STAND',     d:'Win a battle with under 15% HP left',   f:s=>s.clutch>=1},

 {g:'PROGRESS', ic:'🗺', n:'STAGE CLEARED',  d:'Clear all 5 levels of a stage',         f:s=>s.stages>=1},
 {g:'PROGRESS', ic:'🏔', n:'VETERAN',        d:'Win 25 battles',                        f:s=>s.levels>=25},
 {g:'PROGRESS', ic:'🌌', n:'CENTURION',      d:'Win 100 battles',                       f:s=>s.levels>=100},
 {g:'PROGRESS', ic:'🛡', n:'COLLECTOR',      d:'Own 3 boss attributes',                 f:s=>_ownedAttrCount()>=3},
 {g:'PROGRESS', ic:'🏆', n:'HIGH SCORER',    d:'Bank a run worth 10,000+',              f:s=>_bestScore()>=10000},
 {g:'PROGRESS', ic:'🌟', n:'END OF REALITY', d:'Complete the full campaign',            f:s=>hasCompletedMap()},

 {g:'STUDY',    ic:'📚', n:'SCHOLAR',        d:'Answer 250 questions correctly',        f:s=>s.correct>=250},
 {g:'STUDY',    ic:'🔬', n:'OWN SYLLABUS',   d:'Generate a practice set from a syllabus',f:s=>s.syllabus>=1},
 {g:'STUDY',    ic:'📅', n:'CONSISTENT',     d:'Reach a 3-day login streak',            f:()=>(getDaily().streak||0)>=3},
 {g:'STUDY',    ic:'🗓', n:'FULL CYCLE',     d:'Reach a 7-day login streak',            f:()=>(getDaily().streak||0)>=7},
];

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
  const groups=['COMBAT','PROGRESS','STUDY'];
  const cols={COMBAT:'var(--red)',PROGRESS:'var(--teal)',STUDY:'var(--blue)'};
  document.getElementById('ach-list').innerHTML=groups.map(g=>{
    const items=st.rows.filter(r=>r.a.g===g).map(({a,ok})=>`
      <div class="ach-item${ok?' on':''}">
        <div class="ach-ic">${ok?a.ic:'🔒'}</div>
        <div class="ach-tx"><div class="ach-n">${a.n}</div><div class="ach-d">${a.d}</div></div>
        <div class="ach-mk">${ok?'✔':''}</div>
      </div>`).join('');
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


/* ---------- boot ---------- */
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',injectLayers);
else injectLayers();

})();
