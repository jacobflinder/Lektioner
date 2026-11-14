/* Ma3c 19/41: locally rendered semantic MathML, no students tracked. */
(()=>{'use strict';
 const M=window.Ma4Math;if(!M)throw Error('Ma3c19 MathML support missing');
 let block=0,inline=0;
 for(const el of document.querySelectorAll('.slide .mathline,.slide .mathsmall,.slide .math-inline')){
  if(el.querySelector('math'))continue;
  const text=el.textContent.trim().replace(/\s+/g,' ');
  if(!text)continue;
  const isInline=el.matches('.mathsmall,.math-inline');
  M.setFormula(el,text,isInline?'inline':'block');
  isInline?inline++:block++;
 }
 if(block<60||inline<10)throw Error('Too little semantic MathML '+block+'/'+inline);
 for(const id of ['right-bound-output','bound-value'])if(!document.getElementById(id)?.querySelector('math'))throw Error('Dynamic MathML absent '+id);
 document.documentElement.dataset.globalExtremaMath='ready';
})();