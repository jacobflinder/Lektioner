/* Lektion 8.4: endast lokal presentationslogik, återanvänder ordinarie Fy1-app. */
(()=>{'use strict';
for(const sec of document.querySelectorAll('.slide')){
 const body=sec.querySelector('.body-copy');if(!body)continue;
 // Keep worked solutions and the feedback beside their related physics figure.
 const label=sec.querySelector(':scope > .steps-label');if(label)body.append(label);
 for(const el of [...sec.querySelectorAll(':scope > .step')])body.append(el);
 const quiz=sec.querySelector(':scope > .quiz');if(quiz)body.append(quiz);
}
// Voluntary recall inside the original bookwork view. It deliberately contains
// only relationships and their conditions, never answers to textbook exercises.
const book=document.querySelector('#bild-11 .book-main');
if(book){
 const workTime=document.createElement('p');workTime.className='effect-work-time';
 workTime.innerHTML='<b>Bokarbete:</b> Avsätt 20 sammanhängande minuter. Formelstödet nedan är helt frivilligt.';
 book.append(workTime);
 const recap=document.createElement('details');recap.className='v23-summary';
 recap.innerHTML=`<summary>Frivilligt formelstöd · försök själv först</summary>
 <div class="effect-recap-grid">
  <article><strong>Effekt – energi per tid</strong><div class="effect-recap-formula"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>P</mi><mo>=</mo><mfrac><mi>E</mi><mi>t</mi></mfrac></math></div><span>Watt betyder joule per sekund.</span></article>
  <article><strong>Energi under en tid</strong><div class="effect-recap-formula"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>E</mi><mo>=</mo><mi>P</mi><mi>t</mi></math></div><span>Vid konstant effekt är energin proportionell mot tiden.</span></article>
  <article><strong>Elektrisk effekt</strong><div class="effect-recap-formula"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>P</mi><mo>=</mo><mi>U</mi><mi>I</mi></math></div><span>Använd spänning och ström för samma komponent.</span></article>
  <article><strong>Resistiv värmeeffekt</strong><div class="effect-recap-formula"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>P</mi><mo>=</mo><mi>R</mi><msup><mi>I</mi><mn>2</mn></msup></math></div><span>Gäller en ohmsk resistor; jämför vid konstant R.</span></article>
  <article><strong>Batteriets polspänning</strong><div class="effect-recap-formula"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>ℰ</mi><mo>=</mo><mi>U</mi><mo>+</mo><mi>r</mi><mi>I</mi></math></div><span>Vid urladdning fördelas ems mellan polspänning och inre spänningsfall.</span></article>
 </div>`;
 book.append(recap);
 const close=()=>{recap.open=false};
 document.querySelector('#bild-11').addEventListener('lesson:reset',close);
 for(const id of ['next','prev','jump','reset','repeatmode','classmode'])
  document.querySelector('#'+id)?.addEventListener(id==='jump'?'change':'click',close);
}
const classButton=document.querySelector('#classmode');const repeatButton=document.querySelector('#repeatmode');
// Avoid exposing previously revealed answers to a new group when switching back from repetition.
classButton?.addEventListener('click',()=>{document.querySelector('.slide.active')?.dispatchEvent(new Event('lesson:reset'));fixStep();});
function fixStep(){const s=document.querySelector('.slide.active');const step=document.querySelector('#step');if(!step||!s)return;step.hidden=!s.querySelector('.step:not(.open)');}
const j=document.querySelector('#jump'),next=document.querySelector('#next'),prev=document.querySelector('#prev'),reset=document.querySelector('#reset');
for(const el of [j,next,prev,reset,repeatButton,classButton,document.querySelector('#step')])el?.addEventListener(el===j?'change':'click',fixStep);
fixStep();
// Keep navigation clean when the teacher reveals steps by keyboard.
document.addEventListener('keydown',e=>{
 if((e.key==='ArrowRight'||e.key==='ArrowLeft'||e.key===' ')&&!e.metaKey&&!e.ctrlKey&&!e.altKey)
   queueMicrotask(fixStep);
});
document.addEventListener('keydown',e=>{
 if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.altKey)return;
 if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft'&&e.key!==' ')return;
 if(e.target?.matches('input,textarea,select,[contenteditable="true"]'))return;
 if(e.target?.closest('.model-root'))return; // Let the native slider act normally.
 if(e.target?.matches('button')&&e.target.closest('.toolbar'))return;
 if(e.target?.matches('button')&&e.target.closest('.end-controls')){e.target.blur();return;}
});
})();
