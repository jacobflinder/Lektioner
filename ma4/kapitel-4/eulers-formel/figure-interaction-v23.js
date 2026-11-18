/* Eulers formel · figur- och interaktionsgranskning v2.3.
   Ändrar inte ursprungliga femton steg, NOKflex, facitens timing eller lärarstöd. */
(()=>{'use strict';
const root=document.querySelector('.slide');
if(!root)throw new Error('Eulers lektionsbilder saknas');
const E=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const mi=s=>'<mi>'+E(s)+'</mi>';
const mn=s=>'<mn>'+E(s)+'</mn>';
const mo=s=>'<mo>'+E(s)+'</mo>';
const row=(...s)=>'<mrow>'+s.join('')+'</mrow>';
const frac=(a,b)=>'<mfrac>'+a+b+'</mfrac>';
const sup=(a,b)=>'<msup>'+a+b+'</msup>';
const π=mi('π'),i=mi('i'),v=mi('v'),r=mi('r');
const trig=(name,arg)=>row('<mi mathvariant="normal">'+name+'</mi>',mo('('),arg,mo(')'));
const exp=exponent=>sup(mi('e'),row(exponent));
const math=(xml,label)=>'<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline" aria-label="'+E(label)+'">'+row(xml)+'</math>';
const value=(xml,label)=>'<span class="euler-math-inline">'+math(xml,label)+'</span>';
const piOver2=frac(π,mn(2));
const minusPiOver2=row(mo('−'),piOver2);
const piExp=exp(row(i,π));
const negativeQuarter=value(minusPiOver2,'minus pi genom två');
const eiv=value(exp(row(i,v)),'e upphöjt till i gånger v');

// Alla tre quiz: elevsynliga samband typograferas matematiskt också efter fel svar.
const slides=[...document.querySelectorAll('.slide')];
function setChoices(slideNumber,items){
 const quiz=slides[slideNumber]?.querySelector('.quiz');
 if(!quiz)throw new Error('Quiz saknas på bild '+(slideNumber+1));
 const buttons=[...quiz.querySelectorAll('.choice')];
 if(buttons.length!==items.length)throw new Error('Fel antal svarsalternativ');
 items.forEach((item,n)=>{
  buttons[n].innerHTML=item.label;
  buttons[n].dataset.feedback=item.feedback;
 });
}
const cos120=trig('cos',row(mn(120),mo('°')));
const sin120=trig('sin',row(mn(120),mo('°')));
const cosMinus=value(row(cos120,mo('<'),mn(0)),'cosinus 120 grader är negativ');
const sinPlus=value(row(sin120,mo('>'),mn(0)),'sinus 120 grader är positiv');
setChoices(2,[
 {label:'A · Båda positiva',feedback:'Nej. Punkten ligger i andra kvadranten: '+cosMinus+' och '+sinPlus+'.'},
 {label:'B · Cosinus negativ, sinus positiv',feedback:'Rätt. Punkten ligger till vänster om imaginära axeln och ovanför reella axeln: '+cosMinus+', '+sinPlus+'.'},
 {label:'C · Cosinus positiv, sinus negativ',feedback:'Nej. Det skulle motsvara fjärde kvadranten. För 120° gäller '+cosMinus+' och '+sinPlus+'.'}
]);
const ePowerV=value(exp(v),'e upphöjt till v');
const rEuler=value(row(r,mo('·'),exp(row(i,v))),'r gånger e upphöjt till i gånger v');
const absExp=value(row(mo('|'),exp(row(i,v)),mo('|'),mo('='),mn(1)),'absolutbeloppet av e upphöjt till i v är ett');
const absZ=value(row(mo('|'),mi('z'),mo('|'),mo('='),r),'absolutbeloppet av z är r');
const ePi=value(row(piExp,mo('='),mo('−'),mn(1)),'e upphöjt till i pi är minus ett');
setChoices(5,[
 {label:'A · Beloppet är '+ePowerV+'.',feedback:'Nej. Den reella exponentialfunktionen och en imaginär exponent är olika saker. '+absExp+'; därför bestämmer faktorn '+value(r,'r')+' längden.'},
 {label:'B · Beloppet är '+value(r,'r')+' och ett argument är '+value(v,'v')+'.',feedback:'Rätt. '+eiv+' ligger på enhetscirkeln. Därför gäller '+absZ+' för '+rEuler+' när '+value(row(r,mo('>'),mn(0)),'r är positivt')+'.'},
 {label:'C · Talet är alltid rent imaginärt.',feedback:'Nej. '+eiv+' har i allmänhet både real- och imaginärdel; exempelvis gäller '+ePi+'.'}
]);
const minus3i=value(row(mo('−'),mn(3),i),'minus tre i');
const minus3=value(row(mo('−'),mn(3)),'minus tre');
const plus3i=value(row(mn(3),i),'tre i');
setChoices(8,[
 {label:'A · '+plus3i,feedback:'Det gäller vid en kvarts rotation moturs. '+negativeQuarter+' är en kvarts rotation medurs.'},
 {label:'B · '+minus3,feedback:'Denna punkt ligger på negativa realaxeln och motsvarar ett halvt varv. '+negativeQuarter+' är bara ett kvarts varv medurs.'},
 {label:'C · '+minus3i,feedback:'Rätt. Vinkeln '+negativeQuarter+' pekar nedåt; beloppet 3 ger '+minus3i+'.'}
]);
const coreCaveat=slides[5].querySelector('p.muted');
if(coreCaveat)coreCaveat.innerHTML='För '+value(row(mi('z'),mo('≠'),mn(0)),'z skilt från noll')+' gäller '+value(row(r,mo('='),mo('|'),mi('z'),mo('|'),mo('>'),mn(0)),'r lika med beloppet av z som är positivt')+'. Argument kan skilja med helt antal varv ('+value(row(mn(2),π),'två pi')+'). Talet 0 har inget bestämt argument.';

// Rekapitulera de metoder som redan behandlats, men lämna NOKflex-uppgifter olösta.
const work=slides[10];
const task=work?.querySelector('.task');
if(!task)throw new Error('Arbetsvyn saknar det ursprungliga bokarbetet');
const helper=document.createElement('aside');
helper.id='euler-practice-support';helper.className='euler-practice-support';
helper.setAttribute('aria-label','Valbart metodstöd till Eulers formel');
const method=(title,formula,label,comment)=>'<details class="euler-method"><summary>'+E(title)+'</summary><div class="euler-method-body"><div class="euler-formula">'+math(formula,label)+'</div><p>'+comment+'</p></div></details>';
helper.innerHTML='<h3>Behöver du ett samband?</h3><p>Försök återkalla metoden först. Öppna bara det stöd du behöver – inga NOKflex-facit visas här.</p><div class="euler-method-grid">'+
 method('1 · Eulers formel',row(exp(row(i,v)),mo('='),trig('cos',v),mo('+'),i,trig('sin',v)),'e upphöjt till i v är cosinus v plus i sinus v','Vinkeln v mäts i radianer. Talet på enhetscirkeln har belopp 1.')+
 method('2 · Skriv om till exponentialform',row(mi('z'),mo('='),r,exp(row(i,v))),'z lika med r gånger e upphöjt till i v','För ett komplext tal skilt från noll gäller '+value(row(r,mo('='),mo('|'),mi('z'),mo('|'),mo('>'),mn(0)),'r lika med absolutbeloppet av z större än noll')+'. Här är v ett argument. Noll har inget bestämt argument.')+
 method('3 · Multiplicera två tal',row('<msub>'+mi('z')+mn(1)+'</msub>','<msub>'+mi('z')+mn(2)+'</msub>',mo('='),'<msub>'+r+mn(1)+'</msub>','<msub>'+r+mn(2)+'</msub>',exp(row(i,mo('('),'<msub>'+v+mn(1)+'</msub>',mo('+'),'<msub>'+v+mn(2)+'</msub>',mo(')')))),'produkten har beloppet r ett gånger r två och argumentet v ett plus v två','Multiplicera beloppen och addera argumenten. Det gäller för positivt valda belopp.')+
 method('4 · Gå till rektangulär form',row(mi('a'),mo('='),r,trig('cos',v),mo(','),mi('b'),mo('='),r,trig('sin',v)),'a är r cosinus v och b är r sinus v','För '+value(row(mi('z'),mo('='),mi('a'),mo('+'),mi('b'),i),'z lika med a plus b i')+'. Kontrollera tecknen med punktens kvadrant eller axel.')+
 '</div>';
task.after(helper);

// I arbetet med 3e^(−iπ/2) behövs även det aktuella talet, inte enbart enhetscirkeln.
const negative=document.getElementById('negative');
const oldNegativeSvg=negative?.querySelector('svg');
if(!oldNegativeSvg)throw new Error('Negativa arguments bild saknas');
oldNegativeSvg.outerHTML=`<svg class="euler-actual-plane" viewBox="0 0 340 300" role="img" aria-label="Likskalig talplansfigur. Enhetscirkeln har radie ett. Talet minus tre i ligger tre enheter nedåt på imaginära axeln, vid punkten noll semikolon minus tre.">
 <path d="M25 150H322 M170 13V282" stroke="#738fa2" stroke-width="1.6"/>
 <circle cx="170" cy="150" r="35" fill="none" stroke="#8cb0bf" stroke-dasharray="5 4" stroke-width="1.4"/>
 <circle cx="170" cy="150" r="105" fill="none" stroke="#a4bdca" stroke-width="1.5"/>
 <path d="M170 150V255" stroke="#c16a30" stroke-width="4" stroke-linecap="round"/>
 <path d="M164 247L170 255L176 247" fill="none" stroke="#c16a30" stroke-width="3"/>
 <circle cx="170" cy="255" r="5" fill="#c16a30"/>
 <g stroke="#738fa2"><path d="M135 146V154 M205 146V154 M65 146V154 M275 146V154"/><path d="M166 115H174 M166 185H174 M166 45H174 M166 255H174"/></g>
 <g fill="#193c58" font-size="13"><text x="312" y="141">Re</text><text x="179" y="21">Im</text><text x="204" y="166">1</text><text x="128" y="166">−1</text><text x="270" y="166">3</text><text x="57" y="166">−3</text><text x="181" y="117">i</text><text x="180" y="189">−i</text><text x="183" y="49">3i</text><text x="183" y="260" font-weight="700" fill="#91411b">−3i</text><text x="178" y="163">0</text></g>
 <text x="221" y="83" fill="#486879" font-size="12">|z| = 3</text>
 </svg>`;
const caption=negative.querySelector('svg + p');
if(caption)caption.innerHTML='Streckad cirkel: belopp 1. Yttre cirkel och orange pil: belopp 3. Varje skalstreck är en enhet; slutpunkten är '+value(row(mo('('),mn(0),mo(';'),mo('−'),mn(3),mo(')')),'koordinaten noll semikolon minus tre')+'.';
const negativeSteps=negative.querySelectorAll('ol li');
if(negativeSteps.length===4){
 negativeSteps[1].innerHTML='Argumentet '+negativeQuarter+' betyder 90° <strong>medurs</strong>. Vi hamnar på negativa imaginära axeln.';
 negativeSteps[2].innerHTML='Enhetscirkeln ger '+value(row(trig('cos',minusPiOver2),mo('='),mn(0)),'cosinus minus pi genom två är noll')+' och '+value(row(trig('sin',minusPiOver2),mo('='),mo('−'),mn(1)),'sinus minus pi genom två är minus ett')+'.';
}
const negativeSlide=slides[8];
const negativeTask=negativeSlide.querySelector('.task');
const negativeQuiz=negativeSlide.querySelector('.quiz');
const negativeButton=negativeSlide.querySelector('[data-show="negative"]');
if(!negativeTask||!negativeQuiz||!negativeButton)throw new Error('Den negativa argumentövningens struktur ändrades');
const negativeLayout=document.createElement('div');negativeLayout.className='euler-negative-layout';
const negativeQuestion=document.createElement('div');negativeQuestion.className='euler-negative-question';
negativeTask.after(negativeLayout);
negativeLayout.append(negativeQuestion,negative);
negativeQuestion.append(negativeQuiz,negativeButton);

// Eulers identitet får en synlig efterbild med samma punkt som cos π = −1.
const identity=document.getElementById('final2');
const identityReason=identity?.querySelector('.ma4-step:nth-child(2)');
if(!identityReason)throw new Error('Eulers identitet saknar mellanled');
const compare=document.createElement('div');compare.className='euler-identity-compare';
identityReason.before(compare);compare.appendChild(identityReason);
compare.insertAdjacentHTML('beforeend',`<figure class="euler-identity-figure"><figcaption>Efter – en halv rotation på enhetscirkeln</figcaption>
 <svg viewBox="0 0 320 235" role="img" aria-label="Enhetscirkel i samma skala på båda axlarna. Vid vinkeln pi hamnar e upphöjt till i pi i punkten minus ett semikolon noll.">
 <path d="M18 121H307 M160 13V220" stroke="#70879a" stroke-width="1.5"/>
 <circle cx="160" cy="121" r="83" fill="none" stroke="#88b1c7" stroke-width="2"/>
 <path d="M160 121H77" stroke="#c16a30" stroke-width="4" stroke-linecap="round"/>
 <path d="M87 115L77 121L87 127" fill="none" stroke="#c16a30" stroke-width="3"/>
 <circle cx="77" cy="121" r="5" fill="#c16a30"/>
 <g fill="#193c58" font-size="13"><text x="286" y="112">Re</text><text x="171" y="20">Im</text><text x="241" y="139">1</text><text x="67" y="139">−1</text><text x="172" y="42">i</text><text x="172" y="209">−i</text><text x="168" y="139">0</text><text x="28" y="101" fill="#91411b" font-weight="700">(−1; 0)</text></g>
 </svg><p>Slutpunkten ligger på negativa realaxeln: samma punkt som det matematiska värdet −1.</p></figure>`);

// Förklaringsled i återkallningen och livevärden i reglaget får riktig MathML.
const recall=document.getElementById('recall')?.querySelector('p');
if(recall)recall.innerHTML='<strong>Beloppet '+value(r,'r')+'</strong> är avståndet från origo. <strong>Argumentet '+value(v,'v')+'</strong> är vinkeln från positiva reella axeln. Realdelen är '+value(row(r,trig('cos',v)),'r cosinus v')+' och imaginärdelen är '+value(row(r,trig('sin',v)),'r sinus v')+'.';
function angleValues(degrees,cos,sin){
 const f=n=>n.toFixed(3);
 const d=value(row(mn(String(degrees)),mo('°')),'vinkeln '+degrees+' grader');
 const c=value(row(trig('cos',row(mn(String(degrees)),mo('°'))),mo('≈'),mn(f(cos))),'cosinus '+degrees+' grader är ungefär '+f(cos));
 const s=value(row(trig('sin',row(mn(String(degrees)),mo('°'))),mo('≈'),mn(f(sin))),'sinus '+degrees+' grader är ungefär '+f(sin));
 return '<span class="euler-live-title">För '+d+'</span><span class="euler-live-values">'+c+s+'</span>';
}
function resetSlide(slide){
 if(!slide)return;
 slide.querySelectorAll('[data-show]').forEach(button=>{
  const target=document.getElementById(button.dataset.show);
  if(target)target.classList.add('hidden');
  if(button.dataset.initialText)button.textContent=button.dataset.initialText;
  button.setAttribute('aria-expanded','false');
 });
 slide.querySelectorAll('.quiz').forEach(quiz=>{
  quiz.querySelectorAll('.choice').forEach(button=>button.setAttribute('aria-pressed','false'));
  const submit=quiz.querySelector('.quiz-submit');if(submit)submit.disabled=true;
  const feedback=quiz.querySelector('.feedback');if(feedback){feedback.className='feedback hidden';feedback.replaceChildren();}
 });
 const final2=slide.querySelector('[data-show="final2"]');if(final2)final2.disabled=true;
 slide.querySelectorAll('#euler-practice-support details').forEach(d=>d.open=false);
}
window.EulerV23={angleValues,resetSlide};
})();
