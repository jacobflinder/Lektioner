/* Ma4 v2.3: semantisk beslutsfeedback, fördröjd konjugatfigur och lokala reset. */
(()=>{'use strict';
 const lesson=document.getElementById('h-konjugat');
 const decision=document.getElementById('h-conjugate-decision');
 const mathFeedback=document.getElementById('h-conjugate-mathfeedback');
 const figure=document.querySelector('.v23-conjugate-figure');
 const svg=document.getElementById('h-conjugate-plane');
 const explanation=document.querySelector('.v23-conj-explanation');
 const recap=document.getElementById('h-higher-recap');
 if(!lesson||!decision||!mathFeedback||!figure||!svg||!recap)throw Error('Ma4 v2.3: ett obligatoriskt metod- eller figurfält saknas');

 function syncFigure(){
  const visible=lesson.querySelectorAll('.v23-conjugate-sequence [data-seq-item]:not(.hidden)').length>0;
  figure.classList.toggle('is-revealed',visible);
  explanation.classList.toggle('hidden',!visible);
  svg.setAttribute('aria-label',visible?
   'Komplexa talplanet: den givna roten i och den konjugerade roten minus i är speglade i realaxeln':
   'Komplexa talplanet med den givna roten i och den reella axeln');
 }

 function hideFeedback(){
  mathFeedback.classList.add('hidden');
  mathFeedback.querySelectorAll('[data-feedback-case]').forEach(el=>el.classList.add('hidden'));
 }

 decision.addEventListener('click',event=>{
  const control=event.target.closest('button');
  if(!control)return;
  if(control.matches('button[data-answer]')){hideFeedback();return;}
  if(!control.matches('[data-decision-submit]'))return;
  const selected=decision.querySelector('button[data-answer].selected');
  if(!selected)return;
  hideFeedback();
  const current=mathFeedback.querySelector('[data-feedback-case="'+selected.dataset.answer+'"]');
  if(current){mathFeedback.classList.remove('hidden');current.classList.remove('hidden');}
 });

 lesson.querySelector('.v23-conjugate-sequence').addEventListener('click',event=>{
  if(event.target.closest('[data-seq-next],[data-seq-back],[data-seq-reset]'))syncFigure();
 });

 // Den lokala navigeringen återställer bara den bild man lämnar.
 // Bevarar projektets gemensamma lektionsmotor och andra kurser.
 function resetCurrentSlide(){
  const current=document.querySelector('.slide.active');
  if(!current)return;
  current.querySelectorAll('button[data-reveal][aria-expanded="true"]').forEach(button=>button.click());
  current.querySelectorAll('[data-seq-reset]').forEach(button=>button.click());
  current.querySelectorAll('[data-quiz]').forEach(box=>{
   box.querySelectorAll('.choice').forEach(choice=>{
    choice.classList.remove('correct','wrong');choice.setAttribute('aria-pressed','false');
   });
   const feedback=box.querySelector('.feedback');
   if(feedback){feedback.className='feedback';feedback.textContent='';}
  });
  current.querySelectorAll('details[open]').forEach(details=>details.open=false);
  if(current===lesson){
   hideFeedback();
   decision.querySelectorAll('.choice').forEach(choice=>{
    choice.classList.remove('selected','correct','wrong');choice.setAttribute('aria-pressed','false');
   });
   const submit=decision.querySelector('[data-decision-submit]');
   submit.disabled=true;
   const status=decision.querySelector('.feedback');
   status.className='feedback hidden';status.textContent='';
   syncFigure();
  }
  if(current.id==='h-nok')recap.open=false;
 }
 document.addEventListener('click',event=>{
  if(event.target.closest('#prev,#next,#mode,[data-go]'))resetCurrentSlide();
 },true);
 document.getElementById('jump').addEventListener('change',resetCurrentSlide,true);
 syncFigure();
})();
