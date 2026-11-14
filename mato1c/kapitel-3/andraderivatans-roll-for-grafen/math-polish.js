/* Ma3c 17/41: lokal semantisk MathML; inget elevsvar skickas eller sparas.
 * Dynamiska figurers tre numeriska formelvärden uppdateras i lesson.js.
 * Den fixerade uppgiften skrivs som fristående math-block, aldrig som
 * hopslagna "p'(0)=0, p''(0)=0" eller signföljder på en rad. */
(()=>{'use strict';
const M=window.Ma4Math;if(!M)throw Error('Andraderivatans lokala MathML-stöd saknas');
const dynamic=new Set(['inflect-y','inflect-slope','inflect-second']);
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
if(staticCount<37||inlineCount<25)throw Error('För få semantiska matematikblock: '+staticCount+' och '+inlineCount);
for(const id of dynamic)if(!document.getElementById(id)?.querySelector('math[display="block"]'))throw Error('Saknar dynamisk MathML '+id);
document.documentElement.dataset.secondGraphMath='ready';
})();
