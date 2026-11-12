/* 8.6: steg och svar intill frågor och fysikfigurer. */
(()=>{'use strict';
for(const s of document.querySelectorAll('.slide')){
 const body=s.querySelector('.body-copy');if(!body)continue;
 const label=s.querySelector(':scope > .steps-label');if(label)body.appendChild(label);
 for(const step of [...s.querySelectorAll(':scope > .step')])body.appendChild(step);
 const quiz=s.querySelector(':scope > .quiz');if(quiz)body.appendChild(quiz);
}
function syncStep(){const slide=document.querySelector('.slide.active'),control=document.querySelector('#step');if(slide&&control)control.hidden=!slide.querySelector('.step')}
for(const id of ['next','prev','jump','reset','classmode','repeatmode']){
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
