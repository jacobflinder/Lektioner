/* Ma3c 22/41 – verified mathematical steps and semantic MathML.
   Local, no third-party requests, no student data.
   Keep all original student tasks, book numbers, teacher decisions and controls. */
(()=>{'use strict';
const M=window.Ma4Math;
if(!M)throw Error('Ma3c22: MathML engine missing');
const $=q=>document.querySelector(q);
const expr=x=>'<p class="mathline">'+x+'</p>';
const work=xs=>'<div class="solution-math-group">'+xs.map(x=>x==='eller'?'<p class="solution-explanation">eller</p>':expr(x)).join('')+'</div>';
const replaceStep=(slide,sequence,idx,markup)=>{
 const step=document.querySelectorAll('#'+slide+' [data-sequence]')[sequence]?.querySelectorAll('[data-seq-item]')[idx];
 if(!step)throw Error('Ma3c22: missing '+slide+' sequence '+sequence+' step '+idx);
 step.innerHTML=markup;
};
// 2: Distinguish the two applications of the chain rule and their dimensions.
replaceStep('goal',0,0,'<strong>1 · Vattenmängden</strong>'+work([
 'V(t)=120(1−e<sup>−0,2t</sup>)','V(t)=120−120e<sup>−0,2t</sup>'
 ])+'<p>V mäts i <strong>liter</strong>. Funktionen beskriver mängd, inte inflöde.</p>');
replaceStep('goal',0,1,'<strong>2 · Inflödet</strong>'+
 '<p>Derivera exponentialfunktionen med den inre derivatan −0,2:</p>'+
 work(['V′(t)=−120·(−0,2)e<sup>−0,2t</sup>','V′(t)=24e<sup>−0,2t</sup>'])+
 '<p>V′ mäts i <strong>liter/min</strong>. Denna derivata är positiv för alla t≥0.</p>');
replaceStep('goal',0,2,'<strong>3 · Inflödets förändring</strong>'+
 work(['V″(t)=24·(−0,2)e<sup>−0,2t</sup>','V″(t)=−4,8e<sup>−0,2t</sup>'])+
 '<p>V″ mäts i <strong>liter/min²</strong> och är negativ. Mängden växer fortfarande, men dess ökningstakt avtar.</p>');
// 4: Show actual substituted times and units. Final distinction only in step 4.
replaceStep('water-feedback',0,0,'<strong>1 · Mängden efter fem minuter</strong>'+
 work(['V(5)=120(1−e<sup>−0,2·5</sup>)','V(5)=120(1−e<sup>−1</sup>)','V(5)≈75,85'])+
 '<p>Det finns cirka <strong>75,9 liter</strong> i behållaren efter fem minuter.</p>');
replaceStep('water-feedback',0,1,'<strong>2 · Inflödet just då</strong>'+
 work(['V′(t)=24e<sup>−0,2t</sup>','V′(5)=24e<sup>−0,2·5</sup>','V′(5)=24e<sup>−1</sup>','V′(5)≈8,83'])+
 '<p>Mängden ökar vid fem minuter med cirka <strong>8,83 liter/min</strong>.</p>');
replaceStep('water-feedback',0,2,'<strong>3 · Förändringen av inflödet</strong>'+
 work(['V″(t)=−4,8e<sup>−0,2t</sup>','V″(5)=−4,8e<sup>−1</sup>','V″(5)≈−1,77'])+
 '<p>Inflödet minskar momentant med ungefär <strong>1,77 liter/min²</strong>. Det negativa tecknet innebär inte att vattenmängden minskar.</p>');
replaceStep('water-feedback',0,3,'<strong>4 · Störst inflöde, men inget största vattenvärde</strong>'+
 '<p>Exponentialfaktorn är strikt positiv för varje ändlig t:</p>'+
 work(['e<sup>−0,2t</sup>>0','V″(t)=−4,8e<sup>−0,2t</sup><0'])+
 '<p>Därför är V′ avtagande på t≥0; största inflödet nås <strong>vid start</strong>:</p>'+
 work(['V′(0)=24e<sup>0</sup>','V′(0)=24'])+
 '<p>Största inflödet är <strong>24 liter/min</strong>. Men V(t) växer hela tiden, eftersom V′ är positiv:</p>'+
 work(['V(t)=120−120e<sup>−0,2t</sup>','e<sup>−0,2t</sup>>0',
 'V(t)<120'])+
 '<p>När t→∞ går exponentfaktorn mot noll och V(t) mot <strong>120 liter</strong>. 120 är ett övre gränsvärde, men <strong>inget största vattenvärde antas vid någon ändlig tid</strong>.</p>');
// 6: Root derivative and tangent, each algebraic step explicit.
replaceStep('robot-feedback',0,0,'<strong>1 · Hastighet</strong>'+
 work(['s(t)=12√(t+1)−12',
 's(t)=12(t+1)<sup>1/2</sup>−12',
 's′(t)=12·(1/2)(t+1)<sup>−1/2</sup>',
 's′(t)=6/√(t+1)',
 's′(3)=6/√(3+1)','s′(3)=6/2','s′(3)=3'])+
 '<p>Momentanhastigheten efter tre sekunder är <strong>3 m/s</strong>.</p>');
replaceStep('robot-feedback',0,1,'<strong>2 · Acceleration</strong>'+
 work(['s′(t)=6(t+1)<sup>−1/2</sup>',
 's″(t)=6·(−1/2)(t+1)<sup>−3/2</sup>',
 's″(t)=−3(t+1)<sup>−3/2</sup>',
 's″(3)=−3·4<sup>−3/2</sup>',
 's″(3)=−3/8','s″(3)=−0,375'])+
 '<p>Den momentana accelerationen är <strong>−0,375 m/s²</strong>: roboten rör sig framåt men dess hastighet minskar.</p>');
replaceStep('robot-feedback',0,2,'<strong>3 · Största hastigheten</strong>'+
 '<p>Det som efterfrågas är maximum av <em>hastigheten</em> s′(t), inte sträckan s(t). Kontrollera därför tecknet hos s″:</p>'+
 work(['s″(t)=−3(t+1)<sup>−3/2</sup><0','0≤t≤8',
 's′(0)=6/√(0+1)','s′(0)=6'])+
 '<p>Hastigheten minskar på hela intervallet. Den är alltså störst vid den tillåtna vänsterändpunkten <strong>t=0 s</strong> och är då <strong>6 m/s</strong>.</p>');
replaceStep('robot-feedback',0,3,'<strong>4 · Tangent och lokal approximation</strong>'+
 work(['s(3)=12√(3+1)−12','s(3)=12·2−12','s(3)=12',
 's′(3)=3','y−12=3(t−3)','y=12+3(t−3)','y=3t+3'])+
 '<p>Tangenten tangerar sträckans graf i <strong>(3 s, 12 m)</strong> och har lutningen 3 m/s.</p>'+
 work(['s(3,1)≈12+3·(3,1−3)','s(3,1)≈12,3'])+
 '<p>Detta är en <strong>lokal linjär approximation</strong> nära t=3 och har enheten meter, inte ett exakt funktionsvärde.</p>');
// 8: A stationary point requires both condition and classification.
replaceStep('conditions-feedback',0,0,'<strong>Villkoret</strong>'+
 work(['f(x)=x³+ax','f′(x)=3x²+a','f′(2)=0','3·2²+a=0','12+a=0','a=−12'])+
 '<p>Derivatan noll ger en <em>kandidat</em>; vi måste fortfarande kontrollera om punkten verkligen är ett minimum.</p>');
replaceStep('conditions-feedback',0,1,'<strong>Klassificera</strong>'+
 work(['f″(x)=6x','f″(2)=6·2','f″(2)=12>0'])+
 '<p>Andraderivatan är positiv. Alltså en <strong>lokal minimipunkt</strong> vid x=2. För den kubiska funktionen på hela reella tallinjen finns inte något globalt minimum.</p>');
replaceStep('conditions-feedback',0,2,'<strong>Beräkna koordinaten</strong>'+
 work(['f(x)=x³−12x','f(2)=2³−12·2','f(2)=8−24','f(2)=−16'])+
 '<p>Minimipunkten är <strong>(2, −16)</strong>.</p>');
replaceStep('conditions-feedback',1,0,'<strong>Stationära x</strong>'+
 work(['g′(x)=(x−1)(x−3)²','g′(x)=0','x−1=0',
 'x=1','eller','(x−3)²=0','x=3'])+
 '<p>En dubbelrot är fortfarande ett stationärt x, men inte nödvändigtvis en extrempunkt.</p>');
replaceStep('conditions-feedback',1,1,'<strong>Teckenundersökning</strong>'+
 '<p>För x≠3 är (x−3)² strikt positiv. g′ får därför tecken efter x−1. Testa ett tal i varje intervall:</p>'+
 work(['g′(0)=(0−1)(0−3)²=−9<0',
 'g′(2)=(2−1)(2−3)²=1>0',
 'g′(3,5)=(3,5−1)(3,5−3)²=0,625>0'])+
 '<p>g′ är negativ före 1 och positiv i båda intervallen <strong>1&lt;x&lt;3</strong> och <strong>x&gt;3</strong>.</p>');
replaceStep('conditions-feedback',1,2,'<strong>Klassificera</strong>'+
 '<p>Vid x=1 byter g′ tecken från <strong>− till +</strong> och g har en lokal <strong>minimipunkt</strong>.</p>'+
 '<p>Vid x=3 är g′ noll men positiv på <strong>båda sidor</strong>. Där finns ingen maximi- eller minimipunkt. Vi undersöker separat om tangenten är horisontell i en inflexionspunkt.</p>');
replaceStep('conditions-feedback',1,3,'<strong>Terrasspunkten</strong>'+
 '<p>Derivera det givna uttrycket med produktregeln:</p>'+
 work(['g′(x)=(x−1)(x−3)²',
 'g″(x)=(x−3)²+2(x−1)(x−3)',
 'g″(x)=(x−3)((x−3)+2(x−1))',
 'g″(x)=(x−3)(3x−5)',
 'g″(2,5)=−1,25<0','g″(3,5)=2,75>0',
 'g′(3)=0'])+
 '<p>Andraderivatan byter tecken vid x=3 samtidigt som g′(3)=0. Det är en <strong>terrasspunkt</strong> (stationär inflexionspunkt). g(x) är inte specificerad, så dess <strong>y-koordinat kan inte bestämmas</strong>.</p>');
// 11: Both exits are independent and keep only originally requested tasks.
replaceStep('exit-feedback',0,0,'<strong>Startens ökningstakt</strong>'+
 work(['M(t)=50−50e<sup>−0,1t</sup>',
 'M′(t)=−50·(−0,1)e<sup>−0,1t</sup>',
 'M′(t)=5e<sup>−0,1t</sup>',
 'M′(0)=5e<sup>0</sup>','M′(0)=5'])+
 '<p>I början ökar mängden momentant med <strong>5 g/min</strong>.</p>');
replaceStep('exit-feedback',0,1,'<strong>Största ökningstakten</strong>'+
 work(['M″(t)=5·(−0,1)e<sup>−0,1t</sup>',
 'M″(t)=−0,5e<sup>−0,1t</sup><0'])+
 '<p>M′ är därför avtagande för hela t≥0. Dess <strong>största värde är 5 g/min</strong> vid start, t=0 min.</p>');
replaceStep('exit-feedback',0,2,'<strong>Gränsvärdet är inget största värde</strong>'+
 work(['M(t)=50−50e<sup>−0,1t</sup>',
 'e<sup>−0,1t</sup>>0','M(t)<50'])+
 '<p>När t→∞ går exponentialtermen mot 0 och M(t) närmar sig <strong>50 g underifrån</strong>. Värdet 50 g <strong>antas inte</strong> vid någon ändlig tid.</p>');
replaceStep('exit-feedback',1,0,'<strong>Översätt villkoret</strong>'+
 work(['h(x)=x²+bx','h′(x)=2x+b','h′(1)=0',
 '2·1+b=0','2+b=0','b=−2'])+
 '<p>Horisontell tangent innebär derivatan noll; det garanterar ännu inte en extrempunkt.</p>');
replaceStep('exit-feedback',1,1,'<strong>Kontrollera minimum</strong>'+
 work(['h(x)=x²−2x','h″(x)=2','h″(1)=2>0'])+
 '<p>Punkten är ett <strong>lokalt minimum</strong>. Kvadratkomplettering visar dessutom att detta är det globala minimumet på hela reella tallinjen:</p>'+
 work(['h(x)=(x−1)²−1']) );
replaceStep('exit-feedback',1,2,'<strong>Koordinaten</strong>'+
 work(['h(1)=1²−2·1','h(1)=1−2','h(1)=−1'])+
 '<p>Minimipunkten är <strong>(1, −1)</strong>.</p>');
// Gate the g′ graph: it carries both zeros and answer shape, so require the
// full sign-table / terrace proof before it can reveal the results.
const signSequence=document.querySelectorAll('#conditions-feedback [data-sequence]')[1];
const signSteps=[...signSequence.querySelectorAll('[data-seq-item]')];
const graphButton=$('#conditions-feedback [data-reveal="sign-explorer"]');
const graph=$('#sign-explorer');
const sync=()=>{
 const solved=signSteps.every(e=>!e.classList.contains('hidden'));
 graphButton.disabled=!solved;
 graphButton.title=solved?'Visa g′-grafen för kontroll':'Öppna först alla fyra matematiska lösningssteg';
 if(!solved&&!graph.classList.contains('hidden')){
  graph.classList.add('hidden');
  graphButton.setAttribute('aria-expanded','false');
  graphButton.textContent='Valbar grafkontroll av g′ efter min teckentabell';
 }
};
new MutationObserver(sync).observe(signSequence,{subtree:true,attributes:true,attributeFilter:['class']});
sync();
// Typeset independent equations. Ma4Math handles arithmetic, fractions,
// square roots and powers; custom MathML superscripts preserve e^{-0,2t}
// and rational exponents instead of flattening them into ambiguous text.
const tags=['ζ','η','θ','κ','λ','μ','ν','ξ','ρ','σ','φ','ψ'];
const inner=x=>{
 const m=M.typeFormula(x,'inline');
 const start=m.indexOf('<mrow>'),end=m.lastIndexOf('</mrow>');
 if(start<0||end<0)throw Error('invalid MathML container');
 return m.slice(start+6,end);
};
const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let blocks=0,inlineCount=0,supers=0;
const typeset=element=>{
 if(element.querySelector('math'))return;
 const copy=element.cloneNode(true),tokens=[];
 for(const el of [...copy.querySelectorAll('sup,sub')]){
  const parent=el.previousSibling;
  const exp=el.textContent.trim();
  if(!parent||parent.nodeType!==3)throw Error('Unexpected exponent node: '+element.outerHTML);
  const preceding=parent.nodeValue;
  let kind='',base='';
  if(el.tagName.toLowerCase()==='sub'&&preceding.endsWith('lim')){
   kind='lim';base='lim';
  }else if(preceding.endsWith('(t+1)')){
   kind='power';base='(t+1)';
  }else if(el.tagName.toLowerCase()==='sup'&&preceding.endsWith('e')){
   kind='power';base='e';
  }else if(el.tagName.toLowerCase()==='sup'&&preceding.endsWith('4')){
   kind='power';base='4';
  }else throw Error('Unrecognized mathematical script '+exp+' in '+element.outerHTML.slice(0,250));
  if(tokens.length>=tags.length)throw Error('Too many superscripts');
  parent.nodeValue=preceding.slice(0,-base.length);
  const id=tokens.length;
  tokens.push({glyph:tags[id],kind,base,exp});
  el.replaceWith(document.createTextNode(tags[id]));
 }
 const text=copy.textContent.trim().replace(/\s+/g,' ');
 if(!text)return;
 let output=M.typeFormula(text,element.matches('.mathsmall')?'inline':'block');
 for(const item of tokens){
  const math=item.kind==='lim'
   ?'<munder><mi mathvariant="normal">lim</mi><mrow>'+inner(item.exp)+'</mrow></munder>'
   :'<msup><mrow>'+inner(item.base)+'</mrow><mrow>'+inner(item.exp)+'</mrow></msup>';
  const placeholder='<mo>'+item.glyph+'</mo>';
  if(!output.includes(placeholder))throw Error('Missing placeholder '+placeholder+' in '+text);
  output=output.replace(placeholder,math);
  supers++;
 }
 let accessible=text;
 for(const token of tokens)accessible=accessible.replace(token.glyph,token.kind==='lim'?'lim_('+token.exp+')':token.base+'^('+token.exp+')');
 output=output.replace(/aria-label="[^"]*"/,'aria-label="'+esc(accessible)+'"');
 element.innerHTML=output;
 element.dataset.mathPresentation='true';
 if(element.matches('.mathsmall'))inlineCount++;else blocks++;
};
for(const el of document.querySelectorAll('.slide .mathline,.slide .mathsmall'))typeset(el);
if(blocks<95||inlineCount<2||supers<30)throw Error('Insufficient Ma3c22 MathML coverage '+blocks+'/'+inlineCount+'/'+supers);
document.documentElement.dataset.mixedProblemsMath='ready';
})();