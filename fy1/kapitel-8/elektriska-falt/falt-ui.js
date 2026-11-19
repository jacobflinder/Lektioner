/* Lektion 8.5: håll fråga, förklaring och figur inom samma visuella arbetsyta. */
(()=>{'use strict';
for(const s of document.querySelectorAll('.slide')){
 const body=s.querySelector('.body-copy');if(!body)continue;
 const label=s.querySelector(':scope > .steps-label');if(label)body.append(label);
 for(const x of [...s.querySelectorAll(':scope > .step')])body.append(x);
 const quiz=s.querySelector(':scope > .quiz');if(quiz)body.append(quiz);
 // PDF filenames and original page numbers belong in the teacher's source
 // documentation, not on the projected student view. Keep the pedagogical tag.
 s.querySelector('.source-note .text:first-child')?.remove();
}
// Four quiz explanations contain actual physical equations. The shared quiz
// renderer writes safe prose with textContent; add semantic equations only
// when the pupil explicitly requests feedback, never while choosing an answer.
for(const [n,expression] of [
 [2,'<msub><mi>F</mi><mi>x</mi></msub><mo>=</mo><mi>q</mi><msub><mi>E</mi><mi>x</mi></msub>'],
 [4,'<msup><mi>F</mi><mo>′</mo></msup><mo>=</mo><mo>(</mo><mn>2</mn><mi>q</mi><mo>)</mo><mi>E</mi><mo>=</mo><mn>2</mn><mi>F</mi>'],
 [6,'<mo>|</mo><mi>E</mi><mo>|</mo><mo>=</mo><mfrac><mi>U</mi><mi>d</mi></mfrac>'],
 [14,'<msub><mi>F</mi><mtext>ny</mtext></msub><mo>=</mo><mo>(</mo><mo>−</mo><mn>2</mn><msub><mi>q</mi><mn>0</mn></msub><mo>)</mo><mi>E</mi><mo>=</mo><mn>2</mn><msub><mi>F</mi><mtext>gammal</mtext></msub>']
]){
 const sec=document.querySelector('#bild-'+n),quiz=sec?.querySelector('.quiz');
 if(!quiz)continue;
 const math=document.createElement('div');math.className='field-equation field-quiz-equation';math.hidden=true;
 math.innerHTML='<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+expression+'</math>';
 quiz.querySelector('.feedback').after(math);
 const sync=()=>{math.hidden=quiz.querySelector('.feedback-toggle').textContent!=='Dölj återkoppling'};
 for(const btn of quiz.querySelectorAll('[data-choice],.feedback-toggle'))btn.addEventListener('click',sync);
 sec.addEventListener('lesson:reset',()=>{math.hidden=true});
}
// The optional recall is part of the original bookwork view, after its exit
// question, not another slide or a substitute for textbook tasks 851–860.
const book=document.querySelector('#bild-14 .book-main');
if(book){
 const time=document.createElement('p');time.className='field-book-time';
 time.innerHTML='<b>Bokarbete:</b> Skydda 21 minuter för uppgifter och exit. Försök återkalla sambanden själv innan du öppnar stödet.';
 book.append(time);
 const recap=document.createElement('details');recap.className='field-v23-summary';
 recap.innerHTML=`<summary>Frivilligt formelstöd · visa eller dölj</summary>
 <div class="field-recap-grid">
  <article><strong>Riktad elektrisk kraft</strong><div class="field-recap-math"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><msub><mi>F</mi><mi>x</mi></msub><mo>=</mo><mi>q</mi><msub><mi>E</mi><mi>x</mi></msub></math></div><span>Tecknet på q avgör om kraften går med eller mot fältet.</span></article>
  <article><strong>Superposition i en riktning</strong><div class="field-recap-math"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><msub><mi>E</mi><mtext>tot,x</mtext></msub><mo>=</mo><msub><mi>E</mi><mn>1x</mn></msub><mo>+</mo><msub><mi>E</mi><mn>2x</mn></msub></math></div><span>Addera bidragen med tecken när riktning är vald.</span></article>
  <article><strong>Homogent plattfält</strong><div class="field-recap-math"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mo>|</mo><mi>E</mi><mo>|</mo><mo>=</mo><mfrac><mi>U</mi><mi>d</mi></mfrac></math></div><span>Fältet pekar från plus till minus långt från kanterna.</span></article>
  <article><strong>Partikelns acceleration</strong><div class="field-recap-math"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><msub><mi>a</mi><mi>x</mi></msub><mo>=</mo><mfrac><msub><mi>F</mi><mi>x</mi></msub><mi>m</mi></mfrac></math></div><span>I ett homogent fält är accelerationen konstant så länge partikeln färdas fritt.</span></article>
  <article><strong>Energi från en accelererande spänning</strong><div class="field-recap-math"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>Δ</mi><mi>K</mi><mo>=</mo><mo>|</mo><mi>q</mi><mo>|</mo><mi>U</mi></math></div><span>Gäller över hela accelererande potentialskillnaden; U är beloppet.</span></article>
 </div>`;
 // The exit prompt appears before this closed support, so formula recall is
 // requested before a pupil can choose to open the formula list.
 const exit=book.parentElement.querySelector('.question');
 if(exit)exit.after(recap);else book.after(recap);
 const close=()=>{recap.open=false};
 document.querySelector('#bild-14').addEventListener('lesson:reset',close);
 for(const id of ['next','prev','jump','reset','repeatmode','classmode'])
  document.querySelector('#'+id)?.addEventListener(id==='jump'?'change':'click',close);
}
const step=document.querySelector('#step');
function reflect(){const active=document.querySelector('.slide.active');if(!active||!step)return;step.hidden=!active.querySelector('.step:not(.open)')}
for(const id of ['jump','prev','next'])document.querySelector('#'+id)?.addEventListener(id==='jump'?'change':'click',()=>{document.querySelector('.slide.active')?.dispatchEvent(new Event('lesson:reset'))},true);
for(const id of ['jump','prev','next','step','reset','repeatmode','classmode'])document.querySelector('#'+id)?.addEventListener('click',reflect);
document.querySelector('#jump')?.addEventListener('change',reflect);
document.querySelector('#classmode')?.addEventListener('click',()=>{
 document.querySelector('.slide.active')?.dispatchEvent(new Event('lesson:reset'));reflect();
});
for(const btn of document.querySelectorAll('#next,#prev,#step,#reset'))btn.addEventListener('click',()=>btn.blur());
// När fokus ligger på ett vanligt tangentbordsfokus i lektionsytan ska sidan gå att styra med piltangenter, utan att reglage störs.
document.addEventListener('keydown',ev=>{
 if(!['ArrowRight','ArrowLeft'].includes(ev.key)||ev.metaKey||ev.ctrlKey||ev.altKey)return;
 if(ev.target.closest('input,select,textarea,a,[role="slider"]'))return;
 if(ev.target.closest('button')){ev.preventDefault();ev.target.blur();if(ev.key==='ArrowRight')document.querySelector('#step')?.click();else document.querySelector('#prev')?.click()}
});
reflect();
})();
