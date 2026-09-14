/* DINO.JS
 */

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

/* ══ BODY PLANS — symmetric pixel silhouettes per world theme ══ */
function mx(x,w,s){ return 16*s - x - w; } // mirror helper: same width, opposite side
/* move this line up, right before BODY_PLANS */
function worldOfStage(si){ return (STAGES[si]&&STAGES[si].world)||1; }
/* One <rect>, in grid units. EVERYTHING must stay inside 0..16 x 0..15:
   makeSpr's viewBox is exactly that, and anything outside is silently
   cropped. The box also feeds ARENA.box(), which positions every damage
   float and particle burst, so it cannot simply be widened. */
function R(x,y,w,h,f,s,op){
  return `<rect x="${x*s}" y="${y*s}" width="${w*s}" height="${h*s}" fill="${f}"${op?` opacity="${op}"`:''}/>`;
}

/* Feature modifiers, drawn OVER the body. Each reads the plan's anchors, so
   one implementation sits correctly on any silhouette — that is what lets
   five body plans cover twenty-five stages without five looking identical. */
const FEATURES = {
  horns:(c,s,n,a)=>{let o='';for(let i=0;i<n&&i<3;i++)o+=R(a.headX+i*1.6,Math.max(0,a.headY-1.4-i*0.3),1,1.4+i*0.3,c.dark,s);return o;},
  spines:(c,s,n,a)=>{let o='';for(let i=0;i<n&&i<5;i++)o+=R(a.backX+i*1.5,Math.max(0,a.backY-1.2),1,1.3,c.dark,s);return o;},
  frill:(c,s,n,a)=>R(Math.max(0,a.headX-0.5),Math.max(0,a.headY-1),1.5+n*0.8,5.5,c.dark,s,0.92),
  crest:(c,s,n,a)=>{let o='';for(let i=0;i<n&&i<4;i++)o+=R(a.crestX+i*0.9,Math.max(0,a.crestY-i*0.5),1,1.4+i*0.4,c.eye,s,0.8);return o;},
  plates:(c,s,n,a)=>{let o='';for(let i=0;i<n&&i<5;i++)o+=R(a.backX+i*1.9,a.backY,1.6,1,c.dark,s);return o;},
  tailSpike:(c,s,n,a)=>{let o='';for(let i=0;i<n&&i<3;i++)o+=R(Math.min(14.5,a.tailX+i*0.9),Math.max(0,a.tailY-1),1,1.2,c.dark,s);return o;}
};

