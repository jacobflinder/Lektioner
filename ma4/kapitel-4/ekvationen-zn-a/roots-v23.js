/* Figur-/interaktionsgranskning v2.3: metodstöd, semantisk återkoppling och
   lösningsfigurer för zⁿ=a. Allt körs lokalt, utan elevdata eller nätverk. */
(()=>{'use strict';
const {typeFormula,setFormula}=window.Ma4Math;
const math=(expression,display='inline')=>{
 const holder=document.createElement('span');holder.innerHTML=typeFormula(expression,display);
 return holder.firstElementChild;
};
const text=(tag,value,className='')=>{
 const node=document.createElement(tag);node.textContent=value;if(className)node.className=className;return node;
};
document.querySelector('#intro .lead').replaceChildren(document.createTextNode('4.3 · Ekvationen '),math('zⁿ = a'));
document.querySelector('#nok .lead').replaceChildren(document.createTextNode('NOKflex → 4.3 Potenser och komplexa tal → Ekvationen '),math('zⁿ = a'));
const planeNotes=document.querySelectorAll('#roots-plot .two > div:last-child > p.muted');
planeNotes[0].replaceChildren(document.createTextNode('Alla rötter har absolutbelopp 2. Vinkelsteget är '),
 math('2π/3 = 120°'),document.createTextNode('. Pilarna och cirkeln använder samma skala på båda axlarna.'));
planeNotes[1].textContent='När tre rötter syns: beräkna nästa heltalsvärde innan du kontrollerar.';

// Lägg den valbara repetitionen där eleven arbetar självständigt i NOKflex.
const nok=document.getElementById('nok');
const support=document.createElement('section');support.id='roots-method-support';support.className='roots-method-support';
support.setAttribute('aria-label','Valbart metodstöd för komplexa rötter');
support.innerHTML=`<h3>Behöver du ett samband?</h3>
 <p>Försök först minnas metoden. Öppna bara det steg du behöver – bokuppgifterna har inga färdiga svar här.</p>
 <div class="roots-support-list">
  <details><summary>1 · Skriv högerledet i polär form</summary><p class="math" data-root-formula="a = R(cos(θ) + i sin(θ))"></p><p>Här är R ett positivt absolutbelopp. Välj ett argument θ.</p></details>
  <details><summary>2 · Bestäm absolutbeloppet för rötterna</summary><p class="math" data-root-formula="rⁿ = R"></p><p>Välj det positiva tal r som upphöjt till n blir R.</p></details>
  <details><summary>3 · Bestäm alla möjliga riktningar</summary><p class="math" data-root-formula="nv = θ + 2πk"></p><p class="math" data-root-formula="v = (θ + 2πk)/n"></p><p>Heltalet k tar med alla hela varv innan du dividerar.</p></details>
  <details><summary>4 · Avgör vilka rötter som är olika</summary><p class="math" data-root-formula="k = 0, 1, …, n − 1"></p><p class="math" data-root-formula="Δv = 2π/n"></p><p>För positivt heltal n ger dessa n värden på k exakt n olika rötter när högerledet inte är noll. Vid noll är bara noll en rot.</p></details>
 </div>`;
nok.querySelector('.task').after(support);
support.querySelectorAll('[data-root-formula]').forEach(node=>setFormula(node,node.dataset.rootFormula,'block'));
// Grekiska variabler ska vara <mi> i MathML, inte infogade operatortecken.
support.querySelectorAll('math mo').forEach(glyph=>{
 if(glyph.textContent!=='θ'&&glyph.textContent!=='Δ')return;
 const variable=document.createElementNS('http://www.w3.org/1998/Math/MathML','mi');
 variable.textContent=glyph.textContent;glyph.replaceWith(variable);
});
const closeSupport=()=>support.querySelectorAll('details').forEach(node=>{node.open=false});
document.querySelectorAll('#prev,#next,#jump,[data-go],#mode').forEach(node=>
 node.addEventListener(node.tagName==='SELECT'?'change':'click',closeSupport));

// A/B/C måste visa riktiga matematiska uttryck, inte en textsträng med z² eller z₁.
const k3=document.getElementById('k3-decision');
// Håll valet intill samma rotfigur, inte under två generella förklaringstexter.
document.getElementById('roots-feedback').after(k3);
const k3Title=k3.querySelector('strong');
k3Title.replaceChildren(document.createTextNode('Vad händer när '),math('k = 3'),document.createTextNode('?'));
const k3Prompt=k3.querySelector('p.muted');
k3Prompt.textContent='Beräkna nästa argument med sambandet nedan. Välj en geometrisk tolkning före återkopplingen.';
const k3PromptMath=text('p','','math roots-quiz-prompt');
setFormula(k3PromptMath,'v = π/6 + (2πk)/3','block');k3Prompt.after(k3PromptMath);

const self=document.getElementById('self-roots-decision');
const selfTitle=self.querySelector('strong');
selfTitle.replaceChildren(document.createTextNode('Vilka är samtliga rötter till '),math('z² = −4'),document.createTextNode('?'));
const buttons={
 k3:[['A · Det kommer en fjärde rot vid','v = 390°'],['B · Vi kommer tillbaka till','z₁'],['C · Den nya roten sammanfaller med','z₃']],
 self:[['A · Två reella tal',['z₁ = 2','z₂ = −2']],['B · Två imaginära tal',['z₁ = 2i','z₂ = −2i']],['C · Två imaginära tal med för stor längd',['z₁ = 4i','z₂ = −4i']]]
};
for(const [box,list] of [[k3,buttons.k3],[self,buttons.self]]){
 box.querySelectorAll('button.choice').forEach((button,index)=>{
  const [prose,formula]=list[index];
  const expressions=Array.isArray(formula)?formula:[formula];
  const lines=document.createElement('span');lines.className='roots-choice-lines';
  lines.replaceChildren(...expressions.map(expression=>math(expression)));
  button.replaceChildren(text('span',prose,'roots-choice-text'),lines);
 });
}

const feedback={
 k3:[
  {prose:'390° är samma riktning efter ett helt varv. Det blir ingen fjärde rot.',formula:'390° = 30° + 360°'},
  {prose:'Rätt! Efter ett helt varv får vi precis första roten igen.',formula:'k = 3 ⇒ v = 13π/6 = 390°'},
  {prose:'Det är första roten vi kommer tillbaka till, inte den tredje.',formula:'v = 390° ⇒ z = z₁'}
 ],
 self:[
  {prose:'De två reella talen ger +4, alltså fel tecken.',formula:'(±2)² = 4'},
  {prose:'Rätt. Båda talen ger −4 vid kvadrering.',formula:'(2i)² = (−2i)² = −4'},
  {prose:'Dessa tal ger −16. Rotlängden måste vara 2.',formula:'(±4i)² = −16'}
 ]
};
function addMathFeedback(box,cases){
 const prose=box.querySelector('.feedback');
 const formula=text('p','','math roots-feedback-math hidden');prose.after(formula);
 const clear=()=>{formula.classList.add('hidden');formula.replaceChildren()};
 box.querySelectorAll('button.choice').forEach(button=>button.addEventListener('click',clear));
 box.querySelector('[data-decision-submit]').addEventListener('click',()=>{
  const selected=box.querySelector('button.choice.selected');if(!selected)return;
  const data=cases[Number(selected.dataset.answer)];
  prose.textContent=data.prose;
  setFormula(formula,data.formula,'block');formula.classList.remove('hidden');
 });
 return clear;
}
const clearK3Math=addMathFeedback(k3,feedback.k3);
addMathFeedback(self,feedback.self);
document.getElementById('roots-reset').addEventListener('click',clearK3Math);

// Ett korrekt facit till en geometrisk uppgift behöver även en faktisk figur.
const figures=[
 {id:'selfans',title:'Efter – båda rötterna på imaginära axeln',alt:'Två motsatta rötter, 2i och minus 2i, på cirkeln med radie två.',
  vectors:[{x:0,y:2,label:'2i',color:'blue',dx:17,dy:-13},{x:0,y:-2,label:'−2i',color:'teal',dx:17,dy:19}]},
 {id:'optionalans',title:'Efter – fyra jämnt fördelade fjärderötter',alt:'Fyra rötter på cirkeln med radie två vid 0, 90, 180 och 270 grader.',
  vectors:[{x:2,y:0,label:'2',color:'blue',dx:13,dy:-12},{x:0,y:2,label:'2i',color:'teal',dx:10,dy:-11},
   {x:-2,y:0,label:'−2',color:'orange',dx:-39,dy:-12},{x:0,y:-2,label:'−2i',color:'purple',dx:12,dy:18}]},
 {id:'exitans',title:'Efter – de tre kubikrötterna till det negativa talet',alt:'Tre rötter på cirkeln med radie två vid 60, 180 och 300 grader.',
  vectors:[{x:1,y:Math.sqrt(3),label:'z₁',color:'blue',dx:13,dy:-11},{x:-2,y:0,label:'z₂',color:'teal',dx:-33,dy:-14},
   {x:1,y:-Math.sqrt(3),label:'z₃',color:'orange',dx:15,dy:17}]}
];
for(const model of figures){
 const box=document.getElementById(model.id),final=box.querySelector('.ma4-final');
 const pair=document.createElement('div');pair.className='roots-validation-pair';final.before(pair);pair.append(final);
 const fig=document.createElement('figure');fig.className='roots-check-figure';
 const title=text('figcaption',model.title);const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.classList.add('plot');svg.id='roots-solution-'+model.id;svg.setAttribute('aria-label',model.alt);
 fig.append(title,svg);pair.append(fig);
 window.Ma4Plane.plot(svg,{minX:-3.2,maxX:3.2,minY:-3.2,maxY:3.2,alt:model.alt,
  circles:[{cx:0,cy:0,r:2,color:'#87adbd'}],vectors:model.vectors});
}

const css=document.createElement('style');css.textContent=`
.roots-method-support{margin:16px 0;padding:17px 19px;border:1px solid #bbd8cc;background:#f4faf7;border-radius:12px}
.roots-method-support h3{margin:0 0 8px;color:#17614f}
.roots-support-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:14px}
.roots-support-list details{border:1px solid #c1d9d0;background:white;border-radius:9px;padding:11px 13px;min-width:0}
.roots-support-list summary{cursor:pointer;font-weight:750;color:#174a3f}
.roots-support-list summary:focus-visible{outline:3px solid #e7a62e;outline-offset:3px}
.roots-support-list details[open]{border-color:#0c8170}
.roots-support-list .math{margin:14px 0;overflow-wrap:anywhere}
.roots-choice-text{display:block;font-size:.87rem;margin-bottom:3px}
.decision-check .choice math{display:inline;font-size:1.24rem}
.roots-choice-lines{display:grid;gap:16px}
.roots-feedback-math{margin:17px 0 4px!important;padding:12px 14px;border-left:4px solid #087d70;border-radius:8px;background:#e3f4ed;overflow-wrap:anywhere}
.roots-quiz-prompt{padding:9px 12px;background:#fff;border-radius:8px}
.roots-validation-pair{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);align-items:center;gap:14px;margin:15px 0}
.roots-validation-pair .ma4-final{margin:0}
.roots-check-figure{margin:0;background:#fff;border:1px solid #c4dce7;border-radius:10px;padding:8px}
.roots-check-figure figcaption{font-size:.84rem;font-weight:760;color:#195376;padding:6px 8px}
.roots-check-figure svg{max-height:265px}
#roots-plane text[fill="#19739f"],.roots-check-figure text[fill="#19739f"]{fill:#19739f}
#roots-plane text[fill="#0a8176"],.roots-check-figure text[fill="#0a8176"]{fill:#0a8176}
#roots-plane text[fill="#bc633a"],.roots-check-figure text[fill="#bc633a"]{fill:#bc633a}
.roots-check-figure text[fill="#7860b5"]{fill:#7860b5}
@media(min-width:1100px){#roots-plot #k3-decision{padding:12px 14px;margin:8px 0}
#roots-plot #k3-decision .decision-options{grid-template-columns:repeat(3,minmax(0,1fr))}
#roots-plot #k3-decision .choice{padding:9px 10px;font-size:.91rem}
#roots-plot #k3-decision .choice math{font-size:1.1rem}}
@media(max-width:760px){.roots-support-list,.roots-validation-pair{grid-template-columns:1fr}}
@media(max-width:520px){#roots-plane text,.roots-check-figure svg text{font-size:24px!important}
.roots-method-support{padding:12px}.roots-choice-text{font-size:.94rem}.decision-check .choice math{font-size:1.15rem}}
`;document.head.append(css);
})();
