/* 8.6: steg och svar intill frågor och fysikfigurer. */
(()=>{'use strict';
for(const s of document.querySelectorAll('.slide')){
 const body=s.querySelector('.body-copy');if(!body)continue;
 const label=s.querySelector(':scope > .steps-label');if(label)body.appendChild(label);
 for(const step of [...s.querySelectorAll(':scope > .step')])body.appendChild(step);
 const quiz=s.querySelector(':scope > .quiz');if(quiz)body.appendChild(quiz);
 // The source PDF/page belongs in the review record, not on a pupil slide.
 s.querySelector('.source-note .text:first-child')?.remove();
}
// V2.3: native mathematical markup in the actual pupil-facing questions,
// choices and feedback, not merely in the JSON or after the static solution.
const M=(body,block=false)=>`<math xmlns="http://www.w3.org/1998/Math/MathML" display="${block?'block':'inline'}">${body}</math>`;
const V=s=>`<msub><mi>V</mi><mtext>${s}</mtext></msub>`;
const U=s=>`<msub><mi>U</mi><mtext>${s}</mtext></msub>`;
const num=(n,unit='V')=>`<mn>${n}</mn><mspace width="0.17em"/><mtext>${unit}</mtext>`;
const plus=(n)=>`<mo>+</mo>${num(n)}`;
const minus=(n)=>`<mo>−</mo>${num(n)}`;
const examples={
 3:{
  prompt:`Röd prob i A (${M(`${V('A')}<mo>=</mo>${minus(3)}`)}), svart i B (${M(`${V('B')}<mo>=</mo>${plus(2)}`)}). Vilket ${M(U('AB'))} visar mätaren?`,
  choices:[plus(5),minus(5),minus(1)],
  explanation:'Byte av prober byter tecken på den uppmätta spänningen. Här är den röda probens potential lägre.',
  lines:[`${U('AB')}<mo>=</mo>${V('A')}<mo>−</mo>${V('B')}`,
   `${U('AB')}<mo>=</mo>${minus(3)}<mo>−</mo><mo>(</mo>${plus(2)}<mo>)</mo><mo>=</mo>${minus(5)}`]
 },
 9:{
  prompt:`När referensen flyttas från A till C, vad händer med spänningen över ${M(num(2,'Ω'))}?`,
  choices:[`Den minskar med ${M(num(8))}`,`Den ökar med ${M(num(8))}`,`Den är fortfarande ${M(num(4))}`],
  explanation:'Nollnivån ändrar alla nodpotentialer lika mycket, men inte spänningen mellan B och C.',
  lines:[`${U('BC')}<mo>=</mo>${num(12)}<mo>−</mo>${num(8)}<mo>=</mo>${num(4)}`,
   `${U('BC')}<mo>=</mo>${num(4)}<mo>−</mo>${num(0)}<mo>=</mo>${num(4)}`]
 },
 13:{
  prompt:`A ligger på ${M(plus(5))} och B på ${M(minus(1))}. Välj sedan ${M(`${V('A')}<mo>=</mo>${num(0)}`)}. Vad blir ${M(V('B'))}?`,
  choices:[minus(6),plus(6),num(0)],
  explanation:'B ligger sex volt lägre än A. Att lägga A på noll är en gemensam förskjutning, inte en ny koppling.',
  lines:[`${V('B')}<mo>′</mo><mo>=</mo>${minus(1)}<mo>−</mo>${plus(5)}<mo>=</mo>${minus(6)}`,
   `${U('AB')}<mo>=</mo>${plus(5)}<mo>−</mo><mo>(</mo>${minus(1)}<mo>)</mo><mo>=</mo>${plus(6)}`]
 }
};
for(const [index,spec] of Object.entries(examples)){
 const slide=document.getElementById('bild-'+index),quiz=slide?.querySelector('.quiz');
 if(!quiz)continue;
 const prompt=quiz.querySelector(':scope > b');if(prompt)prompt.innerHTML=spec.prompt;
 quiz.querySelectorAll('button[data-choice]').forEach((el,i)=>{
  el.innerHTML=spec.choices[i].startsWith('Den ')?spec.choices[i]:M(spec.choices[i]);
 });
 const msg=quiz.querySelector('.feedback'),toggle=quiz.querySelector('.feedback-toggle');
 const sync=()=>{
  if(toggle.textContent!=='Dölj återkoppling')return;
  const pre=quiz.querySelector('.selected')?(quiz.querySelector('.selected.good')?'Rätt. ':'Inte riktigt. '):'Återkoppling: ';
  msg.innerHTML=pre+spec.explanation+'<span class="potential-feedback-math" aria-label="Förklarande beräkningssteg">'+spec.lines.map(line=>'<span class="potential-feedback-equation">'+M(line,true)+'</span>').join('')+'</span>';
 };
 quiz.querySelectorAll('button[data-choice]').forEach(el=>el.addEventListener('click',sync));
 toggle.addEventListener('click',sync);
 slide.addEventListener('lesson:reset',sync);
}
// A recall aid belongs to the existing bookwork/exit view, after the pupil's
// own task and diagnostic question, not as an additional slide or pre-answer.
const work=document.querySelector('#bild-13 .body-copy');
if(work){
 const recap=document.createElement('details');recap.className='potential-v23-summary';
 const cards=[
  ['Spänning mellan två punkter',`${U('AB')}<mo>=</mo>${V('A')}<mo>−</mo>${V('B')}`,'Probernas ordning bestämmer tecknet.'],
  ['Ohms lag för en resistor',`<mi>U</mi><mo>=</mo><mi>R</mi><mi>I</mi>`,'Gäller i den ohmska modell som används i kretsen.'],
  ['Runt en sluten slinga',`<mo>∑</mo><mi>Δ</mi><mi>V</mi><mo>=</mo><mn>0</mn>`,'Skriv uppgångar och fall med rätt tecken.'],
  ['Ny vald nollnivå',`${V('i')}<mo>′</mo><mo>=</mo>${V('i')}<mo>−</mo><msub><mi>V</mi><mtext>ref</mtext></msub>`,'Samma förskjutning för alla punkter; spänningarna ändras inte.'],
  ['Laddningens potentiella energi',`<mi>Δ</mi><msub><mi>E</mi><mtext>p</mtext></msub><mo>=</mo><mi>q</mi><mi>Δ</mi><mi>V</mi>`,'Tecknet för laddningen q spelar roll.']
 ];
 recap.innerHTML='<summary>Samband att minnas – visa/dölj frivilligt stöd</summary><p>Försök först ur minnet. Öppna bara om du behöver ett samband under bokarbetet.</p><div class="potential-v23-recap-grid">'+
  cards.map(([title,formula,note])=>`<article><b>${title}</b><div class="potential-v23-recap-equation">${M(formula,true)}</div><p>${note}</p></article>`).join('')+'</div>';
 work.appendChild(recap);
 document.querySelector('#bild-13').addEventListener('lesson:reset',()=>{recap.open=false});
 for(const id of ['next','prev','jump','classmode','repeatmode']){
  const el=document.getElementById(id);el?.addEventListener(id==='jump'?'change':'click',()=>{recap.open=false});
 }
}
function syncStep(){const slide=document.querySelector('.slide.active'),control=document.querySelector('#step');if(slide&&control)control.hidden=!slide.querySelector('.step:not(.open)')}
for(const id of ['next','prev','jump','reset','classmode','repeatmode','step']){
 const el=document.getElementById(id);if(!el)continue;
 el.addEventListener(id==='jump'?'change':'click',syncStep);
}
// Stäng tidigare avslöjanden vid byte tillbaka till klassrumsläge.
document.querySelector('#classmode')?.addEventListener('click',()=>{
 document.querySelector('.slide.active')?.dispatchEvent(new Event('lesson:reset'));
 syncStep();
});
for(const el of document.querySelectorAll('#next,#prev,#step,#reset'))el.addEventListener('click',()=>el.blur());
// Global navigering även efter att en knapp haft fokus, men aldrig när ett reglage används.
document.addEventListener('keydown',ev=>{
 if(ev.defaultPrevented||ev.metaKey||ev.ctrlKey||ev.altKey||!['ArrowLeft','ArrowRight'].includes(ev.key))return;
 if(ev.target.closest('input,select,textarea,a,[role="slider"]'))return;
 if(ev.target.closest('button')){
  ev.preventDefault();ev.target.blur();
  (ev.key==='ArrowLeft'?document.getElementById('prev'):document.getElementById('step'))?.click();
 }
});
syncStep();
})();