const BODY_PLANS = {
  /* ══ WORLDS 1-5 · THE PRINTED WORLDS — actual dinosaurs ══════════════
     They share a skeleton (low ink, centred mass, dark underside) so they
     read as one family, and differ in silhouette so no two worlds blur. */

  /* W1 — raptor: low and horizontal, long counterweight tail, sickle toe */
  raptor:{
    anchors:{headX:2,headY:2.6,backX:5.5,backY:6,tailX:12,tailY:7.5,crestX:4,crestY:1.4},
    draw:(c,s)=>
      R(11,7,4.5,2,c.body,s)+R(14,7.4,1.6,1.2,c.dark,s)        /* tail + tip */
      +R(5,6,7,4.6,c.body,s)                                    /* body      */
      +R(4,4.4,2.6,2.6,c.body,s)                                /* neck      */
      +R(1.6,2.6,4.4,2.6,c.body,s)                              /* skull     */
      +R(0.6,4,2.4,1.3,c.body,s)                                /* snout     */
      +R(2.4,3.3,1,1,c.eye,s)                                   /* eye       */
      +R(1,4.6,0.8,0.5,'#fff',s)+R(2.6,4.6,0.8,0.5,'#fff',s)    /* teeth     */
      +R(6.4,7.2,1.6,1,c.dark,s)                                /* arm       */
      +R(5.4,10.4,1.9,3,c.body,s)+R(9,10.4,1.9,3,c.body,s)      /* legs      */
      +R(4.4,13.2,3.2,1.2,c.dark,s)+R(8.4,13.2,3.2,1.2,c.dark,s)/* feet      */
      +R(4.6,12,0.9,1.2,c.dark,s)                               /* sickle    */
  },

  /* W2 — ankylosaur: squat armoured slab, four stumps, clubbed tail */
  anky:{
    anchors:{headX:1.2,headY:6.6,backX:3.6,backY:5.4,tailX:13,tailY:8,crestX:3,crestY:4.2},
    draw:(c,s)=>
      R(3,6,10,5,c.body,s)                                      /* shell     */
      +R(3.4,5.2,9.2,1.2,c.dark,s)                              /* ridge     */
      +R(0.8,6.8,3.4,3.4,c.body,s)                              /* head      */
      +R(1.4,7.8,1,1,c.eye,s)                                   /* eye       */
      +R(0.4,9,2.2,0.9,c.dark,s)                                /* beak      */
      +R(12.6,7.6,2,1.6,c.body,s)+R(13.8,6.6,1.9,3,c.dark,s)    /* tail+club */
      +R(3.6,11,1.9,2.6,c.dark,s)+R(6.2,11,1.9,2.8,c.body,s)
      +R(8.8,11,1.9,2.8,c.body,s)+R(11.2,11,1.9,2.6,c.dark,s)   /* 4 stumps  */
  },

  /* W3 — pterosaur: airborne, swept wings, long backward crest */
  ptero:{
    anchors:{headX:3.4,headY:2,backX:6,backY:5,tailX:11,tailY:10.5,crestX:8.6,crestY:0.8},
    draw:(c,s)=>{
      /* Stepped, swept wings that rise AWAY from the torso. Drawn as one flat
         slab either side they just squared the silhouette off. */
      const wing=(x0,f)=>R(x0,3.4,2.6,1.3,c.dark,s)
                        +R(f(2.6),4.7,2.2,1.3,c.dark,s)
                        +R(f(4.6),6,1.8,1.2,c.dark,s);
      const wingL=wing(0.2,v=>v);
      const wingR=R(mx(0.2,2.6,1),3.4,2.6,1.3,c.dark,s)
                 +R(mx(2.6,2.2,1),4.7,2.2,1.3,c.dark,s)
                 +R(mx(4.6,1.8,1),6,1.8,1.2,c.dark,s);
      return wingL+wingR
        +R(6.2,5.6,3.6,3.9,c.body,s)                            /* torso     */
        +R(5.2,2.2,3.6,2.8,c.body,s)                            /* skull     */
        +R(8.4,1.2,3,1.5,c.body,s)                              /* crest     */
        +R(5.9,3.1,1,1,c.eye,s)                                 /* eye       */
        +R(3,3.3,2.4,1.2,c.body,s)                              /* beak      */
        +R(6.6,9.4,1.2,2.2,c.dark,s)+R(8.2,9.4,1.2,2.2,c.dark,s)/* legs      */
        +R(5.9,11.5,2,0.9,c.dark,s)+R(8,11.5,2,0.9,c.dark,s);   /* feet      */
    }
  },

  /* W4 — ceratopsian: heavy quadruped behind a big frill */
  cerato:{
    anchors:{headX:1.4,headY:5.2,backX:7.5,backY:5.6,tailX:13.6,tailY:8,crestX:2.4,crestY:2.6},
    draw:(c,s)=>
      /* frill sits ABOVE and BEHIND the skull rather than over the whole
         animal — at full overlap the frill, head and body read as one box */
      R(3,2.6,4.8,4.6,c.dark,s,0.95)                            /* frill     */
      +R(3.4,1.4,1,1.6,c.dark,s)+R(5.6,1,1,2,c.dark,s)          /* brow horns*/
      +R(6.6,5.6,7.4,6.2,c.body,s)                              /* body      */
      +R(13.6,7.2,2,1.8,c.body,s)                               /* tail      */
      +R(2,6.8,4.6,3.6,c.body,s)                                /* skull     */
      +R(0.5,8.4,1.8,1.5,c.dark,s)                              /* beak      */
      +R(3,7.8,1.1,1.1,c.eye,s)                                 /* eye       */
      +R(7.4,11.8,2.1,2.8,c.dark,s)+R(11,11.8,2.1,2.8,c.dark,s) /* legs      */
      +R(6.9,14.2,3,0.8,c.dark,s)+R(10.5,14.2,3,0.8,c.dark,s)   /* feet      */
  },

  /* W5 — tyrannosaur: the biggest silhouette of the five */
  tyrant:{
    anchors:{headX:1.6,headY:1.2,backX:5.5,backY:5,tailX:12,tailY:8,crestX:3.4,crestY:0.4},
    draw:(c,s)=>
      R(11,7.6,4.6,2.4,c.body,s)+R(14.4,8,1.4,1.6,c.dark,s)     /* tail      */
      +R(5,5,7,6.4,c.body,s)                                    /* body      */
      +R(4.4,3.4,3,2.6,c.body,s)                                /* neck      */
      +R(1.4,1.2,5.4,3.6,c.body,s)                              /* skull     */
      +R(0.8,3.6,4.6,1.8,c.dark,s)                              /* jaw       */
      +R(2.6,2.1,1.1,1.1,c.eye,s)                               /* eye       */
      +R(1.4,3.9,0.8,0.7,'#fff',s)+R(3,3.9,0.8,0.7,'#fff',s)
      +R(4.8,4.2,0.8,0.7,'#fff',s)                              /* teeth     */
      +R(5.6,7.4,1.6,1,c.dark,s)                                /* tiny arm  */
      +R(5,11.2,2.3,2.8,c.body,s)+R(8.6,11.2,2.3,2.8,c.body,s)  /* legs      */
      +R(4,13.6,3.6,1.3,c.dark,s)+R(8,13.6,3.6,1.3,c.dark,s)    /* feet      */
  },

  /* ══ WORLDS 6-10 · PAST THE MARGIN ═══════════════════════════════════
     These are not animals and must not read as any of the five above.
     They used to be worlds 2-5's shapes recoloured, which is exactly the
     thing the printed worlds are supposed to stop being. */

  /* W6 — THE FRAYING: a torn silhouette coming apart into threads */
  unravel:{
    anchors:{headX:5,headY:1.6,backX:5,backY:4,tailX:12,tailY:11,crestX:6,crestY:0.6},
    draw:(c,s)=>
      R(5,1.4,5.6,4.4,c.body,s)                                 /* head slab */
      +R(6.2,3.2,1,1,c.eye,s)
      +R(4.4,5.6,3,6.4,c.body,s)                                /* left half */
      +R(9.2,5.6,2.6,5.2,c.body,s,0.85)                         /* right half*/
      +R(4.6,12,1,2.6,c.dark,s)+R(6.4,12.4,0.8,2.2,c.dark,s,0.8)
      +R(9.4,11,0.9,3.4,c.dark,s,0.7)+R(11,9.4,0.8,2.6,c.dark,s,0.5)
      +R(12.4,7.6,0.7,2,c.dark,s,0.35)                          /* threads   */
  },

  /* W7 — THE SILENCE: outline only, a mouth cavity, and no eyes at all */
  hollow:{
    anchors:{headX:4,headY:2,backX:5,backY:3.4,tailX:12,tailY:11,crestX:6,crestY:1},
    draw:(c,s)=>
      R(3.6,2,8.8,1.2,c.body,s)+R(3.6,12,8.8,1.2,c.body,s)      /* top/bottom*/
      +R(3.6,2,1.2,11.2,c.body,s)+R(11.2,2,1.2,11.2,c.body,s)   /* sides     */
      +R(6,5.6,4,4.4,c.dark,s)                                  /* cavity    */
      +R(6.8,6.6,2.4,2.6,'#000',s,0.9)
      +R(5,3.6,1,1,c.body,s,0.5)+R(10,3.6,1,1,c.body,s,0.5)
  },

  /* W8 — THE LETTER: jointed plates, an exposed gear, a bracket */
  engine:{
    anchors:{headX:4.6,headY:1.8,backX:4,backY:4.6,tailX:12,tailY:10,crestX:6,crestY:0.6},
    draw:(c,s)=>
      R(4.6,1.6,6.8,3.4,c.body,s)                               /* head      */
      +R(6,2.8,1,1,c.eye,s)+R(9,2.8,1,1,c.eye,s)
      +R(3.4,5.4,9.2,2,c.dark,s)                                /* plate 1   */
      +R(4,7.8,8,2,c.body,s)                                    /* plate 2   */
      +R(4.6,10.2,6.8,2,c.dark,s)                               /* plate 3   */
      +R(6.6,8.2,3,3,c.eye,s,0.5)+R(7.6,9.2,1,1,'#000',s)       /* gear      */
      +R(2,5,1,7.4,c.body,s)+R(13,5,1,7.4,c.body,s)             /* brackets  */
      +R(2,5,2.6,1,c.body,s)+R(11.4,5,2.6,1,c.body,s)
      +R(2,11.4,2.6,1,c.body,s)+R(11.4,11.4,2.6,1,c.body,s)
  },

  /* W9 — THE PRESSURE: a bloated sovereign whose crown is part of it */
  sovereign:{
    anchors:{headX:4,headY:3,backX:5,backY:5,tailX:12,tailY:11,crestX:5,crestY:0.4},
    draw:(c,s)=>
      R(3.6,0.4,1.2,2.6,c.body,s)+R(6,0,1.2,3,c.body,s)
      +R(8.4,0,1.2,3,c.body,s)+R(10.8,0.4,1.2,2.6,c.body,s)     /* built-in crown */
      +R(3,3,10,3,c.body,s)
      +R(2.2,5.6,11.6,6,c.body,s)                               /* bulk      */
      +R(4.4,11.4,7.2,2,c.dark,s)
      +R(4.2,7,1.4,1.4,c.eye,s)+R(10.4,7,1.4,1.4,c.eye,s)       /* vents     */
      +R(7,8.6,2,1.2,c.eye,s,0.7)
  },

  /* W10 — THE EROSION: solid at the base, coming apart toward the top */
  dissolve:{
    anchors:{headX:5,headY:2,backX:5,backY:4,tailX:12,tailY:11,crestX:6,crestY:1},
    draw:(c,s)=>
      R(4.6,10,6.8,4,c.body,s)                                  /* solid base*/
      +R(5,7.4,6,2.2,c.body,s,0.92)
      +R(5.4,5.6,2.2,1.6,c.body,s,0.8)+R(8.4,5.6,2.4,1.6,c.body,s,0.72)
      +R(5,3.8,1.4,1.3,c.body,s,0.6)+R(7.4,3.4,1.4,1.3,c.body,s,0.5)
      +R(9.6,4,1.2,1.2,c.body,s,0.45)
      +R(6.2,2,1,1,c.body,s,0.32)+R(9,1.6,1,1,c.body,s,0.24)
      +R(7.6,0.6,0.9,0.9,c.body,s,0.16)                         /* dust      */
      +R(6.4,8.2,1.2,1.2,c.eye,s)+R(8.8,8.2,1.2,1.2,c.eye,s)
  },

  /* World 1 — the original squat reptile. No longer used by any world
     (W1 is `raptor` now); kept as makeSpr's last-resort fallback. */
  reptile:(c,s)=>`
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
    <rect x="${8*s}" y="${13*s}" width="${3*s}" height="${s}" fill="${c.dark}"/>`,

  /* World 2 (+6) — Dark Beyond / Fraying: tall hooded wraith, no legs, trailing cloth */
  wraith:(c,s)=>{
    const headW=6*s, headX=(16*s-headW)/2;
    const torsoW=4*s, torsoX=(16*s-torsoW)/2;
    const clothW=1*s, clothLX=4*s, clothRX=mx(clothLX,clothW,s);
    const eyeW=1*s, eyeLX=6.5*s, eyeRX=mx(eyeLX,eyeW,s);
    return `
    <rect x="${headX}" y="${1*s}" width="${headW}" height="${4*s}" fill="${c.body}"/>
    <rect x="${torsoX}" y="${5*s}" width="${torsoW}" height="${6*s}" fill="${c.body}"/>
    <rect x="${clothLX}" y="${5*s}" width="${clothW}" height="${8*s}" fill="${c.dark}"/>
    <rect x="${clothRX}" y="${5*s}" width="${clothW}" height="${8*s}" fill="${c.dark}"/>
    <rect x="${eyeLX}" y="${3*s}" width="${eyeW}" height="${eyeW}" fill="${c.eye}"/>
    <rect x="${eyeRX}" y="${3*s}" width="${eyeW}" height="${eyeW}" fill="${c.eye}"/>
    <rect x="${5*s}" y="${13*s}" width="${2*s}" height="${2*s}" fill="${c.dark}"/>
    <rect x="${9*s}" y="${13*s}" width="${2*s}" height="${2*s}" fill="${c.dark}"/>`;
  },

  /* World 3 (+7,+9) — Abyss/Sound/Pressure: wide blob body + 4 symmetric tendrils */
  tendril:(c,s)=>{
    const eyeW=1*s, eyeLX=6*s, eyeRX=mx(eyeLX,eyeW,s);
    const tOuterW=2*s, tOuterLX=1*s, tOuterRX=mx(tOuterLX,tOuterW,s);
    const tInnerW=2*s, tInnerLX=4*s, tInnerRX=mx(tInnerLX,tInnerW,s);
    return `
    <rect x="${3*s}" y="${3*s}" width="${10*s}" height="${6*s}" fill="${c.body}"/>
    <rect x="${tOuterLX}" y="${9*s}" width="${tOuterW}" height="${5*s}" fill="${c.dark}"/>
    <rect x="${tOuterRX}" y="${9*s}" width="${tOuterW}" height="${5*s}" fill="${c.dark}"/>
    <rect x="${tInnerLX}" y="${9*s}" width="${tInnerW}" height="${6*s}" fill="${c.dark}"/>
    <rect x="${tInnerRX}" y="${9*s}" width="${tInnerW}" height="${6*s}" fill="${c.dark}"/>
    <rect x="${eyeLX}" y="${5*s}" width="${eyeW}" height="${eyeW}" fill="${c.eye}"/>
    <rect x="${eyeRX}" y="${5*s}" width="${eyeW}" height="${eyeW}" fill="${c.eye}"/>`;
  },

  /* World 4 (+8) — Void Frontier/Machine: blocky torso, antenna pair, angular legs */
  mech:(c,s)=>{
    const torsoW=8*s, torsoX=(16*s-torsoW)/2;
    const headW=6*s, headX=(16*s-headW)/2;
    const antW=1*s, antLX=5*s, antRX=mx(antLX,antW,s);
    const legW=2*s, legLX=4*s, legRX=mx(legLX,legW,s);
    const eyeW=1*s, eyeLX=6*s, eyeRX=mx(eyeLX,eyeW,s);
    return `
    <rect x="${antLX}" y="${0}" width="${antW}" height="${2*s}" fill="${c.dark}"/>
    <rect x="${antRX}" y="${0}" width="${antW}" height="${2*s}" fill="${c.dark}"/>
    <rect x="${headX}" y="${2*s}" width="${headW}" height="${3*s}" fill="${c.body}"/>
    <rect x="${eyeLX}" y="${3*s}" width="${eyeW}" height="${eyeW}" fill="${c.eye}"/>
    <rect x="${eyeRX}" y="${3*s}" width="${eyeW}" height="${eyeW}" fill="${c.eye}"/>
    <rect x="${torsoX}" y="${5*s}" width="${torsoW}" height="${6*s}" fill="${c.body}"/>
    <rect x="${2*s}" y="${6*s}" width="${2*s}" height="${4*s}" fill="${c.dark}"/>
    <rect x="${12*s}" y="${6*s}" width="${2*s}" height="${4*s}" fill="${c.dark}"/>
    <rect x="${legLX}" y="${11*s}" width="${legW}" height="${4*s}" fill="${c.dark}"/>
    <rect x="${legRX}" y="${11*s}" width="${legW}" height="${4*s}" fill="${c.dark}"/>`;
  },

  /* World 5 (+10,+11) — Celestial/Ending: winged silhouette + halo bar */
  angelic:(c,s)=>{
    const torsoW=4*s, torsoX=(16*s-torsoW)/2;
    const wingW=4*s, wingLX=0*s, wingRX=mx(wingLX,wingW,s);
    const eyeW=1*s, eyeLX=6.5*s, eyeRX=mx(eyeLX,eyeW,s);
    return `
    <rect x="${5*s}" y="${0}" width="${6*s}" height="${1*s}" fill="${c.eye}" opacity="0.85"/>
    <rect x="${torsoX}" y="${2*s}" width="${torsoW}" height="${4*s}" fill="${c.body}"/>
    <rect x="${eyeLX}" y="${3*s}" width="${eyeW}" height="${eyeW}" fill="${c.eye}"/>
    <rect x="${eyeRX}" y="${3*s}" width="${eyeW}" height="${eyeW}" fill="${c.eye}"/>
    <rect x="${wingLX}" y="${5*s}" width="${wingW}" height="${6*s}" fill="${c.dark}"/>
    <rect x="${wingRX}" y="${5*s}" width="${wingW}" height="${6*s}" fill="${c.dark}"/>
    <rect x="${6*s}" y="${6*s}" width="${4*s}" height="${7*s}" fill="${c.body}"/>
    <rect x="${6*s}" y="${13*s}" width="${4*s}" height="${2*s}" fill="${c.dark}"/>`;
  },

  /* World 11 — THE UNWRITTEN: bare candle-flame silhouette, sparse, few rects */
  unwritten:(c,s)=>{
    const bodyW=3*s, bodyX=(16*s-bodyW)/2;
    return `
    <rect x="${7*s}" y="${0}" width="${2*s}" height="${3*s}" fill="${c.eye}"/>
    <rect x="${bodyX}" y="${3*s}" width="${bodyW}" height="${10*s}" fill="${c.body}"/>
    <rect x="${bodyX}" y="${13*s}" width="${bodyW}" height="${2*s}" fill="${c.dark}"/>`;
  },
};

