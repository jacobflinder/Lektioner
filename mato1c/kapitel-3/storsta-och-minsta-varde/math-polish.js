/* Lektion 38/41, krav v2.3: semantisk matematik även i frågor, dynamisk
 * återkoppling och stegfrågor. Återställ elevens facit vid navigering. */
(()=>{'use strict';
 const M=window.Ma4Math;if(!M)throw Error('Ma3c19 MathML support missing');
 let block=0,inline=0;
 for(const el of document.querySelectorAll('.slide .mathline,.slide .mathsmall,.slide .math-inline,.slide .method-math')){
  if(el.querySelector('math'))continue;
  const formula=el.textContent.trim().replace(/\s+/g,' ');
  if(!formula)continue;
  const isInline=el.matches('.mathsmall,.math-inline');
  M.setFormula(el,formula,isInline?'inline':'block');
  if(isInline)inline++;else block++;
 }
 if(block<65||inline<25)throw Error('Too little semantic MathML '+block+'/'+inline);
 for(const id of ['right-bound-output','range-span','bound-value']){
  if(!document.getElementById(id)?.querySelector('math'))throw Error('Dynamic MathML absent '+id);
 }

 // Lektionsspecifik notation i förklarande elevtext. Längre samband väljs
 // före delsträngar; matematiken i knappar och SVG flyttas inte.
 const tokens=[
  'h′(x)=−2x+4','f″(a)=0','f″(x)=6x−9','f′(x)=0','f″(x)=0',
  'g′(x)=0','h′(x)=0','p′(x)=0','h″(x)', 'f″(x)','f″(0)','f″(3)',
  '3≤b≤5','0≤x≤5','x=−1','x=−2','x=0','x=1','x=2','x=4,5','x=3','x=5',
  'b = 4,5','b=4,5','f(−2)','f(0)','f(3)','f(5)',
  'h(0)','h(2)','h(5)','h(x)', 'g(x)','f(x)','p(x)',
  'f′', 'f″','g′','h′','h″','p′',
 ].sort((a,b)=>b.length-a.length);
 function typeset(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
  for(const node of nodes){
   if(node.parentElement.closest('math,svg,.mathline,.mathsmall,.math-inline,.method-math,.feedback-inline-math,button,option,script,style,textarea'))continue;
   const source=node.textContent,fragment=document.createDocumentFragment();
   let cursor=0,found=false;
   while(cursor<source.length){
    let at=Infinity,formula='';
    for(const token of tokens){
     const i=source.indexOf(token,cursor);
     if(i>=0&&(i<at||(i===at&&token.length>formula.length))){at=i;formula=token}
    }
    if(!formula){fragment.append(document.createTextNode(source.slice(cursor)));break}
    if(at>cursor)fragment.append(document.createTextNode(source.slice(cursor,at)));
    const span=document.createElement('span');span.className='feedback-inline-math';
    M.setFormula(span,formula,'inline');fragment.append(span);
    cursor=at+formula.length;found=true;
   }
   if(found)node.replaceWith(fragment);
  }
 }
 const stage=document.getElementById('stage');typeset(stage);
 // Den gemensamma sekvensmotorn uppdaterar nästa fråga vid varje knapptryck.
 for(const sequence of document.querySelectorAll('[data-sequence]')){
  const prompt=sequence.querySelector('[data-seq-prompt]');
  for(const control of sequence.querySelectorAll('[data-seq-next],[data-seq-back],[data-seq-reset]')){
   control.addEventListener('click',()=>typeset(prompt));
  }
 }

 const reveals=[...document.querySelectorAll('.slide [data-reveal]')].map(button=>({
  button,label:button.textContent,target:document.getElementById(button.dataset.reveal)
 }));
 for(const id of ['own-max-value','own-max-x','own-min-value','own-min-x']){
  document.getElementById(id).addEventListener('input',()=>{
   const feedback=document.getElementById('own-feedback');
   feedback.replaceChildren();feedback.className='feedback';
   if(!document.getElementById('own-answer').classList.contains('hidden')){
    document.querySelector('[data-reveal="own-answer"]').click();
   }
  });
 }
 function resetLearningState(){
  for(const {button,label,target} of reveals){
   target.classList.add('hidden');button.textContent=label;button.setAttribute('aria-expanded','false');
  }
  for(const sequence of document.querySelectorAll('[data-sequence]'))sequence.querySelector('[data-seq-reset]')?.click();
  for(const id of ['own-feedback','range-feedback']){
   const feedback=document.getElementById(id);feedback.replaceChildren();feedback.className='feedback';
  }
  for(const id of ['own-max-value','own-max-x','own-min-value','own-min-x'])document.getElementById(id).value='';
  document.getElementById('extrema-method-support').open=false;
  document.getElementById('right-bound').value='3';
  document.getElementById('right-bound').dispatchEvent(new Event('input',{bubbles:true}));
 }
 let currentSlide=document.querySelector('.slide.active')?.id;
 new MutationObserver(()=>{
  const now=document.querySelector('.slide.active')?.id;
  if(now!==currentSlide){currentSlide=now;resetLearningState()}
 }).observe(stage,{subtree:true,attributes:true,attributeFilter:['class']});
 document.getElementById('mode').addEventListener('click',resetLearningState);
 document.documentElement.dataset.globalExtremaMath='v23-ready';
})();
