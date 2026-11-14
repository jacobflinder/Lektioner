/* Ma3c 25/41 – extrempunkter och terrasspunkter.
   Source-faithful student sequence with complete algebra and valid
   stationary inflection reasoning. Local MathML, no external resources. */
(()=>{'use strict';
const M=window.Ma4Math;if(!M)throw Error('Ma3c25 local MathML engine missing');
const $=q=>document.querySelector(q);
const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const line=x=>'<p class="math">'+esc(x)+'</p>';
const group=xs=>'<div class="solution-math-group">'+xs.map(line).join('')+'</div>';
const step=(id,n,html)=>{
 const elements=[...document.querySelectorAll('#'+id+' [data-seq-item]')];
 if(!elements[n])throw Error('Ma3c25 missing sequence '+id+' '+n);
 elements[n].innerHTML=html;
};
const table=(head,values,dirs,labels)=>'<table class="sign-table"><caption>'+head+'</caption>'+
 '<thead><tr><th scope="col">x</th>'+values.map(x=>'<th scope="col">'+x+'</th>').join('')+'</tr></thead>'+
 '<tbody><tr><th scope="row">derivatan</th>'+dirs.map(x=>'<td>'+x+'</td>').join('')+'</tr>'+
 '<tr><th scope="row">funktionen</th>'+labels.map(x=>'<td>'+x+'</td>').join('')+'</tr></tbody></table>';
// 1. Graph cards: real mathematical names with math-inline, all three
// original function graphs and on-demand start feedback remain unchanged.
const cardNames=[['A','f(x)=x²'],['B','g(x)=−x²'],['C','h(x)=x³']];
const cards=[...document.querySelectorAll('#start .graph-card strong')];
if(cards.length!==3)throw Error('Ma3c25 start graph count changed');
for(let i=0;i<3;i++)cards[i].innerHTML=cardNames[i][0]+' · <span class="math-inline">'+cardNames[i][1]+'</span>';
const startAnswer=$('#start-answer');
startAnswer.innerHTML='<p><strong>A · minimipunkt:</strong> grafen går från att sjunka till att stiga. <strong>B · maximipunkt:</strong> från att stiga till att sjunka. <strong>C · terrasspunkt:</strong> fortsätter att stiga genom en horisontell tangent.</p>'+
 '<p>Alla tre är stationära vid x=0, men bara A och B är extrempunkter. I C byter grafen också <strong>böjningsriktning</strong>. Den egenskapen kan vi inte avgöra från enbart samma derivatatecken på båda sidor om noll.</p>';
// 2. Book-faithful goal / exceptional cases; preserve two independent
// recall controls and the explicitly separate stationarity vs value concept.
$('#goal h2').textContent='Tecknen visar extrempunkten – böjningen visar terrassen';
const coordinate=$('#goal .two .panel:nth-child(2)');
coordinate.innerHTML='<strong>En punkt har två koordinater</strong>'+
 group(['(a,f(a))','f′(a)=0'])+
 '<p>Den andra koordinaten är <strong>funktionsvärdet f(a)</strong>, inte derivatan f′(a), som här bara är tangentlutningen.</p>';
const recall=$('#recall-signs-answer');
recall.innerHTML='<p>Undersök ett x på varje sida om nollstället för f′:</p>'+
 group(['f′(x)=2x−4','f′(x)=0','2x−4=0','x=2','f′(1)=2·1−4=−2<0','f′(2)=0','f′(3)=2·3−4=2>0'])+
 '<p>Alltså avtar f på x≤2 och växer på x≥2. Punkten x=2 är stationär och ett lokalt minimum, men dess y-koordinat kan inte bestämmas utan något funktionsvärde.</p>';
// 3. Graph model preserved. Clarify that signs/turning can be inferred
// from f′ but terrace requires curvature evidence in a specific model.
const exploreNote=$('#explore >p.muted');
if(exploreNote)exploreNote.innerHTML='Kurvorna, tangentens ändpunkter och derivatavärdena beräknas från samma modell. <strong>Derivatans tecken</strong> visar om funktionen vänder eller fortsätter i samma riktning. För att säga <em>terrasspunkt</em> måste vi dessutom motivera ett böjningsbyte i just den valda funktionen. Reglaget ersätter inte algebra på papper.';
// 4. Full original five-click example. Independent factorization and
// root solutions, three explicit numerical probes, local not global extrema.
step('example',0,'<strong>1 · Derivera och faktorisera</strong>'+
 group(['f(x)=x³−3x+2','f′(x)=3x²−3','f′(x)=3(x²−1)','f′(x)=3(x−1)(x+1)'])+
 '<p>Vi använder skillnaden mellan två kvadrater för att hitta derivatans nollställen.</p>');
step('example',1,'<strong>2 · Bestäm stationära x-värden</strong>'+
 group(['f′(x)=0','3(x−1)(x+1)=0','x−1=0','x=1','x+1=0','x=−1'])+
 '<p>Vi får två kandidater. De behöver undersökas var för sig i teckentabellen.</p>');
step('example',2,'<strong>3 · Pröva derivatans tecken i tre intervall</strong>'+
 '<p>Välj testvärden från vänster, mitten och höger:</p>'+
 group(['f′(−2)=3·(−2)²−3','f′(−2)=12−3=9>0',
 'f′(0)=3·0²−3','f′(0)=−3<0',
 'f′(2)=3·2²−3','f′(2)=12−3=9>0'])+
 '<p>Eftersom derivatan bara har nollställena −1 och 1 kan tecknet inte ändras inuti intervallen.</p>');
step('example',3,'<strong>4 · Klassificera med teckenbyte</strong>'+
 table('Derivatans tecken före, i och efter båda stationära punkterna',
 ['x<−1','−1','−1<x<1','1','x>1'],['+','0','−','0','+'],['↗','max','↘','min','↗'])+
 '<p><strong>+ till −</strong> ger lokalt maximum vid x=−1. <strong>− till +</strong> ger lokalt minimum vid x=1. Grafen är en kubikfunktion: inga av dessa punkter är globala extrema på hela reella tallinjen.</p>');
step('example',4,'<strong>5 · Beräkna båda koordinaterna med ursprungsfunktionen</strong>'+
 group(['f(−1)=(−1)³−3(−1)+2','f(−1)=−1+3+2','f(−1)=4',
 'f(1)=1³−3·1+2','f(1)=1−3+2','f(1)=0'])+
 '<p><strong>Lokal maximipunkt (−1, 4)</strong> och <strong>lokal minimipunkt (1, 0)</strong>. Derivatans nollställen gav x-värdena; <strong>f</strong> gav y-värdena.</p>');
// 5. The original polynom example really DOES have an inflection point.
// Prove that from the derivative's monotonicity without importing the
// next lesson's full second-derivative method.
const terrace=$('#terrace-answer');
terrace.innerHTML='<strong>1 · Derivera och hitta den stationära punkten</strong>'+
 group(['f(x)=x³+2','f′(x)=3x²','f′(x)=0','3x²=0','x=0'])+
 '<strong>2 · Testa tecknen på båda sidor</strong>'+
 group(['f′(−1)=3·(−1)²=3>0','f′(0)=0','f′(1)=3·1²=3>0'])+
 table('Stationär punkt utan teckenbyte', ['x<0','0','x>0'],['+','0','+'],['↗','horisontell','↗'])+
 '<p>Funktionen fortsätter att växa: <strong>ingen maximi- eller minimipunkt</strong>.</p>'+
 '<strong>3 · Visa varför just denna punkt är en terrass</strong>'+
 '<p>För den här kubikfunktionen minskar tangenternas lutningar när x går från ett negativt värde mot 0, och ökar sedan när x går från 0 mot ett positivt värde. Detta följer av att <span class="math-inline">f′(x)=3x²</span> <strong>avtar för x<0 och växer för x>0</strong>. Kurvan byter därför böjning i x=0, samtidigt som tangenten är vågrät.</p>'+
 '<strong>4 · Beräkna punktens y-koordinat</strong>'+
 group(['f(0)=0³+2','f(0)=2'])+
 '<p><strong>Terrasspunkt (0, 2)</strong>. Den är stationär och har böjningsbyte men är inte ett extremum. Den allmänna andraderivatametoden kommer i nästa moment.</p>';
// 6. Paper-first task remains independent; only the requested feedback
// steps now show complete actual arithmetic, with local extrema language.
const own=$('#own-answer');
own.innerHTML='<strong>1 · Derivera och lös ekvationen</strong>'+
 group(['h(x)=−x³+3x','h′(x)=−3x²+3','h′(x)=−3(x²−1)','h′(x)=−3(x−1)(x+1)',
 'h′(x)=0','x−1=0','x=1','x+1=0','x=−1'])+
 '<strong>2 · Pröva tecknet i tre intervall</strong>'+
 group(['h′(−2)=−3·(−2)²+3','h′(−2)=−12+3=−9<0',
 'h′(0)=−3·0²+3','h′(0)=3>0',
 'h′(2)=−3·2²+3','h′(2)=−12+3=−9<0'])+
 table('Tecken ger en lokal minimipunkt och en lokal maximipunkt',
 ['x<−1','−1','−1<x<1','1','x>1'],['−','0','+','0','−'],['↘','min','↗','max','↘'])+
 '<strong>3 · Sätt in i själva funktionen</strong>'+
 group(['h(−1)=−(−1)³+3(−1)','h(−1)=1−3','h(−1)=−2',
 'h(1)=−1³+3·1','h(1)=−1+3','h(1)=2'])+
 '<p><strong>Minimipunkt (−1, −2)</strong> och <strong>maximipunkt (1, 2)</strong>, båda lokala. En kubikfunktion har ingen global maximi- eller minimipunkt på hela reella tallinjen.</p>'+
 '<p>Teckenväxlingen bestämmer <strong>typen</strong>; funktionsvärdet h(a) bestämmer <strong>höjden</strong>. Det är inte h′(a)=0 som ger y-koordinaten.</p>';
// 7. All original NOKflex task numbers and levels remain untouched.
// 8. Exit correctness: signs −0− alone do not prove bending. Preserve
// paper questions and the original goal box; give explicit numbered proof.
const exit=$('#exit-answer');
exit.innerHTML='<p><strong>1 · Tecken och koordinater</strong> Derivatan går från positiv till negativ vid x=2. Grafen vänder från stigande till sjunkande, alltså finns en <strong>lokal maximipunkt</strong>. Funktionsvärdet ges:</p>'+
 group(['f′(2)=0','f(2)=5'])+
 '<p><strong>Maximipunkt (2, 5)</strong>. Denna y-koordinat kommer från f(2), inte från derivatan.</p>'+
 '<p><strong>2 · Vad vet vi säkert om g?</strong> Teckenföljden − 0 − betyder att g avtar på båda sidor om x=−1. Punkten är stationär men inte en extrempunkt:</p>'+
 group(['g′(−1)=0','g(−1)=4'])+
 '<p><strong>Stationär punkt (−1, 4), ingen extrempunkt.</strong> Det <strong>följer inte säkert av enbart tecknen</strong> − 0 − att punkten är en terrasspunkt. Vi måste också visa att kurvan <strong>byter böjningsriktning</strong>. I våra polynomexempel gör vi den extra kontrollen.</p>'+
 '<p><strong>3 · Varför räcker inte f′(3)=0?</strong> Först krävs en teckenundersökning till vänster och höger om 3 för att avgöra om punkten är ett minimum. Sedan behöver vi ett funktionsvärde:</p>'+
 group(['f′(3)=0','f(3)=?'])+
 '<p>En horisontell tangent ger varken automatiskt minimipunkt eller punkten (3,0). Utan f(3) är höjden <strong>okänd</strong>.</p>';
// 9. Reinforce learning objectives without adding a new teaching topic.
const summary=$('#summary .panel');
summary.innerHTML='<div class="math-result-panel">'+group(['f′(a)=0','(a,f(a))'])+
 '<p>En <strong>stationär punkt</strong> har vågrät tangent. Den får sin andra koordinat från funktionsvärdet, inte från derivatan.</p></div>'+
 table('Teckenväxlingen ger den lokala punktens karaktär',
 ['vänster','i punkten','höger'],['+','0','−'],['↗','max','↘'])+
 '<p><strong>Minimipunkt:</strong> − 0 +, från sjunkande till stigande. <strong>Inget extremum:</strong> + 0 + eller − 0 −, utan teckenbyte. För att därutöver säga <strong>terrasspunkt</strong> behöver vi kontrollera att grafen byter böjning, vilket görs i kubikexemplet.</p>';
// Convert real formula nodes, not book exercise numbers. Preserve the
// accessible source expression as aria-label in MathML.
let blocks=0,inlines=0;
for(const el of document.querySelectorAll('.slide :is(p.math,p.solution-equation,span.math-inline)')){
 if(el.querySelector('math')||el.closest('#book'))continue;
 const raw=el.textContent.trim().replace(/\s+/g,' ');
 if(!raw)continue;
 const isInline=el.matches('span');
 M.setFormula(el,raw,isInline?'inline':'block');
 if(isInline)inlines++;else blocks++;
}
if(blocks<55||inlines<15)throw Error('Ma3c25 MathML coverage insufficient '+blocks+'/'+inlines);
document.documentElement.dataset.extremaMath='ready';
})();