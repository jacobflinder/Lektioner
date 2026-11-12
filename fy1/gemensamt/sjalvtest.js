/* Frivillig överföringsträning i Fysik 1. Inga elevsvar sparas eller skickas. */
(()=>{'use strict';
const data={
'coulombs-lag':{title:'8.1 Coulombs lag',first:'F₂/F₁ = (ny/gammal laddningsprodukt) · (gammalt/nytt avstånd)².',tasks:[
 ['En punktladdning fördubblas samtidigt som avståndet fördubblas. Vilken faktor får den elektriska kraftens storlek?','faktor',0.5,.000001,'Kraften är proportionell mot laddningen och omvänt proportionell mot avståndet i kvadrat.','2/(2²) = 0,5. Det är kraftens storlek; laddningstecknen avgör attraktion eller repulsion.'],
 ['Ett klot har laddningen −3,2 nC. Hur många elektroner ska ungefär tas bort för att klotet ska bli neutralt? Visa mellanled och svar med lämplig avrundning.','elektroner',2e10,.04,'Varje elektron har laddningens storlek 1,602·10⁻¹⁹ C.','N = (3,2·10⁻⁹)/(1,602·10⁻¹⁹) ≈ 2,0·10¹⁰. Elektroner ska tas bort eftersom klotet har överskott.']],
later:'Om båda laddningarna fördubblas och avståndet tredubblas, vilken faktor får kraftens storlek? Motivera.'},
'elektriska-kretsar':{title:'8.2 Elektriska kretsar',first:'Skriv laddningsbalansen i knutpunkten: 0,80 A = 0,30 A + 0,10 A + I₃.',tasks:[
 ['0,80 A går in i en knutpunkt och 0,30 A samt 0,10 A lämnar via två grenar. Hur stor ström lämnar via tredje grenen?','A',.4,.000001,'Strömmarna in är lika med strömmarna ut vid stationärt tillstånd.','I₃ = 0,80 − 0,30 − 0,10 = 0,40 A. Laddning förbrukas inte.'],
 ['En tråd görs tre gånger så lång och får dubbla diametern. Material och temperatur är oförändrade. Med vilken faktor förändras resistansen?','faktor',.75,.000001,'R = ρl/A och A är proportionell mot diametern i kvadrat.','Tre gånger längden ger faktor 3; dubbla diametern ger fyra gånger arean. Faktorn blir 3/4 = 0,75.']],
later:'Varför är strömmen lika stor före och efter en resistor i en oförgrenad likströmskrets? Skilj ström från spänning.'},
'serie-parallell':{title:'8.3 Serie- och parallellkoppling',first:'Resistanser i serie adderas: Rₑᵣₛ = 60 Ω + 140 Ω.',tasks:[
 ['En idealisk 12 V-källa driver 60 Ω och 140 Ω i serie. Hur stor ström går genom 60 Ω-resistorn?','A',.06,.000001,'Beräkna ersättningsresistansen och använd Ohms lag.','Rₑᵣₛ = 200 Ω. I = 12/200 = 0,060 A. Samma ström passerar båda.'],
 ['En 9 V-källa driver 90 Ω och 180 Ω parallellt. Hur stor är batteriets totala ström?','A',.15,.000001,'Samma spänning över båda. Räkna varje grenström och addera.','I₁ = 9/90 = 0,10 A och I₂ = 9/180 = 0,05 A. Totalt I = 0,15 A.']],
later:'Rita in en amperemeter och en voltmeter för en resistor. Förklara deras olika inkopplingar.'},
'effekt':{title:'8.4 Elektrisk effekt',first:'Börja med E = P·t och sätt in givna värden med enheter.',tasks:[
 ['En värmare har effekten 750 W och används i 12 s. Hur stor energi omvandlas?','J',9000,.000001,'Effekt är omvandlad energi per tid.','E = 750 W · 12 s = 9 000 J. Det är energi, inte temperatur.'],
 ['Ett batteri har ems 9,0 V, inre resistans 1,0 Ω och yttre resistans 2,0 Ω. Hur stor blir polspänningen?','V',6,.000001,'Beräkna först I = ℰ/(R+r), sedan U = RI.','I = 9/(2+1) = 3,0 A. U = RI = 2,0 Ω · 3,0 A = 6,0 V. Det inre spänningsfallet är 3,0 V.']],
later:'Varför blir värmeeffekten nio gånger större om strömmen tredubblas i samma resistor?'},
'elektriska-falt':{title:'8.5 Elektriska fält',first:'Börja med den riktade kraften F = qE, där höger är positiv riktning.',tasks:[
 ['Höger är positivt. En laddning q = −4,0 nC placeras i E = +3,0 kN/C. Beräkna kraften med tecken.','µN',-12,.000001,'F = qE. Minus betyder kraft åt vänster.','F = (−4,0·10⁻⁹ C)(+3,0·10³ N/C) = −12 µN. Kraften verkar åt vänster.'],
 ['Spänningen mellan två plattor är konstant men plattavståndet halveras. Med vilken faktor förändras elektronens accelerationsbelopp i den homogena modellen?','faktor',2,.000001,'E = U/d, F = qE och a = F/m.','Halverat d ger dubbelt fält. Kraftens och accelerationsbeloppet fördubblas om kanteffekter försummas.']],
later:'Varför ökar farten hos en elektron i ett homogent plattfält trots att kraften är konstant?'},
'potential':{title:'8.6 Potential',first:'Börja med I = 9,0 V/(1,0 Ω+2,0 Ω).',tasks:[
 ['En idealisk 9 V-källa driver 1,0 Ω och 2,0 Ω i serie. A är 0 V före batteriet, B efter batteriet och C efter 1,0 Ω. Vilken potential har C?','V',6,.000001,'I = 3,0 A. Batteriet höjer potentialen till 9 V och den första resistorn ger fallet RI.','V_C = 9,0 V − 1,0 Ω·3,0 A = +6,0 V.'],
 ['Samma krets: välj nu C som nollnivå utan att ändra kopplingen. Vilken potential får B?','V',3,.000001,'Subtrahera samma referens från alla potentialer. Skillnaden B−C ändras inte.','V_B − V_C = 9 − 6 = 3 V. Vid C = 0 V blir därför B = +3 V. Inga spänningsfall eller strömmar ändras.']],
later:'A har potentialen +5 V och B −2 V. Vad blir U_AB? Förändras skillnaden om båda potentialerna minskas med 10 V?'}
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const seg=location.pathname.split('/').filter(Boolean),slug=document.body.dataset.fy1Lesson||(seg.at(-1)==='index.html'?seg.at(-2):seg.at(-1));
const item=data[slug],toolbar=document.querySelector('.toolbar');if(!item||!toolbar)return;
const launch=document.createElement('button');launch.type='button';launch.id='fy1-traning-open';launch.textContent='Självtest';launch.setAttribute('aria-haspopup','dialog');launch.setAttribute('aria-controls','fy1-traning-dialog');toolbar.append(launch);
const dialog=document.createElement('dialog');dialog.className='fy1-traning-dialog';dialog.id='fy1-traning-dialog';dialog.setAttribute('aria-labelledby','fy1-traning-title');
dialog.innerHTML='<header class="fy1-traning-head"><div><small>Frivillig repetition · ny situation</small><h2 id="fy1-traning-title">'+esc(item.title)+' · Pröva själv</h2></div><button type="button" class="fy1-close" aria-label="Stäng självtest">Stäng ×</button></header><p class="fy1-traning-intro">Två nya uppgifter, skilda från Socrative och boken. <strong>Rita och räkna själv först.</strong> Begär stöd vid behov. Inga elevsvar sparas.</p><div class="fy1-tasks"></div><details class="fy1-next-time"><summary>Pröva minnet igen vid nästa lektion</summary><p>'+esc(item.later)+'</p><p>En lärarledd fråga för senare – ingen automatisk påminnelse.</p></details><footer class="fy1-traning-footer"><button type="button" class="fy1-reset-all">Börja om utan stöd</button><button type="button" class="fy1-close-bottom">Stäng</button></footer>';
document.body.append(dialog);
const numeric=s=>{const n=String(s).trim().replace(/[\s\u00a0\u202f]/g,'').replace('−','-').replace(',','.');return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(n)?Number(n):NaN};

const paperChecks = {
 'coulombs-lag': [
 {q:'Varför blir kraftens storlek hälften?',o:['Den fördubblade laddningen gör att den totala kraften alltid fördubblas.','Dubbla laddningen ger faktor 2, medan dubbla avståndet ger faktor 1/4. Tillsammans blir det faktor 1/2.','Dubbelt avstånd ger alltid halva kraften, oavsett laddningarna.'],c:1,f:['Coulombs lag beror även på avståndet. Du måste väga in r².','Rätt. Produkten av båda förändringarna ger 2/4 = 1/2.','Dubbelt avstånd ger en fjärdedel av kraften, inte hälften.'],why:'F är proportionell mot |Q₁Q₂|/r². Tecknen avgör attraktion eller repulsion, men inte kraftens storlek.'},
 {q:'Varför ska elektroner tas bort från klotet?',o:['Protoner har lämnat klotet och behöver ersättas.','Fler elektroner gör alltid ett föremål mer neutralt.','Klotets negativa nettoladdning betyder elektronöverskott.'],c:2,f:['Vid vanlig laddningsöverföring är det elektroner som flyttas, inte protoner mellan föremålen.','Tillförda elektroner skulle göra klotet mer negativt.','Rätt. Genom att ta bort elektroner minskar elektronöverskottet.'],why:'Ett negativt klot har fler elektroner än motsvarande positiva protonladdning. N = |Q|/e.'}
 ],
 'elektriska-kretsar': [
 {q:'Varför måste alla utgående grenströmmar tillsammans vara 0,80 A?',o:['Varje parallellgren får alltid en lika stor ström.','Laddning bevaras och ingen nettoladdning byggs upp i knutpunkten vid stationär ström.','Ström omvandlas till energi inne i knutpunkten.'],c:1,f:['Grenströmmar behöver inte vara lika; det är summan som måste stämma.','Rätt. Summan av strömmarna in och ut är lika stor.','Ström är laddningsflöde. Laddning förbrukas inte i knutpunkten.'],why:'Kirchhoffs första lag följer av laddningens bevarande i stationärt tillstånd.'},
 {q:'Varför är det fel att säga att dubbla diametern bara ger dubbla arean?',o:['Tvärsnittsarean är proportionell mot diameterns kvadrat: A ∝ d².','Tvärsnittsarean beror bara på hur lång tråden är.','Större diameter ger alltid större resistans.'],c:0,f:['Rätt. Dubbla diametern ger fyra gånger arean.','Längden påverkar resistansen, men tvärsnittsarean bestäms av diametern.','Större tvärsnitt minskar resistansen om material och längd är oförändrade.'],why:'A = πd²/4 och R = ρl/A. Här blir resistansfaktorn 3/4.'}
 ],
 'serie-parallell': [
 {q:'Varför är strömmen lika stor genom de två seriekopplade resistorerna?',o:['Resistorn med störst resistans förbrukar mest ström.','Strömmarna blir lika enbart för att batteriet är märkt 12 V.','Det finns ingen förgrening och laddning byggs inte upp i komponenterna vid stationär ström.'],c:2,f:['Resistorer omvandlar energi, men förbrukar inte laddning.','Samma ström följer av den oförgrenade strömvägen, inte av ett särskilt spänningsvärde.','Rätt. Samma laddningsflöde går genom varje del av seriekretsen.'],why:'I en oförgrenad seriekrets är I lika genom alla komponenter, även om spänningsfallen kan skilja sig.'},
 {q:'Varför blir strömmen större genom 90 Ω-grenen än genom 180 Ω-grenen?',o:['Resistorn med högre resistans drar också högre ström.','Grenarna har samma spänning; vid samma U ger lägre R större I.','Parallellkoppling kräver att strömmen är lika stor i alla grenar.'],c:1,f:['Vid samma spänning ger större resistans mindre ström enligt I = U/R.','Rätt. Grenströmmarna är 0,10 A respektive 0,050 A.','Parallellgrenar har samma spänning, men inte nödvändigtvis samma ström.'],why:'Grenströmmarna beror på respektive resistans och summeras till batteriets ström.'}
 ],
 'effekt': [
 {q:'Vilken förklaring skiljer effekt från energi?',o:['Effekt anger energiomvandling per sekund, medan energi också beror på hur länge en apparat är igång.','750 W betyder att värmaren alltid omvandlar totalt 750 J, oavsett tid.','En högre effekt anger direkt vattnets sluttemperatur.'],c:0,f:['Rätt. Vid konstant P ökar E proportionellt med t.','W betyder J/s, inte joule.','Sluttemperaturen beror även på vattenmassa, värmeförluster och energi.'],why:'P = E/t och E = Pt. Effekt beskriver takten, energi den totala omvandlingen.'},
 {q:'Varför blir polspänningen lägre än ems när batteriet levererar ström?',o:['Laddning förbrukas i den yttre resistorn.','Ems och polspänning måste alltid vara lika för ett riktigt batteri.','En del av ems går åt till spänningsfallet rI över batteriets inre resistans.'],c:2,f:['Laddning förbrukas inte; elektrisk energi omvandlas.','Vid belastning ger den inre resistansen ett spänningsfall.','Rätt. I batterimodellen gäller U = ℰ − rI.'],why:'I seriemodellen gäller ℰ = U + rI. Vid ökad belastning ökar I och därmed det inre spänningsfallet.'}
 ],
 'elektriska-falt': [{"q":"Varför pekar kraften åt vänster trots att E pekar åt höger?","o":["E pekar åt vänster när testladdningen är negativ.","Kraften på en negativ laddning är motsatt fältets riktning.","Kraften pekar alltid åt höger när E är positivt."],"c":1,"f":["Fältets riktning bestäms av kraften på en positiv testladdning, inte av den aktuella laddningens tecken.","Rätt. Eftersom q är negativt får F = qE motsatt tecken och riktning jämfört med E.","Laddningens tecken är avgörande: negativ q ger motsatt kraft mot E."],"why":"F = qE = (−4,0·10⁻⁹ C)(+3,0·10³ N/C) = −12 µN. Minustecknet anger kraft åt vänster; kraftens storlek är 12 µN.","steps":["Skriv värden med SI-enheter: q = −4,0·10⁻⁹ C och E = +3,0·10³ N/C.","Multiplicera tecken och tal: F = qE = −12·10⁻⁶ N.","Svar: F = −12 µN, alltså kraft åt vänster när höger är positiv riktning."]},{"q":"Vad händer med elektronens ökning av rörelseenergi när den färdas hela vägen mellan plattorna om U är oförändrad men d halveras?","o":["Den fördubblas eftersom accelerationen fördubblas.","Den halveras eftersom plattavståndet halveras.","Den är oförändrad eftersom arbetet över samma potentialskillnad är eU."],"c":2,"f":["Dubbelt a verkar över halva sträckan; jämför arbetet eU över samma spänning.","Starkare fält över kortare sträcka ger samma totala arbete vid oförändrad U.","Rätt. ΔK = eU är oförändrad trots att accelerationsbeloppet fördubblas."],"why":"För ett homogent fält gäller |E| = U/d, |F| = e|E|, a = |F|/m. Halverat d ger dubbelt a, men ΔK = eU mellan plattorna förblir samma vid oförändrad U.","steps":["Fältstyrkans belopp är |E| = U/d i den homogena idealmodellen.","När avståndet halveras fördubblas |E| och därmed kraftbeloppet |F| = e|E|.","a = |F|/m fördubblas: faktorn är 2. Energivinsten över hela spänningen är däremot eU."]}],
 'potential': [{"q":"Varför minskar potentialen när vi går genom en resistor i strömmens riktning?","o":["Resistorn har ett spänningsfall RI när elektrisk energi omvandlas.","Resistorn förbrukar ström, så potentialen måste minska.","Potentialen är lika på båda sidor av resistorn om strömmen är konstant."],"c":0,"f":["Rätt. I konventionell strömriktning är potentialfallet över en ohmsk resistor U = RI.","Ström förbrukas inte i en resistor, men elektrisk energi omvandlas.","Om U vore noll över en resistor med R > 0 skulle I = U/R bli noll."],"why":"Strömmen är 3,0 A, därför ger 1,0 Ω ett spänningsfall på 3,0 V. Från B på +9,0 V fås C på +6,0 V.","steps":["Rtot = 1,0 Ω + 2,0 Ω = 3,0 Ω, alltså I = 9,0 V/3,0 Ω = 3,0 A.","Batteriet höjer potentialen från A = 0 V till B = +9,0 V. Över 1,0 Ω faller potentialen 3,0 V.","Svar: C = +6,0 V. Kontroll: återstående resistor på 2,0 Ω ger 6,0 V fall tillbaka till A."]},{"q":"Vad händer när vi väljer C som potentialens nya nollnivå utan att ändra kopplingen?","o":["Det är som att dra en fysisk ledning från C till batteriet; strömmen ändras.","Alla potentialvärden förskjuts lika mycket, medan spänningsfall och strömmar är oförändrade.","Alla spänningsfall blir noll eftersom C nu är 0 V."],"c":1,"f":["Ett matematiskt referensbyte är inte en fysisk kortslutande förbindelse.","Rätt. Samma konstant subtraheras från alla potentialer; differenser och strömmar påverkas inte.","Nollpotential i en vald punkt innebär inte att spänningarna mellan olika punkter blir noll."],"why":"Från B = +9,0 V och C = +6,0 V till C = 0 V subtraheras 6,0 V från alla potentialer. Då blir B = +3,0 V, medan U_BC = 3,0 V fortfarande.","steps":["I ursprunglig referens: B = +9,0 V och C = +6,0 V.","Byt bara referens: subtrahera +6,0 V från samtliga potentialvärden.","Svar: B = +3,0 V när C = 0 V. Samma RI och samma ström gäller fortfarande."]}]
};
if(paperChecks[slug]){launch.textContent='Självtest · papper';dialog.querySelector('.fy1-reset-all').textContent='Återställ självtestet';}
function drawPaper() {
 const list=dialog.querySelector('.fy1-tasks'); list.replaceChildren();
 dialog.querySelector('.fy1-traning-intro').innerHTML='<strong>Räkna med penna och papper.</strong> Rita figur där det behövs, välj samband och visa mellanled och enheter. Jämför sedan lösningen stegvis och välj en fysikalisk förklaring. Inga svar sparas.';
 launch.textContent='Självtest · papper';
 item.tasks.forEach((t,i)=>{
   const info=paperChecks[slug][i],task=document.createElement('section');task.className='fy1-task fy1-paper-task';
   task.innerHTML='<h3>'+(i===0?'1 · Med startstöd':'2 · Räkna självständigt')+'</h3><p class="fy1-task-question">'+esc(t[0])+'</p>'
    +(i===0?'<p class="fy1-partial-solution"><strong>Första steget:</strong> '+esc(item.first)+'</p>':'')
    +'<p class="fy1-paper-instruction">Räkna klart på papper innan du öppnar lösningen.</p>'
    +'<button class="fy1-paper-step" type="button">Visa ett lösningssteg</button><ol class="fy1-paper-steps"></ol>'
    +'<button class="fy1-paper-done" type="button">Jag har räknat – visa begreppsfrågan</button>'
    +'<div class="fy1-paper-quiz" hidden><fieldset><legend>Förklara fysiken</legend><p>'+esc(info.q)+'</p>'
    +info.o.map((o,j)=>'<label><input type="radio" name="fy1-paper-'+i+'" value="'+j+'"><span>'+esc(o)+'</span></label>').join('')
    +'</fieldset><button class="fy1-paper-check" type="button">Kontrollera förklaringen</button><p class="fy1-paper-feedback" aria-live="polite">Välj först en förklaring och motivera den.</p>'
    +'<details class="fy1-paper-explain"><summary>Jämför med en fullständig fysikförklaring</summary><p>'+esc(info.why)+'</p></details></div>';
   const steps=task.querySelector('.fy1-paper-steps'),stepButton=task.querySelector('.fy1-paper-step');
   let step=0;const stages=info.steps||[t[4],t[5]];
   stepButton.onclick=()=>{if(step>=stages.length)return; const li=document.createElement('li');li.textContent=stages[step++];steps.appendChild(li);if(step>=stages.length){stepButton.disabled=true;stepButton.textContent='Lösningen är komplett';}};
   task.querySelector('.fy1-paper-done').onclick=()=>{const el=task.querySelector('.fy1-paper-quiz');el.hidden=false;task.querySelector('.fy1-paper-done').hidden=true;};
   const feedback=task.querySelector('.fy1-paper-feedback');
   task.querySelector('.fy1-paper-check').onclick=()=>{
      const chosen=task.querySelector('input[type=radio]:checked');
      if(!chosen){feedback.textContent='Välj ett resonemang först.';feedback.dataset.state='neutral';return;}
      const index=Number(chosen.value),good=index===info.c;
      feedback.textContent=info.f[index]+(good?' Förklara också med egna ord utifrån din papperslösning.':' Fundera igen och välj ett annat alternativ om du vill.');
      feedback.dataset.state=good?'correct':'incorrect';
   };
   list.appendChild(task);
 });
}

function draw(){if(paperChecks[slug]){drawPaper();return;}
 const root=dialog.querySelector('.fy1-tasks');root.replaceChildren();
 item.tasks.forEach((t,i)=>{
  const el=document.createElement('section');el.className='fy1-task';
  el.innerHTML='<h3>'+(i===0?'1 · Komplettera ett påbörjat exempel':'2 · Lös utan förhandsstöd')+'</h3><p class="fy1-task-question">'+esc(t[0])+'</p>'+(i===0?'<p class="fy1-partial-solution"><strong>Första steget:</strong> '+esc(item.first)+'</p>':'')+'<form class="fy1-task-form" novalidate><label for="fy1-answer-'+i+'">Ditt numeriska svar ('+esc(t[1])+')</label><div class="fy1-answer-row"><input id="fy1-answer-'+i+'" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="t.ex. 0,5 eller 2e10"><button type="submit">Kontrollera</button></div></form><button type="button" class="fy1-hint-trigger" aria-expanded="false">Jag vill ha en ledtråd</button><p class="fy1-hint" hidden>'+esc(t[4])+'</p><p class="fy1-task-feedback" aria-live="polite">Visa samband och enheter innan du kontrollerar.</p><button type="button" class="fy1-solution-trigger" hidden>Visa förklaringen</button><p class="fy1-solution" hidden>'+esc(t[5])+'</p>';
  const form=el.querySelector('form'),input=el.querySelector('input'),state=el.querySelector('.fy1-task-feedback'),hint=el.querySelector('.fy1-hint'),hintBtn=el.querySelector('.fy1-hint-trigger'),sol=el.querySelector('.fy1-solution'),solBtn=el.querySelector('.fy1-solution-trigger');
  hintBtn.onclick=()=>{hint.hidden=!hint.hidden;hintBtn.setAttribute('aria-expanded',String(!hint.hidden));hintBtn.textContent=hint.hidden?'Jag vill ha en ledtråd':'Dölj ledtråden'};
  form.onsubmit=e=>{e.preventDefault();const n=numeric(input.value);if(!Number.isFinite(n)){state.textContent='Skriv ett tal med eventuell decimal­komma eller e-notation.';state.dataset.state='neutral';return}
    if(Math.abs(n-t[2])<=Math.max(1e-10,Math.abs(t[2])*t[3])){state.textContent='Rätt. Motivera även sambandet och enheten.';state.dataset.state='ok';sol.hidden=false;solBtn.hidden=true}
    else{state.textContent='Inte riktigt. Kontrollera samband, riktning och enheter. Försök igen eller begär ledtråd.';state.dataset.state='try';solBtn.hidden=false}
  };
  solBtn.onclick=()=>{sol.hidden=!sol.hidden;solBtn.textContent=sol.hidden?'Visa förklaringen':'Dölj förklaringen'};
  root.append(el);
 });
}
function close(){if(dialog.open&&dialog.close)dialog.close();else dialog.removeAttribute('open')}
launch.onclick=()=>{draw();if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');dialog.querySelector(paperChecks[slug]?'.fy1-paper-step':'input')?.focus()};
dialog.querySelector('.fy1-close').onclick=close;dialog.querySelector('.fy1-close-bottom').onclick=close;
dialog.querySelector('.fy1-reset-all').onclick=()=>{draw();dialog.querySelector(paperChecks[slug]?'.fy1-paper-step':'input')?.focus()};
dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
})();