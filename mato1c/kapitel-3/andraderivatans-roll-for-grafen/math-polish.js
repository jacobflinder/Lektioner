/* Granskning v2.3, 36/41. All synlig algebra, även frågetext, svarsalternativ,
 * återkoppling och grafvärden, presenteras som semantisk MathML. Ingen lagring. */
(()=>{'use strict';
const M=window.Ma4Math;if(!M)throw Error('Andraderivatans lokala MathML-stöd saknas');
const dynamic=new Set(['inflect-y','inflect-slope','inflect-second','compare-x-out','compare-f-readout','compare-g-readout','inflect-x-out']);
let staticCount=0,inlineCount=0;
for(const el of document.querySelectorAll('.slide .math-display,.slide .inline-math')){
 if(dynamic.has(el.id))continue;
 if(el.querySelector('math'))continue;
 const formula=el.textContent.trim().replace(/\s+/g,' ');
 if(!formula)continue;
 const inline=!['P','DIV'].includes(el.tagName);
 M.setFormula(el,formula,inline?'inline':'block');
 if(inline)inlineCount++;else staticCount++;
}
if(staticCount<47||inlineCount<25)throw Error('För få semantiska matematikblock: '+staticCount+' och '+inlineCount);
for(const id of dynamic)if(!document.getElementById(id)?.querySelector('math'))throw Error('Saknar dynamisk MathML '+id);

// Avgränsade formeluttryck ur lektionens frågor/val/återkoppling; all omgivande
// förklarande text är oförändrad. Längsta träffen väljs vid överlapp.
const formulas=[
 'f′(a)=f″(a)=0','f′(3)=0','f″(3)=4>0','f″(3)=4','f′(2)=0','f″(2)=−5','f″(2)<0',
 'f′(x)=2x','g′(x)=−2x','f″=2>0','g″=−2<0','f″ > 0','g″ < 0','f″ < 0','g″ > 0','f″ = 0',
 'p′(−1)=3','p′(1)=3','q′(−1)=−4','q′(1)=4','p′=3x²','q′=4x³','q″(x)=12x²',
 'q″(−1)','q″(1)','q″(0)=0','f′(a)=0','f″(a)=0','f′(a)','f″(a)',
 'f″(3)','f′(3)','f(3)','f(2)','q(x)=x⁴','x=2','x³','x⁴','12>0','f″','f′'
].sort((a,b)=>b.length-a.length);
function replaceTextFormulas(root){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
 for(const node of nodes){
  if(node.parentElement.closest('math'))continue;
  const source=node.textContent;let pos=0,found=false;
  const fragment=document.createDocumentFragment();
  while(pos<source.length){
   let at=Infinity,token='';
   for(const formula of formulas){const i=source.indexOf(formula,pos);if(i>=0&&(i<at||(i===at&&formula.length>token.length))){at=i;token=formula}}
   if(!token){fragment.append(document.createTextNode(source.slice(pos)));break}
   if(at>pos)fragment.append(document.createTextNode(source.slice(pos,at)));
   const span=document.createElement('span');span.className='quiz-inline-math';
   M.setFormula(span,token,'inline');fragment.append(span);pos=at+token.length;found=true;
  }
  if(found)node.replaceWith(fragment);
 }
}
for(const box of document.querySelectorAll('.slide [data-quiz]')){
 for(const el of box.querySelectorAll('strong,button[data-correct]'))replaceTextFormulas(el);
 for(const choice of box.querySelectorAll('button[data-correct]'))choice.addEventListener('click',()=>{
  const feedback=box.querySelector('.feedback');replaceTextFormulas(feedback);
 });
}
const revealButtons=[...document.querySelectorAll('.slide [data-reveal]')].map(button=>({
 button,label:button.textContent,target:document.getElementById(button.dataset.reveal)
}));
function resetLearningState(){
 for(const {button,label,target} of revealButtons){
  if(button.dataset.reveal==='inflect-answer'&&!target.classList.contains('hidden'))button.click();
  target.classList.add('hidden');button.textContent=label;button.setAttribute('aria-expanded','false');
 }
 for(const box of document.querySelectorAll('.slide [data-sequence]'))box.querySelector('[data-seq-reset]')?.click();
 for(const box of document.querySelectorAll('.slide [data-quiz]')){
  for(const choice of box.querySelectorAll('button[data-correct]')){
   choice.classList.remove('correct','wrong');choice.setAttribute('aria-pressed','false');
  }
  const feedback=box.querySelector('.feedback');feedback.replaceChildren();feedback.className='feedback';
 }
 const own=document.getElementById('own-feedback');own.replaceChildren();own.className='feedback';
 document.getElementById('graph-method-support').open=false;
}
let lastActive=document.querySelector('.slide.active')?.id;
new MutationObserver(()=>{
 const active=document.querySelector('.slide.active')?.id;
 if(active!==lastActive){lastActive=active;resetLearningState()}
}).observe(document.getElementById('stage'),{subtree:true,attributes:true,attributeFilter:['class']});
document.getElementById('mode').addEventListener('click',resetLearningState);
document.documentElement.dataset.secondGraphMath='ready';
})();