/* Which plan each world uses. Worlds 1-5 are dinosaurs; 6-10 are the
   "beyond the margin" forms, which used to clone 2-5's shapes recoloured.
   (wraith/tendril/mech/angelic are retired but left defined above as
   fallbacks — nothing points at them any more.) */
const WORLD_PLAN = {
  1:'raptor', 2:'anky', 3:'ptero', 4:'cerato', 5:'tyrant',
  6:'unravel', 7:'hollow', 8:'engine', 9:'sovereign', 10:'dissolve', 11:'unwritten'
};

/* Per-stage overrides. STAGE_PLAN is empty by default — a world's plan is
   the right answer for every stage in it — but it exists so a one-off stage
   can break the mould without touching makeSpr. */
const STAGE_PLAN = {};

/* Per-stage feature counts. This is what stops five stages in a world from
   being the same silhouette in five colours: same body, escalating horns /
   spines / frill / crest as the world goes on. Bosses get one extra of
   whatever they already carry (applied in makeSpr from ECOL[si].boss). */
const STAGE_MODS = {
  /* W1 raptor  */ 0:{}, 1:{spines:1}, 2:{crest:1}, 3:{spines:2}, 4:{horns:2,spines:2},
  /* W2 anky    */ 5:{plates:1}, 6:{plates:2}, 7:{spines:1}, 8:{plates:3}, 9:{tailSpike:2,plates:3},
  /* W3 ptero   */ 10:{crest:1}, 11:{crest:2}, 12:{horns:1}, 13:{crest:3}, 14:{crest:3,horns:2},
  /* W4 cerato  */ 15:{horns:1}, 16:{frill:1}, 17:{spines:1}, 18:{horns:2}, 19:{horns:3,frill:2},
  /* W5 tyrant  */ 20:{spines:1}, 21:{horns:1}, 22:{spines:2}, 23:{crest:2}, 24:{horns:3,spines:3}
};

/* Crown variants. Now reads the plan's own anchors — the old version drew at
   a fixed x=3/5/7 on the assumption every head sat in the same place, which
   leaves spikes floating in empty space once silhouettes differ. */
function crownFor(c, plan, s){
  if(!c.boss || !c.crown) return '';
  const a=(plan&&plan.anchors)||{crestX:4,crestY:0.4};
  const x=Math.max(0.5,Math.min(11,a.crestX!=null?a.crestX:4));
  const y=Math.max(0,a.crestY!=null?a.crestY-0.4:0);
  return R(x,y,1,2.2,c.crown,s)+R(x+2,y,1,1.2,c.crown,s)
        +R(x+4,y,1,2.2,c.crown,s);
}

