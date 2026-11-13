/* Ma4 kapitel 4 · Matematisk typografi.
   Lokal MathML, inga externa skript, elevdata eller automatiskt genererade facit.
   Samma utseende kan återanvändas lektion för lektion. */
(()=>{'use strict';
const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const supMap={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'−','⁺':'+'};
const subMap={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
const operatorChars=new Set(['+','−','=','±','⇔','⇒','≥','≤','≠','∈','⋅','·','×','÷',':',',',';', '↔','>','<']);
const mo=value=>'<mo>'+esc(value)+'</mo>';
const mn=value=>'<mn>'+esc(value)+'</mn>';
const mi=value=>'<mi'+(['Re','Im','sin','cos','tan','eller'].includes(value)?' mathvariant="normal"':'')+'>'+esc(value)+'</mi>';
function typeFormula(source,display='block'){
 const raw=String(source).replaceAll('\u00a0',' ').replaceAll('ū','u\u0304').replaceAll('ā','a\u0304').replaceAll('—','−').replaceAll('–','−').replaceAll('->','⇒').replace(/\s+/g,' ').trim();
 const glyphs=Array.from(raw);let cursor=0;
 const isDigit=v=>v!==undefined&&/^[0-9]$/.test(v);
 const isLetter=v=>v!==undefined&&/^[a-zA-Z]$/.test(v);
 const isSup=v=>Object.prototype.hasOwnProperty.call(supMap,v);
 const isSub=v=>Object.prototype.hasOwnProperty.call(subMap,v);
 function suffix(base){
  if(glyphs[cursor]==='\u0304'){cursor++;base='<mover accent="true">'+base+mo('¯')+'</mover>'}
  const subs=[],sups=[];
  while(isSup(glyphs[cursor])||isSub(glyphs[cursor])){
   if(isSub(glyphs[cursor]))subs.push(subMap[glyphs[cursor++]]);
   else sups.push(supMap[glyphs[cursor++]]);
  }
  if(subs.length&&sups.length)base='<msubsup>'+base+mn(subs.join(''))+mn(sups.join(''))+'</msubsup>';
  else if(subs.length)base='<msub>'+base+mn(subs.join(''))+'</msub>';
  else if(sups.length)base='<msup>'+base+mn(sups.join(''))+'</msup>';
  return base;
 }
 function atom(){
  let c=glyphs[cursor++];
  if(c===undefined)return '';
  if(c===' '){return '<mspace width="0.18em"/>'}
  if(c==='('||c==='['||c==='{'){
   const end=c==='('?')':c==='['?']':'}';
   const middle=sequence(end);
   if(glyphs[cursor]===end)cursor++;
   return suffix('<mrow>'+mo(c)+middle+mo(end)+'</mrow>');
  }
  if(c==='|'){
   const middle=sequence('|');
   if(glyphs[cursor]==='|')cursor++;
   return suffix('<mrow>'+mo('|')+middle+mo('|')+'</mrow>');
  }
  if(c==='√'){
   while(glyphs[cursor]===' ')cursor++;
   let body='';
   if(glyphs[cursor]==='('){
    cursor++;body=sequence(')');if(glyphs[cursor]===')')cursor++;
   }else body=atom();
   return suffix('<msqrt>'+body+'</msqrt>');
  }
  if(isDigit(c)){
   while(isDigit(glyphs[cursor])||glyphs[cursor]==='.'||(glyphs[cursor]===','&&isDigit(glyphs[cursor+1]))){c+=glyphs[cursor++]}
   return suffix(mn(c));
  }
  if(isLetter(c)){
   while(isLetter(glyphs[cursor])&&['Re','Im','sin','cos','tan','eller'].some(word=>word.startsWith(c+glyphs[cursor]))){c+=glyphs[cursor++]}
   return suffix(mi(c));
  }
  if(c==='π'||c==='ℝ'||c==='ℤ')return suffix(mi(c));
  if(c==='…')return mo('…');
  return suffix(mo(c));
 }
 function sequence(end){
  const result=[];
  while(cursor<glyphs.length&&glyphs[cursor]!==end){
   const next=glyphs[cursor];
   if(operatorChars.has(next)){result.push(mo(next));cursor++;continue}
   if(next===' '){cursor++;continue}
   // A run of adjacent factors, such as 2√2 or (a+b), is one numerator.
   let factors=[];
   while(cursor<glyphs.length&&glyphs[cursor]!==end&&!operatorChars.has(glyphs[cursor])&&glyphs[cursor]!=='/'&&glyphs[cursor]!==' '){
    const before=cursor;factors.push(atom());if(cursor===before)break;
   }
   if(glyphs[cursor]==='/'){
    cursor++;
    while(glyphs[cursor]===' ')cursor++;
    let denominator=atom();
    // Denominator "2i" is a conventional product; keep it together when consecutive.
    while(cursor<glyphs.length&&glyphs[cursor]!==' '&&glyphs[cursor]!==end&&!operatorChars.has(glyphs[cursor])&&glyphs[cursor]!=='/'){
     denominator+=atom();
    }
    result.push('<mfrac><mrow>'+factors.join('')+'</mrow><mrow>'+denominator+'</mrow></mfrac>');
   }else result.push(factors.join(''));
  }
  return result.join('');
 }
 const parsed=sequence();
 return '<math xmlns="http://www.w3.org/1998/Math/MathML" display="'+display+'" aria-label="'+esc(raw)+'"><mrow>'+parsed+'</mrow></math>';
}
const eq=formula=>'<div class="ma4-equation">'+typeFormula(formula)+'</div>';
function step(title,lines=[],note=''){
 return '<section class="ma4-step"><h4>'+esc(title)+'</h4>'+lines.map(eq).join('')+(note?'<p class="ma4-note">'+esc(note)+'</p>':'')+'</section>';
}
const answer=(lines=[])=>'<div class="ma4-final"><span>SVAR</span>'+lines.map(eq).join('')+'</div>';
function solution(...parts){return '<div class="ma4-worked">'+parts.join('')+'</div>'}
function insertSolutions(data){
 for(const [id,markup] of Object.entries(data)){
  const el=document.getElementById(id);
  if(!el)throw new Error('Saknar matematisk lösning: '+id);
  el.innerHTML=markup;
  el.dataset.mathPresentation='true';
 }
}
function setFormula(el,formula,display='inline'){
 if(!el)return;
 el.innerHTML=typeFormula(formula,display);
 el.dataset.mathPresentation='true';
}
function typesetStatic(root=document){
 root.querySelectorAll('.slide .math').forEach(el=>{
  if(el.dataset.mathPresentation||el.id==='k-readout'||el.querySelector('strong,math,[data-math-presentation]'))return;
  const formula=el.textContent.trim();
  if(!formula||/^Uppgifter\s+\d/.test(formula))return;
  setFormula(el,formula,el.tagName==='SPAN'?'inline':'block');
 });
}
window.Ma4Math=Object.freeze({typeFormula,eq,step,answer,solution,insertSolutions,setFormula,typesetStatic});
})();