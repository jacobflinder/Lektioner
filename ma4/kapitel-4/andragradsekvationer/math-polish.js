/* Ma4 4.4 Andragradsekvationer: finputsa även de statiska matematikraderna.
   Klickbart facit renderas oförändrat av math-format.js före denna modul.
   Ingen nätverksåtkomst, elevdata eller ändrad återkopplingsordning. */
(()=>{'use strict';
const M=window.Ma4Math;
if(!M)throw new Error('MathML-stöd saknas för andragradsekvationer');
const literal=(value)=>String(value).replaceAll('\u00a0',' ').replace(/\s+/g,' ').trim();
const expression=el=>literal(el.textContent);
const mathBlocks=Array.from(document.querySelectorAll('.slide .math')).filter(el=>!el.querySelector('math,strong,.worked-math')&&!el.dataset.mathTypeset);
for(const el of mathBlocks){
 const brs=el.querySelectorAll('br');
 if(brs.length){
  // Koden före varje <br> är ett eget matematiskt led.
  const doc=document.createElement('div');doc.innerHTML=el.innerHTML;
  const items=[];let current='';
  for(const node of Array.from(doc.childNodes)){
   if(node.nodeName==='BR'){if(current.trim())items.push(literal(current));current='';}
   else current+=node.textContent||'';
  }
  if(current.trim())items.push(literal(current));
  if(!items.length)continue;
  const html=items.flatMap(item=>{
    const split=item.split(/\s+eller\s+/);
    return split.map(M.eq);
  }).join('');
  const replacement=document.createElement('div');
  replacement.className=el.className+' math-polish-lines';
  replacement.dataset.mathPresentation='true';
  replacement.innerHTML=html;
  el.replaceWith(replacement);
  continue;
 }
 const text=expression(el);
 if(!text||text.includes('Uppgifter 4401–4420'))continue;
 // Bild 7 innehåller en avsiktlig ofullständig uträkning – visa den som sådan.
 M.setFormula(el,text,el.tagName==='SPAN'?'inline':'block');
}
})();