/* Ma3c 18/41: semantic MathML, no remote requests or stored answers. */
(()=>{'use strict';
 const M=window.Ma4Math;if(!M)throw Error('Ma3c 18: no MathML engine');
 let blocks=0,inline=0;
 for(const el of document.querySelectorAll('.slide .math-work,.slide .math-sm')){
  if(el.querySelector('math'))continue;
  const f=el.textContent.trim().replace(/\s+/g,' ');
  if(!f)continue;
  const isInline=el.classList.contains('math-sm');
  M.setFormula(el,f,isInline?'inline':'block');
  if(isInline)inline++;else blocks++;
 }
 if(blocks<35||inline<25)throw Error('MathML coverage low '+blocks+'/'+inline);
 for(const id of ['linked-x-value','val-f','val-d1','val-d2','shift-c-output','shift-description']){
  if(!document.getElementById(id)?.querySelector('math'))throw Error('Dynamic MathML missing '+id);
 }
 document.documentElement.dataset.threeGraphsMath='ready';
})();