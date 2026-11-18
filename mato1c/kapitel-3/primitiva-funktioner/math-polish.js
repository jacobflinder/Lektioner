/* Ma3c 3.3: equations are independent semantic MathML blocks.
   Uses the course's existing local parser and adds real superscripts for e^(kx)
   and x^(n+1), instead of visually raised text. No remote dependencies. */
(()=>{'use strict';
const type=window.Ma4Math?.typeFormula;
if(!type)throw new Error('Saknar lokal matematisk sättning');
const inner=s=>{
 const result=type(s,'inline').match(/^<math[^>]*><mrow>([\s\S]*)<\/mrow><\/math>$/);
 if(!result)throw new Error('Kunde inte tolka formeln '+s);
 return result[1];
};
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function semantic(source){
 const pattern=/([a-zA-Z])\^\{([^{}]+)\}/g;
 let out='',last=0,match;
 while((match=pattern.exec(source))!==null){
  out+=inner(source.slice(last,match.index));
  out+='<msup><mi>'+escape(match[1])+'</mi><mrow>'+inner(match[2])+'</mrow></msup>';
  last=pattern.lastIndex;
 }
 out+=inner(source.slice(last));
 return '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="'+escape(source)+'"><mrow>'+out+'</mrow></math>';
}
for(const el of document.querySelectorAll('[data-formula]')){
 el.innerHTML=semantic(el.dataset.formula);
 el.dataset.mathPresentation='true';
}
})();
