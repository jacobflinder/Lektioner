/* Only Fy1 9.6: require a student choice before feedback and explain every alternative.
   Other Fy1 lessons and the shared lesson engine remain unchanged. */
(()=>{'use strict';
const lesson=window.Fy1Lesson;
if(!lesson?.data?.pages)return;
for(const section of document.querySelectorAll('.slide')){
 const quizEl=section.querySelector('.quiz');if(!quizEl)continue;
 const index=Number(section.id.replace('bild-',''))-1;
 const def=lesson.data.pages[index]?.quiz;if(!def)continue;
 const choices=[...quizEl.querySelectorAll('button[data-choice]')];
 const toggle=quizEl.querySelector('button.feedback-toggle');
 const feedback=quizEl.querySelector('p.feedback');
 if(!toggle||!feedback||choices.length!==def.options.length)continue;
 const selectedIndex=()=>choices.findIndex(b=>b.classList.contains('selected'));
 const visible=()=>toggle.textContent==='Dölj återkoppling';
 const explain=()=>{
   const i=selectedIndex();
   if(i<0||!visible())return;
   if(def.explanations?.[i])feedback.textContent=def.explanations[i];
 };
 const lock=()=>{toggle.disabled=true;toggle.textContent='Välj svar först';};
 choices.forEach(b=>b.addEventListener('click',()=>{
   toggle.disabled=false;
   if(!visible())toggle.textContent='Visa återkoppling';
   explain();
 }));
 toggle.addEventListener('click',explain);
 section.addEventListener('lesson:reset',lock);
 lock();
}
})();