function makeSpr(c,si,size=60){
  const s=size/16, h=Math.round(size*1.06);
  const world = worldOfStage(si);
  const plan = BODY_PLANS[STAGE_PLAN[si] || WORLD_PLAN[world] || 'reptile'] || BODY_PLANS.reptile;
  /* plans may be a bare draw function (the retired ones) or {draw,anchors} */
  const draw = (typeof plan==='function') ? plan : plan.draw;
  const anchors = (typeof plan==='function') ? {} : (plan.anchors||{});
  let mods = STAGE_MODS[si] || {};
  if(c.boss){ const m={}; for(const k in mods) m[k]=mods[k]+1; mods=m; }
  let feat='';
  for(const k in mods){ if(FEATURES[k]) feat+=FEATURES[k](c,s,mods[k],anchors); }
  return `<svg width="${size}" height="${h}" viewBox="0 0 ${size} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${crownFor(c, plan, s)}
    ${draw(c,s,mods)}
    ${feat}
  </svg>`;
}

/* ══ SPX · CONDITIONAL PASSIVE ENGINE ═══════════════════════════════════
   Worlds 6-10 already had a real conditional engine (mkSp/runSp) while
   worlds 1-5 used ad-hoc inline closures. This is that engine, moved up
   here so BOTH halves of the game can share it — dino-world.js loads 3rd,
   dino-world2.js 6th, so the engine has to live in the earlier file.

   Everything it touches from the later files (addOrStackEffect, setMsg,
   renderEffects, updateBars, CAPS, W2.activeLaws) is dereferenced ONLY
   inside the returned closure, at battle time, behind a typeof guard.
   Nothing here may touch a dino.js/dino-world2.js symbol at load time:
   if it does, this file throws and the whole game is a blank screen.

   dino-world2.js keeps exporting mkSp/runSp — they are now thin shims
   onto SPX.make/SPX.run, so DEF[] (si 25-50) is untouched and worlds
   6-10 behave byte-for-byte as before.                                  */
