/* Ma3c 20/41 – local MathML without network, personal data or tracking. */
(()=>{'use strict';
 const M=window.Ma4Math;if(!M)throw Error('Ma3c20 MathML renderer absent');
 let block=0,inline=0;
 for(const node of document.querySelectorAll('.slide .mathline,.slide .mathsmall')){
  if(node.querySelector('math'))continue;
  const formula=node.textContent.trim().replace(/\s+/g,' ');
  if(!formula)continue;
  const small=node.matches('.mathsmall');
  M.setFormula(node,formula,small?'inline':'block');
  small?inline++:block++;
 }
 if(block<60||inline<3)throw Error('Ma3c20 too few semantic math nodes '+block+'/'+inline);
 document.documentElement.dataset.realWorldExtremaMath='ready';
})();