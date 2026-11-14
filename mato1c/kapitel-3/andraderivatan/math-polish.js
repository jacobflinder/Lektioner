/* Lektion 16/41: lokalt semantiskt MathML utan externa anrop.
   Exponentialfunktionens e^(2x) skrivs med riktig sammansatt exponent. */
(()=>{'use strict';
 const M=window.Ma4Math;if(!M)throw Error('Lokalt MathML-stöd saknas');
 const expFactor='<msup><mi>e</mi><mrow><mn>2</mn><mi>x</mi></mrow></msup>';
 const expPattern=/^(g[′″]?\(x\))\s*=\s*(4|8|16)(?:\s*·\s*(2))?e2x$/;
 function escape(s){return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
 let exponentials=0,others=0;
 for(const el of document.querySelectorAll('.slide .math-fresh,.slide .solution-equation,.slide .solution-math-inline')){
  const raw=el.textContent.trim().replace(/\s+/g,' ');
  if(!raw)continue;
  if(el.querySelector('sup')){
   const match=raw.match(expPattern);
   if(!match)throw Error('Okänt exponentialuttryck: '+raw);
   const lhs=match[1],coefficient=match[2],factor=match[3];
   const expression=lhs+' = '+coefficient+(factor?' · '+factor:'')+'e^(2x)';
   const xml=M.typeFormula(lhs+' = '+coefficient+(factor?' · '+factor:''),'block');
   const math=xml.replace(/aria-label="[^"]*"/,'aria-label="'+escape(expression)+'"')
      .replace('</mrow></math>',expFactor+'</mrow></math>');
   if(math===xml||!math.includes('<msup><mi>e</mi>'))throw Error('Kunde inte formatera e^(2x)');
   el.innerHTML=math;el.dataset.mathPresentation='true';exponentials++;
  }else{
   M.setFormula(el,raw,el.tagName==='SPAN'?'inline':'block');
   others++;
  }
 }
 if(exponentials!==5)throw Error('Förväntade fem exponentialrader, fick '+exponentials);
 if(others<35)throw Error('För få semantiska uttryck: '+others);
 document.documentElement.dataset.andraderivatanMathMl='ready';
})();