const SPX = window.SPX = (function(){
  /* mirrors of dino-world2.js's private helpers (same lazy guards) */
  /* An empty msg stays silent rather than blanking the message bar — that is
     what lets a stage compose several kinds in one spec and have only one of
     them speak. `col` lets a stage keep its own message colour. */
  const say  = (m,c)=>{ if(m && typeof setMsg==='function') setMsg(m, c||'var(--purple)'); };
  const fx   = ()=>{ if(typeof renderEffects==='function') renderEffects(); };
  const inv  = ()=>{ if(typeof renderInventory==='function') renderInventory(); };
  const bars = ()=>{ if(typeof updateBars==='function') updateBars(); };
  const laws = ()=>{ try{ return (window.W2&&W2.activeLaws)?W2.activeLaws():{}; }catch(e){ return {}; } };
  const D_BURN='playerBurn';
  const put=(g,type,extra)=>{
    if(typeof addOrStackEffect==='function') addOrStackEffect(type,extra||{});
    else g.activeEffects.push(Object.assign({type,stack:1},extra));
    fx();
  };

  /* ── the effect kinds. The first ten are ported verbatim from
        dino-world2.js's runSp; the rest exist so worlds 1-5's inline
        closures can be expressed as data. None of the additions are
        referenced by DEF[], so worlds 6-10 are unaffected.            ── */
  const KINDS = {
    vuln : (g,s)=>{ put(g,'playerVulnerable',{turns:s.t||1}); say(s.msg,s.col); },
    slow : (g,s)=>{ put(g,'playerSlowed',{turns:s.t||2});     say(s.msg,s.col); },
    blind: (g,s)=>{ put(g,'blindness',{turns:s.t||2});        say(s.msg,s.col); },
    seal : (g,s)=>{ put(g,'playerEnergyLock',{turns:s.t||1}); say(s.msg,s.col||'var(--grey)'); },
    /* flat: worlds 1-5 author literal per-turn damage; without it the
       worlds 6-10 formula (1.2% of max HP) would rewrite World 1's numbers */
    dot  : (g,s)=>{ put(g,s.dot||D_BURN,{turns:s.t||3,
                      hpPerTurn: s.flat!=null ? s.flat
                               : Math.max(20,Math.round((g.playerMaxHP||1000)*.012))});
                    say(s.msg,s.col||'var(--orange)'); },
    strip: (g,s)=>{
      const B=['shield','barrier','mirror','double','overload'];
      const hits=g.activeEffects.filter(e=>B.includes(e.type));
      if(!hits.length) return;
      const n=Math.min(s.n||1,hits.length);
      for(let i=0;i<n;i++){ const t=hits[i]; g.activeEffects=g.activeEffects.filter(e=>e!==t); }
      fx(); say(s.msg,'var(--grey)');
    },
    heal : (g,s)=>{
      const h = s.full ? (g.bossMaxHP-g.bossHP)
              : s.flat!=null ? s.flat
              : Math.round(g.bossMaxHP*(s.pct||.05));
      g.bossHP=Math.min(g.bossMaxHP,g.bossHP+h);
      if(s.float!==false && typeof spawnFloat==='function') spawnFloat('+'+h,'var(--green)',true);
      say(s.msg,s.col||'var(--green)'); bars();
    },
    atkup: (g,s)=>{
      const m=s.mult||1.15;
      g.bossAtkMin=Math.floor(g.bossAtkMin*m); g.bossAtkMax=Math.floor(g.bossAtkMax*m);
      say(s.msg,s.col||'var(--amber)');
    },
    drain: (g,s)=>{
      const d=Math.round((g.playerMaxHP||1000)*(s.pct||.05));
      g.playerHP=Math.max(1,g.playerHP-d);
      g.bossHP=Math.min(g.bossMaxHP,g.bossHP+d);
      say(s.msg,'var(--red)'); bars();
    },
    /* PERMANENT max-HP loss. Worlds 6-10 only (Law X, si 46). Never
       records _battlePenalty, so refundBattlePenalty can never give it
       back — "It does not give it back" stays true. */
    erode: (g,s)=>{
      const raw=Math.min((typeof CAPS!=='undefined'?CAPS.hpMax:1e9)||1e9,500+g.pHP);
      const loss=Math.max(200,Math.round(raw*(s.pct||.02)));
      g.hpPenalty=(g.hpPenalty||0)+loss;
      if(typeof capPlayerStats==='function') capPlayerStats();
      if(g.playerHP>g.playerMaxHP) g.playerHP=g.playerMaxHP;
      say(String(s.msg||'').replace('{n}',loss),'var(--grey)'); bars();
    },
    /* ── additions for worlds 1-5 ── */
    /* Seals item TYPES for a few turns instead of deleting stacks. Worlds 1-5
       used to zero the inventory outright (OMEGA REX wiped everything at the
       SECOND boss in the game) with no way to get it back. */
    lockTypes:(g,s)=>{
      let types;
      if(s.all) types=['*'];
      else{
        const owned=Object.keys(g.inv||{}).filter(k=>g.inv[k]>0);
        if(!owned.length){ say(s.emptyMsg,s.col); return; }
        const pick=owned.slice();
        for(let i=pick.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=pick[i];pick[i]=pick[j];pick[j]=t; }
        types=pick.slice(0,Math.max(1,s.pickRandom||1));
      }
      seal(g,types,s.t||2);
      const names = types[0]==='*' ? 'every item'
        : types.map(t=>((typeof PU!=='undefined'&&PU[t]&&PU[t].name)||t)).join(' + ');
      say(String(s.msg||'').replace('{items}',names),s.col||'var(--grey)');
    },
    /* battleOnly also books the loss to _battlePenalty, which is handed back
       when the fight ends. Law X's `erode` deliberately does NOT do this. */
    drainMaxHP:(g,s)=>{
      const raw=Math.min((typeof CAPS!=='undefined'?CAPS.hpMax:1e9)||1e9,500+g.pHP);
      const loss=Math.max(s.min||50,Math.round(raw*(s.pct||.02)));
      g.hpPenalty=(g.hpPenalty||0)+loss;
      if(s.battleOnly) g._battlePenalty=(g._battlePenalty||0)+loss;
      if(typeof capPlayerStats==='function') capPlayerStats();
      if(g.playerHP>g.playerMaxHP) g.playerHP=g.playerMaxHP;
      say(String(s.msg||'').replace('{n}',loss),s.col||'var(--grey)'); bars();
    },
    rage : (g,s)=>{ g.rageMult=(g.rageMult||1)*(s.mult||2); say(s.msg,s.col||'var(--yellow)'); },
    para : (g,s)=>{ put(g,'playerParalyze',{turns:s.t||2}); say(s.msg,s.col||'var(--yellow)'); },
    shuffle:(g,s)=>{
      const keys=Object.keys(g.inv||{}).filter(k=>g.inv[k]>0);
      if(keys.length<2) return;
      const a=keys[Math.floor(Math.random()*keys.length)];
      let b=keys[Math.floor(Math.random()*keys.length)];
      if(a===b) b=keys[(keys.indexOf(a)+1)%keys.length];
      const t=g.inv[a]; g.inv[a]=g.inv[b]; g.inv[b]=t;
      inv(); say(s.msg,'var(--purple)');
    }
  };

  /* ── predicates. every/bossHPPct are the existing triggers kept as
        plumbing; the player* ones are the new "it reacts when you are
        winning" set. Every key in a `when` must pass (AND).          ── */
  const num=(v,q)=>{
    if(q==null) return true;
    if(typeof q==='number') return v>=q;
    if(q.gte!=null && !(v>=q.gte)) return false;
    if(q.lte!=null && !(v<=q.lte)) return false;
    if(q.gt !=null && !(v> q.gt )) return false;
    if(q.lt !=null && !(v< q.lt )) return false;
    return true;
  };
  const itemCount=g=>Object.keys(g.inv||{}).reduce((n,k)=>n+(g.inv[k]|0),0);
  const itemTypes=g=>Object.keys(g.inv||{}).filter(k=>g.inv[k]>0).length;
  const BUFFS=['shield','barrier','mirror','double','overload','regen','divine'];
  const TESTS = {
    every      : (g,q)=> g.bossAtkCounter>0 && g.bossAtkCounter%q===0,
    bossHPPct  : (g,q)=> num(g.bossMaxHP?g.bossHP/g.bossMaxHP*100:100,q),
    playerHPPct: (g,q)=> num(g.playerMaxHP?g.playerHP/g.playerMaxHP*100:100,q),
    playerUnhurt:(g,q)=> (g.playerHP>=g.playerMaxHP)===(q!==false),
    playerStreak:(g,q)=> num(g.streak|0,q),
    playerCombo :(g,q)=> num(g.combo|0,q),
    itemCount  : (g,q)=> num(itemCount(g),q),
    itemTypes  : (g,q)=> num(itemTypes(g),q),
    buffCount  : (g,q)=> num((g.activeEffects||[]).filter(e=>BUFFS.includes(e.type)).length,q)
  };
  function test(when,g){
    for(const k in when){
      if(!TESTS[k]) continue;
      if(!TESTS[k](g,when[k])) return false;
    }
    return true;
  }

  function run(g,spec){
    const fn=KINDS[spec.kind];
    if(fn) fn(g,spec);
  }

  /* ── the seal ──────────────────────────────────────────────────────────
     An ordinary G.activeEffects entry, so it ticks, renders and expires on
     machinery that already exists. Deliberately NOT routed through
     addOrStackEffect: that only Object.assigns `extra` when it CREATES the
     effect, so a second seal would not union the types list.
     Calling it twice refreshes rather than double-seals — which is what
     Law VIII (spFnDouble) does to a lockTypes ability.                  */
  function seal(g,types,turns){
    const list = g.activeEffects || (g.activeEffects=[]);
    let e=list.find(x=>x.type==='itemSeal');
    if(!e){ e={type:'itemSeal',stack:1,types:[],turns:0}; list.push(e); }
    const add=(types||[]).slice();
    if(add.indexOf('*')>=0) e.types=['*'];
    else if(e.types.indexOf('*')<0) add.forEach(t=>{ if(e.types.indexOf(t)<0) e.types.push(t); });
    e.turns=Math.max(e.turns||0,turns||2);
    e._announced=false;
    fx(); inv();
    return e;
  }
  function sealedTypes(g){
    const e=((g&&g.activeEffects)||[]).find(x=>x.type==='itemSeal');
    return e?(e.types||[]):[];
  }
  function isSealed(g,t){
    const s=sealedTypes(g);
    return s.indexOf('*')>=0 || s.indexOf(t)>=0;
  }

  /* Max-HP taken by a battleOnly drain is given back when the fight ends.
     Permanent erosion (Law X, si 46) never books _battlePenalty, so this
     can never refund it. */
  function refundBattlePenalty(x){
    if(!x || !x._battlePenalty) return 0;
    const back=x._battlePenalty;
    x.hpPenalty=Math.max(0,(x.hpPenalty||0)-back);
    x._battlePenalty=0;
    return back;
  }

  /* Telegraph hook — wired to the ARENA engine in a later step. Kept as a
     lookup so this file never hard-depends on dino.js. */
  function telegraph(spec,g){
    if(typeof SPX.onTelegraph==='function'){ try{ SPX.onTelegraph(spec,g); }catch(e){} }
  }

  /* Compile one spec (or an array of them) into an spFn.
     Order matters: the LOOPHOLE token must be consumed only AFTER the
     trigger passes, or an ability that was never going to fire would
     eat it. This mirrors mkSp's original ordering exactly. */
  /* A multi-part spec is ONE ability, so every part is judged against the
     state as it was when the ability started. Without this, an early part
     that changes the tested quantity silently disarms the later ones —
     ETERNUS PRIME heals itself to full, and the ATK×2 that is supposed to
     accompany it then fails its own bossHPPct<=30 test. */
  function snapshot(g){
    return { bossHP:g.bossHP, bossMaxHP:g.bossMaxHP,
             playerHP:g.playerHP, playerMaxHP:g.playerMaxHP,
             bossAtkCounter:g.bossAtkCounter, streak:g.streak, combo:g.combo,
             inv:Object.assign({},g.inv||{}),
             activeEffects:(g.activeEffects||[]).slice() };
  }

  function make(spec){
    const list=Array.isArray(spec)?spec:[spec];
    return function(g){
      if(!g._spFired) g._spFired={};
      if(!g._spCd)    g._spCd={};
      const snap=snapshot(g);
      for(let i=0;i<list.length;i++){
        const s=list[i], id=s.id||('spx'+i);
        if(s.once && g._spFired[id]) continue;
        if(g.bossAtkCounter < (s.minAttack||0)) continue;
        if(s.cd && g.bossAtkCounter < (g._spCd[id]||0)) continue;
        /* no `when` ⇒ the historical default: every Nth landed attack */
        const when = s.when || {every: s.every||3};
        if(!test(when,snap)) continue;

        const vi=(g.activeEffects||[]).findIndex(e=>e.type==='voidNext');
        if(vi>=0){ g.activeEffects.splice(vi,1); fx();
                   say('📎 LOOPHOLE — the ability finds no clause to stand on.','var(--yellow)');
                   continue; }

        const reps = laws().spFnDouble ? 2 : 1;
        telegraph(s,g);
        for(let r=0;r<reps;r++) run(g,s);
        if(reps>1) say('⚖ THE LETTER — it acts twice.','var(--yellow)');

        g._spFired[id]=true;
        g.bossSpecialFired=true;            /* legacy flag, still read elsewhere */
        if(s.cd) g._spCd[id]=g.bossAtkCounter+s.cd;
      }
    };
  }

  return { KINDS, TESTS, run, make, test, telegraph,
           seal, sealedTypes, isSealed, refundBattlePenalty };
})();

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
    spec:{id:'w1s1',kind:'dot',dot:'playerPoison',t:2,flat:6,once:true,when:{bossHPPct:{lte:40}},
          col:'var(--green)',tele:'VENOM GLANDS',msg:'🌿 GROVE WARDEN spits venom! -6/turn!'}},
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
    spec:{id:'w1s2',kind:'rage',mult:1.4,once:true,when:{bossHPPct:{lte:50}},
          tele:'SANDSTORM',msg:'🏜 DUNE TYRANT kicks up a sandstorm! ATK ×1.4!'}},
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
    spec:{id:'w1s3',kind:'heal',flat:15,float:false,when:{every:3},
          col:'var(--blue)',tele:'RISING TIDE',msg:'🌊 TIDE LORD rides a wave! Healed +15 HP!'}},
  {name:'VOLCANIC VALLEY',icon:'🌋',sprIdx:3,world:1,isBoss:false,
    passive:{label:'🌋 Lava Skin',desc:'Immune Burn, Poison ½'},res:{burn:0,poison:0.5},
    levels:[
      {lv:1,sub:'Magma Hatch',   hp:60, atk:[20,32], attr:{hp:6,atk:2,res:0}},
      {lv:2,sub:'Lava Crawler',  hp:76, atk:[23,37], attr:{hp:7,atk:2,res:2}},
      {lv:3,sub:'Cinder Drake',  hp:92, atk:[27,43], attr:{hp:7,atk:1,res:3}},
      {lv:4,sub:'Eruption Beast',hp:110,atk:[31,48], attr:{hp:8,atk:3,res:2}},
      {lv:5,sub:'Volcano Titan', hp:130,atk:[36,56], attr:{hp:12,atk:4,res:4},mini:true},
    ],
    spec:{id:'w1s4',kind:'dot',dot:'playerBurn',t:3,flat:10,once:true,when:{bossHPPct:{lte:50}},
          tele:'MAGMA SURGE',msg:'🌋 VOLCANO TITAN burns you! -10/turn for 3 turns!'}},
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
    spec:{id:'w1boss',kind:'rage',mult:1.8,once:true,when:{bossHPPct:{lte:50}},
          col:'var(--orange)',tele:'ENRAGE',msg:'🔥 EMBER KING ENRAGES! ATK ×1.8!'}},
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
    spec:{id:'w2s2',kind:'para',t:2,once:true,when:{bossHPPct:{lte:50}},
          col:'var(--cyan)',tele:'FLASH FREEZE',msg:'❄ CRYO COLOSSUS paralyzes you for 2 turns!'}},
  {name:'POISON SWAMP',icon:'☠',sprIdx:7,world:2,isBoss:false,
    passive:{label:'☠ Venom Master',desc:'Immune Poison · Burn -40%'},res:{poison:0,burn:0.6},
    levels:[
      {lv:1,sub:'Swamp Toad',    hp:172,atk:[18,30],attr:{hp:10,atk:3,res:3}},
      {lv:2,sub:'Venom Crawler', hp:198,atk:[21,34],attr:{hp:11,atk:4,res:3}},
      {lv:3,sub:'Toxic Drake',   hp:226,atk:[24,38],attr:{hp:13,atk:4,res:4}},
      {lv:4,sub:'Plague Beast',  hp:256,atk:[27,43],attr:{hp:14,atk:5,res:4}},
      {lv:5,sub:'Venom Queen',   hp:290,atk:[31,48],attr:{hp:18,atk:6,res:5},mini:true},
    ],
    spec:{id:'w2s3',kind:'dot',dot:'playerPoison',t:4,flat:14,once:true,when:{bossHPPct:{lte:60}},
          col:'var(--purple)',tele:'MEGA-VENOM',msg:'☠ VENOM QUEEN mega-venom! -14/turn!'}},
  {name:'CHAOS WASTES',icon:'🌪',sprIdx:8,world:2,isBoss:false,
    passive:{label:'🌪 Chaos Aura',desc:'All DoTs -50% · Shuffles inv every 2 atks'},res:{poison:0.5,burn:0.5,paralyze:0.5},
    levels:[
      {lv:1,sub:'Chaos Skink',   hp:200,atk:[22,35],attr:{hp:11,atk:4,res:3}},
      {lv:2,sub:'Void Crawler',  hp:228,atk:[25,39],attr:{hp:13,atk:5,res:4}},
      {lv:3,sub:'Rift Drake',    hp:258,atk:[28,44],attr:{hp:14,atk:5,res:4}},
      {lv:4,sub:'Null Titan',    hp:290,atk:[32,50],attr:{hp:16,atk:6,res:5}},
      {lv:5,sub:'Omega Herald',  hp:330,atk:[36,56],attr:{hp:20,atk:7,res:6},mini:true},
    ],
    spec:{id:'w2s4',kind:'shuffle',when:{every:2},
          col:'var(--orange)',tele:'CHAOS AURA',msg:'🌪 CHAOS AURA shuffles your inventory!'}},
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
    
    /* Was: Object.keys(g.inv).forEach(k=>g.inv[k]=0) — the second boss in the
       game deleted every power-up the player owned, permanently, for crossing
       a HP line. Now it clamps the satchel shut for two turns instead; the
       FINAL FORM half keeps its full strength. */
    spec:[{id:'omega-seal',kind:'lockTypes',all:true,t:2,once:true,minAttack:2,
           when:{bossHPPct:{lte:50}},col:'var(--red)',tele:'OMEGA PROTOCOL',
           msg:'🌟 OMEGA REX clamps your satchel shut — every item sealed for 2 turns!'},
          {id:'omega-rage',kind:'rage',mult:2,once:true,when:{bossHPPct:{lte:30}},
           tele:'FINAL FORM',msg:'🌟 OMEGA REX — FINAL FORM! ATK×2!'}]},
    {name:'AETHER REACTOR',icon:'⚡',sprIdx:10,world:3,isBoss:false,
    passive:{label:'⚡ Overcharge',desc:'Immune Paralyze · Skills cooldown +1 turn'},res:{paralyze:0},
    levels:[
      {lv:1,sub:'Plasma Hound',   hp:400,atk:[42,65],attr:{hp:24,atk:8,res:6}},
      {lv:2,sub:'Volt Striker',   hp:450,atk:[46,72],attr:{hp:26,atk:9,res:6}},
      {lv:3,sub:'Lightning Drake',hp:510,atk:[52,80],attr:{hp:28,atk:10,res:7}},
      {lv:4,sub:'Laser Golem',    hp:580,atk:[58,90],attr:{hp:32,atk:11,res:8}},
      {lv:5,sub:'Storm Core',     hp:660,atk:[65,102],attr:{hp:36,atk:13,res:9},mini:true},
    ],
    spec:{id:'w3s1',kind:'seal',t:3,once:true,when:{bossHPPct:{lte:50}},
          col:'var(--yellow)',tele:'OVERCHARGE',msg:'⚡ STORM CORE locks your special skills for 3 turns!'}},
  {name:'NEVER-HELL',icon:'🔥',sprIdx:11,world:3,isBoss:false,
    passive:{label:'🔥 Soul Burn',desc:'Immune Burn · Heals 10% of dealt dmg'},res:{burn:0},
    levels:[
      {lv:1,sub:'Magma Imp',      hp:520,atk:[55,85],attr:{hp:30,atk:11,res:7}},
      {lv:2,sub:'Hellhound Alpha',hp:590,atk:[62,96],attr:{hp:34,atk:12,res:8}},
      {lv:3,sub:'Inferno Drake',  hp:670,atk:[70,108],attr:{hp:38,atk:14,res:9}},
      {lv:4,sub:'Pyroclast Fiend',hp:760,atk:[78,122],attr:{hp:42,atk:16,res:10}},
      {lv:5,sub:'Lord of Cinders',hp:870,atk:[88,138],attr:{hp:48,atk:18,res:12},mini:true},
    ],
    spec:{id:'w3s2',kind:'heal',flat:40,float:false,when:{every:3},
          col:'var(--red)',tele:'ASH FEAST',msg:'🔥 LORD OF CINDERS consumes your ash! Healed +40 HP!'}},
  {name:'ANCIENT RUINS',icon:'⏳',sprIdx:12,world:3,isBoss:false,
    passive:{label:'⏳ Time Warp',desc:'Immune Freeze · Deducts 1 item on hit'},res:{freeze:0},
    levels:[
      {lv:1,sub:'Stone Golem',    hp:600,atk:[64,98],attr:{hp:34,atk:13,res:8}},
      {lv:2,sub:'Ruins Gazer',    hp:680,atk:[72,110],attr:{hp:38,atk:15,res:9}},
      {lv:3,sub:'Relic Drake',    hp:770,atk:[80,124],attr:{hp:42,atk:16,res:10}},
      {lv:4,sub:'Aeon Guardian',  hp:860,atk:[90,140],attr:{hp:46,atk:18,res:11}},
      {lv:5,sub:'Clockwork Lich', hp:980,atk:[102,158],attr:{hp:52,atk:21,res:13},mini:true},
    ],
    spec:{id:'w3s3',kind:'slow',t:2,once:true,when:{bossHPPct:{lte:50}},
          col:'var(--amber)',tele:'BROKEN TIMELINE',msg:'⏳ CLOCKWORK LICH breaks the timeline! You are slowed for 2 turns!'}},
  {name:'ABYSSAL TRENCH',icon:'👁️',sprIdx:13,world:3,isBoss:false,
    passive:{label:'👁️ Mind Wipe',desc:'All DoTs -60% · 20% to reflect debuffs'},res:{poison:0.4,burn:0.4,paralyze:0.4,freeze:0.4},
    levels:[
      {lv:1,sub:'Deep Stalker',   hp:1050,atk:[110,168],attr:{hp:46,atk:18,res:12}},
      {lv:2,sub:'Kraken Hatchling',hp:1160,atk:[120,185],attr:{hp:50,atk:20,res:13}},
      {lv:3,sub:'Abyss Leviathan',hp:1280,atk:[132,204],attr:{hp:56,atk:22,res:14}},
      {lv:4,sub:'Eldritch Horror',hp:1420,atk:[146,226],attr:{hp:62,atk:25,res:16}},
      {lv:5,sub:'Cthulhu Spawn',  hp:1600,atk:[162,252],attr:{hp:70,atk:28,res:18},mini:true},
    ],
    spec:{id:'w3s4',kind:'blind',t:3,once:true,when:{bossHPPct:{lte:40}},
          col:'var(--purple)',tele:'MADDENING GAZE',msg:'👁️ CTHULHU SPAWN blinds you! 50% miss chance for 3 turns!'}},
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
    spec:{id:'w3boss',kind:'atkup',mult:1.5,once:true,when:{bossHPPct:{lte:50}},
          col:'var(--magenta)',tele:'SPACE COLLAPSE',msg:'🌌 COSMOS PRIME collapses space! ATK permanently multiplied by 1.5×!'}
  },
  {name:'CHRONO WHIRLPOOL',icon:'🌀',sprIdx:15,world:4,isBoss:false,
    passive:{label:'🌀 Time Distortion',desc:'All DoTs -70% · Drastically extends enemy turn speed'},res:{poison:0.3,burn:0.3,paralyze:0.3,freeze:0.3},
    levels:[
      {lv:1,sub:'Temporal Wisp',  hp:3800,atk:[280,440],attr:{hp:220,atk:36,res:22}},
      {lv:2,sub:'Aeon Stalker',   hp:4150,atk:[305,480],attr:{hp:240,atk:40,res:24}},
      {lv:3,sub:'Paradox Drake',  hp:4550,atk:[335,525],attr:{hp:260,atk:44,res:26}},
      {lv:4,sub:'Rift Weaver',    hp:5000,atk:[370,575],attr:{hp:290,atk:48,res:28}},
      {lv:5,sub:'Time Devourer',  hp:5500,atk:[410,635],attr:{hp:320,atk:54,res:32},mini:true},
    ],
    spec:{id:'w4s1',kind:'slow',t:3,once:true,when:{bossHPPct:{lte:50}},
          col:'var(--cyan)',tele:'TIME DISTORTION',msg:'🌀 TIME DEVOURER distorts your timeline! You are slowed for 3 turns!'}},
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
    /* The Max-HP rot used to be PERMANENT, with no cure until RESTORATION
       unlocks in world 10 — five worlds later. It still bites for the whole
       fight; it is handed back when the fight ends. */
    spec:{id:'nebula-rot',kind:'drainMaxHP',pct:0.02,min:50,battleOnly:true,when:{every:3},
          tele:'COSMIC DECAY',
          msg:'🪦 ASTRAL REAPER rots your life force! −{n} Max HP for this battle!'}},
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
    /* was: g.inv[target]=0 — one whole stack gone for good */
    spec:{id:'matrix-lock',kind:'lockTypes',pickRandom:1,t:3,once:true,when:{bossHPPct:{lte:60}},
          col:'var(--purple)',tele:'SEGMENTATION FAULT',
          emptyMsg:'🔮 MATRIX OVERLORD reaches for a pointer that is already null.',
          msg:'🔮 MATRIX OVERLORD drops the pointer to your {items} — sealed 3 turns!'}},
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
    spec:{id:'w4s4',kind:'heal',flat:250,float:false,when:{every:2},
          col:'var(--orange)',tele:'SOLAR FLARE',msg:'☀️ HELIOS MONARCH flares up! Absorbed heat to restore +250 HP!'}},
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
    spec:{id:'w4boss',kind:'atkup',mult:1.8,once:true,when:{bossHPPct:{lte:40}},
          col:'var(--red)',tele:'EVENT HORIZON',msg:'🕳️ SINGULARITY ALPHA collapses time and gravity! ATK boosted by 1.8×!'}
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
    spec:{id:'w5s1',kind:'atkup',mult:1.5,once:true,when:{bossHPPct:{lte:50}},
          col:'var(--orange)',tele:'COSMIC ANVIL',msg:'🛠️ VULCAN strikes his cosmic anvil! ATK permanently increased by 1.5×!'}},

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
    spec:{id:'w5s2',kind:'heal',flat:1500,float:false,when:{every:4},
          col:'var(--cyan)',tele:'REWIND',msg:'⏳ CHRONOS reverses the timeline! Restored +1500 HP!'}},

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
    spec:[{id:'w5s3a',kind:'para',t:2,once:true,when:{bossHPPct:{lte:40}},tele:'ABSOLUTE MADNESS'},
          {id:'w5s3b',kind:'blind',t:3,once:true,when:{bossHPPct:{lte:40}},
           col:'var(--purple)',msg:'👁️ CTHULHU LEGACY inflicts absolute madness! Paralyzed and Blinded!'}]},

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
    /* was: every stack halved, permanently */
    spec:{id:'pantheon-lock',kind:'lockTypes',pickRandom:2,t:2,once:true,when:{bossHPPct:{lte:50}},
          col:'var(--magenta)',tele:'CELESTIAL PULSE',
          emptyMsg:'💫 AMATERASU pulses across an empty satchel.',
          msg:'💫 AMATERASU seals your {items} — 2 turns!'}},

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
    spec:[{id:'w5bossA',kind:'heal',full:true,float:false,once:true,when:{bossHPPct:{lte:30}},tele:'BIG BANG'},
          {id:'w5bossB',kind:'atkup',mult:2,once:true,when:{bossHPPct:{lte:30}},
           col:'var(--yellow)',msg:'👑 ETERNUS PRIME triggers Big Bang! Health fully restored and damage multiplied by 2×!'}]},
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
/* Stages author their special as `spec:` data; SPX compiles it to the spFn the
   battle loop calls (dino.js:1196). A stage that still carries a hand-written
   spFn keeps it — that is how the four rebalanced stages stay readable. */
