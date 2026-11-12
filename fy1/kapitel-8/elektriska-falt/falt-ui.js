/* Lektion 8.5: håll fråga, förklaring och figur inom samma visuella arbetsyta. */
(()=>{'use strict';
for(const s of document.querySelectorAll('.slide')){
 const body=s.querySelector('.body-copy');if(!body)continue;
 const label=s.querySelector(':scope > .steps-label');if(label)body.append(label);
 for(const x of [...s.querySelectorAll(':scope > .step')])body.append(x);
 const quiz=s.querySelector(':scope > .quiz');if(quiz)body.append(quiz);
}
const step=document.querySelector('#step');
function reflect(){const active=document.querySelector('.slide.active');if(!active||!step)return;step.hidden=!active.querySelector('.step')}
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
