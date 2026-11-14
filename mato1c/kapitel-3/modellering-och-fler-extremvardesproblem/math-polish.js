/* Ma3c 21/41: full classroom-algebra audit, local MathML only.
   The original independently written student tasks, book numbers,
   cues, SVG simulations, teacher prompts and control buttons remain. */
(()=>{'use strict';
const M=window.Ma4Math;if(!M)throw Error('Ma3c21: local MathML unavailable');
const $=sel=>document.querySelector(sel);
const eq=t=>'<p class="eq">'+String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')+'</p>';
const group=items=>'<div class="solution-math-group">'+items.map(x=>x==='eller'?'<p class="solution-explanation">eller</p>':eq(x)).join('')+'</div>';
const givens=items=>'<div class="math-givens">'+items.map(eq).join('')+'</div>';
const step=(id,n,body,series=0)=>{
 const target=document.querySelectorAll('#'+id+' [data-sequence]')[series]?.querySelectorAll('[data-seq-item]')[n];
 if(!target)throw Error('Missing Ma3c21 solution step '+id+'/'+series+'/'+n);
 target.innerHTML=body;
};
const wrap=(selector,content)=>{
 const element=$(selector);if(!element)throw Error('Missing Ma3c21 math '+selector);
 element.outerHTML=content;
};
// The paper-cutting conditions must be proved individually, not comma-concatenated.
wrap('#goal .panel > p.eq:nth-of-type(4)',givens(['x>0','50−2x>0','30−2x>0'])+
 '<p>Bottenlängden kräver x&lt;25 och bottenbredden x&lt;15. Tillsammans med positiv höjd gäller:</p>');
// Current goal continues to show the open feasible domain x in (0,15).
wrap('#box-solution [data-sequence] > p.eq',givens(['V(x)=x(50−2x)(30−2x)','0<x<15']));
step('box-solution',0,'<strong>1 · Utveckla volymfunktionen</strong>'+group([
 'V(x)=x(50−2x)(30−2x)',
 'V(x)=x(1500−100x−60x+4x²)',
 'V(x)=x(1500−160x+4x²)',
 'V(x)=1500x−160x²+4x³',
 'V(x)=4x³−160x²+1500x'
]));
step('box-solution',1,'<strong>2 · Derivera</strong>'+group([
 'V(x)=4x³−160x²+1500x',
 'V′(x)=12x²−320x+1500'
]));
step('box-solution',2,'<strong>3 · Hitta och sålla kandidater</strong>'+group([
 '12x²−320x+1500=0',
 '3x²−80x+375=0',
 'x=(80±√(6400−4500))/6',
 'x=(80±10√(19))/6'
 ])+'<p>De två rötterna får egna matematiska rader:</p>'+group([
 'x₁=(40−5√(19))/3≈6,07',
 'x₂=(40+5√(19))/3≈20,60'
 ])+'<p><strong>x≈6,07</strong> är tillåtet. <strong>x≈20,60</strong> ligger utanför 0&lt;x&lt;15 och ger negativ bottenbredd.</p>');
step('box-solution',3,'<strong>4 · Motivera ett globalt maximum</strong>'+
 '<p>Låt a beteckna den tillåtna roten:</p>'+group(['a=(40−5√(19))/3≈6,07'])+
 '<p>Tecken i de två återstående intervallen:</p>'+group(['V′(3)=648>0','V′(10)=−500<0'])+
 '<p>De andra nollställena ligger utanför definitionsmängden. Därför växer volymen för 0&lt;x&lt;a och avtar för a&lt;x&lt;15.</p>'+
 group(['V(0)=0','V(15)=0'])+
 '<p>Ändpunkterna tillhör <em>inte</em> definitionsmängden. Gränsvärdena dit är ändå 0. Därför ger a ett <strong>globalt maximum</strong> för alla tillåtna lådor.</p>');
step('box-solution',4,'<strong>5 · Svara med mått och enhet</strong>'+
 '<p>Beräkna dimensionerna vid det exakta stationära värdet före avrundning:</p>'+
 group(['x≈6,0685','50−2x≈37,8630','30−2x≈17,8630',
 'V(x)=x(50−2x)(30−2x)','V(a)≈4104,41'])+
 '<p><strong>Största volymen är cirka 4 100 cm³</strong> vid klippmåttet och höjden <strong>6,07 cm</strong>. Botten blir cirka <strong>37,86 × 17,86 cm</strong>.</p>');
step('rectangle-solution',0,'<strong>1 · Modell och definitionsmängd</strong>'+
 '<p>Den symmetriska rektangelns bas går från −x till x: bredd 2x. Höjden är 3−x².</p>'+
 group(['A(x)=2x(3−x²)','A(x)=6x−2x³','x>0','3−x²>0','0<x<√(3)'])+
 '<p>Ändpunkterna innebär noll area och ingen verklig rektangel med positiv area.</p>');
step('rectangle-solution',1,'<strong>2 · Stationära kandidater</strong>'+
 group(['A′(x)=6−6x²','6−6x²=0','x²=1','x=1','eller','x=−1'])+
 '<p><strong>x=−1</strong> ligger utanför 0&lt;x&lt;√3 och väljs bort.</p>');
step('rectangle-solution',2,'<strong>3 · Motivera maximum</strong>'+
 group(['A′(0,5)=6−6·0,5²','A′(0,5)=4,5>0',
 'A′(1,5)=6−6·1,5²','A′(1,5)=−7,5<0'])+
 '<p>Arean växer före x=1 och avtar sedan. Vid gränserna x→0 och x→√3 går arean mot 0. Därför är maximumet globalt på den öppna definitionsmängden.</p>');
step('rectangle-solution',3,'<strong>4 · Svara med måtten</strong>'+
 group(['A(1)=2·1·(3−1²)','A(1)=2·1·2','A(1)=4'])+
 '<p><strong>Största arean är 4 areaenheter</strong>. Basen är 2 och höjden 2 längdenheter. Inga centimeter har angivits.</p>');
wrap('#fraction-own > p.eq',givens(['V(x)=15−0,1x−40/x','x≥4']));
const fracIntro=$('#fraction-own .lead');
fracIntro.insertAdjacentHTML('beforeend',' <em>Verkligt antal lampor är heltal; derivatan används på en kontinuerlig hjälpfunktion.</em>');
step('fraction-solution',0,'<strong>1 · Derivera rätt tecken</strong>'+
 group(['−40/x=−40x⁻¹','D(−40x⁻¹)=40x⁻²',
 'D(−40x⁻¹)=40/x²','V′(x)=−0,1+40/x²'])+
 '<p>Minustecknet i koefficienten och exponenten −1 tar ut varandra.</p>');
step('fraction-solution',1,'<strong>2 · Lös och pröva gränsen</strong>'+
 group(['−0,1+40/x²=0','40/x²=0,1','40=0,1x²',
 'x²=400','x=20','eller','x=−20'])+
 '<p>−20 ligger utanför x≥4 och väljs bort. x=20 är ett tillåtet heltal lampor.</p>');
step('fraction-solution',2,'<strong>3 · Motivera globalt maximum</strong>'+
 '<p>Skriv derivatan på gemensamt bråkstreck:</p>'+
 group(['V′(x)=(400−x²)/(10x²)'])+
 '<p>Nämnaren är positiv för alla x≥4. Täljaren är positiv för 4≤x&lt;20 och negativ för x&gt;20. Funktionen växer därmed före 20 och minskar för alla större x.</p>'+
 group(['V(4)=15−0,1·4−40/4','V(4)=15−0,4−10','V(4)=4,6'])+
 '<p>Eftersom modellen saknar övre ändpunkt men är avtagande för alla x&gt;20 är maxvärdet vid x=20 globalt.</p>');
step('fraction-solution',3,'<strong>4 · Svara i situationen</strong>'+
 group(['V(20)=15−0,1·20−40/20','V(20)=15−2−2','V(20)=11'])+
 '<p><strong>20 lampor per dag</strong> ger största vinsten <strong>11 000 kr per dag</strong>. Det kontinuerliga optimumet är också ett möjligt heltal.</p>');
wrap('#exit .task .eq',givens(['C(x)=x+9/x','x>0']));
step('exit-feedback',0,'<strong>Modell och definitionsmängd</strong>'+
 '<p>Bredden är x och höjden 6−x. Båda måste vara positiva.</p>'+
 group(['A(x)=x(6−x)','A(x)=6x−x²','0<x<6']),0);
step('exit-feedback',1,'<strong>Derivera och motivera</strong>'+
 group(['A′(x)=6−2x','6−2x=0','−2x=−6','x=3',
 'A′(2)=2>0','A′(4)=−2<0'])+
 '<p>Arean ökar före 3 och minskar efter. Vid intervallets gränser blir arean 0. Därför ges största arean vid x=3.</p>',0);
step('exit-feedback',2,'<strong>Svara</strong>'+
 group(['A(3)=3(6−3)','A(3)=3·3','A(3)=9'])+
 '<p><strong>Största arean är 9 areaenheter</strong>. Måtten är 3 × 3 längdenheter.</p>',0);
step('exit-feedback',0,'<strong>Derivera</strong>'+
 group(['C(x)=x+9x⁻¹','C′(x)=1−9x⁻²','C′(x)=1−9/x²']),1);
step('exit-feedback',1,'<strong>Välj kandidat</strong>'+
 group(['1−9/x²=0','1=9/x²','x²=9','x=3','eller','x=−3'])+
 '<p>Endast x=3 ligger i definitionsmängden x&gt;0.</p>',1);
step('exit-feedback',2,'<strong>Motivera och beräkna</strong>'+
 '<p>Nämnaren i derivatan är positiv på x&gt;0. Täljaren bestämmer tecknet.</p>'+
 group(['C′(x)=(x²−9)/x²','C′(1)=−8<0','C′(4)=7/16>0'])+
 '<p>Derivatan är negativ för 0&lt;x&lt;3 och positiv för x&gt;3. Funktionen avtar sedan växer, alltså ett globalt minimum.</p>'+
 group(['C(3)=3+9/3','C(3)=3+3','C(3)=6'])+
 '<p><strong>Minsta värdet är 6 vid x=3.</strong></p>',1);
// Keep the custom inline fraction source where it is not part of a standalone equation.
const supers={'−':'⁻','+':'⁺','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','n':'ⁿ'};
const extract=el=>{
 const copy=el.cloneNode(true);
 copy.querySelectorAll('.frac').forEach(span=>{
  const a=span.querySelector('.num')?.textContent||'';
  const b=span.querySelector('.den')?.textContent||'';
  span.replaceWith(document.createTextNode(a+'/'+b));
 });
 copy.querySelectorAll('sup').forEach(span=>{
  span.replaceWith(document.createTextNode([...span.textContent].map(c=>supers[c]||c).join('')));
 });
 return copy.textContent.trim().replace(/\s+/g,' ');
};
let blocks=0,inline=0;
for(const element of document.querySelectorAll('.slide .eq,.slide .eq-sm')){
 if(element.closest('#book') && element.matches('.eq-sm'))continue; // Book exercise IDs must remain text, not subtraction.
 const content=extract(element);
 if(!content)continue;
 const small=element.matches('.eq-sm');
 M.setFormula(element,content,small?'inline':'block');
 small?inline++:blocks++;
}
if(blocks<75||inline<7)throw Error('Ma3c21 MathML coverage: '+blocks+' + '+inline);

// The extra graph is a verification tool, not an answer shortcut: only
// available after all four mathematical steps have been independently opened.
const evidenceSection=$('#fraction-solution [data-sequence]');
const graphButton=$('#fraction-solution [data-reveal="fraction-graph-wrap"]');
const graph=$('#fraction-graph-wrap');
const mathSteps=[...evidenceSection.querySelectorAll('[data-seq-item]')];
const syncGraph=()=>{
 const solved=mathSteps.every(e=>!e.classList.contains('hidden'));
 graphButton.disabled=!solved;
 graphButton.title=solved?'Visa kontrollgrafen':'Visa först alla fyra matematiska lösningssteg';
 if(!solved&&!graph.classList.contains('hidden')){
  graph.classList.add('hidden');
  graphButton.setAttribute('aria-expanded','false');
  graphButton.textContent='Visa grafen efter mitt matematiska bevis';
 }
};
new MutationObserver(syncGraph).observe(evidenceSection,{subtree:true,attributes:true,attributeFilter:['class']});
syncGraph();
document.documentElement.dataset.modelingExtremaMath='ready';
})();