/* Ma3c 23/41 · Deriverbarhet: all 12 slides, source-faithful left/right
   h→0⁺ difference quotient notation, complete independent derivation.
   No external scripts, student-data storage, or answer generation.
 */
(()=>{'use strict';
const M=window.Ma4Math;if(!M)throw Error('Ma3c23 MathML engine missing');
const $=selector=>document.querySelector(selector);
const lines=items=>'<div class="solution-math-group">'+items.map(x=>'<p class="mathline">'+x+'</p>').join('')+'</div>';
const mathLine=x=>'<p class="mathline">'+x+'</p>';
const frac=(a,b)=>'<span class="fraction"><span class="num">'+a+'</span><span class="den">'+b+'</span></span>';
const left=(num,den='h')=>'<p class="formula-line">V: '+frac(num,den)+'</p>';
const right=(num,den='h')=>'<p class="formula-line">H: '+frac(num,den)+'</p>';
const step=(id,n,markup)=>{
 const e=$('#'+id+' [data-sequence]')?.querySelectorAll('[data-seq-item]')[n];
 if(!e)throw Error('Ma3c23 step missing '+id+'/'+n);
 e.innerHTML=markup;
};
// Slide 5: both sided limits constructed from f(1), f(1-h), f(1+h), not
// merely asserted via a graph. Keep original book h→0⁺ on the definition.
const boxes=[...document.querySelectorAll('#secant-answer .eq-box')];
if(boxes.length!==2)throw Error('Expected two p/q proof boxes');
boxes[0].innerHTML='<h3>p(x)=(x−1)²+2</h3>'+
 lines(['p(1)=2','p(1−h)=(−h)²+2=h²+2','p(1+h)=h²+2'])+
 '<p>Med h&gt;0 och h→0⁺ blir vänstersekantens lutning:</p>'+
 left('2−(h²+2)')+mathLine('−h→0')+
 '<p>Från höger:</p>'+right('(h²+2)−2')+mathLine('h→0')+
 mathLine('p′(1)=0')+'<p>Båda gränslutningarna är 0. <strong>p är kontinuerlig och deriverbar vid x=1</strong>, och tangenten där är <span class="mathsmall">y=2</span>.</p>';
boxes[1].innerHTML='<h3>q(x)=2|x−1|+2</h3>'+
 lines(['q(1)=2','q(1−h)=2|−h|+2=2h+2','q(1+h)=2|h|+2=2h+2'])+
 '<p>Eftersom h&gt;0 får absolutbeloppet samma positiva värde h på båda sidor, men kvoternas täljare får olika tecken:</p>'+
 left('2−(2h+2)')+mathLine('−2')+
 right('(2h+2)−2')+mathLine('2')+
 '<p><strong>q′(1) finns inte.</strong> q är kontinuerlig vid x=1, men vänstergränslutningen är −2 och högergränslutningen +2.</p>';
// Slide 7: the actual endpoint value must be used, never the open dot.
const jumpBoxes=[...document.querySelectorAll('#jump-answer .eq-box')];
if(jumpBoxes.length!==2)throw Error('Expected two jump proof boxes');
jumpBoxes[0].innerHTML='<h3>Från vänster</h3>'+
 '<p>Sätt h&gt;0. Funktionsvärdet i själva skarven är 3, medan punkten precis till vänster har värdet 1:</p>'+
 lines(['r(2)=3','r(2−h)=1'])+
 '<p class="formula-line">'+frac('r(2)−r(2−h)','h')+' = '+frac('3−1','h')+' = '+frac('2','h')+'</p>'+
 lines(['h=1 ⇒ 2/h=2','h=0,5 ⇒ 2/h=4','h=0,1 ⇒ 2/h=20'])+
 '<p class="formula-line">lim<sub>h→0<sup>+</sup></sub> '+frac('2','h')+'=+∞</p>'+
 '<p><strong>Det finns ingen ändlig vänsterderivata</strong> vid x=2.</p>';
jumpBoxes[1].innerHTML='<h3>Från höger</h3>'+
 lines(['r(2+h)=3','r(2)=3'])+
 '<p class="formula-line">'+frac('r(2+h)−r(2)','h')+' = '+frac('3−3','h')+' = 0</p>'+
 '<p>Högersekantens lutning är 0 för varje h&gt;0, och högerderivatan är 0.</p>';
// Slide 9: two independent conditions, with actual sided quotients after
// continuity rather than trusting only branch derivative slopes.
step('stitch-answer',0,'<strong>1 · Kontinuitet</strong>'+
 '<p>Den högra grenen gäller vid x=1, och vänstergrenen måste närma sig samma höjd:</p>'+
 lines(['f(1)=1²+1=2','a·1+b=a+b','a+b=2'])+
 '<p>Villkoret är <strong>a+b=2</strong>. Utan det räcker inga påståenden om grenarnas lutningar.</p>');
step('stitch-answer',1,'<strong>2 · Samma lutning</strong>'+
 '<p>Vänstergrenens derivata är konstant a, högergrenens derivata är 2x. Vid skarven måste de stämma:</p>'+
 lines(['D(ax+b)=a','D(x²+1)=2x','2·1=2','a=2'])+
 '<p>Detta är det andra oberoende villkoret.</p>');
step('stitch-answer',2,'<strong>3 · Båda villkoren uppfyllda</strong>'+
 lines(['a+b=2','a=2','2+b=2','b=0'])+
 '<div class="math-givens">'+mathLine('a=2')+mathLine('b=0')+'</div>'+
 '<p>Då blir den vänstra grenen 2x och den högra x²+1:</p>'+
 lines(['f(1)=2','f(1−h)=2−2h','f(1+h)=(1+h)²+1','f(1+h)=2+2h+h²'])+
 '<p>Kontrollera den faktiska differenskvoten genom skarvpunkten. Varje bråkuttryck får egen rad så alla led kan läsas även på 390px mobil:</p>'+
 '<p class="formula-line">'+frac('f(1)−f(1−h)','h')+'</p>'+
 '<p class="formula-line">='+frac('2−(2−2h)','h')+'</p>'+
 mathLine('=2')+
 '<p class="formula-line">'+frac('f(1+h)−f(1)','h')+'</p>'+
 '<p class="formula-line">='+frac('2+2h+h²−2','h')+'</p>'+
 '<p class="formula-line">='+frac('2h+h²','h')+'</p>'+
 mathLine('=2+h')+
 '<p>För h→0⁺ får båda kvoterna gränsvärdet 2. <strong>Skarven är kontinuerlig och deriverbar med f′(1)=2</strong>.</p>');
// Slide 12: separate conditions for F, show why c4,d0 is not merely bad
// by a tangent comparison but leads to a divergent actual left quotient.
step('exit-answer',0,'<strong>1 · Delarna möts</strong>'+
 '<p>Högergrenen anger funktionsvärdet F(2). Vänstergrenen måste närma sig samma värde:</p>'+
 lines(['F(2)=2²=4','c·2+d=2c+d','2c+d=4'])+
 '<p>Detta är kontinuitetsvillkoret.</p>');
step('exit-answer',1,'<strong>2 · Lutningarna stämmer</strong>'+
 '<p>Vänstergrenens derivata är c. Högergrenens derivata av x² är 2x, och den är 4 vid x=2:</p>'+
 lines(['D(cx+d)=c','D(x²)=2x','2·2=4','c=4'])+
 '<p>Detta är lutningsvillkoret. Båda behövs.</p>');
step('exit-answer',2,'<strong>3 · Den deriverbara skarven</strong>'+
 lines(['2c+d=4','c=4','2·4+d=4','8+d=4','d=−4'])+
 '<div class="math-givens">'+mathLine('c=4')+mathLine('d=−4')+'</div>'+
 '<p>Kontroll från båda sidor:</p>'+
 lines(['F(2)=4','F(2−h)=4(2−h)−4=4−4h','F(2+h)=(2+h)²=4+4h+h²'])+
 '<p class="formula-line">'+frac('F(2)−F(2−h)','h')+' = 4</p>'+
 '<p class="formula-line">'+frac('F(2+h)−F(2)','h')+' = 4+h</p>'+
 '<p>Båda ger gränslutning 4 för h→0⁺, så <strong>F′(2)=4</strong>.</p>');
step('exit-answer',3,'<strong>4 · Felsvaret</strong>'+
 '<div class="math-givens">'+mathLine('c=4')+mathLine('d=0')+'</div>'+
 '<p>Lutningarna hos de båda grenarna är visserligen 4, men de har inte samma gränshöjd:</p>'+
 lines(['F(2−h)=4(2−h)=8−4h','F(2)=2²=4'])+
 '<p>Den verkliga vänsterkvoten går genom (2,4), inte genom den öppna punkten (2,8):</p>'+
 '<p class="formula-line">'+frac('F(2)−F(2−h)','h')+' = '+frac('4−(8−4h)','h')+'</p>'+
 '<p class="formula-line">lim<sub>h→0<sup>+</sup></sub> (4−4/h)=−∞</p>'+
 '<p><strong>Hopp ⇒ inte kontinuerlig ⇒ inte deriverbar.</strong> Samma lutning hos grenarna räcker inte.</p>');
step('exit-answer',4,'<strong>5 · Kontinuerlig utan derivata</strong>'+
 '<p>Återanvänd det tidigare hörnet:</p>'+
 lines(['q(x)=2|x−1|+2','q(1)=2','q(1−h)=2h+2','q(1+h)=2h+2'])+
 '<p>Från vänster och höger blir differenskvoterna:</p>'+
 '<p class="formula-line">'+frac('q(1)−q(1−h)','h')+' = −2</p>'+
 '<p class="formula-line">'+frac('q(1+h)−q(1)','h')+' = 2</p>'+
 '<p>Den är <strong>kontinuerlig</strong> vid x=1 men de ensidiga derivatorna skiljer sig. <strong>q′(1) finns inte.</strong></p>');
// Preserve the positive-h book convention. Render all original ratio spans
// into true MathML mfrac and all left/right limits as munder; retain full
// mathematical exponents and labels for accessibility.
const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const parseInner=source=>{
 const built=M.typeFormula(source,'inline');
 const start=built.indexOf('<mrow>'),end=built.lastIndexOf('</mrow>');
 if(start<0||end<0)throw Error('Bad MathML '+source);
 return built.slice(start+6,end);
};
let mathCount=0,fracCount=0,supCount=0,limitCount=0;
const glyphs=['ζ','η','θ','κ','λ','μ','ν','ξ','ρ','σ','φ','ψ','ω'];
for(const e of document.querySelectorAll('.slide .mathline,.slide .mathsmall,.slide .formula-line')){
 const clone=e.cloneNode(true),tokens=[];
 const token=(math,accessible)=>{
  if(tokens.length>=glyphs.length)throw Error('Excessive formula tokens');
  const glyph=glyphs[tokens.length];tokens.push({glyph,math,accessible});
  return document.createTextNode(glyph);
 };
 // Fractions first so numerator/denominator expression is parsed
 // independently and cannot have one ambiguous flattened slash.
 for(const f of [...clone.querySelectorAll('.fraction')]){
  const num=f.querySelector('.num')?.textContent?.trim(),den=f.querySelector('.den')?.textContent?.trim();
  if(!num||!den)throw Error('Bad fraction '+e.outerHTML);
  f.replaceWith(token('<mfrac><mrow>'+parseInner(num)+'</mrow><mrow>'+parseInner(den)+'</mrow></mfrac>',
    '('+num+')/('+den+')'));
  fracCount++;
 }
 // Handle limit notation including nested superscript + inside the subscript.
 for(const sub of [...clone.querySelectorAll('sub')]){
  const preceding=sub.previousSibling;
  if(!preceding||preceding.nodeType!==3)throw Error('Unexpected subscript '+e.outerHTML);
  const before=preceding.nodeValue;
  const script=sub.textContent.trim();
  if(before.endsWith('lim')){
   const limVal=script.replace(/0\+$/,'0⁺');
   preceding.nodeValue=before.slice(0,-3);
   sub.replaceWith(token('<munder><mi mathvariant="normal">lim</mi><mrow>'+parseInner(limVal)+'</mrow></munder>',
    'lim_('+limVal+')'));
   limitCount++;
  }else if(before.endsWith('f')){
   preceding.nodeValue=before.slice(0,-1);
   sub.replaceWith(token('<msub><mi>f</mi><mtext>'+esc(script)+'</mtext></msub>','f_('+script+')'));
  }else throw Error('Unsupported subscript '+before+' '+e.outerHTML);
 }
 for(const sup of [...clone.querySelectorAll('sup')]){
  const preceding=sup.previousSibling;
  if(!preceding||preceding.nodeType!==3)throw Error('Unexpected superscript '+e.outerHTML);
  const before=preceding.nodeValue,exp=sup.textContent.trim();
  const base=before.endsWith('e')?'e':before.endsWith('0')?'0':null;
  if(!base)throw Error('Unexpected exponent '+before+' '+exp);
  preceding.nodeValue=before.slice(0,-1);
  sup.replaceWith(token('<msup><mrow>'+parseInner(base)+'</mrow><mrow>'+parseInner(exp)+'</mrow></msup>',
    base+'^('+exp+')'));
  supCount++;
 }
 const cleaned=clone.textContent.trim().replace(/\s+/g,' ');
 if(!cleaned)continue;
 const disp=e.classList.contains('mathsmall')?'inline':'block';
 let markup=M.typeFormula(cleaned,disp),access=cleaned;
 for(const t of tokens){
  const ph='<mo>'+t.glyph+'</mo>';
  if(!markup.includes(ph))throw Error('Token not found in math: '+ph+' text '+cleaned);
  markup=markup.replace(ph,t.math);
  access=access.replace(t.glyph,t.accessible);
 }
 markup=markup.replace(/aria-label="[^"]*"/,'aria-label="'+esc(access)+'"');
 e.innerHTML=markup;e.dataset.mathPresentation='true';mathCount++;
}
// Semantic notation, separate given values, and book text remain distinct.
if(mathCount<95||fracCount<15||supCount<2||limitCount<3)
 throw Error('Ma3c23 MathML missing elements '+[mathCount,fracCount,supCount,limitCount].join('/'));
document.documentElement.dataset.differentiabilityMath='ready';
})();