/* ══════════════════════════════════════════════════════════════
   DINO-Q-END.JS — the 50 questions of THE WRITING ROOM
   (WORLD END · si 50 · THE UNWRITTEN)

   LOAD ORDER: after dino.js.
   ACTIVATION: W2.armUnbrokenPage() (dino-world2.js §12) sets
   G._endGauntlet = true when WORLD END L5 begins; scrubBattleState and
   leaveBattleState (dino.js) clear it. Inert otherwise.
   Reads window.G — dino.js mirrors its `let G` there via syncG(); before
   that mirror existed window.G was always undefined and this file never
   served a single question.

   Every entry: 6 choices, tier 'hard', no repeats until exhausted.
   ══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

const Q_END=[
/* ── I. THE ARITHMETIC OF ENDINGS (1-17) ── */
{type:'Math',q:'What is the sum of the interior angles of a 17-sided polygon?',a:'2700°',c:['2700°','2880°','2520°','3060°','2340°','3240°']},
{type:'Math',q:'What is the last digit of 7⁷?',a:'3',c:['3','7','9','1','5','4']},
{type:'Math',q:'How many prime numbers are less than 50?',a:'15',c:['15','16','14','17','13','18']},
{type:'Math',q:'What is log₂(1024)?',a:'10',c:['10','9','11','12','8','16']},
{type:'Math',q:'How many distinct arrangements are there of the letters in LEVEL?',a:'30',c:['30','60','20','120','15','24']},
{type:'Math',q:'What is 12! ÷ 10!?',a:'132',c:['132','120','110','144','156','121']},
{type:'Math',q:'What is gcd(1071, 462)?',a:'21',c:['21','7','33','11','42','3']},
{type:'Math',q:'How many diagonals does a decagon have?',a:'35',c:['35','30','40','45','25','20']},
{type:'Math',q:'What is the probability that two fair dice sum to 7?',a:'1/6',c:['1/6','1/8','5/36','1/12','7/36','1/9']},
{type:'Math',q:'What is 1 + 2 + 3 + … + 100?',a:'5050',c:['5050','5000','5100','4950','10100','5500']},
{type:'Math',q:'What is the cube root of 2197?',a:'13',c:['13','12','14','11','17','19']},
{type:'Math',q:'What is the smallest positive integer divisible by every number from 1 to 10?',a:'2520',c:['2520','5040','1260','3628800','720','1680']},
{type:'Math',q:'In the sequence 1, 1, 2, 3, 5, 8, …, what is the 12th term?',a:'144',c:['144','89','233','121','169','132']},
{type:'Math',q:'How many subsets does a set of 6 elements have?',a:'64',c:['64','36','32','128','12','720']},
{type:'Math',q:'What is sin(30°) + cos(60°)?',a:'1',c:['1','0.5','√3/2','1.5','0','√2']},
{type:'Math',q:'What is the value of the repeating decimal 0.999… ?',a:'Exactly 1',c:['Exactly 1','Slightly less than 1','Undefined','0.9','Infinitesimally less than 1','Depends on the base']},
{type:'Math',q:'What is 2¹⁰ − 2⁹?',a:'512',c:['512','1024','256','2','1','768']},

