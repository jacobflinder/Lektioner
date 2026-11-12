/* Lektion 8.4: endast lokal presentationslogik, återanvänder ordinarie Fy1-app. */
(()=>{'use strict';
for(const sec of document.querySelectorAll('.slide')){
 const body=sec.querySelector('.body-copy');if(!body)continue;
 // Keep worked solutions and the feedback beside their related physics figure.
 const label=sec.querySelector(':scope > .steps-label');if(label)body.append(label);
 for(const el of [...sec.querySelectorAll(':scope > .step')])body.append(el);
 const quiz=sec.querySelector(':scope > .quiz');if(quiz)body.append(quiz);
}
const classButton=document.querySelector('#classmode');const repeatButton=document.querySelector('#repeatmode');
// Avoid exposing previously revealed answers to a new group when switching back from repetition.
classButton?.addEventListener('click',()=>{document.querySelector('.slide.active')?.dispatchEvent(new Event('lesson:reset'));fixStep();});
function fixStep(){const s=document.querySelector('.slide.active');const step=document.querySelector('#step');if(!step||!s)return;step.hidden=!s.querySelector('.step');}
const j=document.querySelector('#jump'),next=document.querySelector('#next'),prev=document.querySelector('#prev'),reset=document.querySelector('#reset');
for(const el of [j,next,prev,reset,repeatButton,classButton])el?.addEventListener(el===j?'change':'click',fixStep);
fixStep();
document.addEventListener('keydown',e=>{
 if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.altKey)return;
 if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft'&&e.key!==' ')return;
 if(e.target?.matches('input,textarea,select,[contenteditable="true"]'))return;
 if(e.target?.closest('.model-root'))return; // Let the native slider act normally.
 if(e.target?.matches('button')&&e.target.closest('.toolbar'))return;
 if(e.target?.matches('button')&&e.target.closest('.end-controls')){e.target.blur();return;}
});
})();