STAGES.forEach(s=>{ if(s.spec && typeof s.spFn!=='function') s.spFn=SPX.make(s.spec); });
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

/*world topology helpers*/
function worldOfStage(si){ return (STAGES[si]&&STAGES[si].world)||1; }
function worldBossStage(w){ return w*5-1; }                       // 4, 9, 14, 19, 24
function worldCleared(w){ return ((G.levelsCleared||[])[worldBossStage(w)]||0)>=5; }

/* ══ WORLD METADATA ══ */
const WORLD_META=[
  {id:1,cls:'wl-1',name:'WORLD 1  THE KNOWN LANDS'},
  {id:2,cls:'wl-2',name:'WORLD 2  THE DARK BEYOND'},
  {id:3,cls:'wl-3',name:'WORLD 3  THE ABYSS'},
  {id:4,cls:'wl-4',name:'WORLD 4  THE VOID FRONTIER'},
  {id:5,cls:'wl-5',name:'WORLD 5  THE CELESTIAL PANTHEON'},
];
let WORLD_COUNT=WORLD_META.length;

/*The map screen*/
let _curWorld=0;
let TOTAL_SLIDES=WORLD_COUNT+1;         // worlds + the end slide
function maxSlide(){ return TOTAL_SLIDES-1; }   // browsing is always allowed
function buildMap(){
  G.inBattle=false;
  if(G.timedMode===undefined)G.timedMode=true;
  updateTimerToggleBtn();
  if(Array.isArray(G.levelsCleared)&&G.levelsCleared.length<STAGES.length)
    for(let i=G.levelsCleared.length;i<STAGES.length;i++)G.levelsCleared[i]=0;
  document.getElementById('mhp').textContent=G.playerMaxHP;
  document.getElementById('matk').textContent='+'+G.pATK;
  document.getElementById('mres').textContent=G.pRES+'%';
  document.getElementById('mscore').textContent=G.score;

  const track=document.getElementById('map-track');
  track.innerHTML='';

  for(let world=1;world<=WORLD_COUNT;world++){
    const slide=document.createElement('div');
    slide.className='map-slide';
    const label=document.createElement('div');
    label.className='world-label '+WORLD_META[world-1].cls;
    label.textContent=WORLD_META[world-1].name;
    slide.appendChild(label);


    const stages=document.createElement('div');
    stages.className='slide-stages';
    const stageIndices=STAGES.map((s,i)=>i).filter(i=>STAGES[i].world===world);
    const wrap=document.createElement('div');
    wrap.className='path-row';   // layout lives in CSS — inline styles here were unreachable by any media query

    stageIndices.forEach((si,pos)=>{
      if(pos>0){
        const conn=document.createElement('div');
        const prevDone=G.levelsCleared[stageIndices[pos-1]]>=5;
        conn.className='path-connector'+(prevDone?' done':'');
        wrap.appendChild(conn);
      }
      const cleared=G.levelsCleared[si]>=5,current=G.curStage===si,stg=STAGES[si];
      const locked=G.curStage<si&&!(window.W2&&W2.canBrowse&&W2.canBrowse(si));
      const node=document.createElement('div');
      let cls='stage-node ';
      if(cleared)cls+='sn-done ';else if(current)cls+='sn-active ';else cls+='sn-locked locked ';
      if(si===4)cls+='sn-boss5 ';if(si===9)cls+='sn-boss10 ';
      node.className=cls.trim();
      node.innerHTML=`<div class="sn-orb"><div class="sn-num">S${si+1}</div><div class="sn-icon">${stg.icon}</div></div><div class="sn-label">${stg.name}</div><div class="sn-pips" id="pips-${si}"></div><div class="reward-badge">${stg.isBoss?'Boss Rewards!':'Level Drops'}</div>`;
      node.addEventListener('click',()=>{
        if(G.viewOnly){
          /* the completed map is read-only — except that once the margin is
             open, touching a world past it carries the finished book onward */
          if(window.W2&&STAGES[si].world>=6&&W2.A().gateOpen&&W2.requestBeyond)W2.requestBeyond();
          return;
        }
        const maxUnlocked=window.W2?W2.maxWorldUnlocked():5;
        if(STAGES[si].world>maxUnlocked)return;   // worlds beyond the gate stay shut
        enterLevel(si,Math.min(G.levelsCleared[si]||0,4));
      });
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
        bub.addEventListener('click',()=>{
          if(G.viewOnly)return;
          const cl=G.levelsCleared[G.curStage]||0;
          if(li!==cl&&li>cl)return;          // cleared levels are free to replay
          enterLevel(G.curStage,li);
        });
        slRow.appendChild(bub);
      });
      stages.appendChild(slRow);
    }

    slide.appendChild(stages);
    track.appendChild(slide);
  }

    // ── ??? slide (after World 5) ──
  const soon=document.createElement('div');
  soon.className='map-slide';
  if(window.W2){
    W2.buildEndSlide(soon);              // COMING SOON → ??? → THE UNWRITTEN
  }else{
    soon.innerHTML=`<div class="world-label wl-soon">WORLD 6 &nbsp;???</div>
      <div class="soon-wrap">
        <div class="soon-orb">🔒</div>
        <div class="soon-title">COMING SOON</div>
        <div class="soon-sub">New worlds, new bosses, new attributes.<br>Finish WORLD 5 while you wait.</div>
      </div>`;
  }
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
  for(let w=0;w<=WORLD_COUNT;w++){
    const d=document.createElement('div');
    const isSoon=(w===WORLD_COUNT);
    const reached=isSoon?(STAGES[G.curStage].world>=WORLD_COUNT)
                        :STAGES.some((s,i)=>s.world===w+1&&G.curStage>=i);
    d.className='map-dot'+(w===_curWorld?' active':'')+(reached?'':' preview')+(isSoon?' soon':'');
    d.title=reached?(isSoon?'???':`World ${w+1}`):(isSoon?'???':`World ${w+1} — preview`);
    d.onclick=()=>goToWorld(w);
    dots.appendChild(d);
  }


  // jump to the world containing the current stage on first build
  // (clamped: a save made inside world 7 would otherwise ask for slide 6
  //  before W2.registerWorlds has grown WORLD_COUNT past 5)
  _curWorld=Math.max(0,Math.min(maxSlide(),STAGES[G.curStage].world-1));
  updateSlide();
  renderAttrBar('map');
}

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