/* ── II. THE PHYSICS OF THE LAST ROOM (18-34) ── */
{type:'Science',q:'What is the speed of light in a vacuum, exactly, in metres per second?',a:'299,792,458',c:['299,792,458','300,000,000','299,458,792','298,792,458','299,792,485','186,282']},
{type:'Science',q:'Which two quantities cannot both be known precisely, per the uncertainty principle?',a:'Position and momentum',c:['Position and momentum','Mass and charge','Energy and mass','Velocity and acceleration','Spin and charge','Temperature and volume']},
{type:'Science',q:'Which particle mediates the strong nuclear force?',a:'Gluon',c:['Gluon','Photon','W boson','Graviton','Neutrino','Meson']},
{type:'Science',q:'After three half-lives, what fraction of the original radioactive sample remains?',a:'12.5%',c:['12.5%','25%','33%','6.25%','50%','8%']},
{type:'Science',q:'Which element has the highest melting point of any pure metal?',a:'Tungsten',c:['Tungsten','Titanium','Osmium','Platinum','Iron','Tantalum']},
{type:'Science',q:'The Chandrasekhar limit is approximately how many solar masses?',a:'1.44',c:['1.44','3.00','0.80','2.50','5.00','1.00']},
{type:'Science',q:'In RNA, which base pairs with adenine?',a:'Uracil',c:['Uracil','Thymine','Cytosine','Guanine','Inosine','Adenine']},
{type:'Science',q:'What does the second law of thermodynamics say about the entropy of an isolated system?',a:'It never decreases',c:['It never decreases','It always decreases','It stays constant','It oscillates','It approaches zero','It is undefined']},
{type:'Science',q:'What is the SI unit of magnetic flux density?',a:'Tesla',c:['Tesla','Weber','Henry','Gauss','Siemens','Ampere']},
{type:'Science',q:'Which atmospheric layer contains the ozone layer?',a:'Stratosphere',c:['Stratosphere','Troposphere','Mesosphere','Thermosphere','Exosphere','Ionosphere']},
{type:'Science',q:'What is the net ATP yield of glycolysis per glucose molecule?',a:'2',c:['2','4','36','38','1','0']},
{type:'Science',q:'What is the approximate escape velocity of Earth, in km/s?',a:'11.2',c:['11.2','7.9','9.8','16.6','25.0','4.3']},
{type:'Science',q:'What is the approximate temperature of the cosmic microwave background, in kelvin?',a:'2.7',c:['2.7','0','3.7','5.5','1.4','10.0']},
{type:'Science',q:'The Boltzmann constant is measured in which units?',a:'J/K',c:['J/K','J·s','N/m','W/m²','K/J','J/mol']},
{type:'Science',q:'CRISPR-Cas9 is a system that cuts which molecule?',a:'DNA',c:['DNA','RNA','Protein','Lipid membrane','ATP','Ribosome']},
{type:'Science',q:'What is the name for the boundary beyond which nothing can escape a black hole?',a:'Event horizon',c:['Event horizon','Singularity','Accretion disc','Ergosphere','Photon sphere','Schwarzschild core']},
{type:'Science',q:'Heat death of the universe describes a final state of what?',a:'Maximum entropy',c:['Maximum entropy','Maximum density','Zero volume','Infinite mass','Total vacuum energy','Reversed time']},
{type:'Science',q:'Which conservation law follows from time-translation symmetry, by Noether\u2019s theorem?',a:'Conservation of energy',c:['Conservation of energy','Conservation of charge','Conservation of momentum','Conservation of spin','Conservation of mass','Conservation of entropy']},

/* ── III. THE LOGIC THAT REFUSES TO CLOSE (35-42) ── */
{type:'Logic',q:'What is the contrapositive of "If P then Q"?',a:'If not Q then not P',c:['If not Q then not P','If Q then P','If not P then not Q','P and not Q','If P then not Q','Q or not P']},
{type:'Logic',q:'A statement that is true under every possible interpretation is called a…',a:'Tautology',c:['Tautology','Contradiction','Contingency','Corollary','Conjecture','Syllogism']},
{type:'Logic',q:'"This sentence is false." This is best known as which paradox?',a:'The liar paradox',c:['The liar paradox','Zeno\u2019s paradox','Russell\u2019s paradox','Sorites paradox','Hempel\u2019s paradox','Newcomb\u2019s paradox']},
{type:'Logic',q:'Which fallacy assumes the conclusion inside its own premise?',a:'Begging the question',c:['Begging the question','Ad hominem','Straw man','False dilemma','Slippery slope','Post hoc']},
{type:'Logic',q:'Whose theorems proved that no consistent formal system can prove every arithmetic truth?',a:'Gödel',c:['Gödel','Russell','Hilbert','Cantor','Frege','Peano']},
{type:'Logic',q:'Who proved that the halting problem is undecidable?',a:'Alan Turing',c:['Alan Turing','John von Neumann','Alonzo Church','Claude Shannon','Kurt Gödel','Ada Lovelace']},
{type:'Logic',q:'In formal logic, the symbol ∀ means…',a:'For all',c:['For all','There exists','Not','Therefore','Implies','Is a member of']},
{type:'Logic',q:'The Ship of Theseus is a thought experiment primarily about what?',a:'Identity over time',c:['Identity over time','Free will','Causality','Moral luck','Perception','Infinity']},

