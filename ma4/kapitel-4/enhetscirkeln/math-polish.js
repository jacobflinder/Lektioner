/* Semantisk matematik för oberoende ekvationer, inga externa anrop.
   Dynamiska axeluttryck renderas av understand.js efter varje val. */
(()=>{'use strict';
const M=window.Ma4Math;
if(!M)throw Error('MathML-formateraren till enhetscirkeln saknas');
const nodes=[...document.querySelectorAll('.unit-math-block')];
if(nodes.length!==12)throw Error('Oväntat antal matematiska block: '+nodes.length);
for(const el of nodes)M.setFormula(el,el.textContent.trim(),'block');
})();
