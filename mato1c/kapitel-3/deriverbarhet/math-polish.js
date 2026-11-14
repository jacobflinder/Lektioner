/* Ma3c 23/41 Deriverbarhet: book-faithful h→0⁺, verified one-sided
   limits, full stitch algebra and truly semantic local MathML.
   Original prompts, SVG visualizations, teacher route, homework remain. */
(()=>{'use strict';
const M=window.Ma4Math;if(!M)throw Error('Ma3c23 local MathML engine missing');
const $=sel=>document.querySelector(sel);
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const normal=s=>M.typeFormula(s,'inline').match(/<mrow>([\s\S]*)<\/mrow><\/math>$/)?.[1]??'';
const math=(body,label,display='block')=>'<math xmlns="http://www.w3.org/1998/Math/MathML" display="'+display+'" aria-label="'+esc(label)+'"><mrow>'+body+'</mrow></math>';
const mathLine=s=>'<p class="mathline">'+esc(s)+'</p>';
const group=items=>'<div class="solution-math-group">'+items.map(mathLine).join('')+'</div>';
const makeFrac=(up,down)=>'<mfrac><mrow>'+normal(up)+'</mrow><mrow>'+normal(down)+'</mrow></mfrac>';
const makeLim=()=>'<munder><mi mathvariant="normal">lim</mi><mrow>'+normal('h→0⁺')+'</mrow></munder>';
const leftLimit=(num,expr,final)=>math(makeLim()+makeFrac(num,'h')+'<mo>=</mo>'+normal(expr)+'<mo>→</mo>'+normal(final),
 'lim_(h→0⁺) ('+num+')/h = '+expr+' → '+final);
const rightLimit=(num,expr,final)=>math(makeLim()+makeFrac(num,'h')+'<mo>=</mo>'+normal(expr)+'<mo>→</mo>'+normal(final),
 'lim_(h→0⁺) ('+num+')/h = '+expr+' → '+final);
const formulaText=(label,html)=>'<p class="formula-line">'+math(html,label)+'</p>';
const fracText=(num,den,expr,label)=>formulaText(label,makeFrac(num,den)+'<mo>=</mo>'+normal(expr));
const step=(section,n,html)=>{
 const el=$('#'+section+' [data-sequence] [data-seq-item]:nth-child('+(n+1)+')');
 if(!el)throw Error('Ma3c23 solution step absent '+section+'/'+n);
 el.innerHTML=html;
};
const fmtSup={'−':'⁻','+':'⁺','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const supers=v=>[...v].map(c=>fmtSup[c]||c).join('');
const formulaRaw=el=>{
 const copy=el.cloneNode(true);
 copy.querySelectorAll('.fraction').forEach(fr=>{
  fr.replaceWith(document.createTextNode('('+fr.querySelector('.num')?.textContent+'/'+fr.querySelector('.den')?.textContent+')'));
 });
 copy.querySelectorAll('sup').forEach(e=>e.replaceWith(document.createTextNode(supers(e.textContent))));
 copy.querySelectorAll('sub').forEach(e=>e.replaceWith(document.createTextNode('_('+e.textContent+')')));
 return copy.textContent.trim().replace(/\s+/g,' ');
};
const typeset=()=>{
 let blocks=0,inline=0;
 for(const el of document.querySelectorAll('.slide .mathline,.slide .mathsmall')){
  if(el.querySelector('math'))continue;
  if(el.closest('#book'))continue; // IDs 3272–3277 must never become arithmetic.
  const text=formulaRaw(el);if(!text)continue;
  M.setFormula(el,text,el.matches('.mathsmall')?'inline':'block');
  el.matches('.mathsmall')?inline++:blocks++;
 }
 return {blocks,inline};
};
// Slide 2 – exact book conventions. Positive h on both sides; numerator
// differs, and we never substitute h=0.
const definitionBoxes=document.querySelectorAll('#goal .eq-box');
if(definitionBoxes.length!==2)throw Error('Ma3c23 two book derivative boxes missing');
for(const [i,num,name] of [
[0,'f(a)−f(a−h)','Vänsterderivata'],
[1,'f(a+h)−f(a)','Högerderivata']
]){
 const box=definitionBoxes[i];
 box.querySelector('h3').textContent='Från '+(i===0?'vänster':'höger');
 const line=box.querySelector('.formula-line');
 const full=makeLim()+makeFrac(num,'h');
 line.innerHTML=math(full,'lim_(h→0⁺) ('+num+')/h');
 box.querySelector('p:last-child').textContent=name+': gränsvärdet måste finnas och vara ändligt.';
}
// Slide 5 – independent, transparent side-specific substitutions, not p(1±h)
// or q(1±h) with two statements compressed into one formula.
const answerBoxes=document.querySelectorAll('#secant-answer .eq-box');
if(answerBoxes.length!==2)throw Error('Ma3c23 secant worked boxes missing');
answerBoxes[0].innerHTML=
 '<h3>p · mjuk parabel</h3>'+
 group(['p(x)=(x−1)²+2','p(1)=2','p(1−h)=h²+2','p(1+h)=h²+2'])+
 '<p><strong>Vänster – beräkna först kvoten för h>0:</strong></p>'+
 fracText('2−(h²+2)','h','−h','(p(1)−p(1−h))/h=−h')+
 '<p class="formula-line">'+leftLimit('2−(h²+2)','−h','0')+'</p>'+
 '<p><strong>Höger – samma positiva h:</strong></p>'+
 fracText('(h²+2)−2','h','h','(p(1+h)−p(1))/h=h')+
 '<p class="formula-line">'+rightLimit('(h²+2)−2','h','h→0⁺?')+'</p>'+
 '<p>Från höger går också <strong>h mot 0</strong>. Båda ändliga gränslutningarna blir 0, alltså <strong>p′(1)=0</strong> med tangent <span class="mathsmall">y=2</span>.</p>';
answerBoxes[1].innerHTML=
 '<h3>q · skarpt hörn</h3>'+
 group(['q(x)=2|x−1|+2','q(1)=2','q(1−h)=2h+2','q(1+h)=2h+2'])+
 '<p><strong>Vänster:</strong></p>'+
 fracText('2−(2h+2)','h','−2','(q(1)−q(1−h))/h=−2')+
 '<p class="formula-line">'+leftLimit('2−(2h+2)','−2','−2')+'</p>'+
 '<p><strong>Höger:</strong></p>'+
 fracText('(2h+2)−2','h','2','(q(1+h)−q(1))/h=2')+
 '<p class="formula-line">'+rightLimit('(2h+2)−2','2','2')+'</p>'+
 '<p><strong>q′(1) finns inte.</strong> Grafen är kontinuerlig i x=1 men vänstergränslutningen −2 skiljer sig från högergränslutningen +2.</p>';
// Correct the p right-hand limit display using exact end value 0; the
// two-step algebra (right quotient = h, then h→0⁺) is intentionally separate.
const pRight=answerBoxes[0].querySelectorAll('.formula-line')[3];
if(!pRight)throw Error('Missing p right-hand limit');
pRight.innerHTML=rightLimit('(h²+2)−2','h','0');
// Slide 6 – three independent mathematical givens must not be joined using &nbsp;.
const cases=(selector,parts)=>{
 const lines=[...document.querySelectorAll(selector)];
 if(lines.length!==2)throw Error('Expected two branches '+selector+' got '+lines.length);
 const wrapper=document.createElement('div');wrapper.className='math-givens';
 for(const [expr,domain] of parts){
  const c=document.createElement('div');c.className='math-case';
  c.innerHTML=mathLine(expr)+mathLine(domain);
  wrapper.append(c);
 }
 lines[0].replaceWith(wrapper);lines[1].remove();
};
cases('#jump-model .two > div:first-child > .mathline',[['r(x)=1','x<2'],['r(x)=3','x≥2']]);
cases('#stitch .two > div:first-child > .mathline',[['f(x)=ax+b','x<1'],['f(x)=x²+1','x≥1']]);
cases('#exit .panel > .mathline',[['F(x)=cx+d','x<2'],['F(x)=x²','x≥2']]);
// Slide 7 – exact r(2) anchor; no false derivative of flat left branch.
const jumpBoxes=document.querySelectorAll('#jump-answer .eq-box');
if(jumpBoxes.length!==2)throw Error('Ma3c23 jump boxes missing');
jumpBoxes[0].innerHTML='<h3>Från vänster</h3>'+
 '<p>Det är den <strong>fyllda punkten r(2)=3</strong> som ingår i kvoten:</p>'+
 fracText('r(2)−r(2−h)','h','(3−1)/h','(r(2)−r(2−h))/h=(3−1)/h')+
 group(['(3−1)/h=2/h','h=1 ⇒ 2/h=2','h=0,5 ⇒ 2/h=4','h=0,1 ⇒ 2/h=20'])+
 '<p class="formula-line">'+math(makeLim()+makeFrac('2','h')+'<mo>=</mo>'+normal('+∞'),
 'lim_(h→0⁺) 2/h = +∞')+'</p>'+
 '<p><strong>Vänsterderivatan finns inte som ett ändligt tal.</strong> Den vänstra grendelen är horisontell, men sekanten går till r(2)=3.</p>';
jumpBoxes[1].innerHTML='<h3>Från höger</h3>'+
 fracText('r(2+h)−r(2)','h','(3−3)/h','(r(2+h)−r(2))/h=(3−3)/h')+
 group(['(3−3)/h=0','h>0'])+
 '<p>Den högra differenskvoten är 0 för varje h>0; dess gränsvärde är <strong>0</strong>.</p>';
// Slide 9 – mathematical conditions first, independent equations in separate
// 16px rows, and an actual quotient proof for the achieved differentiable join.
step('stitch-answer',0,'<strong>1 · Kontinuitet</strong>'+
 '<p>Funktionsvärdet vid skarven är f(1)=1²+1=2. Vänstra grenen måste närma sig samma värde:</p>'+
 group(['lim_(x→1⁻) f(x)=a+b','f(1)=1²+1=2','a+b=2']));
step('stitch-answer',1,'<strong>2 · Samma lutning</strong>'+
 '<p>För en <em>kontinuerlig</em> skarv måste lutningarna bli lika:</p>'+
 group(['f′_vänster(x)=a','f′_höger(x)=2x','f′_höger(1)=2·1=2','a=2']));
step('stitch-answer',2,'<strong>3 · Båda villkoren uppfyllda</strong>'+
 group(['a+b=2','a=2','2+b=2','b=0'])+
 '<p>De tillåtna funktionerna är då:</p>'+
 group(['f(x)=2x för x<1','f(x)=x²+1 för x≥1'])+
 '<p>Verifiera med bokens <strong>faktiska ensidiga differenskvoter</strong>, där f(1)=2:</p>'+
 group(['f(1−h)=2−2h','f(1+h)=(1+h)²+1','f(1+h)=2+2h+h²'])+
 fracText('2−(2−2h)','h','2','(f(1)−f(1−h))/h=2')+
 fracText('(2+2h+h²)−2','h','2+h','(f(1+h)−f(1))/h=2+h')+
 '<p>När h→0⁺ går båda kvoter mot <strong>2</strong>. Funktionen är kontinuerlig och har <strong>f′(1)=2</strong>.</p>');
// Extra illustrative counterexample: branches have same derivative but
// mismatch in function value, which forces divergence of the true quotient.
const detail=$('#stitch-detail');
detail.innerHTML='<p>Pröva <strong>a=2, b=1</strong>. Vänstergrenen närmar sig <strong>3</strong> men f(1)=2. Båda grenarnas vanliga derivator har värdet 2 vid x=1, ändå finns ett hopp.</p>'+
 '<p>Den riktiga vänstersekanten måste gå till den <strong>fyllda punkten (1,2)</strong>:</p>'+
 group(['f(1)=2','f(1−h)=2(1−h)+1','f(1−h)=3−2h'])+
 fracText('2−(3−2h)','h','(−1+2h)/h','(f(1)−f(1−h))/h=(−1+2h)/h')+
 group(['(−1+2h)/h=2−1/h'])+
 '<p>När h→0⁺ går kvoten mot <strong>−∞</strong>. Den <strong>vänstra derivatan finns därför inte</strong>, trots att den vänstra <em>grenens</em> lutning är 2. Kontinuitet måste kontrolleras före jämförelsen av grenarnas derivator.</p>';
// Slide 12 – independent full two-condition proof and correct counterexample.
step('exit-answer',0,'<strong>1 · Delarna möts</strong>'+
 '<p>Vid x=2 hör högerdelen till funktionen, så F(2)=2²=4:</p>'+
 group(['F(2)=2²=4','lim_(x→2⁻) F(x)=2c+d','2c+d=4']));
step('exit-answer',1,'<strong>2 · Lutningarna stämmer</strong>'+
 '<p>När kontinuiteten är uppfylld jämförs grenarnas derivator:</p>'+
 group(['F′_vänster(x)=c','F′_höger(x)=2x','F′_höger(2)=2·2','F′_höger(2)=4','c=4']));
step('exit-answer',2,'<strong>3 · Den deriverbara skarven</strong>'+
 group(['2c+d=4','c=4','8+d=4','d=−4'])+
 '<p>Funktionen är nu sammanhängande. Kontrollera ensidiga differenskvoter vid x=2:</p>'+
 group(['F(2)=4','F(2−h)=4(2−h)−4','F(2−h)=4−4h',
 'F(2+h)=(2+h)²','F(2+h)=4+4h+h²'])+
 fracText('4−(4−4h)','h','4','(F(2)−F(2−h))/h=4')+
 fracText('(4+4h+h²)−4','h','4+h','(F(2+h)−F(2))/h=4+h')+
 '<p>Båda gränsvärden blir <strong>4</strong> för h→0⁺. Alltså är <strong>c=4, d=−4 och F′(2)=4</strong>.</p>');
step('exit-answer',3,'<strong>4 · Varför elevens svar är fel</strong>'+
 group(['c=4','d=0','lim_(x→2⁻) F(x)=8','F(2)=4'])+
 '<p>Det är ett <strong>hopp</strong>, inte en deriverbar skarv. De faktiska vänstersekantkvoterna visar varför:</p>'+
 group(['F(2−h)=8−4h'])+
 fracText('4−(8−4h)','h','4−4/h','(F(2)−F(2−h))/h=4−4/h')+
 '<p>När h→0⁺ går vänsterkvoten mot <strong>−∞</strong>. Grenlutningen 4 är <em>inte</em> en ensidig derivata för den osammanhängande funktionen.</p>');
step('exit-answer',4,'<strong>5 · Kontinuerlig utan derivata</strong>'+
 group(['q(x)=2|x−1|+2','q(1)=2','q(1−h)=2h+2','q(1+h)=2h+2'])+
 fracText('2−(2h+2)','h','−2','Vänsterkvot vid x=1 är −2')+
 fracText('(2h+2)−2','h','2','Högerkvot vid x=1 är 2')+
 '<p>Båda grenarna möts vid q(1)=2 och funktionen är kontinuerlig. Men vänsterderivatan blir <strong>−2</strong> och högerderivatan <strong>+2</strong>. Därför är q <strong>inte deriverbar</strong> i x=1.</p>');
// Accessible MathML for lim notation in the formulas we inserted as lines.
// The local math formatter understands mathematical symbols, but "lim_(...)"
// is easier to read as a real munder rather than raw underscore text.
const replaceLimit=(el)=>{
 const raw=el.textContent.trim();
 const match=raw.match(/^lim_\(([^)]+)\)\s+(.+)$/);
 if(!match)return false;
 const under=normal(match[1]);
 const rest=normal(match[2]);
 const body='<munder><mi mathvariant="normal">lim</mi><mrow>'+under+'</mrow></munder>'+rest;
 el.innerHTML=math(body,raw);
 return true;
};
// All direct display equations and small inline math that contain only
// a single mathematical statement. No book exercise numbers are re-typeset.
let blocks=0,small=0,limits=0;
for(const el of document.querySelectorAll('.slide .mathline,.slide .mathsmall')){
 if(el.querySelector('math'))continue;
 if(el.closest('#book'))continue;
 if(replaceLimit(el)){blocks++;limits++;continue}
 const raw=formulaRaw(el);
 if(!raw)continue;
 // These exact source notations have mathematical superscripts that plain
 // text ought not flatten into visual multiplication. Preserve true msup.
 if(el.querySelector('sup')){
  const supers=[...el.querySelectorAll('sup')];
  // Only earlier recall contains e^{-0,2t}; retain the exponent's full
  // mathematical range rather than a small standalone '-0,2t'.
  if(supers.length===1&&raw.includes('e')&&el.textContent.includes('−0,2t')){
   const normalRaw=raw.replace('e⁻0,2t','eζ');
   let output=M.typeFormula(normalRaw,el.matches('.mathsmall')?'inline':'block');
   const exp='<msup><mi>e</mi><mrow>'+normal('−0,2t')+'</mrow></msup>';
   output=output.replace('<mi>e</mi><mo>ζ</mo>',exp).replace(/aria-label="[^"]*"/,'aria-label="'+esc(raw)+'"');
   el.innerHTML=output;
   if(el.matches('.mathsmall'))small++;else blocks++;
   continue;
  }
 }
 M.setFormula(el,raw,el.matches('.mathsmall')?'inline':'block');
 el.matches('.mathsmall')?small++:blocks++;
}
if(blocks<65||small<3||limits<2)throw Error('Ma3c23 MathML insufficient: '+blocks+'/'+small+'/'+limits);
// SVGs were untouched; original numerics run separately in lesson.js.
document.documentElement.dataset.differentiabilityMath='ready';
})();