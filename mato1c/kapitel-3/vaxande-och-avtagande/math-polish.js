/* Ma3c 24/41 · Växande och avtagande.
   Full paper-based algebra with preserved book/teacher/original interactivity.
   Pure local semantic MathML: no third-party services and no user data. */
(()=>{'use strict';
const M=window.Ma4Math;if(!M)throw Error('Ma3c24: local MathML engine missing');
const $=q=>document.querySelector(q);
const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const math=x=>'<p class="math">'+esc(x)+'</p>';
const group=items=>'<div class="solution-math-group">'+items.map(math).join('')+'</div>';
const worked=(id,index,content)=>{
 const items=[...document.querySelectorAll('#'+id+' [data-seq-item]')];
 if(!items[index])throw Error('Ma3c24: step '+id+'/'+index+' not found');
 items[index].innerHTML=content;
};
const originalTable=(id)=>{
 const table=$(id)?.querySelector('.sign-table');
 if(!table)throw Error('Ma3c24: original sign table missing '+id);
 return table.outerHTML;
};
// 03: display mathematical model and derivative independently.
// Derivative is visible, but the sign conclusion and numeric feedback remain hidden.
const target=$('#tangent .target-note');
if(!target)throw Error('Ma3c24: tangent model missing');
target.outerHTML='<div class="target-note"><strong>Modellen som ritar grafen och tangenten:</strong>'+
 group(['f(x)=0,5x³−1,5x+0,5','f′(x)=1,5x²−1,5'])+
 '<p>Flytta x: tangentens lutning och f′(x) ska alltid överensstämma.</p></div>';
const tf=$('#tangent-feedback');
tf.innerHTML='<p>En positiv derivata betyder att grafen stiger när x ökar. En negativ derivata betyder att den sjunker.</p>'+
 group(['f′(x)>0','f′(x)<0','f′(x)=0'])+
 '<p>I ordning betyder det: <strong>växande</strong>, <strong>avtagande</strong> respektive <strong>horisontell tangent</strong>.</p>'+
 '<p>Här finns också det viktiga motexemplet som skiljer grafhöjd från tangentlutning:</p>'+
 group(['f(0)=0,5>0','f′(0)=−1,5<0'])+
 '<p>Funktionen är <strong>positiv</strong> vid x=0 men <strong>avtagande</strong> där. f(x) och f′(x) mäter olika saker.</p>';
// 04: a sign chart is a TABLE, not two glued-together strings with &nbsp;.
const sign=$('#sign-solution');
sign.innerHTML='<strong>Derivatans tecken och grafens beteende:</strong>'+
 '<table class="sign-table"><caption>Grafen från start och den interaktiva tangenten</caption>'+
 '<thead><tr><th scope="col">x</th><th scope="col">x&lt;−1</th><th scope="col">−1</th><th scope="col">−1&lt;x&lt;1</th><th scope="col">1</th><th scope="col">x&gt;1</th></tr></thead>'+
 '<tbody><tr><th scope="row">f′(x)</th><td class="pos">+</td><td>0</td><td class="neg">−</td><td>0</td><td class="pos">+</td></tr>'+
 '<tr><th scope="row">f(x)</th><td>↗</td><td>max</td><td>↘</td><td>min</td><td>↗</td></tr></tbody></table>'+
 '<p>Teckenväxlingen (+ till −) vid x=−1 ger en <strong>maximipunkt</strong>. (− till +) vid x=1 ger en <strong>minimipunkt</strong>.</p>'+
 '<p>Om vi vill hitta koordinaterna måste vi sätta in i <em>funktionen</em>, inte i derivatan:</p>'+
 group(['f(−1)=1,5','f(1)=−0,5'])+
 '<p>På hela reella tallinjen är det lokala extrempunkter – kubikfunktionen har inget största eller minsta funktionsvärde globalt.</p>'+
 '<p>Vi delar upp x-axeln efter <strong>derivatans nollställen</strong>, inte efter de x där f(x)=0.</p>';
// 05: every necessary algebraic step visible and separate. Last result only last click.
worked('example',0,'<strong>1 · Derivera</strong>'+
 group(['f(x)=6x−x²','(6x)′=6','(−x²)′=−2x','f′(x)=6−2x']));
worked('example',1,'<strong>2 · Hitta derivatans nollställe</strong>'+
 group(['f′(x)=0','6−2x=0','−2x=−6','x=3'])+
 '<p>Detta x delar tallinjen i två intervall där derivatans tecken ska prövas.</p>');
worked('example',2,'<strong>3 · Pröva båda sidor</strong>'+
 '<p>Välj ett värde <strong>före</strong> och ett <strong>efter</strong> x=3:</p>'+
 group(['f′(1)=6−2·1','f′(1)=4>0','f′(4)=6−2·4','f′(4)=−2<0'])+
 '<p>Eftersom f′ är linjär med exakt ett nollställe kan tecknet inte växla ytterligare i intervallen.</p>');
worked('example',3,'<strong>4 · Gör teckentabellen</strong>'+
 '<table class="sign-table"><caption>Från derivatans tecken till funktionens riktning</caption>'+
 '<tr><th scope="row">x</th><td>x&lt;3</td><td>3</td><td>x&gt;3</td></tr>'+
 '<tr><th scope="row">f′(x)</th><td class="pos">+</td><td>0</td><td class="neg">−</td></tr>'+
 '<tr><th scope="row">f(x)</th><td>↗</td><td>max</td><td>↘</td></tr></table>'+
 '<p>Derivatan ändrar tecken från positiv till negativ vid x=3.</p>');
worked('example',4,'<strong>5 · Svara och kontrollera maximumets höjd</strong>'+
 '<p>Funktionen är <strong>växande</strong> på x≤3 och <strong>avtagande</strong> på x≥3. Den gemensamma ändpunkten ingår, även om derivatan där är 0.</p>'+
 '<p>För att hitta maximipunktens y-koordinat sätts x=3 i <strong>f</strong>:</p>'+
 group(['f(3)=6·3−3²','f(3)=18−9','f(3)=9'])+
 '<p>Maximipunkten är <strong>(3, 9)</strong>. Derivatans tecken är positivt före 3 och negativt efter 3, alltså är detta också funktionens globala maximum på hela reella tallinjen.</p>');
// 06: independent paper exercise receives an answer, not another long presentation.
// Preserve originally scripted quiz inputs, feedback and on-demand hint.
const own=$('#own-solution');
own.innerHTML='<strong>Härledning från elevens egen beräkning:</strong>'+
 group(['f(x)=3x²−12x','f′(x)=6x−12','6x−12=0','6x=12','x=2'])+
 '<p>Tecken före och efter derivatans enda nollställe:</p>'+
 group(['f′(0)=6·0−12','f′(0)=−12<0','f′(3)=6·3−12','f′(3)=6>0'])+
 '<table class="sign-table"><caption>Eget försök – kontrollera varje steg mot tecknen</caption>'+
 '<tr><th scope="row">x</th><td>x&lt;2</td><td>2</td><td>x&gt;2</td></tr>'+
 '<tr><th scope="row">f′(x)</th><td class="neg">−</td><td>0</td><td class="pos">+</td></tr>'+
 '<tr><th scope="row">f(x)</th><td>↘</td><td>min</td><td>↗</td></tr></table>'+
 '<p><strong>Avtagande</strong> när x≤2 och <strong>växande</strong> när x≥2. Nollstället x=2 kan ingå i båda slutna monotoniintervallen.</p>'+
 '<p>Beräkna funktionens höjd i minimipunkten:</p>'+
 group(['f(2)=3·2²−12·2','f(2)=12−24','f(2)=−12'])+
 '<p>Det finns ett <strong>globalt minimum i (2, −12)</strong>, eftersom derivatan är negativ före 2 och positiv efter 2. Extra: skissa själv en graf som överensstämmer med detta.</p>';
// 07: stationary point is not equivalent to a maximum or minimum.
const opt=$('#exception .math-big');
opt.outerHTML='<div class="math-givens">'+['g(x)=x³','g′(x)=3x²','g′(0)=0'].map(math).join('')+'</div>';
const except=$('#exception-solution');
except.innerHTML='<p>Derivatan är <strong>positiv för varje x utom x=0</strong>. Pröva exempelvis:</p>'+
 group(['g′(−1)=3·(−1)²','g′(−1)=3>0','g′(0)=0','g′(1)=3·1²','g′(1)=3>0'])+
 '<table class="sign-table"><caption>Tecknen ändras inte vid den stationära punkten</caption>'+
 '<tr><th scope="row">x</th><td>x&lt;0</td><td>0</td><td>x&gt;0</td></tr>'+
 '<tr><th scope="row">g′(x)</th><td class="pos">+</td><td>0</td><td class="pos">+</td></tr>'+
 '<tr><th scope="row">g(x)</th><td>↗</td><td>horisontell tangent</td><td>↗</td></tr></table>'+
 '<p>Grafen är fortsatt växande och har <strong>ingen maximipunkt eller minimipunkt</strong> vid x=0. Punkten (0,0) är en <strong>terrasspunkt</strong>: en stationär inflexionspunkt med horisontell tangent.</p>';
// 09: preserve individual exit (no automatic chart), fully worked answer after user chooses.
const exit=$('#exit-answer');
exit.innerHTML='<p>Bestäm först derivatans nollställe:</p>'+
 group(['f′(x)=4−2x','4−2x=0','−2x=−4','x=2'])+
 '<p>Pröva derivatans tecken på vardera sidan:</p>'+
 group(['f′(0)=4−2·0','f′(0)=4>0','f′(3)=4−2·3','f′(3)=−2<0'])+
 '<table class="sign-table"><caption>Egen utcheckning – teckentabell</caption>'+
 '<tr><th scope="row">x</th><td>x&lt;2</td><td>2</td><td>x&gt;2</td></tr>'+
 '<tr><th scope="row">f′(x)</th><td class="pos">+</td><td>0</td><td class="neg">−</td></tr>'+
 '<tr><th scope="row">f(x)</th><td>↗</td><td>max</td><td>↘</td></tr></table>'+
 '<p>Funktionen <strong>växer för x≤2</strong> och <strong>avtar för x≥2</strong>. Därför har den en <strong>maximipunkt med x-koordinaten 2</strong>.</p>'+
 '<p>Vi vet bara derivatan, inte ett funktionsvärde. Därför kan y-koordinaten <strong>inte bestämmas</strong>. Ett eventuellt tillagt konstantled ändrar höjden men inte derivatan.</p>'+
 '<p><strong>Extra:</strong> Ett nollställe till derivatan ger inte automatiskt en topp eller dal. För funktionen g nedan gäller:</p>'+
 group(['g(x)=x³','g′(x)=3x²','g′(0)=0'])+
 '<p>Derivatans tecken är positivt på båda sidor om 0, så (0,0) är en terrasspunkt utan extremvärde.</p>';
// 10: separate maths from explanatory prose in the three summary statements.
const summary=$('#summary .panel');
summary.innerHTML='<div class="math-result-panel">'+math('f′(x)>0')+
 '<p>Funktionen <strong>växer</strong> där derivatan är positiv.</p></div>'+
 '<div class="math-result-panel">'+math('f′(x)<0')+
 '<p>Funktionen <strong>avtar</strong> där derivatan är negativ.</p></div>'+
 '<div class="math-result-panel">'+math('f′(a)=0')+
 '<p>Tangenten är <strong>horisontell</strong> om derivatan finns och är noll – men det behöver <strong>inte</strong> vara en topp eller dal.</p></div>'+
 '<p><strong>För att avgöra extrema:</strong> pröva tecken på båda sidor om ett nollställe och dra slutsatsen först efter teckentabellen.</p>';
// All math – including the small inline symbols – is local readable MathML.
// Exercise IDs and labels are deliberately left as normal text.
let blocks=0,inline=0;
for(const el of document.querySelectorAll('.slide .math')){
 if(el.querySelector('math')||(el.closest('#book')&&!el.closest('#book-support')))continue;
 const raw=el.textContent.trim().replace(/\s+/g,' ');
 if(!raw)continue;
 const isInline=el.matches('span');
 M.setFormula(el,raw,isInline?'inline':'block');
 if(isInline)inline++;else blocks++;
}
if(blocks<55||inline<15)throw Error('Ma3c24: insufficient MathML '+blocks+'/'+inline);
// The bookwork scaffold is voluntary and closes when leaving the slide or
// switching presentation mode. It never replaces the original assignments.
const book=document.getElementById('book');
const support=document.getElementById('book-support');
if(!book||!support)throw Error('Ma3c growing: optional book support missing');
const supportLabel=support.querySelector('summary');
const syncSupport=()=>{supportLabel.textContent=support.open?
  'Dölj frivilligt metodstöd':'Visa frivilligt metodstöd – försök minnas först';};
support.addEventListener('toggle',syncSupport);
new MutationObserver(()=>{
 if(!book.classList.contains('active')&&support.open)support.open=false;
}).observe(book,{attributes:true,attributeFilter:['class']});
document.getElementById('mode').addEventListener('click',()=>{
 if(support.open)support.open=false;
});
syncSupport();
document.documentElement.dataset.growingMath='ready';
})();