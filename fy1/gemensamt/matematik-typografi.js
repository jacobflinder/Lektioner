/* Typografisk matematik: native MathML, ingen extern tjänst och inga elevdata. */
(function fy1MathTypography(){
'use strict';
const NS='http://www.w3.org/1998/Math/MathML';
const enabled=new Set(['coulombs-lag','elektriska-kretsar']);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const superscript={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'−','⁺':'+'};
const subscript={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','ₑ':'e','ᵣ':'r','ₛ':'s'};
const units=new Set(['A','V','C','Ω','N','J','W','s','m','mm','cm','nm','kg','Ah','nC','µN','kN','mA']);
const element=(tag,inner)=>'<'+tag+'>'+inner+'</'+tag+'>';
function splitOutside(s,operators){
 let level=0,out=[],last=0;
 for(let i=0;i<s.length;i++){
    if(s[i]==='(')level++;else if(s[i]===')')level--;
    else if(level===0&&operators.includes(s[i])){out.push(s.slice(last,i),s[i]);last=i+1;}
 }
 out.push(s.slice(last));return out;
}
function atomic(src){
 const chunks=src.match(/\d+(?:[,.]\d+)?(?:\s\d{3})*|[₀-₉ₑᵣₛ]+|[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+|[\p{L}ℰµΩ]+|\s+|./gu)||[];
 const parts=[];let prev='start';
 for(const c of chunks){
   if(/^\s+$/.test(c)){prev='space';continue;}
   if(/^\d/.test(c)){parts.push(element('mn',esc(c.trim())));prev='number';continue;}
   if(/^[₀-₉ₑᵣₛ]+$/.test(c)){const n=[...c].map(x=>subscript[x]||x).join('');if(parts.length)parts[parts.length-1]=element('msub',parts[parts.length-1]+element('mrow',esc(n)));else parts.push(element('mn',esc(n)));prev='sub';continue;}
   if(/^[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+$/.test(c)){const n=[...c].map(x=>superscript[x]||x).join('');if(parts.length)parts[parts.length-1]=element('msup',parts[parts.length-1]+element('mrow',esc(n)));else parts.push(element('mn',esc(n)));prev='sup';continue;}
   if(/^[\p{L}ℰµΩ]+$/u.test(c)){
     if(units.has(c)&&['number','sup','space'].includes(prev)){parts.push('<mspace width="0.17em"/>'+element('mtext',esc(c)));prev='unit';continue;}
     if(c.length>3){parts.push(element('mtext',esc(c)));prev='word';continue;}
     for(const ch of [...c])parts.push(element('mi',esc(ch)));
     prev='symbol';continue;
   }
   parts.push(element('mo',esc(c)));prev='operator';
 }
 return parts.join('');
}
function layout(text){
 const s=text.trim();if(!s)return '';
 // A product such as π(d/2)² keeps the exponent attached to the parentheses.
 if(/^[πρ]\(/u.test(s))return element('mrow',element('mi',esc(s[0]))+layout(s.slice(1)));
 if(s[0]==='('){
   let level=0,end=-1;
   for(let i=0;i<s.length;i++){if(s[i]==='(')level++;if(s[i]===')'){level--;if(level===0){end=i;break;}}}
   if(end===s.length-1)return element('mrow',element('mo','(')+layout(s.slice(1,-1))+element('mo',')'));
   if(end>0&&/^[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+$/.test(s.slice(end+1))){
      return element('msup',element('mrow',element('mo','(')+layout(s.slice(1,end))+element('mo',')'))+element('mn',[...s.slice(end+1)].map(c=>superscript[c]).join('')));
   }
 }
 for(const ops of [['=','≈','∝'],['+','−'],['·','×'],['/']]){
   const parts=splitOutside(s,ops);if(parts.length===1)continue;
   if(ops[0]==='/'){
     const at=parts.indexOf('/');
     if(at>=0)return element('mfrac',element('mrow',layout(parts.slice(0,at).join('')))+element('mrow',layout(parts.slice(at+1).join(''))));
   }
   return element('mrow',parts.map((p,i)=>i%2?element('mo',esc(p)):layout(p)).join(''));
 }
 return element('mrow',atomic(s));
}
function mathHTML(text){return '<math xmlns="'+NS+'" class="fy1-typeset" display="inline"><semantics>'+layout(text)+'<annotation encoding="application/x-tex">'+esc(text)+'</annotation></semantics></math>';}
const atom=String.raw`(?:[πρ]\([^()]{1,82}\)[⁰¹²³⁴⁵⁶⁷⁸⁹]*|\([^()]{1,82}\)[⁰¹²³⁴⁵⁶⁷⁸⁹]*|\d+(?:[,.]\d+)?[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]*|[A-Za-zℰρπµΩ][A-Za-zℰρπµΩ₀-₉ₑᵣₛ⁰¹²³⁴⁵⁶⁷⁸⁹⁻]*)`;
const term=String.raw`[+−-]?${atom}(?:\s*[+−·×/-]\s*${atom})*`;
const unit=String.raw`(?:\s+(?:N·m²/C²|Ω·mm²/m|(?:m|mm|cm)/s²|(?:kg|Ah|mm²|[kµmn]?A|V|C|Ω|N|J|W|s|m|mm|cm|nm)))?`;
const equation=new RegExp(String.raw`(?<![\p{L}\p{N}₀-₉])${term}${unit}(?:\s*(?:=|≈|∝)\s*${term}${unit})+`,'gu');
const fractions=/(?<![\p{L}\p{N}])(?:\|Q₁Q₂\|\/r²|F₀\/4|R\/4|[23]\/[24]|N·m²\/C²)/gu;
const quantities=/(?<![\p{L}\p{N}₀-₉])[+−-]?\d+(?:[,.]\d+)?(?:\s*·\s*10[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)?\s*(?:kg|Ah|mm²|[kµmn]?A|V|C|Ω|N|J|W|s|m|mm|cm|nm)(?![\p{L}])/gu;
function findMath(text){
 const found=[];
 for(const [re,kind] of [[equation,'equation'],[fractions,'fraction'],[quantities,'quantity']]){
    re.lastIndex=0;let match;while((match=re.exec(text))){
      if(kind==='equation'){
       const lhs=match[0].split(/[=≈∝]/)[0].trim();
       if(!/^(?:[+−(-]?\d|[A-Zℰρπ]|[eikqrltad])/.test(lhs))continue;
       if(/^[a-z]{2,}$/u.test(lhs))continue;
      }
      found.push({from:match.index,to:match.index+match[0].length,value:match[0],kind});
    }
 }
 const ranks={equation:0,fraction:1,quantity:2};
 found.sort((a,b)=>a.from-b.from||ranks[a.kind]-ranks[b.kind]||b.to-a.to);
 let end=0;return found.filter(x=>{if(x.from<end)return false;end=x.to;return true;});
}
if(typeof document==='undefined')return {layout,mathHTML,findMath};
if(!enabled.has(document.body?.dataset.fy1Lesson))return;
function typeset(node){
 if(!node?.isConnected)return;
 if(node.nodeType===3){
   const parent=node.parentElement;
   if(!parent||parent.closest('math,svg,script,style,textarea,code,[contenteditable]')||!parent.closest('#stage,#fy1-traning-dialog'))return;
   const value=node.nodeValue||'',pieces=findMath(value);if(!pieces.length)return;
   const fragment=document.createDocumentFragment();let offset=0;
   for(const part of pieces){
      if(part.from>offset)fragment.append(document.createTextNode(value.slice(offset,part.from)));
      const template=document.createElement('template');template.innerHTML=mathHTML(part.value);
      fragment.append(template.content);offset=part.to;
   }
   if(offset<value.length)fragment.append(document.createTextNode(value.slice(offset)));
   node.replaceWith(fragment);return;
 }
 if(node.nodeType!==1&&node.nodeType!==11)return;
 if(node.nodeType===1&&node.matches('math,svg,script,style,textarea,code,[contenteditable]'))return;
 const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT),textNodes=[];
 while(walker.nextNode())textNodes.push(walker.currentNode);
 textNodes.forEach(typeset);
}
typeset(document.querySelector('#stage'));
typeset(document.querySelector('#fy1-traning-dialog'));
new MutationObserver(records=>{
 const added=new Set();
 for(const record of records){
   if(record.type==='characterData')added.add(record.target);
   else for(const node of record.addedNodes)added.add(node);
 }
 for(const item of added)typeset(item);
}).observe(document.body,{childList:true,subtree:true,characterData:true});
window.Fy1MathTypography={typeset};
})();
