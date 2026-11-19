/* v2.3, lektion 37/41: synlig semantisk MathML i beräkningar, frågor och
 * diagnostiska meddelanden. Ingen lagring eller externa anrop. */
(()=>{'use strict';
 const M=window.Ma4Math;if(!M)throw Error('Ma3c 18: no MathML engine');
 let blocks=0,inline=0;
 for(const el of document.querySelectorAll('.slide .math-work,.slide .math-sm,.slide .method-math')){
  if(el.querySelector('math'))continue;
  const formula=el.textContent.trim().replace(/\s+/g,' ');
  if(!formula)continue;
  const isInline=el.classList.contains('math-sm');
  M.setFormula(el,formula,isInline?'inline':'block');
  if(isInline)inline++;else blocks++;
 }
 if(blocks<42||inline<25)throw Error('MathML coverage low '+blocks+'/'+inline);
 for(const id of ['linked-x-value','val-f','val-d1','val-d2','shift-c-output','shift-description']){
  if(!document.getElementById(id)?.querySelector('math'))throw Error('Dynamic MathML missing '+id);
 }

 // Matematiska uttryck i annars löpande elevtext. Längsta match väljs så att
 // exempelvis f′(x)=2x−4 inte blir ett ensamt f′ följt av råa tecken.
 const tokens=[
  'h′(x)=(x−1)(x−3)','f′(x)=2x−4','f′(x)=0','f′(4)=1','f″(4)=0',
  'f″(x)=2','f″=2','f′=1','2x−4=0','2x=4','f′(x)>0','f′(x)<0',
  'x = 0','x = 1','x = 2','x = 3','x = 4','x = 6','x=1','x=2','x=3','x=4','x=6',
  'x<1','x<2','x<4','x>2','x>3','x>4','x>6','2<x<6','1<x<3',
  'f″(x)','f′(x)','h″(x)','h′(x)','f″','f′','g″','g′','h″','h′',
  'C = 3','C=3'
 ].sort((a,b)=>b.length-a.length);
 function typeset(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
  for(const node of nodes){
   if(node.parentElement.closest('math,svg,.math-work,.math-sm,.method-math,button,option,script,style,textarea'))continue;
   const original=node.textContent,fragment=document.createDocumentFragment();let cursor=0,found=false;
   while(cursor<original.length){
    let first=Infinity,formula='';
    for(const token of tokens){
     const i=original.indexOf(token,cursor);
     if(i>=0&&(i<first||(i===first&&token.length>formula.length))){first=i;formula=token}
    }
    if(!formula){fragment.append(document.createTextNode(original.slice(cursor)));break}
    if(first>cursor)fragment.append(document.createTextNode(original.slice(cursor,first)));
    const holder=document.createElement('span');holder.className='feedback-inline-math';
    M.setFormula(holder,formula,'inline');fragment.append(holder);
    found=true;cursor=first+formula.length;
   }
   if(found)node.replaceWith(fragment);
  }
 }
 // Även återkopplingen från lesson.js typsätts efter varje rätt/felbeslut.
 window.ThreeGraphsMath={typeset};
 typeset(document.getElementById('stage'));

 const revealButtons=[...document.querySelectorAll('.slide [data-reveal]')].map(button=>({
  button,label:button.textContent,target:document.getElementById(button.dataset.reveal)
 }));
 function resetLearningState(){
  for(const {button,label,target} of revealButtons){
   target.classList.add('hidden');button.textContent=label;button.setAttribute('aria-expanded','false');
  }
  for(const seq of document.querySelectorAll('.slide [data-sequence]'))seq.querySelector('[data-seq-reset]')?.click();
  for(const id of ['class-feedback','own-feedback']){
   const out=document.getElementById(id);out.replaceChildren();out.className='feedback';
  }
  for(const id of ['class-2','class-4','class-6','own-shape'])document.getElementById(id).value='';
  for(const id of ['own-root','own-second'])document.getElementById(id).value='';
  document.getElementById('graph-method-support').open=false;
  document.getElementById('linked-x').value='2';
  document.getElementById('linked-x').dispatchEvent(new Event('input',{bubbles:true}));
  document.getElementById('shift-c').value='3';
  document.getElementById('shift-c').dispatchEvent(new Event('input',{bubbles:true}));
 }
 let lastActive=document.querySelector('.slide.active')?.id;
 new MutationObserver(()=>{
  const current=document.querySelector('.slide.active')?.id;
  if(current!==lastActive){lastActive=current;resetLearningState()}
 }).observe(document.getElementById('stage'),{subtree:true,attributes:true,attributeFilter:['class']});
 document.getElementById('mode').addEventListener('click',resetLearningState);
 document.documentElement.dataset.threeGraphsMath='ready';
})();