/*Scene plumbing*/
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
      eEl.innerHTML=makeSpr(ECOL[stg.sprIdx],si,isBoss?90:68);
      eEl.style.bottom=(wc.height*.28)+'px';
      eEl.classList.add('visible');
    }
    if(frame<TOTAL+12){_walkId=requestAnimationFrame(animate);}
    else{cancelAnimationFrame(_walkId);setTimeout(()=>{layer.style.display='none';bc.classList.remove('walk-hidden');onDone();},200);}
  }
  animate();
}

/* swipe for phones AND mouse-drag on desktop */
(function(){
  const wrap  = document.querySelector('.map-slider-wrap');
  const track = document.getElementById('map-track');
  if(!wrap||!track) return;
  let startX=0,startY=0,dragging=false,dragDX=0,axis=null,captured=false;
  const THRESH=8;                                   // px before it counts as a drag

  function isMapOn(){return document.getElementById('s-map').classList.contains('on');}

  wrap.addEventListener('pointerdown',e=>{
    if(!isMapOn())return;
    if(e.pointerType==='mouse'&&e.button!==0)return;   // ignore right/middle click
    dragging=true;dragDX=0;axis=null;captured=false;
    startX=e.clientX;startY=e.clientY;
    /* NO setPointerCapture here — it retargets the click to wrap and
       kills every .stage-node / .sl-bubble handler on mouse input */
    track.style.transition='none';
  });

  wrap.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const dx=e.clientX-startX,dy=e.clientY-startY;
    if(axis===null){
      if(Math.abs(dx)<THRESH&&Math.abs(dy)<THRESH)return;   // still just a click
      axis=(Math.abs(dx)>Math.abs(dy))?'x':'y';
      if(axis==='x'){                                        // now it's a real swipe
        try{wrap.setPointerCapture(e.pointerId);captured=true;}catch(_){}
      }
    }
    if(axis!=='x')return;                                    // vertical intent, let it scroll
    dragDX=dx;
    const pct=(dx/(wrap.clientWidth||1))*100;
    track.style.transform=`translateX(calc(-${_curWorld*100}% + ${pct}%))`;
  });

  function endDrag(e){
    if(!dragging)return;
    dragging=false;
    if(captured&&e&&e.pointerId!=null){try{wrap.releasePointerCapture(e.pointerId);}catch(_){}}
    captured=false;
    track.style.transition='';
    const moved=Math.abs(dragDX);
    if(axis==='x'&&moved>60)slideWorld(dragDX<0?1:-1);
    else updateSlide();                                      // snap back
    if(moved>THRESH){                                        // a drag must not become a click
      wrap._noClick=true;
      setTimeout(()=>{wrap._noClick=false;},0);
    }
    axis=null;dragDX=0;
  }

  wrap.addEventListener('pointerup',endDrag);
  wrap.addEventListener('pointercancel',endDrag);
  wrap.addEventListener('pointerleave',e=>{if(dragging)endDrag(e);});

  wrap.addEventListener('click',e=>{                         // capture phase
    if(wrap._noClick){e.stopPropagation();e.preventDefault();}
  },true);
})();

console.log('[dino-world] '+STAGES.length+' stages, '+WORLD_META.length+' worlds registered');
if(!window.SceneFX) console.error('[dino-world] SceneFX missing — load dino-scenes.js first');