/* ── IV. THE AUTHOR'S OWN VOCABULARY (43-50) ── */
{type:'Language',q:'What is the term for fiction that openly acknowledges it is fiction?',a:'Metafiction',c:['Metafiction','Allegory','Pastiche','Satire','Realism','Bildungsroman']},
{type:'Language',q:'What is it called when the author\u2019s own voice breaks into the narrative to address the reader?',a:'Authorial intrusion',c:['Authorial intrusion','Free indirect discourse','Stream of consciousness','Epistolary form','Deus ex machina','In medias res']},
{type:'Language',q:'A word that can mean its own opposite, such as "cleave", is called a…',a:'Contronym',c:['Contronym','Homonym','Synonym','Eponym','Acronym','Antonym']},
{type:'Language',q:'A copy or representation that has replaced the original it depicted is a…',a:'Simulacrum',c:['Simulacrum','Metaphor','Palimpsest','Allusion','Motif','Analogue']},
{type:'Language',q:'A manuscript reused by scraping away earlier writing, with traces still visible, is a…',a:'Palimpsest',c:['Palimpsest','Codex','Folio','Colophon','Incunable','Vellum']},
{type:'Language',q:'The rhetorical device of addressing someone absent or something abstract is called…',a:'Apostrophe',c:['Apostrophe','Anaphora','Chiasmus','Litotes','Zeugma','Asyndeton']},
{type:'Language',q:'A plot device that resolves everything by sudden unexplained intervention is called…',a:'Deus ex machina',c:['Deus ex machina','MacGuffin','Chekhov\u2019s gun','Red herring','Framing device','Foreshadowing']},
{type:'Language',q:'What is the term for the final word or closing statement that ends a written work?',a:'Colophon',c:['Colophon','Epigraph','Preamble','Marginalia','Errata','Frontispiece']},
];

/* ── picker: no repeats until all 50 are used ── */
function pickEndQ(){
  const G=window.G; if(!G)return null;
  if(!(G._endQUsed instanceof Set)) G._endQUsed=new Set();
  let idx=Q_END.map((_,i)=>i).filter(i=>!G._endQUsed.has(i));
  if(!idx.length){ G._endQUsed.clear(); idx=Q_END.map((_,i)=>i); }
  const i=idx[Math.floor(Math.random()*idx.length)];
  G._endQUsed.add(i);
  const it=Q_END[i];
  return { tier:'hard', type:it.type, q:it.q, a:it.a, c:it.c.slice() };
}

/* ── wrap pickQ: only intercepts during the END gauntlet ── */
const prevPickQ = window.pickQ;
if(typeof prevPickQ!=='function'){
  console.warn('[dino-q-end] pickQ not found — load this after dino.js');
  return;
}
window.pickQ = function(){
  if(window.G && window.G._endGauntlet){
    const q=pickEndQ();
    if(q) return q;
  }
  return prevPickQ.apply(this,arguments);
};

/* ── expose for authoring / testing ── */
window.Q_END      = Q_END;
window.pickEndQ   = pickEndQ;
window.endBankSize= Q_END.length;
console.log('[dino-q-end] '+Q_END.length+' END questions loaded (6 choices each)');

})();
